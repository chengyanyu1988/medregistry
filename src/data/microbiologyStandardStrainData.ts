export interface StrainRecordLog {
  id: string;
  type: '存放记录' | '取用记录' | '销毁记录' | '传代复苏' | '质控验证';
  operator: string;
  time: string;
  purposeOrReason: string;
  remarks?: string;
}

export interface StandardStrainItem {
  id: string;
  wellCode: string; // e.g. "1-1", "1-2"
  atccNo: string; // e.g. "ATCC 25922", "ATCC 25923"
  strainBarcode: string; // e.g. "BC099001"
  chineseName: string; // e.g. "大肠埃希菌 (珀斯沙门氏比对株)"
  latinName: string; // e.g. "Escherichia coli"
  strainCategory: '抗生素药敏质控' | '质谱鉴定质控' | '培养基验收质控' | '生物安全参考';
  sourceOrg: string; // e.g. "中国医学科学院病原生物研究所 (CMCC)" / "ATCC原装保藏"
  lotNo: string; // 批号 e.g. "LOT-20260815"
  expiryDate: string; // 有效期 e.g. "2028-10-30"
  storageMethod: string; // e.g. "冻干粉菌种 / 脱脂牛奶甘油 -80℃"
  passage: string; // 代数 e.g. "P1代 (工作菌株)"
  storagePerson: string; // 存放人员 (真实姓名)
  storageTime: string; // 存放时间 (近期时间)
  status: '在库备用' | '质控使用中' | '已耗尽销毁';
  storageRecords: StrainRecordLog[]; // 存放记录
  retrievalRecords: StrainRecordLog[]; // 取用记录
  destructionRecords: StrainRecordLog[]; // 销毁记录
}

export interface StandardCryoboxInfo {
  id: string;
  code: string; // e.g. "18CLT01ECO"
  name: string;
  rackName: string;
  freezerName: string;
  temperature: string;
  rows: number;
  cols: number;
  strains: StandardStrainItem[];
}

export interface StandardRackInfo {
  id: string;
  name: string;
  boxes: StandardCryoboxInfo[];
}

export interface StandardFreezerInfo {
  id: string;
  name: string;
  model: string;
  temperature: string;
  racks: StandardRackInfo[];
}

