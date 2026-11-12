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
  Printer,
  CalendarCheck,
  User,
  Clock,
  ExternalLink,
  ShieldAlert,
  Sparkles,
  QrCode,
  CreditCard,
  FlaskConical,
  Activity,
  Dna,
  XCircle,
  FileCheck,
  Sliders,
  DollarSign
} from 'lucide-react';
import {
  MicrobiologySpecimenItem,
  INITIAL_MICROBIOLOGY_SPECIMENS
} from '../data/microbiologySpecimenData';
import { UserProfile } from '../types/navigation';

interface MicrobiologySpecimenCheckInViewProps {
  user?: UserProfile;
  triggerAction: (msg: string) => void;
}

export const MicrobiologySpecimenCheckInView: React.FC<MicrobiologySpecimenCheckInViewProps> = ({
  user,
  triggerAction,
}) => {
  // Master Dataset State
  const [specimens, setSpecimens] = useState<MicrobiologySpecimenItem[]>(INITIAL_MICROBIOLOGY_SPECIMENS);

  // Top Bar Search & Barcode States
  const [barcodeInput, setBarcodeInput] = useState('');
  const [statusFilter, setStatusFilter] = useState('全部');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [startDate, setStartDate] = useState('2026-10-01');
  const [endDate, setEndDate] = useState('2026-10-30');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Pagination State (Strict requirement: 10 items per page)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  // Active Selected Item for Modal Detail (Requirement: 点击左侧的信息，右侧内容改成弹窗展示)
  const [selectedSpecimenModal, setSelectedSpecimenModal] = useState<MicrobiologySpecimenItem | null>(null);

  // Auxiliary Modals State
  const [isManualModalOpen, setIsManualModalOpen] = useState<boolean>(false);
  const [isUnqualifiedModalOpen, setIsUnqualifiedModalOpen] = useState<boolean>(false);
  const [isFeeModalOpen, setIsFeeModalOpen] = useState<boolean>(false);

  // Forms State
  const [manualForm, setManualForm] = useState({
    barcode: '2012320012888',
    patientName: '陈志远',
    gender: '男' as '男' | '女',
    age: '46岁',
    department: '血液内科',
    doctor: '林德胜主任',
    testItem: '咽拭子真菌与细菌培养',
    sampleType: '咽拭子',
    clinicalDiagnosis: '免疫低下列发热待查',
  });

  const [unqualifiedForm, setUnqualifiedForm] = useState({
    sampleNo: 'B01001',
    patientName: '张立国',
    reason: '血培养瓶抽血量不足 (<5mL)',
    remark: '已电话联系血液内科护士站重新取瓶抽血',
  });

  const [feeForm, setFeeForm] = useState({
    feeName: '无菌部位体液厌氧菌加做培养',
    amount: 80.00,
  });

  // Filtered dataset
  const filteredSpecimens = useMemo(() => {
    return specimens.filter(item => {
      // Status filter
      if (statusFilter !== '全部' && item.checkInStatus !== statusFilter) {
        return false;
      }

      // Keyword filter (barcode, sampleNo, patientId, patientName, testItem)
      if (searchKeyword.trim()) {
        const kw = searchKeyword.trim().toLowerCase();
        const matchBarcode = item.barcode.toLowerCase().includes(kw);
        const matchSample = item.sampleNo.toLowerCase().includes(kw);
        const matchId = item.patientId.toLowerCase().includes(kw);
        const matchName = item.patientName.toLowerCase().includes(kw);
        const matchItem = item.testItem.toLowerCase().includes(kw);
        const matchDept = item.department.toLowerCase().includes(kw);
        if (!matchBarcode && !matchSample && !matchId && !matchName && !matchItem && !matchDept) {
          return false;
        }
      }

      return true;
    });
  }, [specimens, statusFilter, searchKeyword]);

  // Paginated data
  const totalPages = Math.ceil(filteredSpecimens.length / pageSize) || 1;
  const paginatedSpecimens = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredSpecimens.slice(start, start + pageSize);
  }, [filteredSpecimens, currentPage, pageSize]);

  // Select all handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(paginatedSpecimens.map(i => i.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // Barcode Submit Handler
  const handleBarcodeSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = barcodeInput.trim();
    if (!query) {
      triggerAction('请扫描或输入微生物试管采集条码');
      return;
    }

    const found = specimens.find(
      s => s.barcode === query || s.sampleNo === query || s.patientName === query
    );

    if (found) {
      setSelectedSpecimenModal(found);
      if (found.checkInStatus === '待核收') {
        setSpecimens(prev =>
          prev.map(s => (s.id === found.id ? { ...s, checkInStatus: '已核收', checkInTime: '2026-10-30 11:20:00' } : s))
        );
        triggerAction(`扫码核收成功：标本 [${found.sampleNo} - ${found.patientName}] 已准入上机！`);
      } else {
        triggerAction(`已精准定位标本记录：[${found.sampleNo}] ${found.patientName}`);
      }
      setBarcodeInput('');
    } else {
      triggerAction(`未检索到条码 [${query}]，请使用【+手工】添加新标本`);
    }
  };

  // Action Handlers
  const handleRevokeCheckIn = () => {
    if (selectedIds.length === 0 && !selectedSpecimenModal) {
      triggerAction('请勾选或选择需要撤销核收的标本');
      return;
    }
    const targetIds = selectedIds.length > 0 ? selectedIds : [selectedSpecimenModal!.id];
    setSpecimens(prev =>
      prev.map(s => (targetIds.includes(s.id) ? { ...s, checkInStatus: '待核收', checkInTime: '-' } : s))
    );
    if (selectedSpecimenModal && targetIds.includes(selectedSpecimenModal.id)) {
      setSelectedSpecimenModal(prev => prev ? { ...prev, checkInStatus: '待核收', checkInTime: '-' } : null);
    }
    triggerAction(`已成功撤销 ${targetIds.length} 份标本的核收状态！`);
    setSelectedIds([]);
  };

  const handleSaveManualModal = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: MicrobiologySpecimenItem = {
      id: `MICRO-${Date.now()}`,
      checkInStatus: '已核收',
      isUrgent: false,
      testStatus: '检验中',
      sampleNo: `B0${Math.floor(100 + Math.random() * 900)}`,
      patientId: `540${Math.floor(100 + Math.random() * 900)}`,
      patientName: manualForm.patientName,
      gender: manualForm.gender,
      age: manualForm.age,
      bedNo: '16床',
      department: manualForm.department,
      doctor: manualForm.doctor,
      doctorPhone: '13900008899',
      testItem: manualForm.testItem,
      sampleType: manualForm.sampleType,
      sampleStatus: '外观正常',
      collectMethod: '无菌拭子采集',
      collectSite: '咽后壁',
      barcode: manualForm.barcode,
      applyTime: '2026-10-30 11:00:00',
      collectTime: '2026-10-30 11:10:00',
      deliveryTime: '2026-10-30 11:25:00',
      checkInTime: '2026-10-30 11:35:00',
      clinicalDiagnosis: manualForm.clinicalDiagnosis,
      patientSource: '住院',
      billing: {
        feeName: manualForm.testItem,
        chargeStatus: '已收费',
        payable: 110.00,
        actualPaid: 110.00,
      },
      overview: {
        smearName: '涂片染色',
        smearTime: '2026-10-30 11:40:00',
        smearResult: '见少量革兰氏阳性球菌',
        smearHasReport: true,
        instrumentName: '恒温培养箱',
        instrumentTime: '2026-10-30 11:45:00',
        instrumentResult: '培养中',
        agarName: '血琼脂培养基',
        agarTime: '2026-10-30 12:00:00',
        agarResult: '纯培养物生长',
        astName: '待质谱鉴定菌种',
        astTime: '进行中',
        astResult: '培养孵育中',
        astHasReport: false,
      },
    };

    setSpecimens(prev => [newItem, ...prev]);
    setIsManualModalOpen(false);
    setSelectedSpecimenModal(newItem);
    triggerAction(`手工登记微生物新标本: [${newItem.sampleNo} - ${newItem.patientName}]`);
  };

  const handleSaveUnqualifiedModal = (e: React.FormEvent) => {
    e.preventDefault();
    setSpecimens(prev =>
      prev.map(s =>
        s.sampleNo === unqualifiedForm.sampleNo
          ? { ...s, checkInStatus: '已拒收', sampleStatus: unqualifiedForm.reason }
          : s
      )
    );
    setIsUnqualifiedModalOpen(false);
    triggerAction(`已登记标本 [${unqualifiedForm.sampleNo}] 为不合格拒收！`);
  };

  const handleSaveFeeModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSpecimenModal) {
      setSelectedSpecimenModal(prev =>
        prev
          ? {
              ...prev,
              billing: {
                ...prev.billing,
                payable: prev.billing.payable + feeForm.amount,
                actualPaid: prev.billing.actualPaid + feeForm.amount,
              },
            }
          : null
      );
    }
    setIsFeeModalOpen(false);
    triggerAction(`已完成补费登记：加做【${feeForm.feeName}】 金额 ${feeForm.amount}元`);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-800 font-sans p-4 overflow-y-auto space-y-4">
      {/* 1. Barcode Scanner & Control Header Strip (Matches Screenshot image_d5855d85.png) */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs space-y-3">
        {/* Row 1: High-Speed Barcode Scanner */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex-1 max-w-xl flex items-center gap-3">
            <label className="text-xs font-semibold text-slate-700 whitespace-nowrap flex items-center gap-1.5 shrink-0">
              <QrCode className="w-4 h-4 text-sky-600" />
              <span>采集条码:</span>
            </label>
            <form onSubmit={handleBarcodeSubmit} className="flex-1 flex items-center relative">
              <input
                type="text"
                value={barcodeInput}
                onChange={e => setBarcodeInput(e.target.value)}
                placeholder="扫描或输入条码核收 (支持条码枪连续扫码按回车核收)"
                className="w-full pl-3 pr-16 py-1.5 text-xs bg-slate-50 hover:bg-white border border-sky-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 font-mono transition-all"
                autoFocus
              />
              <button
                type="submit"
                className="absolute right-1 top-1 px-3 py-1 bg-sky-600 hover:bg-sky-700 text-white text-[11px] font-semibold rounded transition-colors"
              >
                核收
              </button>
            </form>
          </div>

          {/* Quick Buttons: +手工  +不合格登记 */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsManualModalOpen(true)}
              className="px-3 py-1.5 bg-sky-50 text-sky-700 hover:bg-sky-100 rounded-lg border border-sky-200 transition-colors font-semibold text-xs flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>手工登记</span>
            </button>
            <button
              onClick={() => setIsUnqualifiedModalOpen(true)}
              className="px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg border border-rose-200 transition-colors font-semibold text-xs flex items-center gap-1"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>不合格登记</span>
            </button>
          </div>
        </div>

        {/* Row 2: Filter Toolbar (核收状态, 核收时间, 查询条码) */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            {/* Status Dropdown */}
            <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
              <span className="text-slate-500 font-medium">标本状态</span>
              <select
                value={statusFilter}
                onChange={e => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-transparent font-medium text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="全部">全部状态</option>
                <option value="已核收">已核收</option>
                <option value="让步核收">让步核收</option>
                <option value="待核收">待核收</option>
                <option value="已拒收">已拒收</option>
              </select>
            </div>

            {/* Check-In Date Range */}
            <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600">
              <CalendarCheck className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-500">核收时间:</span>
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="bg-transparent focus:outline-none text-slate-700 font-mono"
              />
              <span className="text-slate-300">~</span>
              <input
                type="date"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
                className="bg-transparent focus:outline-none text-slate-700 font-mono"
              />
            </div>

            {/* Barcode/Name Keyword Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="查询条码/样本号/姓名/科室..."
                value={searchKeyword}
                onChange={e => {
                  setSearchKeyword(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-56 pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all placeholder:text-slate-400"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>

            {/* Refresh */}
            <button
              onClick={() => {
                setSearchKeyword('');
                setStatusFilter('全部');
                setCurrentPage(1);
                triggerAction('已刷新微生物标本核收列表！');
              }}
              className="p-1.5 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-lg border border-slate-200 transition-colors"
              title="刷新列表"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Row 3 Toolbar Action Buttons: 打印工单, 撤销核收, 补打条码, 补费 */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => triggerAction('已打印勾选标本的微生物培养流转工单！')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-medium transition-colors shadow-2xs text-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>打印工单</span>
            </button>
            <button
              onClick={handleRevokeCheckIn}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-slate-700 hover:bg-slate-50 rounded-lg border border-slate-200 font-medium transition-colors text-xs"
            >
              <XCircle className="w-3.5 h-3.5 text-slate-500" />
              <span>撤销核收</span>
            </button>
            <button
              onClick={() => triggerAction('补打条码完毕！已向热敏打印机发送数据')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-slate-700 hover:bg-slate-50 rounded-lg border border-slate-200 font-medium transition-colors text-xs"
            >
              <QrCode className="w-3.5 h-3.5 text-slate-500" />
              <span>补打条码</span>
            </button>
            <button
              onClick={() => setIsFeeModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-slate-700 hover:bg-slate-50 rounded-lg border border-slate-200 font-medium transition-colors text-xs"
            >
              <DollarSign className="w-3.5 h-3.5 text-slate-500" />
              <span>补费</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Table View (Full Width List View with 10 Items per Page) */}
      <div className="bg-white border border-slate-200/90 rounded-xl shadow-2xs overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/90 text-slate-700 font-semibold border-b border-slate-200 uppercase tracking-wider">
                <th className="py-3 px-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={
                      paginatedSpecimens.length > 0 &&
                      paginatedSpecimens.every(i => selectedIds.includes(i.id))
                    }
                    onChange={handleSelectAll}
                    className="rounded border-slate-300 text-sky-600 focus:ring-sky-500 cursor-pointer"
                  />
                </th>
                <th className="py-3 px-3">核收状态</th>
                <th className="py-3 px-3 text-center">急诊</th>
                <th className="py-3 px-3">检验状态</th>
                <th className="py-3 px-3 font-mono">样本号</th>
                <th className="py-3 px-3 font-mono">病历号</th>
                <th className="py-3 px-3">患者姓名</th>
                <th className="py-3 px-3">检验项目</th>
                <th className="py-3 px-3">标本类型</th>
                <th className="py-3 px-3">申请科室/医生</th>
                <th className="py-3 px-3">核收时间</th>
                <th className="py-3 px-3 text-center">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {paginatedSpecimens.length === 0 ? (
                <tr>
                  <td colSpan={12} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <FileText className="w-8 h-8 text-slate-300 stroke-1" />
                      <span>未查询到匹配的微生物标本核收记录</span>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedSpecimens.map(item => {
                  const isSelected = selectedIds.includes(item.id);
                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-sky-50/40 transition-colors ${
                        isSelected ? 'bg-sky-50/60' : ''
                      }`}
                    >
                      <td
                        className="py-2.5 px-3 text-center"
                        onClick={e => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectRow(item.id)}
                          className="rounded border-slate-300 text-sky-600 focus:ring-sky-500 cursor-pointer"
                        />
                      </td>
                      <td className="py-2.5 px-3">
                        {item.checkInStatus === '已核收' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            已核收
                          </span>
                        ) : item.checkInStatus === '让步核收' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                            <AlertTriangle className="w-3 h-3 text-amber-600" />
                            让步核收
                          </span>
                        ) : item.checkInStatus === '已拒收' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-rose-50 text-rose-700 border border-rose-200">
                            <XCircle className="w-3 h-3 text-rose-600" />
                            已拒收
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-sky-50 text-sky-700 border border-sky-200">
                            <Clock className="w-3 h-3 text-sky-600" />
                            待核收
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        {item.isUrgent ? (
                          <span className="px-1.5 py-0.2 rounded text-[10px] bg-rose-100 text-rose-700 font-bold">
                            急
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">常规</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-slate-700">
                        {item.testStatus === '已完成' ? (
                          <span className="text-emerald-600 font-medium">已完成</span>
                        ) : item.testStatus === '检验中' ? (
                          <span className="text-sky-600 font-medium flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />
                            检验中
                          </span>
                        ) : (
                          <span className="text-amber-600 font-medium">待接种</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                        {item.sampleNo}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-600">
                        {item.patientId}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-slate-900">
                        {item.patientName}
                      </td>
                      <td className="py-2.5 px-3 font-medium text-slate-800">
                        {item.testItem}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded font-mono text-[11px]">
                          {item.sampleType}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-600">
                        <div>{item.department}</div>
                        <div className="text-[11px] text-slate-400">{item.doctor}</div>
                      </td>
                      <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px]">
                        {item.checkInTime}
                      </td>
                      <td
                        className="py-2.5 px-3 text-center"
                        onClick={e => e.stopPropagation()}
                      >
                        <button
                          onClick={() => setSelectedSpecimenModal(item)}
                          className="px-2.5 py-1 bg-sky-50 text-sky-700 hover:bg-sky-100 rounded border border-sky-200 font-medium transition text-[11px]"
                        >
                          查看/核收详情
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* 3. Pagination Controls (Strict 10 items per page) */}
        <div className="bg-slate-50/90 border-t border-slate-200 px-4 py-3 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span>
              显示第 <strong className="font-mono text-slate-900">{filteredSpecimens.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}</strong> 到{' '}
              <strong className="font-mono text-slate-900">{Math.min(currentPage * pageSize, filteredSpecimens.length)}</strong> 条，共{' '}
              <strong className="font-mono text-slate-900">{filteredSpecimens.length}</strong> 条记录
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-500 font-mono">每页 10 条</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-1 font-mono">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-7 h-7 rounded-lg text-xs font-semibold transition-colors ${
                    currentPage === page
                      ? 'bg-sky-600 text-white shadow-2xs'
                      : 'bg-white border border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 4. Detail Modal Popup (点击左侧的信息，右侧内容改成弹窗展示) */}
      {selectedSpecimenModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400">
                  <Dna className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-bold text-base text-white">大连医科大学附属第二医院 微生物标本核收及检验概况</h2>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30 font-mono">
                      样本号: {selectedSpecimenModal.sampleNo}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono">
                    MICROBIOLOGY LABORATORY SPECIMEN DETAILS AND DIAGNOSTIC OVERVIEW
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => triggerAction(`正在打印患者 [${selectedSpecimenModal.patientName}] 的微生物培养工单...`)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 text-slate-200 hover:bg-slate-700 rounded-lg border border-slate-700 font-medium text-xs transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>打印工单</span>
                </button>
                <button
                  onClick={() => setIsFeeModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 text-white hover:bg-sky-500 rounded-lg font-medium text-xs transition-colors shadow-2xs"
                >
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>补费</span>
                </button>
                <button
                  onClick={() => setSelectedSpecimenModal(null)}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors ml-2"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50 text-slate-800 text-xs">
              {/* Grid 1: 患者与样本基本信息 (Demographics & Specimen Details) */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h3 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <User className="w-4 h-4 text-sky-600" />
                    <span>患者与样本基本信息 (Specimen & Patient Metadata)</span>
                  </h3>
                  <span className="text-[11px] text-slate-400 font-mono">
                    条码号: {selectedSpecimenModal.barcode}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-y-2.5 gap-x-4 font-sans text-xs">
                  <div><span className="text-slate-400">样本号:</span> <strong className="text-slate-900 font-mono">{selectedSpecimenModal.sampleNo}</strong></div>
                  <div><span className="text-slate-400">姓名:</span> <strong className="text-slate-900 font-bold">{selectedSpecimenModal.patientName}</strong></div>
                  <div><span className="text-slate-400">性别/年龄:</span> <span className="text-slate-800 font-medium">{selectedSpecimenModal.gender} / {selectedSpecimenModal.age}</span></div>
                  <div><span className="text-slate-400">病历号:</span> <span className="text-slate-800 font-mono font-medium">{selectedSpecimenModal.patientId}</span></div>
                  <div><span className="text-slate-400">送检科室:</span> <span className="text-slate-800 font-medium">{selectedSpecimenModal.department} ({selectedSpecimenModal.bedNo})</span></div>
                  <div><span className="text-slate-400">申请医生:</span> <span className="text-slate-800 font-medium">{selectedSpecimenModal.doctor} ({selectedSpecimenModal.doctorPhone})</span></div>
                  <div><span className="text-slate-400">就诊类型:</span> <span className="text-slate-800 font-medium">{selectedSpecimenModal.patientSource}</span></div>
                  <div><span className="text-slate-400">样本类型:</span> <span className="px-1.5 py-0.5 bg-sky-50 text-sky-800 rounded font-medium text-[11px]">{selectedSpecimenModal.sampleType}</span></div>
                  <div><span className="text-slate-400">样本外观:</span> <span className="text-slate-800 font-medium">{selectedSpecimenModal.sampleStatus}</span></div>
                  <div><span className="text-slate-400">采集方法/部位:</span> <span className="text-slate-800 font-medium">{selectedSpecimenModal.collectMethod} / {selectedSpecimenModal.collectSite}</span></div>
                  <div><span className="text-slate-400">申请时间:</span> <span className="text-slate-600 font-mono text-[11px]">{selectedSpecimenModal.applyTime}</span></div>
                  <div><span className="text-slate-400">核收时间:</span> <span className="text-slate-600 font-mono text-[11px]">{selectedSpecimenModal.checkInTime}</span></div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-slate-600">
                  <div>
                    <span className="text-slate-400">临床诊断:</span>{' '}
                    <strong className="text-slate-800">{selectedSpecimenModal.clinicalDiagnosis}</strong>
                  </div>
                </div>
              </div>

              {/* Grid 2: 费用信息 (Billing Information) */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-2">
                <h3 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  <span>费用明细与状态 (Billing Information)</span>
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono text-[11px]">
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-slate-400">费用名称:</span>{' '}
                    <strong className="text-slate-900 font-sans">{selectedSpecimenModal.billing.feeName}</strong>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-slate-400">收费状态:</span>{' '}
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold font-sans">
                      {selectedSpecimenModal.billing.chargeStatus}
                    </span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-slate-400">应收金额:</span>{' '}
                    <strong className="text-slate-900">{selectedSpecimenModal.billing.payable.toFixed(2)} 元</strong>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="text-slate-400">实收金额:</span>{' '}
                    <strong className="text-slate-900">{selectedSpecimenModal.billing.actualPaid.toFixed(2)} 元</strong>
                  </div>
                </div>
              </div>

              {/* Grid 3: 微生物检验概况 (Diagnostic Progress & Results Overview) */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h3 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <FlaskConical className="w-4 h-4 text-indigo-600" />
                    <span>微生物检验概况 (Microbiology Diagnostic Overview)</span>
                  </h3>
                  <span className="text-[11px] text-slate-500 font-mono">
                    流水线进度: <strong className="text-sky-700">{selectedSpecimenModal.testStatus}</strong>
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* 1. 涂片镜检 */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 text-xs">涂片镜检 (Smear Microscopy)</span>
                      <button
                        onClick={() => triggerAction(`查看患者 [${selectedSpecimenModal.patientName}] 的涂片报告单`)}
                        className="text-sky-600 hover:text-sky-800 font-medium text-[11px]"
                      >
                        涂片报告 &gt;
                      </button>
                    </div>
                    <div className="text-slate-600 space-y-1 text-[11px]">
                      <div>项目: {selectedSpecimenModal.overview.smearName}</div>
                      <div>采样完成时间: <span className="font-mono">{selectedSpecimenModal.overview.smearTime}</span></div>
                      <div className="font-bold text-slate-900 bg-white p-2 rounded border border-slate-200">
                        {selectedSpecimenModal.overview.smearResult}
                      </div>
                    </div>
                  </div>

                  {/* 2. 仪器培养 */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 text-xs">仪器培养 (Automated Incubator)</span>
                      <span className="text-xs text-amber-600 font-bold">报警监视中</span>
                    </div>
                    <div className="text-slate-600 space-y-1 text-[11px]">
                      <div>仪器模块: {selectedSpecimenModal.overview.instrumentName}</div>
                      <div>上机时间: <span className="font-mono">{selectedSpecimenModal.overview.instrumentTime}</span></div>
                      <div className="font-bold text-rose-700 bg-rose-50 p-2 rounded border border-rose-200 flex items-center justify-between">
                        <span>{selectedSpecimenModal.overview.instrumentResult}</span>
                        <span className="text-[10px] px-1.5 py-0.2 bg-rose-200 text-rose-900 rounded font-bold">报警</span>
                      </div>
                    </div>
                  </div>

                  {/* 3. 普通平板培养 */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 text-xs">普通平板培养 (Agar Plate Culture)</span>
                      <span className="text-xs text-slate-500 font-mono">37℃ 恒温</span>
                    </div>
                    <div className="text-slate-600 space-y-1 text-[11px]">
                      <div>培养基: {selectedSpecimenModal.overview.agarName}</div>
                      <div>接种时间: <span className="font-mono">{selectedSpecimenModal.overview.agarTime}</span></div>
                      <div className="font-bold text-slate-900 bg-white p-2 rounded border border-slate-200">
                        {selectedSpecimenModal.overview.agarResult}
                      </div>
                    </div>
                  </div>

                  {/* 4. 鉴定药敏 */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 text-xs">质谱鉴定与药敏 (MALDI-TOF & AST)</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => triggerAction(`正在打印患者 [${selectedSpecimenModal.patientName}] 的质谱鉴定报告...`)}
                          className="text-sky-600 hover:text-sky-800 font-medium text-[11px]"
                        >
                          鉴定报告
                        </button>
                        <button
                          onClick={() => triggerAction(`正在打印患者 [${selectedSpecimenModal.patientName}] 的定量MIC药敏报告...`)}
                          className="text-emerald-600 hover:text-emerald-800 font-medium text-[11px]"
                        >
                          药敏报告
                        </button>
                      </div>
                    </div>
                    <div className="text-slate-600 space-y-1 text-[11px]">
                      <div>检出菌株: <strong className="text-slate-900">{selectedSpecimenModal.overview.astName}</strong></div>
                      <div>完成时间: <span className="font-mono">{selectedSpecimenModal.overview.astTime}</span></div>
                      <div className="font-bold text-indigo-900 bg-indigo-50 p-2 rounded border border-indigo-200">
                        {selectedSpecimenModal.overview.astResult}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Manual Check-in Modal */}
      {isManualModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden">
            <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between">
              <h3 className="font-bold text-sm">手工补录微生物试管核收</h3>
              <button onClick={() => setIsManualModalOpen(false)} className="p-1 text-slate-400 hover:text-white rounded">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveManualModal} className="p-5 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">采集条码号 *</label>
                  <input
                    type="text"
                    value={manualForm.barcode}
                    onChange={e => setManualForm({ ...manualForm, barcode: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">患者姓名 *</label>
                  <input
                    type="text"
                    value={manualForm.patientName}
                    onChange={e => setManualForm({ ...manualForm, patientName: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">性别</label>
                  <select
                    value={manualForm.gender}
                    onChange={e => setManualForm({ ...manualForm, gender: e.target.value as any })}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded"
                  >
                    <option value="男">男</option>
                    <option value="女">女</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">年龄</label>
                  <input
                    type="text"
                    value={manualForm.age}
                    onChange={e => setManualForm({ ...manualForm, age: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">申请科室</label>
                  <input
                    type="text"
                    value={manualForm.department}
                    onChange={e => setManualForm({ ...manualForm, department: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">申请医生</label>
                  <input
                    type="text"
                    value={manualForm.doctor}
                    onChange={e => setManualForm({ ...manualForm, doctor: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block font-medium text-slate-700 mb-1">检验项目</label>
                  <input
                    type="text"
                    value={manualForm.testItem}
                    onChange={e => setManualForm({ ...manualForm, testItem: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsManualModalOpen(false)}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-medium"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded font-medium shadow-2xs"
                >
                  保存并核收
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Unqualified Registration Modal */}
      {isUnqualifiedModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden p-5 space-y-4 text-xs">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="font-bold text-sm text-slate-900">登记不合格微生物标本</h3>
            </div>

            <form onSubmit={handleSaveUnqualifiedModal} className="space-y-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">样本号</label>
                <input
                  type="text"
                  value={unqualifiedForm.sampleNo}
                  onChange={e => setUnqualifiedForm({ ...unqualifiedForm, sampleNo: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded font-mono"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">不合格拒收原因</label>
                <select
                  value={unqualifiedForm.reason}
                  onChange={e => setUnqualifiedForm({ ...unqualifiedForm, reason: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded"
                >
                  <option value="血培养瓶抽血量不足 (<5mL)">血培养瓶抽血量不足 (&lt;5mL)</option>
                  <option value="试管外侧破损渗漏感染">试管外侧破损渗漏感染</option>
                  <option value="痰标本不合格 (鳞状上皮细胞>25/低倍)">痰标本不合格 (鳞状上皮细胞&gt;25/低倍)</option>
                  <option value="采样时间超时 (送检>2小时未防腐)">采样时间超时 (送检&gt;2小时未防腐)</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">备注说明与通知记录</label>
                <textarea
                  rows={3}
                  value={unqualifiedForm.remark}
                  onChange={e => setUnqualifiedForm({ ...unqualifiedForm, remark: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsUnqualifiedModalOpen(false)}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-medium"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded font-medium shadow-2xs"
                >
                  确认拒收
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Additional Fee Modal */}
      {isFeeModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden p-5 space-y-4 text-xs">
            <div className="flex items-center gap-3 text-sky-600">
              <DollarSign className="w-6 h-6 shrink-0" />
              <h3 className="font-bold text-sm text-slate-900">补费登记 (加做微生物检验项目)</h3>
            </div>

            <form onSubmit={handleSaveFeeModal} className="space-y-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">加做/补费项目名称</label>
                <input
                  type="text"
                  value={feeForm.feeName}
                  onChange={e => setFeeForm({ ...feeForm, feeName: e.target.value })}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">补费金额 (元)</label>
                <input
                  type="number"
                  step="0.01"
                  value={feeForm.amount}
                  onChange={e => setFeeForm({ ...feeForm, amount: parseFloat(e.target.value) || 0 })}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded font-mono"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsFeeModalOpen(false)}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-medium"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded font-medium shadow-2xs"
                >
                  确认扣费
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
