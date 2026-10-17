import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  QrCode,
  Lock,
  Search,
  Sparkles,
  FileText,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Database,
  Radio,
  Building,
  Key,
} from 'lucide-react';
import { JapacLanguage } from '../types';

interface WorkflowSlidesProps {
  currentLang?: JapacLanguage;
  onNavigateTab?: (tabId: string) => void;
}

interface SlideData {
  id: string;
  stepNumber: string;
  category: string;
  title: string;
  tagline: string;
  summary: string;
  highlights: { title: string; desc: string; icon: any }[];
  visualType: 'architecture' | 'voice' | 'qr' | 'multisig' | 'recovery';
  actionLabel: string;
  targetTab: string;
}

const SLIDES: SlideData[] = [
  {
    id: 'overview',
    stepNumber: '01 // ARCHITECTURE',
    category: 'End-to-End Continuity Protocol',
    title: 'One Maintained Record. Controlled Succession.',
    tagline: 'Bridging conversational AI, tamper-evident physical QR seals, and multi-sig compliance governance.',
    summary:
      'ReclaimAI unifies family wealth documentation, physical anchor storage, and death verification across JAPAC jurisdictions into a single cryptographically signed, zero-trust ledger.',
    highlights: [
      {
        title: 'Zero-Trust Storage',
        desc: 'Asset valuations remain masked and protected prior to official multi-party handover release.',
        icon: Lock,
      },
      {
        title: 'Client-Side Cryptography',
        desc: 'Every record and transaction is stamped with a deterministic SHA-256 HMAC hash.',
        icon: ShieldCheck,
      },
      {
        title: 'Air-Gapped Portability',
        desc: 'Export and restore complete ledger snapshots to JSON/CSV for local, non-custodial custody.',
        icon: Database,
      },
    ],
    visualType: 'architecture',
    actionLabel: 'Explore Portfolio Ledger',
    targetTab: 'workspace',
  },
  {
    id: 'ingest',
    stepNumber: '02 // PREPARE',
    category: 'Conversational & Document Ingestion',
    title: 'Conversational Voice AI & Document OCR',
    tagline: 'Describe assets naturally or upload deposit advice; AI extracts institutions, nominees, and balances.',
    summary:
      'Testators simply speak to the Gemini 3.8 Live Voice Concierge or text with the Legacy Chat. The ingestion agent automatically structures banking terms, identifies unverified nominees, and calculates estate risk scores.',
    highlights: [
      {
        title: 'Live Multimodal Voice',
        desc: 'Low-latency conversational speech capture supporting real-time streaming in 9 JAPAC languages.',
        icon: Radio,
      },
      {
        title: 'Automated Entity OCR',
        desc: 'Extracts institution branch IFSC/SWIFT codes, maturity dates, and policy numbers instantly.',
        icon: Sparkles,
      },
      {
        title: 'Automated Risk Assessment',
        desc: 'Identifies unregistered nominees, missing custody locations, and aging accounts before handover.',
        icon: AlertTriangle,
      },
    ],
    visualType: 'voice',
    actionLabel: 'Test Voice Concierge',
    targetTab: 'voice',
  },
  {
    id: 'qr',
    stepNumber: '03 // ANCHOR',
    category: 'Tamper-Evident Physical Sealing',
    title: 'Cryptographic Physical QR Vault',
    tagline: 'Affix tamper-evident Level-H QR seals to physical passbooks, locker keys, and property deeds.',
    summary:
      'Digital accounts frequently get lost because heirs cannot locate physical paper certificates. ReclaimAI generates printable, HMAC-signed physical tags and official archival PDF certificates with exact safe and locker coordinates.',
    highlights: [
      {
        title: 'Level-H Error Correction',
        desc: 'QR tags remain scannable even if physical paper edges are stained, torn, or aged over decades.',
        icon: QrCode,
      },
      {
        title: 'Printable Asset Certificates',
        desc: 'Generate official archival PDF certificates with tamper-evident cryptographic borders and hashes.',
        icon: FileText,
      },
      {
        title: 'Offline Field Scanner',
        desc: 'Family members can scan tags with any camera to verify authenticity without needing a login.',
        icon: ShieldCheck,
      },
    ],
    visualType: 'qr',
    actionLabel: 'Generate QR Labels',
    targetTab: 'qrvault',
  },
  {
    id: 'multisig',
    stepNumber: '04 // GOVERN',
    category: 'Dual-Reviewer Multi-Sig Handover',
    title: '2-Key Independent Compliance Gate',
    tagline: 'Inheritances are unlocked only upon dual independent KYC and Legal verification.',
    summary:
      'To prevent premature disclosures, intra-family disputes, and fraudulent claims, ReclaimAI enforces a 2-of-2 independent reviewer gate. Sensitive financial balances stay hidden until both independent credentials approve the evidence.',
    highlights: [
      {
        title: 'Reviewer 1: KYC / Vital Records',
        desc: 'Examiner verifies the death or incapacity certificate against municipal registry serial numbers.',
        icon: UserCheck,
      },
      {
        title: 'Reviewer 2: Legal & Succession',
        desc: 'Estate counsel checks for legal caveats, conflicting wills, and statutory nominee validity.',
        icon: Key,
      },
      {
        title: 'Automated Fraud Discrepancy Gate',
        desc: 'Name spelling mismatches automatically trigger an audit hold before release can occur.',
        icon: Lock,
      },
    ],
    visualType: 'multisig',
    actionLabel: 'Inspect 2-Key Console',
    targetTab: 'reviews',
  },
  {
    id: 'recover',
    stepNumber: '05 // RECLAIM',
    category: 'Central Statutory Discovery',
    title: 'Algorithmic Matching Across JAPAC Registries',
    tagline: 'Reclaim dormant deposits from central banking authorities across India, Singapore, Japan, and HK.',
    summary:
      'Tens of billions in forgotten family capital sit in dormant bank accounts. ReclaimAI cross-references estate records against central statutory databases (RBI UDGAM, MAS, DICJ, HKMA) and provides jurisdiction-grounded claim checklists.',
    highlights: [
      {
        title: 'Automated Statutory Matching',
        desc: 'Cross-checks central dormant databases across 9 Asian jurisdictions with weighted confidence scores.',
        icon: Search,
      },
      {
        title: 'False Positive Exclusion',
        desc: 'Algorithmic rationale explains why similar-sounding names are excluded (e.g. birthdate discrepancies).',
        icon: CheckCircle2,
      },
      {
        title: 'Institutional Claim Kits',
        desc: 'Step-by-step documentation guides (Legal Heir Certificate, Succession Affidavit, Form 16).',
        icon: Building,
      },
    ],
    visualType: 'recovery',
    actionLabel: 'Search Unclaimed Registries',
    targetTab: 'claims',
  },
];

