import React, { useState, useMemo, useEffect } from 'react';
import { UserProfile } from '../types/navigation';
import {
  OVERDUE_REPORTS_DATA,
  REJECTED_SPECIMENS_DATA,
  INITIAL_HOME_KPIS,
  OverdueReport,
  RejectedSpecimen,
} from '../data/homeData';
import {
  CalendarCheck,
  Layers,
  FileCheck,
  Mail,
  Search,
  Filter,
  RefreshCw,
  AlertTriangle,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Building2,
  X,
  FileDown,
  Send,
  PhoneCall,
  Activity,
  Eye
} from './MenuIcon';

interface HomeDashboardProps {
  user: UserProfile;
  triggerAction: (msg: string) => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({ user, triggerAction }) => {
  // Search, filter & sorting states (Default: 'desc' 降序，最新优先)
  const [overdueSearch, setOverdueSearch] = useState('');
  const [overdueDeptFilter, setOverdueDeptFilter] = useState('all');
  const [overdueSortOrder, setOverdueSortOrder] = useState<'desc' | 'asc'>('desc');

  const [rejectedSearch, setRejectedSearch] = useState('');
  const [rejectedSpecimenFilter, setRejectedSpecimenFilter] = useState('all');
  const [rejectedSortOrder, setRejectedSortOrder] = useState<'desc' | 'asc'>('desc');

  // Inspection modal state
  const [selectedOverdue, setSelectedOverdue] = useState<OverdueReport | null>(null);
  const [selectedRejected, setSelectedRejected] = useState<RejectedSpecimen | null>(null);

  // Copy state
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Formatter for current real-time clock
  const getFormattedNow = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const date = now.getDate();
    const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    const weekday = weekdays[now.getDay()];
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${year}年${month}月${date}日 ${weekday} ${hours}:${minutes}:${seconds}`;
  };

  const [currentTimeStr, setCurrentTimeStr] = useState(getFormattedNow());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTimeStr(getFormattedNow());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    triggerAction(`已复制条码: ${text}`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Filter & Sort Overdue Reports (Strictly sorted descending by receiveTime by default)
  const filteredOverdue = useMemo(() => {
    const list = OVERDUE_REPORTS_DATA.filter((item) => {
      const matchSearch =
        overdueSearch === '' ||
        item.name.includes(overdueSearch) ||
        item.barcode.includes(overdueSearch) ||
        item.patientId.toLowerCase().includes(overdueSearch.toLowerCase()) ||
        item.testItem.includes(overdueSearch) ||
        item.department.includes(overdueSearch);

      const matchDept = overdueDeptFilter === 'all' || item.department === overdueDeptFilter;
      return matchSearch && matchDept;
    });

    return [...list].sort((a, b) => {
      const timeA = new Date(a.receiveTime).getTime();
      const timeB = new Date(b.receiveTime).getTime();
      return overdueSortOrder === 'desc' ? timeB - timeA : timeA - timeB;
    });
  }, [overdueSearch, overdueDeptFilter, overdueSortOrder]);

  // Filter & Sort Rejected Specimens (Strictly sorted descending by rejectTime by default)
  const filteredRejected = useMemo(() => {
    const list = REJECTED_SPECIMENS_DATA.filter((item) => {
      const matchSearch =
        rejectedSearch === '' ||
        item.name.includes(rejectedSearch) ||
        item.barcode.includes(rejectedSearch) ||
        item.patientId.toLowerCase().includes(rejectedSearch.toLowerCase()) ||
        item.testItem.includes(rejectedSearch) ||
        item.department.includes(rejectedSearch) ||
        item.rejectReason.includes(rejectedSearch);

      const matchSpecimen =
        rejectedSpecimenFilter === 'all' || item.specimen === rejectedSpecimenFilter;
      return matchSearch && matchSpecimen;
    });

    return [...list].sort((a, b) => {
      const timeA = new Date(a.rejectTime).getTime();
      const timeB = new Date(b.rejectTime).getTime();
      return rejectedSortOrder === 'desc' ? timeB - timeA : timeA - timeB;
    });
  }, [rejectedSearch, rejectedSpecimenFilter, rejectedSortOrder]);

  // Specimen badge color mapper
  const getSpecimenBadge = (type: string) => {
    switch (type) {
      case '血液':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case '痰液':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case '尿液':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case '脑脊液':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case '粪便':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Info Bar: Doctor Profile & Real-time Clock */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="relative shrink-0">
            <img
              src={user.avatarUrl}
              alt={user.name}
              referrerPolicy="no-referrer"
              className="w-11 h-11 rounded-full object-cover ring-2 ring-sky-100"
            />
            <div className="w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white absolute bottom-0 right-0" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-base">{user.name}</span>
              <span className="text-slate-300">|</span>
              <span className="text-sm font-medium text-slate-700">{user.department}</span>
              <span className="text-slate-300">|</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200 font-medium">
                {user.subGroup || '微生物组'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <span>{user.hospital} · 检验医学质量管控中心</span>
              <span>·</span>
              <span className="text-emerald-600 font-medium">值班状态：在岗</span>
            </div>
          </div>
        </div>

        {/* Date, Time & Header Action Shortcuts */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 shrink-0">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700">
            <Clock className="w-4 h-4 text-sky-600" />
            <span className="font-semibold tabular-nums">{currentTimeStr}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => triggerAction('已完成与LIS流水线实时数据同步')}
              className="px-3 py-1.5 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
              title="刷新当前科室实时标本数据"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>刷新</span>
            </button>
            <button
              onClick={() => triggerAction('已导出今日超时报告与拒收标本综合交接单(Excel)')}
              className="px-3 py-1.5 text-xs font-medium bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>导出交接表</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. 4 Modernized KPI Cards (Refined aesthetics replacing flat solid color blocks) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: 今日核收标本 */}
        <div className="bg-white rounded-xl border border-slate-200 p-4.5 shadow-xs hover:border-sky-300 transition-all group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-sky-50 rounded-bl-full -mr-6 -mt-6 transition-all group-hover:scale-110 pointer-events-none" />
          <div className="flex items-center justify-between relative z-10">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              今日核收标本
            </span>
            <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center">
              <CalendarCheck className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2 relative z-10">
            <span className="text-3xl font-extrabold font-mono tabular-nums text-slate-900 tracking-tight">
              {INITIAL_HOME_KPIS.todayReceived}
            </span>
            <span className="text-xs text-slate-500 font-medium">管已签收入库</span>
          </div>
          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 relative z-10">
            <span>正常签收率 94.6%</span>
            <span className="text-emerald-600 font-medium flex items-center gap-0.5">
              较昨日 +14
            </span>
          </div>
        </div>

        {/* Card 2: 在检标本 */}
        <div className="bg-white rounded-xl border border-slate-200 p-4.5 shadow-xs hover:border-blue-300 transition-all group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-6 -mt-6 transition-all group-hover:scale-110 pointer-events-none" />
          <div className="flex items-center justify-between relative z-10">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              在检标本
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <Layers className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2 relative z-10">
            <span className="text-3xl font-extrabold font-mono tabular-nums text-blue-900 tracking-tight">
              {INITIAL_HOME_KPIS.testingInProgress}
            </span>
            <span className="text-xs text-slate-500 font-medium">管流水线分析中</span>
          </div>
          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 relative z-10">
            <span>A/B线运行负荷 68%</span>
            <span className="text-sky-600 font-medium">轨道畅通</span>
          </div>
        </div>

        {/* Card 3: 待审报告 */}
        <div className="bg-white rounded-xl border border-slate-200 p-4.5 shadow-xs hover:border-purple-300 transition-all group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-bl-full -mr-6 -mt-6 transition-all group-hover:scale-110 pointer-events-none" />
          <div className="flex items-center justify-between relative z-10">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              待审报告
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
              <FileCheck className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2 relative z-10">
            <span className="text-3xl font-extrabold font-mono tabular-nums text-purple-900 tracking-tight">
              {INITIAL_HOME_KPIS.pendingReports}
            </span>
            <span className="text-xs text-slate-500 font-medium">份需主管双签</span>
          </div>
          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 relative z-10">
            <span>急查 3 份 · 常规 8 份</span>
            <button
              onClick={() => triggerAction('已打开待审报告双签通道')}
              className="text-purple-600 hover:text-purple-800 font-medium"
            >
              立即审签 &rarr;
            </button>
          </div>
        </div>

        {/* Card 4: 待处理消息 */}
        <div className="bg-white rounded-xl border border-slate-200 p-4.5 shadow-xs hover:border-indigo-300 transition-all group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-bl-full -mr-6 -mt-6 transition-all group-hover:scale-110 pointer-events-none" />
          <div className="flex items-center justify-between relative z-10">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              待处理消息
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Mail className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="mt-2.5 flex items-baseline gap-2 relative z-10">
            <span className="text-3xl font-extrabold font-mono tabular-nums text-indigo-900 tracking-tight">
              {INITIAL_HOME_KPIS.pendingMessages}
            </span>
            <span className="text-xs text-slate-500 font-medium">条未处理提醒</span>
          </div>
          <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 relative z-10">
            <span className="text-rose-600 font-medium">含 3 条危急值警报</span>
            <button
              onClick={() => triggerAction('已跳转至消息与危急值通报面板')}
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              处理 &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* 3. The 2 Main Tables: Split 50/50 responsive grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Table 1: 超时未发报告 (Overdue Reports) */}
        <div className="bg-white rounded-xl border border-slate-200/90 overflow-hidden shadow-xs flex flex-col">
          {/* Card Header & Controls */}
          <div className="p-4 border-b border-slate-200/80 bg-slate-50/60">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                <h2 className="font-bold text-slate-900 text-sm tracking-tight">
                  超时未发报告
                </h2>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 font-mono">
                  {filteredOverdue.length} 份
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const next = overdueSortOrder === 'desc' ? 'asc' : 'desc';
                    setOverdueSortOrder(next);
                    triggerAction(`已切换为核收时间${next === 'desc' ? '降序 (最新优先)' : '升序'}`);
                  }}
                  className="px-2.5 py-1 text-xs font-medium bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1 shadow-2xs"
                  title="点击切换时间排序"
                >
                  <Clock className="w-3 h-3 text-sky-600" />
                  <span>{overdueSortOrder === 'desc' ? '降序 (最新优先) ↓' : '升序 (旧到新) ↑'}</span>
                </button>
                <button
                  onClick={() => triggerAction('已向对应临床科室发起超时检测加急催办广播')}
                  className="px-2.5 py-1 text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors flex items-center gap-1"
                >
                  <Send className="w-3 h-3" />
                  <span>一键催办</span>
                </button>
              </div>
            </div>

            {/* Filter toolbar */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <div className="relative flex-1 min-w-[140px]">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={overdueSearch}
                  onChange={(e) => setOverdueSearch(e.target.value)}
                  placeholder="搜索条码/姓名/项目/科室..."
                  className="w-full text-xs pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-md outline-none focus:border-sky-500"
                />
              </div>

              {/* Department filter */}
              <div className="flex items-center gap-1 overflow-x-auto text-[11px]">
                {['all', '呼吸内科', '心内科', '肾内科', '急诊科', '消化内科'].map((d) => (
                  <button
                    key={d}
                    onClick={() => setOverdueDeptFilter(d)}
                    className={`px-2 py-1 rounded-md whitespace-nowrap transition-colors ${
                      overdueDeptFilter === d
                        ? 'bg-slate-800 text-white font-medium'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {d === 'all' ? '全部科室' : d}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Table Content */}
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/70 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-3.5 py-2.5 whitespace-nowrap">采集条码</th>
                  <th className="px-3 py-2.5 whitespace-nowrap">患者标识</th>
                  <th className="px-3 py-2.5 whitespace-nowrap">姓名</th>
                  <th className="px-2.5 py-2.5 whitespace-nowrap">标本</th>
                  <th className="px-3.5 py-2.5">检验项目</th>
                  <th className="px-3 py-2.5 whitespace-nowrap">科室</th>
                  <th className="px-3 py-2.5 whitespace-nowrap">申请时间</th>
                  <th
                    className="px-3 py-2.5 whitespace-nowrap cursor-pointer hover:text-slate-900 select-none bg-slate-200/50"
                    onClick={() => {
                      const next = overdueSortOrder === 'desc' ? 'asc' : 'desc';
                      setOverdueSortOrder(next);
                      triggerAction(`已切换为核收时间${next === 'desc' ? '降序 (最新优先)' : '升序'}`);
                    }}
                    title="点击切换按时间升降序排序"
                  >
                    <div className="flex items-center gap-1">
                      <span>核收时间</span>
                      <span className="text-[10px] text-sky-700 font-bold">
                        {overdueSortOrder === 'desc' ? '↓ 降序' : '↑ 升序'}
                      </span>
                    </div>
                  </th>
                  <th className="px-3 py-2.5 whitespace-nowrap text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOverdue.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-slate-400">
                      无匹配的超时未发报告
                    </td>
                  </tr>
                ) : (
                  filteredOverdue.map((item) => (
                    <tr
                      key={item.barcode}
                      className="hover:bg-rose-50/40 transition-colors group cursor-pointer"
                      onClick={() => setSelectedOverdue(item)}
                    >
                      <td className="px-3.5 py-2.5 font-mono font-medium text-slate-800 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <span>{item.barcode}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopy(item.barcode);
                            }}
                            className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-slate-200 rounded transition-opacity"
                            title="复制条码"
                          >
                            {copiedCode === item.barcode ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3 text-slate-500" />
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="px-3 py-2.5 font-mono text-slate-500 whitespace-nowrap">
                        {item.patientId}
                      </td>
                      <td className="px-3 py-2.5 font-medium text-slate-900 whitespace-nowrap">
                        {item.name}
                      </td>
                      <td className="px-2.5 py-2.5 whitespace-nowrap">
                        <span
                          className={`inline-block px-1.5 py-0.5 rounded text-[11px] font-medium border ${getSpecimenBadge(
                            item.specimen
                          )}`}
                        >
                          {item.specimen}
                        </span>
                      </td>
                      <td className="px-3.5 py-2.5 text-slate-800 font-medium truncate max-w-[150px]">
                        {item.testItem}
                      </td>
                      <td className="px-3 py-2.5 text-slate-600 whitespace-nowrap">
                        {item.department}
                      </td>
                      <td className="px-3 py-2.5 font-mono text-slate-500 whitespace-nowrap">
                        {item.applyTime}
                      </td>
                      <td className="px-3 py-2.5 font-mono text-slate-500 whitespace-nowrap">
                        {item.receiveTime}
                      </td>
                      <td className="px-3 py-2.5 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => {
                            setSelectedOverdue(item);
                          }}
                          className="text-sky-600 hover:text-sky-800 font-medium mr-2"
                        >
                          详情
                        </button>
                        <button
                          onClick={() => triggerAction(`已对患者 ${item.name} (${item.testItem}) 实施加急催报`)}
                          className="text-rose-600 hover:text-rose-800 font-medium"
                        >
                          催办
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer Summary */}
          <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex justify-between items-center">
            <span>共展示 {filteredOverdue.length} 份超时标本</span>
            <span className="text-rose-600 font-medium">请优先处理急诊与住院危急项目</span>
          </div>
        </div>

        {/* Table 2: 今日拒收标本 (Today's Rejected Specimens) */}
        <div className="bg-white rounded-xl border border-slate-200/90 overflow-hidden shadow-xs flex flex-col">
          {/* Card Header & Controls */}
          <div className="p-4 border-b border-slate-200/80 bg-slate-50/60">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <h2 className="font-bold text-slate-900 text-sm tracking-tight">
                  今日拒收标本
                </h2>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-mono">
                  {filteredRejected.length} 例
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const next = rejectedSortOrder === 'desc' ? 'asc' : 'desc';
                    setRejectedSortOrder(next);
                    triggerAction(`已切换为拒收时间${next === 'desc' ? '降序 (最新优先)' : '升序'}`);
                  }}
                  className="px-2.5 py-1 text-xs font-medium bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1 shadow-2xs"
                  title="点击切换时间排序"
                >
                  <Clock className="w-3 h-3 text-amber-600" />
                  <span>{rejectedSortOrder === 'desc' ? '降序 (最新优先) ↓' : '升序 (旧到新) ↑'}</span>
                </button>
                <button
                  onClick={() => triggerAction('已生成科室拒收标本质量归因统计图')}
                  className="px-2.5 py-1 text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors flex items-center gap-1"
                >
                  <Activity className="w-3 h-3" />
                  <span>拒收原因分析</span>
                </button>
              </div>
            </div>

            {/* Filter toolbar */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <div className="relative flex-1 min-w-[140px]">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={rejectedSearch}
                  onChange={(e) => setRejectedSearch(e.target.value)}
                  placeholder="搜索条码/患者/标本/原因..."
                  className="w-full text-xs pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-md outline-none focus:border-sky-500"
                />
              </div>

              {/* Specimen type filter */}
              <div className="flex items-center gap-1 overflow-x-auto text-[11px]">
                {['all', '血液', '痰液', '尿液', '脑脊液', '粪便', '胸水'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setRejectedSpecimenFilter(s)}
                    className={`px-2 py-1 rounded-md whitespace-nowrap transition-colors ${
                      rejectedSpecimenFilter === s
                        ? 'bg-slate-800 text-white font-medium'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {s === 'all' ? '全部标本' : s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Table Content */}
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/70 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-3.5 py-2.5 whitespace-nowrap">采集条码</th>
                  <th className="px-3 py-2.5 whitespace-nowrap">患者标识</th>
                  <th className="px-3 py-2.5 whitespace-nowrap">姓名</th>
                  <th className="px-2.5 py-2.5 whitespace-nowrap">标本</th>
                  <th className="px-3.5 py-2.5">检验项目</th>
                  <th className="px-3 py-2.5 whitespace-nowrap">科室</th>
                  <th className="px-3 py-2.5 whitespace-nowrap">申请时间</th>
                  <th
                    className="px-3 py-2.5 whitespace-nowrap cursor-pointer hover:text-slate-900 select-none bg-slate-200/50"
                    onClick={() => {
                      const next = rejectedSortOrder === 'desc' ? 'asc' : 'desc';
                      setRejectedSortOrder(next);
                      triggerAction(`已切换为拒收时间${next === 'desc' ? '降序 (最新优先)' : '升序'}`);
                    }}
                    title="点击切换按时间升降序排序"
                  >
                    <div className="flex items-center gap-1">
                      <span>拒收时间</span>
                      <span className="text-[10px] text-amber-700 font-bold">
                        {rejectedSortOrder === 'desc' ? '↓ 降序' : '↑ 升序'}
                      </span>
                    </div>
                  </th>
                  <th className="px-3 py-2.5 whitespace-nowrap text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRejected.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-slate-400">
                      无匹配的拒收标本记录
                    </td>
                  </tr>
                ) : (
                  filteredRejected.map((item) => (
                    <tr
                      key={item.barcode}
                      className="hover:bg-amber-50/40 transition-colors group cursor-pointer"
                      onClick={() => setSelectedRejected(item)}
                    >
                      <td className="px-3.5 py-2.5 font-mono font-medium text-slate-800 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <span>{item.barcode}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopy(item.barcode);
                            }}
                            className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-slate-200 rounded transition-opacity"
                            title="复制条码"
                          >
                            {copiedCode === item.barcode ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3 text-slate-500" />
                            )}
                          </button>
                        </div>
                      </td>
                      <td className="px-3 py-2.5 font-mono text-slate-500 whitespace-nowrap">
                        {item.patientId}
                      </td>
                      <td className="px-3 py-2.5 font-medium text-slate-900 whitespace-nowrap">
                        {item.name}
                      </td>
                      <td className="px-2.5 py-2.5 whitespace-nowrap">
                        <span
                          className={`inline-block px-1.5 py-0.5 rounded text-[11px] font-medium border ${getSpecimenBadge(
                            item.specimen
                          )}`}
                        >
                          {item.specimen}
                        </span>
                      </td>
                      <td className="px-3.5 py-2.5 text-slate-800 font-medium truncate max-w-[150px]">
                        {item.testItem}
                      </td>
                      <td className="px-3 py-2.5 text-slate-600 whitespace-nowrap">
                        {item.department}
                      </td>
                      <td className="px-3 py-2.5 font-mono text-slate-500 whitespace-nowrap">
                        {item.applyTime}
                      </td>
                      <td className="px-3 py-2.5 font-mono text-amber-700 font-medium whitespace-nowrap">
                        {item.rejectTime}
                      </td>
                      <td className="px-3 py-2.5 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => {
                            setSelectedRejected(item);
                          }}
                          className="text-sky-600 hover:text-sky-800 font-medium mr-2"
                        >
                          退回原因
                        </button>
                        <button
                          onClick={() => triggerAction(`已向 ${item.department} 发送重抽申请通知 (${item.name})`)}
                          className="text-amber-700 hover:text-amber-900 font-medium"
                        >
                          通知重采
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer Summary */}
          <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex justify-between items-center">
            <span>共记录 {filteredRejected.length} 例拒收标本</span>
            <span className="text-amber-700 font-medium">已自动通知临床责任护士站</span>
          </div>
        </div>
      </div>

      {/* 4. Modal: Overdue Sample Traceability */}
      {selectedOverdue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                <h3 className="font-bold text-slate-900 text-sm">超时未发报告溯源跟踪</h3>
              </div>
              <button
                onClick={() => setSelectedOverdue(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400">患者姓名</span>
                  <div className="font-bold text-slate-900 mt-0.5">{selectedOverdue.name}</div>
                </div>
                <div>
                  <span className="text-slate-400">患者标识 / 住院号</span>
                  <div className="font-mono font-medium text-slate-800 mt-0.5">
                    {selectedOverdue.patientId}
                  </div>
                </div>
                <div>
                  <span className="text-slate-400">送检科室</span>
                  <div className="font-medium text-slate-800 mt-0.5">
                    {selectedOverdue.department}
                  </div>
                </div>
                <div>
                  <span className="text-slate-400">标本条码</span>
                  <div className="font-mono font-bold text-sky-700 mt-0.5">
                    {selectedOverdue.barcode}
                  </div>
                </div>
              </div>

              <div>
                <span className="text-slate-400 block mb-1">检验项目</span>
                <div className="font-semibold text-slate-900 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  {selectedOverdue.testItem} ({selectedOverdue.specimen})
                </div>
              </div>

              {/* Timeline */}
              <div className="border-l-2 border-slate-200 pl-4 space-y-3 ml-2">
                <div>
                  <span className="font-semibold text-slate-800">1. 临床开立申请</span>
                  <div className="text-slate-500 font-mono mt-0.5">{selectedOverdue.applyTime}</div>
                </div>
                <div>
                  <span className="font-semibold text-slate-800">2. 检验科标本核收</span>
                  <div className="text-slate-500 font-mono mt-0.5">{selectedOverdue.receiveTime}</div>
                </div>
                <div>
                  <span className="font-semibold text-rose-600">3. 当前状态：已超期滞留</span>
                  <div className="text-rose-700 font-medium mt-0.5">
                    {selectedOverdue.overdueHours} · 需微生物室主管双签核实
                  </div>
                </div>
              </div>
            </div>

            <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
              <button
                onClick={() => {
                  triggerAction(`已向 ${selectedOverdue.department} 值班室拨打催办电话`);
                  setSelectedOverdue(null);
                }}
                className="px-3 py-1.5 text-xs font-medium text-sky-700 bg-sky-50 border border-sky-200 rounded-lg hover:bg-sky-100 flex items-center gap-1.5"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>电话催办</span>
              </button>
              <button
                onClick={() => {
                  triggerAction(`已将患者 ${selectedOverdue.name} 标本调至优先出报告队列`);
                  setSelectedOverdue(null);
                }}
                className="px-4 py-1.5 text-xs font-semibold bg-rose-600 text-white rounded-lg hover:bg-rose-700"
              >
                优先出具报告
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Modal: Rejected Specimen Reason & Details */}
      {selectedRejected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-slate-900 text-sm">标本拒收原因与退回凭证</h3>
              </div>
              <button
                onClick={() => setSelectedRejected(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-950">
                <span className="text-[11px] font-semibold text-amber-700 block uppercase">
                  拒收核心原因判定
                </span>
                <div className="text-sm font-bold mt-1 text-amber-900">
                  {selectedRejected.rejectReason}
                </div>
                <div className="text-[11px] text-amber-700 mt-1">
                  核查人：{selectedRejected.operator} (微生物组) · 拒收时间：
                  {selectedRejected.rejectTime}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400">患者姓名</span>
                  <div className="font-bold text-slate-900 mt-0.5">{selectedRejected.name}</div>
                </div>
                <div>
                  <span className="text-slate-400">患者标识 / 住院号</span>
                  <div className="font-mono font-medium text-slate-800 mt-0.5">
                    {selectedRejected.patientId}
                  </div>
                </div>
                <div>
                  <span className="text-slate-400">送检科室</span>
                  <div className="font-medium text-slate-800 mt-0.5">
                    {selectedRejected.department}
                  </div>
                </div>
                <div>
                  <span className="text-slate-400">标本类型</span>
                  <div className="font-medium text-slate-800 mt-0.5">
                    {selectedRejected.specimen} ({selectedRejected.testItem})
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-slate-600 leading-relaxed">
                <strong className="text-slate-800">质量控制规范说明：</strong>
                该标本不满足本院临床检验前标本合格标准，强行上机可能导致严重误诊漏诊。系统已自动撤销检验条码，请病区护士站重新核对医嘱并规范采集。
              </div>
            </div>

            <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
              <button
                onClick={() => setSelectedRejected(null)}
                className="px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900"
              >
                关闭
              </button>
              <button
                onClick={() => {
                  triggerAction(`已自动向 ${selectedRejected.department} 重新开立重抽医嘱`);
                  setSelectedRejected(null);
                }}
                className="px-4 py-1.5 text-xs font-semibold bg-amber-600 text-white rounded-lg hover:bg-amber-700 shadow-xs"
              >
                通知病区重抽
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
