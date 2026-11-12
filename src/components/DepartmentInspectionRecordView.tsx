import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Check,
  X,
  Printer,
  FileSpreadsheet,
  Building2,
  Sliders,
  CalendarCheck,
  Clock,
  User,
  ShieldCheck,
  Eye,
  Activity,
  Layers,
  ChevronRight
} from './MenuIcon';
import { UserProfile } from '../types/navigation';

export interface InspectionItem {
  id: string;
  itemName: string;
  checkValue: string;
  standard: string;
  result: '正常' | '合格' | '轻微偏差' | '异常';
  unit?: string;
  remarks?: string;
}

export interface DepartmentCheckRecord {
  id: string;
  deviceId: string;
  deviceCode: string;
  deviceName: string;
  taskDate: string; // 任务日期
  checkDate: string; // 检查日期
  checker: string; // 检查者 (真实人名)
  department: string; // 部门
  conclusion: '合格' | '正常' | '轻微偏差' | '需整改';
  notes: string;
  items: InspectionItem[];
}

export interface DepartmentDevice {
  id: string;
  code: string;
  name: string;
  department: string;
  model: string;
  location: string;
  status: '正常运行' | '维护中' | '在控备用';
  totalChecks: number;
}

interface DepartmentInspectionRecordViewProps {
  user: UserProfile;
  triggerAction: (msg: string) => void;
}

