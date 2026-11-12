// 微生物系统 -> 基础设置 -> 检验规则管理数据定义与初始数据
export type MicrobiologyRuleType = '样本号规则' | '审核规则' | '消息规则';

// 检验申请项目
export interface TestApplicationItem {
  id: string;
  code: string;
  name: string;
  category: string;
  specimenType: string;
}

// 样本号规则
export interface ExecutionCondition {
  id: string;
  field: string;
  operator: string;
  value: string;
}

export interface SampleNumberRuleItem {
  id: string;
  appCode: string;
  appName: string;
  prefix: string; // e.g., 'B[yy][MM]', 'T[yy][MM]', 'U[yy][MM][dd]'
  digitCount: number; // e.g., 4, 5
  resetCycle: '日' | '月' | '年' | '永不复位';
  printMode: '不打印' | '立即打印' | '批量打印';
  printCopies: number;
  example: string; // e.g., 'B26100001'
  isEnabled: boolean;
  conditions: ExecutionCondition[];
  operator: string;
  operateTime: string;
  remarks?: string;
}

// 审核规则 (微生物自动审核/复核规则)
export interface AuditRuleItem {
  id: string;
  ruleCode: string;
  ruleName: string;
  targetScope: string;
  conditionDesc: string;
  actionType: '自动免审通过' | '标红拦截人工复审' | '危急值拦截双审' | '多重耐药院感拦截' | '药敏矛盾拦截';
  priority: '高' | '中' | '低';
  isEnabled: boolean;
  operator: string;
  operateTime: string;
  remarks: string;
}

// 消息规则 (微生物危急值、多重耐药与报阳通知规则)
export interface NotificationRuleItem {
  id: string;
  ruleCode: string;
  ruleName: string;
  eventType: '血培养报阳' | '危急值检出' | '多重耐药(CRE/MRSA)' | '特殊致病菌检出' | '无菌体液涂片阳性';
  channels: string[]; // e.g. ['系统强弹窗', '掌上移动LIS', '短信通知']
  targetDepts: string[];
  responseTimeout: string;
  isEnabled: boolean;
  operator: string;
  operateTime: string;
  messageTemplate: string;
}

// 初始检验申请列表 (精准对应截图申请列表并扩充)
export const INITIAL_TEST_APPLICATIONS: TestApplicationItem[] = [
  { id: 'app-1001', code: '1001', name: '痰培养', category: '常规细菌培养', specimenType: '痰液/下呼吸道分泌物' },
  { id: 'app-1002', code: '1002', name: '血培养', category: '无菌体液培养', specimenType: '外周静脉全血' },
  { id: 'app-1003', code: '1003', name: '普通培养', category: '常规细菌培养', specimenType: '各类分泌物/拭子' },
  { id: 'app-1004', code: '1004', name: '痰涂片', category: '直接显微镜检', specimenType: '痰液' },
  { id: 'app-1005', code: '1005', name: '真菌培养及鉴定', category: '真菌学检查', specimenType: '痰液/皮屑/甲屑' },
  { id: 'app-1006', code: '1006', name: '支原体培养及鉴定', category: '特种病原体', specimenType: '泌尿生殖道拭子' },
  { id: 'app-1007', code: '1007', name: '尿培养及菌落计数', category: '泌尿系统培养', specimenType: '中段尿' },
  { id: 'app-1008', code: '1008', name: '脑脊液常规培养', category: '无菌体液培养', specimenType: '脑脊液' },
  { id: 'app-1009', code: '1009', name: '创面脓液分泌物培养', category: '创面外科培养', specimenType: '脓性分泌物' },
  { id: 'app-1010', code: '1010', name: '胸腹水常规增菌培养', category: '无菌体液培养', specimenType: '胸腹水穿刺液' },
  { id: 'app-1011', code: '1011', name: '导管尖端半定量培养', category: '血管内导管', specimenType: '中心静脉导管尖端' },
  { id: 'app-1012', code: '1012', name: '抗酸杆菌快速染色涂片', category: '结核分枝杆菌', specimenType: '晨痰/支气管灌洗液' },
];

