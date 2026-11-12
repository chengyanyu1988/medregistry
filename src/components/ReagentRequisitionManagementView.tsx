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
} from './MenuIcon';

export interface RequisitionItem {
  code: string;
  name: string;
  spec: string;
  unit: string;
  stockQty: number; // 总库在库量
  applyQty: number; // 申领数量
  price: number; // 预估单价
  amount: number; // 金额
  purpose: string; // 领用说明用途
}

export interface RequisitionOrder {
  id: string;
  orderNo: string;
  warehouse: string; // 申领库房
  targetWarehouse: string; // 对方库房
  isUrgent: boolean; // 是否急查
  desc: string; // 说明
  operator: string; // 操作人
  operateTime: string; // 操作时间
  submitter: string; // 提交人
  submitTime: string; // 提交时间
  status: '登记' | '提交' | '已发料';
  items: RequisitionItem[];
  totalPieces: number;
  totalAmount: number;
}

// 快速可选在库常备试剂（对应截图 image_2052f8ef.png 中的快捷添加标签）
const QUICK_STOCK_REAGENTS: Array<{
  code: string;
  name: string;
  spec: string;
  unit: string;
  stockQty: number;
  price: number;
  purpose: string;
}> = [
  {
    code: '010021',
    name: '丙氨酸氨基转移酶(ALT)测定试剂盒',
    spec: '速率法 4×60ml/盒',
    unit: '盒',
    stockQty: 48,
    price: 320.0,
    purpose: '日均门诊与急诊生化检测消耗补充',
  },
  {
    code: '010022',
    name: '天门冬氨酸氨基转移酶(AST)测定试剂盒',
    spec: '速率法 4×60ml/盒',
    unit: '盒',
    stockQty: 42,
    price: 330.0,
    purpose: '肝功生化检测通道日常上机',
  },
  {
    code: '010018',
    name: '肌酐(CREA)测定试剂盒(肌氨酸氧化酶法)',
    spec: '4×60ml/盒',
    unit: '盒',
    stockQty: 50,
    price: 260.0,
    purpose: '肾功能生化分析常规用量补给',
  },
  {
    code: '010019',
    name: '尿素(UREA)测定试剂盒(酶动力学法)',
    spec: '4×60ml/盒',
    unit: '盒',
    stockQty: 55,
    price: 210.0,
    purpose: '门急诊肾功常规批量化验',
  },
  {
    code: '010020',
    name: '尿酸(UA)测定试剂盒(尿酸酶比色法)',
    spec: '4×50ml/盒',
    unit: '盒',
    stockQty: 38,
    price: 195.0,
    purpose: '代谢高尿酸血症日常筛查上机',
  },
  {
    code: '010035',
    name: '肌酸激酶同工酶(CK-MB)测定试剂盒',
    spec: '免疫抑制法 2×50ml/盒',
    unit: '盒',
    stockQty: 30,
    price: 480.0,
    purpose: '胸痛中心急诊检验绿色通道备用',
  },
  {
    code: '010041',
    name: '心肌肌钙蛋白I(cTnI)急诊测定试剂条',
    spec: '荧光层析 25条/盒',
    unit: '盒',
    stockQty: 25,
    price: 680.0,
    purpose: '急诊检验科床旁急救备用',
  },
  {
    code: '010052',
    name: '全自动血细胞分析仪专用稀释液(Cellpack)',
    spec: '20L/箱',
    unit: '箱',
    stockQty: 35,
    price: 380.0,
    purpose: '临检流水线常规消耗',
  },
];

