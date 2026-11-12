import React, { useState } from 'react';
import {
  BasicDictType,
  StorageDeviceDictItem,
  BacteriaChannelDictItem,
  AntibioticChannelDictItem,
  AstGroupDictItem,
  OperationDictItem,
  INITIAL_STORAGE_DEVICES,
  INITIAL_BACTERIA_CHANNELS,
  INITIAL_ANTIBIOTIC_CHANNELS,
  INITIAL_AST_GROUPS,
  INITIAL_OPERATIONS,
} from '../data/microbiologyBasicDictData';
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
  Sliders,
  Building2,
} from './MenuIcon';

interface MicrobiologyBasicDictViewProps {
  user?: UserProfile;
  triggerAction: (msg: string) => void;
}

export const MicrobiologyBasicDictView: React.FC<MicrobiologyBasicDictViewProps> = ({
  user,
  triggerAction,
}) => {
  // 1. Hospital Unit Selector (Matches Screenshot Top: 单位名称 [中心医院])
  const [selectedHospitalUnit, setSelectedHospitalUnit] = useState<string>('中心医院');

  // 2. Active Dictionary Catalog (Matches Screenshot Left: 字典目录)
  const [activeCatalog, setActiveCatalog] = useState<BasicDictType>('存储设备字典');

  // Datasets
  const [storageDevices, setStorageDevices] = useState<StorageDeviceDictItem[]>(
    INITIAL_STORAGE_DEVICES
  );
  const [bacteriaChannels, setBacteriaChannels] = useState<BacteriaChannelDictItem[]>(
    INITIAL_BACTERIA_CHANNELS
  );
  const [antibioticChannels, setAntibioticChannels] = useState<AntibioticChannelDictItem[]>(
    INITIAL_ANTIBIOTIC_CHANNELS
  );
  const [astGroups, setAstGroups] = useState<AstGroupDictItem[]>(INITIAL_AST_GROUPS);
  const [operations, setOperations] = useState<OperationDictItem[]>(INITIAL_OPERATIONS);

  // Search keyword
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields - Storage Device
  const [sdType, setSdType] = useState<StorageDeviceDictItem['type']>('冰箱');
  const [sdParent, setSdParent] = useState<string>('无上级设备');
  const [sdDept, setSdDept] = useState<string>('检验科微生物实验室');
  const [sdCode, setSdCode] = useState<string>('');
  const [sdName, setSdName] = useState<string>('');
  const [sdRemarks, setSdRemarks] = useState<string>('');

  // Form Fields - Bacteria Channel
  const [bcInstrument, setBcInstrument] = useState<string>('VITEK 2 Compact 鉴定仪');
  const [bcOrganismName, setBcOrganismName] = useState<string>('');
  const [bcChannelCode, setBcChannelCode] = useState<string>('');
  const [bcLisCode, setBcLisCode] = useState<string>('');
  const [bcRemarks, setBcRemarks] = useState<string>('');

  // Form Fields - Antibiotic Channel
  const [acInstrument, setAcInstrument] = useState<string>('VITEK 2 AST-GN卡');
  const [acAntibioticName, setAcAntibioticName] = useState<string>('');
  const [acChannelCode, setAcChannelCode] = useState<string>('');
  const [acWhonetCode, setAcWhonetCode] = useState<string>('');
  const [acRange, setAcRange] = useState<string>('');
  const [acRemarks, setAcRemarks] = useState<string>('');

  // Form Fields - AST Group
  const [agCode, setAgCode] = useState<string>('');
  const [agName, setAgName] = useState<string>('');
  const [agTargetOrganisms, setAgTargetOrganisms] = useState<string>('');
  const [agAntibioticsList, setAgAntibioticsList] = useState<string>('');
  const [agRemarks, setAgRemarks] = useState<string>('');

  // Form Fields - Operation
  const [opType, setOpType] = useState<string>('标本接种');
  const [opCode, setOpCode] = useState<string>('');
  const [opName, setOpName] = useState<string>('');
  const [opDuration, setOpDuration] = useState<string>('5分钟/批');
  const [opRemarks, setOpRemarks] = useState<string>('');

  // Pagination (Strictly 10 items/page)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showLocalNotice = (msg: string) => {
    setToastMessage(msg);
    triggerAction(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Reset form
  const handleResetForm = () => {
    setEditingId(null);
    setSdType('冰箱');
    setSdParent('无上级设备');
    setSdDept('检验科微生物实验室');
    setSdCode('');
    setSdName('');
    setSdRemarks('');

    setBcInstrument('VITEK 2 Compact 鉴定仪');
    setBcOrganismName('');
    setBcChannelCode('');
    setBcLisCode('');
    setBcRemarks('');

    setAcInstrument('VITEK 2 AST-GN卡');
    setAcAntibioticName('');
    setAcChannelCode('');
    setAcWhonetCode('');
    setAcRange('');
    setAcRemarks('');

    setAgCode('');
    setAgName('');
    setAgTargetOrganisms('');
    setAgAntibioticsList('');
    setAgRemarks('');

    setOpType('标本接种');
    setOpCode('');
    setOpName('');
    setOpDuration('5分钟/批');
    setOpRemarks('');
  };

  // Switch Catalog (matches "点击左侧知识类型，右侧要跟着变化")
  const handleSelectCatalog = (catalog: BasicDictType) => {
    setActiveCatalog(catalog);
    setCurrentPage(1);
    setSearchKeyword('');
    handleResetForm();
    showLocalNotice(`已切换字典目录至【${catalog}】`);
  };

  // Toggle Enable status
  const handleToggleStatus = (id: string) => {
    if (activeCatalog === '存储设备字典') {
      setStorageDevices((prev) =>
        prev.map((item) => (item.id === id ? { ...item, isEnabled: !item.isEnabled } : item))
      );
    } else if (activeCatalog === '细菌通道码字典') {
      setBacteriaChannels((prev) =>
        prev.map((item) => (item.id === id ? { ...item, isEnabled: !item.isEnabled } : item))
      );
    } else if (activeCatalog === '抗生素通道码字典') {
      setAntibioticChannels((prev) =>
        prev.map((item) => (item.id === id ? { ...item, isEnabled: !item.isEnabled } : item))
      );
    } else if (activeCatalog === '手工药敏组') {
      setAstGroups((prev) =>
        prev.map((item) => (item.id === id ? { ...item, isEnabled: !item.isEnabled } : item))
      );
    } else {
      setOperations((prev) =>
        prev.map((item) => (item.id === id ? { ...item, isEnabled: !item.isEnabled } : item))
      );
    }
    showLocalNotice('字典项状态切换成功！');
  };

  // Load into Edit
  const handleEditItem = (item: any) => {
    setEditingId(item.id);
    if (activeCatalog === '存储设备字典') {
      setSdType(item.type);
      setSdParent(item.parentDevice || '无上级设备');
      setSdDept(item.department);
      setSdCode(item.code);
      setSdName(item.name);
      setSdRemarks(item.remarks);
    } else if (activeCatalog === '细菌通道码字典') {
      setBcInstrument(item.instrumentName);
      setBcOrganismName(item.organismName);
      setBcChannelCode(item.channelCode);
      setBcLisCode(item.lisCode);
      setBcRemarks(item.remarks);
    } else if (activeCatalog === '抗生素通道码字典') {
      setAcInstrument(item.instrumentName);
      setAcAntibioticName(item.antibioticName);
      setAcChannelCode(item.channelCode);
      setAcWhonetCode(item.whonetCode);
      setAcRange(item.concentrationRange);
      setAcRemarks(item.remarks);
    } else if (activeCatalog === '手工药敏组') {
      setAgCode(item.groupCode);
      setAgName(item.groupName);
      setAgTargetOrganisms(item.targetOrganisms);
      setAgAntibioticsList(item.antibioticsList);
      setAgRemarks(item.remarks);
    } else {
      setOpType(item.opType);
      setOpCode(item.opCode);
      setOpName(item.opName);
      setOpDuration(item.standardDuration);
      setOpRemarks(item.remarks);
    }
    showLocalNotice(`已载入字典项目【${item.name || item.organismName || item.antibioticName || item.groupName || item.opName}】`);
  };

  // Delete
  const handleDeleteItem = (id: string) => {
    if (activeCatalog === '存储设备字典') {
      setStorageDevices((prev) => prev.filter((i) => i.id !== id));
    } else if (activeCatalog === '细菌通道码字典') {
      setBacteriaChannels((prev) => prev.filter((i) => i.id !== id));
    } else if (activeCatalog === '抗生素通道码字典') {
      setAntibioticChannels((prev) => prev.filter((i) => i.id !== id));
    } else if (activeCatalog === '手工药敏组') {
      setAstGroups((prev) => prev.filter((i) => i.id !== id));
    } else {
      setOperations((prev) => prev.filter((i) => i.id !== id));
    }
    if (editingId === id) handleResetForm();
    showLocalNotice('已删除指定字典项！');
  };

  // Save Form
  const handleSaveForm = () => {
    const operator = user?.name || '李晓红主管检验师';
    const currentTime = '2026-10-30 12:20:00';

    if (activeCatalog === '存储设备字典') {
      if (!sdCode.trim() || !sdName.trim()) {
        showLocalNotice('请填写设备编码与设备名称！');
        return;
      }
      if (editingId) {
        setStorageDevices((prev) =>
          prev.map((i) =>
            i.id === editingId
              ? {
                  ...i,
                  code: sdCode.trim(),
                  name: sdName.trim(),
                  type: sdType,
                  isLeaf: sdType === '菌株盒' ? '是' : '否',
                  parentDevice: sdParent,
                  department: sdDept,
                  remarks: sdRemarks,
                  operator: operator,
                  operateTime: currentTime,
                }
              : i
          )
        );
        showLocalNotice(`存储设备【${sdName}】更新成功！`);
      } else {
        const newItem: StorageDeviceDictItem = {
          id: `sd-${Date.now()}`,
          code: sdCode.trim(),
          name: sdName.trim(),
          type: sdType,
          isLeaf: sdType === '菌株盒' ? '是' : '否',
          parentDevice: sdParent,
          department: sdDept,
          remarks: sdRemarks,
          operator: operator,
          operateTime: currentTime,
          isEnabled: true,
        };
        setStorageDevices((prev) => [newItem, ...prev]);
        showLocalNotice(`新存储设备【${sdName}】保存成功！`);
      }
      handleResetForm();
    } else if (activeCatalog === '细菌通道码字典') {
      if (!bcOrganismName.trim() || !bcChannelCode.trim()) {
        showLocalNotice('请填写细菌中文名与仪器通道码！');
        return;
      }
      if (editingId) {
        setBacteriaChannels((prev) =>
          prev.map((i) =>
            i.id === editingId
              ? {
                  ...i,
                  instrumentName: bcInstrument,
                  organismName: bcOrganismName.trim(),
                  channelCode: bcChannelCode.trim(),
                  lisCode: bcLisCode.trim() || 'B000',
                  remarks: bcRemarks,
                  operator: operator,
                  operateTime: currentTime,
                }
              : i
          )
        );
        showLocalNotice(`细菌通道码【${bcOrganismName}】更新成功！`);
      } else {
        const newItem: BacteriaChannelDictItem = {
          id: `bc-${Date.now()}`,
          instrumentName: bcInstrument,
          organismName: bcOrganismName.trim(),
          channelCode: bcChannelCode.trim(),
          lisCode: bcLisCode.trim() || 'B000',
          remarks: bcRemarks,
          operator: operator,
          operateTime: currentTime,
          isEnabled: true,
        };
        setBacteriaChannels((prev) => [newItem, ...prev]);
        showLocalNotice(`新细菌通道码【${bcOrganismName}】保存成功！`);
      }
      handleResetForm();
    } else if (activeCatalog === '抗生素通道码字典') {
      if (!acAntibioticName.trim() || !acChannelCode.trim()) {
        showLocalNotice('请填写抗生素名称与仪器通道码！');
        return;
      }
      if (editingId) {
        setAntibioticChannels((prev) =>
          prev.map((i) =>
            i.id === editingId
              ? {
                  ...i,
                  instrumentName: acInstrument,
                  antibioticName: acAntibioticName.trim(),
                  channelCode: acChannelCode.trim(),
                  whonetCode: acWhonetCode.trim() || '-',
                  concentrationRange: acRange.trim() || '未设定',
                  remarks: acRemarks,
                  operator: operator,
                  operateTime: currentTime,
                }
              : i
          )
        );
        showLocalNotice(`抗生素通道码【${acAntibioticName}】更新成功！`);
      } else {
        const newItem: AntibioticChannelDictItem = {
          id: `ac-${Date.now()}`,
          instrumentName: acInstrument,
          antibioticName: acAntibioticName.trim(),
          channelCode: acChannelCode.trim(),
          whonetCode: acWhonetCode.trim() || '-',
          concentrationRange: acRange.trim() || '未设定',
          remarks: acRemarks,
          operator: operator,
          operateTime: currentTime,
          isEnabled: true,
        };
        setAntibioticChannels((prev) => [newItem, ...prev]);
        showLocalNotice(`新抗生素通道码【${acAntibioticName}】保存成功！`);
      }
      handleResetForm();
    } else if (activeCatalog === '手工药敏组') {
      if (!agCode.trim() || !agName.trim()) {
        showLocalNotice('请填写药敏组编码与药敏组名称！');
        return;
      }
      if (editingId) {
        setAstGroups((prev) =>
          prev.map((i) =>
            i.id === editingId
              ? {
                  ...i,
                  groupCode: agCode.trim(),
                  groupName: agName.trim(),
                  targetOrganisms: agTargetOrganisms.trim() || '通用菌群',
                  antibioticsList: agAntibioticsList.trim() || '无抗生素',
                  remarks: agRemarks,
                  operator: operator,
                  operateTime: currentTime,
                }
              : i
          )
        );
        showLocalNotice(`药敏组【${agName}】更新成功！`);
      } else {
        const newItem: AstGroupDictItem = {
          id: `ag-${Date.now()}`,
          groupCode: agCode.trim(),
          groupName: agName.trim(),
          targetOrganisms: agTargetOrganisms.trim() || '通用菌群',
          antibioticsList: agAntibioticsList.trim() || '无抗生素',
          remarks: agRemarks,
          operator: operator,
          operateTime: currentTime,
          isEnabled: true,
        };
        setAstGroups((prev) => [newItem, ...prev]);
        showLocalNotice(`新药敏组【${agName}】保存成功！`);
      }
      handleResetForm();
    } else {
      if (!opCode.trim() || !opName.trim()) {
        showLocalNotice('请填写操作编码与操作名称！');
        return;
      }
      if (editingId) {
        setOperations((prev) =>
          prev.map((i) =>
            i.id === editingId
              ? {
                  ...i,
                  opType: opType,
                  opCode: opCode.trim(),
                  opName: opName.trim(),
                  standardDuration: opDuration.trim() || '5分钟',
                  remarks: opRemarks,
                  operator: operator,
                  operateTime: currentTime,
                }
              : i
          )
        );
        showLocalNotice(`操作字典【${opName}】更新成功！`);
      } else {
        const newItem: OperationDictItem = {
          id: `op-${Date.now()}`,
          opType: opType,
          opCode: opCode.trim(),
          opName: opName.trim(),
          standardDuration: opDuration.trim() || '5分钟',
          remarks: opRemarks,
          operator: operator,
          operateTime: currentTime,
          isEnabled: true,
        };
        setOperations((prev) => [newItem, ...prev]);
        showLocalNotice(`新操作字典【${opName}】保存成功！`);
      }
      handleResetForm();
    }
  };

  // Filtered lists
  const filteredStorageDevices = storageDevices.filter((item) => {
    if (!searchKeyword.trim()) return true;
    const q = searchKeyword.trim().toLowerCase();
    return (
      item.name.toLowerCase().includes(q) ||
      item.code.toLowerCase().includes(q) ||
      item.type.toLowerCase().includes(q)
    );
  });

  const filteredBacteriaChannels = bacteriaChannels.filter((item) => {
    if (!searchKeyword.trim()) return true;
    const q = searchKeyword.trim().toLowerCase();
    return (
      item.organismName.toLowerCase().includes(q) ||
      item.channelCode.toLowerCase().includes(q) ||
      item.instrumentName.toLowerCase().includes(q)
    );
  });

  const filteredAntibioticChannels = antibioticChannels.filter((item) => {
    if (!searchKeyword.trim()) return true;
    const q = searchKeyword.trim().toLowerCase();
    return (
      item.antibioticName.toLowerCase().includes(q) ||
      item.channelCode.toLowerCase().includes(q) ||
      item.whonetCode.toLowerCase().includes(q)
    );
  });

  const filteredAstGroups = astGroups.filter((item) => {
    if (!searchKeyword.trim()) return true;
    const q = searchKeyword.trim().toLowerCase();
    return (
      item.groupName.toLowerCase().includes(q) ||
      item.groupCode.toLowerCase().includes(q) ||
      item.targetOrganisms.toLowerCase().includes(q)
    );
  });

  const filteredOperations = operations.filter((item) => {
    if (!searchKeyword.trim()) return true;
    const q = searchKeyword.trim().toLowerCase();
    return (
      item.opName.toLowerCase().includes(q) ||
      item.opCode.toLowerCase().includes(q) ||
      item.opType.toLowerCase().includes(q)
    );
  });

  // Current dataset total count
  const currentTotal =
    activeCatalog === '存储设备字典'
      ? filteredStorageDevices.length
      : activeCatalog === '细菌通道码字典'
      ? filteredBacteriaChannels.length
      : activeCatalog === '抗生素通道码字典'
      ? filteredAntibioticChannels.length
      : activeCatalog === '手工药敏组'
      ? filteredAstGroups.length
      : filteredOperations.length;

  const totalPages = Math.ceil(currentTotal / pageSize) || 1;

  const currentSdItems = filteredStorageDevices.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const currentBcItems = filteredBacteriaChannels.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const currentAcItems = filteredAntibioticChannels.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const currentAgItems = filteredAstGroups.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const currentOpItems = filteredOperations.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-100 overflow-hidden text-xs">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 right-8 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2 border border-slate-700 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Top Banner (Matches Screenshot Header: 单位名称 [中心医院]) */}
      <div className="bg-white border-b border-slate-200 px-5 py-2.5 shrink-0 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="font-semibold text-slate-700 whitespace-nowrap">单位名称:</span>
          <select
            value={selectedHospitalUnit}
            onChange={(e) => {
              setSelectedHospitalUnit(e.target.value);
              showLocalNotice(`已切换医院单位: ${e.target.value}`);
            }}
            className="px-3 py-1 bg-slate-50 border border-slate-300 rounded font-medium text-slate-800 text-xs focus:ring-1 focus:ring-sky-500"
          >
            <option value="中心医院">中心医院 (总院微生物中心)</option>
            <option value="东城第一分院">东城第一分院</option>
            <option value="滨海妇女儿童院区">滨海妇女儿童院区</option>
          </select>
        </div>

        <div className="flex items-center gap-2 text-slate-500 text-[11px]">
          <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
          <span>微生物基础运行字典 · 双向仪器通道码标准映射体系</span>
        </div>
      </div>

      {/* Main 3-Column Workspace: Left Menu + Middle Editor + Right Table */}
      <div className="flex-1 min-h-0 flex overflow-hidden">
        {/* 1. Left Nav: 字典目录 (Matches Screenshot Left Menu) */}
        <div className="w-56 bg-white border-r border-slate-200 flex flex-col shrink-0">
          <div className="p-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <Sliders className="w-4 h-4 text-sky-600" />
              <span>字典目录</span>
            </div>
            <span className="text-[10px] bg-sky-100 text-sky-800 font-mono px-1.5 py-0.5 rounded">
              5项
            </span>
          </div>

          <div className="p-2 space-y-1 flex-1 overflow-y-auto">
            {(
              [
                '存储设备字典',
                '细菌通道码字典',
                '抗生素通道码字典',
                '手工药敏组',
                '操作字典',
              ] as BasicDictType[]
            ).map((cat) => {
              const isActive = activeCatalog === cat;
              return (
                <button
                  key={cat}
                  onClick={() => handleSelectCatalog(cat)}
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
                    <span>{cat}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">
                    {cat === '存储设备字典'
                      ? storageDevices.length
                      : cat === '细菌通道码字典'
                      ? bacteriaChannels.length
                      : cat === '抗生素通道码字典'
                      ? antibioticChannels.length
                      : cat === '手工药敏组'
                      ? astGroups.length
                      : operations.length}
                    项
                  </span>
                </button>
              );
            })}
          </div>

          <div className="p-3 border-t border-slate-200 bg-slate-50 text-[11px] text-slate-500">
            <div>运行环境: <strong className="text-emerald-700 font-mono">在线受控</strong></div>
            <div className="mt-0.5">机构: {selectedHospitalUnit}</div>
          </div>
        </div>

        {/* 2. Middle Editor Form Panel (Matches Screenshot Middle: 设备编辑 / 通道码编辑) */}
        <div className="w-80 bg-white border-r border-slate-200 flex flex-col shrink-0 shadow-2xs">
          <div className="p-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <Edit className="w-4 h-4 text-sky-600" />
              <span>
                {activeCatalog === '存储设备字典'
                  ? '设备编辑'
                  : activeCatalog === '细菌通道码字典'
                  ? '细菌通道码编辑'
                  : activeCatalog === '抗生素通道码字典'
                  ? '抗生素通道码编辑'
                  : activeCatalog === '手工药敏组'
                  ? '手工药敏组编辑'
                  : '操作字典编辑'}
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
            {activeCatalog === '存储设备字典' && (
              <>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">存储类型</label>
                  <select
                    value={sdType}
                    onChange={(e) => setSdType(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-800 font-medium focus:ring-1 focus:ring-sky-500"
                  >
                    <option value="冰箱">冰箱</option>
                    <option value="铁架">铁架</option>
                    <option value="菌株盒">菌株盒</option>
                    <option value="培养箱">培养箱</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">上级设备</label>
                  <select
                    value={sdParent}
                    onChange={(e) => setSdParent(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-800 focus:ring-1 focus:ring-sky-500"
                  >
                    <option value="无上级设备">无上级设备 (顶级根容器)</option>
                    <option value="海尔超低温冰箱 (-80℃)">海尔超低温冰箱 (-80℃)</option>
                    <option value="海尔冰箱 (4℃冷藏)">海尔冰箱 (4℃冷藏)</option>
                    <option value="上层一号铁架 (架位01)">上层一号铁架 (架位01)</option>
                    <option value="中层一号铁架 (架位02)">中层一号铁架 (架位02)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">使用部门</label>
                  <select
                    value={sdDept}
                    onChange={(e) => setSdDept(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-800 focus:ring-1 focus:ring-sky-500"
                  >
                    <option value="检验科微生物实验室">检验科微生物实验室</option>
                    <option value="菌种保藏室">菌种保藏室</option>
                    <option value="质控样本库">质控样本库</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">
                    <span className="text-rose-500 mr-0.5">*</span>设备编码
                  </label>
                  <input
                    type="text"
                    placeholder="如: 01 / 02 / FZ-01"
                    value={sdCode}
                    onChange={(e) => setSdCode(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-800 font-mono font-bold focus:ring-1 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">
                    <span className="text-rose-500 mr-0.5">*</span>设备名称
                  </label>
                  <input
                    type="text"
                    placeholder="如: 海尔超低温冰箱 (-80℃)"
                    value={sdName}
                    onChange={(e) => setSdName(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-800 font-bold focus:ring-1 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">备注说明</label>
                  <textarea
                    rows={3}
                    placeholder="输入设备放置位置、容积孔位或质控用途..."
                    value={sdRemarks}
                    onChange={(e) => setSdRemarks(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-800 focus:ring-1 focus:ring-sky-500"
                  />
                </div>
              </>
            )}

            {activeCatalog === '细菌通道码字典' && (
              <>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">仪器设备</label>
                  <select
                    value={bcInstrument}
                    onChange={(e) => setBcInstrument(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-800 focus:ring-1 focus:ring-sky-500"
                  >
                    <option value="VITEK 2 Compact 鉴定仪">VITEK 2 Compact 鉴定仪</option>
                    <option value="MALDI-TOF 质谱仪">MALDI-TOF 质谱仪</option>
                    <option value="BD Phoenix 100 自动药敏仪">BD Phoenix 100 自动药敏仪</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">
                    <span className="text-rose-500 mr-0.5">*</span>细菌中文名
                  </label>
                  <input
                    type="text"
                    placeholder="如: 大肠埃希菌 / 肺炎克雷伯菌"
                    value={bcOrganismName}
                    onChange={(e) => setBcOrganismName(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-800 font-bold focus:ring-1 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">
                    <span className="text-rose-500 mr-0.5">*</span>仪器通道码
                  </label>
                  <input
                    type="text"
                    placeholder="如: EC01 / KP01 / MS_ABA"
                    value={bcChannelCode}
                    onChange={(e) => setBcChannelCode(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-800 font-mono font-bold focus:ring-1 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">LIS标准码</label>
                  <input
                    type="text"
                    placeholder="如: B001 / B002"
                    value={bcLisCode}
                    onChange={(e) => setBcLisCode(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-800 font-mono focus:ring-1 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">备注说明</label>
                  <textarea
                    rows={3}
                    placeholder="输入通信卡槽映射或双向协议备注..."
                    value={bcRemarks}
                    onChange={(e) => setBcRemarks(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-800 focus:ring-1 focus:ring-sky-500"
                  />
                </div>
              </>
            )}

            {activeCatalog === '抗生素通道码字典' && (
              <>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">仪器药敏卡/测试板</label>
                  <select
                    value={acInstrument}
                    onChange={(e) => setAcInstrument(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-800 focus:ring-1 focus:ring-sky-500"
                  >
                    <option value="VITEK 2 AST-GN卡">VITEK 2 AST-GN卡 (革兰阴性)</option>
                    <option value="VITEK 2 AST-GP卡">VITEK 2 AST-GP卡 (革兰阳性)</option>
                    <option value="BD Phoenix NMIC/ID板">BD Phoenix NMIC/ID板</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">
                    <span className="text-rose-500 mr-0.5">*</span>抗生素名称
                  </label>
                  <input
                    type="text"
                    placeholder="如: 美罗培南 / 万古霉素"
                    value={acAntibioticName}
                    onChange={(e) => setAcAntibioticName(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-800 font-bold focus:ring-1 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">
                    <span className="text-rose-500 mr-0.5">*</span>仪器通道码
                  </label>
                  <input
                    type="text"
                    placeholder="如: MEM01 / VAN01"
                    value={acChannelCode}
                    onChange={(e) => setAcChannelCode(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-800 font-mono font-bold focus:ring-1 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">WHONET代码</label>
                  <input
                    type="text"
                    placeholder="如: MEM / VAN / IPM"
                    value={acWhonetCode}
                    onChange={(e) => setAcWhonetCode(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-800 font-mono focus:ring-1 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">浓度测定梯度范围</label>
                  <input
                    type="text"
                    placeholder="如: 0.25 - 16 ug/mL"
                    value={acRange}
                    onChange={(e) => setAcRange(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-800 font-mono focus:ring-1 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">备注说明</label>
                  <textarea
                    rows={2}
                    value={acRemarks}
                    onChange={(e) => setAcRemarks(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-800 focus:ring-1 focus:ring-sky-500"
                  />
                </div>
              </>
            )}

            {activeCatalog === '手工药敏组' && (
              <>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">
                    <span className="text-rose-500 mr-0.5">*</span>药敏组编码
                  </label>
                  <input
                    type="text"
                    placeholder="如: GNB-A / GPB-01"
                    value={agCode}
                    onChange={(e) => setAgCode(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-800 font-mono font-bold focus:ring-1 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">
                    <span className="text-rose-500 mr-0.5">*</span>药敏组名称
                  </label>
                  <input
                    type="text"
                    placeholder="如: 肠杆菌目常规药敏组 (A组)"
                    value={agName}
                    onChange={(e) => setAgName(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-800 font-bold focus:ring-1 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">适用菌群</label>
                  <input
                    type="text"
                    placeholder="如: 大肠埃希菌、克雷伯菌属"
                    value={agTargetOrganisms}
                    onChange={(e) => setAgTargetOrganisms(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-800 focus:ring-1 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">包含抗生素列表</label>
                  <textarea
                    rows={3}
                    placeholder="以顿号隔开抗生素名称..."
                    value={agAntibioticsList}
                    onChange={(e) => setAgAntibioticsList(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-800 focus:ring-1 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">备注</label>
                  <textarea
                    rows={2}
                    value={agRemarks}
                    onChange={(e) => setAgRemarks(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-800 focus:ring-1 focus:ring-sky-500"
                  />
                </div>
              </>
            )}

            {activeCatalog === '操作字典' && (
              <>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">操作类型</label>
                  <select
                    value={opType}
                    onChange={(e) => setOpType(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-800 focus:ring-1 focus:ring-sky-500"
                  >
                    <option value="标本接种">标本接种</option>
                    <option value="涂片染色">涂片染色</option>
                    <option value="仪器质谱">仪器质谱</option>
                    <option value="药敏贴片">药敏贴片</option>
                    <option value="菌种保藏">菌种保藏</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">
                    <span className="text-rose-500 mr-0.5">*</span>操作编码
                  </label>
                  <input
                    type="text"
                    placeholder="如: OP-INOC-01"
                    value={opCode}
                    onChange={(e) => setOpCode(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-800 font-mono font-bold focus:ring-1 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">
                    <span className="text-rose-500 mr-0.5">*</span>操作名称
                  </label>
                  <input
                    type="text"
                    placeholder="如: 定量划线接种法"
                    value={opName}
                    onChange={(e) => setOpName(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-800 font-bold focus:ring-1 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">标准耗时</label>
                  <input
                    type="text"
                    placeholder="如: 3分钟/份"
                    value={opDuration}
                    onChange={(e) => setOpDuration(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-800 focus:ring-1 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">规程备注</label>
                  <textarea
                    rows={2}
                    value={opRemarks}
                    onChange={(e) => setOpRemarks(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-800 focus:ring-1 focus:ring-sky-500"
                  />
                </div>
              </>
            )}

            {/* Action Buttons: 取消 / 保存 (Matches Screenshot: 取消 / 保存) */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={handleResetForm}
                className="px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-600 border border-slate-300 rounded font-medium transition-colors"
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

        {/* 3. Right Table Section (Matches Screenshot: 设备列表 / 各分类清单) */}
        <div className="flex-1 min-w-0 flex flex-col h-full overflow-hidden p-5">
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden flex flex-col h-full">
            {/* Top Toolbar above Table (Matches Screenshot: 设备列表 [搜索框] [设备类型按钮]) */}
            <div className="px-5 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm">
                  {activeCatalog === '存储设备字典'
                    ? '设备列表'
                    : activeCatalog === '细菌通道码字典'
                    ? '细菌仪器通道码对照表'
                    : activeCatalog === '抗生素通道码字典'
                    ? '抗生素仪器通道码列表'
                    : activeCatalog === '手工药敏组'
                    ? '手工药敏组合配置表'
                    : '操作规程字典列表'}
                </span>
                <span className="text-[11px] bg-sky-100 text-sky-800 font-mono px-2 py-0.5 rounded font-bold">
                  {currentTotal} 项
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="请输入名称查询..."
                    value={searchKeyword}
                    onChange={(e) => {
                      setSearchKeyword(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-56 pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded-md text-xs placeholder-slate-400 focus:ring-1 focus:ring-sky-500"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>

                <button
                  onClick={() => {
                    setSearchKeyword('');
                    setCurrentPage(1);
                    showLocalNotice('已刷新当前字典数据');
                  }}
                  className="px-3 py-1.5 bg-sky-700 hover:bg-sky-800 text-white rounded font-medium text-xs shadow-2xs flex items-center gap-1 transition-colors"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>设备类型</span>
                </button>
              </div>
            </div>

            {/* Table Container */}
            <div className="overflow-x-auto flex-1">
              {/* Type 1: 存储设备字典 (Matches Exact Columns in Screenshot image_2c9cfe5c.png) */}
              {activeCatalog === '存储设备字典' && (
                <table className="w-full text-left border-collapse min-w-[950px]">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 sticky top-0 z-10 select-none">
                    <tr>
                      <th className="w-12 px-3 py-2.5 text-center">图标</th>
                      <th className="px-3.5 py-2.5 w-24 font-mono">设备编码</th>
                      <th className="px-3.5 py-2.5">设备名称</th>
                      <th className="px-3.5 py-2.5 w-24">设备类型</th>
                      <th className="px-3.5 py-2.5 w-24 text-center">末级存储</th>
                      <th className="px-3.5 py-2.5">备注</th>
                      <th className="px-3.5 py-2.5">操作人</th>
                      <th className="px-3.5 py-2.5 font-mono">操作时间</th>
                      <th className="px-3.5 py-2.5 text-center w-20">状态</th>
                      <th className="px-3.5 py-2.5 text-center w-28">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    {currentSdItems.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="text-center py-16 text-slate-400">
                          暂无符合查询条件的存储设备
                        </td>
                      </tr>
                    ) : (
                      currentSdItems.map((item) => (
                        <tr
                          key={item.id}
                          className={`hover:bg-sky-50/60 transition-colors ${
                            editingId === item.id ? 'bg-sky-50/50 font-medium' : ''
                          }`}
                        >
                          {/* 图标 (Matches Screenshot play arrow + freezer icon) */}
                          <td className="px-3 py-2.5 text-center">
                            <div className="flex items-center justify-center gap-1 text-sky-600">
                              <Archive className="w-4 h-4 text-sky-600" />
                            </div>
                          </td>

                          {/* 设备编码 */}
                          <td className="px-3.5 py-2.5 font-mono font-bold text-slate-800">
                            {item.code}
                          </td>

                          {/* 设备名称 */}
                          <td className="px-3.5 py-2.5 font-bold text-slate-900">
                            <div>{item.name}</div>
                            {item.parentDevice && item.parentDevice !== '无上级设备' && (
                              <div className="text-[10px] text-slate-400 font-sans">
                                挂载于: {item.parentDevice}
                              </div>
                            )}
                          </td>

                          {/* 设备类型 */}
                          <td className="px-3.5 py-2.5 text-slate-700 font-medium">
                            {item.type}
                          </td>

                          {/* 末级存储 */}
                          <td className="px-3.5 py-2.5 text-center">
                            <span
                              className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                                item.isLeaf === '是'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {item.isLeaf}
                            </span>
                          </td>

                          {/* 备注 */}
                          <td className="px-3.5 py-2.5 text-slate-500 truncate max-w-[200px]" title={item.remarks}>
                            {item.remarks || '-'}
                          </td>

                          {/* 操作人 (真实规范姓名) */}
                          <td className="px-3.5 py-2.5 text-slate-800 font-medium">
                            {item.operator}
                          </td>

                          {/* 操作时间 (近期时间) */}
                          <td className="px-3.5 py-2.5 font-mono text-slate-500 text-[11px]">
                            {item.operateTime}
                          </td>

                          {/* 状态 (Toggle switch, matches screenshot blue pill toggle) */}
                          <td className="px-3.5 py-2.5 text-center">
                            <button
                              onClick={() => handleToggleStatus(item.id)}
                              className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer mx-auto ${
                                item.isEnabled ? 'bg-sky-600' : 'bg-slate-300'
                              }`}
                            >
                              <div
                                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                                  item.isEnabled ? 'translate-x-5' : 'translate-x-0'
                                }`}
                              />
                            </button>
                          </td>

                          {/* 操作: 编辑 / 删除 */}
                          <td className="px-3.5 py-2.5 text-center whitespace-nowrap">
                            <button
                              onClick={() => handleEditItem(item)}
                              className="text-sky-600 hover:text-sky-800 font-medium mr-3"
                            >
                              编辑
                            </button>
                            <button
                              onClick={() => handleDeleteItem(item.id)}
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

              {/* Type 2: 细菌通道码字典 */}
              {activeCatalog === '细菌通道码字典' && (
                <table className="w-full text-left border-collapse min-w-[950px]">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 sticky top-0 z-10 select-none">
                    <tr>
                      <th className="px-3.5 py-2.5">仪器设备型号</th>
                      <th className="px-3.5 py-2.5 font-bold">细菌中文名</th>
                      <th className="px-3.5 py-2.5 font-mono">仪器通道码</th>
                      <th className="px-3.5 py-2.5 font-mono">LIS标准对照码</th>
                      <th className="px-3.5 py-2.5">通信说明</th>
                      <th className="px-3.5 py-2.5">操作人</th>
                      <th className="px-3.5 py-2.5 font-mono">操作时间</th>
                      <th className="px-3.5 py-2.5 text-center w-20">状态</th>
                      <th className="px-3.5 py-2.5 text-center w-28">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    {currentBcItems.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="text-center py-16 text-slate-400">
                          暂无符合查询条件的细菌通道码
                        </td>
                      </tr>
                    ) : (
                      currentBcItems.map((item) => (
                        <tr
                          key={item.id}
                          className={`hover:bg-sky-50/60 transition-colors ${
                            editingId === item.id ? 'bg-sky-50/50 font-medium' : ''
                          }`}
                        >
                          <td className="px-3.5 py-2.5 text-slate-700">{item.instrumentName}</td>
                          <td className="px-3.5 py-2.5 font-bold text-slate-900">
                            {item.organismName}
                          </td>
                          <td className="px-3.5 py-2.5 font-mono font-bold text-sky-700">
                            {item.channelCode}
                          </td>
                          <td className="px-3.5 py-2.5 font-mono text-slate-600">{item.lisCode}</td>
                          <td className="px-3.5 py-2.5 text-slate-500">{item.remarks}</td>
                          <td className="px-3.5 py-2.5 text-slate-800 font-medium">
                            {item.operator}
                          </td>
                          <td className="px-3.5 py-2.5 font-mono text-slate-500 text-[11px]">
                            {item.operateTime}
                          </td>
                          <td className="px-3.5 py-2.5 text-center">
                            <button
                              onClick={() => handleToggleStatus(item.id)}
                              className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer mx-auto ${
                                item.isEnabled ? 'bg-sky-600' : 'bg-slate-300'
                              }`}
                            >
                              <div
                                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                                  item.isEnabled ? 'translate-x-5' : 'translate-x-0'
                                }`}
                              />
                            </button>
                          </td>
                          <td className="px-3.5 py-2.5 text-center whitespace-nowrap">
                            <button
                              onClick={() => handleEditItem(item)}
                              className="text-sky-600 hover:text-sky-800 font-medium mr-3"
                            >
                              编辑
                            </button>
                            <button
                              onClick={() => handleDeleteItem(item.id)}
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

              {/* Type 3: 抗生素通道码字典 */}
              {activeCatalog === '抗生素通道码字典' && (
                <table className="w-full text-left border-collapse min-w-[950px]">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 sticky top-0 z-10 select-none">
                    <tr>
                      <th className="px-3.5 py-2.5">仪器药敏卡型号</th>
                      <th className="px-3.5 py-2.5 font-bold">抗生素名称</th>
                      <th className="px-3.5 py-2.5 font-mono">通道代号</th>
                      <th className="px-3.5 py-2.5 font-mono">WHONET代码</th>
                      <th className="px-3.5 py-2.5 font-mono text-slate-700">浓度范围</th>
                      <th className="px-3.5 py-2.5">操作人</th>
                      <th className="px-3.5 py-2.5 font-mono">操作时间</th>
                      <th className="px-3.5 py-2.5 text-center w-20">状态</th>
                      <th className="px-3.5 py-2.5 text-center w-28">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    {currentAcItems.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="text-center py-16 text-slate-400">
                          暂无符合查询条件的抗生素通道码
                        </td>
                      </tr>
                    ) : (
                      currentAcItems.map((item) => (
                        <tr
                          key={item.id}
                          className={`hover:bg-sky-50/60 transition-colors ${
                            editingId === item.id ? 'bg-sky-50/50 font-medium' : ''
                          }`}
                        >
                          <td className="px-3.5 py-2.5 text-slate-700">{item.instrumentName}</td>
                          <td className="px-3.5 py-2.5 font-bold text-slate-900">
                            {item.antibioticName}
                          </td>
                          <td className="px-3.5 py-2.5 font-mono font-bold text-sky-700">
                            {item.channelCode}
                          </td>
                          <td className="px-3.5 py-2.5 font-mono text-slate-600">
                            {item.whonetCode}
                          </td>
                          <td className="px-3.5 py-2.5 font-mono text-slate-700">
                            {item.concentrationRange}
                          </td>
                          <td className="px-3.5 py-2.5 text-slate-800 font-medium">
                            {item.operator}
                          </td>
                          <td className="px-3.5 py-2.5 font-mono text-slate-500 text-[11px]">
                            {item.operateTime}
                          </td>
                          <td className="px-3.5 py-2.5 text-center">
                            <button
                              onClick={() => handleToggleStatus(item.id)}
                              className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer mx-auto ${
                                item.isEnabled ? 'bg-sky-600' : 'bg-slate-300'
                              }`}
                            >
                              <div
                                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                                  item.isEnabled ? 'translate-x-5' : 'translate-x-0'
                                }`}
                              />
                            </button>
                          </td>
                          <td className="px-3.5 py-2.5 text-center whitespace-nowrap">
                            <button
                              onClick={() => handleEditItem(item)}
                              className="text-sky-600 hover:text-sky-800 font-medium mr-3"
                            >
                              编辑
                            </button>
                            <button
                              onClick={() => handleDeleteItem(item.id)}
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

              {/* Type 4: 手工药敏组 */}
              {activeCatalog === '手工药敏组' && (
                <table className="w-full text-left border-collapse min-w-[950px]">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 sticky top-0 z-10 select-none">
                    <tr>
                      <th className="px-3.5 py-2.5 font-mono w-28">组别编码</th>
                      <th className="px-3.5 py-2.5 font-bold w-48">药敏组合名称</th>
                      <th className="px-3.5 py-2.5 w-44">适用菌群</th>
                      <th className="px-3.5 py-2.5">包含抗生素清单</th>
                      <th className="px-3.5 py-2.5">操作人</th>
                      <th className="px-3.5 py-2.5 font-mono">操作时间</th>
                      <th className="px-3.5 py-2.5 text-center w-20">状态</th>
                      <th className="px-3.5 py-2.5 text-center w-28">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    {currentAgItems.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="text-center py-16 text-slate-400">
                          暂无符合查询条件的手工药敏组
                        </td>
                      </tr>
                    ) : (
                      currentAgItems.map((item) => (
                        <tr
                          key={item.id}
                          className={`hover:bg-sky-50/60 transition-colors ${
                            editingId === item.id ? 'bg-sky-50/50 font-medium' : ''
                          }`}
                        >
                          <td className="px-3.5 py-2.5 font-mono font-bold text-sky-800">
                            {item.groupCode}
                          </td>
                          <td className="px-3.5 py-2.5 font-bold text-slate-900">
                            {item.groupName}
                          </td>
                          <td className="px-3.5 py-2.5 text-slate-700">{item.targetOrganisms}</td>
                          <td className="px-3.5 py-2.5 text-slate-600 text-[11px] leading-relaxed">
                            {item.antibioticsList}
                          </td>
                          <td className="px-3.5 py-2.5 text-slate-800 font-medium">
                            {item.operator}
                          </td>
                          <td className="px-3.5 py-2.5 font-mono text-slate-500 text-[11px]">
                            {item.operateTime}
                          </td>
                          <td className="px-3.5 py-2.5 text-center">
                            <button
                              onClick={() => handleToggleStatus(item.id)}
                              className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer mx-auto ${
                                item.isEnabled ? 'bg-sky-600' : 'bg-slate-300'
                              }`}
                            >
                              <div
                                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                                  item.isEnabled ? 'translate-x-5' : 'translate-x-0'
                                }`}
                              />
                            </button>
                          </td>
                          <td className="px-3.5 py-2.5 text-center whitespace-nowrap">
                            <button
                              onClick={() => handleEditItem(item)}
                              className="text-sky-600 hover:text-sky-800 font-medium mr-3"
                            >
                              编辑
                            </button>
                            <button
                              onClick={() => handleDeleteItem(item.id)}
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

              {/* Type 5: 操作字典 */}
              {activeCatalog === '操作字典' && (
                <table className="w-full text-left border-collapse min-w-[950px]">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 sticky top-0 z-10 select-none">
                    <tr>
                      <th className="px-3.5 py-2.5 w-28">操作类别</th>
                      <th className="px-3.5 py-2.5 font-mono w-28">操作编码</th>
                      <th className="px-3.5 py-2.5 font-bold">操作规程名称</th>
                      <th className="px-3.5 py-2.5 font-mono w-28">标准耗时</th>
                      <th className="px-3.5 py-2.5">质量控制备注</th>
                      <th className="px-3.5 py-2.5">维护人员</th>
                      <th className="px-3.5 py-2.5 font-mono">操作时间</th>
                      <th className="px-3.5 py-2.5 text-center w-20">状态</th>
                      <th className="px-3.5 py-2.5 text-center w-28">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    {currentOpItems.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="text-center py-16 text-slate-400">
                          暂无符合查询条件的操作字典
                        </td>
                      </tr>
                    ) : (
                      currentOpItems.map((item) => (
                        <tr
                          key={item.id}
                          className={`hover:bg-sky-50/60 transition-colors ${
                            editingId === item.id ? 'bg-sky-50/50 font-medium' : ''
                          }`}
                        >
                          <td className="px-3.5 py-2.5">
                            <span className="px-2 py-0.5 rounded text-[11px] bg-slate-100 text-slate-800 font-medium">
                              {item.opType}
                            </span>
                          </td>
                          <td className="px-3.5 py-2.5 font-mono font-bold text-sky-800">
                            {item.opCode}
                          </td>
                          <td className="px-3.5 py-2.5 font-bold text-slate-900">{item.opName}</td>
                          <td className="px-3.5 py-2.5 font-mono text-slate-700">
                            {item.standardDuration}
                          </td>
                          <td className="px-3.5 py-2.5 text-slate-500">{item.remarks}</td>
                          <td className="px-3.5 py-2.5 text-slate-800 font-medium">
                            {item.operator}
                          </td>
                          <td className="px-3.5 py-2.5 font-mono text-slate-500 text-[11px]">
                            {item.operateTime}
                          </td>
                          <td className="px-3.5 py-2.5 text-center">
                            <button
                              onClick={() => handleToggleStatus(item.id)}
                              className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors cursor-pointer mx-auto ${
                                item.isEnabled ? 'bg-sky-600' : 'bg-slate-300'
                              }`}
                            >
                              <div
                                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                                  item.isEnabled ? 'translate-x-5' : 'translate-x-0'
                                }`}
                              />
                            </button>
                          </td>
                          <td className="px-3.5 py-2.5 text-center whitespace-nowrap">
                            <button
                              onClick={() => handleEditItem(item)}
                              className="text-sky-600 hover:text-sky-800 font-medium mr-3"
                            >
                              编辑
                            </button>
                            <button
                              onClick={() => handleDeleteItem(item.id)}
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

            {/* Pagination Bar (Strictly 10 items/page) */}
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
      </div>
    </div>
  );
};
