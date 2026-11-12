export interface QcMaterial {
  id: string;
  name: string;
  levelCount: number;
  lotNo: string;
  expiryDate: string;
  manufacturer: string;
  device: string;
}

export interface QcTestItem {
  code: string;
  name: string;
  unit: string;
  group: string;
  target1: number;
  sd1: number;
  cv1: number;
  target2: number;
  sd2: number;
  cv2: number;
}

export interface QcRecordItem {
  id: string;
  materialId: string;
  auditStatus: '未审' | '已审';
  qcStatus: '在控' | '失控' | '警告';
  testItem: string;
  itemCode: string;
  level: number;
  lotNo: string;
  qcResult: number;
  targetVal: number;
  sdVal: number;
  cvVal: number;
  westgardRule: string;
  operator: string;
  qcTime: string;
  auditor: string;
  auditTime: string;
  device: string;
  causeAnalysis?: string;
  correctiveAction?: string;
}

export interface LjDataPoint {
  day: number;
  date: string;
  level1Val: number;
  level1SdDiff: number; // in units of SD
  level2Val: number;
  level2SdDiff: number; // in units of SD
  ruleTriggered?: string;
}

export const INITIAL_QC_MATERIALS: QcMaterial[] = [
  {
    id: 'mat-01',
    name: '生化AU2700质控(低)',
    levelCount: 2,
    lotNo: '202610051',
    expiryDate: '2027-04-30',
    manufacturer: '贝克曼库尔特 (Beckman Coulter)',
    device: '生化AU2700',
  },
  {
    id: 'mat-02',
    name: '生化AU2700质控(高)',
    levelCount: 3,
    lotNo: '202610052',
    expiryDate: '2027-04-30',
    manufacturer: '贝克曼库尔特 (Beckman Coulter)',
    device: '生化AU2700',
  },
  {
    id: 'mat-03',
    name: '罗氏 Cobas 8000 多项复合生化质控物',
    levelCount: 2,
    lotNo: '202610A08',
    expiryDate: '2027-06-30',
    manufacturer: '罗氏诊断 (Roche Diagnostics)',
    device: '罗氏 Cobas 8000 (c702)',
  },
  {
    id: 'mat-04',
    name: '雅培 Alinity ci 急查心肌与生化质控物',
    levelCount: 2,
    lotNo: '202609B14',
    expiryDate: '2027-05-15',
    manufacturer: '雅培 (Abbott Laboratories)',
    device: '雅培 Alinity ci',
  },
];

export const QC_TEST_ITEMS: QcTestItem[] = [
  { code: 'TP', name: '总蛋白 (白蛋白)', unit: 'g/L', group: '肝功组', target1: 42.0, sd1: 1.2, cv1: 2.85, target2: 68.0, sd2: 1.8, cv2: 2.65 },
  { code: 'GLU', name: '葡萄糖', unit: 'mmol/L', group: '糖代谢', target1: 5.50, sd1: 0.12, cv1: 2.18, target2: 15.20, sd2: 0.38, cv2: 2.50 },
  { code: 'CA', name: '钙 (Ca)', unit: 'mmol/L', group: '离子组', target1: 2.25, sd1: 0.08, cv1: 3.55, target2: 3.40, sd2: 0.12, cv2: 3.53 },
  { code: 'ALT', name: '丙氨酸氨基转移酶', unit: 'U/L', group: '肝功组', target1: 42.5, sd1: 1.5, cv1: 3.52, target2: 125.0, sd2: 3.8, cv2: 3.04 },
  { code: 'AST', name: '天门冬氨酸转移酶', unit: 'U/L', group: '肝功组', target1: 35.0, sd1: 1.4, cv1: 4.00, target2: 110.0, sd2: 3.2, cv2: 2.91 },
  { code: 'CREA', name: '肌酐 (酶法)', unit: 'μmol/L', group: '肾功组', target1: 88.0, sd1: 2.2, cv1: 2.50, target2: 280.0, sd2: 6.5, cv2: 2.32 },
  { code: 'K+', name: '血清钾离子', unit: 'mmol/L', group: '电解质', target1: 4.35, sd1: 0.08, cv1: 1.84, target2: 6.80, sd2: 0.14, cv2: 2.06 },
  { code: 'PH', name: 'PH值', unit: '', group: '血气组', target1: 7.40, sd1: 0.02, cv1: 0.27, target2: 7.20, sd2: 0.03, cv2: 0.41 },
];

