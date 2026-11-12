// 微生物系统 -> 基础设置 -> 质控项目管理数据模型与初始数据集

export type QcMainType = '试剂仪器质控' | '鉴定药敏质控';

export interface QcValueOption {
  id: string;
  itemValue: string;      // e.g. '无细菌生长', '有细菌生长', '生长不良'
  controlResult: '在控' | '失控' | '警告';
  isDefault: boolean;
}

export interface QcProjectItem {
  id: string;
  qcType: QcMainType;
  category: string;       // e.g. '培养基', '染色剂', '诊断试剂', 'API试剂', '高压灭菌锅'
  projectName: string;    // e.g. '制备日期', '失效日期', '颜色', '透明度', 'PH', '菌落情况'
  valueType: '固定值' | '数值型' | '文本描述';
  projectDescription: string;
  isEnabled: boolean;
  operator: string;
  operateTime: string;
  valueOptions: QcValueOption[];
}

export interface QcCategoryConfig {
  qcType: QcMainType;
  categories: string[];
}

// 质控类型与对象类别对应关系
export const QC_CATEGORY_MAPPINGS: Record<QcMainType, string[]> = {
  '试剂仪器质控': ['培养基', '染色剂', '诊断试剂', 'API试剂', '高压灭菌锅'],
  '鉴定药敏质控': ['MALDI-TOF质谱仪', 'VITEK 2测试卡', 'KB药敏纸片', '微量肉汤稀释板', 'E-test药敏条'],
};

