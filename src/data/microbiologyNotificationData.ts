export type NotificationStatus = '待处理' | '已通知' | '已反馈' | '已忽略';

export type NotificationType = '多重耐药' | '危急值' | '传染病' | '院感预警' | '耐药菌爆发';

export interface ProcessStep {
  id: string;
  stageName: '危急值产生' | '消息通知' | '消息反馈' | '院感确认' | '撤销处理';
  operator: string;
  time: string;
  content: string;
  recipient?: string;
  recipientDept?: string;
}

export interface PatientNotificationProfile {
  name: string;
  gender: '男' | '女';
  age: string;
  ethnicity: string;
  birthDate: string;
  phone: string;
  source: '住院' | '急诊' | '门诊';
  inpatientWard: string;
  bedNo: string;
  department: string;
  doctor: string;
  doctorPhone: string;
  nursePhone: string;
  clinicalDiagnosis: string;
  additionalInfo?: string;
}

export interface MicrobiologyNotificationItem {
  id: string;
  status: NotificationStatus;
  type: NotificationType;
  testResult: string;
  testItem: string;
  specimen: string;
  createdAt: string;
  barcode: string;
  department: string;
  patient: PatientNotificationProfile;
  processHistory: ProcessStep[];
  feedbackInfo?: {
    reporter: string;
    reporterDept: string;
    feedbackContent: string;
    feedbackTime: string;
  };
}

