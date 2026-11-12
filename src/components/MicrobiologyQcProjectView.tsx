import React, { useState, useMemo } from 'react';
import {
  QcMainType,
  QcValueOption,
  QcProjectItem,
  QC_CATEGORY_MAPPINGS,
  INITIAL_QC_PROJECTS,
} from '../data/microbiologyQcProjectData';
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
  ShieldCheck,
  Layers,
  ChevronLeft,
  ChevronRight,
  FlaskConical,
  Activity,
  Check,
} from './MenuIcon';

interface MicrobiologyQcProjectViewProps {
  user?: UserProfile;
  triggerAction: (msg: string) => void;
}

export const MicrobiologyQcProjectView: React.FC<MicrobiologyQcProjectViewProps> = ({
  user,
  triggerAction,
}) => {
  // 1. Top bar: 单位名称
  const [selectedHospitalUnit, setSelectedHospitalUnit] = useState<string>('中心医院');

  // 2. Left column: 质控类型 ('试剂仪器质控' | '鉴定药敏质控')
  // Requirement: "点击左侧知识类型，右侧要跟着变化"
  const [activeQcType, setActiveQcType] = useState<QcMainType>('试剂仪器质控');

  // 3. Middle-left column: 质控对象类别 (e.g., 培养基, 染色剂, etc.)
  const [selectedCategory, setSelectedCategory] = useState<string>('培养基');

  // Main Projects Dataset
  const [projects, setProjects] = useState<QcProjectItem[]>(INITIAL_QC_PROJECTS);

  // Selected Project for details and editing
  const [selectedProjectId, setSelectedProjectId] = useState<string>('qcp-10'); // default: 菌落情况
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);

  // Bottom-Left Form: 项目编辑
  const [formProjectName, setFormProjectName] = useState<string>('菌落情况');
  const [formValueType, setFormValueType] = useState<QcProjectItem['valueType']>('固定值');
  const [formProjectDesc, setFormProjectDesc] = useState<string>('有无细菌描述');

  // Bottom-Right Form: 项目固定值编辑
  const [formValueOptions, setFormValueOptions] = useState<QcValueOption[]>([
    { id: 'v-temp-1', itemValue: '无细菌生长', controlResult: '在控', isDefault: true },
    { id: 'v-temp-2', itemValue: '有细菌生长', controlResult: '失控', isDefault: false },
    { id: 'v-temp-3', itemValue: '生长不良', controlResult: '失控', isDefault: false },
  ]);

  // Search keyword for projects
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showNotice = (msg: string) => {
    setToastMessage(msg);
    triggerAction(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Categories under active QC type
  const availableCategories = useMemo(() => {
    return QC_CATEGORY_MAPPINGS[activeQcType] || [];
  }, [activeQcType]);

  // Switch QC Main Type
  const handleSelectQcType = (type: QcMainType) => {
    setActiveQcType(type);
    const newCats = QC_CATEGORY_MAPPINGS[type];
    const defaultCat = newCats[0] || '';
    setSelectedCategory(defaultCat);

    // Pick first project under new category
    const matching = projects.filter((p) => p.qcType === type && p.category === defaultCat);
    if (matching.length > 0) {
      handleSelectProject(matching[0]);
    } else {
      setSelectedProjectId('');
      setFormProjectName('');
      setFormProjectDesc('');
      setFormValueOptions([]);
    }
    showNotice(`已切换质控类型至【${type}】`);
  };

  // Switch Object Category
  const handleSelectCategory = (cat: string) => {
    setSelectedCategory(cat);
    const matching = projects.filter((p) => p.qcType === activeQcType && p.category === cat);
    if (matching.length > 0) {
      handleSelectProject(matching[0]);
    } else {
      setSelectedProjectId('');
      setFormProjectName('');
      setFormProjectDesc('');
      setFormValueOptions([]);
    }
    showNotice(`已切换质控对象类别至【${cat}】`);
  };

  // Filtered projects
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      if (p.qcType !== activeQcType) return false;
      if (p.category !== selectedCategory) return false;
      if (searchKeyword.trim()) {
        const q = searchKeyword.trim().toLowerCase();
        return (
          p.projectName.toLowerCase().includes(q) ||
          p.projectDescription.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [projects, activeQcType, selectedCategory, searchKeyword]);

  // Active Project
  const activeProject = useMemo(() => {
    return (
      projects.find((p) => p.id === selectedProjectId) ||
      filteredProjects[0] ||
      null
    );
  }, [projects, selectedProjectId, filteredProjects]);

  // Select project row
  const handleSelectProject = (project: QcProjectItem) => {
    setSelectedProjectId(project.id);
    setEditingProjectId(null);
    setFormProjectName(project.projectName);
    setFormValueType(project.valueType);
    setFormProjectDesc(project.projectDescription);
    setFormValueOptions(project.valueOptions ? [...project.valueOptions] : []);
  };

  // Toggle project status switch
  const handleToggleProjectStatus = (id: string) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isEnabled: !p.isEnabled } : p))
    );
    showNotice('质控项目状态已更新');
  };

  // Load project into edit
  const handleEditProject = (item: QcProjectItem) => {
    setSelectedProjectId(item.id);
    setEditingProjectId(item.id);
    setFormProjectName(item.projectName);
    setFormValueType(item.valueType);
    setFormProjectDesc(item.projectDescription);
    setFormValueOptions(item.valueOptions ? [...item.valueOptions] : []);
    showNotice(`已载入项目【${item.projectName}】进行编辑`);
  };

  // Delete project
  const handleDeleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    showNotice('质控项目已删除');
  };

  // Reset form
  const handleResetForm = () => {
    setEditingProjectId(null);
    setFormProjectName('');
    setFormValueType('固定值');
    setFormProjectDesc('');
    setFormValueOptions([
      { id: `vo-${Date.now()}-1`, itemValue: '正常在控', controlResult: '在控', isDefault: true },
      { id: `vo-${Date.now()}-2`, itemValue: '异常失控', controlResult: '失控', isDefault: false },
    ]);
  };

  // Add a value option in bottom-right form
  const handleAddValueOption = () => {
    const newOption: QcValueOption = {
      id: `vo-${Date.now()}`,
      itemValue: '',
      controlResult: '失控',
      isDefault: false,
    };
    setFormValueOptions((prev) => [...prev, newOption]);
  };

  // Update a value option
  const handleUpdateValueOption = (
    id: string,
    field: keyof QcValueOption,
    val: any
  ) => {
    setFormValueOptions((prev) =>
      prev.map((opt) => {
        if (opt.id === id) {
          if (field === 'isDefault') {
            return { ...opt, isDefault: val };
          }
          return { ...opt, [field]: val };
        }
        if (field === 'isDefault' && val === true) {
          // If setting one as default, uncheck others
          return { ...opt, isDefault: false };
        }
        return opt;
      })
    );
  };

  // Remove value option
  const handleRemoveValueOption = (id: string) => {
    setFormValueOptions((prev) => prev.filter((opt) => opt.id !== id));
  };

  // Save Project & Values
  const handleSaveProject = () => {
    if (!formProjectName.trim()) {
      showNotice('请填写质控项目名称！');
      return;
    }
    const operator = user?.name ? `${user.name}主管检验师` : '李晓红主管检验师';
    const currentTime = '2026-10-30 11:35:00';

    if (editingProjectId) {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === editingProjectId
            ? {
                ...p,
                projectName: formProjectName.trim(),
                valueType: formValueType,
                projectDescription: formProjectDesc.trim(),
                valueOptions: formValueOptions,
                operator,
                operateTime: currentTime,
              }
            : p
        )
      );
      showNotice(`质控项目【${formProjectName}】更新成功！`);
    } else {
      const newProj: QcProjectItem = {
        id: `qcp-${Date.now()}`,
        qcType: activeQcType,
        category: selectedCategory,
        projectName: formProjectName.trim(),
        valueType: formValueType,
        projectDescription: formProjectDesc.trim(),
        isEnabled: true,
        operator,
        operateTime: currentTime,
        valueOptions: formValueOptions,
      };
      setProjects((prev) => [newProj, ...prev]);
      setSelectedProjectId(newProj.id);
      showNotice(`新建质控项目【${formProjectName}】保存成功！`);
    }
    setEditingProjectId(null);
  };

  return (
    <div className="flex flex-col h-full bg-slate-100 text-xs text-slate-700 select-none overflow-hidden font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 text-white px-4 py-2 rounded-lg shadow-xl text-xs flex items-center gap-2 backdrop-blur-xs border border-slate-700 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Toolbar (Matches screenshot top bar: 单位名称 [中心医院]) */}
      <div className="bg-white border-b border-slate-200 px-4 py-2.5 flex items-center justify-between shadow-2xs shrink-0">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-sky-600" />
            <span className="font-bold text-slate-800 text-sm">微生物质控项目管理</span>
            <span className="px-2 py-0.5 rounded text-[11px] bg-sky-50 text-sky-700 border border-sky-200 font-medium">
              ISO 15189 准则
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
              <option value="东城第一分院">东城第一分院 (综合质控组)</option>
              <option value="滨海妇女儿童院区">滨海妇女儿童院区 (妇儿质控中心)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-4 text-slate-500 text-[11px]">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            质控受控时间: <strong className="text-slate-700 font-mono">2026-10-30</strong>
          </span>
          <span className="flex items-center gap-1">
            <User className="w-3.5 h-3.5 text-slate-400" />
            质控主任: <strong className="text-slate-700">郭彩霞主任医师</strong>
          </span>
          <button
            onClick={() => showNotice('质控项目字典与阈值配置已重新加载！')}
            className="flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition font-medium"
          >
            <RefreshCw className="w-3 h-3" />
            刷新
          </button>
        </div>
      </div>

      {/* Main Workspace (4 columns layout matching screenshot: 质控类型 | 质控对象类别 | 质控项目列表 | 项目值列表) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Column 1: 质控类型 (Matches screenshot left: 试剂仪器质控 | 鉴定药敏质控) */}
        <div className="w-44 bg-white border-r border-slate-200 flex flex-col shrink-0">
          <div className="p-3 border-b border-slate-200 bg-slate-50 font-bold text-slate-800 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-sky-600" />
              质控类型
            </span>
            <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-mono">
              2 类
            </span>
          </div>

          <div className="p-2 space-y-1.5 flex-1 overflow-y-auto">
            {(['试剂仪器质控', '鉴定药敏质控'] as QcMainType[]).map((type) => {
              const isActive = activeQcType === type;
              return (
                <button
                  key={type}
                  onClick={() => handleSelectQcType(type)}
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
                    {projects.filter((p) => p.qcType === type).length}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="p-3 border-t border-slate-200 bg-slate-50 text-[11px] text-slate-500">
            <div>质控准则: <strong className="text-emerald-700 font-mono">CNAS CL02</strong></div>
            <div className="mt-0.5">机构: {selectedHospitalUnit}</div>
          </div>
        </div>

        {/* Column 2: 质控对象类别 (Matches screenshot: 培养基 | 染色剂 | 诊断试剂 | API试剂 | 高压灭菌锅) */}
        <div className="w-44 bg-white border-r border-slate-200 flex flex-col shrink-0">
          <div className="p-3 border-b border-slate-200 bg-slate-50 font-bold text-slate-800 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <FlaskConical className="w-4 h-4 text-emerald-600" />
              质控对象类别
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              {availableCategories.length} 项
            </span>
          </div>

          <div className="p-2 space-y-1 flex-1 overflow-y-auto">
            {availableCategories.map((cat) => {
              const isSelected = selectedCategory === cat;
              const count = projects.filter(
                (p) => p.qcType === activeQcType && p.category === cat
              ).length;
              return (
                <button
                  key={cat}
                  onClick={() => handleSelectCategory(cat)}
                  className={`w-full text-left px-3 py-2 rounded-lg font-medium transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-sky-100 text-sky-900 font-bold border-l-4 border-l-sky-600'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <span>{cat}</span>
                  <span className="text-[10px] font-mono text-slate-400">{count}</span>
                </button>
              );
            })}
          </div>

          <div className="p-2.5 border-t border-slate-200 bg-slate-50 text-[11px] text-slate-500">
            当前类别: <strong className="text-sky-700">{selectedCategory}</strong>
          </div>
        </div>

        {/* Column 3 & 4 Main Area: Upper (质控项目列表 + 项目值列表) + Lower (项目编辑 + 项目固定值编辑) */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white">
          {/* Upper Half: 质控项目列表 (Left) + 项目值列表 (Right) */}
          <div className="flex-1 flex overflow-hidden border-b border-slate-200">
            {/* Upper-Left: 质控项目列表 (Matches screenshot columns: 项目名称 | 值类型 | 项目说明 | 状态 | 操作) */}
            <div className="flex-1 flex flex-col border-r border-slate-200 overflow-hidden">
              <div className="p-2.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-800">质控项目列表</span>
                  <span className="text-[11px] text-slate-500">
                    ({selectedCategory}，共 {filteredProjects.length} 项)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="搜索项目名称/说明..."
                      value={searchKeyword}
                      onChange={(e) => setSearchKeyword(e.target.value)}
                      className="pl-2 pr-6 py-1 bg-white border border-slate-300 rounded text-slate-700 text-xs w-44 focus:ring-1 focus:ring-sky-500"
                    />
                    <Search className="w-3 h-3 text-slate-400 absolute right-2 top-2" />
                  </div>
                  <button
                    onClick={handleResetForm}
                    className="flex items-center gap-1 px-2.5 py-1 bg-sky-600 hover:bg-sky-700 text-white rounded font-medium shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    新建项目
                  </button>
                </div>
              </div>

              {/* Projects Table */}
              <div className="flex-1 overflow-y-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-100 text-slate-600 text-[11px] border-b border-slate-200 sticky top-0 z-10">
                    <tr>
                      <th className="py-2.5 px-3 font-semibold">项目名称</th>
                      <th className="py-2.5 px-3 font-semibold w-20">值类型</th>
                      <th className="py-2.5 px-3 font-semibold">项目说明</th>
                      <th className="py-2.5 px-3 font-semibold text-center w-20">状态</th>
                      <th className="py-2.5 px-3 font-semibold text-center w-24">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredProjects.map((item) => {
                      const isSelected = selectedProjectId === item.id;
                      return (
                        <tr
                          key={item.id}
                          onClick={() => handleSelectProject(item)}
                          className={`cursor-pointer hover:bg-slate-50 transition-colors ${
                            isSelected ? 'bg-sky-50 font-medium' : ''
                          }`}
                        >
                          <td className="py-2.5 px-3 font-bold text-slate-800">
                            {item.projectName}
                          </td>
                          <td className="py-2.5 px-3 text-slate-600">
                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 font-mono">
                              {item.valueType}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-slate-500 text-[11px]">
                            {item.projectDescription || '-'}
                          </td>
                          {/* Toggle switch (Matches Screenshot iOS Pill Switch) */}
                          <td className="py-2.5 px-3 text-center">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleProjectStatus(item.id);
                              }}
                              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                                item.isEnabled ? 'bg-sky-600' : 'bg-slate-300'
                              }`}
                              title={item.isEnabled ? '点击停用' : '点击启用'}
                            >
                              <span
                                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                                  item.isEnabled ? 'translate-x-4' : 'translate-x-0'
                                }`}
                              />
                            </button>
                          </td>
                          {/* Action links (Matches screenshot blue 编辑 / 删除) */}
                          <td className="py-2.5 px-3 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditProject(item);
                                }}
                                className="text-sky-600 hover:text-sky-800 font-medium"
                              >
                                编辑
                              </button>
                              <span className="text-slate-300">|</span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteProject(item.id);
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
                    {filteredProjects.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-slate-400">
                          暂无质控项目，请点击右上角「新建项目」
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Upper-Right: 项目值列表 (Matches screenshot: 项目值 | 对照质控结果 | 默认) */}
            <div className="w-80 flex flex-col bg-slate-50/40 overflow-hidden">
              <div className="p-2.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
                <span className="font-bold text-slate-800">项目值列表</span>
                <span className="text-[11px] text-sky-700 font-medium">
                  {activeProject ? `【${activeProject.projectName}】` : '未选择项目'}
                </span>
              </div>

              <div className="flex-1 overflow-y-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-100 text-slate-600 text-[11px] border-b border-slate-200 sticky top-0 z-10">
                    <tr>
                      <th className="py-2.5 px-3 font-semibold">项目值</th>
                      <th className="py-2.5 px-3 font-semibold text-center w-28">对照质控结果</th>
                      <th className="py-2.5 px-3 font-semibold text-center w-16">默认</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {activeProject?.valueOptions?.map((opt) => (
                      <tr key={opt.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-2.5 px-3 font-medium text-slate-800">
                          {opt.itemValue}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              opt.controlResult === '在控'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : opt.controlResult === '失控'
                                ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                : 'bg-amber-100 text-amber-800 border border-amber-200'
                            }`}
                          >
                            {opt.controlResult}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span
                            className={`font-bold text-[11px] ${
                              opt.isDefault ? 'text-sky-700' : 'text-slate-400'
                            }`}
                          >
                            {opt.isDefault ? '是' : '-'}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {(!activeProject || !activeProject.valueOptions || activeProject.valueOptions.length === 0) && (
                      <tr>
                        <td colSpan={3} className="py-10 text-center text-slate-400">
                          该项目暂无固定值列表，可于下方配置
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Lower Half: 项目编辑 (Left) + 项目固定值编辑 (Right) (Matches screenshot bottom) */}
          <div className="h-60 bg-white flex shrink-0 shadow-xs">
            {/* Lower-Left: 项目编辑 (Matches screenshot: *项目名称 | 值类型 | 项目说明 | 取消 / 保存) */}
            <div className="flex-1 p-3.5 border-r border-slate-200 flex flex-col space-y-3 overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Edit className="w-4 h-4 text-sky-600" />
                  <span>项目编辑</span>
                  {editingProjectId ? (
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-100 text-amber-800 font-bold">
                      修改中
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800 font-bold">
                      新建项目
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleResetForm}
                    className="px-4 py-1 border border-slate-300 bg-white hover:bg-slate-100 rounded text-slate-700 font-medium"
                  >
                    取消
                  </button>
                  {/* Matches Screenshot Green Save Button */}
                  <button
                    onClick={handleSaveProject}
                    className="px-5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold shadow-2xs flex items-center gap-1"
                  >
                    <Save className="w-3.5 h-3.5" />
                    保存
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  <span className="text-rose-500 mr-0.5">*</span>项目名称
                </label>
                <input
                  type="text"
                  placeholder="如: 菌落情况 / 制备日期 / 颜色"
                  value={formProjectName}
                  onChange={(e) => setFormProjectName(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">值类型</label>
                <select
                  value={formValueType}
                  onChange={(e) => setFormValueType(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500"
                >
                  <option value="固定值">固定值 (选项列表判定)</option>
                  <option value="数值型">数值型 (范围区间判断)</option>
                  <option value="文本描述">文本描述 (手工自由录入)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">项目说明</label>
                <textarea
                  rows={2}
                  placeholder="如: 有无细菌描述及出厂制备批次核验..."
                  value={formProjectDesc}
                  onChange={(e) => setFormProjectDesc(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500 text-xs"
                />
              </div>
            </div>

            {/* Lower-Right: 项目固定值编辑 (Matches screenshot: +增加值 | 项目值 | 对照质控结果 | 默认) */}
            <div className="w-96 p-3.5 flex flex-col bg-slate-50/50 overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-2">
                <span className="font-bold text-slate-800 text-xs">项目固定值编辑</span>
                <button
                  type="button"
                  onClick={handleAddValueOption}
                  className="flex items-center gap-1 text-[11px] text-sky-600 hover:text-sky-800 font-bold"
                >
                  <Plus className="w-3.5 h-3.5" />
                  +增加值
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
                <div className="grid grid-cols-12 gap-1 text-[11px] font-semibold text-slate-500 pb-1 border-b border-slate-200">
                  <div className="col-span-5">项目值</div>
                  <div className="col-span-4 text-center">对照质控结果</div>
                  <div className="col-span-2 text-center">默认</div>
                  <div className="col-span-1 text-center">删</div>
                </div>

                {formValueOptions.map((opt) => (
                  <div
                    key={opt.id}
                    className="grid grid-cols-12 gap-1.5 items-center bg-white border border-slate-200 rounded p-1.5 shadow-2xs"
                  >
                    <div className="col-span-5">
                      <input
                        type="text"
                        placeholder="如: 无细菌生长"
                        value={opt.itemValue}
                        onChange={(e) =>
                          handleUpdateValueOption(opt.id, 'itemValue', e.target.value)
                        }
                        className="w-full px-1.5 py-1 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800"
                      />
                    </div>

                    <div className="col-span-4">
                      <select
                        value={opt.controlResult}
                        onChange={(e) =>
                          handleUpdateValueOption(opt.id, 'controlResult', e.target.value as any)
                        }
                        className={`w-full px-1 py-1 rounded text-xs font-bold ${
                          opt.controlResult === '在控'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                            : opt.controlResult === '失控'
                            ? 'bg-rose-50 text-rose-800 border border-rose-300'
                            : 'bg-amber-50 text-amber-800 border border-amber-300'
                        }`}
                      >
                        <option value="在控">在控</option>
                        <option value="失控">失控</option>
                        <option value="警告">警告</option>
                      </select>
                    </div>

                    <div className="col-span-2 flex justify-center">
                      <input
                        type="checkbox"
                        checked={opt.isDefault}
                        onChange={(e) =>
                          handleUpdateValueOption(opt.id, 'isDefault', e.target.checked)
                        }
                        className="w-4 h-4 text-sky-600 rounded border-slate-300 focus:ring-sky-500 cursor-pointer"
                        title="设为默认选中值"
                      />
                    </div>

                    <div className="col-span-1 flex justify-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveValueOption(opt.id)}
                        className="text-slate-400 hover:text-rose-600 p-0.5"
                        title="删除该项"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}

                {formValueOptions.length === 0 && (
                  <div className="p-4 border border-dashed border-slate-300 rounded text-center text-slate-400 text-[11px]">
                    暂无固定值，点击右上角「+增加值」添加
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
