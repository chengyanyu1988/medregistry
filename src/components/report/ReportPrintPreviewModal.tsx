import React, { useState } from 'react';
import { LabReport } from '../../types/report';
import { X, Printer, Download, Eye, FileCheck, Check, ShieldCheck, QrCode } from 'lucide-react';

interface ReportPrintPreviewModalProps {
  report: LabReport | null;
  onClose: () => void;
  onPrintSuccess?: (reportId: string) => void;
}

export const ReportPrintPreviewModal: React.FC<ReportPrintPreviewModalProps> = ({
  report,
  onClose,
  onPrintSuccess,
}) => {
  const [paperFormat, setPaperFormat] = useState<'A4' | 'A5'>('A4');
  const [isPrinting, setIsPrinting] = useState(false);
  const [printSuccessAlert, setPrintSuccessAlert] = useState(false);

  if (!report) return null;

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      setIsPrinting(false);
      setPrintSuccessAlert(true);
      if (onPrintSuccess) onPrintSuccess(report.id);
      setTimeout(() => setPrintSuccessAlert(false), 3000);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-3 md:p-6 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[95vh] flex flex-col overflow-hidden animate-scaleIn">
        {/* Top Control Bar */}
        <div className="bg-slate-800 text-white px-5 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <Printer className="w-5 h-5 text-sky-400" />
            <div>
              <h3 className="font-bold text-sm">检验报告单 - 打印预览</h3>
              <p className="text-[11px] text-slate-300">
                标准格式A4检验报告单 · 符合国家卫健委及CAP/ISO15189质控规范
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-slate-700 p-0.5 rounded text-xs">
              <button
                onClick={() => setPaperFormat('A4')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  paperFormat === 'A4' ? 'bg-sky-600 text-white font-bold' : 'text-slate-300 hover:text-white'
                }`}
              >
                A4 整页
              </button>
              <button
                onClick={() => setPaperFormat('A5')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  paperFormat === 'A5' ? 'bg-sky-600 text-white font-bold' : 'text-slate-300 hover:text-white'
                }`}
              >
                A5 半页
              </button>
            </div>

            <button
              onClick={handlePrint}
              disabled={isPrinting}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 text-white rounded text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>{isPrinting ? '正在向打印机发送...' : '立即打印'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Print Notification */}
        {printSuccessAlert && (
          <div className="bg-emerald-600 text-white px-4 py-2 text-xs flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4" />
              <span>报告单已成功发送至激光打印机！打印状态已更新为【已打印】。</span>
            </span>
          </div>
        )}

        {/* Realistic Hospital Report Sheet Canvas */}
        <div className="flex-1 overflow-y-auto bg-slate-200 p-6 flex justify-center">
          <div
            className={`bg-white shadow-xl border border-slate-300 p-8 text-slate-900 transition-all ${
              paperFormat === 'A4' ? 'w-[720px] min-h-[960px]' : 'w-[640px] min-h-[720px]'
            } flex flex-col justify-between`}
          >
            {/* 1. Header */}
            <div>
              <div className="text-center border-b-2 border-slate-900 pb-3 relative">
                <h1 className="text-xl font-bold tracking-widest text-slate-900">
                  市 中 心 医 院 检 验 科
                </h1>
                <h2 className="text-base font-semibold tracking-wider text-slate-800 mt-1">
                  临 床 检 验 报 告 单
                </h2>
                <div className="text-[11px] text-slate-500 mt-1">
                  （CLINICAL LABORATORY EXAMINATION REPORT）
                </div>

                {/* Right Top Barcode preview */}
                <div className="absolute right-0 top-0 text-right">
                  <div className="font-mono text-[10px] text-slate-500">条码号 / 标本号</div>
                  <div className="font-mono font-bold text-xs tracking-wider">{report.barcode}</div>
                  <div className="h-6 w-24 bg-slate-900/90 ml-auto mt-0.5 flex items-center justify-center text-[9px] text-white font-mono">
                    ||||| | ||||| ||
                  </div>
                </div>
              </div>

              {/* 2. Patient Meta Grid */}
              <div className="grid grid-cols-4 gap-y-2 gap-x-4 py-3 text-xs border-b border-slate-800">
                <div>
                  <span className="text-slate-600">姓名：</span>
                  <span className="font-bold text-slate-900 text-sm">{report.patientName}</span>
                </div>
                <div>
                  <span className="text-slate-600">性别：</span>
                  <span className="font-medium">{report.gender}</span>
                </div>
                <div>
                  <span className="text-slate-600">年龄：</span>
                  <span className="font-medium">{report.age}</span>
                </div>
                <div>
                  <span className="text-slate-600">病历号：</span>
                  <span className="font-mono font-medium">{report.medicalRecordNo}</span>
                </div>

                <div>
                  <span className="text-slate-600">科室：</span>
                  <span className="font-medium">{report.department}</span>
                </div>
                <div>
                  <span className="text-slate-600">床号：</span>
                  <span className="font-medium">{report.bedNo}</span>
                </div>
                <div>
                  <span className="text-slate-600">标本种类：</span>
                  <span className="font-medium">{report.sampleType}</span>
                </div>
                <div>
                  <span className="text-slate-600">患者来源：</span>
                  <span className="font-medium">{report.patientSource}</span>
                </div>

                <div className="col-span-4">
                  <span className="text-slate-600">临床诊断：</span>
                  <span className="font-medium text-slate-800">{report.clinicalDiagnosis}</span>
                </div>
              </div>

              {/* 3. Items Result Table */}
              <div className="mt-3">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b-2 border-slate-800 text-slate-800 font-bold">
                      <th className="py-1.5 px-2 w-10 text-center">序号</th>
                      <th className="py-1.5 px-2">检验项目名称</th>
                      <th className="py-1.5 px-2 w-20 font-mono">缩写</th>
                      <th className="py-1.5 px-2 w-24 text-right font-mono">结果</th>
                      <th className="py-1.5 px-2 w-14 text-center">提示</th>
                      <th className="py-1.5 px-2 w-28 font-mono">参考区间</th>
                      <th className="py-1.5 px-2 w-14 font-mono">单位</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {report.items.map((it) => (
                      <tr key={it.id} className="hover:bg-slate-50">
                        <td className="py-1.5 px-2 text-center text-slate-500 font-mono">
                          {it.orderNum}
                        </td>
                        <td className="py-1.5 px-2 font-medium text-slate-900">{it.name}</td>
                        <td className="py-1.5 px-2 font-mono text-slate-700">{it.code}</td>
                        <td className="py-1.5 px-2 text-right font-mono font-bold text-slate-900">
                          {it.result}
                        </td>
                        <td className="py-1.5 px-2 text-center font-bold">
                          {it.status === 'up' && <span className="text-rose-600 font-bold">↑</span>}
                          {it.status === 'down' && <span className="text-sky-600 font-bold">↓</span>}
                          {it.status === 'critical' && <span className="text-rose-600 font-bold">⚠️危</span>}
                          {it.status === 'normal' && <span className="text-slate-300">-</span>}
                        </td>
                        <td className="py-1.5 px-2 font-mono text-slate-600">{it.referenceRange}</td>
                        <td className="py-1.5 px-2 font-mono text-slate-600">{it.unit}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 4. Footer, Stamp, Signatures */}
            <div className="pt-4 border-t-2 border-slate-800 mt-6 text-xs relative">
              {/* Doctor Electronic Seal SVG (Authentic red circular stamp) */}
              <div className="absolute right-12 bottom-12 opacity-80 pointer-events-none">
                <svg width="120" height="120" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="54" fill="none" stroke="#dc2626" strokeWidth="2.5" />
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#dc2626" strokeWidth="1" strokeDasharray="2 2" />
                  {/* Circular curved text simulation */}
                  <text x="60" y="32" textAnchor="middle" fill="#dc2626" fontSize="10" fontWeight="bold">
                    市中心医院检验专用章
                  </text>
                  {/* Star */}
                  <text x="60" y="66" textAnchor="middle" fill="#dc2626" fontSize="24">
                    ★
                  </text>
                  <text x="60" y="94" textAnchor="middle" fill="#dc2626" fontSize="9" fontWeight="bold">
                    检验技术审核有效
                  </text>
                </svg>
              </div>

              {/* Time stamps */}
              <div className="grid grid-cols-3 gap-2 text-slate-600 text-[11px] pb-3 border-b border-dashed border-slate-300">
                <div>采样时间：{report.sampleTime}</div>
                <div>接收时间：{report.receiveTime}</div>
                <div>审核时间：{report.auditTime}</div>
              </div>

              {/* Signatures and Disclaimer */}
              <div className="flex items-center justify-between pt-2.5">
                <div className="flex items-center gap-6">
                  <div>
                    <span className="text-slate-600">检验者：</span>
                    <span className="font-bold underline decoration-slate-400">{report.inspector}</span>
                  </div>
                  <div>
                    <span className="text-slate-600">审核医师：</span>
                    <span className="font-bold underline decoration-slate-400">{report.auditor}</span>
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 text-right">
                  注：本检验报告仅对此份送检标本负责。若有疑义请在发单24小时内复询。
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Close */}
        <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            打印机就绪 · 纸张尺寸：{paperFormat} · 打印计数：第 {report.printCount + 1} 次
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded font-semibold text-xs"
            >
              关闭预览
            </button>
            <button
              onClick={handlePrint}
              disabled={isPrinting}
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-semibold text-xs flex items-center gap-1.5 shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>发送打印</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
