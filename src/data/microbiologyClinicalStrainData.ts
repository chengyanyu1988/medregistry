export interface StrainAuditLog {
  id: string;
  time: string;
  operator: string;
  action: '存入入库' | '取用借出' | '归还入库' | '高温灭菌销毁' | '信息修改';
  notes: string;
}

export interface ClinicalStrainItem {
  id: string;
  wellCode: string; // e.g. "1-1", "1-2"
  strainBarcode: string; // e.g. "BC099001"
  strainName: string; // e.g. "珀斯沙门氏菌"
  sampleType: string; // 痰液, 全血, 尿液, 脑脊液, 创面分泌物
  identificationResult: string; // 鉴定结果
  astPhenotype: string; // 药敏分型 (MDRO / ESBL阳性 / MRSA / 敏感型)
  storagePerson: string; // 存放人员 (真实姓名)
  storageTime: string; // 存放时间 (近期时间)
  patientName: string; // 患者姓名 (真实姓名)
  patientGender: '男' | '女';
  patientAge: string;
  hospitalizationNo: string; // 住院号 / 病历号
  department: string; // 申请科室
  testItem: string; // 检验项目
  clinicalDiagnosis: string; // 临床诊断
  preservationMethod: string; // 保藏方法 (如: 甘油肉汤 -80℃冷冻保藏)
  passageNumber: string; // 传代次数 (如: P1代)
  status: '在库' | '已取用' | '已销毁';
  logs: StrainAuditLog[];
}

export interface CryoboxInfo {
  id: string;
  code: string; // e.g. "18CLT01ECO"
  name: string;
  rackName: string;
  freezerName: string;
  temperature: string;
  rows: number;
  cols: number;
  strains: ClinicalStrainItem[];
}

export interface RackInfo {
  id: string;
  name: string;
  boxes: CryoboxInfo[];
}

export interface FreezerInfo {
  id: string;
  name: string;
  model: string;
  temperature: string;
  racks: RackInfo[];
}