// 初始样本号规则 (精准对应截图样本号前缀 B[yy][MM], T[yy][MM] 等，时间2026年10月，真实人名)
export const INITIAL_SAMPLE_NUMBER_RULES: SampleNumberRuleItem[] = [
  {
    id: 'snr-01',
    appCode: '1001',
    appName: '痰培养',
    prefix: 'B[yy][MM]',
    digitCount: 4,
    resetCycle: '日',
    printMode: '不打印',
    printCopies: 1,
    example: 'B26100001',
    isEnabled: true,
    conditions: [
      { id: 'c1', field: '标本类型', operator: '等于', value: '痰液' },
      { id: 'c2', field: '送检科室', operator: '包含', value: '呼吸内科/急诊科/ICU' },
    ],
    operator: '魏明副主任检验师',
    operateTime: '2026-10-25 14:20:18',
    remarks: '痰培养常规接种标本，每日流水自0001号开始重置',
  },
  {
    id: 'snr-02',
    appCode: '1002',
    appName: '血培养',
    prefix: 'T[yy][MM]',
    digitCount: 5,
    resetCycle: '日',
    printMode: '不打印',
    printCopies: 1,
    example: 'T261000001',
    isEnabled: true,
    conditions: [
      { id: 'c3', field: '标本类型', operator: '等于', value: '全血' },
      { id: 'c4', field: '急诊标志', operator: '等于', value: '是' },
    ],
    operator: '李晓红主管检验师',
    operateTime: '2026-10-26 09:35:40',
    remarks: '血培养双侧双瓶专用五位流水号',
  },
  {
    id: 'snr-03',
    appCode: '1003',
    appName: '普通培养',
    prefix: 'P[yy][MM]',
    digitCount: 4,
    resetCycle: '日',
    printMode: '立即打印',
    printCopies: 2,
    example: 'P26100001',
    isEnabled: true,
    conditions: [
      { id: 'c5', field: '就诊类型', operator: '等于', value: '住院' },
    ],
    operator: '刘浩然检验师',
    operateTime: '2026-10-27 11:10:05',
    remarks: '普通拭子与分泌物培养双联打印',
  },
  {
    id: 'snr-04',
    appCode: '1004',
    appName: '痰涂片',
    prefix: 'S[yy][MM][dd]',
    digitCount: 3,
    resetCycle: '日',
    printMode: '不打印',
    printCopies: 1,
    example: 'S261030001',
    isEnabled: true,
    conditions: [
      { id: 'c6', field: '检验项目', operator: '等于', value: '革兰染色痰涂片' },
    ],
    operator: '郭彩霞主任医师',
    operateTime: '2026-10-28 16:05:22',
    remarks: '直接显微镜检按日流水编码',
  },
  {
    id: 'snr-05',
    appCode: '1005',
    appName: '真菌培养及鉴定',
    prefix: 'F[yy][MM]',
    digitCount: 4,
    resetCycle: '月',
    printMode: '不打印',
    printCopies: 1,
    example: 'F26100001',
    isEnabled: true,
    conditions: [
      { id: 'c7', field: '培养周期', operator: '大于等于', value: '7天' },
    ],
    operator: '魏明副主任检验师',
    operateTime: '2026-10-29 08:45:10',
    remarks: '真菌生长缓慢，流水号按月重置',
  },
  {
    id: 'snr-06',
    appCode: '1007',
    appName: '尿培养及菌落计数',
    prefix: 'U[yy][MM]',
    digitCount: 4,
    resetCycle: '日',
    printMode: '批量打印',
    printCopies: 1,
    example: 'U26100001',
    isEnabled: false,
    conditions: [
      { id: 'c8', field: '标本类型', operator: '等于', value: '中段尿' },
    ],
    operator: '王宇轩技师',
    operateTime: '2026-10-29 15:30:00',
    remarks: '门诊批量核收集中贴签',
  },
];

