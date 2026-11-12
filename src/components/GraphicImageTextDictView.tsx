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
  FileText,
  CheckCircle2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Folder,
  FolderOpen,
  ChevronDown,
  ChevronRight as ChevronRightIcon,
  Sparkles,
  User,
  Clock,
  Filter
} from 'lucide-react';
import {
  GraphicCellDictItem,
  INITIAL_CELL_DICT_ITEMS
} from '../data/graphicCellDictData';
import { UserProfile } from '../types/navigation';

interface GraphicImageTextDictViewProps {
  user?: UserProfile;
  triggerAction: (msg: string) => void;
}

export const GraphicImageTextDictView: React.FC<GraphicImageTextDictViewProps> = ({
  user,
  triggerAction,
}) => {
  // Master Dataset State
  const [items, setItems] = useState<GraphicCellDictItem[]>(INITIAL_CELL_DICT_ITEMS);

  // 1. Left Catalog State (字典目录)
  const [catalogFilterKeyword, setCatalogFilterKeyword] = useState('');
  const [activeCatalog, setActiveCatalog] = useState('骨髓细胞字典');

  // 2. Left Tree Category State (细胞分类)
  const [activeCategory, setActiveCategory] = useState('全部分类');
  const [activeSubCategory, setActiveSubCategory] = useState<string | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<string[]>(['粒细胞系统']);

  // 3. Right Toolbar Filters
  const [cellNameFilter, setCellNameFilter] = useState('');
  const [showDisabledOnly, setShowDisabledOnly] = useState(false);

  // 4. Pagination State (Strict requirement: 10 items per page)
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Modals state
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<GraphicCellDictItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<GraphicCellDictItem | null>(null);

  // Form State for Add / Edit Modal
  const [formData, setFormData] = useState({
    catalog: '骨髓细胞字典',
    category: '粒细胞系统',
    subCategory: '中性',
    cellName: '',
    hotkey: '',
    marrowCode: '',
    bloodCode: '',
    meanValue: '0.00',
    sdValue: '0.00',
    status: '启用' as '启用' | '停用',
  });

  // Catalogs List
  const catalogsList = [
    '骨髓细胞字典',
    '尿沉渣细胞字典',
    '脱落细胞字典',
    '组化染色字典',
    '形态描述模板字典',
  ];

  const filteredCatalogs = useMemo(() => {
    return catalogsList.filter(c =>
      c.toLowerCase().includes(catalogFilterKeyword.trim().toLowerCase())
    );
  }, [catalogFilterKeyword]);

  // Tree Category Nodes for Active Catalog
  const treeNodes = [
    {
      id: '粒细胞系统',
      label: '粒细胞系统',
      children: ['中性', '嗜酸性', '嗜碱性'],
    },
    { id: '红细胞系统', label: '红细胞系统' },
    { id: '淋巴细胞系统', label: '淋巴细胞系统' },
    { id: '单核细胞系统', label: '单核细胞系统' },
    { id: '浆细胞系统', label: '浆细胞系统' },
    { id: '巨核细胞系统', label: '巨核细胞系统' },
    { id: '其他细胞', label: '其他细胞' },
  ];

  // Toggle tree node expand
  const toggleExpand = (nodeId: string) => {
    setExpandedNodes(prev =>
      prev.includes(nodeId) ? prev.filter(n => n !== nodeId) : [...prev, nodeId]
    );
  };

  // Filtered Cell Items for Right Table
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      // 1. Catalog filter
      if (item.catalog !== activeCatalog) return false;

      // 2. Tree Category filter
      if (activeCategory !== '全部分类') {
        if (item.category !== activeCategory) return false;
        if (activeSubCategory && item.subCategory !== activeSubCategory) return false;
      }

      // 3. Right search filter (Cell Name, Hotkey, Marrow Code)
      if (cellNameFilter.trim()) {
        const kw = cellNameFilter.trim().toLowerCase();
        const matchName = item.cellName.toLowerCase().includes(kw);
        const matchHotkey = item.hotkey.toLowerCase().includes(kw);
        const matchMarrow = item.marrowCode.toLowerCase().includes(kw);
        const matchBlood = item.bloodCode.toLowerCase().includes(kw);
        if (!matchName && !matchHotkey && !matchMarrow && !matchBlood) return false;
      }

      // 4. Show disabled only
      if (showDisabledOnly && item.status !== '停用') return false;

      return true;
    });
  }, [items, activeCatalog, activeCategory, activeSubCategory, cellNameFilter, showDisabledOnly]);

  // Paginated data
  const totalPages = Math.ceil(filteredItems.length / pageSize) || 1;
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredItems.slice(start, start + pageSize);
  }, [filteredItems, currentPage, pageSize]);

  // Handlers
  const handleSelectCatalog = (catalog: string) => {
    setActiveCatalog(catalog);
    setActiveCategory('全部分类');
    setActiveSubCategory(null);
    setCurrentPage(1);
  };

  const handleSelectCategory = (category: string, subCat: string | null = null) => {
    setActiveCategory(category);
    setActiveSubCategory(subCat);
    setCurrentPage(1);
  };

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormData({
      catalog: activeCatalog,
      category: activeCategory === '全部分类' ? '粒细胞系统' : activeCategory,
      subCategory: activeSubCategory || '中性',
      cellName: '',
      hotkey: '',
      marrowCode: '',
      bloodCode: '',
      meanValue: '0.00',
      sdValue: '0.00',
      status: '启用',
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (item: GraphicCellDictItem) => {
    setEditingItem(item);
    setFormData({
      catalog: item.catalog,
      category: item.category,
      subCategory: item.subCategory || '中性',
      cellName: item.cellName,
      hotkey: item.hotkey,
      marrowCode: item.marrowCode,
      bloodCode: item.bloodCode,
      meanValue: item.meanValue.toString(),
      sdValue: item.sdValue.toString(),
      status: item.status,
    });
    setShowModal(true);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.cellName.trim()) {
      alert('请输入细胞名称');
      return;
    }

    const nowStr = '2026-10-30 14:00';
    const creatorName = user?.name ? `${user.name}主管` : '魏主任';

    if (editingItem) {
      setItems(prev =>
        prev.map(i =>
          i.id === editingItem.id
            ? {
                ...i,
                catalog: formData.catalog,
                category: formData.category,
                subCategory: formData.subCategory,
                cellName: formData.cellName,
                hotkey: formData.hotkey,
                marrowCode: formData.marrowCode,
                bloodCode: formData.bloodCode,
                meanValue: parseFloat(formData.meanValue) || 0,
                sdValue: parseFloat(formData.sdValue) || 0,
                status: formData.status,
                updateTime: nowStr,
              }
            : i
        )
      );
      triggerAction(`已保存细胞字典项 [${formData.cellName}] 修改！`);
    } else {
      const newItem: GraphicCellDictItem = {
        id: `CD-${Date.now()}`,
        catalog: formData.catalog,
        category: formData.category,
        subCategory: formData.subCategory,
        cellName: formData.cellName,
        hotkey: formData.hotkey,
        marrowCode: formData.marrowCode,
        bloodCode: formData.bloodCode,
        meanValue: parseFloat(formData.meanValue) || 0,
        sdValue: parseFloat(formData.sdValue) || 0,
        creator: creatorName,
        updateTime: nowStr,
        status: formData.status,
      };
      setItems(prev => [newItem, ...prev]);
      triggerAction(`成功新增细胞字典项 [${formData.cellName}]！`);
    }

    setShowModal(false);
  };

  const handleConfirmDelete = () => {
    if (!itemToDelete) return;
    setItems(prev => prev.filter(i => i.id !== itemToDelete.id));
    triggerAction(`已成功删除细胞字典项 [${itemToDelete.cellName}]！`);
    setItemToDelete(null);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-800 font-sans p-4 overflow-y-auto space-y-4">
      {/* Main 3-Column / 2-Column Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-full min-h-[640px]">
        {/* Column 1: 字典目录 (Catalog Panel - 2 cols) */}
        <div className="lg:col-span-3 bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs flex flex-col space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
              <Folder className="w-4 h-4 text-sky-600" />
              <span>字典目录</span>
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">{catalogsList.length}个</span>
          </div>

          {/* Catalog Filter Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="输入名称过滤..."
              value={catalogFilterKeyword}
              onChange={e => setCatalogFilterKeyword(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all placeholder:text-slate-400"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>

          {/* Catalog List */}
          <div className="flex-1 overflow-y-auto space-y-1 text-xs">
            {filteredCatalogs.map(catalog => {
              const isSelected = activeCatalog === catalog;
              return (
                <button
                  key={catalog}
                  onClick={() => handleSelectCatalog(catalog)}
                  className={`w-full text-left px-3 py-2 rounded-lg font-medium transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-sky-50 text-sky-700 border border-sky-200 shadow-2xs font-bold'
                      : 'text-slate-700 hover:bg-slate-100/80 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {isSelected ? (
                      <FolderOpen className="w-4 h-4 text-sky-600 shrink-0" />
                    ) : (
                      <Folder className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                    <span>{catalog}</span>
                  </div>
                  {isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-600 animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Column 2: 细胞分类 (Category Tree Panel - 3 cols) */}
        <div className="lg:col-span-3 bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs flex flex-col space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
              <Table2 className="w-4 h-4 text-indigo-600" />
              <span>细胞分类</span>
            </h3>
            <button
              onClick={() => {
                setActiveCategory('全部分类');
                setActiveSubCategory(null);
              }}
              className={`text-[11px] px-2 py-0.5 rounded font-medium transition-colors ${
                activeCategory === '全部分类'
                  ? 'bg-sky-100 text-sky-700 font-bold'
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              全部
            </button>
          </div>

          {/* Classification Tree */}
          <div className="flex-1 overflow-y-auto space-y-1 text-xs font-sans">
            {/* All items node */}
            <button
              onClick={() => handleSelectCategory('全部分类')}
              className={`w-full text-left px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-2 ${
                activeCategory === '全部分类'
                  ? 'bg-slate-100 text-sky-700 font-bold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <span>● 全部分类列表</span>
            </button>

            {/* Tree Nodes */}
            {treeNodes.map(node => {
              const isSelected = activeCategory === node.id && !activeSubCategory;
              const isExpanded = expandedNodes.includes(node.id);
              const hasChildren = node.children && node.children.length > 0;

              return (
                <div key={node.id} className="space-y-0.5">
                  <div
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded-md cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-sky-50 text-sky-700 font-bold border-l-2 border-sky-600'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                    onClick={() => {
                      handleSelectCategory(node.id);
                      if (hasChildren) toggleExpand(node.id);
                    }}
                  >
                    <div className="flex items-center gap-1.5">
                      {hasChildren ? (
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            toggleExpand(node.id);
                          }}
                          className="p-0.5 text-slate-400 hover:text-slate-700"
                        >
                          {isExpanded ? (
                            <ChevronDown className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronRightIcon className="w-3.5 h-3.5" />
                          )}
                        </button>
                      ) : (
                        <span className="w-3.5 h-3.5 inline-block" />
                      )}
                      <span>{node.label}</span>
                    </div>
                  </div>

                  {/* Children Sub-nodes */}
                  {hasChildren && isExpanded && (
                    <div className="pl-6 space-y-0.5 border-l border-slate-100 ml-3">
                      {node.children!.map(sub => {
                        const isSubSelected =
                          activeCategory === node.id && activeSubCategory === sub;
                        return (
                          <button
                            key={sub}
                            onClick={() => handleSelectCategory(node.id, sub)}
                            className={`w-full text-left px-2.5 py-1 rounded text-[11px] transition-colors ${
                              isSubSelected
                                ? 'bg-sky-100 text-sky-800 font-bold'
                                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                            }`}
                          >
                            └─ {sub}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Column 3: 细胞列表 (Right Table & Toolbar Panel - 6 cols) */}
        <div className="lg:col-span-6 bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs flex flex-col space-y-3">
          {/* Top Filter & Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs pb-2 border-b border-slate-100">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500 font-medium whitespace-nowrap">项目名称:</span>
                <input
                  type="text"
                  placeholder="搜索细胞名、快捷键、代码..."
                  value={cellNameFilter}
                  onChange={e => {
                    setCellNameFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-48 px-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all placeholder:text-slate-400"
                />
              </div>

              <label className="flex items-center gap-1.5 text-slate-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={showDisabledOnly}
                  onChange={e => {
                    setShowDisabledOnly(e.target.checked);
                    setCurrentPage(1);
                  }}
                  className="rounded border-slate-300 text-sky-600 focus:ring-sky-500 cursor-pointer"
                />
                <span>显示停用</span>
              </label>
            </div>

            <button
              onClick={handleOpenAddModal}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 text-white rounded-lg hover:bg-sky-700 font-medium transition-colors shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>新增字典项</span>
            </button>
          </div>

          {/* Cell List Table */}
          <div className="flex-1 overflow-x-auto border border-slate-200/80 rounded-lg">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/90 text-slate-700 font-semibold border-b border-slate-200">
                  <th className="py-2.5 px-3">细胞名称</th>
                  <th className="py-2.5 px-3 text-center">热键</th>
                  <th className="py-2.5 px-3 font-mono">髓片代码</th>
                  <th className="py-2.5 px-3 font-mono">血片代码</th>
                  <th className="py-2.5 px-3 text-right">平均值</th>
                  <th className="py-2.5 px-3 text-right">标准差</th>
                  <th className="py-2.5 px-3">状态</th>
                  <th className="py-2.5 px-3 text-center">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {paginatedItems.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <FileText className="w-8 h-8 text-slate-300 stroke-1" />
                        <span>当前分类下暂无该细胞字典记录</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedItems.map(item => (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="py-2 px-3 font-bold text-slate-900">
                        {item.cellName}
                      </td>
                      <td className="py-2 px-3 text-center">
                        <span className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded font-mono text-[11px] font-bold text-slate-700">
                          {item.hotkey || '-'}
                        </span>
                      </td>
                      <td className="py-2 px-3 font-mono text-slate-600">{item.marrowCode}</td>
                      <td className="py-2 px-3 font-mono text-slate-600">{item.bloodCode}</td>
                      <td className="py-2 px-3 text-right font-mono text-slate-800">{item.meanValue.toFixed(2)}</td>
                      <td className="py-2 px-3 text-right font-mono text-slate-500">{item.sdValue.toFixed(2)}</td>
                      <td className="py-2 px-3">
                        {item.status === '启用' ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            启用
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-500 border border-slate-200">
                            停用
                          </span>
                        )}
                      </td>
                      <td className="py-2 px-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleOpenEditModal(item)}
                            className="text-sky-600 hover:text-sky-800 font-medium transition-colors"
                          >
                            编辑
                          </button>
                          <button
                            onClick={() => setItemToDelete(item)}
                            className="text-rose-600 hover:text-rose-800 font-medium transition-colors"
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

          {/* Pagination Controls (Strict 10 items per page requirement) */}
          <div className="bg-slate-50/80 border border-slate-200 px-3 py-2 rounded-lg flex items-center justify-between text-xs text-slate-600">
            <span>
              共 <strong className="font-mono text-slate-900">{filteredItems.length}</strong> 条，一页显示 <strong>10</strong> 条数据
            </span>

            <div className="flex items-center gap-1.5">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                className="p-1 rounded bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-slate-800 font-medium px-2">
                {currentPage} / {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                className="p-1 rounded bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add / Edit Cell Item Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden">
            <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between">
              <h3 className="font-bold text-sm">
                {editingItem ? '编辑细胞字典项' : '新增细胞字典项'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">字典目录</label>
                  <select
                    value={formData.catalog}
                    onChange={e => setFormData({ ...formData, catalog: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  >
                    {catalogsList.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">细胞分类</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  >
                    {treeNodes.map(n => (
                      <option key={n.id} value={n.id}>{n.label}</option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block font-medium text-slate-700 mb-1">细胞名称 *</label>
                  <input
                    type="text"
                    value={formData.cellName}
                    onChange={e => setFormData({ ...formData, cellName: e.target.value })}
                    placeholder="如：原始粒细胞、成熟浆细胞"
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">键盘热键/快捷键</label>
                  <input
                    type="text"
                    value={formData.hotkey}
                    onChange={e => setFormData({ ...formData, hotkey: e.target.value })}
                    placeholder="如: 1, A, I"
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">状态</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  >
                    <option value="启用">启用</option>
                    <option value="停用">停用</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">髓片代码</label>
                  <input
                    type="text"
                    value={formData.marrowCode}
                    onChange={e => setFormData({ ...formData, marrowCode: e.target.value })}
                    placeholder="YSJ_P"
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">血片代码</label>
                  <input
                    type="text"
                    value={formData.bloodCode}
                    onChange={e => setFormData({ ...formData, bloodCode: e.target.value })}
                    placeholder="YSJ_B"
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">参考平均值</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.meanValue}
                    onChange={e => setFormData({ ...formData, meanValue: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">参考标准差</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.sdValue}
                    onChange={e => setFormData({ ...formData, sdValue: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-medium transition-colors shadow-2xs"
                >
                  保存更新
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden p-5 space-y-4 text-xs">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="font-bold text-sm text-slate-900">确认删除该细胞字典项？</h3>
            </div>

            <p className="text-slate-600 leading-relaxed">
              您正在准备删除字典项 <strong className="text-slate-900">[{itemToDelete.cellName}]</strong> (髓片代码: {itemToDelete.marrowCode})，删除后将无法恢复。
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setItemToDelete(null)}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-medium transition-colors shadow-2xs"
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