export const INITIAL_STANDARD_STRAINS: StandardStrainItem[] = [
  {
    id: 'STD-001',
    wellCode: '1-1',
    atccNo: 'ATCC 25922',
    strainBarcode: 'BC099001',
    chineseName: '大肠埃希菌 (珀斯沙门氏比对)',
    latinName: 'Escherichia coli',
    strainCategory: '抗生素药敏质控',
    sourceOrg: '中国医学科学院病原所 (CMCC 44102)',
    lotNo: 'LOT-20260901',
    expiryDate: '2028-09-30',
    storageMethod: '脱脂牛奶-甘油保护剂 (-80℃)',
    passage: 'P1代 (质控工作母株)',
    storagePerson: '李晓红主管检验师',
    storageTime: '2026-10-15 09:12:29',
    status: '在库备用',
    storageRecords: [
      {
        id: 'sr-1',
        type: '存放记录',
        operator: '李晓红主管检验师',
        time: '2026-10-15 09:12:29',
        purposeOrReason: '国家质控原代菌株复苏分装入库',
        remarks: '分装4支冻存管，置于18CLT01ECO孔位1-1',
      },
    ],
    retrievalRecords: [
      {
        id: 'rr-1',
        type: '取用记录',
        operator: '刘浩然检验师',
        time: '2026-10-18 14:30:00',
        purposeOrReason: '肠杆菌科定量MIC常规质控试验 (CLSI M100)',
        remarks: '取用1号管进行营养琼脂划线传代复苏',
      },
    ],
    destructionRecords: [
      {
        id: 'dr-1',
        type: '销毁记录',
        operator: '郭彩霞主任医师',
        time: '2026-10-24 16:20:00',
        purposeOrReason: '上一批次空管与老化残渣高压灭菌',
        remarks: '121℃ 30min高压蒸汽灭菌生物无害化销毁',
      },
    ],
  },
  {
    id: 'STD-002',
    wellCode: '1-2',
    atccNo: 'ATCC 25923',
    strainBarcode: 'BC099002',
    chineseName: '金黄色葡萄球菌 (志贺菌比对)',
    latinName: 'Staphylococcus aureus',
    strainCategory: '抗生素药敏质控',
    sourceOrg: '美国典型培养物保藏中心 (ATCC原装)',
    lotNo: 'LOT-20260820',
    expiryDate: '2028-08-31',
    storageMethod: '脱脂甘油微量冻存管 (-80℃)',
    passage: 'P1代 (工作株)',
    storagePerson: '刘浩然检验师',
    storageTime: '2026-10-15 09:40:15',
    status: '在库备用',
    storageRecords: [
      {
        id: 'sr-2',
        type: '存放记录',
        operator: '刘浩然检验师',
        time: '2026-10-15 09:40:15',
        purposeOrReason: '日常纸片扩散法 (K-B法) 质控保藏',
      },
    ],
    retrievalRecords: [
      {
        id: 'rr-2',
        type: '取用记录',
        operator: '李晓红主管检验师',
        time: '2026-10-20 08:30:00',
        purposeOrReason: '头孢西丁纸片法(MRSA筛选)质控对照',
      },
    ],
    destructionRecords: [],
  },
  {
    id: 'STD-003',
    wellCode: '1-3',
    atccNo: 'ATCC 27853',
    strainBarcode: 'BC099003',
    chineseName: '铜绿假单胞菌 (革兰阳性杆菌比对)',
    latinName: 'Pseudomonas aeruginosa',
    strainCategory: '抗生素药敏质控',
    sourceOrg: '国家菌种保藏中心 (CGMCC)',
    lotNo: 'LOT-20260715',
    expiryDate: '2028-07-31',
    storageMethod: '甘油肉汤微量冷冻管 (-80℃)',
    passage: 'P2代',
    storagePerson: '郭彩霞主任医师',
    storageTime: '2026-10-16 10:15:00',
    status: '在库备用',
    storageRecords: [
      {
        id: 'sr-3',
        type: '存放记录',
        operator: '郭彩霞主任医师',
        time: '2026-10-16 10:15:00',
        purposeOrReason: '非发酵菌药敏质控标准参考株',
      },
    ],
    retrievalRecords: [
      {
        id: 'rr-3',
        type: '取用记录',
        operator: '魏明副主任检验师',
        time: '2026-10-22 09:10:00',
        purposeOrReason: '碳青霉烯类酶(美罗培南)抑菌圈质控',
      },
    ],
    destructionRecords: [],
  },
  {
    id: 'STD-004',
    wellCode: '1-4',
    atccNo: 'ATCC 49247',
    strainBarcode: 'BC099004',
    chineseName: '流感嗜血杆菌 (蜂房类芽孢杆菌比对)',
    latinName: 'Haemophilus influenzae',
    strainCategory: '培养基验收质控',
    sourceOrg: 'ATCC标准菌株',
    lotNo: 'LOT-20260630',
    expiryDate: '2027-12-31',
    storageMethod: '巧克力琼脂甘油冻存管 (-80℃)',
    passage: 'P1代',
    storagePerson: '李晓红主管检验师',
    storageTime: '2026-10-16 11:20:10',
    status: '在库备用',
    storageRecords: [
      {
        id: 'sr-4',
        type: '存放记录',
        operator: '李晓红主管检验师',
        time: '2026-10-16 11:20:10',
        purposeOrReason: '嗜血杆菌HTM培养基质控专用株',
      },
    ],
    retrievalRecords: [],
    destructionRecords: [],
  },
  {
    id: 'STD-005',
    wellCode: '1-5',
    atccNo: 'ATCC 49619',
    strainBarcode: 'BC099005',
    chineseName: '肺炎链球菌 (炭疽芽孢杆菌比对)',
    latinName: 'Streptococcus pneumoniae',
    strainCategory: '抗生素药敏质控',
    sourceOrg: '中国医学科学院病原所 (CMCC 31001)',
    lotNo: 'LOT-20260910',
    expiryDate: '2028-09-30',
    storageMethod: '脱纤羊血甘油冻存管 (-80℃)',
    passage: 'P1代',
    storagePerson: '郭彩霞主任医师',
    storageTime: '2026-10-17 08:50:00',
    status: '在库备用',
    storageRecords: [
      {
        id: 'sr-5',
        type: '存放记录',
        operator: '郭彩霞主任医师',
        time: '2026-10-17 08:50:00',
        purposeOrReason: '链球菌属青霉素/头孢曲松药敏质控',
      },
    ],
    retrievalRecords: [
      {
        id: 'rr-5',
        type: '取用记录',
        operator: '刘浩然检验师',
        time: '2026-10-23 10:20:00',
        purposeOrReason: '奥普托欣(Optochin)敏感试验试剂质控',
      },
    ],
    destructionRecords: [],
  },
  {
    id: 'STD-006',
    wellCode: '1-6',
    atccNo: 'ATCC 700603',
    strainBarcode: 'BC099006',
    chineseName: '肺炎克雷伯菌 (环状芽孢杆菌比对)',
    latinName: 'Klebsiella pneumoniae',
    strainCategory: '抗生素药敏质控',
    sourceOrg: 'ATCC标准保藏品 (ESBL阳性质控)',
    lotNo: 'LOT-20260805',
    expiryDate: '2028-08-31',
    storageMethod: '甘油肉汤 (-80℃超低温保藏)',
    passage: 'P2代',
    storagePerson: '魏明副主任检验师',
    storageTime: '2026-10-17 14:05:30',
    status: '在库备用',
    storageRecords: [
      {
        id: 'sr-6',
        type: '存放记录',
        operator: '魏明副主任检验师',
        time: '2026-10-17 14:05:30',
        purposeOrReason: '超广谱β-内酰胺酶(ESBL)双纸片表型确证质控',
      },
    ],
    retrievalRecords: [],
    destructionRecords: [],
  },
  {
    id: 'STD-007',
    wellCode: '1-7',
    atccNo: 'ATCC 25922',
    strainBarcode: 'BC099007',
    chineseName: '大肠埃希菌 (短杆菌属比对)',
    latinName: 'Escherichia coli (Quality Control)',
    strainCategory: '质谱鉴定质控',
    sourceOrg: 'MALDI-TOF仪器原厂校准品 (BTS标准品)',
    lotNo: 'LOT-20261001',
    expiryDate: '2027-10-31',
    storageMethod: '甘油肉汤 (-80℃)',
    passage: 'P1代',
    storagePerson: '刘浩然检验师',
    storageTime: '2026-10-18 09:30:15',
    status: '在库备用',
    storageRecords: [
      {
        id: 'sr-7',
        type: '存放记录',
        operator: '刘浩然检验师',
        time: '2026-10-18 09:30:15',
        purposeOrReason: '飞行时间质谱靶板每日质量控制校准',
      },
    ],
    retrievalRecords: [],
    destructionRecords: [],
  },
  {
    id: 'STD-008',
    wellCode: '2-1',
    atccNo: 'ATCC 49619',
    strainBarcode: 'BC099011',
    chineseName: '肺炎链球菌 (蜂房类芽孢杆菌比对)',
    latinName: 'Streptococcus pneumoniae (P2)',
    strainCategory: '抗生素药敏质控',
    sourceOrg: '国家临床检验中心 (NCCL)',
    lotNo: 'LOT-20260915',
    expiryDate: '2028-09-30',
    storageMethod: '脱脂甘油冻存 (-80℃)',
    passage: 'P2代',
    storagePerson: '李晓红主管检验师',
    storageTime: '2026-10-18 11:20:00',
    status: '在库备用',
    storageRecords: [
      {
        id: 'sr-8',
        type: '存放记录',
        operator: '李晓红主管检验师',
        time: '2026-10-18 11:20:00',
        purposeOrReason: '呼吸道病原体鉴定质控比对备用',
      },
    ],
    retrievalRecords: [],
    destructionRecords: [],
  },
  {
    id: 'STD-009',
    wellCode: '2-2',
    atccNo: 'ATCC 700603',
    strainBarcode: 'BC099012',
    chineseName: '肺炎克雷伯菌 (炭疽芽孢杆菌比对)',
    latinName: 'Klebsiella pneumoniae (ESBL+)',
    strainCategory: '抗生素药敏质控',
    sourceOrg: 'ATCC标准原装品',
    lotNo: 'LOT-20260812',
    expiryDate: '2028-08-31',
    storageMethod: '甘油肉汤 (-80℃)',
    passage: 'P1代',
    storagePerson: '郭彩霞主任医师',
    storageTime: '2026-10-19 10:10:00',
    status: '在库备用',
    storageRecords: [
      {
        id: 'sr-9',
        type: '存放记录',
        operator: '郭彩霞主任医师',
        time: '2026-10-19 10:10:00',
        purposeOrReason: '耐药基因全基因组比对标准品',
      },
    ],
    retrievalRecords: [],
    destructionRecords: [],
  },
  {
    id: 'STD-010',
    wellCode: '2-3',
    atccNo: 'ATCC 25922',
    strainBarcode: 'BC099013',
    chineseName: '大肠埃希菌 (环状芽孢杆菌比对)',
    latinName: 'Escherichia coli',
    strainCategory: '培养基验收质控',
    sourceOrg: 'CMCC中国工业微生物菌种中心',
    lotNo: 'LOT-20260720',
    expiryDate: '2028-07-31',
    storageMethod: '甘油肉汤 (-80℃)',
    passage: 'P1代',
    storagePerson: '刘浩然检验师',
    storageTime: '2026-10-19 15:45:00',
    status: '在库备用',
    storageRecords: [
      {
        id: 'sr-10',
        type: '存放记录',
        operator: '刘浩然检验师',
        time: '2026-10-19 15:45:00',
        purposeOrReason: '麦康凯平板新批号发酵乳糖质控验收',
      },
    ],
    retrievalRecords: [],
    destructionRecords: [],
  },
  {
    id: 'STD-011',
    wellCode: '2-4',
    atccNo: 'ATCC 25923',
    strainBarcode: 'BC099014',
    chineseName: '金黄色葡萄球菌 (短杆菌属比对)',
    latinName: 'Staphylococcus aureus',
    strainCategory: '生物安全参考',
    sourceOrg: 'ATCC原装保藏',
    lotNo: 'LOT-20260618',
    expiryDate: '2028-06-30',
    storageMethod: '甘油肉汤 (-80℃)',
    passage: 'P2代',
    storagePerson: '李晓红主管检验师',
    storageTime: '2026-10-20 09:05:00',
    status: '在库备用',
    storageRecords: [
      {
        id: 'sr-11',
        type: '存放记录',
        operator: '李晓红主管检验师',
        time: '2026-10-20 09:05:00',
        purposeOrReason: '血琼脂平板溶血特征质控验证',
      },
    ],
    retrievalRecords: [],
    destructionRecords: [],
  },
  {
    id: 'STD-012',
    wellCode: '2-5',
    atccNo: 'ATCC 27853',
    strainBarcode: 'BC099015',
    chineseName: '铜绿假单胞菌 (珀斯沙门氏菌比对)',
    latinName: 'Pseudomonas aeruginosa',
    strainCategory: '抗生素药敏质控',
    sourceOrg: 'CGMCC标准品',
    lotNo: 'LOT-20260822',
    expiryDate: '2028-08-31',
    storageMethod: '甘油冻存管 (-80℃)',
    passage: 'P1代',
    storagePerson: '魏明副主任检验师',
    storageTime: '2026-10-20 14:15:00',
    status: '在库备用',
    storageRecords: [
      {
        id: 'sr-12',
        type: '存放记录',
        operator: '魏明副主任检验师',
        time: '2026-10-20 14:15:00',
        purposeOrReason: '哌拉西林/他唑巴坦定量药敏MIC质控',
      },
    ],
    retrievalRecords: [],
    destructionRecords: [],
  },
  {
    id: 'STD-013',
    wellCode: '2-6',
    atccNo: 'ATCC 49247',
    strainBarcode: 'BC099016',
    chineseName: '流感嗜血杆菌 (志贺菌比对)',
    latinName: 'Haemophilus influenzae',
    strainCategory: '抗生素药敏质控',
    sourceOrg: 'ATCC原装保藏',
    lotNo: 'LOT-20260905',
    expiryDate: '2027-12-31',
    storageMethod: '甘油巧克力微量管 (-80℃)',
    passage: 'P1代',
    storagePerson: '李晓红主管检验师',
    storageTime: '2026-10-21 10:30:00',
    status: '在库备用',
    storageRecords: [
      {
        id: 'sr-13',
        type: '存放记录',
        operator: '李晓红主管检验师',
        time: '2026-10-21 10:30:00',
        purposeOrReason: '嗜血杆菌氨苄西林/克拉维酸耐药质控',
      },
    ],
    retrievalRecords: [],
    destructionRecords: [],
  },
  {
    id: 'STD-014',
    wellCode: '2-7',
    atccNo: 'ATCC 49619',
    strainBarcode: 'BC099017',
    chineseName: '肺炎链球菌 (革兰阳性杆菌比对)',
    latinName: 'Streptococcus pneumoniae',
    strainCategory: '抗生素药敏质控',
    sourceOrg: 'CMCC 31001',
    lotNo: 'LOT-20260912',
    expiryDate: '2028-09-30',
    storageMethod: '脱脂甘油保护剂 (-80℃)',
    passage: 'P1代',
    storagePerson: '郭彩霞主任医师',
    storageTime: '2026-10-21 16:10:00',
    status: '在库备用',
    storageRecords: [
      {
        id: 'sr-14',
        type: '存放记录',
        operator: '郭彩霞主任医师',
        time: '2026-10-21 16:10:00',
        purposeOrReason: '链球菌万古霉素/左氧氟沙星药敏质控',
      },
    ],
    retrievalRecords: [],
    destructionRecords: [],
  },
];

export const INITIAL_STANDARD_FREEZER_TREE: StandardFreezerInfo = {
  id: 'std-fr-01',
  name: '海尔超低温冰箱 (-80℃)',
  model: 'Haier DW-86L828BP (标准株专用)',
  temperature: '-80.2 ℃',
  racks: [
    {
      id: 'rack-01',
      name: '上层一号铁架',
      boxes: [
        {
          id: 'box-01',
          code: '18CLT01ECO',
          name: '国家药敏标准质控菌株盒-01',
          rackName: '上层一号铁架',
          freezerName: '海尔超低温冰箱 (-80℃)',
          temperature: '-80℃',
          rows: 6,
          cols: 8,
          strains: INITIAL_STANDARD_STRAINS,
        },
        {
          id: 'box-02',
          code: '19CLT01ECE',
          name: '培养基验收标准菌株盒-02',
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
          name: '真菌与苛养菌质控专用盒',
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
          name: '质谱鉴定与分子诊断参考盒',
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
