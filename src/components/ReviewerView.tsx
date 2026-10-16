import React, { useState } from 'react';
import {
  ShieldCheck,
  FileSearch,
  CheckCircle2,
  PauseCircle,
  PlayCircle,
  AlertTriangle,
  History,
  Lock,
} from 'lucide-react';
import { HandoverCase, JapacLanguage, UserPersona } from '../types';
import { translations } from '../i18n/translations';
import { triggerConfetti } from '../utils/formatters';

interface ReviewerViewProps {
  currentLang: JapacLanguage;
  activePersona: UserPersona;
  handoverCase: HandoverCase;
  onApprove: (reviewerId: string, reviewerName: string) => void;
  onHold: (reason: string) => void;
  onResume: () => void;
}

export const ReviewerView: React.FC<ReviewerViewProps> = ({
  currentLang,
  activePersona,
  handoverCase,
  onApprove,
  onHold,
  onResume,
}) => {
  const t = translations[currentLang] || translations.en;
  const [holdInput, setHoldInput] = useState('');
  const [showHoldDialog, setShowHoldDialog] = useState(false);

  const doc = handoverCase.documentAttached;
  const hasMismatch = doc?.hasMismatch;
  const isHeld = handoverCase.status === 'held';
  const isReleased = handoverCase.status === 'released';

  const hasAlreadyApproved = handoverCase.approvalsReceived.includes(activePersona.id);
  const approvalCount = handoverCase.approvalsReceived.length;

  const handleApproveClick = () => {
    onApprove(activePersona.id, activePersona.name);
    if (approvalCount + 1 >= handoverCase.requiredApprovals) {
      triggerConfetti();
    }
  };

  const handleConfirmHold = () => {
    const reason =
      holdInput.trim() ||
      'Name spelling discrepancy detected on submitted certificate ("Ramesh Patil" vs "Ramesh Patel").';
    onHold(reason);
    setShowHoldDialog(false);
  };

  return (
    <div className="space-y-8">
      {/* Console Header */}
      <div className="bg-white rounded-xs border border-[#1a1a1a]/15 p-6 lg:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h2 className="font-serif-display text-3xl font-semibold italic text-[#1a1a1a] tracking-tight">
              {t.reviewers.title}
            </h2>
            <span className="px-2 py-0.5 rounded-xs text-[10px] font-mono-meta font-bold bg-[#1a1a1a]/5 text-[#1a1a1a] border border-[#1a1a1a]/15 uppercase">
              Dual Authorization
            </span>
          </div>
          <p className="text-xs text-[#1a1a1a]/60 font-mono-meta text-[11px]">
            {t.reviewers.subtitle}
          </p>
        </div>

        {/* Current Reviewer Status Pill */}
        <div className="flex items-center gap-2 bg-[#f8f7f4] px-3.5 py-2 rounded-xs border border-[#1a1a1a]/15 font-mono-meta text-xs">
          <span className="text-[#1a1a1a]/50">Examiner:</span>
          <span className="font-bold text-[#1a1a1a] flex items-center gap-1.5">
            <span>{activePersona.avatar}</span>
            <span>{activePersona.name}</span>
          </span>
          <span className="text-[9px] uppercase px-1 border border-[#1a1a1a]/20">
            {activePersona.role}
          </span>
        </div>
      </div>

      {/* Security Rule Callout */}
      <div className="p-4 rounded-xs bg-[#f8f7f4] border border-[#1a1a1a]/15 text-[#1a1a1a] text-xs font-mono-meta flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Lock className="w-3.5 h-3.5 text-[#1a1a1a]" />
          <span>{t.reviewers.dualNotice}</span>
        </div>
        <span className="text-xs font-bold text-[#1a1a1a] px-2.5 py-1 bg-white border border-[#1a1a1a]/20">
          Status: {t.status[isReleased ? 'released' : isHeld ? 'held' : 'underReview']} ({approvalCount}/2 Approved)
        </span>
      </div>

      {/* Discrepancy Mismatch Alert if detected */}
      {hasMismatch && !isReleased && (
        <div className="p-5 rounded-xs bg-[#fdf6f0] border-2 border-[#b54708] text-[#1a1a1a] space-y-2">
          <div className="flex items-center gap-2 font-bold text-[#b54708] font-mono-meta text-xs uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 text-[#b54708]" />
            <span>{t.reviewers.mismatchWarning}</span>
          </div>
          <p className="text-xs text-[#1a1a1a]/85 leading-relaxed font-sans">
            Automated OCR identified deceased name as{' '}
            <strong className="underline font-mono-meta text-[#b54708]">"{doc?.extractedName}"</strong>, whereas the estate ledger designates{' '}
            <strong className="underline font-mono-meta text-[#1a1a1a]">"{doc?.targetName}"</strong>.
            Under anti-fraud compliance rules, you must place this case on hold until a clarifying affidavit is attached.
          </p>
        </div>
      )}

      {/* Side-by-side Inspection Workbench */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Submitted Evidence Document */}
        <div className="bg-white rounded-xs border border-[#1a1a1a]/15 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#1a1a1a]/10 pb-3">
            <h3 className="font-serif-display text-xl font-bold text-[#1a1a1a]">Submitted Certificate OCR</h3>
            <span className="font-mono-meta text-[10px] text-[#1a1a1a]/50">
              Hash: {doc?.hash || '0x4f12...'}
            </span>
          </div>

          {doc ? (
            <div className="space-y-3 font-mono-meta text-xs">
              <div className="p-3.5 rounded-xs bg-[#f8f7f4] border border-[#1a1a1a]/10 space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#1a1a1a]/60">Document Title:</span>
                  <span className="font-bold text-[#1a1a1a]">{doc.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#1a1a1a]/60">{t.reviewers.nameOnCert}:</span>
                  <span className={`font-bold ${hasMismatch ? 'text-[#b54708]' : 'text-[#4a5d4e]'}`}>
                    {doc.extractedName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#1a1a1a]/60">Issuer:</span>
                  <span className="text-[#1a1a1a]">Municipal Bureau of Vital Records</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xs bg-white border border-[#1a1a1a]/15 text-[11px] text-[#1a1a1a]/80">
                <div className="text-[10px] text-[#1a1a1a]/50 uppercase mb-1 font-bold">OCR Raw Extracted Text:</div>
                <pre className="whitespace-pre-wrap overflow-x-auto text-[10px]">
                  {`SYNTHETIC CERTIFICATE
Registration: SIM-0002
Name of Deceased: ${doc.extractedName}
Date of Registry: 12 October 2026
Verified by Document AI OCR Model v2.4`}
                </pre>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-[#1a1a1a]/40 font-mono-meta text-xs">
              No evidence document submitted yet.
            </div>
          )}
        </div>

        {/* Right: Master Ledger Record & Action Station */}
        <div className="bg-white rounded-xs border border-[#1a1a1a]/15 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#1a1a1a]/10 pb-3">
            <h3 className="font-serif-display text-xl font-bold text-[#1a1a1a]">Master Estate Record</h3>
            <span className="font-mono-meta text-[10px] text-[#4a5d4e] font-bold">Immutable SQL Record</span>
          </div>

          <div className="p-3.5 rounded-xs bg-[#f8f7f4] border border-[#1a1a1a]/10 space-y-2 font-mono-meta text-xs">
            <div className="flex justify-between">
              <span className="text-[#1a1a1a]/60">{t.reviewers.nameOnLedger}:</span>
              <span className="font-bold text-[#1a1a1a]">{handoverCase.ownerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#1a1a1a]/60">Applicant / Beneficiary:</span>
              <span className="font-medium text-[#1a1a1a]">{handoverCase.applicantName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#1a1a1a]/60">Case Identifier:</span>
              <span className="text-[#1a1a1a]">{handoverCase.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#1a1a1a]/60">Dual Authorization:</span>
              <span className="font-bold text-[#1a1a1a]">2 Independent Approvers</span>
            </div>
          </div>

          {/* Action Station */}
          <div className="pt-2 space-y-3 font-mono-meta">
            <div className="text-[10px] font-bold text-[#1a1a1a]/50 uppercase tracking-widest">
              Examiner Actions
            </div>

            {isReleased ? (
              <div className="p-4 rounded-xs bg-[#f4f7f4] border border-[#4a5d4e] text-xs flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#4a5d4e] shrink-0" />
                <div>
                  <div className="font-bold text-[#1a1a1a]">Case Released by 2 Reviewers</div>
                  <div className="text-[10px] text-[#1a1a1a]/60">
                    Family beneficiary has received scoped access to authorized records.
                  </div>
                </div>
              </div>
            ) : isHeld ? (
              <div className="space-y-3">
                <div className="p-3 rounded-xs bg-[#fdf6f0] border border-[#b54708] text-[#1a1a1a] text-xs">
                  <div className="font-bold text-[#b54708]">Case Placed On Hold</div>
                  <div className="text-[11px] mt-0.5">{handoverCase.holdReason}</div>
                </div>
                <button
                  onClick={onResume}
                  className="w-full py-2.5 rounded-xs bg-[#1a1a1a] hover:bg-[#2b2b2b] text-[#f8f7f4] font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <PlayCircle className="w-4 h-4" />
                  <span>{t.actions.resume}</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setShowHoldDialog(true)}
                  className="flex-1 py-2.5 rounded-xs bg-white hover:bg-[#f8f7f4] text-[#b54708] border border-[#b54708] font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <PauseCircle className="w-4 h-4" />
                  <span>{t.actions.hold}</span>
                </button>

                <button
                  onClick={handleApproveClick}
                  disabled={hasAlreadyApproved}
                  className={`flex-1 py-2.5 rounded-xs font-bold text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    hasAlreadyApproved
                      ? 'bg-[#f4f7f4] text-[#4a5d4e] border border-[#4a5d4e] cursor-not-allowed'
                      : 'bg-[#1a1a1a] hover:bg-[#2b2b2b] text-[#f8f7f4]'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {hasAlreadyApproved
                      ? 'Signed by You (1 of 2)'
                      : `Approve Release (${approvalCount}/2)`}
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Review Logs & Audit History */}
      <div className="bg-white rounded-xs border border-[#1a1a1a]/15 p-6 shadow-xs space-y-3 font-mono-meta">
        <div className="flex items-center gap-2 text-xs font-bold text-[#1a1a1a]/60 uppercase tracking-widest">
          <History className="w-4 h-4 text-[#1a1a1a]" />
          <span>Audit Event Trail</span>
        </div>

        {handoverCase.reviewLogs.length === 0 ? (
          <div className="text-xs text-[#1a1a1a]/40 py-2 italic font-sans">
            No actions recorded yet for this case.
          </div>
        ) : (
          <div className="space-y-2">
            {handoverCase.reviewLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-xs bg-[#f8f7f4] border border-[#1a1a1a]/10 flex items-center justify-between text-xs text-[#1a1a1a]"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      log.decision === 'approve'
                        ? 'bg-[#4a5d4e]'
                        : log.decision === 'hold'
                        ? 'bg-[#b54708]'
                        : 'bg-[#1a1a1a]'
                    }`}
                  />
                  <span className="font-bold">{log.reviewerName}</span>
                  <span className="text-[#1a1a1a]/40">—</span>
                  <span className="capitalize">{log.decision}:</span>
                  <span className="text-[#1a1a1a]/70 font-sans italic">"{log.notes}"</span>
                </div>
                <span className="text-[10px] text-[#1a1a1a]/50">{log.timestamp}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Hold Reason Modal */}
      {showHoldDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-xs border-2 border-[#1a1a1a] shadow-2xl max-w-md w-full p-6 space-y-4 text-xs">
            <h3 className="font-serif-display text-2xl font-bold text-[#b54708]">
              Place Case On Hold
            </h3>
            <p className="text-[#1a1a1a]/70 font-sans text-xs">
              {t.reviewers.holdReasonPrompt}
            </p>
            <textarea
              rows={3}
              value={holdInput}
              onChange={(e) => setHoldInput(e.target.value)}
              placeholder="e.g. Discrepancy between certificate name (Ramesh Patil) and estate records (Ramesh Patel)."
              className="w-full bg-[#f8f7f4] border border-[#1a1a1a]/20 rounded-xs p-3 text-xs text-[#1a1a1a] placeholder-[#1a1a1a]/40 focus:outline-none focus:border-[#1a1a1a]"
            />
            <div className="flex justify-end gap-3 pt-2 border-t border-[#1a1a1a]/10 font-mono-meta">
              <button
                onClick={() => setShowHoldDialog(false)}
                className="px-4 py-2 rounded-xs bg-[#f8f7f4] border border-[#1a1a1a]/20 text-[#1a1a1a] cursor-pointer"
              >
                {t.actions.close}
              </button>
              <button
                onClick={handleConfirmHold}
                className="px-4 py-2 rounded-xs bg-[#b54708] text-white font-bold uppercase tracking-wider cursor-pointer"
              >
                Confirm Hold
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
