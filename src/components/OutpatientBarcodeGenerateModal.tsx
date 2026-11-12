import React, { useState } from 'react';
import { OutpatientSampleItem } from '../data/outpatientData';
import { X, Barcode, CheckCircle2, FlaskConical, Sliders, Printer } from 'lucide-react';

interface OutpatientBarcodeGenerateModalProps {
  isOpen: boolean;
  onClose: () => void;
  samples: OutpatientSampleItem[];
  selectedBarcodes: string[];
  patientName: string;
  patientId: string;
  onConfirmGenerate: (generatedList: OutpatientSampleItem[]) => void;
}

export const OutpatientBarcodeGenerateModal: React.FC<OutpatientBarcodeGenerateModalProps> = ({
  isOpen,
  onClose,
  samples,
  selectedBarcodes,
  patientName,
  patientId,
  onConfirmGenerate,
}) => {
  if (!isOpen) return null;

  const targetSamples = samples.filter((s) => selectedBarcodes.includes(s.barcode));
  const effectiveSamples = targetSamples.length > 0 ? targetSamples : samples.slice(0, 3);

  // 条码生成策略
  const [symbology, setSymbology] = useState('Code 128 (标准医用条码)');
  const [autoCombineTubes, setAutoCombineTubes] = useState(true);
  const [prefix, setPrefix] = useState('4234');

  const handleGenerate = () => {
    onConfirmGenerate(effectiveSamples);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-2xs flex items-center justify-center p-4">
      <div className="bg-white rounded border border-slate-300 shadow-2xl w-full max-w-2xl text-slate-800 text-[13px] select-none flex flex-col overflow-hidden max-h-[90vh]">
        {/* 顶部标题栏 */}
        <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
          <div className="flex items-center gap-2">
            <Barcode className="w-5 h-5 text-sky-600" />
            <h2 className="text-sm font-bold text-slate-900">生成标本条码与智能分管</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 主体内容 */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* 患者卡片微缩信息 */}
          <div className="bg-sky-50/70 border border-sky-100 p-3 rounded flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <span className="font-bold text-slate-900 text-sm">{patientName}</span>
              <span className="text-slate-500 font-mono">就诊号: {patientId}</span>
              <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-[11px]">
                门诊已缴费
              </span>
            </div>
            <span className="text-sky-700 font-medium">共 {effectiveSamples.length} 项待生成采血管条码</span>
          </div>

          {/* 分管条码分配预览表 */}
          <div className="border border-slate-200 rounded overflow-hidden">
            <div className="bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 border-b border-slate-200 flex items-center justify-between">
              <span>检验项目与采血管型智能分配</span>
              <span className="text-[11px] text-slate-400 font-normal">根据国家临床检验标准自动合并同管标本</span>
            </div>

            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-100/70 text-slate-600 font-medium border-b border-slate-200">
                <tr>
                  <th className="px-3 py-2">分配条码号</th>
                  <th className="px-3 py-2">申请检验项目</th>
                  <th className="px-3 py-2">标本</th>
                  <th className="px-3 py-2">分配容器 / 管帽色标</th>
                  <th className="px-3 py-2 text-center">状态</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {effectiveSamples.map((item, idx) => {
                  let tubeColorDot = 'bg-purple-500';
                  let tubeDesc = '紫头管(EDTA-K2抗凝)';
                  if (item.specimen === '血清' || item.testItem.includes('生化')) {
                    tubeColorDot = 'bg-amber-500';
                    tubeDesc = '黄头管(促凝胶SST)';
                  } else if (item.specimen === '血浆' || item.testItem.includes('凝血')) {
                    tubeColorDot = 'bg-sky-500';
                    tubeDesc = '浅蓝头管(枸橼酸钠)';
                  } else if (item.specimen === '尿液') {
                    tubeColorDot = 'bg-yellow-400';
                    tubeDesc = '黄色带刻度尿管';
                  }

                  return (
                    <tr key={item.barcode || idx} className="hover:bg-slate-50/80">
                      <td className="px-3 py-2 font-mono font-bold text-sky-700">
                        {item.barcode || `42342350${idx + 1}`}
                      </td>
                      <td className="px-3 py-2 font-medium text-slate-900">{item.testItem}</td>
                      <td className="px-3 py-2 text-slate-600">{item.specimen}</td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2.5 h-2.5 rounded-full ${tubeColorDot}`} />
                          <span className="text-slate-700">{tubeDesc}</span>
                        </div>
                      </td>
                      <td className="px-3 py-2 text-center">
                        <span className="text-emerald-600 font-medium inline-flex items-center gap-0.5 text-[11px]">
                          <CheckCircle2 className="w-3 h-3" />
                          已就绪
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* 生成规则配置选项 */}
          <div className="border border-slate-200 rounded p-3 bg-slate-50/50 space-y-2 text-xs">
            <div className="font-semibold text-slate-800 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-slate-500" />
              <span>条形码编码规范参数</span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-slate-600">
              <div>
                <label className="block text-[11px] text-slate-500 mb-0.5">条码制式</label>
                <select
                  value={symbology}
                  onChange={(e) => setSymbology(e.target.value)}
                  className="w-full h-7 px-2 border border-slate-300 rounded bg-white text-xs"
                >
                  <option value="Code 128 (标准医用条码)">Code 128 (高密度标准医用一维码)</option>
                  <option value="Code 39">Code 39</option>
                  <option value="QR Code 二维码">QR Code (门诊智能自助取单)</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] text-slate-500 mb-0.5">标本号前缀</label>
                <input
                  type="text"
                  value={prefix}
                  onChange={(e) => setPrefix(e.target.value)}
                  className="w-full h-7 px-2 border border-slate-300 rounded bg-white text-xs font-mono"
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                <input
                  type="checkbox"
                  checked={autoCombineTubes}
                  onChange={(e) => setAutoCombineTubes(e.target.checked)}
                  className="w-3.5 h-3.5 rounded text-sky-600 focus:ring-0"
                />
                <span className="font-medium">启用智能同标本合管机制 (减少患者抽血针数与采血量)</span>
              </label>
            </div>
          </div>
        </div>

        {/* 底部按钮 */}
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
            onClick={handleGenerate}
            className="h-8 px-5 bg-sky-600 hover:bg-sky-700 text-white rounded text-xs font-semibold flex items-center gap-1.5 shadow-xs"
          >
            <Barcode className="w-3.5 h-3.5" />
            <span>确认分配并生成条码 ({effectiveSamples.length}管)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
