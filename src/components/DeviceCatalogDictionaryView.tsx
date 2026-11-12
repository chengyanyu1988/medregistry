import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Download,
  ChevronRight,
  ChevronLeft,
  RefreshCw,
  X,
  Check,
  Building2,
  Trash2,
  FolderOpen,
  FileSpreadsheet,
  Activity,
  Cpu,
  Settings,
  HardDrive
} from './MenuIcon';
import { UserProfile } from '../types/navigation';
import {
  DeviceCatalogItem,
  INITIAL_DEVICE_CATALOG,
} from '../data/deviceDictionaryData';

interface DeviceCatalogDictionaryViewProps {
  user: UserProfile;
  triggerAction: (msg: string) => void;
}

export const DeviceCatalogDictionaryView: React.FC<DeviceCatalogDictionaryViewProps> = ({
  user,
  triggerAction,
}) => {
  // Top Filter Bar States (Matching Screenshot Fields)
  const [selectedHospitalUnit, setSelectedHospitalUnit] = useState<string>('中心医院');
  const [filterDepartment, setFilterDepartment] = useState<string>('微生物组'); // Default per screenshot or 'all'
  const [filterDeviceType, setFilterDeviceType] = useState<string>('检验设备'); // Default per screenshot or 'all'
  const [filterDeviceName, setFilterDeviceName] = useState<string>('');
  const [showInactive, setShowInactive] = useState<boolean>(true); // Screenshot checkbox [ ] 显示停用

  // Master Dataset State
  const [devices, setDevices] = useState<DeviceCatalogItem[]>(INITIAL_DEVICE_CATALOG);

  // Pagination States (Requirement: "一页帮我显示10条数据")
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Modal States
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showImportModal, setShowImportModal] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<DeviceCatalogItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<DeviceCatalogItem | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    code: '',
    deviceType: '检验设备',
    name: '',
    model: '',
    manufacturer: '',
    supplier: '德州仪器',
    purchaseDate: '2025-06-18',
    department: '微生物组',
    status: '启用' as '启用' | '停用',
    ipAddress: '',
    serialNo: '',
    maintenanceCycle: '月度保养',
    notes: '',
  });

  // Query / Search Click Handler (matching screenshot [查询])
  const handleQuery = () => {
    setCurrentPage(1);
    triggerAction(`已按部门【${filterDepartment}】与分类【${filterDeviceType}】筛选设备目录`);
  };

  // Reset Filters
  const handleResetFilters = () => {
    setFilterDepartment('all');
    setFilterDeviceType('all');
    setFilterDeviceName('');
    setShowInactive(true);
    setCurrentPage(1);
    triggerAction('已清空设备目录筛选');
  };

  // Filtered Dataset
  const filteredDevices = useMemo(() => {
    return devices.filter((item) => {
      // 1. 所属部门 (matching screenshot)
      if (filterDepartment !== 'all' && item.department !== filterDepartment) {
        // allow partial match if contains
        if (!item.department.includes(filterDepartment)) return false;
      }

      // 2. 设备类型 (matching screenshot)
      if (filterDeviceType !== 'all' && item.deviceType !== filterDeviceType) {
        if (!item.deviceType.includes(filterDeviceType)) return false;
      }

      // 3. 设备名称关键词
      if (filterDeviceName.trim()) {
        const kw = filterDeviceName.trim().toLowerCase();
        const matchName = item.name.toLowerCase().includes(kw);
        const matchCode = item.code.toLowerCase().includes(kw);
        const matchModel = item.model.toLowerCase().includes(kw);
        const matchManufacturer = item.manufacturer.toLowerCase().includes(kw);
        const matchSupplier = item.supplier.toLowerCase().includes(kw);
        if (!matchName && !matchCode && !matchModel && !matchManufacturer && !matchSupplier) {
          return false;
        }
      }

      // 4. 显示停用 (If unchecked, hide '停用' items)
      if (!showInactive && item.status === '停用') {
        return false;
      }

      return true;
    });
  }, [devices, filterDepartment, filterDeviceType, filterDeviceName, showInactive]);

  // Pagination calculation
  const totalItems = filteredDevices.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  // Current page records
  const paginatedDevices = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredDevices.slice(startIndex, startIndex + pageSize);
  }, [filteredDevices, currentPage, pageSize]);

  // Toggle status (启用 <-> 停用, matching screenshot)
  const handleToggleStatus = (item: DeviceCatalogItem) => {
    const nextStatus = item.status === '启用' ? '停用' : '启用';
    const nowTime = '2026-10-29 09:45:00';
    const operatorName = user.name || '张珊';

    setDevices((prev) =>
      prev.map((d) =>
        d.id === item.id
          ? {
              ...d,
              status: nextStatus,
              updateTime: nowTime,
              operator: operatorName,
            }
          : d
      )
    );

    triggerAction(`设备 [${item.name}] 状态已切换为【${nextStatus}】`);
  };

  // Open Add Modal
  const handleOpenAddModal = () => {
    setFormData({
      code: '',
      deviceType: filterDeviceType !== 'all' ? filterDeviceType : '检验设备',
      name: '',
      model: '',
      manufacturer: '',
      supplier: '',
      purchaseDate: '',
      department: filterDepartment !== 'all' ? filterDepartment : '生化组',
      status: '启用',
      ipAddress: '',
      serialNo: '',
      maintenanceCycle: '',
      notes: '',
    });
    setEditingItem(null);
    setShowAddModal(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (item: DeviceCatalogItem) => {
    setEditingItem(item);
    setFormData({
      code: item.code,
      deviceType: item.deviceType,
      name: item.name,
      model: item.model,
      manufacturer: item.manufacturer,
      supplier: item.supplier,
      purchaseDate: item.purchaseDate,
      department: item.department,
      status: item.status,
      ipAddress: item.ipAddress || '',
      serialNo: item.serialNo || '',
      maintenanceCycle: item.maintenanceCycle || '月度保养',
      notes: item.notes || '',
    });
    setShowAddModal(true);
  };

  // Save (Add / Edit) Device Item
  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code.trim()) {
      triggerAction('请填写设备编码');
      return;
    }
    if (!formData.name.trim()) {
      triggerAction('请填写设备名称');
      return;
    }

    const nowTime = '2026-10-29 09:48:10';
    const operatorName = user.name || '张珊';

    if (editingItem) {
      // Edit
      setDevices((prev) =>
        prev.map((d) =>
          d.id === editingItem.id
            ? {
                ...d,
                code: formData.code.trim(),
                deviceType: formData.deviceType.trim(),
                name: formData.name.trim(),
                model: formData.model.trim(),
                manufacturer: formData.manufacturer.trim(),
                supplier: formData.supplier.trim(),
                purchaseDate: formData.purchaseDate,
                department: formData.department.trim(),
                status: formData.status,
                ipAddress: formData.ipAddress.trim(),
                serialNo: formData.serialNo.trim(),
                maintenanceCycle: formData.maintenanceCycle.trim(),
                notes: formData.notes.trim(),
                operator: operatorName,
                updateTime: nowTime,
              }
            : d
        )
      );
      triggerAction(`设备 [${formData.name}] 信息修改成功并完成审计记录！`);
    } else {
      // Add New
      const newItem: DeviceCatalogItem = {
        id: `dev-${Date.now()}`,
        code: formData.code.trim(),
        deviceType: formData.deviceType.trim(),
        name: formData.name.trim(),
        model: formData.model.trim(),
        manufacturer: formData.manufacturer.trim(),
        supplier: formData.supplier.trim(),
        purchaseDate: formData.purchaseDate,
        department: formData.department.trim(),
        status: formData.status,
        operator: operatorName,
        updateTime: nowTime,
        ipAddress: formData.ipAddress.trim(),
        serialNo: formData.serialNo.trim(),
        maintenanceCycle: formData.maintenanceCycle.trim(),
        notes: formData.notes.trim(),
      };
      setDevices((prev) => [newItem, ...prev]);
      triggerAction(`新增设备 [${formData.name}] 已成功录入资产目录！`);
    }

    setShowAddModal(false);
  };

  // Confirm Delete
  const handleConfirmDelete = () => {
    if (!itemToDelete) return;
    setDevices((prev) => prev.filter((d) => d.id !== itemToDelete.id));
    triggerAction(`设备 [${itemToDelete.name}] (编码: ${itemToDelete.code}) 已从字典彻底删除`);
    setItemToDelete(null);
  };

  // Quick Preset Samples for Import
  const handleImportSampleData = () => {
    triggerAction('已成功导入医疗设备档案 5 项！');
    setShowImportModal(false);
  };

  // Quick Stats
  const activeCount = useMemo(() => devices.filter((d) => d.status === '启用').length, [devices]);
  const inactiveCount = useMemo(() => devices.filter((d) => d.status === '停用').length, [devices]);

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-slate-100 overflow-hidden text-xs">
      {/* 1. Top Header & Breadcrumb */}
      <div className="bg-white border-b border-slate-200 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shrink-0 shadow-2xs">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-800 flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-sky-600" />
            临生免系统
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-600 font-medium">基础管理</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-sky-700 font-semibold bg-sky-50 px-2.5 py-0.5 rounded border border-sky-200">
            设备目录字典
          </span>
          <span className="hidden lg:inline text-[11px] text-slate-400 font-mono ml-2">
            全院检验设备台账 · LIS/HIS联机通讯配置
          </span>
        </div>

        {/* Global Stats */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200 text-[11px]">
            <span className="text-slate-500">设备总计:</span>
            <span className="font-mono font-bold text-slate-800">{devices.length}</span>
            <span className="text-slate-300">|</span>
            <span className="text-emerald-700 font-medium">在用 {activeCount}</span>
            <span className="text-slate-300">|</span>
            <span className="text-rose-600 font-medium">停用 {inactiveCount}</span>
          </div>

          <button
            onClick={() => {
              setDevices(INITIAL_DEVICE_CATALOG);
              triggerAction('已恢复全套设备目录出厂标准字典');
            }}
            title="重置恢复标准字典"
            className="px-2 py-1 bg-white hover:bg-slate-50 border border-slate-300 text-slate-600 rounded text-xs shadow-2xs flex items-center gap-1 transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            <span className="hidden sm:inline">重置标准字典</span>
          </button>
        </div>
      </div>

      {/* 2. Top Filter Bar (Directly Matching User Screenshot Fields: 单位, 所属部门, 设备类型, 设备名称, 显示停用, [查询]) */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 shrink-0 shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* 1. 单位 (matching screenshot) */}
          <div className="flex items-center gap-1.5">
            <label className="text-slate-700 font-medium whitespace-nowrap">单位</label>
            <select
              value={selectedHospitalUnit}
              onChange={(e) => setSelectedHospitalUnit(e.target.value)}
              className="h-7 px-2.5 bg-white border border-slate-300 rounded text-xs text-slate-800 font-medium focus:ring-1 focus:ring-sky-500 focus:border-sky-500 outline-hidden"
            >
              <option value="中心医院">中心医院 (总院医学检验中心)</option>
              <option value="东院区急诊化验室">东院区急诊化验室</option>
              <option value="滨江分院医学中心">滨江分院医学中心</option>
            </select>
          </div>

          {/* 2. 所属部门 (matching screenshot dropdown: 微生物组, 生化组, 免疫组...) */}
          <div className="flex items-center gap-1.5">
            <label className="text-slate-700 font-medium whitespace-nowrap">所属部门</label>
            <select
              value={filterDepartment}
              onChange={(e) => {
                setFilterDepartment(e.target.value);
                setCurrentPage(1);
              }}
              className="h-7 px-2.5 bg-white border border-slate-300 rounded text-xs text-slate-800 font-medium focus:ring-1 focus:ring-sky-500 focus:border-sky-500 outline-hidden"
            >
              <option value="all">全部部门</option>
              <option value="微生物组">微生物组</option>
              <option value="生化组">生化组</option>
              <option value="免疫组">免疫组</option>
              <option value="临检常规组">临检常规组</option>
              <option value="急诊检验科">急诊检验科</option>
              <option value="输血科">输血科</option>
            </select>
          </div>

          {/* 3. 设备类型 (matching screenshot dropdown: 检验设备, 前处理设备...) */}
          <div className="flex items-center gap-1.5">
            <label className="text-slate-700 font-medium whitespace-nowrap">设备类型</label>
            <select
              value={filterDeviceType}
              onChange={(e) => {
                setFilterDeviceType(e.target.value);
                setCurrentPage(1);
              }}
              className="h-7 px-2.5 bg-white border border-slate-300 rounded text-xs text-slate-800 font-medium focus:ring-1 focus:ring-sky-500 focus:border-sky-500 outline-hidden"
            >
              <option value="all">全部设备类型</option>
              <option value="检验设备">检验设备</option>
              <option value="前处理设备">前处理设备</option>
              <option value="离心设备">离心设备</option>
              <option value="辅助分析仪">辅助分析仪</option>
              <option value="超低温冷藏设备">超低温冷藏设备</option>
            </select>
          </div>

          {/* 4. 设备名称 (matching screenshot input text box) */}
          <div className="flex items-center gap-1.5">
            <label className="text-slate-700 font-medium whitespace-nowrap">设备名称</label>
            <div className="relative">
              <input
                type="text"
                placeholder="如: AU2700, AU600, Cobas"
                value={filterDeviceName}
                onChange={(e) => setFilterDeviceName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleQuery()}
                className="w-36 lg:w-44 h-7 px-2.5 bg-white border border-slate-300 rounded text-xs focus:ring-1 focus:ring-sky-500 focus:border-sky-500 outline-hidden"
              />
              {filterDeviceName && (
                <button
                  onClick={() => setFilterDeviceName('')}
                  className="absolute right-1.5 top-1.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* 5. 显示停用 Checkbox (matching screenshot) */}
          <label className="flex items-center gap-1.5 text-slate-700 font-medium cursor-pointer select-none border border-slate-200 bg-slate-50 px-2 py-1 rounded">
            <input
              type="checkbox"
              checked={showInactive}
              onChange={(e) => {
                setShowInactive(e.target.checked);
                setCurrentPage(1);
              }}
              className="rounded border-slate-300 text-sky-600 focus:ring-0 cursor-pointer"
            />
            <span>显示停用</span>
          </label>

          {/* [查询] Button (matching screenshot white background, blue border, blue text) */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleQuery}
              className="h-7 px-4 bg-white hover:bg-sky-50 border border-sky-600 text-sky-700 rounded text-xs font-semibold shadow-2xs flex items-center gap-1 transition-colors"
            >
              <Search className="w-3 h-3 text-sky-600" />
              <span>查询</span>
            </button>
            {(filterDeviceName || filterDepartment !== 'all' || filterDeviceType !== 'all') && (
              <button
                onClick={handleResetFilters}
                className="h-7 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded text-xs transition-colors"
              >
                重置筛选
              </button>
            )}
          </div>
        </div>

        {/* Action Buttons Row: [新增] (Solid blue button matching screenshot) */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-100">
          <div className="flex items-center gap-2">
            {/* [新增] Solid blue button matching screenshot */}
            <button
              onClick={handleOpenAddModal}
              className="h-7 px-4 bg-[#0284c7] hover:bg-[#0369a1] text-white rounded text-xs font-semibold shadow-2xs flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>新增</span>
            </button>

            {/* [导入] */}
            <button
              onClick={() => setShowImportModal(true)}
              className="h-7 px-3 bg-white hover:bg-sky-50 border border-slate-300 hover:border-sky-500 text-slate-700 hover:text-sky-700 rounded text-xs font-medium shadow-2xs flex items-center gap-1 transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-slate-500" />
              <span>导入</span>
            </button>

            {/* [导出字典] */}
            <button
              onClick={() => triggerAction('已成功导出设备目录台账 (Excel格式)')}
              className="h-7 px-3 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded text-xs font-medium shadow-2xs flex items-center gap-1 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>导出台账</span>
            </button>
          </div>

          <div className="flex items-center gap-3 text-slate-500 text-xs">
            <span>当前筛选结果: <strong className="font-mono text-sky-700">{filteredDevices.length}</strong> 台设备</span>
            <span className="text-slate-300">|</span>
            <span className="text-[11px] text-slate-400">单页显示固定: 10 条数据</span>
          </div>
        </div>
      </div>

      {/* 3. Main Master Table Workstation */}
      <div className="flex-1 flex flex-col min-h-0 p-3 overflow-hidden">
        <div className="flex-1 bg-white rounded-lg border border-slate-200 shadow-2xs flex flex-col overflow-hidden min-h-0">
          {/* Table Container */}
          <div className="flex-1 overflow-auto light-scrollbar">
            <table className="w-full min-w-[1080px] border-collapse text-left whitespace-nowrap">
              {/* Header (Matching screenshot columns: 设备编码, 设备类型, 设备名称, 型号, 生产厂商, 供应商, 购买日期, 部门, 状态, 操作) */}
              <thead className="bg-slate-50 sticky top-0 z-10 border-b border-slate-200 text-slate-700 font-semibold text-xs shadow-2xs">
                <tr>
                  <th className="px-3 py-2.5 w-12 text-center border-r border-slate-200 text-slate-400">#</th>
                  <th className="px-3.5 py-2.5 w-36 border-r border-slate-200 font-mono">设备编码</th>
                  <th className="px-3.5 py-2.5 w-28 border-r border-slate-200">设备类型</th>
                  <th className="px-4 py-2.5 min-w-[200px] border-r border-slate-200">设备名称</th>
                  <th className="px-3.5 py-2.5 w-24 border-r border-slate-200 font-mono">型号</th>
                  <th className="px-4 py-2.5 w-40 border-r border-slate-200">生产厂商</th>
                  <th className="px-3.5 py-2.5 w-32 border-r border-slate-200">供应商</th>
                  <th className="px-3.5 py-2.5 w-28 border-r border-slate-200 font-mono">购买日期</th>
                  <th className="px-3.5 py-2.5 w-24 border-r border-slate-200">部门</th>
                  <th className="px-3 py-2.5 w-20 border-r border-slate-200 text-center">状态</th>
                  <th className="px-3 py-2.5 w-20 border-r border-slate-200">责任人</th>
                  <th className="px-3.5 py-2.5 w-32 border-r border-slate-200 font-mono text-[11px]">更新时间</th>
                  <th className="px-4 py-2.5 w-32 text-center sticky right-0 bg-slate-50 z-20 shadow-xs">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-800">
                {paginatedDevices.length === 0 ? (
                  <tr>
                    <td colSpan={13} className="py-16 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <FolderOpen className="w-8 h-8 text-slate-300 stroke-1" />
                        <span>未找到符合条件的设备目录数据</span>
                        <button
                          onClick={handleResetFilters}
                          className="mt-1 px-3 py-1 text-xs text-sky-600 hover:text-sky-800 border border-sky-300 rounded"
                        >
                          重置所有筛选
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedDevices.map((item, index) => {
                    const rowNumber = (currentPage - 1) * pageSize + index + 1;
                    const isInactive = item.status === '停用';

                    return (
                      <tr
                        key={item.id}
                        className={`hover:bg-sky-50/50 transition-colors group ${
                          isInactive ? 'bg-slate-50/40 text-slate-400' : ''
                        }`}
                      >
                        {/* Row Index */}
                        <td className="px-3 py-2.5 text-center font-mono text-slate-400 border-r border-slate-100">
                          {rowNumber}
                        </td>

                        {/* 1. 设备编码 (matching screenshot e.g. 124323423423, 124323423421) */}
                        <td className="px-3.5 py-2.5 font-mono font-medium text-slate-900 border-r border-slate-100">
                          <span className="font-semibold select-all text-slate-800">{item.code}</span>
                        </td>

                        {/* 2. 设备类型 */}
                        <td className="px-3.5 py-2.5 border-r border-slate-100">
                          <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700">
                            {item.deviceType}
                          </span>
                        </td>

                        {/* 3. 设备名称 (matching screenshot e.g. AU2700生化分析仪, AU600全自动生化分析仪) */}
                        <td className="px-4 py-2.5 border-r border-slate-100 font-medium text-slate-900">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-800 text-[13px]">{item.name}</span>
                            {item.ipAddress && (
                              <span className="text-[10px] px-1.5 py-0.2 rounded font-mono bg-sky-50 text-sky-700 border border-sky-100 hidden xl:inline-block">
                                IP: {item.ipAddress}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* 4. 型号 (matching screenshot e.g. 12, 3) */}
                        <td className="px-3.5 py-2.5 font-mono font-semibold text-slate-800 border-r border-slate-100">
                          {item.model || '-'}
                        </td>

                        {/* 5. 生产厂商 (matching screenshot e.g. 奥林巴斯) */}
                        <td className="px-4 py-2.5 border-r border-slate-100 text-slate-800">
                          {item.manufacturer || '-'}
                        </td>

                        {/* 6. 供应商 (matching screenshot e.g. 德州仪器) */}
                        <td className="px-3.5 py-2.5 border-r border-slate-100 text-slate-700">
                          {item.supplier || '-'}
                        </td>

                        {/* 7. 购买日期 (matching screenshot) */}
                        <td className="px-3.5 py-2.5 font-mono text-slate-600 border-r border-slate-100">
                          {item.purchaseDate || '-'}
                        </td>

                        {/* 8. 部门 (matching screenshot e.g. 生化组, 免疫组) */}
                        <td className="px-3.5 py-2.5 border-r border-slate-100 font-medium text-slate-800">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                            {item.department}
                          </span>
                        </td>

                        {/* 9. 状态 (matching screenshot: 启用 (black/green), 停用 (red)) */}
                        <td className="px-3 py-2.5 text-center border-r border-slate-100">
                          {item.status === '启用' ? (
                            <span className="text-emerald-700 font-semibold px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200">
                              启用
                            </span>
                          ) : (
                            <span className="text-rose-600 font-bold px-2 py-0.5 rounded bg-rose-50 border border-rose-200">
                              停用
                            </span>
                          )}
                        </td>

                        {/* 10. 责任人 (真实人名: 张珊, 蔡文斌, 陈志远, 林德胜, 黄雅芳) */}
                        <td className="px-3 py-2.5 border-r border-slate-100 font-medium text-slate-700">
                          {item.operator}
                        </td>

                        {/* 11. 更新时间 (近期: 2026-10-29) */}
                        <td className="px-3.5 py-2.5 border-r border-slate-100 font-mono text-[11px] text-slate-500">
                          {item.updateTime}
                        </td>

                        {/* 12. 操作 (matching screenshot: 编辑 停用 删除 / 编辑 启用 删除) */}
                        <td className="px-4 py-2.5 text-center sticky right-0 bg-white group-hover:bg-sky-50/50 shadow-xs z-10">
                          <div className="flex items-center justify-center gap-2 text-xs">
                            {/* [编辑] text link matching screenshot */}
                            <button
                              onClick={() => handleOpenEditModal(item)}
                              className="text-sky-600 hover:text-sky-800 font-medium transition-colors"
                            >
                              编辑
                            </button>

                            {/* [停用 / 启用] text link matching screenshot */}
                            <button
                              onClick={() => handleToggleStatus(item)}
                              className={`font-medium transition-colors ${
                                item.status === '启用'
                                  ? 'text-sky-600 hover:text-rose-600'
                                  : 'text-sky-600 hover:text-emerald-600'
                              }`}
                            >
                              {item.status === '启用' ? '停用' : '启用'}
                            </button>

                            {/* [删除] text link matching screenshot */}
                            <button
                              onClick={() => setItemToDelete(item)}
                              className="text-sky-600 hover:text-rose-600 font-medium transition-colors"
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

          {/* 4. Bottom Footer & Pagination Bar (Strict Requirement: "一页帮我显示10条数据") */}
          <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
            {/* Left: 合计 (matching screenshot: '合计: 2条') */}
            <div className="flex items-center gap-4 text-xs text-slate-600">
              <span className="font-semibold text-slate-800">
                合计: <span className="font-mono text-sky-700 font-bold">{totalItems}</span> 条
              </span>
              <span className="text-slate-300">|</span>
              <span className="text-slate-500">
                当前第 <strong className="font-mono text-slate-800">{currentPage}</strong> / {totalPages} 页
                （显示第 {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, totalItems)} 条）
              </span>
            </div>

            {/* Right: Pagination Controls (Exact 10 per page) */}
            <div className="flex items-center gap-2">
              {/* Page size select (Defaulting to 10) */}
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mr-2">
                <span>每页:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    const newSize = Number(e.target.value);
                    setPageSize(newSize);
                    setCurrentPage(1);
                  }}
                  className="h-6 px-1.5 bg-white border border-slate-300 rounded text-xs text-slate-700 outline-hidden font-mono"
                >
                  <option value={10}>10 条/页 (默认)</option>
                  <option value={20}>20 条/页</option>
                  <option value={50}>50 条/页</option>
                </select>
              </div>

              {/* Prev Button */}
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="h-7 px-2.5 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white border border-slate-300 text-slate-700 rounded text-xs font-medium shadow-2xs flex items-center gap-1 transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>上一页</span>
              </button>

              {/* Page numbers */}
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                  const isCurrent = p === currentPage;
                  return (
                    <button
                      key={p}
                      onClick={() => setCurrentPage(p)}
                      className={`w-7 h-7 rounded text-xs font-mono font-medium transition-colors ${
                        isCurrent
                          ? 'bg-sky-600 text-white font-bold shadow-2xs'
                          : 'bg-white hover:bg-slate-100 border border-slate-300 text-slate-700'
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>

              {/* Next Button */}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                className="h-7 px-2.5 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white border border-slate-300 text-slate-700 rounded text-xs font-medium shadow-2xs flex items-center gap-1 transition-colors"
              >
                <span>下一页</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 5. ADD / EDIT DEVICE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden flex flex-col animate-scaleUp">
            {/* Modal Header */}
            <div className="px-5 py-3.5 bg-gradient-to-r from-sky-700 to-sky-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4" />
                <h3 className="font-bold text-sm tracking-wide">
                  {editingItem ? '编辑设备目录' : '新增设备目录'}
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 hover:bg-white/20 rounded-md text-white/80 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveForm} className="p-5 space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                {/* 设备编码 */}
                <div>
                  <label className="block text-slate-700 font-medium mb-1">
                    <span className="text-rose-500 font-bold mr-0.5">*</span>设备编码
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="如: 124323423423"
                    required
                    className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded text-xs font-mono font-semibold focus:ring-1 focus:ring-sky-500 focus:border-sky-500 outline-hidden"
                  />
                </div>

                {/* 设备类型 */}
                <div>
                  <label className="block text-slate-700 font-medium mb-1">设备类型</label>
                  <select
                    value={formData.deviceType}
                    onChange={(e) => setFormData({ ...formData, deviceType: e.target.value })}
                    className="w-full h-8 px-2 bg-white border border-slate-300 rounded text-xs font-medium focus:ring-1 focus:ring-sky-500 focus:border-sky-500 outline-hidden"
                  >
                    <option value="检验设备">检验设备</option>
                    <option value="前处理设备">前处理设备</option>
                    <option value="离心设备">离心设备</option>
                    <option value="辅助分析仪">辅助分析仪</option>
                    <option value="超低温冷藏设备">超低温冷藏设备</option>
                  </select>
                </div>
              </div>

              {/* 设备名称 */}
              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  <span className="text-rose-500 font-bold mr-0.5">*</span>设备名称
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="如: AU2700生化分析仪, 罗氏 Cobas 8000"
                  required
                  className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded text-xs font-medium focus:ring-1 focus:ring-sky-500 focus:border-sky-500 outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* 型号 */}
                <div>
                  <label className="block text-slate-700 font-medium mb-1">设备型号</label>
                  <input
                    type="text"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    placeholder="如: 12, 3, c702"
                    className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded text-xs font-mono focus:ring-1 focus:ring-sky-500 focus:border-sky-500 outline-hidden"
                  />
                </div>

                {/* 购买日期 */}
                <div>
                  <label className="block text-slate-700 font-medium mb-1">购买/启用日期</label>
                  <input
                    type="date"
                    value={formData.purchaseDate}
                    onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                    className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded text-xs font-mono focus:ring-1 focus:ring-sky-500 focus:border-sky-500 outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* 生产厂商 */}
                <div>
                  <label className="block text-slate-700 font-medium mb-1">生产厂商</label>
                  <input
                    type="text"
                    value={formData.manufacturer}
                    onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                    placeholder="如: 奥林巴斯, 贝克曼库尔特, 罗氏"
                    className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded text-xs focus:ring-1 focus:ring-sky-500 focus:border-sky-500 outline-hidden"
                  />
                </div>

                {/* 供应商 */}
                <div>
                  <label className="block text-slate-700 font-medium mb-1">供应商</label>
                  <input
                    type="text"
                    value={formData.supplier}
                    onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                    placeholder="如: 德州仪器, 华润医疗科技"
                    className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded text-xs focus:ring-1 focus:ring-sky-500 focus:border-sky-500 outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* 所属部门 */}
                <div>
                  <label className="block text-slate-700 font-medium mb-1">所属部门</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full h-8 px-2 bg-white border border-slate-300 rounded text-xs font-medium focus:ring-1 focus:ring-sky-500 focus:border-sky-500 outline-hidden"
                  >
                    <option value="生化组">生化组</option>
                    <option value="免疫组">免疫组</option>
                    <option value="微生物组">微生物组</option>
                    <option value="临检常规组">临检常规组</option>
                    <option value="急诊检验科">急诊检验科</option>
                    <option value="输血科">输血科</option>
                  </select>
                </div>

                {/* 状态 */}
                <div>
                  <label className="block text-slate-700 font-medium mb-1">状态</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as '启用' | '停用' })}
                    className="w-full h-8 px-2 bg-white border border-slate-300 rounded text-xs font-medium focus:ring-1 focus:ring-sky-500 focus:border-sky-500 outline-hidden"
                  >
                    <option value="启用">启用 (正常运行)</option>
                    <option value="停用">停用 (暂停/维保)</option>
                  </select>
                </div>
              </div>

              {/* 联机通讯IP与维保周期 */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">LIS联机IP与端口</label>
                  <input
                    type="text"
                    value={formData.ipAddress}
                    onChange={(e) => setFormData({ ...formData, ipAddress: e.target.value })}
                    placeholder="如: 192.168.10.42:5000"
                    className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded text-xs font-mono focus:ring-1 focus:ring-sky-500 focus:border-sky-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">维保巡检周期</label>
                  <input
                    type="text"
                    value={formData.maintenanceCycle}
                    onChange={(e) => setFormData({ ...formData, maintenanceCycle: e.target.value })}
                    placeholder="如: 月度保养, 周度清理"
                    className="w-full h-8 px-2.5 bg-white border border-slate-300 rounded text-xs focus:ring-1 focus:ring-sky-500 focus:border-sky-500 outline-hidden"
                  />
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 rounded text-xs font-medium transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{editingItem ? '保存修改' : '确认新增'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. BATCH IMPORT MODAL */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden flex flex-col animate-scaleUp">
            <div className="px-5 py-3.5 bg-slate-800 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-sm tracking-wide">批量导入设备目录字典</h3>
              </div>
              <button
                onClick={() => setShowImportModal(false)}
                className="p-1 hover:bg-white/20 rounded-md text-white/80 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="bg-sky-50 border border-sky-200 rounded-lg p-3 text-xs text-sky-900 leading-relaxed">
                <p className="font-medium mb-1">📌 导入格式要求：</p>
                <p>支持 Excel (.xlsx) 或 CSV 文件导入，包含：设备编码、设备名称、设备类型、型号、生产厂商、供应商、购买日期、部门等列。</p>
              </div>

              <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-sky-500 cursor-pointer bg-slate-50 transition-colors">
                <FileSpreadsheet className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                <p className="text-xs font-medium text-slate-700">点击上传或将设备目录 Excel 文件拖拽至此</p>
                <p className="text-[11px] text-slate-400 mt-1">支持全院检验设备台账标准模板</p>
              </div>

              <div className="flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => triggerAction('已下载设备目录标准字典 Excel 模版')}
                  className="text-sky-600 hover:text-sky-800 underline"
                >
                  下载设备字典导入模板.xlsx
                </button>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => setShowImportModal(false)}
                  className="px-4 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 rounded text-xs font-medium transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleImportSampleData}
                  className="px-5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded text-xs font-semibold shadow-xs transition-colors"
                >
                  立即导入
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. DELETE CONFIRMATION MODAL */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-sm w-full p-5 space-y-4 animate-scaleUp">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">确认删除设备目录？</h4>
                <p className="text-xs text-slate-500">此操作将彻底删除台账数据，请确认</p>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs space-y-1">
              <div>
                <span className="text-slate-500">设备编码: </span>
                <span className="font-mono font-bold text-slate-900">{itemToDelete.code}</span>
              </div>
              <div>
                <span className="text-slate-500">设备名称: </span>
                <span className="font-semibold text-slate-900">{itemToDelete.name}</span>
              </div>
              <div>
                <span className="text-slate-500">设备型号: </span>
                <span className="font-mono text-slate-800">{itemToDelete.model}</span>
              </div>
              <div>
                <span className="text-slate-500">生产厂商: </span>
                <span className="text-slate-700">{itemToDelete.manufacturer}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setItemToDelete(null)}
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
