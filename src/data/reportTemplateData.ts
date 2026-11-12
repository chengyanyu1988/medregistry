export interface ReportTemplateItem {
  id: string;
  templateFile: string;
  templateName: string;
  templateDesc: string;
  isDefault: boolean;
  paperSize: string;
  designer: string;
  updatedAt: string;
}

export interface RestrictionCondition {
  id: string;
  applyCode: string;
  applyName: string;
  specimenType: string;
  deptName: string;
}

export interface TestUnitTemplateConfig {
  id: string;
  seqNo: number;
  subGroup: string;
  unitName: string;
  unitCode: string;
  isConfigured: boolean;
  creator: string;
  updatedAt: string;
  templates: ReportTemplateItem[];
  restrictions: RestrictionCondition[];
}

export const INITIAL_REPORT_TEMPLATE_CONFIGS: TestUnitTemplateConfig[] = [
  {
    id: 'RPT-UNIT-01',
    seqNo: 1,
    subGroup: '临检组',
    unitName: '希森美康XS500i',
    unitCode: 'XS500i-01',
    isConfigured: true,
    creator: '张珊',
    updatedAt: '2026-10-30 08:30',
    templates: [
      {
        id: 'TPL-01',
        templateFile: 'LSM_Standard.cpt',
        templateName: '全血细胞分析标准A4报告单',
        templateDesc: '包含WBC五分类直方图、散点图与危急值标识双栏套打',
        isDefault: true,
        paperSize: 'A4 竖向',
        designer: '张珊',
        updatedAt: '2026-10-30 08:30'
      },
      {
        id: 'TPL-02',
        templateFile: 'LSM_Compact_A5.cpt',
        templateName: '急诊血常规精简A5单页',
        templateDesc: '专用于急诊快速出具的单页A5激光打印模板',
        isDefault: false,
        paperSize: 'A5 横向',
        designer: '蔡文斌',
        updatedAt: '2026-10-28 14:10'
      }
    ],
    restrictions: [
      { id: 'RES-01', applyCode: '0012', applyName: '全血细胞计数五分类 (血常规)', specimenType: '全血', deptName: '全院通用' },
      { id: 'RES-02', applyCode: '0015', applyName: '网织红细胞计数', specimenType: '全血', deptName: '门诊/病区' }
    ]
  },
  {
    id: 'RPT-UNIT-02',
    seqNo: 2,
    subGroup: '临检组',
    unitName: '希森美康XS1000i',
    unitCode: 'XS1000i-01',
    isConfigured: false,
    creator: '蔡文斌',
    updatedAt: '2026-10-25 10:15',
    templates: [],
    restrictions: []
  },
  {
    id: 'RPT-UNIT-03',
    seqNo: 3,
    subGroup: '生化组',
    unitName: '贝克曼AU5800全自动生化仪',
    unitCode: 'AU5800-01',
    isConfigured: true,
    creator: '陈志远',
    updatedAt: '2026-10-30 09:12',
    templates: [
      {
        id: 'TPL-03',
        templateFile: 'LSM_BioChem_Full.cpt',
        templateName: '常规生化全套多项组合A4报告单',
        templateDesc: '支持肝功/肾功/电解质/心肌酶谱多套项目联合打印',
        isDefault: true,
        paperSize: 'A4 竖向',
        designer: '陈志远',
        updatedAt: '2026-10-30 09:12'
      }
    ],
    restrictions: [
      { id: 'RES-03', applyCode: '02121', applyName: '肝功能全套五项', specimenType: '血清', deptName: '消化内科/外科' },
      { id: 'RES-04', applyCode: '02321', applyName: '肾功能全套七项', specimenType: '血清', deptName: '肾内科' }
    ]
  },
  {
    id: 'RPT-UNIT-04',
    seqNo: 4,
    subGroup: '生化组',
    unitName: '迈瑞BS400全自动生化分析仪',
    unitCode: 'BS400-01',
    isConfigured: false,
    creator: '林德胜',
    updatedAt: '2026-10-22 16:40',
    templates: [],
    restrictions: []
  },
  {
    id: 'RPT-UNIT-05',
    seqNo: 5,
    subGroup: '免疫组',
    unitName: '迈瑞CL2000i全自动化学发光仪',
    unitCode: 'CL2000i-01',
    isConfigured: true,
    creator: '黄雅芳',
    updatedAt: '2026-10-29 15:20',
    templates: [
      {
        id: 'TPL-04',
        templateFile: 'LSM_Immuno_Thyroid.cpt',
        templateName: '甲状腺功能发光定量报告单',
        templateDesc: '带参考区间图形条与历史对比趋势图',
        isDefault: true,
        paperSize: 'A4 竖向',
        designer: '黄雅芳',
        updatedAt: '2026-10-29 15:20'
      }
    ],
    restrictions: [
      { id: 'RES-05', applyCode: '03102', applyName: '甲状腺功能七项定量', specimenType: '血清', deptName: '内分泌科' }
    ]
  },
  {
    id: 'RPT-UNIT-06',
    seqNo: 6,
    subGroup: '临检组',
    unitName: '迈瑞CS5100全自动凝血分析仪',
    unitCode: 'CS5100-01',
    isConfigured: true,
    creator: '徐晓丽',
    updatedAt: '2026-10-29 11:05',
    templates: [
      {
        id: 'TPL-05',
        templateFile: 'LSM_Coagulation.cpt',
        templateName: '凝血常规四项与D-二聚体报告单',
        templateDesc: '含PT/APTT/TT/FIB标准秒数与INR换算',
        isDefault: true,
        paperSize: 'A4 竖向',
        designer: '徐晓丽',
        updatedAt: '2026-10-29 11:05'
      }
    ],
    restrictions: [
      { id: 'RES-06', applyCode: '04001', applyName: '凝血常规四项', specimenType: '枸橼酸血浆', deptName: '心外科/骨科/产科' }
    ]
  },
  {
    id: 'RPT-UNIT-07',
    seqNo: 7,
    subGroup: '免疫组',
    unitName: '罗氏Cobas e601全自动免疫分析仪',
    unitCode: 'Cobase601-01',
    isConfigured: false,
    creator: '刘洋',
    updatedAt: '2026-10-21 09:00',
    templates: [],
    restrictions: []
  },
  {
    id: 'RPT-UNIT-08',
    seqNo: 8,
    subGroup: '临检组',
    unitName: '沃文特FA160全自动粪便分析仪',
    unitCode: 'FA160-01',
    isConfigured: false,
    creator: '赵海琴',
    updatedAt: '2026-10-20 17:30',
    templates: [],
    restrictions: []
  },
  {
    id: 'RPT-UNIT-09',
    seqNo: 9,
    subGroup: '临检组',
    unitName: '迪瑞H500全自动尿液分析仪',
    unitCode: 'H500-01',
    isConfigured: true,
    creator: '徐晓丽',
    updatedAt: '2026-10-28 16:20',
    templates: [
      {
        id: 'TPL-06',
        templateFile: 'LSM_Urine_Sediment.cpt',
        templateName: '尿液干化学与沉渣联合分析报告单',
        templateDesc: '包含干化学11项与高倍镜下沉渣有形成分图表',
        isDefault: true,
        paperSize: 'A4 竖向',
        designer: '徐晓丽',
        updatedAt: '2026-10-28 16:20'
      }
    ],
    restrictions: [
      { id: 'RES-07', applyCode: '05010', applyName: '尿液干化学+沉渣显微镜检', specimenType: '尿液', deptName: '全院通用' }
    ]
  },
  {
    id: 'RPT-UNIT-10',
    seqNo: 10,
    subGroup: '微生物组',
    unitName: '梅里埃VITEK2-C全自动细菌鉴定仪',
    unitCode: 'VITEK2-01',
    isConfigured: true,
    creator: '赵海琴',
    updatedAt: '2026-10-29 14:00',
    templates: [
      {
        id: 'TPL-07',
        templateFile: 'LSM_Micro_AST.cpt',
        templateName: '微生物鉴定与药敏试验(MIC)专业报告单',
        templateDesc: '标注CLSI敏感/中介/耐药等级与院感多重耐药菌警告',
        isDefault: true,
        paperSize: 'A4 竖向',
        designer: '赵海琴',
        updatedAt: '2026-10-29 14:00'
      }
    ],
    restrictions: [
      { id: 'RES-08', applyCode: '06001', applyName: '血培养及药敏试验', specimenType: '血液', deptName: 'ICU/感染科' }
    ]
  },
  {
    id: 'RPT-UNIT-11',
    seqNo: 11,
    subGroup: '分子生物组',
    unitName: '宏石SLAN-96S全自动荧光定量PCR仪',
    unitCode: 'SLAN96S-01',
    isConfigured: true,
    creator: '陈志远',
    updatedAt: '2026-10-30 07:45',
    templates: [
      {
        id: 'TPL-08',
        templateFile: 'LSM_PCR_Quantitative.cpt',
        templateName: '分子核酸定量扩增检测报告单',
        templateDesc: '包含Ct值、扩增曲线缩略图与拷贝数对数转换',
        isDefault: true,
        paperSize: 'A4 竖向',
        designer: '陈志远',
        updatedAt: '2026-10-30 07:45'
      }
    ],
    restrictions: [
      { id: 'RES-09', applyCode: '07005', applyName: '乙型肝炎病毒DNA定量 (HBV-DNA)', specimenType: '血清', deptName: '肝病科/感染科' }
    ]
  },
  {
    id: 'RPT-UNIT-12',
    seqNo: 12,
    subGroup: '生化组',
    unitName: '伯乐Variant-II糖化血红蛋白分析仪',
    unitCode: 'VariantII-01',
    isConfigured: false,
    creator: '张珊',
    updatedAt: '2026-10-18 11:20',
    templates: [],
    restrictions: []
  }
];
