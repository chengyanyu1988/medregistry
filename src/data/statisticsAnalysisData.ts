export interface StatisticsRecordItem {
  id: string;
  source: '门诊' | '住院' | '急诊' | '体检';
  barcode: string;
  patientId: string;
  patientName: string;
  gender: '男' | '女';
  age: string;
  sampleType: string;
  department: string;
  diagnosis: string;
  reportTime: string;
  sampleTime: string;
  cultureDescription: string;
  esblStatus: '阳性 (+)' | '阴性 (-)' | '-';
  oxacillinScreen: '耐药 (MRSA)' | '敏感 (MSSA)' | '耐药' | '敏感' | '-';
  doctor: string;
  testItem: string;
  cost: number;
}

export interface TreeCategory {
  id: string;
  label: string;
  badge?: number;
  items: Array<{
    id: string;
    label: string;
    count?: number;
  }>;
}

export const STATISTICS_TREE_CATEGORIES: TreeCategory[] = [
  {
    id: 'work-stats',
    label: '工作',
    badge: 6,
    items: [
      { id: 'work-inspect-items', label: '送检项目', count: 1248 },
      { id: 'work-specimen-class', label: '标本分类', count: 864 },
      { id: 'work-defective-specimen', label: '不合格标本', count: 12 },
      { id: 'work-blood-culture-workload', label: '血培养仪工作量', count: 196 },
      { id: 'work-cost-billing', label: '费用', count: 342 },
      { id: 'work-staff-workload', label: '工作量', count: 1280 },
    ],
  },
  {
    id: 'prof-stats',
    label: '专业',
    badge: 7,
    items: [
      { id: 'prof-bacteria-dist', label: '细菌分布', count: 184 },
      { id: 'prof-drug-sensitivity', label: '药敏', count: 156 },
      { id: 'prof-crisis-stats', label: '危急值', count: 28 },
      { id: 'prof-mdro-stats', label: '多重耐药', count: 19 },
      { id: 'prof-infectious-disease', label: '传染病', count: 14 },
      { id: 'prof-bacteria-result', label: '细菌结果', count: 218 },
      { id: 'prof-sample-contamination', label: '标本污染', count: 5 },
    ],
  },
  {
    id: 'qc-stats',
    label: '质控',
    badge: 2,
    items: [
      { id: 'qc-iqc-stats', label: '室内质控', count: 68 },
      { id: 'qc-eqa-stats', label: '室间质控', count: 24 },
    ],
  },
];

// Original Bacteria Result Records (matching user screenshot)
export const INITIAL_STATISTICS_RECORDS: StatisticsRecordItem[] = [
  {
    id: 'ST-001',
    source: '住院',
    barcode: '0011812170001',
    patientId: '1811301101',
    patientName: '杜文斌',
    gender: '男',
    age: '48岁',
    sampleType: '血液',
    department: '内科 (感染病区)',
    diagnosis: '伤寒合并继发性肺结核',
    reportTime: '2026-10-29 08:35:12',
    sampleTime: '2026-10-29 07:15:00',
    cultureDescription: '血培养48小时报阳，涂片镜检见革兰阴性杆菌 (多重耐药结核分枝杆菌 MDR-TB)',
    esblStatus: '阳性 (+)',
    oxacillinScreen: '耐药 (MRSA)',
    doctor: '张先义',
    testItem: '血培养及药敏测定 (XCGWFL)',
    cost: 168.0,
  },
  {
    id: 'ST-002',
    source: '住院',
    barcode: '0011812170002',
    patientId: '1811301102',
    patientName: '顾雅琴',
    gender: '女',
    age: '62岁',
    sampleType: '痰液',
    department: '呼吸内科',
    diagnosis: '浸润型肺结核复治期，轻度咯血',
    reportTime: '2026-10-29 08:20:10',
    sampleTime: '2026-10-29 07:05:00',
    cultureDescription: '痰涂片抗酸染色查见抗酸杆菌 1+，结核分支杆菌核酸阳性',
    esblStatus: '阴性 (-)',
    oxacillinScreen: '-',
    doctor: '刘建平',
    testItem: '痰液集菌抗酸染色及常规培养',
    cost: 95.0,
  },
  {
    id: 'ST-003',
    source: '急诊',
    barcode: '0011812170012',
    patientId: '1812171143',
    patientName: '陈志强',
    gender: '男',
    age: '42岁',
    sampleType: '血液',
    department: '急诊科 (重症监护EICU)',
    diagnosis: '持续波状热、疑似布鲁氏菌病',
    reportTime: '2026-10-29 08:12:10',
    sampleTime: '2026-10-29 06:40:00',
    cultureDescription: '血培养双瓶均报阳，质谱打靶鉴定评分 2.21 为木鼠布氏杆菌 (Brucella melitensis)',
    esblStatus: '阳性 (+)',
    oxacillinScreen: '-',
    doctor: '蔡雨君',
    testItem: '血培养双侧双套及质谱鉴定',
    cost: 240.0,
  },
  {
    id: 'ST-004',
    source: '住院',
    barcode: '0011812170013',
    patientId: '1812171144',
    patientName: '梁建国',
    gender: '男',
    age: '71岁',
    sampleType: '血清',
    department: '心血管内科',
    diagnosis: '冠心病、高钾血症、慢性肾衰竭',
    reportTime: '2026-10-29 07:55:00',
    sampleTime: '2026-10-29 06:20:00',
    cultureDescription: '生化离子复测高钾危急值确认无溶血，血清肌酐及尿素氮重度升高',
    esblStatus: '-',
    oxacillinScreen: '-',
    doctor: '张先义',
    testItem: '肝肾功能及电解质六项测定 (GZGNCD)',
    cost: 145.0,
  },
  {
    id: 'ST-005',
    source: '门诊',
    barcode: '0011812170025',
    patientId: '1812171150',
    patientName: '林晓芬',
    gender: '女',
    age: '54岁',
    sampleType: '全血',
    department: '急诊科 (胸痛中心)',
    diagnosis: '急性前壁心肌梗死 (STEMI)',
    reportTime: '2026-10-29 08:40:00',
    sampleTime: '2026-10-29 08:10:00',
    cultureDescription: '急查超敏肌钙蛋白I hs-cTnI 18.5 ng/mL，触发国家胸痛中心急性危象预警',
    esblStatus: '-',
    oxacillinScreen: '-',
    doctor: '陈欣欣',
    testItem: '急诊心肌损伤三项 (hs-cTnI/CK-MB/Myo)',
    cost: 180.0,
  },
  {
    id: 'ST-006',
    source: '住院',
    barcode: '0011812170038',
    patientId: '1812171168',
    patientName: '孙德厚',
    gender: '男',
    age: '68岁',
    sampleType: '尿液',
    department: '神经内科',
    diagnosis: '脑梗死恢复期、复杂性尿路感染',
    reportTime: '2026-10-29 08:28:40',
    sampleTime: '2026-10-29 07:30:00',
    cultureDescription: '中段尿定量培养见大量耐碳青霉烯类肺炎克雷伯菌 (CRKP) 生长 >10^5 CFU/mL',
    esblStatus: '阳性 (+)',
    oxacillinScreen: '耐药',
    doctor: '郭建平',
    testItem: '尿培养及药敏试验 (MIC法)',
    cost: 135.0,
  },
  {
    id: 'ST-007',
    source: '住院',
    barcode: '0011812170042',
    patientId: '1812171175',
    patientName: '冯建军',
    gender: '男',
    age: '53岁',
    sampleType: '脑脊液',
    department: '重症医学科 (ICU)',
    diagnosis: '重型颅脑损伤术后合并颅内感染',
    reportTime: '2026-10-29 08:15:30',
    sampleTime: '2026-10-29 07:00:00',
    cultureDescription: '脑脊液培养查见鲍曼不动杆菌 (CRAB)，多重耐药泛耐药株',
    esblStatus: '阳性 (+)',
    oxacillinScreen: '耐药',
    doctor: '蔡建华',
    testItem: '脑脊液常规生化及病原体药敏',
    cost: 210.0,
  },
  {
    id: 'ST-008',
    source: '体检',
    barcode: '0011812170055',
    patientId: '1812171190',
    patientName: '郭丽华',
    gender: '女',
    age: '46岁',
    sampleType: '静脉血',
    department: '健康管理中心',
    diagnosis: '健康体检健康排查',
    reportTime: '2026-10-29 08:10:00',
    sampleTime: '2026-10-29 07:45:00',
    cultureDescription: '常规五分类及生化检验指标正常，无细菌病原体异常生长',
    esblStatus: '阴性 (-)',
    oxacillinScreen: '敏感 (MSSA)',
    doctor: '周敏',
    testItem: '全血细胞五分类及常规生化',
    cost: 85.0,
  },
];