// 初始质控项目列表 (完整还原 screenshot image_2f9cc129.png 培养基各项及丰富临床质控数据)
export const INITIAL_QC_PROJECTS: QcProjectItem[] = [
  // ------------------ 试剂仪器质控 -> 培养基 (精准对应截图) ------------------
  {
    id: 'qcp-01',
    qcType: '试剂仪器质控',
    category: '培养基',
    projectName: '制备日期',
    valueType: '固定值',
    projectDescription: '有无细菌描述及出厂制备批次核验',
    isEnabled: true,
    operator: '李晓红主管检验师',
    operateTime: '2026-10-25 09:15:20',
    valueOptions: [
      { id: 'v-01-1', itemValue: '批号与制备日期相符', controlResult: '在控', isDefault: true },
      { id: 'v-01-2', itemValue: '制备信息模糊无法识别', controlResult: '失控', isDefault: false },
    ],
  },
  {
    id: 'qcp-02',
    qcType: '试剂仪器质控',
    category: '培养基',
    projectName: '失效日期',
    valueType: '固定值',
    projectDescription: '培养基有效期及外包装密封性核对',
    isEnabled: true,
    operator: '郭彩霞主任医师',
    operateTime: '2026-10-25 10:20:00',
    valueOptions: [
      { id: 'v-02-1', itemValue: '处于有效使用期内', controlResult: '在控', isDefault: true },
      { id: 'v-02-2', itemValue: '已超过标称有效期', controlResult: '失控', isDefault: false },
      { id: 'v-02-3', itemValue: '临期不足7天', controlResult: '警告', isDefault: false },
    ],
  },
  {
    id: 'qcp-03',
    qcType: '试剂仪器质控',
    category: '培养基',
    projectName: '颜色',
    valueType: '固定值',
    projectDescription: '平板色泽均匀度与无变色溶血观察',
    isEnabled: true,
    operator: '魏明副主任检验师',
    operateTime: '2026-10-26 14:10:30',
    valueOptions: [
      { id: 'v-03-1', itemValue: '正常血红清亮(无溶血)', controlResult: '在控', isDefault: true },
      { id: 'v-03-2', itemValue: '暗红褐化/有轻度溶血', controlResult: '失控', isDefault: false },
      { id: 'v-03-3', itemValue: '明显发绿/发黑氧化', controlResult: '失控', isDefault: false },
    ],
  },
  {
    id: 'qcp-04',
    qcType: '试剂仪器质控',
    category: '培养基',
    projectName: '透明度',
    valueType: '固定值',
    projectDescription: '琼脂凝胶透光度及无沉淀杂质检定',
    isEnabled: true,
    operator: '刘浩然检验师',
    operateTime: '2026-10-26 15:30:00',
    valueOptions: [
      { id: 'v-04-1', itemValue: '透亮均一无杂质沉淀', controlResult: '在控', isDefault: true },
      { id: 'v-04-2', itemValue: '轻微浑浊微粒', controlResult: '警告', isDefault: false },
      { id: 'v-04-3', itemValue: '明显浑浊/有沉淀团块', controlResult: '失控', isDefault: false },
    ],
  },
  {
    id: 'qcp-05',
    qcType: '试剂仪器质控',
    category: '培养基',
    projectName: 'PH',
    valueType: '固定值',
    projectDescription: '凝胶介质酸碱度平稳性 (7.2-7.4)',
    isEnabled: true,
    operator: '王宇轩技师',
    operateTime: '2026-10-27 11:00:15',
    valueOptions: [
      { id: 'v-05-1', itemValue: 'pH 7.2 - 7.4 (标称在控)', controlResult: '在控', isDefault: true },
      { id: 'v-05-2', itemValue: 'pH < 7.0 (明显偏酸)', controlResult: '失控', isDefault: false },
      { id: 'v-05-3', itemValue: 'pH > 7.6 (明显偏碱)', controlResult: '失控', isDefault: false },
    ],
  },
  {
    id: 'qcp-06',
    qcType: '试剂仪器质控',
    category: '培养基',
    projectName: '琼脂厚度',
    valueType: '固定值',
    projectDescription: '标准平板浇注厚度 4.0±0.5mm',
    isEnabled: true,
    operator: '李晓红主管检验师',
    operateTime: '2026-10-27 16:40:20',
    valueOptions: [
      { id: 'v-06-1', itemValue: '厚度4.0±0.5mm (合格)', controlResult: '在控', isDefault: true },
      { id: 'v-06-2', itemValue: '厚度<3.0mm (过薄易干裂)', controlResult: '失控', isDefault: false },
      { id: 'v-06-3', itemValue: '厚度>5.0mm (过厚影响纸片扩散)', controlResult: '失控', isDefault: false },
    ],
  },
  {
    id: 'qcp-07',
    qcType: '试剂仪器质控',
    category: '培养基',
    projectName: '斜面长度',
    valueType: '固定值',
    projectDescription: '斜面与底层高层比例质控 (如克氏双糖铁KIA)',
    isEnabled: true,
    operator: '郭彩霞主任医师',
    operateTime: '2026-10-28 09:20:10',
    valueOptions: [
      { id: 'v-07-1', itemValue: '斜面与高层 2:3 比例标准', controlResult: '在控', isDefault: true },
      { id: 'v-07-2', itemValue: '无高层底柱/斜面过长', controlResult: '失控', isDefault: false },
    ],
  },
  {
    id: 'qcp-08',
    qcType: '试剂仪器质控',
    category: '培养基',
    projectName: '双糖铁斜面长度',
    valueType: '固定值',
    projectDescription: 'TSI三糖铁琼脂管斜面及深层比例',
    isEnabled: true,
    operator: '魏明副主任检验师',
    operateTime: '2026-10-28 10:45:00',
    valueOptions: [
      { id: 'v-08-1', itemValue: '斜面3cm 高层2.5cm 符合标准', controlResult: '在控', isDefault: true },
      { id: 'v-08-2', itemValue: '高层不足2cm', controlResult: '失控', isDefault: false },
    ],
  },
  {
    id: 'qcp-09',
    qcType: '试剂仪器质控',
    category: '培养基',
    projectName: '失水情况',
    valueType: '固定值',
    projectDescription: '冷藏及温箱存放失水冷凝水评估',
    isEnabled: true,
    operator: '刘浩然检验师',
    operateTime: '2026-10-28 15:30:40',
    valueOptions: [
      { id: 'v-09-1', itemValue: '无明显脱水或积水', controlResult: '在控', isDefault: true },
      { id: 'v-09-2', itemValue: '皿盖大量冷凝积水', controlResult: '警告', isDefault: false },
      { id: 'v-09-3', itemValue: '凝胶脱水收缩凹陷', controlResult: '失控', isDefault: false },
    ],
  },
  {
    id: 'qcp-10',
    qcType: '试剂仪器质控',
    category: '培养基',
    projectName: '菌落情况',
    valueType: '固定值',
    projectDescription: '空白平板无菌实验 (对应截图项目值: 无细菌生长、有细菌生长、生长不良)',
    isEnabled: true,
    operator: '李晓红主管检验师',
    operateTime: '2026-10-29 08:50:00',
    valueOptions: [
      { id: 'v-10-1', itemValue: '无细菌生长', controlResult: '在控', isDefault: true },
      { id: 'v-10-2', itemValue: '有细菌生长', controlResult: '失控', isDefault: false },
      { id: 'v-10-3', itemValue: '生长不良', controlResult: '失控', isDefault: false },
    ],
  },
  {
    id: 'qcp-11',
    qcType: '试剂仪器质控',
    category: '培养基',
    projectName: '干裂情况',
    valueType: '固定值',
    projectDescription: '平板凝胶结构完整性与弹性检视',
    isEnabled: true,
    operator: '王宇轩技师',
    operateTime: '2026-10-29 14:15:30',
    valueOptions: [
      { id: 'v-11-1', itemValue: '平整光滑无裂纹', controlResult: '在控', isDefault: true },
      { id: 'v-11-2', itemValue: '边缘细微裂隙', controlResult: '警告', isDefault: false },
      { id: 'v-11-3', itemValue: '贯穿性干裂断裂', controlResult: '失控', isDefault: false },
    ],
  },

  // ------------------ 试剂仪器质控 -> 染色剂 ------------------
  {
    id: 'qcp-12',
    qcType: '试剂仪器质控',
    category: '染色剂',
    projectName: '革兰染色质控菌比对',
    valueType: '固定值',
    projectDescription: 'ATCC 25922大肠与ATCC 25923金葡双菌阴阳性对照',
    isEnabled: true,
    operator: '郭彩霞主任医师',
    operateTime: '2026-10-27 10:15:00',
    valueOptions: [
      { id: 'v-12-1', itemValue: '金葡呈深紫阳性/大肠呈鲜红阴性', controlResult: '在控', isDefault: true },
      { id: 'v-12-2', itemValue: '脱色过度(金葡变红)', controlResult: '失控', isDefault: false },
      { id: 'v-12-3', itemValue: '脱色不足(大肠变紫)', controlResult: '失控', isDefault: false },
    ],
  },
  {
    id: 'qcp-13',
    qcType: '试剂仪器质控',
    category: '染色剂',
    projectName: '抗酸染色试剂纯度',
    valueType: '固定值',
    projectDescription: '石炭酸复红与盐酸酒精脱色有效性',
    isEnabled: true,
    operator: '魏明副主任检验师',
    operateTime: '2026-10-28 11:30:20',
    valueOptions: [
      { id: 'v-13-1', itemValue: '背景洁净无结晶沉淀', controlResult: '在控', isDefault: true },
      { id: 'v-13-2', itemValue: '染料析出大量颗粒结晶', controlResult: '失控', isDefault: false },
    ],
  },

  // ------------------ 试剂仪器质控 -> 诊断试剂 ------------------
  {
    id: 'qcp-14',
    qcType: '试剂仪器质控',
    category: '诊断试剂',
    projectName: '氧化酶试剂活性',
    valueType: '固定值',
    projectDescription: '1%盐酸四甲基对苯二胺10秒变色检定',
    isEnabled: true,
    operator: '刘浩然检验师',
    operateTime: '2026-10-28 16:10:00',
    valueOptions: [
      { id: 'v-14-1', itemValue: '铜绿假单胞菌10秒内显深蓝紫色', controlResult: '在控', isDefault: true },
      { id: 'v-14-2', itemValue: '试剂自发变紫氧化变质', controlResult: '失控', isDefault: false },
      { id: 'v-14-3', itemValue: '阳性菌不显色', controlResult: '失控', isDefault: false },
    ],
  },

  // ------------------ 试剂仪器质控 -> 高压灭菌锅 ------------------
  {
    id: 'qcp-15',
    qcType: '试剂仪器质控',
    category: '高压灭菌锅',
    projectName: '嗜热脂肪芽胞生物指示剂质控',
    valueType: '固定值',
    projectDescription: '121℃ 20分钟高压灭菌生物指示管培养验证',
    isEnabled: true,
    operator: '王宇轩技师',
    operateTime: '2026-10-29 09:30:10',
    valueOptions: [
      { id: 'v-15-1', itemValue: '灭菌管56℃培养48h无菌生长变色', controlResult: '在控', isDefault: true },
      { id: 'v-15-2', itemValue: '灭菌管变黄混浊(灭菌未达标)', controlResult: '失控', isDefault: false },
    ],
  },

  // ------------------ 鉴定药敏质控 -> MALDI-TOF质谱仪 ------------------
  {
    id: 'qcp-16',
    qcType: '鉴定药敏质控',
    category: 'MALDI-TOF质谱仪',
    projectName: 'BTS标准蛋白校准打分',
    valueType: '固定值',
    projectDescription: '大肠埃希菌标准分子量校准物激光打靶',
    isEnabled: true,
    operator: '郭彩霞主任医师',
    operateTime: '2026-10-29 10:15:20',
    valueOptions: [
      { id: 'v-16-1', itemValue: '校准打分 >= 2.20 (优秀在控)', controlResult: '在控', isDefault: true },
      { id: 'v-16-2', itemValue: '校准打分 2.00 - 2.19 (合格)', controlResult: '在控', isDefault: false },
      { id: 'v-16-3', itemValue: '校准打分 < 2.00 (激光/基质失控)', controlResult: '失控', isDefault: false },
    ],
  },

  // ------------------ 鉴定药敏质控 -> KB药敏纸片 ------------------
  {
    id: 'qcp-17',
    qcType: '鉴定药敏质控',
    category: 'KB药敏纸片',
    projectName: '大肠ATCC 25922美罗培南抑菌圈',
    valueType: '固定值',
    projectDescription: 'CLSI 2026规定美罗培南(10μg)范围 28-34mm',
    isEnabled: true,
    operator: '魏明副主任检验师',
    operateTime: '2026-10-29 14:30:00',
    valueOptions: [
      { id: 'v-17-1', itemValue: '抑菌圈 28 - 34 mm (合格在控)', controlResult: '在控', isDefault: true },
      { id: 'v-17-2', itemValue: '抑菌圈 < 28 mm (纸片失效或接种过浓)', controlResult: '失控', isDefault: false },
      { id: 'v-17-3', itemValue: '抑菌圈 > 34 mm (接种过稀或平板过薄)', controlResult: '失控', isDefault: false },
    ],
  },
  {
    id: 'qcp-18',
    qcType: '鉴定药敏质控',
    category: 'KB药敏纸片',
    projectName: '金葡ATCC 25923苯唑西林抑菌圈',
    valueType: '固定值',
    projectDescription: '苯唑西林(1μg)抑制圈标准范围 18-24mm',
    isEnabled: true,
    operator: '李晓红主管检验师',
    operateTime: '2026-10-30 08:45:00',
    valueOptions: [
      { id: 'v-18-1', itemValue: '抑菌圈 18 - 24 mm (在控)', controlResult: '在控', isDefault: true },
      { id: 'v-18-2', itemValue: '抑菌圈 < 18 mm', controlResult: '失控', isDefault: false },
      { id: 'v-18-3', itemValue: '抑菌圈 > 24 mm', controlResult: '失控', isDefault: false },
    ],
  },
];
