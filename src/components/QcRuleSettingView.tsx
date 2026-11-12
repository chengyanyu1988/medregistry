import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  RefreshCw,
  FolderOpen,
  FileText,
  Plus,
  Sliders,
  Check,
  Building2,
  X,
  Printer,
  Download,
  ChevronRight,
  ChevronDown,
  ShieldAlert,
  ShieldCheck,
  Copy,
  Trash2,
  Play,
  HelpCircle,
  Activity,
  Layers,
  ArrowRight
} from './MenuIcon';
import { UserProfile } from '../types/navigation';
import {
  QcRuleDefinition,
  QcRuleType,
  QcRuleSeverity,
  QcRuleErrorType,
  INITIAL_QC_RULE_DEFINITIONS,
} from '../data/qualityControlData';

interface QcRuleSettingViewProps {
  user: UserProfile;
  triggerAction: (msg: string) => void;
  onNavigateToRoutineQc?: () => void;
  onNavigateToMaterials?: () => void;
}

export const QcRuleSettingView: React.FC<QcRuleSettingViewProps> = ({
  user,
  triggerAction,
  onNavigateToRoutineQc,
  onNavigateToMaterials,
}) => {
  // Top filter: 单位名称 (matching screenshot)
  const [selectedHospitalUnit, setSelectedHospitalUnit] = useState<string>('中心医院');
  const [queryKeyword, setQueryKeyword] = useState<string>('');

  // Rules dataset
  const [rules, setRules] = useState<QcRuleDefinition[]>(INITIAL_QC_RULE_DEFINITIONS);

  // Filters for Right Table
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');

  // Currently editing rule ID (null = creating new)
  const [editingRuleId, setEditingRuleId] = useState<string | null>('rule-02');

  // Left Form State (matches screenshot form fields)
  const [formCode, setFormCode] = useState<string>('02');
  const [formName, setFormName] = useState<string>('1-3s');
  const [formType, setFormType] = useState<QcRuleType>('N-Xs');
  const [formN, setFormN] = useState<string>('1');
  const [formX, setFormX] = useState<string>('3');
  const [formM, setFormM] = useState<string>('');
  const [formDescription, setFormDescription] = useState<string>(
    '1个质控测定结果超过均值±3SD控制限，提示发生显著随机误差或极大系统漂移，判定为失控，阻断当前批次报告发放。'
  );
  const [formSeverity, setFormSeverity] = useState<QcRuleSeverity>('阻断失控');
  const [formErrorType, setFormErrorType] = useState<QcRuleErrorType>('随机误差(RE)');
  const [formApplicableLevels, setFormApplicableLevels] = useState<string>('多水平通用');
  const [formStatus, setFormStatus] = useState<'在用' | '停用'>('在用');

  // Simulator Modal State
  const [showSimulator, setShowSimulator] = useState<boolean>(false);
  const [simZScores, setSimZScores] = useState<string>('1.2, 0.8, -0.4, 2.3, 2.4');
  const [simLevel2ZScores, setSimLevel2ZScores] = useState<string>('0.2, -0.5, 0.4, -2.1, -2.2');
  const [simResults, setSimResults] = useState<{
    triggeredRules: { ruleName: string; severity: string; errorType: string; reason: string }[];
    status: '在控' | '警告' | '阻断失控';
  } | null>(null);

  // Delete confirm modal
  const [ruleToDelete, setRuleToDelete] = useState<QcRuleDefinition | null>(null);

  // Toggle for rule explanation guide card
  const [isExplanationOpen, setIsExplanationOpen] = useState<boolean>(true);

  // Handle Query Button click (matching screenshot [查询])
  const handleQuery = () => {
    triggerAction(`已根据单位【${selectedHospitalUnit}】更新质控规则库检索结果`);
  };

  // Rule Type template definitions (matching screenshot bottom-left explanations)
  const RULE_TYPE_EXPLANATIONS: {
    type: QcRuleType;
    label: string;
    description: string;
    defaultN?: number;
    defaultX?: number;
    defaultM?: number;
    defaultSeverity: QcRuleSeverity;
    defaultErrorType: QcRuleErrorType;
  }[] = [
    {
      type: 'N-Xs',
      label: 'N-Xs (超差规则)',
      description: 'N个连续的质控测定结果同时超过(平均数)±(X倍标准差)时判定为违背此规则',
      defaultN: 1,
      defaultX: 2.0,
      defaultSeverity: '警告',
      defaultErrorType: '告警审查',
    },
    {
      type: 'R_Xs',
      label: 'R_Xs (极差规则)',
      description: '同批两个质控测定结果之差超过(X倍标准差)时判定为违背此规则',
      defaultX: 4.0,
      defaultSeverity: '阻断失控',
      defaultErrorType: '随机误差(RE)',
    },
    {
      type: 'N_T',
      label: 'N_T (趋势规则)',
      description: 'N个连续的质控结果呈向上或向下的趋势时判定为违背此规则',
      defaultN: 7,
      defaultSeverity: '警告',
      defaultErrorType: '系统误差(SE)',
    },
    {
      type: 'N_X',
      label: 'N_X (同侧偏离规则)',
      description: 'N个连续的质控测定结果连续落在均值同一侧时判定为违背此规则',
      defaultN: 10,
      defaultSeverity: '阻断失控',
      defaultErrorType: '系统误差(SE)',
    },
    {
      type: '(M of N)Xs',
      label: '(M of N)Xs (多中选规则)',
      description: 'N个连续的质控测定结果中，有M个质控测定结果超过(平均数)±(X倍标准差)控制限时判定为违背此规则',
      defaultN: 3,
      defaultM: 2,
      defaultX: 2.0,
      defaultSeverity: '阻断失控',
      defaultErrorType: '系统误差(SE)',
    },
  ];

  // Helper: auto format param display
  const generateParamDisplay = (type: QcRuleType, n?: number, x?: number, m?: number) => {
    switch (type) {
      case 'N-Xs':
        return `N=${n ?? 1} X=${x ?? 2}`;
      case 'R_Xs':
        return `X=${x ?? 4}`;
      case 'N_T':
        return `N=${n ?? 7} 趋势`;
      case 'N_X':
        return `N=${n ?? 10} 均值同侧`;
      case '(M of N)Xs':
        return `N=${n ?? 3} M=${m ?? 2} X=${x ?? 2}`;
      default:
        return '';
    }
  };

  // When rule type changes in editor, auto-fill standard suggestions
  const handleRuleTypeChange = (newType: QcRuleType) => {
    setFormType(newType);
    const exp = RULE_TYPE_EXPLANATIONS.find((e) => e.type === newType);
    if (exp) {
      if (exp.defaultN !== undefined) setFormN(String(exp.defaultN));
      if (exp.defaultX !== undefined) setFormX(String(exp.defaultX));
      if (exp.defaultM !== undefined) setFormM(String(exp.defaultM));
      setFormSeverity(exp.defaultSeverity);
      setFormErrorType(exp.defaultErrorType);

      // Auto update description if default
      if (!formDescription || formDescription.includes('判定为违背此规则')) {
        setFormDescription(exp.description);
      }
    }
  };

  // Populate form for editing
  const handleEditRule = (rule: QcRuleDefinition) => {
    setEditingRuleId(rule.id);
    setFormCode(rule.code);
    setFormName(rule.name);
    setFormType(rule.ruleType);
    setFormN(rule.paramN !== undefined ? String(rule.paramN) : '');
    setFormX(rule.paramX !== undefined ? String(rule.paramX) : '');
    setFormM(rule.paramM !== undefined ? String(rule.paramM) : '');
    setFormDescription(rule.description);
    setFormSeverity(rule.severity);
    setFormErrorType(rule.errorType);
    setFormApplicableLevels(rule.applicableLevels);
    setFormStatus(rule.status);
    triggerAction(`已载入规则 [${rule.code}] ${rule.name} 到左侧编辑面板`);
  };

  // Reset form to blank / new rule
  const handleNewRule = () => {
    setEditingRuleId(null);
    // Find next code
    const codes = rules.map((r) => parseInt(r.code, 10)).filter((n) => !isNaN(n));
    const nextCode = codes.length > 0 ? String(Math.max(...codes) + 1).padStart(2, '0') : '11';
    setFormCode(nextCode);
    setFormName('');
    setFormType('N-Xs');
    setFormN('1');
    setFormX('2');
    setFormM('');
    setFormDescription('N个连续的质控测定结果同时超过(平均数)±(X倍标准差)时判定为违背此规则');
    setFormSeverity('警告');
    setFormErrorType('告警审查');
    setFormApplicableLevels('多水平通用');
    setFormStatus('在用');
  };

  // Duplicate an existing rule as template
  const handleDuplicateRule = (rule: QcRuleDefinition) => {
    setEditingRuleId(null);
    const codes = rules.map((r) => parseInt(r.code, 10)).filter((n) => !isNaN(n));
    const nextCode = codes.length > 0 ? String(Math.max(...codes) + 1).padStart(2, '0') : '11';
    setFormCode(nextCode);
    setFormName(`${rule.name}-副本`);
    setFormType(rule.ruleType);
    setFormN(rule.paramN !== undefined ? String(rule.paramN) : '');
    setFormX(rule.paramX !== undefined ? String(rule.paramX) : '');
    setFormM(rule.paramM !== undefined ? String(rule.paramM) : '');
    setFormDescription(rule.description);
    setFormSeverity(rule.severity);
    setFormErrorType(rule.errorType);
    setFormApplicableLevels(rule.applicableLevels);
    setFormStatus('在用');
    triggerAction(`已复制规则 ${rule.name} 为新模板 [${nextCode}]`);
  };

  // Toggle active status directly from table
  const handleToggleStatus = (ruleId: string) => {
    setRules((prev) =>
      prev.map((r) => {
        if (r.id === ruleId) {
          const nextStatus = r.status === '在用' ? '停用' : '在用';
          triggerAction(`规则 [${r.code}] ${r.name} 已切换为【${nextStatus}】`);
          return {
            ...r,
            status: nextStatus,
            updateTime: '2026-10-29 08:45:00',
            operator: user.name || '张珊',
          };
        }
        return r;
      })
    );
  };

  // Save / Submit Rule (matching [保存] green button in screenshot)
  const handleSaveRule = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formCode.trim()) {
      triggerAction('请填写规则编码');
      return;
    }
    if (!formName.trim()) {
      triggerAction('请填写规则名称');
      return;
    }

    const nNum = formN ? parseFloat(formN) : undefined;
    const xNum = formX ? parseFloat(formX) : undefined;
    const mNum = formM ? parseFloat(formM) : undefined;
    const paramDisplay = generateParamDisplay(formType, nNum, xNum, mNum);
    const nowTime = '2026-10-29 08:45:10';
    const operatorName = user.name || '张珊';

    if (editingRuleId) {
      // Update existing
      setRules((prev) =>
        prev.map((r) =>
          r.id === editingRuleId
            ? {
                ...r,
                code: formCode.trim(),
                name: formName.trim(),
                ruleType: formType,
                paramN: nNum,
                paramX: xNum,
                paramM: mNum,
                paramDisplay,
                severity: formSeverity,
                errorType: formErrorType,
                applicableLevels: formApplicableLevels,
                description: formDescription.trim(),
                status: formStatus,
                operator: operatorName,
                updateTime: nowTime,
              }
            : r
        )
      );
      triggerAction(`规则 [${formCode}] ${formName} 修改成功已保存！`);
    } else {
      // Add new
      const newRule: QcRuleDefinition = {
        id: `rule-${Date.now()}`,
        code: formCode.trim(),
        name: formName.trim(),
        ruleType: formType,
        paramN: nNum,
        paramX: xNum,
        paramM: mNum,
        paramDisplay,
        severity: formSeverity,
        errorType: formErrorType,
        applicableLevels: formApplicableLevels,
        description: formDescription.trim(),
        hospitalUnit: selectedHospitalUnit,
        operator: operatorName,
        updateTime: nowTime,
        status: formStatus,
      };
      setRules((prev) => [...prev, newRule]);
      setEditingRuleId(newRule.id);
      triggerAction(`新增质控规则 [${formCode}] ${formName} 保存成功！`);
    }
  };

  // Delete Rule Action
  const handleConfirmDelete = () => {
    if (!ruleToDelete) return;
    setRules((prev) => prev.filter((r) => r.id !== ruleToDelete.id));
    if (editingRuleId === ruleToDelete.id) {
      handleNewRule();
    }
    triggerAction(`质控规则 [${ruleToDelete.code}] ${ruleToDelete.name} 已彻底移除`);
    setRuleToDelete(null);
  };

  // Reset to Standard Westgard Multirule library
  const handleResetToStandard = () => {
    setRules(INITIAL_QC_RULE_DEFINITIONS);
    setEditingRuleId('rule-02');
    handleEditRule(INITIAL_QC_RULE_DEFINITIONS[1]);
    triggerAction('已恢复全套国家临检中心(NCCL)推荐Westgard多规则质控体系');
  };

  // Run Simulator
  const handleRunSimulation = () => {
    try {
      const zList = simZScores.split(/[,，\s]+/).filter(Boolean).map(Number);
      const z2List = simLevel2ZScores.split(/[,，\s]+/).filter(Boolean).map(Number);

      const triggered: { ruleName: string; severity: string; errorType: string; reason: string }[] = [];

      // Test 1-3s
      const has13s = zList.some((z) => Math.abs(z) > 3.0);
      if (has13s) {
        triggered.push({
          ruleName: '1-3s',
          severity: '阻断失控',
          errorType: '随机误差(RE)',
          reason: `测定值中检测到单点偏离超过 ±3.0 SD (实际值: ${zList.find((z) => Math.abs(z) > 3.0)})`,
        });
      }

      // Test 1-2s (warning)
      const has12s = zList.some((z) => Math.abs(z) > 2.0);
      if (has12s && !has13s) {
        triggered.push({
          ruleName: '1-2s',
          severity: '警告',
          errorType: '告警审查',
          reason: '单点超过 ±2.0 SD 控制限，触发警告审查',
        });
      }

      // Test 2-2s
      let has22s = false;
      for (let i = 1; i < zList.length; i++) {
        if ((zList[i] > 2.0 && zList[i - 1] > 2.0) || (zList[i] < -2.0 && zList[i - 1] < -2.0)) {
          has22s = true;
          break;
        }
      }
      if (has22s) {
        triggered.push({
          ruleName: '2-2s',
          severity: '阻断失控',
          errorType: '系统误差(SE)',
          reason: '连续2个质控测定值同侧超过 ±2.0 SD 控制限',
        });
      }

      // Test R-4s
      let hasR4s = false;
      const minLen = Math.min(zList.length, z2List.length);
      for (let i = 0; i < minLen; i++) {
        if (Math.abs(zList[i] - z2List[i]) >= 4.0) {
          hasR4s = true;
          break;
        }
      }
      if (hasR4s) {
        triggered.push({
          ruleName: 'R-4s',
          severity: '阻断失控',
          errorType: '随机误差(RE)',
          reason: '同批双水平测定值之差 (高水平 - 低水平) ≥ 4.0 SD',
        });
      }

      // Test 4-1s
      let has41s = false;
      for (let i = 3; i < zList.length; i++) {
        const sub = zList.slice(i - 3, i + 1);
        if (sub.every((v) => v > 1.0) || sub.every((v) => v < -1.0)) {
          has41s = true;
          break;
        }
      }
      if (has41s) {
        triggered.push({
          ruleName: '4-1s',
          severity: '阻断失控',
          errorType: '系统误差(SE)',
          reason: '连续4个测定值同向偏离均值超过 ±1.0 SD',
        });
      }

      const status = triggered.some((t) => t.severity === '阻断失控')
        ? '阻断失控'
        : triggered.length > 0
        ? '警告'
        : '在控';

      setSimResults({
        triggeredRules: triggered,
        status,
      });

      triggerAction(`试运行判定完毕: ${status === '在控' ? '正常在控，批次放行' : `触发 ${triggered.length} 条质控规则`}`);
    } catch {
      triggerAction('输入数据格式有误，请以英文逗号分隔数字');
    }
  };

  // Filtered Rules
  const filteredRules = useMemo(() => {
    return rules.filter((r) => {
      // Unit filter
      if (selectedHospitalUnit && r.hospitalUnit && r.hospitalUnit !== selectedHospitalUnit) {
        // if universal, keep
        if (r.hospitalUnit !== '中心医院' && selectedHospitalUnit === '中心医院') return false;
      }

      // Search keyword
      if (queryKeyword.trim()) {
        const kw = queryKeyword.trim().toLowerCase();
        const match =
          r.code.toLowerCase().includes(kw) ||
          r.name.toLowerCase().includes(kw) ||
          r.description.toLowerCase().includes(kw) ||
          r.paramDisplay.toLowerCase().includes(kw) ||
          r.operator.toLowerCase().includes(kw);
        if (!match) return false;
      }

      // Type filter
      if (filterType !== 'all' && r.ruleType !== filterType) return false;

      // Status filter
      if (filterStatus !== 'all' && r.status !== filterStatus) return false;

      // Severity filter
      if (filterSeverity !== 'all' && r.severity !== filterSeverity) return false;

      return true;
    });
  }, [rules, selectedHospitalUnit, queryKeyword, filterType, filterStatus, filterSeverity]);

  // Statistics
  const stats = useMemo(() => {
    const total = rules.length;
    const active = rules.filter((r) => r.status === '在用').length;
    const blocking = rules.filter((r) => r.severity === '阻断失控' && r.status === '在用').length;
    const warning = rules.filter((r) => r.severity === '警告' && r.status === '在用').length;
    return { total, active, blocking, warning };
  }, [rules]);

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-slate-100 overflow-hidden text-xs">
      {/* 1. Top Header & Breadcrumb & Unit Selector (matching screenshot) */}
      <div className="bg-white border-b border-slate-200 px-4 py-2 flex flex-wrap items-center justify-between gap-3 shrink-0 shadow-2xs">
        {/* Left: Breadcrumbs & System Identity */}
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-800 flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-sky-600" />
            临生免系统
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-600 font-medium">质控管理</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-sky-700 font-semibold bg-sky-50 px-2.5 py-0.5 rounded border border-sky-200">
            质控规则设置
          </span>
          <span className="hidden lg:inline text-[11px] text-slate-400 font-mono ml-2">
            Westgard多规则判定引擎 · CLSI C24-A3
          </span>
        </div>

        {/* Center: Unit Name Select + [查询] button (Screenshot top bar) */}
        <div className="flex items-center gap-2">
          <label className="text-slate-700 font-medium whitespace-nowrap flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5 text-slate-500" />
            <span>单位名称</span>
          </label>
          <select
            value={selectedHospitalUnit}
            onChange={(e) => setSelectedHospitalUnit(e.target.value)}
            className="h-7 px-2.5 bg-white border border-slate-300 rounded text-xs text-slate-800 font-medium focus:ring-1 focus:ring-sky-500 focus:border-sky-500 outline-hidden"
          >
            <option value="中心医院">中心医院 (总院检验医学中心)</option>
            <option value="东院区急诊化验室">东院区急诊化验室</option>
            <option value="滨江分院检验中心">滨江分院检验中心</option>
          </select>
          <button
            onClick={handleQuery}
            className="h-7 px-3 bg-sky-600 hover:bg-sky-700 text-white rounded text-xs font-semibold shadow-2xs flex items-center gap-1 transition-colors"
          >
            <Search className="w-3 h-3" />
            <span>查询</span>
          </button>
        </div>

        {/* Right: Quick Module Switcher & Actions */}
        <div className="flex items-center gap-2">
          {onNavigateToRoutineQc && (
            <button
              onClick={onNavigateToRoutineQc}
              className="px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded text-xs font-medium shadow-2xs transition-colors flex items-center gap-1"
            >
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              <span>质控日常数据</span>
            </button>
          )}
          {onNavigateToMaterials && (
            <button
              onClick={onNavigateToMaterials}
              className="px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded text-xs font-medium shadow-2xs transition-colors flex items-center gap-1"
            >
              <FolderOpen className="w-3.5 h-3.5 text-slate-500" />
              <span>质控物管理</span>
            </button>
          )}

          <div className="h-4 w-px bg-slate-200 mx-0.5" />

          {/* Test Simulator Button */}
          <button
            onClick={() => setShowSimulator(true)}
            className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 rounded text-xs font-medium shadow-2xs transition-colors flex items-center gap-1"
          >
            <Play className="w-3 h-3 text-indigo-600 fill-indigo-600" />
            <span>规则试运行模拟器</span>
          </button>

          {/* Reset standard button */}
          <button
            onClick={handleResetToStandard}
            title="恢复国家临检中心标准Westgard规则全集"
            className="px-2 py-1 bg-white hover:bg-slate-50 border border-slate-300 text-slate-600 rounded text-xs shadow-2xs flex items-center gap-1 transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            <span className="hidden sm:inline">重置标准规则</span>
          </button>
        </div>
      </div>

      {/* 2. Main Split Area: Left Form & Explanations, Right Rule Master Table */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0 p-3 gap-3 overflow-y-auto lg:overflow-hidden light-scrollbar">
        {/* ----------------- LEFT PANEL: 规则编辑 & 规则说明 ----------------- */}
        <div className="w-full lg:w-[390px] xl:w-[430px] flex flex-col gap-3 shrink-0 h-full min-h-0 overflow-y-auto light-scrollbar pr-1.5 pb-6">
          {/* Card 1: 规则编辑 (Form matching screenshot) */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden flex flex-col shrink-0">
            {/* Header */}
            <div className="px-3.5 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sky-600 font-bold text-xs tracking-wide">规则编辑</span>
                {editingRuleId ? (
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-sky-100 text-sky-800 font-mono">
                    编辑编码: {formCode}
                  </span>
                ) : (
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800 font-medium">
                    + 新增规则
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400 hidden sm:inline">可纵向滚动</span>
                {editingRuleId && (
                  <button
                    onClick={handleNewRule}
                    className="px-2 py-0.5 text-[11px] text-slate-600 hover:text-sky-700 hover:bg-white rounded border border-transparent hover:border-slate-300 transition-all"
                  >
                    + 新建空白规则
                  </button>
                )}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveRule} className="p-3.5 space-y-3">
              {/* Row 1: 规则编码 & 规则类型 */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">
                    <span className="text-rose-500 font-bold mr-0.5">*</span>规则编码
                  </label>
                  <input
                    type="text"
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                    placeholder="如: 02"
                    required
                    className="w-full h-7 px-2.5 bg-white border border-slate-300 rounded text-xs font-mono font-medium focus:ring-1 focus:ring-sky-500 focus:border-sky-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">规则类型</label>
                  <select
                    value={formType}
                    onChange={(e) => handleRuleTypeChange(e.target.value as QcRuleType)}
                    className="w-full h-7 px-2 bg-white border border-slate-300 rounded text-xs font-medium focus:ring-1 focus:ring-sky-500 focus:border-sky-500 outline-hidden"
                  >
                    <option value="N-Xs">N-Xs (超差规则)</option>
                    <option value="R_Xs">R_Xs (极差规则)</option>
                    <option value="N_T">N_T (趋势规则)</option>
                    <option value="N_X">N_X (同侧偏离规则)</option>
                    <option value="(M of N)Xs">(M of N)Xs (多中选规则)</option>
                  </select>
                </div>
              </div>

              {/* Row 2: 规则名称 & N个测定值 */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">
                    <span className="text-rose-500 font-bold mr-0.5">*</span>规则名称
                  </label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="如: 1-2s, 1-3s, 2-2s"
                    required
                    className="w-full h-7 px-2.5 bg-white border border-slate-300 rounded text-xs font-medium focus:ring-1 focus:ring-sky-500 focus:border-sky-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">
                    N个测定值
                    {formType === 'R_Xs' && (
                      <span className="text-[10px] text-slate-400 font-normal ml-1">(极差默认为2)</span>
                    )}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={formN}
                    onChange={(e) => setFormN(e.target.value)}
                    placeholder={formType === 'R_Xs' ? '同批2水平' : '如: 1, 2, 4, 7'}
                    disabled={formType === 'R_Xs'}
                    className={`w-full h-7 px-2.5 border rounded text-xs font-mono font-medium focus:ring-1 focus:ring-sky-500 focus:border-sky-500 outline-hidden ${
                      formType === 'R_Xs' ? 'bg-slate-100 text-slate-400 border-slate-200' : 'bg-white border-slate-300'
                    }`}
                  />
                </div>
              </div>

              {/* Row 3: X倍标准差 & (M个测定值 if applicable or 判定级别) */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">
                    X倍标准差
                    {formType === 'N_T' && (
                      <span className="text-[10px] text-slate-400 font-normal ml-1">(趋势不限SD)</span>
                    )}
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="10"
                    value={formX}
                    onChange={(e) => setFormX(e.target.value)}
                    placeholder={formType === 'N_T' ? '趋势判定无需SD' : '如: 2, 3, 4, 1.0'}
                    disabled={formType === 'N_T'}
                    className={`w-full h-7 px-2.5 border rounded text-xs font-mono font-medium focus:ring-1 focus:ring-sky-500 focus:border-sky-500 outline-hidden ${
                      formType === 'N_T' ? 'bg-slate-100 text-slate-400 border-slate-200' : 'bg-white border-slate-300'
                    }`}
                  />
                </div>

                {formType === '(M of N)Xs' ? (
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">
                      M个测定值 <span className="text-sky-600 font-mono">(M of N)</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={formM}
                      onChange={(e) => setFormM(e.target.value)}
                      placeholder="如: 2"
                      className="w-full h-7 px-2.5 bg-white border border-slate-300 rounded text-xs font-mono font-medium focus:ring-1 focus:ring-sky-500 focus:border-sky-500 outline-hidden"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">判定级别</label>
                    <select
                      value={formSeverity}
                      onChange={(e) => setFormSeverity(e.target.value as QcRuleSeverity)}
                      className="w-full h-7 px-2 bg-white border border-slate-300 rounded text-xs font-medium focus:ring-1 focus:ring-sky-500 focus:border-sky-500 outline-hidden"
                    >
                      <option value="警告">警告 (继续质控审查)</option>
                      <option value="阻断失控">阻断失控 (严禁发报告)</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Row 4: 误差类型 & 适用水平 */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">误差归类</label>
                  <select
                    value={formErrorType}
                    onChange={(e) => setFormErrorType(e.target.value as QcRuleErrorType)}
                    className="w-full h-7 px-2 bg-white border border-slate-300 rounded text-xs font-medium focus:ring-1 focus:ring-sky-500 focus:border-sky-500 outline-hidden"
                  >
                    <option value="告警审查">告警审查</option>
                    <option value="随机误差(RE)">随机误差 (RE)</option>
                    <option value="系统误差(SE)">系统误差 (SE)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">适用水平</label>
                  <select
                    value={formApplicableLevels}
                    onChange={(e) => setFormApplicableLevels(e.target.value)}
                    className="w-full h-7 px-2 bg-white border border-slate-300 rounded text-xs font-medium focus:ring-1 focus:ring-sky-500 focus:border-sky-500 outline-hidden"
                  >
                    <option value="多水平通用">多水平通用</option>
                    <option value="双水平(高/低)">双水平 (高/低)</option>
                    <option value="三水平">三水平</option>
                  </select>
                </div>
              </div>

              {/* Row 5: 规则说明 (Textarea) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-700 font-medium">规则说明</label>
                  <button
                    type="button"
                    onClick={() => {
                      const exp = RULE_TYPE_EXPLANATIONS.find((e) => e.type === formType);
                      if (exp) setFormDescription(exp.description);
                    }}
                    className="text-[11px] text-sky-600 hover:text-sky-800 transition-colors"
                  >
                    填入官方释义
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="请输入该规则触发判定的临床检验学解释、排查要点与处理措施..."
                  className="w-full p-2 bg-white border border-slate-300 rounded text-xs text-slate-800 leading-relaxed focus:ring-1 focus:ring-sky-500 focus:border-sky-500 outline-hidden resize-none"
                />
              </div>

              {/* Status Toggle & Submit button (green button matching screenshot, sticky to bottom) */}
              <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between sticky bottom-0 bg-white/95 backdrop-blur-xs py-1.5 z-10 shadow-2xs">
                <div className="flex items-center gap-2">
                  <label className="text-slate-700 font-medium">状态:</label>
                  <button
                    type="button"
                    onClick={() => setFormStatus(formStatus === '在用' ? '停用' : '在用')}
                    className={`px-2 py-0.5 rounded text-xs font-medium border transition-colors ${
                      formStatus === '在用'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                        : 'bg-slate-100 text-slate-500 border-slate-300'
                    }`}
                  >
                    {formStatus === '在用' ? '✓ 在用' : '✕ 停用'}
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleNewRule}
                    className="px-3 py-1 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 rounded text-xs font-medium transition-colors"
                  >
                    重置
                  </button>
                  {/* Green Save Button matching screenshot */}
                  <button
                    type="submit"
                    className="px-5 py-1 bg-[#107c41] hover:bg-[#0c6b37] active:bg-[#09572c] text-white font-semibold rounded text-xs shadow-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>保存</span>
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Card 2: 规则说明指南卡片 (Directly matching screenshot bottom-left) */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-2xs p-3.5 flex flex-col gap-2.5 shrink-0">
            <div
              onClick={() => setIsExplanationOpen(!isExplanationOpen)}
              className="flex items-center justify-between border-b border-slate-100 pb-2 cursor-pointer select-none group"
            >
              <div className="flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-sky-600" />
                <span className="text-slate-800 font-bold text-xs group-hover:text-sky-700 transition-colors">
                  规则说明 (Westgard判定逻辑标准)
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <span className="text-[10px] text-slate-400">点击{isExplanationOpen ? '收起' : '展开'}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 transition-transform ${
                    isExplanationOpen ? 'rotate-180' : ''
                  }`}
                />
              </div>
            </div>

            {isExplanationOpen && (
              <>
                <div className="space-y-2 text-slate-600 leading-relaxed text-[11px] animate-fadeIn">
                  {RULE_TYPE_EXPLANATIONS.map((exp) => {
                    const isCurrent = formType === exp.type;
                    return (
                      <div
                        key={exp.type}
                        onClick={() => handleRuleTypeChange(exp.type)}
                        className={`p-2 rounded border cursor-pointer transition-all ${
                          isCurrent
                            ? 'bg-sky-50/80 border-sky-300 text-slate-900 shadow-2xs'
                            : 'bg-slate-50/50 border-slate-200 hover:bg-slate-100/80 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between font-semibold text-slate-800 mb-0.5">
                          <span className="flex items-center gap-1.5 font-mono text-sky-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                            {exp.type}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200/70 text-slate-700 font-normal">
                            {exp.defaultSeverity}
                          </span>
                        </div>
                        <p className="text-slate-600 pl-3 text-[11px] leading-snug">
                          • <strong className="font-medium text-slate-800">{exp.type}:</strong> {exp.description}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-1 pt-2 border-t border-slate-100 text-[10px] text-slate-400 flex items-center justify-between">
                  <span>遵照原图规范设计 · 临生免实验室多规则判定</span>
                  <span>更新: 2026-10-29</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* ----------------- RIGHT PANEL: 规则列表 (Master Table) ----------------- */}
        <div className="flex-1 flex flex-col bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden min-h-0">
          {/* Table Toolbar Header */}
          <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
            {/* Title & Quick Stats */}
            <div className="flex items-center gap-3">
              <span className="text-sky-600 font-bold text-xs tracking-wide">规则列表</span>
              <div className="flex items-center gap-1.5 text-[11px]">
                <span className="px-2 py-0.5 bg-slate-200/70 text-slate-700 rounded-full font-medium">
                  共 {stats.total} 条规则
                </span>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-medium">
                  启用 {stats.active} 条
                </span>
                <span className="px-2 py-0.5 bg-rose-100 text-rose-800 rounded-full font-medium">
                  阻断 {stats.blocking} 条
                </span>
              </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Keyword search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2" />
                <input
                  type="text"
                  placeholder="搜索编码 / 规则名称 / 说明..."
                  value={queryKeyword}
                  onChange={(e) => setQueryKeyword(e.target.value)}
                  className="w-44 pl-7 pr-2 h-7 bg-white border border-slate-300 rounded text-xs focus:ring-1 focus:ring-sky-500 focus:border-sky-500 outline-hidden"
                />
                {queryKeyword && (
                  <button
                    onClick={() => setQueryKeyword('')}
                    className="absolute right-1.5 top-1.5 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Type filter */}
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="h-7 px-2 bg-white border border-slate-300 rounded text-xs text-slate-700 outline-hidden"
              >
                <option value="all">所有规则类型</option>
                <option value="N-Xs">N-Xs</option>
                <option value="R_Xs">R_Xs</option>
                <option value="N_T">N_T</option>
                <option value="N_X">N_X</option>
                <option value="(M of N)Xs">(M of N)Xs</option>
              </select>

              {/* Severity filter */}
              <select
                value={filterSeverity}
                onChange={(e) => setFilterSeverity(e.target.value)}
                className="h-7 px-2 bg-white border border-slate-300 rounded text-xs text-slate-700 outline-hidden"
              >
                <option value="all">所有判定级别</option>
                <option value="阻断失控">阻断失控</option>
                <option value="警告">警告审查</option>
              </select>

              {/* Status filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="h-7 px-2 bg-white border border-slate-300 rounded text-xs text-slate-700 outline-hidden"
              >
                <option value="all">全部状态</option>
                <option value="在用">在用</option>
                <option value="停用">停用</option>
              </select>

              {/* Add New Rule Button */}
              <button
                onClick={handleNewRule}
                className="h-7 px-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded text-xs font-semibold shadow-2xs flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>新增规则</span>
              </button>
            </div>
          </div>

          {/* Table Area (matching columns in screenshot + medical details) */}
          <div className="flex-1 overflow-auto light-scrollbar">
            <table className="w-full min-w-[960px] border-collapse text-left whitespace-nowrap">
              <thead className="bg-slate-50 sticky top-0 z-10 border-b border-slate-200 text-slate-700 font-semibold text-xs shadow-2xs">
                <tr>
                  <th className="px-3 py-2 w-16 text-center border-r border-slate-200">规则编码</th>
                  <th className="px-3 py-2 w-24 border-r border-slate-200">规则名称</th>
                  <th className="px-3 py-2 w-24 border-r border-slate-200">规则类型</th>
                  <th className="px-3 py-2 w-32 border-r border-slate-200 font-mono">规则参数</th>
                  <th className="px-3 py-2 w-24 border-r border-slate-200 text-center">判定性质</th>
                  <th className="px-3 py-2 w-28 border-r border-slate-200">误差分类</th>
                  <th className="px-3 py-2 w-24 border-r border-slate-200 text-center">状态</th>
                  <th className="px-3 py-2 min-w-[240px] border-r border-slate-200 whitespace-normal">说明</th>
                  <th className="px-3 py-2 w-20 border-r border-slate-200">维护人</th>
                  <th className="px-3 py-2 w-32 border-r border-slate-200 font-mono text-[11px]">更新时间</th>
                  <th className="px-3 py-2 w-24 text-center sticky right-0 bg-slate-50 z-20">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-800">
                {filteredRules.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <FolderOpen className="w-8 h-8 text-slate-300 stroke-1" />
                        <span>暂无符合条件的质控规则</span>
                        <button
                          onClick={() => {
                            setQueryKeyword('');
                            setFilterType('all');
                            setFilterStatus('all');
                            setFilterSeverity('all');
                          }}
                          className="mt-1 px-3 py-1 text-xs text-sky-600 hover:text-sky-800 border border-sky-300 rounded"
                        >
                          重置所有筛选
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredRules.map((r) => {
                    const isSelected = editingRuleId === r.id;
                    return (
                      <tr
                        key={r.id}
                        className={`transition-colors group ${
                          isSelected ? 'bg-sky-50/70 font-medium' : 'hover:bg-slate-50/80'
                        }`}
                      >
                        {/* 规则编码 (matching screenshot) */}
                        <td className="px-3 py-2 text-center font-mono font-bold text-slate-700 border-r border-slate-100">
                          <span
                            className={`inline-block px-1.5 py-0.5 rounded text-[11px] ${
                              isSelected
                                ? 'bg-sky-600 text-white'
                                : 'bg-slate-100 text-slate-700 group-hover:bg-slate-200'
                            }`}
                          >
                            {r.code}
                          </span>
                        </td>

                        {/* 规则名称 (matching screenshot) */}
                        <td className="px-3 py-2 border-r border-slate-100">
                          <span className="font-semibold text-slate-900 font-mono">{r.name}</span>
                        </td>

                        {/* 规则类型 (matching screenshot) */}
                        <td className="px-3 py-2 border-r border-slate-100">
                          <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-sky-50 text-sky-700 border border-sky-200">
                            {r.ruleType}
                          </span>
                        </td>

                        {/* 规则参数 (matching screenshot e.g. "N=1 X=2") */}
                        <td className="px-3 py-2 border-r border-slate-100 font-mono text-slate-700">
                          <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-800">
                            {r.paramDisplay}
                          </span>
                        </td>

                        {/* 判定性质 */}
                        <td className="px-3 py-2 text-center border-r border-slate-100">
                          {r.severity === '阻断失控' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                              <ShieldAlert className="w-3 h-3 text-rose-500" />
                              阻断失控
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                              <AlertTriangle className="w-3 h-3 text-amber-500" />
                              警告审查
                            </span>
                          )}
                        </td>

                        {/* 误差分类 */}
                        <td className="px-3 py-2 border-r border-slate-100 text-slate-600">
                          {r.errorType}
                        </td>

                        {/* 状态 (在用 / 停用) */}
                        <td className="px-3 py-2 text-center border-r border-slate-100">
                          <button
                            onClick={() => handleToggleStatus(r.id)}
                            title="点击快速切换在用/停用"
                            className={`px-2 py-0.5 rounded-full text-[11px] font-medium border transition-colors ${
                              r.status === '在用'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                                : 'bg-slate-100 text-slate-500 border-slate-300 hover:bg-slate-200'
                            }`}
                          >
                            {r.status === '在用' ? '在用' : '停用'}
                          </button>
                        </td>

                        {/* 说明 (matching screenshot) */}
                        <td className="px-3 py-2 border-r border-slate-100 whitespace-normal text-slate-600 text-xs leading-relaxed max-w-sm">
                          {r.description || '-'}
                        </td>

                        {/* 维护人 (真实人名: 张珊, 蔡文斌, 陈志远, 林德胜) */}
                        <td className="px-3 py-2 border-r border-slate-100 text-slate-700 font-medium">
                          {r.operator}
                        </td>

                        {/* 更新时间 (近期: 2026-10-29) */}
                        <td className="px-3 py-2 border-r border-slate-100 font-mono text-[11px] text-slate-500">
                          {r.updateTime}
                        </td>

                        {/* 操作: 编辑 删除 (matching screenshot) */}
                        <td className="px-3 py-2 text-center sticky right-0 bg-white group-hover:bg-slate-50 shadow-xs z-10">
                          <div className="flex items-center justify-center gap-2">
                            {/* [编辑] text link matching screenshot */}
                            <button
                              onClick={() => handleEditRule(r)}
                              className="text-sky-600 hover:text-sky-800 font-medium underline-offset-2 hover:underline transition-colors"
                            >
                              编辑
                            </button>
                            {/* [复制] */}
                            <button
                              onClick={() => handleDuplicateRule(r)}
                              title="以此为模板复制新规则"
                              className="text-slate-500 hover:text-slate-700 transition-colors hidden xl:inline"
                            >
                              复制
                            </button>
                            {/* [删除] text link matching screenshot */}
                            <button
                              onClick={() => setRuleToDelete(r)}
                              className="text-rose-600 hover:text-rose-800 font-medium underline-offset-2 hover:underline transition-colors"
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

          {/* Table Footer: 合计 X条 (matching screenshot '合计: 1条') */}
          <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600 shrink-0">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-slate-800">
                合计: <span className="font-mono text-sky-700 font-bold">{filteredRules.length}</span> 条
              </span>
              <span className="text-slate-400">|</span>
              <span className="text-[11px] text-slate-500">
                在用规则: <span className="font-mono font-medium text-emerald-700">{filteredRules.filter((r) => r.status === '在用').length}</span> 项
              </span>
              <span className="text-slate-400">|</span>
              <span className="text-[11px] text-slate-500">
                阻断规则: <span className="font-mono font-medium text-rose-700">{filteredRules.filter((r) => r.severity === '阻断失控' && r.status === '在用').length}</span> 项
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => triggerAction('已生成并下载当前质控多规则配置清单 (Excel / PDF)')}
                className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 rounded text-xs shadow-2xs flex items-center gap-1 transition-colors"
              >
                <Download className="w-3 h-3 text-slate-500" />
                <span>导出规则表</span>
              </button>
              <button
                onClick={() => triggerAction('已打开实验室质控规则墙报打印排版')}
                className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 rounded text-xs shadow-2xs flex items-center gap-1 transition-colors"
              >
                <Printer className="w-3 h-3 text-slate-500" />
                <span>打印规则卡</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. SIMULATOR MODAL (规则试运行模拟器) */}
      {showSimulator && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col animate-scaleUp">
            {/* Header */}
            <div className="px-5 py-3.5 bg-gradient-to-r from-sky-700 to-indigo-800 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Play className="w-4 h-4 fill-white" />
                <h3 className="font-bold text-sm tracking-wide">Westgard 质控多规则判定试运行模拟器</h3>
              </div>
              <button
                onClick={() => setShowSimulator(false)}
                className="p-1 hover:bg-white/20 rounded-md text-white/80 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4 overflow-y-auto max-h-[75vh]">
              <div className="bg-sky-50 border border-sky-200 rounded-lg p-3 text-xs text-sky-900 leading-relaxed">
                <p className="font-medium mb-1">💡 模拟器使用说明：</p>
                <p>
                  输入模拟质控测定值的相对偏差 Z-score (以标准差SD为单位，如 <span className="font-mono font-bold">+1.5, +2.1, -0.4</span>)。系统将按目前在用规则自动进行多规则级联评估。
                </p>
              </div>

              {/* Input for Level 1 */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  质控物水平 1 测定序列 (Z-score，以逗号分隔):
                </label>
                <input
                  type="text"
                  value={simZScores}
                  onChange={(e) => setSimZScores(e.target.value)}
                  placeholder="例如: 1.2, 0.8, -0.4, 2.3, 2.4"
                  className="w-full h-8 px-3 bg-white border border-slate-300 rounded-md text-xs font-mono focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-hidden"
                />
                <div className="mt-1 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSimZScores('0.8, 1.2, 0.4, -0.6, 0.2')}
                    className="text-[11px] text-slate-500 hover:text-sky-600 underline"
                  >
                    [预设: 正常在控]
                  </button>
                  <button
                    type="button"
                    onClick={() => setSimZScores('1.2, 0.8, 2.1, 2.4')}
                    className="text-[11px] text-slate-500 hover:text-sky-600 underline"
                  >
                    [预设: 触发2-2s系统误差]
                  </button>
                  <button
                    type="button"
                    onClick={() => setSimZScores('0.5, 0.3, 3.4')}
                    className="text-[11px] text-slate-500 hover:text-sky-600 underline"
                  >
                    [预设: 触发1-3s随机误差]
                  </button>
                </div>
              </div>

              {/* Input for Level 2 (for R-4s极差规则) */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  质控物水平 2 测定序列 (用于同批双水平 R-4s 判定):
                </label>
                <input
                  type="text"
                  value={simLevel2ZScores}
                  onChange={(e) => setSimLevel2ZScores(e.target.value)}
                  placeholder="例如: 0.2, -0.5, 0.4, -2.1, -2.2"
                  className="w-full h-8 px-3 bg-white border border-slate-300 rounded-md text-xs font-mono focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-hidden"
                />
              </div>

              {/* Evaluation Output */}
              {simResults && (
                <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800 text-xs">判定综合结论:</span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold border ${
                        simResults.status === '在控'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : simResults.status === '警告'
                          ? 'bg-amber-100 text-amber-800 border-amber-300'
                          : 'bg-rose-100 text-rose-800 border-rose-300'
                      }`}
                    >
                      {simResults.status === '在控'
                        ? '✓ 在控 (质控通过，可发放标本报告)'
                        : simResults.status === '警告'
                        ? '⚠ 告警审查 (启动其他规则审查)'
                        : '⛔ 阻断失控 (严禁发报告，立即排查仪器试剂)'}
                    </span>
                  </div>

                  {simResults.triggeredRules.length > 0 ? (
                    <div className="space-y-2">
                      <span className="text-[11px] text-slate-500">违背规则明细：</span>
                      {simResults.triggeredRules.map((t, idx) => (
                        <div
                          key={idx}
                          className="bg-white p-2.5 rounded border border-slate-200 flex items-start gap-2"
                        >
                          <ShieldAlert
                            className={`w-4 h-4 mt-0.5 shrink-0 ${
                              t.severity === '阻断失控' ? 'text-rose-500' : 'text-amber-500'
                            }`}
                          />
                          <div className="text-xs">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-slate-900">{t.ruleName}</span>
                              <span
                                className={`px-1.5 py-0.2 rounded text-[10px] font-medium ${
                                  t.severity === '阻断失控'
                                    ? 'bg-rose-100 text-rose-700'
                                    : 'bg-amber-100 text-amber-700'
                                }`}
                              >
                                {t.severity}
                              </span>
                              <span className="text-[11px] text-slate-500">[{t.errorType}]</span>
                            </div>
                            <p className="text-slate-600 mt-1">{t.reason}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-emerald-50 border border-emerald-200 rounded p-3 text-xs text-emerald-800 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>所有质控点均在控，未触犯任何活跃的 Westgard 失控规则。</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2">
              <button
                onClick={() => setShowSimulator(false)}
                className="px-4 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 rounded-md text-xs font-medium transition-colors"
              >
                关闭
              </button>
              <button
                onClick={handleRunSimulation}
                className="px-5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>运行规则判定计算</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Delete Confirmation Dialog */}
      {ruleToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-sm w-full p-5 space-y-4 animate-scaleUp">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">确认删除质控规则？</h4>
                <p className="text-xs text-slate-500">此操作将移除该规则，请谨慎操作</p>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs space-y-1">
              <div>
                <span className="text-slate-500">规则编码: </span>
                <span className="font-mono font-bold text-slate-900">{ruleToDelete.code}</span>
              </div>
              <div>
                <span className="text-slate-500">规则名称: </span>
                <span className="font-semibold text-slate-900">{ruleToDelete.name}</span>
              </div>
              <div>
                <span className="text-slate-500">规则类型: </span>
                <span className="font-mono text-slate-700">{ruleToDelete.ruleType}</span>
              </div>
              <div>
                <span className="text-slate-500">判定级别: </span>
                <span className="text-rose-600 font-medium">{ruleToDelete.severity}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setRuleToDelete(null)}
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
