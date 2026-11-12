import React, { useState } from 'react';
import {
  MicrobiologyReagentQcItem,
  QcStatus,
  QcCategory,
  QcTargetType,
  QcProperty,
  QcTargetItem,
  QcRecordItem,
  INITIAL_REAGENT_QC_LIST,
} from '../data/microbiologyReagentQcData';
import { UserProfile } from '../types/navigation';
import {
  Search,
  RefreshCw,
  Plus,
  Trash2,
  Edit,
  Save,
  CheckCircle2,
  Clock,
  X,
  User,
  FlaskConical,
  Activity,
  Layers,
  Thermometer,
  Archive,
  Printer,
  Table2,
  Eye,
  AlertTriangle,
  FileText,
  ShieldCheck,
  Send,
  RotateCcw,
  Ban,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
} from './MenuIcon';

interface MicrobiologyReagentQcViewProps {
  user?: UserProfile;
  triggerAction: (msg: string) => void;
}

export const MicrobiologyReagentQcView: React.FC<MicrobiologyReagentQcViewProps> = ({
  user,
  triggerAction,
}) => {
  // Master QC list
  const [qcList, setQcList] = useState<MicrobiologyReagentQcItem[]>(INITIAL_REAGENT_QC_LIST);

  // Filter States
  const [statusFilter, setStatusFilter] = useState<string>('全部');
  const [categoryFilter, setCategoryFilter] = useState<string>('全部');
  const [targetTypeFilter, setTargetTypeFilter] = useState<string>('全部');
  const [qcCodeSearch, setQcCodeSearch] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('2026-10-25');
  const [endDate, setEndDate] = useState<string>('2026-10-30');

  // Selected row ID for toolbar buttons
  const [selectedQcId, setSelectedQcId] = useState<string | null>(null);

  // Modal State for right-panel transformed popup ("把右侧显示的改成弹窗展示")
  const [detailModalItem, setDetailModalItem] = useState<MicrobiologyReagentQcItem | null>(null);

  // Editable states inside the detail modal
  const [modalAnalysisText, setModalAnalysisText] = useState<string>('');
  const [modalRecords, setModalRecords] = useState<QcRecordItem[]>([]);
  const [modalTargets, setModalTargets] = useState<QcTargetItem[]>([]);

  // Auxiliary Modals
  const [showRegisterModal, setShowRegisterModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showCompleteModal, setShowCompleteModal] = useState<boolean>(false);
  const [showRevokeModal, setShowRevokeModal] = useState<boolean>(false);

  // Form states for New QC registration
  const [newQcCode, setNewQcCode] = useState<string>('07');
  const [newProjectName, setNewProjectName] = useState<string>('血液增菌培养瓶生长性能测定');
  const [newCategory, setNewCategory] = useState<QcCategory>('室内质控');
  const [newTargetType, setNewTargetType] = useState<QcTargetType>('培养基');
  const [newProperty, setNewProperty] = useState<QcProperty>('新批次质控');
  const [newTargetName, setNewTargetName] = useState<string>('需氧/厌氧双相血培养瓶');
  const [newTargetLot, setNewTargetLot] = useState<string>('500120261099');
  const [newStandardStrain, setNewStandardStrain] = useState<string>('ATCC 25922 / ATCC 25923');
  const [newStandardLot, setNewStandardLot] = useState<string>('230120261099');

  // Pagination: strictly 10 items/page
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showLocalNotice = (msg: string) => {
    setToastMessage(msg);
    triggerAction(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filtered List
  const filteredList = qcList.filter((item) => {
    if (statusFilter !== '全部' && item.status !== statusFilter) return false;
    if (categoryFilter !== '全部' && item.category !== categoryFilter) return false;
    if (targetTypeFilter !== '全部' && item.targetType !== targetTypeFilter) return false;
    if (qcCodeSearch.trim()) {
      const q = qcCodeSearch.trim().toLowerCase();
      const matchCode = item.qcCode.toLowerCase().includes(q);
      const matchName = item.projectName.toLowerCase().includes(q);
      const matchTarget = item.targets.some((t) => t.name.toLowerCase().includes(q));
      if (!matchCode && !matchName && !matchTarget) return false;
    }
    return true;
  });

  const totalPages = Math.ceil(filteredList.length / pageSize) || 1;
  const currentTableItems = filteredList.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Open Detail Modal (replaces right panel in screenshot)
  const handleOpenDetail = (item: MicrobiologyReagentQcItem) => {
    setDetailModalItem(item);
    setModalAnalysisText(item.analysisComment);
    setModalRecords([...item.records]);
    setModalTargets([...item.targets]);
  };

  // Top Bar Actions
  const handleToolbarRegister = () => {
    setShowRegisterModal(true);
  };

  const handleToolbarEdit = () => {
    const target = qcList.find((q) => q.id === selectedQcId) || filteredList[0];
    if (!target) {
      showLocalNotice('请先选择需要编辑的质控项目！');
      return;
    }
    handleOpenDetail(target);
  };

  const handleToolbarComplete = () => {
    const target = qcList.find((q) => q.id === selectedQcId) || filteredList[0];
    if (!target) {
      showLocalNotice('请先选择需要审核完成的质控项目！');
      return;
    }
    setShowCompleteModal(true);
  };

  const handleToolbarRevoke = () => {
    const target = qcList.find((q) => q.id === selectedQcId) || filteredList[0];
    if (!target) {
      showLocalNotice('请先选择需要撤销的质控项目！');
      return;
    }
    setShowRevokeModal(true);
  };

  // Save changes inside Modal (Records + Analysis)
  const handleSaveModalData = () => {
    if (!detailModalItem) return;
    const updated: MicrobiologyReagentQcItem = {
      ...detailModalItem,
      records: modalRecords,
      targets: modalTargets,
      analysisComment: modalAnalysisText,
    };
    setQcList((prev) => prev.map((q) => (q.id === updated.id ? updated : q)));
    setDetailModalItem(updated);
    showLocalNotice(`质控项目 [${updated.qcCode} - ${updated.projectName}] 结果记录与分析已成功保存！`);
  };

  // Complete QC within modal
  const handleMarkCompleteInsideModal = () => {
    if (!detailModalItem) return;
    const auditor = user?.name || '郭彩霞主任医师';
    const auditTime = '2026-10-30 11:45:00';
    const hasOut = modalRecords.some((r) => r.outcome === '失控' || r.outcome === '不合格');
    const newStatus: QcStatus = hasOut ? '失控' : '已完成';
    const conclusion = hasOut
      ? '失控！部分项目超标，已启动CAPA与不合格品处置'
      : '在控合格，符合CLSI/CAP质量标准，准予使用';

    const updated: MicrobiologyReagentQcItem = {
      ...detailModalItem,
      status: newStatus,
      auditPerson: auditor,
      auditTime: auditTime,
      conclusion: conclusion,
      records: modalRecords,
      targets: modalTargets,
      analysisComment: modalAnalysisText,
    };

    setQcList((prev) => prev.map((q) => (q.id === updated.id ? updated : q)));
    setDetailModalItem(updated);
    showLocalNotice(`质控项目 [${updated.qcCode}] 审核结案成功，状态更新为 [${newStatus}]！`);
  };

  // Add Record Row in Modal
  const handleAddModalRecordRow = () => {
    const newRow: QcRecordItem = {
      id: `r-${Date.now()}`,
      checkItem: '新增质控测试项 (如回收率/灵敏度)',
      resultValue: '实测数据在受控范围，未见异常',
      outcome: '合格',
    };
    setModalRecords((prev) => [...prev, newRow]);
    showLocalNotice('已新增一条质控结果记录项');
  };

  // Remove Record Row in Modal
  const handleRemoveModalRecordRow = (rowId: string) => {
    if (modalRecords.length <= 1) {
      showLocalNotice('至少保留一条质控结果记录！');
      return;
    }
    setModalRecords((prev) => prev.filter((r) => r.id !== rowId));
    showLocalNotice('已删除指定质控记录项');
  };

  // Submit New QC Registration
  const handleSubmitNewRegister = () => {
    const operator = user?.name || '李晓红主管检验师';
    const newId = `qc-${Date.now()}`;
    const newItem: MicrobiologyReagentQcItem = {
      id: newId,
      qcCode: newQcCode,
      status: '已登记',
      category: newCategory,
      projectName: newProjectName,
      targetType: newTargetType,
      property: newProperty,
      registerPerson: operator,
      registerTime: '2026-10-30 11:40:00',
      analysisComment: '新批次登记完成，已设置35℃恒温孵育监测，待测定目标菌生长率与无菌度。',
      conclusion: '待审核测定',
      targets: [
        {
          id: `t-${Date.now()}`,
          name: newTargetName,
          lotNo: newTargetLot,
          standardStrainName: newStandardStrain,
          standardStrainLot: newStandardLot,
          manufacturer: '郑州安图生物工程',
          expiryDate: '2027-10-31',
          storageCondition: '冷藏密封避光 (2~8℃)',
        },
      ],
      records: [
        {
          id: `r-${Date.now()}-1`,
          checkItem: '培养基外观与液体澄清度检查',
          resultValue: '澄清透明无混浊，液面无油膜气泡',
          outcome: '合格',
        },
        {
          id: `r-${Date.now()}-2`,
          checkItem: '48小时无菌试验 (35℃温箱)',
          resultValue: '孵育中，未见菌落与混浊现象',
          outcome: '合格',
        },
      ],
    };

    setQcList((prev) => [newItem, ...prev]);
    setShowRegisterModal(false);
    showLocalNotice(`质控项目 [${newQcCode} - ${newProjectName}] 登记成功！`);
  };

  // Confirm Complete Toolbar
  const handleConfirmToolbarComplete = () => {
    const target = qcList.find((q) => q.id === selectedQcId) || filteredList[0];
    if (!target) return;
    const auditor = user?.name || '郭彩霞主任医师';
    const updated: MicrobiologyReagentQcItem = {
      ...target,
      status: '已完成',
      auditPerson: auditor,
      auditTime: '2026-10-30 11:50:00',
      conclusion: '在控合格，符合WS/T及CAP评审规范，准予发放使用',
    };
    setQcList((prev) => prev.map((q) => (q.id === updated.id ? updated : q)));
    setShowCompleteModal(false);
    showLocalNotice(`已完成质控项目 [${target.qcCode}] 的审核结案！`);
  };

  // Confirm Revoke Toolbar
  const handleConfirmToolbarRevoke = () => {
    const target = qcList.find((q) => q.id === selectedQcId) || filteredList[0];
    if (!target) return;
    const updated: MicrobiologyReagentQcItem = {
      ...target,
      status: '已登记',
      auditPerson: undefined,
      auditTime: undefined,
      conclusion: '已撤销完成状态，退回重新质控测定',
    };
    setQcList((prev) => prev.map((q) => (q.id === updated.id ? updated : q)));
    setShowRevokeModal(false);
    showLocalNotice(`已将质控项目 [${target.qcCode}] 撤销重置为「已登记」！`);
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

      {/* 1. Top Query & Action Bar (Matches Screenshot image_d979ad2d.png) */}
      <div className="bg-white border-b border-slate-200 px-5 py-3 shrink-0 shadow-2xs space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Query Filter Fields */}
          <div className="flex flex-wrap items-center gap-3 flex-1">
            {/* 质控状态 */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-600 font-semibold whitespace-nowrap">质控状态:</span>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-sky-500 font-medium text-slate-800"
              >
                <option value="全部">全部状态</option>
                <option value="已登记">已登记</option>
                <option value="质控中">质控中</option>
                <option value="已完成">已完成</option>
                <option value="失控">失控</option>
              </select>
            </div>

            {/* 质控类别 */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-600 font-semibold whitespace-nowrap">质控类别:</span>
              <select
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-sky-500 font-medium text-slate-800"
              >
                <option value="全部">全部类别</option>
                <option value="室内质控">室内质控</option>
                <option value="室间质控">室间质控</option>
                <option value="仪器校准与维护">仪器校准与维护</option>
              </select>
            </div>

            {/* 对象类别 */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-600 font-semibold whitespace-nowrap">对象类别:</span>
              <select
                value={targetTypeFilter}
                onChange={(e) => {
                  setTargetTypeFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-sky-500 font-medium text-slate-800"
              >
                <option value="全部">全部对象</option>
                <option value="培养基">培养基</option>
                <option value="染色剂">染色剂</option>
                <option value="生化试剂">生化试剂</option>
                <option value="检验仪器">检验仪器</option>
              </select>
            </div>

            {/* 质控编号 */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-600 font-semibold whitespace-nowrap">质控编号/项目:</span>
              <input
                type="text"
                placeholder="编号/项目名/质控物..."
                value={qcCodeSearch}
                onChange={(e) => {
                  setQcCodeSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-40 px-2 py-1 text-xs bg-slate-50 border border-slate-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-sky-500 placeholder-slate-400 font-mono"
              />
            </div>

            {/* 查询日期 */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-600 font-semibold whitespace-nowrap">查询日期:</span>
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

            {/* 刷新 */}
            <button
              onClick={() => {
                setQcCodeSearch('');
                setStatusFilter('全部');
                setCategoryFilter('全部');
                setTargetTypeFilter('全部');
                showLocalNotice('已重置质控过滤条件');
              }}
              className="p-1.5 rounded-md border border-slate-300 bg-white hover:bg-slate-50 text-slate-600 hover:text-sky-600 transition-colors"
              title="重置刷新"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Action Buttons: 质控登记, 编辑质控, 完成质控, 撤销 */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleToolbarRegister}
              className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-md shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>质控登记</span>
            </button>

            <button
              onClick={handleToolbarEdit}
              className="px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-medium rounded-md shadow-2xs flex items-center gap-1.5 transition-colors"
            >
              <Edit className="w-3.5 h-3.5 text-slate-500" />
              <span>编辑质控</span>
            </button>

            <button
              onClick={handleToolbarComplete}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-md shadow-2xs flex items-center gap-1.5 transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>完成质控</span>
            </button>

            <button
              onClick={handleToolbarRevoke}
              className="px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-medium rounded-md shadow-2xs flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-500" />
              <span>撤销</span>
            </button>

            <button
              onClick={() => showLocalNotice('正在导出微生物培养基与试剂仪器质控台账 Excel...')}
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
              <FlaskConical className="w-3.5 h-3.5 text-sky-600" />
              <span>微生物试剂、染色液、培养基及培养箱仪器质量控制中心</span>
            </span>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
                已登记: {qcList.filter((q) => q.status === '已登记').length}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                已完成: {qcList.filter((q) => q.status === '已完成').length}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                失控报警: {qcList.filter((q) => q.status === '失控').length}
              </span>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 font-sans">
            提示：点击任意行或操作列的<strong className="text-sky-700">「详情与结果弹窗」</strong>，可展开质控对象、结果记录表及分析评价。
          </div>
        </div>
      </div>

      {/* 2. Main Full-Width Table View (Right side information converted to modal popup) */}
      <div className="flex-1 min-h-0 p-5 overflow-hidden flex flex-col">
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden flex flex-col h-full">
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse min-w-[1100px]">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 sticky top-0 z-10 select-none">
                <tr>
                  <th className="w-10 px-3 py-2.5 text-center">选择</th>
                  <th className="px-3 py-2.5 w-20">状态</th>
                  <th className="px-3 py-2.5 w-20 font-mono">质控编号</th>
                  <th className="px-3 py-2.5 w-24">质控类别</th>
                  <th className="px-3.5 py-2.5">质控项目名称</th>
                  <th className="px-3 py-2.5 w-24">质控对象类别</th>
                  <th className="px-3 py-2.5 w-24">质控性质</th>
                  <th className="px-3.5 py-2.5">质控对象 (平板/试剂/标准品)</th>
                  <th className="px-3 py-2.5">登记人</th>
                  <th className="px-3 py-2.5 font-mono">登记时间</th>
                  <th className="px-3 py-2.5">审核人</th>
                  <th className="px-3 py-2.5 text-center w-28">操作详情</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {currentTableItems.length === 0 ? (
                  <tr>
                    <td colSpan={12} className="text-center py-16 text-slate-400">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <CheckCircle2 className="w-8 h-8 text-slate-300" />
                        <span className="text-sm">暂无符合条件的质控记录</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  currentTableItems.map((item) => {
                    const isSelected = selectedQcId === item.id;
                    return (
                      <tr
                        key={item.id}
                        onClick={() => {
                          setSelectedQcId(item.id);
                          handleOpenDetail(item);
                        }}
                        className={`hover:bg-sky-50/60 transition-colors cursor-pointer group ${
                          isSelected ? 'bg-sky-50/50' : ''
                        }`}
                        title="点击查看质控对象清单与质控结果录入弹窗"
                      >
                        {/* Radio selection */}
                        <td
                          className="px-3 py-2.5 text-center"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedQcId(item.id);
                          }}
                        >
                          <input
                            type="radio"
                            name="qcTableRadio"
                            checked={isSelected}
                            onChange={() => setSelectedQcId(item.id)}
                            className="text-sky-600 focus:ring-sky-500 cursor-pointer"
                          />
                        </td>

                        {/* 状态 */}
                        <td className="px-3 py-2.5 whitespace-nowrap">
                          {item.status === '已完成' && (
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1 w-fit">
                              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                              <span>已完成</span>
                            </span>
                          )}
                          {item.status === '已登记' && (
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-sky-50 text-sky-700 border border-sky-200 flex items-center gap-1 w-fit">
                              <Clock className="w-3 h-3 text-sky-500" />
                              <span>已登记</span>
                            </span>
                          )}
                          {item.status === '质控中' && (
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1 w-fit">
                              <span>质控中</span>
                            </span>
                          )}
                          {item.status === '失控' && (
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1 w-fit">
                              <AlertTriangle className="w-3 h-3 text-rose-500" />
                              <span>失控</span>
                            </span>
                          )}
                        </td>

                        {/* 质控编号 */}
                        <td className="px-3 py-2.5 font-mono font-bold text-sky-800 whitespace-nowrap">
                          {item.qcCode}
                        </td>

                        {/* 质控类别 */}
                        <td className="px-3 py-2.5 whitespace-nowrap">
                          <span className="px-1.5 py-0.5 rounded text-[11px] bg-slate-100 text-slate-700 font-sans">
                            {item.category}
                          </span>
                        </td>

                        {/* 质控项目名称 */}
                        <td className="px-3.5 py-2.5 font-bold text-slate-900">
                          <span className="hover:text-sky-700 transition-colors">
                            {item.projectName}
                          </span>
                        </td>

                        {/* 质控对象类别 */}
                        <td className="px-3 py-2.5 whitespace-nowrap font-medium text-slate-700">
                          {item.targetType}
                        </td>

                        {/* 质控性质 */}
                        <td className="px-3 py-2.5 whitespace-nowrap font-medium text-slate-600">
                          {item.property}
                        </td>

                        {/* 质控对象摘要 */}
                        <td className="px-3.5 py-2.5 text-slate-700">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {item.targets.map((t) => (
                              <span
                                key={t.id}
                                className="px-1.5 py-0.5 bg-slate-50 border border-slate-200 text-slate-700 rounded text-[11px] font-medium truncate"
                                title={`${t.name} (批号: ${t.lotNo})`}
                              >
                                {t.name}
                              </span>
                            ))}
                          </div>
                        </td>

                        {/* 登记人 */}
                        <td className="px-3 py-2.5 text-slate-800 font-medium whitespace-nowrap">
                          {item.registerPerson}
                        </td>

                        {/* 登记时间 */}
                        <td className="px-3 py-2.5 font-mono text-slate-500 text-[11px] whitespace-nowrap">
                          {item.registerTime}
                        </td>

                        {/* 审核人 */}
                        <td className="px-3 py-2.5 text-slate-700 whitespace-nowrap">
                          {item.auditPerson ? (
                            <span className="font-bold text-slate-900">{item.auditPerson}</span>
                          ) : (
                            <span className="text-slate-400">待审核</span>
                          )}
                        </td>

                        {/* 操作详情 */}
                        <td
                          className="px-3 py-2.5 text-center whitespace-nowrap"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => {
                              setSelectedQcId(item.id);
                              handleOpenDetail(item);
                            }}
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
                合计: <strong className="text-slate-900 font-mono text-sm">{filteredList.length}</strong> 条
              </span>
              <span className="text-slate-300">|</span>
              <span>
                每页固定 <strong className="text-slate-900 font-mono">10</strong> 条
              </span>
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
      {/* 3. DETAIL MODAL POPUP (把截图右侧显示的质控对象+质控结果记录+结果分析改为弹窗展示) */}
      {/* ========================================================================= */}
      {detailModalItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-sky-600 flex items-center justify-center shrink-0 shadow-md">
                  <FlaskConical className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <span>质控项目档案与结果闭环评定</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-sky-500/30 text-sky-200 border border-sky-400/40">
                      编号: {detailModalItem.qcCode}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 font-medium">
                      {detailModalItem.category} · {detailModalItem.targetType}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        detailModalItem.status === '已完成'
                          ? 'bg-emerald-500 text-white'
                          : detailModalItem.status === '已登记'
                          ? 'bg-sky-500 text-white'
                          : detailModalItem.status === '失控'
                          ? 'bg-rose-500 text-white'
                          : 'bg-amber-500 text-white'
                      }`}
                    >
                      {detailModalItem.status}
                    </span>
                  </div>
                  <div className="text-slate-400 text-[11px] mt-0.5">
                    项目名称: <strong className="text-slate-200">{detailModalItem.projectName}</strong> | 登记人: {detailModalItem.registerPerson} ({detailModalItem.registerTime})
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    showLocalNotice(`已发送指令打印 [${detailModalItem.projectName}] 质控原始检验记录表`);
                  }}
                  className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium flex items-center gap-1 border border-slate-700 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>打印记录</span>
                </button>

                <button
                  onClick={() => setDetailModalItem(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-5 bg-slate-50/50 text-xs">
              {/* Part 1: 质控对象 (Matches Screenshot Top-Right Section) */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <Archive className="w-4 h-4 text-sky-600" />
                    <span>质控对象 (QC Targets & Reference Standards)</span>
                  </h4>
                  <span className="text-[11px] text-slate-500">
                    共 <strong className="text-sky-700 font-mono">{modalTargets.length}</strong> 组比对对象
                  </span>
                </div>

                <div className="overflow-x-auto border border-slate-200 rounded-lg">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="px-3.5 py-2">质控对象名称</th>
                        <th className="px-3.5 py-2 font-mono">质控对象批号</th>
                        <th className="px-3.5 py-2">标准品名称</th>
                        <th className="px-3.5 py-2 font-mono">标准品批号</th>
                        <th className="px-3.5 py-2">生产厂商</th>
                        <th className="px-3.5 py-2">效期 / 贮存</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {modalTargets.map((target) => (
                        <tr key={target.id} className="hover:bg-slate-50/60">
                          <td className="px-3.5 py-2 font-bold text-slate-900">{target.name}</td>
                          <td className="px-3.5 py-2 font-mono text-slate-700">{target.lotNo}</td>
                          <td className="px-3.5 py-2 font-medium text-sky-700">
                            {target.standardStrainName}
                          </td>
                          <td className="px-3.5 py-2 font-mono text-slate-600">
                            {target.standardStrainLot}
                          </td>
                          <td className="px-3.5 py-2 text-slate-600">{target.manufacturer || '-'}</td>
                          <td className="px-3.5 py-2 text-slate-500 font-mono text-[11px]">
                            {target.expiryDate || '常温受控'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Part 2: 质控结果记录 (Matches Screenshot Middle-Right Section) */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <Table2 className="w-4 h-4 text-emerald-600" />
                    <span>质控结果记录 (QC Inspection Records)</span>
                  </h4>

                  {/* Right Actions: +, -, Save (Matches Screenshot: + - 💾) */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={handleAddModalRecordRow}
                      className="px-2 py-1 bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 rounded text-xs font-bold flex items-center gap-1 transition-colors"
                      title="添加检查项"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>添加项</span>
                    </button>

                    <button
                      onClick={() => handleRemoveModalRecordRow(modalRecords[modalRecords.length - 1]?.id)}
                      className="px-2 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded text-xs font-bold flex items-center gap-1 transition-colors"
                      title="删除最后一项"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>删除项</span>
                    </button>

                    <button
                      onClick={handleSaveModalData}
                      className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold flex items-center gap-1 shadow-2xs transition-colors"
                      title="保存当前结果记录"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>保存</span>
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto border border-slate-200 rounded-lg">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="w-12 px-3 py-2 text-center">序号</th>
                        <th className="px-3.5 py-2 w-1/3">检查项</th>
                        <th className="px-3.5 py-2 w-1/2">结果值</th>
                        <th className="px-3.5 py-2 text-center w-28">质控结果</th>
                        <th className="px-2 py-2 text-center w-12">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {modalRecords.map((rec, index) => (
                        <tr key={rec.id} className="hover:bg-slate-50/50">
                          <td className="px-3 py-2 text-center font-mono text-slate-400">
                            {index + 1}
                          </td>
                          <td className="px-3.5 py-2">
                            <input
                              type="text"
                              value={rec.checkItem}
                              onChange={(e) => {
                                const val = e.target.value;
                                setModalRecords((prev) =>
                                  prev.map((r) => (r.id === rec.id ? { ...r, checkItem: val } : r))
                                );
                              }}
                              className="w-full px-2 py-1 bg-slate-50 border border-slate-300 rounded font-medium text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-sky-500"
                            />
                          </td>
                          <td className="px-3.5 py-2">
                            <input
                              type="text"
                              value={rec.resultValue}
                              onChange={(e) => {
                                const val = e.target.value;
                                setModalRecords((prev) =>
                                  prev.map((r) => (r.id === rec.id ? { ...r, resultValue: val } : r))
                                );
                              }}
                              className="w-full px-2 py-1 bg-slate-50 border border-slate-300 rounded text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-sky-500"
                            />
                          </td>
                          <td className="px-3.5 py-2 text-center">
                            <select
                              value={rec.outcome}
                              onChange={(e) => {
                                const val = e.target.value as any;
                                setModalRecords((prev) =>
                                  prev.map((r) => (r.id === rec.id ? { ...r, outcome: val } : r))
                                );
                              }}
                              className={`px-2 py-1 rounded text-xs font-bold border ${
                                rec.outcome === '在控' || rec.outcome === '合格'
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                  : rec.outcome === '失控' || rec.outcome === '不合格'
                                  ? 'bg-rose-50 text-rose-800 border-rose-300'
                                  : 'bg-amber-50 text-amber-800 border-amber-300'
                              }`}
                            >
                              <option value="合格">合格</option>
                              <option value="在控">在控</option>
                              <option value="失控">失控</option>
                              <option value="不合格">不合格</option>
                              <option value="待判定">待判定</option>
                            </select>
                          </td>
                          <td className="px-2 py-2 text-center">
                            <button
                              onClick={() => handleRemoveModalRecordRow(rec.id)}
                              className="p-1 text-slate-400 hover:text-rose-600 rounded"
                              title="删除此项"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Part 3: 项目结果分析 (Matches Screenshot Bottom-Right Section) */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-sky-600" />
                    <span>项目结果分析与质控评价 (Analysis & Quality Evaluation)</span>
                  </h4>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSaveModalData}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold flex items-center gap-1 shadow-2xs transition-colors"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>保存分析</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">
                    项目结果分析与质量评价意见：
                  </label>
                  <textarea
                    rows={4}
                    value={modalAnalysisText}
                    onChange={(e) => setModalAnalysisText(e.target.value)}
                    placeholder="请输入质控分析与评价结论..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-sky-500 leading-relaxed font-sans"
                  />
                </div>

                {/* Audit & Conclusion Info */}
                <div className="pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-50/50 p-2.5 rounded-lg">
                  <div>
                    <span className="text-slate-400 block text-[11px]">质控登记人:</span>
                    <strong className="text-slate-800">{detailModalItem.registerPerson}</strong>
                    <span className="text-slate-400 font-mono text-[10px] block">
                      {detailModalItem.registerTime}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">主审医师 / 组长:</span>
                    <strong className="text-slate-800">
                      {detailModalItem.auditPerson || user?.name || '郭彩霞主任医师'}
                    </strong>
                    <span className="text-slate-400 font-mono text-[10px] block">
                      {detailModalItem.auditTime || '待完成结案'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">结论裁定:</span>
                    <strong className="text-emerald-700 font-bold">
                      {detailModalItem.conclusion}
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="bg-white border-t border-slate-200 px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2 text-slate-500 text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>质量控制闭环准则：新批次培养基及染色剂须经国家标准质控株检测合格后方可投入临床使用。</span>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={handleSaveModalData}
                  className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-medium rounded-lg transition-colors"
                >
                  保存草稿
                </button>

                <button
                  onClick={handleMarkCompleteInsideModal}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>审核结案并批准使用</span>
                </button>

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
      {/* 4. AUXILIARY MODAL: 质控登记弹窗 (Register New QC) */}
      {/* ========================================================================= */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full flex flex-col overflow-hidden">
            <div className="bg-sky-700 text-white px-5 py-3.5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2 font-bold text-sm">
                <Plus className="w-4 h-4" />
                <span>新建试剂 / 培养基 / 仪器质控项目登记</span>
              </div>
              <button
                onClick={() => setShowRegisterModal(false)}
                className="text-sky-200 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">质控编号</label>
                  <input
                    type="text"
                    value={newQcCode}
                    onChange={(e) => setNewQcCode(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono font-bold text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">质控类别</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded font-medium text-slate-800"
                  >
                    <option value="室内质控">室内质控</option>
                    <option value="室间质控">室间质控</option>
                    <option value="仪器校准与维护">仪器校准与维护</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">质控项目名称</label>
                <input
                  type="text"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded font-medium text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">对象类别</label>
                  <select
                    value={newTargetType}
                    onChange={(e) => setNewTargetType(e.target.value as any)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded font-medium text-slate-800"
                  >
                    <option value="培养基">培养基</option>
                    <option value="染色剂">染色剂</option>
                    <option value="生化试剂">生化试剂</option>
                    <option value="检验仪器">检验仪器</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">质控性质</label>
                  <select
                    value={newProperty}
                    onChange={(e) => setNewProperty(e.target.value as any)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded font-medium text-slate-800"
                  >
                    <option value="新批次质控">新批次质控</option>
                    <option value="月质控">月质控</option>
                    <option value="日质控">日质控</option>
                    <option value="周质控">周质控</option>
                    <option value="季度校准">季度校准</option>
                  </select>
                </div>
              </div>

              {/* 质控对象预录入 */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-3">
                <span className="font-bold text-slate-800 block text-xs">质控对象与比对标准品</span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-500 text-[11px] mb-1">质控对象名称</label>
                    <input
                      type="text"
                      value={newTargetName}
                      onChange={(e) => setNewTargetName(e.target.value)}
                      className="w-full px-2.5 py-1 border border-slate-300 rounded text-slate-800 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 text-[11px] mb-1">质控对象批号</label>
                    <input
                      type="text"
                      value={newTargetLot}
                      onChange={(e) => setNewTargetLot(e.target.value)}
                      className="w-full px-2.5 py-1 border border-slate-300 rounded text-slate-800 bg-white font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-500 text-[11px] mb-1">标准品 / ATCC菌株</label>
                    <input
                      type="text"
                      value={newStandardStrain}
                      onChange={(e) => setNewStandardStrain(e.target.value)}
                      className="w-full px-2.5 py-1 border border-slate-300 rounded text-slate-800 bg-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 text-[11px] mb-1">标准品批号</label>
                    <input
                      type="text"
                      value={newStandardLot}
                      onChange={(e) => setNewStandardLot(e.target.value)}
                      className="w-full px-2.5 py-1 border border-slate-300 rounded text-slate-800 bg-white font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex justify-end gap-2 shrink-0">
              <button
                onClick={() => setShowRegisterModal(false)}
                className="px-3.5 py-1.5 bg-white border border-slate-300 rounded-md text-slate-700 hover:bg-slate-100"
              >
                取消
              </button>
              <button
                onClick={handleSubmitNewRegister}
                className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-md shadow-xs"
              >
                确认创建登记
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. AUXILIARY MODAL: 完成质控确认 (Complete Confirm) */}
      {/* ========================================================================= */}
      {showCompleteModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-sm w-full p-5 space-y-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">确认审核完成该质控？</h4>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  审核人将署名为当前检验医师，状态将变更为「已完成」并归档。
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowCompleteModal(false)}
                className="px-3.5 py-1.5 bg-white border border-slate-300 rounded-md text-slate-700 hover:bg-slate-100"
              >
                取消
              </button>
              <button
                onClick={handleConfirmToolbarComplete}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-md shadow-xs"
              >
                确认完成
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. AUXILIARY MODAL: 撤销确认 (Revoke Confirm) */}
      {/* ========================================================================= */}
      {showRevokeModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-sm w-full p-5 space-y-4 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                <RotateCcw className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">确认撤销该质控审核？</h4>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  撤销后将重置回「已登记」状态，允许重新录入结果值与分析意见。
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowRevokeModal(false)}
                className="px-3.5 py-1.5 bg-white border border-slate-300 rounded-md text-slate-700 hover:bg-slate-100"
              >
                取消
              </button>
              <button
                onClick={handleConfirmToolbarRevoke}
                className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-md shadow-xs"
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
