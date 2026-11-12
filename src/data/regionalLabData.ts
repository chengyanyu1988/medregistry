/**
 * 区域检验平台 - 真实医疗业务数据与医联体配置
 * 包含：区域检验对照映射、送检申请台账、外送签收冷链批次、区域报告中心数据
 */

export interface RegionalPartner {
  id: string;
  name: string;
  shortName: string;
  code: string;
  level: string; // 一级/社区/二级/专科
  contact: string;
  phone: string;
  address: string;
  mappingCount: number;
  totalItems: number;
  status: 'active' | 'suspended';
}

export interface RegionalMappingItem {
  id: string;
  partnerId: string;
  partnerName: string;
  partnerItemCode: string;
  partnerItemName: string;
  partnerItemEn: string;
  specimenType: string;
  partnerRefRange: string;
  partnerUnit: string;
  // 中心标准对照信息
  centerItemCode: string;
  centerItemName: string;
  centerItemEn: string;
  centerUnit: string;
  centerRefRange: string;
  coefficient: number; // 转换系数
  mutualRecogLevel: '全国互认' | '省内互认' | '区域互认' | '院内独立';
  status: 'matched' | 'unmatched' | 'review_required';
  reviewer: string;
  updateTime: string;
}

export interface RegionalSpecimenMappingItem {
  id: string;
  partnerId: string;
  partnerName: string;
  partnerSpecimenCode: string;
  partnerSpecimenName: string;
  centerSpecimenCode: string;
  centerSpecimenName: string;
  tubeType: string;
  tubeColor: string;
  transportCondition: string;
  status: 'matched' | 'unmatched';
  reviewer: string;
  updateTime: string;
}

export interface CentralStandardItem {
  code: string;
  name: string;
  specimenType: string;
  unit: string;
  refRange: string;
  dept: string;
}

export interface CentralStandardSpecimen {
  code: string;
  name: string;
  tubeType: string;
  tubeColor: string;
  temp: string;
}

export interface ReceivingHospital {
  id: string;
  name: string;
  code: string;
  level: string;
}

export interface ReferralSpecimenItem {
  id: string;
  patientName: string;
  patientCategory: '住院' | '门诊' | '体检' | '慢病签约';
  medicalRecordNo: string;
  barcode: string;
  specimenType: string;
  applyItemName: string;
  applyDept: string;
  applyDoctor: string;
  status: '已送检' | '已接收' | '已拒收';
  rejectionReason?: string;
}

export interface ReferralDeliveryOrder {
  id: string;
  orderNo: string;
  applyHospital: string;
  applyHospitalCode: string;
  deliverTime: string;
  receiveHospital: string;
  deliverer: string;
  status: '已送检' | '已接收' | '已撤销' | '已拒收';
  specimens: ReferralSpecimenItem[];
  coolerTemp?: string;
  remark?: string;
}

export interface ReferralApplication {
  id: string;
  applyNo: string;
  barcode: string;
  patientName: string;
  gender: '男' | '女';
  age: string;
  idCard: string;
  patientType: '门诊' | '住院' | '体检' | '家庭病床' | '慢病签约';
  medicalRecordNo: string;
  partnerId: string;
  partnerName: string;
  applyDept: string;
  applyDoctor: string;
  testItems: string[];
  specimenType: string;
  tubeType: string;
  sampleTime: string;
  temperatureRequirement: '冷藏(2-8℃)' | '常温(15-25℃)' | '冷冻(-20℃)';
  status: 'draft' | 'dispatched' | 'in_transit' | 'received' | 'testing' | 'reported';
  batchNo?: string;
  clinicalDiagnosis: string;
  remark?: string;
}

export interface ReferralReceivalItem {
  id: string;
  barcode: string;
  patientName: string;
  gender: '男' | '女';
  age: string;
  partnerName: string;
  testCategory: string;
  testItems: string[];
  specimenType: string;
  appearance: '合格清亮' | '轻度溶血' | '重度溶血' | '乳糜血' | '标本凝块' | '标本量少';
  receiveStatus: 'received' | 'pending' | 'rejected';
  rejectionReason?: string;
  targetDevice: string;
  receiver: string;
  receiveTime: string;
  temperature: number;
}

export interface TransportBatch {
  batchNo: string;
  partnerName: string;
  courierName: string;
  courierPhone: string;
  coolerBoxNo: string;
  departTime: string;
  arriveTime: string;
  coolerTemp: number; // 摄氏度
  tempStatus: 'normal' | 'warning' | 'error';
  totalCount: number;
  receivedCount: number;
  rejectedCount: number;
  status: 'in_transit' | 'arrived' | 'completed';
}

export interface RegionalReportDetailItem {
  itemCode: string;
  itemName: string;
  itemEn: string;
  result: string;
  flag: 'normal' | 'high' | 'low' | 'crisis';
  refRange: string;
  unit: string;
  method: string;
}

export interface RegionalReport {
  id: string;
  reportNo: string;
  barcode: string;
  partnerName: string;
  patientName: string;
  gender: '男' | '女';
  age: string;
  patientType: string;
  deptName: string;
  doctorName: string;
  clinicalDiagnosis: string;
  testCategory: string;
  specimenType: string;
  sampleTime: string;
  receiveTime: string;
  testTime: string;
  auditTime: string;
  tester: string;
  auditor: string;
  status: 'audited' | 'issued' | 'synced_his' | 'crisis';
  mutualRecogTag: '全国互认' | '省内互认' | '区域互认' | '优先复核';
  items: RegionalReportDetailItem[];
  comment?: string;
}

// 1. 医联体合作机构基础库
export const REGIONAL_PARTNERS: RegionalPartner[] = [
  {
    id: 'P01',
    name: '城东社区卫生服务中心',
    shortName: '城东社卫',
    code: 'CD-CHSC-01',
    level: '社区一级甲等',
    contact: '陈建国',
    phone: '0571-86012345',
    address: '新塘路 188 号',
    mappingCount: 156,
    totalItems: 162,
    status: 'active',
  },
  {
    id: 'P02',
    name: '滨江街道社区卫生服务中心',
    shortName: '滨江社卫',
    code: 'BJ-CHSC-02',
    level: '社区一级甲等',
    contact: '许敏',
    phone: '0571-87723456',
    address: '江南大道 860 号',
    mappingCount: 148,
    totalItems: 150,
    status: 'active',
  },
  {
    id: 'P03',
    name: '科技城社区卫生服务中心',
    shortName: '科技城社卫',
    code: 'KJC-CHSC-03',
    level: '社区一级乙等',
    contact: '钱海峰',
    phone: '0571-88997654',
    address: '文一西路 1200 号',
    mappingCount: 135,
    totalItems: 142,
    status: 'active',
  },
  {
    id: 'P04',
    name: '康复第二分院 (医联体成员院)',
    shortName: '康复二分院',
    code: 'KF-HOSP-04',
    level: '二级专科医院',
    contact: '赵文博',
    phone: '0571-85114321',
    address: '莫干山路 960 号',
    mappingCount: 220,
    totalItems: 228,
    status: 'active',
  },
  {
    id: 'P05',
    name: '高新园区门诊部',
    shortName: '高新门诊',
    code: 'GX-CLINIC-05',
    level: '综合门诊部',
    contact: '周丽丽',
    phone: '0571-87654320',
    address: '科技大道 68 号',
    mappingCount: 92,
    totalItems: 95,
    status: 'active',
  },
];

// 1.1 接收医院 (区域中心实验室列表)
export const RECEIVING_HOSPITALS: ReceivingHospital[] = [
  { id: 'REC-01', name: '市中心医院检验中心 (区域总院)', code: 'ZXYY-LAB-01', level: '三级甲等综合' },
  { id: 'REC-02', name: '省人民医院医联体中心实验室', code: 'SRMYY-LAB-02', level: '三级甲等综合' },
  { id: 'REC-03', name: '第一人民医院检验医学中心', code: 'DYRMYY-LAB-03', level: '三级甲等综合' },
];

