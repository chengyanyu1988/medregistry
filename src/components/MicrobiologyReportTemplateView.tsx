import React, { useState, useMemo } from 'react';
import {
  MicroReportType,
  MicroReportTemplateItem,
  INITIAL_MICRO_REPORT_TEMPLATES,
} from '../data/microbiologyReportTemplateData';
import { UserProfile } from '../types/navigation';
import {
  Search,
  Plus,
  RefreshCw,
  Edit,
  Trash2,
  Save,
  CheckCircle2,
  Clock,
  X,
  User,
  Sliders,
  Building2,
  FileText,
  Printer,
  Eye,
  Check,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  QrCode,
  Layers,
  FileSpreadsheet,
} from './MenuIcon';

interface MicrobiologyReportTemplateViewProps {
  user?: UserProfile;
  triggerAction: (msg: string) => void;
}

export const MicrobiologyReportTemplateView: React.FC<MicrobiologyReportTemplateViewProps> = ({
  user,
  triggerAction,
}) => {
  // 1. Top bar: 单位名称
  const [selectedHospitalUnit, setSelectedHospitalUnit] = useState<string>('中心医院');

  // 2. Left catalog: 报告类型
  // Requirement: "点击左侧知识类型，右侧要跟着变化"
  const [activeReportType, setActiveReportType] = useState<MicroReportType>('全部模板');

  // Datasets
  const [templates, setTemplates] = useState<MicroReportTemplateItem[]>(
    INITIAL_MICRO_REPORT_TEMPLATES
  );

  // Search keyword
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  // Pagination (Fixed 10 items/page)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<MicroReportTemplateItem | null>(null);

  // Form Fields
  const [formReportType, setFormReportType] = useState<Exclude<MicroReportType, '全部模板'>>('镜检报告');
  const [formFileName, setFormFileName] = useState<string>('LSM.cpt');
  const [formTemplateName, setFormTemplateName] = useState<string>('');
  const [formDescription, setFormDescription] = useState<string>('临生免报告模板');
  const [formPaperSize, setFormPaperSize] = useState<MicroReportTemplateItem['paperSize']>(
    'A4 纵向 (210×297mm)'
  );
  const [formHospitalHeader, setFormHospitalHeader] = useState<string>('中心医院检验科微生物室');
  const [formDoubleSign, setFormDoubleSign] = useState<boolean>(false);
  const [formWatermark, setFormWatermark] = useState<boolean>(false);
  const [formQrCode, setFormQrCode] = useState<boolean>(true);

  // Preview Modal State
  const [previewItem, setPreviewItem] = useState<MicroReportTemplateItem | null>(null);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showNotice = (msg: string) => {
    setToastMessage(msg);
    triggerAction(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filtered Templates
  const filteredTemplates = useMemo(() => {
    return templates.filter((tpl) => {
      // Catalog filter
      if (activeReportType !== '全部模板' && tpl.reportType !== activeReportType) {
        return false;
      }
      // Search filter
      if (searchKeyword.trim()) {
        const q = searchKeyword.trim().toLowerCase();
        return (
          tpl.reportType.toLowerCase().includes(q) ||
          tpl.templateFileName.toLowerCase().includes(q) ||
          tpl.templateName.toLowerCase().includes(q) ||
          tpl.description.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [templates, activeReportType, searchKeyword]);

  // Paginated List
  const totalPages = Math.ceil(filteredTemplates.length / pageSize) || 1;
  const paginatedTemplates = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredTemplates.slice(start, start + pageSize);
  }, [filteredTemplates, currentPage, pageSize]);

  // Handle Switch Catalog
  const handleSelectCatalog = (cat: MicroReportType) => {
    setActiveReportType(cat);
    setCurrentPage(1);
    showNotice(`已切换查看【${cat}】`);
  };

  // Toggle status
  const handleToggleStatus = (id: string) => {
    setTemplates((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isEnabled: !t.isEnabled } : t))
    );
    showNotice('模板启用状态已更新');
  };

  // Open Edit Modal
  const handleOpenEdit = (item: MicroReportTemplateItem) => {
    setEditingItem(item);
    setFormReportType(item.reportType);
    setFormFileName(item.templateFileName);
    setFormTemplateName(item.templateName);
    setFormDescription(item.description);
    setFormPaperSize(item.paperSize);
    setFormHospitalHeader(item.hospitalHeader);
    setFormDoubleSign(item.isDoubleSignatureRequired);
    setFormWatermark(item.hasWatermark);
    setFormQrCode(item.hasQrCode);
    setIsEditModalOpen(true);
  };

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormReportType(activeReportType === '全部模板' ? '镜检报告' : activeReportType);
    setFormFileName('New_Template.cpt');
    setFormTemplateName('');
    setFormDescription('临生免标准报告模板');
    setFormPaperSize('A4 纵向 (210×297mm)');
    setFormHospitalHeader(`${selectedHospitalUnit}检验医学中心微生物室`);
    setFormDoubleSign(false);
    setFormWatermark(false);
    setFormQrCode(true);
    setIsEditModalOpen(true);
  };

  // Save Form
  const handleSaveForm = () => {
    if (!formFileName.trim() || !formDescription.trim()) {
      showNotice('请填写报告模板文件及模板描述！');
      return;
    }
    const operator = user?.name ? `${user.name}主管检验师` : '李晓红主管检验师';
    const currentTime = '2026-10-30 11:30:00';

    if (editingItem) {
      setTemplates((prev) =>
        prev.map((t) =>
          t.id === editingItem.id
            ? {
                ...t,
                reportType: formReportType,
                templateFileName: formFileName.trim(),
                templateName: formTemplateName.trim() || t.templateName,
                description: formDescription.trim(),
                paperSize: formPaperSize,
                hospitalHeader: formHospitalHeader,
                isDoubleSignatureRequired: formDoubleSign,
                hasWatermark: formWatermark,
                hasQrCode: formQrCode,
                operator,
                operateTime: currentTime,
              }
            : t
        )
      );
      showNotice(`报告模板【${formFileName}】已更新保存！`);
    } else {
      const newItem: MicroReportTemplateItem = {
        id: `tpl-${Date.now()}`,
        reportType: formReportType,
        templateFileName: formFileName.trim(),
        templateName: formTemplateName.trim() || `${formReportType}自定义单`,
        description: formDescription.trim(),
        paperSize: formPaperSize,
        hospitalHeader: formHospitalHeader,
        isDoubleSignatureRequired: formDoubleSign,
        hasWatermark: formWatermark,
        hasQrCode: formQrCode,
        isEnabled: true,
        operator,
        operateTime: currentTime,
        previewData: INITIAL_MICRO_REPORT_TEMPLATES[0].previewData,
      };
      setTemplates((prev) => [newItem, ...prev]);
      showNotice(`新建报告模板【${formFileName}】保存成功！`);
    }
    setIsEditModalOpen(false);
  };

  // Delete
  const handleDelete = (id: string) => {
    setTemplates((prev) => prev.filter((t) => t.id !== id));
    showNotice('报告模板已删除');
  };

  return (
    <div className="flex flex-col h-full bg-slate-100 text-xs text-slate-700 select-none overflow-hidden font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 text-white px-4 py-2 rounded-lg shadow-xl text-xs flex items-center gap-2 backdrop-blur-xs border border-slate-700 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Toolbar (Matches screenshot top bar: 单位名称 [中心医院]) */}
      <div className="bg-white border-b border-slate-200 px-4 py-2.5 flex items-center justify-between shadow-2xs shrink-0">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-sky-600" />
            <span className="font-bold text-slate-800 text-sm">微生物报告模板管理</span>
            <span className="px-2 py-0.5 rounded text-[11px] bg-sky-50 text-sky-700 border border-sky-200 font-medium">
              FineReport 引擎 v10.5
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-600 font-medium flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              单位名称:
            </span>
            <select
              value={selectedHospitalUnit}
              onChange={(e) => {
                setSelectedHospitalUnit(e.target.value);
                showNotice(`已切换机构为: ${e.target.value}`);
              }}
              className="bg-slate-50 border border-slate-300 rounded px-2.5 py-1 text-slate-800 font-semibold focus:outline-none focus:ring-1 focus:ring-sky-500 cursor-pointer"
            >
              <option value="中心医院">中心医院 (微生物核心实验室)</option>
              <option value="东城第一分院">东城第一分院 (东院区感染病房)</option>
              <option value="滨海妇女儿童院区">滨海妇女儿童院区 (儿科与新生儿中心)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-4 text-slate-500 text-[11px]">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            模板版本库时间: <strong className="text-slate-700 font-mono">2026-10-30</strong>
          </span>
          <span className="flex items-center gap-1">
            <User className="w-3.5 h-3.5 text-slate-400" />
            质量授权人: <strong className="text-slate-700">郭彩霞主任医师</strong>
          </span>
          <button
            onClick={() => showNotice('报告模板引擎配置已重新校验同步！')}
            className="flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition font-medium"
          >
            <RefreshCw className="w-3 h-3" />
            刷新模板
          </button>
        </div>
      </div>

      {/* Main Body: Left 报告类型 + Right 模板列表 (Matches screenshot structure & linkage) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sub-panel: 报告类型分类目录 (Requirement: "点击左侧知识类型，右侧要跟着变化") */}
        <div className="w-52 bg-white border-r border-slate-200 flex flex-col shrink-0">
          <div className="p-3 border-b border-slate-200 bg-slate-50 font-bold text-slate-800 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-sky-600" />
              报告类型目录
            </span>
            <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-mono">
              {templates.length} 个
            </span>
          </div>

          <div className="p-2 space-y-1 flex-1 overflow-y-auto">
            {(
              [
                '全部模板',
                '镜检报告',
                '仪器培养报告',
                '普通培养报告',
                '鉴定报告',
                '初步药敏报告',
                '最终药敏报告',
                '危急值双签报告',
                '多重耐药专档',
              ] as MicroReportType[]
            ).map((cat) => {
              const isActive = activeReportType === cat;
              const count =
                cat === '全部模板'
                  ? templates.length
                  : templates.filter((t) => t.reportType === cat).length;
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
                  <span className="text-[10px] font-mono text-slate-400">{count}</span>
                </button>
              );
            })}
          </div>

          <div className="p-3 border-t border-slate-200 bg-slate-50 text-[11px] text-slate-500">
            <div>模板渲染引擎: <strong className="text-emerald-700 font-mono">Active</strong></div>
            <div className="mt-0.5">机构: {selectedHospitalUnit}</div>
          </div>
        </div>

        {/* Right Main Panel: 模板列表 (Matches screenshot: 报告类型 | 报告模板 | 模板描述 | 操作) */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white">
          {/* Header Toolbar */}
          <div className="p-3 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-800 text-sm">模板列表</span>
              <span className="text-[11px] text-slate-500">
                (当前分类: <strong className="text-sky-700">{activeReportType}</strong>，共{' '}
                {filteredTemplates.length} 项)
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="relative">
                <input
                  type="text"
                  placeholder="搜索报告类型 / 模板文件名 / 描述..."
                  value={searchKeyword}
                  onChange={(e) => {
                    setSearchKeyword(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-2.5 pr-7 py-1.5 bg-white border border-slate-300 rounded text-slate-800 text-xs w-64 focus:outline-none focus:ring-1 focus:ring-sky-500 placeholder-slate-400"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2.5" />
              </div>

              <button
                onClick={handleOpenCreate}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded font-medium shadow-2xs transition"
              >
                <Plus className="w-3.5 h-3.5" />
                新增模板
              </button>
            </div>
          </div>

          {/* Table (Matches screenshot columns: 报告类型 | 报告模板 | 模板描述 | 操作) */}
          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-100 text-slate-600 text-[11px] border-b border-slate-200 sticky top-0 z-10">
                <tr>
                  <th className="py-2.5 px-4 font-semibold w-36">报告类型</th>
                  <th className="py-2.5 px-4 font-semibold w-48">报告模板 (.cpt)</th>
                  <th className="py-2.5 px-4 font-semibold">模板描述</th>
                  <th className="py-2.5 px-4 font-semibold w-36">纸张规格</th>
                  <th className="py-2.5 px-4 font-semibold w-44">维护人/时间</th>
                  <th className="py-2.5 px-4 font-semibold text-center w-20">状态</th>
                  <th className="py-2.5 px-4 font-semibold text-center w-36">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedTemplates.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    {/* 报告类型 */}
                    <td className="py-3 px-4 font-bold text-slate-800">
                      <div className="flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-sky-600" />
                        <span>{item.reportType}</span>
                      </div>
                    </td>

                    {/* 报告模板 (Matches screenshot LSM.cpt) */}
                    <td className="py-3 px-4 font-mono font-bold text-sky-700">
                      <span className="px-2 py-0.5 bg-sky-50 border border-sky-200 rounded">
                        {item.templateFileName}
                      </span>
                    </td>

                    {/* 模板描述 (Matches screenshot 临生免报告模板) */}
                    <td className="py-3 px-4 text-slate-700">
                      <div>{item.description}</div>
                      {item.templateName && (
                        <div className="text-[10px] text-slate-400 font-normal mt-0.5">
                          {item.templateName}
                        </div>
                      )}
                    </td>

                    {/* 纸张规格 */}
                    <td className="py-3 px-4 text-slate-600 text-[11px]">
                      {item.paperSize}
                    </td>

                    {/* 维护人与近期时间 */}
                    <td className="py-3 px-4 text-[11px] text-slate-500">
                      <div className="font-medium text-slate-700">{item.operator}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{item.operateTime}</div>
                    </td>

                    {/* 启用状态 */}
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(item.id)}
                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                          item.isEnabled ? 'bg-sky-600' : 'bg-slate-300'
                        }`}
                        title={item.isEnabled ? '已启用，点击停用' : '已停用，点击启用'}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                            item.isEnabled ? 'translate-x-4' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </td>

                    {/* 操作列: 编辑 (Matches screenshot blue 编辑) + 预览 + 删除 */}
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-2.5">
                        <button
                          onClick={() => setPreviewItem(item)}
                          className="text-emerald-600 hover:text-emerald-800 font-medium flex items-center gap-0.5"
                          title="查看高保真 A4 报告单预览"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          预览
                        </button>
                        <span className="text-slate-300">|</span>
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="text-sky-600 hover:text-sky-800 font-medium flex items-center gap-0.5"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          编辑
                        </button>
                        <span className="text-slate-300">|</span>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-rose-600 hover:text-rose-800 font-medium"
                        >
                          删除
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {paginatedTemplates.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-16 text-center text-slate-400">
                      未查询到符合条件的报告模板，请点击右上角「新增模板」
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Bottom Pagination Bar (Matches fixed 10 items/page and "合计: X 条") */}
          <div className="p-2.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-[11px] text-slate-500 shrink-0">
            <div>
              合计: <strong className="text-slate-700 font-mono">{filteredTemplates.length}</strong> 条
              （每页固定 {pageSize} 条）
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-400">
                第 {currentPage} / {totalPages} 页
              </span>
              <button
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-1 rounded bg-white border border-slate-300 disabled:opacity-40 hover:bg-slate-100 transition"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="p-1 rounded bg-white border border-slate-300 disabled:opacity-40 hover:bg-slate-100 transition"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 1. Edit / Create Modal                                   */}
      {/* ======================================================== */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-2xs p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden flex flex-col">
            <div className="px-4 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-sky-600" />
                <span>{editingItem ? '编辑报告模板参数' : '新建微生物报告模板'}</span>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-3.5 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">
                    <span className="text-rose-500 mr-0.5">*</span>报告类型
                  </label>
                  <select
                    value={formReportType}
                    onChange={(e) => setFormReportType(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded font-semibold text-slate-800 focus:ring-1 focus:ring-sky-500"
                  >
                    <option value="镜检报告">镜检报告 (直接涂片与显微镜检)</option>
                    <option value="仪器培养报告">仪器培养报告 (血培养报阳初报)</option>
                    <option value="普通培养报告">普通培养报告 (琼脂平板分离培养)</option>
                    <option value="鉴定报告">鉴定报告 (质谱菌种确证单)</option>
                    <option value="初步药敏报告">初步药敏报告 (快速药敏/KB初报)</option>
                    <option value="最终药敏报告">最终药敏报告 (全谱定量MIC报告)</option>
                    <option value="危急值双签报告">危急值双签报告 (无菌体液阳性)</option>
                    <option value="多重耐药专档">多重耐药专档 (院感隔离单)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">
                    <span className="text-rose-500 mr-0.5">*</span>报告模板文件名 (.cpt)
                  </label>
                  <input
                    type="text"
                    value={formFileName}
                    onChange={(e) => setFormFileName(e.target.value)}
                    placeholder="如: LSM.cpt 或 AST_Final.cpt"
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded font-mono font-bold text-sky-800 focus:ring-1 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">模板标题名称</label>
                <input
                  type="text"
                  value={formTemplateName}
                  onChange={(e) => setFormTemplateName(e.target.value)}
                  placeholder="如: 微生物直接涂片显微镜检报告单"
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-800 focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  <span className="text-rose-500 mr-0.5">*</span>模板描述
                </label>
                <input
                  type="text"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="如: 临生免报告模板 / 用于直接涂片常规初报"
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-800 focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">纸张输出规格</label>
                  <select
                    value={formPaperSize}
                    onChange={(e) => setFormPaperSize(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-800 focus:ring-1 focus:ring-sky-500"
                  >
                    <option value="A4 纵向 (210×297mm)">A4 纵向 (210×297mm)</option>
                    <option value="A5 横向 (210×148mm)">A5 横向 (210×148mm)</option>
                    <option value="80mm 热敏连续卷纸">80mm 热敏连续卷纸</option>
                    <option value="嵌入式电子病历PDF">嵌入式电子病历PDF</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">页眉机构抬头</label>
                  <input
                    type="text"
                    value={formHospitalHeader}
                    onChange={(e) => setFormHospitalHeader(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded text-slate-800 focus:ring-1 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="border border-slate-200 rounded-lg p-3 bg-slate-50 space-y-2">
                <div className="font-bold text-slate-700 text-[11px]">高级打印与合规控制:</div>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-700">
                    <input
                      type="checkbox"
                      checked={formDoubleSign}
                      onChange={(e) => setFormDoubleSign(e.target.checked)}
                      className="w-4 h-4 text-sky-600 rounded border-slate-300 focus:ring-sky-500"
                    />
                    <span>强制检验/审核双电子签名</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-700">
                    <input
                      type="checkbox"
                      checked={formWatermark}
                      onChange={(e) => setFormWatermark(e.target.checked)}
                      className="w-4 h-4 text-sky-600 rounded border-slate-300 focus:ring-sky-500"
                    />
                    <span>受控防伪双色水印</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-700">
                    <input
                      type="checkbox"
                      checked={formQrCode}
                      onChange={(e) => setFormQrCode(e.target.checked)}
                      className="w-4 h-4 text-sky-600 rounded border-slate-300 focus:ring-sky-500"
                    />
                    <span>打印防伪溯源二维码</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="px-4 py-2.5 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-2">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-1.5 border border-slate-300 bg-white hover:bg-slate-100 rounded text-slate-700 font-medium"
              >
                取消
              </button>
              <button
                onClick={handleSaveForm}
                className="px-5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold shadow-2xs flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                保存模板
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. High-Fidelity A4 Report Preview Modal                 */}
      {/* ======================================================== */}
      {previewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-2xs p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-300 w-full max-w-4xl max-h-[92vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="px-4 py-2.5 bg-slate-800 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Printer className="w-4 h-4 text-sky-400" />
                <span className="font-bold text-sm">
                  报告模板打印预览: {previewItem.templateFileName} - {previewItem.templateName}
                </span>
                <span className="text-[10px] bg-slate-700 px-2 py-0.5 rounded text-slate-300 font-mono">
                  {previewItem.paperSize}
                </span>
              </div>
              <button
                onClick={() => setPreviewItem(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Simulated Paper (A4 Report) */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-200/80 flex justify-center">
              <div className="w-full max-w-3xl bg-white shadow-lg border border-slate-300 p-8 rounded-sm relative text-slate-900 font-sans">
                {/* Watermark if enabled */}
                {previewItem.hasWatermark && (
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-5 rotate-[-25deg]">
                    <span className="text-8xl font-black text-rose-900 select-none">
                      中心医院受控报告
                    </span>
                  </div>
                )}

                {/* Report Header */}
                <div className="text-center pb-3 border-b-2 border-slate-800">
                  <div className="text-xl font-black tracking-wider text-slate-900">
                    {selectedHospitalUnit}
                  </div>
                  <div className="text-base font-bold text-slate-800 mt-1">
                    {previewItem.templateName}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5 font-mono">
                    (模版引擎: {previewItem.templateFileName} | 纸张: {previewItem.paperSize})
                  </div>
                </div>

                {/* Patient Information Grid */}
                <div className="grid grid-cols-4 gap-y-1.5 py-3 border-b border-slate-300 text-xs">
                  <div>
                    <span className="text-slate-500">姓名:</span>{' '}
                    <strong className="text-slate-900">{previewItem.previewData?.patientName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">性别:</span>{' '}
                    <span>{previewItem.previewData?.gender}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">年龄:</span>{' '}
                    <span>{previewItem.previewData?.age}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">住院号:</span>{' '}
                    <span className="font-mono">{previewItem.previewData?.hospitalNo}</span>
                  </div>

                  <div>
                    <span className="text-slate-500">送检科室:</span>{' '}
                    <span>{previewItem.previewData?.dept}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">床号:</span>{' '}
                    <span>{previewItem.previewData?.bedNo}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">标本类型:</span>{' '}
                    <span className="font-semibold text-slate-800">
                      {previewItem.previewData?.specimen}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500">标本条码:</span>{' '}
                    <span className="font-mono font-bold text-sky-800">
                      {previewItem.previewData?.barcode}
                    </span>
                  </div>
                </div>

                {/* Smear Section */}
                <div className="my-3 border border-slate-200 rounded p-3 bg-slate-50/50">
                  <div className="font-bold text-slate-800 text-xs mb-1 flex items-center justify-between">
                    <span>【涂片显微镜检形态学结果】</span>
                    <span className="text-[11px] text-slate-400 font-normal">检验方法: 直接显微镜检</span>
                  </div>
                  <div className="text-xs text-slate-800 leading-relaxed pl-2 font-mono">
                    {previewItem.previewData?.smearResult}
                  </div>
                </div>

                {/* Culture & ID Section */}
                <div className="my-3 border border-slate-200 rounded p-3 bg-slate-50/50">
                  <div className="font-bold text-slate-800 text-xs mb-1 flex items-center justify-between">
                    <span>【培养分离与质谱菌种鉴定】</span>
                    <span className="text-[11px] text-slate-400 font-normal">
                      鉴定系统: MALDI-TOF 质谱确证
                    </span>
                  </div>
                  <div className="flex items-center gap-2 pl-2">
                    <span className="text-slate-600 text-xs">分离鉴定菌种:</span>
                    <span className="font-bold text-sm text-sky-900 font-mono">
                      {previewItem.previewData?.microbeName}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 pl-2 mt-1">
                    {previewItem.previewData?.cultureResult}
                  </div>
                </div>

                {/* AST Table if present */}
                {previewItem.previewData?.astResults &&
                  previewItem.previewData.astResults.length > 0 && (
                    <div className="my-3">
                      <div className="font-bold text-slate-800 text-xs mb-1 flex items-center justify-between">
                        <span>【药物敏感性试验 (AST) 测定结果】</span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          参考标准: CLSI M100-ED34:2026
                        </span>
                      </div>
                      <table className="w-full text-left text-xs border border-slate-300">
                        <thead className="bg-slate-100 text-slate-700 border-b border-slate-300">
                          <tr>
                            <th className="py-1.5 px-3 font-semibold">抗生素名称</th>
                            <th className="py-1.5 px-3 font-semibold font-mono">MIC 测定值</th>
                            <th className="py-1.5 px-3 font-semibold text-center w-24">结果判定</th>
                            <th className="py-1.5 px-3 font-semibold text-right">CLSI 敏感折点</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 font-mono text-xs">
                          {previewItem.previewData.astResults.map((ast, idx) => (
                            <tr key={idx} className={ast.susceptibility === 'R' ? 'bg-rose-50/60' : ''}>
                              <td className="py-1.5 px-3 font-sans font-medium text-slate-900">
                                {ast.drugName}
                              </td>
                              <td className="py-1.5 px-3">{ast.micValue}</td>
                              <td className="py-1.5 px-3 text-center">
                                <span
                                  className={`px-2 py-0.5 rounded font-black text-xs ${
                                    ast.susceptibility === 'S'
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : ast.susceptibility === 'I'
                                      ? 'bg-amber-100 text-amber-800'
                                      : 'bg-rose-100 text-rose-800 border border-rose-300 font-bold'
                                  }`}
                                >
                                  {ast.susceptibility === 'S'
                                    ? '敏感 (S)'
                                    : ast.susceptibility === 'I'
                                    ? '中介 (I)'
                                    : '耐药 (R)'}
                                </span>
                              </td>
                              <td className="py-1.5 px-3 text-right text-slate-500">
                                {ast.clsiBreakpoints}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                {/* Footer Signatures */}
                <div className="pt-4 mt-6 border-t border-slate-400 flex items-center justify-between text-xs text-slate-700">
                  <div className="flex items-center gap-6">
                    <div>
                      <span>检验医师:</span>{' '}
                      <strong className="underline decoration-slate-400 decoration-1">
                        {previewItem.operator}
                      </strong>
                    </div>
                    {previewItem.isDoubleSignatureRequired ? (
                      <div>
                        <span>审核医师 (双签):</span>{' '}
                        <strong className="underline decoration-slate-400 decoration-1 text-slate-900">
                          郭彩霞主任医师
                        </strong>
                      </div>
                    ) : (
                      <div>
                        <span>复核人员:</span>{' '}
                        <strong className="underline decoration-slate-400 decoration-1">
                          魏明副主任检验师
                        </strong>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    {previewItem.hasQrCode && (
                      <div className="flex items-center gap-1 text-[10px] text-slate-500 font-mono">
                        <QrCode className="w-5 h-5 text-slate-800" />
                        <span>防伪溯源码</span>
                      </div>
                    )}
                    <div className="text-[10px] text-slate-400 font-mono">
                      报告时间: 2026-10-30 11:30
                    </div>
                  </div>
                </div>

                <div className="mt-2 text-[10px] text-slate-400 text-center">
                  *** 声明: 此报告仅对该送检标本负责，结果需结合患者临床症状综合评估 ***
                </div>
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="px-4 py-2.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
              <span className="text-[11px] text-slate-500">
                打印输出格式: {previewItem.paperSize} | 模板引擎兼容: FineReport 10.5
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPreviewItem(null)}
                  className="px-4 py-1.5 border border-slate-300 bg-white hover:bg-slate-100 rounded text-slate-700 font-medium"
                >
                  关闭
                </button>
                <button
                  onClick={() => {
                    showNotice(`已发送【${previewItem.templateFileName}】至默认激光打印机！`);
                    setPreviewItem(null);
                  }}
                  className="px-5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded font-bold shadow-2xs flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  模拟打印输出
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
