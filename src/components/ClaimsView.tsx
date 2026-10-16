import React, { useState } from 'react';
import {
  FileCheck2,
  Building,
  Clock,
  Scale,
  Download,
  CheckSquare,
  Square,
  BookOpen,
} from 'lucide-react';
import { JapacLanguage } from '../types';
import { translations } from '../i18n/translations';
import { INSTITUTION_CLAIM_GUIDES } from '../data/demoData';
import { formatCurrency } from '../utils/formatters';

interface ClaimsViewProps {
  currentLang: JapacLanguage;
}

export const ClaimsView: React.FC<ClaimsViewProps> = ({ currentLang }) => {
  const t = translations[currentLang] || translations.en;
  const institutions = Object.keys(INSTITUTION_CLAIM_GUIDES);
  const [selectedInstKey, setSelectedInstKey] = useState<string>(institutions[0]);
  const [activeTrack, setActiveTrack] = useState<'nominee' | 'legal_heir'>('nominee');
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});

  const guide = INSTITUTION_CLAIM_GUIDES[selectedInstKey];
  const steps = activeTrack === 'nominee' ? guide.rulesWithNominee : guide.rulesWithoutNominee;

  const toggleStep = (stepId: string) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [stepId]: !prev[stepId],
    }));
  };

  const completedCount = steps.filter((s) => completedSteps[s.id]).length;
  const progressPercent = Math.round((completedCount / steps.length) * 100);

  const handleDownloadClaimPack = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xs border border-[#1a1a1a]/15 p-6 lg:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h2 className="font-serif-display text-3xl font-semibold italic text-[#1a1a1a] tracking-tight">
              {t.claims.title}
            </h2>
            <span className="px-2 py-0.5 rounded-xs text-[10px] font-mono-meta font-bold bg-[#1a1a1a]/5 text-[#1a1a1a] border border-[#1a1a1a]/15 uppercase">
              Statutory Settlement
            </span>
          </div>
          <p className="text-xs text-[#1a1a1a]/60 font-mono-meta text-[11px]">
            {t.claims.subtitle}
          </p>
        </div>

        <button
          onClick={handleDownloadClaimPack}
          className="px-5 py-2.5 rounded-xs bg-[#1a1a1a] hover:bg-[#2b2b2b] text-[#f8f7f4] font-mono-meta text-[11px] uppercase tracking-widest font-semibold flex items-center gap-2 transition-all cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Claim Pack</span>
        </button>
      </div>

      {/* Institution Picker */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono-meta text-xs">
        {institutions.map((instName) => {
          const item = INSTITUTION_CLAIM_GUIDES[instName];
          const isSelected = selectedInstKey === instName;
          return (
            <button
              key={instName}
              onClick={() => setSelectedInstKey(instName)}
              className={`p-4 rounded-xs border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#1a1a1a] text-[#f8f7f4] border-[#1a1a1a] font-bold shadow-xs'
                  : 'bg-white border-[#1a1a1a]/15 text-[#1a1a1a]/80 hover:bg-[#f8f7f4]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[10px] uppercase ${isSelected ? 'text-[#f8f7f4]/60' : 'text-[#1a1a1a]/50'}`}>
                  {item.jurisdiction} • {item.currency}
                </span>
                <span className="text-base">
                  {item.jurisdiction === 'IN'
                    ? '🇮🇳'
                    : item.jurisdiction === 'SG'
                    ? '🇸🇬'
                    : item.jurisdiction === 'JP'
                    ? '🇯🇵'
                    : '🇰🇷'}
                </span>
              </div>
              <div className="mt-2 text-xs truncate font-serif-display font-semibold text-base">{instName}</div>
            </button>
          );
        })}
      </div>

      {/* Institution Policy Summary Card */}
      <div className="p-6 lg:p-8 rounded-xs bg-white border border-[#1a1a1a]/15 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-[#1a1a1a]/10 gap-3">
          <div>
            <h3 className="font-serif-display text-2xl font-bold text-[#1a1a1a]">{guide.institution}</h3>
            <span className="text-[10px] text-[#1a1a1a]/50 font-mono-meta uppercase">
              Policy Revision: {guide.policyVersion} • Reviewed: {guide.lastReviewed}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono-meta">
            <div className="flex items-center gap-1.5 text-[#1a1a1a]">
              <Clock className="w-3.5 h-3.5 text-[#4a5d4e]" />
              <span>Target SLA: {guide.turnaroundTargetDays} Days</span>
            </div>
            {guide.statutoryLimitNoCourtOrder && (
              <div className="flex items-center gap-1.5 text-[#1a1a1a]">
                <Scale className="w-3.5 h-3.5 text-[#b54708]" />
                <span>
                  Threshold: {formatCurrency(guide.statutoryLimitNoCourtOrder, guide.currency)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Track Switcher: Nominee vs Legal Heir */}
        <div className="flex gap-2 bg-[#f8f7f4] p-1 rounded-xs border border-[#1a1a1a]/15 text-[11px] font-mono-meta uppercase tracking-wider w-fit">
          <button
            onClick={() => setActiveTrack('nominee')}
            className={`px-4 py-2 rounded-xs font-semibold transition-all cursor-pointer ${
              activeTrack === 'nominee'
                ? 'bg-[#1a1a1a] text-[#f8f7f4]'
                : 'text-[#1a1a1a]/50 hover:text-[#1a1a1a]'
            }`}
          >
            {t.claims.nomineePath}
          </button>
          <button
            onClick={() => setActiveTrack('legal_heir')}
            className={`px-4 py-2 rounded-xs font-semibold transition-all cursor-pointer ${
              activeTrack === 'legal_heir'
                ? 'bg-[#1a1a1a] text-[#f8f7f4]'
                : 'text-[#1a1a1a]/50 hover:text-[#1a1a1a]'
            }`}
          >
            {t.claims.legalHeirPath}
          </button>
        </div>

        {/* Survivorship & Mandate Special Rules Callout */}
        <div className="p-4 rounded-xs bg-[#f8f7f4] border border-[#1a1a1a]/15 text-xs text-[#1a1a1a] flex items-start gap-2.5">
          <BookOpen className="w-4 h-4 text-[#4a5d4e] shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="font-mono-meta text-[10px] uppercase text-[#1a1a1a] block mb-0.5">
              Account Mandate Guidance:
            </strong>
            {guide.survivorshipMandateNotes}
          </div>
        </div>

        {/* Checklist Progress Bar */}
        <div>
          <div className="flex justify-between text-xs font-mono-meta text-[#1a1a1a]/60 mb-2">
            <span>Documentation Checklist Progress</span>
            <span className="font-bold text-[#1a1a1a]">
              {completedCount} of {steps.length} Complete ({progressPercent}%)
            </span>
          </div>
          <div className="w-full bg-[#f8f7f4] border border-[#1a1a1a]/15 rounded-xs h-2 overflow-hidden">
            <div
              className="bg-[#1a1a1a] h-full transition-all duration-200"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Interactive Step Items */}
        <div className="space-y-3 pt-2">
          {steps.map((step) => {
            const isDone = !!completedSteps[step.id];
            return (
              <div
                key={step.id}
                onClick={() => toggleStep(step.id)}
                className={`p-4 rounded-xs border cursor-pointer transition-all text-xs space-y-2 ${
                  isDone
                    ? 'bg-[#f4f7f4] border-[#4a5d4e]'
                    : 'bg-[#f8f7f4] border-[#1a1a1a]/15 hover:bg-white'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    {isDone ? (
                      <CheckSquare className="w-4 h-4 text-[#4a5d4e] shrink-0 mt-0.5" />
                    ) : (
                      <Square className="w-4 h-4 text-[#1a1a1a]/40 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <h4
                        className={`font-semibold font-serif-display text-base ${
                          isDone ? 'line-through text-[#1a1a1a]/50' : 'text-[#1a1a1a]'
                        }`}
                      >
                        {step.title}
                      </h4>
                      <p className="text-[#1a1a1a]/70 font-sans text-xs mt-0.5 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  <span className="text-[9px] font-mono-meta uppercase px-2 py-0.5 bg-white border border-[#1a1a1a]/15 text-[#1a1a1a]/60 shrink-0">
                    {step.legalBasis}
                  </span>
                </div>

                <div className="pl-7 pt-1 flex flex-wrap gap-1.5 font-mono-meta text-[10px]">
                  {step.documentsRequired.map((doc, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-white text-[#1a1a1a]/70 border border-[#1a1a1a]/10"
                    >
                      📎 {doc}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-[10px] font-mono-meta text-[#1a1a1a]/50 italic pt-2">
          {t.claims.disclaimer}
        </p>
      </div>
    </div>
  );
};
