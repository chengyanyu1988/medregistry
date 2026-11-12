import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Printer,
  Settings,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  RotateCcw,
  Send,
  FileCheck,
  FileText,
  User,
  ShieldCheck,
  RefreshCw,
  Eye,
  Check,
  Download,
  Maximize2,
  Minimize2,
  Activity,
  CalendarCheck
} from './MenuIcon';
import { UserProfile } from '../types/navigation';
import { OutpatientPrintSettingsModal } from './OutpatientPrintSettingsModal';

export interface AuditReportItem {
  id: string;
  reportNo: string;
  barcode: string;
  patientName: string;
  medicalRecordNo: string;
  uniqueId: string;
  seqNo: string;
  gender: '男' | '女';
  age: string;
  dept: string;
  bedNo: string;
  doctor: string;
  sampleType: string;
  visitType: '住院' | '门诊' | '急诊';
  instrument: string;
  testItem: string;
  requisitionNo: string;
  testUnit: string;
  status: '待审' | '已审' | '已发';
  isPrinted: boolean;
  priority: '普通' | '加急' | '危急';
  clinicalDiagnosis: string;
  remarks: string;
  sampleEvaluation?: string;
  sampleFinding?: string;
  colonyCount?: string;
  samplingTime: string;
  receiveTime: string;
  testTime: string;
  reportTime: string;
  testerName: string;
  auditorName: string;
  auditTime?: string;
  comment: string;
  hasSecondPage?: boolean;
  // Specific test results
  type: 'ast' | 'biochem' | 'coagulation' | 'immuno';
  results: Array<{
    id: number;
    code?: string;
    name: string;
    method?: string;
    result: string;
    flag?: '↑' | '↓' | '↑↑' | '↓↓';
    unit?: string;
    reference?: string;
    sensitivity?: 'S' | 'I' | 'R' | 'SDD';
    lastResult?: string;
  }>;
  secondPageResults?: Array<{
    id: number;
    name: string;
    method: string;
    result: string;
    sensitivity: 'S' | 'I' | 'R';
    micValue: string;
    referenceRange: string;
  }>;
}

