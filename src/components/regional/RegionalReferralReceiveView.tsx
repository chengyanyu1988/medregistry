import React, { useState, useMemo } from 'react';
import {
  ReferralReceiveTableItem,
  INITIAL_REFERRAL_RECEIVE_TABLE,
} from '../../data/regionalLabData';
import { UserProfile } from '../../types/navigation';
import {
  Barcode,
  CheckCircle2,
  AlertTriangle,
  Printer,
  RefreshCw,
  Building2,
  Truck,
  XCircle,
  Clock,
  ArrowRight,
  X,
  RotateCcw,
  Ban,
  Calendar,
  FileText,
  Check,
} from '../MenuIcon';

interface RegionalReferralReceiveViewProps {
  user: UserProfile;
  triggerAction: (text: string) => void;
}

export const RegionalReferralReceiveView: React.FC<RegionalReferralReceiveViewProps> = ({
  user,
  triggerAction,
}) => {
  // Main table dataset
  const [tableData, setTableData] = useState<ReferralReceiveTableItem[]>(
    INITIAL_REFERRAL_RECEIVE_TABLE
  );

  // Selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Barcode quick scan
  const [scanBarcode, setScanBarcode] = useState('');

  // Filters (matching screenshot)
  const [hospitalFilter, setHospitalFilter] = useState('所有');
  const [statusFilter, setStatusFilter] = useState('所有');
  const [startDate, setStartDate] = useState('2026-10-30 00:00');
  const [endDate, setEndDate] = useState('2026-10-30 23:59');
  const [patientSearch, setPatientSearch] = useState('');

  // Modals
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectingItem, setRejectingItem] = useState<ReferralReceiveTableItem | null>(null);
  const [rejectReason, setRejectReason] = useState('标本严重重度溶血，游离血红蛋白干扰化学发光检测');
  const [rejectRemark, setRejectRemark] = useState('');
  const [notifyReferralDept, setNotifyReferralDept] = useState(true);

  // Revoke confirmation modal
  const [isRevokeModalOpen, setIsRevokeModalOpen] = useState(false);

  // Detail Modal (opened on row click)
  const [detailItem, setDetailItem] = useState<ReferralReceiveTableItem | null>(null);

  // Print Manifest Modal
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // Quick feedback toast
  const [feedbackToast, setFeedbackToast] = useState<{
    type: 'success' | 'warning' | 'info' | 'error';
    message: string;
  } | null>(null);

  const showToast = (message: string, type: 'success' | 'warning' | 'info' | 'error' = 'success') => {
    setFeedbackToast({ type, message });
    setTimeout(() => {
      setFeedbackToast(null);
    }, 3800);
  };

  // Hospital options from data
  const hospitalOptions = [
    '所有',
    '城东社区卫生服务中心',
    '滨江街道社区卫生服务中心',
    '科技城社区卫生服务中心',
    '康复第二分院',
  ];

  // Filtered table rows
  const filteredData = useMemo(() => {
    return tableData.filter((item) => {
      // Hospital filter
      if (hospitalFilter !== '所有' && item.deliverHospital !== hospitalFilter) {
        return false;
      }
      // Status filter
      if (statusFilter !== '所有' && item.status !== statusFilter) {
        return false;
      }
      // Patient info search (就诊号/姓名/条码/申请单号)
      if (patientSearch.trim()) {
        const query = patientSearch.trim().toLowerCase();
        const match =
          item.patientName.toLowerCase().includes(query) ||
          item.medicalRecordNo.toLowerCase().includes(query) ||
          item.barcode.toLowerCase().includes(query) ||
          item.applyNo.toLowerCase().includes(query) ||
          item.applyDoctor.toLowerCase().includes(query) ||
          item.applyItemName.toLowerCase().includes(query);
        if (!match) return false;
      }
      return true;
    });
  }, [tableData, hospitalFilter, statusFilter, patientSearch]);

  // Statistics
  const stats = useMemo(() => {
    const total = tableData.length;
    const received = tableData.filter((i) => i.status === '已接收').length;
    const rejected = tableData.filter((i) => i.status === '已拒收').length;
    const pending = tableData.filter((i) => i.status === '待签收').length;
    return { total, received, rejected, pending };
  }, [tableData]);

  // Checkbox handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredData.map((d) => d.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // 1. Barcode scanning handler (press Enter or click scan)
  const handleScanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = scanBarcode.trim();
    if (!code) {
      showToast('请输入或使用扫描枪扫描标本条码号', 'warning');
      return;
    }

    const target = tableData.find(
      (item) => item.barcode.toLowerCase() === code.toLowerCase()
    );

    if (target) {
      if (target.status === '已接收') {
        showToast(`【重复提示】条码 ${code} (${target.patientName}) 之前已完成签收，无需重复操作。`, 'info');
        triggerAction(`标本 ${code} 状态为已接收`);
      } else if (target.status === '已拒收') {
        showToast(`【拒收拦截】条码 ${code} 已被拒收退回，原因：${target.rejectionReason || '不合格标本'}`, 'error');
        triggerAction(`标本 ${code} 已被拒收拦截`);
      } else {
        // Pending -> Receive
        const updatedTarget: ReferralReceiveTableItem = {
          ...target,
          status: '已接收',
          receiveTime: '2026-10-30 09:50:18',
          receiver: user.name || '张珊',
        };
        setTableData((prev) =>
          prev.map((i) => (i.id === target.id ? updatedTarget : i))
        );
        showToast(`【扫码签收成功】条码 ${code}（${target.patientName} · ${target.applyItemName}）已入库！`);
        triggerAction(`扫码快速签收成功: ${code}`);
      }
    } else {
      showToast(`【未匹配条码】系统暂未找到条码为 ${code} 的外送标本记录，请核验条码`, 'warning');
      triggerAction(`未检索到条码: ${code}`);
    }
    setScanBarcode('');
  };

  // 2. 批量签收
  const handleBatchReceive = () => {
    if (selectedIds.length === 0) {
      // If nothing selected, prompt or receive all pending in current view
      const pendingItems = filteredData.filter((i) => i.status === '待签收');
      if (pendingItems.length === 0) {
        showToast('当前没有待签收的标本！请在表格勾选需要签收的记录。', 'info');
        return;
      }
      setTableData((prev) =>
        prev.map((item) =>
          pendingItems.some((p) => p.id === item.id)
            ? {
                ...item,
                status: '已接收',
                receiveTime: '2026-10-30 09:52:00',
                receiver: user.name || '张珊',
              }
            : item
        )
      );
      showToast(`已批量签收当前筛选列表中的 ${pendingItems.length} 份标本并自动分流！`);
      triggerAction(`批量签收了 ${pendingItems.length} 份标本`);
      return;
    }

    // Process selected
    let count = 0;
    setTableData((prev) =>
      prev.map((item) => {
        if (selectedIds.includes(item.id) && item.status !== '已接收') {
          count++;
          return {
            ...item,
            status: '已接收',
            receiveTime: '2026-10-30 09:52:00',
            receiver: user.name || '张珊',
          };
        }
        return item;
      })
    );

    if (count > 0) {
      showToast(`成功批量签收所选 ${count} 份标本，已同步生成分检条形码！`);
      triggerAction(`成功批量签收 ${count} 份标本`);
    } else {
      showToast('所选标本已处于签收状态，无需重复操作。', 'info');
    }
  };

  // 3. 撤销签收
  const handleOpenRevoke = () => {
    const receivedSelected = tableData.filter(
      (item) => selectedIds.includes(item.id) && item.status === '已接收'
    );
    if (receivedSelected.length === 0) {
      showToast('请在表格中勾选处于【已接收】状态的标本后再执行撤销签收！', 'warning');
      return;
    }
    setIsRevokeModalOpen(true);
  };

  const handleConfirmRevoke = () => {
    let count = 0;
    setTableData((prev) =>
      prev.map((item) => {
        if (selectedIds.includes(item.id) && item.status === '已接收') {
          count++;
          return {
            ...item,
            status: '待签收',
            receiveTime: undefined,
            receiver: undefined,
          };
        }
        return item;
      })
    );
    setIsRevokeModalOpen(false);
    showToast(`已成功撤销 ${count} 份标本的签收状态，恢复为待签收！`);
    triggerAction(`撤销了 ${count} 份标本的签收状态`);
  };

  // 4. 拒收
  const handleOpenReject = (item?: ReferralReceiveTableItem) => {
    if (item) {
      setRejectingItem(item);
      setIsRejectModalOpen(true);
      return;
    }

    if (selectedIds.length === 0) {
      showToast('请在表格中勾选需要拒收的标本行，或点击操作列的拒收！', 'warning');
      return;
    }

    const firstSelected = tableData.find((i) => i.id === selectedIds[0]);
    if (firstSelected) {
      setRejectingItem(firstSelected);
      setIsRejectModalOpen(true);
    }
  };

  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingItem) return;

    const fullReason = rejectRemark
      ? `${rejectReason}（${rejectRemark}）`
      : rejectReason;

    const targetIds = selectedIds.includes(rejectingItem.id)
      ? selectedIds
      : [rejectingItem.id];

    setTableData((prev) =>
      prev.map((item) =>
        targetIds.includes(item.id)
          ? {
              ...item,
              status: '已拒收',
              rejectionReason: fullReason,
              receiver: user.name || '张珊',
              receiveTime: '2026-10-30 09:55:00',
            }
          : item
      )
    );

    setIsRejectModalOpen(false);
    setRejectRemark('');
    showToast(
      `已标记拒收 ${targetIds.length} 份标本，并${notifyReferralDept ? '已同步向基层送检端推送补采通报' : ''}！`,
      'error'
    );
    triggerAction(`标本拒收处理成功: ${rejectingItem.barcode}`);
  };

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-slate-50 overflow-hidden font-sans">
      {/* Toast Notification */}
      {feedbackToast && (
        <div className="fixed top-16 right-6 z-50 animate-bounceIn shadow-xl">
          <div
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg border text-xs font-medium shadow-md ${
              feedbackToast.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : feedbackToast.type === 'error'
                ? 'bg-red-50 text-red-800 border-red-300'
                : feedbackToast.type === 'warning'
                ? 'bg-amber-50 text-amber-800 border-amber-300'
                : 'bg-blue-50 text-blue-800 border-blue-300'
            }`}
          >
            {feedbackToast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
            {feedbackToast.type === 'error' && <XCircle className="w-4 h-4 text-red-600 shrink-0" />}
            {feedbackToast.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />}
            {feedbackToast.type === 'info' && <Clock className="w-4 h-4 text-blue-600 shrink-0" />}
            <span>{feedbackToast.message}</span>
            <button
              onClick={() => setFeedbackToast(null)}
              className="ml-2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Top Main Bar: Barcode Scanning & Core Buttons (Matches screenshot image_08d04488.png) */}
      <div className="bg-white border-b border-slate-200 px-5 py-3 shrink-0 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Barcode input & buttons group */}
          <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[320px]">
            <form onSubmit={handleScanSubmit} className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-700 whitespace-nowrap">
                条码号
              </span>
              <div className="relative w-64 md:w-80">
                <input
                  type="text"
                  placeholder="扫码标本条码号接收"
                  value={scanBarcode}
                  onChange={(e) => setScanBarcode(e.target.value)}
                  autoFocus
                  className="w-full px-3 py-1.5 text-xs text-slate-800 bg-white border border-slate-300 rounded focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-slate-400 font-mono"
                />
                {scanBarcode && (
                  <button
                    type="button"
                    onClick={() => setScanBarcode('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </form>

            {/* Core Action Buttons (Exact style: 批量签收 solid blue, 撤销签收 white with blue border, 拒收 white with blue border) */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleBatchReceive}
                className="px-4 py-1.5 bg-[#1890ff] hover:bg-blue-600 active:bg-blue-700 text-white text-xs font-medium rounded transition-colors shadow-2xs flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>批量签收</span>
                {selectedIds.length > 0 && (
                  <span className="bg-blue-800/40 text-[10px] px-1.5 py-0.2 rounded-full">
                    {selectedIds.length}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={handleOpenRevoke}
                className="px-3.5 py-1.5 bg-white border border-[#1890ff] text-[#1890ff] hover:bg-blue-50 active:bg-blue-100 text-xs font-medium rounded transition-colors shadow-2xs flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>撤销签收</span>
              </button>

              <button
                type="button"
                onClick={() => handleOpenReject()}
                className="px-3.5 py-1.5 bg-white border border-[#1890ff] text-[#1890ff] hover:bg-rose-50 hover:text-red-600 hover:border-red-400 text-xs font-medium rounded transition-colors shadow-2xs flex items-center gap-1.5"
              >
                <Ban className="w-3.5 h-3.5" />
                <span>拒收</span>
              </button>
            </div>
          </div>

          {/* Right Status Summary & Secondary actions */}
          <div className="flex items-center gap-3 text-xs shrink-0">
            <div className="hidden lg:flex items-center gap-3 px-3 py-1 bg-slate-50 border border-slate-200 rounded text-slate-600 text-[11px]">
              <span>
                今日外送: <strong className="font-mono text-slate-800">{stats.total}</strong>
              </span>
              <span className="text-slate-300">|</span>
              <span className="text-emerald-700">
                已接收: <strong className="font-mono">{stats.received}</strong>
              </span>
              <span className="text-slate-300">|</span>
              <span className="text-amber-700">
                待签收: <strong className="font-mono">{stats.pending}</strong>
              </span>
              <span className="text-slate-300">|</span>
              <span className="text-red-600 font-medium">
                已拒收: <strong className="font-mono">{stats.rejected}</strong>
              </span>
            </div>

            <button
              onClick={() => setIsPrintModalOpen(true)}
              className="px-2.5 py-1.5 text-xs text-slate-600 hover:text-blue-600 hover:bg-slate-100 border border-slate-300 rounded flex items-center gap-1 transition-colors"
              title="打印签收交接单"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>打印交接单</span>
            </button>

            <button
              onClick={() => {
                showToast('已刷新外送签收工作台数据', 'info');
                triggerAction('刷新外送标本列表');
              }}
              className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 border border-slate-300 rounded transition-colors"
              title="刷新"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Second Row: Filters matching screenshot (申请医院, 状态, 签收时间, 患者信息, 查询) */}
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center gap-3 text-xs">
          {/* 申请医院 */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-600 whitespace-nowrap">申请医院</span>
            <select
              value={hospitalFilter}
              onChange={(e) => setHospitalFilter(e.target.value)}
              className="px-2.5 py-1 text-xs text-slate-800 bg-white border border-slate-300 rounded focus:outline-hidden focus:border-blue-500"
            >
              {hospitalOptions.map((h) => (
                <option key={h} value={h}>
                  {h === '所有' ? '中心医院 (全部送检院区)' : h}
                </option>
              ))}
            </select>
          </div>

          {/* 状态 */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-600 whitespace-nowrap">状态</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1 text-xs text-slate-800 bg-white border border-slate-300 rounded focus:outline-hidden focus:border-blue-500"
            >
              <option value="所有">所有</option>
              <option value="已接收">已接收</option>
              <option value="已拒收">已拒收</option>
              <option value="待签收">待签收</option>
            </select>
          </div>

          {/* 签收时间范围 */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-600 whitespace-nowrap">签收时间</span>
            <div className="flex items-center gap-1 bg-white border border-slate-300 rounded px-2 py-0.5">
              <input
                type="text"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-32 text-xs font-mono text-slate-700 focus:outline-hidden"
              />
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-400 px-0.5">~</span>
              <input
                type="text"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-32 text-xs font-mono text-slate-700 focus:outline-hidden"
              />
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
            </div>
          </div>

          {/* 患者信息 */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-600 whitespace-nowrap">患者信息</span>
            <div className="relative w-40">
              <input
                type="text"
                placeholder="就诊号/姓名"
                value={patientSearch}
                onChange={(e) => setPatientSearch(e.target.value)}
                className="w-full px-2.5 py-1 text-xs text-slate-800 bg-white border border-slate-300 rounded focus:outline-hidden focus:border-blue-500 placeholder-slate-400"
              />
              {patientSearch && (
                <button
                  type="button"
                  onClick={() => setPatientSearch('')}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* 查询按钮 */}
          <button
            type="button"
            onClick={() => {
              showToast(`查询完成，检索到 ${filteredData.length} 条符合条件的外送记录`);
              triggerAction('按条件查询签收标本');
            }}
            className="px-5 py-1 bg-white border border-[#1890ff] text-[#1890ff] hover:bg-blue-50 text-xs font-medium rounded transition-colors shadow-2xs"
          >
            查询
          </button>
        </div>
      </div>

      {/* Main Data Table Area (Matching columns from screenshot image_08d04488.png) */}
      <div className="flex-1 overflow-auto min-h-0 bg-white">
        <table className="w-full border-collapse text-left text-xs text-slate-700 select-text">
          <thead className="bg-[#fafafa] text-slate-700 font-medium sticky top-0 z-10 border-b border-slate-200">
            <tr className="border-b border-slate-200 divide-x divide-transparent">
              <th className="py-2 px-3 w-8 text-center">
                <input
                  type="checkbox"
                  checked={
                    filteredData.length > 0 &&
                    selectedIds.length === filteredData.length
                  }
                  onChange={handleSelectAll}
                  className="rounded border-slate-300 text-blue-600 focus:ring-0 cursor-pointer"
                />
              </th>
              <th className="py-2.5 px-3 whitespace-nowrap">状态</th>
              <th className="py-2.5 px-3 whitespace-nowrap">申请单号</th>
              <th className="py-2.5 px-3 whitespace-nowrap">送检时间</th>
              <th className="py-2.5 px-3 whitespace-nowrap">送检人</th>
              <th className="py-2.5 px-3 whitespace-nowrap">送检医院</th>
              <th className="py-2.5 px-3 whitespace-nowrap">姓名</th>
              <th className="py-2.5 px-3 whitespace-nowrap">性别</th>
              <th className="py-2.5 px-3 whitespace-nowrap">年龄</th>
              <th className="py-2.5 px-3 whitespace-nowrap">患者类别</th>
              <th className="py-2.5 px-3 whitespace-nowrap">就诊号</th>
              <th className="py-2.5 px-3 whitespace-nowrap">条码号</th>
              <th className="py-2.5 px-3 whitespace-nowrap">样本类型</th>
              <th className="py-2.5 px-3 whitespace-nowrap">申请项目</th>
              <th className="py-2.5 px-3 whitespace-nowrap">申请科室</th>
              <th className="py-2.5 px-3 whitespace-nowrap">申请医生</th>
              <th className="py-2.5 px-3 whitespace-nowrap">申请时间</th>
              <th className="py-2.5 px-3 whitespace-nowrap text-center">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={18} className="py-16 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Barcode className="w-8 h-8 text-slate-300" />
                    <span>暂无符合查询条件的标本记录</span>
                  </div>
                </td>
              </tr>
            ) : (
              filteredData.map((item) => {
                const isSelected = selectedIds.includes(item.id);
                const isRejected = item.status === '已拒收';
                const isReceived = item.status === '已接收';
                const isPending = item.status === '待签收';

                return (
                  <tr
                    key={item.id}
                    onClick={() => setDetailItem(item)}
                    className={`hover:bg-blue-50/50 cursor-pointer transition-colors ${
                      isSelected ? 'bg-blue-50/70' : isRejected ? 'bg-red-50/20' : ''
                    }`}
                  >
                    {/* Checkbox */}
                    <td
                      className="py-2 px-3 text-center"
                      onClick={(e) => handleSelectRow(item.id, e)}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        className="rounded border-slate-300 text-blue-600 focus:ring-0 cursor-pointer"
                      />
                    </td>

                    {/* 状态 (screenshot: 已接收 in normal slate, 已拒收 in bold red) */}
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      {isRejected ? (
                        <span className="text-red-500 font-medium">已拒收</span>
                      ) : isReceived ? (
                        <span className="text-slate-800">已接收</span>
                      ) : (
                        <span className="text-amber-600 font-medium">待签收</span>
                      )}
                    </td>

                    {/* 申请单号 */}
                    <td className="py-2.5 px-3 font-mono text-slate-700 whitespace-nowrap">
                      {item.applyNo}
                    </td>

                    {/* 送检时间 */}
                    <td className="py-2.5 px-3 font-mono text-slate-600 whitespace-nowrap">
                      {item.deliverTime}
                    </td>

                    {/* 送检人 */}
                    <td className="py-2.5 px-3 text-slate-800 whitespace-nowrap">
                      {item.deliverer}
                    </td>

                    {/* 送检医院 */}
                    <td className="py-2.5 px-3 text-slate-800 whitespace-nowrap">
                      {item.deliverHospital}
                    </td>

                    {/* 姓名 */}
                    <td className="py-2.5 px-3 font-medium text-slate-900 whitespace-nowrap">
                      {item.patientName}
                    </td>

                    {/* 性别 */}
                    <td className="py-2.5 px-3 text-slate-700 whitespace-nowrap">
                      {item.gender}
                    </td>

                    {/* 年龄 */}
                    <td className="py-2.5 px-3 text-slate-700 whitespace-nowrap">
                      {item.age}
                    </td>

                    {/* 患者类别 */}
                    <td className="py-2.5 px-3 text-slate-700 whitespace-nowrap">
                      {item.patientCategory}
                    </td>

                    {/* 就诊号 */}
                    <td className="py-2.5 px-3 font-mono text-slate-700 whitespace-nowrap">
                      {item.medicalRecordNo}
                    </td>

                    {/* 条码号 */}
                    <td className="py-2.5 px-3 font-mono font-medium text-slate-900 whitespace-nowrap">
                      {item.barcode}
                    </td>

                    {/* 样本类型 */}
                    <td className="py-2.5 px-3 text-slate-700 whitespace-nowrap">
                      {item.specimenType}
                    </td>

                    {/* 申请项目 */}
                    <td className="py-2.5 px-3 text-slate-900 whitespace-nowrap font-medium">
                      {item.applyItemName}
                    </td>

                    {/* 申请科室 */}
                    <td className="py-2.5 px-3 text-slate-700 whitespace-nowrap">
                      {item.applyDept}
                    </td>

                    {/* 申请医生 */}
                    <td className="py-2.5 px-3 text-slate-700 whitespace-nowrap">
                      {item.applyDoctor}
                    </td>

                    {/* 申请时间 */}
                    <td className="py-2.5 px-3 font-mono text-slate-600 whitespace-nowrap">
                      {item.applyTime}
                    </td>

                    {/* 操作 */}
                    <td
                      className="py-2.5 px-3 text-center whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-center gap-2 text-[11px]">
                        <button
                          onClick={() => setDetailItem(item)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          详情
                        </button>
                        {isPending && (
                          <button
                            onClick={() => {
                              setTableData((prev) =>
                                prev.map((i) =>
                                  i.id === item.id
                                    ? {
                                        ...i,
                                        status: '已接收',
                                        receiveTime: '2026-10-30 09:55:00',
                                        receiver: user.name || '张珊',
                                      }
                                    : i
                                )
                              );
                              showToast(`标本 ${item.barcode} (${item.patientName}) 签收成功！`);
                            }}
                            className="text-emerald-600 hover:text-emerald-800 font-medium"
                          >
                            签收
                          </button>
                        )}
                        {!isRejected && (
                          <button
                            onClick={() => handleOpenReject(item)}
                            className="text-red-500 hover:text-red-700"
                          >
                            拒收
                          </button>
                        )}
                        {isRejected && (
                          <button
                            onClick={() => {
                              showToast(`已向 ${item.deliverHospital} 重发复采通知`);
                              triggerAction(`向 ${item.deliverHospital} 发送复采通知`);
                            }}
                            className="text-slate-500 hover:text-slate-800"
                          >
                            重发通知
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Info Bar */}
      <div className="bg-[#fafafa] border-t border-slate-200 px-5 py-2 shrink-0 flex flex-wrap items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-4">
          <span>
            显示 <strong className="text-slate-800">{filteredData.length}</strong> 条记录（共{' '}
            {tableData.length} 条）
          </span>
          {selectedIds.length > 0 && (
            <span className="text-blue-600">
              已勾选 <strong>{selectedIds.length}</strong> 项
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 font-mono text-[11px]">
          <span>接收操作员: <strong className="text-slate-700">{user.name || '张珊'}</strong></span>
          <span className="text-slate-300">|</span>
          <span>医联体集中接收流水号: <strong className="text-slate-700">RCV-20261030-C01</strong></span>
        </div>
      </div>

      {/* ----------------- MODALS ----------------- */}

      {/* 1. 标本拒收处理弹窗 (Rejection Modal) */}
      {isRejectModalOpen && rejectingItem && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-fadeIn">
            {/* Header */}
            <div className="bg-red-600 text-white px-5 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-white" />
                <span className="font-semibold text-sm">外送标本拒收退回核验</span>
              </div>
              <button
                onClick={() => setIsRejectModalOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmReject} className="p-5 space-y-4 text-xs">
              <div className="p-3 bg-red-50/70 rounded border border-red-200 space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">标本条码号：</span>
                  <strong className="font-mono text-slate-900 text-sm">
                    {rejectingItem.barcode}
                  </strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">患者信息：</span>
                  <span className="text-slate-800 font-medium">
                    {rejectingItem.patientName} ({rejectingItem.gender} · {rejectingItem.age} ·{' '}
                    {rejectingItem.patientCategory})
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">送检机构 / 科室：</span>
                  <span className="text-slate-800">
                    {rejectingItem.deliverHospital} / {rejectingItem.applyDept}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">申请检测项目：</span>
                  <span className="text-slate-900 font-medium">
                    {rejectingItem.applyItemName} ({rejectingItem.specimenType})
                  </span>
                </div>
              </div>

              {/* Reason Selector */}
              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  选择拒收原因 <span className="text-red-500">*</span>
                </label>
                <select
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-slate-800 focus:outline-hidden focus:border-red-500"
                >
                  <option value="标本严重重度溶血，游离血红蛋白干扰化学发光检测">
                    标本严重重度溶血 (干扰吸光度/酶法测定)
                  </option>
                  <option value="EDTA抗凝试管内出现可见纤维蛋白凝块，影响细胞吸样计数">
                    标本凝块 (抗凝不充分或未充分颠倒混匀)
                  </option>
                  <option value="采血量严重不足，无法满足离心后血清需求">
                    标本量严重不足 (血清/血浆 &lt; 0.5 mL)
                  </option>
                  <option value="试管容器类型错用，与送检项目抗凝要求不符">
                    试管类型不符 (错用抗凝管类型)
                  </option>
                  <option value="试管外壁条码模糊或严重污损，扫码枪无法识读">
                    条码污损无法识别
                  </option>
                  <option value="外送冷链温度超标 (>10℃)，标本可能失效变质">
                    冷链箱温超标异常
                  </option>
                </select>
              </div>

              {/* Remarks */}
              <div>
                <label className="block text-slate-700 font-medium mb-1">补充处理说明</label>
                <textarea
                  rows={2}
                  value={rejectRemark}
                  onChange={(e) => setRejectRemark(e.target.value)}
                  placeholder="可输入具体性状描述或处理意见，内容将直通基层送检端医生工作站..."
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1 text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-red-500"
                />
              </div>

              {/* Checkbox notification */}
              <div className="flex items-center gap-2 text-slate-700">
                <input
                  type="checkbox"
                  id="notifyDept"
                  checked={notifyReferralDept}
                  onChange={(e) => setNotifyReferralDept(e.target.checked)}
                  className="rounded text-red-600 border-slate-300 focus:ring-0"
                />
                <label htmlFor="notifyDept" className="cursor-pointer">
                  同步向 <strong>{rejectingItem.deliverHospital}</strong> 推送拒收退回及建议复采通报
                </label>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsRejectModalOpen(false)}
                  className="px-4 py-1.5 rounded border border-slate-300 text-slate-700 hover:bg-slate-100 font-medium"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 rounded bg-red-600 text-white font-medium hover:bg-red-700 shadow-2xs"
                >
                  确认拒收
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. 撤销签收确认弹窗 */}
      {isRevokeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-fadeIn">
            <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between">
              <span className="font-bold text-sm text-slate-800">撤销签收确认</span>
              <button
                onClick={() => setIsRevokeModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 text-xs text-slate-600 space-y-3">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-amber-100 text-amber-700 shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800 text-sm">
                    确认撤销所选标本的签收状态？
                  </p>
                  <p className="mt-1 text-slate-500">
                    撤销后，标本将重新恢复为【待签收】状态，中心实验室流水线将暂停自动上机分流，送检端将同步更新。
                  </p>
                </div>
              </div>
            </div>
            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex justify-end gap-2 text-xs">
              <button
                onClick={() => setIsRevokeModalOpen(false)}
                className="px-4 py-1.5 rounded border border-slate-300 text-slate-700 hover:bg-white"
              >
                取消
              </button>
              <button
                onClick={handleConfirmRevoke}
                className="px-4 py-1.5 rounded bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-2xs"
              >
                确认撤销
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. 标本详情弹窗 (Row Click Modal) */}
      {detailItem && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-fadeIn">
            {/* Modal Header */}
            <div className="px-5 py-3.5 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Barcode className="w-5 h-5 text-sky-400" />
                <div>
                  <div className="font-bold text-sm flex items-center gap-2">
                    <span>外送标本核收详情</span>
                    <span
                      className={`text-[11px] px-2 py-0.2 rounded font-normal ${
                        detailItem.status === '已接收'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                          : detailItem.status === '已拒收'
                          ? 'bg-red-500/20 text-red-300 border border-red-400/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-400/30'
                      }`}
                    >
                      {detailItem.status}
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-300">
                    条码号: {detailItem.barcode} · 申请单: {detailItem.applyNo}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setDetailItem(null)}
                className="text-white/70 hover:text-white p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 space-y-4 text-xs overflow-y-auto max-h-[75vh]">
              {/* Patient Basic Info Card */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <span className="text-slate-400 block text-[11px]">患者姓名</span>
                  <span className="font-bold text-slate-900 text-sm">
                    {detailItem.patientName}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">性别 / 年龄</span>
                  <span className="text-slate-800 font-medium">
                    {detailItem.gender} · {detailItem.age}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">患者类别</span>
                  <span className="text-slate-800 font-medium">
                    {detailItem.patientCategory}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">就诊号 / 病历号</span>
                  <span className="font-mono text-slate-800 font-medium">
                    {detailItem.medicalRecordNo}
                  </span>
                </div>
              </div>

              {/* Referral & Transport Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-2">
                  <div className="font-semibold text-slate-800 flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
                    <Building2 className="w-4 h-4 text-blue-600" />
                    <span>送检医疗机构信息</span>
                  </div>
                  <div className="space-y-1 text-slate-600">
                    <div>送检机构：<strong className="text-slate-800">{detailItem.deliverHospital}</strong></div>
                    <div>申请科室：<span className="text-slate-800">{detailItem.applyDept}</span></div>
                    <div>申请医生：<span className="text-slate-800">{detailItem.applyDoctor}</span></div>
                    <div>申请时间：<span className="font-mono text-slate-700">{detailItem.applyTime}</span></div>
                  </div>
                </div>

                <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-2">
                  <div className="font-semibold text-slate-800 flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
                    <Truck className="w-4 h-4 text-emerald-600" />
                    <span>冷链物流与接收情况</span>
                  </div>
                  <div className="space-y-1 text-slate-600">
                    <div>配送送检人：<span className="text-slate-800">{detailItem.deliverer}</span></div>
                    <div>送检出发时间：<span className="font-mono text-slate-700">{detailItem.deliverTime}</span></div>
                    <div>运送冷链箱温：<span className="font-mono font-bold text-emerald-600">{detailItem.temperature || '4.0℃'}</span></div>
                    <div>
                      签收信息：
                      {detailItem.receiveTime ? (
                        <span className="text-slate-800">
                          {detailItem.receiver} 于 {detailItem.receiveTime}
                        </span>
                      ) : (
                        <span className="text-amber-600">尚未签收</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Specimen & Test info */}
              <div className="p-3 bg-blue-50/40 rounded-lg border border-blue-200 space-y-2">
                <div className="font-semibold text-blue-900 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>送检项目与检测分流</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-slate-700">
                  <div>标本类型：<strong className="text-slate-900">{detailItem.specimenType}</strong></div>
                  <div>申请项目：<strong className="text-slate-900">{detailItem.applyItemName}</strong></div>
                  <div>分流机台：<span className="text-blue-700 font-medium">{detailItem.targetDevice || '全自动生化分析仪'}</span></div>
                </div>
              </div>

              {/* If Rejected, display rejection reason card */}
              {detailItem.status === '已拒收' && detailItem.rejectionReason && (
                <div className="p-3 bg-red-50 rounded-lg border border-red-200 text-red-800 space-y-1">
                  <div className="font-semibold flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <span>拒收原因与退回记录</span>
                  </div>
                  <p className="text-xs text-red-700 pl-5">{detailItem.rejectionReason}</p>
                </div>
              )}

              {/* Trace Timeline */}
              <div className="pt-2 border-t border-slate-100">
                <div className="text-xs font-semibold text-slate-700 mb-2">标本全流程轨迹流转</div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 px-2 py-2 bg-slate-50 rounded border border-slate-200">
                  <div className="flex items-center gap-1 text-emerald-700">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>1. 基层开立</span>
                  </div>
                  <ArrowRight className="w-3 h-3 text-slate-300" />
                  <div className="flex items-center gap-1 text-emerald-700">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>2. 冷链外送</span>
                  </div>
                  <ArrowRight className="w-3 h-3 text-slate-300" />
                  <div
                    className={`flex items-center gap-1 ${
                      detailItem.status === '已接收'
                        ? 'text-emerald-700 font-medium'
                        : detailItem.status === '已拒收'
                        ? 'text-red-600 font-medium'
                        : 'text-amber-600 font-medium'
                    }`}
                  >
                    {detailItem.status === '已接收' ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : detailItem.status === '已拒收' ? (
                      <XCircle className="w-3.5 h-3.5" />
                    ) : (
                      <Clock className="w-3.5 h-3.5" />
                    )}
                    <span>
                      3. 中心签收 ({detailItem.status})
                    </span>
                  </div>
                  <ArrowRight className="w-3 h-3 text-slate-300" />
                  <div className="flex items-center gap-1 text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>4. 上机检验</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs">
              <button
                onClick={() => {
                  showToast(`标本 ${detailItem.barcode} 上机标签已发送至标签打印机`);
                  triggerAction(`打印标本标签: ${detailItem.barcode}`);
                }}
                className="px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-700 hover:bg-slate-100 flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>补打标本条码</span>
              </button>

              <div className="flex items-center gap-2">
                {detailItem.status === '待签收' && (
                  <button
                    onClick={() => {
                      setTableData((prev) =>
                        prev.map((i) =>
                          i.id === detailItem.id
                            ? {
                                ...i,
                                status: '已接收',
                                receiveTime: '2026-10-30 09:55:00',
                                receiver: user.name || '张珊',
                              }
                            : i
                        )
                      );
                      setDetailItem({
                        ...detailItem,
                        status: '已接收',
                        receiveTime: '2026-10-30 09:55:00',
                        receiver: user.name || '张珊',
                      });
                      showToast(`标本 ${detailItem.barcode} 签收成功！`);
                    }}
                    className="px-4 py-1.5 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 shadow-2xs"
                  >
                    立即签收
                  </button>
                )}
                {detailItem.status !== '已拒收' && (
                  <button
                    onClick={() => {
                      handleOpenReject(detailItem);
                      setDetailItem(null);
                    }}
                    className="px-4 py-1.5 bg-red-50 border border-red-300 text-red-700 rounded font-medium hover:bg-red-100"
                  >
                    标本拒收
                  </button>
                )}
                <button
                  onClick={() => setDetailItem(null)}
                  className="px-4 py-1.5 bg-white border border-slate-300 rounded text-slate-700 hover:bg-slate-100 font-medium"
                >
                  关闭
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. 打印交接单弹窗 */}
      {isPrintModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden animate-fadeIn text-xs">
            <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <span className="font-bold text-sm text-slate-800">医联体送检标本签收与冷链交接清单</span>
              <button
                onClick={() => setIsPrintModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-4 bg-white text-slate-800 font-serif">
              <div className="text-center space-y-1">
                <h3 className="text-base font-bold tracking-wider">市区域检验中心 · 外送标本签收交接凭单</h3>
                <p className="text-[11px] font-sans text-slate-500">
                  交接单据号：LL-20261030-008 · 打印时间：2026-10-30 09:56:00
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] font-sans border-y border-slate-300 py-2">
                <div>接收机构：市中心医院检验中心 (区域医学检验所)</div>
                <div>送检机构：{hospitalFilter === '所有' ? '医联体各基层社区中心' : hospitalFilter}</div>
                <div>签收人员：{user.name || '张珊'}</div>
                <div>运送专员：李志明 / 张强</div>
                <div>冷链箱温：合格 (平均 3.9℃, 达标率 100%)</div>
                <div>总计送检标本：{tableData.length} 支 (已签收 {stats.received}，拒收 {stats.rejected})</div>
              </div>

              <div className="space-y-1 font-sans text-[11px]">
                <div className="font-semibold text-slate-700">交接核验意见：</div>
                <p className="text-slate-600 bg-slate-50 p-2 rounded border border-slate-200">
                  冷链封条完好，全程温度记录符合2~8℃储存与运输规范要求；标本外观质量已逐一扫码核验完毕，合格标本已进入全自动流水线轨道，不合格标本已按规范退回并通报送检医院。
                </p>
              </div>

              <div className="pt-4 flex justify-between font-sans text-[11px]">
                <div>送检方经手人签字：__________________</div>
                <div>接收方检验员签字：__________________</div>
              </div>
            </div>

            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
              <button
                onClick={() => setIsPrintModalOpen(false)}
                className="px-4 py-1.5 rounded border border-slate-300 text-slate-700 hover:bg-white"
              >
                关闭
              </button>
              <button
                onClick={() => {
                  showToast('正在向本地发票/交接单针式打印机发送打印任务...');
                  triggerAction('已打印外送标本签收交接单');
                  setIsPrintModalOpen(false);
                }}
                className="px-5 py-1.5 rounded bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-2xs flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>立即打印</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
