import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Paperclip,
  CheckCircle2,
  FileText,
  ShieldCheck,
  Building,
  Coins,
  MapPin,
  UserCheck,
  ArrowRight,
} from 'lucide-react';
import { AssetItem, ChatMessage, JapacLanguage } from '../types';
import { translations } from '../i18n/translations';
import { SAMPLE_DOCUMENTS } from '../data/demoData';
import { formatCurrency, triggerConfetti } from '../utils/formatters';

interface LegacyChatProps {
  currentLang: JapacLanguage;
  onCommitAsset: (asset: AssetItem) => void;
  existingAssetsCount: number;
}

export const LegacyChat: React.FC<LegacyChatProps> = ({
  currentLang,
  onCommitAsset,
  existingAssetsCount,
}) => {
  const t = translations[currentLang] || translations.en;
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init-1',
      sender: 'assistant',
      text: t.chat.welcomeMsg,
      timestamp: '09:00 AM',
      suggestedActions: t.chat.suggestedPrompts,
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isProcessing]);

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isProcessing) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsProcessing(true);

    setTimeout(() => {
      generateExtractionResponse(text);
      setIsProcessing(false);
    }, 700);
  };

  const generateExtractionResponse = (userText: string) => {
    const lower = userText.toLowerCase();

    if (
      lower.includes('fd') ||
      lower.includes('fixed deposit') ||
      lower.includes('5 lakh') ||
      lower.includes('5,00,000') ||
      lower.includes('state bank') ||
      lower.includes('sagar')
    ) {
      const proposal: AssetItem = {
        id: `ast-chat-${Date.now()}`,
        label: 'Fixed Deposit (36 Months)',
        assetType: 'fixed_deposit',
        institutionName: 'Sagar Bharat Bank',
        jurisdiction: 'IN',
        maskedReference: '••••7730',
        currency: 'INR',
        amounts: { balance: 50000000 },
        sourceDate: '2026-10-10',
        verificationState: 'document_extracted',
        nominationStatus: 'recorded',
        nomineeName: 'Priya Shah (Registered)',
        documentLocation: 'Original Fixed Deposit Receipt in bedroom desk drawer',
        status: 'active',
        authorizedForFamily: true,
        evidence: [
          {
            field: 'balance',
            observed: 'Rs. 5,00,000.00',
            source: 'document',
            documentTitle: 'Sagar Bharat Bank FD Advice',
            confidence: 0.98,
          },
          {
            field: 'tenure',
            observed: '36 Months (Maturity 10 Oct 2029)',
            source: 'document',
            confidence: 0.96,
          },
          {
            field: 'nominee',
            observed: 'Priya Shah',
            source: 'document',
            confidence: 0.93,
          },
        ],
      };

      setMessages((prev) => [
        ...prev,
        {
          id: `msg-resp-${Date.now()}`,
          sender: 'assistant',
          text: `Parsed your statement. Extracted ₹5,00,000.00 Fixed Deposit at Sagar Bharat Bank with 36-month tenure and Priya Shah as registered nominee:`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          proposal,
        },
      ]);
      return;
    }

    if (
      userText.includes('三菱UFJ') ||
      userText.includes('定期預金') ||
      userText.includes('1,000万') ||
      userText.includes('1000万')
    ) {
      const proposal: AssetItem = {
        id: `ast-chat-jp-${Date.now()}`,
        label: '三菱UFJ銀行 定期預金 (3年定期)',
        assetType: 'fixed_deposit',
        institutionName: '三菱UFJ銀行 (MUFG Bank)',
        jurisdiction: 'JP',
        maskedReference: '••••9120',
        currency: 'JPY',
        amounts: { balance: 1000000000 },
        sourceDate: '2026-10-15',
        verificationState: 'document_extracted',
        nominationStatus: 'recorded',
        nomineeName: '田中 恵美 (妻)',
        documentLocation: '自宅書斎 金庫内 通帳ケース #2',
        status: 'active',
        authorizedForFamily: true,
        evidence: [
          {
            field: 'balance',
            observed: '¥10,000,000 (金利 0.25%)',
            source: 'document',
            documentTitle: '定期預金預り証',
            confidence: 0.97,
          },
        ],
      };

      setMessages((prev) => [
        ...prev,
        {
          id: `msg-resp-${Date.now()}`,
          sender: 'assistant',
          text: `三菱UFJ銀行の3年定期預金 (1,000万円) の記載事項を自動抽出しました。内容をご確認の上、台帳へ確定登録してください。`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          proposal,
        },
      ]);
      return;
    }

    // Default fallback
    const genericProposal: AssetItem = {
      id: `ast-chat-gen-${Date.now()}`,
      label: userText.slice(0, 32),
      assetType: 'savings',
      institutionName: 'Sagar Bharat Bank',
      jurisdiction: 'IN',
      maskedReference: `••••${Math.floor(1000 + Math.random() * 9000)}`,
      currency: 'INR',
      amounts: { balance: 15000000 },
      sourceDate: new Date().toISOString().split('T')[0],
      verificationState: 'manual_entry',
      nominationStatus: 'recorded',
      nomineeName: 'Priya Shah',
      documentLocation: 'Digital statement stored in encrypted home vault',
      status: 'active',
      authorizedForFamily: true,
      evidence: [
        {
          field: 'user_declaration',
          observed: userText,
          source: 'user_statement',
          confidence: 0.89,
        },
      ],
    };

    setMessages((prev) => [
      ...prev,
      {
        id: `msg-resp-${Date.now()}`,
        sender: 'assistant',
        text: `Extracted key asset details from your statement:`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        proposal: genericProposal,
      },
    ]);
  };

  const handleAttachReceipt = () => {
    const doc = SAMPLE_DOCUMENTS.fdReceipt;
    const userMsg: ChatMessage = {
      id: `msg-doc-${Date.now()}`,
      sender: 'user',
      text: `Uploaded evidence document: ${doc.fileName}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachment: {
        fileName: doc.fileName,
        fileType: 'text/plain (Financial Document)',
        sizeKb: 1.4,
        extractedSnippet: doc.content.split('\n').slice(0, 5).join('\n'),
      },
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsProcessing(true);

    setTimeout(() => {
      const proposal: AssetItem = {
        ...doc.extractedAsset,
        id: `ast-receipt-${Date.now()}`,
      };

      setMessages((prev) => [
        ...prev,
        {
          id: `msg-resp-doc-${Date.now()}`,
          sender: 'assistant',
          text: `Document AI completed OCR from "${doc.fileName}". Confirmed ₹5,00,000.00 Fixed Deposit with Sagar Bharat Bank, 36-month tenure, and Priya Shah registered as nominee.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          proposal,
        },
      ]);
      setIsProcessing(false);
    }, 800);
  };

  const handleConfirmProposal = (proposal: AssetItem) => {
    onCommitAsset(proposal);
    triggerConfetti();

    setMessages((prev) => [
      ...prev,
      {
        id: `msg-committed-${Date.now()}`,
        sender: 'system',
        text: `✅ ${t.chat.recordAddedNotice} [Asset ID: ${proposal.id} | ${proposal.label}]`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div className="flex flex-col h-[740px] bg-white rounded-xs border-2 border-[#1a1a1a] shadow-xs overflow-hidden">
      {/* Chat header */}
      <div className="px-6 py-4 bg-[#f8f7f4] border-b border-[#1a1a1a]/15 flex items-center justify-between">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <h3 className="font-serif-display text-2xl font-bold text-[#1a1a1a] tracking-tight">
              {t.chat.title}
            </h3>
            <span className="font-mono-meta text-[10px] uppercase px-2 py-0.5 border border-[#1a1a1a]/20 text-[#1a1a1a]">
              Gemini OCR
            </span>
          </div>
          <p className="font-mono-meta text-[11px] text-[#1a1a1a]/60">
            Natural Language Asset Extraction • Document Provenance • Immutable Commit
          </p>
        </div>

        <button
          onClick={handleAttachReceipt}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xs bg-white hover:bg-[#f0eee9] text-[11px] font-mono-meta text-[#1a1a1a] border border-[#1a1a1a] transition-all cursor-pointer font-semibold uppercase tracking-wider"
        >
          <Paperclip className="w-3.5 h-3.5 text-[#1a1a1a]" />
          <span>Upload Receipt (Simulated)</span>
        </button>
      </div>

      {/* Messages stream */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-[#faf9f6]">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          const isSystem = msg.sender === 'system';

          if (isSystem) {
            return (
              <div key={msg.id} className="flex justify-center my-2">
                <div className="px-4 py-2 rounded-xs bg-[#f0eee9] border border-[#1a1a1a]/30 text-[#1a1a1a] font-mono-meta text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#4a5d4e] shrink-0" />
                  <span>{msg.text}</span>
                </div>
              </div>
            );
          }

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-2xl ${
                isUser ? 'ml-auto' : 'mr-auto'
              }`}
            >
              {/* Message Bubble */}
              <div
                className={`rounded-xs p-4 text-xs leading-relaxed shadow-xs ${
                  isUser
                    ? 'bg-[#1a1a1a] text-[#f8f7f4]'
                    : 'bg-white text-[#1a1a1a] border border-[#1a1a1a]/15'
                }`}
              >
                {msg.attachment && (
                  <div className="mb-2 p-2.5 rounded-xs bg-[#f8f7f4] border border-[#1a1a1a]/10 text-[11px] text-[#1a1a1a]">
                    <div className="font-bold">{msg.attachment.fileName}</div>
                    <pre className="mt-1 text-[10px] font-mono-meta bg-white p-1.5 border border-[#1a1a1a]/10">
                      {msg.attachment.extractedSnippet}
                    </pre>
                  </div>
                )}

                <p className="font-sans text-[13px]">{msg.text}</p>
                <span className="block mt-1 text-[10px] font-mono-meta opacity-50 text-right">
                  {msg.timestamp}
                </span>
              </div>

              {/* Proposal Card if present */}
              {msg.proposal && (
                <div className="mt-4 w-full bg-white border-2 border-[#1a1a1a] rounded-xs p-5 shadow-xs text-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-[#1a1a1a]/10 pb-3">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#4a5d4e]" />
                      <span className="font-serif-display text-xl font-bold text-[#1a1a1a]">
                        {t.chat.proposalBadge}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-xs bg-[#f8f7f4] text-[#1a1a1a] border border-[#1a1a1a]/20 font-mono-meta text-[10px] uppercase font-bold">
                      Confidence: 98%
                    </span>
                  </div>

                  {/* Fields Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[#1a1a1a] font-mono-meta">
                    <div className="p-3 bg-[#f8f7f4] border border-[#1a1a1a]/10">
                      <div className="text-[10px] text-[#1a1a1a]/50 uppercase font-semibold">
                        Institution
                      </div>
                      <div className="font-bold text-xs mt-0.5 text-[#1a1a1a]">
                        {msg.proposal.institutionName}
                      </div>
                    </div>

                    <div className="p-3 bg-[#f8f7f4] border border-[#1a1a1a]/10">
                      <div className="text-[10px] text-[#1a1a1a]/50 uppercase font-semibold">
                        Valuation / Balance
                      </div>
                      <div className="font-bold text-xs mt-0.5 text-[#1a1a1a]">
                        {formatCurrency(msg.proposal.amounts.balance || 0, msg.proposal.currency)}
                      </div>
                    </div>

                    <div className="p-3 bg-[#f8f7f4] border border-[#1a1a1a]/10">
                      <div className="text-[10px] text-[#1a1a1a]/50 uppercase font-semibold">
                        Nomination Registered
                      </div>
                      <div className="font-bold text-xs mt-0.5 text-[#1a1a1a]">
                        {msg.proposal.nomineeName || 'Unregistered'}
                      </div>
                    </div>

                    <div className="p-3 bg-[#f8f7f4] border border-[#1a1a1a]/10">
                      <div className="text-[10px] text-[#1a1a1a]/50 uppercase font-semibold">
                        Physical Storage
                      </div>
                      <div className="font-medium text-xs mt-0.5 text-[#1a1a1a] truncate">
                        {msg.proposal.documentLocation || 'Not specified'}
                      </div>
                    </div>
                  </div>

                  {/* Confirmation Action */}
                  <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-[#1a1a1a]/10">
                    <span className="text-[11px] text-[#1a1a1a]/60 font-sans italic">
                      {t.chat.confirmPrompt}
                    </span>
                    <button
                      onClick={() => handleConfirmProposal(msg.proposal!)}
                      className="px-5 py-2.5 rounded-xs bg-[#1a1a1a] hover:bg-[#2b2b2b] text-[#f8f7f4] font-mono-meta font-bold text-[11px] uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2"
                    >
                      <span>{t.actions.confirmRecord}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Suggested Action Chips */}
              {msg.suggestedActions && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {msg.suggestedActions.map((promptText, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(promptText)}
                      className="px-3 py-1.5 rounded-xs bg-white hover:bg-[#f0eee9] border border-[#1a1a1a]/15 text-[11px] font-mono-meta text-[#1a1a1a]/80 hover:text-[#1a1a1a] transition-colors text-left cursor-pointer shadow-xs"
                    >
                      {promptText}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {isProcessing && (
          <div className="flex items-center gap-2 text-xs font-mono-meta text-[#1a1a1a]/70 bg-white p-3 rounded-xs border border-[#1a1a1a]/15 w-fit">
            <Sparkles className="w-4 h-4 text-[#4a5d4e] animate-spin" />
            <span>Analyzing text and extracting financial entities...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="p-4 bg-white border-t border-[#1a1a1a]/15">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={t.chat.placeholder}
            className="flex-1 bg-[#f8f7f4] border border-[#1a1a1a]/20 rounded-xs px-4 py-2.5 text-xs text-[#1a1a1a] placeholder-[#1a1a1a]/40 focus:outline-none focus:border-[#1a1a1a]"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isProcessing}
            className="p-2.5 rounded-xs bg-[#1a1a1a] hover:bg-[#2b2b2b] text-[#f8f7f4] disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
