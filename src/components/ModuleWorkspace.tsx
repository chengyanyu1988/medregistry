import React, { useState } from 'react';
import { MenuItem, SubMenuItem } from '../types/navigation';
import {
  MenuIcon,
  FlaskConical,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Search,
  Filter,
  RefreshCw,
  Eye,
  Sliders,
  Check,
  Building2,
  User,
  ShieldCheck,
  Maximize2,
  Home,
  ArrowRight
} from './MenuIcon';
import { HomeDashboard } from './HomeDashboard';
import { OutpatientCollectionView } from './OutpatientCollectionView';
import { WardCollectionView } from './WardCollectionView';
import { SpecimenPackingView } from './SpecimenPackingView';
import { SpecimenDeliveryView } from './SpecimenDeliveryView';
import { SpecimenReceiveView } from './SpecimenReceiveView';
import { ClinicalChemImmunoView } from './ClinicalChemImmunoView';
import { GraphicSpecimenCheckInView } from './GraphicSpecimenCheckInView';
import { BoneMarrowWorkstationView } from './BoneMarrowWorkstationView';
import { GraphicMarrowReportView } from './GraphicMarrowReportView';
import { SpecimenCheckInWorkstation } from './SpecimenCheckInWorkstation';
import { ClinicalStatisticsView } from './ClinicalStatisticsView';
import { SpecimenTypeDictionaryView } from './SpecimenTypeDictionaryView';
import { TestApplyDictionaryView } from './TestApplyDictionaryView';
import { OperationDictionaryView } from './OperationDictionaryView';
import { GraphicImageTextDictView } from './GraphicImageTextDictView';
import { KnowledgeBaseManagementView } from './KnowledgeBaseManagementView';
import { TestRuleManagementView } from './TestRuleManagementView';
import { ReportTemplateManagementView } from './ReportTemplateManagementView';
import { GraphicReportTemplateManagementView } from './GraphicReportTemplateManagementView';
import { ThirdPartyMappingView } from './ThirdPartyMappingView';
import { ClinicalReportAuditView } from './ClinicalReportAuditView';
import { DeviceCatalogDictionaryView } from './DeviceCatalogDictionaryView';
import { TestInstrumentConfigView } from './TestInstrumentConfigView';
import { QcRuleSettingView } from './QcRuleSettingView';
import { MicrobiologySpecimenCheckInView } from './MicrobiologySpecimenCheckInView';
import { MicrobiologySpecimenTestView } from './MicrobiologySpecimenTestView';
import { MicrobiologyReportManagementView } from './MicrobiologyReportManagementView';
import { MicrobiologyClinicalStrainView } from './MicrobiologyClinicalStrainView';
import { MicrobiologyStandardStrainView } from './MicrobiologyStandardStrainView';
import { MicrobiologyNotificationView } from './MicrobiologyNotificationView';
import { MicrobiologyReagentQcView } from './MicrobiologyReagentQcView';
import { MicrobiologyAstQcView } from './MicrobiologyAstQcView';
import { MicrobiologyWhonetView } from './MicrobiologyWhonetView';
import { MicrobiologyKnowledgeBaseView } from './MicrobiologyKnowledgeBaseView';
import { MicrobiologyBasicDictView } from './MicrobiologyBasicDictView';
import { MicrobiologyTestRuleView } from './MicrobiologyTestRuleView';
import { MicrobiologyProcessConfigView } from './MicrobiologyProcessConfigView';
import { MicrobiologyReportTemplateView } from './MicrobiologyReportTemplateView';
import { MicrobiologyQcProjectView } from './MicrobiologyQcProjectView';
import { ConsumablesManagementView } from './ConsumablesManagementView';
import { DepartmentManagementView } from './DepartmentManagementView';
import { RegionalLabWorkstation } from './regional/RegionalLabWorkstation';
import { CommunicationConfigWorkstation } from './communication/CommunicationConfigWorkstation';
import { SystemSettingsWorkstation } from './system/SystemSettingsWorkstation';
import { UserProfile } from '../types/navigation';

interface ModuleWorkspaceProps {
  activeMenu: MenuItem;
  activeSubMenu?: SubMenuItem;
  onSelectSubMenu: (subId: string) => void;
  user: UserProfile;
}

