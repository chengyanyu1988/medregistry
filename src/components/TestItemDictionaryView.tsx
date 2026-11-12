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
  Sparkles,
  Calculator
} from './MenuIcon';
import { UserProfile } from '../types/navigation';
import {
  TestItem,
  ValueOptionItem,
  QuantitativeRefRange,
  QualitativeRefRange,
  CalculationFormulaItem,
  INITIAL_TEST_ITEMS,
} from '../data/testItemDictionaryData';

interface TestItemDictionaryViewProps {
  user: UserProfile;
  triggerAction: (msg: string) => void;
}

export const TestItemDictionaryView: React.FC<TestItemDictionaryViewProps> = ({
  user,
  triggerAction,
}) => {
  // Filter States (Matching screenshots)
  const [selectedHospitalUnit, setSelectedHospitalUnit] = useState<string>('中心医院');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterKeyword, setFilterKeyword] = useState<string>('');
  const [showDisabledOnly, setShowDisabledOnly] = useState<boolean>(false);

  // Main Test Items Dataset
  const [items, setItems] = useState<TestItem[]>(INITIAL_TEST_ITEMS);

  // Pagination states (Requirement: 10 items per page)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Modals States
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [detailModalItem, setDetailModalItem] = useState<TestItem | null>(null);
  const [activeDetailTab, setActiveDetailTab] = useState<'basic' | 'values' | 'refs' | 'formula'>('basic');
  const [activeRefSubTab, setActiveRefSubTab] = useState<'quantitative' | 'qualitative'>('quantitative');
  const [itemToDelete, setItemToDelete] = useState<TestItem | null>(null);

  // Add/Edit Basic Form State (Clearing default for Add modal)
  const [addFormData, setAddFormData] = useState({
    category: '临检' as '临检' | '生化' | '免疫' | '凝血' | '微生物',
    code: '',
    name: '',
    englishName: '',
    unit: '',
    resultType: '定量' as '定量' | '定性',
    isCalculated: '否' as '是' | '否',
    calculationFormula: '',
    decimalPlaces: 2,
    testMethod: '',
    status: '启用' as '启用' | '停用',
    notes: '',
  });

  // Filtered dataset
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // 1. Category Filter
      if (filterCategory !== 'all' && item.category !== filterCategory) {
        return false;
      }
      // 2. Keyword Search (Name, Code, English Name, Test Method)
      if (filterKeyword.trim()) {
        const kw = filterKeyword.trim().toLowerCase();
        const matchName = item.name.toLowerCase().includes(kw);
        const matchCode = item.code.toLowerCase().includes(kw);
        const matchEng = item.englishName.toLowerCase().includes(kw);
        const matchMethod = item.testMethod.toLowerCase().includes(kw);
        if (!matchName && !matchCode && !matchEng && !matchMethod) {
          return false;
        }
      }
      // 3. Show Disabled Checkbox
      if (showDisabledOnly && item.status !== '停用') {
        return false;
      }

      return true;
    });
  }, [items, filterCategory, filterKeyword, showDisabledOnly]);

  // Pagination calculations
  const totalItems = filteredItems.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredItems.slice(startIndex, startIndex + pageSize);
  }, [filteredItems, currentPage, pageSize]);

  // Query handler
  const handleQuery = () => {
    setCurrentPage(1);
    triggerAction('已完成检验项目字典检索');
  };

  // Reset filters
  const handleResetFilters = () => {
    setFilterCategory('all');
    setFilterKeyword('');
    setShowDisabledOnly(false);
    setCurrentPage(1);
    triggerAction('已重置查询条件');
  };

  // Open Add Modal with empty fields
  const handleOpenAddModal = () => {
    setAddFormData({
      category: '生化',
      code: '',
      name: '',
      englishName: '',
      unit: '',
      resultType: '定量',
      isCalculated: '否',
      calculationFormula: '',
      decimalPlaces: 2,
      testMethod: '',
      status: '启用',
      notes: '',
    });
    setShowAddModal(true);
  };

  // Save new test item
  const handleSaveNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addFormData.code.trim()) {
      triggerAction('请输入项目代码');
      return;
    }
    if (!addFormData.name.trim()) {
      triggerAction('请输入项目名称');
      return;
    }

    const newItem: TestItem = {
      id: `ti-${Date.now()}`,
      category: addFormData.category,
      code: addFormData.code.trim(),
      name: addFormData.name.trim(),
      englishName: addFormData.englishName.trim(),
      unit: addFormData.unit.trim(),
      resultType: addFormData.resultType,
      isCalculated: addFormData.isCalculated,
      calculationFormula: addFormData.calculationFormula.trim(),
      decimalPlaces: Number(addFormData.decimalPlaces) || 2,
      testMethod: addFormData.testMethod.trim(),
      status: addFormData.status,
      updateTime: '2026-10-29 10:00:00',
      operator: user.name || '张珊',
      notes: addFormData.notes.trim(),
      valueOptions: [],
      quantitativeRefs: [],
      qualitativeRefs: [],
      calculationFormulas: [],
    };

    setItems((prev) => [newItem, ...prev]);
    setShowAddModal(false);
    triggerAction(`成功新增检验项目 [${newItem.code}] ${newItem.name}`);
  };

  // Toggle item status (启用 / 停用)
  const handleToggleStatus = (item: TestItem) => {
    const nextStatus = item.status === '启用' ? '停用' : '启用';
    const nowTime = '2026-10-29 10:05:00';
    const operatorName = user.name || '张珊';

    setItems((prev) =>
      prev.map((i) =>
        i.id === item.id
          ? {
              ...i,
              status: nextStatus,
              updateTime: nowTime,
              operator: operatorName,
            }
          : i
      )
    );

    if (detailModalItem && detailModalItem.id === item.id) {
      setDetailModalItem((prev) =>
        prev
          ? {
              ...prev,
              status: nextStatus,
              updateTime: nowTime,
              operator: operatorName,
            }
          : null
      );
    }

    triggerAction(`检验项目 [${item.name}] 状态已切换为【${nextStatus}】`);
  };

  // Delete Item
  const handleConfirmDelete = () => {
    if (!itemToDelete) return;
    setItems((prev) => prev.filter((i) => i.id !== itemToDelete.id));
    if (detailModalItem && detailModalItem.id === itemToDelete.id) {
      setDetailModalItem(null);
    }
    triggerAction(`已删除检验项目 [${itemToDelete.name}]`);
    setItemToDelete(null);
  };

  // Open Detail Modal
  const handleOpenDetailModal = (item: TestItem) => {
    setDetailModalItem(item);
    setActiveDetailTab('basic');
    setActiveRefSubTab(item.resultType === '定性' ? 'qualitative' : 'quantitative');
  };

  // Helper to update detail modal item state
  const updateDetailItem = (updater: (prev: TestItem) => TestItem) => {
    if (!detailModalItem) return;
    const updated = updater(detailModalItem);
    setDetailModalItem(updated);
    setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
  };

  // Add inline Value Option
  const handleAddValueOption = () => {
    if (!detailModalItem) return;
    const newVo: ValueOptionItem = {
      id: `vo-${Date.now()}`,
      valueCode: `V0${detailModalItem.valueOptions.length + 1}`,
      valueName: '新取值项',
      isDefault: detailModalItem.valueOptions.length === 0,
    };
    updateDetailItem((prev) => ({
      ...prev,
      valueOptions: [...prev.valueOptions, newVo],
    }));
    triggerAction('已新增项目取值项');
  };

  // Delete Value Option
  const handleDeleteValueOption = (voId: string) => {
    if (!detailModalItem) return;
    updateDetailItem((prev) => ({
      ...prev,
      valueOptions: prev.valueOptions.filter((v) => v.id !== voId),
    }));
    triggerAction('已删除项目取值项');
  };

  // Add Quantitative Reference Range
  const handleAddQuantitativeRef = () => {
    if (!detailModalItem) return;
    const newRef: QuantitativeRefRange = {
      id: `qref-${Date.now()}`,
      gender: '不区分',
      ageRange: '18-80岁',
      specimenType: '血清',
      clinicalFeature: '常规评估',
      instrument: 'AU5800',
      department: '检验科',
      referenceValue: '3.0~6.0',
      criticalLow: '1.0',
      criticalHigh: '10.0',
      retestLow: '2.0',
      retestHigh: '8.0',
    };
    updateDetailItem((prev) => ({
      ...prev,
      quantitativeRefs: [...prev.quantitativeRefs, newRef],
    }));
    triggerAction('已新增定量参考区间');
  };

  // Delete Quantitative Ref
  const handleDeleteQuantitativeRef = (qId: string) => {
    if (!detailModalItem) return;
    updateDetailItem((prev) => ({
      ...prev,
      quantitativeRefs: prev.quantitativeRefs.filter((q) => q.id !== qId),
    }));
    triggerAction('已删除定量参考区间');
  };

  // Add Qualitative Reference Range
  const handleAddQualitativeRef = () => {
    if (!detailModalItem) return;
    const newRef: QualitativeRefRange = {
      id: `qlref-${Date.now()}`,
      gender: '不区分',
      ageRange: '全年龄段',
      specimenType: '血清',
      clinicalFeature: '传染病筛查',
      instrument: 'Cobas e801',
      department: '免疫组',
      referenceValue: '阴性',
      criticalValue: '阳性',
      retestValue: '阳性',
    };
    updateDetailItem((prev) => ({
      ...prev,
      qualitativeRefs: [...prev.qualitativeRefs, newRef],
    }));
    triggerAction('已新增定性参考区间');
  };

  // Delete Qualitative Ref
  const handleDeleteQualitativeRef = (qlId: string) => {
    if (!detailModalItem) return;
    updateDetailItem((prev) => ({
      ...prev,
      qualitativeRefs: prev.qualitativeRefs.filter((q) => q.id !== qlId),
    }));
    triggerAction('已删除定性参考区间');
  };

  // Add Calculation Formula
  const handleAddCalculationFormula = () => {
    if (!detailModalItem) return;
    const newCf: CalculationFormulaItem = {
      id: `cf-${Date.now()}`,
      department: '生化组',
      sampleType: '血清',
      gender: '不区分',
      resultCondition: '[Cr]>100',
      formula: '[Cr]*100',
    };
    updateDetailItem((prev) => ({
      ...prev,
      calculationFormulas: [...prev.calculationFormulas, newCf],
    }));
    triggerAction('已新增计算公式规则');
  };

  // Delete Calculation Formula
  const handleDeleteCalculationFormula = (cfId: string) => {
    if (!detailModalItem) return;
    updateDetailItem((prev) => ({
      ...prev,
      calculationFormulas: prev.calculationFormulas.filter((c) => c.id !== cfId),
    }));
    triggerAction('已删除计算公式');
  };

  // Badge Category Color helper
  const getCategoryBadgeClass = (cat: string) => {
    switch (cat) {
      case '临检':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case '生化':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case '免疫':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case '凝血':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case '微生物':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-slate-100 overflow-hidden text-slate-800 text-xs">
      {/* Top Search & Filter Bar (Matching Screenshot UI layout) */}
      <div className="bg-white border-b border-slate-200 p-3 shrink-0 shadow-2xs space-y-2">
        <div className="flex flex-wrap items-center gap-3">
          {/* 单位 selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-600 font-medium whitespace-nowrap">单位:</span>
            <select
              value={selectedHospitalUnit}
              onChange={(e) => setSelectedHospitalUnit(e.target.value)}
              className="bg-white border border-slate-300 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-sky-500 focus:border-sky-500 min-w-[130px] outline-none"
            >
              <option value="中心医院">中心医院</option>
              <option value="第一分院">第一分院</option>
              <option value="妇幼保健院">妇幼保健院</option>
            </select>
          </div>

          {/* 项目分类 selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-600 font-medium whitespace-nowrap">项目分类:</span>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-white border border-slate-300 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-sky-500 focus:border-sky-500 min-w-[110px] outline-none"
            >
              <option value="all">全部分类</option>
              <option value="临检">临检</option>
              <option value="生化">生化</option>
              <option value="免疫">免疫</option>
              <option value="凝血">凝血</option>
              <option value="微生物">微生物</option>
            </select>
          </div>

          {/* 指标名称 input */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-600 font-medium whitespace-nowrap">指标名称:</span>
            <div className="relative">
              <input
                type="text"
                value={filterKeyword}
                onChange={(e) => setFilterKeyword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleQuery()}
                placeholder="代码 / 名称 / 英文名 / 试验方法"
                className="bg-white border border-slate-300 rounded px-2 py-1 text-xs w-52 focus:ring-1 focus:ring-sky-500 focus:border-sky-500 outline-none pr-6"
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

          {/* 显示停用 checkbox */}
          <label className="flex items-center gap-1 cursor-pointer select-none text-slate-700">
            <input
              type="checkbox"
              checked={showDisabledOnly}
              onChange={(e) => {
                setShowDisabledOnly(e.target.checked);
                setCurrentPage(1);
              }}
              className="rounded border-slate-300 text-sky-600 focus:ring-sky-500 h-3.5 w-3.5"
            />
            <span>显示停用</span>
          </label>

          {/* 查询 & 重置 buttons */}
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={handleQuery}
              className="px-3.5 py-1 bg-sky-600 hover:bg-sky-700 text-white rounded font-medium shadow-2xs transition-colors flex items-center gap-1"
            >
              <Search className="w-3.5 h-3.5" />
              查询
            </button>
            <button
              onClick={handleResetFilters}
              className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded transition-colors flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              重置
            </button>
          </div>
        </div>

        {/* Action Button Row */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenAddModal}
              className="px-3 py-1 bg-sky-600 hover:bg-sky-700 text-white rounded font-medium shadow-2xs transition-colors flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              新增项目
            </button>
            <span className="text-[11px] text-slate-500">
              提示：点击表格中任意检验项目或【配置/详情】，将在弹窗中查看/编辑基本信息、项目取值、项目参考及计算公式。
            </span>
          </div>

          <span className="text-[11px] text-slate-500">
            共找到 <strong className="text-sky-700">{totalItems}</strong> 项项目字典
          </span>
        </div>
      </div>

      {/* Main Table Container (Full Page Width) */}
      <div className="flex-1 p-3 min-h-0 overflow-hidden flex flex-col">
        <div className="bg-white border border-slate-200 rounded-lg shadow-2xs flex-1 flex flex-col overflow-hidden">
          {/* Table Area */}
          <div className="flex-1 overflow-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100/90 text-slate-700 font-semibold border-b border-slate-200 sticky top-0 z-10 shadow-2xs">
                  <th className="py-2.5 px-3 w-12 text-center border-r border-slate-200">#</th>
                  <th className="py-2.5 px-3 border-r border-slate-200">项目分类</th>
                  <th className="py-2.5 px-3 border-r border-slate-200">项目代码</th>
                  <th className="py-2.5 px-3 border-r border-slate-200">项目名称</th>
                  <th className="py-2.5 px-3 border-r border-slate-200">英文名</th>
                  <th className="py-2.5 px-3 border-r border-slate-200">单位</th>
                  <th className="py-2.5 px-3 border-r border-slate-200">结果类型</th>
                  <th className="py-2.5 px-3 border-r border-slate-200">试验方法</th>
                  <th className="py-2.5 px-3 border-r border-slate-200 text-center">状态</th>
                  <th className="py-2.5 px-3 border-r border-slate-200">最近更新时间</th>
                  <th className="py-2.5 px-3 text-center w-36">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedItems.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Table2 className="w-8 h-8 text-slate-300" />
                        <span>未找到匹配的检验项目字典记录</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedItems.map((item, index) => {
                    const rowNum = (currentPage - 1) * pageSize + index + 1;
                    return (
                      <tr
                        key={item.id}
                        onClick={() => handleOpenDetailModal(item)}
                        className={`hover:bg-sky-50/60 transition-colors cursor-pointer ${
                          item.status === '停用' ? 'bg-slate-50/70 text-slate-400' : ''
                        }`}
                      >
                        <td className="py-2 px-3 text-center text-slate-400 border-r border-slate-100 font-mono">
                          {rowNum}
                        </td>
                        <td className="py-2 px-3 border-r border-slate-100">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium border ${getCategoryBadgeClass(
                              item.category
                            )}`}
                          >
                            {item.category}
                          </span>
                        </td>
                        <td className="py-2 px-3 border-r border-slate-100 font-mono font-semibold text-slate-800">
                          {item.code}
                        </td>
                        <td className="py-2 px-3 border-r border-slate-100 font-medium text-sky-700 hover:underline">
                          {item.name}
                          {item.isCalculated === '是' && (
                            <span className="ml-1.5 px-1 py-0.2 bg-amber-100 text-amber-800 rounded text-[10px]">
                              计算项
                            </span>
                          )}
                        </td>
                        <td className="py-2 px-3 border-r border-slate-100 font-mono text-slate-600">
                          {item.englishName || '-'}
                        </td>
                        <td className="py-2 px-3 border-r border-slate-100 text-slate-600 font-mono">
                          {item.unit || '-'}
                        </td>
                        <td className="py-2 px-3 border-r border-slate-100">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[11px] ${
                              item.resultType === '定量'
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : 'bg-purple-50 text-purple-700 border border-purple-200'
                            }`}
                          >
                            {item.resultType}
                          </span>
                        </td>
                        <td className="py-2 px-3 border-r border-slate-100 text-slate-600 truncate max-w-[150px]">
                          {item.testMethod || '-'}
                        </td>
                        <td className="py-2 px-3 border-r border-slate-100 text-center">
                          {item.status === '启用' ? (
                            <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                              启用
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-rose-600 font-semibold bg-rose-50 px-2 py-0.5 rounded border border-rose-200 text-[11px]">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                              停用
                            </span>
                          )}
                        </td>
                        <td className="py-2 px-3 border-r border-slate-100 text-slate-500 font-mono text-[11px]">
                          {item.updateTime}
                        </td>
                        <td
                          className="py-2 px-3 text-center"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleOpenDetailModal(item)}
                              className="text-sky-600 hover:text-sky-800 hover:underline font-medium"
                              title="在弹窗中配置基本信息、参考值与公式"
                            >
                              配置/详情
                            </button>
                            <span className="text-slate-300">|</span>
                            <button
                              onClick={() => handleToggleStatus(item)}
                              className={`font-medium ${
                                item.status === '启用'
                                  ? 'text-amber-600 hover:text-amber-800'
                                  : 'text-emerald-600 hover:text-emerald-800'
                              }`}
                            >
                              {item.status === '启用' ? '停用' : '启用'}
                            </button>
                            <span className="text-slate-300">|</span>
                            <button
                              onClick={() => setItemToDelete(item)}
                              className="text-rose-600 hover:text-rose-800 hover:underline font-medium"
                            >
                              删除
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer / Pagination (Matching Screenshot: 合计: XX 条, 10条/页) */}
          <div className="bg-slate-50 border-t border-slate-200 px-4 py-2.5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <span className="text-sky-700 font-semibold">合计: {totalItems} 条</span>
              <span className="text-slate-400">|</span>
              <span className="text-slate-500">
                每页显示 <strong>10</strong> 条 (已固定)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-500 text-[11px]">
                第 {currentPage} / {totalPages} 页
              </span>
              <div className="flex items-center gap-1">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-2 py-1 bg-white border border-slate-300 rounded text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 flex items-center gap-1"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  上一页
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p)}
                    className={`w-7 h-7 rounded font-medium border text-xs ${
                      currentPage === p
                        ? 'bg-sky-600 text-white border-sky-600'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {p}
                  </button>
                ))}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="px-2 py-1 bg-white border border-slate-300 rounded text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 flex items-center gap-1"
                >
                  下一页
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 4-Tab Detail Modal Dialog (Requirement: 点击左侧列表弹窗展示右侧详情) */}
      {/* ========================================================= */}
      {detailModalItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Title Bar */}
            <div className="bg-slate-800 text-white px-5 py-3.5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <Sliders className="w-5 h-5 text-sky-400" />
                <div>
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    <span>检验项目配置详情</span>
                    <span className="text-sky-300 font-mono">[{detailModalItem.code}]</span>
                    <span>{detailModalItem.name}</span>
                    {detailModalItem.englishName && (
                      <span className="text-slate-400 text-xs font-mono">
                        ({detailModalItem.englishName})
                      </span>
                    )}
                  </h3>
                  <p className="text-[11px] text-slate-300">
                    所属分类: {detailModalItem.category} | 最近修改: {detailModalItem.updateTime} ({detailModalItem.operator})
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {detailModalItem.status === '启用' ? (
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded text-[11px] font-medium">
                    启用中
                  </span>
                ) : (
                  <span className="px-2 py-0.5 bg-rose-500/20 text-rose-300 border border-rose-400/30 rounded text-[11px] font-medium">
                    已停用
                  </span>
                )}
                <button
                  onClick={() => setDetailModalItem(null)}
                  className="text-slate-400 hover:text-white transition-colors p-1 rounded hover:bg-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Tabs Bar (Matching user screenshots: 基本信息 | 项目取值 | 项目参考 | 计算公式) */}
            <div className="bg-slate-100 border-b border-slate-200 px-5 flex items-center gap-1 shrink-0">
              <button
                onClick={() => setActiveDetailTab('basic')}
                className={`px-4 py-2.5 font-medium border-b-2 text-xs transition-colors ${
                  activeDetailTab === 'basic'
                    ? 'border-sky-600 text-sky-700 bg-white font-semibold'
                    : 'border-transparent text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                基本信息
              </button>
              <button
                onClick={() => setActiveDetailTab('values')}
                className={`px-4 py-2.5 font-medium border-b-2 text-xs transition-colors ${
                  activeDetailTab === 'values'
                    ? 'border-sky-600 text-sky-700 bg-white font-semibold'
                    : 'border-transparent text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                项目取值 ({detailModalItem.valueOptions.length})
              </button>
              <button
                onClick={() => setActiveDetailTab('refs')}
                className={`px-4 py-2.5 font-medium border-b-2 text-xs transition-colors ${
                  activeDetailTab === 'refs'
                    ? 'border-sky-600 text-sky-700 bg-white font-semibold'
                    : 'border-transparent text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                项目参考 ({detailModalItem.quantitativeRefs.length + detailModalItem.qualitativeRefs.length})
              </button>
              <button
                onClick={() => setActiveDetailTab('formula')}
                className={`px-4 py-2.5 font-medium border-b-2 text-xs transition-colors ${
                  activeDetailTab === 'formula'
                    ? 'border-sky-600 text-sky-700 bg-white font-semibold'
                    : 'border-transparent text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                计算公式 ({detailModalItem.calculationFormulas.length})
              </button>
            </div>

            {/* Modal Body Content */}
            <div className="flex-1 p-5 overflow-auto bg-slate-50">
              {/* TAB 1: 基本信息 (Basic Information Form matching image_ff513fe9.png) */}
              {activeDetailTab === 'basic' && (
                <div className="space-y-4 max-w-4xl mx-auto bg-white p-5 rounded-lg border border-slate-200 shadow-2xs">
                  <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    <div className="flex items-center gap-3">
                      <span className="w-24 text-right text-slate-600 font-medium">项目分类:</span>
                      <select
                        value={detailModalItem.category}
                        onChange={(e) =>
                          updateDetailItem((prev) => ({
                            ...prev,
                            category: e.target.value as any,
                          }))
                        }
                        className="flex-1 border border-slate-300 rounded px-2.5 py-1.5 text-xs bg-slate-50 focus:bg-white focus:ring-1 focus:ring-sky-500"
                      >
                        <option value="临检">临检</option>
                        <option value="生化">生化</option>
                        <option value="免疫">免疫</option>
                        <option value="凝血">凝血</option>
                        <option value="微生物">微生物</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="w-24 text-right text-slate-600 font-medium">项目代码:</span>
                      <input
                        type="text"
                        value={detailModalItem.code}
                        onChange={(e) =>
                          updateDetailItem((prev) => ({
                            ...prev,
                            code: e.target.value,
                          }))
                        }
                        className="flex-1 border border-slate-300 rounded px-2.5 py-1.5 text-xs font-mono bg-slate-50 focus:bg-white focus:ring-1 focus:ring-sky-500"
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="w-24 text-right text-slate-600 font-medium">项目名称:</span>
                      <input
                        type="text"
                        value={detailModalItem.name}
                        onChange={(e) =>
                          updateDetailItem((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        className="flex-1 border border-slate-300 rounded px-2.5 py-1.5 text-xs font-medium bg-slate-50 focus:bg-white focus:ring-1 focus:ring-sky-500"
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="w-24 text-right text-slate-600 font-medium">英文名:</span>
                      <input
                        type="text"
                        value={detailModalItem.englishName}
                        onChange={(e) =>
                          updateDetailItem((prev) => ({
                            ...prev,
                            englishName: e.target.value,
                          }))
                        }
                        className="flex-1 border border-slate-300 rounded px-2.5 py-1.5 text-xs font-mono bg-slate-50 focus:bg-white focus:ring-1 focus:ring-sky-500"
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="w-24 text-right text-slate-600 font-medium">单位:</span>
                      <input
                        type="text"
                        value={detailModalItem.unit}
                        onChange={(e) =>
                          updateDetailItem((prev) => ({
                            ...prev,
                            unit: e.target.value,
                          }))
                        }
                        className="flex-1 border border-slate-300 rounded px-2.5 py-1.5 text-xs font-mono bg-slate-50 focus:bg-white focus:ring-1 focus:ring-sky-500"
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="w-24 text-right text-slate-600 font-medium">结果类型:</span>
                      <select
                        value={detailModalItem.resultType}
                        onChange={(e) =>
                          updateDetailItem((prev) => ({
                            ...prev,
                            resultType: e.target.value as any,
                          }))
                        }
                        className="flex-1 border border-slate-300 rounded px-2.5 py-1.5 text-xs bg-slate-50 focus:bg-white focus:ring-1 focus:ring-sky-500"
                      >
                        <option value="定量">定量</option>
                        <option value="定性">定性</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="w-24 text-right text-slate-600 font-medium">计算项目:</span>
                      <select
                        value={detailModalItem.isCalculated}
                        onChange={(e) =>
                          updateDetailItem((prev) => ({
                            ...prev,
                            isCalculated: e.target.value as any,
                          }))
                        }
                        className="flex-1 border border-slate-300 rounded px-2.5 py-1.5 text-xs bg-slate-50 focus:bg-white focus:ring-1 focus:ring-sky-500"
                      >
                        <option value="否">否</option>
                        <option value="是">是</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="w-24 text-right text-slate-600 font-medium">计算公式:</span>
                      <input
                        type="text"
                        disabled={detailModalItem.isCalculated === '否'}
                        value={detailModalItem.calculationFormula}
                        onChange={(e) =>
                          updateDetailItem((prev) => ({
                            ...prev,
                            calculationFormula: e.target.value,
                          }))
                        }
                        placeholder={detailModalItem.isCalculated === '否' ? '非计算项目' : '例如: [Cr]*100'}
                        className="flex-1 border border-slate-300 rounded px-2.5 py-1.5 text-xs font-mono bg-slate-50 focus:bg-white focus:ring-1 focus:ring-sky-500 disabled:opacity-50"
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="w-24 text-right text-slate-600 font-medium">小数位数:</span>
                      <input
                        type="number"
                        min={0}
                        max={6}
                        value={detailModalItem.decimalPlaces}
                        onChange={(e) =>
                          updateDetailItem((prev) => ({
                            ...prev,
                            decimalPlaces: Number(e.target.value) || 0,
                          }))
                        }
                        className="flex-1 border border-slate-300 rounded px-2.5 py-1.5 text-xs font-mono bg-slate-50 focus:bg-white focus:ring-1 focus:ring-sky-500"
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="w-24 text-right text-slate-600 font-medium">试验方法:</span>
                      <input
                        type="text"
                        value={detailModalItem.testMethod}
                        onChange={(e) =>
                          updateDetailItem((prev) => ({
                            ...prev,
                            testMethod: e.target.value,
                          }))
                        }
                        className="flex-1 border border-slate-300 rounded px-2.5 py-1.5 text-xs bg-slate-50 focus:bg-white focus:ring-1 focus:ring-sky-500"
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="w-24 text-right text-slate-600 font-medium">状态:</span>
                      <select
                        value={detailModalItem.status}
                        onChange={(e) =>
                          updateDetailItem((prev) => ({
                            ...prev,
                            status: e.target.value as any,
                          }))
                        }
                        className="flex-1 border border-slate-300 rounded px-2.5 py-1.5 text-xs bg-slate-50 focus:bg-white focus:ring-1 focus:ring-sky-500"
                      >
                        <option value="启用">启用</option>
                        <option value="停用">停用</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="w-24 text-right text-slate-600 font-medium">操作人员:</span>
                      <input
                        type="text"
                        disabled
                        value={detailModalItem.operator || '张珊'}
                        className="flex-1 border border-slate-200 rounded px-2.5 py-1.5 text-xs bg-slate-100 text-slate-500 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="flex items-start gap-3 pt-2">
                    <span className="w-24 text-right text-slate-600 font-medium pt-1">项目说明:</span>
                    <textarea
                      rows={2}
                      value={detailModalItem.notes || ''}
                      onChange={(e) =>
                        updateDetailItem((prev) => ({
                          ...prev,
                          notes: e.target.value,
                        }))
                      }
                      placeholder="项目临床意义、备注或注意事项..."
                      className="flex-1 border border-slate-300 rounded px-2.5 py-1.5 text-xs bg-slate-50 focus:bg-white focus:ring-1 focus:ring-sky-500"
                    />
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex justify-end">
                    <button
                      onClick={() => triggerAction(`已保存 [${detailModalItem.name}] 的基本信息配置`)}
                      className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded font-medium shadow-2xs transition-colors flex items-center gap-1"
                    >
                      <Check className="w-4 h-4" />
                      保存基本信息
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: 项目取值 (Matching image_72382c93.png) */}
              {activeDetailTab === 'values' && (
                <div className="space-y-3 bg-white p-4 rounded-lg border border-slate-200 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-slate-800">离散定性项目取值表</h4>
                      <p className="text-[11px] text-slate-500">
                        定义定量/定性检验项目的报告离散值名称、代码与默认选择项。
                      </p>
                    </div>
                    <button
                      onClick={handleAddValueOption}
                      className="px-3 py-1 bg-sky-600 hover:bg-sky-700 text-white rounded text-xs font-medium shadow-2xs transition-colors flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      新增取值
                    </button>
                  </div>

                  <div className="border border-slate-200 rounded overflow-hidden">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 font-semibold">
                          <th className="py-2 px-3 border-r border-slate-200 w-32">值代码</th>
                          <th className="py-2 px-3 border-r border-slate-200">值名称</th>
                          <th className="py-2 px-3 border-r border-slate-200 w-24 text-center">默认项</th>
                          <th className="py-2 px-3 text-center w-24">操作</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {detailModalItem.valueOptions.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="py-8 text-center text-slate-400">
                              暂无取值项，点击上方【新增取值】按钮进行添加
                            </td>
                          </tr>
                        ) : (
                          detailModalItem.valueOptions.map((vo) => (
                            <tr key={vo.id} className="hover:bg-slate-50">
                              <td className="py-2 px-3 border-r border-slate-100">
                                <input
                                  type="text"
                                  value={vo.valueCode}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    updateDetailItem((prev) => ({
                                      ...prev,
                                      valueOptions: prev.valueOptions.map((v) =>
                                        v.id === vo.id ? { ...v, valueCode: val } : v
                                      ),
                                    }));
                                  }}
                                  className="w-full border border-slate-300 rounded px-2 py-1 text-xs font-mono"
                                />
                              </td>
                              <td className="py-2 px-3 border-r border-slate-100">
                                <input
                                  type="text"
                                  value={vo.valueName}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    updateDetailItem((prev) => ({
                                      ...prev,
                                      valueOptions: prev.valueOptions.map((v) =>
                                        v.id === vo.id ? { ...v, valueName: val } : v
                                      ),
                                    }));
                                  }}
                                  className="w-full border border-slate-300 rounded px-2 py-1 text-xs"
                                />
                              </td>
                              <td className="py-2 px-3 border-r border-slate-100 text-center">
                                <input
                                  type="checkbox"
                                  checked={vo.isDefault}
                                  onChange={(e) => {
                                    const isChecked = e.target.checked;
                                    updateDetailItem((prev) => ({
                                      ...prev,
                                      valueOptions: prev.valueOptions.map((v) =>
                                        v.id === vo.id
                                          ? { ...v, isDefault: isChecked }
                                          : isChecked
                                          ? { ...v, isDefault: false }
                                          : v
                                      ),
                                    }));
                                  }}
                                  className="rounded border-slate-300 text-sky-600 focus:ring-sky-500 h-4 w-4"
                                />
                              </td>
                              <td className="py-2 px-3 text-center">
                                <button
                                  onClick={() => handleDeleteValueOption(vo.id)}
                                  className="text-rose-600 hover:text-rose-800 hover:underline font-medium"
                                >
                                  删除
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 3: 项目参考 (Matching image_32d1d57a.png & image_f6032964.png) */}
              {activeDetailTab === 'refs' && (
                <div className="space-y-3 bg-white p-4 rounded-lg border border-slate-200 shadow-2xs">
                  {/* Subtabs: 定量参考 vs 定性参考 */}
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActiveRefSubTab('quantitative')}
                        className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                          activeRefSubTab === 'quantitative'
                            ? 'bg-sky-600 text-white shadow-2xs'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        定量参考区间
                      </button>
                      <button
                        onClick={() => setActiveRefSubTab('qualitative')}
                        className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                          activeRefSubTab === 'qualitative'
                            ? 'bg-sky-600 text-white shadow-2xs'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        定性参考区间
                      </button>
                    </div>

                    {activeRefSubTab === 'quantitative' ? (
                      <button
                        onClick={handleAddQuantitativeRef}
                        className="px-3 py-1 bg-sky-600 hover:bg-sky-700 text-white rounded text-xs font-medium shadow-2xs transition-colors flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        新增定量参考
                      </button>
                    ) : (
                      <button
                        onClick={handleAddQualitativeRef}
                        className="px-3 py-1 bg-sky-600 hover:bg-sky-700 text-white rounded text-xs font-medium shadow-2xs transition-colors flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        新增定性参考
                      </button>
                    )}
                  </div>

                  {/* SUBTAB 1: 定量参考 Table */}
                  {activeRefSubTab === 'quantitative' && (
                    <div className="border border-slate-200 rounded overflow-x-auto">
                      <table className="w-full text-left border-collapse min-w-[900px]">
                        <thead>
                          <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 font-semibold text-[11px]">
                            <th className="py-2 px-2.5 border-r border-slate-200">性别</th>
                            <th className="py-2 px-2.5 border-r border-slate-200">年龄</th>
                            <th className="py-2 px-2.5 border-r border-slate-200">标本类型</th>
                            <th className="py-2 px-2.5 border-r border-slate-200">临床特征</th>
                            <th className="py-2 px-2.5 border-r border-slate-200">仪器</th>
                            <th className="py-2 px-2.5 border-r border-slate-200">科室</th>
                            <th className="py-2 px-2.5 border-r border-slate-200">参考值</th>
                            <th className="py-2 px-2.5 border-r border-slate-200">危急低值</th>
                            <th className="py-2 px-2.5 border-r border-slate-200">危急高值</th>
                            <th className="py-2 px-2.5 border-r border-slate-200">复查低值</th>
                            <th className="py-2 px-2.5 border-r border-slate-200">复查高值</th>
                            <th className="py-2 px-2.5 text-center w-16">操作</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-[11px]">
                          {detailModalItem.quantitativeRefs.length === 0 ? (
                            <tr>
                              <td colSpan={12} className="py-8 text-center text-slate-400">
                                暂无定量参考数据，点击【新增定量参考】添加
                              </td>
                            </tr>
                          ) : (
                            detailModalItem.quantitativeRefs.map((q) => (
                              <tr key={q.id} className="hover:bg-slate-50">
                                <td className="py-1.5 px-2 border-r border-slate-100">
                                  <select
                                    value={q.gender}
                                    onChange={(e) => {
                                      const val = e.target.value as any;
                                      updateDetailItem((prev) => ({
                                        ...prev,
                                        quantitativeRefs: prev.quantitativeRefs.map((item) =>
                                          item.id === q.id ? { ...item, gender: val } : item
                                        ),
                                      }));
                                    }}
                                    className="border border-slate-300 rounded px-1 py-0.5 text-[11px] w-full"
                                  >
                                    <option value="不区分">不区分</option>
                                    <option value="男">男</option>
                                    <option value="女">女</option>
                                  </select>
                                </td>
                                <td className="py-1.5 px-2 border-r border-slate-100">
                                  <input
                                    type="text"
                                    value={q.ageRange}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      updateDetailItem((prev) => ({
                                        ...prev,
                                        quantitativeRefs: prev.quantitativeRefs.map((item) =>
                                          item.id === q.id ? { ...item, ageRange: val } : item
                                        ),
                                      }));
                                    }}
                                    className="border border-slate-300 rounded px-1 py-0.5 text-[11px] w-full"
                                  />
                                </td>
                                <td className="py-1.5 px-2 border-r border-slate-100">
                                  <input
                                    type="text"
                                    value={q.specimenType}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      updateDetailItem((prev) => ({
                                        ...prev,
                                        quantitativeRefs: prev.quantitativeRefs.map((item) =>
                                          item.id === q.id ? { ...item, specimenType: val } : item
                                        ),
                                      }));
                                    }}
                                    className="border border-slate-300 rounded px-1 py-0.5 text-[11px] w-full"
                                  />
                                </td>
                                <td className="py-1.5 px-2 border-r border-slate-100">
                                  <input
                                    type="text"
                                    value={q.clinicalFeature}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      updateDetailItem((prev) => ({
                                        ...prev,
                                        quantitativeRefs: prev.quantitativeRefs.map((item) =>
                                          item.id === q.id ? { ...item, clinicalFeature: val } : item
                                        ),
                                      }));
                                    }}
                                    className="border border-slate-300 rounded px-1 py-0.5 text-[11px] w-full"
                                  />
                                </td>
                                <td className="py-1.5 px-2 border-r border-slate-100">
                                  <input
                                    type="text"
                                    value={q.instrument}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      updateDetailItem((prev) => ({
                                        ...prev,
                                        quantitativeRefs: prev.quantitativeRefs.map((item) =>
                                          item.id === q.id ? { ...item, instrument: val } : item
                                        ),
                                      }));
                                    }}
                                    className="border border-slate-300 rounded px-1 py-0.5 text-[11px] w-full"
                                  />
                                </td>
                                <td className="py-1.5 px-2 border-r border-slate-100">
                                  <input
                                    type="text"
                                    value={q.department}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      updateDetailItem((prev) => ({
                                        ...prev,
                                        quantitativeRefs: prev.quantitativeRefs.map((item) =>
                                          item.id === q.id ? { ...item, department: val } : item
                                        ),
                                      }));
                                    }}
                                    className="border border-slate-300 rounded px-1 py-0.5 text-[11px] w-full"
                                  />
                                </td>
                                <td className="py-1.5 px-2 border-r border-slate-100 font-mono font-medium text-sky-700">
                                  <input
                                    type="text"
                                    value={q.referenceValue}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      updateDetailItem((prev) => ({
                                        ...prev,
                                        quantitativeRefs: prev.quantitativeRefs.map((item) =>
                                          item.id === q.id ? { ...item, referenceValue: val } : item
                                        ),
                                      }));
                                    }}
                                    className="border border-slate-300 rounded px-1 py-0.5 text-[11px] w-full font-mono font-semibold"
                                  />
                                </td>
                                <td className="py-1.5 px-2 border-r border-slate-100">
                                  <input
                                    type="text"
                                    value={q.criticalLow}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      updateDetailItem((prev) => ({
                                        ...prev,
                                        quantitativeRefs: prev.quantitativeRefs.map((item) =>
                                          item.id === q.id ? { ...item, criticalLow: val } : item
                                        ),
                                      }));
                                    }}
                                    className="border border-slate-300 rounded px-1 py-0.5 text-[11px] w-full text-rose-600 font-mono"
                                  />
                                </td>
                                <td className="py-1.5 px-2 border-r border-slate-100">
                                  <input
                                    type="text"
                                    value={q.criticalHigh}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      updateDetailItem((prev) => ({
                                        ...prev,
                                        quantitativeRefs: prev.quantitativeRefs.map((item) =>
                                          item.id === q.id ? { ...item, criticalHigh: val } : item
                                        ),
                                      }));
                                    }}
                                    className="border border-slate-300 rounded px-1 py-0.5 text-[11px] w-full text-rose-600 font-mono"
                                  />
                                </td>
                                <td className="py-1.5 px-2 border-r border-slate-100">
                                  <input
                                    type="text"
                                    value={q.retestLow}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      updateDetailItem((prev) => ({
                                        ...prev,
                                        quantitativeRefs: prev.quantitativeRefs.map((item) =>
                                          item.id === q.id ? { ...item, retestLow: val } : item
                                        ),
                                      }));
                                    }}
                                    className="border border-slate-300 rounded px-1 py-0.5 text-[11px] w-full text-amber-600 font-mono"
                                  />
                                </td>
                                <td className="py-1.5 px-2 border-r border-slate-100">
                                  <input
                                    type="text"
                                    value={q.retestHigh}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      updateDetailItem((prev) => ({
                                        ...prev,
                                        quantitativeRefs: prev.quantitativeRefs.map((item) =>
                                          item.id === q.id ? { ...item, retestHigh: val } : item
                                        ),
                                      }));
                                    }}
                                    className="border border-slate-300 rounded px-1 py-0.5 text-[11px] w-full text-amber-600 font-mono"
                                  />
                                </td>
                                <td className="py-1.5 px-2 text-center">
                                  <button
                                    onClick={() => handleDeleteQuantitativeRef(q.id)}
                                    className="text-rose-600 hover:text-rose-800 hover:underline font-medium"
                                  >
                                    删除
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* SUBTAB 2: 定性参考 Table */}
                  {activeRefSubTab === 'qualitative' && (
                    <div className="border border-slate-200 rounded overflow-x-auto">
                      <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                          <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 font-semibold text-[11px]">
                            <th className="py-2 px-2.5 border-r border-slate-200">性别</th>
                            <th className="py-2 px-2.5 border-r border-slate-200">年龄</th>
                            <th className="py-2 px-2.5 border-r border-slate-200">标本类型</th>
                            <th className="py-2 px-2.5 border-r border-slate-200">临床特征</th>
                            <th className="py-2 px-2.5 border-r border-slate-200">仪器</th>
                            <th className="py-2 px-2.5 border-r border-slate-200">申请科室</th>
                            <th className="py-2 px-2.5 border-r border-slate-200">参考值</th>
                            <th className="py-2 px-2.5 border-r border-slate-200">危急值参考</th>
                            <th className="py-2 px-2.5 border-r border-slate-200">复查参考</th>
                            <th className="py-2 px-2.5 text-center w-16">操作</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-[11px]">
                          {detailModalItem.qualitativeRefs.length === 0 ? (
                            <tr>
                              <td colSpan={10} className="py-8 text-center text-slate-400">
                                暂无定性参考数据，点击【新增定性参考】添加
                              </td>
                            </tr>
                          ) : (
                            detailModalItem.qualitativeRefs.map((ql) => (
                              <tr key={ql.id} className="hover:bg-slate-50">
                                <td className="py-1.5 px-2 border-r border-slate-100">
                                  <select
                                    value={ql.gender}
                                    onChange={(e) => {
                                      const val = e.target.value as any;
                                      updateDetailItem((prev) => ({
                                        ...prev,
                                        qualitativeRefs: prev.qualitativeRefs.map((item) =>
                                          item.id === ql.id ? { ...item, gender: val } : item
                                        ),
                                      }));
                                    }}
                                    className="border border-slate-300 rounded px-1 py-0.5 text-[11px] w-full"
                                  >
                                    <option value="不区分">不区分</option>
                                    <option value="男">男</option>
                                    <option value="女">女</option>
                                  </select>
                                </td>
                                <td className="py-1.5 px-2 border-r border-slate-100">
                                  <input
                                    type="text"
                                    value={ql.ageRange}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      updateDetailItem((prev) => ({
                                        ...prev,
                                        qualitativeRefs: prev.qualitativeRefs.map((item) =>
                                          item.id === ql.id ? { ...item, ageRange: val } : item
                                        ),
                                      }));
                                    }}
                                    className="border border-slate-300 rounded px-1 py-0.5 text-[11px] w-full"
                                  />
                                </td>
                                <td className="py-1.5 px-2 border-r border-slate-100">
                                  <input
                                    type="text"
                                    value={ql.specimenType}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      updateDetailItem((prev) => ({
                                        ...prev,
                                        qualitativeRefs: prev.qualitativeRefs.map((item) =>
                                          item.id === ql.id ? { ...item, specimenType: val } : item
                                        ),
                                      }));
                                    }}
                                    className="border border-slate-300 rounded px-1 py-0.5 text-[11px] w-full"
                                  />
                                </td>
                                <td className="py-1.5 px-2 border-r border-slate-100">
                                  <input
                                    type="text"
                                    value={ql.clinicalFeature}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      updateDetailItem((prev) => ({
                                        ...prev,
                                        qualitativeRefs: prev.qualitativeRefs.map((item) =>
                                          item.id === ql.id ? { ...item, clinicalFeature: val } : item
                                        ),
                                      }));
                                    }}
                                    className="border border-slate-300 rounded px-1 py-0.5 text-[11px] w-full"
                                  />
                                </td>
                                <td className="py-1.5 px-2 border-r border-slate-100">
                                  <input
                                    type="text"
                                    value={ql.instrument}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      updateDetailItem((prev) => ({
                                        ...prev,
                                        qualitativeRefs: prev.qualitativeRefs.map((item) =>
                                          item.id === ql.id ? { ...item, instrument: val } : item
                                        ),
                                      }));
                                    }}
                                    className="border border-slate-300 rounded px-1 py-0.5 text-[11px] w-full"
                                  />
                                </td>
                                <td className="py-1.5 px-2 border-r border-slate-100">
                                  <input
                                    type="text"
                                    value={ql.department}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      updateDetailItem((prev) => ({
                                        ...prev,
                                        qualitativeRefs: prev.qualitativeRefs.map((item) =>
                                          item.id === ql.id ? { ...item, department: val } : item
                                        ),
                                      }));
                                    }}
                                    className="border border-slate-300 rounded px-1 py-0.5 text-[11px] w-full"
                                  />
                                </td>
                                <td className="py-1.5 px-2 border-r border-slate-100">
                                  <input
                                    type="text"
                                    value={ql.referenceValue}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      updateDetailItem((prev) => ({
                                        ...prev,
                                        qualitativeRefs: prev.qualitativeRefs.map((item) =>
                                          item.id === ql.id ? { ...item, referenceValue: val } : item
                                        ),
                                      }));
                                    }}
                                    className="border border-slate-300 rounded px-1 py-0.5 text-[11px] w-full font-medium text-emerald-700"
                                  />
                                </td>
                                <td className="py-1.5 px-2 border-r border-slate-100">
                                  <input
                                    type="text"
                                    value={ql.criticalValue}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      updateDetailItem((prev) => ({
                                        ...prev,
                                        qualitativeRefs: prev.qualitativeRefs.map((item) =>
                                          item.id === ql.id ? { ...item, criticalValue: val } : item
                                        ),
                                      }));
                                    }}
                                    className="border border-slate-300 rounded px-1 py-0.5 text-[11px] w-full text-rose-600 font-medium"
                                  />
                                </td>
                                <td className="py-1.5 px-2 border-r border-slate-100">
                                  <input
                                    type="text"
                                    value={ql.retestValue}
                                    onChange={(e) => {
                                      const val = e.target.value;
                                      updateDetailItem((prev) => ({
                                        ...prev,
                                        qualitativeRefs: prev.qualitativeRefs.map((item) =>
                                          item.id === ql.id ? { ...item, retestValue: val } : item
                                        ),
                                      }));
                                    }}
                                    className="border border-slate-300 rounded px-1 py-0.5 text-[11px] w-full text-amber-600 font-medium"
                                  />
                                </td>
                                <td className="py-1.5 px-2 text-center">
                                  <button
                                    onClick={() => handleDeleteQualitativeRef(ql.id)}
                                    className="text-rose-600 hover:text-rose-800 hover:underline font-medium"
                                  >
                                    删除
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: 计算公式 (Matching image_310dc494.png) */}
              {activeDetailTab === 'formula' && (
                <div className="space-y-3 bg-white p-4 rounded-lg border border-slate-200 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-slate-800 flex items-center gap-1.5">
                        <Calculator className="w-4 h-4 text-sky-600" />
                        计算公式映射规则表
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        定义不同申请科室、样本类型或性别限制下的动态自动计算表达规则。
                      </p>
                    </div>
                    <button
                      onClick={handleAddCalculationFormula}
                      className="px-3 py-1 bg-sky-600 hover:bg-sky-700 text-white rounded text-xs font-medium shadow-2xs transition-colors flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      新增计算公式
                    </button>
                  </div>

                  <div className="border border-slate-200 rounded overflow-hidden">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 font-semibold">
                          <th className="py-2 px-3 border-r border-slate-200">科室</th>
                          <th className="py-2 px-3 border-r border-slate-200">样本类型</th>
                          <th className="py-2 px-3 border-r border-slate-200 w-24">性别</th>
                          <th className="py-2 px-3 border-r border-slate-200">项目结果判断</th>
                          <th className="py-2 px-3 border-r border-slate-200">计算公式</th>
                          <th className="py-2 px-3 text-center w-24">操作</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {detailModalItem.calculationFormulas.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="py-8 text-center text-slate-400">
                              暂无计算公式规则，点击上方【新增计算公式】添加
                            </td>
                          </tr>
                        ) : (
                          detailModalItem.calculationFormulas.map((cf) => (
                            <tr key={cf.id} className="hover:bg-slate-50">
                              <td className="py-2 px-3 border-r border-slate-100">
                                <input
                                  type="text"
                                  value={cf.department}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    updateDetailItem((prev) => ({
                                      ...prev,
                                      calculationFormulas: prev.calculationFormulas.map((item) =>
                                        item.id === cf.id ? { ...item, department: val } : item
                                      ),
                                    }));
                                  }}
                                  className="w-full border border-slate-300 rounded px-2 py-1 text-xs"
                                />
                              </td>
                              <td className="py-2 px-3 border-r border-slate-100">
                                <input
                                  type="text"
                                  value={cf.sampleType}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    updateDetailItem((prev) => ({
                                      ...prev,
                                      calculationFormulas: prev.calculationFormulas.map((item) =>
                                        item.id === cf.id ? { ...item, sampleType: val } : item
                                      ),
                                    }));
                                  }}
                                  className="w-full border border-slate-300 rounded px-2 py-1 text-xs"
                                />
                              </td>
                              <td className="py-2 px-3 border-r border-slate-100">
                                <select
                                  value={cf.gender}
                                  onChange={(e) => {
                                    const val = e.target.value as any;
                                    updateDetailItem((prev) => ({
                                      ...prev,
                                      calculationFormulas: prev.calculationFormulas.map((item) =>
                                        item.id === cf.id ? { ...item, gender: val } : item
                                      ),
                                    }));
                                  }}
                                  className="w-full border border-slate-300 rounded px-1.5 py-1 text-xs"
                                >
                                  <option value="不区分">不区分</option>
                                  <option value="男">男</option>
                                  <option value="女">女</option>
                                </select>
                              </td>
                              <td className="py-2 px-3 border-r border-slate-100">
                                <input
                                  type="text"
                                  value={cf.resultCondition}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    updateDetailItem((prev) => ({
                                      ...prev,
                                      calculationFormulas: prev.calculationFormulas.map((item) =>
                                        item.id === cf.id ? { ...item, resultCondition: val } : item
                                      ),
                                    }));
                                  }}
                                  className="w-full border border-slate-300 rounded px-2 py-1 text-xs font-mono"
                                />
                              </td>
                              <td className="py-2 px-3 border-r border-slate-100">
                                <input
                                  type="text"
                                  value={cf.formula}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    updateDetailItem((prev) => ({
                                      ...prev,
                                      calculationFormulas: prev.calculationFormulas.map((item) =>
                                        item.id === cf.id ? { ...item, formula: val } : item
                                      ),
                                    }));
                                  }}
                                  className="w-full border border-slate-300 rounded px-2 py-1 text-xs font-mono text-sky-700 font-semibold"
                                />
                              </td>
                              <td className="py-2 px-3 text-center">
                                <button
                                  onClick={() => handleDeleteCalculationFormula(cf.id)}
                                  className="text-rose-600 hover:text-rose-800 hover:underline font-medium"
                                >
                                  删除
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer Bar */}
            <div className="bg-slate-100 border-t border-slate-200 px-5 py-3 flex items-center justify-between shrink-0">
              <span className="text-[11px] text-slate-500">
                按 ESC 键或点击右上角关闭按钮即可退出配置详情。
              </span>
              <button
                onClick={() => setDetailModalItem(null)}
                className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded font-medium transition-colors"
              >
                完成退出
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* Add New Item Modal Dialog (Clear empty fields) */}
      {/* ========================================================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-200 w-full max-w-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-sky-700 text-white px-5 py-3.5 flex items-center justify-between shrink-0">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <Plus className="w-4 h-4" />
                新增检验项目字典
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-white/80 hover:text-white transition-colors p-1 rounded hover:bg-sky-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNewItem} className="p-5 space-y-4 max-h-[80vh] overflow-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">
                    <span className="text-rose-500">*</span> 项目分类
                  </label>
                  <select
                    value={addFormData.category}
                    onChange={(e) =>
                      setAddFormData((prev) => ({
                        ...prev,
                        category: e.target.value as any,
                      }))
                    }
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-sky-500 outline-none"
                  >
                    <option value="临检">临检</option>
                    <option value="生化">生化</option>
                    <option value="免疫">免疫</option>
                    <option value="凝血">凝血</option>
                    <option value="微生物">微生物</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">
                    <span className="text-rose-500">*</span> 项目代码
                  </label>
                  <input
                    type="text"
                    required
                    value={addFormData.code}
                    onChange={(e) =>
                      setAddFormData((prev) => ({
                        ...prev,
                        code: e.target.value,
                      }))
                    }
                    placeholder="例如: 1014"
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs font-mono focus:ring-1 focus:ring-sky-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">
                    <span className="text-rose-500">*</span> 项目名称
                  </label>
                  <input
                    type="text"
                    required
                    value={addFormData.name}
                    onChange={(e) =>
                      setAddFormData((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    placeholder="例如: 胆红素"
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-sky-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">英文简称</label>
                  <input
                    type="text"
                    value={addFormData.englishName}
                    onChange={(e) =>
                      setAddFormData((prev) => ({
                        ...prev,
                        englishName: e.target.value,
                      }))
                    }
                    placeholder="例如: DBIL"
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs font-mono focus:ring-1 focus:ring-sky-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">检验单位</label>
                  <input
                    type="text"
                    value={addFormData.unit}
                    onChange={(e) =>
                      setAddFormData((prev) => ({
                        ...prev,
                        unit: e.target.value,
                      }))
                    }
                    placeholder="例如: μmol/L"
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs font-mono focus:ring-1 focus:ring-sky-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">结果类型</label>
                  <select
                    value={addFormData.resultType}
                    onChange={(e) =>
                      setAddFormData((prev) => ({
                        ...prev,
                        resultType: e.target.value as any,
                      }))
                    }
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-sky-500 outline-none"
                  >
                    <option value="定量">定量</option>
                    <option value="定性">定性</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">试验方法</label>
                  <input
                    type="text"
                    value={addFormData.testMethod}
                    onChange={(e) =>
                      setAddFormData((prev) => ({
                        ...prev,
                        testMethod: e.target.value,
                      }))
                    }
                    placeholder="例如: 钒酸氧化法"
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-sky-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">小数位数</label>
                  <input
                    type="number"
                    min={0}
                    max={6}
                    value={addFormData.decimalPlaces}
                    onChange={(e) =>
                      setAddFormData((prev) => ({
                        ...prev,
                        decimalPlaces: Number(e.target.value) || 0,
                      }))
                    }
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs font-mono focus:ring-1 focus:ring-sky-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">备注说明</label>
                <textarea
                  rows={2}
                  value={addFormData.notes}
                  onChange={(e) =>
                    setAddFormData((prev) => ({
                      ...prev,
                      notes: e.target.value,
                    }))
                  }
                  placeholder="可填写临床意义或操作规范..."
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-sky-500 outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-medium transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded font-medium shadow-2xs transition-colors flex items-center gap-1"
                >
                  <Check className="w-4 h-4" />
                  保存新增
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-200 w-full max-w-sm overflow-hidden p-5 animate-in fade-in zoom-in-95 duration-150 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="font-semibold text-sm">确认删除此检验项目?</h3>
            </div>
            <p className="text-xs text-slate-600">
              您确定要删除项目 <strong className="text-slate-800">[{itemToDelete.code}] {itemToDelete.name}</strong> 吗？删除后此项目的配置、参考区间及公式将一并清空。
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
