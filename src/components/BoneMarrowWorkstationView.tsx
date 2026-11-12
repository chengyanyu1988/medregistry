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
  FileText,
  CheckCircle2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Activity,
  Layers,
  Save,
  Printer,
  CalendarCheck,
  User,
  SlidersHorizontal,
  Clock,
  ExternalLink,
  ShieldAlert,
  Sparkles,
  Barcode,
  Microscope,
  Camera,
  RotateCcw,
  CheckSquare,
  FileCheck,
  FlaskConical
} from './MenuIcon';
import { UserProfile } from '../types/navigation';
import {
  BoneMarrowItem,
  INITIAL_BONE_MARROW_ITEMS,
  CellDifferential,
  CytochemicalStaining
} from '../data/boneMarrowData';

interface BoneMarrowWorkstationViewProps {
  user: UserProfile;
  triggerAction: (msg: string) => void;
}

export const BoneMarrowWorkstationView: React.FC<BoneMarrowWorkstationViewProps> = ({
  user,
  triggerAction,
}) => {
  // Master Dataset State
  const [items, setItems] = useState<BoneMarrowItem[]>(INITIAL_BONE_MARROW_ITEMS);

  // Top Bar Search & Filter States
  const [statusFilter, setStatusFilter] = useState<string>('全部');
  const [departmentFilter, setDepartmentFilter] = useState<string>('全部');
  const [startDate, setStartDate] = useState<string>('2026-10-25');
  const [endDate, setEndDate] = useState<string>('2026-10-30');
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  // Pagination State (Strict requirement: 10 items per page)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  // Selected Item Modal Popup (Requirement: "点击左侧的，右侧的信息改成弹窗展示")
  const [selectedModalItem, setSelectedModalItem] = useState<BoneMarrowItem | null>(null);
  const [activeModalTab, setActiveModalTab] = useState<'counts' | 'staining' | 'images' | 'opinion'>('counts');
  const [countMode, setCountMode] = useState<'marrow' | 'blood'>('marrow');

  // Modal Editing Form State
  const [modalForm, setModalForm] = useState<BoneMarrowItem | null>(null);

  // Image Fullscreen Preview State
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Manual Application Modal State
  const [isManualModalOpen, setIsManualModalOpen] = useState<boolean>(false);
  const [manualForm, setManualForm] = useState({
    specimenNo: '230013',
    applyNo: '2310023133',
    patientName: '孙佳丽',
    gender: '女' as '男' | '女',
    age: '32岁',
    bedNo: '18床',
    department: '血液内科',
    doctor: '陈欣欣主治',
    clinicalDiagnosis: '急性白血病复查',
  });

  // Filtered List
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      // Status Filter
      if (statusFilter !== '全部' && item.status !== statusFilter) return false;

      // Department Filter
      if (departmentFilter !== '全部' && !item.department.includes(departmentFilter)) return false;

      // Search Keyword
      if (searchKeyword.trim()) {
        const kw = searchKeyword.trim().toLowerCase();
        const match =
          item.specimenNo.toLowerCase().includes(kw) ||
          item.applyNo.toLowerCase().includes(kw) ||
          item.patientName.toLowerCase().includes(kw) ||
          item.patientId.toLowerCase().includes(kw) ||
          item.clinicalDiagnosis.toLowerCase().includes(kw);
        if (!match) return false;
      }

      return true;
    });
  }, [items, statusFilter, departmentFilter, searchKeyword]);

  // Paginated List
  const totalPages = Math.ceil(filteredItems.length / pageSize) || 1;
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredItems.slice(start, start + pageSize);
  }, [filteredItems, currentPage]);

  // Open Modal Popup with selected item
  const handleOpenDetailModal = (item: BoneMarrowItem) => {
    setSelectedModalItem(item);
    setModalForm(JSON.parse(JSON.stringify(item))); // Deep copy
    setActiveModalTab('counts');
    triggerAction(`展开患者 [${item.patientName} - ${item.specimenNo}] 的骨髓形态学分类弹窗`);
  };

  // Save Modal Updates
  const handleSaveModalUpdates = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalForm) return;

    setItems(prev => prev.map(s => (s.id === modalForm.id ? { ...modalForm } : s)));
    setSelectedModalItem(null);
    triggerAction(`标本号 [${modalForm.specimenNo} - ${modalForm.patientName}] 的骨髓镜检结果及图谱已成功保存！`);
  };

  // Mark Status as Examined or Audit
  const handleUpdateStatus = (status: '已镜检' | '已审签') => {
    if (!modalForm) return;
    const updated = { ...modalForm, status };
    setModalForm(updated);
    setItems(prev => prev.map(s => (s.id === updated.id ? updated : s)));
    setSelectedModalItem(null);
    triggerAction(`标本号 [${updated.specimenNo} - ${updated.patientName}] 已更新为【${status}】！`);
  };

  // Increment/Decrement Cell Count Helper
  const handleCellCountChange = (key: keyof CellDifferential, delta: number) => {
    if (!modalForm) return;
    const currentVal = (modalForm.counts[key] as number) || 0;
    const newVal = Math.max(0, currentVal + delta);
    setModalForm({
      ...modalForm,
      counts: {
        ...modalForm.counts,
        [key]: newVal,
      },
    });
  };

  // Add Microscopy Photo Snapshot
  const handleAddSnapshot = () => {
    if (!modalForm) return;
    const samplePhotos = [
      'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1576086213369-97a306d36557?w=500&auto=format&fit=crop&q=80',
    ];
    const randomPic = samplePhotos[Math.floor(Math.random() * samplePhotos.length)];
    const updatedPics = [...modalForm.microscopyImages, randomPic];
    setModalForm({ ...modalForm, microscopyImages: updatedPics });
    triggerAction(`显微镜高倍图谱抓拍成功！已保存至图谱库 (共${updatedPics.length}张)`);
  };

  // Remove Photo Snapshot
  const handleRemovePhoto = (index: number) => {
    if (!modalForm) return;
    const updatedPics = modalForm.microscopyImages.filter((_, i) => i !== index);
    setModalForm({ ...modalForm, microscopyImages: updatedPics });
    triggerAction('显微图谱照片已移除');
  };

  // Save Manual New Entry
  const handleSaveManual = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `BM-${Date.now()}`;
    const newItem: BoneMarrowItem = {
      id: newId,
      specimenNo: manualForm.specimenNo,
      applyNo: manualForm.applyNo,
      patientId: `500${Math.floor(900 + Math.random() * 100)}`,
      patientName: manualForm.patientName,
      gender: manualForm.gender,
      age: manualForm.age,
      bedNo: manualForm.bedNo,
      department: manualForm.department,
      doctor: manualForm.doctor,
      applyTime: '2026-10-30 09:40:00',
      checkInTime: '2026-10-30 09:50:00',
      clinicalDiagnosis: manualForm.clinicalDiagnosis,
      isUrgent: false,
      status: '未镜检',
      counts: {
        myeloblast: 0,
        promyelocyte: 2,
        myelocyteNeutro: 15,
        metamyelocyteNeutro: 18,
        bandNeutro: 20,
        segmentedNeutro: 30,
        myelocyteEos: 1,
        metamyelocyteEos: 1,
        bandEos: 1,
        segmentedEos: 2,
        myelocyteBaso: 0,
        metamyelocyteBaso: 0,
        bandBaso: 0,
        segmentedBaso: 0,
        pronormoblast: 2,
        basophilicNormoblast: 5,
        polychromaticNormoblast: 18,
        orthochromaticNormoblast: 16,
        giantPronormoblast: 0,
        giantPolychromatic: 0,
        giantOrthochromatic: 0,
        lymphoblast: 0,
        prolymphocyte: 0,
        matureLymphocyte: 22,
        atypicalLymphocyte: 1,
        lymphosarcomaCell: 0,
        monoblast: 0,
        promonocyte: 1,
        matureMonocyte: 3,
        plasmablast: 0,
        proplasmacyte: 0,
        maturePlasmacyte: 3,
        megakaryoblast: 1,
        promegakaryocyte: 2,
        granularMegakaryocyte: 18,
        thrombocytogenicMegakaryocyte: 4,
        bareNucleusMegakaryocyte: 6,
        reticularCell: 2,
        tissueBasophil: 0,
        macrophage: 1,
        myelomaCell: 0,
        fatCell: 2,
        unclassifiedCell: 0,
        marrowTotal: 200,
        bloodTotal: 100,
        currentMarrowCount: 200,
        currentBloodCount: 100,
      },
      cytochemical: {
        napScore: 120,
        napPositiveRate: '50%',
        pox: '阳性 ++',
        pas: '弱阳性 +',
        nea: '弱阳性 +',
        naeNaf: '无抑制',
        extracellularIron: '++',
        intracellularIron: { i: 15, ii: 10, iii: 5, iv: 0, ring: 0 },
      },
      microscopyImages: [
        'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=500&auto=format&fit=crop&q=80',
      ],
      marrowOpinion: '骨髓增生活跃，造血细胞三系增生，未见明确恶性细胞。',
      bloodOpinion: '成熟红细胞大小较均一，血小板散在分布。',
      diagnosisResult: '骨髓反应性增生改变',
    };

    setItems(prev => [newItem, ...prev]);
    setIsManualModalOpen(false);
    handleOpenDetailModal(newItem);
    triggerAction(`手工创建骨髓申请单 [${newItem.applyNo} - ${newItem.patientName}] 并载入分类工作站！`);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-800 font-sans p-4 overflow-y-auto space-y-4">
      {/* 1. Header Toolbar & Filters */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs space-y-3">
        {/* Row 1: Search & Status Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-3">


            {/* Status Filter */}
            <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
              <span className="text-slate-500 font-medium">镜检状态</span>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="bg-transparent font-medium text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="全部">全部状态</option>
                <option value="未镜检">未镜检</option>
                <option value="已镜检">已镜检</option>
                <option value="已审签">已审签</option>
              </select>
            </div>

            {/* Dept Filter */}
            <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
              <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="text-slate-500 font-medium">送检科室</span>
              <select
                value={departmentFilter}
                onChange={e => setDepartmentFilter(e.target.value)}
                className="bg-transparent font-medium text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="全部">全部科室</option>
                <option value="血液内科">血液内科</option>
                <option value="肿瘤科">肿瘤科</option>
                <option value="肾内科">肾内科</option>
                <option value="风湿免疫科">风湿免疫科</option>
                <option value="感染科">感染科</option>
              </select>
            </div>

            {/* Keyword Search */}
            <div className="relative flex items-center">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5" />
              <input
                type="text"
                placeholder="患者姓名/标本号/病历号/诊断..."
                value={searchKeyword}
                onChange={e => setSearchKeyword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && setCurrentPage(1)}
                className="pl-8 pr-3 py-1 bg-slate-50 hover:bg-white border border-slate-200 rounded-lg text-xs w-60 focus:outline-none focus:ring-1 focus:ring-sky-500 transition-all font-medium"
              />
            </div>

            <button
              onClick={() => setCurrentPage(1)}
              className="px-3 py-1 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg shadow-2xs transition-colors flex items-center gap-1"
            >
              <Search className="w-3.5 h-3.5" />
              <span>查询</span>
            </button>
            <button
              onClick={() => {
                setSearchKeyword('');
                setStatusFilter('全部');
                setDepartmentFilter('全部');
                triggerAction('筛选条件已重置');
              }}
              className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg border border-slate-200 transition-colors"
              title="重置"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsManualModalOpen(true)}
              className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>手工申请录入</span>
            </button>
            <button
              onClick={() => triggerAction('已同步拉取HIS病区今日骨髓穿刺医嘱明细')}
              className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
              <span>刷新队列</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Specimen Table View (Page displays the table queue directly) */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col flex-1 min-h-0">
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <span className="font-bold text-slate-800 flex items-center gap-1.5">
            <Table2 className="w-4 h-4 text-sky-600" />
            骨髓镜检待处理队列 (点击任意记录行可在弹窗中打开骨髓与血片细胞分类计数面板)
          </span>
          <span className="font-mono text-slate-500">
            共找到 <strong className="text-slate-900">{filteredItems.length}</strong> 条标本记录
          </span>
        </div>

        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100/80 text-slate-700 font-semibold border-b border-slate-200 whitespace-nowrap">
                <th className="py-2.5 px-3">镜检状态</th>
                <th className="py-2.5 px-3">标本号</th>
                <th className="py-2.5 px-3">申请单号</th>
                <th className="py-2.5 px-3">病历号/标识</th>
                <th className="py-2.5 px-3">患者姓名</th>
                <th className="py-2.5 px-3">性别/年龄</th>
                <th className="py-2.5 px-3">送检科室</th>
                <th className="py-2.5 px-3">送检医师</th>
                <th className="py-2.5 px-3">临床诊断</th>
                <th className="py-2.5 px-3 text-center">急查</th>
                <th className="py-2.5 px-3">申请时间</th>
                <th className="py-2.5 px-3 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700 whitespace-nowrap">
              {paginatedItems.length === 0 ? (
                <tr>
                  <td colSpan={12} className="text-center py-12 text-slate-400">
                    暂无符合条件的骨髓形态学镜检记录
                  </td>
                </tr>
              ) : (
                paginatedItems.map(item => (
                  <tr
                    key={item.id}
                    onClick={() => handleOpenDetailModal(item)}
                    className="hover:bg-sky-50/70 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-3">
                      {item.status === '未镜检' && (
                        <span className="text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded font-bold text-[11px]">
                          未镜检
                        </span>
                      )}
                      {item.status === '已镜检' && (
                        <span className="text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded font-bold text-[11px]">
                          已镜检
                        </span>
                      )}
                      {item.status === '已审签' && (
                        <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-bold text-[11px]">
                          已审签
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-900">{item.specimenNo}</td>
                    <td className="py-3 px-3 font-mono text-slate-600">{item.applyNo}</td>
                    <td className="py-3 px-3 font-mono text-slate-500">{item.patientId}</td>
                    <td className="py-3 px-3 font-bold text-slate-900 text-sm">{item.patientName}</td>
                    <td className="py-3 px-3 font-medium text-slate-600">{item.gender} · {item.age}</td>
                    <td className="py-3 px-3 font-semibold text-slate-800">{item.department} ({item.bedNo})</td>
                    <td className="py-3 px-3 text-slate-600">{item.doctor}</td>
                    <td className="py-3 px-3 text-slate-800 font-medium max-w-xs truncate">{item.clinicalDiagnosis}</td>
                    <td className="py-3 px-3 text-center">
                      {item.isUrgent ? (
                        <span className="text-rose-600 font-bold bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200 text-[11px]">
                          是
                        </span>
                      ) : (
                        <span className="text-slate-400">否</span>
                      )}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-500">{item.applyTime}</td>
                    <td className="py-3 px-3 text-right space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDetailModal(item);
                        }}
                        className="px-3 py-1 bg-sky-600 hover:bg-sky-700 text-white rounded text-xs font-semibold shadow-2xs transition"
                      >
                        骨髓分类/弹窗
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Strict 10 items per page Pagination */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="text-slate-500">
            显示第 <span className="font-mono font-semibold text-slate-800">{filteredItems.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}</span> 到 <span className="font-mono font-semibold text-slate-800">{Math.min(currentPage * pageSize, filteredItems.length)}</span> 条，共 <span className="font-mono font-semibold text-slate-800">{filteredItems.length}</span> 条数据 (固定 10 条/页)
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-2.5 py-1 bg-white border border-slate-300 rounded hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed text-slate-700 font-medium flex items-center gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>上一页</span>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded font-mono font-bold text-xs ${
                  currentPage === page
                    ? 'bg-sky-600 text-white shadow-2xs'
                    : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-2.5 py-1 bg-white border border-slate-300 rounded hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed text-slate-700 font-medium flex items-center gap-1"
            >
              <span>下一页</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. MODAL POPUP: BONE MARROW CLASSIFICATION & MICROSCOPY WORKSTATION */}
      {/* (Requirement: "把右侧显示的改成弹窗展示，点击左侧的，右侧的信息改成弹窗") */}
      {/* ========================================================================= */}
      {selectedModalItem && modalForm && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-150">
            {/* Modal Header Bar */}
            <div className="px-5 py-3.5 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-sky-500/20 text-sky-400 rounded-lg border border-sky-400/30">
                  <Microscope className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-white tracking-tight">
                      骨髓形态学镜检分析弹窗 —— {modalForm.patientName}
                    </h2>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-sky-900/80 text-sky-300 border border-sky-700">
                      标本号: {modalForm.specimenNo}
                    </span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-900/80 text-amber-300 border border-amber-700">
                      申请单: {modalForm.applyNo}
                    </span>
                  </div>
                  <div className="text-xs text-slate-300 mt-0.5 flex items-center gap-3">
                    <span>{modalForm.patientName} ({modalForm.gender} · {modalForm.age})</span>
                    <span>|</span>
                    <span>{modalForm.department} ({modalForm.bedNo})</span>
                    <span>|</span>
                    <span>送检医生: {modalForm.doctor}</span>
                    <span>|</span>
                    <span className="text-amber-300 font-semibold">诊断: {modalForm.clinicalDiagnosis}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-mono">操纵员: {user.name}</span>
                <button
                  onClick={() => setSelectedModalItem(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="bg-slate-100 border-b border-slate-200 px-5 py-2 flex items-center justify-between shrink-0 text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveModalTab('counts')}
                  className={`px-3.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                    activeModalTab === 'counts'
                      ? 'bg-sky-600 text-white shadow-2xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Table2 className="w-3.5 h-3.5" />
                  <span>细胞分类计数 (髓片/血片)</span>
                </button>
                <button
                  onClick={() => setActiveModalTab('staining')}
                  className={`px-3.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                    activeModalTab === 'staining'
                      ? 'bg-sky-600 text-white shadow-2xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <FlaskConical className="w-3.5 h-3.5" />
                  <span>组化染色与铁染色</span>
                </button>
                <button
                  onClick={() => setActiveModalTab('images')}
                  className={`px-3.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                    activeModalTab === 'images'
                      ? 'bg-sky-600 text-white shadow-2xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>显微图谱库 ({modalForm.microscopyImages.length}张)</span>
                </button>
                <button
                  onClick={() => setActiveModalTab('opinion')}
                  className={`px-3.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                    activeModalTab === 'opinion'
                      ? 'bg-sky-600 text-white shadow-2xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>诊断结论与审签</span>
                </button>
              </div>

              {/* Mode Switch inside Modal */}
              <div className="flex items-center gap-2">
                <span className="text-slate-500 font-medium">当前计数片型:</span>
                <button
                  onClick={() => setCountMode('marrow')}
                  className={`px-3 py-1 rounded font-bold ${
                    countMode === 'marrow'
                      ? 'bg-sky-600 text-white'
                      : 'bg-white text-slate-700 border border-slate-300'
                  }`}
                >
                  髓片
                </button>
                <button
                  onClick={() => setCountMode('blood')}
                  className={`px-3 py-1 rounded font-bold ${
                    countMode === 'blood'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-slate-700 border border-slate-300'
                  }`}
                >
                  血片
                </button>
              </div>
            </div>

            {/* Modal Body Content (Scrollable) */}
            <div className="p-5 flex-1 overflow-y-auto bg-slate-50">
              {/* TAB 1: CELL DIFFERENTIAL COUNTS */}
              {activeModalTab === 'counts' && (
                <div className="space-y-4">
                  <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl flex items-center justify-between text-xs text-sky-900 font-medium">
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-sky-600" />
                      分类计数说明：使用键盘数字键或点击单元格加减号快速计数。标准计数值：髓片200个有核细胞，血片100个。
                    </span>
                    <span className="font-mono text-xs font-bold bg-white px-3 py-1 rounded-lg border border-sky-300">
                      髓片计数值: {modalForm.counts.currentMarrowCount} / {modalForm.counts.marrowTotal} · 血片计数值: {modalForm.counts.currentBloodCount} / {modalForm.counts.bloodTotal}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    {/* Column 1: Granulocyte & Erythroid Systems */}
                    <div className="space-y-3">
                      {/* Granulocyte System */}
                      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
                        <div className="bg-slate-100 p-2.5 font-bold text-slate-800 border-b border-slate-200 flex justify-between">
                          <span>粒细胞系统 (Granulocytes)</span>
                          <span className="text-sky-700 font-mono">占比约 50-65%</span>
                        </div>
                        <div className="p-3 space-y-2">
                          {[
                            { key: 'myeloblast', label: '原始粒细胞' },
                            { key: 'promyelocyte', label: '早幼粒细胞' },
                            { key: 'myelocyteNeutro', label: '中幼粒细胞 (中性)' },
                            { key: 'metamyelocyteNeutro', label: '晚幼粒细胞 (中性)' },
                            { key: 'bandNeutro', label: '杆状核粒细胞 (中性)' },
                            { key: 'segmentedNeutro', label: '分叶核粒细胞 (中性)' },
                            { key: 'myelocyteEos', label: '嗜酸性粒细胞 (中幼)' },
                            { key: 'segmentedEos', label: '嗜酸性粒细胞 (分叶)' },
                            { key: 'segmentedBaso', label: '嗜碱性粒细胞' },
                          ].map(cell => (
                            <div key={cell.key} className="flex items-center justify-between py-1 border-b border-slate-100 last:border-0">
                              <span className="text-slate-700 font-medium">{cell.label}</span>
                              <div className="flex items-center gap-1.5 font-mono">
                                <button
                                  type="button"
                                  onClick={() => handleCellCountChange(cell.key as any, -1)}
                                  className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 flex items-center justify-center"
                                >
                                  -
                                </button>
                                <span className="w-8 text-center font-bold text-slate-900 bg-slate-50 py-0.5 rounded border border-slate-200">
                                  {modalForm.counts[cell.key as keyof CellDifferential] as number}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleCellCountChange(cell.key as any, 1)}
                                  className="w-6 h-6 rounded bg-sky-100 hover:bg-sky-200 font-bold text-sky-800 flex items-center justify-center"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Erythroid System */}
                      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
                        <div className="bg-slate-100 p-2.5 font-bold text-slate-800 border-b border-slate-200 flex justify-between">
                          <span>红细胞系统 (Erythroid System)</span>
                          <span className="text-rose-700 font-mono">占比约 20-25%</span>
                        </div>
                        <div className="p-3 space-y-2">
                          {[
                            { key: 'pronormoblast', label: '原始红细胞' },
                            { key: 'basophilicNormoblast', label: '早幼红细胞' },
                            { key: 'polychromaticNormoblast', label: '中幼红细胞' },
                            { key: 'orthochromaticNormoblast', label: '晚幼红细胞' },
                            { key: 'giantPolychromatic', label: '巨幼样中红细胞' },
                          ].map(cell => (
                            <div key={cell.key} className="flex items-center justify-between py-1 border-b border-slate-100 last:border-0">
                              <span className="text-slate-700 font-medium">{cell.label}</span>
                              <div className="flex items-center gap-1.5 font-mono">
                                <button
                                  type="button"
                                  onClick={() => handleCellCountChange(cell.key as any, -1)}
                                  className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 flex items-center justify-center"
                                >
                                  -
                                </button>
                                <span className="w-8 text-center font-bold text-slate-900 bg-slate-50 py-0.5 rounded border border-slate-200">
                                  {modalForm.counts[cell.key as keyof CellDifferential] as number}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleCellCountChange(cell.key as any, 1)}
                                  className="w-6 h-6 rounded bg-rose-100 hover:bg-rose-200 font-bold text-rose-800 flex items-center justify-center"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Column 2: Lymphocyte, Monocyte, Plasma, Megakaryocyte & Reticular Systems */}
                    <div className="space-y-3">
                      {/* Lymphocyte & Monocyte System */}
                      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
                        <div className="bg-slate-100 p-2.5 font-bold text-slate-800 border-b border-slate-200 flex justify-between">
                          <span>淋巴及单核细胞系 (Lymph/Mono)</span>
                          <span className="text-indigo-700 font-mono">淋巴约 15-20%</span>
                        </div>
                        <div className="p-3 space-y-2">
                          {[
                            { key: 'lymphoblast', label: '原始淋巴细胞' },
                            { key: 'prolymphocyte', label: '幼稚淋巴细胞' },
                            { key: 'matureLymphocyte', label: '成熟淋巴细胞' },
                            { key: 'atypicalLymphocyte', label: '异型淋巴细胞' },
                            { key: 'monoblast', label: '原始单核细胞' },
                            { key: 'matureMonocyte', label: '成熟单核细胞' },
                          ].map(cell => (
                            <div key={cell.key} className="flex items-center justify-between py-1 border-b border-slate-100 last:border-0">
                              <span className="text-slate-700 font-medium">{cell.label}</span>
                              <div className="flex items-center gap-1.5 font-mono">
                                <button
                                  type="button"
                                  onClick={() => handleCellCountChange(cell.key as any, -1)}
                                  className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 flex items-center justify-center"
                                >
                                  -
                                </button>
                                <span className="w-8 text-center font-bold text-slate-900 bg-slate-50 py-0.5 rounded border border-slate-200">
                                  {modalForm.counts[cell.key as keyof CellDifferential] as number}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleCellCountChange(cell.key as any, 1)}
                                  className="w-6 h-6 rounded bg-indigo-100 hover:bg-indigo-200 font-bold text-indigo-800 flex items-center justify-center"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Megakaryocyte & Reticular Systems */}
                      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
                        <div className="bg-slate-100 p-2.5 font-bold text-slate-800 border-b border-slate-200 flex justify-between">
                          <span>巨核细胞系及网状细胞 (Megakaryocytes)</span>
                          <span className="text-purple-700 font-mono">全片计数 7-35个</span>
                        </div>
                        <div className="p-3 space-y-2">
                          {[
                            { key: 'megakaryoblast', label: '原始巨核细胞' },
                            { key: 'promegakaryocyte', label: '幼稚巨核细胞' },
                            { key: 'granularMegakaryocyte', label: '颗粒型巨核细胞' },
                            { key: 'thrombocytogenicMegakaryocyte', label: '产板型巨核细胞' },
                            { key: 'bareNucleusMegakaryocyte', label: '裸核型巨核细胞' },
                            { key: 'maturePlasmacyte', label: '成熟浆细胞' },
                            { key: 'myelomaCell', label: '骨髓瘤细胞' },
                            { key: 'reticularCell', label: '网状细胞/吞噬细胞' },
                          ].map(cell => (
                            <div key={cell.key} className="flex items-center justify-between py-1 border-b border-slate-100 last:border-0">
                              <span className="text-slate-700 font-medium">{cell.label}</span>
                              <div className="flex items-center gap-1.5 font-mono">
                                <button
                                  type="button"
                                  onClick={() => handleCellCountChange(cell.key as any, -1)}
                                  className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 flex items-center justify-center"
                                >
                                  -
                                </button>
                                <span className="w-8 text-center font-bold text-slate-900 bg-slate-50 py-0.5 rounded border border-slate-200">
                                  {modalForm.counts[cell.key as keyof CellDifferential] as number}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleCellCountChange(cell.key as any, 1)}
                                  className="w-6 h-6 rounded bg-purple-100 hover:bg-purple-200 font-bold text-purple-800 flex items-center justify-center"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: CYTOCHEMICAL STAINING */}
              {activeModalTab === 'staining' && (
                <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4 text-xs">
                  <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-200 flex items-center gap-2">
                    <FlaskConical className="w-4 h-4 text-sky-600" />
                    组化染色与铁染色参数 (NAP/POX/PAS/铁染色)
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">NAP 积分值 (0-400)</label>
                        <input
                          type="number"
                          value={modalForm.cytochemical.napScore}
                          onChange={e => setModalForm({
                            ...modalForm,
                            cytochemical: { ...modalForm.cytochemical, napScore: parseInt(e.target.value) || 0 }
                          })}
                          className="w-full border border-slate-300 rounded-lg px-3 py-1.5 font-mono font-bold text-slate-900"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">NAP 阳性率 (%)</label>
                        <input
                          type="text"
                          value={modalForm.cytochemical.napPositiveRate}
                          onChange={e => setModalForm({
                            ...modalForm,
                            cytochemical: { ...modalForm.cytochemical, napPositiveRate: e.target.value }
                          })}
                          className="w-full border border-slate-300 rounded-lg px-3 py-1.5 font-mono text-slate-800"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">POX (过氧化物酶染色)</label>
                        <input
                          type="text"
                          value={modalForm.cytochemical.pox}
                          onChange={e => setModalForm({
                            ...modalForm,
                            cytochemical: { ...modalForm.cytochemical, pox: e.target.value }
                          })}
                          className="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">PAS (糖原染色)</label>
                        <input
                          type="text"
                          value={modalForm.cytochemical.pas}
                          onChange={e => setModalForm({
                            ...modalForm,
                            cytochemical: { ...modalForm.cytochemical, pas: e.target.value }
                          })}
                          className="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-slate-700 font-semibold mb-1">细胞外铁 (Extracellular Iron)</label>
                        <select
                          value={modalForm.cytochemical.extracellularIron}
                          onChange={e => setModalForm({
                            ...modalForm,
                            cytochemical: { ...modalForm.cytochemical, extracellularIron: e.target.value }
                          })}
                          className="w-full border border-slate-300 rounded-lg px-3 py-1.5 font-semibold text-sky-800"
                        >
                          <option value="-">- (阴性)</option>
                          <option value="+">+ (弱阳性)</option>
                          <option value="++">++ (阳性)</option>
                          <option value="+++">+++ (强阳性)</option>
                          <option value="++++">++++ (极强阳性)</option>
                        </select>
                      </div>

                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                        <span className="font-bold text-slate-800 block border-b border-slate-200 pb-1">细胞内铁 (Intracellular Iron 分型 %)</span>
                        <div className="grid grid-cols-3 gap-2 font-mono">
                          <div>
                            <span className="text-slate-500 text-[11px] block">Ⅰ型 (%)</span>
                            <input
                              type="number"
                              value={modalForm.cytochemical.intracellularIron.i}
                              onChange={e => setModalForm({
                                ...modalForm,
                                cytochemical: {
                                  ...modalForm.cytochemical,
                                  intracellularIron: { ...modalForm.cytochemical.intracellularIron, i: parseInt(e.target.value) || 0 }
                                }
                              })}
                              className="w-full border border-slate-300 rounded px-2 py-1 bg-white font-bold"
                            />
                          </div>
                          <div>
                            <span className="text-slate-500 text-[11px] block">Ⅱ型 (%)</span>
                            <input
                              type="number"
                              value={modalForm.cytochemical.intracellularIron.ii}
                              onChange={e => setModalForm({
                                ...modalForm,
                                cytochemical: {
                                  ...modalForm.cytochemical,
                                  intracellularIron: { ...modalForm.cytochemical.intracellularIron, ii: parseInt(e.target.value) || 0 }
                                }
                              })}
                              className="w-full border border-slate-300 rounded px-2 py-1 bg-white font-bold"
                            />
                          </div>
                          <div>
                            <span className="text-slate-500 text-[11px] block">环状铁 (%)</span>
                            <input
                              type="number"
                              value={modalForm.cytochemical.intracellularIron.ring}
                              onChange={e => setModalForm({
                                ...modalForm,
                                cytochemical: {
                                  ...modalForm.cytochemical,
                                  intracellularIron: { ...modalForm.cytochemical.intracellularIron, ring: parseInt(e.target.value) || 0 }
                                }
                              })}
                              className="w-full border border-rose-300 rounded px-2 py-1 bg-rose-50 text-rose-800 font-bold"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: MICROSCOPY IMAGE GALLERY */}
              {activeModalTab === 'images' && (
                <div className="space-y-4 text-xs">
                  <div className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">显微抓拍高清图谱 (100X 油镜 / 40X 视野)</h4>
                      <p className="text-slate-500 text-[11px]">点击图片可全屏放大预览核实典型异型细胞，支持一键采集新图片。</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddSnapshot}
                      className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg shadow-2xs transition flex items-center gap-1.5"
                    >
                      <Camera className="w-4 h-4" />
                      <span>📷 显微采集抓图</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {modalForm.microscopyImages.map((imgUrl, idx) => (
                      <div key={idx} className="relative group rounded-xl overflow-hidden border border-slate-300 bg-slate-900 aspect-video shadow-2xs">
                        <img
                          src={imgUrl}
                          alt={`Microscopy ${idx + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200 cursor-pointer"
                          onClick={() => setPreviewImage(imgUrl)}
                        />
                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => setPreviewImage(imgUrl)}
                            className="p-1.5 bg-white/90 text-slate-900 rounded-full hover:bg-white"
                            title="放大预览"
                          >
                            <Search className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemovePhoto(idx)}
                            className="p-1.5 bg-rose-600 text-white rounded-full hover:bg-rose-700"
                            title="删除图片"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <span className="absolute bottom-1 left-1.5 text-[10px] font-mono bg-black/60 text-white px-1.5 py-0.2 rounded">
                          图谱 #{idx + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: DIAGNOSTIC OPINIONS */}
              {activeModalTab === 'opinion' && (
                <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-800 font-bold mb-1 text-sm">骨髓象拟诊描述意见 *</label>
                    <textarea
                      rows={3}
                      value={modalForm.marrowOpinion}
                      onChange={e => setModalForm({ ...modalForm, marrowOpinion: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg p-3 text-slate-900 leading-relaxed font-medium focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-800 font-bold mb-1 text-sm">血象拟诊描述意见 *</label>
                    <textarea
                      rows={2}
                      value={modalForm.bloodOpinion}
                      onChange={e => setModalForm({ ...modalForm, bloodOpinion: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg p-3 text-slate-900 leading-relaxed font-medium focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-800 font-bold mb-1 text-sm text-sky-700">最终形态学诊断结论 *</label>
                    <input
                      type="text"
                      value={modalForm.diagnosisResult}
                      onChange={e => setModalForm({ ...modalForm, diagnosisResult: e.target.value })}
                      className="w-full border border-sky-300 rounded-lg p-2.5 font-bold text-sky-900 text-sm bg-sky-50/50 focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer Bar */}
            <div className="px-5 py-3 bg-slate-100 border-t border-slate-200 flex items-center justify-between shrink-0 text-xs">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleUpdateStatus('已镜检')}
                  className="px-3.5 py-1.5 bg-blue-50 text-blue-700 border border-blue-300 hover:bg-blue-100 rounded-lg font-semibold transition"
                >
                  标记为已镜检
                </button>
                <button
                  type="button"
                  onClick={() => handleUpdateStatus('已审签')}
                  className="px-3.5 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100 rounded-lg font-semibold transition"
                >
                  放行审签
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedModalItem(null)}
                  className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-medium"
                >
                  关闭
                </button>
                <button
                  type="button"
                  onClick={handleSaveModalUpdates}
                  className="px-5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-bold shadow-2xs transition flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>保存提交</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: IMAGE FULLSCREEN PREVIEW */}
      {previewImage && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-xl bg-slate-900 p-2">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/60 text-white hover:bg-black rounded-full"
            >
              <X className="w-6 h-6" />
            </button>
            <img src={previewImage} alt="Fullscreen Preview" className="max-w-full max-h-[85vh] object-contain rounded-lg" />
          </div>
        </div>
      )}

      {/* MODAL: MANUAL APPLICATION ENTRY */}
      {isManualModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Plus className="w-5 h-5 text-sky-400" />
                <span>手工补录骨髓镜检申请单</span>
              </h3>
              <button onClick={() => setIsManualModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveManual} className="p-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">标本号 *</label>
                  <input
                    type="text"
                    required
                    value={manualForm.specimenNo}
                    onChange={e => setManualForm({ ...manualForm, specimenNo: e.target.value })}
                    className="w-full border border-slate-300 rounded px-3 py-1.5 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">申请单号 *</label>
                  <input
                    type="text"
                    required
                    value={manualForm.applyNo}
                    onChange={e => setManualForm({ ...manualForm, applyNo: e.target.value })}
                    className="w-full border border-slate-300 rounded px-3 py-1.5 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">患者姓名 *</label>
                  <input
                    type="text"
                    required
                    value={manualForm.patientName}
                    onChange={e => setManualForm({ ...manualForm, patientName: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">性别</label>
                  <select
                    value={manualForm.gender}
                    onChange={e => setManualForm({ ...manualForm, gender: e.target.value as any })}
                    className="w-full border border-slate-300 rounded px-2 py-1.5"
                  >
                    <option value="女">女</option>
                    <option value="男">男</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">年龄</label>
                  <input
                    type="text"
                    value={manualForm.age}
                    onChange={e => setManualForm({ ...manualForm, age: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2 py-1.5 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">送检科室与床号</label>
                  <input
                    type="text"
                    value={manualForm.department}
                    onChange={e => setManualForm({ ...manualForm, department: e.target.value })}
                    className="w-full border border-slate-300 rounded px-3 py-1.5 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">送检医生</label>
                  <input
                    type="text"
                    value={manualForm.doctor}
                    onChange={e => setManualForm({ ...manualForm, doctor: e.target.value })}
                    className="w-full border border-slate-300 rounded px-3 py-1.5"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">临床初诊 *</label>
                <textarea
                  rows={2}
                  required
                  value={manualForm.clinicalDiagnosis}
                  onChange={e => setManualForm({ ...manualForm, clinicalDiagnosis: e.target.value })}
                  className="w-full border border-slate-300 rounded px-3 py-1.5 font-medium"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsManualModalOpen(false)}
                  className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-bold shadow-xs"
                >
                  新建并打开分类弹窗
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
