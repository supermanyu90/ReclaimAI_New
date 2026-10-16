import {
  AssetItem,
  ClaimPolicyStep,
  GraphEdge,
  GraphNode,
  HandoverCase,
  InstitutionClaimGuide,
  JurisdictionCode,
  RecoveryRegistryItem,
  UserPersona,
} from '../types';

export const JAPAC_PERSONAS: UserPersona[] = [
  {
    id: 'ramesh',
    name: 'Ramesh Patel',
    email: 'ramesh.patel@estate.demo',
    role: 'owner',
    jurisdiction: 'IN',
    avatar: '👨🏽‍💼',
    badge: 'Owner (Master Ledger)',
  },
  {
    id: 'priya',
    name: 'Priya Shah',
    email: 'priya.shah@family.demo',
    role: 'family',
    jurisdiction: 'IN',
    avatar: '👩🏽',
    badge: 'Beneficiary (Family Nominee)',
  },
  {
    id: 'reviewer_anil',
    name: 'Anil Menon',
    email: 'anil.reviewer@compliance.demo',
    role: 'reviewer',
    jurisdiction: 'IN',
    avatar: '⚖️',
    badge: 'Independent Reviewer 1 (KYC)',
  },
  {
    id: 'reviewer_meera',
    name: 'Meera Iyer',
    email: 'meera.reviewer@compliance.demo',
    role: 'reviewer',
    jurisdiction: 'IN',
    avatar: '🛡️',
    badge: 'Independent Reviewer 2 (Legal)',
  },
  {
    id: 'kenji',
    name: 'Kenji Tanaka (田中 健二)',
    email: 'kenji.tanaka@estate.demo',
    role: 'owner',
    jurisdiction: 'JP',
    avatar: '👨🏻‍💼',
    badge: '名義人 (Japan Master)',
  },
  {
    id: 'weiling',
    name: 'Wei-Ling Chen',
    email: 'weiling.chen@estate.demo',
    role: 'owner',
    jurisdiction: 'SG',
    avatar: '👩🏻‍💼',
    badge: 'Owner (Singapore Master)',
  },
];