export const INITIAL_QC_RECORDS: QcRecordItem[] = [
  // 1. 生化AU2700质控 - mat-01
  {
    id: 'QC-20261029-01',
    materialId: 'mat-01',
    auditStatus: '未审',
    qcStatus: '在控',
    testItem: 'PH值',
    itemCode: 'PH',
    level: 1,
    lotNo: '40002',
    qcResult: 2.0,
    targetVal: 1.5,
    sdVal: 0.2,
    cvVal: 0.2,
    westgardRule: '在控 (正常在控)',
    operator: '张珊',
    qcTime: '2026-10-29 08:12:32',
    auditor: '蔡文斌',
    auditTime: '',
    device: '生化AU2700',
  },
  {
    id: 'QC-20261029-02',
    materialId: 'mat-01',
    auditStatus: '未审',
    qcStatus: '在控',
    testItem: '钙',
    itemCode: 'CA',
    level: 2,
    lotNo: '40001',
    qcResult: 3.0,
    targetVal: 2.1,
    sdVal: 0.2,
    cvVal: 0.2,
    westgardRule: '在控 (正常在控)',
    operator: '陈志远',
    qcTime: '2026-10-29 08:12:32',
    auditor: '蔡文斌',
    auditTime: '',
    device: '生化AU2700',
  },
  {
    id: 'QC-20261029-03',
    materialId: 'mat-01',
    auditStatus: '已审',
    qcStatus: '在控',
    testItem: 'PH值',
    itemCode: 'PH',
    level: 2,
    lotNo: '202610051',
    qcResult: 7.21,
    targetVal: 7.20,
    sdVal: 0.03,
    cvVal: 0.41,
    westgardRule: '在控 (正常在控)',
    operator: '张珊',
    qcTime: '2026-10-29 08:12:32',
    auditor: '蔡文斌',
    auditTime: '2026-10-29 08:25:10',
    device: '生化AU2700',
  },
  {
    id: 'QC-20261029-04',
    materialId: 'mat-01',
    auditStatus: '已审',
    qcStatus: '在控',
    testItem: '总蛋白 (白蛋白)',
    itemCode: 'TP',
    level: 1,
    lotNo: '202610051',
    qcResult: 42.4,
    targetVal: 42.0,
    sdVal: 1.20,
    cvVal: 2.85,
    westgardRule: '在控 (正常在控)',
    operator: '黄雅芳',
    qcTime: '2026-10-29 08:05:14',
    auditor: '蔡文斌',
    auditTime: '2026-10-29 08:20:00',
    device: '生化AU2700',
  },
  {
    id: 'QC-20261029-05',
    materialId: 'mat-01',
    auditStatus: '已审',
    qcStatus: '在控',
    testItem: '葡萄糖 (GLU)',
    itemCode: 'GLU',
    level: 1,
    lotNo: '202610051',
    qcResult: 5.54,
    targetVal: 5.50,
    sdVal: 0.12,
    cvVal: 2.18,
    westgardRule: '在控 (正常在控)',
    operator: '林德胜',
    qcTime: '2026-10-29 08:00:20',
    auditor: '张先义',
    auditTime: '2026-10-29 08:18:40',
    device: '生化AU2700',
  },
  {
    id: 'QC-20261029-06',
    materialId: 'mat-01',
    auditStatus: '已审',
    qcStatus: '在控',
    testItem: '丙氨酸氨基转移酶 (ALT)',
    itemCode: 'ALT',
    level: 1,
    lotNo: '202610051',
    qcResult: 43.1,
    targetVal: 42.5,
    sdVal: 1.50,
    cvVal: 3.52,
    westgardRule: '在控 (正常在控)',
    operator: '郑舒涵',
    qcTime: '2026-10-29 07:55:00',
    auditor: '蔡文斌',
    auditTime: '2026-10-29 08:15:30',
    device: '生化AU2700',
  },
  {
    id: 'QC-20261029-07',
    materialId: 'mat-01',
    auditStatus: '已审',
    qcStatus: '在控',
    testItem: '肌酐 (CREA)',
    itemCode: 'CREA',
    level: 1,
    lotNo: '202610051',
    qcResult: 89.2,
    targetVal: 88.0,
    sdVal: 2.20,
    cvVal: 2.50,
    westgardRule: '在控 (正常在控)',
    operator: '陈志远',
    qcTime: '2026-10-29 07:50:18',
    auditor: '刘建平',
    auditTime: '2026-10-29 08:10:00',
    device: '生化AU2700',
  },
  {
    id: 'QC-20261029-08',
    materialId: 'mat-01',
    auditStatus: '已审',
    qcStatus: '在控',
    testItem: '血清钾离子 (K+)',
    itemCode: 'K+',
    level: 1,
    lotNo: '202610051',
    qcResult: 4.38,
    targetVal: 4.35,
    sdVal: 0.08,
    cvVal: 1.84,
    westgardRule: '在控 (正常在控)',
    operator: '林德胜',
    qcTime: '2026-10-29 07:45:22',
    auditor: '蔡文斌',
    auditTime: '2026-10-29 08:05:00',
    device: '生化AU2700',
  },

  // 2. 生化AU2700质控(高) - mat-02
  {
    id: 'QC-20261029-11',
    materialId: 'mat-02',
    auditStatus: '已审',
    qcStatus: '在控',
    testItem: '总蛋白 (白蛋白)',
    itemCode: 'TP',
    level: 2,
    lotNo: '202610052',
    qcResult: 68.5,
    targetVal: 68.0,
    sdVal: 1.80,
    cvVal: 2.65,
    westgardRule: '在控 (正常在控)',
    operator: '张珊',
    qcTime: '2026-10-29 08:15:00',
    auditor: '蔡文斌',
    auditTime: '2026-10-29 08:32:00',
    device: '生化AU2700',
  },
  {
    id: 'QC-20261029-12',
    materialId: 'mat-02',
    auditStatus: '已审',
    qcStatus: '在控',
    testItem: '葡萄糖 (GLU)',
    itemCode: 'GLU',
    level: 2,
    lotNo: '202610052',
    qcResult: 15.35,
    targetVal: 15.20,
    sdVal: 0.38,
    cvVal: 2.50,
    westgardRule: '在控 (正常在控)',
    operator: '陈志远',
    qcTime: '2026-10-29 08:14:20',
    auditor: '蔡文斌',
    auditTime: '2026-10-29 08:32:00',
    device: '生化AU2700',
  },
  {
    id: 'QC-20261029-13',
    materialId: 'mat-02',
    auditStatus: '已审',
    qcStatus: '在控',
    testItem: '钙 (Ca)',
    itemCode: 'CA',
    level: 2,
    lotNo: '202610052',
    qcResult: 3.42,
    targetVal: 3.40,
    sdVal: 0.12,
    cvVal: 3.53,
    westgardRule: '在控 (正常在控)',
    operator: '黄雅芳',
    qcTime: '2026-10-29 08:10:00',
    auditor: '蔡文斌',
    auditTime: '2026-10-29 08:30:00',
    device: '生化AU2700',
  },
  {
    id: 'QC-20261029-14',
    materialId: 'mat-02',
    auditStatus: '已审',
    qcStatus: '在控',
    testItem: '丙氨酸氨基转移酶 (ALT)',
    itemCode: 'ALT',
    level: 2,
    lotNo: '202610052',
    qcResult: 126.5,
    targetVal: 125.0,
    sdVal: 3.80,
    cvVal: 3.04,
    westgardRule: '在控 (正常在控)',
    operator: '林德胜',
    qcTime: '2026-10-29 08:08:00',
    auditor: '蔡文斌',
    auditTime: '2026-10-29 08:28:00',
    device: '生化AU2700',
  },
  {
    id: 'QC-20261029-15',
    materialId: 'mat-02',
    auditStatus: '已审',
    qcStatus: '在控',
    testItem: '天门冬氨酸转移酶 (AST)',
    itemCode: 'AST',
    level: 2,
    lotNo: '202610052',
    qcResult: 112.0,
    targetVal: 110.0,
    sdVal: 3.20,
    cvVal: 2.91,
    westgardRule: '在控 (正常在控)',
    operator: '郑舒涵',
    qcTime: '2026-10-29 08:05:00',
    auditor: '刘建平',
    auditTime: '2026-10-29 08:25:00',
    device: '生化AU2700',
  },
  {
    id: 'QC-20261029-16',
    materialId: 'mat-02',
    auditStatus: '已审',
    qcStatus: '在控',
    testItem: '肌酐 (CREA)',
    itemCode: 'CREA',
    level: 2,
    lotNo: '202610052',
    qcResult: 284.2,
    targetVal: 280.0,
    sdVal: 6.50,
    cvVal: 2.32,
    westgardRule: '在控 (正常在控)',
    operator: '陈志远',
    qcTime: '2026-10-29 08:02:00',
    auditor: '蔡文斌',
    auditTime: '2026-10-29 08:22:00',
    device: '生化AU2700',
  },
  {
    id: 'QC-20261029-17',
    materialId: 'mat-02',
    auditStatus: '已审',
    qcStatus: '在控',
    testItem: '血清钾离子 (K+)',
    itemCode: 'K+',
    level: 2,
    lotNo: '202610052',
    qcResult: 6.85,
    targetVal: 6.80,
    sdVal: 0.14,
    cvVal: 2.06,
    westgardRule: '在控 (正常在控)',
    operator: '林德胜',
    qcTime: '2026-10-29 07:58:00',
    auditor: '张先义',
    auditTime: '2026-10-29 08:18:00',
    device: '生化AU2700',
  },
  {
    id: 'QC-20261029-18',
    materialId: 'mat-02',
    auditStatus: '未审',
    qcStatus: '在控',
    testItem: '葡萄糖 (GLU)',
    itemCode: 'GLU',
    level: 3,
    lotNo: '202610052',
    qcResult: 24.80,
    targetVal: 25.00,
    sdVal: 0.65,
    cvVal: 2.60,
    westgardRule: '在控 (高浓度危急线性上限)',
    operator: '黄雅芳',
    qcTime: '2026-10-29 07:52:00',
    auditor: '',
    auditTime: '',
    device: '生化AU2700',
  },

  // 3. 罗氏 Cobas 8000 多项复合生化质控物 - mat-03
  {
    id: 'QC-20261029-21',
    materialId: 'mat-03',
    auditStatus: '已审',
    qcStatus: '在控',
    testItem: '丙氨酸氨基转移酶 (ALT)',
    itemCode: 'ALT',
    level: 1,
    lotNo: '202610A08',
    qcResult: 42.6,
    targetVal: 42.0,
    sdVal: 1.80,
    cvVal: 4.28,
    westgardRule: '在控 (正常在控)',
    operator: '张珊',
    qcTime: '2026-10-29 08:20:00',
    auditor: '蔡文斌',
    auditTime: '2026-10-29 08:35:00',
    device: '罗氏 Cobas 8000 (c702)',
  },
  {
    id: 'QC-20261029-22',
    materialId: 'mat-03',
    auditStatus: '已审',
    qcStatus: '在控',
    testItem: '天门冬氨酸转移酶 (AST)',
    itemCode: 'AST',
    level: 1,
    lotNo: '202610A08',
    qcResult: 36.2,
    targetVal: 35.0,
    sdVal: 1.40,
    cvVal: 4.00,
    westgardRule: '在控 (正常在控)',
    operator: '陈志远',
    qcTime: '2026-10-29 08:18:00',
    auditor: '蔡文斌',
    auditTime: '2026-10-29 08:35:00',
    device: '罗氏 Cobas 8000 (c702)',
  },
  {
    id: 'QC-20261029-23',
    materialId: 'mat-03',
    auditStatus: '已审',
    qcStatus: '在控',
    testItem: '肌酐 (CREA)',
    itemCode: 'CREA',
    level: 1,
    lotNo: '202610A08',
    qcResult: 89.2,
    targetVal: 88.5,
    sdVal: 2.40,
    cvVal: 2.71,
    westgardRule: '在控 (正常在控)',
    operator: '黄雅芳',
    qcTime: '2026-10-29 08:15:00',
    auditor: '蔡文斌',
    auditTime: '2026-10-29 08:30:00',
    device: '罗氏 Cobas 8000 (c702)',
  },
  {
    id: 'QC-20261029-24',
    materialId: 'mat-03',
    auditStatus: '已审',
    qcStatus: '在控',
    testItem: '葡萄糖 (GLU)',
    itemCode: 'GLU',
    level: 1,
    lotNo: '202610A08',
    qcResult: 5.58,
    targetVal: 5.50,
    sdVal: 0.15,
    cvVal: 2.72,
    westgardRule: '在控 (正常在控)',
    operator: '林德胜',
    qcTime: '2026-10-29 08:10:00',
    auditor: '张先义',
    auditTime: '2026-10-29 08:26:00',
    device: '罗氏 Cobas 8000 (c702)',
  },
  {
    id: 'QC-20261029-25',
    materialId: 'mat-03',
    auditStatus: '已审',
    qcStatus: '在控',
    testItem: '丙氨酸氨基转移酶 (ALT)',
    itemCode: 'ALT',
    level: 2,
    lotNo: '202610A08',
    qcResult: 128.5,
    targetVal: 125.0,
    sdVal: 4.20,
    cvVal: 3.36,
    westgardRule: '在控 (正常在控)',
    operator: '郑舒涵',
    qcTime: '2026-10-29 08:05:00',
    auditor: '蔡文斌',
    auditTime: '2026-10-29 08:22:00',
    device: '罗氏 Cobas 8000 (c702)',
  },
  {
    id: 'QC-20261029-26',
    materialId: 'mat-03',
    auditStatus: '已审',
    qcStatus: '在控',
    testItem: '肌酐 (CREA)',
    itemCode: 'CREA',
    level: 2,
    lotNo: '202610A08',
    qcResult: 285.4,
    targetVal: 280.0,
    sdVal: 7.00,
    cvVal: 2.50,
    westgardRule: '在控 (正常在控)',
    operator: '陈志远',
    qcTime: '2026-10-29 08:00:00',
    auditor: '蔡文斌',
    auditTime: '2026-10-29 08:18:00',
    device: '罗氏 Cobas 8000 (c702)',
  },

  // 4. 雅培 Alinity ci 急查心肌与生化质控物 - mat-04
  {
    id: 'QC-20261029-31',
    materialId: 'mat-04',
    auditStatus: '已审',
    qcStatus: '在控',
    testItem: '血清钾离子 (K+)',
    itemCode: 'K+',
    level: 1,
    lotNo: '202609B14',
    qcResult: 4.41,
    targetVal: 4.35,
    sdVal: 0.08,
    cvVal: 1.84,
    westgardRule: '在控 (正常在控)',
    operator: '张珊',
    qcTime: '2026-10-29 08:25:00',
    auditor: '蔡文斌',
    auditTime: '2026-10-29 08:40:00',
    device: '雅培 Alinity ci',
  },
  {
    id: 'QC-20261029-32',
    materialId: 'mat-04',
    auditStatus: '已审',
    qcStatus: '在控',
    testItem: '超敏肌钙蛋白I (hs-cTnI)',
    itemCode: 'hs-cTnI',
    level: 1,
    lotNo: '202609B14',
    qcResult: 0.285,
    targetVal: 0.280,
    sdVal: 0.015,
    cvVal: 5.35,
    westgardRule: '在控 (急查心肌标志物在控)',
    operator: '陈志远',
    qcTime: '2026-10-29 08:22:00',
    auditor: '蔡文斌',
    auditTime: '2026-10-29 08:38:00',
    device: '雅培 Alinity ci',
  },
  {
    id: 'QC-20261029-33',
    materialId: 'mat-04',
    auditStatus: '已审',
    qcStatus: '在控',
    testItem: '超敏肌钙蛋白I (hs-cTnI)',
    itemCode: 'hs-cTnI',
    level: 2,
    lotNo: '202609B14',
    qcResult: 1.850,
    targetVal: 1.800,
    sdVal: 0.050,
    cvVal: 2.77,
    westgardRule: '在控 (高浓度心梗预警区在控)',
    operator: '黄雅芳',
    qcTime: '2026-10-29 08:18:00',
    auditor: '蔡文斌',
    auditTime: '2026-10-29 08:35:00',
    device: '雅培 Alinity ci',
  },
  {
    id: 'QC-20261029-34',
    materialId: 'mat-04',
    auditStatus: '已审',
    qcStatus: '在控',
    testItem: '葡萄糖 (GLU)',
    itemCode: 'GLU',
    level: 1,
    lotNo: '202609B14',
    qcResult: 5.62,
    targetVal: 5.50,
    sdVal: 0.14,
    cvVal: 2.54,
    westgardRule: '在控 (正常在控)',
    operator: '林德胜',
    qcTime: '2026-10-29 08:12:00',
    auditor: '刘建平',
    auditTime: '2026-10-29 08:30:00',
    device: '雅培 Alinity ci',
  },
];

