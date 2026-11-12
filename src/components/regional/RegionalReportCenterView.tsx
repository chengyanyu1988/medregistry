import React, { useState, useMemo } from 'react';
import { UserProfile } from '../../types/navigation';
import {
  Search,
  Printer,
  Download,
  Eye,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Building2,
  FileText,
  X,
  QrCode,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Settings,
  Share2,
  Check,
  RotateCcw,
  Sliders,
} from '../MenuIcon';

export interface AntibioticSensitivityItem {
  antibiotic: string;
  method: string;
  result: string;
  susceptibility: 'S' | 'I' | 'R' | 'SDD';
}

export interface RoutineTestItem {
  itemCode: string;
  itemName: string;
  itemEn: string;
  result: string;
  flag: 'normal' | 'high' | 'low';
  refRange: string;
  unit: string;
  method: string;
}

export interface InspectionReportItem {
  id: string;
  patientName: string;
  idCard: string;
  gender: '男' | '女';
  age: string;
  testHospital: string;
  specimen: string;
  testItem: string;
  barcode: string;
  patientId: string;
  visitHospital: string;
  applyDept: string;
  applyDoctor: string;
  reportTime: string;
  sampleTime: string;
  receiveTime: string;
  testTime: string;
  caseNo: string;
  uniqueNo: string;
  bedNo: string;
  visitType: '住院' | '门诊' | '急诊';
  instrument: string;
  clinicalDiagnosis: string;
  tester: string;
  auditor: string;
  hospitalTitle: string;
  isMicrobiology?: boolean;
  bacteria?: string;
  colonyCount?: string;
  specimenQuality?: string;
  sensitivities?: AntibioticSensitivityItem[];
  routineItems?: RoutineTestItem[];
  comment?: string;
  totalPages?: number;
  currentPage?: number;
}

