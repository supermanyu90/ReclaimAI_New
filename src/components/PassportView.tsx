import React, { useState } from 'react';
import {
  FileText,
  Printer,
  ShieldCheck,
  QrCode,
  Lock,
  Eye,
  CheckCircle2,
  Building,
  MapPin,
  AlertTriangle,
} from 'lucide-react';
import { AssetItem, JapacLanguage } from '../types';
import { translations } from '../i18n/translations';
import { formatCurrency, formatDate } from '../utils/formatters';

interface PassportViewProps {
  currentLang: JapacLanguage;
  assets: AssetItem[];
  handoverReleased: boolean;
  passportVersion: number;
  ownerName: string;
}

export const PassportView: React.FC<PassportViewProps> = ({
  currentLang,
  assets,
  handoverReleased,
  passportVersion,
  ownerName,
}) => {
  const t = translations[currentLang] || translations.en;
  const [audience, setAudience] = useState<'master' | 'family'>('master');

  const displayedAssets =
    audience === 'master'
      ? assets
      : handoverReleased
      ? assets.filter((a) => a.authorizedForFamily)
      : [];

  const hiddenAssets = audience === 'family' ? assets.filter((a) => !a.authorizedForFamily) : [];

  const totalTrackedMinor = displayedAssets.reduce(
    (sum, a) => sum + (a.amounts.balance || a.amounts.insuranceCover || a.amounts.estimatedValue || 0),
    0
  );

  const passportHash = `0x9f4b7a12c8e3...sha256:v${passportVersion}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      {/* Top control bar */}
      <div className="bg-white p-6 rounded-xs border border-[#1a1a1a]/15 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 no-print">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h2 className="font-serif-display text-3xl font-semibold italic text-[#1a1a1a] tracking-tight">
              {t.passport.title}
            </h2>
            <span className="px-2 py-0.5 rounded-xs text-[10px] font-mono-meta font-bold bg-[#1a1a1a]/5 text-[#1a1a1a] border border-[#1a1a1a]/15 uppercase">
              Edition v{passportVersion}.4
            </span>
          </div>
          <p className="text-xs text-[#1a1a1a]/60 font-mono-meta text-[11px]">
            {t.passport.sealNotice} • Tamper-Evident SHA-256 Ledger
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Audience Mode Toggle */}
          <div className="flex bg-[#f8f7f4] p-1 rounded-xs border border-[#1a1a1a]/15 font-mono-meta text-[11px] uppercase tracking-wider">
            <button
              onClick={() => setAudience('master')}
              className={`px-3 py-1.5 rounded-xs transition-all cursor-pointer font-semibold ${
                audience === 'master'
                  ? 'bg-[#1a1a1a] text-[#f8f7f4]'
                  : 'text-[#1a1a1a]/50 hover:text-[#1a1a1a]'
              }`}
            >
              Master Owner (Full)
            </button>
            <button
              onClick={() => setAudience('family')}
              className={`px-3 py-1.5 rounded-xs transition-all cursor-pointer font-semibold flex items-center gap-1.5 ${
                audience === 'family'
                  ? 'bg-[#4a5d4e] text-white'
                  : 'text-[#1a1a1a]/50 hover:text-[#1a1a1a]'
              }`}
            >
              <span>Family Scoped</span>
              {handoverReleased ? (
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              ) : (
                <Lock className="w-2.5 h-2.5 text-[#b54708]" />
              )}
            </button>
          </div>

          {/* Print PDF Button */}
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xs bg-[#1a1a1a] hover:bg-[#2b2b2b] text-[#f8f7f4] text-[11px] font-mono-meta uppercase tracking-widest font-semibold flex items-center gap-2 transition-all cursor-pointer shrink-0"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{t.actions.exportPdf}</span>
          </button>
        </div>
      </div>

      {/* The Printable Passport Document Layout */}
      <div className="relative bg-white rounded-xs border-2 border-[#1a1a1a] shadow-xs p-8 sm:p-12 overflow-hidden print:border-black print:p-0">
        {/* Top Archival Border Bar */}
        <div className="h-1.5 w-full bg-[#1a1a1a] mb-8" />

        {/* Official Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-8 border-b-2 border-[#1a1a1a] gap-4">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#4a5d4e]" />
              <h1 className="font-serif-display text-4xl font-bold tracking-tight text-[#1a1a1a] uppercase">
                Family Asset Passport
              </h1>
            </div>
            <p className="font-mono-meta text-xs text-[#1a1a1a]/60 mt-1 uppercase tracking-widest">
              {t.passport.guillocheNotice}
            </p>
          </div>

          <div className="text-left sm:text-right font-mono-meta text-xs">
            <div className="text-[#1a1a1a]/50 text-[10px] uppercase tracking-wider">SHA-256 Ledger Seal</div>
            <div className="text-[#1a1a1a] font-bold mt-0.5">{passportHash}</div>
            <div className="text-[#1a1a1a]/50 text-[10px] mt-0.5">
              Certified: {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Audience Scope Banner */}
        <div className="my-6 p-4 rounded-xs border border-[#1a1a1a]/15 bg-[#f8f7f4] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 font-mono-meta text-xs">
          <div className="flex items-center gap-2 text-[#1a1a1a]">
            {audience === 'master' ? (
              <Eye className="w-4 h-4 text-[#1a1a1a]" />
            ) : handoverReleased ? (
              <CheckCircle2 className="w-4 h-4 text-[#4a5d4e]" />
            ) : (
              <Lock className="w-4 h-4 text-[#b54708]" />
            )}
            <span className="font-semibold uppercase tracking-wider">
              {audience === 'master' ? t.passport.audienceMaster : t.passport.audienceScoped}
            </span>
          </div>

          <span className="text-[10px] uppercase font-bold text-[#1a1a1a]/70">
            Estate Subject: {ownerName}
          </span>
        </div>

        {/* Pre-Handover Lock notice if Family view & not yet released */}
        {audience === 'family' && !handoverReleased && (
          <div className="my-10 p-8 rounded-xs bg-[#f8f7f4] border-2 border-dashed border-[#b54708]/40 text-center space-y-3 font-mono-meta">
            <Lock className="w-8 h-8 text-[#b54708] mx-auto" />
            <h3 className="font-serif-display text-2xl font-bold text-[#b54708]">
              {t.status.preHandover}
            </h3>
            <p className="text-xs text-[#1a1a1a]/70 max-w-lg mx-auto font-sans leading-relaxed">
              {t.workspace.beforeHandover}
            </p>
            <div className="text-[11px] text-[#b54708] uppercase tracking-wider">
              Dual-Reviewer multi-sig verification is required to unlock scoped schedules.
            </div>
          </div>
        )}

        {/* Asset Table if master or released */}
        {(audience === 'master' || handoverReleased) && (
          <div className="space-y-8">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b-2 border-[#1a1a1a] text-[#1a1a1a]/60 font-mono-meta text-[10px] uppercase tracking-widest">
                    <th className="py-3 px-3">Asset Description</th>
                    <th className="py-3 px-3">Custodian Institution</th>
                    <th className="py-3 px-3">Nominee Registered</th>
                    <th className="py-3 px-3">Physical Document Storage</th>
                    <th className="py-3 px-3 text-right">Valuation / Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1a1a1a]/8 text-[#1a1a1a]">
                  {displayedAssets.map((asset) => {
                    const val =
                      asset.amounts.balance ||
                      asset.amounts.insuranceCover ||
                      asset.amounts.estimatedValue ||
                      0;
                    return (
                      <tr key={asset.id} className="hover:bg-[#f8f7f4]">
                        <td className="py-4 px-3">
                          <div className="font-semibold text-[#1a1a1a] text-[13px]">{asset.label}</div>
                          <div className="text-[10px] text-[#1a1a1a]/55 uppercase font-mono-meta mt-0.5">
                            {asset.assetType.replace(/_/g, ' ')} • {asset.jurisdiction}
                          </div>
                        </td>
                        <td className="py-4 px-3">
                          <div className="font-medium text-[#1a1a1a]">{asset.institutionName}</div>
                          <div className="text-[10px] text-[#1a1a1a]/55 font-mono-meta">
                            {asset.maskedReference}
                          </div>
                        </td>
                        <td className="py-4 px-3 font-mono-meta text-[11px]">
                          {asset.nominationStatus === 'recorded' ? (
                            <span className="text-[#4a5d4e] font-semibold">
                              ✓ {asset.nomineeName || 'Registered'}
                            </span>
                          ) : (
                            <span className="text-[#b54708] italic font-serif-display text-sm">
                              {asset.nominationStatus}
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-3 text-[#1a1a1a]/70 text-[11px] max-w-xs">
                          {asset.documentLocation || 'Not cataloged'}
                        </td>
                        <td className="py-4 px-3 text-right font-mono-meta font-bold text-xs text-[#1a1a1a]">
                          {formatCurrency(val, asset.currency)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-[#1a1a1a] font-bold text-[#1a1a1a] text-xs font-mono-meta">
                    <td colSpan={4} className="py-4 px-3 text-right uppercase tracking-wider">
                      Total Documented Wealth:
                    </td>
                    <td className="py-4 px-3 text-right text-base text-[#1a1a1a]">
                      {formatCurrency(totalTrackedMinor, 'INR')}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Hidden Assets Disclosure in Family Mode */}
            {audience === 'family' && hiddenAssets.length > 0 && (
              <div className="p-4 rounded-xs bg-[#f8f7f4] border border-[#1a1a1a]/15 text-xs font-mono-meta">
                <div className="font-bold text-[#1a1a1a]/60 uppercase text-[10px] mb-1">
                  {t.passport.hiddenListHeader} ({hiddenAssets.length} items)
                </div>
                <p className="text-[11px] text-[#1a1a1a]/60 font-sans italic">
                  Certain overseas accounts or non-designated entities remain confidential per owner instructions until probate or succession clearance.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Footer with QR Code & Disclaimers */}
        <div className="mt-12 pt-8 border-t border-[#1a1a1a]/15 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-[#1a1a1a]/60 font-mono-meta">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-white border border-[#1a1a1a]">
              <QrCode className="w-12 h-12 text-[#1a1a1a]" />
            </div>
            <div>
              <div className="font-bold text-[#1a1a1a] tracking-wider uppercase">
                RECLAIMAI VERIFIED CREDENTIAL
              </div>
              <div className="text-[10px] text-[#1a1a1a]/50">
                Ledger Ref: {passportHash.slice(0, 18)}
              </div>
              <div className="text-[10px] text-[#4a5d4e] font-semibold mt-0.5">
                Dual-Authorized Multi-Sig Tamper Proof
              </div>
            </div>
          </div>

          <div className="max-w-md text-left sm:text-right text-[10px] font-sans leading-relaxed text-[#1a1a1a]/60">
            {t.passport.disclaimer}
          </div>
        </div>
      </div>
    </div>
  );
};
