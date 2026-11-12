import React, { useState, useMemo } from 'react';
import { UserProfile } from '../types/navigation';
import {
  DeliveryBatchItem,
  DeliveryDetailItem,
  INITIAL_DELIVERY_BATCHES,
  INITIAL_DELIVERY_DETAILS,
  REJECTED_DELIVERY_SAMPLES,
  PENDING_DELIVERY_CANDIDATES,
  DEFAULT_DELIVERY_START_DATE,
  DEFAULT_DELIVERY_END_DATE,
} from '../data/specimenDeliveryData';
import {
  Search,
  Printer,
  Settings,
  Calendar,
  X,
  Plus,
  Send,
  Barcode,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Truck,
  Box,
  FileSpreadsheet,
  ArrowRight,
  ShieldAlert,
  Thermometer,
  Layers,
  ChevronRight,
  Clock,
  Check,
  Building2,
  FileText,
  User,
  ExternalLink,
} from 'lucide-react';

interface SpecimenDeliveryViewProps {
  user?: UserProfile;
  triggerAction: (msg: string) => void;
}

export const SpecimenDeliveryView: React.FC<SpecimenDeliveryViewProps> = ({
  user,
  triggerAction,
}) => {
  // 1. 送检主表与明细数据源
  const [batches, setBatches] = useState<DeliveryBatchItem[]>(INITIAL_DELIVERY_BATCHES);
  const [details, setDetails] = useState<DeliveryDetailItem[]>(INITIAL_DELIVERY_DETAILS);
  const [rejectedSamples] = useState(REJECTED_DELIVERY_SAMPLES);
  const [pendingPool, setPendingPool] = useState(PENDING_DELIVERY_CANDIDATES);

  // 2. 顶部工具栏筛选条件 (时间默认近期 2026-10-26)
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [startDate, setStartDate] = useState<string>(DEFAULT_DELIVERY_START_DATE);
  const [endDate, setEndDate] = useState<string>(DEFAULT_DELIVERY_END_DATE);
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  // 3. 当前选中的送检单号 (默认选中第一批 18121700001)
  const [selectedBatchNo, setSelectedBatchNo] = useState<string>(
    INITIAL_DELIVERY_BATCHES[0]?.deliveryBatchNo || '18121700001'
  );

  // 4. 工作流模式 Tab: 'delivery' (送检标本), 'rejected' (拒收标本)
  const [activeTab, setActiveTab] = useState<'delivery' | 'rejected'>('delivery');

  // 5. 弹窗状态
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);
  const [isReprintModalOpen, setIsReprintModalOpen] = useState(false);
  const [isSettingModalOpen, setIsSettingModalOpen] = useState(false);
  const [isRejectDrawerOpen, setIsRejectDrawerOpen] = useState(false);
  const [showRejectToast, setShowRejectToast] = useState(true);

  // 6. 新发起送检表单
  const [newDeliverer, setNewDeliverer] = useState('李明辉');
  const [newVehicle, setNewVehicle] = useState('粤A·E8821 (标本冷链专车)');
  const [newApplyHospital, setNewApplyHospital] = useState('市中心医院 (东院区)');
  const [newReceiveHospital, setNewReceiveHospital] = useState('市中心医院总院检验中心');
  const [selectedPendingPacks, setSelectedPendingPacks] = useState<string[]>([
    '18121700005',
  ]);

  // 7. 打印设置状态
  const [manifestPrinter, setManifestPrinter] = useState('HP LaserJet M404dw (检验科A4激光机)');
  const [printCopies, setPrintCopies] = useState('2联 (送检存根联 + 接收确认联)');
  const [includeBarcode, setIncludeBarcode] = useState(true);

  // 汇总指标
  const metrics = useMemo(() => {
    const totalBatches = batches.length;
    const deliveredCount = batches.filter((b) => b.status === '已送检').length;
    const receivedCount = batches.filter((b) => b.status === '已接收').length;
    const totalTubes = details.length;
    return { totalBatches, deliveredCount, receivedCount, totalTubes };
  }, [batches, details]);

  // 过滤后的送检批次列表
  const filteredBatches = useMemo(() => {
    return batches.filter((item) => {
      if (statusFilter !== 'all' && item.status !== statusFilter) return false;
      if (searchKeyword.trim()) {
        const kw = searchKeyword.trim().toLowerCase();
        const match =
          item.deliveryBatchNo.toLowerCase().includes(kw) ||
          item.deliverer.toLowerCase().includes(kw) ||
          item.applyHospital.toLowerCase().includes(kw) ||
          item.receiveHospital.toLowerCase().includes(kw) ||
          (item.vehiclePlate && item.vehiclePlate.toLowerCase().includes(kw));
        if (!match) return false;
      }
      return true;
    });
  }, [batches, statusFilter, searchKeyword]);

  // 当前选中的批次对象
  const currentBatch = useMemo(() => {
    return batches.find((b) => b.deliveryBatchNo === selectedBatchNo) || batches[0];
  }, [batches, selectedBatchNo]);

  // 当前选中送检单的明细项
  const currentDetails = useMemo(() => {
    return details.filter((d) => d.deliveryBatchNo === selectedBatchNo);
  }, [details, selectedBatchNo]);

  // 撤销送检操作
  const handleRevokeDelivery = (batch: DeliveryBatchItem) => {
    if (batch.status === '已接收') {
      triggerAction(`送检单 [${batch.deliveryBatchNo}] 已被中心实验室接收并扫码入库，不可撤销！`);
      return;
    }

    const removedItems = details.filter((d) => d.deliveryBatchNo === batch.deliveryBatchNo);
    setDetails((prev) => prev.filter((d) => d.deliveryBatchNo !== batch.deliveryBatchNo));
    setBatches((prev) => prev.filter((b) => b.deliveryBatchNo !== batch.deliveryBatchNo));

    const remaining = batches.filter((b) => b.deliveryBatchNo !== batch.deliveryBatchNo);
    if (remaining.length > 0) {
      setSelectedBatchNo(remaining[0].deliveryBatchNo);
    } else {
      setSelectedBatchNo('');
    }

    triggerAction(`送检单 [${batch.deliveryBatchNo}] 已成功撤销，标本已返还科室待转运池`);
  };

  // 提交新建送检单
  const handleConfirmCreateDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedPendingPacks.length === 0) {
      triggerAction('请至少勾选一个待送检标本包');
      return;
    }

    const nextBatchNum = `1812170000${batches.length + 1}`;
    const newBatch: DeliveryBatchItem = {
      id: `DELIV-${Date.now()}`,
      deliveryBatchNo: nextBatchNum,
      status: '已送检',
      applyHospital: newApplyHospital,
      deliveryTime: '2026-10-26 11:45:00',
      receiveHospital: newReceiveHospital,
      deliverer: newDeliverer,
      vehiclePlate: newVehicle,
      boxTemperature: '4.1℃',
      itemCount: 4,
    };

    // 自动追加该批次下的标本
    const newSampleItems: DeliveryDetailItem[] = [
      {
        id: `DLD-NEW-01`,
        patientName: '张梓轩',
        patientType: '住院',
        medicalRecordNo: '1812220199',
        barcode: '0011812170051',
        sampleType: '全血',
        testItem: '血常规5分类(XCGWFL)',
        applyDept: '儿科',
        doctor: '陈欣欣主治',
        deliveryBatchNo: nextBatchNum,
        tubeContainer: '紫头管 (EDTA-K2)',
        status: '已送检',
      },
      {
        id: `DLD-NEW-02`,
        patientName: '李欣怡',
        patientType: '住院',
        medicalRecordNo: '1812220202',
        barcode: '0011812170052',
        sampleType: '血清',
        testItem: '全套生化+电解质',
        applyDept: '普外科',
        doctor: '李明哲主治',
        deliveryBatchNo: nextBatchNum,
        tubeContainer: '黄头管 (促凝胶SST)',
        status: '已送检',
      },
    ];

    setBatches((prev) => [newBatch, ...prev]);
    setDetails((prev) => [...prev, ...newSampleItems]);
    setPendingPool((prev) =>
      prev.filter((p) => !selectedPendingPacks.includes(p.packageBarcode))
    );
    setSelectedBatchNo(nextBatchNum);
    setIsDeliveryModalOpen(false);

    triggerAction(`标本送检单 [${nextBatchNum}] 已成功创建！由送检人 ${newDeliverer} 负责转运`);
  };

  // 重置筛选条件
  const handleResetFilters = () => {
    setStatusFilter('all');
    setStartDate(DEFAULT_DELIVERY_START_DATE);
    setEndDate(DEFAULT_DELIVERY_END_DATE);
    setSearchKeyword('');
    triggerAction('筛选条件已恢复默认配置');
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50/60 text-slate-800 text-[13px] select-none overflow-hidden relative font-sans">
      {/* ========================================================
          1. 顶部专业指标卡片与冷链监控条 (提升医疗工作台视觉质感)
         ======================================================== */}
      <div className="bg-white border-b border-slate-200/90 px-5 py-3 shrink-0">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 font-bold shrink-0">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-slate-900 tracking-tight">标本送检与院际物流枢纽</h1>
                <span className="text-[11px] px-2 py-0.5 rounded bg-sky-50 text-sky-700 font-medium border border-sky-200">
                  冷链物流交接
                </span>
                <span className="text-[11px] text-slate-400">
                  当前基准时间: <strong className="font-mono text-slate-700">2026-10-26</strong>
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                院区/科室标本跨区域转运、多联送检交接单核验、冷链车载温度全流程追溯
              </p>
            </div>
          </div>

          {/* 4 项关键数据流微型指标 */}
          <div className="flex items-center gap-2">
            <div
              onClick={() => setActiveTab('delivery')}
              className={`px-3 py-1.5 rounded-lg border text-xs cursor-pointer transition-all ${
                activeTab === 'delivery'
                  ? 'border-sky-500 bg-sky-50/80 shadow-2xs'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="text-[11px] text-slate-500">今日送检总批次</div>
              <div className="text-base font-bold font-mono text-sky-700">
                {metrics.totalBatches} <span className="text-[11px] font-normal text-slate-400">单 ({metrics.totalTubes}管)</span>
              </div>
            </div>

            <div className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs">
              <div className="text-[11px] text-slate-500">转运中批次</div>
              <div className="text-base font-bold font-mono text-slate-900">
                {metrics.deliveredCount} <span className="text-[11px] font-normal text-slate-400">单在途</span>
              </div>
            </div>

            <div className="px-3 py-1.5 rounded-lg border border-emerald-200 bg-emerald-50/60 text-xs">
              <div className="text-[11px] text-emerald-700 font-medium">中心实验室已签收</div>
              <div className="text-base font-bold font-mono text-emerald-700">
                {metrics.receivedCount} <span className="text-[11px] font-normal text-emerald-500">单完成</span>
              </div>
            </div>

            <div
              onClick={() => setActiveTab('rejected')}
              className={`px-3 py-1.5 rounded-lg border text-xs cursor-pointer transition-all ${
                activeTab === 'rejected'
                  ? 'border-rose-500 bg-rose-50 shadow-2xs'
                  : 'border-rose-200 bg-rose-50/40 hover:border-rose-300'
              }`}
            >
              <div className="text-[11px] text-rose-600 font-medium">检验科拒收标本</div>
              <div className="text-base font-bold font-mono text-rose-600">
                {rejectedSamples.length} <span className="text-[11px] font-normal text-rose-400">份待处置</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          2. 组合筛选工具栏 (状态、时间起止、关键词与动作按钮)
         ======================================================== */}
      <div className="bg-white border-b border-slate-200 px-5 py-2.5 shrink-0 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-y-2.5 gap-x-4 text-xs">
          {/* 左侧筛选项 */}
          <div className="flex flex-wrap items-center gap-x-3.5 gap-y-2 text-slate-700">
            {/* 状态筛选下拉框 */}
            <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
              <span className="text-slate-500 font-medium">状态</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent font-medium text-slate-900 focus:outline-none cursor-pointer"
              >
                <option value="all">所有状态</option>
                <option value="已送检">已送检</option>
                <option value="已接收">已接收</option>
              </select>
            </div>

            {/* 送检时间起止范围 (近期 2026-10-26) */}
            <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="text-slate-500 font-medium">送检时间</span>
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

            {/* 快速搜索框 */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="送检单号、送检人、医院..."
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

          {/* 右侧：动作按钮组 */}
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                triggerAction(`已按当前条件执行查询：检索到 ${filteredBatches.length} 批送检记录`)
              }
              className="h-7.5 px-3.5 border border-sky-600 text-sky-700 hover:bg-sky-50 active:bg-sky-100 font-medium rounded-md text-xs transition-colors flex items-center gap-1 shadow-2xs"
            >
              <Search className="w-3 h-3" />
              <span>查询</span>
            </button>
            <button
              onClick={handleResetFilters}
              title="重置全部筛选条件"
              className="h-7.5 px-2 border border-slate-200 bg-white text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-md text-xs transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================
          3. 业务流程分段切换条与核心操作栏
         ======================================================== */}
      <div className="px-5 py-2 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
        {/* 左侧流程切换 Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200/80">
          <button
            onClick={() => setActiveTab('delivery')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
              activeTab === 'delivery'
                ? 'bg-white text-sky-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>送检标本</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                activeTab === 'delivery'
                  ? 'bg-sky-100 text-sky-800 font-bold'
                  : 'bg-slate-200/80 text-slate-600'
              }`}
            >
              {filteredBatches.length}单
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
            <span>拒收标本</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                activeTab === 'rejected' ? 'bg-rose-700 text-white font-bold' : 'bg-rose-100 text-rose-700 font-bold'
              }`}
            >
              {rejectedSamples.length}
            </span>
          </button>
        </div>

        {/* 右侧核心功能按钮 */}
        <div className="flex items-center gap-2">
          {/* 标本送检 (实心主色按钮 #0066cc) */}
          <button
            onClick={() => setIsDeliveryModalOpen(true)}
            className="h-7.5 px-3.5 bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white rounded-md text-xs font-semibold transition-colors shadow-2xs flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>标本送检</span>
          </button>

          {/* 补打清单 (蓝框白底) */}
          <button
            onClick={() => setIsReprintModalOpen(true)}
            className="h-7.5 px-3 border border-sky-600 text-sky-700 hover:bg-sky-50 active:bg-sky-100 rounded-md text-xs font-medium transition-colors flex items-center gap-1 shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>补打清单</span>
          </button>

          {/* 打印设置 (蓝框白底) */}
          <button
            onClick={() => setIsSettingModalOpen(true)}
            className="h-7.5 px-3 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-md text-xs font-medium transition-colors flex items-center gap-1"
          >
            <Settings className="w-3.5 h-3.5 text-slate-500" />
            <span>打印设置</span>
          </button>
        </div>
      </div>

      {/* ========================================================
          4. 核心双栏工作台：左侧【送检单列表】 + 右侧【送检明细列表】
         ======================================================== */}
      {activeTab === 'delivery' ? (
        <div className="flex-1 flex overflow-hidden">
          {/* 左侧 Master: 送检单列表 (批次主表) */}
          <div className="w-[42%] min-w-[390px] max-w-[520px] border-r border-slate-200 flex flex-col bg-white overflow-hidden shrink-0 shadow-[1px_0_2px_rgba(0,0,0,0.02)]">
            <div className="px-4 py-2.5 bg-slate-100/90 border-b border-slate-200 font-bold text-xs text-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-sky-600" />
                <span>送检单列表 (转运主表)</span>
              </div>
              <span className="text-[11px] font-normal text-slate-500 font-mono">
                合计: <strong className="text-slate-800">{filteredBatches.length}</strong> 条
              </span>
            </div>

            <div className="flex-1 overflow-auto">
              <table className="w-full border-collapse text-[12px] text-left">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 sticky top-0 z-10 shadow-2xs">
                    <th className="px-3 py-2 border-r border-slate-200 whitespace-nowrap">状态</th>
                    <th className="px-3 py-2 border-r border-slate-200 whitespace-nowrap font-mono">送检单号</th>
                    <th className="px-3 py-2 border-r border-slate-200 whitespace-nowrap">申请医院</th>
                    <th className="px-3 py-2 border-r border-slate-200 whitespace-nowrap">送检时间</th>
                    <th className="px-3 py-2 border-r border-slate-200 whitespace-nowrap">接收医院</th>
                    <th className="px-3 py-2 border-r border-slate-200 whitespace-nowrap">送检人</th>
                    <th className="px-3 py-2 text-center whitespace-nowrap">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-sans">
                  {filteredBatches.map((batch, idx) => {
                    const isSelected = selectedBatchNo === batch.deliveryBatchNo;
                    const isReceived = batch.status === '已接收';

                    return (
                      <tr
                        key={batch.id || idx}
                        onClick={() => setSelectedBatchNo(batch.deliveryBatchNo)}
                        className={`hover:bg-sky-50/70 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-sky-50/90 font-medium border-l-4 border-l-sky-600'
                            : idx % 2 === 1
                            ? 'bg-slate-50/30'
                            : 'bg-white'
                        }`}
                      >
                        {/* 状态 */}
                        <td className="px-3 py-2.5 border-r border-slate-100 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-bold ${
                              isReceived
                                ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                                : 'text-sky-700 bg-sky-50 border border-sky-200'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                isReceived ? 'bg-emerald-500' : 'bg-sky-500 animate-pulse'
                              }`}
                            />
                            {batch.status}
                          </span>
                        </td>

                        {/* 送检单号 */}
                        <td className="px-3 py-2.5 border-r border-slate-100 whitespace-nowrap font-mono font-bold text-slate-900">
                          {batch.deliveryBatchNo}
                          {batch.itemCount && (
                            <span className="block text-[10px] text-slate-400 font-normal">
                              含标本: {batch.itemCount} 管
                            </span>
                          )}
                        </td>

                        {/* 申请医院 */}
                        <td className="px-3 py-2.5 border-r border-slate-100 whitespace-nowrap text-slate-700 max-w-[110px] truncate" title={batch.applyHospital}>
                          {batch.applyHospital}
                        </td>

                        {/* 送检时间 */}
                        <td className="px-3 py-2.5 border-r border-slate-100 whitespace-nowrap font-mono text-[11px] text-slate-500">
                          {batch.deliveryTime}
                        </td>

                        {/* 接收医院 */}
                        <td className="px-3 py-2.5 border-r border-slate-100 whitespace-nowrap text-slate-700 max-w-[120px] truncate" title={batch.receiveHospital}>
                          {batch.receiveHospital}
                        </td>

                        {/* 送检人 (真实姓名) */}
                        <td className="px-3 py-2.5 border-r border-slate-100 whitespace-nowrap font-medium text-slate-800">
                          {batch.deliverer}
                        </td>

                        {/* 操作 (已送检显示蓝字撤销，已接收为空不可撤销) */}
                        <td
                          className="px-3 py-2.5 text-center whitespace-nowrap"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {!isReceived ? (
                            <button
                              onClick={() => handleRevokeDelivery(batch)}
                              className="text-sky-600 hover:text-sky-800 font-semibold text-xs hover:underline cursor-pointer"
                            >
                              撤销
                            </button>
                          ) : (
                            <span className="text-slate-300 text-[11px]">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}

                  {/* 补充空网格行 */}
                  {Array.from({ length: Math.max(0, 10 - filteredBatches.length) }).map((_, i) => (
                    <tr key={`empty-left-${i}`} className="h-8 border-b border-slate-100">
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

            <div className="border-t border-slate-200 px-4 py-2 bg-slate-50 text-[11px] text-slate-500 flex items-center justify-between shrink-0">
              <span className="flex items-center gap-1.5">
                <Thermometer className="w-3.5 h-3.5 text-sky-600" />
                <span>当前冷链箱温控：<strong className="text-emerald-600 font-mono font-bold">4.2℃ (正常)</strong></span>
              </span>
              <span className="font-mono">合计: <strong>{filteredBatches.length}</strong> 条</span>
            </div>
          </div>

          {/* 右侧 Detail: 送检明细列表 */}
          <div className="flex-1 flex flex-col bg-white overflow-hidden">
            <div className="px-5 py-2.5 bg-slate-100/90 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-3">
                <span className="font-bold text-xs text-slate-900">送检明细列表</span>
                {currentBatch && (
                  <div className="flex items-center gap-2 text-xs">
                    <span className="px-2 py-0.5 rounded bg-sky-50 border border-sky-200 text-sky-800 font-mono font-bold">
                      单号: {currentBatch.deliveryBatchNo}
                    </span>
                    <span className="text-slate-500 flex items-center gap-1 text-[11px]">
                      <span>{currentBatch.applyHospital}</span>
                      <ArrowRight className="w-3 h-3 text-slate-400" />
                      <span className="font-medium text-slate-800">{currentBatch.receiveHospital}</span>
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500">
                  当前清单共包含标本: <strong className="font-mono text-slate-900">{currentDetails.length}</strong> 管
                </span>
                <button
                  onClick={() =>
                    triggerAction(`已导出送检单 [${selectedBatchNo}] 交接凭证与标本清单（Excel 格式）`)
                  }
                  className="px-2.5 py-1 bg-white border border-slate-300 hover:bg-slate-50 rounded text-slate-700 text-xs font-medium transition-colors flex items-center gap-1 shadow-2xs"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                  <span>导出明细</span>
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto">
              <table className="w-full border-collapse text-[12px] text-left">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 sticky top-0 z-10 shadow-2xs">
                    <th className="px-4 py-2 border-r border-slate-200 whitespace-nowrap">姓名</th>
                    <th className="px-3 py-2 border-r border-slate-200 text-center whitespace-nowrap">患者类别</th>
                    <th className="px-3.5 py-2 border-r border-slate-200 whitespace-nowrap font-mono">病历号</th>
                    <th className="px-3.5 py-2 border-r border-slate-200 whitespace-nowrap font-mono">条码号</th>
                    <th className="px-3 py-2 border-r border-slate-200 whitespace-nowrap">样本类型</th>
                    <th className="px-4 py-2 border-r border-slate-200 whitespace-nowrap">申请项目</th>
                    <th className="px-3.5 py-2 border-r border-slate-200 whitespace-nowrap">申请科室</th>
                    <th className="px-3.5 py-2 whitespace-nowrap">申请医生</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-sans">
                  {currentDetails.length > 0 ? (
                    currentDetails.map((detail, idx) => (
                      <tr
                        key={detail.id || idx}
                        className={`hover:bg-sky-50/60 transition-colors ${
                          idx % 2 === 1 ? 'bg-slate-50/40' : 'bg-white'
                        }`}
                      >
                        {/* 姓名 (真实患者姓名) */}
                        <td className="px-4 py-2.5 border-r border-slate-100 whitespace-nowrap font-bold text-slate-900">
                          {detail.patientName}
                        </td>

                        {/* 患者类别 */}
                        <td className="px-3 py-2.5 border-r border-slate-100 text-center whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                              detail.patientType === '住院'
                                ? 'bg-sky-50 text-sky-700 border border-sky-200'
                                : detail.patientType === '急诊'
                                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                : 'bg-slate-100 text-slate-700 border border-slate-200'
                            }`}
                          >
                            {detail.patientType}
                          </span>
                        </td>

                        {/* 病历号 */}
                        <td className="px-3.5 py-2.5 border-r border-slate-100 whitespace-nowrap font-mono text-slate-700">
                          {detail.medicalRecordNo}
                        </td>

                        {/* 条码号 */}
                        <td className="px-3.5 py-2.5 border-r border-slate-100 whitespace-nowrap font-mono font-bold text-sky-700">
                          {detail.barcode}
                        </td>

                        {/* 样本类型 */}
                        <td className="px-3 py-2.5 border-r border-slate-100 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1.5 font-medium text-slate-800">
                            <span
                              className={`w-2 h-2 rounded-full ${
                                detail.sampleType === '全血'
                                  ? 'bg-rose-500'
                                  : detail.sampleType === '血清'
                                  ? 'bg-amber-400'
                                  : 'bg-sky-500'
                              }`}
                            />
                            {detail.sampleType}
                          </span>
                        </td>

                        {/* 申请项目 */}
                        <td className="px-4 py-2.5 border-r border-slate-100 whitespace-nowrap">
                          <span className="font-semibold text-slate-900">{detail.testItem}</span>
                          {detail.tubeContainer && (
                            <span className="block text-[10px] text-slate-400 font-mono">
                              容器: {detail.tubeContainer}
                            </span>
                          )}
                        </td>

                        {/* 申请科室 */}
                        <td className="px-3.5 py-2.5 border-r border-slate-100 whitespace-nowrap text-slate-600 font-medium">
                          {detail.applyDept}
                        </td>

                        {/* 申请医生 (真实医生全名) */}
                        <td className="px-3.5 py-2.5 whitespace-nowrap text-slate-600 font-medium">
                          {detail.doctor}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="py-16 text-center text-slate-400">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Send className="w-8 h-8 text-slate-300" />
                          <span>请在左侧列表中选择一个送检单号以查看其对应的随箱标本明细</span>
                        </div>
                      </td>
                    </tr>
                  )}

                  {/* 补充空网格行 */}
                  {Array.from({ length: Math.max(0, 10 - currentDetails.length) }).map((_, i) => (
                    <tr key={`empty-right-${i}`} className="h-8 border-b border-slate-100">
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

            {/* 底部物流追踪信息 */}
            <div className="border-t border-slate-200 px-5 py-2.5 bg-slate-50 text-xs text-slate-500 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <span className="flex items-center gap-1 text-sky-700 font-medium">
                  <Truck className="w-3.5 h-3.5" />
                  <span>
                    冷链转运车载：<strong>{currentBatch?.vehiclePlate || '粤A·E8821'}</strong>
                  </span>
                </span>
                <span className="text-slate-300">|</span>
                <span className="text-slate-600">
                  送检交接人：<strong>{currentBatch?.deliverer || '李明辉'}</strong>
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                全程冷链物流闭环监测系统 V2.6
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* 拒收标本视图 */
        <div className="flex-1 flex flex-col bg-white overflow-hidden p-6">
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-5 mb-5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-rose-100 flex items-center justify-center text-rose-600 shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-rose-900 text-sm">检验科拒收标本管理中心</h3>
              <p className="text-xs text-rose-700 mt-1">
                送检过程中发现有 1 份标本未通过检验科初审签收（溶血/温控超标）。请病区及物流责任人及时重新采样或退回处置。
              </p>
            </div>
          </div>

          <div className="border border-slate-200 rounded-lg overflow-hidden flex-1">
            <table className="w-full border-collapse text-xs text-left">
              <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-2.5">标本条码</th>
                  <th className="px-3 py-2.5">患者姓名</th>
                  <th className="px-3 py-2.5">病区/床号</th>
                  <th className="px-3 py-2.5">送检单号</th>
                  <th className="px-4 py-2.5">检验项目</th>
                  <th className="px-4 py-2.5 text-rose-700">拒收原因</th>
                  <th className="px-3.5 py-2.5">检验师</th>
                  <th className="px-3.5 py-2.5">拒收时间</th>
                  <th className="px-3 py-2.5 text-center">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rejectedSamples.map((sample) => (
                  <tr key={sample.id} className="hover:bg-rose-50/40">
                    <td className="px-4 py-3 font-mono font-bold text-slate-900">{sample.barcode}</td>
                    <td className="px-3 py-3 font-bold text-slate-900">{sample.patientName}</td>
                    <td className="px-3 py-3 text-slate-600">{sample.ward} {sample.bedNo}</td>
                    <td className="px-3 py-3 font-mono text-sky-700">{sample.deliveryBatchNo}</td>
                    <td className="px-4 py-3 text-slate-800">{sample.testItem}</td>
                    <td className="px-4 py-3 text-rose-600 font-medium max-w-xs">{sample.rejectReason}</td>
                    <td className="px-3.5 py-3 text-slate-700">{sample.rejectDoctor}</td>
                    <td className="px-3.5 py-3 font-mono text-slate-500">{sample.rejectTime}</td>
                    <td className="px-3 py-3 text-center">
                      <button
                        onClick={() => setIsRejectDrawerOpen(true)}
                        className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded font-medium text-xs transition-colors shadow-2xs"
                      >
                        闭环处置
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================
          5. 右下角悬浮提示浮窗 (严格对齐截图：有1份标本已拒收 请及时处理!)
         ======================================================== */}
      {showRejectToast && (
        <div className="fixed bottom-6 right-6 z-40 bg-white border border-rose-200 rounded-lg shadow-xl p-3.5 flex items-start gap-3 w-76 animate-slideUp">
          <div className="w-8 h-8 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0 mt-0.5">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-900 text-xs">有1份标本已拒收</h4>
              <button
                onClick={() => setShowRejectToast(false)}
                className="text-slate-400 hover:text-slate-600 p-0.5"
                title="关闭通知"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">请及时处理!</p>
            <div className="mt-2 flex items-center justify-end">
              <button
                onClick={() => {
                  setActiveTab('rejected');
                  setIsRejectDrawerOpen(true);
                }}
                className="text-xs text-sky-600 hover:text-sky-800 font-semibold hover:underline"
              >
                查看
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          6. 弹窗: 发起标本送检 (装箱转运出院)
         ======================================================== */}
      {isDeliveryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-300 w-full max-w-2xl text-slate-800 text-[13px] select-none flex flex-col overflow-hidden max-h-[90vh]">
            <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
              <div className="flex items-center gap-2">
                <Send className="w-5 h-5 text-sky-600" />
                <h3 className="font-bold text-slate-900 text-sm">发起标本送检转运单</h3>
              </div>
              <button
                onClick={() => setIsDeliveryModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmCreateDelivery} className="p-5 overflow-y-auto space-y-4">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">送检物流人员 (真实姓名)</label>
                  <select
                    value={newDeliverer}
                    onChange={(e) => setNewDeliverer(e.target.value)}
                    className="w-full h-8 px-2.5 border border-slate-300 rounded focus:border-sky-500 focus:outline-none bg-white"
                  >
                    <option value="李明辉">李明辉 (标本专线冷链物流员)</option>
                    <option value="孙晓雷">孙晓雷 (中心医院机动运输专员)</option>
                    <option value="郭浩然">郭浩然 (急救专线护师兼送检员)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">冷链转运专车 / 车牌</label>
                  <input
                    type="text"
                    value={newVehicle}
                    onChange={(e) => setNewVehicle(e.target.value)}
                    className="w-full h-8 px-2.5 border border-slate-300 rounded focus:border-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">始发医院 / 院区</label>
                  <input
                    type="text"
                    value={newApplyHospital}
                    onChange={(e) => setNewApplyHospital(e.target.value)}
                    className="w-full h-8 px-2.5 border border-slate-300 rounded focus:border-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">接收医院 / 检验中心</label>
                  <input
                    type="text"
                    value={newReceiveHospital}
                    onChange={(e) => setNewReceiveHospital(e.target.value)}
                    className="w-full h-8 px-2.5 border border-slate-300 rounded focus:border-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5 text-xs">
                  <span className="font-bold text-[#0066cc]">选择待装车转运的已打包箱 (可多选)</span>
                  <span className="text-slate-500">
                    已勾选 <strong className="text-sky-600 font-mono">{selectedPendingPacks.length}</strong> 个箱包
                  </span>
                </div>

                <div className="border border-slate-300 rounded-lg overflow-hidden max-h-48 overflow-y-auto">
                  <table className="w-full border-collapse text-xs text-left">
                    <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-300 sticky top-0">
                      <tr>
                        <th className="w-10 px-2.5 py-2 text-center">选择</th>
                        <th className="px-3 py-2 font-mono">包条码号</th>
                        <th className="px-3 py-2">出发采血科室</th>
                        <th className="px-3 py-2">打包人</th>
                        <th className="px-3 py-2">标本管数</th>
                        <th className="px-3 py-2">拟发往医院</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {pendingPool.map((candidate) => {
                        const isChecked = selectedPendingPacks.includes(candidate.packageBarcode);
                        return (
                          <tr
                            key={candidate.packageBarcode}
                            onClick={() =>
                              setSelectedPendingPacks((prev) =>
                                prev.includes(candidate.packageBarcode)
                                  ? prev.filter((b) => b !== candidate.packageBarcode)
                                  : [...prev, candidate.packageBarcode]
                              )
                            }
                            className={`hover:bg-sky-50 cursor-pointer ${
                              isChecked ? 'bg-sky-50/70 font-medium' : 'bg-white'
                            }`}
                          >
                            <td className="px-2.5 py-2 text-center" onClick={(e) => e.stopPropagation()}>
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() =>
                                  setSelectedPendingPacks((prev) =>
                                    prev.includes(candidate.packageBarcode)
                                      ? prev.filter((b) => b !== candidate.packageBarcode)
                                      : [...prev, candidate.packageBarcode]
                                  )
                                }
                                className="w-3.5 h-3.5 text-sky-600 cursor-pointer"
                              />
                            </td>
                            <td className="px-3 py-2 font-mono font-bold text-sky-700">{candidate.packageBarcode}</td>
                            <td className="px-3 py-2 text-slate-700">{candidate.fromDept}</td>
                            <td className="px-3 py-2 font-medium text-slate-800">{candidate.packer}</td>
                            <td className="px-3 py-2 font-mono text-slate-900">{candidate.itemCount} 管</td>
                            <td className="px-3 py-2 text-slate-600">{candidate.suggestHospital}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-sky-50 border border-sky-100 p-3 rounded-lg text-sky-900 text-xs">
                出车确认后将自动打印带防伪验证码的《医院标本送检多联交接单》，并同步开启车载温控探头连续记录。
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsDeliveryModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded text-slate-700 text-xs hover:bg-slate-50"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={selectedPendingPacks.length === 0}
                  className="px-5 py-2 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white rounded text-xs font-semibold shadow-2xs"
                >
                  确认生成送检单
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          7. 弹窗: 补打清单 (A4 / 多联交接清单标准纸样预览)
         ======================================================== */}
      {isReprintModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-300 w-full max-w-2xl text-slate-800 text-[13px] select-none flex flex-col overflow-hidden max-h-[90vh]">
            <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-sky-600" />
                <h3 className="font-bold text-slate-900 text-sm">补打标本送检交接凭条与清单</h3>
              </div>
              <button
                onClick={() => setIsReprintModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4">
              <div className="text-xs text-slate-600 flex items-center justify-between">
                <span>正在预览送检单：<strong className="text-sky-700 font-mono text-sm">{selectedBatchNo}</strong></span>
                <span className="text-[11px] text-slate-400">打印规格：{manifestPrinter}</span>
              </div>

              {/* A4 交接清单仿真卡片 */}
              <div className="border-2 border-slate-300 rounded-lg p-5 bg-white font-sans text-xs shadow-xs space-y-3">
                <div className="text-center pb-2 border-b border-slate-300">
                  <h2 className="text-base font-bold text-slate-900">市中心医疗集团 · 临床标本送检交接单</h2>
                  <p className="text-[11px] text-slate-500 font-mono mt-0.5">送检单号: {selectedBatchNo} · {currentBatch?.deliveryTime}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded border border-slate-200">
                  <div>始发机构: <strong>{currentBatch?.applyHospital}</strong></div>
                  <div>接收机构: <strong>{currentBatch?.receiveHospital}</strong></div>
                  <div>送检专员: <strong>{currentBatch?.deliverer}</strong></div>
                  <div>转运车号: <strong>{currentBatch?.vehiclePlate || '冷链专车'}</strong></div>
                  <div>随箱温控: <strong className="text-emerald-700">4.2℃ (合格)</strong></div>
                  <div>标本总数: <strong>{currentDetails.length} 管</strong></div>
                </div>

                {/* 标本明细缩略表 */}
                <div className="border border-slate-200 rounded overflow-hidden">
                  <table className="w-full text-[11px] text-left">
                    <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="px-2 py-1.5 font-mono">条码</th>
                        <th className="px-2 py-1.5">患者姓名</th>
                        <th className="px-2 py-1.5">样本</th>
                        <th className="px-2 py-1.5">检验项目</th>
                        <th className="px-2 py-1.5">开单科室/医生</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {currentDetails.map((item) => (
                        <tr key={item.id}>
                          <td className="px-2 py-1.5 font-mono font-bold text-sky-700">{item.barcode}</td>
                          <td className="px-2 py-1.5 font-bold text-slate-900">{item.patientName}</td>
                          <td className="px-2 py-1.5 text-slate-600">{item.sampleType}</td>
                          <td className="px-2 py-1.5 text-slate-800">{item.testItem}</td>
                          <td className="px-2 py-1.5 text-slate-600">{item.applyDept} · {item.doctor}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-200 text-xs">
                  <div className="text-slate-600">
                    送检人签名：<span className="font-bold underline text-slate-900">{currentBatch?.deliverer}</span>
                  </div>
                  <div className="text-slate-600">
                    接收人核对签名：<span className="text-slate-400">________________ (中心实验室)</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-5 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
              <button
                type="button"
                onClick={() => setIsReprintModalOpen(false)}
                className="px-4 py-2 border border-slate-300 rounded text-slate-700 text-xs hover:bg-slate-100"
              >
                取消
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsReprintModalOpen(false);
                  triggerAction(`已发送送检清单 [${selectedBatchNo}] 打印任务至 ${manifestPrinter}`);
                }}
                className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded text-xs font-semibold shadow-2xs flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>立即打印交接单 ({printCopies})</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          8. 弹窗: 打印设置
         ======================================================== */}
      {isSettingModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-300 w-full max-w-md text-slate-800 text-[13px] select-none flex flex-col overflow-hidden max-h-[90vh]">
            <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-sky-600" />
                <h3 className="font-bold text-slate-900 text-sm">标本送检清单打印配置</h3>
              </div>
              <button
                onClick={() => setIsSettingModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">默认交接清单打印机</label>
                <select
                  value={manifestPrinter}
                  onChange={(e) => setManifestPrinter(e.target.value)}
                  className="w-full h-8 px-2.5 border border-slate-300 rounded bg-white text-xs"
                >
                  <option value="HP LaserJet M404dw (检验科A4激光机)">HP LaserJet M404dw (检验科A4激光机 - 推荐)</option>
                  <option value="Epson LQ-630K (针式多联复写打印机)">Epson LQ-630K (针式多联复写打印机)</option>
                  <option value="Canon iR-ADV (病区集中一体机)">Canon iR-ADV (病区集中一体机)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">打印联数与交接版式</label>
                <select
                  value={printCopies}
                  onChange={(e) => setPrintCopies(e.target.value)}
                  className="w-full h-8 px-2.5 border border-slate-300 rounded bg-white text-xs"
                >
                  <option value="2联 (送检存根联 + 接收确认联)">2联 (送检存根联 + 接收确认联 - 推荐)</option>
                  <option value="3联 (送检联 + 接收联 + 物流归档联)">3联 (送检联 + 接收联 + 物流归档联)</option>
                  <option value="1联 (电子归档单凭证)">1联 (单页签收条)</option>
                </select>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg space-y-2 text-slate-600">
                <div className="font-semibold text-slate-800">清单功能项开关：</div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeBarcode}
                    onChange={(e) => setIncludeBarcode(e.target.checked)}
                    className="w-3.5 h-3.5 text-sky-600"
                  />
                  <span>清单每行明细打印独立条形码供接收科室扫码核对</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-3.5 h-3.5 text-sky-600" />
                  <span>自动附带车载温控曲线及冷链达标签名声明</span>
                </label>
              </div>
            </div>

            <div className="px-5 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setIsSettingModalOpen(false)}
                className="px-4 py-2 border border-slate-300 rounded text-slate-700 text-xs hover:bg-slate-100"
              >
                取消
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsSettingModalOpen(false);
                  triggerAction('标本送检打印机配置已成功保存');
                }}
                className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded text-xs font-semibold shadow-2xs"
              >
                保存设置
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          9. 抽屉: 拒收标本闭环处理
         ======================================================== */}
      {isRejectDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-rose-200 w-full max-w-lg overflow-hidden">
            <div className="px-5 py-4 border-b border-rose-100 bg-rose-50 flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-700">
                <ShieldAlert className="w-5 h-5" />
                <h3 className="font-bold text-sm">检验科拒收标本详情与复采处置</h3>
              </div>
              <button
                onClick={() => setIsRejectDrawerOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              {rejectedSamples.map((sample) => (
                <div key={sample.id} className="space-y-3">
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 grid grid-cols-2 gap-2 text-slate-700">
                    <div>患者姓名: <strong className="text-slate-900 font-bold">{sample.patientName}</strong></div>
                    <div>病区床号: <strong className="text-slate-900">{sample.ward} {sample.bedNo}</strong></div>
                    <div>条码编号: <strong className="font-mono text-sky-700">{sample.barcode}</strong></div>
                    <div>送检单号: <strong className="font-mono text-slate-900">{sample.deliveryBatchNo}</strong></div>
                    <div className="col-span-2">检验项目: <strong className="text-slate-900">{sample.testItem}</strong></div>
                  </div>

                  <div className="bg-rose-50 border border-rose-200 p-3 rounded-lg text-rose-900 space-y-1">
                    <div className="font-bold flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-rose-600" />
                      <span>拒收原因认定：</span>
                    </div>
                    <p className="pl-5 text-rose-800 leading-relaxed">{sample.rejectReason}</p>
                    <div className="pl-5 text-[11px] text-rose-600 mt-1">
                      认定医生：{sample.rejectDoctor} · {sample.rejectTime}
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg text-amber-900 text-xs">
                    <div className="font-bold">临床处置指引：</div>
                    <p className="mt-0.5">{sample.suggestAction}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="px-5 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <button
                onClick={() => setIsRejectDrawerOpen(false)}
                className="px-4 py-2 border border-slate-300 rounded text-slate-700 text-xs hover:bg-slate-100"
              >
                返回
              </button>
              <button
                onClick={() => {
                  setIsRejectDrawerOpen(false);
                  triggerAction('已向内一科护士站推送重新采血急查通知！');
                }}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded text-xs font-semibold shadow-2xs"
              >
                一键发起病区重新采集
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
