import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  RefreshCw,
  Printer,
  CheckCircle2,
  XCircle,
  FileText,
  Eye,
  Calendar,
  Building2,
  User,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
  Download,
  Microscope,
  Check,
  AlertTriangle,
  Layers,
  Activity,
  ArrowUpDown,
  Tag
} from 'lucide-react';
import { BoneMarrowItem, INITIAL_BONE_MARROW_ITEMS } from '../data/boneMarrowData';
import { UserProfile } from '../types/navigation';

interface GraphicMarrowReportViewProps {
  user?: UserProfile;
  triggerAction: (msg: string) => void;
}

export const GraphicMarrowReportView: React.FC<GraphicMarrowReportViewProps> = ({
  user,
  triggerAction,
}) => {
  // State
  const [items, setItems] = useState<BoneMarrowItem[]>(INITIAL_BONE_MARROW_ITEMS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [startDate, setStartDate] = useState('2026-10-01');
  const [endDate, setEndDate] = useState('2026-10-30');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; // Exactly 10 items per page as requested

  // Detail Modal state
  const [selectedReport, setSelectedReport] = useState<BoneMarrowItem | null>(null);
  const [activeTab, setActiveTab] = useState<'differential' | 'images'>('differential');
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Filter logic
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      // Keyword match
      const keyword = searchTerm.trim().toLowerCase();
      const matchKeyword =
        !keyword ||
        item.applyNo.toLowerCase().includes(keyword) ||
        item.specimenNo.toLowerCase().includes(keyword) ||
        item.patientId.toLowerCase().includes(keyword) ||
        item.patientName.toLowerCase().includes(keyword) ||
        item.department.toLowerCase().includes(keyword) ||
        item.doctor.toLowerCase().includes(keyword);

      // Status match
      let matchStatus = true;
      if (statusFilter === 'pending') {
        matchStatus = item.status === '未镜检' || item.status === '未审核';
      } else if (statusFilter === 'audited') {
        matchStatus = item.status === '已镜检' || item.status === '已审签';
      } else if (statusFilter === 'revoked') {
        matchStatus = item.status === '已撤销';
      }

      return matchKeyword && matchStatus;
    });
  }, [items, searchTerm, statusFilter]);

  // Paginated data
  const totalPages = Math.ceil(filteredItems.length / pageSize) || 1;
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredItems.slice(start, start + pageSize);
  }, [filteredItems, currentPage, pageSize]);

  // Select all handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(paginatedItems.map(i => i.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // Status Change actions
  const handleAuditReport = (report: BoneMarrowItem) => {
    setItems(prev =>
      prev.map(item =>
        item.id === report.id
          ? {
              ...item,
              status: '已审签',
            }
          : item
      )
    );
    if (selectedReport && selectedReport.id === report.id) {
      setSelectedReport(prev => prev ? { ...prev, status: '已审签' } : null);
    }
    triggerAction(`报告 [${report.applyNo} - ${report.patientName}] 已成功核准审签！`);
  };

  const handleRevokeReport = (report: BoneMarrowItem) => {
    setItems(prev =>
      prev.map(item =>
        item.id === report.id
          ? {
              ...item,
              status: '未审核',
            }
          : item
      )
    );
    if (selectedReport && selectedReport.id === report.id) {
      setSelectedReport(prev => prev ? { ...prev, status: '未审核' } : null);
    }
    triggerAction(`已撤销报告 [${report.applyNo} - ${report.patientName}] 的审签状态。`);
  };

  const handleBatchAudit = () => {
    if (selectedIds.length === 0) {
      triggerAction('请先勾选需要批量审核的报告');
      return;
    }
    setItems(prev =>
      prev.map(item =>
        selectedIds.includes(item.id)
          ? { ...item, status: '已审签' }
          : item
      )
    );
    triggerAction(`已成功批量审签 ${selectedIds.length} 份骨髓报告！`);
    setSelectedIds([]);
  };

  const handleBatchPrint = () => {
    if (selectedIds.length === 0) {
      triggerAction('请选择需要打印的报告记录');
      return;
    }
    triggerAction(`已向医用高精打印机发送 ${selectedIds.length} 份骨髓图文报告！`);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-800 font-sans p-4 overflow-y-auto space-y-4">
      {/* 1. Header Toolbar & Filters */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs space-y-3.5">
        {/* Top Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="扫描/输入申请单号、病历号、姓名..."
                value={searchTerm}
                onChange={e => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-64 pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all placeholder:text-slate-400"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
              <span className="text-slate-500 font-medium">报告状态:</span>
              <select
                value={statusFilter}
                onChange={e => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-transparent font-medium text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="all">全部状态</option>
                <option value="pending">未审核 (待审签)</option>
                <option value="audited">已审核 (已审签)</option>
                <option value="revoked">已撤销</option>
              </select>
            </div>

            {/* Date Range Picker */}
            <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-500">报告时间:</span>
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="bg-transparent focus:outline-none text-slate-700 font-mono"
              />
              <span className="text-slate-300">~</span>
              <input
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="bg-transparent focus:outline-none text-slate-700 font-mono"
              />
            </div>

            {/* Refresh */}
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setCurrentPage(1);
                triggerAction('已刷新骨髓图文报告列表数据！');
              }}
              className="p-1.5 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-lg border border-slate-200 transition-colors"
              title="刷新列表"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Action Button Group */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleBatchAudit}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 text-white rounded-lg hover:bg-sky-700 font-medium transition-colors shadow-2xs text-xs"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>批量审核</span>
            </button>
            <button
              onClick={handleBatchPrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-slate-700 rounded-lg border border-slate-200 hover:bg-slate-50 font-medium transition-colors text-xs"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>批量打印</span>
            </button>
            <button
              onClick={() => triggerAction('已导出当前表格骨髓报告为 Excel 报表！')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-slate-700 rounded-lg border border-slate-200 hover:bg-slate-50 font-medium transition-colors text-xs"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>导出数据</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Table View (Full width list, fixed 10 items per page) */}
      <div className="bg-white border border-slate-200/90 rounded-xl shadow-2xs overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                <th className="py-3 px-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={
                      paginatedItems.length > 0 &&
                      paginatedItems.every(i => selectedIds.includes(i.id))
                    }
                    onChange={handleSelectAll}
                    className="rounded border-slate-300 text-sky-600 focus:ring-sky-500 cursor-pointer"
                  />
                </th>
                <th className="py-3 px-3">报告状态</th>
                <th className="py-3 px-3">标本类型</th>
                <th className="py-3 px-3">申请单号</th>
                <th className="py-3 px-3">标本号/条码</th>
                <th className="py-3 px-3">患者标识</th>
                <th className="py-3 px-3">患者姓名</th>
                <th className="py-3 px-3">性别/年龄</th>
                <th className="py-3 px-3">申请科室/医生</th>
                <th className="py-3 px-3">检验项目</th>
                <th className="py-3 px-3">申请/报告时间</th>
                <th className="py-3 px-3">审核医师</th>
                <th className="py-3 px-3 text-center">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {paginatedItems.length === 0 ? (
                <tr>
                  <td colSpan={13} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <FileText className="w-8 h-8 text-slate-300 stroke-1" />
                      <span>未查找到匹配的骨髓报告记录</span>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedItems.map((item) => {
                  const isAudited = item.status === '已审签' || item.status === '已镜检';
                  const isSelected = selectedIds.includes(item.id);

                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-sky-50/40 transition-colors cursor-pointer ${
                        isSelected ? 'bg-sky-50/60' : ''
                      }`}
                      onClick={() => setSelectedReport(item)}
                    >
                      <td
                        className="py-2.5 px-3 text-center"
                        onClick={e => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectRow(item.id)}
                          className="rounded border-slate-300 text-sky-600 focus:ring-sky-500 cursor-pointer"
                        />
                      </td>
                      <td className="py-2.5 px-3">
                        {isAudited ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            已审核
                          </span>
                        ) : item.status === '已撤销' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-rose-50 text-rose-700 border border-rose-200">
                            <XCircle className="w-3 h-3 text-rose-600" />
                            已撤销
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                            <AlertTriangle className="w-3 h-3 text-amber-600" />
                            未审核
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 font-medium text-slate-700">
                        <span className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-600 font-mono text-[11px]">
                          骨髓
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono font-medium text-slate-800">
                        {item.applyNo}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-600">
                        {item.specimenNo}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-600">
                        {item.patientId}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-slate-900">
                        <div className="flex items-center gap-1.5">
                          <span>{item.patientName}</span>
                          {item.isUrgent && (
                            <span className="px-1.5 py-0.2 rounded text-[10px] bg-rose-100 text-rose-700 font-bold">
                              急
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-slate-600">
                        {item.gender} / {item.age}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600">
                        <div>{item.department}</div>
                        <div className="text-[11px] text-slate-400">{item.doctor}</div>
                      </td>
                      <td className="py-2.5 px-3 text-slate-700 max-w-[140px] truncate">
                        骨髓细胞形态学分析
                      </td>
                      <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px]">
                        {item.applyTime}
                      </td>
                      <td className="py-2.5 px-3 text-slate-700">
                        {isAudited ? '魏主任' : <span className="text-slate-400">待审签</span>}
                      </td>
                      <td
                        className="py-2.5 px-3 text-center"
                        onClick={e => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setSelectedReport(item)}
                            className="flex items-center gap-1 px-2 py-1 bg-sky-50 text-sky-700 hover:bg-sky-100 rounded border border-sky-200 transition-colors font-medium text-[11px]"
                          >
                            <Eye className="w-3 h-3" />
                            <span>查看/审核</span>
                          </button>
                          {isAudited ? (
                            <button
                              onClick={() => handleRevokeReport(item)}
                              className="px-2 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded border border-rose-200 transition-colors font-medium text-[11px]"
                            >
                              撤销
                            </button>
                          ) : (
                            <button
                              onClick={() => handleAuditReport(item)}
                              className="px-2 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded border border-emerald-200 transition-colors font-medium text-[11px]"
                            >
                              审核
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* 3. Pagination Controls (Fixed 10 items per page) */}
        <div className="bg-slate-50/90 border-t border-slate-200 px-4 py-3 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span>
              显示第 <strong className="font-mono text-slate-900">{filteredItems.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}</strong> 到{' '}
              <strong className="font-mono text-slate-900">{Math.min(currentPage * pageSize, filteredItems.length)}</strong> 条，共{' '}
              <strong className="font-mono text-slate-900">{filteredItems.length}</strong> 条记录
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-500 font-mono">每页 10 条</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-1 font-mono">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-7 h-7 rounded-lg text-xs font-semibold transition-colors ${
                    currentPage === page
                      ? 'bg-sky-600 text-white shadow-2xs'
                      : 'bg-white border border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Report Detail Modal (点击后弹窗展示) */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden">
            {/* Modal Header Bar */}
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400">
                  <Microscope className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-bold text-base text-white">大连医科大学附属第二医院 检验报告单</h2>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30 font-mono">
                      骨髓细胞形态学镜检
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono">
                    LABORATORY REPORT OF THE SECOND HOSPITAL OF DALIAN MEDICAL UNIVERSITY
                  </p>
                </div>
              </div>

              {/* Action Buttons in Modal Header */}
              <div className="flex items-center gap-2">
                {selectedReport.status === '已审签' || selectedReport.status === '已镜检' ? (
                  <button
                    onClick={() => handleRevokeReport(selectedReport)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 rounded-lg border border-rose-500/30 font-medium text-xs transition-colors"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>撤销审核</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleAuditReport(selectedReport)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white hover:bg-emerald-500 rounded-lg font-medium text-xs transition-colors shadow-2xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>通过审核</span>
                  </button>
                )}
                <button
                  onClick={() => triggerAction(`正在打印患者 [${selectedReport.patientName}] 的完整骨髓图文报告...`)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 text-slate-200 hover:bg-slate-700 rounded-lg border border-slate-700 font-medium text-xs transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>打印报告</span>
                </button>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors ml-2"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body - Scrollable Lab Report Sheet */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50 text-slate-800 text-xs">
              {/* Report Patient Banner Header */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-3">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-y-2.5 gap-x-4 border-b border-slate-100 pb-3 font-sans">
                  <div>
                    <span className="text-slate-400">姓名:</span>{' '}
                    <strong className="text-slate-900 font-bold text-sm">{selectedReport.patientName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">性别:</span>{' '}
                    <span className="text-slate-800 font-medium">{selectedReport.gender}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">年龄:</span>{' '}
                    <span className="text-slate-800 font-medium">{selectedReport.age}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">门诊/住院号:</span>{' '}
                    <span className="text-slate-800 font-mono font-medium">{selectedReport.patientId}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">送检科室:</span>{' '}
                    <span className="text-slate-800 font-medium">{selectedReport.department}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">送检医师:</span>{' '}
                    <span className="text-slate-800 font-medium">{selectedReport.doctor}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">床号:</span>{' '}
                    <span className="text-slate-800 font-medium">{selectedReport.bedNo}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">标本类型:</span>{' '}
                    <span className="px-1.5 py-0.5 bg-sky-50 text-sky-700 rounded font-medium text-[11px]">
                      骨髓与血片
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 text-slate-600 pt-1">
                  <div>
                    <span className="text-slate-400">临床诊断/印象:</span>{' '}
                    <span className="font-medium text-slate-800">{selectedReport.clinicalDiagnosis}</span>
                  </div>
                  <div className="flex items-center gap-4 font-mono text-[11px] text-slate-500">
                    <span>申请单号: <strong className="text-slate-700">{selectedReport.applyNo}</strong></span>
                    <span>申请时间: {selectedReport.applyTime}</span>
                  </div>
                </div>
              </div>

              {/* Tabs Switcher for Cell Differential & Images */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('differential')}
                    className={`px-4 py-2 rounded-lg font-semibold text-xs transition-all flex items-center gap-2 ${
                      activeTab === 'differential'
                        ? 'bg-sky-600 text-white shadow-2xs'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>骨髓与外周血细胞分类计数及组化染色</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('images')}
                    className={`px-4 py-2 rounded-lg font-semibold text-xs transition-all flex items-center gap-2 ${
                      activeTab === 'images'
                        ? 'bg-sky-600 text-white shadow-2xs'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Microscope className="w-3.5 h-3.5" />
                    <span>显微油镜高清图像 ({selectedReport.microscopyImages.length}张)</span>
                  </button>
                </div>

                <div className="flex items-center gap-2 text-slate-500 font-mono text-[11px]">
                  <span>髓片计: <strong>200</strong> 粒</span>
                  <span>|</span>
                  <span>血片计: <strong>100</strong> 粒</span>
                </div>
              </div>

              {activeTab === 'differential' ? (
                <div className="space-y-4">
                  {/* Structured Differential Table */}
                  <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-100/90 text-slate-700 font-bold border-b border-slate-200">
                          <th className="py-2.5 px-3">细胞系统分类</th>
                          <th className="py-2.5 px-3">细胞名称</th>
                          <th className="py-2.5 px-3 text-right">骨髓片 (%)</th>
                          <th className="py-2.5 px-3 text-center">骨髓片参考值 (均值±SD)</th>
                          <th className="py-2.5 px-3 text-right">血片 (%)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-sans">
                        {/* 粒细胞系统 */}
                        <tr className="bg-slate-50/50">
                          <td rowSpan={6} className="py-2.5 px-3 font-bold text-slate-800 align-top bg-slate-50/80">
                            粒细胞系统
                          </td>
                          <td className="py-2 px-3 text-slate-700">原始粒细胞</td>
                          <td className="py-2 px-3 text-right font-mono font-bold text-sky-700">
                            {selectedReport.counts.myeloblast.toFixed(2)}
                          </td>
                          <td className="py-2 px-3 text-center text-slate-400 font-mono">0.08 ± 0.01</td>
                          <td className="py-2 px-3 text-right font-mono text-slate-600">0.00</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-3 text-slate-700">早幼粒细胞</td>
                          <td className="py-2 px-3 text-right font-mono font-bold text-sky-700">
                            {selectedReport.counts.promyelocyte.toFixed(2)}
                          </td>
                          <td className="py-2 px-3 text-center text-slate-400 font-mono">1.57 ± 0.60</td>
                          <td className="py-2 px-3 text-right font-mono text-slate-600">0.00</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-3 text-slate-700">中性中幼粒细胞</td>
                          <td className="py-2 px-3 text-right font-mono font-bold text-slate-800">
                            {selectedReport.counts.myelocyteNeutro.toFixed(2)}
                          </td>
                          <td className="py-2 px-3 text-center text-slate-400 font-mono">6.49 ± 2.04</td>
                          <td className="py-2 px-3 text-right font-mono text-slate-600">0.00</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-3 text-slate-700">中性晚幼粒细胞</td>
                          <td className="py-2 px-3 text-right font-mono font-bold text-slate-800">
                            {selectedReport.counts.metamyelocyteNeutro.toFixed(2)}
                          </td>
                          <td className="py-2 px-3 text-center text-slate-400 font-mono">7.90 ± 1.97</td>
                          <td className="py-2 px-3 text-right font-mono text-slate-600">0.00</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-3 text-slate-700">中性杆状核粒细胞</td>
                          <td className="py-2 px-3 text-right font-mono font-bold text-slate-800">
                            {selectedReport.counts.bandNeutro.toFixed(2)}
                          </td>
                          <td className="py-2 px-3 text-center text-slate-400 font-mono">23.72 ± 7.50</td>
                          <td className="py-2 px-3 text-right font-mono text-slate-600">12.00</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-3 text-slate-700">中性分叶核粒细胞</td>
                          <td className="py-2 px-3 text-right font-mono font-bold text-slate-800">
                            {selectedReport.counts.segmentedNeutro.toFixed(2)}
                          </td>
                          <td className="py-2 px-3 text-center text-slate-400 font-mono">9.44 ± 2.92</td>
                          <td className="py-2 px-3 text-right font-mono text-slate-600">52.00</td>
                        </tr>

                        {/* 红细胞系统 */}
                        <tr className="bg-slate-50/50 border-t border-slate-200">
                          <td rowSpan={4} className="py-2.5 px-3 font-bold text-slate-800 align-top bg-slate-50/80">
                            红细胞系统
                          </td>
                          <td className="py-2 px-3 text-slate-700">原始红细胞</td>
                          <td className="py-2 px-3 text-right font-mono font-bold text-slate-800">
                            {selectedReport.counts.pronormoblast.toFixed(2)}
                          </td>
                          <td className="py-2 px-3 text-center text-slate-400 font-mono">0.57 ± 0.30</td>
                          <td className="py-2 px-3 text-right font-mono text-slate-600">0.00</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-3 text-slate-700">早幼红细胞</td>
                          <td className="py-2 px-3 text-right font-mono font-bold text-slate-800">
                            {selectedReport.counts.basophilicNormoblast.toFixed(2)}
                          </td>
                          <td className="py-2 px-3 text-center text-slate-400 font-mono">0.92 ± 0.41</td>
                          <td className="py-2 px-3 text-right font-mono text-slate-600">0.00</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-3 text-slate-700">中幼红细胞</td>
                          <td className="py-2 px-3 text-right font-mono font-bold text-slate-800">
                            {selectedReport.counts.polychromaticNormoblast.toFixed(2)}
                          </td>
                          <td className="py-2 px-3 text-center text-slate-400 font-mono">7.41 ± 1.91</td>
                          <td className="py-2 px-3 text-right font-mono text-slate-600">0.00</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-3 text-slate-700">晚幼红细胞</td>
                          <td className="py-2 px-3 text-right font-mono font-bold text-slate-800">
                            {selectedReport.counts.orthochromaticNormoblast.toFixed(2)}
                          </td>
                          <td className="py-2 px-3 text-center text-slate-400 font-mono">10.75 ± 2.36</td>
                          <td className="py-2 px-3 text-right font-mono text-slate-600">0.00</td>
                        </tr>

                        {/* 淋巴细胞系统 */}
                        <tr className="bg-slate-50/50 border-t border-slate-200">
                          <td rowSpan={2} className="py-2.5 px-3 font-bold text-slate-800 align-top bg-slate-50/80">
                            淋巴细胞系统
                          </td>
                          <td className="py-2 px-3 text-slate-700">原始/幼稚淋巴细胞</td>
                          <td className="py-2 px-3 text-right font-mono font-bold text-slate-800">
                            {(selectedReport.counts.lymphoblast + selectedReport.counts.prolymphocyte).toFixed(2)}
                          </td>
                          <td className="py-2 px-3 text-center text-slate-400 font-mono">0.05 ± 0.09</td>
                          <td className="py-2 px-3 text-right font-mono text-slate-600">0.00</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-3 text-slate-700">成熟淋巴细胞</td>
                          <td className="py-2 px-3 text-right font-mono font-bold text-slate-800">
                            {selectedReport.counts.matureLymphocyte.toFixed(2)}
                          </td>
                          <td className="py-2 px-3 text-center text-slate-400 font-mono">22.78 ± 7.04</td>
                          <td className="py-2 px-3 text-right font-mono text-slate-600">32.00</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Cytochemical Staining Metrics Grid */}
                  <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-2">
                    <h4 className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>细胞化学染色分析结果 (Cytochemical Staining)</span>
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono text-[11px]">
                      <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                        <span className="text-slate-400">NAP积分/阳性率:</span>{' '}
                        <strong className="text-slate-900">{selectedReport.cytochemical.napScore} 分 ({selectedReport.cytochemical.napPositiveRate})</strong>
                      </div>
                      <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                        <span className="text-slate-400">POX过氧化物酶:</span>{' '}
                        <strong className="text-slate-900">{selectedReport.cytochemical.pox}</strong>
                      </div>
                      <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                        <span className="text-slate-400">PAS糖原染色:</span>{' '}
                        <strong className="text-slate-900">{selectedReport.cytochemical.pas}</strong>
                      </div>
                      <div className="p-2 bg-slate-50 rounded-lg border border-slate-200">
                        <span className="text-slate-400">细胞外铁/环铁:</span>{' '}
                        <strong className="text-slate-900">{selectedReport.cytochemical.extracellularIron} / {selectedReport.cytochemical.intracellularIron.ring}%</strong>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Microscopy Images Gallery Tab */
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-4">
                  <h4 className="font-bold text-slate-800 text-xs">显微高倍油镜捕获涂片图谱</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {selectedReport.microscopyImages.map((imgUrl, idx) => (
                      <div
                        key={idx}
                        onClick={() => setPreviewImage(imgUrl)}
                        className="group relative rounded-lg border border-slate-200 overflow-hidden bg-slate-900 aspect-4/3 cursor-pointer"
                      >
                        <img
                          src={imgUrl}
                          alt={`Microscopy ${idx + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
                        />
                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium">
                          <Eye className="w-4 h-4 mr-1" /> 点击放大图谱
                        </div>
                        <span className="absolute bottom-2 left-2 px-1.5 py-0.5 bg-black/60 backdrop-blur-xs text-white text-[10px] rounded font-mono">
                          图谱 #{idx + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Morphological Opinions & Final Diagnostic Conclusion */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-2">
                  <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-sky-600" />
                    <span>骨髓涂片镜检意见</span>
                  </h4>
                  <p className="text-slate-700 leading-relaxed font-sans text-xs bg-slate-50/80 p-3 rounded-lg border border-slate-100">
                    {selectedReport.marrowOpinion}
                  </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-2">
                  <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-indigo-600" />
                    <span>外周血片镜检意见</span>
                  </h4>
                  <p className="text-slate-700 leading-relaxed font-sans text-xs bg-slate-50/80 p-3 rounded-lg border border-slate-100">
                    {selectedReport.bloodOpinion}
                  </p>
                </div>
              </div>

              {/* Final Diagnostic Impression Block */}
              <div className="bg-sky-50/80 border border-sky-200 rounded-xl p-4 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sky-900 text-xs flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-sky-600" />
                    <span>骨髓形态学诊断结论与提示 (Diagnostic Impression)</span>
                  </h4>
                  <span className="px-2.5 py-0.5 bg-sky-600 text-white font-bold rounded-full text-[10px]">
                    权威报告审签结论
                  </span>
                </div>
                <div className="text-sky-950 font-bold text-sm bg-white p-3 rounded-lg border border-sky-200 shadow-2xs">
                  {selectedReport.diagnosisResult}
                </div>
              </div>

              {/* Report Sign-off & Stamp Footer */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-6 text-xs text-slate-600">
                  <div>
                    <span className="text-slate-400">检验医师:</span>{' '}
                    <strong className="text-slate-800">张立平</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">审核医师:</span>{' '}
                    <strong className="text-slate-800">魏主任 (主管检验师)</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">报告日期:</span>{' '}
                    <span className="font-mono text-slate-700">2026-10-30 14:20</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>大连医科大学附属第二医院 检验专用章 (电子印章已签核)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* High-Res Image Preview Lightbox */}
      {previewImage && (
        <div
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 z-60 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out"
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
              src={previewImage}
              alt="High res microscopy"
              className="rounded-xl shadow-2xl object-contain max-h-[85vh]"
            />
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute -top-3 -right-3 p-2 bg-white text-slate-800 rounded-full shadow-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
