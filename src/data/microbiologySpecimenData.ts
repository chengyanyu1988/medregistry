export interface MicrobiologySpecimenItem {
  id: string;
  checkInStatus: '已核收' | '让步核收' | '待核收' | '已拒收'; // 核收状态
  isUrgent: boolean; // 是否急诊
  testStatus: '待接种' | '检验中' | '已完成'; // 检验状态
  sampleNo: string; // 样本号 (B01001)
  patientId: string; // 病人标识/病历号 (540093)
  patientName: string; // 姓名 (张立国)
  gender: '男' | '女';
  age: string;
  bedNo: string;
  department: string; // 科室
  doctor: string; // 申请医生
  doctorPhone: string;
  testItem: string; // 检验项目 (血培养)
  sampleType: string; // 样本类型 (血液, 尿液, 痰液, 脓液, 脑脊液)
  sampleStatus: string; // 样本外观状态 (外观正常, 轻微凝块, 浑浊)
  collectMethod: string; // 采集方法
  collectSite: string; // 采集部位
  barcode: string; // 采集条码 (2012320012838)
  applyTime: string; // 申请时间 (2026-10-30 08:30:00)
  collectTime: string; // 采样时间
  deliveryTime: string; // 送检时间
  checkInTime: string; // 核收时间 (2026-10-30 08:50:12)
  clinicalDiagnosis: string; // 临床诊断 (发热待查, 肺部感染待排)
  patientSource: '门诊' | '住院' | '急诊'; // 就诊类型

  // 费用信息
  billing: {
    feeName: string; // 费用名称
    chargeStatus: '已收费' | '未收费';
    payable: number; // 应收金额
    actualPaid: number; // 实收金额
  };

  // 检验概况
  overview: {
    // 涂片镜检
    smearName: string; // 抗酸染色, 革兰氏染色
    smearTime: string;
    smearResult: string; // 革兰氏阴性杆菌
    smearHasReport: boolean;

    // 仪器培养
    instrumentName: string; // 成人需氧瓶, 厌氧瓶
    instrumentTime: string;
    instrumentResult: string; // 阳性, 阴性

    // 普通培养
    agarName: string; // 血/嗜血琼脂培养基, 麦康凯培养基
    agarTime: string;
    agarResult: string; // 见多量革兰氏阴性杆菌菌落

    // 鉴定药敏
    astName: string; // 大肠埃希菌 (产ESBLs), 铜绿假单胞菌
    astTime: string;
    astResult: string; // 多重耐药菌警示
    astHasReport: boolean;
  };
}