export const INITIAL_ASSETS: AssetItem[] = [
  {
    id: 'ast-001',
    label: 'Primary Savings Account',
    assetType: 'savings',
    institutionName: 'Sagar Bharat Bank',
    jurisdiction: 'IN',
    maskedReference: '••••4821',
    currency: 'INR',
    amounts: {
      balance: 34215000, // Rs 3,42,150.00
    },
    sourceDate: '2023-03-31',
    verificationState: 'document_extracted',
    nominationStatus: 'recorded',
    nomineeName: 'Priya Shah (Daughter)',
    documentLocation: 'Passbook in the steel almirah, main bedroom drawer 2',
    status: 'active',
    authorizedForFamily: true,
    tags: ['Liquid', 'Bank Account', 'Primary'],
    evidence: [
      {
        field: 'balance',
        observed: 'Rs. 3,42,150.00',
        source: 'document',
        documentId: 'doc-savings-2023',
        documentTitle: 'Savings Account Statement 2023',
        page: 1,
        confidence: 0.96,
      },
      {
        field: 'nominee',
        observed: 'Priya Shah',
        source: 'document',
        documentId: 'doc-savings-2023',
        documentTitle: 'Savings Account Statement 2023',
        page: 1,
        confidence: 0.92,
      },
    ],
  },
  {
    id: 'ast-002',
    label: 'Bluechip Equity Growth Fund',
    assetType: 'mutual_fund',
    institutionName: 'Kaveri Mutual Fund',
    jurisdiction: 'IN',
    maskedReference: 'FOLIO-884021',
    currency: 'INR',
    amounts: {
      balance: 87540000, // Rs 8,75,400.00
      sipInstallment: 1000000, // Rs 10,000 / month
    },
    sourceDate: '2026-09-30',
    verificationState: 'document_extracted',
    nominationStatus: 'unregistered',
    documentLocation: 'CAMS CAS statement in DigiLocker & printed in Blue File',
    status: 'active',
    authorizedForFamily: true,
    tags: ['Investment', 'High Yield', 'Requires Nominee'],
    evidence: [
      {
        field: 'balance',
        observed: 'Rs. 8,75,400.00',
        source: 'document',
        documentId: 'doc-mf-2026',
        documentTitle: 'Consolidated Account Statement Sep 2026',
        page: 2,
        confidence: 0.98,
      },
      {
        field: 'nomination_status',
        observed: 'Not Registered / Pending Update',
        source: 'document',
        documentId: 'doc-mf-2026',
        documentTitle: 'Consolidated Account Statement Sep 2026',
        page: 2,
        confidence: 0.95,
      },
    ],
  },
  {
    id: 'ast-003',
    label: 'Term Life Insurance Protection',
    assetType: 'insurance',
    institutionName: 'Navjeevan Life Assurance',
    jurisdiction: 'IN',
    maskedReference: 'POL-99321890',
    currency: 'INR',
    amounts: {
      insuranceCover: 500000000, // Rs 50,00,000 (50 Lakhs)
    },
    sourceDate: '2025-04-01',
    verificationState: 'document_extracted',
    nominationStatus: 'unknown',
    documentLocation: 'Original bond parchment in Godrej safety locker',
    status: 'active',
    authorizedForFamily: true,
    tags: ['Term Cover', 'High Priority', 'Check Nominee'],
    evidence: [
      {
        field: 'insuranceCover',
        observed: 'Sum Assured Rs. 50,00,000.00',
        source: 'document',
        documentId: 'doc-life-policy',
        documentTitle: 'Life Insurance Policy Schedule',
        page: 1,
        confidence: 0.94,
      },
      {
        field: 'nominationStatus',
        observed: 'Nominee section smudged / illegible in scan',
        source: 'document',
        documentId: 'doc-life-policy',
        confidence: 0.72,
      },
    ],
  },
  {
    id: 'ast-004',
    label: 'Retirement National Pension Corpus',
    assetType: 'pension_cpf',
    institutionName: 'Rashtriya Pension Trust',
    jurisdiction: 'IN',
    maskedReference: 'PRAN-110034988',
    currency: 'INR',
    amounts: {
      balance: 146000000, // Rs 14,60,000.00
    },
    sourceDate: '2026-03-31',
    verificationState: 'document_extracted',
    nominationStatus: 'recorded',
    nomineeName: 'Priya Shah (100% share)',
    documentLocation: 'Annual PRAN statement PDF in family Google Drive',
    status: 'active',
    authorizedForFamily: true,
    tags: ['Retirement', 'Tax Advantage'],
    evidence: [
      {
        field: 'balance',
        observed: 'Rs. 14,60,000.00',
        source: 'document',
        documentId: 'doc-pension-2026',
        documentTitle: 'Annual Pension Scheme Statement',
        page: 1,
        confidence: 0.99,
      },
    ],
  },
  {
    id: 'ast-005',
    label: 'Residential Apartment (Kothrud, Pune)',
    assetType: 'real_estate',
    institutionName: 'Sagar Bharat Bank (Home Loan)',
    jurisdiction: 'IN',
    maskedReference: 'PROPERTY-DEED-2018',
    currency: 'INR',
    amounts: {
      estimatedValue: 850000000, // Rs 85,00,000.00
      liability: 124000000, // Rs 12,40,000.00 loan outstanding
    },
    sourceDate: '2026-06-30',
    verificationState: 'manual_entry',
    nominationStatus: 'recorded',
    nomineeName: 'Joint Will with Family',
    documentLocation: 'Original Registered Sale Deed deposited with Bank Locker #142',
    status: 'active',
    authorizedForFamily: true,
    tags: ['Real Estate', 'Encumbered'],
    evidence: [
      {
        field: 'liability',
        observed: 'Rs. 12,40,000.00 home loan outstanding',
        source: 'user_statement',
        confidence: 0.88,
      },
    ],
  },
  {
    id: 'ast-006',
    label: 'Offshore Wealth Account (Singapore)',
    assetType: 'savings',
    institutionName: 'Merlion Harbour Bank',
    jurisdiction: 'SG',
    maskedReference: '••••8922',
    currency: 'SGD',
    amounts: {
      balance: 1825000, // SGD 18,250.00
    },
    sourceDate: '2026-08-31',
    verificationState: 'document_extracted',
    nominationStatus: 'unregistered',
    documentLocation: 'Overseas account statements saved on personal laptop',
    status: 'active',
    authorizedForFamily: false, // Hidden from standard family scope until probate
    tags: ['Overseas', 'SGD', 'Confidential Scope'],
    evidence: [
      {
        field: 'balance',
        observed: 'S$ 18,250.00',
        source: 'document',
        documentId: 'doc-sgd-stmt',
        documentTitle: 'SGD Savings Statement Aug 2026',
        page: 1,
        confidence: 0.97,
      },
    ],
  },
];

