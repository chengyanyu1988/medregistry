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
  ChevronLeft,
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

export interface CheckItem {
  code: string;
  name: string;
  spec: string;
  lotNo: string;
  expireDate: string;
  bookQty: number; // 账面数量
  actualQty: number; // 实盘数量
  diffQty: number; // 差异数量 (实盘 - 账面)
  diffType: '相符' | '盘亏' | '盘盈';
  unit: string;
  price: number;
  diffAmount: number; // 差异金额
  remark: string; // 差异分析说明
}

export interface InventoryCheckOrder {
  id: string;
  orderNo: string; // 盘点单号，如 N0000004
  warehouse: string; // 库房，如 生化组库房
  theme: string; // 盘点主题，如 '10月末例行全库账实大盘点'
  operator: string; // 操作人 (真实临床人名)，如 '魏明主管检验师'
  operateTime: string; // 操作时间，如 '2026-10-30 10:10:10'
  auditor: string; // 审核人，如 '-' 或 '李晓红副主任技师'
  auditTime: string; // 审核时间，如 '-' 或 '2026-10-28 14:30:00'
  status: '登记' | '审核'; // 状态: 登记 (待审草稿) / 审核 (已审平账)
  items: CheckItem[];
  matchRate: number; // 账实相符率，如 66.7
  netDiffAmount: number; // 差异净额，如 -380.00
  totalBookQty: number;
  totalActualQty: number;
}

// 候选试剂库 (供新增盘点快速引入)
const REAGENT_CATALOG = [
  {
    code: '010012',
    name: '丙氨酸氨基转移酶(ALT)测定试剂盒(IFCC速率法)',
    spec: 'R1: 4×60ml, R2: 4×20ml',
    lotNo: 'LOT-261015A',
    expireDate: '2027-10-14',
    bookQty: 18,
    unit: '盒',
    price: 380.0,
  },
  {
    code: '010013',
    name: '天门冬氨酸氨基转移酶(AST)测定试剂盒',
    spec: 'R1: 4×60ml, R2: 4×20ml',
    lotNo: 'LOT-261015B',
    expireDate: '2027-10-14',
    bookQty: 16,
    unit: '盒',
    price: 380.0,
  },
  {
    code: '010018',
    name: '肌酐(Cr)测定试剂盒(肌氨酸氧化酶法)',
    spec: 'R1: 3×70ml, R2: 3×25ml',
    lotNo: 'LOT-261002A',
    expireDate: '2027-09-30',
    bookQty: 12,
    unit: '盒',
    price: 420.0,
  },
  {
    code: '010025',
    name: '尿素氮(BUN)测定试剂盒(脲酶-谷氨酸脱氢酶法)',
    spec: 'R1: 4×50ml, R2: 2×25ml',
    lotNo: 'LOT-260920B',
    expireDate: '2027-09-18',
    bookQty: 15,
    unit: '盒',
    price: 290.0,
  },
  {
    code: '010035',
    name: '肌酸激酶同工酶(CK-MB)测定试剂盒(免疫抑制法)',
    spec: '2×50ml/盒',
    lotNo: 'LOT-261005A',
    expireDate: '2027-10-04',
    bookQty: 10,
    unit: '盒',
    price: 480.0,
  },
  {
    code: '010042',
    name: '全自动生化分析仪电解质ISE参比与稀释电极液',
    spec: '5000ml/桶',
    lotNo: 'LOT-260815E',
    expireDate: '2027-08-14',
    bookQty: 8,
    unit: '桶',
    price: 180.0,
  },
];

