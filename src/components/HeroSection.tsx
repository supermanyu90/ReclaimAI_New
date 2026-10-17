import React from 'react';
import { JapacLanguage } from '../types';
import { translations } from '../i18n/translations';
import { WavyBackground } from './WavyBackground';

interface HeroSectionProps {
  currentLang: JapacLanguage;
  onGetStarted: () => void;
  onExplorePassport: () => void;
  onExploreQr: () => void;
  onOpenVoice?: () => void;
  onExploreSlides?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  currentLang,
  onGetStarted,
  onExplorePassport,
  onExploreQr,
  onOpenVoice,
  onExploreSlides,
}) => {
  const t = translations[currentLang] || translations.en;

  return (
    <div className="relative min-h-screen flex items-center justify-center py-6 sm:py-10 px-4 sm:px-6 lg:px-8">
      <WavyBackground />

      <div className="outer-wrap relative z-10 w-full max-w-[1400px] min-h-[700px] lg:min-h-[800px] h-auto flex flex-col justify-between border border-[#1a1a1a]/15 bg-[#fdfcf8]/90 backdrop-blur-2xl p-6 sm:p-10 lg:p-12 xl:p-16 gap-8 lg:gap-12 rounded-xs shadow-xs">
        {/* Top Header */}
        <header className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-end pb-6 sm:pb-8 border-b border-[#1a1a1a] gap-4">
          <div>
            <div className="logo font-serif-display italic font-semibold text-3xl sm:text-4xl lg:text-[2.8rem] tracking-tight text-[#1a1a1a]">
              ReclaimAI
            </div>
            <span className="font-mono text-[10px] sm:text-[11px] text-[#b4916c] uppercase tracking-widest block mt-0.5">
              JAPAC Multi-Jurisdiction Financial Legacy
            </span>
          </div>
          <div className="header-meta text-left sm:text-right font-mono text-[0.65rem] sm:text-[0.7rem] leading-relaxed uppercase tracking-[0.1em] text-[#1a1a1a]/65">
            <div>Protocol: JAPAC.2026</div>
            <div>Node: Active_Cloud_Firestore</div>
            <div className="text-emerald-700 font-semibold">Status: AES-256 Encrypted</div>
          </div>
        </header>

        {/* Main Content Grid: Responsive 2 Columns */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 xl:gap-16 items-center flex-1 my-2">
          {/* Left Column: Vision & Primary Actions */}
          <main className="content-left lg:col-span-6 flex flex-col justify-center space-y-6">
            <div>
              <span className="label font-mono text-xs sm:text-[0.75rem] text-[#b4916c] uppercase tracking-[0.2em] font-semibold mb-3 block">
                Universal Estate Registry
              </span>
              <h1 className="font-serif-display italic font-light text-4xl sm:text-5xl md:text-6xl lg:text-[4.2rem] xl:text-[5rem] leading-[1.06] text-[#1a1a1a] tracking-tight">
                Legacies,<br />
                refined and<br />
                protected.
              </h1>
            </div>

            <p className="hero-desc text-base sm:text-lg lg:text-[1.15rem] leading-relaxed text-[#1a1a1a]/75 max-w-lg">
              The modern path to financial claims. Simplified records, AI concierge assistance, and physical asset orchestration across Singapore, India, Japan, and regional corridors.
            </p>

            <div className="btn-stack flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                onClick={onGetStarted}
                className="btn-prime font-mono text-xs sm:text-[0.8rem] bg-[#1a1a1a] hover:bg-[#2b2b2b] text-[#fdfcf8] px-8 py-4 sm:py-4.5 cursor-pointer border-none shadow-xs transition-all uppercase tracking-widest font-bold text-center"
              >
                LAUNCH THE WORKSPACE →
              </button>
              <button
                onClick={
                  onExploreSlides ||
                  (() => document.getElementById('workflow-slides')?.scrollIntoView({ behavior: 'smooth' }))
                }
                className="btn font-mono text-xs sm:text-[0.8rem] px-5 py-3 text-[#1a1a1a] border-b border-[#1a1a1a] hover:text-[#b4916c] hover:border-[#b4916c] cursor-pointer bg-transparent border-t-0 border-l-0 border-r-0 transition-colors uppercase tracking-wider text-center"
              >
                HOW IT WORKS (SLIDES) ↓
              </button>
            </div>
          </main>

          {/* Right Column: Process Stages & Ledger State */}
          <section className="content-right lg:col-span-6 flex flex-col justify-center space-y-6">
            {/* 3 Process Milestones */}
            <div className="process-grid grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {[
                {
                  title: '[01] PREPARE',
                  desc: 'Maintain one golden record. Capture deposits, insurance, and property deeds.',
                },
                {
                  title: '[02] HANDOVER',
                  desc: 'Governed family access. Unlocked via dual independent sign-off.',
                },
                {
                  title: '[03] RECOVER',
                  desc: 'Automated claim matching across regional registries (UDGAM, MAS).',
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="process-item p-4 sm:p-4.5 border border-[#1a1a1a]/15 bg-white/70 rounded-xs shadow-2xs space-y-2"
                >
                  <h4 className="font-mono text-xs font-bold text-[#b4916c] tracking-wider uppercase">
                    {item.title}
                  </h4>
                  <p className="text-xs text-[#1a1a1a]/70 leading-relaxed font-sans">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* JAPAC Ledger Terminal Panel */}
            <div className="registry-panel bg-[#1a1a1a] text-[#fdfcf8] p-5 sm:p-7 rounded-xs space-y-4 shadow-sm relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                <span className="font-mono text-[10px] sm:text-[11px] text-[#b4916c] uppercase tracking-[0.2em] font-semibold">
                  JAPAC Ledger State
                </span>
                <span className="font-mono text-[9px] text-white/50 uppercase tracking-widest">
                  Live Cryptographic Nodes
                </span>
              </div>

              <div className="tag-list grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  'IND_7730: FD VERIFIED',
                  'JPN_0041: REIT LINKED',
                  'HKG_9921: MPF SYNCED',
                  'SGP_1102: CPF CHECKED',
                ].map((tag) => (
                  <div
                    key={tag}
                    className="tag-item font-mono text-[10px] sm:text-[11px] border border-white/15 bg-white/5 px-3 py-2 text-white/90 rounded-xs flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                    <span className="truncate">{tag}</span>
                  </div>
                ))}
              </div>

              <p className="text-xs leading-relaxed text-white/65 font-sans pt-1 border-t border-white/10">
                Compliant infrastructure for cross-border families. Multi-sig governance ensures zero-knowledge privacy prior to certified release.
              </p>
            </div>
          </section>
        </div>

        {/* Bottom Footer */}
        <footer className="w-full flex flex-col sm:flex-row justify-between items-center font-mono text-[0.65rem] sm:text-[0.7rem] text-[#1a1a1a]/60 border-t border-[#1a1a1a]/15 pt-5 gap-3 text-center sm:text-left">
          <div>PREPARE → HANDOVER → RECOVER</div>
          <div className="hidden md:block">CLIENT-SIDE CRYPTOGRAPHY • ZERO-KNOWLEDGE ARCHITECTURE</div>
          <div>© RECLAIMAI 2026</div>
        </footer>
      </div>
    </div>
  );
};
