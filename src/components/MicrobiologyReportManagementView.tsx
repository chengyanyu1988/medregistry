import React, { useState } from 'react';
import {
  MicrobiologyReportRecord,
  INITIAL_MICROBIOLOGY_REPORT_RECORDS,
} from '../data/microbiologyReportData';
import { UserProfile } from '../types/navigation';
import {
  Search,
  RefreshCw,
  Printer,
  CheckCircle2,
  Clock,
  X,
  FileText,
  ChevronLeft,
  ChevronRight,
  Eye,
  RotateCcw,
  AlertTriangle,
  FileCheck,
  Building2,
  CheckSquare,
} from './MenuIcon';

interface MicrobiologyReportManagementViewProps {
  user?: UserProfile;
  triggerAction: (msg: string) => void;
}

export const MicrobiologyReportManagementView: React.FC<MicrobiologyReportManagementViewProps> = ({
  user,
  triggerAction,
}) => {
  // Master Dataset State
  const [records, setRecords] = useState<MicrobiologyReportRecord[]>(
    INITIAL_MICROBIOLOGY_REPORT_RECORDS
  );

  // Filters State
  const [auditStatusFilter, setAuditStatusFilter] = useState<string>('未审核');
  const [reportTypeFilter, setReportTypeFilter] = useState<string>('全部');
  const [startDate, setStartDate] = useState<string>('2026-10-12');
  const [endDate, setEndDate] = useState<string>('2026-10-15');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Table Pagination State (10 items per page limit)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  // Selected Row State (for top toolbar actions)
  const [selectedRowRecord, setSelectedRowRecord] = useState<MicrobiologyReportRecord | null>(null);
  
  // Report Preview Modal Popup State (opens ONLY when clicking operation column button)
  const [modalRecord, setModalRecord] = useState<MicrobiologyReportRecord | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Toast Helper
  const showNotice = (msg: string) => {
    setToastMessage(msg);
    triggerAction(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filter Logic
  const filteredRecords = records.filter((rec) => {
    if (auditStatusFilter === '未审核' && rec.status !== '未审') return false;
    if (auditStatusFilter === '已审核' && rec.status !== '已审') return false;
    if (reportTypeFilter !== '全部' && rec.reportType !== reportTypeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      const matchBarcode = rec.barcode.toLowerCase().includes(q);
      const matchPatientId = rec.patientId.toLowerCase().includes(q);
      const matchName = rec.patientName.toLowerCase().includes(q);
      const matchItem = rec.testItem.toLowerCase().includes(q);
      if (!matchBarcode && !matchPatientId && !matchName && !matchItem) return false;
    }
    return true;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredRecords.length / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const currentDisplayedRecords = filteredRecords.slice(startIndex, startIndex + pageSize);

  // Single Record Audit Handler
  const handleSingleAudit = (id: string) => {
    const auditorName = user?.name || '郭彩霞';
    setRecords((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: '已审', auditor: auditorName } : r
      )
    );
    if (selectedRowRecord && selectedRowRecord.id === id) {
      setSelectedRowRecord((prev) =>
        prev ? { ...prev, status: '已审', auditor: auditorName } : null
      );
    }
    if (modalRecord && modalRecord.id === id) {
      setModalRecord((prev) =>
        prev ? { ...prev, status: '已审', auditor: auditorName } : null
      );
    }
    showNotice(`报告单记录已被审核人 [${auditorName}] 成功审核签发！`);
  };

  // Revoke Audit Handler
  const handleRevokeAudit = (id: string) => {
    setRecords((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: '未审' } : r))
    );
    if (selectedRowRecord && selectedRowRecord.id === id) {
      setSelectedRowRecord((prev) => (prev ? { ...prev, status: '未审' } : null));
    }
    if (modalRecord && modalRecord.id === id) {
      setModalRecord((prev) => (prev ? { ...prev, status: '未审' } : null));
    }
    showNotice(`报告单审核已撤销，恢复为 [未审] 状态！`);
  };

  // Batch Audit Handler
  const handleBatchAudit = () => {
    const auditorName = user?.name || '郭彩霞';
    const unauditedIds = filteredRecords.filter((r) => r.status === '未审').map((r) => r.id);
    if (unauditedIds.length === 0) {
      showNotice('当前筛选列表中没有待审核的报告');
      return;
    }
    setRecords((prev) =>
      prev.map((r) =>
        unauditedIds.includes(r.id) ? { ...r, status: '已审', auditor: auditorName } : r
      )
    );
    showNotice(`一键批量完成 ${unauditedIds.length} 份微生物检验报告审核放行！`);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-100 overflow-hidden text-xs">
      {/* Action Notification Toast */}
      {toastMessage && (
        <div className="fixed top-16 right-8 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2 border border-slate-700 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Top Filter & Action Header Strip */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 shrink-0 shadow-2xs space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Action Buttons Cluster */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                if (!selectedRowRecord) {
                  showNotice('请先在下方列表中选择要审核的报告单');
                  return;
                }
                handleSingleAudit(selectedRowRecord.id);
              }}
              className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-md shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>审核</span>
            </button>

            <button
              onClick={handleBatchAudit}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-md shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>批量审核</span>
            </button>

            <button
              onClick={() => {
                if (!selectedRowRecord) {
                  showNotice('请先选择要打印的报告单');
                  return;
                }
                showNotice(`正在连接医疗套打套卡打印机，打印报告 [${selectedRowRecord.barcode}]`);
              }}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-medium rounded-md shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>打印</span>
            </button>

            <button
              onClick={() => {
                if (!selectedRowRecord) {
                  showNotice('请先选择要撤销审核的报告单');
                  return;
                }
                handleRevokeAudit(selectedRowRecord.id);
              }}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 font-medium rounded-md flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>撤销</span>
            </button>
          </div>

          {/* Urgent Warning Badge */}
          <div className="flex items-center gap-2 font-mono">
            <span className="flex items-center gap-1 bg-rose-50 text-rose-800 border border-rose-200 px-2.5 py-1 rounded text-xs font-sans font-semibold animate-pulse">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              有1条危急值未处理！请及时处理。
            </span>
            <span className="text-slate-500 text-xs">
              已选样本: <strong className="text-slate-800 font-sans">{selectedRowRecord ? `${selectedRowRecord.barcode} (${selectedRowRecord.patientName})` : '未选择'}</strong>
            </span>
          </div>
        </div>

        {/* Filter Toolbar Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-3">
            {/* Audit Status Dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-600 font-medium whitespace-nowrap">报告状态:</span>
              <select
                value={auditStatusFilter}
                onChange={(e) => {
                  setAuditStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-slate-50 border border-slate-300 rounded px-2.5 py-1 text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-sky-500 font-medium"
              >
                <option value="未审核">未审核 (待审)</option>
                <option value="已审核">已审核 (已审)</option>
                <option value="全部">全部报告状态</option>
              </select>
            </div>

            {/* Report Type Dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-600 font-medium whitespace-nowrap">报告类型:</span>
              <select
                value={reportTypeFilter}
                onChange={(e) => {
                  setReportTypeFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-slate-50 border border-slate-300 rounded px-2.5 py-1 text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-sky-500"
              >
                <option value="全部">全部类型</option>
                <option value="培养鉴定">培养鉴定</option>
                <option value="涂片报告">涂片报告</option>
                <option value="鉴定报告">鉴定报告</option>
                <option value="药敏报告">药敏报告</option>
              </select>
            </div>

            {/* Date Range */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-600 font-medium whitespace-nowrap">报告时间:</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded px-2 py-1 text-slate-800 focus:outline-hidden"
              />
              <span className="text-slate-400">~</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded px-2 py-1 text-slate-800 focus:outline-hidden"
              />
            </div>

            {/* Search Input */}
            <div className="flex items-center gap-1 bg-slate-50 border border-slate-300 rounded px-2.5 py-1 min-w-[210px]">
              <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="采集/样本条码/姓名/病案号..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-transparent border-none outline-hidden text-xs w-full text-slate-800 placeholder-slate-400"
              />
            </div>
          </div>

          {/* Refresh Button */}
          <button
            onClick={() => {
              setAuditStatusFilter('未审核');
              setReportTypeFilter('全部');
              setSearchQuery('');
              setCurrentPage(1);
              showNotice('重置刷盘，报告审核列表已更新');
            }}
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors"
            title="刷新数据"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Table View (Occupies Full Screen Width) */}
      <div className="flex-1 min-h-0 overflow-auto p-4">
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden flex flex-col h-full">
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse min-w-[1100px]">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 sticky top-0 z-10">
                <tr>
                  <th className="px-3.5 py-2.5">报告类型</th>
                  <th className="px-3.5 py-2.5">报告状态</th>
                  <th className="px-3.5 py-2.5">标本</th>
                  <th className="px-3.5 py-2.5">检验项目</th>
                  <th className="px-3.5 py-2.5">采集条码</th>
                  <th className="px-3.5 py-2.5">患者标识/病案号</th>
                  <th className="px-3.5 py-2.5">姓名</th>
                  <th className="px-3.5 py-2.5">申请科室</th>
                  <th className="px-3.5 py-2.5">报告人</th>
                  <th className="px-3.5 py-2.5">审核人</th>
                  <th className="px-3.5 py-2.5">报告时间</th>
                  <th className="px-3.5 py-2.5 text-center">操作详情</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {currentDisplayedRecords.length === 0 ? (
                  <tr>
                    <td colSpan={12} className="text-center py-12 text-slate-400">
                      暂无匹配的微生物检验报告记录
                    </td>
                  </tr>
                ) : (
                  currentDisplayedRecords.map((rec) => {
                    const isSelected = selectedRowRecord?.id === rec.id;
                    return (
                      <tr
                        key={rec.id}
                        onClick={() => setSelectedRowRecord(rec)}
                        className={`hover:bg-sky-50/60 transition-colors cursor-pointer ${
                          isSelected ? 'bg-sky-50/90 font-medium' : ''
                        }`}
                      >
                        {/* Report Type */}
                        <td className="px-3.5 py-2.5 font-medium text-slate-800 whitespace-nowrap">
                          {rec.reportType}
                        </td>

                        {/* Report Audit Status */}
                        <td className="px-3.5 py-2.5 whitespace-nowrap">
                          {rec.status === '已审' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              已审
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] bg-amber-50 text-amber-700 font-bold border border-amber-200">
                              <Clock className="w-3 h-3 text-amber-600" />
                              未审
                            </span>
                          )}
                        </td>

                        {/* Sample Type */}
                        <td className="px-3.5 py-2.5 text-slate-700 whitespace-nowrap">
                          {rec.sampleType}
                        </td>

                        {/* Test Item */}
                        <td className="px-3.5 py-2.5 font-semibold text-slate-900 whitespace-nowrap">
                          {rec.testItem}
                        </td>

                        {/* Barcode */}
                        <td className="px-3.5 py-2.5 font-mono text-slate-600 whitespace-nowrap">
                          {rec.barcode}
                        </td>

                        {/* Patient ID */}
                        <td className="px-3.5 py-2.5 font-mono font-medium text-slate-800 whitespace-nowrap">
                          {rec.patientId}
                        </td>

                        {/* Patient Name */}
                        <td className="px-3.5 py-2.5 font-bold text-slate-900 whitespace-nowrap">
                          {rec.patientName}
                          {rec.isUrgent && (
                            <span className="ml-1.5 px-1 py-0.2 rounded text-[10px] bg-rose-600 text-white font-bold">
                              急
                            </span>
                          )}
                        </td>

                        {/* Department */}
                        <td className="px-3.5 py-2.5 text-slate-600 whitespace-nowrap">
                          {rec.department}
                        </td>

                        {/* Reporter */}
                        <td className="px-3.5 py-2.5 text-slate-700 whitespace-nowrap">
                          {rec.reporter}
                        </td>

                        {/* Auditor */}
                        <td className="px-3.5 py-2.5 text-slate-700 whitespace-nowrap">
                          {rec.status === '已审' ? rec.auditor : '-'}
                        </td>

                        {/* Report Time */}
                        <td className="px-3.5 py-2.5 font-mono text-slate-500 whitespace-nowrap">
                          {rec.reportTime}
                        </td>

                        {/* Action -> Open Modal ONLY on button click */}
                        <td className="px-3.5 py-2.5 text-center whitespace-nowrap">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedRowRecord(rec);
                              setModalRecord(rec);
                            }}
                            className="px-2.5 py-1 bg-sky-600 hover:bg-sky-700 text-white rounded font-medium shadow-2xs flex items-center gap-1 mx-auto transition-colors"
                          >
                            <Eye className="w-3 h-3" />
                            <span>查看报告单</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Bar (Fixed 10 items/page) */}
          <div className="bg-slate-50 px-4 py-2.5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-slate-600 text-xs shrink-0">
            <div className="flex items-center gap-2">
              <span>
                共 <strong className="text-slate-900 font-mono">{filteredRecords.length}</strong> 份检验报告
              </span>
              <span className="text-slate-300">|</span>
              <span>
                每页固定 <strong className="text-slate-900 font-mono">10</strong> 条
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-1 rounded border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span>
                第 <strong className="text-slate-900 font-mono">{currentPage}</strong> / {totalPages} 页
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="p-1 rounded border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* REPORT PREVIEW MODAL POPUP (点击操作列按钮展示弹窗) */}
      {/* ========================================================================= */}
      {modalRecord && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[94vh] flex flex-col overflow-hidden">
            {/* Modal Top Header Bar */}
            <div className="bg-slate-900 text-white px-5 py-3 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                <div className="flex items-center gap-2 font-bold text-sm">
                  <span>重庆市垫江县人民医院 · 临床微生物检验报告单</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                      modalRecord.status === '已审'
                        ? 'bg-emerald-500/30 text-emerald-200'
                        : 'bg-amber-500/30 text-amber-200'
                    }`}
                  >
                    状态: {modalRecord.status}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setModalRecord(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Report Sheet Workspace */}
            <div className="flex-1 min-h-0 overflow-y-auto p-6 bg-slate-100/70">
              {/* Paper Sheet Document (Authentic Printed Medical Report Layout) */}
              <div className="bg-white p-8 rounded-sm shadow-md border border-slate-300 max-w-4xl mx-auto font-serif text-slate-900 space-y-4">
                
                {/* Hospital Header Banner */}
                <div className="text-center border-b-2 border-slate-900 pb-3">
                  <div className="flex items-center justify-center gap-2 text-sky-800 font-sans font-bold text-lg">
                    <Building2 className="w-5 h-5 text-sky-700" />
                    <span>重庆市垫江县人民医院检验报告单</span>
                  </div>
                  <h3 className="text-sm font-bold tracking-wide font-sans text-slate-800 mt-1">
                    （{modalRecord.testItem}）
                  </h3>
                </div>

                {/* Patient Information Grid Sheet */}
                <div className="grid grid-cols-4 gap-y-2 gap-x-4 text-xs font-sans border-b border-slate-300 pb-3 text-slate-800">
                  <div>
                    姓 名: <strong className="text-slate-900 font-serif">{modalRecord.patientName}</strong>
                  </div>
                  <div>
                    病案号: <strong className="font-mono">{modalRecord.patientId}</strong>
                  </div>
                  <div>
                    申请医师: <strong>{modalRecord.applyDoctor}</strong>
                  </div>
                  <div>
                    唯一编号: <strong className="font-mono">{modalRecord.uniqueId}</strong>
                  </div>

                  <div>
                    性 别: <strong>{modalRecord.gender}</strong>
                  </div>
                  <div>
                    科 别: <strong>{modalRecord.department}</strong>
                  </div>
                  <div>
                    样本类型: <strong>{modalRecord.sampleType}</strong>
                  </div>
                  <div>
                    检验序号: <strong className="font-mono">{modalRecord.seqNo}</strong>
                  </div>

                  <div>
                    年 龄: <strong>{modalRecord.age}</strong>
                  </div>
                  <div>
                    床 号: <strong>{modalRecord.bedNo}床</strong>
                  </div>
                  <div>
                    就诊类型: <strong>{modalRecord.visitType}</strong>
                  </div>
                  <div>
                    检验仪器: <strong>{modalRecord.testInstrument}</strong>
                  </div>

                  <div className="col-span-3">
                    临床诊断: <span className="font-medium">{modalRecord.clinicalDiagnosis}</span>
                  </div>
                  <div>
                    备 注: <span className="text-slate-500 font-mono text-[11px]">VITEK2卡/KB合规</span>
                  </div>
                </div>

                {/* Test Result & Sample Evaluation Box */}
                <div className="bg-slate-50 border border-slate-200 p-3 rounded text-xs font-sans space-y-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="font-bold text-slate-900">样本评估：</span>
                      <span className="text-slate-800">{modalRecord.sampleEvaluation}</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-900">菌落计数：</span>
                      <span className="font-mono font-bold text-sky-900">{modalRecord.colonyCount}</span>
                    </div>
                  </div>
                  <div>
                    <span className="font-bold text-slate-900">检测结果：</span>
                    <strong className="text-sky-900 text-sm font-serif">
                      {modalRecord.detectionResult}
                    </strong>
                  </div>
                </div>

                {/* Antibiotic Susceptibility Table (Double-column Grid Layout) */}
                {modalRecord.astDetails.length > 0 && (
                  <div>
                    <h4 className="font-bold text-xs font-sans mb-1 text-slate-900 border-b border-slate-200 pb-1">
                      抗生素药敏定量检测结果（CLSI 标准）
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1 font-sans text-xs">
                      <div className="border border-slate-200 rounded overflow-hidden">
                        <table className="w-full text-left">
                          <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                            <tr>
                              <th className="px-2 py-1">抗生素名称</th>
                              <th className="px-2 py-1">方法</th>
                              <th className="px-2 py-1 font-mono">结果</th>
                              <th className="px-2 py-1 text-center">敏感度</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {modalRecord.astDetails
                              .slice(0, Math.ceil(modalRecord.astDetails.length / 2))
                              .map((ast, idx) => (
                                <tr key={idx} className="hover:bg-slate-50">
                                  <td className="px-2 py-1 font-medium">{ast.antibiotic}</td>
                                  <td className="px-2 py-1 text-slate-500 font-mono">{ast.method}</td>
                                  <td className="px-2 py-1 font-mono font-bold">{ast.resultValue}</td>
                                  <td className="px-2 py-1 text-center font-bold">
                                    {ast.susceptibility === 'S' ? (
                                      <span className="text-emerald-700">S (敏感)</span>
                                    ) : ast.susceptibility === 'R' ? (
                                      <span className="text-rose-700">R (耐药)</span>
                                    ) : (
                                      <span className="text-amber-700">{ast.susceptibility} (中介)</span>
                                    )}
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="border border-slate-200 rounded overflow-hidden">
                        <table className="w-full text-left">
                          <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                            <tr>
                              <th className="px-2 py-1">抗生素名称</th>
                              <th className="px-2 py-1">方法</th>
                              <th className="px-2 py-1 font-mono">结果</th>
                              <th className="px-2 py-1 text-center">敏感度</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {modalRecord.astDetails
                              .slice(Math.ceil(modalRecord.astDetails.length / 2))
                              .map((ast, idx) => (
                                <tr key={idx} className="hover:bg-slate-50">
                                  <td className="px-2 py-1 font-medium">{ast.antibiotic}</td>
                                  <td className="px-2 py-1 text-slate-500 font-mono">{ast.method}</td>
                                  <td className="px-2 py-1 font-mono font-bold">{ast.resultValue}</td>
                                  <td className="px-2 py-1 text-center font-bold">
                                    {ast.susceptibility === 'S' ? (
                                      <span className="text-emerald-700">S (敏感)</span>
                                    ) : ast.susceptibility === 'R' ? (
                                      <span className="text-rose-700">R (耐药)</span>
                                    ) : (
                                      <span className="text-amber-700">{ast.susceptibility} (中介)</span>
                                    )}
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* Comments */}
                <div className="font-sans text-xs">
                  <span className="font-bold text-slate-900">评语: </span>
                  <span className="text-slate-800">{modalRecord.comments}</span>
                </div>

                {/* Remarks & Units Legend */}
                <div className="text-[11px] font-sans text-slate-500 border-t border-slate-200 pt-2">
                  {modalRecord.remarks}
                  <div className="mt-0.5 text-slate-400">
                    声明: 本报告仅对本次送检样本负责。如有疑问请三日内与检验科联系。电话: 023-85650516
                  </div>
                </div>

                {/* Footer Printed Timestamps & Digital Signatures */}
                <div className="border-t-2 border-slate-900 pt-3 font-sans text-xs flex flex-wrap items-center justify-between gap-3 text-slate-800">
                  <div className="space-y-0.5 font-mono text-[11px]">
                    <div>采样时间: {modalRecord.samplingTime} | 接收时间: {modalRecord.receiveTime}</div>
                    <div>检验时间: {modalRecord.testTime} | 报告时间: {modalRecord.reportTime}</div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div>
                      检验者: <strong className="font-serif text-slate-900">{modalRecord.reporter}</strong>
                    </div>
                    <div>
                      审核者:{' '}
                      {modalRecord.status === '已审' ? (
                        <span className="inline-flex items-center gap-1 font-serif text-slate-900 font-bold underline decoration-sky-500 decoration-2">
                          {modalRecord.auditor}
                          <span className="text-[10px] text-emerald-600 border border-emerald-500 px-1 rounded font-sans">
                            已电子签章
                          </span>
                        </span>
                      ) : (
                        <span className="text-amber-600 font-sans">（未审核）</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Page Number Footer */}
                <div className="text-right text-[10px] text-slate-400 font-mono pt-1">
                  地址: 重庆市垫江县桂溪镇桂北外街116号 · 第1页 共1页
                </div>
              </div>
            </div>

            {/* Modal Bottom Action Controls */}
            <div className="bg-slate-100 border-t border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-3 shrink-0 text-xs">
              <div className="flex items-center gap-2">
                {modalRecord.status === '未审' ? (
                  <button
                    onClick={() => handleSingleAudit(modalRecord.id)}
                    className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-md shadow-xs flex items-center gap-1.5 transition-colors"
                  >
                    <FileCheck className="w-3.5 h-3.5" />
                    <span>一键审核签发</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleRevokeAudit(modalRecord.id)}
                    className="px-4 py-1.5 bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-300 font-bold rounded-md flex items-center gap-1.5 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>撤销审核</span>
                  </button>
                )}

                <button
                  onClick={() =>
                    showNotice(`正在发送打印指令: 报告条码 [${modalRecord.barcode}]`)
                  }
                  className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-md flex items-center gap-1.5 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>套打报告单</span>
                </button>
              </div>

              <button
                onClick={() => setModalRecord(null)}
                className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-medium rounded-md transition-colors"
              >
                关闭弹窗
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