// 初始12条近期盘点单数据，严格保证分页每页10条的临床真实感
const INITIAL_INVENTORY_ORDERS: InventoryCheckOrder[] = [
  {
    id: 'chk-004',
    orderNo: 'N0000004',
    warehouse: '生化组库房',
    theme: '10月末例行全库账实大盘点',
    operator: '魏明主管检验师',
    operateTime: '2026-10-30 10:10:10',
    auditor: '-',
    auditTime: '-',
    status: '登记',
    matchRate: 66.7,
    netDiffAmount: -380.0,
    totalBookQty: 46,
    totalActualQty: 45,
    items: [
      {
        code: '010012',
        name: '丙氨酸氨基转移酶(ALT)测定试剂盒(IFCC速率法)',
        spec: 'R1: 4×60ml, R2: 4×20ml',
        lotNo: 'LOT-261015A',
        expireDate: '2027-10-14',
        bookQty: 18,
        actualQty: 18,
        diffQty: 0,
        diffType: '相符',
        unit: '盒',
        price: 380.0,
        diffAmount: 0.0,
        remark: '账实相符',
      },
      {
        code: '010013',
        name: '天门冬氨酸氨基转移酶(AST)测定试剂盒',
        spec: 'R1: 4×60ml, R2: 4×20ml',
        lotNo: 'LOT-261015B',
        expireDate: '2027-10-14',
        bookQty: 16,
        actualQty: 15,
        diffQty: -1,
        diffType: '盘亏',
        unit: '盒',
        price: 380.0,
        diffAmount: -380.0,
        remark: '盘亏1盒 (急诊夜班应急加开未及时扫码出库)',
      },
      {
        code: '010018',
        name: '肌酐(Cr)测定试剂盒(肌氨酸氧化酶法)',
        spec: 'R1: 3×70ml, R2: 3×25ml',
        lotNo: 'LOT-261002A',
        expireDate: '2027-09-30',
        bookQty: 12,
        actualQty: 12,
        diffQty: 0,
        diffType: '相符',
        unit: '盒',
        price: 420.0,
        diffAmount: 0.0,
        remark: '账实相符',
      },
    ],
  },
  {
    id: 'chk-003',
    orderNo: 'N0000003',
    warehouse: '生化组库房',
    theme: '急诊流水线备用通道与在架试剂周盘点',
    operator: '陈康主管检验师',
    operateTime: '2026-10-29 10:10:10',
    auditor: '-',
    auditTime: '-',
    status: '登记',
    matchRate: 66.7,
    netDiffAmount: 420.0,
    totalBookQty: 32,
    totalActualQty: 33,
    items: [
      {
        code: '010018',
        name: '肌酐(Cr)测定试剂盒(肌氨酸氧化酶法)',
        spec: 'R1: 3×70ml, R2: 3×25ml',
        lotNo: 'LOT-261002A',
        expireDate: '2027-09-30',
        bookQty: 10,
        actualQty: 11,
        diffQty: 1,
        diffType: '盘盈',
        unit: '盒',
        price: 420.0,
        diffAmount: 420.0,
        remark: '盘盈1盒 (总库前期试剂调拨实发多入1盒未核对)',
      },
      {
        code: '010025',
        name: '尿素氮(BUN)测定试剂盒(脲酶-谷氨酸脱氢酶法)',
        spec: 'R1: 4×50ml, R2: 2×25ml',
        lotNo: 'LOT-260920B',
        expireDate: '2027-09-18',
        bookQty: 14,
        actualQty: 14,
        diffQty: 0,
        diffType: '相符',
        unit: '盒',
        price: 290.0,
        diffAmount: 0.0,
        remark: '账实相符',
      },
      {
        code: '010042',
        name: '全自动生化分析仪电解质ISE参比与稀释电极液',
        spec: '5000ml/桶',
        lotNo: 'LOT-260815E',
        expireDate: '2027-08-14',
        bookQty: 8,
        actualQty: 8,
        diffQty: 0,
        diffType: '相符',
        unit: '桶',
        price: 180.0,
        diffAmount: 0.0,
        remark: '账实相符',
      },
    ],
  },
  {
    id: 'chk-002',
    orderNo: 'N0000002',
    warehouse: '生化组库房',
    theme: '心肌酶谱与肝酶通道专项账实抽盘',
    operator: '刘浩然技师',
    operateTime: '2026-10-28 10:10:10',
    auditor: '李晓红副主任技师',
    auditTime: '2026-10-28 14:30:00',
    status: '审核',
    matchRate: 100.0,
    netDiffAmount: 0.0,
    totalBookQty: 38,
    totalActualQty: 38,
    items: [
      {
        code: '010012',
        name: '丙氨酸氨基转移酶(ALT)测定试剂盒(IFCC速率法)',
        spec: 'R1: 4×60ml, R2: 4×20ml',
        lotNo: 'LOT-261015A',
        expireDate: '2027-10-14',
        bookQty: 15,
        actualQty: 15,
        diffQty: 0,
        diffType: '相符',
        unit: '盒',
        price: 380.0,
        diffAmount: 0.0,
        remark: '账实相符，冷链标签完整',
      },
      {
        code: '010035',
        name: '肌酸激酶同工酶(CK-MB)测定试剂盒(免疫抑制法)',
        spec: '2×50ml/盒',
        lotNo: 'LOT-261005A',
        expireDate: '2027-10-04',
        bookQty: 12,
        actualQty: 12,
        diffQty: 0,
        diffType: '相符',
        unit: '盒',
        price: 480.0,
        diffAmount: 0.0,
        remark: '账实相符，在架无损',
      },
      {
        code: '010025',
        name: '尿素氮(BUN)测定试剂盒(脲酶-谷氨酸脱氢酶法)',
        spec: 'R1: 4×50ml, R2: 2×25ml',
        lotNo: 'LOT-260920B',
        expireDate: '2027-09-18',
        bookQty: 11,
        actualQty: 11,
        diffQty: 0,
        diffType: '相符',
        unit: '盒',
        price: 290.0,
        diffAmount: 0.0,
        remark: '账实相符',
      },
    ],
  },
  {
    id: 'chk-001',
    orderNo: 'N0000001',
    warehouse: '生化组库房',
    theme: '电解质与肾功常规消耗品月度平账盘点',
    operator: '魏明主管检验师',
    operateTime: '2026-10-27 10:10:10',
    auditor: '郭彩霞主任医师',
    auditTime: '2026-10-27 16:20:00',
    status: '审核',
    matchRate: 66.7,
    netDiffAmount: -220.0,
    totalBookQty: 31,
    totalActualQty: 30,
    items: [
      {
        code: '010051',
        name: '总胆固醇(TC)测定试剂盒(CHOD-PAP法)',
        spec: '4×80ml/盒',
        lotNo: 'LOT-260901C',
        expireDate: '2027-09-01',
        bookQty: 10,
        actualQty: 9,
        diffQty: -1,
        diffType: '盘亏',
        unit: '盒',
        price: 220.0,
        diffAmount: -220.0,
        remark: '盘亏1盒 (急诊流水线加急测试破损报损手续滞后)',
      },
      {
        code: '010042',
        name: '全自动生化分析仪电解质ISE参比与稀释电极液',
        spec: '5000ml/桶',
        lotNo: 'LOT-260815E',
        expireDate: '2027-08-14',
        bookQty: 12,
        actualQty: 12,
        diffQty: 0,
        diffType: '相符',
        unit: '桶',
        price: 180.0,
        diffAmount: 0.0,
        remark: '账实相符',
      },
      {
        code: '010018',
        name: '肌酐(Cr)测定试剂盒(肌氨酸氧化酶法)',
        spec: 'R1: 3×70ml, R2: 3×25ml',
        lotNo: 'LOT-261002A',
        expireDate: '2027-09-30',
        bookQty: 9,
        actualQty: 9,
        diffQty: 0,
        diffType: '相符',
        unit: '盒',
        price: 420.0,
        diffAmount: 0.0,
        remark: '账实相符',
      },
    ],
  },
  {
    id: 'chk-005',
    orderNo: 'N0000005',
    warehouse: '免疫组库房',
    theme: '化学发光肿瘤标志物试剂冷库专项盘点',
    operator: '孙丽丽主管检验师',
    operateTime: '2026-10-26 15:20:00',
    auditor: '李晓红副主任技师',
    auditTime: '2026-10-26 17:10:00',
    status: '审核',
    matchRate: 100.0,
    netDiffAmount: 0.0,
    totalBookQty: 25,
    totalActualQty: 25,
    items: [
      {
        code: '020015',
        name: '甲胎蛋白(AFP)化学发光测定试剂盒',
        spec: '100测试/盒',
        lotNo: 'LOT-260910AFP',
        expireDate: '2027-08-20',
        bookQty: 15,
        actualQty: 15,
        diffQty: 0,
        diffType: '相符',
        unit: '盒',
        price: 680.0,
        diffAmount: 0.0,
        remark: '账实相符，冷藏状态完好',
      },
      {
        code: '020016',
        name: '癌胚抗原(CEA)化学发光测定试剂盒',
        spec: '100测试/盒',
        lotNo: 'LOT-260912CEA',
        expireDate: '2027-08-22',
        bookQty: 10,
        actualQty: 10,
        diffQty: 0,
        diffType: '相符',
        unit: '盒',
        price: 720.0,
        diffAmount: 0.0,
        remark: '账实相符',
      },
    ],
  },
  {
    id: 'chk-006',
    orderNo: 'N0000006',
    warehouse: '血液组库房',
    theme: '五分类血细胞分析稀释液与溶血素专项清查',
    operator: '钱宇恒技师',
    operateTime: '2026-10-25 11:00:00',
    auditor: '郭彩霞主任医师',
    auditTime: '2026-10-25 16:00:00',
    status: '审核',
    matchRate: 100.0,
    netDiffAmount: 0.0,
    totalBookQty: 42,
    totalActualQty: 42,
    items: [
      {
        code: '030008',
        name: '血细胞分析仪专用稀释液(LH-DILUENT)',
        spec: '20L/箱',
        lotNo: 'LOT-260820DL',
        expireDate: '2027-08-10',
        bookQty: 24,
        actualQty: 24,
        diffQty: 0,
        diffType: '相符',
        unit: '箱',
        price: 160.0,
        diffAmount: 0.0,
        remark: '账实相符，常温避光良好',
      },
      {
        code: '030012',
        name: '五分类溶血剂(LH-LYSE 1)',
        spec: '500ml×4支/盒',
        lotNo: 'LOT-260818LY',
        expireDate: '2027-07-28',
        bookQty: 18,
        actualQty: 18,
        diffQty: 0,
        diffType: '相符',
        unit: '盒',
        price: 340.0,
        diffAmount: 0.0,
        remark: '账实相符',
      },
    ],
  },
  {
    id: 'chk-007',
    orderNo: 'N0000007',
    warehouse: '临检组库房',
    theme: '尿液沉渣分析仪试纸条与质控品周盘点',
    operator: '张建国主任技师',
    operateTime: '2026-10-24 09:30:00',
    auditor: '郭彩霞主任医师',
    auditTime: '2026-10-24 14:00:00',
    status: '审核',
    matchRate: 100.0,
    netDiffAmount: 0.0,
    totalBookQty: 30,
    totalActualQty: 30,
    items: [
      {
        code: '040003',
        name: '尿干化学分析试纸条(11项)',
        spec: '100条/筒',
        lotNo: 'LOT-260905UR',
        expireDate: '2027-09-01',
        bookQty: 20,
        actualQty: 20,
        diffQty: 0,
        diffType: '相符',
        unit: '筒',
        price: 95.0,
        diffAmount: 0.0,
        remark: '干燥密封良好，账实一致',
      },
      {
        code: '040008',
        name: '尿沉渣质控用聚苯乙烯颗粒浓缩液',
        spec: '10ml×2支/盒',
        lotNo: 'LOT-260710QC',
        expireDate: '2027-04-15',
        bookQty: 10,
        actualQty: 10,
        diffQty: 0,
        diffType: '相符',
        unit: '盒',
        price: 450.0,
        diffAmount: 0.0,
        remark: '账实一致',
      },
    ],
  },
  {
    id: 'chk-008',
    orderNo: 'N0000008',
    warehouse: '质控专用库',
    theme: '复合质控品与校准品超低温冷冻保存盘点',
    operator: '刘浩然技师',
    operateTime: '2026-10-23 16:45:00',
    auditor: '-',
    auditTime: '-',
    status: '登记',
    matchRate: 50.0,
    netDiffAmount: -850.0,
    totalBookQty: 16,
    totalActualQty: 15,
    items: [
      {
        code: '010201',
        name: '复合生化多项室内质控品(正常水平 Level 1)',
        spec: '5ml×10支/盒',
        lotNo: 'LOT-260801QC1',
        expireDate: '2027-07-31',
        bookQty: 8,
        actualQty: 7,
        diffQty: -1,
        diffType: '盘亏',
        unit: '盒',
        price: 850.0,
        diffAmount: -850.0,
        remark: '盘亏1盒 (急诊生化室内质控失控复测紧急领用未平账)',
      },
      {
        code: '010210',
        name: '血清总胆红素/直接胆红素校准品(C.f.a.s)',
        spec: '3ml×6支/盒',
        lotNo: 'LOT-260810CAL',
        expireDate: '2027-08-09',
        bookQty: 8,
        actualQty: 8,
        diffQty: 0,
        diffType: '相符',
        unit: '盒',
        price: 1200.0,
        diffAmount: 0.0,
        remark: '账实相符',
      },
    ],
  },
  {
    id: 'chk-009',
    orderNo: 'N0000009',
    warehouse: '生化组库房',
    theme: '降血脂与血糖检测常规试剂抽检盘查',
    operator: '魏明主管检验师',
    operateTime: '2026-10-22 10:15:00',
    auditor: '李晓红副主任技师',
    auditTime: '2026-10-22 15:30:00',
    status: '审核',
    matchRate: 100.0,
    netDiffAmount: 0.0,
    totalBookQty: 26,
    totalActualQty: 26,
    items: [
      {
        code: '010052',
        name: '甘油三酯(TG)测定试剂盒(GPO-PAP法)',
        spec: '4×80ml/盒',
        lotNo: 'LOT-260912TG',
        expireDate: '2027-09-12',
        bookQty: 14,
        actualQty: 14,
        diffQty: 0,
        diffType: '相符',
        unit: '盒',
        price: 240.0,
        diffAmount: 0.0,
        remark: '账实相符',
      },
      {
        code: '010053',
        name: '葡萄糖(Glu)测定试剂盒(葡萄糖氧化酶法)',
        spec: '5×100ml/盒',
        lotNo: 'LOT-260915GLU',
        expireDate: '2027-09-15',
        bookQty: 12,
        actualQty: 12,
        diffQty: 0,
        diffType: '相符',
        unit: '盒',
        price: 190.0,
        diffAmount: 0.0,
        remark: '账实相符',
      },
    ],
  },
  {
    id: 'chk-010',
    orderNo: 'N0000010',
    warehouse: '检验科总库',
    theme: '大规格缓冲液与清洗液总库在库周盘点',
    operator: '陈康主管检验师',
    operateTime: '2026-10-21 08:50:00',
    auditor: '郭彩霞主任医师',
    auditTime: '2026-10-21 11:20:00',
    status: '审核',
    matchRate: 100.0,
    netDiffAmount: 0.0,
    totalBookQty: 50,
    totalActualQty: 50,
    items: [
      {
        code: '010042',
        name: '全自动生化分析仪电解质ISE参比与稀释电极液',
        spec: '5000ml/桶',
        lotNo: 'LOT-260815E',
        expireDate: '2027-08-14',
        bookQty: 25,
        actualQty: 25,
        diffQty: 0,
        diffType: '相符',
        unit: '桶',
        price: 180.0,
        diffAmount: 0.0,
        remark: '账实相符',
      },
      {
        code: '010043',
        name: '生化分析仪浓缩酸性清洗液(Cell Wash A)',
        spec: '2000ml/瓶',
        lotNo: 'LOT-260810CWA',
        expireDate: '2027-08-01',
        bookQty: 25,
        actualQty: 25,
        diffQty: 0,
        diffType: '相符',
        unit: '瓶',
        price: 120.0,
        diffAmount: 0.0,
        remark: '账实相符',
      },
    ],
  },
  {
    id: 'chk-011',
    orderNo: 'N0000011',
    warehouse: '生化组库房',
    theme: '急诊生化备用试剂盒中期清点',
    operator: '魏明主管检验师',
    operateTime: '2026-10-20 14:10:00',
    auditor: '-',
    auditTime: '-',
    status: '登记',
    matchRate: 100.0,
    netDiffAmount: 0.0,
    totalBookQty: 18,
    totalActualQty: 18,
    items: [
      {
        code: '010012',
        name: '丙氨酸氨基转移酶(ALT)测定试剂盒(IFCC速率法)',
        spec: 'R1: 4×60ml, R2: 4×20ml',
        lotNo: 'LOT-261015A',
        expireDate: '2027-10-14',
        bookQty: 10,
        actualQty: 10,
        diffQty: 0,
        diffType: '相符',
        unit: '盒',
        price: 380.0,
        diffAmount: 0.0,
        remark: '账实相符',
      },
      {
        code: '010013',
        name: '天门冬氨酸氨基转移酶(AST)测定试剂盒',
        spec: 'R1: 4×60ml, R2: 4×20ml',
        lotNo: 'LOT-261015B',
        expireDate: '2027-10-14',
        bookQty: 8,
        actualQty: 8,
        diffQty: 0,
        diffType: '相符',
        unit: '盒',
        price: 380.0,
        diffAmount: 0.0,
        remark: '账实相符',
      },
    ],
  },
  {
    id: 'chk-012',
    orderNo: 'N0000012',
    warehouse: '免疫组库房',
    theme: '甲状腺功能系列发光试剂例行盘点',
    operator: '孙丽丽主管检验师',
    operateTime: '2026-10-19 09:20:00',
    auditor: '李晓红副主任技师',
    auditTime: '2026-10-19 14:00:00',
    status: '审核',
    matchRate: 100.0,
    netDiffAmount: 0.0,
    totalBookQty: 22,
    totalActualQty: 22,
    items: [
      {
        code: '020021',
        name: '促甲状腺激素(TSH)测定试剂盒(电化学发光法)',
        spec: '200测试/盒',
        lotNo: 'LOT-260908TSH',
        expireDate: '2027-09-08',
        bookQty: 12,
        actualQty: 12,
        diffQty: 0,
        diffType: '相符',
        unit: '盒',
        price: 880.0,
        diffAmount: 0.0,
        remark: '账实相符',
      },
      {
        code: '020022',
        name: '游离三碘甲状腺原氨酸(FT3)测定试剂盒',
        spec: '200测试/盒',
        lotNo: 'LOT-260909FT3',
        expireDate: '2027-09-09',
        bookQty: 10,
        actualQty: 10,
        diffQty: 0,
        diffType: '相符',
        unit: '盒',
        price: 780.0,
        diffAmount: 0.0,
        remark: '账实相符',
      },
    ],
  },
];

