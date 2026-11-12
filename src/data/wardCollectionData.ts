export interface WardSampleItem {
  id: string;
  barcode: string;
  tubeColor: 'orange' | 'green' | 'purple' | 'blue' | 'red' | 'yellow' | 'black';
  tubeLabel: string;
  tubeSpec: string;
  collectionMethod: string;
  specimen: string;
  testItem: string;
  patientName: string;
  gender: '男' | '女';
  age: string;
  bedNo: string;
  ward: string;
  department: string;
  doctor: string;
  applyTime: string;
  executionDept: string;
  isPrinted: boolean;
  status: 'toPrint' | 'toCollect' | 'toDeliver' | 'rejected' | 'completed';
  rejectReason?: string;
  rejectTime?: string;
  rejectDoctor?: string;
  urgent?: boolean;
}

// 预设科室/病区选项
export const WARD_OPTIONS = [
  '内一科',
  '内二科 (心血管内科)',
  '内三科 (呼吸与危重症)',
  '消化内科',
  '神经内科',
  '普外科',
  '骨科病区',
  'ICU重症监护室',
  '儿科病区',
  '妇产科病区',
];

// 标本类型选项
export const SPECIMEN_OPTIONS = [
  '所有标本',
  '血液',
  '痰液',
  '尿液',
  '粪便',
  '胸腹水',
  '脑脊液',
  '咽拭子',
];

// 采集方式选项
export const COLLECTION_METHOD_OPTIONS = [
  '所有方式',
  '末梢采血',
  '静脉采血',
  '留置针采血',
  '深静脉置管采血',
  '导管引流采集',
  '深咳痰留取',
  '清洁中段尿',
];

// 近期日期生成（当前基准时间 2026-10-26）
export const DEFAULT_START_DATE = '2026-10-26 00:00';
export const DEFAULT_END_DATE = '2026-10-26 23:59';

// 试管颜色与配置元数据
export const TUBE_COLOR_CONFIG: Record<
  WardSampleItem['tubeColor'],
  { dotBg: string; name: string; ringColor: string; capHex: string }
> = {
  orange: {
    dotBg: 'bg-amber-500',
    name: '采血管(促凝胶SST/黄橙盖)',
    ringColor: 'ring-amber-200',
    capHex: '#f59e0b',
  },
  green: {
    dotBg: 'bg-emerald-500',
    name: '采血管(肝素抗凝/绿盖)',
    ringColor: 'ring-emerald-200',
    capHex: '#10b981',
  },
  purple: {
    dotBg: 'bg-purple-500',
    name: '采血管(EDTA-K2/紫盖)',
    ringColor: 'ring-purple-200',
    capHex: '#a855f7',
  },
  blue: {
    dotBg: 'bg-sky-500',
    name: '采血管(枸橼酸钠1:9/浅蓝盖)',
    ringColor: 'ring-sky-200',
    capHex: '#0ea5e9',
  },
  red: {
    dotBg: 'bg-rose-500',
    name: '采血管(普通干燥管/红盖)',
    ringColor: 'ring-rose-200',
    capHex: '#ef4444',
  },
  yellow: {
    dotBg: 'bg-yellow-400',
    name: '尿液标本管/试管',
    ringColor: 'ring-yellow-200',
    capHex: '#eab308',
  },
  black: {
    dotBg: 'bg-slate-700',
    name: '血沉管(枸橼酸钠1:4/黑盖)',
    ringColor: 'ring-slate-300',
    capHex: '#334155',
  },
};