// 初始模拟数据：覆盖中心医院各主要检验专业组，采用近期真实时间与真实人名
const INITIAL_REQUISITION_ORDERS: RequisitionOrder[] = [
  {
    id: 'REQ-001',
    orderNo: 'N0000004',
    warehouse: '生化组库房',
    targetWarehouse: '检验科总库',
    isUrgent: true,
    desc: '急查 生化常规肝功及急诊心肌酶学检测试剂周补给',
    operator: '魏明主管检验师',
    operateTime: '2026-10-30 09:15:20',
    submitter: '',
    submitTime: '',
    status: '登记',
    items: [
      {
        code: '010021',
        name: '丙氨酸氨基转移酶(ALT)测定试剂盒',
        spec: '速率法 4×60ml/盒',
        unit: '盒',
        stockQty: 48,
        applyQty: 6,
        price: 320.0,
        amount: 1920.0,
        purpose: '日均门诊与急诊生化检测消耗补充',
      },
      {
        code: '010022',
        name: '天门冬氨酸氨基转移酶(AST)测定试剂盒',
        spec: '速率法 4×60ml/盒',
        unit: '盒',
        stockQty: 42,
        applyQty: 6,
        price: 330.0,
        amount: 1980.0,
        purpose: '肝功生化检测通道日常上机',
      },
      {
        code: '010035',
        name: '肌酸激酶同工酶(CK-MB)测定试剂盒',
        spec: '免疫抑制法 2×50ml/盒',
        unit: '盒',
        stockQty: 30,
        applyQty: 4,
        price: 480.0,
        amount: 1920.0,
        purpose: '胸痛中心急诊检验绿色通道备用',
      },
    ],
    totalPieces: 16,
    totalAmount: 5820.0,
  },
  {
    id: 'REQ-002',
    orderNo: 'N0000003',
    warehouse: '生化组库房',
    targetWarehouse: '检验科总库',
    isUrgent: false,
    desc: '全自动生化分析仪电解质离子稀释液及探针清洗液',
    operator: '刘浩然技师',
    operateTime: '2026-10-29 14:30:10',
    submitter: '',
    submitTime: '',
    status: '登记',
    items: [
      {
        code: '010045',
        name: '全自动生化分析仪酸性清洗液(Cell Wash)',
        spec: '2000ml/瓶',
        unit: '瓶',
        stockQty: 28,
        applyQty: 4,
        price: 420.0,
        amount: 1680.0,
        purpose: '罗氏Cobas 8000反应杯每日例行清洗',
      },
      {
        code: '010047',
        name: 'ISE电解质稀释液与内标液A/B',
        spec: '2000ml/盒',
        unit: '盒',
        stockQty: 20,
        applyQty: 3,
        price: 610.0,
        amount: 1830.0,
        purpose: '急查钾钠氯钙电解质测定消耗',
      },
    ],
    totalPieces: 7,
    totalAmount: 3510.0,
  },
  {
    id: 'REQ-003',
    orderNo: 'N0000002',
    warehouse: '生化组库房',
    targetWarehouse: '检验科总库',
    isUrgent: false,
    desc: '肾功能全套(尿素/肌酐/尿酸)与电解质试剂领用',
    operator: '陈康主管检验师',
    operateTime: '2026-10-28 11:10:00',
    submitter: '李晓红副主任技师',
    submitTime: '2026-10-28 11:35:12',
    status: '提交',
    items: [
      {
        code: '010018',
        name: '肌酐(CREA)测定试剂盒(肌氨酸氧化酶法)',
        spec: '4×60ml/盒',
        unit: '盒',
        stockQty: 50,
        applyQty: 10,
        price: 260.0,
        amount: 2600.0,
        purpose: '住院病区肾脏内科患者术前化验',
      },
      {
        code: '010019',
        name: '尿素(UREA)测定试剂盒(酶动力学法)',
        spec: '4×60ml/盒',
        unit: '盒',
        stockQty: 55,
        applyQty: 10,
        price: 210.0,
        amount: 2100.0,
        purpose: '血液透析中心患者常规监测',
      },
      {
        code: '010020',
        name: '尿酸(UA)测定试剂盒(尿酸酶比色法)',
        spec: '4×50ml/盒',
        unit: '盒',
        stockQty: 38,
        applyQty: 8,
        price: 195.0,
        amount: 1560.0,
        purpose: '体检中心与门诊痛风代谢门诊',
      },
    ],
    totalPieces: 28,
    totalAmount: 6260.0,
  },
  {
    id: 'REQ-004',
    orderNo: 'N0000001',
    warehouse: '生化组库房',
    targetWarehouse: '检验科总库',
    isUrgent: false,
    desc: '血脂四项常规通道检测试剂盒周度正常申请',
    operator: '魏明主管检验师',
    operateTime: '2026-10-27 09:20:00',
    submitter: '郭彩霞主任医师',
    submitTime: '2026-10-27 10:15:00',
    status: '提交',
    items: [
      {
        code: '010065',
        name: '总胆固醇测定试剂盒(COD-PAP法)',
        spec: 'R1: 80mL×4, R2: 20mL×4',
        unit: '盒',
        stockQty: 35,
        applyQty: 5,
        price: 195.0,
        amount: 975.0,
        purpose: '门急诊血脂全套常规通道',
      },
      {
        code: '010068',
        name: '甘油三酯测定试剂盒(GPO-PAP法)',
        spec: 'R1: 80mL×4, R2: 20mL×4',
        unit: '盒',
        stockQty: 32,
        applyQty: 5,
        price: 220.0,
        amount: 1100.0,
        purpose: '门急诊血脂全套常规通道',
      },
      {
        code: '010072',
        name: '高密度脂蛋白胆固醇(HDL-C)测定试剂盒',
        spec: 'R1: 80mL×4, R2: 20mL×4',
        unit: '盒',
        stockQty: 26,
        applyQty: 3,
        price: 260.0,
        amount: 780.0,
        purpose: '心血管内科常规筛查',
      },
      {
        code: '010073',
        name: '低密度脂蛋白胆固醇(LDL-C)测定试剂盒',
        spec: 'R1: 80mL×4, R2: 20mL×4',
        unit: '盒',
        stockQty: 24,
        applyQty: 3,
        price: 290.0,
        amount: 870.0,
        purpose: '心血管内科常规筛查',
      },
    ],
    totalPieces: 16,
    totalAmount: 3725.0,
  },
  {
    id: 'REQ-005',
    orderNo: 'N0000005',
    warehouse: '临检组库房',
    targetWarehouse: '检验科总库',
    isUrgent: true,
    desc: '急查 血常规五分类溶血剂、网织红细胞试剂及质控品领用',
    operator: '钱宇恒技师',
    operateTime: '2026-10-26 08:45:00',
    submitter: '李晓红副主任技师',
    submitTime: '2026-10-26 09:10:00',
    status: '已发料',
    items: [
      {
        code: '010051',
        name: '全自动血细胞分析用溶血剂(Lysercell WNR)',
        spec: '5L/桶',
        unit: '桶',
        stockQty: 20,
        applyQty: 2,
        price: 890.0,
        amount: 1780.0,
        purpose: '血常规流水线白细胞五分类',
      },
      {
        code: '010053',
        name: '全血细胞三水平质控物(高/中/低)',
        spec: '3ml×6支/套',
        unit: '套',
        stockQty: 15,
        applyQty: 2,
        price: 450.0,
        amount: 900.0,
        purpose: '每日晨间双仪器室内质控比对',
      },
    ],
    totalPieces: 4,
    totalAmount: 2680.0,
  },
  {
    id: 'REQ-006',
    orderNo: 'N0000006',
    warehouse: '免疫组库房',
    targetWarehouse: '检验科总库',
    isUrgent: false,
    desc: '化学发光甲状腺功能五项与肿瘤标志物配套试剂申领',
    operator: '黄淑珍工程师',
    operateTime: '2026-10-25 15:10:00',
    submitter: '李晓红副主任技师',
    submitTime: '2026-10-25 15:40:00',
    status: '已发料',
    items: [
      {
        code: '010061',
        name: '促甲状腺激素(TSH)测定试剂盒(化学发光微粒子法)',
        spec: '100测试/盒',
        unit: '盒',
        stockQty: 18,
        applyQty: 4,
        price: 920.0,
        amount: 3680.0,
        purpose: '内分泌科与妇产科日常筛查',
      },
      {
        code: '010063',
        name: '癌胚抗原(CEA)检测试剂盒',
        spec: '100测试/盒',
        unit: '盒',
        stockQty: 15,
        applyQty: 3,
        price: 850.0,
        amount: 2550.0,
        purpose: '肿瘤科与普外科早癌筛查',
      },
    ],
    totalPieces: 7,
    totalAmount: 6230.0,
  },
  {
    id: 'REQ-007',
    orderNo: 'N0000007',
    warehouse: '急诊化验库房',
    targetWarehouse: '检验科总库',
    isUrgent: true,
    desc: '急查 急诊床旁血气分析测试卡与高敏心肌标志物三合一卡',
    operator: '刘浩然技师',
    operateTime: '2026-10-24 20:30:00',
    submitter: '',
    submitTime: '',
    status: '登记',
    items: [
      {
        code: '010042',
        name: '全自动血气生化分析仪多参数测试卡(pH/pCO2/pO2/Lac)',
        spec: '300测试/盒',
        unit: '盒',
        stockQty: 12,
        applyQty: 2,
        price: 1850.0,
        amount: 3700.0,
        purpose: 'ICU与急诊抢救室急危重症动脉血气',
      },
    ],
    totalPieces: 2,
    totalAmount: 3700.0,
  },
  {
    id: 'REQ-008',
    orderNo: 'N0000008',
    warehouse: '微生物组库房',
    targetWarehouse: '检验科总库',
    isUrgent: false,
    desc: '细菌鉴定药敏分析测试卡及无菌血培养双联瓶常规领用',
    operator: '孙伟工程师',
    operateTime: '2026-10-23 11:00:00',
    submitter: '郭彩霞主任医师',
    submitTime: '2026-10-23 11:30:00',
    status: '提交',
    items: [
      {
        code: '010071',
        name: 'VITEK 2 革兰阴性菌鉴定卡(GN卡)',
        spec: '20卡/盒',
        unit: '盒',
        stockQty: 25,
        applyQty: 4,
        price: 820.0,
        amount: 3280.0,
        purpose: '临床各类分泌物与尿培养菌株鉴定',
      },
      {
        code: '010073',
        name: '血培养瓶(需氧与厌氧双联瓶套装)',
        spec: '50瓶/箱',
        unit: '箱',
        stockQty: 10,
        applyQty: 2,
        price: 1200.0,
        amount: 2400.0,
        purpose: '感染科与血液科发热标本培养',
      },
    ],
    totalPieces: 6,
    totalAmount: 5680.0,
  },
  {
    id: 'REQ-009',
    orderNo: 'N0000009',
    warehouse: '输血科库房',
    targetWarehouse: '检验科总库',
    isUrgent: false,
    desc: '微柱凝胶交叉配血卡与抗体筛查红细胞试剂补充',
    operator: '郑美玲技师',
    operateTime: '2026-10-22 10:15:00',
    submitter: '李晓红副主任技师',
    submitTime: '2026-10-22 10:40:00',
    status: '已发料',
    items: [
      {
        code: '010081',
        name: 'ABO/RhD血型抗原微柱凝胶检测卡',
        spec: '24人份/盒',
        unit: '盒',
        stockQty: 40,
        applyQty: 5,
        price: 360.0,
        amount: 1800.0,
        purpose: '临床输血前血型正反定型',
      },
    ],
    totalPieces: 5,
    totalAmount: 1800.0,
  },
  {
    id: 'REQ-010',
    orderNo: 'N0000010',
    warehouse: '生化组库房',
    targetWarehouse: '检验科总库',
    isUrgent: false,
    desc: '常规糖代谢血糖与糖化血红蛋白微柱溶血剂申请',
    operator: '魏明主管检验师',
    operateTime: '2026-10-21 14:00:00',
    submitter: '',
    submitTime: '',
    status: '登记',
    items: [
      {
        code: '010025',
        name: '葡萄糖(Glu)测定试剂盒(己糖激酶法)',
        spec: 'R1: 80mL×4, R2: 20mL×4',
        unit: '盒',
        stockQty: 30,
        applyQty: 4,
        price: 240.0,
        amount: 960.0,
        purpose: '门急诊糖尿病患者空腹与餐后监测',
      },
    ],
    totalPieces: 4,
    totalAmount: 960.0,
  },
  {
    id: 'REQ-011',
    orderNo: 'N0000011',
    warehouse: '临检组库房',
    targetWarehouse: '检验科总库',
    isUrgent: false,
    desc: '全自动凝血分析仪凝血酶原时间(PT)与纤维蛋白原试剂',
    operator: '钱宇恒技师',
    operateTime: '2026-10-20 09:30:00',
    submitter: '李晓红副主任技师',
    submitTime: '2026-10-20 10:00:00',
    status: '已发料',
    items: [
      {
        code: '010037',
        name: '凝血酶原时间(PT)测定试剂(重组人组织因子法)',
        spec: '10×10ml/盒',
        unit: '盒',
        stockQty: 20,
        applyQty: 3,
        price: 490.0,
        amount: 1470.0,
        purpose: '手术室急查与住院抗凝监测',
      },
    ],
    totalPieces: 3,
    totalAmount: 1470.0,
  },
  {
    id: 'REQ-012',
    orderNo: 'N0000012',
    warehouse: '生化组库房',
    targetWarehouse: '检验科总库',
    isUrgent: false,
    desc: '心肌酶谱乳酸脱氢酶(LDH)及总胆红素试剂周度申领',
    operator: '刘浩然技师',
    operateTime: '2026-10-19 16:20:00',
    submitter: '郭彩霞主任医师',
    submitTime: '2026-10-19 16:50:00',
    status: '已发料',
    items: [
      {
        code: '010031',
        name: '乳酸脱氢酶(LDH)测定试剂盒(DGKC法)',
        spec: 'R1: 80mL×4, R2: 20mL×4',
        unit: '盒',
        stockQty: 18,
        applyQty: 3,
        price: 500.0,
        amount: 1500.0,
        purpose: '常规生化通道日常检测',
      },
    ],
    totalPieces: 3,
    totalAmount: 1500.0,
  },
];

