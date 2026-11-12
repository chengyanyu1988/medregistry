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
  ShieldAlert,
} from './MenuIcon';

export interface LossItem {
  code: string;
  name: string;
  reason: string; // 报损具体原因，如'西格玛评估严重偏离失控判定无效'
  lossType: '质控失控废弃' | '储温异常变质' | '物理包装破损' | '效期逾期报废' | '试剂浑浊失效';
  manufacturer: string; // 生产商
  supplier: string; // 供应商
  spec: string; // 规格型号
  lotNo: string;
  expireDate: string;
  unit: string;
  qty: number;
  price: number;
  amount: number;
}

export interface LossOrder {
  id: string;
  orderNo: string;
  tabType: 'loss' | 'recovery'; // 科室报损登记 | 调入与回收核销
  warehouse: string; // 库房
  summaryReason: string; // 简要事由
  operator: string; // 操作人 (真实临床人名)
  operateTime: string; // 操作时间
  submitter: string; // 提交人 / 审核人
  submitTime: string; // 提交时间
  status: '登记' | '发送' | '已核销'; // 状态
  items: LossItem[];
  totalPieces: number;
  totalAmount: number;
}

// 候选试剂库 (新增弹窗快速挑选)
const SCRAP_CANDIDATES = [
  {
    code: '010201',
    name: '复合生化多项室内质控品(正常水平 Level 1)',
    spec: '5ml×10支/盒',
    manufacturer: '英国朗道实验诊断(Randox)',
    supplier: '上海润达医疗科技股份有限公司',
    lotNo: 'LOT-260801QC1',
    expireDate: '2027-07-31',
    price: 850.0,
    unit: '盒',
    defaultReason: '西格玛评估严重偏离失控判定无效',
    defaultType: '质控失控废弃' as const,
  },
  {
    code: '010210',
    name: '血清总胆红素/直接胆红素校准品(C.f.a.s)',
    spec: '3ml×6支/盒',
    manufacturer: '罗氏诊断产品(上海)有限公司',
    supplier: '国药控股医学检验科技(上海)有限公司',
    lotNo: 'LOT-260810CAL',
    expireDate: '2027-08-09',
    price: 1200.0,
    unit: '盒',
    defaultReason: '4℃冰箱化霜升温异常导致蛋白变性',
    defaultType: '储温异常变质' as const,
  },
  {
    code: '010012',
    name: '丙氨酸氨基转移酶(ALT)测定试剂盒(IFCC速率法)',
    spec: 'R1: 4×60ml, R2: 4×20ml',
    manufacturer: '罗氏诊断产品(上海)有限公司',
    supplier: '国药控股分销时代有限公司',
    lotNo: 'LOT-260610ALT',
    expireDate: '2026-10-15',
    price: 380.0,
    unit: '盒',
    defaultReason: '开瓶逾期未用尽且已过瓶上效期',
    defaultType: '效期逾期报废' as const,
  },
  {
    code: '010035',
    name: '肌酸激酶同工酶(CK-MB)测定试剂盒',
    spec: '2×50ml/盒',
    manufacturer: '深圳迈瑞生物医疗电子股份有限公司',
    supplier: '上药控股有限公司',
    lotNo: 'LOT-260901CK',
    expireDate: '2027-09-01',
    price: 480.0,
    unit: '盒',
    defaultReason: '运输开箱破损瓶盖裂隙外溢',
    defaultType: '物理包装破损' as const,
  },
  {
    code: '010042',
    name: '电解质ISE电极内部标准参比液(A/B液)',
    spec: '2000ml×2瓶/套',
    manufacturer: '贝克曼库尔特商贸(中国)有限公司',
    supplier: '上海医疗器械进出口有限公司',
    lotNo: 'LOT-260811ISE',
    expireDate: '2027-08-10',
    price: 680.0,
    unit: '套',
    defaultReason: '试剂瓶底沉淀结晶浑浊经质检复核报废',
    defaultType: '试剂浑浊失效' as const,
  },
];

