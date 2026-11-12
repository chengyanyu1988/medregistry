import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Download,
  Printer,
  X,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  FileSpreadsheet,
  BarChart3,
  Table2,
  PieChart,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  RefreshCw,
  Folder,
  FolderOpen,
  FileText
} from './MenuIcon';
import { UserProfile } from '../types/navigation';
import {
  STATISTICS_TREE_CATEGORIES,
  CATEGORY_DATA_MAP,
  CategoryConfig,
  TableColumnDef,
  StatisticsRecordItem
} from '../data/statisticsAnalysisData';

interface ClinicalStatisticsViewProps {
  user: UserProfile;
  triggerAction: (msg: string) => void;
  subId?: string;
}

export const ClinicalStatisticsView: React.FC<ClinicalStatisticsViewProps> = ({
  user,
  triggerAction,
  subId,
}) => {
  // Tree navigation state - default to 'work-inspect-items' or subId
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    'work-stats': true,
    'prof-stats': true,
    'qc-stats': true,
  });
  const [selectedSubItemId, setSelectedSubItemId] = useState<string>(
    subId && !subId.includes('folder') ? subId : 'work-inspect-items'
  );
  const [isTreeCollapsed, setIsTreeCollapsed] = useState<boolean>(false);

  React.useEffect(() => {
    if (subId && !subId.includes('folder')) {
      setSelectedSubItemId(subId);
    }
  }, [subId]);

  // Filters state
  const [dateRange, setDateRange] = useState({
    startDate: '2026-10-01',
    endDate: '2026-10-29',
  });
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [filterSampleType, setFilterSampleType] = useState<string>('all');
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  // View mode: 'table' or 'chart'
  const [viewMode, setViewMode] = useState<'table' | 'chart'>('table');

  // Popup modal state for any selected row
  const [selectedRowRecord, setSelectedRowRecord] = useState<Record<string, any> | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  // Toggle category collapse
  const toggleCategory = (catId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [catId]: !prev[catId]
    }));
  };

  // Retrieve current active category configuration
  const currentCategoryConfig: CategoryConfig = useMemo(() => {
    return (
      CATEGORY_DATA_MAP[selectedSubItemId] ||
      CATEGORY_DATA_MAP['prof-bacteria-result']
    );
  }, [selectedSubItemId]);

  // Find active item label in tree
  const activeSubItemLabel = useMemo(() => {
    for (const cat of STATISTICS_TREE_CATEGORIES) {
      const found = cat.items.find(i => i.id === selectedSubItemId);
      if (found) return found.label;
    }
    return currentCategoryConfig.title;
  }, [selectedSubItemId, currentCategoryConfig]);

  // Filtered rows for current category
  const filteredRows = useMemo(() => {
    const rawRows = currentCategoryConfig.rows || [];
    return rawRows.filter(row => {
      // Department filter
      if (filterDepartment !== 'all') {
        const deptStr = String(
          row.department || row.dept || row.depts || row.mainDepts || ''
        );
        if (!deptStr.includes(filterDepartment)) {
          return false;
        }
      }

      // Sample type filter
      if (filterSampleType !== 'all') {
        const sampleStr = String(
          row.sampleType || row.sampleOrigin || row.sampleName || ''
        );
        if (!sampleStr.includes(filterSampleType)) {
          return false;
        }
      }

      // Keyword search across all row values
      if (searchKeyword.trim()) {
        const kw = searchKeyword.toLowerCase().trim();
        const rowValues = Object.values(row).join(' ').toLowerCase();
        if (!rowValues.includes(kw)) {
          return false;
        }
      }

      return true;
    });
  }, [currentCategoryConfig, filterDepartment, filterSampleType, searchKeyword]);

  // Reset page when switching categories
  const handleSelectCategory = (itemId: string, itemLabel: string) => {
    setSelectedSubItemId(itemId);
    setCurrentPage(1);
    setSearchKeyword('');
    triggerAction(`已切换至: ${itemLabel}，表格数据已同步更新`);
  };

  const handleExport = (type: 'excel' | 'pdf') => {
    triggerAction(
      `已成功导出《${activeSubItemLabel}》${
        type === 'excel' ? 'Excel统计明细表' : 'PDF汇总报告'
      } (共 ${filteredRows.length} 条记录)`
    );
  };

  const handleQuickDate = (days: number) => {
    if (days === 0) {
      setDateRange({ startDate: '2026-10-29', endDate: '2026-10-29' });
    } else if (days === 7) {
      setDateRange({ startDate: '2026-10-22', endDate: '2026-10-29' });
    } else {
      setDateRange({ startDate: '2026-10-01', endDate: '2026-10-29' });
    }
    triggerAction(`统计时间跨度已调整为近 ${days === 0 ? '当' : days} 天`);
  };

  // Helper to render cell badges
  const renderCellContent = (col: TableColumnDef, value: any) => {
    if (value === undefined || value === null || value === '') {
      return <span className="text-slate-400 font-mono">-</span>;
    }

    const valStr = String(value);

    if (col.isBadge) {
      if (
        valStr.includes('阳性 (+)') ||
        valStr.includes('极危') ||
        valStr.includes('红色高危') ||
        valStr.includes('耐药') ||
        valStr.includes('退回') ||
        valStr.includes('1-2s')
      ) {
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
            {valStr}
          </span>
        );
      }
      if (
        valStr.includes('告警') ||
        valStr.includes('预警') ||
        valStr.includes('中危') ||
        valStr.includes('疑似')
      ) {
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
            {valStr}
          </span>
        );
      }
      if (
        valStr.includes('敏感') ||
        valStr.includes('达标') ||
        valStr.includes('合格') ||
        valStr.includes('在控') ||
        valStr.includes('优秀') ||
        valStr.includes('100.0%') ||
        valStr.includes('正常') ||
        valStr.includes('直报')
      ) {
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            {valStr}
          </span>
        );
      }
      if (valStr === '住院') {
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-sky-100 text-sky-800 border border-sky-200">
            {valStr}
          </span>
        );
      }
      if (valStr === '急诊') {
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-100 text-rose-800 border border-rose-200">
            {valStr}
          </span>
        );
      }
      if (valStr === '门诊') {
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            {valStr}
          </span>
        );
      }
      if (valStr === '体检') {
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-purple-100 text-purple-800 border border-purple-200">
            {valStr}
          </span>
        );
      }
      return (
        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700">
          {valStr}
        </span>
      );
    }

    if (col.isMono) {
      return <span className="font-mono text-slate-800 font-medium">{valStr}</span>;
    }

    return <span>{valStr}</span>;
  };

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-slate-100 overflow-hidden text-xs">
      {/* Top Header & Breadcrumb */}
      <div className="bg-white border-b border-slate-200 px-4 py-2.5 flex items-center justify-between shrink-0 shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-800">科室综合管理</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-600 font-medium">{currentCategoryConfig.group}</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-sky-700 font-semibold bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
            {activeSubItemLabel}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Table / Chart switch */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-all ${
                viewMode === 'table'
                  ? 'bg-white text-sky-700 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Table2 className="w-3.5 h-3.5" />
              <span>表格明细</span>
            </button>
            <button
              onClick={() => setViewMode('chart')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-all ${
                viewMode === 'chart'
                  ? 'bg-white text-sky-700 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>图表分析</span>
            </button>
          </div>

          <div className="h-4 w-px bg-slate-200 mx-1" />

          <button
            onClick={() => handleExport('excel')}
            className="flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-medium shadow-2xs transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>导出Excel</span>
          </button>
          <button
            onClick={() => handleExport('pdf')}
            className="flex items-center gap-1 px-3 py-1 bg-sky-600 hover:bg-sky-700 text-white rounded text-xs font-medium shadow-2xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>打印报表</span>
          </button>
        </div>
      </div>

      {/* Main Layout: Left Tree + Right Content */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Left Hierarchical Statistics Category Tree */}
        <div
          className={`${
            isTreeCollapsed ? 'w-10' : 'w-56'
          } bg-white border-r border-slate-200 flex flex-col shrink-0 transition-all duration-200 select-none`}
        >
          {/* Tree Header */}
          <div className="p-2.5 border-b border-slate-100 flex items-center justify-between text-slate-700">
            {!isTreeCollapsed && (
              <div className="flex items-center gap-1.5 font-semibold text-xs text-slate-800">
                <FolderOpen className="w-4 h-4 text-sky-600" />
                <span>综合管理目录</span>
              </div>
            )}
            <button
              onClick={() => setIsTreeCollapsed(!isTreeCollapsed)}
              className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded ml-auto"
              title={isTreeCollapsed ? '展开目录' : '收起目录'}
            >
              {isTreeCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Tree Items */}
          {!isTreeCollapsed ? (
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {STATISTICS_TREE_CATEGORIES.map(category => {
                const isExpanded = !!expandedCategories[category.id];
                return (
                  <div key={category.id} className="space-y-0.5">
                    {/* Category Title Row */}
                    <button
                      onClick={() => toggleCategory(category.id)}
                      className="w-full flex items-center justify-between px-2 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded transition-colors"
                    >
                      <div className="flex items-center gap-1.5">
                        <ChevronDown
                          className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                            isExpanded ? '' : '-rotate-90'
                          }`}
                        />
                        <Folder className="w-3.5 h-3.5 text-sky-500 fill-sky-100" />
                        <span>{category.label}</span>
                      </div>
                      {category.badge && (
                        <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 text-slate-500 font-mono">
                          {category.badge}
                        </span>
                      )}
                    </button>

                    {/* Children Sub-items */}
                    {isExpanded && (
                      <div className="pl-4 space-y-0.5 border-l border-slate-150 ml-3">
                        {category.items.map(item => {
                          const isSelected = selectedSubItemId === item.id;
                          return (
                            <button
                              key={item.id}
                              onClick={() => handleSelectCategory(item.id, item.label)}
                              className={`w-full flex items-center justify-between px-2 py-1 text-xs rounded transition-colors text-left ${
                                isSelected
                                  ? 'bg-sky-50 text-sky-700 font-semibold border-l-2 border-sky-600 pl-1.5 shadow-2xs'
                                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                              }`}
                            >
                              <div className="flex items-center gap-1.5 truncate">
                                <BarChart3
                                  className={`w-3.5 h-3.5 shrink-0 ${
                                    isSelected ? 'text-sky-600 font-bold' : 'text-slate-400'
                                  }`}
                                />
                                <span className="truncate">{item.label}</span>
                              </div>
                              {item.count !== undefined && (
                                <span
                                  className={`text-[10px] font-mono shrink-0 ${
                                    isSelected ? 'text-sky-600 font-bold' : 'text-slate-400'
                                  }`}
                                >
                                  {item.count}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-2 space-y-3 flex flex-col items-center text-slate-400">
              <BarChart3 className="w-5 h-5 text-sky-600" />
              <PieChart className="w-5 h-5 text-emerald-600" />
              <Table2 className="w-5 h-5 text-indigo-600" />
            </div>
          )}
        </div>

        {/* Right Main Content Area */}
        <div className="flex-1 flex flex-col min-h-0 bg-slate-50 overflow-hidden">
          {/* Top Filter Bar (matching screenshot) */}
          <div className="bg-white border-b border-slate-200 p-3 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {/* Date Range Picker */}
              <div className="flex items-center gap-1 bg-slate-50 border border-slate-300 rounded px-2 py-1">
                <span className="text-slate-500 font-medium">统计时间</span>
                <input
                  type="date"
                  value={dateRange.startDate}
                  onChange={e => setDateRange({ ...dateRange, startDate: e.target.value })}
                  className="bg-transparent border-0 text-slate-700 text-xs focus:ring-0 p-0 font-mono"
                />
                <span className="text-slate-400 font-mono">~</span>
                <input
                  type="date"
                  value={dateRange.endDate}
                  onChange={e => setDateRange({ ...dateRange, endDate: e.target.value })}
                  className="bg-transparent border-0 text-slate-700 text-xs focus:ring-0 p-0 font-mono"
                />
              </div>

              {/* Quick Date Buttons */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleQuickDate(0)}
                  className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded text-xs transition-colors"
                >
                  今日
                </button>
                <button
                  onClick={() => handleQuickDate(7)}
                  className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded text-xs transition-colors"
                >
                  近7天
                </button>
                <button
                  onClick={() => handleQuickDate(30)}
                  className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded text-xs transition-colors"
                >
                  近30天
                </button>
              </div>

              <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block" />

              {/* Department Dropdown */}
              <div className="flex items-center gap-1">
                <span className="text-slate-500">科室:</span>
                <select
                  value={filterDepartment}
                  onChange={e => setFilterDepartment(e.target.value)}
                  className="bg-white border border-slate-300 rounded px-2 py-1 text-slate-700 text-xs focus:outline-none focus:border-sky-500"
                >
                  <option value="all">全部科室</option>
                  <option value="内科">内科</option>
                  <option value="呼吸">呼吸内科</option>
                  <option value="急诊">急诊科</option>
                  <option value="心血管">心血管内科</option>
                  <option value="神经">神经内科</option>
                  <option value="ICU">重症医学科(ICU)</option>
                  <option value="健康管理">健康管理中心</option>
                </select>
              </div>

              {/* Specimen Type Dropdown */}
              <div className="flex items-center gap-1">
                <span className="text-slate-500">标本:</span>
                <select
                  value={filterSampleType}
                  onChange={e => setFilterSampleType(e.target.value)}
                  className="bg-white border border-slate-300 rounded px-2 py-1 text-slate-700 text-xs focus:outline-none focus:border-sky-500"
                >
                  <option value="all">全部标本</option>
                  <option value="血液">血液/血清</option>
                  <option value="痰液">痰液</option>
                  <option value="尿液">尿液</option>
                  <option value="脑脊液">脑脊液</option>
                </select>
              </div>

              {/* Search keyword input */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="项目/姓名/条码/科室检索..."
                  value={searchKeyword}
                  onChange={e => setSearchKeyword(e.target.value)}
                  className="w-40 sm:w-52 pl-7 pr-2 py-1 border border-slate-300 rounded text-xs focus:outline-none focus:border-sky-500 bg-white"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2" />
                {searchKeyword && (
                  <button
                    onClick={() => setSearchKeyword('')}
                    className="absolute right-1.5 top-1.5 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            {/* Action Buttons: Query & Export */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => triggerAction(`已根据筛选条件刷新《${activeSubItemLabel}》`)}
                className="flex items-center gap-1 px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded text-xs font-semibold shadow-xs transition-colors"
              >
                <Search className="w-3.5 h-3.5" />
                <span>查询</span>
              </button>
              <button
                onClick={() => handleExport('excel')}
                className="flex items-center gap-1 px-4 py-1.5 bg-slate-700 hover:bg-slate-800 text-white rounded text-xs font-semibold shadow-xs transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>导出</span>
              </button>
            </div>
          </div>

          {/* Dynamic KPI Metrics Bar tailored to active category */}
          <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 flex items-center justify-between flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500">统计明细条数:</span>
                <span className="font-bold text-slate-900 font-mono text-sm">{filteredRows.length} 条</span>
              </div>

              {currentCategoryConfig.kpiMetrics.map((kpi, idx) => (
                <React.Fragment key={idx}>
                  <div className="h-3 w-px bg-slate-300" />
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-500">{kpi.label}:</span>
                    <span className={`font-semibold font-mono ${kpi.color || 'text-slate-800'}`}>
                      {kpi.value}
                    </span>
                    {kpi.subLabel && (
                      <span className="text-[10px] text-slate-400 font-mono">({kpi.subLabel})</span>
                    )}
                  </div>
                </React.Fragment>
              ))}
            </div>

            <div className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>数据基准: 2026-10-29 08:50 · 临生免系统已就绪</span>
            </div>
          </div>

          {/* View Mode: Table View or Visual Chart View */}
          {viewMode === 'table' ? (
            /* Table Area */
            <div className="flex-1 min-h-0 overflow-auto bg-white">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead className="bg-slate-100/90 sticky top-0 z-10 border-b border-slate-200 text-slate-700 font-semibold text-xs shadow-2xs">
                  <tr>
                    <th className="py-2.5 px-3 w-12 text-center">#</th>
                    {currentCategoryConfig.columns.map(col => (
                      <th
                        key={col.key}
                        className={`py-2.5 px-3 ${
                          col.align === 'center'
                            ? 'text-center'
                            : col.align === 'right'
                            ? 'text-right'
                            : 'text-left'
                        }`}
                      >
                        {col.label}
                      </th>
                    ))}
                    <th className="py-2.5 px-3 text-center sticky right-0 bg-slate-100 shadow-l">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 text-xs">
                  {filteredRows.length > 0 ? (
                    filteredRows.map((row, idx) => {
                      const isEven = idx % 2 === 0;
                      return (
                        <tr
                          key={row.id || idx}
                          onClick={() => setSelectedRowRecord(row)}
                          className={`hover:bg-sky-50/70 transition-colors cursor-pointer group ${
                            isEven ? 'bg-white' : 'bg-slate-50/40'
                          }`}
                        >
                          {/* Row Index */}
                          <td className="py-2 px-3 text-center font-mono text-slate-400 text-[11px]">
                            {idx + 1}
                          </td>

                          {/* Dynamic Cells */}
                          {currentCategoryConfig.columns.map(col => (
                            <td
                              key={col.key}
                              className={`py-2 px-3 max-w-[280px] truncate ${
                                col.align === 'center'
                                  ? 'text-center'
                                  : col.align === 'right'
                                  ? 'text-right'
                                  : 'text-left'
                              }`}
                              title={String(row[col.key] || '')}
                            >
                              {renderCellContent(col, row[col.key])}
                            </td>
                          ))}

                          {/* Action Column */}
                          <td
                            className="py-2 px-3 text-center sticky right-0 bg-white group-hover:bg-sky-50/70 shadow-l"
                            onClick={e => {
                              e.stopPropagation();
                              setSelectedRowRecord(row);
                            }}
                          >
                            <button className="px-2 py-0.5 bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 rounded text-[11px] font-medium transition-colors">
                              查看详情
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan={currentCategoryConfig.columns.length + 2}
                        className="py-12 text-center text-slate-400"
                      >
                        <AlertTriangle className="w-6 h-6 mx-auto mb-2 text-slate-300" />
                        <span>未找到与筛选条件匹配的记录</span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            /* Visual Charts Area */
            <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Chart 1: 分布统计 */}
                <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-2xs">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-sky-600" />
                      <h4 className="font-semibold text-slate-800 text-xs">
                        《{activeSubItemLabel}》重点指标分布
                      </h4>
                    </div>
                    <span className="text-[11px] text-slate-400">总计 {filteredRows.length} 条样本</span>
                  </div>
                  <div className="mt-4 space-y-3">
                    {filteredRows.slice(0, 5).map((r, i) => {
                      const name =
                        r.name ||
                        r.patientName ||
                        r.sampleName ||
                        r.dept ||
                        r.department ||
                        `项目-${i + 1}`;
                      const count =
                        r.isolateCount ||
                        r.appliedCount ||
                        r.receivedCount ||
                        r.totalCount ||
                        r.sampleCount ||
                        (10 - i * 1.5);
                      const pct = Math.max(10, Math.min(100, Math.round(Number(count) * 2.5))) + '%';
                      const colors = [
                        'bg-sky-600',
                        'bg-emerald-500',
                        'bg-amber-500',
                        'bg-rose-500',
                        'bg-purple-500',
                      ];

                      return (
                        <div key={i} className="space-y-1">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-slate-700 font-medium">{name}</span>
                            <span className="text-slate-500 font-mono font-semibold">
                              {count} {typeof count === 'number' ? '例' : ''}
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${colors[i % colors.length]} rounded-full transition-all`}
                              style={{ width: pct }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Chart 2: 质控与合规率 */}
                <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-2xs">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <PieChart className="w-4 h-4 text-emerald-600" />
                      <h4 className="font-semibold text-slate-800 text-xs">
                        质控受控率与合格达标分析
                      </h4>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-mono text-[10px] font-semibold border border-emerald-200">
                      总体达标 99.1%
                    </span>
                  </div>
                  <div className="mt-4 space-y-3">
                    <div className="p-3 bg-slate-50 rounded border border-slate-150 flex items-center justify-between">
                      <span className="text-slate-700 font-medium">临床质量评价合格率</span>
                      <span className="font-mono font-bold text-emerald-700">99.6% (达标)</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded border border-slate-150 flex items-center justify-between">
                      <span className="text-slate-700 font-medium">危急值10分钟通报完成率</span>
                      <span className="font-mono font-bold text-sky-700">100.0% (在控)</span>
                    </div>
                    <div className="p-3 bg-slate-50 rounded border border-slate-150 flex items-center justify-between">
                      <span className="text-slate-700 font-medium">标本不合格拒收发生率</span>
                      <span className="font-mono font-bold text-amber-700">0.92% (符合国家标准)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Table Footer: 合计与分页 (matching user screenshot) */}
          <div className="bg-white border-t border-slate-200 px-4 py-2 flex items-center justify-between text-xs text-slate-600 shrink-0">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-slate-800">
                合计: {filteredRows.length} 条
              </span>
              <span className="text-slate-400">|</span>
              <span className="text-[11px] text-slate-500">
                当前目录: 《{activeSubItemLabel}》 · 每页显示 {pageSize} 条 · 第 {currentPage} /{' '}
                {Math.ceil(filteredRows.length / pageSize) || 1} 页
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="px-2 py-1 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:pointer-events-none rounded text-xs text-slate-700"
              >
                上一页
              </button>
              <button className="px-2.5 py-1 bg-sky-600 text-white rounded text-xs font-semibold">
                1
              </button>
              <button
                disabled={currentPage >= Math.ceil(filteredRows.length / pageSize)}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="px-2 py-1 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:pointer-events-none rounded text-xs text-slate-700"
              >
                下一页
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Details Popup Modal (右侧信息改为弹窗展示) */}
      {selectedRowRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-scaleIn">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center font-bold text-sm">
                  报
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-white">
                      {activeSubItemLabel} · 明细分析报告
                    </h3>
                    {selectedRowRecord.barcode && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 font-mono">
                        条码: {selectedRowRecord.barcode}
                      </span>
                    )}
                    {selectedRowRecord.source && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-sky-900 text-sky-200">
                        {selectedRowRecord.source}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {selectedRowRecord.patientName
                      ? `患者: ${selectedRowRecord.patientName} (${selectedRowRecord.department || '检验科'})`
                      : selectedRowRecord.name || selectedRowRecord.project || activeSubItemLabel}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    triggerAction(
                      `已发送《${activeSubItemLabel}》明细单打印指令至科室打印机`
                    )
                  }
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs flex items-center gap-1 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>打印单据</span>
                </button>
                <button
                  onClick={() => setSelectedRowRecord(null)}
                  className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              {/* Key Attributes Grid */}
              <div className="bg-slate-50 rounded-lg p-3.5 border border-slate-200 grid grid-cols-2 sm:grid-cols-3 gap-3">
                {currentCategoryConfig.columns.map(col => {
                  const val = selectedRowRecord[col.key];
                  if (val === undefined || val === null || val === '') return null;
                  return (
                    <div key={col.key} className="space-y-0.5">
                      <span className="text-slate-400 block text-[11px]">{col.label}:</span>
                      <div className="font-medium text-slate-800">
                        {renderCellContent(col, val)}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Special Context Card for Bacteria / AST */}
              {selectedRowRecord.cultureDescription && (
                <div className="bg-white rounded-lg p-3.5 border border-slate-200 space-y-2">
                  <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>培养描述与分子生物学鉴定</span>
                  </h4>
                  <div className="p-3 bg-amber-50/50 rounded border border-amber-150 text-slate-800 leading-relaxed font-sans">
                    {selectedRowRecord.cultureDescription}
                  </div>
                </div>
              )}

              {/* Special Context Card for Defect Specimen */}
              {selectedRowRecord.defectReason && (
                <div className="bg-rose-50 rounded-lg p-3.5 border border-rose-200 space-y-1">
                  <h4 className="font-bold text-rose-900 text-xs flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>不合格标本拒收原因与质控说明</span>
                  </h4>
                  <p className="text-rose-800">{selectedRowRecord.defectReason}</p>
                </div>
              )}

              {/* Special Context Card for Quality Control */}
              {selectedRowRecord.westgardStatus && (
                <div className="bg-sky-50 rounded-lg p-3.5 border border-sky-200 space-y-1">
                  <h4 className="font-bold text-sky-900 text-xs flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-sky-600" />
                    <span>Westgard 多规则质控图谱自动判定结论</span>
                  </h4>
                  <p className="text-sky-800">
                    实测值偏倚均在允许总误差 (TEa) 范围内，仪器光路、试剂效期及定标曲线均处于受控状态。
                  </p>
                </div>
              )}

              {/* Clinical Advice / Infection Control Note */}
              <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 flex items-start gap-2.5">
                <FileText className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                <div className="text-[11px] text-slate-600 leading-relaxed">
                  <span className="font-semibold text-slate-800">统计分析追溯记录: </span>
                  本项数据已通过临生免系统与全院 HIS/LIS/EMR 双向接口核验，数据更新时间为近期 2026-10-29，符合国家三级公立医院绩效考核与等级评审要求。
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex items-center justify-between shrink-0">
              <span className="text-[11px] text-slate-500 font-mono">
                操作技师: {user.name} ({user.role}) · 市中心医院检验科
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    triggerAction(`已将《${activeSubItemLabel}》记录归档并推送到医务处统计大屏`);
                    setSelectedRowRecord(null);
                  }}
                  className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded font-medium text-xs shadow-xs"
                >
                  推送至院级看板
                </button>
                <button
                  onClick={() => setSelectedRowRecord(null)}
                  className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 rounded text-xs"
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
