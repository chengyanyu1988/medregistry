import React, { useState } from 'react';
import {
  MicrobiologyNotificationItem,
  NotificationStatus,
  NotificationType,
  ProcessStep,
  INITIAL_MICROBIOLOGY_NOTIFICATIONS,
} from '../data/microbiologyNotificationData';
import { UserProfile } from '../types/navigation';
import {
  Search,
  RefreshCw,
  Bell,
  Clock,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  X,
  User,
  ShieldCheck,
  Send,
  PhoneCall,
  RotateCcw,
  Ban,
  Printer,
  ChevronLeft,
  ChevronRight,
  Eye,
  FileSpreadsheet,
  CheckSquare,
  FileText,
  Activity,
  Layers,
} from './MenuIcon';

interface MicrobiologyNotificationViewProps {
  user?: UserProfile;
  triggerAction: (msg: string) => void;
}

export const MicrobiologyNotificationView: React.FC<MicrobiologyNotificationViewProps> = ({
  user,
  triggerAction,
}) => {
  // Notification dataset
  const [notifications, setNotifications] = useState<MicrobiologyNotificationItem[]>(
    INITIAL_MICROBIOLOGY_NOTIFICATIONS
  );

  // Filter States
  const [statusFilter, setStatusFilter] = useState<string>('全部');
  const [startDate, setStartDate] = useState<string>('2026-10-25');
  const [endDate, setEndDate] = useState<string>('2026-10-30');
  const [barcodeSearch, setBarcodeSearch] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('全部');

  // Selected Row IDs for batch operations
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modal State for right-panel transformed popup ("把右侧显示的改成弹窗展示")
  const [detailModalItem, setDetailModalItem] = useState<MicrobiologyNotificationItem | null>(null);
  const [activeProcessStepId, setActiveProcessStepId] = useState<string | null>(null);

  // Auxiliary Action Modals
  const [showNotifyModal, setShowNotifyModal] = useState<boolean>(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState<boolean>(false);
  const [showIgnoreConfirmModal, setShowIgnoreConfirmModal] = useState<boolean>(false);
  const [showRevokeConfirmModal, setShowRevokeConfirmModal] = useState<boolean>(false);

  // Action Form States
  const [notifyTargetDoctor, setNotifyTargetDoctor] = useState<string>('');
  const [notifyTargetDept, setNotifyTargetDept] = useState<string>('');
  const [notifyMethod, setNotifyMethod] = useState<string>('电话直通 + HIS危急值强弹窗');
  const [notifyNotes, setNotifyNotes] = useState<string>('已复诵确认无误，提示病区立即加急处置');

  const [feedbackDoctor, setFeedbackDoctor] = useState<string>('');
  const [feedbackDept, setFeedbackDept] = useState<string>('');
  const [feedbackMeasure, setFeedbackMeasure] = useState<string>('已对症处理：启动单间接触隔离防护，调整降阶梯抗感染方案');

  // Table Pagination: strictly 10 items/page
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  // Toast Notice
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showLocalNotice = (msg: string) => {
    setToastMessage(msg);
    triggerAction(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filtered Notifications
  const filteredNotifications = notifications.filter((item) => {
    if (statusFilter !== '全部' && item.status !== statusFilter) return false;
    if (typeFilter !== '全部' && item.type !== typeFilter) return false;
    if (barcodeSearch.trim()) {
      const q = barcodeSearch.trim().toLowerCase();
      const matchBarcode = item.barcode.toLowerCase().includes(q);
      const matchPatient = item.patient.name.toLowerCase().includes(q);
      const matchResult = item.testResult.toLowerCase().includes(q);
      const matchDept = item.department.toLowerCase().includes(q);
      if (!matchBarcode && !matchPatient && !matchResult && !matchDept) return false;
    }
    return true;
  });

  const totalPages = Math.ceil(filteredNotifications.length / pageSize) || 1;
  const currentTableItems = filteredNotifications.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Counts for Top Badges
  const pendingCount = notifications.filter((n) => n.status === '待处理').length;
  const notifiedCount = notifications.filter((n) => n.status === '已通知').length;
  const feedbackCount = notifications.filter((n) => n.status === '已反馈').length;
  const ignoredCount = notifications.filter((n) => n.status === '已忽略').length;

  // Toggle selection
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === currentTableItems.length && currentTableItems.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(currentTableItems.map((n) => n.id));
    }
  };

  // Open Detail Modal
  const handleOpenDetailModal = (item: MicrobiologyNotificationItem) => {
    setDetailModalItem(item);
    if (item.processHistory.length > 0) {
      setActiveProcessStepId(item.processHistory[0].id);
    } else {
      setActiveProcessStepId(null);
    }
  };

  // Top Bar Action: 「通知」
  const handleTopNotifyClick = () => {
    if (selectedIds.length === 0) {
      showLocalNotice('请先勾选需要发送通知的标本消息记录！');
      return;
    }
    const targetItem = notifications.find((n) => n.id === selectedIds[0]) || notifications[0];
    setNotifyTargetDoctor(targetItem.patient.doctor);
    setNotifyTargetDept(targetItem.patient.department);
    setShowNotifyModal(true);
  };

  // Top Bar Action: 「忽略」
  const handleTopIgnoreClick = () => {
    if (selectedIds.length === 0) {
      showLocalNotice('请先勾选需要忽略的记录！');
      return;
    }
    setShowIgnoreConfirmModal(true);
  };

  // Top Bar Action: 「撤销」
  const handleTopRevokeClick = () => {
    if (selectedIds.length === 0) {
      showLocalNotice('请先勾选需要撤销状态的记录！');
      return;
    }
    setShowRevokeConfirmModal(true);
  };

  // Confirm Send Notification
  const handleConfirmNotification = () => {
    const operatorName = user?.name || '李晓红主管检验师';
    const currentTime = '2026-10-30 11:50:24';

    setNotifications((prev) =>
      prev.map((item) => {
        if (!selectedIds.includes(item.id) && item.id !== detailModalItem?.id) return item;

        const newStep: ProcessStep = {
          id: `ps-${Date.now()}-${item.id}`,
          stageName: '消息通知',
          operator: operatorName,
          time: currentTime,
          content: `${notifyMethod}：通知 ${notifyTargetDoctor || item.patient.doctor}，${notifyNotes}`,
          recipient: notifyTargetDoctor || item.patient.doctor,
          recipientDept: notifyTargetDept || item.patient.department,
        };

        const updated = {
          ...item,
          status: '已通知' as NotificationStatus,
          processHistory: [newStep, ...item.processHistory],
        };

        if (detailModalItem?.id === item.id) {
          setDetailModalItem(updated);
        }
        return updated;
      })
    );

    setShowNotifyModal(false);
    showLocalNotice(
      `已成功向临床科室发送 ${selectedIds.length || 1} 条危急/耐药菌消息通知！`
    );
  };

  // Confirm Clinical Feedback
  const handleConfirmFeedback = () => {
    if (!detailModalItem) return;
    const operatorName = feedbackDoctor || detailModalItem.patient.doctor;
    const currentTime = '2026-10-30 11:58:30';

    const newStep: ProcessStep = {
      id: `ps-fb-${Date.now()}`,
      stageName: '消息反馈',
      operator: operatorName,
      time: currentTime,
      content: feedbackMeasure,
      recipient: '检验科微生物组',
      recipientDept: '检验科',
    };

    const updated: MicrobiologyNotificationItem = {
      ...detailModalItem,
      status: '已反馈',
      processHistory: [newStep, ...detailModalItem.processHistory],
      feedbackInfo: {
        reporter: operatorName,
        reporterDept: feedbackDept || detailModalItem.patient.department,
        feedbackContent: feedbackMeasure,
        feedbackTime: currentTime,
      },
    };

    setNotifications((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
    setDetailModalItem(updated);
    setActiveProcessStepId(newStep.id);
    setShowFeedbackModal(false);
    showLocalNotice(`临床反馈录入成功，已完成危急值闭环处理！`);
  };

  // Confirm Ignore
  const handleConfirmIgnore = () => {
    setNotifications((prev) =>
      prev.map((item) => {
        if (selectedIds.includes(item.id)) {
          return {
            ...item,
            status: '已忽略' as NotificationStatus,
          };
        }
        return item;
      })
    );
    setShowIgnoreConfirmModal(false);
    setSelectedIds([]);
    showLocalNotice(`已将选中的记录标记为「已忽略」！`);
  };

  // Confirm Revoke
  const handleConfirmRevoke = () => {
    const operatorName = user?.name || '郭彩霞主任医师';
    const currentTime = '2026-10-30 12:00:00';

    setNotifications((prev) =>
      prev.map((item) => {
        if (selectedIds.includes(item.id)) {
          const revokeStep: ProcessStep = {
            id: `ps-rev-${Date.now()}-${item.id}`,
            stageName: '撤销处理',
            operator: operatorName,
            time: currentTime,
            content: '撤销已处理/忽略状态，重新激活转入待处理队列',
          };
          return {
            ...item,
            status: '待处理' as NotificationStatus,
            processHistory: [revokeStep, ...item.processHistory],
          };
        }
        return item;
      })
    );
    setShowRevokeConfirmModal(false);
    setSelectedIds([]);
    showLocalNotice(`已撤销所选标本的处理状态，重新恢复为「待处理」！`);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-100 overflow-hidden text-xs">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 right-8 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2 border border-slate-700 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* 1. Top Query Bar & Action Controls (Matches Screenshot image_c39193e2.png) */}
      <div className="bg-white border-b border-slate-200 px-5 py-3 shrink-0 shadow-2xs space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Query Filter Fields */}
          <div className="flex flex-wrap items-center gap-3 flex-1">
            {/* 处理状态 */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-600 font-semibold whitespace-nowrap">处理状态:</span>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-sky-500 font-medium text-slate-800"
              >
                <option value="全部">全部状态</option>
                <option value="待处理">待处理</option>
                <option value="已通知">已通知</option>
                <option value="已反馈">已反馈</option>
                <option value="已忽略">已忽略</option>
              </select>
            </div>

            {/* 消息类型 */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-600 font-semibold whitespace-nowrap">消息类型:</span>
              <select
                value={typeFilter}
                onChange={(e) => {
                  setTypeFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-sky-500 font-medium text-slate-800"
              >
                <option value="全部">全部类型</option>
                <option value="多重耐药">多重耐药 (MDRO)</option>
                <option value="危急值">危急值</option>
                <option value="传染病">法定传染病</option>
                <option value="院感预警">院感预警</option>
              </select>
            </div>

            {/* 查询时间 */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-600 font-semibold whitespace-nowrap">查询时间:</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-2 py-1 text-xs bg-slate-50 border border-slate-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-sky-500 font-mono text-slate-700"
              />
              <span className="text-slate-400">~</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-2 py-1 text-xs bg-slate-50 border border-slate-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-sky-500 font-mono text-slate-700"
              />
            </div>

            {/* 查询条码 */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-600 font-semibold whitespace-nowrap">查询条码/患者:</span>
              <div className="relative">
                <input
                  type="text"
                  placeholder="输入条码/患者姓名/结果..."
                  value={barcodeSearch}
                  onChange={(e) => {
                    setBarcodeSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-48 pl-2.5 pr-7 py-1 text-xs bg-slate-50 border border-slate-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-sky-500 placeholder-slate-400"
                />
                {barcodeSearch && (
                  <button
                    onClick={() => setBarcodeSearch('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            {/* 刷新 */}
            <button
              onClick={() => {
                setBarcodeSearch('');
                setStatusFilter('全部');
                setTypeFilter('全部');
                showLocalNotice('已刷新危急值与消息通知列表');
              }}
              className="p-1.5 rounded-md border border-slate-300 bg-white hover:bg-slate-50 text-slate-600 hover:text-sky-600 transition-colors"
              title="重置刷新"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Action Buttons: 通知, 忽略, 撤销 */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleTopNotifyClick}
              className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-md shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>通知</span>
            </button>

            <button
              onClick={handleTopIgnoreClick}
              className="px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-medium rounded-md shadow-2xs flex items-center gap-1.5 transition-colors"
            >
              <Ban className="w-3.5 h-3.5 text-slate-400" />
              <span>忽略</span>
            </button>

            <button
              onClick={handleTopRevokeClick}
              className="px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-medium rounded-md shadow-2xs flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-500" />
              <span>撤销</span>
            </button>

            <button
              onClick={() => showLocalNotice('正在导出微生物消息通知闭环处置台账 Excel...')}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-md border border-slate-300 flex items-center gap-1 transition-colors"
              title="导出台账"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>导出</span>
            </button>
          </div>
        </div>

        {/* Status Dashboard Mini Banner */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-slate-600 text-xs">
          <div className="flex items-center gap-4">
            <span className="font-semibold text-slate-900 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-sky-600" />
              <span>微生物感染预警与危急值实时监控中心</span>
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setStatusFilter('待处理')}
                className={`px-2 py-0.5 rounded-full text-[11px] font-bold flex items-center gap-1 transition-colors ${
                  statusFilter === '待处理'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                <span>待处理: {pendingCount}</span>
              </button>

              <button
                onClick={() => setStatusFilter('已通知')}
                className={`px-2 py-0.5 rounded-full text-[11px] font-bold transition-colors ${
                  statusFilter === '已通知'
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200'
                }`}
              >
                已通知: {notifiedCount}
              </button>

              <button
                onClick={() => setStatusFilter('已反馈')}
                className={`px-2 py-0.5 rounded-full text-[11px] font-bold transition-colors ${
                  statusFilter === '已反馈'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                }`}
              >
                已反馈: {feedbackCount}
              </button>

              <button
                onClick={() => setStatusFilter('已忽略')}
                className={`px-2 py-0.5 rounded-full text-[11px] font-bold transition-colors ${
                  statusFilter === '已忽略'
                    ? 'bg-slate-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                已忽略: {ignoredCount}
              </button>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 font-sans">
            提示：点击任意行或操作列的<strong className="text-sky-700">「详情/流转弹窗」</strong>，可调出患者详细档案与闭环处置流转单。
          </div>
        </div>
      </div>

      {/* 2. Main Full-Width Table View (Right side information converted to modal popup) */}
      <div className="flex-1 min-h-0 p-5 overflow-hidden flex flex-col">
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden flex flex-col h-full">
          {/* Table Container */}
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse min-w-[1100px]">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 sticky top-0 z-10 select-none">
                <tr>
                  <th className="w-10 px-3 py-2.5 text-center">
                    <input
                      type="checkbox"
                      checked={
                        currentTableItems.length > 0 &&
                        selectedIds.length === currentTableItems.length
                      }
                      onChange={handleSelectAll}
                      className="rounded border-slate-300 text-sky-600 focus:ring-sky-500 cursor-pointer"
                    />
                  </th>
                  <th className="px-3 py-2.5 w-20">状态</th>
                  <th className="px-3 py-2.5 w-24">消息类型</th>
                  <th className="px-3.5 py-2.5">检验结果 (阳性/耐药菌株)</th>
                  <th className="px-3 py-2.5">检验项目</th>
                  <th className="px-3 py-2.5 w-20">标本</th>
                  <th className="px-3 py-2.5 font-mono">产生时间</th>
                  <th className="px-3 py-2.5 font-mono">采集条码</th>
                  <th className="px-3 py-2.5">申请/收治科室</th>
                  <th className="px-3 py-2.5 w-24">患者姓名</th>
                  <th className="px-3 py-2.5 text-center w-28">操作处置</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {currentTableItems.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="text-center py-16 text-slate-400">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <CheckCircle2 className="w-8 h-8 text-slate-300" />
                        <span className="text-sm">暂无符合条件的微生物预警与危急值消息</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentTableItems.map((item) => {
                    const isSelected = selectedIds.includes(item.id);
                    return (
                      <tr
                        key={item.id}
                        onClick={() => handleOpenDetailModal(item)}
                        className={`hover:bg-sky-50/60 transition-colors cursor-pointer group ${
                          isSelected ? 'bg-sky-50/40' : ''
                        }`}
                        title="点击展开患者档案与闭环处理弹窗"
                      >
                        {/* Checkbox */}
                        <td
                          className="px-3 py-2.5 text-center"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleSelect(item.id);
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleSelect(item.id)}
                            className="rounded border-slate-300 text-sky-600 focus:ring-sky-500 cursor-pointer"
                          />
                        </td>

                        {/* 状态 */}
                        <td className="px-3 py-2.5 whitespace-nowrap">
                          {item.status === '待处理' && (
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1 w-fit">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                              <span>待处理</span>
                            </span>
                          )}
                          {item.status === '已通知' && (
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-sky-50 text-sky-700 border border-sky-200 flex items-center gap-1 w-fit">
                              <Bell className="w-3 h-3 text-sky-500" />
                              <span>已通知</span>
                            </span>
                          )}
                          {item.status === '已反馈' && (
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1 w-fit">
                              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                              <span>已反馈</span>
                            </span>
                          )}
                          {item.status === '已忽略' && (
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-500 border border-slate-200 flex items-center gap-1 w-fit">
                              <span>已忽略</span>
                            </span>
                          )}
                        </td>

                        {/* 消息类型 */}
                        <td className="px-3 py-2.5 whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                              item.type === '危急值'
                                ? 'bg-red-100 text-red-800'
                                : item.type === '多重耐药'
                                ? 'bg-amber-100 text-amber-800'
                                : item.type === '传染病'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {item.type}
                          </span>
                        </td>

                        {/* 检验结果 */}
                        <td className="px-3.5 py-2.5 font-bold text-slate-900">
                          <span className="hover:text-sky-700 transition-colors">
                            {item.testResult}
                          </span>
                        </td>

                        {/* 检验项目 */}
                        <td className="px-3 py-2.5 text-slate-700 whitespace-nowrap">
                          {item.testItem}
                        </td>

                        {/* 标本 */}
                        <td className="px-3 py-2.5 text-slate-600 whitespace-nowrap font-medium">
                          {item.specimen}
                        </td>

                        {/* 产生时间 */}
                        <td className="px-3 py-2.5 font-mono text-slate-500 whitespace-nowrap text-[11px]">
                          {item.createdAt}
                        </td>

                        {/* 采集条码 */}
                        <td className="px-3 py-2.5 font-mono font-bold text-slate-700 whitespace-nowrap">
                          {item.barcode}
                        </td>

                        {/* 科室 */}
                        <td className="px-3 py-2.5 text-slate-700 whitespace-nowrap font-medium">
                          {item.department}
                        </td>

                        {/* 患者姓名 */}
                        <td className="px-3 py-2.5 text-slate-900 whitespace-nowrap">
                          <span className="font-bold">{item.patient.name}</span>
                          <span className="text-slate-400 text-[11px] ml-1">
                            ({item.patient.gender}/{item.patient.age})
                          </span>
                        </td>

                        {/* 操作处置 */}
                        <td className="px-3 py-2.5 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => handleOpenDetailModal(item)}
                            className="px-2.5 py-1 bg-sky-600 hover:bg-sky-700 text-white rounded font-medium shadow-2xs inline-flex items-center gap-1 transition-colors"
                          >
                            <Eye className="w-3 h-3" />
                            <span>详情弹窗</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table Pagination Bar (Strictly 10 items/page) */}
          <div className="bg-slate-50 px-5 py-2.5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-slate-600 text-xs shrink-0">
            <div className="flex items-center gap-3">
              <span>
                合计: <strong className="text-slate-900 font-mono text-sm">{filteredNotifications.length}</strong> 条
              </span>
              <span className="text-slate-300">|</span>
              <span>
                每页固定 <strong className="text-slate-900 font-mono">10</strong> 条
              </span>
              {selectedIds.length > 0 && (
                <span className="text-sky-700 font-medium">
                  已勾选 <strong className="font-mono">{selectedIds.length}</strong> 条
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-1 rounded border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span>
                第 <strong className="text-slate-900 font-mono">{currentPage}</strong> / {totalPages} 页
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="p-1 rounded border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. DETAIL MODAL POPUP (把截图右侧显示的患者信息+处理信息彻底改成弹窗展示) */}
      {/* ========================================================================= */}
      {detailModalItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-sky-600 flex items-center justify-center shrink-0 shadow-md">
                  <Bell className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <span>微生物危急值与耐药菌通知处置闭环</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        detailModalItem.type === '危急值'
                          ? 'bg-red-500/30 text-red-200 border border-red-500/40'
                          : detailModalItem.type === '多重耐药'
                          ? 'bg-amber-500/30 text-amber-200 border border-amber-500/40'
                          : 'bg-purple-500/30 text-purple-200 border border-purple-500/40'
                      }`}
                    >
                      {detailModalItem.type}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        detailModalItem.status === '待处理'
                          ? 'bg-rose-500 text-white'
                          : detailModalItem.status === '已通知'
                          ? 'bg-sky-500 text-white'
                          : detailModalItem.status === '已反馈'
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-600 text-white'
                      }`}
                    >
                      {detailModalItem.status}
                    </span>
                  </div>
                  <div className="text-slate-400 text-[11px] font-mono mt-0.5">
                    采集条码: {detailModalItem.barcode} | 产生时间: {detailModalItem.createdAt}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    showLocalNotice(`已发送指令打印 [${detailModalItem.patient.name}] 危急值闭环流转报告单`);
                  }}
                  className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium flex items-center gap-1 border border-slate-700 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>打印报告</span>
                </button>

                <button
                  onClick={() => setDetailModalItem(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body: Left / Right Split or Two-column Sections */}
            <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-5 bg-slate-50/50 text-xs">
              {/* Highlight Result Banner */}
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                  <div>
                    <span className="text-[11px] text-rose-700 font-semibold block">
                      核心警报检验结果：
                    </span>
                    <strong className="text-rose-950 text-sm font-bold">
                      {detailModalItem.testResult}
                    </strong>
                  </div>
                </div>
                <div className="text-right text-[11px] text-rose-700 font-medium">
                  项目: {detailModalItem.testItem} | 标本: {detailModalItem.specimen}
                </div>
              </div>

              {/* 1. 患者信息 (Matches Screenshot Patient Info Section) */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <User className="w-4 h-4 text-sky-600" />
                    <span>患者基本信息 (Patient Demographics)</span>
                  </h4>
                  <span className="text-[11px] text-slate-500 font-medium">
                    就诊来源: <strong className="text-sky-700">{detailModalItem.patient.source}</strong>
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  <div>
                    <span className="text-slate-400 block text-[11px]">姓名</span>
                    <strong className="text-slate-900 text-sm font-bold">
                      {detailModalItem.patient.name}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">性别 / 年龄</span>
                    <span className="text-slate-800 font-medium">
                      {detailModalItem.patient.gender} / {detailModalItem.patient.age}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">民族</span>
                    <span className="text-slate-800 font-medium">
                      {detailModalItem.patient.ethnicity}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">出生日期</span>
                    <span className="font-mono text-slate-800">
                      {detailModalItem.patient.birthDate}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">联系电话</span>
                    <span className="font-mono text-slate-800 font-bold">
                      {detailModalItem.patient.phone}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">收治病区</span>
                    <span className="text-slate-800 font-medium">
                      {detailModalItem.patient.inpatientWard}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">床号</span>
                    <strong className="font-mono text-sky-800 text-sm font-bold">
                      {detailModalItem.patient.bedNo}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">临床科室</span>
                    <span className="text-slate-800 font-medium">
                      {detailModalItem.patient.department}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">主管医生</span>
                    <strong className="text-slate-900 font-medium">
                      {detailModalItem.patient.doctor}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">医生电话</span>
                    <span className="font-mono text-slate-800 font-bold">
                      {detailModalItem.patient.doctorPhone}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">护士站电话</span>
                    <span className="font-mono text-slate-800">
                      {detailModalItem.patient.nursePhone}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">危急程度</span>
                    <span className="font-bold text-rose-600">极高危 (即刻隔离与抗感染)</span>
                  </div>
                </div>

                {/* 临床诊断 & 附加信息 */}
                <div className="pt-2 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <span className="text-slate-400 block text-[11px] mb-0.5">临床诊断</span>
                    <div className="p-2 bg-slate-50 rounded-lg text-slate-800 font-medium border border-slate-200">
                      {detailModalItem.patient.clinicalDiagnosis}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px] mb-0.5">附加信息 / 临床备注</span>
                    <div className="p-2 bg-slate-50 rounded-lg text-slate-700 border border-slate-200">
                      {detailModalItem.patient.additionalInfo || '无特殊附加备注'}
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. 处理信息 (Matches Screenshot Processing History Section) */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>处理信息与流转节点 (Processing Trail & Audit)</span>
                  </h4>
                  <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono">
                    全流程时限标准: ≤30分钟闭环
                  </span>
                </div>

                {/* Table for Process Steps (Matches Screenshot Right Table) */}
                <div className="overflow-x-auto border border-slate-200 rounded-lg">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="w-8 px-2 py-2 text-center">选择</th>
                        <th className="px-3 py-2 w-24">流程环节</th>
                        <th className="px-3 py-2 w-24">处理人</th>
                        <th className="px-3 py-2 w-36 font-mono">处理时间</th>
                        <th className="px-3 py-2">内容</th>
                        <th className="px-3 py-2 w-24">接收人</th>
                        <th className="px-3 py-2 w-28">接收科室</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {detailModalItem.processHistory.map((step) => {
                        const isCurrentActive = activeProcessStepId === step.id;
                        return (
                          <tr
                            key={step.id}
                            onClick={() => setActiveProcessStepId(step.id)}
                            className={`cursor-pointer transition-colors ${
                              isCurrentActive ? 'bg-sky-50 font-medium' : 'hover:bg-slate-50'
                            }`}
                          >
                            <td className="px-2 py-2 text-center">
                              <input
                                type="radio"
                                name="processRadio"
                                checked={isCurrentActive}
                                onChange={() => setActiveProcessStepId(step.id)}
                                className="text-sky-600 focus:ring-sky-500 cursor-pointer"
                              />
                            </td>
                            <td className="px-3 py-2">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  step.stageName === '危急值产生'
                                    ? 'bg-rose-100 text-rose-800'
                                    : step.stageName === '消息通知'
                                    ? 'bg-sky-100 text-sky-800'
                                    : step.stageName === '消息反馈'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-slate-100 text-slate-700'
                                }`}
                              >
                                {step.stageName}
                              </span>
                            </td>
                            <td className="px-3 py-2 font-bold text-slate-900">{step.operator}</td>
                            <td className="px-3 py-2 font-mono text-slate-500 text-[11px]">
                              {step.time}
                            </td>
                            <td className="px-3 py-2 text-slate-800">{step.content}</td>
                            <td className="px-3 py-2 text-slate-700">{step.recipient || '-'}</td>
                            <td className="px-3 py-2 text-slate-700">{step.recipientDept || '-'}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Selected Stage Detail Panel (Matches Screenshot Bottom Feedback Section) */}
                <div className="bg-slate-50 rounded-xl border border-slate-200 p-3.5 space-y-2 mt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[11px]">反馈人:</span>
                      <strong className="text-slate-900">
                        {detailModalItem.feedbackInfo?.reporter ||
                          detailModalItem.patient.doctor ||
                          '待临床科室签收反馈'}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">反馈科室:</span>
                      <strong className="text-slate-900">
                        {detailModalItem.feedbackInfo?.reporterDept ||
                          detailModalItem.patient.department}
                      </strong>
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[11px] mb-1">反馈内容:</span>
                    <div className="p-2.5 bg-white rounded-lg border border-slate-200 text-slate-800 font-medium">
                      {detailModalItem.feedbackInfo?.feedbackContent ||
                        (detailModalItem.status === '待处理'
                          ? '尚未通知临床科室，等待启动处置。'
                          : detailModalItem.status === '已通知'
                          ? '已电话通知临床医生，已完成复诵确认，等待临床录入抗感染与隔离对症反馈。'
                          : '已对症处理')}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="bg-white border-t border-slate-200 px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2 text-slate-500 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>危急值处置闭环制度：电话直报临床医护人员，双向复诵确认无误。</span>
              </div>

              <div className="flex items-center gap-2.5">
                {detailModalItem.status === '待处理' && (
                  <button
                    onClick={() => {
                      setNotifyTargetDoctor(detailModalItem.patient.doctor);
                      setNotifyTargetDept(detailModalItem.patient.department);
                      setShowNotifyModal(true);
                    }}
                    className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    <span>立即发送通知</span>
                  </button>
                )}

                {detailModalItem.status === '已通知' && (
                  <button
                    onClick={() => {
                      setFeedbackDoctor(detailModalItem.patient.doctor);
                      setFeedbackDept(detailModalItem.patient.department);
                      setShowFeedbackModal(true);
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>录入临床反馈</span>
                  </button>
                )}

                <button
                  onClick={() => setDetailModalItem(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors"
                >
                  关闭
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. AUXILIARY MODAL: 发送通知弹窗 (Trigger Notification) */}
      {/* ========================================================================= */}
      {showNotifyModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full flex flex-col overflow-hidden">
            <div className="bg-sky-700 text-white px-5 py-3.5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2 font-bold text-sm">
                <Bell className="w-4 h-4" />
                <span>发送危急值 / 多重耐药菌临床通知</span>
              </div>
              <button
                onClick={() => setShowNotifyModal(false)}
                className="text-sky-200 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">接收临床医生</label>
                <input
                  type="text"
                  value={notifyTargetDoctor}
                  onChange={(e) => setNotifyTargetDoctor(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-md font-medium text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">接收科室 / 病区</label>
                <input
                  type="text"
                  value={notifyTargetDept}
                  onChange={(e) => setNotifyTargetDept(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-md font-medium text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">通知直达途径</label>
                <select
                  value={notifyMethod}
                  onChange={(e) => setNotifyMethod(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-md font-medium text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-sky-500"
                >
                  <option value="电话直通 + HIS危急值强弹窗">电话直通 + HIS危急值强弹窗 (推荐)</option>
                  <option value="急诊内线电话专线直报">急诊内线电话专线直报</option>
                  <option value="院感防控系统实时网络推送">院感防控系统实时网络推送</option>
                  <option value="医护移动端APP推送">医护移动端APP推送</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">通知备忘与复诵内容</label>
                <textarea
                  rows={3}
                  value={notifyNotes}
                  onChange={(e) => setNotifyNotes(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-md text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-sky-500"
                />
              </div>
            </div>

            <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex justify-end gap-2 shrink-0">
              <button
                onClick={() => setShowNotifyModal(false)}
                className="px-3.5 py-1.5 bg-white border border-slate-300 rounded-md text-slate-700 hover:bg-slate-100"
              >
                取消
              </button>
              <button
                onClick={handleConfirmNotification}
                className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-md shadow-xs"
              >
                确认发出通知
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. AUXILIARY MODAL: 临床反馈弹窗 (Feedback Modal) */}
      {/* ========================================================================= */}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full flex flex-col overflow-hidden">
            <div className="bg-emerald-700 text-white px-5 py-3.5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span>临床对症处置与反馈录入</span>
              </div>
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="text-emerald-200 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">反馈经办人</label>
                  <input
                    type="text"
                    value={feedbackDoctor}
                    onChange={(e) => setFeedbackDoctor(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-md font-medium text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">反馈临床科室</label>
                  <input
                    type="text"
                    value={feedbackDept}
                    onChange={(e) => setFeedbackDept(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-md font-medium text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">对症处置与用药调整措施</label>
                <textarea
                  rows={4}
                  value={feedbackMeasure}
                  onChange={(e) => setFeedbackMeasure(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-md text-slate-800"
                />
              </div>

              <div className="p-3 bg-emerald-50 rounded-lg text-emerald-800 text-[11px] leading-relaxed">
                确认录入后，该消息通知将标记为<strong>「已反馈」</strong>，达成危急值管理闭环，数据将同步上传医院质量控制与等级评审数据库。
              </div>
            </div>

            <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex justify-end gap-2 shrink-0">
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="px-3.5 py-1.5 bg-white border border-slate-300 rounded-md text-slate-700 hover:bg-slate-100"
              >
                取消
              </button>
              <button
                onClick={handleConfirmFeedback}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-md shadow-xs"
              >
                确认录入反馈
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. AUXILIARY MODAL: 忽略确认弹窗 (Ignore Confirm Modal) */}
      {/* ========================================================================= */}
      {showIgnoreConfirmModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-sm w-full p-5 space-y-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">确认忽略所选记录？</h4>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  共选定 {selectedIds.length} 条记录，忽略后将不再在待处理红榜中提醒。
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowIgnoreConfirmModal(false)}
                className="px-3.5 py-1.5 bg-white border border-slate-300 rounded-md text-slate-700 hover:bg-slate-100"
              >
                取消
              </button>
              <button
                onClick={handleConfirmIgnore}
                className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-md shadow-xs"
              >
                确认忽略
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. AUXILIARY MODAL: 撤销确认弹窗 (Revoke Confirm Modal) */}
      {/* ========================================================================= */}
      {showRevokeConfirmModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-sm w-full p-5 space-y-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center shrink-0">
                <RotateCcw className="w-5 h-5 text-sky-600" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">确认撤销处理状态？</h4>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  共选定 {selectedIds.length} 条记录，撤销后将重置回「待处理」状态。
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowRevokeConfirmModal(false)}
                className="px-3.5 py-1.5 bg-white border border-slate-300 rounded-md text-slate-700 hover:bg-slate-100"
              >
                取消
              </button>
              <button
                onClick={handleConfirmRevoke}
                className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-md shadow-xs"
              >
                确认撤销
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
