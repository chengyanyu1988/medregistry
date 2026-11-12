export type RuleCategory =
  | '编码规则'
  | '审核规则'
  | 'TAT规则'
  | '传染病规则'
  | '质控规则';

export interface SamplingGroupDetail {
  applyCode: string;
  applyName: string;
}

export interface CombinedSamplingGroup {
  id: string;
  groupName: string;
  container: string;
  containerColor: string;
  specimenType: string;
  status: '启用' | '停用';
  details: SamplingGroupDetail[];
}

export interface AutoAuditRule {
  id: string;
  ruleCode: string;
  ruleName: string;
  group: string;
  logicCondition: string;
  triggerAction: string;
  status: '启用' | '停用';
  updateTime: string;
  operator: string;
}

export interface TatRule {
  id: string;
  ruleCode: string;
  testCategory: string;
  patientType: '门诊' | '住院' | '急诊';
  receiveToRunMinutes: number;
  runToAuditMinutes: number;
  maxTatMinutes: number;
  status: '启用' | '停用';
  updateTime: string;
  operator: string;
}

export interface InfectiousRule {
  id: string;
  diseaseName: string;
  positiveCondition: string;
  autoReportCdc: '是' | '否';
  isolationAdvice: string;
  status: '启用' | '停用';
  updateTime: string;
  operator: string;
}

export interface QcRuleConfig {
  id: string;
  ruleName: string;
  ruleType: '警告' | '失控' | '趋势';
  logicDescription: string;
  blockRun: '是' | '否';
  status: '启用' | '停用';
  updateTime: string;
  operator: string;
}

export const INITIAL_BARCODE_CONFIG = {
  prefix: 'LSM',
  sequenceLength: 6,
  formatContent: '年月日+顺序号' as '顺序号' | '年月日+顺序号' | '年月+顺序号' | '年+顺序号',
};

export const INITIAL_SAMPLING_GROUPS: CombinedSamplingGroup[] = [
  {
    id: 'sg-01',
    groupName: '肝功生化合并采血组',
    container: '黄头管(促凝胶SST 4ml)',
    containerColor: 'bg-amber-500',
    specimenType: '血清',
    status: '启用',
    details: [
      { applyCode: '02121', applyName: '肝功能常规五项' },
      { applyCode: '02321', applyName: '肝功能七项组合' },
      { applyCode: '02325', applyName: '血清总蛋白与白蛋白' },
    ],
  },
  {
    id: 'sg-02',
    groupName: '肾功及电解质合并组',
    container: '黄头管(促凝胶SST 4ml)',
    containerColor: 'bg-amber-500',
    specimenType: '血清',
    status: '启用',
    details: [
      { applyCode: '03101', applyName: '肾功能三项' },
      { applyCode: '03105', applyName: '电解质六项组合' },
    ],
  },
  {
    id: 'sg-03',
    groupName: '全血细胞分析采血组',
    container: '紫头管(EDTA-K2 2ml)',
    containerColor: 'bg-purple-600',
    specimenType: '全血',
    status: '启用',
    details: [
      { applyCode: '01001', applyName: '血常规五分类' },
      { applyCode: '01005', applyName: '网织红细胞计数' },
    ],
  },
  {
    id: 'sg-04',
    groupName: '凝血功能四项采样组',
    container: '蓝头管(枸橼酸钠 2.7ml)',
    containerColor: 'bg-sky-500',
    specimenType: '血浆',
    status: '启用',
    details: [
      { applyCode: '04001', applyName: '凝血常规四项' },
      { applyCode: '04003', applyName: 'D-二聚体定量测定' },
    ],
  },
  {
    id: 'sg-05',
    groupName: '急诊心肌坏死标志物采样组',
    container: '绿头管(肝素锂 3ml)',
    containerColor: 'bg-emerald-600',
    specimenType: '血浆',
    status: '启用',
    details: [
      { applyCode: '05001', applyName: '急诊高敏肌钙蛋白I' },
      { applyCode: '05002', applyName: '急诊心肌酶谱四项' },
    ],
  },
  {
    id: 'sg-06',
    groupName: '乙肝及感染免疫采样组',
    container: '红头管(普通干燥管 4ml)',
    containerColor: 'bg-rose-500',
    specimenType: '血清',
    status: '启用',
    details: [
      { applyCode: '06001', applyName: '乙型肝炎标志物五项' },
      { applyCode: '06005', applyName: '丙肝抗体 screening' },
    ],
  },
  {
    id: 'sg-07',
    groupName: '尿液常规干化学合并组',
    container: '洁净尿管 (10ml)',
    containerColor: 'bg-yellow-400',
    specimenType: '尿液',
    status: '启用',
    details: [
      { applyCode: '07001', applyName: '尿液干化学十一项' },
      { applyCode: '07002', applyName: '尿沉渣有形成分分析' },
    ],
  },
  {
    id: 'sg-08',
    groupName: '血培养双相采样组',
    container: '双相血培养瓶 (需氧+厌氧)',
    containerColor: 'bg-indigo-600',
    specimenType: '全血',
    status: '启用',
    details: [
      { applyCode: '08001', applyName: '全自动血培养及鉴定' },
    ],
  },
  {
    id: 'sg-09',
    groupName: '糖化血红蛋白采样组',
    container: '紫头管(EDTA-K2 2ml)',
    containerColor: 'bg-purple-600',
    specimenType: '全血',
    status: '启用',
    details: [
      { applyCode: '09001', applyName: '糖化血红蛋白 HbA1c' },
    ],
  },
  {
    id: 'sg-10',
    groupName: '动脉血气分析采样组',
    container: '肝素化血气针 (2ml)',
    containerColor: 'bg-red-600',
    specimenType: '动脉血',
    status: '启用',
    details: [
      { applyCode: '10001', applyName: '动脉血气分析全套' },
    ],
  },
];

