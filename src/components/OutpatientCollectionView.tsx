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
import {
  Barcode,
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react';
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

  // Selected checkboxes - 默认勾选张亮最新的 2026-11-11 门诊待采标本
  const [selectedPendingBarcodes, setSelectedPendingBarcodes] = useState<string[]>([
    '423424101',
    '423424102',
  ]);
  const [selectedCollectedBarcodes, setSelectedCollectedBarcodes] = useState<string[]>([]);

  // Modals state for 生成条码, 打印条码, 手工申请, 打印设置
  const [isManualApplyOpen, setIsManualApplyOpen] = useState(false);
  const [isBarcodeGenerateOpen, setIsBarcodeGenerateOpen] = useState(false);
  const [isBarcodePrintOpen, setIsBarcodePrintOpen] = useState(false);
  const [isPrintSettingsOpen, setIsPrintSettingsOpen] = useState(false);

  // 近期开单时间范围筛选状态 (基准 2026-11-10 ~ 2026-11-11)
  const [startDate, setStartDate] = useState<string>(DEFAULT_OUTPATIENT_START_DATE);
  const [endDate, setEndDate] = useState<string>(DEFAULT_OUTPATIENT_END_DATE);
  const [dateFilterMode, setDateFilterMode] = useState<'today' | 'recent' | 'all'>('recent');

  // Search filter for tables
  const [tableSearch, setTableSearch] = useState('');

  // 表格翻页状态配置 (默认每页显示 10 条数据)
  const [pageSize, setPageSize] = useState<number>(10);
  const [pendingPage, setPendingPage] = useState<number>(1);
  const [collectedPage, setCollectedPage] = useState<number>(1);
  const [jumpPageInput, setJumpPageInput] = useState<string>('');

  // Copy state
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Detail modal for specimen guidance or barcode preview
  const [guidanceSample, setGuidanceSample] = useState<OutpatientSampleItem | null>(null);

  // 患者信息快速检索
  const handleSearchPatient = (queryOverride?: string) => {
    const raw = queryOverride !== undefined ? queryOverride : searchQuery;
    const query = raw.trim().toLowerCase();
    if (!query) {
      triggerAction('请输入患者姓名、就诊号或条形码进行智能检索');
      return;
    }
    const all = [...pendingSamples, ...collectedSamples];
    const match = all.find(
      (s) =>
        s.name.toLowerCase().includes(query) ||
        s.patientId.toLowerCase().includes(query) ||
        s.barcode.toLowerCase().includes(query)
    );
    if (match) {
      setPatient({
        outpatientNo: match.patientId,
        name: match.name,
        gender: match.gender,
        age: match.age,
        profession: '门诊自费/医保',
        phone: '138****' + match.barcode.slice(-4),
      });
      // 联动勾选该患者的待采标本
      const matchedBarcodes = pendingSamples
        .filter((s) => s.patientId === match.patientId || s.name === match.name)
        .map((s) => s.barcode);
      if (matchedBarcodes.length > 0) {
        setSelectedPendingBarcodes(matchedBarcodes);
      }
      triggerAction(`已定位患者 [${match.name}]（就诊号：${match.patientId}），关联 ${matchedBarcodes.length} 份待采集标本`);
    } else {
      triggerAction(`未检索到就诊号或姓名包含 "${query}" 的记录`);
    }
  };

  const handleApplyDatePreset = (preset: 'today' | 'recent' | 'all') => {
    setDateFilterMode(preset);
    setPendingPage(1);
    setCollectedPage(1);
    if (preset === 'today') {
      setStartDate('2026-11-11 00:00');
      setEndDate('2026-11-11 23:59');
      triggerAction('已切换为今日（2026-11-11）门诊采血记录');
    } else if (preset === 'recent') {
      setStartDate('2026-11-10 00:00');
      setEndDate('2026-11-11 23:59');
      triggerAction('已切换为近2日门诊采血记录（2026-11-10 ~ 2026-11-11）');
    } else {
      setStartDate('2026-10-01 00:00');
      setEndDate('2026-11-11 23:59');
      triggerAction('已显示全部历史与近期门诊采血记录');
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(text);
    triggerAction(`已复制条码: ${text}`);
    setTimeout(() => setCopiedCode(null), 2000);
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

  // 过滤后的待采集与已采集列表（结合近期时段与搜索关键字）
  const filteredPending = pendingSamples.filter((item) => {
    if (tableSearch.trim()) {
      const kw = tableSearch.trim().toLowerCase();
      const matchKw =
        item.name.toLowerCase().includes(kw) ||
        item.patientId.toLowerCase().includes(kw) ||
        item.testItem.toLowerCase().includes(kw) ||
        item.barcode.includes(kw) ||
        item.department.toLowerCase().includes(kw) ||
        item.doctor.toLowerCase().includes(kw);
      if (!matchKw) return false;
    }
    if (dateFilterMode !== 'all' && startDate && endDate) {
      const start = startDate.length === 16 ? startDate + ':00' : startDate;
      const end = endDate.length === 16 ? endDate + ':59' : endDate;
      if (item.applyTime < start || item.applyTime > end) return false;
    }
    return true;
  });

  const filteredCollected = collectedSamples.filter((item) => {
    if (tableSearch.trim()) {
      const kw = tableSearch.trim().toLowerCase();
      const matchKw =
        item.name.toLowerCase().includes(kw) ||
        item.patientId.toLowerCase().includes(kw) ||
        item.testItem.toLowerCase().includes(kw) ||
        item.barcode.includes(kw) ||
        item.department.toLowerCase().includes(kw) ||
        item.doctor.toLowerCase().includes(kw);
      if (!matchKw) return false;
    }
    if (dateFilterMode !== 'all' && startDate && endDate) {
      const start = startDate.length === 16 ? startDate + ':00' : startDate;
      const end = endDate.length === 16 ? endDate + ':59' : endDate;
      if (item.applyTime < start || item.applyTime > end) return false;
    }
    return true;
  });

  // 待采集分页计算 (每页默认 10 条)
  const totalPending = filteredPending.length;
  const totalPendingPages = Math.max(1, Math.ceil(totalPending / pageSize));
  const safePendingPage = Math.min(Math.max(1, pendingPage), totalPendingPages);
  const pagedPending = filteredPending.slice(
    (safePendingPage - 1) * pageSize,
    safePendingPage * pageSize
  );

  // 已采集分页计算 (每页默认 10 条)
  const totalCollected = filteredCollected.length;
  const totalCollectedPages = Math.max(1, Math.ceil(totalCollected / pageSize));
  const safeCollectedPage = Math.min(Math.max(1, collectedPage), totalCollectedPages);
  const pagedCollected = filteredCollected.slice(
    (safeCollectedPage - 1) * pageSize,
    safeCollectedPage * pageSize
  );

  // 当前激活 tab 的分页统计与控制
  const currentPage = activeTab === 'pending' ? safePendingPage : safeCollectedPage;
  const totalPages = activeTab === 'pending' ? totalPendingPages : totalCollectedPages;
  const totalRecords = activeTab === 'pending' ? totalPending : totalCollected;

  const handlePageChange = (page: number) => {
    const valid = Math.min(Math.max(1, page), totalPages);
    if (activeTab === 'pending') {
      setPendingPage(valid);
    } else {
      setCollectedPage(valid);
    }
  };

  const isAllCurrentPendingSelected =
    pagedPending.length > 0 &&
    pagedPending.every((s) => selectedPendingBarcodes.includes(s.barcode));

  const handleSelectAllPending = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const pageBarcodes = pagedPending.map((s) => s.barcode);
      setSelectedPendingBarcodes((prev) => Array.from(new Set([...prev, ...pageBarcodes])));
    } else {
      const pageBarcodes = pagedPending.map((s) => s.barcode);
      setSelectedPendingBarcodes((prev) => prev.filter((b) => !pageBarcodes.includes(b)));
    }
  };

  return (
    <div className="flex-1 h-full min-h-0 flex flex-col p-4 gap-4 overflow-y-auto lg:overflow-hidden light-scrollbar">
      {/* Top Action Ribbon matching screenshot functionality */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-3 shadow-2xs flex flex-wrap items-center justify-between gap-3 shrink-0">
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

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* 近期快捷时段切换 */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => handleApplyDatePreset('today')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                dateFilterMode === 'today'
                  ? 'bg-white text-sky-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              今日 (11-11)
            </button>
            <button
              onClick={() => handleApplyDatePreset('recent')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                dateFilterMode === 'recent'
                  ? 'bg-white text-sky-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              近2日
            </button>
            <button
              onClick={() => handleApplyDatePreset('all')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                dateFilterMode === 'all'
                  ? 'bg-white text-sky-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              全部
            </button>
          </div>

          {/* 开单时段输入 */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-700 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
            <span className="text-slate-500 font-medium flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-sky-600" />
              <span>开单时段:</span>
            </span>
            <input
              type="text"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setDateFilterMode('recent');
              }}
              className="w-32 h-6 px-1.5 border border-slate-300 rounded text-xs font-mono bg-white text-slate-800 focus:outline-none focus:border-sky-500"
            />
            <span className="text-slate-400">~</span>
            <input
              type="text"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setDateFilterMode('recent');
              }}
              className="w-32 h-6 px-1.5 border border-slate-300 rounded text-xs font-mono bg-white text-slate-800 focus:outline-none focus:border-sky-500"
            />
            <button
              onClick={() => triggerAction(`已按近期时段 ${startDate} ~ ${endDate} 刷新门诊采血记录`)}
              className="px-2 py-0.5 bg-sky-50 border border-sky-200 text-sky-700 rounded hover:bg-sky-100 font-medium text-[11px]"
            >
              查询
            </button>
          </div>

          <button
            onClick={() => {
              setPendingSamples(MOCK_PENDING_SAMPLES);
              setCollectedSamples(MOCK_COLLECTED_SAMPLES);
              triggerAction('门诊采集队列数据已实时刷新');
            }}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200 bg-white"
            title="刷新数据"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Split Layout: Left Patient Card & Lists, Right Tables */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-4 overflow-hidden">
        {/* Left Column: Patient Profile & Rejected/Unpaid Lists */}
        <div className="lg:col-span-4 flex flex-col h-full min-h-0 overflow-y-auto light-scrollbar space-y-4 pr-0.5">
          {/* Patient Card */}
          <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs space-y-3.5 shrink-0">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center font-bold">
                  <User className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-900 text-xs">患者信息检索</h3>
              </div>
              <span className="text-xs text-emerald-600 font-medium">读卡器已就绪</span>
            </div>

            {/* Search Input matching screenshot */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-500">
                患者信息 (身份证卡 / 医保卡 / 就诊号 / 申请单号)
              </label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSearchPatient();
                  }}
                  placeholder="输入姓名/就诊号/条码回车查询..."
                  className="w-full text-xs pl-9 pr-20 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-sky-500 font-mono"
                />
                <button
                  onClick={() => handleSearchPatient()}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 py-1 text-xs bg-sky-600 text-white rounded font-medium hover:bg-sky-700"
                >
                  查询
                </button>
              </div>
            </div>

            {/* Patient details */}
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2.5 pt-1 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200/70 font-mono">
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

              {/* Patient Pending Count Chip */}
              <div className="flex items-center justify-between text-xs text-sky-800 bg-sky-50/70 px-3 py-1.5 rounded-lg border border-sky-100 font-sans">
                <span className="text-slate-600">当前患者待采项目：</span>
                <span className="font-bold text-sky-700 font-mono">
                  {pendingSamples.filter(s => s.name === patient.name || s.patientId === patient.outpatientNo).length} 份标本
                </span>
              </div>
            </div>
          </div>

          {/* Rejected List Card */}
          <div className="bg-white rounded-xl border border-slate-200/90 overflow-hidden shadow-xs shrink-0">
            <div className="p-3 bg-rose-50/70 border-b border-rose-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <h3 className="font-bold text-slate-900 text-xs">拒收列表 (需重新采样)</h3>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => triggerAction('已转入门诊让步检验绿色审批通道')}
                  className="px-2 py-0.5 text-[11px] bg-white text-slate-700 border border-slate-200 rounded hover:bg-slate-50 font-medium"
                >
                  让步检验
                </button>
                <button
                  onClick={() => triggerAction('已批量标记所选标本为重采样申请')}
                  className="px-2 py-0.5 text-[11px] bg-rose-600 text-white rounded hover:bg-rose-700 font-medium"
                >
                  重采样本
                </button>
              </div>
            </div>
            <div className="overflow-x-auto max-h-48 light-scrollbar">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 sticky top-0 bg-slate-50 z-10">
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
                    <tr
                      key={r.barcode}
                      className="hover:bg-slate-50 cursor-pointer"
                      onClick={() => {
                        setPatient({
                          outpatientNo: r.patientId,
                          name: r.name,
                          gender: r.gender,
                          age: r.age,
                          profession: '门诊复采/让步检验',
                          phone: '136****' + r.barcode.slice(-4),
                        });
                        setSearchQuery(r.patientId);
                        triggerAction(`已定位拒收标本患者: ${r.name}，原因: ${r.rejectReason}`);
                      }}
                    >
                      <td className="p-2 text-center" onClick={(e) => e.stopPropagation()}>
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
          <div className="bg-white rounded-xl border border-slate-200/90 overflow-hidden shadow-xs shrink-0">
            <div className="p-3 bg-amber-50/70 border-b border-amber-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-600" />
                <h3 className="font-bold text-slate-900 text-xs">未收费列表 (待缴费)</h3>
              </div>
              <span className="text-[11px] text-amber-800 font-mono">共 {MOCK_UNPAID_SAMPLES.length} 项待缴费</span>
            </div>
            <div className="overflow-x-auto max-h-48 light-scrollbar">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 sticky top-0 bg-slate-50 z-10">
                  <tr>
                    <th className="p-2">收费状态</th>
                    <th className="p-2">标本</th>
                    <th className="p-2">申请项目</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {MOCK_UNPAID_SAMPLES.map((u) => (
                    <tr
                      key={u.barcode}
                      className="hover:bg-slate-50 cursor-pointer"
                      onClick={() => {
                        setPatient({
                          outpatientNo: u.patientId,
                          name: u.name,
                          gender: u.gender,
                          age: u.age,
                          profession: '门诊自费/待缴费',
                          phone: '137****' + u.barcode.slice(-4),
                        });
                        setSearchQuery(u.patientId);
                        triggerAction(`已选中待缴费患者: ${u.name}，项目：${u.testItem}`);
                      }}
                    >
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
        <div className="lg:col-span-8 flex flex-col h-full min-h-0 bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
          {/* Tabs Header */}
          <div className="px-3.5 py-2.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('pending')}
                className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === 'pending'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                待采集列表 ({filteredPending.length})
              </button>
              <button
                onClick={() => setActiveTab('collected')}
                className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === 'collected'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                已采集列表 ({filteredCollected.length})
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
                  onChange={(e) => {
                    setTableSearch(e.target.value);
                    setPendingPage(1);
                    setCollectedPage(1);
                  }}
                  placeholder="姓名、科室、项目快速过滤..."
                  className="text-xs pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-md outline-none focus:border-sky-500 w-48"
                />
              </div>
            </div>
          </div>

          {/* Tab 1: Pending Table */}
          {activeTab === 'pending' && (
            <div className="flex-1 min-h-0 overflow-auto light-scrollbar">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/90 text-slate-600 font-semibold border-b border-slate-200 sticky top-0 bg-slate-100 z-10 shadow-2xs">
                  <tr>
                    <th className="px-3 py-2.5 w-10 text-center">
                      <input
                        type="checkbox"
                        checked={isAllCurrentPendingSelected}
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
                  {filteredPending.length === 0 ? (
                    <tr>
                      <td colSpan={13} className="py-8 text-center text-slate-400 text-xs">
                        当前筛选时段下暂无符合条件的门诊待采集标本
                      </td>
                    </tr>
                  ) : (
                    pagedPending.map((item) => {
                      const isChecked = selectedPendingBarcodes.includes(item.barcode);
                      return (
                        <tr
                          key={item.barcode}
                          className={`hover:bg-sky-50/50 transition-colors cursor-pointer ${
                            isChecked ? 'bg-sky-50/80' : ''
                          }`}
                          onClick={() => {
                            handleTogglePending(item.barcode);
                            setPatient({
                              outpatientNo: item.patientId,
                              name: item.name,
                              gender: item.gender,
                              age: item.age,
                              profession: '门诊自费/医保',
                              phone: '138****' + item.barcode.slice(-4),
                            });
                            setSearchQuery(item.patientId);
                          }}
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
                              <span className="px-1.5 py-0.5 rounded text-[10px] bg-rose-600 text-white font-bold animate-pulse">
                                急
                              </span>
                            )}
                          </td>
                          <td className="px-3 py-2.5">
                            <span
                              className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                                item.feeStatus === '已收费'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/70'
                                  : 'bg-amber-50 text-amber-700 border border-amber-200/70'
                              }`}
                            >
                              {item.feeStatus}
                            </span>
                          </td>
                          <td className="px-3 py-2.5 flex items-center gap-1.5 text-slate-700">
                            <span
                              className={`w-2.5 h-2.5 rounded-full inline-block ${
                                item.container.includes('紫')
                                  ? 'bg-purple-500'
                                  : item.container.includes('黄')
                                  ? 'bg-amber-400'
                                  : item.container.includes('蓝')
                                  ? 'bg-sky-500'
                                  : item.container.includes('绿')
                                  ? 'bg-emerald-500'
                                  : item.container.includes('红')
                                  ? 'bg-rose-500'
                                  : 'bg-slate-400'
                              }`}
                            />
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
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Tab 2: Collected Table */}
          {activeTab === 'collected' && (
            <div className="flex-1 min-h-0 overflow-auto light-scrollbar">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/90 text-slate-600 font-semibold border-b border-slate-200 sticky top-0 bg-slate-100 z-10 shadow-2xs">
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
                  {filteredCollected.length === 0 ? (
                    <tr>
                      <td colSpan={13} className="py-8 text-center text-slate-400 text-xs">
                        当前筛选时段下暂无已采集标本记录
                      </td>
                    </tr>
                  ) : (
                    pagedCollected.map((item) => (
                      <tr
                        key={item.barcode}
                        className="hover:bg-slate-50 cursor-pointer"
                        onClick={() => {
                          setPatient({
                            outpatientNo: item.patientId,
                            name: item.name,
                            gender: item.gender,
                            age: item.age,
                            profession: '门诊自费/医保',
                            phone: '139****' + item.barcode.slice(-4),
                          });
                          setSearchQuery(item.patientId);
                        }}
                      >
                        <td className="px-3 py-2.5 text-center" onClick={(e) => e.stopPropagation()}>
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
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* 专业医学检验工作台常驻固定翻页栏 (Pinned Pagination Footer Toolbar) */}
          <div className="px-3.5 py-2 bg-slate-50 border-t border-slate-200 flex flex-wrap lg:flex-nowrap items-center justify-between gap-2 text-xs text-slate-600 select-none shrink-0">
            {/* 左侧：数据总量与当前范围统计 */}
            <div className="flex items-center gap-2 text-[12px] whitespace-nowrap shrink-0">
              <span>
                共 <strong className="text-slate-900 font-mono text-xs">{totalRecords}</strong> 条
              </span>
              <span className="text-slate-300">|</span>
              <span>
                第 <strong className="text-sky-700 font-mono font-semibold">{totalRecords === 0 ? 0 : currentPage}</strong> / <span className="font-mono">{totalPages}</span> 页
                （{totalRecords === 0 ? 0 : (currentPage - 1) * pageSize + 1}~{Math.min(currentPage * pageSize, totalRecords)}）
              </span>
              {activeTab === 'pending' && selectedPendingBarcodes.length > 0 && (
                <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-medium text-[11px] border border-sky-200">
                  已选 {selectedPendingBarcodes.length} 项
                </span>
              )}
            </div>

            {/* 右侧：翻页按钮群、每页条数选择器与跳转 */}
            <div className="flex items-center gap-1.5 shrink-0 overflow-x-auto light-scrollbar py-0.5">
              {/* 每页条数选择器 - 默认 10 条 */}
              <div className="flex items-center gap-1 shrink-0">
                <span className="text-slate-500 text-[11px]">每页:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    const newSize = Number(e.target.value);
                    setPageSize(newSize);
                    setPendingPage(1);
                    setCollectedPage(1);
                  }}
                  className="px-1.5 py-0.5 bg-white border border-slate-300 rounded font-mono text-slate-800 outline-none focus:border-sky-500 cursor-pointer text-[11px] font-semibold"
                >
                  <option value={10}>10 条/页</option>
                  <option value={20}>20 条/页</option>
                  <option value={50}>50 条/页</option>
                </select>
              </div>

              <div className="h-3.5 w-px bg-slate-200 mx-0.5 shrink-0" />

              {/* 首页 */}
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage <= 1}
                className="p-1 rounded border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-slate-600 shrink-0"
                title="第一页"
              >
                <ChevronsLeft className="w-3.5 h-3.5" />
              </button>

              {/* 上一页 */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="px-2 py-0.5 rounded border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-0.5 text-slate-700 text-[11px] shrink-0"
                title="上一页"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>上一页</span>
              </button>

              {/* 页码按钮群 */}
              <div className="flex items-center gap-0.5 shrink-0">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => {
                    if (totalPages <= 5) return true;
                    return p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1;
                  })
                  .map((p, idx, arr) => {
                    const prev = arr[idx - 1];
                    const hasEllipsis = prev && p - prev > 1;
                    return (
                      <React.Fragment key={p}>
                        {hasEllipsis && <span className="px-0.5 text-slate-400 text-[10px]">...</span>}
                        <button
                          onClick={() => handlePageChange(p)}
                          className={`min-w-6 h-6 px-1.5 rounded font-mono font-medium text-[11px] transition-all shrink-0 ${
                            currentPage === p
                              ? 'bg-sky-600 text-white font-bold shadow-xs'
                              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {p}
                        </button>
                      </React.Fragment>
                    );
                  })}
              </div>

              {/* 下一页 */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="px-2 py-0.5 rounded border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-0.5 text-slate-700 text-[11px] shrink-0"
                title="下一页"
              >
                <span>下一页</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              {/* 末页 */}
              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage >= totalPages}
                className="p-1 rounded border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-slate-600 shrink-0"
                title="最后一页"
              >
                <ChevronsRight className="w-3.5 h-3.5" />
              </button>

              <div className="h-3.5 w-px bg-slate-200 mx-0.5 shrink-0" />

              {/* 跳转页码 */}
              <div className="flex items-center gap-1 shrink-0">
                <span className="text-slate-500 text-[11px]">跳至</span>
                <input
                  type="number"
                  min={1}
                  max={totalPages}
                  value={jumpPageInput}
                  onChange={(e) => setJumpPageInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const val = parseInt(jumpPageInput);
                      if (!isNaN(val)) {
                        handlePageChange(val);
                        setJumpPageInput('');
                      }
                    }
                  }}
                  placeholder={String(currentPage)}
                  className="w-10 h-6 px-1 border border-slate-300 rounded text-center font-mono text-[11px] outline-none focus:border-sky-500 bg-white"
                />
                <span className="text-slate-500 text-[11px]">页</span>
                <button
                  onClick={() => {
                    const val = parseInt(jumpPageInput);
                    if (!isNaN(val)) {
                      handlePageChange(val);
                      setJumpPageInput('');
                    }
                  }}
                  className="px-1.5 py-0.5 bg-white border border-slate-200 text-slate-700 rounded hover:bg-slate-100 text-[11px] font-medium"
                >
                  GO
                </button>
              </div>
            </div>
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
