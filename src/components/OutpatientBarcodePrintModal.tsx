import React, { useState } from 'react';
import { OutpatientSampleItem } from '../data/outpatientData';
import { X, Printer, Check, Copy, AlertCircle, RefreshCw } from 'lucide-react';

interface OutpatientBarcodePrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  samples: OutpatientSampleItem[];
  selectedBarcodes: string[];
  patientName: string;
  patientId: string;
  onConfirmPrint: (printedBarcodes: string[]) => void;
}

export const OutpatientBarcodePrintModal: React.FC<OutpatientBarcodePrintModalProps> = ({
  isOpen,
  onClose,
  samples,
  selectedBarcodes,
  patientName,
  patientId,
  onConfirmPrint,
}) => {
  if (!isOpen) return null;

  const targetSamples = samples.filter((s) => selectedBarcodes.includes(s.barcode));
  const effectiveSamples = targetSamples.length > 0 ? targetSamples : samples.slice(0, 2);

  const [printer, setPrinter] = useState('TSC TX200 (门诊02号采血窗口)');
  const [copies, setCopies] = useState<number>(1);
  const [withReceipt, setWithReceipt] = useState(true);
  const [isPrinting, setIsPrinting] = useState(false);

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      setIsPrinting(false);
      onConfirmPrint(effectiveSamples.map((s) => s.barcode));
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-2xs flex items-center justify-center p-4">
      <div className="bg-white rounded border border-slate-300 shadow-2xl w-full max-w-3xl text-slate-800 text-[13px] select-none flex flex-col overflow-hidden max-h-[92vh]">
        {/* 顶部标题栏 */}
        <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-sky-600" />
            <h2 className="text-sm font-bold text-slate-900">打印门诊标本条码标签</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 核心双栏预览与参数设置 */}
        <div className="p-5 overflow-y-auto grid grid-cols-1 md:grid-cols-12 gap-5 flex-1">
          {/* 左侧：仿真标签打印预览 */}
          <div className="md:col-span-7 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span className="font-semibold text-slate-800">50mm × 30mm 热敏胶贴标签预览</span>
              <span className="text-[11px] text-slate-400">共 {effectiveSamples.length} 张标本签</span>
            </div>

            <div className="space-y-3">
              {effectiveSamples.map((item, idx) => (
                <div
                  key={item.barcode || idx}
                  className="border-2 border-slate-800 rounded bg-white p-3 font-mono text-xs shadow-xs relative overflow-hidden"
                >
                  {/* 色标顶边条 */}
                  <div
                    className={`h-1.5 -mx-3 -mt-3 mb-2 ${
                      item.container.includes('紫') || item.testItem.includes('血常规')
                        ? 'bg-purple-600'
                        : item.container.includes('黄') || item.testItem.includes('生化')
                        ? 'bg-amber-500'
                        : item.container.includes('绿')
                        ? 'bg-emerald-500'
                        : item.container.includes('蓝')
                        ? 'bg-sky-500'
                        : 'bg-yellow-500'
                    }`}
                  />

                  {/* 医院与窗口 */}
                  <div className="flex items-center justify-between border-b border-slate-300 pb-1 mb-1 text-[11px]">
                    <span className="font-bold font-sans text-slate-900">市中心医院 · 门诊采血</span>
                    <span className="text-slate-600 font-sans">02号采血台</span>
                  </div>

                  {/* 患者与就诊号 */}
                  <div className="flex items-center justify-between">
                    <div>
                      <strong className="text-sm font-sans text-slate-900 mr-1.5">
                        {item.name || patientName}
                      </strong>
                      <span className="text-slate-600 font-sans">
                        {item.gender} · {item.age}
                      </span>
                    </div>
                    <span className="text-slate-500 font-mono text-[11px]">
                      门诊号: {item.patientId || patientId}
                    </span>
                  </div>

                  {/* 检验项目 */}
                  <div className="text-slate-900 font-sans font-bold my-1 text-xs">
                    {item.testItem}
                  </div>

                  {/* 一维条码图形仿真 */}
                  <div className="bg-slate-50 border border-slate-200 p-1.5 rounded flex flex-col items-center my-1.5">
                    <div className="h-8 w-full flex items-center justify-center gap-0.5 overflow-hidden">
                      {Array.from({ length: 42 }).map((_, i) => (
                        <div
                          key={i}
                          className={`h-full ${
                            i % 2 === 0 ? 'bg-slate-950' : 'bg-transparent'
                          } ${i % 7 === 0 ? 'w-1' : i % 3 === 0 ? 'w-0.5' : 'w-px'}`}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-mono font-bold tracking-widest text-slate-900 mt-1">
                      *{item.barcode}*
                    </span>
                  </div>

                  {/* 底部标本种类与送达提示 */}
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-sans">
                    <span>
                      {item.specimen} · {item.container}
                    </span>
                    <span>2026-10-26 10:15</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 右侧：打印机参数与出纸控制 */}
          <div className="md:col-span-5 border-l border-slate-200 pl-5 space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-medium mb-1">选择热敏条码打印机</label>
              <select
                value={printer}
                onChange={(e) => setPrinter(e.target.value)}
                className="w-full h-8 px-2 border border-slate-300 rounded bg-white text-xs focus:outline-none focus:border-sky-600"
              >
                <option value="TSC TX200 (门诊02号采血窗口)">TSC TX200 (门诊02号采血窗口 - 联机正常)</option>
                <option value="Zebra ZD888T (门诊急查台)">Zebra ZD888T (门诊急查台)</option>
                <option value="Bixolon SLP-TX400 (备份机)">Bixolon SLP-TX400 (备份机)</option>
              </select>
              <div className="mt-1 flex items-center gap-1.5 text-emerald-600 text-[11px]">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>打印机状态：就绪 (感应器检测正常)</span>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">单管打印联数</label>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setCopies(num)}
                    className={`h-7 border rounded text-xs transition-colors ${
                      copies === num
                        ? 'border-sky-600 bg-sky-50 text-sky-700 font-bold'
                        : 'border-slate-300 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    {num} 联
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                <input
                  type="checkbox"
                  checked={withReceipt}
                  onChange={(e) => setWithReceipt(e.target.checked)}
                  className="w-3.5 h-3.5 rounded text-sky-600 focus:ring-0"
                />
                <span className="font-medium">同时打印患者取报告回执单</span>
              </label>
              <p className="text-[11px] text-slate-400 pl-5.5">
                回执单注明报告可取时间、急查标志及微信公众号扫码查结果二维码。
              </p>
            </div>

            <div className="bg-amber-50 border border-amber-200 p-2.5 rounded text-amber-900 text-[11px] leading-relaxed">
              <strong>采血护士核对提示：</strong>
              出标后请务必核对患者姓名、就诊卡号与试管颜色，轻柔贴于管身刻度线平行处，严禁遮挡透明观察窗。
            </div>
          </div>
        </div>

        {/* 底部按钮栏 */}
        <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="h-8 px-4 border border-slate-300 rounded text-xs text-slate-700 hover:bg-slate-100"
          >
            取消
          </button>
          <button
            type="button"
            disabled={isPrinting}
            onClick={handlePrint}
            className="h-8 px-6 bg-slate-900 hover:bg-slate-800 active:bg-black text-white rounded text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors"
          >
            {isPrinting ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-sky-400" />
                <span>正在向打印机发送指令...</span>
              </>
            ) : (
              <>
                <Printer className="w-3.5 h-3.5 text-sky-400" />
                <span>立即打印 ({effectiveSamples.length * copies} 张标签)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
