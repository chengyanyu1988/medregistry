export interface OutpatientSampleItem {
  barcode: string;
  patientId: string;
  name: string;
  gender: string;
  age: string;
  department: string;
  doctor: string;
  testItem: string;
  specimen: string;
  container: string;
  collectionMethod: string;
  feeStatus: '已收费' | '未收费';
  isEmergency: boolean;
  applyTime: string;
  status: '待采集' | '已采集' | '已送检' | '已签收';
  rejectReason?: string;
}

export const MOCK_PATIENT_INFO = {
  outpatientNo: '100000212',
  name: '张亮',
  gender: '男',
  age: '23岁',
  profession: '未知',
  phone: '131****0231',
};

export const DEFAULT_OUTPATIENT_START_DATE = '2026-10-26 00:00';
export const DEFAULT_OUTPATIENT_END_DATE = '2026-10-26 23:59';

export const MOCK_PENDING_SAMPLES: OutpatientSampleItem[] = [
  {
    barcode: '423423501',
    patientId: 'ZY2026102601',
    name: '张亮',
    gender: '男',
    age: '23岁',
    department: '儿科',
    doctor: '林晓梅',
    testItem: '血常规+CRP',
    specimen: '全血',
    container: '采血管',
    collectionMethod: '末梢采血',
    feeStatus: '已收费',
    isEmergency: true,
    applyTime: '2026-10-26 09:30:15',
    status: '待采集',
  },
  {
    barcode: '423423502',
    patientId: 'ZY2026102602',
    name: '赵敏',
    gender: '女',
    age: '29岁',
    department: '内分泌科',
    doctor: '王建国',
    testItem: '生化全套',
    specimen: '血清',
    container: '采血管',
    collectionMethod: '静脉采血',
    feeStatus: '已收费',
    isEmergency: false,
    applyTime: '2026-10-26 09:45:20',
    status: '待采集',
  },
  {
    barcode: '423423503',
    patientId: 'ZY2026102603',
    name: '孙志强',
    gender: '男',
    age: '48岁',
    department: '急诊科',
    doctor: '张伟',
    testItem: '凝血功能',
    specimen: '血浆',
    container: '采血管',
    collectionMethod: '静脉采血',
    feeStatus: '未收费',
    isEmergency: false,
    applyTime: '2026-10-26 10:05:42',
    status: '待采集',
  },
  {
    barcode: '423423504',
    patientId: 'ZY2026102604',
    name: '周晓雯',
    gender: '女',
    age: '35岁',
    department: '肾内科',
    doctor: '陈静',
    testItem: '尿常规',
    specimen: '尿液',
    container: '尿杯',
    collectionMethod: '中段尿留取',
    feeStatus: '已收费',
    isEmergency: false,
    applyTime: '2026-10-26 10:18:30',
    status: '待采集',
  },
];

export const MOCK_REJECTED_SAMPLES: OutpatientSampleItem[] = [
  {
    barcode: '423423422',
    patientId: 'ZY2026102605',
    name: '陈建国',
    gender: '男',
    age: '54岁',
    department: '呼吸内科',
    doctor: '刘伟',
    testItem: '血常规',
    specimen: '全血',
    container: '采血管',
    collectionMethod: '静脉采血',
    feeStatus: '已收费',
    isEmergency: false,
    applyTime: '2026-10-26 08:30:10',
    status: '已采集',
    rejectReason: '溶血标本，需重新采血',
  },
  {
    barcode: '423423423',
    patientId: 'ZY2026102606',
    name: '刘淑芬',
    gender: '女',
    age: '67岁',
    department: '感染科',
    doctor: '王博',
    testItem: '痰培养',
    specimen: '痰液',
    container: '无菌盒',
    collectionMethod: '患者自留',
    feeStatus: '已收费',
    isEmergency: false,
    applyTime: '2026-10-26 08:45:25',
    status: '已采集',
    rejectReason: '标本为唾液，不符合细菌培养要求',
  },
];