export interface ReagentInventoryCheckManagementViewProps {
  hospitalUnit?: string;
  showNotice?: (msg: string) => void;
}

export const ReagentInventoryCheckManagementView: React.FC<ReagentInventoryCheckManagementViewProps> = ({
  hospitalUnit = '中心医院',
  showNotice = () => {},
}) => {
  // Orders list
  const [orders, setOrders] = useState<InventoryCheckOrder[]>(INITIAL_INVENTORY_ORDERS);

  // Selected Order for Master-Detail bottom view (default: N0000004)
  const [selectedOrderId, setSelectedOrderId] = useState<string>('N0000004');

  // Filters
  const [warehouseFilter, setWarehouseFilter] = useState<string>('生化库');
  const [dateRange, setDateRange] = useState<string>('2026-10-01 ~ 2026-10-31');
  const [statusFilter, setStatusFilter] = useState<string>('全部');

  // Pagination (10 records per page requested)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
  const [isRevokeModalOpen, setIsRevokeModalOpen] = useState<boolean>(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState<boolean>(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);
  const [printType, setPrintType] = useState<'record' | 'inventory'>('inventory');

  // Active targeted order for view/revoke/delete
  const [targetOrder, setTargetOrder] = useState<InventoryCheckOrder | null>(null);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // 库房筛选
      if (warehouseFilter !== '全部') {
        if (warehouseFilter === '生化库' && !order.warehouse.includes('生化')) {
          return false;
        }
        if (warehouseFilter === '免疫库' && !order.warehouse.includes('免疫')) {
          return false;
        }
        if (warehouseFilter === '血液库' && !order.warehouse.includes('血液')) {
          return false;
        }
        if (warehouseFilter === '临检库' && !order.warehouse.includes('临检')) {
          return false;
        }
        if (warehouseFilter === '质控专用库' && !order.warehouse.includes('质控')) {
          return false;
        }
        if (warehouseFilter === '检验科总库' && !order.warehouse.includes('总库')) {
          return false;
        }
      }
      // 状态筛选
      if (statusFilter !== '全部' && order.status !== statusFilter) {
        return false;
      }
      return true;
    });
  }, [orders, warehouseFilter, statusFilter]);

  // Paginated records
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredOrders.slice(start, start + pageSize);
  }, [filteredOrders, currentPage]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / pageSize));

  // Find currently selected order for master-detail view
  const currentSelectedOrder = useMemo(() => {
    const found = orders.find((o) => o.orderNo === selectedOrderId);
    return found || orders[0] || null;
  }, [orders, selectedOrderId]);

  // Counts of pending reviews
  const pendingAuditCount = useMemo(() => {
    return orders.filter((o) => o.status === '登记').length;
  }, [orders]);

  const auditedCount = useMemo(() => {
    return orders.filter((o) => o.status === '审核').length;
  }, [orders]);

  // Handle clicking a row in master table
  const handleSelectOrderRow = (order: InventoryCheckOrder) => {
    setSelectedOrderId(order.orderNo);
  };

  // Delete a draft order
  const handleDeleteDraft = (order: InventoryCheckOrder, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`确定删除草稿盘点单【${order.orderNo}】吗？`)) {
      setOrders((prev) => prev.filter((o) => o.id !== order.id));
      if (selectedOrderId === order.orderNo) {
        const remaining = orders.filter((o) => o.id !== order.id);
        if (remaining.length > 0) {
          setSelectedOrderId(remaining[0].orderNo);
        }
      }
      showNotice(`已成功删除盘点草稿单据 ${order.orderNo}`);
    }
  };

  // Open revoke modal
  const handleOpenRevoke = (order: InventoryCheckOrder, e: React.MouseEvent) => {
    e.stopPropagation();
    setTargetOrder(order);
    setIsRevokeModalOpen(true);
  };

  // Confirm revoke action
  const handleConfirmRevoke = () => {
    if (!targetOrder) return;
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === targetOrder.id) {
          return {
            ...o,
            status: '登记',
            auditor: '-',
            auditTime: '-',
          };
        }
        return o;
      })
    );
    setIsRevokeModalOpen(false);
    showNotice(`单据【${targetOrder.orderNo}】已成功撤销审核状态，回退为【登记】待复核草稿`);
  };

  // Open view modal
  const handleOpenView = (order: InventoryCheckOrder, e: React.MouseEvent) => {
    e.stopPropagation();
    setTargetOrder(order);
    setIsViewModalOpen(true);
  };

  // Open edit modal (reuses add modal prefilled or opens notification)
  const handleOpenEdit = (order: InventoryCheckOrder, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedOrderId(order.orderNo);
    showNotice(`进入盘点单【${order.orderNo}】实物核对编辑模式`);
  };

  // Handle batch audit
  const handleBatchAudit = (auditorName: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.status === '登记') {
          return {
            ...o,
            status: '审核',
            auditor: auditorName,
            auditTime: '2026-10-31 16:30:00',
          };
        }
        return o;
      })
    );
    setIsAuditModalOpen(false);
    showNotice(`批量审核成功！所有待审盘点单均已完成核准平账处理`);
  };

  // New order form states
  const [newWarehouse, setNewWarehouse] = useState<string>('生化组库房');
  const [newTheme, setNewTheme] = useState<string>('11月例行生化试剂全库账实大盘点');
  const [newOperator, setNewOperator] = useState<string>('魏明主管检验师');
  const [newItemRows, setNewItemRows] = useState<CheckItem[]>([
    {
      code: '010012',
      name: '丙氨酸氨基转移酶(ALT)测定试剂盒(IFCC速率法)',
      spec: 'R1: 4×60ml, R2: 4×20ml',
      lotNo: 'LOT-261015A',
      expireDate: '2027-10-14',
      bookQty: 18,
      actualQty: 18,
      diffQty: 0,
      diffType: '相符',
      unit: '盒',
      price: 380.0,
      diffAmount: 0.0,
      remark: '账实相符',
    },
    {
      code: '010013',
      name: '天门冬氨酸氨基转移酶(AST)测定试剂盒',
      spec: 'R1: 4×60ml, R2: 4×20ml',
      lotNo: 'LOT-261015B',
      expireDate: '2027-10-14',
      bookQty: 16,
      actualQty: 15,
      diffQty: -1,
      diffType: '盘亏',
      unit: '盒',
      price: 380.0,
      diffAmount: -380.0,
      remark: '急诊夜班应急加开未及时扫码出库',
    },
  ]);

  // Recalculate row diffs when actualQty changes
  const handleActualQtyChange = (index: number, val: number) => {
    setNewItemRows((prev) => {
      const next = [...prev];
      const row = next[index];
      const actualQty = Math.max(0, val);
      const diffQty = actualQty - row.bookQty;
      const diffType = diffQty === 0 ? '相符' : diffQty > 0 ? '盘盈' : '盘亏';
      const diffAmount = diffQty * row.price;
      next[index] = {
        ...row,
        actualQty,
        diffQty,
        diffType,
        diffAmount,
        remark: diffQty === 0 ? '账实相符' : diffQty < 0 ? `盘亏${Math.abs(diffQty)}${row.unit}` : `盘盈${diffQty}${row.unit}`,
      };
      return next;
    });
  };

  const handleAddNewCatalogItem = (reagentCode: string) => {
    const item = REAGENT_CATALOG.find((r) => r.code === reagentCode);
    if (!item) return;
    if (newItemRows.some((r) => r.code === item.code)) {
      alert('该试剂品项已存在于盘点清单中');
      return;
    }
    const newRow: CheckItem = {
      code: item.code,
      name: item.name,
      spec: item.spec,
      lotNo: item.lotNo,
      expireDate: item.expireDate,
      bookQty: item.bookQty,
      actualQty: item.bookQty,
      diffQty: 0,
      diffType: '相符',
      unit: item.unit,
      price: item.price,
      diffAmount: 0.0,
      remark: '账实相符',
    };
    setNewItemRows((prev) => [...prev, newRow]);
  };

  const handleRemoveItemRow = (index: number) => {
    setNewItemRows((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit new check order
  const handleCreateCheckOrder = (asDraft: boolean) => {
    if (newItemRows.length === 0) {
      alert('请至少添加一种盘点试剂品项');
      return;
    }
    const nextNum = orders.length + 1;
    const formattedNo = `N${String(nextNum).padStart(7, '0')}`;
    const totalBook = newItemRows.reduce((acc, cur) => acc + cur.bookQty, 0);
    const totalActual = newItemRows.reduce((acc, cur) => acc + cur.actualQty, 0);
    const matchCount = newItemRows.filter((r) => r.diffQty === 0).length;
    const matchRate = Number(((matchCount / newItemRows.length) * 100).toFixed(1));
    const netDiff = newItemRows.reduce((acc, cur) => acc + cur.diffAmount, 0);

    const newOrder: InventoryCheckOrder = {
      id: `chk-${Date.now()}`,
      orderNo: formattedNo,
      warehouse: newWarehouse,
      theme: newTheme,
      operator: newOperator,
      operateTime: '2026-10-31 11:20:00',
      auditor: asDraft ? '-' : '李晓红副主任技师',
      auditTime: asDraft ? '-' : '2026-10-31 11:30:00',
      status: asDraft ? '登记' : '审核',
      items: newItemRows,
      matchRate,
      netDiffAmount: netDiff,
      totalBookQty: totalBook,
      totalActualQty: totalActual,
    };

    setOrders((prev) => [newOrder, ...prev]);
    setSelectedOrderId(formattedNo);
    setIsAddModalOpen(false);
    showNotice(
      asDraft
        ? `新建盘点单【${formattedNo}】已暂存为【登记】状态`
        : `新建盘点单【${formattedNo}】已直接提交并完成审核平账`
    );
  };

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden text-xs">
      {/* 1. Header Bar matching image_27468240.png */}
      <div className="px-4 py-3 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg border border-blue-100 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-base font-bold text-slate-800 tracking-tight">试剂盘点管理</h1>
            <span className="text-[11px] px-2 py-0.5 rounded border border-slate-200 bg-slate-50 text-slate-600 font-medium">
              {hospitalUnit} · 月度周期盘点、实物清点与账实核销
            </span>
            {pendingAuditCount > 0 && (
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-semibold flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-600 animate-pulse" />
                待审核: {pendingAuditCount} 笔
              </span>
            )}
          </div>
        </div>

        {/* Top Right Action Buttons */}
        <div className="flex items-center gap-2">
          {/* + 新增 */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium shadow-sm transition active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>新增</span>
          </button>

          {/* 打印记录单 */}
          <button
            onClick={() => {
              setPrintType('record');
              setIsPrintModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-blue-600 text-blue-600 hover:bg-blue-50 rounded font-medium transition active:scale-95"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>打印记录单</span>
          </button>

          {/* 审核 (2) */}
          <button
            onClick={() => setIsAuditModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-blue-600 text-blue-600 hover:bg-blue-50 rounded font-medium transition active:scale-95 relative"
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>审核</span>
            {pendingAuditCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 bg-red-500 text-white text-[10px] rounded-full font-bold">
                {pendingAuditCount}
              </span>
            )}
          </button>

          {/* 打印盘点单 */}
          <button
            onClick={() => {
              setPrintType('inventory');
              setIsPrintModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-blue-600 text-blue-600 hover:bg-blue-50 rounded font-medium transition active:scale-95"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>打印盘点单</span>
          </button>
        </div>
      </div>

      {/* 2. Filter Toolbar matching image_27468240.png */}
      <div className="px-4 py-2.5 bg-slate-50/70 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex flex-wrap items-center gap-3">
          {/* 当前库房 */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-600 font-medium whitespace-nowrap">当前库房:</span>
            <div className="relative">
              <select
                value={warehouseFilter}
                onChange={(e) => {
                  setWarehouseFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="appearance-none bg-white border border-slate-300 rounded px-2.5 py-1 pr-6 text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="全部">全部库房</option>
                <option value="生化库">生化库</option>
                <option value="免疫库">免疫库</option>
                <option value="血液库">血液库</option>
                <option value="临检库">临检库</option>
                <option value="质控专用库">质控专用库</option>
                <option value="检验科总库">检验科总库</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-1.5 top-2 pointer-events-none" />
            </div>
          </div>

          {/* 编制日期 */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-600 font-medium whitespace-nowrap">编制日期:</span>
            <div className="relative flex items-center">
              <input
                type="text"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="bg-white border border-slate-300 rounded px-2.5 py-1 text-slate-800 text-xs w-48 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="2026-10-01 ~ 2026-10-31"
              />
              <CalendarCheck className="w-3.5 h-3.5 text-slate-400 absolute right-2 pointer-events-none" />
            </div>
          </div>

          {/* 状态 */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-600 font-medium whitespace-nowrap">状态:</span>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="appearance-none bg-white border border-slate-300 rounded px-2.5 py-1 pr-6 text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="全部">全部</option>
                <option value="登记">登记 (待审核)</option>
                <option value="审核">审核 (已平账)</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-1.5 top-2 pointer-events-none" />
            </div>
          </div>

          {/* 查询 & 重置 */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                setCurrentPage(1);
                showNotice('已按设定条件执行盘点记录检索');
              }}
              className="flex items-center gap-1 px-3 py-1 bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 rounded font-medium shadow-2xs transition"
            >
              <Search className="w-3 h-3" />
              <span>查询</span>
            </button>
            <button
              onClick={() => {
                setWarehouseFilter('全部');
                setDateRange('2026-10-01 ~ 2026-10-31');
                setStatusFilter('全部');
                setCurrentPage(1);
                showNotice('已重置所有检索筛选条件');
              }}
              title="重置筛选"
              className="p-1 bg-white border border-slate-300 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Info: 已选单据 & 账实相符率 */}
        <div className="flex items-center gap-2 text-slate-600 text-xs">
          <span>已选单据:</span>
          <span className="font-semibold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
            {currentSelectedOrder?.orderNo || '-'}
          </span>
          <span className="text-slate-300">|</span>
          <span>账实相符率:</span>
          <span
            className={`font-bold ${
              (currentSelectedOrder?.matchRate ?? 100) >= 100
                ? 'text-emerald-600'
                : (currentSelectedOrder?.matchRate ?? 0) >= 60
                ? 'text-amber-600'
                : 'text-rose-600'
            }`}
          >
            {currentSelectedOrder?.matchRate ?? 100}%
          </span>
        </div>
      </div>

      {/* 3. Top Master Table (盘点单主记录表) */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-white">
        <div className="flex-1 overflow-auto">
          <table className="w-full border-collapse text-left">
            <thead className="sticky top-0 bg-slate-50 text-slate-600 border-b border-slate-200 z-10 text-[11px] font-semibold select-none">
              <tr>
                <th className="py-2 px-3 text-center w-28">盘点单号</th>
                <th className="py-2 px-3 w-32">库房</th>
                <th className="py-2 px-3 w-36">操作人</th>
                <th className="py-2 px-3 w-40 text-center">操作时间</th>
                <th className="py-2 px-3 w-36">审核人</th>
                <th className="py-2 px-3 w-40 text-center">审核时间</th>
                <th className="py-2 px-3 text-center w-24">状态</th>
                <th className="py-2 px-3 text-center w-28">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 text-xs">
              {paginatedOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <Boxes className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    未找到匹配的试剂盘点记录
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((order) => {
                  const isSelected = order.orderNo === selectedOrderId;
                  return (
                    <tr
                      key={order.id}
                      onClick={() => handleSelectOrderRow(order)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-blue-50/80 ring-1 ring-inset ring-blue-300 font-medium'
                          : 'hover:bg-slate-50/80'
                      }`}
                    >
                      {/* 盘点单号 */}
                      <td className="py-2 px-3 text-center font-mono text-blue-600 font-medium">
                        {order.orderNo}
                      </td>

                      {/* 库房 */}
                      <td className="py-2 px-3 text-slate-800">{order.warehouse}</td>

                      {/* 操作人 */}
                      <td className="py-2 px-3 text-slate-800">{order.operator}</td>

                      {/* 操作时间 */}
                      <td className="py-2 px-3 text-center text-slate-500 font-mono text-[11px]">
                        {order.operateTime}
                      </td>

                      {/* 审核人 */}
                      <td className="py-2 px-3 text-slate-800">{order.auditor}</td>

                      {/* 审核时间 */}
                      <td className="py-2 px-3 text-center text-slate-500 font-mono text-[11px]">
                        {order.auditTime}
                      </td>

                      {/* 状态 (登记 vs 审核) */}
                      <td className="py-2 px-3 text-center">
                        {order.status === '登记' ? (
                          <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                            登记
                          </span>
                        ) : (
                          <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-blue-50 text-blue-600 border border-blue-200">
                            审核
                          </span>
                        )}
                      </td>

                      {/* 操作列 */}
                      <td className="py-2 px-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {order.status === '登记' ? (
                            <>
                              <button
                                onClick={(e) => handleOpenEdit(order, e)}
                                className="text-blue-600 hover:text-blue-800 hover:underline"
                              >
                                编辑
                              </button>
                              <button
                                onClick={(e) => handleDeleteDraft(order, e)}
                                className="text-rose-600 hover:text-rose-800 hover:underline"
                              >
                                删除
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={(e) => handleOpenRevoke(order, e)}
                                className="text-blue-600 hover:text-blue-800 hover:underline"
                              >
                                撤销
                              </button>
                              <button
                                onClick={(e) => handleOpenView(order, e)}
                                className="text-blue-600 hover:text-blue-800 hover:underline"
                              >
                                查看
                              </button>
                            </>
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

        {/* Master Table Footer matching image_27468240.png */}
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs shrink-0 select-none">
          <div className="flex items-center gap-2 text-blue-600 font-semibold">
            <span>合计: {filteredOrders.length} 条</span>
            <span className="text-slate-400 font-normal">|</span>
            <span className="text-slate-600 font-normal">
              (登记待核: {pendingAuditCount} 笔 · 已审平账: {auditedCount} 笔)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-slate-500">
              当前聚焦单据:{' '}
              <strong className="text-slate-900 font-mono">
                {currentSelectedOrder?.orderNo || '无'}
              </strong>
            </span>
            <span className="text-blue-600 flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              明细对比与差异
            </span>

            {/* Pagination Controls */}
            <div className="flex items-center gap-1.5 ml-2 border-l border-slate-200 pl-3 text-slate-600">
              <span className="text-slate-400 text-[11px]">10条/页</span>
              <button
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-1 rounded hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed"
                title="上一页"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-slate-800">
                {currentPage} / {totalPages}
              </span>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="p-1 rounded hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed"
                title="下一页"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Bottom Detail Table: 实盘与账面差异核对表 matching image_27468240.png */}
      <div className="border-t-2 border-blue-500/80 bg-slate-50/50 flex flex-col shrink-0 max-h-[38%] min-h-[220px]">
        {/* Detail Panel Title Bar */}
        <div className="px-4 py-2 bg-slate-100 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-600" />
            <span className="font-bold text-slate-800 text-xs">
              【{currentSelectedOrder?.orderNo || '未选中'}】实盘与账面差异核对表
            </span>
            <span className="text-slate-500 text-[11px]">
              盘点主题：{currentSelectedOrder?.theme || '常规周期性实物盘点'}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="text-slate-600">
              盘点品项: <strong className="text-slate-900">{currentSelectedOrder?.items.length || 0}</strong> 种
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-600">
              差异净额:{' '}
              <strong
                className={`font-bold font-mono ${
                  (currentSelectedOrder?.netDiffAmount ?? 0) === 0
                    ? 'text-slate-800'
                    : (currentSelectedOrder?.netDiffAmount ?? 0) < 0
                    ? 'text-rose-600'
                    : 'text-blue-600'
                }`}
              >
                {(currentSelectedOrder?.netDiffAmount ?? 0) >= 0 ? '+' : ''}
                ¥{(currentSelectedOrder?.netDiffAmount ?? 0).toFixed(2)}
              </strong>
            </span>
          </div>
        </div>

        {/* Detail Items Table */}
        <div className="flex-1 overflow-auto bg-white">
          <table className="w-full border-collapse text-left">
            <thead className="sticky top-0 bg-slate-50 text-slate-600 border-b border-slate-200 z-10 text-[11px] font-semibold select-none">
              <tr>
                <th className="py-2 px-3 text-center w-20">试剂编码</th>
                <th className="py-2 px-3 w-56">试剂名称</th>
                <th className="py-2 px-3 w-40">规格型号</th>
                <th className="py-2 px-3 w-32 font-mono">批号</th>
                <th className="py-2 px-3 w-28 text-center">有效期至</th>
                <th className="py-2 px-3 text-right w-24">账面数量</th>
                <th className="py-2 px-3 text-right w-24">实盘数量</th>
                <th className="py-2 px-3 text-center w-24">盘盈/盘亏</th>
                <th className="py-2 px-3 text-right w-24">单价</th>
                <th className="py-2 px-3 text-right w-24">差异金额</th>
                <th className="py-2 px-3 w-64">差异分析说明</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 text-xs">
              {!currentSelectedOrder || currentSelectedOrder.items.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-8 text-center text-slate-400">
                    暂无试剂明细数据
                  </td>
                </tr>
              ) : (
                currentSelectedOrder.items.map((item, idx) => (
                  <tr key={`${item.code}-${idx}`} className="hover:bg-slate-50 transition-colors">
                    {/* 试剂编码 */}
                    <td className="py-2 px-3 text-center font-mono text-slate-600 text-[11px]">
                      {item.code}
                    </td>

                    {/* 试剂名称 */}
                    <td className="py-2 px-3 font-medium text-slate-800">{item.name}</td>

                    {/* 规格型号 */}
                    <td className="py-2 px-3 text-slate-500 font-mono text-[11px]">{item.spec}</td>

                    {/* 批号 */}
                    <td className="py-2 px-3 font-mono text-slate-600 text-[11px]">{item.lotNo}</td>

                    {/* 有效期至 */}
                    <td className="py-2 px-3 text-center font-mono text-slate-600 text-[11px]">
                      {item.expireDate}
                    </td>

                    {/* 账面数量 */}
                    <td className="py-2 px-3 text-right font-medium text-slate-700">
                      {item.bookQty} <span className="text-slate-400 font-normal">{item.unit}</span>
                    </td>

                    {/* 实盘数量 */}
                    <td className="py-2 px-3 text-right font-bold text-slate-900">
                      {item.actualQty} <span className="text-slate-400 font-normal">{item.unit}</span>
                    </td>

                    {/* 盘盈/盘亏 Badge matching image_27468240.png */}
                    <td className="py-2 px-3 text-center">
                      {item.diffType === '相符' && (
                        <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          相符
                        </span>
                      )}
                      {item.diffType === '盘亏' && (
                        <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                          {item.diffQty} 盘亏
                        </span>
                      )}
                      {item.diffType === '盘盈' && (
                        <span className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                          +{item.diffQty} 盘盈
                        </span>
                      )}
                    </td>

                    {/* 单价 */}
                    <td className="py-2 px-3 text-right font-mono text-slate-600">
                      ¥{item.price.toFixed(2)}
                    </td>

                    {/* 差异金额 */}
                    <td
                      className={`py-2 px-3 text-right font-mono font-bold ${
                        item.diffAmount === 0
                          ? 'text-slate-500'
                          : item.diffAmount < 0
                          ? 'text-rose-600'
                          : 'text-blue-600'
                      }`}
                    >
                      {item.diffAmount > 0 ? '+' : ''}¥{item.diffAmount.toFixed(2)}
                    </td>

                    {/* 差异分析说明 */}
                    <td className="py-2 px-3 text-slate-600 text-[11px] truncate max-w-xs" title={item.remark}>
                      {item.remark}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MODAL 1: 新增试剂实物盘点单 ================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1 bg-blue-100 text-blue-600 rounded">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">新增试剂实物盘点单</h3>
                  <p className="text-[11px] text-slate-500">
                    实地清点试剂库存、比对账面库存、记录盈亏原因并生成调账凭证
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded hover:bg-slate-200/50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-4 flex-1">
              {/* Form Metadata */}
              <div className="grid grid-cols-3 gap-3 bg-slate-50/80 p-3 rounded-lg border border-slate-200">
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">
                    盘点单号 (系统生成)
                  </label>
                  <input
                    type="text"
                    disabled
                    value={`N${String(orders.length + 1).padStart(7, '0')}`}
                    className="w-full bg-slate-100 border border-slate-300 rounded px-2.5 py-1 font-mono text-slate-700 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">
                    盘点库房 *
                  </label>
                  <select
                    value={newWarehouse}
                    onChange={(e) => setNewWarehouse(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1 text-slate-800 text-xs focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="生化组库房">生化组库房</option>
                    <option value="免疫组库房">免疫组库房</option>
                    <option value="血液组库房">血液组库房</option>
                    <option value="临检组库房">临检组库房</option>
                    <option value="质控专用库">质控专用库</option>
                    <option value="检验科总库">检验科总库</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">
                    盘点操作人 *
                  </label>
                  <select
                    value={newOperator}
                    onChange={(e) => setNewOperator(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1 text-slate-800 text-xs focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="魏明主管检验师">魏明主管检验师</option>
                    <option value="陈康主管检验师">陈康主管检验师</option>
                    <option value="刘浩然技师">刘浩然技师</option>
                    <option value="孙丽丽主管检验师">孙丽丽主管检验师</option>
                    <option value="钱宇恒技师">钱宇恒技师</option>
                    <option value="张建国主任技师">张建国主任技师</option>
                  </select>
                </div>
                <div className="col-span-3">
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">
                    盘点主题事由 *
                  </label>
                  <input
                    type="text"
                    value={newTheme}
                    onChange={(e) => setNewTheme(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1 text-slate-800 text-xs focus:ring-1 focus:ring-blue-500"
                    placeholder="例：11月上旬急诊生化在架试剂例行账实核对"
                  />
                </div>
              </div>

              {/* Quick Add from Reagent Catalog */}
              <div className="flex items-center justify-between bg-blue-50/50 p-2.5 rounded-lg border border-blue-100">
                <div className="flex items-center gap-2">
                  <Boxes className="w-4 h-4 text-blue-600" />
                  <span className="font-semibold text-slate-800 text-xs">选择在库试剂快速盘点:</span>
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        handleAddNewCatalogItem(e.target.value);
                        e.target.value = '';
                      }
                    }}
                    className="bg-white border border-blue-300 rounded px-2 py-1 text-slate-800 text-xs focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">-- 点击选择添加待盘点试剂 --</option>
                    {REAGENT_CATALOG.map((item) => (
                      <option key={item.code} value={item.code}>
                        [{item.code}] {item.name} (账面: {item.bookQty}
                        {item.unit})
                      </option>
                    ))}
                  </select>
                </div>
                <span className="text-slate-500 text-[11px]">
                  已录入: <strong className="text-blue-600">{newItemRows.length}</strong> 项
                </span>
              </div>

              {/* Items Table in Modal */}
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full border-collapse text-left text-xs">
                  <thead className="bg-slate-100 text-slate-600 text-[11px] font-semibold">
                    <tr>
                      <th className="py-2 px-2.5 text-center w-16">编码</th>
                      <th className="py-2 px-2.5">试剂名称</th>
                      <th className="py-2 px-2.5 w-24">批号</th>
                      <th className="py-2 px-2.5 text-right w-20">账面存量</th>
                      <th className="py-2 px-2.5 text-center w-28">实盘数量</th>
                      <th className="py-2 px-2.5 text-center w-20">差异</th>
                      <th className="py-2 px-2.5 text-right w-20">差异金额</th>
                      <th className="py-2 px-2.5 w-48">差异说明</th>
                      <th className="py-2 px-2 text-center w-12">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {newItemRows.map((row, idx) => (
                      <tr key={`${row.code}-${idx}`} className="hover:bg-slate-50">
                        <td className="py-2 px-2.5 text-center font-mono text-[11px] text-slate-500">
                          {row.code}
                        </td>
                        <td className="py-2 px-2.5 font-medium text-slate-800">{row.name}</td>
                        <td className="py-2 px-2.5 font-mono text-[11px] text-slate-600">{row.lotNo}</td>
                        <td className="py-2 px-2.5 text-right text-slate-600 font-mono">
                          {row.bookQty} {row.unit}
                        </td>
                        <td className="py-1.5 px-2.5 text-center">
                          <input
                            type="number"
                            min="0"
                            value={row.actualQty}
                            onChange={(e) =>
                              handleActualQtyChange(idx, parseInt(e.target.value) || 0)
                            }
                            className="w-20 text-center font-mono font-bold bg-white border border-blue-400 rounded py-0.5 text-xs text-slate-900 focus:ring-1 focus:ring-blue-600"
                          />
                        </td>
                        <td className="py-2 px-2.5 text-center">
                          {row.diffType === '相符' && (
                            <span className="text-emerald-700 font-semibold text-[11px] bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                              相符
                            </span>
                          )}
                          {row.diffType === '盘亏' && (
                            <span className="text-rose-700 font-semibold text-[11px] bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                              {row.diffQty}
                            </span>
                          )}
                          {row.diffType === '盘盈' && (
                            <span className="text-blue-700 font-semibold text-[11px] bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                              +{row.diffQty}
                            </span>
                          )}
                        </td>
                        <td
                          className={`py-2 px-2.5 text-right font-mono font-bold ${
                            row.diffAmount === 0
                              ? 'text-slate-500'
                              : row.diffAmount < 0
                              ? 'text-rose-600'
                              : 'text-blue-600'
                          }`}
                        >
                          {row.diffAmount > 0 ? '+' : ''}¥{row.diffAmount.toFixed(2)}
                        </td>
                        <td className="py-1.5 px-2.5">
                          <input
                            type="text"
                            value={row.remark}
                            onChange={(e) => {
                              const val = e.target.value;
                              setNewItemRows((prev) => {
                                const next = [...prev];
                                next[idx].remark = val;
                                return next;
                              });
                            }}
                            className="w-full bg-white border border-slate-300 rounded px-1.5 py-0.5 text-[11px] text-slate-700 focus:ring-1 focus:ring-blue-500"
                            placeholder="填写差异核查原因"
                          />
                        </td>
                        <td className="py-2 px-2 text-center">
                          <button
                            onClick={() => handleRemoveItemRow(idx)}
                            className="text-rose-500 hover:text-rose-700"
                            title="移除"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Summary of new check */}
              <div className="flex items-center justify-between text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
                <span className="text-slate-600">
                  账实相符品项:{' '}
                  <strong className="text-emerald-600">
                    {newItemRows.filter((r) => r.diffQty === 0).length} / {newItemRows.length}
                  </strong>
                </span>
                <span className="text-slate-600">
                  差异金额合计:{' '}
                  <strong
                    className={`font-mono text-sm ${
                      newItemRows.reduce((a, b) => a + b.diffAmount, 0) < 0
                        ? 'text-rose-600'
                        : newItemRows.reduce((a, b) => a + b.diffAmount, 0) > 0
                        ? 'text-blue-600'
                        : 'text-slate-700'
                    }`}
                  >
                    ¥{newItemRows.reduce((a, b) => a + b.diffAmount, 0).toFixed(2)}
                  </strong>
                </span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-3 py-1.5 border border-slate-300 text-slate-600 hover:bg-slate-100 rounded text-xs font-medium"
              >
                取消
              </button>
              <button
                onClick={() => handleCreateCheckOrder(true)}
                className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded text-xs font-medium shadow-sm transition"
              >
                暂存为草稿 (登记)
              </button>
              <button
                onClick={() => handleCreateCheckOrder(false)}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium shadow-sm transition"
              >
                直接提交并审核平账
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: 查看盘点单详细档案与平账核对 ================= */}
      {isViewModalOpen && targetOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95">
            {/* Header */}
            <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1 bg-blue-100 text-blue-600 rounded">
                  <Eye className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">
                    试剂盘点单详情 【{targetOrder.orderNo}】
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    查看账实差异、盘点核实记录及审批平账状态
                  </p>
                </div>
              </div>
              <span
                className={`px-2.5 py-0.5 rounded text-xs font-semibold ${
                  targetOrder.status === '审核'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}
              >
                {targetOrder.status === '审核' ? '已审核平账' : '登记待审核'}
              </span>
            </div>

            {/* Content */}
            <div className="p-5 overflow-y-auto space-y-4 flex-1">
              {/* Meta Grid */}
              <div className="grid grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">盘点单号:</span>
                  <span className="font-mono font-bold text-slate-900">{targetOrder.orderNo}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">库房:</span>
                  <span className="font-medium text-slate-800">{targetOrder.warehouse}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">操作人:</span>
                  <span className="font-medium text-slate-800">{targetOrder.operator}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">操作时间:</span>
                  <span className="font-mono text-slate-700">{targetOrder.operateTime}</span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px]">审核人:</span>
                  <span className="font-medium text-slate-800">{targetOrder.auditor}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">审核时间:</span>
                  <span className="font-mono text-slate-700">{targetOrder.auditTime}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">账实相符率:</span>
                  <span
                    className={`font-bold ${
                      targetOrder.matchRate >= 100
                        ? 'text-emerald-600'
                        : targetOrder.matchRate >= 60
                        ? 'text-amber-600'
                        : 'text-rose-600'
                    }`}
                  >
                    {targetOrder.matchRate}%
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">差异金额净额:</span>
                  <span
                    className={`font-mono font-bold ${
                      targetOrder.netDiffAmount === 0
                        ? 'text-slate-700'
                        : targetOrder.netDiffAmount < 0
                        ? 'text-rose-600'
                        : 'text-blue-600'
                    }`}
                  >
                    ¥{targetOrder.netDiffAmount.toFixed(2)}
                  </span>
                </div>

                <div className="col-span-4 border-t border-slate-200/80 pt-2 mt-1">
                  <span className="text-slate-400 block text-[11px]">盘点主题与事由说明:</span>
                  <span className="text-slate-800 font-medium">{targetOrder.theme}</span>
                </div>
              </div>

              {/* Items List */}
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <div className="px-3 py-2 bg-slate-100/70 border-b border-slate-200 font-semibold text-slate-700 flex justify-between items-center text-xs">
                  <span>实盘与账面差异核对明细</span>
                  <span className="text-slate-500 font-normal text-[11px]">
                    共 {targetOrder.items.length} 种试剂品项
                  </span>
                </div>
                <table className="w-full border-collapse text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 text-[11px] font-semibold">
                    <tr>
                      <th className="py-2 px-3 text-center">编码</th>
                      <th className="py-2 px-3">试剂品名</th>
                      <th className="py-2 px-3">规格</th>
                      <th className="py-2 px-3">批号</th>
                      <th className="py-2 px-3 text-right">账面数量</th>
                      <th className="py-2 px-3 text-right">实盘数量</th>
                      <th className="py-2 px-3 text-center">盘盈/盘亏</th>
                      <th className="py-2 px-3 text-right">单价</th>
                      <th className="py-2 px-3 text-right">差异金额</th>
                      <th className="py-2 px-3">原因分析与调账说明</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {targetOrder.items.map((it, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="py-2 px-3 text-center font-mono text-[11px] text-slate-500">
                          {it.code}
                        </td>
                        <td className="py-2 px-3 font-medium text-slate-800">{it.name}</td>
                        <td className="py-2 px-3 text-slate-500 font-mono text-[11px]">{it.spec}</td>
                        <td className="py-2 px-3 text-slate-600 font-mono text-[11px]">{it.lotNo}</td>
                        <td className="py-2 px-3 text-right font-mono">
                          {it.bookQty} {it.unit}
                        </td>
                        <td className="py-2 px-3 text-right font-bold text-slate-900 font-mono">
                          {it.actualQty} {it.unit}
                        </td>
                        <td className="py-2 px-3 text-center">
                          {it.diffType === '相符' && (
                            <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded text-[11px] border border-emerald-200">
                              相符
                            </span>
                          )}
                          {it.diffType === '盘亏' && (
                            <span className="text-rose-700 font-semibold bg-rose-50 px-2 py-0.5 rounded text-[11px] border border-rose-200">
                              {it.diffQty} 盘亏
                            </span>
                          )}
                          {it.diffType === '盘盈' && (
                            <span className="text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded text-[11px] border border-blue-200">
                              +{it.diffQty} 盘盈
                            </span>
                          )}
                        </td>
                        <td className="py-2 px-3 text-right font-mono text-slate-600">
                          ¥{it.price.toFixed(2)}
                        </td>
                        <td
                          className={`py-2 px-3 text-right font-mono font-bold ${
                            it.diffAmount === 0
                              ? 'text-slate-500'
                              : it.diffAmount < 0
                              ? 'text-rose-600'
                              : 'text-blue-600'
                          }`}
                        >
                          {it.diffAmount > 0 ? '+' : ''}¥{it.diffAmount.toFixed(2)}
                        </td>
                        <td className="py-2 px-3 text-slate-600 text-[11px]">{it.remark}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <span className="text-slate-500 text-[11px]">
                单据归档：华西医科大学附属医院检验科 · 耗材周期盘点档案
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="px-3.5 py-1.5 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded text-xs font-medium"
                >
                  关闭
                </button>
                <button
                  onClick={() => {
                    setIsViewModalOpen(false);
                    setPrintType('inventory');
                    setIsPrintModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>打印盘点单</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 3: 撤销审核确认 ================= */}
      {isRevokeModalOpen && targetOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-amber-100 text-amber-600 rounded-full">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">撤销盘点审核确认</h3>
                  <p className="text-xs text-slate-500">回退已审核状态至登记草稿</p>
                </div>
              </div>

              <div className="bg-amber-50/70 border border-amber-200 rounded-lg p-3 text-xs text-amber-900 space-y-1.5 mb-4">
                <p>
                  您确定要撤销盘点单【<strong>{targetOrder.orderNo}</strong>】的审核状态吗？
                </p>
                <p className="text-[11px] text-amber-700">
                  • 撤销后该单据将重新标记为【<strong>登记</strong>】草稿状态；
                  <br />
                  • 对应的账实差异调账凭证将被暂挂，允许重新实盘录入与复验；
                  <br />• 原审核人（{targetOrder.auditor}）及审核时间将被清空。
                </p>
              </div>

              <div className="flex items-center justify-end gap-2">
                <button
                  onClick={() => setIsRevokeModalOpen(false)}
                  className="px-3.5 py-1.5 border border-slate-300 text-slate-600 hover:bg-slate-100 rounded text-xs font-medium"
                >
                  取消
                </button>
                <button
                  onClick={handleConfirmRevoke}
                  className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded text-xs font-medium shadow-sm transition"
                >
                  确认撤销审核
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 4: 审核 (2) 待审核单据批量核准工作台 ================= */}
      {isAuditModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95">
            {/* Header */}
            <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1 bg-blue-100 text-blue-600 rounded">
                  <FileCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">
                    待审核盘点单批量核准工作台 ({pendingAuditCount} 笔)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    复核实物盘点数据与账面差异，确认账目平账调整
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAuditModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded hover:bg-slate-200/50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 overflow-y-auto space-y-4 flex-1 text-xs">
              {pendingAuditCount === 0 ? (
                <div className="py-12 text-center text-slate-400">
                  <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-500 mb-2" />
                  <p className="text-slate-700 font-medium">当前无待审核的盘点单据</p>
                  <p className="text-[11px] text-slate-400 mt-1">所有实物盘点均已完成审核与平账</p>
                </div>
              ) : (
                <>
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <table className="w-full border-collapse text-left">
                      <thead className="bg-slate-100 text-slate-600 text-[11px] font-semibold">
                        <tr>
                          <th className="py-2 px-3 text-center">单号</th>
                          <th className="py-2 px-3">库房</th>
                          <th className="py-2 px-3">操作人</th>
                          <th className="py-2 px-3">盘点主题</th>
                          <th className="py-2 px-3 text-center">品项数</th>
                          <th className="py-2 px-3 text-right">差异净额</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {orders
                          .filter((o) => o.status === '登记')
                          .map((o) => (
                            <tr key={o.id} className="hover:bg-slate-50">
                              <td className="py-2 px-3 text-center font-mono font-medium text-blue-600">
                                {o.orderNo}
                              </td>
                              <td className="py-2 px-3 text-slate-800">{o.warehouse}</td>
                              <td className="py-2 px-3 text-slate-800">{o.operator}</td>
                              <td className="py-2 px-3 text-slate-600 text-[11px] truncate max-w-xs">
                                {o.theme}
                              </td>
                              <td className="py-2 px-3 text-center font-mono">{o.items.length} 种</td>
                              <td
                                className={`py-2 px-3 text-right font-mono font-bold ${
                                  o.netDiffAmount < 0
                                    ? 'text-rose-600'
                                    : o.netDiffAmount > 0
                                    ? 'text-blue-600'
                                    : 'text-slate-600'
                                }`}
                              >
                                {o.netDiffAmount > 0 ? '+' : ''}¥{o.netDiffAmount.toFixed(2)}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Audit Reviewer selection */}
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2">
                    <label className="block text-[11px] font-medium text-slate-700">
                      审核确认人 (科室主任 / 质控主管):
                    </label>
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="auditor"
                          defaultChecked
                          value="李晓红副主任技师"
                          className="text-blue-600"
                        />
                        <span>李晓红副主任技师 (试剂质控负责人)</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="auditor"
                          value="郭彩霞主任医师"
                          className="text-blue-600"
                        />
                        <span>郭彩霞主任医师 (检验科主任)</span>
                      </label>
                    </div>
                  </div>

                  <div className="bg-blue-50/60 p-3 rounded-lg border border-blue-200 text-[11px] text-blue-900 leading-relaxed">
                    <strong>审核合规提示：</strong>
                    点击通过审核后，系统将自动把盘点实物数量同步为当前库存结存，并将差异金额生成财务对账与损耗调整凭证。
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setIsAuditModalOpen(false)}
                className="px-3.5 py-1.5 border border-slate-300 text-slate-600 hover:bg-slate-100 rounded text-xs font-medium"
              >
                取消
              </button>
              {pendingAuditCount > 0 && (
                <button
                  onClick={() => handleBatchAudit('李晓红副主任技师')}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium shadow-sm transition"
                >
                  批量核准并完成平账
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 5: 打印记录单 / 打印盘点单 凭据预览 ================= */}
      {isPrintModalOpen && currentSelectedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95">
            {/* Header */}
            <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Printer className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-800">
                  {printType === 'record'
                    ? '打印记录单 (实物盘点现场记录表)'
                    : '打印盘点单 (账实差异与盈亏调整核准单)'}
                </h3>
              </div>
              <button
                onClick={() => setIsPrintModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded hover:bg-slate-200/50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Printable Paper Canvas */}
            <div className="p-6 overflow-y-auto flex-1 bg-slate-100/60">
              <div className="bg-white p-8 rounded shadow-sm border border-slate-300 max-w-2xl mx-auto text-slate-900 font-sans space-y-4">
                {/* Hospital Header */}
                <div className="text-center border-b-2 border-slate-900 pb-3">
                  <h2 className="text-base font-bold tracking-wider text-slate-900">
                    {hospitalUnit} · 临床医学检验中心
                  </h2>
                  <h1 className="text-lg font-black tracking-widest mt-0.5">
                    {printType === 'record'
                      ? '试 剂 耗 材 实 物 清 点 记 录 凭 单'
                      : '试 剂 盘 点 账 实 差 异 核 准 平 账 单'}
                  </h1>
                  <div className="flex justify-between items-center text-[10px] text-slate-500 mt-2 font-mono">
                    <span>单据编号: {currentSelectedOrder.orderNo}</span>
                    <span>打印日期: 2026-10-31 16:45:00</span>
                    <span>
                      状态: {currentSelectedOrder.status === '审核' ? '【已审平账】' : '【草稿待核】'}
                    </span>
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs border border-slate-300 p-2.5 bg-slate-50/50">
                  <div>
                    <span className="text-slate-500">盘点库房:</span>{' '}
                    <strong className="text-slate-800">{currentSelectedOrder.warehouse}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">盘点主题:</span>{' '}
                    <strong className="text-slate-800">{currentSelectedOrder.theme}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">操作人:</span>{' '}
                    <span>{currentSelectedOrder.operator}</span> ({currentSelectedOrder.operateTime})
                  </div>
                  <div>
                    <span className="text-slate-500">审核人:</span>{' '}
                    <span>{currentSelectedOrder.auditor}</span> ({currentSelectedOrder.auditTime})
                  </div>
                </div>

                {/* Items Table */}
                <table className="w-full border-collapse text-left text-xs border border-slate-400">
                  <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-400">
                    <tr>
                      <th className="border-r border-slate-300 py-1.5 px-2 text-center w-12">#</th>
                      <th className="border-r border-slate-300 py-1.5 px-2">试剂品名</th>
                      <th className="border-r border-slate-300 py-1.5 px-2 w-28 font-mono">批号</th>
                      <th className="border-r border-slate-300 py-1.5 px-2 text-right w-16">账面数</th>
                      <th className="border-r border-slate-300 py-1.5 px-2 text-right w-16">实盘数</th>
                      <th className="border-r border-slate-300 py-1.5 px-2 text-center w-16">差异</th>
                      <th className="border-r border-slate-300 py-1.5 px-2 text-right w-20">差异金额</th>
                      <th className="py-1.5 px-2">差异原因与调账依据</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-300">
                    {currentSelectedOrder.items.map((item, i) => (
                      <tr key={i}>
                        <td className="border-r border-slate-300 py-1.5 px-2 text-center font-mono">
                          {i + 1}
                        </td>
                        <td className="border-r border-slate-300 py-1.5 px-2 font-medium">
                          {item.name}
                        </td>
                        <td className="border-r border-slate-300 py-1.5 px-2 font-mono text-[11px]">
                          {item.lotNo}
                        </td>
                        <td className="border-r border-slate-300 py-1.5 px-2 text-right font-mono">
                          {item.bookQty}
                        </td>
                        <td className="border-r border-slate-300 py-1.5 px-2 text-right font-mono font-bold">
                          {item.actualQty}
                        </td>
                        <td className="border-r border-slate-300 py-1.5 px-2 text-center font-semibold">
                          {item.diffType === '相符' ? (
                            <span className="text-emerald-700">相符</span>
                          ) : (
                            <span className="text-rose-700">{item.diffQty}</span>
                          )}
                        </td>
                        <td className="border-r border-slate-300 py-1.5 px-2 text-right font-mono font-semibold">
                          ¥{item.diffAmount.toFixed(2)}
                        </td>
                        <td className="py-1.5 px-2 text-[11px] text-slate-600">{item.remark}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Signatures */}
                <div className="pt-6 grid grid-cols-3 gap-4 text-xs text-slate-800">
                  <div>
                    <span>盘点清点人(签字):</span>
                    <div className="border-b border-slate-400 mt-6 w-36"></div>
                  </div>
                  <div>
                    <span>复核核准人(签字):</span>
                    <div className="border-b border-slate-400 mt-6 w-36"></div>
                  </div>
                  <div>
                    <span>科室主任核准(签章):</span>
                    <div className="border-b border-slate-400 mt-6 w-36"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setIsPrintModalOpen(false)}
                className="px-3.5 py-1.5 border border-slate-300 text-slate-600 hover:bg-slate-100 rounded text-xs font-medium"
              >
                关闭
              </button>
              <button
                onClick={() => {
                  showNotice('正在发送至临床网络标签与激光打印机...');
                  setTimeout(() => {
                    setIsPrintModalOpen(false);
                    showNotice('盘点凭据打印作业发送成功');
                  }, 800);
                }}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium shadow-sm transition"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>调用打印机</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
