export interface OverdueReport {
  barcode: string;
  patientId: string;
  name: string;
  specimen: string;
  testItem: string;
  department: string;
  applyTime: string;
  receiveTime: string;
  overdueHours: string;
  urgency: 'high' | 'medium' | 'normal';
}

export interface RejectedSpecimen {
  barcode: string;
  patientId: string;
  name: string;
  specimen: string;
  testItem: string;
  department: string;
  applyTime: string;
  rejectTime: string;
  rejectReason: string;
  operator: string;
}

export const INITIAL_HOME_KPIS = {
  todayReceived: 157,
  testingInProgress: 346,
  pendingReports: 11,
  pendingMessages: 10,
};

/**
 * 超时未发报告 (近期数据，严格按核收时间降序排列：最新在最前)
 */
export const OVERDUE_REPORTS_DATA: OverdueReport[] = [
  {
    barcode: '202610150089',
    patientId: 'ZY2026101502',
    name: '陈建国',
    specimen: '痰液',
    testItem: '痰涂片、结核菌涂片',
    department: '呼吸内科',
    applyTime: '2026/10/15 18:35',
    receiveTime: '2026/10/15 18:40',
    overdueHours: '超期 5h (夜班待审)',
    urgency: 'high',
  },
  {
    barcode: '202610150058',
    patientId: 'ZY2026101511',
    name: '孙志强',
    specimen: '血液',
    testItem: '血常规、CRP',
    department: '急诊科',
    applyTime: '2026/10/15 16:10',
    receiveTime: '2026/10/15 16:15',
    overdueHours: '急查超期 2h',
    urgency: 'high',
  },
  {
    barcode: '202610150032',
    patientId: 'MP2026101508',
    name: '王浩宇',
    specimen: '血液',
    testItem: '血培养',
    department: '心内科',
    applyTime: '2026/10/15 11:20',
    receiveTime: '2026/10/15 11:25',
    overdueHours: '超期 12h (增菌中)',
    urgency: 'medium',
  },
  {
    barcode: '202610150012',
    patientId: 'ZY2026101501',
    name: '刘淑芬',
    specimen: '痰液',
    testItem: '痰涂片、结核菌涂片',
    department: '呼吸内科',
    applyTime: '2026/10/15 09:15',
    receiveTime: '2026/10/15 09:20',
    overdueHours: '超期 14h',
    urgency: 'high',
  },
  {
    barcode: '202610140188',
    patientId: 'ZY2026101428',
    name: '赵敏',
    specimen: '尿液',
    testItem: '尿常规+沉渣',
    department: '肾内科',
    applyTime: '2026/10/14 15:45',
    receiveTime: '2026/10/14 15:50',
    overdueHours: '超期 31h',
    urgency: 'high',
  },
  {
    barcode: '202610140112',
    patientId: 'MP2026101406',
    name: '周晓雯',
    specimen: '血液',
    testItem: '血培养',
    department: '心内科',
    applyTime: '2026/10/14 10:10',
    receiveTime: '2026/10/14 10:15',
    overdueHours: '超期 37h (阳性待报)',
    urgency: 'normal',
  },
  {
    barcode: '202610130095',
    patientId: 'ZY2026101315',
    name: '吴伟国',
    specimen: '粪便',
    testItem: '便常规+潜血',
    department: '消化内科',
    applyTime: '2026/10/13 14:30',
    receiveTime: '2026/10/13 14:35',
    overdueHours: '超期 56h',
    urgency: 'medium',
  },
  {
    barcode: '202610130022',
    patientId: 'ZY2026101302',
    name: '郑秀英',
    specimen: '痰液',
    testItem: '痰涂片、结核菌涂片',
    department: '呼吸内科',
    applyTime: '2026/10/13 09:20',
    receiveTime: '2026/10/13 09:25',
    overdueHours: '超期 62h (需双签)',
    urgency: 'high',
  },
];

/**
 * 今日拒收标本 (全部为今日 2026/10/15 近期数据，严格按拒收时间降序排列：最新在最前)
 */