const INITIAL_REPORTS: AuditReportItem[] = [
  {
    id: 'REP-001',
    reportNo: '222105090075',
    barcode: '0011812170075',
    patientName: '张太彬',
    medicalRecordNo: '22040742',
    uniqueId: '222204061139',
    seqNo: '220407008',
    gender: '男',
    age: '66岁',
    dept: '呼吸与危重症医学科一病区',
    bedNo: '60床',
    doctor: '蔡雨君',
    sampleType: '痰液',
    visitType: '住院',
    instrument: 'VITEK-2',
    testItem: '痰培养+鉴定+药敏',
    requisitionNo: '222105090075',
    testUnit: '手工检验单元',
    status: '已审',
    isPrinted: false,
    priority: '普通',
    clinicalDiagnosis: '肺栓塞, 左下肢静脉血栓形成, 原发性高血压3级 极高危',
    remarks: '发热抗生素用药前采样送检',
    sampleEvaluation: '白细胞>25个/LP, 上皮细胞<10个/LP (合格痰标本)',
    sampleFinding: '肺炎克雷伯菌 (Klebsiella pneumoniae)',
    colonyCount: '2+',
    samplingTime: '2026-10-26 14:51',
    receiveTime: '2026-10-27 08:25',
    testTime: '2026-10-27 08:48',
    reportTime: '2026-10-27 09:15',
    testerName: '吴朝菊',
    auditorName: '蔡建华',
    auditTime: '2026-10-27 09:12',
    comment: '检出菌对美罗培南、头孢哌酮/舒巴坦敏感，对一代头孢中介，复方新诺明耐药。建议临床参考药敏并结合脏器功能用药。',
    hasSecondPage: true,
    type: 'ast',
    results: [
      { id: 1, name: '阿莫西林/克拉维酸', method: 'K-B', result: '20', sensitivity: 'S' },
      { id: 2, name: '头孢唑林', method: 'K-B', result: '22', sensitivity: 'I' },
      { id: 3, name: '头孢呋辛钠(非口服)', method: 'K-B', result: '21', sensitivity: 'S' },
      { id: 4, name: '头孢呋辛(口服)', method: 'K-B', result: '21', sensitivity: 'I' },
      { id: 5, name: '头孢哌酮/舒巴坦', method: 'K-B', result: '26', sensitivity: 'S' },
      { id: 6, name: '米诺环素', method: 'K-B', result: '16', sensitivity: 'S' },
      { id: 7, name: '美罗培南', method: 'K-B', result: '26', sensitivity: 'S' },
      { id: 8, name: '头孢他啶', method: 'K-B', result: '24', sensitivity: 'S' },
      { id: 9, name: '左氧氟沙星', method: 'K-B', result: '25', sensitivity: 'S' },
      { id: 10, name: '阿米卡星', method: 'K-B', result: '23', sensitivity: 'S' },
      { id: 11, name: '哌拉西林/他唑巴坦', method: 'K-B', result: '25', sensitivity: 'S' },
      { id: 12, name: '复方新诺明', method: 'K-B', result: '10', sensitivity: 'R' }
    ],
    secondPageResults: [
      { id: 101, name: '亚胺培南 (Imipenem)', method: 'MIC定量', result: '≤1.0', sensitivity: 'S', micValue: '≤1.0 μg/mL', referenceRange: '≤1.0 敏感' },
      { id: 102, name: '厄他培南 (Ertapenem)', method: 'MIC定量', result: '≤0.5', sensitivity: 'S', micValue: '≤0.5 μg/mL', referenceRange: '≤0.5 敏感' },
      { id: 103, name: '替加环素 (Tigecycline)', method: 'MIC定量', result: '1.0', sensitivity: 'S', micValue: '1.0 μg/mL', referenceRange: '≤2.0 敏感' },
      { id: 104, name: '多粘菌素E (Colistin)', method: '肉汤稀释', result: '≤0.5', sensitivity: 'S', micValue: '≤0.5 μg/mL', referenceRange: '≤2.0 敏感' },
      { id: 105, name: '头孢曲松 (Ceftriaxone)', method: 'MIC定量', result: '16.0', sensitivity: 'R', micValue: '16.0 μg/mL', referenceRange: '≤1.0 敏感' },
      { id: 106, name: '环丙沙星 (Ciprofloxacin)', method: 'MIC定量', result: '0.25', sensitivity: 'S', micValue: '0.25 μg/mL', referenceRange: '≤0.25 敏感' }
    ]
  },
  {
    id: 'REP-002',
    reportNo: '222105090042',
    barcode: '0011812170042',
    patientName: '周振海',
    medicalRecordNo: '21050049',
    uniqueId: '222204061140',
    seqNo: '220407009',
    gender: '男',
    age: '58岁',
    dept: '心血管内科二病区',
    bedNo: '34床',
    doctor: '王浩然',
    sampleType: '血浆',
    visitType: '住院',
    instrument: 'Sysmex CS-5100',
    testItem: '凝血功能五项',
    requisitionNo: '222105090042',
    testUnit: '血凝检验单元',
    status: '待审',
    isPrinted: false,
    priority: '普通',
    clinicalDiagnosis: '冠状动脉粥样硬化性心脏病, 心房颤动, 华法林抗凝治疗随访',
    remarks: '评估抗凝指标与INR达标情况',
    samplingTime: '2026-10-27 07:40',
    receiveTime: '2026-10-27 08:15',
    testTime: '2026-10-27 08:35',
    reportTime: '2026-10-27 08:50',
    testerName: '李海燕',
    auditorName: '蔡建华',
    comment: 'PT及INR轻度延长，处于口服抗凝治疗安全治疗窗区间(目标INR 2.0-3.0之间)。请临床结合临床出血指征监控。',
    hasSecondPage: false,
    type: 'coagulation',
    results: [
      { id: 1, code: 'PT', name: '凝血酶原时间', method: '凝固法', result: '14.8', flag: '↑', unit: '秒', reference: '9.0 - 14.0', lastResult: '13.1' },
      { id: 2, code: 'PT-INR', name: '国际标准化比值', method: '计算法', result: '1.35', flag: '↑', unit: '-', reference: '0.76 - 1.16', lastResult: '1.02' },
      { id: 3, code: 'APTT', name: '活化部分凝血活酶时间', method: '凝固法', result: '31.5', unit: '秒', reference: '20.5 - 32.7', lastResult: '29.8' },
      { id: 4, code: 'TT', name: '凝血酶时间', method: '凝固法', result: '16.8', unit: '秒', reference: '14.0 - 21.0', lastResult: '17.2' },
      { id: 5, code: 'FIB', name: '纤维蛋白原定量', method: 'Clauss法', result: '3.42', unit: 'g/L', reference: '2.00 - 4.00', lastResult: '3.60' },
      { id: 6, code: 'D-Dimer', name: 'D-二聚体定量', method: '免疫比浊法', result: '0.42', unit: 'mg/L FEU', reference: '0.00 - 0.55', lastResult: '0.38' }
    ]
  },
  {
    id: 'REP-003',
    reportNo: '222105090341',
    barcode: '0011812170341',
    patientName: '陆美兰',
    medicalRecordNo: '21050050',
    uniqueId: '222204061141',
    seqNo: '220407010',
    gender: '女',
    age: '52岁',
    dept: '消化内科一病区',
    bedNo: '18床',
    doctor: '李先义',
    sampleType: '血清',
    visitType: '住院',
    instrument: 'Roche Cobas 8000',
    testItem: '肝脏功能全套(十一项)',
    requisitionNo: '222105090341',
    testUnit: '生化流水线单元',
    status: '待审',
    isPrinted: false,
    priority: '普通',
    clinicalDiagnosis: '慢性病毒性肝炎活动期, 肝酶升高查因',
    remarks: '生化流水线双向自动初审拦截(转氨酶超标)',
    samplingTime: '2026-10-27 07:15',
    receiveTime: '2026-10-27 08:00',
    testTime: '2026-10-27 08:24',
    reportTime: '2026-10-27 08:45',
    testerName: '吴朝菊',
    auditorName: '蔡建华',
    comment: '转氨酶ALT与AST轻中度升高，伴轻度高胆红素血症，提示肝实质细胞受损。请结合病毒载量及腹部超声进一步评估。',
    hasSecondPage: false,
    type: 'biochem',
    results: [
      { id: 1, code: 'ALT', name: '丙氨酸氨基转移酶', method: 'IFCC速率法', result: '88.4', flag: '↑', unit: 'U/L', reference: '9.0 - 50.0', lastResult: '52.0' },
      { id: 2, code: 'AST', name: '天门冬氨酸氨基转移酶', method: 'IFCC速率法', result: '72.1', flag: '↑', unit: 'U/L', reference: '15.0 - 40.0', lastResult: '44.0' },
      { id: 3, code: 'AST/ALT', name: '谷草/谷丙比值', method: '计算法', result: '0.82', unit: '-', reference: '0.80 - 1.50', lastResult: '0.85' },
      { id: 4, code: 'TBIL', name: '总胆红素', method: '重氮盐比色法', result: '24.6', flag: '↑', unit: 'μmol/L', reference: '3.4 - 20.5', lastResult: '18.2' },
      { id: 5, code: 'DBIL', name: '直接胆红素', method: '重氮比色法', result: '8.9', flag: '↑', unit: 'μmol/L', reference: '0.0 - 6.8', lastResult: '5.4' },
      { id: 6, code: 'IBIL', name: '间接胆红素', method: '计算法', result: '15.7', unit: 'μmol/L', reference: '1.7 - 17.0', lastResult: '12.8' },
      { id: 7, code: 'TP', name: '总蛋白', method: '双缩脲法', result: '72.5', unit: 'g/L', reference: '65.0 - 85.0', lastResult: '74.0' },
      { id: 8, code: 'ALB', name: '白蛋白', method: '溴甲酚绿法', result: '38.2', flag: '↓', unit: 'g/L', reference: '40.0 - 55.0', lastResult: '41.0' },
      { id: 9, code: 'GLO', name: '球蛋白', method: '计算法', result: '34.3', unit: 'g/L', reference: '20.0 - 35.0', lastResult: '33.0' },
      { id: 10, code: 'A/G', name: '白球比', method: '计算法', result: '1.11', flag: '↓', unit: '-', reference: '1.20 - 2.40', lastResult: '1.24' },
      { id: 11, code: 'GGT', name: 'γ-谷氨酰转移酶', method: '连续监测法', result: '92.0', flag: '↑', unit: 'U/L', reference: '10.0 - 60.0', lastResult: '58.0' }
    ]
  },
  {
    id: 'REP-004',
    reportNo: '222105100024',
    barcode: '0011812170024',
    patientName: '孙立伟',
    medicalRecordNo: '21050051',
    uniqueId: '222204061142',
    seqNo: '220407011',
    gender: '男',
    age: '45岁',
    dept: '感染性疾病科',
    bedNo: '12床',
    doctor: '郑志宏',
    sampleType: '血清',
    visitType: '住院',
    instrument: 'Abbott Alinity i',
    testItem: '乙肝两对半定量',
    requisitionNo: '222105100024',
    testUnit: '免疫发光单元',
    status: '已发',
    isPrinted: true,
    priority: '普通',
    clinicalDiagnosis: '乙型病毒性肝炎携带者随访',
    remarks: '化学发光微粒子免疫分析 (CMIA)',
    samplingTime: '2026-10-26 16:20',
    receiveTime: '2026-10-27 08:05',
    testTime: '2026-10-27 08:30',
    reportTime: '2026-10-27 08:55',
    testerName: '吴朝菊',
    auditorName: '蔡建华',
    auditTime: '2026-10-27 08:52',
    comment: 'HBsAg阳性、HBeAb阳性、HBcAb阳性，符合典型慢性乙型病毒性肝炎“小三阳”抗原抗体谱表达模式。',
    hasSecondPage: false,
    type: 'immuno',
    results: [
      { id: 1, code: 'HBsAg', name: '乙型肝炎表面抗原', method: 'CMIA化学发光', result: '>250.00', flag: '↑', unit: 'IU/mL', reference: '< 0.05 (阴性)', lastResult: '>250.00' },
      { id: 2, code: 'HBsAb', name: '乙型肝炎表面抗体', method: 'CMIA化学发光', result: '1.25', unit: 'mIU/mL', reference: '0.00 - 10.00 (阴性)', lastResult: '1.10' },
      { id: 3, code: 'HBeAg', name: '乙型肝炎e抗原', method: 'CMIA化学发光', result: '0.15', unit: 'S/CO', reference: '< 1.00 (阴性)', lastResult: '0.18' },
      { id: 4, code: 'HBeAb', name: '乙型肝炎e抗体', method: 'CMIA化学发光', result: '0.02', flag: '↑', unit: 'S/CO', reference: '> 1.00 (阴性)', lastResult: '0.03' },
      { id: 5, code: 'HBcAb', name: '乙型肝炎核心抗体', method: 'CMIA化学发光', result: '0.01', flag: '↑', unit: 'S/CO', reference: '> 1.00 (阴性)', lastResult: '0.01' }
    ]
  },
  {
    id: 'REP-005',
    reportNo: '222105100068',
    barcode: '0011812170068',
    patientName: '陈志明',
    medicalRecordNo: '21050052',
    uniqueId: '222204061143',
    seqNo: '220407012',
    gender: '男',
    age: '71岁',
    dept: '神经内科重症病区',
    bedNo: '08床',
    doctor: '孙德明',
    sampleType: '血清',
    visitType: '住院',
    instrument: 'Roche Cobas 8000',
    testItem: '肾功能全套+急诊电解质',
    requisitionNo: '222105100068',
    testUnit: '生化流水线单元',
    status: '待审',
    isPrinted: false,
    priority: '普通',
    clinicalDiagnosis: '急性脑梗死, 原发性高血压, 慢性肾脏病3期',
    remarks: '造影剂使用前急查评估',
    samplingTime: '2026-10-27 08:00',
    receiveTime: '2026-10-27 08:20',
    testTime: '2026-10-27 08:42',
    reportTime: '2026-10-27 09:05',
    testerName: '李海燕',
    auditorName: '蔡建华',
    comment: '血肌酐及尿素氮偏高，估算eGFR 46 ml/min/1.73m²，提示肾功能中度减退。若行增强CT造影需做好水化准备。',
    hasSecondPage: false,
    type: 'biochem',
    results: [
      { id: 1, code: 'CREA', name: '肌酐 (酶法)', method: '酶法', result: '136.0', flag: '↑', unit: 'μmol/L', reference: '53.0 - 106.0', lastResult: '128.0' },
      { id: 2, code: 'UREA', name: '尿素氮', method: '脲酶-谷氨酸脱氢酶法', result: '10.20', flag: '↑', unit: 'mmol/L', reference: '2.80 - 7.20', lastResult: '9.40' },
      { id: 3, code: 'UA', name: '尿酸', method: '尿酸酶比色法', result: '492.0', flag: '↑', unit: 'μmol/L', reference: '208.0 - 428.0', lastResult: '460.0' },
      { id: 4, code: 'K+', name: '血清钾', method: '离子选择电极法', result: '4.42', unit: 'mmol/L', reference: '3.50 - 5.30', lastResult: '4.30' },
      { id: 5, code: 'Na+', name: '血清钠', method: '离子选择电极法', result: '142.1', unit: 'mmol/L', reference: '136.0 - 145.0', lastResult: '141.0' },
      { id: 6, code: 'Cl-', name: '血清氯', method: '离子选择电极法', result: '103.5', unit: 'mmol/L', reference: '96.0 - 108.0', lastResult: '102.0' },
      { id: 7, code: 'CO2', name: '二氧化碳结合力', method: '酶法', result: '24.2', unit: 'mmol/L', reference: '22.0 - 29.0', lastResult: '23.8' }
    ]
  },
  {
    id: 'REP-006',
    reportNo: '222105100095',
    barcode: '0011812170095',
    patientName: '林素华',
    medicalRecordNo: '21050053',
    uniqueId: '222204061144',
    seqNo: '220407013',
    gender: '女',
    age: '34岁',
    dept: '产科VIP病区',
    bedNo: '05床',
    doctor: '蔡雨君',
    sampleType: '血清',
    visitType: '住院',
    instrument: 'Roche Cobas e801',
    testItem: '孕产妇传染病四项筛查',
    requisitionNo: '222105100095',
    testUnit: '免疫发光单元',
    status: '已发',
    isPrinted: true,
    priority: '普通',
    clinicalDiagnosis: '孕38+2周 宫内妊娠单活胎待产',
    remarks: '剖宫产分娩前常规母婴阻断筛查',
    samplingTime: '2026-10-26 15:10',
    receiveTime: '2026-10-27 07:50',
    testTime: '2026-10-27 08:15',
    reportTime: '2026-10-27 08:35',
    testerName: '吴朝菊',
    auditorName: '蔡建华',
    auditTime: '2026-10-27 08:32',
    comment: '四项感染性病原体筛查均呈阴性反应，未见母婴垂直感染指征。',
    hasSecondPage: false,
    type: 'immuno',
    results: [
      { id: 1, code: 'HIV-Ag/Ab', name: '人免疫缺陷病毒抗原抗体', method: 'ECLIA电化学发光', result: '0.12', unit: 'S/CO', reference: '< 1.00 (阴性)' },
      { id: 2, code: 'TP-Ab', name: '梅毒螺旋体特异性抗体', method: 'ECLIA电化学发光', result: '0.08', unit: 'S/CO', reference: '< 1.00 (阴性)' },
      { id: 3, code: 'HCV-Ab', name: '丙型肝炎病毒抗体', method: 'ECLIA电化学发光', result: '0.16', unit: 'S/CO', reference: '< 1.00 (阴性)' },
      { id: 4, code: 'HBsAg', name: '乙型肝炎表面抗原', method: 'ECLIA电化学发光', result: '0.02', unit: 'IU/mL', reference: '< 0.05 (阴性)' }
    ]
  }
];

