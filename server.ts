import express from 'express';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, LiveServerMessage, Modality, Type, FunctionDeclaration } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server, path: '/live' });

const PORT = 3000;

app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Function declaration for Live API tool calling
const createAssetRecordTool: FunctionDeclaration = {
  name: 'createAssetRecord',
  description: 'Create and record a new financial asset into the ReclaimAI ledger based on the user voice conversation.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      label: {
        type: Type.STRING,
        description: 'Descriptive title of the asset, e.g. "Mizuho 3-Year Time Deposit", "SBI 5 Lakh Fixed Deposit", "CPF Special Account"',
      },
      institutionName: {
        type: Type.STRING,
        description: 'Name of the bank, custodian, or government agency, e.g. "Mizuho Bank", "Sagar Bharat Bank", "DBS Bank"',
      },
      assetType: {
        type: Type.STRING,
        description: 'Type of asset: time_deposit, savings_account, cpf_retirement, demat_stocks, mutual_funds, real_estate, crypto_wallet, insurance_policy, gold_bullion, other',
      },
      currency: {
        type: Type.STRING,
        description: 'Currency code, e.g. INR, JPY, SGD, USD, HKD, KRW, AUD, IDR, THB, VND',
      },
      amount: {
        type: Type.NUMBER,
        description: 'Monetary value in major currency units (e.g. 500000 for 5 Lakhs, 1200000 for 1.2M JPY)',
      },
      maskedReference: {
        type: Type.STRING,
        description: 'Account or policy reference, e.g. "FD-9844-XX", "CPF-***4920"',
      },
      nomineeName: {
        type: Type.STRING,
        description: 'Nominee or beneficiary name assigned to this asset',
      },
      documentLocation: {
        type: Type.STRING,
        description: 'Physical or digital storage location of paper receipts, certificates, or agreements',
      },
      jurisdiction: {
        type: Type.STRING,
        description: 'Jurisdiction code: IN, JP, SG, KR, AU, HK, TH, ID, VN, US',
      },
    },
    required: ['label', 'institutionName', 'currency', 'amount'],
  },
};

// Status API
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    liveModel: 'gemini-3.8-live',
    apiKeyConfigured: Boolean(apiKey),
    timestamp: new Date().toISOString(),
  });
});

// WebSocket Live API connection
wss.on('connection', async (clientWs: WebSocket) => {
  console.log('[LiveAPI] Client connected to /live');

  if (!apiKey) {
    clientWs.send(
      JSON.stringify({
        error: 'GEMINI_API_KEY is not configured on the server.',
      })
    );
    clientWs.close();
    return;
  }

  let session: any = null;

  try {
    session = await ai.live.connect({
      model: 'gemini-3.8-live',
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            // 'Puck', 'Charon', 'Kore', 'Fenrir', 'Zephyr'
            prebuiltVoiceConfig: { voiceName: 'Zephyr' },
          },
        },
        systemInstruction:
          'You are the ReclaimAI Estate & Asset Voice Concierge. Your mission is to help users document, catalogue, and protect their financial legacy across JAPAC countries (India, Japan, Singapore, South Korea, Hong Kong, Australia, etc.) through natural, real-time voice conversations.\n\n' +
          'Users speak with you about their bank fixed deposits, savings accounts, CPF/EPF retirement funds, demat stock accounts, insurance policies, and physical gold or safes.\n' +
          'Be courteous, empathetic, and succinct. When the user tells you about an asset, acknowledge it warmly and IMMEDIATELY trigger the createAssetRecord tool so it gets recorded into their digital vault.\n' +
          'You support all JAPAC languages including English, Japanese (日本語), Hindi (हिंदी), Chinese (中文), Korean (한국어), Indonesian, Thai, and Vietnamese.',
        tools: [{ functionDeclarations: [createAssetRecordTool] }],
      },
      callbacks: {
        onmessage: (message: LiveServerMessage) => {
          // Model output audio chunk
          const audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
          if (audio && clientWs.readyState === WebSocket.OPEN) {
            clientWs.send(JSON.stringify({ audio }));
          }

          // Model transcription or text part
          const textPart = message.serverContent?.modelTurn?.parts?.find((p: any) => p.text);
          if (textPart?.text && clientWs.readyState === WebSocket.OPEN) {
            clientWs.send(JSON.stringify({ text: textPart.text }));
          }

          // User speech interruption
          if (message.serverContent?.interrupted && clientWs.readyState === WebSocket.OPEN) {
            clientWs.send(JSON.stringify({ interrupted: true }));
          }

          // Function/tool calls
          if (message.toolCall?.functionCalls) {
            for (const call of message.toolCall.functionCalls) {
              if (call.name === 'createAssetRecord') {
                const args = call.args;
                console.log('[LiveAPI] Tool call createAssetRecord:', args);
                if (clientWs.readyState === WebSocket.OPEN) {
                  clientWs.send(
                    JSON.stringify({
                      toolCall: {
                        id: call.id,
                        name: call.name,
                        args,
                      },
                    })
                  );
                }

                // Send tool response back to Gemini session
                try {
                  session.sendToolResponse({
                    functionResponses: [
                      {
                        id: call.id,
                        name: call.name,
                        response: {
                          output: {
                            success: true,
                            message: `Asset "${(args as any)?.label}" recorded successfully into ledger.`,
                          },
                        },
                      },
                    ],
                  });
                } catch (err) {
                  console.error('[LiveAPI] Error sending tool response:', err);
                }
              }
            }
          }
        },
      },
    });

    clientWs.send(JSON.stringify({ connected: true, model: 'gemini-3.8-live' }));
  } catch (err: any) {
    console.error('[LiveAPI] Failed to connect to Gemini Live API:', err);
    clientWs.send(
      JSON.stringify({
        error: `Failed to connect to Live API: ${err?.message || err}`,
      })
    );
    clientWs.close();
    return;
  }

  // Handle incoming messages from browser client
  clientWs.on('message', (data) => {
    try {
      const parsed = JSON.parse(data.toString());
      if (parsed.audio && session) {
        session.sendRealtimeInput({
          audio: { data: parsed.audio, mimeType: 'audio/pcm;rate=16000' },
        });
      } else if (parsed.text && session) {
        session.sendRealtimeInput({
          text: parsed.text,
        });
      }
    } catch (err) {
      console.error('[LiveAPI] Error processing client message:', err);
    }
  });

  clientWs.on('close', () => {
    console.log('[LiveAPI] Client disconnected');
    if (session) {
      try {
        session.close();
      } catch (e) {
        // cleanup
      }
    }
  });

  clientWs.on('error', (err) => {
    console.error('[LiveAPI] WebSocket error:', err);
  });
});

// Vite middleware in dev or static files in production
const isProduction = process.env.NODE_ENV === 'production';

async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`[ReclaimAI] Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