export const INITIAL_CLINICAL_STRAINS: ClinicalStrainItem[] = [
  {
    id: 'CS-001',
    wellCode: '1-1',
    strainBarcode: 'BC099001',
    strainName: '珀斯沙门氏菌',
    sampleType: '痰液',
    identificationResult: '珀斯沙门氏菌 (Salmonella paratyphi A)',
    astPhenotype: '氨苄西林敏感 / 环丙沙星敏感',
    storagePerson: '刘浩然主管检验师',
    storageTime: '2026-10-22 10:10:12',
    patientName: '张太彬',
    patientGender: '男',
    patientAge: '66岁',
    hospitalizationNo: '4354001',
    department: '呼吸与危重症医学科一病区',
    testItem: '一般细菌培养+药敏',
    clinicalDiagnosis: '重症肺炎待排，发热寒战待查',
    preservationMethod: '脱脂牛奶-甘油保护剂 (-80℃)',
    passageNumber: 'P1代 (原代分离)',
    status: '在库',
    logs: [
      {
        id: 'log-1',
        time: '2026-10-22 10:10:12',
        operator: '刘浩然主管检验师',
        action: '存入入库',
        notes: '初次分离纯化后入库至18CLT01ECO孔位1-1保藏',
      },
    ],
  },
  {
    id: 'CS-002',
    wellCode: '1-2',
    strainBarcode: 'BC099002',
    strainName: '志贺菌',
    sampleType: '粪便/脓血便',
    identificationResult: '宋内志贺菌 (Shigella sonnei)',
    astPhenotype: '多重耐药 (复方新诺明耐药 / 氨苄西林耐药)',
    storagePerson: '李晓红主管检验师',
    storageTime: '2026-10-22 11:15:30',
    patientName: '陈淑珍',
    patientGender: '女',
    patientAge: '58岁',
    hospitalizationNo: '4354002',
    department: '感染性疾病科',
    testItem: '肠道致病菌分离鉴定',
    clinicalDiagnosis: '急性细菌性痢疾',
    preservationMethod: '甘油肉汤 (-80℃超低温保藏)',
    passageNumber: 'P1代',
    status: '在库',
    logs: [
      {
        id: 'log-2',
        time: '2026-10-22 11:15:30',
        operator: '李晓红主管检验师',
        action: '存入入库',
        notes: '自肠道脓血便标本中纯化分离，菌落挑取保藏',
      },
    ],
  },
  {
    id: 'CS-003',
    wellCode: '1-3',
    strainBarcode: 'BC099003',
    strainName: '革兰阳性杆菌',
    sampleType: '全血',
    identificationResult: '产单核细胞李斯特菌 (Listeria monocytogenes)',
    astPhenotype: '氨苄西林敏感 / 青霉素敏感',
    storagePerson: '郭彩霞主任医师',
    storageTime: '2026-10-22 14:20:45',
    patientName: '王建平',
    patientGender: '男',
    patientAge: '68岁',
    hospitalizationNo: '4354003',
    department: '神经重症医学科 (NICU)',
    testItem: '全自动双瓶血培养',
    clinicalDiagnosis: '李斯特菌性脑膜炎 / 脓毒血症',
    preservationMethod: '脱脂牛奶甘油介质 (-80℃)',
    passageNumber: 'P1代',
    status: '在库',
    logs: [
      {
        id: 'log-3',
        time: '2026-10-22 14:20:45',
        operator: '郭彩霞主任医师',
        action: '存入入库',
        notes: '脑脊液与血培养双报阳菌株，高度警惕危重致病菌',
      },
    ],
  },
  {
    id: 'CS-004',
    wellCode: '1-4',
    strainBarcode: 'BC099004',
    strainName: '蜂房类芽孢杆菌',
    sampleType: '创面分泌物',
    identificationResult: '蜂房类芽孢杆菌 (Paenibacillus alvei)',
    astPhenotype: '天然对多粘菌素耐药',
    storagePerson: '刘浩然主管检验师',
    storageTime: '2026-10-23 09:40:10',
    patientName: '孙志强',
    patientGender: '男',
    patientAge: '49岁',
    hospitalizationNo: '4354004',
    department: '骨科创伤病区',
    testItem: '创面脓液培养及鉴定',
    clinicalDiagnosis: '骨折内固定术后感染',
    preservationMethod: '甘油肉汤 (-80℃)',
    passageNumber: 'P2代',
    status: '在库',
    logs: [
      {
        id: 'log-4',
        time: '2026-10-23 09:40:10',
        operator: '刘浩然主管检验师',
        action: '存入入库',
        notes: '复苏传代纯化入库',
      },
    ],
  },
  {
    id: 'CS-005',
    wellCode: '1-5',
    strainBarcode: 'BC099005',
    strainName: '炭疽芽孢杆菌',
    sampleType: '皮肤丘疹渗出液',
    identificationResult: '炭疽芽孢杆菌减毒株 (Bacillus anthracis-A16R)',
    astPhenotype: '环丙沙星敏感 / 多西环素敏感',
    storagePerson: '郭彩霞主任医师',
    storageTime: '2026-10-23 15:00:22',
    patientName: '周燕',
    patientGender: '女',
    patientAge: '39岁',
    hospitalizationNo: '4354005',
    department: '院感质控科 / 微生物P2实验室',
    testItem: '国家质控比对参考菌株保藏',
    clinicalDiagnosis: '质控比对菌株',
    preservationMethod: '双重深低温冻存管密封 (-80℃)',
    passageNumber: 'P2代',
    status: '在库',
    logs: [
      {
        id: 'log-5',
        time: '2026-10-23 15:00:22',
        operator: '郭彩霞主任医师',
        action: '存入入库',
        notes: '高致病性病原体质控参考品，双人双锁规范保藏',
      },
    ],
  },
  {
    id: 'CS-006',
    wellCode: '1-6',
    strainBarcode: 'BC099006',
    strainName: '环状芽孢杆菌',
    sampleType: '尿液',
    identificationResult: '环状芽孢杆菌 (Bacillus circulans)',
    astPhenotype: '敏感型',
    storagePerson: '李晓红主管检验师',
    storageTime: '2026-10-24 08:35:10',
    patientName: '赵玉华',
    patientGender: '女',
    patientAge: '54岁',
    hospitalizationNo: '4354006',
    department: '肾内科病区',
    testItem: '中段尿培养',
    clinicalDiagnosis: '复发性尿路感染',
    preservationMethod: '甘油肉汤 (-80℃)',
    passageNumber: 'P1代',
    status: '在库',
    logs: [],
  },
  {
    id: 'CS-007',
    wellCode: '1-7',
    strainBarcode: 'BC099007',
    strainName: '短杆菌属',
    sampleType: '腹水',
    identificationResult: '短杆菌属 (Brevibacterium sp.)',
    astPhenotype: '中介耐药',
    storagePerson: '魏明副主任检验师',
    storageTime: '2026-10-24 10:12:00',
    patientName: '李振华',
    patientGender: '男',
    patientAge: '62岁',
    hospitalizationNo: '4354007',
    department: '普通外科二病区',
    testItem: '引流腹水无菌培养',
    clinicalDiagnosis: '腹膜炎 / 肠瘘感染',
    preservationMethod: '脱脂牛奶甘油管 (-80℃)',
    passageNumber: 'P1代',
    status: '在库',
    logs: [],
  },
  {
    id: 'CS-008',
    wellCode: '2-1',
    strainBarcode: 'BC099011',
    strainName: '蜂房类芽孢杆菌',
    sampleType: '痰液',
    identificationResult: '蜂房类芽孢杆菌 (Paenibacillus alvei)',
    astPhenotype: '头孢曲松敏感',
    storagePerson: '刘浩然主管检验师',
    storageTime: '2026-10-24 14:10:00',
    patientName: '陈鑫',
    patientGender: '男',
    patientAge: '43岁',
    hospitalizationNo: '4354008',
    department: '内科 (呼吸科)',
    testItem: '一般细菌培养',
    clinicalDiagnosis: '伤寒待排 / 肺部感染',
    preservationMethod: '甘油肉汤 (-80℃)',
    passageNumber: 'P1代',
    status: '在库',
    logs: [
      {
        id: 'log-8',
        time: '2026-10-24 14:10:00',
        operator: '刘浩然主管检验师',
        action: '存入入库',
        notes: '对应临床标本检验分离纯化，存入孔位2-1',
      },
    ],
  },
  {
    id: 'CS-009',
    wellCode: '2-2',
    strainBarcode: 'BC099012',
    strainName: '炭疽芽孢杆菌',
    sampleType: '血液',
    identificationResult: '炭疽芽孢杆菌实验比对株',
    astPhenotype: '敏感型',
    storagePerson: '郭彩霞主任医师',
    storageTime: '2026-10-24 16:30:15',
    patientName: '林国栋',
    patientGender: '男',
    patientAge: '51岁',
    hospitalizationNo: '4354009',
    department: '急诊重症监护室 (EICU)',
    testItem: '急查血培养及质谱比对',
    clinicalDiagnosis: '严重脓毒症',
    preservationMethod: '双重深低温冻存管密封 (-80℃)',
    passageNumber: 'P1代',
    status: '在库',
    logs: [],
  },
  {
    id: 'CS-010',
    wellCode: '2-3',
    strainBarcode: 'BC099013',
    strainName: '环状芽孢杆菌',
    sampleType: '胆汁',
    identificationResult: '环状芽孢杆菌 (Bacillus circulans)',
    astPhenotype: '庆大霉素敏感',
    storagePerson: '李晓红主管检验师',
    storageTime: '2026-10-25 09:20:00',
    patientName: '钱建军',
    patientGender: '男',
    patientAge: '60岁',
    hospitalizationNo: '4354010',
    department: '肝胆胰外科',
    testItem: '胆汁细菌培养',
    clinicalDiagnosis: '急性化脓性梗阻性胆管炎',
    preservationMethod: '甘油肉汤 (-80℃)',
    passageNumber: 'P1代',
    status: '在库',
    logs: [],
  },
  {
    id: 'CS-011',
    wellCode: '2-4',
    strainBarcode: 'BC099014',
    strainName: '短杆菌属',
    sampleType: '透析液',
    identificationResult: '短杆菌属 (Brevibacterium sp.)',
    astPhenotype: '头孢他啶敏感',
    storagePerson: '魏明副主任检验师',
    storageTime: '2026-10-25 11:05:40',
    patientName: '徐美华',
    patientGender: '女',
    patientAge: '65岁',
    hospitalizationNo: '4354011',
    department: '血液净化透析中心',
    testItem: '腹透液无菌培养',
    clinicalDiagnosis: '腹膜透析相关性腹膜炎',
    preservationMethod: '脱脂牛奶甘油管 (-80℃)',
    passageNumber: 'P1代',
    status: '在库',
    logs: [],
  },
  {
    id: 'CS-012',
    wellCode: '2-5',
    strainBarcode: 'BC099015',
    strainName: '珀斯沙门氏菌',
    sampleType: '血液',
    identificationResult: '甲型副伤寒沙门氏菌',
    astPhenotype: '喹诺酮敏感 / 第三代头孢敏感',
    storagePerson: '刘浩然主管检验师',
    storageTime: '2026-10-25 14:15:30',
    patientName: '郑文彬',
    patientGender: '男',
    patientAge: '36岁',
    hospitalizationNo: '4354012',
    department: '发热门诊 / 感染科',
    testItem: '发热血培养双瓶',
    clinicalDiagnosis: '副伤寒甲型',
    preservationMethod: '甘油肉汤 (-80℃)',
    passageNumber: 'P1代',
    status: '在库',
    logs: [],
  },
  {
    id: 'CS-013',
    wellCode: '2-6',
    strainBarcode: 'BC099016',
    strainName: '志贺菌',
    sampleType: '粪便',
    identificationResult: '福氏志贺菌 (Shigella flexneri)',
    astPhenotype: '多重耐药 (MDRO)',
    storagePerson: '李晓红主管检验师',
    storageTime: '2026-10-25 16:45:10',
    patientName: '朱海燕',
    patientGender: '女',
    patientAge: '28岁',
    hospitalizationNo: '4354013',
    department: '肠道门诊',
    testItem: '便培养+药敏',
    clinicalDiagnosis: '急性细菌性痢疾 (福氏)',
    preservationMethod: '甘油肉汤 (-80℃)',
    passageNumber: 'P1代',
    status: '在库',
    logs: [],
  },
  {
    id: 'CS-014',
    wellCode: '2-7',
    strainBarcode: 'BC099017',
    strainName: '革兰阳性杆菌',
    sampleType: '脑脊液',
    identificationResult: '红斑丹毒丝菌 (Erysipelothrix rhusiopathiae)',
    astPhenotype: '青霉素高度敏感',
    storagePerson: '郭彩霞主任医师',
    storageTime: '2026-10-26 09:10:00',
    patientName: '马建华',
    patientGender: '男',
    patientAge: '56岁',
    hospitalizationNo: '4354014',
    department: '神经内科一病区',
    testItem: '脑脊液特殊培养',
    clinicalDiagnosis: '中枢神经系统感染',
    preservationMethod: '甘油保护剂 (-80℃)',
    passageNumber: 'P1代',
    status: '在库',
    logs: [],
  },
];

