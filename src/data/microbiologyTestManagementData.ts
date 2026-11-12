export interface MicrobiologyTestItem {
  id: string;
  testStatus: '检验中' | '已完成' | '待接种';
  isQualified: '合格' | '不合格';
  sampleNo: string; // 样本号 (T001001 / B01001)
  patientId: string; // 病人标识/病历号 (540093)
  patientName: string; // 姓名 (张立国)
  gender: '男' | '女';
  age: string;
  phone: string;
  patientSource: '门诊' | '住院' | '急诊';
  department: string; // 科室 (内科 / 血液内科)
  ward: string; // 病区
  bedNo: string; // 床号 (18床)
  doctorPhone: string;
  sampleType: string; // 标本类型 (痰液, 血液, 尿液)
  testItem: string; // 检验项目 (痰培养, 血培养)
  isUrgent: boolean; // 是否急诊
  barcode: string; // 采集条码 (1343045435)
  checkInTime: string; // 核收时间 (2026-10-30 08:50)
  clinicalDiagnosis: string; // 临床诊断 (伤寒 / 肺部感染待查)
  extraInfo: string; // 附加信息 (发热寒战，痰涂片需优先处理)

  // 制片与镜检数据
  smearSlides: Array<{
    id: string;
    slideCode: string; // T001002_01
    stainMethod: '革兰染色' | '抗酸染色' | '荧光染色' | '墨汁染色';
    prepTime: string; // 2026-10-30 10:12:30
    prepPerson: string; // 李晓红主管检验师
    description: string; // 见较多革兰氏阴性短杆菌，中性粒细胞满视野
  }>;

  smearConclusion: string; // 镜检结论文本
  microscopeImages: Array<{
    id: string;
    title: string;
    url: string; // 显微图像缩略图
  }>;

  // 鉴定药敏结果
  strainResult: string; // 检出菌株名称 (大肠埃希菌 / 铜绿假单胞菌 / MRSA)
  astResults: Array<{
    antibiotic: string; // 抗菌药物名称 (头孢噻肟, 万古霉素, 美罗培南)
    micValue: string; // MIC值 (<=1ug/mL)
    susceptibility: 'S' | 'I' | 'R'; // 敏感 / 中介 / 耐药
  }>;
}

