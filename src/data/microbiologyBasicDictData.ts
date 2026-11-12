export type BasicDictType =
  | '存储设备字典'
  | '细菌通道码字典'
  | '抗生素通道码字典'
  | '手工药敏组'
  | '操作字典';

export interface StorageDeviceDictItem {
  id: string;
  code: string; // 设备编码
  name: string; // 设备名称
  type: '冰箱' | '铁架' | '菌株盒' | '培养箱'; // 设备类型
  isLeaf: '是' | '否'; // 末级存储
  parentDevice?: string; // 上级设备
  department: string; // 使用部门
  remarks: string; // 备注
  operator: string; // 操作人 (真实规范姓名)
  operateTime: string; // 操作时间 (近期时间 2026年10月)
  isEnabled: boolean; // 状态 (开关)
}

export interface BacteriaChannelDictItem {
  id: string;
  instrumentName: string; // 仪器设备
  organismName: string; // 细菌中文名
  channelCode: string; // 仪器通道码
  lisCode: string; // LIS标准码
  operator: string; // 操作人
  operateTime: string; // 操作时间
  isEnabled: boolean; // 状态
  remarks: string; // 备注
}

export interface AntibioticChannelDictItem {
  id: string;
  instrumentName: string; // 仪器设备
  antibioticName: string; // 抗生素名称
  channelCode: string; // 仪器通道码
  whonetCode: string; // WHONET代码
  concentrationRange: string; // 浓度范围
  operator: string; // 操作人
  operateTime: string; // 操作时间
  isEnabled: boolean; // 状态
  remarks: string; // 备注
}

export interface AstGroupDictItem {
  id: string;
  groupCode: string; // 药敏组编码
  groupName: string; // 药敏组名称
  targetOrganisms: string; // 适用菌群
  antibioticsList: string; // 包含抗生素清单
  operator: string; // 操作人
  operateTime: string; // 操作时间
  isEnabled: boolean; // 状态
  remarks: string; // 备注
}

export interface OperationDictItem {
  id: string;
  opType: string; // 操作类型
  opCode: string; // 操作编码
  opName: string; // 操作名称
  standardDuration: string; // 标准耗时
  operator: string; // 操作人
  operateTime: string; // 操作时间
  isEnabled: boolean; // 状态
  remarks: string; // 备注
}

