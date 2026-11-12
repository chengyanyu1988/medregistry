import React, { useState } from 'react';
import { UserProfile } from '../types/navigation';
import {
  MOCK_PATIENT_INFO,
  MOCK_PENDING_SAMPLES,
  MOCK_REJECTED_SAMPLES,
  MOCK_UNPAID_SAMPLES,
  MOCK_COLLECTED_SAMPLES,
  OutpatientSampleItem,
  DEFAULT_OUTPATIENT_START_DATE,
  DEFAULT_OUTPATIENT_END_DATE,
} from '../data/outpatientData';
import {
  Search,
  Printer,
  CheckCircle2,
  FileText,
  Settings,
  RefreshCw,
  AlertCircle,
  HelpCircle,
  Copy,
  Check,
  User,
  Activity,
  ArrowRight,
  X
} from './MenuIcon';
import { Barcode, Calendar, Clock } from 'lucide-react';
import { OutpatientManualApplyModal } from './OutpatientManualApplyModal';
import { OutpatientBarcodeGenerateModal } from './OutpatientBarcodeGenerateModal';
import { OutpatientBarcodePrintModal } from './OutpatientBarcodePrintModal';
import { OutpatientPrintSettingsModal } from './OutpatientPrintSettingsModal';

interface OutpatientCollectionViewProps {
  user: UserProfile;
  triggerAction: (msg: string) => void;
}