export const REJECTED_SPECIMENS_DATA: RejectedSpecimen[] = [
  {
    barcode: '202610150118',
    patientId: 'ZY2026101529',
    name: '陈建国',
    specimen: '血液',
    testItem: '血培养',
    department: '呼吸内科',
    applyTime: '2026/10/15 22:30',
    rejectTime: '2026/10/15 22:45',
    rejectReason: '采血量严重不足 (<2mL)',
    operator: '张珊',
  },
  {
    barcode: '202610150106',
    patientId: 'MP2026101521',
    name: '刘淑芬',
    specimen: '痰液',
    testItem: '痰涂片、结核菌涂片',
    department: '感染科',
    applyTime: '2026/10/15 21:10',
    rejectTime: '2026/10/15 21:25',
    rejectReason: '标本多为唾液，镜检白细胞不达标',
    operator: '李伟',
  },
  {
    barcode: '202610150098',
    patientId: 'ZY2026101518',
    name: '王浩宇',
    specimen: '尿液',
    testItem: '尿常规+沉渣',
    department: '肾内科',
    applyTime: '2026/10/15 19:20',
    rejectTime: '2026/10/15 19:35',
    rejectReason: '送检超时 (>2小时未冷藏保存)',
    operator: '张珊',
  },
  {
    barcode: '202610150085',
    patientId: 'ZY2026101514',
    name: '赵敏',
    specimen: '脑脊液',
    testItem: '生化常规',
    department: '神经内科',
    applyTime: '2026/10/15 17:50',
    rejectTime: '2026/10/15 18:05',
    rejectReason: '采血管选用错误(误用EDTA抗凝管)',
    operator: '王博',
  },
  {
    barcode: '202610150072',
    patientId: 'MP2026101512',
    name: '孙志强',
    specimen: '粪便',
    testItem: '便常规+潜血',
    department: '消化内科',
    applyTime: '2026/10/15 16:40',
    rejectTime: '2026/10/15 16:55',
    rejectReason: '标本混入尿液及冲洗液污染',
    operator: '刘芳',
  },
  {
    barcode: '202610150064',
    patientId: 'ZY2026101509',
    name: '周晓雯',
    specimen: '血液',
    testItem: '血常规、CRP',
    department: '急诊科',
    applyTime: '2026/10/15 14:15',
    rejectTime: '2026/10/15 14:30',
    rejectReason: '试管底部有微小凝块(抗凝未摇匀)',
    operator: '张珊',
  },
  {
    barcode: '202610150051',
    patientId: 'ZY2026101507',
    name: '吴伟国',
    specimen: '胸水',
    testItem: '脱落细胞学',
    department: '胸外科',
    applyTime: '2026/10/15 11:25',
    rejectTime: '2026/10/15 11:40',
    rejectReason: '送检容器破损渗漏，污染条码',
    operator: '李伟',
  },
  {
    barcode: '202610150039',
    patientId: 'MP2026101504',
    name: '郑秀英',
    specimen: '阴道分泌物',
    testItem: '白带常规',
    department: '妇科',
    applyTime: '2026/10/15 10:05',
    rejectTime: '2026/10/15 10:20',
    rejectReason: '标本干涸，未添加生理盐水浸润',
    operator: '王博',
  },
  {
    barcode: '202610150025',
    patientId: 'ZY2026101503',
    name: '黄子轩',
    specimen: '血液',
    testItem: '凝血功能',
    department: '普外科',
    applyTime: '2026/10/15 09:35',
    rejectTime: '2026/10/15 09:50',
    rejectReason: '抗凝比例错误(采血量超刻度2.5倍)',
    operator: '刘芳',
  },
  {
    barcode: '202610150011',
    patientId: 'ZY2026101501',
    name: '林美华',
    specimen: '腹水',
    testItem: '生化常规',
    department: '消化内科',
    applyTime: '2026/10/15 08:30',
    rejectTime: '2026/10/15 08:45',
    rejectReason: '条码破损脱落，无法核验标本身份',
    operator: '张珊',
  },
];