// 1.2 接收医院中心标准检验项目库 (供下拉框选择与匹配)
export const CENTRAL_STANDARD_ITEMS: CentralStandardItem[] = [
  { code: '10033', name: '血常规', specimenType: 'EDTA抗凝全血', unit: '项', refRange: '五分类综合分析', dept: '临检组' },
  { code: '10001', name: '肝功能全套8项', specimenType: '血清', unit: '项', refRange: 'ALT/AST/TBIL等', dept: '生化组' },
  { code: '10002', name: '肾功能4项', specimenType: '血清', unit: '项', refRange: 'BUN/Cr/UA/CysC', dept: '生化组' },
  { code: '10010', name: '糖化血红蛋白(HPLC色谱法)', specimenType: 'EDTA抗凝全血', unit: '%', refRange: '4.0 - 6.0', dept: '生化组' },
  { code: '10020', name: '血脂四项', specimenType: '血清', unit: '项', refRange: 'TC/TG/HDL-C/LDL-C', dept: '生化组' },
  { code: '10035', name: '尿液分析及有形成分分析', specimenType: '尿液', unit: '项', refRange: '干化学+沉渣全自动镜检', dept: '临检组' },
  { code: '10042', name: '甲状腺激素五项定量', specimenType: '血清', unit: '项', refRange: 'FT3/FT4/TSH/TPOAb/TGAb', dept: '免疫组' },
  { code: '10055', name: '肿瘤标志物三联(AFP/CEA/CA199)', specimenType: '血清', unit: '项', refRange: '化学发光微粒子定量', dept: '免疫组' },
  { code: '10060', name: '凝血功能四项', specimenType: '枸橼酸钠抗凝血浆', unit: '项', refRange: 'PT/APTT/TT/Fib', dept: '临检组' },
  { code: '10072', name: '降钙素原(PCT)定量', specimenType: '血清', unit: 'ng/mL', refRange: '< 0.05', dept: '免疫组' },
  { code: '10075', name: '超敏C反应蛋白(hs-CRP)', specimenType: '全血', unit: 'mg/L', refRange: '0.00 - 3.00', dept: '临检组' },
  { code: '10080', name: '乙肝两对半化学发光定量', specimenType: '血清', unit: '项', refRange: 'HBsAg/HBsAb等五项', dept: '免疫组' },
  { code: '10015', name: '电解质六项分析', specimenType: '血清', unit: '项', refRange: 'K/Na/Cl/Ca/Mg/P', dept: '生化组' },
  { code: '10025', name: '心肌酶谱五项', specimenType: '血清', unit: '项', refRange: 'CK/CK-MB/LDH/AST/HBDH', dept: '生化组' },
  { code: '10028', name: '高敏肌钙蛋白I定量(hs-cTnI)', specimenType: '血清', unit: 'pg/mL', refRange: '< 15.6', dept: '免疫组' },
  { code: '10090', name: '同型半胱氨酸测定(HCY)', specimenType: '血浆', unit: 'μmol/L', refRange: '5.0 - 15.0', dept: '生化组' },
  { code: '10095', name: '血型微柱凝胶法(ABO+RhD)', specimenType: 'EDTA抗凝全血', unit: '型', refRange: '正反定型一致', dept: '输血组' },
];

// 1.3 接收医院中心标准标本类型库
export const CENTRAL_STANDARD_SPECIMENS: CentralStandardSpecimen[] = [
  { code: 'SPEC_01', name: '促凝血清', tubeType: '促凝分离胶采血管', tubeColor: '黄头', temp: '2 - 8℃ 冷藏' },
  { code: 'SPEC_02', name: 'EDTA抗凝全血', tubeType: 'EDTA-K2采血管', tubeColor: '紫头', temp: '15 - 25℃ 常温' },
  { code: 'SPEC_03', name: '枸橼酸钠抗凝血浆', tubeType: '1:9 枸橼酸钠抗凝管', tubeColor: '蓝头', temp: '15 - 25℃ 常温' },
  { code: 'SPEC_04', name: '肝素锂抗凝血浆', tubeType: '肝素锂采血管', tubeColor: '绿头', temp: '2 - 8℃ 冷藏' },
  { code: 'SPEC_05', name: '清洁中段尿', tubeType: '一次性无菌红盖尿杯', tubeColor: '无色红盖', temp: '2 - 8℃ 冷藏' },
  { code: 'SPEC_06', name: '24小时防腐混合尿', tubeType: '专用加防腐剂集尿桶', tubeColor: '白色塑料', temp: '2 - 8℃ 避光' },
  { code: 'SPEC_07', name: '粪便标本', tubeType: '专用采样勺无菌便盒', tubeColor: '透明蓝盖', temp: '15 - 25℃ 常温' },
  { code: 'SPEC_08', name: '咽拭子咽喉分泌物', tubeType: '无菌病毒采样管(含运送液)', tubeColor: '粉红液体', temp: '2 - 8℃ 冷藏' },
  { code: 'SPEC_09', name: '深部咳出晨痰', tubeType: '无菌广口痰盒', tubeColor: '无色白盖', temp: '2 - 8℃ 冷藏' },
  { code: 'SPEC_10', name: '脑脊液', tubeType: '无菌离心管(第2管)', tubeColor: '透明尖底', temp: '立即送检常温' },
  { code: 'SPEC_11', name: '胸腔/腹腔积液', tubeType: '无菌抗凝管', tubeColor: '无色', temp: '2 - 8℃ 冷藏' },
  { code: 'SPEC_12', name: '骨髓穿刺涂片/抽取物', tubeType: '肝素抗凝管+推片盒', tubeColor: '专用盒', temp: '常温避光' },
];

