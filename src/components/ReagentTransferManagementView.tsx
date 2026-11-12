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
  Truck,
  Thermometer,
  QrCode,
  Copy,
  FolderOpen,
} from './MenuIcon';

export interface TransferItem {
  code: string;
  name: string;
  spec: string;
  lotNo: string;
  expireDate: string;
  tempReq: string;
  stockQty: number; // 调出在库量
  unit: string;
  transferQty: number; // 调拨数量
  price: number; // 单价
  amount: number; // 金额
  reason: string; // 调拨事由
}

export interface TransferOrder {
  id: string;
  orderNo: string;
  direction: 'out' | 'in'; // 调出 | 调入
  outWarehouse: string; // 调出库房
  inWarehouse: string; // 调入库房
  desc: string; // 说明事由
  tag?: string; // 标签，如 '申领关联' | '急查应急' | '冷链特护'
  operator: string; // 操作人 (真实临床人名)
  operateTime: string; // 操作时间
  submitter: string; // 提交人 / 发送核准人
  submitTime: string; // 提交时间
  status: '登记' | '发送' | '在途' | '已入库'; // 单据状态
  tempStandard: string; // 温控运送标准，如 '2~8℃ 冷藏'
  transferType: string; // 调拨类型
  carrier?: string; // 承运方式/冷链箱号
  currentTemp?: string; // 冷链实测温度
  items: TransferItem[];
  totalPieces: number;
  totalAmount: number;
}

// 快速可选常备调拨试剂品规
const QUICK_TRANSFER_REAGENTS = [
  {
    code: '010035',
    name: '肌酸激酶同工酶(CK-MB)测定试剂盒',
    spec: '2×50ml/盒',
    lotNo: 'LOT20261005',
    expireDate: '2027-10-04',
    tempReq: '2~8℃冷藏',
    stockQty: 25,
    unit: '盒',
    price: 480.0,
    reason: '急救检验试剂快速调拨周转支援',
  },
  {
    code: '010021',
    name: '丙氨酸氨基转移酶(ALT)测定试剂盒',
    spec: '4×60ml/盒',
    lotNo: 'LOT20260910',
    expireDate: '2027-09-09',
    tempReq: '2~8℃冷藏',
    stockQty: 32,
    unit: '盒',
    price: 320.0,
    reason: '生化常规肝功ALT富余包装移交总库统一冷链保管分发',
  },
  {
    code: '010042',
    name: '电解质分析仪专用稀释缓冲液',
    spec: '5000ml/桶',
    lotNo: 'LOT20260815',
    expireDate: '2027-08-14',
    tempReq: '常温阴凉',
    stockQty: 18,
    unit: '桶',
    price: 180.0,
    reason: '生化分析仪消耗平稳，余量回库周转',
  },
  {
    code: '010051',
    name: '总胆固醇(TC)测定试剂盒',
    spec: '4×80ml/盒',
    lotNo: 'LOT20260901',
    expireDate: '2027-09-01',
    tempReq: '2~8℃冷藏',
    stockQty: 22,
    unit: '盒',
    price: 220.0,
    reason: '避免组内积压，统一回拨',
  },
  {
    code: '010022',
    name: '天门冬氨酸氨基转移酶(AST)测定试剂盒',
    spec: '4×60ml/盒',
    lotNo: 'LOT20260910',
    expireDate: '2027-09-09',
    tempReq: '2~8℃冷藏',
    stockQty: 28,
    unit: '盒',
    price: 330.0,
    reason: '肝功生化通道调配',
  },
  {
    code: '010018',
    name: '肌酐(CREA)测定试剂盒(肌氨酸氧化酶法)',
    spec: '4×60ml/盒',
    lotNo: 'LOT20260820',
    expireDate: '2027-08-19',
    tempReq: '2~8℃冷藏',
    stockQty: 30,
    unit: '盒',
    price: 260.0,
    reason: '肾功通道应急支援调剂',
  },
];