// 初始高拟真临床报损数据 (10+ 条近期真实记录 2026-10 / 2026-11)
const INITIAL_LOSS_ORDERS: LossOrder[] = [
  // 严格匹配截图 image_3fb5d66c.png 第 1 行 N0000004
  {
    id: 'LOSS-001',
    orderNo: 'N0000004',
    tabType: 'loss',
    warehouse: '生化组库房',
    summaryReason: '生化质控物开瓶污染与变质报废登记',
    operator: '魏明主管检验师',
    operateTime: '2026-10-30 10:10:10',
    submitter: '',
    submitTime: '',
    status: '登记',
    items: [
      {
        code: '010202',
        name: '复合生化多项室内质控品(病理高值 Level 2)',
        reason: '开瓶复溶后复测精密度不佳，质控失控废弃',
        lossType: '质控失控废弃',
        manufacturer: '英国朗道实验诊断(Randox)',
        supplier: '上海润达医疗科技股份有限公司',
        spec: '5ml×10支/盒',
        lotNo: 'LOT-260801QC2',
        expireDate: '2027-07-31',
        unit: '盒',
        qty: 1,
        price: 850.0,
        amount: 850.0,
      },
    ],
    totalPieces: 1,
    totalAmount: 850.0,
  },

  // 严格匹配截图第 2 行 N0000003
  {
    id: 'LOSS-002',
    orderNo: 'N0000003',
    tabType: 'loss',
    warehouse: '生化组库房',
    summaryReason: '上机测试过程反应液沉淀及管路浑浊报损',
    operator: '陈康主管检验师',
    operateTime: '2026-10-29 11:20:15',
    submitter: '',
    submitTime: '',
    status: '登记',
    items: [
      {
        code: '010042',
        name: '电解质ISE电极内部标准参比液(A/B液)',
        reason: '试剂瓶底沉淀结晶浑浊经质检复核报废',
        lossType: '试剂浑浊失效',
        manufacturer: '贝克曼库尔特商贸(中国)有限公司',
        supplier: '上海医疗器械进出口有限公司',
        spec: '2000ml×2瓶/套',
        lotNo: 'LOT-260811ISE',
        expireDate: '2027-08-10',
        unit: '套',
        qty: 1,
        price: 680.0,
        amount: 680.0,
      },
    ],
    totalPieces: 1,
    totalAmount: 680.0,
  },

  // 严格匹配截图第 3 行 N0000002 及右侧明细 (重点展示)
  {
    id: 'LOSS-003',
    orderNo: 'N0000002',
    tabType: 'loss',
    warehouse: '生化组库房',
    summaryReason: '室内质控失控废弃与超温',
    operator: '刘浩然技师',
    operateTime: '2026-10-28 14:15:30',
    submitter: '李晓红副主任技师',
    submitTime: '2026-10-28 15:00:00',
    status: '发送',
    items: [
      {
        code: '010201',
        name: '复合生化多项室内质控品(正常水平 Level 1)',
        reason: '原因: 西格玛评估严重偏离失控判定无效',
        lossType: '质控失控废弃',
        manufacturer: '英国朗道实验诊断(Randox)',
        supplier: '上海润达医疗科技股份有限公司',
        spec: '5ml×10支/盒',
        lotNo: 'LOT-260801QC1',
        expireDate: '2027-07-31',
        unit: '盒',
        qty: 1,
        price: 850.0,
        amount: 850.0,
      },
      {
        code: '010210',
        name: '血清总胆红素/直接胆红素校准品(C.f.a.s)',
        reason: '原因: 4℃冰箱化霜升温异常导致蛋白变性',
        lossType: '储温异常变质',
        manufacturer: '罗氏诊断产品(上海)有限公司',
        supplier: '国药控股医学检验科技(上海)有限公司',
        spec: '3ml×6支/盒',
        lotNo: 'LOT-260810CAL',
        expireDate: '2027-08-09',
        unit: '盒',
        qty: 1,
        price: 1200.0,
        amount: 1200.0,
      },
    ],
    totalPieces: 2,
    totalAmount: 2050.0,
  },

  // 严格匹配截图第 4 行 N0000001
  {
    id: 'LOSS-004',
    orderNo: 'N0000001',
    tabType: 'loss',
    warehouse: '生化组库房',
    summaryReason: '分装外包装物理破损与开箱漏液报损申请',
    operator: '魏明主管检验师',
    operateTime: '2026-10-27 09:30:00',
    submitter: '郭彩霞主任医师',
    submitTime: '2026-10-27 10:15:20',
    status: '发送',
    items: [
      {
        code: '010035',
        name: '肌酸激酶同工酶(CK-MB)测定试剂盒',
        reason: '运输开箱破损瓶盖裂隙外溢污染',
        lossType: '物理包装破损',
        manufacturer: '深圳迈瑞生物医疗电子股份有限公司',
        supplier: '上药控股有限公司',
        spec: '2×50ml/盒',
        lotNo: 'LOT-260901CK',
        expireDate: '2027-09-01',
        unit: '盒',
        qty: 2,
        price: 480.0,
        amount: 960.0,
      },
    ],
    totalPieces: 2,
    totalAmount: 960.0,
  },

  // 单据 5 (用于填满10条/页)
  {
    id: 'LOSS-005',
    orderNo: 'N0000005',
    tabType: 'loss',
    warehouse: '生化组库房',
    summaryReason: '常规门诊急诊生化近效期未用尽逾期核销',
    operator: '钱宇恒技师',
    operateTime: '2026-10-25 16:00:00',
    submitter: '李晓红副主任技师',
    submitTime: '2026-10-25 16:30:00',
    status: '已核销',
    items: [
      {
        code: '010012',
        name: '丙氨酸氨基转移酶(ALT)测定试剂盒(IFCC速率法)',
        reason: '开瓶逾期未用尽且已过瓶上效期，按感控规范废弃',
        lossType: '效期逾期报废',
        manufacturer: '罗氏诊断产品(上海)有限公司',
        supplier: '国药控股分销时代有限公司',
        spec: 'R1: 4×60ml, R2: 4×20ml',
        lotNo: 'LOT-260610ALT',
        expireDate: '2026-10-15',
        unit: '盒',
        qty: 1,
        price: 380.0,
        amount: 380.0,
      },
    ],
    totalPieces: 1,
    totalAmount: 380.0,
  },

  // 单据 6
  {
    id: 'LOSS-006',
    orderNo: 'N0000006',
    tabType: 'loss',
    warehouse: '生化组库房',
    summaryReason: '冷库温控探头漂移导致短暂超温变性批次',
    operator: '孙丽丽主管检验师',
    operateTime: '2026-10-24 09:10:00',
    submitter: '郭彩霞主任医师',
    submitTime: '2026-10-24 09:40:00',
    status: '已核销',
    items: [
      {
        code: '010072',
        name: '高密度脂蛋白胆固醇(HDL-C)测定试剂盒',
        reason: '冷库报警升温超标导致酶试剂变性失活',
        lossType: '储温异常变质',
        manufacturer: '罗氏诊断产品(上海)有限公司',
        supplier: '国药控股医学检验科技(上海)有限公司',
        spec: 'R1: 4×80ml, R2: 2×40ml',
        lotNo: 'LOT-260810HDL',
        expireDate: '2027-08-09',
        unit: '盒',
        qty: 2,
        price: 260.0,
        amount: 520.0,
      },
    ],
    totalPieces: 2,
    totalAmount: 520.0,
  },

  // 单据 7
  {
    id: 'LOSS-007',
    orderNo: 'N0000007',
    tabType: 'loss',
    warehouse: '生化组库房',
    summaryReason: '日立7600反应盘清洗针碰撞导致试剂瓶破损',
    operator: '张建国主任技师',
    operateTime: '2026-10-22 17:15:00',
    submitter: '李晓红副主任技师',
    submitTime: '2026-10-22 17:35:00',
    status: '已核销',
    items: [
      {
        code: '010025',
        name: '葡萄糖(Glu)测定试剂盒(己糖激酶法)',
        reason: '机台探针机械臂卡顿导致R1瓶口压裂',
        lossType: '物理包装破损',
        manufacturer: '中生北控生物科技股份有限公司',
        supplier: '国药控股分销时代有限公司',
        spec: 'R1: 4×80ml, R2: 2×40ml',
        lotNo: 'LOT-260918GLU',
        expireDate: '2027-09-17',
        unit: '盒',
        qty: 1,
        price: 240.0,
        amount: 240.0,
      },
    ],
    totalPieces: 1,
    totalAmount: 240.0,
  },

  // 单据 8
  {
    id: 'LOSS-008',
    orderNo: 'N0000008',
    tabType: 'loss',
    warehouse: '生化组库房',
    summaryReason: '室内质控多项靶值严重漂移且重新定标无效',
    operator: '刘浩然技师',
    operateTime: '2026-10-21 08:30:00',
    submitter: '郭彩霞主任医师',
    submitTime: '2026-10-21 08:55:00',
    status: '已核销',
    items: [
      {
        code: '010201',
        name: '复合生化多项室内质控品(正常水平 Level 1)',
        reason: '复溶后均一性达不到质控控制限，判定失效报损',
        lossType: '质控失控废弃',
        manufacturer: '英国朗道实验诊断(Randox)',
        supplier: '上海润达医疗科技股份有限公司',
        spec: '5ml×10支/盒',
        lotNo: 'LOT-260801QC1',
        expireDate: '2027-07-31',
        unit: '盒',
        qty: 1,
        price: 850.0,
        amount: 850.0,
      },
    ],
    totalPieces: 1,
    totalAmount: 850.0,
  },

  // 单据 9
  {
    id: 'LOSS-009',
    orderNo: 'N0000009',
    tabType: 'loss',
    warehouse: '生化组库房',
    summaryReason: '心肌酶谱急查备用试剂过期报损',
    operator: '魏明主管检验师',
    operateTime: '2026-10-19 14:00:00',
    submitter: '李晓红副主任技师',
    submitTime: '2026-10-19 14:20:00',
    status: '已核销',
    items: [
      {
        code: '010041',
        name: '心肌肌钙蛋白I(cTnI)急诊测定试剂条',
        reason: '急救检验绿色通道临期未耗尽报损',
        lossType: '效期逾期报废',
        manufacturer: '基蛋生物科技股份有限公司',
        supplier: '国药控股医学检验科技(上海)有限公司',
        spec: '25条/盒',
        lotNo: 'LOT-260905CTN',
        expireDate: '2026-10-18',
        unit: '盒',
        qty: 1,
        price: 680.0,
        amount: 680.0,
      },
    ],
    totalPieces: 1,
    totalAmount: 680.0,
  },

  // 单据 10
  {
    id: 'LOSS-010',
    orderNo: 'N0000010',
    tabType: 'loss',
    warehouse: '生化组库房',
    summaryReason: '生化分析用探针清洗液过期沉淀报损',
    operator: '陈康主管检验师',
    operateTime: '2026-10-18 10:10:00',
    submitter: '郭彩霞主任医师',
    submitTime: '2026-10-18 10:40:00',
    status: '已核销',
    items: [
      {
        code: '010095',
        name: '生化分析仪碱性清洗液(Cellclean)',
        reason: '存放环境低温结晶无法溶解',
        lossType: '试剂浑浊失效',
        manufacturer: '希森美康医用电子(上海)有限公司',
        supplier: '国药控股分销时代有限公司',
        spec: '500ml×4瓶/箱',
        lotNo: 'LOT-260601C',
        expireDate: '2028-05-31',
        unit: '箱',
        qty: 1,
        price: 420.0,
        amount: 420.0,
      },
    ],
    totalPieces: 1,
    totalAmount: 420.0,
  },

  // ====================== 【调入/回收核销】(调入标签页功能) ======================
  {
    id: 'REC-001',
    orderNo: 'REC-20261031-01',
    tabType: 'recovery',
    warehouse: '医疗危废暂存间 / 总库回收处',
    summaryReason: '生化组质控失控品移交危废集中无害化销毁',
    operator: '危废专管员 (张洪波)',
    operateTime: '2026-10-31 09:30:00',
    submitter: '李晓红副主任技师',
    submitTime: '2026-10-31 10:00:00',
    status: '已核销',
    items: [
      {
        code: '010201',
        name: '复合生化多项室内质控品(正常水平 Level 1)',
        reason: '高压蒸汽灭菌与医疗危险废物转运联单核销',
        lossType: '质控失控废弃',
        manufacturer: '英国朗道实验诊断(Randox)',
        supplier: '上海润达医疗科技股份有限公司',
        spec: '5ml×10支/盒',
        lotNo: 'LOT-260801QC1',
        expireDate: '2027-07-31',
        unit: '盒',
        qty: 2,
        price: 850.0,
        amount: 1700.0,
      },
    ],
    totalPieces: 2,
    totalAmount: 1700.0,
  },
  {
    id: 'REC-002',
    orderNo: 'REC-20261029-02',
    tabType: 'recovery',
    warehouse: '医疗危废暂存间 / 供应商退损处',
    summaryReason: '外包装破损试剂厂家退货质保更换调入核销',
    operator: '危废专管员 (张洪波)',
    operateTime: '2026-10-29 14:00:00',
    submitter: '郭彩霞主任医师',
    submitTime: '2026-10-29 14:30:00',
    status: '已核销',
    items: [
      {
        code: '010035',
        name: '肌酸激酶同工酶(CK-MB)测定试剂盒',
        reason: '厂家验损确认，予以全额红冲退补',
        lossType: '物理包装破损',
        manufacturer: '深圳迈瑞生物医疗电子股份有限公司',
        supplier: '上药控股有限公司',
        spec: '2×50ml/盒',
        lotNo: 'LOT-260901CK',
        expireDate: '2027-09-01',
        unit: '盒',
        qty: 2,
        price: 480.0,
        amount: 960.0,
      },
    ],
    totalPieces: 2,
    totalAmount: 960.0,
  },
];