export const DepartmentInspectionRecordView: React.FC<DepartmentInspectionRecordViewProps> = ({
  user,
  triggerAction,
}) => {
  // 1. 科室设备数据 (涵盖截图中的 124323 AU2700, 124334 AU600 及全科核心分析仪器)
  const [deviceList, setDeviceList] = useState<DepartmentDevice[]>([
    {
      id: 'DEV-001',
      code: '124323',
      name: 'AU2700生化分析仪',
      department: '生化组',
      model: 'Olympus AU2700-HighSpeed',
      location: '检验楼4层 生化检验1室',
      status: '正常运行',
      totalChecks: 18,
    },
    {
      id: 'DEV-002',
      code: '124334',
      name: 'AU600全自动生化分析仪',
      department: '免疫组',
      model: 'Olympus AU600-Plus',
      location: '检验楼4层 免疫常规室',
      status: '正常运行',
      totalChecks: 12,
    },
    {
      id: 'DEV-003',
      code: '130101',
      name: '全自动质谱鉴定系统 (MALDI-TOF)',
      department: '微生物组',
      model: 'Bruker microflex LT/SH',
      location: '检验楼5层 微生物质谱室',
      status: '正常运行',
      totalChecks: 15,
    },
    {
      id: 'DEV-004',
      code: '130105',
      name: '快速血培养全自动监测仪 (BACTEC FX400)',
      department: '微生物组',
      model: 'BD BACTEC FX400',
      location: '检验楼5层 细菌培养室',
      status: '正常运行',
      totalChecks: 14,
    },
    {
      id: 'DEV-005',
      code: '130112',
      name: '全自动细菌药敏分析系统 (VITEK-2 Compact)',
      department: '微生物组',
      model: 'bioMérieux VITEK 2 Compact 60',
      location: '检验楼5层 细菌药敏分析室',
      status: '正常运行',
      totalChecks: 16,
    },
    {
      id: 'DEV-006',
      code: '124340',
      name: 'Beckman DxI 800 化学发光免疫分析仪',
      department: '免疫组',
      model: 'Beckman Coulter UniCel DxI 800',
      location: '检验楼4层 发光免疫2室',
      status: '正常运行',
      totalChecks: 20,
    },
    {
      id: 'DEV-007',
      code: '125101',
      name: 'Sysmex XN-9000 全自动血液分析流水线',
      department: '临检组',
      model: 'Sysmex XN-9000 Line',
      location: '急诊楼2层 急查与临检中心',
      status: '正常运行',
      totalChecks: 22,
    },
    {
      id: 'DEV-008',
      code: '128404',
      name: '沃特世 ACQUITY UPLC-MS 液质联用仪',
      department: '质谱分子组',
      model: 'Waters ACQUITY Xevo TQ-S',
      location: '科研楼3层 质谱分析实验室',
      status: '正常运行',
      totalChecks: 9,
    },
    {
      id: 'DEV-009',
      code: '128808',
      name: '赛默飞 ABI 7500 荧光定量PCR仪',
      department: '质谱分子组',
      model: 'Applied Biosystems 7500 Fast',
      location: '科研楼3层 分子扩增检测室',
      status: '正常运行',
      totalChecks: 11,
    },
    {
      id: 'DEV-010',
      code: '129101',
      name: 'Ortho Vision 全自动血型卡式分析系统',
      department: '输血科',
      model: 'Ortho Clinical Vision Max',
      location: '住院综合楼3层 输血配血室',
      status: '正常运行',
      totalChecks: 13,
    },
  ]);

  // 2. 检查记录列表数据 (时间全部更新为近期 2026年10月下旬，真实医技/工程师姓名)
  const [recordList, setRecordList] = useState<DepartmentCheckRecord[]>([
    {
      id: 'REC-20261030-001',
      deviceId: 'DEV-001',
      deviceCode: '124323',
      deviceName: 'AU2700生化分析仪',
      taskDate: '2026-10-30',
      checkDate: '2026-10-30 08:15',
      checker: '陈志远',
      department: '生化组',
      conclusion: '合格',
      notes: '晨间开机自检及光学比色杯空白校核全部达标，各通道进样针加样精准',
      items: [
        { id: 'itm-1', itemName: '比色杯光路透光率与空白吸光度', checkValue: '0.0018 Abs', standard: '< 0.0050 Abs', result: '正常', remarks: '各通道透过率一致性极佳' },
        { id: 'itm-2', itemName: '37℃恒温反应槽水温多点巡检', checkValue: '37.02 ℃', standard: '37.0 ± 0.1 ℃', result: '正常', remarks: '精密水银计比对无漂移' },
        { id: 'itm-3', itemName: '纯水供给站进水压力与电阻率', checkValue: '18.25 MΩ·cm / 0.19 MPa', standard: '≥18.2 MΩ·cm / 0.15~0.25 MPa', result: '正常', remarks: '超纯水滤芯正常' },
        { id: 'itm-4', itemName: '试剂探针与样本针液面探测感度', checkValue: '响应时间 0.04s', standard: '响应时间 ≤ 0.08s', result: '正常', remarks: '电容感应极板清洁无挂滴' },
        { id: 'itm-5', itemName: '搅拌桨洗液残留与脱蛋白检测', checkValue: '阴性 (无挂液)', standard: '无洗液挂壁、无蛋白残留', result: '正常', remarks: '螺旋搅拌桨表面洁净' },
        { id: 'itm-6', itemName: '废液真空泵抽吸负压及排液管路', checkValue: '-84.5 kPa', standard: '-80 ~ -90 kPa', result: '正常', remarks: '排液畅通无渗漏' },
      ],
    },
    {
      id: 'REC-20261029-002',
      deviceId: 'DEV-001',
      deviceCode: '124323',
      deviceName: 'AU2700生化分析仪',
      taskDate: '2026-10-29',
      checkDate: '2026-10-29 08:20',
      checker: '王雪梅',
      department: '生化组',
      conclusion: '合格',
      notes: '例行日检合格，更换第4组清洗剂与比色皿维护液',
      items: [
        { id: 'itm-7', itemName: '比色杯光路透光率与空白吸光度', checkValue: '0.0021 Abs', standard: '< 0.0050 Abs', result: '正常', remarks: '透光稳定' },
        { id: 'itm-8', itemName: '37℃恒温反应槽水温多点巡检', checkValue: '37.04 ℃', standard: '37.0 ± 0.1 ℃', result: '正常', remarks: '温控良好' },
        { id: 'itm-9', itemName: '纯水供给站进水压力与电阻率', checkValue: '18.22 MΩ·cm / 0.18 MPa', standard: '≥18.2 MΩ·cm / 0.15~0.25 MPa', result: '正常', remarks: '电阻率正常' },
        { id: 'itm-10', itemName: '试剂探针与样本针液面探测感度', checkValue: '响应时间 0.05s', standard: '响应时间 ≤ 0.08s', result: '正常', remarks: '灵敏' },
        { id: 'itm-11', itemName: '搅拌桨洗液残留与脱蛋白检测', checkValue: '阴性 (无残留)', standard: '无洗液挂壁、无蛋白残留', result: '正常', remarks: '合格' },
        { id: 'itm-12', itemName: '废液真空泵抽吸负压及排液管路', checkValue: '-83.8 kPa', standard: '-80 ~ -90 kPa', result: '正常', remarks: '管路通畅' },
      ],
    },
    {
      id: 'REC-20261028-003',
      deviceId: 'DEV-001',
      deviceCode: '124323',
      deviceName: 'AU2700生化分析仪',
      taskDate: '2026-10-28',
      checkDate: '2026-10-28 08:35',
      checker: '赵立峰',
      department: '生化组',
      conclusion: '正常',
      notes: '高级设备工程师巡检，注射器柱塞密封圈润滑与吸光度线性比对完成',
      items: [
        { id: 'itm-13', itemName: '比色杯光路透光率与空白吸光度', checkValue: '0.0019 Abs', standard: '< 0.0050 Abs', result: '正常', remarks: '光强检测达标' },
        { id: 'itm-14', itemName: '37℃恒温反应槽水温多点巡检', checkValue: '36.98 ℃', standard: '37.0 ± 0.1 ℃', result: '正常', remarks: '恒温槽水循环正常' },
        { id: 'itm-15', itemName: '试样注射器吐出体积精密度 (CV%)', checkValue: '0.42 %', standard: 'CV ≤ 0.80 %', result: '合格', remarks: '加样重复性优异' },
        { id: 'itm-16', itemName: '排废液电磁阀启闭响应测试', checkValue: '动作延迟 18ms', standard: '延迟 ≤ 30ms', result: '正常', remarks: '阀体无迟滞结晶' },
      ],
    },
    {
      id: 'REC-20261027-004',
      deviceId: 'DEV-001',
      deviceCode: '124323',
      deviceName: 'AU2700生化分析仪',
      taskDate: '2026-10-27',
      checkDate: '2026-10-27 08:10',
      checker: '陈志远',
      department: '生化组',
      conclusion: '合格',
      notes: '周一早班开机全面检查，质控与校准在控',
      items: [
        { id: 'itm-17', itemName: '比色杯光路透光率与空白吸光度', checkValue: '0.0023 Abs', standard: '< 0.0050 Abs', result: '正常' },
        { id: 'itm-18', itemName: '37℃恒温反应槽水温多点巡检', checkValue: '37.01 ℃', standard: '37.0 ± 0.1 ℃', result: '正常' },
        { id: 'itm-19', itemName: '纯水供给站进水压力与电阻率', checkValue: '18.23 MΩ·cm / 0.19 MPa', standard: '≥18.2 MΩ·cm', result: '正常' },
      ],
    },
    // DEV-002: AU600 全自动生化分析仪
    {
      id: 'REC-20261030-005',
      deviceId: 'DEV-002',
      deviceCode: '124334',
      deviceName: 'AU600全自动生化分析仪',
      taskDate: '2026-10-30',
      checkDate: '2026-10-30 08:40',
      checker: '郭海平',
      department: '免疫组',
      conclusion: '合格',
      notes: '备用分析仪晨间预热巡检，运行平稳，恒温槽温控符合要求',
      items: [
        { id: 'itm-20', itemName: '卤素灯光源强度与波长校准', checkValue: '光强 8850 counts', standard: '≥ 7500 counts', result: '正常', remarks: '主波长 340nm-800nm 正常' },
        { id: 'itm-21', itemName: '恒温水浴箱温度监测', checkValue: '37.05 ℃', standard: '37.0 ± 0.2 ℃', result: '正常', remarks: '温控恒定' },
        { id: 'itm-22', itemName: '加样臂垂直及水平运动机械对中', checkValue: '同轴度偏差 0.03mm', standard: '偏差 ≤ 0.10mm', result: '正常', remarks: '定位精准' },
        { id: 'itm-23', itemName: '泵管磨损与气泡逸出检查', checkValue: '管壁弹性优良、无气泡', standard: '无管壁老化与破损', result: '正常', remarks: '蠕动泵运行平稳' },
      ],
    },
    {
      id: 'REC-20261028-006',
      deviceId: 'DEV-002',
      deviceCode: '124334',
      deviceName: 'AU600全自动生化分析仪',
      taskDate: '2026-10-28',
      checkDate: '2026-10-28 09:00',
      checker: '周丽娜',
      department: '免疫组',
      conclusion: '合格',
      notes: '例行巡检与反应盘擦拭保养，无报错代码',
      items: [
        { id: 'itm-24', itemName: '卤素灯光源强度与波长校准', checkValue: '光强 8910 counts', standard: '≥ 7500 counts', result: '正常' },
        { id: 'itm-25', itemName: '恒温水浴箱温度监测', checkValue: '37.01 ℃', standard: '37.0 ± 0.2 ℃', result: '正常' },
        { id: 'itm-26', itemName: '清洗液供应罐低液位报警联动测试', checkValue: '警报准确触发', standard: '探针接触断开即报警', result: '正常' },
      ],
    },
    // DEV-003: 质谱鉴定系统
    {
      id: 'REC-20261030-007',
      deviceId: 'DEV-003',
      deviceCode: '130101',
      deviceName: '全自动质谱鉴定系统 (MALDI-TOF)',
      taskDate: '2026-10-30',
      checkDate: '2026-10-30 08:10',
      checker: '郭海平',
      department: '微生物组',
      conclusion: '合格',
      notes: 'BTS标准品靶位校准质谱峰误差仅72ppm，真空度与激光脉冲正常',
      items: [
        { id: 'itm-27', itemName: '高真空腔体气压 (Pumping Vacuum)', checkValue: '1.42e-7 mbar', standard: '< 2.50e-7 mbar', result: '正常', remarks: '涡轮分子泵转速100%' },
        { id: 'itm-28', itemName: '氮气激光器脉冲能量衰减测试', checkValue: '94.2 % 额定功率', standard: '≥ 85.0 %', result: '正常', remarks: '打靶电离效率优良' },
        { id: 'itm-29', itemName: '靶板定位高精步进电机复位精度', checkValue: '靶点误差 0.02 mm', standard: '< 0.05 mm', result: '正常', remarks: '96孔靶位定位无漂移' },
        { id: 'itm-30', itemName: 'BTS标准肽谱校准质量偏差', checkValue: '72 ppm', standard: '< 300 ppm', result: '正常', remarks: '标准质谱峰形对称锐利' },
      ],
    },
    // DEV-004: 快速血培养全自动监测仪
    {
      id: 'REC-20261030-008',
      deviceId: 'DEV-004',
      deviceCode: '130105',
      deviceName: '快速血培养全自动监测仪 (BACTEC FX400)',
      taskDate: '2026-10-30',
      checkDate: '2026-10-30 07:50',
      checker: '周丽娜',
      department: '微生物组',
      conclusion: '合格',
      notes: '抽屉各孔位红外荧光传感器基线测定完毕，报警联动正常',
      items: [
        { id: 'itm-31', itemName: '孵育抽屉舱室恒温35℃监控', checkValue: '35.08 ℃', standard: '35.0 ± 0.5 ℃', result: '正常', remarks: '温控传感器受控' },
        { id: 'itm-32', itemName: '红外光电传感器孔位本底暗电流', checkValue: '12 pA', standard: '< 25 pA', result: '正常', remarks: '400孔位扫描正常' },
        { id: 'itm-33', itemName: '阳性瓶报响红光指示灯与蜂鸣器', checkValue: '响应率 100%', standard: '100% 同步触发', result: '正常', remarks: '声光联锁合格' },
      ],
    },
    // DEV-007: 血液分析流水线
    {
      id: 'REC-20261030-009',
      deviceId: 'DEV-007',
      deviceCode: '125101',
      deviceName: 'Sysmex XN-9000 全自动血液分析流水线',
      taskDate: '2026-10-30',
      checkDate: '2026-10-30 07:30',
      checker: '刘洋',
      department: '临检组',
      conclusion: '合格',
      notes: '晨间开机自检背景计数WBC=0.01, RBC=0.00, PLT=1，全通道鞘流聚焦正常',
      items: [
        { id: 'itm-34', itemName: '全血细胞分析通道背景计数 (Background)', checkValue: 'WBC 0.01 / PLT 1', standard: 'WBC≤0.1 / PLT≤10', result: '正常', remarks: '本底超纯无污染' },
        { id: 'itm-35', itemName: '半导体激光器鞘流流动室压力', checkValue: '0.245 MPa', standard: '0.24 ± 0.02 MPa', result: '正常', remarks: '细胞水动力聚焦良好' },
        { id: 'itm-36', itemName: '推片染色机刀片平整度与染液浓度', checkValue: '合格 (血膜呈单层分布)', standard: '头体尾分明无划痕', result: '正常', remarks: '瑞氏姬姆萨染色极佳' },
      ],
    },
  ]);

  // 状态管理
  const [selectedDept, setSelectedDept] = useState<string>('微生物组'); // 截图初始默认选中的是“微生物组”
  const [deviceSearchKeyword, setDeviceSearchKeyword] = useState<string>('');
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('DEV-001');
  const [selectedRecordId, setSelectedRecordId] = useState<string>('REC-20261030-001');

  // 弹窗状态
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<DepartmentCheckRecord | null>(null);
  const [deletingRecord, setDeletingRecord] = useState<DepartmentCheckRecord | null>(null);

  // 表单状态
  const [recordFormData, setRecordFormData] = useState<{
    deviceId: string;
    taskDate: string;
    checkDate: string;
    checker: string;
    department: string;
    conclusion: DepartmentCheckRecord['conclusion'];
    notes: string;
    items: InspectionItem[];
  }>({
    deviceId: 'DEV-001',
    taskDate: '2026-10-30',
    checkDate: '2026-10-30 08:30',
    checker: '陈志远',
    department: '生化组',
    conclusion: '合格',
    notes: '各检测项与运行基线完全符合国家临床实验室及原厂技术规范',
    items: [
      { id: 'item-new-1', itemName: '光学透光率与比色基线', checkValue: '0.0019 Abs', standard: '< 0.0050 Abs', result: '正常', remarks: '无杂散光干扰' },
      { id: 'item-new-2', itemName: '反应槽恒温与水循环水流', checkValue: '37.01 ℃', standard: '37.0 ± 0.1 ℃', result: '正常', remarks: '温控稳定' },
      { id: 'item-new-3', itemName: '进样探针防碰撞与液面感度', checkValue: '0.04s 迅速响应', standard: '≤ 0.08s', result: '正常', remarks: '垂直/水平防撞灵敏' },
      { id: 'item-new-4', itemName: '纯水与清洗液供液负压压力', checkValue: '0.19 MPa / -84 kPa', standard: '压力范围受控', result: '正常', remarks: '管路通畅无挂滴' },
    ],
  });

  // 真实检验科医师/技师名单
  const LAB_STAFF_LIST = [
    { name: '陈志远', title: '主管检验师', dept: '生化组' },
    { name: '王雪梅', title: '副主任检验师', dept: '免疫组' },
    { name: '郭海平', title: '主管检验师', dept: '微生物组' },
    { name: '赵立峰', title: '设备高级工程师', dept: '生化组' },
    { name: '刘洋', title: '检验医师', dept: '临检组' },
    { name: '孙晓东', title: '主管技师', dept: '质谱分子组' },
    { name: '周丽娜', title: '检验师', dept: '微生物组' },
    { name: '李明华', title: '主任医师', dept: '科主任办' },
    { name: '张建华', title: '主任检验师', dept: '质控科' },
  ];

  // 部门选项
  const DEPARTMENT_OPTIONS = [
    '全部部门',
    '微生物组',
    '生化组',
    '免疫组',
    '临检组',
    '质谱分子组',
    '输血科',
  ];

  // 过滤后的设备列表
  const filteredDevices = useMemo(() => {
    return deviceList.filter((dev) => {
      const matchDept =
        selectedDept === '全部部门' || dev.department === selectedDept;
      const matchKey =
        !deviceSearchKeyword.trim() ||
        dev.code.includes(deviceSearchKeyword.trim()) ||
        dev.name.toLowerCase().includes(deviceSearchKeyword.trim().toLowerCase()) ||
        dev.department.includes(deviceSearchKeyword.trim());
      return matchDept && matchKey;
    });
  }, [deviceList, selectedDept, deviceSearchKeyword]);

  // 当前选中的设备
  const currentDevice = useMemo(() => {
    return deviceList.find((d) => d.id === selectedDeviceId) || filteredDevices[0] || deviceList[0];
  }, [deviceList, selectedDeviceId, filteredDevices]);

  // 当过滤条件改变导致选中设备不再可见时，自适应重置
  React.useEffect(() => {
    if (filteredDevices.length > 0) {
      const exists = filteredDevices.some((d) => d.id === selectedDeviceId);
      if (!exists) {
        setSelectedDeviceId(filteredDevices[0].id);
      }
    }
  }, [filteredDevices, selectedDeviceId]);

  // 当前设备关联的检查记录列表
  const deviceRecords = useMemo(() => {
    if (!currentDevice) return [];
    return recordList.filter(
      (r) => r.deviceId === currentDevice.id || r.deviceCode === currentDevice.code
    );
  }, [recordList, currentDevice]);

  // 当前选中的检查记录
  const currentRecord = useMemo(() => {
    if (deviceRecords.length === 0) return null;
    return deviceRecords.find((r) => r.id === selectedRecordId) || deviceRecords[0];
  }, [deviceRecords, selectedRecordId]);

  // 当设备切换时，自动选定该设备的第一条检查记录
  React.useEffect(() => {
    if (deviceRecords.length > 0) {
      const exists = deviceRecords.some((r) => r.id === selectedRecordId);
      if (!exists) {
        setSelectedRecordId(deviceRecords[0].id);
      }
    }
  }, [deviceRecords, selectedRecordId]);

  // 处理新增检查记录
  const handleOpenAddModal = () => {
    const defaultDev = currentDevice || deviceList[0];
    setRecordFormData({
      deviceId: defaultDev.id,
      taskDate: '2026-10-30',
      checkDate: '2026-10-30 08:30',
      checker: user?.name || '陈志远',
      department: defaultDev.department,
      conclusion: '合格',
      notes: `对 ${defaultDev.name} 进行开机常规功能及关键性能指标核查`,
      items: [
        { id: `itm-add-1`, itemName: '主光学系统透光率与空白基线', checkValue: '0.0020 Abs', standard: '< 0.0050 Abs', result: '正常', remarks: '光路清洁无灰尘' },
        { id: 'itm-add-2', itemName: '工作温控箱/恒温槽精确度', checkValue: '37.02 ℃', standard: '37.0 ± 0.1 ℃', result: '正常', remarks: '测温稳定' },
        { id: 'itm-add-3', itemName: '加样针与试剂探针液位感应灵敏度', checkValue: '0.04s 响应', standard: '≤ 0.08s', result: '正常', remarks: '感应可靠' },
        { id: 'itm-add-4', itemName: '流路密封性与抽滤负压正常度', checkValue: '-84.2 kPa', standard: '-80 ~ -90 kPa', result: '正常', remarks: '无渗漏' },
      ],
    });
    setIsAddModalOpen(true);
  };

  const handleSaveNewRecord = (e: React.FormEvent) => {
    e.preventDefault();
    const dev = deviceList.find((d) => d.id === recordFormData.deviceId) || currentDevice;
    const newRec: DepartmentCheckRecord = {
      id: `REC-${Date.now()}`,
      deviceId: dev.id,
      deviceCode: dev.code,
      deviceName: dev.name,
      taskDate: recordFormData.taskDate,
      checkDate: recordFormData.checkDate,
      checker: recordFormData.checker,
      department: recordFormData.department,
      conclusion: recordFormData.conclusion,
      notes: recordFormData.notes || '常规巡检核查完成，记录完整归档',
      items: recordFormData.items.map((it, idx) => ({
        ...it,
        id: `it-${Date.now()}-${idx}`,
      })),
    };

    setRecordList([newRec, ...recordList]);
    setSelectedDeviceId(dev.id);
    setSelectedRecordId(newRec.id);
    setIsAddModalOpen(false);
    triggerAction(`新增《${dev.name}》检查记录成功！检查者: ${newRec.checker}`);
  };

  // 处理编辑检查记录
  const handleOpenEditModal = (rec: DepartmentCheckRecord, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingRecord(rec);
    setRecordFormData({
      deviceId: rec.deviceId,
      taskDate: rec.taskDate,
      checkDate: rec.checkDate,
      checker: rec.checker,
      department: rec.department,
      conclusion: rec.conclusion,
      notes: rec.notes,
      items: [...rec.items],
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEditRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRecord) return;
    const updated = recordList.map((r) => {
      if (r.id === editingRecord.id) {
        return {
          ...r,
          taskDate: recordFormData.taskDate,
          checkDate: recordFormData.checkDate,
          checker: recordFormData.checker,
          department: recordFormData.department,
          conclusion: recordFormData.conclusion,
          notes: recordFormData.notes,
          items: recordFormData.items,
        };
      }
      return r;
    });

    setRecordList(updated);
    setIsEditModalOpen(false);
    setEditingRecord(null);
    triggerAction(`更新检查记录（${editingRecord.taskDate} - ${editingRecord.checker}）成功！`);
  };

  // 处理删除检查记录
  const handleOpenDeleteModal = (rec: DepartmentCheckRecord, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeletingRecord(rec);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!deletingRecord) return;
    const updated = recordList.filter((r) => r.id !== deletingRecord.id);
    setRecordList(updated);
    setIsDeleteModalOpen(false);
    setDeletingRecord(null);
    triggerAction(`已删除检查记录（${deletingRecord.taskDate} · ${deletingRecord.checker}）！`);
  };

  // 动态修改表单中的检查项
  const handleUpdateFormItem = (index: number, field: keyof InspectionItem, value: any) => {
    const newItems = [...recordFormData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setRecordFormData({ ...recordFormData, items: newItems });
  };

  const handleAddFormItemRow = () => {
    setRecordFormData({
      ...recordFormData,
      items: [
        ...recordFormData.items,
        {
          id: `new-${Date.now()}`,
          itemName: '新增检查参数项',
          checkValue: '待测量',
          standard: '符合原厂技术规范',
          result: '正常',
          remarks: '',
        },
      ],
    });
  };

  const handleRemoveFormItemRow = (index: number) => {
    const newItems = recordFormData.items.filter((_, i) => i !== index);
    setRecordFormData({ ...recordFormData, items: newItems });
  };

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-slate-100 overflow-hidden text-slate-800 text-xs">
      {/* 1. 现代化顶部状态条与业务指示器 (与标本核收模块风格高度统一) */}
      <div className="bg-white border-b border-slate-200/90 px-4 py-2.5 flex items-center justify-between shrink-0 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm tracking-tight">
            <CalendarCheck className="w-4 h-4 text-sky-600" />
            <span>科室检查记录</span>
          </div>
          <span className="text-[11px] px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200 font-medium font-mono">
            ISO15189 检验仪器及环境运行核查台账
          </span>
        </div>

        {/* 右侧快捷操作与当前统计 */}
        <div className="flex items-center gap-4 text-xs text-slate-600">
          <div className="hidden md:flex items-center gap-2">
            <span className="text-slate-400">当前在控设备:</span>
            <span className="font-mono font-bold text-slate-900">{deviceList.length} 台</span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-400">总检查记录:</span>
            <span className="font-mono font-bold text-sky-700">{recordList.length} 条</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                triggerAction('正在重新同步设备巡检传感器与物联网状态...');
              }}
              className="px-2.5 py-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded border border-slate-200 flex items-center gap-1 transition-colors"
              title="刷新记录"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>刷新</span>
            </button>
            <button
              onClick={() => {
                triggerAction('已导出科室检查记录台账 (.xlsx) 至本地！');
              }}
              className="px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-700 rounded border border-slate-200 flex items-center gap-1 font-medium shadow-2xs transition-colors"
              title="导出当前台账"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>导出台账</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. 核心 3 栏交互式联动布局 (严格对应截图布局：左侧设备列表 -> 中间检查记录列表 -> 右侧检查项目列表) */}
      <div className="flex-1 min-h-0 p-3 grid grid-cols-12 gap-3 overflow-hidden">
        {/* ============================================================== */}
        {/* 左侧栏 (占 3.5/12 列): 使用部门筛选 + 设备编码/设备名称/使用部门表格 */}
        {/* ============================================================== */}
        <div className="col-span-12 lg:col-span-4 xl:col-span-3.5 bg-white rounded-xl border border-slate-200 flex flex-col min-h-0 shadow-2xs overflow-hidden">
          {/* 顶部部门筛选框 (还原截图上方的 使用部门 下拉框) */}
          <div className="p-3 border-b border-slate-200 bg-slate-50/70 space-y-2.5 shrink-0">
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-slate-700 whitespace-nowrap flex items-center gap-1 shrink-0">
                <Building2 className="w-3.5 h-3.5 text-sky-600" />
                <span>使用部门:</span>
              </label>
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="flex-1 px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs font-semibold text-slate-800 focus:outline-none focus:border-sky-500 cursor-pointer shadow-2xs"
              >
                {DEPARTMENT_OPTIONS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {/* 快捷搜索设备编码或名称 */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-400" />
              <input
                type="text"
                value={deviceSearchKeyword}
                onChange={(e) => setDeviceSearchKeyword(e.target.value)}
                placeholder="搜索设备编码、设备名称..."
                className="w-full pl-8 pr-3 py-1 bg-white border border-slate-200 rounded text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              />
              {deviceSearchKeyword && (
                <button
                  onClick={() => setDeviceSearchKeyword('')}
                  className="absolute right-2 top-1.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* 设备表格 (完全对应截图列名: 设备编码 | 设备名称 | 使用部门) */}
          <div className="flex-1 min-h-0 overflow-y-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead className="bg-slate-100/90 text-slate-700 font-semibold sticky top-0 border-b border-slate-200 z-10 shadow-2xs">
                <tr>
                  <th className="py-2 px-3 whitespace-nowrap">设备编码</th>
                  <th className="py-2 px-3 whitespace-nowrap">设备名称</th>
                  <th className="py-2 px-3 whitespace-nowrap text-right">使用部门</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDevices.map((dev) => {
                  const isSelected = dev.id === currentDevice?.id;
                  return (
                    <tr
                      key={dev.id}
                      onClick={() => setSelectedDeviceId(dev.id)}
                      className={`cursor-pointer transition-colors group ${
                        isSelected
                          ? 'bg-sky-50/90 font-medium text-sky-950 border-l-4 border-l-sky-600'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <td className="py-2.5 px-3 font-mono text-[11px] whitespace-nowrap font-semibold">
                        <span className={isSelected ? 'text-sky-700' : 'text-slate-600'}>
                          {dev.code}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="font-semibold text-slate-900 group-hover:text-sky-700 transition-colors">
                          {dev.name}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5 truncate max-w-[150px]">
                          {dev.model}
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-right whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[11px]">
                          {dev.department}
                        </span>
                      </td>
                    </tr>
                  );
                })}

                {filteredDevices.length === 0 && (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-slate-400">
                      暂无匹配的使用设备
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* 表格底部统计 */}
          <div className="p-2.5 border-t border-slate-200 bg-slate-50 text-[11px] text-slate-500 flex items-center justify-between shrink-0 font-mono">
            <span>合计: {filteredDevices.length} 条</span>
            <span className="text-sky-700 font-semibold">已选: {currentDevice?.name}</span>
          </div>
        </div>

        {/* ============================================================== */}
        {/* 中间栏 (占 4.5/12 列): 检查记录列表 (含“新增”按钮、任务日期、检查日期、检查者、部门、操作) */}
        {/* ============================================================== */}
        <div className="col-span-12 lg:col-span-4 xl:col-span-4.5 bg-white rounded-xl border border-slate-200 flex flex-col min-h-0 shadow-2xs overflow-hidden">
          {/* 中间栏顶部标题栏与“新增”按钮 (完全对应截图蓝色“检查记录列表”标题与右侧蓝色“新增”按钮) */}
          <div className="p-2.5 px-3.5 border-b border-slate-200 bg-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sky-700 text-xs flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5" />
                <span>检查记录列表</span>
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                ({currentDevice?.name || '全部设备'})
              </span>
            </div>

            {/* 截图关键蓝色“新增”按钮 */}
            <button
              onClick={handleOpenAddModal}
              className="px-3.5 py-1 bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white font-semibold rounded text-xs flex items-center gap-1 shadow-2xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>新增</span>
            </button>
          </div>

          {/* 中间表格：任务日期 | 检查日期 | 检查者 | 部门 | 操作 */}
          <div className="flex-1 min-h-0 overflow-y-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead className="bg-slate-100/90 text-slate-700 font-semibold sticky top-0 border-b border-slate-200 z-10 shadow-2xs">
                <tr>
                  <th className="py-2 px-3 whitespace-nowrap">任务日期</th>
                  <th className="py-2 px-3 whitespace-nowrap">检查日期</th>
                  <th className="py-2 px-3 whitespace-nowrap">检查者</th>
                  <th className="py-2 px-3 whitespace-nowrap">部门</th>
                  <th className="py-2 px-3 whitespace-nowrap text-center">状态</th>
                  <th className="py-2 px-3 whitespace-nowrap text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {deviceRecords.map((rec) => {
                  const isSelected = rec.id === currentRecord?.id;
                  return (
                    <tr
                      key={rec.id}
                      onClick={() => setSelectedRecordId(rec.id)}
                      className={`cursor-pointer transition-colors group ${
                        isSelected
                          ? 'bg-sky-50/90 font-medium text-sky-950 border-l-4 border-l-sky-600'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <td className="py-2.5 px-3 font-mono text-[11px] whitespace-nowrap font-medium text-slate-800">
                        {rec.taskDate}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[11px] whitespace-nowrap text-slate-600">
                        {rec.checkDate}
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span className="font-semibold text-slate-900 group-hover:text-sky-700">
                          {rec.checker}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span className="text-slate-600">{rec.department}</span>
                      </td>
                      <td className="py-2.5 px-3 text-center whitespace-nowrap">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                            rec.conclusion === '合格' || rec.conclusion === '正常'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {rec.conclusion}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2 text-[11px]">
                          <button
                            onClick={(e) => handleOpenEditModal(rec, e)}
                            className="text-sky-600 hover:text-sky-800 font-semibold transition-colors"
                            title="编辑此条记录"
                          >
                            编辑
                          </button>
                          <button
                            onClick={(e) => handleOpenDeleteModal(rec, e)}
                            className="text-rose-600 hover:text-rose-800 font-semibold transition-colors"
                            title="删除此条记录"
                          >
                            删除
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {deviceRecords.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400">
                      <div className="space-y-2">
                        <p>该设备暂无检查记录</p>
                        <button
                          onClick={handleOpenAddModal}
                          className="px-3 py-1 bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 rounded text-xs font-semibold inline-flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>立即新增第一条记录</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* 表格底部统计 */}
          <div className="p-2.5 border-t border-slate-200 bg-slate-50 text-[11px] text-slate-500 flex items-center justify-between shrink-0 font-mono">
            <span>合计: {deviceRecords.length} 条</span>
            <span className="text-slate-500">
              {currentRecord ? `当前选中: ${currentRecord.taskDate} (${currentRecord.checker})` : '未选择'}
            </span>
          </div>
        </div>

        {/* ============================================================== */}
        {/* 右侧栏 (占 4/12 列): 检查项目列表 (检查项 | 检查值 | 标准要求 | 判定) */}
        {/* ============================================================== */}
        <div className="col-span-12 lg:col-span-4 xl:col-span-4 bg-white rounded-xl border border-slate-200 flex flex-col min-h-0 shadow-2xs overflow-hidden">
          {/* 右侧栏顶部标题栏 (对应截图蓝色“检查项目列表”标题) */}
          <div className="p-2.5 px-3.5 border-b border-slate-200 bg-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sky-700 text-xs flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>检查项目列表</span>
              </span>
              {currentRecord && (
                <span className="text-[11px] text-slate-500 font-mono">
                  [{currentRecord.taskDate} · {currentRecord.checker}]
                </span>
              )}
            </div>

            {currentRecord && (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleOpenEditModal(currentRecord)}
                  className="px-2 py-0.5 text-sky-700 hover:bg-sky-50 border border-sky-200 rounded text-[11px] font-semibold flex items-center gap-1"
                  title="快捷编辑检查数值"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>修改数值</span>
                </button>
              </div>
            )}
          </div>

          {/* 检查项目表格：检查项 | 检查值 | 标准要求 | 判定结论 */}
          <div className="flex-1 min-h-0 overflow-y-auto">
            {currentRecord ? (
              <table className="w-full border-collapse text-left text-xs">
                <thead className="bg-slate-100/90 text-slate-700 font-semibold sticky top-0 border-b border-slate-200 z-10 shadow-2xs">
                  <tr>
                    <th className="py-2 px-3 whitespace-nowrap">检查项</th>
                    <th className="py-2 px-3 whitespace-nowrap">检查值</th>
                    <th className="py-2 px-3 whitespace-nowrap">标准要求</th>
                    <th className="py-2 px-3 whitespace-nowrap text-right">判定</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentRecord.items.map((item, idx) => (
                    <tr key={item.id || idx} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2.5 px-3">
                        <div className="font-semibold text-slate-900">{item.itemName}</div>
                        {item.remarks && (
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            {item.remarks}
                          </div>
                        )}
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-sky-800 whitespace-nowrap">
                        {item.checkValue}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                        {item.standard}
                      </td>
                      <td className="py-2.5 px-3 text-right whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                            item.result === '正常' || item.result === '合格'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          <Check className="w-3 h-3" />
                          <span>{item.result}</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center text-slate-400 space-y-2">
                <p>请在左侧或中间列表选择一条具体的检查记录</p>
                <p className="text-[11px]">右侧将实时展现该次检查所有技术参数项与测量值</p>
              </div>
            )}
          </div>

          {/* 右侧底部栏：记录备忘与审核印章 */}
          {currentRecord && (
            <div className="p-2.5 px-3.5 border-t border-slate-200 bg-slate-50 text-[11px] text-slate-600 flex items-center justify-between shrink-0 font-sans">
              <div className="truncate max-w-[280px]">
                <span className="font-semibold text-slate-700">巡检备注: </span>
                <span>{currentRecord.notes || '符合原厂技术规范'}</span>
              </div>
              <span className="font-mono text-emerald-700 font-bold shrink-0">
                完成率 100% · 在控
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ============================================================== */}
      {/* 弹窗 1: 新增检查记录 弹窗 */}
      {/* ============================================================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-scaleIn">
            <div className="bg-sky-700 text-white px-5 py-3.5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-sky-200" />
                <h3 className="font-bold text-sm">新增科室设备检查记录</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-sky-200 hover:text-white rounded transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNewRecord} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
              {/* 基本信息网格 */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">被查设备 *</label>
                  <select
                    value={recordFormData.deviceId}
                    onChange={(e) => {
                      const dev = deviceList.find((d) => d.id === e.target.value);
                      if (dev) {
                        setRecordFormData({
                          ...recordFormData,
                          deviceId: dev.id,
                          department: dev.department,
                        });
                      }
                    }}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded font-semibold text-slate-900"
                  >
                    {deviceList.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.code} - {d.name} ({d.department})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">使用部门</label>
                  <input
                    type="text"
                    disabled
                    value={recordFormData.department}
                    className="w-full px-3 py-1.5 bg-slate-100 border border-slate-300 rounded font-semibold text-slate-600"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">任务日期 *</label>
                  <input
                    type="date"
                    required
                    value={recordFormData.taskDate}
                    onChange={(e) => setRecordFormData({ ...recordFormData, taskDate: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded font-mono font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">实际检查时间 *</label>
                  <input
                    type="text"
                    required
                    value={recordFormData.checkDate}
                    onChange={(e) => setRecordFormData({ ...recordFormData, checkDate: e.target.value })}
                    placeholder="如: 2026-10-30 08:30"
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded font-mono font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">检查者 (真实医技人员) *</label>
                  <select
                    value={recordFormData.checker}
                    onChange={(e) => setRecordFormData({ ...recordFormData, checker: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded font-semibold text-slate-900"
                  >
                    {LAB_STAFF_LIST.map((staff) => (
                      <option key={staff.name} value={staff.name}>
                        {staff.name} ({staff.title} · {staff.dept})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">整体检查结论 *</label>
                  <select
                    value={recordFormData.conclusion}
                    onChange={(e) =>
                      setRecordFormData({
                        ...recordFormData,
                        conclusion: e.target.value as DepartmentCheckRecord['conclusion'],
                      })
                    }
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded font-semibold text-emerald-800"
                  >
                    <option value="合格">合格</option>
                    <option value="正常">正常</option>
                    <option value="轻微偏差">轻微偏差</option>
                    <option value="需整改">需整改</option>
                  </select>
                </div>
              </div>

              {/* 检查项目录入子表 */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-sky-600" />
                    <span>检查项目与测量实测值</span>
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddFormItemRow}
                    className="px-2 py-0.5 bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 rounded text-xs font-semibold flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>添加一行检查项</span>
                  </button>
                </div>

                <div className="border border-slate-200 rounded-lg overflow-hidden shadow-2xs">
                  <table className="w-full border-collapse text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="py-2 px-2.5">检查项目名称</th>
                        <th className="py-2 px-2.5 w-36">实测检查值</th>
                        <th className="py-2 px-2.5 w-36">标准范围/要求</th>
                        <th className="py-2 px-2.5 w-24">判定</th>
                        <th className="py-2 px-2 text-center w-12">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {recordFormData.items.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="p-1.5 px-2.5">
                            <input
                              type="text"
                              value={item.itemName}
                              onChange={(e) => handleUpdateFormItem(idx, 'itemName', e.target.value)}
                              className="w-full px-2 py-1 border border-slate-200 rounded font-medium"
                            />
                          </td>
                          <td className="p-1.5 px-2.5">
                            <input
                              type="text"
                              value={item.checkValue}
                              onChange={(e) => handleUpdateFormItem(idx, 'checkValue', e.target.value)}
                              className="w-full px-2 py-1 border border-slate-200 rounded font-mono font-bold text-sky-700"
                            />
                          </td>
                          <td className="p-1.5 px-2.5">
                            <input
                              type="text"
                              value={item.standard}
                              onChange={(e) => handleUpdateFormItem(idx, 'standard', e.target.value)}
                              className="w-full px-2 py-1 border border-slate-200 rounded font-mono text-slate-600 text-[11px]"
                            />
                          </td>
                          <td className="p-1.5 px-2.5">
                            <select
                              value={item.result}
                              onChange={(e) => handleUpdateFormItem(idx, 'result', e.target.value)}
                              className="w-full px-1.5 py-1 border border-slate-200 rounded font-semibold text-emerald-800"
                            >
                              <option value="正常">正常</option>
                              <option value="合格">合格</option>
                              <option value="轻微偏差">轻微偏差</option>
                              <option value="异常">异常</option>
                            </select>
                          </td>
                          <td className="p-1.5 px-2 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveFormItemRow(idx)}
                              className="text-slate-400 hover:text-rose-600 transition-colors"
                              title="删除此项"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 巡检备忘说明 */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  巡检备注 / 故障及异常处置情况
                </label>
                <textarea
                  rows={2}
                  value={recordFormData.notes}
                  onChange={(e) => setRecordFormData({ ...recordFormData, notes: e.target.value })}
                  placeholder="如有零件更换、报警清除或复核说明，请在此注明..."
                  className="w-full px-3 py-1.5 border border-slate-300 rounded font-normal text-slate-800"
                ></textarea>
              </div>

              {/* 弹窗底部操作按钮 */}
              <div className="bg-slate-50 -mx-5 -mb-5 px-5 py-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-semibold transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
                >
                  <Check className="w-4 h-4" />
                  <span>保存检查记录</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 弹窗 2: 编辑检查记录 弹窗 */}
      {/* ============================================================== */}
      {isEditModalOpen && editingRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-scaleIn">
            <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-sky-400" />
                <h3 className="font-bold text-sm">
                  编辑检查记录 - {editingRecord.deviceName} ({editingRecord.taskDate})
                </h3>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditRecord} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">任务日期</label>
                  <input
                    type="date"
                    required
                    value={recordFormData.taskDate}
                    onChange={(e) => setRecordFormData({ ...recordFormData, taskDate: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded font-mono font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">检查时间</label>
                  <input
                    type="text"
                    required
                    value={recordFormData.checkDate}
                    onChange={(e) => setRecordFormData({ ...recordFormData, checkDate: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded font-mono font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">检查者</label>
                  <select
                    value={recordFormData.checker}
                    onChange={(e) => setRecordFormData({ ...recordFormData, checker: e.target.value })}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded font-semibold text-slate-900"
                  >
                    {LAB_STAFF_LIST.map((staff) => (
                      <option key={staff.name} value={staff.name}>
                        {staff.name} ({staff.title})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">综合结论</label>
                  <select
                    value={recordFormData.conclusion}
                    onChange={(e) =>
                      setRecordFormData({
                        ...recordFormData,
                        conclusion: e.target.value as DepartmentCheckRecord['conclusion'],
                      })
                    }
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded font-semibold text-emerald-800"
                  >
                    <option value="合格">合格</option>
                    <option value="正常">正常</option>
                    <option value="轻微偏差">轻微偏差</option>
                    <option value="需整改">需整改</option>
                  </select>
                </div>
              </div>

              {/* 检查项目表格 */}
              <div>
                <h4 className="font-bold text-slate-900 mb-2">检查项目实测值与判定</h4>
                <div className="border border-slate-200 rounded-lg overflow-hidden shadow-2xs">
                  <table className="w-full border-collapse text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="py-2 px-2.5">检查项目</th>
                        <th className="py-2 px-2.5 w-36">实测检查值</th>
                        <th className="py-2 px-2.5 w-36">标准要求</th>
                        <th className="py-2 px-2.5 w-24">判定</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {recordFormData.items.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="p-1.5 px-2.5 font-medium">{item.itemName}</td>
                          <td className="p-1.5 px-2.5">
                            <input
                              type="text"
                              value={item.checkValue}
                              onChange={(e) => handleUpdateFormItem(idx, 'checkValue', e.target.value)}
                              className="w-full px-2 py-1 border border-slate-200 rounded font-mono font-bold text-sky-700"
                            />
                          </td>
                          <td className="p-1.5 px-2.5 font-mono text-[11px] text-slate-500">
                            {item.standard}
                          </td>
                          <td className="p-1.5 px-2.5">
                            <select
                              value={item.result}
                              onChange={(e) => handleUpdateFormItem(idx, 'result', e.target.value)}
                              className="w-full px-1.5 py-1 border border-slate-200 rounded font-semibold text-emerald-800"
                            >
                              <option value="正常">正常</option>
                              <option value="合格">合格</option>
                              <option value="轻微偏差">轻微偏差</option>
                              <option value="异常">异常</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">备注说明</label>
                <textarea
                  rows={2}
                  value={recordFormData.notes}
                  onChange={(e) => setRecordFormData({ ...recordFormData, notes: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded font-normal"
                ></textarea>
              </div>

              <div className="bg-slate-50 -mx-5 -mb-5 px-5 py-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-semibold"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded font-semibold shadow-xs flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>保存修改</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 弹窗 3: 删除检查记录 确认弹窗 */}
      {/* ============================================================== */}
      {isDeleteModalOpen && deletingRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-scaleIn">
            <div className="bg-rose-600 text-white px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-white" />
                <h3 className="font-bold text-sm">确认删除设备检查记录</h3>
              </div>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="p-1 text-rose-100 hover:text-white rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-3 text-xs">
              <p className="text-slate-700 leading-relaxed">
                您确定要删除以下科室检查记录吗？该操作将从检验仪器管理台账中永久清除该次巡检数据：
              </p>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1 font-mono text-[11px]">
                <div><span className="text-slate-400">被查设备:</span> <span className="font-bold text-slate-800">{deletingRecord.deviceName} ({deletingRecord.deviceCode})</span></div>
                <div><span className="text-slate-400">任务日期:</span> <span className="text-slate-800">{deletingRecord.taskDate}</span></div>
                <div><span className="text-slate-400">检查人员:</span> <span className="font-bold text-sky-700">{deletingRecord.checker}</span></div>
                <div><span className="text-slate-400">包含检查项:</span> <span className="text-slate-800">{deletingRecord.items.length} 个技术指标</span></div>
              </div>
              <div className="bg-slate-50 -mx-5 -mb-5 px-5 py-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-semibold"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded font-semibold shadow-xs"
                >
                  确认删除
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
