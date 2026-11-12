import React, { useState, useMemo } from 'react';
import { LabReport, ReportFilterState, PrintSettingsState } from '../../types/report';
import { INITIAL_LAB_REPORTS, DEPARTMENTS_LIST } from '../../data/mockReports';
import { UserProfile } from '../../types/navigation';
import {
  Search,
  Printer,
  Eye,
  Sliders,
  Calendar,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCcw,
  CheckSquare,
  Square,
  FileText,
  User,
  Building2,
  ShieldAlert,
  Download,
  Check
} from 'lucide-react';
import { ReportDetailModal } from './ReportDetailModal';
import { ReportPrintPreviewModal } from './ReportPrintPreviewModal';
import { ReportPrintSettingsModal } from './ReportPrintSettingsModal';

interface ReportQueryCenterViewProps {
  user: UserProfile;
  triggerAction: (msg: string) => void;
}

export const ReportQueryCenterView: React.FC<ReportQueryCenterViewProps> = ({
  user,
  triggerAction,
}) => {
  // Report Dataset State
  const [reports, setReports] = useState<LabReport[]>(INITIAL_LAB_REPORTS);

  // Selected row checkboxes for batch printing
  const [selectedReportIds, setSelectedReportIds] = useState<string[]>(['RPT-20261030-001']);

  // Active Report for Detail Modal (Converted right side into a modal popup!)
  const [detailModalReport, setDetailModalReport] = useState<LabReport | null>(null);

  // Active Report for Print Preview
  const [previewModalReport, setPreviewModalReport] = useState<LabReport | null>(null);

  // Print Settings Modal State
  const [isPrintSettingsOpen, setIsPrintSettingsOpen] = useState<boolean>(false);

  // Filter Form State matching screenshot top bar
  const [datePreset, setDatePreset] = useState<'today' | 'yesterday' | 'threeDays' | 'week' | 'month'>('today');
  const [startDate, setStartDate] = useState<string>('2026-10-30');
  const [endDate, setEndDate] = useState<string>('2026-10-30');
  const [deptFilter, setDeptFilter] = useState<string>('全部');
  const [printStatusFilter, setPrintStatusFilter] = useState<string>('全部');
  const [patientSourceFilter, setPatientSourceFilter] = useState<string>('全部');
  const [keywordInput, setKeywordInput] = useState<string>('');

  // Toast / notification
  const [batchActionNotice, setBatchActionNotice] = useState<string | null>(null);

  // Change Date Preset
  const handleDatePresetChange = (preset: 'today' | 'yesterday' | 'threeDays' | 'week' | 'month') => {
    setDatePreset(preset);
    if (preset === 'today') {
      setStartDate('2026-10-30');
      setEndDate('2026-10-30');
    } else if (preset === 'yesterday') {
      setStartDate('2026-10-29');
      setEndDate('2026-10-29');
    } else if (preset === 'threeDays') {
      setStartDate('2026-10-28');
      setEndDate('2026-10-30');
    } else if (preset === 'week') {
      setStartDate('2026-10-24');
      setEndDate('2026-10-30');
    } else if (preset === 'month') {
      setStartDate('2026-10-01');
      setEndDate('2026-10-30');
    }
  };

  // Filtered reports
  const filteredReports = useMemo(() => {
    return reports.filter((item) => {
      // Dept filter
      if (deptFilter !== '全部' && !item.department.includes(deptFilter)) {
        return false;
      }
      // Print status filter
      if (printStatusFilter !== '全部' && item.printStatus !== printStatusFilter) {
        return false;
      }
      // Patient source filter
      if (patientSourceFilter !== '全部' && item.patientSource !== patientSourceFilter) {
        return false;
      }
      // Keyword search (barcode, patientName, medicalRecordNo, bedNo, testCategory)
      if (keywordInput.trim()) {
        const key = keywordInput.trim().toLowerCase();
        const matched =
          item.patientName.toLowerCase().includes(key) ||
          item.barcode.includes(key) ||
          item.medicalRecordNo.includes(key) ||
          item.bedNo.toLowerCase().includes(key) ||
          item.testCategory.toLowerCase().includes(key) ||
          item.applyNo.includes(key);
        if (!matched) return false;
      }
      return true;
    });
  }, [reports, deptFilter, printStatusFilter, patientSourceFilter, keywordInput]);

  // Handle select single checkbox
  const handleToggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedReportIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Handle select all
  const handleToggleSelectAll = () => {
    if (selectedReportIds.length === filteredReports.length) {
      setSelectedReportIds([]);
    } else {
      setSelectedReportIds(filteredReports.map((r) => r.id));
    }
  };

  // Batch Print Action
  const handleBatchPrint = () => {
    if (selectedReportIds.length === 0) {
      triggerAction('请先勾选需要批量打印的检验报告单');
      return;
    }
    // Update print status
    setReports((prev) =>
      prev.map((r) =>
        selectedReportIds.includes(r.id)
          ? { ...r, printStatus: '已打印', printCount: r.printCount + 1 }
          : r
      )
    );
    triggerAction(`已向默认激光打印机发送 ${selectedReportIds.length} 份报告打印任务！`);
  };

  // Print Preview
  const handleOpenPrintPreview = (report?: LabReport) => {
    if (report) {
      setPreviewModalReport(report);
    } else if (selectedReportIds.length > 0) {
      const target = reports.find((r) => r.id === selectedReportIds[0]) || reports[0];
      setPreviewModalReport(target);
    } else {
      setPreviewModalReport(filteredReports[0] || reports[0]);
    }
  };

  // Single print callback
  const handlePrintSingle = (report: LabReport) => {
    setReports((prev) =>
      prev.map((r) =>
        r.id === report.id
          ? { ...r, printStatus: '已打印', printCount: r.printCount + 1 }
          : r
      )
    );
    triggerAction(`已发送《${report.patientName} - ${report.testCategory}》报告至打印机`);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-50 p-4 space-y-3.5">
      {/* 1. Module Header & Summary Badges */}
      <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-sky-50 rounded-xl border border-sky-200 text-sky-700">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-slate-900 text-base">报告查询中心</h2>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-sky-100 text-sky-700 border border-sky-200">
                全院综合追溯
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                数据基准：2026-10-30 实时在控
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              提供全院门诊、住院、急诊及体检报告多维调阅，点击列表任意行可弹窗查看指标详情、历史趋势与仪器图谱
            </p>
          </div>
        </div>

        {/* Quick Stats Pills */}
        <div className="flex items-center gap-2 text-xs">
          <div className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700">
            <span className="text-[10px] text-slate-400 block">查询结果</span>
            <span className="font-bold font-mono text-slate-900 text-sm">
              {filteredReports.length} <span className="text-xs font-normal text-slate-500">份</span>
            </span>
          </div>

          <div className="px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800">
            <span className="text-[10px] text-emerald-600 block">已审核报告</span>
            <span className="font-bold font-mono text-emerald-700 text-sm">
              {filteredReports.filter((r) => r.status === '已审核').length} 份
            </span>
          </div>

          <div className="px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-800">
            <span className="text-[10px] text-amber-600 block">待打印报告</span>
            <span className="font-bold font-mono text-amber-700 text-sm">
              {filteredReports.filter((r) => r.printStatus === '未打印').length} 份
            </span>
          </div>

          <div className="px-3 py-1.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-800">
            <span className="text-[10px] text-rose-600 block">急查危急值</span>
            <span className="font-bold font-mono text-rose-700 text-sm">
              {filteredReports.filter((r) => r.isUrgent).length} 份
            </span>
          </div>
        </div>
      </div>

      {/* 2. Top Filter Bar (Reconstructed with high fidelity matching image_298fa7bf.png) */}
      <div className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Left Inputs Group */}
          <div className="flex flex-wrap items-center gap-3">
            {/* 申请时间 Preset & Range */}
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-700 whitespace-nowrap">申请时间:</span>
              <select
                value={datePreset}
                onChange={(e) => handleDatePresetChange(e.target.value as any)}
                className="px-2 py-1.5 bg-white border border-slate-300 rounded font-medium text-slate-800 focus:outline-none focus:border-sky-500"
              >
                <option value="today">今天</option>
                <option value="yesterday">昨天</option>
                <option value="threeDays">近3天</option>
                <option value="week">近1周</option>
                <option value="month">近1月</option>
              </select>

              <div className="flex items-center gap-1">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="px-2 py-1 bg-white border border-slate-300 rounded font-mono text-[11px] text-slate-800"
                />
                <span className="text-slate-400 font-mono">~</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="px-2 py-1 bg-white border border-slate-300 rounded font-mono text-[11px] text-slate-800"
                />
              </div>
            </div>

            {/* 申请科室 Dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-700 whitespace-nowrap">申请科室:</span>
              <select
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
                className="px-2.5 py-1.5 bg-white border border-slate-300 rounded font-medium text-slate-800 focus:outline-none focus:border-sky-500"
              >
                {DEPARTMENTS_LIST.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* 打印状态 Dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-700 whitespace-nowrap">打印状态:</span>
              <select
                value={printStatusFilter}
                onChange={(e) => setPrintStatusFilter(e.target.value)}
                className="px-2.5 py-1.5 bg-white border border-slate-300 rounded font-medium text-slate-800 focus:outline-none focus:border-sky-500"
              >
                <option value="全部">全部状态</option>
                <option value="未打印">未打印</option>
                <option value="已打印">已打印</option>
              </select>
            </div>

            {/* 患者来源 Dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-700 whitespace-nowrap">患者来源:</span>
              <select
                value={patientSourceFilter}
                onChange={(e) => setPatientSourceFilter(e.target.value)}
                className="px-2.5 py-1.5 bg-white border border-slate-300 rounded font-medium text-slate-800 focus:outline-none focus:border-sky-500"
              >
                <option value="全部">全部来源</option>
                <option value="住院">住院患者</option>
                <option value="门诊">门诊患者</option>
                <option value="急诊">急诊患者</option>
                <option value="体检">健康体检</option>
              </select>
            </div>

            {/* 患者信息 Input */}
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-700 whitespace-nowrap">患者信息:</span>
              <div className="relative w-56">
                <input
                  type="text"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  placeholder="门诊/住院号、条码号、姓名"
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-800 focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>
          </div>

          {/* Right Action Buttons (Corresponding to screenshot buttons: 查询, 打印, 打印预览, 打印设置) */}
          <div className="flex items-center gap-2 shrink-0">
            {/* 查询 Button */}
            <button
              onClick={() => triggerAction(`已按当前条件完成查询，共调阅 ${filteredReports.length} 份报告`)}
              className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded font-semibold text-xs flex items-center gap-1.5 shadow-2xs transition-colors"
            >
              <Search className="w-3.5 h-3.5" />
              <span>查询</span>
            </button>

            {/* 打印 Button */}
            <button
              onClick={handleBatchPrint}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-semibold text-xs flex items-center gap-1.5 shadow-2xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>打印 ({selectedReportIds.length})</span>
            </button>

            {/* 打印预览 Button */}
            <button
              onClick={() => handleOpenPrintPreview()}
              className="px-3.5 py-1.5 bg-white hover:bg-slate-50 text-sky-700 border border-sky-300 rounded font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Eye className="w-3.5 h-3.5 text-sky-600" />
              <span>打印预览</span>
            </button>

            {/* 打印设置 Button */}
            <button
              onClick={() => setIsPrintSettingsOpen(true)}
              className="px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded font-semibold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Sliders className="w-3.5 h-3.5 text-slate-600" />
              <span>打印设置</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Full-Width Table View (Converted right side into a modal popup, so main table spans 100% width) */}
      <div className="flex-1 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs flex flex-col">
        {/* Table Toolbar & Selection Status */}
        <div className="p-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <span className="font-bold text-slate-900">检验报告查询结果清单</span>
            <span className="text-slate-400">|</span>
            <span className="text-slate-600">
              已选中 <strong className="text-sky-700 font-mono">{selectedReportIds.length}</strong> / {filteredReports.length} 份报告
            </span>
          </div>

          <div className="text-[11px] text-slate-500 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            <span>提示：单击任意患者行可弹窗调阅检验项目指标、历史趋势及仪器图谱</span>
          </div>
        </div>

        {/* Scrollable Table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead className="bg-slate-50/90 sticky top-0 z-10 border-b border-slate-200 text-slate-700 font-semibold text-xs">
              <tr>
                <th className="py-2.5 px-3 w-12 text-center">
                  <input
                    type="checkbox"
                    checked={
                      filteredReports.length > 0 &&
                      selectedReportIds.length === filteredReports.length
                    }
                    onChange={handleToggleSelectAll}
                    className="w-4 h-4 text-sky-600 rounded border-slate-300 focus:ring-sky-500 cursor-pointer"
                  />
                </th>
                <th className="py-2.5 px-3 w-20 text-center">打印</th>
                <th className="py-2.5 px-3 w-24 text-center">状态</th>
                <th className="py-2.5 px-3 w-24">姓名</th>
                <th className="py-2.5 px-3 w-28 font-mono">病历号</th>
                <th className="py-2.5 px-3 w-28">申请科室</th>
                <th className="py-2.5 px-2 w-16">床号</th>
                <th className="py-2.5 px-4">检验项目</th>
                <th className="py-2.5 px-3 w-32 font-mono">申请单号</th>
                <th className="py-2.5 px-3 w-32 font-mono">送检时间</th>
                <th className="py-2.5 px-3 w-28 text-center">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-16 text-center text-slate-400">
                    <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p>未查询到匹配的检验报告记录，请尝试调整查询条件</p>
                  </td>
                </tr>
              ) : (
                filteredReports.map((report) => {
                  const isSelected = selectedReportIds.includes(report.id);
                  return (
                    <tr
                      key={report.id}
                      onClick={() => setDetailModalReport(report)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-sky-50/70 hover:bg-sky-100/60' : 'hover:bg-slate-50'
                      }`}
                    >
                      {/* Checkbox column */}
                      <td
                        className="py-2.5 px-3 text-center"
                        onClick={(e) => handleToggleSelect(report.id, e)}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          className="w-4 h-4 text-sky-600 rounded border-slate-300 focus:ring-sky-500 cursor-pointer"
                        />
                      </td>

                      {/* Print status icon */}
                      <td className="py-2.5 px-3 text-center">
                        {report.printStatus === '已打印' ? (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-medium font-mono">
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span>已打</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 text-[10px] font-medium">
                            未打
                          </span>
                        )}
                      </td>

                      {/* Status Tag (Matching screenshot: 已审核, 已核收, 已签收, 已送检) */}
                      <td className="py-2.5 px-3 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            report.status === '已审核'
                              ? 'bg-emerald-600 text-white'
                              : report.status === '已核收'
                              ? 'bg-sky-600 text-white'
                              : report.status === '已签收'
                              ? 'bg-amber-500 text-white'
                              : 'bg-slate-500 text-white'
                          }`}
                        >
                          {report.status}
                        </span>
                      </td>

                      {/* Patient Name (Authentic Chinese name) */}
                      <td className="py-2.5 px-3 font-bold text-slate-900">
                        <div className="flex items-center gap-1.5">
                          <span>{report.patientName}</span>
                          <span className="text-[10px] text-slate-400 font-normal">
                            ({report.gender})
                          </span>
                        </div>
                      </td>

                      {/* Medical Record No */}
                      <td className="py-2.5 px-3 font-mono text-slate-700 font-medium">
                        {report.medicalRecordNo}
                      </td>

                      {/* Department */}
                      <td className="py-2.5 px-3 font-medium text-slate-800">
                        {report.department}
                      </td>

                      {/* Bed No */}
                      <td className="py-2.5 px-2 font-mono text-sky-800 font-bold">
                        {report.bedNo}
                      </td>

                      {/* Test Category */}
                      <td className="py-2.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-slate-900">{report.testCategory}</span>
                          {report.isUrgent && (
                            <span className="px-1.5 py-0.2 bg-rose-100 text-rose-700 border border-rose-200 rounded text-[10px] font-bold">
                              急
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Apply No / Barcode */}
                      <td className="py-2.5 px-3 font-mono text-slate-500 text-[11px]">
                        {report.applyNo}
                      </td>

                      {/* Sample Time */}
                      <td className="py-2.5 px-3 font-mono text-slate-500 text-[11px]">
                        {report.sampleTime}
                      </td>

                      {/* Actions */}
                      <td className="py-2.5 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setDetailModalReport(report)}
                            className="px-2.5 py-1 bg-sky-50 hover:bg-sky-100 text-sky-700 rounded text-[11px] font-semibold transition-colors"
                          >
                            详情弹窗
                          </button>
                          <button
                            onClick={() => handleOpenPrintPreview(report)}
                            className="p-1 hover:bg-slate-100 text-slate-600 rounded transition-colors"
                            title="打印预览"
                          >
                            <Eye className="w-3.5 h-3.5" />
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

        {/* Table Footer with Total Count and Quick Actions */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sky-700 font-mono">
              合计：{filteredReports.length} 条记录
            </span>
            <span className="text-slate-400">·</span>
            <span>已选定 {selectedReportIds.length} 项</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setDeptFilter('全部');
                setPrintStatusFilter('全部');
                setPatientSourceFilter('全部');
                setKeywordInput('');
                setDatePreset('today');
                setStartDate('2026-10-30');
                setEndDate('2026-10-30');
              }}
              className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>重置条件</span>
            </button>
            <span className="text-slate-300">|</span>
            <button
              onClick={() => triggerAction('已成功导出当前查询结果至电子表格 (Excel)')}
              className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 rounded text-slate-700 text-xs font-medium flex items-center gap-1"
            >
              <Download className="w-3 h-3 text-slate-500" />
              <span>导出Excel</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. MODAL: Report Detail Modal (Converted right side into a modal popup!) */}
      <ReportDetailModal
        report={detailModalReport}
        onClose={() => setDetailModalReport(null)}
        onPrintPreview={(rpt) => {
          setDetailModalReport(null);
          setPreviewModalReport(rpt);
        }}
        onPrintSingle={handlePrintSingle}
      />

      {/* 5. MODAL: Print Preview Modal */}
      <ReportPrintPreviewModal
        report={previewModalReport}
        onClose={() => setPreviewModalReport(null)}
        onPrintSuccess={(id) => {
          setReports((prev) =>
            prev.map((r) =>
              r.id === id ? { ...r, printStatus: '已打印', printCount: r.printCount + 1 } : r
            )
          );
        }}
      />

      {/* 6. MODAL: Print Settings Modal */}
      <ReportPrintSettingsModal
        isOpen={isPrintSettingsOpen}
        onClose={() => setIsPrintSettingsOpen(false)}
        onSave={(settings) => {
          triggerAction(`已保存打印参数：默认打印机为《${settings.printerName}》，纸张规格${settings.paperSize}`);
        }}
      />
    </div>
  );
};