export const INITIAL_REPORT_LIST: InspectionReportItem[] = [
  {
    id: 'RPT-001',
    patientName: '张太彬',
    idCard: '500231195806141238',
    gender: '男',
    age: '66岁',
    testHospital: '中心医院',
    specimen: '痰液',
    testItem: '(一般细菌+嗜血杆菌)培养+鉴定+药敏',
    barcode: '0901001',
    patientId: '540093',
    visitHospital: '城东社区卫生服务中心',
    applyDept: '呼吸与危重症医学科一病区',
    applyDoctor: '蔡雨君',
    reportTime: '2026-10-30 08:40:00',
    sampleTime: '2026-10-28 14:51',
    receiveTime: '2026-10-29 08:25',
    testTime: '2026-10-29 08:48',
    caseNo: '22040742',
    uniqueNo: '222204061139',
    bedNo: '60',
    visitType: '住院',
    instrument: 'VITEK2',
    clinicalDiagnosis: '肺栓塞, 左下肢静脉血栓形成, 原发性高血压3级 极高危',
    tester: '吴朝菊',
    auditor: '景敏',
    hospitalTitle: '重庆市垫江县人民医院检验报告单',
    isMicrobiology: true,
    bacteria: '肺炎克雷伯氏菌 (Klebsiella pneumoniae)',
    colonyCount: '2+',
    specimenQuality: '白细胞>25个/LP, 上皮细胞<10个/LP',
    comment: '分离菌株为肺炎克雷伯氏菌，产超广谱β-内酰胺酶(ESBLs)阴性，对碳青霉烯类及酶抑制剂复合制剂高度敏感。',
    totalPages: 2,
    currentPage: 1,
    sensitivities: [
      { antibiotic: '阿莫西林/克拉维酸', method: 'K-B', result: '20', susceptibility: 'S' },
      { antibiotic: '头孢唑林', method: 'K-B', result: '22', susceptibility: 'I' },
      { antibiotic: '头孢呋辛钠(非口服)', method: 'K-B', result: '21', susceptibility: 'S' },
      { antibiotic: '头孢呋辛(口服)', method: 'K-B', result: '21', susceptibility: 'I' },
      { antibiotic: '头孢哌酮/舒巴坦', method: 'K-B', result: '26', susceptibility: 'S' },
      { antibiotic: '米诺环素', method: 'K-B', result: '16', susceptibility: 'S' },
      { antibiotic: '美罗培南', method: 'K-B', result: '26', susceptibility: 'S' },
      { antibiotic: '环丙沙星', method: 'K-B', result: '24', susceptibility: 'S' },
      { antibiotic: '左氧氟沙星', method: 'K-B', result: '25', susceptibility: 'S' },
      { antibiotic: '阿米卡星', method: 'K-B', result: '22', susceptibility: 'S' },
      { antibiotic: '哌拉西林/他唑巴坦', method: 'K-B', result: '24', susceptibility: 'S' },
      { antibiotic: '亚胺培南', method: 'K-B', result: '25', susceptibility: 'S' },
    ],
  },
  {
    id: 'RPT-002',
    patientName: '王建平',
    idCard: '330104197203152819',
    gender: '男',
    age: '45岁',
    testHospital: '中心医院',
    specimen: '血液',
    testItem: '血培养+鉴定+药敏',
    barcode: '0901002',
    patientId: '540233',
    visitHospital: '城东社区卫生服务中心',
    applyDept: '内科',
    applyDoctor: '刘全医生',
    reportTime: '2026-10-30 09:12:10',
    sampleTime: '2026-10-28 10:20',
    receiveTime: '2026-10-28 11:30',
    testTime: '2026-10-29 16:00',
    caseNo: '22040788',
    uniqueNo: '222204061140',
    bedNo: '18',
    visitType: '住院',
    instrument: 'BACT/ALERT 3D & VITEK2',
    clinicalDiagnosis: '发热待查、疑似感染性心内膜炎',
    tester: '吴朝菊',
    auditor: '景敏',
    hospitalTitle: '重庆市垫江县人民医院检验报告单',
    isMicrobiology: true,
    bacteria: '金黄色葡萄球菌 (Staphylococcus aureus)',
    colonyCount: '阳性生长时间 14.5h',
    specimenQuality: '双侧双套标准无菌采血，需氧瓶与厌氧瓶均报警阳性',
    comment: '甲氧西林敏感金黄色葡萄球菌(MSSA)，建议优选苯唑西林或一代头孢菌素针对性抗感染治疗。',
    totalPages: 1,
    currentPage: 1,
    sensitivities: [
      { antibiotic: '苯唑西林', method: 'MIC', result: '<=0.25', susceptibility: 'S' },
      { antibiotic: '青霉素', method: 'K-B', result: '12', susceptibility: 'R' },
      { antibiotic: '头孢唑林', method: 'K-B', result: '28', susceptibility: 'S' },
      { antibiotic: '万古霉素', method: 'MIC', result: '1.0', susceptibility: 'S' },
      { antibiotic: '利奈唑胺', method: 'MIC', result: '1.5', susceptibility: 'S' },
      { antibiotic: '庆大霉素', method: 'K-B', result: '22', susceptibility: 'S' },
      { antibiotic: '红霉素', method: 'K-B', result: '14', susceptibility: 'R' },
      { antibiotic: '克林霉素', method: 'K-B', result: '13', susceptibility: 'R' },
    ],
  },
  {
    id: 'RPT-003',
    patientName: '李琴',
    idCard: '330106199808221523',
    gender: '女',
    age: '23岁',
    testHospital: '中心医院',
    specimen: '痰液',
    testItem: '痰涂片革兰染色与细胞学评价',
    barcode: '0901003',
    patientId: '540234',
    visitHospital: '城东社区卫生服务中心',
    applyDept: '妇科',
    applyDoctor: '吴文彬医生',
    reportTime: '2026-10-30 09:25:00',
    sampleTime: '2026-10-30 08:15',
    receiveTime: '2026-10-30 08:35',
    testTime: '2026-10-30 09:05',
    caseNo: '22040812',
    uniqueNo: '222204061141',
    bedNo: '门诊',
    visitType: '门诊',
    instrument: '显微镜高倍光学镜检',
    clinicalDiagnosis: '急性上呼吸道感染随访',
    tester: '李静',
    auditor: '景敏',
    hospitalTitle: '重庆市垫江县人民医院检验报告单',
    isMicrobiology: false,
    routineItems: [
      { itemCode: 'WBC', itemName: '白细胞镜检', itemEn: 'WBC', result: '10-15', flag: 'high', refRange: '0 - 5', unit: '/HP', method: '显微镜检' },
      { itemCode: 'EPI', itemName: '鳞状上皮细胞', itemEn: 'Epi', result: '少许', flag: 'normal', refRange: '少许', unit: '', method: '显微镜检' },
      { itemCode: 'G+', itemName: '革兰阳性球菌', itemEn: 'G+ Cocci', result: '成对或短链状可见', flag: 'normal', refRange: '未见', unit: '', method: '革兰染色' },
      { itemCode: 'G-', itemName: '革兰阴性杆菌', itemEn: 'G- Bacilli', result: '未见明显优势菌群', flag: 'normal', refRange: '未见', unit: '', method: '革兰染色' },
    ],
    comment: '标本镜检白细胞增多，菌群呈呼吸道正常伴生分布，未见特异性致病菌大量聚集。',
  },
  {
    id: 'RPT-004',
    patientName: '陈秀英',
    idCard: '330104195804123321',
    gender: '女',
    age: '68岁',
    testHospital: '中心医院',
    specimen: '痰液',
    testItem: '结核菌涂片抗酸染色',
    barcode: '0901004',
    patientId: '540235',
    visitHospital: '滨江街道社区卫生服务中心',
    applyDept: '慢病管理科',
    applyDoctor: '黄淑珍医生',
    reportTime: '2026-10-30 09:35:10',
    sampleTime: '2026-10-30 08:20',
    receiveTime: '2026-10-30 08:45',
    testTime: '2026-10-30 09:15',
    caseNo: '22040856',
    uniqueNo: '222204061142',
    bedNo: '门诊',
    visitType: '门诊',
    instrument: '荧光金胺O染色 / 抗酸染色仪',
    clinicalDiagnosis: '慢性支气管炎、排查肺结核',
    tester: '王明华',
    auditor: '景敏',
    hospitalTitle: '重庆市垫江县人民医院检验报告单',
    isMicrobiology: false,
    routineItems: [
      { itemCode: 'AFB', itemName: '抗酸杆菌涂片(金胺O荧光法)', itemEn: 'AFB Staining', result: '阴性 (-)', flag: 'normal', refRange: '阴性 (-)', unit: '', method: '金胺O荧光染色' },
      { itemCode: 'ZL', itemName: '萋-尼氏抗酸染色复核', itemEn: 'Ziehl-Neelsen', result: '未查见抗酸杆菌 (0条/300视野)', flag: 'normal', refRange: '未查见', unit: '', method: '热染色镜检' },
    ],
    comment: '300个油镜视野未查见抗酸杆菌，结果阴性。如有临床指征建议结合结核菌核酸PCR或结核培养进一步排查。',
  },
  {
    id: 'RPT-005',
    patientName: '周小波',
    idCard: '330106199201191018',
    gender: '男',
    age: '34岁',
    testHospital: '中心医院',
    specimen: '血液',
    testItem: '心肌损伤标志物三项(cTnI/CK-MB/Myo)',
    barcode: '0901005',
    patientId: '540236',
    visitHospital: '科技城社区卫生服务中心',
    applyDept: '全科医疗科',
    applyDoctor: '赵芳医生',
    reportTime: '2026-10-30 09:40:00',
    sampleTime: '2026-10-30 08:40',
    receiveTime: '2026-10-30 09:10',
    testTime: '2026-10-30 09:28',
    caseNo: '22040899',
    uniqueNo: '222204061143',
    bedNo: '急诊03',
    visitType: '急诊',
    instrument: '雅培 Alinity i 化学发光仪',
    clinicalDiagnosis: '阵发性胸闷、排查急性冠脉综合征',
    tester: '张珊',
    auditor: '景敏',
    hospitalTitle: '重庆市垫江县人民医院检验报告单',
    isMicrobiology: false,
    routineItems: [
      { itemCode: 'hs-cTnI', itemName: '超敏肌钙蛋白I', itemEn: 'hs-cTnI', result: '8.4', flag: 'normal', refRange: '< 26.2', unit: 'pg/mL', method: '化学发光微粒子法' },
      { itemCode: 'CK-MB', itemName: '肌酸激酶同工酶质量', itemEn: 'CK-MB mass', result: '1.8', flag: 'normal', refRange: '0.0 - 5.0', unit: 'ng/mL', method: '化学发光法' },
      { itemCode: 'MYO', itemName: '肌红蛋白', itemEn: 'Myoglobin', result: '32.1', flag: 'normal', refRange: '0.0 - 106.0', unit: 'ng/mL', method: '免疫比浊法' },
    ],
    comment: '超敏肌钙蛋白及心肌酶谱指标均在正常参考限内，未提示急性心肌坏死性病变，建议3小时后复测动态观察。',
  },
  {
    id: 'RPT-006',
    patientName: '孙德荣',
    idCard: '330104196409154419',
    gender: '男',
    age: '62岁',
    testHospital: '中心医院',
    specimen: '血浆',
    testItem: '凝血六项(PT/APTT/TT/FIB/DD/FDP)',
    barcode: '0901006',
    patientId: '540237',
    visitHospital: '康复第二分院',
    applyDept: '神经康复一病区',
    applyDoctor: '吴文彬医生',
    reportTime: '2026-10-30 09:48:00',
    sampleTime: '2026-10-30 08:15',
    receiveTime: '2026-10-30 08:42',
    testTime: '2026-10-30 09:30',
    caseNo: '22040922',
    uniqueNo: '222204061144',
    bedNo: '床位41',
    visitType: '住院',
    instrument: 'Stago STA-R Max 全自动凝血分析仪',
    clinicalDiagnosis: '脑梗死恢复期、抗凝监测',
    tester: '张珊',
    auditor: '景敏',
    hospitalTitle: '重庆市垫江县人民医院检验报告单',
    isMicrobiology: false,
    routineItems: [
      { itemCode: 'PT', itemName: '凝血酶原时间', itemEn: 'PT', result: '12.8', flag: 'normal', refRange: '11.0 - 14.5', unit: '秒', method: '凝固法' },
      { itemCode: 'INR', itemName: '国际标准化比值', itemEn: 'PT-INR', result: '1.09', flag: 'normal', refRange: '0.85 - 1.15', unit: '', method: '衍生计算' },
      { itemCode: 'APTT', itemName: '活化部分凝血活酶时间', itemEn: 'APTT', result: '32.4', flag: 'normal', refRange: '28.0 - 43.5', unit: '秒', method: '凝固法' },
      { itemCode: 'FIB', itemName: '纤维蛋白原定量', itemEn: 'Fib', result: '3.62', flag: 'normal', refRange: '2.00 - 4.00', unit: 'g/L', method: 'Clauss法' },
      { itemCode: 'TT', itemName: '凝血酶时间', itemEn: 'TT', result: '16.5', flag: 'normal', refRange: '14.0 - 21.0', unit: '秒', method: '凝固法' },
      { itemCode: 'D-Dimer', itemName: 'D-二聚体定量', itemEn: 'D-Dimer', result: '0.38', flag: 'normal', refRange: '< 0.50', unit: 'mg/L FEU', method: '免疫比浊法' },
    ],
    comment: '凝血功能各主要生理指标基本平稳，D-二聚体水平正常，未提示急性静脉血栓高凝活化状态。',
  },
  {
    id: 'RPT-007',
    patientName: '郑雅婷',
    idCard: '330104199703241829',
    gender: '女',
    age: '29岁',
    testHospital: '中心医院',
    specimen: '血清',
    testItem: '甲状腺激素全套五项',
    barcode: '0901007',
    patientId: '540238',
    visitHospital: '滨江街道社区卫生服务中心',
    applyDept: '内分泌科',
    applyDoctor: '孙立伟医生',
    reportTime: '2026-10-30 09:55:00',
    sampleTime: '2026-10-30 09:15',
    receiveTime: '2026-10-30 09:30',
    testTime: '2026-10-30 09:45',
    caseNo: '22040955',
    uniqueNo: '222204061145',
    bedNo: '门诊',
    visitType: '门诊',
    instrument: '罗氏 Cobas e801 电化学发光仪',
    clinicalDiagnosis: '甲亢服药后复查随访',
    tester: '李静',
    auditor: '景敏',
    hospitalTitle: '重庆市垫江县人民医院检验报告单',
    isMicrobiology: false,
    routineItems: [
      { itemCode: 'TSH', itemName: '促甲状腺激素', itemEn: 'TSH', result: '2.15', flag: 'normal', refRange: '0.27 - 4.20', unit: 'mIU/L', method: 'ECLIA电化学发光' },
      { itemCode: 'FT3', itemName: '游离三碘甲状腺原氨酸', itemEn: 'FT3', result: '4.82', flag: 'normal', refRange: '3.10 - 6.80', unit: 'pmol/L', method: 'ECLIA电化学发光' },
      { itemCode: 'FT4', itemName: '游离甲状腺素', itemEn: 'FT4', result: '16.4', flag: 'normal', refRange: '12.0 - 22.0', unit: 'pmol/L', method: 'ECLIA电化学发光' },
      { itemCode: 'TT3', itemName: '总三碘甲状腺原氨酸', itemEn: 'TT3', result: '1.92', flag: 'normal', refRange: '1.30 - 3.10', unit: 'nmol/L', method: 'ECLIA电化学发光' },
      { itemCode: 'TT4', itemName: '总甲状腺素', itemEn: 'TT4', result: '104.2', flag: 'normal', refRange: '66.0 - 181.0', unit: 'nmol/L', method: 'ECLIA电化学发光' },
    ],
    comment: '甲功五项指标已回归健康参考范围，建议遵循临床医师指导维持抗甲状腺药物原治疗剂量。',
  },
  {
    id: 'RPT-008',
    patientName: '钱桂英',
    idCard: '330104195411082218',
    gender: '女',
    age: '72岁',
    testHospital: '中心医院',
    specimen: '尿液',
    testItem: '尿微量白蛋白/肌酐比值(ACR)',
    barcode: '0901008',
    patientId: '540239',
    visitHospital: '科技城社区卫生服务中心',
    applyDept: '慢病科',
    applyDoctor: '赵芳医生',
    reportTime: '2026-10-30 09:58:00',
    sampleTime: '2026-10-30 09:20',
    receiveTime: '2026-10-30 09:40',
    testTime: '2026-10-30 09:52',
    caseNo: '22040980',
    uniqueNo: '222204061146',
    bedNo: '床位12',
    visitType: '住院',
    instrument: '德瑞 FUS-2000 全自动尿液分析流水线',
    clinicalDiagnosis: '2型糖尿病肾病早期筛查',
    tester: '张珊',
    auditor: '景敏',
    hospitalTitle: '重庆市垫江县人民医院检验报告单',
    isMicrobiology: false,
    routineItems: [
      { itemCode: 'mALB', itemName: '尿微量白蛋白定量', itemEn: 'mALB', result: '42.8', flag: 'high', refRange: '< 20.0', unit: 'mg/L', method: '免疫比浊法' },
      { itemCode: 'UCR', itemName: '尿肌酐定量', itemEn: 'U-CREA', result: '6.8', flag: 'normal', refRange: '3.5 - 15.0', unit: 'mmol/L', method: '苦味酸法' },
      { itemCode: 'ACR', itemName: '尿微量白蛋白/肌酐比值', itemEn: 'ACR', result: '5.58', flag: 'high', refRange: '< 3.00', unit: 'mg/mmol', method: '比值计算' },
    ],
    comment: '尿微量白蛋白/肌酐比值(ACR)轻度升高，提示早期糖尿病肾脏微血管受累，建议定期复检并规范控制血压血糖。',
  },
];

