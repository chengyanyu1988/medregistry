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
  Barcode,
  QrCode,
  ShieldCheck,
  Thermometer,
  Layers,
  Archive,
  DollarSign,
  Building2,
  CalendarCheck,
} from './MenuIcon';

export interface InboundItem {
  code: string;
  name: string;
  batchNo: string;
  expiryDate: string;
  spec: string;
  unit: string;
  qty: number;
  price: number;
  subtotal: number;
  tempStorage: string;
  coaReg: string;
}

export interface InboundOrder {
  id: string;
  orderNo: string;
  warehouse: string;
  warehouseKey: string;
  inType: string;
  supplier: string;
  invoiceNo: string;
  tempRange: string;
  amount: number;
  desc: string;
  operator: string;
  operateTime: string;
  reviewer: string;
  reviewTime: string;
  status: '登记' | '审核' | '已退货';
  items: InboundItem[];
  returnInfo?: {
    returnReason: string;
    returnScope: string;
    returnDesc: string;
    returnTime: string;
    returnOperator: string;
  };
}

// 初始模拟数据：覆盖中心医院各主要检验专业组，采用近期真实日期与医技职称姓名
const INITIAL_INBOUND_ORDERS: InboundOrder[] = [
  {
    id: 'INB-001',
    orderNo: 'N0000004',
    warehouse: '生化组',
    warehouseKey: 'biochem',
    inType: '外购入库',
    supplier: '国药控股分销时代有限公司',
    invoiceNo: 'FP-202610-8831',
    tempRange: '3.8℃ ~ 4.6℃ (合规)',
    amount: 48600.0,
    desc: '2026年10月下旬重点生化常规试剂定标品冷链随货到付入库',
    operator: '魏明主管检验师',
    operateTime: '2026-10-30 10:10:10',
    reviewer: '',
    reviewTime: '',
    status: '登记',
    items: [
      {
        code: '010015',
        name: '丙氨酸氨基转移酶(ALT)测定试剂盒(IFCC法)',
        batchNo: '20261015A',
        expiryDate: '2027-10-14',
        spec: 'R1: 80mL×4, R2: 20mL×4',
        unit: '盒',
        qty: 45,
        price: 520.0,
        subtotal: 23400.0,
        tempStorage: '4.2℃ (合格) 2~8℃ 避光冷藏',
        coaReg: '已附原厂COA 国械注准20223400518',
      },
      {
        code: '010018',
        name: '天门冬氨酸氨基转移酶(AST)测定试剂盒',
        batchNo: '20261018B',
        expiryDate: '2027-10-17',
        spec: 'R1: 80mL×4, R2: 20mL×4',
        unit: '盒',
        qty: 40,
        price: 540.0,
        subtotal: 21600.0,
        tempStorage: '4.1℃ (合格) 2~8℃ 避光冷藏',
        coaReg: '已附原厂COA 国械注准20223400519',
      },
      {
        code: '010034',
        name: '生化多参数质控血清(水平1/2)',
        batchNo: 'QC2026102',
        expiryDate: '2027-04-20',
        spec: '5ml×6支/盒',
        unit: '盒',
        qty: 11,
        price: 327.27,
        subtotal: 3600.0,
        tempStorage: '3.9℃ (合格) 2~8℃ 避光冷藏',
        coaReg: '已附原厂COA 国械注进20213401124',
      },
    ],
  },
  {
    id: 'INB-002',
    orderNo: 'N0000003',
    warehouse: '生化组',
    warehouseKey: 'biochem',
    inType: '外购入库',
    supplier: '罗氏诊断产品(上海)有限公司',
    invoiceNo: 'FP-202610-8790',
    tempRange: '4.0℃ ~ 4.8℃ (合规)',
    amount: 31000.0,
    desc: '急诊生化流水线常规酶学配套清洗耗材到货，附COA质检报告合格',
    operator: '刘浩然技师',
    operateTime: '2026-10-29 15:20:30',
    reviewer: '',
    reviewTime: '',
    status: '登记',
    items: [
      {
        code: '010022',
        name: '碱性磷酸酶(ALP)测定试剂盒(AMP缓冲液法)',
        batchNo: '20261011C',
        expiryDate: '2027-10-10',
        spec: 'Cobas专用盒 250测试/盒',
        unit: '盒',
        qty: 30,
        price: 680.0,
        subtotal: 20400.0,
        tempStorage: '4.3℃ (合格) 2~8℃ 避光冷藏',
        coaReg: '已附原厂COA 国械注进20202400321',
      },
      {
        code: '010045',
        name: '全自动生化分析仪酸性清洗液(Cell Wash)',
        batchNo: 'CW20260905',
        expiryDate: '2028-09-04',
        spec: '2000ml/瓶',
        unit: '瓶',
        qty: 20,
        price: 530.0,
        subtotal: 10600.0,
        tempStorage: '常温储存 15~25℃',
        coaReg: '已附批次报告 国械注进20191400215',
      },
    ],
  },
  {
    id: 'INB-003',
    orderNo: 'N0000002',
    warehouse: '生化组',
    warehouseKey: 'biochem',
    inType: '外购入库',
    supplier: '深圳迈瑞生物医疗电子股份有限公司',
    invoiceNo: 'FP-202610-8650',
    tempRange: '3.6℃ ~ 4.2℃ (合规)',
    amount: 18500.0,
    desc: '心肌酶谱与肝酶代谢常规通道检测盒批号统一验证入库',
    operator: '陈康主管检验师',
    operateTime: '2026-10-28 09:45:00',
    reviewer: '李晓红副主任技师',
    reviewTime: '2026-10-28 14:15:20',
    status: '审核',
    items: [
      {
        code: '010029',
        name: '肌酸激酶同工酶(CK-MB)测定试剂盒(免疫抑制法)',
        batchNo: '20261009M',
        expiryDate: '2027-10-08',
        spec: 'R1: 60mL×4, R2: 15mL×4',
        unit: '盒',
        qty: 25,
        price: 480.0,
        subtotal: 12000.0,
        tempStorage: '3.8℃ (合格) 2~8℃ 避光冷藏',
        coaReg: '已附原厂COA 国械注准20223400812',
      },
      {
        code: '010031',
        name: '乳酸脱氢酶(LDH)测定试剂盒(DGKC法)',
        batchNo: '20261008L',
        expiryDate: '2027-10-07',
        spec: 'R1: 80mL×4, R2: 20mL×4',
        unit: '盒',
        qty: 13,
        price: 500.0,
        subtotal: 6500.0,
        tempStorage: '3.9℃ (合格) 2~8℃ 避光冷藏',
        coaReg: '已附原厂COA 国械注准20223400815',
      },
    ],
  },
  {
    id: 'INB-004',
    orderNo: 'N0000001',
    warehouse: '生化组',
    warehouseKey: 'biochem',
    inType: '外购入库',
    supplier: '贝克曼库尔特商贸(中国)有限公司',
    invoiceNo: 'FP-202610-8501',
    tempRange: '-18.5℃ (冷冻温控合规)',
    amount: 62400.0,
    desc: '全院生化多参数复合定标液与特种蛋白分析仪校准耗材例行验收入库',
    operator: '魏明主管检验师',
    operateTime: '2026-10-27 14:10:00',
    reviewer: '郭彩霞主任医师',
    reviewTime: '2026-10-27 16:30:10',
    status: '审核',
    items: [
      {
        code: '010036',
        name: '生化多参数复合定标液',
        batchNo: 'CAL2026101',
        expiryDate: '2027-08-15',
        spec: '5ml×10支/盒',
        unit: '套',
        qty: 40,
        price: 880.0,
        subtotal: 35200.0,
        tempStorage: '-18.5℃ (合格) -20℃ 冷冻避光',
        coaReg: '已附原厂COA 国械注进20213400921',
      },
      {
        code: '010038',
        name: '免疫球蛋白五项质控清',
        batchNo: 'IG2026098',
        expiryDate: '2027-09-30',
        spec: '3ml×6支/盒',
        unit: '盒',
        qty: 34,
        price: 800.0,
        subtotal: 27200.0,
        tempStorage: '3.7℃ (合格) 2~8℃ 避光冷藏',
        coaReg: '已附原厂COA 国械注进20213400922',
      },
    ],
  },
  {
    id: 'INB-005',
    orderNo: 'N0000005',
    warehouse: '临检组',
    warehouseKey: 'clin',
    inType: '外购入库',
    supplier: '希森美康医用电子(上海)有限公司',
    invoiceNo: 'FP-202610-8910',
    tempRange: '18.2℃ ~ 22.0℃ (合规)',
    amount: 27800.0,
    desc: '血细胞分析流水线五分类溶血剂与稀释液大包装例行到货验收入库',
    operator: '钱宇恒技师',
    operateTime: '2026-10-26 11:20:00',
    reviewer: '李晓红副主任技师',
    reviewTime: '2026-10-26 14:00:00',
    status: '审核',
    items: [
      {
        code: '010051',
        name: '全自动血细胞分析用溶血剂(Lysercell WNR)',
        batchNo: 'LC20261002',
        expiryDate: '2028-04-01',
        spec: '5L/桶',
        unit: '桶',
        qty: 20,
        price: 890.0,
        subtotal: 17800.0,
        tempStorage: '常温储存 15~25℃',
        coaReg: '已附原厂COA 国械注进20182401021',
      },
      {
        code: '010052',
        name: '血细胞分析仪专用稀释液(Cellpack DCL)',
        batchNo: 'CP20261005',
        expiryDate: '2028-04-05',
        spec: '20L/箱',
        unit: '箱',
        qty: 25,
        price: 400.0,
        subtotal: 10000.0,
        tempStorage: '常温储存 15~25℃',
        coaReg: '已附原厂COA 国械注进20182401022',
      },
    ],
  },
  {
    id: 'INB-006',
    orderNo: 'N0000006',
    warehouse: '免疫组',
    warehouseKey: 'imm',
    inType: '外购入库',
    supplier: '雅培贸易(上海)有限公司',
    invoiceNo: 'FP-202610-8955',
    tempRange: '3.5℃ ~ 4.2℃ (合规)',
    amount: 54200.0,
    desc: '化学发光高敏肌钙蛋白I与心衰标志物BNT随货冷链验收',
    operator: '黄淑珍工程师',
    operateTime: '2026-10-25 09:15:00',
    reviewer: '郭彩霞主任医师',
    reviewTime: '2026-10-25 10:45:00',
    status: '审核',
    items: [
      {
        code: '010062',
        name: '高敏肌钙蛋白I(hs-cTnI)检测试剂盒(化学发光微粒子法)',
        batchNo: 'TN20261001',
        expiryDate: '2027-08-20',
        spec: '100测试/盒',
        unit: '盒',
        qty: 30,
        price: 1120.0,
        subtotal: 33600.0,
        tempStorage: '3.6℃ (合格) 2~8℃ 避光冷藏',
        coaReg: '已附原厂COA 国械注进20203401520',
      },
      {
        code: '010064',
        name: 'B型钠尿肽前体(NT-proBNP)检测试剂盒',
        batchNo: 'BN20261003',
        expiryDate: '2027-08-25',
        spec: '100测试/盒',
        unit: '盒',
        qty: 20,
        price: 1030.0,
        subtotal: 20600.0,
        tempStorage: '3.8℃ (合格) 2~8℃ 避光冷藏',
        coaReg: '已附原厂COA 国械注进20203401525',
      },
    ],
  },
  {
    id: 'INB-007',
    orderNo: 'N0000007',
    warehouse: '微生物组',
    warehouseKey: 'micro',
    inType: '外购入库',
    supplier: '生物梅里埃(中国)有限公司',
    invoiceNo: 'FP-202610-9012',
    tempRange: '4.5℃ ~ 6.0℃ (合规)',
    amount: 32500.0,
    desc: '全自动微生物质谱鉴定基质液与药敏复合卡批次验收',
    operator: '孙伟工程师',
    operateTime: '2026-10-24 14:30:00',
    reviewer: '',
    reviewTime: '',
    status: '登记',
    items: [
      {
        code: '010071',
        name: 'VITEK 2 革兰阴性菌鉴定卡(GN卡)',
        batchNo: 'GN20260930',
        expiryDate: '2027-09-29',
        spec: '20卡/盒',
        unit: '盒',
        qty: 25,
        price: 820.0,
        subtotal: 20500.0,
        tempStorage: '4.8℃ (合格) 2~8℃ 避光冷藏',
        coaReg: '已附原厂COA 国械注进20193400512',
      },
      {
        code: '010073',
        name: '血培养瓶(需氧与厌氧双联瓶套装)',
        batchNo: 'BC20261001',
        expiryDate: '2027-10-01',
        spec: '50瓶/箱',
        unit: '箱',
        qty: 10,
        price: 1200.0,
        subtotal: 12000.0,
        tempStorage: '常温储存 15~25℃',
        coaReg: '已附原厂COA 国械注进20193400518',
      },
    ],
  },
  {
    id: 'INB-008',
    orderNo: 'N0000008',
    warehouse: '输血科',
    warehouseKey: 'blood',
    inType: '外购入库',
    supplier: '长春博德生物技术有限责任公司',
    invoiceNo: 'FP-202610-9118',
    tempRange: '3.2℃ ~ 4.5℃ (合规)',
    amount: 19800.0,
    desc: 'ABO及Rh血型微柱凝胶定型反定卡与凝聚胺试剂例行入库',
    operator: '郑美玲技师',
    operateTime: '2026-10-23 10:00:00',
    reviewer: '李晓红副主任技师',
    reviewTime: '2026-10-23 11:30:00',
    status: '审核',
    items: [
      {
        code: '010081',
        name: 'ABO/RhD血型抗原微柱凝胶检测卡',
        batchNo: 'BG20261002',
        expiryDate: '2027-07-01',
        spec: '24人份/盒',
        unit: '盒',
        qty: 40,
        price: 360.0,
        subtotal: 14400.0,
        tempStorage: '3.6℃ (合格) 2~8℃ 避光冷藏',
        coaReg: '已附原厂COA 国械注准20213400118',
      },
      {
        code: '010084',
        name: '低离子凝聚胺介质溶液组',
        batchNo: 'LG20260918',
        expiryDate: '2027-09-17',
        spec: '10ml×3瓶/套',
        unit: '套',
        qty: 30,
        price: 180.0,
        subtotal: 5400.0,
        tempStorage: '4.0℃ (合格) 2~8℃ 避光冷藏',
        coaReg: '已附原厂COA 国械注准20213400122',
      },
    ],
  },
  {
    id: 'INB-009',
    orderNo: 'N0000009',
    warehouse: '生化组',
    warehouseKey: 'biochem',
    inType: '调拨入库',
    supplier: '重庆医科大学附属第一医院(医联体总院)',
    invoiceNo: 'DB-202610-0012',
    tempRange: '4.0℃ ~ 4.5℃ (合规)',
    amount: 9600.0,
    desc: '医联体区域调拨应急补给总胆汁酸与同型半胱氨酸检测试剂',
    operator: '魏明主管检验师',
    operateTime: '2026-10-22 16:40:00',
    reviewer: '郭彩霞主任医师',
    reviewTime: '2026-10-22 17:15:00',
    status: '审核',
    items: [
      {
        code: '010026',
        name: '总胆汁酸(TBA)测定试剂盒(循环酶速率法)',
        batchNo: '20260920T',
        expiryDate: '2027-09-19',
        spec: 'R1: 40ml×2, R2: 10ml×2',
        unit: '盒',
        qty: 15,
        price: 640.0,
        subtotal: 9600.0,
        tempStorage: '4.1℃ (合格) 2~8℃ 避光冷藏',
        coaReg: '已附调拨同品质检证明',
      },
    ],
  },
  {
    id: 'INB-010',
    orderNo: 'N0000010',
    warehouse: '生化组',
    warehouseKey: 'biochem',
    inType: '外购入库',
    supplier: '国药控股分销时代有限公司',
    invoiceNo: 'FP-202610-8201',
    tempRange: '8.9℃ (超温超限报警)',
    amount: 14200.0,
    desc: '冷链运输箱到达科室时开箱测温异常(实测8.9℃)，依规发起全单拒收退货申请',
    operator: '魏明主管检验师',
    operateTime: '2026-10-21 09:20:00',
    reviewer: '郭彩霞主任医师',
    reviewTime: '2026-10-21 10:05:00',
    status: '已退货',
    items: [
      {
        code: '010019',
        name: '谷氨酰基转移酶(GGT)测定试剂盒(Szasz法)',
        batchNo: '20261001G',
        expiryDate: '2027-10-01',
        spec: 'R1: 80mL×4, R2: 20mL×4',
        unit: '盒',
        qty: 20,
        price: 430.0,
        subtotal: 8600.0,
        tempStorage: '8.9℃ (异常报警) 规定2~8℃',
        coaReg: '原厂COA但运输超温失效',
      },
      {
        code: '010020',
        name: '总蛋白(TP)测定试剂盒(双缩脲法)',
        batchNo: '20261002T',
        expiryDate: '2027-10-02',
        spec: 'R1: 100mL×4',
        unit: '盒',
        qty: 20,
        price: 280.0,
        subtotal: 5600.0,
        tempStorage: '8.9℃ (异常报警) 规定2~8℃',
        coaReg: '原厂COA但运输超温失效',
      },
    ],
    returnInfo: {
      returnReason: '随货冷链温度异常超温预警(高于8℃)',
      returnScope: '整单全部拒收退货 (全单核销)',
      returnDesc: '冷链运输箱到达科室时开箱测温为8.9℃超出2~8℃安全阈值，冷链记录仪显示连续超温超过4小时，依规发起全单退货核销。',
      returnTime: '2026-10-21 10:10:00',
      returnOperator: '魏明主管检验师',
    },
  },
  {
    id: 'INB-011',
    orderNo: 'N0000011',
    warehouse: '临检组',
    warehouseKey: 'clin',
    inType: '外购入库',
    supplier: '美康生物科技股份有限公司',
    invoiceNo: 'FP-202610-7988',
    tempRange: '4.2℃ (合格)',
    amount: 15300.0,
    desc: '尿沉渣分析质控液与鞘液成套耗材到货入库',
    operator: '钱宇恒技师',
    operateTime: '2026-10-20 14:15:00',
    reviewer: '李晓红副主任技师',
    reviewTime: '2026-10-20 15:30:00',
    status: '审核',
    items: [
      {
        code: '010055',
        name: '尿沉渣分析仪质控红蓝荧光颗粒',
        batchNo: 'QC20261010',
        expiryDate: '2027-04-10',
        spec: '10ml×4支/套',
        unit: '套',
        qty: 15,
        price: 580.0,
        subtotal: 8700.0,
        tempStorage: '4.2℃ (合格) 2~8℃ 避光冷藏',
        coaReg: '已附原厂COA 国械注准20202400901',
      },
      {
        code: '010056',
        name: '尿液有形成分分析用鞘流液',
        batchNo: 'SH20260920',
        expiryDate: '2028-09-19',
        spec: '10L/桶',
        unit: '桶',
        qty: 20,
        price: 330.0,
        subtotal: 6600.0,
        tempStorage: '常温储存 15~25℃',
        coaReg: '已附批次报告 国械注准20202400902',
      },
    ],
  },
  {
    id: 'INB-012',
    orderNo: 'N0000012',
    warehouse: '免疫组',
    warehouseKey: 'imm',
    inType: '厂商赠送',
    supplier: '罗氏诊断产品(上海)有限公司',
    invoiceNo: 'ZS-202610-0015',
    tempRange: '3.9℃ (合格)',
    amount: 0.0,
    desc: '罗氏电化学发光新项目(白介素-6)临床科研评估免费赠送配套试剂',
    operator: '黄淑珍工程师',
    operateTime: '2026-10-19 11:00:00',
    reviewer: '郭彩霞主任医师',
    reviewTime: '2026-10-19 11:45:00',
    status: '审核',
    items: [
      {
        code: '010068',
        name: '白介素-6(IL-6)检测试剂盒(电化学发光法)',
        batchNo: 'IL20260901',
        expiryDate: '2027-06-30',
        spec: '100测试/盒',
        unit: '盒',
        qty: 5,
        price: 0.0,
        subtotal: 0.0,
        tempStorage: '3.9℃ (合格) 2~8℃ 避光冷藏',
        coaReg: '赠品科研附COA与出厂检验证书',
      },
    ],
  },
];

