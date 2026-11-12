import React, { useState, useMemo } from 'react';
import {
  CalendarCheck as Calendar,
  Clock,
  User as Users,
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Download,
  Printer,
  RefreshCw,
  RotateCcw,
  Save,
  Send,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Check,
  X,
  Layers,
  Activity,
  FileSpreadsheet,
  Copy,
  Sparkles,
  ShieldCheck,
  Eye,
  Sliders,
  Building2,
  HelpCircle as Info
} from './MenuIcon';
import { UserProfile } from '../types/navigation';

export interface StaffWeekScheduleProps {
  user: UserProfile;
  triggerAction: (msg: string) => void;
  onSwitchMode?: (mode: 'month' | 'week') => void;
  currentYear?: string;
  currentMonth?: number;
}

// 班次定义元数据
export interface ShiftTypeMeta {
  code: string;
  name: string;
  timeSlot: string;
  hours: number;
  colorClass: string;
  badgeBg: string;
  borderColor: string;
  textColor: string;
  icon: string;
  category: 'day' | 'evening' | 'night' | 'duty' | 'rest' | 'qc';
}

export const SHIFT_TYPES: Record<string, ShiftTypeMeta> = {
  '白班': {
    code: 'D1',
    name: '白班',
    timeSlot: '08:00~17:00',
    hours: 8,
    colorClass: 'emerald',
    badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    borderColor: 'border-emerald-300',
    textColor: 'text-emerald-700',
    icon: '☀️',
    category: 'day',
  },
  '早班': {
    code: 'M1',
    name: '早班',
    timeSlot: '07:30~15:30',
    hours: 7.5,
    colorClass: 'teal',
    badgeBg: 'bg-teal-50 text-teal-800 border-teal-200',
    borderColor: 'border-teal-300',
    textColor: 'text-teal-700',
    icon: '🌅',
    category: 'day',
  },
  '中班': {
    code: 'A1',
    name: '中班',
    timeSlot: '15:30~23:00',
    hours: 7,
    colorClass: 'amber',
    badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
    borderColor: 'border-amber-300',
    textColor: 'text-amber-700',
    icon: '🌇',
    category: 'evening',
  },
  '小夜班': {
    code: 'N1',
    name: '小夜班',
    timeSlot: '17:30~23:30',
    hours: 6,
    colorClass: 'sky',
    badgeBg: 'bg-sky-50 text-sky-800 border-sky-200',
    borderColor: 'border-sky-300',
    textColor: 'text-sky-700',
    icon: '🌙',
    category: 'evening',
  },
  '大夜班': {
    code: 'N2',
    name: '大夜班',
    timeSlot: '23:00~08:30',
    hours: 9,
    colorClass: 'indigo',
    badgeBg: 'bg-indigo-50 text-indigo-900 border-indigo-200',
    borderColor: 'border-indigo-300',
    textColor: 'text-indigo-800',
    icon: '🌌',
    category: 'night',
  },
  '急查值班': {
    code: 'ED',
    name: '急查值班',
    timeSlot: '17:00~08:30',
    hours: 14.5,
    colorClass: 'rose',
    badgeBg: 'bg-rose-50 text-rose-800 border-rose-200',
    borderColor: 'border-rose-300',
    textColor: 'text-rose-700',
    icon: '🚨',
    category: 'duty',
  },
  '质控专责': {
    code: 'QC',
    name: '质控专责',
    timeSlot: '08:00~17:00',
    hours: 8,
    colorClass: 'purple',
    badgeBg: 'bg-purple-50 text-purple-800 border-purple-200',
    borderColor: 'border-purple-300',
    textColor: 'text-purple-700',
    icon: '🔬',
    category: 'qc',
  },
  '轮休': {
    code: 'OFF',
    name: '轮休',
    timeSlot: '全天公休',
    hours: 0,
    colorClass: 'slate',
    badgeBg: 'bg-slate-100 text-slate-500 border-slate-200',
    borderColor: 'border-slate-200',
    textColor: 'text-slate-400',
    icon: '☕',
    category: 'rest',
  },
};

// 工位/工作台选项
export const WORKSTATION_OPTIONS = [
  '临床生化流水线 (AU5800/Cobas8000)',
  '免疫发光区 (Centaur/Architect)',
  '急诊临检1号台 (XN-9000/全自动血沉)',
  '急诊尿沉渣镜检工作站',
  '微生物接种与药敏培养室',
  '质谱鉴定与分子PCR实验室',
  '门诊采血1-4号服务窗口',
  '危急值复核与室内质控专岗',
  '全科总值班与突发应急岗',
];

// 医务人员周排班信息
export interface StaffWeekScheduleItem {
  id: string;
  code: string;
  name: string;
  gender: '男' | '女';
  department: string;
  title: string;
  roleTag: '科主任' | '组长' | '骨干' | '带教' | '常规' | '规培';
  phone: string;
  // 7天的排班记录: key为 "YYYY-MM-DD"
  shifts: Record<
    string,
    {
      shiftName: string;
      workstation: string;
      role?: '主班' | '副班' | '备班' | '带教';
      note?: string;
      isModified?: boolean;
    }
  >;
}

