export type QcStatus = '已完成' | '已登记' | '质控中' | '失控';

export type QcCategory = '室内质控' | '室间质控' | '仪器校准与维护';

export type QcTargetType = '培养基' | '染色剂' | '生化试剂' | '检验仪器';

export type QcProperty = '月质控' | '新批次质控' | '日质控' | '周质控' | '季度校准';

export interface QcTargetItem {
  id: string;
  name: string; // 质控对象名称
  lotNo: string; // 质控对象批号
  standardStrainName: string; // 标准品名称
  standardStrainLot: string; // 标准品批号
  manufacturer?: string; // 生产厂商
  expiryDate?: string; // 效期
  storageCondition?: string; // 存放条件
}

export interface QcRecordItem {
  id: string;
  checkItem: string; // 检查项
  resultValue: string; // 结果值
  outcome: '在控' | '合格' | '失控' | '不合格' | '待判定'; // 质控结果
}

export interface MicrobiologyReagentQcItem {
  id: string;
  qcCode: string; // 质控编号
  status: QcStatus; // 状态
  category: QcCategory; // 质控类别
  projectName: string; // 质控项目名称
  targetType: QcTargetType; // 质控对象类别
  property: QcProperty; // 质控性质
  registerPerson: string; // 登记人
  registerTime: string; // 登记时间
  auditPerson?: string; // 审核人
  auditTime?: string; // 审核时间
  targets: QcTargetItem[]; // 质控对象列表
  records: QcRecordItem[]; // 质控结果记录
  analysisComment: string; // 项目结果分析
  conclusion: string; // 质控结论
}

