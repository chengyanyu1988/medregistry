import React, { useState, useMemo } from 'react';
import {
  AlertTriangle,
  Clock,
  CheckCircle2,
  Search,
  Filter,
  RefreshCw,
  PhoneCall,
  User,
  ShieldCheck,
  Building2,
  ChevronLeft,
  ChevronRight,
  Printer,
  Check,
  X,
  RotateCcw,
  Eye,
  CalendarCheck,
  Sparkles,
  Layers,
  ArrowRight,
  Ban,
  FileText
} from './MenuIcon';
import { UserProfile } from '../types/navigation';
import {
  CrisisManagementItem,
  INITIAL_CRISIS_ITEMS,
  CrisisFlowRecord
} from '../data/crisisManagementData';

interface CrisisValueManagementViewProps {
  user: UserProfile;
  triggerAction: (msg: string) => void;
}

export const CrisisValueManagementView: React.FC<CrisisValueManagementViewProps> = ({
  user,
  triggerAction,
}) => {
  // Main data list
  const [items, setItems] = useState<CrisisManagementItem[]>(INITIAL_CRISIS_ITEMS);
  const [selectedId, setSelectedId] = useState<string>('CR-001');
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>(['CR-001']);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('全部');
  const [typeFilter, setTypeFilter] = useState<string>('全部');
  const [barcodeFilter, setBarcodeFilter] = useState<string>('');
  const [dateStart, setDateStart] = useState<string>('2026-10-28');
  const [dateEnd, setDateEnd] = useState<string>('2026-10-29');

  // Modal dialog state (Converted right panel to modal)
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);

  // Quick feedback input inside modal
  const [feedbackInput, setFeedbackInput] = useState<string>('已对症处理');
  const [feedbackPerson, setFeedbackPerson] = useState<string>('张先义 (主治医师)');
  const [feedbackDept, setFeedbackDept] = useState<string>('内科');

  // Filtered Items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchStatus =
        statusFilter === '全部' || item.status === statusFilter;
      const matchType =
        typeFilter === '全部' || item.messageType === typeFilter;
      const matchBarcode =
        !barcodeFilter ||
        item.barcode.includes(barcodeFilter) ||
        item.patient.name.includes(barcodeFilter) ||
        item.patient.medicalRecordNo.includes(barcodeFilter) ||
        item.testResult.toLowerCase().includes(barcodeFilter.toLowerCase());
      return matchStatus && matchType && matchBarcode;
    });
  }, [items, statusFilter, typeFilter, barcodeFilter]);

  // Active / Selected item
  const currentItem = useMemo(() => {
    return items.find((i) => i.id === selectedId) || items[0];
  }, [items, selectedId]);

  // Modal navigation index
  const currentIndex = useMemo(() => {
    return filteredItems.findIndex((i) => i.id === currentItem?.id);
  }, [filteredItems, currentItem?.id]);

  const handlePrevItem = () => {
    if (filteredItems.length === 0) return;
    const prevIdx = (currentIndex - 1 + filteredItems.length) % filteredItems.length;
    setSelectedId(filteredItems[prevIdx].id);
  };

  const handleNextItem = () => {
    if (filteredItems.length === 0) return;
    const nextIdx = (currentIndex + 1) % filteredItems.length;
    setSelectedId(filteredItems[nextIdx].id);
  };

  // Toggle row selection
  const handleToggleRowSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedRowIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRowIds(filteredItems.map((i) => i.id));
    } else {
      setSelectedRowIds([]);
    }
  };

  const isAllSelected =
    filteredItems.length > 0 && selectedRowIds.length === filteredItems.length;

  // Action: Notify (通知)
  const handleBatchNotify = () => {
    if (selectedRowIds.length === 0) {
      triggerAction('请先在表格中勾选需要通报的危急值记录！');
      return;
    }
    const count = selectedRowIds.length;
    const nowTime = '2026-10-29 08:45:00';

    setItems((prev) =>
      prev.map((item) => {
        if (selectedRowIds.includes(item.id)) {
          const newFlow: CrisisFlowRecord = {
            id: `FL-NEW-${Date.now()}-${item.id}`,
            step: '消息通知',
            operator: `${user.name || '赵明远'} (检验技师)`,
            time: nowTime,
            content: `已通过专用内线电话及HIS急查红色弹窗通知临床 [${item.department}]，责任护士已口头复诵数值。`,
            receiver: item.patient.doctor,
            receiverDept: item.department,
          };
          return {
            ...item,
            status: item.status === '待处理' ? '已通知' : item.status,
            flowRecords: [...item.flowRecords, newFlow],
          };
        }
        return item;
      })
    );
    triggerAction(`已向临床科室紧急通报 ${count} 条危急值警报，已记录口头复诵！`);
  };

  // Action: Ignore (忽略)
  const handleBatchIgnore = () => {
    if (selectedRowIds.length === 0) {
      triggerAction('请先勾选需要标记忽略的危急值记录！');
      return;
    }
    const count = selectedRowIds.length;
    setItems((prev) =>
      prev.map((item) => {
        if (selectedRowIds.includes(item.id)) {
          return {
            ...item,
            status: '已忽略',
          };
        }
        return item;
      })
    );
    triggerAction(`已将 ${count} 条已知常规疗效监测危急值标记为[已忽略]！`);
  };

  // Action: Revoke (撤销)
  const handleBatchRevoke = () => {
    if (selectedRowIds.length === 0) {
      triggerAction('请先勾选需要撤销状态的记录！');
      return;
    }
    const count = selectedRowIds.length;
    setItems((prev) =>
      prev.map((item) => {
        if (selectedRowIds.includes(item.id)) {
          return {
            ...item,
            status: '待处理',
          };
        }
        return item;
      })
    );
    triggerAction(`已撤销 ${count} 条危急值状态，重置为[待处理]！`);
  };

  // Submit Feedback in Modal
  const handleSubmitFeedback = () => {
    if (!currentItem) return;
    if (!feedbackInput.trim()) {
      triggerAction('请输入临床处理反馈内容！');
      return;
    }
    const nowTime = '2026-10-29 08:46:12';
    const newFlow1: CrisisFlowRecord = {
      id: `FL-FB-${Date.now()}`,
      step: '消息反馈',
      operator: `${feedbackPerson}`,
      time: nowTime,
      content: feedbackInput.trim(),
      receiver: '检验科',
      receiverDept: '急诊检验工位',
    };
    const newFlow2: CrisisFlowRecord = {
      id: `FL-CL-${Date.now() + 1}`,
      step: '临床处置闭环',
      operator: `${feedbackPerson}`,
      time: nowTime,
      content: `临床已完成应急处置与对症用药，危急值闭环归档入病历 (TAT全程耗时 ≤8分钟，达标)。`,
      receiver: '医务部质控办',
      receiverDept: '质控中心',
    };

    setItems((prev) =>
      prev.map((it) => {
        if (it.id === currentItem.id) {
          return {
            ...it,
            status: '已反馈',
            feedback: {
              operator: feedbackPerson,
              dept: feedbackDept,
              content: feedbackInput.trim(),
              time: nowTime,
            },
            flowRecords: [...it.flowRecords, newFlow1, newFlow2],
          };
        }
        return it;
      })
    );
    triggerAction(`危急值 [${currentItem.patient.name} - ${currentItem.testItem}] 已成功提交临床处置并闭环归档！`);
  };

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-slate-100 overflow-hidden font-sans">
      {/* 1. 顶部专业多维度检索与批量处置工具栏 */}
      <div className="bg-white border-b border-slate-200/90 px-4 py-2.5 shrink-0 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* 左侧筛选控件群 */}
          <div className="flex flex-wrap items-center gap-2.5 text-xs">
            {/* 处理状态筛选 */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-600 font-medium whitespace-nowrap">处理状态:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-8 px-2.5 bg-slate-50 border border-slate-300 rounded text-slate-800 text-xs focus:ring-1 focus:ring-sky-500 focus:bg-white transition-colors"
              >
                <option value="全部">全部状态</option>
                <option value="待处理">待处理 (未闭环)</option>
                <option value="已通知">已通知 (待反馈)</option>
                <option value="已反馈">已反馈 (已闭环)</option>
                <option value="已忽略">已忽略</option>
              </select>
            </div>

            {/* 消息类型筛选 */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-600 font-medium whitespace-nowrap">消息类型:</span>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="h-8 px-2.5 bg-slate-50 border border-slate-300 rounded text-slate-800 text-xs focus:ring-1 focus:ring-sky-500 focus:bg-white transition-colors"
              >
                <option value="全部">全部类型</option>
                <option value="危急值">危急值预警</option>
                <option value="多重耐药">多重耐药菌 (MDR)</option>
                <option value="传染病">法定传染病</option>
                <option value="极限异常">极限异常值</option>
              </select>
            </div>

            {/* 查询时间范围 */}
            <div className="flex items-center gap-1">
              <span className="text-slate-600 font-medium whitespace-nowrap">查询时间:</span>
              <input
                type="date"
                value={dateStart}
                onChange={(e) => setDateStart(e.target.value)}
                className="h-8 px-2 bg-slate-50 border border-slate-300 rounded text-slate-800 font-mono text-xs focus:ring-1 focus:ring-sky-500"
              />
              <span className="text-slate-400">~</span>
              <input
                type="date"
                value={dateEnd}
                onChange={(e) => setDateEnd(e.target.value)}
                className="h-8 px-2 bg-slate-50 border border-slate-300 rounded text-slate-800 font-mono text-xs focus:ring-1 focus:ring-sky-500"
              />
            </div>

            {/* 查询条码/关键字 */}
            <div className="flex items-center gap-1">
              <span className="text-slate-600 font-medium whitespace-nowrap">查询条码:</span>
              <div className="relative">
                <input
                  type="text"
                  placeholder="条码/姓名/病历号/结果"
                  value={barcodeFilter}
                  onChange={(e) => setBarcodeFilter(e.target.value)}
                  className="h-8 w-44 pl-7 pr-2 bg-slate-50 border border-slate-300 rounded text-slate-800 text-xs placeholder-slate-400 focus:bg-white focus:ring-1 focus:ring-sky-500 transition-colors"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2.5" />
              </div>
            </div>

            {/* 刷新按钮 */}
            <button
              onClick={() => {
                setBarcodeFilter('');
                setStatusFilter('全部');
                setTypeFilter('全部');
                triggerAction('危急值队列数据已实时同步最新检验仪器接口');
              }}
              className="h-8 w-8 flex items-center justify-center border border-slate-300 hover:bg-slate-100 text-slate-600 rounded transition-colors"
              title="刷新列表"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 右侧业务执行按钮群 (通知 / 忽略 / 撤销) */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleBatchNotify}
              className="h-8 px-3.5 bg-sky-600 hover:bg-sky-700 text-white rounded font-medium text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>通知 (已复诵)</span>
            </button>

            <button
              onClick={handleBatchIgnore}
              className="h-8 px-3 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded font-medium text-xs flex items-center gap-1 transition-colors"
            >
              <Ban className="w-3.5 h-3.5 text-slate-500" />
              <span>忽略</span>
            </button>

            <button
              onClick={handleBatchRevoke}
              className="h-8 px-3 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded font-medium text-xs flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>撤销</span>
            </button>

            <div className="h-4 w-px bg-slate-200" />

            <button
              onClick={() => triggerAction('正在导出符合国家卫健委标准的危急值闭环统计分析报表 (Excel)...')}
              className="h-8 px-2.5 border border-slate-300 hover:bg-slate-100 text-slate-600 rounded text-xs flex items-center gap-1 transition-colors"
              title="导出记录"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>导出台账</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. 主体工作区：全宽危急值队列大表 */}
      <div className="flex-1 min-h-0 p-3 overflow-hidden flex flex-col">
        <div className="flex-1 flex flex-col h-full min-h-0 bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
          {/* 表头统计与提示条 */}
          <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-3">
              <span className="font-bold text-slate-900 text-xs">临生免系统 - 危急值全流程闭环管理</span>
              <span className="px-2 py-0.5 rounded-full text-[11px] bg-slate-200/80 text-slate-700 font-mono">
                共 {filteredItems.length} 条记录
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-xs text-rose-600 font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                待处理: {items.filter((i) => i.status === '待处理').length} 条
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-xs text-sky-600">
                已通知: {items.filter((i) => i.status === '已通知').length} 条
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-xs text-emerald-600">
                已闭环反馈: {items.filter((i) => i.status === '已反馈').length} 条
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span>已勾选: <strong className="font-mono text-sky-700">{selectedRowIds.length}</strong> 条</span>
              <span className="text-slate-300">|</span>
              <span className="text-slate-500 text-[11px]">点击表格任意行或“详情/处置”按钮即可弹窗查看患者档案与流转闭环</span>
            </div>
          </div>

          {/* 表格主体 */}
          <div className="flex-1 min-h-0 overflow-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-100/90 text-slate-700 font-semibold sticky top-0 z-10 border-b border-slate-200 text-[11px]">
                <tr>
                  <th className="w-10 px-3 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="w-3.5 h-3.5 rounded text-sky-600 cursor-pointer"
                    />
                  </th>
                  <th className="w-16 px-2.5 py-2">状态</th>
                  <th className="w-24 px-2.5 py-2">消息类型</th>
                  <th className="px-3 py-2">检验结果</th>
                  <th className="w-36 px-2.5 py-2">检验项目</th>
                  <th className="w-16 px-2 py-2">标本</th>
                  <th className="w-20 px-2.5 py-2">患者姓名</th>
                  <th className="w-20 px-2 py-2">性别/年龄</th>
                  <th className="w-16 px-1.5 py-2 text-center">床号</th>
                  <th className="w-28 px-2.5 py-2">科室</th>
                  <th className="w-20 px-2 py-2">责任医生</th>
                  <th className="w-24 px-2.5 py-2 font-mono">采集条码</th>
                  <th className="w-32 px-2.5 py-2 font-mono">产生时间</th>
                  <th className="w-28 px-3 py-2 text-center">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans text-xs">
                {filteredItems.map((item) => {
                  const isCurrent = item.id === currentItem?.id;
                  const isChecked = selectedRowIds.includes(item.id);

                  return (
                    <tr
                      key={item.id}
                      onClick={() => {
                        setSelectedId(item.id);
                        setFeedbackPerson(item.patient.doctor);
                        setFeedbackDept(item.patient.dept);
                        setShowDetailModal(true);
                      }}
                      className={`cursor-pointer transition-colors ${
                        isCurrent
                          ? 'bg-sky-50/90 font-medium text-slate-900 ring-1 ring-inset ring-sky-300'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="px-3 py-2.5 text-center" onClick={(e) => handleToggleRowSelect(item.id, e)}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="w-3.5 h-3.5 rounded text-sky-600 cursor-pointer"
                        />
                      </td>

                      {/* 状态 (待处理-红, 已通知-灰蓝, 已反馈-绿, 已忽略-浅灰) */}
                      <td className="px-2.5 py-2.5 whitespace-nowrap">
                        {item.status === '待处理' && (
                          <span className="inline-flex items-center gap-1 font-bold text-rose-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                            待处理
                          </span>
                        )}
                        {item.status === '已通知' && (
                          <span className="text-slate-500 font-medium">已通知</span>
                        )}
                        {item.status === '已反馈' && (
                          <span className="text-emerald-600 font-bold">已反馈</span>
                        )}
                        {item.status === '已忽略' && (
                          <span className="text-slate-400">已忽略</span>
                        )}
                      </td>

                      {/* 消息类型 */}
                      <td className="px-2.5 py-2.5">
                        <span
                          className={`inline-block px-1.5 py-0.5 rounded text-[11px] font-medium border ${
                            item.messageType === '多重耐药'
                              ? 'bg-purple-50 text-purple-700 border-purple-200'
                              : item.messageType === '传染病'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : item.messageType === '极限异常'
                              ? 'bg-orange-50 text-orange-700 border-orange-200'
                              : 'bg-rose-50 text-rose-700 border-rose-200'
                          }`}
                        >
                          {item.messageType}
                        </span>
                      </td>

                      {/* 检验结果 */}
                      <td className="px-3 py-2.5 font-semibold text-slate-900 max-w-[260px] truncate" title={item.testResult}>
                        {item.testResult}
                      </td>

                      {/* 检验项目 */}
                      <td className="px-2.5 py-2.5 text-slate-700 truncate max-w-[150px]" title={item.testItem}>
                        {item.testItem}
                      </td>

                      {/* 标本类型 */}
                      <td className="px-2 py-2.5 text-slate-600">
                        {item.sampleType}
                      </td>

                      {/* 真实患者姓名 */}
                      <td className="px-2.5 py-2.5 font-bold text-slate-900 whitespace-nowrap">
                        {item.patient.name}
                      </td>

                      {/* 性别/年龄 */}
                      <td className="px-2 py-2.5 text-slate-600 whitespace-nowrap">
                        {item.patient.gender} · {item.patient.age}
                      </td>

                      {/* 床号 */}
                      <td className="px-1.5 py-2.5 text-center font-mono text-slate-700 whitespace-nowrap">
                        {item.patient.bedNo}
                      </td>

                      {/* 科室 */}
                      <td className="px-2.5 py-2.5 text-slate-700 truncate max-w-[130px]" title={item.department}>
                        {item.department}
                      </td>

                      {/* 责任医生 */}
                      <td className="px-2 py-2.5 text-slate-600">
                        {item.patient.doctor}
                      </td>

                      {/* 采集条码 */}
                      <td className="px-2.5 py-2.5 font-mono text-slate-700 text-[11px]">
                        {item.barcode}
                      </td>

                      {/* 产生时间 */}
                      <td className="px-2.5 py-2.5 font-mono text-slate-500 text-[11px] whitespace-nowrap">
                        {item.createdAt}
                      </td>

                      {/* 操作列 */}
                      <td className="px-3 py-2.5 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => {
                            setSelectedId(item.id);
                            setFeedbackPerson(item.patient.doctor);
                            setFeedbackDept(item.patient.dept);
                            setShowDetailModal(true);
                          }}
                          className="px-2.5 py-1 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 rounded font-medium text-xs flex items-center gap-1 mx-auto transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>详情/处置</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* 列表底栏 */}
          <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0 font-mono">
            <div className="flex items-center gap-3">
              <span>合计: {filteredItems.length} 条记录</span>
              <span className="text-slate-300">|</span>
              <span className="text-slate-500 font-sans">
                符合《全国临床检验危急值报告规范》：接报至反馈闭环规定时限为 ≤ 10 分钟
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span>当前选定: <strong className="text-slate-900 font-sans">{currentItem?.patient.name}</strong></span>
              <span className="text-slate-300">|</span>
              <span>条码: <strong className="text-sky-700">{currentItem?.barcode}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. 危急值患者档案与流转处置详情弹窗 (Modal) */}
      {showDetailModal && currentItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-300 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden animate-scaleUp">
            {/* Modal Header */}
            <div className="px-5 py-3.5 bg-gradient-to-r from-slate-900 via-slate-800 to-sky-950 text-white flex items-center justify-between shrink-0 shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-rose-600 flex items-center justify-center text-white shadow-xs">
                  <AlertTriangle className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base text-white tracking-wide">
                      危急值流转闭环与处置档案
                    </span>
                    <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-white/20 text-sky-100 border border-white/30">
                      条码: {currentItem.barcode}
                    </span>
                    <span className="font-bold text-slate-100 text-sm">
                      {currentItem.patient.name} ({currentItem.patient.gender} · {currentItem.patient.age})
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        currentItem.status === '待处理'
                          ? 'bg-rose-500 text-white'
                          : currentItem.status === '已通知'
                          ? 'bg-sky-500/30 text-sky-200 border border-sky-400/40'
                          : currentItem.status === '已反馈'
                          ? 'bg-emerald-500/30 text-emerald-200 border border-emerald-400/40'
                          : 'bg-slate-700 text-slate-300'
                      }`}
                    >
                      {currentItem.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-300 font-mono mt-0.5">
                    <span>病区: {currentItem.patient.ward}</span>
                    <span>·</span>
                    <span>床号: {currentItem.patient.bedNo}</span>
                    <span>·</span>
                    <span>责任医生: {currentItem.patient.doctor}</span>
                    <span>·</span>
                    <span>类型: {currentItem.messageType}</span>
                  </div>
                </div>
              </div>

              {/* 上一份 / 下一份快捷切换与关闭 */}
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-slate-800/80 rounded-lg p-0.5 border border-slate-700 text-xs">
                  <button
                    onClick={handlePrevItem}
                    className="px-2.5 py-1 hover:bg-slate-700 text-slate-200 rounded flex items-center gap-1 transition-colors"
                    title="上一份记录"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>上一份</span>
                  </button>
                  <span className="px-2 font-mono text-[11px] text-slate-400 border-x border-slate-700">
                    {currentIndex + 1} / {filteredItems.length}
                  </span>
                  <button
                    onClick={handleNextItem}
                    className="px-2.5 py-1 hover:bg-slate-700 text-slate-200 rounded flex items-center gap-1 transition-colors"
                    title="下一份记录"
                  >
                    <span>下一份</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={() => setShowDetailModal(false)}
                  className="w-8 h-8 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white flex items-center justify-center transition-colors text-lg"
                  title="关闭弹窗 (Esc)"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Body: 纵向高保真卡片区 (包含截图中的患者信息、处理信息及反馈区) */}
            <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5 space-y-4 bg-slate-50">
              
              {/* 卡片 1: 患者基础信息 (精准对应截图顶部“患者信息”) */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-4">
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100">
                  <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                    <User className="w-4 h-4 text-sky-600" />
                    <span>患者基础档案信息</span>
                  </h4>
                  <span className="text-[11px] text-slate-500 font-mono">
                    患者来源: <strong className="text-slate-800 font-sans">{currentItem.patient.source}</strong>
                  </span>
                </div>

                {/* 网格表单展示 (4列响应式布局) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">姓名</label>
                    <div className="bg-slate-50 px-2.5 py-1.5 rounded border border-slate-200 font-bold text-slate-900">
                      {currentItem.patient.name}
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">性别</label>
                    <div className="bg-slate-50 px-2.5 py-1.5 rounded border border-slate-200 text-slate-800">
                      {currentItem.patient.gender}
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">年龄</label>
                    <div className="bg-slate-50 px-2.5 py-1.5 rounded border border-slate-200 text-slate-800">
                      {currentItem.patient.age}
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">民族</label>
                    <div className="bg-slate-50 px-2.5 py-1.5 rounded border border-slate-200 text-slate-800">
                      {currentItem.patient.ethnicity}
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">出生日期</label>
                    <div className="bg-slate-50 px-2.5 py-1.5 rounded border border-slate-200 font-mono text-slate-800">
                      {currentItem.patient.birthday}
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">联系电话</label>
                    <div className="bg-slate-50 px-2.5 py-1.5 rounded border border-slate-200 font-mono text-slate-800">
                      {currentItem.patient.phone}
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">病区</label>
                    <div className="bg-slate-50 px-2.5 py-1.5 rounded border border-slate-200 text-slate-800">
                      {currentItem.patient.ward}
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">床号</label>
                    <div className="bg-slate-50 px-2.5 py-1.5 rounded border border-slate-200 font-mono font-bold text-slate-900">
                      {currentItem.patient.bedNo}
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">科室</label>
                    <div className="bg-slate-50 px-2.5 py-1.5 rounded border border-slate-200 text-slate-800">
                      {currentItem.patient.dept}
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">责任医生</label>
                    <div className="bg-slate-50 px-2.5 py-1.5 rounded border border-slate-200 font-medium text-slate-900">
                      {currentItem.patient.doctor}
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">医生电话</label>
                    <div className="bg-slate-50 px-2.5 py-1.5 rounded border border-slate-200 font-mono text-slate-800">
                      {currentItem.patient.doctorPhone}
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">护士电话</label>
                    <div className="bg-slate-50 px-2.5 py-1.5 rounded border border-slate-200 font-mono text-slate-800">
                      {currentItem.patient.nursePhone}
                    </div>
                  </div>
                </div>

                {/* 临床诊断与附加信息 */}
                <div className="mt-3 space-y-2 text-xs">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">临床诊断</label>
                    <div className="bg-slate-50 px-2.5 py-1.5 rounded border border-slate-200 text-slate-900 leading-relaxed font-medium">
                      {currentItem.patient.clinicalDiagnosis}
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-0.5">附加信息 / 临床特殊要求</label>
                    <div className="bg-slate-50 px-2.5 py-1.5 rounded border border-slate-200 text-slate-600 leading-relaxed">
                      {currentItem.patient.additionalInfo}
                    </div>
                  </div>
                </div>
              </div>

              {/* 卡片 2: 触发危急值检验指标分析 */}
              <div className="bg-rose-50/60 rounded-xl border border-rose-200 shadow-2xs p-4">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-rose-100 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                    <span className="font-bold text-rose-950">报警指标详情: {currentItem.testItem}</span>
                    <span className="px-1.5 py-0.2 rounded text-[10px] bg-rose-600 text-white font-bold">
                      {currentItem.messageType}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-rose-800">
                    产生时间: {currentItem.createdAt}
                  </span>
                </div>

                <div className="bg-white p-3 rounded-lg border border-rose-200 text-xs space-y-2">
                  <div className="text-slate-900 font-bold text-sm">
                    {currentItem.testResult}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-600 font-mono pt-1 border-t border-slate-100">
                    <div>标本类型: <span className="text-slate-900 font-sans">{currentItem.sampleType}</span></div>
                    <div>条码号: <span className="text-slate-900">{currentItem.barcode}</span></div>
                    <div>申请科室: <span className="text-slate-900 font-sans">{currentItem.department}</span></div>
                    <div>复核状态: <span className="text-emerald-700 font-sans font-bold">已双孔复验确认</span></div>
                  </div>
                </div>
              </div>

              {/* 卡片 3: 处理信息与全程流转闭环 (精准对应截图中的“处理信息”表格与流程节点) */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-4">
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100">
                  <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-sky-600" />
                    <span>处理信息 / 流程闭环流转明细</span>
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    全程可追溯 · 满足三甲医院临床危急值质控核心制度
                  </span>
                </div>

                <div className="overflow-x-auto rounded-lg border border-slate-200">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 text-[11px]">
                      <tr>
                        <th className="w-28 px-3 py-2">流程环节</th>
                        <th className="w-24 px-3 py-2">处理人</th>
                        <th className="w-36 px-3 py-2 font-mono">处理时间</th>
                        <th className="px-3 py-2">内容</th>
                        <th className="w-24 px-3 py-2">接收人</th>
                        <th className="w-28 px-3 py-2">接收科室</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {currentItem.flowRecords.map((fl, idx) => {
                        const isLatest = idx === currentItem.flowRecords.length - 1;
                        return (
                          <tr key={fl.id} className="hover:bg-slate-50">
                            {/* 流程环节 (带蓝色节点小圆圈) */}
                            <td className="px-3 py-2.5 font-medium whitespace-nowrap">
                              <span className="flex items-center gap-2">
                                <span
                                  className={`w-2.5 h-2.5 rounded-full border-2 ${
                                    isLatest
                                      ? 'border-sky-600 bg-white ring-2 ring-sky-200'
                                      : 'border-slate-300 bg-slate-200'
                                  }`}
                                />
                                <span className={isLatest ? 'text-sky-700 font-bold' : 'text-slate-700'}>
                                  {fl.step}
                                </span>
                              </span>
                            </td>

                            {/* 处理人 */}
                            <td className="px-3 py-2.5 font-medium text-slate-800 whitespace-nowrap">
                              {fl.operator}
                            </td>

                            {/* 处理时间 */}
                            <td className="px-3 py-2.5 font-mono text-slate-500 whitespace-nowrap text-[11px]">
                              {fl.time}
                            </td>

                            {/* 内容 */}
                            <td className="px-3 py-2.5 text-slate-800 leading-relaxed font-normal">
                              {fl.content}
                            </td>

                            {/* 接收人 */}
                            <td className="px-3 py-2.5 text-slate-600 whitespace-nowrap">
                              {fl.receiver || '-'}
                            </td>

                            {/* 接收科室 */}
                            <td className="px-3 py-2.5 text-slate-600 whitespace-nowrap">
                              {fl.receiverDept || '-'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 卡片 4: 临床反馈与闭环处置录入区 (精准对应截图底部的“反馈人”、“反馈科室”、“反馈内容”) */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>临床处置反馈录入与闭环归档</span>
                  </h4>
                  <span className="text-[11px] text-slate-500">
                    当前反馈状态: <strong className="text-emerald-700">{currentItem.status === '已反馈' ? '已完成闭环' : '等待临床反馈'}</strong>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">反馈人</label>
                    <input
                      type="text"
                      value={feedbackPerson}
                      onChange={(e) => setFeedbackPerson(e.target.value)}
                      placeholder="录入反馈医生/护士姓名"
                      className="w-full h-8 px-2.5 bg-slate-50 border border-slate-300 rounded text-slate-800 text-xs focus:bg-white focus:ring-1 focus:ring-sky-500"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">反馈科室</label>
                    <input
                      type="text"
                      value={feedbackDept}
                      onChange={(e) => setFeedbackDept(e.target.value)}
                      placeholder="录入临床科室"
                      className="w-full h-8 px-2.5 bg-slate-50 border border-slate-300 rounded text-slate-800 text-xs focus:bg-white focus:ring-1 focus:ring-sky-500"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] text-slate-400">反馈处置内容</label>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-slate-400">快捷短语:</span>
                      <button
                        onClick={() => setFeedbackInput('已对症处理')}
                        className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[10px] transition-colors"
                      >
                        + 已对症处理
                      </button>
                      <button
                        onClick={() => setFeedbackInput('静推葡萄糖酸钙及利尿排钾，心电监护持续待命')}
                        className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[10px] transition-colors"
                      >
                        + 静推排钾极化液
                      </button>
                      <button
                        onClick={() => setFeedbackInput('已开启胸痛中心绿色通道介入急救，家属知情同意')}
                        className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[10px] transition-colors"
                      >
                        + 启动胸痛急救
                      </button>
                      <button
                        onClick={() => setFeedbackInput('已转入单间负压隔离，强化抗感染方案并填报直报网')}
                        className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[10px] transition-colors"
                      >
                        + 启动隔离直报
                      </button>
                    </div>
                  </div>

                  <textarea
                    rows={2}
                    value={feedbackInput}
                    onChange={(e) => setFeedbackInput(e.target.value)}
                    placeholder="输入具体的临床医疗处置、家属沟通及复查安排..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 leading-relaxed resize-none focus:bg-white focus:ring-1 focus:ring-sky-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    onClick={() => {
                      triggerAction(`已记录电话通知: [${currentItem.patient.name}]，护士已复述确认。`);
                    }}
                    className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded-lg font-medium text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-sky-600" />
                    <span>电话通知接通复述登记</span>
                  </button>

                  <button
                    onClick={handleSubmitFeedback}
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>提交反馈并闭环归档</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3 bg-slate-100 border-t border-slate-300 flex items-center justify-between shrink-0 text-xs">
              <div className="flex items-center gap-3 text-slate-500 font-mono text-[11px]">
                <span className="flex items-center gap-1 text-emerald-700 font-semibold font-sans">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>危急值闭环质控: 达标 (平均用时 4.2分钟 ≤ 10分钟)</span>
                </span>
                <span>·</span>
                <span>质控监督人: 蔡建华 (副主任技师)</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => triggerAction(`正在打印标本 [${currentItem.barcode}] 的危急值处置闭环追溯单据...`)}
                  className="px-3.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded-lg font-medium transition-colors flex items-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-500" />
                  <span>打印处置单</span>
                </button>

                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-semibold shadow-xs transition-colors"
                >
                  完成并返回列表
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
