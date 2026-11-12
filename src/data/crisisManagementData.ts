export interface CrisisFlowRecord {
  id: string;
  step: '危急值产生' | '消息通知' | '消息反馈' | '临床处置闭环';
  operator: string;
  time: string;
  content: string;
  receiver?: string;
  receiverDept?: string;
}

export interface CrisisPatientDetail {
  name: string;
  gender: '男' | '女';
  age: string;
  ethnicity: string;
  birthday: string;
  phone: string;
  source: '住院' | '门诊' | '急诊';
  ward: string;
  bedNo: string;
  dept: string;
  medicalRecordNo: string;
  doctor: string;
  doctorPhone: string;
  nursePhone: string;
  clinicalDiagnosis: string;
  additionalInfo: string;
}

export interface CrisisManagementItem {
  id: string;
  status: '待处理' | '已通知' | '已反馈' | '已忽略';
  messageType: '危急值' | '多重耐药' | '传染病' | '极限异常';
  testResult: string;
  testItem: string;
  sampleType: string;
  createdAt: string;
  barcode: string;
  department: string;
  patient: CrisisPatientDetail;
  flowRecords: CrisisFlowRecord[];
  feedback: {
    operator: string;
    dept: string;
    content: string;
    time?: string;
  };
}

export const INITIAL_CRISIS_ITEMS: CrisisManagementItem[] = [
  {
    id: 'CR-001',
    status: '待处理',
    messageType: '多重耐药',
    testResult: '多重耐药结核分枝杆菌 (利福平/异烟肼双重耐药 MDR-TB 阳性)',
    testItem: '血培养及结核菌分子药敏',
    sampleType: '血液',
    createdAt: '2026-10-29 08:35:12',
    barcode: '0901001',
    department: '内科 (感染病区)',
    patient: {
      name: '杜文斌',
      gender: '男',
      age: '48岁',
      ethnicity: '汉族',
      birthday: '1978-05-19',
      phone: '13980721190',
      source: '住院',
      ward: '内科感染一病区',
      bedNo: '18床',
      dept: '内科',
      medicalRecordNo: '5435',
      doctor: '张先义',
      doctorPhone: '15080708090',
      nursePhone: '028-85783783',
      clinicalDiagnosis: '伤寒合并继发性肺结核，长期低热咳嗽',
      additionalInfo: '患者既往慢支病史，目前单间负压隔离，生命体征平稳',
    },
    flowRecords: [
      {
        id: 'FL-01',
        step: '危急值产生',
        operator: '赵明远 (主管检验师)',
        time: '2026-10-29 08:35:12',
        content: '血培养分子检测结果报阳：多重耐药结核分枝杆菌检出 (MDR-TB)',
        receiver: '中心检验科',
        receiverDept: '微生物室',
      },
      {
        id: 'FL-02',
        step: '消息通知',
        operator: '系统自动预警 + 赵明远',
        time: '2026-10-29 08:36:05',
        content: '向临床感染病区推送极危红色弹窗报警，并同步拨打护士站内线',
        receiver: '李静 (责任护士)',
        receiverDept: '内科感染病区',
      },
    ],
    feedback: {
      operator: '李静',
      dept: '内科感染病区',
      content: '护士站已接收电话并复述检验结果无误，正在向张先义主治医师紧急当面报告！',
      time: '2026-10-29 08:37:30',
    },
  },
  {
    id: 'CR-002',
    status: '已忽略',
    messageType: '危急值',
    testResult: '阳性 (抗酸染色查见阳性杆菌 1+，镜检初筛)',
    testItem: '痰液集菌抗酸染色',
    sampleType: '痰液',
    createdAt: '2026-10-29 08:20:10',
    barcode: '0901002',
    department: '呼吸内科',
    patient: {
      name: '顾雅琴',
      gender: '女',
      age: '62岁',
      ethnicity: '汉族',
      birthday: '1964-11-08',
      phone: '13880914421',
      source: '住院',
      ward: '呼吸科二病区',
      bedNo: '06床',
      dept: '呼吸内科',
      medicalRecordNo: '8912',
      doctor: '刘建平',
      doctorPhone: '13708092233',
      nursePhone: '028-85783785',
      clinicalDiagnosis: '浸润型肺结核复治期，轻度咯血',
      additionalInfo: '临床上周已明确确诊并开启抗痨四联疗法，本条为已知复查',
    },
    flowRecords: [
      {
        id: 'FL-03',
        step: '危急值产生',
        operator: '孙敏 (检验师)',
        time: '2026-10-29 08:20:10',
        content: '痰涂片抗酸染色阳性 1+ (初筛重复检出)',
      },
      {
        id: 'FL-04',
        step: '消息通知',
        operator: '刘建平 (主管医生)',
        time: '2026-10-29 08:25:40',
        content: '与检验科沟通：患者系已确诊住院治疗中患者，常规疗效监测，同意按已知流程忽略报警',
        receiver: '检验科',
        receiverDept: '微生物室',
      },
    ],
    feedback: {
      operator: '刘建平',
      dept: '呼吸内科',
      content: '已在专科方案中，无需紧急额外干预，已标记已知忽略。',
      time: '2026-10-29 08:26:00',
    },
  },
  {
    id: 'CR-003',
    status: '已通知',
    messageType: '传染病',
    testResult: '木鼠布氏杆菌 (Brucella melitensis 疑似阳性，四联生化证实)',
    testItem: '血培养及质谱鉴定',
    sampleType: '血液',
    createdAt: '2026-10-29 08:12:10',
    barcode: '0901005',
    department: '急诊科 (重症监护室)',
    patient: {
      name: '陈志强',
      gender: '男',
      age: '42岁',
      ethnicity: '回族',
      birthday: '1984-03-22',
      phone: '15928671120',
      source: '急诊',
      ward: 'EICU急诊重症',
      bedNo: '抢救03床',
      dept: '急诊科',
      medicalRecordNo: '7201',
      doctor: '蔡雨君',
      doctorPhone: '15828009911',
      nursePhone: '028-85783790',
      clinicalDiagnosis: '持续不明原因高热（波状热），波及腰椎关节剧烈疼痛',
      additionalInfo: '发病前有畜牧接触史（肉羊养殖屠宰），已启动乙类传染病处置程序',
    },
    flowRecords: [
      {
        id: 'FL-05',
        step: '危急值产生',
        operator: '赵明远 (主管检验师)',
        time: '2026-10-29 08:12:10',
        content: '血培养双瓶均报阳，质谱打靶鉴定评分 2.21 为布鲁氏菌属',
        receiver: '检验科',
        receiverDept: '微生物室',
      },
      {
        id: 'FL-06',
        step: '消息通知',
        operator: '赵明远',
        time: '2026-10-29 08:15:30',
        content: '电话直连急诊EICU蔡雨君主治医生，通报法定乙类传染病与危急阳性结果，指导生物安全二级防护',
        receiver: '蔡雨君 (主治医师)',
        receiverDept: '急诊科EICU',
      },
    ],
    feedback: {
      operator: '蔡雨君',
      dept: '急诊科',
      content: '已收悉电话通报并复诵确认。正在填报传染病直报网，并调整为多西环素联合利福平方案！',
      time: '2026-10-29 08:17:45',
    },
  },
  {
    id: 'CR-004',
    status: '已反馈',
    messageType: '危急值',
    testResult: '严重高钾血症：血清钾 K+ 6.85 mmol/L (复测 6.82 mmol/L)',
    testItem: '急诊生化电解质六项',
    sampleType: '血清',
    createdAt: '2026-10-29 07:55:00',
    barcode: '0901008',
    department: '心血管内科',
    patient: {
      name: '梁建国',
      gender: '男',
      age: '71岁',
      ethnicity: '汉族',
      birthday: '1955-08-14',
      phone: '13608097722',
      source: '住院',
      ward: '心内一科',
      bedNo: '25床',
      dept: '心血管内科',
      medicalRecordNo: '3349',
      doctor: '张先义',
      doctorPhone: '15080708090',
      nursePhone: '028-85783783',
      clinicalDiagnosis: '冠心病、缺血性心肌病、慢性心力衰竭、慢性肾脏病5期',
      additionalInfo: '心电图示T波高尖对称，基底部狭窄，存在室性心律失常高危风险',
    },
    flowRecords: [
      {
        id: 'FL-07',
        step: '危急值产生',
        operator: '孙敏 (检验师)',
        time: '2026-10-29 07:55:00',
        content: '急查生化钾离子 6.85 mmol/L (危机界限 ≥6.2)，立即启动双孔离心复检，确认值 6.82 mmol/L',
      },
      {
        id: 'FL-08',
        step: '消息通知',
        operator: '孙敏',
        time: '2026-10-29 07:57:12',
        content: '电话通知心内一区主班护士周敏，告知高血钾极限危象',
        receiver: '周敏 (主管护士)',
        receiverDept: '心血管内科',
      },
      {
        id: 'FL-09',
        step: '消息反馈',
        operator: '张先义 (主治医师)',
        time: '2026-10-29 08:02:40',
        content: '已立即静推 10%葡萄糖酸钙 10ml 保护心肌，同步静脉泵入胰岛素+高糖溶液，加用呋塞米促进排钾',
        receiver: '检验科',
        receiverDept: '急诊生化室',
      },
      {
        id: 'FL-10',
        step: '临床处置闭环',
        operator: '张先义 (主治医师)',
        time: '2026-10-29 08:30:10',
        content: '1小时后急查血钾回落至 5.30 mmol/L，心电图T波改善，患者心悸气促缓解，危机解除。',
        receiver: '医务部',
        receiverDept: '质控科',
      },
    ],
    feedback: {
      operator: '张先义',
      dept: '心血管内科',
      content: '已对症处理：静推葡萄糖酸钙及GI极化液降钾，床旁血透班待命，现病情趋于平稳。',
      time: '2026-10-29 08:30:20',
    },
  },
  {
    id: 'CR-005',
    status: '待处理',
    messageType: '危急值',
    testResult: '超敏肌钙蛋白I：hs-cTnI 18.50 ng/mL (参考上限 >0.04 ng/mL，升高超400倍)',
    testItem: '急诊心肌损伤三项 (hs-cTnI / CK-MB / Myo)',
    sampleType: '全血',
    createdAt: '2026-10-29 08:40:00',
    barcode: '0901012',
    department: '急诊科 (胸痛中心)',
    patient: {
      name: '林晓芬',
      gender: '女',
      age: '54岁',
      ethnicity: '汉族',
      birthday: '1972-09-02',
      phone: '13550882310',
      source: '急诊',
      ward: '急诊抢救室',
      bedNo: '抢救01床',
      dept: '急诊科',
      medicalRecordNo: '9021',
      doctor: '陈欣欣',
      doctorPhone: '13980112255',
      nursePhone: '028-85783790',
      clinicalDiagnosis: '急性广泛前壁ST段抬高型心肌梗死 (STEMI)',
      additionalInfo: '持续剧烈压榨样胸痛2小时，大汗淋漓，胸痛中心绿色通道已开启',
    },
    flowRecords: [
      {
        id: 'FL-11',
        step: '危急值产生',
        operator: '赵明远 (主管检验师)',
        time: '2026-10-29 08:40:00',
        content: '雅培发光仪测定 hs-cTnI 达到 18.50 ng/mL，触发国家胸痛中心极危报警',
      },
    ],
    feedback: {
      operator: '陈欣欣',
      dept: '急诊科胸痛中心',
      content: '准备启动导管室急诊PCI介入手术，正在进行家属知情同意谈话。',
      time: '2026-10-29 08:42:15',
    },
  },
  {
    id: 'CR-006',
    status: '已通知',
    messageType: '极限异常',
    testResult: '重度低血糖：静脉血糖 GLU 2.10 mmol/L (危急值下限 ≤2.20 mmol/L)',
    testItem: '急诊生化常规全套',
    sampleType: '血浆',
    createdAt: '2026-10-29 08:28:40',
    barcode: '0901015',
    department: '神经内科',
    patient: {
      name: '孙德厚',
      gender: '男',
      age: '68岁',
      ethnicity: '汉族',
      birthday: '1958-01-20',
      phone: '13880192345',
      source: '住院',
      ward: '神经内科二病区',
      bedNo: '12床',
      dept: '神经内科',
      medicalRecordNo: '4452',
      doctor: '郭建平',
      doctorPhone: '13708221940',
      nursePhone: '028-85783786',
      clinicalDiagnosis: '2型糖尿病、脑梗死恢复期、低血糖脑病昏迷待排',
      additionalInfo: '早晨注射胰岛素后进食偏少，突发神志淡漠冷汗淋漓',
    },
    flowRecords: [
      {
        id: 'FL-12',
        step: '危急值产生',
        operator: '孙敏 (检验师)',
        time: '2026-10-29 08:28:40',
        content: '己糖激酶法检测葡萄糖 2.10 mmol/L，标本外观无溶血，立即双孔复查无误',
      },
      {
        id: 'FL-13',
        step: '消息通知',
        operator: '孙敏',
        time: '2026-10-29 08:30:15',
        content: '电话通知神内二区责任护士王玲，通报低血糖危象数值',
        receiver: '王玲 (护士)',
        receiverDept: '神经内科',
      },
    ],
    feedback: {
      operator: '王玲',
      dept: '神经内科',
      content: '已口头复诵确认，郭建平医生已下达 50%葡萄糖注射液 40ml 静注，现神志已转清。',
      time: '2026-10-29 08:32:00',
    },
  },
];
