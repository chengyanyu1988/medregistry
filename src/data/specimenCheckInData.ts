export interface CheckInPatientDetail {
  patientSource: '住院' | '门诊' | '急诊' | '体检';
  name: string;
  ethnicity: string;
  gender: '男' | '女';
  birthDate: string;
  age: string;
  phone: string;
  medicalRecordNo: string;
  applyDoctor: string;
  department: string;
  doctorPhone: string;
  ward: string;
  nursePhone: string;
  bedNo: string;
  sendDept: string;
  clinicalDiagnosis: string;
  extraInfo: string;
  // Specimen details
  applyItem: string;
  barcode: string;
  sampleType: string;
  collectMethod: string;
  collectSite: string;
  applyTime: string;
  sendTime: string;
  checkInTime: string;
  auditTime: string;
  unqualifiedReason: string;
  unqualifiedRemark: string;
}

export interface CheckInRecordItem {
  id: string;
  reportStatus: '未出' | '已出' | '已审';
  checkInStatus: '已核收' | '让步核收' | '不合格' | '已拒收' | '待核收';
  isUrgent: boolean;
  barcode: string;
  patientId: string;
  patientName: string;
  sampleType: string;
  testItem: string;
  department: string;
  applyTime: string;
  checkInTime: string;
  details: CheckInPatientDetail;
}

