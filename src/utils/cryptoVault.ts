import { AssetItem } from '../types';

export interface EncryptedBackupEnvelope {
  format: 'RECLAIMAI_ENCRYPTED_BACKUP_V1';
  version: string;
  createdAt: string;
  exportId: string;
  assetCount: number;
  currencies: string[];
  totalEstatesSummary: string;
  kdf: {
    algorithm: 'PBKDF2';
    hash: 'SHA-256';
    iterations: number;
    salt: string; // Base64
  };
  encryption: {
    algorithm: 'AES-GCM';
    iv: string; // Base64
    tagLength: number; // 128
  };
  passwordHint?: string;
  ciphertext: string; // Base64
  sha256Checksum: string; // Hex
}

export interface DecryptedPayload {
  version: string;
  createdAt: string;
  appName: string;
  assetCount: number;
  assets: AssetItem[];
  exportMetadata?: {
    exportedBy?: string;
    totalValue?: Record<string, number>;
    note?: string;
  };
}

/**
 * Convert Uint8Array to standard Base64 string safely without stack overflow
 */
export function uint8ArrayToBase64(bytes: Uint8Array): string {
  let binary = '';
  const len = bytes.byteLength;
  const chunkSize = 8192;
  for (let i = 0; i < len; i += chunkSize) {
    const chunk = bytes.subarray(i, Math.min(i + chunkSize, len));
    binary += String.fromCharCode.apply(null, Array.from(chunk));
  }
  return btoa(binary);
}

/**
 * Convert Base64 string to Uint8Array safely
 */
export function base64ToUint8Array(b64: string): Uint8Array {
  const binary = atob(b64.trim());
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Compute SHA-256 hex digest of a string
 */
export async function computeSha256Hex(str: string): Promise<string> {
  const enc = new TextEncoder();
  const buffer = await crypto.subtle.digest('SHA-256', enc.encode(str));
  const hashArray = Array.from(new Uint8Array(buffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Safely extract primary monetary valuation from an AssetItem
 */
export function getAssetValuation(asset: AssetItem): number {
  if (!asset.amounts) return 0;
  return (
    asset.amounts.balance ||
    asset.amounts.insuranceCover ||
    asset.amounts.estimatedValue ||
    asset.amounts.sipInstallment ||
    0
  );
}

/**
 * Encrypt the asset registry into a zero-knowledge, AES-256-GCM envelope
 */
export async function encryptAssetRegistry(
  assets: AssetItem[],
  passphrase: string,
  options?: {
    passwordHint?: string;
    ownerName?: string;
    note?: string;
  }
): Promise<EncryptedBackupEnvelope> {
  if (!passphrase || passphrase.trim().length === 0) {
    throw new Error('Encryption passphrase is required to protect your asset registry.');
  }

  // Calculate currency summaries
  const currencyTotals: Record<string, number> = {};
  for (const asset of assets) {
    const curr = asset.currency || 'INR';
    const val = getAssetValuation(asset);
    currencyTotals[curr] = (currencyTotals[curr] || 0) + val;
  }

  const currencies = Object.keys(currencyTotals);
  const summaryParts = currencies.map(
    (c) => `${c} ${currencyTotals[c].toLocaleString()}`
  );
  const totalEstatesSummary = summaryParts.join(' | ') || 'No recorded values';

  const exportId = `vault-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`;
  const createdAt = new Date().toISOString();

  // Internal payload
  const payload: DecryptedPayload = {
    version: '1.0',
    createdAt,
    appName: 'ReclaimAI',
    assetCount: assets.length,
    assets,
    exportMetadata: {
      exportedBy: options?.ownerName || 'Account Owner',
      totalValue: currencyTotals,
      note: options?.note || 'Client-side zero-knowledge encrypted backup',
    },
  };

  const payloadJson = JSON.stringify(payload);
  const enc = new TextEncoder();
  const plaintextBytes = enc.encode(payloadJson);

  // Generate 16-byte random salt for PBKDF2
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iterations = 100000;

  // Import passphrase as PBKDF2 key
  const baseKey = await crypto.subtle.importKey(
    'raw',
    enc.encode(passphrase),
    'PBKDF2',
    false,
    ['deriveKey']
  );

  // Derive AES-GCM 256-bit key
  const aesKey = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations,
      hash: 'SHA-256',
    },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );

  // Generate 12-byte random IV for AES-GCM
  const iv = crypto.getRandomValues(new Uint8Array(12));

  // Perform AES-GCM encryption
  const ciphertextBuffer = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv,
      tagLength: 128,
    },
    aesKey,
    plaintextBytes
  );

  const ciphertextBase64 = uint8ArrayToBase64(new Uint8Array(ciphertextBuffer));
  const sha256Checksum = await computeSha256Hex(ciphertextBase64);

  const envelope: EncryptedBackupEnvelope = {
    format: 'RECLAIMAI_ENCRYPTED_BACKUP_V1',
    version: '1.0',
    createdAt,
    exportId,
    assetCount: assets.length,
    currencies,
    totalEstatesSummary,
    kdf: {
      algorithm: 'PBKDF2',
      hash: 'SHA-256',
      iterations,
      salt: uint8ArrayToBase64(salt),
    },
    encryption: {
      algorithm: 'AES-GCM',
      iv: uint8ArrayToBase64(iv),
      tagLength: 128,
    },
    passwordHint: options?.passwordHint?.trim() || undefined,
    ciphertext: ciphertextBase64,
    sha256Checksum,
  };

  return envelope;
}

