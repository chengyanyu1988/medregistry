import React, { useState, useMemo } from 'react';
import {
  User as Users,
  CalendarCheck as Calendar,
  Clock,
  FileText,
  Sliders,
  SlidersHorizontal as Wrench,
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Download,
  FileText as ClipboardList,
  FolderOpen,
  FileCheck,
  X,
  RefreshCw,
  Sparkles,
  BookOpen,
  Check,
  Ban as Power,
  HelpCircle as Info,
  UserCheck,
  QrCode,
  Building2,
  Layers,
  Activity,
  Printer,
  Eye,
  FileSpreadsheet,
  RotateCcw,
  Save,
  Send,
  ChevronLeft,
  ChevronRight,
  Folder,
  ChevronDown,
  Upload,
  FileDown
} from './MenuIcon';
import { UserProfile } from '../types/navigation';
import { DepartmentInspectionRecordView } from './DepartmentInspectionRecordView';
import { SpecimenManagementView } from './SpecimenManagementView';
import { ReportQueryCenterView } from './report/ReportQueryCenterView';
import { StaffSchedulingWeekView } from './StaffSchedulingWeekView';

interface DepartmentManagementViewProps {
  subId?: string;
  user: UserProfile;
  triggerAction: (msg: string) => void;
  onSelectSubMenu?: (subId: string) => void;
}

// 1. 排班班次定义数据接口
interface ShiftDefinition {
  id: string;
  code: string;
  name: string;
  timeSlot: string;
  duration: string;
  allowance: string;
  department: string;
  creator: string;
  updateTime: string;
  status: '启用' | '停用';
  description: string;
}

// 2. 人员档案详细数据接口 (10 个页签)
interface StaffProfile {
  id: string;
  code: string;
  name: string;
  gender: '男' | '女';
  nation: string;
  birthDate: string;
  idCard: string;
  department: string;
  title: string;
  titleLevel: string;
  phone: string;
  address: string;
  status: '在岗' | '轮休' | '请假';
  
  basicInfo: {
    politicalStatus: string;
    educationLevel: string;
    school: string;
    major: string;
    certNo: string;
    certExpiry: string;
  };
  tenureList: Array<{
    unit: string;
    department: string;
    startDate: string;
    endDate: string;
    position: string;
  }>;
  educationList: Array<{
    institution: string;
    major: string;
    startDate: string;
    endDate: string;
    degree: string;
  }>;
  teachingList: Array<{
    institution: string;
    specialty: string;
    startDate: string;
    endDate: string;
    course: string;
  }>;
  paperList: Array<{
    journal: string;
    publishDate: string;
    title: string;
    award: string;
  }>;
  workHistory: Array<{
    unit: string;
    department: string;
    startDate: string;
    endDate: string;
    position: string;
  }>;
  titleHistory: Array<{
    title: string;
    level: string;
    obtainDate: string;
    certNo: string;
  }>;
  researchList: Array<{
    projectName: string;
    startDate: string;
    endDate: string;
    award: string;
    role: string;
  }>;
  awardList: Array<{
    category: string;
    date: string;
    description: string;
  }>;
  healthList: Array<{
    checkDate: string;
    item: string;
    result: string;
  }>;
}

// 3. 科室文档分类结构
interface DocCategory {
  id: string;
  label: string;
  parentId: string | null;
}

// 4. 科室受控文档数据接口
interface DocItem {
  id: string;
  categoryId: string;
  categoryName: string;
  title: string;
  version: string;
  attachment: string;
  attachmentSize: string;
  operator: string;
  updateTime: string;
  status: '现行生效' | '审阅中' | '废止';
  summary: string;
}

// 5. 设备检查规则数据接口
interface CheckTypeDetailItem {
  id: string;
  itemName: string;
  itemType: '数值型' | '选择型' | '布尔型' | '文本型';
  optionValues: string;
  defaultValue: string;
  required: '是' | '否';
}

interface DeviceCheckType {
  id: string;
  typeName: string;
  cycle: '日检' | '周检' | '月检' | '季检';
  checkTime: string;
  responsible: string;
  status: '启用' | '停用';
  items: CheckTypeDetailItem[];
}

interface DeviceRuleItem {
  id: string;
  code: string;
  name: string;
  department: string;
  responsible: string;
  lastCheckTime: string;
  status: '启用' | '维护中' | '停用';
  checkTypes: DeviceCheckType[];
}

// 6. 设备/科室检查计划数据接口
export interface DevicePlanCheckItem {
  id: string;
  name: string;
  standard: string;
  isKeyItem: boolean;
}

export interface DevicePlanItem {
  id: string;
  code: string;
  title: string;
  deviceId: string;
  deviceName: string;
  deviceCode: string;
  department: string;
  planType: '月度检查计划' | '季度保养计划' | '周度维护计划' | '日度巡检计划' | '特别维护计划';
  scheduledDate: string; // YYYY-MM-DD
  timeSlot: string; // 08:30~10:30
  cycle: string; // 每月一次 / 每季度一次 / 每周一次 / 每日一次
  responsible: string; // 真实临床/维护人员
  reviewer: string; // 审核人
  priority: '普通' | '高' | '紧急';
  status: '待执行' | '进行中' | '已完成' | '超期预警';
  items: DevicePlanCheckItem[];
  remarks?: string;
  completedAt?: string;
  completedBy?: string;
}

