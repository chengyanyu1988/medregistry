// 微生物系统 -> 基础设置 -> 报告模板管理数据模型与完整初始数据

export type MicroReportType =
  | '全部模板'
  | '镜检报告'
  | '仪器培养报告'
  | '普通培养报告'
  | '鉴定报告'
  | '初步药敏报告'
  | '最终药敏报告'
  | '危急值双签报告'
  | '多重耐药专档';

export interface MicroReportTemplateItem {
  id: string;
  reportType: Exclude<MicroReportType, '全部模板'>;
  templateFileName: string; // e.g. LSM.cpt, BC_Alert_Rapid.cpt, etc.
  templateName: string;     // e.g. 微生物直接涂片显微镜检报告单
  description: string;      // e.g. 临生免报告模板 / 微生物标准A4直接涂片镜检图文报告
  paperSize: 'A4 纵向 (210×297mm)' | 'A5 横向 (210×148mm)' | '80mm 热敏连续卷纸' | '嵌入式电子病历PDF';
  hospitalHeader: string;
  isDoubleSignatureRequired: boolean;
  hasWatermark: boolean;
  hasQrCode: boolean;
  isEnabled: boolean;
  operator: string;
  operateTime: string;
  previewData?: {
    patientName: string;
    gender: string;
    age: string;
    hospitalNo: string;
    bedNo: string;
    dept: string;
    specimen: string;
    barcode: string;
    microbeName: string;
    smearResult: string;
    cultureResult: string;
    astResults?: Array<{
      drugName: string;
      micValue: string;
      susceptibility: 'S' | 'I' | 'R';
      clsiBreakpoints: string;
    }>;
  };
}