// 29-day Levey-Jennings L-J Plot data for October 2026 (matching screenshot curves)
export const INITIAL_LJ_PLOT_DATA: LjDataPoint[] = [
  { day: 1, date: '2026-10-01', level1Val: 42.1, level1SdDiff: 0.08, level2Val: 67.2, level2SdDiff: -0.44 },
  { day: 2, date: '2026-10-02', level1Val: 42.8, level1SdDiff: 0.67, level2Val: 69.5, level2SdDiff: 0.83 },
  { day: 3, date: '2026-10-03', level1Val: 42.0, level1SdDiff: 0.00, level2Val: 67.4, level2SdDiff: -0.33 },
  { day: 4, date: '2026-10-04', level1Val: 41.3, level1SdDiff: -0.58, level2Val: 67.8, level2SdDiff: -0.11 },
  { day: 5, date: '2026-10-05', level1Val: 41.8, level1SdDiff: -0.17, level2Val: 69.2, level2SdDiff: 0.67 },
  { day: 6, date: '2026-10-06', level1Val: 42.4, level1SdDiff: 0.33, level2Val: 67.5, level2SdDiff: -0.28 },
  { day: 7, date: '2026-10-07', level1Val: 42.6, level1SdDiff: 0.50, level2Val: 67.0, level2SdDiff: -0.56 },
  { day: 8, date: '2026-10-08', level1Val: 40.9, level1SdDiff: -0.92, level2Val: 69.6, level2SdDiff: 0.89 },
  { day: 9, date: '2026-10-09', level1Val: 42.7, level1SdDiff: 0.58, level2Val: 68.9, level2SdDiff: 0.50 },
  { day: 10, date: '2026-10-10', level1Val: 42.9, level1SdDiff: 0.75, level2Val: 67.6, level2SdDiff: -0.22 },
  { day: 11, date: '2026-10-11', level1Val: 41.7, level1SdDiff: -0.25, level2Val: 68.2, level2SdDiff: 0.11 },
  { day: 12, date: '2026-10-12', level1Val: 42.5, level1SdDiff: 0.42, level2Val: 70.0, level2SdDiff: 1.11 },
  { day: 13, date: '2026-10-13', level1Val: 42.3, level1SdDiff: 0.25, level2Val: 68.5, level2SdDiff: 0.28 },
  { day: 14, date: '2026-10-14', level1Val: 41.9, level1SdDiff: -0.08, level2Val: 67.9, level2SdDiff: -0.06 },
  { day: 15, date: '2026-10-15', level1Val: 42.6, level1SdDiff: 0.50, level2Val: 68.8, level2SdDiff: 0.44 },
  { day: 16, date: '2026-10-16', level1Val: 42.2, level1SdDiff: 0.17, level2Val: 67.7, level2SdDiff: -0.17 },
  { day: 17, date: '2026-10-17', level1Val: 41.5, level1SdDiff: -0.42, level2Val: 68.3, level2SdDiff: 0.17 },
  { day: 18, date: '2026-10-18', level1Val: 42.8, level1SdDiff: 0.67, level2Val: 69.1, level2SdDiff: 0.61 },
  { day: 19, date: '2026-10-19', level1Val: 42.4, level1SdDiff: 0.33, level2Val: 68.0, level2SdDiff: 0.00 },
  { day: 20, date: '2026-10-20', level1Val: 41.6, level1SdDiff: -0.33, level2Val: 67.4, level2SdDiff: -0.33 },
  { day: 21, date: '2026-10-21', level1Val: 42.5, level1SdDiff: 0.42, level2Val: 68.7, level2SdDiff: 0.39 },
  { day: 22, date: '2026-10-22', level1Val: 42.9, level1SdDiff: 0.75, level2Val: 69.4, level2SdDiff: 0.78 },
  { day: 23, date: '2026-10-23', level1Val: 42.1, level1SdDiff: 0.08, level2Val: 68.1, level2SdDiff: 0.06 },
  { day: 24, date: '2026-10-24', level1Val: 41.4, level1SdDiff: -0.50, level2Val: 67.3, level2SdDiff: -0.39 },
  { day: 25, date: '2026-10-25', level1Val: 42.6, level1SdDiff: 0.50, level2Val: 68.9, level2SdDiff: 0.50 },
  { day: 26, date: '2026-10-26', level1Val: 42.3, level1SdDiff: 0.25, level2Val: 68.4, level2SdDiff: 0.22 },
  { day: 27, date: '2026-10-27', level1Val: 42.7, level1SdDiff: 0.58, level2Val: 69.0, level2SdDiff: 0.56 },
  { day: 28, date: '2026-10-28', level1Val: 42.2, level1SdDiff: 0.17, level2Val: 68.2, level2SdDiff: 0.11 },
  { day: 29, date: '2026-10-29', level1Val: 42.4, level1SdDiff: 0.33, level2Val: 68.5, level2SdDiff: 0.28 },
];