export const OutpatientCollectionView: React.FC<OutpatientCollectionViewProps> = ({
  user,
  triggerAction,
}) => {
  // Patient search state
  const [searchQuery, setSearchQuery] = useState('100000212');
  const [patient, setPatient] = useState(MOCK_PATIENT_INFO);

  // Dynamic samples state
  const [pendingSamples, setPendingSamples] = useState<OutpatientSampleItem[]>(MOCK_PENDING_SAMPLES);
  const [collectedSamples, setCollectedSamples] = useState<OutpatientSampleItem[]>(MOCK_COLLECTED_SAMPLES);

  // Table tabs
  const [activeTab, setActiveTab] = useState<'pending' | 'collected'>('pending');

  // Selected checkboxes
  const [selectedPendingBarcodes, setSelectedPendingBarcodes] = useState<string[]>([
    '423423501',
    '423423502',
  ]);
  const [selectedCollectedBarcodes, setSelectedCollectedBarcodes] = useState<string[]>([]);

  // Modals state for 生成条码, 打印条码, 手工申请, 打印设置
  const [isManualApplyOpen, setIsManualApplyOpen] = useState(false);
  const [isBarcodeGenerateOpen, setIsBarcodeGenerateOpen] = useState(false);
  const [isBarcodePrintOpen, setIsBarcodePrintOpen] = useState(false);
  const [isPrintSettingsOpen, setIsPrintSettingsOpen] = useState(false);

  // 近期开单时间范围筛选状态 (基准 2026-10-26)
  const [startDate, setStartDate] = useState<string>(DEFAULT_OUTPATIENT_START_DATE);
  const [endDate, setEndDate] = useState<string>(DEFAULT_OUTPATIENT_END_DATE);

  // Search filter for tables
  const [tableSearch, setTableSearch] = useState('');

  // Copy state
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Detail modal for specimen guidance or barcode preview
  const [guidanceSample, setGuidanceSample] = useState<OutpatientSampleItem | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    triggerAction(`已复制条码: ${text}`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleSelectAllPending = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedPendingBarcodes(pendingSamples.map((s) => s.barcode));
    } else {
      setSelectedPendingBarcodes([]);
    }
  };

  const handleTogglePending = (barcode: string) => {
    setSelectedPendingBarcodes((prev) =>
      prev.includes(barcode) ? prev.filter((b) => b !== barcode) : [...prev, barcode]
    );
  };

  // 1. 生成条码回调处理
  const handleConfirmGenerateBarcodes = (generatedList: OutpatientSampleItem[]) => {
    triggerAction(`已为 ${generatedList.length} 项标本智能分管并生成标准医用一维条码`);
  };

  // 2. 打印条码回调处理
  const handleConfirmPrintBarcodes = (printedBarcodes: string[]) => {
    triggerAction(`已向热敏标签机发送 ${printedBarcodes.length} 份标本条形码打印任务`);
  };

  // 3. 手工申请保存回调处理
  const handleSaveManualSample = (newSample: OutpatientSampleItem) => {
    setPendingSamples((prev) => [newSample, ...prev]);
    setSelectedPendingBarcodes((prev) => [newSample.barcode, ...prev]);
    setIsManualApplyOpen(false);
    triggerAction(`手工申请已成功建立：${newSample.name} (${newSample.testItem})，条码号：${newSample.barcode}`);
  };

  // 4. 打印机设置保存回调处理
  const handleSavePrintSettings = (settings: { printer: string; labelSize: string; autoPrint: boolean }) => {
    triggerAction(`打印设置已更新：${settings.printer}，规格 ${settings.labelSize}，已同步生效`);
  };

  // 5. 完成采集动作
  const handleCompleteCollection = () => {
    if (selectedPendingBarcodes.length === 0) {
      triggerAction('请先在待采集列表勾选要确认采血的标本');
      return;
    }
    const toComplete = pendingSamples.filter((s) => selectedPendingBarcodes.includes(s.barcode));
    setPendingSamples((prev) => prev.filter((s) => !selectedPendingBarcodes.includes(s.barcode)));
    setCollectedSamples((prev) => [
      ...toComplete.map((item) => ({ ...item, status: '已采集' as const })),
      ...prev,
    ]);
    setSelectedPendingBarcodes([]);
    triggerAction(`已成功确认完成 ${toComplete.length} 例标本采集，标本已移入已采集待送检队列`);
  };

  return (
    <div className="space-y-6">
      {/* Top Action Ribbon matching screenshot functionality */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {/* 1. 生成条码 */}
          <button
            onClick={() => setIsBarcodeGenerateOpen(true)}
            className="px-3.5 py-2 text-xs font-semibold bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Barcode className="w-4 h-4" />
            <span>生成条码</span>
          </button>

          {/* 2. 打印条码 */}
          <button
            onClick={() => setIsBarcodePrintOpen(true)}
            className="px-3.5 py-2 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Printer className="w-4 h-4 text-sky-400" />
            <span>打印条码</span>
          </button>

          {/* 3. 完成采集 */}
          <button
            onClick={handleCompleteCollection}
            className="px-3.5 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>完成采集</span>
          </button>

          {/* 4. 手工申请 (对应用户截图功能) */}
          <button
            onClick={() => setIsManualApplyOpen(true)}
            className="px-3.5 py-2 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors flex items-center gap-1.5 border border-slate-200"
          >
            <FileText className="w-4 h-4 text-sky-600" />
            <span>手工申请</span>
          </button>

          {/* 5. 打印设置 */}
          <button
            onClick={() => setIsPrintSettingsOpen(true)}
            className="px-3.5 py-2 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors flex items-center gap-1.5 border border-slate-200"
          >
            <Settings className="w-4 h-4 text-slate-500" />
            <span>打印设置</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          {/* 近期开单时段筛选器 */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-700 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
            <span className="text-slate-500 font-medium flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-sky-600" />
              <span>开单时段:</span>
            </span>
            <input
              type="text"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-34 h-6 px-1.5 border border-slate-300 rounded text-xs font-mono bg-white text-slate-800 focus:outline-none focus:border-sky-500"
            />
            <span className="text-slate-400">~</span>
            <input
              type="text"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-34 h-6 px-1.5 border border-slate-300 rounded text-xs font-mono bg-white text-slate-800 focus:outline-none focus:border-sky-500"
            />
            <button
              onClick={() => triggerAction(`已按近期时段 ${startDate} ~ ${endDate} 刷新门诊采血记录`)}
              className="px-2 py-0.5 bg-sky-50 border border-sky-200 text-sky-700 rounded hover:bg-sky-100 font-medium text-[11px]"
            >
              查询
            </button>
          </div>

          <button
            onClick={() => triggerAction('门诊采集队列数据已实时刷新')}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200 bg-white"
            title="刷新数据"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Split Layout: Left Patient Card & Lists, Right Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Patient Profile & Rejected/Unpaid Lists */}
        <div className="lg:col-span-4 space-y-6">
          {/* Patient Card */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center font-bold">
                  <User className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">患者信息检索</h3>
              </div>
              <span className="text-xs text-emerald-600 font-medium">读卡器已就绪</span>
            </div>

            {/* Search Input matching screenshot */}
            <div className="space-y-2">
              <label className="text-[11px] font-semibold text-slate-500">
                患者信息 (身份证卡 / 医保卡 / 就诊号 / 申请单号)
              </label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="请输入或刷卡..."
                  className="w-full text-xs pl-9 pr-20 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-sky-500 font-mono"
                />
                <button
                  onClick={() => triggerAction(`正在检索患者信息: ${searchQuery}`)}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 py-1 text-xs bg-sky-600 text-white rounded font-medium hover:bg-sky-700"
                >
                  查询
                </button>
              </div>
            </div>

            {/* Patient details */}
            <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200/70 font-mono">
              <div>
                <span className="text-slate-400 font-sans block text-[11px]">就诊号</span>
                <span className="font-bold text-slate-900">{patient.outpatientNo}</span>
              </div>
              <div>
                <span className="text-slate-400 font-sans block text-[11px]">姓名</span>
                <span className="font-bold text-rose-600 text-sm">{patient.name}</span>
              </div>
              <div>
                <span className="text-slate-400 font-sans block text-[11px]">性别 / 年龄</span>
                <span>{patient.gender} · {patient.age}</span>
              </div>
              <div>
                <span className="text-slate-400 font-sans block text-[11px]">职业 / 电话</span>
                <span>{patient.phone}</span>
              </div>
            </div>
          </div>

          {/* Rejected List Card */}
          <div className="bg-white rounded-xl border border-slate-200/90 overflow-hidden shadow-xs">
            <div className="p-3.5 bg-rose-50/70 border-b border-rose-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <h3 className="font-bold text-slate-900 text-xs">拒收列表 (需重新采样)</h3>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => triggerAction('已转入门诊让步检验绿色审批通道')}
                  className="px-2 py-1 text-[11px] bg-white text-slate-700 border border-slate-200 rounded hover:bg-slate-50 font-medium"
                >
                  让步检验
                </button>
                <button
                  onClick={() => triggerAction('已批量标记所选标本为重采样申请')}
                  className="px-2 py-1 text-[11px] bg-rose-600 text-white rounded hover:bg-rose-700 font-medium"
                >
                  重采样本
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-2 w-8 text-center">
                      <input type="checkbox" className="rounded" />
                    </th>
                    <th className="p-2">条码号</th>
                    <th className="p-2">申请项目</th>
                    <th className="p-2">拒收理由</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {MOCK_REJECTED_SAMPLES.map((r) => (
                    <tr key={r.barcode} className="hover:bg-slate-50">
                      <td className="p-2 text-center">
                        <input type="checkbox" defaultChecked className="rounded" />
                      </td>
                      <td className="p-2 font-mono text-slate-800">{r.barcode}</td>
                      <td className="p-2 font-medium text-slate-900">{r.testItem}</td>
                      <td className="p-2 text-rose-600 text-[11px] truncate max-w-[120px]">
                        {r.rejectReason}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Unpaid List Card */}
          <div className="bg-white rounded-xl border border-slate-200/90 overflow-hidden shadow-xs">
            <div className="p-3.5 bg-amber-50/70 border-b border-amber-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-600" />
                <h3 className="font-bold text-slate-900 text-xs">未收费列表 (待缴费)</h3>
              </div>
              <span className="text-[11px] text-amber-800 font-mono">共 2 项待缴费</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="p-2">收费状态</th>
                    <th className="p-2">标本</th>
                    <th className="p-2">申请项目</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {MOCK_UNPAID_SAMPLES.map((u) => (
                    <tr key={u.barcode} className="hover:bg-slate-50">
                      <td className="p-2">
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-100 text-amber-800 font-medium">
                          {u.feeStatus}
                        </span>
                      </td>
                      <td className="p-2 text-slate-700">{u.specimen}</td>
                      <td className="p-2 font-medium text-slate-900">{u.testItem}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Pending Collection Table & Collected Table */}
        <div className="lg:col-span-8 space-y-6">
          {/* Main Table Container with Tabs */}
          <div className="bg-white rounded-xl border border-slate-200/90 overflow-hidden shadow-xs">
            {/* Tabs Header */}
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('pending')}
                  className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    activeTab === 'pending'
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  待采集列表 ({pendingSamples.length})
                </button>
                <button
                  onClick={() => setActiveTab('collected')}
                  className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    activeTab === 'collected'
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  已采集列表 ({collectedSamples.length})
                </button>
              </div>

              {/* Table search toolbar */}
              <div className="flex items-center gap-2">
                {activeTab === 'collected' && (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => triggerAction('已撤销所选标本的采集状态')}
                      className="px-2.5 py-1 text-xs bg-white border border-slate-200 text-slate-700 rounded-md hover:bg-slate-50"
                    >
                      撤销采集
                    </button>
                    <button
                      onClick={() => triggerAction('已补打回执单')}
                      className="px-2.5 py-1 text-xs bg-white border border-slate-200 text-slate-700 rounded-md hover:bg-slate-50"
                    >
                      补打回执单
                    </button>
                    <button
                      onClick={() => triggerAction('已补打条码标签')}
                      className="px-2.5 py-1 text-xs bg-white border border-slate-200 text-slate-700 rounded-md hover:bg-slate-50"
                    >
                      补打条码
                    </button>
                  </div>
                )}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={tableSearch}
                    onChange={(e) => setTableSearch(e.target.value)}
                    placeholder="姓名、病历号快速过滤..."
                    className="text-xs pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-md outline-none focus:border-sky-500 w-48"
                  />
                </div>
              </div>
            </div>

            {/* Tab 1: Pending Table */}
            {activeTab === 'pending' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100/70 text-slate-600 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="px-3 py-2.5 w-10 text-center">
                        <input
                          type="checkbox"
                          checked={pendingSamples.length > 0 && selectedPendingBarcodes.length === pendingSamples.length}
                          onChange={handleSelectAllPending}
                          className="rounded"
                        />
                      </th>
                      <th className="px-2.5 py-2.5 text-rose-600 font-bold">急</th>
                      <th className="px-3 py-2.5">收费</th>
                      <th className="px-3 py-2.5">容器</th>
                      <th className="px-3 py-2.5">采集方式</th>
                      <th className="px-3 py-2.5">标本</th>
                      <th className="px-3.5 py-2.5">申请项目</th>
                      <th className="px-3 py-2.5">患者科室</th>
                      <th className="px-3 py-2.5">申请医生</th>
                      <th className="px-3 py-2.5">申请时间</th>
                      <th className="px-3 py-2.5">执行科室</th>
                      <th className="px-3.5 py-2.5 font-mono">条码号</th>
                      <th className="px-3 py-2.5 text-center">采集指南</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {pendingSamples
                      .filter((item) => {
                        if (!tableSearch.trim()) return true;
                        const kw = tableSearch.trim().toLowerCase();
                        return (
                          item.name.toLowerCase().includes(kw) ||
                          item.patientId.toLowerCase().includes(kw) ||
                          item.testItem.toLowerCase().includes(kw) ||
                          item.barcode.includes(kw)
                        );
                      })
                      .map((item) => {
                      const isChecked = selectedPendingBarcodes.includes(item.barcode);
                      return (
                        <tr
                          key={item.barcode}
                          className={`hover:bg-sky-50/50 transition-colors cursor-pointer ${
                            isChecked ? 'bg-sky-50/80' : ''
                          }`}
                          onClick={() => handleTogglePending(item.barcode)}
                        >
                          <td className="px-3 py-2.5 text-center" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleTogglePending(item.barcode)}
                              className="rounded"
                            />
                          </td>
                          <td className="px-2.5 py-2.5">
                            {item.isEmergency && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] bg-rose-600 text-white font-bold">
                                急
                              </span>
                            )}
                          </td>
                          <td className="px-3 py-2.5">
                            <span
                              className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                                item.feeStatus === '已收费'
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : 'bg-amber-50 text-amber-700'
                              }`}
                            >
                              {item.feeStatus}
                            </span>
                          </td>
                          <td className="px-3 py-2.5 flex items-center gap-1.5 text-slate-700">
                            <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
                            <span>{item.container}</span>
                          </td>
                          <td className="px-3 py-2.5 text-slate-700">{item.collectionMethod}</td>
                          <td className="px-3 py-2.5 font-medium text-slate-900">{item.specimen}</td>
                          <td className="px-3.5 py-2.5 font-semibold text-slate-900">{item.testItem}</td>
                          <td className="px-3 py-2.5 text-slate-600">{item.department}</td>
                          <td className="px-3 py-2.5 text-slate-600">{item.doctor}</td>
                          <td className="px-3 py-2.5 font-mono text-slate-500">{item.applyTime}</td>
                          <td className="px-3 py-2.5 text-slate-600">检验科</td>
                          <td className="px-3.5 py-2.5 font-mono font-medium text-sky-700">
                            <div className="flex items-center gap-1">
                              <span>{item.barcode}</span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCopy(item.barcode);
                                }}
                                className="p-0.5 hover:bg-slate-200 rounded"
                                title="复制条码"
                              >
                                {copiedCode === item.barcode ? (
                                  <Check className="w-3 h-3 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3 h-3 text-slate-400" />
                                )}
                              </button>
                            </div>
                          </td>
                          <td
                            className="px-3 py-2.5 text-center"
                            onClick={(e) => {
                              e.stopPropagation();
                              setGuidanceSample(item);
                            }}
                          >
                            <button
                              className="text-sky-600 hover:text-sky-800 p-1 rounded hover:bg-sky-100 transition-colors"
                              title="查看采集指南与注意事项"
                            >
                              <HelpCircle className="w-4 h-4 mx-auto" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Tab 2: Collected Table */}
            {activeTab === 'collected' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100/70 text-slate-600 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="px-3 py-2.5 w-10 text-center">
                        <input type="checkbox" className="rounded" />
                      </th>
                      <th className="px-2.5 py-2.5 text-rose-600 font-bold">急</th>
                      <th className="px-3 py-2.5">容器</th>
                      <th className="px-3 py-2.5">标本</th>
                      <th className="px-3.5 py-2.5">申请项目</th>
                      <th className="px-3.5 py-2.5 font-mono">条码号</th>
                      <th className="px-3 py-2.5">姓名</th>
                      <th className="px-3 py-2.5">性别</th>
                      <th className="px-3 py-2.5 font-mono">金额(元)</th>
                      <th className="px-3 py-2.5">申请科室</th>
                      <th className="px-3 py-2.5">申请医生</th>
                      <th className="px-3 py-2.5">申请时间</th>
                      <th className="px-3 py-2.5">采集方式</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {collectedSamples
                      .filter((item) => {
                        if (!tableSearch.trim()) return true;
                        const kw = tableSearch.trim().toLowerCase();
                        return (
                          item.name.toLowerCase().includes(kw) ||
                          item.patientId.toLowerCase().includes(kw) ||
                          item.testItem.toLowerCase().includes(kw) ||
                          item.barcode.includes(kw)
                        );
                      })
                      .map((item) => (
                      <tr key={item.barcode} className="hover:bg-slate-50">
                        <td className="px-3 py-2.5 text-center">
                          <input type="checkbox" className="rounded" />
                        </td>
                        <td className="px-2.5 py-2.5">
                          {item.isEmergency && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-rose-600 text-white font-bold">
                              急
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-2.5 text-slate-700">{item.container}</td>
                        <td className="px-3 py-2.5 text-slate-900">{item.specimen}</td>
                        <td className="px-3.5 py-2.5 font-semibold text-slate-900">{item.testItem}</td>
                        <td className="px-3.5 py-2.5 font-mono font-medium text-sky-700">{item.barcode}</td>
                        <td className="px-3 py-2.5 font-bold text-slate-900">{item.name}</td>
                        <td className="px-3 py-2.5 text-slate-600">{item.gender}</td>
                        <td className="px-3 py-2.5 font-mono font-semibold text-slate-800">
                          {item.specimen === '血清' ? '85' : item.specimen === '全血' ? '25' : '45'}
                        </td>
                        <td className="px-3 py-2.5 text-slate-600">{item.department}</td>
                        <td className="px-3 py-2.5 text-slate-600">{item.doctor}</td>
                        <td className="px-3 py-2.5 font-mono text-slate-500">{item.applyTime}</td>
                        <td className="px-3 py-2.5 text-slate-600">{item.collectionMethod}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 1. Modal: 手工申请 (严格根据截图要求还原) */}
      <OutpatientManualApplyModal
        isOpen={isManualApplyOpen}
        onClose={() => setIsManualApplyOpen(false)}
        onSave={handleSaveManualSample}
      />

      {/* 2. Modal: 生成条码与智能分管 */}
      <OutpatientBarcodeGenerateModal
        isOpen={isBarcodeGenerateOpen}
        onClose={() => setIsBarcodeGenerateOpen(false)}
        samples={pendingSamples}
        selectedBarcodes={selectedPendingBarcodes}
        patientName={patient.name}
        patientId={patient.outpatientNo}
        onConfirmGenerate={handleConfirmGenerateBarcodes}
      />

      {/* 3. Modal: 打印条码与标签仿真预览 */}
      <OutpatientBarcodePrintModal
        isOpen={isBarcodePrintOpen}
        onClose={() => setIsBarcodePrintOpen(false)}
        samples={pendingSamples}
        selectedBarcodes={selectedPendingBarcodes}
        patientName={patient.name}
        patientId={patient.outpatientNo}
        onConfirmPrint={handleConfirmPrintBarcodes}
      />

      {/* 4. Modal: 打印机硬件与自动化设置 */}
      <OutpatientPrintSettingsModal
        isOpen={isPrintSettingsOpen}
        onClose={() => setIsPrintSettingsOpen(false)}
        onSave={handleSavePrintSettings}
      />

      {/* 5. Modal: Specimen Collection Guidance */}
      {guidanceSample && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-sky-600" />
                <h3 className="font-bold text-slate-900 text-sm">标本采集标准化指南</h3>
              </div>
              <button
                onClick={() => setGuidanceSample(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="p-3 bg-sky-50 rounded-xl border border-sky-100 text-sky-950 space-y-1">
                <div className="font-bold text-sm text-sky-900">
                  {guidanceSample.testItem} ({guidanceSample.specimen})
                </div>
                <div>推荐容器：{guidanceSample.container} · 采集方式：{guidanceSample.collectionMethod}</div>
              </div>

              <div className="space-y-2 text-slate-600 leading-relaxed">
                <div><strong>采血注意事项：</strong></div>
                <ul className="list-disc pl-4 space-y-1">
                  <li>患者采血前宜空腹 8~12 小时，避免剧烈运动。</li>
                  <li>采血时应严格核对患者就诊号 ({guidanceSample.patientId}) 与姓名 ({guidanceSample.name})。</li>
                  <li>采血后轻柔颠倒混匀 5~8 次（抗凝管适用），防止微小凝块产生。</li>
                </ul>
              </div>
            </div>

            <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setGuidanceSample(null)}
                className="px-4 py-1.5 text-xs font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800"
              >
                已知晓并返回
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
