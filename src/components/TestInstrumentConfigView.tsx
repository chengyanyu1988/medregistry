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
  Layers,
  Save,
  Cpu,
  UserCheck,
  Pipette,
  ListFilter,
  ExternalLink,
  ShieldCheck,
  Network
} from './MenuIcon';
import { UserProfile } from '../types/navigation';
import {
  TestInstrument,
  InstrumentItem,
  OperatingTechnician,
  INITIAL_TEST_INSTRUMENTS
} from '../data/deviceConfigData';

interface TestInstrumentConfigViewProps {
  user: UserProfile;
  triggerAction: (msg: string) => void;
}

export const TestInstrumentConfigView: React.FC<TestInstrumentConfigViewProps> = ({
  user,
  triggerAction,
}) => {
  // Master Datasets State
  const [instruments, setInstruments] = useState<TestInstrument[]>(INITIAL_TEST_INSTRUMENTS);

  // Filter States
  const [selectedHospitalUnit, setSelectedHospitalUnit] = useState<string>('中心医院');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('微生物组');
  const [searchDeviceName, setSearchDeviceName] = useState<string>('');
  const [showDisabled, setShowDisabled] = useState<boolean>(false);

  // Pagination State (Strict requirement: 10 items per page)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  // Active Device for Detail Modal (Requirement: "点击左侧的，右侧的信息改成弹窗")
  const [selectedDeviceModal, setSelectedDeviceModal] = useState<TestInstrument | null>(null);
  const [modalActiveTab, setModalActiveTab] = useState<'items' | 'techs'>('items');

  // Search inside Modal
  const [modalItemSearch, setModalItemSearch] = useState<string>('');
  const [modalTechSearch, setModalTechSearch] = useState<string>('');

  // Add / Edit Instrument Modal State
  const [isEditDeviceModalOpen, setIsEditDeviceModalOpen] = useState<boolean>(false);
  const [editingDevice, setEditingDevice] = useState<TestInstrument | null>(null);
  const [deviceForm, setDeviceForm] = useState({
    deviceCode: '',
    deviceName: '',
    model: '',
    department: '生化组',
    manufacturer: '',
    supplier: '',
    ipPort: '192.168.10.100:5000',
    manager: '张珊',
    purchaseDate: '2026-10-29',
    status: '启用' as '启用' | '停用',
  });

  // Add / Edit Item inside Device Modal State
  const [isItemModalOpen, setIsItemModalOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<InstrumentItem | null>(null);
  const [itemForm, setItemForm] = useState({
    seqNo: '01',
    itemCode: '',
    itemName: '',
    englishName: '',
    channelCode: '',
    precision: 2,
    testMethod: '速率法',
    unit: 'U/L',
    calibrationFreq: '每周1次',
    status: '启用' as '启用' | '停用',
  });

  // Add / Edit Technician inside Device Modal State
  const [isTechModalOpen, setIsTechModalOpen] = useState<boolean>(false);
  const [editingTech, setEditingTech] = useState<OperatingTechnician | null>(null);
  const [techForm, setTechForm] = useState({
    techId: '',
    name: '徐晓丽',
    title: '主管检验师',
    department: '生化组',
    certificate: '仪器专机高级上机资格证',
    authDate: '2026-10-29',
    permissions: ['标本检测', '定标上机', '日常维护'],
    status: '在岗' as '在岗' | '停权',
  });

  // Filtered Instruments List
  const filteredInstruments = useMemo(() => {
    return instruments.filter(inst => {
      // Department Filter
      if (selectedDepartment !== '全部' && selectedDepartment !== '' && inst.department !== selectedDepartment) {
        return false;
      }
      // Status Filter
      if (!showDisabled && inst.status === '停用') {
        return false;
      }
      // Keyword Search (Name or Code or Manager)
      if (searchDeviceName.trim()) {
        const kw = searchDeviceName.toLowerCase();
        const match =
          inst.deviceName.toLowerCase().includes(kw) ||
          inst.deviceCode.toLowerCase().includes(kw) ||
          inst.manager.toLowerCase().includes(kw) ||
          inst.model.toLowerCase().includes(kw);
        if (!match) return false;
      }
      return true;
    });
  }, [instruments, selectedDepartment, showDisabled, searchDeviceName]);

  // Paginated Instruments
  const totalPages = Math.ceil(filteredInstruments.length / pageSize) || 1;
  const paginatedInstruments = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredInstruments.slice(start, start + pageSize);
  }, [filteredInstruments, currentPage, pageSize]);

  // Handle Query Click
  const handleSearchQuery = () => {
    setCurrentPage(1);
    triggerAction(`查询检验仪器列表 (部门: ${selectedDepartment || '全部'}, 显示停用: ${showDisabled ? '是' : '否'})`);
  };

  // Open Device Config Modal (Requirement: Click left row -> open right info modal)
  const handleOpenDeviceModal = (device: TestInstrument) => {
    setSelectedDeviceModal(device);
    setModalActiveTab('items');
    setModalItemSearch('');
    setModalTechSearch('');
  };

  // Device Actions
  const handleToggleDeviceStatus = (deviceId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setInstruments(prev =>
      prev.map(item => {
        if (item.id === deviceId) {
          const newStatus = item.status === '启用' ? '停用' : '启用';
          triggerAction(`已将设备 [${item.deviceName}] 状态更改为: ${newStatus}`);
          return { ...item, status: newStatus, updatedAt: '2026-10-29 11:20' };
        }
        return item;
      })
    );
  };

  const handleDeleteDevice = (deviceId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const inst = instruments.find(i => i.id === deviceId);
    if (!inst) return;
    if (window.confirm(`确定要删除设备 [${inst.deviceName}] 吗？`)) {
      setInstruments(prev => prev.filter(i => i.id !== deviceId));
      triggerAction(`已删除仪器设备: ${inst.deviceName}`);
      if (selectedDeviceModal?.id === deviceId) {
        setSelectedDeviceModal(null);
      }
    }
  };

  // Add / Edit Device
  const handleOpenAddDevice = () => {
    setEditingDevice(null);
    setDeviceForm({
      deviceCode: `DEV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      deviceName: '',
      model: '',
      department: selectedDepartment === '全部' ? '生化组' : selectedDepartment,
      manufacturer: '',
      supplier: '',
      ipPort: '192.168.10.100:5000',
      manager: '张珊',
      purchaseDate: '2026-10-29',
      status: '启用',
    });
    setIsEditDeviceModalOpen(true);
  };

  const handleOpenEditDevice = (device: TestInstrument, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingDevice(device);
    setDeviceForm({
      deviceCode: device.deviceCode,
      deviceName: device.deviceName,
      model: device.model,
      department: device.department,
      manufacturer: device.manufacturer,
      supplier: device.supplier,
      ipPort: device.ipPort,
      manager: device.manager,
      purchaseDate: device.purchaseDate,
      status: device.status,
    });
    setIsEditDeviceModalOpen(true);
  };

  const handleSaveDevice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deviceForm.deviceName.trim()) {
      alert('请输入设备名称');
      return;
    }
    if (editingDevice) {
      setInstruments(prev =>
        prev.map(i =>
          i.id === editingDevice.id
            ? {
                ...i,
                deviceCode: deviceForm.deviceCode,
                deviceName: deviceForm.deviceName,
                model: deviceForm.model,
                department: deviceForm.department,
                manufacturer: deviceForm.manufacturer,
                supplier: deviceForm.supplier,
                ipPort: deviceForm.ipPort,
                manager: deviceForm.manager,
                purchaseDate: deviceForm.purchaseDate,
                status: deviceForm.status,
                updatedAt: '2026-10-29 11:30',
              }
            : i
        )
      );
      triggerAction(`更新仪器信息: ${deviceForm.deviceName}`);
    } else {
      const newInst: TestInstrument = {
        id: `INST-${Date.now()}`,
        deviceCode: deviceForm.deviceCode,
        deviceName: deviceForm.deviceName,
        model: deviceForm.model,
        department: deviceForm.department,
        manufacturer: deviceForm.manufacturer || '国产通用设备厂',
        supplier: deviceForm.supplier || '国药控股有限公司',
        ipPort: deviceForm.ipPort,
        manager: deviceForm.manager,
        purchaseDate: deviceForm.purchaseDate,
        status: deviceForm.status,
        itemsCount: 0,
        techsCount: 0,
        updatedAt: '2026-10-29 11:30',
        items: [],
        technicians: [],
      };
      setInstruments(prev => [newInst, ...prev]);
      triggerAction(`新增检验仪器设备: ${deviceForm.deviceName}`);
    }
    setIsEditDeviceModalOpen(false);
  };

  // Item Management Inside Modal
  const filteredModalItems = useMemo(() => {
    if (!selectedDeviceModal) return [];
    if (!modalItemSearch.trim()) return selectedDeviceModal.items;
    const kw = modalItemSearch.toLowerCase();
    return selectedDeviceModal.items.filter(
      itm =>
        itm.itemName.toLowerCase().includes(kw) ||
        itm.itemCode.toLowerCase().includes(kw) ||
        itm.channelCode.toLowerCase().includes(kw) ||
        itm.englishName.toLowerCase().includes(kw)
    );
  }, [selectedDeviceModal, modalItemSearch]);

  const handleOpenAddItem = () => {
    if (!selectedDeviceModal) return;
    setEditingItem(null);
    setItemForm({
      seqNo: String(selectedDeviceModal.items.length + 1).padStart(2, '0'),
      itemCode: `00${selectedDeviceModal.items.length + 14}`,
      itemName: '',
      englishName: '',
      channelCode: `CH-${selectedDeviceModal.items.length + 1}`,
      precision: 2,
      testMethod: '速率法',
      unit: 'U/L',
      calibrationFreq: '每周1次',
      status: '启用',
    });
    setIsItemModalOpen(true);
  };

  const handleOpenEditItem = (item: InstrumentItem) => {
    setEditingItem(item);
    setItemForm({
      seqNo: item.seqNo,
      itemCode: item.itemCode,
      itemName: item.itemName,
      englishName: item.englishName,
      channelCode: item.channelCode,
      precision: item.precision,
      testMethod: item.testMethod,
      unit: item.unit,
      calibrationFreq: item.calibrationFreq,
      status: item.status,
    });
    setIsItemModalOpen(true);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDeviceModal || !itemForm.itemName.trim()) {
      alert('请输入仪器项目名称');
      return;
    }

    let updatedItems: InstrumentItem[];
    if (editingItem) {
      updatedItems = selectedDeviceModal.items.map(i =>
        i.id === editingItem.id ? { ...i, ...itemForm } : i
      );
      triggerAction(`更新仪器项目: ${itemForm.itemName}`);
    } else {
      const newItem: InstrumentItem = {
        id: `ITM-${Date.now()}`,
        ...itemForm,
      };
      updatedItems = [...selectedDeviceModal.items, newItem];
      triggerAction(`设备 [${selectedDeviceModal.deviceName}] 添加新仪器项目: ${itemForm.itemName}`);
    }

    const updatedDev = {
      ...selectedDeviceModal,
      items: updatedItems,
      itemsCount: updatedItems.length,
      updatedAt: '2026-10-29 11:35',
    };

    setSelectedDeviceModal(updatedDev);
    setInstruments(prev => prev.map(dev => (dev.id === updatedDev.id ? updatedDev : dev)));
    setIsItemModalOpen(false);
  };

  const handleDeleteItem = (itemId: string) => {
    if (!selectedDeviceModal) return;
    if (window.confirm('确定要移除此仪器项目配置吗？')) {
      const updatedItems = selectedDeviceModal.items.filter(i => i.id !== itemId);
      const updatedDev = {
        ...selectedDeviceModal,
        items: updatedItems,
        itemsCount: updatedItems.length,
        updatedAt: '2026-10-29 11:36',
      };
      setSelectedDeviceModal(updatedDev);
      setInstruments(prev => prev.map(dev => (dev.id === updatedDev.id ? updatedDev : dev)));
      triggerAction('移除仪器项目');
    }
  };

  // Technician Management Inside Modal
  const filteredModalTechs = useMemo(() => {
    if (!selectedDeviceModal) return [];
    if (!modalTechSearch.trim()) return selectedDeviceModal.technicians;
    const kw = modalTechSearch.toLowerCase();
    return selectedDeviceModal.technicians.filter(
      tech =>
        tech.name.toLowerCase().includes(kw) ||
        tech.techId.toLowerCase().includes(kw) ||
        tech.title.toLowerCase().includes(kw)
    );
  }, [selectedDeviceModal, modalTechSearch]);

  const handleOpenAddTech = () => {
    if (!selectedDeviceModal) return;
    setEditingTech(null);
    setTechForm({
      techId: `T20260${selectedDeviceModal.technicians.length + 9}`,
      name: '黄雅芳',
      title: '主管检验师',
      department: selectedDeviceModal.department,
      certificate: '大型生化/免疫上机操作认证',
      authDate: '2026-10-29',
      permissions: ['标本检测', '定标上机', '日常维护'],
      status: '在岗',
    });
    setIsTechModalOpen(true);
  };

  const handleOpenEditTech = (tech: OperatingTechnician) => {
    setEditingTech(tech);
    setTechForm({
      techId: tech.techId,
      name: tech.name,
      title: tech.title,
      department: tech.department,
      certificate: tech.certificate,
      authDate: tech.authDate,
      permissions: tech.permissions,
      status: tech.status,
    });
    setIsTechModalOpen(true);
  };

  const handleSaveTech = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDeviceModal || !techForm.name.trim()) {
      alert('请输入操作技师姓名');
      return;
    }

    let updatedTechs: OperatingTechnician[];
    if (editingTech) {
      updatedTechs = selectedDeviceModal.technicians.map(t =>
        t.id === editingTech.id ? { ...t, ...techForm } : t
      );
      triggerAction(`更新操作技师权限: ${techForm.name}`);
    } else {
      const newTech: OperatingTechnician = {
        id: `TC-${Date.now()}`,
        ...techForm,
      };
      updatedTechs = [...selectedDeviceModal.technicians, newTech];
      triggerAction(`授权新操作技师: ${techForm.name}`);
    }

    const updatedDev = {
      ...selectedDeviceModal,
      technicians: updatedTechs,
      techsCount: updatedTechs.length,
      updatedAt: '2026-10-29 11:40',
    };

    setSelectedDeviceModal(updatedDev);
    setInstruments(prev => prev.map(dev => (dev.id === updatedDev.id ? updatedDev : dev)));
    setIsTechModalOpen(false);
  };

  const handleDeleteTech = (techId: string) => {
    if (!selectedDeviceModal) return;
    if (window.confirm('确定取消该操作技师的上机授权吗？')) {
      const updatedTechs = selectedDeviceModal.technicians.filter(t => t.id !== techId);
      const updatedDev = {
        ...selectedDeviceModal,
        technicians: updatedTechs,
        techsCount: updatedTechs.length,
        updatedAt: '2026-10-29 11:41',
      };
      setSelectedDeviceModal(updatedDev);
      setInstruments(prev => prev.map(dev => (dev.id === updatedDev.id ? updatedDev : dev)));
      triggerAction('取消技师操作授权');
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-800 font-sans p-4 overflow-y-auto space-y-4">
      {/* Page Header */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg border border-blue-100">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              检验仪器配置
              <span className="text-xs font-normal text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                基础管理
              </span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              配置各科室自动化分析仪通讯、关联检验项目参数与操作技师上机权限
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleSearchQuery}
            className="flex items-center space-x-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-sm transition"
          >
            <RefreshCw className="w-4 h-4" />
            <span>刷新数据</span>
          </button>
          <button
            onClick={handleOpenAddDevice}
            className="flex items-center space-x-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm text-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>新增仪器设备</span>
          </button>
        </div>
      </div>

      {/* Top Filter Bar (Matching user screenshot: 单位, 所属部门, 设备名称, 显示停用, 查询) */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-3.5 flex flex-wrap items-center justify-between gap-3 text-sm">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <label className="text-slate-600 font-medium shrink-0">单位</label>
            <select
              value={selectedHospitalUnit}
              onChange={e => setSelectedHospitalUnit(e.target.value)}
              className="border border-slate-300 rounded px-3 py-1.5 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="中心医院">中心医院</option>
              <option value="第一分院">第一分院</option>
              <option value="东院区">东院区</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <label className="text-slate-600 font-medium shrink-0">所属部门</label>
            <select
              value={selectedDepartment}
              onChange={e => setSelectedDepartment(e.target.value)}
              className="border border-slate-300 rounded px-3 py-1.5 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="全部">全部部门</option>
              <option value="微生物组">微生物组</option>
              <option value="生化组">生化组</option>
              <option value="免疫组">免疫组</option>
              <option value="临检组">临检组</option>
              <option value="分子生物组">分子生物组</option>
              <option value="急诊组">急诊组</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <label className="text-slate-600 font-medium shrink-0">设备名称</label>
            <div className="relative w-64">
              <input
                type="text"
                placeholder="搜索设备名称/编码/型号/责任人..."
                value={searchDeviceName}
                onChange={e => setSearchDeviceName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearchQuery()}
                className="w-full border border-slate-300 rounded pl-3 pr-8 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5" />
            </div>
          </div>

          <label className="flex items-center space-x-1.5 cursor-pointer text-slate-700 select-none">
            <input
              type="checkbox"
              checked={showDisabled}
              onChange={e => setShowDisabled(e.target.checked)}
              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <span>显示停用</span>
          </label>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleSearchQuery}
            className="flex items-center space-x-1 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition"
          >
            <Search className="w-4 h-4" />
            <span>查询</span>
          </button>
        </div>
      </div>

      {/* Main Table View (Left content displayed directly on main page) */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <span className="font-semibold text-slate-700 flex items-center gap-1.5">
            <Table2 className="w-4 h-4 text-blue-600" />
            检验仪器设备列表 (提示：点击设备名称或“查看/参数配置”按钮可在弹窗中查看/编辑仪器项目与操作技师)
          </span>
          <span>共找到 {filteredInstruments.length} 台设备</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100/80 text-slate-700 font-semibold border-b border-slate-200">
                <th className="py-2.5 px-3">设备编码</th>
                <th className="py-2.5 px-3">设备名称</th>
                <th className="py-2.5 px-3">型号</th>
                <th className="py-2.5 px-3">所属部门</th>
                <th className="py-2.5 px-3">生产厂商</th>
                <th className="py-2.5 px-3">通讯IP/端口</th>
                <th className="py-2.5 px-3">责任人</th>
                <th className="py-2.5 px-3 text-center">项目数 / 技师数</th>
                <th className="py-2.5 px-3">状态</th>
                <th className="py-2.5 px-3 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              {paginatedInstruments.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center py-12 text-slate-400">
                    未找到符合条件的检验仪器设备
                  </td>
                </tr>
              ) : (
                paginatedInstruments.map(inst => (
                  <tr
                    key={inst.id}
                    onClick={() => handleOpenDeviceModal(inst)}
                    className="hover:bg-blue-50/50 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-3 font-mono text-slate-600 font-medium">
                      {inst.deviceCode}
                    </td>
                    <td className="py-3 px-3 font-semibold text-blue-700 hover:underline">
                      <div className="flex items-center gap-1.5">
                        <Cpu className="w-4 h-4 text-blue-500 shrink-0" />
                        <span>{inst.deviceName}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-600">{inst.model || '-'}</td>
                    <td className="py-3 px-3">
                      <span className="bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-slate-700">
                        {inst.department}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600 truncate max-w-[160px]" title={inst.manufacturer}>
                      {inst.manufacturer}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-600">{inst.ipPort}</td>
                    <td className="py-3 px-3 font-medium text-slate-800">{inst.manager}</td>
                    <td className="py-3 px-3 text-center">
                      <div className="inline-flex items-center gap-2">
                        <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded font-mono font-medium">
                          {inst.itemsCount} 项目
                        </span>
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded font-mono font-medium">
                          {inst.techsCount} 人
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      {inst.status === '启用' ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 font-medium bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full text-[11px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          启用
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-rose-600 font-medium bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full text-[11px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                          停用
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDeviceModal(inst);
                        }}
                        className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition"
                      >
                        配置 / 详情
                      </button>
                      <button
                        onClick={(e) => handleOpenEditDevice(inst, e)}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        编辑
                      </button>
                      <button
                        onClick={(e) => handleToggleDeviceStatus(inst.id, e)}
                        className={inst.status === '启用' ? 'text-amber-600 hover:text-amber-800 font-medium' : 'text-emerald-600 hover:text-emerald-800 font-medium'}
                      >
                        {inst.status === '启用' ? '停用' : '启用'}
                      </button>
                      <button
                        onClick={(e) => handleDeleteDevice(inst.id, e)}
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
        </div>

        {/* Pagination Bar (Requirement: "一页帮我显示10条数据") */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <div className="font-semibold text-blue-600">
            合计: {filteredInstruments.length} 条数据 (当前第 {currentPage}/{totalPages} 页，每页 {pageSize} 条)
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-2.5 py-1 border border-slate-300 rounded hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>上一页</span>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-2.5 py-1 border rounded text-xs font-medium transition ${
                  currentPage === page
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'border-slate-300 hover:bg-slate-100 text-slate-700'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-2.5 py-1 border border-slate-300 rounded hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <span>下一页</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* MODAL POPUP FOR DEVICE CONFIG (Requirement: "能否把右侧显示的改成弹窗展示，点击后弹窗展示") */}
      {selectedDeviceModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-5xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-150">
            {/* Modal Header */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-600/30 text-blue-400 rounded-lg border border-blue-500/30">
                  <Cpu className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold flex items-center gap-2">
                    仪器配置与管理 - {selectedDeviceModal.deviceName}
                    <span className="text-xs font-mono font-normal bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                      编码: {selectedDeviceModal.deviceCode}
                    </span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    型号: {selectedDeviceModal.model || '未设定'} | 所属部门: {selectedDeviceModal.department} | 通讯IP: {selectedDeviceModal.ipPort} | 责任人: {selectedDeviceModal.manager}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedDeviceModal(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Navigation Tabs (仪器项目 / 操作技师) */}
            <div className="bg-slate-100 border-b border-slate-200 px-4 flex items-center justify-between">
              <div className="flex space-x-1 pt-2">
                <button
                  onClick={() => setModalActiveTab('items')}
                  className={`px-4 py-2 text-sm font-medium border-b-2 flex items-center gap-2 transition ${
                    modalActiveTab === 'items'
                      ? 'border-blue-600 text-blue-600 bg-white rounded-t-lg shadow-xs'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Pipette className="w-4 h-4" />
                  <span>仪器项目 ({selectedDeviceModal.items.length})</span>
                </button>

                <button
                  onClick={() => setModalActiveTab('techs')}
                  className={`px-4 py-2 text-sm font-medium border-b-2 flex items-center gap-2 transition ${
                    modalActiveTab === 'techs'
                      ? 'border-blue-600 text-blue-600 bg-white rounded-t-lg shadow-xs'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <UserCheck className="w-4 h-4" />
                  <span>操作技师 ({selectedDeviceModal.technicians.length})</span>
                </button>
              </div>

              <div className="text-xs text-slate-500 font-mono">
                最后更新时间: {selectedDeviceModal.updatedAt}
              </div>
            </div>

            {/* Modal Content Body */}
            <div className="p-4 overflow-y-auto flex-1 bg-slate-50 space-y-4">
              {/* TAB 1: 仪器项目 (Instrument Items) */}
              {modalActiveTab === 'items' && (
                <div className="space-y-3">
                  <div className="bg-white p-3 rounded-lg border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="relative w-64">
                      <input
                        type="text"
                        placeholder="搜索项目名称/英文名/通道码..."
                        value={modalItemSearch}
                        onChange={e => setModalItemSearch(e.target.value)}
                        className="w-full border border-slate-300 rounded pl-3 pr-8 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2" />
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => triggerAction(`同步 [${selectedDeviceModal.deviceName}] 通道配置`)}
                        className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-medium border border-slate-300 flex items-center gap-1"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>同步通道码</span>
                      </button>
                      <button
                        onClick={handleOpenAddItem}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium flex items-center gap-1 shadow-xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>添加仪器项目</span>
                      </button>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                          <th className="py-2 px-3 w-14">序号</th>
                          <th className="py-2 px-3">仪器项目代码</th>
                          <th className="py-2 px-3">仪器项目名称</th>
                          <th className="py-2 px-3">英文简称</th>
                          <th className="py-2 px-3">通道码</th>
                          <th className="py-2 px-3 text-center">精度(小数)</th>
                          <th className="py-2 px-3">检测方法</th>
                          <th className="py-2 px-3">单位</th>
                          <th className="py-2 px-3">状态</th>
                          <th className="py-2 px-3 text-right">操作</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 text-slate-700">
                        {filteredModalItems.length === 0 ? (
                          <tr>
                            <td colSpan={10} className="text-center py-8 text-slate-400">
                              暂无仪器项目配置，请点击“添加仪器项目”
                            </td>
                          </tr>
                        ) : (
                          filteredModalItems.map((itm, idx) => (
                            <tr key={itm.id} className="hover:bg-slate-50">
                              <td className="py-2 px-3 font-mono text-slate-500">{itm.seqNo || String(idx + 1).padStart(2, '0')}</td>
                              <td className="py-2 px-3 font-mono text-slate-800 font-medium">{itm.itemCode}</td>
                              <td className="py-2 px-3 font-semibold text-slate-900">{itm.itemName}</td>
                              <td className="py-2 px-3 font-mono text-blue-700">{itm.englishName || '-'}</td>
                              <td className="py-2 px-3 font-mono font-medium text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 w-fit">
                                {itm.channelCode}
                              </td>
                              <td className="py-2 px-3 text-center font-mono">{itm.precision}位</td>
                              <td className="py-2 px-3 text-slate-600">{itm.testMethod}</td>
                              <td className="py-2 px-3 text-slate-600 font-mono">{itm.unit || '-'}</td>
                              <td className="py-2 px-3">
                                {itm.status === '启用' ? (
                                  <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-[11px] font-medium border border-emerald-200">
                                    启用
                                  </span>
                                ) : (
                                  <span className="text-rose-600 bg-rose-50 px-2 py-0.5 rounded text-[11px] font-medium border border-rose-200">
                                    停用
                                  </span>
                                )}
                              </td>
                              <td className="py-2 px-3 text-right space-x-2">
                                <button
                                  onClick={() => handleOpenEditItem(itm)}
                                  className="text-blue-600 hover:text-blue-800 font-medium"
                                >
                                  编辑
                                </button>
                                <button
                                  onClick={() => handleDeleteItem(itm.id)}
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
                  </div>
                </div>
              )}

              {/* TAB 2: 操作技师 (Operating Technicians) */}
              {modalActiveTab === 'techs' && (
                <div className="space-y-3">
                  <div className="bg-white p-3 rounded-lg border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="relative w-64">
                      <input
                        type="text"
                        placeholder="搜索技师姓名/工号/职称..."
                        value={modalTechSearch}
                        onChange={e => setModalTechSearch(e.target.value)}
                        className="w-full border border-slate-300 rounded pl-3 pr-8 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2" />
                    </div>

                    <button
                      onClick={handleOpenAddTech}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-medium flex items-center gap-1 shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>添加操作技师</span>
                    </button>
                  </div>

                  <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                          <th className="py-2 px-3">工号</th>
                          <th className="py-2 px-3">姓名</th>
                          <th className="py-2 px-3">职称</th>
                          <th className="py-2 px-3">部门</th>
                          <th className="py-2 px-3">资质许可</th>
                          <th className="py-2 px-3">授权范围</th>
                          <th className="py-2 px-3">授权日期</th>
                          <th className="py-2 px-3">状态</th>
                          <th className="py-2 px-3 text-right">操作</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 text-slate-700">
                        {filteredModalTechs.length === 0 ? (
                          <tr>
                            <td colSpan={9} className="text-center py-8 text-slate-400">
                              暂无操作技师授权，点击“添加操作技师”赋予上机权限
                            </td>
                          </tr>
                        ) : (
                          filteredModalTechs.map(tech => (
                            <tr key={tech.id} className="hover:bg-slate-50">
                              <td className="py-2.5 px-3 font-mono font-medium text-slate-800">{tech.techId}</td>
                              <td className="py-2.5 px-3 font-bold text-slate-900">{tech.name}</td>
                              <td className="py-2.5 px-3 text-slate-600">{tech.title}</td>
                              <td className="py-2.5 px-3 text-slate-600">{tech.department}</td>
                              <td className="py-2.5 px-3 text-slate-600 max-w-[150px] truncate" title={tech.certificate}>
                                {tech.certificate}
                              </td>
                              <td className="py-2.5 px-3">
                                <div className="flex flex-wrap gap-1">
                                  {tech.permissions.map((p, idx) => (
                                    <span key={idx} className="bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.5 rounded text-[10px]">
                                      {p}
                                    </span>
                                  ))}
                                </div>
                              </td>
                              <td className="py-2.5 px-3 font-mono text-slate-500">{tech.authDate}</td>
                              <td className="py-2.5 px-3">
                                {tech.status === '在岗' ? (
                                  <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-[11px] font-medium border border-emerald-200">
                                    在岗
                                  </span>
                                ) : (
                                  <span className="text-rose-600 bg-rose-50 px-2 py-0.5 rounded text-[11px] font-medium border border-rose-200">
                                    停权
                                  </span>
                                )}
                              </td>
                              <td className="py-2.5 px-3 text-right space-x-2">
                                <button
                                  onClick={() => handleOpenEditTech(tech)}
                                  className="text-blue-600 hover:text-blue-800 font-medium"
                                >
                                  编辑权限
                                </button>
                                <button
                                  onClick={() => handleDeleteTech(tech.id)}
                                  className="text-rose-600 hover:text-rose-800 font-medium"
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

            {/* Modal Footer */}
            <div className="p-3 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-500">
                正在编辑仪器设备: <strong className="text-slate-800">{selectedDeviceModal.deviceName}</strong>
              </span>
              <button
                onClick={() => setSelectedDeviceModal(null)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-medium rounded transition"
              >
                关闭弹窗
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: ADD / EDIT DEVICE */}
      {isEditDeviceModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-base">
                {editingDevice ? '编辑检验仪器信息' : '新增检验仪器设备'}
              </h3>
              <button onClick={() => setIsEditDeviceModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDevice} className="p-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">设备编码 *</label>
                  <input
                    type="text"
                    required
                    value={deviceForm.deviceCode}
                    onChange={e => setDeviceForm({ ...deviceForm, deviceCode: e.target.value })}
                    className="w-full border border-slate-300 rounded px-3 py-1.5 focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">所属部门 *</label>
                  <select
                    value={deviceForm.department}
                    onChange={e => setDeviceForm({ ...deviceForm, department: e.target.value })}
                    className="w-full border border-slate-300 rounded px-3 py-1.5 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="生化组">生化组</option>
                    <option value="免疫组">免疫组</option>
                    <option value="临检组">临检组</option>
                    <option value="微生物组">微生物组</option>
                    <option value="分子生物组">分子生物组</option>
                    <option value="急诊组">急诊组</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">设备名称 *</label>
                <input
                  type="text"
                  required
                  placeholder="如: AU2700全自动生化分析仪"
                  value={deviceForm.deviceName}
                  onChange={e => setDeviceForm({ ...deviceForm, deviceName: e.target.value })}
                  className="w-full border border-slate-300 rounded px-3 py-1.5 focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">规格型号</label>
                  <input
                    type="text"
                    placeholder="如: AU2700-012"
                    value={deviceForm.model}
                    onChange={e => setDeviceForm({ ...deviceForm, model: e.target.value })}
                    className="w-full border border-slate-300 rounded px-3 py-1.5 focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">通讯IP/端口</label>
                  <input
                    type="text"
                    value={deviceForm.ipPort}
                    onChange={e => setDeviceForm({ ...deviceForm, ipPort: e.target.value })}
                    className="w-full border border-slate-300 rounded px-3 py-1.5 focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">生产厂商</label>
                  <input
                    type="text"
                    placeholder="如: 奥林巴斯/罗氏/希森美康"
                    value={deviceForm.manufacturer}
                    onChange={e => setDeviceForm({ ...deviceForm, manufacturer: e.target.value })}
                    className="w-full border border-slate-300 rounded px-3 py-1.5 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">责任人 *</label>
                  <input
                    type="text"
                    required
                    value={deviceForm.manager}
                    onChange={e => setDeviceForm({ ...deviceForm, manager: e.target.value })}
                    className="w-full border border-slate-300 rounded px-3 py-1.5 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">运行状态</label>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-1 cursor-pointer">
                    <input
                      type="radio"
                      name="deviceStatus"
                      checked={deviceForm.status === '启用'}
                      onChange={() => setDeviceForm({ ...deviceForm, status: '启用' })}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span>启用</span>
                  </label>
                  <label className="flex items-center space-x-1 cursor-pointer">
                    <input
                      type="radio"
                      name="deviceStatus"
                      checked={deviceForm.status === '停用'}
                      onChange={() => setDeviceForm({ ...deviceForm, status: '停用' })}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span>停用</span>
                  </label>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsEditDeviceModalOpen(false)}
                  className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-medium"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium shadow-xs"
                >
                  保存设备
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD / EDIT INSTRUMENT ITEM */}
      {isItemModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-base">
                {editingItem ? '编辑仪器项目配置' : '添加仪器项目配置'}
              </h3>
              <button onClick={() => setIsItemModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="p-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">顺序号</label>
                  <input
                    type="text"
                    value={itemForm.seqNo}
                    onChange={e => setItemForm({ ...itemForm, seqNo: e.target.value })}
                    className="w-full border border-slate-300 rounded px-3 py-1.5 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">仪器项目代码 *</label>
                  <input
                    type="text"
                    required
                    placeholder="如: 0012"
                    value={itemForm.itemCode}
                    onChange={e => setItemForm({ ...itemForm, itemCode: e.target.value })}
                    className="w-full border border-slate-300 rounded px-3 py-1.5 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">仪器项目名称 *</label>
                <input
                  type="text"
                  required
                  placeholder="如: 钙测定 (Ca)"
                  value={itemForm.itemName}
                  onChange={e => setItemForm({ ...itemForm, itemName: e.target.value })}
                  className="w-full border border-slate-300 rounded px-3 py-1.5 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">英文简称</label>
                  <input
                    type="text"
                    placeholder="如: GA / ALT / TSH"
                    value={itemForm.englishName}
                    onChange={e => setItemForm({ ...itemForm, englishName: e.target.value })}
                    className="w-full border border-slate-300 rounded px-3 py-1.5 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">通道码 *</label>
                  <input
                    type="text"
                    required
                    placeholder="如: 01, CH-01"
                    value={itemForm.channelCode}
                    onChange={e => setItemForm({ ...itemForm, channelCode: e.target.value })}
                    className="w-full border border-slate-300 rounded px-3 py-1.5 font-mono font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">精度 (小数位数)</label>
                  <select
                    value={itemForm.precision}
                    onChange={e => setItemForm({ ...itemForm, precision: parseInt(e.target.value, 10) })}
                    className="w-full border border-slate-300 rounded px-3 py-1.5"
                  >
                    <option value={0}>0 (整数)</option>
                    <option value={1}>1 (保留1位小数)</option>
                    <option value={2}>2 (保留2位小数)</option>
                    <option value={3}>3 (保留3位小数)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">检测单位</label>
                  <input
                    type="text"
                    placeholder="如: mmol/L, U/L"
                    value={itemForm.unit}
                    onChange={e => setItemForm({ ...itemForm, unit: e.target.value })}
                    className="w-full border border-slate-300 rounded px-3 py-1.5 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">检测方法</label>
                <input
                  type="text"
                  placeholder="如: 速率法 / 偶氮偶联法 / 电化学发光法"
                  value={itemForm.testMethod}
                  onChange={e => setItemForm({ ...itemForm, testMethod: e.target.value })}
                  className="w-full border border-slate-300 rounded px-3 py-1.5"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsItemModalOpen(false)}
                  className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-medium"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium shadow-xs"
                >
                  保存配置
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ADD / EDIT OPERATING TECHNICIAN */}
      {isTechModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-base">
                {editingTech ? '编辑操作技师授权' : '授权新操作技师'}
              </h3>
              <button onClick={() => setIsTechModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTech} className="p-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">技师工号 *</label>
                  <input
                    type="text"
                    required
                    value={techForm.techId}
                    onChange={e => setTechForm({ ...techForm, techId: e.target.value })}
                    className="w-full border border-slate-300 rounded px-3 py-1.5 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">姓名 *</label>
                  <input
                    type="text"
                    required
                    value={techForm.name}
                    onChange={e => setTechForm({ ...techForm, name: e.target.value })}
                    className="w-full border border-slate-300 rounded px-3 py-1.5 font-bold text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">职称</label>
                  <select
                    value={techForm.title}
                    onChange={e => setTechForm({ ...techForm, title: e.target.value })}
                    className="w-full border border-slate-300 rounded px-3 py-1.5"
                  >
                    <option value="检验师">检验师</option>
                    <option value="主管检验师">主管检验师</option>
                    <option value="资深检验师">资深检验师</option>
                    <option value="副主任检验师">副主任检验师</option>
                    <option value="主任检验师">主任检验师</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">所属部门</label>
                  <input
                    type="text"
                    value={techForm.department}
                    onChange={e => setTechForm({ ...techForm, department: e.target.value })}
                    className="w-full border border-slate-300 rounded px-3 py-1.5"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">资质证书 / 上机许可</label>
                <input
                  type="text"
                  value={techForm.certificate}
                  onChange={e => setTechForm({ ...techForm, certificate: e.target.value })}
                  className="w-full border border-slate-300 rounded px-3 py-1.5"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">在岗状态</label>
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-1 cursor-pointer">
                    <input
                      type="radio"
                      name="techStatus"
                      checked={techForm.status === '在岗'}
                      onChange={() => setTechForm({ ...techForm, status: '在岗' })}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span>在岗授权</span>
                  </label>
                  <label className="flex items-center space-x-1 cursor-pointer">
                    <input
                      type="radio"
                      name="techStatus"
                      checked={techForm.status === '停权'}
                      onChange={() => setTechForm({ ...techForm, status: '停权' })}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span>暂停授权</span>
                  </label>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsTechModalOpen(false)}
                  className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-medium"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-medium shadow-xs"
                >
                  保存授权
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
