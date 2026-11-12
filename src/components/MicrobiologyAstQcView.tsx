import React, { useState } from 'react';
import {
  MicrobiologyAstQcItem,
  AstQcStatus,
  AstQcCategory,
  AstSpecimenItem,
  AstIdentificationItem,
  AstDrugSusceptibilityItem,
  INITIAL_AST_QC_LIST,
} from '../data/microbiologyAstQcData';
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
  CheckSquare,
} from './MenuIcon';

interface MicrobiologyAstQcViewProps {
  user?: UserProfile;
  triggerAction: (msg: string) => void;
}

export const MicrobiologyAstQcView: React.FC<MicrobiologyAstQcViewProps> = ({
  user,
  triggerAction,
}) => {
  // Master QC List
  const [astQcList, setAstQcList] = useState<MicrobiologyAstQcItem[]>(INITIAL_AST_QC_LIST);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('全部');
  const [categoryFilter, setCategoryFilter] = useState<string>('全部');
  const [barcodeSearch, setBarcodeSearch] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('2026-10-25');
  const [endDate, setEndDate] = useState<string>('2026-10-30');

  // Selected row ID
  const [selectedQcId, setSelectedQcId] = useState<string | null>(null);

  // Detail Modal State (Converts screenshot right panel into a rich popup)
  const [detailModalItem, setDetailModalItem] = useState<MicrobiologyAstQcItem | null>(null);

  // Editable states inside the detail modal
  const [modalIdentifications, setModalIdentifications] = useState<AstIdentificationItem[]>([]);
  const [modalAstResults, setModalAstResults] = useState<AstDrugSusceptibilityItem[]>([]);
  const [modalSpecimens, setModalSpecimens] = useState<AstSpecimenItem[]>([]);
  const [modalProjectResult, setModalProjectResult] = useState<string>('');
  const [modalAnalysisComment, setModalAnalysisComment] = useState<string>('');
  const [modalFeedbackResult, setModalFeedbackResult] = useState<string>('');
  const [modalFeedbackAnalysis, setModalFeedbackAnalysis] = useState<string>('');

  // Auxiliary Modals
  const [showRegisterModal, setShowRegisterModal] = useState<boolean>(false);
  const [showCompleteModal, setShowCompleteModal] = useState<boolean>(false);
  const [showRevokeModal, setShowRevokeModal] = useState<boolean>(false);

  // Form states for new registration
  const [newQcCode, setNewQcCode] = useState<string>('06');
  const [newQcName, setNewQcName] = useState<string>('综合质控');
  const [newCategory, setNewCategory] = useState<AstQcCategory>('综合质控');
  const [newTargetStrain, setNewTargetStrain] = useState<string>('ATCC 29212 (粪肠球菌标准质控株)');
  const [newBarcode, setNewBarcode] = useState<string>('QC2026103006');

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
  const filteredList = astQcList.filter((item) => {
    if (statusFilter !== '全部' && item.status !== statusFilter) return false;
    if (categoryFilter !== '全部' && item.category !== categoryFilter) return false;
    if (barcodeSearch.trim()) {
      const q = barcodeSearch.trim().toLowerCase();
      const matchCode = item.qcCode.toLowerCase().includes(q);
      const matchName = item.qcName.toLowerCase().includes(q);
      const matchBarcode = item.barcode.toLowerCase().includes(q);
      const matchStrain = item.targetStrain.toLowerCase().includes(q);
      if (!matchCode && !matchName && !matchBarcode && !matchStrain) return false;
    }
    return true;
  });

  const totalPages = Math.ceil(filteredList.length / pageSize) || 1;
  const currentTableItems = filteredList.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Open Detail Modal
  const handleOpenDetail = (item: MicrobiologyAstQcItem) => {
    setDetailModalItem(item);
    setModalIdentifications([...item.identifications]);
    setModalAstResults([...item.astResults]);
    setModalSpecimens([...item.specimens]);
    setModalProjectResult(item.projectResultSummary);
    setModalAnalysisComment(item.analysisComment);
    setModalFeedbackResult(item.feedbackResult);
    setModalFeedbackAnalysis(item.feedbackAnalysis);
  };

  // Top Bar Handlers
  const handleToolbarRegister = () => {
    setShowRegisterModal(true);
  };

  const handleToolbarEdit = () => {
    const target = astQcList.find((q) => q.id === selectedQcId) || filteredList[0];
    if (!target) {
      showLocalNotice('请先选择需要编辑修改的质控项目！');
      return;
    }
    handleOpenDetail(target);
  };

  const handleToolbarComplete = () => {
    const target = astQcList.find((q) => q.id === selectedQcId) || filteredList[0];
    if (!target) {
      showLocalNotice('请先选择需要审核完成的质控项目！');
      return;
    }
    setShowCompleteModal(true);
  };

  const handleToolbarRevoke = () => {
    const target = astQcList.find((q) => q.id === selectedQcId) || filteredList[0];
    if (!target) {
      showLocalNotice('请先选择需要撤销的质控项目！');
      return;
    }
    setShowRevokeModal(true);
  };

  // Save data inside detail modal
  const handleSaveModalData = () => {
    if (!detailModalItem) return;
    const updated: MicrobiologyAstQcItem = {
      ...detailModalItem,
      identifications: modalIdentifications,
      astResults: modalAstResults,
      specimens: modalSpecimens,
      projectResultSummary: modalProjectResult,
      analysisComment: modalAnalysisComment,
      feedbackResult: modalFeedbackResult,
      feedbackAnalysis: modalFeedbackAnalysis,
    };
    setAstQcList((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
    setDetailModalItem(updated);
    showLocalNotice(`质控项目 [${updated.qcCode} - ${updated.qcName}] 数据已成功保存！`);
  };

  // Complete QC inside modal
  const handleCompleteInsideModal = () => {
    if (!detailModalItem) return;
    const auditor = user?.name || '郭彩霞主任医师';
    const completeTime = '2026-10-30 11:55:00';
    const hasOut = modalAstResults.some((r) => r.qcOutcome === '失控');
    const newStatus: AstQcStatus = hasOut ? '失控' : '已完成';

    const updated: MicrobiologyAstQcItem = {
      ...detailModalItem,
      status: newStatus,
      auditor: auditor,
      completeTime: completeTime,
      identifications: modalIdentifications,
      astResults: modalAstResults,
      specimens: modalSpecimens,
      projectResultSummary: modalProjectResult,
      analysisComment: modalAnalysisComment,
      feedbackResult: modalFeedbackResult || (hasOut ? '失控警报，暂停出具临床报告' : '在控合格，准予发放'),
      feedbackAnalysis: modalFeedbackAnalysis || '质控符合CLSI M100要求，允许批量发放报告。',
    };

    setAstQcList((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
    setDetailModalItem(updated);
    showLocalNotice(`质控项目 [${updated.qcCode}] 审核结案成功，最终结论为 [${newStatus}]！`);
  };

  // Add Identification Row
  const handleAddIdentificationRow = () => {
    const newRow: AstIdentificationItem = {
      id: `id-${Date.now()}`,
      organismName: '新增指示菌 (如 鲍曼不动杆菌)',
      standardStrain: 'ATCC 19606',
      instrument: 'MALDI-TOF 质谱仪',
      score: '99.5% (得分 2.310)',
      outcome: '在控',
    };
    setModalIdentifications((prev) => [...prev, newRow]);
    showLocalNotice('已新增一条鉴定质控记录');
  };

  // Remove Identification Row
  const handleRemoveIdentificationRow = (id: string) => {
    if (modalIdentifications.length <= 1) {
      showLocalNotice('至少保留一条鉴定质控记录！');
      return;
    }
    setModalIdentifications((prev) => prev.filter((item) => item.id !== id));
  };

  // Add AST Result Row
  const handleAddAstRow = () => {
    const newRow: AstDrugSusceptibilityItem = {
      id: `ast-${Date.now()}`,
      antibiotic: '替加环素 (TGC)',
      method: 'MIC',
      testResult: '≤0.5 ug/mL',
      interpretation: '敏感',
      susceptibleRef: '≤1 ug/mL',
      intermediateRef: '2 ug/mL',
      resistantRef: '≥4 ug/mL',
      qcOutcome: '在控',
    };
    setModalAstResults((prev) => [...prev, newRow]);
    showLocalNotice('已新增一条药敏质控抗生素记录');
  };

  // Remove AST Result Row
  const handleRemoveAstRow = (id: string) => {
    if (modalAstResults.length <= 1) {
      showLocalNotice('至少保留一条药敏测试项目！');
      return;
    }
    setModalAstResults((prev) => prev.filter((item) => item.id !== id));
  };

  // Submit New Registration
  const handleSubmitNewRegister = () => {
    const operator = user?.name || '李晓红主管检验师';
    const newId = `ast-${Date.now()}`;
    const newItem: MicrobiologyAstQcItem = {
      id: newId,
      qcCode: newQcCode,
      status: '已登记',
      category: newCategory,
      qcName: newQcName,
      registerPerson: operator,
      registerTime: '2026-10-30 11:50:00',
      targetStrain: newTargetStrain,
      barcode: newBarcode,
      specimens: [
        {
          id: `sp-${Date.now()}-1`,
          sampleNo: '1010',
          testProject: '一般细菌培养及药敏试验',
          specimenType: '血液',
          age: '65岁',
          gender: '男',
          clinicalSymptom: '菌血症伴发热，急查常规药敏质控',
          barcode: '202610300999',
        },
      ],
      identifications: [
        {
          id: `id-${Date.now()}-1`,
          organismName: '粪肠球菌 (Enterococcus faecalis)',
          standardStrain: 'ATCC 29212',
          instrument: 'MALDI-TOF 飞行时间质谱仪',
          score: '99.9% (得分 2.420)',
          outcome: '在控',
        },
      ],
      astResults: [
        {
          id: `ast-r-${Date.now()}-1`,
          antibiotic: '氨苄西林',
          method: 'KB',
          testResult: '28 mm',
          interpretation: '敏感',
          susceptibleRef: '≥17 mm',
          intermediateRef: '-',
          resistantRef: '≤16 mm',
          qcOutcome: '在控',
        },
        {
          id: `ast-r-${Date.now()}-2`,
          antibiotic: '万古霉素',
          method: 'MIC',
          testResult: '1.0 ug/mL',
          interpretation: '敏感',
          susceptibleRef: '≤4 ug/mL',
          intermediateRef: '8-16 ug/mL',
          resistantRef: '≥32 ug/mL',
          qcOutcome: '在控',
        },
      ],
      projectResultSummary: '新批次药敏与鉴定质控登记完成，已接种M-H平板并置温箱培养。',
      analysisComment: '指示菌ATCC 29212生长旺盛，等待20小时孵育后测量抑菌圈直径。',
      feedbackResult: '已登记待测定。',
      feedbackAnalysis: '系统质控比对规范运行。',
    };

    setAstQcList((prev) => [newItem, ...prev]);
    setShowRegisterModal(false);
    showLocalNotice(`质控项目 [${newQcCode} - ${newQcName}] 登记成功！`);
  };

  // Confirm Complete Toolbar
  const handleConfirmToolbarComplete = () => {
    const target = astQcList.find((q) => q.id === selectedQcId) || filteredList[0];
    if (!target) return;
    const auditor = user?.name || '郭彩霞主任医师';
    const updated: MicrobiologyAstQcItem = {
      ...target,
      status: '已完成',
      auditor: auditor,
      completeTime: '2026-10-30 11:58:00',
    };
    setAstQcList((prev) => prev.map((q) => (q.id === updated.id ? updated : q)));
    setShowCompleteModal(false);
    showLocalNotice(`已完成质控项目 [${target.qcCode}] 的审核结案！`);
  };

  // Confirm Revoke Toolbar
  const handleConfirmToolbarRevoke = () => {
    const target = astQcList.find((q) => q.id === selectedQcId) || filteredList[0];
    if (!target) return;
    const updated: MicrobiologyAstQcItem = {
      ...target,
      status: '已登记',
      auditor: undefined,
      completeTime: undefined,
    };
    setAstQcList((prev) => prev.map((q) => (q.id === updated.id ? updated : q)));
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

      {/* 1. Top Query & Action Bar (Matches Screenshot image_60a6e9ee.png) */}
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
                <option value="鉴定质控">鉴定质控</option>
                <option value="药敏质控">药敏质控</option>
                <option value="综合质控">综合质控</option>
              </select>
            </div>

            {/* 条码号 */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-600 font-semibold whitespace-nowrap">条码号/质控菌株:</span>
              <input
                type="text"
                placeholder="条码号/编号/菌株..."
                value={barcodeSearch}
                onChange={(e) => {
                  setBarcodeSearch(e.target.value);
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
                setBarcodeSearch('');
                setStatusFilter('全部');
                setCategoryFilter('全部');
                showLocalNotice('已重置药敏质控过滤条件');
              }}
              className="p-1.5 rounded-md border border-slate-300 bg-white hover:bg-slate-50 text-slate-600 hover:text-sky-600 transition-colors"
              title="重置刷新"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Action Buttons: 质控登记, 修改登记, 完成质控, 撤销 */}
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
              <span>修改登记</span>
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
              onClick={() => showLocalNotice('正在导出微生物菌种鉴定与药敏质控 (AST QC) 台账 Excel...')}
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
              <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
              <span>微生物菌种质谱鉴定与抗菌药物敏感性试验 (CLSI M100) 质控中心</span>
            </span>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
                已登记: {astQcList.filter((q) => q.status === '已登记').length}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                已完成: {astQcList.filter((q) => q.status === '已完成').length}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                失控报警: {astQcList.filter((q) => q.status === '失控').length}
              </span>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 font-sans">
            提示：点击任意行或操作列的<strong className="text-sky-700">「详情弹窗」</strong>，可展开标本信息、菌株鉴定结果、抗生素抑菌圈与MIC判定表。
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
                  <th className="px-3.5 py-2.5 w-28">质控类别</th>
                  <th className="px-3.5 py-2.5">质控名称</th>
                  <th className="px-3.5 py-2.5">标准质控菌株</th>
                  <th className="px-3 py-2.5 font-mono">质控条码</th>
                  <th className="px-3 py-2.5">登记人</th>
                  <th className="px-3 py-2.5 font-mono">登记时间</th>
                  <th className="px-3 py-2.5 font-mono">完成时间</th>
                  <th className="px-3 py-2.5">审核医师</th>
                  <th className="px-3 py-2.5 text-center w-28">操作处置</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {currentTableItems.length === 0 ? (
                  <tr>
                    <td colSpan={12} className="text-center py-16 text-slate-400">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <CheckCircle2 className="w-8 h-8 text-slate-300" />
                        <span className="text-sm">暂无符合条件的鉴定药敏质控记录</span>
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
                        title="点击展开标本信息、质谱鉴定与药敏抑菌圈闭环弹窗"
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
                            name="astTableRadio"
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
                        <td className="px-3.5 py-2.5 whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                              item.category === '鉴定质控'
                                ? 'bg-purple-100 text-purple-800'
                                : item.category === '药敏质控'
                                ? 'bg-sky-100 text-sky-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {item.category}
                          </span>
                        </td>

                        {/* 质控名称 */}
                        <td className="px-3.5 py-2.5 font-bold text-slate-900">
                          <span className="hover:text-sky-700 transition-colors">
                            {item.qcName}
                          </span>
                        </td>

                        {/* 标准质控菌株 */}
                        <td className="px-3.5 py-2.5 font-medium text-slate-700">
                          {item.targetStrain}
                        </td>

                        {/* 质控条码 */}
                        <td className="px-3 py-2.5 font-mono text-slate-600 font-semibold whitespace-nowrap">
                          {item.barcode}
                        </td>

                        {/* 登记人 */}
                        <td className="px-3 py-2.5 text-slate-800 font-medium whitespace-nowrap">
                          {item.registerPerson}
                        </td>

                        {/* 登记时间 */}
                        <td className="px-3 py-2.5 font-mono text-slate-500 text-[11px] whitespace-nowrap">
                          {item.registerTime}
                        </td>

                        {/* 完成时间 */}
                        <td className="px-3 py-2.5 font-mono text-slate-500 text-[11px] whitespace-nowrap">
                          {item.completeTime || '-'}
                        </td>

                        {/* 审核医师 */}
                        <td className="px-3 py-2.5 text-slate-700 whitespace-nowrap">
                          {item.auditor ? (
                            <span className="font-bold text-slate-900">{item.auditor}</span>
                          ) : (
                            <span className="text-slate-400">待审核</span>
                          )}
                        </td>

                        {/* 操作处置 */}
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
      {/* 3. DETAIL MODAL POPUP (把截图右侧显示的标本信息+鉴定结果+药敏结果+结果分析改为弹窗展示) */}
      {/* ========================================================================= */}
      {detailModalItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-sky-600 flex items-center justify-center shrink-0 shadow-md">
                  <ShieldCheck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <span>微生物鉴定与药敏质控闭环档案</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-sky-500/30 text-sky-200 border border-sky-400/40">
                      编号: {detailModalItem.qcCode}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 font-medium">
                      {detailModalItem.category} · {detailModalItem.targetStrain}
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
                    条码号: <span className="font-mono text-slate-200">{detailModalItem.barcode}</span> | 登记人: {detailModalItem.registerPerson} ({detailModalItem.registerTime})
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    showLocalNotice(`已发送指令打印 [${detailModalItem.qcName}] 鉴定药敏原始质控报告单`);
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

            {/* Modal Body */}
            <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-5 bg-slate-50/50 text-xs">
              {/* Part 1: 标本信息 (Matches Screenshot Top-Right Section) */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <User className="w-4 h-4 text-sky-600" />
                    <span>标本信息 (Specimen Demographics & Clinical Symptoms)</span>
                  </h4>
                  <span className="text-[11px] text-slate-500">
                    同批次质控关联标本: <strong className="text-sky-700 font-mono">{modalSpecimens.length}</strong> 份
                  </span>
                </div>

                <div className="overflow-x-auto border border-slate-200 rounded-lg">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="px-3.5 py-2 font-mono">样本号</th>
                        <th className="px-3.5 py-2">试验项目</th>
                        <th className="px-3.5 py-2">标本类型</th>
                        <th className="px-3.5 py-2">年龄</th>
                        <th className="px-3.5 py-2">性别</th>
                        <th className="px-3.5 py-2">临床症状与初步诊断</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {modalSpecimens.map((sp) => (
                        <tr key={sp.id} className="hover:bg-slate-50/60">
                          <td className="px-3.5 py-2 font-mono font-bold text-slate-900">
                            {sp.sampleNo}
                          </td>
                          <td className="px-3.5 py-2 font-medium text-sky-800">{sp.testProject}</td>
                          <td className="px-3.5 py-2 text-slate-700">{sp.specimenType}</td>
                          <td className="px-3.5 py-2 text-slate-600">{sp.age}</td>
                          <td className="px-3.5 py-2 text-slate-600">{sp.gender}</td>
                          <td className="px-3.5 py-2 text-slate-800 font-medium">{sp.clinicalSymptom}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Part 2: 鉴定结果 + 药敏结果 并列两栏或组合区 (Matches Screenshot Middle Section) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* 鉴定结果 (4 Cols) */}
                <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3 flex flex-col">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                      <FlaskConical className="w-4 h-4 text-purple-600" />
                      <span>鉴定结果 (Identification)</span>
                    </h4>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={handleAddIdentificationRow}
                        className="p-1 bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 rounded"
                        title="添加鉴定菌种"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="overflow-x-auto border border-slate-200 rounded-lg flex-1">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                        <tr>
                          <th className="px-3 py-2">鉴定菌种</th>
                          <th className="px-3 py-2">置信度/得分</th>
                          <th className="px-2 py-2 text-center">状态</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {modalIdentifications.map((idItem) => (
                          <tr key={idItem.id} className="hover:bg-purple-50/30">
                            <td className="px-3 py-2 font-bold text-purple-950">
                              <div>{idItem.organismName}</div>
                              <span className="text-[10px] text-slate-400 font-mono block">
                                标准: {idItem.standardStrain}
                              </span>
                            </td>
                            <td className="px-3 py-2 text-slate-700 text-[11px]">
                              {idItem.score}
                            </td>
                            <td className="px-2 py-2 text-center">
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                {idItem.outcome}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 药敏结果 (8 Cols, Matches Screenshot Right Table with + - 💾) */}
                <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                      <Table2 className="w-4 h-4 text-sky-600" />
                      <span>药敏试验结果与质控靶值判定 (CLSI M100)</span>
                    </h4>

                    {/* Actions: + - 💾 */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={handleAddAstRow}
                        className="px-2 py-1 bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 rounded text-xs font-bold flex items-center gap-1 transition-colors"
                        title="添加药敏测试抗生素"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>添加抗生素</span>
                      </button>

                      <button
                        onClick={() => handleRemoveAstRow(modalAstResults[modalAstResults.length - 1]?.id)}
                        className="px-2 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded text-xs font-bold flex items-center gap-1 transition-colors"
                        title="删除最后一项"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>删除项</span>
                      </button>

                      <button
                        onClick={handleSaveModalData}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold flex items-center gap-1 shadow-2xs transition-colors"
                        title="保存当前结果"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>保存</span>
                      </button>
                    </div>
                  </div>

                  <div className="overflow-x-auto border border-slate-200 rounded-lg max-h-[340px] overflow-y-auto">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 sticky top-0 z-10">
                        <tr>
                          <th className="px-3 py-2">抗生素</th>
                          <th className="px-2 py-2 text-center w-16">方法</th>
                          <th className="px-3 py-2 w-24">药敏结果</th>
                          <th className="px-2 py-2 text-center w-20">判读结果</th>
                          <th className="px-2.5 py-2 font-mono text-[11px]">敏感参考</th>
                          <th className="px-2.5 py-2 font-mono text-[11px]">中介参考</th>
                          <th className="px-2.5 py-2 font-mono text-[11px]">耐药参考</th>
                          <th className="px-2 py-2 text-center w-16">质控</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {modalAstResults.map((ast) => (
                          <tr key={ast.id} className="hover:bg-sky-50/40">
                            <td className="px-3 py-2 font-bold text-slate-900">{ast.antibiotic}</td>
                            <td className="px-2 py-2 text-center">
                              <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[11px]">
                                {ast.method}
                              </span>
                            </td>
                            <td className="px-3 py-2">
                              <input
                                type="text"
                                value={ast.testResult}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setModalAstResults((prev) =>
                                    prev.map((r) => (r.id === ast.id ? { ...r, testResult: val } : r))
                                  );
                                }}
                                className="w-full px-2 py-0.5 bg-slate-50 border border-slate-300 rounded font-mono font-bold text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-sky-500"
                              />
                            </td>
                            <td className="px-2 py-2 text-center">
                              <select
                                value={ast.interpretation}
                                onChange={(e) => {
                                  const val = e.target.value as any;
                                  setModalAstResults((prev) =>
                                    prev.map((r) => (r.id === ast.id ? { ...r, interpretation: val } : r))
                                  );
                                }}
                                className={`px-1.5 py-0.5 rounded text-[11px] font-bold border ${
                                  ast.interpretation === '敏感'
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                    : ast.interpretation === '耐药'
                                    ? 'bg-rose-50 text-rose-800 border-rose-300'
                                    : 'bg-amber-50 text-amber-800 border-amber-300'
                                }`}
                              >
                                <option value="敏感">敏感</option>
                                <option value="中介">中介</option>
                                <option value="耐药">耐药</option>
                                <option value="SDD">SDD</option>
                              </select>
                            </td>
                            <td className="px-2.5 py-2 font-mono text-slate-600 text-[11px]">
                              {ast.susceptibleRef}
                            </td>
                            <td className="px-2.5 py-2 font-mono text-slate-600 text-[11px]">
                              {ast.intermediateRef}
                            </td>
                            <td className="px-2.5 py-2 font-mono text-slate-600 text-[11px]">
                              {ast.resistantRef}
                            </td>
                            <td className="px-2 py-2 text-center">
                              <span
                                className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                  ast.qcOutcome === '在控' || ast.qcOutcome === '合格'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                                }`}
                              >
                                {ast.qcOutcome}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Part 3: 质控项目结果 & 项目结果分析 (Matches Screenshot Bottom Section) */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-sky-600" />
                    <span>质控项目结果综合评定与分析反馈</span>
                  </h4>

                  <button
                    onClick={handleSaveModalData}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold flex items-center gap-1 shadow-2xs transition-colors"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>保存全部分析</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">
                      质控项目结果 (Summary of QC Outcome)
                    </label>
                    <textarea
                      rows={3}
                      value={modalProjectResult}
                      onChange={(e) => setModalProjectResult(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-sky-500 leading-relaxed font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-medium mb-1">
                      项目结果分析 (Analysis & CAPA Remarks)
                    </label>
                    <textarea
                      rows={3}
                      value={modalAnalysisComment}
                      onChange={(e) => setModalAnalysisComment(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-sky-500 leading-relaxed font-sans"
                    />
                  </div>
                </div>

                {/* Audit & Closure Bar */}
                <div className="pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-50/50 p-2.5 rounded-lg">
                  <div>
                    <span className="text-slate-400 block text-[11px]">质控登记人:</span>
                    <strong className="text-slate-800">{detailModalItem.registerPerson}</strong>
                    <span className="text-slate-400 font-mono text-[10px] block">
                      {detailModalItem.registerTime}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">主审签字医师:</span>
                    <strong className="text-slate-800">
                      {detailModalItem.auditor || user?.name || '郭彩霞主任医师'}
                    </strong>
                    <span className="text-slate-400 font-mono text-[10px] block">
                      {detailModalItem.completeTime || '待完成结案'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">临床报告批准状态:</span>
                    <strong className="text-emerald-700 font-bold">
                      {detailModalItem.status === '失控' ? '暂停出具临床报告' : '质控在控，准予出具'}
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="bg-white border-t border-slate-200 px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2 text-slate-500 text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>药敏质控闭环要求：每次更换纸片批号或每周常规质控，必须使用国家标准质控株检测并记录。</span>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={handleSaveModalData}
                  className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-medium rounded-lg transition-colors"
                >
                  保存草稿
                </button>

                <button
                  onClick={handleCompleteInsideModal}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>审核结案并签发</span>
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
      {/* 4. AUXILIARY MODAL: 质控登记弹窗 (Register New AST QC) */}
      {/* ========================================================================= */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full flex flex-col overflow-hidden">
            <div className="bg-sky-700 text-white px-5 py-3.5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2 font-bold text-sm">
                <Plus className="w-4 h-4" />
                <span>登记新药敏 / 菌种鉴定质控任务</span>
              </div>
              <button
                onClick={() => setShowRegisterModal(false)}
                className="text-sky-200 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
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
                    <option value="综合质控">综合质控</option>
                    <option value="药敏质控">药敏质控</option>
                    <option value="鉴定质控">鉴定质控</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">质控名称</label>
                <input
                  type="text"
                  value={newQcName}
                  onChange={(e) => setNewQcName(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded font-medium text-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">标准质控菌株 (ATCC)</label>
                <input
                  type="text"
                  value={newTargetStrain}
                  onChange={(e) => setNewTargetStrain(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded font-medium text-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">质控条码号</label>
                <input
                  type="text"
                  value={newBarcode}
                  onChange={(e) => setNewBarcode(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono text-slate-800"
                />
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
                <h4 className="font-bold text-slate-900 text-sm">确认审核完成该药敏质控？</h4>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  审核人将署名为当前主审医师，状态变更为「已完成」并归档。
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
                  撤销后将重置回「已登记」状态，允许重新录入药敏数值与分析意见。
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
