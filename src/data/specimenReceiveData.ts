export interface PendingReceiveItem {
  id: string;
  patientName: string;
  barcode: string;
  testItem: string;
  sampleType: '全血' | '血清' | '血浆' | '尿液' | '胸腹水' | '脑脊液';
  tubeSpec: string;
  tubeColor: 'orange' | 'green' | 'purple' | 'blue' | 'yellow' | 'red';
  isUrgent: boolean;
  department: string;
  bedNo?: string;
  gender: '男' | '女';
  age: string;
  applyDoctor: string;
}

export interface InboundBatchInfo {
  batchNo: string;
  sendDept: string;
  deliverer: string;
  sendTime: string;
  sourceType: 'hospital' | 'outreach'; // 院内病区 | 院外医联体
  sourceHospital: string;
  totalCount: number;
  urgentCount: number;
  boxTemperature?: string;
}

export interface ReceivedRecordItem {
  id: string;
  deliveryBatchNo: string;
  sendTime: string;
  deliverer: string;
  sendHospital: string;
  sendDept: string;
  patientName: string;
  medicalRecordNo: string;
  barcode: string;
  sampleType: string;
  testItem: string;
  tubeContainer: string;
  receiveTime: string;
  receiver: string;
  pipelineDestination: string; // 签收后流水线自动化分拣目标
  status: '已签收' | '已上机' | '已分拣';
  isUrgent: boolean;
}

export interface RejectedRecordItem {
  id: string;
  barcode: string;
  deliveryBatchNo: string;
  patientName: string;
  gender: string;
  age: string;
  ward: string;
  bedNo: string;
  testItem: string;
  sampleType: string;
  rejectReason: string;
  rejectTime: string;
  rejectTechnician: string;
  suggestAction: string;
  deliverer: string;
}

// 近期基准时间 2026-10-26
export const INITIAL_INBOUND_BATCH: InboundBatchInfo = {
  batchNo: 'SJ00000212',
  sendDept: '内一科 (住院部6楼)',
  deliverer: '李明辉',
  sendTime: '2026-10-26 08:12:34',
  sourceType: 'hospital',
  sourceHospital: '市中心医院 (总院)',
  totalCount: 32,
  urgentCount: 2,
  boxTemperature: '4.1℃',
};

// 待签收核验的当前标本池 (基于截图升级为真实患者与近期时间)
export const INITIAL_PENDING_RECEIVE_ITEMS: PendingReceiveItem[] = [
  {
    id: 'PR-01',
    patientName: '张振华',
    barcode: '0011812170001',
    testItem: '血常规5分类 (XCGWFL)',
    sampleType: '全血',
    tubeSpec: '紫盖 EDTA-K2 2.0ml',
    tubeColor: 'purple',
    isUrgent: false,
    department: '内一科',
    bedNo: '1床',
    gender: '男',
    age: '54岁',
    applyDoctor: '王志强主任',
  },
  {
    id: 'PR-02',
    patientName: '张振华',
    barcode: '0011812170002',
    testItem: '肝脏功能测定 (GZGNCD)',
    sampleType: '血清',
    tubeSpec: '黄盖 分离胶促凝管 4.0ml',
    tubeColor: 'orange',
    isUrgent: false,
    department: '内一科',
    bedNo: '1床',
    gender: '男',
    age: '54岁',
    applyDoctor: '王志强主任',
  },
  {
    id: 'PR-03',
    patientName: '李淑琴',
    barcode: '0011812170012',
    testItem: '全血细胞分析+CRP五分类',
    sampleType: '全血',
    tubeSpec: '紫盖 EDTA-K2 2.0ml',
    tubeColor: 'purple',
    isUrgent: false,
    department: '妇科门诊',
    bedNo: '门诊',
    gender: '女',
    age: '32岁',
    applyDoctor: '吴敏霞副主任',
  },
  {
    id: 'PR-04',
    patientName: '李淑琴',
    barcode: '0011812170013',
    testItem: '孕酮(YT)+人绒毛膜促性腺激素(HCG)',
    sampleType: '血清',
    tubeSpec: '黄盖 促凝胶管 4.0ml',
    tubeColor: 'orange',
    isUrgent: false,
    department: '妇科门诊',
    bedNo: '门诊',
    gender: '女',
    age: '32岁',
    applyDoctor: '吴敏霞副主任',
  },
  {
    id: 'PR-05',
    patientName: '周德成',
    barcode: '0011812170021',
    testItem: '急诊心肌三项 (hs-cTnI/CK-MB/Myo)',
    sampleType: '全血',
    tubeSpec: '绿盖 肝素锂抗凝管 3.0ml',
    tubeColor: 'green',
    isUrgent: true,
    department: '急诊抢救室',
    bedNo: '急2床',
    gender: '男',
    age: '72岁',
    applyDoctor: '陈欣欣主治',
  },
  {
    id: 'PR-06',
    patientName: '赵国庆',
    barcode: '0011812170023',
    testItem: '急诊动脉血气分析+乳酸测定',
    sampleType: '全血',
    tubeSpec: '平衡肝素 动脉采血针 2.0ml',
    tubeColor: 'green',
    isUrgent: true,
    department: '急诊抢救室',
    bedNo: '急3床',
    gender: '男',
    age: '49岁',
    applyDoctor: '张伟民副主任',
  },
];

