import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  RefreshCw,
  X,
  Check,
  Building2,
  Table2,
  Trash2,
  Edit2,
  Sliders,
  FileText,
  CheckCircle2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Activity,
  Layers,
  Save,
  Barcode,
  Clock,
  ShieldAlert,
  SlidersHorizontal
} from './MenuIcon';
import { UserProfile } from '../types/navigation';
import {
  RuleCategory,
  CombinedSamplingGroup,
  SamplingGroupDetail,
  AutoAuditRule,
  TatRule,
  InfectiousRule,
  QcRuleConfig,
  INITIAL_BARCODE_CONFIG,
  INITIAL_SAMPLING_GROUPS,
  INITIAL_AUTO_AUDIT_RULES,
  INITIAL_TAT_RULES,
  INITIAL_INFECTIOUS_RULES,
  INITIAL_QC_RULES,
} from '../data/testRuleManagementData';

interface TestRuleManagementViewProps {
  user: UserProfile;
  triggerAction: (msg: string) => void;
}

export const TestRuleManagementView: React.FC<TestRuleManagementViewProps> = ({
  user,
  triggerAction,
}) => {
  // Left Vertical Menu State (Requirement: "点击左侧的，右侧内容会跟着变化")
  const [activeCategory, setActiveCategory] = useState<RuleCategory>('编码规则');

  // Top Filter Bar State (Matching screenshot: 单位名称)
  const [selectedHospitalUnit, setSelectedHospitalUnit] = useState<string>('中心医院');
  const [filterKeyword, setFilterKeyword] = useState<string>('');

  // Datasets for each rule category
  const [barcodeConfig, setBarcodeConfig] = useState(INITIAL_BARCODE_CONFIG);
  const [samplingGroups, setSamplingGroups] = useState<CombinedSamplingGroup[]>(INITIAL_SAMPLING_GROUPS);
  const [selectedSamplingGroupId, setSelectedSamplingGroupId] = useState<string>('sg-01');

  const [auditRules, setAuditRules] = useState<AutoAuditRule[]>(INITIAL_AUTO_AUDIT_RULES);
  const [tatRules, setTatRules] = useState<TatRule[]>(INITIAL_TAT_RULES);
  const [infectiousRules, setInfectiousRules] = useState<InfectiousRule[]>(INITIAL_INFECTIOUS_RULES);
  const [qcRules, setQcRules] = useState<QcRuleConfig[]>(INITIAL_QC_RULES);

  // Pagination states (Requirement: 一页帮我显示10条数据)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Modal Dialog States
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);

  // Blank Form State for Adding New Rules
  const [formCategoryData, setFormCategoryData] = useState({
    name: '',
    code: '',
    group: '生化',
    container: '黄头管(促凝胶SST 4ml)',
    specimenType: '血清',
    logicCondition: '',
    triggerAction: '',
    patientType: '急诊' as '门诊' | '住院' | '急诊',
    receiveToRun: 15,
    runToAudit: 30,
    maxTat: 60,
    diseaseName: '',
    positiveCondition: '',
    autoReportCdc: '是' as '是' | '否',
    isolationAdvice: '',
    ruleType: '失控' as '警告' | '失控' | '趋势',
    logicDescription: '',
    blockRun: '是' as '是' | '否',
    status: '启用' as '启用' | '停用',
  });

  // Category List
  const ruleCategories: RuleCategory[] = [
    '编码规则',
    '审核规则',
    'TAT规则',
    '传染病规则',
    '质控规则',
  ];

  // Currently selected Sampling Group for Section 2 under '编码规则'
  const selectedSamplingGroup = useMemo(() => {
    return samplingGroups.find((sg) => sg.id === selectedSamplingGroupId) || samplingGroups[0] || null;
  }, [samplingGroups, selectedSamplingGroupId]);

  // Paginated Dataset for current active category
  const activeDataset = useMemo(() => {
    let list: any[] = [];
    if (activeCategory === '编码规则') list = samplingGroups;
    if (activeCategory === '审核规则') list = auditRules;
    if (activeCategory === 'TAT规则') list = tatRules;
    if (activeCategory === '传染病规则') list = infectiousRules;
    if (activeCategory === '质控规则') list = qcRules;

    if (filterKeyword.trim()) {
      const kw = filterKeyword.trim().toLowerCase();
      list = list.filter((item) => {
        const jsonStr = JSON.stringify(item).toLowerCase();
        return jsonStr.includes(kw);
      });
    }

    return list;
  }, [activeCategory, samplingGroups, auditRules, tatRules, infectiousRules, qcRules, filterKeyword]);

  // Pagination calculation
  const totalItems = activeDataset.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const paginatedList = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return activeDataset.slice(startIndex, startIndex + pageSize);
  }, [activeDataset, currentPage, pageSize]);

  // Save Barcode Format Config
  const handleSaveBarcodeConfig = () => {
    triggerAction(`条码格式设置已保存: 前缀[${barcodeConfig.prefix}], 长度[${barcodeConfig.sequenceLength}], 格式[${barcodeConfig.formatContent}]`);
  };

  // Open Add Modal
  const handleOpenAddModal = () => {
    setFormCategoryData({
      name: '',
      code: `RL-${Date.now().toString().slice(-4)}`,
      group: '生化',
      container: '黄头管(促凝胶SST 4ml)',
      specimenType: '血清',
      logicCondition: '',
      triggerAction: '',
      patientType: '急诊',
      receiveToRun: 15,
      runToAudit: 30,
      maxTat: 60,
      diseaseName: '',
      positiveCondition: '',
      autoReportCdc: '是',
      isolationAdvice: '',
      ruleType: '失控',
      logicDescription: '',
      blockRun: '是',
      status: '启用',
    });
    setShowAddModal(true);
  };

  // Save New Rule
  const handleSaveNewRule = (e: React.FormEvent) => {
    e.preventDefault();
    const nowTime = '2026-10-29 10:50:00';
    const operatorName = user.name || '张珊';

    if (activeCategory === '编码规则') {
      const newSg: CombinedSamplingGroup = {
        id: `sg-${Date.now()}`,
        groupName: formCategoryData.name || '新采样组',
        container: formCategoryData.container,
        containerColor: 'bg-sky-500',
        specimenType: formCategoryData.specimenType,
        status: formCategoryData.status,
        details: [
          { applyCode: '02101', applyName: '常规监测组合' },
        ],
      };
      setSamplingGroups((prev) => [newSg, ...prev]);
      setSelectedSamplingGroupId(newSg.id);
      triggerAction(`已新增合并采样组 [${newSg.groupName}]`);
    } else if (activeCategory === '审核规则') {
      const newAudit: AutoAuditRule = {
        id: `ar-${Date.now()}`,
        ruleCode: formCategoryData.code,
        ruleName: formCategoryData.name || '新自动审核规则',
        group: formCategoryData.group,
        logicCondition: formCategoryData.logicCondition || '常规范围与质控在控校验',
        triggerAction: formCategoryData.triggerAction || '系统自动审核通过',
        status: formCategoryData.status,
        updateTime: nowTime,
        operator: operatorName,
      };
      setAuditRules((prev) => [newAudit, ...prev]);
      triggerAction(`已新增审核规则 [${newAudit.ruleName}]`);
    } else if (activeCategory === 'TAT规则') {
      const newTat: TatRule = {
        id: `tat-${Date.now()}`,
        ruleCode: formCategoryData.code,
        testCategory: formCategoryData.name || '常规检验',
        patientType: formCategoryData.patientType,
        receiveToRunMinutes: Number(formCategoryData.receiveToRun) || 15,
        runToAuditMinutes: Number(formCategoryData.runToAudit) || 30,
        maxTatMinutes: Number(formCategoryData.maxTat) || 60,
        status: formCategoryData.status,
        updateTime: nowTime,
        operator: operatorName,
      };
      setTatRules((prev) => [newTat, ...prev]);
      triggerAction(`已新增TAT规则 [${newTat.testCategory}]`);
    } else if (activeCategory === '传染病规则') {
      const newInf: InfectiousRule = {
        id: `inf-${Date.now()}`,
        diseaseName: formCategoryData.diseaseName || '新传染病项目',
        positiveCondition: formCategoryData.positiveCondition || '测定值高于阳性阈值',
        autoReportCdc: formCategoryData.autoReportCdc,
        isolationAdvice: formCategoryData.isolationAdvice || '按照传染病防护规范隔离处置',
        status: formCategoryData.status,
        updateTime: nowTime,
        operator: operatorName,
      };
      setInfectiousRules((prev) => [newInf, ...prev]);
      triggerAction(`已新增传染病规则 [${newInf.diseaseName}]`);
    } else if (activeCategory === '质控规则') {
      const newQc: QcRuleConfig = {
        id: `qc-${Date.now()}`,
        ruleName: formCategoryData.name || '新质控规则',
        ruleType: formCategoryData.ruleType,
        logicDescription: formCategoryData.logicDescription || '1个质控测定值超越特定标准差极限',
        blockRun: formCategoryData.blockRun,
        status: formCategoryData.status,
        updateTime: nowTime,
        operator: operatorName,
      };
      setQcRules((prev) => [newQc, ...prev]);
      triggerAction(`已新增质控规则 [${newQc.ruleName}]`);
    }

    setShowAddModal(false);
  };

  // Toggle item status
  const handleToggleItemStatus = (item: any) => {
    const nextStatus = item.status === '启用' ? '停用' : '启用';
    const nowTime = '2026-10-29 10:55:00';
    const operatorName = user.name || '张珊';

    if (activeCategory === '编码规则') {
      setSamplingGroups((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, status: nextStatus } : i))
      );
    } else if (activeCategory === '审核规则') {
      setAuditRules((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, status: nextStatus, updateTime: nowTime, operator: operatorName } : i))
      );
    } else if (activeCategory === 'TAT规则') {
      setTatRules((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, status: nextStatus, updateTime: nowTime, operator: operatorName } : i))
      );
    } else if (activeCategory === '传染病规则') {
      setInfectiousRules((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, status: nextStatus, updateTime: nowTime, operator: operatorName } : i))
      );
    } else if (activeCategory === '质控规则') {
      setQcRules((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, status: nextStatus, updateTime: nowTime, operator: operatorName } : i))
      );
    }

    triggerAction(`规则条目状态已切换为【${nextStatus}】`);
  };

  // Confirm delete
  const handleConfirmDelete = () => {
    if (!itemToDelete) return;
    if (activeCategory === '编码规则') {
      setSamplingGroups((prev) => prev.filter((i) => i.id !== itemToDelete.id));
    } else if (activeCategory === '审核规则') {
      setAuditRules((prev) => prev.filter((i) => i.id !== itemToDelete.id));
    } else if (activeCategory === 'TAT规则') {
      setTatRules((prev) => prev.filter((i) => i.id !== itemToDelete.id));
    } else if (activeCategory === '传染病规则') {
      setInfectiousRules((prev) => prev.filter((i) => i.id !== itemToDelete.id));
    } else if (activeCategory === '质控规则') {
      setQcRules((prev) => prev.filter((i) => i.id !== itemToDelete.id));
    }

    triggerAction('已删除该规则条目');
    setItemToDelete(null);
  };

  return (
    <div className="flex-1 flex h-full min-h-0 bg-slate-100 overflow-hidden text-slate-800 text-xs">
      {/* 1. Left Vertical Menu: 规则类型 (Matching screenshot image_ab04c1ae.png) */}
      <div className="w-44 bg-white border-r border-slate-200 shrink-0 flex flex-col p-2 space-y-1 select-none shadow-2xs">
        <div className="px-3 py-2 text-[11px] font-bold text-sky-700 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 mb-1">
          <SlidersHorizontal className="w-4 h-4 text-sky-600" />
          规则类型
        </div>

        <div className="flex-1 overflow-y-auto space-y-1 pr-1">
          {ruleCategories.map((cat) => {
            const isSelected = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setCurrentPage(1);
                  triggerAction(`已切换至【${cat}】配置`);
                }}
                className={`w-full px-3 py-2.5 rounded text-left font-medium transition-all flex items-center justify-between group ${
                  isSelected
                    ? 'bg-sky-600 text-white font-semibold shadow-2xs'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span>{cat}</span>
                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
              </button>
            );
          })}
        </div>

        <div className="pt-2 border-t border-slate-100 p-2 text-[10px] text-slate-400">
          点击左侧规则类型，右侧内容将根据所选规则类型动态加载。
        </div>
      </div>

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar (Matching screenshot: 单位名称) */}
        <div className="bg-white border-b border-slate-200 p-3 shrink-0 shadow-2xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-600 font-medium whitespace-nowrap">单位名称:</span>
              <select
                value={selectedHospitalUnit}
                onChange={(e) => setSelectedHospitalUnit(e.target.value)}
                className="bg-white border border-slate-300 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-sky-500 outline-none min-w-[130px]"
              >
                <option value="中心医院">中心医院</option>
                <option value="第一分院">第一分院</option>
                <option value="妇幼保健院">妇幼保健院</option>
              </select>
            </div>

            <div className="relative">
              <input
                type="text"
                value={filterKeyword}
                onChange={(e) => setFilterKeyword(e.target.value)}
                placeholder="搜索规则代码、名称、条件..."
                className="bg-white border border-slate-300 rounded px-2.5 py-1 text-xs w-48 focus:ring-1 focus:ring-sky-500 outline-none"
              />
              {filterKeyword && (
                <button
                  onClick={() => setFilterKeyword('')}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-500 font-mono">
              当前配置模块: <strong className="text-sky-700 font-semibold">{activeCategory}</strong>
            </span>
          </div>
        </div>

        {/* 3. Dynamic Right Content (规则详情 based on activeCategory) */}
        <div className="flex-1 p-3 min-h-0 overflow-auto flex flex-col space-y-3">
          
          {/* ========================================================= */}
          {/* RULE CATEGORY 1: 编码规则 (Matching screenshot image_ab04c1ae.png) */}
          {/* ========================================================= */}
          {activeCategory === '编码规则' && (
            <div className="space-y-3 flex-1 flex flex-col min-h-0">
              {/* Section 1: 条码格式设置 (Matching image_ab04c1ae.png) */}
              <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-2xs shrink-0">
                <div className="font-semibold text-slate-800 text-xs mb-2.5 border-b border-slate-100 pb-1.5 flex items-center gap-1.5">
                  <Barcode className="w-4 h-4 text-sky-600" />
                  条码格式设置
                </div>

                <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-600 font-medium">条码前缀:</span>
                    <input
                      type="text"
                      value={barcodeConfig.prefix}
                      onChange={(e) =>
                        setBarcodeConfig((prev) => ({
                          ...prev,
                          prefix: e.target.value,
                        }))
                      }
                      className="border border-slate-300 rounded px-2 py-1 text-xs font-mono w-24 focus:ring-1 focus:ring-sky-500 outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-slate-600 font-medium">顺序号长度:</span>
                    <input
                      type="number"
                      min={4}
                      max={12}
                      value={barcodeConfig.sequenceLength}
                      onChange={(e) =>
                        setBarcodeConfig((prev) => ({
                          ...prev,
                          sequenceLength: Number(e.target.value) || 6,
                        }))
                      }
                      className="border border-slate-300 rounded px-2 py-1 text-xs font-mono w-20 focus:ring-1 focus:ring-sky-500 outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-3 text-slate-700">
                    <span className="text-slate-600 font-medium">条码内容:</span>
                    {(['顺序号', '年月日+顺序号', '年月+顺序号', '年+顺序号'] as const).map((fmt) => (
                      <label key={fmt} className="flex items-center gap-1 cursor-pointer select-none">
                        <input
                          type="radio"
                          name="barcodeFormat"
                          checked={barcodeConfig.formatContent === fmt}
                          onChange={() =>
                            setBarcodeConfig((prev) => ({
                              ...prev,
                              formatContent: fmt,
                            }))
                          }
                          className="text-sky-600 focus:ring-sky-500"
                        />
                        <span>{fmt}</span>
                      </label>
                    ))}
                  </div>

                  <button
                    onClick={handleSaveBarcodeConfig}
                    className="ml-auto px-4 py-1 bg-sky-600 hover:bg-sky-700 text-white rounded font-medium shadow-2xs transition-colors flex items-center gap-1"
                  >
                    <Save className="w-3.5 h-3.5" />
                    保存
                  </button>
                </div>
              </div>

              {/* Section 2: 合并采样组 (Matching image_ab04c1ae.png: 左侧合并采样组 + 右侧组明细信息) */}
              <div className="flex-1 flex gap-3 min-h-0 overflow-hidden">
                {/* Table 1: 合并采样组 (10 items per page) */}
                <div className="flex-1 bg-white border border-slate-200 rounded-lg shadow-2xs flex flex-col overflow-hidden">
                  <div className="bg-slate-100/90 border-b border-slate-200 px-3 py-2 flex items-center justify-between shrink-0">
                    <h4 className="font-semibold text-slate-800 text-xs">合并采样组</h4>
                    <button
                      onClick={handleOpenAddModal}
                      className="px-2.5 py-0.5 bg-sky-600 hover:bg-sky-700 text-white rounded text-[11px] font-medium shadow-2xs transition-colors flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      新增
                    </button>
                  </div>

                  <div className="flex-1 overflow-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 sticky top-0">
                          <th className="py-2 px-3 border-r border-slate-200">组名称</th>
                          <th className="py-2 px-3 border-r border-slate-200">采集容器</th>
                          <th className="py-2 px-3 border-r border-slate-200">标本类型</th>
                          <th className="py-2 px-3 border-r border-slate-200 text-center">状态</th>
                          <th className="py-2 px-3 text-center w-24">操作</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {paginatedList.map((sg: CombinedSamplingGroup) => {
                          const isSelected = selectedSamplingGroupId === sg.id;
                          return (
                            <tr
                              key={sg.id}
                              onClick={() => setSelectedSamplingGroupId(sg.id)}
                              className={`hover:bg-sky-50/60 transition-colors cursor-pointer ${
                                isSelected ? 'bg-sky-100/80 border-l-4 border-l-sky-600 font-semibold' : ''
                              }`}
                            >
                              <td className="py-2 px-3 border-r border-slate-100 font-medium text-slate-800">
                                {sg.groupName}
                              </td>
                              <td className="py-2 px-3 border-r border-slate-100">
                                <span className="inline-block px-2 py-0.5 rounded text-[11px] bg-slate-100 text-slate-800 border border-slate-200">
                                  {sg.container}
                                </span>
                              </td>
                              <td className="py-2 px-3 border-r border-slate-100 text-slate-600">
                                {sg.specimenType}
                              </td>
                              <td className="py-2 px-3 border-r border-slate-100 text-center">
                                {sg.status === '启用' ? (
                                  <span className="text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 text-[10px]">
                                    启用
                                  </span>
                                ) : (
                                  <span className="text-rose-600 font-semibold bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200 text-[10px]">
                                    停用
                                  </span>
                                )}
                              </td>
                              <td
                                className="py-2 px-3 text-center"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <div className="flex items-center justify-center gap-1.5">
                                  <button
                                    onClick={() => handleToggleItemStatus(sg)}
                                    className="text-sky-600 hover:text-sky-800 hover:underline"
                                  >
                                    编辑
                                  </button>
                                  <span className="text-slate-300">|</span>
                                  <button
                                    onClick={() => setItemToDelete(sg)}
                                    className="text-rose-600 hover:text-rose-800 hover:underline"
                                  >
                                    删除
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination Footer */}
                  <div className="bg-slate-50 border-t border-slate-200 px-3 py-1.5 flex items-center justify-between shrink-0">
                    <span className="text-sky-700 font-semibold">合计: {totalItems} 条</span>
                    <div className="flex items-center gap-1">
                      <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        className="px-2 py-0.5 bg-white border border-slate-300 rounded disabled:opacity-40"
                      >
                        <ChevronLeft className="w-3 h-3" />
                      </button>
                      <span className="text-slate-500 text-[11px] px-1">
                        {currentPage} / {totalPages}
                      </span>
                      <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        className="px-2 py-0.5 bg-white border border-slate-300 rounded disabled:opacity-40"
                      >
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Table 2: 组明细信息 (Matching image_ab04c1ae.png) */}
                <div className="w-80 bg-white border border-slate-200 rounded-lg shadow-2xs flex flex-col overflow-hidden shrink-0">
                  <div className="bg-slate-100/90 border-b border-slate-200 px-3 py-2 font-semibold text-slate-800 text-xs">
                    组明细信息{' '}
                    {selectedSamplingGroup && (
                      <span className="text-sky-700 font-normal">
                        - [{selectedSamplingGroup.groupName}]
                      </span>
                    )}
                  </div>

                  <div className="flex-1 overflow-auto">
                    {!selectedSamplingGroup ? (
                      <div className="p-8 text-center text-slate-400">请选择左侧合并采样组</div>
                    ) : (
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 sticky top-0">
                            <th className="py-2 px-2.5 border-r border-slate-200 w-24">申请编码</th>
                            <th className="py-2 px-2.5">申请名称</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {selectedSamplingGroup.details.length === 0 ? (
                            <tr>
                              <td colSpan={2} className="py-8 text-center text-slate-400">
                                暂无组明细信息
                              </td>
                            </tr>
                          ) : (
                            selectedSamplingGroup.details.map((d, i) => (
                              <tr key={i} className="hover:bg-slate-50">
                                <td className="py-2 px-2.5 border-r border-slate-100 font-mono text-slate-700">
                                  {d.applyCode}
                                </td>
                                <td className="py-2 px-2.5 text-sky-700 font-medium">
                                  {d.applyName}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* RULE CATEGORY 2: 审核规则 */}
          {/* ========================================================= */}
          {activeCategory === '审核规则' && (
            <div className="bg-white border border-slate-200 rounded-lg shadow-2xs flex-1 flex flex-col overflow-hidden">
              <div className="bg-slate-100/90 border-b border-slate-200 px-4 py-2.5 flex items-center justify-between shrink-0">
                <h3 className="font-semibold text-sky-700 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-600" />
                  自动审核与规则复核逻辑表
                </h3>
                <button
                  onClick={handleOpenAddModal}
                  className="px-3 py-1 bg-sky-600 hover:bg-sky-700 text-white rounded text-xs font-medium shadow-2xs transition-colors flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  新增审核规则
                </button>
              </div>

              <div className="flex-1 overflow-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 sticky top-0 z-10">
                      <th className="py-2.5 px-3 border-r border-slate-200 w-28">规则代码</th>
                      <th className="py-2.5 px-3 border-r border-slate-200 w-48">规则名称</th>
                      <th className="py-2.5 px-3 border-r border-slate-200 w-24">专业组</th>
                      <th className="py-2.5 px-3 border-r border-slate-200">逻辑判断条件</th>
                      <th className="py-2.5 px-3 border-r border-slate-200">触发响应动作</th>
                      <th className="py-2.5 px-3 border-r border-slate-200 text-center w-20">状态</th>
                      <th className="py-2.5 px-3 border-r border-slate-200 w-36">更新时间</th>
                      <th className="py-2.5 px-3 text-center w-28">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedList.map((rule: AutoAuditRule) => (
                      <tr key={rule.id} className="hover:bg-sky-50/60 transition-colors">
                        <td className="py-2.5 px-3 border-r border-slate-100 font-mono font-semibold text-slate-800">
                          {rule.ruleCode}
                        </td>
                        <td className="py-2.5 px-3 border-r border-slate-100 font-medium text-sky-700">
                          {rule.ruleName}
                        </td>
                        <td className="py-2.5 px-3 border-r border-slate-100 text-slate-700">
                          {rule.group}
                        </td>
                        <td className="py-2.5 px-3 border-r border-slate-100 font-mono text-slate-700">
                          {rule.logicCondition}
                        </td>
                        <td className="py-2.5 px-3 border-r border-slate-100 text-slate-800 font-medium">
                          {rule.triggerAction}
                        </td>
                        <td className="py-2.5 px-3 border-r border-slate-100 text-center">
                          {rule.status === '启用' ? (
                            <span className="text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 text-[10px]">
                              启用
                            </span>
                          ) : (
                            <span className="text-rose-600 font-semibold bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200 text-[10px]">
                              停用
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 border-r border-slate-100 text-slate-500 font-mono text-[11px]">
                          {rule.updateTime}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleToggleItemStatus(rule)}
                              className={`font-medium ${
                                rule.status === '启用' ? 'text-amber-600' : 'text-emerald-600'
                              }`}
                            >
                              {rule.status === '启用' ? '停用' : '启用'}
                            </button>
                            <span className="text-slate-300">|</span>
                            <button
                              onClick={() => setItemToDelete(rule)}
                              className="text-rose-600 hover:underline"
                            >
                              删除
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="bg-slate-50 border-t border-slate-200 px-4 py-2 flex items-center justify-between shrink-0">
                <span className="text-sky-700 font-semibold">合计: {totalItems} 条</span>
                <div className="flex items-center gap-1">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="px-2 py-0.5 bg-white border border-slate-300 rounded disabled:opacity-40"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-slate-500 text-[11px] px-2">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="px-2 py-0.5 bg-white border border-slate-300 rounded disabled:opacity-40"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* RULE CATEGORY 3: TAT规则 */}
          {/* ========================================================= */}
          {activeCategory === 'TAT规则' && (
            <div className="bg-white border border-slate-200 rounded-lg shadow-2xs flex-1 flex flex-col overflow-hidden">
              <div className="bg-slate-100/90 border-b border-slate-200 px-4 py-2.5 flex items-center justify-between shrink-0">
                <h3 className="font-semibold text-sky-700 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-sky-600" />
                  TAT全程周转时限与超时预警规则表
                </h3>
                <button
                  onClick={handleOpenAddModal}
                  className="px-3 py-1 bg-sky-600 hover:bg-sky-700 text-white rounded text-xs font-medium shadow-2xs transition-colors flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  新增TAT规则
                </button>
              </div>

              <div className="flex-1 overflow-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 sticky top-0 z-10">
                      <th className="py-2.5 px-3 border-r border-slate-200 w-28">规则代码</th>
                      <th className="py-2.5 px-3 border-r border-slate-200">检验类别</th>
                      <th className="py-2.5 px-3 border-r border-slate-200 text-center w-20">患者类型</th>
                      <th className="py-2.5 px-3 border-r border-slate-200 text-right">签收到上机 (分钟)</th>
                      <th className="py-2.5 px-3 border-r border-slate-200 text-right">上机到审核 (分钟)</th>
                      <th className="py-2.5 px-3 border-r border-slate-200 text-right">全流程上限 (分钟)</th>
                      <th className="py-2.5 px-3 border-r border-slate-200 text-center w-20">状态</th>
                      <th className="py-2.5 px-3 border-r border-slate-200 w-36">更新时间</th>
                      <th className="py-2.5 px-3 text-center w-28">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {paginatedList.map((tat: TatRule) => (
                      <tr key={tat.id} className="hover:bg-sky-50/60 transition-colors">
                        <td className="py-2.5 px-3 border-r border-slate-100 font-semibold text-slate-800">
                          {tat.ruleCode}
                        </td>
                        <td className="py-2.5 px-3 border-r border-slate-100 font-sans font-medium text-sky-700">
                          {tat.testCategory}
                        </td>
                        <td className="py-2.5 px-3 border-r border-slate-100 font-sans text-center">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] ${
                              tat.patientType === '急诊'
                                ? 'bg-rose-100 text-rose-800 font-bold'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {tat.patientType}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 border-r border-slate-100 text-right text-slate-700">
                          {tat.receiveToRunMinutes} 分钟
                        </td>
                        <td className="py-2.5 px-3 border-r border-slate-100 text-right text-slate-700">
                          {tat.runToAuditMinutes} 分钟
                        </td>
                        <td className="py-2.5 px-3 border-r border-slate-100 text-right font-bold text-sky-700">
                          {tat.maxTatMinutes} 分钟
                        </td>
                        <td className="py-2.5 px-3 border-r border-slate-100 text-center font-sans">
                          {tat.status === '启用' ? (
                            <span className="text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 text-[10px]">
                              启用
                            </span>
                          ) : (
                            <span className="text-rose-600 font-semibold bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200 text-[10px]">
                              停用
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 border-r border-slate-100 text-slate-500 font-mono text-[11px]">
                          {tat.updateTime}
                        </td>
                        <td className="py-2.5 px-3 text-center font-sans">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleToggleItemStatus(tat)}
                              className="text-sky-600 hover:underline"
                            >
                              切换
                            </button>
                            <span className="text-slate-300">|</span>
                            <button
                              onClick={() => setItemToDelete(tat)}
                              className="text-rose-600 hover:underline"
                            >
                              删除
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="bg-slate-50 border-t border-slate-200 px-4 py-2 flex items-center justify-between shrink-0">
                <span className="text-sky-700 font-semibold">合计: {totalItems} 条</span>
                <div className="flex items-center gap-1">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="px-2 py-0.5 bg-white border border-slate-300 rounded disabled:opacity-40"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-slate-500 text-[11px] px-2">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="px-2 py-0.5 bg-white border border-slate-300 rounded disabled:opacity-40"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* RULE CATEGORY 4: 传染病规则 */}
          {/* ========================================================= */}
          {activeCategory === '传染病规则' && (
            <div className="bg-white border border-slate-200 rounded-lg shadow-2xs flex-1 flex flex-col overflow-hidden">
              <div className="bg-slate-100/90 border-b border-slate-200 px-4 py-2.5 flex items-center justify-between shrink-0">
                <h3 className="font-semibold text-sky-700 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-sky-600" />
                  传染病强阳性触发与疾控直报规则表
                </h3>
                <button
                  onClick={handleOpenAddModal}
                  className="px-3 py-1 bg-sky-600 hover:bg-sky-700 text-white rounded text-xs font-medium shadow-2xs transition-colors flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  新增传染病规则
                </button>
              </div>

              <div className="flex-1 overflow-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 sticky top-0 z-10">
                      <th className="py-2.5 px-3 border-r border-slate-200 w-48">传染病项目</th>
                      <th className="py-2.5 px-3 border-r border-slate-200">阳性触发条件</th>
                      <th className="py-2.5 px-3 border-r border-slate-200 text-center w-24">自动上报疾控</th>
                      <th className="py-2.5 px-3 border-r border-slate-200">临床隔离与处置建议</th>
                      <th className="py-2.5 px-3 border-r border-slate-200 text-center w-20">状态</th>
                      <th className="py-2.5 px-3 border-r border-slate-200 w-36">更新时间</th>
                      <th className="py-2.5 px-3 text-center w-28">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedList.map((inf: InfectiousRule) => (
                      <tr key={inf.id} className="hover:bg-sky-50/60 transition-colors">
                        <td className="py-2.5 px-3 border-r border-slate-100 font-semibold text-rose-700">
                          {inf.diseaseName}
                        </td>
                        <td className="py-2.5 px-3 border-r border-slate-100 font-mono text-slate-800">
                          {inf.positiveCondition}
                        </td>
                        <td className="py-2.5 px-3 border-r border-slate-100 text-center font-medium">
                          {inf.autoReportCdc === '是' ? (
                            <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[10px]">
                              直报CDC
                            </span>
                          ) : (
                            <span className="text-slate-500">手动</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 border-r border-slate-100 text-slate-600">
                          {inf.isolationAdvice}
                        </td>
                        <td className="py-2.5 px-3 border-r border-slate-100 text-center">
                          {inf.status === '启用' ? (
                            <span className="text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 text-[10px]">
                              启用
                            </span>
                          ) : (
                            <span className="text-rose-600 font-semibold bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200 text-[10px]">
                              停用
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 border-r border-slate-100 text-slate-500 font-mono text-[11px]">
                          {inf.updateTime}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleToggleItemStatus(inf)}
                              className="text-sky-600 hover:underline"
                            >
                              切换
                            </button>
                            <span className="text-slate-300">|</span>
                            <button
                              onClick={() => setItemToDelete(inf)}
                              className="text-rose-600 hover:underline"
                            >
                              删除
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="bg-slate-50 border-t border-slate-200 px-4 py-2 flex items-center justify-between shrink-0">
                <span className="text-sky-700 font-semibold">合计: {totalItems} 条</span>
                <div className="flex items-center gap-1">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="px-2 py-0.5 bg-white border border-slate-300 rounded disabled:opacity-40"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-slate-500 text-[11px] px-2">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="px-2 py-0.5 bg-white border border-slate-300 rounded disabled:opacity-40"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* RULE CATEGORY 5: 质控规则 */}
          {/* ========================================================= */}
          {activeCategory === '质控规则' && (
            <div className="bg-white border border-slate-200 rounded-lg shadow-2xs flex-1 flex flex-col overflow-hidden">
              <div className="bg-slate-100/90 border-b border-slate-200 px-4 py-2.5 flex items-center justify-between shrink-0">
                <h3 className="font-semibold text-sky-700 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-sky-600" />
                  Westgard 与六西格玛质控规则判定表
                </h3>
                <button
                  onClick={handleOpenAddModal}
                  className="px-3 py-1 bg-sky-600 hover:bg-sky-700 text-white rounded text-xs font-medium shadow-2xs transition-colors flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  新增质控规则
                </button>
              </div>

              <div className="flex-1 overflow-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 sticky top-0 z-10">
                      <th className="py-2.5 px-3 border-r border-slate-200 w-48">质控规则名称</th>
                      <th className="py-2.5 px-3 border-r border-slate-200 text-center w-20">规则类型</th>
                      <th className="py-2.5 px-3 border-r border-slate-200">判定逻辑与失控说明</th>
                      <th className="py-2.5 px-3 border-r border-slate-200 text-center w-20">阻断上机</th>
                      <th className="py-2.5 px-3 border-r border-slate-200 text-center w-20">状态</th>
                      <th className="py-2.5 px-3 border-r border-slate-200 w-36">更新时间</th>
                      <th className="py-2.5 px-3 text-center w-28">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedList.map((qc: QcRuleConfig) => (
                      <tr key={qc.id} className="hover:bg-sky-50/60 transition-colors">
                        <td className="py-2.5 px-3 border-r border-slate-100 font-semibold text-slate-800">
                          {qc.ruleName}
                        </td>
                        <td className="py-2.5 px-3 border-r border-slate-100 text-center font-medium">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] ${
                              qc.ruleType === '失控'
                                ? 'bg-rose-100 text-rose-800 font-bold'
                                : qc.ruleType === '警告'
                                ? 'bg-amber-100 text-amber-800 font-bold'
                                : 'bg-blue-100 text-blue-800 font-bold'
                            }`}
                          >
                            {qc.ruleType}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 border-r border-slate-100 text-slate-700">
                          {qc.logicDescription}
                        </td>
                        <td className="py-2.5 px-3 border-r border-slate-100 text-center font-medium">
                          {qc.blockRun === '是' ? (
                            <span className="text-rose-600 font-bold">强制阻断</span>
                          ) : (
                            <span className="text-slate-400">仅告警</span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 border-r border-slate-100 text-center">
                          {qc.status === '启用' ? (
                            <span className="text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 text-[10px]">
                              启用
                            </span>
                          ) : (
                            <span className="text-rose-600 font-semibold bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200 text-[10px]">
                              停用
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 border-r border-slate-100 text-slate-500 font-mono text-[11px]">
                          {qc.updateTime}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleToggleItemStatus(qc)}
                              className="text-sky-600 hover:underline"
                            >
                              切换
                            </button>
                            <span className="text-slate-300">|</span>
                            <button
                              onClick={() => setItemToDelete(qc)}
                              className="text-rose-600 hover:underline"
                            >
                              删除
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="bg-slate-50 border-t border-slate-200 px-4 py-2 flex items-center justify-between shrink-0">
                <span className="text-sky-700 font-semibold">合计: {totalItems} 条</span>
                <div className="flex items-center gap-1">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="px-2 py-0.5 bg-white border border-slate-300 rounded disabled:opacity-40"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-slate-500 text-[11px] px-2">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="px-2 py-0.5 bg-white border border-slate-300 rounded disabled:opacity-40"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ========================================================= */}
      {/* Modal: Add New Rule (Cleared fields) */}
      {/* ========================================================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-sky-700 text-white px-5 py-3.5 flex items-center justify-between shrink-0">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <Plus className="w-4 h-4" />
                新增【{activeCategory}】配置
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-white/80 hover:text-white transition-colors p-1 rounded hover:bg-sky-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNewRule} className="p-5 space-y-4 max-h-[80vh] overflow-auto">
              {activeCategory === '编码规则' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">合并采样组名称</label>
                    <input
                      type="text"
                      required
                      value={formCategoryData.name}
                      onChange={(e) => setFormCategoryData((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="例如: 肝功能常规采血组"
                      className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-sky-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">采血管试管容器</label>
                    <input
                      type="text"
                      value={formCategoryData.container}
                      onChange={(e) => setFormCategoryData((prev) => ({ ...prev, container: e.target.value }))}
                      placeholder="例如: 黄头管(促凝胶SST 4ml)"
                      className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-sky-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">标本类型</label>
                    <input
                      type="text"
                      value={formCategoryData.specimenType}
                      onChange={(e) => setFormCategoryData((prev) => ({ ...prev, specimenType: e.target.value }))}
                      placeholder="例如: 血清"
                      className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-sky-500 outline-none"
                    />
                  </div>
                </div>
              )}

              {activeCategory === '审核规则' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">规则名称</label>
                    <input
                      type="text"
                      required
                      value={formCategoryData.name}
                      onChange={(e) => setFormCategoryData((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="例如: 血常规WBC/PLT极限校验"
                      className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-sky-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">逻辑判断条件</label>
                    <textarea
                      rows={2}
                      value={formCategoryData.logicCondition}
                      onChange={(e) => setFormCategoryData((prev) => ({ ...prev, logicCondition: e.target.value }))}
                      placeholder="例如: 结果在参考区间内 AND 质控在控"
                      className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs font-mono focus:ring-1 focus:ring-sky-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">触发响应动作</label>
                    <input
                      type="text"
                      value={formCategoryData.triggerAction}
                      onChange={(e) => setFormCategoryData((prev) => ({ ...prev, triggerAction: e.target.value }))}
                      placeholder="例如: 自动审签通过 / 阻断待人工复核"
                      className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-sky-500 outline-none"
                    />
                  </div>
                </div>
              )}

              {activeCategory === 'TAT规则' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">检验类别</label>
                    <input
                      type="text"
                      required
                      value={formCategoryData.name}
                      onChange={(e) => setFormCategoryData((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="例如: 急诊生化/心肌标志物"
                      className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-sky-500 outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">签收到上机(分)</label>
                      <input
                        type="number"
                        value={formCategoryData.receiveToRun}
                        onChange={(e) => setFormCategoryData((prev) => ({ ...prev, receiveToRun: Number(e.target.value) || 0 }))}
                        className="w-full border border-slate-300 rounded px-2 py-1 text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">上机到审核(分)</label>
                      <input
                        type="number"
                        value={formCategoryData.runToAudit}
                        onChange={(e) => setFormCategoryData((prev) => ({ ...prev, runToAudit: Number(e.target.value) || 0 }))}
                        className="w-full border border-slate-300 rounded px-2 py-1 text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">全流程上限(分)</label>
                      <input
                        type="number"
                        value={formCategoryData.maxTat}
                        onChange={(e) => setFormCategoryData((prev) => ({ ...prev, maxTat: Number(e.target.value) || 0 }))}
                        className="w-full border border-slate-300 rounded px-2 py-1 text-xs font-mono font-bold text-sky-700"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeCategory === '传染病规则' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">传染病名称</label>
                    <input
                      type="text"
                      required
                      value={formCategoryData.diseaseName}
                      onChange={(e) => setFormCategoryData((prev) => ({ ...prev, diseaseName: e.target.value }))}
                      placeholder="例如: 乙型病毒性肝炎"
                      className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-sky-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">阳性触发条件</label>
                    <input
                      type="text"
                      value={formCategoryData.positiveCondition}
                      onChange={(e) => setFormCategoryData((prev) => ({ ...prev, positiveCondition: e.target.value }))}
                      placeholder="例如: HBsAg >= 1.0 COI"
                      className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs font-mono focus:ring-1 focus:ring-sky-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">隔离与处置建议</label>
                    <textarea
                      rows={2}
                      value={formCategoryData.isolationAdvice}
                      onChange={(e) => setFormCategoryData((prev) => ({ ...prev, isolationAdvice: e.target.value }))}
                      placeholder="例如: 血液防护隔离，单间收治"
                      className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-sky-500 outline-none"
                    />
                  </div>
                </div>
              )}

              {activeCategory === '质控规则' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">质控规则名称</label>
                    <input
                      type="text"
                      required
                      value={formCategoryData.name}
                      onChange={(e) => setFormCategoryData((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="例如: Westgard 1_3s 失控规则"
                      className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-sky-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">判定逻辑说明</label>
                    <textarea
                      rows={2}
                      value={formCategoryData.logicDescription}
                      onChange={(e) => setFormCategoryData((prev) => ({ ...prev, logicDescription: e.target.value }))}
                      placeholder="例如: 1个质控测定值超过 ±3s 限制"
                      className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-sky-500 outline-none"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-slate-700 font-medium mb-1">状态</label>
                <select
                  value={formCategoryData.status}
                  onChange={(e) => setFormCategoryData((prev) => ({ ...prev, status: e.target.value as any }))}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs outline-none"
                >
                  <option value="启用">启用</option>
                  <option value="停用">停用</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded font-medium shadow-2xs transition-colors flex items-center gap-1"
                >
                  <Check className="w-4 h-4" />
                  保存规则
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-200 w-full max-w-sm overflow-hidden p-5 animate-in fade-in zoom-in-95 duration-150 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="font-semibold text-sm">确认删除规则条目?</h3>
            </div>
            <p className="text-xs text-slate-600">
              您确定要删除当前所选的【{activeCategory}】规则项吗？删除后此规则校验将不再生效。
            </p>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setItemToDelete(null)}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded font-medium shadow-2xs transition-colors"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
