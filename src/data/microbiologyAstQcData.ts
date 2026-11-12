export type AstQcStatus = '已完成' | '已登记' | '质控中' | '失控';

export type AstQcCategory = '鉴定质控' | '药敏质控' | '综合质控';

export interface AstSpecimenItem {
  id: string;
  sampleNo: string; // 样本号
  testProject: string; // 试验项目
  specimenType: string; // 标本类型
  age: string; // 年龄
  gender: '男' | '女'; // 性别
  clinicalSymptom: string; // 临床症状
  barcode?: string;
}

export interface AstIdentificationItem {
  id: string;
  organismName: string; // 鉴定菌种
  standardStrain: string; // 标准品菌株
  instrument: string; // 鉴定仪器
  score: string; // 质谱得分 / 符合率
  outcome: '在控' | '合格' | '失控'; // 判定
}

export interface AstDrugSusceptibilityItem {
  id: string;
  antibiotic: string; // 抗生素名称
  method: 'KB' | 'MIC' | 'E-test'; // 方法
  testResult: string; // 药敏结果 (实测直径mm或MIC值)
  interpretation: '敏感' | '中介' | '耐药' | 'SDD'; // 判读结果
  susceptibleRef: string; // 敏感参考
  intermediateRef: string; // 中介参考
  resistantRef: string; // 耐药参考
  qcOutcome: '在控' | '合格' | '失控'; // 质控状态
}

export interface MicrobiologyAstQcItem {
  id: string;
  qcCode: string; // 质控编号
  status: AstQcStatus; // 状态
  category: AstQcCategory; // 质控类别
  qcName: string; // 质控名称
  registerPerson: string; // 登记人
  registerTime: string; // 登记时间
  completeTime?: string; // 完成时间
  auditor?: string; // 审核人
  targetStrain: string; // 质控菌株
  barcode: string; // 条码号
  specimens: AstSpecimenItem[]; // 标本信息列表
  identifications: AstIdentificationItem[]; // 鉴定结果
  astResults: AstDrugSusceptibilityItem[]; // 药敏结果
  projectResultSummary: string; // 质控项目结果
  analysisComment: string; // 项目结果分析
  feedbackResult: string; // 质控反馈结果
  feedbackAnalysis: string; // 结果反馈分析
}

