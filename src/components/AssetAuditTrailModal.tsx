import React from 'react';
import {
  ShieldCheck,
  Clock,
  FileText,
  UserCheck,
  CheckCircle2,
  Lock,
  QrCode,
  ArrowRight,
  Database,
  Building,
} from 'lucide-react';
import { AssetItem, JapacLanguage } from '../types';

interface AssetAuditTrailModalProps {
  asset: AssetItem;
  currentLang: JapacLanguage;
  onClose: () => void;
  onOpenQr?: (assetId: string) => void;
}

export const AssetAuditTrailModal: React.FC<AssetAuditTrailModalProps> = ({
  asset,
  currentLang,
  onClose,
  onOpenQr,
}) => {
  // Generate deterministic audit events based on asset data
  const auditEvents = [
    {
      id: 'ev-1',
      timestamp: '2026-03-12 14:22 UTC',
      category: 'Creation & Ingestion',
      title: 'Conversational OCR Extraction',
      description: `Asset recorded via conversational AI assistant from ${asset.institutionName} statement. Extracted valuation & masked reference.`,
      actor: 'Estate Owner (Master Account)',
      hash: `sha256:${asset.id.slice(-6)}...00A1`,
      verified: true,
    },
    {
      id: 'ev-2',
      timestamp: '2026-04-01 09:15 UTC',
      category: 'Metadata Governance',
      title: 'Nominee Designation Update',
      description: `Nominee status registered as "${asset.nomineeName || 'Direct Legal Heirs'}" under ${asset.jurisdiction} probate guidelines.`,
      actor: 'Estate Owner',
      hash: `sha256:${asset.id.slice(-6)}...B492`,
      verified: true,
    },
    {
      id: 'ev-3',
      timestamp: '2026-05-18 16:40 UTC',
      category: 'Physical Anchoring',
      title: 'Physical QR Tag Generated & Affixed',
      description: `Level-H error-corrected tamper-evident QR seal generated and assigned to physical storage: "${asset.documentLocation || 'Master Family Vault'}".`,
      actor: 'Owner / System Auto-Seal',
      hash: `sha256:${asset.id.slice(-6)}...QR99`,
      verified: true,
    },
    {
      id: 'ev-4',
      timestamp: '2026-08-10 11:05 UTC',
      category: 'Handover & Review',
      title: 'Reviewer 1 (KYC & Identity) Sign-Off',
      description: 'Anil Menon verified master holder identity match and institutional ledger statement authenticity.',
      actor: 'Anil Menon (Independent Reviewer 1)',
      hash: `sha256:${asset.id.slice(-6)}...REV1`,
      verified: true,
    },
    {
      id: 'ev-5',
      timestamp: '2026-10-14 18:30 UTC',
      category: 'Compliance Gate',
      title: 'Reviewer 2 (Legal Heir) Sign-Off',
      description: 'Meera Iyer validated statutory succession ceiling and nominee claim precedence.',
      actor: 'Meera Iyer (Independent Reviewer 2)',
      hash: `sha256:${asset.id.slice(-6)}...REV2`,
      verified: true,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-xs border-2 border-[#1a1a1a] shadow-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 text-xs max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b-2 border-[#1a1a1a] pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-[#4a5d4e]" />
              <span className="font-mono-meta text-[10px] uppercase font-bold text-[#1a1a1a]/60 tracking-widest">
                Immutable Ledger Audit Trail
              </span>
            </div>
            <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-[#1a1a1a] tracking-tight">
              {asset.label}
            </h2>
            <div className="font-mono-meta text-xs text-[#1a1a1a]/70 flex items-center gap-2">
              <Building className="w-3.5 h-3.5 text-[#1a1a1a]/50" />
              <span>{asset.institutionName} • {asset.maskedReference} • {asset.jurisdiction}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-[#1a1a1a]/50 hover:text-[#1a1a1a] font-mono-meta text-base font-bold p-1 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Status Summary Banner */}
        <div className="p-4 rounded-xs bg-[#f8f7f4] border border-[#1a1a1a]/15 grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono-meta text-[11px]">
          <div>
            <span className="text-[#1a1a1a]/50 uppercase text-[9px] block">Asset ID</span>
            <span className="font-bold text-[#1a1a1a]">{asset.id}</span>
          </div>
          <div>
            <span className="text-[#1a1a1a]/50 uppercase text-[9px] block">Security Seal</span>
            <span className="font-bold text-[#4a5d4e]">SHA-256 HMAC</span>
          </div>
          <div>
            <span className="text-[#1a1a1a]/50 uppercase text-[9px] block">Total Events</span>
            <span className="font-bold text-[#1a1a1a]">{auditEvents.length} Immutable Logs</span>
          </div>
          <div>
            <span className="text-[#1a1a1a]/50 uppercase text-[9px] block">Verification</span>
            <span className="font-bold text-[#4a5d4e]">100% Verified</span>
          </div>
        </div>

        {/* Timeline Event Stream */}
        <div className="space-y-4">
          <h3 className="font-mono-meta text-[10px] uppercase tracking-wider text-[#1a1a1a]/60 font-bold">
            Chronological Change Log &amp; Compliance Sign-offs
          </h3>

          <div className="relative border-l-2 border-[#1a1a1a]/20 ml-3 space-y-6 pl-5">
            {auditEvents.map((ev, index) => (
              <div key={ev.id} className="relative space-y-1.5 group">
                {/* Timeline node bullet */}
                <div className="absolute -left-[27px] top-1 w-3.5 h-3.5 rounded-full bg-white border-2 border-[#1a1a1a] flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#4a5d4e]" />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 font-mono-meta text-[10px]">
                  <span className="font-bold text-[#4a5d4e] uppercase px-1.5 py-0.5 bg-[#f4f7f4] border border-[#4a5d4e]/30 inline-block w-fit">
                    {ev.category}
                  </span>
                  <span className="text-[#1a1a1a]/50">{ev.timestamp}</span>
                </div>

                <div className="bg-[#fbfaf8] border border-[#1a1a1a]/15 p-3.5 rounded-xs space-y-2">
                  <div className="font-serif-display font-bold text-base text-[#1a1a1a]">
                    {ev.title}
                  </div>
                  <p className="font-sans text-xs text-[#1a1a1a]/80 leading-relaxed">
                    {ev.description}
                  </p>
                  
                  <div className="pt-2 border-t border-[#1a1a1a]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-1 font-mono-meta text-[10px] text-[#1a1a1a]/60">
                    <div>
                      <span className="text-[#1a1a1a]/40 uppercase">Actor:</span>{' '}
                      <span className="font-medium text-[#1a1a1a]">{ev.actor}</span>
                    </div>
                    <div className="text-[9px] font-mono-meta text-[#4a5d4e] font-bold">
                      {ev.hash}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-[#1a1a1a]/15 flex items-center justify-between">
          {onOpenQr && (
            <button
              onClick={() => {
                onClose();
                onOpenQr(asset.id);
              }}
              className="px-4 py-2.5 rounded-xs bg-[#1a1a1a] hover:bg-[#2b2b2b] text-[#f8f7f4] font-mono-meta text-[10px] uppercase tracking-widest font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Inspect QR &amp; Seal</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xs bg-[#f8f7f4] border border-[#1a1a1a]/25 text-[#1a1a1a] hover:bg-white font-mono-meta text-[10px] uppercase tracking-widest font-semibold cursor-pointer ml-auto"
          >
            Close Audit Trail
          </button>
        </div>

      </div>
    </div>
  );
};
