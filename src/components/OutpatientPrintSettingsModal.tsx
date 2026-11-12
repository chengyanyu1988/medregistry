import React, { useState } from 'react';
import { X, Settings, Check, Sliders, Volume2, ShieldCheck, Printer } from 'lucide-react';

interface OutpatientPrintSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: { printer: string; labelSize: string; autoPrint: boolean }) => void;
}

export const OutpatientPrintSettingsModal: React.FC<OutpatientPrintSettingsModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'printer' | 'paper' | 'auto'>('printer');

  // 配置项
  const [printerModel, setPrinterModel] = useState('TSC TX200 (门诊02号采血台)');
  const [portType, setPortType] = useState('USB001');
  const [ipAddress, setIpAddress] = useState('192.168.10.125');
  const [labelSize, setLabelSize] = useState('50mm × 30mm');
  const [darkness, setDarkness] = useState(10);
  const [orientation, setOrientation] = useState<'normal' | 'reverse'>('normal');
  const [autoPrintOnScan, setAutoPrintOnScan] = useState(true);
  const [printReceipt, setPrintReceipt] = useState(true);
  const [beepOnSuccess, setBeepOnSuccess] = useState(true);
  const [testPrintSuccess, setTestPrintSuccess] = useState(false);

  const handleTestPrint = () => {
    setTestPrintSuccess(true);
    setTimeout(() => setTestPrintSuccess(false), 3000);
  };

  const handleSave = () => {
    onSave({
      printer: printerModel,
      labelSize,
      autoPrint: autoPrintOnScan,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-2xs flex items-center justify-center p-4">
      <div className="bg-white rounded border border-slate-300 shadow-2xl w-full max-w-xl text-slate-800 text-[13px] select-none flex flex-col overflow-hidden max-h-[92vh]">
        {/* 顶部标题栏 */}
        <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-sky-600" />
            <h2 className="text-sm font-bold text-slate-900">门诊采血条码打印机与硬件配置</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 标签页导航 */}
        <div className="px-5 pt-3 border-b border-slate-200 bg-white flex gap-6 text-xs font-medium">
          <button
            onClick={() => setActiveTab('printer')}
            className={`pb-2 transition-colors relative ${
              activeTab === 'printer'
                ? 'text-sky-600 border-b-2 border-sky-600 font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            打印机端口
          </button>
          <button
            onClick={() => setActiveTab('paper')}
            className={`pb-2 transition-colors relative ${
              activeTab === 'paper'
                ? 'text-sky-600 border-b-2 border-sky-600 font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            标签纸规格与浓度
          </button>
          <button
            onClick={() => setActiveTab('auto')}
            className={`pb-2 transition-colors relative ${
              activeTab === 'auto'
                ? 'text-sky-600 border-b-2 border-sky-600 font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            自动化规则与音效
          </button>
        </div>

        {/* 表单内容 */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {activeTab === 'printer' && (
            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">默认热敏条码打印机型号</label>
                <select
                  value={printerModel}
                  onChange={(e) => setPrinterModel(e.target.value)}
                  className="w-full h-8 px-2 border border-slate-300 rounded bg-white"
                >
                  <option value="TSC TX200 (门诊02号采血台)">TSC TX200 (门诊02号采血台 - 推荐)</option>
                  <option value="Zebra ZD888T (工业级条码机)">Zebra ZD888T (工业级条码机)</option>
                  <option value="Bixolon SLP-TX400 (双模热敏机)">Bixolon SLP-TX400 (双模热敏机)</option>
                  <option value="Postek G2108 (便携机)">Postek G2108 (便携移动机)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">通信端口方式</label>
                <div className="grid grid-cols-3 gap-2">
                  {['USB001', '网络TCP:IP', 'COM串口'].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPortType(p)}
                      className={`h-8 border rounded text-xs transition-colors ${
                        portType === p
                          ? 'border-sky-600 bg-sky-50 text-sky-700 font-bold'
                          : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {portType === '网络TCP:IP' && (
                <div className="bg-slate-50 border border-slate-200 p-3 rounded space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-20 text-slate-600">IP地址:</span>
                    <input
                      type="text"
                      value={ipAddress}
                      onChange={(e) => setIpAddress(e.target.value)}
                      className="flex-1 h-7 border border-slate-300 rounded px-2 font-mono text-xs"
                    />
                    <span className="text-slate-500 font-mono">: 9100</span>
                  </div>
                </div>
              )}

              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded text-emerald-800 text-[11px] flex items-center justify-between">
                <span>打印机硬件联机状态：通讯握手正常 · 传感器无报警</span>
                <span className="font-bold text-emerald-700">ONLINE</span>
              </div>
            </div>
          )}

          {activeTab === 'paper' && (
            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">标签纸张规格</label>
                <select
                  value={labelSize}
                  onChange={(e) => setLabelSize(e.target.value)}
                  className="w-full h-8 px-2 border border-slate-300 rounded bg-white text-xs"
                >
                  <option value="50mm × 30mm">50mm × 30mm (标配真空采血管标签)</option>
                  <option value="40mm × 25mm">40mm × 25mm (微量血/微量末梢管)</option>
                  <option value="60mm × 40mm">60mm × 40mm (尿管/血培养瓶大标)</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-700 font-medium">打印浓度等级 (1 - 15)</label>
                  <span className="font-mono font-bold text-sky-700">{darkness} 档 (适中加深)</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="15"
                  value={darkness}
                  onChange={(e) => setDarkness(parseInt(e.target.value, 10))}
                  className="w-full accent-sky-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                  <span>较淡 (1)</span>
                  <span>标准 (8)</span>
                  <span>极浓 (15)</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">打印方向</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setOrientation('normal')}
                    className={`h-8 border rounded text-xs transition-colors ${
                      orientation === 'normal'
                        ? 'border-sky-600 bg-sky-50 text-sky-700 font-bold'
                        : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    正常正向 (0°)
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrientation('reverse')}
                    className={`h-8 border rounded text-xs transition-colors ${
                      orientation === 'reverse'
                        ? 'border-sky-600 bg-sky-50 text-sky-700 font-bold'
                        : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    倒转旋转 (180°)
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'auto' && (
            <div className="space-y-3 text-xs">
              <label className="flex items-start gap-2.5 p-2.5 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoPrintOnScan}
                  onChange={(e) => setAutoPrintOnScan(e.target.checked)}
                  className="w-4 h-4 rounded text-sky-600 mt-0.5"
                />
                <div>
                  <div className="font-semibold text-slate-900">患者扫码核验后自动触发条码打印</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    扫码枪读取患者门诊卡或电子医保凭证后，无需护士点击鼠标即可自动按分管规则吐出对应标本标签
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-2.5 p-2.5 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={printReceipt}
                  onChange={(e) => setPrintReceipt(e.target.checked)}
                  className="w-4 h-4 rounded text-sky-600 mt-0.5"
                />
                <div>
                  <div className="font-semibold text-slate-900">同时附打患者取报告凭据纸</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    出标完成后，在末尾附带出具一张便民回执联，告知患者报告出具时间及自助机扫码位置
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-2.5 p-2.5 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={beepOnSuccess}
                  onChange={(e) => setBeepOnSuccess(e.target.checked)}
                  className="w-4 h-4 rounded text-sky-600 mt-0.5"
                />
                <div>
                  <div className="font-semibold text-slate-900">打印成功蜂鸣提示音</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    条码顺利吐出并完成感应切刀后发出“嘀”声，缺纸或卡纸时发出连续急促警报音
                  </div>
                </div>
              </label>
            </div>
          )}

          {testPrintSuccess && (
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded text-emerald-800 text-xs flex items-center gap-1.5 animate-fadeIn">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>测试样张指令已成功发送至 {printerModel}，请查看出纸情况！</span>
            </div>
          )}
        </div>

        {/* 底部按钮栏 */}
        <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={handleTestPrint}
            className="h-8 px-3 border border-slate-300 hover:bg-white text-slate-700 text-xs rounded transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>打印自检测试样张</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="h-8 px-4 border border-slate-300 text-slate-700 text-xs rounded hover:bg-slate-100"
            >
              取消
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="h-8 px-5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded shadow-xs"
            >
              保存配置
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
