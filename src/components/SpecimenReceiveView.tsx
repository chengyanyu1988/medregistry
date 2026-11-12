import React, { useState, useMemo } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  Clock,
  Search,
  Filter,
  RefreshCw,
  QrCode,
  Check,
  Building2,
  User,
  ArrowRight,
  XCircle,
  FileText,
  Printer,
  ChevronDown,
  Layers,
  Thermometer,
  ShieldCheck,
  RotateCcw,
  Ban,
  Sparkles,
  Inbox,
  AlertCircle
} from './MenuIcon';
import {
  PendingReceiveItem,
  InboundBatchInfo,
  ReceivedRecordItem,
  RejectedRecordItem,
  INITIAL_INBOUND_BATCH,
  INITIAL_PENDING_RECEIVE_ITEMS,
  INITIAL_RECEIVED_HISTORY,
  INITIAL_REJECTED_LIST
} from '../data/specimenReceiveData';
import { UserProfile } from '../types/navigation';

interface SpecimenReceiveViewProps {
  user: UserProfile;
  triggerAction: (msg: string) => void;
}

export const SpecimenReceiveView: React.FC<SpecimenReceiveViewProps> = ({
  user,
  triggerAction,
}) => {
  // --- States ---
  // Batch & Pending list
  const [inboundBatch, setInboundBatch] = useState<InboundBatchInfo>(INITIAL_INBOUND_BATCH);
  const [pendingList, setPendingList] = useState<PendingReceiveItem[]>(INITIAL_PENDING_RECEIVE_ITEMS);
  const [selectedPendingIds, setSelectedPendingIds] = useState<string[]>([]);

  // History & Rejected lists
  const [receivedHistory, setReceivedHistory] = useState<ReceivedRecordItem[]>(INITIAL_RECEIVED_HISTORY);
  const [rejectedList, setRejectedList] = useState<RejectedRecordItem[]>(INITIAL_REJECTED_LIST);

  // Scanner & input modes
  const [barcodeType, setBarcodeType] = useState<'barcode' | 'batchNo' | 'medicalNo'>('barcode');
  const [scanInput, setScanInput] = useState('');
  const [sourceFilter, setSourceFilter] = useState<'hospital' | 'outreach'>('hospital');

  // Right side tab & filters
  const [activeTab, setActiveTab] = useState<'received' | 'rejected'>('received');
  const [timeRange, setTimeRange] = useState('1天');
  const [selectedHospital, setSelectedHospital] = useState('全部医院');
  const [historySearchTerm, setHistorySearchTerm] = useState('');

  // Modals
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [itemToReject, setItemToReject] = useState<PendingReceiveItem | null>(null);
  const [rejectReason, setRejectReason] = useState('溶血严重(无法测定生化指标)');
  const [rejectRemark, setRejectRemark] = useState('');

  // Auto-scan notice state
  const [scanFeedback, setScanFeedback] = useState<{ text: string; type: 'success' | 'warn' } | null>(null);

  const showScanNotice = (text: string, type: 'success' | 'warn' = 'success') => {
    setScanFeedback({ text, type });
    setTimeout(() => setScanFeedback(null), 3000);
  };

  // --- Handlers ---
  const handleSelectAllPending = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedPendingIds(pendingList.map((item) => item.id));
    } else {
      setSelectedPendingIds([]);
    }
  };

  const handleToggleSelectPending = (id: string) => {
    setSelectedPendingIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Perform Single or Batch Sign-in
  const handleBatchReceive = () => {
    if (selectedPendingIds.length === 0) {
      triggerAction('请先勾选待签收的标本');
      return;
    }

    const itemsToSign = pendingList.filter((item) => selectedPendingIds.includes(item.id));
    const nowTime = '2026-10-26 10:45:18';

    const newReceivedItems: ReceivedRecordItem[] = itemsToSign.map((item, idx) => ({
      id: `RC-NEW-${Date.now()}-${idx}`,
      deliveryBatchNo: inboundBatch.batchNo,
      sendTime: inboundBatch.sendTime,
      deliverer: inboundBatch.deliverer,
      sendHospital: inboundBatch.sourceHospital,
      sendDept: item.department,
      patientName: item.patientName,
      medicalRecordNo: `181230${1000 + idx}`,
      barcode: item.barcode,
      sampleType: item.sampleType,
      testItem: item.testItem,
      tubeContainer: item.tubeSpec,
      receiveTime: nowTime,
      receiver: user.name || '张珊',
      pipelineDestination: item.isUrgent
        ? '急诊绿色通道分析流水线 (优先上机)'
        : item.sampleType === '全血'
        ? 'Sysmex XN 血液细胞分析流水线'
        : '罗氏 Cobas 8000 生化免疫流水线',
      status: '已签收',
      isUrgent: item.isUrgent,
    }));

    setReceivedHistory((prev) => [...newReceivedItems, ...prev]);
    setPendingList((prev) => prev.filter((item) => !selectedPendingIds.includes(item.id)));
    setSelectedPendingIds([]);

    triggerAction(`成功签收 ${itemsToSign.length} 份标本，已自动派发流水线`);
    showScanNotice(`批量签收成功：${itemsToSign.length} 份标本已入库`, 'success');
  };

  // Revoke sign-in (撤销签收)
  const handleRevokeReceive = () => {
    if (receivedHistory.length === 0) {
      triggerAction('暂无可撤销的已签收记录');
      return;
    }
    const [latest, ...rest] = receivedHistory;
    // Put back to pending
    const restoredItem: PendingReceiveItem = {
      id: `RESTORE-${Date.now()}`,
      patientName: latest.patientName,
      barcode: latest.barcode,
      testItem: latest.testItem,
      sampleType: (latest.sampleType as any) || '全血',
      tubeSpec: latest.tubeContainer,
      tubeColor: 'purple',
      isUrgent: latest.isUrgent,
      department: latest.sendDept,
      gender: '男',
      age: '45岁',
      applyDoctor: '值班医师',
    };

    setReceivedHistory(rest);
    setPendingList((prev) => [restoredItem, ...prev]);
    triggerAction(`已撤销标本 [${latest.barcode} - ${latest.patientName}] 的签收状态`);
    showScanNotice(`已撤销条码 [${latest.barcode}] 签收状态并退回待签收队列`, 'warn');
  };

  // Open Rejection Dialog
  const handleOpenRejectModal = () => {
    if (selectedPendingIds.length === 0) {
      triggerAction('请先勾选需要拒收的标本');
      return;
    }
    const firstSelected = pendingList.find((p) => p.id === selectedPendingIds[0]) || pendingList[0];
    setItemToReject(firstSelected);
    setShowRejectModal(true);
  };

  // Confirm Reject
  const handleConfirmReject = () => {
    if (!itemToReject) return;

    const newRejection: RejectedRecordItem = {
      id: `REJ-${Date.now()}`,
      barcode: itemToReject.barcode,
      deliveryBatchNo: inboundBatch.batchNo,
      patientName: itemToReject.patientName,
      gender: itemToReject.gender,
      age: itemToReject.age,
      ward: itemToReject.department,
      bedNo: itemToReject.bedNo || '常规门诊',
      testItem: itemToReject.testItem,
      sampleType: itemToReject.sampleType,
      rejectReason: `${rejectReason}${rejectRemark ? `（${rejectRemark}）` : ''}`,
      rejectTime: '2026-10-26 10:48:22',
      rejectTechnician: `${user.name || '张珊'} (主管检验师)`,
      suggestAction: '通知送检科室重采标本，LIS自动向HIS下发标本拒收预警',
      deliverer: inboundBatch.deliverer,
    };

    setRejectedList((prev) => [newRejection, ...prev]);
    setPendingList((prev) => prev.filter((p) => p.id !== itemToReject.id));
    setSelectedPendingIds((prev) => prev.filter((id) => id !== itemToReject.id));
    setShowRejectModal(false);
    setItemToReject(null);
    setRejectRemark('');

    triggerAction(`标本 [${itemToReject.barcode}] 已执行拒收登记`);
    showScanNotice(`标本已拒收并录入台账: ${itemToReject.patientName} (${itemToReject.testItem})`, 'warn');
  };

  // Fast Barcode Input (Scan or Enter)
  const handleScanSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = scanInput.trim();
    if (!query) {
      triggerAction('请输入或扫描条码号');
      return;
    }

    // Check in pending
    const foundPending = pendingList.find((p) => p.barcode === query || p.barcode.endsWith(query));
    if (foundPending) {
      // Direct sign-in this scanned specimen
      setSelectedPendingIds([foundPending.id]);
      const nowTime = '2026-10-26 10:46:00';
      const newRec: ReceivedRecordItem = {
        id: `RC-SCAN-${Date.now()}`,
        deliveryBatchNo: inboundBatch.batchNo,
        sendTime: inboundBatch.sendTime,
        deliverer: inboundBatch.deliverer,
        sendHospital: inboundBatch.sourceHospital,
        sendDept: foundPending.department,
        patientName: foundPending.patientName,
        medicalRecordNo: '1812308991',
        barcode: foundPending.barcode,
        sampleType: foundPending.sampleType,
        testItem: foundPending.testItem,
        tubeContainer: foundPending.tubeSpec,
        receiveTime: nowTime,
        receiver: user.name || '张珊',
        pipelineDestination: foundPending.isUrgent
          ? '急查凝血工位 (绿色优先)'
          : '生化免疫流水线 (自动离心进样)',
        status: '已签收',
        isUrgent: foundPending.isUrgent,
      };

      setReceivedHistory((prev) => [newRec, ...prev]);
      setPendingList((prev) => prev.filter((p) => p.id !== foundPending.id));
      setSelectedPendingIds([]);
      setScanInput('');
      showScanNotice(`扫码识别成功！标本 [${foundPending.patientName} - ${foundPending.testItem}] 已自动签收`, 'success');
      triggerAction(`标本 ${foundPending.barcode} 快速扫码签收成功`);
      return;
    }

    // Check if batch number entered
    if (query.toUpperCase().startsWith('SJ') || query === '18121700001' || query === '18121700002') {
      showScanNotice(`已载入送检批次 [${query}]，包含关联标本`, 'success');
      triggerAction(`已载入送检单 [${query}]`);
      setScanInput('');
      return;
    }

    // Not found
    showScanNotice(`未在待签收队列中找到条码 [${query}]，请核对送检批次`, 'warn');
    triggerAction(`未识别的条码或送检批次号: ${query}`);
  };

  // Filtered History
  const filteredHistory = useMemo(() => {
    return receivedHistory.filter((item) => {
      const matchHospital =
        selectedHospital === '全部医院' ||
        selectedHospital === '中心医院' ||
        item.sendHospital.includes(selectedHospital);

      const matchSearch =
        !historySearchTerm ||
        item.patientName.includes(historySearchTerm) ||
        item.barcode.includes(historySearchTerm) ||
        item.medicalRecordNo.includes(historySearchTerm) ||
        item.deliveryBatchNo.includes(historySearchTerm);

      return matchHospital && matchSearch;
    });
  }, [receivedHistory, selectedHospital, historySearchTerm]);

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-slate-100 overflow-hidden text-slate-800">
      {/* Top Banner / Scan Feedback Toast */}
      {scanFeedback && (
        <div
          className={`px-4 py-2 text-xs font-medium flex items-center justify-between transition-all ${
            scanFeedback.type === 'success'
              ? 'bg-emerald-600 text-white'
              : 'bg-amber-600 text-white'
          }`}
        >
          <div className="flex items-center gap-2">
            {scanFeedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 shrink-0" />
            )}
            <span>{scanFeedback.text}</span>
          </div>
          <button onClick={() => setScanFeedback(null)} className="text-white/80 hover:text-white">
            <XCircle className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Two-Column Workstation Layout */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-3 p-3 overflow-hidden">
        
        {/* ================= LEFT COLUMN: SCAN & CURRENT INBOUND BATCH (4 cols on wide screens) ================= */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col h-full min-h-0 bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
          
          {/* Header Barcode Scanner Input */}
          <div className="p-3.5 bg-slate-50/80 border-b border-slate-200">
            <div className="flex items-center gap-2 mb-2">
              {/* Type Dropdown */}
              <div className="relative">
                <select
                  value={barcodeType}
                  onChange={(e) => setBarcodeType(e.target.value as any)}
                  className="appearance-none bg-white border border-slate-300 rounded-lg pl-2.5 pr-7 py-1.5 text-xs font-semibold text-slate-700 hover:border-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-500"
                >
                  <option value="barcode">标本条码</option>
                  <option value="batchNo">送检单号</option>
                  <option value="medicalNo">就诊号</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2.5 pointer-events-none" />
              </div>

              {/* Barcode Input Form */}
              <form onSubmit={handleScanSubmit} className="flex-1 flex items-center relative">
                <input
                  type="text"
                  value={scanInput}
                  onChange={(e) => setScanInput(e.target.value)}
                  placeholder="扫码单号或标本条码签收 (回车确认)"
                  className="w-full pl-8 pr-16 py-1.5 text-xs bg-white border border-sky-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono placeholder:text-slate-400"
                  autoFocus
                />
                <QrCode className="w-4 h-4 text-sky-600 absolute left-2.5 top-2 pointer-events-none" />
                <button
                  type="submit"
                  className="absolute right-1 top-1 px-2.5 py-1 text-[11px] font-medium bg-sky-600 text-white rounded hover:bg-sky-700 transition-colors"
                >
                  签收
                </button>
              </form>

              {/* In-hospital vs Out-reach Switch */}
              <div className="flex items-center rounded-lg border border-slate-200 bg-slate-200/60 p-0.5">
                <button
                  onClick={() => {
                    setSourceFilter('hospital');
                    triggerAction('切换为院内病区标本接收模式');
                  }}
                  className={`px-2 py-1 text-xs font-medium rounded-md transition-all ${
                    sourceFilter === 'hospital'
                      ? 'bg-sky-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  院内
                </button>
                <button
                  onClick={() => {
                    setSourceFilter('outreach');
                    triggerAction('切换为院外医联体送检接收模式');
                  }}
                  className={`px-2 py-1 text-xs font-medium rounded-md transition-all ${
                    sourceFilter === 'outreach'
                      ? 'bg-sky-600 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  院外
                </button>
              </div>
            </div>

            {/* Quick Helper Tip */}
            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                条码枪即扫即签已就绪（支持回车快捷确认）
              </span>
              <button
                type="button"
                onClick={() => setScanInput('0011812170021')}
                className="text-sky-600 hover:text-sky-800 hover:underline"
              >
                填入急查条码
              </button>
            </div>
          </div>

          {/* Current Delivery Batch Header Details (Matches screenshot SJ00000212 card) */}
          <div className="p-3 bg-gradient-to-r from-sky-50/60 via-slate-50 to-indigo-50/40 border-b border-slate-200">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">送检单号:</span>
                  <span className="font-mono font-bold text-slate-900 text-sm tracking-wide">
                    {inboundBatch.batchNo}
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-sky-100 text-sky-800">
                    在途核对中
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-1.5 text-xs text-slate-600">
                  <div>
                    <span className="text-slate-400 mr-1.5">送检科室:</span>
                    <span className="font-medium text-slate-800">{inboundBatch.sendDept}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 mr-1.5">送检人:</span>
                    <span className="font-semibold text-slate-900">{inboundBatch.deliverer}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400 mr-1.5">送检时间:</span>
                    <span className="font-mono text-slate-700">{inboundBatch.sendTime}</span>
                  </div>
                </div>
              </div>

              {/* Total Count & Temperature */}
              <div className="text-right flex flex-col items-end">
                <div className="text-[11px] text-slate-500">
                  总标本数: <span className="font-mono font-bold text-rose-600 text-base">{inboundBatch.totalCount}</span>
                </div>
                <div className="mt-1 flex items-center gap-1 px-1.5 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded text-[11px] font-mono">
                  <Thermometer className="w-3 h-3 text-emerald-600" />
                  <span>箱温: {inboundBatch.boxTemperature}</span>
                </div>
              </div>
            </div>

            {/* Action Bar: [批量签收] [撤销签收] [拒收] */}
            <div className="mt-3 flex items-center gap-2">
              <button
                onClick={handleBatchReceive}
                disabled={pendingList.length === 0}
                className="flex-1 py-1.5 px-3 bg-sky-600 hover:bg-sky-700 disabled:bg-slate-300 text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>批量签收 {selectedPendingIds.length > 0 ? `(${selectedPendingIds.length})` : ''}</span>
              </button>

              <button
                onClick={handleRevokeReceive}
                className="py-1.5 px-3 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-medium rounded-lg transition-colors flex items-center gap-1"
                title="撤销上一笔签收并回退到待核验池"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                <span>撤销签收</span>
              </button>

              <button
                onClick={handleOpenRejectModal}
                className="py-1.5 px-3 bg-white hover:bg-rose-50 border border-rose-300 text-rose-700 text-xs font-medium rounded-lg transition-colors flex items-center gap-1"
                title="对异常标本（如溶血、量不足等）进行拒收登记"
              >
                <Ban className="w-3.5 h-3.5 text-rose-500" />
                <span>拒收</span>
              </button>
            </div>
          </div>

          {/* Pending Specimen Table (Matches screenshot table: 姓名 | 条码号 | 申请项目 | 样本类型 | 急项) */}
          <div className="flex-1 min-h-0 overflow-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 sticky top-0 z-10 text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="w-8 px-3 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={pendingList.length > 0 && selectedPendingIds.length === pendingList.length}
                      onChange={handleSelectAllPending}
                      className="rounded text-sky-600 focus:ring-sky-500"
                    />
                  </th>
                  <th className="px-2.5 py-2 font-medium">姓名</th>
                  <th className="px-2.5 py-2 font-medium">条码号</th>
                  <th className="px-2.5 py-2 font-medium">申请项目</th>
                  <th className="px-2 py-2 font-medium">样本类型</th>
                  <th className="px-2 py-2 font-medium text-center">急项</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pendingList.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-1.5">
                        <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                        <span className="font-medium text-slate-600">当前批次待签收标本已全部处理完毕</span>
                        <span className="text-[11px] text-slate-400">可扫描新送检单或等待病区专员送达</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  pendingList.map((item) => {
                    const isSelected = selectedPendingIds.includes(item.id);
                    return (
                      <tr
                        key={item.id}
                        onClick={() => handleToggleSelectPending(item.id)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-sky-50/70 hover:bg-sky-100/60'
                            : 'hover:bg-slate-50/90'
                        }`}
                      >
                        <td className="px-3 py-2 text-center" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleSelectPending(item.id)}
                            className="rounded text-sky-600 focus:ring-sky-500"
                          />
                        </td>
                        <td className="px-2.5 py-2">
                          <div className="font-semibold text-slate-900">{item.patientName}</div>
                          <div className="text-[10px] text-slate-400">{item.department}</div>
                        </td>
                        <td className="px-2.5 py-2 font-mono text-slate-700 text-[11px]">
                          {item.barcode}
                        </td>
                        <td className="px-2.5 py-2 text-slate-800 font-medium max-w-[140px] truncate" title={item.testItem}>
                          {item.testItem}
                        </td>
                        <td className="px-2 py-2 text-slate-600">
                          <span className="inline-block px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-700">
                            {item.sampleType}
                          </span>
                        </td>
                        <td className="px-2 py-2 text-center">
                          {item.isUrgent ? (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700 border border-rose-200">
                              急
                            </span>
                          ) : (
                            <span className="text-[11px] text-slate-400">否</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Bottom Counter (Matches screenshot "合计: 6条") */}
          <div className="p-2.5 bg-slate-50/90 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium text-slate-700">合计: {pendingList.length}条</span>
            <div className="flex items-center gap-2 text-[11px]">
              <span>已勾选: <strong className="text-sky-600 font-mono">{selectedPendingIds.length}</strong></span>
              {pendingList.filter((p) => p.isUrgent).length > 0 && (
                <span className="text-rose-600 font-semibold">
                  (包含 {pendingList.filter((p) => p.isUrgent).length} 例急查)
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ================= RIGHT COLUMN: SIGNED HISTORY & REJECTED LOGS (7 or 8 cols on wide screens) ================= */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col h-full min-h-0 bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
          
          {/* Tabs & Filter Bar (Matches screenshot: 已签收 | 已拒收, 签收时间 1天, 申请医院 中心医院, 就诊号/姓名, 查询) */}
          <div className="p-3 bg-slate-50/80 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
            
            {/* Left: Tab Switcher (已签收 / 已拒收) */}
            <div className="flex items-center gap-6">
              <button
                onClick={() => setActiveTab('received')}
                className={`pb-1 text-sm font-semibold relative transition-colors ${
                  activeTab === 'received'
                    ? 'text-sky-600'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <span>已签收</span>
                <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[11px] bg-sky-100 text-sky-700 font-mono">
                  {receivedHistory.length}
                </span>
                {activeTab === 'received' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-600 rounded-full" />
                )}
              </button>

              <button
                onClick={() => setActiveTab('rejected')}
                className={`pb-1 text-sm font-semibold relative transition-colors ${
                  activeTab === 'rejected'
                    ? 'text-rose-600'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <span>已拒收</span>
                {rejectedList.length > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[11px] bg-rose-100 text-rose-700 font-mono">
                    {rejectedList.length}
                  </span>
                )}
                {activeTab === 'rejected' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-600 rounded-full" />
                )}
              </button>
            </div>

            {/* Right: Search and Filter Controls */}
            <div className="flex items-center flex-wrap gap-2 text-xs">
              {/* Time Range */}
              <div className="flex items-center gap-1 text-slate-600">
                <span>签收时间</span>
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="bg-white border border-slate-300 rounded px-2 py-1 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-sky-500"
                >
                  <option value="今天">今天</option>
                  <option value="1天">1天</option>
                  <option value="3天">近3天</option>
                  <option value="本周">本周</option>
                </select>
              </div>

              {/* Hospital Dropdown */}
              <div className="flex items-center gap-1 text-slate-600">
                <span>申请医院</span>
                <select
                  value={selectedHospital}
                  onChange={(e) => setSelectedHospital(e.target.value)}
                  className="bg-white border border-slate-300 rounded px-2 py-1 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-sky-500"
                >
                  <option value="全部医院">全部医院</option>
                  <option value="中心医院">中心医院 (总院/东院)</option>
                  <option value="妇幼保健院">市妇幼保健院分院</option>
                  <option value="急救中心">市急救中心转运站</option>
                  <option value="康复医疗">市康复医疗院区</option>
                </select>
              </div>

              {/* Patient / Barcode Search */}
              <div className="relative">
                <input
                  type="text"
                  value={historySearchTerm}
                  onChange={(e) => setHistorySearchTerm(e.target.value)}
                  placeholder="就诊号/姓名/条码"
                  className="bg-white border border-slate-300 rounded pl-7 pr-2 py-1 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-sky-500 w-36"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2 pointer-events-none" />
              </div>

              {/* Query Button */}
              <button
                onClick={() => triggerAction('已按检索条件刷新标本流水')}
                className="px-3 py-1 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 rounded text-xs font-medium transition-colors"
              >
                查询
              </button>

              {/* Export / Print */}
              <button
                onClick={() => triggerAction('标本签收台账已导出为 Excel (LIS_RECEIVE_20261026.xlsx)')}
                className="px-2.5 py-1 bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100 rounded text-xs font-medium transition-colors flex items-center gap-1"
                title="导出签收台账"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>导出</span>
              </button>
            </div>
          </div>

          {/* Content Pane: Received vs Rejected */}
          <div className="flex-1 min-h-0 overflow-auto">
            {activeTab === 'received' ? (
              // TAB 1: 已签收流水表 (Matches screenshot table: 申请单号 | 送检时间 | 送检人 | 送检医院 | 姓名 | 条码号 | 样本类型 | 申请项目 | 申请科室 | 签收时间)
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead className="bg-slate-50 sticky top-0 z-10 text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="px-3 py-2 font-medium">申请单号</th>
                    <th className="px-3 py-2 font-medium">送检时间</th>
                    <th className="px-2.5 py-2 font-medium">送检人</th>
                    <th className="px-3 py-2 font-medium">送检医院</th>
                    <th className="px-2.5 py-2 font-medium">姓名</th>
                    <th className="px-3 py-2 font-medium">条码号</th>
                    <th className="px-2 py-2 font-medium">样本类型</th>
                    <th className="px-3 py-2 font-medium">申请项目</th>
                    <th className="px-2.5 py-2 font-medium">申请科室</th>
                    <th className="px-3 py-2 font-medium">签收时间</th>
                    <th className="px-2.5 py-2 font-medium">签收人</th>
                    <th className="px-3 py-2 font-medium">自动化流水线去向</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredHistory.length === 0 ? (
                    <tr>
                      <td colSpan={12} className="text-center py-12 text-slate-400">
                        未检索到符合条件的已签收标本记录
                      </td>
                    </tr>
                  ) : (
                    filteredHistory.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-3 py-2 font-mono text-slate-700 font-medium">
                          {row.deliveryBatchNo}
                        </td>
                        <td className="px-3 py-2 font-mono text-slate-500 text-[11px]">
                          {row.sendTime}
                        </td>
                        <td className="px-2.5 py-2 text-slate-800 font-medium">{row.deliverer}</td>
                        <td className="px-3 py-2 text-slate-600">{row.sendHospital}</td>
                        <td className="px-2.5 py-2">
                          <span className="font-semibold text-slate-900">{row.patientName}</span>
                          {row.isUrgent && (
                            <span className="ml-1 px-1 py-0.2 rounded text-[10px] bg-rose-100 text-rose-700 font-bold">
                              急
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-2 font-mono text-sky-700 font-semibold text-[11px]">
                          {row.barcode}
                        </td>
                        <td className="px-2 py-2">
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-700">
                            {row.sampleType}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-slate-800 max-w-[200px] truncate" title={row.testItem}>
                          {row.testItem}
                        </td>
                        <td className="px-2.5 py-2 text-slate-600">{row.sendDept}</td>
                        <td className="px-3 py-2 font-mono text-slate-600 text-[11px]">
                          {row.receiveTime}
                        </td>
                        <td className="px-2.5 py-2 font-medium text-slate-800">{row.receiver}</td>
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span className="text-slate-700 text-[11px] font-mono">
                              {row.pipelineDestination}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            ) : (
              // TAB 2: 已拒收标本台账
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead className="bg-rose-50/60 sticky top-0 z-10 text-rose-800 border-b border-rose-200">
                  <tr>
                    <th className="px-3 py-2 font-medium">条码号</th>
                    <th className="px-3 py-2 font-medium">送检单号</th>
                    <th className="px-2.5 py-2 font-medium">患者姓名</th>
                    <th className="px-2.5 py-2 font-medium">送检科室/床号</th>
                    <th className="px-3 py-2 font-medium">检验项目</th>
                    <th className="px-2.5 py-2 font-medium">送检人</th>
                    <th className="px-4 py-2 font-medium">拒收原因分析</th>
                    <th className="px-3 py-2 font-medium">拒收时间</th>
                    <th className="px-2.5 py-2 font-medium">核退检验师</th>
                    <th className="px-3 py-2 font-medium">处理建议与闭环</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-rose-100/50">
                  {rejectedList.map((rej) => (
                    <tr key={rej.id} className="hover:bg-rose-50/40 transition-colors">
                      <td className="px-3 py-2 font-mono text-rose-700 font-semibold text-[11px]">
                        {rej.barcode}
                      </td>
                      <td className="px-3 py-2 font-mono text-slate-600">{rej.deliveryBatchNo}</td>
                      <td className="px-2.5 py-2 font-medium text-slate-900">
                        {rej.patientName} ({rej.gender}/{rej.age})
                      </td>
                      <td className="px-2.5 py-2 text-slate-600">
                        {rej.ward} {rej.bedNo}
                      </td>
                      <td className="px-3 py-2 text-slate-800">{rej.testItem}</td>
                      <td className="px-2.5 py-2 text-slate-700">{rej.deliverer}</td>
                      <td className="px-4 py-2 max-w-[280px] whitespace-normal">
                        <span className="text-rose-700 font-medium">{rej.rejectReason}</span>
                      </td>
                      <td className="px-3 py-2 font-mono text-slate-500 text-[11px]">{rej.rejectTime}</td>
                      <td className="px-2.5 py-2 font-medium text-slate-800">{rej.rejectTechnician}</td>
                      <td className="px-3 py-2 text-slate-600 max-w-[240px] whitespace-normal text-[11px]">
                        {rej.suggestAction}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Bottom Counter (Matches screenshot "合计: 6条") */}
          <div className="p-2.5 bg-slate-50/90 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <span className="font-medium text-slate-700">
              {activeTab === 'received'
                ? `合计: ${filteredHistory.length}条已签收记录`
                : `合计: ${rejectedList.length}条拒收记录`}
            </span>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="text-slate-500">当前签收核验工位: 标本前处理总接待1号窗口</span>
              <span className="text-slate-400">|</span>
              <span className="font-mono text-emerald-600">自动化流水线接口: 正常通信 (100Mbps)</span>
            </div>
          </div>
        </div>
      </div>

      {/* ================= MODAL: 标本异常拒收登记 (Specimen Rejection Dialog) ================= */}
      {showRejectModal && itemToReject && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden">
            <div className="px-5 py-4 bg-rose-50 border-b border-rose-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                <span>标本异常拒收登记</span>
              </div>
              <button
                onClick={() => setShowRejectModal(false)}
                className="text-slate-400 hover:text-slate-600 rounded-lg p-1"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              {/* Target specimen summary */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">患者姓名:</span>
                  <span className="font-semibold text-slate-900">
                    {itemToReject.patientName} ({itemToReject.gender}/{itemToReject.age})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">试管条码:</span>
                  <span className="font-mono font-bold text-sky-700">{itemToReject.barcode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">检验项目:</span>
                  <span className="text-slate-800 font-medium">{itemToReject.testItem}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">送检病区 / 医生:</span>
                  <span className="text-slate-700">{itemToReject.department} / {itemToReject.applyDoctor}</span>
                </div>
              </div>

              {/* Standard Reject Reasons Dropdown */}
              <div>
                <label className="block text-slate-700 font-medium mb-1.5">
                  标准拒收原因 <span className="text-rose-500">*</span>
                </label>
                <select
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                >
                  <option value="溶血严重(无法测定生化指标)">溶血严重 (游离血红蛋白干扰生化指标)</option>
                  <option value="标本凝固/微凝块 (抗凝失常)">标本凝固 / 微小纤维蛋白凝块 (血常规/凝血无法上机)</option>
                  <option value="采血量不足未达抗凝比例刻度">采血量不足 (抗凝剂比例失衡，结果失真)</option>
                  <option value="采血管类型错误 (错用抗凝管/促凝管)">采血管类型错误 (如生化错用EDTA抗凝管)</option>
                  <option value="标本条码破损/脏污无法扫码机读">标本条码破损 / 褶皱 / 污染无法光学识别</option>
                  <option value="标本严重脂血/乳糜微粒干扰">重度乳糜脂血 (干扰比色与免疫检测)</option>
                  <option value="采血至送检超时/冷链脱温失活">采血后送检严重超时 / 冷链保温箱脱温</option>
                </select>
              </div>

              {/* Additional Remarks */}
              <div>
                <label className="block text-slate-700 font-medium mb-1.5">补充核退说明 (将同步发送至HIS临床护士站)</label>
                <textarea
                  value={rejectRemark}
                  onChange={(e) => setRejectRemark(e.target.value)}
                  placeholder="例如：已电话通知病区护士站李护士重新抽血；原管作退回处理..."
                  rows={3}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none placeholder:text-slate-400"
                />
              </div>

              <div className="bg-amber-50 p-2.5 rounded-lg border border-amber-200 text-amber-800 text-[11px] flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  拒收确认后，系统将自动通过 LIS-HIS 专线向责任医师与护士站下发重抽通知，并记录质量控制不良事件。
                </span>
              </div>
            </div>

            <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-1.5 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-medium transition-colors"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Ban className="w-3.5 h-3.5" />
                <span>确认拒收登记</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