// 初始高拟真临床调拨数据（涵盖 10+ 条调出与调入记录，时间为近期 2026-10 / 2026-11）
const INITIAL_TRANSFER_ORDERS: TransferOrder[] = [
  // 调出单据 1 (严格对应截图 image_d65fc248.png 第一行 N0000004)
  {
    id: 'TR-001',
    orderNo: 'N0000004',
    direction: 'out',
    outWarehouse: '生化组库房',
    inWarehouse: '检验科总库',
    desc: '近效期生化校准品与电解质试剂富余回拨总库重新调配',
    operator: '魏明主管检验师',
    operateTime: '2026-10-30 09:40:15',
    submitter: '',
    submitTime: '',
    status: '登记',
    tempStandard: '2~8℃ 冷藏',
    transferType: '组内余量回拨',
    carrier: '院内手持智能冷链箱 TC-03',
    currentTemp: '4.2℃',
    items: [
      {
        code: '010042',
        name: '电解质分析仪专用稀释缓冲液',
        spec: '5000ml/桶',
        lotNo: 'LOT20260815',
        expireDate: '2027-08-14',
        tempReq: '常温阴凉',
        stockQty: 18,
        unit: '桶',
        transferQty: 4,
        price: 180.0,
        amount: 720.0,
        reason: '生化分析仪消耗平稳，余量回库周转',
      },
      {
        code: '010051',
        name: '总胆固醇(TC)测定试剂盒',
        spec: '4×80ml/盒',
        lotNo: 'LOT20260901',
        expireDate: '2027-09-01',
        tempReq: '2~8℃冷藏',
        stockQty: 22,
        unit: '盒',
        transferQty: 3,
        price: 220.0,
        amount: 660.0,
        reason: '避免组内积压，统一回拨',
      },
    ],
    totalPieces: 7,
    totalAmount: 1380.0,
  },
  // 调出单据 2 (严格对应截图 N0000003)
  {
    id: 'TR-002',
    orderNo: 'N0000003',
    direction: 'out',
    outWarehouse: '生化组库房',
    inWarehouse: '检验科总库',
    desc: '东院区分部急需急诊心肌酶谱与肌钙蛋白检测试剂盒应急调拨',
    tag: '申领关联',
    operator: '刘浩然技师',
    operateTime: '2026-10-29 15:20:10',
    submitter: '',
    submitTime: '',
    status: '登记',
    tempStandard: '2~8℃ 冷藏',
    transferType: '应急紧急调配',
    carrier: '院区温控冷链车 沪A-8820B',
    currentTemp: '3.9℃',
    items: [
      {
        code: '010035',
        name: '肌酸激酶同工酶(CK-MB)测定试剂盒',
        spec: '2×50ml/盒',
        lotNo: 'LOT20261005',
        expireDate: '2027-10-04',
        tempReq: '2~8℃冷藏',
        stockQty: 25,
        unit: '盒',
        transferQty: 5,
        price: 480.0,
        amount: 2400.0,
        reason: '支援东院区心血管急诊通道',
      },
    ],
    totalPieces: 5,
    totalAmount: 2400.0,
  },
  // 调出单据 3 (严格对应截图 N0000002)
  {
    id: 'TR-003',
    orderNo: 'N0000002',
    direction: 'out',
    outWarehouse: '生化组库房',
    inWarehouse: '检验科总库',
    desc: '生化常规肝功ALT/AST富余包装移交总库统一冷链保管分发',
    operator: '陈康主管检验师',
    operateTime: '2026-10-28 11:45:00',
    submitter: '李晓红副主任技师',
    submitTime: '2026-10-28 12:05:10',
    status: '发送',
    tempStandard: '2~8℃ 冷藏',
    transferType: '跨科室调拨 (日常业务调配)',
    carrier: '院内恒温转运车 B-09',
    currentTemp: '4.1℃',
    items: [
      {
        code: '010021',
        name: '丙氨酸氨基转移酶(ALT)测定试剂盒',
        spec: '4×60ml/盒',
        lotNo: 'LOT20260910',
        expireDate: '2027-09-09',
        tempReq: '2~8℃冷藏',
        stockQty: 32,
        unit: '盒',
        transferQty: 6,
        price: 320.0,
        amount: 1920.0,
        reason: '富余包装交总库统管',
      },
      {
        code: '010022',
        name: '天门冬氨酸氨基转移酶(AST)测定试剂盒',
        spec: '4×60ml/盒',
        lotNo: 'LOT20260910',
        expireDate: '2027-09-09',
        tempReq: '2~8℃冷藏',
        stockQty: 28,
        unit: '盒',
        transferQty: 6,
        price: 330.0,
        amount: 1980.0,
        reason: '富余包装交总库统管',
      },
    ],
    totalPieces: 12,
    totalAmount: 3900.0,
  },
  // 调出单据 4 (严格对应截图 N0000001)
  {
    id: 'TR-004',
    orderNo: 'N0000001',
    direction: 'out',
    outWarehouse: '生化组库房',
    inWarehouse: '检验科总库',
    desc: '生化组多余肾功试剂(肌酐/尿素)回拨总库周转',
    operator: '刘浩然技师',
    operateTime: '2026-10-27 16:50:00',
    submitter: '郭彩霞主任医师',
    submitTime: '2026-10-27 17:15:30',
    status: '发送',
    tempStandard: '2~8℃ 冷藏',
    transferType: '富余物资回拨',
    carrier: '冷链转运箱 TC-01',
    currentTemp: '4.3℃',
    items: [
      {
        code: '010018',
        name: '肌酐(CREA)测定试剂盒(肌氨酸氧化酶法)',
        spec: '4×60ml/盒',
        lotNo: 'LOT20260820',
        expireDate: '2027-08-19',
        tempReq: '2~8℃冷藏',
        stockQty: 30,
        unit: '盒',
        transferQty: 10,
        price: 260.0,
        amount: 2600.0,
        reason: '肾功通道周期性回库平衡',
      },
      {
        code: '010019',
        name: '尿素(UREA)测定试剂盒(酶动力学法)',
        spec: '4×60ml/盒',
        lotNo: 'LOT20260818',
        expireDate: '2027-08-17',
        tempReq: '2~8℃冷藏',
        stockQty: 35,
        unit: '盒',
        transferQty: 10,
        price: 210.0,
        amount: 2100.0,
        reason: '肾功通道周期性回库平衡',
      },
    ],
    totalPieces: 20,
    totalAmount: 4700.0,
  },
  // 调出单据 5 (用于填满10条分页与近期真实检验数据)
  {
    id: 'TR-005',
    orderNo: 'N0000006',
    direction: 'out',
    outWarehouse: '生化组库房',
    inWarehouse: '急诊检验科库房',
    desc: '急诊绿色通道心梗三合一检测试剂条跨科室紧急支援',
    tag: '急查应急',
    operator: '魏明主管检验师',
    operateTime: '2026-10-25 20:30:00',
    submitter: '李晓红副主任技师',
    submitTime: '2026-10-25 20:45:00',
    status: '已入库',
    tempStandard: '2~8℃ 冷藏',
    transferType: '应急紧急调配',
    carrier: '手提温控箱 EP-02',
    currentTemp: '4.0℃',
    items: [
      {
        code: '010041',
        name: '心肌肌钙蛋白I(cTnI)急诊测定试剂条',
        spec: '25条/盒',
        lotNo: 'LOT20260905',
        expireDate: '2027-09-04',
        tempReq: '2~8℃冷藏',
        stockQty: 15,
        unit: '盒',
        transferQty: 4,
        price: 680.0,
        amount: 2720.0,
        reason: '支援夜间胸痛急诊',
      },
    ],
    totalPieces: 4,
    totalAmount: 2720.0,
  },
  // 调出单据 6
  {
    id: 'TR-006',
    orderNo: 'N0000007',
    direction: 'out',
    outWarehouse: '生化组库房',
    inWarehouse: '临检组库房',
    desc: '葡萄糖氧化酶法血糖校准品及定标液临期同院区调剂',
    operator: '钱宇恒技师',
    operateTime: '2026-10-24 10:15:00',
    submitter: '郭彩霞主任医师',
    submitTime: '2026-10-24 10:40:00',
    status: '已入库',
    tempStandard: '2~8℃ 冷藏',
    transferType: '跨科室调拨 (日常业务调配)',
    carrier: '智能冷链转运箱',
    currentTemp: '4.4℃',
    items: [
      {
        code: '010025',
        name: '葡萄糖(Glu)测定试剂盒(己糖激酶法)',
        spec: '4×60ml/盒',
        lotNo: 'LOT20260715',
        expireDate: '2027-07-14',
        tempReq: '2~8℃冷藏',
        stockQty: 20,
        unit: '盒',
        transferQty: 3,
        price: 240.0,
        amount: 720.0,
        reason: '避免近效期浪费',
      },
    ],
    totalPieces: 3,
    totalAmount: 720.0,
  },
  // 调出单据 7
  {
    id: 'TR-007',
    orderNo: 'N0000008',
    direction: 'out',
    outWarehouse: '生化组库房',
    inWarehouse: '检验科总库',
    desc: '血脂全套高密度/低密度脂蛋白胆固醇原厂包装余量集中归仓',
    operator: '陈康主管检验师',
    operateTime: '2026-10-22 14:00:00',
    submitter: '',
    submitTime: '',
    status: '登记',
    tempStandard: '2~8℃ 冷藏',
    transferType: '组内余量回拨',
    carrier: '冷链转运车 TC-06',
    currentTemp: '4.2℃',
    items: [
      {
        code: '010072',
        name: '高密度脂蛋白胆固醇(HDL-C)测定试剂盒',
        spec: '4×80ml/盒',
        lotNo: 'LOT20260810',
        expireDate: '2027-08-09',
        tempReq: '2~8℃冷藏',
        stockQty: 24,
        unit: '盒',
        transferQty: 4,
        price: 260.0,
        amount: 1040.0,
        reason: '避免组内冗余积压',
      },
    ],
    totalPieces: 4,
    totalAmount: 1040.0,
  },
  // 调出单据 8
  {
    id: 'TR-008',
    orderNo: 'N0000009',
    direction: 'out',
    outWarehouse: '生化组库房',
    inWarehouse: '南区分院检验中心',
    desc: '南区分院血红蛋白及血气生化联检定标液紧急跨院区调剂',
    tag: '冷链特护',
    operator: '孙丽丽主管检验师',
    operateTime: '2026-10-21 09:20:00',
    submitter: '李晓红副主任技师',
    submitTime: '2026-10-21 10:00:00',
    status: '已入库',
    tempStandard: '2~8℃ 冷藏车载',
    transferType: '跨院区分部物资支援',
    carrier: '专线温控车 沪B-9931C',
    currentTemp: '3.8℃',
    items: [
      {
        code: '010088',
        name: '血气生化质控电极液(多水平三级)',
        spec: '30支/盒',
        lotNo: 'LOT20260920',
        expireDate: '2027-09-19',
        tempReq: '2~8℃冷藏',
        stockQty: 10,
        unit: '盒',
        transferQty: 2,
        price: 950.0,
        amount: 1900.0,
        reason: '跨院区质量质控一致性保障',
      },
    ],
    totalPieces: 2,
    totalAmount: 1900.0,
  },
  // 调出单据 9
  {
    id: 'TR-009',
    orderNo: 'N0000010',
    direction: 'out',
    outWarehouse: '生化组库房',
    inWarehouse: '检验科总库',
    desc: '全自动生化分析仪光学探针清洗液及酸碱清洗浓缩液回拨',
    operator: '魏明主管检验师',
    operateTime: '2026-10-19 16:30:00',
    submitter: '郭彩霞主任医师',
    submitTime: '2026-10-19 17:00:00',
    status: '已入库',
    tempStandard: '常温阴凉',
    transferType: '组内余量回拨',
    carrier: '组内推车',
    currentTemp: '21.5℃',
    items: [
      {
        code: '010095',
        name: '生化分析仪碱性清洗液(Cellclean)',
        spec: '500ml×4瓶/箱',
        lotNo: 'LOT20260601',
        expireDate: '2028-05-31',
        tempReq: '常温避光',
        stockQty: 12,
        unit: '箱',
        transferQty: 2,
        price: 420.0,
        amount: 840.0,
        reason: '总库统一配发调节',
      },
    ],
    totalPieces: 2,
    totalAmount: 840.0,
  },
  // 调出单据 10
  {
    id: 'TR-010',
    orderNo: 'N0000011',
    direction: 'out',
    outWarehouse: '生化组库房',
    inWarehouse: '中心ICU急查化验室',
    desc: '重症监护室床旁乳酸检测卡及电解质试剂应急调配借调',
    tag: '急查应急',
    operator: '张建国主任技师',
    operateTime: '2026-10-18 11:10:00',
    submitter: '李晓红副主任技师',
    submitTime: '2026-10-18 11:30:00',
    status: '已入库',
    tempStandard: '2~8℃ 冷藏',
    transferType: '应急紧急调配',
    carrier: '便携冷链箱 TC-08',
    currentTemp: '4.1℃',
    items: [
      {
        code: '010103',
        name: '全血乳酸测定测试片',
        spec: '50片/盒',
        lotNo: 'LOT20260812',
        expireDate: '2027-08-11',
        tempReq: '2~8℃冷藏',
        stockQty: 16,
        unit: '盒',
        transferQty: 3,
        price: 520.0,
        amount: 1560.0,
        reason: 'ICU重度休克患者抢救急需',
      },
    ],
    totalPieces: 3,
    totalAmount: 1560.0,
  },
  // 调出单据 11 (第2页示例)
  {
    id: 'TR-011',
    orderNo: 'N0000012',
    direction: 'out',
    outWarehouse: '生化组库房',
    inWarehouse: '检验科总库',
    desc: '心肌酶谱乳酸脱氢酶(LDH)及总胆红素试剂月度调剂回库',
    operator: '刘浩然技师',
    operateTime: '2026-10-15 15:00:00',
    submitter: '郭彩霞主任医师',
    submitTime: '2026-10-15 15:30:00',
    status: '已入库',
    tempStandard: '2~8℃ 冷藏',
    transferType: '富余物资回拨',
    carrier: '冷链转运车',
    currentTemp: '4.0℃',
    items: [
      {
        code: '010065',
        name: '乳酸脱氢酶(LDH)测定试剂盒(IFCC法)',
        spec: '4×60ml/盒',
        lotNo: 'LOT20260720',
        expireDate: '2027-07-19',
        tempReq: '2~8℃冷藏',
        stockQty: 20,
        unit: '盒',
        transferQty: 4,
        price: 290.0,
        amount: 1160.0,
        reason: '规避库存积压',
      },
    ],
    totalPieces: 4,
    totalAmount: 1160.0,
  },

  // ---------------- 【调入】功能页面数据 (用户明确要求：同时调入的标签页也帮忙生成对应的功能页面) ----------------
  {
    id: 'TR-IN-001',
    orderNo: 'TI20261031-01',
    direction: 'in',
    outWarehouse: '检验科总库',
    inWarehouse: '生化组库房',
    desc: '由总库调拨的进口罗氏原装生化校准品及复合质控品',
    tag: '冷链特护',
    operator: '总库管理人员 (赵建华)',
    operateTime: '2026-10-31 08:30:00',
    submitter: '孙丽丽主管检验师',
    submitTime: '2026-10-31 09:10:00',
    status: '在途',
    tempStandard: '2~8℃ 冷藏',
    transferType: '总库按需下拨',
    carrier: '专线温控配送箱 LOT-CL09',
    currentTemp: '3.6℃',
    items: [
      {
        code: '010099',
        name: '多参数复合生化质控血清(水平1/2)',
        spec: '5ml×6支/盒',
        lotNo: 'QC20261015',
        expireDate: '2027-04-14',
        tempReq: '2~8℃冷藏',
        stockQty: 40,
        unit: '盒',
        transferQty: 6,
        price: 580.0,
        amount: 3480.0,
        reason: '生化室内质控月初换批上机准备',
      },
    ],
    totalPieces: 6,
    totalAmount: 3480.0,
  },
  {
    id: 'TR-IN-002',
    orderNo: 'TI20261030-02',
    direction: 'in',
    outWarehouse: '临检组库房',
    inWarehouse: '生化组库房',
    desc: '由临检组紧急转拨的20L大包装高纯度仪器去离子冲洗水',
    operator: '钱宇恒技师',
    operateTime: '2026-10-30 14:10:00',
    submitter: '李晓红副主任技师',
    submitTime: '2026-10-30 14:30:00',
    status: '已入库',
    tempStandard: '常温阴凉',
    transferType: '跨科室调拨 (日常业务调配)',
    carrier: '实验推车',
    currentTemp: '22.0℃',
    items: [
      {
        code: '010115',
        name: '高纯度实验仪器冲洗液(去离子纯水)',
        spec: '20L/桶',
        lotNo: 'LOT20260930',
        expireDate: '2027-09-29',
        tempReq: '常温阴凉',
        stockQty: 10,
        unit: '桶',
        transferQty: 2,
        price: 150.0,
        amount: 300.0,
        reason: '生化管路维护保养急用',
      },
    ],
    totalPieces: 2,
    totalAmount: 300.0,
  },
  {
    id: 'TR-IN-003',
    orderNo: 'TI20261028-03',
    direction: 'in',
    outWarehouse: '免疫组库房',
    inWarehouse: '生化组库房',
    desc: '免疫组调拨发光微粒子及化学发光底物液支援心血管分析',
    tag: '申领关联',
    operator: '张建国主任技师',
    operateTime: '2026-10-28 09:00:00',
    submitter: '郭彩霞主任医师',
    submitTime: '2026-10-28 09:40:00',
    status: '已入库',
    tempStandard: '2~8℃ 冷藏',
    transferType: '跨科室调拨 (日常业务调配)',
    carrier: '智能温控手提箱',
    currentTemp: '4.1℃',
    items: [
      {
        code: '010132',
        name: '化学发光增强型底物液(A+B)',
        spec: '500ml×2瓶/套',
        lotNo: 'LOT20260811',
        expireDate: '2027-08-10',
        tempReq: '2~8℃冷藏',
        stockQty: 15,
        unit: '套',
        transferQty: 3,
        price: 850.0,
        amount: 2550.0,
        reason: '满足心肌标记物检测峰值消耗',
      },
    ],
    totalPieces: 3,
    totalAmount: 2550.0,
  },
  {
    id: 'TR-IN-004',
    orderNo: 'TI20261026-04',
    direction: 'in',
    outWarehouse: '检验科总库',
    inWarehouse: '生化组库房',
    desc: '总库季度统筹下拨日立7600/罗氏Cobas 8000反应杯与搅拌浆',
    operator: '总库管理人员 (赵建华)',
    operateTime: '2026-10-26 11:20:00',
    submitter: '李晓红副主任技师',
    submitTime: '2026-10-26 11:50:00',
    status: '已入库',
    tempStandard: '常温避光',
    transferType: '总库按需下拨',
    carrier: '总库平板货车',
    currentTemp: '20.8℃',
    items: [
      {
        code: '010150',
        name: '生化分析专用比色反应杯(无荧光树脂)',
        spec: '1000个/包',
        lotNo: 'LOT20260515',
        expireDate: '2029-05-14',
        tempReq: '常温避光',
        stockQty: 50,
        unit: '包',
        transferQty: 10,
        price: 280.0,
        amount: 2800.0,
        reason: '生化流水线上机耗材季度定额补充',
      },
    ],
    totalPieces: 10,
    totalAmount: 2800.0,
  },
];