interface RegionalReportCenterViewProps {
  user: UserProfile;
  triggerAction: (text: string) => void;
}

export const RegionalReportCenterView: React.FC<RegionalReportCenterViewProps> = ({
  user,
  triggerAction,
}) => {
  const [reports, setReports] = useState<InspectionReportItem[]>(INITIAL_REPORT_LIST);
  const [selectedIds, setSelectedIds] = useState<string[]>(['RPT-001']);

  // Filters (matching screenshot)
  const [patientSearch, setPatientSearch] = useState('');
  const [hospitalFilter, setHospitalFilter] = useState('全部');
  const [startDate, setStartDate] = useState('2026-10-30');
  const [endDate, setEndDate] = useState('2026-10-30');

  // Modals
  // 1. Report Sheet Modal (as requested: 右侧信息改成点击左侧后弹窗展示)
  const [modalReport, setModalReport] = useState<InspectionReportItem | null>(null);
  const [reportModalPage, setReportModalPage] = useState<number>(1);

  // 2. Batch Print Modal
  const [isBatchPrintModalOpen, setIsBatchPrintModalOpen] = useState(false);

  // 3. Print Settings Modal
  const [isPrintSettingModalOpen, setIsPrintSettingModalOpen] = useState(false);
  const [printerName, setPrinterName] = useState('理光 Aficio MP 3352 (检验科网络打印机)');
  const [paperFormat, setPaperFormat] = useState('A4 纵向');
  const [showWatermark, setShowWatermark] = useState(true);
  const [showStamp, setShowStamp] = useState(true);
  const [headerTitle, setHeaderTitle] = useState('重庆市垫江县人民医院检验报告单');

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const hospitalOptions = [
    '全部',
    '中心医院',
    '城东社区卫生服务中心',
    '滨江街道社区卫生服务中心',
    '科技城社区卫生服务中心',
    '康复第二分院',
  ];

  // Filtered reports
  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      if (hospitalFilter !== '全部') {
        if (r.testHospital !== hospitalFilter && r.visitHospital !== hospitalFilter) {
          return false;
        }
      }
      if (patientSearch.trim()) {
        const q = patientSearch.trim().toLowerCase();
        const match =
          r.patientName.toLowerCase().includes(q) ||
          r.idCard.toLowerCase().includes(q) ||
          r.barcode.toLowerCase().includes(q) ||
          r.patientId.toLowerCase().includes(q) ||
          r.testItem.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [reports, hospitalFilter, patientSearch]);

  // Checkbox select all / toggle
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredReports.map((r) => r.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleRow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Open modal for a specific report
  const handleOpenReportModal = (item: InspectionReportItem) => {
    setModalReport(item);
    setReportModalPage(item.currentPage || 1);
  };

  // Paging in modal
  const handleModalPrevPage = () => {
    if (reportModalPage > 1) {
      setReportModalPage((p) => p - 1);
    } else {
      showToast('当前已是第一页');
    }
  };

  const handleModalNextPage = () => {
    if (modalReport && reportModalPage < (modalReport.totalPages || 1)) {
      setReportModalPage((p) => p + 1);
    } else {
      showToast('当前已是最后一页');
    }
  };

  // Execute Batch Print
  const handleExecutePrint = () => {
    if (selectedIds.length === 0) {
      showToast('请先勾选需要打印的检验报告单！');
      return;
    }
    setIsBatchPrintModalOpen(true);
  };

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-slate-50 overflow-hidden font-sans">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-16 right-8 z-50 animate-bounceIn">
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 text-white text-xs shadow-xl border border-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Top Filter & Toolbar (Matching screenshot: 患者信息, 检验单位, 报告时间, 查询 + 打印, 打印设置) */}
      <div className="bg-white border-b border-slate-200 px-5 py-3 shrink-0 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Top Row: Search Form Controls */}
          <div className="flex flex-wrap items-center gap-4 text-xs">
            {/* 患者信息 [姓名/身份证号] */}
            <div className="flex items-center gap-2">
              <span className="text-slate-700 font-medium whitespace-nowrap">患者信息</span>
              <input
                type="text"
                placeholder="姓名/身份证号"
                value={patientSearch}
                onChange={(e) => setPatientSearch(e.target.value)}
                className="w-44 px-3 py-1.5 text-xs text-slate-800 bg-white border border-slate-300 rounded focus:outline-hidden focus:border-blue-500 placeholder-slate-400"
              />
            </div>

            {/* 检验单位 [全部] */}
            <div className="flex items-center gap-2">
              <span className="text-slate-700 font-medium whitespace-nowrap">检验单位</span>
              <select
                value={hospitalFilter}
                onChange={(e) => setHospitalFilter(e.target.value)}
                className="px-3 py-1.5 text-xs text-slate-800 bg-white border border-slate-300 rounded focus:outline-hidden focus:border-blue-500 min-w-[120px]"
              >
                {hospitalOptions.map((h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                ))}
              </select>
            </div>

            {/* 报告时间 [2026-10-30 ~ 2026-10-30] */}
            <div className="flex items-center gap-2">
              <span className="text-slate-700 font-medium whitespace-nowrap">报告时间</span>
              <div className="flex items-center gap-1.5 bg-white border border-slate-300 rounded px-2.5 py-1">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="text-xs font-mono text-slate-700 focus:outline-hidden bg-transparent"
                />
                <span className="text-slate-400 px-0.5">~</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="text-xs font-mono text-slate-700 focus:outline-hidden bg-transparent"
                />
              </div>
            </div>

            {/* 查询按钮 (白底蓝边) */}
            <button
              type="button"
              onClick={() => {
                showToast(`查询成功，检索到 ${filteredReports.length} 份匹配的检验报告单`);
                triggerAction('执行检验报告查询');
              }}
              className="px-5 py-1.5 bg-white border border-[#1890ff] text-[#1890ff] hover:bg-blue-50 text-xs font-medium rounded transition-colors shadow-2xs"
            >
              查询
            </button>
          </div>

          {/* Right Refresh & Info */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 hidden sm:inline">
              今日归档报告: <strong className="font-mono text-slate-800">{reports.length}</strong> 份
            </span>
            <button
              onClick={() => {
                showToast('已刷新检验报告中心列表');
                triggerAction('刷新检验报告列表');
              }}
              className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 border border-slate-300 rounded transition-colors"
              title="刷新数据"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Second Row: 打印 (solid blue) & 打印设置 (white with blue border) */}
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleExecutePrint}
              className="px-4 py-1.5 bg-[#1890ff] hover:bg-blue-600 active:bg-blue-700 text-white text-xs font-medium rounded transition-colors shadow-2xs flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>打印</span>
              {selectedIds.length > 0 && (
                <span className="bg-blue-800/40 text-[10px] px-1.5 py-0.2 rounded-full">
                  {selectedIds.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setIsPrintSettingModalOpen(true)}
              className="px-3.5 py-1.5 bg-white border border-[#1890ff] text-[#1890ff] hover:bg-blue-50 text-xs font-medium rounded transition-colors shadow-2xs flex items-center gap-1.5"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>打印设置</span>
            </button>
          </div>

          <div className="text-[11px] text-slate-500 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>区域结果互认达标率 99.2% · 点击任意行调阅电子病历检验单弹窗</span>
          </div>
        </div>
      </div>

      {/* Main Table: Full Width Display (Right side report moved to modal as requested) */}
      <div className="flex-1 overflow-auto min-h-0 bg-white">
        <table className="w-full border-collapse text-left text-xs text-slate-700 select-text">
          <thead className="bg-[#fafafa] text-slate-700 font-medium sticky top-0 z-10 border-b border-slate-200">
            <tr className="border-b border-slate-200">
              <th className="py-2.5 px-3 w-8 text-center">
                <input
                  type="checkbox"
                  checked={
                    filteredReports.length > 0 &&
                    selectedIds.length === filteredReports.length
                  }
                  onChange={handleSelectAll}
                  className="rounded border-slate-300 text-blue-600 focus:ring-0 cursor-pointer"
                />
              </th>
              <th className="py-2.5 px-3 whitespace-nowrap">患者姓名</th>
              <th className="py-2.5 px-3 whitespace-nowrap">身份证号</th>
              <th className="py-2.5 px-3 whitespace-nowrap">性别</th>
              <th className="py-2.5 px-3 whitespace-nowrap">年龄</th>
              <th className="py-2.5 px-3 whitespace-nowrap">检验医院</th>
              <th className="py-2.5 px-3 whitespace-nowrap">标本</th>
              <th className="py-2.5 px-3 whitespace-nowrap">检验项目</th>
              <th className="py-2.5 px-3 whitespace-nowrap">采集条码</th>
              <th className="py-2.5 px-3 whitespace-nowrap">患者标识</th>
              <th className="py-2.5 px-3 whitespace-nowrap">就诊医院</th>
              <th className="py-2.5 px-3 whitespace-nowrap">申请科室</th>
              <th className="py-2.5 px-3 whitespace-nowrap">报告时间</th>
              <th className="py-2.5 px-3 whitespace-nowrap text-center">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredReports.length === 0 ? (
              <tr>
                <td colSpan={14} className="py-16 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <FileText className="w-8 h-8 text-slate-300" />
                    <span>暂无符合查询条件的检验报告</span>
                  </div>
                </td>
              </tr>
            ) : (
              filteredReports.map((item) => {
                const isSelected = selectedIds.includes(item.id);

                return (
                  <tr
                    key={item.id}
                    onClick={() => handleOpenReportModal(item)}
                    className={`hover:bg-blue-50/50 cursor-pointer transition-colors ${
                      isSelected ? 'bg-blue-50/70' : ''
                    }`}
                  >
                    {/* Checkbox */}
                    <td
                      className="py-2 px-3 text-center"
                      onClick={(e) => handleToggleRow(item.id, e)}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        className="rounded border-slate-300 text-blue-600 focus:ring-0 cursor-pointer"
                      />
                    </td>

                    {/* 患者姓名 */}
                    <td className="py-2.5 px-3 whitespace-nowrap font-semibold text-slate-900">
                      {item.patientName}
                    </td>

                    {/* 身份证号 */}
                    <td className="py-2.5 px-3 whitespace-nowrap font-mono text-slate-600">
                      {item.idCard}
                    </td>

                    {/* 性别 */}
                    <td className="py-2.5 px-3 whitespace-nowrap text-slate-700">
                      {item.gender}
                    </td>

                    {/* 年龄 */}
                    <td className="py-2.5 px-3 whitespace-nowrap text-slate-700">
                      {item.age}
                    </td>

                    {/* 检验医院 */}
                    <td className="py-2.5 px-3 whitespace-nowrap text-slate-800">
                      {item.testHospital}
                    </td>

                    {/* 标本 */}
                    <td className="py-2.5 px-3 whitespace-nowrap text-slate-700">
                      <span className="px-1.5 py-0.5 rounded text-[11px] bg-slate-100 text-slate-700">
                        {item.specimen}
                      </span>
                    </td>

                    {/* 检验项目 */}
                    <td className="py-2.5 px-3 whitespace-nowrap font-medium text-slate-900">
                      {item.testItem}
                    </td>

                    {/* 采集条码 */}
                    <td className="py-2.5 px-3 whitespace-nowrap font-mono font-medium text-blue-700">
                      {item.barcode}
                    </td>

                    {/* 患者标识 */}
                    <td className="py-2.5 px-3 whitespace-nowrap font-mono text-slate-700">
                      {item.patientId}
                    </td>

                    {/* 就诊医院 */}
                    <td className="py-2.5 px-3 whitespace-nowrap text-slate-800">
                      {item.visitHospital}
                    </td>

                    {/* 申请科室 */}
                    <td className="py-2.5 px-3 whitespace-nowrap text-slate-700">
                      {item.applyDept}
                    </td>

                    {/* 报告时间 */}
                    <td className="py-2.5 px-3 whitespace-nowrap font-mono text-slate-600">
                      {item.reportTime}
                    </td>

                    {/* 操作 */}
                    <td
                      className="py-2.5 px-3 text-center whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleOpenReportModal(item)}
                          className="px-2 py-0.5 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 font-medium text-[11px]"
                        >
                          调阅报告
                        </button>
                        <button
                          onClick={() => {
                            setModalReport(item);
                            showToast(`正在调用本地打印机输出【${item.patientName}】检验报告单`);
                            triggerAction(`打印报告单: ${item.barcode}`);
                          }}
                          className="p-1 text-slate-500 hover:text-blue-600 rounded"
                          title="打印单份"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Status Bar */}
      <div className="bg-[#fafafa] border-t border-slate-200 px-5 py-2 shrink-0 flex flex-wrap items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-4">
          <span>
            共检索到 <strong className="text-slate-800">{filteredReports.length}</strong> 份检验报告
          </span>
          {selectedIds.length > 0 && (
            <span className="text-blue-600 font-medium">
              已选中 {selectedIds.length} 份报告
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 text-[11px]">
          <span>审核员: <strong className="text-slate-700">{user.name || '景敏'}</strong></span>
          <span className="text-slate-300">|</span>
          <span>区域质控互认中心在线认证</span>
        </div>
      </div>

      {/* ------------------ MODALS ------------------ */}

      {/* 1. REPORT SHEET MODAL (右侧显示的检验报告单转换成的完整弹窗展示) */}
      {modalReport && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-2xs flex items-center justify-center p-3 sm:p-5">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-300 w-full max-w-4xl max-h-[95vh] flex flex-col overflow-hidden animate-fadeIn">
            {/* Modal Title Bar with Paging & Actions (matching the top-right 上一页 / 下一页 in screenshot!) */}
            <div className="bg-slate-900 text-white px-5 py-3 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-sky-400" />
                <span className="font-semibold text-sm">
                  检验报告单调阅预览 (电子病历原件)
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  全国/区域互认
                </span>
              </div>

              {/* Paging & Action Buttons from screenshot */}
              <div className="flex items-center gap-3">
                {/* 上一页 / 下一页 Buttons matching screenshot */}
                <div className="flex items-center gap-1.5 bg-slate-800 p-1 rounded border border-slate-700">
                  <button
                    onClick={handleModalPrevPage}
                    className="px-2.5 py-1 text-xs text-white hover:bg-slate-700 rounded transition-colors flex items-center gap-1"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>上一页</span>
                  </button>
                  <span className="text-[11px] font-mono text-slate-300 px-1.5">
                    第 {reportModalPage} 页 / 共 {modalReport.totalPages || 2} 页
                  </span>
                  <button
                    onClick={handleModalNextPage}
                    className="px-2.5 py-1 text-xs text-white hover:bg-slate-700 rounded transition-colors flex items-center gap-1"
                  >
                    <span>下一页</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={() => {
                    showToast(`报告单已发送至网络激光打印机 (${printerName})`);
                    triggerAction(`打印报告单: ${modalReport.barcode}`);
                  }}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded flex items-center gap-1 shadow-2xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>打印报告</span>
                </button>

                <button
                  onClick={() => setModalReport(null)}
                  className="text-slate-400 hover:text-white p-1 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Paper Container (Simulating clinical A4 physical laboratory report sheet) */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-100 min-h-0">
              <div className="bg-white p-6 sm:p-8 rounded-lg shadow-sm border border-slate-200 max-w-3xl mx-auto space-y-4 text-slate-800 font-sans">
                {/* 1. Header with Hospital Logo & Title (matching screenshot: 重庆市垫江县人民医院检验报告单) */}
                <div className="text-center pb-2 border-b-2 border-slate-900">
                  <div className="flex items-center justify-center gap-3 mb-1">
                    {/* Hospital Medical Cross Logo */}
                    <div className="w-8 h-8 rounded-full border-2 border-emerald-600 flex items-center justify-center text-emerald-600 font-bold text-lg">
                      ✚
                    </div>
                    <h2 className="text-xl font-bold tracking-wider text-slate-900 font-serif">
                      {headerTitle || modalReport.hospitalTitle}
                    </h2>
                  </div>
                  <h3 className="text-sm font-semibold tracking-wide text-slate-800 mt-1">
                    {modalReport.testItem}
                  </h3>
                </div>

                {/* 2. Patient Demographics & Order Metadata (Exactly matching the 4 rows in screenshot!) */}
                <div className="text-xs border-b border-slate-300 pb-2.5 space-y-1.5 leading-relaxed">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div>
                      <span className="text-slate-600">姓 名：</span>
                      <strong className="text-slate-900 text-sm">{modalReport.patientName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-600">病案号：</span>
                      <span className="font-mono text-slate-900">{modalReport.caseNo}</span>
                    </div>
                    <div>
                      <span className="text-slate-600">申请医师：</span>
                      <span className="text-slate-900 font-medium">{modalReport.applyDoctor}</span>
                    </div>
                    <div>
                      <span className="text-slate-600">唯一编号：</span>
                      <span className="font-mono text-slate-900">{modalReport.uniqueNo}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div>
                      <span className="text-slate-600">性 别：</span>
                      <span className="text-slate-900">{modalReport.gender}</span>
                    </div>
                    <div>
                      <span className="text-slate-600">科 别：</span>
                      <span className="text-slate-900">{modalReport.applyDept}</span>
                    </div>
                    <div>
                      <span className="text-slate-600">样本类型：</span>
                      <span className="text-slate-900 font-medium">{modalReport.specimen}</span>
                    </div>
                    <div>
                      <span className="text-slate-600">检验序号：</span>
                      <span className="font-mono text-slate-900">220407008</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div>
                      <span className="text-slate-600">年 龄：</span>
                      <span className="text-slate-900">{modalReport.age}</span>
                    </div>
                    <div>
                      <span className="text-slate-600">床 号：</span>
                      <span className="font-mono text-slate-900">{modalReport.bedNo}</span>
                    </div>
                    <div>
                      <span className="text-slate-600">就诊类型：</span>
                      <span className="text-slate-900">{modalReport.visitType}</span>
                    </div>
                    <div>
                      <span className="text-slate-600">检验仪器：</span>
                      <span className="font-mono text-slate-900">{modalReport.instrument}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between text-[11px] pt-1">
                    <div>
                      <span className="text-slate-600">临床诊断：</span>
                      <span className="text-slate-900 font-medium">{modalReport.clinicalDiagnosis}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">送检单位：</span>
                      <span className="text-slate-700">{modalReport.visitHospital}</span>
                    </div>
                  </div>
                </div>

                {/* 3. Microbiology Test Header & Specimen Evaluation (matching screenshot) */}
                {modalReport.isMicrobiology && (
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between text-xs py-1 px-2 bg-slate-50 border border-slate-200 rounded font-medium">
                      <div>
                        <span className="text-slate-600">（一般细菌+嗜血杆菌）培养+鉴定+药敏</span>
                      </div>
                      <div className="text-slate-700">
                        样本评估：<span className="font-mono text-slate-900">{modalReport.specimenQuality}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs px-2 font-medium">
                      <div>
                        检测结果：<strong className="text-slate-900 text-sm">{modalReport.bacteria}</strong>
                      </div>
                      <div>
                        菌落计数：<strong className="font-mono text-slate-900">{modalReport.colonyCount}</strong>
                      </div>
                    </div>

                    {/* Antibiotic Susceptibility Table: Dual Column Layout (matching screenshot) */}
                    <div className="border-t border-b border-slate-300 py-1">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 text-xs">
                        {/* Column Left */}
                        <table className="w-full text-left">
                          <thead>
                            <tr className="border-b border-slate-200 text-slate-600">
                              <th className="py-1">抗生素名称</th>
                              <th className="py-1 text-center">方法</th>
                              <th className="py-1 text-center">结果</th>
                              <th className="py-1 text-center">敏感度</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-mono">
                            {(modalReport.sensitivities || []).slice(0, 6).map((s, idx) => (
                              <tr key={idx} className="hover:bg-slate-50">
                                <td className="py-1 font-sans text-slate-800">{s.antibiotic}</td>
                                <td className="py-1 text-center text-slate-600">{s.method}</td>
                                <td className="py-1 text-center font-bold text-slate-900">{s.result}</td>
                                <td className="py-1 text-center font-bold text-slate-900">{s.susceptibility}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>

                        {/* Column Right */}
                        <table className="w-full text-left">
                          <thead>
                            <tr className="border-b border-slate-200 text-slate-600">
                              <th className="py-1">抗生素名称</th>
                              <th className="py-1 text-center">方法</th>
                              <th className="py-1 text-center">结果</th>
                              <th className="py-1 text-center">敏感度</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-mono">
                            {(modalReport.sensitivities || []).slice(6, 12).map((s, idx) => (
                              <tr key={idx} className="hover:bg-slate-50">
                                <td className="py-1 font-sans text-slate-800">{s.antibiotic}</td>
                                <td className="py-1 text-center text-slate-600">{s.method}</td>
                                <td className="py-1 text-center font-bold text-slate-900">{s.result}</td>
                                <td className="py-1 text-center font-bold text-slate-900">{s.susceptibility}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3b. Routine Clinical Chemistry / Hematology Table (If not microbiology) */}
                {!modalReport.isMicrobiology && modalReport.routineItems && (
                  <div>
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="border-b border-slate-300 text-slate-600">
                          <th className="py-1.5 px-2">#</th>
                          <th className="py-1.5 px-2">项目名称</th>
                          <th className="py-1.5 px-2">英文代号</th>
                          <th className="py-1.5 px-2 text-right">测定结果</th>
                          <th className="py-1.5 px-2 text-center">提示</th>
                          <th className="py-1.5 px-2">参考区间</th>
                          <th className="py-1.5 px-2">单位</th>
                          <th className="py-1.5 px-2">检测方法</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-mono">
                        {modalReport.routineItems.map((r, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="py-1.5 px-2 text-slate-400">{idx + 1}</td>
                            <td className="py-1.5 px-2 font-sans font-medium text-slate-900">
                              {r.itemName}
                            </td>
                            <td className="py-1.5 px-2 text-slate-600">{r.itemEn}</td>
                            <td
                              className={`py-1.5 px-2 text-right font-bold text-sm ${
                                r.flag === 'high'
                                  ? 'text-red-600'
                                  : r.flag === 'low'
                                  ? 'text-blue-600'
                                  : 'text-slate-900'
                              }`}
                            >
                              {r.result}
                            </td>
                            <td className="py-1.5 px-2 text-center font-bold">
                              {r.flag === 'high' && <span className="text-red-600">↑</span>}
                              {r.flag === 'low' && <span className="text-blue-600">↓</span>}
                            </td>
                            <td className="py-1.5 px-2 text-slate-700">{r.refRange}</td>
                            <td className="py-1.5 px-2 text-slate-500">{r.unit}</td>
                            <td className="py-1.5 px-2 font-sans text-slate-400 text-[11px]">
                              {r.method}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* 4. Comments & Evaluation (matching screenshot: 评语: ... 注: 敏感:S, 中介:I, 耐药:R ...) */}
                <div className="text-[11px] text-slate-600 space-y-1 pt-1">
                  <div>
                    <span className="font-medium text-slate-800">评语：</span>
                    <span>{modalReport.comment || '分离菌株及检验指标已通过三级质控审核，请结合临床表现。'}</span>
                  </div>
                  <div className="text-slate-500 font-mono text-[10px]">
                    注：敏感:S, 中介:I, 耐药:R, 剂量依赖敏感:SDD; KB法单位:mm MIC法单位:ug/ml
                  </div>
                </div>

                {/* 5. Timestamps & Electronic Signatures (matching screenshot exactly!) */}
                <div className="pt-2 border-t-2 border-slate-900 text-[11px] text-slate-700 space-y-2">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono">
                    <div>
                      采样时间：<span className="text-slate-900">{modalReport.sampleTime}</span>
                    </div>
                    <div>
                      接收时间：<span className="text-slate-900">{modalReport.receiveTime}</span>
                    </div>
                    <div>
                      检验时间：<span className="text-slate-900">{modalReport.testTime}</span>
                    </div>
                    <div>
                      报告时间：<span className="text-slate-900 font-bold">{modalReport.reportTime}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between pt-1">
                    <div className="space-y-1">
                      <div>
                        声明：此报告仅对本样本负责，如有疑问请三日内与检验科联系。023-85650516
                      </div>
                      <div className="text-slate-500">
                        地址：重庆市垫江县桂溪镇北外街116号
                      </div>
                    </div>

                    {/* Signatures & Seal */}
                    <div className="flex items-center gap-4">
                      <div>
                        检验者：<strong className="text-slate-900">{modalReport.tester}</strong>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>审核者：</span>
                        {/* Calligraphic hand-written signature style */}
                        <span className="font-serif italic font-bold text-base text-slate-900 border-b border-slate-400 px-1 tracking-wider">
                          {modalReport.auditor}
                        </span>
                      </div>

                      {/* Red Inspection Stamp */}
                      {showStamp && (
                        <div className="w-16 h-16 rounded-full border-2 border-red-600/80 flex flex-col items-center justify-center text-red-600 transform -rotate-12 select-none">
                          <span className="text-[8px] font-bold">垫江县人民医院</span>
                          <span className="text-[7px] border-y border-red-600 py-0.2 scale-90">
                            检验专用章
                          </span>
                          <span className="text-[7px] font-mono">2026-10-30</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-right text-[10px] text-slate-400 font-mono">
                    第 {reportModalPage} 页 共 {modalReport.totalPages || 2} 页
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="bg-white border-t border-slate-200 px-6 py-3 flex items-center justify-between shrink-0 text-xs">
              <div className="flex items-center gap-2 text-slate-500">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>电子签名已通过 CA 认证 · 支持一键推回基层卫生中心 HIS</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    showToast(`已向【${modalReport.visitHospital}】重发检验报告回传通知`);
                    triggerAction(`回传基层HIS: ${modalReport.barcode}`);
                  }}
                  className="px-3 py-1.5 rounded border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium"
                >
                  推送基层HIS
                </button>
                <button
                  onClick={() => setModalReport(null)}
                  className="px-4 py-1.5 rounded bg-slate-800 text-white font-medium hover:bg-slate-900"
                >
                  关闭
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. BATCH PRINT MODAL */}
      {isBatchPrintModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-fadeIn text-xs">
            <div className="bg-blue-600 text-white px-5 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Printer className="w-4 h-4 text-white" />
                <span className="font-semibold text-sm">批量打印检验报告单</span>
              </div>
              <button
                onClick={() => setIsBatchPrintModalOpen(false)}
                className="text-white/80 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="p-3 bg-blue-50/70 rounded border border-blue-200 text-slate-700 space-y-1">
                <div>已勾选待打印报告数：<strong className="text-blue-700 text-sm font-mono">{selectedIds.length}</strong> 份</div>
                <div>输出打印机：<strong className="text-slate-800">{printerName}</strong></div>
                <div>打印版式：<span className="text-slate-800">{paperFormat}</span></div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">选择打印队列</label>
                <select
                  value={printerName}
                  onChange={(e) => setPrinterName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-slate-800"
                >
                  <option value="理光 Aficio MP 3352 (检验科网络打印机)">理光 Aficio MP 3352 (检验科网络打印机)</option>
                  <option value="惠普 LaserJet Pro M405dn (报告室A4)">惠普 LaserJet Pro M405dn (报告室A4)</option>
                  <option value="区域医联体虚拟 PDF 归档打印机">区域医联体虚拟 PDF 归档打印机</option>
                </select>
              </div>

              <div className="space-y-1.5 text-slate-600">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showStamp}
                    onChange={(e) => setShowStamp(e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <span>包含检验科抗伪电子红色印章</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showWatermark}
                    onChange={(e) => setShowWatermark(e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <span>加印区域检验平台底纹防伪水印</span>
                </label>
              </div>
            </div>

            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
              <button
                onClick={() => setIsBatchPrintModalOpen(false)}
                className="px-4 py-1.5 rounded border border-slate-300 text-slate-700 hover:bg-white"
              >
                取消
              </button>
              <button
                onClick={() => {
                  showToast(`成功发送 ${selectedIds.length} 份报告至打印机队列！`);
                  triggerAction(`批量打印 ${selectedIds.length} 份报告单`);
                  setIsBatchPrintModalOpen(false);
                }}
                className="px-5 py-1.5 rounded bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-2xs flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>立即发送打印</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. PRINT SETTINGS MODAL */}
      {isPrintSettingModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-fadeIn text-xs">
            <div className="bg-slate-900 text-white px-5 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-sky-400" />
                <span className="font-semibold text-sm">报告单打印环境设置</span>
              </div>
              <button
                onClick={() => setIsPrintSettingModalOpen(false)}
                className="text-white/80 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-slate-700 font-medium mb-1">页眉报告单抬头名称</label>
                <input
                  type="text"
                  value={headerTitle}
                  onChange={(e) => setHeaderTitle(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs text-slate-800 bg-white border border-slate-300 rounded focus:border-blue-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">默认纸张规格</label>
                  <select
                    value={paperFormat}
                    onChange={(e) => setPaperFormat(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-slate-800"
                  >
                    <option value="A4 纵向">标准 A4 (210×297mm) 纵向</option>
                    <option value="A5 横向">精简 A5 (148×210mm) 横向</option>
                    <option value="16开 连续进纸">16开 针式联单</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">默认打印设备</label>
                  <select
                    value={printerName}
                    onChange={(e) => setPrinterName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-slate-800"
                  >
                    <option value="理光 Aficio MP 3352 (检验科网络打印机)">理光 Aficio MP 3352</option>
                    <option value="惠普 LaserJet Pro M405dn (报告室A4)">惠普 LaserJet Pro M405dn</option>
                    <option value="区域医联体虚拟 PDF 归档打印机">虚拟 PDF 驱动</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2 border-t border-slate-200 pt-3">
                <span className="font-semibold text-slate-800 block">安全与质控项</span>
                <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                  <input
                    type="checkbox"
                    checked={showStamp}
                    onChange={(e) => setShowStamp(e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <span>嵌入电子审签章与检验专用红色印章</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                  <input
                    type="checkbox"
                    checked={showWatermark}
                    onChange={(e) => setShowWatermark(e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <span>开启区域互认电子防伪二维码校验图腾</span>
                </label>
              </div>
            </div>

            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
              <button
                onClick={() => setIsPrintSettingModalOpen(false)}
                className="px-4 py-1.5 rounded border border-slate-300 text-slate-700 hover:bg-white"
              >
                取消
              </button>
              <button
                onClick={() => {
                  showToast('打印配置已保存并应用于当前工作站');
                  setIsPrintSettingModalOpen(false);
                }}
                className="px-5 py-1.5 rounded bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-2xs"
              >
                保存设置
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
