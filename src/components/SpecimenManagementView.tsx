import React, { useState, useMemo } from 'react';
import {
  Boxes,
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Printer,
  X,
  Check,
  ChevronRight,
  ChevronDown,
  Building2,
  Calendar,
  Clock,
  Layers,
  Thermometer,
  ShieldAlert,
  FileSpreadsheet,
  Download,
  Upload,
  UserCheck,
  ExternalLink,
  Save,
  Barcode,
  FolderOpen,
  Folder,
  Activity,
  Pipette,
  Archive,
  RefreshCw,
  Eye,
  Info
} from 'lucide-react';
import { UserProfile } from '../types/navigation';

export interface SpecimenRecord {
  id: string;
  slotCoord: string; // e.g. "1-1", "1-2"
  row: number; // 1-6
  col: number; // 1-8
  boxId: string; // "18CLT01ECO"
  barcode: string;
  sourceMode: '手工' | '条码' | '急查';
  specimenType: '血液' | '痰液' | '尿液' | '血清' | '脑脊液' | '胸腹水' | '拭子';
  collectionSite: string;
  collectionTime: string;
  storageTime: string;
  storageStaff: string;
  expireTime: string;
  status: '在库' | '借出中' | '待销毁';
  
  // Patient details
  patientName: string;
  gender: '男' | '女';
  age: string;
  hospitalNo: string;
  department: string;
  testOrder: string;
  diagnosis: string;
  doctor: string;
  bedNo: string;
  
  // History log
  borrower?: string;
  borrowDept?: string;
  borrowReason?: string;
  borrowDate?: string;
  expectedReturnDate?: string;
  remarks?: string;
}

export interface StorageBox {
  id: string;
  code: string;
  name: string;
  rackId: string;
  rackName: string;
  fridgeId: string;
  fridgeName: string;
  temp: string;
  rows: number;
  cols: number;
  capacity: number;
}

interface SpecimenManagementViewProps {
  user: UserProfile;
  triggerAction: (msg: string) => void;
}

// 模拟预设冻存箱与冷链容器结构
const STORAGE_BOXES: StorageBox[] = [
  {
    id: 'box-01',
    code: '18CLT01ECO',
    name: '生化质控与留样盒 01',
    rackId: 'rack-01',
    rackName: '上层一号铁架',
    fridgeId: 'fridge-01',
    fridgeName: '海尔医用低温冰箱 (-20℃)',
    temp: '-20℃',
    rows: 6,
    cols: 8,
    capacity: 48,
  },
  {
    id: 'box-02',
    code: '19CLT01ECE',
    name: '临检急查与血常规复检盒 02',
    rackId: 'rack-01',
    rackName: '上层一号铁架',
    fridgeId: 'fridge-01',
    fridgeName: '海尔医用低温冰箱 (-20℃)',
    temp: '-20℃',
    rows: 6,
    cols: 8,
    capacity: 48,
  },
  {
    id: 'box-03',
    code: '20CLT02BIO',
    name: '分子诊断及耐药菌株冻存盒 03',
    rackId: 'rack-02',
    rackName: '上层二号铁架',
    fridgeId: 'fridge-02',
    fridgeName: '赛默飞超低温冻存柜 (-86℃)',
    temp: '-86℃',
    rows: 6,
    cols: 8,
    capacity: 48,
  },
  {
    id: 'box-04',
    code: '21CLT03IMM',
    name: '免疫发光血清短期周转盒 04',
    rackId: 'rack-03',
    rackName: '中层一号铁架',
    fridgeId: 'fridge-03',
    fridgeName: '澳柯玛4℃样本冷藏柜',
    temp: '4℃',
    rows: 6,
    cols: 8,
    capacity: 48,
  },
];