// 2. 区域检验对照映射字典表 (申请项目对照)
export const INITIAL_REGIONAL_MAPPINGS: RegionalMappingItem[] = [
  // 截图原型第一行：0021 血常规 -> 血常规 10033
  {
    id: 'MAP-000',
    partnerId: 'P01',
    partnerName: '城东社区卫生服务中心',
    partnerItemCode: '0021',
    partnerItemName: '血常规',
    partnerItemEn: 'CBC',
    specimenType: 'EDTA抗凝全血',
    partnerRefRange: '五分类参考区间',
    partnerUnit: '项',
    centerItemCode: '10033',
    centerItemName: '血常规',
    centerItemEn: 'CBC+Diff',
    centerUnit: '项',
    centerRefRange: '五分类参考区间',
    coefficient: 1.0,
    mutualRecogLevel: '全国互认',
    status: 'matched',
    reviewer: '张珊',
    updateTime: '2026-10-28 09:15',
  },
  {
    id: 'MAP-001',
    partnerId: 'P01',
    partnerName: '城东社区卫生服务中心',
    partnerItemCode: '0022',
    partnerItemName: '肝功8项',
    partnerItemEn: 'LFT-8',
    specimenType: '血清',
    partnerRefRange: 'ALT/AST/TBIL等',
    partnerUnit: '项',
    centerItemCode: '10001',
    centerItemName: '肝功能全套8项',
    centerItemEn: 'LFT',
    centerUnit: '项',
    centerRefRange: 'ALT:9-50 U/L',
    coefficient: 1.0,
    mutualRecogLevel: '全国互认',
    status: 'matched',
    reviewer: '张珊',
    updateTime: '2026-10-28 09:18',
  },
  {
    id: 'MAP-002',
    partnerId: 'P01',
    partnerName: '城东社区卫生服务中心',
    partnerItemCode: '0023',
    partnerItemName: '肾功能4项',
    partnerItemEn: 'RFT-4',
    specimenType: '血清',
    partnerRefRange: 'Cr/BUN/UA/CysC',
    partnerUnit: '项',
    centerItemCode: '10002',
    centerItemName: '肾功能4项',
    centerItemEn: 'RFT',
    centerUnit: '项',
    centerRefRange: 'Cr:41-97 μmol/L',
    coefficient: 1.0,
    mutualRecogLevel: '全国互认',
    status: 'matched',
    reviewer: '李静',
    updateTime: '2026-10-28 09:20',
  },
  {
    id: 'MAP-003',
    partnerId: 'P01',
    partnerName: '城东社区卫生服务中心',
    partnerItemCode: '0024',
    partnerItemName: '糖化血红蛋白',
    partnerItemEn: 'HbA1c',
    specimenType: 'EDTA抗凝全血',
    partnerRefRange: '4.0 - 6.0',
    partnerUnit: '%',
    centerItemCode: '10010',
    centerItemName: '糖化血红蛋白(HPLC色谱法)',
    centerItemEn: 'HbA1c',
    centerUnit: '%',
    centerRefRange: '4.0 - 6.0',
    coefficient: 1.0,
    mutualRecogLevel: '全国互认',
    status: 'matched',
    reviewer: '李静',
    updateTime: '2026-10-28 09:25',
  },
  {
    id: 'MAP-004',
    partnerId: 'P01',
    partnerName: '城东社区卫生服务中心',
    partnerItemCode: '0025',
    partnerItemName: '血脂四项',
    partnerItemEn: 'LIPID',
    specimenType: '血清',
    partnerRefRange: 'TC/TG/HDL/LDL',
    partnerUnit: '项',
    centerItemCode: '10020',
    centerItemName: '血脂四项',
    centerItemEn: 'LIPID-4',
    centerUnit: '项',
    centerRefRange: 'TC:2.8-5.2 mmol/L',
    coefficient: 1.0,
    mutualRecogLevel: '省内互认',
    status: 'matched',
    reviewer: '张珊',
    updateTime: '2026-10-28 09:30',
  },
  {
    id: 'MAP-005',
    partnerId: 'P01',
    partnerName: '城东社区卫生服务中心',
    partnerItemCode: '0026',
    partnerItemName: '尿常规+沉渣镜检',
    partnerItemEn: 'URINE-SED',
    specimenType: '尿液',
    partnerRefRange: '红白细胞未见异常',
    partnerUnit: '项',
    centerItemCode: '10035',
    centerItemName: '尿液分析及有形成分分析',
    centerItemEn: 'U-ANALYSIS',
    centerUnit: '项',
    centerRefRange: '干化学+沉渣全自动镜检',
    coefficient: 1.0,
    mutualRecogLevel: '省内互认',
    status: 'matched',
    reviewer: '刘全',
    updateTime: '2026-10-28 10:10',
  },
  {
    id: 'MAP-006',
    partnerId: 'P01',
    partnerName: '城东社区卫生服务中心',
    partnerItemCode: '0027',
    partnerItemName: '甲状腺五项',
    partnerItemEn: 'THYROID-5',
    specimenType: '血清',
    partnerRefRange: 'FT3/FT4/TSH/TPO/TG',
    partnerUnit: '项',
    centerItemCode: '10042',
    centerItemName: '甲状腺激素五项定量',
    centerItemEn: 'THY-5',
    centerUnit: '项',
    centerRefRange: 'TSH:0.27-4.20 mIU/L',
    coefficient: 1.0,
    mutualRecogLevel: '全国互认',
    status: 'matched',
    reviewer: '赵秀琴',
    updateTime: '2026-10-28 10:20',
  },
  {
    id: 'MAP-007',
    partnerId: 'P01',
    partnerName: '城东社区卫生服务中心',
    partnerItemCode: '0028',
    partnerItemName: '肿瘤标志物三项',
    partnerItemEn: 'TM-3',
    specimenType: '血清',
    partnerRefRange: 'AFP/CEA/CA199',
    partnerUnit: '项',
    centerItemCode: '10055',
    centerItemName: '肿瘤标志物三联(AFP/CEA/CA199)',
    centerItemEn: 'TM-3',
    centerUnit: '项',
    centerRefRange: '化学发光微粒子定量',
    coefficient: 1.0,
    mutualRecogLevel: '区域互认',
    status: 'matched',
    reviewer: '王明华',
    updateTime: '2026-10-28 10:35',
  },
  {
    id: 'MAP-008',
    partnerId: 'P01',
    partnerName: '城东社区卫生服务中心',
    partnerItemCode: '0029',
    partnerItemName: '凝血四项',
    partnerItemEn: 'COAG-4',
    specimenType: '枸橼酸钠抗凝血浆',
    partnerRefRange: 'PT/APTT/TT/FIB',
    partnerUnit: '项',
    centerItemCode: '10060',
    centerItemName: '凝血功能四项',
    centerItemEn: 'COAG-4',
    centerUnit: '项',
    centerRefRange: 'PT:11-14s APTT:28-42s',
    coefficient: 1.0,
    mutualRecogLevel: '全国互认',
    status: 'matched',
    reviewer: '张珊',
    updateTime: '2026-10-28 11:00',
  },
  {
    id: 'MAP-009',
    partnerId: 'P01',
    partnerName: '城东社区卫生服务中心',
    partnerItemCode: '0030',
    partnerItemName: '全血超敏C反应蛋白',
    partnerItemEn: 'hs-CRP',
    specimenType: '全血',
    partnerRefRange: '< 3.0',
    partnerUnit: 'mg/L',
    centerItemCode: '10075',
    centerItemName: '超敏C反应蛋白(hs-CRP)',
    centerItemEn: 'hs-CRP',
    centerUnit: 'mg/L',
    centerRefRange: '0.00 - 3.00',
    coefficient: 1.0,
    mutualRecogLevel: '全国互认',
    status: 'matched',
    reviewer: '李静',
    updateTime: '2026-10-28 11:15',
  },
  {
    id: 'MAP-010',
    partnerId: 'P01',
    partnerName: '城东社区卫生服务中心',
    partnerItemCode: '0031',
    partnerItemName: '降钙素原(PCT)微量',
    partnerItemEn: 'PCT',
    specimenType: '血清',
    partnerRefRange: '< 0.05',
    partnerUnit: 'ng/mL',
    centerItemCode: '10072',
    centerItemName: '降钙素原(PCT)定量',
    centerItemEn: 'PCT',
    centerUnit: 'ng/mL',
    centerRefRange: '< 0.05',
    coefficient: 1.0,
    mutualRecogLevel: '省内互认',
    status: 'matched',
    reviewer: '张珊',
    updateTime: '2026-10-28 11:30',
  },
  {
    id: 'MAP-011',
    partnerId: 'P01',
    partnerName: '城东社区卫生服务中心',
    partnerItemCode: '0032',
    partnerItemName: '同型半胱氨酸',
    partnerItemEn: 'HCY',
    specimenType: '血浆',
    partnerRefRange: '5 - 15',
    partnerUnit: 'μmol/L',
    centerItemCode: '10090',
    centerItemName: '同型半胱氨酸测定(HCY)',
    centerItemEn: 'HCY',
    centerUnit: 'μmol/L',
    centerRefRange: '5.0 - 15.0',
    coefficient: 1.0,
    mutualRecogLevel: '全国互认',
    status: 'matched',
    reviewer: '李静',
    updateTime: '2026-10-28 11:45',
  },
  {
    id: 'MAP-012',
    partnerId: 'P01',
    partnerName: '城东社区卫生服务中心',
    partnerItemCode: '0033',
    partnerItemName: '心肌钙蛋白I快检',
    partnerItemEn: 'cTnI',
    specimenType: '血清',
    partnerRefRange: '< 0.04',
    partnerUnit: 'ng/mL',
    centerItemCode: '',
    centerItemName: '待对照中心项目',
    centerItemEn: '',
    centerUnit: '',
    centerRefRange: '',
    coefficient: 1.0,
    mutualRecogLevel: '院内独立',
    status: 'unmatched',
    reviewer: '未审核',
    updateTime: '2026-10-28 12:00',
  },
  {
    id: 'MAP-013',
    partnerId: 'P01',
    partnerName: '城东社区卫生服务中心',
    partnerItemCode: '0034',
    partnerItemName: '幽门螺杆菌抗体分型',
    partnerItemEn: 'Hp-Ab',
    specimenType: '血清',
    partnerRefRange: '阴性',
    partnerUnit: '定性',
    centerItemCode: '',
    centerItemName: '待对照中心项目',
    centerItemEn: '',
    centerUnit: '',
    centerRefRange: '',
    coefficient: 1.0,
    mutualRecogLevel: '院内独立',
    status: 'unmatched',
    reviewer: '未审核',
    updateTime: '2026-10-28 12:00',
  },
];

