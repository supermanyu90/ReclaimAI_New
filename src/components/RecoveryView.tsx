import React, { useState } from 'react';
import {
  Search,
  CheckCircle2,
  XCircle,
  Building,
  Info,
  ArrowRight,
} from 'lucide-react';
import { JapacLanguage } from '../types';
import { translations } from '../i18n/translations';
import { RECOVERY_REGISTRY_DATA } from '../data/demoData';
import { formatCurrency } from '../utils/formatters';

interface RecoveryViewProps {
  currentLang: JapacLanguage;
}

export const RecoveryView: React.FC<RecoveryViewProps> = ({ currentLang }) => {
  const t = translations[currentLang] || translations.en;
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = RECOVERY_REGISTRY_DATA.filter((item) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      item.holderName.toLowerCase().includes(q) ||
      item.institution.toLowerCase().includes(q) ||
      item.product.toLowerCase().includes(q) ||
      item.address.toLowerCase().includes(q)
    );
  });

  const matched = filtered.filter((i) => i.matchConfidence !== 'ruled_out');
  const ruledOut = filtered.filter((i) => i.matchConfidence === 'ruled_out');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xs border border-[#1a1a1a]/15 p-6 lg:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h2 className="font-serif-display text-3xl font-semibold italic text-[#1a1a1a] tracking-tight">
              {t.recovery.title}
            </h2>
            <span className="px-2 py-0.5 rounded-xs text-[10px] font-mono-meta font-bold bg-[#1a1a1a]/5 text-[#1a1a1a] border border-[#1a1a1a]/15 uppercase">
              Central Registry Finder
            </span>
          </div>
          <p className="text-xs text-[#1a1a1a]/60 font-mono-meta text-[11px]">
            {t.recovery.subtitle}
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-[#1a1a1a]/40 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t.recovery.searchPlaceholder}
            className="w-full bg-[#f8f7f4] border border-[#1a1a1a]/20 rounded-xs pl-9 pr-3 py-2 text-xs text-[#1a1a1a] placeholder-[#1a1a1a]/40 focus:outline-none focus:border-[#1a1a1a] font-mono-meta"
          />
        </div>
      </div>

      {/* Consent & Safety Note */}
      <div className="p-4 rounded-xs bg-[#f8f7f4] border border-[#1a1a1a]/15 text-xs text-[#1a1a1a] flex items-center justify-between font-mono-meta">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-[#1a1a1a]" />
          <span>{t.recovery.consentNotice}</span>
        </div>
        <span className="text-[10px] uppercase text-[#1a1a1a]/50">Read-Only Match</span>
      </div>

      {/* Matched Records */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#1a1a1a]/10 pb-2">
          <span className="font-mono-meta text-[10px] uppercase tracking-widest text-[#1a1a1a]/60">
            {t.recovery.matchedRecords} ({matched.length})
          </span>
          <span className="font-mono-meta text-xs font-bold text-[#4a5d4e]">
            Heuristic Algorithmic Index
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {matched.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-xs bg-white border border-[#1a1a1a]/15 shadow-xs space-y-4 text-xs"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-serif-display text-2xl font-bold text-[#1a1a1a]">
                      {item.holderName}
                    </h4>
                    <span className="px-2 py-0.5 rounded-xs text-[10px] font-mono-meta font-bold bg-[#f4f7f4] text-[#4a5d4e] border border-[#4a5d4e]/30">
                      {item.score}/100 Match
                    </span>
                  </div>
                  <div className="text-[11px] text-[#1a1a1a]/60 font-mono-meta flex items-center gap-1.5 mt-0.5">
                    <Building className="w-3 h-3 text-[#1a1a1a]/50" />
                    <span>{item.institution}</span>
                    <span>•</span>
                    <span>{item.accountRef}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-base font-mono-meta font-bold text-[#1a1a1a]">
                    {formatCurrency(item.amountMinor, item.currency)}
                  </div>
                  <div className="text-[10px] font-mono-meta text-[#1a1a1a]/50">{item.product}</div>
                </div>
              </div>

              <div className="p-3.5 rounded-xs bg-[#f8f7f4] border border-[#1a1a1a]/10 space-y-1.5 font-mono-meta text-[11px] text-[#1a1a1a]/80">
                <div className="flex justify-between">
                  <span className="text-[#1a1a1a]/50">Registered Address:</span>
                  <span className="text-right">{item.address}</span>
                </div>
                {item.dateOfBirth && (
                  <div className="flex justify-between">
                    <span className="text-[#1a1a1a]/50">Date of Birth:</span>
                    <span>{item.dateOfBirth}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-[#1a1a1a]/50">Registry Source:</span>
                  <span className="font-bold text-[#1a1a1a]">{item.registrySource}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 font-mono-meta text-[10px]">
                <span className="text-[#1a1a1a]/50">
                  Transferred: {item.transferredToRegistry}
                </span>
                <button
                  onClick={() => alert(`Generated claim inquiry template for ${item.institution} ref ${item.accountRef}.`)}
                  className="px-3.5 py-1.5 rounded-xs bg-[#1a1a1a] hover:bg-[#2b2b2b] text-[#f8f7f4] uppercase tracking-wider font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Draft Discovery</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ruled Out Records with transparent reasoning */}
      {ruledOut.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-[#1a1a1a]/10">
          <span className="font-mono-meta text-[10px] uppercase tracking-widest text-[#1a1a1a]/60 block">
            {t.recovery.ruledOutRecords} ({ruledOut.length})
          </span>

          <div className="space-y-2">
            {ruledOut.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xs bg-white border border-[#1a1a1a]/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold font-serif-display text-base text-[#1a1a1a]">{item.holderName}</span>
                    <span className="text-[9px] font-mono-meta px-1.5 py-0.2 rounded-xs bg-[#fdf6f0] text-[#b54708] border border-[#b54708]/30 uppercase">
                      Excluded ({item.score}/100)
                    </span>
                    <span className="text-[11px] font-mono-meta text-[#1a1a1a]/50">
                      {item.institution} ({item.accountRef})
                    </span>
                  </div>
                  <div className="text-[11px] text-[#b54708] mt-1 font-sans italic">
                    <strong>{t.recovery.ruleOutReason}:</strong> {item.exclusionReason}
                  </div>
                </div>

                <span className="font-mono-meta text-xs font-bold text-[#1a1a1a]/70 shrink-0">
                  {formatCurrency(item.amountMinor, item.currency)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="text-[10px] font-mono-meta text-[#1a1a1a]/50 italic pt-2">
        {t.recovery.disclaimer}
      </p>
    </div>
  );
};