// 真实的患者与标本初始库数据 (2026年10月近期日期)
const INITIAL_SPECIMENS: SpecimenRecord[] = [
  {
    id: 'spm-01',
    slotCoord: '1-1',
    row: 1,
    col: 1,
    boxId: '18CLT01ECO',
    barcode: 'BC2026102801',
    sourceMode: '手工',
    specimenType: '血液',
    collectionSite: '肘正中静脉全血',
    collectionTime: '2026-10-28 07:45',
    storageTime: '2026-10-28 09:15',
    storageStaff: '张伟 (主管检验师)',
    expireTime: '2026-11-04',
    status: '在库',
    patientName: '杜文斌',
    gender: '男',
    age: '48岁',
    hospitalNo: 'ZY00291882',
    department: '心血管内科二病区',
    testOrder: '高敏肌钙蛋白I + 心肌酶谱',
    diagnosis: '急性非ST段抬高型心肌梗死',
    doctor: '张建华 (主任医师)',
    bedNo: '16床',
    remarks: '急诊入院复测，标本外观澄清良好',
  },
  {
    id: 'spm-02',
    slotCoord: '1-2',
    row: 1,
    col: 2,
    boxId: '18CLT01ECO',
    barcode: 'BC2026102802',
    sourceMode: '条码',
    specimenType: '痰液',
    collectionSite: '深部咳痰标本',
    collectionTime: '2026-10-28 08:10',
    storageTime: '2026-10-28 09:30',
    storageStaff: '李婷 (主管检验师)',
    expireTime: '2026-11-04',
    status: '在库',
    patientName: '张秀英',
    gender: '女',
    age: '65岁',
    hospitalNo: 'ZY00291885',
    department: '呼吸重症监护室 (RICU)',
    testOrder: '痰培养 + 常见呼吸道病原靶向测序',
    diagnosis: '重症社区获得性肺炎',
    doctor: '王雪梅 (主任医师)',
    bedNo: '03床',
    remarks: '粘稠脓性痰，需留样复查药敏',
  },
  {
    id: 'spm-03',
    slotCoord: '1-3',
    row: 1,
    col: 3,
    boxId: '18CLT01ECO',
    barcode: 'BC2026102803',
    sourceMode: '条码',
    specimenType: '血液',
    collectionSite: '右侧前臂浅静脉',
    collectionTime: '2026-10-28 08:30',
    storageTime: '2026-10-28 09:40',
    storageStaff: '陈志远 (检验师)',
    expireTime: '2026-11-04',
    status: '在库',
    patientName: '李建国',
    gender: '男',
    age: '54岁',
    hospitalNo: 'ZY00291890',
    department: '消化内科',
    testOrder: '肝功能八项 + 凝血四项',
    diagnosis: '乙型肝炎肝硬化失代偿期',
    doctor: '刘洋 (副主任医师)',
    bedNo: '22床',
  },
  {
    id: 'spm-04',
    slotCoord: '1-4',
    row: 1,
    col: 4,
    boxId: '18CLT01ECO',
    barcode: 'BC2026102804',
    sourceMode: '急查',
    specimenType: '血液',
    collectionSite: '静脉全血抗凝管',
    collectionTime: '2026-10-28 08:50',
    storageTime: '2026-10-28 09:55',
    storageStaff: '王雪梅 (副主任检验师)',
    expireTime: '2026-11-04',
    status: '借出中',
    patientName: '王晓琴',
    gender: '女',
    age: '32岁',
    hospitalNo: 'MZ2026102811',
    department: '急诊抢救室',
    testOrder: 'D-二聚体定量 + 动脉血气分析',
    diagnosis: '肺动脉栓塞疑似',
    doctor: '陈明 (急诊主治)',
    bedNo: '急02床',
    borrower: '陈明 (急诊主治医师)',
    borrowDept: '急诊ICU',
    borrowReason: '急性肺栓塞溶栓后临床指标复核比对',
    borrowDate: '2026-10-29 14:00',
    expectedReturnDate: '2026-10-31',
  },
  {
    id: 'spm-05',
    slotCoord: '1-5',
    row: 1,
    col: 5,
    boxId: '18CLT01ECO',
    barcode: 'BC2026102805',
    sourceMode: '条码',
    specimenType: '血液',
    collectionSite: '静脉血清促凝管',
    collectionTime: '2026-10-28 09:10',
    storageTime: '2026-10-28 10:20',
    storageStaff: '张伟 (主管检验师)',
    expireTime: '2026-11-04',
    status: '在库',
    patientName: '赵强',
    gender: '男',
    age: '41岁',
    hospitalNo: 'ZY00291901',
    department: '肾内科一病区',
    testOrder: '肾功能五项 + 电解质全套',
    diagnosis: '慢性肾小球肾炎并高钾血症',
    doctor: '孙晓东 (副主任医师)',
    bedNo: '08床',
  },
  {
    id: 'spm-06',
    slotCoord: '1-6',
    row: 1,
    col: 6,
    boxId: '18CLT01ECO',
    barcode: 'BC2026102806',
    sourceMode: '手工',
    specimenType: '血液',
    collectionSite: '左前臂静脉血',
    collectionTime: '2026-10-28 09:30',
    storageTime: '2026-10-28 10:45',
    storageStaff: '刘洋 (检验师)',
    expireTime: '2026-11-04',
    status: '在库',
    patientName: '周德明',
    gender: '男',
    age: '72岁',
    hospitalNo: 'ZY00291912',
    department: '神经内科重症监护室',
    testOrder: '血脂四项 + 同型半胱氨酸测定',
    diagnosis: '急性缺血性脑卒中',
    doctor: '郭海平 (主治医师)',
    bedNo: '05床',
  },
  {
    id: 'spm-07',
    slotCoord: '1-7',
    row: 1,
    col: 7,
    boxId: '18CLT01ECO',
    barcode: 'BC2026102807',
    sourceMode: '条码',
    specimenType: '血液',
    collectionSite: '肘静脉全血',
    collectionTime: '2026-10-28 10:00',
    storageTime: '2026-10-28 11:15',
    storageStaff: '李婷 (主管检验师)',
    expireTime: '2026-11-04',
    status: '在库',
    patientName: '孙丽华',
    gender: '女',
    age: '59岁',
    hospitalNo: 'ZY00291925',
    department: '内分泌代谢科',
    testOrder: '空腹血糖 + 糖化血红蛋白 (HbA1c)',
    diagnosis: '2型糖尿病合并视网膜病变',
    doctor: '李建国 (主任医师)',
    bedNo: '12床',
  },
  {
    id: 'spm-08',
    slotCoord: '1-8',
    row: 1,
    col: 8,
    boxId: '18CLT01ECO',
    barcode: 'BC2026102808',
    sourceMode: '急查',
    specimenType: '尿液',
    collectionSite: '中段清洁晨尿',
    collectionTime: '2026-10-28 10:20',
    storageTime: '2026-10-28 11:30',
    storageStaff: '陈志远 (检验师)',
    expireTime: '2026-11-04',
    status: '在库',
    patientName: '黄美兰',
    gender: '女',
    age: '28岁',
    hospitalNo: 'MZ2026102834',
    department: '妇产科门诊',
    testOrder: '尿常规分析 + 尿微量白蛋白比值',
    diagnosis: '急性下尿路感染',
    doctor: '周丽娜 (主治医师)',
    bedNo: '门诊',
  },
  // Row 2
  {
    id: 'spm-09',
    slotCoord: '2-1',
    row: 2,
    col: 1,
    boxId: '18CLT01ECO',
    barcode: 'BC2026102901',
    sourceMode: '手工',
    specimenType: '血清',
    collectionSite: '无添加剂离心血清',
    collectionTime: '2026-10-29 07:50',
    storageTime: '2026-10-29 09:10',
    storageStaff: '张伟 (主管检验师)',
    expireTime: '2026-11-05',
    status: '在库',
    patientName: '钱浩',
    gender: '男',
    age: '36岁',
    hospitalNo: 'ZY00291940',
    department: '普外科二病区',
    testOrder: '乙肝五项定量 + 丙肝抗体',
    diagnosis: '急性胆囊炎术前筛查',
    doctor: '赵立峰 (主治医师)',
    bedNo: '19床',
  },
  {
    id: 'spm-10',
    slotCoord: '2-2',
    row: 2,
    col: 2,
    boxId: '18CLT01ECO',
    barcode: 'BC2026102902',
    sourceMode: '条码',
    specimenType: '痰液',
    collectionSite: '支气管镜肺泡灌洗液 (BALF)',
    collectionTime: '2026-10-29 08:15',
    storageTime: '2026-10-29 09:40',
    storageStaff: '李婷 (主管检验师)',
    expireTime: '2026-11-05',
    status: '在库',
    patientName: '许卫东',
    gender: '男',
    age: '61岁',
    hospitalNo: 'ZY00291945',
    department: '呼吸内科',
    testOrder: '灌洗液病原宏基因组 (mNGS)',
    diagnosis: '难治性肺部真菌感染',
    doctor: '张建华 (主任医师)',
    bedNo: '07床',
  },
  {
    id: 'spm-11',
    slotCoord: '2-3',
    row: 2,
    col: 3,
    boxId: '18CLT01ECO',
    barcode: 'BC2026102903',
    sourceMode: '条码',
    specimenType: '血液',
    collectionSite: '静脉促凝分离胶管',
    collectionTime: '2026-10-29 08:45',
    storageTime: '2026-10-29 10:00',
    storageStaff: '周丽娜 (检验师)',
    expireTime: '2026-11-05',
    status: '在库',
    patientName: '刘海燕',
    gender: '女',
    age: '50岁',
    hospitalNo: 'ZY00291950',
    department: '乳腺甲状腺外科',
    testOrder: '肿瘤标志物五项 (CEA/CA15-3/CA125)',
    diagnosis: '浸润性导管癌术后化疗复查',
    doctor: '王雪梅 (主任医师)',
    bedNo: '14床',
  },
  {
    id: 'spm-12',
    slotCoord: '2-4',
    row: 2,
    col: 4,
    boxId: '18CLT01ECO',
    barcode: 'BC2026102904',
    sourceMode: '条码',
    specimenType: '脑脊液',
    collectionSite: '腰椎穿刺脑脊液第二管',
    collectionTime: '2026-10-29 09:20',
    storageTime: '2026-10-29 10:35',
    storageStaff: '张伟 (主管检验师)',
    expireTime: '2026-11-05',
    status: '在库',
    patientName: '曹志明',
    gender: '男',
    age: '24岁',
    hospitalNo: 'ZY00291962',
    department: '神经内科',
    testOrder: '脑脊液生化五项 + 寡克隆区带',
    diagnosis: '病毒性脑膜脑炎',
    doctor: '郭海平 (主治医师)',
    bedNo: '02床',
  },
  {
    id: 'spm-13',
    slotCoord: '2-5',
    row: 2,
    col: 5,
    boxId: '18CLT01ECO',
    barcode: 'BC2026102905',
    sourceMode: '手工',
    specimenType: '胸腹水',
    collectionSite: '诊断性腹腔穿刺抽吸液',
    collectionTime: '2026-10-29 09:50',
    storageTime: '2026-10-29 11:00',
    storageStaff: '孙晓东 (副主任技师)',
    expireTime: '2026-11-05',
    status: '在库',
    patientName: '杨帆',
    gender: '男',
    age: '46岁',
    hospitalNo: 'ZY00291970',
    department: '感染病科',
    testOrder: '腹水常规 + 李凡他试验 + 腺苷脱氨酶',
    diagnosis: '结核性腹膜炎并腹水',
    doctor: '刘洋 (副主任医师)',
    bedNo: '18床',
  },
  {
    id: 'spm-14',
    slotCoord: '2-6',
    row: 2,
    col: 6,
    boxId: '18CLT01ECO',
    barcode: 'BC2026102906',
    sourceMode: '条码',
    specimenType: '拭子',
    collectionSite: '咽后壁拭子拭取物',
    collectionTime: '2026-10-29 10:15',
    storageTime: '2026-10-29 11:25',
    storageStaff: '李婷 (主管检验师)',
    expireTime: '2026-11-05',
    status: '在库',
    patientName: '郭素芬',
    gender: '女',
    age: '68岁',
    hospitalNo: 'MZ2026102941',
    department: '发热门诊',
    testOrder: '甲/乙型流感病毒抗原快速筛查',
    diagnosis: '甲型流行性感冒',
    doctor: '陈明 (急诊主治)',
    bedNo: '发热01',
  },
  {
    id: 'spm-15',
    slotCoord: '2-7',
    row: 2,
    col: 7,
    boxId: '18CLT01ECO',
    barcode: 'BC2026102301',
    sourceMode: '条码',
    specimenType: '血液',
    collectionSite: '静脉抗凝全血',
    collectionTime: '2026-10-23 08:10',
    storageTime: '2026-10-23 09:30',
    storageStaff: '王雪梅 (副主任检验师)',
    expireTime: '2026-10-30', // 到期！
    status: '待销毁',
    patientName: '马建国',
    gender: '男',
    age: '58岁',
    hospitalNo: 'ZY00291750',
    department: '骨科创伤中心',
    testOrder: '血常规五分类 + C反应蛋白',
    diagnosis: '左胫骨粉碎性骨折术后',
    doctor: '赵立峰 (主治医师)',
    bedNo: '25床',
    remarks: '留样已超7天法定储存期，已达销毁标准',
  },
  {
    id: 'spm-16',
    slotCoord: '2-8',
    row: 2,
    col: 8,
    boxId: '18CLT01ECO',
    barcode: 'BC2026102302',
    sourceMode: '手工',
    specimenType: '尿液',
    collectionSite: '清洁中段尿',
    collectionTime: '2026-10-23 08:45',
    storageTime: '2026-10-23 10:00',
    storageStaff: '张伟 (主管检验师)',
    expireTime: '2026-10-30', // 到期！
    status: '待销毁',
    patientName: '宋晓敏',
    gender: '女',
    age: '35岁',
    hospitalNo: 'ZY00291758',
    department: '泌尿外科',
    testOrder: '尿培养 + 细菌计数',
    diagnosis: '急性肾盂肾炎',
    doctor: '周丽娜 (主治医师)',
    bedNo: '11床',
    remarks: '逾期待生物无害化灭菌销毁',
  },
  // Row 3..6 partially filled for realistic clinical feel
  {
    id: 'spm-17',
    slotCoord: '3-1',
    row: 3,
    col: 1,
    boxId: '18CLT01ECO',
    barcode: 'BC2026103001',
    sourceMode: '条码',
    specimenType: '血液',
    collectionSite: '真空采血管 (EDTA-K2)',
    collectionTime: '2026-10-30 07:15',
    storageTime: '2026-10-30 08:30',
    storageStaff: '张伟 (主管检验师)',
    expireTime: '2026-11-06',
    status: '在库',
    patientName: '郑林海',
    gender: '男',
    age: '62岁',
    hospitalNo: 'ZY00292001',
    department: '血液内科',
    testOrder: '骨髓穿刺活检外周血比对',
    diagnosis: '骨髓增生异常综合征 (MDS)',
    doctor: '张建华 (主任医师)',
    bedNo: '09床',
  },
  {
    id: 'spm-18',
    slotCoord: '3-2',
    row: 3,
    col: 2,
    boxId: '18CLT01ECO',
    barcode: 'BC2026103002',
    sourceMode: '条码',
    specimenType: '痰液',
    collectionSite: '清晨深部咳痰',
    collectionTime: '2026-10-30 07:30',
    storageTime: '2026-10-30 08:45',
    storageStaff: '李婷 (主管检验师)',
    expireTime: '2026-11-06',
    status: '在库',
    patientName: '徐春梅',
    gender: '女',
    age: '53岁',
    hospitalNo: 'ZY00292015',
    department: '呼吸内科二病区',
    testOrder: '抗酸染色涂片 + 结核分枝杆菌DNA',
    diagnosis: '浸润型肺结核复治期',
    doctor: '王雪梅 (主任医师)',
    bedNo: '15床',
  },
  {
    id: 'spm-19',
    slotCoord: '3-3',
    row: 3,
    col: 3,
    boxId: '18CLT01ECO',
    barcode: 'BC2026103003',
    sourceMode: '急查',
    specimenType: '血液',
    collectionSite: '静脉柠檬酸钠抗凝管',
    collectionTime: '2026-10-30 08:00',
    storageTime: '2026-10-30 09:10',
    storageStaff: '陈志远 (检验师)',
    expireTime: '2026-11-06',
    status: '在库',
    patientName: '方俊杰',
    gender: '男',
    age: '29岁',
    hospitalNo: 'MZ2026103008',
    department: '急诊外科',
    testOrder: '凝血七项 + 血栓弹力图 (TEG)',
    diagnosis: '腹部闭合性外伤合并脾破裂疑似',
    doctor: '陈明 (急诊主治)',
    bedNo: '抢01',
  },
];

