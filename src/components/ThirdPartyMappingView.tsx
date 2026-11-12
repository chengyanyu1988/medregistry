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
  FileText,
  CheckCircle2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Activity,
  Layers,
  Save,
  Network,
  Download,
  Upload,
  FolderOpen,
  ChevronDown,
  Sparkles,
  Link2,
  Link2Off,
  User,
  Sliders,
  Filter,
} from './MenuIcon';
import { UserProfile } from '../types/navigation';
import {
  MappingCategory,
  ThirdPartySystem,
  MappingItem,
  INITIAL_THIRD_PARTY_SYSTEMS,
  INITIAL_MAPPING_ITEMS,
  LOCAL_OPTIONS_LOOKUP,
} from '../data/thirdPartyMappingData';

interface ThirdPartyMappingViewProps {
  user?: UserProfile;
  triggerAction: (msg: string) => void;
}

export const ThirdPartyMappingView: React.FC<ThirdPartyMappingViewProps> = ({
  user,
  triggerAction,
}) => {
  // Systems & Mappings Datasets
  const [systems, setSystems] = useState<ThirdPartySystem[]>(INITIAL_THIRD_PARTY_SYSTEMS);
  const [mappingItems, setMappingItems] = useState<MappingItem[]>(INITIAL_MAPPING_ITEMS);

  // Active Selected Tree Node: System & Category
  const [selectedSystemId, setSelectedSystemId] = useState<string>('SYS-HIS');
  const [selectedCategory, setSelectedCategory] = useState<MappingCategory>('检验申请');

  // Top Filter States
  const [selectedHospitalUnit, setSelectedHospitalUnit] = useState<string>('中心医院');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [onlyUnmapped, setOnlyUnmapped] = useState<boolean>(false);

  // Expanded Systems in Left Tree
  const [expandedSystemIds, setExpandedSystemIds] = useState<string[]>([
    'SYS-HIS',
    'SYS-PE',
    'SYS-EMR',
    'SYS-RTHIS',
  ]);

  // Pagination State (10 items per page)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  // Modals State
  const [isAddSystemModalOpen, setIsAddSystemModalOpen] = useState<boolean>(false);
  const [newSystemForm, setNewSystemForm] = useState({
    code: '05',
    name: '',
    vendor: '',
  });

  const [isAddMappingModalOpen, setIsAddMappingModalOpen] = useState<boolean>(false);
  const [newMappingForm, setNewMappingForm] = useState({
    thirdPartyCode: '',
    thirdPartyName: '',
    localCode: '',
    localName: '',
  });

  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);
  const [importText, setImportText] = useState<string>('');

  const [deleteConfirmTarget, setDeleteConfirmTarget] = useState<{ id: string; name: string } | null>(
    null
  );
  const [deleteSystemConfirm, setDeleteSystemConfirm] = useState<ThirdPartySystem | null>(null);

  // In-page Toast Notification (replacing window.alert)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'info' | 'warning' } | null>(
    null
  );

  const showToast = (msg: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setToast({ msg, type });
    triggerAction(msg);
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Toggle Left Tree Accordion
  const toggleSystemExpand = (sysId: string) => {
    setExpandedSystemIds(prev =>
      prev.includes(sysId) ? prev.filter(id => id !== sysId) : [...prev, sysId]
    );
  };

  // Selected Active System Object
  const activeSystem = useMemo(() => {
    return systems.find(s => s.id === selectedSystemId) || systems[0] || {
      id: 'SYS-HIS',
      code: '01',
      name: '01 HIS系统',
      vendor: '',
      version: '',
      categories: ['标本类型', '检验申请', '科室', '病区'],
    };
  }, [systems, selectedSystemId]);

  // Filtered Mapping Items for Right Table
  const filteredMappingItems = useMemo(() => {
    return mappingItems.filter(item => {
      // System & Category Filter
      if (item.systemId !== selectedSystemId || item.category !== selectedCategory) {
        return false;
      }
      // Unmapped Filter
      if (onlyUnmapped && item.isMapped) {
        return false;
      }
      // Search Keyword (Third Party or Local)
      if (searchKeyword.trim()) {
        const kw = searchKeyword.toLowerCase();
        const match =
          item.thirdPartyCode.toLowerCase().includes(kw) ||
          item.thirdPartyName.toLowerCase().includes(kw) ||
          item.localCode.toLowerCase().includes(kw) ||
          item.localName.toLowerCase().includes(kw) ||
          item.mappedBy.toLowerCase().includes(kw);
        if (!match) return false;
      }
      return true;
    });
  }, [mappingItems, selectedSystemId, selectedCategory, onlyUnmapped, searchKeyword]);

  // Paginated List
  const totalPages = Math.ceil(filteredMappingItems.length / pageSize) || 1;
  const paginatedMappingItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredMappingItems.slice(start, start + pageSize);
  }, [filteredMappingItems, currentPage, pageSize]);

  // Current operator name
  const currentOperator = user?.name ? `${user.name}主任检验师` : '郭彩霞主任医师';

  // Handle Query
  const handleQuery = () => {
    setCurrentPage(1);
    showToast(`查询成功：当前系统 [${activeSystem.name}] - 类别 [${selectedCategory}]`, 'info');
  };

  // Change Pair Local Dropdown Select
  const handleLocalSelectChange = (itemId: string, selectedLocalName: string) => {
    const availableOptions = LOCAL_OPTIONS_LOOKUP[selectedCategory] || [];
    const matchedOption = availableOptions.find(opt => opt.name === selectedLocalName);

    setMappingItems(prev =>
      prev.map(item => {
        if (item.id === itemId) {
          if (!selectedLocalName) {
            return {
              ...item,
              localCode: '',
              localName: '',
              isMapped: false,
              mappedBy: '未对照',
              updatedAt: '2026-10-30 11:30:00',
            };
          }
          return {
            ...item,
            localName: selectedLocalName,
            localCode: matchedOption ? matchedOption.code : item.localCode || 'LIS-001',
            isMapped: true,
            mappedBy: currentOperator,
            updatedAt: '2026-10-30 11:30:00',
          };
        }
        return item;
      })
    );
    showToast(`已建立三方字典与本地字典对照: ${selectedLocalName}`, 'success');
  };

  // Unpair Single Item
  const handleUnpairItem = (itemId: string) => {
    setMappingItems(prev =>
      prev.map(item => {
        if (item.id === itemId) {
          return {
            ...item,
            localCode: '',
            localName: '',
            isMapped: false,
            mappedBy: '未对照',
            updatedAt: '2026-10-30 11:35:00',
          };
        }
        return item;
      })
    );
    showToast('已解除该项三方系统对照关系', 'warning');
  };

  // Save All Mappings Button
  const handleSaveAllMappings = () => {
    showToast(`【${activeSystem.name}】[${selectedCategory}] 对照设置已成功保存至核心LIS数据库！`, 'success');
  };

  // Auto Match Pair Action
  const handleAutoMatch = () => {
    let matchCount = 0;
    const availableOptions = LOCAL_OPTIONS_LOOKUP[selectedCategory] || [];

    setMappingItems(prev =>
      prev.map(item => {
        if (item.systemId === selectedSystemId && item.category === selectedCategory && !item.isMapped) {
          const directMatch = availableOptions.find(
            opt => opt.name.includes(item.thirdPartyName) || item.thirdPartyName.includes(opt.name)
          );
          if (directMatch) {
            matchCount++;
            return {
              ...item,
              localCode: directMatch.code,
              localName: directMatch.name,
              isMapped: true,
              mappedBy: '智能对齐引擎',
              updatedAt: '2026-10-30 11:40:00',
            };
          }
        }
        return item;
      })
    );

    if (matchCount > 0) {
      showToast(`智能对齐完成：成功自动匹配并对齐 ${matchCount} 项对照关系！`, 'success');
    } else {
      showToast(`当前未找到可直接模糊对齐的词条，建议手动下拉选取对照`, 'info');
    }
  };

  // Save New System Modal Form
  const handleSaveNewSystem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSystemForm.name.trim()) {
      showToast('请输入系统名称', 'warning');
      return;
    }
    const newSys: ThirdPartySystem = {
      id: `SYS-${Date.now()}`,
      code: newSystemForm.code || `0${systems.length + 1}`,
      name: `${newSystemForm.code || `0${systems.length + 1}`} ${newSystemForm.name}`,
      vendor: newSystemForm.vendor || '通用第三方系统',
      version: 'v1.0.0',
      categories: ['标本类型', '检验申请', '科室', '病区'],
    };

    setSystems(prev => [...prev, newSys]);
    setSelectedSystemId(newSys.id);
    setExpandedSystemIds(prev => [...prev, newSys.id]);
    setIsAddSystemModalOpen(false);
    setNewSystemForm({ code: `0${systems.length + 2}`, name: '', vendor: '' });
    showToast(`成功新增对接第三方系统: ${newSys.name}`, 'success');
  };

  // Delete Selected System
  const handleDeleteCurrentSystem = () => {
    if (systems.length <= 1) {
      showToast('至少需保留一个对接系统，无法删除', 'warning');
      return;
    }
    setDeleteSystemConfirm(activeSystem);
  };

  const confirmDeleteSystem = () => {
    if (!deleteSystemConfirm) return;
    const sysId = deleteSystemConfirm.id;
    const sysName = deleteSystemConfirm.name;
    const remaining = systems.filter(s => s.id !== sysId);
    setSystems(remaining);
    setMappingItems(prev => prev.filter(m => m.systemId !== sysId));
    if (remaining.length > 0) {
      setSelectedSystemId(remaining[0].id);
    }
    setDeleteSystemConfirm(null);
    showToast(`已成功删除第三方系统【${sysName}】及关联对照数据`, 'warning');
  };

  // Save New Mapping Entry Modal Form
  const handleSaveNewMapping = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMappingForm.thirdPartyCode.trim() || !newMappingForm.thirdPartyName.trim()) {
      showToast('请输入三方编码与名称', 'warning');
      return;
    }

    const newItem: MappingItem = {
      id: `MAP-${Date.now()}`,
      systemId: selectedSystemId,
      systemName: activeSystem.name,
      category: selectedCategory,
      thirdPartyCode: newMappingForm.thirdPartyCode,
      thirdPartyName: newMappingForm.thirdPartyName,
      localCode: newMappingForm.localCode,
      localName: newMappingForm.localName,
      isMapped: !!newMappingForm.localName,
      mappedBy: newMappingForm.localName ? currentOperator : '未对照',
      updatedAt: '2026-10-30 11:45:00',
    };

    setMappingItems(prev => [newItem, ...prev]);
    setIsAddMappingModalOpen(false);
    setNewMappingForm({ thirdPartyCode: '', thirdPartyName: '', localCode: '', localName: '' });
    showToast(`成功添加三方对照项: ${newItem.thirdPartyName}`, 'success');
  };

  // Handle Import
  const handleImportSubmit = () => {
    if (!importText.trim()) {
      showToast('请输入或粘贴三方数据内容', 'warning');
      return;
    }
    const lines = importText.split('\n').filter(l => l.trim().length > 0);
    const newItems: MappingItem[] = [];
    lines.forEach((line, index) => {
      const parts = line.split(/[,\t]/).map(s => s.trim());
      if (parts.length >= 2) {
        const code = parts[0];
        const name = parts[1];
        newItems.push({
          id: `MAP-IMP-${Date.now()}-${index}`,
          systemId: selectedSystemId,
          systemName: activeSystem.name,
          category: selectedCategory,
          thirdPartyCode: code,
          thirdPartyName: name,
          localCode: '',
          localName: '',
          isMapped: false,
          mappedBy: '导入未对照',
          updatedAt: '2026-10-30 11:50:00',
        });
      }
    });

    if (newItems.length > 0) {
      setMappingItems(prev => [...newItems, ...prev]);
      setIsImportModalOpen(false);
      setImportText('');
      showToast(`成功导入 ${newItems.length} 条三方系统对照原始记录！`, 'success');
    } else {
      showToast('未识别到有效格式数据，请使用“编码,名称”格式', 'warning');
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-800 font-sans p-4 space-y-3.5 overflow-hidden">
      {/* Toast Notification Banner */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2.5 px-4 py-3 rounded-lg shadow-xl text-sm font-medium animate-in fade-in slide-in-from-top-4 duration-200 border bg-white">
          {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
          {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />}
          {toast.type === 'info' && <Activity className="w-5 h-5 text-blue-600 shrink-0" />}
          <span className="text-slate-800">{toast.msg}</span>
          <button onClick={() => setToast(null)} className="ml-2 text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Filter Bar (Strictly matching screenshot: 单位名称 下拉, 查询 按钮, 右侧 导入, 保存对照) */}
      <div className="bg-white rounded-lg shadow-xs border border-slate-200 px-4 py-3 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <label className="text-slate-700 font-medium text-xs sm:text-sm shrink-0">单位名称</label>
            <select
              value={selectedHospitalUnit}
              onChange={e => setSelectedHospitalUnit(e.target.value)}
              className="border border-slate-300 rounded px-3 py-1.5 bg-white text-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
            >
              <option value="中心医院">中心医院</option>
              <option value="东城第一分院">东城第一分院</option>
              <option value="滨海妇女儿童院区">滨海妇女儿童院区</option>
            </select>
            <button
              onClick={handleQuery}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs sm:text-sm font-medium transition flex items-center gap-1 shadow-xs"
            >
              <Search className="w-3.5 h-3.5" />
              <span>查询</span>
            </button>
          </div>

          <div className="h-5 w-px bg-slate-200 hidden md:block" />

          {/* Keyword Search & Filter */}
          <div className="flex items-center space-x-2">
            <div className="relative w-56 sm:w-64">
              <input
                type="text"
                placeholder="搜索编码 / 名称 / 对照人..."
                value={searchKeyword}
                onChange={e => setSearchKeyword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleQuery()}
                className="w-full border border-slate-300 rounded pl-3 pr-8 py-1.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-2.5 top-2" />
            </div>

            <label className="flex items-center space-x-1.5 cursor-pointer text-slate-600 select-none text-xs">
              <input
                type="checkbox"
                checked={onlyUnmapped}
                onChange={e => setOnlyUnmapped(e.target.checked)}
                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span>仅显示未对照</span>
            </label>
          </div>
        </div>

        {/* Top Right Action Buttons (Screenshot: 导入, 保存对照) */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleAutoMatch}
            className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded text-xs font-semibold flex items-center gap-1 transition"
            title="根据名称智能相似度自动匹配本地代码"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>智能对齐</span>
          </button>

          <button
            onClick={() => setIsImportModalOpen(true)}
            className="px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded text-xs font-semibold flex items-center gap-1.5 transition shadow-xs"
          >
            <Upload className="w-3.5 h-3.5 text-slate-600" />
            <span>导入</span>
          </button>

          <button
            onClick={() => {
              setNewMappingForm({
                thirdPartyCode: `00${mappingItems.length + 30}`,
                thirdPartyName: '',
                localCode: '',
                localName: '',
              });
              setIsAddMappingModalOpen(true);
            }}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold flex items-center gap-1 transition shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>添加对照项</span>
          </button>

          <button
            onClick={handleSaveAllMappings}
            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded text-xs sm:text-sm flex items-center gap-1.5 shadow-xs transition"
          >
            <Save className="w-3.5 h-3.5" />
            <span>保存对照</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Area: Left System Tree (1/4) + Right Mapping Table (3/4) */}
      <div className="grid grid-cols-12 gap-3.5 flex-1 min-h-0">
        {/* LEFT PANEL: 系统列表 Tree (Screenshot structure) */}
        <div className="col-span-12 md:col-span-3 bg-white rounded-lg shadow-xs border border-slate-200 flex flex-col overflow-hidden">
          {/* Header with Title and Action Buttons (Screenshot: 系统列表 + [新增] [删除]) */}
          <div className="p-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
            <div className="flex items-center space-x-1.5">
              <Network className="w-4 h-4 text-emerald-600" />
              <span className="font-bold text-slate-800 text-sm">系统列表</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <button
                onClick={() => setIsAddSystemModalOpen(true)}
                className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold transition flex items-center gap-0.5 shadow-xs"
              >
                <Plus className="w-3 h-3" />
                <span>新增</span>
              </button>
              <button
                onClick={handleDeleteCurrentSystem}
                className="px-2.5 py-1 bg-white hover:bg-rose-50 text-rose-600 border border-slate-300 hover:border-rose-200 rounded text-xs font-semibold transition flex items-center gap-0.5"
                title="删除当前选中的对接系统"
              >
                <Trash2 className="w-3 h-3" />
                <span>删除</span>
              </button>
            </div>
          </div>

          {/* Tree Node List */}
          <div className="p-2 space-y-1 overflow-y-auto flex-1 text-xs">
            {systems.map(sys => {
              const isExpanded = expandedSystemIds.includes(sys.id);
              const isSystemActive = selectedSystemId === sys.id;
              return (
                <div key={sys.id} className="rounded border border-slate-200/80 overflow-hidden mb-1">
                  {/* System Level Header */}
                  <div
                    onClick={() => {
                      toggleSystemExpand(sys.id);
                      if (selectedSystemId !== sys.id) {
                        setSelectedSystemId(sys.id);
                        setCurrentPage(1);
                      }
                    }}
                    className={`px-3 py-2 font-bold flex items-center justify-between cursor-pointer select-none transition ${
                      isSystemActive
                        ? 'bg-emerald-50 text-emerald-900 border-l-4 border-emerald-600'
                        : 'bg-slate-100/80 text-slate-700 hover:bg-slate-200/70'
                    }`}
                  >
                    <div className="flex items-center space-x-1.5">
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${
                          isExpanded ? 'rotate-0' : '-rotate-90'
                        }`}
                      />
                      <span>{sys.name}</span>
                    </div>
                    <span className="text-[11px] font-normal text-slate-400 font-mono">
                      {sys.version}
                    </span>
                  </div>

                  {/* Category Children Nodes */}
                  {isExpanded && (
                    <div className="bg-white py-1 border-t border-slate-100 space-y-0.5">
                      {sys.categories.map(cat => {
                        const isCatSelected = isSystemActive && selectedCategory === cat;
                        // count mapped & total for this category
                        const catItems = mappingItems.filter(
                          m => m.systemId === sys.id && m.category === cat
                        );
                        const mappedCount = catItems.filter(m => m.isMapped).length;

                        return (
                          <div
                            key={cat}
                            onClick={() => {
                              setSelectedSystemId(sys.id);
                              setSelectedCategory(cat);
                              setCurrentPage(1);
                              showToast(`切换至【${sys.name}】 - 分类：${cat}`, 'info');
                            }}
                            className={`pl-8 pr-3 py-2 flex items-center justify-between cursor-pointer text-xs transition ${
                              isCatSelected
                                ? 'bg-emerald-600 text-white font-bold'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium'
                            }`}
                          >
                            <span className="flex items-center gap-1.5">
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  isCatSelected ? 'bg-white' : 'bg-slate-400'
                                }`}
                              />
                              <span>{cat}</span>
                            </span>
                            <div className="flex items-center gap-1 text-[11px]">
                              <span
                                className={
                                  isCatSelected
                                    ? 'text-emerald-100'
                                    : mappedCount === catItems.length && catItems.length > 0
                                    ? 'text-emerald-600 font-semibold'
                                    : 'text-slate-400'
                                }
                              >
                                {mappedCount}/{catItems.length}
                              </span>
                              {isCatSelected && <ChevronRight className="w-3.5 h-3.5" />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Left Footer System Info */}
          <div className="p-2.5 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 shrink-0">
            <div>当前系统：<strong className="text-slate-700">{activeSystem.name}</strong></div>
            <div className="text-slate-400 truncate mt-0.5">{activeSystem.vendor}</div>
          </div>
        </div>

        {/* RIGHT PANEL: Mapping Table (Strictly matching screenshot columns) */}
        <div className="col-span-12 md:col-span-9 bg-white rounded-lg shadow-xs border border-slate-200 flex flex-col overflow-hidden">
          {/* Table Header Info Bar */}
          <div className="p-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded text-xs font-mono font-medium">
                  {activeSystem.name}
                </span>
                <span>对照类别: <strong className="text-emerald-700">{selectedCategory}</strong></span>
              </span>
              <span className="text-slate-300">|</span>
              <span className="text-slate-500">
                已完成对照：<strong className="text-emerald-600">{filteredMappingItems.filter(i => i.isMapped).length}</strong> / 共 {filteredMappingItems.length} 条
              </span>
            </div>

            <div className="flex items-center space-x-3 text-slate-500 text-[11px]">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                已对照 ({filteredMappingItems.filter(i => i.isMapped).length})
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                未对照 ({filteredMappingItems.filter(i => !i.isMapped).length})
              </span>
            </div>
          </div>

          {/* Table Body Area */}
          <div className="overflow-x-auto overflow-y-auto flex-1">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100/90 text-slate-700 font-bold border-b border-slate-200 sticky top-0 z-10">
                  {/* Matching exact screenshot column names for active category */}
                  <th className="py-2.5 px-3 w-40">三方系统{selectedCategory}编码</th>
                  <th className="py-2.5 px-3 w-48">三方系统{selectedCategory}名称</th>
                  <th className="py-2.5 px-3 w-64">
                    {selectedCategory}名称 (本院LIS对照匹配)
                  </th>
                  <th className="py-2.5 px-3 w-36">{selectedCategory}编码</th>
                  <th className="py-2.5 px-3 w-24">对照状态</th>
                  <th className="py-2.5 px-3 w-32">对照人</th>
                  <th className="py-2.5 px-3 w-36">更新时间</th>
                  <th className="py-2.5 px-3 text-right w-28">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                {paginatedMappingItems.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-16 text-slate-400">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <FileText className="w-8 h-8 text-slate-300" />
                        <p className="text-sm">暂无相关三方对照记录</p>
                        <p className="text-xs text-slate-400">
                          可点击右上角“添加对照项”手动录入，或点击“导入”批量导入
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedMappingItems.map(item => {
                    const localOptions = LOCAL_OPTIONS_LOOKUP[selectedCategory] || [];
                    return (
                      <tr key={item.id} className="hover:bg-emerald-50/40 transition-colors">
                        {/* 1. 三方编码 (e.g. 0021 from screenshot) */}
                        <td className="py-2.5 px-3 font-mono font-bold text-slate-800">
                          {item.thirdPartyCode}
                        </td>

                        {/* 2. 三方名称 (e.g. 血常规 from screenshot) */}
                        <td className="py-2.5 px-3 font-semibold text-slate-900">
                          {item.thirdPartyName}
                        </td>

                        {/* 3. 本院名称 (Dropdown select e.g. 血常规 from screenshot) */}
                        <td className="py-2.5 px-3">
                          <select
                            value={item.localName}
                            onChange={e => handleLocalSelectChange(item.id, e.target.value)}
                            className={`w-full border rounded px-2.5 py-1.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 transition ${
                              item.isMapped
                                ? 'border-slate-300 bg-white text-slate-900 font-semibold'
                                : 'border-amber-300 bg-amber-50/50 text-amber-800 font-normal'
                            }`}
                          >
                            <option value="">-- 请选择匹配本地字典 --</option>
                            {localOptions.map(opt => (
                              <option key={opt.code} value={opt.name}>
                                [{opt.code}] {opt.name}
                              </option>
                            ))}
                          </select>
                        </td>

                        {/* 4. 本院编码 (e.g. 10003 from screenshot) */}
                        <td className="py-2.5 px-3 font-mono font-bold text-blue-700">
                          {item.localCode ? (
                            <span className="bg-blue-50 border border-blue-200 px-2 py-0.5 rounded text-blue-800 font-mono">
                              {item.localCode}
                            </span>
                          ) : (
                            <span className="text-slate-400 font-normal italic">-</span>
                          )}
                        </td>

                        {/* 5. 对照状态 */}
                        <td className="py-2.5 px-3">
                          {item.isMapped ? (
                            <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-bold text-[11px]">
                              <Link2 className="w-3 h-3 text-emerald-600" />
                              已对照
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded font-bold text-[11px]">
                              <Link2Off className="w-3 h-3 text-amber-600" />
                              未对照
                            </span>
                          )}
                        </td>

                        {/* 6. 对照人 (真实的中文医护人员姓名) */}
                        <td className="py-2.5 px-3 text-slate-700 font-medium whitespace-nowrap">
                          {item.mappedBy}
                        </td>

                        {/* 7. 更新时间 (近期时间 2026年10月) */}
                        <td className="py-2.5 px-3 font-mono text-slate-500 whitespace-nowrap">
                          {item.updatedAt}
                        </td>

                        {/* 8. 操作 */}
                        <td className="py-2.5 px-3 text-right space-x-2 whitespace-nowrap">
                          {item.isMapped && (
                            <button
                              onClick={() => handleUnpairItem(item.id)}
                              className="text-amber-600 hover:text-amber-800 font-medium hover:underline"
                            >
                              解绑
                            </button>
                          )}
                          <button
                            onClick={() => setDeleteConfirmTarget({ id: item.id, name: item.thirdPartyName })}
                            className="text-rose-600 hover:text-rose-800 font-medium hover:underline"
                          >
                            删除
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table Bottom Pagination Bar (10条每页严格分页) */}
          <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600 shrink-0">
            <div className="font-semibold text-emerald-700 flex items-center gap-2">
              <span>合计: {filteredMappingItems.length} 条</span>
              <span className="text-slate-400 font-normal">|</span>
              <span className="text-slate-500 font-normal">
                当前第 {currentPage} / {totalPages} 页 (每页 {pageSize} 条)
              </span>
            </div>

            <div className="flex items-center space-x-1.5">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-2.5 py-1 bg-white border border-slate-300 rounded hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 font-medium transition"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>上一页</span>
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-7 h-7 flex items-center justify-center border rounded text-xs font-semibold transition ${
                    currentPage === page
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-white border-slate-300 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-2.5 py-1 bg-white border border-slate-300 rounded hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 font-medium transition"
              >
                <span>下一页</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL 1: 新增系统 (系统列表顶部「新增」) */}
      {isAddSystemModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <Network className="w-4 h-4 text-emerald-400" />
                新增第三方对接系统
              </h3>
              <button onClick={() => setIsAddSystemModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNewSystem} className="p-4 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">系统序号/编码 *</label>
                  <input
                    type="text"
                    required
                    placeholder="如: 05"
                    value={newSystemForm.code}
                    onChange={e => setNewSystemForm({ ...newSystemForm, code: e.target.value })}
                    className="w-full border border-slate-300 rounded px-3 py-1.5 font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">系统名称 *</label>
                  <input
                    type="text"
                    required
                    placeholder="如: 区域公共卫生平台"
                    value={newSystemForm.name}
                    onChange={e => setNewSystemForm({ ...newSystemForm, name: e.target.value })}
                    className="w-full border border-slate-300 rounded px-3 py-1.5 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">厂商 / 版本 / 接口标准</label>
                <input
                  type="text"
                  placeholder="如: 卫健委信息中心 HL7-CDA v3.0"
                  value={newSystemForm.vendor}
                  onChange={e => setNewSystemForm({ ...newSystemForm, vendor: e.target.value })}
                  className="w-full border border-slate-300 rounded px-3 py-1.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddSystemModalOpen(false)}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-medium transition"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold shadow-xs transition"
                >
                  保存系统
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: 添加对照项 */}
      {isAddMappingModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-400" />
                添加三方系统对照配置项
              </h3>
              <button onClick={() => setIsAddMappingModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNewMapping} className="p-4 space-y-3.5 text-xs">
              <div className="bg-slate-50 p-2.5 rounded border border-slate-200 text-slate-600 flex items-center justify-between">
                <div>所属系统: <strong className="text-slate-900">{activeSystem.name}</strong></div>
                <div>对照类别: <strong className="text-emerald-700">{selectedCategory}</strong></div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">三方系统编码 *</label>
                  <input
                    type="text"
                    required
                    value={newMappingForm.thirdPartyCode}
                    onChange={e => setNewMappingForm({ ...newMappingForm, thirdPartyCode: e.target.value })}
                    className="w-full border border-slate-300 rounded px-3 py-1.5 font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="如: 0033"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">三方系统名称 *</label>
                  <input
                    type="text"
                    required
                    placeholder="如: 创面分泌物细菌培养"
                    value={newMappingForm.thirdPartyName}
                    onChange={e => setNewMappingForm({ ...newMappingForm, thirdPartyName: e.target.value })}
                    className="w-full border border-slate-300 rounded px-3 py-1.5 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">选择匹配本院LIS字典</label>
                <select
                  value={newMappingForm.localName}
                  onChange={e => {
                    const localName = e.target.value;
                    const opts = LOCAL_OPTIONS_LOOKUP[selectedCategory] || [];
                    const matched = opts.find(o => o.name === localName);
                    setNewMappingForm({
                      ...newMappingForm,
                      localName,
                      localCode: matched ? matched.code : '',
                    });
                  }}
                  className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                >
                  <option value="">-- 暂不匹配 (标记为未对照) --</option>
                  {(LOCAL_OPTIONS_LOOKUP[selectedCategory] || []).map(opt => (
                    <option key={opt.code} value={opt.name}>
                      [{opt.code}] {opt.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddMappingModalOpen(false)}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-medium transition"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold shadow-xs transition"
                >
                  保存对照项
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: 导入弹窗 (右上角「导入」) */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <Upload className="w-4 h-4 text-emerald-400" />
                批量导入第三方系统字典
              </h3>
              <button onClick={() => setIsImportModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-3 text-xs text-slate-700">
              <div className="p-2.5 bg-blue-50 border border-blue-200 rounded text-blue-800">
                当前导入目标：<strong>{activeSystem.name}</strong> 的 <strong>[{selectedCategory}]</strong> 分类。
                支持按行粘贴文本（格式为：<code>三方编码,三方名称</code> 或制表符隔开）。
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">粘贴数据内容：</label>
                <textarea
                  rows={6}
                  value={importText}
                  onChange={e => setImportText(e.target.value)}
                  placeholder={`0051,全血降钙素原定量检测\n0052,内毒素定量检测(鲎试剂法)\n0053,白念珠菌菌种快速检测`}
                  className="w-full border border-slate-300 rounded p-2.5 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setImportText(
                      `0051,全血降钙素原定量检测(PCT)\n0052,真菌念珠菌抗原快速定性检测\n0053,金葡菌耐药表型检测`
                    );
                  }}
                  className="text-emerald-700 hover:underline"
                >
                  载入示例测试数据
                </button>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsImportModalOpen(false)}
                    className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-medium transition"
                  >
                    取消
                  </button>
                  <button
                    type="button"
                    onClick={handleImportSubmit}
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold shadow-xs transition"
                  >
                    确认导入
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: 删除系统确认 (系统列表顶部「删除」) */}
      {deleteSystemConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="p-4 bg-rose-600 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <Trash2 className="w-4 h-4" />
                删除第三方对接系统确认
              </h3>
              <button onClick={() => setDeleteSystemConfirm(null)} className="text-rose-200 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 space-y-3 text-xs text-slate-700">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-rose-100 text-rose-600 rounded-full shrink-0 mt-0.5">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <p className="leading-relaxed">
                    您确定要删除系统 <strong className="text-slate-900 font-bold">“{deleteSystemConfirm.name}”</strong> 吗？
                  </p>
                  <p className="text-rose-600 mt-1 font-medium">
                    删除后将同时清除该系统下所有已建立的标本、申请、科室与病区对照关系！
                  </p>
                </div>
              </div>
            </div>
            <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-end space-x-2">
              <button
                onClick={() => setDeleteSystemConfirm(null)}
                className="px-3.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded text-xs font-medium transition"
              >
                取消
              </button>
              <button
                onClick={confirmDeleteSystem}
                className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded text-xs font-bold shadow-xs transition"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: 删除单项对照条目确认 */}
      {deleteConfirmTarget && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="p-4 bg-rose-600 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <Trash2 className="w-4 h-4" />
                删除对照关系条目
              </h3>
              <button onClick={() => setDeleteConfirmTarget(null)} className="text-rose-200 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 space-y-3 text-xs text-slate-700">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-rose-100 text-rose-600 rounded-full shrink-0 mt-0.5">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <p className="leading-relaxed">
                    您确定要删除三方项目 <strong className="text-slate-900 font-bold">“{deleteConfirmTarget.name}”</strong> 的对照记录吗？
                  </p>
                  <p className="text-slate-500 mt-1">
                    删除后该条目将从对照列表中移除。
                  </p>
                </div>
              </div>
            </div>
            <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-end space-x-2">
              <button
                onClick={() => setDeleteConfirmTarget(null)}
                className="px-3.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded text-xs font-medium transition"
              >
                取消
              </button>
              <button
                onClick={() => {
                  const id = deleteConfirmTarget.id;
                  setMappingItems(prev => prev.filter(item => item.id !== id));
                  showToast(`已删除三方对照条目: ${deleteConfirmTarget.name}`, 'warning');
                  setDeleteConfirmTarget(null);
                }}
                className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded text-xs font-bold shadow-xs transition"
              >
                确定删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
