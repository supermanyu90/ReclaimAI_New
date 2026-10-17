import React, { useState } from 'react';
import { User } from 'firebase/auth';
import {
  Globe,
  ChevronDown,
  RefreshCw,
  Sparkles,
  LogIn,
  LogOut,
  Database,
  Radio,
  User as UserIcon,
} from 'lucide-react';
import { JapacLanguage, UserPersona } from '../types';
import { translations } from '../i18n/translations';

interface HeaderProps {
  currentLang: JapacLanguage;
  onSelectLang: (lang: JapacLanguage) => void;
  activePersona?: UserPersona;
  personas?: UserPersona[];
  onSelectPersona?: (persona: UserPersona) => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  user: User | null;
  onSignIn: () => void;
  onSignOut: () => void;
  isCloudSynced: boolean;
  onSyncDemoToCloud?: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenSlides?: () => void;
}

const LANGUAGE_LABELS: Record<JapacLanguage, { label: string; flag: string; region: string }> = {
  en: { label: 'English', flag: '🌏', region: 'Global / Singapore / AU' },
  ja: { label: '日本語', flag: '🇯🇵', region: 'Japan' },
  'zh-Hans': { label: '简体中文', flag: '🇸🇬', region: 'Singapore / Malaysia / CN' },
  'zh-Hant': { label: '繁體中文', flag: '🇭🇰', region: 'Hong Kong / Taiwan' },
  ko: { label: '한국어', flag: '🇰🇷', region: 'South Korea' },
  hi: { label: 'हिन्दी', flag: '🇮🇳', region: 'India' },
  id: { label: 'Bahasa Indonesia', flag: '🇮🇩', region: 'Indonesia' },
  th: { label: 'ภาษาไทย', flag: '🇹🇭', region: 'Thailand' },
  vi: { label: 'Tiếng Việt', flag: '🇻🇳', region: 'Vietnam' },
};

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  onSelectLang,
  activeTab,
  onSelectTab,
  user,
  onSignIn,
  onSignOut,
  isCloudSynced,
  onSyncDemoToCloud,
  searchQuery,
  onSearchChange,
  onOpenSlides,
}) => {
  const t = translations[currentLang] || translations.en;
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [authMenuOpen, setAuthMenuOpen] = useState(false);

  const navItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'workspace', label: t.tabs.workspace },
    { id: 'voice', label: 'Voice AI', badge: 'Live 3.8', icon: Radio },
    { id: 'chat', label: t.tabs.chat },
    { id: 'passport', label: 'Passport' },
    { id: 'qrvault', label: 'QR Vault' },
    { id: 'family', label: t.tabs.family },
    { id: 'reviews', label: t.tabs.reviews, badge: '2-Key' },
    { id: 'claims', label: t.tabs.claims },
    { id: 'recovery', label: t.tabs.recovery },
    { id: 'analytics', label: t.tabs.analytics },
  ];

  return (
    <header className="bg-[#111113] border-b border-[#F8F7F4]/10 text-[#F8F7F4] sticky top-0 z-40 transition-colors">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: Brand */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
          <div
            onClick={() => onSelectTab('overview')}
            className="cursor-pointer font-serif-display text-2xl font-semibold italic tracking-tight text-[#F8F7F4] hover:opacity-80 transition-opacity"
          >
            {t.appName}
          </div>
        </div>

        {/* Search Bar */}
        <div className="w-full md:max-w-xs relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search institution, label, date..."
            className="w-full pl-3 pr-3 py-1.5 rounded-xs bg-[#2b2b2e] border border-[#F8F7F4]/20 text-xs font-mono-meta focus:border-[#87a9ff] outline-none text-[#F8F7F4]"
          />
        </div>

        {/* Center: Navigation Links */}
        <nav className="flex items-center gap-4 sm:gap-6 overflow-x-auto max-w-full py-1 text-[11px] uppercase tracking-wider font-semibold font-mono-meta">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`transition-all whitespace-nowrap py-1 relative cursor-pointer ${
                  isActive
                    ? 'text-[#87a9ff] font-bold border-b-2 border-[#87a9ff]'
                    : 'text-[#F8F7F4]/50 hover:text-[#F8F7F4]'
                }`}
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span className="ml-1 text-[9px] px-1 py-0.2 rounded-xs bg-[#87a9ff]/20 text-[#87a9ff] font-mono">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right: JAPAC Enterprise Meta & Selectors */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => {
                setLangMenuOpen(!langMenuOpen);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xs bg-white border border-[#1a1a1a]/15 text-[#1a1a1a] text-[11px] font-mono-meta uppercase tracking-wider hover:border-[#1a1a1a] transition-all cursor-pointer shadow-xs"
            >
              <span>{LANGUAGE_LABELS[currentLang].flag}</span>
              <span className="hidden lg:inline">{LANGUAGE_LABELS[currentLang].label}</span>
              <ChevronDown className="w-3 h-3 text-[#1a1a1a]/50" />
            </button>

            {langMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setLangMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-60 rounded-xs bg-white border border-[#1a1a1a] shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100 font-mono-meta">
                  <div className="px-3 py-1.5 text-[9px] font-bold uppercase tracking-widest text-[#1a1a1a]/50 border-b border-[#1a1a1a]/10">
                    JAPAC Languages
                  </div>
                  <div className="max-h-64 overflow-y-auto py-1">
                    {(Object.keys(LANGUAGE_LABELS) as JapacLanguage[]).map((langKey) => {
                      const item = LANGUAGE_LABELS[langKey];
                      const isSelected = currentLang === langKey;
                      return (
                        <button
                          key={langKey}
                          onClick={() => {
                            onSelectLang(langKey);
                            setLangMenuOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-[#f8f7f4] transition-colors cursor-pointer ${
                            isSelected ? 'bg-[#f0eee9] font-bold text-[#1a1a1a]' : 'text-[#1a1a1a]/80'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span>{item.flag}</span>
                            <span>{item.label}</span>
                          </div>
                          {isSelected && <span className="text-[10px] text-[#4a5d4e]">●</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>



          {/* Auth & Firestore Cloud Status */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => {
                  setAuthMenuOpen(!authMenuOpen);
                  setLangMenuOpen(false);
                }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xs bg-[#1a1a1a] text-[#f8f7f4] text-[11px] font-mono-meta hover:bg-[#2b2b2b] transition-all cursor-pointer shadow-xs"
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="w-4 h-4 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-4 h-4 rounded-full bg-[#4a5d4e] text-[9px] flex items-center justify-center font-bold">
                    {(user.displayName || user.email || 'U')[0].toUpperCase()}
                  </div>
                )}
                <span className="hidden sm:inline font-semibold max-w-[100px] truncate">
                  {user.displayName?.split(' ')[0] || 'My Account'}
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Firestore Connected" />
                <ChevronDown className="w-3 h-3 text-white/50" />
              </button>

              {authMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setAuthMenuOpen(false)} />
                  <div className="absolute right-0 mt-2 w-72 rounded-xs bg-white border-2 border-[#1a1a1a] shadow-xl py-3 z-50 animate-in fade-in zoom-in-95 duration-100 font-mono-meta text-xs">
                    <div className="px-4 pb-2 border-b border-[#1a1a1a]/10">
                      <div className="font-bold text-[#1a1a1a] truncate">{user.displayName || 'Google Account'}</div>
                      <div className="text-[10px] text-[#1a1a1a]/60 truncate">{user.email}</div>
                      <div className="mt-2 flex items-center gap-1.5 text-[10px] text-[#4a5d4e] font-semibold">
                        <span className="w-2 h-2 rounded-full bg-[#4a5d4e]" />
                        <span>Connected to Firebase Firestore</span>
                      </div>
                    </div>

                    <div className="p-2 space-y-1">
                      {onSyncDemoToCloud && (
                        <button
                          onClick={() => {
                            onSyncDemoToCloud();
                            setAuthMenuOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 rounded-xs hover:bg-[#f8f7f4] text-[#1a1a1a] text-xs flex items-center gap-2 cursor-pointer"
                        >
                          <Database className="w-3.5 h-3.5 text-[#4a5d4e]" />
                          <span>Sync Local Ledger to Cloud</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          onSignOut();
                          setAuthMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xs hover:bg-red-50 text-red-700 text-xs flex items-center gap-2 cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out of Firebase</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button
              onClick={onSignIn}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xs bg-[#1a1a1a] text-[#f8f7f4] hover:bg-[#2b2b2b] text-[11px] font-mono-meta uppercase tracking-wider font-semibold transition-all cursor-pointer shadow-xs"
              title="Sign in with Google to persist assets into Firestore"
            >
              <LogIn className="w-3.5 h-3.5 text-emerald-400" />
              <span>Sign In</span>
            </button>
          )}

          {/* How It Works Slides Button */}
          <button
            onClick={() => {
              if (onOpenSlides) {
                onOpenSlides();
              } else {
                onSelectTab('overview');
                setTimeout(() => {
                  document.getElementById('workflow-slides')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }
            }}
            title="View Interactive Workflow Slides"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xs bg-white border border-[#1a1a1a]/15 text-[#1a1a1a] hover:border-[#b4916c] hover:text-[#b4916c] text-[11px] font-mono-meta uppercase tracking-wider font-semibold transition-all cursor-pointer shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#b4916c]" />
            <span className="hidden sm:inline">How It Works</span>
          </button>
        </div>
      </div>
    </header>
  );
};