export const INITIAL_GRAPH_NODES: GraphNode[] = [
  { id: 'owner_ramesh', kind: 'owner', label: 'Ramesh Patel', subtitle: 'Estate Owner' },
  { id: 'family_priya', kind: 'person', label: 'Priya Shah', subtitle: 'Nominee / Daughter' },
  { id: 'inst_sagar', kind: 'institution', label: 'Sagar Bharat Bank', subtitle: 'Banking' },
  { id: 'inst_kaveri', kind: 'institution', label: 'Kaveri Mutual Fund', subtitle: 'AMC' },
  { id: 'inst_navjeevan', kind: 'institution', label: 'Navjeevan Life', subtitle: 'Insurer' },
  { id: 'inst_pension', kind: 'institution', label: 'Rashtriya Pension', subtitle: 'PFRDA' },
  { id: 'inst_merlion', kind: 'institution', label: 'Merlion Harbour Bank', subtitle: 'SG Bank' },
  { id: 'ast-001', kind: 'asset', label: 'Savings ••••4821', subtitle: '₹3,42,150' },
  { id: 'ast-002', kind: 'asset', label: 'Kaveri Bluechip MF', subtitle: '₹8,75,400' },
  { id: 'ast-003', kind: 'asset', label: 'Term Life Policy', subtitle: '₹50,00,000' },
  { id: 'ast-004', kind: 'asset', label: 'National Pension', subtitle: '₹14,60,000' },
  { id: 'ast-005', kind: 'asset', label: 'Flat (Kothrud)', subtitle: '₹85,00,000' },
  { id: 'ast-006', kind: 'asset', label: 'SGD Account ••••8922', subtitle: 'S$18,250' },
  { id: 'doc-savings-2023', kind: 'document', label: 'Passbook & Statement', subtitle: '2023-03' },
  { id: 'doc-mf-2026', kind: 'document', label: 'CAMS CAS Statement', subtitle: '2026-09' },
  { id: 'doc-life-policy', kind: 'document', label: 'Policy Schedule #993', subtitle: '2025-04' },
];

export const INITIAL_GRAPH_EDGES: GraphEdge[] = [
  { from: 'owner_ramesh', to: 'ast-001', kind: 'holds' },
  { from: 'owner_ramesh', to: 'ast-002', kind: 'holds' },
  { from: 'owner_ramesh', to: 'ast-003', kind: 'holds' },
  { from: 'owner_ramesh', to: 'ast-004', kind: 'holds' },
  { from: 'owner_ramesh', to: 'ast-005', kind: 'holds' },
  { from: 'owner_ramesh', to: 'ast-006', kind: 'holds' },
  { from: 'ast-001', to: 'inst_sagar', kind: 'custodian' },
  { from: 'ast-002', to: 'inst_kaveri', kind: 'custodian' },
  { from: 'ast-003', to: 'inst_navjeevan', kind: 'custodian' },
  { from: 'ast-004', to: 'inst_pension', kind: 'custodian' },
  { from: 'ast-005', to: 'inst_sagar', kind: 'mortgaged_to' },
  { from: 'ast-006', to: 'inst_merlion', kind: 'custodian' },
  { from: 'ast-001', to: 'family_priya', kind: 'nominee', detail: 'Primary Nominee' },
  { from: 'ast-004', to: 'family_priya', kind: 'nominee', detail: '100% Beneficiary' },
  { from: 'ast-001', to: 'doc-savings-2023', kind: 'evidenced_by' },
  { from: 'ast-002', to: 'doc-mf-2026', kind: 'evidenced_by' },
  { from: 'ast-003', to: 'doc-life-policy', kind: 'evidenced_by' },
];

export const INITIAL_HANDOVER_CASE: HandoverCase = {
  id: 'HND-2026-0902',
  tenantKey: 'patel',
  ownerId: 'ramesh',
  ownerName: 'Ramesh Patel',
  applicantId: 'priya',
  applicantName: 'Priya Shah',
  status: 'pre_handover',
  submittedAt: null,
  releasedAt: null,
  requiredApprovals: 2,
  approvalsReceived: [],
  reviewLogs: [],
};

