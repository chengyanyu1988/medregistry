import React, { useState } from 'react';
import {
  WhonetRecordItem,
  WhonetAntibioticResult,
  INITIAL_WHONET_RECORDS,
} from '../data/microbiologyWhonetData';
import { UserProfile } from '../types/navigation';
import {
  Search,
  RefreshCw,
  FileSpreadsheet,
  FileText,
  CheckCircle2,
  AlertTriangle,
  X,
  User,
  FlaskConical,
  Activity,
  Layers,
  Thermometer,
  Archive,
  Printer,
  Table2,
  Eye,
  ShieldCheck,
  Send,
  ChevronLeft,
  ChevronRight,
  Filter,
  Sliders,
} from './MenuIcon';

interface MicrobiologyWhonetViewProps {
  user?: UserProfile;
  triggerAction: (msg: string) => void;
}

export const MicrobiologyWhonetView: React.FC<MicrobiologyWhonetViewProps> = ({
  user,
  triggerAction,
}) => {
  // Master WHONET records
  const [records, setRecords] = useState<WhonetRecordItem[]>(INITIAL_WHONET_RECORDS);

  // Filters
  const [startDate, setStartDate] = useState<string>('2026-10-01');
  const [endDate, setEndDate] = useState<string>('2026-10-30');
  const [sourceFilter, setSourceFilter] = useState<string>('全部');
  const [specimenFilter, setSpecimenFilter] = useState<string>('全部');
  const [mdroFilter, setMdroFilter] = useState<string>('全部');
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  // Selected row for Detail Modal
  const [detailItem, setDetailItem] = useState<WhonetRecordItem | null>(null);

  // Export Modal state
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [exportFormat, setExportFormat] = useState<string>('whonet_sqlite');
  const [maskPatientName, setMaskPatientName] = useState<boolean>(true);

  // Pagination (Strictly 10 items/page)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showLocalNotice = (msg: string) => {
    setToastMessage(msg);
    triggerAction(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filter logic
  const filteredRecords = records.filter((r) => {
    if (sourceFilter !== '全部' && r.patientSource !== sourceFilter) return false;
    if (specimenFilter !== '全部' && r.specimen !== specimenFilter) return false;
    if (mdroFilter !== '全部' && r.mdro !== mdroFilter) return false;
    if (searchKeyword.trim()) {
      const q = searchKeyword.trim().toLowerCase();
      const matchBarcode = r.barcode.toLowerCase().includes(q);
      const matchName = r.patientName.toLowerCase().includes(q);
      const matchId = r.patientId.toLowerCase().includes(q);
      const matchOrg = r.organismName.toLowerCase().includes(q);
      const matchCode = r.whonetCode.toLowerCase().includes(q);
      const matchDept = r.department.toLowerCase().includes(q);
      if (!matchBarcode && !matchName && !matchId && !matchOrg && !matchCode && !matchDept)
        return false;
    }
    return true;
  });

  const totalPages = Math.ceil(filteredRecords.length / pageSize) || 1;
  const currentTableItems = filteredRecords.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Surveillance Statistics Summary
  const totalCount = filteredRecords.length;
  const mdroCount = filteredRecords.filter((r) => r.mdro !== '普通菌株').length;
  const esblCount = filteredRecords.filter((r) => r.esbl === '阳性(+)').length;
  const mrsaCount = filteredRecords.filter((r) => r.mdro === 'MRSA').length;
  const crkpCount = filteredRecords.filter((r) => r.mdro === 'CR-KP' || r.mdro === 'CRE').length;

  // Handle Export submit
  const handleConfirmExport = () => {
    let formatLabel = 'WHONET 5.6 数据库格式 (.sqlite)';
    if (exportFormat === 'carss_excel') {
      formatLabel = '国家细菌耐药监测网 (CARSS) 标准上报 Excel';
    } else if (exportFormat === 'chinet_dbf') {
      formatLabel = '全国真菌/细菌耐药监测网 (CHINET) 规范格式 (.csv)';
    } else if (exportFormat === 'raw_xlsx') {
      formatLabel = '原始检验数据明细台账 (.xlsx)';
    }

    setShowExportModal(false);
    showLocalNotice(
      `正在导出 ${formatLabel}（共 ${filteredRecords.length} 条菌株记录，脱敏状态: ${
        maskPatientName ? '已脱敏' : '保留实名'
      }）`
    );
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-100 overflow-hidden text-xs">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 right-8 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2 border border-slate-700 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* 1. Top Query & Action Bar (Matches Screenshot image_2359cc60.png) */}
      <div className="bg-white border-b border-slate-200 px-5 py-3 shrink-0 shadow-2xs space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Query Filter Fields */}
          <div className="flex flex-wrap items-center gap-3 flex-1">
            {/* 统计时间 */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-600 font-semibold whitespace-nowrap">统计时间:</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-2 py-1 text-xs bg-slate-50 border border-slate-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-sky-500 font-mono text-slate-700"
              />
              <span className="text-slate-400">~</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-2 py-1 text-xs bg-slate-50 border border-slate-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-sky-500 font-mono text-slate-700"
              />
            </div>

            {/* 患者来源 */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-600 font-semibold whitespace-nowrap">患者来源:</span>
              <select
                value={sourceFilter}
                onChange={(e) => {
                  setSourceFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-2 py-1 text-xs bg-slate-50 border border-slate-300 rounded-md font-medium text-slate-800"
              >
                <option value="全部">全部来源</option>
                <option value="住院">住院</option>
                <option value="ICU">重症监护 (ICU)</option>
                <option value="急诊">急诊</option>
                <option value="门诊">门诊</option>
              </select>
            </div>

            {/* 标本类型 */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-600 font-semibold whitespace-nowrap">标本类型:</span>
              <select
                value={specimenFilter}
                onChange={(e) => {
                  setSpecimenFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-2 py-1 text-xs bg-slate-50 border border-slate-300 rounded-md font-medium text-slate-800"
              >
                <option value="全部">全部标本</option>
                <option value="血液">血液</option>
                <option value="痰液">痰液</option>
                <option value="尿液">尿液</option>
                <option value="创面脓液">创面脓液</option>
                <option value="穿刺液">穿刺液</option>
                <option value="脑脊液">脑脊液</option>
              </select>
            </div>

            {/* 耐药类型 */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-600 font-semibold whitespace-nowrap">多重耐药:</span>
              <select
                value={mdroFilter}
                onChange={(e) => {
                  setMdroFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-2 py-1 text-xs bg-slate-50 border border-slate-300 rounded-md font-medium text-slate-800"
              >
                <option value="全部">全部表型</option>
                <option value="CR-KP">CR-KP (耐碳青霉烯克雷伯菌)</option>
                <option value="MRSA">MRSA (耐甲氧西林金葡菌)</option>
                <option value="XDR-AB">XDR-AB (泛耐药不动杆菌)</option>
                <option value="VRE">VRE (耐万古霉素肠球菌)</option>
                <option value="CR-PA">CR-PA (耐碳青霉烯铜绿假单胞菌)</option>
                <option value="普通菌株">非多重耐药菌</option>
              </select>
            </div>

            {/* 搜索关键字 */}
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                placeholder="条码/病历号/姓名/菌种..."
                value={searchKeyword}
                onChange={(e) => {
                  setSearchKeyword(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-44 px-2 py-1 text-xs bg-slate-50 border border-slate-300 rounded-md placeholder-slate-400 font-medium"
              />
            </div>

            {/* 查询与刷新 */}
            <button
              onClick={() => {
                setCurrentPage(1);
                showLocalNotice(`查询完成，共检索出 ${filteredRecords.length} 条菌株监测记录`);
              }}
              className="px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-medium rounded-md shadow-2xs flex items-center gap-1 transition-colors"
            >
              <Search className="w-3.5 h-3.5 text-slate-500" />
              <span>查询</span>
            </button>

            <button
              onClick={() => {
                setSourceFilter('全部');
                setSpecimenFilter('全部');
                setMdroFilter('全部');
                setSearchKeyword('');
                showLocalNotice('已重置WHONET查询筛选条件');
              }}
              className="p-1.5 rounded-md border border-slate-300 bg-white hover:bg-slate-50 text-slate-600 hover:text-sky-600 transition-colors"
              title="重置"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Action Button: 导出 (Matches Screenshot 「导出」) */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowExportModal(true)}
              className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-md shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>导出 WHONET / CARSS</span>
            </button>
          </div>
        </div>

        {/* AMR Surveillance Dashboard Indicator Banner */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-slate-600 text-xs">
          <div className="flex items-center gap-4">
            <span className="font-semibold text-slate-900 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-sky-600" />
              <span>世界卫生组织 WHONET / 国家细菌耐药监测网 (CARSS) 数据直报专栏</span>
            </span>

            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                总菌株数: {totalCount}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                多重耐药(MDRO): {mdroCount} ({((mdroCount / (totalCount || 1)) * 100).toFixed(1)}%)
              </span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                ESBL(+): {esblCount}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                MRSA: {mrsaCount}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-red-50 text-red-700 border border-red-200">
                CRE/CRKP: {crkpCount}
              </span>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 font-sans">
            提示：表格横向滑动可查看培养特性与耐药试验表型；点击任意行可调出该菌株完整的<strong className="text-sky-700">「抗生素药敏谱详情」</strong>。
          </div>
        </div>
      </div>

      {/* 2. Main Table View (Matches Exact Column Headers from Screenshot image_2359cc60.png) */}
      <div className="flex-1 min-h-0 p-5 overflow-hidden flex flex-col">
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden flex flex-col h-full">
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse min-w-[1700px]">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 sticky top-0 z-10 select-none">
                <tr>
                  <th className="px-3 py-2.5 w-20">患者来源</th>
                  <th className="px-3 py-2.5 w-28 font-mono">条码号</th>
                  <th className="px-3 py-2.5 w-24 font-mono">患者标识</th>
                  <th className="px-3 py-2.5 w-20">姓名</th>
                  <th className="px-2.5 py-2.5 w-14 text-center">性别</th>
                  <th className="px-2.5 py-2.5 w-16 text-center">年龄</th>
                  <th className="px-3 py-2.5 w-20">标本</th>
                  <th className="px-3 py-2.5 w-32">科室</th>
                  <th className="px-3.5 py-2.5 w-48">诊断</th>
                  <th className="px-3 py-2.5 w-36 font-mono">报告时间</th>
                  <th className="px-3 py-2.5 w-36 font-mono">采样时间</th>
                  <th className="px-3.5 py-2.5 w-64">培养描述</th>
                  <th className="px-3 py-2.5 w-28 text-center">超广谱β内酰胺酶</th>
                  <th className="px-3 py-2.5 w-32 text-center">苯唑西林筛选试验</th>
                  <th className="px-3 py-2.5 w-24 text-center">多重耐药</th>
                  <th className="px-3 py-2.5 w-24 text-center">耐万古霉素</th>
                  <th className="px-4 py-2.5 w-56">微生物</th>
                  <th className="px-3 py-2.5 text-center w-28 sticky right-0 bg-slate-50 shadow-xs">
                    药敏谱详情
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {currentTableItems.length === 0 ? (
                  <tr>
                    <td colSpan={18} className="text-center py-16 text-slate-400">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <CheckCircle2 className="w-8 h-8 text-slate-300" />
                        <span className="text-sm">暂无符合条件的WHONET监测菌株数据</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentTableItems.map((item) => {
                    const isMdro = item.mdro !== '普通菌株';
                    return (
                      <tr
                        key={item.id}
                        onClick={() => setDetailItem(item)}
                        className={`hover:bg-sky-50/60 transition-colors cursor-pointer group ${
                          isMdro ? 'bg-amber-50/20' : ''
                        }`}
                        title="点击查看此菌株在WHONET标准下的完整抗生素药敏明细谱"
                      >
                        {/* 患者来源 */}
                        <td className="px-3 py-2.5 whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                              item.patientSource === 'ICU'
                                ? 'bg-red-100 text-red-800'
                                : item.patientSource === '住院'
                                ? 'bg-blue-100 text-blue-800'
                                : item.patientSource === '急诊'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {item.patientSource}
                          </span>
                        </td>

                        {/* 条码号 */}
                        <td className="px-3 py-2.5 font-mono font-bold text-slate-800 whitespace-nowrap">
                          {item.barcode}
                        </td>

                        {/* 患者标识 */}
                        <td className="px-3 py-2.5 font-mono text-slate-600 whitespace-nowrap">
                          {item.patientId}
                        </td>

                        {/* 姓名 (真实规范人名) */}
                        <td className="px-3 py-2.5 font-bold text-slate-900 whitespace-nowrap">
                          {item.patientName}
                        </td>

                        {/* 性别 */}
                        <td className="px-2.5 py-2.5 text-center text-slate-700 whitespace-nowrap">
                          {item.gender}
                        </td>

                        {/* 年龄 */}
                        <td className="px-2.5 py-2.5 text-center text-slate-600 whitespace-nowrap font-mono">
                          {item.age}
                        </td>

                        {/* 标本 */}
                        <td className="px-3 py-2.5 text-slate-800 font-medium whitespace-nowrap">
                          {item.specimen}
                        </td>

                        {/* 科室 */}
                        <td className="px-3 py-2.5 text-slate-700 whitespace-nowrap">
                          {item.department}
                        </td>

                        {/* 诊断 */}
                        <td className="px-3.5 py-2.5 text-slate-700 truncate max-w-[180px]" title={item.diagnosis}>
                          {item.diagnosis}
                        </td>

                        {/* 报告时间 */}
                        <td className="px-3 py-2.5 font-mono text-slate-500 text-[11px] whitespace-nowrap">
                          {item.reportTime}
                        </td>

                        {/* 采样时间 */}
                        <td className="px-3 py-2.5 font-mono text-slate-500 text-[11px] whitespace-nowrap">
                          {item.sampleTime}
                        </td>

                        {/* 培养描述 */}
                        <td className="px-3.5 py-2.5 text-slate-600 truncate max-w-[240px]" title={item.cultureDescription}>
                          {item.cultureDescription}
                        </td>

                        {/* 超广谱β内酰胺酶 */}
                        <td className="px-3 py-2.5 text-center whitespace-nowrap">
                          {item.esbl === '阳性(+)' ? (
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                              阳性(+)
                            </span>
                          ) : item.esbl === '阴性(-)' ? (
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600">
                              阴性(-)
                            </span>
                          ) : (
                            <span className="text-slate-400">未做</span>
                          )}
                        </td>

                        {/* 苯唑西林筛选试验 */}
                        <td className="px-3 py-2.5 text-center whitespace-nowrap">
                          {item.oxacillinScreen === '阳性(+)' ? (
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                              阳性(+)
                            </span>
                          ) : item.oxacillinScreen === '阴性(-)' ? (
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600">
                              阴性(-)
                            </span>
                          ) : (
                            <span className="text-slate-400">未做</span>
                          )}
                        </td>

                        {/* 多重耐药 */}
                        <td className="px-3 py-2.5 text-center whitespace-nowrap">
                          {item.mdro !== '普通菌株' ? (
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-red-600 text-white shadow-2xs">
                              {item.mdro}
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[11px] bg-slate-100 text-slate-600">
                              普通菌株
                            </span>
                          )}
                        </td>

                        {/* 耐万古霉素 */}
                        <td className="px-3 py-2.5 text-center whitespace-nowrap">
                          {item.vancomycinResistant === '耐药' ? (
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-600 text-white">
                              耐药
                            </span>
                          ) : item.vancomycinResistant === '敏感' ? (
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                              敏感
                            </span>
                          ) : (
                            <span className="text-slate-400">未做</span>
                          )}
                        </td>

                        {/* 微生物 (中文名称 + 拉丁名 + WHONET 3-letter code) */}
                        <td className="px-4 py-2.5">
                          <div className="font-bold text-sky-950 flex items-center gap-1.5">
                            <span className="px-1.5 py-0.2 rounded bg-sky-100 text-sky-800 font-mono text-[10px] font-bold">
                              {item.whonetCode}
                            </span>
                            <span>{item.organismName}</span>
                          </div>
                        </td>

                        {/* 药敏谱详情操作 */}
                        <td
                          className="px-3 py-2.5 text-center whitespace-nowrap sticky right-0 bg-white group-hover:bg-sky-50 transition-colors shadow-2xs"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => setDetailItem(item)}
                            className="px-2.5 py-1 bg-sky-600 hover:bg-sky-700 text-white rounded font-medium shadow-2xs inline-flex items-center gap-1 transition-colors"
                          >
                            <Eye className="w-3 h-3" />
                            <span>药敏谱</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table Pagination Bar (Strictly 10 items/page) */}
          <div className="bg-slate-50 px-5 py-2.5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-slate-600 text-xs shrink-0">
            <div className="flex items-center gap-3">
              <span>
                合计: <strong className="text-slate-900 font-mono text-sm">{filteredRecords.length}</strong> 条监测记录
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
      {/* 3. WHONET AST DETAIL MODAL (药敏谱与耐药表型闭环明细) */}
      {/* ========================================================================= */}
      {detailItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-sky-600 flex items-center justify-center shrink-0 shadow-md">
                  <FlaskConical className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <span>WHONET 细菌耐药监测档案卡</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-sky-500/30 text-sky-200 border border-sky-400/40">
                      代码: {detailItem.whonetCode}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white">
                      {detailItem.mdro}
                    </span>
                  </div>
                  <div className="text-slate-400 text-[11px] mt-0.5 font-mono">
                    条码: {detailItem.barcode} | 患者: {detailItem.patientName} ({detailItem.gender}/{detailItem.age}) | 科室: {detailItem.department}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    showLocalNotice(`已发送指令打印 [${detailItem.patientName}] WHONET 耐药监测卡`);
                  }}
                  className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium flex items-center gap-1 border border-slate-700 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>打印报告</span>
                </button>

                <button
                  onClick={() => setDetailItem(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-5 bg-slate-50/50 text-xs">
              {/* Patient & Specimen Info */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <User className="w-4 h-4 text-sky-600" />
                    <span>患者与标本基本参数</span>
                  </h4>
                  <span className="text-[11px] text-slate-500 font-mono">
                    患者标识: {detailItem.patientId}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <span className="text-slate-400 block text-[11px]">姓名 / 性别 / 年龄</span>
                    <strong className="text-slate-900 text-sm">
                      {detailItem.patientName} ({detailItem.gender} / {detailItem.age})
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">送检标本</span>
                    <span className="font-bold text-slate-800">{detailItem.specimen}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">收治科室 / 来源</span>
                    <span className="text-slate-800 font-medium">
                      {detailItem.department} ({detailItem.patientSource})
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">采样 / 报告时间</span>
                    <span className="font-mono text-slate-600 text-[11px] block">
                      采: {detailItem.sampleTime}
                    </span>
                    <span className="font-mono text-slate-600 text-[11px] block">
                      报: {detailItem.reportTime}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <span className="text-slate-400 block text-[11px]">临床诊断:</span>
                  <p className="text-slate-800 font-medium mt-0.5">{detailItem.diagnosis}</p>
                </div>
              </div>

              {/* Organism & Culture Features */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <FlaskConical className="w-4 h-4 text-purple-600" />
                    <span>检出菌株与耐药表型初筛</span>
                  </h4>
                  <span className="text-[11px] text-purple-700 font-mono font-bold">
                    WHONET 编码: {detailItem.whonetCode}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-slate-400 block text-[11px]">检出微生物全称</span>
                    <strong className="text-purple-950 text-sm block mt-0.5">
                      {detailItem.organismName}
                    </strong>
                    <div className="mt-2 text-slate-600 text-[11px]">
                      培养描述：{detailItem.cultureDescription}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <div>
                      <span className="text-slate-400 block text-[10px]">超广谱β内酰胺酶</span>
                      <strong className="text-slate-800 font-bold">{detailItem.esbl}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">苯唑西林初筛</span>
                      <strong className="text-slate-800 font-bold">
                        {detailItem.oxacillinScreen}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">耐万古霉素</span>
                      <strong className="text-slate-800 font-bold">
                        {detailItem.vancomycinResistant}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">多重耐药判定</span>
                      <span className="font-bold text-rose-600">{detailItem.mdro}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Antibiotic Susceptibility Panel */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <Table2 className="w-4 h-4 text-emerald-600" />
                    <span>WHONET 规范药敏抑菌圈 / MIC 实测谱</span>
                  </h4>
                  <span className="text-[11px] text-slate-500">
                    共测试 <strong className="text-slate-900 font-mono">{detailItem.astList.length}</strong> 种抗生素
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
                  {detailItem.astList.map((ast, idx) => (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-lg border flex flex-col justify-between space-y-1 transition-all ${
                        ast.interp === 'R'
                          ? 'bg-rose-50/60 border-rose-200'
                          : ast.interp === 'I'
                          ? 'bg-amber-50/60 border-amber-200'
                          : 'bg-emerald-50/60 border-emerald-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] font-bold text-slate-500">
                          {ast.drugCode}
                        </span>
                        <span
                          className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                            ast.interp === 'R'
                              ? 'bg-rose-600 text-white'
                              : ast.interp === 'I'
                              ? 'bg-amber-600 text-white'
                              : 'bg-emerald-600 text-white'
                          }`}
                        >
                          {ast.interp === 'R'
                            ? '耐药 (R)'
                            : ast.interp === 'I'
                            ? '中介 (I)'
                            : '敏感 (S)'}
                        </span>
                      </div>
                      <div className="font-bold text-slate-900 truncate" title={ast.drugName}>
                        {ast.drugName}
                      </div>
                      <div className="font-mono text-xs text-slate-700 font-bold pt-1 border-t border-slate-200/60 flex justify-between">
                        <span className="text-slate-400 text-[10px] font-sans">测定值:</span>
                        <span>{ast.micOrDisk}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Signature Footer */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex justify-between text-slate-600">
                <div>
                  检验人员: <strong className="text-slate-800">{detailItem.tester}</strong>
                </div>
                <div>
                  审核医师: <strong className="text-slate-800">{detailItem.reviewer}</strong>
                </div>
                <div>
                  上报质控状态: <strong className="text-emerald-700">国家CARSS直报合格</strong>
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="bg-white border-t border-slate-200 px-6 py-3.5 flex justify-end gap-2 shrink-0">
              <button
                onClick={() => setDetailItem(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. EXPORT MODAL (WHONET / CARSS / CHINET 格式导出) */}
      {/* ========================================================================= */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full flex flex-col overflow-hidden">
            <div className="bg-sky-700 text-white px-5 py-3.5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2 font-bold text-sm">
                <FileSpreadsheet className="w-4 h-4" />
                <span>导出 WHONET / CARSS 耐药监测数据</span>
              </div>
              <button
                onClick={() => setShowExportModal(false)}
                className="text-sky-200 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1.5">选择导出数据标准与格式：</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                    <input
                      type="radio"
                      name="exportFmt"
                      value="whonet_sqlite"
                      checked={exportFormat === 'whonet_sqlite'}
                      onChange={() => setExportFormat('whonet_sqlite')}
                      className="text-sky-600 focus:ring-sky-500"
                    />
                    <div>
                      <strong className="text-slate-900 block">WHONET 5.6 数据库格式 (.sqlite / BacLink)</strong>
                      <span className="text-slate-500 text-[11px]">
                        完全兼容世界卫生组织 WHONET 分析软件标准菌株库。
                      </span>
                    </div>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                    <input
                      type="radio"
                      name="exportFmt"
                      value="carss_excel"
                      checked={exportFormat === 'carss_excel'}
                      onChange={() => setExportFormat('carss_excel')}
                      className="text-sky-600 focus:ring-sky-500"
                    />
                    <div>
                      <strong className="text-slate-900 block">国家细菌耐药监测网 (CARSS) 标准模板 (.xlsx)</strong>
                      <span className="text-slate-500 text-[11px]">
                        国家卫健委细菌耐药网直报标准，包含标本编号与耐药表型字段。
                      </span>
                    </div>
                  </label>

                  <label className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                    <input
                      type="radio"
                      name="exportFmt"
                      value="chinet_dbf"
                      checked={exportFormat === 'chinet_dbf'}
                      onChange={() => setExportFormat('chinet_dbf')}
                      className="text-sky-600 focus:ring-sky-500"
                    />
                    <div>
                      <strong className="text-slate-900 block">CHINET 耐药监测网规范格式 (.csv)</strong>
                      <span className="text-slate-500 text-[11px]">
                        全国真菌与细菌耐药监测网络数据接口规范。
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={maskPatientName}
                    onChange={(e) => setMaskPatientName(e.target.checked)}
                    className="rounded text-sky-600 focus:ring-sky-500"
                  />
                  <span className="text-slate-700 font-medium">患者隐私信息脱敏保护 (自动遮蔽姓名与病历号敏感部分)</span>
                </label>
                <div className="text-[11px] text-slate-400">
                  当前符合条件的待导出记录共 <strong className="text-slate-900 font-mono">{filteredRecords.length}</strong> 条（统计区间: {startDate} ~ {endDate}）。
                </div>
              </div>
            </div>

            <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex justify-end gap-2 shrink-0">
              <button
                onClick={() => setShowExportModal(false)}
                className="px-3.5 py-1.5 bg-white border border-slate-300 rounded-md text-slate-700 hover:bg-slate-100"
              >
                取消
              </button>
              <button
                onClick={handleConfirmExport}
                className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-md shadow-xs"
              >
                开始导出
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