export const INITIAL_AUTO_AUDIT_RULES: AutoAuditRule[] = [
  {
    id: 'ar-01',
    ruleCode: 'AUDIT-001',
    ruleName: '常规生化指标双向区间自动复核',
    group: '生化',
    logicCondition: '结果在生物参考区间内 AND 质控在控 (符合1_2s) AND Delta Check < 20%',
    triggerAction: '系统自动审签通过并发布报告',
    status: '启用',
    updateTime: '2026-10-29 09:10:00',
    operator: '张珊',
  },
  {
    id: 'ar-02',
    ruleCode: 'AUDIT-002',
    ruleName: '危急值极限触发自动阻断规则',
    group: '临检/生化',
    logicCondition: '结果 >= 危急值高限 OR 结果 <= 危急值低限',
    triggerAction: '阻断发布，触发急诊声光警报并要求人工重跑',
    status: '启用',
    updateTime: '2026-10-29 08:30:00',
    operator: '蔡文斌',
  },
  {
    id: 'ar-03',
    ruleCode: 'AUDIT-003',
    ruleName: '历史突变 (Delta Check) 逻辑校验',
    group: '生化/免疫',
    logicCondition: 'ABS(当前结果 - 24h历史结果)/历史结果 > 50%',
    triggerAction: '标记 Delta Check 异常，强制二审医师介入复核',
    status: '启用',
    updateTime: '2026-10-28 14:20:00',
    operator: '陈志远',
  },
  {
    id: 'ar-04',
    ruleCode: 'AUDIT-004',
    ruleName: '血常规 WBC/PLT 极限比对规则',
    group: '临检',
    logicCondition: 'WBC < 2.0x10^9/L OR PLT < 30x10^9/L',
    triggerAction: '提示推片复核，阻断自动审核',
    status: '启用',
    updateTime: '2026-10-28 11:10:00',
    operator: '林德胜',
  },
  {
    id: 'ar-05',
    ruleCode: 'AUDIT-005',
    ruleName: '凝血常规 PT/APTT 比值逻辑校验',
    group: '凝血',
    logicCondition: 'PT > 20秒 OR APTT > 60秒',
    triggerAction: '自动提示排查肝素污染或凝血因子缺乏',
    status: '启用',
    updateTime: '2026-10-27 15:00:00',
    operator: '黄雅芳',
  },
  {
    id: 'ar-06',
    ruleCode: 'AUDIT-006',
    ruleName: '传染病初筛阳性双试剂复核规则',
    group: '免疫',
    logicCondition: 'HBsAg >= 1.0 COI OR Anti-HCV >= 1.0 COI',
    triggerAction: '触发同样本双试剂二次复测',
    status: '启用',
    updateTime: '2026-10-27 10:20:00',
    operator: '徐晓丽',
  },
  {
    id: 'ar-07',
    ruleCode: 'AUDIT-007',
    ruleName: '阴阳离子间隙 (AG) 逻辑平衡规则',
    group: '生化',
    logicCondition: 'AG = Na - (Cl + HCO3) > 20 mmol/L',
    triggerAction: '提示代谢性酸中毒怀疑，标记提醒',
    status: '启用',
    updateTime: '2026-10-26 16:10:00',
    operator: '刘洋',
  },
  {
    id: 'ar-08',
    ruleCode: 'AUDIT-008',
    ruleName: '总蛋白与白蛋白倒置逻辑校验',
    group: '生化',
    logicCondition: 'ALB > TP',
    triggerAction: '拦截报错：试剂错加或计算公式倒置',
    status: '启用',
    updateTime: '2026-10-26 09:40:00',
    operator: '赵海琴',
  },
  {
    id: 'ar-09',
    ruleCode: 'AUDIT-009',
    ruleName: '尿蛋白与尿沉渣RBC比对校验',
    group: '临检',
    logicCondition: '尿PRO强阳性 (+++) AND 沉渣RBC == 0',
    triggerAction: '提示离心沉渣显微镜人工镜检确认',
    status: '启用',
    updateTime: '2026-10-25 13:20:00',
    operator: '张珊',
  },
  {
    id: 'ar-10',
    ruleCode: 'AUDIT-010',
    ruleName: '血清钾与标本溶血程度联动校验',
    group: '生化',
    logicCondition: '标本外观察觉重度溶血 AND 血钾 > 5.5 mmol/L',
    triggerAction: '自动追加备注“标本重度溶血可致血钾假性偏高”',
    status: '启用',
    updateTime: '2026-10-25 10:00:00',
    operator: '蔡文斌',
  },
];

