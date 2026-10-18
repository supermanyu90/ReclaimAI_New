import React, { useState, useId } from 'react';
import {
  Lock,
  Unlock,
  KeyRound,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertTriangle,
  Info,
  X,
  FileCheck2,
  RefreshCw,
  FolderInput,
} from 'lucide-react';
import { AssetItem, JapacLanguage } from '../types';
import {
  EncryptedBackupEnvelope,
  decryptAssetRegistry,
  DecryptedPayload,
  getAssetValuation,
} from '../utils/cryptoVault';
import { formatCurrency, triggerConfetti } from '../utils/formatters';

interface DecryptRestoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  envelope: EncryptedBackupEnvelope | null;
  onRestore: (assets: AssetItem[], mode: 'merge' | 'replace') => Promise<void> | void;
  currentLang?: JapacLanguage;
}

export const DecryptRestoreModal: React.FC<DecryptRestoreModalProps> = ({
  isOpen,
  onClose,
  envelope,
  onRestore,
}) => {
  const [passphrase, setPassphrase] = useState('');
  const [showPassphrase, setShowPassphrase] = useState(false);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [decryptedPayload, setDecryptedPayload] = useState<DecryptedPayload | null>(null);
  const [restoreMode, setRestoreMode] = useState<'merge' | 'replace'>('merge');
  const [isRestoring, setIsRestoring] = useState(false);
  const [restoredSuccess, setRestoredSuccess] = useState(false);

  const passwordInputId = useId();

  if (!isOpen || !envelope) return null;

  const handleDecrypt = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!passphrase.trim()) {
      setError('Please enter your backup passphrase.');
      return;
    }

    setIsDecrypting(true);
    try {
      // Simulate slight micro-delay for smooth UI feel
      await new Promise((res) => setTimeout(res, 200));

      const payload = await decryptAssetRegistry(envelope, passphrase);
      setDecryptedPayload(payload);
    } catch (err: any) {
      console.error('Decryption failed:', err);
      setError(err?.message || 'Decryption failed. Please check your password.');
    } finally {
      setIsDecrypting(false);
    }
  };

  const handleConfirmRestore = async () => {
    if (!decryptedPayload) return;
    setIsRestoring(true);
    setError(null);
    try {
      await onRestore(decryptedPayload.assets, restoreMode);
      setRestoredSuccess(true);
      triggerConfetti();
    } catch (err: any) {
      console.error('Restore error:', err);
      setError(err?.message || 'Failed to restore assets to ledger.');
    } finally {
      setIsRestoring(false);
    }
  };

  const resetAndClose = () => {
    setPassphrase('');
    setError(null);
    setDecryptedPayload(null);
    setRestoredSuccess(false);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="decrypt-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="bg-[#fcfbf9] text-[#1a1a1a] rounded-xs border border-[#1a1a1a]/20 shadow-2xl max-w-xl w-full max-h-[92vh] flex flex-col overflow-hidden font-sans">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#1a1a1a]/15 bg-white flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xs bg-[#4a5d4e]/10 border border-[#4a5d4e]/25 flex items-center justify-center text-[#4a5d4e] shrink-0">
              {decryptedPayload ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono-meta text-[10px] uppercase tracking-widest text-[#4a5d4e] font-semibold bg-[#4a5d4e]/10 px-2 py-0.5 rounded-xs">
                  Encrypted Vault Backup
                </span>
                <span className="font-mono-meta text-[10px] text-[#1a1a1a]/50">
                  {envelope.assetCount} assets
                </span>
              </div>
              <h2
                id="decrypt-modal-title"
                className="font-serif-display text-xl sm:text-2xl font-bold tracking-tight text-[#1a1a1a] mt-0.5"
              >
                {decryptedPayload ? 'Preview & Restore Assets' : 'Decrypt Local Backup File'}
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
          {restoredSuccess ? (
            /* Restored Success Screen */
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="p-4 bg-emerald-50/80 border border-emerald-300 rounded-xs flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <p className="font-semibold text-emerald-900 font-mono-meta uppercase tracking-wider">
                    Asset Registry Successfully Restored
                  </p>
                  <p className="text-emerald-800 leading-relaxed">
                    {decryptedPayload?.assets.length} financial asset records have been decrypted and loaded into your active ledger.
                  </p>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={resetAndClose}
                  className="px-5 py-2 rounded-xs bg-[#1a1a1a] hover:bg-[#2b2b2b] text-[#f8f7f4] font-mono-meta text-xs uppercase tracking-wider font-semibold cursor-pointer transition-all"
                >
                  View in Workspace
                </button>
              </div>
            </div>
          ) : decryptedPayload ? (
            /* Decrypted Preview & Confirmation */
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="p-3 bg-emerald-50 border border-emerald-300/80 rounded-xs flex items-center gap-2.5 text-xs text-emerald-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Decryption verified. Successfully unlocked <strong>{decryptedPayload.assets.length}</strong> asset records.
                </span>
              </div>

              {/* Asset List Preview */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-mono-meta">
                  <span className="text-[#1a1a1a]/60 uppercase tracking-wider">
                    Unlocked Assets Preview
                  </span>
                  <span className="text-[#1a1a1a]/80 font-semibold">
                    {decryptedPayload.assets.length} items
                  </span>
                </div>
                <div className="max-h-52 overflow-y-auto border border-[#1a1a1a]/15 rounded-xs bg-white divide-y divide-[#1a1a1a]/10">
                  {decryptedPayload.assets.map((asset, idx) => (
                    <div key={asset.id || idx} className="p-3 text-xs flex items-center justify-between gap-3">
                      <div>
                        <div className="font-semibold text-[#1a1a1a]">{asset.label}</div>
                        <div className="font-mono-meta text-[11px] text-[#1a1a1a]/60">
                          {asset.institutionName} · {asset.maskedReference || 'No ref'}
                        </div>
                      </div>
                      <div className="text-right font-mono shrink-0">
                        <div className="font-bold text-[#4a5d4e]">
                          {formatCurrency(getAssetValuation(asset), asset.currency)}
                        </div>
                        {asset.nomineeName && (
                          <div className="text-[10px] text-[#1a1a1a]/50">
                            Nominee: {asset.nomineeName}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Restore Mode Choice */}
              <div className="space-y-2">
                <label className="font-mono-meta text-[11px] uppercase tracking-wider font-semibold text-[#1a1a1a] block">
                  Select Restore Strategy
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRestoreMode('merge')}
                    className={`p-3 rounded-xs border text-left cursor-pointer transition-all ${
                      restoreMode === 'merge'
                        ? 'border-[#4a5d4e] bg-[#4a5d4e]/5 ring-1 ring-[#4a5d4e]'
                        : 'border-[#1a1a1a]/15 bg-white hover:bg-[#f8f7f4]'
                    }`}
                  >
                    <div className="font-mono-meta text-xs font-bold text-[#1a1a1a]">
                      Merge with Existing
                    </div>
                    <div className="text-[11px] text-[#1a1a1a]/60 mt-0.5 leading-relaxed">
                      Adds new assets to your active ledger without overwriting non-conflicting items.
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRestoreMode('replace')}
                    className={`p-3 rounded-xs border text-left cursor-pointer transition-all ${
                      restoreMode === 'replace'
                        ? 'border-amber-600 bg-amber-50/50 ring-1 ring-amber-600'
                        : 'border-[#1a1a1a]/15 bg-white hover:bg-[#f8f7f4]'
                    }`}
                  >
                    <div className="font-mono-meta text-xs font-bold text-amber-900">
                      Replace Vault Ledger
                    </div>
                    <div className="text-[11px] text-[#1a1a1a]/60 mt-0.5 leading-relaxed">
                      Replaces all current assets with the exact state from this backup file.
                    </div>
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-rose-50 border border-rose-300 rounded-xs flex items-center gap-2 text-rose-800 text-xs">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#1a1a1a]/10">
                <button
                  type="button"
                  onClick={resetAndClose}
                  className="px-4 py-2 rounded-xs border border-[#1a1a1a]/20 text-[#1a1a1a] font-mono-meta text-xs uppercase tracking-wider font-semibold hover:bg-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmRestore}
                  disabled={isRestoring}
                  className="px-5 py-2 rounded-xs bg-[#1a1a1a] hover:bg-[#2b2b2b] text-[#f8f7f4] font-mono-meta text-xs uppercase tracking-wider font-semibold flex items-center gap-2 cursor-pointer shadow-xs transition-all"
                >
                  {isRestoring ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Restoring...</span>
                    </>
                  ) : (
                    <>
                      <FolderInput className="w-4 h-4 text-emerald-400" />
                      <span>Confirm & Import Assets</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* Decryption Password Form */
            <form onSubmit={handleDecrypt} className="space-y-5">
              {/* Envelope Metadata Summary */}
              <div className="bg-white border border-[#1a1a1a]/15 rounded-xs p-3.5 space-y-2 font-mono-meta text-xs">
                <div className="flex justify-between pb-1.5 border-b border-[#1a1a1a]/10">
                  <span className="text-[#1a1a1a]/60">Backup Created:</span>
                  <span className="font-semibold text-[#1a1a1a]">
                    {new Date(envelope.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between pb-1.5 border-b border-[#1a1a1a]/10">
                  <span className="text-[#1a1a1a]/60">Contained Assets:</span>
                  <span className="font-semibold text-[#1a1a1a]">
                    {envelope.assetCount} items
                  </span>
                </div>
                <div className="flex justify-between pb-1.5 border-b border-[#1a1a1a]/10">
                  <span className="text-[#1a1a1a]/60">Estates Valuation:</span>
                  <span className="font-semibold text-[#4a5d4e]">
                    {envelope.totalEstatesSummary || 'Recorded in backup'}
                  </span>
                </div>
                {envelope.passwordHint && (
                  <div className="flex items-start justify-between p-2 bg-amber-50 rounded-xs border border-amber-200 text-amber-900 text-[11px]">
                    <span className="font-semibold">Creator Hint:</span>
                    <span className="italic">"{envelope.passwordHint}"</span>
                  </div>
                )}
              </div>

              {/* Passphrase Input */}
              <div className="space-y-1.5">
                <label
                  htmlFor={passwordInputId}
                  className="font-mono-meta text-[11px] uppercase tracking-wider font-semibold text-[#1a1a1a]"
                >
                  Enter Master Passphrase <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <input
                    id={passwordInputId}
                    type={showPassphrase ? 'text' : 'password'}
                    value={passphrase}
                    onChange={(e) => setPassphrase(e.target.value)}
                    placeholder="Enter the passphrase used during backup..."
                    required
                    autoFocus
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
              </div>

              {error && (
                <div className="p-3 bg-rose-50 border border-rose-300 rounded-xs flex items-center gap-2 text-rose-800 text-xs">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#1a1a1a]/10">
                <button
                  type="button"
                  onClick={resetAndClose}
                  className="px-4 py-2 rounded-xs border border-[#1a1a1a]/20 text-[#1a1a1a] font-mono-meta text-xs uppercase tracking-wider font-semibold hover:bg-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!passphrase.trim() || isDecrypting}
                  className={`px-5 py-2 rounded-xs text-[#f8f7f4] font-mono-meta text-xs uppercase tracking-wider font-semibold flex items-center gap-2 transition-all shadow-xs cursor-pointer ${
                    passphrase.trim() && !isDecrypting
                      ? 'bg-[#1a1a1a] hover:bg-[#2b2b2b]'
                      : 'bg-[#1a1a1a]/40 cursor-not-allowed'
                  }`}
                >
                  {isDecrypting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Verifying & Decrypting...</span>
                    </>
                  ) : (
                    <>
                      <Unlock className="w-4 h-4 text-emerald-400" />
                      <span>Unlock & Preview</span>
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