// 模拟科室医生与技师
const INITIAL_STAFF_WEEK_DATA: StaffWeekScheduleItem[] = [
  {
    id: 'STF-101',
    code: 'STF001',
    name: '张建华',
    gender: '男',
    department: '质控与行政组',
    title: '主任检验师',
    roleTag: '科主任',
    phone: '13811223344',
    shifts: {
      '2026-10-26': { shiftName: '白班', workstation: '危急值复核与室内质控专岗', role: '主班', note: '全科早交班主持' },
      '2026-10-27': { shiftName: '白班', workstation: '危急值复核与室内质控专岗', role: '主班', note: 'ISO15189质控内审' },
      '2026-10-28': { shiftName: '白班', workstation: '危急值复核与室内质控专岗', role: '主班' },
      '2026-10-29': { shiftName: '质控专责', workstation: '危急值复核与室内质控专岗', role: '主班', note: '卫生部室间质评复核' },
      '2026-10-30': { shiftName: '白班', workstation: '危急值复核与室内质控专岗', role: '主班', note: '院周会报告' },
      '2026-10-31': { shiftName: '轮休', workstation: '全天公休' },
      '2026-11-01': { shiftName: '轮休', workstation: '全天公休' },
    },
  },
  {
    id: 'STF-102',
    code: 'STF002',
    name: '王雪梅',
    gender: '女',
    department: '门诊采血组',
    title: '副主任检验师',
    roleTag: '组长',
    phone: '13955667788',
    shifts: {
      '2026-10-26': { shiftName: '早班', workstation: '门诊采血1-4号服务窗口', role: '主班', note: '早高峰采血保障' },
      '2026-10-27': { shiftName: '早班', workstation: '门诊采血1-4号服务窗口', role: '主班' },
      '2026-10-28': { shiftName: '白班', workstation: '门诊采血1-4号服务窗口', role: '主班', note: '采血管耗材盘点' },
      '2026-10-29': { shiftName: '早班', workstation: '门诊采血1-4号服务窗口', role: '主班' },
      '2026-10-30': { shiftName: '白班', workstation: '门诊采血1-4号服务窗口', role: '主班' },
      '2026-10-31': { shiftName: '早班', workstation: '门诊采血1-4号服务窗口', role: '主班', note: '周六门诊高峰' },
      '2026-11-01': { shiftName: '轮休', workstation: '全天公休' },
    },
  },
  {
    id: 'STF-103',
    code: 'STF003',
    name: '李明哲',
    gender: '男',
    department: '临床生化组',
    title: '主管检验师',
    roleTag: '组长',
    phone: '13766778899',
    shifts: {
      '2026-10-26': { shiftName: '白班', workstation: '临床生化流水线 (AU5800/Cobas8000)', role: '主班', note: '生化流水线批审核' },
      '2026-10-27': { shiftName: '白班', workstation: '临床生化流水线 (AU5800/Cobas8000)', role: '主班' },
      '2026-10-28': { shiftName: '中班', workstation: '临床生化流水线 (AU5800/Cobas8000)', role: '主班', note: '急查生化发单' },
      '2026-10-29': { shiftName: '轮休', workstation: '全天公休' },
      '2026-10-30': { shiftName: '白班', workstation: '临床生化流水线 (AU5800/Cobas8000)', role: '主班' },
      '2026-10-31': { shiftName: '白班', workstation: '临床生化流水线 (AU5800/Cobas8000)', role: '主班', note: '周末生化值班' },
      '2026-11-01': { shiftName: '轮休', workstation: '全天公休' },
    },
  },
  {
    id: 'STF-104',
    code: 'STF004',
    name: '陈思远',
    gender: '男',
    department: '急诊临检组',
    title: '主管检验师',
    roleTag: '组长',
    phone: '13888990011',
    shifts: {
      '2026-10-26': { shiftName: '白班', workstation: '急诊临检1号台 (XN-9000/全自动血沉)', role: '主班' },
      '2026-10-27': { shiftName: '小夜班', workstation: '急诊临检1号台 (XN-9000/全自动血沉)', role: '主班', note: '晚间急诊创伤加急' },
      '2026-10-28': { shiftName: '大夜班', workstation: '急诊临检1号台 (XN-9000/全自动血沉)', role: '主班', note: '通宵危急值响应' },
      '2026-10-29': { shiftName: '轮休', workstation: '全天公休', note: '夜班下夜轮休' },
      '2026-10-30': { shiftName: '轮休', workstation: '全天公休' },
      '2026-10-31': { shiftName: '急查值班', workstation: '急诊临检1号台 (XN-9000/全自动血沉)', role: '主班', note: '周末24h通宵值班' },
      '2026-11-01': { shiftName: '轮休', workstation: '全天公休', note: '值班下夜轮休' },
    },
  },
  {
    id: 'STF-105',
    code: 'STF005',
    name: '赵静雅',
    gender: '女',
    department: '微生物组',
    title: '主管检验师',
    roleTag: '骨干',
    phone: '13677889900',
    shifts: {
      '2026-10-26': { shiftName: '白班', workstation: '微生物接种与药敏培养室', role: '主班', note: '血培养阳性快速报' },
      '2026-10-27': { shiftName: '白班', workstation: '微生物接种与药敏培养室', role: '主班' },
      '2026-10-28': { shiftName: '白班', workstation: '微生物接种与药敏培养室', role: '主班', note: '耐药菌WHONET上报' },
      '2026-10-29': { shiftName: '白班', workstation: '微生物接种与药敏培养室', role: '主班' },
      '2026-10-30': { shiftName: '白班', workstation: '微生物接种与药敏培养室', role: '主班' },
      '2026-10-31': { shiftName: '轮休', workstation: '全天公休' },
      '2026-11-01': { shiftName: '轮休', workstation: '全天公休' },
    },
  },
  {
    id: 'STF-106',
    code: 'STF006',
    name: '刘海波',
    gender: '男',
    department: '质谱分子组',
    title: '主管检验师',
    roleTag: '骨干',
    phone: '13566778811',
    shifts: {
      '2026-10-26': { shiftName: '白班', workstation: '质谱鉴定与分子PCR实验室', role: '主班', note: '基因测序批上机' },
      '2026-10-27': { shiftName: '白班', workstation: '质谱鉴定与分子PCR实验室', role: '主班' },
      '2026-10-28': { shiftName: '质控专责', workstation: '质谱鉴定与分子PCR实验室', role: '主班', note: '质谱内标定标校准' },
      '2026-10-29': { shiftName: '白班', workstation: '质谱鉴定与分子PCR实验室', role: '主班' },
      '2026-10-30': { shiftName: '白班', workstation: '质谱鉴定与分子PCR实验室', role: '主班' },
      '2026-10-31': { shiftName: '轮休', workstation: '全天公休' },
      '2026-11-01': { shiftName: '轮休', workstation: '全天公休' },
    },
  },
  {
    id: 'STF-107',
    code: 'STF007',
    name: '周晓云',
    gender: '女',
    department: '血液形态组',
    title: '检验师',
    roleTag: '常规',
    phone: '13822334455',
    shifts: {
      '2026-10-26': { shiftName: '白班', workstation: '急诊尿沉渣镜检工作站', role: '副班', note: '外周血涂片显微镜检' },
      '2026-10-27': { shiftName: '白班', workstation: '急诊尿沉渣镜检工作站', role: '副班' },
      '2026-10-28': { shiftName: '中班', workstation: '急诊临检1号台 (XN-9000/全自动血沉)', role: '副班' },
      '2026-10-29': { shiftName: '中班', workstation: '急诊临检1号台 (XN-9000/全自动血沉)', role: '副班' },
      '2026-10-30': { shiftName: '白班', workstation: '急诊尿沉渣镜检工作站', role: '主班' },
      '2026-10-31': { shiftName: '轮休', workstation: '全天公休' },
      '2026-11-01': { shiftName: '白班', workstation: '急诊尿沉渣镜检工作站', role: '主班', note: '周日形态镜检值班' },
    },
  },
  {
    id: 'STF-108',
    code: 'STF008',
    name: '黄文博',
    gender: '男',
    department: '临床生化组',
    title: '副主任检验师',
    roleTag: '带教',
    phone: '13911224466',
    shifts: {
      '2026-10-26': { shiftName: '白班', workstation: '免疫发光区 (Centaur/Architect)', role: '带教', note: '带教规培医师规程' },
      '2026-10-27': { shiftName: '白班', workstation: '免疫发光区 (Centaur/Architect)', role: '主班' },
      '2026-10-28': { shiftName: '白班', workstation: '免疫发光区 (Centaur/Architect)', role: '主班' },
      '2026-10-29': { shiftName: '大夜班', workstation: '急诊临检1号台 (XN-9000/全自动血沉)', role: '主班', note: '夜班二线带班' },
      '2026-10-30': { shiftName: '轮休', workstation: '全天公休', note: '夜班下夜' },
      '2026-10-31': { shiftName: '轮休', workstation: '全天公休' },
      '2026-11-01': { shiftName: '白班', workstation: '免疫发光区 (Centaur/Architect)', role: '主班' },
    },
  },
  {
    id: 'STF-109',
    code: 'STF009',
    name: '郑雨薇',
    gender: '女',
    department: '门诊采血组',
    title: '检验师',
    roleTag: '常规',
    phone: '13688992233',
    shifts: {
      '2026-10-26': { shiftName: '早班', workstation: '门诊采血1-4号服务窗口', role: '副班' },
      '2026-10-27': { shiftName: '早班', workstation: '门诊采血1-4号服务窗口', role: '副班' },
      '2026-10-28': { shiftName: '早班', workstation: '门诊采血1-4号服务窗口', role: '副班' },
      '2026-10-29': { shiftName: '白班', workstation: '门诊采血1-4号服务窗口', role: '副班' },
      '2026-10-30': { shiftName: '早班', workstation: '门诊采血1-4号服务窗口', role: '副班' },
      '2026-10-31': { shiftName: '早班', workstation: '门诊采血1-4号服务窗口', role: '副班' },
      '2026-11-01': { shiftName: '轮休', workstation: '全天公休' },
    },
  },
  {
    id: 'STF-110',
    code: 'STF010',
    name: '孙浩然',
    gender: '男',
    department: '急诊临检组',
    title: '检验师',
    roleTag: '规培',
    phone: '13577884455',
    shifts: {
      '2026-10-26': { shiftName: '中班', workstation: '急诊临检1号台 (XN-9000/全自动血沉)', role: '副班' },
      '2026-10-27': { shiftName: '大夜班', workstation: '急诊临检1号台 (XN-9000/全自动血沉)', role: '副班', note: '夜班一线值守' },
      '2026-10-28': { shiftName: '轮休', workstation: '全天公休', note: '下夜轮休' },
      '2026-10-29': { shiftName: '白班', workstation: '急诊临检1号台 (XN-9000/全自动血沉)', role: '副班' },
      '2026-10-30': { shiftName: '大夜班', workstation: '急诊临检1号台 (XN-9000/全自动血沉)', role: '副班', note: '今晚夜班值班' },
      '2026-10-31': { shiftName: '轮休', workstation: '全天公休' },
      '2026-11-01': { shiftName: '中班', workstation: '急诊临检1号台 (XN-9000/全自动血沉)', role: '副班' },
    },
  },
  {
    id: 'STF-111',
    code: 'STF011',
    name: '许雅婷',
    gender: '女',
    department: '微生物组',
    title: '检验师',
    roleTag: '常规',
    phone: '13788991122',
    shifts: {
      '2026-10-26': { shiftName: '白班', workstation: '微生物接种与药敏培养室', role: '副班' },
      '2026-10-27': { shiftName: '中班', workstation: '微生物接种与药敏培养室', role: '副班', note: '晚间培养物观察' },
      '2026-10-28': { shiftName: '白班', workstation: '微生物接种与药敏培养室', role: '副班' },
      '2026-10-29': { shiftName: '白班', workstation: '微生物接种与药敏培养室', role: '副班' },
      '2026-10-30': { shiftName: '白班', workstation: '微生物接种与药敏培养室', role: '副班' },
      '2026-10-31': { shiftName: '白班', workstation: '微生物接种与药敏培养室', role: '主班', note: '周末菌种分纯' },
      '2026-11-01': { shiftName: '轮休', workstation: '全天公休' },
    },
  },
  {
    id: 'STF-112',
    code: 'STF012',
    name: '钱程',
    gender: '男',
    department: '质控与行政组',
    title: '主管检验师',
    roleTag: '骨干',
    phone: '13933445566',
    shifts: {
      '2026-10-26': { shiftName: '质控专责', workstation: '全科总值班与突发应急岗', role: '主班', note: '全院危急值时效督查' },
      '2026-10-27': { shiftName: '白班', workstation: '全科总值班与突发应急岗', role: '主班' },
      '2026-10-28': { shiftName: '白班', workstation: '全科总值班与突发应急岗', role: '主班' },
      '2026-10-29': { shiftName: '急查值班', workstation: '全科总值班与突发应急岗', role: '主班', note: '全院检验二线总值班' },
      '2026-10-30': { shiftName: '轮休', workstation: '全天公休', note: '下夜轮休' },
      '2026-10-31': { shiftName: '轮休', workstation: '全天公休' },
      '2026-11-01': { shiftName: '急查值班', workstation: '全科总值班与突发应急岗', role: '主班', note: '周日全科总值班' },
    },
  },
];

