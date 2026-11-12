export interface DeliveryDetailItem {
  id: string;
  patientName: string;
  patientType: '住院' | '门诊' | '急诊' | '体检';
  medicalRecordNo: string;
  barcode: string;
  sampleType: '全血' | '血清' | '血浆' | '尿液' | '痰液' | '胸水' | '便';
  testItem: string;
  applyDept: string;
  doctor: string;
  deliveryBatchNo: string; // 关联送检单号
  tubeContainer?: string;
  status: '已送检' | '已接收' | '已拒收';
}

export interface DeliveryBatchItem {
  id: string;
  deliveryBatchNo: string; // 送检单号
  status: '已送检' | '已接收' | '部分接收';
  applyHospital: string;    // 申请医院/院区
  deliveryTime: string;     // 送检时间
  receiveHospital: string;  // 接收医院/检验中心
  deliverer: string;        // 真实送检人
  receiver?: string;        // 接收人
  receiveTime?: string;     // 接收时间
  vehiclePlate?: string;    // 冷链转运车号
  boxTemperature?: string;  // 箱内温控读数
  itemCount: number;        // 标本数量
}

export const DEFAULT_DELIVERY_START_DATE = '2026-10-26 00:00';
export const DEFAULT_DELIVERY_END_DATE = '2026-10-26 23:59';

// 初始送检单数据（基于截图并全面升级为近期时间、真实送检人员及多院区协同数据）
export const INITIAL_DELIVERY_BATCHES: DeliveryBatchItem[] = [
  // 截图对应单号 18121700001 (已送检)
  {
    id: 'DELIV-2026102601',
    deliveryBatchNo: '18121700001',
    status: '已送检',
    applyHospital: '市中心医院 (东院区)',
    deliveryTime: '2026-10-26 10:20:00',
    receiveHospital: '市中心医院总院检验中心',
    deliverer: '李明辉',
    vehiclePlate: '粤A·E8821 (标本冷链专车)',
    boxTemperature: '4.2℃',
    itemCount: 2,
  },
  // 截图对应单号 18121700002 (已接收，状态显绿色且不可撤销)
  {
    id: 'DELIV-2026102602',
    deliveryBatchNo: '18121700002',
    status: '已接收',
    applyHospital: '市妇幼保健院分院',
    deliveryTime: '2026-10-26 09:30:00',
    receiveHospital: '市中心医院总院检验中心',
    deliverer: '孙晓雷',
    receiver: '张珊 (中心生化组)',
    receiveTime: '2026-10-26 09:55:12',
    vehiclePlate: '粤A·M6109 (恒温转运车)',
    boxTemperature: '3.8℃',
    itemCount: 2,
  },
  // 扩充送检批次 18121700003 (已送检，急诊专线)
  {
    id: 'DELIV-2026102603',
    deliveryBatchNo: '18121700003',
    status: '已送检',
    applyHospital: '市急救中心转运站',
    deliveryTime: '2026-10-26 11:15:00',
    receiveHospital: '市中心医院总院急查检验科',
    deliverer: '郭浩然',
    vehiclePlate: '粤A·X9920 (极速转运车)',
    boxTemperature: '4.0℃',
    itemCount: 3,
  },
  // 扩充送检批次 18121700004 (已送检，心血管慢病筛查专箱)
  {
    id: 'DELIV-2026102604',
    deliveryBatchNo: '18121700004',
    status: '已送检',
    applyHospital: '市康复医疗院区',
    deliveryTime: '2026-10-26 11:35:00',
    receiveHospital: '市中心医院总院医学检验科',
    deliverer: '李明辉',
    vehiclePlate: '粤A·E8821 (标本冷链专车)',
    boxTemperature: '4.5℃',
    itemCount: 4,
  },
];

