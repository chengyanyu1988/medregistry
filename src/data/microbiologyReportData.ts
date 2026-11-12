export interface ASTDetailItem {
  antibiotic: string; // 抗生素名称 (如: 阿莫西林/克拉维酸)
  method: string; // 测定方法 (K-B / MIC)
  resultValue: string; // 结果数值 (如: 20, <=0.25)
  susceptibility: 'S' | 'I' | 'R' | 'SDD'; // 敏感度: S / I / R / SDD
}

export interface MicrobiologyReportRecord {
  id: string;
  reportType: '涂片报告' | '鉴定报告' | '药敏报告' | '培养鉴定';
  status: '未审' | '已审';
  sampleType: string; // 标本类型 (血液 / 痰液 / 脑脊液 / 尿液 / 脓液)
  testItem: string; // 检验项目 (如: （一般细菌+嗜血杆菌）培养+鉴定+药敏)
  barcode: string; // 采集条码 (0901001)
  patientId: string; // 病案号 / 病人标识 (22040742)
  uniqueId: string; // 唯一编号 (222204061139)
  seqNo: string; // 检验序号 (220407008)
  patientName: string; // 姓名 (张太彬)
  gender: '男' | '女';
  age: string;
  department: string; // 申请科室 (呼吸与危重症医学科一病区)
  bedNo: string; // 床号 (60)
  applyDoctor: string; // 申请医师 (蔡雨君)
  visitType: '住院' | '门诊' | '急诊';
  testInstrument: string; // 检验仪器 (VITEK2 / MALDI-TOF)
  clinicalDiagnosis: string; // 临床诊断 (肺栓塞，左下肢静脉血栓形成，原发性高血压3级 极高危)
  remarks: string; // 备注
  sampleEvaluation: string; // 样本评估 (白细胞>25/LP，上皮细胞<10/LP)
  detectionResult: string; // 检测结果 (肺炎克雷伯氏菌)
  colonyCount: string; // 菌落计数 (2+)
  comments: string; // 评语 / 建议
  reporter: string; // 报告人 / 检验者 (吴朝菊)
  auditor: string; // 审核人 (郭彩霞)
  samplingTime: string; // 采样时间
  receiveTime: string; // 接收时间
  testTime: string; // 检验时间
  reportTime: string; // 报告时间
  isUrgent?: boolean;
  astDetails: ASTDetailItem[];
}

