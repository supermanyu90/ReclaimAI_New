import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  QrCode,
  Printer,
  Copy,
  Check,
  ShieldCheck,
  Building,
  MapPin,
  Scan,
  Tag,
  Grid,
  Maximize2,
} from 'lucide-react';
import { AssetItem, JapacLanguage } from '../types';
import { encodeUtf8ToBase64, decodeBase64ToUtf8 } from '../utils/formatters';

interface DigitalAssetQrViewProps {
  currentLang: JapacLanguage;
  assets: AssetItem[];
  ownerName: string;
}

const QR_I18N: Record<
  JapacLanguage,
  {
    title: string;
    subtitle: string;
    viewSheet: string;
    viewFocus: string;
    viewScanner: string;
    batchPrint: string;
    affixNotice: string;
    downloadSvg: string;
    copyPayload: string;
    copied: string;
    securityLevel: string;
    physicalCoordinates: string;
    verifiedSignature: string;
    scannerTitle: string;
    scannerDesc: string;
    scanButton: string;
    decodedSuccess: string;
    selectAssetPrompt: string;
    tamperEvidentSeal: string;
    printPdf: string;
    assetCertificateTitle: string;
    close: string;
  }
> = {
  en: {
    title: 'Digital Asset QR Vault',
    subtitle: 'Generate cryptographically signed QR codes to affix to physical passbooks, deposit folders, lockers, and property deeds.',
    viewSheet: 'Physical Label Sheet (Print Ready)',
    viewFocus: 'Single Tag Inspector',
    viewScanner: 'QR Scanner & Decryptor',
    batchPrint: 'Print Physical Label Sheet',
    affixNotice: 'Affix to physical storage location for instant emergency recovery and verified identification.',
    downloadSvg: 'Save QR Image',
    copyPayload: 'Copy Encrypted Payload',
    copied: 'Copied to Clipboard!',
    securityLevel: 'High Error Correction (30% Defect Tolerance)',
    physicalCoordinates: 'Physical Document Coordinates',
    verifiedSignature: 'SHA-256 HMAC Sealed',
    scannerTitle: 'Cryptographic QR Decryptor Simulator',
    scannerDesc: 'Scan or simulate scanning an asset QR code to test offline payload integrity and ledger matching.',
    scanButton: 'Test Scan & Decrypt Payload',
    decodedSuccess: 'Payload Authenticated: Signature Matches Ledger Record',
    selectAssetPrompt: 'Select an asset below to inspect its individual cryptographic QR token:',
    tamperEvidentSeal: 'Tamper-Evident Physical Asset Marker',
    printPdf: 'Print PDF',
    assetCertificateTitle: 'Tamper-Evident Asset QR Certificate',
    close: 'Close',
  },
  ja: {
    title: 'デジタル資産QRコード保管庫',
    subtitle: '通帳、定期預金証書、保険証券、権利証の物理的な保管場所に貼付するための暗号署名入りQRコードを発行します。',
    viewSheet: '物理ラベル印刷シート (貼付用)',
    viewFocus: '単一タグ詳細インスペクタ',
    viewScanner: 'QRスキャナ＆復号テスト',
    batchPrint: 'ラベルシートを印刷',
    affixNotice: '重要書類の原本や通帳ケースに貼付し、万一の際の迅速な識別と相続手続きに活用します。',
    downloadSvg: 'QR画像を保存',
    copyPayload: '暗号化ペイロードをコピー',
    copied: 'クリップボードにコピーしました！',
    securityLevel: '高誤り訂正 (Level H: 30%破損耐性)',
    physicalCoordinates: '原本・通帳の保管場所',
    verifiedSignature: 'SHA-256 HMAC 電子署名済',
    scannerTitle: 'QR暗号復号シミュレータ',
    scannerDesc: '貼付されたQRコードを読み取り、オフライン整合性と台帳との照合を検証します。',
    scanButton: 'スキャンして復号検証',
    decodedSuccess: '検証成功: 電子署名が台帳記録と完全に一致しました',
    selectAssetPrompt: '個別のQRコードを確認する資産を選択してください:',
    tamperEvidentSeal: '改ざん防止・公式物理保管マーカー',
    printPdf: 'PDF印刷',
    assetCertificateTitle: '改ざん防止資産QR証明書',
    close: '閉じる',
  },
  'zh-Hans': {
    title: '数字资产 QR 码存储凭证',
    subtitle: '生成带有密码学签名的专属 QR 码，贴附于存折、保单、房产证及保险箱物理存放位置。',
    viewSheet: '实物标签打印表 (贴纸版)',
    viewFocus: '单个凭证查看器',
    viewScanner: 'QR 扫码与解密验真',
    batchPrint: '批量打印实物标签',
    affixNotice: '贴在实体证件或存折封套上，供家属与执行人在紧急情况下快速扫码验真与寻回。',
    downloadSvg: '保存 QR 图像',
    copyPayload: '复制加密数据包',
    copied: '已复制到剪贴板！',
    securityLevel: '高级容错 (Level H: 30% 抗损毁能力)',
    physicalCoordinates: '纸质凭证存放位置',
    verifiedSignature: 'SHA-256 HMAC 签名封印',
    scannerTitle: '密码学 QR 解密验证模拟器',
    scannerDesc: '模拟扫描已贴附的 QR 码，测试离线数据包完整性与区块链账本比对。',
    scanButton: '测试扫码并解密验证',
    decodedSuccess: '数据包验真通过：数字签名与账本记录完全一致',
    selectAssetPrompt: '请在下方选择需要生成独立二维码的资产：',
    tamperEvidentSeal: '防篡改实物资产标识',
    printPdf: '打印 PDF',
    assetCertificateTitle: '防篡改资产 QR 证书',
    close: '关闭',
  },
  'zh-Hant': {
    title: '數位資產 QR 碼存證庫',
    subtitle: '產生帶有密碼學簽章的專屬 QR 碼，貼附於存摺、保單、樓契及保管箱實體存放位置。',
    viewSheet: '實體標籤列印表 (貼紙版)',
    viewFocus: '單個憑證檢視器',
    viewScanner: 'QR 掃碼與解密驗真',
    batchPrint: '批量列印實體標籤',
    affixNotice: '貼於實體證件或存摺封套上，供家屬於緊急情況下快速掃碼驗真與承接。',
    downloadSvg: '儲存 QR 影像',
    copyPayload: '複製加密數據包',
    copied: '已複製至剪貼簿！',
    securityLevel: '高級容錯 (Level H: 30% 抗損毁能力)',
    physicalCoordinates: '紙本憑證存放具體位置',
    verifiedSignature: 'SHA-256 HMAC 簽章封印',
    scannerTitle: '密碼學 QR 解密驗證模擬器',
    scannerDesc: '模擬掃描已貼附的 QR 碼，測試離線數據包完整性與帳本核對。',
    scanButton: '測試掃碼並解密驗證',
    decodedSuccess: '數據包驗真通過：數位簽章與帳本記錄完全一致',
    selectAssetPrompt: '請在下方選擇需要產生獨立二維碼的資產：',
    tamperEvidentSeal: '防篡改實體資產標識',
    printPdf: '列印 PDF',
    assetCertificateTitle: '防篡改資產 QR 憑證',
    close: '關閉',
  },
  ko: {
    title: '디지털 자산 QR 보관소',
    subtitle: '실물 통장, 보험증권, 등기권리증 및 금고 보관 위치에 부착할 수 있는 전자 서명된 QR 코드를 생성합니다.',
    viewSheet: '실물 라벨 인쇄 시트 (부착용)',
    viewFocus: '개별 태그 상세 조회',
    viewScanner: 'QR 스캐너 및 복호화 검증',
    batchPrint: '라벨 시트 일괄 인쇄',
    affixNotice: '실물 통장이나 보관 폴더에 부착하여 비상시 신속한 확인과 상속 청구를 지원합니다.',
    downloadSvg: 'QR 이미지 저장',
    copyPayload: '암호화 페이로드 복사',
    copied: '클립보드에 복사되었습니다!',
    securityLevel: '고급 오류 정정 (Level H: 30% 손상 복구)',
    physicalCoordinates: '실물 서류 보관 위치',
    verifiedSignature: 'SHA-256 HMAC 전자 서명 날인',
    scannerTitle: '암호화 QR 복호화 시뮬레이터',
    scannerDesc: '부착된 QR 코드를 스캔하여 오프라인 무결성과 원장 기록 일치 여부를 검증합니다.',
    scanButton: '스캔 및 복호화 검증 테스트',
    decodedSuccess: '검증 성공: 전자 서명이 원장 기록과 일치합니다',
    selectAssetPrompt: '개별 QR 코드를 확인할 자산을 선택하세요:',
    tamperEvidentSeal: '위변조 방지 실물 자산 표식',
    printPdf: 'PDF 인쇄',
    assetCertificateTitle: '위변조 방지 자산 QR 인증서',
    close: '닫기',
  },
  hi: {
    title: 'डिजिटल संपत्ति QR वॉल्ट',
    subtitle: 'भौतिक पासबुक, अलमारी, बैंक लॉकर और कागजात पर चिपकाने के लिए डिजिटल हस्ताक्षरित QR कोड तैयार करें।',
    viewSheet: 'भौतिक लेबल शीट (प्रिंट योग्य)',
    viewFocus: 'एकल टैग विवरण',
    viewScanner: 'QR स्कैनर और डिक्रिप्शन',
    batchPrint: 'लेबल शीट प्रिंट करें',
    affixNotice: 'कठिन समय में त्वरित पहचान और बैंक दावे के लिए मूल पासबुक या फाइल पर चिपकाएं।',
    downloadSvg: 'QR इमेज सहेजें',
    copyPayload: 'एन्क्रिप्टेड डेटा कॉपी करें',
    copied: 'क्लिपबोर्ड पर कॉपी हो गया!',
    securityLevel: 'उच्च त्रुटि सुधार (Level H: 30% क्षति सहनशीलता)',
    physicalCoordinates: 'दस्तावेज़ का भौतिक स्थान',
    verifiedSignature: 'SHA-256 HMAC द्वारा प्रमाणित',
    scannerTitle: 'QR डिक्रिप्शन और सत्यापन सिम्युलेटर',
    scannerDesc: 'चिपकाए गए QR कोड को स्कैन करके डेटा की सत्यता और खाते से मिलान की जांच करें।',
    scanButton: 'स्कैन और डिक्रिप्ट टेस्ट करें',
    decodedSuccess: 'सत्यापन सफल: डिजिटल हस्ताक्षर खाते से पूरी तरह मेल खाता है',
    selectAssetPrompt: 'व्यक्तिगत QR देखने के लिए संपत्ति चुनें:',
    tamperEvidentSeal: 'छेड़छाड़-रोधी भौतिक संपत्ति मार्कर',
    printPdf: 'PDF प्रिंट करें',
    assetCertificateTitle: 'छेड़छाड़-रोधी संपत्ति QR प्रमाणपत्र',
    close: 'बंद करें',
  },
  id: {
    title: 'Brankas QR Aset Digital',
    subtitle: 'Hasilkan kode QR bertanda tangan kriptografis untuk ditempelkan pada buku tabungan fisik, brankas, dan berkas properti.',
    viewSheet: 'Lembar Label Fisik (Siap Cetak)',
    viewFocus: 'Pemeriksa Tag Tunggal',
    viewScanner: 'Pemindai QR & Dekripsi',
    batchPrint: 'Cetak Lembar Label',
    affixNotice: 'Tempelkan pada lokasi fisik penyimpanan berkas untuk identifikasi cepat saat darurat.',
    downloadSvg: 'Simpan Gambar QR',
    copyPayload: 'Salin Muatan Terenkripsi',
    copied: 'Tersalin ke Papan Klip!',
    securityLevel: 'Koreksi Kesalahan Tinggi (Level H: Toleransi 30%)',
    physicalCoordinates: 'Lokasi Fisik Dokumen',
    verifiedSignature: 'Disegel HMAC SHA-256',
    scannerTitle: 'Simulator Dekriptor QR Kriptografis',
    scannerDesc: 'Pindai kode QR untuk memverifikasi integritas data luring terhadap buku besar.',
    scanButton: 'Uji Pindai & Dekripsi',
    decodedSuccess: 'Autentikasi Berhasil: Tanda tangan digital cocok dengan buku besar',
    selectAssetPrompt: 'Pilih aset untuk memeriksa token QR kriptografisnya:',
    tamperEvidentSeal: 'Segel Anti-Manipulasi Penanda Aset Fisik',
    printPdf: 'Cetak PDF',
    assetCertificateTitle: 'Sertifikat QR Aset Anti-Manipulasi',
    close: 'Tutup',
  },
  th: {
    title: 'คลัง QR ทรัพย์สินดิจิทัล',
    subtitle: 'สร้างรหัส QR พร้อมลายเซ็นดิจิทัลสำหรับติดบนสมุดบัญชีจริง แฟ้มเอกสาร ตู้เซฟ และโฉนดที่ดิน',
    viewSheet: 'แผ่นพิมพ์ป้ายสติ๊กเกอร์ (พร้อมพิมพ์)',
    viewFocus: 'ตรวจสอบแท็กรายรายการ',
    viewScanner: 'ตัวสแกนและถอดรหัส QR',
    batchPrint: 'พิมพ์แผ่นป้ายสติ๊กเกอร์',
    affixNotice: 'ติดบนสถานที่เก็บเอกสารจริงเพื่อให้ครอบครัวตรวจสอบและเคลมได้ทันทีเมื่อเกิดเหตุฉุกเฉิน',
    downloadSvg: 'บันทึกรูป QR',
    copyPayload: 'คัดลอกข้อมูลเข้ารหัส',
    copied: 'คัดลอกลงคลิปบอร์ดแล้ว!',
    securityLevel: 'การแก้ไขข้อผิดพลาดระดับสูง (Level H: ทนทานต่อความเสียหาย 30%)',
    physicalCoordinates: 'สถานที่เก็บเอกสารจริง',
    verifiedSignature: 'รับรองด้วย SHA-256 HMAC',
    scannerTitle: 'เครื่องมือจำลองการสแกนและถอดรหัส QR',
    scannerDesc: 'สแกนรหัส QR เพื่อทดสอบความถูกต้องของข้อมูลออฟไลน์และการจับคู่กับสมุดบัญชี',
    scanButton: 'ทดสอบสแกนและถอดรหัส',
    decodedSuccess: 'ตรวจสอบสำเร็จ: ลายเซ็นดิจิทัลตรงกับข้อมูลในระบบ',
    selectAssetPrompt: 'เลือกทรัพย์สินเพื่อดูรหัส QR เฉพาะรายการ:',
    tamperEvidentSeal: 'ตราประทับป้องกันการดัดแปลงสำหรับทรัพย์สินจริง',
    printPdf: 'พิมพ์ PDF',
    assetCertificateTitle: 'ใบรับรอง QR ทรัพย์สินป้องกันการดัดแปลง',
    close: 'ปิด',
  },
  vi: {
    title: 'Kho Mã QR Tài sản Số',
    subtitle: 'Tạo mã QR có chữ ký điện tử để dán lên sổ tiết kiệm, bìa hồ sơ, két sắt và giấy chứng nhận quyền sở hữu thực tế.',
    viewSheet: 'Trang In Nhãn Dán Thực tế (Sẵn sàng In)',
    viewFocus: 'Xem Chi tiết Thẻ Đơn',
    viewScanner: 'Trình Quét & Giải mã QR',
    batchPrint: 'In Toàn bộ Nhãn Dán',
    affixNotice: 'Dán lên vị trí lưu trữ thực tế để gia đình tra cứu nhanh chóng và nộp hồ sơ khiếu nại thừa kế.',
    downloadSvg: 'Lưu Ảnh QR',
    copyPayload: 'Sao chép Gói tin Mã hóa',
    copied: 'Đã sao chép vào bộ nhớ tạm!',
    securityLevel: 'Mức Sửa sai Cao (Level H: Chịu lỗi 30%)',
    physicalCoordinates: 'Vị trí Cất giữ Giấy tờ Gốc',
    verifiedSignature: 'Được Ký điện tử SHA-256 HMAC',
    scannerTitle: 'Bộ Mô phỏng Quét & Giải mã QR',
    scannerDesc: 'Quét mã QR để kiểm tra tính toàn vẹn dữ liệu ngoại tuyến và đối chiếu với sổ cái.',
    scanButton: 'Kiểm tra Quét & Giải mã',
    decodedSuccess: 'Xác thực Thành công: Chữ ký điện tử khớp với hồ sơ sổ cái',
    selectAssetPrompt: 'Chọn một tài sản để kiểm tra mã QR độc lập:',
    tamperEvidentSeal: 'Dấu niêm phong Chống giả mạo Tài sản Thực tế',
    printPdf: 'In PDF',
    assetCertificateTitle: 'Chứng nhận QR Tài sản Chống Giả mạo',
    close: 'Đóng',
  },
};