// 初始数据列表（包含真实临床病区患者姓名、近期时间及规范项目）
export const INITIAL_WARD_SAMPLES: WardSampleItem[] = [
  // 1. 对应截图中第一条（真实患者姓名：张梓轩 12岁 1床）
  {
    id: 'WS-2026102601',
    barcode: '26102601001',
    tubeColor: 'orange',
    tubeLabel: '采血管',
    tubeSpec: '促凝胶管 3.0ml',
    collectionMethod: '末梢采血',
    specimen: '血液',
    testItem: '血常规',
    patientName: '张梓轩',
    gender: '男',
    age: '12岁',
    bedNo: '1床',
    ward: '内一科',
    department: '内科',
    doctor: '陈欣欣',
    applyTime: '2026-10-26 10:10:10',
    executionDept: '内科',
    isPrinted: false,
    status: 'toPrint',
    urgent: false,
  },
  // 2. 对应截图中第二条（真实患者姓名：李欣怡 15岁 12床）
  {
    id: 'WS-2026102602',
    barcode: '26102601002',
    tubeColor: 'green',
    tubeLabel: '采血管',
    tubeSpec: '肝素钠抗凝管 4.0ml',
    collectionMethod: '末梢采血',
    specimen: '血液',
    testItem: '痰培养',
    patientName: '李欣怡',
    gender: '女',
    age: '15岁',
    bedNo: '12床',
    ward: '内一科',
    department: '外科',
    doctor: '陈欣欣',
    applyTime: '2026-10-26 10:10:10',
    executionDept: '内科',
    isPrinted: false,
    status: 'toPrint',
    urgent: false,
  },
  // 3. 条码待打印：王建平 (58岁 3床)
  {
    id: 'WS-2026102603',
    barcode: '26102601003',
    tubeColor: 'purple',
    tubeLabel: '采血管',
    tubeSpec: 'EDTA-K2 抗凝管 2.0ml',
    collectionMethod: '静脉采血',
    specimen: '血液',
    testItem: '全血细胞分析+CRP五分类',
    patientName: '王建平',
    gender: '男',
    age: '58岁',
    bedNo: '3床',
    ward: '内一科',
    department: '内科',
    doctor: '李明哲',
    applyTime: '2026-10-26 09:35:42',
    executionDept: '检验科',
    isPrinted: false,
    status: 'toPrint',
    urgent: true,
  },
  // 4. 条码待打印：刘晓涵 (28岁 6床)
  {
    id: 'WS-2026102610',
    barcode: '26102601010',
    tubeColor: 'orange',
    tubeLabel: '采血管',
    tubeSpec: '促凝胶管 3.0ml',
    collectionMethod: '静脉采血',
    specimen: '血液',
    testItem: '甲状腺功能全套五项 (TSH/FT3/FT4)',
    patientName: '刘晓涵',
    gender: '女',
    age: '28岁',
    bedNo: '6床',
    ward: '内一科',
    department: '内科',
    doctor: '陈欣欣',
    applyTime: '2026-10-26 09:40:15',
    executionDept: '检验科',
    isPrinted: false,
    status: 'toPrint',
    urgent: false,
  },
  // 5. 条码待打印：陈俊明 (45岁 9床)
  {
    id: 'WS-2026102611',
    barcode: '26102601011',
    tubeColor: 'blue',
    tubeLabel: '采血管',
    tubeSpec: '枸橼酸钠抗凝管 2.7ml',
    collectionMethod: '静脉采血',
    specimen: '血液',
    testItem: '凝血功能检查 (PT+APTT+FIB+TT)',
    patientName: '陈俊明',
    gender: '男',
    age: '45岁',
    bedNo: '9床',
    ward: '内一科',
    department: '内科',
    doctor: '李明哲',
    applyTime: '2026-10-26 09:48:30',
    executionDept: '检验科',
    isPrinted: false,
    status: 'toPrint',
    urgent: false,
  },
  // 6. 采样确认阶段数据：孙秀珍 (66岁 5床)
  {
    id: 'WS-2026102604',
    barcode: '26102601004',
    tubeColor: 'blue',
    tubeLabel: '采血管',
    tubeSpec: '枸橼酸钠抗凝管 2.7ml',
    collectionMethod: '静脉采血',
    specimen: '血液',
    testItem: '凝血常规四项 + D-二聚体',
    patientName: '孙秀珍',
    gender: '女',
    age: '66岁',
    bedNo: '5床',
    ward: '内一科',
    department: '内科',
    doctor: '王芳',
    applyTime: '2026-10-26 08:45:18',
    executionDept: '检验科',
    isPrinted: true,
    status: 'toCollect',
    urgent: false,
  },
  // 7. 采样确认阶段数据：赵国庆 (49岁 8床)
  {
    id: 'WS-2026102605',
    barcode: '26102601005',
    tubeColor: 'orange',
    tubeLabel: '采血管',
    tubeSpec: '分离胶促凝管 4.0ml',
    collectionMethod: '留置针采血',
    specimen: '血液',
    testItem: '肝肾功能全套十二项+心肌酶',
    patientName: '赵国庆',
    gender: '男',
    age: '49岁',
    bedNo: '8床',
    ward: '内一科',
    department: '内科',
    doctor: '刘建国',
    applyTime: '2026-10-26 08:50:00',
    executionDept: '检验科',
    isPrinted: true,
    status: 'toCollect',
    urgent: false,
  },
  // 8. 采样确认阶段数据：黄文博 (62岁 11床)
  {
    id: 'WS-2026102612',
    barcode: '26102601012',
    tubeColor: 'purple',
    tubeLabel: '采血管',
    tubeSpec: 'EDTA-K2 抗凝管 2.0ml',
    collectionMethod: '静脉采血',
    specimen: '血液',
    testItem: '糖化血红蛋白 (HbA1c) 测定',
    patientName: '黄文博',
    gender: '男',
    age: '62岁',
    bedNo: '11床',
    ward: '内一科',
    department: '内科',
    doctor: '王芳',
    applyTime: '2026-10-26 08:55:20',
    executionDept: '检验科',
    isPrinted: true,
    status: 'toCollect',
    urgent: false,
  },
  // 9. 标本送检阶段数据：周德成 (72岁 16床)
  {
    id: 'WS-2026102606',
    barcode: '26102601006',
    tubeColor: 'orange',
    tubeLabel: '采血管',
    tubeSpec: '分离胶促凝管 4.0ml',
    collectionMethod: '静脉采血',
    specimen: '血液',
    testItem: '降钙素原(PCT) + 白介素-6',
    patientName: '周德成',
    gender: '男',
    age: '72岁',
    bedNo: '16床',
    ward: '内一科',
    department: '内科',
    doctor: '陈欣欣',
    applyTime: '2026-10-26 08:15:30',
    executionDept: '检验科',
    isPrinted: true,
    status: 'toDeliver',
    urgent: true,
  },
  // 10. 标本送检阶段数据：吴海燕 (43岁 20床)
  {
    id: 'WS-2026102607',
    barcode: '26102601007',
    tubeColor: 'green',
    tubeLabel: '采血管',
    tubeSpec: '肝素锂抗凝管 3.0ml',
    collectionMethod: '深静脉置管采血',
    specimen: '血液',
    testItem: '高敏肌钙蛋白I (hs-cTnI)',
    patientName: '吴海燕',
    gender: '女',
    age: '43岁',
    bedNo: '20床',
    ward: '内一科',
    department: '内科',
    doctor: '李明哲',
    applyTime: '2026-10-26 08:20:12',
    executionDept: '急诊检验',
    isPrinted: true,
    status: 'toDeliver',
    urgent: true,
  },
  // 11. 标本送检阶段数据：林美玲 (31岁 22床)
  {
    id: 'WS-2026102608',
    barcode: '26102601008',
    tubeColor: 'yellow',
    tubeLabel: '尿液管',
    tubeSpec: '标准刻度无菌管 10ml',
    collectionMethod: '清洁中段尿',
    specimen: '尿液',
    testItem: '尿液有形成分全自动分析',
    patientName: '林美玲',
    gender: '女',
    age: '31岁',
    bedNo: '22床',
    ward: '内一科',
    department: '内科',
    doctor: '王芳',
    applyTime: '2026-10-26 08:30:05',
    executionDept: '检验科',
    isPrinted: true,
    status: 'toDeliver',
    urgent: false,
  },
  // 12. 标本送检阶段数据：冯兆民 (68岁 25床)
  {
    id: 'WS-2026102613',
    barcode: '26102601013',
    tubeColor: 'green',
    tubeLabel: '采血管',
    tubeSpec: '肝素抗凝管 3.0ml',
    collectionMethod: '静脉采血',
    specimen: '血液',
    testItem: '血电解质六项 (钾/钠/氯/钙/镁/磷)',
    patientName: '冯兆民',
    gender: '男',
    age: '68岁',
    bedNo: '25床',
    ward: '内一科',
    department: '内科',
    doctor: '刘建国',
    applyTime: '2026-10-26 08:35:10',
    executionDept: '检验科',
    isPrinted: true,
    status: 'toDeliver',
    urgent: false,
  },
  // 13. 已拒收阶段数据：钱学林 (54岁 18床，对应右下角提示"有1份标本已拒收")
  {
    id: 'WS-2026102609',
    barcode: '26102601009',
    tubeColor: 'green',
    tubeLabel: '采血管',
    tubeSpec: '肝素抗凝管 3.0ml',
    collectionMethod: '末梢采血',
    specimen: '血液',
    testItem: '血乳酸测定+血气分析',
    patientName: '钱学林',
    gender: '男',
    age: '54岁',
    bedNo: '18床',
    ward: '内一科',
    department: '内科',
    doctor: '陈欣欣',
    applyTime: '2026-10-26 07:50:24',
    executionDept: '检验科',
    isPrinted: true,
    status: 'rejected',
    rejectReason: '采血时止血带结扎过久引起标本溶血，且乳酸测定不符合规范，需重抽',
    rejectTime: '2026-10-26 08:25:40',
    rejectDoctor: '张珊 (主管检验师)',
    urgent: true,
  },
];

