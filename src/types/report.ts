export interface TestItemDetail {
  id: string;
  orderNum: number;
  code: string; // PT, PT-INR, APTT, etc.
  name: string; // 凝血酶原时间, etc.
  result: string; // 9.0, 3.0, etc.
  status: 'normal' | 'up' | 'down' | 'critical'; // ↑, ↓, ⚠️
  statusLabel?: string;
  referenceRange: string; // 9-14
  unit: string; // 秒, g/L
  method?: string; // 凝固法, 比色法, 免疫荧光
  clinicalSignificance?: {
    overview: string;
    highCauses?: string[];
    lowCauses?: string[];
    recommendations?: string[];
  };
}

export interface PatientHistoryPoint {
  date: string; // 2026-10-15
  time: string; // 09:20
  value: number; // 9.0
  status: 'normal' | 'up' | 'down';
  doctor: string;
}

export interface LabReport {
  id: string;
  barcode: string; // 222105090042
  applyNo: string; // 222105090042
  patientName: string; // 真实姓名: 杜文斌
  gender: '男' | '女';
  age: string; // 54岁
  medicalRecordNo: string; // 21050049
  outpatientNo?: string;
  inpatientNo?: string;
  bedNo: string; // 34床
  department: string; // 内一科
  patientSource: '住院' | '门诊' | '急诊' | '体检';
  testCategory: string; // 凝血功能, 肝功, 痰培养, 乙肝两对半, 血常规
  sampleType: string; // 静脉血, 血清, 痰液, 尿液, 抗凝全血
  clinicalDiagnosis: string; // 冠状动脉粥样硬化性心脏病 / 肺部感染待查
  applyTime: string; // 2026-10-30 08:15
  sampleTime: string; // 2026-10-30 08:30
  receiveTime: string; // 2026-10-30 08:45
  checkTime: string; // 2026-10-30 09:40
  auditTime: string; // 2026-10-30 10:15
  inspector: string; // 检验者: 李婷
  auditor: string; // 审核者: 张建华
  status: '已审核' | '已核收' | '已签收' | '已送检';
  printStatus: '已打印' | '未打印';
  printCount: number;
  isUrgent?: boolean;
  remarks?: string;
  items: TestItemDetail[];
  historyTrends?: Record<string, PatientHistoryPoint[]>; // keyed by item code (e.g. 'PT', 'PT-INR')
  hasInstrumentGraphics?: boolean;
  instrumentModel?: string; // 如 Sysmex XN-9000
}

export interface ReportFilterState {
  datePreset: 'today' | 'yesterday' | 'threeDays' | 'week' | 'month' | 'custom';
  startDate: string;
  endDate: string;
  department: string;
  printStatus: string;
  patientSource: string;
  searchKeyword: string;
  statusFilter: string;
}

export interface PrintSettingsState {
  printerName: string;
  paperSize: 'A4' | 'A5' | 'A4-double';
  orientation: 'portrait' | 'landscape';
  autoPrintOnAudit: boolean;
  printBarcode: boolean;
  showHospitalLogo: boolean;
  showDoctorSeal: boolean;
  topMargin: number;
  bottomMargin: number;
  copies: number;
  colorMode: 'color' | 'monochrome';
}