// 2.2 标本类型对照字典表 (点击左侧“标本类型”时切换到此数据)
export const INITIAL_SPECIMEN_MAPPINGS: RegionalSpecimenMappingItem[] = [
  {
    id: 'SPEC-MAP-01',
    partnerId: 'P01',
    partnerName: '城东社区卫生服务中心',
    partnerSpecimenCode: '01',
    partnerSpecimenName: '静脉血(血清)',
    centerSpecimenCode: 'SPEC_01',
    centerSpecimenName: '促凝血清',
    tubeType: '黄头促凝分离胶管',
    tubeColor: '黄头',
    transportCondition: '2 - 8℃ 冷藏',
    status: 'matched',
    reviewer: '张珊',
    updateTime: '2026-10-28 09:10',
  },
  {
    id: 'SPEC-MAP-02',
    partnerId: 'P01',
    partnerName: '城东社区卫生服务中心',
    partnerSpecimenCode: '02',
    partnerSpecimenName: 'EDTA抗凝血',
    centerSpecimenCode: 'SPEC_02',
    centerSpecimenName: 'EDTA抗凝全血',
    tubeType: '紫头EDTA-K2采血管',
    tubeColor: '紫头',
    transportCondition: '15 - 25℃ 常温',
    status: 'matched',
    reviewer: '张珊',
    updateTime: '2026-10-28 09:10',
  },
  {
    id: 'SPEC-MAP-03',
    partnerId: 'P01',
    partnerName: '城东社区卫生服务中心',
    partnerSpecimenCode: '03',
    partnerSpecimenName: '枸橼酸钠抗凝血',
    centerSpecimenCode: 'SPEC_03',
    centerSpecimenName: '枸橼酸钠抗凝血浆',
    tubeType: '1:9 枸橼酸钠抗凝管',
    tubeColor: '蓝头',
    transportCondition: '15 - 25℃ 常温',
    status: 'matched',
    reviewer: '李静',
    updateTime: '2026-10-28 09:12',
  },
  {
    id: 'SPEC-MAP-04',
    partnerId: 'P01',
    partnerName: '城东社区卫生服务中心',
    partnerSpecimenCode: '04',
    partnerSpecimenName: '肝素抗凝血',
    centerSpecimenCode: 'SPEC_04',
    centerSpecimenName: '肝素锂抗凝血浆',
    tubeType: '绿头肝素锂管',
    tubeColor: '绿头',
    transportCondition: '2 - 8℃ 冷藏',
    status: 'matched',
    reviewer: '张珊',
    updateTime: '2026-10-28 09:15',
  },
  {
    id: 'SPEC-MAP-05',
    partnerId: 'P01',
    partnerName: '城东社区卫生服务中心',
    partnerSpecimenCode: '05',
    partnerSpecimenName: '中段尿',
    centerSpecimenCode: 'SPEC_05',
    centerSpecimenName: '清洁中段尿',
    tubeType: '一次性无菌红盖尿杯',
    tubeColor: '红盖',
    transportCondition: '2 - 8℃ 冷藏',
    status: 'matched',
    reviewer: '刘全',
    updateTime: '2026-10-28 09:20',
  },
  {
    id: 'SPEC-MAP-06',
    partnerId: 'P01',
    partnerName: '城东社区卫生服务中心',
    partnerSpecimenCode: '06',
    partnerSpecimenName: '24小时尿',
    centerSpecimenCode: 'SPEC_06',
    centerSpecimenName: '24小时防腐混合尿',
    tubeType: '专用集尿桶(含防腐剂)',
    tubeColor: '白盖',
    transportCondition: '2 - 8℃ 避光',
    status: 'matched',
    reviewer: '刘全',
    updateTime: '2026-10-28 09:25',
  },
  {
    id: 'SPEC-MAP-07',
    partnerId: 'P01',
    partnerName: '城东社区卫生服务中心',
    partnerSpecimenCode: '07',
    partnerSpecimenName: '便标本',
    centerSpecimenCode: 'SPEC_07',
    centerSpecimenName: '粪便标本',
    tubeType: '专用无菌带勺便盒',
    tubeColor: '蓝盖',
    transportCondition: '15 - 25℃ 常温',
    status: 'matched',
    reviewer: '李静',
    updateTime: '2026-10-28 09:30',
  },
  {
    id: 'SPEC-MAP-08',
    partnerId: 'P01',
    partnerName: '城东社区卫生服务中心',
    partnerSpecimenCode: '08',
    partnerSpecimenName: '咽拭子',
    centerSpecimenCode: 'SPEC_08',
    centerSpecimenName: '咽拭子咽喉分泌物',
    tubeType: '无菌病毒采样管',
    tubeColor: '粉红',
    transportCondition: '2 - 8℃ 冷藏',
    status: 'matched',
    reviewer: '赵秀琴',
    updateTime: '2026-10-28 09:35',
  },
  {
    id: 'SPEC-MAP-09',
    partnerId: 'P01',
    partnerName: '城东社区卫生服务中心',
    partnerSpecimenCode: '09',
    partnerSpecimenName: '晨痰标本',
    centerSpecimenCode: 'SPEC_09',
    centerSpecimenName: '深部咳出晨痰',
    tubeType: '无菌广口痰盒',
    tubeColor: '白盖',
    transportCondition: '2 - 8℃ 冷藏',
    status: 'matched',
    reviewer: '赵秀琴',
    updateTime: '2026-10-28 09:40',
  },
  {
    id: 'SPEC-MAP-10',
    partnerId: 'P01',
    partnerName: '城东社区卫生服务中心',
    partnerSpecimenCode: '10',
    partnerSpecimenName: '脑脊液',
    centerSpecimenCode: 'SPEC_10',
    centerSpecimenName: '脑脊液',
    tubeType: '无菌尖底离心管',
    tubeColor: '透明',
    transportCondition: '立即常温送检',
    status: 'matched',
    reviewer: '张珊',
    updateTime: '2026-10-28 09:45',
  },
  {
    id: 'SPEC-MAP-11',
    partnerId: 'P01',
    partnerName: '城东社区卫生服务中心',
    partnerSpecimenCode: '11',
    partnerSpecimenName: '胸腹水穿刺液',
    centerSpecimenCode: '',
    centerSpecimenName: '待对照中心标本类型',
    tubeType: '未指定',
    tubeColor: '未指定',
    transportCondition: '2 - 8℃ 冷藏',
    status: 'unmatched',
    reviewer: '未审核',
    updateTime: '2026-10-28 10:00',
  },
];

