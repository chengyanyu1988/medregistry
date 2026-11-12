export interface AuthorizedTech {
  id: string;
  staffId: string;
  name: string;
  title: string;
  phone: string;
  shift: string;
  isAuthorized: boolean;
}

export interface UnitLinkedItem {
  itemCode: string;
  itemName: string;
  englishName: string;
  decimalPlaces: number;
  unit: string;
  testMethod: string;
}

export interface UnitApplyOrder {
  id: string;
  applyCode: string;
  applyName: string;
  items: UnitLinkedItem[];
}

export interface TestUnitItem {
  id: string;
  code: string;
  name: string;
  group: '临检' | '生化' | '免疫' | '凝血' | '微生物';
  status: '在用' | '停用';
  instrumentName: string;
  updateTime: string;
  operator: string;
  notes?: string;
  applyOrders: UnitApplyOrder[];
  authorizedTechs: AuthorizedTech[];
}

export const INITIAL_TEST_UNITS: TestUnitItem[] = [
  {
    id: 'tu-101',
    code: '1001',
    name: '血常规分析单元 (Sysmex XS-500i)',
    group: '临检',
    status: '在用',
    instrumentName: 'Sysmex XS-500i 全自动血细胞分析仪',
    updateTime: '2026-10-29 09:20:00',
    operator: '张珊',
    notes: '临检1号窗口全血常规五分类分析工位',
    applyOrders: [
      {
        id: 'uao-01',
        applyCode: '0012',
        applyName: '全血常规五分类',
        items: [
          { itemCode: '0020', itemName: '白细胞计数', englishName: 'WBC', decimalPlaces: 2, unit: '10^9/L', testMethod: '流式半导体激光散射法' },
          { itemCode: '0021', itemName: '红细胞计数', englishName: 'RBC', decimalPlaces: 2, unit: '10^12/L', testMethod: '鞘流阻抗法' },
          { itemCode: '0022', itemName: '血红蛋白浓度', englishName: 'HGB', decimalPlaces: 1, unit: 'g/L', testMethod: 'SLS血红蛋白法' },
          { itemCode: '0023', itemName: '血小板计数', englishName: 'PLT', decimalPlaces: 0, unit: '10^9/L', testMethod: '鞘流阻抗法' },
        ],
      },
      {
        id: 'uao-02',
        applyCode: '0015',
        applyName: '末梢血常规加CRP',
        items: [
          { itemCode: '0020', itemName: '白细胞计数', englishName: 'WBC', decimalPlaces: 2, unit: '10^9/L', testMethod: '流式半导体激光散射法' },
          { itemCode: '2013', itemName: '超敏C反应蛋白', englishName: 'hs-CRP', decimalPlaces: 2, unit: 'mg/L', testMethod: '乳胶增强免疫比浊法' },
        ],
      },
    ],
    authorizedTechs: [
      { id: 'at-01', staffId: 'T001', name: '张珊', title: '主管检验师', phone: '13800138001', shift: '白班 (08:00-16:00)', isAuthorized: true },
      { id: 'at-02', staffId: 'T002', name: '蔡文斌', title: '检验师', phone: '13800138002', shift: '夜班 (16:00-24:00)', isAuthorized: true },
    ],
  },
  {
    id: 'tu-102',
    code: '1002',
    name: '高速生化分析单元 (贝克曼 AU5800)',
    group: '生化',
    status: '在用',
    instrumentName: 'Beckman Coulter AU5800 自动生化分析仪',
    updateTime: '2026-10-29 08:45:00',
    operator: '蔡文斌',
    notes: '门诊与住院生化常规2000测定/小时主干工位',
    applyOrders: [
      {
        id: 'uao-03',
        applyCode: '1001',
        applyName: '生化肝功能常规十一项',
        items: [
          { itemCode: '1001', itemName: '丙氨酸氨基转移酶', englishName: 'ALT', decimalPlaces: 1, unit: 'U/L', testMethod: '速率法 (IFCC)' },
          { itemCode: '1002', itemName: '天门冬氨酸氨基转移酶', englishName: 'AST', decimalPlaces: 1, unit: 'U/L', testMethod: '速率法' },
          { itemCode: '0013', itemName: '血清总钙', englishName: 'Ca', decimalPlaces: 2, unit: 'mmol/L', testMethod: '偶氮砷Ⅲ终点显色法' },
          { itemCode: '1004', itemName: '总蛋白', englishName: 'TP', decimalPlaces: 1, unit: 'g/L', testMethod: '双缩脲双试剂法' },
        ],
      },
      {
        id: 'uao-04',
        applyCode: '1002',
        applyName: '肾功能电解质组合',
        items: [
          { itemCode: '1007', itemName: '肌酐 (酶法)', englishName: 'CREA', decimalPlaces: 1, unit: 'μmol/L', testMethod: '肌氨酸氧化酶法' },
          { itemCode: '1008', itemName: '尿素氮', englishName: 'UREA', decimalPlaces: 2, unit: 'mmol/L', testMethod: '脲酶-谷氨酸脱氢酶法' },
        ],
      },
    ],
    authorizedTechs: [
      { id: 'at-03', staffId: 'T003', name: '陈志远', title: '副主任检验师', phone: '13800138003', shift: '常白班', isAuthorized: true },
      { id: 'at-04', staffId: 'T004', name: '林德胜', title: '检验师', phone: '13800138004', shift: '小夜班', isAuthorized: true },
    ],
  },
  {
    id: 'tu-103',
    code: '1003',
    name: '尿液干化学与沉渣单元 (优利特 UT200)',
    group: '临检',
    status: '在用',
    instrumentName: 'URIT-200 全自动尿液有形成分分析仪',
    updateTime: '2026-10-28 16:10:00',
    operator: '陈志远',
    notes: '尿液干化学11项及尿沉渣红白细胞管型计数',
    applyOrders: [
      {
        id: 'uao-05',
        applyCode: '0014',
        applyName: '尿液干化学及沉渣镜检',
        items: [
          { itemCode: '0012', itemName: '尿液PH值', englishName: 'PH', decimalPlaces: 2, unit: 'mmol/L', testMethod: '指示剂pH试纸法' },
          { itemCode: '0030', itemName: '尿蛋白定量', englishName: 'PRO', decimalPlaces: 1, unit: 'g/L', testMethod: '蛋白质误差法' },
        ],
      },
    ],
    authorizedTechs: [
      { id: 'at-05', staffId: 'T005', name: '黄雅芳', title: '主管检验师', phone: '13800138005', shift: '白班', isAuthorized: true },
    ],
  },
  {
    id: 'tu-104',
    code: '1004',
    name: '发光免疫检测单元 (安图 AutoLumo A2000P)',
    group: '免疫',
    status: '在用',
    instrumentName: 'AutoLumo A2000P 全自动化学发光测定仪',
    updateTime: '2026-10-28 14:30:00',
    operator: '林德胜',
    notes: '乙肝五项、甲功、肿瘤标志物微粒发光检测',
    applyOrders: [
      {
        id: 'uao-06',
        applyCode: '2001',
        applyName: '乙型肝炎标志物定量',
        items: [
          { itemCode: '2002', itemName: '乙肝表面抗原', englishName: 'HBsAg', decimalPlaces: 2, unit: 'COI', testMethod: '磁微粒管式化学发光法' },
          { itemCode: '2006', itemName: '乙肝表面抗体', englishName: 'HBsAb', decimalPlaces: 2, unit: 'mIU/mL', testMethod: '磁微粒化学发光法' },
        ],
      },
    ],
    authorizedTechs: [
      { id: 'at-06', staffId: 'T006', name: '徐晓丽', title: '检验师', phone: '13800138006', shift: '常白班', isAuthorized: true },
    ],
  },
  {
    id: 'tu-105',
    code: '1005',
    name: '生化免疫流水线 (罗氏 Cobas 8000 c702+e801)',
    group: '生化',
    status: '在用',
    instrumentName: 'Roche Cobas 8000 模块化组合分析系统',
    updateTime: '2026-10-27 15:40:00',
    operator: '黄雅芳',
    notes: '全自动化轨道离心、盖帽剥离与高通量检测',
    applyOrders: [
      {
        id: 'uao-07',
        applyCode: '1003',
        applyName: '全套血脂及心血管风险指标',
        items: [
          { itemCode: '1010', itemName: '总胆固醇', englishName: 'TC', decimalPlaces: 2, unit: 'mmol/L', testMethod: 'CHOD-PAP酶法' },
          { itemCode: '1011', itemName: '甘油三酯', englishName: 'TG', decimalPlaces: 2, unit: 'mmol/L', testMethod: 'GPO-PAP酶法' },
        ],
      },
    ],
    authorizedTechs: [
      { id: 'at-07', staffId: 'T007', name: '刘洋', title: '主管检验师', phone: '13800138007', shift: '流水线值班', isAuthorized: true },
    ],
  },
  {
    id: 'tu-106',
    code: '1006',
    name: '急诊发光集成工位 (雅培 Alinity ci)',
    group: '免疫',
    status: '在用',
    instrumentName: 'Abbott Alinity ci 整合化学发光与生化平台',
    updateTime: '2026-10-27 10:10:00',
    operator: '徐晓丽',
    notes: '急诊胸痛中心 hs-cTnI 与 NT-proBNP 15分钟出报告',
    applyOrders: [
      {
        id: 'uao-08',
        applyCode: '2003',
        applyName: '急诊心肌坏死三项',
        items: [
          { itemCode: '2001', itemName: '高敏肌钙蛋白I', englishName: 'hs-cTnI', decimalPlaces: 3, unit: 'ng/mL', testMethod: '化学发光微粒免疫法' },
          { itemCode: '2011', itemName: '肌酸激酶同工酶', englishName: 'CK-MB', decimalPlaces: 2, unit: 'ng/mL', testMethod: '化学发光法' },
        ],
      },
    ],
    authorizedTechs: [
      { id: 'at-08', staffId: 'T008', name: '赵海琴', title: '检验师', phone: '13800138008', shift: '急诊轮班', isAuthorized: true },
    ],
  },
  {
    id: 'tu-107',
    code: '1007',
    name: '全自动血凝分析单元 (沃芬 ACL TOP 700)',
    group: '凝血',
    status: '在用',
    instrumentName: 'Werfen ACL TOP 700 全自动凝血分析仪',
    updateTime: '2026-10-26 14:00:00',
    operator: '刘洋',
    notes: '术前凝血四项与 D-二聚体光学比浊测定',
    applyOrders: [
      {
        id: 'uao-09',
        applyCode: '3001',
        applyName: '凝血常规四项',
        items: [
          { itemCode: '3001', itemName: '凝血酶原时间', englishName: 'PT', decimalPlaces: 1, unit: '秒', testMethod: '凝固法 (光学法)' },
          { itemCode: '3002', itemName: '活化部分凝血活酶时间', englishName: 'APTT', decimalPlaces: 1, unit: '秒', testMethod: '凝固法' },
        ],
      },
    ],
    authorizedTechs: [
      { id: 'at-09', staffId: 'T001', name: '张珊', title: '主管检验师', phone: '13800138001', shift: '凝血组白班', isAuthorized: true },
    ],
  },
  {
    id: 'tu-108',
    code: '1008',
    name: '血培养及细菌鉴定单元 (BD BACTEC FX + 质谱)',
    group: '微生物',
    status: '在用',
    instrumentName: 'BD BACTEC FX 双相血培养 + 布鲁克MALDI-TOF质谱',
    updateTime: '2026-10-26 11:20:00',
    operator: '赵海琴',
    notes: '血流感染连续荧光监控报阳与质谱10分钟菌种鉴定',
    applyOrders: [
      {
        id: 'uao-10',
        applyCode: '4001',
        applyName: '全自动血培养及鉴定药敏',
        items: [
          { itemCode: '4001', itemName: '血培养及药敏试验', englishName: 'Blood Culture', decimalPlaces: 0, unit: '报告', testMethod: 'MALDI-TOF质谱 + MIC抑菌圈' },
        ],
      },
    ],
    authorizedTechs: [
      { id: 'at-10', staffId: 'T002', name: '蔡文斌', title: '检验师', phone: '13800138002', shift: '微生物值班', isAuthorized: true },
    ],
  },
  {
    id: 'tu-109',
    code: '1009',
    name: '糖化血红蛋白分析单元 (Sysmex G8 HPLC)',
    group: '生化',
    status: '停用',
    instrumentName: 'Tosoh G8 高效液相色谱糖化分析仪',
    updateTime: '2026-10-25 16:00:00',
    operator: '张珊',
    notes: 'HPLC法准确测定 HbA1c，备用机位',
    applyOrders: [],
    authorizedTechs: [],
  },
  {
    id: 'tu-110',
    code: '1010',
    name: '血气与酸碱平衡单元 (雷度 ABL800 FLEX)',
    group: '临检',
    status: '在用',
    instrumentName: 'Radiometer ABL800 FLEX 急诊血气分析仪',
    updateTime: '2026-10-25 09:30:00',
    operator: '蔡文斌',
    notes: 'ICU及急诊抢救室动脉血气、电解质、乳酸快速分析',
    applyOrders: [
      {
        id: 'uao-11',
        applyCode: '0018',
        applyName: '动脉血气分析全套',
        items: [
          { itemCode: '0012', itemName: 'pH值', englishName: 'pH', decimalPlaces: 3, unit: 'mmol/L', testMethod: '玻璃电极电位法' },
        ],
      },
    ],
    authorizedTechs: [
      { id: 'at-11', staffId: 'T003', name: '陈志远', title: '副主任检验师', phone: '13800138003', shift: '急诊白班', isAuthorized: true },
    ],
  },
];