// ======================================================================
// 质控物管理 (QC Material Management) Data Types and Datasets
// Based on user screenshot image_f3a85555.png
// ======================================================================

export interface QcLevelItem {
  id: string;
  level: number;
  lotNo: string;
  expiryDate: string;
  sampleNo: string;
  status: '在用' | '停用';
  operator?: string;
}

export interface QcMaterialItemSetting {
  code: string;
  name: string;
  valueType: '靶值标准差' | '定性' | '范围值';
  unit?: string;
  levelTargets: {
    level: number;
    target: number;
    sd: number;
    cv: number;
    allowableCv: number;
  }[];
}

export interface QcWestgardRuleSetting {
  id: string;
  name: string;
  type: string;
  qcType: '警告' | '失控';
  description: string;
  enabled: boolean;
}

export interface QcMaterialDetail {
  id: string;
  name: string;
  deviceGroup: string; // e.g. 'D5100', 'MQ2000', '生化AU2700', 'Cobas 8000'
  device: string;
  levelCount: number;
  startDate: string; // 启用日期 (近期: 2026年)
  manufacturer: string;
  status: '在用' | '停用';
  levels: QcLevelItem[];
  items: QcMaterialItemSetting[];
  rules: QcWestgardRuleSetting[];
}

export const INITIAL_WESTGARD_RULES: QcWestgardRuleSetting[] = [
  { id: 'r1', name: '1-2S', type: 'N-XS', qcType: '警告', description: '单一质控测定值偏离均值超过2个标准差(SD)，提示系统进入告警审查', enabled: true },
  { id: 'r2', name: '1-3S', type: 'N-XS', qcType: '失控', description: '单一测定值超过3个标准差(SD)，判定为极度偶然或系统误差导致失控', enabled: true },
  { id: 'r3', name: '2-2S', type: 'N-XS', qcType: '失控', description: '同批2个质控品或连续2次同水平测定值均超过2倍SD，表现为系统误差', enabled: true },
  { id: 'r4', name: 'R-4S', type: 'N-XS', qcType: '失控', description: '同批测定中2个质控测定值之差达到或超过4倍SD，判定为随机误差失控', enabled: true },
  { id: 'r5', name: '4-1S', type: 'N-XS', qcType: '失控', description: '连续4个测定结果同向偏离均值超过1倍SD，表现为仪器光源衰减或试剂轻微漂移', enabled: true },
  { id: 'r6', name: '10-X', type: 'N-XS', qcType: '失控', description: '连续10个测定值均落在均值同一侧，判定为显著均值系统性偏移', enabled: true },
];

