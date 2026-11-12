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
  ListFilter
} from './MenuIcon';
import { UserProfile } from '../types/navigation';
import {
  OperationDictCategory,
  OperationDictItem,
  INITIAL_OPERATION_DICTIONARIES,
} from '../data/operationDictionaryData';

interface OperationDictionaryViewProps {
  user: UserProfile;
  triggerAction: (msg: string) => void;
}

export const OperationDictionaryView: React.FC<OperationDictionaryViewProps> = ({
  user,
  triggerAction,
}) => {
  // Left side active dictionary category (Requirement: "点击左侧的，右侧内容会跟着变化")
  const [activeCategory, setActiveCategory] = useState<OperationDictCategory>('采集方式');

  // Top Filter Bar States (Matching screenshot: 单位名称, 值名称, [显示停用])
  const [selectedHospitalUnit, setSelectedHospitalUnit] = useState<string>('中心医院');
  const [filterKeyword, setFilterKeyword] = useState<string>('');
  const [showDisabledOnly, setShowDisabledOnly] = useState<boolean>(false);

  // Master Operation Dictionaries dataset
  const [dictItems, setDictItems] = useState<OperationDictItem[]>(INITIAL_OPERATION_DICTIONARIES);

  // Pagination states (Requirement: 一页帮我显示10条数据)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Modal Dialog States
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<OperationDictItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<OperationDictItem | null>(null);

  // Form State (Blank fields for Add Modal)
  const [formData, setFormData] = useState({
    category: '采集方式' as OperationDictCategory,
    code: '',
    name: '',
    explanation: '',
    status: '启用' as '启用' | '停用',
  });

  // Dictionary Categories List (Matching screenshot left menu)
  const categoriesList: OperationDictCategory[] = [
    '采集方式',
    '采集部位',
    '标本外观',
    '不合格理由',
    '试验方法',
    '复检原因',
    '检验备注',
    '通知忽略',
  ];

  // Filtered dataset for currently active category
  const filteredItems = useMemo(() => {
    return dictItems.filter((item) => {
      // 1. Category Filter
      if (item.category !== activeCategory) {
        return false;
      }
      // 2. Search Keyword (Code, Name, Explanation)
      if (filterKeyword.trim()) {
        const kw = filterKeyword.trim().toLowerCase();
        const matchCode = item.code.toLowerCase().includes(kw);
        const matchName = item.name.toLowerCase().includes(kw);
        const matchExp = item.explanation.toLowerCase().includes(kw);
        if (!matchCode && !matchName && !matchExp) {
          return false;
        }
      }
      // 3. Show Disabled
      if (showDisabledOnly && item.status !== '停用') {
        return false;
      }

      return true;
    });
  }, [dictItems, activeCategory, filterKeyword, showDisabledOnly]);

  // Pagination calculation
  const totalItems = filteredItems.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredItems.slice(startIndex, startIndex + pageSize);
  }, [filteredItems, currentPage, pageSize]);

  // Query handler
  const handleQuery = () => {
    setCurrentPage(1);
    triggerAction(`已完成对 [${activeCategory}] 码值列表的检索`);
  };

  // Reset Filters
  const handleResetFilters = () => {
    setFilterKeyword('');
    setShowDisabledOnly(false);
    setCurrentPage(1);
    triggerAction('已重置查询条件');
  };

  // Open Add Modal (Blank fields so user enters fresh data)
  const handleOpenAddModal = () => {
    setEditingItem(null);

    // Auto generate next code
    const existingCodes = dictItems
      .filter((i) => i.category === activeCategory)
      .map((i) => parseInt(i.code, 10))
      .filter((n) => !isNaN(n));
    const nextCodeNum = existingCodes.length > 0 ? Math.max(...existingCodes) + 1 : 1;
    const autoCode = String(nextCodeNum).padStart(3, '0');

    setFormData({
      category: activeCategory,
      code: autoCode,
      name: '',
      explanation: '',
      status: '启用',
    });
    setShowAddModal(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (item: OperationDictItem) => {
    setEditingItem(item);
    setFormData({
      category: item.category,
      code: item.code,
      name: item.name,
      explanation: item.explanation,
      status: item.status,
    });
    setShowAddModal(true);
  };

  // Save Add/Edit
  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code.trim()) {
      triggerAction('请输入编码');
      return;
    }
    if (!formData.name.trim()) {
      triggerAction('请输入名称');
      return;
    }

    const nowTime = '2026-10-29 10:30:00';
    const operatorName = user.name || '张珊';

    if (editingItem) {
      // Edit
      setDictItems((prev) =>
        prev.map((i) =>
          i.id === editingItem.id
            ? {
                ...i,
                category: formData.category,
                code: formData.code.trim(),
                name: formData.name.trim(),
                explanation: formData.explanation.trim(),
                status: formData.status,
                updateTime: nowTime,
                operator: operatorName,
              }
            : i
        )
      );
      triggerAction(`已更新操作字典 [${formData.code}] ${formData.name}`);
    } else {
      // Add
      const newItem: OperationDictItem = {
        id: `op-${Date.now()}`,
        category: formData.category,
        code: formData.code.trim(),
        name: formData.name.trim(),
        explanation: formData.explanation.trim(),
        status: formData.status,
        updateTime: nowTime,
        operator: operatorName,
      };
      setDictItems((prev) => [newItem, ...prev]);
      triggerAction(`已成功新增 [${formData.category}] 条目：${newItem.name}`);
    }

    setShowAddModal(false);
  };

  // Toggle status
  const handleToggleStatus = (item: OperationDictItem) => {
    const nextStatus = item.status === '启用' ? '停用' : '启用';
    const nowTime = '2026-10-29 10:35:00';
    const operatorName = user.name || '张珊';

    setDictItems((prev) =>
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

    triggerAction(`[${item.name}] 状态已切换为【${nextStatus}】`);
  };

  // Confirm Delete
  const handleConfirmDelete = () => {
    if (!itemToDelete) return;
    setDictItems((prev) => prev.filter((i) => i.id !== itemToDelete.id));
    triggerAction(`已删除操作字典条目 [${itemToDelete.name}]`);
    setItemToDelete(null);
  };

  return (
    <div className="flex-1 flex h-full min-h-0 bg-slate-100 overflow-hidden text-slate-800 text-xs">
      {/* 1. Left Vertical Menu: 字典类型 (Matching screenshot left menu image_53b626bb.png) */}
      <div className="w-44 bg-white border-r border-slate-200 shrink-0 flex flex-col p-2 space-y-1 select-none shadow-2xs">
        <div className="px-3 py-2 text-[11px] font-bold text-sky-700 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 mb-1">
          <ListFilter className="w-4 h-4 text-sky-600" />
          字典类型
        </div>

        <div className="flex-1 overflow-y-auto space-y-1 pr-1">
          {categoriesList.map((cat) => {
            const isSelected = activeCategory === cat;
            const count = dictItems.filter((i) => i.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setCurrentPage(1);
                  triggerAction(`已切换至【${cat}】字典`);
                }}
                className={`w-full px-3 py-2 rounded text-left font-medium transition-all flex items-center justify-between group ${
                  isSelected
                    ? 'bg-sky-600 text-white font-semibold shadow-2xs'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="pt-2 border-t border-slate-100 p-2 text-[10px] text-slate-400">
          点击左侧字典类型，右侧码值列表将实时更新。
        </div>
      </div>

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Filter Bar (Matching screenshot: 单位名称, 值名称, [显示停用], [查询], [新增]) */}
        <div className="bg-white border-b border-slate-200 p-3 shrink-0 shadow-2xs space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            {/* 单位名称 */}
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

            {/* 值名称 */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-600 font-medium whitespace-nowrap">值名称:</span>
              <div className="relative">
                <input
                  type="text"
                  value={filterKeyword}
                  onChange={(e) => setFilterKeyword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleQuery()}
                  placeholder="请输入编码 / 名称 / 说明..."
                  className="bg-white border border-slate-300 rounded px-2 py-1 text-xs w-52 focus:ring-1 focus:ring-sky-500 outline-none pr-6"
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

            {/* 显示停用 */}
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

            {/* 查询 & 新增 buttons (Matching screenshot style) */}
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
              <button
                onClick={handleOpenAddModal}
                className="px-3.5 py-1 bg-sky-600 hover:bg-sky-700 text-white rounded font-medium shadow-2xs transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                新增
              </button>
            </div>
          </div>
        </div>

        {/* 3. Main Code Value Table (码值列表 matching image_53b626bb.png) */}
        <div className="flex-1 p-3 min-h-0 overflow-hidden flex flex-col">
          <div className="bg-white border border-slate-200 rounded-lg shadow-2xs flex-1 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="bg-slate-100/90 border-b border-slate-200 px-4 py-2.5 flex items-center justify-between shrink-0">
              <h3 className="font-semibold text-sky-700 flex items-center gap-2">
                <Table2 className="w-4 h-4 text-sky-600" />
                <span>码值列表</span>
                <span className="text-slate-400 font-normal">|</span>
                <span className="text-slate-800 bg-sky-100/80 px-2 py-0.5 rounded text-xs">
                  {activeCategory}
                </span>
              </h3>
              <span className="text-[11px] text-slate-500">
                当前列表展示【{activeCategory}】对应的标准化维护条目
              </span>
            </div>

            {/* Table Area */}
            <div className="flex-1 overflow-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 sticky top-0 z-10">
                    <th className="py-2.5 px-3 border-r border-slate-200 w-24">编码</th>
                    <th className="py-2.5 px-3 border-r border-slate-200 w-48">名称</th>
                    <th className="py-2.5 px-3 border-r border-slate-200">说明</th>
                    <th className="py-2.5 px-3 border-r border-slate-200 text-center w-20">状态</th>
                    <th className="py-2.5 px-3 border-r border-slate-200 w-36">更新时间</th>
                    <th className="py-2.5 px-3 border-r border-slate-200 w-24">操作人</th>
                    <th className="py-2.5 px-3 text-center w-28">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedItems.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400">
                        暂无 【{activeCategory}】 码值字典记录，可点击右上角【+ 新增】添加
                      </td>
                    </tr>
                  ) : (
                    paginatedItems.map((item) => (
                      <tr
                        key={item.id}
                        className={`hover:bg-sky-50/60 transition-colors ${
                          item.status === '停用' ? 'bg-slate-50/50 text-slate-400' : ''
                        }`}
                      >
                        <td className="py-2.5 px-3 border-r border-slate-100 font-mono font-semibold text-slate-800">
                          {item.code}
                        </td>
                        <td className="py-2.5 px-3 border-r border-slate-100 font-medium text-sky-700">
                          {item.name}
                        </td>
                        <td className="py-2.5 px-3 border-r border-slate-100 text-slate-600">
                          {item.explanation || '-'}
                        </td>
                        <td className="py-2.5 px-3 border-r border-slate-100 text-center">
                          {item.status === '启用' ? (
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
                          {item.updateTime}
                        </td>
                        <td className="py-2.5 px-3 border-r border-slate-100 text-slate-600">
                          {item.operator}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleOpenEditModal(item)}
                              className="text-sky-600 hover:text-sky-800 hover:underline font-medium"
                            >
                              编辑
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
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer (Requirement: 一页帮我显示10条数据) */}
            <div className="bg-slate-50 border-t border-slate-200 px-4 py-2.5 flex items-center justify-between shrink-0">
              <span className="text-sky-700 font-semibold">合计: {totalItems} 条</span>

              <div className="flex items-center gap-2">
                <span className="text-slate-500 text-[11px]">
                  第 {currentPage} / {totalPages} 页
                </span>
                <div className="flex items-center gap-1">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="px-2.5 py-1 bg-white border border-slate-300 rounded text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 flex items-center gap-1"
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
                    className="px-2.5 py-1 bg-white border border-slate-300 rounded text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 flex items-center gap-1"
                  >
                    下一页
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* Modal: Add / Edit Operation Dict (Clear fields on Add) */}
      {/* ========================================================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-sky-700 text-white px-5 py-3.5 flex items-center justify-between shrink-0">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <Plus className="w-4 h-4" />
                {editingItem ? '编辑操作字典码值' : `新增码值字典 (${formData.category})`}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-white/80 hover:text-white transition-colors p-1 rounded hover:bg-sky-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="p-5 space-y-4">
              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  <span className="text-rose-500">*</span> 字典类型
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      category: e.target.value as any,
                    }))
                  }
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-sky-500 outline-none bg-slate-50"
                >
                  {categoriesList.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  <span className="text-rose-500">*</span> 编码
                </label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      code: e.target.value,
                    }))
                  }
                  placeholder="例如: 001"
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs font-mono focus:ring-1 focus:ring-sky-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  <span className="text-rose-500">*</span> 名称
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  placeholder="例如: 静脉采血 / 重度溶血"
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-sky-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">说明 / 临床意义</label>
                <textarea
                  rows={3}
                  value={formData.explanation}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      explanation: e.target.value,
                    }))
                  }
                  placeholder="请详细描述该操作字典码值的适用范围或规范..."
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-sky-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">状态</label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      status: e.target.value as any,
                    }))
                  }
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-sky-500 outline-none"
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
                  保存字典
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
              <h3 className="font-semibold text-sm">确认删除字典条目?</h3>
            </div>
            <p className="text-xs text-slate-600">
              您确定要删除 【{itemToDelete.category}】 下的码值条目 <strong className="text-slate-800">[{itemToDelete.code}] {itemToDelete.name}</strong> 吗？
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
