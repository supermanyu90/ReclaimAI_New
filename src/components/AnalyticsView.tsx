import React from 'react';
import {
  Activity,
  CheckCircle2,
  Database,
} from 'lucide-react';
import { AssetItem, JapacLanguage } from '../types';
import { translations } from '../i18n/translations';

interface AnalyticsViewProps {
  currentLang: JapacLanguage;
  assets: AssetItem[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ currentLang, assets }) => {
  const t = translations[currentLang] || translations.en;

  const unregisteredCount = assets.filter((a) => a.nominationStatus === 'unregistered').length;
  const unknownNomCount = assets.filter((a) => a.nominationStatus === 'unknown').length;
  const staleDocsCount = assets.filter((a) => a.sourceDate && a.sourceDate < '2024-01-01').length;

  const events = [
    {
      id: 'EVT-9021',
      type: 'asset_version_committed',
      aggregateId: 'ast-001',
      topic: 'projects/reclaimai-prod/topics/asset-events',
      timestamp: '2026-10-15 09:12:44 UTC',
      status: 'delivered',
    },
    {
      id: 'EVT-9022',
      type: 'passport_snapshot_generated',
      aggregateId: 'passport-v2',
      topic: 'projects/reclaimai-prod/topics/passport-generation',
      timestamp: '2026-10-15 09:14:02 UTC',
      status: 'delivered',
    },
    {
      id: 'EVT-9023',
      type: 'document_extraction_completed',
      aggregateId: 'doc-fd-receipt',
      topic: 'projects/reclaimai-prod/topics/document-ai',
      timestamp: '2026-10-15 09:20:19 UTC',
      status: 'delivered',
    },
    {
      id: 'EVT-9024',
      type: 'handover_dual_review_requested',
      aggregateId: 'HND-2026-0902',
      topic: 'projects/reclaimai-prod/topics/handover-audit',
      timestamp: '2026-10-15 09:22:30 UTC',
      status: 'in_progress',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xs border border-[#1a1a1a]/15 p-6 lg:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h2 className="font-serif-display text-3xl font-semibold italic text-[#1a1a1a] tracking-tight">
              {t.analytics.title}
            </h2>
            <span className="px-2 py-0.5 rounded-xs text-[10px] font-mono-meta font-bold bg-[#1a1a1a]/5 text-[#1a1a1a] border border-[#1a1a1a]/15 uppercase">
              BigQuery &amp; Outbox
            </span>
          </div>
          <p className="text-xs text-[#1a1a1a]/60 font-mono-meta text-[11px]">
            {t.analytics.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono-meta text-xs">
          <span className="flex items-center gap-1.5 text-[#4a5d4e] bg-[#f4f7f4] px-3 py-1.5 rounded-xs border border-[#4a5d4e]/30">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4a5d4e] animate-pulse" />
            <span className="uppercase text-[10px] font-bold">Event Stream Active</span>
          </span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <div className="p-6 rounded-xs bg-white border border-[#1a1a1a]/15 space-y-2">
          <div className="text-[10px] uppercase font-bold tracking-widest font-mono-meta text-[#1a1a1a]/50">
            Classifier Accuracy
          </div>
          <div className="font-serif-display text-4xl font-semibold text-[#1a1a1a]">94.8%</div>
          <p className="text-[11px] text-[#1a1a1a]/60 font-mono-meta">Synthetic validation set</p>
        </div>

        <div className="p-6 rounded-xs bg-white border border-[#1a1a1a]/15 space-y-2">
          <div className="text-[10px] uppercase font-bold tracking-widest font-mono-meta text-[#1a1a1a]/50">
            {t.analytics.abstentionThreshold}
          </div>
          <div className="font-serif-display text-4xl font-semibold text-[#1a1a1a]">0.55</div>
          <p className="text-[11px] text-[#1a1a1a]/60 font-mono-meta">Abstains below threshold</p>
        </div>

        <div className="p-6 rounded-xs bg-white border border-[#1a1a1a]/15 space-y-2">
          <div className="text-[10px] uppercase font-bold tracking-widest font-mono-meta text-[#b54708]">
            Unregistered Nominees
          </div>
          <div className="font-serif-display text-4xl font-semibold text-[#b54708]">
            {unregisteredCount + unknownNomCount}
          </div>
          <p className="text-[11px] text-[#1a1a1a]/60 font-mono-meta">Requires institution update</p>
        </div>

        <div className="p-6 rounded-xs bg-white border border-[#1a1a1a]/15 space-y-2">
          <div className="text-[10px] uppercase font-bold tracking-widest font-mono-meta text-[#1a1a1a]/50">
            Stale Source Docs
          </div>
          <div className="font-serif-display text-4xl font-semibold text-[#1a1a1a]">{staleDocsCount}</div>
          <p className="text-[11px] text-[#1a1a1a]/60 font-mono-meta">Older than 24 months</p>
        </div>
      </div>

      {/* Immutable Outbox Event Stream */}
      <div className="bg-white rounded-xs border border-[#1a1a1a]/15 p-6 lg:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-[#1a1a1a]/10 pb-4">
          <div>
            <h3 className="font-serif-display text-2xl font-bold text-[#1a1a1a]">{t.analytics.auditLog}</h3>
            <p className="text-xs text-[#1a1a1a]/60 font-mono-meta text-[11px]">
              Transactional Outbox Pattern with Guaranteed Delivery
            </p>
          </div>
          <span className="font-mono-meta text-[10px] uppercase text-[#1a1a1a]/60">
            Audit Ledger v2.4
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-[#1a1a1a] text-[#1a1a1a]/60 font-mono-meta text-[10px] uppercase tracking-widest">
                <th className="py-3 px-3 font-semibold">Event ID</th>
                <th className="py-3 px-3 font-semibold">Event Type</th>
                <th className="py-3 px-3 font-semibold">Aggregate Ref</th>
                <th className="py-3 px-3 font-semibold">Delivery Status</th>
                <th className="py-3 px-3 text-right font-semibold">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1a1a]/8 font-mono-meta text-[11px] text-[#1a1a1a]">
              {events.map((evt) => (
                <tr key={evt.id} className="hover:bg-[#f8f7f4]">
                  <td className="py-3 px-3 font-bold">{evt.id}</td>
                  <td className="py-3 px-3 font-sans font-medium">{evt.type}</td>
                  <td className="py-3 px-3 text-[#1a1a1a]/60">{evt.aggregateId}</td>
                  <td className="py-3 px-3">
                    <span className="inline-flex items-center gap-1 text-[#4a5d4e] font-semibold text-[10px] bg-[#f4f7f4] px-2 py-0.5 border border-[#4a5d4e]/30">
                      <CheckCircle2 className="w-3 h-3" />
                      {evt.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right text-[#1a1a1a]/60">{evt.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