// 3. 送检申请平台业务数据
export const INITIAL_REFERRAL_APPLICATIONS: ReferralApplication[] = [
  {
    id: 'REQ-20261026-001',
    applyNo: 'REQ-20261026-001',
    barcode: 'BC26102601',
    patientName: '王建平',
    gender: '男',
    age: '54岁',
    idCard: '33010419720315****',
    patientType: '门诊',
    medicalRecordNo: 'CD20268801',
    partnerId: 'P01',
    partnerName: '城东社区卫生服务中心',
    applyDept: '全科医疗科',
    applyDoctor: '刘全医生',
    testItems: ['肝功能全套8项', '肾功能4项', '血脂四项'],
    specimenType: '血清',
    tubeType: '黄头促凝促凝胶管',
    sampleTime: '2026-10-26 08:35',
    temperatureRequirement: '冷藏(2-8℃)',
    status: 'received',
    batchNo: 'BAT-20261026-01',
    clinicalDiagnosis: '高血压2级、脂肪肝随访复查',
    remark: '标本已加贴医联体统一双条码',
  },
  {
    id: 'REQ-20261026-002',
    applyNo: 'REQ-20261026-002',
    barcode: 'BC26102602',
    patientName: '陈秀英',
    gender: '女',
    age: '68岁',
    idCard: '33010219580822****',
    patientType: '慢病签约',
    medicalRecordNo: 'CD20268809',
    partnerId: 'P01',
    partnerName: '城东社区卫生服务中心',
    applyDept: '慢病管理门诊',
    applyDoctor: '刘全医生',
    testItems: ['糖化血红蛋白(HbA1c)', '尿微量白蛋白/肌酐比值(ACR)'],
    specimenType: '全血/尿液',
    tubeType: '紫头EDTA管+无菌尿杯',
    sampleTime: '2026-10-26 08:45',
    temperatureRequirement: '冷藏(2-8℃)',
    status: 'received',
    batchNo: 'BAT-20261026-01',
    clinicalDiagnosis: '2型糖尿病并发早期肾病筛查',
    remark: '优先处理，患者下午家医门诊复诊',
  },
  {
    id: 'REQ-20261026-003',
    applyNo: 'REQ-20261026-003',
    barcode: 'BC26102603',
    patientName: '徐晓峰',
    gender: '男',
    age: '42岁',
    idCard: '33010619840510****',
    patientType: '门诊',
    medicalRecordNo: 'BJ20269102',
    partnerId: 'P02',
    partnerName: '滨江街道社区卫生服务中心',
    applyDept: '内科门诊',
    applyDoctor: '黄淑珍医生',
    testItems: ['甲状腺功能五项(FT3, FT4, TSH, TGAb, TPOAb)'],
    specimenType: '血清',
    tubeType: '黄头分离胶管',
    sampleTime: '2026-10-26 09:10',
    temperatureRequirement: '冷藏(2-8℃)',
    status: 'in_transit',
    batchNo: 'BAT-20261026-02',
    clinicalDiagnosis: '甲状腺结节术后常规评估',
  },
  {
    id: 'REQ-20261026-004',
    applyNo: 'REQ-20261026-004',
    barcode: 'BC26102604',
    patientName: '张美娟',
    gender: '女',
    age: '35岁',
    idCard: '33010519910918****',
    patientType: '门诊',
    medicalRecordNo: 'KJC2026011',
    partnerId: 'P03',
    partnerName: '科技城社区卫生服务中心',
    applyDept: '妇科门诊',
    applyDoctor: '赵芳医生',
    testItems: ['女性肿瘤标志物四项(AFP, CEA, CA125, CA19-9)'],
    specimenType: '血清',
    tubeType: '红头干燥管',
    sampleTime: '2026-10-26 09:40',
    temperatureRequirement: '冷藏(2-8℃)',
    status: 'dispatched',
    batchNo: 'BAT-20261026-03',
    clinicalDiagnosis: '体检发现附件包块查因',
  },
  {
    id: 'REQ-20261026-005',
    applyNo: 'REQ-20261026-005',
    barcode: 'BC26102605',
    patientName: '孙德荣',
    gender: '男',
    age: '73岁',
    idCard: '33010319531124****',
    patientType: '住院',
    medicalRecordNo: 'KF20261109',
    partnerId: 'P04',
    partnerName: '康复第二分院 (医联体成员院)',
    applyDept: '神经康复一病区',
    applyDoctor: '吴文彬医生',
    testItems: ['血同型半胱氨酸(HCY)', '降钙素原(PCT)定量'],
    specimenType: '血浆',
    tubeType: '绿头肝素锂管',
    sampleTime: '2026-10-26 10:05',
    temperatureRequirement: '冷冻(-20℃)',
    status: 'draft',
    clinicalDiagnosis: '脑梗死恢复期合并轻度肺部感染',
  },
];

// 3.1 送检申请平台外送单列表 (对应左侧送检单列表，点击行弹窗展示其右侧标本明细)
export const INITIAL_REFERRAL_DELIVERY_ORDERS: ReferralDeliveryOrder[] = [
  {
    id: 'DELIV-001',
    orderNo: '18121700001',
    applyHospital: '城东社区卫生服务中心',
    applyHospitalCode: 'CD-CHSC-01',
    deliverTime: '2026-10-30 12:00:00',
    receiveHospital: '市中心医院检验中心',
    deliverer: '张强 (冷链专运员)',
    status: '已送检',
    coolerTemp: '3.8℃',
    specimens: [
      {
        id: 'SPEC-001-1',
        patientName: '王建平',
        patientCategory: '住院',
        medicalRecordNo: '1811301101',
        barcode: '0011812170001',
        specimenType: '全血',
        applyItemName: '血常规5分类(XCGWFL)',
        applyDept: '内科',
        applyDoctor: '刘全医生',
        status: '已送检',
      },
      {
        id: 'SPEC-001-2',
        patientName: '王建平',
        patientCategory: '住院',
        medicalRecordNo: '1811301101',
        barcode: '0011812170002',
        specimenType: '血清',
        applyItemName: '肝脏功能测定(GZGNCD)',
        applyDept: '内科',
        applyDoctor: '刘全医生',
        status: '已送检',
      },
    ],
  },
  {
    id: 'DELIV-002',
    orderNo: '18121700002',
    applyHospital: '城东社区卫生服务中心',
    applyHospitalCode: 'CD-CHSC-01',
    deliverTime: '2026-10-30 11:30:00',
    receiveHospital: '市中心医院检验中心',
    deliverer: '张强 (冷链专运员)',
    status: '已接收',
    coolerTemp: '4.1℃',
    specimens: [
      {
        id: 'SPEC-002-1',
        patientName: '李琴',
        patientCategory: '门诊',
        medicalRecordNo: '1812171143',
        barcode: '0011812170012',
        specimenType: '全血',
        applyItemName: '血常规5分类(XCGWFL)',
        applyDept: '妇科',
        applyDoctor: '吴文彬医生',
        status: '已送检',
      },
      {
        id: 'SPEC-002-2',
        patientName: '李琴',
        patientCategory: '门诊',
        medicalRecordNo: '1812171143',
        barcode: '0011812170013',
        specimenType: '血清',
        applyItemName: '孕酮测定(YT)',
        applyDept: '妇科',
        applyDoctor: '吴文彬医生',
        status: '已接收',
      },
    ],
  },
  {
    id: 'DELIV-003',
    orderNo: '18121700003',
    applyHospital: '滨江街道社区卫生服务中心',
    applyHospitalCode: 'BJ-CHSC-02',
    deliverTime: '2026-10-30 10:45:00',
    receiveHospital: '市中心医院检验中心',
    deliverer: '李志明',
    status: '已送检',
    coolerTemp: '4.0℃',
    specimens: [
      {
        id: 'SPEC-003-1',
        patientName: '陈秀英',
        patientCategory: '门诊',
        medicalRecordNo: '1812172205',
        barcode: '0011812170025',
        specimenType: '全血',
        applyItemName: '糖化血红蛋白(HbA1c)',
        applyDept: '慢病管理科',
        applyDoctor: '黄淑珍医生',
        status: '已送检',
      },
      {
        id: 'SPEC-003-2',
        patientName: '陈秀英',
        patientCategory: '门诊',
        medicalRecordNo: '1812172205',
        barcode: '0011812170026',
        specimenType: '尿液',
        applyItemName: '尿微量白蛋白/肌酐(ACR)',
        applyDept: '慢病管理科',
        applyDoctor: '黄淑珍医生',
        status: '已送检',
      },
      {
        id: 'SPEC-003-3',
        patientName: '徐晓峰',
        patientCategory: '门诊',
        medicalRecordNo: '1812172209',
        barcode: '0011812170028',
        specimenType: '血清',
        applyItemName: '甲状腺激素五项(THY-5)',
        applyDept: '内科',
        applyDoctor: '黄淑珍医生',
        status: '已送检',
      },
    ],
  },
  {
    id: 'DELIV-004',
    orderNo: '18121700004',
    applyHospital: '科技城社区卫生服务中心',
    applyHospitalCode: 'KJC-CHSC-03',
    deliverTime: '2026-10-30 09:20:00',
    receiveHospital: '市中心医院检验中心',
    deliverer: '赵明',
    status: '已拒收',
    coolerTemp: '4.5℃',
    specimens: [
      {
        id: 'SPEC-004-1',
        patientName: '周小波',
        patientCategory: '门诊',
        medicalRecordNo: '1812173318',
        barcode: '0011812170038',
        specimenType: '血清',
        applyItemName: '心肌酶谱五项',
        applyDept: '全科医疗科',
        applyDoctor: '赵芳医生',
        status: '已拒收',
        rejectionReason: '标本严重机械性溶血，红细胞破裂影响心肌酶结果，需临床重新采集',
      },
    ],
  },
  {
    id: 'DELIV-005',
    orderNo: '18121700005',
    applyHospital: '康复第二分院 (医联体成员院)',
    applyHospitalCode: 'KF-HOSP-04',
    deliverTime: '2026-10-30 08:30:00',
    receiveHospital: '市中心医院检验中心',
    deliverer: '孙海',
    status: '已接收',
    coolerTemp: '3.6℃',
    specimens: [
      {
        id: 'SPEC-005-1',
        patientName: '孙德荣',
        patientCategory: '住院',
        medicalRecordNo: '1812174409',
        barcode: '0011812170049',
        specimenType: '血浆',
        applyItemName: '血同型半胱氨酸(HCY)',
        applyDept: '神经康复一病区',
        applyDoctor: '吴文彬医生',
        status: '已接收',
      },
      {
        id: 'SPEC-005-2',
        patientName: '孙德荣',
        patientCategory: '住院',
        medicalRecordNo: '1812174409',
        barcode: '0011812170050',
        specimenType: '血清',
        applyItemName: '降钙素原(PCT)定量',
        applyDept: '神经康复一病区',
        applyDoctor: '吴文彬医生',
        status: '已接收',
      },
    ],
  },
];