export const INITIAL_FREEZER_TREE: FreezerInfo = {
  id: 'fr-01',
  name: '海尔超低温冰箱 (-80℃)',
  model: 'Haier DW-86L828BP',
  temperature: '-80.4 ℃',
  racks: [
    {
      id: 'rack-01',
      name: '上层一号铁架',
      boxes: [
        {
          id: 'box-01',
          code: '18CLT01ECO',
          name: '临床重点致病菌保藏盒-01',
          rackName: '上层一号铁架',
          freezerName: '海尔超低温冰箱 (-80℃)',
          temperature: '-80℃',
          rows: 6,
          cols: 8,
          strains: INITIAL_CLINICAL_STRAINS,
        },
        {
          id: 'box-02',
          code: '19CLT01ECE',
          name: '肠道致病菌专项保藏盒-02',
          rackName: '上层一号铁架',
          freezerName: '海尔超低温冰箱 (-80℃)',
          temperature: '-80℃',
          rows: 6,
          cols: 8,
          strains: [],
        },
      ],
    },
    {
      id: 'rack-02',
      name: '上层二号铁架',
      boxes: [
        {
          id: 'box-03',
          code: '20CLT02ECA',
          name: '多重耐药(MDRO)菌株专用盒',
          rackName: '上层二号铁架',
          freezerName: '海尔超低温冰箱 (-80℃)',
          temperature: '-80℃',
          rows: 6,
          cols: 8,
          strains: [],
        },
      ],
    },
    {
      id: 'rack-03',
      name: '中层一号铁架',
      boxes: [
        {
          id: 'box-04',
          code: '21CLT03EMA',
          name: '血流感染败血症菌株盒',
          rackName: '中层一号铁架',
          freezerName: '海尔超低温冰箱 (-80℃)',
          temperature: '-80℃',
          rows: 6,
          cols: 8,
          strains: [],
        },
      ],
    },
    {
      id: 'rack-04',
      name: '中层二号铁架',
      boxes: [],
    },
    {
      id: 'rack-05',
      name: '下层一号铁架',
      boxes: [],
    },
    {
      id: 'rack-06',
      name: '下层二号铁架',
      boxes: [],
    },
  ],
};