export const INITIAL_MICROBIOLOGY_NOTIFICATIONS: MicrobiologyNotificationItem[] = [
  {
    id: 'notif-001',
    status: '待处理',
    type: '多重耐药',
    testResult: '耐碳青霉烯类肺炎克雷伯菌 (CR-KP)',
    testItem: '血培养及药敏试验',
    specimen: '血液',
    createdAt: '2026-10-30 08:35:12',
    barcode: '202610300891',
    department: '重症医学科 (ICU)',
    patient: {
      name: '赵建华',
      gender: '男',
      age: '58岁',
      ethnicity: '汉族',
      birthDate: '1968-04-15',
      phone: '13880923180',
      source: '住院',
      inpatientWard: '重症医学科ICU病区',
      bedNo: 'ICU-06床',
      department: '重症医学科',
      doctor: '梁振华主治医师',
      doctorPhone: '13980021456',
      nursePhone: '028-85783783',
      clinicalDiagnosis: '重症肺部感染合并脓毒性休克，急性呼吸窘迫综合征 (ARDS)',
      additionalInfo: '既往有慢性阻塞性肺疾病急性加重期病史，已行气管插管机械通气',
    },
    processHistory: [
      {
        id: 'ps-101',
        stageName: '危急值产生',
        operator: '刘浩然检验师',
        time: '2026-10-30 08:35:12',
        content: 'VITEK-2质谱仪检测产碳青霉烯酶表型阳性 (KPC+)，触发多重耐药菌高危预警',
      },
    ],
  },
  {
    id: 'notif-002',
    status: '已通知',
    type: '危急值',
    testResult: '血培养双侧双瓶报阳：革兰阴性杆菌 (危急值)',
    testItem: '全自动血培养',
    specimen: '血液',
    createdAt: '2026-10-30 07:15:30',
    barcode: '202610300845',
    department: '呼吸与危重症医学科',
    patient: {
      name: '孙立伟',
      gender: '男',
      age: '67岁',
      ethnicity: '汉族',
      birthDate: '1959-11-20',
      phone: '13708092241',
      source: '住院',
      inpatientWard: '呼吸科二病区',
      bedNo: '28床',
      department: '呼吸与危重症医学科',
      doctor: '张先义主任医师',
      doctorPhone: '13608197722',
      nursePhone: '028-85783785',
      clinicalDiagnosis: '重症社区获得性肺炎，高热寒战3天，白细胞计数显著升高',
      additionalInfo: '床旁微量血培养报警耗时 11.4h，涂片初报革兰阴性杆菌',
    },
    processHistory: [
      {
        id: 'ps-102',
        stageName: '危急值产生',
        operator: '李晓红主管检验师',
        time: '2026-10-30 07:15:30',
        content: '血培养仪提示需氧瓶报阳，镜检见大量中等大小革兰阴性杆菌',
      },
      {
        id: 'ps-103',
        stageName: '消息通知',
        operator: '李晓红主管检验师',
        time: '2026-10-30 07:20:15',
        content: '电话直报病区值班张先义主任医师，已完成复诵确认，并同步推送HIS弹窗',
        recipient: '张先义主任医师',
        recipientDept: '呼吸与危重症医学科',
      },
    ],
  },
  {
    id: 'notif-003',
    status: '已反馈',
    type: '危急值',
    testResult: '脑脊液隐球菌墨汁染色阳性 (危急值)',
    testItem: '脑脊液特种染色涂片',
    specimen: '脑脊液',
    createdAt: '2026-10-29 16:40:22',
    barcode: '202610290518',
    department: '神经内科病区',
    patient: {
      name: '钱海荣',
      gender: '女',
      age: '42岁',
      ethnicity: '汉族',
      birthDate: '1984-08-09',
      phone: '13550187642',
      source: '住院',
      inpatientWard: '神经内科一病区',
      bedNo: '16床',
      department: '神经内科',
      doctor: '李明远副主任医师',
      doctorPhone: '13880194532',
      nursePhone: '028-85783788',
      clinicalDiagnosis: '头痛发热查因，脑膜刺激征阳性，疑似中枢神经系统感染',
      additionalInfo: '墨汁染色见典型厚荚膜酵母样菌体，隐球菌荚膜抗原滴度 1:640',
    },
    processHistory: [
      {
        id: 'ps-104',
        stageName: '危急值产生',
        operator: '魏明副主任检验师',
        time: '2026-10-29 16:40:22',
        content: '脑脊液涂片墨汁染色检出新型隐球菌，产生一级危急值预警',
      },
      {
        id: 'ps-105',
        stageName: '消息通知',
        operator: '魏明副主任检验师',
        time: '2026-10-29 16:44:00',
        content: '电话通知主治管床李明远副主任医师，HIS危急值网络通道闭环直通',
        recipient: '李明远副主任医师',
        recipientDept: '神经内科',
      },
      {
        id: 'ps-106',
        stageName: '消息反馈',
        operator: '李明远副主任医师',
        time: '2026-10-29 17:02:18',
        content: '已对症处理：紧急加用两性霉素B联合氟胞嘧啶靶向抗真菌治疗，复查腰穿压力',
        recipient: '检验科微生物组',
        recipientDept: '检验科',
      },
    ],
    feedbackInfo: {
      reporter: '李明远副主任医师',
      reporterDept: '神经内科',
      feedbackContent: '已对症处理：紧急加用两性霉素B联合氟胞嘧啶抗真菌治疗，严密监护瞳孔与颅内压',
      feedbackTime: '2026-10-29 17:02:18',
    },
  },
  {
    id: 'notif-004',
    status: '已反馈',
    type: '传染病',
    testResult: '结核分枝杆菌复合群 PCR阳性 (耐利福平基因突变)',
    testItem: '结核分枝杆菌核酸及耐药基因检测',
    specimen: '痰液',
    createdAt: '2026-10-29 14:10:05',
    barcode: '202610290409',
    department: '感染性疾病科',
    patient: {
      name: '周丽华',
      gender: '女',
      age: '53岁',
      ethnicity: '汉族',
      birthDate: '1973-03-24',
      phone: '13980765531',
      source: '门诊',
      inpatientWard: '感染科门诊结核专区',
      bedNo: '门诊留观02',
      department: '感染性疾病科',
      doctor: '郭彩霞主任医师',
      doctorPhone: '13708119864',
      nursePhone: '028-85783790',
      clinicalDiagnosis: '咳嗽咯血2周，胸部CT示双上肺浸润性肺结核伴空洞形成',
      additionalInfo: 'GeneXpert检测检出rpoB耐药基因突变，属乙类法定传染病',
    },
    processHistory: [
      {
        id: 'ps-107',
        stageName: '危急值产生',
        operator: '王宇轩技师',
        time: '2026-10-29 14:10:05',
        content: 'PCR快速分子扩增结核分枝杆菌Ct值 18.2，触发法定传染病国家直报网预警',
      },
      {
        id: 'ps-108',
        stageName: '消息通知',
        operator: '王宇轩技师',
        time: '2026-10-29 14:15:30',
        content: '电话通知门诊接诊郭彩霞主任医师，同步推送院感疾控科防保专干',
        recipient: '郭彩霞主任医师',
        recipientDept: '感染性疾病科',
      },
      {
        id: 'ps-109',
        stageName: '消息反馈',
        operator: '郭彩霞主任医师',
        time: '2026-10-29 14:38:50',
        content: '已对症处理：已完成传染病大卡网报录入，患者已收治入负压隔离病房并转介定点结核防治院',
        recipient: '防保科与微生物组',
        recipientDept: '防保科',
      },
    ],
    feedbackInfo: {
      reporter: '郭彩霞主任医师',
      reporterDept: '感染性疾病科',
      feedbackContent: '已对症处理：已完成国家传染病大卡线上直报，收治入负压病房隔离并调整二线抗结核方案',
      feedbackTime: '2026-10-29 14:38:50',
    },
  },
  {
    id: 'notif-005',
    status: '已忽略',
    type: '多重耐药',
    testResult: '耐甲氧西林金黄色葡萄球菌 (MRSA)',
    testItem: '创面分泌物培养及鉴定',
    specimen: '创面脓液',
    createdAt: '2026-10-28 11:22:18',
    barcode: '202610280190',
    department: '骨科病区',
    patient: {
      name: '吴天宇',
      gender: '男',
      age: '35岁',
      ethnicity: '汉族',
      birthDate: '1991-09-17',
      phone: '13666210984',
      source: '住院',
      inpatientWard: '骨科创伤二病区',
      bedNo: '09床',
      department: '骨科',
      doctor: '黄伟副主任医师',
      doctorPhone: '13880998822',
      nursePhone: '028-85783777',
      clinicalDiagnosis: '开放性胫腓骨骨折术后软组织感染',
      additionalInfo: '系3日前既往确诊病例之创面定植复查，临床已建立接触隔离并规范使用万古霉素',
    },
    processHistory: [
      {
        id: 'ps-110',
        stageName: '危急值产生',
        operator: '刘浩然检验师',
        time: '2026-10-28 11:22:18',
        content: '质谱鉴定为金黄色葡萄球菌，头孢西丁初筛阳性且mecA基因扩增阳性',
      },
      {
        id: 'ps-111',
        stageName: '消息通知',
        operator: '刘浩然检验师',
        time: '2026-10-28 11:30:00',
        content: '系统自动比对发现72小时内已有同源确诊隔离记录，转入临床复核忽略队列',
        recipient: '黄伟副主任医师',
        recipientDept: '骨科',
      },
    ],
  },
  {
    id: 'notif-006',
    status: '待处理',
    type: '院感预警',
    testResult: '泛耐药鲍曼不动杆菌 (XDR-AB)',
    testItem: '气管导管深部吸出物培养',
    specimen: '痰液',
    createdAt: '2026-10-30 09:10:04',
    barcode: '202610300955',
    department: '重症医学科 (ICU)',
    patient: {
      name: '郑文斌',
      gender: '男',
      age: '71岁',
      ethnicity: '汉族',
      birthDate: '1955-02-18',
      phone: '13508123990',
      source: '住院',
      inpatientWard: '重症医学科ICU病区',
      bedNo: 'ICU-02床',
      department: '重症医学科',
      doctor: '梁振华主治医师',
      doctorPhone: '13980021456',
      nursePhone: '028-85783783',
      clinicalDiagnosis: '脑出血破入脑室术后肺部感染，呼吸衰竭机械通气',
      additionalInfo: '病区近期发生第2例同源耐药不动杆菌，触发医院感染暴发聚集风险黄色预警',
    },
    processHistory: [
      {
        id: 'ps-112',
        stageName: '危急值产生',
        operator: '孙丽丽主管检验师',
        time: '2026-10-30 09:10:04',
        content: '药敏仅对替加环素、多粘菌素敏感，对其余碳青霉烯类、氨基糖苷类全部耐药',
      },
    ],
  },
  {
    id: 'notif-007',
    status: '已通知',
    type: '多重耐药',
    testResult: '耐万古霉素屎肠球菌 (VRE)',
    testItem: '中段尿培养及药敏试验',
    specimen: '中段尿',
    createdAt: '2026-10-29 18:05:44',
    barcode: '202610290772',
    department: '肾病内科病区',
    patient: {
      name: '冯晓燕',
      gender: '女',
      age: '61岁',
      ethnicity: '汉族',
      birthDate: '1965-06-30',
      phone: '13980554123',
      source: '住院',
      inpatientWard: '肾内科血液透析病区',
      bedNo: '31床',
      department: '肾病内科',
      doctor: '陈明祥主治医师',
      doctorPhone: '13708221190',
      nursePhone: '028-85783789',
      clinicalDiagnosis: '慢性肾脏病5期(尿毒症)，维持性血液透析伴顽固性泌尿系感染',
      additionalInfo: 'vanA耐药表型，万古霉素MIC >= 32 ug/mL，达托霉素敏感',
    },
    processHistory: [
      {
        id: 'ps-113',
        stageName: '危急值产生',
        operator: '张建国检验师',
        time: '2026-10-29 18:05:44',
        content: '尿液培养菌落数 > 10^5 CFU/mL，鉴定为屎肠球菌，万古霉素耐药',
      },
      {
        id: 'ps-114',
        stageName: '消息通知',
        operator: '张建国检验师',
        time: '2026-10-29 18:12:10',
        content: '电话上报透析病区陈明祥主治医师，交代单间隔离透析与利奈唑胺治疗指征',
        recipient: '陈明祥主治医师',
        recipientDept: '肾病内科',
      },
    ],
  },
  {
    id: 'notif-008',
    status: '已反馈',
    type: '危急值',
    testResult: '穿刺液涂片检出革兰阳性粗大杆菌 (产气荚膜梭菌疑似)',
    testItem: '无菌体液穿刺液急查涂片',
    specimen: '穿刺液',
    createdAt: '2026-10-28 22:30:15',
    barcode: '202610280911',
    department: '胃肠外科病区',
    patient: {
      name: '陈国良',
      gender: '男',
      age: '49岁',
      ethnicity: '汉族',
      birthDate: '1977-12-05',
      phone: '13880112450',
      source: '急诊',
      inpatientWard: '普外二病区',
      bedNo: '急诊留观05',
      department: '普通外科',
      doctor: '刘建平副主任医师',
      doctorPhone: '13980145678',
      nursePhone: '028-85783781',
      clinicalDiagnosis: '下腹部创伤术后剧烈胀痛伴皮下捻发音，疑似气性坏疽',
      additionalInfo: '涂片视野内见大量革兰阳性平头状杆菌，白细胞缺乏，极高致死风险',
    },
    processHistory: [
      {
        id: 'ps-115',
        stageName: '危急值产生',
        operator: '李晓红主管检验师',
        time: '2026-10-28 22:30:15',
        content: '夜班急查分泌物涂片见疑似厌氧梭菌，启动特级危急值夜间响应',
      },
      {
        id: 'ps-116',
        stageName: '消息通知',
        operator: '李晓红主管检验师',
        time: '2026-10-28 22:33:00',
        content: '直拨普外值班刘建平副主任医师手机，急报气性坏疽可能',
        recipient: '刘建平副主任医师',
        recipientDept: '普通外科',
      },
      {
        id: 'ps-117',
        stageName: '消息反馈',
        operator: '刘建平副主任医师',
        time: '2026-10-28 22:45:10',
        content: '已对症处理：紧急行急诊床旁清创引流，深部切开减压并安排高压氧舱应急治疗',
        recipient: '检验科微生物组',
        recipientDept: '检验科',
      },
    ],
    feedbackInfo: {
      reporter: '刘建平副主任医师',
      reporterDept: '普通外科',
      feedbackContent: '已对症处理：紧急实施急诊探查与伤口双氧水冲洗减压引流，大剂量青霉素冲击治疗并联系高压氧舱',
      feedbackTime: '2026-10-28 22:45:10',
    },
  },
];