// 4. 冷链运输批次台账
export const INITIAL_TRANSPORT_BATCHES: TransportBatch[] = [
  {
    batchNo: 'BAT-20261026-01',
    partnerName: '城东社区卫生服务中心',
    courierName: '张强 (顺丰医冷专运)',
    courierPhone: '13812345678',
    coolerBoxNo: 'COLD-BOX-012',
    departTime: '2026-10-26 09:15',
    arriveTime: '2026-10-26 09:48',
    coolerTemp: 3.8,
    tempStatus: 'normal',
    totalCount: 38,
    receivedCount: 38,
    rejectedCount: 0,
    status: 'completed',
  },
  {
    batchNo: 'BAT-20261026-02',
    partnerName: '滨江街道社区卫生服务中心',
    courierName: '李飞 (区域专车车队)',
    courierPhone: '13987654321',
    coolerBoxNo: 'COLD-BOX-008',
    departTime: '2026-10-26 10:00',
    arriveTime: '预计 10:35',
    coolerTemp: 4.2,
    tempStatus: 'normal',
    totalCount: 26,
    receivedCount: 0,
    rejectedCount: 0,
    status: 'in_transit',
  },
  {
    batchNo: 'BAT-20261026-03',
    partnerName: '科技城社区卫生服务中心',
    courierName: '赵志军',
    courierPhone: '13765432109',
    coolerBoxNo: 'COLD-BOX-025',
    departTime: '2026-10-26 10:15',
    arriveTime: '预计 10:55',
    coolerTemp: 4.5,
    tempStatus: 'normal',
    totalCount: 19,
    receivedCount: 0,
    rejectedCount: 0,
    status: 'in_transit',
  },
];

// 5. 送检签收平台明细记录
export const INITIAL_REFERRAL_RECEIVALS: ReferralReceivalItem[] = [
  {
    id: 'RCV-01',
    barcode: 'BC26102601',
    patientName: '王建平',
    gender: '男',
    age: '54岁',
    partnerName: '城东社区卫生服务中心',
    testCategory: '临床生化',
    testItems: ['肝功能全套8项', '肾功能4项', '血脂四项'],
    specimenType: '血清',
    appearance: '合格清亮',
    receiveStatus: 'received',
    targetDevice: '生化分析流水线 Cobas 8000',
    receiver: '张珊',
    receiveTime: '2026-10-26 09:50',
    temperature: 3.8,
  },
  {
    id: 'RCV-02',
    barcode: 'BC26102602',
    patientName: '陈秀英',
    gender: '女',
    age: '68岁',
    partnerName: '城东社区卫生服务中心',
    testCategory: '特定蛋白/色谱',
    testItems: ['糖化血红蛋白(HbA1c)'],
    specimenType: 'EDTA抗凝全血',
    appearance: '合格清亮',
    receiveStatus: 'received',
    targetDevice: '高效液相色谱仪 Tosoh G8',
    receiver: '张珊',
    receiveTime: '2026-10-26 09:51',
    temperature: 3.9,
  },
  {
    id: 'RCV-03',
    barcode: 'BC26102608',
    patientName: '周小波',
    gender: '男',
    age: '28岁',
    partnerName: '城东社区卫生服务中心',
    testCategory: '临床生化',
    testItems: ['心肌酶谱五项', '肌钙蛋白I'],
    specimenType: '血清',
    appearance: '重度溶血',
    receiveStatus: 'rejected',
    rejectionReason: '标本严重机械性溶血，红细胞破裂影响心肌酶结果',
    targetDevice: '生化分析流水线 Cobas 8000',
    receiver: '张珊',
    receiveTime: '2026-10-26 09:52',
    temperature: 3.8,
  },
  {
    id: 'RCV-04',
    barcode: 'BC26102615',
    patientName: '马素华',
    gender: '女',
    age: '61岁',
    partnerName: '城东社区卫生服务中心',
    testCategory: '化学发光',
    testItems: ['甲状腺功能三项(FT3, FT4, TSH)'],
    specimenType: '血清',
    appearance: '合格清亮',
    receiveStatus: 'received',
    targetDevice: '化学发光仪 Alinity i',
    receiver: '张珊',
    receiveTime: '2026-10-26 09:53',
    temperature: 3.9,
  },
  {
    id: 'RCV-05',
    barcode: 'BC26102622',
    patientName: '郑国强',
    gender: '男',
    age: '49岁',
    partnerName: '滨江街道社区卫生服务中心',
    testCategory: '临床免疫',
    testItems: ['乙肝两对半定量', '丙肝抗体定量'],
    specimenType: '血清',
    appearance: '合格清亮',
    receiveStatus: 'pending',
    targetDevice: '化学发光仪 Architect i2000SR',
    receiver: '-',
    receiveTime: '-',
    temperature: 4.2,
  },
  {
    id: 'RCV-06',
    barcode: 'BC26102629',
    patientName: '何卫平',
    gender: '男',
    age: '65岁',
    partnerName: '滨江街道社区卫生服务中心',
    testCategory: '临床生化',
    testItems: ['血糖(GLU)', '糖化血清蛋白(GSP)'],
    specimenType: '血清',
    appearance: '合格清亮',
    receiveStatus: 'pending',
    targetDevice: '生化分析仪 AU5800',
    receiver: '-',
    receiveTime: '-',
    temperature: 4.1,
  },
];