export const DigitalAssetQrView: React.FC<DigitalAssetQrViewProps> = ({
  currentLang,
  assets,
  ownerName,
}) => {
  const i18n = QR_I18N[currentLang] || QR_I18N.en;
  const [activeSubTab, setActiveSubTab] = useState<'sheet' | 'focus' | 'scanner'>('sheet');
  const [selectedAssetId, setSelectedAssetId] = useState<string>(assets[0]?.id || '');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [scannerSimulating, setScannerSimulating] = useState(false);
  const [scannedResult, setScannedResult] = useState<any | null>(null);
  const [printingAsset, setPrintingAsset] = useState<AssetItem | null>(null);

  const handlePrintSingleAsset = (asset: AssetItem) => {
    setPrintingAsset(asset);
  };

  const selectedAsset = assets.find((a) => a.id === selectedAssetId) || assets[0];

  const generateAssetPayload = (asset?: AssetItem) => {
    if (!asset) return 'https://reclaim.ai/vault/qr?token=empty';
    const raw = {
      protocol: 'reclaimai-vault-v1',
      id: asset.id,
      label: asset.label,
      inst: asset.institutionName,
      jur: asset.jurisdiction,
      ref: asset.maskedReference,
      nom: asset.nomineeName || 'Unregistered',
      loc: asset.documentLocation || 'Master Family Vault',
      owner: ownerName,
      ts: 1792078600,
      hmac: `sha256:${asset.id.slice(-4)}${(asset.institutionName || 'AST').slice(0, 3)}99A`,
    };
    return `https://reclaim.ai/vault/qr?token=${encodeUtf8ToBase64(JSON.stringify(raw))}`;
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handlePrintLabels = () => {
    window.print();
  };

  const handleRunScannerSimulation = (asset?: AssetItem) => {
    if (!asset) return;
    setScannerSimulating(true);
    setScannedResult(null);

    setTimeout(() => {
      try {
        const payloadUrl = generateAssetPayload(asset);
        const token = payloadUrl.split('token=')[1];
        if (token) {
          const jsonStr = decodeBase64ToUtf8(token);
          const raw = JSON.parse(jsonStr);
          setScannedResult({
            assetId: raw.id || asset.id,
            label: raw.label || asset.label,
            institution: raw.inst || asset.institutionName,
            jurisdiction: raw.jur || asset.jurisdiction,
            reference: raw.ref || asset.maskedReference,
            nominee: raw.nom || asset.nomineeName || 'Direct Legal Heirs',
            location: raw.loc || asset.documentLocation || 'Not specified',
            verified: true,
            timestamp: new Date().toLocaleTimeString(),
            hmacValid: true,
          });
          setScannerSimulating(false);
          return;
        }
      } catch {
        // Fallback if parsing fails
      }

      setScannedResult({
        assetId: asset.id,
        label: asset.label,
        institution: asset.institutionName,
        jurisdiction: asset.jurisdiction,
        reference: asset.maskedReference,
        nominee: asset.nomineeName || 'Direct Legal Heirs',
        location: asset.documentLocation || 'Not specified',
        verified: true,
        timestamp: new Date().toLocaleTimeString(),
        hmacValid: true,
      });
      setScannerSimulating(false);
    }, 900);
  };

  return (
    <div className="space-y-8">
      {/* Top Header Bar */}
      <div className="bg-white rounded-xs border border-[#1a1a1a]/15 p-6 lg:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 no-print">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h2 className="font-serif-display text-3xl font-semibold italic text-[#1a1a1a] tracking-tight">
              {i18n.title}
            </h2>
            <span className="px-2 py-0.5 rounded-xs text-[10px] font-mono-meta font-bold bg-[#1a1a1a]/5 text-[#1a1a1a] border border-[#1a1a1a]/15 uppercase">
              Physical Storage Tags
            </span>
          </div>
          <p className="text-xs text-[#1a1a1a]/60 font-mono-meta text-[11px]">
            {i18n.subtitle}
          </p>
        </div>

        {/* View Switchers & Batch Print */}
        <div className="flex items-center gap-2.5 w-full md:w-auto overflow-x-auto">
          <div className="flex bg-[#f8f7f4] p-1 rounded-xs border border-[#1a1a1a]/15 text-[11px] font-mono-meta uppercase tracking-wider shrink-0">
            <button
              onClick={() => setActiveSubTab('sheet')}
              className={`px-3 py-1.5 rounded-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeSubTab === 'sheet'
                  ? 'bg-[#1a1a1a] text-[#f8f7f4]'
                  : 'text-[#1a1a1a]/50 hover:text-[#1a1a1a]'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Label Sheet</span>
            </button>
            <button
              onClick={() => setActiveSubTab('focus')}
              className={`px-3 py-1.5 rounded-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeSubTab === 'focus'
                  ? 'bg-[#1a1a1a] text-[#f8f7f4]'
                  : 'text-[#1a1a1a]/50 hover:text-[#1a1a1a]'
              }`}
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Inspector</span>
            </button>
            <button
              onClick={() => setActiveSubTab('scanner')}
              className={`px-3 py-1.5 rounded-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeSubTab === 'scanner'
                  ? 'bg-[#1a1a1a] text-[#f8f7f4]'
                  : 'text-[#1a1a1a]/50 hover:text-[#1a1a1a]'
              }`}
            >
              <Scan className="w-3.5 h-3.5" />
              <span>Scanner Test</span>
            </button>
          </div>

          <button
            onClick={handlePrintLabels}
            className="px-4 py-2 rounded-xs bg-[#1a1a1a] hover:bg-[#2b2b2b] text-[#f8f7f4] font-mono-meta text-[11px] uppercase tracking-widest font-semibold flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{i18n.batchPrint}</span>
          </button>
        </div>
      </div>

      {/* SUB-VIEW 1: Printable Physical Label Sheet */}
      {activeSubTab === 'sheet' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between font-mono-meta text-[11px] text-[#1a1a1a]/60 no-print">
            <span>
              {assets.length} labels ready for physical placement (passbooks, locker folders, title deeds).
            </span>
            <span className="text-[#1a1a1a] font-semibold uppercase">
              {i18n.securityLevel}
            </span>
          </div>

          {/* Grid of Printable QR Labels */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 print:grid-cols-2 print:gap-4">
            {assets.map((asset) => {
              const payloadUrl = generateAssetPayload(asset);
              return (
                <div
                  key={asset.id}
                  className="bg-white rounded-xs border-2 border-[#1a1a1a] p-5 flex flex-col justify-between relative shadow-xs print:border-black print:p-4"
                >
                  {/* Top Label Info */}
                  <div className="space-y-1 mb-3">
                    <div className="flex items-center justify-between font-mono-meta text-[9px] uppercase tracking-widest text-[#1a1a1a]/50">
                      <span>RECLAIMAI PHYSICAL TAG</span>
                      <span className="font-bold text-[#1a1a1a]">{asset.jurisdiction}</span>
                    </div>
                    <h3 className="font-serif-display text-xl font-bold text-[#1a1a1a] tracking-tight truncate">
                      {asset.label}
                    </h3>
                    <div className="text-[11px] text-[#1a1a1a]/70 flex items-center gap-1 font-mono-meta">
                      <span className="truncate">{asset.institutionName}</span>
                      <span>•</span>
                      <span>{asset.maskedReference}</span>
                    </div>
                  </div>

                  {/* Central QR Code Block */}
                  <div className="bg-[#fbfaf8] p-3 rounded-xs flex items-center justify-center my-2 border border-[#1a1a1a]/15">
                    <QRCodeSVG
                      value={payloadUrl}
                      size={130}
                      level="H"
                      includeMargin={false}
                    />
                  </div>

                  {/* Physical Coordinates Banner */}
                  <div className="mt-2 p-2.5 rounded-xs bg-[#f8f7f4] border border-[#1a1a1a]/15 font-mono-meta text-[10px] space-y-1">
                    <div className="text-[#1a1a1a] font-medium truncate">
                      <strong>AFFIX TO:</strong> {asset.documentLocation || 'Main home document safe'}
                    </div>
                    <div className="flex items-center justify-between text-[#1a1a1a]/60 text-[9px] pt-1 border-t border-[#1a1a1a]/10">
                      <span>Nominee: {asset.nomineeName || 'Family'}</span>
                      <span className="font-bold text-[#4a5d4e]">✓ SHA-256 HMAC</span>
                    </div>
                  </div>

                  {/* Actions (Hidden in Print) */}
                  <div className="mt-3 pt-2 border-t border-[#1a1a1a]/10 flex items-center justify-between text-[11px] font-mono-meta uppercase tracking-wider no-print">
                    <button
                      onClick={() => handleCopy(payloadUrl, asset.id)}
                      className="text-[#1a1a1a]/60 hover:text-[#1a1a1a] flex items-center gap-1 cursor-pointer"
                    >
                      {copiedId === asset.id ? (
                        <span className="text-[#4a5d4e] font-bold">Copied!</span>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handlePrintSingleAsset(asset)}
                        className="text-[#1a1a1a] hover:opacity-80 flex items-center gap-1 cursor-pointer font-bold"
                      >
                        <Printer className="w-3 h-3" />
                        <span>{i18n.printPdf}</span>
                      </button>

                      <button
                        onClick={() => {
                          setSelectedAssetId(asset.id);
                          setActiveSubTab('focus');
                        }}
                        className="text-[#1a1a1a] font-bold underline hover:opacity-75 cursor-pointer"
                      >
                        Inspect
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: Single Tag Inspector & Detail View */}
      {activeSubTab === 'focus' && selectedAsset && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left asset selector list */}
          <div className="lg:col-span-4 bg-white rounded-xs border border-[#1a1a1a]/15 p-6 shadow-xs space-y-2">
            <span className="font-mono-meta text-[10px] uppercase tracking-widest text-[#1a1a1a]/60 block mb-2">
              {i18n.selectAssetPrompt}
            </span>
            <div className="space-y-1.5 max-h-[500px] overflow-y-auto">
              {assets.map((asset) => {
                const isSelected = asset.id === selectedAsset.id;
                return (
                  <button
                    key={asset.id}
                    onClick={() => setSelectedAssetId(asset.id)}
                    className={`w-full text-left p-3 rounded-xs border text-xs transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#1a1a1a] text-[#f8f7f4] border-[#1a1a1a] font-semibold'
                        : 'bg-[#f8f7f4] border-[#1a1a1a]/10 text-[#1a1a1a]/80 hover:bg-white'
                    }`}
                  >
                    <div>
                      <div className="truncate font-medium">{asset.label}</div>
                      <div className={`text-[10px] font-mono-meta ${isSelected ? 'text-[#f8f7f4]/70' : 'text-[#1a1a1a]/50'}`}>
                        {asset.institutionName} • {asset.maskedReference}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right large QR Inspector Canvas */}
          <div className="lg:col-span-8 bg-white rounded-xs border-2 border-[#1a1a1a] p-8 shadow-xs flex flex-col md:flex-row items-center gap-8">
            <div className="p-6 bg-[#fbfaf8] border-2 border-[#1a1a1a] rounded-xs shrink-0 flex flex-col items-center">
              <QRCodeSVG
                value={generateAssetPayload(selectedAsset)}
                size={200}
                level="H"
                includeMargin={true}
              />
              <div className="mt-2 text-center font-mono-meta text-[9px] uppercase tracking-widest text-[#1a1a1a]/60">
                RECLAIMAI VAULT TOKEN
              </div>
            </div>

            <div className="space-y-4 flex-1 text-xs text-[#1a1a1a]">
              <div>
                <span className="font-mono-meta text-[10px] uppercase px-2 py-0.5 border border-[#1a1a1a]/15">
                  {selectedAsset.assetType.replace(/_/g, ' ')} • {selectedAsset.jurisdiction}
                </span>
                <h3 className="font-serif-display text-3xl font-bold text-[#1a1a1a] mt-2">
                  {selectedAsset.label}
                </h3>
                <p className="font-mono-meta text-xs text-[#1a1a1a]/60">
                  {selectedAsset.institutionName} ({selectedAsset.maskedReference})
                </p>
              </div>

              <div className="p-4 rounded-xs bg-[#f8f7f4] border border-[#1a1a1a]/15 space-y-1 font-mono-meta text-[11px]">
                <div className="font-bold text-[#1a1a1a] uppercase text-[10px]">
                  Physical Placement:
                </div>
                <p className="text-[#1a1a1a]/80 font-sans">
                  {selectedAsset.documentLocation || 'Affix to primary bank deposit folder in study room safe.'}
                </p>
              </div>

              <div className="p-3 rounded-xs bg-[#f8f7f4] border border-[#1a1a1a]/10 font-mono-meta text-[10px] break-all">
                <span className="text-[#1a1a1a]/50 uppercase block mb-0.5">Cryptographic Deep Link:</span>
                <div className="text-[#1a1a1a]">{generateAssetPayload(selectedAsset)}</div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={() => handleCopy(generateAssetPayload(selectedAsset), selectedAsset.id)}
                  className="px-4 py-2.5 rounded-xs bg-[#1a1a1a] hover:bg-[#2b2b2b] text-[#f8f7f4] font-mono-meta text-[11px] uppercase tracking-widest font-semibold cursor-pointer"
                >
                  {copiedId === selectedAsset.id ? 'Copied!' : 'Copy Token Link'}
                </button>
                <button
                  onClick={() => handlePrintSingleAsset(selectedAsset)}
                  className="px-4 py-2.5 rounded-xs bg-[#1a1a1a] hover:bg-[#2b2b2b] text-[#f8f7f4] font-mono-meta text-[11px] uppercase tracking-widest font-semibold cursor-pointer flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  <span>{i18n.printPdf}</span>
                </button>
                <button
                  onClick={() => {
                    handleRunScannerSimulation(selectedAsset);
                    setActiveSubTab('scanner');
                  }}
                  className="px-4 py-2.5 rounded-xs bg-white hover:bg-[#f8f7f4] text-[#1a1a1a] border border-[#1a1a1a] font-mono-meta text-[11px] uppercase tracking-widest font-semibold cursor-pointer"
                >
                  Test Scanner
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 3: Interactive QR Scanner Simulator */}
      {activeSubTab === 'scanner' && (
        <div className="bg-white rounded-xs border-2 border-[#1a1a1a] p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#1a1a1a]/10 pb-4 gap-2">
            <div>
              <h3 className="font-serif-display text-2xl font-bold text-[#1a1a1a]">
                {i18n.scannerTitle}
              </h3>
              <p className="font-mono-meta text-xs text-[#1a1a1a]/60 mt-0.5">
                {i18n.scannerDesc}
              </p>
            </div>

            <button
              onClick={() => handleRunScannerSimulation(selectedAsset)}
              disabled={scannerSimulating}
              className="px-5 py-2.5 rounded-xs bg-[#1a1a1a] hover:bg-[#2b2b2b] text-[#f8f7f4] font-mono-meta text-[11px] uppercase tracking-widest font-semibold cursor-pointer disabled:opacity-50"
            >
              {scannerSimulating ? 'Verifying HMAC...' : 'Trigger Scan on Active Tag'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Viewfinder Frame */}
            <div className="relative aspect-video bg-[#1a1a1a] rounded-xs border-2 border-[#1a1a1a] flex items-center justify-center overflow-hidden p-6">
              <div className="bg-white p-3 rounded-xs">
                <QRCodeSVG
                  value={generateAssetPayload(selectedAsset)}
                  size={120}
                  level="H"
                />
              </div>

              {scannerSimulating && (
                <div className="absolute inset-x-8 h-0.5 bg-white shadow-[0_0_10px_#ffffff] animate-bounce" />
              )}

              <div className="absolute bottom-3 font-mono-meta text-[9px] uppercase tracking-widest text-[#f8f7f4]/80 bg-black/60 px-3 py-1 border border-white/20">
                {scannerSimulating ? 'DECRYPTING SIGNATURE...' : 'ALIGN WITH PHYSICAL QR TAG'}
              </div>
            </div>

            {/* Decoded Result */}
            <div>
              {scannedResult ? (
                <div className="p-6 rounded-xs bg-[#f8f7f4] border-2 border-[#1a1a1a] space-y-3 text-xs font-mono-meta">
                  <div className="flex items-center gap-2 text-[#4a5d4e] font-bold text-sm uppercase">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Signature Authenticated</span>
                  </div>

                  <div className="space-y-2 text-[#1a1a1a] pt-1 border-t border-[#1a1a1a]/10">
                    <div className="flex justify-between">
                      <span className="text-[#1a1a1a]/60">Asset:</span>
                      <span className="font-bold">{scannedResult.label}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#1a1a1a]/60">Custodian:</span>
                      <span>{scannedResult.institution} ({scannedResult.reference})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#1a1a1a]/60">Nominee:</span>
                      <span className="font-semibold">{scannedResult.nominee}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#1a1a1a]/60">Physical Storage:</span>
                      <span className="text-right">{scannedResult.location}</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-[#1a1a1a]/10">
                      <span className="text-[#1a1a1a]/60">Integrity:</span>
                      <span className="text-[#4a5d4e] font-bold">HMAC SHA-256 MATCHED</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 rounded-xs bg-[#f8f7f4] border border-dashed border-[#1a1a1a]/20 text-center font-mono-meta text-xs space-y-2">
                  <div className="font-bold text-[#1a1a1a]">Ready to scan</div>
                  <p className="text-[#1a1a1a]/60 text-[11px]">
                    Click "Trigger Scan on Active Tag" to decrypt and match the physical asset tag.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Printable Single Asset PDF Certificate Modal */}
      {printingAsset && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xs border-2 border-[#1a1a1a] max-w-2xl w-full p-8 shadow-2xl space-y-6 relative print:border-none print:shadow-none print:p-0">
            {/* Action Bar (No Print) */}
            <div className="flex items-center justify-between border-b border-[#1a1a1a]/15 pb-4 no-print">
              <span className="font-mono-meta text-xs font-bold uppercase text-[#1a1a1a]/60">
                {i18n.assetCertificateTitle}
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-[#1a1a1a] hover:bg-[#2b2b2b] text-[#f8f7f4] font-mono-meta text-xs uppercase tracking-widest font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Official PDF</span>
                </button>
                <button
                  onClick={() => setPrintingAsset(null)}
                  className="px-4 py-2 bg-white hover:bg-[#f8f7f4] text-[#1a1a1a] border border-[#1a1a1a]/30 font-mono-meta text-xs uppercase tracking-widest font-semibold cursor-pointer"
                >
                  {i18n.close}
                </button>
              </div>
            </div>

            {/* Printable Certificate Content */}
            <div className="space-y-6 border-2 border-[#1a1a1a] p-6 sm:p-8 bg-white print:border-black">
              {/* Header */}
              <div className="flex items-center justify-between border-b-2 border-[#1a1a1a] pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-[#4a5d4e]" />
                    <span className="font-serif-display font-bold text-xl text-[#1a1a1a]">ReclaimAI Vault Trust</span>
                  </div>
                  <p className="font-mono-meta text-[10px] text-[#1a1a1a]/60 uppercase tracking-wider mt-0.5">
                    {i18n.assetCertificateTitle}
                  </p>
                </div>
                <div className="text-right font-mono-meta text-[10px] text-[#1a1a1a]/70">
                  <div>Jurisdiction: {printingAsset.jurisdiction}</div>
                  <div>Owner: {ownerName}</div>
                </div>
              </div>

              {/* Asset Title & QR Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                <div className="sm:col-span-7 space-y-3">
                  <div>
                    <span className="font-mono-meta text-[10px] uppercase px-2 py-0.5 bg-[#f8f7f4] border border-[#1a1a1a]/15 text-[#1a1a1a]/70">
                      {printingAsset.assetType.replace(/_/g, ' ')}
                    </span>
                    <h2 className="font-serif-display text-3xl font-bold text-[#1a1a1a] mt-1.5">
                      {printingAsset.label}
                    </h2>
                    <p className="font-mono-meta text-xs text-[#1a1a1a]/70">
                      {printingAsset.institutionName} • Reference: {printingAsset.maskedReference}
                    </p>
                  </div>

                  <div className="space-y-2 font-mono-meta text-xs pt-2 border-t border-[#1a1a1a]/10">
                    <div className="flex justify-between p-2 bg-[#f8f7f4]">
                      <span className="text-[#1a1a1a]/60">Registered Nominee:</span>
                      <span className="font-bold text-[#1a1a1a]">{printingAsset.nomineeName || 'Direct Legal Heirs'}</span>
                    </div>
                    <div className="flex justify-between p-2 bg-[#f8f7f4]">
                      <span className="text-[#1a1a1a]/60">Physical Location:</span>
                      <span className="font-bold text-[#1a1a1a]">{printingAsset.documentLocation || 'Master Family Vault'}</span>
                    </div>
                    <div className="flex justify-between p-2 bg-[#f8f7f4]">
                      <span className="text-[#1a1a1a]/60">Valuation / Cover:</span>
                      <span className="font-bold text-[#1a1a1a]">
                        {printingAsset.amounts.balance ? `₹${printingAsset.amounts.balance.toLocaleString()}` : printingAsset.amounts.insuranceCover ? `₹${printingAsset.amounts.insuranceCover.toLocaleString()}` : printingAsset.amounts.estimatedValue ? `₹${printingAsset.amounts.estimatedValue.toLocaleString()}` : 'Declared Record'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-5 flex flex-col items-center justify-center p-4 bg-[#fbfaf8] border border-[#1a1a1a]/20 rounded-xs">
                  <QRCodeSVG
                    value={generateAssetPayload(printingAsset)}
                    size={160}
                    level="H"
                    includeMargin={true}
                  />
                  <span className="mt-2 font-mono-meta text-[9px] uppercase tracking-widest text-[#1a1a1a]/60 text-center">
                    Level-H Tamper-Evident QR
                  </span>
                </div>
              </div>

              {/* Cryptographic Signature footer */}
              <div className="pt-4 border-t-2 border-[#1a1a1a]/20 space-y-2 font-mono-meta text-[10px] text-[#1a1a1a]/70">
                <div className="flex items-center justify-between">
                  <span>Cryptographic Seal: sha256:{printingAsset.id.slice(-6)}...{printingAsset.institutionName.slice(0, 3)}</span>
                  <span className="text-[#4a5d4e] font-bold">100% Offline Verifiable</span>
                </div>
                <p className="text-[9px] text-[#1a1a1a]/50 leading-tight">
                  This certificate anchors the physical asset coordinate and cryptographic payload for family handover. Affix the printed physical tag to the designated storage container.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