export const INITIAL_STORAGE_DEVICES: StorageDeviceDictItem[] = [
  {
    id: 'sd-01',
    code: '01',
    name: '海尔冰箱 (4℃冷藏)',
    type: '冰箱',
    isLeaf: '否',
    parentDevice: '无上级设备',
    department: '检验科微生物实验室',
    remarks: '用于未接种平板、血清学试验试剂及常用染液暂存',
    operator: '李晓红主管检验师',
    operateTime: '2026-10-28 10:10:10',
    isEnabled: true,
  },
  {
    id: 'sd-02',
    code: '02',
    name: '海尔超低温冰箱 (-80℃)',
    type: '冰箱',
    isLeaf: '否',
    parentDevice: '无上级设备',
    department: '检验科微生物实验室',
    remarks: '临床分离致病菌、耐药菌株及国家质控标准株终末保藏设备',
    operator: '刘浩然检验师',
    operateTime: '2026-10-28 10:10:10',
    isEnabled: true,
  },
  {
    id: 'sd-03',
    code: '03',
    name: '上层一号铁架 (架位01)',
    type: '铁架',
    isLeaf: '否',
    parentDevice: '海尔超低温冰箱 (-80℃)',
    department: '检验科微生物实验室',
    remarks: '配置5层抽屉式冷冻架，存放国家药敏质控标准盒',
    operator: '郭彩霞主任医师',
    operateTime: '2026-10-28 11:20:00',
    isEnabled: true,
  },
  {
    id: 'sd-04',
    code: '04',
    name: '中层一号铁架 (架位02)',
    type: '铁架',
    isLeaf: '否',
    parentDevice: '海尔超低温冰箱 (-80℃)',
    department: '检验科微生物实验室',
    remarks: '配置5层抽屉式冷冻架，存放临床分离耐药株(CRE/MRSA)',
    operator: '魏明副主任检验师',
    operateTime: '2026-10-28 11:25:30',
    isEnabled: true,
  },
  {
    id: 'sd-05',
    code: '05',
    name: '18CLT01ECO 国家药敏标准质控菌株盒',
    type: '菌株盒',
    isLeaf: '是',
    parentDevice: '上层一号铁架 (架位01)',
    department: '检验科微生物实验室',
    remarks: '6×8规格48孔深低温耐冻盒，存放ATCC 25922、25923等标准株',
    operator: '王宇轩技师',
    operateTime: '2026-10-29 09:15:20',
    isEnabled: true,
  },
  {
    id: 'sd-06',
    code: '06',
    name: '19CLT01ECE 临床耐药菌保藏盒-01',
    type: '菌株盒',
    isLeaf: '是',
    parentDevice: '中层一号铁架 (架位02)',
    department: '检验科微生物实验室',
    remarks: '专用于临床血液及穿刺液分离的产碳青霉烯酶肺炎克雷伯菌保藏',
    operator: '孙丽丽主管检验师',
    operateTime: '2026-10-29 09:20:00',
    isEnabled: true,
  },
  {
    id: 'sd-07',
    code: '07',
    name: '二氧化碳恒温温箱 (35℃ 5% CO2)',
    type: '培养箱',
    isLeaf: '是',
    parentDevice: '无上级设备',
    department: '检验科微生物实验室',
    remarks: '用于苛养菌（脑膜炎奈瑟菌、流感嗜血杆菌、肺炎链球菌）培养',
    operator: '张建国检验师',
    operateTime: '2026-10-30 08:30:00',
    isEnabled: true,
  },
];

export const INITIAL_BACTERIA_CHANNELS: BacteriaChannelDictItem[] = [
  {
    id: 'bc-01',
    instrumentName: 'VITEK 2 Compact 鉴定仪',
    organismName: '大肠埃希菌',
    channelCode: 'EC01',
    lisCode: 'B001',
    operator: '李晓红主管检验师',
    operateTime: '2026-10-29 09:30:00',
    isEnabled: true,
    remarks: 'GN鉴定卡自动双向接口通信映射',
  },
  {
    id: 'bc-02',
    instrumentName: 'VITEK 2 Compact 鉴定仪',
    organismName: '肺炎克雷伯菌',
    channelCode: 'KP01',
    lisCode: 'B002',
    operator: '刘浩然检验师',
    operateTime: '2026-10-29 09:35:00',
    isEnabled: true,
    remarks: 'GN鉴定卡通道码',
  },
  {
    id: 'bc-03',
    instrumentName: 'VITEK 2 Compact 鉴定仪',
    organismName: '金黄色葡萄球菌',
    channelCode: 'SA01',
    lisCode: 'B003',
    operator: '郭彩霞主任医师',
    operateTime: '2026-10-29 09:40:00',
    isEnabled: true,
    remarks: 'GP鉴定卡通道码',
  },
  {
    id: 'bc-04',
    instrumentName: 'VITEK 2 Compact 鉴定仪',
    organismName: '铜绿假单胞菌',
    channelCode: 'PA01',
    lisCode: 'B004',
    operator: '魏明副主任检验师',
    operateTime: '2026-10-29 09:45:00',
    isEnabled: true,
    remarks: 'GN鉴定卡通道码',
  },
  {
    id: 'bc-05',
    instrumentName: 'MALDI-TOF 质谱仪',
    organismName: '鲍曼不动杆菌',
    channelCode: 'MS_ABA',
    lisCode: 'B005',
    operator: '王宇轩技师',
    operateTime: '2026-10-30 08:15:00',
    isEnabled: true,
    remarks: '质谱图谱数据库特征峰匹配通道',
  },
  {
    id: 'bc-06',
    instrumentName: 'MALDI-TOF 质谱仪',
    organismName: '屎肠球菌',
    channelCode: 'MS_EFA',
    lisCode: 'B006',
    operator: '孙丽丽主管检验师',
    operateTime: '2026-10-30 08:20:00',
    isEnabled: true,
    remarks: '质谱图谱数据库特征峰匹配通道',
  },
];

