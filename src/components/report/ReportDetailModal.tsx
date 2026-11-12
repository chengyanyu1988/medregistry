import React, { useState } from 'react';
import { LabReport, TestItemDetail } from '../../types/report';
import {
  X,
  Printer,
  FileSpreadsheet,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Activity,
  User,
  Building2,
  FileText,
  Clock,
  Eye,
  ShieldCheck,
  Stethoscope
} from 'lucide-react';
import { ClinicalSignificanceModal } from './ClinicalSignificanceModal';
import { HistoricalTrendChartView } from './HistoricalTrendChartView';
import { InstrumentGraphicResultView } from './InstrumentGraphicResultView';

interface ReportDetailModalProps {
  report: LabReport | null;
  onClose: () => void;
  onPrintPreview: (report: LabReport) => void;
  onPrintSingle: (report: LabReport) => void;
}

export const ReportDetailModal: React.FC<ReportDetailModalProps> = ({
  report,
  onClose,
  onPrintPreview,
  onPrintSingle,
}) => {
  const [activeBottomTab, setActiveBottomTab] = useState<'history' | 'graphics'>('history');
  const [selectedClinicalItem, setSelectedClinicalItem] = useState<TestItemDetail | null>(null);

  if (!report) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 md:p-6 animate-fadeIn">
        <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden animate-scaleIn">
          {/* 1. Modal Top Bar */}
          <div className="bg-linear-to-r from-sky-800 to-indigo-900 text-white px-5 py-3.5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-lg">
                <FileText className="w-5 h-5 text-sky-200" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-base tracking-tight">检验报告单明细追溯</h3>
                  <span className="px-2 py-0.5 rounded-full bg-sky-500/30 text-sky-100 text-xs font-mono">
                    条码: {report.barcode}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      report.status === '已审核'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                        : report.status === '已核收'
                        ? 'bg-sky-500/20 text-sky-300 border border-sky-400/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
                    }`}
                  >
                    {report.status}
                  </span>
                  {report.isUrgent && (
                    <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[11px] font-bold animate-pulse">
                      急查
                    </span>
                  )}
                </div>
                <p className="text-xs text-sky-100/90 mt-0.5">
                  市中心医院检验医学科 · {report.department} · {report.patientName} ({report.gender} {report.age})
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onPrintPreview(report)}
                className="px-3 py-1.5 bg-sky-700 hover:bg-sky-600 text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors border border-sky-500/40"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>打印预览</span>
              </button>
              <button
                onClick={() => onPrintSingle(report)}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>直接打印</span>
              </button>
              <button
                onClick={onClose}
                className="p-1.5 text-sky-200 hover:text-white rounded-lg hover:bg-white/10 transition-colors ml-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* 2. Patient Basic Info Summary Banner */}
          <div className="bg-slate-50 border-b border-slate-200 p-3.5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-xs shrink-0">
            <div>
              <span className="text-slate-500 block">患者姓名 / 性别</span>
              <span className="font-bold text-slate-900 text-sm">
                {report.patientName} <span className="text-xs font-normal text-slate-600">({report.gender} {report.age})</span>
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">病历号 / 床号</span>
              <span className="font-mono font-bold text-slate-800">
                {report.medicalRecordNo} <span className="font-sans text-sky-700">({report.bedNo})</span>
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">送检科室 / 来源</span>
              <span className="font-semibold text-slate-800">
                {report.department} · {report.patientSource}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">标本种类 / 项目</span>
              <span className="font-semibold text-slate-800 truncate block">
                {report.sampleType} · {report.testCategory}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">检验医师 / 审核者</span>
              <span className="font-medium text-slate-800">
                {report.inspector} / {report.auditor}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">审核时间</span>
              <span className="font-mono text-slate-800">{report.auditTime}</span>
            </div>
          </div>

          {/* 3. Modal Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            {/* Table of Test Items (Corresponding directly to screenshot right table) */}
            <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-2xs">
              <div className="p-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-xs">检验项目结果列表</span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-mono">
                    共 {report.items.length} 项指标
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <span className="text-rose-600 font-bold">↑</span> 高于参考限
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="text-sky-600 font-bold">↓</span> 低于参考限
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="text-rose-600 font-bold">⚠️</span> 危急值
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold text-[11px]">
                    <tr>
                      <th className="py-2.5 px-3 w-12 text-center">序号</th>
                      <th className="py-2.5 px-3 w-28 font-mono">英文名称</th>
                      <th className="py-2.5 px-4">检验项目</th>
                      <th className="py-2.5 px-3 w-28 text-right font-mono">检验结果</th>
                      <th className="py-2.5 px-2 w-16 text-center">状态</th>
                      <th className="py-2.5 px-3 w-32 font-mono">参考范围</th>
                      <th className="py-2.5 px-2 w-16">单位</th>
                      <th className="py-2.5 px-3 w-24 text-center">临床意义</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {report.items.map((item) => (
                      <tr
                        key={item.id}
                        className={`hover:bg-sky-50/40 transition-colors ${
                          item.status === 'up'
                            ? 'bg-rose-50/20'
                            : item.status === 'down'
                            ? 'bg-sky-50/20'
                            : item.status === 'critical'
                            ? 'bg-rose-100/40 font-bold'
                            : ''
                        }`}
                      >
                        <td className="py-2 px-3 text-center text-slate-500 font-mono">
                          {item.orderNum}
                        </td>
                        <td className="py-2 px-3 font-mono font-bold text-slate-800">
                          {item.code}
                        </td>
                        <td className="py-2 px-4 font-semibold text-slate-900">
                          {item.name}
                        </td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-sm">
                          <span
                            className={
                              item.status === 'up' || item.status === 'critical'
                                ? 'text-rose-600'
                                : item.status === 'down'
                                ? 'text-sky-600'
                                : 'text-slate-900'
                            }
                          >
                            {item.result}
                          </span>
                        </td>
                        <td className="py-2 px-2 text-center">
                          {item.status === 'up' && (
                            <span className="font-bold text-rose-600 text-sm">↑</span>
                          )}
                          {item.status === 'down' && (
                            <span className="font-bold text-sky-600 text-sm">↓</span>
                          )}
                          {item.status === 'critical' && (
                            <span className="px-1.5 py-0.5 rounded bg-rose-600 text-white text-[10px] font-bold">
                              ⚠️危急
                            </span>
                          )}
                          {item.status === 'normal' && (
                            <span className="text-slate-300">-</span>
                          )}
                        </td>
                        <td className="py-2 px-3 font-mono text-slate-600 text-[11px]">
                          {item.referenceRange}
                        </td>
                        <td className="py-2 px-2 text-slate-600 font-mono text-[11px]">
                          {item.unit}
                        </td>
                        <td className="py-2 px-3 text-center">
                          <button
                            onClick={() => setSelectedClinicalItem(item)}
                            className="px-2 py-0.5 bg-sky-50 hover:bg-sky-100 text-sky-700 hover:text-sky-800 border border-sky-200 rounded text-[11px] font-semibold transition-colors"
                          >
                            查看
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 4. Bottom Tab Switcher (历史对比 / 图形结果) */}
            <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-2xs">
              <div className="bg-slate-50 border-b border-slate-200 px-4 pt-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveBottomTab('history')}
                    className={`px-4 py-2 font-bold text-xs rounded-t-lg transition-all border-b-2 ${
                      activeBottomTab === 'history'
                        ? 'bg-white text-sky-700 border-sky-600 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 border-transparent'
                    }`}
                  >
                    历史对比
                  </button>
                  <button
                    onClick={() => setActiveBottomTab('graphics')}
                    className={`px-4 py-2 font-bold text-xs rounded-t-lg transition-all border-b-2 ${
                      activeBottomTab === 'graphics'
                        ? 'bg-white text-sky-700 border-sky-600 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 border-transparent'
                    }`}
                  >
                    图形结果
                  </button>
                </div>

                <div className="text-[11px] text-slate-400 font-mono pb-2">
                  {activeBottomTab === 'history' ? '患者动态趋势随访' : '全自动分析仪图谱 (HPLT/HRBC/SWDF/SWNR)'}
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-4">
                {activeBottomTab === 'history' && <HistoricalTrendChartView report={report} />}
                {activeBottomTab === 'graphics' && <InstrumentGraphicResultView report={report} />}
              </div>
            </div>
          </div>

          {/* 5. Modal Footer */}
          <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
            <div className="text-[11px] text-slate-500 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>电子签名与审签时间戳已数字加密上链存证</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded font-semibold text-xs transition-colors"
              >
                关闭
              </button>
              <button
                type="button"
                onClick={() => onPrintPreview(report)}
                className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded font-semibold text-xs flex items-center gap-1.5 shadow-2xs"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>进入打印预览</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Modal: Clinical Significance Interpretation */}
      <ClinicalSignificanceModal
        item={selectedClinicalItem}
        onClose={() => setSelectedClinicalItem(null)}
      />
    </>
  );
};
