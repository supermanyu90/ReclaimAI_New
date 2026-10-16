import React, { useState } from 'react';
import {
  ShieldCheck,
  Sparkles,
  LogIn,
  Database,
  ArrowRight,
  Radio,
  FileText,
  UserCheck,
  Lock,
} from 'lucide-react';
import { JapacLanguage } from '../types';
import { translations } from '../i18n/translations';

interface AuthDemoGatewayProps {
  currentLang: JapacLanguage;
  onSelectMode: (mode: 'demo' | 'auth') => void;
  onSignIn: () => void;
  authError?: string | null;
}

export const AuthDemoGateway: React.FC<AuthDemoGatewayProps> = ({
  currentLang,
  onSelectMode,
  onSignIn,
  authError,
}) => {
  const t = translations[currentLang] || translations.en;

  return (
    <div className="fixed inset-0 z-50 bg-[#f8f7f4] flex items-center justify-center p-6 overflow-y-auto">
      {/* Subtle Background Texture */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none bg-[radial-gradient(#1a1a1a_1px,transparent_1px)] [background-size:24px_24px]"
        aria-hidden="true"
      />

      <div className="max-w-4xl w-full mx-auto space-y-8 relative z-10 my-auto">
        
        {/* Brand & Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-[#1a1a1a]/15 rounded-xs font-mono-meta text-[11px] uppercase tracking-widest text-[#1a1a1a] shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4a5d4e] animate-pulse" />
            <span>JAPAC Financial Legacy Infrastructure</span>
          </div>

          <h1 className="font-serif-display text-4xl sm:text-6xl font-semibold italic text-[#1a1a1a] tracking-tight">
            {t.appName}
          </h1>

          <p className="font-mono-meta text-xs sm:text-sm text-[#1a1a1a]/70 max-w-xl mx-auto">
            {t.tagline} • Choose how you wish to enter the platform.
          </p>

          {authError && (
            <div className="p-4 rounded-xs bg-amber-50 border border-amber-300 text-amber-900 font-mono-meta text-xs text-center max-w-md mx-auto">
              {authError}
            </div>
          )}
        </div>

        {/* Mode Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Card 1: Interactive Demo Mode */}
          <div className="bg-white rounded-xs border-2 border-[#1a1a1a] p-8 shadow-lg flex flex-col justify-between space-y-6 hover:border-[#4a5d4e] transition-all">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 bg-[#f4f7f4] text-[#4a5d4e] border border-[#4a5d4e]/30 font-mono-meta text-[10px] uppercase font-bold tracking-wider">
                  Sandbox Mode
                </span>
                <Radio className="w-5 h-5 text-[#4a5d4e]" />
              </div>

              <div className="space-y-2">
                <h3 className="font-serif-display text-2xl font-bold text-[#1a1a1a]">
                  Explore Interactive Demo
                </h3>
                <p className="text-xs text-[#1a1a1a]/75 leading-relaxed font-sans">
                  Experience pre-populated JAPAC estate records (India, Japan, Singapore, Hong Kong), test the AI Voice Concierge, simulate 2-key compliance reviews, and explore QR physical asset tags instantly without creating an account.
                </p>
              </div>

              <div className="space-y-1.5 font-mono-meta text-[11px] text-[#1a1a1a]/70">
                <div className="flex items-center gap-2">
                  <span className="text-[#4a5d4e]">✓</span>
                  <span>Pre-loaded multi-jurisdiction assets</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#4a5d4e]">✓</span>
                  <span>Interactive 2-key review &amp; family portals</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#4a5d4e]">✓</span>
                  <span>Gemini 3.8 Live voice assistant simulation</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onSelectMode('demo')}
              className="w-full py-3.5 bg-[#1a1a1a] hover:bg-[#2b2b2b] text-[#f8f7f4] font-mono-meta text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
            >
              <span>Launch Demo Mode</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 2: Sign-In / Create Account Mode */}
          <div className="bg-white rounded-xs border-2 border-[#1a1a1a] p-8 shadow-lg flex flex-col justify-between space-y-6 hover:border-[#1a1a1a] transition-all">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 bg-[#1a1a1a]/5 text-[#1a1a1a] border border-[#1a1a1a]/20 font-mono-meta text-[10px] uppercase font-bold tracking-wider">
                  Live Cloud Workspace
                </span>
                <Database className="w-5 h-5 text-[#1a1a1a]" />
              </div>

              <div className="space-y-2">
                <h3 className="font-serif-display text-2xl font-bold text-[#1a1a1a]">
                  Sign In / Create Account
                </h3>
                <p className="text-xs text-[#1a1a1a]/75 leading-relaxed font-sans">
                  Sign in with Google or create a secure cloud account backed by Firebase Firestore. Build and manage your family's actual portfolio with real-time cloud persistence, multi-device synchronization, and encrypted isolation.
                </p>
              </div>

              <div className="space-y-1.5 font-mono-meta text-[11px] text-[#1a1a1a]/70">
                <div className="flex items-center gap-2">
                  <span className="text-[#1a1a1a]">✓</span>
                  <span>Secure Google Auth &amp; Firebase Cloud</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#1a1a1a]">✓</span>
                  <span>Real-time cross-device data persistence</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#1a1a1a]">✓</span>
                  <span>Private encrypted family handover vault</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                onSelectMode('auth');
                onSignIn();
              }}
              className="w-full py-3.5 bg-white hover:bg-[#f8f7f4] text-[#1a1a1a] border-2 border-[#1a1a1a] font-mono-meta text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
            >
              <LogIn className="w-4 h-4 text-[#4a5d4e]" />
              <span>Sign In with Google / Account</span>
            </button>
          </div>

        </div>

        {/* Footer info */}
        <div className="text-center font-mono-meta text-[10px] text-[#1a1a1a]/50 uppercase tracking-widest pt-2">
          Secure JAPAC Protocol • Client-Side Cryptography • Zero-Knowledge Architecture
        </div>

      </div>
    </div>
  );
};