interface ClinicalReportAuditViewProps {
  user: UserProfile;
  triggerAction: (msg: string) => void;
}

export const ClinicalReportAuditView: React.FC<ClinicalReportAuditViewProps> = ({
  user,
  triggerAction
}) => {
  const [reports, setReports] = useState<AuditReportItem[]>(INITIAL_REPORTS);
  const [selectedReportId, setSelectedReportId] = useState<string>('REP-001');
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>(['REP-001']);
  
  // Filters
  const [selectedUnit, setSelectedUnit] = useState<string>('全部');
  const [selectedStatus, setSelectedStatus] = useState<string>('全部');
  const [testDate, setTestDate] = useState<string>('2026-10-27');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  
  // Page indicator for current report
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);

  // Active Report
  const activeReport = useMemo(() => {
    return reports.find((r) => r.id === selectedReportId) || reports[0];
  }, [reports, selectedReportId]);

  // Filtered reports
  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      if (selectedUnit !== '全部' && !r.testUnit.includes(selectedUnit) && selectedUnit !== '手工' && r.testUnit !== selectedUnit) {
        if (selectedUnit === '手工' && !r.testUnit.includes('手工')) return false;
      }
      if (selectedStatus !== '全部' && r.status !== selectedStatus) {
        return false;
      }
      if (searchKeyword.trim()) {
        const kw = searchKeyword.trim().toLowerCase();
        const matchName = r.patientName.toLowerCase().includes(kw);
        const matchNo = r.medicalRecordNo.toLowerCase().includes(kw);
        const matchBarcode = r.barcode.toLowerCase().includes(kw);
        const matchReq = r.requisitionNo.toLowerCase().includes(kw);
        const matchItem = r.testItem.toLowerCase().includes(kw);
        if (!matchName && !matchNo && !matchBarcode && !matchReq && !matchItem) {
          return false;
        }
      }
      return true;
    });
  }, [reports, selectedUnit, selectedStatus, searchKeyword]);

  const currentReportIndex = useMemo(() => {
    return filteredReports.findIndex((r) => r.id === activeReport.id);
  }, [filteredReports, activeReport.id]);

  const handlePrevReport = () => {
    if (filteredReports.length === 0) return;
    const nextIdx = (currentReportIndex - 1 + filteredReports.length) % filteredReports.length;
    setSelectedReportId(filteredReports[nextIdx].id);
    setCurrentPage(1);
  };

  const handleNextReport = () => {
    if (filteredReports.length === 0) return;
    const nextIdx = (currentReportIndex + 1) % filteredReports.length;
    setSelectedReportId(filteredReports[nextIdx].id);
    setCurrentPage(1);
  };

  // Handle row selection
  const handleToggleRowSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedRowIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRowIds(filteredReports.map((r) => r.id));
    } else {
      setSelectedRowIds([]);
    }
  };

  const isAllSelected =
    filteredReports.length > 0 && selectedRowIds.length === filteredReports.length;

  // Audit Action (审核)
  const handleAuditSelected = () => {
    if (selectedRowIds.length === 0) {
      triggerAction('请先在左侧勾选需要审核的报告条目！');
      return;
    }
    const count = selectedRowIds.length;
    setReports((prev) =>
      prev.map((r) => {
        if (selectedRowIds.includes(r.id)) {
          return {
            ...r,
            status: '已审',
            auditorName: user.name || '蔡建华',
            auditTime: '2026-10-27 09:20'
          };
        }
        return r;
      })
    );
    triggerAction(`成功审核 ${count} 份临床检验报告单，已通过质量复核！`);
  };

  // Publish Action (发布)
  const handlePublishSelected = () => {
    if (selectedRowIds.length === 0) {
      triggerAction('请先在左侧勾选需要发布的报告！');
      return;
    }
    const count = selectedRowIds.length;
    setReports((prev) =>
      prev.map((r) => {
        if (selectedRowIds.includes(r.id)) {
          return {
            ...r,
            status: '已发',
            isPrinted: true,
            reportTime: '2026-10-27 09:25'
          };
        }
        return r;
      })
    );
    triggerAction(`已批量发布 ${count} 份报告，已实时同步至临床HIS及自助打印终端！`);
  };

  // Revoke Action (反审)
  const handleRevokeSelected = () => {
    if (selectedRowIds.length === 0) {
      triggerAction('请先勾选需要撤销审核的报告！');
      return;
    }
    const count = selectedRowIds.length;
    setReports((prev) =>
      prev.map((r) => {
        if (selectedRowIds.includes(r.id)) {
          return {
            ...r,
            status: '待审',
            auditTime: undefined
          };
        }
        return r;
      })
    );
    triggerAction(`已撤销 ${count} 份报告审核，状态已重置为待审！`);
  };

  // Print Action (打印)
  const handlePrintCurrent = () => {
    triggerAction(`正在调取激光报告打印机，出具患者 [${activeReport.patientName}] 的A4检验报告单...`);
    setReports((prev) =>
      prev.map((r) => (r.id === activeReport.id ? { ...r, isPrinted: true } : r))
    );
  };

  return (
    <div className={`flex-1 flex flex-col h-full min-h-0 bg-slate-100 ${isFullscreen ? 'fixed inset-0 z-50 p-2' : ''}`}>
      {/* 顶部现代化多维度检索与审签操作工具条 */}
      <div className="bg-white border-b border-slate-200/90 px-4 py-2.5 shrink-0 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* 左侧：筛选过滤群组 */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            {/* 检验单元 */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-600 font-medium">检验单元:</span>
              <select
                value={selectedUnit}
                onChange={(e) => setSelectedUnit(e.target.value)}
                className="h-8 px-2.5 bg-slate-50 border border-slate-300 rounded text-slate-800 text-xs focus:ring-1 focus:ring-sky-500 focus:bg-white transition-colors"
              >
                <option value="全部">全部单元</option>
                <option value="手工">手工检验单元</option>
                <option value="生化流水线单元">生化流水线(Cobas 8000)</option>
                <option value="免疫发光单元">免疫发光(Alinity i)</option>
                <option value="血凝检验单元">血凝工作站(CS-5100)</option>
              </select>
            </div>

            {/* 审核状态 */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-600 font-medium">状态:</span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="h-8 px-2.5 bg-slate-50 border border-slate-300 rounded text-slate-800 text-xs focus:ring-1 focus:ring-sky-500 focus:bg-white transition-colors"
              >
                <option value="全部">全部状态</option>
                <option value="待审">待审 (待医师复核)</option>
                <option value="已审">已审 (已通过初审)</option>
                <option value="已发">已发 (已发布)</option>
              </select>
            </div>

            {/* 检验时间 */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-600 font-medium">检验时间:</span>
              <div className="relative flex items-center">
                <input
                  type="date"
                  value={testDate}
                  onChange={(e) => setTestDate(e.target.value)}
                  className="h-8 px-2.5 bg-slate-50 border border-slate-300 rounded text-slate-800 font-mono text-xs focus:ring-1 focus:ring-sky-500 focus:bg-white"
                />
              </div>
            </div>

            {/* 快捷查询条 */}
            <div className="flex items-center gap-1.5">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="姓名 / 病历号 / 条码号"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="h-8 pl-8 pr-3 w-40 bg-slate-50 border border-slate-300 rounded text-xs text-slate-800 placeholder-slate-400 focus:w-48 focus:bg-white focus:ring-1 focus:ring-sky-500 transition-all"
                />
              </div>
              <button
                type="button"
                onClick={() => triggerAction('已按照当前条件完成报告检索')}
                className="h-8 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded text-xs flex items-center gap-1 transition-colors"
              >
                <span>查询</span>
              </button>
            </div>
          </div>

          {/* 右侧：核心审发动作群组 */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAuditSelected}
              className="h-8 px-4 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded text-xs flex items-center gap-1.5 shadow-2xs transition-all active:scale-95"
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>审核</span>
              {selectedRowIds.length > 0 && (
                <span className="px-1.5 py-0.2 rounded bg-sky-700/80 text-[10px] font-mono">
                  {selectedRowIds.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={handlePublishSelected}
              className="h-8 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded text-xs flex items-center gap-1.5 shadow-2xs transition-all active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              <span>发布</span>
            </button>

            <button
              type="button"
              onClick={handleRevokeSelected}
              className="h-8 px-3 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded text-xs flex items-center gap-1 transition-colors"
              title="撤销审核状态"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>反审</span>
            </button>

            <button
              type="button"
              onClick={handlePrintCurrent}
              className="h-8 px-3 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded text-xs flex items-center gap-1 transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>打印</span>
            </button>

            <button
              type="button"
              onClick={() => setIsPrintModalOpen(true)}
              className="h-8 px-2.5 border border-slate-300 hover:bg-slate-100 text-slate-600 rounded text-xs flex items-center gap-1 transition-colors"
              title="打印机与格式设置"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>打印设置</span>
            </button>

            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="h-8 w-8 border border-slate-300 hover:bg-slate-100 text-slate-600 rounded flex items-center justify-center transition-colors"
              title={isFullscreen ? '退出全屏' : '全屏审阅'}
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* 2. 主体工作区：全宽待审发报告排队大表 */}
      <div className="flex-1 min-h-0 p-3 overflow-hidden flex flex-col">
        <div className="flex-1 flex flex-col h-full min-h-0 bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
          {/* 列表表头状态指示与统计 */}
          <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-3">
              <span className="font-bold text-slate-800 text-xs">报告审核与发布 - 检验报告清单</span>
              <span className="px-2 py-0.5 rounded-full text-[11px] bg-slate-200/80 text-slate-700 font-mono">
                共 {filteredReports.length} 份报告
              </span>
              <span className="text-slate-400">·</span>
              <span className="text-xs text-slate-500">
                待审: <strong className="text-amber-600 font-mono">{reports.filter((r) => r.status === '待审').length}</strong> 份
              </span>
              <span className="text-slate-400">·</span>
              <span className="text-xs text-slate-500">
                已审: <strong className="text-sky-600 font-mono">{reports.filter((r) => r.status === '已审').length}</strong> 份
              </span>
              <span className="text-slate-400">·</span>
              <span className="text-xs text-slate-500">
                已发布: <strong className="text-emerald-600 font-mono">{reports.filter((r) => r.status === '已发').length}</strong> 份
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="text-slate-500 font-normal">
                已勾选: <strong className="font-mono text-sky-600">{selectedRowIds.length}</strong> 份
              </span>
              <span className="text-slate-300">|</span>
              <span className="text-slate-500 text-[11px]">点击行或“查看/审签报告”按钮弹窗预览A4正规电子检验报告单</span>
            </div>
          </div>

          {/* 表格容器 */}
          <div className="flex-1 min-h-0 overflow-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-100/90 text-slate-600 font-medium sticky top-0 z-10 border-b border-slate-200 text-[11px]">
                <tr>
                  <th className="w-10 px-3 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="w-3.5 h-3.5 rounded text-sky-600 cursor-pointer"
                    />
                  </th>
                  <th className="w-12 px-2 py-2 text-center">打印</th>
                  <th className="w-16 px-2.5 py-2">状态</th>
                  <th className="w-16 px-2.5 py-2 text-center">优先级</th>
                  <th className="w-20 px-3 py-2">患者姓名</th>
                  <th className="w-20 px-2 py-2">性别/年龄</th>
                  <th className="w-24 px-2.5 py-2">病历号</th>
                  <th className="w-24 px-2.5 py-2">就诊类型</th>
                  <th className="w-28 px-3 py-2">申请科室</th>
                  <th className="w-16 px-2 py-2 text-center">床号</th>
                  <th className="w-24 px-2.5 py-2">标本类型</th>
                  <th className="px-3 py-2">检验项目</th>
                  <th className="w-28 px-2.5 py-2">申请单号</th>
                  <th className="w-24 px-2.5 py-2">申请医生</th>
                  <th className="w-32 px-2.5 py-2">送检时间</th>
                  <th className="w-28 px-3 py-2 text-center">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans text-xs">
                {filteredReports.map((report) => {
                  const isCurrent = report.id === activeReport.id;
                  const isChecked = selectedRowIds.includes(report.id);

                  return (
                    <tr
                      key={report.id}
                      onClick={() => {
                        setSelectedReportId(report.id);
                        setCurrentPage(1);
                        setShowReportModal(true);
                      }}
                      className={`cursor-pointer transition-colors ${
                        isCurrent
                          ? 'bg-sky-50/90 font-medium text-slate-900 ring-1 ring-inset ring-sky-300'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="px-3 py-2.5 text-center" onClick={(e) => handleToggleRowSelect(report.id, e)}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="w-3.5 h-3.5 rounded text-sky-600 cursor-pointer"
                        />
                      </td>

                      {/* 打印标记 */}
                      <td className="px-2 py-2.5 text-center">
                        {report.isPrinted ? (
                          <span className="inline-flex items-center justify-center text-sky-600 font-bold" title="已打印">
                            <Check className="w-4 h-4 stroke-[2.5]" />
                          </span>
                        ) : (
                          <span className="text-slate-300 font-mono text-[11px]">-</span>
                        )}
                      </td>

                      {/* 状态徽章 */}
                      <td className="px-2.5 py-2.5">
                        {report.status === '待审' && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] bg-amber-50 text-amber-700 border border-amber-200 font-medium">
                            待审
                          </span>
                        )}
                        {report.status === '已审' && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] bg-sky-50 text-sky-700 border border-sky-200 font-medium">
                            已审
                          </span>
                        )}
                        {report.status === '已发' && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                            已发
                          </span>
                        )}
                      </td>

                      {/* 优先级 */}
                      <td className="px-2.5 py-2.5 text-center">
                        {report.priority === '危急' && (
                          <span className="inline-block px-1.5 py-0.5 bg-rose-500 text-white rounded font-bold text-[10px] animate-pulse">
                            危急
                          </span>
                        )}
                        {report.priority === '加急' && (
                          <span className="inline-block px-1.5 py-0.5 bg-amber-500 text-white rounded font-bold text-[10px]">
                            急诊
                          </span>
                        )}
                        {report.priority === '普通' && (
                          <span className="text-slate-400 text-[11px]">普通</span>
                        )}
                      </td>

                      {/* 真实姓名 */}
                      <td className="px-3 py-2.5 font-bold text-slate-900 whitespace-nowrap">
                        {report.patientName}
                      </td>

                      {/* 性别/年龄 */}
                      <td className="px-2 py-2.5 text-slate-600 whitespace-nowrap">
                        {report.gender} · {report.age}
                      </td>

                      {/* 病历号 */}
                      <td className="px-2.5 py-2.5 font-mono text-slate-600 text-[11px]">
                        {report.medicalRecordNo}
                      </td>

                      {/* 就诊类型 */}
                      <td className="px-2.5 py-2.5">
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-700 border border-slate-200">
                          {report.visitType}
                        </span>
                      </td>

                      {/* 申请科室 */}
                      <td className="px-3 py-2.5 text-slate-700 font-medium">
                        {report.dept}
                      </td>

                      {/* 床号 */}
                      <td className="px-2 py-2.5 text-center font-mono text-slate-600 whitespace-nowrap">
                        {report.bedNo || '-'}
                      </td>

                      {/* 标本类型 */}
                      <td className="px-2.5 py-2.5 text-slate-600">
                        {report.sampleType}
                      </td>

                      {/* 检验项目 */}
                      <td className="px-3 py-2.5 font-medium text-slate-900 truncate max-w-[200px]" title={report.testItem}>
                        {report.testItem}
                      </td>

                      {/* 申请单号 */}
                      <td className="px-2.5 py-2.5 font-mono text-slate-500 text-[11px]">
                        {report.requisitionNo}
                      </td>

                      {/* 申请医生 */}
                      <td className="px-2.5 py-2.5 text-slate-600">
                        {report.doctor}
                      </td>

                      {/* 送检时间 */}
                      <td className="px-2.5 py-2.5 font-mono text-slate-500 text-[11px]">
                        {report.testTime}
                      </td>

                      {/* 操作列 */}
                      <td className="px-3 py-2.5 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => {
                            setSelectedReportId(report.id);
                            setCurrentPage(1);
                            setShowReportModal(true);
                          }}
                          className="px-2.5 py-1 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 rounded font-medium text-xs flex items-center gap-1 mx-auto transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>查看/审签报告</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* 列表底栏 */}
          <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0 font-mono">
            <div className="flex items-center gap-3">
              <span>合计: {filteredReports.length} 份报告</span>
              <span className="text-slate-300">|</span>
              <span className="text-slate-500 font-sans">双击或点击行即可弹窗展开清晰A4报告全页及药敏明细</span>
            </div>
            <div className="flex items-center gap-2">
              <span>当前选定: <strong className="text-slate-800">{activeReport.patientName}</strong></span>
              <span className="text-slate-300">|</span>
              <span>单号: <strong className="text-sky-700">{activeReport.reportNo}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* ================= 3. 电子检验报告单 A4 纸张排版预览与审签弹窗 (Modal) ================= */}
      {showReportModal && activeReport && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-300 w-full max-w-[96vw] xl:max-w-6xl h-[94vh] flex flex-col overflow-hidden animate-scaleUp">
            {/* Modal Header */}
            <div className="px-5 py-3 bg-gradient-to-r from-slate-900 via-slate-800 to-sky-950 text-white flex items-center justify-between shrink-0 shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-sky-600/80 flex items-center justify-center text-white shadow-xs">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base text-white tracking-wide">
                      重庆市垫江县人民医院 - 检验报告单审签
                    </span>
                    <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-sky-500/30 text-sky-200 border border-sky-400/40">
                      报告单号: {activeReport.reportNo}
                    </span>
                    <span className="font-bold text-slate-100 text-sm">
                      {activeReport.patientName} ({activeReport.gender} · {activeReport.age})
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                      activeReport.status === '待审'
                        ? 'bg-amber-500/30 text-amber-200 border border-amber-400/40'
                        : activeReport.status === '已审'
                        ? 'bg-sky-500/30 text-sky-200 border border-sky-400/40'
                        : 'bg-emerald-500/30 text-emerald-200 border border-emerald-400/40'
                    }`}>
                      {activeReport.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-300 font-mono mt-0.5">
                    <span>病历号: {activeReport.medicalRecordNo}</span>
                    <span>·</span>
                    <span>科室: {activeReport.dept} {activeReport.bedNo ? `(${activeReport.bedNo}床)` : ''}</span>
                    <span>·</span>
                    <span>项目: {activeReport.testItem}</span>
                  </div>
                </div>
              </div>

              {/* Prev / Next Pagination & Close */}
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-slate-800/80 rounded-lg p-0.5 border border-slate-700 text-xs">
                  <button
                    onClick={handlePrevReport}
                    className="px-2.5 py-1 hover:bg-slate-700 text-slate-200 rounded flex items-center gap-1 transition-colors"
                    title="快捷查看上一份报告"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>上一份</span>
                  </button>
                  <span className="px-2 font-mono text-[11px] text-slate-400 border-x border-slate-700">
                    {currentReportIndex + 1} / {filteredReports.length}
                  </span>
                  <button
                    onClick={handleNextReport}
                    className="px-2.5 py-1 hover:bg-slate-700 text-slate-200 rounded flex items-center gap-1 transition-colors"
                    title="快捷查看下一份报告"
                  >
                    <span>下一份</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={() => setShowReportModal(false)}
                  className="w-8 h-8 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white flex items-center justify-center transition-colors text-lg"
                  title="关闭弹窗 (Esc)"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Quick Actions Bar */}
            <div className="px-4 py-2 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => {
                    handleAuditSelected();
                  }}
                  className="h-8 px-3.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>复核审核通过</span>
                </button>
                <button
                  type="button"
                  onClick={handlePublishSelected}
                  className="h-8 px-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>正式发布报告</span>
                </button>
                <button
                  type="button"
                  onClick={handleRevokeSelected}
                  className="h-8 px-3 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                  <span>撤销审核 (反审)</span>
                </button>
                <button
                  type="button"
                  onClick={handlePrintCurrent}
                  className="h-8 px-3 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-600" />
                  <span>激光打印 A4</span>
                </button>
              </div>

              {/* Page 1 / Page 2 toggle */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-mono">
                  {activeReport.hasSecondPage ? `第 ${currentPage} 页 / 共 2 页` : '第 1 页 / 共 1 页'}
                </span>
                {activeReport.hasSecondPage && (
                  <div className="flex items-center border border-slate-300 bg-white rounded-lg shadow-2xs overflow-hidden text-xs">
                    <button
                      type="button"
                      disabled={currentPage <= 1}
                      onClick={() => setCurrentPage(1)}
                      className={`h-7 px-2.5 flex items-center gap-1 transition-colors ${
                        currentPage === 1 ? 'bg-sky-50 text-sky-700 font-bold' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      第 1 页
                    </button>
                    <button
                      type="button"
                      disabled={currentPage >= 2}
                      onClick={() => setCurrentPage(2)}
                      className={`h-7 px-2.5 flex items-center gap-1 border-l border-slate-200 transition-colors ${
                        currentPage === 2 ? 'bg-sky-50 text-sky-700 font-bold' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      第 2 页 (药敏明细)
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Body: A4 Paper Sheet Preview (Scrollable) */}
            <div className="flex-1 min-h-0 bg-slate-200/80 p-3 sm:p-5 overflow-auto flex justify-center">
              {/* A4 打印单纸张本体 (白底、双线装订风格、等比例高保真) */}
              <div className="w-full max-w-4xl bg-white rounded shadow-lg border border-slate-300 p-6 sm:p-8 overflow-y-auto font-sans text-slate-900 select-text flex flex-col justify-between">
            <div>
              {/* 医院正式页眉 Letterhead */}
              <div className="text-center pb-3 border-b-2 border-slate-800 relative">
                {/* 医院徽标与标题 */}
                <div className="flex items-center justify-center gap-3">
                  <div className="w-9 h-9 rounded-full border-2 border-emerald-600 bg-emerald-50 flex items-center justify-center text-emerald-700 font-bold text-xs shrink-0">
                    <Activity className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-wide font-serif">
                      重庆市垫江县人民医院检验报告单
                    </h1>
                    <div className="text-[11px] text-slate-500 tracking-widest mt-0.5">
                      CLINICAL LABORATORY EXAMINATION REPORT · 检验医学科
                    </div>
                  </div>
                </div>

                {/* 副标题 (检验项目大类) */}
                <div className="mt-2 text-xs font-bold text-slate-800">
                  {activeReport.type === 'ast' && '（一般细菌+嗜血杆菌）培养+鉴定+药敏试验报告'}
                  {activeReport.type === 'coagulation' && '（凝血机制与血栓止血）常规检验报告单'}
                  {activeReport.type === 'biochem' && '（临床生物化学常规）全套检验分析报告单'}
                  {activeReport.type === 'immuno' && '（临床免疫与化学发光）定量检验分析报告单'}
                </div>

                {/* 条形码与唯一编号 */}
                <div className="absolute right-0 top-0 hidden sm:flex flex-col items-end">
                  <div className="font-mono text-[10px] text-slate-400">唯一流水号: {activeReport.uniqueId}</div>
                  <div className="h-6 w-28 bg-slate-900 my-0.5 flex items-center justify-center text-[9px] text-white font-mono tracking-widest">
                    ||||||||||||||||||||
                  </div>
                  <div className="font-mono text-[10px] text-slate-600">{activeReport.barcode}</div>
                </div>
              </div>

              {/* 患者详细临床信息横栏 (按医院标准表格排版) */}
              <div className="py-2.5 border-b border-slate-300 text-xs leading-relaxed">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-1 text-slate-800">
                  <div>
                    <span className="text-slate-500">姓　　名:</span>{' '}
                    <strong className="text-slate-950 font-bold">{activeReport.patientName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">病 案 号:</span>{' '}
                    <span className="font-mono">{activeReport.medicalRecordNo}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">申请医师:</span>{' '}
                    <span>{activeReport.doctor}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">唯一编号:</span>{' '}
                    <span className="font-mono text-[11px]">{activeReport.uniqueId}</span>
                  </div>

                  <div>
                    <span className="text-slate-500">性　　别:</span> <span>{activeReport.gender}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">科　　别:</span> <span>{activeReport.dept}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">样本类型:</span> <span>{activeReport.sampleType}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">检验序号:</span>{' '}
                    <span className="font-mono">{activeReport.seqNo}</span>
                  </div>

                  <div>
                    <span className="text-slate-500">年　　龄:</span> <span>{activeReport.age}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">床　　号:</span>{' '}
                    <span className="font-mono font-bold">{activeReport.bedNo}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">就诊类型:</span> <span>{activeReport.visitType}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">检验仪器:</span> <span>{activeReport.instrument}</span>
                  </div>
                </div>

                <div className="mt-1 pt-1 border-t border-slate-100 flex flex-wrap gap-x-6 text-[11px]">
                  <div>
                    <span className="text-slate-500">临床诊断:</span>{' '}
                    <span className="text-slate-800">{activeReport.clinicalDiagnosis}</span>
                  </div>
                  {activeReport.remarks && (
                    <div>
                      <span className="text-slate-500">备　　注:</span>{' '}
                      <span className="text-slate-700">{activeReport.remarks}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* 微生物培养特殊评定横栏 (若为微生物药敏试验) */}
              {activeReport.type === 'ast' && currentPage === 1 && (
                <div className="py-2 border-b border-slate-200 text-xs bg-slate-50/50 px-2 my-1 rounded">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="text-slate-500">样本评估:</span>{' '}
                      <strong className="text-slate-800">{activeReport.sampleEvaluation}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500">菌落计数:</span>{' '}
                      <span className="font-mono font-bold text-slate-800">{activeReport.colonyCount}</span>
                    </div>
                  </div>
                  <div className="mt-1">
                    <span className="text-slate-500">检测结果:</span>{' '}
                    <span className="text-rose-700 font-bold text-sm">
                      {activeReport.sampleFinding}
                    </span>
                  </div>
                </div>
              )}

              {/* 核心检验结果表格区 */}
              <div className="mt-3">
                {/* 1. 微生物第1页：两列抗生素药敏 K-B 敏度表 (完全重现截图的双栏抗生素排版) */}
                {activeReport.type === 'ast' && currentPage === 1 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                    {/* 左栏 6 项抗生素 */}
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b-2 border-slate-700 text-slate-700 font-bold">
                          <th className="py-1.5 px-2">抗生素名称</th>
                          <th className="py-1.5 px-2 text-center">方法</th>
                          <th className="py-1.5 px-2 text-right">结果(mm)</th>
                          <th className="py-1.5 px-2 text-center">敏感度</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 text-xs">
                        {activeReport.results.slice(0, 6).map((item) => (
                          <tr key={item.id} className="hover:bg-slate-50">
                            <td className="py-1.5 px-2 text-slate-900 font-medium">{item.name}</td>
                            <td className="py-1.5 px-2 text-center font-mono text-slate-600">{item.method}</td>
                            <td className="py-1.5 px-2 text-right font-mono font-bold text-slate-900">{item.result}</td>
                            <td className="py-1.5 px-2 text-center font-bold">
                              {item.sensitivity === 'S' && <span className="text-emerald-700">S (敏感)</span>}
                              {item.sensitivity === 'I' && <span className="text-amber-700">I (中介)</span>}
                              {item.sensitivity === 'R' && <span className="text-rose-600">R (耐药)</span>}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {/* 右栏 6 项抗生素 */}
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b-2 border-slate-700 text-slate-700 font-bold">
                          <th className="py-1.5 px-2">抗生素名称</th>
                          <th className="py-1.5 px-2 text-center">方法</th>
                          <th className="py-1.5 px-2 text-right">结果(mm)</th>
                          <th className="py-1.5 px-2 text-center">敏感度</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 text-xs">
                        {activeReport.results.slice(6, 12).map((item) => (
                          <tr key={item.id} className="hover:bg-slate-50">
                            <td className="py-1.5 px-2 text-slate-900 font-medium">{item.name}</td>
                            <td className="py-1.5 px-2 text-center font-mono text-slate-600">{item.method}</td>
                            <td className="py-1.5 px-2 text-right font-mono font-bold text-slate-900">{item.result}</td>
                            <td className="py-1.5 px-2 text-center font-bold">
                              {item.sensitivity === 'S' && <span className="text-emerald-700">S (敏感)</span>}
                              {item.sensitivity === 'I' && <span className="text-amber-700">I (中介)</span>}
                              {item.sensitivity === 'R' && <span className="text-rose-600">R (耐药)</span>}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* 2. 微生物第2页：MIC 定量药敏与CLSI折点 */}
                {activeReport.type === 'ast' && currentPage === 2 && (
                  <div className="space-y-3">
                    <div className="text-xs font-bold text-slate-800 pb-1 border-b border-slate-300">
                      附加附页：全自动微生物鉴定系统 (VITEK-2) 最小抑菌浓度 (MIC) 定量测定分析
                    </div>
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b-2 border-slate-700 text-slate-700 font-bold">
                          <th className="py-1.5 px-3">序号</th>
                          <th className="py-1.5 px-3">抗微生物药物名称</th>
                          <th className="py-1.5 px-3">测试方法</th>
                          <th className="py-1.5 px-3 text-right">MIC测定值</th>
                          <th className="py-1.5 px-3 text-center">CLSI 判定解释</th>
                          <th className="py-1.5 px-3 text-right">生物参考折点范围</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 font-mono text-xs">
                        {activeReport.secondPageResults?.map((item, idx) => (
                          <tr key={item.id} className="hover:bg-slate-50">
                            <td className="py-2 px-3 text-slate-400">{idx + 1}</td>
                            <td className="py-2 px-3 font-sans font-medium text-slate-900">{item.name}</td>
                            <td className="py-2 px-3 text-slate-600">{item.method}</td>
                            <td className="py-2 px-3 text-right font-bold text-slate-950">{item.micValue}</td>
                            <td className="py-2 px-3 text-center font-bold">
                              {item.sensitivity === 'S' && <span className="text-emerald-600">S (敏感)</span>}
                              {item.sensitivity === 'R' && <span className="text-rose-600">R (耐药)</span>}
                              {item.sensitivity === 'I' && <span className="text-amber-600">I (中介)</span>}
                            </td>
                            <td className="py-2 px-3 text-right text-slate-600">{item.referenceRange}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* 3. 生化 / 凝血 / 免疫标准医学表格 */}
                {activeReport.type !== 'ast' && (
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b-2 border-slate-700 text-slate-700 font-bold">
                        <th className="py-1.5 px-2 w-10">序号</th>
                        <th className="py-1.5 px-2 w-20">英文简称</th>
                        <th className="py-1.5 px-3">项目全称</th>
                        <th className="py-1.5 px-2">测定方法</th>
                        <th className="py-1.5 px-3 text-right">检验结果</th>
                        <th className="py-1.5 px-2 text-center w-12">提示</th>
                        <th className="py-1.5 px-2 w-20">单位</th>
                        <th className="py-1.5 px-3 text-right">参考区间</th>
                        <th className="py-1.5 px-3 text-right text-slate-400">历史对比</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 font-sans text-xs">
                      {activeReport.results.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-slate-50">
                          <td className="py-2 px-2 text-slate-400 font-mono">{idx + 1}</td>
                          <td className="py-2 px-2 font-mono font-bold text-slate-800">{item.code || '-'}</td>
                          <td className="py-2 px-3 font-medium text-slate-900">{item.name}</td>
                          <td className="py-2 px-2 text-slate-500 text-[11px]">{item.method || '-'}</td>
                          <td className={`py-2 px-3 text-right font-mono font-bold text-sm ${
                            item.flag ? 'text-rose-600' : 'text-slate-900'
                          }`}>
                            {item.result}
                          </td>
                          <td className="py-2 px-2 text-center font-bold">
                            {item.flag === '↑' && <span className="text-rose-600">↑</span>}
                            {item.flag === '↓' && <span className="text-sky-600">↓</span>}
                            {item.flag === '↑↑' && <span className="text-rose-700 bg-rose-100 px-1 rounded animate-pulse">↑↑</span>}
                          </td>
                          <td className="py-2 px-2 text-slate-500 font-mono text-[11px]">{item.unit || '-'}</td>
                          <td className="py-2 px-3 text-right font-mono text-slate-700">{item.reference}</td>
                          <td className="py-2 px-3 text-right font-mono text-slate-400 text-[11px]">{item.lastResult || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* 临床评语与说明 */}
              <div className="mt-4 pt-2 border-t border-slate-300 text-xs">
                <div className="flex items-start gap-1">
                  <span className="font-semibold text-slate-800 shrink-0">评语:</span>
                  <span className="text-slate-700 leading-relaxed">{activeReport.comment}</span>
                </div>

                {/* 药敏与医学符号解释注记 (还原截图注: 敏感:S, 中介:I, 耐药:R...) */}
                <div className="mt-2 text-[11px] text-slate-500 leading-normal">
                  注：敏感:S，中介:I，耐药:R，剂量依赖敏感:SDD；KB法单位:mm，MIC法单位:μg/ml。
                </div>
              </div>
            </div>

            {/* 报告单底部：TAT 时间轴时间戳 + 法律声明 + 电子签名与执业印章 */}
            <div className="mt-6 pt-3 border-t-2 border-slate-800 text-xs text-slate-700 space-y-2">
              {/* 四段核心时效全程追溯 (近期的真实时间) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px] text-slate-600 bg-slate-50 p-2 rounded border border-slate-200">
                <div>
                  <span className="text-slate-400">采样时间:</span> {activeReport.samplingTime}
                </div>
                <div>
                  <span className="text-slate-400">接收时间:</span> {activeReport.receiveTime}
                </div>
                <div>
                  <span className="text-slate-400">检验时间:</span> {activeReport.testTime}
                </div>
                <div>
                  <span className="text-slate-400">报告时间:</span> {activeReport.reportTime}
                </div>
              </div>

              {/* 声明与联系方式 */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-500 gap-1">
                <div>
                  声明：此报告仅对本样本负责，如有疑问请三日内与检验科联系。电话: 023-85650516
                </div>
                <div>地址: 重庆市垫江县桂溪镇北外街116号</div>
              </div>

              {/* 检验者、审核者与电子印章 */}
              <div className="flex flex-wrap items-center justify-between pt-2 border-t border-slate-200 text-xs">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">检验者:</span>
                    <strong className="text-slate-900 font-serif text-sm">{activeReport.testerName}</strong>
                    <span className="text-[10px] text-slate-400">(主管技师)</span>
                  </div>

                  <div className="flex items-center gap-2 relative">
                    <span className="text-slate-500">审核者:</span>
                    <strong className="text-slate-900 font-serif text-sm">{activeReport.auditorName}</strong>
                    <span className="text-[10px] text-slate-400">(副主任检验师)</span>

                    {/* 数字化仿真执业医师草书防伪印章 (重现截图右下角手写签署效果) */}
                    <div className="ml-1 inline-flex items-center justify-center border-2 border-rose-600 text-rose-700 rounded px-1.5 py-0.2 rotate-[-5deg] text-[11px] font-serif font-black shadow-2xs select-none opacity-85">
                      {activeReport.auditorName} 印
                    </div>
                  </div>
                </div>

                {/* 页码与防伪标记 */}
                <div className="text-[11px] text-slate-400 font-mono">
                  {activeReport.hasSecondPage ? `第 ${currentPage} 页 共 2 页` : '第 1 页 共 1 页'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-2.5 bg-slate-100 border-t border-slate-300 flex items-center justify-between shrink-0 text-xs text-slate-600">
          <div className="flex items-center gap-3 font-mono text-[11px] text-slate-500">
            <span>提示: 点击右上角或底部按钮可随时退出审阅并返回表格</span>
            <span>·</span>
            <span>审核人员: {activeReport.auditorName || '蔡建华 (副主任技师)'}</span>
          </div>
          <button
            onClick={() => setShowReportModal(false)}
            className="px-4 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded-lg font-medium transition-colors"
          >
            关闭返回列表
          </button>
        </div>
      </div>
    </div>
  )}

      {/* 打印机与格式配置弹窗 */}
      <OutpatientPrintSettingsModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        onSave={(cfg) => {
          triggerAction(`打印机配置已更新: ${cfg.printer} · 纸张 ${cfg.labelSize}`);
        }}
      />
    </div>
  );
};
