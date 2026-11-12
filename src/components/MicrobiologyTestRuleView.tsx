import React, { useState, useMemo } from 'react';
import {
  MicrobiologyRuleType,
  TestApplicationItem,
  SampleNumberRuleItem,
  AuditRuleItem,
  NotificationRuleItem,
  ExecutionCondition,
  INITIAL_TEST_APPLICATIONS,
  INITIAL_SAMPLE_NUMBER_RULES,
  INITIAL_AUDIT_RULES,
  INITIAL_NOTIFICATION_RULES,
} from '../data/microbiologyTestRuleData';
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
  Bell,
  ChevronLeft,
  ChevronRight,
  Filter,
  Layers,
  Activity,
  Check,
  Barcode,
} from './MenuIcon';

interface MicrobiologyTestRuleViewProps {
  user?: UserProfile;
  triggerAction: (msg: string) => void;
}

export const MicrobiologyTestRuleView: React.FC<MicrobiologyTestRuleViewProps> = ({
  user,
  triggerAction,
}) => {
  // 1. Hospital Unit Selector (Matches screenshot top: 单位名称 [中心医院])
  const [selectedHospitalUnit, setSelectedHospitalUnit] = useState<string>('中心医院');

  // 2. Left Menu Category: 规则类型 ('样本号规则' | '审核规则' | '消息规则')
  // Requirement: "点击左侧知识类型，右侧要跟着变化"
  const [activeRuleType, setActiveRuleType] = useState<MicrobiologyRuleType>('样本号规则');

  // Datasets
  const [testApps] = useState<TestApplicationItem[]>(INITIAL_TEST_APPLICATIONS);
  const [sampleRules, setSampleRules] = useState<SampleNumberRuleItem[]>(INITIAL_SAMPLE_NUMBER_RULES);
  const [auditRules, setAuditRules] = useState<AuditRuleItem[]>(INITIAL_AUDIT_RULES);
  const [notificationRules, setNotificationRules] = useState<NotificationRuleItem[]>(
    INITIAL_NOTIFICATION_RULES
  );

  // Search States
  const [appSearchKeyword, setAppSearchKeyword] = useState<string>('');
  const [selectedAppCode, setSelectedAppCode] = useState<string>('1001'); // default to 痰培养
  const [ruleSearchKeyword, setRuleSearchKeyword] = useState<string>('');

  // Editing state for Sample Number Rule
  const [editingSampleRuleId, setEditingSampleRuleId] = useState<string | null>(null);
  const [formPrefix, setFormPrefix] = useState<string>('B[yy][MM]');
  const [formDigitCount, setFormDigitCount] = useState<number>(4);
  const [formResetCycle, setFormResetCycle] = useState<'日' | '月' | '年' | '永不复位'>('日');
  const [formPrintMode, setFormPrintMode] = useState<'不打印' | '立即打印' | '批量打印'>('不打印');
  const [formPrintCopies, setFormPrintCopies] = useState<number>(1);
  const [formConditions, setFormConditions] = useState<ExecutionCondition[]>([
    { id: 'init-c1', field: '标本类型', operator: '等于', value: '痰液' },
  ]);
  const [newCondField, setNewCondField] = useState<string>('标本类型');
  const [newCondOp, setNewCondOp] = useState<string>('等于');
  const [newCondVal, setNewCondVal] = useState<string>('');
  const [showAddCondModal, setShowAddCondModal] = useState<boolean>(false);

  // Editing state for Audit Rule
  const [editingAuditId, setEditingAuditId] = useState<string | null>(null);
  const [auditRuleName, setAuditRuleName] = useState<string>('');
  const [auditRuleCode, setAuditRuleCode] = useState<string>('');
  const [auditTargetScope, setAuditTargetScope] = useState<string>('痰培养 / 咽拭子培养');
  const [auditConditionDesc, setAuditConditionDesc] = useState<string>('');
  const [auditActionType, setAuditActionType] = useState<AuditRuleItem['actionType']>('自动免审通过');
  const [auditPriority, setAuditPriority] = useState<AuditRuleItem['priority']>('高');
  const [auditRemarks, setAuditRemarks] = useState<string>('');

  // Editing state for Notification Rule
  const [editingNotificationId, setEditingNotificationId] = useState<string | null>(null);
  const [notifRuleName, setNotifRuleName] = useState<string>('');
  const [notifRuleCode, setNotifRuleCode] = useState<string>('');
  const [notifEventType, setNotifEventType] = useState<NotificationRuleItem['eventType']>('血培养报阳');
  const [notifChannels, setNotifChannels] = useState<string[]>(['系统强弹窗', '掌上移动LIS']);
  const [notifTargetDepts, setNotifTargetDepts] = useState<string>('送检临床科室, ICU病房');
  const [notifTimeout, setNotifTimeout] = useState<string>('10分钟内响应');
  const [notifTemplate, setNotifTemplate] = useState<string>(
    '【微生物预警】患者 {患者姓名}(床号:{床号}) 检出致病微生物，请临床医生及时查阅处理！'
  );

  // Pagination for rules
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  // Feedback Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showNotice = (msg: string) => {
    setToastMessage(msg);
    triggerAction(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Dynamic preview generator for sample numbers
  const generatedExample = useMemo(() => {
    const now = new Date(2026, 9, 30); // 2026-10-30
    const yy = '26';
    const yyyy = '2026';
    const MM = '10';
    const dd = '30';

    let result = formPrefix || '';
    result = result.replace(/\[yyyy\]/gi, yyyy);
    result = result.replace(/\[yy\]/gi, yy);
    result = result.replace(/\[MM\]/gi, MM);
    result = result.replace(/\[dd\]/gi, dd);

    const padDigits = String(1).padStart(formDigitCount || 4, '0');
    return `${result}${padDigits}`;
  }, [formPrefix, formDigitCount]);

  // Insert token into prefix
  const handleInsertToken = (token: string) => {
    setFormPrefix((prev) => `${prev}${token}`);
  };

  // Filtered Applications List
  const filteredApps = useMemo(() => {
    if (!appSearchKeyword.trim()) return testApps;
    const q = appSearchKeyword.trim().toLowerCase();
    return testApps.filter((app) => app.code.includes(q) || app.name.toLowerCase().includes(q));
  }, [testApps, appSearchKeyword]);

  // Selected App Details
  const currentApp = useMemo(() => {
    return testApps.find((a) => a.code === selectedAppCode) || testApps[0];
  }, [testApps, selectedAppCode]);

  // Reset Sample Rule Form
  const handleResetSampleForm = () => {
    setEditingSampleRuleId(null);
    setFormPrefix(currentApp ? `${currentApp.name.slice(0, 1).toUpperCase()}[yy][MM]` : 'B[yy][MM]');
    setFormDigitCount(4);
    setFormResetCycle('日');
    setFormPrintMode('不打印');
    setFormPrintCopies(1);
    setFormConditions([
      { id: `c-${Date.now()}`, field: '标本类型', operator: '等于', value: currentApp?.specimenType || '常规标本' },
    ]);
  };

  // Reset Audit Rule Form
  const handleResetAuditForm = () => {
    setEditingAuditId(null);
    setAuditRuleName('');
    setAuditRuleCode('');
    setAuditTargetScope('全部标本');
    setAuditConditionDesc('');
    setAuditActionType('自动免审通过');
    setAuditPriority('高');
    setAuditRemarks('');
  };

  // Reset Notification Form
  const handleResetNotifForm = () => {
    setEditingNotificationId(null);
    setNotifRuleName('');
    setNotifRuleCode('');
    setNotifEventType('血培养报阳');
    setNotifChannels(['系统强弹窗', '掌上移动LIS']);
    setNotifTargetDepts('送检临床科室, ICU病房');
    setNotifTimeout('10分钟内响应');
    setNotifTemplate('【微生物预警】患者 {患者姓名}(床号:{床号}) 检出致病微生物，请临床医生及时查阅处理！');
  };

  // Switch Rule Category
  const handleSelectRuleCategory = (cat: MicrobiologyRuleType) => {
    setActiveRuleType(cat);
    setCurrentPage(1);
    setRuleSearchKeyword('');
    handleResetSampleForm();
    handleResetAuditForm();
    handleResetNotifForm();
    showNotice(`已切换规则类别至【${cat}】`);
  };

  // Toggle sample rule status switch
  const handleToggleSampleRule = (id: string) => {
    setSampleRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isEnabled: !r.isEnabled } : r))
    );
    showNotice('样本号规则启用状态已更新');
  };

  // Toggle audit rule status switch
  const handleToggleAuditRule = (id: string) => {
    setAuditRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isEnabled: !r.isEnabled } : r))
    );
    showNotice('审核规则启用状态已更新');
  };

  // Toggle notification rule status switch
  const handleToggleNotifRule = (id: string) => {
    setNotificationRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isEnabled: !r.isEnabled } : r))
    );
    showNotice('消息规则启用状态已更新');
  };

  // Load sample rule into edit form
  const handleEditSampleRule = (item: SampleNumberRuleItem) => {
    setEditingSampleRuleId(item.id);
    setSelectedAppCode(item.appCode);
    setFormPrefix(item.prefix);
    setFormDigitCount(item.digitCount);
    setFormResetCycle(item.resetCycle);
    setFormPrintMode(item.printMode);
    setFormPrintCopies(item.printCopies);
    setFormConditions(item.conditions && item.conditions.length > 0 ? item.conditions : []);
    showNotice(`已载入样本号规则【${item.appName} (${item.prefix})】进行编辑`);
  };

  // Delete sample rule
  const handleDeleteSampleRule = (id: string) => {
    setSampleRules((prev) => prev.filter((r) => r.id !== id));
    showNotice('样本号规则已删除');
  };

  // Save Sample Rule
  const handleSaveSampleRule = () => {
    if (!formPrefix.trim()) {
      showNotice('请填写样本号前缀！');
      return;
    }
    const operator = user?.name ? `${user.name}主管检验师` : '郭彩霞主任医师';
    const currentTime = '2026-10-30 09:20:15';

    if (editingSampleRuleId) {
      setSampleRules((prev) =>
        prev.map((r) =>
          r.id === editingSampleRuleId
            ? {
                ...r,
                appCode: currentApp.code,
                appName: currentApp.name,
                prefix: formPrefix.trim(),
                digitCount: Number(formDigitCount) || 4,
                resetCycle: formResetCycle,
                printMode: formPrintMode,
                printCopies: Number(formPrintCopies) || 1,
                example: generatedExample,
                conditions: formConditions,
                operator,
                operateTime: currentTime,
              }
            : r
        )
      );
      showNotice(`样本号规则【${currentApp.name}】更新保存成功！`);
    } else {
      const newRule: SampleNumberRuleItem = {
        id: `snr-${Date.now()}`,
        appCode: currentApp.code,
        appName: currentApp.name,
        prefix: formPrefix.trim(),
        digitCount: Number(formDigitCount) || 4,
        resetCycle: formResetCycle,
        printMode: formPrintMode,
        printCopies: Number(formPrintCopies) || 1,
        example: generatedExample,
        isEnabled: true,
        conditions: formConditions,
        operator,
        operateTime: currentTime,
        remarks: `${currentApp.name}专属规则`,
      };
      setSampleRules((prev) => [newRule, ...prev]);
      showNotice(`新建样本号规则【${currentApp.name}】保存成功！`);
    }
    handleResetSampleForm();
  };

  // Add condition to sample rule
  const handleAddCondition = () => {
    if (!newCondVal.trim()) {
      showNotice('请填写执行条件判断值！');
      return;
    }
    const newCond: ExecutionCondition = {
      id: `c-${Date.now()}`,
      field: newCondField,
      operator: newCondOp,
      value: newCondVal.trim(),
    };
    setFormConditions((prev) => [...prev, newCond]);
    setNewCondVal('');
    setShowAddCondModal(false);
    showNotice('执行条件添加成功');
  };

  // Remove condition
  const handleRemoveCondition = (condId: string) => {
    setFormConditions((prev) => prev.filter((c) => c.id !== condId));
  };

  // Save Audit Rule
  const handleSaveAuditRule = () => {
    if (!auditRuleName.trim()) {
      showNotice('请填写审核规则名称！');
      return;
    }
    const operator = user?.name ? `${user.name}主管检验师` : '李晓红主管检验师';
    const currentTime = '2026-10-30 10:15:30';

    if (editingAuditId) {
      setAuditRules((prev) =>
        prev.map((r) =>
          r.id === editingAuditId
            ? {
                ...r,
                ruleName: auditRuleName.trim(),
                ruleCode: auditRuleCode.trim() || r.ruleCode,
                targetScope: auditTargetScope.trim(),
                conditionDesc: auditConditionDesc.trim() || '通用规则逻辑',
                actionType: auditActionType,
                priority: auditPriority,
                remarks: auditRemarks.trim(),
                operator,
                operateTime: currentTime,
              }
            : r
        )
      );
      showNotice(`审核规则【${auditRuleName}】更新保存成功！`);
    } else {
      const newRule: AuditRuleItem = {
        id: `ar-${Date.now()}`,
        ruleCode: auditRuleCode.trim() || `AR-MICRO-${String(auditRules.length + 1).padStart(3, '0')}`,
        ruleName: auditRuleName.trim(),
        targetScope: auditTargetScope.trim() || '全部标本',
        conditionDesc: auditConditionDesc.trim() || '通用规则逻辑',
        actionType: auditActionType,
        priority: auditPriority,
        isEnabled: true,
        operator,
        operateTime: currentTime,
        remarks: auditRemarks.trim(),
      };
      setAuditRules((prev) => [newRule, ...prev]);
      showNotice(`新建审核规则【${auditRuleName}】保存成功！`);
    }
    handleResetAuditForm();
  };

  // Save Notification Rule
  const handleSaveNotifRule = () => {
    if (!notifRuleName.trim()) {
      showNotice('请填写消息规则名称！');
      return;
    }
    const operator = user?.name ? `${user.name}副主任检验师` : '魏明副主任检验师';
    const currentTime = '2026-10-30 11:30:00';

    const depts = notifTargetDepts
      .split(/[,，]/)
      .map((d) => d.trim())
      .filter(Boolean);

    if (editingNotificationId) {
      setNotificationRules((prev) =>
        prev.map((r) =>
          r.id === editingNotificationId
            ? {
                ...r,
                ruleName: notifRuleName.trim(),
                ruleCode: notifRuleCode.trim() || r.ruleCode,
                eventType: notifEventType,
                channels: notifChannels,
                targetDepts: depts.length > 0 ? depts : ['临床病区'],
                responseTimeout: notifTimeout,
                messageTemplate: notifTemplate,
                operator,
                operateTime: currentTime,
              }
            : r
        )
      );
      showNotice(`消息通知规则【${notifRuleName}】更新成功！`);
    } else {
      const newRule: NotificationRuleItem = {
        id: `nr-${Date.now()}`,
        ruleCode: notifRuleCode.trim() || `NR-ALERT-${String(notificationRules.length + 1).padStart(3, '0')}`,
        ruleName: notifRuleName.trim(),
        eventType: notifEventType,
        channels: notifChannels,
        targetDepts: depts.length > 0 ? depts : ['临床病区'],
        responseTimeout: notifTimeout,
        isEnabled: true,
        operator,
        operateTime: currentTime,
        messageTemplate: notifTemplate,
      };
      setNotificationRules((prev) => [newRule, ...prev]);
      showNotice(`新建消息通知规则【${notifRuleName}】保存成功！`);
    }
    handleResetNotifForm();
  };

  // Filtered sample rules
  const filteredSampleRules = useMemo(() => {
    return sampleRules.filter((r) => {
      if (selectedAppCode && r.appCode !== selectedAppCode) {
        // if user selected a specific application, prioritize that or show matching
        // In the screenshot, selecting an application shows rules for that application or list
      }
      if (!ruleSearchKeyword.trim()) return true;
      const q = ruleSearchKeyword.trim().toLowerCase();
      return (
        r.prefix.toLowerCase().includes(q) ||
        r.appName.toLowerCase().includes(q) ||
        r.example.toLowerCase().includes(q)
      );
    });
  }, [sampleRules, selectedAppCode, ruleSearchKeyword]);

  // Filtered audit rules
  const filteredAuditRules = useMemo(() => {
    if (!ruleSearchKeyword.trim()) return auditRules;
    const q = ruleSearchKeyword.trim().toLowerCase();
    return auditRules.filter(
      (r) =>
        r.ruleName.toLowerCase().includes(q) ||
        r.ruleCode.toLowerCase().includes(q) ||
        r.targetScope.toLowerCase().includes(q)
    );
  }, [auditRules, ruleSearchKeyword]);

  // Filtered notification rules
  const filteredNotifRules = useMemo(() => {
    if (!ruleSearchKeyword.trim()) return notificationRules;
    const q = ruleSearchKeyword.trim().toLowerCase();
    return notificationRules.filter(
      (r) =>
        r.ruleName.toLowerCase().includes(q) ||
        r.ruleCode.toLowerCase().includes(q) ||
        r.eventType.toLowerCase().includes(q)
    );
  }, [notificationRules, ruleSearchKeyword]);

  return (
    <div className="flex flex-col h-full bg-slate-100 text-xs text-slate-700 select-none overflow-hidden font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 text-white px-4 py-2 rounded-lg shadow-xl text-xs flex items-center gap-2 backdrop-blur-xs border border-slate-700 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Toolbar (Matches screenshot top bar) */}
      <div className="bg-white border-b border-slate-200 px-4 py-2.5 flex items-center justify-between shadow-2xs shrink-0">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-sky-600" />
            <span className="font-bold text-slate-800 text-sm">微生物检验规则管理</span>
            <span className="px-2 py-0.5 rounded text-[11px] bg-sky-50 text-sky-700 border border-sky-200 font-medium">
              LIS 规则引擎 v3.5
            </span>
          </div>

          {/* Matches Screenshot: 单位名称 [中心医院] */}
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
              <option value="中心医院">中心医院 (总院微生物核心实验室)</option>
              <option value="东城第一分院">东城第一分院 (东院急诊检验组)</option>
              <option value="滨海妇女儿童院区">滨海妇女儿童院区 (儿科病原体室)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3 text-slate-500 text-[11px]">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            规则受控时间: <strong className="text-slate-700 font-mono">2026-10-30</strong>
          </span>
          <span className="flex items-center gap-1">
            <User className="w-3.5 h-3.5 text-slate-400" />
            规则受控审核: <strong className="text-slate-700">郭彩霞主任医师</strong>
          </span>
          <button
            onClick={() => showNotice('检验规则引擎配置已同步刷新！')}
            className="flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition font-medium"
          >
            <RefreshCw className="w-3 h-3" />
            刷新规则
          </button>
        </div>
      </div>

      {/* Main Workspace: Left Rules Category + Right Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column: 规则类型 (Matches screenshot left: 样本号规则 / 审核规则 / 消息规则) */}
        <div className="w-48 bg-white border-r border-slate-200 flex flex-col shrink-0">
          <div className="p-3 border-b border-slate-200 bg-slate-50 font-bold text-slate-800 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-sky-600" />
              规则类型
            </span>
            <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-mono">
              3 类
            </span>
          </div>

          <div className="p-2 space-y-1.5 flex-1 overflow-y-auto">
            {(['样本号规则', '审核规则', '消息规则'] as MicrobiologyRuleType[]).map((type) => {
              const isActive = activeRuleType === type;
              return (
                <button
                  key={type}
                  onClick={() => handleSelectRuleCategory(type)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg font-medium transition-all flex items-center justify-between ${
                    isActive
                      ? 'bg-sky-50 text-sky-700 font-bold border border-sky-200 shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {type === '样本号规则' && <Barcode className="w-4 h-4 text-sky-600" />}
                    {type === '审核规则' && <ShieldCheck className="w-4 h-4 text-emerald-600" />}
                    {type === '消息规则' && <Bell className="w-4 h-4 text-amber-600" />}
                    <span>{type}</span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white text-slate-500 border border-slate-200">
                    {type === '样本号规则'
                      ? sampleRules.length
                      : type === '审核规则'
                      ? auditRules.length
                      : notificationRules.length}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Bottom Info */}
          <div className="p-3 border-t border-slate-200 bg-slate-50 text-[11px] text-slate-500 space-y-1">
            <div className="flex items-center justify-between">
              <span>规则状态:</span>
              <span className="text-emerald-700 font-medium">全局生效中</span>
            </div>
            <div className="flex items-center justify-between">
              <span>适用科室:</span>
              <span>微生物实验室</span>
            </div>
          </div>
        </div>

        {/* Right Content Area: Dynamically switches based on activeRuleType */}
        <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
          {/* ========================================================== */}
          {/* 1. 样本号规则 (Matches Screenshot Exactly: 申请列表 + 规则列表 + 编辑规则) */}
          {/* ========================================================== */}
          {activeRuleType === '样本号规则' && (
            <div className="flex-1 flex overflow-hidden">
              {/* Sub-Column 1: 申请列表 (Matches Screenshot Left: 申请列表 编码/名称查找) */}
              <div className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0">
                <div className="p-2.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                  <span className="font-bold text-slate-800">申请列表</span>
                  <span className="text-[10px] text-slate-400 font-mono">共 {filteredApps.length} 项</span>
                </div>

                {/* Search Box: 编码/名称查找 */}
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

                {/* Application Table */}
                <div className="flex-1 overflow-y-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-100 text-slate-600 sticky top-0 border-b border-slate-200 z-10 text-[11px]">
                      <tr>
                        <th className="py-2 px-3 font-semibold w-20">申请编码</th>
                        <th className="py-2 px-3 font-semibold">检验申请名称</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredApps.map((app) => {
                        const isSelected = selectedAppCode === app.code;
                        return (
                          <tr
                            key={app.id}
                            onClick={() => {
                              setSelectedAppCode(app.code);
                              // Auto set prefix helper
                              const initialLetter = app.name.slice(0, 1).toUpperCase();
                              setFormPrefix(`${initialLetter}[yy][MM]`);
                              showNotice(`已选中申请项目: 【${app.code} ${app.name}】`);
                            }}
                            className={`cursor-pointer transition-colors ${
                              isSelected
                                ? 'bg-sky-100 text-sky-900 font-bold'
                                : 'hover:bg-slate-50 text-slate-700'
                            }`}
                          >
                            <td className="py-2.5 px-3 font-mono">{app.code}</td>
                            <td className="py-2.5 px-3">
                              <div>{app.name}</div>
                              <div className="text-[10px] font-normal text-slate-400">
                                {app.specimenType}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                      {filteredApps.length === 0 && (
                        <tr>
                          <td colSpan={2} className="py-8 text-center text-slate-400">
                            未匹配到检验申请
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="p-2 border-t border-slate-200 bg-slate-50 text-[11px] text-slate-500 flex items-center justify-between">
                  <span>当前项目:</span>
                  <span className="font-bold text-sky-700">
                    {currentApp.code} - {currentApp.name}
                  </span>
                </div>
              </div>

              {/* Sub-Column 2 & 3: Top 规则列表 + Bottom 编辑规则 */}
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Half: 规则列表 (Matches screenshot upper table) */}
                <div className="flex-1 flex flex-col bg-white border-b border-slate-200 overflow-hidden">
                  <div className="p-2.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800">规则列表</span>
                      <span className="text-[11px] text-slate-500">
                        (当前关联项目: <strong className="text-sky-700">{currentApp.name}</strong>)
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="搜索前缀/示例..."
                          value={ruleSearchKeyword}
                          onChange={(e) => setRuleSearchKeyword(e.target.value)}
                          className="pl-2 pr-6 py-1 bg-white border border-slate-300 rounded text-slate-700 text-xs w-44 focus:ring-1 focus:ring-sky-500"
                        />
                        <Search className="w-3 h-3 text-slate-400 absolute right-2 top-2" />
                      </div>
                      <button
                        onClick={handleResetSampleForm}
                        className="flex items-center gap-1 px-2.5 py-1 bg-sky-600 hover:bg-sky-700 text-white rounded font-medium shadow-2xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        新建规则
                      </button>
                    </div>
                  </div>

                  {/* Rules Table (Matches Screenshot columns) */}
                  <div className="flex-1 overflow-y-auto">
                    <table className="w-full text-left border-collapse">
                      <thead className="bg-slate-100 text-slate-600 sticky top-0 border-b border-slate-200 text-[11px] z-10">
                        <tr>
                          <th className="py-2.5 px-3 font-semibold">样本号前缀</th>
                          <th className="py-2.5 px-3 font-semibold">顺序号位数</th>
                          <th className="py-2.5 px-3 font-semibold">复位周期</th>
                          <th className="py-2.5 px-3 font-semibold">打印方式</th>
                          <th className="py-2.5 px-3 font-semibold">打印份数</th>
                          <th className="py-2.5 px-3 font-semibold">示例</th>
                          <th className="py-2.5 px-3 font-semibold">维护人/时间</th>
                          <th className="py-2.5 px-3 font-semibold text-center w-20">状态</th>
                          <th className="py-2.5 px-3 font-semibold text-center w-28">操作</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredSampleRules.map((rule) => {
                          const isEditing = editingSampleRuleId === rule.id;
                          return (
                            <tr
                              key={rule.id}
                              className={`hover:bg-slate-50 transition-colors ${
                                isEditing ? 'bg-amber-50/70 font-medium' : ''
                              }`}
                            >
                              <td className="py-2.5 px-3 font-mono font-bold text-sky-800">
                                {rule.prefix}
                                {rule.appName && (
                                  <span className="ml-1.5 text-[10px] font-normal text-slate-400 bg-slate-100 px-1 py-0.5 rounded">
                                    {rule.appName}
                                  </span>
                                )}
                              </td>
                              <td className="py-2.5 px-3 font-mono">{rule.digitCount} 位</td>
                              <td className="py-2.5 px-3">
                                <span className="px-1.5 py-0.5 rounded text-[11px] bg-slate-100 text-slate-700">
                                  {rule.resetCycle}
                                </span>
                              </td>
                              <td className="py-2.5 px-3 text-slate-600">{rule.printMode}</td>
                              <td className="py-2.5 px-3 font-mono">{rule.printCopies || '-'}</td>
                              <td className="py-2.5 px-3 font-mono font-bold text-emerald-700">
                                {rule.example}
                              </td>
                              <td className="py-2.5 px-3 text-[11px] text-slate-500">
                                <div>{rule.operator}</div>
                                <div className="text-[10px] text-slate-400">{rule.operateTime}</div>
                              </td>
                              {/* Toggle switch (Matches Screenshot iOS Pill Switch) */}
                              <td className="py-2.5 px-3 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleToggleSampleRule(rule.id)}
                                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                    rule.isEnabled ? 'bg-sky-600' : 'bg-slate-300'
                                  }`}
                                  title={rule.isEnabled ? '点击停用' : '点击启用'}
                                >
                                  <span
                                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                                      rule.isEnabled ? 'translate-x-4' : 'translate-x-0'
                                    }`}
                                  />
                                </button>
                              </td>
                              <td className="py-2.5 px-3 text-center">
                                <div className="flex items-center justify-center gap-2">
                                  <button
                                    onClick={() => handleEditSampleRule(rule)}
                                    className="text-sky-600 hover:text-sky-800 font-medium"
                                  >
                                    编辑
                                  </button>
                                  <span className="text-slate-300">|</span>
                                  <button
                                    onClick={() => handleDeleteSampleRule(rule.id)}
                                    className="text-rose-600 hover:text-rose-800 font-medium"
                                  >
                                    删除
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                        {filteredSampleRules.length === 0 && (
                          <tr>
                            <td colSpan={9} className="py-10 text-center text-slate-400">
                              暂无样本号生成规则，请在下方表单新建规则
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Summary Bar */}
                  <div className="p-2 border-t border-slate-200 bg-slate-50 text-[11px] text-slate-500 flex items-center justify-between shrink-0">
                    <span>合计: {filteredSampleRules.length} 条</span>
                    <span className="text-slate-400">支持日/月流水号循环与双瓶自动区分</span>
                  </div>
                </div>

                {/* Bottom Half: 编辑规则 (Matches Screenshot Exactly: 规则内容 + 执行条件) */}
                <div className="h-64 bg-white flex flex-col shrink-0 border-t border-slate-200 shadow-xs">
                  {/* Title bar with 取消 and 保存 */}
                  <div className="p-2.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800">编辑规则</span>
                      {editingSampleRuleId ? (
                        <span className="px-2 py-0.5 rounded text-[10px] bg-amber-100 text-amber-800 font-bold">
                          修改已有规则
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800 font-bold">
                          为【{currentApp.name}】新建规则
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleResetSampleForm}
                        className="px-4 py-1 border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 rounded font-medium transition"
                      >
                        取消
                      </button>
                      {/* Matches Screenshot Green Save Button */}
                      <button
                        onClick={handleSaveSampleRule}
                        className="px-5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold shadow-2xs transition flex items-center gap-1.5"
                      >
                        <Save className="w-3.5 h-3.5" />
                        保存
                      </button>
                    </div>
                  </div>

                  {/* Two Sub-forms: 规则内容 (Left) + 执行条件 (Right) */}
                  <div className="flex-1 flex overflow-hidden">
                    {/* Left Sub-form: 规则内容 */}
                    <div className="flex-1 p-3.5 border-r border-slate-200 overflow-y-auto space-y-3">
                      <div className="font-bold text-slate-700 text-xs flex items-center gap-1">
                        <span className="w-1.5 h-3 bg-sky-600 rounded-xs" />
                        规则内容
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        {/* 样本号前缀 */}
                        <div>
                          <label className="block text-slate-600 font-medium mb-1">
                            <span className="text-rose-500 mr-0.5">*</span>样本号前缀
                          </label>
                          <input
                            type="text"
                            value={formPrefix}
                            onChange={(e) => setFormPrefix(e.target.value)}
                            placeholder="如: B[yy][MM] 或 T[yy][MM]"
                            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded font-mono font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500"
                          />
                          {/* Prefix Helper Tags (Matches screenshot: 前缀组成 [YY] [MM] [DD]) */}
                          <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-500">
                            <span>前缀组成:</span>
                            <button
                              type="button"
                              onClick={() => handleInsertToken('[yy]')}
                              className="px-1.5 py-0.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded font-mono text-[10px] font-bold border border-emerald-200"
                            >
                              [YY]
                            </button>
                            <button
                              type="button"
                              onClick={() => handleInsertToken('[MM]')}
                              className="px-1.5 py-0.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded font-mono text-[10px] font-bold border border-emerald-200"
                            >
                              [MM]
                            </button>
                            <button
                              type="button"
                              onClick={() => handleInsertToken('[dd]')}
                              className="px-1.5 py-0.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded font-mono text-[10px] font-bold border border-emerald-200"
                            >
                              [DD]
                            </button>
                            <span className="text-slate-400 ml-1">示例: [YY]B[MM]</span>
                          </div>
                        </div>

                        {/* 打印方式 */}
                        <div>
                          <label className="block text-slate-600 font-medium mb-1">打印方式</label>
                          <select
                            value={formPrintMode}
                            onChange={(e) => setFormPrintMode(e.target.value as any)}
                            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500"
                          >
                            <option value="不打印">不打印</option>
                            <option value="立即打印">立即打印 (核收即出签)</option>
                            <option value="批量打印">批量打印 (集中打印)</option>
                          </select>

                          <div className="mt-2 flex items-center gap-2">
                            <span className="text-slate-600 font-medium">打印份数:</span>
                            <input
                              type="number"
                              min={1}
                              max={10}
                              value={formPrintCopies}
                              onChange={(e) => setFormPrintCopies(Number(e.target.value))}
                              className="w-20 px-2 py-1 bg-slate-50 border border-slate-300 rounded font-mono text-center focus:ring-1 focus:ring-sky-500"
                            />
                            <span className="text-slate-400">份</span>
                          </div>
                        </div>

                        {/* 顺序号位数 */}
                        <div>
                          <label className="block text-slate-600 font-medium mb-1">
                            <span className="text-rose-500 mr-0.5">*</span>顺序号位数
                          </label>
                          <input
                            type="number"
                            min={3}
                            max={8}
                            value={formDigitCount}
                            onChange={(e) => setFormDigitCount(Number(e.target.value))}
                            placeholder="如: 4 或 5"
                            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded font-mono font-bold text-slate-800 focus:ring-1 focus:ring-sky-500"
                          />
                        </div>

                        {/* 示例 (Matches Screenshot: 示例 preview) */}
                        <div>
                          <label className="block text-slate-600 font-medium mb-1">示例</label>
                          <div className="w-full px-2.5 py-1.5 bg-slate-100 border border-slate-200 rounded font-mono font-bold text-emerald-800 text-sm">
                            {generatedExample}
                          </div>
                        </div>

                        {/* 复位周期 */}
                        <div>
                          <label className="block text-slate-600 font-medium mb-1">复位周期</label>
                          <select
                            value={formResetCycle}
                            onChange={(e) => setFormResetCycle(e.target.value as any)}
                            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500"
                          >
                            <option value="日">日 (每日零点重置流水)</option>
                            <option value="月">月 (每月1日重置流水)</option>
                            <option value="年">年 (每年元旦重置流水)</option>
                            <option value="永不复位">永不复位 (全周期递增)</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Right Sub-form: 执行条件 (Matches Screenshot: +增加执行条件) */}
                    <div className="w-80 p-3.5 flex flex-col overflow-y-auto bg-slate-50/50">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-bold text-slate-700 text-xs flex items-center gap-1">
                          <span className="w-1.5 h-3 bg-amber-600 rounded-xs" />
                          执行条件
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowAddCondModal(true)}
                          className="flex items-center gap-1 text-[11px] text-sky-600 hover:text-sky-800 font-bold"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          增加执行条件
                        </button>
                      </div>

                      {/* Conditions list */}
                      <div className="flex-1 space-y-2 overflow-y-auto">
                        {formConditions.map((cond) => (
                          <div
                            key={cond.id}
                            className="bg-white border border-slate-200 rounded p-2 text-xs flex items-center justify-between shadow-2xs"
                          >
                            <div className="space-x-1">
                              <span className="font-semibold text-slate-700">{cond.field}</span>
                              <span className="text-slate-400 font-mono">[{cond.operator}]</span>
                              <span className="font-mono text-sky-700 font-bold">{cond.value}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveCondition(cond.id)}
                              className="text-slate-400 hover:text-rose-600 transition"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}

                        {formConditions.length === 0 && (
                          <div className="border border-dashed border-slate-300 rounded-lg p-6 text-center text-slate-400 text-[11px]">
                            无附加执行条件（对该项目全量生效）
                          </div>
                        )}
                      </div>

                      {/* Add condition mini-card when open */}
                      {showAddCondModal && (
                        <div className="mt-2 p-2.5 bg-white border border-sky-300 rounded shadow-sm space-y-2">
                          <div className="text-[11px] font-bold text-sky-800">添加新判断条件:</div>
                          <div className="grid grid-cols-2 gap-1.5">
                            <select
                              value={newCondField}
                              onChange={(e) => setNewCondField(e.target.value)}
                              className="px-1.5 py-1 bg-slate-50 border border-slate-300 rounded text-[11px]"
                            >
                              <option value="标本类型">标本类型</option>
                              <option value="送检科室">送检科室</option>
                              <option value="急诊标志">急诊标志</option>
                              <option value="就诊类型">就诊类型</option>
                              <option value="检验项目">检验项目</option>
                            </select>
                            <select
                              value={newCondOp}
                              onChange={(e) => setNewCondOp(e.target.value)}
                              className="px-1.5 py-1 bg-slate-50 border border-slate-300 rounded text-[11px]"
                            >
                              <option value="等于">等于</option>
                              <option value="包含">包含</option>
                              <option value="不等于">不等于</option>
                            </select>
                          </div>
                          <input
                            type="text"
                            placeholder="请输入条件值 (如: 痰液 / 呼吸科)"
                            value={newCondVal}
                            onChange={(e) => setNewCondVal(e.target.value)}
                            className="w-full px-2 py-1 bg-slate-50 border border-slate-300 rounded text-xs"
                          />
                          <div className="flex items-center justify-end gap-1.5 pt-1">
                            <button
                              type="button"
                              onClick={() => setShowAddCondModal(false)}
                              className="px-2 py-0.5 border border-slate-300 rounded text-[11px] text-slate-600"
                            >
                              取消
                            </button>
                            <button
                              type="button"
                              onClick={handleAddCondition}
                              className="px-2.5 py-0.5 bg-sky-600 text-white rounded text-[11px] font-bold"
                            >
                              确定添加
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

          {/* ========================================================== */}
          {/* 2. 审核规则 (Microbiology Intelligent Audit & Auto-Release) */}
          {/* ========================================================== */}
          {activeRuleType === '审核规则' && (
            <div className="flex-1 flex flex-col overflow-hidden bg-white">
              {/* Header Bar */}
              <div className="p-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold text-slate-800">微生物报告自动审核与人工拦截规则库</span>
                  <span className="text-[11px] text-slate-500">
                    （符合规则时执行免审发布或危急值/多重耐药强制双签）
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="搜索规则名称 / 标本范围..."
                      value={ruleSearchKeyword}
                      onChange={(e) => setRuleSearchKeyword(e.target.value)}
                      className="pl-2 pr-6 py-1 bg-white border border-slate-300 rounded text-slate-700 text-xs w-56 focus:ring-1 focus:ring-sky-500"
                    />
                    <Search className="w-3 h-3 text-slate-400 absolute right-2 top-2" />
                  </div>
                  <button
                    onClick={handleResetAuditForm}
                    className="flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-medium shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    新建审核规则
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="flex-1 overflow-y-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-100 text-slate-600 sticky top-0 border-b border-slate-200 text-[11px] z-10">
                    <tr>
                      <th className="py-2.5 px-3 font-semibold w-24">规则编码</th>
                      <th className="py-2.5 px-3 font-semibold">规则名称</th>
                      <th className="py-2.5 px-3 font-semibold w-36">适用范围</th>
                      <th className="py-2.5 px-3 font-semibold">判断条件与逻辑</th>
                      <th className="py-2.5 px-3 font-semibold w-28">审核动作</th>
                      <th className="py-2.5 px-3 font-semibold text-center w-16">优先级</th>
                      <th className="py-2.5 px-3 font-semibold">维护人/时间</th>
                      <th className="py-2.5 px-3 font-semibold text-center w-20">状态</th>
                      <th className="py-2.5 px-3 font-semibold text-center w-24">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredAuditRules.map((rule) => {
                      const isEditing = editingAuditId === rule.id;
                      return (
                        <tr
                          key={rule.id}
                          className={`hover:bg-slate-50 transition-colors ${
                            isEditing ? 'bg-amber-50/70 font-medium' : ''
                          }`}
                        >
                          <td className="py-2.5 px-3 font-mono font-bold text-slate-700">
                            {rule.ruleCode}
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="font-bold text-slate-800">{rule.ruleName}</div>
                            {rule.remarks && (
                              <div className="text-[10px] text-slate-400">{rule.remarks}</div>
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-slate-600">{rule.targetScope}</td>
                          <td className="py-2.5 px-3 text-slate-600 max-w-xs">{rule.conditionDesc}</td>
                          <td className="py-2.5 px-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                rule.actionType === '自动免审通过'
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                  : rule.actionType === '危急值拦截双审'
                                  ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                  : rule.actionType === '多重耐药院感拦截'
                                  ? 'bg-purple-100 text-purple-800 border border-purple-200'
                                  : rule.actionType === '药敏矛盾拦截'
                                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                  : 'bg-blue-100 text-blue-800 border border-blue-200'
                              }`}
                            >
                              {rule.actionType}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <span
                              className={`px-1.5 py-0.2 rounded font-mono font-bold text-[10px] ${
                                rule.priority === '高'
                                  ? 'text-rose-600 bg-rose-50'
                                  : rule.priority === '中'
                                  ? 'text-amber-600 bg-amber-50'
                                  : 'text-slate-500 bg-slate-100'
                              }`}
                            >
                              {rule.priority}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-[11px] text-slate-500">
                            <div>{rule.operator}</div>
                            <div className="text-[10px] text-slate-400">{rule.operateTime}</div>
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <button
                              type="button"
                              onClick={() => handleToggleAuditRule(rule.id)}
                              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                rule.isEnabled ? 'bg-emerald-600' : 'bg-slate-300'
                              }`}
                            >
                              <span
                                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                                  rule.isEnabled ? 'translate-x-4' : 'translate-x-0'
                                }`}
                              />
                            </button>
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => {
                                  setEditingAuditId(rule.id);
                                  setAuditRuleName(rule.ruleName);
                                  setAuditRuleCode(rule.ruleCode);
                                  setAuditTargetScope(rule.targetScope);
                                  setAuditConditionDesc(rule.conditionDesc);
                                  setAuditActionType(rule.actionType);
                                  setAuditPriority(rule.priority);
                                  setAuditRemarks(rule.remarks);
                                  showNotice(`已载入审核规则【${rule.ruleName}】`);
                                }}
                                className="text-sky-600 hover:text-sky-800 font-medium"
                              >
                                编辑
                              </button>
                              <span className="text-slate-300">|</span>
                              <button
                                onClick={() => {
                                  setAuditRules((prev) => prev.filter((r) => r.id !== rule.id));
                                  showNotice('审核规则已删除');
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
                  </tbody>
                </table>
              </div>

              {/* Bottom Edit Drawer */}
              <div className="p-3.5 bg-slate-50 border-t border-slate-200 shrink-0 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-slate-800 flex items-center gap-2">
                    <span className="w-1.5 h-3 bg-emerald-600 rounded-xs" />
                    <span>{editingAuditId ? '编辑当前审核规则' : '快速新建审核规则'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleResetAuditForm}
                      className="px-3 py-1 border border-slate-300 bg-white rounded font-medium text-slate-700"
                    >
                      清空
                    </button>
                    <button
                      onClick={handleSaveAuditRule}
                      className="px-4 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold shadow-2xs"
                    >
                      保存审核规则
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-3">
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">
                      <span className="text-rose-500 mr-0.5">*</span>规则名称
                    </label>
                    <input
                      type="text"
                      placeholder="如: 正常菌群免审发布"
                      value={auditRuleName}
                      onChange={(e) => setAuditRuleName(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded font-medium focus:ring-1 focus:ring-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">适用标本/项目</label>
                    <input
                      type="text"
                      placeholder="如: 痰培养 / 血培养"
                      value={auditTargetScope}
                      onChange={(e) => setAuditTargetScope(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded focus:ring-1 focus:ring-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">审核动作</label>
                    <select
                      value={auditActionType}
                      onChange={(e) => setAuditActionType(e.target.value as any)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded font-semibold focus:ring-1 focus:ring-sky-500"
                    >
                      <option value="自动免审通过">自动免审通过 (直接出报告)</option>
                      <option value="标红拦截人工复审">标红拦截人工复审 (黄色预警)</option>
                      <option value="危急值拦截双审">危急值拦截双审 (两级确认)</option>
                      <option value="多重耐药院感拦截">多重耐药院感拦截 (院感通报)</option>
                      <option value="药敏矛盾拦截">药敏矛盾拦截 (CLSI矛盾库)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">优先级</label>
                    <select
                      value={auditPriority}
                      onChange={(e) => setAuditPriority(e.target.value as any)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded"
                    >
                      <option value="高">高 (优先强制拦截)</option>
                      <option value="中">中 (标准处理)</option>
                      <option value="低">低 (提示参考)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">判断条件描述</label>
                  <input
                    type="text"
                    placeholder="如: 结果为正常呼吸道菌群 且 无优势菌 且 临床诊断无重症肺部感染"
                    value={auditConditionDesc}
                    onChange={(e) => setAuditConditionDesc(e.target.value)}
                    className="w-full px-2.5 py-1 bg-white border border-slate-300 rounded"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ========================================================== */}
          {/* 3. 消息规则 (Microbiology Critical & Hospital Infection Notification) */}
          {/* ========================================================== */}
          {activeRuleType === '消息规则' && (
            <div className="flex-1 flex flex-col overflow-hidden bg-white">
              {/* Header Bar */}
              <div className="p-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-amber-600" />
                  <span className="font-bold text-slate-800">微生物危急值、多重耐药与报阳通知规则</span>
                  <span className="text-[11px] text-slate-500">
                    （配置触达临床与院感的多渠道极速报警规则）
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="搜索事件 / 规则名称..."
                      value={ruleSearchKeyword}
                      onChange={(e) => setRuleSearchKeyword(e.target.value)}
                      className="pl-2 pr-6 py-1 bg-white border border-slate-300 rounded text-slate-700 text-xs w-56 focus:ring-1 focus:ring-sky-500"
                    />
                    <Search className="w-3 h-3 text-slate-400 absolute right-2 top-2" />
                  </div>
                  <button
                    onClick={handleResetNotifForm}
                    className="flex items-center gap-1 px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded font-medium shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    新建消息规则
                  </button>
                </div>
              </div>

              {/* Notification Table */}
              <div className="flex-1 overflow-y-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-100 text-slate-600 sticky top-0 border-b border-slate-200 text-[11px] z-10">
                    <tr>
                      <th className="py-2.5 px-3 font-semibold w-24">规则编码</th>
                      <th className="py-2.5 px-3 font-semibold">规则名称</th>
                      <th className="py-2.5 px-3 font-semibold w-32">触发事件</th>
                      <th className="py-2.5 px-3 font-semibold">推送渠道</th>
                      <th className="py-2.5 px-3 font-semibold">接收科室/人员</th>
                      <th className="py-2.5 px-3 font-semibold w-28">时限要求</th>
                      <th className="py-2.5 px-3 font-semibold">维护人/时间</th>
                      <th className="py-2.5 px-3 font-semibold text-center w-20">状态</th>
                      <th className="py-2.5 px-3 font-semibold text-center w-24">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredNotifRules.map((rule) => {
                      const isEditing = editingNotificationId === rule.id;
                      return (
                        <tr
                          key={rule.id}
                          className={`hover:bg-slate-50 transition-colors ${
                            isEditing ? 'bg-amber-50/70 font-medium' : ''
                          }`}
                        >
                          <td className="py-2.5 px-3 font-mono font-bold text-slate-700">
                            {rule.ruleCode}
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="font-bold text-slate-800">{rule.ruleName}</div>
                            <div className="text-[10px] text-slate-400 font-mono truncate max-w-sm">
                              {rule.messageTemplate}
                            </div>
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                              {rule.eventType}
                            </span>
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="flex flex-wrap gap-1">
                              {rule.channels.map((ch, idx) => (
                                <span
                                  key={idx}
                                  className="px-1.5 py-0.2 rounded text-[10px] bg-slate-100 text-slate-700 border border-slate-200"
                                >
                                  {ch}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="py-2.5 px-3 text-slate-600">
                            {rule.targetDepts.join(', ')}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-rose-600 font-bold">
                            {rule.responseTimeout}
                          </td>
                          <td className="py-2.5 px-3 text-[11px] text-slate-500">
                            <div>{rule.operator}</div>
                            <div className="text-[10px] text-slate-400">{rule.operateTime}</div>
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <button
                              type="button"
                              onClick={() => handleToggleNotifRule(rule.id)}
                              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                rule.isEnabled ? 'bg-amber-500' : 'bg-slate-300'
                              }`}
                            >
                              <span
                                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                                  rule.isEnabled ? 'translate-x-4' : 'translate-x-0'
                                }`}
                              />
                            </button>
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => {
                                  setEditingNotificationId(rule.id);
                                  setNotifRuleName(rule.ruleName);
                                  setNotifRuleCode(rule.ruleCode);
                                  setNotifEventType(rule.eventType);
                                  setNotifChannels(rule.channels);
                                  setNotifTargetDepts(rule.targetDepts.join(', '));
                                  setNotifTimeout(rule.responseTimeout);
                                  setNotifTemplate(rule.messageTemplate);
                                  showNotice(`已载入消息规则【${rule.ruleName}】`);
                                }}
                                className="text-sky-600 hover:text-sky-800 font-medium"
                              >
                                编辑
                              </button>
                              <span className="text-slate-300">|</span>
                              <button
                                onClick={() => {
                                  setNotificationRules((prev) => prev.filter((r) => r.id !== rule.id));
                                  showNotice('消息规则已删除');
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
                  </tbody>
                </table>
              </div>

              {/* Bottom Notification Form */}
              <div className="p-3.5 bg-slate-50 border-t border-slate-200 shrink-0 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-slate-800 flex items-center gap-2">
                    <span className="w-1.5 h-3 bg-amber-600 rounded-xs" />
                    <span>{editingNotificationId ? '编辑消息规则' : '新建消息规则'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleResetNotifForm}
                      className="px-3 py-1 border border-slate-300 bg-white rounded font-medium text-slate-700"
                    >
                      清空
                    </button>
                    <button
                      onClick={handleSaveNotifRule}
                      className="px-4 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded font-bold shadow-2xs"
                    >
                      保存消息规则
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-3">
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">
                      <span className="text-rose-500 mr-0.5">*</span>规则名称
                    </label>
                    <input
                      type="text"
                      placeholder="如: 血培养首次报阳极速推送"
                      value={notifRuleName}
                      onChange={(e) => setNotifRuleName(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded font-medium focus:ring-1 focus:ring-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">触发事件</label>
                    <select
                      value={notifEventType}
                      onChange={(e) => setNotifEventType(e.target.value as any)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded font-semibold focus:ring-1 focus:ring-sky-500"
                    >
                      <option value="血培养报阳">血培养报阳</option>
                      <option value="危急值检出">危急值检出</option>
                      <option value="多重耐药(CRE/MRSA)">多重耐药(CRE/MRSA)</option>
                      <option value="特殊致病菌检出">特殊致病菌检出</option>
                      <option value="无菌体液涂片阳性">无菌体液涂片阳性</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">接收科室 (逗号分隔)</label>
                    <input
                      type="text"
                      placeholder="如: 送检临床科室, ICU病房"
                      value={notifTargetDepts}
                      onChange={(e) => setNotifTargetDepts(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded focus:ring-1 focus:ring-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">处置时限要求</label>
                    <input
                      type="text"
                      placeholder="如: 10分钟内响应"
                      value={notifTimeout}
                      onChange={(e) => setNotifTimeout(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded font-bold text-rose-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">
                    消息模板 (可用变量: {'{患者姓名}'}, {'{床号}'}, {'{条形码}'}, {'{菌株名称}'})
                  </label>
                  <input
                    type="text"
                    value={notifTemplate}
                    onChange={(e) => setNotifTemplate(e.target.value)}
                    className="w-full px-2.5 py-1 bg-white border border-slate-300 rounded font-mono text-xs"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
