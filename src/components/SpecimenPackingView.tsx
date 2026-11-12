import React, { useState, useMemo } from 'react';
import { UserProfile } from '../types/navigation';
import {
  PackageBatchItem,
  PackageDetailItem,
  INITIAL_PACKAGES,
  INITIAL_PACKAGE_DETAILS,
  PENDING_PACK_CANDIDATES,
  DEFAULT_PACK_START_DATE,
  DEFAULT_PACK_END_DATE,
} from '../data/specimenPackingData';
import {
  Search,
  Printer,
  Settings,
  Calendar,
  X,
  Plus,
  Package,
  Barcode,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Truck,
  Box,
  FileSpreadsheet,
  ArrowRight,
  ShieldCheck,
  Thermometer,
  Layers,
  ChevronRight,
  Clock,
  Check,
} from 'lucide-react';

interface SpecimenPackingViewProps {
  user?: UserProfile;
  triggerAction: (msg: string) => void;
}

export const SpecimenPackingView: React.FC<SpecimenPackingViewProps> = ({
  user,
  triggerAction,
}) => {
  // 1. 包列表与包明细数据源
  const [packages, setPackages] = useState<PackageBatchItem[]>(INITIAL_PACKAGES);
  const [details, setDetails] = useState<PackageDetailItem[]>(INITIAL_PACKAGE_DETAILS);
  const [candidatePool, setCandidatePool] = useState<PackageDetailItem[]>(PENDING_PACK_CANDIDATES);

  // 2. 顶部工具栏筛选条件
  const [startDate, setStartDate] = useState<string>(DEFAULT_PACK_START_DATE);
  const [endDate, setEndDate] = useState<string>(DEFAULT_PACK_END_DATE);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  // 3. 当前选中的包条码 (默认选中第一条 18121700001)
  const [selectedPackageBarcode, setSelectedPackageBarcode] = useState<string>(
    INITIAL_PACKAGES[0]?.packageBarcode || '18121700001'
  );

  // 4. 弹窗状态
  const [isPackModalOpen, setIsPackModalOpen] = useState(false);
  const [isReprintModalOpen, setIsReprintModalOpen] = useState(false);
  const [isSettingModalOpen, setIsSettingModalOpen] = useState(false);

  // 5. 新建打包表单状态
  const [newPacker, setNewPacker] = useState('陈晓琳');
  const [newDestination, setNewDestination] = useState('检验科中心生化室');
  const [newFromDept, setNewFromDept] = useState('内科病区采血站');
  const [selectedCandidateIds, setSelectedCandidateIds] = useState<string[]>([
    'CAND-01',
    'CAND-02',
  ]);

  // 6. 打印设置状态
  const [packPrinter, setPackPrinter] = useState('TSC TX200 (病区打包标签专用机)');
  const [packLabelSize, setPackLabelSize] = useState('80mm × 50mm (箱签/包签大标)');

  // 统计指标
  const metrics = useMemo(() => {
    const totalPacks = packages.length;
    const packedCount = packages.filter((p) => p.status === '已打包').length;
    const deliveredCount = packages.filter((p) => p.status === '已送检').length;
    const totalTubes = details.length;
    return { totalPacks, packedCount, deliveredCount, totalTubes };
  }, [packages, details]);

  // 过滤后的包列表
  const filteredPackages = useMemo(() => {
    return packages.filter((pkg) => {
      if (statusFilter !== 'all' && pkg.status !== statusFilter) return false;
      if (searchKeyword.trim()) {
        const kw = searchKeyword.trim().toLowerCase();
        const match =
          pkg.packageBarcode.toLowerCase().includes(kw) ||
          pkg.packer.toLowerCase().includes(kw) ||
          pkg.destinationDept.toLowerCase().includes(kw) ||
          (pkg.transferBoxNo && pkg.transferBoxNo.toLowerCase().includes(kw));
        if (!match) return false;
      }
      return true;
    });
  }, [packages, statusFilter, searchKeyword]);

  // 当前选中包对象与明细
  const currentPackage = useMemo(() => {
    return packages.find((p) => p.packageBarcode === selectedPackageBarcode) || packages[0];
  }, [packages, selectedPackageBarcode]);

  const currentDetails = useMemo(() => {
    return details.filter((d) => d.packageBarcode === selectedPackageBarcode);
  }, [details, selectedPackageBarcode]);

  // 撤销打包操作
  const handleRevokePackage = (pkg: PackageBatchItem) => {
    if (pkg.status === '已送检') {
      triggerAction(`包 [${pkg.packageBarcode}] 处于已送检状态，物流已锁定不可撤销！`);
      return;
    }

    const revokedItems = details.filter((d) => d.packageBarcode === pkg.packageBarcode);
    setCandidatePool((prev) => [
      ...prev,
      ...revokedItems.map((item) => ({ ...item, packageBarcode: '' })),
    ]);
    setDetails((prev) => prev.filter((d) => d.packageBarcode !== pkg.packageBarcode));
    setPackages((prev) => prev.filter((p) => p.packageBarcode !== pkg.packageBarcode));

    const remaining = packages.filter((p) => p.packageBarcode !== pkg.packageBarcode);
    if (remaining.length > 0) {
      setSelectedPackageBarcode(remaining[0].packageBarcode);
    } else {
      setSelectedPackageBarcode('');
    }

    triggerAction(`包条码 [${pkg.packageBarcode}] 已成功撤销，内含 ${revokedItems.length} 份标本已释放重回待打包池`);
  };

  // 提交新建打包
  const handleConfirmCreatePackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCandidateIds.length === 0) {
      triggerAction('请勾选至少一项要装箱打包的标本');
      return;
    }

    const nextBatchNum = `1812170000${packages.length + 1}`;
    const packedCandidates = candidatePool.filter((c) => selectedCandidateIds.includes(c.id));

    const newPackage: PackageBatchItem = {
      id: `PKG-${Date.now()}`,
      status: '已打包',
      packageBarcode: nextBatchNum,
      packer: newPacker,
      packTime: '2026-10-26 11:30:00',
      itemCount: packedCandidates.length,
      fromDept: newFromDept,
      destinationDept: newDestination,
      transferBoxNo: `BOX-0${packages.length + 1}`,
    };

    const newDetails: PackageDetailItem[] = packedCandidates.map((c) => ({
      ...c,
      packageBarcode: nextBatchNum,
      specimenStatus: '已打包',
    }));

    setPackages((prev) => [newPackage, ...prev]);
    setDetails((prev) => [...newDetails, ...prev]);
    setCandidatePool((prev) => prev.filter((c) => !selectedCandidateIds.includes(c.id)));
    setSelectedPackageBarcode(nextBatchNum);
    setIsPackModalOpen(false);
    setSelectedCandidateIds([]);

    triggerAction(`标本打包完成！已生成新包条码 [${nextBatchNum}]，包含 ${packedCandidates.length} 份标本`);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50/60 text-slate-800 text-[13px] select-none overflow-hidden relative">
      {/* ========================================================
          1. 顶部专业指标卡片与批次状态栏 (提升视觉质感与工作概览)
         ======================================================== */}
      <div className="bg-white border-b border-slate-200/90 px-5 py-3 shrink-0">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 font-bold shrink-0">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-slate-900 tracking-tight">标本打包与转运交接</h1>
                <span className="text-[11px] px-2 py-0.5 rounded bg-sky-50 text-sky-700 font-medium border border-sky-200">
                  冷链标本流转枢纽
                </span>
                <span className="text-[11px] text-slate-400">
                  基准时间: <strong className="font-mono text-slate-700">2026-10-26</strong>
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                病区/门诊标本批量装箱、打包装袋生成唯一包号、外箱冷链标签打印与送检交接
              </p>
            </div>
          </div>

          {/* 4 项打包流转数据微卡片 */}
          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs">
              <div className="text-[11px] text-slate-500">今日打包总数</div>
              <div className="text-base font-bold font-mono text-slate-900">
                {metrics.totalPacks} <span className="text-[11px] font-normal text-slate-400">批 ({metrics.totalTubes}管)</span>
              </div>
            </div>

            <div className="px-3 py-1.5 rounded-lg border border-sky-200 bg-sky-50/50 text-xs">
              <div className="text-[11px] text-sky-700 font-medium">病区待送包</div>
              <div className="text-base font-bold font-mono text-sky-700">
                {metrics.packedCount} <span className="text-[11px] font-normal text-sky-500">批待转运</span>
              </div>
            </div>

            <div className="px-3 py-1.5 rounded-lg border border-emerald-200 bg-emerald-50/50 text-xs">
              <div className="text-[11px] text-emerald-700 font-medium">冷链在途送检</div>
              <div className="text-base font-bold font-mono text-emerald-700">
                {metrics.deliveredCount} <span className="text-[11px] font-normal text-emerald-500">批运送中</span>
              </div>
            </div>

            <div className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs hidden sm:block">
              <div className="text-[11px] text-slate-500 flex items-center gap-1">
                <Thermometer className="w-3 h-3 text-sky-600" />
                <span>转运箱温控</span>
              </div>
              <div className="text-base font-bold font-mono text-emerald-600">
                4.2℃ <span className="text-[11px] font-normal text-slate-400">(正常)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          2. 工具操作栏 (对齐截图控件，重构排版与交互层次)
         ======================================================== */}
      <div className="bg-white border-b border-slate-200 px-5 py-2.5 shrink-0 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-y-2.5 gap-x-4 text-xs">
          {/* 左侧：打包时间与状态筛选 */}
          <div className="flex flex-wrap items-center gap-x-3.5 gap-y-2 text-slate-700">
            {/* 打包时间范围选择 (已更新为近期时间) */}
            <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="text-slate-500 font-medium">打包时间</span>
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

            {/* 状态分类切换 */}
            <div className="flex items-center gap-1 border border-slate-200 rounded-md p-0.5 bg-slate-50">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-2.5 py-0.5 rounded text-xs transition-colors ${
                  statusFilter === 'all'
                    ? 'bg-white text-slate-900 font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                全部批次
              </button>
              <button
                onClick={() => setStatusFilter('已打包')}
                className={`px-2.5 py-0.5 rounded text-xs transition-colors ${
                  statusFilter === '已打包'
                    ? 'bg-white text-sky-700 font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                已打包 ({metrics.packedCount})
              </button>
              <button
                onClick={() => setStatusFilter('已送检')}
                className={`px-2.5 py-0.5 rounded text-xs transition-colors ${
                  statusFilter === '已送检'
                    ? 'bg-white text-emerald-700 font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                已送检 ({metrics.deliveredCount})
              </button>
            </div>

            {/* 快速搜索框 */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="包条码、打包人、科室..."
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

          {/* 右侧：动作按钮组 (与截图对应：[查询], [标本打包], [补打条码], [打印设置]) */}
          <div className="flex items-center gap-2">
            {/* 查询 (蓝框白底) */}
            <button
              onClick={() =>
                triggerAction(`已按打包时间 ${startDate} ~ ${endDate} 检索出 ${filteredPackages.length} 批数据`)
              }
              className="h-7.5 px-3.5 border border-sky-600 text-sky-700 hover:bg-sky-50 active:bg-sky-100 font-medium rounded-md text-xs transition-colors flex items-center gap-1 shadow-2xs"
            >
              <Search className="w-3 h-3" />
              <span>查询</span>
            </button>

            {/* 标本打包 (实心主色按钮 #0066cc) */}
            <button
              onClick={() => setIsPackModalOpen(true)}
              className="h-7.5 px-3.5 bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white rounded-md text-xs font-semibold transition-colors shadow-2xs flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>标本打包</span>
            </button>

            {/* 补打条码 (蓝框白底) */}
            <button
              onClick={() => setIsReprintModalOpen(true)}
              className="h-7.5 px-3 border border-sky-600 text-sky-700 hover:bg-sky-50 active:bg-sky-100 rounded-md text-xs font-medium transition-colors flex items-center gap-1 shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>补打条码</span>
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
      </div>

      {/* ========================================================
          3. 双栏 Master-Detail 现代化工作台 (包列表 + 包明细)
         ======================================================== */}
      <div className="flex-1 flex overflow-hidden">
        {/* 左侧 Master: 包列表 */}
        <div className="w-[34%] min-w-[340px] max-w-[440px] border-r border-slate-200 flex flex-col bg-white overflow-hidden shrink-0 shadow-[1px_0_2px_rgba(0,0,0,0.02)]">
          {/* 包列表表头 */}
          <div className="px-4 py-2.5 bg-slate-100/90 border-b border-slate-200 font-bold text-xs text-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Box className="w-3.5 h-3.5 text-sky-600" />
              <span>包列表 (批次主表)</span>
            </div>
            <span className="text-[11px] font-normal text-slate-500 font-mono">
              显示 <strong className="text-slate-800">{filteredPackages.length}</strong> 批
            </span>
          </div>

          {/* 表格容器 */}
          <div className="flex-1 overflow-auto">
            <table className="w-full border-collapse text-[12px] text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 sticky top-0 z-10">
                  <th className="px-3 py-2 border-r border-slate-200 whitespace-nowrap">状态</th>
                  <th className="px-3 py-2 border-r border-slate-200 whitespace-nowrap font-mono">包条码</th>
                  <th className="px-3 py-2 border-r border-slate-200 whitespace-nowrap">打包人</th>
                  <th className="px-3 py-2 border-r border-slate-200 whitespace-nowrap">打包时间</th>
                  <th className="px-3 py-2 text-center whitespace-nowrap">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-sans">
                {filteredPackages.map((pkg, idx) => {
                  const isSelected = selectedPackageBarcode === pkg.packageBarcode;
                  const isDelivered = pkg.status === '已送检';

                  return (
                    <tr
                      key={pkg.id || idx}
                      onClick={() => setSelectedPackageBarcode(pkg.packageBarcode)}
                      className={`hover:bg-sky-50/70 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-sky-50/90 font-medium border-l-4 border-l-sky-600'
                          : idx % 2 === 1
                          ? 'bg-slate-50/30'
                          : 'bg-white'
                      }`}
                    >
                      {/* 状态 (已送检显示醒目绿色，已打包显示常规色) */}
                      <td className="px-3 py-2.5 border-r border-slate-100 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-bold ${
                            isDelivered
                              ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                              : 'text-slate-700 bg-slate-100 border border-slate-200'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isDelivered ? 'bg-emerald-500' : 'bg-slate-400'
                            }`}
                          />
                          {pkg.status}
                        </span>
                      </td>

                      {/* 包条码 */}
                      <td className="px-3 py-2.5 border-r border-slate-100 whitespace-nowrap font-mono font-bold text-slate-900">
                        {pkg.packageBarcode}
                        {pkg.transferBoxNo && (
                          <span className="block text-[10px] text-slate-400 font-normal">
                            箱号: {pkg.transferBoxNo}
                          </span>
                        )}
                      </td>

                      {/* 打包人 */}
                      <td className="px-3 py-2.5 border-r border-slate-100 whitespace-nowrap text-slate-700">
                        {pkg.packer}
                      </td>

                      {/* 打包时间 (更新为近期时间) */}
                      <td className="px-3 py-2.5 border-r border-slate-100 whitespace-nowrap font-mono text-[11px] text-slate-500">
                        {pkg.packTime}
                      </td>

                      {/* 操作 (已打包显示蓝字撤销，已送检为空不可撤销) */}
                      <td
                        className="px-3 py-2.5 text-center whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {!isDelivered ? (
                          <button
                            onClick={() => handleRevokePackage(pkg)}
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

                {/* 空网格补充行 */}
                {Array.from({ length: Math.max(0, 10 - filteredPackages.length) }).map((_, i) => (
                  <tr key={`empty-left-${i}`} className="h-8 border-b border-slate-100">
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
            <span>当前选中包：<strong className="font-mono text-sky-700">{selectedPackageBarcode || '未选择'}</strong></span>
            <span>共 {packages.length} 批次记录</span>
          </div>
        </div>

        {/* 右侧 Detail: 包明细与装箱清单 */}
        <div className="flex-1 flex flex-col bg-white overflow-hidden">
          {/* 包明细标题与当前包概览卡片 */}
          <div className="px-5 py-2.5 bg-slate-100/90 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-3">
              <span className="font-bold text-xs text-slate-900">包明细 (装箱标本明细清单)</span>
              {currentPackage && (
                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2 py-0.5 rounded bg-sky-50 border border-sky-200 text-sky-800 font-mono font-bold">
                    包号: {currentPackage.packageBarcode}
                  </span>
                  <span className="text-slate-500 flex items-center gap-1">
                    <span>{currentPackage.fromDept}</span>
                    <ArrowRight className="w-3 h-3 text-slate-400" />
                    <span className="font-medium text-slate-800">{currentPackage.destinationDept}</span>
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500">
                本包共包含标本: <strong className="font-mono text-slate-900">{currentDetails.length}</strong> 管
              </span>
              <button
                onClick={() =>
                  triggerAction(`已导出包 [${selectedPackageBarcode}] 标本转运交接单（Excel / PDF 格式）`)
                }
                className="px-2.5 py-1 bg-white border border-slate-300 hover:bg-slate-50 rounded text-slate-700 text-xs font-medium transition-colors flex items-center gap-1 shadow-2xs"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                <span>导出交接单</span>
              </button>
            </div>
          </div>

          {/* 明细表格 */}
          <div className="flex-1 overflow-auto">
            <table className="w-full border-collapse text-[12px] text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 sticky top-0 z-10 shadow-2xs">
                  <th className="px-4 py-2 border-r border-slate-200 whitespace-nowrap">患者姓名</th>
                  <th className="px-3 py-2 border-r border-slate-200 text-center whitespace-nowrap">患者类别</th>
                  <th className="px-3.5 py-2 border-r border-slate-200 whitespace-nowrap font-mono">病历号</th>
                  <th className="px-3.5 py-2 border-r border-slate-200 whitespace-nowrap font-mono">试管条码号</th>
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
                      {/* 姓名 */}
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
                              ? 'bg-rose-50 text-rose-700 border border-rose-200 font-bold'
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

                      {/* 试管条码号 */}
                      <td className="px-3.5 py-2.5 border-r border-slate-100 whitespace-nowrap font-mono font-bold text-sky-700">
                        {detail.barcode}
                      </td>

                      {/* 样本类型 */}
                      <td className="px-3 py-2.5 border-r border-slate-100 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 font-medium text-slate-800">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              detail.sampleType === '全血'
                                ? 'bg-purple-500'
                                : detail.sampleType === '血清'
                                ? 'bg-amber-500'
                                : detail.sampleType === '血浆'
                                ? 'bg-sky-500'
                                : 'bg-yellow-400'
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

                      {/* 申请医生 */}
                      <td className="px-3.5 py-2.5 whitespace-nowrap text-slate-600 font-medium">
                        {detail.doctor}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="py-16 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Package className="w-8 h-8 text-slate-300" />
                        <span>请在左侧列表中点击选择一个标本包条形码以查看对应的装箱标本明细</span>
                      </div>
                    </td>
                  </tr>
                )}

                {/* 补充空网格行，保持整齐一致的医疗桌面端风格 */}
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

          {/* 底部状态提示条 */}
          <div className="border-t border-slate-200 px-5 py-2.5 bg-slate-50 text-xs text-slate-500 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <span className="flex items-center gap-1 text-emerald-600 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>装箱核对完成 (已逐一比对试管条码与申请医嘱)</span>
              </span>
              <span className="text-slate-300">|</span>
              <span className="text-slate-500">工友扫码封箱后将自动打印带温控RFID的外箱标签</span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">冷链转运箱监控系统 V2.4</span>
          </div>
        </div>
      </div>

      {/* ========================================================
          4. 弹窗: 发起标本装箱打包
         ======================================================== */}
      {isPackModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-300 w-full max-w-2xl text-slate-800 text-[13px] select-none flex flex-col overflow-hidden max-h-[90vh]">
            <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-sky-600" />
                <h3 className="font-bold text-slate-900 text-sm">发起标本装箱打包 (生成新包清单)</h3>
              </div>
              <button
                onClick={() => setIsPackModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmCreatePackage} className="p-5 overflow-y-auto space-y-4">
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">打包操作人</label>
                  <input
                    type="text"
                    value={newPacker}
                    onChange={(e) => setNewPacker(e.target.value)}
                    className="w-full h-8 px-2.5 border border-slate-300 rounded focus:border-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">出发科室</label>
                  <input
                    type="text"
                    value={newFromDept}
                    onChange={(e) => setNewFromDept(e.target.value)}
                    className="w-full h-8 px-2.5 border border-slate-300 rounded focus:border-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">目的检验科室</label>
                  <input
                    type="text"
                    value={newDestination}
                    onChange={(e) => setNewDestination(e.target.value)}
                    className="w-full h-8 px-2.5 border border-slate-300 rounded focus:border-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* 待打包标本选择池 */}
              <div>
                <div className="flex items-center justify-between mb-1.5 text-xs">
                  <span className="font-bold text-[#0066cc]">待打包标本池 (请勾选装箱)</span>
                  <span className="text-slate-500">
                    已勾选 <strong className="text-sky-600 font-mono">{selectedCandidateIds.length}</strong> /{' '}
                    {candidatePool.length} 管
                  </span>
                </div>

                <div className="border border-slate-300 rounded-lg overflow-hidden max-h-56 overflow-y-auto">
                  <table className="w-full border-collapse text-xs text-left">
                    <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-300 sticky top-0">
                      <tr>
                        <th className="w-10 px-2.5 py-2 text-center">选择</th>
                        <th className="px-3 py-2">患者姓名</th>
                        <th className="px-3 py-2 font-mono">试管条码号</th>
                        <th className="px-3 py-2">样本类型</th>
                        <th className="px-3 py-2">检验项目</th>
                        <th className="px-3 py-2">开单科室</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {candidatePool.length > 0 ? (
                        candidatePool.map((c) => {
                          const isChecked = selectedCandidateIds.includes(c.id);
                          return (
                            <tr
                              key={c.id}
                              onClick={() =>
                                setSelectedCandidateIds((prev) =>
                                  prev.includes(c.id) ? prev.filter((i) => i !== c.id) : [...prev, c.id]
                                )
                              }
                              className={`hover:bg-sky-50 cursor-pointer ${
                                isChecked ? 'bg-sky-50/70 font-medium' : 'bg-white'
                              }`}
                            >
                              <td
                                className="px-2.5 py-2 text-center"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() =>
                                    setSelectedCandidateIds((prev) =>
                                      prev.includes(c.id) ? prev.filter((i) => i !== c.id) : [...prev, c.id]
                                    )
                                  }
                                  className="w-3.5 h-3.5 text-sky-600 cursor-pointer"
                                />
                              </td>
                              <td className="px-3 py-2 font-bold text-slate-900">{c.patientName}</td>
                              <td className="px-3 py-2 font-mono text-sky-700">{c.barcode}</td>
                              <td className="px-3 py-2 text-slate-600">{c.sampleType}</td>
                              <td className="px-3 py-2 text-slate-800 font-medium">{c.testItem}</td>
                              <td className="px-3 py-2 text-slate-600">{c.applyDept}</td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-slate-400">
                            暂无待打包标本（已全部完成分包装箱）
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-sky-50 border border-sky-100 p-3 rounded-lg text-sky-900 text-xs">
                打包确认后系统将自动生成唯一的包条形码，并支持一键打印包外箱热敏封口条码标签。
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsPackModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded text-slate-700 text-xs hover:bg-slate-50"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={selectedCandidateIds.length === 0}
                  className="px-5 py-2 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white rounded text-xs font-semibold shadow-2xs"
                >
                  确认生成包清单 ({selectedCandidateIds.length}管)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          5. 弹窗: 补打条码 (外箱冷链标签与清单重印)
         ======================================================== */}
      {isReprintModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-300 w-full max-w-lg text-slate-800 text-[13px] select-none flex flex-col overflow-hidden max-h-[90vh]">
            <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-sky-600" />
                <h3 className="font-bold text-slate-900 text-sm">补打标本包外箱条码标签</h3>
              </div>
              <button
                onClick={() => setIsReprintModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4">
              <div className="text-xs text-slate-600">
                当前选中补打的包条形码为：<strong className="text-sky-700 font-mono text-sm">{selectedPackageBarcode}</strong>
              </div>

              {/* 80mm x 50mm 外箱大标签仿真预览卡片 */}
              <div className="border-2 border-slate-900 rounded-lg p-4 bg-white font-mono text-xs shadow-xs space-y-2">
                <div className="flex items-center justify-between border-b border-slate-300 pb-1.5 text-slate-900 font-sans">
                  <span className="font-bold text-sm">市中心医院 · 标本转运包标签</span>
                  <span className="text-[11px] px-2 py-0.2 bg-slate-900 text-white rounded font-mono">标本箱专用</span>
                </div>

                <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-700 font-sans">
                  <div>包条码号: <strong className="font-mono text-slate-900">{selectedPackageBarcode}</strong></div>
                  <div>装箱数量: <strong className="font-mono text-slate-900">{currentDetails.length} 管</strong></div>
                  <div>发往科室: {currentPackage?.destinationDept || '检验科临检/生化室'}</div>
                  <div>打包人员: {currentPackage?.packer || '陈晓琳'}</div>
                  <div className="col-span-2">打包时间: {currentPackage?.packTime || '2026-10-26 10:15:00'}</div>
                </div>

                {/* 仿真一维条形码 */}
                <div className="bg-slate-50 border border-slate-200 p-2 rounded flex flex-col items-center">
                  <div className="h-10 w-full flex items-center justify-center gap-0.5 overflow-hidden">
                    {Array.from({ length: 44 }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-full ${
                          i % 2 === 0 ? 'bg-slate-950' : 'bg-transparent'
                        } ${i % 5 === 0 ? 'w-1' : 'w-0.5'}`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-mono font-bold tracking-widest text-slate-900 mt-1">
                    *{selectedPackageBarcode}*
                  </span>
                </div>

                <div className="text-[10px] text-slate-400 text-center font-sans">
                  严禁倒置 · 冷链温度监控 2~8℃
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
                  triggerAction(`已发送包标签 [${selectedPackageBarcode}] 补打指令至 ${packPrinter}`);
                }}
                className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded text-xs font-semibold shadow-2xs flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>立即补打外箱标签</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          6. 弹窗: 打印设置
         ======================================================== */}
      {isSettingModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-300 w-full max-w-md text-slate-800 text-[13px] select-none flex flex-col overflow-hidden max-h-[90vh]">
            <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-sky-600" />
                <h3 className="font-bold text-slate-900 text-sm">标本打包标签机设置</h3>
              </div>
              <button
                onClick={() => setIsSettingModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">外箱/包标签条码机型号</label>
                <select
                  value={packPrinter}
                  onChange={(e) => setPackPrinter(e.target.value)}
                  className="w-full h-8 px-2.5 border border-slate-300 rounded bg-white text-xs"
                >
                  <option value="TSC TX200 (病区打包标签专用机)">TSC TX200 (病区打包标签专用机)</option>
                  <option value="Zebra ZD888T (冷链转运箱签)">Zebra ZD888T (冷链转运箱签)</option>
                  <option value="Postek G2108 (便携蓝牙打标机)">Postek G2108 (便携蓝牙打标机)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">外箱标签尺寸规范</label>
                <select
                  value={packLabelSize}
                  onChange={(e) => setPackLabelSize(e.target.value)}
                  className="w-full h-8 px-2.5 border border-slate-300 rounded bg-white text-xs"
                >
                  <option value="80mm × 50mm (箱签/包签大标)">80mm × 50mm (箱签/包签大标 - 标配推荐)</option>
                  <option value="60mm × 40mm (中型转运盒)">60mm × 40mm (中型转运盒)</option>
                  <option value="50mm × 30mm (试管同款微缩签)">50mm × 30mm (试管同款微缩签)</option>
                </select>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg space-y-2 text-slate-600">
                <div className="font-semibold text-slate-800">打包自动化选项：</div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-3.5 h-3.5 text-sky-600" />
                  <span>打包完成确认后立即自动吐出外箱封签</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-3.5 h-3.5 text-sky-600" />
                  <span>同时打印标本交接清单 (A4两联式)</span>
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
                  triggerAction('标本打包打印机配置已保存并生效');
                }}
                className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded text-xs font-semibold shadow-2xs"
              >
                保存设置
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