// 标本采集指南规范条目（严谨对齐截图及国家临床采血标准）
export const SPECIMEN_GUIDELINES = [
  {
    id: 1,
    title: '1 采血前应核对好姓名和检验项目，明确标本要求。',
    detail: '核对床头卡、手腕带及HIS医嘱，向清醒患者询问姓名，昏迷患者双人查对。',
    keyWord: '身份查对',
  },
  {
    id: 2,
    title: '2 静脉采血时止血带结扎过久，可引起误差：乳酸则不能使用止血带。',
    detail: '结扎时间不宜超过1分钟，否则会造成局部血液浓缩，使钾、乳酸、总蛋白等测定值偏高。',
    keyWord: '止血带禁忌',
  },
  {
    id: 3,
    title: '3 要特别注意采血不能在输液的同侧进行，更应杜绝在输液管内采血。',
    detail: '输液侧血液被药物与液体稀释，且含有高浓度葡萄糖/电解质，会导致严重检验误差。',
    keyWord: '严禁同侧采血',
  },
  {
    id: 4,
    title: '4 血清标本应避免溶血。',
    detail: '溶血会导致细胞内钾、LDH、AST释放，干扰比色分析，标本必须轻柔混匀，防止机械性剧烈振荡。',
    keyWord: '防溶血规范',
  },
  {
    id: 5,
    title: '5 多管采血推荐标准顺序：',
    detail: '血培养瓶 → 枸橼酸钠抗凝管(浅蓝) → 血清促凝管(红/黄) → 肝素抗凝管(绿) → EDTA抗凝管(紫) → 血糖抑制剂管(灰)。',
    keyWord: '采血顺序',
  },
  {
    id: 6,
    title: '6 颠倒混匀操作规范：',
    detail: '采血完毕拔针后立即轻柔颠倒混匀5~8次(180度翻转)，抗凝管切忌用力甩动。',
    keyWord: '颠倒混匀',
  },
];