export const MOCK_UNPAID_SAMPLES: OutpatientSampleItem[] = [
  {
    barcode: '423423991',
    patientId: 'ZY2026102607',
    name: '吴伟国',
    gender: '男',
    age: '42岁',
    department: '消化内科',
    doctor: '郭靖',
    testItem: '血常规',
    specimen: '血液',
    container: '采血管',
    collectionMethod: '静脉采血',
    feeStatus: '未收费',
    isEmergency: false,
    applyTime: '2026-10-26 10:00:15',
    status: '待采集',
  },
  {
    barcode: '423423992',
    patientId: 'ZY2026102608',
    name: '郑秀英',
    gender: '女',
    age: '59岁',
    department: '呼吸内科',
    doctor: '黄蓉',
    testItem: '痰培养',
    specimen: '痰液',
    container: '无菌盒',
    collectionMethod: '患者自留',
    feeStatus: '未收费',
    isEmergency: false,
    applyTime: '2026-10-26 10:15:30',
    status: '待采集',
  },
];

export const MOCK_COLLECTED_SAMPLES: OutpatientSampleItem[] = [
  {
    barcode: '20261026001',
    patientId: 'ZY2026102611',
    name: '王建国',
    gender: '男',
    age: '45岁',
    department: '呼吸内科',
    doctor: '刘伟',
    testItem: '血常规+五分类',
    specimen: '全血',
    container: '紫头管',
    collectionMethod: '静脉采血',
    feeStatus: '已收费',
    isEmergency: true,
    applyTime: '2026-10-26 08:30:00',
    status: '已采集',
  },
  {
    barcode: '20261026056',
    patientId: 'ZY2026102612',
    name: '赵敏',
    gender: '女',
    age: '31岁',
    department: '内分泌科',
    doctor: '陈静',
    testItem: '肝肾功能全套',
    specimen: '血清',
    container: '黄头管',
    collectionMethod: '静脉采血',
    feeStatus: '已收费',
    isEmergency: false,
    applyTime: '2026-10-26 08:42:15',
    status: '已采集',
  },
  {
    barcode: '20261026022',
    patientId: 'ZY2026102613',
    name: '孙志强',
    gender: '男',
    age: '50岁',
    department: '泌尿外科',
    doctor: '吴刚',
    testItem: '尿常规分析',
    specimen: '尿液',
    container: '尿杯',
    collectionMethod: '患者自留',
    feeStatus: '已收费',
    isEmergency: false,
    applyTime: '2026-10-26 09:05:10',
    status: '已采集',
  },
  {
    barcode: '20261026088',
    patientId: 'ZY2026102614',
    name: '周梅',
    gender: '女',
    age: '38岁',
    department: '心内科',
    doctor: '郑华',
    testItem: '凝血四项',
    specimen: '血浆',
    container: '蓝头管',
    collectionMethod: '静脉采血',
    feeStatus: '已收费',
    isEmergency: false,
    applyTime: '2026-10-26 09:18:22',
    status: '已采集',
  },
  {
    barcode: '20261026015',
    patientId: 'ZY2026102615',
    name: '钱多多',
    gender: '女',
    age: '26岁',
    department: '急诊科',
    doctor: '冯强',
    testItem: '急诊生化',
    specimen: '全血',
    container: '绿头管',
    collectionMethod: '末梢采血',
    feeStatus: '已收费',
    isEmergency: false,
    applyTime: '2026-10-26 09:25:40',
    status: '已采集',
  },
];

export interface ManualCatalogItem {
  code: string;
  name: string;
  category: '生化' | '临检' | '免疫' | '微生物' | '输血' | '分子生物';
  specimen: string;
  container: string;
  tubeColor: 'purple' | 'orange' | 'green' | 'blue' | 'yellow' | 'red' | 'gray';
  price?: number;
}