export const INITIAL_MICROBIOLOGY_REPORT_RECORDS: MicrobiologyReportRecord[] = [
  {
    id: 'REP-001',
    reportType: '培养鉴定',
    status: '未审',
    sampleType: '痰液',
    testItem: '（一般细菌+嗜血杆菌）培养+鉴定+药敏',
    barcode: '0901001',
    patientId: '22040742',
    uniqueId: '222204061139',
    seqNo: '220407008',
    patientName: '张太彬',
    gender: '男',
    age: '66岁',
    department: '呼吸与危重症医学科一病区',
    bedNo: '60',
    applyDoctor: '蔡雨君',
    visitType: '住院',
    testInstrument: 'VITEK2',
    clinicalDiagnosis: '肺栓塞，左下肢静脉血栓形成，原发性高血压3级 极高危',
    remarks: '注：敏感:S，中介:I，耐药:R，剂量依赖敏感:SDD；KB单位:mm，MIC单位:ug/ml',
    sampleEvaluation: '白细胞>25/LP，上皮细胞<10/LP (痰标本合格)',
    detectionResult: '肺炎克雷伯氏菌 (Klebsiella pneumoniae)',
    colonyCount: '2+',
    comments: '涂片找到革兰氏阴性杆菌，细菌培养分离出肺炎克雷伯氏菌。建议根据药敏结果选择敏感抗生素。',
    reporter: '吴朝菊',
    auditor: '郭彩霞',
    samplingTime: '2026-10-14 14:51',
    receiveTime: '2026-10-15 08:25',
    testTime: '2026-10-15 08:48',
    reportTime: '2026-10-15 08:40',
    isUrgent: true,
    astDetails: [
      { antibiotic: '阿莫西林/克拉维酸', method: 'K-B', resultValue: '20', susceptibility: 'S' },
      { antibiotic: '头孢唑林', method: 'K-B', resultValue: '22', susceptibility: 'I' },
      { antibiotic: '头孢呋辛钠 (非口服)', method: 'K-B', resultValue: '21', susceptibility: 'S' },
      { antibiotic: '头孢呋辛 (口服)', method: 'K-B', resultValue: '21', susceptibility: 'I' },
      { antibiotic: '头孢哌酮/舒巴坦', method: 'K-B', resultValue: '26', susceptibility: 'S' },
      { antibiotic: '米诺环素', method: 'K-B', resultValue: '16', susceptibility: 'S' },
      { antibiotic: '美罗培南', method: 'K-B', resultValue: '26', susceptibility: 'S' },
      { antibiotic: '亚胺培南', method: 'MIC', resultValue: '<=0.25', susceptibility: 'S' },
      { antibiotic: '阿米卡星', method: 'MIC', resultValue: '<=2.0', susceptibility: 'S' },
      { antibiotic: '左氧氟沙星', method: 'MIC', resultValue: '2.0', susceptibility: 'I' },
    ],
  },
  {
    id: 'REP-002',
    reportType: '涂片报告',
    status: '未审',
    sampleType: '血液',
    testItem: '全自动双瓶血培养及涂片',
    barcode: '0901002',
    patientId: '540093',
    uniqueId: '222204061140',
    seqNo: '220407009',
    patientName: '张立国',
    gender: '男',
    age: '52岁',
    department: '血液内科病区',
    bedNo: '18',
    applyDoctor: '魏明',
    visitType: '住院',
    testInstrument: 'BACT/ALERT 3D',
    clinicalDiagnosis: '粒缺伴发热，败血症待查',
    remarks: '注：血培养报阳紧急通报临床',
    sampleEvaluation: '全血双瓶，需氧瓶阳性',
    detectionResult: '查见革兰氏阳性葡萄球菌，成对或短链排列',
    colonyCount: '阳性',
    comments: '需氧瓶培养 14.5 小时报阳，涂片查见革兰阳性球菌，已口头紧急告知主管医师。',
    reporter: '李晓红',
    auditor: '郭彩霞',
    samplingTime: '2026-10-14 16:30',
    receiveTime: '2026-10-15 08:30',
    testTime: '2026-10-15 09:10',
    reportTime: '2026-10-15 09:15',
    isUrgent: true,
    astDetails: [],
  },
  {
    id: 'REP-003',
    reportType: '鉴定报告',
    status: '未审',
    sampleType: '尿液',
    testItem: '中段尿细菌培养+鉴定',
    barcode: '0901003',
    patientId: '540233',
    uniqueId: '222204061141',
    seqNo: '220407010',
    patientName: '李晓红',
    gender: '女',
    age: '46岁',
    department: '肾内科病区',
    bedNo: '12',
    applyDoctor: '陈医师',
    visitType: '住院',
    testInstrument: 'MALDI-TOF 质谱仪',
    clinicalDiagnosis: '急性肾盂肾炎',
    remarks: '中段无菌留取',
    sampleEvaluation: '尿沉渣白细胞(3+)',
    detectionResult: '大肠埃希菌 (Escherichia coli)',
    colonyCount: '10^5 CFU/mL',
    comments: '质谱得分 2.38，高度可信归属大肠埃希菌。',
    reporter: '刘浩然',
    auditor: '郭彩霞',
    samplingTime: '2026-10-14 18:00',
    receiveTime: '2026-10-15 08:35',
    testTime: '2026-10-15 09:30',
    reportTime: '2026-10-15 09:40',
    isUrgent: false,
    astDetails: [
      { antibiotic: '环丙沙星', method: 'MIC', resultValue: '<=0.25', susceptibility: 'S' },
      { antibiotic: '头孢唑林', method: 'MIC', resultValue: '1.0', susceptibility: 'S' },
      { antibiotic: '复方新诺明', method: 'MIC', resultValue: '>=320', susceptibility: 'R' },
      { antibiotic: '呋喃妥因', method: 'MIC', resultValue: '<=16', susceptibility: 'S' },
    ],
  },
  {
    id: 'REP-004',
    reportType: '涂片报告',
    status: '未审',
    sampleType: '痰液',
    testItem: '结核菌抗酸染色涂片',
    barcode: '0901004',
    patientId: '540233',
    uniqueId: '222204061142',
    seqNo: '220407011',
    patientName: '李晓红',
    gender: '女',
    age: '46岁',
    department: '呼吸与危重症医学科',
    bedNo: '12',
    applyDoctor: '蔡雨君',
    visitType: '住院',
    testInstrument: '显微镜油镜',
    clinicalDiagnosis: '继发性肺结核待排',
    remarks: '冷抗酸染色法',
    sampleEvaluation: '痰液较黏稠',
    detectionResult: '未查到抗酸杆菌 (300个油镜视野未见抗酸阳性菌)',
    colonyCount: '阴性',
    comments: '连续三次抗酸涂片均阴性，建议结合结核T-SPOT或PCR基因检测。',
    reporter: '王思',
    auditor: '郭彩霞',
    samplingTime: '2026-10-15 07:00',
    receiveTime: '2026-10-15 08:40',
    testTime: '2026-10-15 09:45',
    reportTime: '2026-10-15 09:50',
    isUrgent: false,
    astDetails: [],
  },
  {
    id: 'REP-005',
    reportType: '鉴定报告',
    status: '已审',
    sampleType: '脑脊液',
    testItem: '脑脊液细菌与隐球菌鉴定',
    barcode: '0901005',
    patientId: '540231',
    uniqueId: '222204061143',
    seqNo: '220407012',
    patientName: '陈淑珍',
    gender: '女',
    age: '58岁',
    department: '神经外科ICU',
    bedNo: '08',
    applyDoctor: '高主任',
    visitType: '住院',
    testInstrument: 'VITEK2 / 墨汁染色',
    clinicalDiagnosis: '术后颅内感染待查',
    remarks: '脑脊液定量接种',
    sampleEvaluation: '微浑，蛋白升高',
    detectionResult: '表皮葡萄球菌 (Staphylococcus epidermidis)',
    colonyCount: '10^3 CFU/mL',
    comments: '墨汁染色未见带胶质荚膜隐球菌。质谱鉴定为表皮葡萄球菌。',
    reporter: '吴朝菊',
    auditor: '郭彩霞',
    samplingTime: '2026-10-15 07:30',
    receiveTime: '2026-10-15 08:45',
    testTime: '2026-10-15 10:00',
    reportTime: '2026-10-15 10:15',
    isUrgent: true,
    astDetails: [
      { antibiotic: '万古霉素', method: 'MIC', resultValue: '0.5', susceptibility: 'S' },
      { antibiotic: '达托霉素', method: 'MIC', resultValue: '0.25', susceptibility: 'S' },
      { antibiotic: '苯唑西林', method: 'MIC', resultValue: '>=4.0', susceptibility: 'R' },
    ],
  },
  {
    id: 'REP-006',
    reportType: '药敏报告',
    status: '已审',
    sampleType: '脓液',
    testItem: '创面脓液细菌培养及药敏',
    barcode: '0901006',
    patientId: '540244',
    uniqueId: '222204061144',
    seqNo: '220407013',
    patientName: '王建平',
    gender: '男',
    age: '68岁',
    department: '骨科病区',
    bedNo: '22',
    applyDoctor: '刘医师',
    visitType: '住院',
    testInstrument: 'VITEK2 AST-GP67',
    clinicalDiagnosis: '糖尿病足创面感染，多重耐药菌风险',
    remarks: 'MRSA预警',
    sampleEvaluation: '黄绿色脓液标本',
    detectionResult: '金黄色葡萄球菌 (MRSA)',
    colonyCount: '3+',
    comments: '检出耐甲氧西林金黄色葡萄球菌，请院感科密切跟进隔离措施。',
    reporter: '李晓红',
    auditor: '郭彩霞',
    samplingTime: '2026-10-15 08:00',
    receiveTime: '2026-10-15 08:50',
    testTime: '2026-10-15 10:20',
    reportTime: '2026-10-15 10:30',
    isUrgent: true,
    astDetails: [
      { antibiotic: '万古霉素', method: 'MIC', resultValue: '1.0', susceptibility: 'S' },
      { antibiotic: '利奈唑胺', method: 'MIC', resultValue: '2.0', susceptibility: 'S' },
      { antibiotic: '苯唑西林', method: 'MIC', resultValue: '>=8.0', susceptibility: 'R' },
      { antibiotic: '红霉素', method: 'MIC', resultValue: '>=16', susceptibility: 'R' },
      { antibiotic: '克林霉素', method: 'MIC', resultValue: '>=8', susceptibility: 'R' },
    ],
  },
];
