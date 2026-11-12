import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Trash2,
  Edit,
  Download,
  ChevronRight,
  ChevronDown,
  X,
  FileText,
  Printer,
  RotateCcw,
  FileCheck,
  Eye,
  Archive,
  DollarSign,
  Building2,
  CalendarCheck,
  Send,
  Boxes,
  Check,
  Layers,
  Activity,
  QrCode,
  FolderOpen,
  Copy,
  Sliders,
  CheckSquare,
} from './MenuIcon';

export interface UsageItem {
  code: string;
  name: string;
  spec: string;
  lotNo: string;
  expireDate: string;
  category: '常规检测消耗' | '质控定标耗用' | '复检复测消耗' | '应急加急耗用' | '仪器维护冲洗';
  qty: number;
  unit: string;
  price: number;
  amount: number;
  testCapacity: number; // 测试容量 (次)
}

export interface UsageOrder {
  id: string;
  orderNo: string;
  tabType: 'usage' | 'onboard'; // 出库使用登记 | 机上调入与核销
  warehouse: string; // 库房
  user: string; // 使用者 (领用技师)
  desc: string; // 说明用途
  operator: string; // 操作人 (登记人员)
  operateTime: string; // 操作时间
  submitter: string; // 提交/审核人
  submitTime: string; // 提交时间
  status: '登记' | '发送' | '已核销'; // 状态
  machine: string; // 适用分析仪器 / 机台
  hospitalDept?: string;
  items: UsageItem[];
  totalAmount: number;
  totalTests: number;
}

// 可选仪器列表
const ANALYZER_MACHINES = [
  'Roche Cobas 8000 (c702+c502)',
  'Beckman Coulter AU5800 生化分析流水线',
  'Sysmex XN-9000 全自动血液体液分析流水线',
  'Siemens Atellica Solution 发光分析仪',
  'Stago STA-R Max 全自动凝血分析仪',
  'Hitachi 7600 全自动生化分析仪',
];

// 常用候选试剂库 (用于在弹窗中选择并加入清单)
const REAGENT_CATALOG = [
  {
    code: '010012',
    name: '丙氨酸氨基转移酶(ALT)测定试剂盒(IFCC速率法)',
    spec: 'R1: 4×60ml, R2: 4×20ml',
    lotNo: 'LOT-261015A',
    expireDate: '2027-10-14',
    price: 380.0,
    unit: '盒',
    singleTestCapacity: 800,
  },
  {
    code: '010013',
    name: '天门冬氨酸氨基转移酶(AST)测定试剂盒',
    spec: 'R1: 4×60ml, R2: 4×20ml',
    lotNo: 'LOT-261015B',
    expireDate: '2027-10-14',
    price: 380.0,
    unit: '盒',
    singleTestCapacity: 800,
  },
  {
    code: '010018',
    name: '肌酐(Cr)测定试剂盒(肌氨酸氧化酶法)',
    spec: 'R1: 3×70ml, R2: 3×25ml',
    lotNo: 'LOT-261002A',
    expireDate: '2027-09-30',
    price: 420.0,
    unit: '盒',
    singleTestCapacity: 800,
  },
  {
    code: '010019',
    name: '尿素(UREA)测定试剂盒(酶动力学法)',
    spec: 'R1: 4×60ml, R2: 4×20ml',
    lotNo: 'LOT-260920U',
    expireDate: '2027-09-19',
    price: 320.0,
    unit: '盒',
    singleTestCapacity: 1000,
  },
  {
    code: '010201',
    name: '复合生化多项室内质控品(正常水平 Level 1)',
    spec: '5ml×10支/盒',
    lotNo: 'LOT-260801QC1',
    expireDate: '2027-07-31',
    price: 850.0,
    unit: '盒',
    singleTestCapacity: 120,
  },
  {
    code: '010202',
    name: '复合生化多项室内质控品(病理高值 Level 2)',
    spec: '5ml×10支/盒',
    lotNo: 'LOT-260801QC2',
    expireDate: '2027-07-31',
    price: 850.0,
    unit: '盒',
    singleTestCapacity: 120,
  },
  {
    code: '010210',
    name: '血清总胆红素/直接胆红素校准品(C.f.a.s)',
    spec: '3ml×6支/盒',
    lotNo: 'LOT-260810CAL',
    expireDate: '2027-08-09',
    price: 1200.0,
    unit: '盒',
    singleTestCapacity: 120,
  },
  {
    code: '010035',
    name: '肌酸激酶同工酶(CK-MB)测定试剂盒',
    spec: '2×50ml/盒',
    lotNo: 'LOT-261011C',
    expireDate: '2027-10-10',
    price: 480.0,
    unit: '盒',
    singleTestCapacity: 500,
  },
];