export const MANUAL_CATALOG_ITEMS: ManualCatalogItem[] = [
  // 截图中的原版生化项目
  { code: '1212', name: '血常规', category: '生化', specimen: '全血', container: '紫头管(EDTA-K2)', tubeColor: 'purple', price: 20 },
  { code: '321', name: '尿常规', category: '生化', specimen: '尿液', container: '尿杯/尿管', tubeColor: 'yellow', price: 15 },
  { code: '312312', name: '电解质七项', category: '生化', specimen: '血清', container: '黄头管(促凝胶)', tubeColor: 'orange', price: 45 },
  { code: '12321', name: '血糖', category: '生化', specimen: '血浆', container: '灰头管(氟化钠)', tubeColor: 'gray', price: 10 },
  // 生化扩展
  { code: '10101', name: '肝功能十二项', category: '生化', specimen: '血清', container: '黄头管(促凝胶)', tubeColor: 'orange', price: 68 },
  { code: '10102', name: '肾功能四项', category: '生化', specimen: '血清', container: '黄头管(促凝胶)', tubeColor: 'orange', price: 35 },
  { code: '10103', name: '血脂四项', category: '生化', specimen: '血清', container: '黄头管(促凝胶)', tubeColor: 'orange', price: 40 },
  { code: '10104', name: '心肌酶谱五项', category: '生化', specimen: '血清', container: '绿头管(肝素锂)', tubeColor: 'green', price: 55 },
  { code: '10105', name: '淀粉酶+脂肪酶', category: '生化', specimen: '血清', container: '黄头管(促凝胶)', tubeColor: 'orange', price: 50 },
  // 临检
  { code: '1212', name: '血常规+五分类', category: '临检', specimen: '全血', container: '紫头管(EDTA-K2)', tubeColor: 'purple', price: 25 },
  { code: '321', name: '尿有形成分分析', category: '临检', specimen: '尿液', container: '专用尿管', tubeColor: 'yellow', price: 28 },
  { code: '20201', name: '凝血四项 (PT/APTT/TT/FIB)', category: '临检', specimen: '血浆', container: '蓝头管(枸橼酸钠)', tubeColor: 'blue', price: 65 },
  { code: '20202', name: 'D-二聚体定量', category: '临检', specimen: '血浆', container: '蓝头管(枸橼酸钠)', tubeColor: 'blue', price: 80 },
  { code: '20203', name: '红细胞沉降率 (ESR血沉)', category: '临检', specimen: '全血', container: '黑头管(枸橼酸钠)', tubeColor: 'purple', price: 20 },
  { code: '20204', name: '便常规+潜血试验', category: '临检', specimen: '粪便', container: '无菌便盒', tubeColor: 'yellow', price: 18 },
  // 免疫
  { code: '30301', name: '乙肝五项定量', category: '免疫', specimen: '血清', container: '黄头管(促凝胶)', tubeColor: 'orange', price: 90 },
  { code: '30302', name: '甲状腺功能三项 (FT3/FT4/TSH)', category: '免疫', specimen: '血清', container: '黄头管(促凝胶)', tubeColor: 'orange', price: 105 },
  { code: '30303', name: '传染病四项 (乙肝/丙肝/梅毒/HIV)', category: '免疫', specimen: '血清', container: '红头管(普通干燥管)', tubeColor: 'red', price: 110 },
  { code: '30304', name: '高敏肌钙蛋白I (hs-cTnI)', category: '免疫', specimen: '血清', container: '绿头管(肝素)', tubeColor: 'green', price: 95 },
  { code: '30305', name: '降钙素原 (PCT)', category: '免疫', specimen: '血清', container: '黄头管(促凝胶)', tubeColor: 'orange', price: 120 },
  // 微生物
  { code: '40401', name: '血培养及药敏试验 (双侧双套)', category: '微生物', specimen: '全血', container: '血培养瓶(需氧+厌氧)', tubeColor: 'gray', price: 160 },
  { code: '40402', name: '痰培养及药敏', category: '微生物', specimen: '痰液', container: '无菌痰盒', tubeColor: 'yellow', price: 90 },
  { code: '40403', name: '清洁中段尿培养', category: '微生物', specimen: '尿液', container: '无菌尿杯', tubeColor: 'yellow', price: 75 },
];