export const INITIAL_QC_MATERIAL_DETAILS: QcMaterialDetail[] = [
  // Group: D5100 (matching screenshot!)
  {
    id: 'mat-d5100-01',
    name: 'NSE液体质控品',
    deviceGroup: 'D5100',
    device: '罗氏 Cobas e411 (D5100模块)',
    levelCount: 2,
    startDate: '2026-08-15',
    manufacturer: '罗氏诊断 (Roche Diagnostics)',
    status: '在用',
    levels: [
      { id: 'lvl-1', level: 1, lotNo: '50322', expiryDate: '2027-04-30', sampleNo: '1000', status: '在用', operator: '张珊' },
      { id: 'lvl-2', level: 2, lotNo: '50321', expiryDate: '2027-04-30', sampleNo: '1001', status: '在用', operator: '张珊' },
    ],
    items: [
      {
        code: 'TP',
        name: '白蛋白',
        valueType: '靶值标准差',
        unit: 'g/L',
        levelTargets: [
          { level: 1, target: 42.0, sd: 1.20, cv: 2.86, allowableCv: 4.0 },
          { level: 2, target: 68.0, sd: 1.80, cv: 2.65, allowableCv: 4.0 },
        ],
      },
      {
        code: 'ALB',
        name: '总胆红素',
        valueType: '定性',
        unit: 'μmol/L',
        levelTargets: [
          { level: 1, target: 15.2, sd: 0.50, cv: 3.29, allowableCv: 5.0 },
          { level: 2, target: 38.6, sd: 1.10, cv: 2.85, allowableCv: 5.0 },
        ],
      },
      {
        code: 'ALB-R',
        name: '总胆红素',
        valueType: '范围值',
        unit: 'μmol/L',
        levelTargets: [
          { level: 1, target: 16.5, sd: 0.60, cv: 3.63, allowableCv: 6.0 },
          { level: 2, target: 45.0, sd: 1.40, cv: 3.11, allowableCv: 5.5 },
        ],
      },
      {
        code: 'NSE',
        name: '神经元特异性烯醇化酶',
        valueType: '靶值标准差',
        unit: 'ng/mL',
        levelTargets: [
          { level: 1, target: 12.5, sd: 0.45, cv: 3.60, allowableCv: 5.0 },
          { level: 2, target: 48.2, sd: 1.50, cv: 3.11, allowableCv: 5.0 },
        ],
      },
      {
        code: 'GLU',
        name: '葡萄糖',
        valueType: '靶值标准差',
        unit: 'mmol/L',
        levelTargets: [
          { level: 1, target: 5.50, sd: 0.12, cv: 2.18, allowableCv: 3.5 },
          { level: 2, target: 15.20, sd: 0.38, cv: 2.50, allowableCv: 3.5 },
        ],
      },
      {
        code: 'ALT',
        name: '谷丙转氨酶',
        valueType: '靶值标准差',
        unit: 'U/L',
        levelTargets: [
          { level: 1, target: 42.5, sd: 1.50, cv: 3.52, allowableCv: 5.0 },
          { level: 2, target: 125.0, sd: 3.80, cv: 3.04, allowableCv: 4.5 },
        ],
      },
    ],
    rules: INITIAL_WESTGARD_RULES,
  },
  {
    id: 'mat-d5100-02',
    name: '内分泌学质控品',
    deviceGroup: 'D5100',
    device: '西门子 Centaur XP (D5100系统)',
    levelCount: 3,
    startDate: '2026-09-01',
    manufacturer: '西门子医疗 (Siemens Healthineers)',
    status: '在用',
    levels: [
      { id: 'lvl-e1', level: 1, lotNo: '60101', expiryDate: '2027-05-31', sampleNo: '2001', status: '在用', operator: '陈志远' },
      { id: 'lvl-e2', level: 2, lotNo: '60102', expiryDate: '2027-05-31', sampleNo: '2002', status: '在用', operator: '陈志远' },
      { id: 'lvl-e3', level: 3, lotNo: '60103', expiryDate: '2027-05-31', sampleNo: '2003', status: '在用', operator: '陈志远' },
    ],
    items: [
      {
        code: 'TSH',
        name: '促甲状腺激素 (TSH)',
        valueType: '靶值标准差',
        unit: 'mIU/L',
        levelTargets: [
          { level: 1, target: 0.85, sd: 0.04, cv: 4.71, allowableCv: 6.5 },
          { level: 2, target: 3.40, sd: 0.12, cv: 3.53, allowableCv: 5.0 },
          { level: 3, target: 8.60, sd: 0.28, cv: 3.26, allowableCv: 4.8 },
        ],
      },
      {
        code: 'FT3',
        name: '游离三碘甲状腺原氨酸',
        valueType: '靶值标准差',
        unit: 'pmol/L',
        levelTargets: [
          { level: 1, target: 2.80, sd: 0.10, cv: 3.57, allowableCv: 5.5 },
          { level: 2, target: 5.60, sd: 0.18, cv: 3.21, allowableCv: 5.0 },
          { level: 3, target: 12.4, sd: 0.40, cv: 3.23, allowableCv: 4.8 },
        ],
      },
      {
        code: 'FT4',
        name: '游离甲状腺素 (FT4)',
        valueType: '靶值标准差',
        unit: 'pmol/L',
        levelTargets: [
          { level: 1, target: 9.80, sd: 0.35, cv: 3.57, allowableCv: 5.5 },
          { level: 2, target: 17.5, sd: 0.55, cv: 3.14, allowableCv: 5.0 },
          { level: 3, target: 35.0, sd: 1.10, cv: 3.14, allowableCv: 4.5 },
        ],
      },
    ],
    rules: INITIAL_WESTGARD_RULES,
  },

  // Group: MQ2000 (matching screenshot!)
  {
    id: 'mat-mq-01',
    name: '糖化血红蛋白全血质控品',
    deviceGroup: 'MQ2000',
    device: '惠中 MQ2000 HPLC分析仪',
    levelCount: 2,
    startDate: '2026-09-10',
    manufacturer: '惠中生物医疗',
    status: '在用',
    levels: [
      { id: 'lvl-mq1', level: 1, lotNo: 'Hb-2026L1', expiryDate: '2027-06-30', sampleNo: '3001', status: '在用', operator: '黄雅芳' },
      { id: 'lvl-mq2', level: 2, lotNo: 'Hb-2026L2', expiryDate: '2027-06-30', sampleNo: '3002', status: '在用', operator: '黄雅芳' },
    ],
    items: [
      {
        code: 'HbA1c',
        name: '糖化血红蛋白 A1c',
        valueType: '靶值标准差',
        unit: '%',
        levelTargets: [
          { level: 1, target: 5.40, sd: 0.10, cv: 1.85, allowableCv: 3.0 },
          { level: 2, target: 9.80, sd: 0.18, cv: 1.84, allowableCv: 3.0 },
        ],
      },
    ],
    rules: INITIAL_WESTGARD_RULES,
  },

  // Group: 生化AU2700
  {
    id: 'mat-au-01',
    name: '生化AU2700常规质控物',
    deviceGroup: '生化AU2700',
    device: '贝克曼 AU2700 全自动生化分析仪',
    levelCount: 2,
    startDate: '2026-10-01',
    manufacturer: '贝克曼库尔特 (Beckman Coulter)',
    status: '在用',
    levels: [
      { id: 'lvl-au1', level: 1, lotNo: '40002', expiryDate: '2027-08-31', sampleNo: '101', status: '在用', operator: '张珊' },
      { id: 'lvl-au2', level: 2, lotNo: '40001', expiryDate: '2027-08-31', sampleNo: '102', status: '在用', operator: '张珊' },
    ],
    items: [
      {
        code: 'PH',
        name: 'PH值',
        valueType: '靶值标准差',
        unit: '',
        levelTargets: [
          { level: 1, target: 1.50, sd: 0.20, cv: 13.33, allowableCv: 15.0 },
          { level: 2, target: 2.10, sd: 0.20, cv: 9.52, allowableCv: 12.0 },
        ],
      },
      {
        code: 'CA',
        name: '钙 (Ca)',
        valueType: '靶值标准差',
        unit: 'mmol/L',
        levelTargets: [
          { level: 1, target: 2.10, sd: 0.08, cv: 3.81, allowableCv: 4.5 },
          { level: 2, target: 3.00, sd: 0.11, cv: 3.67, allowableCv: 4.0 },
        ],
      },
      {
        code: 'TP',
        name: '白蛋白 (TP)',
        valueType: '靶值标准差',
        unit: 'g/L',
        levelTargets: [
          { level: 1, target: 42.0, sd: 1.20, cv: 2.86, allowableCv: 4.0 },
          { level: 2, target: 68.0, sd: 1.80, cv: 2.65, allowableCv: 4.0 },
        ],
      },
      {
        code: 'GLU',
        name: '葡萄糖 (GLU)',
        valueType: '靶值标准差',
        unit: 'mmol/L',
        levelTargets: [
          { level: 1, target: 5.50, sd: 0.12, cv: 2.18, allowableCv: 3.5 },
          { level: 2, target: 15.20, sd: 0.38, cv: 2.50, allowableCv: 3.5 },
        ],
      },
    ],
    rules: INITIAL_WESTGARD_RULES,
  },

  // Group: Cobas 8000
  {
    id: 'mat-cobas-01',
    name: 'Cobas 8000心肌标志物质控品',
    deviceGroup: 'Cobas 8000',
    device: '罗氏 Cobas 8000 (c702/e801)',
    levelCount: 2,
    startDate: '2026-10-05',
    manufacturer: '罗氏诊断 (Roche Diagnostics)',
    status: '在用',
    levels: [
      { id: 'lvl-cb1', level: 1, lotNo: '202610A08', expiryDate: '2027-06-30', sampleNo: '501', status: '在用', operator: '林德胜' },
      { id: 'lvl-cb2', level: 2, lotNo: '202610A09', expiryDate: '2027-06-30', sampleNo: '502', status: '在用', operator: '林德胜' },
    ],
    items: [
      {
        code: 'cTnI',
        name: '超敏肌钙蛋白I (hs-cTnI)',
        valueType: '靶值标准差',
        unit: 'pg/mL',
        levelTargets: [
          { level: 1, target: 24.5, sd: 1.10, cv: 4.49, allowableCv: 6.0 },
          { level: 2, target: 350.0, sd: 12.5, cv: 3.57, allowableCv: 5.0 },
        ],
      },
      {
        code: 'NT-proBNP',
        name: 'N端脑钠肽前体',
        valueType: '靶值标准差',
        unit: 'pg/mL',
        levelTargets: [
          { level: 1, target: 125.0, sd: 4.80, cv: 3.84, allowableCv: 5.5 },
          { level: 2, target: 1450.0, sd: 45.0, cv: 3.10, allowableCv: 4.8 },
        ],
      },
    ],
    rules: INITIAL_WESTGARD_RULES,
  },
];