export const WorkflowSlides: React.FC<WorkflowSlidesProps> = ({ onNavigateTab }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  const activeSlide = SLIDES[currentSlideIndex];
  const autoPlayDuration = 7000; // 7 seconds per slide

  useEffect(() => {
    if (!isPlaying) {
      setProgress(0);
      return;
    }

    const intervalTime = 50;
    const step = (intervalTime / autoPlayDuration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentSlideIndex((curr) => (curr + 1) % SLIDES.length);
          return 0;
        }
        return prev + step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPlaying, currentSlideIndex]);

  const goToSlide = (index: number) => {
    setCurrentSlideIndex(index);
    setProgress(0);
  };

  const nextSlide = () => {
    setCurrentSlideIndex((curr) => (curr + 1) % SLIDES.length);
    setProgress(0);
  };

  const prevSlide = () => {
    setCurrentSlideIndex((curr) => (curr - 1 + SLIDES.length) % SLIDES.length);
    setProgress(0);
  };

  return (
    <section
      id="workflow-slides"
      className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-10 space-y-6"
    >
      {/* Section Header & Slide Progress Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#1a1a1a]/15 pb-4 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#b4916c] animate-pulse" />
            <span className="font-mono text-[11px] uppercase tracking-widest text-[#b4916c] font-semibold">
              Interactive Platform Workflow
            </span>
          </div>
          <h2 className="font-serif-display text-3xl sm:text-4xl font-semibold italic text-[#1a1a1a] tracking-tight">
            How ReclaimAI Works: Architecture &amp; Lifecycle
          </h2>
        </div>

        {/* Global Slide Navigation & Autoplay Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xs border border-[#1a1a1a]/20 bg-white hover:bg-[#f8f7f4] font-mono text-[11px] uppercase tracking-wider text-[#1a1a1a] cursor-pointer shadow-xs transition-all"
            title={isPlaying ? 'Pause Autoplay' : 'Resume Autoplay'}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 text-[#b4916c]" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-[#b4916c]" />
                <span>Auto-Run</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-1">
            <button
              onClick={prevSlide}
              aria-label="Previous Slide"
              className="p-2 rounded-xs border border-[#1a1a1a]/20 bg-white hover:bg-[#f8f7f4] text-[#1a1a1a] cursor-pointer transition-all shadow-xs"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono text-xs px-2 text-[#1a1a1a]/70">
              {String(currentSlideIndex + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
            </span>
            <button
              onClick={nextSlide}
              aria-label="Next Slide"
              className="p-2 rounded-xs border border-[#1a1a1a]/20 bg-white hover:bg-[#f8f7f4] text-[#1a1a1a] cursor-pointer transition-all shadow-xs"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Slide Navigation Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {SLIDES.map((slide, idx) => {
          const isActive = idx === currentSlideIndex;
          return (
            <button
              key={slide.id}
              onClick={() => goToSlide(idx)}
              className={`p-3 text-left rounded-xs border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                isActive
                  ? 'bg-white border-[#1a1a1a] shadow-md ring-1 ring-[#1a1a1a]/10'
                  : 'bg-white/60 border-[#1a1a1a]/10 hover:bg-white hover:border-[#1a1a1a]/30'
              }`}
            >
              {isActive && isPlaying && (
                <div
                  className="absolute bottom-0 left-0 h-1 bg-[#b4916c] transition-all duration-75 ease-linear"
                  style={{ width: `${progress}%` }}
                />
              )}
              <span className="font-mono text-[9px] uppercase tracking-wider text-[#b4916c] font-bold block mb-1">
                {slide.stepNumber}
              </span>
              <span className={`text-xs font-semibold truncate ${isActive ? 'text-[#1a1a1a]' : 'text-[#1a1a1a]/60'}`}>
                {slide.category}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Slide Card Showcase */}
      <div className="bg-white rounded-xs border-2 border-[#1a1a1a] shadow-xl overflow-hidden transition-all duration-300">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px]">
          
          {/* Left Column: Explanatory Context & Key Drivers (7 Cols) */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-[#b4916c]/10 text-[#b4916c] border border-[#b4916c]/25 font-mono text-[10px] uppercase font-bold tracking-widest">
                  {activeSlide.stepNumber}
                </span>
                <span className="font-mono text-[11px] text-[#1a1a1a]/50 uppercase tracking-widest">
                  {activeSlide.category}
                </span>
              </div>

              <h3 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-semibold italic text-[#1a1a1a] tracking-tight leading-[1.05]">
                {activeSlide.title}
              </h3>

              <p className="font-serif-display text-base sm:text-lg text-[#b4916c] italic font-medium leading-relaxed">
                "{activeSlide.tagline}"
              </p>

              <p className="text-xs sm:text-sm text-[#1a1a1a]/75 leading-relaxed font-sans">
                {activeSlide.summary}
              </p>

              {/* Three Bullet Point Highlights */}
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
                {activeSlide.highlights.map((h, i) => {
                  const Icon = h.icon;
                  return (
                    <div
                      key={i}
                      className="p-3 bg-[#fdfcf8] border border-[#1a1a1a]/10 rounded-xs space-y-1.5"
                    >
                      <div className="flex items-center gap-1.5 text-[#b4916c]">
                        <Icon className="w-3.5 h-3.5" />
                        <span className="font-bold text-[10px] uppercase tracking-wider text-[#1a1a1a]">
                          {h.title}
                        </span>
                      </div>
                      <p className="font-sans text-[11px] text-[#1a1a1a]/70 leading-normal">
                        {h.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Action Station */}
            <div className="pt-4 border-t border-[#1a1a1a]/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <span className="font-mono text-[10px] text-[#1a1a1a]/50 uppercase tracking-widest">
                Integrated in Production Ledger
              </span>

              {onNavigateTab && (
                <button
                  onClick={() => onNavigateTab(activeSlide.targetTab)}
                  className="px-5 py-2.5 bg-[#1a1a1a] hover:bg-[#2b2b2b] text-[#fdfcf8] font-mono text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                >
                  <span>{activeSlide.actionLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#b4916c]" />
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Live Interactive Architectural Visual Mockup (5 Cols) */}
          <div className="lg:col-span-5 bg-[#1a1a1a] text-[#fdfcf8] p-6 sm:p-8 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-[#1a1a1a]/15 relative overflow-hidden">
            {/* Ambient Background Graphic */}
            <div
              className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#b4916c_1px,transparent_1px)] [background-size:16px_16px]"
              aria-hidden="true"
            />

            {/* Visual Header */}
            <div className="relative z-10 flex items-center justify-between pb-3 border-b border-white/10 font-mono text-[10px] uppercase tracking-widest text-[#b4916c]">
              <span>System Verification View</span>
              <span className="px-1.5 py-0.5 border border-white/20 text-white/70">
                AES-256 / SHA-256
              </span>
            </div>

            {/* Dynamic Visual Content depending on slide visualType */}
            <div className="relative z-10 py-6 my-auto">
              
              {/* SLIDE 1 VISUAL: ARCHITECTURE */}
              {activeSlide.visualType === 'architecture' && (
                <div className="space-y-3 font-mono text-xs animate-in fade-in duration-300">
                  <div className="p-3 bg-white/5 border border-white/10 rounded-xs space-y-1">
                    <div className="text-[10px] text-[#b4916c] uppercase">Phase 01: Capture</div>
                    <div className="text-white text-sm font-serif-display italic">Voice &amp; Multi-Jurisdiction OCR Ingestion</div>
                  </div>
                  <div className="text-center text-[#b4916c] text-xs">↓</div>
                  <div className="p-3 bg-white/5 border border-white/10 rounded-xs space-y-1">
                    <div className="text-[10px] text-[#b4916c] uppercase">Phase 02: Governance</div>
                    <div className="text-white text-sm font-serif-display italic">2-Key Multi-Sig Compliance Gateway</div>
                  </div>
                  <div className="text-center text-[#b4916c] text-xs">↓</div>
                  <div className="p-3 bg-white/5 border border-white/10 rounded-xs space-y-1">
                    <div className="text-[10px] text-[#b4916c] uppercase">Phase 03: Reclaim</div>
                    <div className="text-white text-sm font-serif-display italic">RBI UDGAM • MAS • DICJ Registry Match</div>
                  </div>
                </div>
              )}

              {/* SLIDE 2 VISUAL: VOICE & OCR */}
              {activeSlide.visualType === 'voice' && (
                <div className="space-y-4 font-mono text-xs animate-in fade-in duration-300">
                  <div className="p-3.5 bg-white/5 border border-white/10 rounded-xs space-y-2">
                    <div className="flex items-center justify-between text-[10px] text-white/50">
                      <span>Live Audio Stream</span>
                      <span className="text-[#b4916c] font-bold">Gemini 3.8 Live</span>
                    </div>
                    <div className="flex items-center gap-1.5 py-1 text-[#b4916c]">
                      {[40, 70, 95, 60, 85, 45, 100, 65, 80, 50, 90, 40].map((h, i) => (
                        <div
                          key={i}
                          className="w-1.5 bg-[#b4916c] rounded-full transition-all animate-pulse"
                          style={{ height: `${h * 0.25}px`, animationDelay: `${i * 100}ms` }}
                        />
                      ))}
                    </div>
                    <div className="text-xs text-white/90 italic font-serif-display">
                      "I hold a ₹50,00,000 fixed deposit at State Bank with nominee Priya."
                    </div>
                  </div>

                  <div className="p-3 bg-[#b4916c]/15 border border-[#b4916c]/40 rounded-xs space-y-1 text-[11px]">
                    <div className="text-[10px] uppercase text-[#b4916c] font-bold">Extracted Asset Record</div>
                    <div className="text-white font-semibold">Sagar Bharat Bank • Fixed Deposit</div>
                    <div className="text-white/70 text-[10px]">Currency: INR • Status: Verified OCR</div>
                  </div>
                </div>
              )}

              {/* SLIDE 3 VISUAL: QR VAULT */}
              {activeSlide.visualType === 'qr' && (
                <div className="space-y-3 font-mono text-xs text-center animate-in fade-in duration-300">
                  <div className="p-4 bg-white text-[#1a1a1a] rounded-xs space-y-2 inline-block mx-auto">
                    <QrCode className="w-24 h-24 text-[#1a1a1a] mx-auto" />
                    <div className="text-[9px] uppercase font-bold tracking-widest text-[#1a1a1a]">
                      LEVEL-H VERIFIED
                    </div>
                  </div>
                  <div className="text-[11px] text-white/80 space-y-1">
                    <div className="font-bold text-[#b4916c]">HMAC: 0x8f2a...c10b</div>
                    <div className="text-[10px] text-white/50">Storage: Study Room Safe #2, Shelf B</div>
                  </div>
                </div>
              )}

              {/* SLIDE 4 VISUAL: MULTI-SIG REVIEWERS */}
              {activeSlide.visualType === 'multisig' && (
                <div className="space-y-3 font-mono text-xs animate-in fade-in duration-300">
                  <div className="p-3 bg-white/5 border border-white/10 rounded-xs flex items-center justify-between">
                    <div>
                      <div className="text-white font-semibold">Reviewer 1 (KYC): Anil Menon</div>
                      <div className="text-[10px] text-white/50">Vital Registry Serial Verified</div>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-bold">
                      SIGNED ✓
                    </span>
                  </div>

                  <div className="p-3 bg-white/5 border border-white/10 rounded-xs flex items-center justify-between">
                    <div>
                      <div className="text-white font-semibold">Reviewer 2 (Legal): Meera Iyer</div>
                      <div className="text-[10px] text-white/50">Testamentary Caveat Clearance</div>
                    </div>
                    <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[9px] font-bold">
                      REQUIRED (2/2)
                    </span>
                  </div>

                  <div className="p-2.5 bg-white/5 border border-white/10 text-[10px] text-[#b4916c] flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Balances cryptographically locked until sign-off completion.</span>
                  </div>
                </div>
              )}

              {/* SLIDE 5 VISUAL: RECOVERY */}
              {activeSlide.visualType === 'recovery' && (
                <div className="space-y-2.5 font-mono text-xs animate-in fade-in duration-300">
                  <div className="p-2.5 bg-white/5 border border-white/10 rounded-xs flex items-center justify-between">
                    <span>RBI UDGAM (India)</span>
                    <span className="text-emerald-400 font-bold">91/100 MATCH</span>
                  </div>
                  <div className="p-2.5 bg-white/5 border border-white/10 rounded-xs flex items-center justify-between">
                    <span>MAS / CPF (Singapore)</span>
                    <span className="text-emerald-400 font-bold">ACTIVE REGISTRY</span>
                  </div>
                  <div className="p-2.5 bg-white/5 border border-white/10 rounded-xs flex items-center justify-between">
                    <span>DICJ (Japan)</span>
                    <span className="text-white/60">CHECKLIST READY</span>
                  </div>
                  <div className="p-2.5 bg-[#b4916c]/10 border border-[#b4916c]/30 text-[10px] text-[#b4916c]">
                    Automated checklist generated: Succession Affidavit + Form 16.
                  </div>
                </div>
              )}

            </div>

            {/* Visual Footer Meta */}
            <div className="relative z-10 pt-3 border-t border-white/10 flex items-center justify-between font-mono text-[9px] text-white/40 uppercase">
              <span>JAPAC ESTATE PROTOCOL</span>
              <span>SLIDE {currentSlideIndex + 1} OF 5</span>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
