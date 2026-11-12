import React, { useState, useMemo } from 'react';
import {
  ReferralDeliveryOrder,
  ReferralSpecimenItem,
  INITIAL_REFERRAL_DELIVERY_ORDERS,
  REGIONAL_PARTNERS,
  RECEIVING_HOSPITALS
} from '../../data/regionalLabData';
import { UserProfile } from '../../types/navigation';
import {
  Search,
  Filter,
  Plus,
  Printer,
  Barcode,
  Truck,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Download,
  Building2,
  RefreshCw,
  X,
  Send,
  Eye,
  SlidersHorizontal,
  CheckSquare,
  AlertTriangle,
  RotateCcw,
  Check,
  Settings
} from '../MenuIcon';

interface RegionalReferralApplyViewProps {
  user: UserProfile;
  triggerAction: (text: string) => void;
}

type TabType = 'active' | 'rejected';

export const RegionalReferralApplyView: React.FC<RegionalReferralApplyViewProps> = ({
  user,
  triggerAction,
}) => {
  // Top filter states matching screenshot
  const [statusFilter, setStatusFilter] = useState<string>('所有');
  const [startTime, setStartTime] = useState<string>('2026-10-30 00:00');
  const [endTime, setEndTime] = useState<string>('2026-10-30 23:59');
  const [receiveHospitalFilter, setReceiveHospitalFilter] = useState<string>('中心医院');
  const [activeTab, setActiveTab] = useState<TabType>('active');
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  // Orders dataset
  const [deliveryOrders, setDeliveryOrders] = useState<ReferralDeliveryOrder[]>(
    INITIAL_REFERRAL_DELIVERY_ORDERS
  );

  // Bottom-right rejection toast visibility
  const [showRejectToast, setShowRejectToast] = useState(true);

  // MODAL 1: Click row to view right-side specimen details (The primary user request!)
  const [selectedOrderForModal, setSelectedOrderForModal] = useState<ReferralDeliveryOrder | null>(null);

  // MODAL 2: 标本送检 (New delivery requisition modal)
  const [isDeliverModalOpen, setIsDeliverModalOpen] = useState(false);
  const [newDeliverForm, setNewDeliverForm] = useState({
    applyHospital: '城东社区卫生服务中心',
    receiveHospital: '市中心医院检验中心',
    deliverer: '张强 (冷链专运员)',
    coolerBox: 'COLD-BOX-018',
    coolerTemp: '3.8℃',
    patientName: '赵国庆',
    patientCategory: '门诊' as '住院' | '门诊' | '体检' | '慢病签约',
    medicalRecordNo: '1812175520',
    barcode: '0011812170060',
    specimenType: '全血',
    applyItemName: '血常规5分类+CRP',
    applyDept: '全科医疗科',
    applyDoctor: '刘全医生',
  });

  // MODAL 3: 补打印清单 (Handover List Print Preview Modal)
  const [isPrintListModalOpen, setIsPrintListModalOpen] = useState(false);
  const [selectedOrderForPrint, setSelectedOrderForPrint] = useState<ReferralDeliveryOrder | null>(
    INITIAL_REFERRAL_DELIVERY_ORDERS[0]
  );

  // MODAL 4: 打印设置 (Print settings modal)
  const [isPrintSettingModalOpen, setIsPrintSettingModalOpen] = useState(false);
  const [printSettings, setPrintSettings] = useState({
    printerName: 'Zebra ZD888 条码打印机 (USB001)',
    paperSpec: '50mm × 30mm (医联体双条码专版)',
    handoverPaper: 'A4 激光打印机 (二联无碳复写)',
    autoPrintOnDispatch: true,
    printDensity: '8 (标准清晰度)',
  });

  // Filtered orders list based on tab, status, and search
  const filteredOrders = useMemo(() => {
    return deliveryOrders.filter((order) => {
      // Tab filter
      if (activeTab === 'rejected' && order.status !== '已拒收') {
        const hasRejectedSpecimen = order.specimens.some((s) => s.status === '已拒收');
        if (!hasRejectedSpecimen) return false;
      }
      if (activeTab === 'active' && order.status === '已拒收') {
        return false;
      }

      // Status dropdown filter
      if (statusFilter !== '所有' && order.status !== statusFilter) {
        return false;
      }

      // Search keyword
      if (searchKeyword.trim()) {
        const q = searchKeyword.toLowerCase().trim();
        const match =
          order.orderNo.toLowerCase().includes(q) ||
          order.applyHospital.toLowerCase().includes(q) ||
          order.deliverer.toLowerCase().includes(q) ||
          order.specimens.some(
            (s) =>
              s.patientName.toLowerCase().includes(q) ||
              s.barcode.toLowerCase().includes(q) ||
              s.applyItemName.toLowerCase().includes(q)
          );
        if (!match) return false;
      }

      return true;
    });
  }, [deliveryOrders, activeTab, statusFilter, searchKeyword]);

  // Rejected count for tab badge
  const rejectedCount = useMemo(() => {
    return deliveryOrders.filter(
      (o) => o.status === '已拒收' || o.specimens.some((s) => s.status === '已拒收')
    ).length;
  }, [deliveryOrders]);

  // Action: 撤销 (Revoke delivery)
  const handleRevokeOrder = (e: React.MouseEvent, order: ReferralDeliveryOrder) => {
    e.stopPropagation();
    if (order.status === '已接收') {
      triggerAction(`送检单 ${order.orderNo} 中心已核收入库，无法撤销！`);
      return;
    }
    setDeliveryOrders((prev) =>
      prev.map((o) =>
        o.id === order.id ? { ...o, status: '已撤销' as const } : o
      )
    );
    triggerAction(`送检单 ${order.orderNo} 已撤销送检，标本已返还至科室暂存箱`);
  };

  // Submit new delivery order
  const handleCreateDeliverySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newOrder: ReferralDeliveryOrder = {
      id: 'DELIV-' + (deliveryOrders.length + 1).toString().padStart(3, '0'),
      orderNo: '181217' + Math.floor(10000 + Math.random() * 90000).toString(),
      applyHospital: newDeliverForm.applyHospital,
      applyHospitalCode: 'CD-CHSC-01',
      deliverTime: '2026-10-30 14:10:00',
      receiveHospital: newDeliverForm.receiveHospital,
      deliverer: newDeliverForm.deliverer,
      status: '已送检',
      coolerTemp: newDeliverForm.coolerTemp,
      specimens: [
        {
          id: 'SPEC-NEW-1',
          patientName: newDeliverForm.patientName,
          patientCategory: newDeliverForm.patientCategory,
          medicalRecordNo: newDeliverForm.medicalRecordNo,
          barcode: newDeliverForm.barcode,
          specimenType: newDeliverForm.specimenType,
          applyItemName: newDeliverForm.applyItemName,
          applyDept: newDeliverForm.applyDept,
          applyDoctor: newDeliverForm.applyDoctor,
          status: '已送检',
        },
      ],
    };
    setDeliveryOrders([newOrder, ...deliveryOrders]);
    setIsDeliverModalOpen(false);
    triggerAction(`【外送成功】已生成送检单 ${newOrder.orderNo}，并派发冷链专运！`);
  };

  // Save print settings
  const handleSavePrintSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setIsPrintSettingModalOpen(false);
    triggerAction('医联体外送条码打印机与格式参数已成功保存！');
  };

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-white overflow-hidden relative">
      {/* =========================================================================
          1. TOP FILTER BAR (Matches screenshot layout & controls)
          ========================================================================= */}
      <div className="px-5 py-3 border-b border-slate-200 bg-white shrink-0 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-4">
            {/* 状态下拉框 */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-600 font-medium">状态</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded px-2.5 py-1 text-slate-800 focus:outline-hidden focus:border-sky-500 font-medium min-w-[90px]"
              >
                <option value="所有">所有</option>
                <option value="已送检">已送检</option>
                <option value="已接收">已接收</option>
                <option value="已拒收">已拒收</option>
                <option value="已撤销">已撤销</option>
              </select>
            </div>

            {/* 送检时间范围 (近期时间 2026-10-30 00:00 ~ 2026-10-30 23:59) */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-600 font-medium">送检时间</span>
              <div className="flex items-center gap-1 bg-slate-50 border border-slate-300 rounded px-2 py-0.5 font-mono text-slate-700">
                <input
                  type="text"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="bg-transparent w-36 text-center focus:outline-hidden text-xs"
                />
                <span className="text-slate-400">~</span>
                <input
                  type="text"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="bg-transparent w-36 text-center focus:outline-hidden text-xs"
                />
              </div>
            </div>

            {/* 接收医院下拉框 (截图中的 中心医院) */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-600 font-medium">接收医院</span>
              <select
                value={receiveHospitalFilter}
                onChange={(e) => setReceiveHospitalFilter(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded px-2.5 py-1 text-slate-800 font-medium focus:outline-hidden focus:border-sky-500 text-xs min-w-[120px]"
              >
                <option value="中心医院">中心医院 (市中心医院检验中心)</option>
                <option value="省人民医院">省人民医院医联体分中心</option>
                <option value="第一人民医院">第一人民医院检验医学中心</option>
              </select>
            </div>

            {/* 查询按钮 (白底蓝边) */}
            <button
              onClick={() => triggerAction('已按当前条件重新检索外送申请单')}
              className="px-4 py-1 bg-white hover:bg-sky-50 text-sky-700 border border-sky-600 rounded font-medium shadow-2xs transition-colors"
            >
              查询
            </button>
          </div>

          {/* Quick Search Input */}
          <div className="relative w-56">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="搜索单号、条码、患者姓名..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full pl-8 pr-2.5 py-1 bg-slate-50 border border-slate-300 rounded text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-sky-500 focus:bg-white text-xs"
            />
          </div>
        </div>
      </div>

      {/* =========================================================================
          2. SUB-TABS & ACTION BUTTONS STRIP (Matches screenshot)
          ========================================================================= */}
      <div className="px-5 py-2.5 bg-slate-50/90 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0 text-xs">
        {/* Left Tabs: 送检标本 / 拒收标本 1 */}
        <div className="flex items-center gap-5">
          <button
            onClick={() => setActiveTab('active')}
            className={`font-semibold pb-0.5 transition-colors relative flex items-center gap-1.5 ${
              activeTab === 'active'
                ? 'text-sky-600 border-b-2 border-sky-600 font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>送检标本</span>
            <span className="text-[11px] font-mono font-normal text-slate-400">
              ({deliveryOrders.filter((o) => o.status !== '已拒收').length})
            </span>
          </button>

          <button
            onClick={() => setActiveTab('rejected')}
            className={`font-semibold pb-0.5 transition-colors relative flex items-center gap-1.5 ${
              activeTab === 'rejected'
                ? 'text-rose-600 border-b-2 border-rose-600 font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>拒收标本</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-500 text-white font-bold font-mono">
              {rejectedCount}
            </span>
          </button>
        </div>

        {/* Right Action Buttons from screenshot: 标本送检 (Blue) / 补打印清单 / 打印设置 */}
        <div className="flex items-center gap-2.5">
          {/* Button 1: 标本送检 (Solid Blue Button) */}
          <button
            onClick={() => setIsDeliverModalOpen(true)}
            className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded font-medium shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>标本送检</span>
          </button>

          {/* Button 2: 补打印清单 (White with blue border) */}
          <button
            onClick={() => {
              if (filteredOrders.length > 0) {
                setSelectedOrderForPrint(filteredOrders[0]);
              }
              setIsPrintListModalOpen(true);
            }}
            className="px-3.5 py-1.5 bg-white hover:bg-sky-50 text-sky-700 border border-sky-600 rounded font-medium shadow-2xs transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5 text-sky-600" />
            <span>补打印清单</span>
          </button>

          {/* Button 3: 打印设置 (White with blue border) */}
          <button
            onClick={() => setIsPrintSettingModalOpen(true)}
            className="px-3.5 py-1.5 bg-white hover:bg-sky-50 text-sky-700 border border-sky-600 rounded font-medium shadow-2xs transition-colors flex items-center gap-1.5"
          >
            <Settings className="w-3.5 h-3.5 text-sky-600" />
            <span>打印设置</span>
          </button>
        </div>
      </div>

      {/* Notice Banner explaining the modal interaction */}
      <div className="px-5 py-2 bg-sky-50/70 border-b border-sky-100 flex items-center justify-between text-xs text-sky-800 shrink-0">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-sky-600 shrink-0" />
          <span>
            <strong>页面交互升级说明：</strong>
            当前主屏直接平铺展示送检单全貌。<strong>点击任意送检单行</strong>，即可
            <strong>弹窗查看该单包含的所有患者与标本明细</strong>（原右侧信息现已转为高清弹窗展示）。
          </span>
        </div>
        <span className="text-[11px] font-mono text-sky-600">
          共 {filteredOrders.length} 个送检批次
        </span>
      </div>

      {/* =========================================================================
          3. MAIN TABLE: Full-width Left-Side Table (送检单列表)
             Columns: 状态, 送检单号, 申请医院, 送检时间, 接收医院, 送检人, 标本支数, 操作
          ========================================================================= */}
      <div className="flex-1 overflow-auto min-h-0">
        <table className="w-full border-collapse text-left text-xs text-slate-700">
          <thead className="bg-slate-100/90 text-slate-700 font-semibold sticky top-0 z-10 border-b border-slate-200">
            <tr>
              <th className="py-2.5 px-3 w-10 text-center font-mono">#</th>
              <th className="py-2.5 px-3 w-24 text-center">状态</th>
              <th className="py-2.5 px-4 w-40">送检单号</th>
              <th className="py-2.5 px-4 w-48">申请医院</th>
              <th className="py-2.5 px-4 w-44">送检时间</th>
              <th className="py-2.5 px-4 w-44">接收医院</th>
              <th className="py-2.5 px-4 w-32">送检人</th>
              <th className="py-2.5 px-3 w-28 text-center">标本支数</th>
              <th className="py-2.5 px-4 text-center w-36">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {filteredOrders.map((order, idx) => {
              const isReceived = order.status === '已接收';
              const isDelivered = order.status === '已送检';
              const isRejected = order.status === '已拒收';
              const isRevoked = order.status === '已撤销';

              return (
                <tr
                  key={order.id}
                  onClick={() => setSelectedOrderForModal(order)}
                  className={`hover:bg-sky-50/50 cursor-pointer transition-colors group ${
                    isRejected ? 'bg-rose-50/20' : ''
                  }`}
                  title="点击该行以弹窗展示标本明细"
                >
                  <td className="py-3 px-3 text-center font-mono text-slate-400">
                    {idx + 1}
                  </td>

                  {/* 状态 (已送检 / 已接收 / 已拒收 / 已撤销) */}
                  <td className="py-3 px-3 text-center">
                    {isReceived && (
                      <span className="font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        已接收
                      </span>
                    )}
                    {isDelivered && (
                      <span className="font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                        已送检
                      </span>
                    )}
                    {isRejected && (
                      <span className="font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200 flex items-center justify-center gap-1">
                        <AlertCircle className="w-3 h-3 text-rose-600" />
                        已拒收
                      </span>
                    )}
                    {isRevoked && (
                      <span className="font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                        已撤销
                      </span>
                    )}
                  </td>

                  {/* 送检单号 (如 18121700001) */}
                  <td className="py-3 px-4 font-mono font-bold text-slate-900 group-hover:text-sky-600 flex items-center gap-1.5">
                    <span>{order.orderNo}</span>
                  </td>

                  {/* 申请医院 */}
                  <td className="py-3 px-4 font-medium text-slate-800">
                    {order.applyHospital}
                  </td>

                  {/* 送检时间 */}
                  <td className="py-3 px-4 font-mono text-slate-600">
                    {order.deliverTime}
                  </td>

                  {/* 接收医院 */}
                  <td className="py-3 px-4 text-slate-800 font-medium">
                    {order.receiveHospital}
                  </td>

                  {/* 送检人 */}
                  <td className="py-3 px-4 text-slate-700">
                    {order.deliverer}
                  </td>

                  {/* 标本支数 */}
                  <td className="py-3 px-3 text-center">
                    <span className="font-mono font-bold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-100">
                      {order.specimens.length} 支标本
                    </span>
                  </td>

                  {/* 操作列: 撤销 / 查看明细 */}
                  <td className="py-3 px-4 text-center space-x-3" onClick={(e) => e.stopPropagation()}>
                    {/* 查看明细 (Click opens modal) */}
                    <button
                      onClick={() => setSelectedOrderForModal(order)}
                      className="text-sky-600 hover:text-sky-800 font-medium text-xs hover:underline"
                    >
                      查看明细
                    </button>

                    {/* 撤销 (Screenshot blue link) */}
                    {isDelivered && (
                      <button
                        onClick={(e) => handleRevokeOrder(e, order)}
                        className="text-sky-600 hover:text-rose-600 font-medium text-xs hover:underline"
                      >
                        撤销
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan={9} className="py-16 text-center text-slate-400">
                  <div className="flex flex-col items-center gap-2">
                    <FileText className="w-8 h-8 opacity-30" />
                    <span>暂无符合条件的送检单记录</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* =========================================================================
          4. BOTTOM-RIGHT TOAST: "有1份标本已拒收 请及时处理！ 查看" (Matches screenshot)
          ========================================================================= */}
      {showRejectToast && (
        <div className="fixed bottom-6 right-8 z-40 bg-white border border-rose-200 rounded-xl p-4 shadow-xl max-w-sm flex items-start gap-3 animate-fadeIn">
          <div className="p-2 rounded-full bg-rose-100 text-rose-600 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="flex-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 text-sm">有1份标本已拒收</span>
              <button
                onClick={() => setShowRejectToast(false)}
                className="text-slate-400 hover:text-slate-700 p-0.5 rounded"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-slate-500 mt-1">请及时处理！中心反馈：标本重度溶血。</p>
            <div className="mt-2.5 flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  setActiveTab('rejected');
                  const rejectedOrder = deliveryOrders.find((o) => o.status === '已拒收');
                  if (rejectedOrder) setSelectedOrderForModal(rejectedOrder);
                }}
                className="text-xs text-sky-600 hover:text-sky-800 font-bold hover:underline"
              >
                查看详情 &gt;
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 1: SPECIMEN DETAILS MODAL (The Right Table from screenshot, converted to Modal)
          Columns: 姓名, 患者类别, 病历号, 条码号, 样本类型, 申请项目, 申请科室, 申请医生, 状态, 操作
          ========================================================================= */}
      {selectedOrderForModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-300 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-scaleIn">
            {/* Modal Header with Order Summary */}
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-sky-400" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base">送检单标本明细清单</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        selectedOrderForModal.status === '已接收'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : selectedOrderForModal.status === '已送检'
                          ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}
                    >
                      {selectedOrderForModal.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5 font-mono">
                    送检单号: {selectedOrderForModal.orderNo} · 申请医院:{' '}
                    {selectedOrderForModal.applyHospital}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedOrderForPrint(selectedOrderForModal);
                    setIsPrintListModalOpen(true);
                  }}
                  className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs rounded-lg font-medium flex items-center gap-1.5 shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>打印交接单</span>
                </button>
                <button
                  onClick={() => setSelectedOrderForModal(null)}
                  className="text-slate-400 hover:text-white p-1.5 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Order Demographics Strip */}
            <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 grid grid-cols-4 gap-4 text-xs shrink-0">
              <div>
                <span className="text-slate-400 block text-[11px]">接收机构</span>
                <span className="font-semibold text-slate-800">
                  {selectedOrderForModal.receiveHospital}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">送检派发时间</span>
                <span className="font-mono text-slate-800">
                  {selectedOrderForModal.deliverTime}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">冷链送检人</span>
                <span className="font-medium text-slate-800">
                  {selectedOrderForModal.deliverer}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">保温箱温</span>
                <span className="font-mono font-bold text-sky-700">
                  {selectedOrderForModal.coolerTemp || '3.8℃ (冷藏达标)'}
                </span>
              </div>
            </div>

            {/* Specimen Table: Exact columns from Right Table in screenshot */}
            <div className="flex-1 overflow-auto min-h-0 p-5">
              <table className="w-full border-collapse text-left text-xs text-slate-700">
                <thead className="bg-slate-100 text-slate-700 font-semibold sticky top-0 z-10 border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3 w-10 text-center font-mono">#</th>
                    <th className="py-2.5 px-3">姓名</th>
                    <th className="py-2.5 px-3">患者类别</th>
                    <th className="py-2.5 px-3 font-mono">病历号</th>
                    <th className="py-2.5 px-3 font-mono">条码号</th>
                    <th className="py-2.5 px-3">样本类型</th>
                    <th className="py-2.5 px-3">申请项目</th>
                    <th className="py-2.5 px-3">申请科室</th>
                    <th className="py-2.5 px-3">申请医生</th>
                    <th className="py-2.5 px-3 text-center">状态</th>
                    <th className="py-2.5 px-3 text-center w-24">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {selectedOrderForModal.specimens.map((spec, sIdx) => {
                    const isSpecReceived = spec.status === '已接收';
                    const isSpecDelivered = spec.status === '已送检';
                    const isSpecRejected = spec.status === '已拒收';

                    return (
                      <tr
                        key={spec.id}
                        className={`hover:bg-slate-50 transition-colors ${
                          isSpecRejected ? 'bg-rose-50/40' : ''
                        }`}
                      >
                        <td className="py-2.5 px-3 text-center font-mono text-slate-400">
                          {sIdx + 1}
                        </td>
                        {/* 姓名 (如 张三、李琴 -> 王建平、李琴) */}
                        <td className="py-2.5 px-3 font-bold text-slate-900">
                          {spec.patientName}
                        </td>
                        {/* 患者类别 (住院 / 门诊) */}
                        <td className="py-2.5 px-3">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[11px] font-medium ${
                              spec.patientCategory === '住院'
                                ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                : 'bg-blue-50 text-blue-700 border border-blue-200'
                            }`}
                          >
                            {spec.patientCategory}
                          </span>
                        </td>
                        {/* 病历号 (如 1811301101) */}
                        <td className="py-2.5 px-3 font-mono text-slate-700">
                          {spec.medicalRecordNo}
                        </td>
                        {/* 条码号 (如 0011812170001) */}
                        <td className="py-2.5 px-3 font-mono font-bold text-sky-800">
                          {spec.barcode}
                        </td>
                        {/* 样本类型 (全血 / 血清) */}
                        <td className="py-2.5 px-3 font-medium text-slate-800">
                          {spec.specimenType}
                        </td>
                        {/* 申请项目 (如 血常规5分类(XCGWFL), 肝脏功能测定(GZGNCD)) */}
                        <td className="py-2.5 px-3 font-semibold text-slate-900">
                          {spec.applyItemName}
                          {spec.rejectionReason && (
                            <div className="text-[11px] text-rose-600 font-normal mt-0.5">
                              拒收原因：{spec.rejectionReason}
                            </div>
                          )}
                        </td>
                        {/* 申请科室 (如 内科 / 妇科) */}
                        <td className="py-2.5 px-3 text-slate-700">
                          {spec.applyDept}
                        </td>
                        {/* 申请医生 (如 王医生 / 吴医生 -> 刘全医生 / 吴文彬医生) */}
                        <td className="py-2.5 px-3 text-slate-800 font-medium">
                          {spec.applyDoctor}
                        </td>
                        {/* 状态 */}
                        <td className="py-2.5 px-3 text-center">
                          {isSpecReceived && (
                            <span className="font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              已接收
                            </span>
                          )}
                          {isSpecDelivered && (
                            <span className="font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                              已送检
                            </span>
                          )}
                          {isSpecRejected && (
                            <span className="font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                              已拒收
                            </span>
                          )}
                        </td>
                        {/* 操作 */}
                        <td className="py-2.5 px-3 text-center space-x-1.5">
                          <button
                            onClick={() =>
                              triggerAction(`标本条码 [${spec.barcode}] 已发送至专用条码机重打`)
                            }
                            className="px-2 py-0.5 text-sky-600 hover:text-sky-800 hover:bg-sky-50 rounded text-xs"
                          >
                            重打条码
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Modal Bottom Actions */}
            <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 flex items-center justify-between shrink-0 text-xs">
              <div className="flex items-center gap-2 text-slate-500">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>医联体集中送检平台数据传输状态良好</span>
              </div>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedOrderForModal(null)}
                  className="px-5 py-1.5 rounded-lg bg-sky-600 text-white font-semibold hover:bg-sky-700 shadow-xs"
                >
                  关闭
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: 标本送检 (New Specimen Referral Modal)
          ========================================================================= */}
      {isDeliverModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-300 w-full max-w-xl overflow-hidden animate-scaleIn">
            <div className="bg-sky-600 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Send className="w-5 h-5 text-white" />
                <span className="font-bold text-base">新建标本送检派发单</span>
              </div>
              <button
                onClick={() => setIsDeliverModalOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateDeliverySubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    申请送检医院
                  </label>
                  <select
                    value={newDeliverForm.applyHospital}
                    onChange={(e) =>
                      setNewDeliverForm({ ...newDeliverForm, applyHospital: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-slate-800 font-medium"
                  >
                    {REGIONAL_PARTNERS.map((p) => (
                      <option key={p.id} value={p.name}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    接收医院
                  </label>
                  <select
                    value={newDeliverForm.receiveHospital}
                    onChange={(e) =>
                      setNewDeliverForm({ ...newDeliverForm, receiveHospital: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-slate-800 font-medium"
                  >
                    <option value="市中心医院检验中心">市中心医院检验中心 (区域总院)</option>
                    <option value="省人民医院医联体分中心">省人民医院医联体分中心</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    冷链送检人
                  </label>
                  <input
                    type="text"
                    value={newDeliverForm.deliverer}
                    onChange={(e) =>
                      setNewDeliverForm({ ...newDeliverForm, deliverer: e.target.value })
                    }
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    温控箱编号及实时温度
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    <input
                      type="text"
                      value={newDeliverForm.coolerBox}
                      onChange={(e) =>
                        setNewDeliverForm({ ...newDeliverForm, coolerBox: e.target.value })
                      }
                      className="w-full bg-white border border-slate-300 rounded px-2 py-1.5 text-slate-800 font-mono"
                    />
                    <input
                      type="text"
                      value={newDeliverForm.coolerTemp}
                      onChange={(e) =>
                        setNewDeliverForm({ ...newDeliverForm, coolerTemp: e.target.value })
                      }
                      className="w-full bg-white border border-slate-300 rounded px-2 py-1.5 text-slate-800 font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="p-3 bg-sky-50 rounded-lg border border-sky-200 space-y-2">
                <span className="font-bold text-sky-900 block">录入外送标本信息</span>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[11px] text-slate-500 block mb-0.5">患者姓名</label>
                    <input
                      type="text"
                      value={newDeliverForm.patientName}
                      onChange={(e) =>
                        setNewDeliverForm({ ...newDeliverForm, patientName: e.target.value })
                      }
                      className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-slate-800"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 block mb-0.5">患者类别</label>
                    <select
                      value={newDeliverForm.patientCategory}
                      onChange={(e) =>
                        setNewDeliverForm({
                          ...newDeliverForm,
                          patientCategory: e.target.value as any,
                        })
                      }
                      className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-slate-800"
                    >
                      <option value="门诊">门诊</option>
                      <option value="住院">住院</option>
                      <option value="体检">体检</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 block mb-0.5">病历号</label>
                    <input
                      type="text"
                      value={newDeliverForm.medicalRecordNo}
                      onChange={(e) =>
                        setNewDeliverForm({
                          ...newDeliverForm,
                          medicalRecordNo: e.target.value,
                        })
                      }
                      className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-slate-800 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[11px] text-slate-500 block mb-0.5">预分配条码号</label>
                    <input
                      type="text"
                      value={newDeliverForm.barcode}
                      onChange={(e) =>
                        setNewDeliverForm({ ...newDeliverForm, barcode: e.target.value })
                      }
                      className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-slate-800 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 block mb-0.5">样本类型</label>
                    <select
                      value={newDeliverForm.specimenType}
                      onChange={(e) =>
                        setNewDeliverForm({ ...newDeliverForm, specimenType: e.target.value })
                      }
                      className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-slate-800"
                    >
                      <option value="全血">全血 (紫头管)</option>
                      <option value="血清">血清 (黄头管)</option>
                      <option value="尿液">清洁尿 (尿杯)</option>
                      <option value="血浆">血浆 (蓝头管)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 block mb-0.5">申请项目</label>
                    <input
                      type="text"
                      value={newDeliverForm.applyItemName}
                      onChange={(e) =>
                        setNewDeliverForm({ ...newDeliverForm, applyItemName: e.target.value })
                      }
                      className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-slate-800"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsDeliverModalOpen(false)}
                  className="px-4 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 font-medium"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 rounded-lg bg-sky-600 text-white font-semibold hover:bg-sky-700 shadow-xs"
                >
                  确认打包送检
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: 补打印清单 (Handover List Print Preview Modal)
          ========================================================================= */}
      {isPrintListModalOpen && selectedOrderForPrint && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-300 w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden animate-scaleIn">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-sky-400" />
                <span className="font-bold text-base">送检标本交接清单 (打印预览)</span>
              </div>
              <button
                onClick={() => setIsPrintListModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-slate-50 min-h-0">
              {/* Paper mockup */}
              <div className="bg-white p-6 rounded-lg shadow-xs border border-slate-300 max-w-xl mx-auto space-y-4 text-xs text-slate-800">
                <div className="text-center pb-3 border-b-2 border-slate-800">
                  <h3 className="font-bold text-base tracking-wider text-slate-900">
                    区域医联体外送检验标本交接清单
                  </h3>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 font-mono">
                    <span>送检单号: {selectedOrderForPrint.orderNo}</span>
                    <span>送检时间: {selectedOrderForPrint.deliverTime}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400">申请医院：</span>
                    <strong className="text-slate-800">{selectedOrderForPrint.applyHospital}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">接收医院：</span>
                    <strong className="text-slate-800">{selectedOrderForPrint.receiveHospital}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">送检人员：</span>
                    <span>{selectedOrderForPrint.deliverer}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">箱温核验：</span>
                    <span className="font-mono">{selectedOrderForPrint.coolerTemp || '3.8℃ (合格)'}</span>
                  </div>
                </div>

                {/* Items in the list */}
                <table className="w-full border-collapse border border-slate-300 text-left text-[11px]">
                  <thead className="bg-slate-100 font-semibold text-slate-700">
                    <tr>
                      <th className="border border-slate-300 py-1 px-2 text-center w-8">#</th>
                      <th className="border border-slate-300 py-1 px-2">姓名</th>
                      <th className="border border-slate-300 py-1 px-2">病历号</th>
                      <th className="border border-slate-300 py-1 px-2">条码号</th>
                      <th className="border border-slate-300 py-1 px-2">样本</th>
                      <th className="border border-slate-300 py-1 px-2">检验项目</th>
                      <th className="border border-slate-300 py-1 px-2">科室/医生</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrderForPrint.specimens.map((s, idx) => (
                      <tr key={s.id}>
                        <td className="border border-slate-300 py-1 px-2 text-center font-mono">{idx + 1}</td>
                        <td className="border border-slate-300 py-1 px-2 font-bold">{s.patientName}</td>
                        <td className="border border-slate-300 py-1 px-2 font-mono">{s.medicalRecordNo}</td>
                        <td className="border border-slate-300 py-1 px-2 font-mono font-semibold">{s.barcode}</td>
                        <td className="border border-slate-300 py-1 px-2">{s.specimenType}</td>
                        <td className="border border-slate-300 py-1 px-2">{s.applyItemName}</td>
                        <td className="border border-slate-300 py-1 px-2">{s.applyDept} {s.applyDoctor}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Sign-off footer */}
                <div className="pt-4 border-t border-slate-200 grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span>送检交接人签字：</span>
                    <span className="underline decoration-slate-400 font-mono">
                      &nbsp;&nbsp;{selectedOrderForPrint.deliverer}&nbsp;&nbsp;
                    </span>
                  </div>
                  <div>
                    <span>中心接收人签字：</span>
                    <span className="underline decoration-slate-400 font-mono">
                      &nbsp;&nbsp;张珊 (主管检验师)&nbsp;&nbsp;
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 flex items-center justify-between shrink-0 text-xs">
              <span className="text-slate-500">双联清单：送检科室存查联 + 中心实验室接收联</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsPrintListModalOpen(false)}
                  className="px-4 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 font-medium"
                >
                  关闭
                </button>
                <button
                  type="button"
                  onClick={() => {
                    triggerAction(`送检单 ${selectedOrderForPrint.orderNo} 清单已发送至激光打印机！`);
                    setIsPrintListModalOpen(false);
                  }}
                  className="px-5 py-1.5 rounded-lg bg-sky-600 text-white font-semibold hover:bg-sky-700 shadow-xs flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>立即打印</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 4: 打印设置 (Print Settings Modal)
          ========================================================================= */}
      {isPrintSettingModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-300 w-full max-w-lg overflow-hidden animate-scaleIn">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-sky-400" />
                <span className="font-bold text-base">送检申请条码与交接单打印设置</span>
              </div>
              <button
                onClick={() => setIsPrintSettingModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePrintSettings} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  医联体专用条码打印机
                </label>
                <select
                  value={printSettings.printerName}
                  onChange={(e) =>
                    setPrintSettings({ ...printSettings, printerName: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-slate-800"
                >
                  <option value="Zebra ZD888 条码打印机 (USB001)">Zebra ZD888 条码打印机 (USB001)</option>
                  <option value="POSTEK G2108 高清条码机 (NET 192.168.1.188)">POSTEK G2108 高清条码机 (NET 192.168.1.188)</option>
                  <option value="TSC TX200 医用热敏打印机">TSC TX200 医用热敏打印机</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  外送采血管条码标签规格
                </label>
                <select
                  value={printSettings.paperSpec}
                  onChange={(e) =>
                    setPrintSettings({ ...printSettings, paperSpec: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-slate-800"
                >
                  <option value="50mm × 30mm (医联体双条码专版)">50mm × 30mm (医联体双条码专版)</option>
                  <option value="40mm × 25mm (标准采血管版)">40mm × 25mm (标准采血管版)</option>
                  <option value="60mm × 40mm (带患者二维码增强版)">60mm × 40mm (带患者二维码增强版)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  交接清单打印机
                </label>
                <input
                  type="text"
                  value={printSettings.handoverPaper}
                  onChange={(e) =>
                    setPrintSettings({ ...printSettings, handoverPaper: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-slate-800"
                />
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-200">
                <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={printSettings.autoPrintOnDispatch}
                    onChange={(e) =>
                      setPrintSettings({
                        ...printSettings,
                        autoPrintOnDispatch: e.target.checked,
                      })
                    }
                    className="rounded text-sky-600"
                  />
                  <span>标本送检打包确认后，自动触发条码补打与交接单打印</span>
                </label>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsPrintSettingModalOpen(false)}
                  className="px-4 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 font-medium"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 rounded-lg bg-sky-600 text-white font-semibold hover:bg-sky-700 shadow-xs"
                >
                  保存设置
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
