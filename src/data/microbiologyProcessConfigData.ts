// 微生物系统 -> 基础设置 -> 流程方案配置数据定义与完整数据集
export interface ProcessTestApplication {
  id: string;
  code: string;
  name: string;
  category: string;
  defaultSpecimen: string;
}

// 1. 业务配置 (Business Configuration)
export interface BusinessConfigItem {
  id: string;
  businessType: '涂片镜检' | '仪器培养' | '普通培养' | '鉴定药敏' | '核酸分子快检' | '直接抗原筛查';
  isSelected: boolean;
  initialReport: boolean; // 初步报告
  finalReport: boolean;   // 最终报告
  description: string;
}

// 2. 制片方案 (Smear / Slide Staining Scheme)
export interface SmearSchemeItem {
  id: string;
  appCode: string;
  schemeName: string;
  stainingMethods: string[]; // e.g. ['革兰染色', '抗酸染色']
  specimenTypes: string[];   // e.g. ['痰液', '气管吸取物']
  isEnabled: boolean;
  operator: string;
  operateTime: string;
  remarks?: string;
}

// 3. 接种方案 (Inoculation Scheme)
export interface InoculationMediaDetail {
  id: string;
  mediaType: string;     // e.g. '血/嗜血琼脂培养基', '麦康凯琼脂培养基', '巧克力琼脂培养基'
  equipment: string;     // e.g. '35℃普通温箱', '25℃真菌培养箱', '35℃ 5% CO2温箱', '厌氧培养箱'
  durationHours: number; // e.g. 48, 24, 72
}

export interface InoculationSchemeItem {
  id: string;
  appCode: string;
  schemeName: string;
  mediaItems: InoculationMediaDetail[];
  specimenTypes: string[];
  isEnabled: boolean;
  operator: string;
  operateTime: string;
  remarks?: string;
}

// 4. 评语模板 (Comment / Result Templates)
export interface CommentTemplateItem {
  id: string;
  appCode: string;
  type: '镜检评语' | '培养评语' | '药敏评语' | '危急值评语';
  content: string;
  isDefault: boolean;
  isEnabled: boolean;
  specimenTypes: string[];
  operator: string;
  operateTime: string;
}

// 10项检验申请列表
export const PROCESS_TEST_APPLICATIONS: ProcessTestApplication[] = [
  { id: 'app-1001', code: '1001', name: '痰培养', category: '常规细菌培养', defaultSpecimen: '痰液' },
  { id: 'app-1002', code: '1002', name: '血培养', category: '无菌体液培养', defaultSpecimen: '血液' },
  { id: 'app-1003', code: '1003', name: '普通培养', category: '常规细菌培养', defaultSpecimen: '分泌物' },
  { id: 'app-1004', code: '1004', name: '痰涂片', category: '直接显微镜检', defaultSpecimen: '痰液' },
  { id: 'app-1005', code: '1005', name: '真菌培养及鉴定', category: '真菌学检查', defaultSpecimen: '皮屑/指甲/痰' },
  { id: 'app-1006', code: '1006', name: '支原体培养及鉴定', category: '特种病原体', defaultSpecimen: '泌尿生殖道拭子' },
  { id: 'app-1007', code: '1007', name: '尿培养及菌落计数', category: '泌尿系统培养', defaultSpecimen: '中段尿' },
  { id: 'app-1008', code: '1008', name: '脑脊液常规培养', category: '无菌体液培养', defaultSpecimen: '脑脊液' },
  { id: 'app-1009', code: '1009', name: '创面脓液培养', category: '创伤感染培养', defaultSpecimen: '脓液' },
  { id: 'app-1010', code: '1010', name: '胸腹水常规增菌培养', category: '体液穿刺液', defaultSpecimen: '胸腹水' },
];

