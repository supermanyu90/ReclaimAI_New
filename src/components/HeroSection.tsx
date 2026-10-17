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
    <div className="relative min-h-screen flex items-center justify-center">
      <WavyBackground />

      <div className="outer-wrap relative z-10 w-full max-w-[1400px] h-[860px] grid grid-cols-2 grid-rows-[auto_1fr_auto] border border-[#1a1a1a]/10 bg-[#fdfcf8]/80 backdrop-blur-3xl p-[60px] gap-[60px]">
        <header className="col-span-2 flex justify-between items-end pb-[40px] border-b border-[#1a1a1a]">
          <div className="logo font-serif-display italic font-medium text-[2.8rem] tracking-tighter">ReclaimAI</div>
          <div className="header-meta text-right font-mono text-[0.65rem] leading-relaxed uppercase tracking-[0.1em] text-[#1a1a1a]/60">
            Protocol: JAPAC.2024<br />
            Node: Active_Cloud_01<br />
            Status: AES-256 Encrypted
          </div>
        </header>

        <main className="content-left flex flex-col justify-center">
          <span className="label font-mono text-[0.7rem] text-[#b4916c] uppercase tracking-[0.2em] mb-[24px] block">Universal Estate Registry</span>
          <h1 className="font-serif-display italic font-light text-[5.5rem] leading-[1.05] mb-[40px]">Legacies,<br/>refined and<br/>protected.</h1>
          <p className="hero-desc text-[1.25rem] leading-[1.6] text-[#1a1a1a]/60 max-w-[480px] mb-[60px]">The modern path to financial claims. Simplified records, AI concierge assistance, and physical asset orchestration.</p>
          
          <div className="btn-stack flex flex-col gap-[12px] items-start">
            <button onClick={onGetStarted} className="btn-prime font-mono text-[0.8rem] bg-[#1a1a1a] text-[#fdfcf8] px-[40px] py-[20px] cursor-pointer border-none shadow-xs hover:bg-[#2b2b2b] transition-all">LAUNCH THE WORKSPACE</button>
            <button
              onClick={onExploreSlides || (() => document.getElementById('workflow-slides')?.scrollIntoView({ behavior: 'smooth' }))}
              className="btn font-mono text-[0.8rem] py-[12px] text-[#1a1a1a] border-b border-[#1a1a1a] hover:text-[#b4916c] hover:border-[#b4916c] cursor-pointer bg-transparent border-t-0 border-l-0 border-r-0 transition-colors uppercase tracking-wider"
            >
              HOW IT WORKS (SLIDES) ↓
            </button>
          </div>
        </main>

        <section className="content-right grid grid-rows-2 gap-[40px]">
          <div className="process-grid grid grid-cols-3 gap-[20px]">
            {[
                { title: '[01] PREPARE', desc: 'Maintain one golden record. Capture deposits, policies, and property deeds.' },
                { title: '[02] HANDOVER', desc: 'Governed family access. Unlocked via dual independent sign-off.' },
                { title: '[03] RECOVER', desc: 'Automated claim matching across regional registries.' }
            ].map(item => (
                <div key={item.title} className="process-item p-[20px] border border-[#1a1a1a]/10">
                    <h4 className="font-mono text-[0.7rem] text-[#b4916c] mb-[12px]">{item.title}</h4>
                    <p className="text-[0.85rem] text-[#1a1a1a]/60 leading-[1.5]">{item.desc}</p>
                </div>
            ))}
          </div>

          <div className="registry-panel bg-[#1a1a1a] text-[#fdfcf8] p-[40px] relative">
            <span className="label font-mono text-[0.7rem] text-[#fdfcf8]/40 uppercase tracking-[0.2em] mb-[24px] block">JAPAC Ledger State</span>
            <div className="tag-list grid grid-cols-2 gap-[12px] mt-[24px]">
              {['IND_7730: FD VERIFIED', 'JPN_0041: REIT LINKED', 'HKG_9921: MPF SYNCED', 'SGP_1102: CPF CHECKED'].map(tag => (
                  <div key={tag} className="tag-item font-mono text-[0.6rem] border border-white/10 p-[10px] opacity-80">{tag}</div>
              ))}
            </div>
            <p className="mt-[30px] text-[0.75rem] leading-[1.6] opacity-60">
              Compliant infrastructure for the modern family. Multi-sig governance ensures zero-knowledge privacy.
            </p>
          </div>
        </section>

        <footer className="col-span-2 flex justify-between items-center font-mono text-[0.6rem] text-[#1a1a1a]/60 border-t border-[#1a1a1a]/10 pt-[20px]">
          <div>PREPARE → HANDOVER → RECOVER</div>
          <div>CLIENT-SIDE CRYPTOGRAPHY • ZERO-KNOWLEDGE ARCHITECTURE</div>
          <div>© RECLAIMAI 2024</div>
        </footer>
      </div>
    </div>
  );
};