export const INITIAL_AST_QC_LIST: MicrobiologyAstQcItem[] = [
  {
    id: 'ast-01',
    qcCode: '01',
    status: '已完成',
    category: '鉴定质控',
    qcName: '鉴定质控',
    registerPerson: '李晓红主管检验师',
    registerTime: '2026-10-30 08:30:10',
    completeTime: '2026-10-30 09:25:40',
    auditor: '郭彩霞主任医师',
    targetStrain: 'ATCC 25922 (大肠埃希菌标准质控株)',
    barcode: 'QC2026103001',
    specimens: [
      {
        id: 'sp-101',
        sampleNo: '1001',
        testProject: '一般细菌培养及鉴定',
        specimenType: '血液',
        age: '56岁',
        gender: '男',
        clinicalSymptom: '重症肺炎合并脓毒血症，寒战高热',
        barcode: '202610300891',
      },
      {
        id: 'sp-102',
        sampleNo: '1002',
        testProject: '一般细菌真菌培养',
        specimenType: '尿液',
        age: '23岁',
        gender: '女',
        clinicalSymptom: '复杂性尿路感染，尿频尿急尿痛',
        barcode: '202610300892',
      },
      {
        id: 'sp-103',
        sampleNo: '1003',
        testProject: '一般真菌培养',
        specimenType: '粪便',
        age: '30岁',
        gender: '男',
        clinicalSymptom: '长期使用广谱抗生素后重症腹泻',
        barcode: '202610300893',
      },
    ],
    identifications: [
      {
        id: 'id-101',
        organismName: '大肠埃希菌 (Escherichia coli)',
        standardStrain: 'ATCC 25922',
        instrument: 'MALDI-TOF 飞行时间质谱仪',
        score: '99.9% (得分 2.450 极高置信度)',
        outcome: '在控',
      },
      {
        id: 'id-102',
        organismName: '吕氏无色杆菌 (Achromobacter lwoffii)',
        standardStrain: 'ATCC 15309',
        instrument: 'VITEK-2 自动生化鉴定卡',
        score: '99.4% (符合率极高)',
        outcome: '在控',
      },
    ],
    astResults: [
      {
        id: 'ast-r-101',
        antibiotic: '氨苄西林',
        method: 'KB',
        testResult: '19 mm',
        interpretation: '敏感',
        susceptibleRef: '≥17 mm',
        intermediateRef: '14-16 mm',
        resistantRef: '≤13 mm',
        qcOutcome: '在控',
      },
      {
        id: 'ast-r-102',
        antibiotic: '头孢西丁',
        method: 'KB',
        testResult: '25 mm',
        interpretation: '敏感',
        susceptibleRef: '≥22 mm',
        intermediateRef: '18-21 mm',
        resistantRef: '≤17 mm',
        qcOutcome: '在控',
      },
      {
        id: 'ast-r-103',
        antibiotic: '庆大霉素',
        method: 'KB',
        testResult: '21 mm',
        interpretation: '敏感',
        susceptibleRef: '≥15 mm',
        intermediateRef: '13-14 mm',
        resistantRef: '≤12 mm',
        qcOutcome: '在控',
      },
      {
        id: 'ast-r-104',
        antibiotic: '左氧氟沙星',
        method: 'KB',
        testResult: '31 mm',
        interpretation: '敏感',
        susceptibleRef: '≥21 mm',
        intermediateRef: '17-20 mm',
        resistantRef: '≤16 mm',
        qcOutcome: '在控',
      },
      {
        id: 'ast-r-105',
        antibiotic: '美罗培南',
        method: 'MIC',
        testResult: '≤0.25 ug/mL',
        interpretation: '敏感',
        susceptibleRef: '≤1 ug/mL',
        intermediateRef: '2 ug/mL',
        resistantRef: '≥4 ug/mL',
        qcOutcome: '在控',
      },
      {
        id: 'ast-r-106',
        antibiotic: '头孢他啶',
        method: 'KB',
        testResult: '28 mm',
        interpretation: '敏感',
        susceptibleRef: '≥21 mm',
        intermediateRef: '18-20 mm',
        resistantRef: '≤17 mm',
        qcOutcome: '在控',
      },
    ],
    projectResultSummary:
      '质控指示菌株鉴定符合率 100%，质谱特征峰匹配完好；测试常规抗生素抑制圈直径与MIC值均落在 CLSI M100 第34版允许质控范围内，质控在控。',
    analysisComment:
      '本批次质控大肠埃希菌 ATCC 25922 连续3天处于稳定分布区间，Westgard质控多规则无违反现象，系统精密度与准确度合格，临床批次报告准予审核发放。',
    feedbackResult: '在控合格，本批次常规培养基与药敏纸片准予出具临床报告。',
    feedbackAnalysis: '仪器状态稳定，试剂批号批间差CV值 < 3.5%，无系统性偏倚。',
  },
  {
    id: 'ast-02',
    qcCode: '02',
    status: '已登记',
    category: '药敏质控',
    qcName: '药敏质控',
    registerPerson: '刘浩然检验师',
    registerTime: '2026-10-29 14:15:20',
    completeTime: '2026-10-29 16:00:15',
    auditor: '魏明副主任检验师',
    targetStrain: 'ATCC 25923 (金黄色葡萄球菌标准质控株)',
    barcode: 'QC2026102902',
    specimens: [
      {
        id: 'sp-201',
        sampleNo: '1004',
        testProject: '一般细菌培养',
        specimenType: '创面分泌物',
        age: '45岁',
        gender: '男',
        clinicalSymptom: '术后创口脓性渗出，疑MRSA感染',
        barcode: '202610290451',
      },
      {
        id: 'sp-202',
        sampleNo: '1005',
        testProject: '一般细菌培养',
        specimenType: '痰液',
        age: '62岁',
        gender: '女',
        clinicalSymptom: '肺部感染咳黄浓痰，发热38.7℃',
        barcode: '202610290452',
      },
    ],
    identifications: [
      {
        id: 'id-201',
        organismName: '金黄色葡萄球菌 (Staphylococcus aureus)',
        standardStrain: 'ATCC 25923',
        instrument: '质谱+触酶血浆凝固酶',
        score: '99.9% (触酶强阳性，凝固酶阳性)',
        outcome: '在控',
      },
    ],
    astResults: [
      {
        id: 'ast-r-201',
        antibiotic: '青霉素',
        method: 'KB',
        testResult: '32 mm',
        interpretation: '敏感',
        susceptibleRef: '≥29 mm',
        intermediateRef: '-',
        resistantRef: '≤28 mm',
        qcOutcome: '在控',
      },
      {
        id: 'ast-r-202',
        antibiotic: '头孢西丁 (苯唑西林替代)',
        method: 'KB',
        testResult: '26 mm',
        interpretation: '敏感',
        susceptibleRef: '≥22 mm',
        intermediateRef: '-',
        resistantRef: '≤21 mm',
        qcOutcome: '在控',
      },
      {
        id: 'ast-r-203',
        antibiotic: '红霉素',
        method: 'KB',
        testResult: '27 mm',
        interpretation: '敏感',
        susceptibleRef: '≥23 mm',
        intermediateRef: '14-22 mm',
        resistantRef: '≤13 mm',
        qcOutcome: '在控',
      },
      {
        id: 'ast-r-204',
        antibiotic: '利福平',
        method: 'MIC',
        testResult: '≤0.5 ug/mL',
        interpretation: '敏感',
        susceptibleRef: '≤1 ug/mL',
        intermediateRef: '2 ug/mL',
        resistantRef: '≥4 ug/mL',
        qcOutcome: '在控',
      },
      {
        id: 'ast-r-205',
        antibiotic: '米诺环素',
        method: 'KB',
        testResult: '24 mm',
        interpretation: '敏感',
        susceptibleRef: '≥19 mm',
        intermediateRef: '15-18 mm',
        resistantRef: '≤14 mm',
        qcOutcome: '在控',
      },
      {
        id: 'ast-r-206',
        antibiotic: '万古霉素',
        method: 'MIC',
        testResult: '1.0 ug/mL',
        interpretation: '敏感',
        susceptibleRef: '≤2 ug/mL',
        intermediateRef: '4-8 ug/mL',
        resistantRef: '≥16 ug/mL',
        qcOutcome: '在控',
      },
    ],
    projectResultSummary:
      '金葡菌质控靶菌在M-H琼脂上生长旺盛，头孢西丁初筛阴性排除MRSA伪影，各药敏环清晰锐利，符合CLSI质控靶值区间。',
    analysisComment:
      '纸片批号LOT-20260930保存状况良好，无吸潮氧化现象，万古霉素E-test实测1.0 ug/mL与预期靶值严格吻合。',
    feedbackResult: '在控合格，药敏测试结果可靠。',
    feedbackAnalysis: '温箱温度35℃，孵育时间20h严格达标。',
  },
  {
    id: 'ast-03',
    qcCode: '03',
    status: '已登记',
    category: '鉴定质控',
    qcName: '鉴定质控',
    registerPerson: '王宇轩技师',
    registerTime: '2026-10-29 09:10:00',
    completeTime: '2026-10-29 10:30:12',
    auditor: '李晓红主管检验师',
    targetStrain: 'ATCC 27853 (铜绿假单胞菌标准质控株)',
    barcode: 'QC2026102903',
    specimens: [
      {
        id: 'sp-301',
        sampleNo: '1006',
        testProject: '一般细菌培养及鉴定',
        specimenType: '血液',
        age: '68岁',
        gender: '男',
        clinicalSymptom: '大面积烧伤后绿脓杆菌菌血症',
        barcode: '202610290501',
      },
      {
        id: 'sp-302',
        sampleNo: '1007',
        testProject: '一般细菌培养及鉴定',
        specimenType: '中段尿',
        age: '54岁',
        gender: '女',
        clinicalSymptom: '留置导尿管相关尿路感染',
        barcode: '202610290502',
      },
    ],
    identifications: [
      {
        id: 'id-301',
        organismName: '铜绿假单胞菌 (Pseudomonas aeruginosa)',
        standardStrain: 'ATCC 27853',
        instrument: 'MALDI-TOF 飞行时间质谱仪',
        score: '99.9% (得分 2.410 极高置信度)',
        outcome: '在控',
      },
      {
        id: 'id-302',
        organismName: '嗜麦芽窄食单胞菌 (Stenotrophomonas maltophilia)',
        standardStrain: 'ATCC 17666',
        instrument: 'VITEK-2 自动生化鉴定卡',
        score: '99.2% (得分 2.290)',
        outcome: '在控',
      },
    ],
    astResults: [
      {
        id: 'ast-r-301',
        antibiotic: '头孢他啶',
        method: 'KB',
        testResult: '25 mm',
        interpretation: '敏感',
        susceptibleRef: '≥18 mm',
        intermediateRef: '15-17 mm',
        resistantRef: '≤14 mm',
        qcOutcome: '在控',
      },
      {
        id: 'ast-r-302',
        antibiotic: '哌拉西林/他唑巴坦',
        method: 'KB',
        testResult: '26 mm',
        interpretation: '敏感',
        susceptibleRef: '≥21 mm',
        intermediateRef: '15-20 mm',
        resistantRef: '≤14 mm',
        qcOutcome: '在控',
      },
      {
        id: 'ast-r-303',
        antibiotic: '亚胺培南',
        method: 'KB',
        testResult: '24 mm',
        interpretation: '敏感',
        susceptibleRef: '≥19 mm',
        intermediateRef: '16-18 mm',
        resistantRef: '≤15 mm',
        qcOutcome: '在控',
      },
      {
        id: 'ast-r-304',
        antibiotic: '阿米卡星',
        method: 'KB',
        testResult: '22 mm',
        interpretation: '敏感',
        susceptibleRef: '≥17 mm',
        intermediateRef: '15-16 mm',
        resistantRef: '≤14 mm',
        qcOutcome: '在控',
      },
      {
        id: 'ast-r-305',
        antibiotic: '环丙沙星',
        method: 'KB',
        testResult: '28 mm',
        interpretation: '敏感',
        susceptibleRef: '≥25 mm',
        intermediateRef: '19-24 mm',
        resistantRef: '≤18 mm',
        qcOutcome: '在控',
      },
    ],
    projectResultSummary:
      '假单胞菌属氧化酶强阳性，绿脓菌素色素分泌典型，非发酵菌群药敏测试结果全部在靶心范围内。',
    analysisComment:
      '质控结果重复性良好，CLSI M100铜绿靶菌质控达标，亚胺培南未见因锌离子过高导致的异常缩小现象。',
    feedbackResult: '在控合格。',
    feedbackAnalysis: 'M-H琼脂二价阳离子浓度合适，符合质控规程。',
  },
  {
    id: 'ast-04',
    qcCode: '04',
    status: '失控',
    category: '药敏质控',
    qcName: '药敏质控',
    registerPerson: '刘浩然检验师',
    registerTime: '2026-10-28 10:20:00',
    completeTime: '2026-10-28 11:40:00',
    auditor: '李晓红主管检验师',
    targetStrain: 'ATCC 49619 (肺炎链球菌标准质控株)',
    barcode: 'QC2026102804',
    specimens: [
      {
        id: 'sp-401',
        sampleNo: '1008',
        testProject: '一般细菌培养',
        specimenType: '痰液',
        age: '72岁',
        gender: '男',
        clinicalSymptom: '社区获得性重症肺炎，咳铁锈色痰',
        barcode: '202610280711',
      },
    ],
    identifications: [
      {
        id: 'id-401',
        organismName: '肺炎链球菌 (Streptococcus pneumoniae)',
        standardStrain: 'ATCC 49619',
        instrument: '质谱+奥普托欣敏感试验',
        score: '99.9% (奥普托欣抑菌圈 18mm 敏感)',
        outcome: '在控',
      },
    ],
    astResults: [
      {
        id: 'ast-r-401',
        antibiotic: '青霉素',
        method: 'KB',
        testResult: '12 mm',
        interpretation: '耐药',
        susceptibleRef: '≥24 mm',
        intermediateRef: '-',
        resistantRef: '≤19 mm',
        qcOutcome: '失控',
      },
      {
        id: 'ast-r-402',
        antibiotic: '红霉素',
        method: 'KB',
        testResult: '18 mm',
        interpretation: '中介',
        susceptibleRef: '≥21 mm',
        intermediateRef: '16-20 mm',
        resistantRef: '≤15 mm',
        qcOutcome: '失控',
      },
      {
        id: 'ast-r-403',
        antibiotic: '左氧氟沙星',
        method: 'KB',
        testResult: '20 mm',
        interpretation: '敏感',
        susceptibleRef: '≥17 mm',
        intermediateRef: '14-16 mm',
        resistantRef: '≤13 mm',
        qcOutcome: '在控',
      },
    ],
    projectResultSummary:
      '失控警报！青霉素与红霉素纸片在含5%脱纤维羊血M-H板上抑菌环显著小于CLSI质控允许下限。',
    analysisComment:
      '调查原因：CO2孵育培养箱二氧化碳浓度探头校准偏移（实测仅2.8%，标准要求5%±1%），导致血平板酸碱度异常及抑菌圈收缩。已通知设备科调校温箱气阀，报废本次试验并重新接种质控。',
    feedbackResult: '失控！已暂停该温箱内链球菌批次报告发放。',
    feedbackAnalysis: '启动CAPA纠正预防措施，重新校准CO2传感器并复测质控。',
  },
  {
    id: 'ast-05',
    qcCode: '05',
    status: '已完成',
    category: '综合质控',
    qcName: '综合质控',
    registerPerson: '孙丽丽主管检验师',
    registerTime: '2026-10-27 08:50:00',
    completeTime: '2026-10-27 10:15:30',
    auditor: '郭彩霞主任医师',
    targetStrain: 'ATCC 700603 (产超广谱β-内酰胺酶 ESBL 质控株)',
    barcode: 'QC2026102705',
    specimens: [
      {
        id: 'sp-501',
        sampleNo: '1009',
        testProject: '一般细菌培养及耐药表型初筛',
        specimenType: '血液',
        age: '60岁',
        gender: '女',
        clinicalSymptom: '腹腔感染术后发热，疑似ESBL耐药菌株感染',
        barcode: '202610270901',
      },
    ],
    identifications: [
      {
        id: 'id-501',
        organismName: '肺炎克雷伯菌 (Klebsiella pneumoniae)',
        standardStrain: 'ATCC 700603',
        instrument: 'MALDI-TOF 飞行时间质谱仪',
        score: '99.9% (得分 2.430)',
        outcome: '在控',
      },
    ],
    astResults: [
      {
        id: 'ast-r-501',
        antibiotic: '头孢他啶 (CAZ)',
        method: 'KB',
        testResult: '15 mm',
        interpretation: '耐药',
        susceptibleRef: '≥21 mm',
        intermediateRef: '18-20 mm',
        resistantRef: '≤17 mm',
        qcOutcome: '在控',
      },
      {
        id: 'ast-r-502',
        antibiotic: '头孢他啶/克拉维酸 (CAZ/CA)',
        method: 'KB',
        testResult: '23 mm (增大量 8mm ≥5mm)',
        interpretation: '敏感',
        susceptibleRef: '差值≥5mm确证ESBL(+)',
        intermediateRef: '-',
        resistantRef: '差值<5mm',
        qcOutcome: '在控',
      },
      {
        id: 'ast-r-503',
        antibiotic: '头孢噻肟 (CTX)',
        method: 'KB',
        testResult: '17 mm',
        interpretation: '耐药',
        susceptibleRef: '≥26 mm',
        intermediateRef: '23-25 mm',
        resistantRef: '≤22 mm',
        qcOutcome: '在控',
      },
      {
        id: 'ast-r-504',
        antibiotic: '头孢噻肟/克拉维酸 (CTX/CA)',
        method: 'KB',
        testResult: '25 mm (增大量 8mm ≥5mm)',
        interpretation: '敏感',
        susceptibleRef: '差值≥5mm确证ESBL(+)',
        intermediateRef: '-',
        resistantRef: '差值<5mm',
        qcOutcome: '在控',
      },
    ],
    projectResultSummary:
      '双纸片确证试验表型阳性，克拉维酸协同扩大抑菌环差值均 ≥ 5mm，准确验证产超广谱β-内酰胺酶(ESBL)耐药表型检测系统灵敏度。',
    analysisComment:
      '质控结果符合CLSI M100耐药机制确证指南，仪器与手工双纸片协同表型检出率100%。',
    feedbackResult: '在控合格，ESBL检测体系精准可靠。',
    feedbackAnalysis: '质控菌株传代P2代，表型表达稳定。',
  },
];