export const INITIAL_MICROBIOLOGY_TEST_ITEMS: MicrobiologyTestItem[] = [
  {
    id: 'MT-001',
    testStatus: '检验中',
    isQualified: '合格',
    sampleNo: 'T001001',
    patientId: '540093',
    patientName: '张立国',
    gender: '男',
    age: '52岁',
    phone: '15080708090',
    patientSource: '住院',
    department: '呼吸与危重症医学科',
    ward: '内科三病区',
    bedNo: '18床',
    doctorPhone: '028-85783783',
    sampleType: '痰液',
    testItem: '痰液细菌及真菌培养+药敏',
    isUrgent: true,
    barcode: '134304543501',
    checkInTime: '2026-10-30 08:50',
    clinicalDiagnosis: '重症肺炎 / 肺部感染待查',
    extraInfo: '患者持续高热39.2℃，咳黄脓痰，优先做革兰染色与质谱鉴定',
    smearSlides: [
      {
        id: 'SL-01',
        slideCode: 'T001001_01',
        stainMethod: '革兰染色',
        prepTime: '2026-10-30 09:12:30',
        prepPerson: '李晓红主管检验师',
        description: '见大量中性粒细胞(>25/低倍视野)，上皮细胞<10/低倍视野，散在革兰氏阴性短杆菌',
      },
      {
        id: 'SL-02',
        slideCode: 'T001001_02',
        stainMethod: '抗酸染色',
        prepTime: '2026-10-30 09:20:15',
        prepPerson: '刘浩然检验师',
        description: '未查到抗酸杆菌 (300个视野未见红色菌体)',
      },
    ],
    smearConclusion: '涂片革兰氏染色找到革兰氏阴性短杆菌；未查到抗酸杆菌。建议结合痰培养结果。',
    microscopeImages: [
      { id: 'IMG-1', title: '革兰氏阴性杆菌 1000x 油镜', url: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=300&auto=format&fit=crop&q=80' },
      { id: 'IMG-2', title: '抗酸染色负性视野 1000x', url: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=300&auto=format&fit=crop&q=80' },
      { id: 'IMG-3', title: '痰涂片白细胞侵润 400x', url: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=300&auto=format&fit=crop&q=80' },
      { id: 'IMG-4', title: '质谱靶板菌落点样图', url: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=300&auto=format&fit=crop&q=80' },
    ],
    strainResult: '肺炎克雷伯菌 (Klebsiella pneumoniae - ESBL阳性)',
    astResults: [
      { antibiotic: '美罗培南 (Meropenem)', micValue: '<=0.25', susceptibility: 'S' },
      { antibiotic: '亚胺培南 (Imipenem)', micValue: '<=0.5', susceptibility: 'S' },
      { antibiotic: '头孢曲松 (Ceftriaxone)', micValue: '>=64', susceptibility: 'R' },
      { antibiotic: '头孢他啶 (Ceftazidime)', micValue: '>=32', susceptibility: 'R' },
      { antibiotic: '左氧氟沙星 (Levofloxacin)', micValue: '2.0', susceptibility: 'I' },
      { antibiotic: '阿米卡星 (Amikacin)', micValue: '<=2.0', susceptibility: 'S' },
    ],
  },
  {
    id: 'MT-002',
    testStatus: '检验中',
    isQualified: '合格',
    sampleNo: 'T001002',
    patientId: '540223',
    patientName: '李晓红',
    gender: '女',
    age: '46岁',
    phone: '13808001122',
    patientSource: '住院',
    department: '肾内科',
    ward: '肾内病区',
    bedNo: '12床',
    doctorPhone: '028-85783784',
    sampleType: '尿液',
    testItem: '普通尿液细菌培养+药敏',
    isUrgent: false,
    barcode: '134304543402',
    checkInTime: '2026-10-30 09:05',
    clinicalDiagnosis: '急性肾盂肾炎',
    extraInfo: '中段尿无菌留取，尿常规白细胞(3+)',
    smearSlides: [
      {
        id: 'SL-03',
        slideCode: 'T001002_01',
        stainMethod: '革兰染色',
        prepTime: '2026-10-30 09:30:00',
        prepPerson: '李晓红主管检验师',
        description: '见大量革兰氏阴性杆菌成堆分布',
      },
    ],
    smearConclusion: '尿沉渣涂片革兰氏染色查到多量革兰氏阴性杆菌。',
    microscopeImages: [
      { id: 'IMG-5', title: '尿沉渣革兰氏阴性杆菌 1000x', url: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=300&auto=format&fit=crop&q=80' },
    ],
    strainResult: '大肠埃希菌 (Escherichia coli)',
    astResults: [
      { antibiotic: '环丙沙星 (Ciprofloxacin)', micValue: '<=0.25', susceptibility: 'S' },
      { antibiotic: '头孢唑林 (Cefazolin)', micValue: '1.0', susceptibility: 'S' },
      { antibiotic: '复方新诺明 (TMP-SMX)', micValue: '>=320', susceptibility: 'R' },
      { antibiotic: '呋喃妥因 (Nitrofurantoin)', micValue: '<=16', susceptibility: 'S' },
    ],
  },
  {
    id: 'MT-003',
    testStatus: '检验中',
    isQualified: '合格',
    sampleNo: 'T001003',
    patientId: '540232',
    patientName: '王建平',
    gender: '男',
    age: '68岁',
    phone: '13900112233',
    patientSource: '住院',
    department: '血液内科',
    ward: '血液病区',
    bedNo: '05床',
    doctorPhone: '028-85783785',
    sampleType: '全血',
    testItem: '全自动双瓶血培养',
    isUrgent: true,
    barcode: '134304543203',
    checkInTime: '2026-10-30 09:15',
    clinicalDiagnosis: '粒缺伴发热 / 败血症待排',
    extraInfo: '化疗后白细胞极低(0.4x10^9/L)，发热39.5℃，需氧瓶与厌氧瓶双瓶送检',
    smearSlides: [
      {
        id: 'SL-04',
        slideCode: 'T001003_01',
        stainMethod: '革兰染色',
        prepTime: '2026-10-30 09:40:00',
        prepPerson: '魏主任',
        description: '需氧瓶报阳转种，见革兰氏阳性球菌成对或短链状排列',
      },
    ],
    smearConclusion: '血培养报阳涂片找到革兰氏阳性球菌，疑似葡萄球菌属或肠球菌属。',
    microscopeImages: [
      { id: 'IMG-6', title: '血培养革兰氏阳性葡萄球菌 1000x', url: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=300&auto=format&fit=crop&q=80' },
    ],
    strainResult: '耐甲氧西林金黄色葡萄球菌 (MRSA)',
    astResults: [
      { antibiotic: '万古霉素 (Vancomycin)', micValue: '1.0', susceptibility: 'S' },
      { antibiotic: '利奈唑胺 (Linezolid)', micValue: '2.0', susceptibility: 'S' },
      { antibiotic: '苯唑西林 (Oxacillin)', micValue: '>=4.0', susceptibility: 'R' },
      { antibiotic: '红霉素 (Erythromycin)', micValue: '>=8.0', susceptibility: 'R' },
    ],
  },
  {
    id: 'MT-004',
    testStatus: '检验中',
    isQualified: '合格',
    sampleNo: 'T001004',
    patientId: '540231',
    patientName: '陈淑珍',
    gender: '女',
    age: '58岁',
    phone: '13811223344',
    patientSource: '急诊',
    department: '神经外科ICU',
    ward: 'ICU',
    bedNo: '08床',
    doctorPhone: '028-85783786',
    sampleType: '脑脊液',
    testItem: '脑脊液常规培养及墨汁染色',
    isUrgent: true,
    barcode: '134304543104',
    checkInTime: '2026-10-30 09:30',
    clinicalDiagnosis: '术后颅内感染待查',
    extraInfo: '脑脊液浑浊，蛋白升高，墨汁染色与培养同时处理',
    smearSlides: [
      {
        id: 'SL-05',
        slideCode: 'T001004_01',
        stainMethod: '墨汁染色',
        prepTime: '2026-10-30 09:50:00',
        prepPerson: '郭彩霞主任医师',
        description: '未见带厚胶质荚膜的圆形隐球菌',
      },
    ],
    smearConclusion: '脑脊液涂片墨汁染色未见隐球菌；革兰氏染色见少量革兰阳性球菌。',
    microscopeImages: [
      { id: 'IMG-7', title: '墨汁染色视野 400x', url: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=300&auto=format&fit=crop&q=80' },
    ],
    strainResult: '表皮葡萄球菌 (Staphylococcus epidermidis)',
    astResults: [
      { antibiotic: '万古霉素 (Vancomycin)', micValue: '0.5', susceptibility: 'S' },
      { antibiotic: '达托霉素 (Daptomycin)', micValue: '0.25', susceptibility: 'S' },
    ],
  },
  {
    id: 'MT-005',
    testStatus: '检验中',
    isQualified: '合格',
    sampleNo: 'T001005',
    patientId: '540235',
    patientName: '周燕',
    gender: '女',
    age: '39岁',
    phone: '13700112255',
    patientSource: '门诊',
    department: '妇科门诊',
    ward: '门诊',
    bedNo: '-',
    doctorPhone: '028-85783787',
    sampleType: '阴道分泌物',
    testItem: '分泌物真菌与滴虫镜检',
    isUrgent: false,
    barcode: '134304543305',
    checkInTime: '2026-10-30 09:45',
    clinicalDiagnosis: '霉菌性阴道炎待排',
    extraInfo: '白带豆腐渣样',
    smearSlides: [
      {
        id: 'SL-06',
        slideCode: 'T001005_01',
        stainMethod: '革兰染色',
        prepTime: '2026-10-30 10:00:00',
        prepPerson: '张立平主管检验师',
        description: '可见假菌丝及出芽孢子，清洁度三度',
      },
    ],
    smearConclusion: '涂片查到假菌丝及孢子，提示念珠菌感染。未查到阴道毛滴虫。',
    microscopeImages: [
      { id: 'IMG-8', title: '白念珠菌假菌丝与孢子 400x', url: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=300&auto=format&fit=crop&q=80' },
    ],
    strainResult: '白假丝酵母菌 (Candida albicans)',
    astResults: [
      { antibiotic: '氟康唑 (Fluconazole)', micValue: '<=1.0', susceptibility: 'S' },
      { antibiotic: '伏立康唑 (Voriconazole)', micValue: '<=0.12', susceptibility: 'S' },
    ],
  },
  {
    id: 'MT-006',
    testStatus: '已完成',
    isQualified: '不合格',
    sampleNo: 'T001006',
    patientId: '540244',
    patientName: '陈鑫',
    gender: '男',
    age: '29岁',
    phone: '13899887766',
    patientSource: '门诊',
    department: '发热门诊',
    ward: '门诊',
    bedNo: '-',
    doctorPhone: '028-85783788',
    sampleType: '尿液',
    testItem: '普通尿液细菌培养',
    isUrgent: false,
    barcode: '134304543606',
    checkInTime: '2026-10-30 10:00',
    clinicalDiagnosis: '尿路感染',
    extraInfo: '试管采血量或尿液污染',
    smearSlides: [],
    smearConclusion: '标本重度污染，未见明确单一占位致病菌，建议重新留取无菌中段尿送检。',
    microscopeImages: [],
    strainResult: '标本污染 (混合菌群生长)',
    astResults: [],
  },
];