export const ReagentLossManagementView: React.FC<{
  hospitalUnit: string;
  showNotice: (m: string) => void;
}> = ({ hospitalUnit, showNotice }) => {
  // 数据列表
  const [orders, setOrders] = useState<LossOrder[]>(INITIAL_LOSS_ORDERS);

  // 3. 当前选中的单据 ID (默认选中 N0000002，点击左侧表格内容，右侧数据也跟着变化！)
  const [selectedOrderId, setSelectedOrderId] = useState<string>('LOSS-003');

  // 4. 筛选条件 (严格匹配截图 image_3fb5d66c.png)
  const [filterWarehouse, setFilterWarehouse] = useState<string>('生化库');
  const [filterDateRange, setFilterDateRange] = useState<string>('2026-10-01 ~ 2026-10-31');
  const [filterStatus, setFilterStatus] = useState<string>('全部');

  // 5. 分页 (一页严格显示 10 条数据)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  // 6. 模态窗口状态
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
  const [isRevokeModalOpen, setIsRevokeModalOpen] = useState<boolean>(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState<boolean>(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);

  // 激活的操作单据
  const [activeModalOrder, setActiveModalOrder] = useState<LossOrder | null>(null);

  // 7. 新增报损表单状态
  const [addForm, setAddForm] = useState<{
    orderNo: string;
    warehouse: string;
    operator: string;
    summaryReason: string;
    selectedCandidateCode: string;
    customReason: string;
    inputQty: number;
    items: LossItem[];
  }>({
    orderNo: 'N0000005',
    warehouse: '生化组库房',
    operator: '魏明主管检验师',
    summaryReason: '常规质控与分析通道异常试剂报废申请',
    selectedCandidateCode: '010201',
    customReason: '西格玛评估严重偏离失控判定无效',
    inputQty: 1,
    items: [
      {
        code: '010201',
        name: '复合生化多项室内质控品(正常水平 Level 1)',
        reason: '西格玛评估严重偏离失控判定无效',
        lossType: '质控失控废弃',
        manufacturer: '英国朗道实验诊断(Randox)',
        supplier: '上海润达医疗科技股份有限公司',
        spec: '5ml×10支/盒',
        lotNo: 'LOT-260801QC1',
        expireDate: '2027-07-31',
        unit: '盒',
        qty: 1,
        price: 850.0,
        amount: 850.0,
      },
    ],
  });

  // 筛选后的单据
  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      // 库房筛选
      if (filterWarehouse !== '全部') {
        if (!o.warehouse.includes(filterWarehouse.replace('库', ''))) {
          // 放宽库房匹配
        }
      }

      // 状态筛选
      if (filterStatus !== '全部' && o.status !== filterStatus) {
        return false;
      }

      return true;
    });
  }, [orders, filterWarehouse, filterStatus]);

  // 分页切片 (保证一页恰好 10 条数据)
  const totalPages = Math.ceil(filteredOrders.length / pageSize) || 1;
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredOrders.slice(start, start + pageSize);
  }, [filteredOrders, currentPage, pageSize]);

  // 当前激活选中的报损单 (左右联动核心：如果当前选中的不在筛选列表里，回退第一项)
  const selectedOrder = useMemo(() => {
    const found = filteredOrders.find(o => o.id === selectedOrderId);
    if (found) return found;
    return filteredOrders[0] || orders[0] || null;
  }, [filteredOrders, selectedOrderId, orders]);

  // 待审核笔数 (截图顶部黄色胶囊: 待审核: 2 笔)
  const pendingAuditCount = useMemo(() => {
    return orders.filter(o => o.status === '发送').length;
  }, [orders]);

  // 新增弹窗中：点击添加报损品规
  const handleAddItemToForm = () => {
    const cand = SCRAP_CANDIDATES.find(c => c.code === addForm.selectedCandidateCode);
    if (!cand) return;

    const newItem: LossItem = {
      code: cand.code,
      name: cand.name,
      reason: addForm.customReason.trim() || cand.defaultReason,
      lossType: cand.defaultType,
      manufacturer: cand.manufacturer,
      supplier: cand.supplier,
      spec: cand.spec,
      lotNo: cand.lotNo,
      expireDate: cand.expireDate,
      unit: cand.unit,
      qty: addForm.inputQty,
      price: cand.price,
      amount: cand.price * addForm.inputQty,
    };

    setAddForm(prev => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
    showNotice(`已将【${cand.name}】追加至报损清单`);
  };

  // 移除新增清单中的某项
  const handleRemoveFormItem = (index: number) => {
    setAddForm(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
    showNotice('已移除该报损项');
  };

  // 计算新增表单合计金额
  const addFormTotalAmount = useMemo(() => {
    return addForm.items.reduce((s, it) => s + it.amount, 0);
  }, [addForm.items]);

  // 保存新增报损单
  const handleSaveLossOrder = (asSubmit: boolean) => {
    if (addForm.items.length === 0) {
      showNotice('请至少添加一项报损试剂耗材！');
      return;
    }

    const newOrder: LossOrder = {
      id: `LOSS-${Date.now()}`,
      orderNo: addForm.orderNo,
      tabType: 'loss',
      warehouse: addForm.warehouse,
      summaryReason: addForm.summaryReason,
      operator: addForm.operator,
      operateTime: '2026-11-02 10:00:00',
      submitter: asSubmit ? '李晓红副主任技师' : '',
      submitTime: asSubmit ? '2026-11-02 10:15:00' : '',
      status: asSubmit ? '发送' : '登记',
      items: addForm.items,
      totalPieces: addForm.items.reduce((s, it) => s + it.qty, 0),
      totalAmount: addFormTotalAmount,
    };

    setOrders([newOrder, ...orders]);
    setSelectedOrderId(newOrder.id);
    setIsAddModalOpen(false);

    // 自动自增单号
    const nextNum = parseInt(addForm.orderNo.replace(/\D/g, '') || '5', 10) + 1;
    setAddForm(prev => ({
      ...prev,
      orderNo: `N${String(nextNum).padStart(7, '0')}`,
    }));

    showNotice(asSubmit ? `报损单【${newOrder.orderNo}】已提交科主任与质控审核！` : `报损单【${newOrder.orderNo}】已暂存登记！`);
  };

  // 撤销发送操作 (回退为登记状态)
  const handleConfirmRevoke = () => {
    if (!activeModalOrder) return;
    setOrders(prev =>
      prev.map(o => (o.id === activeModalOrder.id ? { ...o, status: '登记', submitter: '', submitTime: '' } : o))
    );
    setIsRevokeModalOpen(false);
    showNotice(`已成功撤销报损单【${activeModalOrder.orderNo}】并回退为登记状态！`);
  };

  // 批量通过审核 (核准平账)
  const handleBatchAudit = () => {
    const pending = orders.filter(o => o.status === '发送');
    if (pending.length === 0) {
      showNotice('当前没有待审核的报损单据');
      return;
    }
    setOrders(prev =>
      prev.map(o => (o.status === '发送' ? { ...o, status: '已核销' } : o))
    );
    setIsAuditModalOpen(false);
    showNotice(`已审核通过 ${pending.length} 笔试剂报损审批单，并完成库存账面核减平账！`);
  };

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-slate-50 text-slate-800 text-xs">
      {/* 顶部标题与操作栏 (严格匹配截图 image_3fb5d66c.png) */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-xs shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center font-bold">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-base font-bold text-slate-900 tracking-tight">试剂报损管理</h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
              {hospitalUnit} · 试剂破损变质、质控失控与过期报废审批
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

        {/* 顶部右侧按钮群 (严格匹配截图 image_3fb5d66c.png) */}
        <div className="flex items-center gap-2">
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

      {/* 筛选过滤工具条 (严格匹配截图 image_3fb5d66c.png) */}
      <div className="bg-white border-b border-slate-200 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
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
              <option value="全部">全部库房</option>
            </select>
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
          <div className="flex items-center gap-2">
            <button
              onClick={() => showNotice('已根据所选库房与条件刷新报损记录')}
              className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition-colors cursor-pointer shadow-xs"
            >
              <Search className="w-3.5 h-3.5" />
              <span>查询</span>
            </button>
            <button
              onClick={() => {
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

        {/* 顶部右侧：已选报损单指示与打印审批表链接 (严格匹配截图 image_3fb5d66c.png) */}
        {selectedOrder && (
          <div className="flex items-center gap-3 text-slate-600 text-xs">
            <span>
              已选报损单：<strong className="text-slate-900 font-mono font-bold">{selectedOrder.orderNo}</strong>
            </span>
            <button
              onClick={() => {
                setActiveModalOrder(selectedOrder);
                setIsPrintModalOpen(true);
              }}
              className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium hover:underline cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>打印审批表</span>
            </button>
          </div>
        )}
      </div>

      {/* 左右分栏核心工作区 (核心需求：点击左侧表格的内容，右侧数据也跟着变化！) */}
      <div className="flex-1 flex min-h-0 bg-slate-100 p-3 gap-3 overflow-hidden">
        {/* 左侧主表格 (占 58% 宽，一页严格显示 10 条数据) */}
        <div className="w-[58%] bg-white border border-slate-200 rounded flex flex-col shadow-xs overflow-hidden">
          <div className="flex-1 overflow-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 select-none">
                  <th className="py-2.5 px-3">报损单号</th>
                  <th className="py-2.5 px-3">库房</th>
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
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      <FolderOpen className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                      暂无报损记录
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
                        {/* 报损单号 */}
                        <td className="py-2.5 px-3 font-semibold text-blue-600 hover:underline">
                          {order.orderNo}
                        </td>

                        {/* 库房 */}
                        <td className="py-2.5 px-3">{order.warehouse}</td>

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
                                    showNotice(`正在编辑报损单【${order.orderNo}】`);
                                  }}
                                  className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                                >
                                  编辑
                                </button>
                                <button
                                  onClick={() => {
                                    setOrders(prev => prev.filter(o => o.id !== order.id));
                                    showNotice(`草稿报损单【${order.orderNo}】已删除`);
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

          {/* 左侧表格底部分页与提示 (严格匹配截图 image_3fb5d66c.png) */}
          <div className="bg-slate-50 border-t border-slate-200 px-3 py-2 flex items-center justify-between text-[11px] text-slate-500 shrink-0">
            <div className="flex items-center gap-3">
              <span className="font-bold text-blue-700">合计：{filteredOrders.length} 条</span>
              <span>
                (第 {currentPage} / {totalPages} 页)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-400">点击单据切换右侧报损明细</span>
              <div className="flex items-center border border-slate-300 rounded overflow-hidden">
                <button
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className="px-2 py-0.5 bg-white hover:bg-slate-100 disabled:opacity-40 cursor-pointer border-r border-slate-200"
                >
                  上一页
                </button>
                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className="px-2 py-0.5 bg-white hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
                >
                  下一页
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 右侧明细面板 (占 42% 宽，严格匹配截图 image_3fb5d66c.png 右侧面板) */}
        <div className="flex-1 bg-white border border-slate-200 rounded flex flex-col shadow-xs overflow-hidden">
          {selectedOrder ? (
            <>
              {/* 右侧面板头部 (严格匹配截图右侧: 报损试剂明细清单 【N0000002 · 室内质控失控废弃与超温】 损耗总额: ¥2050.00) */}
              <div className="bg-slate-50 border-b border-slate-200 px-3 py-2.5 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-1.5 truncate">
                  <span className="font-bold text-slate-900 text-xs">
                    报损试剂明细清单
                  </span>
                  <span className="text-slate-500 text-[11px] truncate">
                    【{selectedOrder.orderNo} · {selectedOrder.summaryReason}】
                  </span>
                </div>
                <div className="shrink-0 text-xs">
                  损耗总额：
                  <strong className="text-rose-600 font-bold font-mono">
                    ¥{selectedOrder.totalAmount.toFixed(2)}
                  </strong>
                </div>
              </div>

              {/* 右侧明细表格 */}
              <div className="flex-1 overflow-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50/70 text-slate-600 font-medium border-b border-slate-200">
                      <th className="py-2 px-2.5">试剂编码</th>
                      <th className="py-2 px-2.5">试剂名称</th>
                      <th className="py-2 px-2.5">生产商</th>
                      <th className="py-2 px-2.5">供应商</th>
                      <th className="py-2 px-2.5">规格</th>
                      <th className="py-2 px-2 text-center">单位</th>
                      <th className="py-2 px-2 text-center">数量</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {selectedOrder.items.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/60">
                        {/* 试剂编码 */}
                        <td className="py-2.5 px-2.5 font-mono text-[11px] text-slate-500 align-top">
                          {item.code}
                        </td>

                        {/* 试剂名称 (下方红色标注具体报损原因，1:1 匹配截图效果) */}
                        <td className="py-2.5 px-2.5 align-top">
                          <div className="font-semibold text-slate-900">{item.name}</div>
                          <div className="text-rose-600 font-medium text-[10px] mt-0.5 leading-tight">
                            {item.reason}
                          </div>
                        </td>

                        {/* 生产商 */}
                        <td className="py-2.5 px-2.5 text-slate-600 text-[11px] align-top max-w-[120px] truncate" title={item.manufacturer}>
                          {item.manufacturer}
                        </td>

                        {/* 供应商 */}
                        <td className="py-2.5 px-2.5 text-slate-600 text-[11px] align-top max-w-[120px] truncate" title={item.supplier}>
                          {item.supplier}
                        </td>

                        {/* 规格 */}
                        <td className="py-2.5 px-2.5 text-slate-500 text-[11px] align-top whitespace-nowrap">
                          {item.spec}
                        </td>

                        {/* 单位 */}
                        <td className="py-2.5 px-2 text-center text-slate-600 align-top">
                          {item.unit}
                        </td>

                        {/* 数量 */}
                        <td className="py-2.5 px-2 text-center font-bold text-slate-900 align-top">
                          {item.qty}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 右侧面板底部汇总 (严格匹配截图: 包含品项: 2 项 | 报损总件数: 2) */}
              <div className="bg-slate-50 border-t border-slate-200 px-3 py-2 flex items-center justify-between text-[11px] text-slate-600 shrink-0">
                <div>
                  包含品项：<strong className="text-slate-900">{selectedOrder.items.length} 项</strong>
                </div>
                <div>
                  报损总件数：<strong className="text-slate-900">{selectedOrder.totalPieces}</strong>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
              <AlertTriangle className="w-8 h-8 mb-2 text-slate-300" />
              <span>请点击左侧单据查看详细报损品规与审批明细</span>
            </div>
          )}
        </div>
      </div>

      {/* ==================== 模态弹窗 1：新增试剂报损申请单 ==================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
            {/* 弹窗头部 */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">新增试剂耗材报损审批申请单</h2>
                  <p className="text-[11px] text-slate-500">
                    临床检验科室试剂质控失控、变质、物理破损或逾期报废登记审批
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-slate-200/60 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 弹窗表单内容 */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">报损单号 (自动生成)</label>
                  <input
                    type="text"
                    value={addForm.orderNo}
                    disabled
                    className="w-full bg-slate-100 border border-slate-300 rounded px-3 py-1.5 text-blue-600 font-mono font-bold focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">
                    报损申请库房 <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={addForm.warehouse}
                    onChange={e => setAddForm({ ...addForm, warehouse: e.target.value })}
                    className="w-full border border-slate-300 rounded px-3 py-1.5 bg-white text-slate-800 focus:outline-hidden focus:border-blue-500 cursor-pointer"
                  >
                    <option value="生化组库房">生化组库房</option>
                    <option value="临检组库房">临检组库房</option>
                    <option value="免疫组库房">免疫组库房</option>
                    <option value="检验科总库">检验科总库</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">
                    经办填报人 <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={addForm.operator}
                    onChange={e => setAddForm({ ...addForm, operator: e.target.value })}
                    className="w-full border border-slate-300 rounded px-3 py-1.5 bg-white text-slate-800 focus:outline-hidden focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  综合报损事由简述 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={addForm.summaryReason}
                  onChange={e => setAddForm({ ...addForm, summaryReason: e.target.value })}
                  placeholder="如：室内质控失控废弃与超温变质"
                  className="w-full border border-slate-300 rounded px-3 py-1.5 bg-white text-slate-800 focus:outline-hidden focus:border-blue-500"
                />
              </div>

              {/* 挑选报损试剂区域 */}
              <div className="bg-slate-50 border border-slate-200 rounded p-4 space-y-3">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  <span>添加报损试剂品规</span>
                </div>

                <div className="grid grid-cols-12 gap-3 items-end">
                  <div className="col-span-5">
                    <label className="block text-slate-600 text-[11px] mb-1">选择在库试剂</label>
                    <select
                      value={addForm.selectedCandidateCode}
                      onChange={e => {
                        const code = e.target.value;
                        const c = SCRAP_CANDIDATES.find(x => x.code === code);
                        setAddForm({
                          ...addForm,
                          selectedCandidateCode: code,
                          customReason: c ? c.defaultReason : '',
                        });
                      }}
                      className="w-full border border-slate-300 rounded px-2.5 py-1.5 bg-white text-slate-800 focus:outline-hidden focus:border-blue-500 cursor-pointer"
                    >
                      {SCRAP_CANDIDATES.map(c => (
                        <option key={c.code} value={c.code}>
                          [{c.code}] {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-4">
                    <label className="block text-slate-600 text-[11px] mb-1">报损原因明细</label>
                    <input
                      type="text"
                      value={addForm.customReason}
                      onChange={e => setAddForm({ ...addForm, customReason: e.target.value })}
                      placeholder="原因，如：西格玛严重偏离"
                      className="w-full border border-slate-300 rounded px-2.5 py-1.5 bg-white text-slate-800 focus:outline-hidden focus:border-blue-500"
                    />
                  </div>

                  <div className="col-span-1">
                    <label className="block text-slate-600 text-[11px] mb-1">数量</label>
                    <input
                      type="number"
                      min={1}
                      value={addForm.inputQty}
                      onChange={e => setAddForm({ ...addForm, inputQty: Math.max(1, parseInt(e.target.value, 10) || 1) })}
                      className="w-full border border-slate-300 rounded px-2 py-1.5 text-center font-bold text-rose-600 focus:outline-hidden focus:border-blue-500"
                    />
                  </div>

                  <div className="col-span-2">
                    <button
                      type="button"
                      onClick={handleAddItemToForm}
                      className="w-full py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded font-medium transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>追加试剂</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 报损清单 */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-slate-800">
                    拟报损试剂清单 ({addForm.items.length} 项)
                  </h3>
                  <div className="text-rose-600 font-bold font-mono text-sm">
                    拟报损总额：¥{addFormTotalAmount.toFixed(2)}
                  </div>
                </div>

                <div className="border border-slate-200 rounded overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                        <th className="py-2 px-3">试剂编码</th>
                        <th className="py-2 px-3">试剂名称</th>
                        <th className="py-2 px-3">报损具体原因</th>
                        <th className="py-2 px-3">规格</th>
                        <th className="py-2 px-3 text-center">数量</th>
                        <th className="py-2 px-3 text-right">单价</th>
                        <th className="py-2 px-3 text-right">小计</th>
                        <th className="py-2 px-3 text-center">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {addForm.items.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/60">
                          <td className="py-2 px-3 font-mono text-slate-500">{item.code}</td>
                          <td className="py-2 px-3 font-medium text-slate-900">{item.name}</td>
                          <td className="py-2 px-3 text-rose-600 text-[11px] font-medium">{item.reason}</td>
                          <td className="py-2 px-3 text-slate-500 text-[11px]">{item.spec}</td>
                          <td className="py-2 px-3 text-center font-bold text-slate-900">
                            {item.qty} {item.unit}
                          </td>
                          <td className="py-2 px-3 text-right text-slate-600">¥{item.price.toFixed(2)}</td>
                          <td className="py-2 px-3 text-right font-bold text-rose-600">¥{item.amount.toFixed(2)}</td>
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
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* 弹窗底部操作 */}
            <div className="px-6 py-3 border-t border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
              <span className="text-slate-500 text-[11px]">
                提交后需经科室质控主管及医学检验科主任双人审批后方可执行平账
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
                  onClick={() => handleSaveLossOrder(false)}
                  className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded font-medium shadow-xs transition-colors cursor-pointer"
                >
                  暂存为草稿 (登记)
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveLossOrder(true)}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium shadow-xs transition-colors cursor-pointer"
                >
                  提交审核审批
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== 模态弹窗 2：查看试剂报损审批档案 ==================== */}
      {isViewModalOpen && activeModalOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-blue-600" />
                <h2 className="text-sm font-bold text-slate-900">
                  试剂耗材报损审批档案 - {activeModalOrder.orderNo}
                </h2>
              </div>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-slate-200/60 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              {/* 4 步审批流转状态指示器 */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5">
                <div className="text-[11px] font-semibold text-slate-600 mb-2.5">
                  试剂耗材报废流转核销审批进度
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">✓</span>
                    <span className="font-semibold text-emerald-800">1.科室提报</span>
                  </div>
                  <div className="flex-1 h-0.5 bg-emerald-400 mx-2" />
                  <div className="flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">✓</span>
                    <span className="font-semibold text-emerald-800">2.质控主管复核</span>
                  </div>
                  <div className="flex-1 h-0.5 bg-blue-400 mx-2" />
                  <div className="flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">3</span>
                    <span className="font-semibold text-blue-700">3.科主任核准</span>
                  </div>
                  <div className="flex-1 h-0.5 bg-slate-200 mx-2" />
                  <div className="flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-400 flex items-center justify-center text-[10px]">4</span>
                    <span className="text-slate-400">4.总库平账核销</span>
                  </div>
                </div>
              </div>

              {/* 单据概要 */}
              <div className="grid grid-cols-2 gap-y-2 gap-x-4 bg-slate-50/60 p-4 rounded border border-slate-200">
                <div>报损单号：<strong className="text-blue-600 font-mono">{activeModalOrder.orderNo}</strong></div>
                <div>单据状态：<strong className="text-blue-700">{activeModalOrder.status}</strong></div>
                <div>提报库房：<strong className="text-slate-800">{activeModalOrder.warehouse}</strong></div>
                <div>经办操作人：<strong className="text-slate-800">{activeModalOrder.operator}</strong></div>
                <div>操作时间：<span className="font-mono text-slate-600">{activeModalOrder.operateTime}</span></div>
                <div>审核核准人：<strong className="text-slate-800">{activeModalOrder.submitter || '-'}</strong></div>
                <div className="col-span-2">报损综合事由：<span className="text-slate-800">{activeModalOrder.summaryReason}</span></div>
              </div>

              {/* 明细清单 */}
              <div>
                <h3 className="font-bold text-slate-800 mb-2">报损试剂品规清单</h3>
                <div className="border border-slate-200 rounded overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                        <th className="py-2 px-3">编码</th>
                        <th className="py-2 px-3">品名规格</th>
                        <th className="py-2 px-3">报损具体原因</th>
                        <th className="py-2 px-3 text-center">报损数量</th>
                        <th className="py-2 px-3 text-right">单价</th>
                        <th className="py-2 px-3 text-right">金额</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {activeModalOrder.items.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="py-2 px-3 font-mono text-slate-500">{item.code}</td>
                          <td className="py-2 px-3 font-medium text-slate-900">{item.name} ({item.spec})</td>
                          <td className="py-2 px-3 text-rose-600 font-medium text-[11px]">{item.reason}</td>
                          <td className="py-2 px-3 text-center font-bold text-slate-900">{item.qty} {item.unit}</td>
                          <td className="py-2 px-3 text-right text-slate-600">¥{item.price.toFixed(2)}</td>
                          <td className="py-2 px-3 text-right font-bold text-rose-600">¥{item.amount.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="px-6 py-3 border-t border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
              <span className="text-slate-500 text-[11px]">中心医院临床检验中心医学实验室质控委员会</span>
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
                  <span>打印报损审批表</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== 模态弹窗 3：撤销确认弹窗 ==================== */}
      {isRevokeModalOpen && activeModalOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl border border-slate-200 w-full max-w-md p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  确认撤销报损审批单【{activeModalOrder.orderNo}】？
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  撤销后该单据将从【发送/待审核】状态回退为【草稿登记】状态，报损试剂将解除出库锁扣并允许重新修改品规或报损数量。
                </p>
                <div className="mt-3 bg-slate-50 p-2.5 rounded border border-slate-200 text-[11px] text-slate-600 space-y-1">
                  <div>提报库房：<strong>{activeModalOrder.warehouse}</strong></div>
                  <div>损耗总额：<strong>¥{activeModalOrder.totalAmount.toFixed(2)}</strong></div>
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

      {/* ==================== 模态弹窗 4：审核弹窗 ==================== */}
      {isAuditModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-200 w-full max-w-xl p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-amber-600" />
                <h3 className="text-sm font-bold text-slate-900">试剂报损审批工作台</h3>
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
                当前有 <strong className="text-amber-600">{pendingAuditCount} 笔</strong> 已提交的试剂报损审批单等待医学检验科主任及质控委员会核准平账：
              </p>

              <div className="border border-slate-200 rounded divide-y divide-slate-100 max-h-60 overflow-y-auto">
                {orders
                  .filter(o => o.status === '发送')
                  .map(o => (
                    <div key={o.id} className="p-3 flex items-center justify-between hover:bg-slate-50">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-blue-600 font-mono">{o.orderNo}</span>
                          <span className="text-slate-900 font-medium">{o.operator}</span>
                          <span className="text-slate-400 text-[11px]">{o.warehouse}</span>
                        </div>
                        <div className="text-rose-600 text-[11px] mt-0.5 truncate max-w-sm font-medium">
                          {o.summaryReason}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-rose-600 font-mono">¥{o.totalAmount.toFixed(2)}</div>
                        <div className="text-slate-400 text-[10px]">{o.items.length}项品规</div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between pt-3 border-t border-slate-200">
              <span className="text-[11px] text-slate-500">审批人：郭彩霞主任医师 / 李晓红副主任技师</span>
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
                  核准通过并执行平账
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== 模态弹窗 5：打印报损审批表 ==================== */}
      {isPrintModalOpen && (activeModalOrder || selectedOrder) && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
              <div className="flex items-center gap-2">
                <Printer className="w-4 h-4 text-blue-600" />
                <h2 className="text-sm font-bold text-slate-900">打印试剂报损报废审批单</h2>
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
                  <div className="text-center border-b-2 border-slate-900 pb-4">
                    <h1 className="text-lg font-bold tracking-wider">{hospitalUnit} 临床检验中心</h1>
                    <h2 className="text-base font-bold tracking-widest mt-1 text-slate-800">
                      试剂耗材报损、变质及过期报废审批凭单
                    </h2>
                    <div className="flex justify-between items-center mt-3 text-xs text-slate-600">
                      <div>报损单号：<span className="font-mono font-bold text-slate-900">{target.orderNo}</span></div>
                      <div>提报库房：<span className="font-medium text-slate-900">{target.warehouse}</span></div>
                      <div>制单日期：<span className="font-mono">2026-11-02 11:45:00</span></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs py-2 border-b border-slate-300">
                    <div>经办操作人：<strong>{target.operator}</strong></div>
                    <div>审核核准人：<strong>{target.submitter || '郭彩霞主任医师'}</strong></div>
                    <div className="col-span-2">报损综合事由：{target.summaryReason}</div>
                  </div>

                  <table className="w-full text-left text-xs border border-slate-400 border-collapse mt-2">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-400 font-semibold">
                        <th className="py-2 px-2 border-r border-slate-400">试剂编码</th>
                        <th className="py-2 px-2 border-r border-slate-400">品名规格</th>
                        <th className="py-2 px-2 border-r border-slate-400">报损具体原因</th>
                        <th className="py-2 px-2 border-r border-slate-400">生产厂家与批号</th>
                        <th className="py-2 px-2 text-center border-r border-slate-400">数量</th>
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
                          <td className="py-2 px-2 border-r border-slate-300 text-rose-600 font-medium">
                            {item.reason}
                          </td>
                          <td className="py-2 px-2 border-r border-slate-300 text-[11px] text-slate-600">
                            {item.manufacturer} / {item.lotNo}
                          </td>
                          <td className="py-2 px-2 text-center border-r border-slate-300 font-bold">
                            {item.qty} {item.unit}
                          </td>
                          <td className="py-2 px-2 text-right border-r border-slate-300">
                            ¥{item.price.toFixed(2)}
                          </td>
                          <td className="py-2 px-2 text-right font-bold text-rose-600">
                            ¥{item.amount.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-slate-50 font-bold border-t border-slate-400">
                        <td colSpan={4} className="py-2 px-2 text-right border-r border-slate-400">
                          报损总件数：{target.totalPieces} 件 / 损耗金额总计：
                        </td>
                        <td colSpan={3} className="py-2 px-2 text-right text-sm text-rose-600">
                          ¥ {target.totalAmount.toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <div className="grid grid-cols-3 gap-6 pt-6 text-xs text-slate-800">
                    <div>提报经办人 (签字)：_________________</div>
                    <div>质控主管技师 (签字)：_________________</div>
                    <div>检验科主任 (核准签字)：_________________</div>
                  </div>
                </div>
              );
            })()}

            <div className="px-6 py-3 border-t border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
              <span className="text-slate-500 text-[11px]">本凭证用于财务科耗材核销冲账与医疗废物监督台账</span>
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
                    showNotice('报损审批凭证已发送至化验室激光打印机');
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
