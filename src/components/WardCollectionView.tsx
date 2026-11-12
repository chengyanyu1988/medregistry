import React, { useState, useMemo } from 'react';
import { UserProfile } from '../types/navigation';
import {
  WardSampleItem,
  INITIAL_WARD_SAMPLES,
  WARD_OPTIONS,
  SPECIMEN_OPTIONS,
  COLLECTION_METHOD_OPTIONS,
  DEFAULT_START_DATE,
  DEFAULT_END_DATE,
  TUBE_COLOR_CONFIG,
  SPECIMEN_GUIDELINES,
} from '../data/wardCollectionData';
import {
  Printer,
  Search,
  RotateCcw,
  Plus,
  Settings,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Calendar,
  X,
  FileText,
  User,
  FlaskConical,
  Clock,
  ChevronRight,
  Barcode,
  ExternalLink,
  Info,
  SlidersHorizontal,
  PanelRightClose,
  PanelRightOpen,
  Check,
  Building2,
  Bed,
  ShieldAlert,
} from 'lucide-react';

interface WardCollectionViewProps {
  user?: UserProfile;
  triggerAction: (msg: string) => void;
}

export const WardCollectionView: React.FC<WardCollectionViewProps> = ({
  user,
  triggerAction,
}) => {
  // 标本数据源
  const [samples, setSamples] = useState<WardSampleItem[]>(INITIAL_WARD_SAMPLES);

  // 顶部筛选条件
  const [selectedWard, setSelectedWard] = useState<string>('内一科');
  const [startDate, setStartDate] = useState<string>(DEFAULT_START_DATE);
  const [endDate, setEndDate] = useState<string>(DEFAULT_END_DATE);
  const [selectedSpecimen, setSelectedSpecimen] = useState<string>('所有标本');
  const [selectedMethod, setSelectedMethod] = useState<string>('所有方式');
  const [bedStart, setBedStart] = useState<string>('');
  const [bedEnd, setBedEnd] = useState<string>('');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [onlyPrinted, setOnlyPrinted] = useState<boolean>(false);

  // 采集指南侧边栏显示状态 (支持一键折叠/展开，释放表格最大水平宽度)
  const [showGuidelinePanel, setShowGuidelinePanel] = useState<boolean>(true);

  // 工作流切换 Tab: 'toPrint' (条码打印), 'toCollect' (采样确认), 'toDeliver' (标本送检), 'rejected' (已拒收)
  const [activeTab, setActiveTab] = useState<'toPrint' | 'toCollect' | 'toDeliver' | 'rejected'>('toPrint');

  // 复选框选中 ID 列表
  const [selectedIds, setSelectedIds] = useState<string[]>(['WS-2026102601', 'WS-2026102602']);

  // 弹窗状态
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [isSettingModalOpen, setIsSettingModalOpen] = useState(false);
  const [isRejectDrawerOpen, setIsRejectDrawerOpen] = useState(false);
  const [singleRejectDetail, setSingleRejectDetail] = useState<WardSampleItem | null>(null);

  // 右下角提示浮窗显示/隐藏状态
  const [showRejectToast, setShowRejectToast] = useState(true);

  // 打印设置状态
  const [printerModel, setPrinterModel] = useState('Zebra ZD888T (床旁便携标签机)');
  const [labelSize, setLabelSize] = useState('50mm × 30mm');
  const [autoPrintOnScan, setAutoPrintOnScan] = useState(true);

  // 手工申请表单状态
  const [manualForm, setManualForm] = useState({
    patientName: '',
    bedNo: '',
    gender: '男' as '男' | '女',
    age: '',
    testItem: '全血细胞分析+CRP',
    specimen: '血液',
    collectionMethod: '静脉采血',
    tubeColor: 'purple' as WardSampleItem['tubeColor'],
    doctor: '陈欣欣',
  });

  // 各 Tab 数量统计与概览指标
  const counts = useMemo(() => {
    return {
      total: samples.length,
      toPrint: samples.filter((s) => s.status === 'toPrint').length,
      toCollect: samples.filter((s) => s.status === 'toCollect').length,
      toDeliver: samples.filter((s) => s.status === 'toDeliver').length,
      rejected: samples.filter((s) => s.status === 'rejected').length,
    };
  }, [samples]);

  // 根据当前条件筛选列表
  const filteredSamples = useMemo(() => {
    return samples.filter((item) => {
      // 1. Tab 状态
      if (item.status !== activeTab) return false;

      // 2. 病区
      if (selectedWard && item.ward !== selectedWard) return false;

      // 3. 标本类型
      if (selectedSpecimen !== '所有标本' && item.specimen !== selectedSpecimen) return false;

      // 4. 采集方式
      if (selectedMethod !== '所有方式' && item.collectionMethod !== selectedMethod) return false;

      // 5. 床号范围
      if (bedStart || bedEnd) {
        const itemBedNum = parseInt(item.bedNo.replace(/[^0-9]/g, ''), 10);
        if (!isNaN(itemBedNum)) {
          if (bedStart && itemBedNum < parseInt(bedStart, 10)) return false;
          if (bedEnd && itemBedNum > parseInt(bedEnd, 10)) return false;
        }
      }

      // 6. 搜索关键字 (姓名 / 床号 / 条码 / 检验项目)
      if (searchKeyword.trim()) {
        const kw = searchKeyword.trim().toLowerCase();
        const match =
          item.patientName.toLowerCase().includes(kw) ||
          item.bedNo.toLowerCase().includes(kw) ||
          item.barcode.includes(kw) ||
          item.testItem.toLowerCase().includes(kw) ||
          item.doctor.toLowerCase().includes(kw);
        if (!match) return false;
      }

      // 7. 已打印过滤
      if (onlyPrinted && !item.isPrinted) return false;

      return true;
    });
  }, [
    samples,
    activeTab,
    selectedWard,
    selectedSpecimen,
    selectedMethod,
    bedStart,
    bedEnd,
    searchKeyword,
    onlyPrinted,
  ]);

  // 全选/反选处理
  const isAllSelected =
    filteredSamples.length > 0 &&
    filteredSamples.every((item) => selectedIds.includes(item.id));

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds((prev) =>
        prev.filter((id) => !filteredSamples.some((item) => item.id === id))
      );
    } else {
      const newIds = Array.from(
        new Set([...selectedIds, ...filteredSamples.map((item) => item.id)])
      );
      setSelectedIds(newIds);
    }
  };

  const handleToggleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // 重置筛选
  const handleResetFilters = () => {
    setSelectedWard('内一科');
    setStartDate(DEFAULT_START_DATE);
    setEndDate(DEFAULT_END_DATE);
    setSelectedSpecimen('所有标本');
    setSelectedMethod('所有方式');
    setBedStart('');
    setBedEnd('');
    setSearchKeyword('');
    setOnlyPrinted(false);
    triggerAction('筛选条件已重置为系统默认配置');
  };

  // 执行批量打印条码
  const handleBatchPrint = () => {
    const selectedSamples = samples.filter((s) => selectedIds.includes(s.id));
    if (selectedSamples.length === 0) {
      triggerAction('请在列表左侧勾选需要打印条码的标本记录');
      return;
    }
    setIsPrintModalOpen(true);
  };

  const confirmPrintExecution = () => {
    setSamples((prev) =>
      prev.map((s) => {
        if (selectedIds.includes(s.id)) {
          return { ...s, isPrinted: true };
        }
        return s;
      })
    );
    setIsPrintModalOpen(false);
    triggerAction(`已发送 ${selectedIds.length} 份条形码打印指令至 ${printerModel}`);
  };

  // 推进工作流状态
  const handleAdvanceStatus = (sample: WardSampleItem) => {
    if (sample.status === 'toPrint') {
      setSamples((prev) =>
        prev.map((s) => (s.id === sample.id ? { ...s, status: 'toCollect' } : s))
      );
      triggerAction(`标本 [${sample.barcode}] 已转入采样确认队列`);
    } else if (sample.status === 'toCollect') {
      setSamples((prev) =>
        prev.map((s) => (s.id === sample.id ? { ...s, status: 'toDeliver' } : s))
      );
      triggerAction(`责任护士采血完毕，标本 [${sample.barcode}] 进入送检箱待取走`);
    } else if (sample.status === 'toDeliver') {
      setSamples((prev) =>
        prev.map((s) => (s.id === sample.id ? { ...s, status: 'completed' } : s))
      );
      triggerAction(`标本 [${sample.barcode}] 已与工友扫码交接并送往检验科`);
    }
  };

  // 提交手工申请
  const handleCreateManualSample = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualForm.patientName || !manualForm.bedNo) {
      triggerAction('请填写完整的患者姓名与床号');
      return;
    }
    const newBarcode = `261026010${Math.floor(10 + Math.random() * 90)}`;
    const newSample: WardSampleItem = {
      id: `WS-${Date.now()}`,
      barcode: newBarcode,
      tubeColor: manualForm.tubeColor,
      tubeLabel: '采血管',
      tubeSpec: TUBE_COLOR_CONFIG[manualForm.tubeColor].name,
      collectionMethod: manualForm.collectionMethod,
      specimen: manualForm.specimen,
      testItem: manualForm.testItem,
      patientName: manualForm.patientName,
      gender: manualForm.gender,
      age: manualForm.age || '45岁',
      bedNo: manualForm.bedNo.includes('床') ? manualForm.bedNo : `${manualForm.bedNo}床`,
      ward: selectedWard,
      department: '内科',
      doctor: manualForm.doctor,
      applyTime: '2026-10-26 10:25:00',
      executionDept: '检验科',
      isPrinted: false,
      status: 'toPrint',
    };

    setSamples((prev) => [newSample, ...prev]);
    setSelectedIds((prev) => [...prev, newSample.id]);
    setIsManualModalOpen(false);
    triggerAction(`手工申请已生成：${newSample.patientName} (${newSample.bedNo}) 条码: ${newBarcode}`);
  };

  // 查看拒收详情
  const handleOpenRejectDetail = (item?: WardSampleItem) => {
    const target = item || samples.find((s) => s.status === 'rejected') || null;
    setSingleRejectDetail(target);
    setIsRejectDrawerOpen(true);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50/60 text-slate-800 text-[13px] select-none overflow-hidden relative">
      {/* ========================================================
          1. 顶部专业指标卡片与统计条 (提升医疗大屏感与数据可视感)
         ======================================================== */}
      <div className="bg-white border-b border-slate-200/90 px-5 py-3 shrink-0">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 font-bold shrink-0">
              <FlaskConical className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-slate-900 tracking-tight">病区标本采集工作台</h1>
                <span className="text-[11px] px-2 py-0.5 rounded bg-sky-50 text-sky-700 font-medium border border-sky-200">
                  {selectedWard} · 住院部
                </span>
                <span className="text-[11px] text-slate-400">
                  当前基准日期: <strong className="font-mono text-slate-700">2026-10-26</strong>
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                支持条码批量打印、床旁PDA扫码核验、标本装箱送检与不合格标本即时闭环处置
              </p>
            </div>
          </div>

          {/* 4 项关键数据流微型指标 */}
          <div className="flex items-center gap-2">
            <div
              onClick={() => setActiveTab('toPrint')}
              className={`px-3 py-1.5 rounded-lg border text-xs cursor-pointer transition-all ${
                activeTab === 'toPrint'
                  ? 'border-sky-500 bg-sky-50/80 shadow-2xs'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="text-[11px] text-slate-500">条码待打印</div>
              <div className="text-base font-bold font-mono text-sky-700">{counts.toPrint} <span className="text-[11px] font-normal text-slate-400">管</span></div>
            </div>

            <div
              onClick={() => setActiveTab('toCollect')}
              className={`px-3 py-1.5 rounded-lg border text-xs cursor-pointer transition-all ${
                activeTab === 'toCollect'
                  ? 'border-sky-500 bg-sky-50/80 shadow-2xs'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="text-[11px] text-slate-500">护士待采血</div>
              <div className="text-base font-bold font-mono text-slate-900">{counts.toCollect} <span className="text-[11px] font-normal text-slate-400">管</span></div>
            </div>

            <div
              onClick={() => setActiveTab('toDeliver')}
              className={`px-3 py-1.5 rounded-lg border text-xs cursor-pointer transition-all ${
                activeTab === 'toDeliver'
                  ? 'border-sky-500 bg-sky-50/80 shadow-2xs'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="text-[11px] text-slate-500">待装箱送检</div>
              <div className="text-base font-bold font-mono text-slate-900">{counts.toDeliver} <span className="text-[11px] font-normal text-slate-400">管</span></div>
            </div>

            <div
              onClick={() => setActiveTab('rejected')}
              className={`px-3 py-1.5 rounded-lg border text-xs cursor-pointer transition-all ${
                activeTab === 'rejected'
                  ? 'border-rose-500 bg-rose-50 shadow-2xs'
                  : 'border-rose-200 bg-rose-50/40 hover:border-rose-300'
              }`}
            >
              <div className="text-[11px] text-rose-600 font-medium">检验科拒收</div>
              <div className="text-base font-bold font-mono text-rose-600">{counts.rejected} <span className="text-[11px] font-normal text-rose-400">管待办</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          2. 组合筛选工具栏 (重构排版：层级清晰，功能区模块化)
         ======================================================== */}
      <div className="bg-white border-b border-slate-200 px-5 py-2.5 shrink-0 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-y-2.5 gap-x-4 text-xs">
          {/* 左侧筛选项集群 */}
          <div className="flex flex-wrap items-center gap-x-3.5 gap-y-2 text-slate-700">
            {/* 病区选择 */}
            <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
              <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="text-slate-500 font-medium">病区</span>
              <select
                value={selectedWard}
                onChange={(e) => setSelectedWard(e.target.value)}
                className="bg-transparent font-medium text-slate-900 focus:outline-none cursor-pointer"
              >
                {WARD_OPTIONS.map((ward) => (
                  <option key={ward} value={ward}>
                    {ward}
                  </option>
                ))}
              </select>
            </div>

            {/* 开单时间起止范围 */}
            <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="text-slate-500 font-medium">开单时间</span>
              <input
                type="text"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-32 font-mono text-slate-800 bg-white border border-slate-200 rounded px-1.5 py-0.5 text-xs focus:outline-none focus:border-sky-500"
              />
              <span className="text-slate-400">~</span>
              <input
                type="text"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-32 font-mono text-slate-800 bg-white border border-slate-200 rounded px-1.5 py-0.5 text-xs focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* 标本类型与采集方式 */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 border border-slate-200 rounded-md px-2 py-1 bg-slate-50">
                <span className="text-slate-500">标本</span>
                <select
                  value={selectedSpecimen}
                  onChange={(e) => setSelectedSpecimen(e.target.value)}
                  className="bg-transparent font-medium text-slate-800 focus:outline-none cursor-pointer"
                >
                  {SPECIMEN_OPTIONS.map((spec) => (
                    <option key={spec} value={spec}>
                      {spec}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1.5 border border-slate-200 rounded-md px-2 py-1 bg-slate-50">
                <span className="text-slate-500">方式</span>
                <select
                  value={selectedMethod}
                  onChange={(e) => setSelectedMethod(e.target.value)}
                  className="bg-transparent font-medium text-slate-800 focus:outline-none cursor-pointer"
                >
                  {COLLECTION_METHOD_OPTIONS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 床号范围 */}
            <div className="flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
              <Bed className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="text-slate-500">床号</span>
              <input
                type="text"
                value={bedStart}
                onChange={(e) => setBedStart(e.target.value)}
                placeholder="起"
                className="w-10 text-center bg-white border border-slate-200 rounded px-1 text-xs focus:outline-none font-mono"
              />
              <span className="text-slate-400">-</span>
              <input
                type="text"
                value={bedEnd}
                onChange={(e) => setBedEnd(e.target.value)}
                placeholder="止"
                className="w-10 text-center bg-white border border-slate-200 rounded px-1 text-xs focus:outline-none font-mono"
              />
            </div>

            {/* 快速关键词搜索 */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="姓名、床号、条码号..."
                className="pl-8 pr-2.5 py-1 w-44 bg-slate-50 border border-slate-200 rounded-md text-xs focus:bg-white focus:outline-none focus:border-sky-500"
              />
              {searchKeyword && (
                <button
                  onClick={() => setSearchKeyword('')}
                  className="absolute right-2 top-1.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* 右侧：查询与重置动作 */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => triggerAction(`已按当前条件执行查询：${filteredSamples.length} 条标本`)}
              className="h-7 px-3.5 bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white font-medium rounded-md text-xs transition-colors flex items-center gap-1 shadow-2xs"
            >
              <Search className="w-3 h-3" />
              <span>查询</span>
            </button>
            <button
              onClick={handleResetFilters}
              title="重置全部筛选条件"
              className="h-7 px-2 border border-slate-200 bg-white text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-md text-xs transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================
          3. 业务流程分段切换条与快捷操作栏
         ======================================================== */}
      <div className="px-5 py-2 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
        {/* 左侧现代化分段标签按钮 (Tab Segmented Control) */}
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200/80">
          <button
            onClick={() => setActiveTab('toPrint')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
              activeTab === 'toPrint'
                ? 'bg-white text-sky-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>条码打印</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                activeTab === 'toPrint' ? 'bg-sky-100 text-sky-800 font-bold' : 'bg-slate-200/80 text-slate-600'
              }`}
            >
              {counts.toPrint}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('toCollect')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
              activeTab === 'toCollect'
                ? 'bg-white text-sky-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>采样确认</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                activeTab === 'toCollect' ? 'bg-sky-100 text-sky-800 font-bold' : 'bg-slate-200/80 text-slate-600'
              }`}
            >
              {counts.toCollect}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('toDeliver')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
              activeTab === 'toDeliver'
                ? 'bg-white text-sky-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>标本送检</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                activeTab === 'toDeliver' ? 'bg-sky-100 text-sky-800 font-bold' : 'bg-slate-200/80 text-slate-600'
              }`}
            >
              {counts.toDeliver}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('rejected')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
              activeTab === 'rejected'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-rose-600 hover:bg-rose-50'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>已拒收</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                activeTab === 'rejected' ? 'bg-rose-700 text-white font-bold' : 'bg-rose-100 text-rose-700 font-bold'
              }`}
            >
              {counts.rejected}
            </span>
          </button>
        </div>

        {/* 右侧核心功能按钮 */}
        <div className="flex items-center gap-2.5">
          <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer hover:text-slate-900 bg-slate-50 px-2 py-1 rounded border border-slate-200">
            <input
              type="checkbox"
              checked={onlyPrinted}
              onChange={(e) => setOnlyPrinted(e.target.checked)}
              className="w-3.5 h-3.5 rounded border-slate-300 text-sky-600 focus:ring-sky-500 cursor-pointer"
            />
            <span>仅显示已打印</span>
          </label>

          {/* 打印条码 (实心主色按钮) */}
          <button
            onClick={handleBatchPrint}
            className="h-7.5 px-3.5 bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white rounded-md text-xs font-semibold transition-colors shadow-2xs flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>打印条码 ({selectedIds.length})</span>
          </button>

          {/* 手工申请 */}
          <button
            onClick={() => setIsManualModalOpen(true)}
            className="h-7.5 px-3 bg-white border border-sky-600 text-sky-700 hover:bg-sky-50 rounded-md text-xs font-medium transition-colors flex items-center gap-1 shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>手工申请</span>
          </button>

          {/* 打印设置 */}
          <button
            onClick={() => setIsSettingModalOpen(true)}
            className="h-7.5 px-3 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-md text-xs font-medium transition-colors flex items-center gap-1"
          >
            <Settings className="w-3.5 h-3.5 text-slate-500" />
            <span>打印设置</span>
          </button>

          {/* 指南侧栏切换开关 */}
          <button
            onClick={() => setShowGuidelinePanel((prev) => !prev)}
            className={`h-7.5 px-2.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1 border ${
              showGuidelinePanel
                ? 'border-sky-300 bg-sky-50 text-sky-700'
                : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-50'
            }`}
            title={showGuidelinePanel ? '折叠右侧采集指南' : '展开右侧采集指南'}
          >
            {showGuidelinePanel ? (
              <>
                <PanelRightClose className="w-3.5 h-3.5" />
                <span>收起指南</span>
              </>
            ) : (
              <>
                <PanelRightOpen className="w-3.5 h-3.5" />
                <span>采集指南</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ========================================================
          4. 核心工作区：现代化高保真表格 + 可折叠采集指南
         ======================================================== */}
      <div className="flex-1 flex overflow-hidden">
        {/* 左侧主表格容器 */}
        <div className="flex-1 flex flex-col bg-white overflow-hidden">
          <div className="flex-1 overflow-auto">
            <table className="w-full border-collapse text-[12px] text-left">
              <thead>
                <tr className="bg-slate-100/90 text-slate-700 font-semibold border-b border-slate-200 sticky top-0 z-10 shadow-2xs">
                  <th className="w-10 px-3 py-2.5 text-center border-r border-slate-200 bg-slate-100">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={handleToggleSelectAll}
                      className="w-3.5 h-3.5 rounded border-slate-300 text-sky-600 focus:ring-sky-500 cursor-pointer"
                    />
                  </th>
                  <th className="px-3 py-2.5 border-r border-slate-200 whitespace-nowrap">试管规格</th>
                  <th className="px-3 py-2.5 border-r border-slate-200 whitespace-nowrap">采集方式</th>
                  <th className="px-3 py-2.5 border-r border-slate-200 whitespace-nowrap">标本类型</th>
                  <th className="px-3.5 py-2.5 border-r border-slate-200 whitespace-nowrap">申请检验项目</th>
                  <th className="px-3 py-2.5 border-r border-slate-200 whitespace-nowrap">患者姓名</th>
                  <th className="px-2.5 py-2.5 border-r border-slate-200 text-center whitespace-nowrap">性别</th>
                  <th className="px-2.5 py-2.5 border-r border-slate-200 text-center whitespace-nowrap">年龄</th>
                  <th className="px-3 py-2.5 border-r border-slate-200 text-center whitespace-nowrap">床号</th>
                  <th className="px-3 py-2.5 border-r border-slate-200 whitespace-nowrap">患者科室</th>
                  <th className="px-3 py-2.5 border-r border-slate-200 whitespace-nowrap">申请医生</th>
                  <th className="px-3.5 py-2.5 border-r border-slate-200 whitespace-nowrap">开单时间</th>
                  <th className="px-3 py-2.5 border-r border-slate-200 whitespace-nowrap">执行科室</th>
                  <th className="px-3 py-2.5 text-center whitespace-nowrap">当前操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredSamples.length > 0 ? (
                  filteredSamples.map((sample, idx) => {
                    const isSelected = selectedIds.includes(sample.id);
                    const tubeCfg = TUBE_COLOR_CONFIG[sample.tubeColor] || TUBE_COLOR_CONFIG.orange;

                    return (
                      <tr
                        key={sample.id}
                        onClick={() => handleToggleSelectRow(sample.id)}
                        className={`hover:bg-sky-50/60 transition-colors cursor-pointer ${
                          isSelected ? 'bg-sky-50/90' : idx % 2 === 1 ? 'bg-slate-50/40' : 'bg-white'
                        }`}
                      >
                        {/* Checkbox */}
                        <td
                          className="px-3 py-2 text-center border-r border-slate-100"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleSelectRow(sample.id)}
                            className="w-3.5 h-3.5 rounded border-slate-300 text-sky-600 focus:ring-sky-500 cursor-pointer"
                          />
                        </td>

                        {/* 试管 (色标指示 + 详细管型) */}
                        <td className="px-3 py-2 border-r border-slate-100 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-3.5 h-3.5 rounded-full shrink-0 shadow-2xs ${tubeCfg.dotBg} ring-2 ${tubeCfg.ringColor}`}
                              title={tubeCfg.name}
                            />
                            <div>
                              <div className="font-semibold text-slate-900 flex items-center gap-1">
                                <span>{sample.tubeLabel}</span>
                                {sample.urgent && (
                                  <span className="text-[10px] px-1.5 py-0.2 bg-rose-100 text-rose-700 rounded font-bold">
                                    急
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] text-slate-400 font-mono truncate max-w-[110px]">
                                {sample.tubeSpec}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* 采集方式 */}
                        <td className="px-3 py-2 border-r border-slate-100 whitespace-nowrap text-slate-600 font-medium">
                          {sample.collectionMethod}
                        </td>

                        {/* 标本类型 */}
                        <td className="px-3 py-2 border-r border-slate-100 whitespace-nowrap font-medium text-slate-800">
                          {sample.specimen}
                        </td>

                        {/* 申请检验项目 */}
                        <td className="px-3.5 py-2 border-r border-slate-100 whitespace-nowrap">
                          <span className="font-semibold text-slate-900">{sample.testItem}</span>
                          <span className="block font-mono text-[10px] text-sky-700">
                            条码: {sample.barcode}
                          </span>
                        </td>

                        {/* 姓名 */}
                        <td className="px-3 py-2 border-r border-slate-100 whitespace-nowrap font-bold text-slate-900">
                          {sample.patientName}
                        </td>

                        {/* 性别 */}
                        <td className="px-2.5 py-2 border-r border-slate-100 text-center whitespace-nowrap text-slate-600">
                          {sample.gender}
                        </td>

                        {/* 年龄 */}
                        <td className="px-2.5 py-2 border-r border-slate-100 text-center whitespace-nowrap text-slate-600">
                          {sample.age}
                        </td>

                        {/* 床号 (高亮床位卡) */}
                        <td className="px-3 py-2 border-r border-slate-100 text-center whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-mono font-bold text-xs border border-slate-200">
                            {sample.bedNo}
                          </span>
                        </td>

                        {/* 患者科室 */}
                        <td className="px-3 py-2 border-r border-slate-100 whitespace-nowrap text-slate-600">
                          {sample.ward || sample.department}
                        </td>

                        {/* 申请医生 */}
                        <td className="px-3 py-2 border-r border-slate-100 whitespace-nowrap text-slate-600">
                          {sample.doctor}
                        </td>

                        {/* 开单时间 (近期时间) */}
                        <td className="px-3.5 py-2 border-r border-slate-100 whitespace-nowrap font-mono text-[11px] text-slate-500">
                          {sample.applyTime}
                        </td>

                        {/* 执行科室 */}
                        <td className="px-3 py-2 border-r border-slate-100 whitespace-nowrap text-slate-600">
                          {sample.executionDept}
                        </td>

                        {/* 状态操作按钮 */}
                        <td
                          className="px-3 py-1.5 text-center whitespace-nowrap"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center justify-center gap-1.5 text-xs">
                            {sample.status === 'toPrint' && (
                              <button
                                onClick={() => {
                                  setSelectedIds([sample.id]);
                                  setIsPrintModalOpen(true);
                                }}
                                className="px-2.5 py-1 bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 rounded font-medium text-[11px] transition-colors"
                              >
                                打印标签
                              </button>
                            )}
                            {sample.status === 'toCollect' && (
                              <button
                                onClick={() => handleAdvanceStatus(sample)}
                                className="px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-300 rounded font-semibold text-[11px] transition-colors flex items-center gap-1"
                              >
                                <Check className="w-3 h-3" />
                                <span>确认采血</span>
                              </button>
                            )}
                            {sample.status === 'toDeliver' && (
                              <button
                                onClick={() => handleAdvanceStatus(sample)}
                                className="px-2.5 py-1 bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-300 rounded font-medium text-[11px] transition-colors flex items-center gap-1"
                              >
                                <span>装箱送达</span>
                              </button>
                            )}
                            {sample.status === 'rejected' && (
                              <button
                                onClick={() => handleOpenRejectDetail(sample)}
                                className="px-2.5 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-300 rounded font-bold text-[11px] transition-colors"
                              >
                                查看拒收原因
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={14} className="py-16 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <FlaskConical className="w-9 h-9 text-slate-300" />
                        <span className="font-medium text-slate-600">当前流程分类下暂无符合筛选条件的标本数据</span>
                        <span className="text-xs text-slate-400">可切换上方的【条码打印 / 采样确认 / 标本送检】分类查看</span>
                      </div>
                    </td>
                  </tr>
                )}

                {/* 质感补充行 */}
                {Array.from({ length: Math.max(0, 10 - filteredSamples.length) }).map((_, i) => (
                  <tr key={`empty-${i}`} className="h-8 border-b border-slate-100">
                    <td className="border-r border-slate-100"></td>
                    <td className="border-r border-slate-100"></td>
                    <td className="border-r border-slate-100"></td>
                    <td className="border-r border-slate-100"></td>
                    <td className="border-r border-slate-100"></td>
                    <td className="border-r border-slate-100"></td>
                    <td className="border-r border-slate-100"></td>
                    <td className="border-r border-slate-100"></td>
                    <td className="border-r border-slate-100"></td>
                    <td className="border-r border-slate-100"></td>
                    <td className="border-r border-slate-100"></td>
                    <td className="border-r border-slate-100"></td>
                    <td className="border-r border-slate-100"></td>
                    <td></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 表格底部汇总信息栏 */}
          <div className="border-t border-slate-200 px-5 py-2.5 bg-slate-50 flex items-center justify-between text-xs text-slate-500 shrink-0">
            <div className="flex items-center gap-3">
              <span>当前列表共 <strong className="font-mono text-slate-900">{filteredSamples.length}</strong> 条记录</span>
              <span>已勾选 <strong className="font-mono text-sky-600">{selectedIds.length}</strong> 项</span>
              {onlyPrinted && <span className="text-amber-600 font-medium">· 仅显示已打印条码标本</span>}
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>PDA护士站双向同步正常 · 采样条码Code128自动校验</span>
            </div>
          </div>
        </div>

        {/* 右侧：规范化采集指南 (支持一键折叠) */}
        {showGuidelinePanel && (
          <div className="w-72 border-l border-slate-200 bg-white p-4 flex flex-col justify-between overflow-y-auto shrink-0 shadow-[-1px_0_3px_rgba(0,0,0,0.03)] animate-fadeIn">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-sky-700 font-bold text-xs flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-sky-600" />
                  <span>国家临床标本采集指南规范</span>
                </h3>
                <button
                  onClick={() => setShowGuidelinePanel(false)}
                  className="text-slate-400 hover:text-slate-600 p-0.5 rounded"
                  title="收起指南面板"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* 核心指南卡片列表 (精确对应截图中的第1、2、3、4条亮蓝规范) */}
              <div className="space-y-3 text-xs leading-relaxed">
                <div className="p-3 rounded-lg bg-sky-50/80 border border-sky-100 text-sky-800 space-y-1">
                  <div className="font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-600" />
                    <span>1. 标本核对与要求</span>
                  </div>
                  <p className="text-[11px] text-sky-900 leading-normal">
                    采血前应核对好姓名和检验项目，明确标本要求，昏迷患者双人查对手腕带。
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-amber-50/80 border border-amber-200 text-amber-900 space-y-1">
                  <div className="font-bold flex items-center gap-1 text-amber-800">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    <span>2. 止血带结扎禁忌</span>
                  </div>
                  <p className="text-[11px] text-amber-900 leading-normal">
                    静脉采血时止血带结扎过久，可引起误差；<strong>乳酸则绝对不能使用止血带</strong>。
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-rose-50/80 border border-rose-200 text-rose-900 space-y-1">
                  <div className="font-bold flex items-center gap-1 text-rose-800">
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                    <span>3. 杜绝输液同侧采血</span>
                  </div>
                  <p className="text-[11px] text-rose-900 leading-normal">
                    要特别注意采血不能在输液的同侧进行，<strong>更应严谨杜绝在输液管内采血</strong>。
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-sky-50/80 border border-sky-100 text-sky-800 space-y-1">
                  <div className="font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-600" />
                    <span>4. 防溶血轻柔混匀</span>
                  </div>
                  <p className="text-[11px] text-sky-900 leading-normal">
                    血清标本应避免溶血。抗凝管采血后应轻柔颠倒混匀 5~8 次，严禁剧烈振荡。
                  </p>
                </div>
              </div>

              {/* 标准采血真空管顺序表 */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                <div className="text-[11px] font-bold text-slate-800 flex items-center justify-between">
                  <span>推荐真空管采血标准顺序</span>
                  <span className="text-[10px] text-slate-400 font-normal">先血培养后抗凝</span>
                </div>
                <div className="space-y-1.5 text-[10px] font-mono">
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-500 shrink-0" />
                    <span>1. 浅蓝盖 (枸橼酸钠抗凝 / 凝血四项)</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                    <span>2. 黄/红盖 (促凝胶SST / 生化免疫)</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                    <span>3. 绿盖 (肝素锂抗凝 / 急查生化)</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shrink-0" />
                    <span>4. 紫盖 (EDTA-K2抗凝 / 血常规分析)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
              <span>医疗管控智能平台</span>
              <span>LIS-WS v3.8</span>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================
          5. 右下角拒收警告通知卡片 (感叹号浮窗)
         ======================================================== */}
      {showRejectToast && counts.rejected > 0 && (
        <div className="absolute bottom-5 right-5 z-40 bg-white border border-rose-200 rounded-xl shadow-xl p-4 w-80 flex items-start gap-3.5 animate-fadeIn">
          <div className="w-9 h-9 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center shrink-0 text-rose-600">
            <AlertCircle className="w-5 h-5 text-rose-500 animate-pulse" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 text-xs">
                有 {counts.rejected} 份标本已被检验科拒收
              </h4>
              <button
                onClick={() => setShowRejectToast(false)}
                className="text-slate-400 hover:text-slate-600 p-0.5 rounded transition-colors"
                title="关闭提示"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[11px] text-rose-600 font-medium mt-0.5">请责任护士及时查看并安排重新采样!</p>

            <div className="mt-3 flex items-center gap-2">
              <button
                onClick={() => {
                  setActiveTab('rejected');
                  handleOpenRejectDetail();
                }}
                className="px-3 py-1 text-xs bg-rose-600 hover:bg-rose-700 text-white rounded font-medium transition-colors shadow-2xs"
              >
                查看拒收原因与重采
              </button>
              <button
                onClick={() => setShowRejectToast(false)}
                className="px-2 py-1 text-xs text-slate-600 hover:bg-slate-100 rounded transition-colors"
              >
                稍后提醒
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          6. 模态弹窗组: 打印条码 / 手工申请 / 打印设置 / 拒收详情
         ======================================================== */}
      {/* 6.1 打印条码预览弹窗 */}
      {isPrintModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-sky-600" />
                <h3 className="font-bold text-slate-900 text-sm">床旁条形码标签打印预览</h3>
              </div>
              <button
                onClick={() => setIsPrintModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4">
              <div className="text-xs text-slate-600 bg-sky-50 border border-sky-100 p-3 rounded-lg flex items-center justify-between">
                <span>准备打印 <strong>{selectedIds.length}</strong> 份标本标签 · 打印机：{printerModel}</span>
                <span className="font-mono text-sky-700">{labelSize}</span>
              </div>

              {/* 标签预览卡片 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {samples
                  .filter((s) => selectedIds.includes(s.id))
                  .slice(0, 4)
                  .map((item) => (
                    <div
                      key={item.id}
                      className="border border-slate-300 rounded-lg p-3 bg-white shadow-2xs font-mono text-xs flex flex-col justify-between"
                    >
                      <div className="flex items-start justify-between border-b border-slate-200 pb-1.5 mb-1.5">
                        <div>
                          <div className="font-bold text-slate-900 text-sm">
                            {item.patientName} <span className="text-xs font-normal text-slate-500">({item.gender} · {item.age})</span>
                          </div>
                          <div className="text-[11px] text-slate-600">{item.ward} · {item.bedNo}</div>
                        </div>
                        <span className={`w-3.5 h-3.5 rounded-full ${TUBE_COLOR_CONFIG[item.tubeColor].dotBg}`} />
                      </div>

                      <div className="text-[11px] text-slate-700 font-sans font-semibold line-clamp-1 mb-2">
                        {item.testItem}
                      </div>

                      {/* 模拟条形码图形 */}
                      <div className="bg-slate-50 border border-slate-200 p-2 rounded flex flex-col items-center">
                        <div className="h-8 w-full flex items-center justify-center gap-0.5 overflow-hidden">
                          {Array.from({ length: 38 }).map((_, i) => (
                            <div
                              key={i}
                              className={`h-full ${
                                i % 2 === 0 ? 'bg-slate-900' : 'bg-transparent'
                              } ${i % 5 === 0 ? 'w-1' : 'w-0.5'}`}
                            />
                          ))}
                        </div>
                        <span className="text-[11px] font-mono font-bold tracking-wider text-slate-900 mt-1">
                          *{item.barcode}*
                        </span>
                      </div>

                      <div className="mt-2 text-[10px] text-slate-400 flex items-center justify-between font-sans">
                        <span>标本: {item.specimen}</span>
                        <span>{item.applyTime.slice(5, 16)}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <button
                onClick={() => setIsPrintModalOpen(false)}
                className="px-4 py-2 border border-slate-300 rounded text-xs text-slate-700 hover:bg-slate-100"
              >
                取消
              </button>
              <button
                onClick={confirmPrintExecution}
                className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded text-xs font-semibold flex items-center gap-1.5 shadow-sm"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>立即出标打印 ({selectedIds.length}份)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6.2 手工申请弹窗 */}
      {isManualModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-sky-600" />
                <h3 className="font-bold text-slate-900 text-sm">新增病区床旁临时采集申请</h3>
              </div>
              <button onClick={() => setIsManualModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateManualSample} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">患者姓名 *</label>
                  <input
                    type="text"
                    required
                    value={manualForm.patientName}
                    onChange={(e) => setManualForm({ ...manualForm, patientName: e.target.value })}
                    placeholder="如：孙小强"
                    className="w-full h-8 px-2.5 border border-slate-300 rounded focus:border-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">床号 *</label>
                  <input
                    type="text"
                    required
                    value={manualForm.bedNo}
                    onChange={(e) => setManualForm({ ...manualForm, bedNo: e.target.value })}
                    placeholder="如：7床"
                    className="w-full h-8 px-2.5 border border-slate-300 rounded focus:border-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">性别</label>
                  <select
                    value={manualForm.gender}
                    onChange={(e) => setManualForm({ ...manualForm, gender: e.target.value as '男' | '女' })}
                    className="w-full h-8 px-2 border border-slate-300 rounded focus:border-sky-500 focus:outline-none"
                  >
                    <option value="男">男</option>
                    <option value="女">女</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">年龄</label>
                  <input
                    type="text"
                    value={manualForm.age}
                    onChange={(e) => setManualForm({ ...manualForm, age: e.target.value })}
                    placeholder="如：42岁"
                    className="w-full h-8 px-2.5 border border-slate-300 rounded focus:border-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">主管医生</label>
                  <input
                    type="text"
                    value={manualForm.doctor}
                    onChange={(e) => setManualForm({ ...manualForm, doctor: e.target.value })}
                    className="w-full h-8 px-2.5 border border-slate-300 rounded focus:border-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">申请检验项目 *</label>
                <input
                  type="text"
                  required
                  value={manualForm.testItem}
                  onChange={(e) => setManualForm({ ...manualForm, testItem: e.target.value })}
                  placeholder="如：急查生化八项 / 凝血四项 / 降钙素原"
                  className="w-full h-8 px-2.5 border border-slate-300 rounded focus:border-sky-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">标本种类</label>
                  <select
                    value={manualForm.specimen}
                    onChange={(e) => setManualForm({ ...manualForm, specimen: e.target.value })}
                    className="w-full h-8 px-2 border border-slate-300 rounded focus:border-sky-500 focus:outline-none"
                  >
                    <option value="血液">血液</option>
                    <option value="尿液">尿液</option>
                    <option value="痰液">痰液</option>
                    <option value="粪便">粪便</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">采血管管帽类型</label>
                  <select
                    value={manualForm.tubeColor}
                    onChange={(e) => setManualForm({ ...manualForm, tubeColor: e.target.value as any })}
                    className="w-full h-8 px-2 border border-slate-300 rounded focus:border-sky-500 focus:outline-none"
                  >
                    <option value="purple">紫盖 EDTA抗凝管 (血常规)</option>
                    <option value="orange">黄/橙盖 促凝胶管 (生化免疫)</option>
                    <option value="green">绿盖 肝素抗凝管 (急诊生化)</option>
                    <option value="blue">浅蓝 枸橼酸钠管 (凝血)</option>
                    <option value="yellow">黄色 尿液采集管</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsManualModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded text-slate-600 hover:bg-slate-50"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded shadow-xs"
                >
                  确认生成申请
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6.3 打印设置弹窗 */}
      {isSettingModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-sky-600" />
                <h3 className="font-bold text-slate-900 text-sm">床旁条码标签打印机设置</h3>
              </div>
              <button onClick={() => setIsSettingModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">默认条码标签机</label>
                <select
                  value={printerModel}
                  onChange={(e) => setPrinterModel(e.target.value)}
                  className="w-full h-8 px-2.5 border border-slate-300 rounded focus:border-sky-500 focus:outline-none"
                >
                  <option value="Zebra ZD888T (床旁便携标签机)">Zebra ZD888T (移动查房推车)</option>
                  <option value="TSC TX200 (护士站主机)">TSC TX200 (护士站集中台)</option>
                  <option value="Postek G2108 (便携蓝牙机)">Postek G2108 (蓝牙便携机)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">标签纸张规格</label>
                <select
                  value={labelSize}
                  onChange={(e) => setLabelSize(e.target.value)}
                  className="w-full h-8 px-2.5 border border-slate-300 rounded focus:border-sky-500 focus:outline-none"
                >
                  <option value="50mm × 30mm">50mm × 30mm (标配真空采血管标签)</option>
                  <option value="40mm × 25mm">40mm × 25mm (微量血/末梢采血管)</option>
                  <option value="60mm × 40mm">60mm × 40mm (尿管/培养瓶标签)</option>
                </select>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoPrintOnScan}
                    onChange={(e) => setAutoPrintOnScan(e.target.checked)}
                    className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500"
                  />
                  <span className="text-slate-800 font-medium">PDA扫码患者手腕带后自动打印条码</span>
                </label>
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-2">
              <button
                onClick={() => setIsSettingModalOpen(false)}
                className="px-4 py-1.5 border border-slate-300 rounded text-xs text-slate-600 hover:bg-slate-100"
              >
                取消
              </button>
              <button
                onClick={() => {
                  setIsSettingModalOpen(false);
                  triggerAction('打印机设置已保存并同步至移动查房车');
                }}
                className="px-5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded text-xs font-medium"
              >
                保存设置
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6.4 拒收标本闭环处理抽屉 */}
      {isRejectDrawerOpen && singleRejectDetail && (
        <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-rose-200 w-full max-w-lg overflow-hidden">
            <div className="px-5 py-4 border-b border-rose-100 bg-rose-50 flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-700">
                <AlertCircle className="w-5 h-5 text-rose-600" />
                <h3 className="font-bold text-sm">不合格标本拒收处置单</h3>
              </div>
              <button onClick={() => setIsRejectDrawerOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="bg-rose-50/70 border border-rose-200 p-3 rounded-lg text-rose-900 leading-relaxed">
                <div className="font-semibold text-rose-800 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>检验科退回原因说明</span>
                </div>
                <div className="mt-1 font-medium">{singleRejectDetail.rejectReason}</div>
                <div className="mt-2 text-[11px] text-rose-700/80 flex items-center justify-between">
                  <span>拒收判定人：{singleRejectDetail.rejectDoctor || '张珊 (主管检验师)'}</span>
                  <span className="font-mono">{singleRejectDetail.rejectTime || '2026-10-26 08:25:40'}</span>
                </div>
              </div>

              <div className="space-y-2 border border-slate-200 rounded-lg p-3 bg-slate-50/50">
                <div className="font-semibold text-slate-800 pb-1 border-b border-slate-200">标本基本信息</div>
                <div className="grid grid-cols-2 gap-2 text-slate-600">
                  <div>患者姓名：<strong className="text-slate-900">{singleRejectDetail.patientName}</strong></div>
                  <div>床号：<strong className="text-slate-900">{singleRejectDetail.bedNo}</strong></div>
                  <div>检验项目：{singleRejectDetail.testItem}</div>
                  <div>标本条码：<span className="font-mono">{singleRejectDetail.barcode}</span></div>
                  <div>送检医生：{singleRejectDetail.doctor}</div>
                  <div>采集方式：{singleRejectDetail.collectionMethod}</div>
                </div>
              </div>

              {/* 临床处理闭环操作 */}
              <div className="space-y-2">
                <label className="font-medium text-slate-800 block">护士站闭环处置动作：</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setSamples((prev) =>
                        prev.map((s) =>
                          s.id === singleRejectDetail.id
                            ? { ...s, status: 'toPrint', rejectReason: undefined }
                            : s
                        )
                      );
                      setIsRejectDrawerOpen(false);
                      triggerAction(`已为 ${singleRejectDetail.patientName} 重新生成采血医嘱并转入待打印队列`);
                    }}
                    className="p-2.5 border border-sky-600 text-sky-700 bg-sky-50/50 hover:bg-sky-100 rounded text-left font-medium"
                  >
                    <div>重新生成采血条码</div>
                    <span className="text-[10px] text-slate-500 font-normal">重新打印并由责任护士重抽</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsRejectDrawerOpen(false);
                      triggerAction(`已记录：电话联系 ${singleRejectDetail.doctor} 说明拒收原因并完成留痕`);
                    }}
                    className="p-2.5 border border-slate-300 hover:bg-slate-100 rounded text-left font-medium text-slate-700"
                  >
                    <div>电话沟通主管医生</div>
                    <span className="text-[10px] text-slate-500 font-normal">登记临床电话沟通双签记录</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button
                onClick={() => setIsRejectDrawerOpen(false)}
                className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 rounded text-slate-700 text-xs font-medium"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