export const SAMPLE_DOCUMENTS = {
  fdReceipt: {
    fileName: 'fd_receipt.txt',
    title: 'Fixed Deposit Receipt — Sagar Bharat Bank',
    content: `SYNTHETIC DEMO DOCUMENT - NOT A REAL BANK RECORD
Sagar Bharat Bank
Fixed Deposit Advice
Deposit account: XXXXXX7730
Depositor: Ramesh Patel
Date of deposit: 10 October 2026
Principal amount: Rs. 5,00,000.00
Tenure: 36 months
Maturity date: 10 October 2029
Interest rate: 7.10% p.a.
Nomination: Registered (Priya Shah)`,
    extractedAsset: {
      label: '3-Year Cumulative Fixed Deposit',
      assetType: 'fixed_deposit' as const,
      institutionName: 'Sagar Bharat Bank',
      jurisdiction: 'IN' as JurisdictionCode,
      maskedReference: '••••7730',
      currency: 'INR',
      amounts: { balance: 50000000 },
      sourceDate: '2026-10-10',
      verificationState: 'document_extracted' as const,
      nominationStatus: 'recorded' as const,
      nomineeName: 'Priya Shah',
      documentLocation: 'Original FD Advice kept with Branch Folder in Study Room',
      status: 'active' as const,
      authorizedForFamily: true,
      evidence: [
        {
          field: 'balance',
          observed: 'Rs. 5,00,000.00',
          source: 'document' as const,
          documentTitle: 'Fixed Deposit Advice',
          page: 1,
          confidence: 0.98,
        },
        {
          field: 'tenure',
          observed: '36 months (Maturity: 10 Oct 2029)',
          source: 'document' as const,
          documentTitle: 'Fixed Deposit Advice',
          page: 1,
          confidence: 0.96,
        },
        {
          field: 'nominee',
          observed: 'Priya Shah',
          source: 'document' as const,
          confidence: 0.94,
        },
      ],
    },
  },
  deathCertMismatch: {
    fileName: 'death_certificate_mismatch.txt',
    title: 'Simulated Death Certificate (Spelling Mismatch)',
    content: `SYNTHETIC DEMO DOCUMENT - NOT A REAL CERTIFICATE
Municipal Corporation (fictional)
Certificate of Death
Registration number: SIM-0002
Date of Issue: 12 October 2026
Name of deceased: Ramesh Patil
Place of demise: City Hospital, Ward 4
Cause of demise: Natural Causes
Status: Unverified spelling (Patil vs Patel)`,
    mismatchDetected: true,
    mismatchName: 'Ramesh Patil',
    expectedName: 'Ramesh Patel',
    detectedIssue: 'Spelling discrepancy: "Patil" vs "Patel". May require affidavit or reissue.',
  },
  deathCertClean: {
    fileName: 'death_certificate.txt',
    title: 'Simulated Death Certificate (Clean Match)',
    content: `SYNTHETIC DEMO DOCUMENT - NOT A REAL CERTIFICATE
Municipal Corporation (fictional)
Certificate of Death
Registration number: SIM-0000
Date of Issue: 14 October 2026
Name of deceased: Ramesh Patel
Date of death: October 2026
Identity Match: Confirmed matching master estate ledger record.
Authorized for Dual Reviewer Sign-off.`,
    mismatchDetected: false,
    mismatchName: 'Ramesh Patel',
    expectedName: 'Ramesh Patel',
  },
};