// 初始业务配置 (不同申请项目具有独特、贴合临床实际的配置)
export const INITIAL_BUSINESS_CONFIG: Record<string, BusinessConfigItem[]> = {
  // 1001 痰培养 (对应 screenshot 1: 涂片镜检、仪器培养、普通培养、鉴定药敏)
  '1001': [
    { id: 'bc-1001-1', businessType: '涂片镜检', isSelected: true, initialReport: true, finalReport: true, description: '痰标本革兰染色与白细胞上皮细胞比例评估' },
    { id: 'bc-1001-2', businessType: '仪器培养', isSelected: true, initialReport: true, finalReport: true, description: '全自动连续监测CO2温箱' },
    { id: 'bc-1001-3', businessType: '普通培养', isSelected: true, initialReport: true, finalReport: true, description: '血琼脂/麦康凯/巧克力三平板划线培养' },
    { id: 'bc-1001-4', businessType: '鉴定药敏', isSelected: true, initialReport: true, finalReport: true, description: '质谱打分及VITEK-2细菌鉴定与药敏' },
    { id: 'bc-1001-5', businessType: '核酸分子快检', isSelected: false, initialReport: true, finalReport: false, description: '呼吸道多重病原靶向PCR' },
    { id: 'bc-1001-6', businessType: '直接抗原筛查', isSelected: false, initialReport: true, finalReport: false, description: '肺炎链球菌抗原胶体金检测' },
  ],
  // 1002 血培养 (强调仪器培养报阳、涂片与药敏)
  '1002': [
    { id: 'bc-1002-1', businessType: '涂片镜检', isSelected: true, initialReport: true, finalReport: true, description: '报阳瓶直接革兰染色初报' },
    { id: 'bc-1002-2', businessType: '仪器培养', isSelected: true, initialReport: true, finalReport: true, description: '全自动双向荧光血培养仪连续监测5-7天' },
    { id: 'bc-1002-3', businessType: '普通培养', isSelected: true, initialReport: true, finalReport: true, description: '报阳液四区分区转种分离' },
    { id: 'bc-1002-4', businessType: '鉴定药敏', isSelected: true, initialReport: true, finalReport: true, description: '血培养快速质谱直接鉴定与药敏' },
    { id: 'bc-1002-5', businessType: '核酸分子快检', isSelected: true, initialReport: true, finalReport: false, description: '血流感染耐药基因(如mecA, blaKPC)快检' },
    { id: 'bc-1002-6', businessType: '直接抗原筛查', isSelected: false, initialReport: false, finalReport: false, description: '非血液标本常规不启用' },
  ],
  // 1003 普通培养
  '1003': [
    { id: 'bc-1003-1', businessType: '涂片镜检', isSelected: true, initialReport: true, finalReport: false, description: '分泌物直接革兰染色' },
    { id: 'bc-1003-2', businessType: '仪器培养', isSelected: false, initialReport: false, finalReport: false, description: '常规标本不经过血培养仪' },
    { id: 'bc-1003-3', businessType: '普通培养', isSelected: true, initialReport: true, finalReport: true, description: '普通培养基24-48小时观察' },
    { id: 'bc-1003-4', businessType: '鉴定药敏', isSelected: true, initialReport: true, finalReport: true, description: '致病菌常规生化/质谱鉴定与药敏' },
    { id: 'bc-1003-5', businessType: '核酸分子快检', isSelected: false, initialReport: false, finalReport: false, description: '按临床特别医嘱增补' },
    { id: 'bc-1003-6', businessType: '直接抗原筛查', isSelected: false, initialReport: false, finalReport: false, description: '未配置常规抗原' },
  ],
  // 1004 痰涂片 (仅直接镜检，不培养)
  '1004': [
    { id: 'bc-1004-1', businessType: '涂片镜检', isSelected: true, initialReport: true, finalReport: true, description: '快速抗酸染色/革兰染色直接报告' },
    { id: 'bc-1004-2', businessType: '仪器培养', isSelected: false, initialReport: false, finalReport: false, description: '纯涂片检查无仪器培养' },
    { id: 'bc-1004-3', businessType: '普通培养', isSelected: false, initialReport: false, finalReport: false, description: '涂片项目不执行平板接种' },
    { id: 'bc-1004-4', businessType: '鉴定药敏', isSelected: false, initialReport: false, finalReport: false, description: '无培养物，不进行药敏' },
    { id: 'bc-1004-5', businessType: '核酸分子快检', isSelected: true, initialReport: true, finalReport: true, description: '痰标本结核利福平耐药Xpert核酸快检' },
    { id: 'bc-1004-6', businessType: '直接抗原筛查', isSelected: false, initialReport: false, finalReport: false, description: '未启用' },
  ],
  // 1005 真菌培养及鉴定 (长周期培养与荧光染色)
  '1005': [
    { id: 'bc-1005-1', businessType: '涂片镜检', isSelected: true, initialReport: true, finalReport: false, description: '荧光真菌染色及KOH湿片镜检' },
    { id: 'bc-1005-2', businessType: '仪器培养', isSelected: false, initialReport: false, finalReport: false, description: '深部真菌选配增菌' },
    { id: 'bc-1005-3', businessType: '普通培养', isSelected: true, initialReport: true, finalReport: true, description: '沙保弱SDA平板25℃及35℃延长培养7-14天' },
    { id: 'bc-1005-4', businessType: '鉴定药敏', isSelected: true, initialReport: false, finalReport: true, description: '酵母样/丝状真菌ATB真菌药敏板条' },
    { id: 'bc-1005-5', businessType: '核酸分子快检', isSelected: false, initialReport: false, finalReport: false, description: '曲霉/隐球菌核酸检测' },
    { id: 'bc-1005-6', businessType: '直接抗原筛查', isSelected: true, initialReport: true, finalReport: true, description: '隐球菌荚膜多糖抗原侧流层析试纸' },
  ],
  // 1006 支原体培养及鉴定
  '1006': [
    { id: 'bc-1006-1', businessType: '涂片镜检', isSelected: false, initialReport: false, finalReport: false, description: '支原体无细胞壁，革兰染色不可见' },
    { id: 'bc-1006-2', businessType: '仪器培养', isSelected: false, initialReport: false, finalReport: false, description: '微量肉汤培养' },
    { id: 'bc-1006-3', businessType: '普通培养', isSelected: true, initialReport: true, finalReport: true, description: '解脲脲原体/人支原体液体显色培养' },
    { id: 'bc-1006-4', businessType: '鉴定药敏', isSelected: true, initialReport: false, finalReport: true, description: '四环素/大环内酯/喹诺酮类支原体药敏孔板' },
    { id: 'bc-1006-5', businessType: '核酸分子快检', isSelected: true, initialReport: true, finalReport: true, description: '生殖支原体DNA荧光PCR' },
    { id: 'bc-1006-6', businessType: '直接抗原筛查', isSelected: false, initialReport: false, finalReport: false, description: '未启用' },
  ],
  // 1007 尿培养及菌落计数
  '1007': [
    { id: 'bc-1007-1', businessType: '涂片镜检', isSelected: false, initialReport: false, finalReport: false, description: '尿常规沉渣由门急诊完成' },
    { id: 'bc-1007-2', businessType: '仪器培养', isSelected: false, initialReport: false, finalReport: false, description: '直接平板定量接种' },
    { id: 'bc-1007-3', businessType: '普通培养', isSelected: true, initialReport: true, finalReport: true, description: '10μL校准接种环尿定量划线培养' },
    { id: 'bc-1007-4', businessType: '鉴定药敏', isSelected: true, initialReport: true, finalReport: true, description: '菌落计数>=10^5 CFU/mL启动药敏' },
    { id: 'bc-1007-5', businessType: '核酸分子快检', isSelected: false, initialReport: false, finalReport: false, description: '未启用' },
    { id: 'bc-1007-6', businessType: '直接抗原筛查', isSelected: false, initialReport: false, finalReport: false, description: '未启用' },
  ],
  // 1008 脑脊液常规培养 (极高危体液，多项目全部开启)
  '1008': [
    { id: 'bc-1008-1', businessType: '涂片镜检', isSelected: true, initialReport: true, finalReport: true, description: '脑脊液离心沉渣急诊双人复核镜检' },
    { id: 'bc-1008-2', businessType: '仪器培养', isSelected: true, initialReport: true, finalReport: true, description: '儿童全自动需氧/厌氧增菌瓶连续监测' },
    { id: 'bc-1008-3', businessType: '普通培养', isSelected: true, initialReport: true, finalReport: true, description: '巧克力/血琼脂CO2培养箱快速接种' },
    { id: 'bc-1008-4', businessType: '鉴定药敏', isSelected: true, initialReport: true, finalReport: true, description: '质谱快速鉴定与微量肉汤稀释法药敏' },
    { id: 'bc-1008-5', businessType: '核酸分子快检', isSelected: true, initialReport: true, finalReport: true, description: '中枢神经系统脑炎脑膜炎多联PCR' },
    { id: 'bc-1008-6', businessType: '直接抗原筛查', isSelected: true, initialReport: true, finalReport: true, description: '脑膜炎双球菌/肺炎链球菌/B族链球菌乳胶凝集' },
  ],
  // 1009 创面脓液培养
  '1009': [
    { id: 'bc-1009-1', businessType: '涂片镜检', isSelected: true, initialReport: true, finalReport: true, description: '脓性分泌物直接镜检炎细胞及细菌形态' },
    { id: 'bc-1009-2', businessType: '仪器培养', isSelected: false, initialReport: false, finalReport: false, description: '常规固体培养' },
    { id: 'bc-1009-3', businessType: '普通培养', isSelected: true, initialReport: true, finalReport: true, description: '需氧血琼脂+麦康凯+厌氧血琼脂培养' },
    { id: 'bc-1009-4', businessType: '鉴定药敏', isSelected: true, initialReport: true, finalReport: true, description: '化脓性致病菌常规AST' },
    { id: 'bc-1009-5', businessType: '核酸分子快检', isSelected: false, initialReport: false, finalReport: false, description: '未启用' },
    { id: 'bc-1009-6', businessType: '直接抗原筛查', isSelected: false, initialReport: false, finalReport: false, description: '未启用' },
  ],
  // 1010 胸腹水常规增菌培养
  '1010': [
    { id: 'bc-1010-1', businessType: '涂片镜检', isSelected: true, initialReport: true, finalReport: true, description: '穿刺液沉渣革兰染色与抗酸染色' },
    { id: 'bc-1010-2', businessType: '仪器培养', isSelected: true, initialReport: true, finalReport: true, description: '床旁无菌注入血培养瓶仪器增菌' },
    { id: 'bc-1010-3', businessType: '普通培养', isSelected: true, initialReport: true, finalReport: true, description: '高渗体液分离平板培养' },
    { id: 'bc-1010-4', businessType: '鉴定药敏', isSelected: true, initialReport: true, finalReport: true, description: '致病菌种确证与全谱药敏' },
    { id: 'bc-1010-5', businessType: '核酸分子快检', isSelected: false, initialReport: false, finalReport: false, description: '可加做结核分枝杆菌DNA' },
    { id: 'bc-1010-6', businessType: '直接抗原筛查', isSelected: false, initialReport: false, finalReport: false, description: '未启用' },
  ],
};