export const INITIAL_MICROBIOLOGY_SPECIMENS: MicrobiologySpecimenItem[] = [
  {
    id: 'MICRO-001',
    checkInStatus: '已核收',
    isUrgent: true,
    testStatus: '检验中',
    sampleNo: 'B01001',
    patientId: '540093',
    patientName: '张立国',
    gender: '男',
    age: '52岁',
    bedNo: '25床',
    department: '血液内科',
    doctor: '林德胜主任',
    doctorPhone: '13970023231',
    testItem: '全自动血培养+鉴定药敏',
    sampleType: '全血',
    sampleStatus: '外观正常',
    collectMethod: '真空无菌静脉穿刺',
    collectSite: '左侧前臂浅静脉',
    barcode: '2012320012838',
    applyTime: '2026-10-30 08:15:12',
    collectTime: '2026-10-30 08:25:00',
    deliveryTime: '2026-10-30 08:40:00',
    checkInTime: '2026-10-30 08:50:12',
    clinicalDiagnosis: '败血症待查 / 高热寒战',
    patientSource: '住院',
    billing: {
      feeName: '血培养及真菌培养',
      chargeStatus: '已收费',
      payable: 160.00,
      actualPaid: 160.00,
    },
    overview: {
      smearName: '革兰氏染色与抗酸染色',
      smearTime: '2026-10-30 09:10:00',
      smearResult: '找到革兰氏阴性粗大杆菌，无抗酸杆菌',
      smearHasReport: true,
      instrumentName: 'BD BACTEC 成人需氧瓶+厌氧瓶',
      instrumentTime: '2026-10-30 09:15:34',
      instrumentResult: '需氧瓶 14小时 报阳 (阳性)',
      agarName: '血琼脂 / 麦康凯培养基',
      agarTime: '2026-10-30 10:13:13',
      agarResult: '灰白色光滑湿润菌落，呈革兰氏阴性杆菌',
      astName: '大肠埃希菌 (Escherichia coli)',
      astTime: '2026-10-30 14:54:13',
      astResult: '产超广谱β-内酰胺酶(ESBLs阳性)，头孢噻肟耐药',
      astHasReport: true,
    },
  },
  {
    id: 'MICRO-002',
    checkInStatus: '已核收',
    isUrgent: false,
    testStatus: '检验中',
    sampleNo: 'B01002',
    patientId: '540223',
    patientName: '李晓红',
    gender: '女',
    age: '46岁',
    bedNo: '12床',
    department: '肾内科',
    doctor: '张先义',
    doctorPhone: '13808001122',
    testItem: '普通尿液细菌培养+药敏',
    sampleType: '尿液 (清洁中段尿)',
    sampleStatus: '外观稍浑浊',
    collectMethod: '清洁无菌中段尿采集',
    collectSite: '尿道口',
    barcode: '2012320012839',
    applyTime: '2026-10-30 08:30:00',
    collectTime: '2026-10-30 08:40:00',
    deliveryTime: '2026-10-30 08:55:00',
    checkInTime: '2026-10-30 09:05:20',
    clinicalDiagnosis: '复杂性急性肾盂肾炎',
    patientSource: '住院',
    billing: {
      feeName: '尿液细菌定量培养与药敏',
      chargeStatus: '已收费',
      payable: 120.00,
      actualPaid: 120.00,
    },
    overview: {
      smearName: '尿沉渣革兰氏染色',
      smearTime: '2026-10-30 09:20:00',
      smearResult: '见多量革兰氏阴性短杆菌及白细胞(3+)',
      smearHasReport: fontReport(true),
      instrumentName: '自动化孵育箱',
      instrumentTime: '2026-10-30 09:30:00',
      instrumentResult: '培养箱恒温 37℃ 孵育中',
      agarName: '血琼脂 / CLED培养基',
      agarTime: '2026-10-30 11:00:00',
      agarResult: '菌落计数 >10^5 CFU/mL',
      astName: '肺炎克雷伯菌 (Klebsiella pneumoniae)',
      astTime: '2026-10-30 15:10:00',
      astResult: '对氨苄西林耐药，对碳青霉烯类敏感',
      astHasReport: true,
    },
  },
  {
    id: 'MICRO-003',
    checkInStatus: '已核收',
    isUrgent: false,
    testStatus: '检验中',
    sampleNo: 'B01003',
    patientId: '540232',
    patientName: '王建平',
    gender: '男',
    age: '68岁',
    bedNo: '05床',
    department: '呼吸与危重症医学科',
    doctor: '魏主任',
    doctorPhone: '13900112233',
    testItem: '痰液真菌及普通细菌培养',
    sampleType: '痰液',
    sampleStatus: '粘液脓性痰',
    collectMethod: '晨起深咳无菌杯留取',
    collectSite: '下呼吸道',
    barcode: '2012320012840',
    applyTime: '2026-10-30 09:00:00',
    collectTime: '2026-10-30 09:10:00',
    deliveryTime: '2026-10-30 09:25:00',
    checkInTime: '2026-10-30 09:35:10',
    clinicalDiagnosis: '慢性阻塞性肺疾病(COPD)急性加重',
    patientSource: '住院',
    billing: {
      feeName: '痰培养+真菌涂片镜检',
      chargeStatus: '已收费',
      payable: 140.00,
      actualPaid: 140.00,
    },
    overview: {
      smearName: '痰涂片革兰氏+真菌荧光染色',
      smearTime: '2026-10-30 09:45:00',
      smearResult: '鳞状上皮细胞<10/低倍，白细胞>25/低倍，合格痰标本',
      smearHasReport: true,
      instrumentName: '沙氏弱阳性真菌培养箱',
      instrumentTime: '2026-10-30 10:00:00',
      instrumentResult: '孵育24小时观察中',
      agarName: '沙保罗琼脂 / 巧克力培养基',
      agarTime: '2026-10-30 11:30:00',
      agarResult: '绿脓素产色菌落，具生黄绿色色素',
      astName: '铜绿假单胞菌 (Pseudomonas aeruginosa)',
      astTime: '2026-10-30 15:30:00',
      astResult: '多重耐药菌(MDR)，对头孢他啶、哌拉西林舒巴坦敏感',
      astHasReport: true,
    },
  },
  {
    id: 'MICRO-004',
    checkInStatus: '已核收',
    isUrgent: true,
    testStatus: '检验中',
    sampleNo: 'B01004',
    patientId: '540231',
    patientName: '陈淑珍',
    gender: '女',
    age: '58岁',
    bedNo: '08床',
    department: '神经外科ICU',
    doctor: '赵天明',
    doctorPhone: '13811223344',
    testItem: '脑脊液培养与墨汁染色',
    sampleType: '脑脊液',
    sampleStatus: '微浑浊，微黄',
    collectMethod: '无菌腰椎穿刺',
    collectSite: '腰3-4间隙',
    barcode: '2012320012841',
    applyTime: '2026-10-30 09:15:00',
    collectTime: '2026-10-30 09:20:00',
    deliveryTime: '2026-10-30 09:30:00',
    checkInTime: '2026-10-30 09:40:00',
    clinicalDiagnosis: '颅内术后颅内感染待查',
    patientSource: '急诊',
    billing: {
      feeName: '脑脊液全套培养+墨汁染色',
      chargeStatus: '已收费',
      payable: 210.00,
      actualPaid: 210.00,
    },
    overview: {
      smearName: '墨汁染色与革兰氏染色',
      smearTime: '2026-10-30 09:50:00',
      smearResult: '墨汁染色未见夹膜隐球菌，革兰氏阳性球菌成对排列',
      smearHasReport: true,
      instrumentName: '全自动血培养仪脑脊液模块',
      instrumentTime: '2026-10-30 10:00:00',
      instrumentResult: '需氧瓶 8小时 报阳',
      agarName: '血琼脂培养基',
      agarTime: '2026-10-30 12:00:00',
      agarResult: '金黄色β-溶血菌落，过氧化氢酶阳性',
      astName: '耐甲氧西林金黄色葡萄球菌 (MRSA)',
      astTime: '2026-10-30 16:00:00',
      astResult: 'MRSA阳性，对万古霉素、利奈唑胺敏感，对苯唑西林耐药',
      astHasReport: true,
    },
  },
  {
    id: 'MICRO-005',
    checkInStatus: '让步核收',
    isUrgent: false,
    testStatus: '检验中',
    sampleNo: 'B01005',
    patientId: '540235',
    patientName: '刘浩然',
    gender: '男',
    age: '34岁',
    bedNo: '18床',
    department: '骨科病区',
    doctor: '郭彩霞主任',
    doctorPhone: '13988223344',
    testItem: '创面分泌物/脓液培养',
    sampleType: '脓液',
    sampleStatus: '少量干涸分泌物',
    collectMethod: '无菌拭子蘸取',
    collectSite: '右小腿手术切口深部',
    barcode: '2012320012842',
    applyTime: '2026-10-30 09:30:00',
    collectTime: '2026-10-30 09:40:00',
    deliveryTime: '2026-10-30 09:55:00',
    checkInTime: '2026-10-30 10:05:12',
    clinicalDiagnosis: '胫腓骨开放性骨折术后创面感染',
    patientSource: '住院',
    billing: {
      feeName: '分泌物培养与药敏',
      chargeStatus: '已收费',
      payable: 110.00,
      actualPaid: 110.00,
    },
    overview: {
      smearName: '革兰氏染色',
      smearTime: '2026-10-30 10:20:00',
      smearResult: '见革兰氏阳性球菌及大量中性粒细胞',
      smearHasReport: true,
      instrumentName: '平板培养箱',
      instrumentTime: '2026-10-30 10:30:00',
      instrumentResult: '培养中',
      agarName: '血琼脂/中国蓝培养基',
      agarTime: '2026-10-30 13:00:00',
      agarResult: '表皮葡萄球菌菌落纯培养',
      astName: '表皮葡萄球菌 (Staphylococcus epidermidis)',
      astTime: '2026-10-30 16:20:00',
      astResult: '甲氧西林敏感(MSSE)',
      astHasReport: true,
    },
  },
  {
    id: 'MICRO-006',
    checkInStatus: '让步核收',
    isUrgent: false,
    testStatus: '已完成',
    sampleNo: 'B01006',
    patientId: '540244',
    patientName: '陈鑫',
    gender: '男',
    age: '29岁',
    bedNo: '02床',
    department: '门诊发热门诊',
    doctor: '孙乐乐',
    doctorPhone: '13700119988',
    testItem: '咽拭子真菌与常规培养',
    sampleType: '咽拭子',
    sampleStatus: '正常拭子',
    collectMethod: '咽后壁擦拭',
    collectSite: '口咽部',
    barcode: '2012320012843',
    applyTime: '2026-10-30 10:00:00',
    collectTime: '2026-10-30 10:10:00',
    deliveryTime: '2026-10-30 10:20:00',
    checkInTime: '2026-10-30 10:30:15',
    clinicalDiagnosis: '急性化脓性扁桃体炎',
    patientSource: '门诊',
    billing: {
      feeName: '咽拭子培养与药敏',
      chargeStatus: '已收费',
      payable: 95.00,
      actualPaid: 95.00,
    },
    overview: {
      smearName: '直接涂片',
      smearTime: '2026-10-30 10:45:00',
      smearResult: '见正常口咽部混合菌群，未见假菌丝',
      smearHasReport: true,
      instrumentName: '培养箱',
      instrumentTime: '2026-10-30 11:00:00',
      instrumentResult: '无致病菌生长',
      agarName: '血琼脂培养基',
      agarTime: '2026-10-30 14:00:00',
      agarResult: '正常草绿色链球菌及奈瑟菌属生长',
      astName: '正常上呼吸道菌群 (Normal Flora)',
      astTime: '2026-10-30 16:30:00',
      astResult: '正常菌群生长，无需做药敏试验',
      astHasReport: true,
    },
  },
];

function fontReport(val: boolean) {
  return val;
}