export const DepartmentManagementView: React.FC<DepartmentManagementViewProps> = ({
  subId = 'dept-shift-def',
  user,
  triggerAction,
  onSelectSubMenu,
}) => {
  const [activeTab, setActiveTab] = useState<string>(
    subId === 'dept-staff-schedule-week' ? 'dept-staff-schedule' : (subId || 'dept-shift-def')
  );

  React.useEffect(() => {
    if (subId) {
      if (subId === 'dept-staff-schedule-week') {
        setActiveTab('dept-staff-schedule');
        setScheduleViewMode('week');
      } else {
        setActiveTab(subId);
      }
    }
  }, [subId]);

  // =============================================================
  // TAB 1: 排班班次定义 State
  // =============================================================
  const [shifts, setShifts] = useState<ShiftDefinition[]>([
    {
      id: 'SF-001',
      code: '01',
      name: '白班 (常规检测)',
      timeSlot: '08:00~17:00',
      duration: '8.0h',
      allowance: '0元',
      department: '生化/免疫/临检常规组',
      creator: '张建华 (主任医师)',
      updateTime: '2026-10-28 09:30',
      status: '启用',
      description: '负责日常常规标本处理、仪器维护及报告一审发单',
    },
    {
      id: 'SF-002',
      code: '02',
      name: '早班 (门诊抽血与急查)',
      timeSlot: '07:30~15:30',
      duration: '7.5h',
      allowance: '20元',
      department: '门诊采血处 & 急查岗位',
      creator: '王雪梅 (副主任检验师)',
      updateTime: '2026-10-29 11:15',
      status: '启用',
      description: '负责早高峰门诊采血、急诊标本接收与快速检验',
    },
    {
      id: 'SF-003',
      code: '03',
      name: '中班 (临检发单与质控)',
      timeSlot: '15:30~23:00',
      duration: '7.0h',
      allowance: '40元',
      department: '临床检验与质控组',
      creator: '陈志远 (主管检验师)',
      updateTime: '2026-10-29 16:20',
      status: '启用',
      description: '承接下午及初夜标本检测，运行日常质控与仪器清洗',
    },
    {
      id: 'SF-004',
      code: '04',
      name: '小夜班 (晚间急诊通道)',
      timeSlot: '17:30~23:30',
      duration: '6.0h',
      allowance: '60元',
      department: '急诊检验与危急值专岗',
      creator: '李静 (主管检验师)',
      updateTime: '2026-10-30 08:10',
      status: '启用',
      description: '保障晚间急诊全项目快速响应与危急值双核对通报',
    },
    {
      id: 'SF-005',
      code: '05',
      name: '大夜班 (深夜危急值响应)',
      timeSlot: '23:30~08:00 (次日)',
      duration: '8.5h',
      allowance: '120元',
      department: '全科通宵夜班岗位',
      creator: '刘洋 (检验医师)',
      updateTime: '2026-10-30 08:30',
      status: '启用',
      description: '通宵全科急诊保障、血培养质谱打靶及次日清晨开机自检',
    },
    {
      id: 'SF-006',
      code: '06',
      name: '微生物培养班',
      timeSlot: '08:00~12:00, 14:00~17:30',
      duration: '7.5h',
      allowance: '25元',
      department: '微生物检验组',
      creator: '郭海平 (主管检验师)',
      updateTime: '2026-10-27 14:50',
      status: '启用',
      description: '负责细菌培养接种、药敏实验阅读及MALDI-TOF质谱鉴定',
    },
    {
      id: 'SF-007',
      code: '07',
      name: '行政与质量管理班',
      timeSlot: '08:30~17:00',
      duration: '8.0h',
      allowance: '0元',
      department: '科室行政与ISO15189质控',
      creator: '赵敏 (副主任检验师)',
      updateTime: '2026-10-25 10:00',
      status: '停用',
      description: '负责科室文档归档、试剂耗材盘点与室间质评数据整理',
    },
  ]);

  const [shiftSearchName, setShiftSearchName] = useState<string>('');
  const [shiftSearchStatus, setShiftSearchStatus] = useState<string>('全部');
  const [shiftGroupFilter, setShiftGroupFilter] = useState<string>('全部');

  const [isShiftAddModalOpen, setIsShiftAddModalOpen] = useState<boolean>(false);
  const [isShiftEditModalOpen, setIsShiftEditModalOpen] = useState<boolean>(false);
  const [editingShift, setEditingShift] = useState<ShiftDefinition | null>(null);
  const [deletingShift, setDeletingShift] = useState<ShiftDefinition | null>(null);
  const [selectedShiftForDetail, setSelectedShiftForDetail] = useState<ShiftDefinition | null>(null);
  const [isShiftDetailModalOpen, setIsShiftDetailModalOpen] = useState<boolean>(false);

  const [shiftFormData, setShiftFormData] = useState({
    code: '',
    name: '',
    timeSlot: '08:00~17:00',
    duration: '8.0h',
    allowance: '0元',
    department: '生化/免疫常规组',
    creator: user?.name || '张建华 (主任医师)',
    status: '启用' as '启用' | '停用',
    description: '',
  });

  const filteredShifts = useMemo(() => {
    return shifts.filter((s) => {
      const matchName =
        !shiftSearchName.trim() ||
        s.name.toLowerCase().includes(shiftSearchName.trim().toLowerCase()) ||
        s.code.toLowerCase().includes(shiftSearchName.trim().toLowerCase()) ||
        s.department.toLowerCase().includes(shiftSearchName.trim().toLowerCase());
      const matchStatus =
        shiftSearchStatus === '全部' || s.status === shiftSearchStatus;
      const matchGroup =
        shiftGroupFilter === '全部' || s.department.includes(shiftGroupFilter);
      return matchName && matchStatus && matchGroup;
    });
  }, [shifts, shiftSearchName, shiftSearchStatus, shiftGroupFilter]);

  const handleOpenAddShift = () => {
    const nextCodeNum = String(shifts.length + 1).padStart(2, '0');
    setShiftFormData({
      code: nextCodeNum,
      name: '',
      timeSlot: '08:00~17:00',
      duration: '8.0h',
      allowance: '0元',
      department: '生化/免疫常规组',
      creator: '张建华 (主任医师)',
      status: '启用',
      description: '',
    });
    setIsShiftAddModalOpen(true);
  };

  const handleSaveNewShift = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shiftFormData.name.trim()) {
      triggerAction('请输入班次名称！');
      return;
    }
    const newShiftItem: ShiftDefinition = {
      id: `SF-00${shifts.length + 1}`,
      code: shiftFormData.code || String(shifts.length + 1).padStart(2, '0'),
      name: shiftFormData.name.trim(),
      timeSlot: shiftFormData.timeSlot || '08:00~17:00',
      duration: shiftFormData.duration || '8.0h',
      allowance: shiftFormData.allowance || '0元',
      department: shiftFormData.department || '检验科全岗',
      creator: shiftFormData.creator || '张建华 (主任医师)',
      updateTime: '2026-10-30 08:45',
      status: shiftFormData.status,
      description: shiftFormData.description || '无特殊备注',
    };
    setShifts([newShiftItem, ...shifts]);
    setIsShiftAddModalOpen(false);
    triggerAction(`新增排班班次《${newShiftItem.name}》成功！`);
  };

  const handleOpenEditShift = (shift: ShiftDefinition) => {
    setEditingShift(shift);
    setShiftFormData({
      code: shift.code,
      name: shift.name,
      timeSlot: shift.timeSlot,
      duration: shift.duration,
      allowance: shift.allowance,
      department: shift.department,
      creator: shift.creator,
      status: shift.status,
      description: shift.description,
    });
    setIsShiftEditModalOpen(true);
  };

  const handleUpdateShift = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingShift) return;
    if (!shiftFormData.name.trim()) {
      triggerAction('班次名称不能为空！');
      return;
    }
    setShifts(
      shifts.map((item) =>
        item.id === editingShift.id
          ? {
              ...item,
              code: shiftFormData.code,
              name: shiftFormData.name.trim(),
              timeSlot: shiftFormData.timeSlot,
              duration: shiftFormData.duration,
              allowance: shiftFormData.allowance,
              department: shiftFormData.department,
              creator: shiftFormData.creator,
              status: shiftFormData.status,
              description: shiftFormData.description,
              updateTime: '2026-10-30 08:50',
            }
          : item
      )
    );
    setIsShiftEditModalOpen(false);
    setEditingShift(null);
    triggerAction(`更新排班班次《${shiftFormData.name}》成功！`);
  };

  const handleToggleShiftStatus = (shift: ShiftDefinition) => {
    const nextStatus = shift.status === '启用' ? '停用' : '启用';
    setShifts(
      shifts.map((s) => (s.id === shift.id ? { ...s, status: nextStatus, updateTime: '2026-10-30 08:52' } : s))
    );
    triggerAction(`班次《${shift.name}》状态已切换为: ${nextStatus}`);
  };

  const handleConfirmDeleteShift = () => {
    if (!deletingShift) return;
    setShifts(shifts.filter((s) => s.id !== deletingShift.id));
    triggerAction(`排班班次《${deletingShift.name}》已被彻底删除！`);
    setDeletingShift(null);
  };

  // =============================================================
  // TAB 2: 人员档案管理 State
  // =============================================================
  const [staffList, setStaffList] = useState<StaffProfile[]>([
    {
      id: 'STF-101',
      code: 'STF001',
      name: '张建华',
      gender: '男',
      nation: '汉族',
      birthDate: '1982-05-18',
      idCard: '11010819820518231X',
      department: '检验科 (质控与行政组)',
      title: '主任检验师',
      titleLevel: '正高级',
      phone: '13811223344',
      address: '北京市朝阳区健康大道108号院3号楼',
      status: '在岗',
      basicInfo: {
        politicalStatus: '中共党员',
        educationLevel: '博士研究生',
        school: '北京大学医学部',
        major: '临床检验诊断学',
        certNo: '2012030012',
        certExpiry: '2030-10-15',
      },
      tenureList: [
        { unit: '市中心医院', department: '检验医学科', startDate: '2018-07-01', endDate: '至今', position: '科室主任 / 主任检验师' },
        { unit: '市第一人民医院', department: '检验科生化室', startDate: '2010-08-01', endDate: '2018-06-30', position: '专业组长 / 副主任检验师' },
      ],
      educationList: [
        { institution: '北京大学医学部', major: '临床检验诊断学', startDate: '2005-09-01', endDate: '2010-07-01', degree: '医学博士' },
        { institution: '首都医科大学', major: '医学检验专业', startDate: '2000-09-01', endDate: '2005-07-01', degree: '医学学士' },
      ],
      teachingList: [
        { institution: '市医科大学', specialty: '临床生物化学检验', startDate: '2021-09-01', endDate: '2026-07-01', course: '高级临床检验诊断学带教 (硕士生导师)' },
      ],
      paperList: [
        { journal: '中华检验医学杂志', publishDate: '2025-11-10', title: '全自动化流水线在临床生化质量控制与危急值通报中的评价', award: '优秀论文一等奖' },
        { journal: 'Clinical Chemistry and Lab Medicine', publishDate: '2024-05-18', title: 'Evaluation of automated multi-analyzer track systems', award: 'SCI收录 (IF=4.8)' },
      ],
      workHistory: [
        { unit: '市中心医院', department: '检验医学科', startDate: '2018-07-01', endDate: '至今', position: '科主任 / 学科带头人' },
        { unit: '市第一人民医院', department: '检验科', startDate: '2010-08-01', endDate: '2018-06-30', position: '生化组长' },
      ],
      titleHistory: [
        { title: '主任检验师', level: '正高级', obtainDate: '2020-12-15', certNo: 'ZG20200912' },
        { title: '副主任检验师', level: '副高级', obtainDate: '2015-11-20', certNo: 'FG20150821' },
      ],
      researchList: [
        { projectName: '基于质谱技术的血培养快速耐药菌株识别与质控规范攻关', startDate: '2023-01-01', endDate: '2025-12-31', award: '省医药卫生科技进步二等奖', role: '课题负责人' },
      ],
      awardList: [
        { category: '市级表彰', date: '2025-08-19', description: '全国优秀医师奖暨临床检验质量先锋人物' },
      ],
      healthList: [
        { checkDate: '2026-09-15', item: '年度职业健康体检', result: '各项指标未见异常，无职业禁忌证' },
      ],
    },
    {
      id: 'STF-102',
      code: 'STF002',
      name: '王雪梅',
      gender: '女',
      nation: '汉族',
      birthDate: '1988-09-12',
      idCard: '110105198809124422',
      department: '检验科 (门诊与采血组)',
      title: '副主任检验师',
      titleLevel: '副高级',
      phone: '13955667788',
      address: '北京市海淀区中关村南大街52号',
      status: '在岗',
      basicInfo: {
        politicalStatus: '中共党员',
        educationLevel: '硕士研究生',
        school: '四川大学华西医学中心',
        major: '医学检验学',
        certNo: '2015091244',
        certExpiry: '2028-06-30',
      },
      tenureList: [
        { unit: '市中心医院', department: '检验科门诊组', startDate: '2020-03-01', endDate: '至今', position: '门诊采血与急查组长' },
      ],
      educationList: [
        { institution: '四川大学华西医学中心', major: '医学检验学', startDate: '2010-09-01', endDate: '2013-07-01', degree: '医学硕士' },
      ],
      teachingList: [
        { institution: '市护理学院', specialty: '临床标本采集规范', startDate: '2023-03-01', endDate: '2026-06-30', course: '静脉采血与标本溶血防范' },
      ],
      paperList: [
        { journal: '临床检验杂志', publishDate: '2025-06-20', title: '门诊智能排队采血系统与条码闭环核收的效率提升研究', award: '优秀临床研究奖' },
      ],
      workHistory: [
        { unit: '市中心医院', department: '检验科', startDate: '2013-08-01', endDate: '至今', position: '副主任检验师' },
      ],
      titleHistory: [
        { title: '副主任检验师', level: '副高级', obtainDate: '2021-11-10', certNo: 'FG20211102' },
      ],
      researchList: [
        { projectName: '门诊真空采血管溶血与凝块智能光学视觉识别算法研发', startDate: '2024-01-01', endDate: '2026-12-31', award: '院级青年科研基金', role: '课题骨干' },
      ],
      awardList: [
        { category: '院级表彰', date: '2025-12-30', description: '2025年度门诊优质服务标兵' },
      ],
      healthList: [
        { checkDate: '2026-09-15', item: '年度职业健康体检', result: '健康良好，乙肝抗体阳性强保护' },
      ],
    },
    {
      id: 'STF-103',
      code: 'STF003',
      name: '陈志远',
      gender: '男',
      nation: '汉族',
      birthDate: '1986-03-24',
      idCard: '110108198603241519',
      department: '检验科 (临床生化组)',
      title: '主管检验师',
      titleLevel: '中级',
      phone: '13788996655',
      address: '北京市朝阳区北苑路甲18号院',
      status: '在岗',
      basicInfo: {
        politicalStatus: '共青团员',
        educationLevel: '大学本科',
        school: '天津医科大学',
        major: '医学检验技术',
        certNo: '2014032419',
        certExpiry: '2029-12-31',
      },
      tenureList: [
        { unit: '市中心医院', department: '临床生化室', startDate: '2019-05-01', endDate: '至今', position: '生化流水线主管 / 设备专管员' },
      ],
      educationList: [
        { institution: '天津医科大学', major: '医学检验技术', startDate: '2005-09-01', endDate: '2009-07-01', degree: '理学学士' },
      ],
      teachingList: [
        { institution: '市中心医院规培基地', specialty: '临床生化学', startDate: '2022-09-01', endDate: '2026-09-01', course: 'Cobas8000生化仪保养与定标实操' },
      ],
      paperList: [
        { journal: '标记免疫分析与临床', publishDate: '2025-04-12', title: '血清高敏肌钙蛋白I室内质控变异系数及六西格玛评价', award: '科室优秀论文' },
      ],
      workHistory: [
        { unit: '市中心医院', department: '检验科', startDate: '2009-08-01', endDate: '至今', position: '主管检验师' },
      ],
      titleHistory: [
        { title: '主管检验师', level: '中级', obtainDate: '2017-05-20', certNo: 'ZJ20170588' },
      ],
      researchList: [
        { projectName: '临床急诊生化项目日间与日内精密度验证规范制定', startDate: '2024-03-01', endDate: '2025-10-31', award: '科室质控创新成果', role: '主要参与人' },
      ],
      awardList: [
        { category: '院级表彰', date: '2025-05-12', description: '优秀医技带教老师' },
      ],
      healthList: [
        { checkDate: '2026-09-15', item: '年度职业健康体检', result: '合格正常' },
      ],
    },
    {
      id: 'STF-104',
      code: 'STF004',
      name: '郭海平',
      gender: '男',
      nation: '汉族',
      birthDate: '1984-11-05',
      idCard: '110102198411053218',
      department: '检验科 (微生物检验组)',
      title: '主管检验师',
      titleLevel: '中级',
      phone: '13666778899',
      address: '北京市西城区月坛南街6号院',
      status: '在岗',
      basicInfo: {
        politicalStatus: '中共党员',
        educationLevel: '大学本科',
        school: '哈尔滨医科大学',
        major: '医学检验专业',
        certNo: '2013110518',
        certExpiry: '2029-05-20',
      },
      tenureList: [
        { unit: '市中心医院', department: '微生物检验室', startDate: '2016-01-01', endDate: '至今', position: '微生物组长 / 院感菌株监控专员' },
      ],
      educationList: [
        { institution: '哈尔滨医科大学', major: '医学检验', startDate: '2003-09-01', endDate: '2008-07-01', degree: '医学学士' },
      ],
      teachingList: [
        { institution: '市医学院', specialty: '临床微生物学与检验', startDate: '2023-09-01', endDate: '2026-06-30', course: 'MALDI-TOF质谱打靶与耐药表型判读' },
      ],
      paperList: [
        { journal: '中华医院感染学杂志', publishDate: '2025-08-15', title: 'ICU碳青霉烯耐药鲍曼不动杆菌同源性分析及耐药基因检测', award: '三等奖' },
      ],
      workHistory: [
        { unit: '市中心医院', department: '检验科微生物组', startDate: '2008-08-01', endDate: '至今', position: '主管检验师' },
      ],
      titleHistory: [
        { title: '主管检验师', level: '中级', obtainDate: '2016-05-18', certNo: 'ZJ20160520' },
      ],
      researchList: [
        { projectName: '多重耐药菌早期筛查质谱快速质控平台构建', startDate: '2023-06-01', endDate: '2025-12-31', award: '重点研发专项', role: '第二负责人' },
      ],
      awardList: [
        { category: '市级表彰', date: '2024-11-20', description: '医院感染防控优秀个人' },
      ],
      healthList: [
        { checkDate: '2026-09-15', item: '病原微生物防护体检', result: '未见病原感染，P2实验室防护合格' },
      ],
    },
    {
      id: 'STF-105',
      code: 'STF005',
      name: '李静',
      gender: '女',
      nation: '回族',
      birthDate: '1990-07-19',
      idCard: '110108199007198826',
      department: '检验科 (急诊与临检组)',
      title: '主管检验师',
      titleLevel: '中级',
      phone: '13522334455',
      address: '北京市海淀区远大路20号院',
      status: '在岗',
      basicInfo: {
        politicalStatus: '中共党员',
        educationLevel: '硕士研究生',
        school: '中南大学湘雅医学院',
        major: '临床检验诊断学',
        certNo: '2017071926',
        certExpiry: '2031-07-15',
      },
      tenureList: [
        { unit: '市中心医院', department: '急诊检验与临检组', startDate: '2021-01-01', endDate: '至今', position: '急诊危急值专岗组长' },
      ],
      educationList: [
        { institution: '中南大学湘雅医学院', major: '临床检验诊断学', startDate: '2013-09-01', endDate: '2016-07-01', degree: '医学硕士' },
      ],
      teachingList: [
        { institution: '市急救中心', specialty: '急危重症快速POCT检验', startDate: '2024-03-01', endDate: '2026-09-01', course: '急诊危急值闭环流转考核' },
      ],
      paperList: [
        { journal: '实用检验医师杂志', publishDate: '2025-03-25', title: '胸痛中心高敏肌钙蛋白I 20分钟快速发单流程优化实践', award: '急诊精益管理奖' },
      ],
      workHistory: [
        { unit: '市中心医院', department: '急诊检验室', startDate: '2016-08-01', endDate: '至今', position: '主管检验师' },
      ],
      titleHistory: [
        { title: '主管检验师', level: '中级', obtainDate: '2021-05-15', certNo: 'ZJ20210519' },
      ],
      researchList: [
        { projectName: '急诊卒中全血快速凝血四项与血小板功能联合评价', startDate: '2024-01-01', endDate: '2026-06-30', award: '青年科技专项', role: '负责人' },
      ],
      awardList: [
        { category: '院级表彰', date: '2025-07-01', description: '优秀共产党员' },
      ],
      healthList: [
        { checkDate: '2026-09-15', item: '年度职业健康体检', result: '各项指标未见异常' },
      ],
    },
    {
      id: 'STF-106',
      code: 'STF006',
      name: '刘洋',
      gender: '男',
      nation: '汉族',
      birthDate: '1992-02-28',
      idCard: '110105199202286714',
      department: '检验科 (质谱与分子组)',
      title: '检验医师',
      titleLevel: '初级(师)',
      phone: '13366554433',
      address: '北京市朝阳区望京西园三区',
      status: '在岗',
      basicInfo: {
        politicalStatus: '群众',
        educationLevel: '硕士研究生',
        school: '中国医科大学',
        major: '分子生物学与检验诊断',
        certNo: '2019022814',
        certExpiry: '2033-02-20',
      },
      tenureList: [
        { unit: '市中心医院', department: '分子诊断与质谱室', startDate: '2021-08-01', endDate: '至今', position: '质谱仪器负责人 / 基因扩增上岗医师' },
      ],
      educationList: [
        { institution: '中国医科大学', major: '临床检验诊断学', startDate: '2016-09-01', endDate: '2019-07-01', degree: '医学硕士' },
      ],
      teachingList: [
        { institution: '市中心医院PCR实验室', specialty: '临床基因扩增检验技术', startDate: '2024-05-01', endDate: '2026-10-01', course: 'PCR防污染及生物信息学分析' },
      ],
      paperList: [
        { journal: '分子诊断与治疗杂志', publishDate: '2025-09-18', title: '液质联用技术测定血清25-羟基维生素D的基质效应评价', award: '优秀中青年论文' },
      ],
      workHistory: [
        { unit: '市中心医院', department: '检验科分子组', startDate: '2019-08-01', endDate: '至今', position: '检验医师' },
      ],
      titleHistory: [
        { title: '检验医师', level: '初级(师)', obtainDate: '2020-09-15', certNo: 'YS20200928' },
      ],
      researchList: [
        { projectName: '基于高分辨串联质谱的血流感染靶向代谢物标志物筛查', startDate: '2024-05-01', endDate: '2026-12-31', award: '自然科学基金青年项目', role: '骨干' },
      ],
      awardList: [
        { category: '院级表彰', date: '2024-12-25', description: '技术创新新星奖' },
      ],
      healthList: [
        { checkDate: '2026-09-15', item: '辐射与有机试剂暴露体检', result: '血象及肝肾功能正常' },
      ],
    },
    {
      id: 'STF-107',
      code: 'STF007',
      name: '周丽娜',
      gender: '女',
      nation: '满族',
      birthDate: '1993-12-14',
      idCard: '110108199312145520',
      department: '检验科 (质控与公共冷链)',
      title: '检验师',
      titleLevel: '初级(师)',
      phone: '13122339988',
      address: '北京市丰台区方庄芳群园二区',
      status: '在岗',
      basicInfo: {
        politicalStatus: '共青团员',
        educationLevel: '大学本科',
        school: '大连医科大学',
        major: '医学检验技术',
        certNo: '2018121420',
        certExpiry: '2032-12-10',
      },
      tenureList: [
        { unit: '市中心医院', department: '检验科质控室', startDate: '2022-03-01', endDate: '至今', position: '冷链监控与标本库管理员' },
      ],
      educationList: [
        { institution: '大连医科大学', major: '医学检验技术', startDate: '2012-09-01', endDate: '2016-07-01', degree: '理学学士' },
      ],
      teachingList: [
        { institution: '检验科内部培训', specialty: '超低温冰箱及冷链报警', startDate: '2025-01-01', endDate: '2026-10-01', course: '生物样本库标准化存储规范' },
      ],
      paperList: [
        { journal: '医疗装备', publishDate: '2025-05-10', title: '物联网无线温湿度传感器在检验科标本库冷链中的应用', award: '优秀应用论文' },
      ],
      workHistory: [
        { unit: '市中心医院', department: '检验科', startDate: '2016-08-01', endDate: '至今', position: '检验师' },
      ],
      titleHistory: [
        { title: '检验师', level: '初级(师)', obtainDate: '2018-06-20', certNo: 'JS20180614' },
      ],
      researchList: [
        { projectName: '全院血清标本全生命周期追溯管理信息系统升级', startDate: '2024-02-01', endDate: '2025-11-30', award: '精细化管理三等奖', role: '参与' },
      ],
      awardList: [
        { category: '科室表彰', date: '2025-08-19', description: '优秀质量管理员' },
      ],
      healthList: [
        { checkDate: '2026-09-15', item: '年度体检', result: '各项指标良好' },
      ],
    },
    {
      id: 'STF-108',
      code: 'STF008',
      name: '孙晓东',
      gender: '男',
      nation: '汉族',
      birthDate: '1985-06-10',
      idCard: '110102198506102917',
      department: '检验科 (血液形态流水线)',
      title: '副主任技师',
      titleLevel: '副高级',
      phone: '13899001122',
      address: '北京市东城区东直门外大街28号',
      status: '在岗',
      basicInfo: {
        politicalStatus: '中共党员',
        educationLevel: '大学本科',
        school: '吉林大学白求恩医学部',
        major: '医学检验专业',
        certNo: '2011061017',
        certExpiry: '2029-06-30',
      },
      tenureList: [
        { unit: '市中心医院', department: '血液形态室', startDate: '2017-09-01', endDate: '至今', position: '骨髓细胞学与血涂片镜检专家' },
      ],
      educationList: [
        { institution: '吉林大学白求恩医学部', major: '医学检验', startDate: '2004-09-01', endDate: '2009-07-01', degree: '医学学士' },
      ],
      teachingList: [
        { institution: '市血液病专科联盟', specialty: '白血病与淋巴瘤外周血及骨髓形态学', startDate: '2022-03-01', endDate: '2026-09-30', course: '疑难白细胞分类镜检实训' },
      ],
      paperList: [
        { journal: '临床血液学杂志', publishDate: '2025-07-15', title: 'Sysmex XN-9000 结合全自动数码显微推片染色的41条镜检复核规则评价', award: '优秀论文二等奖' },
      ],
      workHistory: [
        { unit: '市中心医院', department: '检验科血液室', startDate: '2009-08-01', endDate: '至今', position: '副主任技师' },
      ],
      titleHistory: [
        { title: '副主任技师', level: '副高级', obtainDate: '2022-12-10', certNo: 'FG20221210' },
      ],
      researchList: [
        { projectName: 'AI数码形态学分析系统在急性早幼粒细胞白血病筛查中的临床多中心评价', startDate: '2024-01-01', endDate: '2026-12-31', award: '重点临床攻关基金', role: '骨干' },
      ],
      awardList: [
        { category: '院级表彰', date: '2025-08-19', description: '优秀医技骨干专家' },
      ],
      healthList: [
        { checkDate: '2026-09-15', item: '年度体检', result: '各项指标未见异常' },
      ],
    },
  ]);

  const [staffDeptFilter, setStaffDeptFilter] = useState('全部');
  const [staffSearchKey, setStaffSearchKey] = useState('');
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [isStaffManagementModalOpen, setIsStaffManagementModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffProfile | null>(null);
  const [staffDetailActiveTab, setStaffDetailActiveTab] = useState<number>(1);
  const [activeCellShiftDropdown, setActiveCellShiftDropdown] = useState<{ staffId: string; day: number } | null>(null);

  // 新建员工档案表单状态
  const [newStaffFormData, setNewStaffFormData] = useState({
    code: '',
    name: '',
    gender: '男' as '男' | '女',
    nation: '汉族',
    birthDate: '1995-06-01',
    idCard: '',
    department: '检验科 (临床生化组)',
    title: '检验师',
    phone: '',
    address: '北京市朝阳区',
    politicalStatus: '共青团员',
    educationLevel: '大学本科',
    school: '首都医科大学',
    major: '医学检验技术',
    certNo: '',
  });

  const filteredStaffs = useMemo(() => {
    return staffList.filter((stf) => {
      const matchDept =
        staffDeptFilter === '全部' || stf.department.includes(staffDeptFilter);
      const matchKey =
        !staffSearchKey.trim() ||
        stf.name.includes(staffSearchKey.trim()) ||
        stf.code.toLowerCase().includes(staffSearchKey.trim().toLowerCase()) ||
        stf.idCard.includes(staffSearchKey.trim());
      return matchDept && matchKey;
    });
  }, [staffList, staffDeptFilter, staffSearchKey]);

  // 当前有效选中员工 (默认选中列表第1位)
  const activeSelectedStaff = useMemo(() => {
    if (selectedStaff) {
      const stillInList = staffList.find((s) => s.id === selectedStaff.id);
      if (stillInList) return stillInList;
    }
    return filteredStaffs[0] || staffList[0] || null;
  }, [selectedStaff, staffList, filteredStaffs]);

  const handleOpenStaffModal = (stf: StaffProfile, tabIndex: number = 1) => {
    setSelectedStaff(stf);
    setStaffDetailActiveTab(tabIndex);
    setIsStaffModalOpen(true);
  };

  const handleSaveNewStaffProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffFormData.name.trim()) {
      triggerAction('请输入人员姓名！');
      return;
    }
    const nextCode = newStaffFormData.code || `STF00${staffList.length + 1}`;
    const newStaffObj: StaffProfile = {
      id: `STF-10${staffList.length + 1}`,
      code: nextCode,
      name: newStaffFormData.name.trim(),
      gender: newStaffFormData.gender,
      nation: newStaffFormData.nation || '汉族',
      birthDate: newStaffFormData.birthDate,
      idCard: newStaffFormData.idCard || `11010819950601${String(Math.floor(Math.random() * 9000) + 1000)}`,
      department: newStaffFormData.department,
      title: newStaffFormData.title,
      titleLevel: '中级',
      phone: newStaffFormData.phone || '13800000000',
      address: newStaffFormData.address,
      status: '在岗',
      basicInfo: {
        politicalStatus: newStaffFormData.politicalStatus,
        educationLevel: newStaffFormData.educationLevel,
        school: newStaffFormData.school,
        major: newStaffFormData.major,
        certNo: newStaffFormData.certNo || '202609001',
        certExpiry: '2034-12-31',
      },
      tenureList: [
        { unit: '市中心医院', department: newStaffFormData.department, startDate: '2026-10-01', endDate: '至今', position: newStaffFormData.title },
      ],
      educationList: [
        { institution: newStaffFormData.school, major: newStaffFormData.major, startDate: '2018-09-01', endDate: '2022-07-01', degree: newStaffFormData.educationLevel },
      ],
      teachingList: [],
      paperList: [],
      workHistory: [
        { unit: '市中心医院', department: '检验科', startDate: '2026-10-01', endDate: '至今', position: newStaffFormData.title },
      ],
      titleHistory: [
        { title: newStaffFormData.title, level: '中级', obtainDate: '2026-06-15', certNo: 'ZJ20260615' },
      ],
      researchList: [],
      awardList: [],
      healthList: [
        { checkDate: '2026-10-15', item: '入职/年度体检', result: '各项指标合格，无职业禁忌证' },
      ],
    };
    setStaffList([...staffList, newStaffObj]);
    setSelectedStaff(newStaffObj);
    setIsStaffManagementModalOpen(false);
    triggerAction(`新增检验科人员档案《${newStaffObj.name}》成功并已归档！`);
  };

  // =============================================================
  // TAB 3: 人员排班管理 State
  // =============================================================
  const [scheduleYear, setScheduleYear] = useState('2026');
  const [activeScheduleMonth, setActiveScheduleMonth] = useState<number>(10);
  const [scheduleViewMode, setScheduleViewMode] = useState<'month' | 'week'>('month');
  const [scheduleDeptFilter, setScheduleDeptFilter] = useState('检验科');

  const [monthStatusMap, setMonthStatusMap] = useState<Record<number, '已提交' | '未提交' | '未排'>>({
    1: '已提交', 2: '已提交', 3: '已提交', 4: '已提交', 5: '已提交',
    6: '已提交', 7: '已提交', 8: '已提交', 9: '已提交', 10: '已提交',
    11: '未提交', 12: '未排',
  });

  const SHIFT_OPTIONS = ['白班', '早班', '中班', '夜班', '小夜班', '大夜班', '休息', '值班'];

  const [scheduleAssignments, setScheduleAssignments] = useState<Record<string, string>>(() => {
    const initialMap: Record<string, string> = {};
    const staffIds = ['STF-101', 'STF-102', 'STF-103', 'STF-104', 'STF-105'];
    staffIds.forEach((sId, sIdx) => {
      for (let day = 1; day <= 31; day++) {
        const key = `10_${sId}_${day}`;
        if (day % 7 === 6 || day % 7 === 0) {
          initialMap[key] = day % 2 === 0 ? '休息' : '值班';
        } else if ((day + sIdx) % 5 === 0) {
          initialMap[key] = '夜班';
        } else if ((day + sIdx) % 3 === 0) {
          initialMap[key] = '早班';
        } else {
          initialMap[key] = '白班';
        }
      }
    });
    return initialMap;
  });

  const getAssignment = (month: number, staffId: string, day: number) => {
    const key = `${month}_${staffId}_${day}`;
    if (scheduleAssignments[key]) return scheduleAssignments[key];
    const hash = (month * 31 + staffId.charCodeAt(staffId.length - 1) + day) % 7;
    if (hash === 0) return '休息';
    if (hash === 1) return '值班';
    if (hash === 2) return '夜班';
    if (hash === 3) return '早班';
    return '白班';
  };

  const handleCellShiftChange = (month: number, staffId: string, day: number, newShift: string) => {
    const key = `${month}_${staffId}_${day}`;
    setScheduleAssignments((prev) => ({
      ...prev,
      [key]: newShift,
    }));
  };

  const handleRevokeMonthSubmit = (month: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setMonthStatusMap((prev) => ({
      ...prev,
      [month]: '未提交',
    }));
    triggerAction(`已撤销 ${scheduleYear}年${month}月 排班表的已提交状态，恢复可编辑草稿！`);
  };

  const handleSubmitCurrentMonth = () => {
    setMonthStatusMap((prev) => ({
      ...prev,
      [activeScheduleMonth]: '已提交',
    }));
    triggerAction(`【提交成功】${scheduleYear}年${activeScheduleMonth}月 检验科人员排班表已双审提交核准！`);
  };

  const handleSaveCurrentMonth = () => {
    triggerAction(`【草稿已保存】${scheduleYear}年${activeScheduleMonth}月 排班变更已保存至云端！`);
  };

  const handlePrintSchedule = () => {
    triggerAction(`正在调出 ${scheduleYear}年${activeScheduleMonth}月 检验科周/月度排班表打印预览`);
  };

  const currentMonthDays = useMemo(() => {
    const daysInMonth = new Date(parseInt(scheduleYear), activeScheduleMonth, 0).getDate();
    const daysArr = [];
    const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
    for (let d = 1; d <= daysInMonth; d++) {
      const dateObj = new Date(parseInt(scheduleYear), activeScheduleMonth - 1, d);
      const weekStr = weekDays[dateObj.getDay()];
      daysArr.push({ day: d, week: weekStr, isWeekend: dateObj.getDay() === 0 || dateObj.getDay() === 6 });
    }
    return daysArr;
  }, [scheduleYear, activeScheduleMonth]);

  // =============================================================
  // TAB 4: 科室文档管理 State & Left-Category-Tree Linkage
  // (按用户最新截图及要求：左侧新增/编辑/删除分类树，点击左侧节点，右侧受控文档列表跟变!)
  // =============================================================
  const [docCategories, setDocCategories] = useState<DocCategory[]>([
    { id: 'cat-all', label: '全部受控文档', parentId: null },
    { id: 'cat-quality', label: '质量管理类', parentId: null },
    { id: 'cat-iso15189', label: '15189评审资料', parentId: 'cat-quality' },
    { id: 'cat-sop', label: '操作流程类 (SOP)', parentId: null },
    { id: 'cat-sop-chem', label: '生化组 SOP', parentId: 'cat-sop' },
    { id: 'cat-sop-clin', label: '临检组 SOP', parentId: 'cat-sop' },
    { id: 'cat-sop-micro', label: '微生物组 SOP', parentId: 'cat-sop' },
    { id: 'cat-rules', label: '科室规章制度', parentId: null },
    { id: 'cat-emergency', label: '应急预案与生物安全', parentId: null },
  ]);

  const [selectedCatId, setSelectedCatId] = useState<string>('cat-all');
  const [docSearchKeyword, setDocSearchKeyword] = useState<string>('');

  const [docList, setDocList] = useState<DocItem[]>([
    {
      id: 'DOC-202610-01',
      categoryId: 'cat-iso15189',
      categoryName: '15189评审资料',
      title: 'ISO15189:2022 实验室质量手册 (第V版)',
      version: 'v5.2',
      attachment: 'ISO15189_Quality_Manual_v5.2.pdf',
      attachmentSize: '4.8 MB',
      operator: '张建华 (主任医师)',
      updateTime: '2026-10-28 14:30',
      status: '现行生效',
      summary: '规范全科检验流程、检验前中后质量保证与管理要素。',
    },
    {
      id: 'DOC-202610-02',
      categoryId: 'cat-sop-chem',
      categoryName: '生化组 SOP',
      title: '罗氏 Cobas 8000 全自动生化分析仪标准操作规程 (SOP)',
      version: 'v3.2',
      attachment: 'Roche_Cobas8000_SOP_v3.2.docx',
      attachmentSize: '2.5 MB',
      operator: '陈志远 (主管检验师)',
      updateTime: '2026-10-29 10:15',
      status: '现行生效',
      summary: '包含Cobas 8000 开机试剂盘点、定标质控与反冲洗维保流程。',
    },
    {
      id: 'DOC-202610-03',
      categoryId: 'cat-sop-clin',
      categoryName: '临检组 SOP',
      title: 'Sysmex XN-9000 全自动血细胞分析流水线操作与镜检复核规程',
      version: 'v4.0',
      attachment: 'Sysmex_XN9000_SlideReview_v4.0.pdf',
      attachmentSize: '3.1 MB',
      operator: '李静 (主管检验师)',
      updateTime: '2026-10-30 08:20',
      status: '现行生效',
      summary: '规定WBC/PLT异常报警推片染色及41条镜检复核规则。',
    },
    {
      id: 'DOC-202610-04',
      categoryId: 'cat-sop-micro',
      categoryName: '微生物组 SOP',
      title: '布鲁克 MALDI-TOF 质谱仪细菌鉴定与BTS打靶校准规程',
      version: 'v2.5',
      attachment: 'Bruker_MALDI_TOF_SOP_v2.5.pdf',
      attachmentSize: '1.9 MB',
      operator: '郭海平 (主管检验师)',
      updateTime: '2026-10-27 16:00',
      status: '现行生效',
      summary: '包含质谱打靶预处理、BTS标准品校准与多重耐药菌快速识别。',
    },
    {
      id: 'DOC-202610-05',
      categoryId: 'cat-emergency',
      categoryName: '应急预案与生物安全',
      title: '血培养快速报阳及危急值处置与电话双核对标准化流程',
      version: 'v2.1',
      attachment: 'Panic_Value_Process_v2.1.pdf',
      attachmentSize: '1.2 MB',
      operator: '王雪梅 (副主任检验师)',
      updateTime: '2026-10-30 08:40',
      status: '现行生效',
      summary: '急诊危急值响应时限≤15分钟、通报记录与临床回看闭环。',
    },
    {
      id: 'DOC-202610-06',
      categoryId: 'cat-rules',
      categoryName: '科室规章制度',
      title: '临床检验生物安全等级管理与医疗废弃物处置规范',
      version: 'v4.1',
      attachment: 'Biosafety_Management_v4.1.pdf',
      attachmentSize: '3.5 MB',
      operator: '赵敏 (副主任检验师)',
      updateTime: '2026-10-25 11:30',
      status: '现行生效',
      summary: '实验室二类病原微生物防护、废液灭菌与医疗废物归档。',
    },
  ]);

  // 左侧分类选择及筛选后的受控文档列表
  const filteredDocs = useMemo(() => {
    return docList.filter((doc) => {
      const matchCat =
        selectedCatId === 'cat-all' ||
        doc.categoryId === selectedCatId ||
        (selectedCatId === 'cat-quality' && doc.categoryId === 'cat-iso15189') ||
        (selectedCatId === 'cat-sop' && doc.categoryId.startsWith('cat-sop'));
      const matchKey =
        !docSearchKeyword.trim() ||
        doc.title.toLowerCase().includes(docSearchKeyword.trim().toLowerCase()) ||
        doc.attachment.toLowerCase().includes(docSearchKeyword.trim().toLowerCase()) ||
        doc.operator.toLowerCase().includes(docSearchKeyword.trim().toLowerCase());
      return matchCat && matchKey;
    });
  }, [docList, selectedCatId, docSearchKeyword]);

  // 文档弹窗控制 (新增分类, 编辑分类, 新增文档, 在线预览文档)
  const [isAddCatModalOpen, setIsAddCatModalOpen] = useState(false);
  const [newCatLabel, setNewCatLabel] = useState('');

  const [isAddDocModalOpen, setIsAddDocModalOpen] = useState(false);
  const [docFormData, setDocFormData] = useState({
    title: '',
    categoryId: 'cat-iso15189',
    version: 'v1.0',
    attachment: 'Document_Attachment.pdf',
    operator: user?.name || '张建华 (主任医师)',
    summary: '',
  });

  const [isPreviewDocModalOpen, setIsPreviewDocModalOpen] = useState(false);
  const [previewingDoc, setPreviewingDoc] = useState<DocItem | null>(null);

  // 新增分类分类提交
  const handleSaveNewCat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatLabel.trim()) return;
    const newCatObj: DocCategory = {
      id: `cat-user-${Date.now()}`,
      label: newCatLabel.trim(),
      parentId: null,
    };
    setDocCategories([...docCategories, newCatObj]);
    setIsAddCatModalOpen(false);
    setNewCatLabel('');
    triggerAction(`新增文档分类《${newCatObj.label}》成功！`);
  };

  // 新增受控文档提交
  const handleSaveNewDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docFormData.title.trim()) return;
    const catObj = docCategories.find((c) => c.id === docFormData.categoryId);
    const newDoc: DocItem = {
      id: `DOC-202610-0${docList.length + 1}`,
      categoryId: docFormData.categoryId,
      categoryName: catObj ? catObj.label : '综合文档',
      title: docFormData.title.trim(),
      version: docFormData.version || 'v1.0',
      attachment: docFormData.attachment || 'Attached_Doc.pdf',
      attachmentSize: '2.1 MB',
      operator: docFormData.operator || '张建华',
      updateTime: '2026-10-30 08:55',
      status: '现行生效',
      summary: docFormData.summary || '规范检验科质量与标准操作',
    };
    setDocList([newDoc, ...docList]);
    setIsAddDocModalOpen(false);
    triggerAction(`受控文档《${newDoc.title}》上传成功并归档！`);
  };

  // 在线调阅文档预览
  const handleOpenPreviewDoc = (doc: DocItem) => {
    setPreviewingDoc(doc);
    setIsPreviewDocModalOpen(true);
  };

  // =============================================================
  // TAB 5: 设备检查规则 State & Handlers
  // (按用户要求：主页面直接展示左侧设备列表；点击设备或【配置检查规则】，弹窗展示“检查类型列表”与“类型明细列表”)
  // =============================================================
  const [deviceRuleList, setDeviceRuleList] = useState<DeviceRuleItem[]>([
    {
      id: 'DEV-RULE-001',
      code: '124323',
      name: 'AU2700 全自动生化分析仪',
      department: '生化组',
      responsible: '陈志远 (主管检验师)',
      lastCheckTime: '2026-10-30 08:00',
      status: '启用',
      checkTypes: [
        {
          id: 'CT-01',
          typeName: '日常开机保养与自检',
          cycle: '日检',
          checkTime: '每日 07:30',
          responsible: '陈志远',
          status: '启用',
          items: [
            { id: 'ITM-01', itemName: '反应盘恒温槽水温', itemType: '数值型', optionValues: '37.0±0.2℃', defaultValue: '37.0℃', required: '是' },
            { id: 'ITM-02', itemName: '洗涤针与搅拌棒状态', itemType: '选择型', optionValues: '正常/堵塞/挂滴', defaultValue: '正常', required: '是' },
            { id: 'ITM-03', itemName: '试剂针加样精度自检', itemType: '布尔型', optionValues: '合格/不合格', defaultValue: '合格', required: '是' },
            { id: 'ITM-04', itemName: '超纯水供水电阻率', itemType: '数值型', optionValues: '≥18.2 MΩ.cm', defaultValue: '18.2', required: '是' },
          ],
        },
        {
          id: 'CT-02',
          typeName: '周度光路与比色杯检测',
          cycle: '周检',
          checkTime: '每周一 08:00',
          responsible: '陈志远',
          status: '启用',
          items: [
            { id: 'ITM-05', itemName: '340nm-800nm 光度计零点', itemType: '数值型', optionValues: '<0.005 Abs', defaultValue: '0.001', required: '是' },
            { id: 'ITM-06', itemName: '反应杯清洁度透光率', itemType: '选择型', optionValues: '优/良/差', defaultValue: '优', required: '是' },
          ],
        },
      ],
    },
    {
      id: 'DEV-RULE-002',
      code: '124334',
      name: 'AU600 全自动生化分析仪',
      department: '免疫组',
      responsible: '王雪梅 (副主任检验师)',
      lastCheckTime: '2026-10-29 17:30',
      status: '启用',
      checkTypes: [
        {
          id: 'CT-03',
          typeName: '发光底物与磁珠混匀度盘点',
          cycle: '日检',
          checkTime: '每日 08:00',
          responsible: '王雪梅',
          status: '启用',
          items: [
            { id: 'ITM-07', itemName: '磁珠悬浮液混匀度', itemType: '布尔型', optionValues: '混匀/未混匀', defaultValue: '混匀', required: '是' },
            { id: 'ITM-08', itemName: '底物液 A/B 存量', itemType: '数值型', optionValues: '>200 ml', defaultValue: '350ml', required: '是' },
          ],
        },
      ],
    },
    {
      id: 'DEV-RULE-003',
      code: '125101',
      name: 'Cobas 8000 全自动生化免疫流水线',
      department: '生化组',
      responsible: '张建华 (主任医师)',
      lastCheckTime: '2026-10-30 07:45',
      status: '启用',
      checkTypes: [
        {
          id: 'CT-04',
          typeName: 'ISE 电极与抓手轨迹校准',
          cycle: '日检',
          checkTime: '每日 07:00',
          responsible: '张建华',
          status: '启用',
          items: [
            { id: 'ITM-09', itemName: 'K/Na/Cl 离子电极斜率', itemType: '数值型', optionValues: '95% - 105%', defaultValue: '98%', required: '是' },
            { id: 'ITM-10', itemName: '轨道抓手抓管平稳度', itemType: '选择型', optionValues: '平稳/卡管/停机', defaultValue: '平稳', required: '是' },
          ],
        },
      ],
    },
    {
      id: 'DEV-RULE-004',
      code: '126202',
      name: 'Sysmex XN-9000 全自动血细胞分析流水线',
      department: '临检组',
      responsible: '李静 (主管检验师)',
      lastCheckTime: '2026-10-30 08:15',
      status: '启用',
      checkTypes: [
        {
          id: 'CT-05',
          typeName: '背景计数与冲洗电极',
          cycle: '日检',
          checkTime: '每日 07:20',
          responsible: '李静',
          status: '启用',
          items: [
            { id: 'ITM-11', itemName: 'WBC 背景计数', itemType: '数值型', optionValues: '≤0.10×10^9/L', defaultValue: '0.01', required: '是' },
            { id: 'ITM-12', itemName: 'RBC 背景计数', itemType: '数值型', optionValues: '≤0.02×10^12/L', defaultValue: '0.00', required: '是' },
            { id: 'ITM-13', itemName: 'PLT 背景计数', itemType: '数值型', optionValues: '≤10.0×10^9/L', defaultValue: '1.0', required: '是' },
          ],
        },
      ],
    },
    {
      id: 'DEV-RULE-005',
      code: '127303',
      name: 'Bruker MALDI-TOF 飞行时间质谱仪',
      department: '微生物组',
      responsible: '郭海平 (主管检验师)',
      lastCheckTime: '2026-10-28 16:20',
      status: '启用',
      checkTypes: [
        {
          id: 'CT-06',
          typeName: '质谱打靶与 BTS 校准',
          cycle: '日检',
          checkTime: '每日 08:00',
          responsible: '郭海平',
          status: '启用',
          items: [
            { id: 'ITM-14', itemName: 'BTS 标准品质量峰偏差', itemType: '数值型', optionValues: '<300 ppm', defaultValue: '85 ppm', required: '是' },
            { id: 'ITM-15', itemName: '激光发射计数', itemType: '数值型', optionValues: '<5,000,000次', defaultValue: '1240000', required: '是' },
          ],
        },
      ],
    },
    {
      id: 'DEV-RULE-006',
      code: '128404',
      name: '沃特世 ACQUITY UPLC 液相质谱联用仪',
      department: '质谱分子组',
      responsible: '刘洋 (检验医师)',
      lastCheckTime: '2026-10-30 09:00',
      status: '启用',
      checkTypes: [
        {
          id: 'CT-07',
          typeName: '色谱柱压与离子源清洁度',
          cycle: '日检',
          checkTime: '每日 08:30',
          responsible: '刘洋',
          status: '启用',
          items: [
            { id: 'ITM-16', itemName: '高压泵柱系统压力', itemType: '数值型', optionValues: '350 - 420 bar', defaultValue: '385 bar', required: '是' },
            { id: 'ITM-17', itemName: '锥孔及离子源污染度', itemType: '选择型', optionValues: '洁净/积碳/异常', defaultValue: '洁净', required: '是' },
          ],
        },
      ],
    },
  ]);

  const [deviceDeptFilter, setDeviceDeptFilter] = useState('全部');
  const [deviceSearchKey, setDeviceSearchKey] = useState('');

  // 弹窗状态：配置检查规则
  const [selectedDeviceForRules, setSelectedDeviceForRules] = useState<DeviceRuleItem | null>(null);
  const [isDeviceRuleModalOpen, setIsDeviceRuleModalOpen] = useState(false);
  const [selectedCheckTypeId, setSelectedCheckTypeId] = useState<string>('');

  // 子弹窗状态 (新增检查类型 & 新增明细项目)
  const [isAddCheckTypeModalOpen, setIsAddCheckTypeModalOpen] = useState(false);
  const [newCheckTypeFormData, setNewCheckTypeFormData] = useState({
    typeName: '',
    cycle: '日检' as '日检' | '周检' | '月检' | '季检',
    checkTime: '每日 08:00',
    responsible: '陈志远 (主管检验师)',
  });

  const [isAddDetailItemModalOpen, setIsAddDetailItemModalOpen] = useState(false);
  const [newDetailItemFormData, setNewDetailItemFormData] = useState({
    itemName: '',
    itemType: '数值型' as '数值型' | '选择型' | '布尔型' | '文本型',
    optionValues: '',
    defaultValue: '',
    required: '是' as '是' | '否',
  });

  const filteredDeviceRules = useMemo(() => {
    return deviceRuleList.filter((dev) => {
      const matchDept = deviceDeptFilter === '全部' || dev.department.includes(deviceDeptFilter);
      const matchKey =
        !deviceSearchKey.trim() ||
        dev.name.toLowerCase().includes(deviceSearchKey.trim().toLowerCase()) ||
        dev.code.toLowerCase().includes(deviceSearchKey.trim().toLowerCase()) ||
        dev.responsible.toLowerCase().includes(deviceSearchKey.trim().toLowerCase());
      return matchDept && matchKey;
    });
  }, [deviceRuleList, deviceDeptFilter, deviceSearchKey]);

  const handleOpenDeviceRuleModal = (dev: DeviceRuleItem) => {
    setSelectedDeviceForRules(dev);
    if (dev.checkTypes && dev.checkTypes.length > 0) {
      setSelectedCheckTypeId(dev.checkTypes[0].id);
    } else {
      setSelectedCheckTypeId('');
    }
    setIsDeviceRuleModalOpen(true);
  };

  const handleSaveNewCheckType = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDeviceForRules || !newCheckTypeFormData.typeName.trim()) return;

    const newCT: DeviceCheckType = {
      id: `CT-${Date.now()}`,
      typeName: newCheckTypeFormData.typeName.trim(),
      cycle: newCheckTypeFormData.cycle,
      checkTime: newCheckTypeFormData.checkTime || '每日 08:00',
      responsible: newCheckTypeFormData.responsible || '检验科主管',
      status: '启用',
      items: [],
    };

    const updatedDeviceList = deviceRuleList.map((dev) => {
      if (dev.id === selectedDeviceForRules.id) {
        const newTypes = [...dev.checkTypes, newCT];
        const updatedDev = { ...dev, checkTypes: newTypes };
        setSelectedDeviceForRules(updatedDev);
        return updatedDev;
      }
      return dev;
    });

    setDeviceRuleList(updatedDeviceList);
    setSelectedCheckTypeId(newCT.id);
    setIsAddCheckTypeModalOpen(false);
    setNewCheckTypeFormData({ typeName: '', cycle: '日检', checkTime: '每日 08:00', responsible: '陈志远' });
    triggerAction(`为设备《${selectedDeviceForRules.name}》新增检查类型《${newCT.typeName}》成功！`);
  };

  const handleSaveNewDetailItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDeviceForRules || !selectedCheckTypeId || !newDetailItemFormData.itemName.trim()) return;

    const newDetail: CheckTypeDetailItem = {
      id: `ITM-${Date.now()}`,
      itemName: newDetailItemFormData.itemName.trim(),
      itemType: newDetailItemFormData.itemType,
      optionValues: newDetailItemFormData.optionValues || '正常/异常',
      defaultValue: newDetailItemFormData.defaultValue || '正常',
      required: newDetailItemFormData.required,
    };

    const updatedDeviceList = deviceRuleList.map((dev) => {
      if (dev.id === selectedDeviceForRules.id) {
        const newCheckTypes = dev.checkTypes.map((ct) => {
          if (ct.id === selectedCheckTypeId) {
            return { ...ct, items: [...ct.items, newDetail] };
          }
          return ct;
        });
        const updatedDev = { ...dev, checkTypes: newCheckTypes };
        setSelectedDeviceForRules(updatedDev);
        return updatedDev;
      }
      return dev;
    });

    setDeviceRuleList(updatedDeviceList);
    setIsAddDetailItemModalOpen(false);
    setNewDetailItemFormData({ itemName: '', itemType: '数值型', optionValues: '', defaultValue: '', required: '是' });
    triggerAction(`新增检查明细项《${newDetail.itemName}》成功！`);
  };

  const handleToggleCheckTypeStatus = (ctId: string) => {
    if (!selectedDeviceForRules) return;
    const updatedDeviceList = deviceRuleList.map((dev) => {
      if (dev.id === selectedDeviceForRules.id) {
        const newCheckTypes = dev.checkTypes.map((ct) => {
          if (ct.id === ctId) {
            const nextStatus = ct.status === '启用' ? '停用' : '启用';
            return { ...ct, status: nextStatus as '启用' | '停用' };
          }
          return ct;
        });
        const updatedDev = { ...dev, checkTypes: newCheckTypes };
        setSelectedDeviceForRules(updatedDev);
        return updatedDev;
      }
      return dev;
    });
    setDeviceRuleList(updatedDeviceList);
    triggerAction('检查类型启用状态已切换！');
  };

  const handleDeleteCheckType = (ctId: string) => {
    if (!selectedDeviceForRules) return;
    const updatedDeviceList = deviceRuleList.map((dev) => {
      if (dev.id === selectedDeviceForRules.id) {
        const newCheckTypes = dev.checkTypes.filter((ct) => ct.id !== ctId);
        const updatedDev = { ...dev, checkTypes: newCheckTypes };
        setSelectedDeviceForRules(updatedDev);
        return updatedDev;
      }
      return dev;
    });
    setDeviceRuleList(updatedDeviceList);
    if (selectedCheckTypeId === ctId) {
      setSelectedCheckTypeId('');
    }
    triggerAction('检查类型及其包含的明细项已移除！');
  };

  const handleDeleteDetailItem = (itmId: string) => {
    if (!selectedDeviceForRules || !selectedCheckTypeId) return;
    const updatedDeviceList = deviceRuleList.map((dev) => {
      if (dev.id === selectedDeviceForRules.id) {
        const newCheckTypes = dev.checkTypes.map((ct) => {
          if (ct.id === selectedCheckTypeId) {
            return { ...ct, items: ct.items.filter((itm) => itm.id !== itmId) };
          }
          return ct;
        });
        const updatedDev = { ...dev, checkTypes: newCheckTypes };
        setSelectedDeviceForRules(updatedDev);
        return updatedDev;
      }
      return dev;
    });
    setDeviceRuleList(updatedDeviceList);
    triggerAction('明细检查项已移除！');
  };

  // =============================================================
  // TAB 6: 设备检查计划 (科室检查计划) State & Handlers
  // =============================================================
  const [devicePlanList, setDevicePlanList] = useState<DevicePlanItem[]>([
    {
      id: 'PLN-202610-001',
      code: 'PLN-202610-01',
      title: 'AU2700 全自动生化分析仪月度检查计划',
      deviceId: 'DEV-RULE-001',
      deviceName: 'AU2700 全自动生化分析仪',
      deviceCode: '124323',
      department: '生化组',
      planType: '月度检查计划',
      scheduledDate: '2026-10-01',
      timeSlot: '08:00~10:30',
      cycle: '每月一次',
      responsible: '陈志远 (主管检验师)',
      reviewer: '王雪梅 (副主任检验师)',
      priority: '高',
      status: '已完成',
      completedAt: '2026-10-01 10:15',
      completedBy: '陈志远',
      remarks: '反应槽恒温水更换除藻剂，光度计9波长自检透光率均达到99.8%',
      items: [
        { id: 'pi-1', name: '恒温水浴盘排空换水与除藻剂添加', standard: '水质澄清无杂质，37.0±0.2℃', isKeyItem: true },
        { id: 'pi-2', name: '全波长光度计吸光度灵敏度自测', standard: '偏差<±0.002 Abs', isKeyItem: true },
        { id: 'pi-3', name: '试剂与样品加样针内外壁超声清洗', standard: '加样精度误差<1.0%', isKeyItem: false },
      ],
    },
    {
      id: 'PLN-202610-002',
      code: 'PLN-202610-02',
      title: '检验科血液标本库 -80℃超低温冰箱季度保养计划',
      deviceId: 'DEV-RULE-007',
      deviceName: '海尔医用 -80℃ 超低温保存冰箱',
      deviceCode: '129505',
      department: '科室公共',
      planType: '季度保养计划',
      scheduledDate: '2026-10-01',
      timeSlot: '14:00~16:00',
      cycle: '每季度一次',
      responsible: '周丽娜 (检验师)',
      reviewer: '李明华 (主任医师)',
      priority: '普通',
      status: '已完成',
      completedAt: '2026-10-01 15:40',
      completedBy: '周丽娜',
      remarks: '门封除霜无结冰卡阻，备用二氧化碳后备制冷联锁报警测试正常',
      items: [
        { id: 'pi-4', name: '门框密封胶条除霜与回弹性检查', standard: '闭合严密无漏气', isKeyItem: true },
        { id: 'pi-5', name: '压缩机散热滤网高压气流除尘', standard: '风道无棉绒堵塞', isKeyItem: false },
        { id: 'pi-6', name: '备用蓄电池与超温远程报警触发测试', standard: '警报声光与短信正常送达', isKeyItem: true },
      ],
    },
    {
      id: 'PLN-202610-003',
      code: 'PLN-202610-03',
      title: 'Sysmex XN-9000 血液流水线周度维护计划',
      deviceId: 'DEV-RULE-004',
      deviceName: 'Sysmex XN-9000 全自动血细胞分析流水线',
      deviceCode: '126202',
      department: '临检组',
      planType: '周度维护计划',
      scheduledDate: '2026-10-05',
      timeSlot: '07:30~09:00',
      cycle: '每周一次',
      responsible: '孙晓东 (副主任技师)',
      reviewer: '王雪梅 (副主任检验师)',
      priority: '普通',
      status: '已完成',
      completedAt: '2026-10-05 08:50',
      completedBy: '孙晓东',
      remarks: '冲洗液管道无结晶，WBC/RBC/PLT背景值均归零',
      items: [
        { id: 'pi-7', name: 'Cellpack 稀释液及溶血剂管路排气', standard: '气泡彻底排空', isKeyItem: false },
        { id: 'pi-8', name: '鞘流检测池与激光池光学窗口清洗', standard: '光学增益系数正常', isKeyItem: true },
      ],
    },
    {
      id: 'PLN-202610-004',
      code: 'PLN-202610-04',
      title: 'Cobas 8000 生化免疫流水线季度深度维保计划',
      deviceId: 'DEV-RULE-003',
      deviceName: 'Cobas 8000 全自动生化免疫流水线',
      deviceCode: '125101',
      department: '生化组',
      planType: '季度保养计划',
      scheduledDate: '2026-10-12',
      timeSlot: '13:00~17:00',
      cycle: '每季度一次',
      responsible: '赵立峰 (设备高级工程师)',
      reviewer: '张建华 (主任医师)',
      priority: '高',
      status: '已完成',
      completedAt: '2026-10-12 16:45',
      completedBy: '赵立峰',
      remarks: '更换ISE模块蠕动泵软管及排废电磁阀，各项离子定标质控良好',
      items: [
        { id: 'pi-9', name: 'ISE 蠕动泵软管及抓手齿轮润滑', standard: '无老化裂纹，运行顺畅', isKeyItem: true },
        { id: 'pi-10', name: '冷藏试剂仓温度均匀度多点校准', standard: '4.0~8.0℃范围内', isKeyItem: true },
        { id: 'pi-11', name: '条码扫描器激光镜头无水乙醇清洁', standard: '首读合格率>99.5%', isKeyItem: false },
      ],
    },
    {
      id: 'PLN-202610-005',
      code: 'PLN-202610-05',
      title: 'Bruker MALDI-TOF 质谱仪月度校准与保养计划',
      deviceId: 'DEV-RULE-005',
      deviceName: 'Bruker MALDI-TOF 飞行时间质谱仪',
      deviceCode: '127303',
      department: '微生物组',
      planType: '月度检查计划',
      scheduledDate: '2026-10-15',
      timeSlot: '09:00~11:30',
      cycle: '每月一次',
      responsible: '郭海平 (主管检验师)',
      reviewer: '李明华 (主任医师)',
      priority: '高',
      status: '已完成',
      completedAt: '2026-10-15 11:20',
      completedBy: '郭海平',
      remarks: 'BTS标准品靶位校准质谱峰误差为75ppm（标准要求<300ppm）',
      items: [
        { id: 'pi-12', name: '靶板定位步进电机精度复位校验', standard: '靶点定位误差<0.05mm', isKeyItem: true },
        { id: 'pi-13', name: '高真空腔体泵压及分子涡轮泵电流核验', standard: '工作气压<2.0e-7 mbar', isKeyItem: true },
      ],
    },
    {
      id: 'PLN-202610-006',
      code: 'PLN-202610-06',
      title: 'Beckman DxI 800 发光免疫仪周度清洗与底物泵校验',
      deviceId: 'DEV-RULE-002',
      deviceName: 'Beckman Coulter DxI 800 化学发光免疫分析仪',
      deviceCode: '124334',
      department: '免疫组',
      planType: '周度维护计划',
      scheduledDate: '2026-10-19',
      timeSlot: '08:30~10:00',
      cycle: '每周一次',
      responsible: '王雪梅 (副主任检验师)',
      reviewer: '张建华 (主任医师)',
      priority: '普通',
      status: '已完成',
      completedAt: '2026-10-19 09:50',
      completedBy: '王雪梅',
      remarks: '底物注入量精密度CV值为0.4%，发光值稳定',
      items: [
        { id: 'pi-14', name: '底物分配器及洗液喷嘴通畅度检测', standard: '液流呈柱状喷射不分叉', isKeyItem: true },
        { id: 'pi-15', name: '废液泵抽吸负压及真空罐液位传感器', standard: '传感器响应灵敏无渗漏', isKeyItem: false },
      ],
    },
    {
      id: 'PLN-202610-007',
      code: 'PLN-202610-07',
      title: 'ABI 7500 荧光定量PCR仪季度滤光片与荧光通道校验',
      deviceId: 'DEV-RULE-008',
      deviceName: '赛默飞 ABI 7500 荧光定量PCR扩增仪',
      deviceCode: '128808',
      department: '质谱分子组',
      planType: '季度保养计划',
      scheduledDate: '2026-10-25',
      timeSlot: '14:00~16:30',
      cycle: '每季度一次',
      responsible: '刘洋 (主管检验师)',
      reviewer: '李明华 (主任医师)',
      priority: '高',
      status: '已完成',
      completedAt: '2026-10-25 16:15',
      completedBy: '刘洋',
      remarks: 'FAM/VIC/ROX/CY5四通道纯染料校准矩阵良好，背景噪声正常',
      items: [
        { id: 'pi-16', name: '纯染料标准板荧光信号强度校准', standard: '矩阵交叉干扰率<1.5%', isKeyItem: true },
        { id: 'pi-17', name: '热盖温控与半导体加热模块均匀度检测', standard: '96孔温差≤0.25℃', isKeyItem: true },
      ],
    },
    {
      id: 'PLN-202610-008',
      code: 'PLN-202610-08',
      title: '沃特世 UPLC-MS 液质联用仪高压泵油与气源巡检计划',
      deviceId: 'DEV-RULE-006',
      deviceName: '沃特世 ACQUITY UPLC 液相质谱联用仪',
      deviceCode: '128404',
      department: '质谱分子组',
      planType: '月度检查计划',
      scheduledDate: '2026-10-28',
      timeSlot: '09:00~11:00',
      cycle: '每月一次',
      responsible: '赵立峰 (设备高级工程师)',
      reviewer: '刘洋 (主管检验师)',
      priority: '普通',
      status: '已完成',
      completedAt: '2026-10-28 10:55',
      completedBy: '赵立峰',
      remarks: '氮气发生器露点压力在标称值，前级旋片泵油油位及透明度正常',
      items: [
        { id: 'pi-18', name: '高纯氮气发生器输出压力与露点检测', standard: '输出压力0.65±0.05 MPa', isKeyItem: true },
        { id: 'pi-19', name: '高压输液双柱塞密封垫及排空阀泄漏检查', standard: '压力波动率<1.0 bar', isKeyItem: true },
      ],
    },
    {
      id: 'PLN-202610-009',
      code: 'PLN-202610-09',
      title: 'AU2700 反应槽水温与进样针精密度月度检查计划',
      deviceId: 'DEV-RULE-001',
      deviceName: 'AU2700 全自动生化分析仪',
      deviceCode: '124323',
      department: '生化组',
      planType: '月度检查计划',
      scheduledDate: '2026-10-30',
      timeSlot: '08:30~10:30',
      cycle: '每月一次',
      responsible: '陈志远 (主管检验师)',
      reviewer: '王雪梅 (副主任检验师)',
      priority: '高',
      status: '进行中',
      remarks: '今日上午正按计划进行10波长吸光比对及恒温槽37℃精密水银温度计校对',
      items: [
        { id: 'pi-20', name: '37℃恒温反应槽水温多点测温校核', standard: '设定值37.0℃，实测波动<±0.1℃', isKeyItem: true },
        { id: 'pi-21', name: '试剂加样针1与试剂加样针2吐出精度复测', standard: '加样量CV值<1.2%', isKeyItem: true },
        { id: 'pi-22', name: '清洗站第一至第七阶段吸水针高度检测', standard: '吸水头间隙0.5±0.1mm', isKeyItem: false },
      ],
    },
    {
      id: 'PLN-202610-010',
      code: 'PLN-202610-10',
      title: '检验科生物安全柜与超净工作台风速及紫外照度月度检查计划',
      deviceId: 'DEV-RULE-009',
      deviceName: '二级生物安全柜 (BSC-1300IIA2)',
      deviceCode: '130101',
      department: '微生物组',
      planType: '月度检查计划',
      scheduledDate: '2026-10-30',
      timeSlot: '14:00~15:30',
      cycle: '每月一次',
      responsible: '周丽娜 (检验师)',
      reviewer: '郭海平 (主管检验师)',
      priority: '普通',
      status: '待执行',
      remarks: '计划下午开展紫外辐照计检测，保证微生物标本接种操作安全',
      items: [
        { id: 'pi-23', name: '进风面平均风速与下降气流风速测量', standard: '进风风速0.53±0.025 m/s', isKeyItem: true },
        { id: 'pi-24', name: 'UV 紫外灭菌灯中心照度测试', standard: '紫外辐射强度≥70 μW/cm²', isKeyItem: true },
        { id: 'pi-25', name: '前窗工作开度声光联锁报警测试', standard: '开度超标警报立即蜂鸣', isKeyItem: false },
      ],
    },
    {
      id: 'PLN-202610-011',
      code: 'PLN-202610-11',
      title: '全自动化学发光免疫分析仪吸样针清洗站周度维护计划',
      deviceId: 'DEV-RULE-002',
      deviceName: 'Beckman Coulter DxI 800 化学发光免疫分析仪',
      deviceCode: '124334',
      department: '免疫组',
      planType: '周度维护计划',
      scheduledDate: '2026-10-30',
      timeSlot: '16:00~17:00',
      cycle: '每周一次',
      responsible: '王雪梅 (副主任检验师)',
      reviewer: '张建华 (主任医师)',
      priority: '普通',
      status: '待执行',
      remarks: '傍晚常规标本下机后，使用专用探针清洗剂进行循环浸泡脱蛋白',
      items: [
        { id: 'pi-26', name: '加样探针超声清洗站溢流液槽疏通', standard: '排水通畅无倒灌', isKeyItem: false },
        { id: 'pi-27', name: '反应杯供给链轨道传感器灵敏度测试', standard: '反应杯供送顺畅无卡杯', isKeyItem: true },
      ],
    },
    {
      id: 'PLN-202610-012',
      code: 'PLN-202610-12',
      title: 'Cobas 8000 流水线 ISE 模块及进样轨道月度维护计划',
      deviceId: 'DEV-RULE-003',
      deviceName: 'Cobas 8000 全自动生化免疫流水线',
      deviceCode: '125101',
      department: '生化组',
      planType: '月度检查计划',
      scheduledDate: '2026-10-31',
      timeSlot: '08:00~10:00',
      cycle: '每月一次',
      responsible: '陈志远 (主管检验师)',
      reviewer: '张建华 (主任医师)',
      priority: '高',
      status: '待执行',
      remarks: '月末总结日实施，全面保养主进样架轨道和 ISE 电极管路',
      items: [
        { id: 'pi-28', name: 'K/Na/Cl 离子参比电极内充液补充及斜率', standard: '斜率均在95%~105%之间', isKeyItem: true },
        { id: 'pi-29', name: '主传送带轨道抓手电磁铁吸力测试', standard: '抓管稳定牢固', isKeyItem: false },
      ],
    },
    {
      id: 'PLN-202611-001',
      code: 'PLN-202611-01',
      title: 'Sysmex XN-9000 试剂分配器滤网与注射器季度保养计划',
      deviceId: 'DEV-RULE-004',
      deviceName: 'Sysmex XN-9000 全自动血细胞分析流水线',
      deviceCode: '126202',
      department: '临检组',
      planType: '季度保养计划',
      scheduledDate: '2026-11-02',
      timeSlot: '13:30~16:30',
      cycle: '每季度一次',
      responsible: '孙晓东 (副主任技师)',
      reviewer: '王雪梅 (副主任检验师)',
      priority: '高',
      status: '待执行',
      remarks: '下月首个工作周执行，重点更换分配注射器密封圈',
      items: [
        { id: 'pi-30', name: '试剂进样过滤网反冲清洗与沉淀清除', standard: '网孔洁净无颗粒沉积', isKeyItem: true },
        { id: 'pi-31', name: '微量分配精密玻璃注射器活塞气密性测试', standard: '加压无渗漏气泡', isKeyItem: true },
      ],
    },
  ]);

  // 视图控制: 'month' (月视图) | 'week' (周视图) | 'day' (日视图)
  const [planViewMode, setPlanViewMode] = useState<'month' | 'week' | 'day'>('month');
  // 当前聚焦日期 (默认取近期 2026-10-30)
  const [currentPlanDate, setCurrentPlanDate] = useState<string>('2026-10-30');
  // 筛选器状态
  const [planDeptFilter, setPlanDeptFilter] = useState<string>('全部');
  const [planTypeFilter, setPlanTypeFilter] = useState<string>('全部');
  const [planSearchKeyword, setPlanSearchKeyword] = useState<string>('');

  // 弹窗状态
  const [isAddPlanModalOpen, setIsAddPlanModalOpen] = useState(false);
  const [isPlanDetailModalOpen, setIsPlanDetailModalOpen] = useState(false);
  const [selectedPlanForDetail, setSelectedPlanForDetail] = useState<DevicePlanItem | null>(null);

  // 新增计划表单
  const [newPlanForm, setNewPlanForm] = useState({
    title: '',
    deviceId: 'DEV-RULE-001',
    deviceName: 'AU2700 全自动生化分析仪',
    deviceCode: '124323',
    department: '生化组',
    planType: '月度检查计划' as DevicePlanItem['planType'],
    scheduledDate: '2026-10-30',
    timeSlot: '08:30~10:30',
    cycle: '每月一次',
    responsible: '陈志远 (主管检验师)',
    reviewer: '王雪梅 (副主任检验师)',
    priority: '高' as DevicePlanItem['priority'],
    itemsSummary: '1. 关键模块运行精度校准; 2. 传感器灵敏度与基线检测; 3. 光学系统清洁自测',
    remarks: '严格按照 CAP / ISO15189 设备管理标准执行',
  });

  // 过滤后的计划列表
  const filteredPlans = useMemo(() => {
    return devicePlanList.filter((p) => {
      const matchDept = planDeptFilter === '全部' || p.department.includes(planDeptFilter);
      const matchType = planTypeFilter === '全部' || p.planType === planTypeFilter;
      const matchKey =
        !planSearchKeyword.trim() ||
        p.title.toLowerCase().includes(planSearchKeyword.trim().toLowerCase()) ||
        p.deviceName.toLowerCase().includes(planSearchKeyword.trim().toLowerCase()) ||
        p.responsible.toLowerCase().includes(planSearchKeyword.trim().toLowerCase());
      return matchDept && matchType && matchKey;
    });
  }, [devicePlanList, planDeptFilter, planTypeFilter, planSearchKeyword]);

  // 日期解析与日历计算
  const parsedDate = useMemo(() => {
    const parts = currentPlanDate.split('-');
    const year = parseInt(parts[0], 10) || 2026;
    const month = parseInt(parts[1], 10) || 10;
    const day = parseInt(parts[2], 10) || 30;
    return { year, month, day };
  }, [currentPlanDate]);

  // 月视图网格数据 (生成 35 或 42 格，包含周日到周六)
  const monthCalendarGrid = useMemo(() => {
    const { year, month } = parsedDate;
    const firstDayIndex = new Date(year, month - 1, 1).getDay(); // 0 是周日
    const daysInCurrentMonth = new Date(year, month, 0).getDate();
    const daysInPrevMonth = new Date(year, month - 1, 0).getDate();

    const cells: Array<{
      dateStr: string;
      dayNumber: number;
      isCurrentMonth: boolean;
      isToday: boolean;
      plans: DevicePlanItem[];
    }> = [];

    // 上个月补足
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dayNum = daysInPrevMonth - i;
      const prevMonth = month === 1 ? 12 : month - 1;
      const prevYear = month === 1 ? year - 1 : year;
      const dateStr = `${prevYear}-${String(prevMonth).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
      const plans = filteredPlans.filter((p) => p.scheduledDate === dateStr);
      cells.push({
        dateStr,
        dayNumber: dayNum,
        isCurrentMonth: false,
        isToday: dateStr === '2026-10-30',
        plans,
      });
    }

    // 当月天数
    for (let dayNum = 1; dayNum <= daysInCurrentMonth; dayNum++) {
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
      const plans = filteredPlans.filter((p) => p.scheduledDate === dateStr);
      cells.push({
        dateStr,
        dayNumber: dayNum,
        isCurrentMonth: true,
        isToday: dateStr === '2026-10-30',
        plans,
      });
    }

    // 下个月补足凑齐整周 (总数扩充为7的倍数，至少35格)
    const totalSlots = cells.length <= 35 ? 35 : 42;
    const remaining = totalSlots - cells.length;
    for (let dayNum = 1; dayNum <= remaining; dayNum++) {
      const nextMonth = month === 12 ? 1 : month + 1;
      const nextYear = month === 12 ? year + 1 : year;
      const dateStr = `${nextYear}-${String(nextMonth).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
      const plans = filteredPlans.filter((p) => p.scheduledDate === dateStr);
      cells.push({
        dateStr,
        dayNumber: dayNum,
        isCurrentMonth: false,
        isToday: dateStr === '2026-10-30',
        plans,
      });
    }

    return cells;
  }, [parsedDate, filteredPlans]);

  // 周视图数据 (当前选定日期所在的 7 天: 周日 ~ 周六)
  const weekCalendarDays = useMemo(() => {
    const { year, month, day } = parsedDate;
    const baseDate = new Date(year, month - 1, day);
    const dayOfWeek = baseDate.getDay(); // 0 is Sunday
    const startOfWeek = new Date(baseDate);
    startOfWeek.setDate(baseDate.getDate() - dayOfWeek);

    const weekDays: Array<{
      dateStr: string;
      weekdayName: string;
      dayNumber: number;
      monthNumber: number;
      isToday: boolean;
      plans: DevicePlanItem[];
    }> = [];

    const weekdayLabels = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

    for (let i = 0; i < 7; i++) {
      const cur = new Date(startOfWeek);
      cur.setDate(startOfWeek.getDate() + i);
      const y = cur.getFullYear();
      const m = cur.getMonth() + 1;
      const d = cur.getDate();
      const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const plans = filteredPlans.filter((p) => p.scheduledDate === dateStr);
      weekDays.push({
        dateStr,
        weekdayName: weekdayLabels[i],
        dayNumber: d,
        monthNumber: m,
        isToday: dateStr === '2026-10-30',
        plans,
      });
    }

    return weekDays;
  }, [parsedDate, filteredPlans]);

  // 日视图数据 (当前选定日期的所有计划)
  const dayPlans = useMemo(() => {
    return filteredPlans.filter((p) => p.scheduledDate === currentPlanDate);
  }, [filteredPlans, currentPlanDate]);

  // 日期快速翻页
  const handlePrevDate = () => {
    const { year, month, day } = parsedDate;
    const cur = new Date(year, month - 1, day);
    if (planViewMode === 'month') {
      cur.setMonth(cur.getMonth() - 1);
    } else if (planViewMode === 'week') {
      cur.setDate(cur.getDate() - 7);
    } else {
      cur.setDate(cur.getDate() - 1);
    }
    const y = cur.getFullYear();
    const m = String(cur.getMonth() + 1).padStart(2, '0');
    const d = String(cur.getDate()).padStart(2, '0');
    setCurrentPlanDate(`${y}-${m}-${d}`);
  };

  const handleNextDate = () => {
    const { year, month, day } = parsedDate;
    const cur = new Date(year, month - 1, day);
    if (planViewMode === 'month') {
      cur.setMonth(cur.getMonth() + 1);
    } else if (planViewMode === 'week') {
      cur.setDate(cur.getDate() + 7);
    } else {
      cur.setDate(cur.getDate() + 1);
    }
    const y = cur.getFullYear();
    const m = String(cur.getMonth() + 1).padStart(2, '0');
    const d = String(cur.getDate()).padStart(2, '0');
    setCurrentPlanDate(`${y}-${m}-${d}`);
  };

  const handleGotoToday = () => {
    setCurrentPlanDate('2026-10-30');
    triggerAction('已定位到今日：2026年10月30日');
  };

  // 打开计划详情弹窗
  const handleOpenPlanDetail = (plan: DevicePlanItem) => {
    setSelectedPlanForDetail(plan);
    setIsPlanDetailModalOpen(true);
  };

  // 切换计划执行状态 (标记完成 / 撤回)
  const handleTogglePlanStatus = (planId: string) => {
    const updated = devicePlanList.map((p) => {
      if (p.id === planId) {
        if (p.status === '已完成') {
          return { ...p, status: '待执行' as const, completedAt: undefined, completedBy: undefined };
        } else {
          return {
            ...p,
            status: '已完成' as const,
            completedAt: '2026-10-30 09:30',
            completedBy: user?.name || '陈志远',
          };
        }
      }
      return p;
    });
    setDevicePlanList(updated);
    if (selectedPlanForDetail && selectedPlanForDetail.id === planId) {
      const current = updated.find((p) => p.id === planId);
      if (current) setSelectedPlanForDetail(current);
    }
    triggerAction('检查计划状态已更新！');
  };

  // 删除计划
  const handleDeletePlan = (planId: string) => {
    setDevicePlanList(devicePlanList.filter((p) => p.id !== planId));
    setIsPlanDetailModalOpen(false);
    triggerAction('该设备检查计划已从日程中移除！');
  };

  // 保存新建计划
  const handleSaveNewPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlanForm.title.trim()) return;

    const splittedItems: DevicePlanCheckItem[] = newPlanForm.itemsSummary
      .split(';')
      .map((txt, idx) => ({
        id: `pi-new-${Date.now()}-${idx}`,
        name: txt.trim(),
        standard: '符合原厂技术规范与ISO15189要求',
        isKeyItem: idx === 0,
      }))
      .filter((itm) => itm.name.length > 0);

    const newPlan: DevicePlanItem = {
      id: `PLN-${Date.now()}`,
      code: `PLN-202611-0${devicePlanList.length + 1}`,
      title: newPlanForm.title.trim(),
      deviceId: newPlanForm.deviceId,
      deviceName: newPlanForm.deviceName,
      deviceCode: newPlanForm.deviceCode,
      department: newPlanForm.department,
      planType: newPlanForm.planType,
      scheduledDate: newPlanForm.scheduledDate,
      timeSlot: newPlanForm.timeSlot,
      cycle: newPlanForm.cycle,
      responsible: newPlanForm.responsible,
      reviewer: newPlanForm.reviewer,
      priority: newPlanForm.priority,
      status: '待执行',
      items: splittedItems.length > 0 ? splittedItems : [
        { id: `pi-def-1`, name: '设备核心性能参数核验', standard: '指标处于合格受控区间', isKeyItem: true },
      ],
      remarks: newPlanForm.remarks,
    };

    setDevicePlanList([...devicePlanList, newPlan]);
    setIsAddPlanModalOpen(false);
    triggerAction(`新增设备检查计划《${newPlan.title}》成功！`);
  };

  const deviceRecords = [
    { id: 'REC-20261030-01', device: 'Sysmex XN-9000', checkTime: '2026-10-30 07:30', type: '日检', result: '合格', details: 'WBC/RBC/PLT背景计数均在正常极低范围，试剂充足', operator: '李静' },
  ];

  const specimenManageRows = [
    { id: 'SPM-20261030-01', type: '血液标本 (血清)', receivedTotal: '580 管', qualifiedRate: '99.7%', defectCount: '2 管', storageStatus: '4℃冰箱 A-02架', destroyDate: '2026-11-06' },
  ];

  const reportQueryRows = [
    { barcode: '0011812170001', patient: '杜文斌', age: '48岁', dept: '内科(感染病区)', project: '血培养及药敏测定', result: '多重耐药结核分枝杆菌 (MDR-TB)', reportTime: '2026-10-30 08:35', doctor: '张先义', auditDoctor: '郭海平', status: '已双签发' },
  ];

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-slate-100 overflow-hidden text-slate-800 text-xs">
      <div className="flex-1 min-h-0 overflow-y-auto flex flex-col space-y-3">
        {/* ============================================================== */}
        {/* TAB 1: 排班班次定义 (标本核收头部风格 + 截图表格数据 + 点击左侧弹出详细规则配置) */}
        {/* ============================================================== */}
        {activeTab === 'dept-shift-def' && (
          <div className="space-y-3 px-4">
            {/* 标本核收统一风格头部 */}
            <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-2xs space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-sky-50 rounded-lg border border-sky-200 text-sky-700">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-bold text-slate-900 text-sm">排班班次定义 (检验科临床工作班次标准)</h2>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-700 border border-sky-200">
                        ISO15189 / 考勤工时受控
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      规范全科常规检测班、门诊急查班、通宵大夜班、微生物培养班之工时标准、夜班津贴与岗位权限
                    </p>
                  </div>
                </div>

                {/* 汇总指标卡片 */}
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1 bg-slate-50 rounded-lg border border-slate-200 text-center">
                    <span className="text-[10px] text-slate-500 block">定义班次</span>
                    <span className="text-xs font-bold font-mono text-slate-800">{shifts.length} 个</span>
                  </div>
                  <div className="px-3 py-1 bg-emerald-50 rounded-lg border border-emerald-200 text-center">
                    <span className="text-[10px] text-emerald-600 block">启用中</span>
                    <span className="text-xs font-bold font-mono text-emerald-700">
                      {shifts.filter((s) => s.status === '启用').length} 个
                    </span>
                  </div>
                  <div className="px-3 py-1 bg-amber-50 rounded-lg border border-amber-200 text-center">
                    <span className="text-[10px] text-amber-600 block">停用储备</span>
                    <span className="text-xs font-bold font-mono text-amber-700">
                      {shifts.filter((s) => s.status !== '启用').length} 个
                    </span>
                  </div>
                </div>
              </div>

              {/* 截图对应操作过滤栏 (名称输入框、状态下拉框、查询按钮、新增按钮) */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-3 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-700 whitespace-nowrap">名称:</span>
                    <input
                      type="text"
                      value={shiftSearchName}
                      onChange={(e) => setShiftSearchName(e.target.value)}
                      placeholder="搜索班次编码或名称..."
                      className="w-48 px-3 py-1 bg-slate-50 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-700 whitespace-nowrap">状态:</span>
                    <select
                      value={shiftSearchStatus}
                      onChange={(e) => setShiftSearchStatus(e.target.value)}
                      className="px-3 py-1 bg-slate-50 border border-slate-300 rounded text-xs text-slate-800 font-medium focus:outline-none focus:border-sky-500"
                    >
                      <option value="全部">全部状态</option>
                      <option value="启用">启用</option>
                      <option value="停用">停用</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-700 whitespace-nowrap">所属组别:</span>
                    <select
                      value={shiftGroupFilter}
                      onChange={(e) => setShiftGroupFilter(e.target.value)}
                      className="px-3 py-1 bg-slate-50 border border-slate-300 rounded text-xs text-slate-800 font-medium focus:outline-none focus:border-sky-500"
                    >
                      <option value="全部">全部专业组</option>
                      <option value="生化">生化/免疫组</option>
                      <option value="临检">临床检验组</option>
                      <option value="急诊">急诊急查岗</option>
                      <option value="微生物">微生物组</option>
                      <option value="行政">行政与质控</option>
                    </select>
                  </div>

                  <button
                    onClick={() => triggerAction(`检索匹配到 ${filteredShifts.length} 个排班班次`)}
                    className="px-3.5 py-1 bg-sky-600 hover:bg-sky-700 text-white rounded text-xs font-semibold shadow-2xs flex items-center gap-1"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>查询</span>
                  </button>

                  <button
                    onClick={() => {
                      setShiftSearchName('');
                      setShiftSearchStatus('全部');
                      setShiftGroupFilter('全部');
                    }}
                    className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-semibold"
                  >
                    重置
                  </button>
                </div>

                {/* 截图右上角【新增】按钮 */}
                <button
                  onClick={handleOpenAddShift}
                  className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>新增</span>
                </button>
              </div>
            </div>

            {/* 班次表格主界面 (对应截图格式：班次编码、班次名称、时间段、状态、操作；点击后弹窗展示规则详情) */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
              <div className="p-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                <span className="font-semibold text-slate-700">排班班次规则清单</span>
                <span className="text-slate-400 font-mono hidden sm:inline">
                  提示：点击任意班次行或【详情】按钮，将在弹窗中展示完整班次规则与配置参数
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[760px]">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold text-[11px] uppercase tracking-wider">
                    <tr>
                      <th className="py-2.5 px-4 w-24 font-mono">班次编码</th>
                      <th className="py-2.5 px-4 min-w-[150px]">班次名称</th>
                      <th className="py-2.5 px-4 min-w-[170px] font-mono">时间段</th>
                      <th className="py-2.5 px-4 w-24 text-center font-mono">标准工时</th>
                      <th className="py-2.5 px-4 w-24 text-center font-mono">夜班津贴</th>
                      <th className="py-2.5 px-4 min-w-[140px]">适用部门/专业组</th>
                      <th className="py-2.5 px-4 min-w-[130px]">维护人</th>
                      <th className="py-2.5 px-4 w-20 text-center">状态</th>
                      <th className="py-2.5 px-4 w-44 text-center">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700 text-xs">
                    {filteredShifts.map((shift) => (
                      <tr
                        key={shift.id}
                        onClick={() => {
                          setSelectedShiftForDetail(shift);
                          setIsShiftDetailModalOpen(true);
                        }}
                        className="hover:bg-sky-50/50 cursor-pointer transition-colors"
                      >
                        <td className="py-2.5 px-4 font-mono font-bold text-sky-700">{shift.code}</td>
                        <td className="py-2.5 px-4 font-bold text-slate-900">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                            <span>{shift.name}</span>
                          </div>
                        </td>
                        <td className="py-2.5 px-4 font-mono text-slate-800 font-semibold">{shift.timeSlot}</td>
                        <td className="py-2.5 px-4 text-center font-mono text-slate-700">{shift.duration}</td>
                        <td className="py-2.5 px-4 text-center font-mono font-semibold text-amber-700">{shift.allowance}</td>
                        <td className="py-2.5 px-4 text-slate-700 font-medium">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] border border-slate-200">
                            {shift.department}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-slate-800 font-medium">{shift.creator}</td>
                        <td className="py-2.5 px-4 text-center">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                              shift.status === '启用'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-slate-100 text-slate-500 border border-slate-200'
                            }`}
                          >
                            {shift.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-center gap-2 text-xs">
                            <button
                              onClick={() => {
                                setSelectedShiftForDetail(shift);
                                setIsShiftDetailModalOpen(true);
                              }}
                              className="text-sky-600 hover:text-sky-800 hover:underline font-semibold"
                            >
                              详情
                            </button>
                            <span className="text-slate-300">|</span>
                            <button
                              onClick={() => handleOpenEditShift(shift)}
                              className="text-sky-600 hover:text-sky-800 hover:underline font-semibold"
                            >
                              编辑
                            </button>
                            <span className="text-slate-300">|</span>
                            <button
                              onClick={() => handleToggleShiftStatus(shift)}
                              className="text-amber-600 hover:text-amber-800 hover:underline font-semibold"
                            >
                              {shift.status === '启用' ? '停用' : '启用'}
                            </button>
                            <span className="text-slate-300">|</span>
                            <button
                              onClick={() => setDeletingShift(shift)}
                              className="text-rose-600 hover:text-rose-800 hover:underline font-semibold"
                            >
                              删除
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 截图左下角标志性“合计: 6条”样式 */}
              <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
                <span className="font-bold text-sky-800 font-mono">
                  合计: {filteredShifts.length}条
                </span>
                <span className="text-[11px] text-slate-500">
                  符合《医疗机构临床实验室考勤与轮班管理工作规范》要求
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: 人员档案管理 (对应截图2、3、4：左侧部门人员列表，右侧10个页签内容联动跟着变) */}
        {/* ============================================================== */}
        {activeTab === 'dept-staff-profile' && (
          <div className="space-y-3 px-4">
            {/* 统一风格头部 */}
            <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-2xs space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-sky-50 rounded-lg border border-sky-200 text-sky-700">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-bold text-slate-900 text-sm">人员档案管理 (检验医学科业务技术档案)</h2>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-700 border border-sky-200">
                        医师/技师资质受控
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      集中管理检验科医务人员执业资格、任职情况、学历学位、科研论文、培训带教与健康监护记录
                    </p>
                  </div>
                </div>

                {/* 汇总指标卡片 */}
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1 bg-slate-50 rounded-lg border border-slate-200 text-center">
                    <span className="text-[10px] text-slate-500 block">在册人员</span>
                    <span className="text-xs font-bold font-mono text-slate-800">{staffList.length} 人</span>
                  </div>
                  <div className="px-3 py-1 bg-emerald-50 rounded-lg border border-emerald-200 text-center">
                    <span className="text-[10px] text-emerald-600 block">高级职称</span>
                    <span className="text-xs font-bold font-mono text-emerald-700">
                      {staffList.filter((s) => s.titleLevel.includes('高级')).length} 人
                    </span>
                  </div>
                  <div className="px-3 py-1 bg-sky-50 rounded-lg border border-sky-200 text-center">
                    <span className="text-[10px] text-sky-600 block">持证上岗率</span>
                    <span className="text-xs font-bold font-mono text-sky-700">100%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 人员档案表格列表 (全宽主视图展示，点击行或【查看档案】后弹窗展示右侧10大页签档案详情) */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs flex flex-col">
              {/* 工具栏：部门选择、快速搜索、新增档案及操作按钮 */}
              <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-700 text-xs whitespace-nowrap">部门筛选:</span>
                    <select
                      value={staffDeptFilter}
                      onChange={(e) => setStaffDeptFilter(e.target.value)}
                      className="px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-800 font-medium focus:outline-none focus:border-sky-500"
                    >
                      <option value="全部">全部部门 (检验科全员)</option>
                      <option value="检验科">检验科行政与质控</option>
                      <option value="生化">临床生化组</option>
                      <option value="门诊">门诊采血组</option>
                      <option value="微生物">微生物检验组</option>
                      <option value="急诊">急诊临检组</option>
                      <option value="质谱">质谱分子组</option>
                      <option value="血液">血液形态组</option>
                    </select>
                  </div>

                  <div className="relative w-64">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={staffSearchKey}
                      onChange={(e) => setStaffSearchKey(e.target.value)}
                      placeholder="输入姓名 / 工号 / 身份证号 / 电话快速查询..."
                      className="w-full pl-8 pr-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  {(staffDeptFilter !== '全部' || staffSearchKey) && (
                    <button
                      onClick={() => {
                        setStaffDeptFilter('全部');
                        setStaffSearchKey('');
                      }}
                      className="text-xs text-sky-600 hover:text-sky-700 underline flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>重置筛选</span>
                    </button>
                  )}
                </div>

                {/* 右侧动作按钮组 */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsStaffManagementModalOpen(true)}
                    className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded text-xs font-semibold shadow-2xs flex items-center gap-1.5 transition-colors"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>档案管理 (新增人员)</span>
                  </button>

                  <button
                    onClick={() => triggerAction('已成功导出检验医学科人员花名册与专业资质台账 (Excel)')}
                    className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded text-xs font-medium flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-500" />
                    <span>导出名册</span>
                  </button>

                  <button
                    onClick={() => triggerAction('已发送人员名册与资质受控台账至默认打印机')}
                    className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded text-xs font-medium flex items-center gap-1"
                  >
                    <Printer className="w-3.5 h-3.5 text-slate-500" />
                    <span>打印台账</span>
                  </button>
                </div>
              </div>

              {/* 人员档案全宽表格列表 */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[980px]">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold text-xs">
                    <tr>
                      <th className="py-3 px-4 w-28">姓名</th>
                      <th className="py-3 px-3 w-24 font-mono">人员编号</th>
                      <th className="py-3 px-2 w-16 text-center">性别</th>
                      <th className="py-3 px-2 w-16 text-center">民族</th>
                      <th className="py-3 px-3 w-28 font-mono">出生日期</th>
                      <th className="py-3 px-3 w-44 font-mono">身份证号</th>
                      <th className="py-3 px-3">所属部门 / 专业组</th>
                      <th className="py-3 px-3 w-36">技术职称 / 职务</th>
                      <th className="py-3 px-3 w-32 font-mono">联系电话</th>
                      <th className="py-3 px-2 w-20 text-center">状态</th>
                      <th className="py-3 px-4 w-32 text-center">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                    {filteredStaffs.length === 0 ? (
                      <tr>
                        <td colSpan={11} className="py-12 text-center text-slate-400">
                          未查询到符合条件的人员档案记录
                        </td>
                      </tr>
                    ) : (
                      filteredStaffs.map((stf) => (
                        <tr
                          key={stf.id}
                          onClick={() => handleOpenStaffModal(stf, 1)}
                          className="cursor-pointer transition-colors hover:bg-sky-50/70 group"
                        >
                          <td className="py-3 px-4 font-bold text-slate-900 group-hover:text-sky-700 flex items-center gap-2">
                            <span className="w-7 h-7 rounded-full bg-sky-100 text-sky-700 font-bold text-xs flex items-center justify-center shrink-0 border border-sky-200">
                              {stf.name.slice(0, 1)}
                            </span>
                            <span>{stf.name}</span>
                          </td>
                          <td className="py-3 px-3 font-mono font-semibold text-sky-700">{stf.code}</td>
                          <td className="py-3 px-2 text-center text-slate-600">{stf.gender}</td>
                          <td className="py-3 px-2 text-center text-slate-600">{stf.nation}</td>
                          <td className="py-3 px-3 font-mono text-slate-600">{stf.birthDate}</td>
                          <td className="py-3 px-3 font-mono text-slate-600 text-[11px]">{stf.idCard}</td>
                          <td className="py-3 px-3 text-slate-800 font-medium">{stf.department}</td>
                          <td className="py-3 px-3">
                            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-sky-50 text-sky-800 border border-sky-200">
                              {stf.title}
                            </span>
                          </td>
                          <td className="py-3 px-3 font-mono text-slate-600">{stf.phone}</td>
                          <td className="py-3 px-2 text-center">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                              {stf.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                              <button
                                type="button"
                                onClick={() => handleOpenStaffModal(stf, 1)}
                                className="px-2.5 py-1 bg-sky-50 hover:bg-sky-100 text-sky-700 rounded text-xs font-semibold flex items-center gap-1 border border-sky-200 transition-colors shadow-2xs"
                                title="点击在弹窗中查看该人员10项完整业务技术档案"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>查看档案</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* 截图左下角标志性“合计: 6条”样式 + 快捷提示 */}
              <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="font-bold text-sky-800 font-mono">
                  合计: {filteredStaffs.length}条
                </div>
                <div className="text-slate-500 text-[11px] flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                  <span>提示：点击表格中任意人员行或【查看档案】按钮，即可在弹窗中完整查阅与维护该员工的10大专业技术履历（基本信息、任职、教育、教学、论文、工作经历、职称、科研、奖惩、健康体检）。</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: 人员排班管理 (完全对应截图5：左侧年份月份提交状态与撤回，右侧部门月周视图、保存/提交/打印、日历班次矩阵表) */}
        {/* ============================================================== */}
        {activeTab === 'dept-staff-schedule' && (
          scheduleViewMode === 'week' ? (
            <StaffSchedulingWeekView
              user={user}
              triggerAction={triggerAction}
              onSwitchMode={(mode) => setScheduleViewMode(mode)}
              currentYear={scheduleYear}
              currentMonth={activeScheduleMonth}
            />
          ) : (
            <div className="space-y-3 px-4">
            {/* 统一风格头部 */}
            <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-2xs space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-sky-50 rounded-lg border border-sky-200 text-sky-700">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-bold text-slate-900 text-sm">人员排班管理 (全科考勤与轮班矩阵调度)</h2>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-700 border border-sky-200">
                        2026年度智能考勤
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      支持月度/周度排班矩阵制定、按月提交审核与撤回、在线调整班次及合规性校验
                    </p>
                  </div>
                </div>

                {/* 汇总指标卡片 */}
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1 bg-slate-50 rounded-lg border border-slate-200 text-center">
                    <span className="text-[10px] text-slate-500 block">排班月份</span>
                    <span className="text-xs font-bold font-mono text-slate-800">{scheduleYear}年{activeScheduleMonth}月</span>
                  </div>
                  <div className="px-3 py-1 bg-emerald-50 rounded-lg border border-emerald-200 text-center">
                    <span className="text-[10px] text-emerald-600 block">当前状态</span>
                    <span className="text-xs font-bold font-mono text-emerald-700">
                      {monthStatusMap[activeScheduleMonth] || '未排'}
                    </span>
                  </div>
                  <div className="px-3 py-1 bg-sky-50 rounded-lg border border-sky-200 text-center">
                    <span className="text-[10px] text-sky-600 block">应出勤人天</span>
                    <span className="text-xs font-bold font-mono text-sky-700">248 人天</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 双面板布局 (左侧月份状态及撤回列表 + 右侧矩阵排班表，完全还原截图5) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 min-h-[580px]">
              {/* 左侧面板：年份选择器与1-12月提交状态及撤回操作 (对应截图5左半区) */}
              <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs flex flex-col">
                {/* 截图年份输入框 (已升级为近期2026年，并带日期图标与翻页) */}
                <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-2 shrink-0">
                  <div className="flex items-center gap-1.5 flex-1">
                    <Calendar className="w-4 h-4 text-sky-600 shrink-0" />
                    <input
                      type="number"
                      value={scheduleYear}
                      onChange={(e) => setScheduleYear(e.target.value)}
                      className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-xs font-mono font-bold text-slate-800 focus:outline-none focus:border-sky-500 text-center"
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-700">年度</span>
                </div>

                {/* 月份表格 (对应截图5列: 月份、排班状态、操作) */}
                <div className="flex-1 overflow-y-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold text-[11px] uppercase">
                      <tr>
                        <th className="py-2.5 px-3 font-mono">月份</th>
                        <th className="py-2.5 px-3 text-center">排班状态</th>
                        <th className="py-2.5 px-3 text-center w-16">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => {
                        const status = monthStatusMap[m] || '未排';
                        const isActive = activeScheduleMonth === m;
                        return (
                          <tr
                            key={m}
                            onClick={() => {
                              setActiveScheduleMonth(m);
                              triggerAction(`已切换至 ${scheduleYear}年${m}月 排班工作表`);
                            }}
                            className={`cursor-pointer transition-colors ${
                              isActive
                                ? 'bg-sky-100/70 border-l-4 border-l-sky-600 font-bold text-sky-950'
                                : 'hover:bg-slate-50'
                            }`}
                          >
                            <td className="py-2.5 px-3 font-mono font-bold">{m}月</td>
                            <td className="py-2.5 px-3 text-center font-semibold">
                              <span
                                className={`text-[11px] ${
                                  status === '已提交'
                                    ? 'text-emerald-700 font-bold'
                                    : status === '未提交'
                                    ? 'text-sky-600 font-bold'
                                    : 'text-amber-600'
                                }`}
                              >
                                {status}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              {status === '已提交' ? (
                                <button
                                  onClick={(e) => handleRevokeMonthSubmit(m, e)}
                                  className="text-sky-600 hover:text-sky-800 hover:underline font-semibold text-[11px]"
                                >
                                  撤回
                                </button>
                              ) : status === '未提交' ? (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setMonthStatusMap((prev) => ({ ...prev, [m]: '已提交' }));
                                    triggerAction(`${m}月排班表已正式提交核准！`);
                                  }}
                                  className="text-emerald-600 hover:text-emerald-800 hover:underline font-semibold text-[11px]"
                                >
                                  提交
                                </button>
                              ) : (
                                <span className="text-slate-300 text-[11px]">-</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="p-2.5 bg-slate-50 border-t border-slate-200 text-[10px] text-slate-400">
                  说明：点击左侧月份切换排班表；已提交月份支持主管撤回重新调整。
                </div>
              </div>

              {/* 右侧主面板：部门下拉、月视图/周视图、保存/提交/打印、排班矩阵大表 (完全还原截图5右半区) */}
              <div className="lg:col-span-9 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs flex flex-col min-w-0">
                {/* 顶部工具栏 (截图5对应: 部门下拉框、[月视图][周视图]切换、[保存][提交][打印]按钮组) */}
                <div className="p-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-700 whitespace-nowrap">部门:</span>
                      <select
                        value={scheduleDeptFilter}
                        onChange={(e) => setScheduleDeptFilter(e.target.value)}
                        className="px-2.5 py-1 bg-white border border-slate-300 rounded text-xs text-slate-800 font-medium focus:outline-none focus:border-sky-500"
                      >
                        <option value="检验科">检验科全科</option>
                        <option value="临床生化组">临床生化组</option>
                        <option value="门诊采血组">门诊采血组</option>
                        <option value="急诊临检组">急诊临检组</option>
                        <option value="微生物检验组">微生物检验组</option>
                        <option value="质谱分子组">质谱分子组</option>
                      </select>
                    </div>

                    {/* [月视图] [周视图] 切换按钮组 (完全对应截图5) */}
                    <div className="inline-flex rounded border border-slate-300 p-0.5 bg-white">
                      <button
                        type="button"
                        onClick={() => setScheduleViewMode('month')}
                        className="px-3 py-0.5 rounded text-xs font-semibold transition-all bg-sky-600 text-white shadow-2xs"
                      >
                        月视图
                      </button>
                      <button
                        type="button"
                        onClick={() => setScheduleViewMode('week')}
                        className="px-3 py-0.5 rounded text-xs font-semibold transition-all text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                      >
                        周视图
                      </button>
                    </div>

                    <span className="text-[11px] text-slate-500 font-mono">
                      {scheduleYear}年{activeScheduleMonth}月份 ({currentMonthDays.length}天)
                    </span>
                  </div>

                  {/* 截图5右上角标志性蓝色按钮组: 【保存】 【提交】 【打印】 */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSaveCurrentMonth}
                      className="px-3.5 py-1 bg-sky-600 hover:bg-sky-700 text-white rounded text-xs font-semibold shadow-2xs flex items-center gap-1"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>保存</span>
                    </button>
                    <button
                      onClick={handleSubmitCurrentMonth}
                      className="px-3.5 py-1 bg-sky-600 hover:bg-sky-700 text-white rounded text-xs font-semibold shadow-2xs flex items-center gap-1"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>提交</span>
                    </button>
                    <button
                      onClick={handlePrintSchedule}
                      className="px-3.5 py-1 bg-sky-600 hover:bg-sky-700 text-white rounded text-xs font-semibold shadow-2xs flex items-center gap-1"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>打印</span>
                    </button>
                  </div>
                </div>

                {/* 排班矩阵大表 (完全还原截图5：蓝色星期标题栏，左侧姓名列，各日班次带有不同颜色如白班绿色、夜班浅蓝、值班红色、休息灰色，点击可快捷切换) */}
                <div className="flex-1 overflow-x-auto overflow-y-auto">
                  <table className="w-full text-center border-collapse min-w-[980px]">
                    {/* 截图标志性蓝色标题表头 */}
                    <thead className="bg-sky-600 text-white font-bold text-xs sticky top-0 z-20">
                      <tr>
                        <th className="py-2.5 px-3 w-24 border-r border-sky-500 text-center sticky left-0 bg-sky-600 z-30">
                          姓名
                        </th>
                        {currentMonthDays.map((col) => (
                          <th
                            key={col.day}
                            className={`py-2 px-1 border-r border-sky-500 font-mono text-[11px] min-w-[50px] ${
                              col.isWeekend ? 'bg-sky-700/80 font-bold' : ''
                            }`}
                          >
                            {col.day}/{col.week}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-xs">
                      {staffList.map((stf) => (
                        <tr key={stf.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-2.5 px-3 font-bold text-slate-900 border-r border-slate-200 sticky left-0 bg-white z-10 shadow-xs whitespace-nowrap">
                            {stf.name}
                          </td>
                          {currentMonthDays.map((col) => {
                            const shiftVal = getAssignment(activeScheduleMonth, stf.id, col.day);
                            const isDropdownActive =
                              activeCellShiftDropdown?.staffId === stf.id &&
                              activeCellShiftDropdown?.day === col.day;

                            return (
                              <td
                                key={col.day}
                                className={`py-1.5 px-1 border-r border-slate-100 relative group cursor-pointer ${
                                  col.isWeekend ? 'bg-slate-50/50' : ''
                                }`}
                                onClick={() => {
                                  setActiveCellShiftDropdown(
                                    isDropdownActive ? null : { staffId: stf.id, day: col.day }
                                  );
                                }}
                              >
                                {/* 截图对应各班次显示风格与颜色 */}
                                <div className="flex items-center justify-center gap-0.5">
                                  <span
                                    className={`text-xs ${
                                      shiftVal === '白班'
                                        ? 'text-emerald-600 font-medium'
                                        : shiftVal === '夜班' || shiftVal === '小夜班' || shiftVal === '大夜班'
                                        ? 'text-sky-600 font-medium'
                                        : shiftVal === '值班'
                                        ? 'text-rose-600 font-bold'
                                        : shiftVal === '早班'
                                        ? 'text-teal-600 font-medium'
                                        : 'text-slate-400 font-medium'
                                    }`}
                                  >
                                    {shiftVal}
                                  </span>
                                  {/* 截图中的微型小箭头提示可下拉 */}
                                  <ChevronDown className="w-2.5 h-2.5 text-slate-300 opacity-0 group-hover:opacity-100" />
                                </div>

                                {/* 班次快捷调整弹窗/下拉菜单 */}
                                {isDropdownActive && (
                                  <div
                                    className="absolute left-1/2 -translate-x-1/2 top-full mt-1 z-50 bg-white border border-slate-300 rounded-lg shadow-xl p-1.5 min-w-[85px] grid grid-cols-2 gap-1 animate-fadeIn"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    {SHIFT_OPTIONS.map((opt) => (
                                      <button
                                        key={opt}
                                        type="button"
                                        onClick={() => {
                                          handleCellShiftChange(activeScheduleMonth, stf.id, col.day, opt);
                                          setActiveCellShiftDropdown(null);
                                        }}
                                        className={`px-1.5 py-1 text-[10px] rounded font-semibold transition-all ${
                                          opt === shiftVal
                                            ? 'bg-sky-600 text-white'
                                            : 'hover:bg-sky-50 text-slate-700'
                                        }`}
                                      >
                                        {opt}
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* 页脚说明与智能排班快捷操作栏 */}
                <div className="p-2.5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-600 shrink-0">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                      <span>白班 (常规发单)</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
                      <span>夜班 (急诊危急值响应)</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                      <span>值班 (周末双岗值守)</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
                      <span>休息 (法定轮休)</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => triggerAction('合规性校验通过：连续大夜班未超过2天，夜班后休假满足≥24h！')}
                      className="px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold hover:bg-emerald-100"
                    >
                      工时合规校验
                    </button>
                    <button
                      onClick={() => triggerAction(`已导出 ${scheduleYear}年${activeScheduleMonth}月 排班Excel电子表！`)}
                      className="px-2.5 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200 font-semibold hover:bg-sky-100"
                    >
                      导出排班表格
                    </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    )}

        {/* ============================================================== */}
        {/* TAB 4: 科室文档管理 (根据用户最新截图及要求：左侧树分类与新增编辑删除，点击左侧，右侧受控文档跟着变!) */}
        {/* ============================================================== */}
        {activeTab === 'dept-doc-manage' && (
          <div className="flex flex-col md:flex-row gap-3 px-4 py-1 flex-1 min-h-[580px]">
            {/* 左侧面板：分类树与分类管理按钮 (完全对应截图左侧结构) */}
            <div className="w-full md:w-60 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs flex flex-col shrink-0">
              {/* 左侧头部按钮区: 【新增】 【编辑】 【删除】 (对应截图左上角) */}
              <div className="p-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-1">
                <button
                  onClick={() => setIsAddCatModalOpen(true)}
                  className="px-2.5 py-1 bg-sky-600 hover:bg-sky-700 text-white rounded text-[11px] font-semibold flex items-center gap-1 shadow-2xs"
                >
                  <Plus className="w-3 h-3" />
                  <span>新增</span>
                </button>
                <button
                  onClick={() => triggerAction('已打开分类修改窗')}
                  className="px-2.5 py-1 bg-white hover:bg-slate-100 text-sky-700 border border-sky-300 rounded text-[11px] font-semibold"
                >
                  编辑
                </button>
                <button
                  onClick={() => triggerAction('提示：顶级受控分类不可直接删除')}
                  className="px-2.5 py-1 bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 rounded text-[11px] font-semibold"
                >
                  删除
                </button>
              </div>

              {/* 左侧树形目录结构 (对应截图分类: 质量管理类/15189评审资料, 操作流程类/生化组/临检组, 科室规章制度) */}
              <div className="p-2 overflow-y-auto flex-1 text-xs space-y-1">
                {docCategories.map((cat) => {
                  const isSelected = selectedCatId === cat.id;
                  const isChild = cat.parentId !== null;
                  return (
                    <div
                      key={cat.id}
                      onClick={() => {
                        setSelectedCatId(cat.id);
                        triggerAction(`已选择分类《${cat.label}》，右侧文档库已同步更新`);
                      }}
                      className={`px-2.5 py-2 rounded-lg cursor-pointer transition-all flex items-center justify-between ${
                        isChild ? 'ml-4' : ''
                      } ${
                        isSelected
                          ? 'bg-sky-600 text-white font-bold shadow-xs'
                          : 'hover:bg-slate-100 text-slate-700 font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Folder className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-white' : 'text-sky-600'}`} />
                        <span className="truncate">{cat.label}</span>
                      </div>
                      <span className={`text-[10px] font-mono rounded px-1.5 py-0.2 ${
                        isSelected ? 'bg-sky-700 text-sky-100' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {docList.filter((d) => d.categoryId === cat.id || cat.id === 'cat-all').length}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="p-2.5 bg-slate-50 border-t border-slate-200 text-[10px] text-slate-400">
                提示：点击左侧文档目录树，右侧将实时切换并联动显示该分类下的受控文件。
              </div>
            </div>

            {/* 右侧主面板：文档搜索、操作栏与受控文档数据列表 (完全对应截图右侧结构) */}
            <div className="flex-1 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs flex flex-col min-w-0">
              {/* 右侧顶部搜索与动作栏 (对应截图右侧: 文档名称 [输入框] 【查询】 [新增] [编辑] [删除]) */}
              <div className="p-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
                <div className="flex items-center gap-2 flex-1 min-w-[240px]">
                  <span className="font-semibold text-slate-700 whitespace-nowrap">文档名称:</span>
                  <input
                    type="text"
                    value={docSearchKeyword}
                    onChange={(e) => setDocSearchKeyword(e.target.value)}
                    placeholder="输入文件标题、SOP编号或起草人搜索..."
                    className="w-full max-w-xs px-3 py-1 bg-white border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-sky-500"
                  />
                  <button
                    onClick={() => triggerAction(`检索完成，匹配到 ${filteredDocs.length} 份受控文档`)}
                    className="px-3.5 py-1 bg-sky-600 hover:bg-sky-700 text-white rounded text-xs font-semibold shadow-2xs flex items-center gap-1"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>查询</span>
                  </button>
                </div>

                {/* 右侧主按钮组: 【新增文档】 【编辑文档】 【删除文档】 */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsAddDocModalOpen(true)}
                    className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded text-xs font-semibold flex items-center gap-1 shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>新增文档</span>
                  </button>
                  <button
                    onClick={() => triggerAction('已调出所选文档的受控修改窗')}
                    className="px-3 py-1.5 bg-white hover:bg-slate-100 text-sky-700 border border-sky-300 rounded text-xs font-semibold"
                  >
                    编辑
                  </button>
                  <button
                    onClick={() => triggerAction('已彻底移除所选旧版受控文件存根')}
                    className="px-3 py-1.5 bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 rounded text-xs font-semibold"
                  >
                    删除
                  </button>
                </div>
              </div>

              {/* 右侧受控文档数据列表 (对应截图表格: 文档名称、受控附件、操作人、操作时间、状态、操作) */}
              <div className="flex-1 overflow-x-auto overflow-y-auto">
                <table className="w-full text-left border-collapse min-w-[750px]">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold text-[11px] uppercase">
                    <tr>
                      <th className="py-2.5 px-4 font-mono w-28">文档编号</th>
                      <th className="py-2.5 px-4">文档名称</th>
                      <th className="py-2.5 px-4 text-center font-mono w-20">版本</th>
                      <th className="py-2.5 px-4">受控附件</th>
                      <th className="py-2.5 px-4">操作人 (起草/审核)</th>
                      <th className="py-2.5 px-4 font-mono min-w-[140px]">操作时间</th>
                      <th className="py-2.5 px-4 text-center w-20">状态</th>
                      <th className="py-2.5 px-4 text-center w-32">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700 text-xs">
                    {filteredDocs.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-slate-400">
                          <div className="flex flex-col items-center justify-center gap-2">
                            <Info className="w-6 h-6 text-slate-300" />
                            <span>该分类下暂无匹配的受控文档记录</span>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredDocs.map((doc) => (
                        <tr key={doc.id} className="hover:bg-sky-50/40 transition-colors">
                          <td className="py-3 px-4 font-mono font-medium text-slate-500">{doc.id}</td>
                          <td className="py-3 px-4 font-bold text-slate-900">
                            <div className="flex items-center gap-1.5">
                              <FileText className="w-4 h-4 text-sky-600 shrink-0" />
                              <span>{doc.title}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center font-mono font-bold text-sky-700">{doc.version}</td>
                          <td className="py-3 px-4">
                            <span className="inline-flex items-center gap-1 text-slate-700 font-mono text-[11px] bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                              <FileDown className="w-3 h-3 text-sky-600" />
                              {doc.attachment} ({doc.attachmentSize})
                            </span>
                          </td>
                          <td className="py-3 px-4 font-semibold text-slate-800">{doc.operator}</td>
                          <td className="py-3 px-4 font-mono text-slate-500">{doc.updateTime}</td>
                          <td className="py-3 px-4 text-center">
                            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800">
                              {doc.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <button
                              onClick={() => handleOpenPreviewDoc(doc)}
                              className="px-2.5 py-1 text-sky-600 hover:bg-sky-50 rounded border border-sky-200 font-semibold flex items-center gap-1 mx-auto"
                            >
                              <Eye className="w-3 h-3" />
                              <span>调阅预览</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* 页脚统计 */}
              <div className="p-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-600 shrink-0">
                <div className="font-bold text-sky-700 font-mono">
                  当前分类受控文件: <span className="text-xs">{filteredDocs.length}</span> 份
                </div>
                <div className="text-slate-400">
                  符合 ISO15189 检验受控文件调阅规范 · 当前用户具备调阅与下载权限
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: 设备检查规则 (按用户要求：主页面展示设备列表，点击后弹窗展示右侧“检查类型列表”与“类型明细列表”) */}
        {(activeTab === 'dept-device-rule' || activeTab === 'dept-equip-rules') && (
          <div className="space-y-3 px-4 py-1 flex-1">
            {/* 顶部搜索与过滤工具栏 */}
            <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-2xs flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-700 whitespace-nowrap">使用部门:</span>
                  <select
                    value={deviceDeptFilter}
                    onChange={(e) => setDeviceDeptFilter(e.target.value)}
                    className="px-3 py-1 bg-slate-50 border border-slate-300 rounded text-xs text-slate-800 font-medium focus:outline-none focus:border-sky-500"
                  >
                    <option value="全部">全部使用部门</option>
                    <option value="微生物组">微生物组</option>
                    <option value="生化组">生化组</option>
                    <option value="免疫组">免疫组</option>
                    <option value="临检组">临检组</option>
                    <option value="质谱分子组">质谱分子组</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 flex-1 max-w-xs">
                  <input
                    type="text"
                    value={deviceSearchKey}
                    onChange={(e) => setDeviceSearchKey(e.target.value)}
                    placeholder="搜索设备编码、设备名称或责任人..."
                    className="w-full px-3 py-1 bg-slate-50 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <button
                  onClick={() => triggerAction(`设备过滤匹配结果: ${filteredDeviceRules.length} 台设备`)}
                  className="px-3.5 py-1 bg-sky-600 hover:bg-sky-700 text-white rounded text-xs font-semibold shadow-2xs flex items-center gap-1"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>查询</span>
                </button>
                <button
                  onClick={() => { setDeviceDeptFilter('全部'); setDeviceSearchKey(''); }}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-semibold"
                >
                  重置
                </button>
              </div>


            </div>

            {/* 主界面展示设备表格台账 */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
              <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-xs flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-sky-600" />
                  <span>设备检查规则管理 - 设备台账列表</span>
                </h3>
                <span className="text-[11px] text-slate-500 font-mono hidden sm:inline">
                  提示：点击下方设备行或【配置检查规则】按钮，将在弹窗中展示该设备的检查类型与明细规则
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold text-[11px] uppercase tracking-wider">
                    <tr>
                      <th className="py-2.5 px-4 font-mono w-28">设备编码</th>
                      <th className="py-2.5 px-4">设备名称</th>
                      <th className="py-2.5 px-4 w-28">使用部门</th>
                      <th className="py-2.5 px-4">责任人 / 维护人</th>
                      <th className="py-2.5 px-4 font-mono min-w-[140px]">最近检查时间</th>
                      <th className="py-2.5 px-4 text-center w-28">检查规则套数</th>
                      <th className="py-2.5 px-4 text-center w-24">状态</th>
                      <th className="py-2.5 px-4 text-center w-40">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700 text-xs">
                    {filteredDeviceRules.map((dev) => (
                      <tr
                        key={dev.id}
                        onClick={() => handleOpenDeviceRuleModal(dev)}
                        className="hover:bg-sky-50/50 cursor-pointer transition-colors"
                      >
                        <td className="py-3 px-4 font-mono font-bold text-sky-700">{dev.code}</td>
                        <td className="py-3 px-4 font-bold text-slate-900">
                          <div className="flex items-center gap-1.5">
                            <Activity className="w-4 h-4 text-sky-600 shrink-0" />
                            <span>{dev.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-700">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200 text-[11px]">
                            {dev.department}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-800">{dev.responsible}</td>
                        <td className="py-3 px-4 font-mono text-slate-500">{dev.lastCheckTime}</td>
                        <td className="py-3 px-4 text-center font-mono font-bold text-sky-800">
                          <span className="px-2 py-0.5 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-[11px]">
                            {dev.checkTypes.length} 项规则
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {dev.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => handleOpenDeviceRuleModal(dev)}
                            className="px-2.5 py-1 bg-sky-600 hover:bg-sky-700 text-white rounded text-[11px] font-semibold flex items-center gap-1 mx-auto shadow-2xs transition-colors"
                          >
                            <Eye className="w-3 h-3" />
                            <span>配置检查规则</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-2.5 bg-slate-50 border-t border-slate-200 text-[11px] font-bold text-sky-800 font-mono">
                合计: {filteredDeviceRules.length} 条设备台账
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 6: 设备检查计划 (科室检查计划) */}
        {/* ============================================================== */}
        {activeTab === 'dept-device-plan' && (
          <div className="space-y-3 px-4">
            {/* 标本核收统一风格头部 & 截图对应操作栏 */}
            <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-2xs space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-sky-50 rounded-lg border border-sky-200 text-sky-700">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-bold text-slate-900 text-sm">科室检查计划 (设备预防性维保日程)</h2>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-700 border border-sky-200">
                        ISO15189 / CAP 体系受控
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      集中管控全科大型分析流水线、质谱仪、超低温冷链及生物安全柜之日检、周检、月检与季度保养日程
                    </p>
                  </div>
                </div>

                {/* 汇总指标卡片 */}
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1 bg-slate-50 rounded-lg border border-slate-200 text-center">
                    <span className="text-[10px] text-slate-500 block">本月累计计划</span>
                    <span className="text-xs font-bold font-mono text-slate-800">{filteredPlans.length} 项</span>
                  </div>
                  <div className="px-3 py-1 bg-emerald-50 rounded-lg border border-emerald-200 text-center">
                    <span className="text-[10px] text-emerald-600 block">已执行完成</span>
                    <span className="text-xs font-bold font-mono text-emerald-700">
                      {filteredPlans.filter((p) => p.status === '已完成').length} 项
                    </span>
                  </div>
                  <div className="px-3 py-1 bg-amber-50 rounded-lg border border-amber-200 text-center">
                    <span className="text-[10px] text-amber-600 block">待执行 / 进行中</span>
                    <span className="text-xs font-bold font-mono text-amber-700">
                      {filteredPlans.filter((p) => p.status !== '已完成').length} 项
                    </span>
                  </div>
                </div>
              </div>

              {/* 操作栏 (左侧新增计划，中间筛选，右侧日/周/月视图与日期选择，完全还原并升级截图操作) */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2 flex-1">
                  {/* 图上左侧按钮：新增计划 */}
                  <button
                    onClick={() => {
                      setNewPlanForm({
                        title: '',
                        deviceId: 'DEV-RULE-001',
                        deviceName: 'AU2700 全自动生化分析仪',
                        deviceCode: '124323',
                        department: '生化组',
                        planType: '月度检查计划',
                        scheduledDate: currentPlanDate,
                        timeSlot: '08:30~10:30',
                        cycle: '每月一次',
                        responsible: '陈志远 (主管检验师)',
                        reviewer: '王雪梅 (副主任检验师)',
                        priority: '高',
                        itemsSummary: '1. 关键模块运行精度校准; 2. 传感器灵敏度与基线检测; 3. 光学系统清洁自测',
                        remarks: '严格按照 CAP / ISO15189 设备管理标准执行',
                      });
                      setIsAddPlanModalOpen(true);
                    }}
                    className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>新增计划</span>
                  </button>

                  <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block" />

                  {/* 部门过滤 */}
                  <select
                    value={planDeptFilter}
                    onChange={(e) => setPlanDeptFilter(e.target.value)}
                    className="px-2.5 py-1 bg-slate-50 border border-slate-300 rounded text-xs text-slate-700 focus:outline-none focus:border-sky-500 font-medium"
                  >
                    <option value="全部">全部专业组</option>
                    <option value="生化组">生化组</option>
                    <option value="免疫组">免疫组</option>
                    <option value="临检组">临检组</option>
                    <option value="微生物组">微生物组</option>
                    <option value="质谱分子组">质谱分子组</option>
                    <option value="科室公共">科室公共设备</option>
                  </select>

                  {/* 计划类型过滤 */}
                  <select
                    value={planTypeFilter}
                    onChange={(e) => setPlanTypeFilter(e.target.value)}
                    className="px-2.5 py-1 bg-slate-50 border border-slate-300 rounded text-xs text-slate-700 focus:outline-none focus:border-sky-500 font-medium"
                  >
                    <option value="全部">全部计划类型</option>
                    <option value="月度检查计划">月度检查计划</option>
                    <option value="季度保养计划">季度保养计划</option>
                    <option value="周度维护计划">周度维护计划</option>
                    <option value="日度巡检计划">日度巡检计划</option>
                  </select>

                  {/* 关键字搜索 */}
                  <div className="relative min-w-[180px]">
                    <Search className="w-3 h-3 text-slate-400 absolute left-2.5 top-2" />
                    <input
                      type="text"
                      value={planSearchKeyword}
                      onChange={(e) => setPlanSearchKeyword(e.target.value)}
                      placeholder="搜索设备、计划或责任人..."
                      className="w-full pl-7 pr-2 py-1 bg-slate-50 border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-sky-500"
                    />
                  </div>
                </div>

                {/* 图上右侧控件：日视图 / 周视图 / 月视图 + 日期选择器 */}
                <div className="flex items-center gap-2 shrink-0">
                  {/* 视图切换按钮组 */}
                  <div className="inline-flex rounded-lg border border-slate-300 p-0.5 bg-slate-100">
                    <button
                      type="button"
                      onClick={() => setPlanViewMode('day')}
                      className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                        planViewMode === 'day'
                          ? 'bg-sky-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                      }`}
                    >
                      日视图
                    </button>
                    <button
                      type="button"
                      onClick={() => setPlanViewMode('week')}
                      className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                        planViewMode === 'week'
                          ? 'bg-sky-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                      }`}
                    >
                      周视图
                    </button>
                    <button
                      type="button"
                      onClick={() => setPlanViewMode('month')}
                      className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                        planViewMode === 'month'
                          ? 'bg-sky-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                      }`}
                    >
                      月视图
                    </button>
                  </div>

                  {/* 日期快捷导航 */}
                  <div className="flex items-center gap-1 bg-slate-50 border border-slate-300 rounded-lg p-0.5">
                    <button
                      onClick={handlePrevDate}
                      title="向前翻页"
                      className="p-1 hover:bg-slate-200 text-slate-700 rounded transition-colors"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={handleGotoToday}
                      className="px-2 py-0.5 text-[11px] font-semibold text-sky-700 hover:bg-sky-100 rounded"
                    >
                      今天
                    </button>
                    <button
                      onClick={handleNextDate}
                      title="向后翻页"
                      className="p-1 hover:bg-slate-200 text-slate-700 rounded transition-colors"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* 截图中的日期选择框 (已改为近期时间 2026-10-30) */}
                  <div className="relative">
                    <input
                      type="date"
                      value={currentPlanDate}
                      onChange={(e) => setCurrentPlanDate(e.target.value)}
                      className="px-2.5 py-1 bg-slate-50 border border-slate-300 rounded text-xs font-mono font-bold text-slate-800 focus:outline-none focus:border-sky-500 cursor-pointer shadow-2xs"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ============================================================== */}
            {/* VIEW 1: 月视图 (月度日历网格，完全还原并升级截图月历) */}
            {/* ============================================================== */}
            {planViewMode === 'month' && (
              <div className="bg-white rounded-xl border border-slate-300 overflow-hidden shadow-2xs">
                {/* 截图标志性蓝色星期标题栏 */}
                <div className="grid grid-cols-7 border-b border-sky-700 bg-sky-600 text-white font-bold text-xs text-center">
                  <div className="py-2.5 border-r border-sky-500/60">星期日</div>
                  <div className="py-2.5 border-r border-sky-500/60">星期一</div>
                  <div className="py-2.5 border-r border-sky-500/60">星期二</div>
                  <div className="py-2.5 border-r border-sky-500/60">星期三</div>
                  <div className="py-2.5 border-r border-sky-500/60">星期四</div>
                  <div className="py-2.5 border-r border-sky-500/60">星期五</div>
                  <div className="py-2.5">星期六</div>
                </div>

                {/* 日历格子：7列网格 */}
                <div className="grid grid-cols-7 divide-x divide-y divide-slate-200 bg-slate-50">
                  {monthCalendarGrid.map((cell, idx) => {
                    const monthDisplay = cell.dateStr.slice(5, 7);
                    const dayDisplay = String(cell.dayNumber).padStart(2, '0');
                    return (
                      <div
                        key={idx}
                        className={`min-h-[110px] p-2 flex flex-col justify-between transition-colors ${
                          cell.isCurrentMonth ? 'bg-white hover:bg-sky-50/30' : 'bg-slate-50/70 text-slate-400'
                        } ${cell.isToday ? 'ring-2 ring-inset ring-sky-500 bg-sky-50/20' : ''}`}
                      >
                        {/* 日期头部 */}
                        <div className="flex items-center justify-between mb-1.5">
                          <span
                            className={`font-mono text-xs font-bold ${
                              cell.isToday
                                ? 'px-1.5 py-0.5 rounded bg-sky-600 text-white'
                                : cell.isCurrentMonth
                                ? 'text-slate-800'
                                : 'text-slate-400'
                            }`}
                          >
                            {cell.dayNumber === 1 || idx === 0
                              ? `${monthDisplay}月${dayDisplay}日`
                              : `${dayDisplay}日`}
                          </span>

                          <div className="flex items-center gap-1">
                            {cell.isToday && (
                              <span className="text-[10px] font-bold text-sky-600 bg-sky-100 px-1 rounded">
                                今日
                              </span>
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setNewPlanForm({
                                  ...newPlanForm,
                                  scheduledDate: cell.dateStr,
                                });
                                setIsAddPlanModalOpen(true);
                              }}
                              title="在当天新增计划"
                              className="opacity-0 group-hover:opacity-100 hover:opacity-100 text-sky-600 hover:text-sky-800 p-0.5 rounded transition-opacity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        {/* 当天计划项 (完全按截图编号与样式展示: 1.月度检查计划 2.季度保养计划) */}
                        <div className="space-y-1.5 flex-1 overflow-y-auto max-h-[85px] pr-0.5">
                          {cell.plans.map((plan, pIdx) => {
                            const isDone = plan.status === '已完成';
                            const isRunning = plan.status === '进行中';
                            return (
                              <div
                                key={plan.id}
                                onClick={() => handleOpenPlanDetail(plan)}
                                title={`点击查看详情: ${plan.title}\n设备: ${plan.deviceName}\n责任人: ${plan.responsible}\n状态: ${plan.status}`}
                                className={`text-[11px] px-1.5 py-1 rounded border cursor-pointer transition-all hover:scale-[1.02] shadow-2xs ${
                                  isDone
                                    ? 'bg-emerald-50/80 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
                                    : isRunning
                                    ? 'bg-sky-50 border-sky-300 text-sky-800 hover:bg-sky-100 ring-1 ring-sky-300'
                                    : 'bg-blue-50/80 border-blue-200 text-blue-700 hover:bg-blue-100'
                                }`}
                              >
                                <div className="font-semibold truncate flex items-center justify-between gap-1">
                                  <span className="truncate underline underline-offset-2">
                                    {pIdx + 1}. {plan.planType}
                                  </span>
                                  <span
                                    className={`text-[9px] px-1 py-0.2 rounded font-mono shrink-0 ${
                                      isDone
                                        ? 'bg-emerald-200 text-emerald-900'
                                        : isRunning
                                        ? 'bg-sky-200 text-sky-900 animate-pulse'
                                        : 'bg-amber-100 text-amber-800'
                                    }`}
                                  >
                                    {plan.status}
                                  </span>
                                </div>
                                <div className="text-[10px] text-slate-500 truncate flex items-center justify-between mt-0.5 font-sans">
                                  <span className="truncate">{plan.deviceName.split(' ')[0]}</span>
                                  <span className="font-medium shrink-0 text-slate-700">
                                    {plan.responsible.split(' ')[0]}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* 底部空状态引导 */}
                        {cell.plans.length === 0 && (
                          <div className="text-[10px] text-slate-300 font-mono text-center py-1">
                            无排程
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* 底部图例说明 */}
                <div className="p-2.5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
                  <div className="flex items-center gap-4">
                    <span className="font-semibold text-slate-700">图例指示:</span>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded bg-emerald-500 inline-block" />
                      <span>已完成巡检</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded bg-sky-500 inline-block animate-pulse" />
                      <span>今日进行中</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded bg-amber-500 inline-block" />
                      <span>待执行计划</span>
                    </div>
                  </div>
                  <div className="font-mono text-[11px] text-slate-500">
                    当前聚焦月份：{parsedDate.year}年{parsedDate.month}月 | 点击计划条目可直接查看与更新执行进度
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* VIEW 2: 周视图 (7 天横向时间轴视图) */}
            {/* ============================================================== */}
            {planViewMode === 'week' && (
              <div className="bg-white rounded-xl border border-slate-300 overflow-hidden shadow-2xs">
                <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-xs flex items-center gap-2">
                    <Clock className="w-4 h-4 text-sky-600" />
                    <span>周度检查计划甘特概览 ({weekCalendarDays[0].dateStr} 至 {weekCalendarDays[6].dateStr})</span>
                  </h3>
                  <span className="text-[11px] text-slate-500 font-mono">
                    包含本周 7 天所有科室设备维保排程
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-7 divide-y md:divide-y-0 md:divide-x divide-slate-200">
                  {weekCalendarDays.map((wDay) => (
                    <div
                      key={wDay.dateStr}
                      className={`p-3 min-h-[320px] flex flex-col ${
                        wDay.isToday ? 'bg-sky-50/30 ring-2 ring-inset ring-sky-500' : 'bg-white'
                      }`}
                    >
                      {/* 星期头部 */}
                      <div className="border-b border-slate-200 pb-2 mb-2 text-center">
                        <div className="text-xs font-bold text-slate-700">{wDay.weekdayName}</div>
                        <div
                          className={`font-mono text-sm font-bold mt-0.5 ${
                            wDay.isToday ? 'text-sky-700' : 'text-slate-900'
                          }`}
                        >
                          {wDay.monthNumber}月{wDay.dayNumber}日
                        </div>
                        {wDay.isToday && (
                          <span className="inline-block mt-1 px-2 py-0.5 bg-sky-600 text-white rounded text-[10px] font-bold">
                            今日排程
                          </span>
                        )}
                      </div>

                      {/* 计划列表 */}
                      <div className="space-y-2 flex-1">
                        {wDay.plans.map((plan, idx) => (
                          <div
                            key={plan.id}
                            onClick={() => handleOpenPlanDetail(plan)}
                            className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-sky-50/60 cursor-pointer transition-all shadow-2xs space-y-1.5"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-[10px] font-bold text-sky-700">{plan.timeSlot}</span>
                              <span
                                className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                                  plan.status === '已完成'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : plan.status === '进行中'
                                    ? 'bg-sky-100 text-sky-800 animate-pulse'
                                    : 'bg-amber-100 text-amber-800'
                                }`}
                              >
                                {plan.status}
                              </span>
                            </div>
                            <div className="font-bold text-slate-900 text-xs line-clamp-1">{plan.title}</div>
                            <div className="text-[11px] text-slate-600 flex items-center justify-between">
                              <span className="truncate">{plan.deviceName}</span>
                            </div>
                            <div className="text-[10px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-200/60">
                              <span>责任人:</span>
                              <span className="font-semibold text-slate-800">{plan.responsible.split(' ')[0]}</span>
                            </div>
                          </div>
                        ))}

                        {wDay.plans.length === 0 && (
                          <div className="text-center py-10 text-slate-400 text-xs">
                            今日暂无排程
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => {
                          setNewPlanForm({
                            ...newPlanForm,
                            scheduledDate: wDay.dateStr,
                          });
                          setIsAddPlanModalOpen(true);
                        }}
                        className="mt-2 w-full py-1 border border-dashed border-sky-300 text-sky-700 hover:bg-sky-50 rounded text-[11px] font-semibold flex items-center justify-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>新增当日计划</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* VIEW 3: 日视图 (聚焦当日工单与明细核对) */}
            {/* ============================================================== */}
            {planViewMode === 'day' && (
              <div className="bg-white rounded-xl border border-slate-300 overflow-hidden shadow-2xs">
                <div className="p-4 bg-sky-700 text-white flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-6 h-6 text-sky-200" />
                    <div>
                      <h3 className="font-bold text-sm">
                        {currentPlanDate} 检验设备巡检与维保执行清单
                      </h3>
                      <p className="text-xs text-sky-100 mt-0.5">
                        按规范逐项核对并记录仪器运行参数、水浴温度及光学灵敏度
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => triggerAction(`正在导出 ${currentPlanDate} 设备维保签发工单...`)}
                      className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>打印当日工单</span>
                    </button>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  {dayPlans.map((plan) => (
                    <div
                      key={plan.id}
                      className="p-4 rounded-xl border border-slate-200 bg-white hover:border-sky-300 transition-all shadow-2xs space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono text-xs font-bold px-2 py-0.5 bg-slate-100 rounded text-slate-700">
                            {plan.code}
                          </span>
                          <h4 className="font-bold text-slate-900 text-sm">{plan.title}</h4>
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
                            {plan.planType}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                              plan.status === '已完成'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : plan.status === '进行中'
                                ? 'bg-sky-100 text-sky-800 border border-sky-300 animate-pulse'
                                : 'bg-amber-100 text-amber-800 border border-amber-300'
                            }`}
                          >
                            {plan.status}
                          </span>

                          <button
                            onClick={() => handleTogglePlanStatus(plan.id)}
                            className={`px-3 py-1 rounded text-xs font-semibold flex items-center gap-1 shadow-2xs transition-colors ${
                              plan.status === '已完成'
                                ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            }`}
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>{plan.status === '已完成' ? '重置为待执行' : '标记已完成'}</span>
                          </button>

                          <button
                            onClick={() => handleOpenPlanDetail(plan)}
                            className="px-2.5 py-1 bg-sky-50 hover:bg-sky-100 text-sky-700 rounded text-xs font-semibold flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>详情</span>
                          </button>
                        </div>
                      </div>

                      {/* 核心信息卡片 */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-lg text-xs">
                        <div>
                          <span className="text-slate-500 block">关联设备</span>
                          <span className="font-bold text-slate-800">{plan.deviceName}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">执行时段 / 频次</span>
                          <span className="font-mono font-semibold text-slate-800">{plan.timeSlot} ({plan.cycle})</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">维护责任人</span>
                          <span className="font-semibold text-slate-800">{plan.responsible}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">审核科主任</span>
                          <span className="font-semibold text-slate-800">{plan.reviewer}</span>
                        </div>
                      </div>

                      {/* 明细检查项列表 */}
                      <div>
                        <div className="text-[11px] font-bold text-slate-700 mb-1.5">检查要点要求与判定标准：</div>
                        <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden">
                          {plan.items.map((item, itmIdx) => (
                            <div key={item.id} className="p-2.5 bg-white flex items-center justify-between text-xs">
                              <div className="flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 font-mono text-[11px] font-bold flex items-center justify-center shrink-0">
                                  {itmIdx + 1}
                                </span>
                                <div>
                                  <span className="font-bold text-slate-900">{item.name}</span>
                                  {item.isKeyItem && (
                                    <span className="ml-2 px-1.5 py-0.2 bg-rose-50 text-rose-700 border border-rose-200 rounded text-[10px] font-bold">
                                      关键参数
                                    </span>
                                  )}
                                </div>
                              </div>
                              <span className="font-mono text-slate-600 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                                标准要求: {item.standard}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {plan.remarks && (
                        <div className="text-[11px] text-slate-500 bg-amber-50/60 border border-amber-200 p-2 rounded">
                          <span className="font-semibold text-amber-800">维保备注：</span>
                          {plan.remarks}
                        </div>
                      )}
                    </div>
                  ))}

                  {dayPlans.length === 0 && (
                    <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200">
                      <p className="text-slate-500 text-xs">所选日期 ({currentPlanDate}) 暂无已安排的设备检查计划</p>
                      <button
                        onClick={() => {
                          setNewPlanForm({
                            ...newPlanForm,
                            scheduledDate: currentPlanDate,
                          });
                          setIsAddPlanModalOpen(true);
                        }}
                        className="mt-3 px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>安排当日设备维保计划</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'dept-device-record' && (
          <DepartmentInspectionRecordView
            user={user}
            triggerAction={triggerAction}
          />
        )}

        {activeTab === 'dept-specimen-manage' && (
          <SpecimenManagementView user={user} triggerAction={triggerAction} />
        )}

        {activeTab === 'dept-report-center' && (
          <ReportQueryCenterView user={user} triggerAction={triggerAction} />
        )}
      </div>

      {/* ============================================================== */}
      {/* MODAL: 新增分类 弹窗 */}
      {/* ============================================================== */}
      {isAddCatModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-sm overflow-hidden animate-scaleIn">
            <div className="bg-sky-700 text-white px-5 py-3 flex items-center justify-between">
              <h3 className="font-bold text-xs flex items-center gap-1.5">
                <Plus className="w-4 h-4" />
                <span>新增受控文档分类</span>
              </h3>
              <button onClick={() => setIsAddCatModalOpen(false)} className="p-1 text-sky-100 hover:text-white rounded">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveNewCat} className="p-5 space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">分类名称 *</label>
                <input
                  type="text"
                  required
                  value={newCatLabel}
                  onChange={(e) => setNewCatLabel(e.target.value)}
                  placeholder="如: 分子检测组 SOP"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded font-semibold text-slate-900"
                  autoFocus
                />
              </div>
              <div className="bg-slate-50 -mx-5 -mb-5 px-5 py-3 border-t border-slate-200 flex justify-end gap-2">
                <button type="button" onClick={() => setIsAddCatModalOpen(false)} className="px-3.5 py-1.5 bg-slate-100 text-slate-700 rounded font-semibold">取消</button>
                <button type="submit" className="px-4 py-1.5 bg-sky-600 text-white rounded font-semibold shadow-xs">添加分类</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: 新增受控文档 弹窗 */}
      {/* ============================================================== */}
      {isAddDocModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-scaleIn">
            <div className="bg-sky-700 text-white px-5 py-3.5 flex items-center justify-between">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <Upload className="w-4 h-4" />
                <span>上传新增受控文档</span>
              </h3>
              <button onClick={() => setIsAddDocModalOpen(false)} className="p-1 text-sky-100 hover:text-white rounded">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveNewDoc} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">受控文档标题 *</label>
                <input
                  type="text"
                  required
                  value={docFormData.title}
                  onChange={(e) => setDocFormData({ ...docFormData, title: e.target.value })}
                  placeholder="如: 高敏肌钙蛋白I 质控及危急值标准化处理 SOP"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded font-bold text-slate-900"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">文档所属分类</label>
                  <select
                    value={docFormData.categoryId}
                    onChange={(e) => setDocFormData({ ...docFormData, categoryId: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded font-medium"
                  >
                    {docCategories.map((c) => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">受控版本号</label>
                  <input
                    type="text"
                    value={docFormData.version}
                    onChange={(e) => setDocFormData({ ...docFormData, version: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">受控附件文件名 (.pdf/.docx)</label>
                <input
                  type="text"
                  value={docFormData.attachment}
                  onChange={(e) => setDocFormData({ ...docFormData, attachment: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">核心摘要与适用品项说明</label>
                <textarea
                  rows={2}
                  value={docFormData.summary}
                  onChange={(e) => setDocFormData({ ...docFormData, summary: e.target.value })}
                  placeholder="请输入该 SOP 或规章制度的技术要点..."
                  className="w-full px-3 py-1.5 border border-slate-300 rounded"
                ></textarea>
              </div>
              <div className="bg-slate-50 -mx-5 -mb-5 px-5 py-3 border-t border-slate-200 flex justify-end gap-2">
                <button type="button" onClick={() => setIsAddDocModalOpen(false)} className="px-4 py-1.5 bg-slate-100 text-slate-700 rounded font-semibold">取消</button>
                <button type="submit" className="px-5 py-1.5 bg-sky-600 text-white rounded font-semibold shadow-xs">保存归档</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: 在线调阅受控 PDF 文档 预览弹窗 */}
      {/* ============================================================== */}
      {isPreviewDocModalOpen && previewingDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden flex flex-col max-h-[85vh] animate-scaleIn">
            <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-sky-400" />
                <div>
                  <h3 className="font-bold text-sm">{previewingDoc.title}</h3>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                    受控编号: {previewingDoc.id} · 版本: {previewingDoc.version} · 分类: {previewingDoc.categoryName}
                  </p>
                </div>
              </div>
              <button onClick={() => setIsPreviewDocModalOpen(false)} className="p-1 text-slate-400 hover:text-white rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 在线阅读器模拟正文 */}
            <div className="p-6 overflow-y-auto flex-1 text-xs space-y-4 bg-slate-50/50">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-3 font-serif leading-relaxed text-slate-800">
                <div className="border-b border-slate-200 pb-3 text-center">
                  <h2 className="text-base font-bold font-sans text-slate-900">{previewingDoc.title}</h2>
                  <div className="text-[11px] text-slate-500 font-mono mt-1">
                    发布单位：市中心医院检验科 · 起草/审核人：{previewingDoc.operator} · 版本：{previewingDoc.version}
                  </div>
                </div>

                <div className="space-y-2 text-xs font-sans">
                  <h4 className="font-bold text-sky-900">1. 目的与适用范围</h4>
                  <p className="text-slate-600">{previewingDoc.summary}</p>
                </div>

                <div className="space-y-2 text-xs font-sans">
                  <h4 className="font-bold text-sky-900">2. 质量保证与安全规程</h4>
                  <p className="text-slate-600">
                    按照 ISO15189 医疗实验室质量和能力认可准则要求，所有上岗检验医师必须严格遵循本规程执行，定标曲线与日常质控(LJ图谱)须由主管检验师双审核确认。
                  </p>
                </div>

                <div className="p-3 bg-amber-50 border border-amber-200 rounded text-amber-900 text-[11px] font-sans">
                  <strong>受控水印标记: </strong> 本电子文档属检验科内部受控版本，禁止私自翻印与外传。
                </div>
              </div>
            </div>

            <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between shrink-0 text-xs">
              <span className="text-slate-400 font-mono">附件: {previewingDoc.attachment} ({previewingDoc.attachmentSize})</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => triggerAction(`正在安全下载受控文件《${previewingDoc.attachment}》`)}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded font-semibold flex items-center gap-1 shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>下载附件</span>
                </button>
                <button onClick={() => setIsPreviewDocModalOpen(false)} className="px-4 py-1.5 bg-sky-600 text-white rounded font-semibold">关闭预览</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: 查看班次规则详情 弹窗 (点击左侧班次行或【详情】按钮后弹窗展示) */}
      {/* ============================================================== */}
      {isShiftDetailModalOpen && selectedShiftForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden animate-scaleIn">
            <div className="bg-sky-800 text-white px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-sky-300" />
                <h3 className="font-bold text-sm">排班班次详细规则与配置 - {selectedShiftForDetail.name}</h3>
              </div>
              <button
                onClick={() => setIsShiftDetailModalOpen(false)}
                className="p-1 text-sky-200 hover:text-white rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base text-slate-900">{selectedShiftForDetail.name}</span>
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-bold">
                      编码: {selectedShiftForDetail.code}
                    </span>
                  </div>
                  <p className="text-slate-500 mt-0.5">所属部门/专业组: {selectedShiftForDetail.department}</p>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    selectedShiftForDetail.status === '启用'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-slate-100 text-slate-500 border border-slate-300'
                  }`}
                >
                  {selectedShiftForDetail.status}
                </span>
              </div>

              {/* 核心工时与津贴 */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-500 block">工作时间段</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">{selectedShiftForDetail.timeSlot}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">标准有效工时</span>
                  <span className="font-mono font-semibold text-slate-800">{selectedShiftForDetail.duration}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">夜班/轮班津贴</span>
                  <span className="font-mono font-bold text-amber-700 text-sm">{selectedShiftForDetail.allowance}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">起草维护人</span>
                  <span className="font-bold text-slate-800">{selectedShiftForDetail.creator}</span>
                </div>
              </div>

              {/* 详细规则与岗位要求 */}
              <div className="space-y-2.5">
                <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-sky-600" />
                  <span>考勤打卡与质控执行规则</span>
                </h4>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2 text-slate-700">
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-slate-800 shrink-0">打卡有效区间：</span>
                    <span>班次开始前30分钟至班次结束后30分钟内有效，支持指纹/工牌双重验证。</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-slate-800 shrink-0">交接班要求：</span>
                    <span>须现场交接未发报告、急诊危急值电话记录及质控L-J图谱，双人签字确认。</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-slate-800 shrink-0">上岗资质要求：</span>
                    <span>须持有临床医学检验技术初级师或以上职称证书，并通过相应仪器岗位授权考核。</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="font-bold text-slate-800 shrink-0">岗位职责描述：</span>
                    <span>{selectedShiftForDetail.description || '无特殊备注说明'}</span>
                  </div>
                </div>
              </div>

              {/* 历史记录 */}
              <div className="text-[11px] text-slate-400 font-mono flex items-center justify-between border-t border-slate-100 pt-2">
                <span>系统ID: {selectedShiftForDetail.id}</span>
                <span>最后修订生效: {selectedShiftForDetail.updateTime}</span>
              </div>
            </div>

            <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  handleToggleShiftStatus(selectedShiftForDetail);
                  setSelectedShiftForDetail({
                    ...selectedShiftForDetail,
                    status: selectedShiftForDetail.status === '启用' ? '停用' : '启用',
                  });
                }}
                className={`px-3 py-1.5 rounded font-semibold text-xs transition-colors ${
                  selectedShiftForDetail.status === '启用'
                    ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                    : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                }`}
              >
                {selectedShiftForDetail.status === '启用' ? '停用该班次' : '启用该班次'}
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsShiftDetailModalOpen(false);
                    handleOpenEditShift(selectedShiftForDetail);
                  }}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-semibold text-xs"
                >
                  编辑此班次
                </button>
                <button
                  type="button"
                  onClick={() => setIsShiftDetailModalOpen(false)}
                  className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded font-semibold text-xs"
                >
                  关闭
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: 新增排班班次 弹窗 */}
      {/* ============================================================== */}
      {isShiftAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-scaleIn">
            <div className="bg-sky-700 text-white px-5 py-3.5 flex items-center justify-between">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>新增排班班次定义</span>
              </h3>
              <button
                onClick={() => setIsShiftAddModalOpen(false)}
                className="p-1 text-sky-100 hover:text-white rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNewShift} className="p-5 space-y-3.5 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">班次编码 *</label>
                  <input
                    type="text"
                    required
                    value={shiftFormData.code}
                    onChange={(e) => setShiftFormData({ ...shiftFormData, code: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono font-bold"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-slate-700 font-semibold mb-1">班次名称 *</label>
                  <input
                    type="text"
                    required
                    value={shiftFormData.name}
                    onChange={(e) => setShiftFormData({ ...shiftFormData, name: e.target.value })}
                    placeholder="如: 早班 (门诊抽血与急查)"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">工作时间段 *</label>
                  <input
                    type="text"
                    required
                    value={shiftFormData.timeSlot}
                    onChange={(e) => setShiftFormData({ ...shiftFormData, timeSlot: e.target.value })}
                    placeholder="如: 08:00~17:00"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">标准工时</label>
                  <input
                    type="text"
                    value={shiftFormData.duration}
                    onChange={(e) => setShiftFormData({ ...shiftFormData, duration: e.target.value })}
                    placeholder="如: 8.0h"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">夜班/轮班津贴</label>
                  <input
                    type="text"
                    value={shiftFormData.allowance}
                    onChange={(e) => setShiftFormData({ ...shiftFormData, allowance: e.target.value })}
                    placeholder="如: 40元"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">适用部门/专业组</label>
                  <input
                    type="text"
                    value={shiftFormData.department}
                    onChange={(e) => setShiftFormData({ ...shiftFormData, department: e.target.value })}
                    placeholder="如: 临床生化与质控组"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">班次职责及执行要求</label>
                <textarea
                  rows={2}
                  value={shiftFormData.description}
                  onChange={(e) => setShiftFormData({ ...shiftFormData, description: e.target.value })}
                  placeholder="请输入该班次对应临床岗位工作职责及要求..."
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-slate-800"
                />
              </div>

              <div className="bg-slate-50 -mx-5 -mb-5 px-5 py-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsShiftAddModalOpen(false)}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-semibold text-xs"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded font-semibold text-xs shadow-xs"
                >
                  保存新班次
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: 编辑排班班次 弹窗 */}
      {/* ============================================================== */}
      {isShiftEditModalOpen && editingShift && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-scaleIn">
            <div className="bg-sky-700 text-white px-5 py-3.5 flex items-center justify-between">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>编辑排班班次 - {editingShift.name}</span>
              </h3>
              <button
                onClick={() => setIsShiftEditModalOpen(false)}
                className="p-1 text-sky-100 hover:text-white rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateShift} className="p-5 space-y-3.5 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">班次编码</label>
                  <input
                    type="text"
                    required
                    value={shiftFormData.code}
                    onChange={(e) => setShiftFormData({ ...shiftFormData, code: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono font-bold"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-slate-700 font-semibold mb-1">班次名称</label>
                  <input
                    type="text"
                    required
                    value={shiftFormData.name}
                    onChange={(e) => setShiftFormData({ ...shiftFormData, name: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">工作时间段</label>
                  <input
                    type="text"
                    required
                    value={shiftFormData.timeSlot}
                    onChange={(e) => setShiftFormData({ ...shiftFormData, timeSlot: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">标准工时</label>
                  <input
                    type="text"
                    value={shiftFormData.duration}
                    onChange={(e) => setShiftFormData({ ...shiftFormData, duration: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">夜班津贴</label>
                  <input
                    type="text"
                    value={shiftFormData.allowance}
                    onChange={(e) => setShiftFormData({ ...shiftFormData, allowance: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">启用状态</label>
                  <select
                    value={shiftFormData.status}
                    onChange={(e) => setShiftFormData({ ...shiftFormData, status: e.target.value as any })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded font-medium"
                  >
                    <option value="启用">启用</option>
                    <option value="停用">停用</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">适用部门/专业组</label>
                <input
                  type="text"
                  value={shiftFormData.department}
                  onChange={(e) => setShiftFormData({ ...shiftFormData, department: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">工作说明与备注</label>
                <textarea
                  rows={2}
                  value={shiftFormData.description}
                  onChange={(e) => setShiftFormData({ ...shiftFormData, description: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded"
                />
              </div>

              <div className="bg-slate-50 -mx-5 -mb-5 px-5 py-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsShiftEditModalOpen(false)}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-semibold text-xs"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded font-semibold text-xs shadow-xs"
                >
                  更新班次
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: 确认删除班次 弹窗 */}
      {/* ============================================================== */}
      {deletingShift && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-sm overflow-hidden animate-scaleIn text-center p-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">确认彻底删除排班班次？</h3>
              <p className="text-slate-500 text-xs mt-1">
                将删除《<span className="font-bold text-slate-800">{deletingShift.name}</span>》（编码: {deletingShift.code}）。此操作不可撤销。
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingShift(null)}
                className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-semibold text-xs"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteShift}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded font-semibold text-xs shadow-xs"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: 人员档案详情 (10大页签履历与卡片) 弹窗 (点击左侧人员列表后弹窗展示) */}
      {/* ============================================================== */}
      {isStaffModalOpen && activeSelectedStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden animate-scaleIn">
            {/* 弹窗头部 */}
            <div className="bg-gradient-to-r from-sky-800 to-slate-900 text-white px-5 py-3.5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-sky-600/60 border border-sky-400/50 flex items-center justify-center text-white font-bold text-sm shadow-inner">
                  {activeSelectedStaff.name.slice(0, 1)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-white">
                      {activeSelectedStaff.name} - 人员电子档案卡
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-sky-700/80 text-sky-100 border border-sky-500/40">
                      工号: {activeSelectedStaff.code}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-600/80 text-emerald-100">
                      {activeSelectedStaff.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-sky-200 mt-0.5 flex items-center gap-2">
                    <span>所属部门: {activeSelectedStaff.department}</span>
                    <span>•</span>
                    <span>职称职务: {activeSelectedStaff.title} ({activeSelectedStaff.titleLevel})</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => triggerAction(`正在打印《${activeSelectedStaff.name}》完整业务技术档案卡`)}
                  className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>打印档案卡</span>
                </button>
                <button
                  onClick={() => setIsStaffModalOpen(false)}
                  className="p-1.5 text-sky-200 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* 10大页签导航栏 (完全对应原截图2、3、4所列的全部10个选项卡) */}
            <div className="bg-slate-50 border-b border-slate-200 px-4 pt-2 flex items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-1 overflow-x-auto pb-2 scrollbar-none">
                {[
                  { idx: 1, label: '基本信息' },
                  { idx: 2, label: '任职情况' },
                  { idx: 3, label: '教育信息' },
                  { idx: 4, label: '教学经历' },
                  { idx: 5, label: '论文信息' },
                  { idx: 6, label: '工作经历' },
                  { idx: 7, label: '职称信息' },
                  { idx: 8, label: '科研信息' },
                  { idx: 9, label: '奖惩历史' },
                  { idx: 10, label: '健康记录' },
                ].map((tab) => (
                  <button
                    key={tab.idx}
                    type="button"
                    onClick={() => setStaffDetailActiveTab(tab.idx)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-t-md transition-all whitespace-nowrap border-b-2 ${
                      staffDetailActiveTab === tab.idx
                        ? 'text-sky-600 border-sky-600 bg-white shadow-2xs font-bold'
                        : 'text-slate-600 border-transparent hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 弹窗内容主体区域 */}
            <div className="p-5 flex-1 overflow-y-auto max-h-[64vh]">
              {/* TAB 1: 基本信息 (完全按截图2输入框样式排版) */}
              {staffDetailActiveTab === 1 && (
                <div className="space-y-4 max-w-3xl mx-auto py-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3.5 text-xs">
                    <div className="flex items-center gap-2">
                      <label className="w-24 text-right text-slate-700 font-medium shrink-0">姓名</label>
                      <input
                        type="text"
                        readOnly
                        value={activeSelectedStaff.name}
                        className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-900 font-bold"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="w-16 text-right text-slate-700 font-medium shrink-0">性别</label>
                      <input
                        type="text"
                        readOnly
                        value={activeSelectedStaff.gender}
                        className="w-24 px-3 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-800"
                      />
                      <label className="w-12 text-right text-slate-700 font-medium shrink-0">民族</label>
                      <input
                        type="text"
                        readOnly
                        value={activeSelectedStaff.nation}
                        className="w-24 px-3 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-800"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="w-24 text-right text-slate-700 font-medium shrink-0">出生日期</label>
                      <input
                        type="text"
                        readOnly
                        value={activeSelectedStaff.birthDate}
                        className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-300 rounded font-mono text-slate-800"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="w-16 text-right text-slate-700 font-medium shrink-0">身份证号</label>
                      <input
                        type="text"
                        readOnly
                        value={activeSelectedStaff.idCard}
                        className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-300 rounded font-mono text-slate-800"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="w-24 text-right text-slate-700 font-medium shrink-0">部门</label>
                      <input
                        type="text"
                        readOnly
                        value={activeSelectedStaff.department}
                        className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-800 font-medium"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="w-16 text-right text-slate-700 font-medium shrink-0">现住址</label>
                      <input
                        type="text"
                        readOnly
                        value={activeSelectedStaff.address}
                        className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-800"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="w-24 text-right text-slate-700 font-medium shrink-0">政治面貌</label>
                      <input
                        type="text"
                        readOnly
                        value={activeSelectedStaff.basicInfo.politicalStatus}
                        className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-800"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="w-16 text-right text-slate-700 font-medium shrink-0">学历/学位</label>
                      <input
                        type="text"
                        readOnly
                        value={activeSelectedStaff.basicInfo.educationLevel}
                        className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-800"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="w-24 text-right text-slate-700 font-medium shrink-0">毕业院校</label>
                      <input
                        type="text"
                        readOnly
                        value={activeSelectedStaff.basicInfo.school}
                        className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-800"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="w-16 text-right text-slate-700 font-medium shrink-0">所学专业</label>
                      <input
                        type="text"
                        readOnly
                        value={activeSelectedStaff.basicInfo.major}
                        className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-800"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="w-24 text-right text-slate-700 font-medium shrink-0">执业证书号</label>
                      <input
                        type="text"
                        readOnly
                        value={activeSelectedStaff.basicInfo.certNo}
                        className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-300 rounded font-mono text-slate-800"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="w-16 text-right text-slate-700 font-medium shrink-0">联系电话</label>
                      <input
                        type="text"
                        readOnly
                        value={activeSelectedStaff.phone}
                        className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-300 rounded font-mono text-slate-800"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: 任职情况 (完全对应截图3表格: 任职单位、任职部门、开始日期、截止日期、任职职务) */}
              {staffDetailActiveTab === 2 && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-800">
                      任职履历列表 ({activeSelectedStaff.tenureList.length} 项)
                    </span>
                    <button
                      type="button"
                      onClick={() => triggerAction(`已打开《${activeSelectedStaff.name}》新增任职职务窗口`)}
                      className="px-2.5 py-1 bg-sky-600 hover:bg-sky-700 text-white rounded text-[11px] font-semibold flex items-center gap-1 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                      <span>新增任职</span>
                    </button>
                  </div>
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold text-[11px]">
                        <tr>
                          <th className="py-2.5 px-3">任职单位</th>
                          <th className="py-2.5 px-3">任职部门</th>
                          <th className="py-2.5 px-3 font-mono">开始日期</th>
                          <th className="py-2.5 px-3 font-mono">截止日期</th>
                          <th className="py-2.5 px-3">任职职务</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                        {activeSelectedStaff.tenureList.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="py-8 text-center text-slate-400">暂无任职记录</td>
                          </tr>
                        ) : (
                          activeSelectedStaff.tenureList.map((t, idx) => (
                            <tr key={idx} className="hover:bg-slate-50">
                              <td className="py-2.5 px-3 font-medium text-slate-900">{t.unit}</td>
                              <td className="py-2.5 px-3">{t.department}</td>
                              <td className="py-2.5 px-3 font-mono">{t.startDate}</td>
                              <td className="py-2.5 px-3 font-mono">{t.endDate}</td>
                              <td className="py-2.5 px-3 font-bold text-sky-800">{t.position}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 3: 教育信息 (完全对应截图4表格: 教育机构、专业、开始日期、截止日期、学历) */}
              {staffDetailActiveTab === 3 && (
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-800">
                      学历学位教育背景 ({activeSelectedStaff.educationList.length} 条)
                    </span>
                    <button
                      type="button"
                      onClick={() => triggerAction(`已打开《${activeSelectedStaff.name}》新增学历教育记录窗口`)}
                      className="px-2.5 py-1 bg-sky-600 hover:bg-sky-700 text-white rounded text-[11px] font-semibold flex items-center gap-1 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                      <span>新增学历</span>
                    </button>
                  </div>
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold text-[11px]">
                        <tr>
                          <th className="py-2.5 px-3">教育机构</th>
                          <th className="py-2.5 px-3">专业</th>
                          <th className="py-2.5 px-3 font-mono">开始日期</th>
                          <th className="py-2.5 px-3 font-mono">截止日期</th>
                          <th className="py-2.5 px-3">学历/学位</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                        {activeSelectedStaff.educationList.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="py-8 text-center text-slate-400">暂无学历教育记录</td>
                          </tr>
                        ) : (
                          activeSelectedStaff.educationList.map((e, idx) => (
                            <tr key={idx} className="hover:bg-slate-50">
                              <td className="py-2.5 px-3 font-medium text-slate-900">{e.institution}</td>
                              <td className="py-2.5 px-3">{e.major}</td>
                              <td className="py-2.5 px-3 font-mono">{e.startDate}</td>
                              <td className="py-2.5 px-3 font-mono">{e.endDate}</td>
                              <td className="py-2.5 px-3 font-bold text-sky-800">{e.degree}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 4: 教学经历 */}
              {staffDetailActiveTab === 4 && (
                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-800">临床教学与带教经历</span>
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold text-[11px]">
                        <tr>
                          <th className="py-2.5 px-3">教学机构 / 院校</th>
                          <th className="py-2.5 px-3">所授专业</th>
                          <th className="py-2.5 px-3 font-mono">起止日期</th>
                          <th className="py-2.5 px-3">课程名称 / 带教内容</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {activeSelectedStaff.teachingList.length === 0 ? (
                          <tr><td colSpan={4} className="py-8 text-center text-slate-400">暂无带教经历</td></tr>
                        ) : (
                          activeSelectedStaff.teachingList.map((item, idx) => (
                            <tr key={idx} className="hover:bg-slate-50">
                              <td className="py-2.5 px-3 font-medium">{item.institution}</td>
                              <td className="py-2.5 px-3">{item.specialty}</td>
                              <td className="py-2.5 px-3 font-mono text-[11px]">{item.startDate} ~ {item.endDate}</td>
                              <td className="py-2.5 px-3 font-semibold text-sky-800">{item.course}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 5: 论文信息 */}
              {staffDetailActiveTab === 5 && (
                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-800">学术论文与专著成果</span>
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold text-[11px]">
                        <tr>
                          <th className="py-2.5 px-3">发表期刊 / 收录</th>
                          <th className="py-2.5 px-3 font-mono">发表日期</th>
                          <th className="py-2.5 px-3">论文题目</th>
                          <th className="py-2.5 px-3">奖项荣誉 / 影响因子</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {activeSelectedStaff.paperList.length === 0 ? (
                          <tr><td colSpan={4} className="py-8 text-center text-slate-400">暂无论文记录</td></tr>
                        ) : (
                          activeSelectedStaff.paperList.map((p, idx) => (
                            <tr key={idx} className="hover:bg-slate-50">
                              <td className="py-2.5 px-3 font-bold text-slate-900">{p.journal}</td>
                              <td className="py-2.5 px-3 font-mono text-[11px]">{p.publishDate}</td>
                              <td className="py-2.5 px-3 font-medium text-sky-900">{p.title}</td>
                              <td className="py-2.5 px-3 font-mono text-emerald-700 font-semibold">{p.award}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 6: 工作经历 */}
              {staffDetailActiveTab === 6 && (
                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-800">既往工作与临床历练</span>
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold text-[11px]">
                        <tr>
                          <th className="py-2.5 px-3">工作单位</th>
                          <th className="py-2.5 px-3">部门</th>
                          <th className="py-2.5 px-3 font-mono">服务时间</th>
                          <th className="py-2.5 px-3">职务 / 专业岗位</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {activeSelectedStaff.workHistory.map((w, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="py-2.5 px-3 font-medium text-slate-900">{w.unit}</td>
                            <td className="py-2.5 px-3">{w.department}</td>
                            <td className="py-2.5 px-3 font-mono text-[11px]">{w.startDate} ~ {w.endDate}</td>
                            <td className="py-2.5 px-3 font-bold text-sky-800">{w.position}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 7: 职称信息 */}
              {staffDetailActiveTab === 7 && (
                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-800">专业技术职称晋升履历</span>
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold text-[11px]">
                        <tr>
                          <th className="py-2.5 px-3">职称名称</th>
                          <th className="py-2.5 px-3">级别</th>
                          <th className="py-2.5 px-3 font-mono">取得日期</th>
                          <th className="py-2.5 px-3 font-mono">证书编号</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {activeSelectedStaff.titleHistory.map((th, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="py-2.5 px-3 font-bold text-sky-900">{th.title}</td>
                            <td className="py-2.5 px-3">
                              <span className="px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200 font-semibold text-[11px]">
                                {th.level}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 font-mono">{th.obtainDate}</td>
                            <td className="py-2.5 px-3 font-mono text-slate-600">{th.certNo}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 8: 科研信息 */}
              {staffDetailActiveTab === 8 && (
                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-800">科研课题与科技攻关</span>
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold text-[11px]">
                        <tr>
                          <th className="py-2.5 px-3">科研课题名称</th>
                          <th className="py-2.5 px-3 font-mono">起止时间</th>
                          <th className="py-2.5 px-3">承担角色</th>
                          <th className="py-2.5 px-3">成果与奖励评价</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {activeSelectedStaff.researchList.length === 0 ? (
                          <tr><td colSpan={4} className="py-8 text-center text-slate-400">暂无科研课题</td></tr>
                        ) : (
                          activeSelectedStaff.researchList.map((r, idx) => (
                            <tr key={idx} className="hover:bg-slate-50">
                              <td className="py-2.5 px-3 font-bold text-slate-900">{r.projectName}</td>
                              <td className="py-2.5 px-3 font-mono text-[11px]">{r.startDate} ~ {r.endDate}</td>
                              <td className="py-2.5 px-3 font-semibold text-sky-800">{r.role}</td>
                              <td className="py-2.5 px-3 font-medium text-emerald-800">{r.award}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 9: 奖惩历史 */}
              {staffDetailActiveTab === 9 && (
                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-800">表彰荣誉与考评记录</span>
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold text-[11px]">
                        <tr>
                          <th className="py-2.5 px-3 w-28">类别</th>
                          <th className="py-2.5 px-3 font-mono w-28">发生日期</th>
                          <th className="py-2.5 px-3">表彰荣誉与事由说明</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {activeSelectedStaff.awardList.map((a, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="py-2.5 px-3 font-bold text-amber-800">{a.category}</td>
                            <td className="py-2.5 px-3 font-mono text-[11px]">{a.date}</td>
                            <td className="py-2.5 px-3 font-medium text-slate-800">{a.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 10: 健康记录 */}
              {staffDetailActiveTab === 10 && (
                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-800">职业健康体检与防护监护</span>
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold text-[11px]">
                        <tr>
                          <th className="py-2.5 px-3 font-mono w-28">体检日期</th>
                          <th className="py-2.5 px-3 w-40">体检项目</th>
                          <th className="py-2.5 px-3">体检结论与职业防护评估</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {activeSelectedStaff.healthList.map((h, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="py-2.5 px-3 font-mono font-bold text-slate-800">{h.checkDate}</td>
                            <td className="py-2.5 px-3 font-semibold text-sky-900">{h.item}</td>
                            <td className="py-2.5 px-3 font-medium text-emerald-800">{h.result}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* 弹窗底部操作与状态栏 */}
            <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div className="text-xs text-slate-500 font-mono flex items-center gap-2">
                <span>身份证: {activeSelectedStaff.idCard}</span>
                <span>•</span>
                <span>资格证书: {activeSelectedStaff.basicInfo.certNo || '未登记'}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => triggerAction(`正在打印《${activeSelectedStaff.name}》人员档案基本卡片`)}
                  className="px-3.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded font-semibold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>打印档案卡</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    triggerAction(`《${activeSelectedStaff.name}》业务技术档案信息已成功保存至科室档案库！`);
                    setIsStaffModalOpen(false);
                  }}
                  className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>保存档案修改</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsStaffModalOpen(false)}
                  className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded font-semibold text-xs transition-colors"
                >
                  关闭
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: 新增检验科人员档案 (档案管理) 弹窗 */}
      {/* ============================================================== */}
      {isStaffManagementModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-scaleIn">
            <div className="bg-sky-800 text-white px-5 py-3.5 flex items-center justify-between">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-sky-300" />
                <span>档案管理 - 新增检验技术人员档案</span>
              </h3>
              <button
                onClick={() => setIsStaffManagementModalOpen(false)}
                className="p-1 text-sky-200 hover:text-white rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNewStaffProfile} className="p-5 space-y-3.5 text-xs max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">姓名 *</label>
                  <input
                    type="text"
                    required
                    value={newStaffFormData.name}
                    onChange={(e) => setNewStaffFormData({ ...newStaffFormData, name: e.target.value })}
                    placeholder="如: 赵立峰"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded font-bold text-slate-900"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">性别</label>
                  <select
                    value={newStaffFormData.gender}
                    onChange={(e) => setNewStaffFormData({ ...newStaffFormData, gender: e.target.value as any })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded font-medium"
                  >
                    <option value="男">男</option>
                    <option value="女">女</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">民族</label>
                  <input
                    type="text"
                    value={newStaffFormData.nation}
                    onChange={(e) => setNewStaffFormData({ ...newStaffFormData, nation: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">人员编号 (工号)</label>
                  <input
                    type="text"
                    value={newStaffFormData.code}
                    onChange={(e) => setNewStaffFormData({ ...newStaffFormData, code: e.target.value })}
                    placeholder="STF009"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">出生日期</label>
                  <input
                    type="date"
                    value={newStaffFormData.birthDate}
                    onChange={(e) => setNewStaffFormData({ ...newStaffFormData, birthDate: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">身份证号</label>
                  <input
                    type="text"
                    value={newStaffFormData.idCard}
                    onChange={(e) => setNewStaffFormData({ ...newStaffFormData, idCard: e.target.value })}
                    placeholder="18位身份证号码"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">所属专业组 / 部门</label>
                  <select
                    value={newStaffFormData.department}
                    onChange={(e) => setNewStaffFormData({ ...newStaffFormData, department: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded font-medium"
                  >
                    <option value="检验科 (临床生化组)">检验科 (临床生化组)</option>
                    <option value="检验科 (门诊与采血组)">检验科 (门诊与采血组)</option>
                    <option value="检验科 (微生物检验组)">检验科 (微生物检验组)</option>
                    <option value="检验科 (急诊与临检组)">检验科 (急诊与临检组)</option>
                    <option value="检验科 (质谱与分子组)">检验科 (质谱与分子组)</option>
                    <option value="检验科 (质控与公共冷链)">检验科 (质控与公共冷链)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">专业技术职称 / 职务</label>
                  <select
                    value={newStaffFormData.title}
                    onChange={(e) => setNewStaffFormData({ ...newStaffFormData, title: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded font-medium"
                  >
                    <option value="主任检验师">主任检验师 (正高)</option>
                    <option value="副主任检验师">副主任检验师 (副高)</option>
                    <option value="主管检验师">主管检验师 (中级)</option>
                    <option value="检验医师">检验医师 (初级/师)</option>
                    <option value="检验师">检验师 (初级/师)</option>
                    <option value="检验士">检验士 (初级/士)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">最高学历 / 学位</label>
                  <select
                    value={newStaffFormData.educationLevel}
                    onChange={(e) => setNewStaffFormData({ ...newStaffFormData, educationLevel: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded font-medium"
                  >
                    <option value="大学本科">大学本科 (医学学士)</option>
                    <option value="硕士研究生">硕士研究生 (医学硕士)</option>
                    <option value="博士研究生">博士研究生 (医学博士)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">毕业院校</label>
                  <input
                    type="text"
                    value={newStaffFormData.school}
                    onChange={(e) => setNewStaffFormData({ ...newStaffFormData, school: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">所学专业</label>
                  <input
                    type="text"
                    value={newStaffFormData.major}
                    onChange={(e) => setNewStaffFormData({ ...newStaffFormData, major: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">联系电话</label>
                  <input
                    type="text"
                    value={newStaffFormData.phone}
                    onChange={(e) => setNewStaffFormData({ ...newStaffFormData, phone: e.target.value })}
                    placeholder="138xxxxxxxx"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">执业资格证书号</label>
                  <input
                    type="text"
                    value={newStaffFormData.certNo}
                    onChange={(e) => setNewStaffFormData({ ...newStaffFormData, certNo: e.target.value })}
                    placeholder="2026xxxxxx"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">现住址</label>
                <input
                  type="text"
                  value={newStaffFormData.address}
                  onChange={(e) => setNewStaffFormData({ ...newStaffFormData, address: e.target.value })}
                  placeholder="如: 北京市海淀区中关村南大街..."
                  className="w-full px-3 py-1.5 border border-slate-300 rounded"
                />
              </div>

              <div className="bg-slate-50 -mx-5 -mb-5 px-5 py-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsStaffManagementModalOpen(false)}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-semibold text-xs"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded font-semibold text-xs shadow-xs"
                >
                  保存建档
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* ============================================================== */}
      {/* MODAL: 设备检查规则配置 弹窗 (渲染“检查类型列表”与“类型明细列表”) */}
      {/* ============================================================== */}
      {isDeviceRuleModalOpen && selectedDeviceForRules && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-5xl overflow-hidden flex flex-col max-h-[90vh] animate-scaleIn">
            {/* 弹窗头部 */}
            <div className="bg-sky-800 text-white px-5 py-3.5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <Wrench className="w-5 h-5 text-sky-300" />
                <div>
                  <h3 className="font-bold text-sm flex items-center gap-2">
                    <span>{selectedDeviceForRules.name} - 设备检查规则配置</span>
                    <span className="text-xs bg-sky-700 px-2 py-0.5 rounded font-mono font-normal">
                      设备编码: {selectedDeviceForRules.code}
                    </span>
                  </h3>
                  <p className="text-[11px] text-sky-200 mt-0.5 font-sans">
                    使用部门: {selectedDeviceForRules.department} · 责任人: {selectedDeviceForRules.responsible} · 上次检查: {selectedDeviceForRules.lastCheckTime}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsDeviceRuleModalOpen(false)}
                className="p-1.5 text-sky-200 hover:text-white rounded hover:bg-sky-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 弹窗主体内容：包含 检查类型列表 与 类型明细列表 */}
            <div className="p-4 overflow-y-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 bg-slate-100">
              {/* 左侧/上半部分：检查类型列表 (对应原截图中间部分) */}
              <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs flex flex-col min-h-[280px]">
                <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
                  <span className="font-bold text-sky-900 text-xs flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-sky-600" />
                    <span>检查类型列表</span>
                  </span>
                  <button
                    onClick={() => setIsAddCheckTypeModalOpen(true)}
                    className="px-2.5 py-1 bg-sky-600 hover:bg-sky-700 text-white rounded text-[11px] font-semibold flex items-center gap-1 shadow-2xs"
                  >
                    <Plus className="w-3 h-3" />
                    <span>新增类型</span>
                  </button>
                </div>

                <div className="overflow-x-auto flex-1">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold text-[11px]">
                      <tr>
                        <th className="py-2.5 px-3">类型名称</th>
                        <th className="py-2.5 px-3 w-16 text-center">周期</th>
                        <th className="py-2.5 px-3">检查时间</th>
                        <th className="py-2.5 px-3 w-16 text-center">状态</th>
                        <th className="py-2.5 px-3 text-center w-28">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                      {selectedDeviceForRules.checkTypes.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-slate-400 text-xs">
                            暂未配置检查类型，请点击右上角“新增类型”
                          </td>
                        </tr>
                      ) : (
                        selectedDeviceForRules.checkTypes.map((ct) => {
                          const isSelected = selectedCheckTypeId === ct.id;
                          return (
                            <tr
                              key={ct.id}
                              onClick={() => setSelectedCheckTypeId(ct.id)}
                              className={`cursor-pointer transition-colors ${
                                isSelected ? 'bg-sky-50 font-semibold border-l-4 border-l-sky-600' : 'hover:bg-slate-50'
                              }`}
                            >
                              <td className="py-2.5 px-3 font-medium text-slate-900">{ct.typeName}</td>
                              <td className="py-2.5 px-3 text-center font-mono">
                                <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 text-[10px]">
                                  {ct.cycle}
                                </span>
                              </td>
                              <td className="py-2.5 px-3 font-mono text-slate-600 text-[11px]">{ct.checkTime}</td>
                              <td className="py-2.5 px-3 text-center">
                                <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                                  ct.status === '启用' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500'
                                }`}>
                                  {ct.status}
                                </span>
                              </td>
                              <td className="py-2.5 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                                <div className="flex items-center justify-center gap-1.5 text-[11px]">
                                  <button
                                    onClick={() => triggerAction(`正在编辑检查类型《${ct.typeName}》`)}
                                    className="text-sky-600 hover:underline"
                                  >
                                    编辑
                                  </button>
                                  <button
                                    onClick={() => handleToggleCheckTypeStatus(ct.id)}
                                    className="text-amber-600 hover:underline"
                                  >
                                    {ct.status === '启用' ? '停用' : '启用'}
                                  </button>
                                  <button
                                    onClick={() => handleDeleteCheckType(ct.id)}
                                    className="text-rose-600 hover:underline"
                                  >
                                    删除
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="p-2 bg-slate-50 border-t border-slate-200 text-[11px] text-sky-800 font-bold font-mono">
                  合计: {selectedDeviceForRules.checkTypes.length} 条
                </div>
              </div>

              {/* 右侧/下半部分：类型明细列表 (对应原截图右侧部分) */}
              <div className="lg:col-span-6 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs flex flex-col min-h-[280px]">
                <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
                  <span className="font-bold text-sky-900 text-xs flex items-center gap-1.5">
                    <FileCheck className="w-3.5 h-3.5 text-sky-600" />
                    <span>
                      类型明细列表 ({selectedDeviceForRules.checkTypes.find((ct) => ct.id === selectedCheckTypeId)?.typeName || '请选择类型'})
                    </span>
                  </span>
                  <button
                    onClick={() => {
                      if (!selectedCheckTypeId) {
                        triggerAction('请先在左侧选择或新增一个检查类型！');
                        return;
                      }
                      setIsAddDetailItemModalOpen(true);
                    }}
                    className="px-2.5 py-1 bg-sky-600 hover:bg-sky-700 text-white rounded text-[11px] font-semibold flex items-center gap-1 shadow-2xs"
                  >
                    <Plus className="w-3 h-3" />
                    <span>新增明细</span>
                  </button>
                </div>

                <div className="overflow-x-auto flex-1">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold text-[11px]">
                      <tr>
                        <th className="py-2.5 px-3">项目名称</th>
                        <th className="py-2.5 px-3 w-16">项目类型</th>
                        <th className="py-2.5 px-3">选项值/标准范围</th>
                        <th className="py-2.5 px-3 w-16">默认值</th>
                        <th className="py-2.5 px-3 w-12 text-center">必填</th>
                        <th className="py-2.5 px-3 text-center w-16">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                      {(() => {
                        const currentCT = selectedDeviceForRules.checkTypes.find((ct) => ct.id === selectedCheckTypeId);
                        const itemsList = currentCT ? currentCT.items : [];
                        if (itemsList.length === 0) {
                          return (
                            <tr>
                              <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                                当前检查类型下暂无配置项，请点击右上角“新增明细”
                              </td>
                            </tr>
                          );
                        }
                        return itemsList.map((itm) => (
                          <tr key={itm.id} className="hover:bg-slate-50">
                            <td className="py-2.5 px-3 font-semibold text-slate-900">{itm.itemName}</td>
                            <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">{itm.itemType}</td>
                            <td className="py-2.5 px-3 font-mono text-sky-700 font-medium">{itm.optionValues}</td>
                            <td className="py-2.5 px-3 font-mono text-slate-600 text-[11px]">{itm.defaultValue}</td>
                            <td className="py-2.5 px-3 text-center">
                              <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                                itm.required === '是' ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-slate-100 text-slate-500'
                              }`}>
                                {itm.required}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <button
                                onClick={() => handleDeleteDetailItem(itm.id)}
                                className="text-rose-600 hover:underline text-[11px]"
                              >
                                删除
                              </button>
                            </td>
                          </tr>
                        ));
                      })()}
                    </tbody>
                  </table>
                </div>

                <div className="p-2 bg-slate-50 border-t border-slate-200 text-[11px] text-sky-800 font-bold font-mono">
                  合计: {(selectedDeviceForRules.checkTypes.find((ct) => ct.id === selectedCheckTypeId)?.items || []).length} 条
                </div>
              </div>
            </div>

            <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-between items-center text-xs shrink-0">
              <span className="text-slate-500 font-mono">修改将同步写入设备巡检字典，供巡检人员实时调用</span>
              <button
                onClick={() => setIsDeviceRuleModalOpen(false)}
                className="px-5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded shadow-xs"
              >
                保存并关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUB-MODAL: 新增检查类型 */}
      {isAddCheckTypeModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-sm overflow-hidden animate-scaleIn">
            <div className="bg-sky-700 text-white px-5 py-3 flex items-center justify-between">
              <h3 className="font-bold text-xs flex items-center gap-1.5">
                <Plus className="w-4 h-4" />
                <span>新增设备检查类型</span>
              </h3>
              <button onClick={() => setIsAddCheckTypeModalOpen(false)} className="p-1 text-sky-100 hover:text-white rounded">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveNewCheckType} className="p-5 space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">检查类型名称 *</label>
                <input
                  type="text"
                  required
                  value={newCheckTypeFormData.typeName}
                  onChange={(e) => setNewCheckTypeFormData({ ...newCheckTypeFormData, typeName: e.target.value })}
                  placeholder="如: 月度过滤器与管路反冲洗"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded font-semibold text-slate-900"
                  autoFocus
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">检查周期</label>
                  <select
                    value={newCheckTypeFormData.cycle}
                    onChange={(e) => setNewCheckTypeFormData({ ...newCheckTypeFormData, cycle: e.target.value as any })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded font-medium"
                  >
                    <option value="日检">日检</option>
                    <option value="周检">周检</option>
                    <option value="月检">月检</option>
                    <option value="季检">季检</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">检查时间/频次</label>
                  <input
                    type="text"
                    value={newCheckTypeFormData.checkTime}
                    onChange={(e) => setNewCheckTypeFormData({ ...newCheckTypeFormData, checkTime: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono"
                  />
                </div>
              </div>
              <div className="bg-slate-50 -mx-5 -mb-5 px-5 py-3 border-t border-slate-200 flex justify-end gap-2">
                <button type="button" onClick={() => setIsAddCheckTypeModalOpen(false)} className="px-3.5 py-1.5 bg-slate-100 text-slate-700 rounded font-semibold">取消</button>
                <button type="submit" className="px-4 py-1.5 bg-sky-600 text-white rounded font-semibold shadow-xs">添加类型</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUB-MODAL: 新增明细项目 */}
      {isAddDetailItemModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-scaleIn">
            <div className="bg-sky-700 text-white px-5 py-3 flex items-center justify-between">
              <h3 className="font-bold text-xs flex items-center gap-1.5">
                <Plus className="w-4 h-4" />
                <span>新增检查项明细</span>
              </h3>
              <button onClick={() => setIsAddDetailItemModalOpen(false)} className="p-1 text-sky-100 hover:text-white rounded">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveNewDetailItem} className="p-5 space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">项目名称 *</label>
                <input
                  type="text"
                  required
                  value={newDetailItemFormData.itemName}
                  onChange={(e) => setNewDetailItemFormData({ ...newDetailItemFormData, itemName: e.target.value })}
                  placeholder="如: 超纯水电阻率 / 废液管道通畅度"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded font-semibold text-slate-900"
                  autoFocus
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">项目类型</label>
                  <select
                    value={newDetailItemFormData.itemType}
                    onChange={(e) => setNewDetailItemFormData({ ...newDetailItemFormData, itemType: e.target.value as any })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded font-medium"
                  >
                    <option value="数值型">数值型</option>
                    <option value="选择型">选择型</option>
                    <option value="布尔型">布尔型</option>
                    <option value="文本型">文本型</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">是否必填</label>
                  <select
                    value={newDetailItemFormData.required}
                    onChange={(e) => setNewDetailItemFormData({ ...newDetailItemFormData, required: e.target.value as any })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded font-medium"
                  >
                    <option value="是">是</option>
                    <option value="否">否</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">选项值 / 标准范围</label>
                <input
                  type="text"
                  value={newDetailItemFormData.optionValues}
                  onChange={(e) => setNewDetailItemFormData({ ...newDetailItemFormData, optionValues: e.target.value })}
                  placeholder="如: ≥18.2MΩ.cm 或 正常/堵塞"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-semibold mb-1">默认参考值</label>
                <input
                  type="text"
                  value={newDetailItemFormData.defaultValue}
                  onChange={(e) => setNewDetailItemFormData({ ...newDetailItemFormData, defaultValue: e.target.value })}
                  placeholder="如: 正常"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono"
                />
              </div>
              <div className="bg-slate-50 -mx-5 -mb-5 px-5 py-3 border-t border-slate-200 flex justify-end gap-2">
                <button type="button" onClick={() => setIsAddDetailItemModalOpen(false)} className="px-3.5 py-1.5 bg-slate-100 text-slate-700 rounded font-semibold">取消</button>
                <button type="submit" className="px-4 py-1.5 bg-sky-600 text-white rounded font-semibold shadow-xs">添加明细</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: 新建科室/设备检查计划 弹窗 */}
      {/* ============================================================== */}
      {isAddPlanModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden animate-scaleIn">
            <div className="bg-sky-700 text-white px-5 py-3.5 flex items-center justify-between">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <Calendar className="w-4 h-4 text-sky-200" />
                <span>新建科室/设备检查计划</span>
              </h3>
              <button
                onClick={() => setIsAddPlanModalOpen(false)}
                className="p-1 text-sky-100 hover:text-white rounded hover:bg-sky-600/50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNewPlan} className="p-5 space-y-3.5 text-xs max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">计划名称 *</label>
                <input
                  type="text"
                  required
                  value={newPlanForm.title}
                  onChange={(e) => setNewPlanForm({ ...newPlanForm, title: e.target.value })}
                  placeholder="如: AU2700 11月份光路自检与恒温盘保养计划"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded font-semibold text-slate-900 focus:outline-none focus:border-sky-500"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">关联受控设备</label>
                  <select
                    value={newPlanForm.deviceId}
                    onChange={(e) => {
                      const selectedId = e.target.value;
                      const devMap: Record<string, { name: string; code: string; dept: string }> = {
                        'DEV-RULE-001': { name: 'AU2700 全自动生化分析仪', code: '124323', dept: '生化组' },
                        'DEV-RULE-002': { name: 'Beckman Coulter DxI 800 发光免疫仪', code: '124334', dept: '免疫组' },
                        'DEV-RULE-003': { name: 'Cobas 8000 全自动生化免疫流水线', code: '125101', dept: '生化组' },
                        'DEV-RULE-004': { name: 'Sysmex XN-9000 全自动血液分析流水线', code: '126202', dept: '临检组' },
                        'DEV-RULE-005': { name: 'Bruker MALDI-TOF 飞行时间质谱仪', code: '127303', dept: '微生物组' },
                        'DEV-RULE-006': { name: '沃特世 ACQUITY UPLC 液相质谱联用仪', code: '128404', dept: '质谱分子组' },
                        'DEV-RULE-007': { name: '海尔医用 -80℃ 超低温保存冰箱', code: '129505', dept: '科室公共' },
                        'DEV-RULE-008': { name: '赛默飞 ABI 7500 荧光定量PCR扩增仪', code: '128808', dept: '质谱分子组' },
                        'DEV-RULE-009': { name: '二级生物安全柜 (BSC-1300IIA2)', code: '130101', dept: '微生物组' },
                      };
                      const found = devMap[selectedId] || { name: '通用检验仪器', code: '999999', dept: '综合组' };
                      setNewPlanForm({
                        ...newPlanForm,
                        deviceId: selectedId,
                        deviceName: found.name,
                        deviceCode: found.code,
                        department: found.dept,
                      });
                    }}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded font-medium text-slate-800"
                  >
                    <option value="DEV-RULE-001">AU2700 全自动生化分析仪 (生化组)</option>
                    <option value="DEV-RULE-002">Beckman Coulter DxI 800 发光免疫仪 (免疫组)</option>
                    <option value="DEV-RULE-003">Cobas 8000 全自动生化免疫流水线 (生化组)</option>
                    <option value="DEV-RULE-004">Sysmex XN-9000 全自动血液流水线 (临检组)</option>
                    <option value="DEV-RULE-005">Bruker MALDI-TOF 质谱仪 (微生物组)</option>
                    <option value="DEV-RULE-006">沃特世 ACQUITY UPLC 液质联用仪 (质谱分子组)</option>
                    <option value="DEV-RULE-007">海尔医用 -80℃ 超低温冷链冰箱 (科室公共)</option>
                    <option value="DEV-RULE-008">赛默飞 ABI 7500 PCR扩增仪 (质谱分子组)</option>
                    <option value="DEV-RULE-009">二级生物安全柜 BSC-1300 (微生物组)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">计划类型</label>
                  <select
                    value={newPlanForm.planType}
                    onChange={(e) => setNewPlanForm({ ...newPlanForm, planType: e.target.value as any })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded font-medium text-slate-800"
                  >
                    <option value="月度检查计划">月度检查计划</option>
                    <option value="季度保养计划">季度保养计划</option>
                    <option value="周度维护计划">周度维护计划</option>
                    <option value="日度巡检计划">日度巡检计划</option>
                    <option value="特别维护计划">特别维护计划</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">执行日期 *</label>
                  <input
                    type="date"
                    required
                    value={newPlanForm.scheduledDate}
                    onChange={(e) => setNewPlanForm({ ...newPlanForm, scheduledDate: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">计划执行时段</label>
                  <input
                    type="text"
                    value={newPlanForm.timeSlot}
                    onChange={(e) => setNewPlanForm({ ...newPlanForm, timeSlot: e.target.value })}
                    placeholder="如: 08:30~10:30"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">执行频次</label>
                  <select
                    value={newPlanForm.cycle}
                    onChange={(e) => setNewPlanForm({ ...newPlanForm, cycle: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded font-medium"
                  >
                    <option value="每月一次">每月一次</option>
                    <option value="每季度一次">每季度一次</option>
                    <option value="每周一次">每周一次</option>
                    <option value="每日一次">每日一次</option>
                    <option value="按需特别保养">按需特别保养</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">维护责任人 (真实人员)</label>
                  <select
                    value={newPlanForm.responsible}
                    onChange={(e) => setNewPlanForm({ ...newPlanForm, responsible: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded font-medium"
                  >
                    <option value="陈志远 (主管检验师)">陈志远 (主管检验师)</option>
                    <option value="王雪梅 (副主任检验师)">王雪梅 (副主任检验师)</option>
                    <option value="赵立峰 (设备高级工程师)">赵立峰 (设备高级工程师)</option>
                    <option value="郭海平 (主管检验师)">郭海平 (主管检验师)</option>
                    <option value="刘洋 (主管检验师)">刘洋 (主管检验师)</option>
                    <option value="孙晓东 (副主任技师)">孙晓东 (副主任技师)</option>
                    <option value="周丽娜 (检验师)">周丽娜 (检验师)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">审核人</label>
                  <select
                    value={newPlanForm.reviewer}
                    onChange={(e) => setNewPlanForm({ ...newPlanForm, reviewer: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded font-medium"
                  >
                    <option value="王雪梅 (副主任检验师)">王雪梅 (副主任检验师)</option>
                    <option value="李明华 (主任医师)">李明华 (主任医师)</option>
                    <option value="张建华 (主任医师)">张建华 (主任医师)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">优先级</label>
                  <select
                    value={newPlanForm.priority}
                    onChange={(e) => setNewPlanForm({ ...newPlanForm, priority: e.target.value as any })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded font-medium"
                  >
                    <option value="普通">普通</option>
                    <option value="高">高 (关键设备)</option>
                    <option value="紧急">紧急 (故障复查)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  检查要点项目 (以中文分号“；”分隔多个检查项)
                </label>
                <textarea
                  rows={3}
                  value={newPlanForm.itemsSummary}
                  onChange={(e) => setNewPlanForm({ ...newPlanForm, itemsSummary: e.target.value })}
                  placeholder="如: 恒温水浴盘排空换水; 光学吸光度灵敏度自测; 样品加样针清洗"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded text-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">维保备忘与标准指引</label>
                <input
                  type="text"
                  value={newPlanForm.remarks}
                  onChange={(e) => setNewPlanForm({ ...newPlanForm, remarks: e.target.value })}
                  placeholder="如: 遵照 CAP / ISO15189 设备维保规范"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded"
                />
              </div>

              <div className="bg-slate-50 -mx-5 -mb-5 px-5 py-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddPlanModalOpen(false)}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-semibold"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded font-semibold shadow-xs flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>保存并排入日程</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: 设备检查计划执行详情与工单 弹窗 */}
      {/* ============================================================== */}
      {isPlanDetailModalOpen && selectedPlanForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-scaleIn">
            {/* 弹窗头部 */}
            <div className="bg-sky-700 text-white px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wrench className="w-4 h-4 text-sky-200" />
                <h3 className="font-bold text-sm">设备检查计划详情与维保工单</h3>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-sky-800 text-sky-100">
                  {selectedPlanForDetail.code}
                </span>
              </div>
              <button
                onClick={() => setIsPlanDetailModalOpen(false)}
                className="p-1 text-sky-100 hover:text-white rounded hover:bg-sky-600/50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 弹窗主体 */}
            <div className="p-5 space-y-4 text-xs max-h-[80vh] overflow-y-auto">
              <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                  <h4 className="font-bold text-base text-slate-900">{selectedPlanForDetail.title}</h4>
                  <p className="text-slate-500 mt-0.5">
                    设备名称：<span className="font-bold text-slate-800">{selectedPlanForDetail.deviceName}</span> (编码: {selectedPlanForDetail.deviceCode}) · {selectedPlanForDetail.department}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      selectedPlanForDetail.status === '已完成'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : selectedPlanForDetail.status === '进行中'
                        ? 'bg-sky-100 text-sky-800 border border-sky-300 animate-pulse'
                        : 'bg-amber-100 text-amber-800 border border-amber-300'
                    }`}
                  >
                    {selectedPlanForDetail.status}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">优先级: {selectedPlanForDetail.priority}</span>
                </div>
              </div>

              {/* 核心属性 */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-500 block">计划执行日期</span>
                  <span className="font-mono font-bold text-slate-900 text-sm">{selectedPlanForDetail.scheduledDate}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">时段与频次</span>
                  <span className="font-mono font-semibold text-slate-800">{selectedPlanForDetail.timeSlot} ({selectedPlanForDetail.cycle})</span>
                </div>
                <div>
                  <span className="text-slate-500 block">负责检验师 / 工程师</span>
                  <span className="font-bold text-slate-800">{selectedPlanForDetail.responsible}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">质控审核人</span>
                  <span className="font-semibold text-slate-800">{selectedPlanForDetail.reviewer}</span>
                </div>
              </div>

              {/* 检查标准与明细要求 */}
              <div>
                <h5 className="font-bold text-slate-800 mb-2 flex items-center justify-between">
                  <span>检查要点清单与标准判定指标 ({selectedPlanForDetail.items.length} 项)</span>
                  <span className="text-[11px] font-normal text-slate-500">ISO15189 仪器受控</span>
                </h5>

                <div className="border border-slate-200 rounded-lg overflow-hidden divide-y divide-slate-100">
                  {selectedPlanForDetail.items.map((itm, iIdx) => (
                    <div key={itm.id} className="p-2.5 bg-white flex items-center justify-between hover:bg-slate-50">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 font-mono font-bold flex items-center justify-center text-[10px]">
                          {iIdx + 1}
                        </span>
                        <div>
                          <span className="font-semibold text-slate-900">{itm.name}</span>
                          {itm.isKeyItem && (
                            <span className="ml-2 px-1.5 py-0.2 bg-rose-50 text-rose-700 border border-rose-200 rounded text-[10px] font-bold">
                              重点项
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="font-mono text-slate-600 bg-slate-50 px-2 py-0.5 rounded border border-slate-200 text-[11px]">
                        标准: {itm.standard}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 历史执行或完成情况 */}
              {selectedPlanForDetail.status === '已完成' && (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-800 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>该检查计划已执行完毕，各项指标合格</span>
                    </span>
                    <span className="font-mono text-emerald-700 font-bold">
                      完成时间: {selectedPlanForDetail.completedAt}
                    </span>
                  </div>
                  <div className="text-emerald-700 text-[11px]">
                    执行人：{selectedPlanForDetail.completedBy} | 报告已同步归档至《设备检查记录》台账
                  </div>
                </div>
              )}

              {selectedPlanForDetail.remarks && (
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-slate-600 text-[11px]">
                  <span className="font-bold text-slate-700">备注说明：</span>
                  {selectedPlanForDetail.remarks}
                </div>
              )}
            </div>

            {/* 弹窗底部操作 */}
            <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => handleDeletePlan(selectedPlanForDetail.id)}
                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded font-semibold text-xs flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>删除计划</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => triggerAction(`已生成并打印计划工单《${selectedPlanForDetail.code}》`)}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-semibold text-xs flex items-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>打印维保单</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleTogglePlanStatus(selectedPlanForDetail.id)}
                  className={`px-4 py-1.5 text-white rounded font-semibold text-xs flex items-center gap-1 shadow-xs transition-colors ${
                    selectedPlanForDetail.status === '已完成'
                      ? 'bg-amber-600 hover:bg-amber-700'
                      : 'bg-emerald-600 hover:bg-emerald-700'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{selectedPlanForDetail.status === '已完成' ? '重置为待执行' : '标记执行完成'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsPlanDetailModalOpen(false)}
                  className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded font-semibold text-xs"
                >
                  关闭
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