// 完整制片方案 (按 appCode 独立配置)
export const INITIAL_SMEAR_SCHEMES: SmearSchemeItem[] = [
  // 1001 痰培养
  {
    id: 'smear-1001-1',
    appCode: '1001',
    schemeName: '痰培养接种初筛片',
    stainingMethods: ['革兰染色', '抗酸染色'],
    specimenTypes: ['痰液', '气管吸取物'],
    isEnabled: true,
    operator: '李晓红主管检验师',
    operateTime: '2026-10-25 10:15:30',
    remarks: '接种前评估白细胞与鳞状上皮细胞比例',
  },
  {
    id: 'smear-1001-2',
    appCode: '1001',
    schemeName: '痰涂片找真菌',
    stainingMethods: ['荧光真菌染色', '10% KOH湿片'],
    specimenTypes: ['痰液', '肺泡灌洗液'],
    isEnabled: true,
    operator: '刘浩然检验师',
    operateTime: '2026-10-26 14:20:00',
    remarks: '筛查真菌菌丝与孢子结构',
  },
  {
    id: 'smear-1001-3',
    appCode: '1001',
    schemeName: '常规下呼吸道标本革兰染色',
    stainingMethods: ['革兰染色'],
    specimenTypes: ['痰液'],
    isEnabled: true,
    operator: '郭彩霞主任医师',
    operateTime: '2026-10-27 09:30:15',
    remarks: '常规初报',
  },

  // 1002 血培养
  {
    id: 'smear-1002-1',
    appCode: '1002',
    schemeName: '血培养报阳瓶紧急涂片',
    stainingMethods: ['革兰染色', '吖啶橙荧光染色'],
    specimenTypes: ['血液', '血培养增菌液'],
    isEnabled: true,
    operator: '魏明副主任检验师',
    operateTime: '2026-10-26 11:05:40',
    remarks: '仪器报阳后10分钟内必须完成革兰染色并报急',
  },
  {
    id: 'smear-1002-2',
    appCode: '1002',
    schemeName: '血培养厌氧瓶特异性染色',
    stainingMethods: ['革兰染色', '芽胞染色'],
    specimenTypes: ['厌氧瓶培养液'],
    isEnabled: true,
    operator: '李晓红主管检验师',
    operateTime: '2026-10-27 15:40:20',
    remarks: '针对厌氧芽胞梭菌等厌氧菌',
  },

  // 1003 普通培养
  {
    id: 'smear-1003-1',
    appCode: '1003',
    schemeName: '分泌物常规革兰染色制片',
    stainingMethods: ['革兰染色'],
    specimenTypes: ['分泌物', '创面拭子'],
    isEnabled: true,
    operator: '王宇轩技师',
    operateTime: '2026-10-28 08:30:10',
    remarks: '标本直涂快速观察菌群形态',
  },

  // 1004 痰涂片
  {
    id: 'smear-1004-1',
    appCode: '1004',
    schemeName: '抗酸杆菌快速荧光染色制片',
    stainingMethods: ['金胺O荧光染色', '齐-尼氏抗酸染色'],
    specimenTypes: ['痰液', '晨痰'],
    isEnabled: true,
    operator: '郭彩霞主任医师',
    operateTime: '2026-10-25 16:20:00',
    remarks: '结核筛查标准荧光法初筛+抗酸复核',
  },
  {
    id: 'smear-1004-2',
    appCode: '1004',
    schemeName: '痰革兰染色形态学镜检制片',
    stainingMethods: ['革兰染色'],
    specimenTypes: ['痰液'],
    isEnabled: true,
    operator: '刘浩然检验师',
    operateTime: '2026-10-27 10:45:00',
    remarks: '评估中性粒细胞及优势菌相',
  },

  // 1005 真菌培养及鉴定
  {
    id: 'smear-1005-1',
    appCode: '1005',
    schemeName: '荧光真菌湿片压片制片',
    stainingMethods: ['荧光真菌染色', '氢氧化钾(KOH)湿片'],
    specimenTypes: ['皮屑', '指甲', '痰液'],
    isEnabled: true,
    operator: '李晓红主管检验师',
    operateTime: '2026-10-28 14:15:30',
    remarks: '显微镜快速确证菌丝与孢子',
  },

  // 1006 支原体培养及鉴定
  {
    id: 'smear-1006-1',
    appCode: '1006',
    schemeName: '支原体标本Giemsa初筛制片',
    stainingMethods: ['Giemsa染色'],
    specimenTypes: ['泌尿生殖道拭子'],
    isEnabled: false,
    operator: '王宇轩技师',
    operateTime: '2026-10-29 09:10:00',
    remarks: '仅供科研及特别复核使用',
  },

  // 1007 尿培养及菌落计数
  {
    id: 'smear-1007-1',
    appCode: '1007',
    schemeName: '未离心新鲜尿直接涂片',
    stainingMethods: ['革兰染色'],
    specimenTypes: ['中段尿', '导尿标本'],
    isEnabled: true,
    operator: '魏明副主任检验师',
    operateTime: '2026-10-26 13:20:10',
    remarks: '油镜每视野>=1个细菌提示有意义菌尿',
  },

  // 1008 脑脊液常规培养
  {
    id: 'smear-1008-1',
    appCode: '1008',
    schemeName: '脑脊液离心沉渣极速双染色制片',
    stainingMethods: ['革兰染色', '墨汁负染色'],
    specimenTypes: ['脑脊液'],
    isEnabled: true,
    operator: '郭彩霞主任医师',
    operateTime: '2026-10-27 08:15:00',
    remarks: '急诊检验30分钟内出具双签名初步报告',
  },

  // 1009 创面脓液培养
  {
    id: 'smear-1009-1',
    appCode: '1009',
    schemeName: '深部脓肿穿刺液直接涂片',
    stainingMethods: ['革兰染色', '弱抗酸染色'],
    specimenTypes: ['脓液', '坏死组织'],
    isEnabled: true,
    operator: '刘浩然检验师',
    operateTime: '2026-10-28 11:40:20',
    remarks: '排查奴卡菌与放线菌',
  },

  // 1010 胸腹水常规增菌培养
  {
    id: 'smear-1010-1',
    appCode: '1010',
    schemeName: '穿刺体液离心浓缩涂片',
    stainingMethods: ['革兰染色', '齐-尼氏抗酸染色'],
    specimenTypes: ['胸腹水', '心包积液'],
    isEnabled: true,
    operator: '李晓红主管检验师',
    operateTime: '2026-10-29 15:30:10',
    remarks: '常规排查革兰阴性杆菌与抗酸分枝杆菌',
  },
];