export const ReagentInboundManagementView: React.FC<{
  hospitalUnit: string;
  showNotice: (m: string) => void;
}> = ({ hospitalUnit, showNotice }) => {
  // 1. 数据源
  const [orders, setOrders] = useState<InboundOrder[]>(INITIAL_INBOUND_ORDERS);

  // 2. 筛选条件 (严格对应图片 image_9ab8443e.png: 当前库房、入库类型、入库单号、编制日期、状态)
  const [filterWarehouse, setFilterWarehouse] = useState<string>('生化库');
  const [filterInType, setFilterInType] = useState<string>('全部类型');
  const [filterOrderNo, setFilterOrderNo] = useState<string>('');
  const [filterDateRange, setFilterDateRange] = useState<string>('2026-10-01 ~ 2026-10-31');
  const [filterStatus, setFilterStatus] = useState<string>('全部');

  // 3. 展开折叠行状态（默认展开第一行 N0000004）
  const [expandedOrderIds, setExpandedOrderIds] = useState<string[]>(['INB-001']);
  // 选中的激活单据号
  const [selectedOrderNo, setSelectedOrderNo] = useState<string>('N0000004');

  // 4. 分页状态 (用户核心需求：一页帮我显示10条数据)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  // 5. 模态弹窗状态
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState<boolean>(false);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState<boolean>(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);
  const [isBarcodeModalOpen, setIsBarcodeModalOpen] = useState<boolean>(false);

  // 当前操作选中的单据对象
  const [activeModalOrder, setActiveModalOrder] = useState<InboundOrder | null>(null);

  // 6. 新建入库表单状态 (对应 image_044300da.png)
  const [addForm, setAddForm] = useState<{
    warehouse: string;
    inType: string;
    operator: string;
    supplier: string;
    invoiceNo: string;
    tempRecord: string;
    desc: string;
    items: Array<{
      code: string;
      name: string;
      batchNo: string;
      expiryDate: string;
      spec: string;
      unit: string;
      qty: number;
      price: number;
      subtotal: number;
      tempStorage: string;
      coaReg: string;
    }>;
  }>({
    warehouse: '生化组',
    inType: '外购入库',
    operator: '魏明主管检验师',
    supplier: '国药控股分销时代有限公司',
    invoiceNo: 'FP-202610-9922',
    tempRecord: '4.0℃ (冷链记录仪合格)',
    desc: '2026年10月下旬检验常规生化耗材带量集采随货验收',
    items: [
      {
        code: '010065',
        name: '总胆固醇测定试剂盒(COD-PAP法)',
        batchNo: '20261028CH',
        expiryDate: '2027-10-27',
        spec: 'R1: 80mL×4, R2: 20mL×4',
        unit: '盒',
        qty: 30,
        price: 195.0,
        subtotal: 5850.0,
        tempStorage: '4.0℃ (合格) 2~8℃ 避光冷藏',
        coaReg: '已附原厂COA 国械注准20223400520',
      },
      {
        code: '010068',
        name: '甘油三酯测定试剂盒(GPO-PAP法)',
        batchNo: '20261028TG',
        expiryDate: '2027-10-27',
        spec: 'R1: 80mL×4, R2: 20mL×4',
        unit: '盒',
        qty: 30,
        price: 220.0,
        subtotal: 6600.0,
        tempStorage: '4.0℃ (合格) 2~8℃ 避光冷藏',
        coaReg: '已附原厂COA 国械注准20223400521',
      },
    ],
  });

  // 7. 退货表单状态 (对应 image_cff1643e.png)
  const [returnForm, setReturnForm] = useState<{
    returnReason: string;
    returnScope: string;
    returnDesc: string;
  }>({
    returnReason: '随货冷链温度异常超温预警(高于8℃)',
    returnScope: '整单全部拒收退货 (全单核销)',
    returnDesc: '冷链运输箱到达科室时开箱测温异常，依规发起拒收退货申请',
  });

  // 8. 审核表单状态
  const [auditForm, setAuditForm] = useState<{
    auditor: string;
    auditOpinion: string;
  }>({
    auditor: '李晓红副主任技师',
    auditOpinion: '经核对随货同行单、原厂COA质检证明与冷链温控记录，试剂外包装完好无破损，符合入库质量标准，准予入库核算。',
  });

  // 切换折叠
  const toggleRowExpand = (id: string, orderNo: string) => {
    setSelectedOrderNo(orderNo);
    setExpandedOrderIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // 数据过滤计算
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      // 库房过滤
      if (filterWarehouse !== '全部库房') {
        const targetWarehouse = filterWarehouse.replace('库', '');
        if (!o.warehouse.includes(targetWarehouse)) {
          return false;
        }
      }
      // 入库类型
      if (filterInType !== '全部类型' && o.inType !== filterInType) {
        return false;
      }
      // 入库单号过滤
      if (filterOrderNo.trim()) {
        const kw = filterOrderNo.trim().toLowerCase();
        const match =
          o.orderNo.toLowerCase().includes(kw) ||
          o.supplier.toLowerCase().includes(kw) ||
          o.operator.toLowerCase().includes(kw);
        if (!match) return false;
      }
      // 状态过滤
      if (filterStatus !== '全部' && o.status !== filterStatus) {
        return false;
      }
      return true;
    });
  }, [orders, filterWarehouse, filterInType, filterOrderNo, filterStatus]);

  // 分页计算
  const totalCount = filteredOrders.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const pagedOrders = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filteredOrders.slice(start, start + pageSize);
  }, [filteredOrders, safePage, pageSize]);

  // 指标统计数据计算 (对应 image_9ab8443e.png 顶部的4个指标卡)
  const stats = useMemo(() => {
    const totalAmount = orders.reduce((sum, item) => sum + item.amount, 0);
    const auditedCount = orders.filter((o) => o.status === '审核').length;
    const draftCount = orders.filter((o) => o.status === '登记').length;
    const qualifiedTempCount = orders.filter((o) => !o.tempRange.includes('异常')).length;
    const tempRate = orders.length > 0 ? ((qualifiedTempCount / orders.length) * 100).toFixed(1) : '100.0';

    return {
      totalAmount,
      auditedCount,
      draftCount,
      tempRate,
    };
  }, [orders]);

  // 新增入库单处理
  const handleOpenAddModal = () => {
    const nextOrderNum = 'N00000' + (orders.length + 5);
    setAddForm({
      warehouse: '生化组',
      inType: '外购入库',
      operator: '魏明主管检验师',
      supplier: '国药控股分销时代有限公司',
      invoiceNo: `FP-202610-${Math.floor(1000 + Math.random() * 9000)}`,
      tempRecord: '4.0℃ (冷链记录仪合格)',
      desc: '2026年10月下旬检验常规生化耗材带量集采随货验收',
      items: [
        {
          code: '010065',
          name: '总胆固醇测定试剂盒(COD-PAP法)',
          batchNo: '20261028CH',
          expiryDate: '2027-10-27',
          spec: 'R1: 80mL×4, R2: 20mL×4',
          unit: '盒',
          qty: 30,
          price: 195.0,
          subtotal: 5850.0,
          tempStorage: '4.0℃ (合格) 2~8℃ 避光冷藏',
          coaReg: '已附原厂COA 国械注准20223400520',
        },
        {
          code: '010068',
          name: '甘油三酯测定试剂盒(GPO-PAP法)',
          batchNo: '20261028TG',
          expiryDate: '2027-10-27',
          spec: 'R1: 80mL×4, R2: 20mL×4',
          unit: '盒',
          qty: 30,
          price: 220.0,
          subtotal: 6600.0,
          tempStorage: '4.0℃ (合格) 2~8℃ 避光冷藏',
          coaReg: '已附原厂COA 国械注准20223400521',
        },
      ],
    });
    setIsAddModalOpen(true);
  };

  const handleSaveAddOrder = () => {
    if (!addForm.supplier.trim()) {
      showNotice('请填写供应商名称');
      return;
    }
    if (addForm.items.length === 0) {
      showNotice('请至少添加一种拟入库试剂品规');
      return;
    }

    const totalAmt = addForm.items.reduce((s, it) => s + it.subtotal, 0);
    const nextOrderNum = 'N00000' + (orders.length + 5);
    const newOrder: InboundOrder = {
      id: `INB-${Date.now()}`,
      orderNo: nextOrderNum,
      warehouse: addForm.warehouse,
      warehouseKey: addForm.warehouse.includes('临检')
        ? 'clin'
        : addForm.warehouse.includes('免疫')
        ? 'imm'
        : addForm.warehouse.includes('微生物')
        ? 'micro'
        : addForm.warehouse.includes('输血')
        ? 'blood'
        : 'biochem',
      inType: addForm.inType,
      supplier: addForm.supplier,
      invoiceNo: addForm.invoiceNo,
      tempRange: addForm.tempRecord,
      amount: totalAmt,
      desc: addForm.desc,
      operator: addForm.operator,
      operateTime: '2026-10-31 09:30:00',
      reviewer: '',
      reviewTime: '',
      status: '登记',
      items: addForm.items,
    };

    setOrders([newOrder, ...orders]);
    setSelectedOrderNo(newOrder.orderNo);
    setExpandedOrderIds([newOrder.id, ...expandedOrderIds]);
    setIsAddModalOpen(false);
    showNotice(`成功生成试剂入库验收登记单【${newOrder.orderNo}】，金额：¥ ${totalAmt.toFixed(2)}`);
  };

  // 打开查看详情弹窗
  const handleOpenView = (order: InboundOrder) => {
    setActiveModalOrder(order);
    setIsViewModalOpen(true);
  };

  // 打开审核弹窗
  const handleOpenAudit = (order: InboundOrder) => {
    if (order.status === '已退货') {
      showNotice(`入库单【${order.orderNo}】已被全单拒收退货，不可审核！`);
      return;
    }
    setActiveModalOrder(order);
    setAuditForm({
      auditor: '李晓红副主任技师',
      auditOpinion: '经核对随货同行单、原厂COA质检证明与冷链温控记录，试剂外包装完好无破损，符合入库质量标准，准予入库核算。',
    });
    setIsAuditModalOpen(true);
  };

  // 确认审核
  const handleConfirmAudit = () => {
    if (!activeModalOrder) return;
    const updated = orders.map((o) =>
      o.id === activeModalOrder.id
        ? {
            ...o,
            status: '审核' as const,
            reviewer: auditForm.auditor,
            reviewTime: '2026-10-31 10:15:00',
          }
        : o
    );
    setOrders(updated);
    setIsAuditModalOpen(false);
    showNotice(`入库单【${activeModalOrder.orderNo}】审核完成，已正式入账入库！审核人：${auditForm.auditor}`);
  };

  // 撤销审核
  const handleRevokeAudit = (order: InboundOrder) => {
    const updated = orders.map((o) =>
      o.id === order.id
        ? {
            ...o,
            status: '登记' as const,
            reviewer: '',
            reviewTime: '',
          }
        : o
    );
    setOrders(updated);
    showNotice(`入库单【${order.orderNo}】审核已撤销，恢复为草稿登记状态`);
  };

  // 打开退货弹窗 (对应 image_cff1643e.png)
  const handleOpenReturn = (order: InboundOrder) => {
    setActiveModalOrder(order);
    setReturnForm({
      returnReason: '随货冷链温度异常超温预警(高于8℃)',
      returnScope: '整单全部拒收退货 (全单核销)',
      returnDesc: '冷链运输箱到达科室时开箱测温异常，依规发起拒收退货申请',
    });
    setIsReturnModalOpen(true);
  };

  // 确认退货
  const handleConfirmReturn = () => {
    if (!activeModalOrder) return;
    const updated = orders.map((o) =>
      o.id === activeModalOrder.id
        ? {
            ...o,
            status: '已退货' as const,
            returnInfo: {
              returnReason: returnForm.returnReason,
              returnScope: returnForm.returnScope,
              returnDesc: returnForm.returnDesc,
              returnTime: '2026-10-31 10:30:00',
              returnOperator: '魏明主管检验师',
            },
          }
        : o
    );
    setOrders(updated);
    setIsReturnModalOpen(false);
    showNotice(`已对入库单【${activeModalOrder.orderNo}】发起采购退货出库，原入库金额已冲销！`);
  };

  // 删除单据
  const handleDeleteOrder = (order: InboundOrder) => {
    if (order.status === '审核') {
      showNotice(`入库单【${order.orderNo}】已审核，不可直接删除！请先撤销审核。`);
      return;
    }
    if (window.confirm(`确定要删除草稿入库单【${order.orderNo}】吗？`)) {
      setOrders(orders.filter((o) => o.id !== order.id));
      showNotice(`已成功删除草稿入库单【${order.orderNo}】`);
    }
  };

  // 打印入库单
  const handlePrintInbound = (order?: InboundOrder) => {
    const target = order || orders.find((o) => o.orderNo === selectedOrderNo) || orders[0];
    setActiveModalOrder(target);
    setIsPrintModalOpen(true);
  };

  // 打印条码标签
  const handlePrintBarcodes = (order?: InboundOrder) => {
    const target = order || orders.find((o) => o.orderNo === selectedOrderNo) || orders[0];
    setActiveModalOrder(target);
    setIsBarcodeModalOpen(true);
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 flex-1 flex flex-col overflow-hidden text-xs text-slate-800 shadow-2xs font-sans">
      {/* 顶部主标题栏与操作按钮组 (完全还原截图 image_9ab8443e.png 顶部结构) */}
      <div className="px-4 py-2.5 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-6 bg-blue-600 rounded-xs" />
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 tracking-tight">试剂入库管理</h2>
            <span className="text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 font-medium">
              {hospitalUnit || '中心医院'} · 批号冷链验收
            </span>
          </div>
        </div>

        {/* 右上角五个按钮 (完全对应截图 image_9ab8443e.png) */}
        <div className="flex items-center gap-2">
          {/* + 新增 */}
          <button
            type="button"
            onClick={handleOpenAddModal}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>新增</span>
          </button>

          {/* 审核 */}
          <button
            type="button"
            onClick={() => {
              const current = orders.find((o) => o.orderNo === selectedOrderNo) || orders[0];
              if (current) handleOpenAudit(current);
            }}
            className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded text-xs font-medium flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            <FileCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>审核</span>
          </button>

          {/* 退货 */}
          <button
            type="button"
            onClick={() => {
              const current = orders.find((o) => o.orderNo === selectedOrderNo) || orders[0];
              if (current) handleOpenReturn(current);
            }}
            className="px-3 py-1.5 bg-white border border-rose-300 text-rose-600 hover:bg-rose-50 rounded text-xs font-medium flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-rose-500" />
            <span>退货</span>
          </button>

          {/* 打印入库单 */}
          <button
            type="button"
            onClick={() => handlePrintInbound()}
            className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded text-xs font-medium flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span>打印入库单</span>
          </button>

          {/* 打印条码 */}
          <button
            type="button"
            onClick={() => handlePrintBarcodes()}
            className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded text-xs font-medium flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            <Barcode className="w-3.5 h-3.5 text-slate-600" />
            <span>打印条码</span>
          </button>
        </div>
      </div>

      {/* 4个指标卡片 (完全对应截图 image_9ab8443e.png) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 px-4 py-2.5 bg-slate-50 border-b border-slate-200 shrink-0">
        {/* 卡片1: 入库总金额汇总 */}
        <div className="bg-white p-3 rounded-lg border border-slate-200/80 shadow-2xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
            <DollarSign className="w-4.5 h-4.5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-500 font-medium">入库总金额汇总</div>
            <div className="text-base font-bold font-mono text-slate-900">
              ¥ {stats.totalAmount.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
            </div>
          </div>
        </div>

        {/* 卡片2: 已审核验收单据 */}
        <div className="bg-white p-3 rounded-lg border border-slate-200/80 shadow-2xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
            <CheckCircle2 className="w-4.5 h-4.5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-500 font-medium">已审核验收单据</div>
            <div className="text-base font-bold font-mono text-slate-900">
              {stats.auditedCount} <span className="text-xs font-normal text-slate-500">笔</span>
            </div>
          </div>
        </div>

        {/* 卡片3: 待复核草稿单据 */}
        <div className="bg-white p-3 rounded-lg border border-slate-200/80 shadow-2xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
            <Clock className="w-4.5 h-4.5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-500 font-medium">待复核草稿单据</div>
            <div className="text-base font-bold font-mono text-slate-900">
              {stats.draftCount} <span className="text-xs font-normal text-slate-500">笔</span>
            </div>
          </div>
        </div>

        {/* 卡片4: 随货冷链温控达标率 */}
        <div className="bg-white p-3 rounded-lg border border-slate-200/80 shadow-2xs flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 shrink-0">
            <Thermometer className="w-4.5 h-4.5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-500 font-medium">随货冷链温控达标率</div>
            <div className="text-base font-bold font-mono text-emerald-600">
              {stats.tempRate}%
            </div>
          </div>
        </div>
      </div>

      {/* 筛选工具栏 (完全对应截图 image_9ab8443e.png: 当前库房、入库类型、入库单号、编制日期、状态) */}
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
              <option value="输血科">输血科库</option>
              <option value="全部库房">全部库房</option>
            </select>
          </div>

          {/* 入库类型 */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-600 font-medium whitespace-nowrap">入库类型:</span>
            <select
              value={filterInType}
              onChange={(e) => setFilterInType(e.target.value)}
              className="bg-white border border-slate-300 rounded px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
            >
              <option value="外购入库">外购入库</option>
              <option value="调拨入库">调拨入库</option>
              <option value="应急调配">应急调配</option>
              <option value="厂商赠送">厂商赠送</option>
              <option value="全部类型">全部类型</option>
            </select>
          </div>

          {/* 入库单号 */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-600 font-medium whitespace-nowrap">入库单号:</span>
            <div className="relative">
              <input
                type="text"
                value={filterOrderNo}
                onChange={(e) => setFilterOrderNo(e.target.value)}
                placeholder="请输入或扫描入库单号"
                className="w-48 pl-2.5 pr-7 py-1 bg-white border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-blue-500 placeholder-slate-400"
              />
              <Barcode className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2 pointer-events-none" />
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
              <option value="审核">审核</option>
              <option value="已退货">已退货</option>
            </select>
          </div>

          {/* 查询按钮 */}
          <button
            type="button"
            onClick={() => showNotice(`检索完成，共找到 ${filteredOrders.length} 笔入库单据`)}
            className="px-4 py-1 bg-white border border-blue-500 text-blue-600 hover:bg-blue-50 rounded text-xs font-medium shadow-2xs transition-colors flex items-center gap-1"
          >
            <Search className="w-3 h-3" />
            <span>查询</span>
          </button>

          {/* 重置筛选 */}
          {(filterWarehouse !== '全部库房' || filterStatus !== '全部' || filterOrderNo || filterInType !== '全部类型') && (
            <button
              type="button"
              onClick={() => {
                setFilterWarehouse('全部库房');
                setFilterInType('全部类型');
                setFilterOrderNo('');
                setFilterStatus('全部');
                showNotice('已重置所有筛选参数');
              }}
              className="text-slate-500 hover:text-slate-700 underline text-xs"
            >
              重置筛选
            </button>
          )}
        </div>
      </div>

      {/* 主数据列表区 (带展开行与子明细，完全还原截图 image_9ab8443e.png) */}
      <div className="flex-1 overflow-auto min-h-0 bg-white">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="sticky top-0 z-10 bg-[#fafafa] text-slate-700 font-semibold border-b border-slate-200 select-none shadow-2xs">
            <tr>
              <th className="py-2.5 px-3 w-8 text-center" />
              <th className="py-2.5 px-3 whitespace-nowrap">入库单号</th>
              <th className="py-2.5 px-3 whitespace-nowrap">入库库房</th>
              <th className="py-2.5 px-3 whitespace-nowrap">供应商</th>
              <th className="py-2.5 px-3 whitespace-nowrap text-right">金额</th>
              <th className="py-2.5 px-3 whitespace-nowrap min-w-[200px]">说明</th>
              <th className="py-2.5 px-3 whitespace-nowrap">操作人</th>
              <th className="py-2.5 px-3 whitespace-nowrap">操作时间</th>
              <th className="py-2.5 px-3 whitespace-nowrap">审核人</th>
              <th className="py-2.5 px-3 whitespace-nowrap">审核时间</th>
              <th className="py-2.5 px-3 text-center whitespace-nowrap">状态</th>
              <th className="py-2.5 px-3 text-center whitespace-nowrap w-28">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {pagedOrders.length === 0 ? (
              <tr>
                <td colSpan={12} className="py-16 text-center text-slate-400">
                  <Archive className="w-9 h-9 mx-auto text-slate-300 mb-2" />
                  <div>暂无符合筛选条件的入库单据记录</div>
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
                      {/* 展开/折叠箭头 */}
                      <td className="py-2.5 px-3 text-center text-blue-600">
                        {isExpanded ? (
                          <ChevronDown className="w-3.5 h-3.5 inline" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5 inline text-slate-400" />
                        )}
                      </td>

                      {/* 入库单号 */}
                      <td className="py-2.5 px-3 font-mono font-bold text-blue-600 whitespace-nowrap">
                        {order.orderNo}
                      </td>

                      {/* 入库库房 */}
                      <td className="py-2.5 px-3 whitespace-nowrap text-slate-800">
                        {order.warehouse}
                      </td>

                      {/* 供应商 */}
                      <td className="py-2.5 px-3 whitespace-nowrap font-medium text-slate-900">
                        {order.supplier}
                      </td>

                      {/* 金额 */}
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900 whitespace-nowrap">
                        ¥ {order.amount.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
                      </td>

                      {/* 说明 */}
                      <td className="py-2.5 px-3 text-slate-600 max-w-xs truncate" title={order.desc}>
                        {order.desc}
                      </td>

                      {/* 操作人 (真实人名) */}
                      <td className="py-2.5 px-3 whitespace-nowrap text-slate-800">
                        {order.operator}
                      </td>

                      {/* 操作时间 */}
                      <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                        {order.operateTime}
                      </td>

                      {/* 审核人 */}
                      <td className="py-2.5 px-3 whitespace-nowrap text-slate-700">
                        {order.reviewer || '-'}
                      </td>

                      {/* 审核时间 */}
                      <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                        {order.reviewTime || '-'}
                      </td>

                      {/* 状态徽标 (完全还原截图：登记为黄标，审核为蓝标，退货为红标) */}
                      <td className="py-2.5 px-3 text-center whitespace-nowrap">
                        {order.status === '审核' ? (
                          <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-700 border border-blue-200">
                            审核
                          </span>
                        ) : order.status === '已退货' ? (
                          <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-rose-100 text-rose-700 border border-rose-200">
                            已退货
                          </span>
                        ) : (
                          <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            登记
                          </span>
                        )}
                      </td>

                      {/* 操作按钮 (完全对应截图操作) */}
                      <td
                        className="py-2.5 px-3 text-center whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {order.status === '登记' ? (
                          <div className="flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleOpenAudit(order)}
                              className="text-blue-600 hover:text-blue-800 hover:underline font-medium text-xs"
                            >
                              审核
                            </button>
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
                          </div>
                        ) : order.status === '审核' ? (
                          <div className="flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleRevokeAudit(order)}
                              className="text-amber-600 hover:text-amber-800 hover:underline font-medium text-xs"
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
                              onClick={() => handleOpenReturn(order)}
                              className="text-rose-600 hover:text-rose-800 hover:underline font-medium text-xs"
                            >
                              退货
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleOpenView(order)}
                              className="text-blue-600 hover:text-blue-800 hover:underline font-medium text-xs"
                            >
                              查看
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>

                    {/* 展开的嵌套子表格 (完全对应截图 image_9ab8443e.png: 入库批号与冷链验收明细) */}
                    {isExpanded && (
                      <tr className="bg-slate-50/70 border-y border-blue-100">
                        <td colSpan={12} className="p-3 pl-8">
                          <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
                            {/* 子表顶栏 */}
                            <div className="px-4 py-2 bg-slate-50/80 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                              <div className="flex items-center gap-3">
                                <span className="font-bold text-slate-800">
                                  入库批号与冷链验收明细 ({order.items.length} 项)
                                </span>
                                <span className="text-slate-500 font-mono text-[11px]">
                                  随货同行发票号: {order.invoiceNo}
                                </span>
                                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  随货冷链箱实测: {order.tempRange}
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => handlePrintBarcodes(order)}
                                  className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 font-medium"
                                >
                                  <Barcode className="w-3.5 h-3.5" />
                                  <span>批量打印此单条码标签</span>
                                </button>
                                <span className="text-slate-300">|</span>
                                <button
                                  type="button"
                                  onClick={() => handlePrintInbound(order)}
                                  className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 font-medium"
                                >
                                  <Printer className="w-3.5 h-3.5" />
                                  <span>打印验收单</span>
                                </button>
                              </div>
                            </div>

                            {/* 子表明细列表 */}
                            <div className="overflow-x-auto">
                              <table className="w-full text-left text-xs border-collapse">
                                <thead className="bg-[#fafafa] text-slate-600 font-semibold border-b border-slate-200">
                                  <tr>
                                    <th className="py-2 px-3 whitespace-nowrap">试剂编码</th>
                                    <th className="py-2 px-3 whitespace-nowrap">试剂品名</th>
                                    <th className="py-2 px-3 whitespace-nowrap">生产批号(Lot)</th>
                                    <th className="py-2 px-3 whitespace-nowrap">有效期至</th>
                                    <th className="py-2 px-3 whitespace-nowrap">规格型号</th>
                                    <th className="py-2 px-2 text-center whitespace-nowrap">单位</th>
                                    <th className="py-2 px-3 text-right whitespace-nowrap font-bold">入库数量</th>
                                    <th className="py-2 px-3 text-right whitespace-nowrap">单价(元)</th>
                                    <th className="py-2 px-3 text-right whitespace-nowrap font-bold">小计(元)</th>
                                    <th className="py-2 px-3 whitespace-nowrap">冷链温度与储存</th>
                                    <th className="py-2 px-3 whitespace-nowrap">COA与注册证</th>
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

                                      {/* 生产批号 (蓝字) */}
                                      <td className="py-2 px-3 font-mono font-bold text-blue-600 whitespace-nowrap">
                                        {it.batchNo}
                                      </td>

                                      {/* 有效期至 (绿字) */}
                                      <td className="py-2 px-3 font-mono font-bold text-emerald-600 whitespace-nowrap">
                                        {it.expiryDate}
                                      </td>

                                      {/* 规格型号 */}
                                      <td className="py-2 px-3 font-mono text-slate-600 text-[11px] whitespace-nowrap">
                                        {it.spec}
                                      </td>

                                      {/* 单位 */}
                                      <td className="py-2 px-2 text-center text-slate-700 whitespace-nowrap">
                                        {it.unit}
                                      </td>

                                      {/* 入库数量 */}
                                      <td className="py-2 px-3 text-right font-mono font-bold text-slate-900 whitespace-nowrap">
                                        {it.qty}
                                      </td>

                                      {/* 单价 */}
                                      <td className="py-2 px-3 text-right font-mono text-slate-600 whitespace-nowrap">
                                        {it.price.toFixed(2)}
                                      </td>

                                      {/* 小计 */}
                                      <td className="py-2 px-3 text-right font-mono font-bold text-slate-900 whitespace-nowrap">
                                        {it.subtotal.toFixed(2)}
                                      </td>

                                      {/* 冷链温度与储存 */}
                                      <td className="py-2 px-3 text-xs whitespace-nowrap">
                                        <span className="text-emerald-700 font-medium">
                                          {it.tempStorage}
                                        </span>
                                      </td>

                                      {/* COA与注册证 */}
                                      <td className="py-2 px-3 text-xs whitespace-nowrap">
                                        <span className="text-blue-700">{it.coaReg}</span>
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

      {/* 底部汇总与分页栏 (完全对应截图 image_9ab8443e.png 底部: 合计X条，右侧已勾选/激活单据与入库总金额) */}
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

        {/* 右侧激活单据与入库总金额 */}
        <div className="flex items-center gap-4 text-xs">
          <span>
            已勾选/激活单据:{' '}
            <strong className="text-blue-600 font-mono font-bold">{selectedOrderNo}</strong>
          </span>
          <span>
            入库总金额:{' '}
            <strong className="text-emerald-600 font-mono font-bold text-sm">
              ¥ {stats.totalAmount.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
            </strong>
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 弹窗 1：新建试剂入库验收登记单 (完全1:1还原截图 image_044300da.png) */}
      {/* ========================================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* 弹窗标题 */}
            <div className="px-5 py-3.5 bg-white border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-600" />
                <span>新建试剂入库验收登记单</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 弹窗表单内容 */}
            <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              {/* 第一行：入库库房、入库类型、操作验收人 */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    入库库房 <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={addForm.warehouse}
                    onChange={(e) => setAddForm({ ...addForm, warehouse: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                  >
                    <option value="生化组">生化组</option>
                    <option value="临检组">临检组</option>
                    <option value="免疫组">免疫组</option>
                    <option value="微生物组">微生物组</option>
                    <option value="输血科">输血科</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    入库类型 <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={addForm.inType}
                    onChange={(e) => setAddForm({ ...addForm, inType: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                  >
                    <option value="外购入库">外购入库</option>
                    <option value="调拨入库">调拨入库</option>
                    <option value="应急调配">应急调配</option>
                    <option value="厂商赠送">厂商赠送</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    操作验收人 <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={addForm.operator}
                    onChange={(e) => setAddForm({ ...addForm, operator: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-medium"
                  >
                    <option value="魏明主管检验师">魏明主管检验师</option>
                    <option value="李晓红副主任技师">李晓红副主任技师</option>
                    <option value="陈康主管检验师">陈康主管检验师</option>
                    <option value="刘浩然技师">刘浩然技师</option>
                    <option value="钱宇恒技师">钱宇恒技师</option>
                  </select>
                </div>
              </div>

              {/* 第二行：供应商/供货单位、随货发票号/同行单号 */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    供应商/供货单位 <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={addForm.supplier}
                    onChange={(e) => setAddForm({ ...addForm, supplier: e.target.value })}
                    placeholder="例如: 国药控股分销时代有限公司"
                    className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    随货发票号/同行单号
                  </label>
                  <input
                    type="text"
                    value={addForm.invoiceNo}
                    onChange={(e) => setAddForm({ ...addForm, invoiceNo: e.target.value })}
                    placeholder="FP-202610-9922"
                    className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs font-mono text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* 第三行：冷链箱实测到货温度、入库批注说明 */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    冷链箱实测到货温度
                  </label>
                  <input
                    type="text"
                    value={addForm.tempRecord}
                    onChange={(e) => setAddForm({ ...addForm, tempRecord: e.target.value })}
                    placeholder="4.0℃ (冷链记录仪合格)"
                    className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">入库批注说明</label>
                  <input
                    type="text"
                    value={addForm.desc}
                    onChange={(e) => setAddForm({ ...addForm, desc: e.target.value })}
                    placeholder="2026年10月下旬检验常规生化耗材带量集采随货验收"
                    className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* 拟入库试剂批号明细表格 (严格对应 image_044300da.png) */}
              <div className="border border-slate-200 rounded-lg p-3 bg-slate-50/60 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">拟入库试剂批号明细</span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      共 {addForm.items.length} 种试剂
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setAddForm({
                        ...addForm,
                        items: [
                          ...addForm.items,
                          {
                            code: '010072',
                            name: '高密度脂蛋白胆固醇(HDL-C)测定试剂盒',
                            batchNo: '20261028HD',
                            expiryDate: '2027-10-27',
                            spec: 'R1: 80mL×4, R2: 20mL×4',
                            unit: '盒',
                            qty: 20,
                            price: 260.0,
                            subtotal: 5200.0,
                            tempStorage: '4.0℃ (合格) 2~8℃ 避光冷藏',
                            coaReg: '已附原厂COA 国械注准20223400522',
                          },
                        ],
                      });
                    }}
                    className="text-xs text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 font-medium"
                  >
                    <Plus className="w-3 h-3" />
                    <span>添加一行试剂</span>
                  </button>
                </div>

                <div className="border border-slate-200 rounded bg-white overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-[#fafafa] text-slate-700 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="py-2 px-2.5">试剂编码</th>
                        <th className="py-2 px-2.5">试剂名称</th>
                        <th className="py-2 px-2.5">批号</th>
                        <th className="py-2 px-2.5">有效期至</th>
                        <th className="py-2 px-2 text-center">单位</th>
                        <th className="py-2 px-2 text-right">数量</th>
                        <th className="py-2 px-2 text-right">单价</th>
                        <th className="py-2 px-2.5 text-right font-bold">小计(元)</th>
                        <th className="py-2 px-2 text-center w-8">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {addForm.items.map((it, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="py-2 px-2.5 font-mono text-slate-700">{it.code}</td>
                          <td className="py-2 px-2.5 font-semibold text-slate-900">{it.name}</td>
                          <td className="py-2 px-2.5 font-mono text-blue-600 font-bold">{it.batchNo}</td>
                          <td className="py-2 px-2.5 font-mono text-emerald-600 font-bold">{it.expiryDate}</td>
                          <td className="py-2 px-2 text-center text-slate-600">{it.unit}</td>
                          <td className="py-2 px-2 text-right">
                            <input
                              type="number"
                              min={1}
                              value={it.qty}
                              onChange={(e) => {
                                const newQty = parseInt(e.target.value) || 0;
                                const nextItems = [...addForm.items];
                                nextItems[idx] = {
                                  ...nextItems[idx],
                                  qty: newQty,
                                  subtotal: newQty * nextItems[idx].price,
                                };
                                setAddForm({ ...addForm, items: nextItems });
                              }}
                              className="w-16 border border-slate-300 rounded px-1.5 py-0.5 text-right font-mono font-bold"
                            />
                          </td>
                          <td className="py-2 px-2 text-right font-mono text-slate-700">
                            {it.price.toFixed(2)}
                          </td>
                          <td className="py-2 px-2.5 text-right font-mono font-bold text-slate-900">
                            {it.subtotal.toFixed(2)}
                          </td>
                          <td className="py-2 px-2 text-center">
                            {addForm.items.length > 1 && (
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
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* 入库合计 */}
                <div className="pt-2 flex justify-end text-xs font-semibold text-slate-700">
                  <span>
                    入库合计:{' '}
                    <strong className="text-emerald-600 font-mono font-bold text-sm">
                      ¥ {addForm.items.reduce((s, i) => s + i.subtotal, 0).toFixed(2)}
                    </strong>
                  </span>
                </div>
              </div>
            </div>

            {/* 底部按钮 */}
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
                onClick={handleSaveAddOrder}
                className="px-5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium text-xs shadow-xs"
              >
                确认完成验收入库
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 弹窗 2：入库单详情档案 (完全1:1还原截图 image_38dd17d3.png) */}
      {/* ========================================================================= */}
      {isViewModalOpen && activeModalOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* 标题栏 */}
            <div className="px-5 py-3.5 bg-white border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Eye className="w-4 h-4 text-blue-600" />
                <span>入库单详情档案 - {activeModalOrder.orderNo}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsViewModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 档案两列明细网格 (完全对应截图 image_38dd17d3.png) */}
            <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto text-xs text-slate-700">
              <div className="grid grid-cols-2 gap-y-2.5 gap-x-6 p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <div>
                  <span className="text-slate-500">入库单号: </span>
                  <strong className="font-mono text-blue-600 font-bold">{activeModalOrder.orderNo}</strong>
                </div>
                <div>
                  <span className="text-slate-500">入库库房: </span>
                  <strong className="text-slate-900 font-bold">{activeModalOrder.warehouse}</strong>
                </div>

                <div>
                  <span className="text-slate-500">供应商家: </span>
                  <span className="font-medium text-slate-900">{activeModalOrder.supplier}</span>
                </div>
                <div>
                  <span className="text-slate-500">入库类型: </span>
                  <span className="text-slate-800">{activeModalOrder.inType}</span>
                </div>

                <div>
                  <span className="text-slate-500">录入操作人: </span>
                  <span className="font-bold text-slate-900">{activeModalOrder.operator}</span>
                </div>
                <div>
                  <span className="text-slate-500">录入时间: </span>
                  <span className="font-mono text-slate-700">{activeModalOrder.operateTime}</span>
                </div>

                <div>
                  <span className="text-slate-500">审核责任人: </span>
                  <span className="font-bold text-slate-900">{activeModalOrder.reviewer || '待审核'}</span>
                </div>
                <div>
                  <span className="text-slate-500">审核时间: </span>
                  <span className="font-mono text-slate-700">{activeModalOrder.reviewTime || '-'}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-slate-500">单据状态: </span>
                  {activeModalOrder.status === '审核' ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700 border border-blue-200">
                      审核
                    </span>
                  ) : activeModalOrder.status === '已退货' ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700 border border-rose-200">
                      已退货
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                      登记
                    </span>
                  )}
                </div>
                <div>
                  <span className="text-slate-500">总计金额: </span>
                  <strong className="font-mono font-bold text-emerald-600 text-sm">
                    ¥ {activeModalOrder.amount.toFixed(2)}
                  </strong>
                </div>

                <div className="col-span-2">
                  <span className="text-slate-500">随货温控记录: </span>
                  <span className="text-emerald-700 font-bold">{activeModalOrder.tempRange}</span>
                </div>

                <div className="col-span-2">
                  <span className="text-slate-500">单据说明: </span>
                  <span className="text-slate-800">{activeModalOrder.desc}</span>
                </div>

                {activeModalOrder.returnInfo && (
                  <div className="col-span-2 p-2.5 bg-rose-50 border border-rose-200 rounded text-rose-800">
                    <div className="font-bold mb-1">已处理采购退货信息：</div>
                    <div>原因: {activeModalOrder.returnInfo.returnReason}</div>
                    <div>说明: {activeModalOrder.returnInfo.returnDesc}</div>
                    <div className="text-[11px] text-rose-600 mt-1 font-mono">
                      经办人: {activeModalOrder.returnInfo.returnOperator} · 时间: {activeModalOrder.returnInfo.returnTime}
                    </div>
                  </div>
                )}
              </div>

              {/* 入库试剂品规列表 */}
              <div>
                <h4 className="font-bold text-slate-800 mb-2">
                  入库试剂品规列表 ({activeModalOrder.items.length}项)
                </h4>
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-[#fafafa] text-slate-700 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="py-2 px-3">编码</th>
                        <th className="py-2 px-3">试剂品名</th>
                        <th className="py-2 px-3">批号</th>
                        <th className="py-2 px-3">效期</th>
                        <th className="py-2 px-2 text-right">数量</th>
                        <th className="py-2 px-3 text-right">单价</th>
                        <th className="py-2 px-3 text-right font-bold">金额</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {activeModalOrder.items.map((it, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="py-2 px-3 font-mono text-slate-600">{it.code}</td>
                          <td className="py-2 px-3 font-semibold text-slate-900">{it.name}</td>
                          <td className="py-2 px-3 font-mono font-bold text-blue-600">{it.batchNo}</td>
                          <td className="py-2 px-3 font-mono font-bold text-emerald-600">{it.expiryDate}</td>
                          <td className="py-2 px-2 text-right font-mono font-bold text-slate-900">
                            {it.qty} {it.unit}
                          </td>
                          <td className="py-2 px-3 text-right font-mono text-slate-600">
                            {it.price.toFixed(2)}
                          </td>
                          <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">
                            {it.subtotal.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* 底部按钮 */}
            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
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
      {/* 弹窗 3：试剂耗材采购退货出库单编制 (完全1:1还原截图 image_cff1643e.png) */}
      {/* ========================================================================= */}
      {isReturnModalOpen && activeModalOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* 标题 */}
            <div className="px-5 py-3.5 bg-white border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-rose-600 text-sm flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-rose-500" />
                <span>试剂耗材采购退货出库单编制</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsReturnModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs text-slate-700 max-h-[75vh] overflow-y-auto">
              {/* 黄色提示条 (对应截图 image_cff1643e.png) */}
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 leading-relaxed">
                当试剂出现冷链温度异常、包装破损渗漏、资质质检不全或临近效期时，可在此向供应商发起退货出库流程。
              </div>

              {/* 关联入库单卡片 */}
              <div className="grid grid-cols-2 gap-y-2 p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
                <div>
                  <span className="text-slate-500">关联入库单: </span>
                  <strong className="font-mono text-blue-600 font-bold">{activeModalOrder.orderNo}</strong>
                </div>
                <div>
                  <span className="text-slate-500">供货厂商: </span>
                  <strong className="text-slate-900 font-bold">{activeModalOrder.supplier}</strong>
                </div>
                <div>
                  <span className="text-slate-500">入库库房: </span>
                  <span className="text-slate-900 font-semibold">{activeModalOrder.warehouse}</span>
                </div>
                <div>
                  <span className="text-slate-500">原入库金额: </span>
                  <strong className="font-mono text-emerald-600 font-bold">
                    ¥ {activeModalOrder.amount.toFixed(2)}
                  </strong>
                </div>
              </div>

              {/* 退货主要原因 * */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  退货主要原因 <span className="text-rose-500">*</span>
                </label>
                <select
                  value={returnForm.returnReason}
                  onChange={(e) => setReturnForm({ ...returnForm, returnReason: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-rose-500"
                >
                  <option value="随货冷链温度异常超温预警(高于8℃)">随货冷链温度异常超温预警(高于8℃)</option>
                  <option value="外包装破损渗漏/污染">外包装破损渗漏/污染</option>
                  <option value="资质质检报告(COA)不全或批号不符">资质质检报告(COA)不全或批号不符</option>
                  <option value="临近效期(不足规定安全周期)">临近效期(不足规定安全周期)</option>
                  <option value="规格或型号配送错误">规格或型号配送错误</option>
                </select>
              </div>

              {/* 退货范围 */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">退货范围</label>
                <select
                  value={returnForm.returnScope}
                  onChange={(e) => setReturnForm({ ...returnForm, returnScope: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-rose-500"
                >
                  <option value="整单全部拒收退货 (全单核销)">整单全部拒收退货 (全单核销)</option>
                  <option value="部分批次拒收退换 (差额入账)">部分批次拒收退换 (差额入账)</option>
                </select>
              </div>

              {/* 退货处置说明 */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">退货处置说明</label>
                <textarea
                  rows={3}
                  value={returnForm.returnDesc}
                  onChange={(e) => setReturnForm({ ...returnForm, returnDesc: e.target.value })}
                  className="w-full border border-slate-300 rounded p-2 text-xs text-slate-800 focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            {/* 底部按钮 */}
            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsReturnModalOpen(false)}
                className="px-4 py-1.5 bg-white border border-slate-300 text-slate-700 rounded hover:bg-slate-100 font-medium text-xs"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleConfirmReturn}
                className="px-5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded font-medium text-xs shadow-xs"
              >
                确认提交采购退货单
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 弹窗 4：入库审核确认弹窗 */}
      {/* ========================================================================= */}
      {isAuditModalOpen && activeModalOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-3.5 bg-white border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-blue-600" />
                <span>入库验收单审核复核 - {activeModalOrder.orderNo}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsAuditModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs text-slate-700">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-900 leading-relaxed">
                请仔细核验随货检验报告COA、冷链保温箱温度记录与物理外观，审核通过后该批号试剂将正式进入检验科实时可用库存。
              </div>

              <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <div>入库单号: <strong className="font-mono text-blue-600">{activeModalOrder.orderNo}</strong></div>
                <div>入库库房: <strong className="text-slate-900">{activeModalOrder.warehouse}</strong></div>
                <div>供应商: <span className="text-slate-900">{activeModalOrder.supplier}</span></div>
                <div>总金额: <strong className="font-mono text-emerald-600">¥ {activeModalOrder.amount.toFixed(2)}</strong></div>
                <div className="col-span-2">冷链实测: <span className="font-bold text-emerald-700">{activeModalOrder.tempRange}</span></div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">审核责任人</label>
                <select
                  value={auditForm.auditor}
                  onChange={(e) => setAuditForm({ ...auditForm, auditor: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-medium"
                >
                  <option value="李晓红副主任技师">李晓红副主任技师 (试剂质控主管)</option>
                  <option value="郭彩霞主任医师">郭彩霞主任医师 (检验科主任)</option>
                  <option value="魏明主管检验师">魏明主管检验师 (生化库管)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">审核意见批注</label>
                <textarea
                  rows={2}
                  value={auditForm.auditOpinion}
                  onChange={(e) => setAuditForm({ ...auditForm, auditOpinion: e.target.value })}
                  className="w-full border border-slate-300 rounded p-2 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsAuditModalOpen(false)}
                className="px-4 py-1.5 bg-white border border-slate-300 text-slate-700 rounded hover:bg-slate-100 font-medium text-xs"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleConfirmAudit}
                className="px-5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium text-xs shadow-xs"
              >
                确认审核放行
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 弹窗 5：入库单纸质打印预览 */}
      {/* ========================================================================= */}
      {isPrintModalOpen && activeModalOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-300 w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-slate-100 px-5 py-3 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Printer className="w-4 h-4 text-slate-700" />
                <span className="font-bold text-sm text-slate-800">
                  打印预览 - 检验科试剂耗材验收入库单
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
                    检验医学科 试剂耗材验收入库凭单
                  </h2>
                  <div className="flex justify-between items-center text-[11px] text-slate-500 mt-2 font-mono">
                    <span>入库单号: {activeModalOrder.orderNo}</span>
                    <span>随货发票号: {activeModalOrder.invoiceNo}</span>
                    <span>入库库房: {activeModalOrder.warehouse}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-y-1.5 text-xs mb-3 text-slate-700">
                  <div>供货厂商：<span className="font-semibold text-slate-900">{activeModalOrder.supplier}</span></div>
                  <div>入库类型：<span className="text-slate-900">{activeModalOrder.inType}</span></div>
                  <div>验收操作人：<span className="font-semibold text-slate-900">{activeModalOrder.operator}</span></div>
                  <div>验收时间：<span className="font-mono text-slate-900">{activeModalOrder.operateTime}</span></div>
                  <div>冷链温控记录：<span className="text-emerald-700 font-bold">{activeModalOrder.tempRange}</span></div>
                  <div>单据说明：<span className="text-slate-800">{activeModalOrder.desc}</span></div>
                </div>

                <table className="w-full border-collapse border border-slate-400 text-xs text-left mb-3">
                  <thead>
                    <tr className="bg-slate-100 text-slate-800">
                      <th className="border border-slate-400 py-1.5 px-2 text-center w-8">#</th>
                      <th className="border border-slate-400 py-1.5 px-2">试剂编码</th>
                      <th className="border border-slate-400 py-1.5 px-2">试剂品名</th>
                      <th className="border border-slate-400 py-1.5 px-2 font-mono">批号(Lot)</th>
                      <th className="border border-slate-400 py-1.5 px-2 font-mono">有效期</th>
                      <th className="border border-slate-400 py-1.5 px-2 text-center w-10">单位</th>
                      <th className="border border-slate-400 py-1.5 px-2 text-right w-12">数量</th>
                      <th className="border border-slate-400 py-1.5 px-2 text-right w-16">单价</th>
                      <th className="border border-slate-400 py-1.5 px-2 text-right w-20">金额(元)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeModalOrder.items.map((it, idx) => (
                      <tr key={idx}>
                        <td className="border border-slate-400 py-1.5 px-2 text-center font-mono">{idx + 1}</td>
                        <td className="border border-slate-400 py-1.5 px-2 font-mono">{it.code}</td>
                        <td className="border border-slate-400 py-1.5 px-2 font-medium">{it.name}</td>
                        <td className="border border-slate-400 py-1.5 px-2 font-mono">{it.batchNo}</td>
                        <td className="border border-slate-400 py-1.5 px-2 font-mono">{it.expiryDate}</td>
                        <td className="border border-slate-400 py-1.5 px-2 text-center">{it.unit}</td>
                        <td className="border border-slate-400 py-1.5 px-2 text-right font-mono font-bold">{it.qty}</td>
                        <td className="border border-slate-400 py-1.5 px-2 text-right font-mono">{it.price.toFixed(2)}</td>
                        <td className="border border-slate-400 py-1.5 px-2 text-right font-mono font-bold">{it.subtotal.toFixed(2)}</td>
                      </tr>
                    ))}
                    <tr className="bg-slate-50 font-bold">
                      <td colSpan={6} className="border border-slate-400 py-2 px-2 text-left">
                        合计人民币：¥ {activeModalOrder.amount.toFixed(2)}
                      </td>
                      <td colSpan={3} className="border border-slate-400 py-2 px-2 text-right font-mono text-sm text-slate-900">
                        小计：￥{activeModalOrder.amount.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div className="grid grid-cols-3 gap-4 pt-4 text-[11px] text-slate-700">
                  <div>验收员签字：<span className="font-semibold">{activeModalOrder.operator}</span></div>
                  <div>质检复核人：<span className="font-semibold">{activeModalOrder.reviewer || '李晓红副主任技师'}</span></div>
                  <div>库管记账人：<span className="font-semibold">魏明主管检验师</span></div>
                </div>
              </div>
            </div>

            <div className="bg-slate-100 px-5 py-3 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-mono">建议打印纸型: A4 横向标准连续单</span>
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
                    showNotice(`已将入库单【${activeModalOrder.orderNo}】发送至科室网络激光打印机`);
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

      {/* ========================================================================= */}
      {/* 弹窗 6：批量条码标签打印预览 */}
      {/* ========================================================================= */}
      {isBarcodeModalOpen && activeModalOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-300 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-slate-100 px-5 py-3 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Barcode className="w-4 h-4 text-slate-700" />
                <span className="font-bold text-sm text-slate-800">
                  批量打印试剂包装条码标签 - {activeModalOrder.orderNo}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsBarcodeModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 bg-slate-100 space-y-4">
              <div className="text-xs text-slate-600">
                根据入库批次规格，已自动生成热敏不干胶标签（尺寸：60mm × 40mm 医用级防冻标签）：
              </div>

              <div className="grid grid-cols-2 gap-4">
                {activeModalOrder.items.map((it, idx) => (
                  <div
                    key={idx}
                    className="bg-white p-3.5 rounded-lg border-2 border-slate-800 shadow-xs text-slate-900 font-sans"
                  >
                    <div className="text-[10px] text-slate-500 font-bold border-b border-slate-200 pb-1 flex justify-between">
                      <span>{hospitalUnit || '中心医院'}·检验医学科</span>
                      <span>{it.unit}装标签</span>
                    </div>
                    <div className="font-bold text-xs mt-1.5 truncate">{it.name}</div>
                    <div className="text-[11px] font-mono text-slate-600 mt-1">编码: {it.code}</div>
                    <div className="text-[11px] font-mono text-blue-700 font-bold">批号: {it.batchNo}</div>
                    <div className="text-[11px] font-mono text-emerald-700 font-bold">效期: {it.expiryDate}</div>
                    <div className="text-[10px] text-slate-500 mt-1 truncate">储存: 2~8℃ 避光</div>

                    {/* 模拟条形码 */}
                    <div className="mt-2.5 pt-2 border-t border-dashed border-slate-200 flex flex-col items-center">
                      <div className="h-7 w-full bg-[repeating-linear-gradient(90deg,#000,#000_2px,transparent_2px,transparent_4px)]" />
                      <span className="font-mono text-[10px] text-slate-700 mt-0.5">
                        *{it.code}-{it.batchNo}*
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-100 px-5 py-3 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500">共需打印 {activeModalOrder.items.reduce((s, i) => s + i.qty, 0)} 张不干胶贴纸</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsBarcodeModalOpen(false)}
                  className="px-4 py-1.5 border border-slate-300 text-slate-700 rounded hover:bg-slate-200 font-medium text-xs"
                >
                  关闭
                </button>
                <button
                  type="button"
                  onClick={() => {
                    showNotice(`已将 ${activeModalOrder.items.length} 组试剂条形码下发至热敏标签打印机`);
                    setIsBarcodeModalOpen(false);
                  }}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium text-xs shadow-xs flex items-center gap-1.5"
                >
                  <Barcode className="w-3.5 h-3.5" />
                  <span>发送标签打印机</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
