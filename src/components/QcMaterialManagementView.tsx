import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Download,
  Printer,
  X,
  ChevronDown,
  ChevronRight,
  FileSpreadsheet,
  BarChart3,
  Table2,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  RefreshCw,
  Folder,
  FolderOpen,
  FileText,
  Plus,
  Sliders,
  Check,
  Maximize2,
  Save,
  Building2,
  Layers
} from './MenuIcon';
import { UserProfile } from '../types/navigation';
import {
  QcMaterialDetail,
  QcLevelItem,
  QcMaterialItemSetting,
  QcWestgardRuleSetting,
  INITIAL_QC_MATERIAL_DETAILS,
  INITIAL_WESTGARD_RULES
} from '../data/qualityControlData';

interface QcMaterialManagementViewProps {
  user: UserProfile;
  triggerAction: (msg: string) => void;
  onNavigateToRoutineQc?: () => void;
  onNavigateToRuleSettings?: () => void;
}

export const QcMaterialManagementView: React.FC<QcMaterialManagementViewProps> = ({
  user,
  triggerAction,
  onNavigateToRoutineQc,
  onNavigateToRuleSettings,
}) => {
  // Top filter: 单位 (Hospital / Branch)
  const [hospitalUnit, setHospitalUnit] = useState<string>('中心医院');

  // QC Materials state
  const [materials, setMaterials] = useState<QcMaterialDetail[]>(INITIAL_QC_MATERIAL_DETAILS);

  // Search and display filter
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [showInactive, setShowInactive] = useState<boolean>(false);
  const [showInactiveLevels, setShowInactiveLevels] = useState<boolean>(false);

  // Expanded groups in left tree table
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    'D5100': true,
    'MQ2000': true,
    '生化AU2700': true,
    'Cobas 8000': true,
  });

  // Selected QC Material ID
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>('mat-d5100-01');

  // Selected QC Test Item Code
  const [selectedItemCode, setSelectedItemCode] = useState<string>('TP');

  // Modal states
  const [showAddMaterialModal, setShowAddMaterialModal] = useState<boolean>(false);
  const [showChangeLotModal, setShowChangeLotModal] = useState<boolean>(false);
  const [showEditMaterialModal, setShowEditMaterialModal] = useState<boolean>(false);
  const [showConfigureItemsModal, setShowConfigureItemsModal] = useState<boolean>(false);
  const [showConfigureRulesModal, setShowConfigureRulesModal] = useState<boolean>(false);
  const [showAddLevelModal, setShowAddLevelModal] = useState<boolean>(false);
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);

  // Editing material form state
  const [editingMaterial, setEditingMaterial] = useState<QcMaterialDetail | null>(null);

  // New material form
  const [newMaterialForm, setNewMaterialForm] = useState({
    name: '',
    deviceGroup: 'D5100',
    device: '罗氏 Cobas e411',
    levelCount: 2,
    startDate: '2026-10-29',
    manufacturer: '罗氏诊断 (Roche Diagnostics)',
    operator: user.name || '张珊',
  });

  // Change lot form
  const [changeLotForm, setChangeLotForm] = useState({
    level: 1,
    oldLot: '50322',
    newLot: '50330',
    newExpiryDate: '2027-10-31',
    newSampleNo: '1010',
    effectiveDate: '2026-10-29',
    parallelRuns: 20,
    operator: user.name || '张珊',
    reviewer: '蔡文斌',
  });

  // New level form
  const [newLevelForm, setNewLevelForm] = useState({
    level: 3,
    lotNo: '50323',
    expiryDate: '2027-04-30',
    sampleNo: '1002',
    operator: user.name || '张珊',
  });

  // Active QC Material
  const currentMaterial = useMemo(() => {
    return (
      materials.find(m => m.id === selectedMaterialId) ||
      materials[0] ||
      INITIAL_QC_MATERIAL_DETAILS[0]
    );
  }, [materials, selectedMaterialId]);

  // Active QC Item
  const currentItem = useMemo(() => {
    return (
      currentMaterial.items.find(it => it.code === selectedItemCode) ||
      currentMaterial.items[0] || {
        code: 'TP',
        name: '白蛋白',
        valueType: '靶值标准差',
        unit: 'g/L',
        levelTargets: [
          { level: 1, target: 42.0, sd: 1.20, cv: 2.86, allowableCv: 4.0 },
          { level: 2, target: 68.0, sd: 1.80, cv: 2.65, allowableCv: 4.0 },
        ],
      }
    );
  }, [currentMaterial, selectedItemCode]);

  // Toggle group expansion
  const toggleGroup = (group: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [group]: !prev[group],
    }));
  };

  // Group materials by deviceGroup
  const groupedMaterials = useMemo(() => {
    const map: Record<string, QcMaterialDetail[]> = {};
    materials.forEach(mat => {
      // Filter by search keyword
      if (searchKeyword.trim()) {
        const kw = searchKeyword.trim().toLowerCase();
        const matchName = mat.name.toLowerCase().includes(kw);
        const matchDev = mat.deviceGroup.toLowerCase().includes(kw) || mat.device.toLowerCase().includes(kw);
        const matchMan = mat.manufacturer.toLowerCase().includes(kw);
        if (!matchName && !matchDev && !matchMan) return;
      }
      // Filter by status
      if (!showInactive && mat.status === '停用') return;

      if (!map[mat.deviceGroup]) {
        map[mat.deviceGroup] = [];
      }
      map[mat.deviceGroup].push(mat);
    });
    return map;
  }, [materials, searchKeyword, showInactive]);

  // Total visible materials count
  const totalVisibleMaterials = useMemo(() => {
    return Object.values(groupedMaterials).reduce((acc, list) => acc + list.length, 0);
  }, [groupedMaterials]);

  // Filtered levels for bottom-left panel
  const visibleLevels = useMemo(() => {
    if (!currentMaterial) return [];
    return currentMaterial.levels.filter(lvl => {
      if (!showInactiveLevels && lvl.status === '停用') return false;
      return true;
    });
  }, [currentMaterial, showInactiveLevels]);

  // Handle toggle material status (在用 / 停用)
  const handleToggleMaterialStatus = (matId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setMaterials(prev =>
      prev.map(m => {
        if (m.id === matId) {
          const nextStatus = m.status === '在用' ? '停用' : '在用';
          triggerAction(`质控物《${m.name}》已切换为【${nextStatus}】状态`);
          return { ...m, status: nextStatus };
        }
        return m;
      })
    );
  };

  // Handle delete material
  const handleDeleteMaterial = (matId: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (materials.length <= 1) {
      triggerAction('至少保留一种质控物配置，无法删除最后一个质控品');
      return;
    }
    setMaterials(prev => prev.filter(m => m.id !== matId));
    if (selectedMaterialId === matId) {
      const remaining = materials.filter(m => m.id !== matId);
      if (remaining.length > 0) {
        setSelectedMaterialId(remaining[0].id);
      }
    }
    triggerAction(`质控物《${name}》已作废删除`);
  };

  // Handle toggle level status (在用 / 停用)
  const handleToggleLevelStatus = (lvlId: string) => {
    setMaterials(prev =>
      prev.map(m => {
        if (m.id === currentMaterial.id) {
          return {
            ...m,
            levels: m.levels.map(lvl => {
              if (lvl.id === lvlId) {
                const nextStatus = lvl.status === '在用' ? '停用' : '在用';
                triggerAction(`水平 ${lvl.level} (批号 ${lvl.lotNo}) 状态已切换为【${nextStatus}】`);
                return { ...lvl, status: nextStatus };
              }
              return lvl;
            }),
          };
        }
        return m;
      })
    );
  };

  // Handle update target or SD
  const handleUpdateLevelTarget = (lvl: number, field: 'target' | 'sd', val: number) => {
    setMaterials(prev =>
      prev.map(m => {
        if (m.id === currentMaterial.id) {
          return {
            ...m,
            items: m.items.map(it => {
              if (it.code === currentItem.code) {
                return {
                  ...it,
                  levelTargets: it.levelTargets.map(lt => {
                    if (lt.level === lvl) {
                      const newTarget = field === 'target' ? val : lt.target;
                      const newSd = field === 'sd' ? val : lt.sd;
                      const newCv = newTarget > 0 ? Number(((newSd / newTarget) * 100).toFixed(2)) : 0;
                      return {
                        ...lt,
                        [field]: val,
                        cv: newCv,
                      };
                    }
                    return lt;
                  }),
                };
              }
              return it;
            }),
          };
        }
        return m;
      })
    );
  };

  // Handle toggle Westgard rule enabled
  const handleToggleRule = (ruleId: string) => {
    setMaterials(prev =>
      prev.map(m => {
        if (m.id === currentMaterial.id) {
          return {
            ...m,
            rules: m.rules.map(r => {
              if (r.id === ruleId) {
                const next = !r.enabled;
                triggerAction(`Westgard质控规则 ${r.name} 已${next ? '启用' : '禁用'}`);
                return { ...r, enabled: next };
              }
              return r;
            }),
          };
        }
        return m;
      })
    );
  };

  // Save New Material
  const handleSaveNewMaterial = () => {
    if (!newMaterialForm.name.trim()) {
      triggerAction('请输入质控物名称');
      return;
    }
    const newId = `mat-${Date.now()}`;
    const levels: QcLevelItem[] = [];
    for (let i = 1; i <= newMaterialForm.levelCount; i++) {
      levels.push({
        id: `lvl-${newId}-${i}`,
        level: i,
        lotNo: `LOT-202610${i}`,
        expiryDate: '2027-10-31',
        sampleNo: `${1000 + i}`,
        status: '在用',
        operator: newMaterialForm.operator,
      });
    }

    const newMat: QcMaterialDetail = {
      id: newId,
      name: newMaterialForm.name,
      deviceGroup: newMaterialForm.deviceGroup,
      device: newMaterialForm.device,
      levelCount: newMaterialForm.levelCount,
      startDate: newMaterialForm.startDate,
      manufacturer: newMaterialForm.manufacturer,
      status: '在用',
      levels,
      items: [
        {
          code: 'TP',
          name: '白蛋白 (TP)',
          valueType: '靶值标准差',
          unit: 'g/L',
          levelTargets: [
            { level: 1, target: 42.0, sd: 1.20, cv: 2.86, allowableCv: 4.0 },
            { level: 2, target: 68.0, sd: 1.80, cv: 2.65, allowableCv: 4.0 },
          ],
        },
      ],
      rules: INITIAL_WESTGARD_RULES,
    };

    setMaterials(prev => [newMat, ...prev]);
    setSelectedMaterialId(newId);
    setShowAddMaterialModal(false);
    triggerAction(`全新质控物《${newMat.name}》已成功建立并分配默认靶值！责任技师: ${newMaterialForm.operator}`);
  };

  // Save Change Lot
  const handleSaveChangeLot = () => {
    setMaterials(prev =>
      prev.map(m => {
        if (m.id === currentMaterial.id) {
          const updatedLevels = m.levels.map(lvl => {
            if (lvl.level === changeLotForm.level) {
              return {
                ...lvl,
                lotNo: changeLotForm.newLot,
                expiryDate: changeLotForm.newExpiryDate,
                sampleNo: changeLotForm.newSampleNo,
                operator: changeLotForm.operator,
              };
            }
            return lvl;
          });
          return { ...m, levels: updatedLevels };
        }
        return m;
      })
    );
    setShowChangeLotModal(false);
    triggerAction(
      `质控物《${currentMaterial.name}》水平${changeLotForm.level}更换新批号 ${changeLotForm.newLot} 成功！完成平行双测20次效能验证，审核主管: 蔡文斌`
    );
  };

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-slate-100 overflow-hidden text-xs">
      {/* Top Header Bar */}
      <div className="bg-white border-b border-slate-200 px-4 py-2.5 flex items-center justify-between shrink-0 shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-800">临生免系统</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-600 font-medium">质控管理</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-sky-700 font-semibold bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
            质控物管理 · 台账与规则设定
          </span>
        </div>

        {/* Top Right Controls & Nav Shortcut */}
        <div className="flex items-center gap-2">
          {/* Unit / Hospital Dropdown (matching screenshot) */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-600 font-medium">单位:</span>
            <select
              value={hospitalUnit}
              onChange={e => {
                setHospitalUnit(e.target.value);
                triggerAction(`已切换质控管理单位: ${e.target.value}`);
              }}
              className="bg-white border border-slate-300 rounded px-2.5 py-1 text-xs text-slate-800 focus:outline-none focus:border-sky-500 font-medium shadow-2xs"
            >
              <option value="中心医院">中心医院 (总院检验医学科)</option>
              <option value="东院区检验科">东院区急诊化验室</option>
              <option value="滨江分院医学中心">滨江分院医学检验中心</option>
            </select>
          </div>

          <button
            onClick={() => triggerAction(`已刷新【${hospitalUnit}】质控品与检验项目台账`)}
            className="px-3 py-1 bg-sky-600 hover:bg-sky-700 text-white rounded text-xs font-semibold shadow-2xs transition-colors flex items-center gap-1"
          >
            <Search className="w-3.5 h-3.5" />
            <span>查询</span>
          </button>

          <div className="h-4 w-px bg-slate-200 mx-1" />

          {/* Quick link to Routine QC management if provided */}
          {onNavigateToRoutineQc && (
            <button
              onClick={onNavigateToRoutineQc}
              className="flex items-center gap-1 px-3 py-1 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded text-xs font-medium shadow-2xs transition-colors"
            >
              <Activity className="w-3.5 h-3.5 text-sky-600" />
              <span>室内质控测定工作台</span>
            </button>
          )}

          {onNavigateToRuleSettings && (
            <button
              onClick={onNavigateToRuleSettings}
              className="flex items-center gap-1 px-3 py-1 bg-white hover:bg-indigo-50 border border-indigo-300 text-indigo-700 rounded text-xs font-semibold shadow-2xs transition-colors"
            >
              <Sliders className="w-3.5 h-3.5 text-indigo-600" />
              <span>质控规则设置</span>
            </button>
          )}

          <button
            onClick={() => triggerAction('已打开质控物档案及Westgard质控评价规则配置打印报表')}
            className="flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded text-xs font-medium shadow-2xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>打印台账</span>
          </button>
        </div>
      </div>

      {/* Full-Width QC Material Workstation Table (Directly Displayed on Main Page) */}
      <div className="flex-1 flex min-h-0 overflow-hidden p-2.5">
        {/* ========================================================================= */}
        {/* FULL WORKSTATION: 质控物台账列表 (QC Material Master List)                    */}
        {/* ========================================================================= */}
        <div className="flex-1 bg-white rounded-lg border border-slate-200 flex flex-col shadow-2xs overflow-hidden min-h-0">
          {/* Panel Header */}
          <div className="p-2.5 border-b border-slate-200 bg-slate-50/90 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
            <div className="flex items-center gap-2.5">
              <span className="font-bold text-sky-800 text-xs flex items-center gap-1.5">
                <FolderOpen className="w-4 h-4 text-sky-600" />
                <span>质控物台账列表</span>
              </span>
              <span className="text-[11px] text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200 hidden sm:inline-block">
                提示：点击任意行或点击「配置与规则」即可弹窗查看质控项目、水平列表与 Westgard 规则
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative w-60">
                <input
                  type="text"
                  placeholder="输入名称 / 厂商 / 仪器查询..."
                  value={searchKeyword}
                  onChange={e => setSearchKeyword(e.target.value)}
                  className="w-full pl-7 pr-7 py-1 border border-slate-300 rounded text-xs focus:outline-none focus:border-sky-500 bg-white"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2" />
                {searchKeyword && (
                  <button
                    onClick={() => setSearchKeyword('')}
                    className="absolute right-2 top-2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              <label className="flex items-center gap-1 text-slate-600 cursor-pointer select-none text-[11px] px-2 py-1 bg-white border border-slate-200 rounded">
                <input
                  type="checkbox"
                  checked={showInactive}
                  onChange={e => setShowInactive(e.target.checked)}
                  className="rounded border-slate-300 text-sky-600 focus:ring-0 cursor-pointer"
                />
                <span>显示停用</span>
              </label>

              <button
                onClick={() => {
                  const allExpanded = Object.values(expandedGroups).every(Boolean);
                  const nextState: Record<string, boolean> = {};
                  Object.keys(groupedMaterials).forEach(k => {
                    nextState[k] = !allExpanded;
                  });
                  setExpandedGroups(nextState);
                }}
                className="px-2 py-1 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded text-[11px] font-medium shadow-2xs transition-colors"
              >
                {Object.values(expandedGroups).every(Boolean) ? '全部收起' : '全部展开'}
              </button>

              <button
                onClick={() => {
                  setNewMaterialForm({
                    name: '',
                    deviceGroup: currentMaterial.deviceGroup,
                    device: currentMaterial.device,
                    levelCount: 2,
                    startDate: '2026-10-29',
                    manufacturer: '贝克曼库尔特',
                    operator: user.name || '张珊',
                  });
                  setShowAddMaterialModal(true);
                }}
                className="px-2.5 py-1 bg-sky-600 hover:bg-sky-700 text-white rounded text-[11px] font-semibold shadow-2xs transition-colors flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                <span>新增质控物</span>
              </button>

              <button
                onClick={() => {
                  const lvl1 = currentMaterial.levels[0];
                  setChangeLotForm({
                    level: lvl1 ? lvl1.level : 1,
                    oldLot: lvl1 ? lvl1.lotNo : '50322',
                    newLot: lvl1 ? `${lvl1.lotNo.slice(0, -2)}99` : '50330',
                    newExpiryDate: '2027-10-31',
                    newSampleNo: lvl1 ? `${Number(lvl1.sampleNo) + 10}` : '1010',
                    effectiveDate: '2026-10-29',
                    parallelRuns: 20,
                    operator: user.name || '张珊',
                    reviewer: '蔡文斌',
                  });
                  setShowChangeLotModal(true);
                }}
                className="px-2.5 py-1 bg-white hover:bg-sky-50 border border-sky-600 text-sky-700 rounded text-[11px] font-semibold shadow-2xs transition-colors flex items-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>更换批号</span>
              </button>
            </div>
          </div>

          {/* Tree-style Full Workstation Table of QC Materials */}
          <div className="flex-1 min-h-0 overflow-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-100 text-slate-700 font-semibold text-[11px] sticky top-0 border-b border-slate-200 z-10">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">质控物名称</th>
                  <th className="py-2.5 px-3 font-semibold">仪器设备 / 分类</th>
                  <th className="py-2.5 px-2 text-center w-20 font-semibold">水平数</th>
                  <th className="py-2.5 px-3 font-semibold">在用批号与有效期</th>
                  <th className="py-2.5 px-3 font-semibold">关联质控项目</th>
                  <th className="py-2.5 px-3 w-24 font-semibold">启用日期</th>
                  <th className="py-2.5 px-3 font-semibold">生产厂商</th>
                  <th className="py-2.5 px-3 font-semibold w-24">责任技师</th>
                  <th className="py-2.5 px-2 text-center w-16 font-semibold">状态</th>
                  <th className="py-2.5 px-3 text-center w-48 font-semibold">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {Object.keys(groupedMaterials).map(group => {
                  const isExpanded = expandedGroups[group] ?? true;
                  const groupItems = groupedMaterials[group];

                  return (
                    <React.Fragment key={group}>
                      {/* Group Header Row */}
                      <tr
                        onClick={() => toggleGroup(group)}
                        className="bg-slate-100/80 hover:bg-slate-200/70 cursor-pointer text-slate-700 font-semibold select-none border-t border-slate-200"
                      >
                        <td colSpan={10} className="py-1.5 px-3">
                          <div className="flex items-center gap-2 text-xs">
                            <span className="w-4 h-4 flex items-center justify-center rounded bg-white border border-slate-300 text-slate-600 font-mono text-[11px] font-bold">
                              {isExpanded ? '−' : '+'}
                            </span>
                            <span className="text-slate-900 font-bold">{group} 模块分析仪器</span>
                            <span className="text-slate-500 font-normal text-[11px]">
                              (在档质控品: {groupItems.length} 个)
                            </span>
                          </div>
                        </td>
                      </tr>

                      {/* Items under this group */}
                      {isExpanded &&
                        groupItems.map(mat => {
                          const isSelected = selectedMaterialId === mat.id;
                          return (
                            <tr
                              key={mat.id}
                              onClick={() => {
                                setSelectedMaterialId(mat.id);
                                if (mat.items.length > 0) {
                                  setSelectedItemCode(mat.items[0].code);
                                }
                                setShowDetailModal(true);
                              }}
                              className={`cursor-pointer transition-colors ${
                                isSelected
                                  ? 'bg-sky-50/70 hover:bg-sky-100/80 font-medium'
                                  : 'hover:bg-slate-50 text-slate-700'
                              }`}
                            >
                              {/* 质控物名称 */}
                              <td className="py-2 px-3 pl-6">
                                <div className="flex items-center gap-2">
                                  <span className="w-2 h-2 rounded-full bg-sky-500 shrink-0"></span>
                                  <span className="font-bold text-slate-900 hover:text-sky-700">
                                    {mat.name}
                                  </span>
                                </div>
                              </td>

                              {/* 仪器设备 / 分类 */}
                              <td className="py-2 px-3">
                                <div className="flex items-center gap-1.5">
                                  <span className="px-1.5 py-0.5 rounded bg-slate-100 font-mono text-[10px] text-slate-600 font-bold">
                                    {mat.deviceGroup}
                                  </span>
                                  <span className="text-slate-800">{mat.device}</span>
                                </div>
                              </td>

                              {/* 水平数 */}
                              <td className="py-2 px-2 text-center">
                                <span className="px-2 py-0.5 rounded bg-sky-50 border border-sky-200 text-sky-700 font-mono font-bold text-[11px]">
                                  {mat.levelCount} 水平
                                </span>
                              </td>

                              {/* 在用批号与有效期 */}
                              <td className="py-2 px-3">
                                <div className="flex flex-col gap-0.5">
                                  {mat.levels.map(l => (
                                    <div key={l.id} className="flex items-center gap-1 text-[11px] font-mono">
                                      <span className="text-slate-400">L{l.level}:</span>
                                      <span className="font-semibold text-slate-800">{l.lotNo}</span>
                                      <span className="text-slate-400">({l.expiryDate})</span>
                                    </div>
                                  ))}
                                </div>
                              </td>

                              {/* 关联质控项目 */}
                              <td className="py-2 px-3">
                                <div className="flex items-center gap-1 flex-wrap">
                                  {mat.items.slice(0, 3).map(it => (
                                    <span
                                      key={it.code}
                                      className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium border border-slate-200"
                                    >
                                      {it.code}·{it.name}
                                    </span>
                                  ))}
                                  {mat.items.length > 3 && (
                                    <span className="text-slate-400 text-[10px] font-mono">
                                      +{mat.items.length - 3}项
                                    </span>
                                  )}
                                </div>
                              </td>

                              {/* 启用日期 */}
                              <td className="py-2 px-3 font-mono text-slate-500 whitespace-nowrap text-[11px]">
                                {mat.startDate}
                              </td>

                              {/* 生产厂商 */}
                              <td className="py-2 px-3 text-slate-600 truncate max-w-[140px]" title={mat.manufacturer}>
                                {mat.manufacturer}
                              </td>

                              {/* 责任技师 */}
                              <td className="py-2 px-3 text-slate-800 font-medium">
                                {mat.levels[0]?.operator || '张珊'}
                              </td>

                              {/* 状态 */}
                              <td className="py-2 px-2 text-center">
                                <span
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                    mat.status === '在用'
                                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                      : 'bg-slate-100 text-slate-500 border border-slate-200'
                                  }`}
                                >
                                  {mat.status}
                                </span>
                              </td>

                              {/* 操作按钮 */}
                              <td className="py-2 px-3 text-center" onClick={e => e.stopPropagation()}>
                                <div className="flex items-center justify-center gap-1.5 text-[11px]">
                                  <button
                                    onClick={() => {
                                      setSelectedMaterialId(mat.id);
                                      if (mat.items.length > 0) {
                                        setSelectedItemCode(mat.items[0].code);
                                      }
                                      setShowDetailModal(true);
                                    }}
                                    className="px-2 py-1 bg-sky-50 hover:bg-sky-100 border border-sky-300 text-sky-700 rounded text-[11px] font-semibold flex items-center gap-1 transition-colors"
                                    title="点击弹窗查看质控项目、水平列表与Westgard质控规则"
                                  >
                                    <Sliders className="w-3 h-3 text-sky-600" />
                                    <span>配置与规则</span>
                                  </button>

                                  <button
                                    onClick={() => {
                                      setSelectedMaterialId(mat.id);
                                      const lvl1 = mat.levels[0];
                                      setChangeLotForm({
                                        level: lvl1 ? lvl1.level : 1,
                                        oldLot: lvl1 ? lvl1.lotNo : '50322',
                                        newLot: lvl1 ? `${lvl1.lotNo.slice(0, -2)}99` : '50330',
                                        newExpiryDate: '2027-10-31',
                                        newSampleNo: lvl1 ? `${Number(lvl1.sampleNo) + 10}` : '1010',
                                        effectiveDate: '2026-10-29',
                                        parallelRuns: 20,
                                        operator: user.name || '张珊',
                                        reviewer: '蔡文斌',
                                      });
                                      setShowChangeLotModal(true);
                                    }}
                                    className="text-sky-600 hover:text-sky-800 hover:underline font-medium"
                                  >
                                    换批
                                  </button>

                                  <button
                                    onClick={() => {
                                      setEditingMaterial(mat);
                                      setShowEditMaterialModal(true);
                                    }}
                                    className="text-slate-600 hover:text-slate-800 hover:underline font-medium"
                                  >
                                    编辑
                                  </button>

                                  <button
                                    onClick={e => handleToggleMaterialStatus(mat.id, e)}
                                    className={`${
                                      mat.status === '在用'
                                        ? 'text-amber-600 hover:text-amber-800'
                                        : 'text-emerald-600 hover:text-emerald-800'
                                    } hover:underline font-medium`}
                                  >
                                    {mat.status === '在用' ? '停用' : '启用'}
                                  </button>

                                  <button
                                    onClick={e => handleDeleteMaterial(mat.id, mat.name, e)}
                                    className="text-rose-600 hover:text-rose-800 hover:underline font-medium"
                                  >
                                    删除
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Bottom Summary Bar */}
          <div className="bg-slate-50 px-4 py-2 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <span>
                合计质控物: <strong className="text-slate-800 font-mono">{totalVisibleMaterials}</strong> 种
              </span>
              <span>·</span>
              <span>
                在用质控物: <strong className="text-emerald-600 font-mono">{materials.filter(m => m.status === '在用').length}</strong> 种
              </span>
              <span>·</span>
              <span className="text-slate-400">
                双击或点击质控物行即可打开配置与规则弹窗
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              全科室质控分析物料统一管理平台 · 审核主任: 蔡文斌
            </div>
          </div>
        </div>
      </div>
      {/* ========================================================================= */}
      {/* POPUP MODAL: 质控物配置与规则详情弹窗 (Detail & Rules Popup Modal)             */}
      {/* ========================================================================= */}
      {showDetailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-300 w-full max-w-6xl h-[88vh] flex flex-col overflow-hidden animate-scaleIn text-xs">
            {/* Modal Header */}
            <div className="bg-slate-50 border-b border-slate-200 px-5 py-3 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-sky-100 border border-sky-200 flex items-center justify-center text-sky-700">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-slate-900">
                      【{currentMaterial.name}】质控配置与规则详情
                    </h3>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        currentMaterial.status === '在用'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-500 border border-slate-200'
                      }`}
                    >
                      {currentMaterial.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2 flex-wrap">
                    <span>仪器: <strong className="text-slate-700">{currentMaterial.device}</strong></span>
                    <span>·</span>
                    <span>分类模块: <strong className="text-slate-700">{currentMaterial.deviceGroup}</strong></span>
                    <span>·</span>
                    <span>生产厂商: <strong className="text-slate-700">{currentMaterial.manufacturer}</strong></span>
                    <span>·</span>
                    <span>启用日期: <strong className="font-mono text-slate-700">{currentMaterial.startDate}</strong></span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const lvl1 = currentMaterial.levels[0];
                    setChangeLotForm({
                      level: lvl1 ? lvl1.level : 1,
                      oldLot: lvl1 ? lvl1.lotNo : '50322',
                      newLot: lvl1 ? `${lvl1.lotNo.slice(0, -2)}99` : '50330',
                      newExpiryDate: '2027-10-31',
                      newSampleNo: lvl1 ? `${Number(lvl1.sampleNo) + 10}` : '1010',
                      effectiveDate: '2026-10-29',
                      parallelRuns: 20,
                      operator: user.name || '张珊',
                      reviewer: '蔡文斌',
                    });
                    setShowChangeLotModal(true);
                  }}
                  className="px-3 py-1 bg-white hover:bg-sky-50 border border-sky-600 text-sky-700 rounded text-xs font-semibold shadow-2xs transition-colors flex items-center gap-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>更换批号</span>
                </button>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body: Left Panels (质控项目 + 水平列表) & Right Panel (质控规则与靶值) */}
            <div className="flex-1 min-h-0 flex overflow-hidden p-3 gap-3 bg-slate-50/50">
              {/* Left Column Inside Modal: 质控项目 + 水平列表 */}
              <div className="w-[420px] flex flex-col gap-3 shrink-0 overflow-hidden">
                {/* Top Sub-Panel: 质控项目 (QC Items) */}
                <div className="flex-1 bg-white rounded-lg border border-slate-200 flex flex-col shadow-2xs overflow-hidden min-h-0">
            <div className="p-2.5 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between shrink-0">
              <span className="font-bold text-sky-700 text-xs flex items-center gap-1.5">
                <Table2 className="w-4 h-4 text-sky-600" />
                <span>质控项目</span>
                <span className="text-[10px] text-slate-400 font-mono">({currentMaterial.items.length})</span>
              </span>

              <button
                onClick={() => setShowConfigureItemsModal(true)}
                className="px-2.5 py-1 bg-white hover:bg-sky-50 border border-sky-600 text-sky-700 rounded text-[11px] font-semibold shadow-2xs transition-colors"
              >
                质控项目
              </button>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-slate-100 text-slate-700 font-semibold text-[11px] sticky top-0 border-b border-slate-200">
                  <tr>
                    <th className="py-2 px-3 w-20">项目代码</th>
                    <th className="py-2 px-3">质控项目</th>
                    <th className="py-2 px-3 text-right">值类型</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentMaterial.items.map(item => {
                    const isSelected = selectedItemCode === item.code;
                    return (
                      <tr
                        key={item.code}
                        onClick={() => {
                          setSelectedItemCode(item.code);
                          triggerAction(`已选择项目: ${item.name}，右侧规则已同步`);
                        }}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-sky-50 font-semibold border-l-2 border-sky-600 text-sky-800'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <td className="py-2 px-3 font-mono font-medium text-slate-900">
                          {item.code}
                        </td>
                        <td className="py-2 px-3">
                          <div className="flex items-center gap-1.5">
                            <span>{item.name}</span>
                            {item.unit && (
                              <span className="text-[10px] text-slate-400 font-mono">({item.unit})</span>
                            )}
                          </div>
                        </td>
                        <td className="py-2 px-3 text-right">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                              item.valueType === '靶值标准差'
                                ? 'bg-sky-50 text-sky-700 border border-sky-200'
                                : item.valueType === '定性'
                                ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            }`}
                          >
                            {item.valueType}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="bg-slate-50 px-3 py-1.5 border-t border-slate-200 text-[11px] text-slate-500 shrink-0">
              当前质控物: <strong className="text-slate-700">{currentMaterial.name}</strong>
            </div>
          </div>

          {/* Bottom Sub-Panel: 水平列表 (Level List matching screenshot) */}
          <div className="flex-1 bg-white rounded-lg border border-slate-200 flex flex-col shadow-2xs overflow-hidden min-h-0">
            <div className="p-2.5 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <span className="font-bold text-sky-700 text-xs flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-sky-600" />
                  <span>水平列表</span>
                </span>
                <label className="flex items-center gap-1 text-[11px] text-slate-600 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={showInactiveLevels}
                    onChange={e => setShowInactiveLevels(e.target.checked)}
                    className="rounded border-slate-300 text-sky-600 focus:ring-0 cursor-pointer"
                  />
                  <span>显示停用</span>
                </label>
              </div>

              <button
                onClick={() => {
                  setNewLevelForm({
                    level: currentMaterial.levels.length + 1,
                    lotNo: `5032${currentMaterial.levels.length + 1}`,
                    expiryDate: '2027-04-30',
                    sampleNo: `${1000 + currentMaterial.levels.length}`,
                    operator: user.name || '张珊',
                  });
                  setShowAddLevelModal(true);
                }}
                className="px-2 py-0.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded text-[10px] font-medium"
              >
                + 新增水平
              </button>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-slate-100 text-slate-700 font-semibold text-[11px] sticky top-0 border-b border-slate-200">
                  <tr>
                    <th className="py-2 px-2.5 text-center w-12">水平</th>
                    <th className="py-2 px-2.5">批号</th>
                    <th className="py-2 px-2.5">有效期</th>
                    <th className="py-2 px-2 font-mono text-center">样本号</th>
                    <th className="py-2 px-2 text-center w-14">状态</th>
                    <th className="py-2 px-2 text-center w-14">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {visibleLevels.map(lvl => (
                    <tr key={lvl.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2 px-2.5 text-center font-mono font-bold text-slate-900">
                        {lvl.level}
                      </td>
                      <td className="py-2 px-2.5 font-mono text-slate-700 font-semibold">
                        {lvl.lotNo}
                      </td>
                      <td className="py-2 px-2.5 font-mono text-slate-500 text-[11px] whitespace-nowrap">
                        {lvl.expiryDate}
                      </td>
                      <td className="py-2 px-2 font-mono text-center text-slate-700">
                        {lvl.sampleNo}
                      </td>
                      <td className="py-2 px-2 text-center">
                        <span
                          className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                            lvl.status === '在用'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-500 border border-slate-200'
                          }`}
                        >
                          {lvl.status}
                        </span>
                      </td>
                      <td className="py-2 px-2 text-center">
                        <button
                          onClick={() => handleToggleLevelStatus(lvl.id)}
                          className={`${
                            lvl.status === '在用'
                              ? 'text-sky-600 hover:text-sky-800'
                              : 'text-emerald-600 hover:text-emerald-800'
                          } font-medium text-[11px] hover:underline`}
                        >
                          {lvl.status === '在用' ? '停用' : '启用'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-slate-50 px-3 py-1.5 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between shrink-0">
              <span>在用水平数: <strong className="text-slate-800">{visibleLevels.length}</strong></span>
              <span className="text-[10px] text-emerald-600 font-medium">✓ 有效期管理已达标</span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: 质控规则 (QC Rules & Multi-Level Target/SD)                    */}
        {/* ========================================================================= */}
        <div className="flex-1 bg-white rounded-lg border border-slate-200 flex flex-col shadow-2xs overflow-hidden min-h-0">
          {/* Header */}
          <div className="p-2.5 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sky-700 text-xs flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-sky-600" />
                <span>质控规则 · {currentItem.name}</span>
              </span>
              <span className="text-[11px] text-slate-500 font-mono bg-white px-2 py-0.5 rounded border border-slate-200">
                代码: {currentItem.code}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowConfigureRulesModal(true)}
                className="px-2.5 py-1 bg-white hover:bg-sky-50 border border-sky-600 text-sky-700 rounded text-[11px] font-semibold shadow-2xs transition-colors"
              >
                质控规则
              </button>
            </div>
          </div>

          {/* Sub-section 1: Multi-Level Target, SD & CV Table */}
          <div className="flex-1 flex flex-col min-h-0 border-b border-slate-200 overflow-hidden">
            <div className="px-3 py-1.5 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between text-[11px] text-slate-600 shrink-0">
              <span className="font-semibold text-slate-700">各水平靶值与允许变异系数 (可直接在单元格修改)</span>
              <span className="text-[10px] text-emerald-600">CV% 自动实时联动计算</span>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-slate-100 text-slate-700 font-semibold text-[11px] sticky top-0 border-b border-slate-200">
                  <tr>
                    <th className="py-2 px-3 text-center w-16">水平</th>
                    <th className="py-2 px-3 text-right">靶值</th>
                    <th className="py-2 px-3 text-right">标准差 (SD)</th>
                    <th className="py-2 px-3 text-right font-mono">CV (%)</th>
                    <th className="py-2 px-3 text-right font-mono">允许CV (%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentItem.levelTargets.map(lt => (
                    <tr key={lt.level} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2 px-3 text-center font-mono font-bold text-slate-900">
                        {lt.level}
                      </td>
                      <td className="py-1 px-3 text-right">
                        <input
                          type="number"
                          step="0.01"
                          value={lt.target}
                          onChange={e => handleUpdateLevelTarget(lt.level, 'target', Number(e.target.value))}
                          className="w-24 text-right font-mono py-1 px-1.5 border border-slate-200 rounded focus:outline-none focus:border-sky-500 bg-slate-50/60 focus:bg-white text-xs font-bold text-slate-800"
                        />
                      </td>
                      <td className="py-1 px-3 text-right">
                        <input
                          type="number"
                          step="0.01"
                          value={lt.sd}
                          onChange={e => handleUpdateLevelTarget(lt.level, 'sd', Number(e.target.value))}
                          className="w-24 text-right font-mono py-1 px-1.5 border border-slate-200 rounded focus:outline-none focus:border-sky-500 bg-slate-50/60 focus:bg-white text-xs text-slate-800"
                        />
                      </td>
                      <td className="py-2 px-3 text-right font-mono font-bold text-emerald-600">
                        {lt.cv.toFixed(2)}%
                      </td>
                      <td className="py-2 px-3 text-right font-mono text-slate-600">
                        {lt.allowableCv.toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sub-section 2: Westgard Rule Evaluation Definition (matching lower right table) */}
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            <div className="px-3 py-1.5 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between text-[11px] text-slate-600 shrink-0">
              <span className="font-semibold text-slate-700">Westgard多规则判定引擎</span>
              <span className="text-[10px] text-slate-400">点击勾选启用/停用特定判定规则</span>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="bg-slate-100 text-slate-700 font-semibold text-[11px] sticky top-0 border-b border-slate-200">
                  <tr>
                    <th className="py-2 px-3 w-10 text-center">启用</th>
                    <th className="py-2 px-3 font-semibold w-24">规则名称</th>
                    <th className="py-2 px-3 font-semibold w-24">类型</th>
                    <th className="py-2 px-3 font-semibold w-24">质控类型</th>
                    <th className="py-2 px-3 font-semibold">规则临床判定释义</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentMaterial.rules.map(rule => (
                    <tr
                      key={rule.id}
                      onClick={() => handleToggleRule(rule.id)}
                      className={`cursor-pointer transition-colors ${
                        rule.enabled ? 'hover:bg-slate-50' : 'bg-slate-50/50 opacity-60'
                      }`}
                    >
                      <td className="py-2 px-3 text-center" onClick={e => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={rule.enabled}
                          onChange={() => handleToggleRule(rule.id)}
                          className="rounded border-slate-300 text-sky-600 focus:ring-0 cursor-pointer"
                        />
                      </td>
                      <td className="py-2 px-3 font-mono font-bold text-slate-900">
                        {rule.name}
                      </td>
                      <td className="py-2 px-3 font-mono text-slate-600">
                        {rule.type}
                      </td>
                      <td className="py-2 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            rule.qcType === '警告'
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : 'bg-rose-100 text-rose-800 border border-rose-200'
                          }`}
                        >
                          {rule.qcType}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-slate-600 text-[11px] truncate" title={rule.description}>
                        {rule.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

            {/* Modal Bottom Status Ribbon & Action Footer */}
            <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 text-xs text-slate-600 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3 text-[11px] text-slate-500">
                <span>责任质控师: <strong className="text-slate-800">张珊</strong> (主管技师)</span>
                <span>·</span>
                <span>审定专家: <strong className="text-slate-800">蔡文斌</strong> (副主任技师/质控组长)</span>
                <span>·</span>
                <span>最近校准维护: <strong className="font-mono text-slate-800">2026-10-29</strong></span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-4 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 rounded text-xs font-medium transition-colors"
                >
                  退出 / 关闭
                </button>
                <button
                  onClick={() => {
                    triggerAction('质控规则与靶值设定已成功持久化保存！');
                    setShowDetailModal(false);
                  }}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>保存规则配置</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: 新增质控物 (Add QC Material Modal)                                 */}
      {/* ========================================================================= */}
      {showAddMaterialModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-300 w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden animate-scaleIn text-xs">
            <div className="bg-slate-50 border-b border-slate-200 px-5 py-3.5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-sky-600" />
                <h3 className="font-bold text-sm text-slate-800">新增室内质控品物料</h3>
              </div>
              <button
                onClick={() => setShowAddMaterialModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-3.5 text-xs">
              <div>
                <label className="text-slate-600 block mb-1 font-medium">质控物名称 *:</label>
                <input
                  type="text"
                  placeholder="例如: 肿瘤标志物液体质控品"
                  value={newMaterialForm.name}
                  onChange={e => setNewMaterialForm({ ...newMaterialForm, name: e.target.value })}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-sky-500 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-600 block mb-1 font-medium">设备分类/模块:</label>
                  <select
                    value={newMaterialForm.deviceGroup}
                    onChange={e => setNewMaterialForm({ ...newMaterialForm, deviceGroup: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 bg-white text-xs"
                  >
                    <option value="D5100">D5100 (电化学发光模块)</option>
                    <option value="MQ2000">MQ2000 (糖化色谱模块)</option>
                    <option value="生化AU2700">生化AU2700 (生化流水线)</option>
                    <option value="Cobas 8000">Cobas 8000 (化学发光模块)</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-600 block mb-1 font-medium">水平数:</label>
                  <select
                    value={newMaterialForm.levelCount}
                    onChange={e => setNewMaterialForm({ ...newMaterialForm, levelCount: Number(e.target.value) })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 bg-white text-xs font-mono font-bold"
                  >
                    <option value={2}>2 个水平 (双水平质控)</option>
                    <option value={3}>3 个水平 (低/中/高三水平)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-600 block mb-1 font-medium">启用日期:</label>
                  <input
                    type="date"
                    value={newMaterialForm.startDate}
                    onChange={e => setNewMaterialForm({ ...newMaterialForm, startDate: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="text-slate-600 block mb-1 font-medium">生产厂商:</label>
                  <input
                    type="text"
                    value={newMaterialForm.manufacturer}
                    onChange={e => setNewMaterialForm({ ...newMaterialForm, manufacturer: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-600 block mb-1 font-medium">经办维护技师 (真实姓名):</label>
                <input
                  type="text"
                  value={newMaterialForm.operator}
                  onChange={e => setNewMaterialForm({ ...newMaterialForm, operator: e.target.value })}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs font-bold text-slate-800"
                />
              </div>
            </div>

            <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex items-center justify-end gap-2 shrink-0">
              <button
                onClick={() => setShowAddMaterialModal(false)}
                className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 rounded text-xs"
              >
                取消
              </button>
              <button
                onClick={handleSaveNewMaterial}
                className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded text-xs font-semibold shadow-xs"
              >
                确认建立质控物
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: 更换批号 (Change Lot/Batch Modal)                                  */}
      {/* ========================================================================= */}
      {showChangeLotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-300 w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden animate-scaleIn text-xs">
            <div className="bg-slate-50 border-b border-slate-200 px-5 py-3.5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-sky-600" />
                <div>
                  <h3 className="font-bold text-sm text-slate-800">质控品批号有效期轮换更新</h3>
                  <p className="text-[11px] text-slate-500">
                    当前质控物: {currentMaterial.name} ({currentMaterial.manufacturer.split(' ')[0]})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowChangeLotModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-3.5 text-xs">
              <div className="p-3 bg-amber-50 rounded border border-amber-200 text-amber-900 leading-relaxed text-[11px]">
                <strong>ISO 15189 与 CAP 规范提示:</strong> 更换新批号质控品时，应提前不少于2周与老批号进行至少20次平行测定比对，完成靶值重估与评价审批。
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-600 block mb-1 font-medium">更换水平:</label>
                  <select
                    value={changeLotForm.level}
                    onChange={e => {
                      const lvlNum = Number(e.target.value);
                      const targetLvl = currentMaterial.levels.find(l => l.level === lvlNum);
                      setChangeLotForm({
                        ...changeLotForm,
                        level: lvlNum,
                        oldLot: targetLvl ? targetLvl.lotNo : '',
                      });
                    }}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 bg-white text-xs font-mono font-bold"
                  >
                    {currentMaterial.levels.map(l => (
                      <option key={l.level} value={l.level}>
                        水平 {l.level} (当前批号: {l.lotNo})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-slate-600 block mb-1 font-medium">原在用批号:</label>
                  <input
                    type="text"
                    disabled
                    value={changeLotForm.oldLot}
                    className="w-full border border-slate-200 bg-slate-100 rounded px-2.5 py-1.5 text-xs font-mono text-slate-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-600 block mb-1 font-medium">新启用批号 LOT *:</label>
                  <input
                    type="text"
                    value={changeLotForm.newLot}
                    onChange={e => setChangeLotForm({ ...changeLotForm, newLot: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs font-mono font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="text-slate-600 block mb-1 font-medium">新质控品有效期 *:</label>
                  <input
                    type="date"
                    value={changeLotForm.newExpiryDate}
                    onChange={e => setChangeLotForm({ ...changeLotForm, newExpiryDate: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-600 block mb-1 font-medium">新分配样本号:</label>
                  <input
                    type="text"
                    value={changeLotForm.newSampleNo}
                    onChange={e => setChangeLotForm({ ...changeLotForm, newSampleNo: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="text-slate-600 block mb-1 font-medium">平行比对完成次数:</label>
                  <input
                    type="number"
                    value={changeLotForm.parallelRuns}
                    onChange={e => setChangeLotForm({ ...changeLotForm, parallelRuns: Number(e.target.value) })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-600 block mb-1 font-medium">更换操作人 (真实人名):</label>
                  <input
                    type="text"
                    value={changeLotForm.operator}
                    onChange={e => setChangeLotForm({ ...changeLotForm, operator: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="text-slate-600 block mb-1 font-medium">质控审核人 (真实人名):</label>
                  <input
                    type="text"
                    value={changeLotForm.reviewer}
                    onChange={e => setChangeLotForm({ ...changeLotForm, reviewer: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs font-semibold"
                  />
                </div>
              </div>
            </div>

            <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex items-center justify-end gap-2 shrink-0">
              <button
                onClick={() => setShowChangeLotModal(false)}
                className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 rounded text-xs"
              >
                取消
              </button>
              <button
                onClick={handleSaveChangeLot}
                className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded text-xs font-semibold shadow-xs"
              >
                确认更换并生效新批号
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: 编辑质控物 (Edit Material Modal)                                  */}
      {/* ========================================================================= */}
      {showEditMaterialModal && editingMaterial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-300 w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden animate-scaleIn text-xs">
            <div className="bg-slate-50 border-b border-slate-200 px-5 py-3.5 flex items-center justify-between shrink-0">
              <h3 className="font-bold text-sm text-slate-800">编辑质控物参数 · {editingMaterial.name}</h3>
              <button
                onClick={() => setShowEditMaterialModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-3 text-xs">
              <div>
                <label className="text-slate-600 block mb-1 font-medium">质控物名称:</label>
                <input
                  type="text"
                  value={editingMaterial.name}
                  onChange={e => setEditingMaterial({ ...editingMaterial, name: e.target.value })}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="text-slate-600 block mb-1 font-medium">生产厂商:</label>
                <input
                  type="text"
                  value={editingMaterial.manufacturer}
                  onChange={e => setEditingMaterial({ ...editingMaterial, manufacturer: e.target.value })}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-600 block mb-1 font-medium">启用日期:</label>
                  <input
                    type="date"
                    value={editingMaterial.startDate}
                    onChange={e => setEditingMaterial({ ...editingMaterial, startDate: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="text-slate-600 block mb-1 font-medium">状态:</label>
                  <select
                    value={editingMaterial.status}
                    onChange={e => setEditingMaterial({ ...editingMaterial, status: e.target.value as '在用' | '停用' })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 bg-white text-xs"
                  >
                    <option value="在用">在用</option>
                    <option value="停用">停用</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex items-center justify-end gap-2 shrink-0">
              <button
                onClick={() => setShowEditMaterialModal(false)}
                className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 rounded text-xs"
              >
                取消
              </button>
              <button
                onClick={() => {
                  setMaterials(prev => prev.map(m => (m.id === editingMaterial.id ? editingMaterial : m)));
                  setShowEditMaterialModal(false);
                  triggerAction(`质控物《${editingMaterial.name}》修改已保存`);
                }}
                className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded text-xs font-semibold shadow-xs"
              >
                保存修改
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: 质控项目配置 (Configure Items Modal)                              */}
      {/* ========================================================================= */}
      {showConfigureItemsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-300 w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden animate-scaleIn text-xs">
            <div className="bg-slate-50 border-b border-slate-200 px-5 py-3 flex items-center justify-between shrink-0">
              <h3 className="font-bold text-sm text-slate-800">配置质控品关联检验项目</h3>
              <button
                onClick={() => setShowConfigureItemsModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-2.5 text-xs">
              <p className="text-slate-500 text-[11px]">
                勾选需要在此质控品中定期实施室内质量控制的检验项目：
              </p>
              <div className="space-y-1.5 border border-slate-200 rounded p-2.5 max-h-64 overflow-y-auto">
                {currentMaterial.items.map(it => (
                  <div key={it.code} className="flex items-center justify-between p-2 rounded hover:bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked className="rounded border-slate-300 text-sky-600 focus:ring-0" />
                      <span className="font-bold font-mono text-slate-800">{it.code}</span>
                      <span className="text-slate-700">{it.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-400">{it.valueType}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex items-center justify-end gap-2 shrink-0">
              <button
                onClick={() => setShowConfigureItemsModal(false)}
                className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded text-xs font-semibold"
              >
                确认并保存项目关联
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: 质控规则配置 (Configure Rules Modal)                              */}
      {/* ========================================================================= */}
      {showConfigureRulesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-300 w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden animate-scaleIn text-xs">
            <div className="bg-slate-50 border-b border-slate-200 px-5 py-3 flex items-center justify-between shrink-0">
              <h3 className="font-bold text-sm text-slate-800">Westgard质控多规则启用设置</h3>
              <button
                onClick={() => setShowConfigureRulesModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-2 text-xs">
              <p className="text-slate-500 text-[11px] mb-2">
                为当前检验项目 ({currentItem.name}) 激活或禁用 Westgard 智能质量报警规则：
              </p>
              {currentMaterial.rules.map(rule => (
                <div
                  key={rule.id}
                  onClick={() => handleToggleRule(rule.id)}
                  className="flex items-start gap-2.5 p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={rule.enabled}
                    onChange={() => handleToggleRule(rule.id)}
                    className="rounded border-slate-300 text-sky-600 focus:ring-0 mt-0.5"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 font-mono text-xs">{rule.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">({rule.type})</span>
                      <span
                        className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                          rule.qcType === '警告' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {rule.qcType}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-snug">{rule.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex items-center justify-between shrink-0">
              <span className="text-[11px] text-slate-500">审定医师: 蔡文斌</span>
              <button
                onClick={() => {
                  setShowConfigureRulesModal(false);
                  triggerAction(`Westgard质控判定规则已保存更新`);
                }}
                className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded text-xs font-semibold"
              >
                保存规则配置
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 6: 新增水平 (Add Level Modal)                                        */}
      {/* ========================================================================= */}
      {showAddLevelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-300 w-full max-w-sm max-h-[90vh] flex flex-col overflow-hidden animate-scaleIn text-xs">
            <div className="bg-slate-50 border-b border-slate-200 px-5 py-3 flex items-center justify-between shrink-0">
              <h3 className="font-bold text-sm text-slate-800">添加质控物浓度水平</h3>
              <button
                onClick={() => setShowAddLevelModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-3 text-xs">
              <div>
                <label className="text-slate-600 block mb-1 font-medium">水平级别 (1/2/3):</label>
                <input
                  type="number"
                  value={newLevelForm.level}
                  onChange={e => setNewLevelForm({ ...newLevelForm, level: Number(e.target.value) })}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs font-mono font-bold"
                />
              </div>

              <div>
                <label className="text-slate-600 block mb-1 font-medium">批号 LOT:</label>
                <input
                  type="text"
                  value={newLevelForm.lotNo}
                  onChange={e => setNewLevelForm({ ...newLevelForm, lotNo: e.target.value })}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs font-mono"
                />
              </div>

              <div>
                <label className="text-slate-600 block mb-1 font-medium">有效期:</label>
                <input
                  type="date"
                  value={newLevelForm.expiryDate}
                  onChange={e => setNewLevelForm({ ...newLevelForm, expiryDate: e.target.value })}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs font-mono"
                />
              </div>

              <div>
                <label className="text-slate-600 block mb-1 font-medium">样本号:</label>
                <input
                  type="text"
                  value={newLevelForm.sampleNo}
                  onChange={e => setNewLevelForm({ ...newLevelForm, sampleNo: e.target.value })}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs font-mono"
                />
              </div>
            </div>

            <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex items-center justify-end gap-2 shrink-0">
              <button
                onClick={() => setShowAddLevelModal(false)}
                className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 rounded text-xs"
              >
                取消
              </button>
              <button
                onClick={() => {
                  const newLvl: QcLevelItem = {
                    id: `lvl-${Date.now()}`,
                    level: newLevelForm.level,
                    lotNo: newLevelForm.lotNo,
                    expiryDate: newLevelForm.expiryDate,
                    sampleNo: newLevelForm.sampleNo,
                    status: '在用',
                    operator: newLevelForm.operator,
                  };
                  setMaterials(prev =>
                    prev.map(m =>
                      m.id === currentMaterial.id
                        ? { ...m, levels: [...m.levels, newLvl], levelCount: m.levels.length + 1 }
                        : m
                    )
                  );
                  setShowAddLevelModal(false);
                  triggerAction(`已为《${currentMaterial.name}》添加水平 ${newLevelForm.level}`);
                }}
                className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded text-xs font-semibold"
              >
                确认添加
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