export const INITIAL_MICRO_REPORT_TEMPLATES: MicroReportTemplateItem[] = [
  {
    id: 'tpl-01',
    reportType: '镜检报告',
    templateFileName: 'LSM.cpt',
    templateName: '微生物直接镜检涂片标准报告单',
    description: '临生免报告模板，用于直接涂片、革兰染色、抗酸染色与真菌荧光快速报告',
    paperSize: 'A4 纵向 (210×297mm)',
    hospitalHeader: '中心医院检验科微生物室',
    isDoubleSignatureRequired: false,
    hasWatermark: false,
    hasQrCode: true,
    isEnabled: true,
    operator: '李晓红主管检验师',
    operateTime: '2026-10-25 10:20:15',
    previewData: {
      patientName: '张建国',
      gender: '男',
      age: '58岁',
      hospitalNo: '4359021',
      bedNo: '呼吸内科 12床',
      dept: '呼吸与危重症医学科',
      specimen: '晨痰 (下呼吸道分泌物)',
      barcode: 'B2610250001',
      microbeName: '待培养确证',
      smearResult: '革兰染色查见革兰阳性双球菌(+++)，成对排列，伴大量退化中性粒细胞(>25/低倍视野)，鳞状上皮细胞<10/低倍视野(标本合格)。',
      cultureResult: '正在 35℃ 培养中 (培养满48小时出具最终报告)',
    },
  },
  {
    id: 'tpl-02',
    reportType: '仪器培养报告',
    templateFileName: 'BC_Alert_Rapid.cpt',
    templateName: '全自动血培养仪器报阳极速初报单',
    description: '血培养荧光监测报警专用模板，报阳后10分钟内联动床边急诊与临床病区',
    paperSize: 'A5 横向 (210×148mm)',
    hospitalHeader: '中心医院危急值快速通报中心',
    isDoubleSignatureRequired: true,
    hasWatermark: true,
    hasQrCode: true,
    isEnabled: true,
    operator: '魏明副主任检验师',
    operateTime: '2026-10-26 14:15:30',
    previewData: {
      patientName: '李秀兰',
      gender: '女',
      age: '67岁',
      hospitalNo: '4359188',
      bedNo: '重症医学科(ICU) 05床',
      dept: '重症医学科',
      specimen: '外周静脉全血 (需氧瓶)',
      barcode: 'T26102600002',
      microbeName: '革兰阴性杆菌 (疑似肠杆菌目细菌)',
      smearResult: '【危急值】报阳瓶直接涂片革兰染色查见革兰阴性两端钝圆短杆菌(++++)，已电话通报ICU主管医生。',
      cultureResult: '报阳时间: 培养14小时20分，正在进行MALDI-TOF质谱直接快速鉴定与转种。',
    },
  },
  {
    id: 'tpl-03',
    reportType: '普通培养报告',
    templateFileName: 'Standard_Culture_A4.cpt',
    templateName: '琼脂平板分区划线培养综合报告模板',
    description: '常规分泌物、穿刺液及拭子标本平板分离纯化培养报告',
    paperSize: 'A4 纵向 (210×297mm)',
    hospitalHeader: '中心医院检验医学中心',
    isDoubleSignatureRequired: false,
    hasWatermark: false,
    hasQrCode: true,
    isEnabled: true,
    operator: '刘浩然检验师',
    operateTime: '2026-10-27 09:40:00',
    previewData: {
      patientName: '陈伟强',
      gender: '男',
      age: '42岁',
      hospitalNo: '4358890',
      bedNo: '骨外科 18床',
      dept: '骨科病区',
      specimen: '手术切口分泌物拭子',
      barcode: 'P2610270018',
      microbeName: '金黄色葡萄球菌 (Staphylococcus aureus)',
      smearResult: '直接涂片查见革兰阳性球菌，呈葡萄串状排列。',
      cultureResult: '血琼脂平板经 35℃ 孵育 24 小时，见圆形凸起、表面光滑、具金黄色色素及完全溶血环(β溶血)的优势菌落生长(+++)。',
    },
  },
  {
    id: 'tpl-04',
    reportType: '鉴定报告',
    templateFileName: 'MALDI_TOF_Identification.cpt',
    templateName: '基质辅助激光解吸电离质谱菌种确证单',
    description: 'MALDI-TOF 飞行时间质谱仪蛋白指纹图谱打分确证专属报告',
    paperSize: 'A4 纵向 (210×297mm)',
    hospitalHeader: '中心医院微生物分子与质谱鉴定中心',
    isDoubleSignatureRequired: true,
    hasWatermark: false,
    hasQrCode: true,
    isEnabled: true,
    operator: '郭彩霞主任医师',
    operateTime: '2026-10-27 16:30:10',
    previewData: {
      patientName: '王晓芳',
      gender: '女',
      age: '33岁',
      hospitalNo: '4359302',
      bedNo: '妇产科 08床',
      dept: '妇产科病房',
      specimen: '宫颈管拭子',
      barcode: 'P2610270032',
      microbeName: '无乳链球菌 (Streptococcus agalactiae / GBS)',
      smearResult: '革兰染色查见革兰阳性链状短链球菌。',
      cultureResult: '质谱系统检索数据库匹配打分 2.24 分 (种水平高度可靠确证)，CAMP试验阳性。',
    },
  },
  {
    id: 'tpl-05',
    reportType: '初步药敏报告',
    templateFileName: 'AST_Preliminary_KB.cpt',
    templateName: 'KB纸片琼脂扩散法快速药敏初报单',
    description: '用于急诊感染快速指导经验用药的纸片抑菌圈直径与初步敏感情报',
    paperSize: 'A4 纵向 (210×297mm)',
    hospitalHeader: '中心医院抗菌药物合理应用管理中心',
    isDoubleSignatureRequired: false,
    hasWatermark: false,
    hasQrCode: true,
    isEnabled: true,
    operator: '王宇轩技师',
    operateTime: '2026-10-28 11:25:40',
    previewData: {
      patientName: '赵国栋',
      gender: '男',
      age: '51岁',
      hospitalNo: '4359410',
      bedNo: '急诊重症监护室 02床',
      dept: '急诊医学科',
      specimen: '中段尿',
      barcode: 'U2610280005',
      microbeName: '肺炎克雷伯菌 (Klebsiella pneumoniae)',
      smearResult: '尿沉渣查见散在革兰阴性杆菌。',
      cultureResult: '麦康凯平板产黏液样红色大菌落，初步药敏试验进行中。',
      astResults: [
        { drugName: '哌拉西林/他唑巴坦', micValue: '21mm', susceptibility: 'S', clsiBreakpoints: '>=21mm' },
        { drugName: '头孢曲松', micValue: '12mm', susceptibility: 'R', clsiBreakpoints: '>=23mm' },
        { drugName: '美罗培南', micValue: '25mm', susceptibility: 'S', clsiBreakpoints: '>=23mm' },
        { drugName: '左氧氟沙星', micValue: '18mm', susceptibility: 'I', clsiBreakpoints: '17-20mm' },
        { drugName: '阿米卡星', micValue: '20mm', susceptibility: 'S', clsiBreakpoints: '>=17mm' },
      ],
    },
  },
  {
    id: 'tpl-06',
    reportType: '最终药敏报告',
    templateFileName: 'AST_Comprehensive_Final.cpt',
    templateName: '全谱MIC折点与CLSI耐药表型最终综合报告单',
    description: '微量肉汤稀释法定量MIC、CLSI/EUCAST折点及耐药机制综合权威报告单',
    paperSize: 'A4 纵向 (210×297mm)',
    hospitalHeader: '中心医院国家临床重点专科检验医学科',
    isDoubleSignatureRequired: true,
    hasWatermark: true,
    hasQrCode: true,
    isEnabled: true,
    operator: '郭彩霞主任医师',
    operateTime: '2026-10-29 09:15:20',
    previewData: {
      patientName: '周明',
      gender: '男',
      age: '64岁',
      hospitalNo: '4359670',
      bedNo: '感染性疾病科 22床',
      dept: '感染科',
      specimen: '纤维支气管镜肺泡灌洗液(BALF)',
      barcode: 'B2610290003',
      microbeName: '鲍曼不动杆菌 (Acinetobacter baumannii)',
      smearResult: '涂片查见成团革兰阴性杆球菌，有荚膜。',
      cultureResult: 'VITEK 2 GN 卡与质谱复合鉴定确证，符合泛耐药特征。',
      astResults: [
        { drugName: '美罗培南 (MEM)', micValue: '>=16 μg/mL', susceptibility: 'R', clsiBreakpoints: '<=2(S) / >=8(R)' },
        { drugName: '亚胺培南 (IPM)', micValue: '>=16 μg/mL', susceptibility: 'R', clsiBreakpoints: '<=2(S) / >=8(R)' },
        { drugName: '头孢哌酮/舒巴坦', micValue: '32/16 μg/mL', susceptibility: 'I', clsiBreakpoints: '<=16/8(S)' },
        { drugName: '替加环素 (TGC)', micValue: '1.0 μg/mL', susceptibility: 'S', clsiBreakpoints: '<=2(S)' },
        { drugName: '多黏菌素B (PB)', micValue: '0.5 μg/mL', susceptibility: 'S', clsiBreakpoints: '<=2(S)' },
        { drugName: '阿米卡星 (AK)', micValue: '>=64 μg/mL', susceptibility: 'R', clsiBreakpoints: '<=16(S)' },
        { drugName: '环丙沙星 (CIP)', micValue: '>=4 μg/mL', susceptibility: 'R', clsiBreakpoints: '<=1(S)' },
      ],
    },
  },
  {
    id: 'tpl-07',
    reportType: '危急值双签报告',
    templateFileName: 'Critical_DoubleSign_A4.cpt',
    templateName: '无菌体液阳性危急值双签闭环确认单',
    description: '脑脊液、骨髓、胸腹水等无菌标本报阳两级医师复核与临床接收签字单',
    paperSize: 'A4 纵向 (210×297mm)',
    hospitalHeader: '中心医院医疗质量与安全管理委员会',
    isDoubleSignatureRequired: true,
    hasWatermark: true,
    hasQrCode: true,
    isEnabled: true,
    operator: '魏明副主任检验师',
    operateTime: '2026-10-29 14:40:00',
    previewData: {
      patientName: '孙玉华',
      gender: '女',
      age: '29岁',
      hospitalNo: '4359801',
      bedNo: '神经内科 06床',
      dept: '神经内科',
      specimen: '腰椎穿刺脑脊液(CSF)',
      barcode: 'C2610290001',
      microbeName: '新型隐球菌 (Cryptococcus neoformans)',
      smearResult: '【极危急值】墨汁负染色查见具有宽大透明荚膜圆形成团酵母样真菌，可见出芽！',
      cultureResult: '已通过电话通知神经内科值班医生李明远主治医师，通报时间: 2026-10-29 14:42。',
    },
  },
  {
    id: 'tpl-08',
    reportType: '多重耐药专档',
    templateFileName: 'MDRO_Infection_Card.cpt',
    templateName: '医院感染多重耐药菌(MDRO)接触隔离告知单',
    description: '检出CRE、CRAB、CRPA、MRSA、VRE后联动推送院感科与病区护士站',
    paperSize: 'A4 纵向 (210×297mm)',
    hospitalHeader: '中心医院医院感染管理科 / 检验科联合发布',
    isDoubleSignatureRequired: true,
    hasWatermark: true,
    hasQrCode: true,
    isEnabled: true,
    operator: '李晓红主管检验师',
    operateTime: '2026-10-30 08:30:15',
    previewData: {
      patientName: '吴世安',
      gender: '男',
      age: '72岁',
      hospitalNo: '4359944',
      bedNo: '肾内科 26床',
      dept: '肾内科',
      specimen: '导尿管留置尿液',
      barcode: 'U2610300002',
      microbeName: '碳青霉烯类耐药大肠埃希菌 (CRE)',
      smearResult: '镜检见革兰阴性杆菌。',
      cultureResult: '产KPC型碳青霉烯酶，对碳青霉烯类抗生素高水平耐药。病区须严格实施单间/床边接触隔离！',
    },
  },
];