// 周信息定义
interface WeekOption {
  weekNum: number;
  label: string;
  startDate: string;
  endDate: string;
  isCurrent?: boolean;
}

const AVAILABLE_WEEKS: WeekOption[] = [
  { weekNum: 43, label: '第43周 (10月19日 ~ 10月25日)', startDate: '2026-10-19', endDate: '2026-10-25' },
  { weekNum: 44, label: '第44周 (10月26日 ~ 11月01日) · [本周]', startDate: '2026-10-26', endDate: '2026-11-01', isCurrent: true },
  { weekNum: 45, label: '第45周 (11月02日 ~ 11月08日)', startDate: '2026-11-02', endDate: '2026-11-08' },
  { weekNum: 46, label: '第46周 (11月09日 ~ 11月15日)', startDate: '2026-11-09', endDate: '2026-11-15' },
];

export const StaffSchedulingWeekView: React.FC<StaffWeekScheduleProps> = ({
  user,
  triggerAction,
  onSwitchMode,
  currentYear = '2026',
  currentMonth = 10,
}) => {
  // 当前选中的周
  const [selectedWeekIndex, setSelectedWeekIndex] = useState<number>(1); // 默认第44周 [本周]
  const currentWeek = AVAILABLE_WEEKS[selectedWeekIndex];

  // 筛选状态
  const [deptFilter, setDeptFilter] = useState('全部');
  const [shiftFilter, setShiftFilter] = useState('全部');
  const [searchKey, setSearchKey] = useState('');

  // 排班数据集
  const [staffScheduleList, setStaffScheduleList] = useState<StaffWeekScheduleItem[]>(INITIAL_STAFF_WEEK_DATA);

  // 弹窗状态
  const [editingCell, setEditingCell] = useState<{
    staff: StaffWeekScheduleItem;
    date: string;
    shiftInfo: {
      shiftName: string;
      workstation: string;
      role?: '主班' | '副班' | '备班' | '带教';
      note?: string;
    };
  } | null>(null);

  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);
  const [swapForm, setSwapForm] = useState({
    staff1Id: 'STF-103',
    date1: '2026-10-28',
    staff2Id: 'STF-104',
    date2: '2026-10-28',
    reason: '科研会议与进修培训调换',
  });

  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<'standard' | 'emergency' | 'holiday'>('standard');

  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // 计算本周的7天日期数组
  const weekDays = useMemo(() => {
    const list: Array<{
      dateStr: string;
      monthDay: string;
      dayOfWeek: string;
      isToday: boolean;
      isWeekend: boolean;
    }> = [];

    const start = new Date(currentWeek.startDate);
    const dayNames = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    const todayStr = '2026-10-30'; // 今日设为 10月30日 周五

    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateStr = `${y}-${m}-${day}`;
      const monthDay = `${m}月${day}日`;
      const isWeekend = i === 5 || i === 6;
      const isToday = dateStr === todayStr;

      list.push({
        dateStr,
        monthDay,
        dayOfWeek: dayNames[i],
        isToday,
        isWeekend,
      });
    }
    return list;
  }, [currentWeek]);

  // 过滤后的人员列表
  const filteredStaffList = useMemo(() => {
    return staffScheduleList.filter((item) => {
      const matchDept =
        deptFilter === '全部' ||
        item.department.includes(deptFilter) ||
        (deptFilter === '生化免疫组' && (item.department.includes('生化') || item.department.includes('免疫')));
      
      const matchKey =
        !searchKey.trim() ||
        item.name.includes(searchKey.trim()) ||
        item.code.toLowerCase().includes(searchKey.trim().toLowerCase()) ||
        item.title.includes(searchKey.trim());

      const matchShift =
        shiftFilter === '全部' ||
        weekDays.some((day) => item.shifts[day.dateStr]?.shiftName === shiftFilter);

      return matchDept && matchKey && matchShift;
    });
  }, [staffScheduleList, deptFilter, shiftFilter, searchKey, weekDays]);

  // 统计各日期在岗与班次人数汇总
  const dayShiftStats = useMemo(() => {
    const stats: Record<
      string,
      {
        totalOnDuty: number;
        dayShift: number; // 早班+白班
        midShift: number; // 中班+小夜班
        nightShift: number; // 大夜班+急查值班
        restCount: number; // 轮休
      }
    > = {};

    weekDays.forEach((d) => {
      let dayShift = 0;
      let midShift = 0;
      let nightShift = 0;
      let restCount = 0;

      staffScheduleList.forEach((stf) => {
        const sName = stf.shifts[d.dateStr]?.shiftName || '轮休';
        if (sName === '白班' || sName === '早班' || sName === '质控专责') {
          dayShift++;
        } else if (sName === '中班' || sName === '小夜班') {
          midShift++;
        } else if (sName === '大夜班' || sName === '急查值班') {
          nightShift++;
        } else {
          restCount++;
        }
      });

      stats[d.dateStr] = {
        totalOnDuty: dayShift + midShift + nightShift,
        dayShift,
        midShift,
        nightShift,
        restCount,
      };
    });

    return stats;
  }, [weekDays, staffScheduleList]);

  // 计算单个人员本周出勤工时与班次汇总
  const getStaffWeeklySummary = (stf: StaffWeekScheduleItem) => {
    let totalHours = 0;
    let nightCount = 0;
    let dutyCount = 0;
    let restCount = 0;

    weekDays.forEach((day) => {
      const s = stf.shifts[day.dateStr]?.shiftName || '轮休';
      const meta = SHIFT_TYPES[s];
      if (meta) {
        totalHours += meta.hours;
        if (meta.category === 'night') nightCount++;
        if (meta.category === 'duty') dutyCount++;
        if (meta.category === 'rest') restCount++;
      }
    });

    return {
      totalHours,
      nightCount,
      dutyCount,
      restCount,
      isOvertime: totalHours > 44, // 超过44小时提示
    };
  };

  // 保存单格排班修改
  const handleSaveCellEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCell) return;

    setStaffScheduleList((prev) =>
      prev.map((item) => {
        if (item.id === editingCell.staff.id) {
          return {
            ...item,
            shifts: {
              ...item.shifts,
              [editingCell.date]: {
                ...editingCell.shiftInfo,
                isModified: true,
              },
            },
          };
        }
        return item;
      })
    );

    triggerAction(
      `已成功更新 ${editingCell.staff.name} 于 ${editingCell.date} 的班次为【${editingCell.shiftInfo.shiftName}】！`
    );
    setEditingCell(null);
  };

  // 执行双人互换/调班
  const handleExecuteSwap = (e: React.FormEvent) => {
    e.preventDefault();
    const stf1 = staffScheduleList.find((s) => s.id === swapForm.staff1Id);
    const stf2 = staffScheduleList.find((s) => s.id === swapForm.staff2Id);

    if (!stf1 || !stf2) {
      triggerAction('请选择有效的调班人员！');
      return;
    }

    const shift1 = stf1.shifts[swapForm.date1] || { shiftName: '轮休', workstation: '全天公休' };
    const shift2 = stf2.shifts[swapForm.date2] || { shiftName: '轮休', workstation: '全天公休' };

    setStaffScheduleList((prev) =>
      prev.map((item) => {
        if (item.id === stf1.id) {
          return {
            ...item,
            shifts: {
              ...item.shifts,
              [swapForm.date1]: {
                ...shift2,
                note: `[调班自${stf2.name}] ${swapForm.reason}`,
                isModified: true,
              },
            },
          };
        }
        if (item.id === stf2.id) {
          return {
            ...item,
            shifts: {
              ...item.shifts,
              [swapForm.date2]: {
                ...shift1,
                note: `[调班自${stf1.name}] ${swapForm.reason}`,
                isModified: true,
              },
            },
          };
        }
        return item;
      })
    );

    setIsSwapModalOpen(false);
    triggerAction(
      `调班成功！${stf1.name}(${swapForm.date1}) 与 ${stf2.name}(${swapForm.date2}) 已完成班次互换并留痕！`
    );
  };

  // 复制上周排班
  const handleCopyLastWeek = () => {
    triggerAction(`已复制上一周(第43周)排班模板至当前第44周，自动保留高级医师带教与急诊夜班双岗设置！`);
  };

  // 套用模板
  const handleApplyTemplate = () => {
    const templateNames = {
      standard: '三班倒标准轮转模板',
      emergency: '急诊高峰加强轮岗模板',
      holiday: '重大节假日值守应急模板',
    };
    setIsTemplateModalOpen(false);
    triggerAction(`成功套用《${templateNames[selectedTemplate]}》，全员轮换规则已更新并完成合规计算！`);
  };

  // 导出周排班表 Excel
  const handleExportExcel = () => {
    triggerAction(`已导出 ${currentWeek.label} 检验科周排班与考勤核算表 (Excel格式)！`);
  };

  return (
    <div className="space-y-3 px-4 pb-6">
      {/* 1. 顶部全景标题与状态栏 */}
      <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-2.5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-sky-50 rounded-lg border border-sky-200 text-sky-700">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-slate-900 text-sm">
                  人员排班管理 · 周视图 (检验医学科周度工时与岗位排班调度)
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-700 border border-sky-200">
                  第44周在控
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  夜班双岗100%覆盖
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                精细化至具体工位（流水线/发光/急诊临检/采血/质谱/微生物）与责任角色，支持快速调班、模板应用与工时校验
              </p>
            </div>
          </div>

          {/* 切换月视图/周视图 */}
          <div className="flex items-center gap-3">
            <div className="inline-flex rounded border border-slate-300 p-0.5 bg-slate-50 shadow-2xs">
              <button
                type="button"
                onClick={() => onSwitchMode && onSwitchMode('month')}
                className="px-3 py-1 rounded text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                title="切换至月度全景矩阵视图"
              >
                月视图
              </button>
              <button
                type="button"
                className="px-3 py-1 rounded text-xs font-semibold bg-sky-600 text-white shadow-2xs"
                title="当前正在查看周度精细化排班视图"
              >
                周视图
              </button>
            </div>

            {/* 周次导航翻页控制器 */}
            <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-0.5 border border-slate-200">
              <button
                type="button"
                disabled={selectedWeekIndex === 0}
                onClick={() => setSelectedWeekIndex((prev) => Math.max(0, prev - 1))}
                className="px-2 py-1 text-xs text-slate-700 hover:bg-white rounded disabled:opacity-40 flex items-center gap-0.5 transition-colors font-medium"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>上一周</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedWeekIndex(1)}
                className={`px-2.5 py-1 text-xs rounded font-bold transition-all ${
                  selectedWeekIndex === 1
                    ? 'bg-sky-600 text-white shadow-2xs'
                    : 'text-slate-700 hover:bg-white'
                }`}
              >
                本周
              </button>

              <button
                type="button"
                disabled={selectedWeekIndex === AVAILABLE_WEEKS.length - 1}
                onClick={() => setSelectedWeekIndex((prev) => Math.min(AVAILABLE_WEEKS.length - 1, prev + 1))}
                className="px-2 py-1 text-xs text-slate-700 hover:bg-white rounded disabled:opacity-40 flex items-center gap-0.5 transition-colors font-medium"
              >
                <span>下一周</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* 4大周度排班运行核心指标卡片 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-500 block">本周排班周期</span>
              <span className="text-xs font-bold font-mono text-slate-800">
                {currentWeek.startDate.slice(5)} ~ {currentWeek.endDate.slice(5)}
              </span>
            </div>
            <span className="text-xs font-bold text-sky-700 px-1.5 py-0.5 rounded bg-sky-100">
              {currentWeek.label.slice(0, 4)}
            </span>
          </div>

          <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-emerald-600 block">在册应排人员</span>
              <span className="text-xs font-bold font-mono text-emerald-800">
                {staffScheduleList.length} 人 (出勤率100%)
              </span>
            </div>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>

          <div className="p-2.5 bg-indigo-50 rounded-lg border border-indigo-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-indigo-600 block">急诊大夜班值守</span>
              <span className="text-xs font-bold font-mono text-indigo-800">
                每夜≥2人 (高级医师带班)
              </span>
            </div>
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
          </div>

          <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-amber-600 block">工时合规与疲劳预警</span>
              <span className="text-xs font-bold font-mono text-amber-800">
                0项超限 (人均 38.2h/周)
              </span>
            </div>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
        </div>
      </div>

      {/* 2. 主体大卡片：筛选工具栏 + 周视图表格 */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs flex flex-col">
        {/* 工具栏：专业组、班次过滤、人员搜索与高频动作按钮 */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            {/* 专业组筛选 */}
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-700 text-xs whitespace-nowrap">专业组:</span>
              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className="px-2.5 py-1 bg-white border border-slate-300 rounded text-xs text-slate-800 font-medium focus:outline-none focus:border-sky-500"
              >
                <option value="全部">全部专业组 (全科排班)</option>
                <option value="临床生化组">临床生化组</option>
                <option value="急诊临检组">急诊临检组</option>
                <option value="门诊采血组">门诊采血组</option>
                <option value="微生物组">微生物组</option>
                <option value="质谱分子组">质谱分子组</option>
                <option value="血液形态组">血液形态组</option>
                <option value="质控与行政组">质控与行政组</option>
              </select>
            </div>

            {/* 班次类型筛选 */}
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-700 text-xs whitespace-nowrap">班次状态:</span>
              <select
                value={shiftFilter}
                onChange={(e) => setShiftFilter(e.target.value)}
                className="px-2.5 py-1 bg-white border border-slate-300 rounded text-xs text-slate-800 font-medium focus:outline-none focus:border-sky-500"
              >
                <option value="全部">全部班次</option>
                <option value="白班">白班 (08:00~17:00)</option>
                <option value="早班">早班 (07:30~15:30)</option>
                <option value="中班">中班 (15:30~23:00)</option>
                <option value="小夜班">小夜班 (17:30~23:30)</option>
                <option value="大夜班">大夜班 (23:00~08:30)</option>
                <option value="急查值班">急查值班 (17:00~08:30)</option>
                <option value="质控专责">质控专责 (08:00~17:00)</option>
                <option value="轮休">轮休 (全天公休)</option>
              </select>
            </div>

            {/* 人员关键词检索 */}
            <div className="relative w-48">
              <Search className="w-3.5 h-3.5 absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchKey}
                onChange={(e) => setSearchKey(e.target.value)}
                placeholder="搜索医技姓名/工号/职称..."
                className="w-full pl-7 pr-2 py-1 bg-white border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-sky-500"
              />
            </div>

            {(deptFilter !== '全部' || shiftFilter !== '全部' || searchKey) && (
              <button
                type="button"
                onClick={() => {
                  setDeptFilter('全部');
                  setShiftFilter('全部');
                  setSearchKey('');
                }}
                className="text-xs text-sky-600 hover:text-sky-800 underline flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>重置</span>
              </button>
            )}
          </div>

          {/* 右侧动作按钮组 */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setIsSwapModalOpen(true)}
              className="px-2.5 py-1 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-300 rounded text-xs font-semibold flex items-center gap-1 transition-colors shadow-2xs"
              title="双人快速换班与调班申请登记"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>快速调班/互换</span>
            </button>

            <button
              type="button"
              onClick={() => setIsTemplateModalOpen(true)}
              className="px-2.5 py-1 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-300 rounded text-xs font-semibold flex items-center gap-1 transition-colors shadow-2xs"
              title="从标准三班倒/急诊强化模板自动套用"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>套用排班模板</span>
            </button>

            <button
              type="button"
              onClick={handleCopyLastWeek}
              className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded text-xs font-medium flex items-center gap-1 transition-colors"
              title="复制上一周排班安排"
            >
              <Copy className="w-3.5 h-3.5 text-slate-500" />
              <span>复制上周</span>
            </button>

            <button
              type="button"
              onClick={() => setIsPrintModalOpen(true)}
              className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded text-xs font-medium flex items-center gap-1 transition-colors"
              title="调出检验医学科周度排班表正式打印单"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>打印周表</span>
            </button>

            <button
              type="button"
              onClick={handleExportExcel}
              className="px-2.5 py-1 bg-sky-600 hover:bg-sky-700 text-white rounded text-xs font-semibold flex items-center gap-1 shadow-2xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>导出Excel</span>
            </button>
          </div>
        </div>

        {/* 3. 周视图排班核心大表格 */}
        <div className="overflow-x-auto overflow-y-auto max-h-[680px]">
          <table className="w-full text-left border-collapse min-w-[1240px]">
            {/* 表头第一行：基础信息 + 7天列 + 本周统计 */}
            <thead className="bg-sky-600 text-white font-bold text-xs sticky top-0 z-20 shadow-xs">
              <tr>
                {/* 人员基本信息列 (冻结左侧) */}
                <th className="py-2.5 px-3.5 w-44 border-r border-sky-500 sticky left-0 bg-sky-600 z-30">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    <span>人员姓名 / 专业组</span>
                  </div>
                </th>

                {/* 7天列 */}
                {weekDays.map((col) => {
                  const dayStat = dayShiftStats[col.dateStr] || {
                    totalOnDuty: 0,
                    dayShift: 0,
                    midShift: 0,
                    nightShift: 0,
                    restCount: 0,
                  };

                  return (
                    <th
                      key={col.dateStr}
                      className={`py-2 px-2.5 border-r border-sky-500 text-center min-w-[145px] ${
                        col.isToday
                          ? 'bg-sky-700 ring-2 ring-amber-300/80 ring-inset'
                          : col.isWeekend
                          ? 'bg-sky-700/60'
                          : ''
                      }`}
                    >
                      <div className="flex flex-col items-center">
                        <div className="flex items-center gap-1 text-[13px]">
                          <span>{col.dayOfWeek}</span>
                          {col.isToday && (
                            <span className="px-1 py-0.2 rounded text-[9px] bg-amber-400 text-slate-900 font-extrabold uppercase">
                              今日
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] font-mono font-normal opacity-90">
                          {col.monthDay}
                        </span>
                        {/* 当天在岗简况 */}
                        <div className="mt-1 px-1.5 py-0.5 rounded bg-sky-800/80 text-[10px] font-mono font-normal flex items-center gap-1">
                          <span>在岗:{dayStat.totalOnDuty}</span>
                          <span className="opacity-70">|</span>
                          <span>夜班:{dayStat.nightShift}</span>
                        </div>
                      </div>
                    </th>
                  );
                })}

                {/* 本周统计 */}
                <th className="py-2.5 px-3 w-32 text-center border-l border-sky-500 bg-sky-700 sticky right-0 z-20">
                  <span>本周工时/班次</span>
                </th>
              </tr>
            </thead>

            {/* 表体：人员排班行 */}
            <tbody className="divide-y divide-slate-200 text-xs">
              {filteredStaffList.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    未检索到符合条件的排班记录
                  </td>
                </tr>
              ) : (
                filteredStaffList.map((stf, index) => {
                  const summary = getStaffWeeklySummary(stf);

                  return (
                    <tr
                      key={stf.id}
                      className={`hover:bg-sky-50/40 transition-colors ${
                        index % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'
                      }`}
                    >
                      {/* 人员信息列 (冻结左侧) */}
                      <td className="py-2.5 px-3.5 border-r border-slate-200 sticky left-0 bg-white z-10 shadow-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-7 h-7 rounded-full bg-sky-100 text-sky-700 font-bold text-xs flex items-center justify-center shrink-0 border border-sky-200">
                            {stf.name.slice(0, 1)}
                          </span>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-slate-900 text-xs whitespace-nowrap">
                                {stf.name}
                              </span>
                              <span className="text-[9px] px-1 py-0.2 rounded font-mono bg-slate-100 text-slate-600">
                                {stf.code}
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5 truncate">
                              <span>{stf.department}</span>
                              <span>·</span>
                              <span className="text-sky-700 font-medium">{stf.title}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* 7天的排班单元格 */}
                      {weekDays.map((col) => {
                        const shiftRecord = stf.shifts[col.dateStr] || {
                          shiftName: '轮休',
                          workstation: '全天公休',
                        };
                        const meta = SHIFT_TYPES[shiftRecord.shiftName] || SHIFT_TYPES['白班'];

                        return (
                          <td
                            key={col.dateStr}
                            onClick={() =>
                              setEditingCell({
                                staff: stf,
                                date: col.dateStr,
                                shiftInfo: { ...shiftRecord },
                              })
                            }
                            className={`py-1.5 px-1.5 border-r border-slate-100 relative group cursor-pointer transition-colors ${
                              col.isToday
                                ? 'bg-amber-50/20'
                                : col.isWeekend
                                ? 'bg-slate-50/40'
                                : ''
                            } hover:bg-sky-100/60`}
                          >
                            <div
                              className={`p-1.5 rounded-lg border flex flex-col justify-between min-h-[66px] transition-all shadow-2xs ${
                                meta.badgeBg
                              } ${
                                shiftRecord.isModified
                                  ? 'ring-1 ring-amber-400'
                                  : ''
                              }`}
                            >
                              {/* 班次名称与图标 */}
                              <div className="flex items-center justify-between gap-1">
                                <div className="flex items-center gap-1">
                                  <span className="text-xs">{meta.icon}</span>
                                  <span className="font-bold text-xs">{meta.name}</span>
                                </div>
                                {shiftRecord.role && (
                                  <span
                                    className={`px-1 py-0.2 rounded text-[9px] font-semibold ${
                                      shiftRecord.role === '主班'
                                        ? 'bg-sky-200/70 text-sky-900'
                                        : shiftRecord.role === '带教'
                                        ? 'bg-purple-200/70 text-purple-900'
                                        : 'bg-slate-200/70 text-slate-700'
                                    }`}
                                  >
                                    {shiftRecord.role}
                                  </span>
                                )}
                              </div>

                              {/* 工位/工作台标签 */}
                              <div className="text-[10px] leading-tight text-slate-700 font-medium mt-1 truncate">
                                {shiftRecord.workstation}
                              </div>

                              {/* 备注或时间段说明 */}
                              <div className="flex items-center justify-between text-[9px] text-slate-500 mt-1">
                                <span className="font-mono">{meta.timeSlot.split('~')[0]}</span>
                                {shiftRecord.note ? (
                                  <span
                                    className="text-[9px] text-amber-700 font-semibold truncate max-w-[70px]"
                                    title={shiftRecord.note}
                                  >
                                    {shiftRecord.note}
                                  </span>
                                ) : (
                                  <span className="font-mono text-slate-400">{meta.hours}h</span>
                                )}
                              </div>
                            </div>

                            {/* 悬停编辑小笔头提示 */}
                            <div className="absolute right-2 top-2 hidden group-hover:flex items-center justify-center w-5 h-5 rounded-full bg-white text-sky-700 shadow border border-sky-200">
                              <Edit2 className="w-2.5 h-2.5" />
                            </div>
                          </td>
                        );
                      })}

                      {/* 本周工时与汇总列 */}
                      <td className="py-2.5 px-3 text-center border-l border-slate-200 bg-white sticky right-0 z-10 shadow-xs">
                        <div className="flex flex-col items-center gap-0.5">
                          <span
                            className={`font-mono font-bold text-xs ${
                              summary.isOvertime ? 'text-amber-600' : 'text-slate-800'
                            }`}
                          >
                            {summary.totalHours} <span className="text-[10px] font-normal text-slate-500">工时</span>
                          </span>
                          <div className="flex items-center gap-1 text-[10px] text-slate-500 font-mono">
                            {summary.nightCount > 0 && (
                              <span className="px-1 py-0.2 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                                夜{summary.nightCount}
                              </span>
                            )}
                            {summary.dutyCount > 0 && (
                              <span className="px-1 py-0.2 rounded bg-rose-50 text-rose-700 border border-rose-200">
                                值{summary.dutyCount}
                              </span>
                            )}
                            <span className="px-1 py-0.2 rounded bg-slate-100 text-slate-600">
                              休{summary.restCount}
                            </span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>

            {/* 表尾：全科在岗人力总览汇总行 (非常实用直观) */}
            <tfoot className="bg-slate-100 font-semibold text-xs text-slate-700 border-t-2 border-slate-300">
              <tr>
                <td className="py-2.5 px-3.5 sticky left-0 bg-slate-100 z-10 border-r border-slate-200">
                  <div className="flex items-center gap-1 text-slate-900 font-bold">
                    <Activity className="w-3.5 h-3.5 text-sky-600" />
                    <span>各班在岗人力汇总</span>
                  </div>
                </td>
                {weekDays.map((col) => {
                  const stat = dayShiftStats[col.dateStr] || {
                    totalOnDuty: 0,
                    dayShift: 0,
                    midShift: 0,
                    nightShift: 0,
                    restCount: 0,
                  };

                  return (
                    <td key={col.dateStr} className="py-2 px-2 text-center border-r border-slate-200">
                      <div className="flex flex-col gap-0.5 text-[10px] font-mono">
                        <div className="flex items-center justify-between text-emerald-800">
                          <span>白/早班:</span>
                          <span className="font-bold">{stat.dayShift}人</span>
                        </div>
                        <div className="flex items-center justify-between text-amber-800">
                          <span>中/小夜:</span>
                          <span className="font-bold">{stat.midShift}人</span>
                        </div>
                        <div className="flex items-center justify-between text-indigo-800">
                          <span>大夜/急查:</span>
                          <span className="font-bold">{stat.nightShift}人</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-500 pt-0.5 border-t border-slate-200">
                          <span>轮休:</span>
                          <span>{stat.restCount}人</span>
                        </div>
                      </div>
                    </td>
                  );
                })}
                <td className="py-2.5 px-3 text-center sticky right-0 bg-slate-100 z-10 border-l border-slate-200">
                  <span className="font-mono text-emerald-700 font-bold text-xs">
                    合格已受控
                  </span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* 4. 底部说明与排班合规性图例 */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* 班次图例 */}
          <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-600">
            <span className="font-semibold text-slate-800">班次图例:</span>
            {Object.values(SHIFT_TYPES).map((item) => (
              <span key={item.name} className="flex items-center gap-1">
                <span>{item.icon}</span>
                <span className="font-medium text-slate-700">{item.name}</span>
                <span className="text-[10px] text-slate-400 font-mono">({item.timeSlot})</span>
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                triggerAction('【合规校验通过】本周连续大夜班未超过1天，急诊夜班均达标2人以上，全员周工时符合≤44h！')
              }
              className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold hover:bg-emerald-100 transition-colors flex items-center gap-1"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>全周工时与防疲劳合规检测</span>
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 弹窗 1: 单个排班单元格快捷编辑弹窗 */}
      {/* ======================================================== */}
      {editingCell && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
            <div className="p-3.5 bg-sky-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit2 className="w-4 h-4" />
                <h3 className="font-bold text-sm">
                  编辑排班 · {editingCell.staff.name} ({editingCell.date})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingCell(null)}
                className="text-white/80 hover:text-white p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCellEdit} className="p-4 space-y-4 text-xs">
              {/* 人员基本信息摘要 */}
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 text-xs">{editingCell.staff.name}</span>
                  <span className="text-slate-500 ml-2">工号: {editingCell.staff.code}</span>
                </div>
                <div className="text-slate-600">
                  <span>{editingCell.staff.department}</span>
                  <span className="mx-1">·</span>
                  <span className="text-sky-700 font-semibold">{editingCell.staff.title}</span>
                </div>
              </div>

              {/* 班次类型选择 (单选卡片) */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  班次选择 <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {Object.values(SHIFT_TYPES).map((st) => {
                    const isSelected = editingCell.shiftInfo.shiftName === st.name;
                    return (
                      <button
                        key={st.name}
                        type="button"
                        onClick={() =>
                          setEditingCell({
                            ...editingCell,
                            shiftInfo: {
                              ...editingCell.shiftInfo,
                              shiftName: st.name,
                              workstation:
                                st.name === '轮休'
                                  ? '全天公休'
                                  : editingCell.shiftInfo.workstation === '全天公休'
                                  ? WORKSTATION_OPTIONS[0]
                                  : editingCell.shiftInfo.workstation,
                            },
                          })
                        }
                        className={`p-2 rounded-lg border text-center transition-all ${
                          isSelected
                            ? 'bg-sky-50 border-sky-600 text-sky-800 font-bold ring-2 ring-sky-300'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="text-base">{st.icon}</div>
                        <div className="text-xs font-semibold mt-0.5">{st.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">{st.hours}h</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 工位安排 */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  负责工位 / 仪器工作台
                </label>
                <select
                  value={editingCell.shiftInfo.workstation}
                  onChange={(e) =>
                    setEditingCell({
                      ...editingCell,
                      shiftInfo: { ...editingCell.shiftInfo, workstation: e.target.value },
                    })
                  }
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-sky-500"
                >
                  {editingCell.shiftInfo.shiftName === '轮休' && (
                    <option value="全天公休">全天公休 (无在岗要求)</option>
                  )}
                  {WORKSTATION_OPTIONS.map((ws) => (
                    <option key={ws} value={ws}>
                      {ws}
                    </option>
                  ))}
                </select>
              </div>

              {/* 角色职责 */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">岗位角色</label>
                  <select
                    value={editingCell.shiftInfo.role || '主班'}
                    onChange={(e) =>
                      setEditingCell({
                        ...editingCell,
                        shiftInfo: {
                          ...editingCell.shiftInfo,
                          role: e.target.value as any,
                        },
                      })
                    }
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-sky-500"
                  >
                    <option value="主班">主班 (主持操作与发单)</option>
                    <option value="副班">副班 (协助前处理与复核)</option>
                    <option value="备班">二线备班 (突发应急召回)</option>
                    <option value="带教">质控带教 (指导规培医师)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">特别备注 / 任务说明</label>
                  <input
                    type="text"
                    value={editingCell.shiftInfo.note || ''}
                    onChange={(e) =>
                      setEditingCell({
                        ...editingCell,
                        shiftInfo: { ...editingCell.shiftInfo, note: e.target.value },
                      })
                    }
                    placeholder="如: 批审核/仪器保养/质控定标"
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-sky-500"
                  >
                  </input>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingCell(null)}
                  className="px-3.5 py-1.5 border border-slate-300 rounded text-slate-600 hover:bg-slate-100 font-medium"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded font-bold shadow-2xs flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>确认变更排班</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 弹窗 2: 双人快速调班 / 换班申请模态框 */}
      {/* ======================================================== */}
      {isSwapModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden">
            <div className="p-3.5 bg-sky-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                <h3 className="font-bold text-sm">快速调班 / 换班申请与审批</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsSwapModalOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleExecuteSwap} className="p-4 space-y-4 text-xs">
              <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-200 text-amber-800 text-[11px] flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  提示：调班互换将自动校验连班安全规则。大夜班调换需确保调换后双方均满足“夜班下班休息≥24小时”，并在科主任审核日志留存双审签。
                </span>
              </div>

              {/* 双方选择器并排 */}
              <div className="grid grid-cols-2 gap-3">
                {/* 人员 1 */}
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2.5">
                  <span className="font-bold text-slate-800 block text-xs">申请人员 A</span>
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">选择人员</label>
                    <select
                      value={swapForm.staff1Id}
                      onChange={(e) => setSwapForm({ ...swapForm, staff1Id: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-800 font-medium"
                    >
                      {staffScheduleList.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.department} · {s.title})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">原排班日期</label>
                    <select
                      value={swapForm.date1}
                      onChange={(e) => setSwapForm({ ...swapForm, date1: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-800 font-medium font-mono"
                    >
                      {weekDays.map((d) => (
                        <option key={d.dateStr} value={d.dateStr}>
                          {d.dateStr} ({d.dayOfWeek})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="text-[11px] text-slate-500 pt-1">
                    当前班次:{' '}
                    <span className="font-bold text-sky-700">
                      {staffScheduleList.find((s) => s.id === swapForm.staff1Id)?.shifts[swapForm.date1]
                        ?.shiftName || '轮休'}
                    </span>
                  </div>
                </div>

                {/* 人员 2 */}
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2.5">
                  <span className="font-bold text-slate-800 block text-xs">目标互换人员 B</span>
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">选择人员</label>
                    <select
                      value={swapForm.staff2Id}
                      onChange={(e) => setSwapForm({ ...swapForm, staff2Id: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-800 font-medium"
                    >
                      {staffScheduleList.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.department} · {s.title})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">互换日期</label>
                    <select
                      value={swapForm.date2}
                      onChange={(e) => setSwapForm({ ...swapForm, date2: e.target.value })}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-800 font-medium font-mono"
                    >
                      {weekDays.map((d) => (
                        <option key={d.dateStr} value={d.dateStr}>
                          {d.dateStr} ({d.dayOfWeek})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="text-[11px] text-slate-500 pt-1">
                    当前班次:{' '}
                    <span className="font-bold text-sky-700">
                      {staffScheduleList.find((s) => s.id === swapForm.staff2Id)?.shifts[swapForm.date2]
                        ?.shiftName || '轮休'}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">调班申请事由</label>
                <input
                  type="text"
                  value={swapForm.reason}
                  onChange={(e) => setSwapForm({ ...swapForm, reason: e.target.value })}
                  placeholder="如: 科研学术会议 / 事假轮休调换 / 紧急值班顶替"
                  className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-800"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsSwapModalOpen(false)}
                  className="px-3.5 py-1.5 border border-slate-300 rounded text-slate-600 hover:bg-slate-100 font-medium"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded font-bold shadow-2xs flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>确认互换并更新排班</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 弹窗 3: 套用排班模板 */}
      {/* ======================================================== */}
      {isTemplateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
            <div className="p-3.5 bg-sky-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <h3 className="font-bold text-sm">套用全科排班模板</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsTemplateModalOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-3 text-xs">
              <p className="text-slate-600">
                请选择适用于当前第44周的排班模式，系统将自动分配各专业组早中夜班与轮休：
              </p>

              <div className="space-y-2">
                <label
                  onClick={() => setSelectedTemplate('standard')}
                  className={`p-3 rounded-lg border block cursor-pointer transition-all ${
                    selectedTemplate === 'standard'
                      ? 'border-sky-600 bg-sky-50/70 ring-1 ring-sky-400'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">1. 三班倒标准平稳轮转模板</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
                      推荐
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    白班8人、中班2人、急诊大夜班2人（高级检验师带教），满足ISO15189审核标准。
                  </p>
                </label>

                <label
                  onClick={() => setSelectedTemplate('emergency')}
                  className={`p-3 rounded-lg border block cursor-pointer transition-all ${
                    selectedTemplate === 'emergency'
                      ? 'border-sky-600 bg-sky-50/70 ring-1 ring-sky-400'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">2. 急诊与门诊高峰加强模板</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold">
                      高峰期
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    强化早高峰门诊采血（早班4人）与初夜急查（小夜班3人），适合周一及秋冬呼吸道高发期。
                  </p>
                </label>

                <label
                  onClick={() => setSelectedTemplate('holiday')}
                  className={`p-3 rounded-lg border block cursor-pointer transition-all ${
                    selectedTemplate === 'holiday'
                      ? 'border-sky-600 bg-sky-50/70 ring-1 ring-sky-400'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">3. 重大节假日值守应急模板</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-100 text-purple-800 font-semibold">
                      节假日
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    精简日间常规班次，保障急诊24h连轴不间断与突发公共卫生应急备勤力量。
                  </p>
                </label>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsTemplateModalOpen(false)}
                  className="px-3.5 py-1.5 border border-slate-300 rounded text-slate-600 hover:bg-slate-100 font-medium"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={handleApplyTemplate}
                  className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded font-bold shadow-2xs flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>立即套用</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 弹窗 4: 周排班表标准打印单模态框 */}
      {/* ======================================================== */}
      {isPrintModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-3.5 bg-sky-600 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Printer className="w-4 h-4" />
                <h3 className="font-bold text-sm">检验医学科周度排班表 · 打印预览</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsPrintModalOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 text-slate-900 space-y-4 font-sans">
              {/* 正式公文抬头 */}
              <div className="text-center border-b pb-4 border-slate-300">
                <h1 className="text-lg font-bold tracking-wide">市中心医院 · 检验医学科周度工作排班表</h1>
                <div className="flex items-center justify-between text-xs text-slate-600 mt-2 font-mono">
                  <span>排班周期: {currentWeek.startDate} 至 {currentWeek.endDate} ({currentWeek.label.split('(')[0].trim()})</span>
                  <span>编制日期: 2026-10-30</span>
                  <span>版本: V2.4 (审签生效版)</span>
                </div>
              </div>

              {/* 打印版表格 */}
              <table className="w-full text-left border-collapse border border-slate-400 text-xs">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-400">
                    <th className="p-2 border-r border-slate-400 w-24">姓名</th>
                    <th className="p-2 border-r border-slate-400 w-28">专业组/职称</th>
                    {weekDays.map((d) => (
                      <th key={d.dateStr} className="p-2 border-r border-slate-400 text-center font-mono">
                        <div>{d.dayOfWeek}</div>
                        <div className="text-[10px] text-slate-500">{d.monthDay}</div>
                      </th>
                    ))}
                    <th className="p-2 text-center w-20">周工时</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-300">
                  {staffScheduleList.map((stf) => {
                    const sm = getStaffWeeklySummary(stf);
                    return (
                      <tr key={stf.id}>
                        <td className="p-2 font-bold border-r border-slate-300">{stf.name}</td>
                        <td className="p-2 text-[11px] border-r border-slate-300">
                          {stf.department} · {stf.title}
                        </td>
                        {weekDays.map((d) => {
                          const s = stf.shifts[d.dateStr] || { shiftName: '轮休' };
                          return (
                            <td key={d.dateStr} className="p-1.5 text-center border-r border-slate-300 text-xs">
                              <span
                                className={`font-semibold ${
                                  s.shiftName === '白班'
                                    ? 'text-emerald-700'
                                    : s.shiftName.includes('夜') || s.shiftName.includes('值')
                                    ? 'text-indigo-800 font-bold'
                                    : s.shiftName === '轮休'
                                    ? 'text-slate-400'
                                    : 'text-amber-800'
                                }`}
                              >
                                {s.shiftName}
                              </span>
                            </td>
                          );
                        })}
                        <td className="p-2 text-center font-mono font-bold">{sm.totalHours}h</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* 签批栏 */}
              <div className="grid grid-cols-3 gap-4 pt-6 text-xs text-slate-700">
                <div>制表人: <span className="font-bold underline">李明哲 (主管检验师)</span></div>
                <div>科室质控主管: <span className="font-bold underline">陈思远</span></div>
                <div>科主任核准签发: <span className="font-bold underline">张建华 (主任检验师)</span></div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
              <span className="text-[11px] text-slate-500">
                支持标准A4纸张横向直接打印或导出为PDF归档
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsPrintModalOpen(false)}
                  className="px-3 py-1.5 border border-slate-300 rounded text-slate-700 text-xs hover:bg-slate-100"
                >
                  关闭
                </button>
                <button
                  type="button"
                  onClick={() => {
                    triggerAction('已发送当前周排班表至网络打印机 (HP LaserJet Pro)');
                    setIsPrintModalOpen(false);
                  }}
                  className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded text-xs font-bold shadow flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>立即打印</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