// 6. 区域检验报告中心数据
export const INITIAL_REGIONAL_REPORTS: RegionalReport[] = [
  {
    id: 'RPT-20261026-001',
    reportNo: 'RPT-20261026-001',
    barcode: 'BC26102601',
    partnerName: '城东社区卫生服务中心',
    patientName: '王建平',
    gender: '男',
    age: '54岁',
    patientType: '门诊患者',
    deptName: '全科医疗科',
    doctorName: '刘全医生',
    clinicalDiagnosis: '高血压、脂肪肝定期评估',
    testCategory: '临床生化全套',
    specimenType: '血清',
    sampleTime: '2026-10-26 08:35',
    receiveTime: '2026-10-26 09:50',
    testTime: '2026-10-26 10:22',
    auditTime: '2026-10-26 10:45',
    tester: '李静',
    auditor: '张珊 (主管检验师)',
    status: 'synced_his',
    mutualRecogTag: '全国互认',
    items: [
      { itemCode: 'ALT', itemName: '丙氨酸氨基转移酶', itemEn: 'ALT', result: '68.4', flag: 'high', refRange: '9 - 50', unit: 'U/L', method: 'IFCC速率法' },
      { itemCode: 'AST', itemName: '天门冬氨酸氨基转移酶', itemEn: 'AST', result: '45.1', flag: 'high', refRange: '15 - 40', unit: 'U/L', method: 'IFCC速率法' },
      { itemCode: 'GGT', itemName: 'γ-谷氨酰基转移酶', itemEn: 'GGT', result: '82.0', flag: 'high', refRange: '10 - 60', unit: 'U/L', method: '底物比色法' },
      { itemCode: 'TBIL', itemName: '总胆红素', itemEn: 'TBIL', result: '15.2', flag: 'normal', refRange: '3.4 - 20.5', unit: 'μmol/L', method: '重氮盐比色法' },
      { itemCode: 'CREA', itemName: '血清肌酐', itemEn: 'Crea', result: '78.5', flag: 'normal', refRange: '41 - 97', unit: 'μmol/L', method: '肌氨酸氧化酶法' },
      { itemCode: 'UREA', itemName: '血清尿素', itemEn: 'Urea', result: '5.2', flag: 'normal', refRange: '2.8 - 7.6', unit: 'mmol/L', method: '脲酶偶联法' },
      { itemCode: 'TC', itemName: '总胆固醇', itemEn: 'TC', result: '5.62', flag: 'high', refRange: '2.80 - 5.20', unit: 'mmol/L', method: 'CHOD-PAP法' },
      { itemCode: 'TG', itemName: '甘油三酯', itemEn: 'TG', result: '2.45', flag: 'high', refRange: '0.56 - 1.70', unit: 'mmol/L', method: 'GPO-PAP法' },
    ],
    comment: '转氨酶与血脂指标轻中度升高，请结合腹部超声及临床脂肪肝评估。报告已通过区域平台双向回传基层社卫HIS。',
  },
  {
    id: 'RPT-20261026-002',
    reportNo: 'RPT-20261026-002',
    barcode: 'BC26102602',
    partnerName: '城东社区卫生服务中心',
    patientName: '陈秀英',
    gender: '女',
    age: '68岁',
    patientType: '慢病家医签约',
    deptName: '慢病管理门诊',
    doctorName: '刘全医生',
    clinicalDiagnosis: '2型糖尿病评估',
    testCategory: '色谱检验',
    specimenType: 'EDTA抗凝全血',
    sampleTime: '2026-10-26 08:45',
    receiveTime: '2026-10-26 09:51',
    testTime: '2026-10-26 10:15',
    auditTime: '2026-10-26 10:30',
    tester: '张珊',
    auditor: '赵秀琴 (主任检验师)',
    status: 'synced_his',
    mutualRecogTag: '全国互认',
    items: [
      { itemCode: 'HbA1c', itemName: '糖化血红蛋白(HPLC法)', itemEn: 'HbA1c', result: '7.4', flag: 'high', refRange: '4.0 - 6.0', unit: '%', method: '高效液相色谱法' },
      { itemCode: 'eAG', itemName: '估算平均血糖', itemEn: 'eAG', result: '9.2', flag: 'high', refRange: '3.9 - 6.1', unit: 'mmol/L', method: '公式推算' },
    ],
    comment: '近2-3个月平均血糖控制未达标(目标<7.0%)，建议结合家医团队调整降糖策略。',
  },
  {
    id: 'RPT-20261026-003',
    reportNo: 'RPT-20261026-003',
    barcode: 'BC26102588',
    partnerName: '滨江街道社区卫生服务中心',
    patientName: '张美娟',
    gender: '女',
    age: '35岁',
    patientType: '门诊体检',
    deptName: '妇科门诊',
    doctorName: '赵芳医生',
    clinicalDiagnosis: '卵巢囊肿术前筛查',
    testCategory: '化学发光微粒子免疫',
    specimenType: '血清',
    sampleTime: '2026-10-25 14:10',
    receiveTime: '2026-10-25 15:20',
    testTime: '2026-10-25 16:05',
    auditTime: '2026-10-25 16:35',
    tester: '王明华',
    auditor: '张珊 (主管检验师)',
    status: 'issued',
    mutualRecogTag: '省内互认',
    items: [
      { itemCode: 'AFP', itemName: '甲胎蛋白', itemEn: 'AFP', result: '3.1', flag: 'normal', refRange: '0.0 - 7.0', unit: 'ng/mL', method: 'CMIA化学发光' },
      { itemCode: 'CEA', itemName: '癌胚抗原', itemEn: 'CEA', result: '1.4', flag: 'normal', refRange: '0.0 - 5.0', unit: 'ng/mL', method: 'CMIA化学发光' },
      { itemCode: 'CA125', itemName: '糖类抗原125', itemEn: 'CA125', result: '18.6', flag: 'normal', refRange: '0.0 - 35.0', unit: 'U/mL', method: 'CMIA化学发光' },
      { itemCode: 'CA199', itemName: '糖类抗原19-9', itemEn: 'CA19-9', result: '11.2', flag: 'normal', refRange: '0.0 - 37.0', unit: 'U/mL', method: 'CMIA化学发光' },
    ],
    comment: '四项常见肿瘤标志物定量均在健康参考区间内。',
  },
  {
    id: 'RPT-20261026-004',
    reportNo: 'RPT-20261026-004',
    barcode: 'BC26102599',
    partnerName: '康复第二分院 (医联体成员院)',
    patientName: '孙德荣',
    gender: '男',
    age: '73岁',
    patientType: '住院患者',
    deptName: '神经康复病区',
    doctorName: '吴文彬医生',
    clinicalDiagnosis: '脑血管病后遗症',
    testCategory: '急查感染免疫',
    specimenType: '血清',
    sampleTime: '2026-10-26 07:30',
    receiveTime: '2026-10-26 08:40',
    testTime: '2026-10-26 09:10',
    auditTime: '2026-10-26 09:25',
    tester: '李静',
    auditor: '张珊 (主管检验师)',
    status: 'crisis',
    mutualRecogTag: '优先复核',
    items: [
      { itemCode: 'PCT', itemName: '降钙素原定量', itemEn: 'PCT', result: '4.85', flag: 'high', refRange: '< 0.05', unit: 'ng/mL', method: '时间分辨荧光' },
      { itemCode: 'CRP', itemName: 'C反应蛋白', itemEn: 'CRP', result: '78.2', flag: 'high', refRange: '0.0 - 8.0', unit: 'mg/L', method: '免疫比浊法' },
      { itemCode: 'HCY', itemName: '同型半胱氨酸', itemEn: 'HCY', result: '22.4', flag: 'high', refRange: '5.0 - 15.0', unit: 'μmol/L', method: '循环酶法' },
    ],
    comment: '【危急提示】降钙素原显著升高提示严重细菌性脓毒血症风险，已电话通报病区吴医生。',
  },
];

// 7. 送检签收平台完整台账模型 (匹配截屏布局与字段)
export interface ReferralReceiveTableItem {
  id: string;
  status: '已接收' | '已拒收' | '待签收';
  applyNo: string;
  deliverTime: string;
  deliverer: string;
  deliverHospital: string;
  patientName: string;
  gender: '男' | '女';
  age: string;
  patientCategory: '住院' | '门诊' | '急诊';
  medicalRecordNo: string;
  barcode: string;
  specimenType: string;
  applyItemName: string;
  applyDept: string;
  applyDoctor: string;
  applyTime: string;
  receiveTime?: string;
  receiver?: string;
  rejectionReason?: string;
  targetDevice?: string;
  temperature?: string;
}