// 完整接种方案 (按 appCode 独立配置)
export const INITIAL_INOCULATION_SCHEMES: InoculationSchemeItem[] = [
  // 1001 痰培养
  {
    id: 'inoc-1001-1',
    appCode: '1001',
    schemeName: '痰培养常规接种',
    mediaItems: [
      { id: 'm-1001-1', mediaType: '血/嗜血琼脂培养基', equipment: '35℃ 5% CO2温箱', durationHours: 48 },
      { id: 'm-1001-2', mediaType: '麦康凯琼脂培养基', equipment: '35℃普通温箱', durationHours: 48 },
      { id: 'm-1001-3', mediaType: '巧克力琼脂培养基', equipment: '35℃ 5% CO2温箱', durationHours: 48 },
    ],
    specimenTypes: ['痰液'],
    isEnabled: true,
    operator: '郭彩霞主任医师',
    operateTime: '2026-10-26 15:30:12',
    remarks: '下呼吸道标本常规三平板定量划线接种',
  },
  {
    id: 'inoc-1001-2',
    appCode: '1001',
    schemeName: '重症呼吸道感染加护接种方案',
    mediaItems: [
      { id: 'm-1001-4', mediaType: '血/嗜血琼脂培养基', equipment: '35℃ 5% CO2温箱', durationHours: 48 },
      { id: 'm-1001-5', mediaType: '麦康凯琼脂培养基', equipment: '35℃普通温箱', durationHours: 48 },
      { id: 'm-1001-6', mediaType: '沙保弱葡萄糖琼脂(SDA)', equipment: '25℃真菌培养箱', durationHours: 72 },
    ],
    specimenTypes: ['气管插管吸取物', '肺泡灌洗液'],
    isEnabled: true,
    operator: '魏明副主任检验师',
    operateTime: '2026-10-27 16:45:00',
    remarks: 'ICU呼吸机相关性肺炎专项',
  },

  // 1002 血培养
  {
    id: 'inoc-1002-1',
    appCode: '1002',
    schemeName: '血培养报阳瓶转种接种方案',
    mediaItems: [
      { id: 'm-1002-1', mediaType: '血/嗜血琼脂培养基', equipment: '35℃ 5% CO2温箱', durationHours: 48 },
      { id: 'm-1002-2', mediaType: '巧克力琼脂培养基', equipment: '35℃ 5% CO2温箱', durationHours: 48 },
      { id: 'm-1002-3', mediaType: '麦康凯琼脂培养基', equipment: '35℃普通温箱', durationHours: 24 },
      { id: 'm-1002-4', mediaType: '厌氧血琼脂培养基', equipment: '厌氧培养箱', durationHours: 72 },
    ],
    specimenTypes: ['血液'],
    isEnabled: true,
    operator: '李晓红主管检验师',
    operateTime: '2026-10-27 10:45:00',
    remarks: '报阳瓶必须同时接种需氧、厌氧及巧克力平板',
  },

  // 1003 普通培养
  {
    id: 'inoc-1003-1',
    appCode: '1003',
    schemeName: '普通分泌物基础双平板接种',
    mediaItems: [
      { id: 'm-1003-1', mediaType: '血/嗜血琼脂培养基', equipment: '35℃普通温箱', durationHours: 48 },
      { id: 'm-1003-2', mediaType: '麦康凯琼脂培养基', equipment: '35℃普通温箱', durationHours: 48 },
    ],
    specimenTypes: ['分泌物', '创面拭子'],
    isEnabled: true,
    operator: '刘浩然检验师',
    operateTime: '2026-10-28 14:15:20',
    remarks: '门诊普通拭子标准双平板',
  },

  // 1004 痰涂片
  {
    id: 'inoc-1004-1',
    appCode: '1004',
    schemeName: '痰涂片直接镜检免接种规程',
    mediaItems: [],
    specimenTypes: ['痰液'],
    isEnabled: true,
    operator: '王宇轩技师',
    operateTime: '2026-10-25 11:20:00',
    remarks: '项目性质为纯涂片检验，不生成培养接种单',
  },

  // 1005 真菌培养及鉴定
  {
    id: 'inoc-1005-1',
    appCode: '1005',
    schemeName: '深部与浅表真菌双温箱延长培养方案',
    mediaItems: [
      { id: 'm-1005-1', mediaType: '沙保弱葡萄糖琼脂(SDA)', equipment: '25℃真菌培养箱', durationHours: 120 },
      { id: 'm-1005-2', mediaType: '沙保弱葡萄糖琼脂(SDA)', equipment: '35℃普通温箱', durationHours: 72 },
      { id: 'm-1005-3', mediaType: '念珠菌显色培养基', equipment: '35℃普通温箱', durationHours: 48 },
    ],
    specimenTypes: ['皮屑', '指甲', '创面分泌物', '痰液'],
    isEnabled: true,
    operator: '魏明副主任检验师',
    operateTime: '2026-10-28 09:30:00',
    remarks: '双温箱培养对比双相真菌',
  },

  // 1006 支原体培养及鉴定
  {
    id: 'inoc-1006-1',
    appCode: '1006',
    schemeName: '解脲支原体与人支原体液体显色接种',
    mediaItems: [
      { id: 'm-1006-1', mediaType: '支原体肉汤培养基', equipment: '35℃ 5% CO2温箱', durationHours: 48 },
    ],
    specimenTypes: ['泌尿生殖道拭子'],
    isEnabled: true,
    operator: '郭彩霞主任医师',
    operateTime: '2026-10-29 10:15:30',
    remarks: '液体微量培养基观察变色指示剂',
  },

  // 1007 尿培养及菌落计数
  {
    id: 'inoc-1007-1',
    appCode: '1007',
    schemeName: '尿定量校准接种环四区划线方案',
    mediaItems: [
      { id: 'm-1007-1', mediaType: '血/嗜血琼脂培养基', equipment: '35℃普通温箱', durationHours: 24 },
      { id: 'm-1007-2', mediaType: '麦康凯琼脂培养基', equipment: '35℃普通温箱', durationHours: 24 },
    ],
    specimenTypes: ['中段尿', '导尿标本'],
    isEnabled: true,
    operator: '李晓红主管检验师',
    operateTime: '2026-10-27 11:20:00',
    remarks: '使用10μL精密校准接种环，单菌落数乘以100换算CFU/mL',
  },

  // 1008 脑脊液常规培养
  {
    id: 'inoc-1008-1',
    appCode: '1008',
    schemeName: '脑脊液多维度超敏接种增菌方案',
    mediaItems: [
      { id: 'm-1008-1', mediaType: '巧克力琼脂培养基', equipment: '35℃ 5% CO2温箱', durationHours: 72 },
      { id: 'm-1008-2', mediaType: '血/嗜血琼脂培养基', equipment: '35℃ 5% CO2温箱', durationHours: 72 },
      { id: 'm-1008-3', mediaType: '厌氧血琼脂培养基', equipment: '厌氧培养箱', durationHours: 72 },
      { id: 'm-1008-4', mediaType: '麦康凯琼脂培养基', equipment: '35℃普通温箱', durationHours: 48 },
    ],
    specimenTypes: ['脑脊液'],
    isEnabled: true,
    operator: '郭彩霞主任医师',
    operateTime: '2026-10-28 08:45:00',
    remarks: '脑脊液苛养菌保护接种方案',
  },

  // 1009 创面脓液培养
  {
    id: 'inoc-1009-1',
    appCode: '1009',
    schemeName: '创伤感染需氧+厌氧联合接种',
    mediaItems: [
      { id: 'm-1009-1', mediaType: '血/嗜血琼脂培养基', equipment: '35℃普通温箱', durationHours: 48 },
      { id: 'm-1009-2', mediaType: '麦康凯琼脂培养基', equipment: '35℃普通温箱', durationHours: 48 },
      { id: 'm-1009-3', mediaType: '厌氧血琼脂培养基', equipment: '厌氧培养箱', durationHours: 72 },
    ],
    specimenTypes: ['脓液', '溃疡创面'],
    isEnabled: true,
    operator: '刘浩然检验师',
    operateTime: '2026-10-28 15:10:00',
    remarks: '深部组织脓液必须接种厌氧平板',
  },

  // 1010 胸腹水常规增菌培养
  {
    id: 'inoc-1010-1',
    appCode: '1010',
    schemeName: '浆膜腔积液离心转种及血瓶增菌方案',
    mediaItems: [
      { id: 'm-1010-1', mediaType: '血/嗜血琼脂培养基', equipment: '35℃ 5% CO2温箱', durationHours: 48 },
      { id: 'm-1010-2', mediaType: '麦康凯琼脂培养基', equipment: '35℃普通温箱', durationHours: 48 },
      { id: 'm-1010-3', mediaType: '巧克力琼脂培养基', equipment: '35℃ 5% CO2温箱', durationHours: 72 },
    ],
    specimenTypes: ['胸腹水'],
    isEnabled: true,
    operator: '魏明副主任检验师',
    operateTime: '2026-10-29 14:00:00',
    remarks: '同时保留部分液体置于需氧增菌肉汤',
  },
];

