export interface PackageDetailItem {
  id: string;
  patientName: string;
  patientType: '住院' | '门诊' | '急诊' | '体检';
  medicalRecordNo: string;
  barcode: string;
  sampleType: '全血' | '血清' | '血浆' | '尿液' | '痰液' | '胸水' | '便';
  testItem: string;
  applyDept: string;
  doctor: string;
  packageBarcode: string;
  tubeContainer?: string;
  specimenStatus?: '已打包' | '已送检';
}

export interface PackageBatchItem {
  id: string;
  status: '已打包' | '已送检' | '已签收';
  packageBarcode: string;
  packer: string;
  packTime: string;
  itemCount: number;
  fromDept: string;
  destinationDept: string;
  transferBoxNo?: string;
}

export const DEFAULT_PACK_START_DATE = '2026-10-26 00:00';
export const DEFAULT_PACK_END_DATE = '2026-10-26 23:59';

// 初始包列表数据 (根据用户需求生成真实人名并更新为近期时间与丰富临床数据)
export const INITIAL_PACKAGES: PackageBatchItem[] = [
  // 截图中的第一条与第二条对应的包 18121700001 (打包人更新为真实临床护士：陈晓琳)
  {
    id: 'PKG-2026102601',
    status: '已打包',
    packageBarcode: '18121700001',
    packer: '陈晓琳',
    packTime: '2026-10-26 10:15:00',
    itemCount: 2,
    fromDept: '内科病区',
    destinationDept: '检验科临检/生化室',
    transferBoxNo: 'BOX-01',
  },
  // 截图中的第三条对应的包 18121700002 (已打包)
  {
    id: 'PKG-2026102602',
    status: '已打包',
    packageBarcode: '18121700002',
    packer: '陈晓琳',
    packTime: '2026-10-26 10:30:00',
    itemCount: 2,
    fromDept: '妇科门诊采血室',
    destinationDept: '检验科生化免疫室',
    transferBoxNo: 'BOX-02',
  },
  // 截图中的第四条对应的包 18121700003 (已送检，状态显示绿色且不可撤销)
  {
    id: 'PKG-2026102603',
    status: '已送检',
    packageBarcode: '18121700003',
    packer: '郭慧敏',
    packTime: '2026-10-26 09:40:00',
    itemCount: 3,
    fromDept: '急诊检验采血台',
    destinationDept: '检验科急查生化室',
    transferBoxNo: 'EMERGENCY-01',
  },
  // 更新扩充包 18121700004 (已打包，待送检转运)
  {
    id: 'PKG-2026102604',
    status: '已打包',
    packageBarcode: '18121700004',
    packer: '李晓华',
    packTime: '2026-10-26 11:05:22',
    itemCount: 4,
    fromDept: '心血管内科病区',
    destinationDept: '临床生化免疫分析流水线',
    transferBoxNo: 'BOX-03',
  },
];

