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
  FileCheck,
  Printer,
  SlidersHorizontal,
  ExternalLink,
  ShieldAlert,
  ListFilter
} from 'lucide-react';
import { UserProfile } from '../types/navigation';
import {
  TestUnitTemplateConfig,
  ReportTemplateItem,
  RestrictionCondition,
  INITIAL_REPORT_TEMPLATE_CONFIGS
} from '../data/reportTemplateData';

interface ReportTemplateManagementViewProps {
  user: UserProfile;
  triggerAction: (msg: string) => void;
}

export const ReportTemplateManagementView: React.FC<ReportTemplateManagementViewProps> = ({
  user,
  triggerAction,
}) => {
  // Master Dataset State for 临生免系统 检验单元报告模板
  const [configs, setConfigs] = useState<TestUnitTemplateConfig[]>(INITIAL_REPORT_TEMPLATE_CONFIGS);

  // Filter States
  const [selectedHospitalUnit, setSelectedHospitalUnit] = useState<string>('中心医院');
  const [selectedSubGroup, setSelectedSubGroup] = useState<string>('生化组');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [onlyUnconfigured, setOnlyUnconfigured] = useState<boolean>(false);

  // Pagination State (Strict requirement: 10 items per page)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  // Active Unit for Modal Detail
  const [selectedUnitModal, setSelectedUnitModal] = useState<TestUnitTemplateConfig | null>(null);
  const [modalActiveTab, setModalActiveTab] = useState<'templates' | 'restrictions'>('templates');

  // Search inside Modal
  const [modalTemplateSearch, setModalTemplateSearch] = useState<string>('');
  const [modalRestrictionSearch, setModalRestrictionSearch] = useState<string>('');

  // Modal State for Add / Edit Test Unit
  const [isEditUnitModalOpen, setIsEditUnitModalOpen] = useState<boolean>(false);
  const [editingUnitConfig, setEditingUnitConfig] = useState<TestUnitTemplateConfig | null>(null);
  const [unitForm, setUnitForm] = useState({
    subGroup: '生化组',
    unitName: '',
    unitCode: '',
    creator: '张珊',
  });

  // Modal State for Adding Template
  const [isAddTemplateModalOpen, setIsAddTemplateModalOpen] = useState<boolean>(false);
  const [editingTemplate, setEditingTemplate] = useState<ReportTemplateItem | null>(null);
  const [templateForm, setTemplateForm] = useState({
    templateFile: 'LSM_Custom.cpt',
    templateName: '',
    templateDesc: '',
    isDefault: false,
    paperSize: 'A4 竖向',
    designer: '张珊',
  });

  // Modal State for Adding Restriction
  const [isAddRestrictionModalOpen, setIsAddRestrictionModalOpen] = useState<boolean>(false);
  const [restrictionForm, setRestrictionForm] = useState({
    applyCode: '0012',
    applyName: '全血细胞计数五分类',
    specimenType: '全血',
    deptName: '全院通用',
  });

  // Filtered List
  const filteredConfigs = useMemo(() => {
    return configs.filter(item => {
      // Group Filter
      if (selectedSubGroup !== '全部' && selectedSubGroup !== '' && item.subGroup !== selectedSubGroup) {
        return false;
      }
      // Keyword Filter
      if (searchKeyword.trim()) {
        const kw = searchKeyword.toLowerCase();
        const matchName = item.unitName.toLowerCase().includes(kw);
        const matchCode = item.unitCode.toLowerCase().includes(kw);
        const matchTpl = item.templates.some(
          t => t.templateName.toLowerCase().includes(kw) || t.templateFile.toLowerCase().includes(kw)
        );
        if (!matchName && !matchCode && !matchTpl) {
          return false;
        }
      }
      // Unconfigured Only Filter
      if (onlyUnconfigured && item.isConfigured) {
        return false;
      }
      return true;
    });
  }, [configs, selectedSubGroup, searchKeyword, onlyUnconfigured]);

  // Paginated List
  const totalPages = Math.ceil(filteredConfigs.length / pageSize) || 1;
  const paginatedConfigs = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredConfigs.slice(start, start + pageSize);
  }, [filteredConfigs, currentPage, pageSize]);

  // Handlers
  const handleQuery = () => {
    setCurrentPage(1);
    triggerAction(`查询 [${selectedHospitalUnit} - ${selectedSubGroup}] 检验单元模板配置`);
  };

  const handleSaveUnitConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!unitForm.unitName.trim()) {
      alert('请输入检验单元名称');
      return;
    }

    if (editingUnitConfig) {
      setConfigs(prev =>
        prev.map(c =>
          c.id === editingUnitConfig.id
            ? {
                ...c,
                subGroup: unitForm.subGroup,
                unitName: unitForm.unitName,
                unitCode: unitForm.unitCode,
                creator: unitForm.creator,
                updatedAt: '2026-10-30 10:15',
              }
            : c
        )
      );
      triggerAction(`更新检验单元: ${unitForm.unitName}`);
    } else {
      const newConfig: TestUnitTemplateConfig = {
        id: `RPT-UNIT-${Date.now()}`,
        seqNo: configs.length + 1,
        subGroup: unitForm.subGroup,
        unitName: unitForm.unitName,
        unitCode: unitForm.unitCode || `UNIT-${Math.floor(100 + Math.random() * 900)}`,
        isConfigured: false,
        creator: unitForm.creator,
        updatedAt: '2026-10-30 10:15',
        templates: [],
        restrictions: [],
      };
      setConfigs(prev => [newConfig, ...prev]);
      triggerAction(`新增检验单元模板节点: ${unitForm.unitName}`);
    }
    setIsEditUnitModalOpen(false);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-800 font-sans p-4 overflow-y-auto space-y-4">
      {/* 临生免系统 页面标题 Banner */}
      <div className="bg-white rounded-lg shadow-2xs border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-sky-50 text-sky-600 rounded-lg border border-sky-100">
            <FileCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              临生免系统 · 报告模板管理
              <span className="text-xs font-normal text-sky-700 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded-full">
                基础管理
              </span>
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              为生化、临检、免疫各自动化检验单元关联 FineReport 打印报表文件(.cpt)及临床科室规则
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleQuery}
            className="flex items-center space-x-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>刷新数据</span>
          </button>
          <button
            onClick={() => {
              setEditingUnitConfig(null);
              setUnitForm({
                subGroup: selectedSubGroup === '全部' ? '生化组' : selectedSubGroup,
                unitName: '',
                unitCode: `UNIT-${Math.floor(100 + Math.random() * 900)}`,
                creator: user?.name || '张珊',
              });
              setIsEditUnitModalOpen(true);
            }}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-md shadow-2xs text-xs transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>新增单元配置</span>
          </button>
        </div>
      </div>

      {/* Top Filter Bar (临生免系统: 单位名称, 业务小组, 仅未配置, 查询) */}
      <div className="bg-white rounded-lg shadow-2xs border border-slate-200 p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <label className="text-slate-600 font-medium shrink-0">单位名称</label>
            <select
              value={selectedHospitalUnit}
              onChange={e => setSelectedHospitalUnit(e.target.value)}
              className="border border-slate-300 rounded px-2.5 py-1 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500"
            >
              <option value="中心医院">中心医院</option>
              <option value="第一分院">第一分院</option>
              <option value="东院区">东院区</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <label className="text-slate-600 font-medium shrink-0">业务小组</label>
            <select
              value={selectedSubGroup}
              onChange={e => setSelectedSubGroup(e.target.value)}
              className="border border-slate-300 rounded px-2.5 py-1 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500"
            >
              <option value="全部">全部专业组</option>
              <option value="生化组">生化组</option>
              <option value="临检组">临检组</option>
              <option value="免疫组">免疫组</option>
              <option value="微生物组">微生物组</option>
              <option value="分子生物组">分子生物组</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <label className="text-slate-600 font-medium shrink-0">检验单元</label>
            <div className="relative w-56">
              <input
                type="text"
                placeholder="搜索检验单元名称/编码..."
                value={searchKeyword}
                onChange={e => setSearchKeyword(e.target.value)}
                className="w-full border border-slate-300 rounded pl-3 pr-8 py-1 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-2" />
            </div>
          </div>

          <label className="flex items-center space-x-1.5 cursor-pointer text-slate-600">
            <input
              type="checkbox"
              checked={onlyUnconfigured}
              onChange={e => setOnlyUnconfigured(e.target.checked)}
              className="rounded text-sky-600 focus:ring-sky-500"
            />
            <span>仅显示未配置模板单元</span>
          </label>
        </div>

        <button
          onClick={handleQuery}
          className="px-4 py-1 bg-sky-600 text-white rounded hover:bg-sky-700 font-medium transition shadow-2xs"
        >
          查询
        </button>
      </div>

      {/* Main Table View for 临生免系统 */}
      <div className="bg-white rounded-lg shadow-2xs border border-slate-200 overflow-hidden flex flex-col flex-1">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <th className="py-2.5 px-3 text-center w-12">序号</th>
                <th className="py-2.5 px-3">业务小组</th>
                <th className="py-2.5 px-3">检验单元 (仪器设备)</th>
                <th className="py-2.5 px-3">单元编码</th>
                <th className="py-2.5 px-3">已关联报告模板文件</th>
                <th className="py-2.5 px-3 text-center">限定条件</th>
                <th className="py-2.5 px-3 text-center">配置状态</th>
                <th className="py-2.5 px-3">维护人/时间</th>
                <th className="py-2.5 px-3 text-center">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {paginatedConfigs.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <FileText className="w-8 h-8 text-slate-300 stroke-1" />
                      <span>未找到符合条件的检验单元模板配置</span>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedConfigs.map((item, idx) => {
                  const seqNum = (currentPage - 1) * pageSize + idx + 1;
                  const defaultTpl = item.templates.find(t => t.isDefault) || item.templates[0];

                  return (
                    <tr key={item.id} className="hover:bg-slate-50 transition">
                      <td className="py-2.5 px-3 text-center text-slate-500 font-mono">
                        {seqNum}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded font-medium">
                          {item.subGroup}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-bold text-slate-900">
                        {item.unitName}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-500">
                        {item.unitCode}
                      </td>
                      <td className="py-2.5 px-3">
                        {defaultTpl ? (
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 bg-sky-50 text-sky-800 border border-sky-200 rounded font-mono font-medium">
                              {defaultTpl.templateFile}
                            </span>
                            {item.templates.length > 1 && (
                              <span className="text-[11px] text-slate-400">
                                (共{item.templates.length}套)
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">尚未配置</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded font-mono">
                          {item.restrictions.length} 项规则
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        {item.isConfigured ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            已配置
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                            <AlertTriangle className="w-3 h-3 text-amber-600" />
                            未配置
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600">
                        <div>{item.creator}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{item.updatedAt}</div>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedUnitModal(item);
                              setModalActiveTab('templates');
                            }}
                            className="px-2 py-1 bg-sky-50 hover:bg-sky-100 text-sky-700 rounded border border-sky-200 font-medium transition"
                          >
                            配置模板
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

        {/* Pagination Bar */}
        <div className="bg-slate-50 border-t border-slate-200 px-4 py-2.5 flex items-center justify-between text-xs text-slate-600">
          <div>
            共 <strong className="font-mono text-slate-900">{filteredConfigs.length}</strong> 个检验单元
          </div>
          <div className="flex items-center gap-1">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              className="p-1 rounded bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 font-mono">{currentPage} / {totalPages}</span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              className="p-1 rounded bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-40"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
