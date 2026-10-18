import React, { useState, useId } from 'react';
import {
  ShieldCheck,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  Download,
  CheckCircle2,
  AlertTriangle,
  Info,
  X,
  FileCheck2,
  HardDriveDownload,
  Copy,
  Check,
} from 'lucide-react';
import { AssetItem, JapacLanguage } from '../types';
import {
  encryptAssetRegistry,
  downloadJsonFile,
  EncryptedBackupEnvelope,
  getAssetValuation,
} from '../utils/cryptoVault';
import { triggerConfetti } from '../utils/formatters';

interface ExportEncryptedBackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  assets: AssetItem[];
  currentLang?: JapacLanguage;
  ownerName?: string;
}

export const ExportEncryptedBackupModal: React.FC<ExportEncryptedBackupModalProps> = ({
  isOpen,
  onClose,
  assets,
  ownerName,
}) => {
  const [passphrase, setPassphrase] = useState('');
  const [confirmPassphrase, setConfirmPassphrase] = useState('');
  const [passwordHint, setPasswordHint] = useState('');
  const [showPassphrase, setShowPassphrase] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [includePlaintextSummary, setIncludePlaintextSummary] = useState(true);

  const [isEncrypting, setIsEncrypting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exportedEnvelope, setExportedEnvelope] = useState<EncryptedBackupEnvelope | null>(null);
  const [copiedChecksum, setCopiedChecksum] = useState(false);

  const passwordInputId = useId();
  const confirmPasswordInputId = useId();
  const hintInputId = useId();

  if (!isOpen) return null;

  // Evaluate password strength
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: 'Enter a passphrase', color: 'bg-zinc-200' };
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (pass.length >= 12) score += 1;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-rose-500' };
    if (score === 2) return { score: 2, label: 'Fair', color: 'bg-amber-500' };
    if (score === 3) return { score: 3, label: 'Good', color: 'bg-blue-500' };
    if (score === 4) return { score: 4, label: 'Strong', color: 'bg-emerald-600' };
    return { score: 5, label: 'Military-Grade (AES-256 Hardened)', color: 'bg-emerald-700' };
  };

  const strength = getPasswordStrength(passphrase);
  const passwordsMatch = passphrase === confirmPassphrase;
  const isFormValid = passphrase.length >= 8 && passwordsMatch;

  const handleExport = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (passphrase.length < 8) {
      setError('Please use a passphrase with at least 8 characters for cryptographic protection.');
      return;
    }

    if (!passwordsMatch) {
      setError('Passphrase confirmation does not match.');
      return;
    }

    setIsEncrypting(true);

    try {
      // Simulate micro delay so user sees cryptographic derivation process
      await new Promise((res) => setTimeout(res, 250));

      const envelope = await encryptAssetRegistry(assets, passphrase, {
        passwordHint: passwordHint.trim() || undefined,
        ownerName: ownerName || 'Estate Account Owner',
        note: includePlaintextSummary
          ? 'ReclaimAI Zero-Knowledge Encrypted Asset Registry Backup'
          : undefined,
      });

      const dateStr = new Date().toISOString().split('T')[0];
      const filename = `reclaimai_vault_backup_${dateStr}_${assets.length}assets.encrypted.json`;

      downloadJsonFile(JSON.stringify(envelope, null, 2), filename);
      setExportedEnvelope(envelope);
      triggerConfetti();
    } catch (err: any) {
      console.error('Export encryption failed:', err);
      setError(err?.message || 'Failed to encrypt backup. Please try again.');
    } finally {
      setIsEncrypting(false);
    }
  };

  const handleCopyChecksum = () => {
    if (exportedEnvelope?.sha256Checksum) {
      navigator.clipboard.writeText(exportedEnvelope.sha256Checksum);
      setCopiedChecksum(true);
      setTimeout(() => setCopiedChecksum(false), 2000);
    }
  };

  const resetAndClose = () => {
    setPassphrase('');
    setConfirmPassphrase('');
    setPasswordHint('');
    setError(null);
    setExportedEnvelope(null);
    onClose();
  };

  // Group assets by currency for preview
  const currencyTotals: Record<string, number> = {};
  for (const asset of assets) {
    const curr = asset.currency || 'INR';
    currencyTotals[curr] = (currencyTotals[curr] || 0) + getAssetValuation(asset);
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-backup-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="bg-[#fcfbf9] text-[#1a1a1a] rounded-xs border border-[#1a1a1a]/20 shadow-2xl max-w-xl w-full max-h-[92vh] flex flex-col overflow-hidden font-sans">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#1a1a1a]/15 bg-white flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xs bg-[#4a5d4e]/10 border border-[#4a5d4e]/25 flex items-center justify-center text-[#4a5d4e] shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono-meta text-[10px] uppercase tracking-widest text-[#4a5d4e] font-semibold bg-[#4a5d4e]/10 px-2 py-0.5 rounded-xs">
                  Zero-Knowledge Vault
                </span>
                <span className="font-mono-meta text-[10px] text-[#1a1a1a]/50">
                  AES-256-GCM
                </span>
              </div>
              <h2
                id="export-backup-modal-title"
                className="font-serif-display text-xl sm:text-2xl font-bold tracking-tight text-[#1a1a1a] mt-0.5"
              >
                Export Encrypted Asset Registry
              </h2>
            </div>
          </div>
          <button
            onClick={resetAndClose}
            aria-label="Close dialog"
            className="p-1.5 text-[#1a1a1a]/50 hover:text-[#1a1a1a] hover:bg-[#f2efe9] rounded-xs transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {exportedEnvelope ? (
            /* Success State */
            <div className="space-y-5 animate-in fade-in duration-300">
              <div className="p-4 bg-emerald-50/80 border border-emerald-300 rounded-xs flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <p className="font-semibold text-emerald-900 font-mono-meta uppercase tracking-wider">
                    Encrypted Backup Successfully Downloaded
                  </p>
                  <p className="text-emerald-800 leading-relaxed">
                    Your {assets.length} financial asset records have been sealed with client-side AES-256-GCM encryption. The encrypted JSON file has been saved to your local downloads folder.
                  </p>
                </div>
              </div>

              {/* Envelope Audit Details */}
              <div className="bg-white border border-[#1a1a1a]/15 rounded-xs p-4 space-y-3 font-mono-meta text-xs">
                <div className="flex justify-between pb-2 border-b border-[#1a1a1a]/10">
                  <span className="text-[#1a1a1a]/60">Export ID:</span>
                  <span className="font-semibold text-[#1a1a1a]">{exportedEnvelope.exportId}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-[#1a1a1a]/10">
                  <span className="text-[#1a1a1a]/60">Cryptographic Standard:</span>
                  <span className="font-semibold text-[#4a5d4e]">
                    AES-GCM-256 (PBKDF2 100k rounds)
                  </span>
                </div>
                <div className="flex justify-between pb-2 border-b border-[#1a1a1a]/10">
                  <span className="text-[#1a1a1a]/60">Protected Assets:</span>
                  <span className="font-semibold text-[#1a1a1a]">
                    {exportedEnvelope.assetCount} cataloged items
                  </span>
                </div>
                {exportedEnvelope.passwordHint && (
                  <div className="flex justify-between pb-2 border-b border-[#1a1a1a]/10">
                    <span className="text-[#1a1a1a]/60">Embedded Password Hint:</span>
                    <span className="font-semibold text-amber-800 italic">
                      "{exportedEnvelope.passwordHint}"
                    </span>
                  </div>
                )}
                <div>
                  <div className="flex items-center justify-between text-[11px] text-[#1a1a1a]/60 mb-1">
                    <span>SHA-256 Integrity Seal:</span>
                    <button
                      onClick={handleCopyChecksum}
                      className="inline-flex items-center gap-1 text-[10px] text-[#4a5d4e] hover:underline cursor-pointer"
                    >
                      {copiedChecksum ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-600">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy Hash</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="p-2 bg-[#f8f7f4] rounded-xs border border-[#1a1a1a]/10 font-mono text-[10px] break-all select-all text-[#1a1a1a]/80">
                    {exportedEnvelope.sha256Checksum}
                  </div>
                </div>
              </div>

              {/* Archival Advice */}
              <div className="p-3.5 bg-amber-50/70 border border-amber-300/80 rounded-xs flex items-start gap-3">
                <Info className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
                <div className="text-[11px] text-amber-900 leading-relaxed">
                  <strong>Safe Archival Recommendation:</strong> Store this encrypted file on an offline physical drive, cold storage USB, or encrypted NAS. To restore your registry at any time, simply drag and drop this file back into ReclaimAI using your passphrase.
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={resetAndClose}
                  className="px-5 py-2 rounded-xs bg-[#1a1a1a] hover:bg-[#2b2b2b] text-[#f8f7f4] font-mono-meta text-xs uppercase tracking-wider font-semibold cursor-pointer transition-all"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* Encryption Form */
            <form onSubmit={handleExport} className="space-y-5">
              {/* Scope & Asset Snapshot */}
              <div className="bg-white border border-[#1a1a1a]/15 rounded-xs p-3.5 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[#1a1a1a]/50 font-mono-meta text-[10px] uppercase tracking-wider block">
                    Backup Contents
                  </span>
                  <span className="font-semibold text-[#1a1a1a]">
                    {assets.length} Active Asset Records
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[#1a1a1a]/50 font-mono-meta text-[10px] uppercase tracking-wider block">
                    Total Estimated Valuations
                  </span>
                  <div className="font-mono font-semibold text-[#4a5d4e]">
                    {Object.entries(currencyTotals)
                      .map(([c, total]) => `${c} ${total.toLocaleString()}`)
                      .join(' · ') || '—'}
                  </div>
                </div>
              </div>

              {/* Passphrase Input */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label
                    htmlFor={passwordInputId}
                    className="font-mono-meta text-[11px] uppercase tracking-wider font-semibold text-[#1a1a1a]"
                  >
                    Set Master Passphrase <span className="text-rose-600">*</span>
                  </label>
                  <span className="text-[10px] font-mono-meta text-[#1a1a1a]/50">
                    Minimum 8 characters
                  </span>
                </div>
                <div className="relative">
                  <input
                    id={passwordInputId}
                    type={showPassphrase ? 'text' : 'password'}
                    value={passphrase}
                    onChange={(e) => setPassphrase(e.target.value)}
                    placeholder="Enter a strong, memorable passphrase..."
                    required
                    className="w-full px-3.5 py-2.5 bg-white border border-[#1a1a1a]/25 rounded-xs text-xs font-mono focus:outline-hidden focus:border-[#4a5d4e] focus:ring-1 focus:ring-[#4a5d4e] pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassphrase(!showPassphrase)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#1a1a1a]/50 hover:text-[#1a1a1a] cursor-pointer"
                    aria-label={showPassphrase ? 'Hide password' : 'Show password'}
                  >
                    {showPassphrase ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password Strength Bar */}
                {passphrase.length > 0 && (
                  <div className="pt-1 space-y-1">
                    <div className="flex items-center gap-1.5 h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${strength.color}`}
                        style={{ width: `${(strength.score / 5) * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] font-mono-meta">
                      <span className="text-[#1a1a1a]/60">Strength:</span>
                      <span className="font-semibold text-[#1a1a1a]">{strength.label}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Passphrase */}
              <div className="space-y-1.5">
                <label
                  htmlFor={confirmPasswordInputId}
                  className="font-mono-meta text-[11px] uppercase tracking-wider font-semibold text-[#1a1a1a]"
                >
                  Confirm Passphrase <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <input
                    id={confirmPasswordInputId}
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassphrase}
                    onChange={(e) => setConfirmPassphrase(e.target.value)}
                    placeholder="Re-type your passphrase..."
                    required
                    className={`w-full px-3.5 py-2.5 bg-white border rounded-xs text-xs font-mono focus:outline-hidden focus:ring-1 pr-10 ${
                      confirmPassphrase && !passwordsMatch
                        ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500'
                        : 'border-[#1a1a1a]/25 focus:border-[#4a5d4e] focus:ring-[#4a5d4e]'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#1a1a1a]/50 hover:text-[#1a1a1a] cursor-pointer"
                    aria-label={showConfirm ? 'Hide password' : 'Show password'}
                  >
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {confirmPassphrase && !passwordsMatch && (
                  <p className="text-[11px] text-rose-600 font-mono-meta">
                    Passphrase does not match.
                  </p>
                )}
              </div>

              {/* Optional Password Hint */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label
                    htmlFor={hintInputId}
                    className="font-mono-meta text-[11px] uppercase tracking-wider font-semibold text-[#1a1a1a]"
                  >
                    Password Hint <span className="text-[#1a1a1a]/40 font-normal">(Optional)</span>
                  </label>
                  <span className="text-[10px] text-[#1a1a1a]/50">
                    Visible in backup file header
                  </span>
                </div>
                <input
                  id={hintInputId}
                  type="text"
                  value={passwordHint}
                  onChange={(e) => setPasswordHint(e.target.value)}
                  placeholder="e.g. Grandma's first village + locker year"
                  maxLength={100}
                  className="w-full px-3.5 py-2 bg-white border border-[#1a1a1a]/20 rounded-xs text-xs focus:outline-hidden focus:border-[#4a5d4e] focus:ring-1 focus:ring-[#4a5d4e]"
                />
              </div>

              {/* Security Policy & Warning */}
              <div className="p-3 bg-[#f3f0e8] border border-[#1a1a1a]/15 rounded-xs flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#4a5d4e] shrink-0 mt-0.5" />
                <div className="text-[11px] text-[#1a1a1a]/80 leading-relaxed">
                  <strong className="text-[#1a1a1a]">Zero-Knowledge Guarantee:</strong> Encryption occurs entirely within your browser via the standard Web Crypto API. ReclaimAI cannot decrypt or recover this backup if you forget your passphrase.
                </div>
              </div>

              {error && (
                <div className="p-3 bg-rose-50 border border-rose-300 rounded-xs flex items-center gap-2 text-rose-800 text-xs">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#1a1a1a]/10">
                <button
                  type="button"
                  onClick={resetAndClose}
                  className="px-4 py-2 rounded-xs border border-[#1a1a1a]/20 text-[#1a1a1a] font-mono-meta text-xs uppercase tracking-wider font-semibold hover:bg-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!isFormValid || isEncrypting}
                  className={`px-5 py-2 rounded-xs text-[#f8f7f4] font-mono-meta text-xs uppercase tracking-wider font-semibold flex items-center gap-2 transition-all shadow-xs cursor-pointer ${
                    isFormValid && !isEncrypting
                      ? 'bg-[#1a1a1a] hover:bg-[#2b2b2b]'
                      : 'bg-[#1a1a1a]/40 cursor-not-allowed'
                  }`}
                >
                  {isEncrypting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Encrypting...</span>
                    </>
                  ) : (
                    <>
                      <HardDriveDownload className="w-4 h-4 text-emerald-400" />
                      <span>Encrypt & Download (.json)</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