export const INSTITUTION_CLAIM_GUIDES: Record<string, InstitutionClaimGuide> = {
  'Sagar Bharat Bank': {
    institution: 'Sagar Bharat Bank',
    jurisdiction: 'IN',
    currency: 'INR',
    policyVersion: 'v2.1 (Revised 2025)',
    lastReviewed: '2026-09-01',
    turnaroundTargetDays: 15,
    statutoryLimitNoCourtOrder: 150000000, // Rs 15 Lakhs
    rulesWithNominee: [
      {
        id: 'sbb-nom-1',
        title: 'Form DA-2 (Nominee Settlement Application)',
        description: 'Completed and signed by the registered nominee (Priya Shah) with photo identification.',
        legalBasis: 'Banking Regulation Act 1949 §45ZA',
        documentsRequired: ['Claim Form DA-2', 'Nominee KYC (Aadhaar/PAN)', 'Original Cancelled Cheque / Bank Passbook'],
      },
      {
        id: 'sbb-nom-2',
        title: 'Original Death Certificate Verification',
        description: 'Certified death extract issued by Registrar of Births and Deaths or Municipal Corporation.',
        legalBasis: 'Indian Evidence Act §35',
        documentsRequired: ['Original Death Certificate', 'Self-attested photocopy'],
      },
      {
        id: 'sbb-nom-3',
        title: 'Discharge Voucher & Surrender of Instruments',
        description: 'Surrender original fixed deposit receipts or passbook for ledger closing.',
        legalBasis: 'Internal Circular SBB/CIR/2025/44',
        documentsRequired: ['Original Passbook', 'Original Term Deposit Receipts'],
      },
    ],
    rulesWithoutNominee: [
      {
        id: 'sbb-non-1',
        title: 'Joint Claim by All Legal Heirs',
        description: 'All Class-I legal heirs must sign jointly or submit notarized relinquishment deeds.',
        legalBasis: 'Hindu Succession Act §8 / Indian Succession Act §370',
        documentsRequired: ['Joint Application Form', 'Legal Heir Affidavit (Annexure A)', 'Letter of Disclaimer'],
      },
      {
        id: 'sbb-non-2',
        title: 'Letter of Indemnity with Two Independent Sureties',
        description: 'Stamped indemnity bond required for balance up to ₹15,00,000 without Succession Certificate.',
        legalBasis: 'RBI Master Directions on Customer Service §19.2',
        documentsRequired: ['Indemnity Bond on Non-Judicial Stamp Paper', 'Surety KYC & Income Proof (2 persons)'],
      },
      {
        id: 'sbb-non-3',
        title: 'Succession Certificate (Required if balance > ₹15 Lakhs)',
        description: 'Mandatory court order if aggregate deceased deposits exceed statutory threshold.',
        legalBasis: 'Civil Courts Act / Indian Succession Act §372',
        documentsRequired: ['Certified Court Order', 'Succession Certificate with Schedule of Debts'],
      },
    ],
    survivorshipMandateNotes:
      'For joint accounts marked "Either or Survivor", surviving holder may immediately withdraw upon submitting death certificate and KYC without needing legal heir signatures.',
  },
  'Merlion Harbour Bank': {
    institution: 'Merlion Harbour Bank',
    jurisdiction: 'SG',
    currency: 'SGD',
    policyVersion: 'Estate Operations Guide 2026.1',
    lastReviewed: '2026-08-15',
    turnaroundTargetDays: 21,
    statutoryLimitNoCourtOrder: 5000000, // SGD 50,000
    rulesWithNominee: [
      {
        id: 'mhb-nom-1',
        title: 'CPF & Statutory Estate Nomination Extract',
        description: 'Singapore accounts with statutory trust or revocable nomination paid directly to named beneficiary.',
        legalBasis: 'Insurance Act (Cap. 142) §49L / CPF Act §25',
        documentsRequired: ['Certified Copy of Nomination', 'Beneficiary NRIC / Passport', 'Proof of Bank Account'],
      },
      {
        id: 'mhb-nom-2',
        title: 'Digital Death Certificate (My Legacy Extract)',
        description: 'ICA registered death record verified through Singapore Government API or certified extract.',
        legalBasis: 'Registration of Births and Deaths Act 2021',
        documentsRequired: ['Digital Death Certificate with Singpass verification QR'],
      },
    ],
    rulesWithoutNominee: [
      {
        id: 'mhb-non-1',
        title: 'Grant of Probate or Letters of Administration',
        description: 'High Court order granting authority to executor (if testate) or administrator (if intestate).',
        legalBasis: 'Probate and Administration Act (Cap. 251)',
        documentsRequired: ['Certified True Copy of Grant of Probate', 'Court Schedule of Assets', 'Executor NRIC'],
      },
      {
        id: 'mhb-non-2',
        title: 'Public Trustee Small Estate Administration (Under S$50,000)',
        description: 'Summary administration for un-encumbered estates under S$50,000 without engaging court probate.',
        legalBasis: 'Public Trustee Act (Cap. 260) §6',
        documentsRequired: ['Public Trustee Approval Certificate', 'All beneficiary indemnities'],
      },
    ],
    survivorshipMandateNotes:
      'Joint-all accounts are closed and transferred to survivor under Singapore joint tenancy rule upon presentation of death certificate.',
  },
  'Tokyo Shinkin Bank': {
    institution: 'Tokyo Shinkin Bank (東京信金銀行)',
    jurisdiction: 'JP',
    currency: 'JPY',
    policyVersion: '相続手続基本規程 2026年改訂版',
    lastReviewed: '2026-07-01',
    turnaroundTargetDays: 14,
    statutoryLimitNoCourtOrder: 1500000, // ¥1,500,000 (仮払い制度)
    rulesWithNominee: [
      {
        id: 'tsb-1',
        title: '遺産分割協議書または遺言公正証書',
        description: '全相続人の署名・実印が押印された協議書、または家庭裁判所の検認済遺言書。',
        legalBasis: '日本国 民法 第907条 (遺産の分割)',
        documentsRequired: ['遺産分割協議書 (原本)', '相続人全員の印鑑証明書 (発行後3ヶ月以内)'],
      },
      {
        id: 'tsb-2',
        title: '被相続人の出生から死亡までの連続した戸籍謄本',
        description: '改製原戸籍、除籍謄本を含め、法定相続人全員を確定させる完全な公的証明。',
        legalBasis: '戸籍法 および 民法 第887条〜第890条',
        documentsRequired: ['除籍謄本・改製原戸籍謄本', '相続人全員の現在の戸籍抄本/謄本'],
      },
    ],
    rulesWithoutNominee: [
      {
        id: 'tsb-non-1',
        title: '預貯金払戻し制度 (家庭裁判所の判断を経ない単独払戻し)',
        description: '法定相続分 × 1/3 (上限150万円) の範囲内で葬儀費用等のため即時仮払い可能。',
        legalBasis: '民法 第909条の2 (遺産分割前における預貯金債権の行使)',
        documentsRequired: ['単独払戻申請書', '除籍謄本', '申請者の戸籍謄本及び印鑑証明書'],
      },
    ],
    survivorshipMandateNotes:
      '名義人が死亡した事実を金融機関が知った時点で口座は凍結されます。相続人全員の合意または仮払い制度を利用して解除します。',
  },
  'Shinhan Bank': {
    institution: 'Shinhan Bank (신한은행)',
    jurisdiction: 'KR',
    currency: 'KRW',
    policyVersion: '상속 예금 지급 지침 2026',
    lastReviewed: '2026-06-20',
    turnaroundTargetDays: 10,
    statutoryLimitNoCourtOrder: 10000000, // 10,000,000 KRW (소액 상속 간이 지급)
    rulesWithNominee: [
      {
        id: 'shb-1',
        title: '상속 예금 지급 청구서 및 전원 동의서',
        description: '공동 상속인 전원의 인감증명서 첨부 및 상속재산 분할협의서 제출.',
        legalBasis: '대한민국 민법 제1005조 (상속과 포괄적 권리의무의 승계)',
        documentsRequired: ['상속예금 청구서', '상속재산 분할협의서 (인감 날인)', '상속인 전원 인감증명서 (3개월 이내)'],
      },
      {
        id: 'shb-2',
        title: '사망자 기본증명서 및 가족관계증명서',
        description: '상세 증명서 기준 피상속인의 사망 사실 및 상속인 전원 확인.',
        legalBasis: '가족관계의 등록 등에 관한 법률',
        documentsRequired: ['기본증명서(상세, 사망일 기재)', '가족관계증명서(상세)', '제적등본'],
      },
    ],
    rulesWithoutNominee: [
      {
        id: 'shb-non-1',
        title: '소액 상속 예금 간이 지급 제도 (1천만원 이하)',
        description: '총 예금 잔액이 1,000만원 이하인 경우 주 상속인 단독 청구 및 간이 확약서 제출 가능.',
        legalBasis: '금융감독원 소액 상속예금 지급 절차 개선안',
        documentsRequired: ['간이 지급 확약서', '청구인 신분증', '가족관계증명서'],
      },
    ],
    survivorshipMandateNotes:
      '피상속인 사망 확인 시 금융거래 안전을 위해 계좌가 즉시 지급정지되며, 정식 상속 지급 심사를 거쳐 송금됩니다.',
  },
};