export const INITIAL_CHECK_IN_ITEMS: CheckInRecordItem[] = [
  {
    id: 'CK-01',
    reportStatus: '未出',
    checkInStatus: '已核收',
    isUrgent: false,
    barcode: '0901001',
    patientId: '540093',
    patientName: '张振华',
    sampleType: '全血',
    testItem: '血常规5分类 (XCGWFL)',
    department: '心血管内科',
    applyTime: '2026-10-26 08:10:12',
    checkInTime: '2026-10-26 08:25:30',
    details: {
      patientSource: '住院',
      name: '张振华',
      ethnicity: '汉族',
      gender: '男',
      birthDate: '1972-04-18',
      age: '54岁',
      phone: '13808219801',
      medicalRecordNo: 'ZY2026101108',
      applyDoctor: '王志强 (主任医师)',
      department: '心血管内科',
      doctorPhone: '13988220011',
      ward: '内科住院部 6楼',
      nursePhone: '028-85783783',
      bedNo: '18床',
      sendDept: '心血管内科病区',
      clinicalDiagnosis: '冠状动脉粥样硬化性心脏病 · 不稳定型心绞痛',
      extraInfo: '既往高血压病史10年，规律服用阿司匹林肠溶片',
      applyItem: '血常规5分类 + CRP快速定量',
      barcode: '0901001',
      sampleType: 'EDTA-K2抗凝全血 (紫头管 2.0ml)',
      collectMethod: '静脉真空采血',
      collectSite: '左肘正中静脉',
      applyTime: '2026-10-26 08:10:12',
      sendTime: '2026-10-26 08:20:15',
      checkInTime: '2026-10-26 08:25:30',
      auditTime: '待出结果',
      unqualifiedReason: '',
      unqualifiedRemark: '标本外观正常，无微小凝块，量达2.0ml刻度',
    },
  },
  {
    id: 'CK-02',
    reportStatus: '未出',
    checkInStatus: '已核收',
    isUrgent: false,
    barcode: '0901002',
    patientId: '540233',
    patientName: '李淑琴',
    sampleType: '血清',
    testItem: '肝功能测定十一项 (GZGN)',
    department: '消化内科',
    applyTime: '2026-10-26 08:12:40',
    checkInTime: '2026-10-26 08:26:15',
    details: {
      patientSource: '住院',
      name: '李淑琴',
      ethnicity: '汉族',
      gender: '女',
      birthDate: '1984-09-22',
      age: '42岁',
      phone: '13708182933',
      medicalRecordNo: 'ZY2026101142',
      applyDoctor: '陈欣欣 (主治医师)',
      department: '消化内科',
      doctorPhone: '13888339900',
      ward: '内科住院部 5楼',
      nursePhone: '028-85783766',
      bedNo: '06床',
      sendDept: '消化内科病区',
      clinicalDiagnosis: '非酒精性脂肪性肝炎 (NASH) · 肝酶轻度升高',
      extraInfo: '空腹抽血，晨起未饮水与用药',
      applyItem: '肝脏功能测定 (ALT/AST/TBIL/DBIL/TP/ALB/GGT/ALP)',
      barcode: '0901002',
      sampleType: '血清标本 (黄头促凝胶管 4.0ml)',
      collectMethod: '静脉真空采血',
      collectSite: '右前臂头静脉',
      applyTime: '2026-10-26 08:12:40',
      sendTime: '2026-10-26 08:21:00',
      checkInTime: '2026-10-26 08:26:15',
      auditTime: '流水线离心中',
      unqualifiedReason: '',
      unqualifiedRemark: '标本无溶血、轻度脂血在仪器线性补偿范围内',
    },
  },
  {
    id: 'CK-03',
    reportStatus: '已出',
    checkInStatus: '已核收',
    isUrgent: false,
    barcode: '0901003',
    patientId: '540288',
    patientName: '周德成',
    sampleType: '血清',
    testItem: '肾功能测定+血清电解质六项',
    department: '肾脏内科',
    applyTime: '2026-10-26 08:15:00',
    checkInTime: '2026-10-26 08:27:02',
    details: {
      patientSource: '住院',
      name: '周德成',
      ethnicity: '汉族',
      gender: '男',
      birthDate: '1954-11-03',
      age: '72岁',
      phone: '13908056221',
      medicalRecordNo: 'ZY2026101201',
      applyDoctor: '张先义 (副主任医师)',
      department: '肾脏内科',
      doctorPhone: '13608091122',
      ward: '内科住院部 7楼',
      nursePhone: '028-85783788',
      bedNo: '12床',
      sendDept: '肾内科病区',
      clinicalDiagnosis: '慢性肾功能不全 CKD-3期 · 2型糖尿病性肾病',
      extraInfo: '近期肌酐波动，请重点关注估算eGFR指标',
      applyItem: '肾功能 (BUN/CREA/UA) + 电解质 (K/Na/Cl/Ca/P/CO2)',
      barcode: '0901003',
      sampleType: '血清标本 (黄头管 4.0ml)',
      collectMethod: '真空静脉采血',
      collectSite: '左肘正中静脉',
      applyTime: '2026-10-26 08:15:00',
      sendTime: '2026-10-26 08:22:30',
      checkInTime: '2026-10-26 08:27:02',
      auditTime: '2026-10-26 08:52:10 (已出值待审)',
      unqualifiedReason: '',
      unqualifiedRemark: '分析仪测定完成，肌酐 142μmol/L，暂无危急值',
    },
  },
  {
    id: 'CK-04',
    reportStatus: '已审',
    checkInStatus: '已核收',
    isUrgent: false,
    barcode: '0901004',
    patientId: '540302',
    patientName: '赵国庆',
    sampleType: '全血',
    testItem: '糖化血红蛋白测定 (HPLC法)',
    department: '内分泌科',
    applyTime: '2026-10-26 08:18:22',
    checkInTime: '2026-10-26 08:28:10',
    details: {
      patientSource: '门诊',
      name: '赵国庆',
      ethnicity: '汉族',
      gender: '男',
      birthDate: '1977-10-01',
      age: '49岁',
      phone: '13508112234',
      medicalRecordNo: 'MZ2026102609',
      applyDoctor: '吴敏霞 (副主任医师)',
      department: '内分泌科门诊',
      doctorPhone: '13908018899',
      ward: '门诊部2楼 205诊室',
      nursePhone: '028-85783600',
      bedNo: '门诊',
      sendDept: '门诊静脉采血室',
      clinicalDiagnosis: '2型糖尿病评估 · 血糖控制评估',
      extraInfo: '近3个月降糖治疗随访复查',
      applyItem: '糖化血红蛋白 HbA1c (高效液相色谱法)',
      barcode: '0901004',
      sampleType: '全血标本 (紫头EDTA管 2.0ml)',
      collectMethod: '外周静脉穿刺',
      collectSite: '右前臂浅静脉',
      applyTime: '2026-10-26 08:18:22',
      sendTime: '2026-10-26 08:23:40',
      checkInTime: '2026-10-26 08:28:10',
      auditTime: '2026-10-26 08:48:30 (审签医师: 张珊)',
      unqualifiedReason: '',
      unqualifiedRemark: 'HbA1c = 6.4%，结果正常，已推送HIS与微信公众号',
    },
  },
  {
    id: 'CK-05',
    reportStatus: '已审',
    checkInStatus: '不合格',
    isUrgent: true,
    barcode: '0901005',
    patientId: '540319',
    patientName: '孙祥林',
    sampleType: '全血',
    testItem: '急诊肌钙蛋白I+心肌三项 (急查)',
    department: '急诊抢救室',
    applyTime: '2026-10-26 08:22:10',
    checkInTime: '2026-10-26 08:29:45',
    details: {
      patientSource: '急诊',
      name: '孙祥林',
      ethnicity: '汉族',
      gender: '男',
      birthDate: '1965-03-12',
      age: '61岁',
      phone: '13880992345',
      medicalRecordNo: 'JZ2026102603',
      applyDoctor: '刘海平 (急诊主治)',
      department: '急诊科',
      doctorPhone: '13988229988',
      ward: '急诊抢救室 1区',
      nursePhone: '028-85783120',
      bedNo: '急02床',
      sendDept: '急诊抢救室',
      clinicalDiagnosis: '急性非ST段抬高型心肌梗死 (NSTEMI) 疑似',
      extraInfo: '胸骨后剧烈绞痛2小时，含服硝酸甘油不缓解',
      applyItem: '高敏心肌肌钙蛋白I (hs-cTnI) + CK-MB + Myo',
      barcode: '0901005',
      sampleType: '肝素锂抗凝全血 (绿头管 3.0ml)',
      collectMethod: '急诊穿刺',
      collectSite: '右肘窝静脉',
      applyTime: '2026-10-26 08:22:10',
      sendTime: '2026-10-26 08:25:00',
      checkInTime: '2026-10-26 08:29:45',
      auditTime: '2026-10-26 08:38:12 (触发危急值)',
      unqualifiedReason: '标本轻度脂血混浊，且采血管外壁未贴牢主条码',
      unqualifiedRemark: '经主管技师评估：急查救命标本，执行【让步核收】，手工补打加固条码后优先上机；同时电话向急诊科报危急值：hs-cTnI = 14.8 ng/mL！',
    },
  },
  {
    id: 'CK-06',
    reportStatus: '未出',
    checkInStatus: '已拒收',
    isUrgent: false,
    barcode: '0901006',
    patientId: '540355',
    patientName: '钱学林',
    sampleType: '全血',
    testItem: '凝血常规四项 (PT/APTT/TT/FIB)',
    department: '内一科',
    applyTime: '2026-10-26 08:24:00',
    checkInTime: '2026-10-26 08:31:20',
    details: {
      patientSource: '住院',
      name: '钱学林',
      ethnicity: '汉族',
      gender: '男',
      birthDate: '1972-08-15',
      age: '54岁',
      phone: '13608119900',
      medicalRecordNo: 'ZY2026101239',
      applyDoctor: '张先义 (副主任医师)',
      department: '内一科',
      doctorPhone: '13608091122',
      ward: '住院部6楼 内一科',
      nursePhone: '028-85783783',
      bedNo: '18床',
      sendDept: '内一科病区',
      clinicalDiagnosis: '下肢深静脉血栓形成 (DVT) 溶栓抗凝评估',
      extraInfo: '术前凝血功能筛查',
      applyItem: '凝血酶原时间(PT) + 活化部分凝血活酶时间(APTT) + 纤维蛋白原',
      barcode: '0901006',
      sampleType: '枸橼酸钠抗凝血浆 (蓝头管 2.7ml)',
      collectMethod: '真空采血',
      collectSite: '左肘前静脉',
      applyTime: '2026-10-26 08:24:00',
      sendTime: '2026-10-26 08:28:10',
      checkInTime: '2026-10-26 08:31:20',
      auditTime: '标本已退回',
      unqualifiedReason: '枸橼酸钠抗凝管采血量严重不足(仅1.1ml，不足2.7ml刻度)，管底出现微小纤维蛋白凝块',
      unqualifiedRemark: '凝血试验对抗凝比例敏感度极高，凝块导致凝血因子大量消耗，结果完全失真。已通过LIS系统向内一科护士站退单，要求重新严格定量抽血重送。',
    },
  },
];