export const INITIAL_REAGENT_QC_LIST: MicrobiologyReagentQcItem[] = [
  {
    id: 'qc-01',
    qcCode: '01',
    status: '已完成',
    category: '室内质控',
    projectName: '染色结果检查',
    targetType: '染色剂',
    property: '新批次质控',
    registerPerson: '李晓红主管检验师',
    registerTime: '2026-10-30 08:30:00',
    auditPerson: '郭彩霞主任医师',
    auditTime: '2026-10-30 09:15:22',
    conclusion: '在控合格，染色反差鲜明，准予临床检验使用',
    analysisComment:
      '新入库革兰染色液与抗酸染色液经标准质控株检测，金黄色葡萄球菌呈典型蓝紫色革兰阳性，大肠埃希菌呈典型粉红色革兰阴性；抗酸阳性质控菌呈亮红色，背景脱色完全。符合WS/T 805-2022微生物涂片染色质量控制标准。',
    targets: [
      {
        id: 't-101',
        name: '革兰染色试剂盒 (四步法)',
        lotNo: '500120261001',
        standardStrainName: 'ATCC 25923 / ATCC 25922',
        standardStrainLot: '230120261001',
        manufacturer: '珠海迪尔生物工程',
        expiryDate: '2027-09-30',
        storageCondition: '常温避光密封保存 (15~25℃)',
      },
      {
        id: 't-102',
        name: '抗酸荧光/冷染试剂盒',
        lotNo: '500120261002',
        standardStrainName: 'ATCC 25177 (耻垢分枝杆菌)',
        standardStrainLot: '230120261002',
        manufacturer: '贝克曼库尔特',
        expiryDate: '2027-08-15',
        storageCondition: '阴凉干燥保存 (2~8℃)',
      },
    ],
    records: [
      {
        id: 'r-101',
        checkItem: '革兰阳性质控菌染色效果 (金黄色葡萄球菌 ATCC 25923)',
        resultValue: '镜下呈典型深蓝紫色球菌，葡萄串状排列，着色饱满均一',
        outcome: '在控',
      },
      {
        id: 'r-102',
        checkItem: '革兰阴性质控菌染色效果 (大肠埃希菌 ATCC 25922)',
        resultValue: '镜下呈清晰粉红色中等大小杆菌，两端钝圆，反差鲜明',
        outcome: '在控',
      },
      {
        id: 'r-103',
        checkItem: '脱色液灵敏度与背景沉淀检查',
        resultValue: '脱色时间适中，无结晶析出，涂片背景清晰洁净',
        outcome: '合格',
      },
    ],
  },
  {
    id: 'qc-02',
    qcCode: '02',
    status: '已登记',
    category: '室间质控',
    projectName: '无菌实验',
    targetType: '培养基',
    property: '月质控',
    registerPerson: '刘浩然检验师',
    registerTime: '2026-10-29 14:20:10',
    auditPerson: '魏明副主任检验师',
    auditTime: '待审核',
    conclusion: '试验进行中，35℃温箱孵育48小时无杂菌生长',
    analysisComment:
      '按国家卫健委临检中心室间质控规范及抽检5%比例，将本月新制备SS琼脂、麦康凯平板与巧克力平板置35℃温育培养箱持续观察，当前孵育36h各培养基表面均澄清光洁，无肉眼可见杂菌菌落。',
    targets: [
      {
        id: 't-201',
        name: 'SS琼脂平板 (沙门志贺选择琼脂)',
        lotNo: '500120261011',
        standardStrainName: 'ATCC 27853 (铜绿假单胞菌)',
        standardStrainLot: '230120261011',
        manufacturer: '郑州安图生物',
        expiryDate: '2027-01-20',
        storageCondition: '冷藏密封避光 (2~8℃)',
      },
      {
        id: 't-202',
        name: '麦康凯琼脂平板 (MAC)',
        lotNo: '500120261012',
        standardStrainName: 'ATCC 25922 (大肠埃希菌)',
        standardStrainLot: '230120261012',
        manufacturer: '郑州安图生物',
        expiryDate: '2027-02-15',
        storageCondition: '冷藏密封避光 (2~8℃)',
      },
      {
        id: 't-203',
        name: '巧克力琼脂平板 (含复分解因子)',
        lotNo: '500120261013',
        standardStrainName: 'ATCC 49247 (流感嗜血杆菌)',
        standardStrainLot: '230120261013',
        manufacturer: '法国生物梅里埃',
        expiryDate: '2026-12-30',
        storageCondition: '冷藏密封避光 (2~8℃)',
      },
    ],
    records: [
      {
        id: 'r-201',
        checkItem: 'SS琼脂平板无菌试验 (35℃ 48h温育)',
        resultValue: '抽检10块平板，培养48小时无任何菌落生长，无菌率100%',
        outcome: '合格',
      },
      {
        id: 'r-202',
        checkItem: '麦康凯平板无菌试验 (35℃ 48h温育)',
        resultValue: '抽检10块平板，培养48小时无杂菌菌落，培养基澄清透明',
        outcome: '合格',
      },
      {
        id: 'r-203',
        checkItem: '巧克力平板无菌试验 (35℃ 5% CO2 48h温育)',
        resultValue: '抽检10块平板，培养48小时无任何霉菌或杂菌滋生',
        outcome: '合格',
      },
    ],
  },
  {
    id: 'qc-03',
    qcCode: '03',
    status: '已登记',
    category: '室内质控',
    projectName: '外观实验',
    targetType: '培养基',
    property: '月质控',
    registerPerson: '王宇轩技师',
    registerTime: '2026-10-29 10:15:45',
    auditPerson: '李晓红主管检验师',
    auditTime: '待审核',
    conclusion: '外观性状良好，凝固厚度平整度均符合CLSI M22标准',
    analysisComment:
      '本批次平板外观物理特性检验完成：平皿直径90mm，凝胶厚度均控制在 4.0±0.2mm 之间，表面平整光洁，无气泡、裂纹、杂质及脱水冷凝水倒流。色泽与透光度符合批间一致性要求。',
    targets: [
      {
        id: 't-301',
        name: 'SS琼脂平板',
        lotNo: '500120261001',
        standardStrainName: 'ATCC 278563 (福氏志贺菌质控株)',
        standardStrainLot: '230120260101',
        manufacturer: '上海宝生物技术',
        expiryDate: '2027-03-31',
        storageCondition: '2~8℃冷藏',
      },
      {
        id: 't-302',
        name: '麦康凯平板',
        lotNo: '500120261002',
        standardStrainName: 'ATCC 278564 (鼠伤寒沙门菌质控株)',
        standardStrainLot: '230120260102',
        manufacturer: '上海宝生物技术',
        expiryDate: '2027-03-31',
        storageCondition: '2~8℃冷藏',
      },
      {
        id: 't-303',
        name: '巧克力平板',
        lotNo: '500120261003',
        standardStrainName: 'ATCC 278565 (淋病奈瑟菌质控株)',
        standardStrainLot: '230120260103',
        manufacturer: '法国生物梅里埃',
        expiryDate: '2027-01-15',
        storageCondition: '2~8℃冷藏',
      },
    ],
    records: [
      {
        id: 'r-301',
        checkItem: '培养基凝固厚度与平整度测量 (游标卡尺测定5点)',
        resultValue: '中心及四角厚度平均 4.15 mm，水平差≤0.1mm',
        outcome: '合格',
      },
      {
        id: 'r-302',
        checkItem: '色泽与透光率外观物理性状目测',
        resultValue: 'SS浅肉粉色澄清，MAC红棕微透，巧克力均一棕褐无溶血分层',
        outcome: '合格',
      },
      {
        id: 'r-303',
        checkItem: '平皿密闭性与冷凝水控制检查',
        resultValue: '皿盖贴合紧密无变形，倒置存放无冷凝水滴落凝胶表面',
        outcome: '在控',
      },
    ],
  },
  {
    id: 'qc-04',
    qcCode: '04',
    status: '已完成',
    category: '室内质控',
    projectName: '生长率与选择抑制试验',
    targetType: '培养基',
    property: '新批次质控',
    registerPerson: '孙丽丽主管检验师',
    registerTime: '2026-10-28 16:00:15',
    auditPerson: '郭彩霞主任医师',
    auditTime: '2026-10-29 08:30:10',
    conclusion: '在控合格，指示菌回收率达标，非目标菌完全抑制',
    analysisComment:
      '采用标准比浊法稀释指示菌接种，沙门菌在SS平板上回收率达到 94.5%（要求≥80%），菌落中心呈典型硫化氢黑心；同时接种大肠埃希菌与粪肠球菌完全受到抑制无菌落生长，选择性符合国家标准。',
    targets: [
      {
        id: 't-401',
        name: '哥伦比亚5%羊血琼脂平板 (BAP)',
        lotNo: '500120261020',
        standardStrainName: 'ATCC 25923 (金黄色葡萄球菌)',
        standardStrainLot: '230120261020',
        manufacturer: '赛默飞世尔 (Thermo Fisher)',
        expiryDate: '2027-04-10',
        storageCondition: '2~8℃冷藏',
      },
      {
        id: 't-402',
        name: '沙门-志贺菌琼脂 (SS)',
        lotNo: '500120261021',
        standardStrainName: 'ATCC 14028 (鼠伤寒沙门菌)',
        standardStrainLot: '230120261021',
        manufacturer: '赛默飞世尔 (Thermo Fisher)',
        expiryDate: '2027-04-10',
        storageCondition: '2~8℃冷藏',
      },
    ],
    records: [
      {
        id: 'r-401',
        checkItem: '指示菌促生长率测定 (回收率 PR 值)',
        resultValue: 'PR = 0.945 (94.5%)，溶血环清晰典型',
        outcome: '在控',
      },
      {
        id: 'r-402',
        checkItem: '非目标菌选择抑制试验 (抑制率检查)',
        resultValue: '接种 10^5 CFU 粪肠球菌，35℃ 24h无菌落生长',
        outcome: '在控',
      },
    ],
  },
  {
    id: 'qc-05',
    qcCode: '05',
    status: '已完成',
    category: '仪器校准与维护',
    projectName: '全自动血培养仪温度与进瓶校准',
    targetType: '检验仪器',
    property: '月质控',
    registerPerson: '张建国检验师',
    registerTime: '2026-10-27 11:20:00',
    auditPerson: '魏明副主任检验师',
    auditTime: '2026-10-27 15:40:00',
    conclusion: '仪器校准合格，各温区温差在0.2℃以内，机械臂寻孔精准',
    analysisComment:
      '使用经国家计量院检定合格的标准电子温度计（证书编号: JL2026-T8812），对全自动血培养仪 A/B/C 三个培养转盘各抽测12个孔位，测得温度均稳定在 35.0±0.2℃ 范围；光电比色感应器校零基准线平稳。',
    targets: [
      {
        id: 't-501',
        name: 'BACTEC FX 全自动血培养系统 (主机01)',
        lotNo: 'DEV-BD-FX01',
        standardStrainName: '校准用标准反光测试瓶 (QC Bottle)',
        standardStrainLot: 'CAL-20260901',
        manufacturer: '碧迪医疗 (BD Biosciences)',
        expiryDate: '2028-12-31',
        storageCondition: '设备运行环境温湿度受控',
      },
    ],
    records: [
      {
        id: 'r-501',
        checkItem: '多点温度巡检验证 (设定值 35.0℃)',
        resultValue: '转盘12孔平均实测值 35.08℃ (34.95℃ ~ 35.15℃)',
        outcome: '合格',
      },
      {
        id: 'r-502',
        checkItem: '荧光传感器基线校准与条码扫描器灵敏度',
        resultValue: '基线漂移 <0.3%，条码识别率100%无丢码',
        outcome: '合格',
      },
    ],
  },
  {
    id: 'qc-06',
    qcCode: '06',
    status: '失控',
    category: '室内质控',
    projectName: '氧化酶试剂灵敏度及特异性抽检',
    targetType: '生化试剂',
    property: '日质控',
    registerPerson: '刘浩然检验师',
    registerTime: '2026-10-26 08:45:10',
    auditPerson: '李晓红主管检验师',
    auditTime: '2026-10-26 09:10:00',
    conclusion: '失控！阴性对照出现非特异性自氧化显色，全批次报废封存',
    analysisComment:
      '抽检发现氧化酶试纸条拆封放置超过24小时已受潮氧化，阴性质控株（大肠埃希菌 ATCC 25922）接种后30秒内出现边缘蓝紫色假阳性反应。已启动失控调查与CAPA程序，该批次氧化酶试纸已就地封存报废，更换新开封冷藏试剂重新质控。',
    targets: [
      {
        id: 't-601',
        name: '氧化酶试纸条 (1%盐酸四甲基对苯二胺)',
        lotNo: '500120260988',
        standardStrainName: 'ATCC 27853(+) / ATCC 25922(-)',
        standardStrainLot: '230120260988',
        manufacturer: '珠海美华医疗',
        expiryDate: '2026-11-30',
        storageCondition: '2~8℃避光干燥冷藏',
      },
    ],
    records: [
      {
        id: 'r-601',
        checkItem: '阳性质控菌反应 (铜绿假单胞菌 ATCC 27853)',
        resultValue: '10秒内迅速显深紫黑色，阳性反应典型',
        outcome: '在控',
      },
      {
        id: 'r-602',
        checkItem: '阴性质控菌反应 (大肠埃希菌 ATCC 25922)',
        resultValue: '30秒内出现非特异性蓝紫色显色（要求无色），判定假阳性',
        outcome: '失控',
      },
    ],
  },
];
