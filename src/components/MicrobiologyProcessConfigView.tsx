import React, { useState, useMemo } from 'react';
import {
  ProcessTestApplication,
  BusinessConfigItem,
  SmearSchemeItem,
  InoculationSchemeItem,
  InoculationMediaDetail,
  CommentTemplateItem,
  PROCESS_TEST_APPLICATIONS,
  INITIAL_BUSINESS_CONFIG,
  INITIAL_SMEAR_SCHEMES,
  INITIAL_INOCULATION_SCHEMES,
  INITIAL_COMMENT_TEMPLATES,
} from '../data/microbiologyProcessConfigData';
import { UserProfile } from '../types/navigation';
import {
  Search,
  Plus,
  RefreshCw,
  Edit,
  Trash2,
  Save,
  CheckCircle2,
  Clock,
  X,
  User,
  Sliders,
  Building2,
  AlertTriangle,
  FileText,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Layers,
  Activity,
  Check,
  Barcode,
  FlaskConical,
  Eye,
  FileCheck,
} from './MenuIcon';

interface MicrobiologyProcessConfigViewProps {
  user?: UserProfile;
  triggerAction: (msg: string) => void;
}

export const MicrobiologyProcessConfigView: React.FC<MicrobiologyProcessConfigViewProps> = ({
  user,
  triggerAction,
}) => {
  // Top header: 单位名称
  const [selectedHospitalUnit, setSelectedHospitalUnit] = useState<string>('中心医院');

  // Left application list selection
  const [applications] = useState<ProcessTestApplication[]>(PROCESS_TEST_APPLICATIONS);
  const [appSearchKeyword, setAppSearchKeyword] = useState<string>('');
  const [selectedAppCode, setSelectedAppCode] = useState<string>('1001'); // default: 痰培养

  // Top Tabs: '业务配置' | '执行方案' | '评语模板'
  const [activeMainTab, setActiveMainTab] = useState<'业务配置' | '执行方案' | '评语模板'>('业务配置');

  // Sub-tabs for '执行方案': '制片方案' | '接种方案'
  const [activeSchemeTab, setActiveSchemeTab] = useState<'制片方案' | '接种方案'>('制片方案');

  // Tab 1: 业务配置 Datasets (keyed by appCode or fallback to default)
  const [businessConfigs, setBusinessConfigs] = useState<Record<string, BusinessConfigItem[]>>({
    '1001': INITIAL_BUSINESS_CONFIG.default,
  });

  // Tab 2: 制片方案 Datasets
  const [smearSchemes, setSmearSchemes] = useState<SmearSchemeItem[]>(INITIAL_SMEAR_SCHEMES);
  const [selectedSmearSchemeId, setSelectedSmearSchemeId] = useState<string>('smear-01');
  const [editingSmearId, setEditingSmearId] = useState<string | null>(null);
  const [smearFormName, setSmearFormName] = useState<string>('');
  const [smearFormStains, setSmearFormStains] = useState<string[]>(['革兰染色']);
  const [smearFormSpecimens, setSmearFormSpecimens] = useState<string[]>(['痰液']);

  // Tab 2: 接种方案 Datasets
  const [inocSchemes, setInocSchemes] = useState<InoculationSchemeItem[]>(INITIAL_INOCULATION_SCHEMES);
  const [selectedInocSchemeId, setSelectedInocSchemeId] = useState<string>('inoc-01');
  const [editingInocId, setEditingInocId] = useState<string | null>(null);
  const [inocFormName, setInocFormName] = useState<string>('');
  const [inocFormMediaList, setInocFormMediaList] = useState<InoculationMediaDetail[]>([
    { id: 'm-init', mediaType: '麦康凯琼脂培养基', equipment: '35℃普通温箱', durationHours: 48 },
  ]);
  const [inocFormSpecimens, setInocFormSpecimens] = useState<string[]>(['痰液']);

  // Tab 3: 评语模板 Datasets
  const [commentTemplates, setCommentTemplates] = useState<CommentTemplateItem[]>(
    INITIAL_COMMENT_TEMPLATES
  );
  const [selectedCommentId, setSelectedCommentId] = useState<string>('ct-01');
  const [commentFilterType, setCommentFilterType] = useState<string>('所有');
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [commentFormType, setCommentFormType] = useState<CommentTemplateItem['type']>('镜检评语');
  const [commentFormContent, setCommentFormContent] = useState<string>('');
  const [commentFormDefault, setCommentFormDefault] = useState<boolean>(false);
  const [commentFormSpecimens, setCommentFormSpecimens] = useState<string[]>(['痰液']);
  const [newCondSpecimenInput, setNewCondSpecimenInput] = useState<string>('');
  const [showAddCondRow, setShowAddCondRow] = useState<boolean>(false);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showNotice = (msg: string) => {
    setToastMessage(msg);
    triggerAction(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Selected Application
  const currentApp = useMemo(() => {
    return applications.find((a) => a.code === selectedAppCode) || applications[0];
  }, [applications, selectedAppCode]);

  // Filtered Applications
  const filteredApps = useMemo(() => {
    if (!appSearchKeyword.trim()) return applications;
    const q = appSearchKeyword.trim().toLowerCase();
    return applications.filter((app) => app.code.includes(q) || app.name.toLowerCase().includes(q));
  }, [applications, appSearchKeyword]);

  // Current Business Configs (Dynamically loads application-specific config)
  const currentBusinessList = useMemo(() => {
    return (
      businessConfigs[selectedAppCode] ||
      INITIAL_BUSINESS_CONFIG[selectedAppCode] ||
      INITIAL_BUSINESS_CONFIG['1001']
    );
  }, [businessConfigs, selectedAppCode]);

  // Toggle Business Selection
  const handleToggleBusinessSelect = (id: string) => {
    setBusinessConfigs((prev) => {
      const current =
        prev[selectedAppCode] ||
        INITIAL_BUSINESS_CONFIG[selectedAppCode] ||
        INITIAL_BUSINESS_CONFIG['1001'];
      const updated = current.map((item) =>
        item.id === id ? { ...item, isSelected: !item.isSelected } : item
      );
      return { ...prev, [selectedAppCode]: updated };
    });
  };

  // Toggle Business Report Flag
  const handleToggleBusinessReport = (id: string, field: 'initialReport' | 'finalReport') => {
    setBusinessConfigs((prev) => {
      const current =
        prev[selectedAppCode] ||
        INITIAL_BUSINESS_CONFIG[selectedAppCode] ||
        INITIAL_BUSINESS_CONFIG['1001'];
      const updated = current.map((item) =>
        item.id === id ? { ...item, [field]: !item[field] } : item
      );
      return { ...prev, [selectedAppCode]: updated };
    });
  };

  // Save Business Config
  const handleSaveBusinessConfig = () => {
    showNotice(`【${currentApp.name}】的业务配置已成功保存并立即生效！`);
  };

  // ================= Smear Scheme Handlers =================
  // Filtered by selectedAppCode
  const currentSmearSchemes = useMemo(() => {
    return smearSchemes.filter((s) => s.appCode === selectedAppCode);
  }, [smearSchemes, selectedAppCode]);

  const activeSmearScheme = useMemo(() => {
    const found = currentSmearSchemes.find((s) => s.id === selectedSmearSchemeId);
    return found || currentSmearSchemes[0] || null;
  }, [currentSmearSchemes, selectedSmearSchemeId]);

  const handleToggleSmearStatus = (id: string) => {
    setSmearSchemes((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isEnabled: !s.isEnabled } : s))
    );
    showNotice('制片方案启用状态已更新');
  };

  const handleEditSmearScheme = (item: SmearSchemeItem) => {
    setEditingSmearId(item.id);
    setSelectedSmearSchemeId(item.id);
    setSmearFormName(item.schemeName);
    setSmearFormStains([...item.stainingMethods]);
    setSmearFormSpecimens([...item.specimenTypes]);
    showNotice(`已载入制片方案【${item.schemeName}】`);
  };

  const handleDeleteSmearScheme = (id: string) => {
    setSmearSchemes((prev) => prev.filter((s) => s.id !== id));
    showNotice('制片方案已删除');
  };

  const handleResetSmearForm = () => {
    setEditingSmearId(null);
    setSmearFormName('');
    setSmearFormStains(['革兰染色']);
    setSmearFormSpecimens([currentApp.defaultSpecimen]);
  };

  const handleSaveSmearScheme = () => {
    if (!smearFormName.trim()) {
      showNotice('请填写方案名称！');
      return;
    }
    const operator = user?.name ? `${user.name}主管检验师` : '李晓红主管检验师';
    const operateTime = '2026-10-30 11:20:15';

    if (editingSmearId) {
      setSmearSchemes((prev) =>
        prev.map((s) =>
          s.id === editingSmearId
            ? {
                ...s,
                schemeName: smearFormName.trim(),
                stainingMethods: smearFormStains,
                specimenTypes: smearFormSpecimens,
                operator,
                operateTime,
              }
            : s
        )
      );
      showNotice(`制片方案【${smearFormName}】更新保存成功！`);
    } else {
      const newScheme: SmearSchemeItem = {
        id: `smear-${Date.now()}`,
        appCode: currentApp.code,
        schemeName: smearFormName.trim(),
        stainingMethods: smearFormStains,
        specimenTypes: smearFormSpecimens,
        isEnabled: true,
        operator,
        operateTime,
      };
      setSmearSchemes((prev) => [newScheme, ...prev]);
      setSelectedSmearSchemeId(newScheme.id);
      showNotice(`新建制片方案【${smearFormName}】保存成功！`);
    }
    handleResetSmearForm();
  };

  // ================= Inoculation Scheme Handlers =================
  // Filtered by selectedAppCode
  const currentInocSchemes = useMemo(() => {
    return inocSchemes.filter((s) => s.appCode === selectedAppCode);
  }, [inocSchemes, selectedAppCode]);

  const activeInocScheme = useMemo(() => {
    const found = currentInocSchemes.find((s) => s.id === selectedInocSchemeId);
    return found || currentInocSchemes[0] || null;
  }, [currentInocSchemes, selectedInocSchemeId]);

  const handleToggleInocStatus = (id: string) => {
    setInocSchemes((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isEnabled: !s.isEnabled } : s))
    );
    showNotice('接种方案启用状态已更新');
  };

  const handleEditInocScheme = (item: InoculationSchemeItem) => {
    setEditingInocId(item.id);
    setSelectedInocSchemeId(item.id);
    setInocFormName(item.schemeName);
    setInocFormMediaList([...item.mediaItems]);
    setInocFormSpecimens([...item.specimenTypes]);
    showNotice(`已载入接种方案【${item.schemeName}】`);
  };

  const handleDeleteInocScheme = (id: string) => {
    setInocSchemes((prev) => prev.filter((s) => s.id !== id));
    showNotice('接种方案已删除');
  };

  const handleResetInocForm = () => {
    setEditingInocId(null);
    setInocFormName('');
    setInocFormMediaList([
      { id: `m-${Date.now()}`, mediaType: '麦康凯琼脂培养基', equipment: '35℃普通温箱', durationHours: 48 },
    ]);
    setInocFormSpecimens([currentApp.defaultSpecimen]);
  };

  const handleSaveInocScheme = () => {
    if (!inocFormName.trim()) {
      showNotice('请填写接种方案名称！');
      return;
    }
    const operator = user?.name ? `${user.name}主任医师` : '郭彩霞主任医师';
    const operateTime = '2026-10-30 11:25:30';

    if (editingInocId) {
      setInocSchemes((prev) =>
        prev.map((s) =>
          s.id === editingInocId
            ? {
                ...s,
                schemeName: inocFormName.trim(),
                mediaItems: inocFormMediaList,
                specimenTypes: inocFormSpecimens,
                operator,
                operateTime,
              }
            : s
        )
      );
      showNotice(`接种方案【${inocFormName}】更新保存成功！`);
    } else {
      const newScheme: InoculationSchemeItem = {
        id: `inoc-${Date.now()}`,
        appCode: currentApp.code,
        schemeName: inocFormName.trim(),
        mediaItems: inocFormMediaList,
        specimenTypes: inocFormSpecimens,
        isEnabled: true,
        operator,
        operateTime,
      };
      setInocSchemes((prev) => [newScheme, ...prev]);
      setSelectedInocSchemeId(newScheme.id);
      showNotice(`新建接种方案【${inocFormName}】保存成功！`);
    }
    handleResetInocForm();
  };

  // ================= Comment Template Handlers =================
  // Filtered by selectedAppCode & commentFilterType
  const filteredComments = useMemo(() => {
    return commentTemplates.filter((item) => {
      if (item.appCode !== selectedAppCode) return false;
      if (commentFilterType !== '所有' && item.type !== commentFilterType) {
        return false;
      }
      return true;
    });
  }, [commentTemplates, selectedAppCode, commentFilterType]);

  const activeComment = useMemo(() => {
    const found = filteredComments.find((c) => c.id === selectedCommentId);
    return found || filteredComments[0] || null;
  }, [filteredComments, selectedCommentId]);

  // Handle switching application from left list (Requirement: "点击左侧检验申请名称，后才也能变化")
  const handleSelectApplication = (app: ProcessTestApplication) => {
    setSelectedAppCode(app.code);

    // 1. Sync smear scheme
    const appSmears = smearSchemes.filter((s) => s.appCode === app.code);
    if (appSmears.length > 0) {
      setSelectedSmearSchemeId(appSmears[0].id);
    }
    setEditingSmearId(null);
    setSmearFormName('');
    setSmearFormStains(['革兰染色']);
    setSmearFormSpecimens([app.defaultSpecimen]);

    // 2. Sync inoculation scheme
    const appInocs = inocSchemes.filter((s) => s.appCode === app.code);
    if (appInocs.length > 0) {
      setSelectedInocSchemeId(appInocs[0].id);
    }
    setEditingInocId(null);
    setInocFormName('');
    setInocFormMediaList([
      { id: `m-${Date.now()}`, mediaType: '麦康凯琼脂培养基', equipment: '35℃普通温箱', durationHours: 48 },
    ]);
    setInocFormSpecimens([app.defaultSpecimen]);

    // 3. Sync comment template
    const appComments = commentTemplates.filter((c) => c.appCode === app.code);
    if (appComments.length > 0) {
      setSelectedCommentId(appComments[0].id);
    }
    setEditingCommentId(null);
    setCommentFormType('镜检评语');
    setCommentFormContent('');
    setCommentFormDefault(false);
    setCommentFormSpecimens([app.defaultSpecimen]);

    showNotice(`已切换为检验申请: 【${app.name} (${app.code})】`);
  };

  const handleToggleCommentStatus = (id: string) => {
    setCommentTemplates((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isEnabled: !c.isEnabled } : c))
    );
    showNotice('评语模板状态已更新');
  };

  const handleEditComment = (item: CommentTemplateItem) => {
    setEditingCommentId(item.id);
    setSelectedCommentId(item.id);
    setCommentFormType(item.type);
    setCommentFormContent(item.content);
    setCommentFormDefault(item.isDefault);
    setCommentFormSpecimens([...item.specimenTypes]);
    showNotice(`已载入评语【${item.type}】`);
  };

  const handleDeleteComment = (id: string) => {
    setCommentTemplates((prev) => prev.filter((c) => c.id !== id));
    showNotice('评语模板已删除');
  };

  const handleResetCommentForm = () => {
    setEditingCommentId(null);
    setCommentFormType('镜检评语');
    setCommentFormContent('');
    setCommentFormDefault(false);
    setCommentFormSpecimens([currentApp.defaultSpecimen]);
    setShowAddCondRow(false);
  };

  const handleSaveComment = () => {
    if (!commentFormContent.trim()) {
      showNotice('请填写评语内容！');
      return;
    }
    const operator = user?.name ? `${user.name}副主任检验师` : '魏明副主任检验师';
    const operateTime = '2026-10-30 11:35:00';

    if (editingCommentId) {
      setCommentTemplates((prev) =>
        prev.map((c) =>
          c.id === editingCommentId
            ? {
                ...c,
                type: commentFormType,
                content: commentFormContent.trim(),
                isDefault: commentFormDefault,
                specimenTypes: commentFormSpecimens,
                operator,
                operateTime,
              }
            : c
        )
      );
      showNotice('评语模板更新保存成功！');
    } else {
      const newItem: CommentTemplateItem = {
        id: `ct-${Date.now()}`,
        appCode: currentApp.code,
        type: commentFormType,
        content: commentFormContent.trim(),
        isDefault: commentFormDefault,
        isEnabled: true,
        specimenTypes: commentFormSpecimens,
        operator,
        operateTime,
      };
      setCommentTemplates((prev) => [newItem, ...prev]);
      setSelectedCommentId(newItem.id);
      showNotice('新建评语模板保存成功！');
    }
    handleResetCommentForm();
  };

  return (
    <div className="flex flex-col h-full bg-slate-100 text-xs text-slate-700 select-none overflow-hidden font-sans">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 text-white px-4 py-2 rounded-lg shadow-xl text-xs flex items-center gap-2 backdrop-blur-xs border border-slate-700 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Toolbar (Matches screenshot: 单位名称 [中心医院]) */}
      <div className="bg-white border-b border-slate-200 px-4 py-2.5 flex items-center justify-between shadow-2xs shrink-0">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-sky-600" />
            <span className="font-bold text-slate-800 text-sm">微生物流程方案配置</span>
            <span className="px-2 py-0.5 rounded text-[11px] bg-sky-50 text-sky-700 border border-sky-200 font-medium">
              SOP 流程控制中心
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-600 font-medium flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              单位名称:
            </span>
            <select
              value={selectedHospitalUnit}
              onChange={(e) => {
                setSelectedHospitalUnit(e.target.value);
                showNotice(`已切换机构为: ${e.target.value}`);
              }}
              className="bg-slate-50 border border-slate-300 rounded px-2.5 py-1 text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-sky-500 cursor-pointer"
            >
              <option value="中心医院">中心医院 (微生物核心实验室)</option>
              <option value="东城第一分院">东城第一分院 (综合急诊微生物组)</option>
              <option value="滨海妇女儿童院区">滨海妇女儿童院区 (妇儿感染诊断中心)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-4 text-slate-500 text-[11px]">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            标准时效: <strong className="text-slate-700 font-mono">2026-10-30</strong>
          </span>
          <span className="flex items-center gap-1">
            <User className="w-3.5 h-3.5 text-slate-400" />
            质控专员: <strong className="text-slate-700">李晓红主管检验师</strong>
          </span>
          <button
            onClick={() => showNotice('流程方案配置已重新加载同步！')}
            className="flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition font-medium"
          >
            <RefreshCw className="w-3 h-3" />
            刷新方案
          </button>
        </div>
      </div>

      {/* Main Workspace: Left 申请列表 + Right Tabbed Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sub-panel: 申请列表 (Matches screenshot left column) */}
        <div className="w-60 bg-white border-r border-slate-200 flex flex-col shrink-0">
          <div className="p-2.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <span className="font-bold text-slate-800">申请列表</span>
            <span className="text-[10px] text-slate-400 font-mono">共 {filteredApps.length} 项</span>
          </div>

          {/* Search box: 编码/名称查找 */}
          <div className="p-2 border-b border-slate-200">
            <div className="relative">
              <input
                type="text"
                placeholder="编码/名称查找"
                value={appSearchKeyword}
                onChange={(e) => setAppSearchKeyword(e.target.value)}
                className="w-full pl-2 pr-7 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-500 text-xs"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5" />
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-100 text-slate-600 sticky top-0 border-b border-slate-200 z-10 text-[11px]">
                <tr>
                  <th className="py-2 px-3 font-semibold">检验申请名称</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredApps.map((app) => {
                  const isSelected = selectedAppCode === app.code;
                  return (
                    <tr
                      key={app.id}
                      onClick={() => handleSelectApplication(app)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-sky-100 text-sky-900 font-bold border-l-4 border-l-sky-600'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <td className="py-2.5 px-3">
                        <div className="flex items-center justify-between">
                          <span>{app.name}</span>
                          <span className="text-[10px] font-mono text-slate-400 font-normal">
                            {app.code}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filteredApps.length === 0 && (
                  <tr>
                    <td className="py-8 text-center text-slate-400">未匹配到检验申请</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="p-2.5 border-t border-slate-200 bg-slate-50 text-[11px] text-slate-500">
            <div>当前所选: <strong className="text-sky-700">{currentApp.name}</strong></div>
            <div className="text-[10px] text-slate-400 mt-0.5">默认标本: {currentApp.defaultSpecimen}</div>
          </div>
        </div>

        {/* Right Main Body: Tabs at top (业务配置 | 执行方案 | 评语模板) */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white">
          {/* Top Tabs Bar (Matches Screenshot: 业务配置 / 执行方案 / 评语模板) */}
          <div className="border-b border-slate-200 bg-slate-50/70 px-4 pt-2.5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-1">
              {(['业务配置', '执行方案', '评语模板'] as const).map((tab) => {
                const isActive = activeMainTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => {
                      setActiveMainTab(tab);
                      showNotice(`已切换到【${tab}】`);
                    }}
                    className={`px-4 py-2 font-bold text-xs rounded-t-md transition-all border-b-2 flex items-center gap-1.5 ${
                      isActive
                        ? 'border-sky-600 text-sky-700 bg-white shadow-2xs'
                        : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                    }`}
                  >
                    {tab === '业务配置' && <FileCheck className="w-3.5 h-3.5" />}
                    {tab === '执行方案' && <FlaskConical className="w-3.5 h-3.5" />}
                    {tab === '评语模板' && <FileText className="w-3.5 h-3.5" />}
                    <span>{tab}</span>
                  </button>
                );
              })}
            </div>

            {/* Quick Context Indicator */}
            <div className="text-[11px] text-slate-500 pb-2">
              当前配置项目: <strong className="text-sky-700 font-bold">{currentApp.name}</strong>
            </div>
          </div>

          {/* ======================================================== */}
          {/* TAB 1: 业务配置 (Matches image_50fbaef7.png)              */}
          {/* ======================================================== */}
          {activeMainTab === '业务配置' && (
            <div className="flex-1 flex flex-col p-4 overflow-hidden bg-white">
              {/* Header with Title and Green Save Button (Matches Screenshot 1) */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="font-bold text-slate-800 text-sm flex items-center gap-2">
                  <span>业务类型列表</span>
                  <span className="text-[11px] font-normal text-slate-500">
                    （配置此检验申请支持的报告流程与环节阶段）
                  </span>
                </div>

                <button
                  onClick={handleSaveBusinessConfig}
                  className="px-6 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold shadow-2xs transition flex items-center gap-1.5 text-xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  保存
                </button>
              </div>

              {/* Table (Matches image_50fbaef7.png headers: 选择 | 业务类型 | 报告配置 [初步报告, 最终报告]) */}
              <div className="flex-1 overflow-y-auto mt-3 border border-slate-200 rounded-lg">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50 text-slate-600 text-[11px] border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-4 font-semibold w-16 text-center">选择</th>
                      <th className="py-2.5 px-4 font-semibold w-64">业务类型</th>
                      <th className="py-2.5 px-4 font-semibold">业务说明</th>
                      <th className="py-2.5 px-4 font-semibold text-center w-60">报告配置</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {currentBusinessList.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4 text-center">
                          <input
                            type="checkbox"
                            checked={item.isSelected}
                            onChange={() => handleToggleBusinessSelect(item.id)}
                            className="w-4 h-4 text-sky-600 rounded border-slate-300 focus:ring-sky-500 cursor-pointer"
                          />
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-800 flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              item.isSelected ? 'bg-sky-600' : 'bg-slate-300'
                            }`}
                          />
                          <span>{item.businessType}</span>
                        </td>
                        <td className="py-3 px-4 text-slate-500 text-[11px]">
                          {item.description}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-6">
                            <label className="flex items-center gap-1.5 cursor-pointer text-slate-700">
                              <input
                                type="checkbox"
                                checked={item.initialReport}
                                onChange={() => handleToggleBusinessReport(item.id, 'initialReport')}
                                className="w-4 h-4 text-sky-600 rounded border-slate-300 focus:ring-sky-500"
                              />
                              <span className="font-medium">初步报告</span>
                            </label>
                            <label className="flex items-center gap-1.5 cursor-pointer text-slate-700">
                              <input
                                type="checkbox"
                                checked={item.finalReport}
                                onChange={() => handleToggleBusinessReport(item.id, 'finalReport')}
                                className="w-4 h-4 text-sky-600 rounded border-slate-300 focus:ring-sky-500"
                              />
                              <span className="font-medium">最终报告</span>
                            </label>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: 执行方案 (Matches image_7b3597c5 & image_739d1d8a) */}
          {/* ======================================================== */}
          {activeMainTab === '执行方案' && (
            <div className="flex-1 flex flex-col overflow-hidden bg-white">
              {/* Sub-tab Navigation (Matches screenshot: 制片方案 | 接种方案) */}
              <div className="px-4 pt-2 border-b border-slate-200 bg-slate-50 flex items-center gap-4 shrink-0">
                <button
                  onClick={() => {
                    setActiveSchemeTab('制片方案');
                    showNotice('已切换到制片方案');
                  }}
                  className={`pb-2 font-bold text-xs border-b-2 transition ${
                    activeSchemeTab === '制片方案'
                      ? 'border-sky-600 text-sky-700'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  制片方案
                </button>
                <button
                  onClick={() => {
                    setActiveSchemeTab('接种方案');
                    showNotice('已切换到接种方案');
                  }}
                  className={`pb-2 font-bold text-xs border-b-2 transition ${
                    activeSchemeTab === '接种方案'
                      ? 'border-sky-600 text-sky-700'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  接种方案
                </button>
              </div>

              {/* ----------------- Sub-Tab A: 制片方案 (image_7b3597c5.png) ----------------- */}
              {activeSchemeTab === '制片方案' && (
                <div className="flex-1 flex overflow-hidden">
                  {/* Left Form: 方案编辑 */}
                  <div className="w-80 border-r border-slate-200 p-3.5 flex flex-col overflow-y-auto space-y-3.5 bg-slate-50/50">
                    <div className="font-bold text-slate-800 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Edit className="w-4 h-4 text-sky-600" />
                        方案编辑
                      </span>
                      {editingSmearId ? (
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-100 text-amber-800 font-bold">
                          修改中
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800 font-bold">
                          新建方案
                        </span>
                      )}
                    </div>

                    <div>
                      <label className="block text-slate-600 font-medium mb-1">
                        <span className="text-rose-500 mr-0.5">*</span>方案名称
                      </label>
                      <input
                        type="text"
                        placeholder="如: 痰培养接种 / 痰涂片"
                        value={smearFormName}
                        onChange={(e) => setSmearFormName(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded font-medium focus:ring-1 focus:ring-sky-500"
                      />
                    </div>

                    {/* 方案内容: 染色方法 */}
                    <div className="border border-slate-200 rounded p-2.5 bg-white space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-700">方案内容 (染色方法)</span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setSmearFormStains((prev) => [...prev, '抗酸染色'])}
                            className="p-1 rounded bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold"
                            title="添加染色方法"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {smearFormStains.map((stain, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <select
                            value={stain}
                            onChange={(e) => {
                              const val = e.target.value;
                              setSmearFormStains((prev) =>
                                prev.map((s, i) => (i === idx ? val : s))
                              );
                            }}
                            className="flex-1 px-2 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-800 focus:ring-1 focus:ring-sky-500"
                          >
                            <option value="革兰染色">革兰染色 (Gram Stain)</option>
                            <option value="抗酸染色">抗酸染色 (Ziehl-Neelsen)</option>
                            <option value="荧光真菌染色">荧光真菌染色 (Calcofluor White)</option>
                            <option value="墨汁负染色">墨汁负染色 (India Ink)</option>
                            <option value="弱抗酸染色">弱抗酸染色 (Kinyoun Stain)</option>
                          </select>
                          {smearFormStains.length > 1 && (
                            <button
                              type="button"
                              onClick={() =>
                                setSmearFormStains((prev) => prev.filter((_, i) => i !== idx))
                              }
                              className="text-rose-500 hover:text-rose-700 p-1"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* 执行条件: 标本类型 */}
                    <div className="border border-slate-200 rounded p-2.5 bg-white space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-700">执行条件 (标本类型)</span>
                        <button
                          type="button"
                          onClick={() => setSmearFormSpecimens((prev) => [...prev, '气管吸取物'])}
                          className="p-1 rounded bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold"
                          title="增加标本类型"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {smearFormSpecimens.map((spec, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={spec}
                            onChange={(e) => {
                              const val = e.target.value;
                              setSmearFormSpecimens((prev) =>
                                prev.map((s, i) => (i === idx ? val : s))
                              );
                            }}
                            placeholder="如: 痰液 / 血液"
                            className="flex-1 px-2 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs"
                          />
                          {smearFormSpecimens.length > 1 && (
                            <button
                              type="button"
                              onClick={() =>
                                setSmearFormSpecimens((prev) => prev.filter((_, i) => i !== idx))
                              }
                              className="text-rose-500 hover:text-rose-700 p-1"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Buttons: 取消 / 保存 (green) */}
                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                      <button
                        type="button"
                        onClick={handleResetSmearForm}
                        className="px-4 py-1.5 border border-slate-300 bg-white hover:bg-slate-100 rounded text-slate-700 font-medium"
                      >
                        取消
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveSmearScheme}
                        className="px-5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold shadow-2xs"
                      >
                        保存
                      </button>
                    </div>
                  </div>

                  {/* Middle: 方案列表 */}
                  <div className="flex-1 border-r border-slate-200 flex flex-col overflow-hidden">
                    <div className="p-2.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800">方案列表</span>
                        <span className="text-[11px] text-sky-700 font-medium">({currentApp.name})</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        共 {currentSmearSchemes.length} 条
                      </span>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                      <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-100 text-slate-600 text-[11px] border-b border-slate-200 sticky top-0 z-10">
                          <tr>
                            <th className="py-2.5 px-3 font-semibold">方案名称</th>
                            <th className="py-2.5 px-3 font-semibold">维护人/时间</th>
                            <th className="py-2.5 px-3 font-semibold text-center w-20">状态</th>
                            <th className="py-2.5 px-3 font-semibold text-center w-24">操作</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {currentSmearSchemes.map((item) => {
                            const isSelected = selectedSmearSchemeId === item.id;
                            return (
                              <tr
                                key={item.id}
                                onClick={() => setSelectedSmearSchemeId(item.id)}
                                className={`cursor-pointer hover:bg-slate-50 transition-colors ${
                                  isSelected ? 'bg-sky-50 font-medium' : ''
                                }`}
                              >
                                <td className="py-2.5 px-3 font-bold text-slate-800">
                                  {item.schemeName}
                                </td>
                                <td className="py-2.5 px-3 text-[11px] text-slate-500">
                                  <div>{item.operator}</div>
                                  <div className="text-[10px] text-slate-400 font-mono">
                                    {item.operateTime}
                                  </div>
                                </td>
                                <td className="py-2.5 px-3 text-center">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleToggleSmearStatus(item.id);
                                    }}
                                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                                      item.isEnabled ? 'bg-sky-600' : 'bg-slate-300'
                                    }`}
                                  >
                                    <span
                                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                                        item.isEnabled ? 'translate-x-4' : 'translate-x-0'
                                      }`}
                                    />
                                  </button>
                                </td>
                                <td className="py-2.5 px-3 text-center">
                                  <div className="flex items-center justify-center gap-2">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleEditSmearScheme(item);
                                      }}
                                      className="text-sky-600 hover:text-sky-800 font-medium"
                                    >
                                      编辑
                                    </button>
                                    <span className="text-slate-300">|</span>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteSmearScheme(item.id);
                                      }}
                                      className="text-rose-600 hover:text-rose-800 font-medium"
                                    >
                                      删除
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                          {currentSmearSchemes.length === 0 && (
                            <tr>
                              <td colSpan={4} className="py-12 text-center text-slate-400">
                                当前【{currentApp.name}】暂无专属制片方案，可在左侧表单中配置并保存
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Right: 方案内容 & 执行条件 Summary Card (Matches image_7b3597c5.png right) */}
                  <div className="w-72 p-3.5 flex flex-col space-y-4 bg-slate-50/30 overflow-y-auto">
                    {/* 方案内容 */}
                    <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-2xs">
                      <div className="bg-slate-100 px-3 py-2 font-bold text-slate-700 text-xs border-b border-slate-200">
                        方案内容
                      </div>
                      <table className="w-full text-left">
                        <thead className="bg-slate-50 text-[11px] text-slate-500 border-b border-slate-200">
                          <tr>
                            <th className="py-1.5 px-3 font-semibold">染色方法</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {activeSmearScheme?.stainingMethods?.map((stain, idx) => (
                            <tr key={idx}>
                              <td className="py-2 px-3 font-medium text-slate-800">{stain}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* 执行条件 */}
                    <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-2xs">
                      <div className="bg-slate-100 px-3 py-2 font-bold text-slate-700 text-xs border-b border-slate-200">
                        执行条件
                      </div>
                      <table className="w-full text-left">
                        <thead className="bg-slate-50 text-[11px] text-slate-500 border-b border-slate-200">
                          <tr>
                            <th className="py-1.5 px-3 font-semibold">标本类型</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {activeSmearScheme?.specimenTypes?.map((spec, idx) => (
                            <tr key={idx}>
                              <td className="py-2 px-3 font-medium text-sky-800">{spec}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ----------------- Sub-Tab B: 接种方案 (image_739d1d8a.png) ----------------- */}
              {activeSchemeTab === '接种方案' && (
                <div className="flex-1 flex overflow-hidden">
                  {/* Left Form: 方案编辑 */}
                  <div className="w-96 border-r border-slate-200 p-3.5 flex flex-col overflow-y-auto space-y-3.5 bg-slate-50/50">
                    <div className="font-bold text-slate-800 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <FlaskConical className="w-4 h-4 text-sky-600" />
                        方案编辑
                      </span>
                      {editingInocId ? (
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-100 text-amber-800 font-bold">
                          修改中
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800 font-bold">
                          新建接种方案
                        </span>
                      )}
                    </div>

                    <div>
                      <label className="block text-slate-600 font-medium mb-1">
                        <span className="text-rose-500 mr-0.5">*</span>方案名称
                      </label>
                      <input
                        type="text"
                        placeholder="如: 痰培养接种 / 血培养接种"
                        value={inocFormName}
                        onChange={(e) => setInocFormName(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded font-medium focus:ring-1 focus:ring-sky-500"
                      />
                    </div>

                    {/* 方案内容: 培养基、设备、时长 */}
                    <div className="border border-slate-200 rounded p-2.5 bg-white space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-700">方案内容 (培养基组合)</span>
                        <button
                          type="button"
                          onClick={() =>
                            setInocFormMediaList((prev) => [
                              ...prev,
                              {
                                id: `m-${Date.now()}`,
                                mediaType: '巧克力琼脂培养基',
                                equipment: '35℃ 5% CO2温箱',
                                durationHours: 48,
                              },
                            ])
                          }
                          className="p-1 rounded bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold"
                          title="增加培养基"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {inocFormMediaList.map((media, idx) => (
                        <div
                          key={media.id || idx}
                          className="p-2 border border-slate-200 rounded bg-slate-50/70 space-y-1.5 relative"
                        >
                          {inocFormMediaList.length > 1 && (
                            <button
                              type="button"
                              onClick={() =>
                                setInocFormMediaList((prev) => prev.filter((_, i) => i !== idx))
                              }
                              className="absolute right-1.5 top-1.5 text-slate-400 hover:text-rose-600"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <div>
                            <span className="text-[11px] text-slate-500">培养基类型:</span>
                            <select
                              value={media.mediaType}
                              onChange={(e) => {
                                const val = e.target.value;
                                setInocFormMediaList((prev) =>
                                  prev.map((m, i) => (i === idx ? { ...m, mediaType: val } : m))
                                );
                              }}
                              className="w-full mt-0.5 px-2 py-1 bg-white border border-slate-300 rounded font-medium text-xs"
                            >
                              <option value="血/嗜血琼脂培养基">血/嗜血琼脂培养基</option>
                              <option value="麦康凯琼脂培养基">麦康凯琼脂培养基</option>
                              <option value="巧克力琼脂培养基">巧克力琼脂培养基</option>
                              <option value="沙保弱葡萄糖琼脂(SDA)">沙保弱葡萄糖琼脂(SDA)</option>
                              <option value="念珠菌显色培养基">念珠菌显色培养基</option>
                              <option value="厌氧血琼脂培养基">厌氧血琼脂培养基</option>
                            </select>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <span className="text-[11px] text-slate-500">培养设备:</span>
                              <select
                                value={media.equipment}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setInocFormMediaList((prev) =>
                                    prev.map((m, i) => (i === idx ? { ...m, equipment: val } : m))
                                  );
                                }}
                                className="w-full mt-0.5 px-1.5 py-1 bg-white border border-slate-300 rounded text-xs"
                              >
                                <option value="35℃普通温箱">35℃普通温箱</option>
                                <option value="35℃ 5% CO2温箱">35℃ 5% CO2温箱</option>
                                <option value="25℃真菌培养箱">25℃真菌培养箱</option>
                                <option value="厌氧培养箱">厌氧培养箱</option>
                              </select>
                            </div>

                            <div>
                              <span className="text-[11px] text-slate-500">计划培养时长(小时):</span>
                              <input
                                type="number"
                                value={media.durationHours}
                                onChange={(e) => {
                                  const val = Number(e.target.value);
                                  setInocFormMediaList((prev) =>
                                    prev.map((m, i) =>
                                      i === idx ? { ...m, durationHours: val } : m
                                    )
                                  );
                                }}
                                className="w-full mt-0.5 px-2 py-1 bg-white border border-slate-300 rounded font-mono text-center text-xs"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* 执行条件: 标本类型 */}
                    <div className="border border-slate-200 rounded p-2.5 bg-white space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-700">执行条件 (标本类型)</span>
                        <button
                          type="button"
                          onClick={() => setInocFormSpecimens((prev) => [...prev, '血液'])}
                          className="p-1 rounded bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold"
                          title="增加标本类型"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {inocFormSpecimens.map((spec, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={spec}
                            onChange={(e) => {
                              const val = e.target.value;
                              setInocFormSpecimens((prev) =>
                                prev.map((s, i) => (i === idx ? val : s))
                              );
                            }}
                            className="flex-1 px-2 py-1 bg-slate-50 border border-slate-300 rounded text-xs"
                          />
                          {inocFormSpecimens.length > 1 && (
                            <button
                              type="button"
                              onClick={() =>
                                setInocFormSpecimens((prev) => prev.filter((_, i) => i !== idx))
                              }
                              className="text-rose-500 hover:text-rose-700 p-1"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Buttons: 取消 / 保存 (green) */}
                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                      <button
                        type="button"
                        onClick={handleResetInocForm}
                        className="px-4 py-1.5 border border-slate-300 bg-white hover:bg-slate-100 rounded text-slate-700 font-medium"
                      >
                        取消
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveInocScheme}
                        className="px-5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold shadow-2xs"
                      >
                        保存
                      </button>
                    </div>
                  </div>

                  {/* Middle: 方案列表 */}
                  <div className="flex-1 border-r border-slate-200 flex flex-col overflow-hidden">
                    <div className="p-2.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800">方案列表</span>
                        <span className="text-[11px] text-sky-700 font-medium">({currentApp.name})</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        共 {currentInocSchemes.length} 条
                      </span>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                      <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-100 text-slate-600 text-[11px] border-b border-slate-200 sticky top-0 z-10">
                          <tr>
                            <th className="py-2.5 px-3 font-semibold">方案名称</th>
                            <th className="py-2.5 px-3 font-semibold">维护人/时间</th>
                            <th className="py-2.5 px-3 font-semibold text-center w-20">状态</th>
                            <th className="py-2.5 px-3 font-semibold text-center w-24">操作</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {currentInocSchemes.map((item) => {
                            const isSelected = selectedInocSchemeId === item.id;
                            return (
                              <tr
                                key={item.id}
                                onClick={() => setSelectedInocSchemeId(item.id)}
                                className={`cursor-pointer hover:bg-slate-50 transition-colors ${
                                  isSelected ? 'bg-sky-50 font-medium' : ''
                                }`}
                              >
                                <td className="py-2.5 px-3 font-bold text-slate-800">
                                  {item.schemeName}
                                </td>
                                <td className="py-2.5 px-3 text-[11px] text-slate-500">
                                  <div>{item.operator}</div>
                                  <div className="text-[10px] text-slate-400 font-mono">
                                    {item.operateTime}
                                  </div>
                                </td>
                                <td className="py-2.5 px-3 text-center">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleToggleInocStatus(item.id);
                                    }}
                                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                                      item.isEnabled ? 'bg-sky-600' : 'bg-slate-300'
                                    }`}
                                  >
                                    <span
                                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                                        item.isEnabled ? 'translate-x-4' : 'translate-x-0'
                                      }`}
                                    />
                                  </button>
                                </td>
                                <td className="py-2.5 px-3 text-center">
                                  <div className="flex items-center justify-center gap-2">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleEditInocScheme(item);
                                      }}
                                      className="text-sky-600 hover:text-sky-800 font-medium"
                                    >
                                      编辑
                                    </button>
                                    <span className="text-slate-300">|</span>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteInocScheme(item.id);
                                      }}
                                      className="text-rose-600 hover:text-rose-800 font-medium"
                                    >
                                      删除
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                          {currentInocSchemes.length === 0 && (
                            <tr>
                              <td colSpan={4} className="py-12 text-center text-slate-400">
                                当前【{currentApp.name}】暂无专属接种方案，可在左侧表单中配置组合
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Right: 方案内容 & 执行条件 (Matches image_739d1d8a.png right) */}
                  <div className="w-80 p-3.5 flex flex-col space-y-4 bg-slate-50/30 overflow-y-auto">
                    {/* 方案内容 */}
                    <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-2xs">
                      <div className="bg-slate-100 px-3 py-2 font-bold text-slate-700 text-xs border-b border-slate-200">
                        方案内容
                      </div>
                      <table className="w-full text-left">
                        <thead className="bg-slate-50 text-[11px] text-slate-500 border-b border-slate-200">
                          <tr>
                            <th className="py-1.5 px-2.5 font-semibold">培养基类型</th>
                            <th className="py-1.5 px-2.5 font-semibold">培养设备</th>
                            <th className="py-1.5 px-2 font-semibold text-center">计划培养时长</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {activeInocScheme?.mediaItems?.map((m, idx) => (
                            <tr key={m.id || idx}>
                              <td className="py-2 px-2.5 font-medium text-slate-800">{m.mediaType}</td>
                              <td className="py-2 px-2.5 text-slate-600 text-[11px]">{m.equipment}</td>
                              <td className="py-2 px-2 text-center font-mono font-bold text-sky-700">
                                {m.durationHours}h
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* 执行条件 */}
                    <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-2xs">
                      <div className="bg-slate-100 px-3 py-2 font-bold text-slate-700 text-xs border-b border-slate-200">
                        执行条件
                      </div>
                      <table className="w-full text-left">
                        <thead className="bg-slate-50 text-[11px] text-slate-500 border-b border-slate-200">
                          <tr>
                            <th className="py-1.5 px-3 font-semibold">标本类型</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {activeInocScheme?.specimenTypes?.map((spec, idx) => (
                            <tr key={idx}>
                              <td className="py-2 px-3 font-medium text-sky-800">{spec}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: 评语模板 (Matches image_6ecb68f1.png)              */}
          {/* ======================================================== */}
          {activeMainTab === '评语模板' && (
            <div className="flex-1 flex flex-col overflow-hidden bg-white">
              {/* Upper Section: 评语列表 + 右侧执行条件 */}
              <div className="flex-1 flex overflow-hidden border-b border-slate-200">
                {/* Left/Center: 评语列表 table */}
                <div className="flex-1 flex flex-col border-r border-slate-200 overflow-hidden">
                  {/* Filter Toolbar (Matches Screenshot: 评语列表  评语类型 [所有 v]) */}
                  <div className="p-2.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-slate-800">评语列表</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-600 text-xs">评语类型:</span>
                        <select
                          value={commentFilterType}
                          onChange={(e) => setCommentFilterType(e.target.value)}
                          className="px-2 py-1 bg-white border border-slate-300 rounded text-slate-800 text-xs focus:ring-1 focus:ring-sky-500 font-medium"
                        >
                          <option value="所有">所有</option>
                          <option value="镜检评语">镜检评语</option>
                          <option value="培养评语">培养评语</option>
                          <option value="药敏评语">药敏评语</option>
                          <option value="危急值评语">危急值评语</option>
                        </select>
                      </div>
                    </div>

                    <button
                      onClick={handleResetCommentForm}
                      className="flex items-center gap-1 px-3 py-1 bg-sky-600 hover:bg-sky-700 text-white rounded font-medium shadow-2xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      新建评语
                    </button>
                  </div>

                  {/* Comments Table */}
                  <div className="flex-1 overflow-y-auto">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-slate-100 text-slate-600 text-[11px] border-b border-slate-200 sticky top-0 z-10">
                        <tr>
                          <th className="py-2.5 px-3 font-semibold w-24">评语类型</th>
                          <th className="py-2.5 px-3 font-semibold">评语内容</th>
                          <th className="py-2.5 px-3 font-semibold text-center w-16">默认</th>
                          <th className="py-2.5 px-3 font-semibold text-center w-20">状态</th>
                          <th className="py-2.5 px-3 font-semibold text-center w-24">操作</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredComments.map((item) => {
                          const isSelected = selectedCommentId === item.id;
                          return (
                            <tr
                              key={item.id}
                              onClick={() => setSelectedCommentId(item.id)}
                              className={`cursor-pointer hover:bg-slate-50 transition-colors ${
                                isSelected ? 'bg-sky-50 font-medium' : ''
                              }`}
                            >
                              <td className="py-2.5 px-3">
                                <span
                                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                    item.type === '镜检评语'
                                      ? 'bg-blue-50 text-blue-800'
                                      : item.type === '培养评语'
                                      ? 'bg-emerald-50 text-emerald-800'
                                      : item.type === '药敏评语'
                                      ? 'bg-purple-50 text-purple-800'
                                      : 'bg-rose-50 text-rose-800'
                                  }`}
                                >
                                  {item.type}
                                </span>
                              </td>
                              <td className="py-2.5 px-3 text-slate-800 font-medium">
                                {item.content}
                              </td>
                              <td className="py-2.5 px-3 text-center">
                                <span
                                  className={`px-1.5 py-0.2 rounded font-bold text-[10px] ${
                                    item.isDefault
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : 'text-slate-400'
                                  }`}
                                >
                                  {item.isDefault ? '是' : '否'}
                                </span>
                              </td>
                              <td className="py-2.5 px-3 text-center">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleToggleCommentStatus(item.id);
                                  }}
                                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                                    item.isEnabled ? 'bg-sky-600' : 'bg-slate-300'
                                  }`}
                                >
                                  <span
                                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                                      item.isEnabled ? 'translate-x-4' : 'translate-x-0'
                                    }`}
                                  />
                                </button>
                              </td>
                              <td className="py-2.5 px-3 text-center">
                                <div className="flex items-center justify-center gap-2">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleEditComment(item);
                                    }}
                                    className="text-sky-600 hover:text-sky-800 font-medium"
                                  >
                                    编辑
                                  </button>
                                  <span className="text-slate-300">|</span>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteComment(item.id);
                                    }}
                                    className="text-rose-600 hover:text-rose-800 font-medium"
                                  >
                                    删除
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                        {filteredComments.length === 0 && (
                          <tr>
                            <td colSpan={5} className="py-12 text-center text-slate-400">
                              当前【{currentApp.name}】暂无匹配的评语模板，可在下方快速创建
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Right: 执行条件 (Matches image_6ecb68f1.png right column) */}
                <div className="w-64 p-3 bg-slate-50/50 flex flex-col overflow-y-auto">
                  <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-2xs">
                    <div className="bg-slate-100 px-3 py-2 font-bold text-slate-700 text-xs border-b border-slate-200">
                      执行条件
                    </div>
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 text-[11px] text-slate-500 border-b border-slate-200">
                        <tr>
                          <th className="py-1.5 px-3 font-semibold">标本类型</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {activeComment?.specimenTypes?.map((spec, idx) => (
                          <tr key={idx}>
                            <td className="py-2 px-3 font-medium text-sky-800">{spec}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Lower Section: 编辑评语 Panel (Matches image_6ecb68f1.png bottom) */}
              <div className="h-60 bg-white flex flex-col shrink-0 shadow-xs">
                {/* Header with 取消 / 保存 (green) */}
                <div className="p-2.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800">编辑评语</span>
                    {editingCommentId ? (
                      <span className="px-2 py-0.5 rounded text-[10px] bg-amber-100 text-amber-800 font-bold">
                        修改已有评语
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800 font-bold">
                        新建评语模板
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleResetCommentForm}
                      className="px-4 py-1 border border-slate-300 bg-white hover:bg-slate-100 rounded text-slate-700 font-medium transition"
                    >
                      取消
                    </button>
                    <button
                      onClick={handleSaveComment}
                      className="px-5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold shadow-2xs transition flex items-center gap-1.5"
                    >
                      <Save className="w-3.5 h-3.5" />
                      保存
                    </button>
                  </div>
                </div>

                {/* Sub-form: 评语内容 (Left) + 执行条件 (Right) */}
                <div className="flex-1 flex overflow-hidden">
                  {/* Left: 评语内容 */}
                  <div className="flex-1 p-3 border-r border-slate-200 space-y-2 overflow-y-auto">
                    <div className="font-bold text-slate-700 text-xs">评语内容</div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-600 font-medium">评语类型:</span>
                        <select
                          value={commentFormType}
                          onChange={(e) => setCommentFormType(e.target.value as any)}
                          className="px-2.5 py-1 bg-slate-50 border border-slate-300 rounded font-semibold text-slate-800 focus:ring-1 focus:ring-sky-500"
                        >
                          <option value="镜检评语">镜检结论 (涂片/形态学)</option>
                          <option value="培养评语">培养结论 (平板/仪器生长)</option>
                          <option value="药敏评语">药敏提示 (AST/指导用药)</option>
                          <option value="危急值评语">危急值批注 (极速通报)</option>
                        </select>
                      </div>

                      <label className="flex items-center gap-1.5 cursor-pointer text-slate-700">
                        <input
                          type="checkbox"
                          checked={commentFormDefault}
                          onChange={(e) => setCommentFormDefault(e.target.checked)}
                          className="w-4 h-4 text-sky-600 rounded border-slate-300 focus:ring-sky-500"
                        />
                        <span className="font-medium">默认</span>
                      </label>
                    </div>

                    <div>
                      <label className="block text-slate-600 font-medium mb-1">
                        <span className="text-rose-500 mr-0.5">*</span>评语内容
                      </label>
                      <textarea
                        rows={3}
                        value={commentFormContent}
                        onChange={(e) => setCommentFormContent(e.target.value)}
                        placeholder="请输入标准评语文本，如: 涂片镜检未找到抗酸杆菌 / 培养五天无细菌生长..."
                        className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500 text-xs"
                      />
                    </div>
                  </div>

                  {/* Right: 执行条件 (Matches image_6ecb68f1.png: +增加执行条件) */}
                  <div className="w-80 p-3 bg-slate-50/50 flex flex-col overflow-y-auto">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-slate-700 text-xs">执行条件</span>
                      <button
                        type="button"
                        onClick={() => setShowAddCondRow(true)}
                        className="flex items-center gap-1 text-[11px] text-sky-600 hover:text-sky-800 font-bold"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        增加执行条件
                      </button>
                    </div>

                    <div className="flex-1 space-y-1.5 overflow-y-auto">
                      {commentFormSpecimens.map((spec, idx) => (
                        <div
                          key={idx}
                          className="bg-white border border-slate-200 rounded p-2 text-xs flex items-center justify-between shadow-2xs"
                        >
                          <div className="flex items-center gap-1.5">
                            <span className="text-slate-500">标本类型 =</span>
                            <span className="font-bold text-sky-800">{spec}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              setCommentFormSpecimens((prev) => prev.filter((_, i) => i !== idx))
                            }
                            className="text-slate-400 hover:text-rose-600"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}

                      {showAddCondRow && (
                        <div className="p-2 bg-white border border-sky-300 rounded space-y-2">
                          <input
                            type="text"
                            placeholder="输入标本类型 (如: 血液 / 脑脊液)"
                            value={newCondSpecimenInput}
                            onChange={(e) => setNewCondSpecimenInput(e.target.value)}
                            className="w-full px-2 py-1 bg-slate-50 border border-slate-300 rounded text-xs"
                          />
                          <div className="flex justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                setNewCondSpecimenInput('');
                                setShowAddCondRow(false);
                              }}
                              className="px-2 py-0.5 border border-slate-300 rounded text-[11px] text-slate-600"
                            >
                              取消
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (newCondSpecimenInput.trim()) {
                                  setCommentFormSpecimens((prev) => [
                                    ...prev,
                                    newCondSpecimenInput.trim(),
                                  ]);
                                  setNewCondSpecimenInput('');
                                  setShowAddCondRow(false);
                                }
                              }}
                              className="px-2.5 py-0.5 bg-sky-600 text-white rounded text-[11px] font-bold"
                            >
                              确定
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