export const INITIAL_ANTIBIOTIC_CHANNELS: AntibioticChannelDictItem[] = [
  {
    id: 'ac-01',
    instrumentName: 'VITEK 2 AST-GN卡',
    antibioticName: '美罗培南',
    channelCode: 'MEM01',
    whonetCode: 'MEM',
    concentrationRange: '0.25 - 16 ug/mL',
    operator: '李晓红主管检验师',
    operateTime: '2026-10-29 14:15:00',
    isEnabled: true,
    remarks: '碳青霉烯类核心监测药物',
  },
  {
    id: 'ac-02',
    instrumentName: 'VITEK 2 AST-GN卡',
    antibioticName: '亚胺培南',
    channelCode: 'IPM01',
    whonetCode: 'IPM',
    concentrationRange: '0.25 - 16 ug/mL',
    operator: '刘浩然检验师',
    operateTime: '2026-10-29 14:20:00',
    isEnabled: true,
    remarks: '碳青霉烯类药物',
  },
  {
    id: 'ac-03',
    instrumentName: 'VITEK 2 AST-GN卡',
    antibioticName: '头孢他啶',
    channelCode: 'CAZ01',
    whonetCode: 'CAZ',
    concentrationRange: '1.0 - 64 ug/mL',
    operator: '郭彩霞主任医师',
    operateTime: '2026-10-29 14:25:00',
    isEnabled: true,
    remarks: '抗假单胞菌三代头孢',
  },
  {
    id: 'ac-04',
    instrumentName: 'VITEK 2 AST-GP卡',
    antibioticName: '万古霉素',
    channelCode: 'VAN01',
    whonetCode: 'VAN',
    concentrationRange: '0.5 - 32 ug/mL',
    operator: '魏明副主任检验师',
    operateTime: '2026-10-30 08:40:00',
    isEnabled: true,
    remarks: '糖肽类金标准药物',
  },
  {
    id: 'ac-05',
    instrumentName: 'VITEK 2 AST-GP卡',
    antibioticName: '利奈唑胺',
    channelCode: 'LZD01',
    whonetCode: 'LZD',
    concentrationRange: '0.5 - 16 ug/mL',
    operator: '王宇轩技师',
    operateTime: '2026-10-30 08:45:00',
    isEnabled: true,
    remarks: '恶唑烷酮类药物',
  },
];