// Generic Table Column Definition
export interface TableColumnDef {
  key: string;
  label: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  isBadge?: boolean;
  isMono?: boolean;
}

// Category Configuration with specialized columns and datasets
export interface CategoryConfig {
  id: string;
  title: string;
  group: string;
  kpiMetrics: Array<{
    label: string;
    value: string;
    subLabel?: string;
    color?: string;
  }>;
  columns: TableColumnDef[];
  rows: Record<string, any>[];
  detailModalTitle?: string;
}

export const CATEGORY_DATA_MAP: Record<string, CategoryConfig> = {
  // 1. 细菌结果 (Default matching screenshot)
  'prof-bacteria-result': {
    id: 'prof-bacteria-result',
    title: '细菌结果',
    group: '专业',
    kpiMetrics: [
      { label: '范围总数', value: '8 条', color: 'text-slate-900' },
      { label: 'ESBL产酶阳性', value: '4 例', subLabel: '50.0%', color: 'text-rose-600' },
      { label: '苯唑西林耐药(MRSA)', value: '3 例', subLabel: '重点监测', color: 'text-amber-600' },
      { label: '检验费用累计', value: '¥ 1,261.00', color: 'text-emerald-700' },
    ],
    columns: [
      { key: 'source', label: '患者来源', isBadge: true },
      { key: 'barcode', label: '条码号', isMono: true },
      { key: 'patientId', label: '患者标识', isMono: true },
      { key: 'patientName', label: '姓名' },
      { key: 'gender', label: '性别', align: 'center' },
      { key: 'age', label: '年龄', align: 'center' },
      { key: 'sampleType', label: '标本' },
      { key: 'department', label: '科室' },
      { key: 'diagnosis', label: '诊断' },
      { key: 'reportTime', label: '报告时间', isMono: true },
      { key: 'sampleTime', label: '采样时间', isMono: true },
      { key: 'cultureDescription', label: '培养描述' },
      { key: 'esblStatus', label: '超广谱β内酰胺酶', align: 'center', isBadge: true },
      { key: 'oxacillinScreen', label: '苯唑西林筛选试验', align: 'center', isBadge: true },
    ],
    rows: INITIAL_STATISTICS_RECORDS,
  },

  // 2. 细菌分布
  'prof-bacteria-dist': {
    id: 'prof-bacteria-dist',
    title: '细菌分布',
    group: '专业',
    kpiMetrics: [
      { label: '累计检出菌株', value: '184 株', color: 'text-slate-900' },
      { label: '首位分离病原菌', value: '肺炎克雷伯菌', subLabel: '25.0%', color: 'text-sky-700' },
      { label: '革兰阴性杆菌占比', value: '68.5%', color: 'text-indigo-700' },
      { label: '真菌检出株数', value: '6 株', subLabel: '3.3%', color: 'text-emerald-700' },
    ],
    columns: [
      { key: 'code', label: '菌株代码', isMono: true },
      { key: 'name', label: '菌株中文名称' },
      { key: 'latinName', label: '拉丁学名' },
      { key: 'sampleOrigin', label: '主要标本来源' },
      { key: 'isolateCount', label: '检出株数', isMono: true, align: 'right' },
      { key: 'percentage', label: '构成比(%)', align: 'center', isBadge: true },
      { key: 'outpatientCount', label: '门诊检出', isMono: true, align: 'right' },
      { key: 'inpatientCount', label: '住院检出', isMono: true, align: 'right' },
      { key: 'icuCount', label: '重症ICU检出', isMono: true, align: 'right' },
      { key: 'mainDepts', label: '主要分布科室' },
    ],
    rows: [
      { id: '1', code: 'BAC-01', name: '肺炎克雷伯菌', latinName: 'Klebsiella pneumoniae', sampleOrigin: '痰液/肺泡灌洗液', isolateCount: 46, percentage: '25.0%', outpatientCount: 8, inpatientCount: 26, icuCount: 12, mainDepts: '呼吸内科、重症医学科(ICU)' },
      { id: '2', code: 'BAC-02', name: '大肠埃希菌', latinName: 'Escherichia coli', sampleOrigin: '中段尿、静脉血液', isolateCount: 38, percentage: '20.7%', outpatientCount: 14, inpatientCount: 20, icuCount: 4, mainDepts: '肾内科、泌尿外科、急诊科' },
      { id: '3', code: 'BAC-03', name: '金黄色葡萄球菌', latinName: 'Staphylococcus aureus', sampleOrigin: '分泌物、静脉血液', isolateCount: 28, percentage: '15.2%', outpatientCount: 6, inpatientCount: 17, icuCount: 5, mainDepts: '骨科创伤中心、普通外科' },
      { id: '4', code: 'BAC-04', name: '铜绿假单胞菌', latinName: 'Pseudomonas aeruginosa', sampleOrigin: '深部痰液、导管尖端', isolateCount: 24, percentage: '13.0%', outpatientCount: 2, inpatientCount: 14, icuCount: 8, mainDepts: '重症医学科(ICU)、神经重症' },
      { id: '5', code: 'BAC-05', name: '鲍曼不动杆菌', latinName: 'Acinetobacter baumannii', sampleOrigin: '脑脊液、血液、创面', isolateCount: 18, percentage: '9.8%', outpatientCount: 0, inpatientCount: 8, icuCount: 10, mainDepts: '重症医学科(ICU)、神经外科' },
      { id: '6', code: 'BAC-06', name: '结核分枝杆菌复合群', latinName: 'Mycobacterium tuberculosis', sampleOrigin: '痰液集菌、支气管刷检', isolateCount: 14, percentage: '7.6%', outpatientCount: 5, inpatientCount: 9, icuCount: 0, mainDepts: '内科(感染病区)、结核科门诊' },
      { id: '7', code: 'BAC-07', name: '屎肠球菌', latinName: 'Enterococcus faecium', sampleOrigin: '清洁留置导尿液', isolateCount: 10, percentage: '5.4%', outpatientCount: 2, inpatientCount: 6, icuCount: 2, mainDepts: '普外科、老年医学科' },
      { id: '8', code: 'BAC-08', name: '白色念珠菌', latinName: 'Candida albicans', sampleOrigin: '口腔咽拭子、尿液', isolateCount: 6, percentage: '3.3%', outpatientCount: 3, inpatientCount: 3, icuCount: 0, mainDepts: '血液内科、肿瘤科' },
    ],
  },

  // 3. 药敏统计
  'prof-drug-sensitivity': {
    id: 'prof-drug-sensitivity',
    title: '药敏统计',
    group: '专业统计',
    kpiMetrics: [
      { label: '测试抗生素种类', value: '24 种', color: 'text-slate-900' },
      { label: '美罗培南敏感率', value: '90.5%', subLabel: '在控指标', color: 'text-emerald-700' },
      { label: '万古霉素敏感率', value: '100.0%', subLabel: '零耐药', color: 'text-emerald-700' },
      { label: '头孢三代耐药率', value: '45.2%', subLabel: 'ESBL驱动', color: 'text-rose-600' },
    ],
    columns: [
      { key: 'name', label: '抗生素通用名' },
      { key: 'abbr', label: '英文缩写', isMono: true },
      { key: 'targetGroup', label: '目标菌属群' },
      { key: 'testedCount', label: '测试株数', isMono: true, align: 'right' },
      { key: 'sensitiveCount', label: '敏感株数(S)', isMono: true, align: 'right' },
      { key: 'sensitiveRate', label: '敏感率(%)', align: 'center', isBadge: true },
      { key: 'resistantCount', label: '耐药株数(R)', isMono: true, align: 'right' },
      { key: 'resistantRate', label: '耐药率(%)', align: 'center', isBadge: true },
      { key: 'clsiRule', label: '参考判定标准' },
    ],
    rows: [
      { id: '1', name: '美罗培南 (Meropenem)', abbr: 'MEM', targetGroup: '肠杆菌目 (Enterobacterales)', testedCount: 84, sensitiveCount: 76, sensitiveRate: '90.5%', resistantCount: 6, resistantRate: '7.1%', clsiRule: 'CLSI M100 Ed.34 (S≤1 / R≥4)' },
      { id: '2', name: '亚胺培南 (Imipenem)', abbr: 'IPM', targetGroup: '肠杆菌目 (Enterobacterales)', testedCount: 84, sensitiveCount: 74, sensitiveRate: '88.1%', resistantCount: 7, resistantRate: '8.3%', clsiRule: 'CLSI M100 Ed.34 (S≤1 / R≥4)' },
      { id: '3', name: '阿莫西林/克拉维酸', abbr: 'AMC', targetGroup: '肠杆菌目 (Enterobacterales)', testedCount: 84, sensitiveCount: 61, sensitiveRate: '72.6%', resistantCount: 18, resistantRate: '21.4%', clsiRule: 'CLSI M100 Ed.34 (S≤8/4 / R≥32/16)' },
      { id: '4', name: '头孢曲松 (Ceftriaxone)', abbr: 'CRO', targetGroup: '肠杆菌目 (Enterobacterales)', testedCount: 84, sensitiveCount: 42, sensitiveRate: '50.0%', resistantCount: 38, resistantRate: '45.2%', clsiRule: 'CLSI M100 Ed.34 (S≤1 / R≥4)' },
      { id: '5', name: '万古霉素 (Vancomycin)', abbr: 'VAN', targetGroup: '葡萄球菌属 (Staphylococcus)', testedCount: 28, sensitiveCount: 28, sensitiveRate: '100.0%', resistantCount: 0, resistantRate: '0.0%', clsiRule: 'CLSI M100 Ed.34 (S≤2 / R≥16)' },
      { id: '6', name: '苯唑西林 (Oxacillin)', abbr: 'OXA', targetGroup: '金黄色葡萄球菌 (MRSA筛查)', testedCount: 28, sensitiveCount: 18, sensitiveRate: '64.3%', resistantCount: 10, resistantRate: '35.7%', clsiRule: 'CLSI M100 Ed.34 (S≤2 / R≥4)' },
      { id: '7', name: '左氧氟沙星 (Levofloxacin)', abbr: 'LEV', targetGroup: '呼吸道病原体通用', testedCount: 65, sensitiveCount: 46, sensitiveRate: '70.8%', resistantCount: 15, resistantRate: '23.1%', clsiRule: 'CLSI M100 Ed.34 (S≤1 / R≥4)' },
      { id: '8', name: '多粘菌素B (Polymyxin B)', abbr: 'PB', targetGroup: '鲍曼不动杆菌及绿脓杆菌', testedCount: 24, sensitiveCount: 23, sensitiveRate: '95.8%', resistantCount: 1, resistantRate: '4.2%', clsiRule: 'EUCAST 2026 (S≤2 / R>2)' },
    ],
  },

  // 4. 危急值统计
  'prof-crisis-stats': {
    id: 'prof-crisis-stats',
    title: '危急值统计',
    group: '专业统计',
    kpiMetrics: [
      { label: '危急值报告总数', value: '28 例', color: 'text-slate-900' },
      { label: '10分钟通报及时率', value: '100.0%', subLabel: '达标', color: 'text-emerald-700' },
      { label: '临床处置闭环率', value: '100.0%', subLabel: '双签闭环', color: 'text-emerald-700' },
      { label: '核心高危科室', value: '心内科/ICU', color: 'text-rose-600' },
    ],
    columns: [
      { key: 'project', label: '危急值监测项目' },
      { key: 'threshold', label: '临床危急值预警阈值' },
      { key: 'totalCount', label: '触发例数', isMono: true, align: 'right' },
      { key: 'inpatientCount', label: '住院部例数', isMono: true, align: 'right' },
      { key: 'emergencyCount', label: '急诊科例数', isMono: true, align: 'right' },
      { key: 'notifyRate', label: '及时通报率', align: 'center', isBadge: true },
      { key: 'closureRate', label: '临床闭环率', align: 'center', isBadge: true },
      { key: 'mainDepts', label: '主要分布科室' },
    ],
    rows: [
      { id: '1', project: '血清钾离子 (K+)', threshold: '< 2.8 或 > 6.2 mmol/L', totalCount: 8, inpatientCount: 5, emergencyCount: 3, notifyRate: '100.0%', closureRate: '100.0%', mainDepts: '心血管内科、肾内科病区' },
      { id: '2', project: '超敏肌钙蛋白I (hs-cTnI)', threshold: '> 0.50 ng/mL (急性心梗预警)', totalCount: 6, inpatientCount: 2, emergencyCount: 4, notifyRate: '100.0%', closureRate: '100.0%', mainDepts: '急诊科(胸痛中心)、CCU' },
      { id: '3', project: '白细胞计数 (WBC)', threshold: '< 1.5 或 > 30.0 ×10^9/L', totalCount: 5, inpatientCount: 4, emergencyCount: 1, notifyRate: '100.0%', closureRate: '100.0%', mainDepts: '血液科、内科感染病区' },
      { id: '4', project: '血小板计数 (PLT)', threshold: '< 20 或 > 1000 ×10^9/L', totalCount: 4, inpatientCount: 3, emergencyCount: 1, notifyRate: '100.0%', closureRate: '100.0%', mainDepts: '血液内科、肿瘤综合病区' },
      { id: '5', project: '血培养快速报阳', threshold: '48小时内仪器双瓶报警报阳', totalCount: 3, inpatientCount: 2, emergencyCount: 1, notifyRate: '100.0%', closureRate: '100.0%', mainDepts: '重症医学科(ICU)、急诊EICU' },
      { id: '6', project: '静脉血糖 (GLU)', threshold: '< 2.2 或 > 22.2 mmol/L', totalCount: 2, inpatientCount: 1, emergencyCount: 1, notifyRate: '100.0%', closureRate: '100.0%', mainDepts: '内分泌科、急诊留观区' },
    ],
  },

  // 5. 多重耐药统计
  'prof-mdro-stats': {
    id: 'prof-mdro-stats',
    title: '多重耐药统计 (MDRO)',
    group: '专业统计',
    kpiMetrics: [
      { label: '多重耐药检出', value: '19 例', color: 'text-slate-900' },
      { label: '院感接触隔离率', value: '100.0%', subLabel: '全部到位', color: 'text-emerald-700' },
      { label: 'CRKP 耐碳青霉烯', value: '3 例', subLabel: '重点防控', color: 'text-rose-600' },
      { label: 'MRSA 耐药葡萄球菌', value: '5 例', color: 'text-amber-600' },
    ],
    columns: [
      { key: 'mdroType', label: '耐药菌类别', isBadge: true },
      { key: 'organism', label: '病原菌全称' },
      { key: 'patientName', label: '患者姓名' },
      { key: 'barcode', label: '条码号', isMono: true },
      { key: 'department', label: '所在科室' },
      { key: 'sampleType', label: '标本类型' },
      { key: 'detectTime', label: '检出时间', isMono: true },
      { key: 'isolationStatus', label: '接触隔离状态', isBadge: true },
      { key: 'riskLevel', label: '院感预警级别', align: 'center', isBadge: true },
    ],
    rows: [
      { id: '1', mdroType: 'ESBLs', organism: '产超广谱β内酰胺酶大肠埃希菌', patientName: '杜文斌', barcode: '0011812170001', department: '内科 (感染病区)', sampleType: '血液', detectTime: '2026-10-29 08:35', isolationStatus: '已下发隔离通知 / 单间隔离', riskLevel: '红色高危' },
      { id: '2', mdroType: 'MRSA', organism: '耐甲氧西林金黄色葡萄球菌', patientName: '孙德厚', barcode: '0011812170038', department: '神经内科病区', sampleType: '尿液', detectTime: '2026-10-29 08:28', isolationStatus: '已床边床头标识 / 专人防护', riskLevel: '橙色中危' },
      { id: '3', mdroType: 'CRKP', organism: '耐碳青霉烯类肺炎克雷伯菌', patientName: '冯建军', barcode: '0011812170042', department: '重症医学科 (ICU)', sampleType: '脑脊液', detectTime: '2026-10-29 08:15', isolationStatus: '负压单间隔离 / 专人专机护理', riskLevel: '紫色极危' },
      { id: '4', mdroType: 'CRAB', organism: '耐碳青霉烯类鲍曼不动杆菌', patientName: '陈志强', barcode: '0011812170012', department: '急诊科 (EICU)', sampleType: '血液', detectTime: '2026-10-29 08:12', isolationStatus: '床边隔离 / 医疗器械专用', riskLevel: '紫色极危' },
      { id: '5', mdroType: 'VRE', organism: '耐万古霉素屎肠球菌 (疑似)', patientName: '顾雅琴', barcode: '0011812170002', department: '呼吸内科病区', sampleType: '痰液', detectTime: '2026-10-29 08:20', isolationStatus: '质谱确证复核中 / 密切关注', riskLevel: '黄色预警' },
    ],
  },

  // 6. 传染病统计
  'prof-infectious-disease': {
    id: 'prof-infectious-disease',
    title: '传染病统计',
    group: '专业统计',
    kpiMetrics: [
      { label: '传染病筛查标本', value: '2,361 份', color: 'text-slate-900' },
      { label: '确证阳性报告', value: '58 例', subLabel: '2.45%', color: 'text-amber-600' },
      { label: '网络直报率', value: '100.0%', subLabel: '国家大疫情网', color: 'text-emerald-700' },
      { label: '重点病种', value: '肺结核/布病', color: 'text-rose-600' },
    ],
    columns: [
      { key: 'diseaseName', label: '法定传染病报告项目' },
      { key: 'category', label: '传染病法定类别', isBadge: true },
      { key: 'screenCount', label: '筛查标本数', isMono: true, align: 'right' },
      { key: 'initialPositive', label: '初筛阳性', isMono: true, align: 'right' },
      { key: 'confirmedPositive', label: '确证阳性', isMono: true, align: 'right' },
      { key: 'positiveRate', label: '阳性率(%)', align: 'center', isBadge: true },
      { key: 'cdcReportStatus', label: '疾控直报系统状态', isBadge: true },
      { key: 'depts', label: '主要送检科室' },
    ],
    rows: [
      { id: '1', diseaseName: '结核分枝杆菌 (活动性肺结核)', category: '乙类传染病', screenCount: 126, initialPositive: 8, confirmedPositive: 6, positiveRate: '4.76%', cdcReportStatus: '已网络直报 (区疾控已确认)', depts: '呼吸内科、内科(感染病区)' },
      { id: '2', diseaseName: '布鲁氏菌病 (Brucellosis)', category: '乙类传染病', screenCount: 45, initialPositive: 2, confirmedPositive: 2, positiveRate: '4.44%', cdcReportStatus: '已网络直报 (2小时内速报)', depts: '急诊重症EICU、感染科' },
      { id: '3', diseaseName: '乙型病毒性肝炎表面抗原 (HBsAg)', category: '乙类传染病', screenCount: 860, initialPositive: 42, confirmedPositive: 40, positiveRate: '4.65%', cdcReportStatus: '每月汇总上报 / 定期归档', depts: '健康管理中心、普外科术前' },
      { id: '4', diseaseName: '梅毒螺旋体抗体 (TP-Ab)', category: '乙类传染病', screenCount: 680, initialPositive: 12, confirmedPositive: 10, positiveRate: '1.47%', cdcReportStatus: '已完成双抗原确证网络直报', depts: '妇产科、皮肤性病科' },
      { id: '5', diseaseName: '艾滋病抗体初筛 (HIV 1+2)', category: '乙类传染病', screenCount: 650, initialPositive: 1, confirmedPositive: 0, positiveRate: '0.00%', cdcReportStatus: '已送市疾控中心确证实验室', depts: '输血科前置筛查工位' },
    ],
  },

  // 7. 标本污染统计
  'prof-sample-contamination': {
    id: 'prof-sample-contamination',
    title: '标本污染统计',
    group: '专业统计',
    kpiMetrics: [
      { label: '监测送检标本', value: '708 份', color: 'text-slate-900' },
      { label: '标本污染例数', value: '5 例', subLabel: '0.71%', color: 'text-amber-600' },
      { label: '国家质控目标', value: '≤ 1.5%', subLabel: '全院达标', color: 'text-emerald-700' },
      { label: 'ICU标本污染率', value: '0.00%', subLabel: '标杆科室', color: 'text-emerald-700' },
    ],
    columns: [
      { key: 'department', label: '监测临床科室' },
      { key: 'totalSamples', label: '送检标本总数', isMono: true, align: 'right' },
      { key: 'contamSamples', label: '污染标本数', isMono: true, align: 'right' },
      { key: 'contamRate', label: '标本污染率(%)', align: 'center', isBadge: true },
      { key: 'mainFlora', label: '分离常见污染杂菌' },
      { key: 'qcLevel', label: '质控预警级别', isBadge: true },
      { key: 'actionStatus', label: '临床督导整改状态' },
    ],
    rows: [
      { id: '1', department: '急诊科留观病房', totalSamples: 142, contamSamples: 2, contamRate: '1.41%', mainFlora: '表皮葡萄球菌、微球菌', qcLevel: '黄色预警', actionStatus: '已督导规范采血消毒程序' },
      { id: '2', department: '呼吸内科普通病区', totalSamples: 186, contamSamples: 2, contamRate: '1.08%', mainFlora: '唾液菌群过度混淆 (上皮细胞>25/LP)', qcLevel: '黄色预警', actionStatus: '已下发《深部咳痰留取指引》' },
      { id: '3', department: '普通外科三病区', totalSamples: 120, contamSamples: 1, contamRate: '0.83%', mainFlora: '枯草芽孢杆菌', qcLevel: '在控正常', actionStatus: '无需整改，保持无菌操作' },
      { id: '4', department: '重症医学科 (ICU)', totalSamples: 260, contamSamples: 0, contamRate: '0.00%', mainFlora: '未发现外源杂菌污染', qcLevel: '优质达标', actionStatus: '无菌留取规范执行优异' },
    ],
  },

  // 8. 危急值分析
  'prof-critical-value-detail': {
    id: 'prof-critical-value-detail',
    title: '危急值详细分析',
    group: '专业统计',
    kpiMetrics: [
      { label: '危急值闭环案例', value: '32 例', color: 'text-slate-900' },
      { label: '平均响应通报用时', value: '3.2 分钟', subLabel: '远优于10分钟', color: 'text-emerald-700' },
      { label: '医师处置满意度', value: '99.2%', color: 'text-emerald-700' },
      { label: '挽救高危病患', value: '32 人次', color: 'text-sky-700' },
    ],
    columns: [
      { key: 'barcode', label: '条码号', isMono: true },
      { key: 'patientName', label: '患者姓名' },
      { key: 'department', label: '科室' },
      { key: 'bedNo', label: '床号' },
      { key: 'project', label: '触发项目' },
      { key: 'measureValue', label: '极值结果', isMono: true },
      { key: 'doctorContact', label: '电话接听医师' },
      { key: 'notifyTimeCost', label: '通报耗时', isMono: true },
      { key: 'clinicalAction', label: '临床紧急处置方案' },
    ],
    rows: [
      { id: '1', barcode: '0011812170013', patientName: '梁建国', department: '心血管内科', bedNo: '18床', project: '血清钾离子 (K+)', measureValue: '6.85 mmol/L (严重高钾)', doctorContact: '张先义 (主任医师)', notifyTimeCost: '2分45秒', clinicalAction: '立即予高糖+胰岛素急推，床边血液透析准备' },
      { id: '2', barcode: '0011812170025', patientName: '林晓芬', department: '急诊科胸痛中心', bedNo: '急救02', project: '超敏肌钙蛋白I', measureValue: '18.50 ng/mL (急性心梗)', doctorContact: '陈欣欣 (副主任医师)', notifyTimeCost: '1分50秒', clinicalAction: '双抗负荷用药，绿色通道直送导管室PCI' },
      { id: '3', barcode: '0011812170001', patientName: '杜文斌', department: '内科 (感染病区)', bedNo: '12床', project: '血培养双瓶报阳', measureValue: '革兰阴性杆菌生化报阳', doctorContact: '刘建平 (主治医师)', notifyTimeCost: '3分10秒', clinicalAction: '升级碳青霉烯类联合抗感染，复查血常规' },
      { id: '4', barcode: '0011812170042', patientName: '冯建军', department: '重症医学科 (ICU)', bedNo: '06床', project: '脑脊液多重耐药鲍曼', measureValue: 'CRAB全耐药株', doctorContact: '蔡建华 (主治医师)', notifyTimeCost: '2分20秒', clinicalAction: '多粘菌素B鞘内注射，全面启动接触隔离' },
    ],
  },

  // 9. 送检项目统计
  'work-inspect-items': {
    id: 'work-inspect-items',
    title: '送检项目统计',
    group: '工作统计',
    kpiMetrics: [
      { label: '项目累计测定', value: '1,248 人次', color: 'text-slate-900' },
      { label: '常规血常规占比', value: '38.8%', color: 'text-sky-700' },
      { label: '生化全套申请', value: '280 人次', color: 'text-indigo-700' },
      { label: '医保合规执行率', value: '99.8%', color: 'text-emerald-700' },
    ],
    columns: [
      { key: 'code', label: '项目代码', isMono: true },
      { key: 'name', label: '检验项目全称' },
      { key: 'subGroup', label: '所属专业组' },
      { key: 'appliedCount', label: '申请人次', isMono: true, align: 'right' },
      { key: 'positiveCount', label: '阳性人次', isMono: true, align: 'right' },
      { key: 'positiveRate', label: '阳性率(%)', align: 'center', isBadge: true },
      { key: 'unitPrice', label: '单项收费', isMono: true, align: 'right' },
      { key: 'insuranceRate', label: '医保合规率', align: 'center', isBadge: true },
    ],
    rows: [
      { id: '1', code: '1212', name: '全血细胞分析五分类 (XCG-5DIFF)', subGroup: '临检血液组', appliedCount: 485, positiveCount: 92, positiveRate: '19.0%', unitPrice: '¥ 18.00', insuranceRate: '100.0%' },
      { id: '2', code: '12321', name: '空腹静脉血糖测定 (己糖激酶法)', subGroup: '临床生化组', appliedCount: 340, positiveCount: 68, positiveRate: '20.0%', unitPrice: '¥ 8.00', insuranceRate: '100.0%' },
      { id: '3', code: '312312', name: '肝肾功能及电解质七项全套 (GZGNCD)', subGroup: '临床生化组', appliedCount: 280, positiveCount: 85, positiveRate: '30.4%', unitPrice: '¥ 145.00', insuranceRate: '99.6%' },
      { id: '4', code: 'BAC-CULT', name: '全自动血培养双瓶及药敏鉴定 (BC-AST)', subGroup: '临床微生物组', appliedCount: 98, positiveCount: 18, positiveRate: '18.4%', unitPrice: '¥ 168.00', insuranceRate: '99.2%' },
      { id: '5', code: 'MYO-3', name: '急诊心肌损伤三项 (hs-cTnI/CK-MB/Myo)', subGroup: '免疫急查组', appliedCount: 75, positiveCount: 14, positiveRate: '18.7%', unitPrice: '¥ 180.00', insuranceRate: '100.0%' },
      { id: '6', code: '321', name: '尿液干化学及有形成分沉渣镜检', subGroup: '临检尿液组', appliedCount: 310, positiveCount: 52, positiveRate: '16.8%', unitPrice: '¥ 22.00', insuranceRate: '99.8%' },
    ],
  },

  // 10. 标本分类统计
  'work-specimen-class': {
    id: 'work-specimen-class',
    title: '标本分类统计',
    group: '工作统计',
    kpiMetrics: [
      { label: '接收各类标本', value: '864 份', color: 'text-slate-900' },
      { label: '静脉血清标本', value: '40.6%', subLabel: '第一大类', color: 'text-sky-700' },
      { label: '标本整体合格率', value: '99.1%', subLabel: '达标', color: 'text-emerald-700' },
      { label: '不合格退回数', value: '8 份', color: 'text-rose-600' },
    ],
    columns: [
      { key: 'sampleName', label: '标本类别' },
      { key: 'tubeType', label: '标准采血管规格' },
      { key: 'receivedCount', label: '接收份数', isMono: true, align: 'right' },
      { key: 'shareRate', label: '占比(%)', align: 'center', isBadge: true },
      { key: 'qualifiedCount', label: '合格份数', isMono: true, align: 'right' },
      { key: 'rejectedCount', label: '退回份数', isMono: true, align: 'right' },
      { key: 'qualifiedRate', label: '合格率(%)', align: 'center', isBadge: true },
      { key: 'mainDepts', label: '主要送检科室' },
    ],
    rows: [
      { id: '1', sampleName: '静脉血液标本 (血清SST)', tubeType: '促凝胶管 4.0ml (黄头)', receivedCount: 520, shareRate: '40.6%', qualifiedCount: 518, rejectedCount: 2, qualifiedRate: '99.6%', mainDepts: '门诊部、心内科、内分泌科' },
      { id: '2', sampleName: '全血标本 (EDTA抗凝)', tubeType: 'EDTA-K2管 2.0ml (紫头)', receivedCount: 380, shareRate: '29.7%', qualifiedCount: 376, rejectedCount: 4, qualifiedRate: '98.9%', mainDepts: '急诊科、血液科、儿科病区' },
      { id: '3', sampleName: '尿液标本 (随机清洁尿)', tubeType: '洁净刻度尿管 10ml', receivedCount: 210, shareRate: '16.4%', qualifiedCount: 208, rejectedCount: 2, qualifiedRate: '99.0%', mainDepts: '肾内科、泌尿外科、体检中心' },
      { id: '4', sampleName: '痰液及支气管灌洗液', tubeType: '一次性无菌咳痰杯', receivedCount: 95, shareRate: '7.4%', qualifiedCount: 92, rejectedCount: 3, qualifiedRate: '96.8%', mainDepts: '呼吸内科、内科(感染病区)' },
      { id: '5', sampleName: '血液培养双瓶 (好氧+厌氧)', tubeType: '树脂吸附双瓶 8-10ml', receivedCount: 55, shareRate: '4.3%', qualifiedCount: 54, rejectedCount: 1, qualifiedRate: '98.2%', mainDepts: '重症医学科(ICU)、急诊EICU' },
      { id: '6', sampleName: '脑脊液及穿刺体液', tubeType: '无菌三级离心管 3-5ml', receivedCount: 20, shareRate: '1.6%', qualifiedCount: 20, rejectedCount: 0, qualifiedRate: '100.0%', mainDepts: '神经内科、神经外科重症' },
    ],
  },

  // 11. 不合格标本统计
  'work-defective-specimen': {
    id: 'work-defective-specimen',
    title: '不合格标本统计与追溯',
    group: '工作统计',
    kpiMetrics: [
      { label: '不合格标本记录', value: '12 份', color: 'text-slate-900' },
      { label: '全院标本不合格率', value: '0.92%', subLabel: '国家要求≤1.0%', color: 'text-emerald-700' },
      { label: '主要拒收原因', value: '凝块/唾液混杂', color: 'text-rose-600' },
      { label: '临床重新补采率', value: '100.0%', color: 'text-emerald-700' },
    ],
    columns: [
      { key: 'barcode', label: '条码号', isMono: true },
      { key: 'patientName', label: '患者姓名' },
      { key: 'department', label: '送检科室' },
      { key: 'sampleType', label: '标本类型' },
      { key: 'defectReason', label: '不合格拒收原因' },
      { key: 'registerTime', label: '登记拒收时间', isMono: true },
      { key: 'operator', label: '拒收核查人' },
      { key: 'noticeStatus', label: '临床通知状态', isBadge: true },
      { key: 'recollectStatus', label: '重新补采状态', isBadge: true },
    ],
    rows: [
      { id: '1', barcode: '0011812170081', patientName: '王晓芳', department: '儿科门诊', sampleType: '全血 (紫管)', defectReason: '采血混匀不充分形成微小凝块', registerTime: '2026-10-29 08:05', operator: '郑舒涵 (标本核收)', noticeStatus: '已电话通知儿科护士站', recollectStatus: '重新采集送达' },
      { id: '2', barcode: '0011812170085', patientName: '赵德发', department: '呼吸内科病区', sampleType: '痰液 (无菌盒)', defectReason: '标本为纯口腔唾液，无肺部深部分泌物', registerTime: '2026-10-29 07:40', operator: '张珊 (主管技师)', noticeStatus: '已下发退回说明至病区', recollectStatus: '重新指导留取晨痰' },
      { id: '3', barcode: '0011812170092', patientName: '孙桂英', department: '普通外科病区', sampleType: '血清 (黄管)', defectReason: '重度体外溶血 (游离血红蛋白>3.5g/L)', registerTime: '2026-10-29 07:15', operator: '陈志远 (检验技师)', noticeStatus: '已电话通知责任护士', recollectStatus: '二次重抽已上机' },
      { id: '4', barcode: '0011812170096', patientName: '刘玉兰', department: '神经内科病区', sampleType: '凝血 (蓝管)', defectReason: '采血量不足未达标线 (抗凝比例失调)', registerTime: '2026-10-29 06:50', operator: '林德胜 (血凝技师)', noticeStatus: '已通知病区护士站补抽', recollectStatus: '补采标本已出报告' },
    ],
  },

  // 12. 血培养仪工作量统计
  'work-blood-culture-workload': {
    id: 'work-blood-culture-workload',
    title: '血培养仪工作量统计',
    group: '工作统计',
    kpiMetrics: [
      { label: '在机孵育瓶数', value: '196 瓶', color: 'text-slate-900' },
      { label: '仪器报阳率', value: '9.2%', subLabel: '18瓶报阳', color: 'text-rose-600' },
      { label: '平均报阳用时', value: '21.5 小时', color: 'text-sky-700' },
      { label: '阴性自动归档', value: '178 瓶', color: 'text-emerald-700' },
    ],
    columns: [
      { key: 'deviceCode', label: '设备编号', isMono: true },
      { key: 'slotNo', label: '孵育槽位', isMono: true },
      { key: 'barcode', label: '标本条码', isMono: true },
      { key: 'patientName', label: '患者姓名' },
      { key: 'department', label: '所在科室' },
      { key: 'startTime', label: '上机孵育时间', isMono: true },
      { key: 'alarmTime', label: '报阳/状态时间', isMono: true },
      { key: 'duration', label: '孵育用时', isMono: true },
      { key: 'statusResult', label: '涂片及鉴定结果', isBadge: true },
    ],
    rows: [
      { id: '1', deviceCode: 'BACTEC-FX-01', slotNo: 'A-04', barcode: '0011812170001', patientName: '杜文斌', department: '内科 (感染病区)', startTime: '2026-10-27 08:35', alarmTime: '2026-10-29 08:35', duration: '48.0h', statusResult: '报阳: G-杆菌 (ESBL+)' },
      { id: '2', deviceCode: 'BACTEC-FX-01', slotNo: 'B-12', barcode: '0011812170012', patientName: '陈志强', department: '急诊科 (EICU)', startTime: '2026-10-28 14:12', alarmTime: '2026-10-29 08:12', duration: '18.0h', statusResult: '报阳: 布氏杆菌' },
      { id: '3', deviceCode: 'BACTEC-FX-02', slotNo: 'A-22', barcode: '0011812170042', patientName: '冯建军', department: '重症医学科 (ICU)', startTime: '2026-10-28 10:15', alarmTime: '2026-10-29 08:15', duration: '22.0h', statusResult: '报阳: 鲍曼不动杆菌' },
      { id: '4', deviceCode: 'BACTEC-FX-02', slotNo: 'C-08', barcode: '0011812170050', patientName: '郑明辉', department: '心血管内科', startTime: '2026-10-27 12:00', alarmTime: '2026-10-29 08:00', duration: '44.0h', statusResult: '连续监测阴性中' },
    ],
  },

  // 13. 费用统计
  'work-cost-billing': {
    id: 'work-cost-billing',
    title: '检验费用与收入统计',
    group: '工作统计',
    kpiMetrics: [
      { label: '累计检验收费', value: '¥ 161,450.00', color: 'text-slate-900' },
      { label: '医保统筹支付', value: '¥ 122,400.00', subLabel: '75.8%', color: 'text-emerald-700' },
      { label: '个人自付金额', value: '¥ 39,050.00', subLabel: '24.2%', color: 'text-sky-700' },
      { label: '急诊收入第一', value: '¥ 42,750.00', color: 'text-amber-600' },
    ],
    columns: [
      { key: 'dept', label: '开单科室' },
      { key: 'sampleCount', label: '送检标本量', isMono: true, align: 'right' },
      { key: 'itemCount', label: '计费项目数', isMono: true, align: 'right' },
      { key: 'insuranceAmount', label: '医保统筹(¥)', isMono: true, align: 'right' },
      { key: 'selfPayAmount', label: '自费金额(¥)', isMono: true, align: 'right' },
      { key: 'totalAmount', label: '合计收入(¥)', isMono: true, align: 'right' },
      { key: 'shareRate', label: '科室占比(%)', align: 'center', isBadge: true },
    ],
    rows: [
      { id: '1', dept: '急诊科 (含EICU/胸痛中心)', sampleCount: 285, itemCount: 860, insuranceAmount: '¥ 34,200.00', selfPayAmount: '¥ 8,550.00', totalAmount: '¥ 42,750.00', shareRate: '26.5%' },
      { id: '2', dept: '重症医学科 (ICU)', sampleCount: 195, itemCount: 620, insuranceAmount: '¥ 28,500.00', selfPayAmount: '¥ 6,100.00', totalAmount: '¥ 34,600.00', shareRate: '21.4%' },
      { id: '3', dept: '心血管内科病区', sampleCount: 210, itemCount: 580, insuranceAmount: '¥ 22,100.00', selfPayAmount: '¥ 5,200.00', totalAmount: '¥ 27,300.00', shareRate: '16.9%' },
      { id: '4', dept: '呼吸内科病区', sampleCount: 180, itemCount: 490, insuranceAmount: '¥ 18,600.00', selfPayAmount: '¥ 4,200.00', totalAmount: '¥ 22,800.00', shareRate: '14.1%' },
      { id: '5', dept: '内科 (感染病区)', sampleCount: 140, itemCount: 380, insuranceAmount: '¥ 15,200.00', selfPayAmount: '¥ 3,400.00', totalAmount: '¥ 18,600.00', shareRate: '11.5%' },
      { id: '6', dept: '健康管理体检中心', sampleCount: 270, itemCount: 540, insuranceAmount: '¥ 3,800.00', selfPayAmount: '¥ 11,600.00', totalAmount: '¥ 15,400.00', shareRate: '9.6%' },
    ],
  },

  // 14. 工作量统计
  'work-staff-workload': {
    id: 'work-staff-workload',
    title: '检验技师工作量统计',
    group: '工作统计',
    kpiMetrics: [
      { label: '科室总出单量', value: '1,280 份', color: 'text-slate-900' },
      { label: '生化流水线工位', value: '385 份', subLabel: '工位首位', color: 'text-sky-700' },
      { label: '平均TAT报告用时', value: '28.2 分钟', color: 'text-emerald-700' },
      { label: '危急值处置闭环', value: '39 次', color: 'text-rose-600' },
    ],
    columns: [
      { key: 'empNo', label: '工号', isMono: true },
      { key: 'name', label: '技师姓名' },
      { key: 'station', label: '负责检验工位' },
      { key: 'processCount', label: '标本处理量', isMono: true, align: 'right' },
      { key: 'auditCount', label: '审核发单量', isMono: true, align: 'right' },
      { key: 'crisisCount', label: '危急值处置', isMono: true, align: 'right' },
      { key: 'recheckCount', label: '复查标本数', isMono: true, align: 'right' },
      { key: 'avgTat', label: '平均TAT用时', isMono: true },
      { key: 'qcRate', label: '质控达标率', align: 'center', isBadge: true },
    ],
    rows: [
      { id: '1', empNo: 'LIS-101', name: '张珊', station: '临床微生物检验组 (主管检验师)', processCount: 218, auditCount: 196, crisisCount: 8, recheckCount: 12, avgTat: '42.5 min', qcRate: '100.0%' },
      { id: '2', empNo: 'LIS-102', name: '陈志远', station: '生化急查与流水线工位 (主管检验师)', processCount: 385, auditCount: 360, crisisCount: 14, recheckCount: 24, avgTat: '28.2 min', qcRate: '99.8%' },
      { id: '3', empNo: 'LIS-103', name: '黄雅芳', station: '发光免疫与激素分析组 (检验师)', processCount: 290, auditCount: 285, crisisCount: 5, recheckCount: 9, avgTat: '34.0 min', qcRate: '100.0%' },
      { id: '4', empNo: 'LIS-104', name: '蔡文斌', station: '报告多级终审与质控监督 (副主任技师)', processCount: 387, auditCount: 387, crisisCount: 12, recheckCount: 15, avgTat: '15.6 min', qcRate: '100.0%' },
      { id: '5', empNo: 'LIS-105', name: '林德胜', station: '血凝与急诊血常规工位 (检验师)', processCount: 312, auditCount: 308, crisisCount: 6, recheckCount: 11, avgTat: '18.4 min', qcRate: '100.0%' },
      { id: '6', empNo: 'LIS-106', name: '郑舒涵', station: '门诊生化与离子分析工位 (检验技师)', processCount: 245, auditCount: 240, crisisCount: 3, recheckCount: 8, avgTat: '22.0 min', qcRate: '99.6%' },
    ],
  },

  // 15. 室内质控统计 (IQC)
  'qc-iqc-stats': {
    id: 'qc-iqc-stats',
    title: '室内质控统计 (IQC)',
    group: '质控统计',
    kpiMetrics: [
      { label: '在控项目数', value: '68 项', color: 'text-slate-900' },
      { label: '室内质控在控率', value: '98.5%', subLabel: '达标', color: 'text-emerald-700' },
      { label: '1-2s规则告警', value: '1 项', subLabel: '葡萄糖', color: 'text-amber-600' },
      { label: '失控暂停仪器', value: '0 台', color: 'text-emerald-700' },
    ],
    columns: [
      { key: 'code', label: '项目代码', isMono: true },
      { key: 'name', label: '项目全称' },
      { key: 'device', label: '检测仪器' },
      { key: 'lotNo', label: '质控品批号', isMono: true },
      { key: 'targetVal', label: '靶值 (X)', isMono: true },
      { key: 'sdVal', label: '标准差 (SD)', isMono: true },
      { key: 'currentVal', label: '今日实测值', isMono: true },
      { key: 'bias', label: '偏倚(Bias%)', isMono: true },
      { key: 'westgardStatus', label: 'Westgard质控判定', align: 'center', isBadge: true },
    ],
    rows: [
      { id: '1', code: 'ALT', name: '丙氨酸氨基转移酶', device: '罗氏 Cobas 8000', lotNo: 'LOT-202610A', targetVal: '42.0 U/L', sdVal: '1.8 U/L', currentVal: '42.6 U/L', bias: '+1.4%', westgardStatus: '在控 (In Control)' },
      { id: '2', code: 'CREA', name: '肌酐 (酶法)', device: '罗氏 Cobas 8000', lotNo: 'LOT-202610A', targetVal: '88.5 μmol/L', sdVal: '2.4 μmol/L', currentVal: '89.2 μmol/L', bias: '+0.8%', westgardStatus: '在控 (In Control)' },
      { id: '3', code: 'K+', name: '血清钾离子', device: '雅培 Alinity ci', lotNo: 'LOT-202609B', targetVal: '4.35 mmol/L', sdVal: '0.08 mmol/L', currentVal: '4.41 mmol/L', bias: '+1.3%', westgardStatus: '在控 (In Control)' },
      { id: '4', code: 'hs-cTnI', name: '超敏肌钙蛋白I', device: '罗氏 Cobas e801', lotNo: 'LOT-202610H', targetVal: '0.28 ng/mL', sdVal: '0.015 ng/mL', currentVal: '0.285 ng/mL', bias: '+1.7%', westgardStatus: '在控 (In Control)' },
      { id: '5', code: 'GLU', name: '葡萄糖(己糖激酶)', device: '贝克曼 AU5800', lotNo: 'LOT-202610G', targetVal: '5.50 mmol/L', sdVal: '0.12 mmol/L', currentVal: '5.68 mmol/L', bias: '+3.2%', westgardStatus: '1-2s规则告警' },
      { id: '6', code: 'PT', name: '凝血酶原时间', device: '沃芬 ACL TOP 700', lotNo: 'LOT-202609C', targetVal: '12.5 s', sdVal: '0.4 s', currentVal: '12.4 s', bias: '-0.8%', westgardStatus: '在控 (In Control)' },
    ],
  },

  // 16. 室间质控统计 (EQA)
  'qc-eqa-stats': {
    id: 'qc-eqa-stats',
    title: '室间质评统计 (EQA/PT)',
    group: '质控统计',
    kpiMetrics: [
      { label: '参评项目总数', value: '24 项', color: 'text-slate-900' },
      { label: '国家质评满分率', value: '100.0%', subLabel: 'NCCL满分', color: 'text-emerald-700' },
      { label: '省级质评优秀率', value: '100.0%', subLabel: '临检中心', color: 'text-emerald-700' },
      { label: '电子证书归档', value: '全项通过', color: 'text-sky-700' },
    ],
    columns: [
      { key: 'orgName', label: '质评组织评估机构' },
      { key: 'batchName', label: '评定年度批次' },
      { key: 'majorGroup', label: '参评专业项目群' },
      { key: 'itemCount', label: '项目数', isMono: true, align: 'right' },
      { key: 'targetMatch', label: '靶值吻合率', isMono: true },
      { key: 'score', label: 'VIS / PT 得分', isMono: true, align: 'center', isBadge: true },
      { key: 'evalLevel', label: '综合评价等级', align: 'center', isBadge: true },
      { key: 'certStatus', label: '证书归档状态' },
    ],
    rows: [
      { id: '1', orgName: '国家卫生健康委临床检验中心 (NCCL)', batchName: '2026年第2次室间质评', majorGroup: '常规临床生化全项', itemCount: 28, targetMatch: '99.2%', score: 'PT: 100分', evalLevel: '优秀 (满分)', certStatus: '国家合格证书已归档' },
      { id: '2', orgName: '国家卫生健康委临床检验中心 (NCCL)', batchName: '2026年第2次室间质评', majorGroup: '临床免疫与化学发光', itemCount: 18, targetMatch: '98.6%', score: 'PT: 100分', evalLevel: '优秀 (满分)', certStatus: '国家合格证书已归档' },
      { id: '3', orgName: '重庆市临床检验中心', batchName: '2026年度秋季室间质评', majorGroup: '微生物细菌耐药监测', itemCount: 12, targetMatch: '100.0%', score: 'PT: 98.5分', evalLevel: '优秀', certStatus: '省级合格证书已归档' },
      { id: '4', orgName: '重庆市临床检验中心', batchName: '2026年度秋季室间质评', majorGroup: '血液细胞形态学与血凝', itemCount: 8, targetMatch: '99.0%', score: 'PT: 100分', evalLevel: '优秀 (满分)', certStatus: '省级合格证书已归档' },
    ],
  },
};