export const INITIAL_TAT_RULES: TatRule[] = [
  {
    id: 'tat-01',
    ruleCode: 'TAT-EMG-01',
    testCategory: '急诊生化/心肌标志物',
    patientType: '急诊',
    receiveToRunMinutes: 10,
    runToAuditMinutes: 15,
    maxTatMinutes: 30,
    status: '启用',
    updateTime: '2026-10-29 08:50:00',
    operator: '张珊',
  },
  {
    id: 'tat-02',
    ruleCode: 'TAT-EMG-02',
    testCategory: '急诊血常规及凝血',
    patientType: '急诊',
    receiveToRunMinutes: 5,
    runToAuditMinutes: 10,
    maxTatMinutes: 20,
    status: '启用',
    updateTime: '2026-10-29 08:55:00',
    operator: '蔡文斌',
  },
  {
    id: 'tat-03',
    ruleCode: 'TAT-OUT-01',
    testCategory: '门诊常规生化',
    patientType: '门诊',
    receiveToRunMinutes: 30,
    runToAuditMinutes: 60,
    maxTatMinutes: 120,
    status: '启用',
    updateTime: '2026-10-28 15:00:00',
    operator: '陈志远',
  },
  {
    id: 'tat-04',
    ruleCode: 'TAT-OUT-02',
    testCategory: '门诊免疫发光项目',
    patientType: '门诊',
    receiveToRunMinutes: 45,
    runToAuditMinutes: 90,
    maxTatMinutes: 180,
    status: '启用',
    updateTime: '2026-10-28 11:30:00',
    operator: '林德胜',
  },
  {
    id: 'tat-05',
    ruleCode: 'TAT-INP-01',
    testCategory: '住院病区常规生化',
    patientType: '住院',
    receiveToRunMinutes: 60,
    runToAuditMinutes: 120,
    maxTatMinutes: 240,
    status: '启用',
    updateTime: '2026-10-27 14:10:00',
    operator: '黄雅芳',
  },
  {
    id: 'tat-06',
    ruleCode: 'TAT-INP-02',
    testCategory: '住院病区细菌培养',
    patientType: '住院',
    receiveToRunMinutes: 120,
    runToAuditMinutes: 2880,
    maxTatMinutes: 4320,
    status: '启用',
    updateTime: '2026-10-27 09:00:00',
    operator: '徐晓丽',
  },
  {
    id: 'tat-07',
    ruleCode: 'TAT-EMG-03',
    testCategory: '急诊动脉血气分析',
    patientType: '急诊',
    receiveToRunMinutes: 3,
    runToAuditMinutes: 7,
    maxTatMinutes: 15,
    status: '启用',
    updateTime: '2026-10-26 16:30:00',
    operator: '刘洋',
  },
  {
    id: 'tat-08',
    ruleCode: 'TAT-OUT-03',
    testCategory: '门诊尿液干化学',
    patientType: '门诊',
    receiveToRunMinutes: 15,
    runToAuditMinutes: 15,
    maxTatMinutes: 45,
    status: '启用',
    updateTime: '2026-10-26 10:20:00',
    operator: '赵海琴',
  },
  {
    id: 'tat-09',
    ruleCode: 'TAT-INP-03',
    testCategory: '住院肿瘤标志物全套',
    patientType: '住院',
    receiveToRunMinutes: 90,
    runToAuditMinutes: 180,
    maxTatMinutes: 360,
    status: '启用',
    updateTime: '2026-10-25 11:40:00',
    operator: '张珊',
  },
  {
    id: 'tat-10',
    ruleCode: 'TAT-EMG-04',
    testCategory: '急诊降钙素原(PCT)',
    patientType: '急诊',
    receiveToRunMinutes: 15,
    runToAuditMinutes: 25,
    maxTatMinutes: 45,
    status: '启用',
    updateTime: '2026-10-25 09:15:00',
    operator: '蔡文斌',
  },
];

