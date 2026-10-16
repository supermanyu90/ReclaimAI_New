import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Radio,
  Sparkles,
  Volume2,
  VolumeX,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Building,
  Coins,
  MapPin,
  RefreshCw,
  Send,
  UserCheck,
  Activity,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { AssetItem, JapacLanguage } from '../types';
import { formatCurrency, triggerConfetti } from '../utils/formatters';

interface VoiceConciergeViewProps {
  currentLang: JapacLanguage;
  onRecordAsset: (asset: AssetItem) => Promise<void> | void;
  existingAssets: AssetItem[];
  ownerName: string;
  isCloudSynced: boolean;
}

export const VoiceConciergeView: React.FC<VoiceConciergeViewProps> = ({
  currentLang,
  onRecordAsset,
  existingAssets,
  ownerName,
  isCloudSynced,
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [sessionLogs, setSessionLogs] = useState<
    { sender: 'user' | 'model' | 'system' | 'tool'; text?: string; asset?: any; time: string }[]
  >([]);
  const [manualText, setManualText] = useState('');
  const [createdCount, setCreatedCount] = useState(0);

  // Audio references
  const wsRef = useRef<WebSocket | null>(null);
  const inputAudioCtxRef = useRef<AudioContext | null>(null);
  const outputAudioCtxRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const activeSourcesRef = useRef<AudioBufferSourceNode[]>([]);
  const isMutedRef = useRef(false);
  isMutedRef.current = isMuted;

  // Visualizer bars state
  const [visualizerLevels, setVisualizerLevels] = useState<number[]>([15, 20, 30, 45, 60, 45, 30, 20, 15]);

  // JAPAC Quick Voice Prompts
  const QUICK_PROMPTS = [
    {
      label: '🇮🇳 India Fixed Deposit',
      prompt: 'I have a 3-year Fixed Deposit of ₹5,00,000 in Sagar Bharat Bank, nominee Priya Patel.',
    },
    {
      label: '🇯🇵 Japan Mizuho TD',
      prompt: 'I opened a time deposit in Mizuho Bank for 1,200,000 Yen in Tokyo vault.',
    },
    {
      label: '🇸🇬 Singapore DBS Multiplier',
      prompt: 'Please add my DBS Multiplier savings account with balance of S$45,000.',
    },
    {
      label: '🇰🇷 Korea KB Gold Vault',
      prompt: 'I store 100g physical gold bullion in KB Kookmin safe deposit box.',
    },
  ];

  const addLog = (
    sender: 'user' | 'model' | 'system' | 'tool',
    text?: string,
    asset?: any
  ) => {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setSessionLogs((prev) => [...prev.slice(-30), { sender, text, asset, time }]);
  };

  // Convert Float32 audio to 16-bit PCM little-endian Base64
  const float32ToPcmBase64 = (float32Array: Float32Array): string => {
    const buffer = new ArrayBuffer(float32Array.length * 2);
    const view = new DataView(buffer);
    for (let i = 0; i < float32Array.length; i++) {
      const s = Math.max(-1, Math.min(1, float32Array[i]));
      view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    }
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  // Play 24kHz raw PCM chunks from Gemini 3.8 Live API
  const playRawPcmChunk = (base64Audio: string) => {
    try {
      if (!outputAudioCtxRef.current) {
        outputAudioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({
          sampleRate: 24000,
        });
      }
      const ctx = outputAudioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const binary = atob(base64Audio);
      const len = binary.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      const dataView = new DataView(bytes.buffer);
      const numSamples = Math.floor(len / 2);
      const audioBuffer = ctx.createBuffer(1, numSamples, 24000);
      const channelData = audioBuffer.getChannelData(0);

      for (let i = 0; i < numSamples; i++) {
        channelData[i] = dataView.getInt16(i * 2, true) / 32768.0;
      }

      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);

      const currentTime = ctx.currentTime;
      const startTime = Math.max(currentTime, nextStartTimeRef.current);
      source.start(startTime);
      nextStartTimeRef.current = startTime + audioBuffer.duration;

      activeSourcesRef.current.push(source);
      setIsAiSpeaking(true);

      source.onended = () => {
        activeSourcesRef.current = activeSourcesRef.current.filter((s) => s !== source);
        if (activeSourcesRef.current.length === 0) {
          setIsAiSpeaking(false);
        }
      };
    } catch (err) {
      console.error('Error playing raw PCM audio chunk:', err);
    }
  };

  const stopActiveAudioPlayback = () => {
    activeSourcesRef.current.forEach((s) => {
      try {
        s.stop();
      } catch (e) {
        // source may have finished
      }
    });
    activeSourcesRef.current = [];
    if (outputAudioCtxRef.current) {
      nextStartTimeRef.current = outputAudioCtxRef.current.currentTime;
    }
    setIsAiSpeaking(false);
  };

  const startLiveSession = async () => {
    try {
      setIsConnecting(true);
      setErrorMessage(null);

      // Connect to WebSocket /live
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/live`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = async () => {
        console.log('[VoiceConcierge] WebSocket connected');
        setIsConnected(true);
        setIsConnecting(false);
        addLog('system', 'Connected to Gemini 3.8 Live API voice session. Speak into your microphone.');

        // Initialize 16kHz microphone stream
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: {
              sampleRate: 16000,
              channelCount: 1,
              echoCancellation: true,
              noiseSuppression: true,
            },
          });
          mediaStreamRef.current = stream;

          const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({
            sampleRate: 16000,
          });
          inputAudioCtxRef.current = audioCtx;

          const source = audioCtx.createMediaStreamSource(stream);
          const processor = audioCtx.createScriptProcessor(4096, 1, 1);
          processorRef.current = processor;

          processor.onaudioprocess = (e) => {
            if (isMutedRef.current || ws.readyState !== WebSocket.OPEN) return;
            const inputData = e.inputBuffer.getChannelData(0);

            // Calculate simple audio level for equalizer animation
            let sum = 0;
            for (let i = 0; i < inputData.length; i += 32) {
              sum += Math.abs(inputData[i]);
            }
            const avg = sum / (inputData.length / 32);
            if (avg > 0.01) {
              setVisualizerLevels((prev) =>
                prev.map(() => Math.min(100, Math.max(10, Math.floor(avg * 400 + Math.random() * 20))))
              );
            }

            const pcmBase64 = float32ToPcmBase64(inputData);
            ws.send(JSON.stringify({ audio: pcmBase64 }));
          };

          source.connect(processor);
          processor.connect(audioCtx.destination);
        } catch (micErr: any) {
          console.warn('[VoiceConcierge] Microphone capture failed or denied:', micErr);
          addLog(
            'system',
            'Microphone access was denied or not available. You can still converse using the voice test prompts or text input below.'
          );
        }
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.error) {
            setErrorMessage(data.error);
            addLog('system', `Error: ${data.error}`);
            return;
          }

          if (data.interrupted) {
            stopActiveAudioPlayback();
            addLog('system', 'User spoke — playback interrupted.');
            return;
          }

          if (data.audio) {
            playRawPcmChunk(data.audio);
          }

          if (data.text) {
            addLog('model', data.text);
          }

          // Handle function calling tool call from gemini-3.8-live
          if (data.toolCall) {
            const { name, args } = data.toolCall;
            if (name === 'createAssetRecord') {
              handleCreateAssetFromVoice(args);
            }
          }
        } catch (parseErr) {
          console.error('Error parsing live WS message:', parseErr);
        }
      };

      ws.onerror = (err) => {
        console.error('[VoiceConcierge] WS Error:', err);
        setErrorMessage('WebSocket connection error. Make sure the development server is running.');
        setIsConnecting(false);
      };

      ws.onclose = () => {
        console.log('[VoiceConcierge] WS Closed');
        setIsConnected(false);
        setIsConnecting(false);
        stopAllAudio();
        addLog('system', 'Voice session ended.');
      };
    } catch (err: any) {
      console.error('[VoiceConcierge] Setup error:', err);
      setErrorMessage(err?.message || 'Failed to initialize voice session');
      setIsConnecting(false);
    }
  };

  const stopAllAudio = () => {
    stopActiveAudioPlayback();

    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (inputAudioCtxRef.current && inputAudioCtxRef.current.state !== 'closed') {
      inputAudioCtxRef.current.close();
      inputAudioCtxRef.current = null;
    }
  };

  const endLiveSession = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    stopAllAudio();
    setIsConnected(false);
  };

  const handleCreateAssetFromVoice = (args: any) => {
    const amountVal = Number(args.amount) ? Number(args.amount) * 100 : 10000000;

    const newAsset: AssetItem = {
      id: `ast_voice_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      label: args.label || 'Voice Recorded Asset',
      institutionName: args.institutionName || 'Private Bank',
      assetType: (args.assetType as any) || 'fixed_deposit',
      currency: (args.currency || 'INR').toUpperCase(),
      amounts: {
        balance: amountVal,
      },
      sourceDate: new Date().toISOString().split('T')[0],
      verificationState: 'manual_entry',
      nominationStatus: args.nomineeName ? 'recorded' : 'unregistered',
      maskedReference: args.maskedReference || `VR-${Math.floor(1000 + Math.random() * 9000)}-XX`,
      nomineeName: args.nomineeName || 'Direct Heirs',
      documentLocation: args.documentLocation || 'Master Document Safe',
      jurisdiction: (args.jurisdiction as any) || 'SG',
      status: 'active',
      evidence: [
        {
          field: 'Voice Declaration',
          observed: `Spoken via Gemini 3.8 Live API Concierge session by ${ownerName}`,
          source: 'user_statement',
          confidence: 0.98,
        },
      ],
      authorizedForFamily: true,
    };

    onRecordAsset(newAsset);
    setCreatedCount((c) => c + 1);
    triggerConfetti();

    addLog('tool', `Recorded new asset into ledger: ${newAsset.label}`, newAsset);
  };

  const sendTextMessage = (textToSend?: string) => {
    const text = textToSend || manualText;
    if (!text.trim()) return;

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ text }));
      addLog('user', text);
      setManualText('');
    } else {
      // If not connected, start session and then send text
      startLiveSession().then(() => {
        setTimeout(() => {
          if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({ text }));
            addLog('user', text);
            setManualText('');
          }
        }, 800);
      });
    }
  };

  useEffect(() => {
    return () => {
      endLiveSession();
    };
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="bg-white rounded-xs border-2 border-[#1a1a1a] p-6 lg:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-[#1a1a1a]/10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="font-serif-display text-3xl font-semibold italic text-[#1a1a1a]">
                Voice Concierge
              </h2>
              <span className="px-2.5 py-0.5 rounded-xs text-[10px] font-mono-meta font-bold bg-[#1a1a1a] text-[#f8f7f4] uppercase tracking-wider flex items-center gap-1.5">
                <Radio className="w-3 h-3 text-[#4a5d4e] animate-pulse" />
                Gemini 3.8 Live API
              </span>
              {isCloudSynced ? (
                <span className="px-2 py-0.5 rounded-xs text-[10px] font-mono-meta font-semibold bg-[#4a5d4e]/10 text-[#4a5d4e] border border-[#4a5d4e]/20">
                  ✓ Cloud Firestore Synced
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-xs text-[10px] font-mono-meta font-semibold bg-[#f0eee9] text-[#1a1a1a]/70 border border-[#1a1a1a]/15">
                  Local Ledger Mode
                </span>
              )}
            </div>
            <p className="text-xs text-[#1a1a1a]/60 font-mono-meta max-w-2xl">
              Create complete financial records hands-free using natural voice. Speak in English, Hindi,
              Japanese, Mandarin, or other JAPAC languages. The Gemini 3.8 Live model extracts
              institution, amount, nominee, and location in real-time.
            </p>
          </div>

          {/* Connect / Disconnect Action */}
          <div className="flex items-center gap-3">
            {!isConnected ? (
              <button
                onClick={startLiveSession}
                disabled={isConnecting}
                className="px-6 py-3 rounded-xs bg-[#1a1a1a] hover:bg-[#2b2b2b] text-[#f8f7f4] font-mono-meta text-xs uppercase tracking-widest font-semibold flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50 transition-all hover:scale-[1.02]"
              >
                {isConnecting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Connecting Live API...</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4 text-emerald-400" />
                    <span>Start Voice Session</span>
                  </>
                )}
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`p-3 rounded-xs border cursor-pointer transition-all ${
                    isMuted
                      ? 'bg-amber-50 border-amber-400 text-amber-800'
                      : 'bg-white border-[#1a1a1a]/20 text-[#1a1a1a] hover:bg-[#f8f7f4]'
                  }`}
                  title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
                >
                  {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-[#4a5d4e]" />}
                </button>
                <button
                  onClick={endLiveSession}
                  className="px-5 py-3 rounded-xs bg-red-700 hover:bg-red-800 text-white font-mono-meta text-xs uppercase tracking-widest font-semibold cursor-pointer transition-all"
                >
                  End Session
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Live Audio Spectrum Equalizer */}
        <div className="mt-6 p-6 rounded-xs bg-[#1a1a1a] text-[#f8f7f4] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                  isAiSpeaking
                    ? 'bg-emerald-500 shadow-[0_0_20px_#10b981]'
                    : isConnected
                    ? 'bg-[#2b2b2b] border border-white/20'
                    : 'bg-[#222]'
                }`}
              >
                {isAiSpeaking ? (
                  <Volume2 className="w-6 h-6 text-black animate-pulse" />
                ) : isConnected ? (
                  <Mic className="w-6 h-6 text-emerald-400" />
                ) : (
                  <Radio className="w-6 h-6 text-white/30" />
                )}
              </div>
              {isConnected && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-[#1a1a1a] animate-ping" />
              )}
            </div>

            <div>
              <div className="font-mono-meta text-xs uppercase tracking-widest text-[#f8f7f4]/60">
                Session Status:
              </div>
              <div className="font-serif-display text-xl font-bold text-white">
                {isConnecting
                  ? 'Connecting to Gemini 3.8 Live...'
                  : isAiSpeaking
                  ? 'Gemini 3.8 is Speaking (24kHz Audio)...'
                  : isConnected
                  ? isMuted
                    ? 'Microphone Muted'
                    : 'Listening... Speak about your assets'
                  : 'Ready to Connect'}
              </div>
            </div>
          </div>

          {/* Equalizer Frequency Bars */}
          <div className="flex items-center gap-1.5 h-12 px-4 py-2 bg-black/40 rounded-xs border border-white/10">
            {visualizerLevels.map((lvl, idx) => (
              <div
                key={idx}
                className="w-1.5 rounded-full transition-all duration-75"
                style={{
                  height: `${isConnected ? (isAiSpeaking ? Math.min(100, lvl * 1.5) : lvl) : 12}%`,
                  backgroundColor: isAiSpeaking ? '#10b981' : isConnected ? '#60a5fa' : '#555',
                }}
              />
            ))}
          </div>
        </div>

        {errorMessage && (
          <div className="mt-4 p-4 rounded-xs bg-red-50 border border-red-200 text-red-800 text-xs font-mono-meta flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {/* Main Grid: Interaction Stream + Quick Prompts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Real-time Transcript & Tool Call Cards */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-xs border border-[#1a1a1a]/15 p-6 shadow-xs min-h-[420px] flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-[#1a1a1a]/10 mb-4">
              <span className="font-mono-meta text-[11px] uppercase tracking-wider font-bold text-[#1a1a1a]/70 flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-[#4a5d4e]" />
                Live Conversation Log & Tool Invocations
              </span>
              <span className="font-mono-meta text-[10px] text-[#1a1a1a]/50">
                Created: <strong>{createdCount}</strong> assets this session
              </span>
            </div>

            {/* Scrollable Message History */}
            <div className="space-y-3.5 flex-1 overflow-y-auto max-h-[380px] pr-2">
              {sessionLogs.length === 0 ? (
                <div className="h-48 flex flex-col items-center justify-center text-center p-6 text-[#1a1a1a]/50 font-mono-meta text-xs space-y-2">
                  <Mic className="w-8 h-8 text-[#1a1a1a]/20" />
                  <p>Click "Start Voice Session" and talk naturally to register assets.</p>
                  <p className="text-[10px] text-[#1a1a1a]/40">
                    "I opened a ₹5,00,000 fixed deposit in Sagar Bharat Bank"
                  </p>
                </div>
              ) : (
                sessionLogs.map((log, idx) => {
                  if (log.sender === 'system') {
                    return (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xs bg-[#f8f7f4] border border-[#1a1a1a]/10 text-[11px] font-mono-meta text-[#1a1a1a]/70 flex items-center justify-between"
                      >
                        <span>{log.text}</span>
                        <span className="text-[9px] text-[#1a1a1a]/40">{log.time}</span>
                      </div>
                    );
                  }

                  if (log.sender === 'user') {
                    return (
                      <div key={idx} className="flex justify-end">
                        <div className="max-w-[80%] p-3.5 rounded-xs bg-[#1a1a1a] text-[#f8f7f4] text-xs font-sans space-y-1">
                          <div className="flex items-center justify-between gap-3 text-[9px] font-mono-meta text-[#f8f7f4]/60 uppercase">
                            <span>You (Voice Input)</span>
                            <span>{log.time}</span>
                          </div>
                          <p>{log.text}</p>
                        </div>
                      </div>
                    );
                  }

                  if (log.sender === 'tool' && log.asset) {
                    const ast = log.asset;
                    return (
                      <div
                        key={idx}
                        className="p-4 rounded-xs bg-emerald-50/70 border-2 border-[#4a5d4e] space-y-2 text-xs font-mono-meta"
                      >
                        <div className="flex items-center justify-between text-[#4a5d4e] font-bold">
                          <div className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-[#4a5d4e]" />
                            <span className="uppercase tracking-wider">
                              Tool Invocated: Asset Created Directly via Voice
                            </span>
                          </div>
                          <span className="text-[10px]">{log.time}</span>
                        </div>
                        <div className="p-3 bg-white rounded-xs border border-[#4a5d4e]/20 space-y-1 text-[#1a1a1a]">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-sm font-serif-display">{ast.label}</span>
                            <span className="font-bold text-[#4a5d4e]">
                              {formatCurrency(ast.amounts?.balance || ast.amounts?.estimatedValue || 0, ast.currency)}
                            </span>
                          </div>
                          <div className="text-[10px] text-[#1a1a1a]/60 flex items-center gap-2">
                            <span>{ast.institutionName}</span>
                            <span>•</span>
                            <span>Ref: {ast.maskedReference}</span>
                            <span>•</span>
                            <span>Nominee: {ast.nomineeName}</span>
                          </div>
                          <div className="text-[9px] text-[#4a5d4e] pt-1">
                            ✓ {isCloudSynced ? 'Persisted to Firestore cloud database' : 'Saved to local workspace'}
                          </div>
                        </div>
                      </div>
                    );
                  }

                  // Model message
                  return (
                    <div key={idx} className="flex justify-start">
                      <div className="max-w-[85%] p-3.5 rounded-xs bg-[#f8f7f4] border border-[#1a1a1a]/15 text-[#1a1a1a] text-xs font-sans space-y-1">
                        <div className="flex items-center justify-between gap-3 text-[9px] font-mono-meta text-[#1a1a1a]/50 uppercase">
                          <span className="flex items-center gap-1 font-bold text-[#4a5d4e]">
                            <Sparkles className="w-3 h-3" />
                            Gemini 3.8 Live Concierge
                          </span>
                          <span>{log.time}</span>
                        </div>
                        <p className="leading-relaxed">{log.text}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Bottom text input fallback */}
            <div className="pt-4 border-t border-[#1a1a1a]/10 flex gap-2">
              <input
                type="text"
                value={manualText}
                onChange={(e) => setManualText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendTextMessage()}
                placeholder="Or type a voice prompt (e.g. 'Add ₹5L fixed deposit in SBI for Ramesh Patel')..."
                className="flex-1 px-3.5 py-2.5 rounded-xs border border-[#1a1a1a]/20 text-xs font-mono-meta focus:outline-none focus:border-[#1a1a1a]"
              />
              <button
                onClick={() => sendTextMessage()}
                className="px-4 py-2.5 rounded-xs bg-[#1a1a1a] hover:bg-[#2b2b2b] text-[#f8f7f4] font-mono-meta text-xs uppercase font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Quick Voice Prompts & Live Vault Summary */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Prompts */}
          <div className="bg-white rounded-xs border border-[#1a1a1a]/15 p-6 shadow-xs space-y-3">
            <div className="font-mono-meta text-[11px] uppercase tracking-wider font-bold text-[#1a1a1a]">
              Suggested Voice Commands
            </div>
            <p className="text-[11px] text-[#1a1a1a]/60 font-mono-meta">
              Click any prompt to simulate speaking it to the Gemini 3.8 Live model:
            </p>

            <div className="space-y-2 pt-1">
              {QUICK_PROMPTS.map((qp, i) => (
                <button
                  key={i}
                  onClick={() => sendTextMessage(qp.prompt)}
                  className="w-full text-left p-3 rounded-xs bg-[#f8f7f4] border border-[#1a1a1a]/10 hover:border-[#1a1a1a] transition-all cursor-pointer text-xs font-mono-meta group"
                >
                  <div className="font-bold text-[#1a1a1a] group-hover:text-[#4a5d4e]">
                    {qp.label}
                  </div>
                  <div className="text-[10px] text-[#1a1a1a]/60 mt-1 italic">
                    "{qp.prompt}"
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Real-time Ledger Counter */}
          <div className="bg-[#f8f7f4] rounded-xs border border-[#1a1a1a]/15 p-6 space-y-3 font-mono-meta text-xs">
            <div className="text-[10px] uppercase tracking-widest text-[#1a1a1a]/50">
              Active Vault Portfolio
            </div>
            <div className="flex items-baseline justify-between">
              <span className="font-serif-display text-3xl font-bold text-[#1a1a1a]">
                {existingAssets.length} Assets
              </span>
              <span className="text-[10px] text-[#4a5d4e] font-bold">
                {isCloudSynced ? '● Cloud Synced' : '○ Local State'}
              </span>
            </div>
            <div className="text-[11px] text-[#1a1a1a]/60 pt-2 border-t border-[#1a1a1a]/10">
              Every asset created via voice conversation automatically appears across the Workspace,
              Family Asset Passport, and Physical QR Tag generator.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
