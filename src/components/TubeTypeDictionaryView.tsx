import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Download,
  ChevronRight,
  ChevronLeft,
  RefreshCw,
  X,
  Check,
  Building2,
  Table2,
  Trash2,
  FolderOpen,
  FileSpreadsheet,
  Activity,
  Pipette,
  Palette
} from './MenuIcon';
import { UserProfile } from '../types/navigation';
import {
  TubeTypeItem,
  INITIAL_TUBE_TYPES,
} from '../data/tubeDictionaryData';

interface TubeTypeDictionaryViewProps {
  user: UserProfile;
  triggerAction: (msg: string) => void;
}

export const TubeTypeDictionaryView: React.FC<TubeTypeDictionaryViewProps> = ({
  user,
  triggerAction,
}) => {
  // Top filter bar states (matching screenshot: 单位, 试管名称, [查询])
  const [selectedHospitalUnit, setSelectedHospitalUnit] = useState<string>('中心医院');
  const [filterTubeName, setFilterTubeName] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('all'); // all | 启用 | 停用

  // Master Tube Types dataset
  const [tubes, setTubes] = useState<TubeTypeItem[]>(INITIAL_TUBE_TYPES);

  // Pagination states (Requirement: "一页帮我显示10条数据")
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Modal dialog states
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showImportModal, setShowImportModal] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<TubeTypeItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<TubeTypeItem | null>(null);

  // Add/Edit Form State
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    pinyinCode: '',
    wubiCode: '',
    colorHex: '#f59e0b',
    colorName: '黄色',
    capColorName: '金黄色 (促凝胶SST管)',
    spec: '13×100mm',
    drawVolume: '4.0ml',
    additive: '惰性分离胶 + 促凝剂',
    department: '临床生化/免疫流水线',
    status: '启用' as '启用' | '停用',
    notes: '',
  });

  // Query / Search handler
  const handleQuery = () => {
    setCurrentPage(1);
    triggerAction(`已完成试管类型字典检索`);
  };

  // Reset filters
  const handleResetFilters = () => {
    setFilterTubeName('');
    setFilterStatus('all');
    setCurrentPage(1);
    triggerAction('已清空查询条件');
  };

  // Filtered dataset
  const filteredTubes = useMemo(() => {
    return tubes.filter((item) => {
      // 1. 试管名称或拼音码
      if (filterTubeName.trim()) {
        const kw = filterTubeName.trim().toLowerCase();
        const matchName = item.name.toLowerCase().includes(kw);
        const matchPinyin = item.pinyinCode.toLowerCase().includes(kw);
        const matchCode = item.code.toLowerCase().includes(kw);
        const matchAdditive = item.additive.toLowerCase().includes(kw);
        if (!matchName && !matchPinyin && !matchCode && !matchAdditive) {
          return false;
        }
      }
      // 2. 状态
      if (filterStatus !== 'all' && item.status !== filterStatus) {
        return false;
      }

      return true;
    });
  }, [tubes, filterTubeName, filterStatus]);

  // Pagination calculation
  const totalItems = filteredTubes.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  // Current page records
  const paginatedTubes = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredTubes.slice(startIndex, startIndex + pageSize);
  }, [filteredTubes, currentPage, pageSize]);

  // Toggle status (启用 <-> 停用, matching screenshot)
  const handleToggleStatus = (item: TubeTypeItem) => {
    const nextStatus = item.status === '启用' ? '停用' : '启用';
    const nowTime = '2026-10-29 09:45:00';
    const operatorName = user.name || '张珊';

    setTubes((prev) =>
      prev.map((t) =>
        t.id === item.id
          ? {
              ...t,
              status: nextStatus,
              updateTime: nowTime,
              operator: operatorName,
            }
          : t
      )
    );

    triggerAction(`试管类型 [${item.name}] 状态已切换为【${nextStatus}】`);
  };

  // Auto generate Pinyin code from name
  const generatePinyinCode = (nameStr: string) => {
    if (nameStr.includes('黄')) return 'HSG';
    if (nameStr.includes('紫')) return 'ZSG';
    if (nameStr.includes('蓝')) return 'LSG';
    if (nameStr.includes('绿')) return 'LSG2';
    if (nameStr.includes('红')) return 'HSG2';
    if (nameStr.includes('灰')) return 'HSG3';
    if (nameStr.includes('黑')) return 'HSG4';
    if (nameStr.includes('橘') || nameStr.includes('橙')) return 'JHG';
    if (nameStr.includes('棕')) return 'ZSG2';
    if (nameStr.includes('尿')) return 'TMNG';
    return nameStr.slice(0, 3).toUpperCase();
  };

  // Open Add Modal
  const handleOpenAddModal = () => {
    setFormData({
      code: '',
      name: '',
      pinyinCode: '',
      wubiCode: '',
      colorHex: '#3b82f6',
      colorName: '',
      capColorName: '',
      spec: '',
      drawVolume: '',
      additive: '',
      department: '',
      status: '启用',
      notes: '',
    });
    setEditingItem(null);
    setShowAddModal(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (item: TubeTypeItem) => {
    setEditingItem(item);
    setFormData({
      code: item.code,
      name: item.name,
      pinyinCode: item.pinyinCode,
      wubiCode: item.wubiCode || '',
      colorHex: item.colorHex,
      colorName: item.colorName,
      capColorName: item.capColorName,
      spec: item.spec,
      drawVolume: item.drawVolume,
      additive: item.additive,
      department: item.department,
      status: item.status,
      notes: item.notes || '',
    });
    setShowAddModal(true);
  };

  // Save (Add / Edit) Tube Type
  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code.trim()) {
      triggerAction('请填写试管编码');
      return;
    }
    if (!formData.name.trim()) {
      triggerAction('请填写试管名称');
      return;
    }

    const pinyin = formData.pinyinCode.trim().toUpperCase() || generatePinyinCode(formData.name);
    const nowTime = '2026-10-29 09:48:10';
    const operatorName = user.name || '张珊';

    if (editingItem) {
      // Edit
      setTubes((prev) =>
        prev.map((t) =>
          t.id === editingItem.id
            ? {
                ...t,
                code: formData.code.trim(),
                name: formData.name.trim(),
                pinyinCode: pinyin,
                wubiCode: formData.wubiCode.trim(),
                colorHex: formData.colorHex,
                colorName: formData.colorName,
                capColorName: formData.capColorName,
                spec: formData.spec.trim(),
                drawVolume: formData.drawVolume.trim(),
                additive: formData.additive.trim(),
                department: formData.department.trim(),
                status: formData.status,
                notes: formData.notes.trim(),
                operator: operatorName,
                updateTime: nowTime,
              }
            : t
        )
      );
      triggerAction(`试管类型 [${formData.name}] 修改成功并已刷新主数据！`);
    } else {
      // Add New
      const newItem: TubeTypeItem = {
        id: `tube-${Date.now()}`,
        code: formData.code.trim(),
        name: formData.name.trim(),
        pinyinCode: pinyin,
        wubiCode: formData.wubiCode.trim(),
        colorHex: formData.colorHex,
        colorName: formData.colorName,
        capColorName: formData.capColorName,
        spec: formData.spec.trim(),
        drawVolume: formData.drawVolume.trim(),
        additive: formData.additive.trim(),
        department: formData.department.trim(),
        status: formData.status,
        operator: operatorName,
        updateTime: nowTime,
        notes: formData.notes.trim(),
      };
      setTubes((prev) => [newItem, ...prev]);
      triggerAction(`新增试管类型 [${formData.name}] 保存成功！`);
    }

    setShowAddModal(false);
  };

  // Confirm Delete
  const handleConfirmDelete = () => {
    if (!itemToDelete) return;
    setTubes((prev) => prev.filter((t) => t.id !== itemToDelete.id));
    triggerAction(`试管类型 [${itemToDelete.name}] (编码: ${itemToDelete.code}) 已删除`);
    setItemToDelete(null);
  };

  // Quick Preset Samples for Import
  const handleImportSampleData = () => {
    triggerAction('已成功导入国家卫健委/LIS标准试管字典 5 项！');
    setShowImportModal(false);
  };

  // Quick Preset Color Selections
  const PRESET_TUBE_COLORS = [
    { name: '黄色', hex: '#f59e0b', cap: '金黄色 (促凝胶SST管)' },
    { name: '紫色', hex: '#a855f7', cap: '深紫色 (EDTA-K2抗凝管)' },
    { name: '蓝色', hex: '#0284c7', cap: '天蓝色 (枸橼酸钠1:9血凝管)' },
    { name: '绿色', hex: '#10b981', cap: '翡翠绿 (肝素锂抗凝管)' },
    { name: '红色', hex: '#ef4444', cap: '亮红色 (普通干燥血清管)' },
    { name: '灰色', hex: '#6b7280', cap: '浅灰色 (草酸钾/氟化钠血糖管)' },
    { name: '黑色', hex: '#18181b', cap: '纯黑色 (枸橼酸钠1:4血沉管)' },
    { name: '橘红', hex: '#f97316', cap: '橘红色 (快速凝血酶试管)' },
    { name: '棕色', hex: '#78350f', cap: '防光棕色 (无铅微量元素管)' },
    { name: '天蓝透明', hex: '#38bdf8', cap: '天蓝色螺口 (尿液管)' },
  ];

  // Quick Stats
  const activeCount = useMemo(() => tubes.filter((t) => t.status === '启用').length, [tubes]);
  const inactiveCount = useMemo(() => tubes.filter((t) => t.status === '停用').length, [tubes]);

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-slate-100 overflow-hidden text-xs">
      {/* 1. Top Header & Breadcrumb */}
      <div className="bg-white border-b border-slate-200 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shrink-0 shadow-2xs">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-800 flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-sky-600" />
            临生免系统
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-600 font-medium">基础管理</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-sky-700 font-semibold bg-sky-50 px-2.5 py-0.5 rounded border border-sky-200">
            试管类型字典
          </span>
          <span className="hidden lg:inline text-[11px] text-slate-400 font-mono ml-2">
            采血管色标标准 · 标本容器容量与添加剂规范
          </span>
        </div>

        {/* Global Stats */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200 text-[11px]">
            <span className="text-slate-500">试管总计:</span>
            <span className="font-mono font-bold text-slate-800">{tubes.length}</span>
            <span className="text-slate-300">|</span>
            <span className="text-emerald-700 font-medium">启用 {activeCount}</span>
            <span className="text-slate-300">|</span>
            <span className="text-rose-600 font-medium">停用 {inactiveCount}</span>
          </div>

          <button
            onClick={() => {
              setTubes(INITIAL_TUBE_TYPES);
              triggerAction('已恢复全套试管类型字典出厂预设');
            }}
            title="重置恢复标准字典"
            className="px-2 py-1 bg-white hover:bg-slate-50 border border-slate-300 text-slate-600 rounded text-xs shadow-2xs flex items-center gap-1 transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            <span className="hidden sm:inline">重置标准字典</span>
          </button>
        </div>
      </div>

      {/* 2. Top Filter Bar (Directly Matching User Screenshot Fields: 单位, 试管名称, [查询]) */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 shrink-0 shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* 1. 单位 (matching screenshot) */}
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

          {/* 2. 试管名称 (matching screenshot) */}
          <div className="flex items-center gap-1.5">
            <label className="text-slate-700 font-medium whitespace-nowrap">试管名称</label>
            <div className="relative">
              <input
                type="text"
                placeholder="如: 黄色管, 紫色管, HSG"
                value={filterTubeName}
                onChange={(e) => setFilterTubeName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleQuery()}
                className="w-40 lg:w-52 h-7 px-2.5 bg-white border border-slate-300 rounded text-xs focus:ring-1 focus:ring-sky-500 focus:border-sky-500 outline-hidden"
              />
              {filterTubeName && (
                <button
                  onClick={() => setFilterTubeName('')}
                  className="absolute right-1.5 top-1.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* 3. 状态筛选 */}
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

          {/* [查询] Button (matching screenshot blue outline button) */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleQuery}
              className="h-7 px-4 bg-white hover:bg-sky-50 border border-sky-600 text-sky-700 rounded text-xs font-semibold shadow-2xs flex items-center gap-1 transition-colors"
            >
              <Search className="w-3 h-3 text-sky-600" />
              <span>查询</span>
            </button>
            {(filterTubeName || filterStatus !== 'all') && (
              <button
                onClick={handleResetFilters}
                className="h-7 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded text-xs transition-colors"
              >
                清空筛选
              </button>
            )}
          </div>
        </div>

        {/* Action Buttons Row: [新增] (Solid blue matching screenshot) */}
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

            {/* [导入] Outline button */}
            <button
              onClick={() => setShowImportModal(true)}
              className="h-7 px-3 bg-white hover:bg-sky-50 border border-slate-300 hover:border-sky-500 text-slate-700 hover:text-sky-700 rounded text-xs font-medium shadow-2xs flex items-center gap-1 transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-slate-500" />
              <span>导入</span>
            </button>

            {/* [导出] */}
            <button
              onClick={() => triggerAction('已成功导出全院试管类型字典 (Excel格式)')}
              className="h-7 px-3 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded text-xs font-medium shadow-2xs flex items-center gap-1 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>导出字典</span>
            </button>
          </div>

          <div className="flex items-center gap-3 text-slate-500 text-xs">
            <span>当前结果: <strong className="font-mono text-sky-700">{filteredTubes.length}</strong> 条</span>
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
            <table className="w-full min-w-[1020px] border-collapse text-left whitespace-nowrap">
              {/* Header (Matching screenshot columns: 试管编码, 名称, 拼音简码, 五笔码, 试管颜色, 试管规格, 采集量, 添加剂, 状态, 操作) */}
              <thead className="bg-slate-50 sticky top-0 z-10 border-b border-slate-200 text-slate-700 font-semibold text-xs shadow-2xs">
                <tr>
                  <th className="px-3 py-2.5 w-12 text-center border-r border-slate-200 text-slate-400">#</th>
                  <th className="px-3.5 py-2.5 w-24 border-r border-slate-200 font-mono">试管编码</th>
                  <th className="px-4 py-2.5 w-32 border-r border-slate-200">名称</th>
                  <th className="px-3.5 py-2.5 w-24 border-r border-slate-200 font-mono">拼音简码</th>
                  <th className="px-3.5 py-2.5 w-24 border-r border-slate-200 font-mono">五笔码</th>
                  <th className="px-4 py-2.5 w-32 border-r border-slate-200 text-center">试管颜色</th>
                  <th className="px-3.5 py-2.5 w-28 border-r border-slate-200 font-mono">试管规格</th>
                  <th className="px-3.5 py-2.5 w-24 border-r border-slate-200 font-mono">采集量</th>
                  <th className="px-4 py-2.5 min-w-[200px] border-r border-slate-200">添加剂</th>
                  <th className="px-3 py-2.5 w-20 border-r border-slate-200 text-center">状态</th>
                  <th className="px-3 py-2.5 w-20 border-r border-slate-200">维护人</th>
                  <th className="px-3.5 py-2.5 w-32 border-r border-slate-200 font-mono text-[11px]">更新时间</th>
                  <th className="px-4 py-2.5 w-32 text-center sticky right-0 bg-slate-50 z-20 shadow-xs">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-800">
                {paginatedTubes.length === 0 ? (
                  <tr>
                    <td colSpan={13} className="py-16 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <FolderOpen className="w-8 h-8 text-slate-300 stroke-1" />
                        <span>未找到符合条件的试管类型数据</span>
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
                  paginatedTubes.map((item, index) => {
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
                        <td className="px-3 py-2.5 text-center font-mono text-slate-400 border-r border-slate-100">
                          {rowNumber}
                        </td>

                        {/* 1. 试管编码 (matching screenshot e.g. 1, 2) */}
                        <td className="px-3.5 py-2.5 font-mono font-bold text-slate-900 border-r border-slate-100">
                          <span>{item.code}</span>
                        </td>

                        {/* 2. 名称 (matching screenshot e.g. 黄色管, 紫色管) */}
                        <td className="px-4 py-2.5 border-r border-slate-100 font-medium text-slate-900">
                          <span className="font-bold text-slate-800 text-[13px]">{item.name}</span>
                        </td>

                        {/* 3. 拼音简码 (matching screenshot e.g. HSG, ZSG) */}
                        <td className="px-3.5 py-2.5 font-mono font-semibold text-slate-700 border-r border-slate-100">
                          {item.pinyinCode || '-'}
                        </td>

                        {/* 4. 五笔码 (matching screenshot column) */}
                        <td className="px-3.5 py-2.5 font-mono text-slate-500 border-r border-slate-100">
                          {item.wubiCode || '-'}
                        </td>

                        {/* 5. 试管颜色 (Matching screenshot bright color block indicator, e.g. yellow / purple badge) */}
                        <td className="px-4 py-2.5 text-center border-r border-slate-100">
                          <div className="inline-flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded border border-slate-200">
                            {/* Color block matching screenshot rectangles */}
                            <span
                              className="w-8 h-3.5 rounded-xs shadow-2xs inline-block border border-black/10 shrink-0"
                              style={{ backgroundColor: item.colorHex }}
                              title={`${item.colorName} (${item.colorHex})`}
                            />
                            <span className="font-medium text-[11px] text-slate-700 whitespace-nowrap">
                              {item.colorName}
                            </span>
                          </div>
                        </td>

                        {/* 6. 试管规格 (matching screenshot e.g. 13×100mm, [blank]) */}
                        <td className="px-3.5 py-2.5 font-mono text-slate-600 border-r border-slate-100">
                          {item.spec || '-'}
                        </td>

                        {/* 7. 采集量 (matching screenshot e.g. 10ml, [blank]) */}
                        <td className="px-3.5 py-2.5 font-mono font-semibold text-slate-800 border-r border-slate-100">
                          {item.drawVolume ? (
                            <span className="px-1.5 py-0.5 rounded bg-sky-50 text-sky-800 border border-sky-100">
                              {item.drawVolume}
                            </span>
                          ) : (
                            <span className="text-slate-300">-</span>
                          )}
                        </td>

                        {/* 8. 添加剂 (matching screenshot) */}
                        <td className="px-4 py-2.5 border-r border-slate-100 text-slate-600 text-xs">
                          {item.additive || '-'}
                        </td>

                        {/* 9. 状态 (matching screenshot: 启用 (black/green), 停用 (red)) */}
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

                        {/* 10. 维护人 (真实人名: 张珊, 蔡文斌, 陈志远, 林德胜, 黄雅芳) */}
                        <td className="px-3 py-2.5 border-r border-slate-100 font-medium text-slate-700">
                          {item.operator}
                        </td>

                        {/* 11. 更新时间 (近期: 2026-10-29) */}
                        <td className="px-3.5 py-2.5 border-r border-slate-100 font-mono text-[11px] text-slate-500">
                          {item.updateTime}
                        </td>

                        {/* 12. 操作 (matching screenshot: 编辑 删除 停用 / 编辑 删除 启用) */}
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

      {/* 5. ADD / EDIT TUBE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col animate-scaleUp">
            {/* Modal Header */}
            <div className="px-5 py-3.5 bg-gradient-to-r from-sky-700 to-sky-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Pipette className="w-4 h-4" />
                <h3 className="font-bold text-sm tracking-wide">
                  {editingItem ? '编辑试管类型字典' : '新增试管类型字典'}
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
                {/* 试管编码 */}
                <div>
                  <label className="block text-slate-700 font-medium mb-1">
                    <span className="text-rose-500 font-bold mr-0.5">*</span>试管编码
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="如: 1, 2, TUBE-01"
                    required
                    className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded text-xs font-mono font-semibold focus:ring-1 focus:ring-sky-500 focus:border-sky-500 outline-hidden"
                  />
                </div>

                {/* 名称 */}
                <div>
                  <label className="block text-slate-700 font-medium mb-1">
                    <span className="text-rose-500 font-bold mr-0.5">*</span>试管名称
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData({
                        ...formData,
                        name: val,
                        pinyinCode: generatePinyinCode(val),
                      });
                    }}
                    placeholder="如: 黄色管, 紫色管, 蓝头管"
                    required
                    className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded text-xs font-medium focus:ring-1 focus:ring-sky-500 focus:border-sky-500 outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* 拼音简码 */}
                <div>
                  <label className="block text-slate-700 font-medium mb-1">拼音简码</label>
                  <input
                    type="text"
                    value={formData.pinyinCode}
                    onChange={(e) => setFormData({ ...formData, pinyinCode: e.target.value })}
                    placeholder="如: HSG, ZSG"
                    className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded text-xs font-mono uppercase focus:ring-1 focus:ring-sky-500 focus:border-sky-500 outline-hidden"
                  />
                </div>

                {/* 五笔码 */}
                <div>
                  <label className="block text-slate-700 font-medium mb-1">五笔码</label>
                  <input
                    type="text"
                    value={formData.wubiCode}
                    onChange={(e) => setFormData({ ...formData, wubiCode: e.target.value })}
                    placeholder="如: AMNN"
                    className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded text-xs font-mono uppercase focus:ring-1 focus:ring-sky-500 focus:border-sky-500 outline-hidden"
                  />
                </div>
              </div>

              {/* 试管颜色选择器 */}
              <div>
                <label className="block text-slate-700 font-medium mb-1 flex items-center gap-1">
                  <Palette className="w-3.5 h-3.5 text-sky-600" />
                  <span>试管盖子颜色预设选区</span>
                </label>
                <div className="grid grid-cols-5 gap-1.5 p-2 bg-slate-50 border border-slate-200 rounded-lg">
                  {PRESET_TUBE_COLORS.map((c) => {
                    const isSelected = formData.colorHex === c.hex;
                    return (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            colorHex: c.hex,
                            colorName: c.name,
                            capColorName: c.cap,
                          })
                        }
                        className={`p-1 rounded flex flex-col items-center gap-1 border text-[11px] transition-all ${
                          isSelected
                            ? 'bg-white border-sky-500 ring-2 ring-sky-200 shadow-2xs font-bold text-slate-900'
                            : 'bg-white/80 border-slate-200 hover:border-slate-300 text-slate-600'
                        }`}
                      >
                        <span
                          className="w-full h-3 rounded-xs border border-black/10"
                          style={{ backgroundColor: c.hex }}
                        />
                        <span className="truncate max-w-full">{c.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* 试管规格 */}
                <div>
                  <label className="block text-slate-700 font-medium mb-1">试管规格</label>
                  <input
                    type="text"
                    value={formData.spec}
                    onChange={(e) => setFormData({ ...formData, spec: e.target.value })}
                    placeholder="如: 13×100mm, 13×75mm"
                    className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded text-xs font-mono focus:ring-1 focus:ring-sky-500 focus:border-sky-500 outline-hidden"
                  />
                </div>

                {/* 采集量 */}
                <div>
                  <label className="block text-slate-700 font-medium mb-1">采血量/采集量</label>
                  <input
                    type="text"
                    value={formData.drawVolume}
                    onChange={(e) => setFormData({ ...formData, drawVolume: e.target.value })}
                    placeholder="如: 10ml, 4.0ml, 2.7ml"
                    className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded text-xs font-mono focus:ring-1 focus:ring-sky-500 focus:border-sky-500 outline-hidden"
                  />
                </div>
              </div>

              {/* 添加剂 */}
              <div>
                <label className="block text-slate-700 font-medium mb-1">包含添加剂及化学成分</label>
                <input
                  type="text"
                  value={formData.additive}
                  onChange={(e) => setFormData({ ...formData, additive: e.target.value })}
                  placeholder="如: 惰性分离胶 + 促凝剂, EDTA-K2"
                  className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded text-xs focus:ring-1 focus:ring-sky-500 focus:border-sky-500 outline-hidden"
                />
              </div>

              {/* 适用专业组 & 状态 */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">适用专业组</label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    placeholder="如: 生化免疫流水线"
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
                    <option value="启用">启用 (正常显示)</option>
                    <option value="停用">停用 (隐藏/不可选)</option>
                  </select>
                </div>
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
                <h3 className="font-bold text-sm tracking-wide">批量导入试管类型字典</h3>
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
                <p>支持 Excel (.xlsx) 或 CSV 文件导入，包含：试管编码、试管名称、拼音简码、试管颜色、规格、采集量、添加剂等标准列。</p>
              </div>

              <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-sky-500 cursor-pointer bg-slate-50 transition-colors">
                <FileSpreadsheet className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                <p className="text-xs font-medium text-slate-700">点击上传或将试管字典 Excel 文件拖拽至此</p>
                <p className="text-[11px] text-slate-400 mt-1">支持临床真空采血管行业标准模板</p>
              </div>

              <div className="flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => triggerAction('已下载试管类型标准字典 Excel 模版')}
                  className="text-sky-600 hover:text-sky-800 underline"
                >
                  下载试管字典导入模板.xlsx
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
                <h4 className="font-bold text-slate-900 text-sm">确认删除试管类型？</h4>
                <p className="text-xs text-slate-500">此操作将物理删除字典条目，请确认</p>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs space-y-1">
              <div>
                <span className="text-slate-500">试管编码: </span>
                <span className="font-mono font-bold text-slate-900">{itemToDelete.code}</span>
              </div>
              <div>
                <span className="text-slate-500">试管名称: </span>
                <span className="font-semibold text-slate-900">{itemToDelete.name}</span>
              </div>
              <div>
                <span className="text-slate-500">试管颜色: </span>
                <span className="font-medium text-slate-800">{itemToDelete.colorName}</span>
              </div>
              <div>
                <span className="text-slate-500">采血量: </span>
                <span className="font-mono text-slate-700">{itemToDelete.drawVolume || '未填写'}</span>
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
