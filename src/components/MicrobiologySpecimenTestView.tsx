import React, { useState } from 'react';
import {
  MicrobiologyTestItem,
  INITIAL_MICROBIOLOGY_TEST_ITEMS,
} from '../data/microbiologyTestManagementData';
import { UserProfile } from '../types/navigation';
import {
  Search,
  RefreshCw,
  FileText,
  AlertTriangle,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  Clock,
  X,
  Microscope,
  Database,
  ChevronLeft,
  ChevronRight,
  Eye,
  DollarSign,
  ShieldAlert,
  Archive,
  Layers,
  Activity,
  FlaskConical,
} from './MenuIcon';

interface MicrobiologySpecimenTestViewProps {
  user?: UserProfile;
  triggerAction: (msg: string) => void;
}

const quickConclusions = [
  '涂片革兰氏染色未见细菌。',
  '未查到抗酸杆菌 (300个油镜视野)。',
  '未查到淋病奈瑟菌。',
  '查见革兰氏阳性球菌，呈成双或短链状排列。',
  '查见革兰氏阴性杆菌，中性粒细胞满视野。',
  '查见假菌丝及出芽孢子，提示真菌感染。',
];

const stainMethods = ['革兰染色', '抗酸染色', '荧光染色', '墨汁染色'] as const;

