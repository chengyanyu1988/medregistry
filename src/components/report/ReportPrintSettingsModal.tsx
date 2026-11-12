import React, { useState } from 'react';
import { PrintSettingsState } from '../../types/report';
import { X, Sliders, Printer, Save, Check, RefreshCw } from 'lucide-react';

interface ReportPrintSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: PrintSettingsState) => void;
  initialSettings?: Partial<PrintSettingsState>;
}

export const ReportPrintSettingsModal: React.FC<ReportPrintSettingsModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialSettings,
}) => {
  const [settings, setSettings] = useState<PrintSettingsState>({
    printerName: 'HP LaserJet Enterprise M507 (检验科主打印机)',
    paperSize: 'A4',
    orientation: 'portrait',
    autoPrintOnAudit: true,
    printBarcode: true,
    showHospitalLogo: true,
    showDoctorSeal: true,
    topMargin: 12,
    bottomMargin: 10,
    copies: 1,
    colorMode: 'color',
    ...initialSettings,
  });

  const [savedAlert, setSavedAlert] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(settings);
    setSavedAlert(true);
    setTimeout(() => {
      setSavedAlert(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-scaleIn">
        {/* Header */}
        <div className="bg-slate-800 text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Sliders className="w-4 h-4 text-sky-400" />
            <div>
              <h3 className="font-bold text-sm">报告打印中心 - 参数配置</h3>
              <p className="text-[11px] text-slate-300">
                配置检验报告物理打印机驱动、纸张版面与自动化打印规则
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {savedAlert && (
          <div className="bg-emerald-600 text-white px-4 py-2 text-xs flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>打印参数配置已保存至本地客户端配置文件。</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* Printer Selection */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              默认连接打印机 *
            </label>
            <select
              value={settings.printerName}
              onChange={(e) => setSettings({ ...settings, printerName: e.target.value })}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded font-medium text-slate-800 focus:outline-none focus:border-sky-500"
            >
              <option value="HP LaserJet Enterprise M507 (检验科主打印机)">
                HP LaserJet Enterprise M507 (检验科主打印机 - 推荐)
              </option>
              <option value="Canon LBP2900+ (急诊快速报告打印机)">
                Canon LBP2900+ (急诊快速报告打印机)
              </option>
              <option value="Epson EcoTank L3150 (微生物彩色药敏打印机)">
                Epson EcoTank L3150 (微生物彩色药敏打印机)
              </option>
              <option value="Zebra ZD888 (急诊条码/标签热敏打印机)">
                Zebra ZD888 (急诊条码/标签热敏打印机)
              </option>
            </select>
          </div>

          {/* Paper Size & Layout */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                纸张规格
              </label>
              <select
                value={settings.paperSize}
                onChange={(e) =>
                  setSettings({ ...settings, paperSize: e.target.value as any })
                }
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded"
              >
                <option value="A4">A4 国际标准整页 (210×297mm)</option>
                <option value="A5">A5 门诊经济半页 (148×210mm)</option>
                <option value="A4-double">A4 双栏并列综合格式</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                版面方向
              </label>
              <select
                value={settings.orientation}
                onChange={(e) =>
                  setSettings({ ...settings, orientation: e.target.value as any })
                }
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded"
              >
                <option value="portrait">纵向排版 (标准报告单)</option>
                <option value="landscape">横向排版 (多项目宽表)</option>
              </select>
            </div>
          </div>

          {/* Margins & Copies */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                上边距 (mm)
              </label>
              <input
                type="number"
                min={0}
                max={50}
                value={settings.topMargin}
                onChange={(e) =>
                  setSettings({ ...settings, topMargin: Number(e.target.value) })
                }
                className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                下边距 (mm)
              </label>
              <input
                type="number"
                min={0}
                max={50}
                value={settings.bottomMargin}
                onChange={(e) =>
                  setSettings({ ...settings, bottomMargin: Number(e.target.value) })
                }
                className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                默认打印份数
              </label>
              <input
                type="number"
                min={1}
                max={5}
                value={settings.copies}
                onChange={(e) =>
                  setSettings({ ...settings, copies: Number(e.target.value) })
                }
                className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono"
              />
            </div>
          </div>

          {/* Toggle Switches */}
          <div className="space-y-2.5 pt-2 border-t border-slate-200">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={settings.autoPrintOnAudit}
                onChange={(e) =>
                  setSettings({ ...settings, autoPrintOnAudit: e.target.checked })
                }
                className="w-4 h-4 text-sky-600 rounded border-slate-300 focus:ring-sky-500"
              />
              <span className="font-semibold text-slate-800">
                医师审核通过后自动静默触发物理打印 (急诊推荐开启)
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={settings.showDoctorSeal}
                onChange={(e) =>
                  setSettings({ ...settings, showDoctorSeal: e.target.checked })
                }
                className="w-4 h-4 text-sky-600 rounded border-slate-300 focus:ring-sky-500"
              />
              <span className="text-slate-700">
                附带加盖电子防伪检验专用红章及数字签名防伪标识
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={settings.printBarcode}
                onChange={(e) =>
                  setSettings({ ...settings, printBarcode: e.target.checked })
                }
                className="w-4 h-4 text-sky-600 rounded border-slate-300 focus:ring-sky-500"
              />
              <span className="text-slate-700">
                报告右上角打印Code128高精度一维条形码
              </span>
            </label>
          </div>

          {/* Footer Actions */}
          <div className="bg-slate-50 -mx-5 -mb-5 px-5 py-3 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={() =>
                setSettings({
                  printerName: 'HP LaserJet Enterprise M507 (检验科主打印机)',
                  paperSize: 'A4',
                  orientation: 'portrait',
                  autoPrintOnAudit: true,
                  printBarcode: true,
                  showHospitalLogo: true,
                  showDoctorSeal: true,
                  topMargin: 12,
                  bottomMargin: 10,
                  copies: 1,
                  colorMode: 'color',
                })
              }
              className="text-slate-500 hover:text-slate-800 flex items-center gap-1 text-[11px]"
            >
              <RefreshCw className="w-3 h-3" />
              <span>恢复默认配置</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-semibold text-xs"
              >
                取消
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded font-semibold text-xs flex items-center gap-1.5 shadow-2xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>保存并应用配置</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
