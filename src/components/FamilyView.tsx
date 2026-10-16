import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  FileText,
  Upload,
  Lock,
  ArrowRight,
  Building,
  MapPin,
  CheckCircle2,
} from 'lucide-react';
import { AssetItem, HandoverCase, JapacLanguage } from '../types';
import { translations } from '../i18n/translations';
import { formatCurrency } from '../utils/formatters';

interface FamilyViewProps {
  currentLang: JapacLanguage;
  handoverCase: HandoverCase;
  assets: AssetItem[];
  onRequestHandover: (docType: 'clean' | 'mismatch') => void;
  onOpenClaims: () => void;
  onOpenPassport: () => void;
}

export const FamilyView: React.FC<FamilyViewProps> = ({
  currentLang,
  handoverCase,
  assets,
  onRequestHandover,
  onOpenClaims,
  onOpenPassport,
}) => {
  const t = translations[currentLang] || translations.en;
  const [selectedDocToUpload, setSelectedDocToUpload] = useState<'clean' | 'mismatch'>('mismatch');
  const [showUploadModal, setShowUploadModal] = useState(false);

  const isReleased = handoverCase.status === 'released';
  const isHeld = handoverCase.status === 'held';

  const authorizedAssets = assets.filter((a) => a.authorizedForFamily);

  const handleSubmitRequest = () => {
    onRequestHandover(selectedDocToUpload);
    setShowUploadModal(false);
  };

  return (
    <div className="space-y-8">
      {/* Banner: Pre-Handover vs Released */}
      <div
        className={`p-6 lg:p-8 rounded-xs border-2 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6 ${
          isReleased
            ? 'bg-[#f4f7f4] border-[#4a5d4e] text-[#1a1a1a]'
            : isHeld
            ? 'bg-[#fdf6f0] border-[#b54708] text-[#1a1a1a]'
            : 'bg-white border-[#1a1a1a] text-[#1a1a1a]'
        }`}
      >
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <h2 className="font-serif-display text-3xl font-bold tracking-tight text-[#1a1a1a]">
              {t.family.title}
            </h2>
            <span className="font-mono-meta text-[10px] uppercase font-bold px-2 py-0.5 border border-[#1a1a1a]/20">
              {t.status[isReleased ? 'released' : isHeld ? 'held' : 'preHandover']}
            </span>
          </div>
          <p className="text-xs text-[#1a1a1a]/75 max-w-2xl leading-relaxed">
            {isReleased
              ? t.family.releasedBanner
              : isHeld
              ? `Verification Held: ${handoverCase.holdReason || 'Discrepancy detected in submitted document'}. Please upload corrected proof.`
              : t.family.preHandoverBanner}
          </p>
        </div>

        {/* Action Button */}
        <div>
          {!isReleased && (
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-5 py-3 rounded-xs bg-[#1a1a1a] hover:bg-[#2b2b2b] text-[#f8f7f4] font-mono-meta text-xs uppercase tracking-widest font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-xs shrink-0"
            >
              <Upload className="w-4 h-4" />
              <span>{isHeld ? 'Re-upload Corrected Proof' : t.actions.requestHandover}</span>
            </button>
          )}

          {isReleased && (
            <div className="flex items-center gap-2.5">
              <button
                onClick={onOpenPassport}
                className="px-4 py-2.5 rounded-xs bg-white border border-[#1a1a1a] text-[#1a1a1a] text-xs font-mono-meta uppercase tracking-wider font-semibold transition-all cursor-pointer flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>View Passport</span>
              </button>
              <button
                onClick={onOpenClaims}
                className="px-4 py-2.5 rounded-xs bg-[#1a1a1a] hover:bg-[#2b2b2b] text-[#f8f7f4] text-xs font-mono-meta uppercase tracking-wider font-semibold transition-all cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Prepare Claims</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Review Progress Tracker */}
      <div className="bg-white rounded-xs border border-[#1a1a1a]/15 p-6 lg:p-8 shadow-xs">
        <div className="flex justify-between items-center mb-6 border-b border-[#1a1a1a]/10 pb-3">
          <span className="font-mono-meta text-[10px] uppercase tracking-widest text-[#1a1a1a]/60">
            {t.family.approvalProgress}
          </span>
          <span className="font-mono-meta text-xs text-[#1a1a1a] font-bold">
            {handoverCase.approvalsReceived.length} of {handoverCase.requiredApprovals} Independent Sign-offs
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 font-mono-meta text-xs">
          <div
            className={`p-4 rounded-xs border ${
              handoverCase.status !== 'pre_handover'
                ? 'bg-[#f4f7f4] border-[#4a5d4e] text-[#1a1a1a]'
                : 'bg-[#f8f7f4] border-[#1a1a1a]/10 text-[#1a1a1a]/50'
            }`}
          >
            <div className="font-bold uppercase text-[10px]">Step 1: Evidence Attached</div>
            <div className="text-[11px] mt-1 truncate">
              {handoverCase.documentAttached?.title || 'Pending upload'}
            </div>
          </div>

          <div
            className={`p-4 rounded-xs border ${
              handoverCase.approvalsReceived.includes('reviewer_anil')
                ? 'bg-[#f4f7f4] border-[#4a5d4e] text-[#1a1a1a]'
                : isHeld
                ? 'bg-[#fdf6f0] border-[#b54708] text-[#b54708]'
                : 'bg-[#f8f7f4] border-[#1a1a1a]/10 text-[#1a1a1a]/50'
            }`}
          >
            <div className="font-bold uppercase text-[10px]">Step 2: Reviewer 1 (Anil)</div>
            <div className="text-[11px] mt-1">
              {handoverCase.approvalsReceived.includes('reviewer_anil')
                ? 'Approved ✓'
                : isHeld
                ? 'Held For Verification'
                : 'Pending'}
            </div>
          </div>

          <div
            className={`p-4 rounded-xs border ${
              handoverCase.approvalsReceived.includes('reviewer_meera')
                ? 'bg-[#f4f7f4] border-[#4a5d4e] text-[#1a1a1a]'
                : 'bg-[#f8f7f4] border-[#1a1a1a]/10 text-[#1a1a1a]/50'
            }`}
          >
            <div className="font-bold uppercase text-[10px]">Step 3: Reviewer 2 (Meera)</div>
            <div className="text-[11px] mt-1">
              {handoverCase.approvalsReceived.includes('reviewer_meera')
                ? 'Approved ✓'
                : 'Pending'}
            </div>
          </div>

          <div
            className={`p-4 rounded-xs border ${
              isReleased
                ? 'bg-[#1a1a1a] text-[#f8f7f4] border-[#1a1a1a] font-bold'
                : 'bg-[#f8f7f4] border-[#1a1a1a]/10 text-[#1a1a1a]/40'
            }`}
          >
            <div className="uppercase text-[10px]">Step 4: Scoped Release</div>
            <div className="text-[11px] mt-1">
              {isReleased ? 'Unlocked & Authorized' : 'Guarded'}
            </div>
          </div>
        </div>
      </div>

      {/* Disclosed Asset Cards / Storage Locations */}
      <div className="bg-white rounded-xs border border-[#1a1a1a]/15 p-6 lg:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-[#1a1a1a]/10 pb-3">
          <div>
            <h3 className="font-serif-display text-2xl font-bold text-[#1a1a1a]">
              {isReleased ? 'Authorized Asset Schedule' : 'Emergency Document Storage Directory'}
            </h3>
            <p className="text-xs text-[#1a1a1a]/60 font-mono-meta mt-0.5">
              {isReleased
                ? 'Authorized by 2-party reviewer approval. Use claim checklists for payout.'
                : 'Physical locations where family papers and passbooks are stored.'}
            </p>
          </div>
          <span className="font-mono-meta text-xs text-[#1a1a1a]/60">
            {authorizedAssets.length} records designated
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {authorizedAssets.map((asset) => (
            <div
              key={asset.id}
              className="p-5 rounded-xs bg-[#f8f7f4] border border-[#1a1a1a]/15 space-y-3 text-xs"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-serif-display text-xl font-bold text-[#1a1a1a]">{asset.label}</h4>
                  <div className="text-[11px] text-[#1a1a1a]/60 font-mono-meta flex items-center gap-1.5 mt-0.5">
                    <Building className="w-3 h-3 text-[#1a1a1a]/60" />
                    <span>{asset.institutionName}</span>
                    <span>•</span>
                    <span>{asset.maskedReference}</span>
                  </div>
                </div>

                {isReleased ? (
                  <span className="font-mono-meta font-bold text-[#1a1a1a] text-sm">
                    {formatCurrency(
                      asset.amounts.balance || asset.amounts.insuranceCover || 0,
                      asset.currency
                    )}
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-xs bg-white text-[#1a1a1a]/70 border border-[#1a1a1a]/15 font-mono-meta text-[10px] flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5 text-[#b54708]" />
                    <span>Confidential</span>
                  </span>
                )}
              </div>

              {/* Physical Storage Location Box */}
              <div className="p-3 rounded-xs bg-white border border-[#1a1a1a]/10 flex items-start gap-2 text-[11px] text-[#1a1a1a]">
                <MapPin className="w-3.5 h-3.5 text-[#1a1a1a]/60 shrink-0 mt-0.5" />
                <div>
                  <span className="font-mono-meta text-[10px] text-[#1a1a1a]/50 block uppercase">
                    Physical Storage Coordinates:
                  </span>
                  <span className="font-medium">{asset.documentLocation || 'Check master family file'}</span>
                </div>
              </div>

              <div className="flex items-center justify-between font-mono-meta text-[10px] text-[#1a1a1a]/60 pt-1">
                <span>Beneficiary:</span>
                <span className="font-semibold text-[#1a1a1a]">
                  {asset.nomineeName || 'Direct Legal Heirs'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal: Upload Death / Incapacity Certificate */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-xs border-2 border-[#1a1a1a] shadow-2xl max-w-lg w-full p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-[#1a1a1a]/10 pb-3">
              <h3 className="font-serif-display text-2xl font-bold text-[#1a1a1a]">
                {t.family.attachCertificate}
              </h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-[#1a1a1a]/50 hover:text-[#1a1a1a] font-mono-meta text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-slate-600 text-xs">
              Select which synthetic document to submit for dual-reviewer inspection:
            </p>

            <div className="space-y-3 font-mono-meta">
              <label
                onClick={() => setSelectedDocToUpload('mismatch')}
                className={`p-4 rounded-xs border cursor-pointer block transition-all ${
                  selectedDocToUpload === 'mismatch'
                    ? 'bg-[#fdf6f0] border-[#b54708] text-[#1a1a1a]'
                    : 'bg-[#f8f7f4] border-[#1a1a1a]/10 text-[#1a1a1a]/70'
                }`}
              >
                <div className="flex items-center justify-between font-bold text-xs">
                  <span>📄 death_certificate_mismatch.txt</span>
                  <span className="text-[10px] px-1.5 py-0.2 bg-[#b54708]/15 text-[#b54708] border border-[#b54708]/30">
                    Tests Review Hold
                  </span>
                </div>
                <p className="text-[11px] font-sans text-[#1a1a1a]/70 mt-1">
                  Name written as <strong>"Ramesh Patil"</strong> (differs from "Ramesh Patel"). Triggers an audit hold.
                </p>
              </label>

              <label
                onClick={() => setSelectedDocToUpload('clean')}
                className={`p-4 rounded-xs border cursor-pointer block transition-all ${
                  selectedDocToUpload === 'clean'
                    ? 'bg-[#f4f7f4] border-[#4a5d4e] text-[#1a1a1a]'
                    : 'bg-[#f8f7f4] border-[#1a1a1a]/10 text-[#1a1a1a]/70'
                }`}
              >
                <div className="flex items-center justify-between font-bold text-xs">
                  <span>📄 death_certificate.txt</span>
                  <span className="text-[10px] px-1.5 py-0.2 bg-[#4a5d4e]/15 text-[#4a5d4e] border border-[#4a5d4e]/30">
                    Tests Clean Approval
                  </span>
                </div>
                <p className="text-[11px] font-sans text-[#1a1a1a]/70 mt-1">
                  Name written as <strong>"Ramesh Patel"</strong> (exact match). Allows Reviewers Anil and Meera to approve release.
                </p>
              </label>
            </div>

            <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#1a1a1a]/10 font-mono-meta">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 rounded-xs bg-[#f8f7f4] border border-[#1a1a1a]/20 text-[#1a1a1a] cursor-pointer text-xs"
              >
                {t.actions.close}
              </button>
              <button
                onClick={handleSubmitRequest}
                className="px-5 py-2 rounded-xs bg-[#1a1a1a] hover:bg-[#2b2b2b] text-[#f8f7f4] font-bold text-xs uppercase tracking-wider cursor-pointer"
              >
                {t.actions.submitReview}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