export const INITIAL_AST_GROUPS: AstGroupDictItem[] = [
  {
    id: 'ag-01',
    groupCode: 'GNB-A',
    groupName: '肠杆菌目常规药敏组 (A组)',
    targetOrganisms: '大肠埃希菌、肺炎克雷伯菌、变形杆菌等',
    antibioticsList:
      '氨苄西林、头孢唑林、头孢呋辛、头孢他啶、头孢曲松、头孢吡肟、美罗培南、阿米卡星、环丙沙星、左氧氟沙星、复方磺胺',
    operator: '李晓红主管检验师',
    operateTime: '2026-10-30 08:45:00',
    isEnabled: true,
    remarks: 'CLSI首选A组一级报告抗生素列表',
  },
  {
    id: 'ag-02',
    groupCode: 'GNB-B',
    groupName: '非发酵革兰阴性杆菌药敏组 (B组)',
    targetOrganisms: '铜绿假单胞菌、鲍曼不动杆菌、嗜麦芽单胞菌',
    antibioticsList:
      '哌拉西林/他唑巴坦、头孢他啶、头孢吡肟、亚胺培南、美罗培南、阿米卡星、庆大霉素、环丙沙星、多粘菌素B',
    operator: '郭彩霞主任医师',
    operateTime: '2026-10-30 08:50:00',
    isEnabled: true,
    remarks: '适用于呼吸道重症感染与术后脓肿非发酵菌',
  },
  {
    id: 'ag-03',
    groupCode: 'GPB-01',
    groupName: '葡萄球菌常规药敏组',
    targetOrganisms: '金黄色葡萄球菌、表皮葡萄球菌等凝固酶阴性葡萄球菌',
    antibioticsList:
      '青霉素、头孢西丁(MRSA初筛)、苯唑西林、红霉素、克林霉素、左氧氟沙星、庆大霉素、万古霉素、利奈唑胺、达托霉素',
    operator: '魏明副主任检验师',
    operateTime: '2026-10-30 08:55:00',
    isEnabled: true,
    remarks: 'MRSA耐药筛查与重症救治全组合',
  },
  {
    id: 'ag-04',
    groupCode: 'URI-01',
    groupName: '尿路感染专项快速药敏组',
    targetOrganisms: '中段尿培养分离革兰阴性或阳性球菌',
    antibioticsList: '氨苄西林、阿莫西林/克拉维酸、呋喃妥因、磷霉素氨丁三醇、左氧氟沙星、头孢唑林',
    operator: '刘浩然检验师',
    operateTime: '2026-10-30 09:00:00',
    isEnabled: true,
    remarks: '尿液标本专用口服与高尿药浓度药物',
  },
];

export const INITIAL_OPERATIONS: OperationDictItem[] = [
  {
    id: 'op-01',
    opType: '标本接种',
    opCode: 'OP-INOC-01',
    opName: '四区定量划线接种法 (血平皿/MAC平皿)',
    standardDuration: '3分钟/份',
    operator: '李晓红主管检验师',
    operateTime: '2026-10-30 09:20:00',
    isEnabled: true,
    remarks: '确保获得纯化单菌落以供质谱与药敏测定',
  },
  {
    id: 'op-02',
    opType: '涂片染色',
    opCode: 'OP-GRAM-01',
    opName: '革兰染色标准操作规程 (四步法)',
    standardDuration: '8分钟/批',
    operator: '王宇轩技师',
    operateTime: '2026-10-30 09:25:00',
    isEnabled: true,
    remarks: '结晶紫-碘液-95%乙醇脱色-沙黄复染',
  },
  {
    id: 'op-03',
    opType: '仪器质谱',
    opCode: 'OP-MALDI-01',
    opName: 'MALDI-TOF 飞行时间质谱靶板点样法',
    standardDuration: '5分钟/板',
    operator: '刘浩然检验师',
    operateTime: '2026-10-30 09:30:00',
    isEnabled: true,
    remarks: '直接点样法加覆1uL HCCA基质液，室温自然结晶',
  },
  {
    id: 'op-04',
    opType: '药敏贴片',
    opCode: 'OP-KB-01',
    opName: 'Kirby-Bauer (K-B) 纸片琼脂扩散贴片法',
    standardDuration: '2分钟/皿',
    operator: '孙丽丽主管检验师',
    operateTime: '2026-10-30 09:35:00',
    isEnabled: true,
    remarks: '0.5麦氏比浊标准菌液涂布M-H琼脂，贴片间距≥24mm',
  },
  {
    id: 'op-05',
    opType: '菌种保藏',
    opCode: 'OP-CRYO-01',
    opName: '-80℃ 脱脂牛奶甘油冷冻管保藏程序',
    standardDuration: '10分钟/批',
    operator: '郭彩霞主任医师',
    operateTime: '2026-10-30 09:40:00',
    isEnabled: true,
    remarks: '无菌挑取纯培养物混匀于20%甘油肉汤，贴条码冷冻',
  },
];
