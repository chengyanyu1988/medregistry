import React, { useState, useMemo } from 'react';
import {
  AlertTriangle,
  Clock,
  CheckCircle2,
  Search,
  Filter,
  RefreshCw,
  QrCode,
  Check,
  Building2,
  User,
  ArrowRight,
  XCircle,
  FileText,
  Printer,
  ChevronDown,
  Layers,
  Thermometer,
  ShieldCheck,
  RotateCcw,
  Ban,
  Sparkles,
  Inbox,
  AlertCircle,
  FileSpreadsheet,
  X,
  PhoneCall,
  CalendarCheck,
  FileCheck,
  Settings
} from './MenuIcon';
import {
  CheckInRecordItem,
  INITIAL_CHECK_IN_ITEMS,
  CheckInPatientDetail
} from '../data/specimenCheckInData';
import { UserProfile } from '../types/navigation';
import { CheckInManualApplyModal } from './CheckInManualApplyModal';

interface SpecimenCheckInWorkstationProps {
  user: UserProfile;
  triggerAction: (msg: string) => void;
}

export const SpecimenCheckInWorkstation: React.FC<SpecimenCheckInWorkstationProps> = ({
  user,
  triggerAction,
}) => {
  // Main data list
  const [records, setRecords] = useState<CheckInRecordItem[]>(INITIAL_CHECK_IN_ITEMS);
  const [selectedId, setSelectedId] = useState<string>('CK-01');

  // Barcode input & filters
  const [barcodeInput, setBarcodeInput] = useState('');
  const [statusFilter, setStatusFilter] = useState('全部');
  const [barcodeFilter, setBarcodeFilter] = useState('');
  const [dateStart, setDateStart] = useState('2026-10-26');
  const [dateEnd, setDateEnd] = useState('2026-10-26');

  // Modals state
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showManualModal, setShowManualModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showEhrModal, setShowEhrModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [showPrinterConfigModal, setShowPrinterConfigModal] = useState(false);

  // Filtered records
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const matchStatus =
        statusFilter === '全部' || r.checkInStatus === statusFilter;
      const matchBarcode =
        !barcodeFilter ||
        r.barcode.includes(barcodeFilter) ||
        r.patientName.includes(barcodeFilter) ||
        r.patientId.includes(barcodeFilter);
      return matchStatus && matchBarcode;
    });
  }, [records, statusFilter, barcodeFilter]);

  // Currently selected record
  const currentRecord = useMemo(() => {
    return records.find((r) => r.id === selectedId) || records[0];
  }, [records, selectedId]);

  // Modal navigation index
  const currentIndex = useMemo(() => {
    return filteredRecords.findIndex((r) => r.id === selectedId);
  }, [filteredRecords, selectedId]);

  const handlePrevRecord = () => {
    if (currentIndex > 0) {
      setSelectedId(filteredRecords[currentIndex - 1].id);
    }
  };

  const handleNextRecord = () => {
    if (currentIndex < filteredRecords.length - 1) {
      setSelectedId(filteredRecords[currentIndex + 1].id);
    }
  };

  // Manual register form
  const [manualForm, setManualForm] = useState({
    name: '周建业',
    gender: '男',
    age: '58岁',
    bedNo: '23床',
    dept: '消化内科',
    doctor: '陈欣欣主治',
    item: '生化肝肾功能常规全套',
    sampleType: '血清 (黄头促凝管 4.0ml)',
    isUrgent: false,
    barcode: '0901008',
  });

  // Rejection note
  const [rejectReason, setRejectReason] = useState('严重溶血 (游离血红蛋白>2.5g/L)');
  const [rejectNote, setRejectNote] = useState('');

  // Floating notifications visibility
  const [showTatToast, setShowTatToast] = useState(true);
  const [showPanicToast, setShowPanicToast] = useState(true);

  // Barcode Quick Scan or Enter
  const handleBarcodeSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = barcodeInput.trim();
    if (!query) {
      triggerAction('请扫描试管条码或输入条码号');
      return;
    }

    const found = records.find(
      (r) => r.barcode === query || r.barcode.endsWith(query) || r.patientName === query
    );

    if (found) {
      setSelectedId(found.id);
      // If pending, mark as checked-in
      if (found.checkInStatus === '待核收') {
        setRecords((prev) =>
          prev.map((r) =>
            r.id === found.id
              ? {
                  ...r,
                  checkInStatus: '已核收',
                  checkInTime: '2026-10-26 08:35:10',
                }
              : r
          )
        );
        triggerAction(`条码 [${found.barcode}] 扫码核收成功并已载入患者信息`);
      } else {
        triggerAction(`已精准定位标本：[${found.barcode}] ${found.patientName}`);
      }
      setBarcodeInput('');
    } else {
      triggerAction(`未检索到条码 [${query}]，可点击【手工登记】补录`);
    }
  };

  // 1. 让步核收
  const handleConcessionCheckIn = () => {
    if (!currentRecord) return;
    setRecords((prev) =>
      prev.map((r) =>
        r.id === currentRecord.id
          ? {
              ...r,
              checkInStatus: '让步核收',
              details: {
                ...r.details,
                unqualifiedReason: '经检验技师评估：轻微干扰不影响主要临床判读，执行让步核收',
                unqualifiedRemark: '报告单将附注让步核收提示，已电话向临床报备',
              },
            }
          : r
      )
    );
    triggerAction(`标本 [${currentRecord.barcode}] 已执行【让步核收】，附带质控说明`);
  };

  // 2. 撤销核收
  const handleRevokeCheckIn = () => {
    if (!currentRecord) return;
    setRecords((prev) =>
      prev.map((r) =>
        r.id === currentRecord.id
          ? {
              ...r,
              checkInStatus: '待核收',
              checkInTime: '-',
            }
          : r
      )
    );
    triggerAction(`已撤销标本 [${currentRecord.barcode} - ${currentRecord.patientName}] 的核收状态`);
  };

  // 3. 确认拒收
  const handleConfirmReject = () => {
    if (!currentRecord) return;
    setRecords((prev) =>
      prev.map((r) =>
        r.id === currentRecord.id
          ? {
              ...r,
              checkInStatus: '已拒收',
              details: {
                ...r.details,
                unqualifiedReason: rejectReason,
                unqualifiedRemark: `${rejectNote || '已退回临床科室重新定量抽血'}（核退人: ${user.name}）`,
              },
            }
          : r
      )
    );
    setShowRejectModal(false);
    triggerAction(`标本 [${currentRecord.barcode}] 已执行【拒收退回】，通知已发送护士站`);
  };

  // 4. 手工登记保存
  const handleSaveManual = () => {
    const newId = `CK-MANUAL-${Date.now()}`;
    const newRecord: CheckInRecordItem = {
      id: newId,
      reportStatus: '未出',
      checkInStatus: '已核收',
      isUrgent: manualForm.isUrgent,
      barcode: manualForm.barcode,
      patientId: `540${Math.floor(100 + Math.random() * 900)}`,
      patientName: manualForm.name,
      sampleType: manualForm.sampleType.includes('全血') ? '全血' : '血清',
      testItem: manualForm.item,
      department: manualForm.dept,
      applyTime: '2026-10-26 08:35:00',
      checkInTime: '2026-10-26 08:36:20',
      details: {
        patientSource: '住院',
        name: manualForm.name,
        ethnicity: '汉族',
        gender: manualForm.gender as any,
        birthDate: '1968-05-10',
        age: manualForm.age,
        phone: '13808001122',
        medicalRecordNo: `ZY202610${Math.floor(1000 + Math.random() * 9000)}`,
        applyDoctor: manualForm.doctor,
        department: manualForm.dept,
        doctorPhone: '13988220011',
        ward: `${manualForm.dept}住院病区`,
        nursePhone: '028-85783783',
        bedNo: manualForm.bedNo,
        sendDept: manualForm.dept,
        clinicalDiagnosis: '急查待查 / 手工补录医嘱',
        extraInfo: '病区急加做项目，手工条码登记核收',
        applyItem: manualForm.item,
        barcode: manualForm.barcode,
        sampleType: manualForm.sampleType,
        collectMethod: '真空静脉穿刺',
        collectSite: '前臂浅静脉',
        applyTime: '2026-10-26 08:35:00',
        sendTime: '2026-10-26 08:35:40',
        checkInTime: '2026-10-26 08:36:20',
        auditTime: '上机中',
        unqualifiedReason: '',
        unqualifiedRemark: '手工登记标本，管壁整洁，已送达流水线上机',
      },
    };

    setRecords((prev) => [newRecord, ...prev]);
    setSelectedId(newId);
    setShowManualModal(false);
    triggerAction(`手工登记标本 [${manualForm.barcode} - ${manualForm.name}] 成功并完成核收！`);
  };

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-slate-100 overflow-hidden text-slate-800 relative">
      
      {/* ================= 1. TOP BARCODE SCAN & QUERY CONTROL STRIP ================= */}
      <div className="bg-white border-b border-slate-200 px-4 py-2.5 shrink-0 shadow-2xs space-y-2.5">
        
        {/* Row 1: High-Speed Barcode Scanner Input */}
        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-slate-700 whitespace-nowrap flex items-center gap-1.5 shrink-0">
            <QrCode className="w-4 h-4 text-sky-600" />
            <span>采集条码:</span>
          </label>
          <form onSubmit={handleBarcodeSubmit} className="flex-1 max-w-xl flex items-center relative">
            <input
              type="text"
              value={barcodeInput}
              onChange={(e) => setBarcodeInput(e.target.value)}
              placeholder="扫描或输入条码核收 (支持条码枪高速连续扫描，按回车快速核收)"
              className="w-full pl-3 pr-20 py-1.5 text-xs bg-slate-50 hover:bg-white border border-sky-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono transition-all"
              autoFocus
            />
            <button
              type="submit"
              className="absolute right-1 top-1 px-3 py-1 bg-sky-600 hover:bg-sky-700 text-white text-[11px] font-semibold rounded transition-colors"
            >
              核收
            </button>
          </form>

          {/* Quick barcode fill shortcuts for user evaluation */}
          <div className="hidden xl:flex items-center gap-1.5 text-xs text-slate-500">
            <span className="text-[11px]">快捷测试:</span>
            <button
              type="button"
              onClick={() => {
                setBarcodeInput('0901005');
                handleBarcodeSubmit();
              }}
              className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 text-[11px] font-mono font-medium"
            >
              急查危急值: 0901005
            </button>
            <button
              type="button"
              onClick={() => {
                setBarcodeInput('0901001');
                handleBarcodeSubmit();
              }}
              className="px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100 text-[11px] font-mono font-medium"
            >
              常规标本: 0901001
            </button>
          </div>
        </div>

        {/* Row 2: Filter Toolbar (Matches screenshot: 标本状态, 核收时间, 条码号, 查询) */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1 border-t border-slate-100 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            {/* Status Dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">标本状态</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-white border border-slate-300 rounded-md px-2.5 py-1 text-xs text-slate-700 font-medium focus:ring-1 focus:ring-sky-500"
              >
                <option value="全部">全部状态</option>
                <option value="已核收">已核收</option>
                <option value="让步核收">让步核收</option>
                <option value="不合格">不合格</option>
                <option value="已拒收">已拒收</option>
                <option value="待核收">待核收</option>
              </select>
            </div>

            {/* Check-in Time Range (2026-10-26) */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">核收时间</span>
              <input
                type="date"
                value={dateStart}
                onChange={(e) => setDateStart(e.target.value)}
                className="bg-white border border-slate-300 rounded-md px-2 py-1 text-xs font-mono text-slate-700"
              />
              <span className="text-slate-400">~</span>
              <input
                type="date"
                value={dateEnd}
                onChange={(e) => setDateEnd(e.target.value)}
                className="bg-white border border-slate-300 rounded-md px-2 py-1 text-xs font-mono text-slate-700"
              />
            </div>

            {/* Barcode Search */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">条码号</span>
              <input
                type="text"
                value={barcodeFilter}
                onChange={(e) => setBarcodeFilter(e.target.value)}
                placeholder="条码/姓名/病历号"
                className="bg-white border border-slate-300 rounded-md px-2.5 py-1 text-xs w-36 focus:ring-1 focus:ring-sky-500"
              />
            </div>

            <button
              onClick={() => triggerAction('已按照筛选条件刷新标本核收清单')}
              className="px-3.5 py-1 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-medium rounded-md transition-colors"
            >
              查询
            </button>
          </div>

          <div className="text-[11px] text-slate-500 font-mono">
            联网状态: <span className="text-emerald-600 font-semibold">LIS-HIS 在线</span> · 检验师: {user.name}
          </div>
        </div>

        {/* Row 3: Action Buttons (Matches screenshot: [手工登记] [让步核收] [拒收] [撤销核收] [查看报告] [查看病历] [补打条码] [打印设置]) */}
        <div className="flex items-center flex-wrap gap-2 pt-1 border-t border-slate-100">
          <button
            onClick={() => setShowManualModal(true)}
            className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-md shadow-2xs transition-colors flex items-center gap-1"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>手工登记</span>
          </button>

          <button
            onClick={handleConcessionCheckIn}
            className="px-2.5 py-1.5 bg-white hover:bg-amber-50 border border-amber-300 text-amber-800 text-xs font-medium rounded-md transition-colors flex items-center gap-1"
            title="对轻度脂血/微溶血等经评估可接受的标本执行让步核收"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
            <span>让步核收</span>
          </button>

          <button
            onClick={() => setShowRejectModal(true)}
            className="px-2.5 py-1.5 bg-white hover:bg-rose-50 border border-rose-300 text-rose-700 text-xs font-medium rounded-md transition-colors flex items-center gap-1"
            title="对严重凝块、量不足、错用管型等标本执行拒收"
          >
            <Ban className="w-3.5 h-3.5 text-rose-600" />
            <span>拒收</span>
          </button>

          <button
            onClick={handleRevokeCheckIn}
            className="px-2.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-medium rounded-md transition-colors flex items-center gap-1"
            title="撤销当前标本的核收状态并回退"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>撤销核收</span>
          </button>

          <div className="h-4 w-px bg-slate-200 mx-1" />

          <button
            onClick={() => setShowReportModal(true)}
            className="px-2.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-medium rounded-md transition-colors flex items-center gap-1"
          >
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            <span>查看报告</span>
          </button>

          <button
            onClick={() => setShowEhrModal(true)}
            className="px-2.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-medium rounded-md transition-colors flex items-center gap-1"
          >
            <FileCheck className="w-3.5 h-3.5 text-slate-500" />
            <span>查看病历</span>
          </button>

          <button
            onClick={() => setShowPrintModal(true)}
            className="px-2.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-medium rounded-md transition-colors flex items-center gap-1"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>补打条码</span>
          </button>

          <button
            onClick={() => setShowPrinterConfigModal(true)}
            className="px-2.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-medium rounded-md transition-colors flex items-center gap-1"
          >
            <Settings className="w-3.5 h-3.5 text-slate-500" />
            <span>打印设置</span>
          </button>
        </div>
      </div>

      {/* ================= 2. WORKSPACE SPLIT: TABLE (LEFT) + PATIENT DOSSIER (RIGHT) ================= */}
      {/* ================= 2. WORKSPACE: FULL-WIDTH TABLE + POPUP DETAIL MODAL ================= */}
      <div className="flex-1 min-h-0 p-3 overflow-hidden flex flex-col">
        {/* Full-Width Specimen Table */}
        <div className="flex-1 flex flex-col h-full min-h-0 bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="flex-1 min-h-0 overflow-auto">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead className="bg-slate-50 sticky top-0 z-10 text-slate-600 border-b border-slate-200 select-none">
                <tr>
                  <th className="px-3 py-2.5 font-medium">报告状态</th>
                  <th className="px-3 py-2.5 font-medium">接收状态</th>
                  <th className="px-2 py-2.5 font-medium text-center">紧急</th>
                  <th className="px-3 py-2.5 font-medium font-mono">采集条码</th>
                  <th className="px-2.5 py-2.5 font-medium font-mono">患者标识</th>
                  <th className="px-2.5 py-2.5 font-medium">姓名</th>
                  <th className="px-2.5 py-2.5 font-medium">标本</th>
                  <th className="px-3 py-2.5 font-medium">申请项目</th>
                  <th className="px-2.5 py-2.5 font-medium">科室</th>
                  <th className="px-2 py-2.5 font-medium text-center">床号</th>
                  <th className="px-3 py-2.5 font-medium">申请时间</th>
                  <th className="px-3 py-2.5 font-medium">核收时间</th>
                  <th className="px-3 py-2.5 font-medium text-center">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {filteredRecords.length === 0 ? (
                  <tr>
                    <td colSpan={13} className="text-center py-12 text-slate-400 font-sans">
                      暂无匹配的标本记录
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map((item) => {
                    const isSelected = selectedId === item.id;
                    return (
                      <tr
                        key={item.id}
                        onClick={() => {
                          setSelectedId(item.id);
                          setShowDetailModal(true);
                        }}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-sky-50/80 hover:bg-sky-100/70'
                            : 'hover:bg-slate-50/90'
                        }`}
                      >
                        {/* 报告状态 */}
                        <td className="px-3 py-2 font-sans font-medium">
                          {item.reportStatus === '未出' && (
                            <span className="text-slate-400">未出</span>
                          )}
                          {item.reportStatus === '已出' && (
                            <span className="text-sky-600 font-semibold">已出</span>
                          )}
                          {item.reportStatus === '已审' && (
                            <span className="text-emerald-600 font-semibold">已审</span>
                          )}
                        </td>

                        {/* 接收状态 */}
                        <td className="px-3 py-2 font-sans">
                          {item.checkInStatus === '已核收' && (
                            <span className="text-slate-700">已核收</span>
                          )}
                          {item.checkInStatus === '让步核收' && (
                            <span className="text-amber-600 font-medium bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 text-[11px]">
                              让步核收
                            </span>
                          )}
                          {item.checkInStatus === '不合格' && (
                            <span className="text-amber-600 font-bold">不合格</span>
                          )}
                          {item.checkInStatus === '已拒收' && (
                            <span className="text-rose-600 font-bold">已拒收</span>
                          )}
                          {item.checkInStatus === '待核收' && (
                            <span className="text-slate-400">待核收</span>
                          )}
                        </td>

                        {/* 紧急 */}
                        <td className="px-2 py-2 text-center font-sans">
                          {item.isUrgent ? (
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-rose-100 text-rose-700 border border-rose-300">
                              是
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[11px]">否</span>
                          )}
                        </td>

                        {/* 采集条码 */}
                        <td className="px-3 py-2 text-slate-800 font-semibold text-[11px]">
                          {item.barcode}
                        </td>

                        {/* 患者标识 */}
                        <td className="px-2.5 py-2 text-slate-600 text-[11px]">
                          {item.patientId}
                        </td>

                        {/* 姓名 (真实化) */}
                        <td className="px-2.5 py-2 font-sans font-semibold text-slate-900">
                          {item.patientName}
                        </td>

                        {/* 标本类型 */}
                        <td className="px-2 py-2 font-sans text-slate-600">
                          <span className="px-1.5 py-0.5 bg-slate-100 rounded text-[10px] text-slate-700">
                            {item.sampleType}
                          </span>
                        </td>

                        {/* 申请项目 */}
                        <td className="px-3 py-2 font-sans text-slate-800 font-medium max-w-[200px] truncate" title={item.testItem}>
                          {item.testItem}
                        </td>

                        {/* 科室 */}
                        <td className="px-2.5 py-2 font-sans text-slate-600">
                          {item.department}
                        </td>

                        {/* 床号 */}
                        <td className="px-2 py-2 text-center font-mono text-slate-700">
                          {item.details.bedNo || '-'}
                        </td>

                        {/* 申请时间 */}
                        <td className="px-3 py-2 text-slate-500 text-[11px]">
                          {item.applyTime}
                        </td>

                        {/* 核收时间 */}
                        <td className="px-3 py-2 text-slate-600 text-[11px]">
                          {item.checkInTime}
                        </td>

                        {/* 操作 */}
                        <td className="px-3 py-2 text-center" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => {
                              setSelectedId(item.id);
                              setShowDetailModal(true);
                            }}
                            className="px-2.5 py-1 bg-sky-50 hover:bg-sky-100 text-sky-700 hover:text-sky-800 border border-sky-200 rounded text-[11px] font-medium transition-colors inline-flex items-center gap-1 shadow-2xs"
                          >
                            <FileText className="w-3 h-3 text-sky-600" />
                            <span>查看详情</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Bottom Counter */}
          <div className="p-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-3">
              <span className="font-medium text-slate-700">合计: {filteredRecords.length}条</span>
              <span className="text-slate-400">·</span>
              <span className="text-slate-500 text-[11px]">点击表格任意行或“查看详情”按钮即可弹窗查看标本与患者档案</span>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <span>当前选中条码: <strong className="text-sky-700 font-mono">{currentRecord?.barcode}</strong></span>
              <span className="text-slate-400">|</span>
              <span>患者: <strong className="text-slate-900">{currentRecord?.patientName}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* ================= 标本核收详情弹窗 (Modal) ================= */}
      {showDetailModal && currentRecord && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-scaleUp">
            {/* Modal Header */}
            <div className="px-5 py-3.5 bg-gradient-to-r from-sky-50 via-slate-50 to-indigo-50 border-b border-slate-200 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center shadow-xs">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-sm">
                      标本核收档案详情 - {currentRecord.patientName} ({currentRecord.details.gender} · {currentRecord.details.age})
                    </h3>
                    {currentRecord.isUrgent && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-600 text-white shadow-2xs">
                        急诊危急
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-sky-100 text-sky-800 border border-sky-200">
                      {currentRecord.checkInStatus}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-mono">
                    条码号: {currentRecord.barcode} | 患者标识: {currentRecord.patientId} | 病历号: {currentRecord.details.medicalRecordNo}
                  </p>
                </div>
              </div>

              {/* Navigation & Close */}
              <div className="flex items-center gap-2">
                <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white text-xs">
                  <button
                    onClick={handlePrevRecord}
                    disabled={currentIndex <= 0}
                    className="px-2.5 py-1 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white text-slate-600 border-r border-slate-200"
                    title="上一个标本"
                  >
                    上一个
                  </button>
                  <span className="px-2.5 py-1 text-[11px] text-slate-500 font-mono bg-slate-50">
                    {currentIndex + 1} / {filteredRecords.length}
                  </span>
                  <button
                    onClick={handleNextRecord}
                    disabled={currentIndex >= filteredRecords.length - 1}
                    className="px-2.5 py-1 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-white text-slate-600"
                    title="下一个标本"
                  >
                    下一个
                  </button>
                </div>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body: 2 Columns (Patient Details Left, Specimen Details Right) */}
            <div className="flex-1 min-h-0 overflow-y-auto p-5 space-y-5 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Column 1: Patient Information */}
                <div className="bg-slate-50/70 rounded-xl p-4 border border-slate-200/80 space-y-3">
                  <div className="flex items-center gap-2 text-slate-800 font-bold border-b border-slate-200 pb-2">
                    <User className="w-4 h-4 text-sky-600" />
                    <span>患者基本信息</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-[11px] text-slate-500 block mb-0.5">患者来源</label>
                      <input
                        type="text"
                        readOnly
                        value={currentRecord.details.patientSource || '住院'}
                        className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-slate-800 font-medium"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-500 block mb-0.5">民族</label>
                      <input
                        type="text"
                        readOnly
                        value={currentRecord.details.ethnicity || '汉族'}
                        className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-500 block mb-0.5">姓名</label>
                      <input
                        type="text"
                        readOnly
                        value={currentRecord.details.name || ''}
                        className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-slate-900 font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-500 block mb-0.5">性别 / 年龄</label>
                      <input
                        type="text"
                        readOnly
                        value={`${currentRecord.details.gender || '男'} / ${currentRecord.details.age || ''}`}
                        className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-slate-800 font-medium"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-500 block mb-0.5">出生日期</label>
                      <input
                        type="text"
                        readOnly
                        value={currentRecord.details.birthDate || ''}
                        className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-slate-700 font-mono text-[11px]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-500 block mb-0.5">病历号</label>
                      <input
                        type="text"
                        readOnly
                        value={currentRecord.details.medicalRecordNo || ''}
                        className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-slate-800 font-mono font-semibold"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-500 block mb-0.5">联系电话</label>
                      <input
                        type="text"
                        readOnly
                        value={currentRecord.details.phone || ''}
                        className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-slate-700 font-mono text-[11px]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-500 block mb-0.5">申请科室</label>
                      <input
                        type="text"
                        readOnly
                        value={currentRecord.details.department || ''}
                        className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-slate-800 font-medium"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-500 block mb-0.5">申请医生</label>
                      <input
                        type="text"
                        readOnly
                        value={currentRecord.details.applyDoctor || ''}
                        className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-slate-800 font-medium"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-500 block mb-0.5">病区 / 床号</label>
                      <input
                        type="text"
                        readOnly
                        value={`${currentRecord.details.ward || ''} / ${currentRecord.details.bedNo || ''}`}
                        className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-slate-800 font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-500 block mb-0.5">医生电话</label>
                      <input
                        type="text"
                        readOnly
                        value={currentRecord.details.doctorPhone || ''}
                        className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-slate-700 font-mono text-[11px]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-500 block mb-0.5">护士站电话</label>
                      <input
                        type="text"
                        readOnly
                        value={currentRecord.details.nursePhone || ''}
                        className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-slate-700 font-mono text-[11px]"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="text-[11px] text-slate-500 block mb-0.5">送检单位</label>
                      <input
                        type="text"
                        readOnly
                        value={currentRecord.details.sendDept || ''}
                        className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-slate-800"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="text-[11px] text-slate-500 block mb-0.5">临床诊断</label>
                      <div className="bg-white border border-slate-200 rounded px-2.5 py-1.5 text-slate-800 min-h-[38px] text-[11px] leading-relaxed">
                        {currentRecord.details.clinicalDiagnosis}
                      </div>
                    </div>
                    <div className="col-span-2">
                      <label className="text-[11px] text-slate-500 block mb-0.5">附加信息</label>
                      <div className="bg-white border border-slate-200 rounded px-2.5 py-1 text-slate-600 text-[11px]">
                        {currentRecord.details.extraInfo || '无特殊主诉与附加要求'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Column 2: Specimen Details & TAT Timeline */}
                <div className="bg-slate-50/70 rounded-xl p-4 border border-slate-200/80 space-y-3 flex flex-col">
                  <div className="flex items-center gap-2 text-slate-800 font-bold border-b border-slate-200 pb-2">
                    <FileText className="w-4 h-4 text-sky-600" />
                    <span>标本信息与核收状态</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-[11px] text-slate-500 block mb-0.5">申请项目</label>
                      <input
                        type="text"
                        readOnly
                        value={currentRecord.details.applyItem || ''}
                        className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-sky-700 font-semibold"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-500 block mb-0.5">采集条码</label>
                      <input
                        type="text"
                        readOnly
                        value={currentRecord.details.barcode || ''}
                        className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-slate-900 font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-500 block mb-0.5">标本类型</label>
                      <input
                        type="text"
                        readOnly
                        value={currentRecord.details.sampleType || ''}
                        className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-slate-800 font-medium"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-500 block mb-0.5">采集方法</label>
                      <input
                        type="text"
                        readOnly
                        value={currentRecord.details.collectMethod || '穿刺'}
                        className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-slate-800"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="text-[11px] text-slate-500 block mb-0.5">采集部位</label>
                      <input
                        type="text"
                        readOnly
                        value={currentRecord.details.collectSite || '前臂静脉'}
                        className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-slate-700 font-mono text-[11px]"
                      />
                    </div>
                  </div>

                  {/* Flow Timestamps */}
                  <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-2 mt-1">
                    <span className="text-[11px] font-semibold text-slate-700 block">流转时间戳 (TAT)</span>
                    <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                      <div className="bg-slate-50 p-2 rounded">
                        <span className="text-slate-400 block text-[10px]">申请时间</span>
                        <span className="text-slate-700">{currentRecord.details.applyTime}</span>
                      </div>
                      <div className="bg-slate-50 p-2 rounded">
                        <span className="text-slate-400 block text-[10px]">送检时间</span>
                        <span className="text-slate-700">{currentRecord.details.sendTime}</span>
                      </div>
                      <div className="bg-slate-50 p-2 rounded">
                        <span className="text-slate-400 block text-[10px]">核收时间</span>
                        <span className="text-slate-800 font-medium">{currentRecord.details.checkInTime}</span>
                      </div>
                      <div className="bg-slate-50 p-2 rounded">
                        <span className="text-slate-400 block text-[10px]">审核时间</span>
                        <span className="text-sky-700 font-medium">{currentRecord.details.auditTime || '-'}</span>
                      </div>
                    </div>
                  </div>

                  {/* 不合格理由 & 不合格备注 */}
                  {currentRecord.details.unqualifiedReason && (
                    <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 space-y-1">
                      <div className="flex items-center gap-1.5 text-amber-800 font-semibold text-[11px]">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                        <span>异常评估 / 不合格理由:</span>
                      </div>
                      <p className="text-amber-900 text-[11px]">{currentRecord.details.unqualifiedReason}</p>
                      {currentRecord.details.unqualifiedRemark && (
                        <p className="text-slate-600 text-[10px] mt-1 pt-1 border-t border-amber-200/60">
                          {currentRecord.details.unqualifiedRemark}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleConcessionCheckIn}
                  className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-800 text-xs font-medium rounded-lg transition-colors flex items-center gap-1 shadow-2xs"
                  title="对轻度脂血/微溶血等经评估可接受的标本执行让步核收"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                  <span>让步核收</span>
                </button>
                <button
                  onClick={() => setShowRejectModal(true)}
                  className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-300 text-rose-700 text-xs font-medium rounded-lg transition-colors flex items-center gap-1 shadow-2xs"
                  title="对严重凝块、量不足、错用管型等标本执行拒收"
                >
                  <Ban className="w-3.5 h-3.5 text-rose-600" />
                  <span>拒收</span>
                </button>
                <button
                  onClick={handleRevokeCheckIn}
                  className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-medium rounded-lg transition-colors flex items-center gap-1 shadow-2xs"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                  <span>撤销核收</span>
                </button>
                <button
                  onClick={() => setShowPrintModal(true)}
                  className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-medium rounded-lg transition-colors flex items-center gap-1 shadow-2xs"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-500" />
                  <span>补打条码</span>
                </button>
                <button
                  onClick={() => setShowEhrModal(true)}
                  className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-medium rounded-lg transition-colors flex items-center gap-1 shadow-2xs"
                >
                  <FileCheck className="w-3.5 h-3.5 text-slate-500" />
                  <span>查看病历</span>
                </button>
              </div>

              <button
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= 3. FLOATING ALERT TOASTS (Matches screenshot bottom right) ================= */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-2.5 max-w-sm pointer-events-auto">
        {/* Toast 1: TAT 超时预警 */}
        {showTatToast && (
          <div className="bg-white rounded-xl shadow-xl border border-rose-200 p-3.5 flex items-start gap-3 animate-fadeIn">
            <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center shrink-0 mt-0.5">
              <AlertCircle className="w-5 h-5 text-rose-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-xs">有标本TAT超时</span>
                <button onClick={() => setShowTatToast(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-slate-500 text-[11px] mt-0.5">内一科急诊生化标本送检已超 35 分钟，请及时处理！</p>
              <div className="mt-2 flex justify-end">
                <button
                  onClick={() => {
                    setSelectedId('CK-06');
                    triggerAction('已定位至TAT超时标本');
                  }}
                  className="text-xs font-semibold text-sky-600 hover:text-sky-800"
                >
                  查看
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Toast 2: 危急值标本报警 */}
        {showPanicToast && (
          <div className="bg-white rounded-xl shadow-xl border border-rose-300 p-3.5 flex items-start gap-3 animate-fadeIn">
            <div className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center shrink-0 mt-0.5 animate-pulse">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-bold text-rose-900 text-xs">有危急值标本！</span>
                <button onClick={() => setShowPanicToast(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-rose-700 text-[11px] mt-0.5">急诊科 孙祥林 [肌钙蛋白I &gt; 14.8 ng/mL] 触发严重报警，请立即电话通报！</p>
              <div className="mt-2 flex justify-end">
                <button
                  onClick={() => {
                    setSelectedId('CK-05');
                    triggerAction('已切换至急诊危急值标本 [孙祥林]');
                  }}
                  className="text-xs font-semibold text-rose-700 hover:text-rose-900 underline"
                >
                  查看
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ================= MODAL 1: 手工申请 (Matches screenshot image_3a8c36d0.png) ================= */}
      <CheckInManualApplyModal
        isOpen={showManualModal}
        onClose={() => setShowManualModal(false)}
        onSave={(newRecord) => {
          setRecords((prev) => [newRecord, ...prev]);
          setSelectedId(newRecord.id);
          triggerAction(`手工申请保存成功！已核收标本 [${newRecord.barcode} - ${newRecord.patientName}]`);
        }}
      />

      {/* ================= MODAL 2: 拒收登记 (Reject Specimen) ================= */}
      {showRejectModal && currentRecord && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden">
            <div className="px-5 py-3.5 bg-rose-50 border-b border-rose-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
                <Ban className="w-4 h-4 text-rose-600" />
                <span>标本拒收登记</span>
              </div>
              <button onClick={() => setShowRejectModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3.5 text-xs">
              <div className="bg-slate-50 p-2.5 rounded border border-slate-200 space-y-1">
                <div>患者: <strong>{currentRecord.patientName}</strong> ({currentRecord.department} / {currentRecord.details.bedNo})</div>
                <div>条码: <span className="font-mono text-sky-700 font-bold">{currentRecord.barcode}</span></div>
                <div>项目: {currentRecord.testItem}</div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">拒收原因 *</label>
                <select
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded p-2 focus:ring-1 focus:ring-rose-500"
                >
                  <option value="严重溶血 (游离血红蛋白>2.5g/L)">严重溶血 (无法测定生化指标)</option>
                  <option value="标本凝块 (纤维蛋白析出抗凝失常)">标本凝固 / 微小纤维蛋白凝块</option>
                  <option value="采血量严重不足 (未达抗凝管标示刻度)">采血量不足 (抗凝比例失衡)</option>
                  <option value="采血管类型错误 (错用抗凝管/促凝管)">采血管类型错误 (如生化误用EDTA管)</option>
                  <option value="标本条码破损/脏污光学无法识别">标本条码破损 / 褶皱 / 无法光学扫码</option>
                  <option value="严重乳糜脂血干扰光电比色">重度乳糜脂血 (干扰比色与发光分析)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">补充说明 (将下发至HIS系统)</label>
                <textarea
                  value={rejectNote}
                  onChange={(e) => setRejectNote(e.target.value)}
                  placeholder="例如：已电话通知责任护士重新抽取标本..."
                  rows={2}
                  className="w-full bg-white border border-slate-300 rounded p-2 focus:ring-1 focus:ring-rose-500 placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex justify-end gap-2.5">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-3.5 py-1.5 border border-slate-300 rounded text-slate-700 hover:bg-slate-100 font-medium"
              >
                取消
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded font-semibold shadow-xs"
              >
                确认拒收退单
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 3: 查看报告 (View Lab Report) ================= */}
      {showReportModal && currentRecord && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">市中心医院 · 检验科临床报告单</h3>
                <p className="text-[11px] text-slate-500">条码号: {currentRecord.barcode} · 标本来源: {currentRecord.details.patientSource}</p>
              </div>
              <button onClick={() => setShowReportModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-4 gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div><span className="text-slate-400">姓名:</span> <strong className="text-slate-900">{currentRecord.patientName}</strong></div>
                <div><span className="text-slate-400">性别/年龄:</span> {currentRecord.details.gender}/{currentRecord.details.age}</div>
                <div><span className="text-slate-400">病历号:</span> <span className="font-mono">{currentRecord.details.medicalRecordNo}</span></div>
                <div><span className="text-slate-400">科室/床号:</span> {currentRecord.department} {currentRecord.details.bedNo}</div>
              </div>

              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-600 border-b border-slate-200">
                    <tr>
                      <th className="px-3 py-2">测定代号</th>
                      <th className="px-3 py-2">检验项目</th>
                      <th className="px-3 py-2 font-mono">测定结果</th>
                      <th className="px-3 py-2 font-mono">参考范围</th>
                      <th className="px-3 py-2">单位</th>
                      <th className="px-3 py-2 text-right">提示</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {currentRecord.barcode === '0901005' ? (
                      <>
                        <tr className="bg-rose-50/60 font-bold">
                          <td className="px-3 py-2 text-rose-700">hs-cTnI</td>
                          <td className="px-3 py-2 font-sans text-rose-900">高敏肌钙蛋白I</td>
                          <td className="px-3 py-2 text-rose-600 text-sm">14.80</td>
                          <td className="px-3 py-2 text-slate-500">0.00 - 0.04</td>
                          <td className="px-3 py-2 font-sans text-slate-600">ng/mL</td>
                          <td className="px-3 py-2 text-right font-sans text-rose-600">危急值 ↑↑</td>
                        </tr>
                        <tr>
                          <td className="px-3 py-2 text-slate-800">CK-MB</td>
                          <td className="px-3 py-2 font-sans text-slate-700">肌酸激酶同工酶质量</td>
                          <td className="px-3 py-2 text-rose-600 font-bold">28.4</td>
                          <td className="px-3 py-2 text-slate-500">0.0 - 5.0</td>
                          <td className="px-3 py-2 font-sans text-slate-600">ng/mL</td>
                          <td className="px-3 py-2 text-right font-sans text-rose-600">偏高 ↑</td>
                        </tr>
                        <tr>
                          <td className="px-3 py-2 text-slate-800">Myo</td>
                          <td className="px-3 py-2 font-sans text-slate-700">肌红蛋白定量</td>
                          <td className="px-3 py-2 text-rose-600 font-bold">186.2</td>
                          <td className="px-3 py-2 text-slate-500">0.0 - 70.0</td>
                          <td className="px-3 py-2 font-sans text-slate-600">ng/mL</td>
                          <td className="px-3 py-2 text-right font-sans text-rose-600">偏高 ↑</td>
                        </tr>
                      </>
                    ) : (
                      <>
                        <tr>
                          <td className="px-3 py-2 text-slate-800">ALT</td>
                          <td className="px-3 py-2 font-sans text-slate-700">丙氨酸氨基转移酶</td>
                          <td className="px-3 py-2 text-slate-900 font-semibold">24.5</td>
                          <td className="px-3 py-2 text-slate-500">9.0 - 50.0</td>
                          <td className="px-3 py-2 font-sans text-slate-600">U/L</td>
                          <td className="px-3 py-2 text-right font-sans text-emerald-600">正常</td>
                        </tr>
                        <tr>
                          <td className="px-3 py-2 text-slate-800">AST</td>
                          <td className="px-3 py-2 font-sans text-slate-700">天门冬氨酸氨基转移酶</td>
                          <td className="px-3 py-2 text-slate-900 font-semibold">28.0</td>
                          <td className="px-3 py-2 text-slate-500">15.0 - 40.0</td>
                          <td className="px-3 py-2 font-sans text-slate-600">U/L</td>
                          <td className="px-3 py-2 text-right font-sans text-emerald-600">正常</td>
                        </tr>
                        <tr>
                          <td className="px-3 py-2 text-slate-800">TBIL</td>
                          <td className="px-3 py-2 font-sans text-slate-700">总胆红素测定</td>
                          <td className="px-3 py-2 text-slate-900 font-semibold">12.8</td>
                          <td className="px-3 py-2 text-slate-500">3.4 - 20.5</td>
                          <td className="px-3 py-2 font-sans text-slate-600">μmol/L</td>
                          <td className="px-3 py-2 text-right font-sans text-emerald-600">正常</td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between items-center text-[11px] text-slate-500 pt-2 border-t border-slate-200">
                <div>采样时间: {currentRecord.details.applyTime} · 仪器: 罗氏 Cobas 8000 / 雅培 Alinity</div>
                <div className="flex gap-4">
                  <span>检验者: <strong>张珊</strong></span>
                  <span>审签者: <strong>刘建国 (副主任技师)</strong></span>
                </div>
              </div>
            </div>

            <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end gap-2.5">
              <button
                onClick={() => {
                  triggerAction('报告已发送至网络激光打印机 (A4标准报告)');
                  setShowReportModal(false);
                }}
                className="px-4 py-1.5 bg-sky-600 text-white rounded font-medium text-xs flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>打印正式报告单</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 4: 查看病历 (EMR Synopsis) ================= */}
      {showEhrModal && currentRecord && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden">
            <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <FileCheck className="w-4 h-4 text-sky-600" />
                <span>电子病历查阅 · {currentRecord.patientName}</span>
              </div>
              <button onClick={() => setShowEhrModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3 text-xs text-slate-700">
              <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
                <div><strong>主诉：</strong>反复活动后胸闷、气促半年，加重伴心前区压榨感 2 小时。</div>
                <div><strong>现病史：</strong>患者今日晨起劳累后突感心前区压榨样剧痛，放射至左肩背部，伴大汗淋漓、面色苍白，舌下含服硝酸甘油片未见缓解。</div>
                <div><strong>既往史：</strong>高血压病史 10 年，最高 170/105 mmHg；否认药物过敏史。</div>
                <div><strong>临床拟诊：</strong>{currentRecord.details.clinicalDiagnosis}</div>
              </div>
              <div className="text-slate-500 text-[11px]">
                主管医师: {currentRecord.details.applyDoctor} · 护士站: {currentRecord.details.nursePhone}
              </div>
            </div>

            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setShowEhrModal(false)}
                className="px-4 py-1.5 bg-slate-900 text-white rounded text-xs font-medium"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 5: 补打条码 (Reprint Label) ================= */}
      {showPrintModal && currentRecord && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-sm w-full overflow-hidden">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <span className="font-bold text-slate-900 text-xs">补打试管条码标签</span>
              <button onClick={() => setShowPrintModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 flex flex-col items-center justify-center space-y-3">
              {/* Thermal Label Mock */}
              <div className="w-56 bg-amber-50/70 border-2 border-dashed border-amber-300 rounded p-3 font-mono text-center shadow-xs">
                <div className="text-[11px] font-sans font-bold text-slate-900 flex justify-between">
                  <span>{currentRecord.patientName}</span>
                  <span>{currentRecord.details.gender} {currentRecord.details.age}</span>
                </div>
                <div className="text-[10px] font-sans text-slate-500 text-left mt-0.5">
                  {currentRecord.department} {currentRecord.details.bedNo}
                </div>
                {/* Simulated Barcode */}
                <div className="my-2 bg-slate-900 h-9 w-full flex items-center justify-center text-white text-[9px] tracking-widest">
                  ||||||||||||||||||||||||||||||||
                </div>
                <div className="font-bold text-slate-900 text-xs tracking-wider">
                  {currentRecord.barcode}
                </div>
                <div className="text-[10px] font-sans text-slate-600 truncate mt-1">
                  {currentRecord.testItem}
                </div>
              </div>
              <span className="text-[11px] text-slate-400">标签尺寸: 50mm × 30mm · 热敏耐低温抗冷冻</span>
            </div>

            <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
              <button
                onClick={() => setShowPrintModal(false)}
                className="px-3 py-1 border border-slate-300 rounded text-xs text-slate-700"
              >
                取消
              </button>
              <button
                onClick={() => {
                  triggerAction(`条码 [${currentRecord.barcode}] 已发送至标签打印机打印`);
                  setShowPrintModal(false);
                }}
                className="px-3.5 py-1 bg-sky-600 hover:bg-sky-700 text-white rounded text-xs font-semibold flex items-center gap-1"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>立即补打</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 6: 打印设置 (Printer Settings) ================= */}
      {showPrinterConfigModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-sm w-full overflow-hidden">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <span className="font-bold text-slate-900 text-xs">热敏条码打印机配置</span>
              <button onClick={() => setShowPrinterConfigModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-3 text-xs">
              <div>
                <label className="text-slate-600 block mb-1">默认热敏标签打印机</label>
                <select className="w-full bg-white border border-slate-300 rounded p-1.5">
                  <option>斑马 Zebra ZD888 (USB/网络 203DPI)</option>
                  <option>佐藤 SATO CL4NX Plus (工位1)</option>
                  <option>博思得 POSTEK G-3106 (300DPI高精度)</option>
                </select>
              </div>
              <div>
                <label className="text-slate-600 block mb-1">打印黑度与浓度</label>
                <input type="range" min="1" max="15" defaultValue="11" className="w-full" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="autoCut" defaultChecked className="rounded text-sky-600" />
                <label htmlFor="autoCut" className="text-slate-700">条码打印后自动切纸并剥离</label>
              </div>
            </div>

            <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
              <button
                onClick={() => setShowPrinterConfigModal(false)}
                className="px-3 py-1 border border-slate-300 rounded text-xs text-slate-700"
              >
                取消
              </button>
              <button
                onClick={() => {
                  triggerAction('条码打印参数已保存并测试联机正常');
                  setShowPrinterConfigModal(false);
                }}
                className="px-3.5 py-1 bg-sky-600 text-white rounded text-xs font-semibold"
              >
                保存设置
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