export const MicrobiologySpecimenTestView: React.FC<MicrobiologySpecimenTestViewProps> = ({
  user,
  triggerAction,
}) => {
  // Master Dataset State
  const [items, setItems] = useState<MicrobiologyTestItem[]>(INITIAL_MICROBIOLOGY_TEST_ITEMS);

  // Filtering & Pagination State
  const [statusFilter, setStatusFilter] = useState<string>('全部');
  const [startDate, setStartDate] = useState<string>('2026-10-12');
  const [endDate, setEndDate] = useState<string>('2026-10-15');
  const [testApplyFilter, setTestApplyFilter] = useState<string>('全部');
  const [searchBarcode, setSearchBarcode] = useState<string>('');

  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10; // Strictly 10 items per page

  // Selected Item & Detail Modal Visibility State
  const [selectedItem, setSelectedItem] = useState<MicrobiologyTestItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [detailModalTab, setDetailModalTab] = useState<
    '涂片镜检' | '仪器培养' | '普通培养' | '鉴定药敏' | '检验报告' | '检验日志'
  >('涂片镜检');

  // Interactive editing state inside detail modal
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);
  const [microscopyConclusionText, setMicroscopyConclusionText] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Auxiliary Modals State
  const [showClinicalInfoModal, setShowClinicalInfoModal] = useState<boolean>(false);
  const [showFeeModal, setShowFeeModal] = useState<boolean>(false);
  const [showUnqualifiedModal, setShowUnqualifiedModal] = useState<boolean>(false);
  const [showSaveStrainModal, setShowSaveStrainModal] = useState<boolean>(false);
  const [showImagePreviewUrl, setShowImagePreviewUrl] = useState<string | null>(null);

  // Unqualified Form State
  const [unqualifiedReason, setUnqualifiedReason] = useState<string>('标本溶血/凝块');
  const [unqualifiedRemark, setUnqualifiedRemark] = useState<string>('');

  // Save Strain Form State
  const [strainNameInput, setStrainNameInput] = useState<string>('金黄色葡萄球菌 (MRSA)');
  const [strainCodeInput, setStrainCodeInput] = useState<string>('STR-20261015-001');

  // Toast Helper
  const showLocalNotice = (msg: string) => {
    setToastMessage(msg);
    triggerAction(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filter Logic
  const filteredItems = items.filter((item) => {
    if (statusFilter !== '全部' && item.testStatus !== statusFilter) return false;
    if (testApplyFilter !== '全部' && !item.testItem.includes(testApplyFilter)) return false;
    if (searchBarcode.trim()) {
      const q = searchBarcode.trim().toLowerCase();
      const matchBarcode = item.barcode.toLowerCase().includes(q);
      const matchSample = item.sampleNo.toLowerCase().includes(q);
      const matchName = item.patientName.toLowerCase().includes(q);
      const matchPatientId = item.patientId.toLowerCase().includes(q);
      if (!matchBarcode && !matchSample && !matchName && !matchPatientId) return false;
    }
    return true;
  });

  // Pagination calculation
  const totalPages = Math.ceil(filteredItems.length / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const currentDisplayedItems = filteredItems.slice(startIndex, startIndex + pageSize);

  // Open Detail Modal Popup ONLY via operation column button
  const handleOpenDetailModal = (item: MicrobiologyTestItem) => {
    setSelectedItem(item);
    setMicroscopyConclusionText(item.smearConclusion);
    setDetailModalTab('涂片镜检');
    setIsDetailModalOpen(true);
  };

  // Save Smear Conclusion
  const handleSaveSmearConclusion = () => {
    if (!selectedItem) return;
    setItems((prev) =>
      prev.map((i) =>
        i.id === selectedItem.id ? { ...i, smearConclusion: microscopyConclusionText } : i
      )
    );
    setSelectedItem((prev) =>
      prev ? { ...prev, smearConclusion: microscopyConclusionText } : null
    );
    showLocalNotice(`样本 [${selectedItem.sampleNo}] 镜检结论保存成功！`);
  };

  // Append quick template to conclusion text
  const handleAppendConclusionTemplate = (text: string) => {
    setMicroscopyConclusionText((prev) => (prev ? `${prev}；${text}` : text));
  };

  // Handle Unqualified Specimen Registration Submit
  const handleUnqualifiedSubmit = () => {
    if (!selectedItem) {
      showLocalNotice('请先选择需要登记不合格的样本');
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.id === selectedItem.id
          ? {
              ...i,
              isQualified: '不合格',
              testStatus: '已完成',
              extraInfo: `不合格退单: ${unqualifiedReason}。${unqualifiedRemark}`,
            }
          : i
      )
    );
    setShowUnqualifiedModal(false);
    showLocalNotice(`样本 [${selectedItem.sampleNo}] 不合格标记与退单登记完成！`);
  };

  // Handle Save Strain Submit
  const handleSaveStrainSubmit = () => {
    if (!selectedItem) return;
    setShowSaveStrainModal(false);
    showLocalNotice(
      `临床菌株 [${strainNameInput}] (编码: ${strainCodeInput}) 已归档保存至微生物菌株库！`
    );
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-100 overflow-hidden text-xs">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 right-8 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2 border border-slate-700 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Top Filter & Toolbar Header Strip */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 shrink-0 shadow-2xs space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Action Buttons Cluster */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                if (!selectedItem) {
                  showLocalNotice('请先在下方表格中选择一条检验样本记录');
                  return;
                }
                setShowClinicalInfoModal(true);
              }}
              className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-md shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>临床信息</span>
            </button>

            <button
              onClick={() => {
                if (!selectedItem) {
                  showLocalNotice('请先选择样本');
                  return;
                }
                setShowFeeModal(true);
              }}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-md shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>补费</span>
            </button>

            <button
              onClick={() => {
                if (!selectedItem) {
                  showLocalNotice('请先选择需要登记不合格的样本');
                  return;
                }
                setShowUnqualifiedModal(true);
              }}
              className="px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 font-medium rounded-md flex items-center gap-1.5 transition-colors"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
              <span>不合格登记</span>
            </button>

            <button
              onClick={() => {
                if (!selectedItem) {
                  showLocalNotice('请先选择待归档菌株的标本记录');
                  return;
                }
                setShowSaveStrainModal(true);
              }}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <Archive className="w-3.5 h-3.5" />
              <span>保存菌株</span>
            </button>
          </div>

          {/* Quick Info Indicator */}
          <div className="flex items-center gap-3 text-slate-500 font-mono">
            <span className="flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded text-[11px] font-sans">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              危急值提醒: 1条急查未处理
            </span>
            <span>
              已选样本:{' '}
              {selectedItem ? `${selectedItem.sampleNo} (${selectedItem.patientName})` : '未选择'}
            </span>
          </div>
        </div>

        {/* Filter Toolbar Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-3">
            {/* Status Dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-600 font-medium whitespace-nowrap">检验状态:</span>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-slate-50 border border-slate-300 rounded px-2.5 py-1 text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-sky-500"
              >
                <option value="全部">全部状态</option>
                <option value="检验中">检验中</option>
                <option value="已完成">已完成</option>
                <option value="待接种">待接种</option>
              </select>
            </div>

            {/* Date Range */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-600 font-medium whitespace-nowrap">核收时间:</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded px-2 py-1 text-slate-800 focus:outline-hidden"
              />
              <span className="text-slate-400">~</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-slate-50 border border-slate-300 rounded px-2 py-1 text-slate-800 focus:outline-hidden"
              />
            </div>

            {/* Test Apply Dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-600 font-medium whitespace-nowrap">检验申请:</span>
              <select
                value={testApplyFilter}
                onChange={(e) => {
                  setTestApplyFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-slate-50 border border-slate-300 rounded px-2.5 py-1 text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-sky-500"
              >
                <option value="全部">全部项目</option>
                <option value="培养">细菌/真菌培养类</option>
                <option value="痰">痰液检体类</option>
                <option value="血">全血/血培养类</option>
                <option value="尿">尿液检体类</option>
              </select>
            </div>

            {/* Search Input */}
            <div className="flex items-center gap-1 bg-slate-50 border border-slate-300 rounded px-2 py-1 min-w-[200px]">
              <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="采集条码/样本号/姓名/病历号..."
                value={searchBarcode}
                onChange={(e) => {
                  setSearchBarcode(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-transparent border-none outline-hidden text-xs w-full text-slate-800 placeholder-slate-400"
              />
            </div>
          </div>

          {/* Refresh / Reset Button */}
          <button
            onClick={() => {
              setStatusFilter('全部');
              setTestApplyFilter('全部');
              setSearchBarcode('');
              setCurrentPage(1);
              showLocalNotice('刷盘重置，队列数据已更新');
            }}
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors"
            title="刷新数据"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Table Content View (Occupies Full Screen Width) */}
      <div className="flex-1 min-h-0 overflow-auto p-4">
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden flex flex-col h-full">
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse min-w-[1100px]">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 sticky top-0 z-10">
                <tr>
                  <th className="px-3.5 py-2.5">检验状态</th>
                  <th className="px-3.5 py-2.5">是否合格</th>
                  <th className="px-3.5 py-2.5">样本号</th>
                  <th className="px-3.5 py-2.5">病人标识</th>
                  <th className="px-3.5 py-2.5">姓名</th>
                  <th className="px-3.5 py-2.5">性别/年龄</th>
                  <th className="px-3.5 py-2.5">检验项目</th>
                  <th className="px-3.5 py-2.5">标本类型</th>
                  <th className="px-3.5 py-2.5">送检科室</th>
                  <th className="px-3.5 py-2.5">采集条码</th>
                  <th className="px-3.5 py-2.5">核收时间</th>
                  <th className="px-3.5 py-2.5 text-center">操作详情</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {currentDisplayedItems.length === 0 ? (
                  <tr>
                    <td colSpan={12} className="text-center py-12 text-slate-400">
                      暂无匹配的微生物标本检验记录
                    </td>
                  </tr>
                ) : (
                  currentDisplayedItems.map((item) => {
                    const isSelected = selectedItem?.id === item.id;
                    return (
                      <tr
                        key={item.id}
                        onClick={() => setSelectedItem(item)}
                        className={`hover:bg-sky-50/60 transition-colors cursor-pointer ${
                          isSelected ? 'bg-sky-50/90 font-medium' : ''
                        }`}
                      >
                        {/* Status */}
                        <td className="px-3.5 py-2.5 whitespace-nowrap">
                          {item.testStatus === '已完成' ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] bg-emerald-50 text-emerald-700 font-medium border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              已完成
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] bg-sky-50 text-sky-700 font-medium border border-sky-200">
                              <Clock className="w-3 h-3 text-sky-600 animate-spin" />
                              {item.testStatus}
                            </span>
                          )}
                        </td>

                        {/* Qualified */}
                        <td className="px-3.5 py-2.5 whitespace-nowrap">
                          {item.isQualified === '合格' ? (
                            <span className="text-emerald-600 font-medium">合格</span>
                          ) : (
                            <span className="text-rose-600 font-medium">不合格</span>
                          )}
                        </td>

                        {/* Sample Number */}
                        <td className="px-3.5 py-2.5 font-mono font-bold text-slate-800 whitespace-nowrap">
                          {item.sampleNo}
                        </td>

                        {/* Patient ID */}
                        <td className="px-3.5 py-2.5 font-mono text-slate-600 whitespace-nowrap">
                          {item.patientId}
                        </td>

                        {/* Patient Name */}
                        <td className="px-3.5 py-2.5 font-semibold text-slate-900 whitespace-nowrap">
                          {item.patientName}
                          {item.isUrgent && (
                            <span className="ml-1.5 px-1 py-0.2 rounded text-[10px] bg-rose-600 text-white font-bold">
                              急
                            </span>
                          )}
                        </td>

                        {/* Gender / Age */}
                        <td className="px-3.5 py-2.5 text-slate-600 whitespace-nowrap">
                          {item.gender} · {item.age}
                        </td>

                        {/* Test Item */}
                        <td className="px-3.5 py-2.5 font-medium text-slate-800 whitespace-nowrap">
                          {item.testItem}
                        </td>

                        {/* Specimen Type */}
                        <td className="px-3.5 py-2.5 text-slate-600 whitespace-nowrap">
                          {item.sampleType}
                        </td>

                        {/* Department */}
                        <td className="px-3.5 py-2.5 text-slate-600 whitespace-nowrap">
                          {item.department}
                        </td>

                        {/* Collection Barcode */}
                        <td className="px-3.5 py-2.5 font-mono text-slate-500 whitespace-nowrap">
                          {item.barcode}
                        </td>

                        {/* Receive Time */}
                        <td className="px-3.5 py-2.5 font-mono text-slate-500 whitespace-nowrap">
                          {item.checkInTime}
                        </td>

                        {/* Actions Button -> Open Modal ONLY on click */}
                        <td className="px-3.5 py-2.5 text-center whitespace-nowrap">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenDetailModal(item);
                            }}
                            className="px-2.5 py-1 bg-sky-600 hover:bg-sky-700 text-white rounded font-medium shadow-2xs flex items-center gap-1 mx-auto transition-colors"
                          >
                            <Eye className="w-3 h-3" />
                            <span>弹窗详情</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Fixed Footer Pagination Bar (10 items per page) */}
          <div className="bg-slate-50 px-4 py-2.5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-slate-600 text-xs shrink-0">
            <div className="flex items-center gap-2">
              <span>
                共 <strong className="text-slate-900 font-mono">{filteredItems.length}</strong> 条标本检验记录
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

      {/* ========================================================================= */}
      {/* DETAIL MODAL POPUP (点击操作列按钮展示弹窗) */}
      {/* ========================================================================= */}
      {isDetailModalOpen && selectedItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden">
            {/* Modal Top Header Bar */}
            <div className="bg-slate-900 text-white px-5 py-3 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center shrink-0">
                  <Microscope className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <span>微生物检验工作站 · 标本详情与工作记录</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-sky-500/30 text-sky-200 font-mono">
                      样本号: {selectedItem.sampleNo}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Sub Header Banner: Patient & Specimen Info */}
            <div className="bg-slate-50 border-b border-slate-200 p-4 shrink-0 text-slate-700">
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                <div>
                  <span className="text-slate-400 block text-[11px]">患者来源 / 姓名</span>
                  <span className="font-bold text-slate-900 text-sm">
                    [{selectedItem.patientSource}] {selectedItem.patientName}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">性别 / 年龄</span>
                  <span className="font-semibold text-slate-800">
                    {selectedItem.gender} · {selectedItem.age}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">联系电话</span>
                  <span className="font-mono text-slate-800">{selectedItem.phone}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">科室 / 床号</span>
                  <span className="font-medium text-slate-800">
                    {selectedItem.department} / {selectedItem.bedNo}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">标本类型 / 申请</span>
                  <span className="font-medium text-slate-800">
                    {selectedItem.sampleType} ({selectedItem.testItem})
                    {selectedItem.isUrgent && (
                      <span className="ml-1 text-rose-600 font-bold">🚨急</span>
                    )}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">临床诊断</span>
                  <span className="font-medium text-slate-900 truncate block">
                    {selectedItem.clinicalDiagnosis}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Inner Multi-Tab Navigation */}
            <div className="bg-white border-b border-slate-200 px-5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-1 overflow-x-auto py-2">
                {[
                  { id: '涂片镜检', label: '涂片镜检', icon: Microscope },
                  { id: '仪器培养', label: '仪器培养', icon: Activity },
                  { id: '普通培养', label: '普通培养', icon: FlaskConical },
                  { id: '鉴定药敏', label: '鉴定药敏', icon: Database },
                  { id: '检验报告', label: '检验报告预览', icon: FileText },
                  { id: '检验日志', label: '检验日志', icon: Clock },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = detailModalTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setDetailModalTab(tab.id as any)}
                      className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all whitespace-nowrap ${
                        isActive
                          ? 'bg-sky-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Action Buttons in Modal Header */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    showLocalNotice(`样本 [${selectedItem.sampleNo}] 初步镜检报告已口头向临床通报`)
                  }
                  className="px-2.5 py-1 bg-sky-50 text-sky-700 border border-sky-200 rounded font-medium hover:bg-sky-100 transition-colors"
                >
                  初步镜检报告
                </button>
                <button
                  onClick={() =>
                    showLocalNotice(
                      `样本 [${selectedItem.sampleNo}] 镜检报告正式生成并加盖电子签章`
                    )
                  }
                  className="px-2.5 py-1 bg-emerald-600 text-white rounded font-medium hover:bg-emerald-700 shadow-2xs transition-colors"
                >
                  镜检报告
                </button>
              </div>
            </div>

            {/* Modal Scrollable Workspace Body */}
            <div className="flex-1 min-h-0 overflow-y-auto p-5 bg-slate-50/50">
              {/* TAB 1: 涂片镜检 (Smear Microscopy & Image Capture) */}
              {detailModalTab === '涂片镜检' && (
                <div className="space-y-5">
                  {/* Slide Prep Table Card */}
                  <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-2xs">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                        <Layers className="w-4 h-4 text-sky-600" />
                        <span>制片信息列表</span>
                      </h4>
                      <button
                        onClick={() => {
                          const newSlide = {
                            id: `sl-${Date.now()}`,
                            slideCode: `${selectedItem.sampleNo}_0${selectedItem.smearSlides.length + 1}`,
                            stainMethod: '革兰染色' as const,
                            prepTime: '2026-10-30 11:30:00',
                            prepPerson: user?.name || '刘浩然检验师',
                            description: '待油镜观察描述...',
                          };
                          setSelectedItem((prev) =>
                            prev
                              ? { ...prev, smearSlides: [...prev.smearSlides, newSlide] }
                              : null
                          );
                          showLocalNotice('已新增制作一张油镜玻片');
                        }}
                        className="text-xs text-sky-600 hover:text-sky-800 font-medium flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>新增玻片</span>
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                          <tr>
                            <th className="px-3 py-2">玻片编码</th>
                            <th className="px-3 py-2">染色方法</th>
                            <th className="px-3 py-2">制片时间</th>
                            <th className="px-3 py-2">制片人</th>
                            <th className="px-3 py-2">观察描述</th>
                            <th className="px-3 py-2 text-center">操作</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {selectedItem.smearSlides.map((slide, idx) => (
                            <tr
                              key={slide.id || idx}
                              onClick={() => setActiveSlideIndex(idx)}
                              className={`hover:bg-slate-50 cursor-pointer ${
                                activeSlideIndex === idx ? 'bg-sky-50/70 font-medium' : ''
                              }`}
                            >
                              <td className="px-3 py-2 font-mono text-slate-800 font-bold">
                                {slide.slideCode}
                              </td>
                              <td className="px-3 py-2">
                                <select
                                  value={slide.stainMethod}
                                  onChange={(e) => {
                                    const updatedStain = e.target.value as any;
                                    setSelectedItem((prev) => {
                                      if (!prev) return null;
                                      const newPreps = [...prev.smearSlides];
                                      newPreps[idx].stainMethod = updatedStain;
                                      return { ...prev, smearSlides: newPreps };
                                    });
                                  }}
                                  className="bg-slate-50 border border-slate-300 rounded px-1.5 py-0.5 text-slate-800"
                                >
                                  {stainMethods.map((m) => (
                                    <option key={m} value={m}>
                                      {m}
                                    </option>
                                  ))}
                                </select>
                              </td>
                              <td className="px-3 py-2 font-mono text-slate-500">{slide.prepTime}</td>
                              <td className="px-3 py-2 text-slate-700">{slide.prepPerson}</td>
                              <td className="px-3 py-2 text-slate-600">{slide.description}</td>
                              <td className="px-3 py-2 text-center">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedItem((prev) => {
                                      if (!prev) return null;
                                      const newPreps = prev.smearSlides.filter((_, i) => i !== idx);
                                      return { ...prev, smearSlides: newPreps };
                                    });
                                    showLocalNotice('玻片已移除');
                                  }}
                                  className="text-rose-600 hover:text-rose-800"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Smear Conclusion & Quick Templates Row */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Conclusion Textarea */}
                    <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200 p-4 shadow-2xs flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="font-bold text-slate-800 text-xs">镜检结论录入</label>
                          <span className="text-slate-400 text-[11px]">可点击右侧快捷模板词库</span>
                        </div>
                        <textarea
                          rows={4}
                          value={microscopyConclusionText}
                          onChange={(e) => setMicroscopyConclusionText(e.target.value)}
                          placeholder="请输入油镜显微镜观察结论描述..."
                          className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-sky-500 leading-relaxed resize-y"
                        />
                      </div>
                      <div className="mt-3 flex justify-end">
                        <button
                          onClick={handleSaveSmearConclusion}
                          className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>保存结论</span>
                        </button>
                      </div>
                    </div>

                    {/* Quick Templates List */}
                    <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-2xs flex flex-col">
                      <h4 className="font-bold text-slate-800 text-xs mb-2">结论模板词库</h4>
                      <div className="space-y-1.5 overflow-y-auto max-h-48 pr-1">
                        {quickConclusions.map((qc, i) => (
                          <button
                            key={i}
                            onClick={() => handleAppendConclusionTemplate(qc)}
                            className="w-full text-left p-1.5 bg-slate-50 hover:bg-sky-50 border border-slate-200 hover:border-sky-300 rounded text-slate-700 text-xs transition-colors font-sans truncate"
                            title={qc}
                          >
                            + {qc}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Image Capture Album (显微油镜采图) */}
                  <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-2xs">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                        <Microscope className="w-4 h-4 text-sky-600" />
                        <span>采图缩略相册 (1000X 油镜拍摄)</span>
                      </h4>
                      <button
                        onClick={() => showLocalNotice('数码显微镜摄像头已采集一帧高精画质图像')}
                        className="text-xs text-sky-600 hover:text-sky-800 font-medium flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>抓拍采集新照片</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {selectedItem.microscopeImages.map((imgObj, i) => (
                        <div
                          key={imgObj.id || i}
                          className="group relative aspect-4/3 bg-slate-900 rounded-lg overflow-hidden border border-slate-200 shadow-2xs"
                        >
                          <img
                            src={imgObj.url}
                            alt={imgObj.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                          <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <button
                              onClick={() => setShowImagePreviewUrl(imgObj.url)}
                              className="p-1.5 bg-white text-slate-800 rounded-full shadow hover:bg-slate-100"
                              title="放大预览"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedItem((prev) =>
                                  prev
                                    ? {
                                        ...prev,
                                        microscopeImages: prev.microscopeImages.filter(
                                          (_, idx) => idx !== i
                                        ),
                                      }
                                    : null
                                );
                                showLocalNotice('图片已移除');
                              }}
                              className="p-1.5 bg-rose-600 text-white rounded-full shadow hover:bg-rose-700"
                              title="删除图片"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <span className="absolute bottom-1 left-1 bg-slate-900/80 text-white text-[10px] px-1.5 py-0.2 rounded font-mono truncate max-w-[90%]">
                            {imgObj.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: 仪器培养 (Automated Incubator Monitoring) */}
              {detailModalTab === '仪器培养' && (
                <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h4 className="font-bold text-slate-800 text-xs">
                      全自动血培养仪 (BD BACTEC / BACT/ALERT 3D) 监测日志
                    </h4>
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-medium">
                      仪器状态: 联机实时传输中
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                      <span className="text-slate-400 block text-[11px]">需氧培养瓶 barcode</span>
                      <span className="font-mono font-bold text-slate-800">
                        {selectedItem.barcode}_A
                      </span>
                      <span className="text-emerald-600 font-medium block mt-1">阳性 (报警时间: 14.5小时)</span>
                    </div>

                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                      <span className="text-slate-400 block text-[11px]">厌氧培养瓶 barcode</span>
                      <span className="font-mono font-bold text-slate-800">
                        {selectedItem.barcode}_B
                      </span>
                      <span className="text-slate-500 font-medium block mt-1">阴性 (培养中 24小时)</span>
                    </div>

                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                      <span className="text-slate-400 block text-[11px]">仪器插槽号</span>
                      <span className="font-mono font-bold text-slate-800">C3-柜 18号槽位</span>
                    </div>

                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                      <span className="text-slate-400 block text-[11px]">孵育温度</span>
                      <span className="font-mono font-bold text-slate-800">35.5 °C (恒温)</span>
                    </div>
                  </div>

                  {/* Growth Curve Graphic Placeholder */}
                  <div className="p-4 bg-slate-900 rounded-lg border border-slate-800 text-white font-mono text-xs">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sky-400 font-bold">CO2 气敏荧光生长极值曲线图</span>
                      <span className="text-slate-400 text-[10px]">采样点: 120 / Rate Delta: 8.4</span>
                    </div>
                    <div className="h-28 flex items-end justify-between gap-1 pt-4 px-2 border-b border-slate-700">
                      {[10, 12, 11, 14, 18, 22, 35, 68, 92, 100, 98, 95, 93].map((val, idx) => (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                          <div
                            className={`w-full rounded-t ${
                              val > 50 ? 'bg-rose-500' : 'bg-sky-500'
                            }`}
                            style={{ height: `${val}%` }}
                          />
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 text-[10px] text-slate-400 flex justify-between">
                      <span>0h (上机)</span>
                      <span>6h</span>
                      <span>12h (CO2剧增-报阳)</span>
                      <span>24h</span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: 普通培养 (Agar Plate Colony Culture) */}
              {detailModalTab === '普通培养' && (
                <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h4 className="font-bold text-slate-800 text-xs">
                      琼脂平板菌落生长特征与接种记录
                    </h4>
                    <button
                      onClick={() => showLocalNotice('已添加一组沙保罗琼脂真菌培养平板')}
                      className="px-2.5 py-1 bg-sky-600 text-white rounded font-medium text-xs hover:bg-sky-700"
                    >
                      + 增加接种平板
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
                      <div className="flex items-center justify-between font-bold text-slate-800 mb-1">
                        <span>血琼脂平板 (Blood Agar)</span>
                        <span className="text-emerald-600 font-normal text-[11px]">全溶血 (β溶血)</span>
                      </div>
                      <p className="text-slate-600 text-xs leading-relaxed">
                        菌落呈圆形凸起、表面光滑湿润，周围有清晰透明的β溶血环。
                      </p>
                    </div>

                    <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
                      <div className="flex items-center justify-between font-bold text-slate-800 mb-1">
                        <span>麦康凯平板 (MacConkey)</span>
                        <span className="text-slate-500 font-normal text-[11px]">无菌生长 (不发酵乳糖)</span>
                      </div>
                      <p className="text-slate-600 text-xs leading-relaxed">
                        无革兰阴性杆菌菌落生性。
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: 鉴定药敏 (MALDI-TOF ID & AST Table) */}
              {detailModalTab === '鉴定药敏' && (
                <div className="space-y-4">
                  {/* Strain ID Box */}
                  <div className="bg-gradient-to-r from-slate-900 to-sky-950 text-white p-4 rounded-lg shadow-2xs flex items-center justify-between">
                    <div>
                      <span className="text-sky-300 text-[11px] font-mono block">
                        MALDI-TOF 质谱鉴定得分: 2.34 (高度可信度)
                      </span>
                      <h3 className="text-base font-bold text-white mt-0.5">
                        {selectedItem.strainResult || '未检出目标致病菌'}
                      </h3>
                      <span className="text-slate-300 text-xs mt-1 block">
                        多重耐药预警:{' '}
                        {selectedItem.strainResult.includes('MRSA') || selectedItem.strainResult.includes('ESBL')
                          ? `🚨 ${selectedItem.strainResult}`
                          : '无'}
                      </span>
                    </div>

                    <button
                      onClick={() => showLocalNotice('质谱峰图数据与CLSI 2026标准比对一致')}
                      className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded font-medium text-xs"
                    >
                      查看质谱图谱
                    </button>
                  </div>

                  {/* AST Table */}
                  <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-2xs">
                    <h4 className="font-bold text-slate-800 text-xs mb-3">
                      定量药敏试验 (MIC) 敏耐度列表 (折点标准: CLSI M100 Ed34)
                    </h4>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                          <tr>
                            <th className="px-3 py-2">抗生素名称</th>
                            <th className="px-3 py-2 font-mono">MIC 测定值</th>
                            <th className="px-3 py-2 text-center">药敏结果</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-sans">
                          {selectedItem.astResults.length === 0 ? (
                            <tr>
                              <td colSpan={3} className="text-center py-6 text-slate-400">
                                暂无药敏试验数据
                              </td>
                            </tr>
                          ) : (
                            selectedItem.astResults.map((ast, i) => (
                              <tr key={i} className="hover:bg-slate-50">
                                <td className="px-3 py-2 font-medium text-slate-800">
                                  {ast.antibiotic}
                                </td>
                                <td className="px-3 py-2 font-mono font-bold text-slate-900">
                                  {ast.micValue}
                                </td>
                                <td className="px-3 py-2 text-center">
                                  {ast.susceptibility === 'S' ? (
                                    <span className="px-2 py-0.5 rounded-full text-[11px] bg-emerald-100 text-emerald-800 font-bold">
                                      S (敏感)
                                    </span>
                                  ) : ast.susceptibility === 'R' ? (
                                    <span className="px-2 py-0.5 rounded-full text-[11px] bg-rose-100 text-rose-800 font-bold">
                                      R (耐药)
                                    </span>
                                  ) : (
                                    <span className="px-2 py-0.5 rounded-full text-[11px] bg-amber-100 text-amber-800 font-bold">
                                      I (中介)
                                    </span>
                                  )}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: 检验报告预览 (Microbiology Report Preview) */}
              {detailModalTab === '检验报告' && (
                <div className="bg-white p-6 rounded-lg border border-slate-300 shadow-md max-w-4xl mx-auto space-y-4 font-serif text-slate-900">
                  {/* Report Printed Title Header */}
                  <div className="text-center border-b-2 border-slate-900 pb-3">
                    <h2 className="text-lg font-bold tracking-wider">
                      大连医科大学附属第二医院 检验报告单
                    </h2>
                    <p className="text-xs font-sans text-slate-600 mt-0.5">
                      DEPARTMENT OF CLINICAL MICROBIOLOGY REPORT
                    </p>
                  </div>

                  {/* Patient Info Row */}
                  <div className="grid grid-cols-4 gap-2 text-xs border-b border-slate-300 pb-2 font-sans">
                    <div>姓名: <strong>{selectedItem.patientName}</strong></div>
                    <div>性别/年龄: <strong>{selectedItem.gender} / {selectedItem.age}</strong></div>
                    <div>科室: <strong>{selectedItem.department}</strong></div>
                    <div>病历号: <strong>{selectedItem.patientId}</strong></div>
                    <div>样本号: <strong>{selectedItem.sampleNo}</strong></div>
                    <div>标本类型: <strong>{selectedItem.sampleType}</strong></div>
                    <div>检验项目: <strong>{selectedItem.testItem}</strong></div>
                    <div>送检日期: <strong>2026-10-15</strong></div>
                  </div>

                  {/* Report Content */}
                  <div className="py-2 space-y-3 font-sans text-xs">
                    <div>
                      <span className="font-bold text-slate-900 block">一、涂片镜检结果:</span>
                      <p className="p-2 bg-slate-50 border border-slate-200 rounded mt-1 text-slate-800">
                        {selectedItem.smearConclusion || '革兰染色：查见革兰阳性球菌，呈成双或短链状排列。未查见霉菌孢子。'}
                      </p>
                    </div>

                    <div>
                      <span className="font-bold text-slate-900 block">二、分离培养与鉴定结论:</span>
                      <p className="p-2 bg-slate-50 border border-slate-200 rounded mt-1 text-slate-800 font-bold text-sky-900">
                        分离致病菌：{selectedItem.strainResult || '金黄色葡萄球菌 (MRSA)'}
                      </p>
                    </div>

                    <div>
                      <span className="font-bold text-slate-900 block">三、常用抗生素定量药敏试验 (MIC):</span>
                      <div className="grid grid-cols-2 gap-2 mt-1">
                        {selectedItem.astResults.map((ast, i) => (
                          <div
                            key={i}
                            className="flex justify-between p-1.5 bg-slate-50 border border-slate-200 text-slate-800"
                          >
                            <span>{ast.antibiotic}</span>
                            <span className="font-mono font-bold">
                              {ast.micValue} ({ast.susceptibility})
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Footer Signatures */}
                  <div className="pt-4 border-t border-slate-300 flex justify-between items-center text-xs font-sans text-slate-600">
                    <div>检验者: <strong className="text-slate-900">{user?.name || '李晓红主管检验师'}</strong></div>
                    <div>审核者: <strong className="text-slate-900">郭彩霞主任医师</strong></div>
                    <div>报告时间: <strong>2026-10-15 14:20:10</strong></div>
                  </div>
                </div>
              )}

              {/* TAB 6: 检验日志 (Audit Trail) */}
              {detailModalTab === '检验日志' && (
                <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-2xs">
                  <h4 className="font-bold text-slate-800 text-xs mb-3">
                    微生物检验全流程溯源日志
                  </h4>
                  <div className="relative border-l-2 border-sky-200 ml-3 space-y-4 pl-4 font-sans text-xs">
                    <div className="relative">
                      <div className="absolute -left-[21px] top-0.5 w-2.5 h-2.5 rounded-full bg-sky-600 ring-4 ring-sky-100" />
                      <div className="flex items-center justify-between text-slate-500 font-mono text-[11px]">
                        <span>{selectedItem.checkInTime}</span>
                        <span className="font-sans font-medium text-slate-700">
                          {user?.name || '李晓红主管检验师'}
                        </span>
                      </div>
                      <div className="font-semibold text-slate-900 mt-0.5">标本签收核收</div>
                      <p className="text-slate-600 mt-0.5">
                        扫码核收样本条码 [{selectedItem.barcode}]，外观状态正常，已分配样本编号 [{selectedItem.sampleNo}]。
                      </p>
                    </div>

                    <div className="relative">
                      <div className="absolute -left-[21px] top-0.5 w-2.5 h-2.5 rounded-full bg-emerald-600 ring-4 ring-emerald-100" />
                      <div className="flex items-center justify-between text-slate-500 font-mono text-[11px]">
                        <span>2026-10-30 09:30:15</span>
                        <span className="font-sans font-medium text-slate-700">刘浩然检验师</span>
                      </div>
                      <div className="font-semibold text-slate-900 mt-0.5">涂片制片与显微采图</div>
                      <p className="text-slate-600 mt-0.5">
                        进行革兰染色涂片与油镜1000x镜头抓拍，录入初步镜检结论。
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer Controls */}
            <div className="bg-slate-100 border-t border-slate-200 px-5 py-3 flex items-center justify-between shrink-0 text-xs">
              <span className="text-slate-500 font-mono">
                数据安全防护 · 已通过ISO 15189审核
              </span>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded font-medium transition-colors"
              >
                关闭弹窗
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* AUXILIARY MODALS */}
      {/* ========================================================================= */}

      {/* 1. Clinical Info Modal */}
      {showClinicalInfoModal && selectedItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-bold text-slate-900 text-sm">
                患者临床病史与用药信息 [{selectedItem.patientName}]
              </h3>
              <button onClick={() => setShowClinicalInfoModal(false)}>
                <X className="w-4 h-4 text-slate-400 hover:text-slate-700" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block">主诉与临床诊断:</span>
                <p className="text-slate-800 p-2 bg-slate-50 rounded border border-slate-200 mt-0.5">
                  {selectedItem.clinicalDiagnosis}。{selectedItem.extraInfo}
                </p>
              </div>

              <div>
                <span className="text-slate-400 block">近期抗生素使用史:</span>
                <p className="text-slate-800 p-2 bg-slate-50 rounded border border-slate-200 mt-0.5">
                  阿莫西林克拉维酸钾 (口服2天)，头孢曲松钠 (静滴1天)。
                </p>
              </div>

              <div>
                <span className="text-slate-400 block">白细胞与炎症指标:</span>
                <div className="grid grid-cols-3 gap-2 mt-0.5 font-mono">
                  <div className="p-2 bg-slate-50 rounded border border-slate-200">
                    <span className="text-[10px] text-slate-400 block font-sans">WBC</span>
                    <strong>14.2 ×10⁹/L</strong>
                  </div>
                  <div className="p-2 bg-slate-50 rounded border border-slate-200">
                    <span className="text-[10px] text-slate-400 block font-sans">CRP</span>
                    <strong>86.4 mg/L</strong>
                  </div>
                  <div className="p-2 bg-slate-50 rounded border border-slate-200">
                    <span className="text-[10px] text-slate-400 block font-sans">PCT</span>
                    <strong>2.45 ng/mL</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowClinicalInfoModal(false)}
                className="px-4 py-1.5 bg-slate-800 text-white rounded font-medium text-xs"
              >
                确定关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Fee Modal */}
      {showFeeModal && selectedItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-bold text-slate-900 text-sm">
                补增收费项目 [{selectedItem.sampleNo}]
              </h3>
              <button onClick={() => setShowFeeModal(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <label className="text-slate-700 font-medium block">选择追加物价项目:</label>
              <select className="w-full p-2 bg-slate-50 border border-slate-300 rounded text-slate-800">
                <option>全自动质谱菌株鉴定费 (¥120.00)</option>
                <option>真菌定量药敏试验费 (¥180.00)</option>
                <option>厌氧菌培养与药物敏感 (¥150.00)</option>
                <option>特殊染色(抗酸/荧光染色) (¥40.00)</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowFeeModal(false)}
                className="px-3 py-1.5 border border-slate-300 rounded text-slate-700"
              >
                取消
              </button>
              <button
                onClick={() => {
                  setShowFeeModal(false);
                  showLocalNotice('补费指令已成功发送至HIS收费系统！');
                }}
                className="px-4 py-1.5 bg-emerald-600 text-white rounded font-semibold"
              >
                确认补费
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Unqualified Specimen Modal */}
      {showUnqualifiedModal && selectedItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-bold text-rose-900 text-sm flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>不合格标本退单登记</span>
              </h3>
              <button onClick={() => setShowUnqualifiedModal(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-700 font-medium block mb-1">退单原因类型:</label>
                <select
                  value={unqualifiedReason}
                  onChange={(e) => setUnqualifiedReason(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded text-slate-800"
                >
                  <option value="标本溶血/凝块">标本溶血/凝块</option>
                  <option value="标本量不足">标本量不足无法检验</option>
                  <option value="试管破损渗漏">试管破损渗漏</option>
                  <option value="采集容器错误">采集容器类型错误</option>
                  <option value="超时送达">超时送达(大于4小时)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-700 font-medium block mb-1">退单详细说明:</label>
                <textarea
                  rows={3}
                  value={unqualifiedRemark}
                  onChange={(e) => setUnqualifiedRemark(e.target.value)}
                  placeholder="请输入通知临床科室重抽的说明..."
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded text-slate-800"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowUnqualifiedModal(false)}
                className="px-3 py-1.5 border border-slate-300 rounded text-slate-700"
              >
                取消
              </button>
              <button
                onClick={handleUnqualifiedSubmit}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded font-semibold"
              >
                确认标记不合格退单
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Save Strain Modal */}
      {showSaveStrainModal && selectedItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-bold text-indigo-900 text-sm flex items-center gap-1.5">
                <Archive className="w-4 h-4 text-indigo-600" />
                <span>归档临床保存菌株</span>
              </h3>
              <button onClick={() => setShowSaveStrainModal(false)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-700 font-medium block mb-1">菌株名称:</label>
                <input
                  type="text"
                  value={strainNameInput}
                  onChange={(e) => setStrainNameInput(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded text-slate-800"
                />
              </div>

              <div>
                <label className="text-slate-700 font-medium block mb-1">菌株保藏编码:</label>
                <input
                  type="text"
                  value={strainCodeInput}
                  onChange={(e) => setStrainCodeInput(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded text-slate-800 font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowSaveStrainModal(false)}
                className="px-3 py-1.5 border border-slate-300 rounded text-slate-700"
              >
                取消
              </button>
              <button
                onClick={handleSaveStrainSubmit}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-semibold"
              >
                确认归档至菌株库
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Image Lightbox Preview Modal */}
      {showImagePreviewUrl && (
        <div
          onClick={() => setShowImagePreviewUrl(null)}
          className="fixed inset-0 z-50 bg-slate-950/90 flex items-center justify-center p-4 cursor-zoom-out"
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
              src={showImagePreviewUrl}
              alt="Expanded preview"
              className="max-w-full max-h-[85vh] rounded-lg shadow-2xl border border-slate-700"
            />
            <span className="absolute top-2 right-2 text-white bg-slate-900/80 p-2 rounded-full">
              <X className="w-5 h-5" />
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