// 初始审核规则 (微生物智能免审与复审拦截)
export const INITIAL_AUDIT_RULES: AuditRuleItem[] = [
  {
    id: 'ar-01',
    ruleCode: 'AR-MICRO-001',
    ruleName: '正常呼吸道菌群无优势菌直接免审发布',
    targetScope: '痰培养 / 咽拭子培养',
    conditionDesc: '培养结果为正常菌群生长 且 无假丝酵母菌或致病菌优势生长 且 临床诊断非重症肺炎',
    actionType: '自动免审通过',
    priority: '高',
    isEnabled: true,
    operator: '郭彩霞主任医师',
    operateTime: '2026-10-27 10:15:22',
    remarks: '大幅降低常规阴性报告人工审核负担，提高出具时效',
  },
  {
    id: 'ar-02',
    ruleCode: 'AR-MICRO-002',
    ruleName: '血培养/脑脊液等无菌体液阳性强制双签复审',
    targetScope: '血培养 / 脑脊液 / 胸腹水 / 关节液',
    conditionDesc: '仪器报阳 或 涂片查见细菌真菌 或 培养检出致病微生物',
    actionType: '危急值拦截双审',
    priority: '高',
    isEnabled: true,
    operator: '魏明副主任检验师',
    operateTime: '2026-10-28 09:30:15',
    remarks: '涉及危急值项目，必须经两名副主任或以上医师双重电子签名确认',
  },
  {
    id: 'ar-03',
    ruleCode: 'AR-MICRO-003',
    ruleName: '多重耐药菌(CRE/CRAB/MRSA/VRE)院感拦截',
    targetScope: '全部临床标本分离菌株',
    conditionDesc: '肠杆菌目耐碳青霉烯类 或 金葡菌耐甲氧西林 或 肠球菌耐万古霉素',
    actionType: '多重耐药院感拦截',
    priority: '高',
    isEnabled: true,
    operator: '李晓红主管检验师',
    operateTime: '2026-10-28 14:50:33',
    remarks: '系统自动拦截并同时推送医院感染管理控制科，必须签署隔离预警批注',
  },
  {
    id: 'ar-04',
    ruleCode: 'AR-MICRO-004',
    ruleName: '细菌固有耐药表型矛盾拦截',
    targetScope: '药敏试验 (AST)',
    conditionDesc: '如肺炎克雷伯菌对氨苄西林判敏感、嗜麦芽窄食单胞菌对碳青霉烯判敏感等矛盾项',
    actionType: '药敏矛盾拦截',
    priority: '高',
    isEnabled: true,
    operator: '郭彩霞主任医师',
    operateTime: '2026-10-29 11:20:00',
    remarks: 'CLSI/EUCAST 规则库强制匹配，防止仪器误判或折点匹配错误报告临床',
  },
  {
    id: 'ar-05',
    ruleCode: 'AR-MICRO-005',
    ruleName: '质谱打分低于2.0分人工显微镜镜检复核',
    targetScope: 'MALDI-TOF 质谱鉴定',
    conditionDesc: '质谱鉴定菌种匹配得分 >= 1.7 且 < 2.0 (仅到属水平可靠)',
    actionType: '标红拦截人工复审',
    priority: '中',
    isEnabled: true,
    operator: '刘浩然检验师',
    operateTime: '2026-10-29 16:40:12',
    remarks: '得分未达种水平确证阈值，需做革兰染色或生化复核',
  },
  {
    id: 'ar-06',
    ruleCode: 'AR-MICRO-006',
    ruleName: '涂片形态与培养鉴定结果矛盾拦截',
    targetScope: '涂片与培养联动核查',
    conditionDesc: '直接涂片查见革兰阳性球菌，但培养检出单纯革兰阴性杆菌且无阳性球菌',
    actionType: '标红拦截人工复审',
    priority: '中',
    isEnabled: false,
    operator: '王宇轩技师',
    operateTime: '2026-10-29 17:15:00',
    remarks: '防止漏检苛养菌或标本混淆，需重新挑菌或重涂片',
  },
];