// 初始送检明细标本数据（人名真实化、时间近期化、项目规范化）
export const INITIAL_DELIVERY_DETAILS: DeliveryDetailItem[] = [
  // 属于单号 18121700001 (患者：张振华)
  {
    id: 'DLD-01',
    patientName: '张振华',
    patientType: '住院',
    medicalRecordNo: '1811301101',
    barcode: '0011812170001',
    sampleType: '全血',
    testItem: '血常规5分类(XCGWFL)',
    applyDept: '内科',
    doctor: '王志强主任',
    deliveryBatchNo: '18121700001',
    tubeContainer: '紫头管 (EDTA-K2)',
    status: '已送检',
  },
  {
    id: 'DLD-02',
    patientName: '张振华',
    patientType: '住院',
    medicalRecordNo: '1811301101',
    barcode: '0011812170002',
    sampleType: '血清',
    testItem: '肝脏功能测定(GZGNCD)',
    applyDept: '内科',
    doctor: '王志强主任',
    deliveryBatchNo: '18121700001',
    tubeContainer: '黄头管 (促凝胶SST)',
    status: '已送检',
  },

  // 属于单号 18121700002 (患者：李淑琴，已接收)
  {
    id: 'DLD-03',
    patientName: '李淑琴',
    patientType: '门诊',
    medicalRecordNo: '1812171143',
    barcode: '0011812170012',
    sampleType: '全血',
    testItem: '血常规5分类(XCGWFL)',
    applyDept: '妇科',
    doctor: '吴敏霞副主任',
    deliveryBatchNo: '18121700002',
    tubeContainer: '紫头管 (EDTA-K2)',
    status: '已接收',
  },
  {
    id: 'DLD-04',
    patientName: '李淑琴',
    patientType: '门诊',
    medicalRecordNo: '1812171143',
    barcode: '0011812170013',
    sampleType: '血清',
    testItem: '孕酮(YT)化学发光测定',
    applyDept: '妇科',
    doctor: '吴敏霞副主任',
    deliveryBatchNo: '18121700002',
    tubeContainer: '黄头管 (促凝胶SST)',
    status: '已接收',
  },

  // 属于单号 18121700003 (急诊患者：周德成、赵国庆)
  {
    id: 'DLD-05',
    patientName: '周德成',
    patientType: '急诊',
    medicalRecordNo: '1812200388',
    barcode: '0011812170021',
    sampleType: '全血',
    testItem: '急诊心肌三项 (hs-cTnI/CK-MB/Myo)',
    applyDept: '急诊科',
    doctor: '陈欣欣主治',
    deliveryBatchNo: '18121700003',
    tubeContainer: '绿头管 (肝素锂)',
    status: '已送检',
  },
  {
    id: 'DLD-06',
    patientName: '周德成',
    patientType: '急诊',
    medicalRecordNo: '1812200388',
    barcode: '0011812170022',
    sampleType: '血浆',
    testItem: 'D-二聚体快速定量测定',
    applyDept: '急诊科',
    doctor: '陈欣欣主治',
    deliveryBatchNo: '18121700003',
    tubeContainer: '蓝头管 (枸橼酸钠)',
    status: '已送检',
  },
  {
    id: 'DLD-07',
    patientName: '赵国庆',
    patientType: '急诊',
    medicalRecordNo: '1812200392',
    barcode: '0011812170023',
    sampleType: '全血',
    testItem: '急诊动脉血气分析+电解质',
    applyDept: '急诊科',
    doctor: '张伟民副主任',
    deliveryBatchNo: '18121700003',
    tubeContainer: '动脉采血针 (平衡肝素)',
    status: '已送检',
  },

  // 属于单号 18121700004 (患者：王建平、孙秀珍)
  {
    id: 'DLD-08',
    patientName: '王建平',
    patientType: '住院',
    medicalRecordNo: '1812210512',
    barcode: '0011812170031',
    sampleType: '血清',
    testItem: '高敏肌钙蛋白I (hs-cTnI)',
    applyDept: '心内科',
    doctor: '李明哲主治',
    deliveryBatchNo: '18121700004',
    tubeContainer: '黄头管 (促凝胶SST)',
    status: '已送检',
  },
  {
    id: 'DLD-09',
    patientName: '王建平',
    patientType: '住院',
    medicalRecordNo: '1812210512',
    barcode: '0011812170032',
    sampleType: '血清',
    testItem: 'B型利钠肽前体 (NT-proBNP)',
    applyDept: '心内科',
    doctor: '李明哲主治',
    deliveryBatchNo: '18121700004',
    tubeContainer: '黄头管 (促凝胶SST)',
    status: '已送检',
  },
  {
    id: 'DLD-10',
    patientName: '孙秀珍',
    patientType: '住院',
    medicalRecordNo: '1812210519',
    barcode: '0011812170033',
    sampleType: '血浆',
    testItem: '凝血常规四项 (PT/APTT/TT/FIB)',
    applyDept: '心内科',
    doctor: '王丽芳主任',
    deliveryBatchNo: '18121700004',
    tubeContainer: '蓝头管 (枸橼酸钠)',
    status: '已送检',
  },
  {
    id: 'DLD-11',
    patientName: '孙秀珍',
    patientType: '住院',
    medicalRecordNo: '1812210519',
    barcode: '0011812170034',
    sampleType: '全血',
    testItem: '全血细胞五分类+CRP',
    applyDept: '心内科',
    doctor: '王丽芳主任',
    deliveryBatchNo: '18121700004',
    tubeContainer: '紫头管 (EDTA-K2)',
    status: '已送检',
  },
];

// 拒收标本列表（对应"拒收标本 1"及右下角浮窗）
export const REJECTED_DELIVERY_SAMPLES = [
  {
    id: 'REJ-01',
    patientName: '钱学林',
    patientType: '住院' as const,
    bedNo: '18床',
    ward: '内一科',
    medicalRecordNo: '1812220101',
    barcode: '0011812170099',
    sampleType: '全血' as const,
    testItem: '血乳酸测定+动脉血气分析',
    applyDept: '内一科病区',
    doctor: '陈欣欣主治',
    deliveryBatchNo: '18121700001',
    rejectReason: '送检过程保温箱温控超标(达12℃)，且采血至送检超时引起标本重度溶血',
    rejectTime: '2026-10-26 10:45:18',
    rejectDoctor: '张珊 (主管检验师)',
    suggestAction: '通知内一科责任护士重新抽取标本，重置冰袋冷链转运',
  },
];

// 待送检的待发包候选池（用于“发起标本送检”弹窗选择）
export const PENDING_DELIVERY_CANDIDATES = [
  {
    packageBarcode: '18121700005',
    fromDept: '神经内科病区采血站',
    packer: '陈晓琳',
    packTime: '2026-10-26 11:20:00',
    itemCount: 3,
    suggestHospital: '市中心医院总院检验中心',
  },
  {
    packageBarcode: '18121700006',
    fromDept: '普外科病区采血站',
    packer: '李晓华',
    packTime: '2026-10-26 11:35:00',
    itemCount: 5,
    suggestHospital: '市中心医院总院检验中心',
  },
];
