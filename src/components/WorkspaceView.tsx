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
}) => {
  const t = translations[currentLang] || translations.en;
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedAsset, setSelectedAsset] = useState<AssetItem | null>(null);

  const filteredAssets =
    filterType === 'all' ? assets : assets.filter((a) => a.assetType === filterType);

  const totalWealth = assets.reduce(
    (sum, a) => sum + (a.amounts.balance || a.amounts.insuranceCover || a.amounts.estimatedValue || 0),
    0
  );

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

            <div className="pt-2 flex justify-between items-center border-t border-[#1a1a1a]/10">
              <button
                onClick={() => {
                  const id = selectedAsset.id;
                  setSelectedAsset(null);
                  if (onOpenQr) onOpenQr(id);
                }}
                className="px-3.5 py-2 rounded-xs bg-[#1a1a1a] hover:bg-[#2b2b2b] text-[#f8f7f4] font-mono-meta text-[10px] uppercase tracking-wider font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>Export Physical QR Tag</span>
              </button>
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
    </div>
  );
};