export const INITIAL_INFECTIOUS_RULES: InfectiousRule[] = [
  {
    id: 'inf-01',
    diseaseName: '乙型病毒性肝炎 (HBsAg)',
    positiveCondition: 'HBsAg >= 1.0 COI',
    autoReportCdc: '是',
    isolationAdvice: '遵循血液与体液隔离规范，建议提示临床补充HBV-DNA',
    status: '启用',
    updateTime: '2026-10-29 09:00:00',
    operator: '张珊',
  },
  {
    id: 'inf-02',
    diseaseName: '丙型病毒性肝炎 (Anti-HCV)',
    positiveCondition: 'Anti-HCV >= 1.0 COI',
    autoReportCdc: '是',
    isolationAdvice: '血液防护隔离，建议补充HCV-RNA定量确认',
    status: '启用',
    updateTime: '2026-10-29 09:05:00',
    operator: '蔡文斌',
  },
  {
    id: 'inf-03',
    diseaseName: '获得性免疫缺陷综合征 (HIV 1+2抗体)',
    positiveCondition: 'HIV-Ag/Ab 初筛反应性 (>= 1.0 COI)',
    autoReportCdc: '是',
    isolationAdvice: '严格标准防护，样品原管封存，送疾控中心确证实验室',
    status: '启用',
    updateTime: '2026-10-28 14:00:00',
    operator: '陈志远',
  },
  {
    id: 'inf-04',
    diseaseName: '梅毒螺旋体感染 (TP-Ab)',
    positiveCondition: 'TP-Ab 特异性抗体阳性',
    autoReportCdc: '是',
    isolationAdvice: '接触防护，建议加做 RPR/TRUST 定滴度试验',
    status: '启用',
    updateTime: '2026-10-28 10:30:00',
    operator: '林德胜',
  },
  {
    id: 'inf-05',
    diseaseName: '多重耐药菌 (MRSA/VRE/CRE)',
    positiveCondition: '分离出耐甲氧西林金黄色葡萄球菌/耐碳青霉烯类肠杆菌',
    autoReportCdc: '是',
    isolationAdvice: '单间单人接触隔离，病区佩戴防护服与手套',
    status: '启用',
    updateTime: '2026-10-27 16:20:00',
    operator: '黄雅芳',
  },
  {
    id: 'inf-06',
    diseaseName: '活动性结核分枝杆菌',
    positiveCondition: '痰涂片抗酸染色阳性 OR TB-DNA 阳性',
    autoReportCdc: '是',
    isolationAdvice: '空气隔离与呼吸道防护，负压病房观察',
    status: '启用',
    updateTime: '2026-10-27 11:00:00',
    operator: '徐晓丽',
  },
  {
    id: 'inf-07',
    diseaseName: '新型冠状病毒 / 流感病毒',
    positiveCondition: '核酸检测 Ct值 < 35 或抗原阳性',
    autoReportCdc: '是',
    isolationAdvice: '飞沫防护隔离，加强病区通风消毒',
    status: '启用',
    updateTime: '2026-10-26 15:40:00',
    operator: '刘洋',
  },
  {
    id: 'inf-08',
    diseaseName: '霍乱弧菌 / 伤寒沙门氏菌',
    positiveCondition: '粪便培养分离出霍乱弧菌或伤寒杆菌',
    autoReportCdc: '是',
    isolationAdvice: '消化道严格隔离，饮水与食品安全追踪',
    status: '启用',
    updateTime: '2026-10-26 09:20:00',
    operator: '赵海琴',
  },
  {
    id: 'inf-09',
    diseaseName: '布鲁氏菌',
    positiveCondition: '血培养或骨髓培养分离出布鲁氏菌',
    autoReportCdc: '是',
    isolationAdvice: '生物安全二级防护，防气溶胶吸入',
    status: '启用',
    updateTime: '2026-10-25 14:10:00',
    operator: '张珊',
  },
  {
    id: 'inf-10',
    diseaseName: '手足口病 (EV71病毒)',
    positiveCondition: 'EV71 核酸阳性或 IgM 抗体阳性',
    autoReportCdc: '是',
    isolationAdvice: '儿科接触隔离，玩具及用品高水平消毒',
    status: '启用',
    updateTime: '2026-10-25 10:30:00',
    operator: '蔡文斌',
  },
];