export const ReagentRequisitionManagementView: React.FC<{
  hospitalUnit: string;
  showNotice: (m: string) => void;
}> = ({ hospitalUnit, showNotice }) => {
  // 1. 数据列表
  const [orders, setOrders] = useState<RequisitionOrder[]>(INITIAL_REQUISITION_ORDERS);

  // 2. 筛选状态 (严格匹配截图 image_827332b8.png: 当前库房、申领单号、编制日期、状态)
  const [filterWarehouse, setFilterWarehouse] = useState<string>('生化库');
  const [filterOrderNo, setFilterOrderNo] = useState<string>('');
  const [filterDateRange, setFilterDateRange] = useState<string>('2026-10-01 ~ 2026-10-31');
  const [filterStatus, setFilterStatus] = useState<string>('全部');

  // 3. 展开折叠行 (默认展开第一行 N0000004)
  const [expandedOrderIds, setExpandedOrderIds] = useState<string[]>(['REQ-001']);
  const [selectedOrderNo, setSelectedOrderNo] = useState<string>('N0000004');

  // 4. 分页状态 (用户核心需求：一页帮我显示10条数据)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  // 5. 模态窗口控制
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
  const [isRevokeModalOpen, setIsRevokeModalOpen] = useState<boolean>(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);

  // 当前激活选中的单据对象
  const [activeModalOrder, setActiveModalOrder] = useState<RequisitionOrder | null>(null);

  // 6. 新增表单状态 (严格匹配截图 image_2052f8ef.png)
  const [addForm, setAddForm] = useState<{
    orderNo: string;
    warehouse: string;
    targetWarehouse: string;
    operator: string;
    purpose: string;
    urgency: string;
    items: RequisitionItem[];
  }>({
    orderNo: 'N0000005',
    warehouse: '生化组库房',
    targetWarehouse: '检验科总库',
    operator: '刘浩然技师',
    purpose: '急诊及门诊常规生化检测耗材周度申领',
    urgency: '常规申领',
    items: [
      {
        code: '010021',
        name: '丙氨酸氨基转移酶(ALT)测定试剂盒',
        spec: '速率法 4×60ml/盒',
        unit: '盒',
        stockQty: 48,
        applyQty: 5,
        price: 320.0,
        amount: 1600.0,
        purpose: '常规门急诊通道备用',
      },
      {
        code: '010018',
        name: '肌酐(CREA)测定试剂盒(肌氨酸氧化酶法)',
        spec: '4×60ml/盒',
        unit: '盒',
        stockQty: 50,
        applyQty: 5,
        price: 260.0,
        amount: 1300.0,
        purpose: '常规门急诊通道备用',
      },
    ],
  });

  // 切换行展开
  const toggleRowExpand = (id: string, orderNo: string) => {
    setSelectedOrderNo(orderNo);
    setExpandedOrderIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // 筛选过滤
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      // 库房过滤
      if (filterWarehouse !== '全部库房') {
        const targetWarehouse = filterWarehouse.replace('库', '');
        if (!o.warehouse.includes(targetWarehouse)) return false;
      }
      // 单号/操作人搜索
      if (filterOrderNo.trim()) {
        const kw = filterOrderNo.trim().toLowerCase();
        const match =
          o.orderNo.toLowerCase().includes(kw) ||
          o.operator.toLowerCase().includes(kw) ||
          o.desc.toLowerCase().includes(kw);
        if (!match) return false;
      }
      // 状态过滤
      if (filterStatus !== '全部' && o.status !== filterStatus) {
        return false;
      }
      return true;
    });
  }, [orders, filterWarehouse, filterOrderNo, filterStatus]);

  // 分页计算 (一页显示10条数据)
  const totalCount = filteredOrders.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const pagedOrders = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filteredOrders.slice(start, start + pageSize);
  }, [filteredOrders, safePage, pageSize]);

  // 4 个指标统计卡 (严格对应截图 image_827332b8.png)
  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const draftCount = orders.filter((o) => o.status === '登记').length;
    const submittedCount = orders.filter((o) => o.status === '提交').length;
    const totalBudget = orders.reduce((sum, item) => sum + item.totalAmount, 0);

    return {
      totalOrders,
      draftCount,
      submittedCount,
      totalBudget,
    };
  }, [orders]);

  // 打开新增弹窗
  const handleOpenAddModal = () => {
    const nextOrderNum = 'N000000' + (orders.length + 1);
    setAddForm({
      orderNo: nextOrderNum,
      warehouse: filterWarehouse === '全部库房' ? '生化组库房' : filterWarehouse.replace('库', '组库房'),
      targetWarehouse: '检验科总库',
      operator: '刘浩然技师',
      purpose: '急诊及门诊常规生化检测耗材周度申领',
      urgency: '常规申领',
      items: [
        {
          code: '010021',
          name: '丙氨酸氨基转移酶(ALT)测定试剂盒',
          spec: '速率法 4×60ml/盒',
          unit: '盒',
          stockQty: 48,
          applyQty: 5,
          price: 320.0,
          amount: 1600.0,
          purpose: '常规门急诊通道备用',
        },
        {
          code: '010018',
          name: '肌酐(CREA)测定试剂盒(肌氨酸氧化酶法)',
          spec: '4×60ml/盒',
          unit: '盒',
          stockQty: 50,
          applyQty: 5,
          price: 260.0,
          amount: 1300.0,
          purpose: '常规门急诊通道备用',
        },
      ],
    });
    setIsAddModalOpen(true);
  };

  // 点击药盒标签快速追加在库试剂
  const handleAddStockReagent = (stockItem: (typeof QUICK_STOCK_REAGENTS)[0]) => {
    // 检查是否已存在
    const exists = addForm.items.find((i) => i.code === stockItem.code);
    if (exists) {
      // 数量+1
      setAddForm({
        ...addForm,
        items: addForm.items.map((i) =>
          i.code === stockItem.code
            ? { ...i, applyQty: i.applyQty + 1, amount: (i.applyQty + 1) * i.price }
            : i
        ),
      });
      showNotice(`已增加【${stockItem.name}】申领数量至 ${exists.applyQty + 1} 盒`);
      return;
    }

    const newItem: RequisitionItem = {
      code: stockItem.code,
      name: stockItem.name,
      spec: stockItem.spec,
      unit: stockItem.unit,
      stockQty: stockItem.stockQty,
      applyQty: 5,
      price: stockItem.price,
      amount: 5 * stockItem.price,
      purpose: stockItem.purpose,
    };

    setAddForm({
      ...addForm,
      items: [...addForm.items, newItem],
    });
    showNotice(`已追加【${stockItem.name}】至拟申领列表`);
  };

  // 保存新增 (状态: '登记' 或 '提交')
  const handleSaveAdd = (targetStatus: '登记' | '提交') => {
    if (addForm.items.length === 0) {
      showNotice('请至少添加一种拟申领的试剂品规');
      return;
    }

    const totalAmt = addForm.items.reduce((s, it) => s + it.amount, 0);
    const totalPcs = addForm.items.reduce((s, it) => s + it.applyQty, 0);

    const isUrgent = addForm.urgency.includes('急查');
    const newOrder: RequisitionOrder = {
      id: `REQ-${Date.now()}`,
      orderNo: addForm.orderNo,
      warehouse: addForm.warehouse,
      targetWarehouse: addForm.targetWarehouse,
      isUrgent,
      desc: isUrgent ? `急查 ${addForm.purpose}` : addForm.purpose,
      operator: addForm.operator,
      operateTime: '2026-10-31 09:40:00',
      submitter: targetStatus === '提交' ? '李晓红副主任技师' : '',
      submitTime: targetStatus === '提交' ? '2026-10-31 09:45:00' : '',
      status: targetStatus,
      items: addForm.items,
      totalPieces: totalPcs,
      totalAmount: totalAmt,
    };

    setOrders([newOrder, ...orders]);
    setSelectedOrderNo(newOrder.orderNo);
    setExpandedOrderIds([newOrder.id, ...expandedOrderIds]);
    setIsAddModalOpen(false);

    if (targetStatus === '提交') {
      showNotice(`申领单【${newOrder.orderNo}】已直接提交至检验科总库待发料！`);
    } else {
      showNotice(`申领单【${newOrder.orderNo}】已保存为草稿登记，可随时修改！`);
    }
  };

  // 顶部“提交”按钮操作
  const handleBatchSubmit = () => {
    const current = orders.find((o) => o.orderNo === selectedOrderNo) || orders[0];
    if (!current) return;
    if (current.status !== '登记') {
      showNotice(`申领单【${current.orderNo}】当前状态为【${current.status}】，无需重复提交！`);
      return;
    }

    const updated = orders.map((o) =>
      o.id === current.id
        ? {
            ...o,
            status: '提交' as const,
            submitter: '李晓红副主任技师',
            submitTime: '2026-10-31 09:50:00',
          }
        : o
    );
    setOrders(updated);
    showNotice(`申领单【${current.orderNo}】已成功审核提交至总库！`);
  };

  // 打开查看弹窗 (对应截图 image_07a3ce25.png)
  const handleOpenView = (order: RequisitionOrder) => {
    setActiveModalOrder(order);
    setIsViewModalOpen(true);
  };

  // 打开撤销弹窗 / 撤销操作
  const handleOpenRevoke = (order: RequisitionOrder) => {
    setActiveModalOrder(order);
    setIsRevokeModalOpen(true);
  };

  // 确认撤销
  const handleConfirmRevoke = () => {
    if (!activeModalOrder) return;
    const updated = orders.map((o) =>
      o.id === activeModalOrder.id
        ? {
            ...o,
            status: '登记' as const,
            submitter: '',
            submitTime: '',
          }
        : o
    );
    setOrders(updated);
    setIsRevokeModalOpen(false);
    showNotice(`申领单【${activeModalOrder.orderNo}】已成功撤销，回退至草稿登记状态`);
  };

  // 删除单据
  const handleDeleteOrder = (order: RequisitionOrder) => {
    if (order.status !== '登记') {
      showNotice(`申领单【${order.orderNo}】已处于${order.status}状态，不可直接删除！`);
      return;
    }
    if (window.confirm(`确定要删除草稿申领单【${order.orderNo}】吗？`)) {
      setOrders(orders.filter((o) => o.id !== order.id));
      showNotice(`已删除申领单【${order.orderNo}】`);
    }
  };

  // 打印申领单据
  const handlePrintRequisition = (order?: RequisitionOrder) => {
    const target = order || orders.find((o) => o.orderNo === selectedOrderNo) || orders[0];
    setActiveModalOrder(target);
    setIsPrintModalOpen(true);
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 flex-1 flex flex-col overflow-hidden text-xs text-slate-800 shadow-2xs font-sans">
      {/* 顶部主标题栏与操作按钮组 (完全对应截图 image_827332b8.png 顶部结构) */}
      <div className="px-4 py-2.5 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
            <Boxes className="w-4.5 h-4.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 tracking-tight">试剂申领管理</h2>
              <span className="text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 font-medium">
                {hospitalUnit || '中心医院'}
              </span>
            </div>
            <p className="text-slate-500 text-[11px] mt-0.5">
              临床检验专业组耗材线上申领、总库自动核验库存、审批流转与发料出库协同
            </p>
          </div>
        </div>

        {/* 右上角按钮 (完全对应截图：+ 新增、提交) */}
        <div className="flex items-center gap-2">
          {/* + 新增 */}
          <button
            type="button"
            onClick={handleOpenAddModal}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>新增</span>
          </button>

          {/* 提交 */}
          <button
            type="button"
            onClick={handleBatchSubmit}
            className="px-4 py-1.5 bg-white border border-blue-500 text-blue-600 hover:bg-blue-50 rounded text-xs font-medium flex items-center gap-1.5 shadow-2xs transition-colors"
            title="将当前选中的单据提交至总库审核发料"
          >
            <Check className="w-3.5 h-3.5" />
            <span>提交</span>
          </button>
        </div>
      </div>

      {/* 4 个指标卡片 (完全对应截图 image_827332b8.png: 申领单总数、草稿待提交、已提交待发料、申领总预算金额) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 px-4 py-2.5 bg-slate-50 border-b border-slate-200 shrink-0">
        {/* 卡片1: 申领单总数 */}
        <div className="bg-white p-3 rounded-lg border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-[11px] text-slate-500 font-medium">申领单总数</div>
            <div className="text-base font-bold font-mono text-slate-900 mt-0.5">
              {stats.totalOrders} <span className="text-xs font-normal text-slate-500">单</span>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
            <FileText className="w-4 h-4" />
          </div>
        </div>

        {/* 卡片2: 草稿待提交 (橙色) */}
        <div className="bg-white p-3 rounded-lg border border-amber-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-[11px] text-amber-800 font-medium">草稿待提交</div>
            <div className="text-base font-bold font-mono text-amber-700 mt-0.5">
              {stats.draftCount} <span className="text-xs font-normal text-slate-500">单</span>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
        </div>

        {/* 卡片3: 已提交待发料 (蓝色) */}
        <div className="bg-white p-3 rounded-lg border border-blue-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-[11px] text-blue-800 font-medium">已提交待发料</div>
            <div className="text-base font-bold font-mono text-blue-700 mt-0.5">
              {stats.submittedCount} <span className="text-xs font-normal text-slate-500">单</span>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>

        {/* 卡片4: 申领总预算金额 (绿色) */}
        <div className="bg-white p-3 rounded-lg border border-emerald-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-[11px] text-emerald-800 font-medium">申领总预算金额</div>
            <div className="text-base font-bold font-mono text-emerald-600 mt-0.5">
              ¥ {stats.totalBudget.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* 筛选工具栏 (完全对应截图 image_827332b8.png: 当前库房、申领单号、编制日期、状态、查询、重置) */}
      <div className="px-4 py-2 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex flex-wrap items-center gap-3">
          {/* 当前库房 */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-600 font-medium whitespace-nowrap">当前库房:</span>
            <select
              value={filterWarehouse}
              onChange={(e) => setFilterWarehouse(e.target.value)}
              className="bg-white border border-slate-300 rounded px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
            >
              <option value="生化库">生化库</option>
              <option value="临检库">临检库</option>
              <option value="免疫库">免疫库</option>
              <option value="微生物库">微生物库</option>
              <option value="急诊化验库">急诊化验库</option>
              <option value="输血科">输血科</option>
              <option value="全部库房">全部库房</option>
            </select>
          </div>

          {/* 申领单号 */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-600 font-medium whitespace-nowrap">申领单号:</span>
            <div className="relative">
              <input
                type="text"
                value={filterOrderNo}
                onChange={(e) => setFilterOrderNo(e.target.value)}
                placeholder="请输入或扫描申领单号"
                className="w-48 pl-2.5 pr-7 py-1 bg-white border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-blue-500 placeholder-slate-400"
              />
              <span className="absolute right-2 top-2 text-slate-400 pointer-events-none">▦</span>
            </div>
          </div>

          {/* 编制日期 */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-600 font-medium whitespace-nowrap">编制日期:</span>
            <div className="relative">
              <input
                type="text"
                value={filterDateRange}
                onChange={(e) => setFilterDateRange(e.target.value)}
                className="w-48 pl-2.5 pr-7 py-1 bg-white border border-slate-300 rounded text-xs font-mono text-slate-800 focus:outline-none focus:border-blue-500"
              />
              <CalendarCheck className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2 pointer-events-none" />
            </div>
          </div>

          {/* 状态 */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-600 font-medium whitespace-nowrap">状态:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-white border border-slate-300 rounded px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
            >
              <option value="全部">全部</option>
              <option value="登记">登记</option>
              <option value="提交">提交</option>
              <option value="已发料">已发料</option>
            </select>
          </div>

          {/* 查询按钮 */}
          <button
            type="button"
            onClick={() => showNotice(`检索完成，共找到 ${filteredOrders.length} 笔申领单据`)}
            className="px-4 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium shadow-xs transition-colors flex items-center gap-1"
          >
            <Search className="w-3 h-3" />
            <span>查询</span>
          </button>

          {/* 重置筛选 */}
          <button
            type="button"
            onClick={() => {
              setFilterWarehouse('全部库房');
              setFilterOrderNo('');
              setFilterStatus('全部');
              showNotice('已重置所有筛选参数');
            }}
            className="p-1 text-slate-500 hover:text-slate-800 border border-slate-300 rounded hover:bg-slate-50 transition-colors"
            title="重置筛选"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 主表格数据区 (带折叠嵌套明细，完全还原截图 image_827332b8.png) */}
      <div className="flex-1 overflow-auto min-h-0 bg-white">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="sticky top-0 z-10 bg-[#fafafa] text-slate-700 font-semibold border-b border-slate-200 select-none shadow-2xs">
            <tr>
              <th className="py-2.5 px-3 w-8 text-center">#</th>
              <th className="py-2.5 px-3 whitespace-nowrap">申领单号</th>
              <th className="py-2.5 px-3 whitespace-nowrap">申领库房</th>
              <th className="py-2.5 px-3 whitespace-nowrap">对方库房</th>
              <th className="py-2.5 px-3 whitespace-nowrap min-w-[220px]">说明</th>
              <th className="py-2.5 px-3 whitespace-nowrap">操作人</th>
              <th className="py-2.5 px-3 whitespace-nowrap">操作时间</th>
              <th className="py-2.5 px-3 whitespace-nowrap">提交人</th>
              <th className="py-2.5 px-3 whitespace-nowrap">提交时间</th>
              <th className="py-2.5 px-3 text-center whitespace-nowrap">状态</th>
              <th className="py-2.5 px-3 text-center whitespace-nowrap w-28">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {pagedOrders.length === 0 ? (
              <tr>
                <td colSpan={11} className="py-16 text-center text-slate-400">
                  <Archive className="w-9 h-9 mx-auto text-slate-300 mb-2" />
                  <div>暂无符合筛选条件的试剂申领记录</div>
                </td>
              </tr>
            ) : (
              pagedOrders.map((order) => {
                const isExpanded = expandedOrderIds.includes(order.id);
                const isSelected = order.orderNo === selectedOrderNo;

                return (
                  <React.Fragment key={order.id}>
                    {/* 主单行 */}
                    <tr
                      onClick={() => toggleRowExpand(order.id, order.orderNo)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-blue-50/70 font-medium text-slate-900'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      {/* # 展开折叠图标 */}
                      <td className="py-2.5 px-3 text-center text-blue-600">
                        {isExpanded ? (
                          <ChevronDown className="w-3.5 h-3.5 inline" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5 inline text-slate-400" />
                        )}
                      </td>

                      {/* 申领单号 (蓝字) */}
                      <td className="py-2.5 px-3 font-mono font-bold text-blue-600 whitespace-nowrap">
                        {order.orderNo}
                      </td>

                      {/* 申领库房 */}
                      <td className="py-2.5 px-3 whitespace-nowrap text-slate-800">
                        {order.warehouse}
                      </td>

                      {/* 对方库房 */}
                      <td className="py-2.5 px-3 whitespace-nowrap text-slate-600">
                        {order.targetWarehouse}
                      </td>

                      {/* 说明 (带急查红色徽标) */}
                      <td className="py-2.5 px-3 text-slate-700">
                        <div className="flex items-center gap-1.5 truncate max-w-sm">
                          {order.isUrgent && (
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-200 shrink-0">
                              急查
                            </span>
                          )}
                          <span className="truncate" title={order.desc}>
                            {order.desc.replace('急查 ', '')}
                          </span>
                        </div>
                      </td>

                      {/* 操作人 (真实人名) */}
                      <td className="py-2.5 px-3 whitespace-nowrap text-slate-800">
                        {order.operator}
                      </td>

                      {/* 操作时间 */}
                      <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                        {order.operateTime}
                      </td>

                      {/* 提交人 */}
                      <td className="py-2.5 px-3 whitespace-nowrap text-slate-700">
                        {order.submitter || '-'}
                      </td>

                      {/* 提交时间 */}
                      <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                        {order.submitTime || '-'}
                      </td>

                      {/* 状态徽标 (严格匹配截图：登记为黄标，提交为蓝标，已发料为绿标) */}
                      <td className="py-2.5 px-3 text-center whitespace-nowrap">
                        {order.status === '提交' ? (
                          <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-700 border border-blue-200">
                            提交
                          </span>
                        ) : order.status === '已发料' ? (
                          <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                            已发料
                          </span>
                        ) : (
                          <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            登记
                          </span>
                        )}
                      </td>

                      {/* 操作栏 (匹配截图：登记对应编辑/删除/打印，提交对应撤销/查看/打印) */}
                      <td
                        className="py-2.5 px-3 text-center whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {order.status === '登记' ? (
                          <div className="flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setActiveModalOrder(order);
                                setIsViewModalOpen(true);
                              }}
                              className="text-blue-600 hover:text-blue-800 hover:underline font-medium text-xs"
                            >
                              编辑
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteOrder(order)}
                              className="text-rose-600 hover:text-rose-800 hover:underline font-medium text-xs"
                            >
                              删除
                            </button>
                            <button
                              type="button"
                              onClick={() => handlePrintRequisition(order)}
                              className="text-slate-500 hover:text-blue-600"
                              title="打印申领单"
                            >
                              <Printer className="w-3.5 h-3.5 inline" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleOpenRevoke(order)}
                              className="text-blue-600 hover:text-blue-800 hover:underline font-medium text-xs"
                              title="撤销提交回退至草稿状态"
                            >
                              撤销
                            </button>
                            <button
                              type="button"
                              onClick={() => handleOpenView(order)}
                              className="text-blue-600 hover:text-blue-800 hover:underline font-medium text-xs"
                            >
                              查看
                            </button>
                            <button
                              type="button"
                              onClick={() => handlePrintRequisition(order)}
                              className="text-slate-500 hover:text-blue-600"
                              title="打印申领单"
                            >
                              <Printer className="w-3.5 h-3.5 inline" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>

                    {/* 展开的嵌套子表格 (完全对应截图 image_827332b8.png: 申领试剂品规明细) */}
                    {isExpanded && (
                      <tr className="bg-slate-50/70 border-y border-blue-100">
                        <td colSpan={11} className="p-3 pl-8">
                          <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
                            {/* 子表顶栏 */}
                            <div className="px-4 py-2 bg-slate-50/80 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                              <div className="flex items-center gap-3">
                                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                                  <Boxes className="w-3.5 h-3.5 text-blue-600" />
                                  <span>申领试剂品规明细 ({order.items.length} 项)</span>
                                </span>
                                <span className="text-slate-500 font-mono text-[11px]">
                                  总件数: <strong className="text-slate-800">{order.totalPieces}</strong>
                                </span>
                                <span className="text-slate-500 font-mono text-[11px]">
                                  预估总额: <strong className="text-emerald-600 font-bold">¥ {order.totalAmount.toFixed(2)}</strong>
                                </span>
                              </div>

                              <button
                                type="button"
                                onClick={() => handlePrintRequisition(order)}
                                className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 font-medium"
                              >
                                <Printer className="w-3.5 h-3.5" />
                                <span>打印申领领料单</span>
                              </button>
                            </div>

                            {/* 子表明细列表 */}
                            <div className="overflow-x-auto">
                              <table className="w-full text-left text-xs border-collapse">
                                <thead className="bg-[#fafafa] text-slate-600 font-semibold border-b border-slate-200">
                                  <tr>
                                    <th className="py-2 px-3 whitespace-nowrap">试剂编码</th>
                                    <th className="py-2 px-3 whitespace-nowrap">试剂品名</th>
                                    <th className="py-2 px-3 whitespace-nowrap">包装规格</th>
                                    <th className="py-2 px-2 text-center whitespace-nowrap">单位</th>
                                    <th className="py-2 px-3 text-right whitespace-nowrap">总库在库量</th>
                                    <th className="py-2 px-3 text-right whitespace-nowrap font-bold text-blue-600">申领数量</th>
                                    <th className="py-2 px-3 text-right whitespace-nowrap">预估单价</th>
                                    <th className="py-2 px-3 text-right whitespace-nowrap font-bold text-emerald-600">金额</th>
                                    <th className="py-2 px-3 whitespace-nowrap">领用说明用途</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                  {order.items.map((it, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50/80">
                                      {/* 试剂编码 */}
                                      <td className="py-2 px-3 font-mono text-slate-600 whitespace-nowrap">
                                        {it.code}
                                      </td>

                                      {/* 试剂品名 */}
                                      <td className="py-2 px-3 font-bold text-slate-900">
                                        {it.name}
                                      </td>

                                      {/* 包装规格 */}
                                      <td className="py-2 px-3 font-mono text-slate-600 text-[11px] whitespace-nowrap">
                                        {it.spec}
                                      </td>

                                      {/* 单位 */}
                                      <td className="py-2 px-2 text-center text-slate-700 whitespace-nowrap">
                                        {it.unit}
                                      </td>

                                      {/* 总库在库量 */}
                                      <td className="py-2 px-3 text-right font-mono text-slate-700 whitespace-nowrap">
                                        {it.stockQty} {it.unit}
                                      </td>

                                      {/* 申领数量 (蓝字粗体) */}
                                      <td className="py-2 px-3 text-right font-mono font-bold text-blue-600 whitespace-nowrap">
                                        {it.applyQty} {it.unit}
                                      </td>

                                      {/* 预估单价 */}
                                      <td className="py-2 px-3 text-right font-mono text-slate-600 whitespace-nowrap">
                                        ¥ {it.price.toFixed(2)}
                                      </td>

                                      {/* 金额 (绿字粗体) */}
                                      <td className="py-2 px-3 text-right font-mono font-bold text-emerald-600 whitespace-nowrap">
                                        ¥ {it.amount.toFixed(2)}
                                      </td>

                                      {/* 领用说明用途 */}
                                      <td className="py-2 px-3 text-slate-600 text-[11px] truncate max-w-xs">
                                        {it.purpose}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* 底部汇总与分页栏 (完全对应截图 image_827332b8.png 底部: 合计X条，右侧当前显示与制单基准时间) */}
      <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-700 shrink-0 font-medium select-none">
        <div className="flex items-center gap-4">
          <span className="font-bold text-blue-600">合计: {totalCount} 条</span>

          {/* 分页控制栏 (一页显示10条数据) */}
          <div className="flex items-center gap-2 text-slate-600">
            <button
              type="button"
              disabled={safePage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-2 py-0.5 bg-white border border-slate-300 rounded text-xs disabled:opacity-40 hover:bg-slate-100"
            >
              上一页
            </button>
            <span className="font-mono text-xs">
              第 {safePage} / {totalPages} 页 (每页 10 条)
            </span>
            <button
              type="button"
              disabled={safePage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-2 py-0.5 bg-white border border-slate-300 rounded text-xs disabled:opacity-40 hover:bg-slate-100"
            >
              下一页
            </button>
          </div>
        </div>

        {/* 右侧基准信息栏 */}
        <div className="flex items-center gap-4 text-xs text-slate-500 font-mono">
          <span>当前显示第 {Math.min(1, totalCount)} 至 {Math.min(pagedOrders.length, totalCount)} 条记录</span>
          <span>当前库房: {filterWarehouse}</span>
          <span>制单基准时间: 近期临床排班 (2026年10月)</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 弹窗 1：编制新增试剂申领单 (完全1:1还原截图 image_2052f8ef.png) */}
      {/* ========================================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* 标题栏 */}
            <div className="px-5 py-3.5 bg-white border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Plus className="w-4 h-4 text-blue-600" />
                  <span>编制新增试剂申领单</span>
                </h3>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  从检验科总库申请调配专业组临床检测所需试剂耗材
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 表单内容 */}
            <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              {/* 第一行：申领单号、申领库房、对方发料库房、编制操作人 */}
              <div className="grid grid-cols-4 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">申领单号 (自动生成)</label>
                  <input
                    type="text"
                    readOnly
                    value={addForm.orderNo}
                    className="w-full bg-slate-100 border border-slate-200 rounded px-2.5 py-1.5 text-xs font-mono font-bold text-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    申领库房 <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={addForm.warehouse}
                    onChange={(e) => setAddForm({ ...addForm, warehouse: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                  >
                    <option value="生化组库房">生化组库房</option>
                    <option value="临检组库房">临检组库房</option>
                    <option value="免疫组库房">免疫组库房</option>
                    <option value="微生物组库房">微生物组库房</option>
                    <option value="急诊化验库房">急诊化验库房</option>
                    <option value="输血科库房">输血科库房</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">对方发料库房</label>
                  <input
                    type="text"
                    readOnly
                    value={addForm.targetWarehouse}
                    className="w-full bg-slate-100 border border-slate-200 rounded px-2.5 py-1.5 text-xs text-slate-700"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    编制操作人 <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={addForm.operator}
                    onChange={(e) => setAddForm({ ...addForm, operator: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-medium"
                  >
                    <option value="刘浩然技师">刘浩然技师</option>
                    <option value="魏明主管检验师">魏明主管检验师</option>
                    <option value="陈康主管检验师">陈康主管检验师</option>
                    <option value="钱宇恒技师">钱宇恒技师</option>
                    <option value="李晓红副主任技师">李晓红副主任技师</option>
                  </select>
                </div>
              </div>

              {/* 第二行：申领用途说明、申领紧急程度 */}
              <div className="grid grid-cols-4 gap-3">
                <div className="col-span-3">
                  <label className="block text-slate-700 font-semibold mb-1">申领用途说明</label>
                  <input
                    type="text"
                    value={addForm.purpose}
                    onChange={(e) => setAddForm({ ...addForm, purpose: e.target.value })}
                    placeholder="例如: 急诊及门诊常规生化检测耗材周度申领"
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">申领紧急程度</label>
                  <select
                    value={addForm.urgency}
                    onChange={(e) => setAddForm({ ...addForm, urgency: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-medium"
                  >
                    <option value="常规申领">常规申领</option>
                    <option value="急查紧急领料">急查紧急领料</option>
                  </select>
                </div>
              </div>

              {/* 快捷添加总库在库试剂标签区 (严格对应截图 image_2052f8ef.png) */}
              <div className="border border-slate-200 rounded-lg p-3 bg-slate-50/70 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">快捷添加总库在库试剂</span>
                  <span className="text-[11px] text-slate-400">点击试剂药盒直接追加至申领单</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {QUICK_STOCK_REAGENTS.map((st) => (
                    <button
                      key={st.code}
                      type="button"
                      onClick={() => handleAddStockReagent(st)}
                      className="px-2.5 py-1 bg-white hover:bg-blue-50 active:bg-blue-100 border border-slate-300 hover:border-blue-400 text-slate-700 rounded text-xs flex items-center gap-1 transition-colors shadow-2xs"
                    >
                      <Plus className="w-3 h-3 text-blue-600" />
                      <span>{st.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">({st.stockQty}在库)</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 申领试剂明细表格 (严格对应截图 image_2052f8ef.png) */}
              <div className="border border-slate-200 rounded-lg p-3 bg-white space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">
                    申领试剂明细 ({addForm.items.length}项)
                  </span>
                  <span className="text-xs font-semibold text-slate-600">
                    预估总金额:{' '}
                    <strong className="text-emerald-600 font-mono font-bold text-sm">
                      ¥ {addForm.items.reduce((s, it) => s + it.amount, 0).toFixed(2)}
                    </strong>
                  </span>
                </div>

                <div className="border border-slate-200 rounded overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-[#fafafa] text-slate-700 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="py-2 px-2.5">试剂编码</th>
                        <th className="py-2 px-2.5">试剂名称</th>
                        <th className="py-2 px-2.5">规格</th>
                        <th className="py-2 px-2 text-center">单位</th>
                        <th className="py-2 px-2 text-right">总库在库</th>
                        <th className="py-2 px-2.5 text-center w-24">申领数量</th>
                        <th className="py-2 px-2 text-right">单价</th>
                        <th className="py-2 px-2.5 text-right font-bold text-emerald-600">金额</th>
                        <th className="py-2 px-2 text-center w-8">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {addForm.items.map((it, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="py-2 px-2.5 font-mono text-slate-700">{it.code}</td>
                          <td className="py-2 px-2.5 font-semibold text-slate-900">{it.name}</td>
                          <td className="py-2 px-2.5 font-mono text-slate-600 text-[11px]">{it.spec}</td>
                          <td className="py-2 px-2 text-center text-slate-700">{it.unit}</td>
                          <td className="py-2 px-2 text-right font-mono text-slate-600">{it.stockQty}</td>
                          <td className="py-2 px-2.5 text-center">
                            <input
                              type="number"
                              min={1}
                              max={it.stockQty}
                              value={it.applyQty}
                              onChange={(e) => {
                                const val = parseInt(e.target.value) || 1;
                                const nextItems = [...addForm.items];
                                nextItems[idx] = {
                                  ...nextItems[idx],
                                  applyQty: val,
                                  amount: val * nextItems[idx].price,
                                };
                                setAddForm({ ...addForm, items: nextItems });
                              }}
                              className="w-16 text-center border border-slate-300 rounded px-1.5 py-0.5 text-xs font-mono font-bold text-blue-700"
                            />
                          </td>
                          <td className="py-2 px-2 text-right font-mono text-slate-700">
                            ¥ {it.price.toFixed(2)}
                          </td>
                          <td className="py-2 px-2.5 text-right font-mono font-bold text-emerald-600">
                            ¥ {it.amount.toFixed(2)}
                          </td>
                          <td className="py-2 px-2 text-center">
                            <button
                              type="button"
                              onClick={() => {
                                setAddForm({
                                  ...addForm,
                                  items: addForm.items.filter((_, i) => i !== idx),
                                });
                              }}
                              className="text-slate-400 hover:text-rose-600"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* 底部按钮 (严格对应截图：取消、暂存为草稿(登记)、直接提交审核) */}
            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-1.5 bg-white border border-slate-300 text-slate-700 rounded hover:bg-slate-100 font-medium text-xs"
              >
                取消
              </button>
              <button
                type="button"
                onClick={() => handleSaveAdd('登记')}
                className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded font-medium text-xs shadow-xs"
              >
                暂存为草稿 (登记)
              </button>
              <button
                type="button"
                onClick={() => handleSaveAdd('提交')}
                className="px-5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium text-xs shadow-xs"
              >
                直接提交审核
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 弹窗 2：申领单详细档案 (完全1:1还原截图 image_07a3ce25.png) */}
      {/* ========================================================================= */}
      {isViewModalOpen && activeModalOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* 标题栏 */}
            <div className="px-5 py-3.5 bg-white border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Eye className="w-4 h-4 text-blue-600" />
                <span>申领单详细档案 - {activeModalOrder.orderNo}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsViewModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto text-xs text-slate-700">
              {/* 顶部4步审批流转状态进度条 (完全对应截图 image_07a3ce25.png) */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="text-[11px] font-bold text-slate-500 mb-2">申领单审批流转状态</div>
                <div className="flex items-center justify-between text-xs font-medium">
                  {/* 步骤1 */}
                  <div className="flex items-center gap-1.5 text-emerald-600 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>1. 编制草稿 (已完成)</span>
                  </div>
                  <div className="h-0.5 w-8 bg-emerald-500" />

                  {/* 步骤2 */}
                  <div className="flex items-center gap-1.5 text-emerald-600 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>2. 专业组审核提交</span>
                  </div>
                  <div className="h-0.5 w-8 bg-blue-500" />

                  {/* 步骤3 */}
                  <div className={`flex items-center gap-1.5 ${activeModalOrder.status === '已发料' ? 'text-emerald-600 font-bold' : 'text-blue-600 font-bold'}`}>
                    <Clock className="w-4 h-4" />
                    <span>3. 总库备货出库</span>
                  </div>
                  <div className="h-0.5 w-8 bg-slate-300" />

                  {/* 步骤4 */}
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Archive className="w-4 h-4" />
                    <span>4. 科室签收核销</span>
                  </div>
                </div>
              </div>

              {/* 两列基础信息网格 (完全对应截图 image_07a3ce25.png) */}
              <div className="grid grid-cols-2 gap-y-2.5 gap-x-6 p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <div>
                  <span className="text-slate-500">申领单号: </span>
                  <strong className="font-mono text-blue-600 font-bold">{activeModalOrder.orderNo}</strong>
                </div>
                <div>
                  <span className="text-slate-500">单据状态: </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    activeModalOrder.status === '提交'
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : activeModalOrder.status === '已发料'
                      ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {activeModalOrder.status}
                  </span>
                </div>

                <div>
                  <span className="text-slate-500">申领库房: </span>
                  <strong className="text-slate-900 font-bold">{activeModalOrder.warehouse}</strong>
                </div>
                <div>
                  <span className="text-slate-500">发料库房: </span>
                  <span className="font-semibold text-slate-900">{activeModalOrder.targetWarehouse}</span>
                </div>

                <div>
                  <span className="text-slate-500">制单操作人: </span>
                  <span className="font-bold text-slate-900">{activeModalOrder.operator}</span>
                </div>
                <div>
                  <span className="text-slate-500">制单时间: </span>
                  <span className="font-mono text-slate-700">{activeModalOrder.operateTime}</span>
                </div>

                <div>
                  <span className="text-slate-500">提交责任人: </span>
                  <span className="font-bold text-slate-900">{activeModalOrder.submitter || '-'}</span>
                </div>
                <div>
                  <span className="text-slate-500">提交时间: </span>
                  <span className="font-mono text-slate-700">{activeModalOrder.submitTime || '-'}</span>
                </div>

                <div className="col-span-2">
                  <span className="text-slate-500">申领用途说明: </span>
                  <span className="text-slate-800">{activeModalOrder.desc}</span>
                </div>
              </div>

              {/* 申领试剂耗材品规明细 (严格对应截图表格) */}
              <div>
                <h4 className="font-bold text-slate-800 mb-2">
                  申领试剂耗材品规明细 ({activeModalOrder.items.length} 项)
                </h4>
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-[#fafafa] text-slate-700 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="py-2 px-3">编码</th>
                        <th className="py-2 px-3">品名规格</th>
                        <th className="py-2 px-2 text-center">单位</th>
                        <th className="py-2 px-3 text-right font-bold text-blue-600">申领量</th>
                        <th className="py-2 px-3 text-right">单价</th>
                        <th className="py-2 px-3 text-right font-bold text-emerald-600">金额</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {activeModalOrder.items.map((it, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="py-2 px-3 font-mono text-slate-600">{it.code}</td>
                          <td className="py-2 px-3">
                            <span className="font-semibold text-slate-900">{it.name}</span>
                            <span className="text-slate-500 text-[11px] font-mono ml-1">({it.spec})</span>
                          </td>
                          <td className="py-2 px-2 text-center text-slate-700">{it.unit}</td>
                          <td className="py-2 px-3 text-right font-mono font-bold text-blue-600">
                            {it.applyQty}
                          </td>
                          <td className="py-2 px-3 text-right font-mono text-slate-600">
                            ¥ {it.price.toFixed(2)}
                          </td>
                          <td className="py-2 px-3 text-right font-mono font-bold text-emerald-600">
                            ¥ {it.amount.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-slate-50 font-bold">
                        <td colSpan={3} className="py-2 px-3 text-slate-700">合计</td>
                        <td className="py-2 px-3 text-right font-mono text-blue-600">{activeModalOrder.totalPieces}</td>
                        <td className="py-2 px-3" />
                        <td className="py-2 px-3 text-right font-mono text-emerald-600">
                          ¥ {activeModalOrder.totalAmount.toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* 底部按钮 (严格对应截图：左侧打印申领单据，右侧关闭) */}
            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => handlePrintRequisition(activeModalOrder)}
                className="px-4 py-1.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 rounded font-medium text-xs shadow-2xs flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>打印申领单据</span>
              </button>

              <button
                type="button"
                onClick={() => setIsViewModalOpen(false)}
                className="px-5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium text-xs shadow-xs"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 弹窗 3：撤销确认弹窗 */}
      {/* ========================================================================= */}
      {isRevokeModalOpen && activeModalOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-3.5 bg-white border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-amber-500" />
                <span>撤销申领单审核提交</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsRevokeModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3 text-xs text-slate-700">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 leading-relaxed">
                确定要撤销申领单【<span className="font-mono font-bold">{activeModalOrder.orderNo}</span>】的提交申请吗？撤销后该单据将回退至草稿“登记”状态，总库将暂停该单的发料出库准备。
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded text-slate-700 space-y-1">
                <div>申领库房: <strong>{activeModalOrder.warehouse}</strong></div>
                <div>说明用途: <span>{activeModalOrder.desc}</span></div>
                <div>预估金额: <strong className="text-emerald-600 font-mono">¥ {activeModalOrder.totalAmount.toFixed(2)}</strong></div>
              </div>
            </div>

            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsRevokeModalOpen(false)}
                className="px-4 py-1.5 bg-white border border-slate-300 text-slate-700 rounded hover:bg-slate-100 font-medium text-xs"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleConfirmRevoke}
                className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded font-medium text-xs shadow-xs"
              >
                确认撤销提交
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 弹窗 4：打印申领单凭证预览 */}
      {/* ========================================================================= */}
      {isPrintModalOpen && activeModalOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-300 w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-slate-100 px-5 py-3 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Printer className="w-4 h-4 text-slate-700" />
                <span className="font-bold text-sm text-slate-800">
                  打印预览 - 检验医学科试剂耗材内部领料出库单
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsPrintModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-8 overflow-y-auto flex-1 bg-slate-200/50 flex justify-center">
              <div className="bg-white w-full max-w-2xl p-6 shadow-md border border-slate-300 text-slate-900 text-xs">
                <div className="text-center border-b-2 border-slate-800 pb-3 mb-4">
                  <h1 className="text-lg font-bold tracking-wider">{hospitalUnit || '中心医院'}</h1>
                  <h2 className="text-base font-bold mt-1 tracking-widest text-slate-800">
                    检验医学科 医用耗材/试剂内部申领领料单
                  </h2>
                  <div className="flex justify-between items-center text-[11px] text-slate-500 mt-2 font-mono">
                    <span>申领单号: {activeModalOrder.orderNo}</span>
                    <span>申领部门: {activeModalOrder.warehouse}</span>
                    <span>发料库房: {activeModalOrder.targetWarehouse}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-y-1.5 text-xs mb-3 text-slate-700">
                  <div>申领制单人：<span className="font-semibold text-slate-900">{activeModalOrder.operator}</span></div>
                  <div>申请时间：<span className="font-mono text-slate-900">{activeModalOrder.operateTime}</span></div>
                  <div>审批提交人：<span className="font-semibold text-slate-900">{activeModalOrder.submitter || '李晓红副主任技师'}</span></div>
                  <div>审批时间：<span className="font-mono text-slate-900">{activeModalOrder.submitTime || '-'}</span></div>
                  <div className="col-span-2">领料用途：<span className="text-slate-800">{activeModalOrder.desc}</span></div>
                </div>

                <table className="w-full border-collapse border border-slate-400 text-xs text-left mb-3">
                  <thead>
                    <tr className="bg-slate-100 text-slate-800">
                      <th className="border border-slate-400 py-1.5 px-2 text-center w-8">#</th>
                      <th className="border border-slate-400 py-1.5 px-2">试剂编码</th>
                      <th className="border border-slate-400 py-1.5 px-2">试剂品名</th>
                      <th className="border border-slate-400 py-1.5 px-2 font-mono">包装规格</th>
                      <th className="border border-slate-400 py-1.5 px-2 text-center w-10">单位</th>
                      <th className="border border-slate-400 py-1.5 px-2 text-right w-14">申请数量</th>
                      <th className="border border-slate-400 py-1.5 px-2 text-right w-16">单价</th>
                      <th className="border border-slate-400 py-1.5 px-2 text-right w-20">预估金额</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeModalOrder.items.map((it, idx) => (
                      <tr key={idx}>
                        <td className="border border-slate-400 py-1.5 px-2 text-center font-mono">{idx + 1}</td>
                        <td className="border border-slate-400 py-1.5 px-2 font-mono">{it.code}</td>
                        <td className="border border-slate-400 py-1.5 px-2 font-medium">{it.name}</td>
                        <td className="border border-slate-400 py-1.5 px-2 font-mono text-[11px]">{it.spec}</td>
                        <td className="border border-slate-400 py-1.5 px-2 text-center">{it.unit}</td>
                        <td className="border border-slate-400 py-1.5 px-2 text-right font-mono font-bold text-blue-600">{it.applyQty}</td>
                        <td className="border border-slate-400 py-1.5 px-2 text-right font-mono">{it.price.toFixed(2)}</td>
                        <td className="border border-slate-400 py-1.5 px-2 text-right font-mono font-bold">{it.amount.toFixed(2)}</td>
                      </tr>
                    ))}
                    <tr className="bg-slate-50 font-bold">
                      <td colSpan={5} className="border border-slate-400 py-2 px-2 text-left">
                        合计总件数：{activeModalOrder.totalPieces} 件
                      </td>
                      <td colSpan={3} className="border border-slate-400 py-2 px-2 text-right font-mono text-sm text-slate-900">
                        预估总金额：￥{activeModalOrder.totalAmount.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div className="grid grid-cols-4 gap-4 pt-4 text-[11px] text-slate-700">
                  <div>领料人：<span className="font-semibold">{activeModalOrder.operator}</span></div>
                  <div>专业组长：<span className="font-semibold">{activeModalOrder.submitter || '李晓红副主任技师'}</span></div>
                  <div>总库保管员：<span className="font-semibold">魏明主管检验师</span></div>
                  <div>出库复核：<span className="text-slate-400">(签字盖章)</span></div>
                </div>
              </div>
            </div>

            <div className="bg-slate-100 px-5 py-3 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-mono">建议打印纸型: A4 竖向领料凭证</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsPrintModalOpen(false)}
                  className="px-4 py-1.5 border border-slate-300 text-slate-700 rounded hover:bg-slate-200 font-medium text-xs"
                >
                  关闭
                </button>
                <button
                  type="button"
                  onClick={() => {
                    showNotice(`已将申领单【${activeModalOrder.orderNo}】发送至科室网络激光打印机`);
                    setIsPrintModalOpen(false);
                  }}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium text-xs shadow-xs flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>立即打印</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
