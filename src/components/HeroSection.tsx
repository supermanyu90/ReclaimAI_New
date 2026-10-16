import React, { useState } from 'react';
import {
  ArrowRight,
  ShieldCheck,
  Lock,
  CheckCircle2,
  FileText,
  QrCode,
  Sparkles,
  Eye,
  Building,
  Key,
  ChevronRight,
} from 'lucide-react';
import { JapacLanguage } from '../types';
import { translations } from '../i18n/translations';

interface HeroSectionProps {
  currentLang: JapacLanguage;
  onGetStarted: () => void;
  onExplorePassport: () => void;
  onExploreQr: () => void;
  onOpenVoice?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  currentLang,
  onGetStarted,
  onExplorePassport,
  onExploreQr,
  onOpenVoice,
}) => {
  const t = translations[currentLang] || translations.en;
  const [activeInteractiveTab, setActiveInteractiveTab] = useState<'prepare' | 'handover' | 'recover'>('prepare');
  const [simulatedReleased, setSimulatedReleased] = useState(false);

  return (
    <section
      role="region"
      aria-label="Platform Hero and Overview"
      className="relative bg-[#f8f7f4] border-b border-[#1a1a1a]/15 text-[#1a1a1a] overflow-hidden"
    >
      {/* Subtle Archival Grid Background Texture */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none bg-[radial-gradient(#1a1a1a_1px,transparent_1px)] [background-size:24px_24px]"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 lg:py-16 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* LEFT COLUMN: Visual Hierarchy & Conversion Engine (7 Cols on desktop) */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Trust Pill / Category Identifier */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-[#1a1a1a]/15 rounded-xs shadow-xs font-mono-meta text-[11px] uppercase tracking-widest text-[#1a1a1a]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4a5d4e] animate-pulse" aria-hidden="true" />
              <span className="font-semibold">Financial Legacy Infrastructure</span>
              <span className="text-[#1a1a1a]/30">•</span>
              <span className="text-[#1a1a1a]/60">JAPAC Compliant</span>
            </div>

            {/* Editorial Serif Headline */}
            <h1 className="font-serif-display text-4xl sm:text-5xl lg:text-[3.5rem] font-semibold italic text-[#1a1a1a] tracking-tight leading-[1.02]">
              One maintained record. Controlled family access. A clearer path to claims.
            </h1>

            {/* Supporting Subheading */}
            <p className="text-sm sm:text-base text-[#1a1a1a]/80 max-w-xl font-sans leading-relaxed font-normal">
              Capture your bank deposits, policies, and property deeds conversationally. Affix tamper-evident physical QR seals, and ensure inheritances are unlocked only upon dual independent compliance sign-off.
            </p>

            {/* CTAs: Conversion focused */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 flex-wrap">
              {/* Primary CTA */}
              <button
                onClick={onGetStarted}
                className="group relative inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-[#1a1a1a] hover:bg-[#2b2b2b] text-[#f8f7f4] font-mono-meta text-xs uppercase tracking-widest font-semibold transition-all duration-150 cursor-pointer shadow-xs active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1a1a1a]"
              >
                <span>Launch Estate Workspace</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
              </button>

              {/* Voice Concierge CTA */}
              {onOpenVoice && (
                <button
                  onClick={onOpenVoice}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-[#1a1a1a] hover:bg-[#2b2b2b] text-[#f8f7f4] font-mono-meta text-xs uppercase tracking-widest font-semibold transition-all duration-150 cursor-pointer shadow-xs active:translate-y-px border border-white/20"
                >
                  <Sparkles className="w-4 h-4 text-emerald-400" aria-hidden="true" />
                  <span>Voice Concierge (Live 3.8)</span>
                </button>
              )}

              {/* Secondary CTA */}
              <button
                onClick={onExplorePassport}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-white hover:bg-[#f0eee9] text-[#1a1a1a] border border-[#1a1a1a]/25 font-mono-meta text-xs uppercase tracking-widest font-semibold transition-all duration-150 cursor-pointer shadow-xs active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1a1a1a]"
              >
                <FileText className="w-4 h-4 text-[#1a1a1a]/70" aria-hidden="true" />
                <span>View Sample Passport</span>
              </button>
            </div>

            {/* Trust Badges Bar */}
            <div className="pt-6 border-t border-[#1a1a1a]/10 grid grid-cols-3 gap-4 font-mono-meta text-xs">
              <div className="space-y-0.5">
                <span className="text-[10px] text-[#1a1a1a]/50 uppercase tracking-wider block">Governance</span>
                <span className="font-bold text-[#1a1a1a] text-xs">2-Key Multi-Sig</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-[#1a1a1a]/50 uppercase tracking-wider block">Physical Anchors</span>
                <span className="font-bold text-[#1a1a1a] text-xs">Level-H QR Seals</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-[#1a1a1a]/50 uppercase tracking-wider block">Coverage</span>
                <span className="font-bold text-[#1a1a1a] text-xs">9 JAPAC Jurisdictions</span>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Interactive Product Storytelling Mockup (5 Cols on desktop) */}
          <div className="lg:col-span-5 relative">
            {/* Frame containing the interactive device / archival card */}
            <div className="relative bg-white rounded-xs border-2 border-[#1a1a1a] shadow-lg p-5 sm:p-6 space-y-4">
              
              {/* Top Tab Navigator of the Mockup: Prepare → Handover → Recover */}
              <div className="flex items-center justify-between border-b border-[#1a1a1a]/10 pb-3">
                <div className="flex gap-1.5 font-mono-meta text-[10px] uppercase tracking-wider">
                  <button
                    onClick={() => setActiveInteractiveTab('prepare')}
                    className={`px-2.5 py-1 rounded-xs transition-colors cursor-pointer ${
                      activeInteractiveTab === 'prepare'
                        ? 'bg-[#1a1a1a] text-[#f8f7f4] font-bold'
                        : 'text-[#1a1a1a]/50 hover:text-[#1a1a1a]'
                    }`}
                  >
                    1. Prepare
                  </button>
                  <button
                    onClick={() => setActiveInteractiveTab('handover')}
                    className={`px-2.5 py-1 rounded-xs transition-colors cursor-pointer ${
                      activeInteractiveTab === 'handover'
                        ? 'bg-[#1a1a1a] text-[#f8f7f4] font-bold'
                        : 'text-[#1a1a1a]/50 hover:text-[#1a1a1a]'
                    }`}
                  >
                    2. Handover
                  </button>
                  <button
                    onClick={() => setActiveInteractiveTab('recover')}
                    className={`px-2.5 py-1 rounded-xs transition-colors cursor-pointer ${
                      activeInteractiveTab === 'recover'
                        ? 'bg-[#1a1a1a] text-[#f8f7f4] font-bold'
                        : 'text-[#1a1a1a]/50 hover:text-[#1a1a1a]'
                    }`}
                  >
                    3. Recover
                  </button>
                </div>

                <span className="font-mono-meta text-[9px] uppercase px-1.5 py-0.5 bg-[#f8f7f4] border border-[#1a1a1a]/15 text-[#1a1a1a]/60">
                  Interactive Preview
                </span>
              </div>

              {/* TAB 1: PREPARE (Conversational Logging & Archival Passport) */}
              {activeInteractiveTab === 'prepare' && (
                <div className="space-y-3.5 animate-in fade-in duration-200">
                  <div className="p-3 bg-[#f8f7f4] border border-[#1a1a1a]/10 rounded-xs space-y-1.5">
                    <div className="flex items-center justify-between font-mono-meta text-[9px] uppercase text-[#1a1a1a]/50">
                      <span>Conversational Ingestion</span>
                      <span className="text-[#4a5d4e] font-bold">OCR Verified 98%</span>
                    </div>
                    <div className="text-xs text-[#1a1a1a] font-serif-display text-base font-semibold">
                      "I opened a ₹5,00,000 3-year FD at State Bank"
                    </div>
                    <div className="text-[11px] font-mono-meta text-[#1a1a1a]/70 flex items-center gap-1.5 pt-1">
                      <Building className="w-3 h-3 text-[#1a1a1a]/50" />
                      <span>Sagar Bharat Bank • Fixed Deposit #7730</span>
                    </div>
                  </div>

                  {/* Passport Card Preview */}
                  <div className="p-3.5 bg-white border border-[#1a1a1a]/20 rounded-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-[#4a5d4e]" />
                        <span className="font-serif-display font-bold text-sm text-[#1a1a1a]">Family Asset Passport</span>
                      </div>
                      <span className="font-mono-meta text-[9px] uppercase px-1.5 py-0.2 bg-[#f4f7f4] text-[#4a5d4e] border border-[#4a5d4e]/30 font-bold">
                        Certified
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 font-mono-meta text-[10px] text-[#1a1a1a]/80">
                      <div className="p-2 bg-[#f8f7f4] rounded-xs">
                        <span className="text-[#1a1a1a]/50 block">Tracked Wealth:</span>
                        <span className="font-bold text-xs text-[#1a1a1a]">₹1,61,95,800</span>
                      </div>
                      <div className="p-2 bg-[#f8f7f4] rounded-xs">
                        <span className="text-[#1a1a1a]/50 block">Registered Nominee:</span>
                        <span className="font-semibold text-[#1a1a1a]">Priya Shah</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono-meta text-[#1a1a1a]/60 pt-1">
                      <span>Storage: Study Room Safe #2</span>
                      <button
                        onClick={onExploreQr}
                        className="text-[#1a1a1a] font-bold underline hover:opacity-80 cursor-pointer flex items-center gap-1"
                      >
                        <QrCode className="w-3 h-3" />
                        <span>Print Physical Tag</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: HANDOVER (Dual-Key Governance) */}
              {activeInteractiveTab === 'handover' && (
                <div className="space-y-3.5 animate-in fade-in duration-200">
                  <div className="p-3 bg-[#f8f7f4] border border-[#1a1a1a]/10 rounded-xs space-y-2">
                    <div className="flex items-center justify-between font-mono-meta text-[9px] uppercase text-[#1a1a1a]/50">
                      <span>Multi-Party Audit Gate</span>
                      <span className="text-[#b54708] font-bold">2 Approvals Required</span>
                    </div>

                    <div className="space-y-1.5 font-mono-meta text-[11px]">
                      <div className="flex items-center justify-between p-1.5 bg-white border border-[#1a1a1a]/10">
                        <span>Reviewer 1 (Anil Menon — KYC):</span>
                        <span className="font-bold text-[#4a5d4e]">Approved ✓</span>
                      </div>
                      <div className="flex items-center justify-between p-1.5 bg-white border border-[#1a1a1a]/10">
                        <span>Reviewer 2 (Meera Iyer — Legal):</span>
                        <span className={`font-bold ${simulatedReleased ? 'text-[#4a5d4e]' : 'text-[#b54708]'}`}>
                          {simulatedReleased ? 'Approved ✓' : 'Pending Sign-off'}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => setSimulatedReleased(!simulatedReleased)}
                      className="w-full py-1.5 bg-white hover:bg-[#f0eee9] border border-[#1a1a1a]/20 font-mono-meta text-[10px] uppercase font-bold text-[#1a1a1a] cursor-pointer"
                    >
                      {simulatedReleased ? 'Reset Reviewer 2 Sign-off' : 'Simulate Reviewer 2 Sign-off'}
                    </button>
                  </div>

                  {/* Scoped Result */}
                  <div className={`p-3 rounded-xs border text-xs font-mono-meta ${
                    simulatedReleased
                      ? 'bg-[#f4f7f4] border-[#4a5d4e] text-[#1a1a1a]'
                      : 'bg-white border-[#1a1a1a]/15 text-[#1a1a1a]/70'
                  }`}>
                    <div className="flex items-center gap-2 font-bold text-xs">
                      {simulatedReleased ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-[#4a5d4e]" />
                          <span>Status: Released &amp; Unlocked for Family</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4 text-[#b54708]" />
                          <span>Status: Pre-Handover Lock Active (Balances Hidden)</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: RECOVER (Dormant Account Discovery) */}
              {activeInteractiveTab === 'recover' && (
                <div className="space-y-3.5 animate-in fade-in duration-200">
                  <div className="p-3 bg-[#f8f7f4] border border-[#1a1a1a]/10 rounded-xs space-y-2">
                    <div className="flex items-center justify-between font-mono-meta text-[9px] uppercase text-[#1a1a1a]/50">
                      <span>Central Statutory Registers</span>
                      <span className="font-bold text-[#1a1a1a]">RBI UDGAM / DICJ</span>
                    </div>

                    <div className="p-2.5 bg-white border border-[#1a1a1a]/15 rounded-xs space-y-1 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="font-serif-display font-bold text-base text-[#1a1a1a]">R K Patel</span>
                        <span className="font-mono-meta text-[9px] font-bold bg-[#f4f7f4] text-[#4a5d4e] px-1.5 py-0.2 border border-[#4a5d4e]/30">
                          91/100 Strong Match
                        </span>
                      </div>
                      <div className="text-[11px] font-mono-meta text-[#1a1a1a]/70">
                        Sagar Bharat Bank • Fixed Deposit • ₹6,42,000
                      </div>
                    </div>

                    <div className="p-2 bg-[#fdf6f0] border border-[#b54708]/30 text-[10px] font-mono-meta text-[#b54708]">
                      Ruled-Out Accounts: "Ramesh Patil" excluded (Birthdate 1966 mismatch).
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom Card Footer */}
              <div className="pt-2 border-t border-[#1a1a1a]/10 flex items-center justify-between text-[10px] font-mono-meta text-[#1a1a1a]/50">
                <span>Cryptographic SHA-256 Ledger</span>
                <span className="text-[#4a5d4e] font-bold">100% Client-Side Verified</span>
              </div>

            </div>

            {/* Subtle floating accent pill behind mockup */}
            <div
              className="absolute -bottom-3 -right-3 w-full h-full bg-[#1a1a1a]/5 -z-10 rounded-xs"
              aria-hidden="true"
            />
          </div>

        </div>
      </div>
    </section>
  );
};