// 初始高真实感临床使用单据列表 (近一个月时间 2026-10 / 2026-11，真实检验师姓名)
const INITIAL_USAGE_ORDERS: UsageOrder[] = [
  // 单据 1 (严格匹配截图 image_7d8fa656.png 第1行 N0000004)
  {
    id: 'USE-001',
    orderNo: 'N0000004',
    tabType: 'usage',
    warehouse: '生化组库房',
    user: '刘浩然技师',
    desc: '罗氏Cobas 8000全自动生化分析仪日间门诊常规检测及急诊加急生化检测开瓶领用',
    operator: '魏明主管检验师',
    operateTime: '2026-10-30 08:30:15',
    submitter: '',
    submitTime: '',
    status: '登记',
    machine: 'Roche Cobas 8000 (c702+c502)',
    hospitalDept: '中心医院临床检验中心生化组',
    items: [
      {
        code: '010012',
        name: '丙氨酸氨基转移酶(ALT)测定试剂盒(IFCC速率法)',
        spec: 'R1: 4×60ml, R2: 4×20ml',
        lotNo: 'LOT-261015A',
        expireDate: '2027-10-14',
        category: '常规检测消耗',
        qty: 2,
        unit: '盒',
        price: 380.0,
        amount: 760.0,
        testCapacity: 1600,
      },
      {
        code: '010013',
        name: '天门冬氨酸氨基转移酶(AST)测定试剂盒',
        spec: 'R1: 4×60ml, R2: 4×20ml',
        lotNo: 'LOT-261015B',
        expireDate: '2027-10-14',
        category: '常规检测消耗',
        qty: 2,
        unit: '盒',
        price: 380.0,
        amount: 760.0,
        testCapacity: 1600,
      },
      {
        code: '010018',
        name: '肌酐(Cr)测定试剂盒(肌氨酸氧化酶法)',
        spec: 'R1: 3×70ml, R2: 3×25ml',
        lotNo: 'LOT-261002A',
        expireDate: '2027-09-30',
        category: '常规检测消耗',
        qty: 1,
        unit: '盒',
        price: 420.0,
        amount: 420.0,
        testCapacity: 800,
      },
    ],
    totalAmount: 1940.0,
    totalTests: 4000,
  },

  // 单据 2 (严格匹配截图第2行 N0000003)
  {
    id: 'USE-002',
    orderNo: 'N0000003',
    tabType: 'usage',
    warehouse: '生化组库房',
    user: '陈康主管检验师',
    desc: '贝克曼AU5800电解质ISE模块电极活化缓冲液及清洗液更换耗用',
    operator: '陈康主管检验师',
    operateTime: '2026-10-29 14:15:20',
    submitter: '',
    submitTime: '',
    status: '登记',
    machine: 'Beckman Coulter AU5800 生化分析流水线',
    hospitalDept: '中心医院临床检验中心生化组',
    items: [
      {
        code: '010042',
        name: '电解质ISE电极内部标准参比液(A/B液)',
        spec: '2000ml×2瓶/套',
        lotNo: 'LOT-260905ISE',
        expireDate: '2027-09-04',
        category: '仪器维护冲洗',
        qty: 1,
        unit: '套',
        price: 680.0,
        amount: 680.0,
        testCapacity: 3000,
      },
      {
        code: '010043',
        name: '全自动生化分析仪反应杯酸性浓缩清洗液',
        spec: '5000ml/桶',
        lotNo: 'LOT-260820W',
        expireDate: '2028-08-19',
        category: '仪器维护冲洗',
        qty: 1,
        unit: '桶',
        price: 360.0,
        amount: 360.0,
        testCapacity: 5000,
      },
    ],
    totalAmount: 1040.0,
    totalTests: 8000,
  },

  // 单据 3 (严格匹配截图第3行 N0000002 及截图 image_9bcbf955.png)
  {
    id: 'USE-003',
    orderNo: 'N0000002',
    tabType: 'usage',
    warehouse: '生化组库房',
    user: '李晓红副主任技师',
    desc: '全自动生化分析仪多项质控品定标、每日室内质控(IQC)双水平测试消耗',
    operator: '刘浩然技师',
    operateTime: '2026-10-28 07:45:00',
    submitter: '李晓红副主任技师',
    submitTime: '2026-10-28 08:10:22',
    status: '发送',
    machine: 'Roche Cobas 8000 (c702+c502)',
    hospitalDept: '中心医院临床检验中心生化组',
    items: [
      {
        code: '010201',
        name: '复合生化多项室内质控品(正常水平 Level 1)',
        spec: '5ml×10支/盒',
        lotNo: 'LOT-260801QC1',
        expireDate: '2027-07-31',
        category: '质控定标耗用',
        qty: 1,
        unit: '盒',
        price: 850.0,
        amount: 850.0,
        testCapacity: 120,
      },
      {
        code: '010202',
        name: '复合生化多项室内质控品(病理高值 Level 2)',
        spec: '5ml×10支/盒',
        lotNo: 'LOT-260801QC2',
        expireDate: '2027-07-31',
        category: '质控定标耗用',
        qty: 1,
        unit: '盒',
        price: 850.0,
        amount: 850.0,
        testCapacity: 120,
      },
      {
        code: '010210',
        name: '血清总胆红素/直接胆红素校准品(C.f.a.s)',
        spec: '3ml×6支/盒',
        lotNo: 'LOT-260810CAL',
        expireDate: '2027-08-09',
        category: '质控定标耗用',
        qty: 1,
        unit: '盒',
        price: 1200.0,
        amount: 1200.0,
        testCapacity: 120,
      },
    ],
    totalAmount: 2900.0,
    totalTests: 360,
  },

  // 单据 4 (严格匹配截图第4行 N0000001)
  {
    id: 'USE-004',
    orderNo: 'N0000001',
    tabType: 'usage',
    warehouse: '生化组库房',
    user: '郭彩霞主任医师',
    desc: '临床急诊生化流水线晚班大批量肝肾功能检测配套试剂开瓶出库耗用',
    operator: '魏明主管检验师',
    operateTime: '2026-10-27 17:30:00',
    submitter: '郭彩霞主任医师',
    submitTime: '2026-10-27 18:05:10',
    status: '发送',
    machine: 'Beckman Coulter AU5800 生化分析流水线',
    hospitalDept: '中心医院临床检验中心生化组',
    items: [
      {
        code: '010019',
        name: '尿素(UREA)测定试剂盒(酶动力学法)',
        spec: 'R1: 4×60ml, R2: 4×20ml',
        lotNo: 'LOT-260920U',
        expireDate: '2027-09-19',
        category: '常规检测消耗',
        qty: 3,
        unit: '盒',
        price: 320.0,
        amount: 960.0,
        testCapacity: 3000,
      },
      {
        code: '010018',
        name: '肌酐(Cr)测定试剂盒(肌氨酸氧化酶法)',
        spec: 'R1: 3×70ml, R2: 3×25ml',
        lotNo: 'LOT-261002A',
        expireDate: '2027-09-30',
        category: '常规检测消耗',
        qty: 2,
        unit: '盒',
        price: 420.0,
        amount: 840.0,
        testCapacity: 1600,
      },
      {
        code: '010035',
        name: '肌酸激酶同工酶(CK-MB)测定试剂盒',
        spec: '2×50ml/盒',
        lotNo: 'LOT-261011C',
        expireDate: '2027-10-10',
        category: '应急加急耗用',
        qty: 2,
        unit: '盒',
        price: 480.0,
        amount: 960.0,
        testCapacity: 1000,
      },
    ],
    totalAmount: 2760.0,
    totalTests: 5600,
  },

  // 单据 5 (填满每页 10 条真实数据)
  {
    id: 'USE-005',
    orderNo: 'N0000006',
    tabType: 'usage',
    warehouse: '生化组库房',
    user: '钱宇恒技师',
    desc: '日立7600生化仪血糖、糖化血红蛋白常规晨间测试通道开瓶加注',
    operator: '钱宇恒技师',
    operateTime: '2026-10-26 07:15:00',
    submitter: '李晓红副主任技师',
    submitTime: '2026-10-26 07:50:00',
    status: '已核销',
    machine: 'Hitachi 7600 全自动生化分析仪',
    hospitalDept: '中心医院临床检验中心生化组',
    items: [
      {
        code: '010025',
        name: '葡萄糖(Glu)测定试剂盒(己糖激酶法)',
        spec: 'R1: 4×80ml, R2: 2×40ml',
        lotNo: 'LOT-260918GLU',
        expireDate: '2027-09-17',
        category: '常规检测消耗',
        qty: 2,
        unit: '盒',
        price: 240.0,
        amount: 480.0,
        testCapacity: 1600,
      },
    ],
    totalAmount: 480.0,
    totalTests: 1600,
  },

  // 单据 6
  {
    id: 'USE-006',
    orderNo: 'N0000007',
    tabType: 'usage',
    warehouse: '生化组库房',
    user: '孙丽丽主管检验师',
    desc: '心血管内科疑难标本复检、高浓度血脂标本稀释复测专用试剂开瓶',
    operator: '孙丽丽主管检验师',
    operateTime: '2026-10-25 10:20:00',
    submitter: '郭彩霞主任医师',
    submitTime: '2026-10-25 10:45:00',
    status: '已核销',
    machine: 'Roche Cobas 8000 (c702+c502)',
    hospitalDept: '中心医院临床检验中心生化组',
    items: [
      {
        code: '010072',
        name: '高密度脂蛋白胆固醇(HDL-C)测定试剂盒',
        spec: 'R1: 4×80ml, R2: 2×40ml',
        lotNo: 'LOT-260810HDL',
        expireDate: '2027-08-09',
        category: '复检复测消耗',
        qty: 1,
        unit: '盒',
        price: 260.0,
        amount: 260.0,
        testCapacity: 800,
      },
      {
        code: '010073',
        name: '低密度脂蛋白胆固醇(LDL-C)测定试剂盒',
        spec: 'R1: 4×80ml, R2: 2×40ml',
        lotNo: 'LOT-260810LDL',
        expireDate: '2027-08-09',
        category: '复检复测消耗',
        qty: 1,
        unit: '盒',
        price: 290.0,
        amount: 290.0,
        testCapacity: 800,
      },
    ],
    totalAmount: 550.0,
    totalTests: 1600,
  },

  // 单据 7
  {
    id: 'USE-007',
    orderNo: 'N0000008',
    tabType: 'usage',
    warehouse: '生化组库房',
    user: '张建国主任技师',
    desc: '生化分析仪光学系统每周维护用浓缩酸性清洗液及针头疏通液耗用',
    operator: '张建国主任技师',
    operateTime: '2026-10-24 16:00:00',
    submitter: '郭彩霞主任医师',
    submitTime: '2026-10-24 16:30:00',
    status: '已核销',
    machine: 'Beckman Coulter AU5800 生化分析流水线',
    hospitalDept: '中心医院临床检验中心生化组',
    items: [
      {
        code: '010095',
        name: '生化分析仪碱性清洗液(Cellclean)',
        spec: '500ml×4瓶/箱',
        lotNo: 'LOT-260601C',
        expireDate: '2028-05-31',
        category: '仪器维护冲洗',
        qty: 1,
        unit: '箱',
        price: 420.0,
        amount: 420.0,
        testCapacity: 2000,
      },
    ],
    totalAmount: 420.0,
    totalTests: 2000,
  },

  // 单据 8
  {
    id: 'USE-008',
    orderNo: 'N0000009',
    tabType: 'usage',
    warehouse: '生化组库房',
    user: '魏明主管检验师',
    desc: '日间体检高峰门诊全套肝功指标(TBIL/DBIL/TP/ALB)联合加注出库',
    operator: '刘浩然技师',
    operateTime: '2026-10-23 08:00:00',
    submitter: '李晓红副主任技师',
    submitTime: '2026-10-23 08:30:00',
    status: '已核销',
    machine: 'Roche Cobas 8000 (c702+c502)',
    hospitalDept: '中心医院临床检验中心生化组',
    items: [
      {
        code: '010012',
        name: '丙氨酸氨基转移酶(ALT)测定试剂盒(IFCC速率法)',
        spec: 'R1: 4×60ml, R2: 4×20ml',
        lotNo: 'LOT-261015A',
        expireDate: '2027-10-14',
        category: '常规检测消耗',
        qty: 3,
        unit: '盒',
        price: 380.0,
        amount: 1140.0,
        testCapacity: 2400,
      },
    ],
    totalAmount: 1140.0,
    totalTests: 2400,
  },

  // 单据 9
  {
    id: 'USE-009',
    orderNo: 'N0000010',
    tabType: 'usage',
    warehouse: '生化组库房',
    user: '刘浩然技师',
    desc: '急诊胸痛绿色通道肌钙蛋白I(cTnI)荧光检测卡开盒联检',
    operator: '刘浩然技师',
    operateTime: '2026-10-22 21:10:00',
    submitter: '郭彩霞主任医师',
    submitTime: '2026-10-22 21:25:00',
    status: '已核销',
    machine: 'Siemens Atellica Solution 发光分析仪',
    hospitalDept: '中心医院临床检验中心生化组',
    items: [
      {
        code: '010041',
        name: '心肌肌钙蛋白I(cTnI)急诊测定试剂条',
        spec: '25条/盒',
        lotNo: 'LOT-260905CTN',
        expireDate: '2027-09-04',
        category: '应急加急耗用',
        qty: 2,
        unit: '盒',
        price: 680.0,
        amount: 1360.0,
        testCapacity: 50,
      },
    ],
    totalAmount: 1360.0,
    totalTests: 50,
  },

  // 单据 10
  {
    id: 'USE-010',
    orderNo: 'N0000011',
    tabType: 'usage',
    warehouse: '生化组库房',
    user: '陈康主管检验师',
    desc: '全自动血细胞分析流水线稀释液与五分类溶血剂开箱装机使用',
    operator: '魏明主管检验师',
    operateTime: '2026-10-21 08:40:00',
    submitter: '李晓红副主任技师',
    submitTime: '2026-10-21 09:10:00',
    status: '已核销',
    machine: 'Sysmex XN-9000 全自动血液体液分析流水线',
    hospitalDept: '中心医院临床检验中心临检生化联合组',
    items: [
      {
        code: '010051',
        name: '全自动血细胞分析用溶血剂(Lysercell WNR)',
        spec: '5L/桶',
        lotNo: 'LOT-260815WNR',
        expireDate: '2027-08-14',
        category: '常规检测消耗',
        qty: 1,
        unit: '桶',
        price: 890.0,
        amount: 890.0,
        testCapacity: 2500,
      },
    ],
    totalAmount: 890.0,
    totalTests: 2500,
  },

  // ====================== 【机上调入与核销】(调入标签页功能) ======================
  {
    id: 'ONB-001',
    orderNo: 'ONB-20261031-01',
    tabType: 'onboard',
    warehouse: '生化组机房 (Cobas 8000)',
    user: '刘浩然技师',
    desc: '分析仪通道条码扫描调入上机，自动核销开瓶有效期(28天倒计时)',
    operator: '刘浩然技师',
    operateTime: '2026-10-31 08:00:00',
    submitter: '李晓红副主任技师',
    submitTime: '2026-10-31 08:30:00',
    status: '已核销',
    machine: 'Roche Cobas 8000 (c702+c502)',
    hospitalDept: '中心医院临床检验中心生化组',
    items: [
      {
        code: '010012',
        name: '丙氨酸氨基转移酶(ALT)测定试剂盒(IFCC速率法)',
        spec: 'R1: 4×60ml, R2: 4×20ml',
        lotNo: 'LOT-261015A',
        expireDate: '2027-10-14 (开瓶效期至 2026-11-28)',
        category: '常规检测消耗',
        qty: 1,
        unit: '盒',
        price: 380.0,
        amount: 380.0,
        testCapacity: 800,
      },
    ],
    totalAmount: 380.0,
    totalTests: 800,
  },
  {
    id: 'ONB-002',
    orderNo: 'ONB-20261030-02',
    tabType: 'onboard',
    warehouse: '生化组机房 (AU5800)',
    user: '陈康主管检验师',
    desc: '电解质离子选择性电极(ISE)稀释液与内标液机台装载与自动扣减核算',
    operator: '陈康主管检验师',
    operateTime: '2026-10-30 09:10:00',
    submitter: '郭彩霞主任医师',
    submitTime: '2026-10-30 09:30:00',
    status: '已核销',
    machine: 'Beckman Coulter AU5800 生化分析流水线',
    hospitalDept: '中心医院临床检验中心生化组',
    items: [
      {
        code: '010042',
        name: '电解质ISE电极内部标准参比液(A/B液)',
        spec: '2000ml×2瓶/套',
        lotNo: 'LOT-260905ISE',
        expireDate: '2027-09-04',
        category: '仪器维护冲洗',
        qty: 1,
        unit: '套',
        price: 680.0,
        amount: 680.0,
        testCapacity: 3000,
      },
    ],
    totalAmount: 680.0,
    totalTests: 3000,
  },
];

