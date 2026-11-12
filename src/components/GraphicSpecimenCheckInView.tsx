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
  PhoneCall,
  SlidersHorizontal,
  Clock,
  ExternalLink,
  ShieldAlert,
  Sparkles,
  Barcode
} from './MenuIcon';
import { UserProfile } from '../types/navigation';
import {
  GraphicSpecimenItem,
  INITIAL_GRAPHIC_SPECIMENS
} from '../data/graphicSpecimenData';

interface GraphicSpecimenCheckInViewProps {
  user: UserProfile;
  triggerAction: (msg: string) => void;
}

export const GraphicSpecimenCheckInView: React.FC<GraphicSpecimenCheckInViewProps> = ({
  user,
  triggerAction,
}) => {
  // Master Dataset State
  const [specimens, setSpecimens] = useState<GraphicSpecimenItem[]>(INITIAL_GRAPHIC_SPECIMENS);

  // Top Bar Search & Filter States
  const [scanApplyNo, setScanApplyNo] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('全部');
  const [departmentFilter, setDepartmentFilter] = useState<string>('全部');
  const [specimenTypeFilter, setSpecimenTypeFilter] = useState<string>('全部');
  const [bedStart, setBedStart] = useState<string>('');
  const [bedEnd, setBedEnd] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('2026-10-25');
  const [endDate, setEndDate] = useState<string>('2026-10-30');
  const [searchBarcode, setSearchBarcode] = useState<string>('');

  // Pagination State (Strict requirement: 10 items per page)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  // Active Selected Item for Modal Detail (Requirement: "能否把右侧显示的改成弹窗展示")
  const [selectedSpecimenModal, setSelectedSpecimenModal] = useState<GraphicSpecimenItem | null>(null);

  // Modal Form State for Patient & Specimen Editing
  const [modalForm, setModalForm] = useState<GraphicSpecimenItem | null>(null);

  // Manual Check-in Modal State
  const [isManualModalOpen, setIsManualModalOpen] = useState<boolean>(false);
  const [manualForm, setManualForm] = useState({
    applyNo: '0901020',
    patientName: '陈志远',
    gender: '男' as '男' | '女',
    age: '46岁',
    patientSource: '门诊' as '门诊' | '住院' | '外部',
    specimenType: '骨髓',
    testProject: '骨髓细胞形态学镜检分析',
    department: '血液科',
    doctorName: '林德胜',
    clinicalDiagnosis: '血小板减少紫癜待查',
  });

  // Unqualified Check-in Modal State
  const [isUnqualifiedModalOpen, setIsUnqualifiedModalOpen] = useState<boolean>(false);
  const [unqualifiedForm, setUnqualifiedForm] = useState({
    specimenId: '',
    applyNo: '0901001',
    patientName: '张珊',
    reason: '标本体外重度溶血 (游离血红蛋白>2.5g/L)',
    contactPerson: '李护士 (病区护士站 8012)',
    remark: '试管采血量不足且发生重度溶血，已电话通知病区退单并重新采血。',
  });

  const handleOpenUnqualifiedModal = (specimen?: GraphicSpecimenItem) => {
    const target = specimen || specimens[0];
    if (target) {
      setUnqualifiedForm({
        specimenId: target.id,
        applyNo: target.applyNo,
        patientName: target.patientName,
        reason: target.unqualifiedReason || '标本体外重度溶血 (游离血红蛋白>2.5g/L)',
        contactPerson: '李护士 (病区护士站 8012)',
        remark: target.unqualifiedRemark || '标本不合格退单，已电话通知临床重新送检',
      });
    }
    setIsUnqualifiedModalOpen(true);
  };

  const handleSaveUnqualified = (e: React.FormEvent) => {
    e.preventDefault();
    if (unqualifiedForm.specimenId) {
      setSpecimens(prev =>
        prev.map(item =>
          item.id === unqualifiedForm.specimenId
            ? {
                ...item,
                qualityStatus: '不合格',
                unqualifiedReason: unqualifiedForm.reason,
                unqualifiedRemark: `${unqualifiedForm.remark} (联系人: ${unqualifiedForm.contactPerson})`,
              }
            : item
        )
      );
      triggerAction(`标本 [${unqualifiedForm.applyNo} - ${unqualifiedForm.patientName}] 已登记为【不合格/退单】`);
    } else {
      triggerAction(`标本 [${unqualifiedForm.applyNo}] 不合格登记成功`);
    }
    setIsUnqualifiedModalOpen(false);
  };

  // Filtered List
  const filteredSpecimens = useMemo(() => {
    return specimens.filter(item => {
      // Status Filter
      if (statusFilter === '已核收' && item.qualityStatus !== '合格') return false;
      if (statusFilter === '不合格' && item.qualityStatus !== '不合格') return false;
      if (statusFilter === '待核收' && item.qualityStatus !== '合格') return false;
      if (statusFilter === '未出' && item.reportStatus !== '未出') return false;

      // Department Filter
      if (departmentFilter !== '全部' && !item.department.includes(departmentFilter)) return false;

      // Specimen Type Filter
      if (specimenTypeFilter !== '全部' && !item.specimenType.includes(specimenTypeFilter)) return false;

      // Bed Number Range
      if (bedStart || bedEnd) {
        const itemBedNum = parseInt((item.bedNo || '').replace(/[^0-9]/g, ''), 10);
        if (!isNaN(itemBedNum)) {
          if (bedStart && itemBedNum < parseInt(bedStart, 10)) return false;
          if (bedEnd && itemBedNum > parseInt(bedEnd, 10)) return false;
        }
      }

      // Scan Apply No Filter
      if (scanApplyNo.trim()) {
        const kw = scanApplyNo.trim().toLowerCase();
        if (!item.applyNo.toLowerCase().includes(kw) && !item.specimenNo.toLowerCase().includes(kw)) {
          return false;
        }
      }

      // Barcode Search
      if (searchBarcode.trim()) {
        const kw = searchBarcode.trim().toLowerCase();
        const match =
          item.applyNo.toLowerCase().includes(kw) ||
          item.specimenNo.toLowerCase().includes(kw) ||
          item.patientName.toLowerCase().includes(kw) ||
          item.patientId.toLowerCase().includes(kw);
        if (!match) return false;
      }

      return true;
    });
  }, [specimens, statusFilter, departmentFilter, specimenTypeFilter, bedStart, bedEnd, scanApplyNo, searchBarcode]);

  // Paginated List
  const totalPages = Math.ceil(filteredSpecimens.length / pageSize) || 1;
  const paginatedSpecimens = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredSpecimens.slice(start, start + pageSize);
  }, [filteredSpecimens, currentPage, pageSize]);

  // Handle Query
  const handleQuery = () => {
    setCurrentPage(1);
    triggerAction(`查询图文标本核收记录 (状态: ${statusFilter}, 关键字: ${searchBarcode || scanApplyNo || '全部'})`);
  };

  // Scan or Enter Apply No Check-in
  const handleScanCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scanApplyNo.trim()) return;
    const found = specimens.find(s => s.applyNo === scanApplyNo.trim() || s.specimenNo === scanApplyNo.trim());
    if (found) {
      setSelectedSpecimenModal(found);
      setModalForm({ ...found });
      triggerAction(`扫码核收成功，弹出患者 [${found.patientName}] 标本核收详情`);
    } else {
      triggerAction(`未找到单号为 ${scanApplyNo} 的申请单，请使用手工核收`);
    }
  };

  // Open Detail Modal (Requirement: Click row -> open modal)
  const handleOpenDetailModal = (item: GraphicSpecimenItem) => {
    setSelectedSpecimenModal(item);
    setModalForm({ ...item });
  };

  // Save Modal Form Changes
  const handleSaveModalForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalForm || !selectedSpecimenModal) return;

    setSpecimens(prev =>
      prev.map(s => (s.id === modalForm.id ? { ...modalForm, checkInTime: '2026-10-30 11:50:00' } : s))
    );
    setSelectedSpecimenModal({ ...modalForm, checkInTime: '2026-10-30 11:50:00' });
    triggerAction(`保存并更新患者 [${modalForm.patientName}] 标本核收信息`);
    alert(`患者 [${modalForm.patientName}] 的标本核收与临床信息已更新保存！`);
  };

  // Unpair / Cancel Check-in
  const handleCancelCheckIn = (id: string) => {
    if (window.confirm('确定撤销该标本的核收状态吗？')) {
      setSpecimens(prev =>
        prev.map(s => (s.id === id ? { ...s, reportStatus: '未出', qualityStatus: '合格' } : s))
      );
      if (selectedSpecimenModal?.id === id) {
        setSelectedSpecimenModal(null);
      }
      triggerAction('撤销标本核收状态成功');
    }
  };

  // Mark Unqualified
  const handleMarkUnqualified = (id: string) => {
    const reason = prompt('请输入标本不合格拒收理由:', '标本体外溶血/凝块污染');
    if (reason !== null) {
      setSpecimens(prev =>
        prev.map(s =>
          s.id === id
            ? { ...s, qualityStatus: '不合格', unqualifiedReason: reason, unqualifiedRemark: '已通知临床重新采血' }
            : s
        )
      );
      if (selectedSpecimenModal?.id === id) {
        setSelectedSpecimenModal(prev => (prev ? { ...prev, qualityStatus: '不合格', unqualifiedReason: reason } : null));
      }
      triggerAction(`登记标本不合格: ${reason}`);
    }
  };

  // Handle Save Manual Check-in Modal
  const handleSaveManualCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: GraphicSpecimenItem = {
      id: `GSP-${Date.now()}`,
      reportStatus: '未出',
      qualityStatus: '合格',
      patientSource: manualForm.patientSource,
      applyNo: manualForm.applyNo,
      specimenNo: `540${Math.floor(400 + Math.random() * 500)}`,
      patientId: `P2026${Math.floor(1020 + Math.random() * 8000)}`,
      patientName: manualForm.patientName,
      gender: manualForm.gender,
      age: manualForm.age,
      specimenType: manualForm.specimenType,
      testProject: manualForm.testProject,
      department: manualForm.department,
      applyTime: '2026-10-30 11:30:00',
      checkInTime: '2026-10-30 11:55:00',
      isUrgent: false,
      phone: '13800001122',
      doctorName: manualForm.doctorName,
      doctorPhone: '13800001123',
      nursePhone: '028-85783783',
      bedNo: '16床',
      clinicalDiagnosis: manualForm.clinicalDiagnosis,
      collectionPart: '髂后上棘穿刺',
      appearance: '正常样标本',
      collectionTime: '2026-10-30 11:10',
      deliveryTime: '2026-10-30 11:30',
    };

    setSpecimens(prev => [newItem, ...prev]);
    setIsManualModalOpen(false);
    setSelectedSpecimenModal(newItem);
    setModalForm({ ...newItem });
    triggerAction(`手工核收新标本: ${newItem.patientName} (${newItem.applyNo})`);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-800 font-sans p-4 overflow-y-auto space-y-4">


      {/* 3. Rounded Pill Toolbar (Exact match to screenshot image_760cc568.png filter row) */}
      <div className="bg-white border border-slate-200/90 rounded-xl px-4 py-2.5 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-y-2 gap-x-3 text-xs">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-slate-700">
            {/* Ward Select Pill */}
            <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
              <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="text-slate-500 font-medium">病区</span>
              <select
                value={departmentFilter}
                onChange={e => setDepartmentFilter(e.target.value)}
                className="bg-transparent font-medium text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="全部">全部病区</option>
                <option value="内一科">内一科</option>
                <option value="血液内科">血液内科</option>
                <option value="肾内科">肾内科</option>
                <option value="门诊处">门诊处</option>
              </select>
            </div>

            {/* Date Range Pill */}
            <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
              <CalendarCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="text-slate-500 font-medium">开单时间</span>
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="bg-transparent font-mono text-slate-800 focus:outline-none text-xs w-28"
              />
              <span className="text-slate-400">~</span>
              <input
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="bg-transparent font-mono text-slate-800 focus:outline-none text-xs w-28"
              />
            </div>

            {/* Specimen Dropdown Pill */}
            <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
              <span className="text-slate-500 font-medium">标本</span>
              <select
                value={specimenTypeFilter}
                onChange={e => setSpecimenTypeFilter(e.target.value)}
                className="bg-transparent font-medium text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="全部">所有标本</option>
                <option value="骨髓">骨髓</option>
                <option value="尿液">尿液</option>
                <option value="全血">全血</option>
              </select>
            </div>

            {/* Method Dropdown Pill */}
            <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
              <span className="text-slate-500 font-medium">方式</span>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="bg-transparent font-medium text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="全部">所有方式</option>
                <option value="已核收">合格(已核收)</option>
                <option value="不合格">不合格(已拒收)</option>
                <option value="未出">未出报告</option>
              </select>
            </div>

            {/* Bed Number Range Pill */}
            <div className="flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
              <span className="text-slate-500 font-medium">床号</span>
              <input
                type="text"
                placeholder="起"
                value={bedStart}
                onChange={e => setBedStart(e.target.value)}
                className="w-10 bg-transparent text-center font-mono text-slate-800 focus:outline-none"
              />
              <span className="text-slate-400">-</span>
              <input
                type="text"
                placeholder="止"
                value={bedEnd}
                onChange={e => setBedEnd(e.target.value)}
                className="w-10 bg-transparent text-center font-mono text-slate-800 focus:outline-none"
              />
            </div>

            {/* Search Input Pill */}
            <div className="relative flex items-center">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5" />
              <input
                type="text"
                placeholder="姓名、床号、条码号/申请单..."
                value={searchBarcode}
                onChange={e => setSearchBarcode(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleQuery()}
                className="pl-8 pr-3 py-1 bg-slate-50 hover:bg-white border border-slate-200 rounded-lg text-xs w-52 focus:outline-none focus:ring-1 focus:ring-sky-500 transition-all"
              />
            </div>

            {/* Search Buttons */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleQuery}
                className="px-3 py-1 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg shadow-2xs transition-colors flex items-center gap-1"
              >
                <Search className="w-3.5 h-3.5" />
                <span>查询</span>
              </button>
              <button
                onClick={() => {
                  setSearchBarcode('');
                  setDepartmentFilter('全部');
                  setSpecimenTypeFilter('全部');
                  setStatusFilter('全部');
                  setBedStart('');
                  setBedEnd('');
                  triggerAction('筛选参数已重置');
                }}
                className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg border border-slate-200 transition-colors"
                title="重置筛选"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Top Action Toolbar - Unified styling with 手工登记 and 不合格登记 */}
      <div className="bg-white rounded-xl border border-slate-200 p-2.5 shadow-xs flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsManualModalOpen(true)}
            className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-md shadow-2xs transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>手工登记</span>
          </button>
          <button
            onClick={() => handleOpenUnqualifiedModal()}
            className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-300 text-rose-700 font-semibold rounded-md transition-colors flex items-center gap-1.5"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            <span>不合格登记</span>
          </button>
          <button
            onClick={() => triggerAction('查看选中标本的图文形态学报告')}
            className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-medium rounded-md transition-colors flex items-center gap-1"
          >
            <FileText className="w-3.5 h-3.5 text-sky-600" />
            <span>查看报告</span>
          </button>
          <button
            onClick={() => handleCancelCheckIn(paginatedSpecimens[0]?.id || '')}
            className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-medium rounded-md transition-colors flex items-center gap-1"
          >
            <X className="w-3.5 h-3.5 text-slate-500" />
            <span>撤销核收</span>
          </button>
          <button
            onClick={() => triggerAction('打开高倍显微镜图像增强编辑与测量窗口')}
            className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-medium rounded-md transition-colors flex items-center gap-1"
          >
            <Edit2 className="w-3.5 h-3.5 text-sky-600" />
            <span>图像编辑</span>
          </button>
          <button
            onClick={() => triggerAction('拉取HIS患者既往病史与临床用药信息')}
            className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-medium rounded-md transition-colors flex items-center gap-1"
          >
            <FileText className="w-3.5 h-3.5 text-emerald-600" />
            <span>临床信息</span>
          </button>
          <button
            onClick={() => triggerAction('补登特种染色/免疫组化费用明细')}
            className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-medium rounded-md transition-colors flex items-center gap-1"
          >
            <Printer className="w-3.5 h-3.5 text-amber-600" />
            <span>补费补单</span>
          </button>
          <button
            onClick={() => triggerAction('开启前后两次同名患者图谱历史对比模式')}
            className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-medium rounded-md transition-colors flex items-center gap-1"
          >
            <Activity className="w-3.5 h-3.5 text-indigo-600" />
            <span>标本对比</span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1 text-[11px] font-mono bg-slate-100 px-2.5 py-1 rounded-md text-slate-600">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            今日已筛选 {filteredSpecimens.length} 例标本
          </span>
        </div>
      </div>

      {/* Main Specimen Table View (Left list rendered directly on main page) */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <span className="font-bold text-slate-800 flex items-center gap-1.5">
            <Table2 className="w-4 h-4 text-sky-600" />
            标本核收列表
          </span>
          <span>共找到 {filteredSpecimens.length} 条标本记录</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100/80 text-slate-700 font-semibold border-b border-slate-200 whitespace-nowrap">
                <th className="py-2.5 px-3">报告状态</th>
                <th className="py-2.5 px-3">合格状态</th>
                <th className="py-2.5 px-3">患者来源</th>
                <th className="py-2.5 px-3">申请单号</th>
                <th className="py-2.5 px-3">标本号</th>
                <th className="py-2.5 px-3">病历号/标识</th>
                <th className="py-2.5 px-3">姓名</th>
                <th className="py-2.5 px-3">标本</th>
                <th className="py-2.5 px-3">检验项目</th>
                <th className="py-2.5 px-3">单位/科室</th>
                <th className="py-2.5 px-3">申请时间</th>
                <th className="py-2.5 px-3">核收时间</th>
                <th className="py-2.5 px-3 text-center">紧急</th>
                <th className="py-2.5 px-3 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700 whitespace-nowrap">
              {paginatedSpecimens.length === 0 ? (
                <tr>
                  <td colSpan={14} className="text-center py-12 text-slate-400">
                    暂无符合条件的图文标本核收记录
                  </td>
                </tr>
              ) : (
                paginatedSpecimens.map(item => (
                  <tr
                    key={item.id}
                    onClick={() => handleOpenDetailModal(item)}
                    className="hover:bg-sky-50/60 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-3">
                      {item.reportStatus === '未出' && (
                        <span className="text-slate-500 font-medium">未出</span>
                      )}
                      {item.reportStatus === '已出' && (
                        <span className="text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded font-bold text-[11px]">
                          已出
                        </span>
                      )}
                      {item.reportStatus === '已审' && (
                        <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-bold text-[11px]">
                          已审
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      {item.qualityStatus === '合格' ? (
                        <span className="text-emerald-600 font-semibold">合格</span>
                      ) : (
                        <span className="text-amber-600 font-bold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                          不合格
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-600">{item.patientSource}</td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-900">{item.applyNo}</td>
                    <td className="py-3 px-3 font-mono text-slate-600">{item.specimenNo}</td>
                    <td className="py-3 px-3 font-mono text-slate-500">{item.patientId}</td>
                    <td className="py-3 px-3 font-bold text-slate-900">{item.patientName}</td>
                    <td className="py-3 px-3 font-medium text-slate-800">{item.specimenType}</td>
                    <td className="py-3 px-3 font-semibold text-slate-800">{item.testProject}</td>
                    <td className="py-3 px-3 text-slate-600">{item.department}</td>
                    <td className="py-3 px-3 font-mono text-slate-500">{item.applyTime}</td>
                    <td className="py-3 px-3 font-mono text-slate-500">{item.checkInTime}</td>
                    <td className="py-3 px-3 text-center">
                      {item.isUrgent ? (
                        <span className="text-rose-600 font-bold bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                          是
                        </span>
                      ) : (
                        <span className="text-slate-400">否</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDetailModal(item);
                        }}
                        className="px-2.5 py-1 bg-sky-600 hover:bg-sky-700 text-white rounded text-xs font-medium transition"
                      >
                        查看/编辑详情
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCancelCheckIn(item.id);
                        }}
                        className="text-slate-600 hover:text-slate-800 font-medium"
                      >
                        撤销
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
          <div className="font-semibold text-sky-700">
            合计: {filteredSpecimens.length} 条数据 (当前第 {currentPage}/{totalPages} 页，每页 {pageSize} 条)
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
                    ? 'bg-sky-600 text-white border-sky-600'
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

      {/* MODAL POPUP FOR PATIENT & SPECIMEN DETAILS (Requirement: "能否把右侧显示的改成弹窗展示") */}
      {selectedSpecimenModal && modalForm && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-4xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-150">
            {/* Modal Header */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-sky-600/30 text-sky-400 rounded-lg border border-sky-500/30">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold flex items-center gap-2">
                    标本核收与患者信息详情 - {modalForm.patientName}
                    <span className="text-xs font-mono font-normal bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                      申请单: {modalForm.applyNo}
                    </span>
                    {modalForm.isUrgent && (
                      <span className="text-xs font-bold bg-rose-600 text-white px-2 py-0.5 rounded">
                        急诊标本
                      </span>
                    )}
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    标本号: {modalForm.specimenNo} | 来源: {modalForm.patientSource} | 检验项目: {modalForm.testProject}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedSpecimenModal(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content Body - Split into 2 Columns: 患者信息 & 标本信息 (Matching screenshot) */}
            <form onSubmit={handleSaveModalForm} className="p-5 overflow-y-auto flex-1 bg-slate-50 space-y-5 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* LEFT SECTION: 患者信息 */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3 shadow-2xs">
                  <h3 className="font-bold text-slate-800 text-sm border-b border-slate-200 pb-2 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <User className="w-4 h-4 text-sky-600" />
                      患者基本信息
                    </span>
                    {modalForm.isUrgent && (
                      <span className="text-rose-600 font-bold border border-rose-300 bg-rose-50 px-2 py-0.5 rounded text-[11px]">
                        急
                      </span>
                    )}
                  </h3>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-600 font-medium mb-1">患者来源</label>
                      <select
                        value={modalForm.patientSource}
                        onChange={e => setModalForm({ ...modalForm, patientSource: e.target.value as any })}
                        className="w-full border border-slate-300 rounded px-2.5 py-1.5 bg-slate-50 font-medium"
                      >
                        <option value="外来">外来</option>
                        <option value="门诊">门诊</option>
                        <option value="住院">住院</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-600 font-medium mb-1">姓名 *</label>
                      <input
                        type="text"
                        required
                        value={modalForm.patientName}
                        onChange={e => setModalForm({ ...modalForm, patientName: e.target.value })}
                        className="w-full border border-slate-300 rounded px-2.5 py-1.5 font-bold text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-600 font-medium mb-1">年龄</label>
                      <input
                        type="text"
                        value={modalForm.age}
                        onChange={e => setModalForm({ ...modalForm, age: e.target.value })}
                        className="w-full border border-slate-300 rounded px-2.5 py-1.5 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 font-medium mb-1">性别</label>
                      <div className="flex items-center space-x-3 pt-1.5">
                        <label className="flex items-center space-x-1 cursor-pointer">
                          <input
                            type="radio"
                            name="gender"
                            checked={modalForm.gender === '男'}
                            onChange={() => setModalForm({ ...modalForm, gender: '男' })}
                          />
                          <span>男</span>
                        </label>
                        <label className="flex items-center space-x-1 cursor-pointer">
                          <input
                            type="radio"
                            name="gender"
                            checked={modalForm.gender === '女'}
                            onChange={() => setModalForm({ ...modalForm, gender: '女' })}
                          />
                          <span>女</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-600 font-medium mb-1">联系电话</label>
                    <input
                      type="text"
                      value={modalForm.phone}
                      onChange={e => setModalForm({ ...modalForm, phone: e.target.value })}
                      className="w-full border border-slate-300 rounded px-2.5 py-1.5 font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-600 font-medium mb-1">送检单位/科室</label>
                      <input
                        type="text"
                        value={modalForm.department}
                        onChange={e => setModalForm({ ...modalForm, department: e.target.value })}
                        className="w-full border border-slate-300 rounded px-2.5 py-1.5"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 font-medium mb-1">送检医生</label>
                      <input
                        type="text"
                        value={modalForm.doctorName}
                        onChange={e => setModalForm({ ...modalForm, doctorName: e.target.value })}
                        className="w-full border border-slate-300 rounded px-2.5 py-1.5 font-bold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-slate-600 font-medium mb-1">床号</label>
                      <input
                        type="text"
                        value={modalForm.bedNo}
                        onChange={e => setModalForm({ ...modalForm, bedNo: e.target.value })}
                        className="w-full border border-slate-300 rounded px-2 py-1.5 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 font-medium mb-1">医生电话</label>
                      <input
                        type="text"
                        value={modalForm.doctorPhone}
                        onChange={e => setModalForm({ ...modalForm, doctorPhone: e.target.value })}
                        className="w-full border border-slate-300 rounded px-2 py-1.5 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 font-medium mb-1">护士电话</label>
                      <input
                        type="text"
                        value={modalForm.nursePhone}
                        onChange={e => setModalForm({ ...modalForm, nursePhone: e.target.value })}
                        className="w-full border border-slate-300 rounded px-2 py-1.5 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-600 font-medium mb-1">临床诊断</label>
                    <textarea
                      rows={2}
                      value={modalForm.clinicalDiagnosis}
                      onChange={e => setModalForm({ ...modalForm, clinicalDiagnosis: e.target.value })}
                      className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-slate-800"
                    />
                  </div>
                </div>

                {/* RIGHT SECTION: 标本信息 */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3 shadow-2xs">
                  <h3 className="font-bold text-slate-800 text-sm border-b border-slate-200 pb-2 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Barcode className="w-4 h-4 text-sky-600" />
                      标本采样与品质信息
                    </span>
                    <span className="text-slate-400 font-mono font-normal">
                      标本号: {modalForm.specimenNo}
                    </span>
                  </h3>

                  <div>
                    <label className="block text-slate-600 font-medium mb-1">检验项目</label>
                    <input
                      type="text"
                      value={modalForm.testProject}
                      onChange={e => setModalForm({ ...modalForm, testProject: e.target.value })}
                      className="w-full border border-slate-300 rounded px-2.5 py-1.5 font-semibold text-slate-900"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-600 font-medium mb-1">标本类型</label>
                      <select
                        value={modalForm.specimenType}
                        onChange={e => setModalForm({ ...modalForm, specimenType: e.target.value })}
                        className="w-full border border-slate-300 rounded px-2.5 py-1.5"
                      >
                        <option value="骨髓">骨髓</option>
                        <option value="血液">血液</option>
                        <option value="外周血">外周血</option>
                        <option value="尿液">尿液</option>
                        <option value="脑脊液">脑脊液</option>
                        <option value="胸腹水">胸腹水</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-600 font-medium mb-1">采集部位</label>
                      <input
                        type="text"
                        value={modalForm.collectionPart}
                        onChange={e => setModalForm({ ...modalForm, collectionPart: e.target.value })}
                        className="w-full border border-slate-300 rounded px-2.5 py-1.5"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-600 font-medium mb-1">标本外观评估</label>
                    <input
                      type="text"
                      value={modalForm.appearance}
                      onChange={e => setModalForm({ ...modalForm, appearance: e.target.value })}
                      className="w-full border border-slate-300 rounded px-2.5 py-1.5"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-slate-600 font-medium mb-1">采集时间</label>
                      <input
                        type="text"
                        value={modalForm.collectionTime}
                        onChange={e => setModalForm({ ...modalForm, collectionTime: e.target.value })}
                        className="w-full border border-slate-300 rounded px-2 py-1.5 font-mono text-[11px]"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 font-medium mb-1">送检时间</label>
                      <input
                        type="text"
                        value={modalForm.deliveryTime}
                        onChange={e => setModalForm({ ...modalForm, deliveryTime: e.target.value })}
                        className="w-full border border-slate-300 rounded px-2 py-1.5 font-mono text-[11px]"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 font-medium mb-1">签收核收时间</label>
                      <input
                        type="text"
                        value={modalForm.checkInTime}
                        onChange={e => setModalForm({ ...modalForm, checkInTime: e.target.value })}
                        className="w-full border border-slate-300 rounded px-2 py-1.5 font-mono text-[11px] bg-slate-100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-600 font-medium mb-1">不合格理由 (若有)</label>
                    <input
                      type="text"
                      placeholder="如: 标本体外溶血/稀释凝块"
                      value={modalForm.unqualifiedReason || ''}
                      onChange={e => setModalForm({ ...modalForm, unqualifiedReason: e.target.value })}
                      className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-rose-700 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 font-medium mb-1">不合格处置备注</label>
                    <textarea
                      rows={2}
                      placeholder="记录与临床科室沟通结果..."
                      value={modalForm.unqualifiedRemark || ''}
                      onChange={e => setModalForm({ ...modalForm, unqualifiedRemark: e.target.value })}
                      className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => handleCancelCheckIn(modalForm.id)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-medium"
                  >
                    撤销核收
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMarkUnqualified(modalForm.id)}
                    className="px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded font-medium"
                  >
                    标记不合格
                  </button>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setSelectedSpecimenModal(null)}
                    className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded font-medium"
                  >
                    关闭
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold shadow-xs transition"
                  >
                    保存更新
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: MANUAL CHECK-IN */}
      {isManualModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-base">手工补录核收标本</h3>
              <button onClick={() => setIsManualModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveManualCheckIn} className="p-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
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
                <div>
                  <label className="block text-slate-700 font-medium mb-1">患者姓名 *</label>
                  <input
                    type="text"
                    required
                    value={manualForm.patientName}
                    onChange={e => setManualForm({ ...manualForm, patientName: e.target.value })}
                    className="w-full border border-slate-300 rounded px-3 py-1.5 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">性别</label>
                  <select
                    value={manualForm.gender}
                    onChange={e => setManualForm({ ...manualForm, gender: e.target.value as any })}
                    className="w-full border border-slate-300 rounded px-2 py-1.5"
                  >
                    <option value="男">男</option>
                    <option value="女">女</option>
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
                <div>
                  <label className="block text-slate-700 font-medium mb-1">患者来源</label>
                  <select
                    value={manualForm.patientSource}
                    onChange={e => setManualForm({ ...manualForm, patientSource: e.target.value as any })}
                    className="w-full border border-slate-300 rounded px-2 py-1.5"
                  >
                    <option value="门诊">门诊</option>
                    <option value="住院">住院</option>
                    <option value="外部">外部</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">检验项目名称 *</label>
                <input
                  type="text"
                  required
                  value={manualForm.testProject}
                  onChange={e => setManualForm({ ...manualForm, testProject: e.target.value })}
                  className="w-full border border-slate-300 rounded px-3 py-1.5 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">标本类型</label>
                  <select
                    value={manualForm.specimenType}
                    onChange={e => setManualForm({ ...manualForm, specimenType: e.target.value })}
                    className="w-full border border-slate-300 rounded px-3 py-1.5"
                  >
                    <option value="骨髓">骨髓</option>
                    <option value="血液">血液</option>
                    <option value="尿液">尿液</option>
                    <option value="脑脊液">脑脊液</option>
                    <option value="胸腹水">胸腹水</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">送检科室</label>
                  <input
                    type="text"
                    value={manualForm.department}
                    onChange={e => setManualForm({ ...manualForm, department: e.target.value })}
                    className="w-full border border-slate-300 rounded px-3 py-1.5"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">临床初步诊断</label>
                <textarea
                  rows={2}
                  value={manualForm.clinicalDiagnosis}
                  onChange={e => setManualForm({ ...manualForm, clinicalDiagnosis: e.target.value })}
                  className="w-full border border-slate-300 rounded px-3 py-1.5"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsManualModalOpen(false)}
                  className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-medium"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded font-medium shadow-xs"
                >
                  完成核收
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: UNQUALIFIED SPECIMEN REGISTRATION */}
      {isUnqualifiedModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-150">
            <div className="p-4 bg-rose-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-base">
                <AlertTriangle className="w-5 h-5 text-rose-300" />
                <span>不合格标本登记与退单处置</span>
              </div>
              <button onClick={() => setIsUnqualifiedModalOpen(false)} className="text-rose-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUnqualified} className="p-4 space-y-3.5 text-xs">
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center justify-between">
                <div>
                  <span className="text-slate-500 block text-[11px]">当前选定处置标本</span>
                  <span className="font-bold text-slate-900 text-sm">
                    {unqualifiedForm.patientName} ({unqualifiedForm.applyNo})
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-rose-700 font-bold bg-rose-100 border border-rose-300 px-2 py-0.5 rounded text-[11px]">
                    质量异常待退单
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">选择处置标本记录</label>
                <select
                  value={unqualifiedForm.specimenId}
                  onChange={e => {
                    const sel = specimens.find(s => s.id === e.target.value);
                    if (sel) {
                      setUnqualifiedForm({
                        ...unqualifiedForm,
                        specimenId: sel.id,
                        applyNo: sel.applyNo,
                        patientName: sel.patientName,
                        reason: sel.unqualifiedReason || unqualifiedForm.reason,
                      });
                    }
                  }}
                  className="w-full border border-slate-300 rounded-lg px-3 py-1.5 font-medium text-slate-800"
                >
                  {specimens.map(s => (
                    <option key={s.id} value={s.id}>
                      [{s.applyNo}] {s.patientName} - {s.specimenType} ({s.testProject})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">不合格判定具体原因 *</label>
                <select
                  value={unqualifiedForm.reason}
                  onChange={e => setUnqualifiedForm({ ...unqualifiedForm, reason: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-1.5 font-bold text-rose-700 bg-rose-50/50"
                >
                  <option value="标本体外重度溶血 (游离血红蛋白>2.5g/L)">标本体外重度溶血 (游离血红蛋白&gt;2.5g/L)</option>
                  <option value="标本有微小凝块 / 纤维蛋白析出">标本有微小凝块 / 纤维蛋白析出</option>
                  <option value="标本采血量不足 (<1.0ml)">标本采血量不足 (&lt;1.0ml)</option>
                  <option value="采集试管容器错误 (错用抗凝管)">采集试管容器错误 (错用抗凝管)</option>
                  <option value="条码标签模糊/损坏/姓名不符">条码标签模糊/损坏/姓名不符</option>
                  <option value="标本送检超时 (>4小时未送达)">标本送检超时 (&gt;4小时未送达)</option>
                  <option value="骨髓涂片干枯/有核细胞损坏">骨髓涂片干枯/有核细胞损坏</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">临床科室接收通知人与联系电话</label>
                <input
                  type="text"
                  required
                  placeholder="如: 李护士 (病区护士站 8012)"
                  value={unqualifiedForm.contactPerson}
                  onChange={e => setUnqualifiedForm({ ...unqualifiedForm, contactPerson: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-1.5"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">沟通备注与处置意见</label>
                <textarea
                  rows={3}
                  required
                  placeholder="详细记录沟通时间、异常情况评估及重新定量采血指导说明..."
                  value={unqualifiedForm.remark}
                  onChange={e => setUnqualifiedForm({ ...unqualifiedForm, remark: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsUnqualifiedModalOpen(false)}
                  className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold shadow-xs transition"
                >
                  确认登记不合格并退单
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
