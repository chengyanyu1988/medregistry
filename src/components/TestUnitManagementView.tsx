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
  UserCheck,
  Cpu,
  Save,
  Network
} from './MenuIcon';
import { UserProfile } from '../types/navigation';
import {
  TestUnitItem,
  UnitApplyOrder,
  UnitLinkedItem,
  AuthorizedTech,
  INITIAL_TEST_UNITS,
} from '../data/testUnitManagementData';

interface TestUnitManagementViewProps {
  user: UserProfile;
  triggerAction: (msg: string) => void;
}

export const TestUnitManagementView: React.FC<TestUnitManagementViewProps> = ({
  user,
  triggerAction,
}) => {
  // Top Filter States (Matching screenshot: 单位名称, 业务小组, 单元名称, [显示停用])
  const [selectedHospitalUnit, setSelectedHospitalUnit] = useState<string>('中心医院');
  const [filterGroup, setFilterGroup] = useState<string>('all');
  const [filterKeyword, setFilterKeyword] = useState<string>('');
  const [showDisabledOnly, setShowDisabledOnly] = useState<boolean>(false);

  // Master Test Units dataset
  const [testUnits, setTestUnits] = useState<TestUnitItem[]>(INITIAL_TEST_UNITS);

  // Pagination states (Requirement: 一页帮我显示10条数据)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Pop-up Configuration Modal Dialog State (Requirement: 点击左侧列表弹窗展示右侧配置详情)
  const [detailModalUnit, setDetailModalUnit] = useState<TestUnitItem | null>(null);
  const [activeModalTab, setActiveModalTab] = useState<'applyOrders' | 'techs'>('applyOrders');
  const [selectedOrderInModal, setSelectedOrderInModal] = useState<UnitApplyOrder | null>(null);

  // Add / Edit Test Unit Modal States
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [editingUnitItem, setEditingUnitItem] = useState<TestUnitItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<TestUnitItem | null>(null);

  // Add Authorized Tech Modal
  const [showAddTechModal, setShowAddTechModal] = useState<boolean>(false);
  const [newTechForm, setNewTechForm] = useState({
    staffId: '',
    name: '',
    title: '检验师',
    phone: '',
    shift: '白班 (08:00-16:00)',
  });

  // Blank Form State for New Test Unit (Data cleared on Add)
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    group: '临检' as '临检' | '生化' | '免疫' | '凝血' | '微生物',
    instrumentName: '',
    status: '在用' as '在用' | '停用',
    notes: '',
  });

  // Filtered dataset
  const filteredUnits = useMemo(() => {
    return testUnits.filter((item) => {
      // 1. Group Filter
      if (filterGroup !== 'all' && item.group !== filterGroup) {
        return false;
      }
      // 2. Keyword Search (Code, Name, Instrument)
      if (filterKeyword.trim()) {
        const kw = filterKeyword.trim().toLowerCase();
        const matchCode = item.code.toLowerCase().includes(kw);
        const matchName = item.name.toLowerCase().includes(kw);
        const matchInst = item.instrumentName.toLowerCase().includes(kw);
        if (!matchCode && !matchName && !matchInst) {
          return false;
        }
      }
      // 3. Show Disabled
      if (showDisabledOnly && item.status !== '停用') {
        return false;
      }

      return true;
    });
  }, [testUnits, filterGroup, filterKeyword, showDisabledOnly]);

  // Pagination calculation
  const totalItems = filteredUnits.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const paginatedUnits = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredUnits.slice(startIndex, startIndex + pageSize);
  }, [filteredUnits, currentPage, pageSize]);

  // Query handler
  const handleQuery = () => {
    setCurrentPage(1);
    triggerAction('已完成检验单元检索');
  };

  // Reset Filters
  const handleResetFilters = () => {
    setFilterGroup('all');
    setFilterKeyword('');
    setShowDisabledOnly(false);
    setCurrentPage(1);
    triggerAction('已重置查询条件');
  };

  // Open Pop-up Configuration Modal Dialog
  const handleOpenDetailModal = (unit: TestUnitItem) => {
    setDetailModalUnit(unit);
    setActiveModalTab('applyOrders');
    setSelectedOrderInModal(unit.applyOrders[0] || null);
  };

  // Open Add Unit Modal (Data cleared)
  const handleOpenAddModal = () => {
    setEditingUnitItem(null);

    // Auto generate next code
    const existingCodes = testUnits
      .map((u) => parseInt(u.code, 10))
      .filter((n) => !isNaN(n));
    const nextCode = existingCodes.length > 0 ? String(Math.max(...existingCodes) + 1) : '1011';

    setFormData({
      code: nextCode,
      name: '',
      group: '生化',
      instrumentName: '',
      status: '在用',
      notes: '',
    });
    setShowAddModal(true);
  };

  // Open Edit Unit Modal
  const handleOpenEditModal = (unit: TestUnitItem) => {
    setEditingUnitItem(unit);
    setFormData({
      code: unit.code,
      name: unit.name,
      group: unit.group,
      instrumentName: unit.instrumentName,
      status: unit.status,
      notes: unit.notes || '',
    });
    setShowAddModal(true);
  };

  // Save Add/Edit Test Unit
  const handleSaveUnitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code.trim()) {
      triggerAction('请输入单元编号');
      return;
    }
    if (!formData.name.trim()) {
      triggerAction('请输入检验单元名称');
      return;
    }

    const nowTime = '2026-10-29 10:40:00';
    const operatorName = user.name || '张珊';

    if (editingUnitItem) {
      // Edit
      setTestUnits((prev) =>
        prev.map((u) =>
          u.id === editingUnitItem.id
            ? {
                ...u,
                code: formData.code.trim(),
                name: formData.name.trim(),
                group: formData.group,
                instrumentName: formData.instrumentName.trim(),
                status: formData.status,
                notes: formData.notes.trim(),
                updateTime: nowTime,
                operator: operatorName,
              }
            : u
        )
      );
      triggerAction(`已更新检验单元 [${formData.code}] ${formData.name}`);
    } else {
      // Add
      const newUnit: TestUnitItem = {
        id: `tu-${Date.now()}`,
        code: formData.code.trim(),
        name: formData.name.trim(),
        group: formData.group,
        instrumentName: formData.instrumentName.trim() || '未设定联机分析仪',
        status: formData.status,
        updateTime: nowTime,
        operator: operatorName,
        notes: formData.notes.trim(),
        applyOrders: [],
        authorizedTechs: [
          {
            id: `at-${Date.now()}`,
            staffId: 'T001',
            name: operatorName,
            title: user.role || '主管检验师',
            phone: '13800138001',
            shift: '白班 (08:00-16:00)',
            isAuthorized: true,
          },
        ],
      };
      setTestUnits((prev) => [newUnit, ...prev]);
      triggerAction(`已成功新增检验单元 [${newUnit.code}] ${newUnit.name}`);
    }

    setShowAddModal(false);
  };

  // Toggle Unit Status (在用 / 停用)
  const handleToggleStatus = (unit: TestUnitItem) => {
    const nextStatus = unit.status === '在用' ? '停用' : '在用';
    const nowTime = '2026-10-29 10:45:00';
    const operatorName = user.name || '张珊';

    setTestUnits((prev) =>
      prev.map((u) =>
        u.id === unit.id
          ? {
              ...u,
              status: nextStatus,
              updateTime: nowTime,
              operator: operatorName,
            }
          : u
      )
    );

    if (detailModalUnit && detailModalUnit.id === unit.id) {
      setDetailModalUnit((prev) =>
        prev
          ? {
              ...prev,
              status: nextStatus,
              updateTime: nowTime,
              operator: operatorName,
            }
          : null
      );
    }

    triggerAction(`检验单元 [${unit.name}] 状态切换为【${nextStatus}】`);
  };

  // Confirm Delete Unit
  const handleConfirmDelete = () => {
    if (!itemToDelete) return;
    setTestUnits((prev) => prev.filter((u) => u.id !== itemToDelete.id));
    if (detailModalUnit && detailModalUnit.id === itemToDelete.id) {
      setDetailModalUnit(null);
    }
    triggerAction(`已删除检验单元 [${itemToDelete.name}]`);
    setItemToDelete(null);
  };

  // Add Authorized Tech inside modal
  const handleAddTechSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!detailModalUnit) return;
    if (!newTechForm.name.trim()) {
      triggerAction('请输入技师姓名');
      return;
    }

    const newTech: AuthorizedTech = {
      id: `at-${Date.now()}`,
      staffId: newTechForm.staffId.trim() || `T0${detailModalUnit.authorizedTechs.length + 10}`,
      name: newTechForm.name.trim(),
      title: newTechForm.title,
      phone: newTechForm.phone.trim() || '13800000000',
      shift: newTechForm.shift,
      isAuthorized: true,
    };

    const updatedUnit: TestUnitItem = {
      ...detailModalUnit,
      authorizedTechs: [...detailModalUnit.authorizedTechs, newTech],
    };

    setDetailModalUnit(updatedUnit);
    setTestUnits((prev) => prev.map((u) => (u.id === updatedUnit.id ? updatedUnit : u)));
    setShowAddTechModal(false);
    triggerAction(`已为检验单元 [${updatedUnit.name}] 授权操作技师 ${newTech.name}`);
  };

  // Remove Authorized Tech
  const handleRemoveTech = (techId: string) => {
    if (!detailModalUnit) return;
    const updatedUnit: TestUnitItem = {
      ...detailModalUnit,
      authorizedTechs: detailModalUnit.authorizedTechs.filter((t) => t.id !== techId),
    };
    setDetailModalUnit(updatedUnit);
    setTestUnits((prev) => prev.map((u) => (u.id === updatedUnit.id ? updatedUnit : u)));
    triggerAction('已取消技师操作授权');
  };

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-slate-100 overflow-hidden text-slate-800 text-xs">
      {/* Top Search & Filter Bar (Matching screenshot image_e3168896.png) */}
      <div className="bg-white border-b border-slate-200 p-3 shrink-0 shadow-2xs space-y-2">
        <div className="flex flex-wrap items-center gap-3">
          {/* 单位名称 */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-600 font-medium whitespace-nowrap">单位名称:</span>
            <select
              value={selectedHospitalUnit}
              onChange={(e) => setSelectedHospitalUnit(e.target.value)}
              className="bg-white border border-slate-300 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-sky-500 outline-none min-w-[130px]"
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
              className="bg-white border border-slate-300 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-sky-500 outline-none min-w-[110px]"
            >
              <option value="all">全部小组</option>
              <option value="临检">临检</option>
              <option value="生化">生化</option>
              <option value="免疫">免疫</option>
              <option value="凝血">凝血</option>
              <option value="微生物">微生物</option>
            </select>
          </div>

          {/* 单元名称 */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-600 font-medium whitespace-nowrap">单元名称:</span>
            <div className="relative">
              <input
                type="text"
                value={filterKeyword}
                onChange={(e) => setFilterKeyword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleQuery()}
                placeholder="请输入单元编号 / 名称 / 仪器..."
                className="bg-white border border-slate-300 rounded px-2 py-1 text-xs w-52 focus:ring-1 focus:ring-sky-500 outline-none pr-6"
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

          {/* 查询 & 新增 buttons */}
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

      {/* Main Full-Width Table: 检验单元列表 */}
      <div className="flex-1 p-3 min-h-0 overflow-hidden flex flex-col">
        <div className="bg-white border border-slate-200 rounded-lg shadow-2xs flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-slate-100/90 border-b border-slate-200 px-4 py-2.5 flex items-center justify-between shrink-0">
            <h3 className="font-semibold text-sky-700 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-sky-600" />
              检验单元列表
            </h3>
            <span className="text-[11px] text-slate-500">
              提示：点击列表中任意检验单元或【配置/详情】，将弹窗打开包含申请项目与操作技师的联机配置。
            </span>
          </div>

          {/* Table Area */}
          <div className="flex-1 overflow-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 sticky top-0 z-10">
                  <th className="py-2.5 px-3 border-r border-slate-200 w-20">编号</th>
                  <th className="py-2.5 px-3 border-r border-slate-200">检验单元</th>
                  <th className="py-2.5 px-3 border-r border-slate-200 w-28">业务小组</th>
                  <th className="py-2.5 px-3 border-r border-slate-200">关联分析仪器设备</th>
                  <th className="py-2.5 px-3 border-r border-slate-200 text-center w-20">状态</th>
                  <th className="py-2.5 px-3 border-r border-slate-200 w-36">最近更新时间</th>
                  <th className="py-2.5 px-3 border-r border-slate-200 w-24">操作人</th>
                  <th className="py-2.5 px-3 text-center w-32">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedUnits.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      暂无检验单元记录，可点击右上角【+ 新增】按钮添加
                    </td>
                  </tr>
                ) : (
                  paginatedUnits.map((unit) => (
                    <tr
                      key={unit.id}
                      onClick={() => handleOpenDetailModal(unit)}
                      className={`hover:bg-sky-50/60 transition-colors cursor-pointer ${
                        unit.status === '停用' ? 'bg-slate-50/50 text-slate-400' : ''
                      }`}
                    >
                      <td className="py-2.5 px-3 border-r border-slate-100 font-mono font-semibold text-slate-800">
                        {unit.code}
                      </td>
                      <td className="py-2.5 px-3 border-r border-slate-100 font-medium text-sky-700">
                        {unit.name}
                      </td>
                      <td className="py-2.5 px-3 border-r border-slate-100 text-slate-700">
                        {unit.group}
                      </td>
                      <td className="py-2.5 px-3 border-r border-slate-100 text-slate-600 font-mono">
                        {unit.instrumentName}
                      </td>
                      <td className="py-2.5 px-3 border-r border-slate-100 text-center">
                        {unit.status === '在用' ? (
                          <span className="text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 text-[10px]">
                            在用
                          </span>
                        ) : (
                          <span className="text-rose-600 font-semibold bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200 text-[10px]">
                            停用
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 border-r border-slate-100 text-slate-500 font-mono text-[11px]">
                        {unit.updateTime}
                      </td>
                      <td className="py-2.5 px-3 border-r border-slate-100 text-slate-600">
                        {unit.operator}
                      </td>
                      <td
                        className="py-2.5 px-3 text-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleOpenDetailModal(unit)}
                            className="text-sky-600 hover:text-sky-800 hover:underline font-medium"
                          >
                            编辑/配置
                          </button>
                          <span className="text-slate-300">|</span>
                          <button
                            onClick={() => handleToggleStatus(unit)}
                            className={`font-medium ${
                              unit.status === '在用'
                                ? 'text-amber-600 hover:text-amber-800'
                                : 'text-emerald-600 hover:text-emerald-800'
                            }`}
                          >
                            {unit.status === '在用' ? '停用' : '启用'}
                          </button>
                          <span className="text-slate-300">|</span>
                          <button
                            onClick={() => setItemToDelete(unit)}
                            className="text-rose-600 hover:text-rose-800 hover:underline font-medium"
                          >
                            删除
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer (Requirement: 一页帮我显示10条数据) */}
          <div className="bg-slate-50 border-t border-slate-200 px-4 py-2.5 flex items-center justify-between shrink-0">
            <span className="text-sky-700 font-semibold">合计: {totalItems} 条</span>

            <div className="flex items-center gap-2">
              <span className="text-slate-500 text-[11px]">
                第 {currentPage} / {totalPages} 页
              </span>
              <div className="flex items-center gap-1">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-2.5 py-1 bg-white border border-slate-300 rounded text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 flex items-center gap-1"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  上一页
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p)}
                    className={`w-7 h-7 rounded font-medium border text-xs ${
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
                  className="px-2.5 py-1 bg-white border border-slate-300 rounded text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 flex items-center gap-1"
                >
                  下一页
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* POP-UP MODAL DIALOG for Unit Configuration (Requirement: 点击左侧列表，弹窗展示配置详情) */}
      {/* ========================================================= */}
      {detailModalUnit && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Title Bar */}
            <div className="bg-slate-800 text-white px-5 py-3.5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <Sliders className="w-5 h-5 text-sky-400" />
                <div>
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                    <span>检验单元配置详情</span>
                    <span className="text-sky-300 font-mono">[{detailModalUnit.code}]</span>
                    <span>{detailModalUnit.name}</span>
                  </h3>
                  <p className="text-[11px] text-slate-300">
                    业务小组: {detailModalUnit.group} | 关联设备: {detailModalUnit.instrumentName}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => triggerAction(`已完成 [${detailModalUnit.name}] 与 HIS/LIS 三方系统接口对照`)}
                  className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white border border-slate-500 rounded text-xs transition-colors flex items-center gap-1"
                >
                  <Network className="w-3.5 h-3.5" />
                  对照
                </button>
                <button
                  onClick={() => triggerAction(`已保存 [${detailModalUnit.name}] 的全部配置`)}
                  className="px-3.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold transition-colors flex items-center gap-1 shadow-2xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  保存
                </button>
                <button
                  onClick={() => setDetailModalUnit(null)}
                  className="text-slate-400 hover:text-white transition-colors p-1 rounded hover:bg-slate-700 ml-2"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Navigation Tabs (申请项目 | 操作技师 matching screenshot image_e3168896.png) */}
            <div className="bg-slate-100 border-b border-slate-200 px-5 flex items-center gap-1 shrink-0">
              <button
                onClick={() => setActiveModalTab('applyOrders')}
                className={`px-4 py-2.5 font-medium border-b-2 text-xs transition-colors ${
                  activeModalTab === 'applyOrders'
                    ? 'border-sky-600 text-sky-700 bg-white font-semibold'
                    : 'border-transparent text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                申请项目 ({detailModalUnit.applyOrders.length})
              </button>
              <button
                onClick={() => setActiveModalTab('techs')}
                className={`px-4 py-2.5 font-medium border-b-2 text-xs transition-colors ${
                  activeModalTab === 'techs'
                    ? 'border-sky-600 text-sky-700 bg-white font-semibold'
                    : 'border-transparent text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                操作技师 ({detailModalUnit.authorizedTechs.length})
              </button>
            </div>

            {/* Modal Body Content */}
            <div className="flex-1 p-4 overflow-hidden bg-slate-50 flex flex-col">
              {/* TAB 1: 申请项目 (Subpanel 1: 申请列表 + Subpanel 2: 项目列表) */}
              {activeModalTab === 'applyOrders' && (
                <div className="flex-1 flex gap-3 min-h-0 overflow-hidden">
                  {/* Left Subpanel inside modal: 申请列表 */}
                  <div className="w-64 bg-white border border-slate-200 rounded-lg shadow-2xs flex flex-col overflow-hidden shrink-0">
                    <div className="bg-slate-100/90 border-b border-slate-200 px-3 py-2 font-semibold text-slate-800 text-xs">
                      申请列表
                    </div>
                    <div className="flex-1 overflow-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-slate-50 text-slate-600 border-b border-slate-200">
                            <th className="py-2 px-2.5 border-r border-slate-200 w-20">申请编码</th>
                            <th className="py-2 px-2.5">申请名称</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {detailModalUnit.applyOrders.length === 0 ? (
                            <tr>
                              <td colSpan={2} className="py-8 text-center text-slate-400">
                                暂无关联申请
                              </td>
                            </tr>
                          ) : (
                            detailModalUnit.applyOrders.map((order) => {
                              const isSelected = selectedOrderInModal?.id === order.id;
                              return (
                                <tr
                                  key={order.id}
                                  onClick={() => setSelectedOrderInModal(order)}
                                  className={`hover:bg-sky-50/60 transition-colors cursor-pointer ${
                                    isSelected
                                      ? 'bg-sky-100/80 border-l-4 border-l-sky-600 font-semibold'
                                      : ''
                                  }`}
                                >
                                  <td className="py-2 px-2.5 border-r border-slate-100 font-mono text-slate-700">
                                    {order.applyCode}
                                  </td>
                                  <td className="py-2 px-2.5 text-sky-700">{order.applyName}</td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Right Subpanel inside modal: 项目列表 (Matching screenshot: 钙, GA, 2, mmhg, 化学发光) */}
                  <div className="flex-1 bg-white border border-slate-200 rounded-lg shadow-2xs flex flex-col overflow-hidden">
                    <div className="bg-slate-100/90 border-b border-slate-200 px-3 py-2 font-semibold text-slate-800 text-xs flex justify-between items-center">
                      <span>
                        项目列表{' '}
                        {selectedOrderInModal && (
                          <span className="text-sky-700 font-mono font-normal">
                            - [{selectedOrderInModal.applyCode}] {selectedOrderInModal.applyName}
                          </span>
                        )}
                      </span>
                      <span className="text-[11px] text-slate-400 font-normal">
                        包含 {selectedOrderInModal?.items.length || 0} 个细分检验指标
                      </span>
                    </div>

                    <div className="flex-1 overflow-auto">
                      {!selectedOrderInModal ? (
                        <div className="p-8 text-center text-slate-400">
                          请在左侧选择申请项目
                        </div>
                      ) : (
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 sticky top-0">
                              <th className="py-2 px-3 border-r border-slate-200">项目名称</th>
                              <th className="py-2 px-3 border-r border-slate-200">英文名</th>
                              <th className="py-2 px-3 border-r border-slate-200 text-center w-20">小数位数</th>
                              <th className="py-2 px-3 border-r border-slate-200">单位</th>
                              <th className="py-2 px-3">检测方法</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {selectedOrderInModal.items.length === 0 ? (
                              <tr>
                                <td colSpan={5} className="py-8 text-center text-slate-400">
                                  暂无细分指标数据
                                </td>
                              </tr>
                            ) : (
                              selectedOrderInModal.items.map((item, idx) => (
                                <tr key={idx} className="hover:bg-slate-50">
                                  <td className="py-2 px-3 border-r border-slate-100 font-medium text-slate-800">
                                    {item.itemName}
                                  </td>
                                  <td className="py-2 px-3 border-r border-slate-100 font-mono text-slate-600">
                                    {item.englishName || '-'}
                                  </td>
                                  <td className="py-2 px-3 border-r border-slate-100 font-mono text-center">
                                    {item.decimalPlaces}
                                  </td>
                                  <td className="py-2 px-3 border-r border-slate-100 font-mono text-slate-600">
                                    {item.unit || '-'}
                                  </td>
                                  <td className="py-2 px-3 text-slate-700">{item.testMethod}</td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: 操作技师 */}
              {activeModalTab === 'techs' && (
                <div className="flex-1 bg-white border border-slate-200 rounded-lg p-4 shadow-2xs flex flex-col space-y-3 overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-slate-800 flex items-center gap-1.5">
                        <UserCheck className="w-4 h-4 text-sky-600" />
                        检验单元授权操作技师名录
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        仅具备授权资格的检验技师可在本检验单元上机测定与审核发布报告。
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setNewTechForm({
                          staffId: '',
                          name: '',
                          title: '检验师',
                          phone: '',
                          shift: '白班 (08:00-16:00)',
                        });
                        setShowAddTechModal(true);
                      }}
                      className="px-3.5 py-1 bg-sky-600 hover:bg-sky-700 text-white rounded text-xs font-medium shadow-2xs transition-colors flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      授权新技师
                    </button>
                  </div>

                  <div className="border border-slate-200 rounded overflow-hidden flex-1">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 font-semibold">
                          <th className="py-2 px-3 border-r border-slate-200 font-mono">工号</th>
                          <th className="py-2 px-3 border-r border-slate-200">技师姓名</th>
                          <th className="py-2 px-3 border-r border-slate-200">职称</th>
                          <th className="py-2 px-3 border-r border-slate-200 font-mono">联系电话</th>
                          <th className="py-2 px-3 border-r border-slate-200">排班班次</th>
                          <th className="py-2 px-3 border-r border-slate-200 text-center">授权状态</th>
                          <th className="py-2 px-3 text-center w-20">操作</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {detailModalUnit.authorizedTechs.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="py-8 text-center text-slate-400">
                              暂无授权技师，点击【授权新技师】添加
                            </td>
                          </tr>
                        ) : (
                          detailModalUnit.authorizedTechs.map((tech) => (
                            <tr key={tech.id} className="hover:bg-slate-50">
                              <td className="py-2 px-3 border-r border-slate-100 font-mono text-slate-700">
                                {tech.staffId}
                              </td>
                              <td className="py-2 px-3 border-r border-slate-100 font-medium text-slate-900">
                                {tech.name}
                              </td>
                              <td className="py-2 px-3 border-r border-slate-100 text-slate-600">
                                {tech.title}
                              </td>
                              <td className="py-2 px-3 border-r border-slate-100 font-mono text-slate-600">
                                {tech.phone}
                              </td>
                              <td className="py-2 px-3 border-r border-slate-100 text-slate-600">
                                {tech.shift}
                              </td>
                              <td className="py-2 px-3 border-r border-slate-100 text-center">
                                <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[10px] font-semibold">
                                  已授权
                                </span>
                              </td>
                              <td className="py-2 px-3 text-center">
                                <button
                                  onClick={() => handleRemoveTech(tech.id)}
                                  className="text-rose-600 hover:text-rose-800 hover:underline"
                                >
                                  取消授权
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer Bar */}
            <div className="bg-slate-100 border-t border-slate-200 px-5 py-3 flex items-center justify-between shrink-0">
              <span className="text-[11px] text-slate-500">
                按 ESC 键或点击右上角 [关闭] 按钮完成退出。
              </span>
              <button
                onClick={() => setDetailModalUnit(null)}
                className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded font-medium transition-colors"
              >
                完成退出
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* Modal: Add / Edit Test Unit (Data cleared on Add) */}
      {/* ========================================================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-sky-700 text-white px-5 py-3.5 flex items-center justify-between shrink-0">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <Plus className="w-4 h-4" />
                {editingUnitItem ? '编辑检验单元' : '新增检验单元'}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-white/80 hover:text-white transition-colors p-1 rounded hover:bg-sky-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUnitForm} className="p-5 space-y-4">
              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  <span className="text-rose-500">*</span> 单元编号
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
                  placeholder="例如: 1011"
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs font-mono focus:ring-1 focus:ring-sky-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  <span className="text-rose-500">*</span> 检验单元名称
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  placeholder="例如: 免疫全自动分析单元"
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-sky-500 outline-none"
                />
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
                  <option value="临检">临检</option>
                  <option value="生化">生化</option>
                  <option value="免疫">免疫</option>
                  <option value="凝血">凝血</option>
                  <option value="微生物">微生物</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">关联仪器设备</label>
                <input
                  type="text"
                  value={formData.instrumentName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      instrumentName: e.target.value,
                    }))
                  }
                  placeholder="例如: 罗氏 Cobas e801 全自动发光仪"
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-sky-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">状态</label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      status: e.target.value as any,
                    }))
                  }
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-sky-500 outline-none"
                >
                  <option value="在用">在用</option>
                  <option value="停用">停用</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">备注说明</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      notes: e.target.value,
                    }))
                  }
                  placeholder="填写检验单元安装工位与备注信息..."
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-sky-500 outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded font-medium shadow-2xs transition-colors flex items-center gap-1"
                >
                  <Check className="w-4 h-4" />
                  保存单元
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* Modal: Add Authorized Tech */}
      {/* ========================================================= */}
      {showAddTechModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-sky-700 text-white px-5 py-3.5 flex items-center justify-between shrink-0">
              <h3 className="font-semibold text-sm">授权操作技师</h3>
              <button
                onClick={() => setShowAddTechModal(false)}
                className="text-white/80 hover:text-white transition-colors p-1 rounded hover:bg-sky-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddTechSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-slate-700 font-medium mb-1">技师工号</label>
                <input
                  type="text"
                  value={newTechForm.staffId}
                  onChange={(e) =>
                    setNewTechForm((prev) => ({
                      ...prev,
                      staffId: e.target.value,
                    }))
                  }
                  placeholder="例如: T009"
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs font-mono focus:ring-1 focus:ring-sky-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  <span className="text-rose-500">*</span> 技师姓名
                </label>
                <input
                  type="text"
                  required
                  value={newTechForm.name}
                  onChange={(e) =>
                    setNewTechForm((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  placeholder="例如: 黄雅芳"
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-sky-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">职称</label>
                <select
                  value={newTechForm.title}
                  onChange={(e) =>
                    setNewTechForm((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-sky-500 outline-none"
                >
                  <option value="检验师">检验师</option>
                  <option value="主管检验师">主管检验师</option>
                  <option value="副主任检验师">副主任检验师</option>
                  <option value="主任检验师">主任检验师</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">联系电话</label>
                <input
                  type="text"
                  value={newTechForm.phone}
                  onChange={(e) =>
                    setNewTechForm((prev) => ({
                      ...prev,
                      phone: e.target.value,
                    }))
                  }
                  placeholder="例如: 13800138009"
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs font-mono focus:ring-1 focus:ring-sky-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">排班班次</label>
                <input
                  type="text"
                  value={newTechForm.shift}
                  onChange={(e) =>
                    setNewTechForm((prev) => ({
                      ...prev,
                      shift: e.target.value,
                    }))
                  }
                  placeholder="例如: 白班 (08:00-16:00)"
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-sky-500 outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddTechModal(false)}
                  className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded font-medium shadow-2xs transition-colors"
                >
                  确认授权
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-200 w-full max-w-sm overflow-hidden p-5 animate-in fade-in zoom-in-95 duration-150 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="font-semibold text-sm">确认删除检验单元?</h3>
            </div>
            <p className="text-xs text-slate-600">
              您确定要删除检验单元 <strong className="text-slate-800">[{itemToDelete.code}] {itemToDelete.name}</strong> 吗？删除后此单元与仪器的联机和关联申请将被清除。
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
