import React, { useState } from 'react';
import {
  StandardStrainItem,
  StandardCryoboxInfo,
  StandardFreezerInfo,
  INITIAL_STANDARD_FREEZER_TREE,
} from '../data/microbiologyStandardStrainData';
import { UserProfile } from '../types/navigation';
import {
  Search,
  RefreshCw,
  Folder,
  FolderOpen,
  ChevronRight,
  ChevronDown,
  ChevronLeft,
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
  CheckSquare,
} from './MenuIcon';

interface MicrobiologyStandardStrainViewProps {
  user?: UserProfile;
  triggerAction: (msg: string) => void;
}

export const MicrobiologyStandardStrainView: React.FC<MicrobiologyStandardStrainViewProps> = ({
  user,
  triggerAction,
}) => {
  // Freezer tree structure & active box
  const [freezer, setFreezer] = useState<StandardFreezerInfo>(INITIAL_STANDARD_FREEZER_TREE);
  const [expandedRacks, setExpandedRacks] = useState<Record<string, boolean>>({
    'rack-01': true,
    'rack-02': true,
    'rack-03': true,
  });
  const [selectedBoxId, setSelectedBoxId] = useState<string>('box-01');

  // Find active box
  const activeBox =
    freezer.racks.flatMap((r) => r.boxes).find((b) => b.id === selectedBoxId) ||
    freezer.racks[0].boxes[0];

  // Master Strains in current box
  const [strains, setStrains] = useState<StandardStrainItem[]>(activeBox.strains);

  // View Mode: 'grid' (孔位图) | 'table' (表格清单)
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Search Filter
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  // Selected strain for the right-side detail MODAL popup ("把右侧显示的改成弹窗展示")
  const [modalStrain, setModalStrain] = useState<StandardStrainItem | null>(null);

  // Auxiliary Modals State
  const [showStoreModal, setShowStoreModal] = useState<boolean>(false);
  const [showRetrieveModal, setShowRetrieveModal] = useState<boolean>(false);
  const [showDestroyModal, setShowDestroyModal] = useState<boolean>(false);
  const [showPassageModal, setShowPassageModal] = useState<boolean>(false);

  // Form states for store strain
  const [targetWell, setTargetWell] = useState<string>('3-1');
  const [newAtccNo, setNewAtccNo] = useState<string>('ATCC 35218');
  const [newBarcode, setNewBarcode] = useState<string>('BC099028');
  const [newChineseName, setNewChineseName] = useState<string>('大肠埃希菌 (β-内酰胺酶抑制剂质控)');
  const [newLatinName, setNewLatinName] = useState<string>('Escherichia coli (TEM-1)');
  const [newCategory, setNewCategory] = useState<StandardStrainItem['strainCategory']>('抗生素药敏质控');
  const [newSourceOrg, setNewSourceOrg] = useState<string>('中国医学科学院病原所 (CMCC)');
  const [newLotNo, setNewLotNo] = useState<string>('LOT-20261010');
  const [newExpiry, setNewExpiry] = useState<string>('2028-10-31');
  const [newMethod, setNewMethod] = useState<string>('脱脂牛奶甘油冷冻管 (-80℃)');

  // Form states for retrieve strain
  const [retrievePurpose, setRetrievePurpose] = useState<string>('CLSI M100 每周常规抗生素药敏质控');
  const [retrieveBorrower, setRetrieveBorrower] = useState<string>(user?.name || '刘浩然检验师');

  // Form states for destroy strain
  const [destroyReason, setDestroyReason] = useState<string>('原管标准株复苏超传代限度且活力衰减');

  // Form states for passage modal
  const [passageNumberInput, setPassageNumberInput] = useState<string>('P2代 (工作子株)');
  const [passagePlateType, setPassagePlateType] = useState<string>('血琼脂平板 (BAP) 纯化培养');

  // Toast message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showLocalNotice = (msg: string) => {
    setToastMessage(msg);
    triggerAction(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Toggle rack collapse
  const toggleRack = (rackId: string) => {
    setExpandedRacks((prev) => ({ ...prev, [rackId]: !prev[rackId] }));
  };

  // Switch Cryobox
  const handleSelectBox = (box: StandardCryoboxInfo) => {
    setSelectedBoxId(box.id);
    setStrains(box.strains);
    showLocalNotice(`已切换至标准菌株盒: ${box.code} (${box.name})`);
  };

  // Filter strains based on search
  const filteredStrains = strains.filter((s) => {
    if (!searchKeyword.trim()) return true;
    const q = searchKeyword.trim().toLowerCase();
    return (
      s.atccNo.toLowerCase().includes(q) ||
      s.strainBarcode.toLowerCase().includes(q) ||
      s.chineseName.toLowerCase().includes(q) ||
      s.latinName.toLowerCase().includes(q) ||
      s.wellCode.toLowerCase().includes(q) ||
      s.sourceOrg.toLowerCase().includes(q)
    );
  });

  // Table pagination state (Strictly 10 items/page)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;
  const totalPages = Math.ceil(filteredStrains.length / pageSize) || 1;
  const currentTableStrains = filteredStrains.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Map strains by well code for fast lookup in grid
  const strainsByWell = new Map<string, StandardStrainItem>();
  strains.forEach((s) => strainsByWell.set(s.wellCode, s));

  // Handler: Click grid cell
  const handleWellClick = (wellCode: string) => {
    const existing = strainsByWell.get(wellCode);
    if (existing) {
      setModalStrain(existing);
    } else {
      // Empty cell clicked -> Quick prompt to store strain
      setTargetWell(wellCode);
      setShowStoreModal(true);
    }
  };

  // Handler: Store Strain submit
  const handleSaveNewStrain = (e: React.FormEvent) => {
    e.preventDefault();
    const newStrainItem: StandardStrainItem = {
      id: `STD-${Date.now()}`,
      wellCode: targetWell,
      atccNo: newAtccNo,
      strainBarcode: newBarcode,
      chineseName: newChineseName,
      latinName: newLatinName,
      strainCategory: newCategory,
      sourceOrg: newSourceOrg,
      lotNo: newLotNo,
      expiryDate: newExpiry,
      storageMethod: newMethod,
      passage: 'P1代 (质控工作株)',
      storagePerson: user?.name || '李晓红主管检验师',
      storageTime: '2026-10-30 11:30:00',
      status: '在库备用',
      storageRecords: [
        {
          id: `sr-${Date.now()}`,
          type: '存放记录',
          operator: user?.name || '李晓红主管检验师',
          time: '2026-10-30 11:30:00',
          purposeOrReason: '标准菌种复苏入库保藏',
          remarks: `存入标准菌株盒 ${activeBox.code} 孔位 [${targetWell}]`,
        },
      ],
      retrievalRecords: [],
      destructionRecords: [],
    };

    setStrains((prev) => [...prev.filter((s) => s.wellCode !== targetWell), newStrainItem]);
    setShowStoreModal(false);
    showLocalNotice(`标准菌株 [${newAtccNo} ${newChineseName}] 已成功存入孔位 [${targetWell}]！`);
  };

  // Handler: Retrieve Strain submit
  const handleRetrieveSubmit = () => {
    if (!modalStrain) return;
    const newRecord = {
      id: `rr-${Date.now()}`,
      type: '取用记录' as const,
      operator: retrieveBorrower,
      time: '2026-10-30 11:35:00',
      purposeOrReason: retrievePurpose,
      remarks: `经办人: ${retrieveBorrower}，取用孔位 ${modalStrain.wellCode}`,
    };

    const updatedStrain: StandardStrainItem = {
      ...modalStrain,
      status: '质控使用中',
      retrievalRecords: [newRecord, ...modalStrain.retrievalRecords],
    };

    setStrains((prev) => prev.map((s) => (s.id === modalStrain.id ? updatedStrain : s)));
    setModalStrain(updatedStrain);
    setShowRetrieveModal(false);
    showLocalNotice(`标准株 [${modalStrain.atccNo}] 取用登记成功！`);
  };

  // Handler: Destroy Strain submit
  const handleDestroySubmit = () => {
    if (!modalStrain) return;
    const newRecord = {
      id: `dr-${Date.now()}`,
      type: '销毁记录' as const,
      operator: user?.name || '郭彩霞主任医师',
      time: '2026-10-30 11:40:00',
      purposeOrReason: destroyReason,
      remarks: '121℃ 30min高压蒸汽灭菌生物无害化销毁',
    };

    const updatedStrain: StandardStrainItem = {
      ...modalStrain,
      status: '已耗尽销毁',
      destructionRecords: [newRecord, ...modalStrain.destructionRecords],
    };

    setStrains((prev) => prev.map((s) => (s.id === modalStrain.id ? updatedStrain : s)));
    setModalStrain(updatedStrain);
    setShowDestroyModal(false);
    showLocalNotice(`标准株 [${modalStrain.atccNo}] 高温高压灭菌销毁记录登记完毕！`);
  };

  // Handler: Passage submit
  const handlePassageSubmit = () => {
    if (!modalStrain) return;
    const newRecord = {
      id: `pr-${Date.now()}`,
      type: '传代复苏' as const,
      operator: user?.name || '刘浩然检验师',
      time: '2026-10-30 11:45:00',
      purposeOrReason: `传代复苏至 ${passageNumberInput}`,
      remarks: `接种培养基: ${passagePlateType}`,
    };

    const updatedStrain: StandardStrainItem = {
      ...modalStrain,
      passage: passageNumberInput,
      retrievalRecords: [newRecord, ...modalStrain.retrievalRecords],
    };

    setStrains((prev) => prev.map((s) => (s.id === modalStrain.id ? updatedStrain : s)));
    setModalStrain(updatedStrain);
    setShowPassageModal(false);
    showLocalNotice(`标准株 [${modalStrain.atccNo}] 传代复苏登记完毕，已更新为 [${passageNumberInput}]！`);
  };

  // Total capacity calculations
  const totalWells = activeBox.rows * activeBox.cols;
  const occupiedCount = strains.length;
  const occupancyRate = ((occupiedCount / totalWells) * 100).toFixed(1);

  return (
    <div className="flex-1 flex h-full bg-slate-100 overflow-hidden text-xs">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 right-8 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2 border border-slate-700 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* 1. Left Sidebar: 容器信息树 (Container Info Tree) */}
      <div className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0">
        <div className="p-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-slate-800">
            <Archive className="w-4 h-4 text-sky-600" />
            <span>容器信息</span>
          </div>
          <span className="text-[10px] bg-sky-100 text-sky-800 font-mono px-1.5 py-0.5 rounded">
            -80℃
          </span>
        </div>

        {/* Tree Structure */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {/* Root node: Freezer */}
          <div>
            <div className="flex items-center gap-1.5 py-1.5 px-2 rounded-md hover:bg-slate-100 cursor-pointer font-bold text-slate-800">
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              <Thermometer className="w-3.5 h-3.5 text-sky-600" />
              <span>{freezer.name}</span>
            </div>

            {/* Racks */}
            <div className="ml-4 border-l border-slate-200 pl-2 space-y-0.5 mt-1">
              {freezer.racks.map((rack) => {
                const isExpanded = !!expandedRacks[rack.id];
                return (
                  <div key={rack.id}>
                    <div
                      onClick={() => toggleRack(rack.id)}
                      className="flex items-center justify-between py-1.5 px-2 rounded hover:bg-slate-100 cursor-pointer text-slate-700 font-medium"
                    >
                      <div className="flex items-center gap-1.5">
                        {rack.boxes.length > 0 ? (
                          isExpanded ? (
                            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                          ) : (
                            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                          )
                        ) : (
                          <span className="w-3.5" />
                        )}
                        {isExpanded ? (
                          <FolderOpen className="w-3.5 h-3.5 text-amber-500" />
                        ) : (
                          <Folder className="w-3.5 h-3.5 text-amber-500" />
                        )}
                        <span>{rack.name}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {rack.boxes.length}盒
                      </span>
                    </div>

                    {/* Boxes inside rack */}
                    {isExpanded && rack.boxes.length > 0 && (
                      <div className="ml-5 border-l border-slate-200 pl-2 space-y-0.5 my-1">
                        {rack.boxes.map((box) => {
                          const isCurrent = box.id === selectedBoxId;
                          return (
                            <button
                              key={box.id}
                              onClick={() => handleSelectBox(box)}
                              className={`w-full text-left py-1.5 px-2 rounded flex items-center justify-between transition-colors ${
                                isCurrent
                                  ? 'bg-sky-50 text-sky-700 font-bold border border-sky-200 shadow-2xs'
                                  : 'text-slate-600 hover:bg-slate-100'
                              }`}
                            >
                              <div className="flex items-center gap-1.5 truncate">
                                <Layers className="w-3 h-3 text-sky-500 shrink-0" />
                                <span className="font-mono text-xs">{box.code}</span>
                              </div>
                              <span className="text-[10px] text-slate-400 shrink-0 font-sans">
                                {box.strains.length}株
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Freezer Specs Footer */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 text-[11px] text-slate-500 space-y-1">
          <div className="flex justify-between">
            <span>温控探头:</span>
            <strong className="text-emerald-700 font-mono">{freezer.temperature}</strong>
          </div>
          <div className="flex justify-between">
            <span>设备用途:</span>
            <span className="font-sans font-medium text-slate-700">国家质控标准品冷藏</span>
          </div>
        </div>
      </div>

      {/* 2. Center/Right Main Workspace Area (Full width, right panel converted to modal) */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* Top Filter & Action Header Strip (Matches Screenshot image_dcd03b02.png) */}
        <div className="bg-white border-b border-slate-200 px-5 py-3 shrink-0 shadow-2xs space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Search Input & Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 flex-1">
              <div className="flex items-center gap-2 text-slate-700 font-semibold whitespace-nowrap">
                <span>菌株信息:</span>
              </div>
              <div className="relative min-w-[240px] max-w-sm flex-1">
                <input
                  type="text"
                  placeholder="条码号/菌株名称/ATCC号/来源..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-sky-500 placeholder-slate-400"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>

              {/* Action Buttons: 存入菌株, 取用菌株, 销毁菌株 */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowStoreModal(true)}
                  className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-md shadow-xs flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>存入菌株</span>
                </button>

                <button
                  onClick={() => {
                    if (filteredStrains.length === 0) {
                      showLocalNotice('当前无可用标准菌株');
                      return;
                    }
                    setModalStrain(filteredStrains[0]);
                    setShowRetrieveModal(true);
                  }}
                  className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-medium rounded-md transition-colors"
                >
                  取用菌株
                </button>

                <button
                  onClick={() => {
                    if (filteredStrains.length === 0) {
                      showLocalNotice('当前无可用标准菌株');
                      return;
                    }
                    setModalStrain(filteredStrains[0]);
                    setShowDestroyModal(true);
                  }}
                  className="px-3 py-1.5 bg-white hover:bg-rose-50 text-rose-700 border border-slate-300 hover:border-rose-300 font-medium rounded-md transition-colors"
                >
                  销毁菌株
                </button>

                <button
                  onClick={() => showLocalNotice('正在导出国家标准质控菌株保藏台账 Excel...')}
                  className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded border border-slate-300"
                  title="导出台账"
                >
                  <FileText className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* View Mode Toggle: Grid Matrix / Table List */}
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-all ${
                  viewMode === 'grid'
                    ? 'bg-white text-sky-700 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>孔位网格</span>
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-all ${
                  viewMode === 'table'
                    ? 'bg-white text-sky-700 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Table2 className="w-3.5 h-3.5" />
                <span>数据表格</span>
              </button>
            </div>
          </div>

          {/* Current Box Status Header Banner */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-slate-600 pt-2 border-t border-slate-100 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-900">
                当前标准株盒: {activeBox.freezerName} &gt; {activeBox.rackName} &gt;{' '}
                <span className="text-sky-700 font-mono font-bold">{activeBox.code}</span>
              </span>
              <span className="text-slate-300">|</span>
              <span>{activeBox.name}</span>
            </div>

            <div className="flex items-center gap-3 font-mono">
              <span>
                孔位规格: {activeBox.rows}×{activeBox.cols} = <strong>{totalWells}孔</strong>
              </span>
              <span>
                已存: <strong className="text-sky-700">{occupiedCount}</strong> 株
              </span>
              <span>
                空闲: <strong className="text-emerald-700">{totalWells - occupiedCount}</strong> 孔
              </span>
              <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-700 text-[11px] font-sans">
                存满率: <strong className="font-mono">{occupancyRate}%</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Main Content: Grid Matrix or Table */}
        <div className="flex-1 min-h-0 overflow-auto p-5">
          {viewMode === 'grid' ? (
            /* Grid View (Matches Screenshot image_dcd03b02.png) */
            <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-5">
              <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-3">
                {Array.from({ length: activeBox.rows }).map((_, rIdx) =>
                  Array.from({ length: activeBox.cols }).map((_, cIdx) => {
                    const rowNum = rIdx + 1;
                    const colNum = cIdx + 1;
                    const wellCode = `${rowNum}-${colNum}`;
                    const strain = strainsByWell.get(wellCode);
                    const isOccupied = !!strain;
                    const isMatched =
                      searchKeyword.trim() &&
                      strain &&
                      (strain.atccNo.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                        strain.strainBarcode
                          .toLowerCase()
                          .includes(searchKeyword.toLowerCase()) ||
                        strain.chineseName
                          .toLowerCase()
                          .includes(searchKeyword.toLowerCase()));

                    return (
                      <div
                        key={wellCode}
                        onClick={() => handleWellClick(wellCode)}
                        className={`group relative aspect-4/3 rounded-lg border transition-all cursor-pointer p-2 flex flex-col justify-between overflow-hidden ${
                          isOccupied
                            ? isMatched
                              ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-300 shadow-sm'
                              : 'bg-sky-50/50 hover:bg-sky-50 border-sky-200 hover:border-sky-400 shadow-2xs hover:shadow-xs'
                            : 'bg-slate-50/60 hover:bg-slate-100/80 border-slate-200 hover:border-slate-300'
                        }`}
                        title={
                          isOccupied
                            ? `孔位 ${wellCode}: ${strain.atccNo} - ${strain.chineseName} - 点击查看弹窗三联记录`
                            : `孔位 ${wellCode}: 空闲，点击快速存入标准株`
                        }
                      >
                        {/* Well Coordinate Header */}
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-mono font-bold text-slate-500">
                            {wellCode}
                          </span>
                          {isOccupied && (
                            <span
                              className={`w-2 h-2 rounded-full ${
                                strain.status === '在库备用'
                                  ? 'bg-emerald-500'
                                  : strain.status === '质控使用中'
                                  ? 'bg-amber-500'
                                  : 'bg-slate-400'
                              }`}
                            />
                          )}
                        </div>

                        {/* Cell Body (ATCC No, Barcode, Chinese Name) */}
                        {isOccupied ? (
                          <div className="my-auto leading-tight">
                            <span className="font-mono font-bold text-slate-900 text-[11px] block truncate">
                              {strain.atccNo}
                            </span>
                            <span className="font-mono text-[10px] text-slate-500 block truncate">
                              {strain.strainBarcode}
                            </span>
                            <span className="font-bold text-sky-700 text-xs block truncate mt-0.5">
                              {strain.chineseName}
                            </span>
                          </div>
                        ) : (
                          <div className="my-auto text-center text-slate-300 group-hover:text-slate-400 transition-colors">
                            <Plus className="w-4 h-4 mx-auto" />
                            <span className="text-[10px] block mt-0.5 font-sans">空闲</span>
                          </div>
                        )}

                        {/* Cell Footer */}
                        {isOccupied ? (
                          <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-sky-100 pt-0.5">
                            <span className="truncate">{strain.passage}</span>
                            <span className="font-sans font-medium text-slate-600 truncate">
                              {strain.storagePerson.slice(0, 3)}
                            </span>
                          </div>
                        ) : (
                          <div className="text-[10px] text-slate-300 font-mono text-right">
                            -80℃
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          ) : (
            /* Table View */
            <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden flex flex-col h-full">
              <div className="overflow-x-auto flex-1">
                <table className="w-full text-left border-collapse min-w-[1000px]">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 sticky top-0 z-10">
                    <tr>
                      <th className="px-3.5 py-2.5 font-mono">孔位</th>
                      <th className="px-3.5 py-2.5 font-mono">ATCC编号</th>
                      <th className="px-3.5 py-2.5 font-mono">菌株条码</th>
                      <th className="px-3.5 py-2.5">标准菌株名称</th>
                      <th className="px-3.5 py-2.5">质控分类</th>
                      <th className="px-3.5 py-2.5">传代代数</th>
                      <th className="px-3.5 py-2.5">来源机构</th>
                      <th className="px-3.5 py-2.5">存放人员</th>
                      <th className="px-3.5 py-2.5">存放时间</th>
                      <th className="px-3.5 py-2.5">状态</th>
                      <th className="px-3.5 py-2.5 text-center">操作详情</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    {currentTableStrains.length === 0 ? (
                      <tr>
                        <td colSpan={11} className="text-center py-12 text-slate-400">
                          暂无符合查询条件的标准菌株记录
                        </td>
                      </tr>
                    ) : (
                      currentTableStrains.map((strain) => (
                        <tr
                          key={strain.id}
                          className="hover:bg-sky-50/50 transition-colors"
                        >
                          <td className="px-3.5 py-2.5 font-mono font-bold text-sky-800">
                            {strain.wellCode}
                          </td>
                          <td className="px-3.5 py-2.5 font-mono font-bold text-slate-900">
                            {strain.atccNo}
                          </td>
                          <td className="px-3.5 py-2.5 font-mono text-slate-600">
                            {strain.strainBarcode}
                          </td>
                          <td className="px-3.5 py-2.5 font-bold text-slate-900">
                            {strain.chineseName}
                          </td>
                          <td className="px-3.5 py-2.5">
                            <span className="px-1.5 py-0.5 rounded text-[11px] bg-slate-100 text-slate-700 font-sans">
                              {strain.strainCategory}
                            </span>
                          </td>
                          <td className="px-3.5 py-2.5 font-mono text-slate-700">
                            {strain.passage}
                          </td>
                          <td className="px-3.5 py-2.5 text-slate-600 truncate max-w-[150px]">
                            {strain.sourceOrg}
                          </td>
                          <td className="px-3.5 py-2.5 text-slate-700">{strain.storagePerson}</td>
                          <td className="px-3.5 py-2.5 font-mono text-slate-500">
                            {strain.storageTime}
                          </td>
                          <td className="px-3.5 py-2.5">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                                strain.status === '在库备用'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : strain.status === '质控使用中'
                                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                  : 'bg-rose-50 text-rose-700 border border-rose-200'
                              }`}
                            >
                              {strain.status}
                            </span>
                          </td>
                          <td className="px-3.5 py-2.5 text-center">
                            <button
                              onClick={() => setModalStrain(strain)}
                              className="px-2.5 py-1 bg-sky-600 hover:bg-sky-700 text-white rounded font-medium shadow-2xs inline-flex items-center gap-1 transition-colors"
                            >
                              <Eye className="w-3 h-3" />
                              <span>弹窗详情</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Pagination Bar (10 items/page) */}
              <div className="bg-slate-50 px-4 py-2.5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-slate-600 text-xs shrink-0">
                <div className="flex items-center gap-2">
                  <span>
                    共 <strong className="text-slate-900 font-mono">{filteredStrains.length}</strong> 株标准质控菌株
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
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. DETAIL MODAL POPUP (把右侧显示的存放/取用/销毁记录改成弹窗展示) */}
      {/* ========================================================================= */}
      {modalStrain && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <span>标准质控菌株档案与溯源履历</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-sky-500/30 text-sky-200 font-mono">
                      {modalStrain.atccNo}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-800 text-slate-300 font-mono">
                      孔位: {modalStrain.wellCode}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        modalStrain.status === '在库备用'
                          ? 'bg-emerald-500/30 text-emerald-200'
                          : 'bg-amber-500/30 text-amber-200'
                      }`}
                    >
                      {modalStrain.status}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setModalStrain(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-5 bg-slate-50/50 text-xs">
              {/* Section 1: 标准菌株核心参数与溯源卡 */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <FlaskConical className="w-4 h-4 text-sky-600" />
                    <span>国家标准质控菌株基本信息 (Standard Strain Profile)</span>
                  </h4>
                  <span className="text-[11px] text-slate-500 font-mono">
                    条码: {modalStrain.strainBarcode}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div>
                    <span className="text-slate-400 block text-[11px]">ATCC / 标物编号</span>
                    <strong className="text-slate-900 font-mono text-sm">{modalStrain.atccNo}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">标准菌株名称</span>
                    <strong className="text-sky-800 font-bold">{modalStrain.chineseName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">国际学名 (拉丁名)</span>
                    <span className="font-serif italic text-slate-700">{modalStrain.latinName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">质控应用分类</span>
                    <span className="px-1.5 py-0.5 bg-slate-100 text-slate-800 rounded font-medium">
                      {modalStrain.strainCategory}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">保藏传代代数</span>
                    <strong className="font-mono text-emerald-700">{modalStrain.passage}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">标物来源单位</span>
                    <span className="text-slate-700">{modalStrain.sourceOrg}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">生产批号</span>
                    <span className="font-mono text-slate-700">{modalStrain.lotNo}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">标物有效期</span>
                    <span className="font-mono text-slate-700">{modalStrain.expiryDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">冷藏保藏方式</span>
                    <span className="text-slate-700">{modalStrain.storageMethod}</span>
                  </div>
                </div>
              </div>

              {/* Section 2: 三联记录 (存放记录, 取用记录, 销毁记录) - 原截图右侧面板内容在弹窗内结构化展现 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 1. 存放记录 */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-2.5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                      <Archive className="w-4 h-4 text-emerald-600" />
                      <span>存放记录 (Storage)</span>
                    </h4>
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 rounded font-mono">
                      {modalStrain.storageRecords.length}条
                    </span>
                  </div>

                  <div className="space-y-2">
                    {modalStrain.storageRecords.map((r) => (
                      <div key={r.id} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                        <div className="flex items-center justify-between text-slate-700 font-medium">
                          <span className="flex items-center gap-1 text-slate-900 font-bold">
                            <User className="w-3 h-3 text-slate-400" />
                            {r.operator}
                          </span>
                          <span className="font-mono text-[11px] text-slate-500">{r.time}</span>
                        </div>
                        <p className="text-slate-600 text-[11px]">{r.purposeOrReason}</p>
                        {r.remarks && (
                          <div className="text-[10px] text-slate-400 font-mono">{r.remarks}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. 取用记录 */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-2.5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                      <Send className="w-4 h-4 text-sky-600" />
                      <span>取用记录 (Retrieval)</span>
                    </h4>
                    <span className="text-[10px] bg-sky-50 text-sky-700 border border-sky-200 px-1.5 rounded font-mono">
                      {modalStrain.retrievalRecords.length}条
                    </span>
                  </div>

                  <div className="space-y-2">
                    {modalStrain.retrievalRecords.length === 0 ? (
                      <p className="text-slate-400 text-[11px] py-4 text-center">暂无取用记录</p>
                    ) : (
                      modalStrain.retrievalRecords.map((r) => (
                        <div key={r.id} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                          <div className="flex items-center justify-between text-slate-700 font-medium">
                            <span className="flex items-center gap-1 text-slate-900 font-bold">
                              <User className="w-3 h-3 text-slate-400" />
                              {r.operator}
                            </span>
                            <span className="font-mono text-[11px] text-slate-500">{r.time}</span>
                          </div>
                          <p className="text-slate-600 text-[11px]">{r.purposeOrReason}</p>
                          {r.remarks && (
                            <div className="text-[10px] text-slate-400 font-mono">{r.remarks}</div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* 3. 销毁记录 */}
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-2.5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                      <Trash2 className="w-4 h-4 text-rose-600" />
                      <span>销毁记录 (Destruction)</span>
                    </h4>
                    <span className="text-[10px] bg-rose-50 text-rose-700 border border-rose-200 px-1.5 rounded font-mono">
                      {modalStrain.destructionRecords.length}条
                    </span>
                  </div>

                  <div className="space-y-2">
                    {modalStrain.destructionRecords.length === 0 ? (
                      <p className="text-slate-400 text-[11px] py-4 text-center">当前在库，暂无销毁记录</p>
                    ) : (
                      modalStrain.destructionRecords.map((r) => (
                        <div key={r.id} className="p-2.5 bg-rose-50/50 rounded-lg border border-rose-200 space-y-1">
                          <div className="flex items-center justify-between text-slate-700 font-medium">
                            <span className="flex items-center gap-1 text-rose-900 font-bold">
                              <User className="w-3 h-3 text-rose-400" />
                              {r.operator}
                            </span>
                            <span className="font-mono text-[11px] text-rose-600">{r.time}</span>
                          </div>
                          <p className="text-rose-800 text-[11px]">{r.purposeOrReason}</p>
                          {r.remarks && (
                            <div className="text-[10px] text-rose-500 font-mono">{r.remarks}</div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer Controls */}
            <div className="bg-slate-100 border-t border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowRetrieveModal(true)}
                  className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-md shadow-2xs flex items-center gap-1.5 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>取用登记</span>
                </button>

                <button
                  onClick={() => setShowPassageModal(true)}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-md shadow-2xs flex items-center gap-1.5 transition-colors"
                >
                  <CheckSquare className="w-3.5 h-3.5" />
                  <span>传代复苏</span>
                </button>

                <button
                  onClick={() => setShowDestroyModal(true)}
                  className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 font-medium rounded-md flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>灭菌销毁</span>
                </button>

                <button
                  onClick={() =>
                    showLocalNotice(`正在打印标准质控菌株条码与二维码标签: [${modalStrain.atccNo}]`)
                  }
                  className="px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-medium rounded-md flex items-center gap-1.5 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>打印标签</span>
                </button>
              </div>

              <button
                onClick={() => setModalStrain(null)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-medium rounded-md transition-colors"
              >
                关闭弹窗
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. AUXILIARY MODALS */}
      {/* ========================================================================= */}

      {/* 1. Store Standard Strain Modal (存入标准菌株) */}
      {showStoreModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg p-5 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-sky-600" />
                <span>存入国家标准质控菌株 ({activeBox.code})</span>
              </h3>
              <button onClick={() => setShowStoreModal(false)}>
                <X className="w-4 h-4 text-slate-400 hover:text-slate-700" />
              </button>
            </div>

            <form onSubmit={handleSaveNewStrain} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">目标孔位 *</label>
                  <input
                    type="text"
                    value={targetWell}
                    onChange={(e) => setTargetWell(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded font-mono font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">ATCC / 标物编号 *</label>
                  <input
                    type="text"
                    value={newAtccNo}
                    onChange={(e) => setNewAtccNo(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded font-mono font-bold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">内部管理条码 *</label>
                  <input
                    type="text"
                    value={newBarcode}
                    onChange={(e) => setNewBarcode(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">质控分类</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded"
                  >
                    <option value="抗生素药敏质控">抗生素药敏质控</option>
                    <option value="质谱鉴定质控">质谱鉴定质控</option>
                    <option value="培养基验收质控">培养基验收质控</option>
                    <option value="生物安全参考">生物安全参考</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-slate-700 font-medium mb-1">菌株中文学名 *</label>
                  <input
                    type="text"
                    value={newChineseName}
                    onChange={(e) => setNewChineseName(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-slate-700 font-medium mb-1">国际拉丁名</label>
                  <input
                    type="text"
                    value={newLatinName}
                    onChange={(e) => setNewLatinName(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded font-serif italic"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">标物来源单位</label>
                  <input
                    type="text"
                    value={newSourceOrg}
                    onChange={(e) => setNewSourceOrg(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">生产批号</label>
                  <input
                    type="text"
                    value={newLotNo}
                    onChange={(e) => setNewLotNo(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowStoreModal(false)}
                  className="px-3.5 py-1.5 border border-slate-300 rounded text-slate-700"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded font-medium shadow-2xs"
                >
                  确认入库保藏
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Retrieve Modal (取用登记) */}
      {showRetrieveModal && modalStrain && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md p-5 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Send className="w-4 h-4 text-sky-600" />
                <span>标准质控菌株取用登记</span>
              </h3>
              <button onClick={() => setShowRetrieveModal(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-slate-400 block text-[11px]">拟取用标准株:</span>
                <strong className="text-slate-900 text-sm font-mono">{modalStrain.atccNo}</strong>
                <span className="text-slate-700 block mt-0.5">{modalStrain.chineseName}</span>
                <span className="text-slate-500 block text-[11px] font-mono mt-0.5">
                  孔位: {modalStrain.wellCode} · {modalStrain.passage}
                </span>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">质控用途说明:</label>
                <input
                  type="text"
                  value={retrievePurpose}
                  onChange={(e) => setRetrievePurpose(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">经办取用人:</label>
                <input
                  type="text"
                  value={retrieveBorrower}
                  onChange={(e) => setRetrieveBorrower(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowRetrieveModal(false)}
                className="px-3.5 py-1.5 border border-slate-300 rounded text-slate-700"
              >
                取消
              </button>
              <button
                onClick={handleRetrieveSubmit}
                className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded font-medium shadow-2xs"
              >
                确认取用出库
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Passage Modal (传代复苏) */}
      {showPassageModal && modalStrain && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md p-5 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <CheckSquare className="w-4 h-4 text-emerald-600" />
                <span>标准株传代复苏登记 (Work Passage)</span>
              </h3>
              <button onClick={() => setShowPassageModal(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-slate-400 block text-[11px]">当前代数:</span>
                <strong className="text-slate-900 font-mono text-sm">{modalStrain.passage}</strong>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">传代后新代数代号:</label>
                <select
                  value={passageNumberInput}
                  onChange={(e) => setPassageNumberInput(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded font-medium"
                >
                  <option value="P2代 (工作子株)">P2代 (工作子株)</option>
                  <option value="P3代 (工作子株)">P3代 (工作子株)</option>
                  <option value="P4代 (质控终代 - 限度内)">P4代 (质控终代 - 限度内)</option>
                  <option value="P5代 (达上限须销毁)">P5代 (达上限须销毁)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">接种培养基类型:</label>
                <input
                  type="text"
                  value={passagePlateType}
                  onChange={(e) => setPassagePlateType(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowPassageModal(false)}
                className="px-3.5 py-1.5 border border-slate-300 rounded text-slate-700"
              >
                取消
              </button>
              <button
                onClick={handlePassageSubmit}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-medium shadow-2xs"
              >
                确认传代并保存
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Destroy Modal (高压灭菌销毁) */}
      {showDestroyModal && modalStrain && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md p-5 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-bold text-rose-900 text-sm flex items-center gap-1.5">
                <Trash2 className="w-4 h-4 text-rose-600" />
                <span>标准菌株超期/超传代销毁确认</span>
              </h3>
              <button onClick={() => setShowDestroyModal(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-2.5 bg-rose-50 border border-rose-200 rounded text-rose-800">
                <strong>生物安全处置提示：</strong>
                <span>根据ISO 15189要求，质控标准株超过5代或活菌衰减须121℃高压灭菌30分钟后登记报废。</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px]">拟销毁菌株:</span>
                <strong className="text-slate-900">
                  {modalStrain.atccNo} ({modalStrain.chineseName})
                </strong>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">销毁原因:</label>
                <select
                  value={destroyReason}
                  onChange={(e) => setDestroyReason(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded"
                >
                  <option value="原管标准株复苏超传代限度且活力衰减">原管标准株复苏超传代限度且活力衰减</option>
                  <option value="质控菌株超过有效保质期">质控菌株超过有效保质期</option>
                  <option value="纯度检验发现污染杂菌">纯度检验发现污染杂菌</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowDestroyModal(false)}
                className="px-3.5 py-1.5 border border-slate-300 rounded text-slate-700"
              >
                取消
              </button>
              <button
                onClick={handleDestroySubmit}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded font-medium shadow-2xs"
              >
                确认灭菌销毁
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
