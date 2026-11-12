import React, { useState } from 'react';
import {
  MicroKnowledgeType,
  MicrobeKnowledgeItem,
  AntibioticKnowledgeItem,
  AstStandardKnowledgeItem,
  INITIAL_MICROBE_LIST,
  INITIAL_ANTIBIOTIC_LIST,
  INITIAL_AST_STANDARDS_LIST,
} from '../data/microbiologyKnowledgeBaseData';
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
  BookOpen,
} from './MenuIcon';

interface MicrobiologyKnowledgeBaseViewProps {
  user?: UserProfile;
  triggerAction: (msg: string) => void;
}

export const MicrobiologyKnowledgeBaseView: React.FC<MicrobiologyKnowledgeBaseViewProps> = ({
  user,
  triggerAction,
}) => {
  // 1. Knowledge Base Type Selection (Left Panel)
  const [activeType, setActiveType] = useState<MicroKnowledgeType>('微生物知识库');

  // Datasets
  const [microbeList, setMicrobeList] = useState<MicrobeKnowledgeItem[]>(INITIAL_MICROBE_LIST);
  const [antibioticList, setAntibioticList] = useState<AntibioticKnowledgeItem[]>(
    INITIAL_ANTIBIOTIC_LIST
  );
  const [astStandardList, setAstStandardList] = useState<AstStandardKnowledgeItem[]>(
    INITIAL_AST_STANDARDS_LIST
  );

  // Search keyword for table
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  // Editing Item ID (null if creating new)
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields - Microbe
  const [mbParentName, setMbParentName] = useState<string>('');
  const [mbEnglishName, setMbEnglishName] = useState<string>('');
  const [mbChineseName, setMbChineseName] = useState<string>('');
  const [mbWhonetCode, setMbWhonetCode] = useState<string>('');
  const [mbTaxonCategory, setMbTaxonCategory] = useState<MicrobeKnowledgeItem['taxonCategory']>('种');

  // Form Fields - Antibiotic
  const [abCategory, setAbCategory] = useState<string>('碳青霉烯类');
  const [abEnglishName, setAbEnglishName] = useState<string>('');
  const [abChineseName, setAbChineseName] = useState<string>('');
  const [abWhonetCode, setAbWhonetCode] = useState<string>('');
  const [abRoute, setAbRoute] = useState<AntibioticKnowledgeItem['route']>('静脉滴注');

  // Form Fields - AST Standard
  const [astOrg, setAstOrg] = useState<string>('CLSI M100 (第34版 2026)');
  const [astOrganismGroup, setAstOrganismGroup] = useState<string>('肠杆菌目 (Enterobacterales)');
  const [astAntibioticName, setAstAntibioticName] = useState<string>('美罗培南 (Meropenem)');
  const [astMethod, setAstMethod] = useState<AstStandardKnowledgeItem['method']>('MIC (微量肉汤稀释法)');
  const [astSusceptibleBreak, setAstSusceptibleBreak] = useState<string>('≤1 ug/mL');
  const [astIntermediateBreak, setAstIntermediateBreak] = useState<string>('2 ug/mL');
  const [astResistantBreak, setAstResistantBreak] = useState<string>('≥4 ug/mL');

  // Import Modal State
  const [showImportModal, setShowImportModal] = useState<boolean>(false);

  // Pagination (Strictly 10 items/page)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  // Toast Notice
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showLocalNotice = (msg: string) => {
    setToastMessage(msg);
    triggerAction(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Reset form when switching tabs or clicking Cancel
  const handleResetForm = () => {
    setEditingId(null);
    setMbParentName('');
    setMbEnglishName('');
    setMbChineseName('');
    setMbWhonetCode('');
    setMbTaxonCategory('种');

    setAbCategory('碳青霉烯类');
    setAbEnglishName('');
    setAbChineseName('');
    setAbWhonetCode('');
    setAbRoute('静脉滴注');

    setAstOrg('CLSI M100 (第34版 2026)');
    setAstOrganismGroup('肠杆菌目 (Enterobacterales)');
    setAstAntibioticName('美罗培南 (Meropenem)');
    setAstMethod('MIC (微量肉汤稀释法)');
    setAstSusceptibleBreak('≤1 ug/mL');
    setAstIntermediateBreak('2 ug/mL');
    setAstResistantBreak('≥4 ug/mL');
  };

  // Switch knowledge base type
  const handleSelectType = (type: MicroKnowledgeType) => {
    setActiveType(type);
    setCurrentPage(1);
    setSearchKeyword('');
    handleResetForm();
    showLocalNotice(`已切换至【${type}】知识库`);
  };

  // Populate form for editing
  const handleEditMicrobe = (item: MicrobeKnowledgeItem) => {
    setEditingId(item.id);
    setMbParentName(item.parentName);
    setMbEnglishName(item.englishName);
    setMbChineseName(item.chineseName);
    setMbWhonetCode(item.whonetCode);
    setMbTaxonCategory(item.taxonCategory);
    showLocalNotice(`已载入微生物【${item.chineseName}】进入编辑`);
  };

  const handleEditAntibiotic = (item: AntibioticKnowledgeItem) => {
    setEditingId(item.id);
    setAbCategory(item.category);
    setAbEnglishName(item.englishName);
    setAbChineseName(item.chineseName);
    setAbWhonetCode(item.whonetCode);
    setAbRoute(item.route);
    showLocalNotice(`已载入抗生素【${item.chineseName}】进入编辑`);
  };

  const handleEditAstStandard = (item: AstStandardKnowledgeItem) => {
    setEditingId(item.id);
    setAstOrg(item.standardOrg);
    setAstOrganismGroup(item.organismGroup);
    setAstAntibioticName(item.antibioticName);
    setAstMethod(item.method);
    setAstSusceptibleBreak(item.susceptibleBreak);
    setAstIntermediateBreak(item.intermediateBreak);
    setAstResistantBreak(item.resistantBreak);
    showLocalNotice(`已载入药敏折点标准【${item.antibioticName}】进入编辑`);
  };

  // Delete handlers
  const handleDeleteMicrobe = (id: string) => {
    setMicrobeList((prev) => prev.filter((m) => m.id !== id));
    if (editingId === id) handleResetForm();
    showLocalNotice('已成功删除该微生物词条');
  };

  const handleDeleteAntibiotic = (id: string) => {
    setAntibioticList((prev) => prev.filter((a) => a.id !== id));
    if (editingId === id) handleResetForm();
    showLocalNotice('已成功删除该抗生素词条');
  };

  const handleDeleteAstStandard = (id: string) => {
    setAstStandardList((prev) => prev.filter((s) => s.id !== id));
    if (editingId === id) handleResetForm();
    showLocalNotice('已成功删除该药敏折点规则');
  };

  // Save handler
  const handleSaveForm = () => {
    const operator = user?.name || '李晓红主管检验师';
    const currentTime = '2026-10-30 12:10:00';

    if (activeType === '微生物知识库') {
      if (!mbChineseName.trim() || !mbEnglishName.trim()) {
        showLocalNotice('请填写完整的微生物中文名称与英文名称！');
        return;
      }
      if (editingId) {
        setMicrobeList((prev) =>
          prev.map((item) =>
            item.id === editingId
              ? {
                  ...item,
                  chineseName: mbChineseName.trim(),
                  englishName: mbEnglishName.trim(),
                  parentName: mbParentName.trim() || '无上级',
                  whonetCode: mbWhonetCode.trim() || '-',
                  taxonCategory: mbTaxonCategory,
                  updater: operator,
                  updateTime: currentTime,
                }
              : item
          )
        );
        showLocalNotice(`微生物【${mbChineseName}】修改保存成功！`);
      } else {
        const newItem: MicrobeKnowledgeItem = {
          id: `mb-${Date.now()}`,
          chineseName: mbChineseName.trim(),
          englishName: mbEnglishName.trim(),
          parentName: mbParentName.trim() || '无上级',
          whonetCode: mbWhonetCode.trim() || '-',
          taxonCategory: mbTaxonCategory,
          updater: operator,
          updateTime: currentTime,
          gramStain: '革兰阴性',
        };
        setMicrobeList((prev) => [newItem, ...prev]);
        showLocalNotice(`新微生物【${mbChineseName}】新增保存成功！`);
      }
      handleResetForm();
    } else if (activeType === '抗生素知识库') {
      if (!abChineseName.trim() || !abEnglishName.trim()) {
        showLocalNotice('请填写完整的抗生素中文名称与英文名称！');
        return;
      }
      if (editingId) {
        setAntibioticList((prev) =>
          prev.map((item) =>
            item.id === editingId
              ? {
                  ...item,
                  chineseName: abChineseName.trim(),
                  englishName: abEnglishName.trim(),
                  category: abCategory.trim(),
                  whonetCode: abWhonetCode.trim() || '-',
                  route: abRoute,
                  updater: operator,
                  updateTime: currentTime,
                }
              : item
          )
        );
        showLocalNotice(`抗生素【${abChineseName}】修改保存成功！`);
      } else {
        const newItem: AntibioticKnowledgeItem = {
          id: `ab-${Date.now()}`,
          chineseName: abChineseName.trim(),
          englishName: abEnglishName.trim(),
          category: abCategory.trim(),
          whonetCode: abWhonetCode.trim() || '-',
          route: abRoute,
          updater: operator,
          updateTime: currentTime,
        };
        setAntibioticList((prev) => [newItem, ...prev]);
        showLocalNotice(`新抗生素【${abChineseName}】新增保存成功！`);
      }
      handleResetForm();
    } else {
      if (!astAntibioticName.trim() || !astOrganismGroup.trim()) {
        showLocalNotice('请填写完整的菌群大类与抗菌药物！');
        return;
      }
      if (editingId) {
        setAstStandardList((prev) =>
          prev.map((item) =>
            item.id === editingId
              ? {
                  ...item,
                  standardOrg: astOrg,
                  organismGroup: astOrganismGroup.trim(),
                  antibioticName: astAntibioticName.trim(),
                  method: astMethod,
                  susceptibleBreak: astSusceptibleBreak.trim(),
                  intermediateBreak: astIntermediateBreak.trim(),
                  resistantBreak: astResistantBreak.trim(),
                  updater: operator,
                  updateTime: currentTime,
                }
              : item
          )
        );
        showLocalNotice(`药敏折点标准【${astAntibioticName}】修改保存成功！`);
      } else {
        const newItem: AstStandardKnowledgeItem = {
          id: `std-${Date.now()}`,
          standardOrg: astOrg,
          organismGroup: astOrganismGroup.trim(),
          antibioticName: astAntibioticName.trim(),
          method: astMethod,
          susceptibleBreak: astSusceptibleBreak.trim(),
          intermediateBreak: astIntermediateBreak.trim(),
          resistantBreak: astResistantBreak.trim(),
          updater: operator,
          updateTime: currentTime,
        };
        setAstStandardList((prev) => [newItem, ...prev]);
        showLocalNotice(`新药敏折点标准【${astAntibioticName}】新增保存成功！`);
      }
      handleResetForm();
    }
  };

  // Filtered Table Data based on activeType and searchKeyword
  const filteredMicrobes = microbeList.filter((m) => {
    if (!searchKeyword.trim()) return true;
    const q = searchKeyword.trim().toLowerCase();
    return (
      m.chineseName.toLowerCase().includes(q) ||
      m.englishName.toLowerCase().includes(q) ||
      m.whonetCode.toLowerCase().includes(q) ||
      m.parentName.toLowerCase().includes(q)
    );
  });

  const filteredAntibiotics = antibioticList.filter((a) => {
    if (!searchKeyword.trim()) return true;
    const q = searchKeyword.trim().toLowerCase();
    return (
      a.chineseName.toLowerCase().includes(q) ||
      a.englishName.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q) ||
      a.whonetCode.toLowerCase().includes(q)
    );
  });

  const filteredAstStandards = astStandardList.filter((s) => {
    if (!searchKeyword.trim()) return true;
    const q = searchKeyword.trim().toLowerCase();
    return (
      s.antibioticName.toLowerCase().includes(q) ||
      s.organismGroup.toLowerCase().includes(q) ||
      s.standardOrg.toLowerCase().includes(q)
    );
  });

  // Active dataset length & sliced items
  const currentTotal =
    activeType === '微生物知识库'
      ? filteredMicrobes.length
      : activeType === '抗生素知识库'
      ? filteredAntibiotics.length
      : filteredAstStandards.length;

  const totalPages = Math.ceil(currentTotal / pageSize) || 1;

  const currentMicrobes = filteredMicrobes.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const currentAntibiotics = filteredAntibiotics.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const currentAstStandards = filteredAstStandards.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="flex-1 flex h-full bg-slate-100 overflow-hidden text-xs">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 right-8 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2 border border-slate-700 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* 1. Left Nav: 知识库类型 (Knowledge Base Types, matches screenshot left menu) */}
      <div className="w-56 bg-white border-r border-slate-200 flex flex-col shrink-0">
        <div className="p-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-slate-800">
            <BookOpen className="w-4 h-4 text-sky-600" />
            <span>知识库类型</span>
          </div>
          <span className="text-[10px] bg-sky-100 text-sky-800 font-mono px-1.5 py-0.5 rounded">
            3类
          </span>
        </div>

        <div className="p-2 space-y-1 flex-1 overflow-y-auto">
          {(['微生物知识库', '抗生素知识库', '药敏试验标准'] as MicroKnowledgeType[]).map((type) => {
            const isActive = activeType === type;
            return (
              <button
                key={type}
                onClick={() => handleSelectType(type)}
                className={`w-full text-left px-3 py-2.5 rounded-lg font-medium transition-all flex items-center justify-between ${
                  isActive
                    ? 'bg-sky-50 text-sky-700 font-bold border border-sky-200 shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      isActive ? 'bg-sky-600' : 'bg-slate-300'
                    }`}
                  />
                  <span>{type}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                  {type === '微生物知识库'
                    ? microbeList.length
                    : type === '抗生素知识库'
                    ? antibioticList.length
                    : astStandardList.length}
                  条
                </span>
              </button>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 text-[11px] text-slate-500 space-y-1">
          <div className="flex justify-between">
            <span>遵循规范:</span>
            <strong className="text-slate-700 font-medium">CLSI M100 / EUCAST</strong>
          </div>
          <div className="flex justify-between">
            <span>WHONET版本:</span>
            <span className="font-mono text-slate-700">v5.6 标准字典</span>
          </div>
        </div>
      </div>

      {/* 2. Middle Editor Form Panel (Matches Screenshot Middle: 编辑微生物 / 编辑抗生素 / 编辑药敏标准) */}
      <div className="w-72 bg-white border-r border-slate-200 flex flex-col shrink-0 shadow-2xs">
        <div className="p-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="font-bold text-slate-800 flex items-center gap-1.5">
            <Edit className="w-4 h-4 text-sky-600" />
            <span>
              {activeType === '微生物知识库'
                ? '编辑微生物'
                : activeType === '抗生素知识库'
                ? '编辑抗生素'
                : '编辑药敏标准'}
            </span>
          </div>
          {editingId ? (
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-100 text-amber-800 font-bold">
              修改中
            </span>
          ) : (
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800 font-bold">
              新建
            </span>
          )}
        </div>

        <div className="flex-1 p-4 space-y-3.5 overflow-y-auto">
          {activeType === '微生物知识库' && (
            <>
              <div>
                <label className="block text-slate-600 font-medium mb-1">上级名称</label>
                <input
                  type="text"
                  placeholder="如: 革兰阳性杆菌 / 肠杆菌目"
                  value={mbParentName}
                  onChange={(e) => setMbParentName(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  <span className="text-rose-500 mr-0.5">*</span>英文名称 (学名)
                </label>
                <input
                  type="text"
                  placeholder="如: Paenibacillus alvei"
                  value={mbEnglishName}
                  onChange={(e) => setMbEnglishName(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-800 font-serif italic focus:outline-hidden focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  <span className="text-rose-500 mr-0.5">*</span>中文名称
                </label>
                <input
                  type="text"
                  placeholder="如: 蜂房类芽孢杆菌"
                  value={mbChineseName}
                  onChange={(e) => setMbChineseName(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-800 font-bold focus:outline-hidden focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">WHONET码</label>
                <input
                  type="text"
                  placeholder="如: PA / BA / eco / sau"
                  value={mbWhonetCode}
                  onChange={(e) => setMbWhonetCode(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-800 font-mono focus:outline-hidden focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">生物类别</label>
                <select
                  value={mbTaxonCategory}
                  onChange={(e) => setMbTaxonCategory(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-800 font-medium focus:outline-hidden focus:ring-1 focus:ring-sky-500"
                >
                  <option value="界">界</option>
                  <option value="门">门</option>
                  <option value="纲">纲</option>
                  <option value="目">目</option>
                  <option value="科">科</option>
                  <option value="属">属</option>
                  <option value="种">种</option>
                  <option value="亚种">亚种</option>
                </select>
              </div>
            </>
          )}

          {activeType === '抗生素知识库' && (
            <>
              <div>
                <label className="block text-slate-600 font-medium mb-1">药物大类</label>
                <input
                  type="text"
                  placeholder="如: 碳青霉烯类 / 糖肽类"
                  value={abCategory}
                  onChange={(e) => setAbCategory(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  <span className="text-rose-500 mr-0.5">*</span>英文名称
                </label>
                <input
                  type="text"
                  placeholder="如: Meropenem"
                  value={abEnglishName}
                  onChange={(e) => setAbEnglishName(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  <span className="text-rose-500 mr-0.5">*</span>中文名称
                </label>
                <input
                  type="text"
                  placeholder="如: 美罗培南"
                  value={abChineseName}
                  onChange={(e) => setAbChineseName(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-800 font-bold focus:outline-hidden focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">WHONET标准码</label>
                <input
                  type="text"
                  placeholder="如: MEM / VAN / AMK"
                  value={abWhonetCode}
                  onChange={(e) => setAbWhonetCode(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-800 font-mono focus:outline-hidden focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">给药途径</label>
                <select
                  value={abRoute}
                  onChange={(e) => setAbRoute(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-800 font-medium focus:outline-hidden focus:ring-1 focus:ring-sky-500"
                >
                  <option value="静脉滴注">静脉滴注</option>
                  <option value="口服">口服</option>
                  <option value="静脉注射">静脉注射</option>
                  <option value="肌内注射">肌内注射</option>
                  <option value="外用">外用</option>
                </select>
              </div>
            </>
          )}

          {activeType === '药敏试验标准' && (
            <>
              <div>
                <label className="block text-slate-600 font-medium mb-1">标准体系与版本</label>
                <select
                  value={astOrg}
                  onChange={(e) => setAstOrg(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-800 font-medium focus:outline-hidden focus:ring-1 focus:ring-sky-500"
                >
                  <option value="CLSI M100 (第34版 2026)">CLSI M100 (第34版 2026)</option>
                  <option value="EUCAST (v14.0 2026)">EUCAST (v14.0 2026)</option>
                  <option value="国家卫健委行业标准 WS/T 805">国家卫健委行业标准 WS/T 805</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  <span className="text-rose-500 mr-0.5">*</span>菌群大类
                </label>
                <input
                  type="text"
                  placeholder="如: 肠杆菌目 / 假单胞菌属"
                  value={astOrganismGroup}
                  onChange={(e) => setAstOrganismGroup(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  <span className="text-rose-500 mr-0.5">*</span>抗菌药物
                </label>
                <input
                  type="text"
                  placeholder="如: 美罗培南 (Meropenem)"
                  value={astAntibioticName}
                  onChange={(e) => setAstAntibioticName(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-800 font-bold focus:outline-hidden focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">测试方法</label>
                <select
                  value={astMethod}
                  onChange={(e) => setAstMethod(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-800 font-medium focus:outline-hidden focus:ring-1 focus:ring-sky-500"
                >
                  <option value="MIC (微量肉汤稀释法)">MIC (微量肉汤稀释法)</option>
                  <option value="KB (纸片扩散法)">KB (纸片扩散法)</option>
                  <option value="E-test">E-test</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-600 text-[10px] font-medium mb-1">
                    敏感 (S)
                  </label>
                  <input
                    type="text"
                    placeholder="≤1 ug/mL"
                    value={astSusceptibleBreak}
                    onChange={(e) => setAstSusceptibleBreak(e.target.value)}
                    className="w-full px-1.5 py-1 bg-slate-50 border border-slate-300 rounded text-slate-800 font-mono text-[11px]"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 text-[10px] font-medium mb-1">
                    中介 (I)
                  </label>
                  <input
                    type="text"
                    placeholder="2 ug/mL"
                    value={astIntermediateBreak}
                    onChange={(e) => setAstIntermediateBreak(e.target.value)}
                    className="w-full px-1.5 py-1 bg-slate-50 border border-slate-300 rounded text-slate-800 font-mono text-[11px]"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 text-[10px] font-medium mb-1">
                    耐药 (R)
                  </label>
                  <input
                    type="text"
                    placeholder="≥4 ug/mL"
                    value={astResistantBreak}
                    onChange={(e) => setAstResistantBreak(e.target.value)}
                    className="w-full px-1.5 py-1 bg-slate-50 border border-slate-300 rounded text-slate-800 font-mono text-[11px]"
                  />
                </div>
              </div>
            </>
          )}

          {/* Action Buttons: 导入, 取消, 保存 (Matches Screenshot: 导入 / 取消 / 保存) */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
            <button
              onClick={() => setShowImportModal(true)}
              className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded font-medium shadow-2xs transition-colors"
            >
              导入
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handleResetForm}
                className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-600 border border-slate-300 rounded font-medium transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSaveForm}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded shadow-xs transition-colors"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Right Table Section (Changes dynamically with left tab, matches screenshot right table) */}
      <div className="flex-1 min-w-0 flex flex-col h-full overflow-hidden p-5">
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden flex flex-col h-full">
          {/* Top Bar above Table: Title + Search */}
          <div className="px-5 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-sm">
                {activeType === '微生物知识库'
                  ? '微生物列表'
                  : activeType === '抗生素知识库'
                  ? '抗生素列表'
                  : '药敏试验折点标准列表'}
              </span>
              <span className="text-[11px] bg-sky-100 text-sky-800 font-mono px-2 py-0.5 rounded font-bold">
                {currentTotal} 条记录
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="搜索名称 / 英文学名 / WHONET码..."
                  value={searchKeyword}
                  onChange={(e) => {
                    setSearchKeyword(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-64 pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded-md text-xs placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-sky-500"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>

              <button
                onClick={() => {
                  setSearchKeyword('');
                  setCurrentPage(1);
                  showLocalNotice('已刷新列表数据');
                }}
                className="p-1.5 rounded border border-slate-300 bg-white hover:bg-slate-50 text-slate-600"
                title="刷新"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto flex-1">
            {/* Table Type 1: 微生物知识库 */}
            {activeType === '微生物知识库' && (
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 sticky top-0 z-10 select-none">
                  <tr>
                    <th className="px-3.5 py-2.5">中文名称</th>
                    <th className="px-3.5 py-2.5">英文名称</th>
                    <th className="px-3.5 py-2.5">上级名称</th>
                    <th className="px-3.5 py-2.5 font-mono">WHONET码</th>
                    <th className="px-3.5 py-2.5 text-center">生物类别</th>
                    <th className="px-3.5 py-2.5">维护人员</th>
                    <th className="px-3.5 py-2.5 font-mono">更新时间</th>
                    <th className="px-3.5 py-2.5 text-center w-28">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                  {currentMicrobes.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-16 text-slate-400">
                        暂无符合搜索条件的微生物词条
                      </td>
                    </tr>
                  ) : (
                    currentMicrobes.map((item) => (
                      <tr
                        key={item.id}
                        className={`hover:bg-sky-50/60 transition-colors ${
                          editingId === item.id ? 'bg-sky-50/50 font-medium' : ''
                        }`}
                      >
                        <td className="px-3.5 py-2.5 font-bold text-slate-900">
                          {item.chineseName}
                        </td>
                        <td className="px-3.5 py-2.5 font-serif italic text-slate-700">
                          {item.englishName}
                        </td>
                        <td className="px-3.5 py-2.5 text-slate-600">{item.parentName}</td>
                        <td className="px-3.5 py-2.5 font-mono font-bold text-sky-700">
                          {item.whonetCode}
                        </td>
                        <td className="px-3.5 py-2.5 text-center">
                          <span className="px-2 py-0.5 rounded text-[11px] bg-slate-100 text-slate-700">
                            {item.taxonCategory}
                          </span>
                        </td>
                        <td className="px-3.5 py-2.5 text-slate-800 font-medium">{item.updater}</td>
                        <td className="px-3.5 py-2.5 font-mono text-slate-500 text-[11px]">
                          {item.updateTime}
                        </td>
                        <td className="px-3.5 py-2.5 text-center whitespace-nowrap">
                          <button
                            onClick={() => handleEditMicrobe(item)}
                            className="text-sky-600 hover:text-sky-800 font-medium mr-3"
                          >
                            编辑
                          </button>
                          <button
                            onClick={() => handleDeleteMicrobe(item.id)}
                            className="text-rose-600 hover:text-rose-800 font-medium"
                          >
                            删除
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}

            {/* Table Type 2: 抗生素知识库 */}
            {activeType === '抗生素知识库' && (
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 sticky top-0 z-10 select-none">
                  <tr>
                    <th className="px-3.5 py-2.5">中文名称</th>
                    <th className="px-3.5 py-2.5">英文名称</th>
                    <th className="px-3.5 py-2.5">药物大类</th>
                    <th className="px-3.5 py-2.5 font-mono">WHONET码</th>
                    <th className="px-3.5 py-2.5 text-center">给药途径</th>
                    <th className="px-3.5 py-2.5">维护人员</th>
                    <th className="px-3.5 py-2.5 font-mono">更新时间</th>
                    <th className="px-3.5 py-2.5 text-center w-28">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                  {currentAntibiotics.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-16 text-slate-400">
                        暂无符合搜索条件的抗生素词条
                      </td>
                    </tr>
                  ) : (
                    currentAntibiotics.map((item) => (
                      <tr
                        key={item.id}
                        className={`hover:bg-sky-50/60 transition-colors ${
                          editingId === item.id ? 'bg-sky-50/50 font-medium' : ''
                        }`}
                      >
                        <td className="px-3.5 py-2.5 font-bold text-slate-900">
                          {item.chineseName}
                        </td>
                        <td className="px-3.5 py-2.5 text-slate-700">{item.englishName}</td>
                        <td className="px-3.5 py-2.5">
                          <span className="px-2 py-0.5 rounded text-[11px] bg-slate-100 text-slate-800 font-medium">
                            {item.category}
                          </span>
                        </td>
                        <td className="px-3.5 py-2.5 font-mono font-bold text-sky-700">
                          {item.whonetCode}
                        </td>
                        <td className="px-3.5 py-2.5 text-center">
                          <span className="px-2 py-0.5 rounded text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {item.route}
                          </span>
                        </td>
                        <td className="px-3.5 py-2.5 text-slate-800 font-medium">{item.updater}</td>
                        <td className="px-3.5 py-2.5 font-mono text-slate-500 text-[11px]">
                          {item.updateTime}
                        </td>
                        <td className="px-3.5 py-2.5 text-center whitespace-nowrap">
                          <button
                            onClick={() => handleEditAntibiotic(item)}
                            className="text-sky-600 hover:text-sky-800 font-medium mr-3"
                          >
                            编辑
                          </button>
                          <button
                            onClick={() => handleDeleteAntibiotic(item.id)}
                            className="text-rose-600 hover:text-rose-800 font-medium"
                          >
                            删除
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}

            {/* Table Type 3: 药敏试验标准 */}
            {activeType === '药敏试验标准' && (
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 sticky top-0 z-10 select-none">
                  <tr>
                    <th className="px-3.5 py-2.5">标准机构与版本</th>
                    <th className="px-3.5 py-2.5">菌群大类</th>
                    <th className="px-3.5 py-2.5">抗菌药物</th>
                    <th className="px-3.5 py-2.5">测试方法</th>
                    <th className="px-3 py-2.5 font-mono text-emerald-700">敏感 (S)</th>
                    <th className="px-3 py-2.5 font-mono text-amber-700">中介 (I)</th>
                    <th className="px-3 py-2.5 font-mono text-rose-700">耐药 (R)</th>
                    <th className="px-3.5 py-2.5">维护人员</th>
                    <th className="px-3.5 py-2.5 font-mono">更新时间</th>
                    <th className="px-3.5 py-2.5 text-center w-28">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                  {currentAstStandards.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="text-center py-16 text-slate-400">
                        暂无符合搜索条件的药敏标准折点
                      </td>
                    </tr>
                  ) : (
                    currentAstStandards.map((item) => (
                      <tr
                        key={item.id}
                        className={`hover:bg-sky-50/60 transition-colors ${
                          editingId === item.id ? 'bg-sky-50/50 font-medium' : ''
                        }`}
                      >
                        <td className="px-3.5 py-2.5 font-bold text-slate-900">
                          {item.standardOrg}
                        </td>
                        <td className="px-3.5 py-2.5 text-slate-700">{item.organismGroup}</td>
                        <td className="px-3.5 py-2.5 font-bold text-sky-800">
                          {item.antibioticName}
                        </td>
                        <td className="px-3.5 py-2.5 text-slate-600 font-mono text-[11px]">
                          {item.method}
                        </td>
                        <td className="px-3 py-2.5 font-mono font-bold text-emerald-700">
                          {item.susceptibleBreak}
                        </td>
                        <td className="px-3 py-2.5 font-mono font-bold text-amber-700">
                          {item.intermediateBreak}
                        </td>
                        <td className="px-3 py-2.5 font-mono font-bold text-rose-700">
                          {item.resistantBreak}
                        </td>
                        <td className="px-3.5 py-2.5 text-slate-800 font-medium">{item.updater}</td>
                        <td className="px-3.5 py-2.5 font-mono text-slate-500 text-[11px]">
                          {item.updateTime}
                        </td>
                        <td className="px-3.5 py-2.5 text-center whitespace-nowrap">
                          <button
                            onClick={() => handleEditAstStandard(item)}
                            className="text-sky-600 hover:text-sky-800 font-medium mr-3"
                          >
                            编辑
                          </button>
                          <button
                            onClick={() => handleDeleteAstStandard(item.id)}
                            className="text-rose-600 hover:text-rose-800 font-medium"
                          >
                            删除
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>

          {/* Table Pagination Bar (Strictly 10 items/page, matches instructions) */}
          <div className="bg-slate-50 px-5 py-2.5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-slate-600 text-xs shrink-0">
            <div className="flex items-center gap-3">
              <span>
                合计: <strong className="text-slate-900 font-mono text-sm">{currentTotal}</strong> 条
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
      {/* 4. IMPORT MODAL (导入知识库模板) */}
      {/* ========================================================================= */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full flex flex-col overflow-hidden">
            <div className="bg-sky-700 text-white px-5 py-3.5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2 font-bold text-sm">
                <FileSpreadsheet className="w-4 h-4" />
                <span>批量导入【{activeType}】数据</span>
              </div>
              <button
                onClick={() => setShowImportModal(false)}
                className="text-sky-200 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <p className="text-slate-600 leading-relaxed">
                请下载官方标准化 Excel 导入模板，填入对应的名称、WHONET代码与标准参数后上传同步：
              </p>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-800">标准模板下载:</span>
                  <button
                    onClick={() => showLocalNotice(`已开始下载 ${activeType} 导入模板.xlsx`)}
                    className="text-sky-600 hover:text-sky-800 font-bold underline"
                  >
                    下载模板.xlsx
                  </button>
                </div>
                <div className="text-[11px] text-slate-400">
                  支持格式: .xlsx, .csv (最大支持单次批量导入 5,000 条)
                </div>
              </div>

              <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-sky-500 cursor-pointer bg-slate-50/50">
                <FileSpreadsheet className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <span className="text-slate-700 font-medium block">点击选择文件或拖拽至此处</span>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  自动校验 WHONET 代码与分类层级树
                </span>
              </div>
            </div>

            <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex justify-end gap-2 shrink-0">
              <button
                onClick={() => setShowImportModal(false)}
                className="px-3.5 py-1.5 bg-white border border-slate-300 rounded-md text-slate-700 hover:bg-slate-100"
              >
                取消
              </button>
              <button
                onClick={() => {
                  setShowImportModal(false);
                  showLocalNotice(`成功从模板导入 8 条新词条至【${activeType}】！`);
                }}
                className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-md shadow-xs"
              >
                确认解析导入
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
