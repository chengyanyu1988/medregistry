import React, { useState, useMemo } from 'react';
import {
  RegionalMappingItem,
  RegionalSpecimenMappingItem,
  INITIAL_REGIONAL_MAPPINGS,
  INITIAL_SPECIMEN_MAPPINGS,
  REGIONAL_PARTNERS,
  RECEIVING_HOSPITALS,
  CENTRAL_STANDARD_ITEMS,
  CENTRAL_STANDARD_SPECIMENS,
  RegionalPartner,
  CentralStandardItem,
  CentralStandardSpecimen
} from '../../data/regionalLabData';
import { UserProfile } from '../../types/navigation';
import {
  Search,
  Filter,
  RefreshCw,
  Plus,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  Download,
  Upload,
  Link2,
  Link2Off,
  Edit2,
  Trash2,
  Building2,
  SlidersHorizontal,
  X,
  Check,
  Save,
  FileText,
  Boxes,
  HelpCircle,
  Play
} from '../MenuIcon';

interface RegionalMappingViewProps {
  user: UserProfile;
  triggerAction: (text: string) => void;
}

type MappingType = 'apply_item' | 'specimen_type';

export const RegionalMappingView: React.FC<RegionalMappingViewProps> = ({
  user,
  triggerAction,
}) => {
  // Left side category toggle (申请项目 vs 标本类型)
  const [activeMappingType, setActiveMappingType] = useState<MappingType>('apply_item');

  // Top header selectors
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>('P01');
  const [selectedReceivingId, setSelectedReceivingId] = useState<string>('REC-01');

  // Datasets
  const [itemMappings, setItemMappings] = useState<RegionalMappingItem[]>(INITIAL_REGIONAL_MAPPINGS);
  const [specimenMappings, setSpecimenMappings] = useState<RegionalSpecimenMappingItem[]>(INITIAL_SPECIMEN_MAPPINGS);

  // Filters & search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'matched' | 'unmatched'>('all');

  // Modals state
  const [isAutoMatchModalOpen, setIsAutoMatchModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItemRecord, setEditingItemRecord] = useState<Partial<RegionalMappingItem> | null>(null);
  const [editingSpecimenRecord, setEditingSpecimenRecord] = useState<Partial<RegionalSpecimenMappingItem> | null>(null);

  // Import modal drag & drop state
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [importConflictStrategy, setImportConflictStrategy] = useState<'overwrite' | 'skip'>('skip');

  // Current partner info
  const currentPartner = useMemo(() => {
    return REGIONAL_PARTNERS.find((p) => p.id === selectedPartnerId) || REGIONAL_PARTNERS[0];
  }, [selectedPartnerId]);

  // Current receiving hospital info
  const currentReceiving = useMemo(() => {
    return RECEIVING_HOSPITALS.find((r) => r.id === selectedReceivingId) || RECEIVING_HOSPITALS[0];
  }, [selectedReceivingId]);

  // Filtered Item mappings
  const filteredItemMappings = useMemo(() => {
    return itemMappings.filter((item) => {
      if (item.partnerId !== selectedPartnerId) return false;
      if (statusFilter !== 'all' && item.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const match =
          item.partnerItemName.toLowerCase().includes(q) ||
          item.partnerItemCode.toLowerCase().includes(q) ||
          item.centerItemName.toLowerCase().includes(q) ||
          item.centerItemCode.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [itemMappings, selectedPartnerId, statusFilter, searchQuery]);

  // Filtered Specimen mappings
  const filteredSpecimenMappings = useMemo(() => {
    return specimenMappings.filter((item) => {
      if (item.partnerId !== selectedPartnerId) return false;
      if (statusFilter !== 'all' && item.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const match =
          item.partnerSpecimenName.toLowerCase().includes(q) ||
          item.partnerSpecimenCode.toLowerCase().includes(q) ||
          item.centerSpecimenName.toLowerCase().includes(q) ||
          item.centerSpecimenCode.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [specimenMappings, selectedPartnerId, statusFilter, searchQuery]);

  // Statistics for top progress
  const itemStats = useMemo(() => {
    const forPartner = itemMappings.filter((m) => m.partnerId === selectedPartnerId);
    const total = forPartner.length;
    const matched = forPartner.filter((m) => m.status === 'matched').length;
    const unmatched = total - matched;
    const rate = total > 0 ? ((matched / total) * 100).toFixed(1) : '0';
    return { total, matched, unmatched, rate };
  }, [itemMappings, selectedPartnerId]);

  const specimenStats = useMemo(() => {
    const forPartner = specimenMappings.filter((m) => m.partnerId === selectedPartnerId);
    const total = forPartner.length;
    const matched = forPartner.filter((m) => m.status === 'matched').length;
    const unmatched = total - matched;
    const rate = total > 0 ? ((matched / total) * 100).toFixed(1) : '0';
    return { total, matched, unmatched, rate };
  }, [specimenMappings, selectedPartnerId]);

  // Handle in-place dropdown change for "接收医院项目名称" / "接收医院项目编码"
  const handleItemCenterNameChange = (id: string, centerName: string) => {
    const matchedCenter = CENTRAL_STANDARD_ITEMS.find((c) => c.name === centerName);
    setItemMappings((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              centerItemName: centerName,
              centerItemCode: matchedCenter ? matchedCenter.code : m.centerItemCode,
              status: centerName ? 'matched' : 'unmatched',
              reviewer: user.name,
              updateTime: '2026-10-30 09:30',
            }
          : m
      )
    );
  };

  const handleItemCenterCodeChange = (id: string, centerCode: string) => {
    const matchedCenter = CENTRAL_STANDARD_ITEMS.find((c) => c.code === centerCode);
    setItemMappings((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              centerItemCode: centerCode,
              centerItemName: matchedCenter ? matchedCenter.name : m.centerItemName,
              status: centerCode ? 'matched' : 'unmatched',
              reviewer: user.name,
              updateTime: '2026-10-30 09:30',
            }
          : m
      )
    );
  };

  // Handle in-place dropdown change for Specimen Types
  const handleSpecimenCenterNameChange = (id: string, centerSpecimenName: string) => {
    const matchedCenter = CENTRAL_STANDARD_SPECIMENS.find((c) => c.name === centerSpecimenName);
    setSpecimenMappings((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              centerSpecimenName: centerSpecimenName,
              centerSpecimenCode: matchedCenter ? matchedCenter.code : m.centerSpecimenCode,
              tubeType: matchedCenter ? matchedCenter.tubeType : m.tubeType,
              status: centerSpecimenName ? 'matched' : 'unmatched',
              reviewer: user.name,
              updateTime: '2026-10-30 09:35',
            }
          : m
      )
    );
  };

  const handleSpecimenCenterCodeChange = (id: string, centerSpecimenCode: string) => {
    const matchedCenter = CENTRAL_STANDARD_SPECIMENS.find((c) => c.code === centerSpecimenCode);
    setSpecimenMappings((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              centerSpecimenCode: centerSpecimenCode,
              centerSpecimenName: matchedCenter ? matchedCenter.name : m.centerSpecimenName,
              tubeType: matchedCenter ? matchedCenter.tubeType : m.tubeType,
              status: centerSpecimenCode ? 'matched' : 'unmatched',
              reviewer: user.name,
              updateTime: '2026-10-30 09:35',
            }
          : m
      )
    );
  };

  // Button 1: 对照 (Automatic match & wizard)
  const handleTriggerAutoMatch = () => {
    setIsAutoMatchModalOpen(true);
  };

  const handleApplyAutoMatch = () => {
    if (activeMappingType === 'apply_item') {
      let matchedCount = 0;
      setItemMappings((prev) =>
        prev.map((m) => {
          if (m.partnerId === selectedPartnerId && (!m.centerItemCode || m.status === 'unmatched')) {
            matchedCount++;
            return {
              ...m,
              centerItemCode: '10025',
              centerItemName: '心肌酶谱五项',
              status: 'matched',
              reviewer: user.name,
              updateTime: '2026-10-30 09:40',
            };
          }
          return m;
        })
      );
      triggerAction(`智能匹配引擎已成功自动建立 ${matchedCount || 2} 项申请项目对照规则！`);
    } else {
      let matchedCount = 0;
      setSpecimenMappings((prev) =>
        prev.map((m) => {
          if (m.partnerId === selectedPartnerId && (!m.centerSpecimenCode || m.status === 'unmatched')) {
            matchedCount++;
            return {
              ...m,
              centerSpecimenCode: 'SPEC_11',
              centerSpecimenName: '胸腔/腹腔积液',
              tubeType: '无菌抗凝管',
              status: 'matched',
              reviewer: user.name,
              updateTime: '2026-10-30 09:40',
            };
          }
          return m;
        })
      );
      triggerAction(`智能匹配引擎已成功建立 ${matchedCount || 1} 项标本类型对照！`);
    }
    setIsAutoMatchModalOpen(false);
  };

  // Button 2: 保存 (Save)
  const handleSaveAll = () => {
    const count =
      activeMappingType === 'apply_item'
        ? filteredItemMappings.length
        : filteredSpecimenMappings.length;
    triggerAction(
      `已成功保存【${currentPartner.name}】与【${currentReceiving.name}】的 ${count} 条对照规则，并实时推送到医联体中间件网关！`
    );
  };

  // Button 3: 导入 (Import)
  const handleOpenImport = () => {
    setSelectedFile('城东社卫2026第四季度检验字典对照表.xlsx');
    setIsImportModalOpen(true);
  };

  const handleConfirmImport = (e: React.FormEvent) => {
    e.preventDefault();
    setIsImportModalOpen(false);
    triggerAction(`已成功从外部字典文件导入 16 项对照字典并自动更新！`);
  };

  // Open Edit Single Item modal
  const handleOpenEditItem = (item: RegionalMappingItem) => {
    setEditingItemRecord({ ...item });
    setIsEditModalOpen(true);
  };

  const handleSaveEditItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItemRecord) return;
    setItemMappings((prev) =>
      prev.map((m) =>
        m.id === editingItemRecord.id
          ? ({
              ...m,
              ...editingItemRecord,
              reviewer: user.name,
              updateTime: '2026-10-30 09:45',
            } as RegionalMappingItem)
          : m
      )
    );
    setIsEditModalOpen(false);
    setEditingItemRecord(null);
    triggerAction(`项目 [${editingItemRecord.partnerItemName}] 对照规则已更新`);
  };

  // Clear mapping
  const handleClearItem = (id: string, name: string) => {
    setItemMappings((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              centerItemCode: '',
              centerItemName: '待对照中心项目',
              status: 'unmatched',
              reviewer: user.name,
              updateTime: '2026-10-30 09:45',
            }
          : m
      )
    );
    triggerAction(`项目 [${name}] 已解除中心对照关系`);
  };

  const handleClearSpecimen = (id: string, name: string) => {
    setSpecimenMappings((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              centerSpecimenCode: '',
              centerSpecimenName: '待对照标本类型',
              status: 'unmatched',
              reviewer: user.name,
              updateTime: '2026-10-30 09:45',
            }
          : m
      )
    );
    triggerAction(`标本类型 [${name}] 已解除中心对照关系`);
  };

  return (
    <div className="flex-1 flex h-full min-h-0 bg-slate-100 overflow-hidden">
      {/* =========================================================================
          LEFT SIDEBAR: 对照类型 (Matches user screenshot: 申请项目 / 标本类型)
          ========================================================================= */}
      <div className="w-56 bg-white border-r border-slate-200 flex flex-col shrink-0 shadow-2xs">
        {/* Header */}
        <div className="p-3.5 border-b border-slate-200 bg-slate-50/60">
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm text-sky-700 tracking-wide flex items-center gap-1.5">
              <SlidersHorizontal className="w-4 h-4 text-sky-600" />
              <span>对照类型</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono">2大分类</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 leading-snug">
            点击切换左侧分类，右侧列表同步刷新
          </p>
        </div>

        {/* Category Items List */}
        <div className="p-2 space-y-1.5 flex-1 overflow-y-auto">
          {/* 1. 申请项目 */}
          <div
            onClick={() => {
              setActiveMappingType('apply_item');
              triggerAction('已切换至：申请项目对照列表');
            }}
            className={`flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-all ${
              activeMappingType === 'apply_item'
                ? 'bg-sky-50 text-sky-800 font-bold border border-sky-200 shadow-xs'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-transparent'
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <FileText
                className={`w-4 h-4 shrink-0 ${
                  activeMappingType === 'apply_item' ? 'text-sky-600' : 'text-slate-400'
                }`}
              />
              <span className="truncate text-xs">申请项目</span>
            </div>
            <span
              className={`text-[11px] px-1.5 py-0.2 rounded-full font-mono ${
                activeMappingType === 'apply_item'
                  ? 'bg-sky-200/80 text-sky-900 font-semibold'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              {itemStats.total}
            </span>
          </div>

          {/* 2. 标本类型 */}
          <div
            onClick={() => {
              setActiveMappingType('specimen_type');
              triggerAction('已切换至：标本类型对照列表');
            }}
            className={`flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-all ${
              activeMappingType === 'specimen_type'
                ? 'bg-sky-50 text-sky-800 font-bold border border-sky-200 shadow-xs'
                : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-transparent'
            }`}
          >
            <div className="flex items-center gap-2 min-w-0">
              <Boxes
                className={`w-4 h-4 shrink-0 ${
                  activeMappingType === 'specimen_type' ? 'text-sky-600' : 'text-slate-400'
                }`}
              />
              <span className="truncate text-xs">标本类型</span>
            </div>
            <span
              className={`text-[11px] px-1.5 py-0.2 rounded-full font-mono ${
                activeMappingType === 'specimen_type'
                  ? 'bg-sky-200/80 text-sky-900 font-semibold'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              {specimenStats.total}
            </span>
          </div>
        </div>

        {/* Bottom Partner Mini Status Card */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 text-xs space-y-1.5">
          <div className="text-[11px] text-slate-500">当前对照匹配率</div>
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-800 font-mono text-sm">
              {activeMappingType === 'apply_item' ? itemStats.rate : specimenStats.rate}%
            </span>
            <span className="text-[10px] text-emerald-600 font-medium">双向接口畅通</span>
          </div>
          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-sky-600 h-full rounded-full transition-all duration-300"
              style={{
                width: `${activeMappingType === 'apply_item' ? itemStats.rate : specimenStats.rate}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* =========================================================================
          RIGHT MAIN AREA: Header with 送检医院, 接收医院, 对照, 保存, 导入
          ========================================================================= */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden bg-white">
        {/* 1. Top Bar from Screenshot (送检医院 / 接收医院 / 对照 / 保存 / 导入) */}
        <div className="px-5 py-3 border-b border-slate-200 bg-white flex flex-wrap items-center justify-between gap-3 shrink-0 shadow-2xs">
          <div className="flex flex-wrap items-center gap-4 text-xs">
            {/* 送检医院 Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-slate-600 font-medium whitespace-nowrap">送检医院</span>
              <select
                value={selectedPartnerId}
                onChange={(e) => setSelectedPartnerId(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded px-3 py-1.5 text-slate-800 font-medium focus:outline-hidden focus:border-sky-500 focus:bg-white text-xs min-w-[190px]"
              >
                {REGIONAL_PARTNERS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 接收医院 Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-slate-600 font-medium whitespace-nowrap">接收医院</span>
              <select
                value={selectedReceivingId}
                onChange={(e) => setSelectedReceivingId(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded px-3 py-1.5 text-slate-800 font-medium focus:outline-hidden focus:border-sky-500 focus:bg-white text-xs min-w-[210px]"
              >
                {RECEIVING_HOSPITALS.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Three Main Action Buttons matching screenshot exactly: 对照 / 保存 / 导入 */}
          <div className="flex items-center gap-2.5">
            {/* Button 1: 对照 (Solid Blue) */}
            <button
              onClick={handleTriggerAutoMatch}
              className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded font-medium text-xs shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Link2 className="w-3.5 h-3.5" />
              <span>对照</span>
            </button>

            {/* Button 2: 保存 (White with blue border) */}
            <button
              onClick={handleSaveAll}
              className="px-4 py-1.5 bg-white hover:bg-sky-50 text-sky-700 border border-sky-600 rounded font-medium text-xs shadow-2xs transition-colors flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5 text-sky-600" />
              <span>保存</span>
            </button>

            {/* Button 3: 导入 (White with blue border) */}
            <button
              onClick={handleOpenImport}
              className="px-4 py-1.5 bg-white hover:bg-sky-50 text-sky-700 border border-sky-600 rounded font-medium text-xs shadow-2xs transition-colors flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5 text-sky-600" />
              <span>导入</span>
            </button>

            {/* Additional Power user Export */}
            <button
              onClick={() =>
                triggerAction(
                  `已导出《${currentPartner.name}对照字典(${
                    activeMappingType === 'apply_item' ? '项目' : '标本'
                  }).xlsx》`
                )
              }
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded border border-slate-200"
              title="导出当前对照表"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 2. Secondary Filter & Section Header */}
        <div className="px-5 py-2.5 bg-slate-50/80 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0 text-xs">
          {/* Title matching screenshot: 项目列表 (or 标本类型列表) */}
          <div className="flex items-center gap-2">
            <span className="font-bold text-sky-700 text-sm">
              {activeMappingType === 'apply_item' ? '项目列表' : '标本类型列表'}
            </span>
            <span className="text-slate-400 font-mono">
              (共{' '}
              {activeMappingType === 'apply_item'
                ? filteredItemMappings.length
                : filteredSpecimenMappings.length}{' '}
              项)
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Filter by status */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">状态：</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="bg-white border border-slate-300 rounded px-2 py-0.5 text-slate-700 text-xs focus:outline-hidden"
              >
                <option value="all">全部</option>
                <option value="matched">已对照</option>
                <option value="unmatched">未对照</option>
              </select>
            </div>

            {/* Search Box */}
            <div className="relative w-56">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="搜索编码、名称..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-2.5 py-1 bg-white border border-slate-300 rounded text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-sky-500 text-xs"
              />
            </div>
          </div>
        </div>

        {/* 3. Main Data Table: In-place editable dropdowns just like screenshot */}
        <div className="flex-1 overflow-auto min-h-0">
          {activeMappingType === 'apply_item' ? (
            /* 3.1 申请项目列表 */
            <table className="w-full border-collapse text-left text-xs text-slate-700">
              <thead className="bg-slate-100/90 text-slate-700 font-semibold sticky top-0 z-10 border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3 w-10 text-center font-mono">#</th>
                  <th className="py-2.5 px-3 w-40">送检医院项目编码</th>
                  <th className="py-2.5 px-3 w-56">送检医院项目名称</th>
                  <th className="py-2.5 px-3 w-64 text-sky-800 bg-sky-50/40">接收医院项目名称</th>
                  <th className="py-2.5 px-3 w-44 text-sky-800 bg-sky-50/40">接收医院项目编码</th>
                  <th className="py-2.5 px-3">标本类型</th>
                  <th className="py-2.5 px-3 text-center">互认级别</th>
                  <th className="py-2.5 px-3 text-center">状态</th>
                  <th className="py-2.5 px-3">核对人 / 时间</th>
                  <th className="py-2.5 px-3 text-center w-24">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {filteredItemMappings.map((row, idx) => {
                  const isMatched = row.status === 'matched';

                  return (
                    <tr
                      key={row.id}
                      className={`hover:bg-sky-50/30 transition-colors ${
                        !isMatched ? 'bg-amber-50/20' : ''
                      }`}
                    >
                      <td className="py-2 px-3 text-center font-mono text-slate-400">{idx + 1}</td>
                      {/* 送检医院项目编码 (如 0021) */}
                      <td className="py-2 px-3 font-mono font-medium text-slate-900">
                        {row.partnerItemCode}
                      </td>
                      {/* 送检医院项目名称 (如 血常规) */}
                      <td className="py-2 px-3 font-semibold text-slate-900">
                        {row.partnerItemName}
                      </td>
                      {/* 接收医院项目名称 - Interactive Select Dropdown matching screenshot */}
                      <td className="py-2 px-3 bg-sky-50/20">
                        <select
                          value={row.centerItemName}
                          onChange={(e) => handleItemCenterNameChange(row.id, e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs text-slate-900 font-medium focus:outline-hidden focus:border-sky-500 focus:ring-1 focus:ring-sky-200"
                        >
                          <option value="">-- 选择接收医院对应项目 --</option>
                          {CENTRAL_STANDARD_ITEMS.map((c) => (
                            <option key={c.code} value={c.name}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      {/* 接收医院项目编码 - Interactive Select Dropdown matching screenshot */}
                      <td className="py-2 px-3 bg-sky-50/20">
                        <select
                          value={row.centerItemCode}
                          onChange={(e) => handleItemCenterCodeChange(row.id, e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs font-mono font-semibold text-sky-800 focus:outline-hidden focus:border-sky-500 focus:ring-1 focus:ring-sky-200"
                        >
                          <option value="">-- 代码 --</option>
                          {CENTRAL_STANDARD_ITEMS.map((c) => (
                            <option key={c.code} value={c.code}>
                              {c.code} - {c.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-2 px-3">
                        <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-mono">
                          {row.specimenType}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-center">
                        <span
                          className={`inline-block px-1.5 py-0.5 rounded text-[11px] font-medium border ${
                            row.mutualRecogLevel === '全国互认'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : row.mutualRecogLevel === '省内互认'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}
                        >
                          {row.mutualRecogLevel}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-center">
                        {isMatched ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] bg-emerald-50 text-emerald-700 font-medium border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            已对照
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] bg-amber-50 text-amber-700 font-medium border border-amber-200">
                            <Link2Off className="w-3 h-3 text-amber-600" />
                            未对照
                          </span>
                        )}
                      </td>
                      <td className="py-2 px-3 text-[11px]">
                        <div className="text-slate-800 font-medium">{row.reviewer}</div>
                        <div className="text-slate-400 font-mono">{row.updateTime}</div>
                      </td>
                      <td className="py-2 px-3 text-center space-x-1">
                        <button
                          onClick={() => handleOpenEditItem(row)}
                          className="p-1 text-sky-600 hover:text-sky-800 hover:bg-sky-50 rounded"
                          title="编辑详细参数"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleClearItem(row.id, row.partnerItemName)}
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                          title="清除对照"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {filteredItemMappings.length === 0 && (
                  <tr>
                    <td colSpan={10} className="py-12 text-center text-slate-400">
                      未查询到符合条件的申请项目对照数据
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : (
            /* 3.2 标本类型列表 (当左侧选择“标本类型”时) */
            <table className="w-full border-collapse text-left text-xs text-slate-700">
              <thead className="bg-slate-100/90 text-slate-700 font-semibold sticky top-0 z-10 border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3 w-10 text-center font-mono">#</th>
                  <th className="py-2.5 px-3 w-40">送检医院标本编码</th>
                  <th className="py-2.5 px-3 w-56">送检医院标本名称</th>
                  <th className="py-2.5 px-3 w-64 text-sky-800 bg-sky-50/40">接收医院标本名称</th>
                  <th className="py-2.5 px-3 w-44 text-sky-800 bg-sky-50/40">接收医院标本编码</th>
                  <th className="py-2.5 px-3">推荐采血管 / 颜色</th>
                  <th className="py-2.5 px-3">运送温控条件</th>
                  <th className="py-2.5 px-3 text-center">状态</th>
                  <th className="py-2.5 px-3">核对人 / 时间</th>
                  <th className="py-2.5 px-3 text-center w-24">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {filteredSpecimenMappings.map((row, idx) => {
                  const isMatched = row.status === 'matched';

                  return (
                    <tr
                      key={row.id}
                      className={`hover:bg-sky-50/30 transition-colors ${
                        !isMatched ? 'bg-amber-50/20' : ''
                      }`}
                    >
                      <td className="py-2 px-3 text-center font-mono text-slate-400">{idx + 1}</td>
                      <td className="py-2 px-3 font-mono font-medium text-slate-900">
                        {row.partnerSpecimenCode}
                      </td>
                      <td className="py-2 px-3 font-semibold text-slate-900">
                        {row.partnerSpecimenName}
                      </td>
                      {/* 接收医院标本名称 - Dropdown */}
                      <td className="py-2 px-3 bg-sky-50/20">
                        <select
                          value={row.centerSpecimenName}
                          onChange={(e) => handleSpecimenCenterNameChange(row.id, e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs text-slate-900 font-medium focus:outline-hidden focus:border-sky-500 focus:ring-1 focus:ring-sky-200"
                        >
                          <option value="">-- 选择接收医院标本类型 --</option>
                          {CENTRAL_STANDARD_SPECIMENS.map((c) => (
                            <option key={c.code} value={c.name}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      {/* 接收医院标本编码 - Dropdown */}
                      <td className="py-2 px-3 bg-sky-50/20">
                        <select
                          value={row.centerSpecimenCode}
                          onChange={(e) => handleSpecimenCenterCodeChange(row.id, e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs font-mono font-semibold text-sky-800 focus:outline-hidden focus:border-sky-500 focus:ring-1 focus:ring-sky-200"
                        >
                          <option value="">-- 标本代码 --</option>
                          {CENTRAL_STANDARD_SPECIMENS.map((c) => (
                            <option key={c.code} value={c.code}>
                              {c.code} - {c.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-2 px-3">
                        <span className="font-medium text-slate-800">{row.tubeType}</span>
                      </td>
                      <td className="py-2 px-3">
                        <span className="text-[11px] font-mono text-slate-600">
                          {row.transportCondition}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-center">
                        {isMatched ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] bg-emerald-50 text-emerald-700 font-medium border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            已对照
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] bg-amber-50 text-amber-700 font-medium border border-amber-200">
                            <Link2Off className="w-3 h-3 text-amber-600" />
                            未对照
                          </span>
                        )}
                      </td>
                      <td className="py-2 px-3 text-[11px]">
                        <div className="text-slate-800 font-medium">{row.reviewer}</div>
                        <div className="text-slate-400 font-mono">{row.updateTime}</div>
                      </td>
                      <td className="py-2 px-3 text-center space-x-1">
                        <button
                          onClick={() => handleClearSpecimen(row.id, row.partnerSpecimenName)}
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                          title="清除对照"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {filteredSpecimenMappings.length === 0 && (
                  <tr>
                    <td colSpan={10} className="py-12 text-center text-slate-400">
                      未查询到符合条件的标本类型对照数据
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* =========================================================================
          MODAL 1: 智能对照匹配向导 (Triggered by '对照' button)
          ========================================================================= */}
      {isAutoMatchModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-scaleIn">
            <div className="bg-sky-600 text-white px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Link2 className="w-4 h-4 text-white" />
                <span className="font-semibold text-sm">区域检验智能对照匹配向导</span>
              </div>
              <button
                onClick={() => setIsAutoMatchModalOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="p-3 bg-sky-50 rounded-lg border border-sky-200 space-y-1.5">
                <div className="flex items-center justify-between text-sky-900 font-semibold">
                  <span>送检医院：{currentPartner.name}</span>
                  <span>接收医院：{currentReceiving.name}</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  系统将依据项目名称拼音字头、国家临床检验项目目录编码（LOINC）与标本类型进行多维度模糊推理与自动映射。
                </p>
              </div>

              <div className="space-y-2">
                <label className="font-semibold text-slate-800 block">匹配策略配置</label>
                <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded text-sky-600" />
                  <span>启用标准名称拼音模糊匹配（相似度阈值 &gt; 85%）</span>
                </label>
                <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded text-sky-600" />
                  <span>自动匹配对应标本采血管类型（黄头/紫头/蓝头）</span>
                </label>
                <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded text-sky-600" />
                  <span>自动继承国家卫生健康委区域检验互认标识</span>
                </label>
              </div>

              <div className="p-3 bg-slate-50 rounded border border-slate-200 flex items-center justify-between font-mono">
                <span className="text-slate-600">预估可自动匹配项目数：</span>
                <span className="text-emerald-600 font-bold text-sm">12 / 14 项 (85.7%)</span>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAutoMatchModalOpen(false)}
                  className="px-4 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 font-medium"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={handleApplyAutoMatch}
                  className="px-5 py-1.5 rounded-lg bg-sky-600 text-white font-semibold hover:bg-sky-700 shadow-xs flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>执行智能对照</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: 导入送检医院字典弹窗 (Triggered by '导入' button)
          ========================================================================= */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-scaleIn">
            <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4 text-sky-400" />
                <span className="font-semibold text-sm">导入送检医院检验字典</span>
              </div>
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleConfirmImport} className="p-5 space-y-4 text-xs">
              <div className="space-y-1">
                <span className="text-slate-500 block">送检医院：</span>
                <div className="font-bold text-slate-800 text-sm">{currentPartner.name}</div>
              </div>

              {/* Drag and Drop Zone */}
              <div className="border-2 border-dashed border-sky-300 rounded-xl p-5 bg-sky-50/40 text-center hover:bg-sky-50/70 transition-colors cursor-pointer">
                <FileSpreadsheet className="w-8 h-8 text-sky-600 mx-auto mb-2" />
                <div className="font-medium text-slate-800">
                  {selectedFile ? selectedFile : '点击选择或将 Excel / CSV 文件拖拽到此处'}
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  支持 .xlsx, .xls, .csv 格式标准表格
                </p>
              </div>

              {/* Conflict resolution */}
              <div>
                <label className="font-semibold text-slate-800 block mb-1">
                  重复项目冲突处理策略
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <label className="flex items-center gap-2 p-2 rounded border border-slate-200 bg-slate-50 cursor-pointer">
                    <input
                      type="radio"
                      name="strategy"
                      checked={importConflictStrategy === 'skip'}
                      onChange={() => setImportConflictStrategy('skip')}
                      className="text-sky-600"
                    />
                    <span>跳过已存在对照项</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 rounded border border-slate-200 bg-slate-50 cursor-pointer">
                    <input
                      type="radio"
                      name="strategy"
                      checked={importConflictStrategy === 'overwrite'}
                      onChange={() => setImportConflictStrategy('overwrite')}
                      className="text-sky-600"
                    />
                    <span>覆盖更新已有对照</span>
                  </label>
                </div>
              </div>

              {/* Download template */}
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span>尚未准备字典模板？</span>
                <button
                  type="button"
                  onClick={() => triggerAction('已下载《区域送检医院对照导入标准模板.xlsx》')}
                  className="text-sky-600 hover:text-sky-800 font-medium flex items-center gap-1"
                >
                  <Download className="w-3 h-3" />
                  <span>下载标准导入模板</span>
                </button>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(false)}
                  className="px-4 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 font-medium"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 rounded-lg bg-sky-600 text-white font-semibold hover:bg-sky-700 shadow-xs"
                >
                  开始解析并导入
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: 编辑单项对照详细参数
          ========================================================================= */}
      {isEditModalOpen && editingItemRecord && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-scaleIn">
            <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-sky-400" />
                <span className="font-semibold text-sm">编辑项目对照详细参数</span>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditItem} className="p-5 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div>
                  <span className="text-slate-400 text-[11px] block">送检医院编码 / 名称</span>
                  <div className="font-bold text-slate-900">
                    {editingItemRecord.partnerItemCode} · {editingItemRecord.partnerItemName}
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">送检标本类型</span>
                  <div className="font-medium text-slate-800">
                    {editingItemRecord.specimenType}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  接收医院对应标准项目
                </label>
                <select
                  value={editingItemRecord.centerItemName}
                  onChange={(e) => {
                    const sel = CENTRAL_STANDARD_ITEMS.find((c) => c.name === e.target.value);
                    setEditingItemRecord({
                      ...editingItemRecord,
                      centerItemName: e.target.value,
                      centerItemCode: sel ? sel.code : editingItemRecord.centerItemCode,
                    });
                  }}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-slate-800 font-medium focus:outline-hidden focus:border-sky-500"
                >
                  {CENTRAL_STANDARD_ITEMS.map((c) => (
                    <option key={c.code} value={c.name}>
                      {c.code} - {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">互认级别</label>
                  <select
                    value={editingItemRecord.mutualRecogLevel || '全国互认'}
                    onChange={(e) =>
                      setEditingItemRecord({
                        ...editingItemRecord,
                        mutualRecogLevel: e.target.value as any,
                      })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-slate-800"
                  >
                    <option value="全国互认">全国互认</option>
                    <option value="省内互认">省内互认</option>
                    <option value="区域互认">区域互认</option>
                    <option value="院内独立">院内独立</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">转换系数</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingItemRecord.coefficient ?? 1.0}
                    onChange={(e) =>
                      setEditingItemRecord({
                        ...editingItemRecord,
                        coefficient: parseFloat(e.target.value) || 1.0,
                      })
                    }
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-slate-800 font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 font-medium"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 rounded-lg bg-sky-600 text-white font-semibold hover:bg-sky-700 shadow-xs"
                >
                  保存参数
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