// 已签收历史流水记录 (基于截图扩展，人名真实化、近期时间)
export const INITIAL_RECEIVED_HISTORY: ReceivedRecordItem[] = [
  {
    id: 'RC-01',
    deliveryBatchNo: '18121700001',
    sendTime: '2026-10-26 08:12:34',
    deliverer: '李明辉',
    sendHospital: '市中心医院 (东院区)',
    sendDept: '内一科',
    patientName: '张振华',
    medicalRecordNo: '1811301101',
    barcode: '0011812170001',
    sampleType: '全血',
    testItem: '血常规5分类(XCGWFL)',
    tubeContainer: '紫头管 (EDTA-K2)',
    receiveTime: '2026-10-26 08:15:20',
    receiver: '张珊',
    pipelineDestination: '生化免疫流水线 (离心工位A)',
    status: '已签收',
    isUrgent: false,
  },
  {
    id: 'RC-02',
    deliveryBatchNo: '18121700001',
    sendTime: '2026-10-26 08:12:34',
    deliverer: '李明辉',
    sendHospital: '市中心医院 (东院区)',
    sendDept: '内一科',
    patientName: '张振华',
    medicalRecordNo: '1811301101',
    barcode: '0011812170002',
    sampleType: '血清',
    testItem: '肝脏功能测定(GZGNCD)',
    tubeContainer: '黄头管 (促凝胶SST)',
    receiveTime: '2026-10-26 08:15:20',
    receiver: '张珊',
    pipelineDestination: '生化免疫流水线 (生化分析仪1)',
    status: '已分拣',
    isUrgent: false,
  },
  {
    id: 'RC-03',
    deliveryBatchNo: '18121700002',
    sendTime: '2026-10-26 08:12:34',
    deliverer: '孙晓雷',
    sendHospital: '市妇幼保健院分院',
    sendDept: '妇科门诊',
    patientName: '李淑琴',
    medicalRecordNo: '1812171143',
    barcode: '0011812170012',
    sampleType: '全血',
    testItem: '血常规5分类(XCGWFL)',
    tubeContainer: '紫头管 (EDTA-K2)',
    receiveTime: '2026-10-26 09:12:34',
    receiver: '张珊',
    pipelineDestination: '血常规推片机 (Sysmex XN)',
    status: '已上机',
    isUrgent: false,
  },
  {
    id: 'RC-04',
    deliveryBatchNo: '18121700002',
    sendTime: '2026-10-26 08:12:34',
    deliverer: '孙晓雷',
    sendHospital: '市妇幼保健院分院',
    sendDept: '妇科门诊',
    patientName: '李淑琴',
    medicalRecordNo: '1812171143',
    barcode: '0011812170013',
    sampleType: '血清',
    testItem: '孕酮(YT)化学发光测定',
    tubeContainer: '黄头管 (促凝胶SST)',
    receiveTime: '2026-10-26 09:12:34',
    receiver: '张珊',
    pipelineDestination: '化学发光室 (贝克曼DxI800)',
    status: '已分拣',
    isUrgent: false,
  },
  {
    id: 'RC-05',
    deliveryBatchNo: '18121700003',
    sendTime: '2026-10-26 09:40:00',
    deliverer: '郭浩然',
    sendHospital: '市急救中心转运站',
    sendDept: '急诊科',
    patientName: '周德成',
    medicalRecordNo: '1812200388',
    barcode: '0011812170022',
    sampleType: '血浆',
    testItem: 'D-二聚体快速定量测定',
    tubeContainer: '蓝头管 (枸橼酸钠)',
    receiveTime: '2026-10-26 09:48:10',
    receiver: '刘建国',
    pipelineDestination: '急查凝血工位 (Stago-R Max)',
    status: '已上机',
    isUrgent: true,
  },
  {
    id: 'RC-06',
    deliveryBatchNo: '18121700004',
    sendTime: '2026-10-26 10:15:00',
    deliverer: '李明辉',
    sendHospital: '市康复医疗院区',
    sendDept: '心内科病区',
    patientName: '王建平',
    medicalRecordNo: '1812210512',
    barcode: '0011812170031',
    sampleType: '血清',
    testItem: '高敏肌钙蛋白I (hs-cTnI)',
    tubeContainer: '黄头管 (促凝胶SST)',
    receiveTime: '2026-10-26 10:22:15',
    receiver: '张珊',
    pipelineDestination: '急诊发光仪 (Abbott Alinity)',
    status: '已签收',
    isUrgent: true,
  },
];

// 已拒收标本数据
export const INITIAL_REJECTED_LIST: RejectedRecordItem[] = [
  {
    id: 'REJ-REC-01',
    barcode: '0011812170099',
    deliveryBatchNo: '18121700001',
    patientName: '钱学林',
    gender: '男',
    age: '54岁',
    ward: '内一科',
    bedNo: '18床',
    testItem: '血乳酸测定+动脉血气分析',
    sampleType: '全血',
    rejectReason: '送检过程保温箱温控超标(达12℃)，且采血至送检超时引起标本重度溶血',
    rejectTime: '2026-10-26 08:25:40',
    rejectTechnician: '张珊 (主管检验师)',
    suggestAction: '通知内一科责任护士重新抽取标本，重置冰袋冷链转运',
    deliverer: '李明辉',
  },
  {
    id: 'REJ-REC-02',
    barcode: '0011812170088',
    deliveryBatchNo: '18121700002',
    patientName: '吴海燕',
    gender: '女',
    age: '43岁',
    ward: '神经内科',
    bedNo: '20床',
    testItem: '凝血常规四项 (PT/APTT/TT/FIB)',
    sampleType: '血浆',
    rejectReason: '枸橼酸钠抗凝管采血量不足(仅1.0ml，未达2.7ml刻度)，抗凝比例失调',
    rejectTime: '2026-10-26 09:30:15',
    rejectTechnician: '刘建国 (检验师)',
    suggestAction: '请临床护士严格抽吸至抗凝管刻度线后重送',
    deliverer: '孙晓雷',
  },
];