export const ReagentUsageManagementView: React.FC<{
  hospitalUnit: string;
  showNotice: (m: string) => void;
}> = ({ hospitalUnit, showNotice }) => {
  // 数据列表
  const [orders, setOrders] = useState<UsageOrder[]>(INITIAL_USAGE_ORDERS);

  // 3. 当前选中的单据 ID (默认选中第1行 N0000004，点击上方内容，下方数据也跟着变化！)
  const [selectedOrderId, setSelectedOrderId] = useState<string>('USE-001');

  // 4. 筛选条件 (严格匹配截图 image_7d8fa656.png)
  const [filterWarehouse, setFilterWarehouse] = useState<string>('生化库');
  const [filterOrderNo, setFilterOrderNo] = useState<string>('');
  const [filterDateRange, setFilterDateRange] = useState<string>('2026-10-01 ~ 2026-10-31');
  const [filterStatus, setFilterStatus] = useState<string>('全部');

  // 5. 分页 (用户核心要求：一页帮我显示10条数据)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  // 6. 模态窗口控制
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
  const [isRevokeModalOpen, setIsRevokeModalOpen] = useState<boolean>(false);
  const [isScanModalOpen, setIsScanModalOpen] = useState<boolean>(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState<boolean>(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);

  // 激活的操作单据
  const [activeModalOrder, setActiveModalOrder] = useState<UsageOrder | null>(null);

  // 7. 新增使用出库单表单状态 (严格对应截图 image_9bd8db10.png)
  const [addForm, setAddForm] = useState<{
    orderNo: string;
    warehouse: string;
    user: string;
    operator: string;
    machine: string;
    purpose: string;
    selectedCatalogCode: string;
    selectedCategory: UsageItem['category'];
    inputQty: number;
    items: UsageItem[];
  }>({
    orderNo: 'N0000005',
    warehouse: '生化组库房',
    user: '刘浩然技师',
    operator: '魏明主管检验师',
    machine: 'Roche Cobas 8000 (c702+c502)',
    purpose: '临床急诊与日间常规检验开瓶使用耗用登记',
    selectedCatalogCode: '010018',
    selectedCategory: '常规检测消耗',
    inputQty: 1,
    items: [
      {
        code: '010012',
        name: '丙氨酸氨基转移酶(ALT)测定试剂盒(IFCC速率法)',
        spec: 'R1: 4×60ml, R2: 4×20ml',
        lotNo: 'LOT-261015A',
        expireDate: '2027-10-14',
        category: '常规检测消耗',
        qty: 2,
        unit: '盒',
        price: 380.0,
        amount: 760.0,
        testCapacity: 1600,
      },
    ],
  });

  // 筛选后的单据
  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      // 库房筛选
      if (filterWarehouse !== '全部') {
        if (!o.warehouse.includes(filterWarehouse.replace('库', ''))) {
          // 放宽库名匹配
        }
      }

      // 单号筛选
      if (filterOrderNo.trim()) {
        const kw = filterOrderNo.trim().toLowerCase();
        if (
          !o.orderNo.toLowerCase().includes(kw) &&
          !o.user.toLowerCase().includes(kw) &&
          !o.desc.toLowerCase().includes(kw)
        ) {
          return false;
        }
      }

      // 状态筛选
      if (filterStatus !== '全部' && o.status !== filterStatus) {
        return false;
      }

      return true;
    });
  }, [orders, filterWarehouse, filterOrderNo, filterStatus]);

  // 分页数据 (一页正好 10 条)
  const totalPages = Math.ceil(filteredOrders.length / pageSize) || 1;
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredOrders.slice(start, start + pageSize);
  }, [filteredOrders, currentPage, pageSize]);

  // 当前选中的单据对象 (若当前选中项不在筛选列表中，则自动回退选中首项)
  const selectedOrder = useMemo(() => {
    const found = filteredOrders.find(o => o.id === selectedOrderId);
    if (found) return found;
    return filteredOrders[0] || orders[0] || null;
  }, [filteredOrders, selectedOrderId, orders]);

  // 统计待审核总笔数 (截图顶部黄色胶囊: 待审核: 2 笔)
  const pendingAuditCount = useMemo(() => {
    return orders.filter(o => o.status === '发送').length;
  }, [orders]);

  // 待处理登记笔数
  const draftCount = useMemo(() => {
    return filteredOrders.filter(o => o.status === '登记').length;
  }, [filteredOrders]);

  const sentCount = useMemo(() => {
    return filteredOrders.filter(o => o.status === '发送').length;
  }, [filteredOrders]);

  // 新增弹窗中：点击 [+ 加入清单]
  const handleAddItemToForm = () => {
    const catalogItem = REAGENT_CATALOG.find(c => c.code === addForm.selectedCatalogCode);
    if (!catalogItem) return;

    const existingIndex = addForm.items.findIndex(
      it => it.code === catalogItem.code && it.category === addForm.selectedCategory
    );

    if (existingIndex >= 0) {
      const updated = [...addForm.items];
      updated[existingIndex].qty += addForm.inputQty;
      updated[existingIndex].amount = updated[existingIndex].qty * updated[existingIndex].price;
      updated[existingIndex].testCapacity = updated[existingIndex].qty * catalogItem.singleTestCapacity;
      setAddForm({ ...addForm, items: updated });
      showNotice(`已增加【${catalogItem.name}】耗用数量至 ${updated[existingIndex].qty} 盒`);
    } else {
      const newItem: UsageItem = {
        code: catalogItem.code,
        name: catalogItem.name,
        spec: catalogItem.spec,
        lotNo: catalogItem.lotNo,
        expireDate: catalogItem.expireDate,
        category: addForm.selectedCategory,
        qty: addForm.inputQty,
        unit: catalogItem.unit,
        price: catalogItem.price,
        amount: catalogItem.price * addForm.inputQty,
        testCapacity: catalogItem.singleTestCapacity * addForm.inputQty,
      };
      setAddForm({ ...addForm, items: [...addForm.items, newItem] });
      showNotice(`已加入【${catalogItem.name}】至使用清单`);
    }
  };

  // 移除新增清单中的某项
  const handleRemoveFormItem = (index: number) => {
    const updated = addForm.items.filter((_, i) => i !== index);
    setAddForm({ ...addForm, items: updated });
    showNotice('已移除该试剂项');
  };

  // 计算新增表单合计金额
  const addFormTotalAmount = useMemo(() => {
    return addForm.items.reduce((s, it) => s + it.amount, 0);
  }, [addForm.items]);

  // 提交新增使用单 (暂存登记 或 登记并直接发送)
  const handleSaveUsageOrder = (asSend: boolean) => {
    if (addForm.items.length === 0) {
      showNotice('请至少添加一种试剂耗材！');
      return;
    }

    const newOrder: UsageOrder = {
      id: `USE-${Date.now()}`,
      orderNo: addForm.orderNo,
      tabType: 'usage',
      warehouse: addForm.warehouse,
      user: addForm.user,
      desc: addForm.purpose,
      operator: addForm.operator,
      operateTime: '2026-11-02 09:30:00',
      submitter: asSend ? '李晓红副主任技师' : '',
      submitTime: asSend ? '2026-11-02 09:40:00' : '',
      status: asSend ? '发送' : '登记',
      machine: addForm.machine,
      hospitalDept: '中心医院临床检验中心生化组',
      items: addForm.items,
      totalAmount: addFormTotalAmount,
      totalTests: addForm.items.reduce((s, it) => s + it.testCapacity, 0),
    };

    setOrders([newOrder, ...orders]);
    setSelectedOrderId(newOrder.id);
    setIsAddModalOpen(false);

    // 自动自增生成下一个使用单号
    const nextNum = parseInt(addForm.orderNo.replace(/\D/g, '') || '5', 10) + 1;
    setAddForm(prev => ({
      ...prev,
      orderNo: `N${String(nextNum).padStart(7, '0')}`,
    }));

    showNotice(asSend ? `使用单【${newOrder.orderNo}】已提交审核！` : `使用单【${newOrder.orderNo}】已暂存为草稿！`);
  };

  // 撤销发送操作 (回退至草稿登记)
  const handleConfirmRevoke = () => {
    if (!activeModalOrder) return;
    setOrders(prev =>
      prev.map(o => (o.id === activeModalOrder.id ? { ...o, status: '登记', submitter: '', submitTime: '' } : o))
    );
    setIsRevokeModalOpen(false);
    showNotice(`已成功撤销使用单【${activeModalOrder.orderNo}】并回退为登记状态！`);
  };

  // 批量通过审核 (或打开审核弹窗通过)
  const handleBatchAudit = () => {
    const pendingList = orders.filter(o => o.status === '发送');
    if (pendingList.length === 0) {
      showNotice('当前没有待审核的使用单据');
      return;
    }
    setOrders(prev =>
      prev.map(o => (o.status === '发送' ? { ...o, status: '已核销' } : o))
    );
    setIsAuditModalOpen(false);
    showNotice(`已成功审核通过 ${pendingList.length} 笔试剂使用开瓶与核销单据！`);
  };

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-slate-50 text-slate-800 text-xs">
      {/* 顶部标题与操作栏 (严格匹配截图 image_7d8fa656.png) */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-xs shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center font-bold">
            <Activity className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-base font-bold text-slate-900 tracking-tight">试剂使用管理</h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
              {hospitalUnit} · 实时在机开瓶与消耗核销
            </span>
            {/* 待审核: 2 笔 黄色胶囊徽章 */}
            {pendingAuditCount > 0 && (
              <span
                onClick={() => setIsAuditModalOpen(true)}
                className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-300 flex items-center gap-1 cursor-pointer hover:bg-amber-100 transition-colors shadow-2xs"
              >
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>待审核: {pendingAuditCount} 笔</span>
              </span>
            )}
          </div>
        </div>

        {/* 顶部右侧按钮群 (严格匹配截图 image_7d8fa656.png) */}
        <div className="flex items-center gap-2">
          {/* 扫码核销 */}
          <button
            onClick={() => setIsScanModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded font-medium transition-colors cursor-pointer shadow-xs"
          >
            <QrCode className="w-3.5 h-3.5 text-blue-600" />
            <span>扫码核销</span>
          </button>

          {/* + 新增 */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded font-medium shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>新增</span>
          </button>

          {/* 审核 (2) */}
          <button
            onClick={() => setIsAuditModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-amber-50 border border-amber-400 text-amber-700 rounded font-medium transition-colors cursor-pointer shadow-xs"
          >
            <FileCheck className="w-3.5 h-3.5 text-amber-600" />
            <span>审核</span>
            {pendingAuditCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-bold">
                {pendingAuditCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* 筛选过滤工具条 (严格匹配截图 image_7d8fa656.png) */}
      <div className="bg-white border-b border-slate-200 px-4 py-2.5 flex flex-wrap items-center gap-3 shrink-0">
        {/* 当前库房 */}
        <div className="flex items-center gap-1.5">
          <label className="text-slate-600 font-medium">当前库房：</label>
          <select
            value={filterWarehouse}
            onChange={e => setFilterWarehouse(e.target.value)}
            className="border border-slate-300 rounded px-2.5 py-1 bg-white text-slate-800 focus:outline-hidden focus:border-blue-500 cursor-pointer min-w-[100px]"
          >
            <option value="生化库">生化库</option>
            <option value="临检库">临检库</option>
            <option value="免疫库">免疫库</option>
            <option value="微生物库">微生物库</option>
            <option value="全部">全部库房</option>
          </select>
        </div>

        {/* 申领/使用单号 */}
        <div className="flex items-center gap-1.5">
          <label className="text-slate-600 font-medium">使用单号：</label>
          <div className="relative">
            <input
              type="text"
              placeholder="请输入或扫描使用单号"
              value={filterOrderNo}
              onChange={e => setFilterOrderNo(e.target.value)}
              className="border border-slate-300 rounded px-2.5 py-1 pr-7 bg-white text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-blue-500 w-48"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* 编制日期 */}
        <div className="flex items-center gap-1.5">
          <label className="text-slate-600 font-medium">编制日期：</label>
          <div className="relative">
            <input
              type="text"
              value={filterDateRange}
              onChange={e => setFilterDateRange(e.target.value)}
              className="border border-slate-300 rounded px-2.5 py-1 pr-7 bg-white text-slate-800 focus:outline-hidden focus:border-blue-500 w-48"
            />
            <CalendarCheck className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* 状态 */}
        <div className="flex items-center gap-1.5">
          <label className="text-slate-600 font-medium">状态：</label>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="border border-slate-300 rounded px-2.5 py-1 bg-white text-slate-800 focus:outline-hidden focus:border-blue-500 cursor-pointer min-w-[80px]"
          >
            <option value="全部">全部</option>
            <option value="登记">登记</option>
            <option value="发送">发送</option>
            <option value="已核销">已核销</option>
          </select>
        </div>

        {/* 查询 & 重置 */}
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={() => showNotice('已根据所选库房与条件刷新使用记录')}
            className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition-colors cursor-pointer shadow-xs"
          >
            <Search className="w-3.5 h-3.5" />
            <span>查询</span>
          </button>
          <button
            onClick={() => {
              setFilterOrderNo('');
              setFilterStatus('全部');
              setFilterWarehouse('生化库');
              showNotice('筛选条件已重置');
            }}
            title="重置筛选"
            className="p-1 border border-slate-300 hover:bg-slate-100 rounded text-slate-600 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 上方主表格 (一页严格显示 10 条数据，点击上方内容，下方数据也跟着变化！) */}
      <div className="overflow-auto bg-white p-3 shrink-0 max-h-[38vh]">
        <div className="border border-slate-200 rounded overflow-hidden shadow-xs">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 select-none">
                <th className="py-2.5 px-3">使用单号</th>
                <th className="py-2.5 px-3">库房</th>
                <th className="py-2.5 px-3">使用者</th>
                <th className="py-2.5 px-3">说明</th>
                <th className="py-2.5 px-3">操作人</th>
                <th className="py-2.5 px-3">操作时间</th>
                <th className="py-2.5 px-3">提交人</th>
                <th className="py-2.5 px-3">提交时间</th>
                <th className="py-2.5 px-3 text-center">状态</th>
                <th className="py-2.5 px-3 text-center">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {paginatedOrders.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-slate-400">
                    <FolderOpen className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    暂无符合条件的试剂使用出库记录
                  </td>
                </tr>
              ) : (
                paginatedOrders.map(order => {
                  const isSelected = selectedOrder?.id === order.id;

                  return (
                    <tr
                      key={order.id}
                      onClick={() => setSelectedOrderId(order.id)}
                      className={`transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-blue-50/80 font-medium border-l-4 border-l-blue-600'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      {/* 使用单号 */}
                      <td className="py-2.5 px-3 font-semibold text-blue-600 hover:underline">
                        {order.orderNo}
                      </td>

                      {/* 库房 */}
                      <td className="py-2.5 px-3">{order.warehouse}</td>

                      {/* 使用者 */}
                      <td className="py-2.5 px-3 font-medium text-slate-900">{order.user}</td>

                      {/* 说明 (带项目数量胶囊标签) */}
                      <td className="py-2.5 px-3 max-w-sm truncate" title={order.desc}>
                        <div className="flex items-center gap-1.5 truncate">
                          <span className="truncate">{order.desc}</span>
                          <span className="shrink-0 px-1.5 py-0.2 rounded text-[10px] bg-slate-200 text-slate-700 font-medium">
                            {order.items.length}项耗材
                          </span>
                        </div>
                      </td>

                      {/* 操作人 */}
                      <td className="py-2.5 px-3 whitespace-nowrap">{order.operator}</td>

                      {/* 操作时间 */}
                      <td className="py-2.5 px-3 whitespace-nowrap text-slate-500 font-mono text-[11px]">
                        {order.operateTime}
                      </td>

                      {/* 提交人 */}
                      <td className="py-2.5 px-3 whitespace-nowrap">{order.submitter || '-'}</td>

                      {/* 提交时间 */}
                      <td className="py-2.5 px-3 whitespace-nowrap text-slate-500 font-mono text-[11px]">
                        {order.submitTime || '-'}
                      </td>

                      {/* 状态 (登记: 黄色, 发送: 蓝色, 已核销: 绿色) */}
                      <td className="py-2.5 px-3 text-center whitespace-nowrap">
                        {order.status === '登记' && (
                          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-300">
                            登记
                          </span>
                        )}
                        {order.status === '发送' && (
                          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-300">
                            发送
                          </span>
                        )}
                        {order.status === '已核销' && (
                          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-300">
                            已核销
                          </span>
                        )}
                      </td>

                      {/* 操作列 */}
                      <td className="py-2.5 px-3 text-center whitespace-nowrap" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-2">
                          {order.status === '登记' && (
                            <>
                              <button
                                onClick={() => {
                                  setActiveModalOrder(order);
                                  showNotice(`正在编辑使用单【${order.orderNo}】`);
                                }}
                                className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                              >
                                编辑
                              </button>
                              <button
                                onClick={() => {
                                  setOrders(prev => prev.filter(o => o.id !== order.id));
                                  showNotice(`草稿单【${order.orderNo}】已删除`);
                                }}
                                className="text-rose-600 hover:text-rose-800 hover:underline cursor-pointer"
                              >
                                删除
                              </button>
                            </>
                          )}

                          {order.status === '发送' && (
                            <>
                              <button
                                onClick={() => {
                                  setActiveModalOrder(order);
                                  setIsRevokeModalOpen(true);
                                }}
                                className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                              >
                                撤销
                              </button>
                              <button
                                onClick={() => {
                                  setActiveModalOrder(order);
                                  setIsViewModalOpen(true);
                                }}
                                className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                              >
                                查看
                              </button>
                            </>
                          )}

                          {order.status === '已核销' && (
                            <button
                              onClick={() => {
                                setActiveModalOrder(order);
                                setIsViewModalOpen(true);
                              }}
                              className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                            >
                              查看
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 中间状态条与联动指示栏 (严格对应截图 image_7d8fa656.png) */}
      <div className="bg-slate-100/90 border-y border-slate-200 px-4 py-2 flex flex-wrap items-center justify-between text-xs text-slate-700 shrink-0">
        <div className="flex items-center gap-3">
          <span className="font-bold text-blue-700">合计：{filteredOrders.length} 条</span>
          <span className="text-slate-500">
            (登记: {draftCount} 条 · 发送: {sentCount} 条)
          </span>
        </div>

        {/* 当前选中行指示与联动详情/打印快捷按钮 */}
        {selectedOrder && (
          <div className="flex items-center gap-3">
            <span className="text-slate-600">
              当前选中：
              <strong className="text-slate-900 font-mono">{selectedOrder.orderNo}</strong> (
              {selectedOrder.user})
            </span>
            <button
              onClick={() => {
                setActiveModalOrder(selectedOrder);
                setIsViewModalOpen(true);
              }}
              className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium hover:underline cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>详情与明细</span>
            </button>
            <button
              onClick={() => {
                setActiveModalOrder(selectedOrder);
                setIsPrintModalOpen(true);
              }}
              className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium hover:underline cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>打印使用单</span>
            </button>
          </div>
        )}
      </div>

      {/* 下方联动详情面板 (核心需求：点击上方的内容，下方数据也跟着变化！) */}
      {selectedOrder ? (
        <div className="flex-1 flex flex-col min-h-0 bg-white p-3 overflow-hidden">
          <div className="border border-slate-200 rounded flex-1 flex flex-col overflow-hidden shadow-2xs">
            {/* 联动面板顶部标题 */}
            <div className="bg-slate-50 border-b border-slate-200 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-600" />
                <span className="font-bold text-slate-900 text-xs">
                  【{selectedOrder.orderNo}】耗材明细与机上核销信息
                </span>
                <span className="text-slate-500 text-[11px] ml-2">
                  适用分析仪器：
                  <strong className="text-slate-800">{selectedOrder.machine}</strong>
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <span>
                  试剂项数：<strong className="text-slate-900">{selectedOrder.items.length}</strong>
                </span>
                <span className="text-slate-400">|</span>
                <span>
                  总折合测试量：
                  <strong className="text-blue-600 font-mono">
                    {selectedOrder.totalTests.toLocaleString()}
                  </strong>{' '}
                  次
                </span>
                <span className="text-slate-400">|</span>
                <span>
                  总金额：
                  <strong className="text-emerald-600 font-bold font-mono">
                    ¥{selectedOrder.totalAmount.toFixed(2)}
                  </strong>
                </span>
              </div>
            </div>

            {/* 联动明细表格 (严格对应截图 image_7d8fa656.png 下半部分) */}
            <div className="flex-1 overflow-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50/60 text-slate-600 font-medium border-b border-slate-200">
                    <th className="py-2 px-3">试剂编码</th>
                    <th className="py-2 px-3">试剂名称</th>
                    <th className="py-2 px-3">规格型号</th>
                    <th className="py-2 px-3">批号</th>
                    <th className="py-2 px-3">效期</th>
                    <th className="py-2 px-3 text-center">使用类别</th>
                    <th className="py-2 px-3 text-center">消耗数量</th>
                    <th className="py-2 px-3 text-right">单价</th>
                    <th className="py-2 px-3 text-right">小计金额</th>
                    <th className="py-2 px-3 text-right">测试容量</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {selectedOrder.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-2 px-3 font-mono text-[11px] text-slate-500">{item.code}</td>
                      <td className="py-2 px-3 font-semibold text-slate-900">{item.name}</td>
                      <td className="py-2 px-3 text-slate-500 text-[11px]">{item.spec}</td>
                      <td className="py-2 px-3 font-mono text-[11px] text-blue-600">{item.lotNo}</td>
                      <td className="py-2 px-3 font-mono text-[11px] text-emerald-600">{item.expireDate}</td>
                      <td className="py-2 px-3 text-center">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-700 border border-slate-200 font-medium">
                          {item.category}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-center font-bold text-slate-900">
                        {item.qty} {item.unit}
                      </td>
                      <td className="py-2 px-3 text-right text-slate-600">
                        ¥{item.price.toFixed(2)}
                      </td>
                      <td className="py-2 px-3 text-right font-bold text-emerald-600">
                        ¥{item.amount.toFixed(2)}
                      </td>
                      <td className="py-2 px-3 text-right font-bold text-emerald-700">
                        {item.testCapacity.toLocaleString()} 测试
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : null}

      {/* 底部分页栏 (一页严格显示 10 条数据) */}
      <div className="bg-white border-t border-slate-200 px-4 py-2 flex flex-wrap items-center justify-between text-[11px] text-slate-600 gap-2 shrink-0">
        <div className="flex items-center gap-3">
          <span>当前库房：{filterWarehouse}</span>
          <span className="text-slate-400">|</span>
          <span>临床排班时间：近期 (2026年10月~11月)</span>
        </div>

        {/* 分页控制栏 (10 条/页) */}
        <div className="flex items-center gap-2">
          <span>
            第 {currentPage} / {totalPages} 页 (共 {filteredOrders.length} 笔使用单)
          </span>
          <div className="flex items-center border border-slate-300 rounded overflow-hidden">
            <button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="px-2 py-1 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed border-r border-slate-200 cursor-pointer"
            >
              上一页
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`px-2.5 py-1 text-xs cursor-pointer ${
                  currentPage === pageNum
                    ? 'bg-blue-600 text-white font-bold'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border-r border-slate-200'
                }`}
              >
                {pageNum}
              </button>
            ))}
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              className="px-2 py-1 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              下一页
            </button>
          </div>
        </div>
      </div>

      {/* ==================== 模态弹窗 1：新增试剂使用出库登记单 (1:1 匹配截图 image_9bd8db10.png) ==================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
            {/* 弹窗头部 */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">新增试剂使用出库登记单</h2>
                  <p className="text-[11px] text-slate-500">记录全自动分析仪器开瓶、日常检验消耗及质控定标耗用</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-slate-200/60 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 弹窗主体内容表单 */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              {/* 表单第1行 */}
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">使用单号 (自动生成)</label>
                  <input
                    type="text"
                    value={addForm.orderNo}
                    disabled
                    className="w-full bg-slate-100 border border-slate-300 rounded px-3 py-1.5 text-blue-600 font-mono font-bold focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">
                    出库库房 <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={addForm.warehouse}
                    onChange={e => setAddForm({ ...addForm, warehouse: e.target.value })}
                    className="w-full border border-slate-300 rounded px-3 py-1.5 bg-white text-slate-800 focus:outline-hidden focus:border-blue-500 cursor-pointer"
                  >
                    <option value="生化组库房">生化组库房</option>
                    <option value="临检组库房">临检组库房</option>
                    <option value="免疫组库房">免疫组库房</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">
                    使用者 (领用技师) <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={addForm.user}
                    onChange={e => setAddForm({ ...addForm, user: e.target.value })}
                    className="w-full border border-slate-300 rounded px-3 py-1.5 bg-white text-slate-800 focus:outline-hidden focus:border-blue-500 cursor-pointer"
                  >
                    <option value="刘浩然技师">刘浩然技师</option>
                    <option value="陈康主管检验师">陈康主管检验师</option>
                    <option value="李晓红副主任技师">李晓红副主任技师</option>
                    <option value="郭彩霞主任医师">郭彩霞主任医师</option>
                    <option value="钱宇恒技师">钱宇恒技师</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">
                    操作人 (登记人员) <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={addForm.operator}
                    onChange={e => setAddForm({ ...addForm, operator: e.target.value })}
                    className="w-full border border-slate-300 rounded px-3 py-1.5 bg-white text-slate-800 focus:outline-hidden focus:border-blue-500 cursor-pointer"
                  >
                    <option value="魏明主管检验师">魏明主管检验师</option>
                    <option value="陈康主管检验师">陈康主管检验师</option>
                    <option value="刘浩然技师">刘浩然技师</option>
                  </select>
                </div>
              </div>

              {/* 表单第2行 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">适用分析仪器 / 机台</label>
                  <select
                    value={addForm.machine}
                    onChange={e => setAddForm({ ...addForm, machine: e.target.value })}
                    className="w-full border border-slate-300 rounded px-3 py-1.5 bg-white text-slate-800 focus:outline-hidden focus:border-blue-500 cursor-pointer"
                  >
                    {ANALYZER_MACHINES.map(m => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">使用用途说明</label>
                  <input
                    type="text"
                    value={addForm.purpose}
                    onChange={e => setAddForm({ ...addForm, purpose: e.target.value })}
                    className="w-full border border-slate-300 rounded px-3 py-1.5 bg-white text-slate-800 focus:outline-hidden focus:border-blue-500"
                  />
                </div>
              </div>

              {/* 添加试剂耗材项选择区 (严格对应截图 image_9bd8db10.png) */}
              <div className="bg-slate-50 border border-slate-200 rounded p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <Activity className="w-4 h-4 text-blue-600" />
                    <span>添加试剂耗材项</span>
                  </div>
                  <span className="text-blue-600 hover:underline cursor-pointer text-[11px]">
                    从试剂字典及在库库存中选择
                  </span>
                </div>

                <div className="grid grid-cols-12 gap-3 items-end">
                  <div className="col-span-6">
                    <label className="block text-slate-600 text-[11px] mb-1">选择试剂</label>
                    <select
                      value={addForm.selectedCatalogCode}
                      onChange={e => setAddForm({ ...addForm, selectedCatalogCode: e.target.value })}
                      className="w-full border border-slate-300 rounded px-2.5 py-1.5 bg-white text-slate-800 focus:outline-hidden focus:border-blue-500 cursor-pointer"
                    >
                      {REAGENT_CATALOG.map(c => (
                        <option key={c.code} value={c.code}>
                          [{c.code}] {c.name} ({c.spec})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-3">
                    <label className="block text-slate-600 text-[11px] mb-1">消耗类别</label>
                    <select
                      value={addForm.selectedCategory}
                      onChange={e =>
                        setAddForm({
                          ...addForm,
                          selectedCategory: e.target.value as UsageItem['category'],
                        })
                      }
                      className="w-full border border-slate-300 rounded px-2.5 py-1.5 bg-white text-slate-800 focus:outline-hidden focus:border-blue-500 cursor-pointer"
                    >
                      <option value="常规检测消耗">常规检测消耗</option>
                      <option value="质控定标耗用">质控定标耗用</option>
                      <option value="复检复测消耗">复检复测消耗</option>
                      <option value="应急加急耗用">应急加急耗用</option>
                      <option value="仪器维护冲洗">仪器维护冲洗</option>
                    </select>
                  </div>

                  <div className="col-span-1">
                    <label className="block text-slate-600 text-[11px] mb-1">消耗数量</label>
                    <input
                      type="number"
                      min={1}
                      value={addForm.inputQty}
                      onChange={e => setAddForm({ ...addForm, inputQty: Math.max(1, parseInt(e.target.value, 10) || 1) })}
                      className="w-full border border-slate-300 rounded px-2 py-1.5 text-center font-bold text-blue-600 focus:outline-hidden focus:border-blue-500"
                    />
                  </div>

                  <div className="col-span-2">
                    <button
                      type="button"
                      onClick={handleAddItemToForm}
                      className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>加入清单</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 已选试剂耗材清单表格 (严格对应截图 image_9bd8db10.png) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-slate-800">
                    已选试剂耗材清单 ({addForm.items.length} 项)
                  </h3>
                  <div className="text-emerald-700 font-bold font-mono text-sm">
                    合计金额：¥{addFormTotalAmount.toFixed(2)}
                  </div>
                </div>

                <div className="border border-slate-200 rounded overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                        <th className="py-2 px-3">试剂编码</th>
                        <th className="py-2 px-3">试剂名称</th>
                        <th className="py-2 px-3">规格型号</th>
                        <th className="py-2 px-3">批号</th>
                        <th className="py-2 px-3 text-center">类别</th>
                        <th className="py-2 px-3 text-center">数量</th>
                        <th className="py-2 px-3 text-right">单价</th>
                        <th className="py-2 px-3 text-right">小计</th>
                        <th className="py-2 px-3 text-center">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {addForm.items.length === 0 ? (
                        <tr>
                          <td colSpan={9} className="py-6 text-center text-slate-400">
                            清单为空，请在上方选择试剂后点击【加入清单】
                          </td>
                        </tr>
                      ) : (
                        addForm.items.map((item, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/60">
                            <td className="py-2 px-3 font-mono text-slate-500">{item.code}</td>
                            <td className="py-2 px-3 font-medium text-slate-900">{item.name}</td>
                            <td className="py-2 px-3 text-slate-500 text-[11px]">{item.spec}</td>
                            <td className="py-2 px-3 font-mono text-blue-600">{item.lotNo}</td>
                            <td className="py-2 px-3 text-center">
                              <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-700 border border-slate-200">
                                {item.category}
                              </span>
                            </td>
                            <td className="py-2 px-3 text-center font-bold text-slate-900">
                              {item.qty} {item.unit}
                            </td>
                            <td className="py-2 px-3 text-right text-slate-600">
                              ¥{item.price.toFixed(2)}
                            </td>
                            <td className="py-2 px-3 text-right font-bold text-emerald-600">
                              ¥{item.amount.toFixed(2)}
                            </td>
                            <td className="py-2 px-3 text-center">
                              <button
                                type="button"
                                onClick={() => handleRemoveFormItem(idx)}
                                className="text-rose-500 hover:text-rose-700 p-1 hover:bg-rose-50 rounded cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* 弹窗底部操作按钮 (严格匹配截图 image_9bd8db10.png) */}
            <div className="px-6 py-3 border-t border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
              <span className="text-slate-500 text-[11px]">
                保存后状态将标记为「登记」或直接「发送」进行审核
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-1.5 border border-slate-300 rounded text-slate-700 hover:bg-slate-100 font-medium transition-colors cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveUsageOrder(false)}
                  className="px-4 py-1.5 bg-blue-50 border border-blue-400 text-blue-700 hover:bg-blue-100 rounded font-medium transition-colors cursor-pointer"
                >
                  暂存登记
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveUsageOrder(true)}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>登记并直接发送</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== 模态弹窗 2：试剂使用单详情 (1:1 匹配截图 image_9bcbf955.png) ==================== */}
      {isViewModalOpen && activeModalOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
            {/* 弹窗头部 */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <div>
                  <h2 className="text-sm font-bold text-slate-900">
                    试剂使用单详情 【{activeModalOrder.orderNo}】
                  </h2>
                  <p className="text-[11px] text-slate-500">查看试剂出库、在机领用明细及审核记录</p>
                </div>
              </div>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-slate-200/60 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 弹窗内容 */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              {/* 单据属性网格 (严格对应截图 image_9bcbf955.png) */}
              <div className="grid grid-cols-4 gap-y-3 gap-x-4 bg-slate-50/70 p-4 rounded border border-slate-200">
                <div>
                  <span className="text-slate-500 block mb-0.5">单据状态</span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-300">
                    {activeModalOrder.status === '已核销' ? '已核销' : '已审核发送'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block mb-0.5">当前库房</span>
                  <span className="font-medium text-slate-800">{activeModalOrder.warehouse}</span>
                </div>
                <div>
                  <span className="text-slate-500 block mb-0.5">使用者 (技师)</span>
                  <span className="font-semibold text-slate-900">{activeModalOrder.user}</span>
                </div>
                <div>
                  <span className="text-slate-500 block mb-0.5">操作人</span>
                  <span className="font-medium text-slate-800">{activeModalOrder.operator}</span>
                </div>

                <div>
                  <span className="text-slate-500 block mb-0.5">操作时间</span>
                  <span className="font-mono text-slate-700">{activeModalOrder.operateTime}</span>
                </div>
                <div>
                  <span className="text-slate-500 block mb-0.5">提交/审核人</span>
                  <span className="font-medium text-slate-800">{activeModalOrder.submitter || '-'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block mb-0.5">提交时间</span>
                  <span className="font-mono text-slate-700">{activeModalOrder.submitTime || '-'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block mb-0.5">配套分析设备</span>
                  <span className="font-medium text-slate-800 truncate block" title={activeModalOrder.machine}>
                    {activeModalOrder.machine}
                  </span>
                </div>
              </div>

              {/* 使用用途与临床说明 */}
              <div>
                <label className="block text-slate-600 font-medium mb-1">使用用途与临床说明</label>
                <div className="bg-slate-50 p-3 rounded border border-slate-200 text-slate-800 leading-relaxed">
                  {activeModalOrder.desc}
                </div>
              </div>

              {/* 出库试剂耗材清单表格 (严格对应截图 image_9bcbf955.png) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-slate-800">出库试剂耗材清单</h3>
                  <div className="text-slate-600">
                    折合总测试量：
                    <strong className="text-emerald-700 font-bold font-mono">
                      {activeModalOrder.totalTests.toLocaleString()}
                    </strong>{' '}
                    次
                  </div>
                </div>

                <div className="border border-slate-200 rounded overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                        <th className="py-2 px-3">试剂编码</th>
                        <th className="py-2 px-3">品名</th>
                        <th className="py-2 px-3">规格</th>
                        <th className="py-2 px-3">批号</th>
                        <th className="py-2 px-3">效期</th>
                        <th className="py-2 px-3 text-center">消耗数量</th>
                        <th className="py-2 px-3 text-right">小计金额</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {activeModalOrder.items.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="py-2 px-3 font-mono text-slate-500">{item.code}</td>
                          <td className="py-2 px-3 font-medium text-slate-900">{item.name}</td>
                          <td className="py-2 px-3 text-slate-500 text-[11px]">{item.spec}</td>
                          <td className="py-2 px-3 font-mono text-blue-600">{item.lotNo}</td>
                          <td className="py-2 px-3 font-mono text-emerald-600">{item.expireDate}</td>
                          <td className="py-2 px-3 text-center font-bold text-slate-900">
                            {item.qty} {item.unit}
                          </td>
                          <td className="py-2 px-3 text-right font-bold text-emerald-600">
                            ¥{item.amount.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* 弹窗底部按钮 (严格对应截图 image_9bcbf955.png) */}
            <div className="px-6 py-3 border-t border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
              <span className="text-slate-500 text-[11px]">
                单据归属：中心医院临床检验中心医学实验室
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsViewModalOpen(false)}
                  className="px-4 py-1.5 border border-slate-300 rounded text-slate-700 hover:bg-slate-100 font-medium transition-colors cursor-pointer"
                >
                  关闭
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsViewModalOpen(false);
                    setIsPrintModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium shadow-xs transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>打印使用凭证</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== 模态弹窗 3：撤销发送确认弹窗 ==================== */}
      {isRevokeModalOpen && activeModalOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl border border-slate-200 w-full max-w-md p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  确认撤销试剂使用单【{activeModalOrder.orderNo}】？
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  撤销发送后，该使用单将回退为【草稿登记】状态，试剂出库与开瓶扣减将解除预锁定，使用者可重新调整消耗数量或追加品规。
                </p>
                <div className="mt-3 bg-slate-50 p-2.5 rounded border border-slate-200 text-[11px] text-slate-600 space-y-1">
                  <div>
                    领用技师：<strong>{activeModalOrder.user}</strong>
                  </div>
                  <div>
                    消耗总金额：<strong>¥{activeModalOrder.totalAmount.toFixed(2)}</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsRevokeModalOpen(false)}
                className="px-4 py-1.5 border border-slate-300 rounded text-slate-700 hover:bg-slate-100 font-medium transition-colors cursor-pointer"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleConfirmRevoke}
                className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded font-medium shadow-xs transition-colors cursor-pointer"
              >
                确认撤回草稿
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== 模态弹窗 4：扫码核销弹窗 ==================== */}
      {isScanModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-200 w-full max-w-lg p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  扫码开瓶核销工作站
                </h3>
              </div>
              <button
                onClick={() => setIsScanModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <p className="text-slate-600">
                请使用扫码枪扫描试剂盒上的 <strong>GS1-128 / DataMatrix</strong> 医疗试剂条形码，系统将自动比对在库批号与开瓶有效期并完成机上装载核销。
              </p>

              <div className="p-4 bg-slate-50 border border-dashed border-slate-300 rounded text-center space-y-2">
                <QrCode className="w-12 h-12 text-slate-400 mx-auto animate-pulse" />
                <div className="text-slate-500">等待扫码枪输入...</div>
                <input
                  type="text"
                  placeholder="或在此手动输入试剂条码/GS1代码"
                  defaultValue="(01)06971234500128(17)271014(10)LOT-261015A"
                  className="w-full text-center border border-slate-300 rounded px-3 py-1.5 bg-white font-mono text-xs focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div className="bg-blue-50/70 p-3 rounded border border-blue-200 space-y-1 text-slate-700">
                <div className="font-semibold text-blue-900">已识别试剂：</div>
                <div>品名：[010012] 丙氨酸氨基转移酶(ALT)测定试剂盒(IFCC速率法)</div>
                <div>批号：LOT-261015A · 理论在机有效天数：28天</div>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsScanModalOpen(false)}
                className="px-4 py-1.5 border border-slate-300 rounded text-slate-700 hover:bg-slate-100 font-medium transition-colors cursor-pointer"
              >
                取消
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsScanModalOpen(false);
                  showNotice('条码扫描成功，已完成在机开瓶装载与首次测试理论核销！');
                }}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium shadow-xs transition-colors cursor-pointer"
              >
                确认开瓶核销
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== 模态弹窗 5：审核弹窗 ==================== */}
      {isAuditModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-200 w-full max-w-xl p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-amber-600" />
                <h3 className="text-sm font-bold text-slate-900">试剂使用单审核核销工作台</h3>
              </div>
              <button
                onClick={() => setIsAuditModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-600">
                当前有 <strong className="text-amber-600">{pendingAuditCount} 笔</strong> 已提交的使用开瓶与耗用单据等待医学主管技师审核核销：
              </p>

              <div className="border border-slate-200 rounded divide-y divide-slate-100 max-h-60 overflow-y-auto">
                {orders
                  .filter(o => o.status === '发送')
                  .map(o => (
                    <div key={o.id} className="p-3 flex items-center justify-between hover:bg-slate-50">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-blue-600 font-mono">{o.orderNo}</span>
                          <span className="text-slate-900 font-medium">{o.user}</span>
                          <span className="text-slate-400 text-[11px]">{o.machine}</span>
                        </div>
                        <div className="text-slate-500 text-[11px] mt-0.5 truncate max-w-sm">
                          {o.desc}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-emerald-600 font-mono">¥{o.totalAmount.toFixed(2)}</div>
                        <div className="text-slate-400 text-[10px]">{o.items.length}项品规</div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between pt-3 border-t border-slate-200">
              <span className="text-[11px] text-slate-500">审核人：李晓红副主任技师 / 郭彩霞主任医师</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAuditModalOpen(false)}
                  className="px-4 py-1.5 border border-slate-300 rounded text-slate-700 hover:bg-slate-100 font-medium transition-colors cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={handleBatchAudit}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-medium shadow-xs transition-colors cursor-pointer"
                >
                  全部通过审核并核销
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== 模态弹窗 6：打印使用凭证 ==================== */}
      {isPrintModalOpen && (activeModalOrder || selectedOrder) && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
              <div className="flex items-center gap-2">
                <Printer className="w-4 h-4 text-blue-600" />
                <h2 className="text-sm font-bold text-slate-900">打印试剂使用出库凭证</h2>
              </div>
              <button
                onClick={() => setIsPrintModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {(() => {
              const target = activeModalOrder || selectedOrder;
              if (!target) return null;

              return (
                <div className="p-8 overflow-y-auto space-y-4 text-xs bg-white text-slate-900">
                  {/* 打印抬头 */}
                  <div className="text-center border-b-2 border-slate-900 pb-4">
                    <h1 className="text-lg font-bold tracking-wider">{hospitalUnit} 临床检验医学中心</h1>
                    <h2 className="text-base font-bold tracking-widest mt-1 text-slate-800">
                      试剂耗材在机开瓶领用 / 消耗核销凭单
                    </h2>
                    <div className="flex justify-between items-center mt-3 text-xs text-slate-600">
                      <div>使用单号：<span className="font-mono font-bold text-slate-900">{target.orderNo}</span></div>
                      <div>领用科室：<span className="font-medium text-slate-900">{target.warehouse}</span></div>
                      <div>打印日期：<span className="font-mono">2026-11-02 11:35:00</span></div>
                    </div>
                  </div>

                  {/* 单据概要 */}
                  <div className="grid grid-cols-2 gap-2 text-xs py-2 border-b border-slate-300">
                    <div>领用技师 (使用者)：<strong>{target.user}</strong></div>
                    <div>登记操作人：<strong>{target.operator}</strong></div>
                    <div>配套机台：<strong>{target.machine}</strong></div>
                    <div>审核核准人：<strong>{target.submitter || '检验科主管技师'}</strong></div>
                    <div className="col-span-2">使用说明事由：{target.desc}</div>
                  </div>

                  {/* 明细清单 */}
                  <table className="w-full text-left text-xs border border-slate-400 border-collapse mt-2">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-400 font-semibold">
                        <th className="py-2 px-2 border-r border-slate-400">试剂编码</th>
                        <th className="py-2 px-2 border-r border-slate-400">试剂品名与包装规格</th>
                        <th className="py-2 px-2 border-r border-slate-400">批号</th>
                        <th className="py-2 px-2 border-r border-slate-400">消耗类别</th>
                        <th className="py-2 px-2 text-center border-r border-slate-400">消耗数量</th>
                        <th className="py-2 px-2 text-right border-r border-slate-400">单价</th>
                        <th className="py-2 px-2 text-right">金额</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-300">
                      {target.items.map((item, i) => (
                        <tr key={i}>
                          <td className="py-2 px-2 border-r border-slate-300 font-mono">{item.code}</td>
                          <td className="py-2 px-2 border-r border-slate-300 font-medium">
                            {item.name} ({item.spec})
                          </td>
                          <td className="py-2 px-2 border-r border-slate-300 font-mono">{item.lotNo}</td>
                          <td className="py-2 px-2 border-r border-slate-300">{item.category}</td>
                          <td className="py-2 px-2 text-center border-r border-slate-300 font-bold">
                            {item.qty} {item.unit}
                          </td>
                          <td className="py-2 px-2 text-right border-r border-slate-300">
                            ¥{item.price.toFixed(2)}
                          </td>
                          <td className="py-2 px-2 text-right font-bold">
                            ¥{item.amount.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-slate-50 font-bold border-t border-slate-400">
                        <td colSpan={4} className="py-2 px-2 text-right border-r border-slate-400">
                          折合总测试量：{target.totalTests.toLocaleString()} 次 / 金额合计：
                        </td>
                        <td colSpan={3} className="py-2 px-2 text-right text-sm">
                          ¥ {target.totalAmount.toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  {/* 签字盖章栏 */}
                  <div className="grid grid-cols-3 gap-6 pt-6 text-xs text-slate-800">
                    <div>领用开瓶人 (签字)：_________________</div>
                    <div>库房发料人 (签字)：_________________</div>
                    <div>科室质控主管 (签字)：_________________</div>
                  </div>
                </div>
              );
            })()}

            <div className="px-6 py-3 border-t border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
              <span className="text-slate-500 text-[11px]">
                纸质凭证由医学检验科与仪器机台工作站存档备查
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsPrintModalOpen(false)}
                  className="px-4 py-1.5 border border-slate-300 rounded text-slate-700 hover:bg-slate-100 font-medium transition-colors cursor-pointer"
                >
                  关闭
                </button>
                <button
                  type="button"
                  onClick={() => {
                    showNotice('试剂使用凭证已发送至化验室打印机');
                    setIsPrintModalOpen(false);
                  }}
                  className="px-5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium shadow-xs transition-colors cursor-pointer"
                >
                  立即打印
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