export const ModuleWorkspace: React.FC<ModuleWorkspaceProps> = ({
  activeMenu,
  activeSubMenu,
  onSelectSubMenu,
  user,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const triggerAction = (text: string) => {
    setActionNotice(text);
    setTimeout(() => setActionNotice(null), 3000);
  };

  // Check if current module is a high-throughput clinical workstation
  const isWorkstationModule =
    activeMenu.id === 'specimen-pretreatment' ||
    activeMenu.id === 'clinical-chem-immuno' ||
    activeMenu.id === 'graphic-report' ||
    activeMenu.id === 'microbiology' ||
    activeMenu.id === 'consumables-management' ||
    activeMenu.id === 'dept-management' ||
    activeMenu.id === 'regional-lab' ||
    activeMenu.id === 'communication-config' ||
    activeMenu.id === 'system-settings';

  if (isWorkstationModule) {
    const getModuleTitle = () => {
      if (activeMenu.id === 'clinical-chem-immuno') return '临生免系统工作台';
      if (activeMenu.id === 'graphic-report') return '图文报告系统工作台';
      if (activeMenu.id === 'microbiology') return '微生物系统工作台';
      if (activeMenu.id === 'consumables-management') return '耗材管理系统工作台';
      if (activeMenu.id === 'dept-management') return '科室综合管理工作台';
      if (activeMenu.id === 'regional-lab') return '区域检验协同平台';
      if (activeMenu.id === 'communication-config') return '仪器通信配置工作台';
      if (activeMenu.id === 'system-settings') return '系统设置管理工作台';
      return '标本前处理工作台';
    };

    const getModuleStatusText = () => {
      if (activeMenu.id === 'clinical-chem-immuno')
        return '罗氏 Cobas 8000 / 雅培 Alinity 在线 · 标本核收已就绪';
      if (activeMenu.id === 'graphic-report')
        return '数码显微成像系统 / 图像分析工作站在线 · 状态正常';
      if (activeMenu.id === 'microbiology')
        return '全自动微生物质谱鉴定(MALDI-TOF)与药敏(AST)系统在线 · 状态正常';
      if (activeMenu.id === 'consumables-management')
        return '全院试剂冷链温控联网正常 · 12项子模块全生命周期在线管理';
      if (activeMenu.id === 'dept-management')
        return '全院科室工作量、送检项目、标本分类与质量指标数据实时在控';
      if (activeMenu.id === 'regional-lab')
        return '医联体 14 家机构联网在线 · 样本冷链与检验结果互认互通';
      if (activeMenu.id === 'communication-config')
        return 'HL7/ASTM 通信网关服务在线 · 串口网络链路正常';
      if (activeMenu.id === 'system-settings')
        return 'RBAC 三级安全隔离机制生效中 · 安全级别: AAA';
      return 'LIS/HIS 联网正常 · 基准日期 2026-10-26';
    };

    return (
      <div className="flex-1 flex flex-col h-full min-h-0 overflow-hidden bg-slate-100">
        {/* Action Notification Toast */}
        {actionNotice && (
          <div className="fixed top-20 right-8 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2 text-sm border border-slate-700 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{actionNotice}</span>
          </div>
        )}

        {/* Sleek Sub-Module Workstation Navigation Strip (Unified Header) */}
        <div className="bg-white border-b border-slate-200/90 px-4 py-2 flex items-center justify-between shrink-0 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
              <FlaskConical className="w-4 h-4 text-sky-600" />
              <span>{getModuleTitle()}</span>
            </div>
            <div className="h-4 w-px bg-slate-200" />
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200/80 overflow-x-auto">
              {activeMenu.subItems.map((sub) => {
                const isCurrent =
                  activeSubMenu?.id === sub.id ||
                  (sub.children && sub.children.some((c) => c.id === activeSubMenu?.id));
                return (
                  <button
                    key={sub.id}
                    onClick={() => {
                      if (sub.children && sub.children.length > 0) {
                        onSelectSubMenu(sub.children[0].id);
                      } else {
                        onSelectSubMenu(sub.id);
                      }
                    }}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap flex items-center gap-1.5 ${
                      isCurrent
                        ? 'bg-white text-sky-700 font-semibold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                    }`}
                  >
                    <span>{sub.label}</span>
                    {(sub.id === 'specimen-check-in' || sub.id === 'graphic-specimen-check-in' || sub.id === 'micro-specimen-check-in') && (
                      <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-sky-100 text-sky-700 font-mono">
                        核收
                      </span>
                    )}
                    {(sub.id === 'tech-workstation' || sub.id === 'graphic-marrow-workstation' || sub.id === 'micro-specimen-test') && (
                      <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 text-emerald-700 font-mono">
                        {sub.id === 'micro-specimen-test' ? '检验' : '工作站'}
                      </span>
                    )}
                    {(sub.id === 'graphic-marrow-report' || sub.id === 'micro-report-manage') && (
                      <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-purple-100 text-purple-700 font-mono">
                        报告
                      </span>
                    )}
                    {sub.id === 'micro-clinical-strain' && (
                      <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-indigo-100 text-indigo-700 font-mono">
                        菌株
                      </span>
                    )}
                    {sub.id === 'report-audit' && (
                      <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-purple-100 text-purple-700 font-mono">
                        待审4
                      </span>
                    )}
                    {sub.id === 'crisis-management' && (
                      <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-100 text-rose-700 font-mono">
                        急查3
                      </span>
                    )}
                    {(sub.id === 'statistics-analysis' || sub.id === 'graphic-statistics-analysis' || sub.id === 'micro-statistics-analysis') && (
                      <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-100 text-amber-700 font-mono">
                        统计
                      </span>
                    )}
                    {(sub.id === 'basic-management' || sub.id === 'graphic-basic-setting' || sub.id === 'micro-basic-setting') && (
                      <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-teal-100 text-teal-800 font-mono">
                        字典
                      </span>
                    )}
                    {sub.id === 'qc-management' && (
                      <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-indigo-100 text-indigo-700 font-mono">
                        质控
                      </span>
                    )}
                    {sub.id === 'spec-ward' && (
                      <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-sky-100 text-sky-700 font-mono">
                        待采
                      </span>
                    )}
                    {sub.id === 'spec-pack' && (
                      <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 text-emerald-700 font-mono">
                        流转
                      </span>
                    )}
                    {sub.id === 'spec-deliver' && (
                      <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-sky-100 text-sky-800 font-mono">
                        送检
                      </span>
                    )}
                    {sub.id === 'spec-receive' && (
                      <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-indigo-100 text-indigo-800 font-mono">
                        签收
                      </span>
                    )}
                    {sub.id === 'dept-device-record' && (
                      <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-sky-100 text-sky-800 font-mono">
                        巡检
                      </span>
                    )}
                    {sub.id === 'dept-staff-schedule' && (
                      <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 text-emerald-800 font-mono">
                        周/月
                      </span>
                    )}
                    {sub.id === 'regional-mapping' && (
                      <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-sky-100 text-sky-800 font-mono">
                        对照
                      </span>
                    )}
                    {sub.id === 'regional-referral-apply' && (
                      <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-blue-100 text-blue-800 font-mono">
                        外送
                      </span>
                    )}
                    {sub.id === 'regional-referral-receive' && (
                      <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 text-emerald-800 font-mono">
                        签收
                      </span>
                    )}
                    {sub.id === 'regional-report-center' && (
                      <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-purple-100 text-purple-800 font-mono">
                        报告
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span className="hidden sm:flex items-center gap-1.5 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {getModuleStatusText()}
            </span>
          </div>
        </div>

        {/* Dynamic Content based on Active Module - Occupies full available workstation viewport */}
        <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
          {renderModuleContent(activeMenu.id, activeSubMenu?.id, triggerAction, user, onSelectSubMenu)}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-6 flex flex-col gap-6">
      {/* Action Notification Toast */}
      {actionNotice && (
        <div className="fixed top-20 right-8 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-lg shadow-lg flex items-center gap-2 text-sm border border-slate-700 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Module Banner (Shown for sub-modules, HomeDashboard has its own integrated doctor status bar) */}
      {activeMenu.id !== 'dashboard-home' && (
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center shrink-0 text-sky-600">
              <MenuIcon name={activeMenu.iconName} className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  {activeMenu.label}
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                  {activeMenu.category || '医疗业务系统'}
                </span>
                {activeMenu.badge && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-medium">
                    待办: {activeMenu.badge}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Sub-menu Quick Switcher Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg overflow-x-auto shrink-0 max-w-full">
            {activeMenu.subItems.map((sub) => {
              const isCurrent = activeSubMenu?.id === sub.id;
              return (
                <button
                  key={sub.id}
                  onClick={() => onSelectSubMenu(sub.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
                    isCurrent
                      ? 'bg-white text-sky-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {sub.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Dynamic Content based on Active Module */}
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
        {renderModuleContent(activeMenu.id, activeSubMenu?.id, triggerAction, user, onSelectSubMenu)}
      </div>
    </div>
  );
};

// Sub-renderers for realistic medical lab interfaces
function renderModuleContent(
  menuId: string,
  subId: string | undefined,
  triggerAction: (msg: string) => void,
  user: UserProfile,
  onSelectSubMenu?: (subId: string) => void
) {
  switch (menuId) {
    case 'dashboard-home':
      return <HomeDashboard user={user} triggerAction={triggerAction} />;
    case 'specimen-pretreatment':
      if (subId === 'spec-receive') {
        return <SpecimenReceiveView user={user} triggerAction={triggerAction} />;
      }
      if (subId === 'spec-deliver') {
        return <SpecimenDeliveryView user={user} triggerAction={triggerAction} />;
      }
      if (subId === 'spec-pack') {
        return <SpecimenPackingView user={user} triggerAction={triggerAction} />;
      }
      if (subId === 'spec-ward') {
        return <WardCollectionView user={user} triggerAction={triggerAction} />;
      }
      if (subId === 'spec-outpatient') {
        return <OutpatientCollectionView user={user} triggerAction={triggerAction} />;
      }
      return <SpecimenReceiveView user={user} triggerAction={triggerAction} />;
    case 'clinical-chem-immuno':
      return <ClinicalChemImmunoView subId={subId} triggerAction={triggerAction} user={user} />;
    case 'graphic-report':
      if (subId === 'graphic-specimen-check-in') {
        return <GraphicSpecimenCheckInView user={user} triggerAction={triggerAction} />;
      }
      if (subId === 'graphic-marrow-workstation') {
        return <BoneMarrowWorkstationView user={user} triggerAction={triggerAction} />;
      }
      if (subId === 'graphic-marrow-report') {
        return <GraphicMarrowReportView user={user} triggerAction={triggerAction} />;
      }
      if (subId === 'graphic-statistics-analysis') {
        return <ClinicalStatisticsView user={user} triggerAction={triggerAction} />;
      }
      if (subId === 'graphic-dict-specimen-type') {
        return <SpecimenTypeDictionaryView user={user} triggerAction={triggerAction} />;
      }
      if (subId === 'graphic-dict-test-apply') {
        return <TestApplyDictionaryView user={user} triggerAction={triggerAction} />;
      }
      if (subId === 'graphic-dict-image-text') {
        return <GraphicImageTextDictView user={user} triggerAction={triggerAction} />;
      }
      if (subId === 'graphic-manage-knowledge-base') {
        return <KnowledgeBaseManagementView user={user} triggerAction={triggerAction} />;
      }
      if (subId === 'graphic-manage-test-rule') {
        return <TestRuleManagementView user={user} triggerAction={triggerAction} />;
      }
      if (subId === 'graphic-manage-report-template') {
        return <GraphicReportTemplateManagementView user={user} triggerAction={triggerAction} />;
      }
      if (subId === 'graphic-third-party-mapping') {
        return <ThirdPartyMappingView user={user} triggerAction={triggerAction} />;
      }
      return <GraphicReportView triggerAction={triggerAction} />;
    case 'microbiology':
      if (subId === 'micro-specimen-check-in') {
        return <MicrobiologySpecimenCheckInView user={user} triggerAction={triggerAction} />;
      }
      if (subId === 'micro-specimen-test') {
        return <MicrobiologySpecimenTestView user={user} triggerAction={triggerAction} />;
      }
      if (subId === 'micro-report-manage') {
        return <MicrobiologyReportManagementView user={user} triggerAction={triggerAction} />;
      }
      if (subId === 'micro-clinical-strain') {
        return <MicrobiologyClinicalStrainView user={user} triggerAction={triggerAction} />;
      }
      if (subId === 'micro-standard-strain') {
        return <MicrobiologyStandardStrainView user={user} triggerAction={triggerAction} />;
      }
      if (subId === 'micro-notification') {
        return <MicrobiologyNotificationView user={user} triggerAction={triggerAction} />;
      }
      if (subId === 'micro-reagent-qc') {
        return <MicrobiologyReagentQcView user={user} triggerAction={triggerAction} />;
      }
      if (subId === 'micro-ast-qc') {
        return <MicrobiologyAstQcView user={user} triggerAction={triggerAction} />;
      }
      if (subId === 'micro-whonet') {
        return <MicrobiologyWhonetView user={user} triggerAction={triggerAction} />;
      }
      if (subId === 'micro-statistics-analysis') {
        return <ClinicalStatisticsView user={user} triggerAction={triggerAction} />;
      }
      if (subId === 'micro-dict-specimen-type') {
        return <SpecimenTypeDictionaryView user={user} triggerAction={triggerAction} />;
      }
      if (subId === 'micro-dict-test-apply') {
        return <TestApplyDictionaryView user={user} triggerAction={triggerAction} />;
      }
      if (subId === 'micro-dict-device-catalog') {
        return <DeviceCatalogDictionaryView user={user} triggerAction={triggerAction} />;
      }
      if (subId === 'micro-manage-knowledge-base') {
        return <MicrobiologyKnowledgeBaseView user={user} triggerAction={triggerAction} />;
      }
      if (subId === 'micro-dict-basic') {
        return <MicrobiologyBasicDictView user={user} triggerAction={triggerAction} />;
      }
      if (subId === 'micro-manage-test-rule') {
        return <MicrobiologyTestRuleView user={user} triggerAction={triggerAction} />;
      }
      if (subId === 'micro-config-process') {
        return <MicrobiologyProcessConfigView user={user} triggerAction={triggerAction} />;
      }
      if (subId === 'micro-manage-report-template') {
        return <MicrobiologyReportTemplateView user={user} triggerAction={triggerAction} />;
      }
      if (subId === 'micro-manage-qc-project') {
        return <MicrobiologyQcProjectView user={user} triggerAction={triggerAction} />;
      }
      if (subId === 'micro-third-party-mapping') {
        return <ThirdPartyMappingView user={user} triggerAction={triggerAction} />;
      }
      return <MicrobiologyView triggerAction={triggerAction} />;
    case 'consumables-management':
      return (
        <ConsumablesManagementView
          subId={subId}
          user={user}
          triggerAction={triggerAction}
          onSelectSubMenu={onSelectSubMenu}
        />
      );
    case 'communication-config':
      return (
        <CommunicationConfigWorkstation
          subId={subId || 'instrument-comm-config'}
          user={user}
          triggerAction={triggerAction}
          onSelectSubMenu={onSelectSubMenu || (() => {})}
        />
      );
    case 'dept-management':
      return (
        <DepartmentManagementView
          subId={subId}
          user={user}
          triggerAction={triggerAction}
          onSelectSubMenu={onSelectSubMenu}
        />
      );
    case 'regional-lab':
      return (
        <RegionalLabWorkstation
          subId={subId || 'regional-mapping'}
          user={user}
          triggerAction={triggerAction}
          onSelectSubMenu={onSelectSubMenu || (() => {})}
        />
      );
    case 'system-settings':
    case 'system-management':
      return (
        <SystemSettingsWorkstation
          subId={subId || 'sys-org'}
          user={user}
          triggerAction={triggerAction}
          onSelectSubMenu={onSelectSubMenu || (() => {})}
        />
      );
    default:
      return <SystemManagementView triggerAction={triggerAction} />;
  }
}

// 0. 首页：全院医疗管控综合运营总览看板
const DashboardHomeView: React.FC<{ triggerAction: (msg: string) => void }> = ({
  triggerAction,
}) => {
  return (
    <div className="space-y-6">
      {/* 4 Core KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>今日标本签收总数</span>
            <Activity className="w-4 h-4 text-sky-500" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono tabular-nums text-slate-900">
            1,482 <span className="text-xs font-normal text-slate-500">管</span>
          </div>
          <div className="mt-1 text-xs text-emerald-600 flex items-center gap-1 font-medium">
            <span>较昨日同期 +8.4%</span>
            <span className="text-slate-400 font-normal">· 流水线畅通</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>智能自动审核通过率</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono tabular-nums text-slate-900">
            92.4<span className="text-sm font-normal text-slate-500">%</span>
          </div>
          <div className="mt-1 text-xs text-slate-500">
            规则通过 <span className="font-mono text-emerald-600 font-medium">1,369</span> 份 · 人工复核 113 份
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>急诊标本平均TAT</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono tabular-nums text-slate-900">
            8.2 <span className="text-xs font-normal text-slate-500">分钟</span>
          </div>
          <div className="mt-1 text-xs text-emerald-600 font-medium">
            达标率 99.4% (质控目标 ≤15min)
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>全科室质控在控率</span>
            <ShieldCheck className="w-4 h-4 text-sky-500" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono tabular-nums text-slate-900">
            99.8<span className="text-sm font-normal text-slate-500">%</span>
          </div>
          <div className="mt-1 text-xs text-slate-500">
            184项日常质控 · 0项失控漂移
          </div>
        </div>
      </div>

      {/* Urgent Warning Strip */}
      <div className="bg-gradient-to-r from-rose-50 via-amber-50 to-sky-50 border border-rose-200/80 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-rose-600 text-white flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 animate-bounce" />
          </div>
          <div>
            <div className="font-semibold text-rose-950 text-sm flex items-center gap-2">
              <span>医疗安全态势提醒</span>
              <span className="text-[11px] px-2 py-0.2 rounded-full bg-rose-600 text-white font-mono">
                3 条急查危急值待闭环
              </span>
            </div>
            <div className="text-xs text-slate-600 mt-0.5">
              心内科 43床(高敏肌钙蛋白I) · 急诊ICU 12床(动脉血钾 2.4mmol/L) · 妇产科(D-二聚体异常)
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => triggerAction('已调出危急值实时跟进工作台')}
            className="px-3 py-1.5 text-xs font-semibold bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors shadow-xs"
          >
            一键处置危急值
          </button>
          <button
            onClick={() => triggerAction('全院检验设备心跳轮询完成，各节点通信正常')}
            className="px-3 py-1.5 text-xs font-medium border border-slate-300 bg-white text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
          >
            刷新大屏状态
          </button>
        </div>
      </div>

      {/* Lab Instrument Pipelines & Status Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Track Line 1 */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="font-semibold text-slate-800 text-xs">自动化生化免疫流水线 (A线)</span>
            </div>
            <span className="text-[11px] text-emerald-600 font-medium">高速运行中</span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>联机设备</span>
              <span className="font-medium text-slate-800">Roche Cobas 8000 (c702 + e801)</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>今日处理标本</span>
              <span className="font-mono font-medium text-slate-900">842 管</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>试剂余量预警</span>
              <span className="text-emerald-600 font-medium">正常 (均大于300测试)</span>
            </div>
          </div>
        </div>

        {/* Track Line 2 */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="font-semibold text-slate-800 text-xs">血细胞分析全自动轨道 (B线)</span>
            </div>
            <span className="text-[11px] text-emerald-600 font-medium">联机正常</span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>联机设备</span>
              <span className="font-medium text-slate-800">Sysmex XN-9000 (4模块 + SP-10推片)</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>自动推片染片</span>
              <span className="font-mono font-medium text-slate-900">46 片 (待镜检复核)</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>血球急查TAT</span>
              <span className="font-mono font-medium text-slate-900">5.4 分钟</span>
            </div>
          </div>
        </div>

        {/* Track Line 3 */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-sky-500" />
              <span className="font-semibold text-slate-800 text-xs">医联体区域检验互通枢纽</span>
            </div>
            <span className="text-[11px] text-sky-600 font-medium">14家机构在线</span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>下级医院外送标本</span>
              <span className="font-mono font-medium text-slate-900">64 管 (冷链在途)</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>区域检验互认率</span>
              <span className="font-mono font-medium text-slate-900">96.8%</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>远程疑难微会诊</span>
              <span className="text-amber-600 font-medium">2 份等待主管医师初审</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Navigation Shortcuts */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
        <h3 className="font-semibold text-slate-800 text-xs mb-3">系统功能快捷入口</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div
            onClick={() => triggerAction('已打开标本签收与分选队列')}
            className="p-3 rounded-lg border border-slate-200 hover:border-sky-300 hover:bg-sky-50/50 cursor-pointer transition-all"
          >
            <div className="font-medium text-slate-900">标本接收签收</div>
            <span className="text-slate-400 text-[11px] mt-0.5 block">18管待前处理签收</span>
          </div>
          <div
            onClick={() => triggerAction('已进入生化常规批量审核界面')}
            className="p-3 rounded-lg border border-slate-200 hover:border-sky-300 hover:bg-sky-50/50 cursor-pointer transition-all"
          >
            <div className="font-medium text-slate-900">生化常规批审</div>
            <span className="text-slate-400 text-[11px] mt-0.5 block">一键合规审核放行</span>
          </div>
          <div
            onClick={() => triggerAction('已调取骨髓形态学图文审签')}
            className="p-3 rounded-lg border border-slate-200 hover:border-sky-300 hover:bg-sky-50/50 cursor-pointer transition-all"
          >
            <div className="font-medium text-slate-900">图文报告审签</div>
            <span className="text-slate-400 text-[11px] mt-0.5 block">8份显微图文待审</span>
          </div>
          <div
            onClick={() => triggerAction('已跳转到试剂耗材临期预警看板')}
            className="p-3 rounded-lg border border-slate-200 hover:border-sky-300 hover:bg-sky-50/50 cursor-pointer transition-all"
          >
            <div className="font-medium text-slate-900">耗材效期预警</div>
            <span className="text-amber-600 text-[11px] mt-0.5 block font-medium">4批试剂临期排查</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// 1. 标本前处理工作台
const SpecimenPretreatmentView: React.FC<{ triggerAction: (msg: string) => void }> = ({
  triggerAction,
}) => {
  const [samples, setSamples] = useState([
    { id: '202610150012', patient: '李振华', age: '54岁', gender: '男', test: '肝功能十一项', tube: '干燥管(红)', time: '10:15', status: '待离心', priority: '常规' },
    { id: '202610150013', patient: '王秀兰', age: '67岁', gender: '女', test: '心肌酶谱四项+肌钙蛋白', tube: '肝素管(绿)', time: '10:18', status: '轨道分选中', priority: '急诊' },
    { id: '202610150014', patient: '陈天宇', age: '32岁', gender: '男', test: '乙肝五项定量', tube: '凝胶管(黄)', time: '10:22', status: '异常脂血拦截', priority: '常规' },
    { id: '202610150015', patient: '孙志强', age: '48岁', gender: '男', test: '肾功能+电解质', tube: '干燥管(红)', time: '10:25', status: '已签收待分选', priority: '常规' },
    { id: '202610150016', patient: '赵敏', age: '29岁', gender: '女', test: 'D-二聚体+凝血六项', tube: '枸橼酸钠(蓝)', time: '10:30', status: '自动化脱帽中', priority: '急诊' },
  ]);

  return (
    <div className="space-y-6">
      {/* 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>今日已签收标本</span>
            <Clock className="w-4 h-4 text-sky-500" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono tabular-nums text-slate-900">
            1,482 <span className="text-xs font-normal text-slate-500">管</span>
          </div>
          <div className="mt-1 text-xs text-emerald-600 flex items-center gap-1">
            <span>较昨日同期 +8.4%</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>自动化轨道上机</span>
            <Activity className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono tabular-nums text-slate-900">
            1,328 <span className="text-xs font-normal text-slate-500">管 (89.6%)</span>
          </div>
          <div className="mt-1 text-xs text-slate-500">3条高速流水线运转平稳</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>标本异常拦截</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono tabular-nums text-amber-600">
            6 <span className="text-xs font-normal text-slate-500">管 (溶血/凝血/脂血)</span>
          </div>
          <div className="mt-1 text-xs text-slate-500">需人工重抽确认</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>急诊前处理TAT</span>
            <Clock className="w-4 h-4 text-sky-500" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono tabular-nums text-slate-900">
            8.2 <span className="text-xs font-normal text-slate-500">分钟</span>
          </div>
          <div className="mt-1 text-xs text-emerald-600">达标率 99.4% (目标 ≤15min)</div>
        </div>
      </div>

      {/* Specimen Management Table Card */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-slate-900 text-sm">标本流转与前处理队列</h2>
            <span className="text-xs text-slate-400 font-mono">共 5 批次监控中</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => triggerAction('已开启扫码枪连通接收模式，请扫描试管条码')}
              className="px-3 py-1.5 text-xs font-medium bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors flex items-center gap-1.5"
            >
              <FlaskConical className="w-3.5 h-3.5" />
              <span>条码批量扫码签收</span>
            </button>
            <button
              onClick={() => triggerAction('急诊绿色通道轨道优先级已提升')}
              className="px-3 py-1.5 text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors"
            >
              急诊优先提速
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">条形码号</th>
                <th className="px-4 py-3">患者信息</th>
                <th className="px-4 py-3">检验组合项目</th>
                <th className="px-4 py-3">试管类型</th>
                <th className="px-4 py-3">采样送达</th>
                <th className="px-4 py-3">当前前处理状态</th>
                <th className="px-4 py-3 text-right">操作动作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {samples.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-3 font-mono font-medium text-slate-800">{s.id}</td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-slate-900">{s.patient}</span>
                    <span className="text-slate-400 ml-1.5">
                      {s.gender} · {s.age}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-700 font-medium">{s.test}</td>
                  <td className="px-4 py-3 text-slate-600">{s.tube}</td>
                  <td className="px-4 py-3 font-mono text-slate-500">{s.time}</td>
                  <td className="px-4 py-3">
                    {s.status.includes('异常') ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] bg-rose-50 text-rose-700 font-medium border border-rose-200">
                        <AlertTriangle className="w-3 h-3" />
                        {s.status}
                      </span>
                    ) : s.status.includes('急诊') || s.priority === '急诊' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] bg-amber-50 text-amber-700 font-medium border border-amber-200">
                        <Clock className="w-3 h-3" />
                        {s.status}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] bg-slate-100 text-slate-700 font-medium">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                        {s.status}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => triggerAction(`标本 ${s.id} (${s.patient}) 已派送至上机轨道`)}
                      className="text-sky-600 hover:text-sky-800 font-medium mr-2"
                    >
                      调度上机
                    </button>
                    <button
                      onClick={() => triggerAction(`标本 ${s.id} 详细流转轨迹已展开`)}
                      className="text-slate-500 hover:text-slate-800"
                    >
                      轨迹追踪
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};



// 3. 图文报告系统工作台
const GraphicReportView: React.FC<{ triggerAction: (msg: string) => void }> = ({
  triggerAction,
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="aspect-video bg-slate-900 rounded-lg flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-sky-950 via-slate-900 to-indigo-950 opacity-90" />
            <div className="relative text-center p-3">
              <span className="text-xs font-mono text-sky-400 block mb-1">MICROSCOPY #100X</span>
              <p className="text-xs text-white font-medium">骨髓穿刺染色细胞形态学</p>
              <span className="text-[10px] text-slate-400 mt-1 block">瑞氏-姬姆萨染色 · 有核细胞增生活跃</span>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-900">赵*华 (门诊 42岁)</div>
              <span className="text-[11px] text-slate-400 font-mono">报告号: MAR-20261015-08</span>
            </div>
            <button
              onClick={() => triggerAction('已打开骨髓细胞高清读图审签工作站')}
              className="text-xs text-sky-600 hover:text-sky-800 font-medium"
            >
              审签报告
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="aspect-video bg-slate-900 rounded-lg flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-blue-950 to-slate-900 opacity-90" />
            <div className="relative text-center p-3">
              <span className="text-xs font-mono text-emerald-400 block mb-1">AUTO SEDIMENT #40X</span>
              <p className="text-xs text-white font-medium">尿有形成分全自动镜检</p>
              <span className="text-[10px] text-slate-400 mt-1 block">草酸钙结晶 ++ · 红细胞未见异常</span>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-900">王*峰 (住院 58岁)</div>
              <span className="text-[11px] text-slate-400 font-mono">报告号: URI-20261015-22</span>
            </div>
            <button
              onClick={() => triggerAction('尿沉渣图文已通过双签并自动推送到HIS')}
              className="text-xs text-sky-600 hover:text-sky-800 font-medium"
            >
              一键签发
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="aspect-video bg-slate-900 rounded-lg flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-950 via-slate-900 to-slate-950 opacity-90" />
            <div className="relative text-center p-3">
              <span className="text-xs font-mono text-purple-400 block mb-1">BLOOD SMEAR #100X</span>
              <p className="text-xs text-white font-medium">外周血涂片形态学复检</p>
              <span className="text-[10px] text-slate-400 mt-1 block">异型淋巴细胞 6% · 嗜酸粒细胞增高</span>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-900">林*杰 (急诊 12岁)</div>
              <span className="text-[11px] text-slate-400 font-mono">报告号: BLD-20261015-03</span>
            </div>
            <button
              onClick={() => triggerAction('外周血涂片复检结论已录入')}
              className="text-xs text-sky-600 hover:text-sky-800 font-medium"
            >
              录入诊断
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// 4. 微生物系统
const MicrobiologyView: React.FC<{ triggerAction: (msg: string) => void }> = ({
  triggerAction,
}) => (
  <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-sm font-semibold text-slate-900">细菌质谱鉴定与药敏试验 (AST)</h3>
        <p className="text-xs text-slate-500">MALDI-TOF质谱直检已识别 3 株目标菌种</p>
      </div>
      <button
        onClick={() => triggerAction('院感科多重耐药菌监控专报已同步')}
        className="px-3 py-1.5 text-xs bg-rose-600 text-white rounded-lg hover:bg-rose-700"
      >
        多重耐药(MDRO)预警上报
      </button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
      <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
        <span className="font-semibold text-slate-800">金黄色葡萄球菌 (MRSA)</span>
        <div className="mt-1 text-slate-500">标本来源：ICU 痰培养 · 苯唑西林耐药</div>
        <div className="mt-2 text-rose-600 font-medium">万古霉素 MIC ≤ 1.0 (敏感)</div>
      </div>
      <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
        <span className="font-semibold text-slate-800">肺炎克雷伯菌 (CRE)</span>
        <div className="mt-1 text-slate-500">标本来源：呼吸科 支气管冲洗液</div>
        <div className="mt-2 text-rose-600 font-medium">产碳青霉烯酶株 · 密切隔离监护</div>
      </div>
      <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
        <span className="font-semibold text-slate-800">大肠埃希菌 (ESBLs+)</span>
        <div className="mt-1 text-slate-500">标本来源：泌尿外科 中段尿</div>
        <div className="mt-2 text-emerald-600 font-medium">阿米卡星/呋喃妥因 (敏感)</div>
      </div>
    </div>
  </div>
);

// 5. 耗材管理系统
const ConsumablesView: React.FC<{ triggerAction: (msg: string) => void }> = ({
  triggerAction,
}) => (
  <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-sm font-semibold text-slate-900">核心检验试剂余量与效期监控</h3>
        <p className="text-xs text-slate-500">当前监控试剂耗材 184 种，智能计算剩余测试人份</p>
      </div>
      <button
        onClick={() => triggerAction('已生成科室周试剂领用申购清单')}
        className="px-3 py-1.5 text-xs bg-sky-600 text-white rounded-lg hover:bg-sky-700"
      >
        发起领料审批
      </button>
    </div>
    <div className="divide-y divide-slate-100 text-xs">
      <div className="py-2.5 flex items-center justify-between">
        <div>
          <span className="font-semibold text-slate-800">罗氏 Cobas c702 丙氨酸氨基转移酶(ALT) 试剂盒</span>
          <span className="text-slate-400 ml-2">批号：20260408 · 效期至 2027-03-31</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-emerald-600">余量: 1,840测试 (充足)</span>
        </div>
      </div>
      <div className="py-2.5 flex items-center justify-between">
        <div>
          <span className="font-semibold text-slate-800">雅培 Alinity i 高敏肌钙蛋白I (hs-cTnI) 试剂盒</span>
          <span className="text-rose-600 ml-2 font-medium">批号：20260215 · 临期30天内预警</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-amber-600">余量: 120测试 (建议补单)</span>
        </div>
      </div>
      <div className="py-2.5 flex items-center justify-between">
        <div>
          <span className="font-semibold text-slate-800">希森美康 XN-9000 稀释液 CELLPACK DCL (20L)</span>
          <span className="text-slate-400 ml-2">批号：20260512 · 效期正常</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-emerald-600">余量: 14箱 (正常消耗)</span>
        </div>
      </div>
    </div>
  </div>
);



// 7. 区域检验平台
const RegionalLabView: React.FC<{ triggerAction: (msg: string) => void }> = ({
  triggerAction,
}) => (
  <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-sm font-semibold text-slate-900">医联体分级检验协同与外送流转</h3>
        <p className="text-xs text-slate-500">已互联 14 家社区卫生服务中心与二级合作医院</p>
      </div>
      <button
        onClick={() => triggerAction('区域冷链物流实时GPS轨迹已拉取')}
        className="px-3 py-1.5 text-xs bg-sky-600 text-white rounded-lg hover:bg-sky-700"
      >
        冷链物流追踪
      </button>
    </div>
    <div className="divide-y divide-slate-100 text-xs">
      <div className="py-2.5 flex items-center justify-between">
        <div>
          <span className="font-semibold text-slate-800">城东社区卫生服务中心</span>
          <span className="text-slate-400 ml-2">今日外送 26 管 · 接收完成率 100%</span>
        </div>
        <span className="text-emerald-600 font-medium">结果互认生效中</span>
      </div>
      <div className="py-2.5 flex items-center justify-between">
        <div>
          <span className="font-semibold text-slate-800">滨江街道社区卫生服务中心</span>
          <span className="text-slate-400 ml-2">冷链箱在途 · 预计15分钟后到达</span>
        </div>
        <span className="text-sky-600 font-medium font-mono">冷链温控 4.2℃ (正常)</span>
      </div>
    </div>
  </div>
);

// 8. 通信配置
const CommunicationConfigView: React.FC<{ triggerAction: (msg: string) => void }> = ({
  triggerAction,
}) => (
  <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-sm font-semibold text-slate-900">检验仪器双向联机与网关通信服务</h3>
        <p className="text-xs text-slate-500">HL7 / ASTM 协议网关服务在线率 99.98%</p>
      </div>
      <button
        onClick={() => triggerAction('仪器通信报文诊断测试通过，延时 1.8ms')}
        className="px-3 py-1.5 text-xs bg-slate-900 text-white rounded-lg hover:bg-slate-800 flex items-center gap-1.5"
      >
        <RefreshCw className="w-3.5 h-3.5" />
        <span>通信链路测速</span>
      </button>
    </div>
    <div className="bg-slate-900 rounded-lg p-3 text-xs font-mono text-emerald-400 overflow-x-auto space-y-1">
      <div>[10:35:12.402] [GATEWAY-01] CONNECTED: Cobas_8000_Line_A (192.168.10.42:5000)</div>
      <div>[10:35:12.418] [ASTM-MSG] MSH|^~\&amp;|Cobas8000|Roche|LIS|CentralHospital|20261015103512||ORU^R01|MSG009842|P|2.3.1</div>
      <div>[10:35:12.425] [AUTO-ACK] ACK^R01|MSG009842|AA|Success</div>
      <div className="text-slate-400">[10:35:13.001] Heartbeat ACK received from HIS_MIDDLEWARE_CLUSTER (latency 2ms)</div>
    </div>
  </div>
);

// 9. 系统管理
const SystemManagementView: React.FC<{ triggerAction: (msg: string) => void }> = ({
  triggerAction,
}) => (
  <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-sm font-semibold text-slate-900">系统全局参数与用户角色安全审计</h3>
        <p className="text-xs text-slate-500">支持基于RBAC的检验报告审签三级权限隔离</p>
      </div>
      <button
        onClick={() => triggerAction('系统安全审计日志已导出归档')}
        className="px-3 py-1.5 text-xs bg-sky-600 text-white rounded-lg hover:bg-sky-700"
      >
        导出审计日志
      </button>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
        <span className="text-slate-500">系统已注册医师</span>
        <div className="text-xl font-bold font-mono text-slate-900 mt-1">128 位</div>
      </div>
      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
        <span className="text-slate-500">数字CA签名校验</span>
        <div className="text-xl font-bold font-mono text-emerald-600 mt-1">已强制启用</div>
      </div>
      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
        <span className="text-slate-500">数据库快照备份</span>
        <div className="text-xl font-bold font-mono text-slate-900 mt-1">每 15 分钟</div>
      </div>
    </div>
  </div>
);