// 初始包明细数据 (患者姓名与开单医生全面真实化)
export const INITIAL_PACKAGE_DETAILS: PackageDetailItem[] = [
  // 属于包 18121700001 的标本 (患者：张振华，申请医生：王志强)
  {
    id: 'DT-01',
    patientName: '张振华',
    patientType: '住院',
    medicalRecordNo: '1811301101',
    barcode: '0011812170001',
    sampleType: '全血',
    testItem: '血常规5分类(XCGWFL)',
    applyDept: '内科',
    doctor: '王志强',
    packageBarcode: '18121700001',
    tubeContainer: '紫头管(EDTA-K2)',
    specimenStatus: '已打包',
  },
  {
    id: 'DT-02',
    patientName: '张振华',
    patientType: '住院',
    medicalRecordNo: '1811301101',
    barcode: '0011812170002',
    sampleType: '血清',
    testItem: '肝脏功能测定(GZGNCD)',
    applyDept: '内科',
    doctor: '王志强',
    packageBarcode: '18121700001',
    tubeContainer: '黄头管(促凝胶SST)',
    specimenStatus: '已打包',
  },

  // 属于包 18121700002 的标本 (患者：李淑琴，申请医生：吴敏霞)
  {
    id: 'DT-03',
    patientName: '李淑琴',
    patientType: '门诊',
    medicalRecordNo: '1812171143',
    barcode: '0011812170012',
    sampleType: '全血',
    testItem: '血常规5分类(XCGWFL)',
    applyDept: '妇科',
    doctor: '吴敏霞',
    packageBarcode: '18121700002',
    tubeContainer: '紫头管(EDTA-K2)',
    specimenStatus: '已打包',
  },
  {
    id: 'DT-04',
    patientName: '李淑琴',
    patientType: '门诊',
    medicalRecordNo: '1812171143',
    barcode: '0011812170013',
    sampleType: '血清',
    testItem: '孕酮(YT)',
    applyDept: '妇科',
    doctor: '吴敏霞',
    packageBarcode: '18121700002',
    tubeContainer: '黄头管(促凝胶SST)',
    specimenStatus: '已打包',
  },

  // 属于包 18121700003 的标本 (已送检)
  {
    id: 'DT-05',
    patientName: '周德成',
    patientType: '急诊',
    medicalRecordNo: '1812200388',
    barcode: '0011812170021',
    sampleType: '全血',
    testItem: '急诊心肌三项 (肌钙蛋白+CK-MB+Myo)',
    applyDept: '急诊科',
    doctor: '陈欣欣',
    packageBarcode: '18121700003',
    tubeContainer: '绿头管(肝素锂)',
    specimenStatus: '已送检',
  },
  {
    id: 'DT-06',
    patientName: '周德成',
    patientType: '急诊',
    medicalRecordNo: '1812200388',
    barcode: '0011812170022',
    sampleType: '血浆',
    testItem: 'D-二聚体定量测定',
    applyDept: '急诊科',
    doctor: '陈欣欣',
    packageBarcode: '18121700003',
    tubeContainer: '蓝头管(枸橼酸钠)',
    specimenStatus: '已送检',
  },
  {
    id: 'DT-07',
    patientName: '赵国庆',
    patientType: '急诊',
    medicalRecordNo: '1812200392',
    barcode: '0011812170023',
    sampleType: '全血',
    testItem: '急诊血气分析+电解质',
    applyDept: '急诊科',
    doctor: '张伟民',
    packageBarcode: '18121700003',
    tubeContainer: '动脉采血针',
    specimenStatus: '已送检',
  },

  // 属于包 18121700004 的标本
  {
    id: 'DT-08',
    patientName: '王建平',
    patientType: '住院',
    medicalRecordNo: '1812210512',
    barcode: '0011812170031',
    sampleType: '血清',
    testItem: '高敏肌钙蛋白I (hs-cTnI)',
    applyDept: '心内科',
    doctor: '李明哲',
    packageBarcode: '18121700004',
    tubeContainer: '黄头管(促凝胶SST)',
    specimenStatus: '已打包',
  },
  {
    id: 'DT-09',
    patientName: '王建平',
    patientType: '住院',
    medicalRecordNo: '1812210512',
    barcode: '0011812170032',
    sampleType: '血清',
    testItem: 'B型利钠肽前体 (NT-proBNP)',
    applyDept: '心内科',
    doctor: '李明哲',
    packageBarcode: '18121700004',
    tubeContainer: '黄头管(促凝胶SST)',
    specimenStatus: '已打包',
  },
  {
    id: 'DT-10',
    patientName: '孙秀珍',
    patientType: '住院',
    medicalRecordNo: '1812210519',
    barcode: '0011812170033',
    sampleType: '血浆',
    testItem: '凝血常规四项 (PT/APTT/TT/FIB)',
    applyDept: '心内科',
    doctor: '王丽芳',
    packageBarcode: '18121700004',
    tubeContainer: '蓝头管(枸橼酸钠)',
    specimenStatus: '已打包',
  },
  {
    id: 'DT-11',
    patientName: '孙秀珍',
    patientType: '住院',
    medicalRecordNo: '1812210519',
    barcode: '0011812170034',
    sampleType: '全血',
    testItem: '全血细胞五分类+CRP',
    applyDept: '心内科',
    doctor: '王丽芳',
    packageBarcode: '18121700004',
    tubeContainer: '紫头管(EDTA-K2)',
    specimenStatus: '已打包',
  },
];

// 待打包标本池 (用于新发起"标本打包"时勾选选择)
export const PENDING_PACK_CANDIDATES: PackageDetailItem[] = [
  {
    id: 'CAND-01',
    patientName: '钱学林',
    patientType: '住院',
    medicalRecordNo: '1812220101',
    barcode: '0011812170041',
    sampleType: '全血',
    testItem: '全血细胞分析',
    applyDept: '神经内科',
    doctor: '刘建国',
    packageBarcode: '',
    tubeContainer: '紫头管',
  },
  {
    id: 'CAND-02',
    patientName: '钱学林',
    patientType: '住院',
    medicalRecordNo: '1812220101',
    barcode: '0011812170042',
    sampleType: '血清',
    testItem: '电解质六项+肾功能',
    applyDept: '神经内科',
    doctor: '刘建国',
    packageBarcode: '',
    tubeContainer: '黄头管',
  },
  {
    id: 'CAND-03',
    patientName: '吴海燕',
    patientType: '住院',
    medicalRecordNo: '1812220108',
    barcode: '0011812170043',
    sampleType: '血清',
    testItem: '降钙素原(PCT)定量',
    applyDept: 'ICU重症医学科',
    doctor: '王世杰主任',
    packageBarcode: '',
    tubeContainer: '黄头管',
  },
  {
    id: 'CAND-04',
    patientName: '吴海燕',
    patientType: '住院',
    medicalRecordNo: '1812220108',
    barcode: '0011812170044',
    sampleType: '全血',
    testItem: '血培养及药敏 (双套)',
    applyDept: 'ICU重症医学科',
    doctor: '王世杰主任',
    packageBarcode: '',
    tubeContainer: '培养瓶',
  },
];