// 完整评语模板 (按 appCode 独立配置)
export const INITIAL_COMMENT_TEMPLATES: CommentTemplateItem[] = [
  // 1001 痰培养
  {
    id: 'ct-1001-1',
    appCode: '1001',
    type: '镜检评语',
    content: '涂片染色镜检未找到抗酸杆菌 (报告阴性)。',
    isDefault: true,
    isEnabled: true,
    specimenTypes: ['痰液'],
    operator: '李晓红主管检验师',
    operateTime: '2026-10-25 09:12:30',
  },
  {
    id: 'ct-1001-2',
    appCode: '1001',
    type: '镜检评语',
    content: '涂片染色镜检找到抗酸杆菌 (+)，具呼吸道传染性，请结合临床诊治并复核。',
    isDefault: false,
    isEnabled: true,
    specimenTypes: ['痰液'],
    operator: '郭彩霞主任医师',
    operateTime: '2026-10-26 11:25:40',
  },
  {
    id: 'ct-1001-3',
    appCode: '1001',
    type: '培养评语',
    content: '标本经 35℃ 培养 48 小时，未见致病菌生长，仅见正常呼吸道菌群菌落。',
    isDefault: true,
    isEnabled: true,
    specimenTypes: ['痰液'],
    operator: '魏明副主任检验师',
    operateTime: '2026-10-27 16:00:15',
  },
  {
    id: 'ct-1001-4',
    appCode: '1001',
    type: '药敏评语',
    content: '检出菌株对第三代头孢菌素敏感，建议根据药敏表型结合临床感染部位合理选用抗菌药物。',
    isDefault: false,
    isEnabled: true,
    specimenTypes: ['痰液'],
    operator: '郭彩霞主任医师',
    operateTime: '2026-10-28 13:40:00',
  },

  // 1002 血培养
  {
    id: 'ct-1002-1',
    appCode: '1002',
    type: '培养评语',
    content: '血培养经全自动荧光仪器连续监测培养五天无细菌生长 (报告阴性)。',
    isDefault: true,
    isEnabled: true,
    specimenTypes: ['血液'],
    operator: '刘浩然检验师',
    operateTime: '2026-10-28 08:50:20',
  },
  {
    id: 'ct-1002-2',
    appCode: '1002',
    type: '危急值评语',
    content: '【危急值】血培养仪器报阳，直接革兰涂片查见革兰阴性杆菌，已电话通报病区，请主管医生即刻评估并抗感染处置！',
    isDefault: true,
    isEnabled: true,
    specimenTypes: ['血液'],
    operator: '李晓红主管检验师',
    operateTime: '2026-10-28 10:15:00',
  },
  {
    id: 'ct-1002-3',
    appCode: '1002',
    type: '药敏评语',
    content: '检出大肠埃希菌产超广谱β-内酰胺酶(ESBLs+)，对青霉素类及一至四代头孢菌素耐药，碳青霉烯类敏感。',
    isDefault: false,
    isEnabled: true,
    specimenTypes: ['血液'],
    operator: '魏明副主任检验师',
    operateTime: '2026-10-29 11:20:00',
  },

  // 1003 普通培养
  {
    id: 'ct-1003-1',
    appCode: '1003',
    type: '培养评语',
    content: '标本经 35℃ 培养 48 小时无细菌生长。',
    isDefault: true,
    isEnabled: true,
    specimenTypes: ['分泌物', '创面拭子'],
    operator: '王宇轩技师',
    operateTime: '2026-10-26 14:00:00',
  },
  {
    id: 'ct-1003-2',
    appCode: '1003',
    type: '培养评语',
    content: '检出金黄色葡萄球菌生长 (+++)，常规药敏结果见附表。',
    isDefault: false,
    isEnabled: true,
    specimenTypes: ['分泌物'],
    operator: '刘浩然检验师',
    operateTime: '2026-10-27 15:30:00',
  },

  // 1004 痰涂片
  {
    id: 'ct-1004-1',
    appCode: '1004',
    type: '镜检评语',
    content: '涂片抗酸染色镜检300个视野未找到抗酸杆菌 (报告阴性)。',
    isDefault: true,
    isEnabled: true,
    specimenTypes: ['痰液'],
    operator: '郭彩霞主任医师',
    operateTime: '2026-10-26 09:10:00',
  },
  {
    id: 'ct-1004-2',
    appCode: '1004',
    type: '镜检评语',
    content: '涂片抗酸染色查见抗酸阳性分枝杆菌 (3+)，具较强排菌传染性，请病区落实呼吸道隔离！',
    isDefault: false,
    isEnabled: true,
    specimenTypes: ['痰液'],
    operator: '李晓红主管检验师',
    operateTime: '2026-10-27 10:20:00',
  },

  // 1005 真菌培养及鉴定
  {
    id: 'ct-1005-1',
    appCode: '1005',
    type: '培养评语',
    content: '标本经 25℃ 及 35℃ 培养 7 天未见真菌菌落生长。',
    isDefault: true,
    isEnabled: true,
    specimenTypes: ['皮屑', '指甲', '痰液'],
    operator: '魏明副主任检验师',
    operateTime: '2026-10-28 14:45:00',
  },
  {
    id: 'ct-1005-2',
    appCode: '1005',
    type: '药敏评语',
    content: '检出白念珠菌 (Candida albicans)，对氟康唑、伏立康唑、两性霉素B均敏感。',
    isDefault: false,
    isEnabled: true,
    specimenTypes: ['痰液', '脓液'],
    operator: '郭彩霞主任医师',
    operateTime: '2026-10-29 16:10:00',
  },

  // 1006 支原体培养及鉴定
  {
    id: 'ct-1006-1',
    appCode: '1006',
    type: '培养评语',
    content: '解脲脲原体(Uu)与人支原体(Mh)培养均为阴性。',
    isDefault: true,
    isEnabled: true,
    specimenTypes: ['泌尿生殖道拭子'],
    operator: '王宇轩技师',
    operateTime: '2026-10-27 11:30:00',
  },
  {
    id: 'ct-1006-2',
    appCode: '1006',
    type: '药敏评语',
    content: '解脲脲原体(Uu)阳性(>=10^4 CFU/mL)，对多西环素、米诺环素、克拉霉素敏感。',
    isDefault: false,
    isEnabled: true,
    specimenTypes: ['泌尿生殖道拭子'],
    operator: '李晓红主管检验师',
    operateTime: '2026-10-28 15:40:00',
  },

  // 1007 尿培养及菌落计数
  {
    id: 'ct-1007-1',
    appCode: '1007',
    type: '培养评语',
    content: '中段尿培养24小时，菌落计数 < 10^3 CFU/mL，属正常无意义生长。',
    isDefault: true,
    isEnabled: true,
    specimenTypes: ['中段尿'],
    operator: '刘浩然检验师',
    operateTime: '2026-10-26 13:50:00',
  },
  {
    id: 'ct-1007-2',
    appCode: '1007',
    type: '培养评语',
    content: '检出大肠埃希菌单纯优势菌生长，菌落计数 >= 10^5 CFU/mL，符合尿路感染病原诊断。',
    isDefault: false,
    isEnabled: true,
    specimenTypes: ['中段尿'],
    operator: '魏明副主任检验师',
    operateTime: '2026-10-27 14:10:00',
  },

  // 1008 脑脊液常规培养
  {
    id: 'ct-1008-1',
    appCode: '1008',
    type: '镜检评语',
    content: '脑脊液沉渣直接革兰染色未见细菌，墨汁染色未见隐球菌。',
    isDefault: true,
    isEnabled: true,
    specimenTypes: ['脑脊液'],
    operator: '郭彩霞主任医师',
    operateTime: '2026-10-28 08:30:00',
  },
  {
    id: 'ct-1008-2',
    appCode: '1008',
    type: '危急值评语',
    content: '【危急值】脑脊液检出肺炎链球菌(+++)，药敏提示对头孢曲松敏感，已电话紧急通报神经科值班医生！',
    isDefault: false,
    isEnabled: true,
    specimenTypes: ['脑脊液'],
    operator: '郭彩霞主任医师',
    operateTime: '2026-10-28 09:20:00',
  },

  // 1009 创面脓液培养
  {
    id: 'ct-1009-1',
    appCode: '1009',
    type: '培养评语',
    content: '脓液标本培养 48 小时无致病菌生长。',
    isDefault: true,
    isEnabled: true,
    specimenTypes: ['脓液'],
    operator: '王宇轩技师',
    operateTime: '2026-10-27 16:30:00',
  },
  {
    id: 'ct-1009-2',
    appCode: '1009',
    type: '危急值评语',
    content: '【耐药预警】创面脓液检出耐碳青霉烯鲍曼不动杆菌(CRAB)，仅对多黏菌素B敏感，请立即落实接触隔离！',
    isDefault: false,
    isEnabled: true,
    specimenTypes: ['脓液'],
    operator: '李晓红主管检验师',
    operateTime: '2026-10-29 10:40:00',
  },

  // 1010 胸腹水常规增菌培养
  {
    id: 'ct-1010-1',
    appCode: '1010',
    type: '培养评语',
    content: '穿刺液连续增菌培养 5 天无细菌生长。',
    isDefault: true,
    isEnabled: true,
    specimenTypes: ['胸腹水'],
    operator: '刘浩然检验师',
    operateTime: '2026-10-28 17:00:00',
  },
  {
    id: 'ct-1010-2',
    appCode: '1010',
    type: '培养评语',
    content: '检出大肠埃希菌优势生长，生化鉴定确证，药敏结果详见报告单。',
    isDefault: false,
    isEnabled: true,
    specimenTypes: ['胸腹水'],
    operator: '魏明副主任检验师',
    operateTime: '2026-10-29 11:30:00',
  },
];
