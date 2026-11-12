import React, { useState } from 'react';
import {
  ClinicalStrainItem,
  CryoboxInfo,
  FreezerInfo,
  INITIAL_FREEZER_TREE,
} from '../data/microbiologyClinicalStrainData';
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
} from './MenuIcon';

interface MicrobiologyClinicalStrainViewProps {
  user?: UserProfile;
  triggerAction: (msg: string) => void;
}

export const MicrobiologyClinicalStrainView: React.FC<MicrobiologyClinicalStrainViewProps> = ({
  user,
  triggerAction,
}) => {
  // Freezer tree structure & active box
  const [freezer, setFreezer] = useState<FreezerInfo>(INITIAL_FREEZER_TREE);
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
  const [strains, setStrains] = useState<ClinicalStrainItem[]>(activeBox.strains);

  // View Mode: 'grid' (孔位图) | 'table' (表格清单)
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Search Filter
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  // Selected strain for the right-side detail MODAL popup ("把右侧显示的改成弹窗展示")
  const [modalStrain, setModalStrain] = useState<ClinicalStrainItem | null>(null);

  // Auxiliary Modals State
  const [showStoreModal, setShowStoreModal] = useState<boolean>(false);
  const [showRetrieveModal, setShowRetrieveModal] = useState<boolean>(false);
  const [showDestroyModal, setShowDestroyModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);

  // Form states for store strain
  const [targetWell, setTargetWell] = useState<string>('3-1');
  const [newBarcode, setNewBarcode] = useState<string>('BC099028');
  const [newStrainName, setNewStrainName] = useState<string>('耐碳青霉烯大肠埃希菌 (CRE)');
  const [newSampleType, setNewSampleType] = useState<string>('血液');
  const [newAstType, setNewAstType] = useState<string>('美罗培南耐药 / 泛耐药');
  const [newPatientName, setNewPatientName] = useState<string>('赵敏华');
  const [newGender, setNewGender] = useState<'男' | '女'>('女');
  const [newAge, setNewAge] = useState<string>('53岁');
  const [newHospitalNo, setNewHospitalNo] = useState<string>('4354028');
  const [newDept, setNewDept] = useState<string>('重症医学科 (ICU)');
  const [newDiagnosis, setNewDiagnosis] = useState<string>('感染性休克 / 败血症');

  // Form states for retrieve strain
  const [retrievePurpose, setRetrievePurpose] = useState<string>('科研耐药基因扩增比对');
  const [retrieveBorrower, setRetrieveBorrower] = useState<string>(user?.name || '李晓红主管检验师');

  // Form states for destroy strain
  const [destroyReason, setDestroyReason] = useState<string>('保藏期满且活菌复苏活力衰减');

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
  const handleSelectBox = (box: CryoboxInfo) => {
    setSelectedBoxId(box.id);
    setStrains(box.strains);
    showLocalNotice(`已切换至保藏盒: ${box.code} (${box.name})`);
  };

  // Filter strains based on search
  const filteredStrains = strains.filter((s) => {
    if (!searchKeyword.trim()) return true;
    const q = searchKeyword.trim().toLowerCase();
    return (
      s.strainBarcode.toLowerCase().includes(q) ||
      s.strainName.toLowerCase().includes(q) ||
      s.patientName.toLowerCase().includes(q) ||
      s.wellCode.toLowerCase().includes(q) ||
      s.department.toLowerCase().includes(q)
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
  const strainsByWell = new Map<string, ClinicalStrainItem>();
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
    const newStrainItem: ClinicalStrainItem = {
      id: `CS-${Date.now()}`,
      wellCode: targetWell,
      strainBarcode: newBarcode,
      strainName: newStrainName,
      sampleType: newSampleType,
      identificationResult: newStrainName,
      astPhenotype: newAstType,
      storagePerson: user?.name || '刘浩然主管检验师',
      storageTime: '2026-10-30 11:20:00',
      patientName: newPatientName,
      patientGender: newGender,
      patientAge: newAge,
      hospitalizationNo: newHospitalNo,
      department: newDept,
      testItem: '菌株保藏深低温备份',
      clinicalDiagnosis: newDiagnosis,
      preservationMethod: '甘油肉汤 (-80℃超低温保藏)',
      passageNumber: 'P1代 (原代复苏保藏)',
      status: '在库',
      logs: [
        {
          id: `log-${Date.now()}`,
          time: '2026-10-30 11:20:00',
          operator: user?.name || '刘浩然主管检验师',
          action: '存入入库',
          notes: `菌株成功存入保藏盒 ${activeBox.code} 孔位 [${targetWell}]`,
        },
      ],
    };

    setStrains((prev) => [...prev.filter((s) => s.wellCode !== targetWell), newStrainItem]);
    setShowStoreModal(false);
    showLocalNotice(`新菌株 [${newStrainName}] 已成功存入孔位 [${targetWell}]！`);
  };

  // Handler: Retrieve Strain submit
  const handleRetrieveSubmit = () => {
    if (!modalStrain) return;
    const updatedStrain: ClinicalStrainItem = {
      ...modalStrain,
      status: '已取用',
      logs: [
        ...modalStrain.logs,
        {
          id: `log-${Date.now()}`,
          time: '2026-10-30 11:35:00',
          operator: retrieveBorrower,
          action: '取用借出',
          notes: `借调用途: ${retrievePurpose}。经办人: ${retrieveBorrower}`,
        },
      ],
    };
    setStrains((prev) => prev.map((s) => (s.id === modalStrain.id ? updatedStrain : s)));
    setModalStrain(updatedStrain);
    setShowRetrieveModal(false);
    showLocalNotice(`菌株 [${modalStrain.strainBarcode}] 取用借出登记成功！`);
  };

  // Handler: Destroy Strain submit
  const handleDestroySubmit = () => {
    if (!modalStrain) return;
    const updatedStrain: ClinicalStrainItem = {
      ...modalStrain,
      status: '已销毁',
      logs: [
        ...modalStrain.logs,
        {
          id: `log-${Date.now()}`,
          time: '2026-10-30 11:40:00',
          operator: user?.name || '郭彩霞主任医师',
          action: '高温灭菌销毁',
          notes: `121℃ 30min高压灭菌销毁。处置原因: ${destroyReason}`,
        },
      ],
    };
    setStrains((prev) => prev.map((s) => (s.id === modalStrain.id ? updatedStrain : s)));
    setModalStrain(updatedStrain);
    setShowDestroyModal(false);
    showLocalNotice(`菌株 [${modalStrain.strainBarcode}] 高压灭菌生物安全销毁登记完毕！`);
  };

  // Total capacity calculations
  const totalWells = activeBox.rows * activeBox.cols;
  const occupiedCount = strains.filter((s) => s.status === '在库').length;
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
            <span>设备型号:</span>
            <span className="font-mono">{freezer.model}</span>
          </div>
        </div>
      </div>

      {/* 2. Center/Right Main Workspace View */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* Top Filter & Action Header Strip (Matches Screenshot image_89c440ad.png) */}
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
                  placeholder="条码号/菌株名称/患者姓名/孔位..."
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
                      showLocalNotice('当前无可用菌株');
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
                      showLocalNotice('当前无可用菌株');
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
                  onClick={() => showLocalNotice('正在导出当前冷冻冻存盒菌株清单台账 Excel...')}
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
                当前位置: {activeBox.freezerName} &gt; {activeBox.rackName} &gt;{' '}
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
            /* Grid View (Matches Screenshot 89c440ad.png) */
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
                      (strain.strainBarcode
                        .toLowerCase()
                        .includes(searchKeyword.toLowerCase()) ||
                        strain.strainName
                          .toLowerCase()
                          .includes(searchKeyword.toLowerCase()) ||
                        strain.patientName
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
                            ? `孔位 ${wellCode}: ${strain.strainName} (${strain.strainBarcode}) - 点击查看弹窗详情`
                            : `孔位 ${wellCode}: 空闲，点击快速存入`
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
                                strain.status === '在库'
                                  ? 'bg-emerald-500'
                                  : strain.status === '已取用'
                                  ? 'bg-amber-500'
                                  : 'bg-slate-400'
                              }`}
                            />
                          )}
                        </div>

                        {/* Cell Body */}
                        {isOccupied ? (
                          <div className="my-auto">
                            <span className="font-mono text-[11px] text-slate-700 block truncate font-medium">
                              {strain.strainBarcode}
                            </span>
                            <span className="font-bold text-sky-700 text-xs block truncate mt-0.5">
                              {strain.strainName}
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
                            <span className="truncate">{strain.sampleType}</span>
                            <span className="font-sans font-medium text-slate-600 truncate">
                              {strain.patientName}
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
                      <th className="px-3.5 py-2.5 font-mono">菌株条码</th>
                      <th className="px-3.5 py-2.5">菌株名称</th>
                      <th className="px-3.5 py-2.5">标本类型</th>
                      <th className="px-3.5 py-2.5">药敏分型</th>
                      <th className="px-3.5 py-2.5">患者姓名</th>
                      <th className="px-3.5 py-2.5">申请科室</th>
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
                          暂无符合查询条件的菌株记录
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
                          <td className="px-3.5 py-2.5 font-mono font-medium text-slate-700">
                            {strain.strainBarcode}
                          </td>
                          <td className="px-3.5 py-2.5 font-bold text-slate-900">
                            {strain.strainName}
                          </td>
                          <td className="px-3.5 py-2.5 text-slate-600">{strain.sampleType}</td>
                          <td className="px-3.5 py-2.5">
                            <span className="px-1.5 py-0.5 rounded text-[11px] bg-slate-100 text-slate-700 font-mono">
                              {strain.astPhenotype}
                            </span>
                          </td>
                          <td className="px-3.5 py-2.5 font-semibold text-slate-800">
                            {strain.patientName} ({strain.patientGender}·{strain.patientAge})
                          </td>
                          <td className="px-3.5 py-2.5 text-slate-600">{strain.department}</td>
                          <td className="px-3.5 py-2.5 text-slate-700">{strain.storagePerson}</td>
                          <td className="px-3.5 py-2.5 font-mono text-slate-500">
                            {strain.storageTime}
                          </td>
                          <td className="px-3.5 py-2.5">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                                strain.status === '在库'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : strain.status === '已取用'
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
                    共 <strong className="text-slate-900 font-mono">{filteredStrains.length}</strong> 株保藏菌株
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
      {/* 3. DETAIL MODAL POPUP (把右侧显示的改成弹窗展示) */}
      {/* ========================================================================= */}
      {modalStrain && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center shrink-0">
                  <Archive className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <span>临床菌株保藏详情与溯源档案</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-sky-500/30 text-sky-200 font-mono">
                      孔位: {modalStrain.wellCode}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        modalStrain.status === '在库'
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

            {/* Modal Body: Matches original right-side panel layout, with enhanced visuals */}
            <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-5 bg-slate-50/50 text-xs">
              {/* Section 1: 菌株信息 (Strain Information) */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <FlaskConical className="w-4 h-4 text-sky-600" />
                    <span>菌株保藏信息 (Strain Information)</span>
                  </h4>
                  <button
                    onClick={() => setShowEditModal(true)}
                    className="text-sky-600 hover:text-sky-800 font-medium flex items-center gap-1 text-[11px]"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>编辑</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div>
                    <span className="text-slate-400 block text-[11px]">菌株条码</span>
                    <strong className="text-slate-900 font-mono text-sm">
                      {modalStrain.strainBarcode}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">标本类型</span>
                    <span className="px-1.5 py-0.5 bg-slate-100 text-slate-800 rounded font-medium">
                      {modalStrain.sampleType}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">鉴定结果</span>
                    <strong className="text-sky-800 font-serif text-sm">
                      {modalStrain.identificationResult}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">药敏分型</span>
                    <span className="text-slate-800 font-medium">
                      {modalStrain.astPhenotype || '敏感型'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">存放人员</span>
                    <strong className="text-slate-900">{modalStrain.storagePerson}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">存放时间</span>
                    <span className="font-mono text-slate-700">{modalStrain.storageTime}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">保藏方法</span>
                    <span className="text-slate-700">{modalStrain.preservationMethod}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">传代代数</span>
                    <span className="font-mono text-slate-700 font-medium">
                      {modalStrain.passageNumber}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">保藏位置</span>
                    <span className="font-mono text-slate-700">
                      {activeBox.code} ({modalStrain.wellCode}孔)
                    </span>
                  </div>
                </div>
              </div>

              {/* Section 2: 患者信息 (Patient Information) */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <User className="w-4 h-4 text-emerald-600" />
                    <span>患者临床档案 (Patient & Clinical Background)</span>
                  </h4>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <span className="text-slate-400 block text-[11px]">患者姓名</span>
                    <strong className="text-slate-900 text-sm">{modalStrain.patientName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">性别 / 年龄</span>
                    <span className="text-slate-800 font-medium">
                      {modalStrain.patientGender} · {modalStrain.patientAge}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">住院号</span>
                    <strong className="font-mono text-slate-800">
                      {modalStrain.hospitalizationNo}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">申请科室</span>
                    <span className="text-slate-800 font-medium">{modalStrain.department}</span>
                  </div>
                  <div className="md:col-span-2">
                    <span className="text-slate-400 block text-[11px]">检验项目</span>
                    <span className="text-slate-800">{modalStrain.testItem}</span>
                  </div>
                  <div className="md:col-span-2">
                    <span className="text-slate-400 block text-[11px]">临床诊断</span>
                    <strong className="text-slate-900">{modalStrain.clinicalDiagnosis}</strong>
                  </div>
                </div>
              </div>

              {/* Section 3: 存取与流转审计记录 (Audit Trails) */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3">
                <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-sky-600" />
                  <span>菌株借调/存取/销毁追溯记录</span>
                </h4>

                {modalStrain.logs.length === 0 ? (
                  <p className="text-slate-400 text-[11px]">暂无附加借调处置流转记录</p>
                ) : (
                  <div className="border-l-2 border-sky-300 ml-2 space-y-3 pl-3 font-sans">
                    {modalStrain.logs.map((log) => (
                      <div key={log.id} className="relative">
                        <div className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-sky-600 ring-2 ring-sky-100" />
                        <div className="flex items-center justify-between text-slate-500 font-mono text-[11px]">
                          <span>{log.time}</span>
                          <span className="font-sans font-medium text-slate-700">
                            {log.operator}
                          </span>
                        </div>
                        <div className="font-semibold text-slate-900 mt-0.5">{log.action}</div>
                        <p className="text-slate-600 mt-0.5">{log.notes}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer Toolbar */}
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
                  onClick={() => setShowDestroyModal(true)}
                  className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 font-medium rounded-md flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>高温灭菌销毁</span>
                </button>

                <button
                  onClick={() =>
                    showLocalNotice(`正在打印菌株冻存管二维码标签: [${modalStrain.strainBarcode}]`)
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

      {/* 1. Store Strain Modal (存入菌株) */}
      {showStoreModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg p-5 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-sky-600" />
                <span>存入临床新菌株 ({activeBox.code})</span>
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
                  <label className="block text-slate-700 font-medium mb-1">菌株条码号 *</label>
                  <input
                    type="text"
                    value={newBarcode}
                    onChange={(e) => setNewBarcode(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded font-mono"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-slate-700 font-medium mb-1">菌株鉴定名称 *</label>
                  <input
                    type="text"
                    value={newStrainName}
                    onChange={(e) => setNewStrainName(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">标本来源类型</label>
                  <select
                    value={newSampleType}
                    onChange={(e) => setNewSampleType(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded"
                  >
                    <option value="血液">血液</option>
                    <option value="痰液">痰液</option>
                    <option value="尿液">尿液</option>
                    <option value="脑脊液">脑脊液</option>
                    <option value="创面脓液">创面脓液</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">药敏表型</label>
                  <input
                    type="text"
                    value={newAstType}
                    onChange={(e) => setNewAstType(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">患者姓名</label>
                  <input
                    type="text"
                    value={newPatientName}
                    onChange={(e) => setNewPatientName(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">送检科室</label>
                  <input
                    type="text"
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded"
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
                  确认存入入库
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Retrieve Strain Modal (取用登记) */}
      {showRetrieveModal && modalStrain && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md p-5 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Send className="w-4 h-4 text-sky-600" />
                <span>菌株取用与借调登记</span>
              </h3>
              <button onClick={() => setShowRetrieveModal(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-slate-400 block text-[11px]">取用菌株:</span>
                <strong className="text-slate-900 text-sm">
                  {modalStrain.strainName} ({modalStrain.strainBarcode})
                </strong>
                <span className="text-slate-500 block text-[11px] font-mono">
                  当前孔位: {modalStrain.wellCode}
                </span>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">借调/取用用途:</label>
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
                确认取用借出
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Destroy Strain Modal (高温灭菌销毁) */}
      {showDestroyModal && modalStrain && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md p-5 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-bold text-rose-900 text-sm flex items-center gap-1.5">
                <Trash2 className="w-4 h-4 text-rose-600" />
                <span>病原微生物菌株销毁审批登记</span>
              </h3>
              <button onClick={() => setShowDestroyModal(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-2.5 bg-rose-50 border border-rose-200 rounded text-rose-800">
                <strong>生物安全提示：</strong>
                <span>销毁操作须按照P2生物安全规范进行 121℃ 30分钟高压蒸汽灭菌无害化处置。</span>
              </div>

              <div>
                <span className="text-slate-400 block text-[11px]">拟销毁菌株:</span>
                <strong className="text-slate-900">
                  {modalStrain.strainName} ({modalStrain.strainBarcode})
                </strong>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">销毁原因:</label>
                <select
                  value={destroyReason}
                  onChange={(e) => setDestroyReason(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded"
                >
                  <option value="保藏期满且活菌复苏活力衰减">保藏期满且活菌复苏活力衰减</option>
                  <option value="临床研究项目结束规范销毁">临床研究项目结束规范销毁</option>
                  <option value="冻存管密封损坏污染">冻存管密封损坏污染</option>
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

      {/* 4. Edit Strain Modal */}
      {showEditModal && modalStrain && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md p-5 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-bold text-slate-900 text-sm">
                编辑菌株信息 [{modalStrain.strainBarcode}]
              </h3>
              <button onClick={() => setShowEditModal(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-slate-700 font-medium mb-1">鉴定结果:</label>
                <input
                  type="text"
                  value={modalStrain.identificationResult}
                  onChange={(e) =>
                    setModalStrain({ ...modalStrain, identificationResult: e.target.value })
                  }
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">药敏分型:</label>
                <input
                  type="text"
                  value={modalStrain.astPhenotype}
                  onChange={(e) =>
                    setModalStrain({ ...modalStrain, astPhenotype: e.target.value })
                  }
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">临床诊断:</label>
                <input
                  type="text"
                  value={modalStrain.clinicalDiagnosis}
                  onChange={(e) =>
                    setModalStrain({ ...modalStrain, clinicalDiagnosis: e.target.value })
                  }
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-3.5 py-1.5 border border-slate-300 rounded text-slate-700"
              >
                取消
              </button>
              <button
                onClick={() => {
                  setStrains((prev) =>
                    prev.map((s) => (s.id === modalStrain.id ? modalStrain : s))
                  );
                  setShowEditModal(false);
                  showLocalNotice('菌株档案修改已保存！');
                }}
                className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded font-medium shadow-2xs"
              >
                保存修改
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
