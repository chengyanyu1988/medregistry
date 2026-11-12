export interface InstrumentItem {
  id: string;
  seqNo: string;
  itemCode: string;
  itemName: string;
  englishName: string;
  channelCode: string;
  precision: number;
  testMethod: string;
  unit: string;
  calibrationFreq: string;
  status: '启用' | '停用';
}

export interface OperatingTechnician {
  id: string;
  techId: string;
  name: string;
  title: string;
  department: string;
  certificate: string;
  authDate: string;
  permissions: string[];
  status: '在岗' | '停权';
}

export interface TestInstrument {
  id: string;
  deviceCode: string;
  deviceName: string;
  model: string;
  department: string;
  manufacturer: string;
  supplier: string;
  ipPort: string;
  manager: string;
  purchaseDate: string;
  status: '启用' | '停用';
  itemsCount: number;
  techsCount: number;
  updatedAt: string;
  items: InstrumentItem[];
  technicians: OperatingTechnician[];
}

export const INITIAL_TEST_INSTRUMENTS: TestInstrument[] = [
  {
    id: 'INST-01',
    deviceCode: '124323423423',
    deviceName: 'AU2700全自动生化分析仪',
    model: 'AU2700-012',
    department: '生化组',
    manufacturer: '日本奥林巴斯 (Olympus)',
    supplier: '德州医疗仪器有限公司',
    ipPort: '192.168.10.42:5000',
    manager: '张珊',
    purchaseDate: '2025-06-15',
    status: '启用',
    itemsCount: 18,
    techsCount: 5,
    updatedAt: '2026-10-29 08:30',
    items: [
      { id: 'ITM-01', seqNo: '01', itemCode: '0012', itemName: '钙测定 (Ca)', englishName: 'GA', channelCode: '01', precision: 2, testMethod: '偶氮偶联法', unit: 'mmol/L', calibrationFreq: '每周1次', status: '启用' },
      { id: 'ITM-02', seqNo: '02', itemCode: '0013', itemName: '丙氨酸氨基转移酶', englishName: 'ALT', channelCode: '02', precision: 1, testMethod: 'IFCC速率法', unit: 'U/L', calibrationFreq: '每周1次', status: '启用' },
      { id: 'ITM-03', seqNo: '03', itemCode: '0014', itemName: '天门冬氨酸氨基转移酶', englishName: 'AST', channelCode: '03', precision: 1, testMethod: 'IFCC速率法', unit: 'U/L', calibrationFreq: '每周1次', status: '启用' },
      { id: 'ITM-04', seqNo: '04', itemCode: '0015', itemName: '尿素氮', englishName: 'BUN', channelCode: '04', precision: 2, testMethod: '酶偶联速率法', unit: 'mmol/L', calibrationFreq: '双周1次', status: '启用' },
      { id: 'ITM-05', seqNo: '05', itemCode: '0016', itemName: '肌酐', englishName: 'CREA', channelCode: '05', precision: 1, testMethod: '苦味酸/酶法', unit: 'μmol/L', calibrationFreq: '每周1次', status: '启用' },
      { id: 'ITM-06', seqNo: '06', itemCode: '0017', itemName: '葡萄糖', englishName: 'GLU', channelCode: '06', precision: 2, testMethod: '己糖激酶法', unit: 'mmol/L', calibrationFreq: '每周1次', status: '启用' },
      { id: 'ITM-07', seqNo: '07', itemCode: '0018', itemName: '总胆红素', englishName: 'TBIL', channelCode: '07', precision: 1, testMethod: '氧化钒法', unit: 'μmol/L', calibrationFreq: '双周1次', status: '启用' },
      { id: 'ITM-08', seqNo: '08', itemCode: '0019', itemName: '白蛋白', englishName: 'ALB', channelCode: '08', precision: 1, testMethod: '溴甲酚绿法', unit: 'g/L', calibrationFreq: '每月1次', status: '启用' },
    ],
    technicians: [
      { id: 'TC-01', techId: 'T202601', name: '张珊', title: '主管检验师', department: '生化组', certificate: '生化流水线特级上机资质', authDate: '2026-01-10', permissions: ['标本检测', '定标上机', '质控审核', '日常维护'], status: '在岗' },
      { id: 'TC-02', techId: 'T202602', name: '蔡文斌', title: '资深检验师', department: '生化组', certificate: '大型生化分析仪运维资质', authDate: '2026-02-15', permissions: ['标本检测', '定标上机', '日常维护'], status: '在岗' },
      { id: 'TC-03', techId: 'T202603', name: '陈志远', title: '副主任检验师', department: '检验科', certificate: '全自动分析仪质控责任人', authDate: '2026-01-05', permissions: ['标本检测', '定标上机', '质控审核', '仪器校准'], status: '在岗' },
    ],
  },
  {
    id: 'INST-02',
    deviceCode: '124323423421',
    deviceName: 'AU600全自动生化分析仪',
    model: 'AU600-003',
    department: '免疫组',
    manufacturer: '日本奥林巴斯 (Olympus)',
    supplier: '德州医疗仪器有限公司',
    ipPort: '192.168.10.45:5000',
    manager: '蔡文斌',
    purchaseDate: '2024-11-20',
    status: '停用',
    itemsCount: 12,
    techsCount: 3,
    updatedAt: '2026-10-28 16:45',
    items: [
      { id: 'ITM-21', seqNo: '01', itemCode: '0021', itemName: '免疫球蛋白IgG', englishName: 'IgG', channelCode: '11', precision: 2, testMethod: '免疫比浊法', unit: 'g/L', calibrationFreq: '每月1次', status: '停用' },
      { id: 'ITM-22', seqNo: '02', itemCode: '0022', itemName: '补体C3', englishName: 'C3', channelCode: '12', precision: 2, testMethod: '免疫透射比浊', unit: 'g/L', calibrationFreq: '每月1次', status: '停用' },
    ],
    technicians: [
      { id: 'TC-04', techId: 'T202604', name: '林德胜', title: '主管检验师', department: '免疫组', certificate: '免疫发光仪操作证书', authDate: '2026-03-01', permissions: ['标本检测', '日常维护'], status: '在岗' },
      { id: 'TC-05', techId: 'T202605', name: '黄雅芳', title: '检验师', department: '免疫组', certificate: '基础检验上机资质', authDate: '2026-04-12', permissions: ['标本检测'], status: '在岗' },
    ],
  },
  {
    id: 'INST-03',
    deviceCode: '310982736412',
    deviceName: 'Cobas 8000 (c702+e801) 生化免疫流水线',
    model: 'Cobas8000-A1',
    department: '生化组',
    manufacturer: '瑞士罗氏诊断 (Roche)',
    supplier: '国药控股医疗器械有限公司',
    ipPort: '192.168.10.48:5000',
    manager: '林德胜',
    purchaseDate: '2025-10-08',
    status: '启用',
    itemsCount: 45,
    techsCount: 8,
    updatedAt: '2026-10-29 09:15',
    items: [
      { id: 'ITM-31', seqNo: '01', itemCode: '3001', itemName: '促甲状腺素', englishName: 'TSH', channelCode: 'E01', precision: 3, testMethod: '电化学发光法', unit: 'mIU/L', calibrationFreq: '每月1次', status: '启用' },
      { id: 'ITM-32', seqNo: '02', itemCode: '3002', itemName: '游离三碘甲状腺原氨酸', englishName: 'FT3', channelCode: 'E02', precision: 2, testMethod: '电化学发光法', unit: 'pmol/L', calibrationFreq: '每月1次', status: '启用' },
      { id: 'ITM-33', seqNo: '03', itemCode: '3003', itemName: '游离甲状腺素', englishName: 'FT4', channelCode: 'E03', precision: 2, testMethod: '电化学发光法', unit: 'pmol/L', calibrationFreq: '每月1次', status: '启用' },
      { id: 'ITM-34', seqNo: '04', itemCode: '3004', itemName: '肌钙蛋白I (高敏)', englishName: 'hs-cTnI', channelCode: 'E04', precision: 3, testMethod: '电化学发光法', unit: 'pg/mL', calibrationFreq: '每周1次', status: '启用' },
    ],
    technicians: [
      { id: 'TC-06', techId: 'T202601', name: '张珊', title: '主管检验师', department: '生化组', certificate: 'Cobas 8000流水线高级工程师认证', authDate: '2026-01-10', permissions: ['标本检测', '定标上机', '质控审核', '高级故障排除'], status: '在岗' },
      { id: 'TC-07', techId: 'T202606', name: '徐晓丽', title: '资深检验师', department: '生化组', certificate: '电化学发光专项技术证书', authDate: '2026-02-20', permissions: ['标本检测', '定标上机', '质控审核'], status: '在岗' },
    ],
  },
  {
    id: 'INST-04',
    deviceCode: '582019283741',
    deviceName: 'Alinity ci 整合型全自动生化免疫分析仪',
    model: 'Alinity-ci-02',
    department: '生化组',
    manufacturer: '美国雅培 (Abbott)',
    supplier: '上海建医疗仪器公司',
    ipPort: '192.168.10.51:5000',
    manager: '黄雅芳',
    purchaseDate: '2025-12-01',
    status: '启用',
    itemsCount: 32,
    techsCount: 6,
    updatedAt: '2026-10-27 14:20',
    items: [
      { id: 'ITM-41', seqNo: '01', itemCode: '4001', itemName: '乙型肝炎表面抗原', englishName: 'HBsAg', channelCode: 'A01', precision: 2, testMethod: '微粒子化学发光', unit: 'S/CO', calibrationFreq: '每月1次', status: '启用' },
      { id: 'ITM-42', seqNo: '02', itemCode: '4002', itemName: '丙型肝炎抗体', englishName: 'Anti-HCV', channelCode: 'A02', precision: 2, testMethod: '微粒子化学发光', unit: 'S/CO', calibrationFreq: '每月1次', status: '启用' },
    ],
    technicians: [
      { id: 'TC-08', techId: 'T202605', name: '黄雅芳', title: '检验师', department: '免疫组', certificate: '雅培Alinity专机操作资质', authDate: '2026-03-10', permissions: ['标本检测', '定标上机', '日常维护'], status: '在岗' },
    ],
  },
  {
    id: 'INST-05',
    deviceCode: '918273645012',
    deviceName: 'Sysmex XN-9000 全自动血细胞流水线',
    model: 'XN-9000-01',
    department: '临检组',
    manufacturer: '日本希森美康 (Sysmex)',
    supplier: '华东医疗设备配送中心',
    ipPort: '192.168.10.60:5000',
    manager: '徐晓丽',
    purchaseDate: '2025-08-20',
    status: '启用',
    itemsCount: 26,
    techsCount: 7,
    updatedAt: '2026-10-29 07:50',
    items: [
      { id: 'ITM-51', seqNo: '01', itemCode: '5001', itemName: '白细胞计数', englishName: 'WBC', channelCode: 'X01', precision: 2, testMethod: '半导体激光流式细胞术', unit: '10^9/L', calibrationFreq: '每周1次', status: '启用' },
      { id: 'ITM-52', seqNo: '02', itemCode: '5002', itemName: '红细胞计数', englishName: 'RBC', channelCode: 'X02', precision: 2, testMethod: '鞘流电阻抗法', unit: '10^12/L', calibrationFreq: '每周1次', status: '启用' },
      { id: 'ITM-53', seqNo: '03', itemCode: '5003', itemName: '血红蛋白浓度', englishName: 'HGB', channelCode: 'X03', precision: 1, testMethod: 'SLS血红蛋白法', unit: 'g/L', calibrationFreq: '每周1次', status: '启用' },
      { id: 'ITM-54', seqNo: '04', itemCode: '5004', itemName: '血小板计数', englishName: 'PLT', channelCode: 'X04', precision: 0, testMethod: '鞘流阻抗/荧光法', unit: '10^9/L', calibrationFreq: '每周1次', status: '启用' },
    ],
    technicians: [
      { id: 'TC-09', techId: 'T202606', name: '徐晓丽', title: '资深检验师', department: '临检组', certificate: 'Sysmex血细胞分析技术讲师', authDate: '2026-01-15', permissions: ['标本检测', '定标上机', '质控审核', '血涂片复核'], status: '在岗' },
      { id: 'TC-10', techId: 'T202607', name: '刘洋', title: '检验师', department: '临检组', certificate: '常规血检分析操作资质', authDate: '2026-05-02', permissions: ['标本检测', '日常维护'], status: '在岗' },
    ],
  },
  {
    id: 'INST-06',
    deviceCode: '887612349081',
    deviceName: 'ACL TOP 700 全自动凝血分析仪',
    model: 'ACL-TOP700-01',
    department: '临检组',
    manufacturer: '美国沃芬 (Instrumentation Laboratory)',
    supplier: '北京精医医疗器械',
    ipPort: '192.168.10.65:5000',
    manager: '刘洋',
    purchaseDate: '2025-04-18',
    status: '启用',
    itemsCount: 14,
    techsCount: 4,
    updatedAt: '2026-10-26 11:10',
    items: [
      { id: 'ITM-61', seqNo: '01', itemCode: '6001', itemName: '凝血酶原时间', englishName: 'PT', channelCode: 'C01', precision: 1, testMethod: '凝固法(光学法)', unit: 's', calibrationFreq: '每周1次', status: '启用' },
      { id: 'ITM-62', seqNo: '02', itemCode: '6002', itemName: '活化部分凝血活酶时间', englishName: 'APTT', channelCode: 'C02', precision: 1, testMethod: '凝固法(光学法)', unit: 's', calibrationFreq: '每周1次', status: '启用' },
      { id: 'ITM-63', seqNo: '03', itemCode: '6003', itemName: '纤维蛋白原', englishName: 'FIB', channelCode: 'C03', precision: 2, testMethod: 'Clauss凝固法', unit: 'g/L', calibrationFreq: '每周1次', status: '启用' },
      { id: 'ITM-64', seqNo: '04', itemCode: '6004', itemName: 'D-二聚体', englishName: 'D-Dimer', channelCode: 'C04', precision: 2, testMethod: '乳胶免疫比浊法', unit: 'mg/L FEU', calibrationFreq: '双周1次', status: '启用' },
    ],
    technicians: [
      { id: 'TC-11', techId: 'T202607', name: '刘洋', title: '检验师', department: '临检组', certificate: '血凝专机操作授权证书', authDate: '2026-02-18', permissions: ['标本检测', '定标上机', '日常维护'], status: '在岗' },
    ],
  },
  {
    id: 'INST-07',
    deviceCode: '772109843512',
    deviceName: 'VITEK 2 Compact 全自动细菌鉴定及药敏分析仪',
    model: 'VITEK2-C',
    department: '微生物组',
    manufacturer: '法国梅里埃 (bioMérieux)',
    supplier: '广州科医器材有限公司',
    ipPort: '192.168.10.72:5000',
    manager: '赵海琴',
    purchaseDate: '2025-02-10',
    status: '启用',
    itemsCount: 8,
    techsCount: 5,
    updatedAt: '2026-10-28 10:05',
    items: [
      { id: 'ITM-71', seqNo: '01', itemCode: '7001', itemName: '革兰氏阴性杆菌鉴定卡', englishName: 'GN-ID', channelCode: 'M01', precision: 0, testMethod: '比色法', unit: '%', calibrationFreq: '每月1次', status: '启用' },
      { id: 'ITM-72', seqNo: '02', itemCode: '7002', itemName: '革兰氏阳性球菌药敏卡', englishName: 'GP-AST', channelCode: 'M02', precision: 2, testMethod: '比浊法/MIC测定', unit: 'μg/mL', calibrationFreq: '每月1次', status: '启用' },
    ],
    technicians: [
      { id: 'TC-12', techId: 'T202608', name: '赵海琴', title: '主管检验师', department: '微生物组', certificate: '临床微生物鉴定理化考核证书', authDate: '2026-01-22', permissions: ['标本检测', '定标上机', '质控审核', '药敏专家系统评审'], status: '在岗' },
    ],
  },
  {
    id: 'INST-08',
    deviceCode: '661092837415',
    deviceName: 'MALDI-TOF MS 质谱微生物鉴定仪',
    model: 'Autoflex-MS',
    department: '微生物组',
    manufacturer: '德国布鲁克 (Bruker)',
    supplier: '北京博安科学仪器',
    ipPort: '192.168.10.75:5000',
    manager: '赵海琴',
    purchaseDate: '2025-11-05',
    status: '启用',
    itemsCount: 5,
    techsCount: 3,
    updatedAt: '2026-10-25 15:30',
    items: [
      { id: 'ITM-81', seqNo: '01', itemCode: '8001', itemName: '飞行时间质谱菌种蛋白图谱鉴定', englishName: 'MS-ID', channelCode: 'MS1', precision: 3, testMethod: '飞行时间质谱基质辅助解吸', unit: 'Score', calibrationFreq: '每日1次', status: '启用' },
    ],
    technicians: [
      { id: 'TC-13', techId: 'T202608', name: '赵海琴', title: '主管检验师', department: '微生物组', certificate: '生物质谱上机高级操作资格', authDate: '2026-01-22', permissions: ['标本检测', '定标上机', '日常维护'], status: '在岗' },
    ],
  },
  {
    id: 'INST-09',
    deviceCode: '449102837461',
    deviceName: 'UF-5000 全自动尿液有形成分分析仪',
    model: 'UF-5000',
    department: '临检组',
    manufacturer: '日本希森美康 (Sysmex)',
    supplier: '华东医疗设备配送中心',
    ipPort: '192.168.10.81:5000',
    manager: '刘洋',
    purchaseDate: '2025-07-22',
    status: '启用',
    itemsCount: 15,
    techsCount: 4,
    updatedAt: '2026-10-24 09:40',
    items: [
      { id: 'ITM-91', seqNo: '01', itemCode: '9001', itemName: '尿红细胞形态分析', englishName: 'RBC-Info', channelCode: 'U01', precision: 1, testMethod: '荧光核酸染色流式细胞术', unit: '/μL', calibrationFreq: '每周1次', status: '启用' },
      { id: 'ITM-92', seqNo: '02', itemCode: '9002', itemName: '尿白细胞与细菌定量', englishName: 'WBC/BACT', channelCode: 'U02', precision: 1, testMethod: '荧光流式细胞术', unit: '/μL', calibrationFreq: '每周1次', status: '启用' },
    ],
    technicians: [
      { id: 'TC-14', techId: 'T202607', name: '刘洋', title: '检验师', department: '临检组', certificate: '尿液干化学与沉渣分析考评证', authDate: '2026-02-18', permissions: ['标本检测', '日常维护'], status: '在岗' },
    ],
  },
  {
    id: 'INST-10',
    deviceCode: '331092847510',
    deviceName: 'Bio-Rad Variant II 糖化血红蛋白分析仪',
    model: 'Variant-II',
    department: '生化组',
    manufacturer: '美国伯乐 (Bio-Rad)',
    supplier: '国药控股医疗器械有限公司',
    ipPort: '192.168.10.88:5000',
    manager: '张珊',
    purchaseDate: '2025-03-12',
    status: '启用',
    itemsCount: 3,
    techsCount: 5,
    updatedAt: '2026-10-23 16:15',
    items: [
      { id: 'ITM-101', seqNo: '01', itemCode: '1001', itemName: '糖化血红蛋白 (HbA1c)', englishName: 'HbA1c', channelCode: 'HPLC1', precision: 1, testMethod: '高效液相色谱法 (HPLC)', unit: '%', calibrationFreq: '双周1次', status: '启用' },
    ],
    technicians: [
      { id: 'TC-15', techId: 'T202601', name: '张珊', title: '主管检验师', department: '生化组', certificate: 'HPLC高效液相分析特种许可', authDate: '2026-01-10', permissions: ['标本检测', '定标上机', '质控审核'], status: '在岗' },
    ],
  },
  {
    id: 'INST-11',
    deviceCode: '221098374651',
    deviceName: 'SLAN-96S 全自动荧光定量PCR仪',
    model: 'SLAN-96S',
    department: '分子生物组',
    manufacturer: '上海宏石医疗 (Hongshi)',
    supplier: '上海建医疗仪器公司',
    ipPort: '192.168.10.92:5000',
    manager: '陈志远',
    purchaseDate: '2025-09-30',
    status: '启用',
    itemsCount: 10,
    techsCount: 3,
    updatedAt: '2026-10-29 11:00',
    items: [
      { id: 'ITM-111', seqNo: '01', itemCode: '1101', itemName: '乙型肝炎病毒DNA定量 (HBV-DNA)', englishName: 'HBV-DNA', channelCode: 'PCR1', precision: 2, testMethod: '实时荧光定量PCR', unit: 'IU/mL', calibrationFreq: '每批次', status: '启用' },
      { id: 'ITM-112', seqNo: '02', itemCode: '1102', itemName: '丙型肝炎病毒RNA定量 (HCV-RNA)', englishName: 'HCV-RNA', channelCode: 'PCR2', precision: 2, testMethod: '实时荧光定量PCR', unit: 'IU/mL', calibrationFreq: '每批次', status: '启用' },
    ],
    technicians: [
      { id: 'TC-16', techId: 'T202603', name: '陈志远', title: '副主任检验师', department: '检验科', certificate: '临床基因扩增(PCR)实验室国家级资质', authDate: '2026-01-05', permissions: ['标本检测', '定标上机', '质控审核', '结果签发'], status: '在岗' },
    ],
  },
  {
    id: 'INST-12',
    deviceCode: '110928374620',
    deviceName: 'AQT90 FLEX 快速床旁免疫分析仪',
    model: 'AQT90-POCT',
    department: '急诊组',
    manufacturer: '丹麦雷度 (Radiometer)',
    supplier: '德州医疗仪器有限公司',
    ipPort: '192.168.10.98:5000',
    manager: '蔡文斌',
    purchaseDate: '2024-08-14',
    status: '停用',
    itemsCount: 6,
    techsCount: 2,
    updatedAt: '2026-10-20 14:00',
    items: [
      { id: 'ITM-121', seqNo: '01', itemCode: '1201', itemName: '肌红蛋白 (Myo)', englishName: 'MYO', channelCode: 'P01', precision: 1, testMethod: '时间分辨荧光免疫法', unit: 'ng/mL', calibrationFreq: '每月1次', status: '停用' },
    ],
    technicians: [
      { id: 'TC-17', techId: 'T202602', name: '蔡文斌', title: '资深检验师', department: '生化组', certificate: '急诊POCT床旁检测管理资质', authDate: '2026-02-15', permissions: ['标本检测', '日常维护'], status: '停权' },
    ],
  }
];
