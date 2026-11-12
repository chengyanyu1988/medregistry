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
  FlaskConical,
  Microscope,
  Dna,
  Printer
} from './MenuIcon';
import { UserProfile } from '../types/navigation';
import {
  TestApplyItem,
  LinkedTestItem,
  INITIAL_TEST_APPLY_ITEMS,
} from '../data/testApplyDictionaryData';

interface TestApplyDictionaryViewProps {
  user: UserProfile;
  triggerAction: (msg: string) => void;
}

export const TestApplyDictionaryView: React.FC<TestApplyDictionaryViewProps> = ({
  user,
  triggerAction,
}) => {
  // System Sidebar State (Matching screenshot left menu: 临生免 | 微生物 | 骨髓细胞形态学)
  const [activeSystem, setActiveSystem] = useState<'临生免' | '微生物' | '骨髓细胞形态学'>('临生免');

  // Top Filter States (Matching screenshot: 单位, 业务小组, 申请名称, [显示停用])
  const [selectedHospitalUnit, setSelectedHospitalUnit] = useState<string>('中心医院');
  const [filterGroup, setFilterGroup] = useState<string>('all');
  const [filterKeyword, setFilterKeyword] = useState<string>('');
  const [showDisabledOnly, setShowDisabledOnly] = useState<boolean>(false);

  // Master Test Apply Dataset
  const [applyItems, setApplyItems] = useState<TestApplyItem[]>(INITIAL_TEST_APPLY_ITEMS);

  // Selected item on left table for linked items display on right side
  const [selectedApplyId, setSelectedApplyId] = useState<string>('ta-01');

  // Pagination states (Requirement: 10 items per page)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Modal States
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [editingApplyItem, setEditingApplyItem] = useState<TestApplyItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<TestApplyItem | null>(null);

  // Modal to Link/Add Items to selected Order
  const [showLinkItemModal, setShowLinkItemModal] = useState<boolean>(false);
  const [newLinkedItemData, setNewLinkedItemData] = useState({
    itemCode: '',
    itemName: '',
    englishName: '',
    unit: 'mmol/L',
    isDefault: true,
  });

  // Blank Form State for Add / Edit Apply Order
  const [formData, setFormData] = useState({
    system: '临生免' as '临生免' | '微生物' | '骨髓细胞形态学',
    group: '生化' as '生化' | '临检' | '免疫' | '凝血' | '微生物',
    code: '',
    name: '',
    pinyinCode: '',
    wubiCode: '',
    container: '',
    specimenType: '',
    applicableGender: '不区分' as '不区分' | '男' | '女',
    costPrice: '',
    chargePrice: '',
    isOutsourced: '否' as '是' | '否',
    status: '启用' as '启用' | '停用',
    notes: '',
  });

  // Auto generate Pinyin Code
  const handleNameChange = (nameVal: string) => {
    let pinyin = '';
    if (nameVal.includes('肝')) pinyin += 'GN';
    if (nameVal.includes('肾')) pinyin += 'SN';
    if (nameVal.includes('血')) pinyin += 'XZ';
    if (nameVal.includes('尿')) pinyin += 'NY';
    if (nameVal.includes('全')) pinyin += 'QT';
    if (nameVal.includes('凝')) pinyin += 'NX';
    if (!pinyin) pinyin = nameVal.slice(0, 4).toUpperCase();

    setFormData((prev) => ({
      ...prev,
      name: nameVal,
      pinyinCode: prev.pinyinCode ? prev.pinyinCode : pinyin,
    }));
  };

  // Filtered dataset
  const filteredApplyItems = useMemo(() => {
    return applyItems.filter((item) => {
      // 1. System Filter
      if (item.system !== activeSystem) {
        return false;
      }
      // 2. Group Filter
      if (filterGroup !== 'all' && item.group !== filterGroup) {
        return false;
      }
      // 3. Keyword Filter (Code, Name, Pinyin, Container)
      if (filterKeyword.trim()) {
        const kw = filterKeyword.trim().toLowerCase();
        const matchCode = item.code.toLowerCase().includes(kw);
        const matchName = item.name.toLowerCase().includes(kw);
        const matchPinyin = item.pinyinCode.toLowerCase().includes(kw);
        const matchContainer = item.container.toLowerCase().includes(kw);
        if (!matchCode && !matchName && !matchPinyin && !matchContainer) {
          return false;
        }
      }
      // 4. Show Disabled Filter
      if (showDisabledOnly && item.status !== '停用') {
        return false;
      }

      return true;
    });
  }, [applyItems, activeSystem, filterGroup, filterKeyword, showDisabledOnly]);

  // Selected Apply Item for right panel display
  const selectedApplyItem = useMemo(() => {
    return (
      filteredApplyItems.find((item) => item.id === selectedApplyId) ||
      filteredApplyItems[0] ||
      null
    );
  }, [filteredApplyItems, selectedApplyId]);

  // Pagination calculation
  const totalItems = filteredApplyItems.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const paginatedApplyItems = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredApplyItems.slice(startIndex, startIndex + pageSize);
  }, [filteredApplyItems, currentPage, pageSize]);

  // Query Button
  const handleQuery = () => {
    setCurrentPage(1);
    triggerAction(`已检出 ${activeSystem} 业务系统下的检验申请字典`);
  };

  // Reset Filters
  const handleResetFilters = () => {
    setFilterGroup('all');
    setFilterKeyword('');
    setShowDisabledOnly(false);
    setCurrentPage(1);
    triggerAction('已重置筛选条件');
  };

  // Open Add Modal (Blank fields)
  const handleOpenAddModal = () => {
    setEditingApplyItem(null);
    setFormData({
      system: activeSystem,
      group: '生化',
      code: '',
      name: '',
      pinyinCode: '',
      wubiCode: '',
      container: '',
      specimenType: '',
      applicableGender: '不区分',
      costPrice: '',
      chargePrice: '',
      isOutsourced: '否',
      status: '启用',
      notes: '',
    });
    setShowAddModal(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (item: TestApplyItem) => {
    setEditingApplyItem(item);
    setFormData({
      system: item.system,
      group: item.group,
      code: item.code,
      name: item.name,
      pinyinCode: item.pinyinCode,
      wubiCode: item.wubiCode || '',
      container: item.container,
      specimenType: item.specimenType,
      applicableGender: item.applicableGender,
      costPrice: String(item.costPrice),
      chargePrice: String(item.chargePrice),
      isOutsourced: item.isOutsourced,
      status: item.status,
      notes: item.notes || '',
    });
    setShowAddModal(true);
  };

  // Save Add/Edit Apply Order
  const handleSaveApplyForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code.trim()) {
      triggerAction('请输入申请编码');
      return;
    }
    if (!formData.name.trim()) {
      triggerAction('请输入申请名称');
      return;
    }

    const nowTime = '2026-10-29 10:15:00';
    const operatorName = user.name || '张珊';

    if (editingApplyItem) {
      // Edit
      setApplyItems((prev) =>
        prev.map((item) =>
          item.id === editingApplyItem.id
            ? {
                ...item,
                system: formData.system,
                group: formData.group,
                code: formData.code.trim(),
                name: formData.name.trim(),
                pinyinCode: formData.pinyinCode.trim(),
                wubiCode: formData.wubiCode.trim(),
                container: formData.container.trim(),
                specimenType: formData.specimenType.trim(),
                applicableGender: formData.applicableGender,
                costPrice: Number(formData.costPrice) || 0,
                chargePrice: Number(formData.chargePrice) || 0,
                isOutsourced: formData.isOutsourced,
                status: formData.status,
                notes: formData.notes.trim(),
                updateTime: nowTime,
                operator: operatorName,
              }
            : item
        )
      );
      triggerAction(`已更新检验申请 [${formData.code}] ${formData.name}`);
    } else {
      // Add
      const newItem: TestApplyItem = {
        id: `ta-${Date.now()}`,
        system: formData.system,
        group: formData.group,
        code: formData.code.trim(),
        name: formData.name.trim(),
        pinyinCode: formData.pinyinCode.trim() || 'CGQT',
        wubiCode: formData.wubiCode.trim() || 'FDCG',
        container: formData.container.trim() || '普通干燥管',
        specimenType: formData.specimenType.trim() || '血清',
        applicableGender: formData.applicableGender,
        costPrice: Number(formData.costPrice) || 0,
        chargePrice: Number(formData.chargePrice) || 0,
        isOutsourced: formData.isOutsourced,
        status: formData.status,
        updateTime: nowTime,
        operator: operatorName,
        notes: formData.notes.trim(),
        linkedItems: [],
      };
      setApplyItems((prev) => [newItem, ...prev]);
      setSelectedApplyId(newItem.id);
      triggerAction(`已成功新增检验申请 [${newItem.code}] ${newItem.name}`);
    }

    setShowAddModal(false);
  };

  // Toggle status
  const handleToggleStatus = (item: TestApplyItem) => {
    const nextStatus = item.status === '启用' ? '停用' : '启用';
    const nowTime = '2026-10-29 10:20:00';
    const operatorName = user.name || '张珊';

    setApplyItems((prev) =>
      prev.map((a) =>
        a.id === item.id
          ? {
              ...a,
              status: nextStatus,
              updateTime: nowTime,
              operator: operatorName,
            }
          : a
      )
    );

    triggerAction(`检验申请 [${item.name}] 状态切换为【${nextStatus}】`);
  };

  // Confirm delete
  const handleConfirmDelete = () => {
    if (!itemToDelete) return;
    setApplyItems((prev) => prev.filter((a) => a.id !== itemToDelete.id));
    triggerAction(`已删除检验申请字典 [${itemToDelete.name}]`);
    setItemToDelete(null);
  };

  // Link item to current selected apply order
  const handleSaveLinkedItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApplyItem) return;
    if (!newLinkedItemData.itemCode.trim() || !newLinkedItemData.itemName.trim()) {
      triggerAction('请填写入关联项目代码与项目名称');
      return;
    }

    const newLinked: LinkedTestItem = {
      id: `li-${Date.now()}`,
      itemCode: newLinkedItemData.itemCode.trim(),
      itemName: newLinkedItemData.itemName.trim(),
      englishName: newLinkedItemData.englishName.trim(),
      unit: newLinkedItemData.unit.trim(),
      isDefault: newLinkedItemData.isDefault,
    };

    setApplyItems((prev) =>
      prev.map((a) =>
        a.id === selectedApplyItem.id
          ? {
              ...a,
              linkedItems: [...a.linkedItems, newLinked],
            }
          : a
      )
    );

    setShowLinkItemModal(false);
    triggerAction(`已将 [${newLinked.itemCode}] ${newLinked.itemName} 关联至申请 [${selectedApplyItem.name}]`);
  };

  // Remove linked item
  const handleRemoveLinkedItem = (linkedId: string) => {
    if (!selectedApplyItem) return;
    setApplyItems((prev) =>
      prev.map((a) =>
        a.id === selectedApplyItem.id
          ? {
              ...a,
              linkedItems: a.linkedItems.filter((li) => li.id !== linkedId),
            }
          : a
      )
    );
    triggerAction('已取消关联该检验项目');
  };

  return (
    <div className="flex-1 flex h-full min-h-0 bg-slate-100 overflow-hidden text-slate-800 text-xs">
      {/* 1. Leftmost Vertical System Selection Sidebar (业务系统 matching image_df1f50bf.png) */}
      <div className="w-36 bg-white border-r border-slate-200 shrink-0 flex flex-col p-2 space-y-1 select-none shadow-2xs">
        <div className="px-2 py-1.5 text-[11px] font-bold text-sky-700 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 mb-1">
          <Layers className="w-3.5 h-3.5" />
          业务系统
        </div>

        <button
          onClick={() => {
            setActiveSystem('临生免');
            setCurrentPage(1);
          }}
          className={`w-full px-2.5 py-2 rounded text-left font-medium transition-colors flex items-center justify-between ${
            activeSystem === '临生免'
              ? 'bg-sky-600 text-white shadow-2xs'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <span>临生免</span>
          {activeSystem === '临生免' && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
        </button>

        <button
          onClick={() => {
            setActiveSystem('微生物');
            setCurrentPage(1);
          }}
          className={`w-full px-2.5 py-2 rounded text-left font-medium transition-colors flex items-center justify-between ${
            activeSystem === '微生物'
              ? 'bg-sky-600 text-white shadow-2xs'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <span>微生物</span>
          {activeSystem === '微生物' && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
        </button>

        <button
          onClick={() => {
            setActiveSystem('骨髓细胞形态学');
            setCurrentPage(1);
          }}
          className={`w-full px-2.5 py-2 rounded text-left font-medium transition-colors flex items-center justify-between ${
            activeSystem === '骨髓细胞形态学'
              ? 'bg-sky-600 text-white shadow-2xs'
              : 'text-slate-700 hover:bg-slate-100'
          }`}
        >
          <span>骨髓细胞形态学</span>
          {activeSystem === '骨髓细胞形态学' && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
        </button>

        <div className="mt-auto pt-3 border-t border-slate-100 p-2 text-[10px] text-slate-400">
          维护临床全院医嘱与组合字典
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Filter Bar (Matching screenshot UI: 单位, 业务小组, 申请名称, [显示停用], [查询], [新增]) */}
        <div className="bg-white border-b border-slate-200 p-3 shrink-0 shadow-2xs space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            {/* 单位 */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-600 font-medium whitespace-nowrap">单位:</span>
              <select
                value={selectedHospitalUnit}
                onChange={(e) => setSelectedHospitalUnit(e.target.value)}
                className="bg-white border border-slate-300 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-sky-500 outline-none min-w-[120px]"
              >
                <option value="中心医院">中心医院</option>
                <option value="第一分院">第一分院</option>
                <option value="妇幼保健院">妇幼保健院</option>
              </select>
            </div>

            {/* 业务小组 */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-600 font-medium whitespace-nowrap">业务小组:</span>
              <select
                value={filterGroup}
                onChange={(e) => setFilterGroup(e.target.value)}
                className="bg-white border border-slate-300 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-sky-500 outline-none min-w-[100px]"
              >
                <option value="all">全部小组</option>
                <option value="生化">生化</option>
                <option value="临检">临检</option>
                <option value="免疫">免疫</option>
                <option value="凝血">凝血</option>
                <option value="微生物">微生物</option>
              </select>
            </div>

            {/* 申请名称 */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-600 font-medium whitespace-nowrap">申请名称:</span>
              <div className="relative">
                <input
                  type="text"
                  value={filterKeyword}
                  onChange={(e) => setFilterKeyword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleQuery()}
                  placeholder="检索申请编码、名称、拼音码..."
                  className="bg-white border border-slate-300 rounded px-2 py-1 text-xs w-48 focus:ring-1 focus:ring-sky-500 outline-none pr-6"
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

            {/* 查询 / 重置 / 新增 buttons */}
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

        {/* Workspace Panels (Left Table: 检验申请列表, Right Table: 检验项目列表) */}
        <div className="flex-1 p-3 min-h-0 overflow-hidden flex gap-3">
          {/* LEFT TABLE: 检验申请列表 (Main Table, 10 items per page) */}
          <div className="flex-1 bg-white border border-slate-200 rounded-lg shadow-2xs flex flex-col overflow-hidden">
            {/* Table Header */}
            <div className="bg-slate-100/90 border-b border-slate-200 px-3 py-2 flex items-center justify-between shrink-0">
              <h3 className="font-semibold text-sky-700 flex items-center gap-1.5">
                <Table2 className="w-4 h-4 text-sky-600" />
                检验申请列表 ({activeSystem})
              </h3>
              <span className="text-[11px] text-slate-500">
                选中某行即可在右侧查看与维护关联检验项目
              </span>
            </div>

            {/* Table Area */}
            <div className="flex-1 overflow-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 sticky top-0 z-10">
                    <th className="py-2 px-2.5 border-r border-slate-200">业务小组</th>
                    <th className="py-2 px-2.5 border-r border-slate-200">申请编码</th>
                    <th className="py-2 px-2.5 border-r border-slate-200">申请名称</th>
                    <th className="py-2 px-2.5 border-r border-slate-200">拼音简码</th>
                    <th className="py-2 px-2.5 border-r border-slate-200">五笔简码</th>
                    <th className="py-2 px-2.5 border-r border-slate-200">采集容器</th>
                    <th className="py-2 px-2.5 border-r border-slate-200">标本类型</th>
                    <th className="py-2 px-2.5 border-r border-slate-200 text-center">适用性别</th>
                    <th className="py-2 px-2.5 border-r border-slate-200 text-right">成本</th>
                    <th className="py-2 px-2.5 border-r border-slate-200 text-right">收费价格</th>
                    <th className="py-2 px-2.5 border-r border-slate-200 text-center">外检</th>
                    <th className="py-2 px-2.5 border-r border-slate-200 text-center">状态</th>
                    <th className="py-2 px-2.5 text-center w-28">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedApplyItems.length === 0 ? (
                    <tr>
                      <td colSpan={13} className="py-12 text-center text-slate-400">
                        未找到相匹配的检验申请字典记录
                      </td>
                    </tr>
                  ) : (
                    paginatedApplyItems.map((item) => {
                      const isSelected = selectedApplyItem?.id === item.id;
                      return (
                        <tr
                          key={item.id}
                          onClick={() => setSelectedApplyId(item.id)}
                          className={`hover:bg-sky-50/60 transition-colors cursor-pointer ${
                            isSelected ? 'bg-sky-100/70 border-l-4 border-l-sky-600 font-medium' : ''
                          } ${item.status === '停用' ? 'text-slate-400 bg-slate-50/50' : ''}`}
                        >
                          <td className="py-2 px-2.5 border-r border-slate-100">{item.group}</td>
                          <td className="py-2 px-2.5 border-r border-slate-100 font-mono font-semibold text-slate-800">
                            {item.code}
                          </td>
                          <td className="py-2 px-2.5 border-r border-slate-100 font-medium text-sky-700">
                            {item.name}
                          </td>
                          <td className="py-2 px-2.5 border-r border-slate-100 font-mono text-slate-600">
                            {item.pinyinCode || '-'}
                          </td>
                          <td className="py-2 px-2.5 border-r border-slate-100 font-mono text-slate-500">
                            {item.wubiCode || '-'}
                          </td>
                          <td className="py-2 px-2.5 border-r border-slate-100 text-slate-600 truncate max-w-[130px]">
                            {item.container}
                          </td>
                          <td className="py-2 px-2.5 border-r border-slate-100 text-slate-600">
                            {item.specimenType}
                          </td>
                          <td className="py-2 px-2.5 border-r border-slate-100 text-center">
                            {item.applicableGender}
                          </td>
                          <td className="py-2 px-2.5 border-r border-slate-100 text-right font-mono text-slate-600">
                            ¥ {item.costPrice.toFixed(2)}
                          </td>
                          <td className="py-2 px-2.5 border-r border-slate-100 text-right font-mono font-semibold text-emerald-700">
                            ¥ {item.chargePrice.toFixed(2)}
                          </td>
                          <td className="py-2 px-2.5 border-r border-slate-100 text-center">
                            {item.isOutsourced}
                          </td>
                          <td className="py-2 px-2.5 border-r border-slate-100 text-center">
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
                          <td
                            className="py-2 px-2.5 text-center"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex items-center justify-center gap-1.5">
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
                                className="text-rose-600 hover:text-rose-800 hover:underline"
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

            {/* Pagination Footer (Requirement: 一页显示10条数据) */}
            <div className="bg-slate-50 border-t border-slate-200 px-3 py-2 flex items-center justify-between shrink-0">
              <span className="text-sky-700 font-semibold">合计: {totalItems} 条</span>

              <div className="flex items-center gap-2">
                <span className="text-slate-500 text-[11px]">
                  第 {currentPage} / {totalPages} 页
                </span>
                <div className="flex items-center gap-1">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="px-2 py-0.5 bg-white border border-slate-300 rounded text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 flex items-center gap-1"
                  >
                    <ChevronLeft className="w-3 h-3" />
                    上一页
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setCurrentPage(p)}
                      className={`w-6 h-6 rounded font-medium border text-[11px] ${
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
                    className="px-2 py-0.5 bg-white border border-slate-300 rounded text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 flex items-center gap-1"
                  >
                    下一页
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT TABLE: 检验项目列表 (Linked Test Items for highlighted apply order matching image_df1f50bf.png) */}
          <div className="w-80 bg-white border border-slate-200 rounded-lg shadow-2xs flex flex-col overflow-hidden shrink-0">
            {/* Header */}
            <div className="bg-slate-100/90 border-b border-slate-200 px-3 py-2 flex items-center justify-between shrink-0">
              <div>
                <h3 className="font-semibold text-slate-800">检验项目列表</h3>
                {selectedApplyItem && (
                  <p className="text-[10px] text-sky-700 font-mono font-medium truncate max-w-[200px]">
                    [{selectedApplyItem.code}] {selectedApplyItem.name}
                  </p>
                )}
              </div>

              {selectedApplyItem && (
                <button
                  onClick={() => {
                    setNewLinkedItemData({
                      itemCode: '1018',
                      itemName: '直接胆红素',
                      englishName: 'DBIL',
                      unit: 'μmol/L',
                      isDefault: true,
                    });
                    setShowLinkItemModal(true);
                  }}
                  className="p-1 text-sky-600 hover:bg-sky-50 rounded transition-colors"
                  title="关联新检验项目"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Content Table */}
            <div className="flex-1 overflow-auto">
              {!selectedApplyItem ? (
                <div className="p-8 text-center text-slate-400">
                  请选择左侧某项检验申请
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 sticky top-0">
                      <th className="py-2 px-2.5 border-r border-slate-200 w-20">项目代码</th>
                      <th className="py-2 px-2.5 border-r border-slate-200">项目名称</th>
                      <th className="py-2 px-2.5 text-center w-16">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedApplyItem.linkedItems.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="py-8 text-center text-slate-400">
                          暂无关联项目
                        </td>
                      </tr>
                    ) : (
                      selectedApplyItem.linkedItems.map((linked) => (
                        <tr key={linked.id} className="hover:bg-slate-50">
                          <td className="py-2 px-2.5 border-r border-slate-100 font-mono font-medium text-slate-700">
                            {linked.itemCode}
                          </td>
                          <td className="py-2 px-2.5 border-r border-slate-100 text-slate-800">
                            <div className="font-medium">{linked.itemName}</div>
                            {linked.englishName && (
                              <div className="text-[10px] text-slate-400 font-mono">
                                {linked.englishName}
                              </div>
                            )}
                          </td>
                          <td className="py-2 px-2.5 text-center">
                            <button
                              onClick={() => handleRemoveLinkedItem(linked.id)}
                              className="text-rose-600 hover:text-rose-800 hover:underline"
                            >
                              移除
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}
            </div>

            {/* Footer summary */}
            {selectedApplyItem && (
              <div className="p-2.5 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex justify-between items-center shrink-0">
                <span>关联项目数: {selectedApplyItem.linkedItems.length} 项</span>
                <button
                  onClick={() => {
                    setNewLinkedItemData({
                      itemCode: '',
                      itemName: '',
                      englishName: '',
                      unit: '',
                      isDefault: true,
                    });
                    setShowLinkItemModal(true);
                  }}
                  className="text-sky-600 hover:underline font-medium"
                >
                  + 新增关联
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* Modal: Add / Edit Test Apply (Data cleared when opening Add) */}
      {/* ========================================================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-200 w-full max-w-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-sky-700 text-white px-5 py-3.5 flex items-center justify-between shrink-0">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <Plus className="w-4 h-4" />
                {editingApplyItem ? '编辑检验申请字典' : '新增检验申请字典'}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-white/80 hover:text-white transition-colors p-1 rounded hover:bg-sky-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveApplyForm} className="p-5 space-y-4 max-h-[80vh] overflow-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">
                    <span className="text-rose-500">*</span> 业务系统
                  </label>
                  <select
                    value={formData.system}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        system: e.target.value as any,
                      }))
                    }
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-sky-500 outline-none"
                  >
                    <option value="临生免">临生免</option>
                    <option value="微生物">微生物</option>
                    <option value="骨髓细胞形态学">骨髓细胞形态学</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">
                    <span className="text-rose-500">*</span> 业务小组
                  </label>
                  <select
                    value={formData.group}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        group: e.target.value as any,
                      }))
                    }
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-sky-500 outline-none"
                  >
                    <option value="生化">生化</option>
                    <option value="临检">临检</option>
                    <option value="免疫">免疫</option>
                    <option value="凝血">凝血</option>
                    <option value="微生物">微生物</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">
                    <span className="text-rose-500">*</span> 申请编码
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
                    placeholder="例如: APP-1006"
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs font-mono focus:ring-1 focus:ring-sky-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">
                    <span className="text-rose-500">*</span> 申请名称
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="例如: 胆红素全套测定"
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-sky-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">拼音简码</label>
                  <input
                    type="text"
                    value={formData.pinyinCode}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        pinyinCode: e.target.value,
                      }))
                    }
                    placeholder="例如: DHRSQT"
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs font-mono focus:ring-1 focus:ring-sky-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">五笔简码</label>
                  <input
                    type="text"
                    value={formData.wubiCode}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        wubiCode: e.target.value,
                      }))
                    }
                    placeholder="例如: FDCG"
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs font-mono focus:ring-1 focus:ring-sky-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">采集容器</label>
                  <input
                    type="text"
                    value={formData.container}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        container: e.target.value,
                      }))
                    }
                    placeholder="例如: 黄头管(促凝胶SST 4ml)"
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-sky-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">标本类型</label>
                  <input
                    type="text"
                    value={formData.specimenType}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        specimenType: e.target.value,
                      }))
                    }
                    placeholder="例如: 血清"
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-sky-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">适用性别</label>
                  <select
                    value={formData.applicableGender}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        applicableGender: e.target.value as any,
                      }))
                    }
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-sky-500 outline-none"
                  >
                    <option value="不区分">不区分</option>
                    <option value="男">男</option>
                    <option value="女">女</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">外检项目</label>
                  <select
                    value={formData.isOutsourced}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        isOutsourced: e.target.value as any,
                      }))
                    }
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-sky-500 outline-none"
                  >
                    <option value="否">否 (本院检验)</option>
                    <option value="是">是 (外送第三方实验室)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">试剂成本 (元)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.costPrice}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        costPrice: e.target.value,
                      }))
                    }
                    placeholder="例如: 25.00"
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs font-mono focus:ring-1 focus:ring-sky-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">收费价格 (元)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.chargePrice}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        chargePrice: e.target.value,
                      }))
                    }
                    placeholder="例如: 65.00"
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs font-mono focus:ring-1 focus:ring-sky-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">说明与备注</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      notes: e.target.value,
                    }))
                  }
                  placeholder="可填写该医嘱申请组合的临床适应症与注意事项..."
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
                  保存字典
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* Modal: Link Item to Order */}
      {/* ========================================================= */}
      {showLinkItemModal && selectedApplyItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-sky-700 text-white px-5 py-3.5 flex items-center justify-between shrink-0">
              <h3 className="font-semibold text-sm">
                关联检验项目 - [{selectedApplyItem.code}] {selectedApplyItem.name}
              </h3>
              <button
                onClick={() => setShowLinkItemModal(false)}
                className="text-white/80 hover:text-white transition-colors p-1 rounded hover:bg-sky-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLinkedItem} className="p-5 space-y-4">
              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  <span className="text-rose-500">*</span> 项目代码
                </label>
                <input
                  type="text"
                  required
                  value={newLinkedItemData.itemCode}
                  onChange={(e) =>
                    setNewLinkedItemData((prev) => ({
                      ...prev,
                      itemCode: e.target.value,
                    }))
                  }
                  placeholder="例如: 1018"
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
                  value={newLinkedItemData.itemName}
                  onChange={(e) =>
                    setNewLinkedItemData((prev) => ({
                      ...prev,
                      itemName: e.target.value,
                    }))
                  }
                  placeholder="例如: 直接胆红素"
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-sky-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">英文简称</label>
                <input
                  type="text"
                  value={newLinkedItemData.englishName}
                  onChange={(e) =>
                    setNewLinkedItemData((prev) => ({
                      ...prev,
                      englishName: e.target.value,
                    }))
                  }
                  placeholder="例如: DBIL"
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs font-mono focus:ring-1 focus:ring-sky-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">默认选中</label>
                <select
                  value={newLinkedItemData.isDefault ? '是' : '否'}
                  onChange={(e) =>
                    setNewLinkedItemData((prev) => ({
                      ...prev,
                      isDefault: e.target.value === '是',
                    }))
                  }
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-sky-500 outline-none"
                >
                  <option value="是">是 (开单默认包含)</option>
                  <option value="否">否 (选配项)</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowLinkItemModal(false)}
                  className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded font-medium shadow-2xs transition-colors"
                >
                  确认关联
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
              <h3 className="font-semibold text-sm">确认删除此检验申请字典?</h3>
            </div>
            <p className="text-xs text-slate-600">
              您确定要删除申请字典 <strong className="text-slate-800">[{itemToDelete.code}] {itemToDelete.name}</strong> 吗？删除后此申请下的关联项目也会被一并取消。
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