export const INITIAL_QC_RULES: QcRuleConfig[] = [
  {
    id: 'qc-01',
    ruleName: 'Westgard 1_2s 警告规则',
    ruleType: '警告',
    logicDescription: '1个质控测定值超过 ±2s 均值限制，提示警告但不直接阻断批次',
    blockRun: '否',
    status: '启用',
    updateTime: '2026-10-29 08:30:00',
    operator: '张珊',
  },
  {
    id: 'qc-02',
    ruleName: 'Westgard 1_3s 失控规则',
    ruleType: '失控',
    logicDescription: '1个质控测定值超过 ±3s 限制，表明随机误差过大，强制失控阻断',
    blockRun: '是',
    status: '启用',
    updateTime: '2026-10-29 08:35:00',
    operator: '蔡文斌',
  },
  {
    id: 'qc-03',
    ruleName: 'Westgard 2_2s 连续失控规则',
    ruleType: '失控',
    logicDescription: '连续 2 个质控测定值同向超过 ±2s，表明存在系统误差，强制阻断',
    blockRun: '是',
    status: '启用',
    updateTime: '2026-10-28 15:10:00',
    operator: '陈志远',
  },
  {
    id: 'qc-04',
    ruleName: 'Westgard R_4s 极差失控规则',
    ruleType: '失控',
    logicDescription: '同一批内高低 2 个质控测定值之差超过 4s，提示严重随机误差',
    blockRun: '是',
    status: '启用',
    updateTime: '2026-10-28 11:00:00',
    operator: '林德胜',
  },
  {
    id: 'qc-05',
    ruleName: 'Westgard 4_1s 偏移规则',
    ruleType: '失控',
    logicDescription: '连续 4 个质控值同向超过 1s，提示微小系统误差累积',
    blockRun: '是',
    status: '启用',
    updateTime: '2026-10-27 14:30:00',
    operator: '黄雅芳',
  },
  {
    id: 'qc-06',
    ruleName: 'Westgard 10_x 均值单侧偏移',
    ruleType: '趋势',
    logicDescription: '连续 10 个质控测定值落在均值的一侧，提示长期系统漂移',
    blockRun: '否',
    status: '启用',
    updateTime: '2026-10-27 09:40:00',
    operator: '徐晓丽',
  },
  {
    id: 'qc-07',
    ruleName: 'Westgard 7_T 连续上升/下降趋势',
    ruleType: '趋势',
    logicDescription: '连续 7 个质控测定值呈单调上升或下降趋势，提示试剂/光源劣化',
    blockRun: '否',
    status: '启用',
    updateTime: '2026-10-26 16:00:00',
    operator: '刘洋',
  },
  {
    id: 'qc-08',
    ruleName: '西格玛 (六西格玛) 动态质控规则',
    ruleType: '失控',
    logicDescription: '综合变异系数(CV%)与总允许误差(TEa)，对 >= 6σ 项目放宽规则',
    blockRun: '否',
    status: '启用',
    updateTime: '2026-10-26 10:50:00',
    operator: '赵海琴',
  },
  {
    id: 'qc-09',
    ruleName: '质控更换试剂批号自动比对规则',
    ruleType: '警告',
    logicDescription: '更换试剂或质控品批号后，前3次质控结果必须平行比对计算CV%',
    blockRun: '是',
    status: '启用',
    updateTime: '2026-10-25 15:20:00',
    operator: '张珊',
  },
  {
    id: 'qc-10',
    ruleName: '质控有效期临期预警规则',
    ruleType: '警告',
    logicDescription: '质控品瓶开瓶超过 7 天或开封有效期临近时自动提示更换',
    blockRun: '否',
    status: '启用',
    updateTime: '2026-10-25 09:00:00',
    operator: '蔡文斌',
  },
];
