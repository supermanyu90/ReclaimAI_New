import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  Building,
  Coins,
  MapPin,
  CheckCircle2,
  Lock,
  Eye,
  Plus,
  Sparkles,
  ArrowRight,
  QrCode,
  FileText,
  Mic,
} from 'lucide-react';
import { AssetItem, GraphEdge, GraphNode, JapacLanguage } from '../types';
import { translations } from '../i18n/translations';
import { RelationshipGraph } from './RelationshipGraph';
import { AssetAuditTrailModal } from './AssetAuditTrailModal';
import { formatCurrency, formatDate } from '../utils/formatters';

interface WorkspaceViewProps {
  currentLang: JapacLanguage;
  assets: AssetItem[];
  nodes: GraphNode[];
  edges: GraphEdge[];
  onOpenChat: () => void;
  onOpenPassport: () => void;
  onOpenQr?: (assetId?: string) => void;
  onOpenVoice?: () => void;
  handoverReleased: boolean;
  searchQuery: string;
}

export const WorkspaceView: React.FC<WorkspaceViewProps> = ({
  currentLang,
  assets,
  nodes,
  edges,
  onOpenChat,
  onOpenPassport,
  onOpenQr,
  onOpenVoice,
  handoverReleased,
  searchQuery,
}) => {
  const t = translations[currentLang] || translations.en;
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedAsset, setSelectedAsset] = useState<AssetItem | null>(null);
  const [auditAsset, setAuditAsset] = useState<AssetItem | null>(null);

  const filteredAssets = assets.filter((a) => {
    const matchesType = filterType === 'all' || a.assetType === filterType;
    const matchesSearch =
      a.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.institutionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.sourceDate || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const totalWealth = assets.reduce(
    (sum, a) => sum + (a.amounts.balance || a.amounts.insuranceCover || a.amounts.estimatedValue || 0),
    0
  );

  // Automated risk assessment calculation based on handover governance rules
  const evaluateAssetRisk = (asset: AssetItem) => {
    let score = 0;
    const reasons: string[] = [];
    const isNomineeMissing =
      asset.nominationStatus === 'unregistered' ||
      asset.nominationStatus === 'unknown' ||
      !asset.nomineeName;
    const isDocLocationMissing = !asset.documentLocation || asset.documentLocation === 'Not cataloged';
    const isEvidenceMissing = !asset.evidence || asset.evidence.length === 0;
    const isCustodianMissing = !asset.institutionName || asset.institutionName.toLowerCase().includes('unknown');

    if (isNomineeMissing) {
      score += 45;
      reasons.push('Nomination unregistered');
    }
    if (isDocLocationMissing) {
      score += 30;
      reasons.push('Missing document location');
    }
    if (isEvidenceMissing) {
      score += 25;
      reasons.push('No verified evidence');
    }
    if (isCustodianMissing) {
      score += 30;
      reasons.push('Custodian details incomplete');
    }

    const level: 'high' | 'medium' | 'low' = score >= 50 ? 'high' : score >= 25 ? 'medium' : 'low';
    return { score, level, reasons };
  };

  const assetRisks = assets.map((a) => ({ asset: a, risk: evaluateAssetRisk(a) }));
  const highRiskCount = assetRisks.filter((r) => r.risk.level === 'high').length;
  const mediumRiskCount = assetRisks.filter((r) => r.risk.level === 'medium').length;

  const attentionItems = assets.filter(
    (a) =>
      a.nominationStatus === 'unregistered' ||
      a.nominationStatus === 'unknown' ||
      (a.sourceDate && a.sourceDate < '2024-01-01')
  );

  return (
    <div className="space-y-8">
      {/* Variation 3 Main Grid: Editorial Sidebar + Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Sidebar (Editorial Summary) */}
        <aside className="lg:col-span-4 bg-[#f8f7f4] border border-[#1a1a1a]/15 rounded-xs p-8 space-y-8 shadow-xs">
          {/* Headline & Big Num */}
          <div className="pb-6 border-b border-[#1a1a1a]/10 space-y-2">
            <h2 className="font-serif-display text-4xl lg:text-5xl font-semibold italic text-[#1a1a1a] tracking-tight leading-[0.95]">
              Estate Summary
            </h2>
            <div className="pt-4">
              <span className="font-mono-meta text-[11px] uppercase tracking-widest text-[#1a1a1a]/60 block mb-1">
                {t.workspace.trackedWealth}
              </span>
              <div className="font-serif-display text-4xl lg:text-[2.75rem] font-semibold text-[#1a1a1a] tracking-tight">
                {formatCurrency(totalWealth, 'INR')}
              </div>
            </div>
          </div>

          {/* Automated Risk Assessment Indicator Card */}
          <div className="pb-6 border-b border-[#1a1a1a]/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono-meta text-[10px] uppercase tracking-widest text-[#1a1a1a]/65 block font-bold">
                Automated Risk Assessment
              </span>
              <span
                className={`px-2 py-0.5 text-[9px] font-mono-meta font-bold uppercase rounded-xs ${
                  highRiskCount > 0
                    ? 'bg-amber-100 text-[#b54708] border border-amber-300'
                    : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                }`}
              >
                {highRiskCount > 0 ? `${highRiskCount} High Risk Assets` : 'Low Estate Risk'}
              </span>
            </div>
            <p className="text-xs text-[#1a1a1a]/80 leading-relaxed font-normal">
              Evaluated against 2-reviewer handover governance rules. {highRiskCount} assets lack sufficient nomination or document custody records.
            </p>
            <div className="grid grid-cols-2 gap-2 pt-1 font-mono-meta text-[11px]">
              <div className="p-2.5 bg-white border border-[#1a1a1a]/10 rounded-xs">
                <div className="text-[9px] uppercase text-[#b54708] font-bold">High Risk Gaps</div>
                <div className="text-lg font-serif-display font-bold text-[#b54708]">{highRiskCount}</div>
              </div>
              <div className="p-2.5 bg-white border border-[#1a1a1a]/10 rounded-xs">
                <div className="text-[9px] uppercase text-[#1a1a1a]/65 font-bold">Moderate / Verified</div>
                <div className="text-lg font-serif-display font-bold text-[#1a1a1a]">
                  {assets.length - highRiskCount}
                </div>
              </div>
            </div>
          </div>

          {/* Asset Distribution & Action */}
          <div className="pb-6 border-b border-[#1a1a1a]/10 space-y-3">
            <span className="font-mono-meta text-[10px] uppercase tracking-widest text-[#1a1a1a]/60 block">
              Asset Distribution &amp; Governance
            </span>
            <p className="text-xs text-[#1a1a1a]/80 leading-relaxed font-normal">
              {assets.length} recorded assets verified across JAPAC. {attentionItems.length} items currently require nomination verification or policy refresh.
            </p>
            <div className="pt-2 flex flex-col gap-2.5">
              {onOpenVoice && (
                <button
                  onClick={onOpenVoice}
                  className="w-full bg-[#1a1a1a] hover:bg-[#2b2b2b] text-[#f8f7f4] py-3 px-6 rounded-xs font-mono-meta text-xs uppercase tracking-widest font-semibold transition-all cursor-pointer shadow-xs flex items-center justify-center gap-2 group"
                >
                  <Mic className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
                  <span>Voice Concierge (Live 3.8)</span>
                </button>
              )}
              <button
                onClick={onOpenChat}
                className="w-full bg-white hover:bg-[#f0eee9] text-[#1a1a1a] border border-[#1a1a1a]/20 py-2.5 px-4 rounded-xs font-mono-meta text-[11px] uppercase tracking-widest font-semibold transition-all cursor-pointer shadow-xs flex items-center justify-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#4a5d4e]" />
                <span>Text Legacy Chat</span>
              </button>
              <button
                onClick={onOpenPassport}
                className="w-full bg-white hover:bg-[#f0eee9] text-[#1a1a1a] border border-[#1a1a1a]/20 py-2.5 px-4 rounded-xs font-mono-meta text-[11px] uppercase tracking-widest font-semibold transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <FileText className="w-3.5 h-3.5 text-[#1a1a1a]/70" />
                <span>View Asset Passport</span>
              </button>
            </div>
          </div>

          {/* Integrity Callout */}
          <div className="pt-1 space-y-2">
            <span className="font-mono-meta text-[10px] uppercase tracking-widest text-[#b54708] font-bold block flex items-center gap-1.5">
              <AlertTriangle className="w-3 h-3 text-[#b54708]" />
              <span>Estate Integrity Notification</span>
            </span>
            <p className="text-xs text-[#b54708] italic leading-relaxed">
              Term Life Policy nomination is listed as unknown; Kaveri Mutual Fund is unregistered. Update records with custodian institutions to prevent dispute.
            </p>
          </div>
        </aside>

        {/* Right Content Area (Clean White Table & Controls) */}
        <div className="lg:col-span-8 bg-white border border-[#1a1a1a]/15 rounded-xs p-6 lg:p-8 space-y-6 shadow-xs">
          {/* Top table metadata row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#1a1a1a]/10 gap-3">
            <div>
              <span className="font-mono-meta text-[10px] uppercase tracking-widest text-[#1a1a1a]/60">
                Family Asset Portfolio — Ledger v2.4
              </span>
              <h3 className="font-serif-display text-2xl font-semibold text-[#1a1a1a] tracking-tight mt-0.5">
                {t.workspace.title}
              </h3>
            </div>

            {/* Filter pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] font-mono-meta">
              {['all', 'savings', 'fixed_deposit', 'mutual_fund', 'insurance', 'pension_cpf'].map((typeKey) => (
                <button
                  key={typeKey}
                  onClick={() => setFilterType(typeKey)}
                  className={`px-2.5 py-1 rounded-xs uppercase tracking-wider transition-colors cursor-pointer ${
                    filterType === typeKey
                      ? 'bg-[#1a1a1a] text-[#f8f7f4] font-semibold'
                      : 'bg-[#f8f7f4] text-[#1a1a1a]/60 hover:text-[#1a1a1a] border border-[#1a1a1a]/10'
                  }`}
                >
                  {typeKey.replace(/_/g, ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Clean Ruled Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-[#1a1a1a] text-[#1a1a1a]/60 font-mono-meta text-[10px] uppercase tracking-widest">
                  <th className="py-3 px-3 font-semibold">Asset Detail</th>
                  <th className="py-3 px-3 font-semibold">Region</th>
                  <th className="py-3 px-3 font-semibold">Nomination</th>
                  <th className="py-3 px-3 font-semibold">Risk Status</th>
                  <th className="py-3 px-3 text-right font-semibold">Valuation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a1a1a]/8 text-[#1a1a1a]">
                {filteredAssets.map((asset) => {
                  const val =
                    asset.amounts.balance ||
                    asset.amounts.insuranceCover ||
                    asset.amounts.estimatedValue ||
                    0;
                  const isNomineeAlert =
                    asset.nominationStatus === 'unregistered' || asset.nominationStatus === 'unknown';
                  const riskEval = evaluateAssetRisk(asset);

                  return (
                    <tr
                      key={asset.id}
                      onClick={() => setSelectedAsset(asset)}
                      className="hover:bg-[#f8f7f4] cursor-pointer transition-colors"
                    >
                      <td className="py-4 px-3">
                        <span className="font-semibold text-[#1a1a1a] text-[13px] block">
                          {asset.label}
                        </span>
                        <span className="text-[11px] text-[#1a1a1a]/55 font-mono-meta block mt-0.5">
                          {asset.institutionName} • {asset.maskedReference}
                        </span>
                      </td>

                      <td className="py-4 px-3 font-mono-meta text-[11px] text-[#1a1a1a]/70">
                        {asset.jurisdiction === 'IN'
                          ? 'IND'
                          : asset.jurisdiction === 'SG'
                          ? 'SGP'
                          : asset.jurisdiction === 'JP'
                          ? 'JPN'
                          : 'KOR'}
                      </td>

                      <td
                        className={`py-4 px-3 text-xs font-medium ${
                          isNomineeAlert ? 'text-[#b54708] italic font-serif-display text-sm' : 'text-[#1a1a1a]/80'
                        }`}
                      >
                        {asset.nominationStatus === 'recorded'
                          ? asset.nomineeName || 'Registered'
                          : asset.nominationStatus === 'unregistered'
                          ? 'Unregistered'
                          : 'Unknown'}
                      </td>

                      <td className="py-4 px-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-xs font-mono-meta text-[10px] font-bold uppercase tracking-wider ${
                            riskEval.level === 'high'
                              ? 'bg-amber-100 text-[#b54708] border border-amber-300'
                              : riskEval.level === 'medium'
                              ? 'bg-yellow-50 text-amber-700 border border-yellow-200'
                              : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          }`}
                        >
                          {riskEval.level === 'high' ? (
                            <AlertTriangle className="w-3 h-3 text-[#b54708]" />
                          ) : (
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          )}
                          <span>
                            {riskEval.level === 'high'
                              ? 'High Risk'
                              : riskEval.level === 'medium'
                              ? 'Moderate'
                              : 'Verified'}
                          </span>
                        </span>
                      </td>

                      <td className="py-4 px-3 text-right font-semibold font-mono-meta text-xs text-[#1a1a1a]">
                        {formatCurrency(val, asset.currency)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Controlled Family Visibility Preview */}
      <div className="bg-white border border-[#1a1a1a]/15 rounded-xs p-6 lg:p-8 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-[#1a1a1a]/10 pb-3">
          <div>
            <span className="font-mono-meta text-[10px] uppercase tracking-widest text-[#1a1a1a]/50">
              Access Governance Preview
            </span>
            <h3 className="font-serif-display text-xl font-semibold text-[#1a1a1a] tracking-tight">
              {t.workspace.familyPreviewTitle}
            </h3>
          </div>
          <span className="font-mono-meta text-[9px] uppercase px-2 py-0.5 bg-[#f8f7f4] border border-[#1a1a1a]/15 text-[#1a1a1a]/70">
            Multi-Sig Boundary
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xs bg-[#f8f7f4] border border-[#1a1a1a]/10 space-y-1.5">
            <div className="font-mono-meta text-[10px] font-bold uppercase tracking-wider text-[#b54708] flex items-center gap-1.5">
              <Lock className="w-3 h-3" />
              <span>Before Handover (Protected)</span>
            </div>
            <p className="text-[12px] text-[#1a1a1a]/75 leading-relaxed">
              {t.workspace.beforeHandover}
            </p>
          </div>

          <div className="p-4 rounded-xs bg-[#f8f7f4] border border-[#4a5d4e]/30 space-y-1.5">
            <div className="font-mono-meta text-[10px] font-bold uppercase tracking-wider text-[#4a5d4e] flex items-center gap-1.5">
              <CheckCircle2 className="w-3 h-3" />
              <span>After Handover (2-Reviewer Verified)</span>
            </div>
            <p className="text-[12px] text-[#1a1a1a]/75 leading-relaxed">
              {t.workspace.afterHandover}
            </p>
          </div>
        </div>
      </div>

      {/* How It Connects Knowledge Graph */}
      <RelationshipGraph
        nodes={nodes}
        edges={edges}
        currentLang={currentLang}
      />

      {/* Asset Detail Modal */}
      {selectedAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-xs border-2 border-[#1a1a1a] shadow-2xl max-w-md w-full p-6 space-y-4 text-xs">
            <div className="flex items-start justify-between border-b border-[#1a1a1a]/10 pb-3">
              <div>
                <h3 className="font-serif-display text-2xl font-bold text-[#1a1a1a]">
                  {selectedAsset.label}
                </h3>
                <span className="font-mono-meta text-[10px] uppercase text-[#1a1a1a]/60">
                  {selectedAsset.institutionName} • {selectedAsset.maskedReference}
                </span>
              </div>
              <button
                onClick={() => setSelectedAsset(null)}
                className="text-[#1a1a1a]/50 hover:text-[#1a1a1a] font-mono-meta text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-[#1a1a1a]">
              {(() => {
                const evalRisk = evaluateAssetRisk(selectedAsset);
                return (
                  <div
                    className={`p-3 rounded-xs border font-mono-meta text-[11px] space-y-1 ${
                      evalRisk.level === 'high'
                        ? 'bg-amber-50 border-amber-300 text-amber-900'
                        : evalRisk.level === 'medium'
                        ? 'bg-yellow-50 border-yellow-200 text-amber-800'
                        : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold uppercase">
                      <span className="flex items-center gap-1.5">
                        {evalRisk.level === 'high' ? (
                          <AlertTriangle className="w-3.5 h-3.5 text-[#b54708]" />
                        ) : (
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                        )}
                        <span>Governance Risk: {evalRisk.level.toUpperCase()}</span>
                      </span>
                      <span>Score: {evalRisk.score}/100</span>
                    </div>
                    {evalRisk.reasons.length > 0 ? (
                      <ul className="list-disc list-inside pt-1 space-y-0.5 text-[10px] opacity-90">
                        {evalRisk.reasons.map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-[10px] pt-1">
                        ✓ Fully compliant with 2-reviewer handover governance rules.
                      </div>
                    )}
                  </div>
                );
              })()}

              <div className="flex justify-between p-2.5 rounded-xs bg-[#f8f7f4] border border-[#1a1a1a]/10">
                <span className="text-[#1a1a1a]/60">Valuation:</span>
                <span className="font-mono-meta font-bold text-[#1a1a1a]">
                  {formatCurrency(
                    selectedAsset.amounts.balance || selectedAsset.amounts.insuranceCover || 0,
                    selectedAsset.currency
                  )}
                </span>
              </div>
              <div className="flex justify-between p-2.5 rounded-xs bg-[#f8f7f4] border border-[#1a1a1a]/10">
                <span className="text-[#1a1a1a]/60">Nominee Registered:</span>
                <span className="font-medium text-[#1a1a1a]">
                  {selectedAsset.nomineeName || 'Unregistered'}
                </span>
              </div>
              <div className="flex justify-between p-2.5 rounded-xs bg-[#f8f7f4] border border-[#1a1a1a]/10">
                <span className="text-[#1a1a1a]/60">Physical Coordinates:</span>
                <span className="text-right text-[11px]">
                  {selectedAsset.documentLocation || 'Not cataloged'}
                </span>
              </div>
              <div className="flex justify-between p-2.5 rounded-xs bg-[#f8f7f4] border border-[#1a1a1a]/10">
                <span className="text-[#1a1a1a]/60">Family Access Granted:</span>
                <span className="font-mono-meta font-semibold text-[#4a5d4e]">
                  {selectedAsset.authorizedForFamily ? 'YES (SCOPED)' : 'NO (CONFIDENTIAL)'}
                </span>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap justify-between items-center gap-2 border-t border-[#1a1a1a]/10">
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const id = selectedAsset.id;
                    setSelectedAsset(null);
                    if (onOpenQr) onOpenQr(id);
                  }}
                  className="px-3 py-2 rounded-xs bg-[#1a1a1a] hover:bg-[#2b2b2b] text-[#f8f7f4] font-mono-meta text-[10px] uppercase tracking-wider font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Physical QR</span>
                </button>
                <button
                  onClick={() => {
                    const asset = selectedAsset;
                    setSelectedAsset(null);
                    setAuditAsset(asset);
                  }}
                  className="px-3 py-2 rounded-xs bg-[#f8f7f4] border border-[#1a1a1a]/20 text-[#1a1a1a] hover:bg-[#f0eee9] font-mono-meta text-[10px] uppercase tracking-wider font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-[#1a1a1a]/70" />
                  <span>Audit Trail</span>
                </button>
              </div>

              <button
                onClick={() => setSelectedAsset(null)}
                className="px-4 py-2 rounded-xs bg-[#f8f7f4] border border-[#1a1a1a]/20 text-[#1a1a1a] hover:bg-white cursor-pointer font-mono-meta text-[10px] uppercase tracking-wider"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Asset Audit Trail Modal */}
      {auditAsset && (
        <AssetAuditTrailModal
          asset={auditAsset}
          currentLang={currentLang}
          onClose={() => setAuditAsset(null)}
          onOpenQr={onOpenQr}
        />
      )}
    </div>
  );
};