export const SpecimenManagementView: React.FC<SpecimenManagementViewProps> = ({
  user,
  triggerAction,
}) => {
  // 1. 过滤与选中容器状态
  const [selectedGroup, setSelectedGroup] = useState('生化组');
  const [containerSearchKey, setContainerSearchKey] = useState('');
  const [selectedBoxId, setSelectedBoxId] = useState('box-01');
  
  // 树状展开收起状态
  const [expandedFridges, setExpandedFridges] = useState<Record<string, boolean>>({
    'fridge-01': true,
    'fridge-02': false,
    'fridge-03': false,
  });
  const [expandedRacks, setExpandedRacks] = useState<Record<string, boolean>>({
    'rack-01': true,
    'rack-02': false,
    'rack-03': false,
  });

  // 标本数据状态
  const [specimens, setSpecimens] = useState<SpecimenRecord[]>(INITIAL_SPECIMENS);
  
  // 顶部快捷搜索与标本类型筛选
  const [specimenSearchKey, setSpecimenSearchKey] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('全部');
  const [statusFilter, setStatusFilter] = useState<string>('全部');

  // 选中的标本或孔位 (用于打开右侧详情弹窗)
  const [selectedSpecimen, setSelectedSpecimen] = useState<SpecimenRecord | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [emptySlotSelected, setEmptySlotSelected] = useState<{ row: number; col: number; coord: string } | null>(null);

  // 8 个功能按钮对应弹窗状态
  const [isStoreModalOpen, setIsStoreModalOpen] = useState(false); // 1. 存入标本
  const [isStatModalOpen, setIsStatModalOpen] = useState(false); // 2. 统计查询
  const [isManualModalOpen, setIsManualModalOpen] = useState(false); // 3. 手工登记
  const [isBorrowModalOpen, setIsBorrowModalOpen] = useState(false); // 4. 借出
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false); // 5. 归还
  const [isDestroyModalOpen, setIsDestroyModalOpen] = useState(false); // 6. 销毁
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // 7. 修改
  const [isUndoModalOpen, setIsUndoModalOpen] = useState(false); // 8. 撤销

  // 存入标本表单数据
  const [storeForm, setStoreForm] = useState({
    barcode: '',
    sourceMode: '条码' as '手工' | '条码' | '急查',
    specimenType: '血液' as const,
    collectionSite: '静脉全血抗凝管',
    patientName: '',
    gender: '男' as '男' | '女',
    age: '',
    hospitalNo: '',
    department: '急诊科',
    testOrder: '生化急查全项',
    diagnosis: '待查',
    doctor: '张建华',
    bedNo: '',
    targetCoord: '',
    remarks: '',
  });

  // 手工登记表单数据
  const [manualForm, setManualForm] = useState({
    patientName: '',
    gender: '男' as '男' | '女',
    age: '',
    hospitalNo: '',
    department: '感染科病区',
    specimenType: '血液' as const,
    collectionSite: '静脉全血',
    testOrder: '急查血常规五分类',
    diagnosis: '发热待查',
    doctor: '王雪梅',
    bedNo: '06床',
    remarks: '急查手工登记标本',
  });

  // 借出表单数据
  const [borrowForm, setBorrowForm] = useState({
    specimenId: '',
    borrowerName: '李建国 (副主任医师)',
    borrowDept: '呼吸重症病房',
    borrowReason: '科研复测及药敏结果回溯比对',
    expectedReturnDate: '2026-11-03',
  });

  // 归还表单数据
  const [returnForm, setReturnForm] = useState({
    specimenId: '',
    returnCondition: '完好未融解',
    returnOperator: user?.name || '张伟',
    remarks: '经质控外观审核合格，恢复原孔位保存',
  });

  // 批量销毁选中项
  const [selectedDestroyIds, setSelectedDestroyIds] = useState<string[]>([]);
  const [destroyReason, setDestroyReason] = useState('超过医疗机构法定7天留存周期，执行无害化高压灭菌生物销毁');
  const [destroyApprover, setDestroyApprover] = useState('张建华 (科主任/主任检验师)');

  // 修改表单数据
  const [editForm, setEditForm] = useState<Partial<SpecimenRecord>>({});

  // 当前激活的冷藏盒
  const currentBox = useMemo(() => {
    return STORAGE_BOXES.find((b) => b.id === selectedBoxId) || STORAGE_BOXES[0];
  }, [selectedBoxId]);

  // 当前盒子中的标本列表
  const currentBoxSpecimens = useMemo(() => {
    return specimens.filter((s) => s.boxId === currentBox.code);
  }, [specimens, currentBox]);

  // 标本网格槽映射 (row, col) => Specimen
  const slotMap = useMemo(() => {
    const map = new Map<string, SpecimenRecord>();
    currentBoxSpecimens.forEach((spm) => {
      map.set(spm.slotCoord, spm);
    });
    return map;
  }, [currentBoxSpecimens]);

  // 统计指标
  const stats = useMemo(() => {
    const totalSlots = currentBox.rows * currentBox.cols;
    const occupied = currentBoxSpecimens.length;
    const borrowed = currentBoxSpecimens.filter((s) => s.status === '借出中').length;
    const pendingDestroy = currentBoxSpecimens.filter((s) => s.status === '待销毁').length;
    const vacant = totalSlots - occupied;
    const normal = occupied - borrowed - pendingDestroy;
    return { totalSlots, occupied, borrowed, pendingDestroy, vacant, normal };
  }, [currentBox, currentBoxSpecimens]);

  // 点击网格孔位触发事件 (将原右侧显示改为弹窗展示)
  const handleSlotClick = (coord: string, row: number, col: number) => {
    const spm = slotMap.get(coord);
    if (spm) {
      setSelectedSpecimen(spm);
      setEmptySlotSelected(null);
      setIsDetailModalOpen(true);
    } else {
      // 点击空位，可直接发起快速存入弹窗
      setEmptySlotSelected({ row, col, coord });
      setSelectedSpecimen(null);
      setStoreForm((prev) => ({
        ...prev,
        targetCoord: coord,
        barcode: `BC20261030${String(row * 10 + col).padStart(3, '0')}`,
      }));
      setIsStoreModalOpen(true);
    }
  };

  // 1. 存入标本提交
  const handleSaveStore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeForm.patientName.trim()) {
      alert('请输入患者姓名');
      return;
    }

    let targetCoord = storeForm.targetCoord;
    // 如果没有指定孔位，自动寻找第一个空孔位
    if (!targetCoord) {
      for (let r = 1; r <= currentBox.rows; r++) {
        for (let c = 1; c <= currentBox.cols; c++) {
          const testCoord = `${r}-${c}`;
          if (!slotMap.has(testCoord)) {
            targetCoord = testCoord;
            break;
          }
        }
        if (targetCoord) break;
      }
    }

    if (!targetCoord) {
      alert('当前冻存盒已满，请选择其他冻存盒或清理已销毁标本');
      return;
    }

    const [rStr, cStr] = targetCoord.split('-');
    const newSpecimen: SpecimenRecord = {
      id: `spm-${Date.now()}`,
      slotCoord: targetCoord,
      row: parseInt(rStr, 10),
      col: parseInt(cStr, 10),
      boxId: currentBox.code,
      barcode: storeForm.barcode || `BC20261030${Date.now().toString().slice(-4)}`,
      sourceMode: storeForm.sourceMode,
      specimenType: storeForm.specimenType,
      collectionSite: storeForm.collectionSite,
      collectionTime: '2026-10-30 08:30',
      storageTime: '2026-10-30 09:00',
      storageStaff: user?.name || '张伟 (主管检验师)',
      expireTime: '2026-11-06',
      status: '在库',
      patientName: storeForm.patientName.trim(),
      gender: storeForm.gender,
      age: storeForm.age || '45岁',
      hospitalNo: storeForm.hospitalNo || `ZY0029${Math.floor(1000 + Math.random() * 9000)}`,
      department: storeForm.department,
      testOrder: storeForm.testOrder,
      diagnosis: storeForm.diagnosis,
      doctor: storeForm.doctor,
      bedNo: storeForm.bedNo || '常规床',
      remarks: storeForm.remarks,
    };

    setSpecimens([newSpecimen, ...specimens]);
    setIsStoreModalOpen(false);
    triggerAction(`标本【${newSpecimen.barcode}】(${newSpecimen.patientName}) 已成功存入孔位 ${newSpecimen.slotCoord}！`);
  };

  // 3. 手工登记提交
  const handleSaveManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualForm.patientName.trim()) return;

    // 自动分配一个空位
    let targetCoord = '';
    for (let r = 1; r <= currentBox.rows; r++) {
      for (let c = 1; c <= currentBox.cols; c++) {
        const testCoord = `${r}-${c}`;
        if (!slotMap.has(testCoord)) {
          targetCoord = testCoord;
          break;
        }
      }
      if (targetCoord) break;
    }

    if (!targetCoord) {
      alert('当前冻存盒已满，无法分配空位');
      return;
    }

    const [rStr, cStr] = targetCoord.split('-');
    const newManualCode = `SG20261030${Math.floor(100 + Math.random() * 900)}`;

    const newSpecimen: SpecimenRecord = {
      id: `spm-manual-${Date.now()}`,
      slotCoord: targetCoord,
      row: parseInt(rStr, 10),
      col: parseInt(cStr, 10),
      boxId: currentBox.code,
      barcode: newManualCode,
      sourceMode: '手工',
      specimenType: manualForm.specimenType,
      collectionSite: manualForm.collectionSite,
      collectionTime: '2026-10-30 08:50',
      storageTime: '2026-10-30 09:10',
      storageStaff: user?.name || '张伟 (主管检验师)',
      expireTime: '2026-11-06',
      status: '在库',
      patientName: manualForm.patientName.trim(),
      gender: manualForm.gender,
      age: manualForm.age || '52岁',
      hospitalNo: manualForm.hospitalNo || `MZ20261030${Math.floor(10 + Math.random() * 90)}`,
      department: manualForm.department,
      testOrder: manualForm.testOrder,
      diagnosis: manualForm.diagnosis,
      doctor: manualForm.doctor,
      bedNo: manualForm.bedNo,
      remarks: manualForm.remarks,
    };

    setSpecimens([newSpecimen, ...specimens]);
    setIsManualModalOpen(false);
    triggerAction(`手工登记完成！已生成手工条码【${newManualCode}】，存放孔位：${targetCoord}`);
  };

  // 4. 借出操作
  const handleExecuteBorrow = (e: React.FormEvent) => {
    e.preventDefault();
    const target = specimens.find((s) => s.id === borrowForm.specimenId);
    if (!target) {
      alert('请选择要借出的标本');
      return;
    }

    const updated = specimens.map((s) => {
      if (s.id === target.id) {
        return {
          ...s,
          status: '借出中' as const,
          borrower: borrowForm.borrowerName,
          borrowDept: borrowForm.borrowDept,
          borrowReason: borrowForm.borrowReason,
          borrowDate: '2026-10-30 09:30',
          expectedReturnDate: borrowForm.expectedReturnDate,
        };
      }
      return s;
    });

    setSpecimens(updated);
    setIsBorrowModalOpen(false);
    if (selectedSpecimen?.id === target.id) {
      setSelectedSpecimen(updated.find((s) => s.id === target.id) || null);
    }
    triggerAction(`标本【${target.barcode}】(${target.patientName}) 已成功借出给 ${borrowForm.borrowerName}`);
  };

  // 5. 归还操作
  const handleExecuteReturn = (e: React.FormEvent) => {
    e.preventDefault();
    const target = specimens.find((s) => s.id === returnForm.specimenId);
    if (!target) {
      alert('请选择要归还的标本');
      return;
    }

    const updated = specimens.map((s) => {
      if (s.id === target.id) {
        return {
          ...s,
          status: '在库' as const,
          remarks: `${s.remarks ? s.remarks + '；' : ''}于2026-10-30归还入库(${returnForm.returnCondition})`,
        };
      }
      return s;
    });

    setSpecimens(updated);
    setIsReturnModalOpen(false);
    if (selectedSpecimen?.id === target.id) {
      setSelectedSpecimen(updated.find((s) => s.id === target.id) || null);
    }
    triggerAction(`标本【${target.barcode}】已成功办理归还入库！孔位：${target.slotCoord}`);
  };

  // 6. 销毁操作
  const handleExecuteDestroy = () => {
    if (selectedDestroyIds.length === 0) {
      alert('请勾选需要销毁的过期/超期标本');
      return;
    }

    const updated = specimens.filter((s) => !selectedDestroyIds.includes(s.id));
    setSpecimens(updated);
    setIsDestroyModalOpen(false);
    if (selectedSpecimen && selectedDestroyIds.includes(selectedSpecimen.id)) {
      setIsDetailModalOpen(false);
      setSelectedSpecimen(null);
    }
    setSelectedDestroyIds([]);
    triggerAction(`已完成 ${selectedDestroyIds.length} 支超期标本的生物无害化销毁出库与台账归档！`);
  };

  // 7. 修改标本信息保存
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm.id) return;

    const updated = specimens.map((s) => {
      if (s.id === editForm.id) {
        return { ...s, ...editForm } as SpecimenRecord;
      }
      return s;
    });

    setSpecimens(updated);
    setIsEditModalOpen(false);
    if (selectedSpecimen?.id === editForm.id) {
      setSelectedSpecimen({ ...selectedSpecimen, ...editForm } as SpecimenRecord);
    }
    triggerAction(`标本【${editForm.barcode}】信息已成功修改！`);
  };

  // 8. 撤销操作
  const handleExecuteUndo = () => {
    setIsUndoModalOpen(false);
    triggerAction('已撤销上一笔孔位调整操作，系统数据已同步恢复至变更前状态！');
  };

  // 快捷打开各操作弹窗
  const openBorrowModalFor = (spm: SpecimenRecord) => {
    setBorrowForm({
      specimenId: spm.id,
      borrowerName: '李建国 (副主任医师)',
      borrowDept: spm.department,
      borrowReason: '科研质控复查比对',
      expectedReturnDate: '2026-11-03',
    });
    setIsBorrowModalOpen(true);
  };

  const openEditModalFor = (spm: SpecimenRecord) => {
    setEditForm({ ...spm });
    setIsEditModalOpen(true);
  };

  // 获取标本类型的颜色样式
  const getSpecimenTypeBadge = (type: string) => {
    switch (type) {
      case '血液':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case '痰液':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case '尿液':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case '血清':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case '脑脊液':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case '胸腹水':
        return 'bg-cyan-50 text-cyan-700 border-cyan-200';
      case '拭子':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  // 借出中标本列表 (用于归还弹窗)
  const borrowedSpecimens = useMemo(() => {
    return specimens.filter((s) => s.status === '借出中');
  }, [specimens]);

  // 待销毁/超期标本列表 (用于销毁弹窗)
  const expiredSpecimens = useMemo(() => {
    return specimens.filter((s) => s.status === '待销毁' || s.expireTime <= '2026-10-30');
  }, [specimens]);

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-slate-100 overflow-hidden text-xs text-slate-800">
      {/* 顶部现代化操作工具栏 (对应截图顶部按钮与搜索条) */}
      <div className="bg-white border-b border-slate-200 px-4 py-2.5 shadow-2xs shrink-0 flex flex-wrap items-center justify-between gap-3">
        {/* 左侧搜索与筛选 */}
        <div className="flex items-center gap-3 flex-1 min-w-[280px]">
          <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm shrink-0">
            <Archive className="w-5 h-5 text-sky-700" />
            <span>标本管理 (低温留样冷库)</span>
          </div>

          <div className="relative flex-1 max-w-xs">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={specimenSearchKey}
              onChange={(e) => setSpecimenSearchKey(e.target.value)}
              placeholder="搜索条码号 / 患者姓名 / 住院号..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-sky-500 focus:bg-white transition-all font-mono"
            />
          </div>

          {/* 标本类型快捷胶囊 */}
          <div className="hidden lg:flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg">
            {['全部', '血液', '痰液', '尿液', '血清', '脑脊液', '胸腹水', '拭子'].map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                  typeFilter === t
                    ? 'bg-white text-sky-700 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* 右侧：截图中的 8 个核心功能按钮 */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => {
              setStoreForm((prev) => ({
                ...prev,
                barcode: `BC20261030${Math.floor(1000 + Math.random() * 9000)}`,
                targetCoord: '',
                patientName: '',
                age: '',
                hospitalNo: '',
              }));
              setIsStoreModalOpen(true);
            }}
            className="px-3.5 py-1.5 bg-sky-700 hover:bg-sky-800 text-white font-semibold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>存入标本</span>
          </button>

          <button
            type="button"
            onClick={() => setIsStatModalOpen(true)}
            className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold rounded-lg shadow-2xs flex items-center gap-1 transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-sky-600" />
            <span>统计查询</span>
          </button>

          <button
            type="button"
            onClick={() => setIsManualModalOpen(true)}
            className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold rounded-lg shadow-2xs flex items-center gap-1 transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>手工登记</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (selectedSpecimen) {
                openBorrowModalFor(selectedSpecimen);
              } else {
                setIsBorrowModalOpen(true);
              }
            }}
            className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold rounded-lg shadow-2xs flex items-center gap-1 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-amber-600" />
            <span>借出</span>
          </button>

          <button
            type="button"
            onClick={() => setIsReturnModalOpen(true)}
            className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold rounded-lg shadow-2xs flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-teal-600" />
            <span>归还</span>
          </button>

          <button
            type="button"
            onClick={() => setIsDestroyModalOpen(true)}
            className="px-3 py-1.5 bg-white hover:bg-rose-50 text-rose-700 border border-rose-300 font-semibold rounded-lg shadow-2xs flex items-center gap-1 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-600" />
            <span>销毁</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (selectedSpecimen) {
                openEditModalFor(selectedSpecimen);
              } else {
                triggerAction('请先在下方点击一个标本槽位，再点击“修改”按钮');
              }
            }}
            className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold rounded-lg shadow-2xs flex items-center gap-1 transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5 text-slate-600" />
            <span>修改</span>
          </button>

          <button
            type="button"
            onClick={() => setIsUndoModalOpen(true)}
            className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold rounded-lg shadow-2xs flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>撤销</span>
          </button>
        </div>
      </div>

      {/* 主界面：左侧存储容器树 + 中间占满宽度的标本网格 (用户要求：页面直接展示左侧和网格，右侧信息改成点击后弹窗展示) */}
      <div className="flex-1 min-h-0 flex overflow-hidden p-3 gap-3">
        {/* ============================================================== */}
        {/* 左侧：专业小组与容器树状导航 */}
        {/* ============================================================== */}
        <div className="w-64 bg-white rounded-xl border border-slate-200 shadow-2xs flex flex-col shrink-0 overflow-hidden">
          {/* 专业小组选择器 */}
          <div className="p-3 border-b border-slate-100 space-y-2 bg-slate-50/50">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">专业小组</label>
              <select
                value={selectedGroup}
                onChange={(e) => {
                  setSelectedGroup(e.target.value);
                  triggerAction(`已切换至【${e.target.value}】标本留存区`);
                }}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:border-sky-500"
              >
                <option value="生化组">生化组 (常规生化/电解质留样)</option>
                <option value="临检组">临检组 (血尿常规/凝血复查)</option>
                <option value="免疫组">免疫组 (发光/感染性标志物)</option>
                <option value="微生物组">微生物组 (菌株冷冻/药敏保存)</option>
                <option value="分子诊断组">分子诊断组 (核酸扩增质控)</option>
                <option value="急诊检验组">急诊检验组 (床旁危急值留存)</option>
              </select>
            </div>

            {/* 容器检索 */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">容器信息</label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={containerSearchKey}
                  onChange={(e) => setContainerSearchKey(e.target.value)}
                  placeholder="搜索容器名称/条码..."
                  className="w-full pl-7 pr-2.5 py-1 bg-white border border-slate-300 rounded-lg text-xs focus:outline-none focus:border-sky-500 font-mono"
                />
              </div>
            </div>
          </div>

          {/* 容器层级树状菜单 */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
            {/* 冰箱 1 */}
            <div className="rounded-lg border border-slate-200 overflow-hidden bg-slate-50/40">
              <button
                type="button"
                onClick={() =>
                  setExpandedFridges((prev) => ({ ...prev, 'fridge-01': !prev['fridge-01'] }))
                }
                className="w-full px-2.5 py-2 flex items-center justify-between text-left hover:bg-slate-100 font-semibold text-slate-800 transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <Thermometer className="w-4 h-4 text-sky-600" />
                  <span className="truncate">海尔低温冰箱 (-20℃)</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="px-1.5 py-0.2 rounded bg-sky-100 text-sky-700 font-mono text-[10px]">
                    2架
                  </span>
                  {expandedFridges['fridge-01'] ? (
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  )}
                </div>
              </button>

              {expandedFridges['fridge-01'] && (
                <div className="pl-3 pr-1.5 py-1 space-y-1 border-t border-slate-100 bg-white">
                  {/* 铁架 1 */}
                  <div>
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedRacks((prev) => ({ ...prev, 'rack-01': !prev['rack-01'] }))
                      }
                      className="w-full px-2 py-1 flex items-center justify-between hover:bg-slate-50 rounded text-slate-700"
                    >
                      <div className="flex items-center gap-1.5 font-medium">
                        <Layers className="w-3.5 h-3.5 text-slate-500" />
                        <span>上层一号铁架</span>
                      </div>
                      {expandedRacks['rack-01'] ? (
                        <ChevronDown className="w-3 h-3 text-slate-400" />
                      ) : (
                        <ChevronRight className="w-3 h-3 text-slate-400" />
                      )}
                    </button>

                    {expandedRacks['rack-01'] && (
                      <div className="pl-4 space-y-0.5 mt-0.5 border-l-2 border-sky-200 ml-3">
                        <button
                          type="button"
                          onClick={() => setSelectedBoxId('box-01')}
                          className={`w-full px-2 py-1.5 rounded flex items-center justify-between text-left transition-all ${
                            selectedBoxId === 'box-01'
                              ? 'bg-sky-600 text-white font-bold shadow-2xs'
                              : 'hover:bg-slate-100 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 truncate">
                            <Archive className="w-3 h-3" />
                            <span className="font-mono text-[11px]">18CLT01ECO</span>
                          </div>
                          <span
                            className={`text-[10px] font-mono px-1 rounded ${
                              selectedBoxId === 'box-01'
                                ? 'bg-sky-700 text-white'
                                : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {specimens.filter((s) => s.boxId === '18CLT01ECO').length}/48
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setSelectedBoxId('box-02')}
                          className={`w-full px-2 py-1.5 rounded flex items-center justify-between text-left transition-all ${
                            selectedBoxId === 'box-02'
                              ? 'bg-sky-600 text-white font-bold shadow-2xs'
                              : 'hover:bg-slate-100 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 truncate">
                            <Archive className="w-3 h-3" />
                            <span className="font-mono text-[11px]">19CLT01ECE</span>
                          </div>
                          <span
                            className={`text-[10px] font-mono px-1 rounded ${
                              selectedBoxId === 'box-02'
                                ? 'bg-sky-700 text-white'
                                : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            0/48
                          </span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* 铁架 2 */}
                  <div>
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedRacks((prev) => ({ ...prev, 'rack-02': !prev['rack-02'] }))
                      }
                      className="w-full px-2 py-1 flex items-center justify-between hover:bg-slate-50 rounded text-slate-700"
                    >
                      <div className="flex items-center gap-1.5 font-medium">
                        <Layers className="w-3.5 h-3.5 text-slate-500" />
                        <span>上层二号铁架</span>
                      </div>
                      <ChevronRight className="w-3 h-3 text-slate-400" />
                    </button>
                  </div>

                  {/* 中层铁架 */}
                  <div className="px-2 py-1 text-slate-600 hover:bg-slate-50 rounded flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-slate-400" />
                    <span>中层一号铁架</span>
                  </div>
                  <div className="px-2 py-1 text-slate-600 hover:bg-slate-50 rounded flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-slate-400" />
                    <span>中层二号铁架</span>
                  </div>
                  <div className="px-2 py-1 text-slate-600 hover:bg-slate-50 rounded flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-slate-400" />
                    <span>下层一号铁架</span>
                  </div>
                  <div className="px-2 py-1 text-slate-600 hover:bg-slate-50 rounded flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-slate-400" />
                    <span>下层二号铁架</span>
                  </div>
                </div>
              )}
            </div>

            {/* 冰箱 2：赛默飞超低温 -86℃ */}
            <div className="rounded-lg border border-slate-200 overflow-hidden bg-slate-50/40">
              <button
                type="button"
                onClick={() =>
                  setExpandedFridges((prev) => ({ ...prev, 'fridge-02': !prev['fridge-02'] }))
                }
                className="w-full px-2.5 py-2 flex items-center justify-between text-left hover:bg-slate-100 font-semibold text-slate-800 transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <Thermometer className="w-4 h-4 text-indigo-600" />
                  <span className="truncate">赛默飞超低温 (-86℃)</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-700 font-mono text-[10px]">
                    48格
                  </span>
                  {expandedFridges['fridge-02'] ? (
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  )}
                </div>
              </button>

              {expandedFridges['fridge-02'] && (
                <div className="p-2 border-t border-slate-100 bg-white">
                  <button
                    type="button"
                    onClick={() => setSelectedBoxId('box-03')}
                    className={`w-full px-2 py-1.5 rounded flex items-center justify-between text-left transition-all ${
                      selectedBoxId === 'box-03'
                        ? 'bg-sky-600 text-white font-bold shadow-2xs'
                        : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <Archive className="w-3 h-3" />
                      <span className="font-mono text-[11px]">20CLT02BIO (质谱)</span>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* 冰箱 3：4℃冷藏 */}
            <div className="rounded-lg border border-slate-200 overflow-hidden bg-slate-50/40">
              <button
                type="button"
                onClick={() =>
                  setExpandedFridges((prev) => ({ ...prev, 'fridge-03': !prev['fridge-03'] }))
                }
                className="w-full px-2.5 py-2 flex items-center justify-between text-left hover:bg-slate-100 font-semibold text-slate-800 transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <Thermometer className="w-4 h-4 text-teal-600" />
                  <span className="truncate">澳柯玛冷藏柜 (4℃)</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>

          {/* 底部当前容器容量指标 */}
          <div className="p-3 bg-slate-50 border-t border-slate-200">
            <div className="flex items-center justify-between text-[11px] mb-1 font-semibold text-slate-700">
              <span>当前盒占用率</span>
              <span className="font-mono font-bold text-sky-700">
                {stats.occupied} / {stats.totalSlots} (
                {Math.round((stats.occupied / stats.totalSlots) * 100)}%)
              </span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-sky-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${(stats.occupied / stats.totalSlots) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* 中间主要区域：现代化的标本矩阵网格 (满屏展示，点击任意槽位弹出详情弹窗) */}
        {/* ============================================================== */}
        <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-2xs flex flex-col overflow-hidden min-w-0">
          {/* 网格顶栏：当前位置导览与状态统计 */}
          <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Archive className="w-4 h-4 text-sky-700" />
                <span>{currentBox.name}</span>
              </span>
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-bold border border-sky-200">
                {currentBox.code}
              </span>
              <span className="text-[11px] text-slate-500">
                {currentBox.fridgeName} · {currentBox.rackName} · 温度受控:{' '}
                <strong className="text-emerald-700 font-mono">{currentBox.temp}</strong>
              </span>
            </div>

            {/* 状态图例与指示器 */}
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1.5 text-slate-700">
                <span className="w-3 h-3 rounded bg-blue-500 border border-blue-600 inline-block"></span>
                <span>正常在库 ({stats.normal})</span>
              </span>
              <span className="flex items-center gap-1.5 text-amber-700 font-semibold">
                <span className="w-3 h-3 rounded bg-amber-500 border border-amber-600 inline-block animate-pulse"></span>
                <span>借出中 ({stats.borrowed})</span>
              </span>
              <span className="flex items-center gap-1.5 text-rose-700 font-semibold">
                <span className="w-3 h-3 rounded bg-rose-500 border border-rose-600 inline-block"></span>
                <span>待销毁 ({stats.pendingDestroy})</span>
              </span>
              <span className="flex items-center gap-1.5 text-slate-500">
                <span className="w-3 h-3 rounded bg-slate-100 border border-slate-300 inline-block"></span>
                <span>空置可用 ({stats.vacant})</span>
              </span>
            </div>
          </div>

          {/* 网格主体：6行 x 8列 标准 48 孔标本冻存盒 */}
          <div className="flex-1 p-3 overflow-auto bg-slate-100/50">
            <div className="min-w-[800px] h-full flex flex-col justify-between">
              {/* 列标号 (1 到 8) */}
              <div className="grid grid-cols-8 gap-2 mb-1.5 px-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((colNum) => (
                  <div
                    key={colNum}
                    className="text-center font-mono font-bold text-slate-400 text-[11px]"
                  >
                    第 {colNum} 列
                  </div>
                ))}
              </div>

              {/* 6 行网格 */}
              <div className="flex-1 flex flex-col justify-between gap-2">
                {[1, 2, 3, 4, 5, 6].map((rowNum) => (
                  <div key={rowNum} className="flex items-center gap-2">
                    {/* 行号 */}
                    <div className="w-4 text-center font-mono font-bold text-slate-400 text-xs shrink-0">
                      R{rowNum}
                    </div>

                    {/* 8 个槽位 */}
                    <div className="flex-1 grid grid-cols-8 gap-2">
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((colNum) => {
                        const coord = `${rowNum}-${colNum}`;
                        const spm = slotMap.get(coord);

                        // 搜索过滤匹配高亮
                        const isMatch =
                          !specimenSearchKey.trim() ||
                          (spm &&
                            (spm.barcode.toLowerCase().includes(specimenSearchKey.toLowerCase()) ||
                              spm.patientName.includes(specimenSearchKey) ||
                              spm.hospitalNo.toLowerCase().includes(specimenSearchKey.toLowerCase())));

                        const isTypeMatch =
                          typeFilter === '全部' || (spm && spm.specimenType === typeFilter);

                        if (spm) {
                          const isBorrowed = spm.status === '借出中';
                          const isPendingDestroy = spm.status === '待销毁';

                          return (
                            <div
                              key={coord}
                              onClick={() => handleSlotClick(coord, rowNum, colNum)}
                              className={`relative rounded-xl border p-2 flex flex-col justify-between cursor-pointer transition-all hover:scale-[1.02] hover:shadow-md ${
                                isBorrowed
                                  ? 'bg-amber-50/90 border-amber-300 ring-2 ring-amber-400/50'
                                  : isPendingDestroy
                                  ? 'bg-rose-50/90 border-rose-300 ring-2 ring-rose-400/50'
                                  : 'bg-white border-sky-300 hover:border-sky-500 shadow-2xs'
                              } ${!isMatch || !isTypeMatch ? 'opacity-30' : 'opacity-100'}`}
                            >
                              {/* 槽位顶部：坐标 + 采集录入模式 */}
                              <div className="flex items-center justify-between text-[10px] text-slate-500 border-b border-slate-100 pb-1">
                                <span className="font-mono font-bold text-slate-800">{coord}</span>
                                <span
                                  className={`px-1 rounded text-[9px] font-semibold ${
                                    spm.sourceMode === '急查'
                                      ? 'bg-rose-100 text-rose-700 animate-pulse'
                                      : spm.sourceMode === '手工'
                                      ? 'bg-slate-200 text-slate-700'
                                      : 'bg-sky-100 text-sky-700'
                                  }`}
                                >
                                  {spm.sourceMode}
                                </span>
                              </div>

                              {/* 标本条码与患者 */}
                              <div className="my-1 space-y-0.5">
                                <div className="font-mono font-bold text-slate-900 text-[11px] truncate tracking-tight">
                                  {spm.barcode}
                                </div>
                                <div className="flex items-center justify-between text-[10px] text-slate-600 truncate">
                                  <span className="font-medium text-slate-800 truncate">
                                    {spm.patientName}
                                  </span>
                                  <span className="text-slate-400 font-mono text-[9px]">
                                    {spm.age}
                                  </span>
                                </div>
                              </div>

                              {/* 槽位底部：标本类型标签 + 状态 */}
                              <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                                <span
                                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${getSpecimenTypeBadge(
                                    spm.specimenType
                                  )}`}
                                >
                                  {spm.specimenType}
                                </span>

                                {isBorrowed ? (
                                  <span className="text-[9px] font-bold text-amber-700 bg-amber-100 px-1 py-0.2 rounded">
                                    借出中
                                  </span>
                                ) : isPendingDestroy ? (
                                  <span className="text-[9px] font-bold text-rose-700 bg-rose-100 px-1 py-0.2 rounded">
                                    待销毁
                                  </span>
                                ) : (
                                  <span className="text-[9px] text-emerald-600 font-medium">在库</span>
                                )}
                              </div>
                            </div>
                          );
                        }

                        // 空槽位卡片 (点击可直接存入)
                        return (
                          <div
                            key={coord}
                            onClick={() => handleSlotClick(coord, rowNum, colNum)}
                            className="rounded-xl border border-dashed border-slate-300 bg-slate-50/50 hover:bg-sky-50 hover:border-sky-400 p-2 flex flex-col justify-between items-center text-center cursor-pointer transition-all group min-h-[74px]"
                          >
                            <span className="font-mono text-[10px] text-slate-400 group-hover:text-sky-600 font-bold self-start">
                              {coord}
                            </span>
                            <div className="flex flex-col items-center justify-center text-slate-400 group-hover:text-sky-600">
                              <Plus className="w-4 h-4 mb-0.5 opacity-60 group-hover:opacity-100" />
                              <span className="text-[10px]">空置</span>
                            </div>
                            <span className="text-[9px] text-slate-300 group-hover:text-sky-600">
                              点击存入
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 网格底部说明条 */}
          <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between text-[11px] text-slate-600">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-sky-600" />
              <span>
                提示：点击任意网格槽位卡片可直接调阅【标本信息与患者完整信息详情弹窗】；点击空置卡片可快速登记存入标本。
              </span>
            </div>
            <div className="font-mono text-slate-500">
              当前系统时间：<strong>2026-10-30</strong> · ISO15189标本管理体系合规
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 弹窗 1 (核心需求)：标本信息与患者信息详情弹窗 (替代原固定右侧栏) */}
      {/* ============================================================== */}
      {isDetailModalOpen && selectedSpecimen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh] animate-scaleIn">
            {/* 弹窗头部 */}
            <div className="bg-gradient-to-r from-sky-800 to-sky-700 text-white px-6 py-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-xl">
                  <Archive className="w-5 h-5 text-sky-200" />
                </div>
                <div>
                  <div className="flex items-center gap-2.5">
                    <h3 className="font-bold text-base">标本留存与患者就诊综合详情</h3>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                        selectedSpecimen.status === '在库'
                          ? 'bg-emerald-500 text-white border-emerald-400'
                          : selectedSpecimen.status === '借出中'
                          ? 'bg-amber-500 text-white border-amber-400 animate-pulse'
                          : 'bg-rose-500 text-white border-rose-400'
                      }`}
                    >
                      {selectedSpecimen.status}
                    </span>
                  </div>
                  <p className="text-xs text-sky-100 font-mono mt-0.5">
                    孔位：{selectedSpecimen.boxId} ({selectedSpecimen.slotCoord}) · 条码：
                    {selectedSpecimen.barcode}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsDetailModalOpen(false)}
                className="p-1.5 text-sky-200 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 弹窗主体内容：左右分栏 (左标本，右患者) */}
            <div className="p-6 overflow-y-auto flex-1 space-y-5 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* 标本信息板块 */}
                <div className="bg-slate-50/80 rounded-xl border border-slate-200 p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                      <Pipette className="w-4 h-4 text-sky-700" />
                      <span>标本核心信息</span>
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-bold border ${getSpecimenTypeBadge(
                        selectedSpecimen.specimenType
                      )}`}
                    >
                      {selectedSpecimen.specimenType}
                    </span>
                  </div>

                  <div className="space-y-2 text-slate-700">
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">标本条码：</span>
                      <span className="font-mono font-bold text-slate-900 text-sm">
                        {selectedSpecimen.barcode}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">采集方式：</span>
                      <span className="font-semibold text-slate-800">
                        {selectedSpecimen.sourceMode} (HIS同步扫码)
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">采集部位：</span>
                      <span className="font-medium text-slate-800">
                        {selectedSpecimen.collectionSite}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">标本类型：</span>
                      <span className="font-bold text-slate-900">
                        {selectedSpecimen.specimenType}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">存放人员：</span>
                      <span className="font-semibold text-slate-900">
                        {selectedSpecimen.storageStaff}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">存放时间：</span>
                      <span className="font-mono text-slate-800 font-semibold">
                        {selectedSpecimen.storageTime}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">法定留存期至：</span>
                      <span className="font-mono text-slate-800">
                        {selectedSpecimen.expireTime} (7天周期)
                      </span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">保存物理位置：</span>
                      <span className="font-mono font-bold text-sky-800">
                        海尔低温冰箱 &gt; 上层一号铁架 &gt; {selectedSpecimen.boxId} [
                        {selectedSpecimen.slotCoord}]
                      </span>
                    </div>
                  </div>
                </div>

                {/* 患者信息板块 */}
                <div className="bg-slate-50/80 rounded-xl border border-slate-200 p-4 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                      <UserCheck className="w-4 h-4 text-emerald-700" />
                      <span>患者就诊档案</span>
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono font-bold">
                      {selectedSpecimen.hospitalNo}
                    </span>
                  </div>

                  <div className="space-y-2 text-slate-700">
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">患者姓名：</span>
                      <span className="font-bold text-slate-900 text-sm">
                        {selectedSpecimen.patientName}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">性别 / 年龄：</span>
                      <span className="font-semibold text-slate-800">
                        {selectedSpecimen.gender} · {selectedSpecimen.age}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">住院号 / 就诊号：</span>
                      <span className="font-mono font-bold text-slate-900">
                        {selectedSpecimen.hospitalNo}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">就诊科室 / 床号：</span>
                      <span className="font-medium text-slate-800">
                        {selectedSpecimen.department} ({selectedSpecimen.bedNo})
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">检验申请项目：</span>
                      <span className="font-semibold text-sky-900">
                        {selectedSpecimen.testOrder}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">临床诊断：</span>
                      <span className="font-medium text-slate-800">
                        {selectedSpecimen.diagnosis}
                      </span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">主管医师：</span>
                      <span className="font-semibold text-slate-900">
                        {selectedSpecimen.doctor}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 借出追踪说明 (若处于借出状态) */}
              {selectedSpecimen.status === '借出中' && (
                <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 space-y-1">
                  <div className="flex items-center justify-between font-bold">
                    <span className="flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span>该标本当前正处于借调复查流转中</span>
                    </span>
                    <span className="font-mono text-xs">
                      预计归还：{selectedSpecimen.expectedReturnDate}
                    </span>
                  </div>
                  <p className="text-[11px] text-amber-800">
                    借用人：{selectedSpecimen.borrower} ({selectedSpecimen.borrowDept}) · 事由：
                    {selectedSpecimen.borrowReason} · 借出时间：{selectedSpecimen.borrowDate}
                  </p>
                </div>
              )}

              {/* 标本流转与生命周期时间轴 */}
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-3">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-sky-700" />
                  <span>标本全流程留痕追溯 (ISO15189 闭环审计)</span>
                </span>
                <div className="divide-y divide-slate-200 text-[11px] space-y-2 font-sans">
                  <div className="pt-2 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800">1. 病区采血与流转签收</span>
                      <span className="text-slate-500 ml-2">
                        护士完成床旁采集，冷链标本箱转运核收
                      </span>
                    </div>
                    <span className="font-mono text-slate-400">
                      {selectedSpecimen.collectionTime}
                    </span>
                  </div>
                  <div className="pt-2 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800">2. 检验分析完成与冻存留样</span>
                      <span className="text-slate-500 ml-2">
                        检验医师 {selectedSpecimen.storageStaff} 入库至 {selectedSpecimen.boxId} [
                        {selectedSpecimen.slotCoord}]
                      </span>
                    </div>
                    <span className="font-mono text-slate-400">
                      {selectedSpecimen.storageTime}
                    </span>
                  </div>
                  <div className="pt-2 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800">3. 质量受控期监控</span>
                      <span className="text-slate-500 ml-2">
                        -20℃恒温监测正常，满足临床复查及科研盲审条件
                      </span>
                    </div>
                    <span className="font-mono text-emerald-600 font-bold">受控达标</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 弹窗底部操作按钮栏 */}
            <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsDetailModalOpen(false);
                    openBorrowModalFor(selectedSpecimen);
                  }}
                  className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-lg font-semibold flex items-center gap-1 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>登记借出</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsDetailModalOpen(false);
                    openEditModalFor(selectedSpecimen);
                  }}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold flex items-center gap-1 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>修改信息</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    triggerAction(
                      `已生成并发送标本条码标签【${selectedSpecimen.barcode}】至检验条码打印机！`
                    )
                  }
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold flex items-center gap-1 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>补打条码</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setIsDetailModalOpen(false)}
                className="px-5 py-1.5 bg-sky-700 hover:bg-sky-800 text-white rounded-lg font-semibold shadow-xs"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 弹窗 2: 【存入标本】 弹窗 */}
      {/* ============================================================== */}
      {isStoreModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-scaleIn">
            <div className="bg-sky-700 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <Plus className="w-4 h-4 text-sky-200" />
                <span>存入标本 (样本入库与孔位分配)</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsStoreModalOpen(false)}
                className="p-1 text-sky-200 hover:text-white rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveStore} className="p-6 space-y-4 text-xs max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">标本条码号 *</label>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      required
                      value={storeForm.barcode}
                      onChange={(e) => setStoreForm({ ...storeForm, barcode: e.target.value })}
                      placeholder="扫描或输入12位条码号"
                      className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono font-bold text-slate-900"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setStoreForm({
                          ...storeForm,
                          barcode: `BC20261030${Math.floor(1000 + Math.random() * 9000)}`,
                        })
                      }
                      className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded text-[11px] whitespace-nowrap"
                    >
                      生成
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">标本类型 *</label>
                  <select
                    value={storeForm.specimenType}
                    onChange={(e) =>
                      setStoreForm({ ...storeForm, specimenType: e.target.value as any })
                    }
                    className="w-full px-3 py-1.5 border border-slate-300 rounded font-medium"
                  >
                    <option value="血液">血液 (全血/抗凝)</option>
                    <option value="血清">血清 (促凝管)</option>
                    <option value="痰液">痰液 (深部咳痰/BALF)</option>
                    <option value="尿液">尿液 (清洁中段尿)</option>
                    <option value="脑脊液">脑脊液 (腰穿)</option>
                    <option value="胸腹水">胸腹水 (穿刺液)</option>
                    <option value="拭子">拭子 (咽后壁/鼻咽)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">患者真实姓名 *</label>
                  <input
                    type="text"
                    required
                    value={storeForm.patientName}
                    onChange={(e) => setStoreForm({ ...storeForm, patientName: e.target.value })}
                    placeholder="如: 陈明"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">性别</label>
                  <select
                    value={storeForm.gender}
                    onChange={(e) =>
                      setStoreForm({ ...storeForm, gender: e.target.value as any })
                    }
                    className="w-full px-3 py-1.5 border border-slate-300 rounded font-medium"
                  >
                    <option value="男">男</option>
                    <option value="女">女</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">年龄</label>
                  <input
                    type="text"
                    value={storeForm.age}
                    onChange={(e) => setStoreForm({ ...storeForm, age: e.target.value })}
                    placeholder="如: 42岁"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">住院号 / 门诊号</label>
                  <input
                    type="text"
                    value={storeForm.hospitalNo}
                    onChange={(e) => setStoreForm({ ...storeForm, hospitalNo: e.target.value })}
                    placeholder="如: ZY00292088"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">就诊科室</label>
                  <select
                    value={storeForm.department}
                    onChange={(e) => setStoreForm({ ...storeForm, department: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded font-medium"
                  >
                    <option value="急诊抢救室">急诊抢救室</option>
                    <option value="心血管内科二病区">心血管内科二病区</option>
                    <option value="呼吸重症监护室(RICU)">呼吸重症监护室(RICU)</option>
                    <option value="神经内科ICU">神经内科ICU</option>
                    <option value="消化内科">消化内科</option>
                    <option value="普外科">普外科</option>
                    <option value="肾内科">肾内科</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">检验申请项目</label>
                  <input
                    type="text"
                    value={storeForm.testOrder}
                    onChange={(e) => setStoreForm({ ...storeForm, testOrder: e.target.value })}
                    placeholder="如: 高敏心肌钙蛋白T/I + 脑钠肽"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">临床初步诊断</label>
                  <input
                    type="text"
                    value={storeForm.diagnosis}
                    onChange={(e) => setStoreForm({ ...storeForm, diagnosis: e.target.value })}
                    placeholder="如: 急性冠脉综合征"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded"
                  />
                </div>
              </div>

              {/* 存放孔位选择 */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-slate-700 font-bold">
                    指定存放孔位 ({currentBox.name})
                  </label>
                  <span className="text-[11px] text-sky-700 font-mono">
                    目标冻存盒: {currentBox.code}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={storeForm.targetCoord}
                    onChange={(e) => setStoreForm({ ...storeForm, targetCoord: e.target.value })}
                    placeholder="如: 1-4 (留空则系统自动推荐空位)"
                    className="w-48 px-3 py-1.5 border border-slate-300 rounded font-mono font-bold"
                  />
                  <span className="text-[11px] text-slate-500">
                    当前剩余可用空位: {stats.vacant} 个
                  </span>
                </div>
              </div>

              <div className="bg-slate-50 -mx-6 -mb-6 px-6 py-3.5 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsStoreModalOpen(false)}
                  className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 bg-sky-700 hover:bg-sky-800 text-white rounded-lg font-semibold shadow-xs flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>确认存入冷库</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 弹窗 3: 【统计查询】 弹窗 */}
      {/* ============================================================== */}
      {isStatModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl overflow-hidden flex flex-col max-h-[88vh] animate-scaleIn">
            <div className="bg-sky-700 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-sky-200" />
                <span>全院标本留存统计分析与综合查询中心</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsStatModalOpen(false)}
                className="p-1 text-sky-200 hover:text-white rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* KPI 指标卡 */}
            <div className="p-4 grid grid-cols-4 gap-3 bg-slate-50 border-b border-slate-200">
              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-[10px] text-slate-500 block">全院冷存标本总量</span>
                <span className="text-lg font-bold font-mono text-slate-900">1,428 管</span>
                <span className="text-[10px] text-emerald-600 block mt-0.5">较上月 +12.4%</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-[10px] text-slate-500 block">本月入库留样</span>
                <span className="text-lg font-bold font-mono text-sky-700">520 管</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">合格率 99.8%</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-[10px] text-slate-500 block">临床借调复核</span>
                <span className="text-lg font-bold font-mono text-amber-700">38 管</span>
                <span className="text-[10px] text-amber-600 block mt-0.5">借出归还率 100%</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-[10px] text-slate-500 block">超期待无害化销毁</span>
                <span className="text-lg font-bold font-mono text-rose-700">24 管</span>
                <span className="text-[10px] text-rose-600 block mt-0.5">生物安全受控</span>
              </div>
            </div>

            {/* 查询明细表格 */}
            <div className="p-4 flex-1 overflow-y-auto space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">
                  当前冷库留样清单 ({specimens.length} 条记录)
                </span>
                <button
                  type="button"
                  onClick={() => triggerAction('已生成并导出《全科留存标本综合台账.xlsx》！')}
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-semibold flex items-center gap-1 shadow-2xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>导出报表</span>
                </button>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-100 text-[11px] font-bold text-slate-700 border-b border-slate-200">
                    <tr>
                      <th className="py-2 px-3">标本条码</th>
                      <th className="py-2 px-3">孔位</th>
                      <th className="py-2 px-3">类型</th>
                      <th className="py-2 px-3">患者姓名</th>
                      <th className="py-2 px-3">就诊科室</th>
                      <th className="py-2 px-3">存放时间</th>
                      <th className="py-2 px-3">存放人员</th>
                      <th className="py-2 px-3">状态</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {specimens.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50">
                        <td className="py-2 px-3 font-mono font-bold text-slate-900">{s.barcode}</td>
                        <td className="py-2 px-3 font-mono text-sky-800 font-semibold">{s.slotCoord}</td>
                        <td className="py-2 px-3">
                          <span
                            className={`px-1.5 py-0.2 rounded text-[10px] font-bold border ${getSpecimenTypeBadge(
                              s.specimenType
                            )}`}
                          >
                            {s.specimenType}
                          </span>
                        </td>
                        <td className="py-2 px-3 font-semibold text-slate-800">{s.patientName}</td>
                        <td className="py-2 px-3 text-slate-600">{s.department}</td>
                        <td className="py-2 px-3 font-mono text-slate-500">{s.storageTime}</td>
                        <td className="py-2 px-3 text-slate-700">{s.storageStaff}</td>
                        <td className="py-2 px-3">
                          <span
                            className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                              s.status === '在库'
                                ? 'bg-emerald-100 text-emerald-800'
                                : s.status === '借出中'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {s.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setIsStatModalOpen(false)}
                className="px-4 py-1.5 bg-sky-700 text-white rounded-lg font-semibold"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 弹窗 4: 【手工登记】 弹窗 */}
      {/* ============================================================== */}
      {isManualModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden animate-scaleIn">
            <div className="bg-sky-700 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-sky-200" />
                <span>急诊无码标本手工登记入库</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsManualModalOpen(false)}
                className="p-1 text-sky-200 hover:text-white rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveManual} className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 text-[11px]">
                提示：本模块用于夜间急诊断网或现场急救时无预置条码的应急标本登记，系统将自动分配手工留样编号与存放孔位。
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">患者真实姓名 *</label>
                  <input
                    type="text"
                    required
                    value={manualForm.patientName}
                    onChange={(e) => setManualForm({ ...manualForm, patientName: e.target.value })}
                    placeholder="如: 赵立峰"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded font-bold text-slate-900"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">标本类型 *</label>
                  <select
                    value={manualForm.specimenType}
                    onChange={(e) =>
                      setManualForm({ ...manualForm, specimenType: e.target.value as any })
                    }
                    className="w-full px-3 py-1.5 border border-slate-300 rounded font-medium"
                  >
                    <option value="血液">血液 (全血抗凝)</option>
                    <option value="尿液">尿液 (清洁晨尿)</option>
                    <option value="痰液">痰液 (呼吸道标本)</option>
                    <option value="血清">血清 (促凝管)</option>
                    <option value="脑脊液">脑脊液</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">就诊科室</label>
                  <input
                    type="text"
                    value={manualForm.department}
                    onChange={(e) => setManualForm({ ...manualForm, department: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">送检医生</label>
                  <input
                    type="text"
                    value={manualForm.doctor}
                    onChange={(e) => setManualForm({ ...manualForm, doctor: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">检验申请与诊断</label>
                <input
                  type="text"
                  value={manualForm.testOrder}
                  onChange={(e) => setManualForm({ ...manualForm, testOrder: e.target.value })}
                  placeholder="如: 急查心肌酶谱 + 肝肾功能"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded"
                />
              </div>

              <div className="bg-slate-50 -mx-6 -mb-6 px-6 py-3.5 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsManualModalOpen(false)}
                  className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold shadow-xs"
                >
                  完成手工登记并入库
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 弹窗 5: 【借出】 弹窗 */}
      {/* ============================================================== */}
      {isBorrowModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-scaleIn">
            <div className="bg-amber-600 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-amber-200" />
                <span>标本外借与调阅复查登记</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsBorrowModalOpen(false)}
                className="p-1 text-amber-200 hover:text-white rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleExecuteBorrow} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">选择借出标本 *</label>
                <select
                  required
                  value={borrowForm.specimenId}
                  onChange={(e) => setBorrowForm({ ...borrowForm, specimenId: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded font-medium"
                >
                  <option value="">-- 请选择当前在库标本 --</option>
                  {specimens
                    .filter((s) => s.status === '在库')
                    .map((s) => (
                      <option key={s.id} value={s.id}>
                        [{s.slotCoord}] {s.barcode} - {s.patientName} ({s.specimenType} /{' '}
                        {s.department})
                      </option>
                    ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">借用人真实姓名 *</label>
                  <input
                    type="text"
                    required
                    value={borrowForm.borrowerName}
                    onChange={(e) =>
                      setBorrowForm({ ...borrowForm, borrowerName: e.target.value })
                    }
                    placeholder="如: 李建国 (副主任医师)"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded font-semibold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">借用科室 / 单位</label>
                  <input
                    type="text"
                    value={borrowForm.borrowDept}
                    onChange={(e) => setBorrowForm({ ...borrowForm, borrowDept: e.target.value })}
                    placeholder="如: 呼吸重症监护室"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">借用事由</label>
                <select
                  value={borrowForm.borrowReason}
                  onChange={(e) =>
                    setBorrowForm({ ...borrowForm, borrowReason: e.target.value })
                  }
                  className="w-full px-3 py-1.5 border border-slate-300 rounded"
                >
                  <option value="临床科研复测与药敏回溯">临床科研复测与药敏回溯</option>
                  <option value="国家/省级室间质评盲样复查">国家/省级室间质评盲样复查</option>
                  <option value="医疗争议或疑似危急值第三方比对">
                    医疗争议或疑似危急值第三方比对
                  </option>
                  <option value="教学标本形态学示教">教学标本形态学示教</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">预计归还日期</label>
                <input
                  type="date"
                  value={borrowForm.expectedReturnDate}
                  onChange={(e) =>
                    setBorrowForm({ ...borrowForm, expectedReturnDate: e.target.value })
                  }
                  className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono font-bold"
                />
              </div>

              <div className="bg-slate-50 -mx-6 -mb-6 px-6 py-3.5 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsBorrowModalOpen(false)}
                  className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold shadow-xs"
                >
                  确认办理借出
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 弹窗 6: 【归还】 弹窗 */}
      {/* ============================================================== */}
      {isReturnModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-scaleIn">
            <div className="bg-teal-700 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-teal-200" />
                <span>借出标本验收与归还入库</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsReturnModalOpen(false)}
                className="p-1 text-teal-200 hover:text-white rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleExecuteReturn} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">选择归还标本 *</label>
                {borrowedSpecimens.length === 0 ? (
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center text-slate-500">
                    当前暂无外借中的标本。
                  </div>
                ) : (
                  <select
                    required
                    value={returnForm.specimenId}
                    onChange={(e) => setReturnForm({ ...returnForm, specimenId: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded font-medium"
                  >
                    <option value="">-- 请选择借出标本 --</option>
                    {borrowedSpecimens.map((s) => (
                      <option key={s.id} value={s.id}>
                        [{s.slotCoord}] {s.barcode} - {s.patientName} (借用人: {s.borrower})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">标本完整度核验</label>
                  <select
                    value={returnForm.returnCondition}
                    onChange={(e) =>
                      setReturnForm({ ...returnForm, returnCondition: e.target.value })
                    }
                    className="w-full px-3 py-1.5 border border-slate-300 rounded"
                  >
                    <option value="完好未融解">完好未融解 (标本量充裕)</option>
                    <option value="轻微消耗但余量合格">轻微消耗但余量合格</option>
                    <option value="已溶血/不可二次复查">已溶血/不可二次复查</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">归实验收人</label>
                  <input
                    type="text"
                    value={returnForm.returnOperator}
                    onChange={(e) =>
                      setReturnForm({ ...returnForm, returnOperator: e.target.value })
                    }
                    className="w-full px-3 py-1.5 border border-slate-300 rounded font-semibold text-slate-800"
                  />
                </div>
              </div>

              <div className="bg-slate-50 -mx-6 -mb-6 px-6 py-3.5 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsReturnModalOpen(false)}
                  className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={borrowedSpecimens.length === 0}
                  className="px-5 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-semibold shadow-xs disabled:opacity-50"
                >
                  确认验收归还
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 弹窗 7: 【销毁】 弹窗 */}
      {/* ============================================================== */}
      {isDestroyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh] animate-scaleIn">
            <div className="bg-rose-700 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-200" />
                <span>超期标本生物安全灭菌与销毁审批</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsDestroyModalOpen(false)}
                className="p-1 text-rose-200 hover:text-white rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-[11px]">
                警告：医疗废物销毁具有不可逆性。根据《医疗废物管理条例》及 ISO15189 准则，常温/冷藏血液标本留样期一般为 7 天。请认真核对标本超期状态与双人复核审批。
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-800">
                    可销毁超期标本 ({expiredSpecimens.length} 支)
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedDestroyIds.length === expiredSpecimens.length) {
                        setSelectedDestroyIds([]);
                      } else {
                        setSelectedDestroyIds(expiredSpecimens.map((s) => s.id));
                      }
                    }}
                    className="text-sky-700 hover:underline font-semibold"
                  >
                    {selectedDestroyIds.length === expiredSpecimens.length ? '取消全选' : '全部勾选'}
                  </button>
                </div>

                <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 max-h-48 overflow-y-auto">
                  {expiredSpecimens.map((s) => {
                    const isChecked = selectedDestroyIds.includes(s.id);
                    return (
                      <div
                        key={s.id}
                        onClick={() => {
                          if (isChecked) {
                            setSelectedDestroyIds(selectedDestroyIds.filter((id) => id !== s.id));
                          } else {
                            setSelectedDestroyIds([...selectedDestroyIds, s.id]);
                          }
                        }}
                        className={`p-2.5 flex items-center justify-between cursor-pointer transition-colors ${
                          isChecked ? 'bg-rose-50/60' : 'hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}}
                            className="rounded text-rose-600 focus:ring-rose-500"
                          />
                          <div>
                            <span className="font-mono font-bold text-slate-900">{s.barcode}</span>
                            <span className="ml-2 font-semibold text-slate-800">{s.patientName}</span>
                            <span className="ml-2 text-slate-500 font-mono">[{s.slotCoord}]</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-500">{s.specimenType}</span>
                          <span className="text-rose-700 font-mono font-semibold">
                            到期日: {s.expireTime}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    科室审批负责人 (真实医师)
                  </label>
                  <select
                    value={destroyApprover}
                    onChange={(e) => setDestroyApprover(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded font-semibold text-slate-800"
                  >
                    <option value="张建华 (科主任/主任检验师)">
                      张建华 (科主任 / 主任检验师)
                    </option>
                    <option value="王雪梅 (质控主管/副主任检验师)">
                      王雪梅 (质控主管 / 副主任检验师)
                    </option>
                    <option value="孙晓东 (生物安全员/副主任技师)">
                      孙晓东 (生物安全员 / 副主任技师)
                    </option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">灭菌与销毁方式</label>
                  <input
                    type="text"
                    readOnly
                    value="121℃ 高压蒸汽灭菌 30min + 医疗危废移交"
                    className="w-full px-3 py-1.5 bg-slate-100 border border-slate-200 rounded font-medium text-slate-700"
                  />
                </div>
              </div>
            </div>

            <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex justify-between items-center">
              <span className="text-slate-500">
                已勾选：<strong className="text-rose-700">{selectedDestroyIds.length}</strong> 支标本
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsDestroyModalOpen(false)}
                  className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={handleExecuteDestroy}
                  disabled={selectedDestroyIds.length === 0}
                  className="px-5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-semibold shadow-xs disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>审批并销毁出库</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 弹窗 8: 【修改】 弹窗 */}
      {/* ============================================================== */}
      {isEditModalOpen && editForm.id && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-scaleIn">
            <div className="bg-sky-700 text-white px-6 py-4 flex items-center justify-between">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-sky-200" />
                <span>修改标本与患者档案信息</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 text-sky-200 hover:text-white rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">标本条码 (不可修改)</label>
                  <input
                    type="text"
                    disabled
                    value={editForm.barcode}
                    className="w-full px-3 py-1.5 bg-slate-100 border border-slate-200 rounded font-mono font-bold text-slate-600"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">当前孔位</label>
                  <input
                    type="text"
                    value={editForm.slotCoord}
                    onChange={(e) => setEditForm({ ...editForm, slotCoord: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">患者真实姓名</label>
                  <input
                    type="text"
                    value={editForm.patientName}
                    onChange={(e) => setEditForm({ ...editForm, patientName: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">采集部位</label>
                  <input
                    type="text"
                    value={editForm.collectionSite}
                    onChange={(e) => setEditForm({ ...editForm, collectionSite: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">临床诊断更新</label>
                <input
                  type="text"
                  value={editForm.diagnosis}
                  onChange={(e) => setEditForm({ ...editForm, diagnosis: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">实验留存备注</label>
                <textarea
                  rows={2}
                  value={editForm.remarks || ''}
                  onChange={(e) => setEditForm({ ...editForm, remarks: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded"
                />
              </div>

              <div className="bg-slate-50 -mx-6 -mb-6 px-6 py-3.5 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 bg-sky-700 hover:bg-sky-800 text-white rounded-lg font-semibold shadow-xs"
                >
                  保存修改
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 弹窗 9: 【撤销】 确认弹窗 */}
      {/* ============================================================== */}
      {isUndoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-sm overflow-hidden animate-scaleIn">
            <div className="p-5 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
                <RotateCcw className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">撤销上一笔孔位/操作记录？</h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                系统将自动回滚上一笔标本移位、状态修改或入库记录，确保冷库网格台账与物理标本绝对一致。
              </p>
            </div>
            <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsUndoModalOpen(false)}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleExecuteUndo}
                className="px-4 py-1.5 bg-sky-700 hover:bg-sky-800 text-white rounded-lg font-semibold shadow-xs"
              >
                确认撤销
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