export const ReagentTransferManagementView: React.FC<{
  hospitalUnit: string;
  showNotice: (m: string) => void;
}> = ({ hospitalUnit, showNotice }) => {
  // 1. 调拨方向标签页: 'out' (调出) | 'in' (调入)
  const [activeTab, setActiveTab] = useState<'out' | 'in'>('out');

  // 2. 调拨单数据源
  const [orders, setOrders] = useState<TransferOrder[]>(INITIAL_TRANSFER_ORDERS);

  // 3. 筛选条件 (严格匹配截图 image_d65fc248.png)
  const [filterWarehouse, setFilterWarehouse] = useState<string>('生化库');
  const [filterOrderNo, setFilterOrderNo] = useState<string>('');
  const [filterDateRange, setFilterDateRange] = useState<string>('2026-10-01 ~ 2026-10-31');
  const [filterStatus, setFilterStatus] = useState<string>('全部');

  // 4. 展开行管理 (默认展开第一条 N0000004)
  const [expandedOrderIds, setExpandedOrderIds] = useState<string[]>(['TR-001', 'TR-IN-001']);
  const [selectedOrderNo, setSelectedOrderNo] = useState<string>('N0000004');

  // 5. 分页 (用户核心要求：一页帮我显示10条数据)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  // 6. 模态窗口状态
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
  const [isRevokeModalOpen, setIsRevokeModalOpen] = useState<boolean>(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);
  const [isColdChainModalOpen, setIsColdChainModalOpen] = useState<boolean>(false);
  const [isRequisitionDrawerOpen, setIsRequisitionDrawerOpen] = useState<boolean>(false);
  const [isInboundSignModalOpen, setIsInboundSignModalOpen] = useState<boolean>(false);

  // 激活的操作单据
  const [activeOrder, setActiveOrder] = useState<TransferOrder | null>(null);

  // 7. 新增调拨单表单 (严格匹配截图 image_71d60954.png)
  const [addForm, setAddForm] = useState<{
    orderNo: string;
    outWarehouse: string;
    inWarehouse: string;
    operator: string;
    transferType: string;
    tempReq: string;
    reason: string;
    items: TransferItem[];
  }>({
    orderNo: 'N0000005',
    outWarehouse: '生化组库房',
    inWarehouse: '检验科总库',
    operator: '魏明主管检验师',
    transferType: '跨科室调拨 (日常业务调配)',
    tempReq: '2~8℃ 冷藏车载',
    reason: '急救检验试剂快速调拨周转支援',
    items: [
      {
        code: '010035',
        name: '肌酸激酶同工酶(CK-MB)测定试剂盒(2×50ml/盒)',
        spec: '2×50ml/盒',
        lotNo: 'LOT20261005',
        expireDate: '2027-10-04',
        tempReq: '2~8℃冷藏',
        stockQty: 25,
        unit: '盒',
        transferQty: 4,
        price: 480.0,
        amount: 1920.0,
        reason: '急救检验试剂快速调拨周转支援',
      },
      {
        code: '010021',
        name: '丙氨酸氨基转移酶(ALT)测定试剂盒(4×60ml/盒)',
        spec: '4×60ml/盒',
        lotNo: 'LOT20260910',
        expireDate: '2027-09-09',
        tempReq: '2~8℃冷藏',
        stockQty: 32,
        unit: '盒',
        transferQty: 5,
        price: 320.0,
        amount: 1600.0,
        reason: '生化常规肝功ALT富余包装移交总库统一冷链保管分发',
      },
    ],
  });

  // 筛选后的单据列表
  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      // 区分调出或调入
      if (o.direction !== activeTab) return false;

      // 库房筛选
      if (filterWarehouse !== '全部') {
        const targetWh = activeTab === 'out' ? o.outWarehouse : o.inWarehouse;
        if (!targetWh.includes(filterWarehouse.replace('库', ''))) {
          // 放宽匹配
        }
      }

      // 单号筛选
      if (filterOrderNo.trim()) {
        const kw = filterOrderNo.trim().toLowerCase();
        if (!o.orderNo.toLowerCase().includes(kw) && !o.desc.toLowerCase().includes(kw)) {
          return false;
        }
      }

      // 状态筛选
      if (filterStatus !== '全部' && o.status !== filterStatus) {
        return false;
      }

      return true;
    });
  }, [orders, activeTab, filterWarehouse, filterOrderNo, filterStatus]);

  // 分页切片 (保证一页恰好 10 条数据)
  const totalPages = Math.ceil(filteredOrders.length / pageSize) || 1;
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredOrders.slice(start, start + pageSize);
  }, [filteredOrders, currentPage, pageSize]);

  // 统计数值 (实时计算)
  const currentTabOrders = useMemo(() => orders.filter(o => o.direction === activeTab), [orders, activeTab]);
  const statTotalCount = currentTabOrders.length;
  const statDraftCount = currentTabOrders.filter(o => o.status === '登记').length;
  const statTransitCount = currentTabOrders.filter(o => o.status === '发送' || o.status === '在途').length;
  const statCompletedCount = currentTabOrders.filter(o => o.status === '已入库').length;
  const statTotalAmount = currentTabOrders.reduce((sum, o) => sum + o.totalAmount, 0);

  // 切换行展开折叠
  const toggleExpand = (id: string) => {
    setExpandedOrderIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // 快捷从常备在库试剂中追加进拟调拨清单 (新增弹窗)
  const handleAddStockReagent = (reagent: (typeof QUICK_TRANSFER_REAGENTS)[0]) => {
    const existingIndex = addForm.items.findIndex(it => it.code === reagent.code);
    if (existingIndex >= 0) {
      // 已存在则数量+1
      const updated = [...addForm.items];
      updated[existingIndex].transferQty += 1;
      updated[existingIndex].amount = updated[existingIndex].transferQty * updated[existingIndex].price;
      setAddForm({ ...addForm, items: updated });
      showNotice(`已递增【${reagent.name}】调拨数量为 ${updated[existingIndex].transferQty} ${reagent.unit}`);
    } else {
      const newItem: TransferItem = {
        code: reagent.code,
        name: reagent.name,
        spec: reagent.spec,
        lotNo: reagent.lotNo,
        expireDate: reagent.expireDate,
        tempReq: reagent.tempReq,
        stockQty: reagent.stockQty,
        unit: reagent.unit,
        transferQty: 1,
        price: reagent.price,
        amount: reagent.price,
        reason: reagent.reason,
      };
      setAddForm({ ...addForm, items: [...addForm.items, newItem] });
      showNotice(`已将【${reagent.name}】添加到拟调拨清单`);
    }
  };

  // 动态修改拟调拨数量
  const handleItemQtyChange = (code: string, newQty: number) => {
    const safeQty = Math.max(1, newQty);
    const updated = addForm.items.map(it => {
      if (it.code === code) {
        return {
          ...it,
          transferQty: safeQty,
          amount: safeQty * it.price,
        };
      }
      return it;
    });
    setAddForm({ ...addForm, items: updated });
  };

  // 从新增表中移除一行
  const handleRemoveItem = (code: string) => {
    const updated = addForm.items.filter(it => it.code !== code);
    setAddForm({ ...addForm, items: updated });
    showNotice('已移除该试剂调拨项');
  };

  // 计算新增表单货值合计
  const addFormTotalAmount = useMemo(() => {
    return addForm.items.reduce((sum, it) => sum + it.amount, 0);
  }, [addForm.items]);

  // 保存新增表单 (草稿登记 或 直接核准发送)
  const handleSaveTransfer = (asSubmit: boolean) => {
    if (addForm.items.length === 0) {
      showNotice('请至少添加一项拟调拨试剂品规！');
      return;
    }

    const newOrder: TransferOrder = {
      id: `TR-${Date.now()}`,
      orderNo: addForm.orderNo,
      direction: activeTab,
      outWarehouse: addForm.outWarehouse,
      inWarehouse: addForm.inWarehouse,
      desc: addForm.reason,
      operator: addForm.operator,
      operateTime: '2026-11-02 09:30:00',
      submitter: asSubmit ? '李晓红副主任技师' : '',
      submitTime: asSubmit ? '2026-11-02 09:45:00' : '',
      status: asSubmit ? '发送' : '登记',
      tempStandard: addForm.tempReq,
      transferType: addForm.transferType,
      carrier: '院内温控冷链箱 TC-05',
      currentTemp: '4.1℃',
      items: addForm.items,
      totalPieces: addForm.items.reduce((s, it) => s + it.transferQty, 0),
      totalAmount: addFormTotalAmount,
    };

    setOrders([newOrder, ...orders]);
    setIsAddModalOpen(false);
    // 自动将下一张单号自增
    const nextNum = parseInt(addForm.orderNo.replace(/\D/g, '') || '5', 10) + 1;
    setAddForm(prev => ({
      ...prev,
      orderNo: `N${String(nextNum).padStart(7, '0')}`,
    }));

    showNotice(asSubmit ? `调拨单【${newOrder.orderNo}】已核准并出库发送！` : `调拨单【${newOrder.orderNo}】已暂存为草稿！`);
  };

  // 执行撤销调拨发送 (回退至草稿登记)
  const handleConfirmRevoke = () => {
    if (!activeOrder) return;
    setOrders(prev =>
      prev.map(o => (o.id === activeOrder.id ? { ...o, status: '登记', submitter: '', submitTime: '' } : o))
    );
    setIsRevokeModalOpen(false);
    showNotice(`已成功撤销调拨单【${activeOrder.orderNo}】并回退至草稿登记！`);
  };

  // 调入签收入库操作
  const handleConfirmInboundSign = () => {
    if (!activeOrder) return;
    setOrders(prev =>
      prev.map(o => (o.id === activeOrder.id ? { ...o, status: '已入库' } : o))
    );
    setIsInboundSignModalOpen(false);
    showNotice(`调入单据【${activeOrder.orderNo}】冷链温控核对无误，已完成清点验收入库！`);
  };

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-slate-50 text-slate-800 text-xs">
      {/* 顶部标题与操作栏 (严格匹配截图 image_d65fc248.png) */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between shadow-xs shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center font-bold">
            <Truck className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-slate-900 tracking-tight">试剂调拨管理</h1>
              <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                {hospitalUnit}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              跨专业组/跨院区应急试剂调拨、全程冷链温控监控与出入库无缝交接
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* + 新增 */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded font-medium shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>新增</span>
          </button>

          {/* 申领单 (1) 快速抽屉 */}
          <button
            onClick={() => setIsRequisitionDrawerOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded font-medium transition-colors cursor-pointer shadow-xs"
          >
            <FileText className="w-3.5 h-3.5 text-blue-600" />
            <span>申领单</span>
            <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-bold">
              1
            </span>
          </button>

          {/* 发送 */}
          <button
            onClick={() => {
              const pending = orders.find(o => o.status === '登记');
              if (pending) {
                setOrders(prev =>
                  prev.map(o => (o.id === pending.id ? { ...o, status: '发送', submitter: '李晓红副主任技师', submitTime: '2026-11-02 10:00:00' } : o))
                );
                showNotice(`调拨单【${pending.orderNo}】已通过核准并完成出库发送！`);
              } else {
                showNotice('当前暂无可发送的草稿调拨单');
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-blue-50 border border-blue-400 text-blue-600 rounded font-medium transition-colors cursor-pointer shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span>发送</span>
          </button>
        </div>
      </div>

      {/* 调拨方向标签页 + 统计摘要条 (严格匹配截图 image_d65fc248.png) */}
      <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 flex flex-wrap items-center justify-between gap-3 shrink-0">
        {/* 调出 / 调入 标签切换 */}
        <div className="flex items-center bg-slate-200/80 p-0.5 rounded border border-slate-300">
          <button
            onClick={() => {
              setActiveTab('out');
              setCurrentPage(1);
            }}
            className={`px-4 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'out'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            调出
          </button>
          <button
            onClick={() => {
              setActiveTab('in');
              setCurrentPage(1);
            }}
            className={`px-4 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'in'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            调入
          </button>
        </div>

        {/* 右侧统计信息 */}
        <div className="flex items-center gap-4 text-[11px] text-slate-600">
          <div>
            调拨单记录：<span className="font-bold text-slate-900">{statTotalCount} 单</span>
          </div>
          <div>
            待发送草稿：<span className="font-bold text-amber-600">{statDraftCount} 单</span>
          </div>
          <div>
            已发送在途：<span className="font-bold text-blue-600">{statTransitCount} 单</span>
          </div>
          <div>
            已入库接收：<span className="font-bold text-emerald-600">{statCompletedCount} 单</span>
          </div>
          <div className="border-l border-slate-300 pl-4">
            总涉调金额：
            <span className="font-bold text-emerald-700 text-xs">
              ¥ {statTotalAmount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* 筛选过滤工具条 (严格匹配截图 image_d65fc248.png) */}
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
            <option value="检验科总库">检验科总库</option>
            <option value="全部">全部库房</option>
          </select>
        </div>

        {/* 调拨单号 */}
        <div className="flex items-center gap-1.5">
          <label className="text-slate-600 font-medium">调拨单号：</label>
          <div className="relative">
            <input
              type="text"
              placeholder="请输入或扫描调拨单号"
              value={filterOrderNo}
              onChange={e => setFilterOrderNo(e.target.value)}
              className="border border-slate-300 rounded px-2.5 py-1 pr-7 bg-white text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-blue-500 w-48"
            />
            <QrCode className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2" />
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
            <option value="在途">在途</option>
            <option value="已入库">已入库</option>
          </select>
        </div>

        {/* 查询 & 重置 */}
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={() => showNotice('已根据所选库房与条件刷新调拨记录')}
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

      {/* 主表格内容区 (每页恰好 10 条数据，支持 调出/调入 双向视图) */}
      <div className="flex-1 overflow-auto bg-white p-3">
        <div className="border border-slate-200 rounded overflow-hidden shadow-xs">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 select-none">
                <th className="py-2.5 px-3 w-8 text-center">#</th>
                <th className="py-2.5 px-3">调拨单号</th>
                <th className="py-2.5 px-3">{activeTab === 'out' ? '调出库房' : '来自出库方'}</th>
                <th className="py-2.5 px-3">{activeTab === 'out' ? '调入库房' : '当前调入方'}</th>
                <th className="py-2.5 px-3">说明</th>
                <th className="py-2.5 px-3">操作人</th>
                <th className="py-2.5 px-3">操作时间</th>
                <th className="py-2.5 px-3">{activeTab === 'out' ? '提交/核准人' : '发货经办人'}</th>
                <th className="py-2.5 px-3">提交时间</th>
                <th className="py-2.5 px-3 text-center">状态</th>
                <th className="py-2.5 px-3 text-center">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {paginatedOrders.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-400">
                    <FolderOpen className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    暂无符合条件的调拨单记录
                  </td>
                </tr>
              ) : (
                paginatedOrders.map(order => {
                  const isExpanded = expandedOrderIds.includes(order.id);
                  const isSelected = selectedOrderNo === order.orderNo;

                  return (
                    <React.Fragment key={order.id}>
                      <tr
                        onClick={() => setSelectedOrderNo(order.orderNo)}
                        className={`hover:bg-blue-50/40 transition-colors cursor-pointer ${
                          isSelected ? 'bg-blue-50/60 font-medium' : ''
                        }`}
                      >
                        {/* 展开/收起 图标 */}
                        <td
                          className="py-2.5 px-3 text-center text-slate-400 hover:text-blue-600"
                          onClick={e => {
                            e.stopPropagation();
                            toggleExpand(order.id);
                          }}
                        >
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4 text-blue-600 inline-block" />
                          ) : (
                            <ChevronRight className="w-4 h-4 inline-block" />
                          )}
                        </td>

                        {/* 调拨单号 */}
                        <td className="py-2.5 px-3 font-semibold text-blue-600 hover:underline">
                          {order.orderNo}
                        </td>

                        {/* 调出库房 */}
                        <td className="py-2.5 px-3">{order.outWarehouse}</td>

                        {/* 调入库房 */}
                        <td className="py-2.5 px-3">{order.inWarehouse}</td>

                        {/* 说明 */}
                        <td className="py-2.5 px-3 max-w-xs truncate" title={order.desc}>
                          <div className="flex items-center gap-1.5 truncate">
                            {order.tag && (
                              <span
                                className={`shrink-0 px-1.5 py-0.2 rounded text-[10px] font-bold ${
                                  order.tag === '申领关联'
                                    ? 'bg-purple-100 text-purple-700 border border-purple-200'
                                    : order.tag === '急查应急'
                                    ? 'bg-rose-100 text-rose-700 border border-rose-200'
                                    : 'bg-cyan-100 text-cyan-800 border border-cyan-200'
                                }`}
                              >
                                {order.tag}
                              </span>
                            )}
                            <span className="truncate">{order.desc}</span>
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

                        {/* 状态徽章 (登记: 橙色，发送: 蓝色，在途: 青色，已入库: 绿色) */}
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
                          {order.status === '在途' && (
                            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-cyan-50 text-cyan-700 border border-cyan-300">
                              在途
                            </span>
                          )}
                          {order.status === '已入库' && (
                            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-300">
                              已入库
                            </span>
                          )}
                        </td>

                        {/* 操作动作 */}
                        <td className="py-2.5 px-3 text-center whitespace-nowrap" onClick={e => e.stopPropagation()}>
                          <div className="flex items-center justify-center gap-1.5">
                            {/* 登记草稿态 */}
                            {order.status === '登记' && (
                              <>
                                <button
                                  onClick={() => {
                                    setActiveOrder(order);
                                    showNotice(`正在编辑草稿调拨单【${order.orderNo}】`);
                                  }}
                                  className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                                >
                                  编辑
                                </button>
                                <button
                                  onClick={() => {
                                    setOrders(prev => prev.filter(o => o.id !== order.id));
                                    showNotice(`草稿调拨单【${order.orderNo}】已删除`);
                                  }}
                                  className="text-rose-600 hover:text-rose-800 hover:underline cursor-pointer"
                                >
                                  删除
                                </button>
                                <button
                                  onClick={() => {
                                    setOrders(prev =>
                                      prev.map(o => (o.id === order.id ? { ...o, status: '发送', submitter: '李晓红副主任技师', submitTime: '2026-11-02 10:15:00' } : o))
                                    );
                                    showNotice(`调拨单【${order.orderNo}】已发送出库！`);
                                  }}
                                  className="text-emerald-600 hover:text-emerald-800 hover:underline cursor-pointer font-medium"
                                >
                                  发送
                                </button>
                              </>
                            )}

                            {/* 发送/在途态 */}
                            {(order.status === '发送' || order.status === '在途') && (
                              <>
                                {activeTab === 'out' ? (
                                  <button
                                    onClick={() => {
                                      setActiveOrder(order);
                                      setIsRevokeModalOpen(true);
                                    }}
                                    className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                                  >
                                    撤销
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => {
                                      setActiveOrder(order);
                                      setIsInboundSignModalOpen(true);
                                    }}
                                    className="text-emerald-600 hover:text-emerald-800 hover:underline font-bold cursor-pointer"
                                  >
                                    清点签收
                                  </button>
                                )}
                                <button
                                  onClick={() => {
                                    setActiveOrder(order);
                                    setIsViewModalOpen(true);
                                  }}
                                  className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                                >
                                  查看
                                </button>
                              </>
                            )}

                            {/* 已入库态 */}
                            {order.status === '已入库' && (
                              <button
                                onClick={() => {
                                  setActiveOrder(order);
                                  setIsViewModalOpen(true);
                                }}
                                className="text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                              >
                                查看
                              </button>
                            )}

                            {/* 复制单据 */}
                            <button
                              onClick={() => {
                                const copied: TransferOrder = {
                                  ...order,
                                  id: `TR-${Date.now()}`,
                                  orderNo: `N${String(Math.floor(Math.random() * 900000 + 100000))}`,
                                  status: '登记',
                                  submitter: '',
                                  submitTime: '',
                                  operateTime: '2026-11-02 10:30:00',
                                };
                                setOrders([copied, ...orders]);
                                showNotice(`已成功复制单据为新草稿【${copied.orderNo}】`);
                              }}
                              title="复制单据内容"
                              className="text-slate-400 hover:text-slate-700 p-0.5 rounded cursor-pointer"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>

                            {/* 打印 */}
                            <button
                              onClick={() => {
                                setActiveOrder(order);
                                setIsPrintModalOpen(true);
                              }}
                              title="打印调拨单据凭单"
                              className="text-slate-400 hover:text-slate-700 p-0.5 rounded cursor-pointer"
                            >
                              <Printer className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* 展开子行：调拨试剂明细 (严格匹配截图 image_d65fc248.png) */}
                      {isExpanded && (
                        <tr className="bg-slate-50/80 border-y border-slate-200">
                          <td colSpan={11} className="p-3">
                            <div className="bg-white border border-slate-200 rounded p-3 shadow-2xs">
                              {/* 展开顶部信息行 */}
                              <div className="flex flex-wrap items-center justify-between pb-2 mb-2 border-b border-slate-100 gap-2">
                                <div className="flex items-center gap-2">
                                  <Thermometer className="w-4 h-4 text-blue-600" />
                                  <span className="font-bold text-slate-800">
                                    调拨试剂明细 ({order.items.length} 项)
                                  </span>
                                  <span className="text-slate-400">·</span>
                                  <span className="text-slate-600">
                                    储运条件:{' '}
                                    <strong className="text-slate-900">{order.tempStandard}</strong>
                                  </span>
                                  <span className="text-slate-400">|</span>
                                  <span className="text-slate-600">
                                    总调出件数: <strong className="text-slate-900">{order.totalPieces}</strong>
                                  </span>
                                  <span className="text-slate-400">|</span>
                                  <span className="text-slate-600">
                                    总货值金额:{' '}
                                    <strong className="text-emerald-600 font-bold">
                                      ¥ {order.totalAmount.toFixed(2)}
                                    </strong>
                                  </span>
                                </div>

                                <div className="flex items-center gap-3">
                                  {/* 查看冷链运输监控 */}
                                  <button
                                    onClick={() => {
                                      setActiveOrder(order);
                                      setIsColdChainModalOpen(true);
                                    }}
                                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium hover:underline cursor-pointer"
                                  >
                                    <Truck className="w-3.5 h-3.5" />
                                    <span>查看冷链运输监控</span>
                                  </button>

                                  {/* 打印调拨单据 */}
                                  <button
                                    onClick={() => {
                                      setActiveOrder(order);
                                      setIsPrintModalOpen(true);
                                    }}
                                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium hover:underline cursor-pointer"
                                  >
                                    <Printer className="w-3.5 h-3.5" />
                                    <span>打印调拨单据</span>
                                  </button>
                                </div>
                              </div>

                              {/* 子表格 */}
                              <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs border-collapse">
                                  <thead>
                                    <tr className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                                      <th className="py-1.5 px-2">试剂编码</th>
                                      <th className="py-1.5 px-2">品名规格</th>
                                      <th className="py-1.5 px-2">生产批号</th>
                                      <th className="py-1.5 px-2">有效截止期</th>
                                      <th className="py-1.5 px-2">温控要求</th>
                                      <th className="py-1.5 px-2 text-right">调出在库量</th>
                                      <th className="py-1.5 px-2 text-right">调拨数量</th>
                                      <th className="py-1.5 px-2 text-right">单价</th>
                                      <th className="py-1.5 px-2 text-right">金额</th>
                                      <th className="py-1.5 px-2">调拨事由</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-slate-100 text-slate-700">
                                    {order.items.map((item, idx) => (
                                      <tr key={idx} className="hover:bg-slate-50/50">
                                        <td className="py-1.5 px-2 font-mono text-[11px] text-slate-500">
                                          {item.code}
                                        </td>
                                        <td className="py-1.5 px-2 font-medium text-slate-800">
                                          {item.name}
                                          <span className="text-slate-400 text-[11px] ml-1 font-normal">
                                            ({item.spec})
                                          </span>
                                        </td>
                                        <td className="py-1.5 px-2 font-mono text-blue-600 text-[11px]">
                                          {item.lotNo}
                                        </td>
                                        <td className="py-1.5 px-2 font-mono text-emerald-600 text-[11px]">
                                          {item.expireDate}
                                        </td>
                                        <td className="py-1.5 px-2 text-slate-600">{item.tempReq}</td>
                                        <td className="py-1.5 px-2 text-right text-slate-500">
                                          {item.stockQty} {item.unit}
                                        </td>
                                        <td className="py-1.5 px-2 text-right font-bold text-blue-600">
                                          {item.transferQty} {item.unit}
                                        </td>
                                        <td className="py-1.5 px-2 text-right text-slate-600">
                                          ¥{item.price.toFixed(2)}
                                        </td>
                                        <td className="py-1.5 px-2 text-right font-bold text-emerald-600">
                                          ¥{item.amount.toFixed(2)}
                                        </td>
                                        <td className="py-1.5 px-2 text-slate-500 max-w-xs truncate" title={item.reason}>
                                          {item.reason}
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
      </div>

      {/* 底部分页与状态摘要栏 (严格满足一页显示 10 条数据) */}
      <div className="bg-white border-t border-slate-200 px-4 py-2 flex flex-wrap items-center justify-between text-[11px] text-slate-600 gap-2 shrink-0">
        <div className="flex items-center gap-4">
          <span className="font-bold text-blue-700">合计：{filteredOrders.length} 条</span>
          <span className="text-slate-400">|</span>
          <span>当前筛选方向：【{activeTab === 'out' ? '调出' : '调入'}】</span>
          <span>当前库房：{filterWarehouse}</span>
          <span>制单基准时间：近期临床排班 (2026年10月~11月)</span>
        </div>

        {/* 分页控制栏 (10 条/页) */}
        <div className="flex items-center gap-2">
          <span>
            第 {currentPage} / {totalPages} 页 (共 {filteredOrders.length} 笔调拨单)
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

      {/* ==================== 模态弹窗 1：新增试剂调拨申请单 (1:1 匹配截图 image_71d60954.png) ==================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
            {/* 弹窗头部 */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded bg-blue-100 text-blue-600 flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">新增试剂调拨申请单</h2>
                  <p className="text-[11px] text-slate-500">专业组应急试剂调配或总库物资回拨调剂</p>
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
                  <label className="block text-slate-600 font-medium mb-1">调拨单号 (自动生成)</label>
                  <input
                    type="text"
                    value={addForm.orderNo}
                    disabled
                    className="w-full bg-slate-100 border border-slate-300 rounded px-3 py-1.5 text-blue-600 font-mono font-bold focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">
                    调出库房 <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={addForm.outWarehouse}
                    onChange={e => setAddForm({ ...addForm, outWarehouse: e.target.value })}
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
                    调入库房 <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={addForm.inWarehouse}
                    onChange={e => setAddForm({ ...addForm, inWarehouse: e.target.value })}
                    className="w-full border border-slate-300 rounded px-3 py-1.5 bg-white text-slate-800 focus:outline-hidden focus:border-blue-500 cursor-pointer"
                  >
                    <option value="检验科总库">检验科总库</option>
                    <option value="东院区分部急诊库房">东院区分部急诊库房</option>
                    <option value="临检组库房">临检组库房</option>
                    <option value="生化组库房">生化组库房</option>
                    <option value="南区分院检验中心">南区分院检验中心</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">
                    经办操作人 <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={addForm.operator}
                    onChange={e => setAddForm({ ...addForm, operator: e.target.value })}
                    className="w-full border border-slate-300 rounded px-3 py-1.5 bg-white text-slate-800 focus:outline-hidden focus:border-blue-500"
                  />
                </div>
              </div>

              {/* 表单第2行 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">调拨类型</label>
                  <select
                    value={addForm.transferType}
                    onChange={e => setAddForm({ ...addForm, transferType: e.target.value })}
                    className="w-full border border-slate-300 rounded px-3 py-1.5 bg-white text-slate-800 focus:outline-hidden focus:border-blue-500 cursor-pointer"
                  >
                    <option value="跨科室调拨 (日常业务调配)">跨科室调拨 (日常业务调配)</option>
                    <option value="应急紧急调配">应急紧急调配</option>
                    <option value="组内余量回拨">组内余量回拨</option>
                    <option value="跨院区分部物资支援">跨院区分部物资支援</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">冷链运送保障要求</label>
                  <select
                    value={addForm.tempReq}
                    onChange={e => setAddForm({ ...addForm, tempReq: e.target.value })}
                    className="w-full border border-slate-300 rounded px-3 py-1.5 bg-white text-slate-800 focus:outline-hidden focus:border-blue-500 cursor-pointer"
                  >
                    <option value="2~8℃ 冷藏车载">2~8℃ 冷藏车载</option>
                    <option value="2~8℃ 冷藏便携箱">2~8℃ 冷藏便携箱</option>
                    <option value="常温阴凉 (10~25℃)">常温阴凉 (10~25℃)</option>
                    <option value="-20℃ 恒温深低温箱">-20℃ 恒温深低温箱</option>
                  </select>
                </div>
              </div>

              {/* 表单第3行：调拨说明事由 */}
              <div>
                <label className="block text-slate-600 font-medium mb-1">调拨说明事由</label>
                <input
                  type="text"
                  value={addForm.reason}
                  onChange={e => setAddForm({ ...addForm, reason: e.target.value })}
                  placeholder="请输入本次调拨的临床事由或批号调拨依据"
                  className="w-full border border-slate-300 rounded px-3 py-1.5 bg-white text-slate-800 focus:outline-hidden focus:border-blue-500"
                />
              </div>

              {/* 快捷点击添加在库常备试剂品规标签 */}
              <div className="bg-slate-50 border border-slate-200 rounded p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-slate-700">快捷调入生化组在库备用试剂：</span>
                  <span className="text-slate-400 text-[11px]">点击标签直接快速追加进清单</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {QUICK_TRANSFER_REAGENTS.map(reagent => (
                    <button
                      key={reagent.code}
                      type="button"
                      onClick={() => handleAddStockReagent(reagent)}
                      className="px-2.5 py-1 rounded bg-white hover:bg-blue-50 border border-slate-300 hover:border-blue-300 text-slate-700 hover:text-blue-600 text-[11px] font-medium transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
                    >
                      <Plus className="w-3 h-3 text-blue-500" />
                      <span>{reagent.name}</span>
                      <span className="text-slate-400 text-[10px]">({reagent.stockQty}在库)</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 拟调拨试剂品规明细表格 (严格对应截图 image_71d60954.png) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-slate-800">
                    拟调拨试剂品规 ({addForm.items.length}项)
                  </h3>
                  <div className="text-emerald-700 font-bold">
                    货值金额合计：¥ {addFormTotalAmount.toFixed(2)}
                  </div>
                </div>

                <div className="border border-slate-200 rounded overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                        <th className="py-2 px-3">试剂编码</th>
                        <th className="py-2 px-3">试剂名称与规格</th>
                        <th className="py-2 px-3">批号</th>
                        <th className="py-2 px-3">有效期</th>
                        <th className="py-2 px-3 text-center">调出在库</th>
                        <th className="py-2 px-3 text-center">调拨数量</th>
                        <th className="py-2 px-3 text-right">单价</th>
                        <th className="py-2 px-3 text-right">小计</th>
                        <th className="py-2 px-3 text-center">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {addForm.items.length === 0 ? (
                        <tr>
                          <td colSpan={9} className="py-6 text-center text-slate-400">
                            暂无拟调拨试剂，请点击上方快捷标签添加
                          </td>
                        </tr>
                      ) : (
                        addForm.items.map(item => (
                          <tr key={item.code} className="hover:bg-slate-50/60">
                            <td className="py-2 px-3 font-mono text-slate-500">{item.code}</td>
                            <td className="py-2 px-3 font-medium text-slate-800">{item.name}</td>
                            <td className="py-2 px-3 font-mono text-blue-600">{item.lotNo}</td>
                            <td className="py-2 px-3 font-mono text-emerald-600">{item.expireDate}</td>
                            <td className="py-2 px-3 text-center text-slate-600">
                              {item.stockQty} {item.unit}
                            </td>
                            <td className="py-2 px-3 text-center">
                              <input
                                type="number"
                                min={1}
                                max={item.stockQty}
                                value={item.transferQty}
                                onChange={e => handleItemQtyChange(item.code, parseInt(e.target.value, 10) || 1)}
                                className="w-16 border border-slate-300 rounded px-2 py-0.5 text-center font-bold text-blue-600 focus:outline-hidden focus:border-blue-500"
                              />
                            </td>
                            <td className="py-2 px-3 text-right text-slate-600">
                              ¥ {item.price.toFixed(2)}
                            </td>
                            <td className="py-2 px-3 text-right font-bold text-emerald-600">
                              ¥ {item.amount.toFixed(2)}
                            </td>
                            <td className="py-2 px-3 text-center">
                              <button
                                type="button"
                                onClick={() => handleRemoveItem(item.code)}
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

            {/* 弹窗底部操作按钮 (严格匹配截图 image_71d60954.png) */}
            <div className="px-6 py-3 border-t border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-1.5 border border-slate-300 rounded text-slate-700 hover:bg-slate-100 font-medium transition-colors cursor-pointer"
              >
                取消
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSaveTransfer(false)}
                  className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded font-medium shadow-xs transition-colors cursor-pointer"
                >
                  暂存为草稿 (登记)
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveTransfer(true)}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium shadow-xs transition-colors cursor-pointer"
                >
                  直接核准发送
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== 模态弹窗 2：调拨单详细档案 (1:1 匹配截图 image_57ccec14.png) ==================== */}
      {isViewModalOpen && activeOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
            {/* 弹窗顶部 */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-blue-600" />
                <h2 className="text-sm font-bold text-slate-900">
                  调拨单详细档案 - {activeOrder.orderNo}
                </h2>
              </div>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-slate-200/60 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 弹窗内容 */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs">
              {/* 4 步审批流转状态指示器 (严格对应截图 image_57ccec14.png) */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <div className="text-[11px] font-semibold text-slate-600 mb-3">
                  调拨业务流转状态
                </div>
                <div className="flex items-center justify-between text-xs relative">
                  {/* Step 1 */}
                  <div className="flex items-center gap-2 z-10 bg-slate-50 pr-2">
                    <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span className="font-semibold text-emerald-800">1. 调拨制单 (已完成)</span>
                  </div>

                  <div className="flex-1 h-0.5 bg-emerald-400 mx-2" />

                  {/* Step 2 */}
                  <div className="flex items-center gap-2 z-10 bg-slate-50 px-2">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        activeOrder.status !== '登记'
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {activeOrder.status !== '登记' ? (
                        <Check className="w-3.5 h-3.5" />
                      ) : (
                        <Clock className="w-3.5 h-3.5" />
                      )}
                    </div>
                    <span
                      className={`font-semibold ${
                        activeOrder.status !== '登记' ? 'text-emerald-800' : 'text-slate-500'
                      }`}
                    >
                      2. 出库核准并发送
                    </span>
                  </div>

                  <div
                    className={`flex-1 h-0.5 mx-2 ${
                      activeOrder.status === '已入库' || activeOrder.status === '在途'
                        ? 'bg-blue-400'
                        : 'bg-slate-200'
                    }`}
                  />

                  {/* Step 3 */}
                  <div className="flex items-center gap-2 z-10 bg-slate-50 px-2">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        activeOrder.status === '已入库'
                          ? 'bg-emerald-500 text-white'
                          : activeOrder.status === '在途' || activeOrder.status === '发送'
                          ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      <Truck className="w-3 h-3" />
                    </div>
                    <span
                      className={`font-semibold ${
                        activeOrder.status === '已入库'
                          ? 'text-emerald-800'
                          : activeOrder.status === '在途' || activeOrder.status === '发送'
                          ? 'text-blue-700'
                          : 'text-slate-500'
                      }`}
                    >
                      3. 冷链运输中 (恒温监控)
                    </span>
                  </div>

                  <div
                    className={`flex-1 h-0.5 mx-2 ${
                      activeOrder.status === '已入库' ? 'bg-emerald-400' : 'bg-slate-200'
                    }`}
                  />

                  {/* Step 4 */}
                  <div className="flex items-center gap-2 z-10 bg-slate-50 pl-2">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        activeOrder.status === '已入库'
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-200 text-slate-400'
                      }`}
                    >
                      {activeOrder.status === '已入库' ? (
                        <Check className="w-3.5 h-3.5" />
                      ) : (
                        <Archive className="w-3 h-3" />
                      )}
                    </div>
                    <span
                      className={`font-semibold ${
                        activeOrder.status === '已入库' ? 'text-emerald-800' : 'text-slate-400'
                      }`}
                    >
                      4. 调入库房清点签收
                    </span>
                  </div>
                </div>
              </div>

              {/* 单据详细档案信息网格 (严格对应截图 image_57ccec14.png) */}
              <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-xs bg-slate-50/50 p-4 rounded border border-slate-100">
                <div className="flex items-center">
                  <span className="text-slate-500 w-24">调拨单号：</span>
                  <span className="font-bold text-blue-600 font-mono">{activeOrder.orderNo}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-slate-500 w-24">单据状态：</span>
                  <span className="font-semibold text-blue-600">{activeOrder.status}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-slate-500 w-24">调出库房：</span>
                  <span className="font-medium text-slate-800">{activeOrder.outWarehouse}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-slate-500 w-24">调入库房：</span>
                  <span className="font-medium text-slate-800">{activeOrder.inWarehouse}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-slate-500 w-24">制单操作人：</span>
                  <span className="font-medium text-slate-800">{activeOrder.operator}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-slate-500 w-24">制单时间：</span>
                  <span className="font-mono text-slate-700">{activeOrder.operateTime}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-slate-500 w-24">发送核准人：</span>
                  <span className="font-medium text-slate-800">{activeOrder.submitter || '-'}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-slate-500 w-24">发送时间：</span>
                  <span className="font-mono text-slate-700">{activeOrder.submitTime || '-'}</span>
                </div>
                <div className="flex items-center col-span-2">
                  <span className="text-slate-500 w-24">温控运送标准：</span>
                  <span className="font-semibold text-emerald-600">{activeOrder.tempStandard}</span>
                  {activeOrder.currentTemp && (
                    <span className="ml-3 text-slate-400">
                      (当前实测温度: <strong className="text-slate-700">{activeOrder.currentTemp}</strong>)
                    </span>
                  )}
                </div>
                <div className="flex items-center col-span-2">
                  <span className="text-slate-500 w-24">调拨说明事由：</span>
                  <span className="text-slate-800">{activeOrder.desc}</span>
                </div>
              </div>

              {/* 调拨试剂耗材清单表格 (严格匹配截图 image_57ccec14.png) */}
              <div>
                <h3 className="font-bold text-slate-800 mb-2">
                  调拨试剂耗材清单 ({activeOrder.items.length} 项)
                </h3>
                <div className="border border-slate-200 rounded overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                        <th className="py-2 px-3">编码</th>
                        <th className="py-2 px-3">品名规格</th>
                        <th className="py-2 px-3">批号</th>
                        <th className="py-2 px-3">效期</th>
                        <th className="py-2 px-3 text-center">调拨数</th>
                        <th className="py-2 px-3 text-right">单价</th>
                        <th className="py-2 px-3 text-right">小计</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {activeOrder.items.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="py-2 px-3 font-mono text-slate-500">{item.code}</td>
                          <td className="py-2 px-3 font-medium text-slate-800">
                            {item.name} ({item.spec})
                          </td>
                          <td className="py-2 px-3 font-mono text-blue-600">{item.lotNo}</td>
                          <td className="py-2 px-3 font-mono text-emerald-600">{item.expireDate}</td>
                          <td className="py-2 px-3 text-center font-bold text-blue-600">
                            {item.transferQty} {item.unit}
                          </td>
                          <td className="py-2 px-3 text-right text-slate-600">
                            ¥ {item.price.toFixed(2)}
                          </td>
                          <td className="py-2 px-3 text-right font-bold text-emerald-600">
                            ¥ {item.amount.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* 弹窗底部按钮 */}
            <div className="px-6 py-3 border-t border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setIsViewModalOpen(false);
                  setIsPrintModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-3.5 py-1.5 border border-slate-300 rounded text-slate-700 hover:bg-slate-100 font-medium transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-blue-600" />
                <span>打印调拨单据</span>
              </button>
              <button
                type="button"
                onClick={() => setIsViewModalOpen(false)}
                className="px-5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium shadow-xs transition-colors cursor-pointer"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== 模态弹窗 3：撤销调拨发送确认弹窗 ==================== */}
      {isRevokeModalOpen && activeOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl border border-slate-200 w-full max-w-md p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  确认撤销调拨单【{activeOrder.orderNo}】？
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  撤销发送后，该调拨单将从【发送/在途】状态回退至【草稿登记】状态，调拨试剂将解除出库锁定并可重新修改品规或数量。
                </p>
                <div className="mt-3 bg-slate-50 p-2.5 rounded border border-slate-200 text-[11px] text-slate-600 space-y-1">
                  <div>
                    调出库房：<strong>{activeOrder.outWarehouse}</strong>
                  </div>
                  <div>
                    调入库房：<strong>{activeOrder.inWarehouse}</strong>
                  </div>
                  <div>
                    涉调货值：<strong>¥ {activeOrder.totalAmount.toFixed(2)}</strong>
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

      {/* ==================== 模态弹窗 4：清点验收入库确认弹窗 (调入模式专用) ==================== */}
      {isInboundSignModalOpen && activeOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl border border-slate-200 w-full max-w-lg p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-slate-900">
                  确认清点调入单据【{activeOrder.orderNo}】并验收入库？
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  请核对随货冷链温度是否符合 2~8℃ 标准，确认外包装无破损、批号效期一致后签收入库。
                </p>

                <div className="mt-3 bg-emerald-50/60 p-3 rounded border border-emerald-200 text-xs space-y-1.5 text-slate-700">
                  <div className="flex justify-between">
                    <span>到达实测温度：</span>
                    <strong className="text-emerald-700 font-mono">
                      {activeOrder.currentTemp || '4.1℃ (合规)'}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span>调出库房：</span>
                    <span>{activeOrder.outWarehouse}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>签收入库房：</span>
                    <strong className="text-slate-900">{activeOrder.inWarehouse}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>试剂总件数：</span>
                    <strong className="text-blue-600">{activeOrder.totalPieces} 件</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsInboundSignModalOpen(false)}
                className="px-4 py-1.5 border border-slate-300 rounded text-slate-700 hover:bg-slate-100 font-medium transition-colors cursor-pointer"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleConfirmInboundSign}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-medium shadow-xs transition-colors cursor-pointer"
              >
                确认验收入库
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== 模态弹窗 5：冷链运输温控实时监测轨迹 ==================== */}
      {isColdChainModalOpen && activeOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl border border-slate-200 w-full max-w-2xl p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  冷链温控实时监测轨迹 - {activeOrder.orderNo}
                </h3>
              </div>
              <button
                onClick={() => setIsColdChainModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-3 bg-blue-50/60 p-3 rounded border border-blue-100">
                <div>
                  <div className="text-slate-500 text-[11px]">温控标准</div>
                  <div className="font-bold text-slate-900">{activeOrder.tempStandard}</div>
                </div>
                <div>
                  <div className="text-slate-500 text-[11px]">当前传感器读数</div>
                  <div className="font-bold text-emerald-600 font-mono text-sm">
                    {activeOrder.currentTemp || '4.1℃ (达标)'}
                  </div>
                </div>
                <div>
                  <div className="text-slate-500 text-[11px]">承运工具</div>
                  <div className="font-medium text-slate-800">{activeOrder.carrier || '院内冷链箱'}</div>
                </div>
              </div>

              {/* 轨迹时间轴 */}
              <div className="border border-slate-200 rounded p-4 space-y-3 bg-slate-50/50">
                <div className="font-semibold text-slate-800 text-[11px]">温度记录节点与状态：</div>
                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="font-mono text-slate-500">2026-10-30 09:40</span>
                    <span className="font-medium text-slate-800">出发装箱 (生化组冷库)</span>
                    <span className="font-mono text-emerald-600 font-bold ml-auto">4.3℃</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="font-mono text-slate-500">2026-10-30 09:55</span>
                    <span className="font-medium text-slate-800">院内转运途经走廊</span>
                    <span className="font-mono text-emerald-600 font-bold ml-auto">4.0℃</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    <span className="font-mono text-slate-500">2026-10-30 10:10</span>
                    <span className="font-medium text-slate-800">总库冷链交接区 (待清点)</span>
                    <span className="font-mono text-emerald-600 font-bold ml-auto">4.2℃</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setIsColdChainModalOpen(false)}
                className="px-4 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium transition-colors cursor-pointer"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== 模态弹窗 6：打印调拨单据凭单 ==================== */}
      {isPrintModalOpen && activeOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
              <div className="flex items-center gap-2">
                <Printer className="w-4 h-4 text-blue-600" />
                <h2 className="text-sm font-bold text-slate-900">打印试剂调拨出入库凭证单</h2>
              </div>
              <button
                onClick={() => setIsPrintModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-8 overflow-y-auto space-y-4 text-xs bg-white text-slate-900">
              {/* 打印抬头 */}
              <div className="text-center border-b-2 border-slate-900 pb-4">
                <h1 className="text-lg font-bold tracking-wider">{hospitalUnit} 临床检验医学中心</h1>
                <h2 className="text-base font-bold tracking-widest mt-1 text-slate-800">
                  试剂耗材调拨出库 / 验收凭单
                </h2>
                <div className="flex justify-between items-center mt-3 text-xs text-slate-600">
                  <div>调拨单号：<span className="font-mono font-bold text-slate-900">{activeOrder.orderNo}</span></div>
                  <div>打印日期：<span className="font-mono">2026-11-02 11:20:00</span></div>
                  <div>温控保障：<span className="font-bold text-slate-900">{activeOrder.tempStandard}</span></div>
                </div>
              </div>

              {/* 单据概要 */}
              <div className="grid grid-cols-2 gap-2 text-xs py-2 border-b border-slate-300">
                <div>调出库房：<strong>{activeOrder.outWarehouse}</strong></div>
                <div>调入接收方：<strong>{activeOrder.inWarehouse}</strong></div>
                <div>经办操作人：<strong>{activeOrder.operator}</strong></div>
                <div>核准审核人：<strong>{activeOrder.submitter || '检验科主任'}</strong></div>
                <div className="col-span-2">调拨事由：{activeOrder.desc}</div>
              </div>

              {/* 明细清单 */}
              <table className="w-full text-left text-xs border border-slate-400 border-collapse mt-2">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-400 font-semibold">
                    <th className="py-2 px-2 border-r border-slate-400">试剂编码</th>
                    <th className="py-2 px-2 border-r border-slate-400">试剂品名与包装规格</th>
                    <th className="py-2 px-2 border-r border-slate-400">批号</th>
                    <th className="py-2 px-2 border-r border-slate-400">有效期</th>
                    <th className="py-2 px-2 text-center border-r border-slate-400">调拨量</th>
                    <th className="py-2 px-2 text-right border-r border-slate-400">单价</th>
                    <th className="py-2 px-2 text-right">金额</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-300">
                  {activeOrder.items.map((item, i) => (
                    <tr key={i}>
                      <td className="py-2 px-2 border-r border-slate-300 font-mono">{item.code}</td>
                      <td className="py-2 px-2 border-r border-slate-300 font-medium">
                        {item.name} ({item.spec})
                      </td>
                      <td className="py-2 px-2 border-r border-slate-300 font-mono">{item.lotNo}</td>
                      <td className="py-2 px-2 border-r border-slate-300 font-mono">{item.expireDate}</td>
                      <td className="py-2 px-2 text-center border-r border-slate-300 font-bold">
                        {item.transferQty} {item.unit}
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
                      调拨总件数：{activeOrder.totalPieces} 件 / 货值总计：
                    </td>
                    <td colSpan={3} className="py-2 px-2 text-right text-sm">
                      ¥ {activeOrder.totalAmount.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* 签字盖章栏 */}
              <div className="grid grid-cols-3 gap-6 pt-6 text-xs text-slate-800">
                <div>调出经办人 (签字)：_________________</div>
                <div>冷链运输承运人 (签字)：_________________</div>
                <div>调入接收验收人 (签字)：_________________</div>
              </div>
            </div>

            <div className="px-6 py-3 border-t border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
              <span className="text-slate-500 text-[11px]">
                纸质凭证由医院检验科两方各留存一份作为出入库登账凭据
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
                    showNotice(`调拨单【${activeOrder.orderNo}】已发送至医学检验科本地激光打印机`);
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

      {/* ==================== 抽屉/弹窗 7：关联申领单快速转调拨 ==================== */}
      {isRequisitionDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-end p-0">
          <div className="bg-white h-full w-full max-w-md shadow-2xl flex flex-col animate-in slide-in-from-right">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm">待响应的临床申领单 (1)</h3>
              </div>
              <button
                onClick={() => setIsRequisitionDrawerOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 flex-1 overflow-y-auto space-y-3 text-xs">
              <div className="p-3 border border-blue-200 bg-blue-50/40 rounded-lg space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-blue-700 font-mono">REQ-20261031-09</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-rose-100 text-rose-700 font-bold border border-rose-200">
                    急查应急
                  </span>
                </div>
                <div className="text-slate-700 leading-relaxed">
                  <strong>东院区急诊检验科</strong> 申请支援：
                  急诊心肌酶谱(CK-MB/cTnI)检测试剂条 5 盒
                </div>
                <div className="text-slate-500 text-[11px]">
                  申请人：郭彩霞主任医师 · 时间：2026-10-31 08:50
                </div>
                <div className="pt-2 border-t border-blue-200 flex justify-end">
                  <button
                    onClick={() => {
                      setIsRequisitionDrawerOpen(false);
                      setIsAddModalOpen(true);
                      showNotice('已一键将该申领单信息带入调拨申请表单');
                    }}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium transition-colors cursor-pointer"
                  >
                    一键转为出库调拨单
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