export const INITIAL_REFERRAL_RECEIVE_TABLE: ReferralReceiveTableItem[] = [
  {
    id: 'RCV-REC-01',
    status: '已接收',
    applyNo: '18121700001',
    deliverTime: '2026-10-30 08:12:34',
    deliverer: '李志明',
    deliverHospital: '城东社区卫生服务中心',
    patientName: '王建平',
    gender: '男',
    age: '45岁',
    patientCategory: '住院',
    medicalRecordNo: '1811301101',
    barcode: '0011812170001',
    specimenType: '全血',
    applyItemName: '血常规5分类(XCGWFL)',
    applyDept: '内科',
    applyDoctor: '刘全医生',
    applyTime: '2026-10-30 08:12:34',
    receiveTime: '2026-10-30 08:35:10',
    receiver: '张珊',
    targetDevice: '全自动血液细胞分析流水线 Mindray CAL 8000',
    temperature: '4.2℃',
  },
  {
    id: 'RCV-REC-02',
    status: '已接收',
    applyNo: '18121700001',
    deliverTime: '2026-10-30 08:12:34',
    deliverer: '李志明',
    deliverHospital: '城东社区卫生服务中心',
    patientName: '王建平',
    gender: '男',
    age: '45岁',
    patientCategory: '住院',
    medicalRecordNo: '1811301101',
    barcode: '0011812170002',
    specimenType: '血清',
    applyItemName: '肝脏功能测定(GZGNCD)',
    applyDept: '内科',
    applyDoctor: '刘全医生',
    applyTime: '2026-10-30 08:12:34',
    receiveTime: '2026-10-30 08:35:12',
    receiver: '张珊',
    targetDevice: '全自动生化分析仪 Roche Cobas 8000',
    temperature: '4.2℃',
  },
  {
    id: 'RCV-REC-03',
    status: '已接收',
    applyNo: '18121700002',
    deliverTime: '2026-10-30 08:12:34',
    deliverer: '李志明',
    deliverHospital: '城东社区卫生服务中心',
    patientName: '李琴',
    gender: '女',
    age: '23岁',
    patientCategory: '门诊',
    medicalRecordNo: '1812171143',
    barcode: '0011812170012',
    specimenType: '全血',
    applyItemName: '血常规5分类(XCGWFL)',
    applyDept: '妇科',
    applyDoctor: '吴文彬医生',
    applyTime: '2026-10-30 09:12:34',
    receiveTime: '2026-10-30 09:20:15',
    receiver: '张珊',
    targetDevice: '全自动血液细胞分析流水线 Sysmex XN-9100',
    temperature: '3.9℃',
  },
  {
    id: 'RCV-REC-04',
    status: '已拒收',
    applyNo: '18121700002',
    deliverTime: '2026-10-30 08:12:34',
    deliverer: '李志明',
    deliverHospital: '城东社区卫生服务中心',
    patientName: '李琴',
    gender: '女',
    age: '23岁',
    patientCategory: '门诊',
    medicalRecordNo: '1812171143',
    barcode: '0011812170013',
    specimenType: '血清',
    applyItemName: '孕酮(YT)',
    applyDept: '妇科',
    applyDoctor: '吴文彬医生',
    applyTime: '2026-10-30 09:12:34',
    receiveTime: '2026-10-30 09:21:00',
    receiver: '张珊',
    rejectionReason: '标本严重重度溶血，游离血红蛋白干扰化学发光检测，已通知送检科室补采',
    targetDevice: '化学发光仪 Abbott Alinity i',
    temperature: '3.9℃',
  },
  {
    id: 'RCV-REC-05',
    status: '已接收',
    applyNo: '18121700003',
    deliverTime: '2026-10-30 08:45:00',
    deliverer: '张强',
    deliverHospital: '滨江街道社区卫生服务中心',
    patientName: '陈秀英',
    gender: '女',
    age: '68岁',
    patientCategory: '门诊',
    medicalRecordNo: '1812172205',
    barcode: '0011812170025',
    specimenType: '全血',
    applyItemName: '糖化血红蛋白(HbA1c)',
    applyDept: '慢病管理科',
    applyDoctor: '黄淑珍医生',
    applyTime: '2026-10-30 08:40:00',
    receiveTime: '2026-10-30 08:52:18',
    receiver: '张珊',
    targetDevice: '高效液相色谱仪 Tosoh G8',
    temperature: '4.1℃',
  },
  {
    id: 'RCV-REC-06',
    status: '待签收',
    applyNo: '18121700003',
    deliverTime: '2026-10-30 08:45:00',
    deliverer: '张强',
    deliverHospital: '滨江街道社区卫生服务中心',
    patientName: '陈秀英',
    gender: '女',
    age: '68岁',
    patientCategory: '门诊',
    medicalRecordNo: '1812172205',
    barcode: '0011812170026',
    specimenType: '尿液',
    applyItemName: '尿微量白蛋白/肌酐(ACR)',
    applyDept: '慢病管理科',
    applyDoctor: '黄淑珍医生',
    applyTime: '2026-10-30 08:40:00',
    targetDevice: '全自动尿液分析流水线 Dirui FUS-2000',
    temperature: '4.1℃',
  },
  {
    id: 'RCV-REC-07',
    status: '待签收',
    applyNo: '18121700004',
    deliverTime: '2026-10-30 09:10:00',
    deliverer: '王伟',
    deliverHospital: '科技城社区卫生服务中心',
    patientName: '周小波',
    gender: '男',
    age: '34岁',
    patientCategory: '门诊',
    medicalRecordNo: '1812173318',
    barcode: '0011812170038',
    specimenType: '血清',
    applyItemName: '心肌酶谱五项(CK/CK-MB/LDH/AST/HBDH)',
    applyDept: '全科医疗科',
    applyDoctor: '赵芳医生',
    applyTime: '2026-10-30 09:05:00',
    targetDevice: '全自动生化分析流水线 Roche Cobas 8000',
    temperature: '4.5℃',
  },
  {
    id: 'RCV-REC-08',
    status: '已接收',
    applyNo: '18121700005',
    deliverTime: '2026-10-30 08:30:00',
    deliverer: '赵明',
    deliverHospital: '康复第二分院',
    patientName: '孙德荣',
    gender: '男',
    age: '62岁',
    patientCategory: '住院',
    medicalRecordNo: '1812174409',
    barcode: '0011812170049',
    specimenType: '血浆',
    applyItemName: '凝血六项(PT/APTT/TT/FIB/DD/FDP)',
    applyDept: '神经康复一病区',
    applyDoctor: '吴文彬医生',
    applyTime: '2026-10-30 08:15:00',
    receiveTime: '2026-10-30 08:42:10',
    receiver: '张珊',
    targetDevice: '全自动凝血分析仪 Stago STA-R Max',
    temperature: '3.6℃',
  },
  {
    id: 'RCV-REC-09',
    status: '已接收',
    applyNo: '18121700005',
    deliverTime: '2026-10-30 08:30:00',
    deliverer: '赵明',
    deliverHospital: '康复第二分院',
    patientName: '孙德荣',
    gender: '男',
    age: '62岁',
    patientCategory: '住院',
    medicalRecordNo: '1812174409',
    barcode: '0011812170050',
    specimenType: '血清',
    applyItemName: '降钙素原(PCT)定量测定',
    applyDept: '神经康复一病区',
    applyDoctor: '吴文彬医生',
    applyTime: '2026-10-30 08:15:00',
    receiveTime: '2026-10-30 08:42:15',
    receiver: '张珊',
    targetDevice: '电化学发光仪 Roche Cobas e801',
    temperature: '3.6℃',
  },
  {
    id: 'RCV-REC-10',
    status: '待签收',
    applyNo: '18121700006',
    deliverTime: '2026-10-30 09:30:00',
    deliverer: '张强',
    deliverHospital: '滨江街道社区卫生服务中心',
    patientName: '郑雅婷',
    gender: '女',
    age: '29岁',
    patientCategory: '门诊',
    medicalRecordNo: '1812175512',
    barcode: '0011812170062',
    specimenType: '血清',
    applyItemName: '甲状腺激素全套(T3/T4/FT3/FT4/TSH)',
    applyDept: '内分泌科',
    applyDoctor: '孙立伟医生',
    applyTime: '2026-10-30 09:15:00',
    targetDevice: '化学发光免疫分析仪 Abbott Alinity i',
    temperature: '4.0℃',
  },
  {
    id: 'RCV-REC-11',
    status: '已拒收',
    applyNo: '18121700007',
    deliverTime: '2026-10-30 08:50:00',
    deliverer: '李志明',
    deliverHospital: '城东社区卫生服务中心',
    patientName: '张建军',
    gender: '男',
    age: '51岁',
    patientCategory: '门诊',
    medicalRecordNo: '1812176620',
    barcode: '0011812170075',
    specimenType: '全血',
    applyItemName: '血常规5分类(XCGWFL)',
    applyDept: '全科医疗科',
    applyDoctor: '刘全医生',
    applyTime: '2026-10-30 08:30:10',
    receiveTime: '2026-10-30 09:05:00',
    receiver: '张珊',
    rejectionReason: 'EDTA抗凝试管内出现可见纤维蛋白凝块，影响细胞吸样计数，已退回重采',
    targetDevice: '全自动血液细胞分析流水线 Mindray CAL 8000',
    temperature: '4.2℃',
  },
  {
    id: 'RCV-REC-12',
    status: '待签收',
    applyNo: '18121700008',
    deliverTime: '2026-10-30 09:40:00',
    deliverer: '王伟',
    deliverHospital: '科技城社区卫生服务中心',
    patientName: '钱桂英',
    gender: '女',
    age: '72岁',
    patientCategory: '住院',
    medicalRecordNo: '1812177701',
    barcode: '0011812170088',
    specimenType: '血清',
    applyItemName: '肾功能四项(BUN/Cr/UA/CysC)',
    applyDept: '慢病科',
    applyDoctor: '赵芳医生',
    applyTime: '2026-10-30 09:20:00',
    targetDevice: '全自动生化分析流水线 Roche Cobas 8000',
    temperature: '4.3℃',
  },
];

