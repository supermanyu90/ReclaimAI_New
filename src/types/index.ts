export type JapacLanguage =
  | 'en'
  | 'ja'
  | 'zh-Hans'
  | 'zh-Hant'
  | 'ko'
  | 'hi'
  | 'id'
  | 'th'
  | 'vi';

export type JurisdictionCode = 'IN' | 'JP' | 'SG' | 'KR' | 'AU' | 'HK' | 'TH' | 'ID' | 'VN';

export type UserRole = 'owner' | 'family' | 'reviewer';

export interface UserPersona {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  jurisdiction: JurisdictionCode;
  avatar: string;
  badge: string;
}

export type AssetType =
  | 'savings'
  | 'fixed_deposit'
  | 'mutual_fund'
  | 'insurance'
  | 'pension_cpf'
  | 'real_estate'
  | 'equities'
  | 'gold_locker';

export type VerificationState =
  | 'document_extracted'
  | 'manual_entry'
  | 'institution_verified'
  | 'self_declared';

export type NominationStatus = 'recorded' | 'unregistered' | 'unknown' | 'disputed';

export interface FieldEvidence {
  field: string;
  observed: string;
  source: 'document' | 'user_statement' | 'institution_api';
  documentId?: string;
  documentTitle?: string;
  page?: number;
  confidence: number;
}

export interface AssetItem {
  id: string;
  label: string;
  assetType: AssetType;
  institutionName: string;
  jurisdiction: JurisdictionCode;
  maskedReference: string;
  currency: string;
  amounts: {
    balance?: number;
    estimatedValue?: number;
    insuranceCover?: number;
    sipInstallment?: number;
    liability?: number;
  };
  sourceDate: string | null;
  verificationState: VerificationState;
  nominationStatus: NominationStatus;
  nomineeName?: string;
  documentLocation: string | null;
  status: 'active' | 'pending_verification' | 'disputed';
  evidence: FieldEvidence[];
  tags?: string[];
  authorizedForFamily: boolean;
}

export interface GraphNode {
  id: string;
  kind: 'owner' | 'asset' | 'institution' | 'person' | 'document';
  label: string;
  subtitle?: string;
  status?: string;
}

export interface GraphEdge {
  from: string;
  to: string;
  kind: string;
  detail?: string;
  field?: string;
}

export interface PassportRecord {
  id: string;
  version: number;
  generatedAt: string;
  audience: 'owner_master' | 'family_scoped' | 'reviewer_audit';
  recipientName?: string;
  sealHash: string;
  assetCount: number;
  totalValueFormatted: string;
  currency: string;
  disclaimer: string;
}

export type HandoverStatus =
  | 'pre_handover'
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'held'
  | 'approved_partial'
  | 'released'
  | 'rejected';

export interface HandoverReviewLog {
  id: string;
  reviewerId: string;
  reviewerName: string;
  decision: 'approve' | 'hold' | 'resume' | 'reject';
  notes: string;
  timestamp: string;
}

export interface HandoverCase {
  id: string;
  tenantKey: string;
  ownerId: string;
  ownerName: string;
  applicantId: string;
  applicantName: string;
  status: HandoverStatus;
  submittedAt: string | null;
  releasedAt: string | null;
  documentAttached?: {
    id: string;
    title: string;
    extractedName: string;
    targetName: string;
    hasMismatch: boolean;
    hash: string;
  };
  requiredApprovals: number;
  approvalsReceived: string[]; // reviewer IDs
  holdReason?: string;
  reviewLogs: HandoverReviewLog[];
}

export interface ClaimPolicyStep {
  id: string;
  title: string;
  description: string;
  legalBasis: string;
  documentsRequired: string[];
  completed?: boolean;
}

export interface InstitutionClaimGuide {
  institution: string;
  jurisdiction: JurisdictionCode;
  currency: string;
  policyVersion: string;
  lastReviewed: string;
  turnaroundTargetDays: number;
  statutoryLimitNoCourtOrder?: number;
  rulesWithNominee: ClaimPolicyStep[];
  rulesWithoutNominee: ClaimPolicyStep[];
  survivorshipMandateNotes: string;
}

export interface RecoveryRegistryItem {
  id: string;
  holderName: string;
  dateOfBirth?: string;
  address: string;
  pincode: string;
  institution: string;
  product: string;
  accountRef: string;
  amountMinor: number;
  currency: string;
  lastActivity: string;
  transferredToRegistry: string;
  registrySource: string;
  score: number; // 0-100
  matchConfidence: 'strong' | 'moderate' | 'weak' | 'ruled_out';
  exclusionReason?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  proposal?: AssetItem;
  attachment?: {
    fileName: string;
    fileType: string;
    sizeKb: number;
    extractedSnippet: string;
  };
  suggestedActions?: string[];
}