// 初始消息规则 (微生物危急值、多重耐药与报阳通知规则)
export const INITIAL_NOTIFICATION_RULES: NotificationRuleItem[] = [
  {
    id: 'nr-01',
    ruleCode: 'NR-ALERT-001',
    ruleName: '血培养首次报阳危急值10分钟极速推送',
    eventType: '血培养报阳',
    channels: ['系统强弹窗', '掌上移动LIS', '短信通知'],
    targetDepts: ['送检临床科室', 'ICU病房', '急诊检验值班台'],
    responseTimeout: '10分钟内响应',
    isEnabled: true,
    operator: '李晓红主管检验师',
    operateTime: '2026-10-26 10:12:05',
    messageTemplate: '【血培养危急值】患者 {患者姓名}(床号:{床号}) 标本条码 {条形码} 仪器报阳，报警时间 {报阳时间}，涂片镜检: {涂片结果}，请主管医生迅速处置！',
  },
  {
    id: 'nr-02',
    ruleCode: 'NR-ALERT-002',
    ruleName: '脑脊液隐球菌墨汁染色阳性专项强通知',
    eventType: '无菌体液涂片阳性',
    channels: ['系统强弹窗', '掌上移动LIS'],
    targetDepts: ['神经内科', '感染性疾病科', '临床药学部'],
    responseTimeout: '15分钟内响应',
    isEnabled: true,
    operator: '郭彩霞主任医师',
    operateTime: '2026-10-27 15:45:30',
    messageTemplate: '【脑脊液危急值】患者 {患者姓名} 脑脊液标本涂片查见隐球菌厚荚膜结构，高度怀疑中枢神经系统真菌感染，请紧急评估抗真菌治疗方案！',
  },
  {
    id: 'nr-03',
    ruleCode: 'NR-ALERT-003',
    ruleName: '碳青霉烯类耐药革兰阴性菌(CRE/CRAB)院感联防',
    eventType: '多重耐药(CRE/MRSA)',
    channels: ['掌上移动LIS', '院感专网接口', '系统强弹窗'],
    targetDepts: ['医院感染管理科', '送检病区护士站', '主管医生'],
    responseTimeout: '30分钟内响应',
    isEnabled: true,
    operator: '魏明副主任检验师',
    operateTime: '2026-10-28 11:20:18',
    messageTemplate: '【院感隔离预警】标本号 {样本号} 检出多重耐药菌 {菌株名称}(CRE)，请病区立即执行单间/床边接触隔离，落实洗手消毒措施！',
  },
  {
    id: 'nr-04',
    ruleCode: 'NR-ALERT-004',
    ruleName: '抗酸杆菌快速染色强阳性(3+~4+)结核预警',
    eventType: '特殊致病菌检出',
    channels: ['系统强弹窗', '短信通知'],
    targetDepts: ['呼吸科病区', '结核病防保专员', '门诊接诊室'],
    responseTimeout: '20分钟内响应',
    isEnabled: true,
    operator: '刘浩然检验师',
    operateTime: '2026-10-29 09:05:40',
    messageTemplate: '【结核预警】患者 {患者姓名} 痰涂片抗酸染色查见大量抗酸阳性分枝杆菌(+++)，具较强呼吸道传染性，请安排隔离防护并完善GeneXpert核酸检测！',
  },
  {
    id: 'nr-05',
    ruleCode: 'NR-ALERT-005',
    ruleName: '耐万古霉素肠球菌(VRE)及产超广谱β-内酰胺酶(ESBL)',
    eventType: '多重耐药(CRE/MRSA)',
    channels: ['掌上移动LIS', '系统强弹窗'],
    targetDepts: ['重症医学科', '肾病血液科', '院感办'],
    responseTimeout: '60分钟内响应',
    isEnabled: false,
    operator: '王宇轩技师',
    operateTime: '2026-10-29 14:10:15',
    messageTemplate: '【耐药预警】标本号 {样本号} 检出 {菌株名称} 药敏提示万古霉素耐药(VRE)，请根据抗生素专档目录规范调整用药。',
  },
];