/**
 * Decrypt an encrypted backup envelope using user's passphrase
 */
export async function decryptAssetRegistry(
  envelope: EncryptedBackupEnvelope,
  passphrase: string
): Promise<DecryptedPayload> {
  if (envelope.format !== 'RECLAIMAI_ENCRYPTED_BACKUP_V1') {
    throw new Error('Unsupported backup format. Expected RECLAIMAI_ENCRYPTED_BACKUP_V1.');
  }

  if (!passphrase || passphrase.trim().length === 0) {
    throw new Error('Please enter the password used to encrypt this backup.');
  }

  // Verify Checksum
  const calculatedChecksum = await computeSha256Hex(envelope.ciphertext);
  if (calculatedChecksum.toLowerCase() !== envelope.sha256Checksum.toLowerCase()) {
    throw new Error('Integrity check failed: Ciphertext checksum does not match envelope header. The file may be corrupted or modified.');
  }

  const salt = base64ToUint8Array(envelope.kdf.salt);
  const iv = base64ToUint8Array(envelope.encryption.iv);
  const ciphertextBytes = base64ToUint8Array(envelope.ciphertext);

  const enc = new TextEncoder();
  const baseKey = await crypto.subtle.importKey(
    'raw',
    enc.encode(passphrase),
    'PBKDF2',
    false,
    ['deriveKey']
  );

  const aesKey = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt.buffer as ArrayBuffer,
      iterations: envelope.kdf.iterations || 100000,
      hash: envelope.kdf.hash || 'SHA-256',
    },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );

  let decryptedBuffer: ArrayBuffer;
  try {
    decryptedBuffer = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv.buffer as ArrayBuffer,
        tagLength: envelope.encryption.tagLength || 128,
      },
      aesKey,
      ciphertextBytes.buffer as ArrayBuffer
    );
  } catch (err) {
    throw new Error('Decryption failed: Incorrect password or corrupted encryption payload. Please verify your passphrase.');
  }

  const decryptedString = new TextDecoder().decode(decryptedBuffer);
  try {
    const payload = JSON.parse(decryptedString) as DecryptedPayload;
    if (!payload.assets || !Array.isArray(payload.assets)) {
      throw new Error('Corrupted data inside backup: Assets array missing.');
    }
    return payload;
  } catch (err: any) {
    throw new Error(`Failed to parse decrypted asset data: ${err?.message || err}`);
  }
}

/**
 * Check if an unknown parsed object matches the encrypted backup envelope schema
 */
export function isEncryptedBackupEnvelope(obj: any): obj is EncryptedBackupEnvelope {
  return (
    obj &&
    typeof obj === 'object' &&
    obj.format === 'RECLAIMAI_ENCRYPTED_BACKUP_V1' &&
    typeof obj.ciphertext === 'string' &&
    typeof obj.sha256Checksum === 'string' &&
    obj.kdf &&
    typeof obj.kdf.salt === 'string' &&
    obj.encryption &&
    typeof obj.encryption.iv === 'string'
  );
}

/**
 * Trigger browser file download of JSON content
 */
export function downloadJsonFile(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