export const RECOVERY_REGISTRY_DATA: RecoveryRegistryItem[] = [
  {
    id: 'DR-IN-0001',
    holderName: 'R K PATEL',
    dateOfBirth: '1958-03-14',
    address: '12 Navrangpura, Ahmedabad',
    pincode: '380009',
    institution: 'Sagar Bharat Bank',
    product: 'Fixed Deposit (Matured Unclaimed)',
    accountRef: '••••7710',
    amountMinor: 64200000, // Rs 6,42,000.00
    currency: 'INR',
    lastActivity: '2009-06-30',
    transferredToRegistry: '2020-01-15',
    registrySource: 'RBI UDGAM Stand-in (DEA Fund)',
    score: 91,
    matchConfidence: 'strong',
  },
  {
    id: 'DR-IN-0002',
    holderName: 'RAMESH PATEL',
    dateOfBirth: '1971-11-02',
    address: '4 CG Road, Navrangpura, Ahmedabad',
    pincode: '380009',
    institution: 'Sagar Bharat Bank',
    product: 'Savings Account (Dormant)',
    accountRef: '••••3391',
    amountMinor: 21500000, // Rs 2,15,000.00
    currency: 'INR',
    lastActivity: '2011-02-11',
    transferredToRegistry: '2021-03-01',
    registrySource: 'RBI UDGAM Stand-in (DEA Fund)',
    score: 84,
    matchConfidence: 'strong',
  },
  {
    id: 'DR-SG-0003',
    holderName: 'RAMESH PATEL',
    address: 'Tanjong Pagar, Singapore',
    pincode: '079903',
    institution: 'Merlion Harbour Bank',
    product: 'Time Deposit (Unclaimed)',
    accountRef: '••••0452',
    amountMinor: 1100000, // SGD 11,000.00
    currency: 'SGD',
    lastActivity: '2014-09-30',
    transferredToRegistry: '2024-12-01',
    registrySource: 'MAS Dormant Accounts Registry (Synthetic)',
    score: 72,
    matchConfidence: 'moderate',
  },
  {
    id: 'DR-JP-0004',
    holderName: 'KENJI TANAKA',
    dateOfBirth: '1965-04-12',
    address: 'Chiyoda-ku, Tokyo',
    pincode: '100-0001',
    institution: 'Tokyo Shinkin Bank',
    product: '普通預金 (休眠口座)',
    accountRef: '••••5520',
    amountMinor: 1450000, // JPY 1,450,000
    currency: 'JPY',
    lastActivity: '2012-05-31',
    transferredToRegistry: '2023-07-01',
    registrySource: '預金保険機構 (DICJ 休眠預金等交付金)',
    score: 89,
    matchConfidence: 'strong',
  },
  {
    id: 'DR-EX-0005',
    holderName: 'RAMESH PATIL',
    dateOfBirth: '1966-08-21',
    address: 'Shivaji Nagar, Pune',
    pincode: '411005',
    institution: 'Western Coastal Bank',
    product: 'Savings Account',
    accountRef: '••••8813',
    amountMinor: 5700000,
    currency: 'INR',
    lastActivity: '2012-01-31',
    transferredToRegistry: '2022-02-01',
    registrySource: 'RBI UDGAM Stand-in',
    score: 38,
    matchConfidence: 'ruled_out',
    exclusionReason: 'Surname differs ("Patil" vs "Patel") and birth date 1966 conflicts with owner record.',
  },
  {
    id: 'DR-EX-0006',
    holderName: 'SURESH KUMAR PATEL',
    dateOfBirth: '1958-03-14',
    address: '12 Navrangpura, Ahmedabad',
    pincode: '380009',
    institution: 'Sagar Bharat Bank',
    product: 'Savings Account',
    accountRef: '••••5520',
    amountMinor: 3400000,
    currency: 'INR',
    lastActivity: '2010-05-31',
    transferredToRegistry: '2020-07-01',
    registrySource: 'RBI UDGAM Stand-in',
    score: 41,
    matchConfidence: 'ruled_out',
    exclusionReason: 'Given name mismatch ("Suresh Kumar" vs "Ramesh"). Same residential address, likely relative.',
  },
];
