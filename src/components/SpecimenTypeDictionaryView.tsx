import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Plus,
  Download,
  Printer,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  X,
  Check,
  Building2,
  User,
  Table2,
  Sliders,
  Trash2,
  FolderOpen,
  FileSpreadsheet,
  Activity,
  ArrowRight
} from './MenuIcon';
import { UserProfile } from '../types/navigation';
import {
  SpecimenTypeItem,
  INITIAL_SPECIMEN_TYPES,
} from '../data/specimenDictionaryData';

interface SpecimenTypeDictionaryViewProps {
  user: UserProfile;
  triggerAction: (msg: string) => void;
  onNavigateToRoutineQc?: () => void;
}

export const SpecimenTypeDictionaryView: React.FC<SpecimenTypeDictionaryViewProps> = ({
  user,
  triggerAction,
}) => {
  // Top filter bar states (matching screenshot fields: 单位, 标本类型, whonet编码, 采集方法)
  const [selectedHospitalUnit, setSelectedHospitalUnit] = useState<string>('中心医院');
  const [filterSpecimenName, setFilterSpecimenName] = useState<string>('');
  const [filterWhonetCode, setFilterWhonetCode] = useState<string>('');
  const [filterCollectionMethod, setFilterCollectionMethod] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('all'); // all | 启用 | 停用

  // Master Specimen Types dataset
  const [specimens, setSpecimens] = useState<SpecimenTypeItem[]>(INITIAL_SPECIMEN_TYPES);

  // Pagination states (Requirement: "一页帮我显示10条数据")
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Modal dialog states
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showImportModal, setShowImportModal] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<SpecimenTypeItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<SpecimenTypeItem | null>(null);

  // Add/Edit Form State
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    whonetCode: '',
    collectionMethod: '',
    container: '',
    department: '临床检验科',
    status: '启用' as '启用' | '停用',
    notes: '',
  });

  // Query / Search handler
  const handleQuery = () => {
    setCurrentPage(1);
    triggerAction(`已根据筛选条件完成标本类型检索`);
  };

  // Reset filters
  const handleResetFilters = () => {
    setFilterSpecimenName('');
    setFilterWhonetCode('');
    setFilterCollectionMethod('');
    setFilterStatus('all');
    setCurrentPage(1);
    triggerAction('已重置所有查询条件');
  };

  // Filtered dataset
  const filteredSpecimens = useMemo(() => {
    return specimens.filter((item) => {
      // 1. 标本类型名称
      if (filterSpecimenName.trim()) {
        const kw = filterSpecimenName.trim().toLowerCase();
        if (!item.name.toLowerCase().includes(kw) && !item.code.toLowerCase().includes(kw)) {
          return false;
        }
      }
      // 2. whonet编码
      if (filterWhonetCode.trim()) {
        const kw = filterWhonetCode.trim().toLowerCase();
        if (!item.whonetCode.toLowerCase().includes(kw)) {
          return false;
        }
      }
      // 3. 采集方法
      if (filterCollectionMethod.trim()) {
        const kw = filterCollectionMethod.trim().toLowerCase();
        if (!item.collectionMethod.toLowerCase().includes(kw)) {
          return false;
        }
      }
      // 4. 状态
      if (filterStatus !== 'all' && item.status !== filterStatus) {
        return false;
      }

      return true;
    });
  }, [specimens, filterSpecimenName, filterWhonetCode, filterCollectionMethod, filterStatus]);

  // Pagination calculation
  const totalItems = filteredSpecimens.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  // Current page records
  const paginatedSpecimens = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredSpecimens.slice(startIndex, startIndex + pageSize);
  }, [filteredSpecimens, currentPage, pageSize]);

  // Toggle status (启用 <-> 停用, matching screenshot)
  const handleToggleStatus = (item: SpecimenTypeItem) => {
    const nextStatus = item.status === '启用' ? '停用' : '启用';
    const nowTime = '2026-10-29 09:50:00';
    const operatorName = user.name || '张珊';

    setSpecimens((prev) =>
      prev.map((s) =>
        s.id === item.id
          ? {
              ...s,
              status: nextStatus,
              updateTime: nowTime,
              operator: operatorName,
            }
          : s
      )
    );

    triggerAction(`标本类型 [${item.name}] 状态已切换为【${nextStatus}】`);
  };

  // Open Add Modal
  const handleOpenAddModal = () => {
    setFormData({
      code: '',
      name: '',
      whonetCode: '',
      collectionMethod: '',
      container: '',
      department: '',
      status: '启用',
      notes: '',
    });
    setEditingItem(null);
    setShowAddModal(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (item: SpecimenTypeItem) => {
    setEditingItem(item);
    setFormData({
      code: item.code,
      name: item.name,
      whonetCode: item.whonetCode,
      collectionMethod: item.collectionMethod,
      container: item.container,
      department: item.department,
      status: item.status,
      notes: item.notes || '',
    });
    setShowAddModal(true);
  };

  // Save (Add / Edit) Specimen Type
  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code.trim()) {
      triggerAction('请填写标本类型编码');
      return;
    }
    if (!formData.name.trim()) {
      triggerAction('请填写标本类型名称');
      return;
    }

    const nowTime = '2026-10-29 09:52:10';
    const operatorName = user.name || '张珊';

    if (editingItem) {
      // Edit
      setSpecimens((prev) =>
        prev.map((s) =>
          s.id === editingItem.id
            ? {
                ...s,
                code: formData.code.trim(),
                name: formData.name.trim(),
                whonetCode: formData.whonetCode.trim().toUpperCase() || '-',
                collectionMethod: formData.collectionMethod.trim(),
                container: formData.container.trim(),
                department: formData.department.trim(),
                status: formData.status,
                notes: formData.notes.trim(),
                operator: operatorName,
                updateTime: nowTime,
              }
            : s
        )
      );
      triggerAction(`标本类型 [${formData.name}] 维护修改成功！`);
    } else {
      // Add New
      const newItem: SpecimenTypeItem = {
        id: `spec-${Date.now()}`,
        code: formData.code.trim(),
        name: formData.name.trim(),
        whonetCode: formData.whonetCode.trim().toUpperCase() || '-',
        collectionMethod: formData.collectionMethod.trim(),
        container: formData.container.trim(),
        department: formData.department.trim(),
        sortOrder: specimens.length + 1,
        status: formData.status,
        operator: operatorName,
        updateTime: nowTime,
        notes: formData.notes.trim(),
      };
      setSpecimens((prev) => [newItem, ...prev]);
      triggerAction(`新增标本类型 [${formData.name}] 已成功建立！`);
    }

    setShowAddModal(false);
  };

  // Confirm Delete
  const handleConfirmDelete = () => {
    if (!itemToDelete) return;
    setSpecimens((prev) => prev.filter((s) => s.id !== itemToDelete.id));
    triggerAction(`标本类型 [${itemToDelete.name}] (编码: ${itemToDelete.code}) 已删除`);
    setItemToDelete(null);
  };

  // Quick Preset Samples for Import
  const handleImportSampleData = () => {
    triggerAction('已成功从国家卫健委/WHONET标准库导入 5 项新标本类型定义！');
    setShowImportModal(false);
  };

  // Quick Stats
  const activeCount = useMemo(() => specimens.filter((s) => s.status === '启用').length, [specimens]);
  const inactiveCount = useMemo(() => specimens.filter((s) => s.status === '停用').length, [specimens]);

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-slate-100 overflow-hidden text-xs">
      {/* 1. Top Header & Breadcrumb & Unit Identification */}
      <div className="bg-white border-b border-slate-200 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shrink-0 shadow-2xs">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2">
          <span className="text-sky-700 font-semibold bg-sky-50 px-2.5 py-0.5 rounded border border-sky-200">
            标本类型字典
          </span>
          <span className="hidden lg:inline text-[11px] text-slate-400 font-mono ml-2">
            标准主数据字典 · WHONET代码映射
          </span>
        </div>

        {/* Global Stats */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200 text-[11px]">
            <span className="text-slate-500">字典总计:</span>
            <span className="font-mono font-bold text-slate-800">{specimens.length}</span>
            <span className="text-slate-300">|</span>
            <span className="text-emerald-700 font-medium">启用 {activeCount}</span>
            <span className="text-slate-300">|</span>
            <span className="text-rose-600 font-medium">停用 {inactiveCount}</span>
          </div>

          <button
            onClick={() => {
              setSpecimens(INITIAL_SPECIMEN_TYPES);
              triggerAction('已恢复标本类型字典全套出厂标准预设');
            }}
            title="重置恢复标准字典"
            className="px-2 py-1 bg-white hover:bg-slate-50 border border-slate-300 text-slate-600 rounded text-xs shadow-2xs flex items-center gap-1 transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            <span className="hidden sm:inline">重置标准字典</span>
          </button>
        </div>
      </div>

      {/* 2. Top Filter Bar & Actions (Matching Screenshot Fields) */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 shrink-0 shadow-2xs space-y-3">
        {/* Filter Inputs Row (matching screenshot: 单位, 标本类型, whonet编码, 采集方法, [查询]) */}
        <div className="flex flex-wrap items-center gap-3">
          {/* 1. 单位 */}
          <div className="flex items-center gap-1.5">
            <label className="text-slate-700 font-medium whitespace-nowrap">单位</label>
            <select
              value={selectedHospitalUnit}
              onChange={(e) => setSelectedHospitalUnit(e.target.value)}
              className="h-7 px-2.5 bg-white border border-slate-300 rounded text-xs text-slate-800 font-medium focus:ring-1 focus:ring-sky-500 focus:border-sky-500 outline-hidden"
            >
              <option value="中心医院">中心医院 (总院医学检验中心)</option>
              <option value="东院区急诊化验室">东院区急诊化验室</option>
              <option value="滨江分院医学中心">滨江分院医学中心</option>
            </select>
          </div>

          {/* 2. 标本类型 */}
          <div className="flex items-center gap-1.5">
            <label className="text-slate-700 font-medium whitespace-nowrap">标本类型</label>
            <div className="relative">
              <input
                type="text"
                placeholder="输入标本名称/编码..."
                value={filterSpecimenName}
                onChange={(e) => setFilterSpecimenName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleQuery()}
                className="w-36 lg:w-44 h-7 px-2.5 bg-white border border-slate-300 rounded text-xs focus:ring-1 focus:ring-sky-500 focus:border-sky-500 outline-hidden"
              />
              {filterSpecimenName && (
                <button
                  onClick={() => setFilterSpecimenName('')}
                  className="absolute right-1.5 top-1.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* 3. whonet编码 */}
          <div className="flex items-center gap-1.5">
            <label className="text-slate-700 font-medium whitespace-nowrap">whonet编码</label>
            <div className="relative">
              <input
                type="text"
                placeholder="如: BLD, SPUT, UR"
                value={filterWhonetCode}
                onChange={(e) => setFilterWhonetCode(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleQuery()}
                className="w-28 lg:w-36 h-7 px-2.5 bg-white border border-slate-300 rounded text-xs font-mono uppercase focus:ring-1 focus:ring-sky-500 focus:border-sky-500 outline-hidden"
              />
              {filterWhonetCode && (
                <button
                  onClick={() => setFilterWhonetCode('')}
                  className="absolute right-1.5 top-1.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* 4. 采集方法 */}
          <div className="flex items-center gap-1.5">
            <label className="text-slate-700 font-medium whitespace-nowrap">采集方法</label>
            <div className="relative">
              <input
                type="text"
                placeholder="如: 末梢采血, 静脉采血"
                value={filterCollectionMethod}
                onChange={(e) => setFilterCollectionMethod(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleQuery()}
                className="w-32 lg:w-40 h-7 px-2.5 bg-white border border-slate-300 rounded text-xs focus:ring-1 focus:ring-sky-500 focus:border-sky-500 outline-hidden"
              />
              {filterCollectionMethod && (
                <button
                  onClick={() => setFilterCollectionMethod('')}
                  className="absolute right-1.5 top-1.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* 5. 状态筛选 */}
          <div className="flex items-center gap-1.5">
            <label className="text-slate-700 font-medium whitespace-nowrap">状态</label>
            <select
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="h-7 px-2 bg-white border border-slate-300 rounded text-xs text-slate-700 outline-hidden"
            >
              <option value="all">全部状态</option>
              <option value="启用">启用</option>
              <option value="停用">停用</option>
            </select>
          </div>

          {/* [查询] Button (matching screenshot blue outline/button) */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleQuery}
              className="h-7 px-4 bg-white hover:bg-sky-50 border border-sky-600 text-sky-700 rounded text-xs font-semibold shadow-2xs flex items-center gap-1 transition-colors"
            >
              <Search className="w-3 h-3 text-sky-600" />
              <span>查询</span>
            </button>
            {(filterSpecimenName || filterWhonetCode || filterCollectionMethod || filterStatus !== 'all') && (
              <button
                onClick={handleResetFilters}
                className="h-7 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded text-xs transition-colors"
              >
                清空筛选
              </button>
            )}
          </div>
        </div>

        {/* Action Buttons Row: [新增] (Solid blue), [导入] (Blue outline, matching screenshot) */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-100">
          <div className="flex items-center gap-2">
            {/* [新增] Solid blue button matching screenshot */}
            <button
              onClick={handleOpenAddModal}
              className="h-7 px-4 bg-[#0284c7] hover:bg-[#0369a1] text-white rounded text-xs font-semibold shadow-2xs flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>新增</span>
            </button>

            {/* [导入] Outline blue button matching screenshot */}
            <button
              onClick={() => setShowImportModal(true)}
              className="h-7 px-4 bg-white hover:bg-sky-50 border border-sky-600 text-sky-700 rounded text-xs font-semibold shadow-2xs flex items-center gap-1.5 transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-sky-600" />
              <span>导入</span>
            </button>

            {/* Export action */}
            <button
              onClick={() => triggerAction('已成功导出当前标本类型字典表 (Excel格式)')}
              className="h-7 px-3 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded text-xs font-medium shadow-2xs flex items-center gap-1 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>导出字典</span>
            </button>
          </div>

          <div className="flex items-center gap-3 text-slate-500 text-xs">
            <span>当前筛选结果: <strong className="font-mono text-sky-700">{filteredSpecimens.length}</strong> 条</span>
            <span className="text-slate-300">|</span>
            <span className="text-[11px] text-slate-400">单页显示固定: 10 条数据</span>
          </div>
        </div>
      </div>

      {/* 3. Main Master Table Workstation */}
      <div className="flex-1 flex flex-col min-h-0 p-3 overflow-hidden">
        <div className="flex-1 bg-white rounded-lg border border-slate-200 shadow-2xs flex flex-col overflow-hidden min-h-0">
          {/* Table Container */}
          <div className="flex-1 overflow-auto light-scrollbar">
            <table className="w-full min-w-[980px] border-collapse text-left whitespace-nowrap">
              {/* Header (matching screenshot: 标本类型编码, 标本类型, 采集方法, 状态, 操作) */}
              <thead className="bg-slate-50 sticky top-0 z-10 border-b border-slate-200 text-slate-700 font-semibold text-xs shadow-2xs">
                <tr>
                  <th className="px-3.5 py-2.5 w-14 text-center border-r border-slate-200 text-slate-400">#</th>
                  <th className="px-4 py-2.5 w-44 border-r border-slate-200 font-mono">标本类型编码</th>
                  <th className="px-4 py-2.5 w-44 border-r border-slate-200">标本类型</th>
                  <th className="px-4 py-2.5 w-44 border-r border-slate-200">采集方法</th>
                  <th className="px-3.5 py-2.5 w-32 border-r border-slate-200 font-mono">WHONET编码</th>
                  <th className="px-4 py-2.5 min-w-[200px] border-r border-slate-200">推荐采血管/容器</th>
                  <th className="px-3 py-2.5 w-24 border-r border-slate-200 text-center">状态</th>
                  <th className="px-3 py-2.5 w-24 border-r border-slate-200">维护人</th>
                  <th className="px-4 py-2.5 w-36 border-r border-slate-200 font-mono text-[11px]">更新时间</th>
                  <th className="px-4 py-2.5 w-32 text-center sticky right-0 bg-slate-50 z-20 shadow-xs">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-800">
                {paginatedSpecimens.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-16 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <FolderOpen className="w-8 h-8 text-slate-300 stroke-1" />
                        <span>未找到符合条件的标本类型数据</span>
                        <button
                          onClick={handleResetFilters}
                          className="mt-1 px-3 py-1 text-xs text-sky-600 hover:text-sky-800 border border-sky-300 rounded"
                        >
                          清空筛选条件
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedSpecimens.map((item, index) => {
                    const rowNumber = (currentPage - 1) * pageSize + index + 1;
                    const isInactive = item.status === '停用';

                    return (
                      <tr
                        key={item.id}
                        className={`hover:bg-sky-50/50 transition-colors group ${
                          isInactive ? 'bg-slate-50/40 text-slate-400' : ''
                        }`}
                      >
                        {/* Row Index */}
                        <td className="px-3.5 py-2.5 text-center font-mono text-slate-400 border-r border-slate-100">
                          {rowNumber}
                        </td>

                        {/* 1. 标本类型编码 (matching screenshot e.g. 124323423423) */}
                        <td className="px-4 py-2.5 font-mono font-medium text-slate-900 border-r border-slate-100">
                          <span className="font-semibold select-all text-slate-800">{item.code}</span>
                        </td>

                        {/* 2. 标本类型 (matching screenshot e.g. 血液, 痰液) */}
                        <td className="px-4 py-2.5 border-r border-slate-100 font-medium text-slate-900">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-800 text-[13px]">{item.name}</span>
                            {item.notes && (
                              <span
                                title={item.notes}
                                className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-500 font-normal hidden xl:inline-block max-w-[140px] truncate"
                              >
                                {item.notes}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* 3. 采集方法 (matching screenshot e.g. 末梢采血, [blank]) */}
                        <td className="px-4 py-2.5 border-r border-slate-100 text-slate-700">
                          {item.collectionMethod ? (
                            <span className="inline-flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                              {item.collectionMethod}
                            </span>
                          ) : (
                            <span className="text-slate-300">-</span>
                          )}
                        </td>

                        {/* 4. WHONET编码 */}
                        <td className="px-3.5 py-2.5 font-mono border-r border-slate-100">
                          {item.whonetCode ? (
                            <span className="px-1.5 py-0.5 rounded text-[11px] bg-slate-100 text-slate-700 font-bold border border-slate-200">
                              {item.whonetCode}
                            </span>
                          ) : (
                            <span className="text-slate-300">-</span>
                          )}
                        </td>

                        {/* 5. 推荐采血管/容器 */}
                        <td className="px-4 py-2.5 border-r border-slate-100 text-slate-600 text-xs">
                          {item.container}
                        </td>

                        {/* 6. 状态 (matching screenshot: 启用 (black/green), 停用 (red)) */}
                        <td className="px-3 py-2.5 text-center border-r border-slate-100">
                          {item.status === '启用' ? (
                            <span className="text-emerald-700 font-semibold px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200">
                              启用
                            </span>
                          ) : (
                            <span className="text-rose-600 font-bold px-2 py-0.5 rounded bg-rose-50 border border-rose-200">
                              停用
                            </span>
                          )}
                        </td>

                        {/* 7. 维护人 (真实人名: 张珊, 蔡文斌, 陈志远, 林德胜, 黄雅芳) */}
                        <td className="px-3 py-2.5 border-r border-slate-100 font-medium text-slate-700">
                          {item.operator}
                        </td>

                        {/* 8. 更新时间 (近期: 2026-10-29) */}
                        <td className="px-4 py-2.5 border-r border-slate-100 font-mono text-[11px] text-slate-500">
                          {item.updateTime}
                        </td>

                        {/* 9. 操作 (matching screenshot: 编辑 删除 停用 / 编辑 删除 启用) */}
                        <td className="px-4 py-2.5 text-center sticky right-0 bg-white group-hover:bg-sky-50/50 shadow-xs z-10">
                          <div className="flex items-center justify-center gap-2 text-xs">
                            {/* [编辑] text link matching screenshot */}
                            <button
                              onClick={() => handleOpenEditModal(item)}
                              className="text-sky-600 hover:text-sky-800 font-medium transition-colors"
                            >
                              编辑
                            </button>

                            {/* [删除] text link matching screenshot */}
                            <button
                              onClick={() => setItemToDelete(item)}
                              className="text-sky-600 hover:text-rose-600 font-medium transition-colors"
                            >
                              删除
                            </button>

                            {/* [停用 / 启用] text link matching screenshot */}
                            <button
                              onClick={() => handleToggleStatus(item)}
                              className={`font-medium transition-colors ${
                                item.status === '启用'
                                  ? 'text-sky-600 hover:text-rose-600'
                                  : 'text-sky-600 hover:text-emerald-600'
                              }`}
                            >
                              {item.status === '启用' ? '停用' : '启用'}
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

          {/* 4. Bottom Footer & Pagination Bar (Strict Requirement: "一页帮我显示10条数据") */}
          <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
            {/* Left: 合计 (matching screenshot: '合计: 2条') */}
            <div className="flex items-center gap-4 text-xs text-slate-600">
              <span className="font-semibold text-slate-800">
                合计: <span className="font-mono text-sky-700 font-bold">{totalItems}</span> 条
              </span>
              <span className="text-slate-300">|</span>
              <span className="text-slate-500">
                当前第 <strong className="font-mono text-slate-800">{currentPage}</strong> / {totalPages} 页
                （显示第 {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, totalItems)} 条）
              </span>
            </div>

            {/* Right: Pagination Controls (Exact 10 per page) */}
            <div className="flex items-center gap-2">
              {/* Page size select (Defaulting to 10) */}
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mr-2">
                <span>每页:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    const newSize = Number(e.target.value);
                    setPageSize(newSize);
                    setCurrentPage(1);
                  }}
                  className="h-6 px-1.5 bg-white border border-slate-300 rounded text-xs text-slate-700 outline-hidden font-mono"
                >
                  <option value={10}>10 条/页 (默认)</option>
                  <option value={20}>20 条/页</option>
                  <option value={50}>50 条/页</option>
                </select>
              </div>

              {/* Prev Button */}
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="h-7 px-2.5 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white border border-slate-300 text-slate-700 rounded text-xs font-medium shadow-2xs flex items-center gap-1 transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>上一页</span>
              </button>

              {/* Page numbers */}
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                  const isCurrent = p === currentPage;
                  return (
                    <button
                      key={p}
                      onClick={() => setCurrentPage(p)}
                      className={`w-7 h-7 rounded text-xs font-mono font-medium transition-colors ${
                        isCurrent
                          ? 'bg-sky-600 text-white font-bold shadow-2xs'
                          : 'bg-white hover:bg-slate-100 border border-slate-300 text-slate-700'
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>

              {/* Next Button */}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className="h-7 px-2.5 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white border border-slate-300 text-slate-700 rounded text-xs font-medium shadow-2xs flex items-center gap-1 transition-colors"
              >
                <span>下一页</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 5. ADD / EDIT SPECIMEN MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col animate-scaleUp">
            {/* Modal Header */}
            <div className="px-5 py-3.5 bg-gradient-to-r from-sky-700 to-sky-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Table2 className="w-4 h-4" />
                <h3 className="font-bold text-sm tracking-wide">
                  {editingItem ? '编辑标本类型' : '新增标本类型'}
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 hover:bg-white/20 rounded-md text-white/80 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveForm} className="p-5 space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                {/* 标本类型编码 */}
                <div>
                  <label className="block text-slate-700 font-medium mb-1">
                    <span className="text-rose-500 font-bold mr-0.5">*</span>标本类型编码
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="如: 124323423423"
                    required
                    className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded text-xs font-mono font-semibold focus:ring-1 focus:ring-sky-500 focus:border-sky-500 outline-hidden"
                  />
                </div>

                {/* 标本类型名称 */}
                <div>
                  <label className="block text-slate-700 font-medium mb-1">
                    <span className="text-rose-500 font-bold mr-0.5">*</span>标本类型名称
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="如: 血液, 痰液, 尿液"
                    required
                    className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded text-xs font-medium focus:ring-1 focus:ring-sky-500 focus:border-sky-500 outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* WHONET编码 */}
                <div>
                  <label className="block text-slate-700 font-medium mb-1">
                    WHONET编码
                  </label>
                  <input
                    type="text"
                    value={formData.whonetCode}
                    onChange={(e) => setFormData({ ...formData, whonetCode: e.target.value })}
                    placeholder="如: BLD, SPUT, UR, CSF"
                    className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded text-xs font-mono uppercase focus:ring-1 focus:ring-sky-500 focus:border-sky-500 outline-hidden"
                  />
                </div>

                {/* 采集方法 */}
                <div>
                  <label className="block text-slate-700 font-medium mb-1">
                    采集方法
                  </label>
                  <input
                    type="text"
                    value={formData.collectionMethod}
                    onChange={(e) => setFormData({ ...formData, collectionMethod: e.target.value })}
                    placeholder="如: 末梢采血, 静脉采血"
                    className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded text-xs focus:ring-1 focus:ring-sky-500 focus:border-sky-500 outline-hidden"
                  />
                </div>
              </div>

              {/* 推荐采血管/容器 */}
              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  推荐采血管 / 容器规格
                </label>
                <input
                  type="text"
                  value={formData.container}
                  onChange={(e) => setFormData({ ...formData, container: e.target.value })}
                  placeholder="如: 紫头管 (EDTA-K2 抗凝管 2.0ml)"
                  className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded text-xs focus:ring-1 focus:ring-sky-500 focus:border-sky-500 outline-hidden"
                />
              </div>

              {/* 归属科室/专业组 & 状态 */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">归属专业组</label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    placeholder="如: 临检常规/生化免流水线"
                    className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded text-xs focus:ring-1 focus:ring-sky-500 focus:border-sky-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">状态</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as '启用' | '停用' })}
                    className="w-full h-8 px-2 bg-white border border-slate-300 rounded text-xs font-medium focus:ring-1 focus:ring-sky-500 focus:border-sky-500 outline-hidden"
                  >
                    <option value="启用">启用 (正常流转)</option>
                    <option value="停用">停用 (不可选)</option>
                  </select>
                </div>
              </div>

              {/* 临床应用说明 */}
              <div>
                <label className="block text-slate-700 font-medium mb-1">应用说明与质控要求</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="输入此标本类型的采样规范、送检时限与保存温度要求..."
                  className="w-full p-2 bg-white border border-slate-300 rounded text-xs leading-relaxed focus:ring-1 focus:ring-sky-500 focus:border-sky-500 outline-hidden resize-none"
                />
              </div>

              {/* Footer Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 rounded text-xs font-medium transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{editingItem ? '保存修改' : '确认新增'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. BATCH IMPORT MODAL */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden flex flex-col animate-scaleUp">
            <div className="px-5 py-3.5 bg-slate-800 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-sm tracking-wide">批量导入标本类型字典</h3>
              </div>
              <button
                onClick={() => setShowImportModal(false)}
                className="p-1 hover:bg-white/20 rounded-md text-white/80 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="bg-sky-50 border border-sky-200 rounded-lg p-3 text-xs text-sky-900 leading-relaxed">
                <p className="font-medium mb-1">📌 导入格式要求：</p>
                <p>支持 Excel (.xlsx) 或 CSV 文件导入，包含：标本编码、标本名称、WHONET代码、采集方法、采血管容器等必填列。</p>
              </div>

              <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-sky-500 cursor-pointer bg-slate-50 transition-colors">
                <FileSpreadsheet className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                <p className="text-xs font-medium text-slate-700">点击上传或将字典文件拖拽至此</p>
                <p className="text-[11px] text-slate-400 mt-1">支持国家卫健委临检标准标准模板</p>
              </div>

              <div className="flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => triggerAction('已下载标本类型标准字典 Excel 模版')}
                  className="text-sky-600 hover:text-sky-800 underline"
                >
                  下载标本字典导入模板.xlsx
                </button>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => setShowImportModal(false)}
                  className="px-4 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 rounded text-xs font-medium transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleImportSampleData}
                  className="px-5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded text-xs font-semibold shadow-xs transition-colors"
                >
                  立即导入
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. DELETE CONFIRMATION MODAL */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-sm w-full p-5 space-y-4 animate-scaleUp">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">确认删除标本类型？</h4>
                <p className="text-xs text-slate-500">删除后不可恢复，请谨慎操作</p>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs space-y-1">
              <div>
                <span className="text-slate-500">标本编码: </span>
                <span className="font-mono font-bold text-slate-900">{itemToDelete.code}</span>
              </div>
              <div>
                <span className="text-slate-500">标本名称: </span>
                <span className="font-semibold text-slate-900">{itemToDelete.name}</span>
              </div>
              <div>
                <span className="text-slate-500">WHONET: </span>
                <span className="font-mono text-slate-700">{itemToDelete.whonetCode}</span>
              </div>
              <div>
                <span className="text-slate-500">采集方法: </span>
                <span className="text-slate-700">{itemToDelete.collectionMethod || '未填写'}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setItemToDelete(null)}
                className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 rounded text-xs font-medium transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded text-xs font-semibold shadow-xs transition-colors"
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
