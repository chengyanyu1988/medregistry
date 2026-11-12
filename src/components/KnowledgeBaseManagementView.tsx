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
  Activity,
  Layers,
  Save,
  BookOpen,
  HelpCircle,
  ShieldAlert,
  Pipette,
  Sliders,
  Sparkles
} from './MenuIcon';
import { UserProfile } from '../types/navigation';
import {
  KBCategory,
  CollectionKBItem,
  IndicatorKBItem,
  RejectionKBItem,
  CrisisGuidelineKBItem,
  INITIAL_COLLECTION_KB,
  INITIAL_INDICATOR_KB,
  INITIAL_REJECTION_KB,
  INITIAL_CRISIS_KB
} from '../data/knowledgeBaseData';

interface KnowledgeBaseManagementViewProps {
  user: UserProfile;
  triggerAction: (msg: string) => void;
}

export const KnowledgeBaseManagementView: React.FC<KnowledgeBaseManagementViewProps> = ({
  user,
  triggerAction,
}) => {
  // Category Selection
  const [activeCategory, setActiveCategory] = useState<KBCategory>('采集知识库');
  const [categoryFilterText, setCategoryFilterText] = useState<string>('');

  // Top Filter Bar State (Matching screenshot: 单位名称, 采集方式, 标本类型)
  const [selectedHospitalUnit, setSelectedHospitalUnit] = useState<string>('中心医院');
  const [filterTitle, setFilterTitle] = useState<string>('');
  const [filterSpecimenType, setFilterSpecimenType] = useState<string>('');

  // Datasets State
  const [collectionList, setCollectionList] = useState<CollectionKBItem[]>(INITIAL_COLLECTION_KB);
  const [indicatorList, setIndicatorList] = useState<IndicatorKBItem[]>(INITIAL_INDICATOR_KB);
  const [rejectionList, setRejectionList] = useState<RejectionKBItem[]>(INITIAL_REJECTION_KB);
  const [crisisList, setCrisisList] = useState<CrisisGuidelineKBItem[]>(INITIAL_CRISIS_KB);

  // Active Selected Item for Right Detail Panel
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>(INITIAL_COLLECTION_KB[0]?.id || '');
  const [selectedIndicatorId, setSelectedIndicatorId] = useState<string>(INITIAL_INDICATOR_KB[0]?.id || '');
  const [selectedRejectionId, setSelectedRejectionId] = useState<string>(INITIAL_REJECTION_KB[0]?.id || '');
  const [selectedCrisisId, setSelectedCrisisId] = useState<string>(INITIAL_CRISIS_KB[0]?.id || '');

  // Pagination State (Strict requirement: 10 items per page)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  // Add / Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [formCategory, setFormCategory] = useState<KBCategory>('采集知识库');
  const [formTitle, setFormTitle] = useState<string>('');
  const [formSubText, setFormSubText] = useState<string>('');
  const [formUnitOrTube, setFormUnitOrTube] = useState<string>('');
  const [formStepsText, setFormStepsText] = useState<string>('');
  const [formPrecautionsText, setFormPrecautionsText] = useState<string>('');
  const [formAuthor, setFormAuthor] = useState<string>('张珊');

  // Categories for Left Sidebar
  const categories: KBCategory[] = [
    '采集知识库',
    '检验指标临床知识库',
    '标本不合格拒收标准',
    '危急值处置指南'
  ];

  const filteredCategories = useMemo(() => {
    if (!categoryFilterText.trim()) return categories;
    return categories.filter(c => c.includes(categoryFilterText.trim()));
  }, [categoryFilterText]);

  // Current Active Category List
  const currentCategoryList = useMemo(() => {
    let list: any[] = [];
    if (activeCategory === '采集知识库') list = collectionList;
    else if (activeCategory === '检验指标临床知识库') list = indicatorList;
    else if (activeCategory === '标本不合格拒收标准') list = rejectionList;
    else if (activeCategory === '危急值处置指南') list = crisisList;

    return list.filter(item => {
      if (filterTitle.trim()) {
        const kw = filterTitle.toLowerCase();
        const matchName = (item.title || '').toLowerCase().includes(kw) || (item.englishName || '').toLowerCase().includes(kw);
        if (!matchName) return false;
      }
      if (filterSpecimenType.trim()) {
        const kw = filterSpecimenType.toLowerCase();
        const matchType = (item.specimenType || '').toLowerCase().includes(kw) || (item.tubeType || '').toLowerCase().includes(kw);
        if (!matchType) return false;
      }
      return true;
    });
  }, [
    activeCategory,
    collectionList,
    indicatorList,
    rejectionList,
    crisisList,
    filterTitle,
    filterSpecimenType
  ]);

  // Pagination Calculation
  const totalPages = Math.ceil(currentCategoryList.length / pageSize) || 1;
  const paginatedList = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return currentCategoryList.slice(start, start + pageSize);
  }, [currentCategoryList, currentPage, pageSize]);

  // Query Handler
  const handleQuery = () => {
    setCurrentPage(1);
    triggerAction(`查询知识库 (类型: ${activeCategory}, 关键字: ${filterTitle || '无'}, 标本类型: ${filterSpecimenType || '无'})`);
  };

  // Switch Category
  const handleSelectCategory = (cat: KBCategory) => {
    setActiveCategory(cat);
    setCurrentPage(1);
    triggerAction(`切换知识库分类: ${cat}`);
  };

  // Open Modal for Create
  const handleOpenCreateModal = () => {
    setEditingItemId(null);
    setFormCategory(activeCategory);
    setFormAuthor('张珊');
    if (activeCategory === '采集知识库') {
      setFormTitle('肘前静脉采集标准');
      setFormSubText('全血/血清');
      setFormUnitOrTube('黄头管(促凝剂 4ml)');
      setFormStepsText('1. 查对申请单与患者身份信息。\n2. 选择血管打止血带。\n3. 消毒穿刺部位，持针进针。');
      setFormPrecautionsText('1. 止血带结扎不超过1分钟。\n2. 采血后颠倒混匀。');
    } else if (activeCategory === '检验指标临床知识库') {
      setFormTitle('血清总胆红素 (TBIL)');
      setFormSubText('3.4 - 20.5 μmol/L');
      setFormUnitOrTube('μmol/L');
      setFormStepsText('1. 肝细胞损伤及胆道梗阻指标。\n2. 溶血性黄疸、肝细胞性黄疸及梗阻性黄疸鉴别。');
      setFormPrecautionsText('1. 标本须避光保存，光照导致胆红素分解。\n2. 重度溶血干扰测定。');
    } else if (activeCategory === '标本不合格拒收标准') {
      setFormTitle('标本量严重欠量');
      setFormSubText('全血/凝血');
      setFormUnitOrTube('抗凝试管');
      setFormStepsText('1. 采血量低于刻度线30%以上。\n2. 造成抗凝剂过量，严重干扰测定。');
      setFormPrecautionsText('1. 拒收退单，联系临床护士重新采血。');
    } else {
      setFormTitle('血清血糖 (GLU) 极限危急值');
      setFormSubText('低血糖 < 2.2 mmol/L / 高血糖 > 22.2 mmol/L');
      setFormUnitOrTube('mmol/L');
      setFormStepsText('1. 立即原管复查，核对标本与输液史。\n2. 5分钟内向临床科室电话直报，口述双核对。\n3. 临床30分钟内完成闭环处置。');
      setFormPrecautionsText('1. 低血糖极易发生低血糖昏迷；高血糖易发生酮症酸中毒。');
    }
    setIsEditModalOpen(true);
  };

  // Open Modal for Edit
  const handleOpenEditModal = (item: any) => {
    setEditingItemId(item.id);
    setFormCategory(activeCategory);
    setFormTitle(item.title);
    setFormAuthor(item.author || '张珊');
    if (activeCategory === '采集知识库') {
      setFormSubText(item.specimenType);
      setFormUnitOrTube(item.tubeType);
      setFormStepsText(item.steps ? item.steps.join('\n') : '');
      setFormPrecautionsText(item.precautions ? item.precautions.join('\n') : '');
    } else if (activeCategory === '检验指标临床知识库') {
      setFormSubText(item.refRange);
      setFormUnitOrTube(item.unit);
      setFormStepsText(item.clinicalSignificance ? item.clinicalSignificance.join('\n') : '');
      setFormPrecautionsText(item.interferingFactors ? item.interferingFactors.join('\n') : '');
    } else if (activeCategory === '标本不合格拒收标准') {
      setFormSubText(item.specimenType);
      setFormUnitOrTube(item.rejectionReason);
      setFormStepsText(item.handlingProcedure ? item.handlingProcedure.join('\n') : '');
      setFormPrecautionsText(item.preventionAdvice || '');
    } else {
      setFormSubText(item.crisisThreshold);
      setFormUnitOrTube(item.clinicalRisk);
      setFormStepsText(item.actionProtocol ? item.actionProtocol.join('\n') : '');
      setFormPrecautionsText(item.notifiedRole || '');
    }
    setIsEditModalOpen(true);
  };

  // Save Modal Form
  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      alert('请输入标题名称');
      return;
    }

    const stepsArray = formStepsText.split('\n').filter(s => s.trim().length > 0);
    const precautionsArray = formPrecautionsText.split('\n').filter(s => s.trim().length > 0);

    if (activeCategory === '采集知识库') {
      if (editingItemId) {
        setCollectionList(prev =>
          prev.map(i =>
            i.id === editingItemId
              ? {
                  ...i,
                  title: formTitle,
                  specimenType: formSubText,
                  tubeType: formUnitOrTube,
                  steps: stepsArray,
                  precautions: precautionsArray,
                  author: formAuthor,
                  updatedAt: '2026-10-30 11:00',
                }
              : i
          )
        );
      } else {
        const newItem: CollectionKBItem = {
          id: `COL-${Date.now()}`,
          category: '采集知识库',
          title: formTitle,
          specimenType: formSubText || '血液',
          tubeType: formUnitOrTube || '真空采血管',
          storageCondition: '常温2小时内送检',
          steps: stepsArray,
          precautions: precautionsArray,
          author: formAuthor,
          updatedAt: '2026-10-30 11:00',
        };
        setCollectionList(prev => [newItem, ...prev]);
        setSelectedCollectionId(newItem.id);
      }
    } else if (activeCategory === '检验指标临床知识库') {
      if (editingItemId) {
        setIndicatorList(prev =>
          prev.map(i =>
            i.id === editingItemId
              ? {
                  ...i,
                  title: formTitle,
                  refRange: formSubText,
                  unit: formUnitOrTube,
                  clinicalSignificance: stepsArray,
                  interferingFactors: precautionsArray,
                  author: formAuthor,
                  updatedAt: '2026-10-30 11:00',
                }
              : i
          )
        );
      } else {
        const newItem: IndicatorKBItem = {
          id: `IND-${Date.now()}`,
          category: '检验指标临床知识库',
          title: formTitle,
          englishName: 'NEW',
          refRange: formSubText || '参考区间未知',
          unit: formUnitOrTube || 'U/L',
          clinicalSignificance: stepsArray,
          interferingFactors: precautionsArray,
          author: formAuthor,
          updatedAt: '2026-10-30 11:00',
        };
        setIndicatorList(prev => [newItem, ...prev]);
        setSelectedIndicatorId(newItem.id);
      }
    }

    setIsEditModalOpen(false);
    triggerAction(`保存知识库条目: ${formTitle}`);
  };

  // Delete Confirmation Modal Target
  const [deleteConfirmTarget, setDeleteConfirmTarget] = useState<{ id: string; title: string } | null>(null);

  // Delete Item (Triggers Delete Confirmation Modal)
  const handleDeleteItem = (item: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteConfirmTarget({ id: item.id, title: item.title });
  };

  // Get Currently Active Selected Object for Detail Panel
  const activeDetailObject = useMemo(() => {
    if (activeCategory === '采集知识库') {
      return collectionList.find(c => c.id === selectedCollectionId) || collectionList[0];
    } else if (activeCategory === '检验指标临床知识库') {
      return indicatorList.find(i => i.id === selectedIndicatorId) || indicatorList[0];
    } else if (activeCategory === '标本不合格拒收标准') {
      return rejectionList.find(r => r.id === selectedRejectionId) || rejectionList[0];
    } else {
      return crisisList.find(cr => cr.id === selectedCrisisId) || crisisList[0];
    }
  }, [
    activeCategory,
    collectionList,
    indicatorList,
    rejectionList,
    crisisList,
    selectedCollectionId,
    selectedIndicatorId,
    selectedRejectionId,
    selectedCrisisId
  ]);

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-800 font-sans p-4 overflow-y-auto space-y-4">
      {/* Page Header */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-sky-50 text-sky-600 rounded-lg border border-sky-100">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              知识库管理
              <span className="text-xs font-normal text-sky-700 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded-full">
                基础管理
              </span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              汇集临床标本采集规范、检验指标诊断意义、不合格拒收原因与危急值处置标准指南
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleQuery}
            className="flex items-center space-x-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-sm transition"
          >
            <RefreshCw className="w-4 h-4" />
            <span>刷新数据</span>
          </button>
          <button
            onClick={handleOpenCreateModal}
            className="flex items-center space-x-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-md shadow-sm text-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>新增知识库条目</span>
          </button>
        </div>
      </div>

      {/* Top Filter Bar (Matching user screenshot: 单位名称, 采集方式, 标本类型, 查询, 新增) */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-3.5 flex flex-wrap items-center justify-between gap-3 text-sm">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <label className="text-slate-600 font-medium shrink-0">单位名称</label>
            <select
              value={selectedHospitalUnit}
              onChange={e => setSelectedHospitalUnit(e.target.value)}
              className="border border-slate-300 rounded px-3 py-1.5 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="中心医院">中心医院</option>
              <option value="第一分院">第一分院</option>
              <option value="东院区">东院区</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <label className="text-slate-600 font-medium shrink-0">
              {activeCategory === '检验指标临床知识库' ? '指标名称' : '采集方式 / 标题'}
            </label>
            <input
              type="text"
              placeholder="请输入搜索名称..."
              value={filterTitle}
              onChange={e => setFilterTitle(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleQuery()}
              className="border border-slate-300 rounded px-3 py-1.5 text-sm w-48 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="flex items-center space-x-2">
            <label className="text-slate-600 font-medium shrink-0">标本类型</label>
            <input
              type="text"
              placeholder="如: 血液 / 尿液 / 脑脊液"
              value={filterSpecimenType}
              onChange={e => setFilterSpecimenType(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleQuery()}
              className="border border-slate-300 rounded px-3 py-1.5 text-sm w-48 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleQuery}
            className="flex items-center space-x-1 px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded font-medium transition"
          >
            <Search className="w-4 h-4" />
            <span>查询</span>
          </button>
          <button
            onClick={handleOpenCreateModal}
            className="flex items-center space-x-1 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-medium transition"
          >
            <Plus className="w-4 h-4" />
            <span>新增</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Layout: Left Category Nav + Middle Table + Right Detail View */}
      <div className="grid grid-cols-12 gap-4 flex-1">
        {/* LEFT COLUMN: 知识库类型 (Matching user screenshot) */}
        <div className="col-span-12 md:col-span-3 bg-white rounded-lg shadow-sm border border-slate-200 p-3 flex flex-col space-y-3">
          <div className="border-b border-slate-200 pb-2">
            <h2 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-sky-600" />
              知识库类型
            </h2>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="输入名称过滤..."
              value={categoryFilterText}
              onChange={e => setCategoryFilterText(e.target.value)}
              className="w-full border border-slate-300 rounded pl-3 pr-8 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5" />
          </div>

          <div className="space-y-1 overflow-y-auto flex-1">
            {filteredCategories.map(cat => (
              <button
                key={cat}
                onClick={() => handleSelectCategory(cat)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-medium transition flex items-center justify-between ${
                  activeCategory === cat
                    ? 'bg-sky-600 text-white font-bold shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>{cat}</span>
                {activeCategory === cat && <ChevronRight className="w-4 h-4" />}
              </button>
            ))}
          </div>
        </div>

        {/* MIDDLE & RIGHT AREA */}
        <div className="col-span-12 md:col-span-9 grid grid-cols-12 gap-4">
          {/* Middle: Knowledge Table (10 per page pagination) */}
          <div className="col-span-12 lg:col-span-7 bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden flex flex-col">
            <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600">
              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                <Table2 className="w-4 h-4 text-sky-600" />
                {activeCategory}列表
              </span>
              <span>共找到 {currentCategoryList.length} 条知识记录</span>
            </div>

            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                    {activeCategory === '采集知识库' && (
                      <>
                        <th className="py-2.5 px-3">采集方式</th>
                        <th className="py-2.5 px-3">标本类型</th>
                        <th className="py-2.5 px-3">维护人</th>
                        <th className="py-2.5 px-3 text-right">操作</th>
                      </>
                    )}
                    {activeCategory === '检验指标临床知识库' && (
                      <>
                        <th className="py-2.5 px-3">指标名称</th>
                        <th className="py-2.5 px-3">参考区间</th>
                        <th className="py-2.5 px-3">维护人</th>
                        <th className="py-2.5 px-3 text-right">操作</th>
                      </>
                    )}
                    {activeCategory === '标本不合格拒收标准' && (
                      <>
                        <th className="py-2.5 px-3">拒收类型</th>
                        <th className="py-2.5 px-3">适用标本</th>
                        <th className="py-2.5 px-3">维护人</th>
                        <th className="py-2.5 px-3 text-right">操作</th>
                      </>
                    )}
                    {activeCategory === '危急值处置指南' && (
                      <>
                        <th className="py-2.5 px-3">危急值项目</th>
                        <th className="py-2.5 px-3">危急界限</th>
                        <th className="py-2.5 px-3">维护人</th>
                        <th className="py-2.5 px-3 text-right">操作</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-700">
                  {paginatedList.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-12 text-slate-400">
                        暂无相关知识库记录
                      </td>
                    </tr>
                  ) : (
                    paginatedList.map(item => {
                      const isSelected =
                        (activeCategory === '采集知识库' && item.id === selectedCollectionId) ||
                        (activeCategory === '检验指标临床知识库' && item.id === selectedIndicatorId) ||
                        (activeCategory === '标本不合格拒收标准' && item.id === selectedRejectionId) ||
                        (activeCategory === '危急值处置指南' && item.id === selectedCrisisId);

                      return (
                        <tr
                          key={item.id}
                          onClick={() => {
                            if (activeCategory === '采集知识库') setSelectedCollectionId(item.id);
                            else if (activeCategory === '检验指标临床知识库') setSelectedIndicatorId(item.id);
                            else if (activeCategory === '标本不合格拒收标准') setSelectedRejectionId(item.id);
                            else if (activeCategory === '危急值处置指南') setSelectedCrisisId(item.id);
                          }}
                          className={`hover:bg-sky-50/60 cursor-pointer transition-colors ${
                            isSelected ? 'bg-sky-50 font-medium' : ''
                          }`}
                        >
                          <td className="py-3 px-3 font-semibold text-slate-900">
                            <div className="flex items-center gap-1.5">
                              <BookOpen className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                              <span>{item.title}</span>
                            </div>
                          </td>
                          <td className="py-3 px-3 text-slate-600 font-mono">
                            {item.specimenType || item.refRange || item.crisisThreshold || '-'}
                          </td>
                          <td className="py-3 px-3 text-slate-700 font-medium">{item.author || '张珊'}</td>
                          <td className="py-3 px-3 text-right space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenEditModal(item);
                              }}
                              className="text-sky-600 hover:text-sky-800 font-medium"
                            >
                              编辑
                            </button>
                            <button
                              onClick={(e) => handleDeleteItem(item, e)}
                              className="text-rose-600 hover:text-rose-800 font-medium"
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

            {/* Pagination Bar (Requirement: "一页帮我显示10条数据") */}
            <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
              <div className="font-semibold text-sky-700">
                合计: {currentCategoryList.length} 条 (第 {currentPage}/{totalPages} 页，每页 {pageSize} 条)
              </div>

              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-2 py-1 border border-slate-300 rounded hover:bg-slate-100 disabled:opacity-40"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-2 py-1 border rounded text-xs font-medium ${
                      currentPage === page
                        ? 'bg-sky-600 text-white border-sky-600'
                        : 'border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-2 py-1 border border-slate-300 rounded hover:bg-slate-100 disabled:opacity-40"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Detail Content Card (Matching screenshot: 采集步骤 & 注意事项 / 诊断意义) */}
          <div className="col-span-12 lg:col-span-5 bg-white rounded-lg shadow-sm border border-slate-200 p-4 flex flex-col space-y-4">
            {!activeDetailObject ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                请在左侧列表中点击选择查看详情
              </div>
            ) : (
              <>
                <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                      {activeDetailObject.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      责任编辑: <strong className="text-slate-800">{activeDetailObject.author || '张珊'}</strong> | 更新于: {activeDetailObject.updatedAt || '2026-10-30'}
                    </p>
                  </div>
                  <button
                    onClick={() => handleOpenEditModal(activeDetailObject)}
                    className="px-3 py-1 bg-sky-50 text-sky-700 hover:bg-sky-100 rounded border border-sky-200 text-xs font-medium"
                  >
                    编辑条目
                  </button>
                </div>

                {/* Content Render for 采集知识库 */}
                {activeCategory === '采集知识库' && (() => {
                  const item = activeDetailObject as CollectionKBItem;
                  return (
                    <div className="space-y-4 text-xs overflow-y-auto max-h-[500px] pr-1">
                      <div className="bg-sky-50 border border-sky-100 rounded-lg p-3 space-y-1">
                        <div><span className="font-bold text-slate-700">标本类型：</span>{item.specimenType}</div>
                        <div><span className="font-bold text-slate-700">容器规格：</span>{item.tubeType}</div>
                        <div><span className="font-bold text-slate-700">保存送检：</span>{item.storageCondition}</div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5 border-l-4 border-sky-600 pl-2">
                          采集步骤
                        </h4>
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1.5 leading-relaxed text-slate-700">
                          {item.steps?.map((step: string, idx: number) => (
                            <div key={idx} className="flex gap-1.5">
                              <span className="shrink-0">{step}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5 border-l-4 border-amber-500 pl-2">
                          注意事项
                        </h4>
                        <div className="bg-amber-50/50 p-3 rounded-lg border border-amber-200/60 space-y-1.5 leading-relaxed text-slate-700">
                          {item.precautions?.map((p: string, idx: number) => (
                            <div key={idx}>{p}</div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Content Render for 检验指标临床知识库 */}
                {activeCategory === '检验指标临床知识库' && (() => {
                  const item = activeDetailObject as IndicatorKBItem;
                  return (
                    <div className="space-y-4 text-xs overflow-y-auto max-h-[500px] pr-1">
                      <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-3 space-y-1">
                        <div><span className="font-bold text-slate-700">英文简称：</span>{item.englishName}</div>
                        <div><span className="font-bold text-slate-700">参考区间：</span><strong className="text-indigo-700">{item.refRange}</strong></div>
                        <div><span className="font-bold text-slate-700">检测单位：</span>{item.unit}</div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-bold text-slate-800 text-sm border-l-4 border-indigo-600 pl-2">
                          临床诊断意义
                        </h4>
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1.5 text-slate-700">
                          {item.clinicalSignificance?.map((s: string, idx: number) => (
                            <div key={idx}>{s}</div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-bold text-slate-800 text-sm border-l-4 border-rose-500 pl-2">
                          影响 / 干扰因素
                        </h4>
                        <div className="bg-rose-50/50 p-3 rounded-lg border border-rose-200/60 space-y-1.5 text-slate-700">
                          {item.interferingFactors?.map((f: string, idx: number) => (
                            <div key={idx}>{f}</div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Content Render for 标本不合格拒收标准 */}
                {activeCategory === '标本不合格拒收标准' && (() => {
                  const item = activeDetailObject as RejectionKBItem;
                  return (
                    <div className="space-y-4 text-xs overflow-y-auto max-h-[500px] pr-1">
                      <div className="bg-rose-50 border border-rose-200 rounded-lg p-3 space-y-1">
                        <div><span className="font-bold text-slate-700">适用标本：</span>{item.specimenType}</div>
                        <div><span className="font-bold text-slate-700">拒收分析：</span>{item.rejectionReason}</div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-bold text-slate-800 text-sm border-l-4 border-rose-600 pl-2">
                          处理流程与沟通要求
                        </h4>
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1.5 text-slate-700">
                          {item.handlingProcedure?.map((proc: string, idx: number) => (
                            <div key={idx}>{proc}</div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-bold text-slate-800 text-sm border-l-4 border-emerald-500 pl-2">
                          预防改善建议
                        </h4>
                        <div className="bg-emerald-50/50 p-3 rounded-lg border border-emerald-200/60 p-3 text-slate-700">
                          {item.preventionAdvice}
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Content Render for 危急值处置指南 */}
                {activeCategory === '危急值处置指南' && (() => {
                  const item = activeDetailObject as CrisisGuidelineKBItem;
                  return (
                    <div className="space-y-4 text-xs overflow-y-auto max-h-[500px] pr-1">
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 space-y-1">
                        <div><span className="font-bold text-slate-700">危急界限：</span><strong className="text-rose-700">{item.crisisThreshold}</strong></div>
                        <div><span className="font-bold text-slate-700">通知角色：</span>{item.notifiedRole}</div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-bold text-slate-800 text-sm border-l-4 border-amber-600 pl-2">
                          临床风险与危害
                        </h4>
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-slate-700">
                          {item.clinicalRisk}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-bold text-slate-800 text-sm border-l-4 border-blue-600 pl-2">
                          紧急处置标准流程 (SOP)
                        </h4>
                        <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-200/60 space-y-1.5 text-slate-700">
                          {item.actionProtocol?.map((act: string, idx: number) => (
                            <div key={idx}>{act}</div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </>
            )}
          </div>
        </div>
      </div>

      {/* CREATE / EDIT MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-base">
                {editingItemId ? `编辑 ${formCategory} 条目` : `新增 ${formCategory} 条目`}
              </h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="p-4 space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">条目名称 / 标题 *</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={e => setFormTitle(e.target.value)}
                  className="w-full border border-slate-300 rounded px-3 py-1.5 font-bold text-slate-900 focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">
                    {formCategory === '检验指标临床知识库' ? '参考区间' : '标本类型/危急界限'}
                  </label>
                  <input
                    type="text"
                    value={formSubText}
                    onChange={e => setFormSubText(e.target.value)}
                    className="w-full border border-slate-300 rounded px-3 py-1.5"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">
                    {formCategory === '检验指标临床知识库' ? '单位' : '试管/容器/分析'}
                  </label>
                  <input
                    type="text"
                    value={formUnitOrTube}
                    onChange={e => setFormUnitOrTube(e.target.value)}
                    className="w-full border border-slate-300 rounded px-3 py-1.5"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  {formCategory === '采集知识库' ? '采集步骤 (每行一条)' : '临床诊断意义 / 处理流程 (每行一条)'}
                </label>
                <textarea
                  rows={4}
                  value={formStepsText}
                  onChange={e => setFormStepsText(e.target.value)}
                  className="w-full border border-slate-300 rounded px-3 py-1.5 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  {formCategory === '采集知识库' ? '注意事项 (每行一条)' : '干扰因素 / 改进建议 (每行一条)'}
                </label>
                <textarea
                  rows={3}
                  value={formPrecautionsText}
                  onChange={e => setFormPrecautionsText(e.target.value)}
                  className="w-full border border-slate-300 rounded px-3 py-1.5 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">责任编辑 / 审核人 *</label>
                <input
                  type="text"
                  required
                  value={formAuthor}
                  onChange={e => setFormAuthor(e.target.value)}
                  className="w-full border border-slate-300 rounded px-3 py-1.5 font-bold"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-medium"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded font-medium shadow-xs"
                >
                  保存条目
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmTarget && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="p-4 bg-rose-600 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <Trash2 className="w-4 h-4" />
                删除知识库条目确认
              </h3>
              <button onClick={() => setDeleteConfirmTarget(null)} className="text-rose-200 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-3 text-xs text-slate-700">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-rose-100 text-rose-600 rounded-full shrink-0 mt-0.5">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <p className="leading-relaxed">
                  您确定要彻底删除知识库条目 <strong className="text-slate-900 font-bold">“{deleteConfirmTarget.title}”</strong> 吗？
                  <span className="block text-rose-600 mt-1 font-medium">此操作不可撤销，删除后该知识库数据将无法恢复。</span>
                </p>
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
                  if (activeCategory === '采集知识库') setCollectionList(prev => prev.filter(i => i.id !== id));
                  else if (activeCategory === '检验指标临床知识库') setIndicatorList(prev => prev.filter(i => i.id !== id));
                  else if (activeCategory === '标本不合格拒收标准') setRejectionList(prev => prev.filter(i => i.id !== id));
                  else if (activeCategory === '危急值处置指南') setCrisisList(prev => prev.filter(i => i.id !== id));
                  triggerAction(`彻底删除知识库条目: ${deleteConfirmTarget.title}`);
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