export type QcRuleType = 'N-Xs' | 'R_Xs' | 'N_T' | 'N_X' | '(M of N)Xs';
export type QcRuleSeverity = '警告' | '阻断失控';
export type QcRuleErrorType = '随机误差(RE)' | '系统误差(SE)' | '告警审查';

export interface QcRuleDefinition {
  id: string;
  code: string;
  name: string;
  ruleType: QcRuleType;
  paramN?: number;
  paramX?: number;
  paramM?: number;
  paramDisplay: string;
  severity: QcRuleSeverity;
  errorType: QcRuleErrorType;
  applicableLevels: string;
  description: string;
  hospitalUnit: string;
  operator: string;
  updateTime: string;
  status: '在用' | '停用';
}

export const INITIAL_QC_RULE_DEFINITIONS: QcRuleDefinition[] = [
  {
    id: 'rule-01',
    code: '01',
    name: '1-2s',
    ruleType: 'N-Xs',
    paramN: 1,
    paramX: 2.0,
    paramDisplay: 'N=1 X=2',
    severity: '警告',
    errorType: '告警审查',
    applicableLevels: '多水平通用',
    description: '1个质控测定值偏离均值超过±2SD。作为告警审查启动规则，不直接拒收批次，需进一步检查其他规则判定。',
    hospitalUnit: '中心医院',
    operator: '张珊',
    updateTime: '2026-10-29 08:30:12',
    status: '在用',
  },
  {
    id: 'rule-02',
    code: '02',
    name: '1-3s',
    ruleType: 'N-Xs',
    paramN: 1,
    paramX: 3.0,
    paramDisplay: 'N=1 X=3',
    severity: '阻断失控',
    errorType: '随机误差(RE)',
    applicableLevels: '多水平通用',
    description: '1个质控测定结果超过均值±3SD控制限，提示发生显著随机误差或极大系统漂移，判定为失控，阻断当前批次报告发放。',
    hospitalUnit: '中心医院',
    operator: '蔡文斌',
    updateTime: '2026-10-29 08:31:05',
    status: '在用',
  },
  {
    id: 'rule-03',
    code: '03',
    name: '2-2s',
    ruleType: 'N-Xs',
    paramN: 2,
    paramX: 2.0,
    paramDisplay: 'N=2 X=2',
    severity: '阻断失控',
    errorType: '系统误差(SE)',
    applicableLevels: '多水平通用',
    description: '连续2个同水平质控测定结果，或同批2个不同水平质控结果同时超过+2SD或同时低于-2SD控制限，判定为系统误差失控。',
    hospitalUnit: '中心医院',
    operator: '蔡文斌',
    updateTime: '2026-10-29 08:32:18',
    status: '在用',
  },
  {
    id: 'rule-04',
    code: '04',
    name: 'R-4s',
    ruleType: 'R_Xs',
    paramX: 4.0,
    paramDisplay: 'X=4',
    severity: '阻断失控',
    errorType: '随机误差(RE)',
    applicableLevels: '双水平(高/低)',
    description: '同批测定中，两个水平质控测定值之差达到或超过4倍标准差(如高水平+2.1s且低水平-2.0s)，判定为批内随机误差失控。',
    hospitalUnit: '中心医院',
    operator: '蔡文斌',
    updateTime: '2026-10-29 08:33:40',
    status: '在用',
  },
  {
    id: 'rule-05',
    code: '05',
    name: '4-1s',
    ruleType: 'N-Xs',
    paramN: 4,
    paramX: 1.0,
    paramDisplay: 'N=4 X=1',
    severity: '阻断失控',
    errorType: '系统误差(SE)',
    applicableLevels: '多水平通用',
    description: '连续4个质控测定结果均偏离均值同侧超过1倍标准差(>+1SD或<-1SD)，提示分析系统存在渐进性系统误差漂移。',
    hospitalUnit: '中心医院',
    operator: '张珊',
    updateTime: '2026-10-29 08:35:00',
    status: '在用',
  },
  {
    id: 'rule-06',
    code: '06',
    name: '10-X',
    ruleType: 'N_X',
    paramN: 10,
    paramDisplay: 'N=10 均值同侧',
    severity: '阻断失控',
    errorType: '系统误差(SE)',
    applicableLevels: '多水平通用',
    description: '连续10个质控测定结果均落在均值(Mean)的同一侧，表明分析方法存在持续性系统偏移(Bias)，需重新定标校准。',
    hospitalUnit: '中心医院',
    operator: '陈志远',
    updateTime: '2026-10-29 08:36:22',
    status: '在用',
  },
  {
    id: 'rule-07',
    code: '07',
    name: '7-T',
    ruleType: 'N_T',
    paramN: 7,
    paramDisplay: 'N=7 单向趋势',
    severity: '警告',
    errorType: '系统误差(SE)',
    applicableLevels: '多水平通用',
    description: '连续7个质控测定结果呈现持续递增或持续递减的单向趋势，通常提示试剂逐渐变质、校准品退化或光源灯衰减。',
    hospitalUnit: '中心医院',
    operator: '林德胜',
    updateTime: '2026-10-29 08:37:45',
    status: '在用',
  },
  {
    id: 'rule-08',
    code: '08',
    name: '2 of 3 2s',
    ruleType: '(M of N)Xs',
    paramN: 3,
    paramM: 2,
    paramX: 2.0,
    paramDisplay: 'N=3 M=2 X=2',
    severity: '阻断失控',
    errorType: '系统误差(SE)',
    applicableLevels: '三水平',
    description: '连续3次测定中，有2个测定值超过均值±2SD控制限，在三水平质控监控中判定为系统误差失控拒收。',
    hospitalUnit: '中心医院',
    operator: '黄雅芳',
    updateTime: '2026-10-29 08:38:50',
    status: '在用',
  },
  {
    id: 'rule-09',
    code: '09',
    name: '3-1s',
    ruleType: 'N-Xs',
    paramN: 3,
    paramX: 1.0,
    paramDisplay: 'N=3 X=1',
    severity: '警告',
    errorType: '系统误差(SE)',
    applicableLevels: '三水平',
    description: '连续3个质控结果同时超过+1SD或-1SD，预警三水平试剂或校准微量偏移。',
    hospitalUnit: '中心医院',
    operator: '蔡文斌',
    updateTime: '2026-10-29 08:40:10',
    status: '停用',
  },
  {
    id: 'rule-10',
    code: '10',
    name: '6-X',
    ruleType: 'N_X',
    paramN: 6,
    paramDisplay: 'N=6 均值同侧',
    severity: '警告',
    errorType: '系统误差(SE)',
    applicableLevels: '多水平通用',
    description: '连续6个质控测定结果连续落在均值同一侧，敏感度高但假报警率较高，作为灵敏告警备选规则。',
    hospitalUnit: '中心医院',
    operator: '张珊',
    updateTime: '2026-10-29 08:41:30',
    status: '停用',
  },
];

