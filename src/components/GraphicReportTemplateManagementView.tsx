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
  Sparkles,
  User,
  Clock,
  Settings,
  FileCheck,
  Eye,
  Sliders
} from 'lucide-react';
import {
  GraphicReportTemplateMapping,
  INITIAL_GRAPHIC_TEMPLATE_MAPPINGS
} from '../data/graphicReportTemplateData';
import { UserProfile } from '../types/navigation';

interface GraphicReportTemplateManagementViewProps {
  user?: UserProfile;
  triggerAction: (msg: string) => void;
}

export const GraphicReportTemplateManagementView: React.FC<GraphicReportTemplateManagementViewProps> = ({
  user,
  triggerAction,
}) => {
  // Master Dataset State for 图文报告系统 报告模板管理
  const [mappings, setMappings] = useState<GraphicReportTemplateMapping[]>(INITIAL_GRAPHIC_TEMPLATE_MAPPINGS);

  // Filter States (Matching user screenshot image_3c81cc53.png: 单位名称)
  const [selectedHospitalUnit, setSelectedHospitalUnit] = useState<string>('中心医院');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('全部');

  // Pagination State (Strict requirement: 10 items per page)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  // Modal Dialog States
  const [showConfigModal, setShowConfigModal] = useState<boolean>(false);
  const [editingMapping, setEditingMapping] = useState<GraphicReportTemplateMapping | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState<GraphicReportTemplateMapping | null>(null);
  const [itemToDelete, setItemToDelete] = useState<GraphicReportTemplateMapping | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    hospitalUnit: '中心医院',
    applyName: '',
    templateFile: '',
    templateDesc: '',
    department: '血液内科',
    paperSize: 'A4 竖向',
    status: '启用' as '启用' | '停用',
  });

  // Filtered List
  const filteredMappings = useMemo(() => {
    return mappings.filter(item => {
      // 1. Hospital Unit Filter
      if (selectedHospitalUnit !== '全部' && item.hospitalUnit !== selectedHospitalUnit) {
        return false;
      }

      // 2. Keyword Filter (applyName, templateFile, templateDesc)
      if (searchKeyword.trim()) {
        const kw = searchKeyword.trim().toLowerCase();
        const matchApply = item.applyName.toLowerCase().includes(kw);
        const matchFile = item.templateFile.toLowerCase().includes(kw);
        const matchDesc = item.templateDesc.toLowerCase().includes(kw);
        const matchDept = item.department.toLowerCase().includes(kw);
        if (!matchApply && !matchFile && !matchDesc && !matchDept) {
          return false;
        }
      }

      // 3. Status Filter
      if (statusFilter !== '全部' && item.status !== statusFilter) {
        return false;
      }

      return true;
    });
  }, [mappings, selectedHospitalUnit, searchKeyword, statusFilter]);

  // Paginated Data
  const totalPages = Math.ceil(filteredMappings.length / pageSize) || 1;
  const paginatedMappings = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredMappings.slice(start, start + pageSize);
  }, [filteredMappings, currentPage, pageSize]);

  // Handlers
  const handleOpenAddModal = () => {
    setEditingMapping(null);
    setFormData({
      hospitalUnit: selectedHospitalUnit === '全部' ? '中心医院' : selectedHospitalUnit,
      applyName: '',
      templateFile: 'LSM_Custom.cpt',
      templateDesc: '',
      department: '血液内科',
      paperSize: 'A4 竖向',
      status: '启用',
    });
    setShowConfigModal(true);
  };

  const handleOpenEditModal = (item: GraphicReportTemplateMapping) => {
    setEditingMapping(item);
    setFormData({
      hospitalUnit: item.hospitalUnit,
      applyName: item.applyName,
      templateFile: item.templateFile,
      templateDesc: item.templateDesc,
      department: item.department,
      paperSize: item.paperSize,
      status: item.status,
    });
    setShowConfigModal(true);
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.applyName.trim()) {
      alert('请输入检验申请名称');
      return;
    }
    if (!formData.templateFile.trim()) {
      alert('请输入报告模板文件名 (.cpt)');
      return;
    }

    const creatorName = user?.name ? `${user.name}主管` : '魏主任';
    const nowStr = '2026-10-30 14:30';

    if (editingMapping) {
      setMappings(prev =>
        prev.map(item =>
          item.id === editingMapping.id
            ? {
                ...item,
                ...formData,
                updatedAt: nowStr,
              }
            : item
        )
      );
      triggerAction(`已保存检验申请 [${formData.applyName}] 的报告模板配置！`);
    } else {
      const newMapping: GraphicReportTemplateMapping = {
        id: `GTM-${Date.now()}`,
        seqNo: mappings.length + 1,
        ...formData,
        creator: creatorName,
        updatedAt: nowStr,
      };
      setMappings(prev => [newMapping, ...prev]);
      triggerAction(`成功配置新检验申请 [${formData.applyName}] 报告模板！`);
    }

    setShowConfigModal(false);
  };

  const handleConfirmDelete = () => {
    if (!itemToDelete) return;
    setMappings(prev => prev.filter(item => item.id !== itemToDelete.id));
    triggerAction(`已删除检验申请 [${itemToDelete.applyName}] 的报告模板配置！`);
    setItemToDelete(null);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-800 font-sans p-4 overflow-y-auto space-y-4">
      {/* 1. Header Toolbar & Filters (Exact match to screenshot image_3c81cc53.png) */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            {/* 单位名称 Dropdown */}
            <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
              <Building2 className="w-4 h-4 text-sky-600 shrink-0" />
              <label className="text-slate-600 font-medium whitespace-nowrap">单位名称:</label>
              <select
                value={selectedHospitalUnit}
                onChange={e => {
                  setSelectedHospitalUnit(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="中心医院">中心医院</option>
                <option value="大连医科大学附属第二医院">大连医科大学附属第二医院</option>
                <option value="东院区">东院区</option>
                <option value="第一分院">第一分院</option>
                <option value="全部">全部单位</option>
              </select>
            </div>

            {/* Keyword Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="搜索检验申请、模板文件名或描述..."
                value={searchKeyword}
                onChange={e => {
                  setSearchKeyword(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-64 pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all placeholder:text-slate-400"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
              <span className="text-slate-500 font-medium">状态:</span>
              <select
                value={statusFilter}
                onChange={e => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-transparent font-medium text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="全部">全部状态</option>
                <option value="启用">启用</option>
                <option value="停用">停用</option>
              </select>
            </div>

            {/* Refresh */}
            <button
              onClick={() => {
                setSearchKeyword('');
                setStatusFilter('全部');
                setCurrentPage(1);
                triggerAction('已刷新报告模板配置数据！');
              }}
              className="p-1.5 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-lg border border-slate-200 transition-colors"
              title="刷新数据"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Action Button: 配置 (Matching user screenshot) */}
          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-medium transition-colors shadow-2xs text-xs"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>配置</span>
          </button>
        </div>
      </div>

      {/* 2. Main Application Report Template List Table (申请列表) */}
      <div className="bg-white border border-slate-200/90 rounded-xl shadow-2xs overflow-hidden flex flex-col">
        <div className="px-4 py-2.5 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-sky-600" />
            <h3 className="font-bold text-xs text-slate-800">申请列表</h3>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            合计: <strong>{filteredMappings.length}</strong> 条记录
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100/70 text-slate-700 font-semibold border-b border-slate-200 uppercase tracking-wider">
                <th className="py-3 px-4 w-16 text-center">编号</th>
                <th className="py-3 px-4">检验申请</th>
                <th className="py-3 px-4">报告模板 (.cpt)</th>
                <th className="py-3 px-4">模板描述</th>
                <th className="py-3 px-4">适用科室</th>
                <th className="py-3 px-4">维护人/更新时间</th>
                <th className="py-3 px-4">状态</th>
                <th className="py-3 px-4 text-center">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {paginatedMappings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <FileText className="w-8 h-8 text-slate-300 stroke-1" />
                      <span>未查询到匹配的检验申请模板关联配置</span>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedMappings.map((item, idx) => {
                  const seqNumber = (currentPage - 1) * pageSize + idx + 1;
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-sky-50/30 transition-colors"
                    >
                      <td className="py-3 px-4 text-center font-mono font-medium text-slate-500">
                        {seqNumber}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {item.applyName}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded bg-sky-50 text-sky-800 border border-sky-200 font-mono text-[11px] font-bold">
                          {item.templateFile || '未关联模板'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-700 max-w-xs truncate">
                        {item.templateDesc || '暂无详细描述'}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {item.department}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        <div className="font-medium text-slate-800">{item.creator}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{item.updatedAt}</div>
                      </td>
                      <td className="py-3 px-4">
                        {item.status === '启用' ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            启用
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-500 border border-slate-200">
                            停用
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-3 font-medium text-xs">
                          <button
                            onClick={() => handleOpenEditModal(item)}
                            className="text-sky-600 hover:text-sky-800 transition-colors"
                          >
                            编辑
                          </button>
                          <button
                            onClick={() => setShowPreviewModal(item)}
                            className="text-indigo-600 hover:text-indigo-800 transition-colors"
                          >
                            配置/预览
                          </button>
                          <button
                            onClick={() => setItemToDelete(item)}
                            className="text-rose-600 hover:text-rose-800 transition-colors"
                          >
                            删除
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* 3. Pagination Controls (Strict 10 items per page requirement) */}
        <div className="bg-slate-50/90 border-t border-slate-200 px-4 py-3 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span>
              显示第 <strong className="font-mono text-slate-900">{filteredMappings.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}</strong> 到{' '}
              <strong className="font-mono text-slate-900">{Math.min(currentPage * pageSize, filteredMappings.length)}</strong> 条，共{' '}
              <strong className="font-mono text-slate-900">{filteredMappings.length}</strong> 条记录
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

      {/* Configuration Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden">
            <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between">
              <h3 className="font-bold text-sm">
                {editingMapping ? '编辑报告模板关联配置' : '新增报告模板关联配置'}
              </h3>
              <button
                onClick={() => setShowConfigModal(false)}
                className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveConfig} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">单位名称</label>
                  <select
                    value={formData.hospitalUnit}
                    onChange={e => setFormData({ ...formData, hospitalUnit: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  >
                    <option value="中心医院">中心医院</option>
                    <option value="大连医科大学附属第二医院">大连医科大学附属第二医院</option>
                    <option value="东院区">东院区</option>
                    <option value="第一分院">第一分院</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">适用科室</label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={e => setFormData({ ...formData, department: e.target.value })}
                    placeholder="如：血液内科、病理科"
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block font-medium text-slate-700 mb-1">检验申请名称 *</label>
                  <input
                    type="text"
                    value={formData.applyName}
                    onChange={e => setFormData({ ...formData, applyName: e.target.value })}
                    placeholder="如：骨髓细胞学、液基细胞检查"
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">报告模板文件 (.cpt) *</label>
                  <input
                    type="text"
                    value={formData.templateFile}
                    onChange={e => setFormData({ ...formData, templateFile: e.target.value })}
                    placeholder="LSM.cpt"
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">纸张规格与方向</label>
                  <select
                    value={formData.paperSize}
                    onChange={e => setFormData({ ...formData, paperSize: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  >
                    <option value="A4 竖向">A4 竖向 (标准套打)</option>
                    <option value="A4 横向">A4 横向 (宽幅卡片)</option>
                    <option value="A5 竖向">A5 竖向 (精简便笺)</option>
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block font-medium text-slate-700 mb-1">模板描述说明</label>
                  <textarea
                    rows={3}
                    value={formData.templateDesc}
                    onChange={e => setFormData({ ...formData, templateDesc: e.target.value })}
                    placeholder="请输入模板排版特点，例如包含双栏显微图谱、骨髓形态学分类表及电子签章位置"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">状态</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                  >
                    <option value="启用">启用</option>
                    <option value="停用">停用</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowConfigModal(false)}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-medium transition-colors shadow-2xs"
                >
                  保存配置
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Layout Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col">
            <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-sky-400" />
                <h3 className="font-bold text-sm">FineReport 报表模板排版预览</h3>
              </div>
              <button
                onClick={() => setShowPreviewModal(null)}
                className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">{showPreviewModal.applyName}</span>
                  <span className="px-2 py-0.5 bg-sky-100 text-sky-800 rounded font-mono font-bold">
                    {showPreviewModal.templateFile}
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed">{showPreviewModal.templateDesc}</p>
                <div className="flex items-center gap-4 text-slate-500 font-mono text-[11px] pt-1">
                  <span>适用单位: {showPreviewModal.hospitalUnit}</span>
                  <span>|</span>
                  <span>规格: {showPreviewModal.paperSize}</span>
                </div>
              </div>

              {/* Graphical Layout Template Mock Container */}
              <div className="bg-white border-2 border-dashed border-slate-300 rounded-xl p-6 text-center space-y-3">
                <div className="w-12 h-12 mx-auto rounded-full bg-sky-50 text-sky-600 flex items-center justify-center">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">FineReport 激光彩色打印样式示意图</h4>
                  <p className="text-slate-500 text-[11px]">
                    该模板已通过套打测试，支持动态页眉、双栏数据分组及4高倍油镜图像自动排版
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setShowPreviewModal(null)}
                className="px-4 py-1.5 bg-slate-800 text-white hover:bg-slate-700 rounded-lg text-xs font-medium"
              >
                关闭预览
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden p-5 space-y-4 text-xs">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="font-bold text-sm text-slate-900">确认解绑该报告模板配置？</h3>
            </div>

            <p className="text-slate-600 leading-relaxed">
              您正在准备解绑检验申请 <strong className="text-slate-900">[{itemToDelete.applyName}]</strong> 与模板 <strong className="font-mono text-slate-900">[{itemToDelete.templateFile}]</strong> 的关联，解绑后该项目出具报告时将恢复为系统默认全局样式。
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setItemToDelete(null)}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-medium transition-colors shadow-2xs"
              >
                确认解绑
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
