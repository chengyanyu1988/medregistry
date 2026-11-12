import React, { useState } from 'react';
import {
  AlertTriangle,
  Clock,
  CheckCircle2,
  Search,
  Filter,
  RefreshCw,
  Folder,
  FolderOpen,
  Table2,
  Activity,
  Check,
  Building2,
  User,
  Sliders,
  ShieldCheck,
  ChevronRight,
  FileText,
  TrendingUp,
  Settings,
  HelpCircle,
  ExternalLink,
  Layers,
  Sparkles,
  PhoneCall,
  CalendarCheck,
  FileCheck,
  Printer
} from './MenuIcon';
import { UserProfile } from '../types/navigation';
import { SpecimenCheckInWorkstation } from './SpecimenCheckInWorkstation';
import { ClinicalLabWorkstationView } from './ClinicalLabWorkstationView';
import { ClinicalReportAuditView } from './ClinicalReportAuditView';
import { CrisisValueManagementView } from './CrisisValueManagementView';
import { ClinicalStatisticsView } from './ClinicalStatisticsView';
import { QualityControlManagementView } from './QualityControlManagementView';
import { QcMaterialManagementView } from './QcMaterialManagementView';
import { QcRuleSettingView } from './QcRuleSettingView';
import { SpecimenTypeDictionaryView } from './SpecimenTypeDictionaryView';
import { TubeTypeDictionaryView } from './TubeTypeDictionaryView';
import { DeviceCatalogDictionaryView } from './DeviceCatalogDictionaryView';
import { TestItemDictionaryView } from './TestItemDictionaryView';
import { TestApplyDictionaryView } from './TestApplyDictionaryView';
import { OperationDictionaryView } from './OperationDictionaryView';
import { TestUnitManagementView } from './TestUnitManagementView';
import { TestRuleManagementView } from './TestRuleManagementView';
import { TestInstrumentConfigView } from './TestInstrumentConfigView';
import { ReportTemplateManagementView } from './ReportTemplateManagementView';
import { KnowledgeBaseManagementView } from './KnowledgeBaseManagementView';
import { ThirdPartyMappingView } from './ThirdPartyMappingView';

interface ClinicalChemImmunoViewProps {
  subId?: string | null;
  triggerAction: (msg: string) => void;
  user: UserProfile;
}

export const ClinicalChemImmunoView: React.FC<ClinicalChemImmunoViewProps> = ({
  subId = 'specimen-check-in',
  triggerAction,
  user,
}) => {
  // Current active sub-tab (fallback to subId or default to 'specimen-check-in')
  const currentTab = subId || 'specimen-check-in';

  // Local QC view switcher: 'routine' (质控管理/质控数据/质控图) vs 'materials' (质控物管理) vs 'rules' (质控规则设置)
  const [qcViewMode, setQcViewMode] = useState<'routine' | 'materials' | 'rules'>(
    subId === 'qc-materials'
      ? 'materials'
      : subId === 'qc-rule-settings'
      ? 'rules'
      : 'routine'
  );

  // Search term for fallback views
  const [searchTerm, setSearchTerm] = useState('');

  // Dedicated High-Fidelity Workstation for 标本核收 (matching user screenshot)
  if (currentTab === 'specimen-check-in') {
    return <SpecimenCheckInWorkstation user={user} triggerAction={triggerAction} />;
  }

  // Dedicated High-Fidelity Workstation for 检验工作站 (matching user screenshot)
  if (currentTab === 'tech-workstation') {
    return <ClinicalLabWorkstationView user={user} triggerAction={triggerAction} />;
  }

  // Dedicated High-Fidelity Workstation for 报告审核 (matching user screenshot)
  if (currentTab === 'report-audit') {
    return <ClinicalReportAuditView user={user} triggerAction={triggerAction} />;
  }

  // Dedicated High-Fidelity Workstation for 危急值管理 (matching user screenshot)
  if (currentTab === 'crisis-management') {
    return <CrisisValueManagementView user={user} triggerAction={triggerAction} />;
  }

  // Dedicated High-Fidelity Workstation for 统计分析 (matching user screenshot)
  if (currentTab === 'statistics-analysis' || currentTab === 'test-timeline') {
    return <ClinicalStatisticsView user={user} triggerAction={triggerAction} />;
  }

  // Dedicated High-Fidelity Workstation for 检验单元管理 (matching user screenshot image_e3168896.png)
  if (currentTab === 'manage-test-unit') {
    return (
      <TestUnitManagementView
        user={user}
        triggerAction={triggerAction}
      />
    );
  }

  // Dedicated High-Fidelity Workstation for 检验规则管理 (matching user screenshot image_ab04c1ae.png)
  if (currentTab === 'manage-test-rule') {
    return (
      <TestRuleManagementView
        user={user}
        triggerAction={triggerAction}
      />
    );
  }

  // Dedicated High-Fidelity Workstation for 检验仪器配置 (matching user screenshot image_4040ac3f.png)
  if (currentTab === 'config-test-instrument') {
    return (
      <TestInstrumentConfigView
        user={user}
        triggerAction={triggerAction}
      />
    );
  }

  // Dedicated High-Fidelity Workstation for 报告模板管理 (matching user screenshot image_05832350.png)
  if (currentTab === 'manage-report-template') {
    return (
      <ReportTemplateManagementView
        user={user}
        triggerAction={triggerAction}
      />
    );
  }

  // Dedicated High-Fidelity Workstation for 知识库管理 (matching user screenshot image_b6b495b4.png)
  if (currentTab === 'manage-knowledge-base') {
    return (
      <KnowledgeBaseManagementView
        user={user}
        triggerAction={triggerAction}
      />
    );
  }

  // Dedicated High-Fidelity Workstation for 三方系统对照 (matching user screenshot image_a3ecce42.png)
  if (currentTab === 'third-party-mapping') {
    return (
      <ThirdPartyMappingView
        user={user}
        triggerAction={triggerAction}
      />
    );
  }

  // Dedicated High-Fidelity Workstation for 操作字典管理 (matching user screenshot image_53b626bb.png)
  if (currentTab === 'dict-operation') {
    return (
      <OperationDictionaryView
        user={user}
        triggerAction={triggerAction}
      />
    );
  }

  // Dedicated High-Fidelity Workstation for 检验申请字典 (matching user screenshot image_df1f50bf.png)
  if (currentTab === 'dict-test-apply') {
    return (
      <TestApplyDictionaryView
        user={user}
        triggerAction={triggerAction}
      />
    );
  }

  // Dedicated High-Fidelity Workstation for 检验项目字典 (matching user screenshot)
  if (currentTab === 'dict-test-item') {
    return (
      <TestItemDictionaryView
        user={user}
        triggerAction={triggerAction}
      />
    );
  }

  // Dedicated High-Fidelity Workstation for 设备目录字典 (matching user screenshot image_12be68a7.png)
  if (currentTab === 'dict-device-catalog') {
    return (
      <DeviceCatalogDictionaryView
        user={user}
        triggerAction={triggerAction}
      />
    );
  }

  // Dedicated High-Fidelity Workstation for 试管类型字典 (matching user screenshot)
  if (currentTab === 'dict-tube-type') {
    return (
      <TubeTypeDictionaryView
        user={user}
        triggerAction={triggerAction}
      />
    );
  }

  // Dedicated High-Fidelity Workstation for 标本类型字典 (matching user screenshot image_56fd4cec.png)
  if (currentTab === 'dict-specimen-type' || currentTab === 'basic-management') {
    return (
      <SpecimenTypeDictionaryView
        user={user}
        triggerAction={triggerAction}
      />
    );
  }

  // Dedicated High-Fidelity Workstation for 质控规则设置 (matching user screenshot image_35906ae1.png)
  if (
    currentTab === 'qc-rule-settings' ||
    (currentTab === 'qc-management' && qcViewMode === 'rules')
  ) {
    return (
      <QcRuleSettingView
        user={user}
        triggerAction={triggerAction}
        onNavigateToRoutineQc={() => setQcViewMode('routine')}
        onNavigateToMaterials={() => setQcViewMode('materials')}
      />
    );
  }

  // Dedicated High-Fidelity Workstation for 质控物管理 (matching user screenshot image_f3a85555.png)
  if (
    currentTab === 'qc-materials' ||
    (currentTab === 'qc-management' && qcViewMode === 'materials')
  ) {
    return (
      <QcMaterialManagementView
        user={user}
        triggerAction={triggerAction}
        onNavigateToRoutineQc={() => setQcViewMode('routine')}
        onNavigateToRuleSettings={() => setQcViewMode('rules')}
      />
    );
  }

  // Dedicated High-Fidelity Workstation for 质控管理 (matching user screenshot)
  if (
    currentTab === 'qc-routine-management' ||
    currentTab === 'qc-management'
  ) {
    if (qcViewMode === 'materials') {
      return (
        <QcMaterialManagementView
          user={user}
          triggerAction={triggerAction}
          onNavigateToRoutineQc={() => setQcViewMode('routine')}
          onNavigateToRuleSettings={() => setQcViewMode('rules')}
        />
      );
    }
    if (qcViewMode === 'rules') {
      return (
        <QcRuleSettingView
          user={user}
          triggerAction={triggerAction}
          onNavigateToRoutineQc={() => setQcViewMode('routine')}
          onNavigateToMaterials={() => setQcViewMode('materials')}
        />
      );
    }
    return (
      <QualityControlManagementView
        user={user}
        triggerAction={triggerAction}
        onNavigateToMaterials={() => setQcViewMode('materials')}
        onNavigateToRuleSettings={() => setQcViewMode('rules')}
      />
    );
  }

  // 1. 基础字典定义数据
  const specimenTypes = [
    { code: 'SER', name: '血清', container: '黄头管(促凝胶SST)', desc: '用于肝功、肾功、电解质、心肌标志物、激素免疫检测' },
    { code: 'WB', name: '全血', container: '紫头管(EDTA-K2)', desc: '用于全血细胞五分类、糖化血红蛋白HbA1c' },
    { code: 'PLA', name: '血浆', container: '绿头管(肝素锂)', desc: '用于急诊急查生化离子、血氨、心肌酶谱' },
    { code: 'CIT', name: '血浆(枸橼酸)', container: '蓝头管(枸橼酸钠 1:9)', desc: '用于凝血常规四项、D-二聚体、血凝抑制因子' },
    { code: 'URI', name: '随机尿液', container: '洁净尿管 (10ml)', desc: '用于尿液干化学、尿沉渣微量白蛋白分析' },
    { code: 'CSF', name: '脑脊液', container: '无菌干燥管 (3管)', desc: '用于脑脊液生化全套(CSF-PRO/GLU/CL)' },
  ];

  const tubeTypes = [
    { code: 'TUBE-YEL', color: '黄盖', spec: '促凝胶管 4.0ml', capColor: 'bg-amber-400', usage: '生化免疫常规项目' },
    { code: 'TUBE-PUR', color: '紫盖', spec: 'EDTA-K2抗凝管 2.0ml', capColor: 'bg-purple-600', usage: '全血常规、糖化' },
    { code: 'TUBE-BLU', color: '蓝盖', spec: '枸橼酸钠管 2.7ml', capColor: 'bg-sky-500', usage: '凝血因子、D-二聚体' },
    { code: 'TUBE-GRE', color: '绿盖', spec: '肝素锂管 3.0ml', capColor: 'bg-emerald-500', usage: '急诊急查生化' },
    { code: 'TUBE-RED', color: '红盖', spec: '普通干燥管 4.0ml', capColor: 'bg-rose-500', usage: '血清免疫、配血' },
  ];

  const deviceCatalogs = [
    { id: 'DEV-01', name: '罗氏 Cobas 8000 (c702+e801)', ip: '192.168.10.42:5000', status: '运行中', speed: '3600测定/小时', loc: '生化免疫流水线A轨' },
    { id: 'DEV-02', name: '雅培 Alinity ci 整合系统', ip: '192.168.10.45:5000', status: '运行中', speed: '1800测定/小时', loc: '急诊急查工位' },
    { id: 'DEV-03', name: '贝克曼 AU5800 全自动生化分析仪', ip: '192.168.10.48:5000', status: '温控恒定', speed: '2000测定/小时', loc: '门诊生化2号组' },
    { id: 'DEV-04', name: '沃芬 ACL TOP 700 全自动凝血仪', ip: '192.168.10.51:5000', status: '在机排队', speed: '300测定/小时', loc: '血凝急查工位' },
  ];

  const testItemDictionary = [
    { code: 'ALT', name: '丙氨酸氨基转移酶', unit: 'U/L', ref: '9.0 - 50.0', group: '肝脏功能', price: '¥ 12.00' },
    { code: 'AST', name: '天门冬氨酸氨基转移酶', unit: 'U/L', ref: '15.0 - 40.0', group: '肝脏功能', price: '¥ 12.00' },
    { code: 'TBIL', name: '总胆红素', unit: 'μmol/L', ref: '3.4 - 20.5', group: '肝脏功能', price: '¥ 10.00' },
    { code: 'CREA', name: '肌酐 (酶法)', unit: 'μmol/L', ref: '53.0 - 106.0', group: '肾脏功能', price: '¥ 14.00' },
    { code: 'UREA', name: '尿素氮', unit: 'mmol/L', ref: '2.8 - 7.2', group: '肾脏功能', price: '¥ 10.00' },
    { code: 'GLU', name: '空腹血糖 (己糖激酶法)', unit: 'mmol/L', ref: '3.90 - 6.10', group: '糖代谢', price: '¥ 8.00' },
    { code: 'hs-cTnI', name: '高敏肌钙蛋白I', unit: 'ng/mL', ref: '0.00 - 0.04', group: '急诊心肌标志物', price: '¥ 85.00' },
    { code: 'CK-MB', name: '肌酸激酶同工酶质量法', unit: 'ng/mL', ref: '0.0 - 5.0', group: '急诊心肌标志物', price: '¥ 45.00' },
  ];

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-slate-50 overflow-hidden">
      {/* Top Banner Navigation & Breadcrumb for 临生免系统 */}
      <div className="bg-white border-b border-slate-200 px-5 py-3 flex items-center justify-between shrink-0 shadow-2xs">
        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-slate-800">临生免系统</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-sky-700 font-medium">
            {currentTab === 'specimen-check-in' && '标本核收工作台'}
            {currentTab === 'tech-workstation' && '技师工作站 (分析仪联机监控)'}
            {currentTab === 'report-audit' && '报告审核与自动初筛'}
            {currentTab === 'test-timeline' && '检验全流程TAT时间轴'}
            {currentTab === 'crisis-management' && '危急值警报与闭环管理'}
            {currentTab.startsWith('dict-') && '基础管理 · 字典配置'}
            {currentTab.startsWith('manage-') && '基础管理 · 业务模型'}
            {currentTab === 'config-test-instrument' && '基础管理 · 仪器配置'}
            {currentTab === 'third-party-mapping' && '基础管理 · 三方对照'}
            {currentTab.startsWith('qc-') && '质控管理 · 质控体系'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-500 font-mono">
            操作员: {user.name} ({user.role})
          </span>
          <button
            onClick={() => triggerAction('已刷新临生免仪器双向通讯缓存')}
            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded"
            title="刷新"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Workspace Body based on Active Menu */}
      <div className="flex-1 min-h-0 overflow-y-auto p-5 space-y-5">
        
        {/* ================= 1. 标本核收 (specimen-check-in) ================= */}
        {currentTab === 'specimen-check-in' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-900 text-sm">生化免疫标本上机前核收</h3>
                <p className="text-xs text-slate-500 mt-0.5">扫码核收后标本将直接注入 Cobas 8000 自动化高速离心与分选轨道</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => triggerAction('已批量核收当前 18 份待上机标本')}
                  className="px-3.5 py-1.5 text-xs font-semibold bg-sky-600 text-white rounded-lg hover:bg-sky-700 shadow-xs"
                >
                  一键全量核收
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">条码号</th>
                    <th className="px-4 py-3">患者姓名</th>
                    <th className="px-4 py-3">检验组合</th>
                    <th className="px-4 py-3">采血管规格</th>
                    <th className="px-4 py-3">送达时间</th>
                    <th className="px-4 py-3">核收状态</th>
                    <th className="px-4 py-3 text-right">核收调度</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  <tr className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-semibold text-sky-700">0011812170001</td>
                    <td className="px-4 py-3 font-sans text-slate-900 font-medium">张振华 (54岁/男)</td>
                    <td className="px-4 py-3 font-sans text-slate-700">生化肝功能十一项</td>
                    <td className="px-4 py-3 font-sans text-slate-600">黄盖促凝胶管 4.0ml</td>
                    <td className="px-4 py-3 text-slate-500">2026-10-26 08:24</td>
                    <td className="px-4 py-3 font-sans text-emerald-600 font-medium">已核收·进样中</td>
                    <td className="px-4 py-3 text-right font-sans">
                      <span className="text-emerald-600">轨道A上机</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-semibold text-sky-700">0011812170021</td>
                    <td className="px-4 py-3 font-sans text-slate-900 font-medium">周德成 (72岁/男)</td>
                    <td className="px-4 py-3 font-sans text-rose-600 font-medium">急诊心肌三项 (急查)</td>
                    <td className="px-4 py-3 font-sans text-slate-600">绿盖肝素锂管 3.0ml</td>
                    <td className="px-4 py-3 text-slate-500">2026-10-26 08:26</td>
                    <td className="px-4 py-3 font-sans text-amber-600 font-medium">待核收</td>
                    <td className="px-4 py-3 text-right font-sans">
                      <button
                        onClick={() => triggerAction('急查标本 0011812170021 已优先核收上机')}
                        className="text-xs text-sky-600 hover:text-sky-800 font-semibold"
                      >
                        快速核收
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= 2. 技师工作站 (tech-workstation) ================= */}
        {currentTab === 'tech-workstation' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {deviceCatalogs.slice(0, 3).map((dev) => (
                <div key={dev.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="font-semibold text-slate-900 text-xs">{dev.name}</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-700 font-medium">
                      {dev.status}
                    </span>
                  </div>
                  <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span className="text-slate-400">网络端口:</span>
                      <span className="font-mono">{dev.ip}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">检测速率:</span>
                      <span className="font-medium text-slate-800">{dev.speed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">安装工位:</span>
                      <span>{dev.loc}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
              <h4 className="font-semibold text-slate-800 text-xs mb-3">当前在机检测批次反应吸光度动态</h4>
              <div className="h-40 bg-slate-900 rounded-lg p-3 text-xs font-mono text-emerald-400 flex flex-col justify-between">
                <div>[ROCHE_C8000_CORE] R1加样完成 (150μL) -&gt; 预温育 37.0℃ (恒温波动 ±0.1℃)</div>
                <div>[ROCHE_C8000_CORE] 样本 0011812170001 (ALT) 吸光度测定中: OD(340nm)=0.842 -&gt; 0.791 -&gt; 0.732 (ΔA/min=-0.055)</div>
                <div>[ROCHE_C8000_CORE] 线性反应正常，未触发底物耗尽报警</div>
                <div className="text-sky-400">[ABBOTT_ALINITY] hs-cTnI 化学发光管 0011812170021 计数: 48,290 RLU (急诊加急完成测定)</div>
              </div>
            </div>
          </div>
        )}

        {/* ================= 3. 报告审核 (report-audit) ================= */}
        {currentTab === 'report-audit' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-slate-900 text-sm">批量自动审核与异常质控复核</h2>
                  <p className="text-xs text-slate-500 mt-0.5">当前批次包含 42 例临床生化检测结果，规则已完成初筛</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => triggerAction('38例符合自动审核规则的常规报告已批量审签发布')}
                    className="px-3 py-1.5 text-xs font-medium bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-2xs"
                  >
                    一键通过合规项 (38)
                  </button>
                  <button
                    onClick={() => triggerAction('已调取生化分析仪西格玛LJ质控图')}
                    className="px-3 py-1.5 text-xs font-medium border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50"
                  >
                    质控LJ图谱
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3">项目代号</th>
                      <th className="px-4 py-3">项目名称</th>
                      <th className="px-4 py-3 font-mono">测定结果</th>
                      <th className="px-4 py-3 font-mono">参考区间</th>
                      <th className="px-4 py-3">单位</th>
                      <th className="px-4 py-3">质控评估</th>
                      <th className="px-4 py-3 text-right">状态</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    <tr className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-bold text-slate-800">ALT</td>
                      <td className="px-4 py-3 font-sans text-slate-700">丙氨酸氨基转移酶</td>
                      <td className="px-4 py-3 font-bold text-rose-600">88.4 ↑</td>
                      <td className="px-4 py-3 text-slate-500">9.0 - 50.0</td>
                      <td className="px-4 py-3 text-slate-500 font-sans">U/L</td>
                      <td className="px-4 py-3 font-sans text-emerald-600">在控 (1_2s)</td>
                      <td className="px-4 py-3 text-right font-sans">
                        <span className="text-amber-600 font-medium">需医师复核</span>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-bold text-slate-800">AST</td>
                      <td className="px-4 py-3 font-sans text-slate-700">天门冬氨酸氨基转移酶</td>
                      <td className="px-4 py-3 font-bold text-rose-600">72.1 ↑</td>
                      <td className="px-4 py-3 text-slate-500">15.0 - 40.0</td>
                      <td className="px-4 py-3 text-slate-500 font-sans">U/L</td>
                      <td className="px-4 py-3 font-sans text-emerald-600">在控</td>
                      <td className="px-4 py-3 text-right font-sans">
                        <span className="text-amber-600 font-medium">需医师复核</span>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-bold text-slate-800">TBIL</td>
                      <td className="px-4 py-3 font-sans text-slate-700">总胆红素</td>
                      <td className="px-4 py-3 text-slate-800">14.6</td>
                      <td className="px-4 py-3 text-slate-500">3.4 - 20.5</td>
                      <td className="px-4 py-3 text-slate-500 font-sans">μmol/L</td>
                      <td className="px-4 py-3 font-sans text-emerald-600">在控</td>
                      <td className="px-4 py-3 text-right font-sans">
                        <span className="text-emerald-600">系统自动通过</span>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-bold text-slate-800">CREA</td>
                      <td className="px-4 py-3 font-sans text-slate-700">肌酐 (酶法)</td>
                      <td className="px-4 py-3 text-slate-800">76.0</td>
                      <td className="px-4 py-3 text-slate-500">53.0 - 106.0</td>
                      <td className="px-4 py-3 text-slate-500 font-sans">μmol/L</td>
                      <td className="px-4 py-3 font-sans text-emerald-600">在控</td>
                      <td className="px-4 py-3 text-right font-sans">
                        <span className="text-emerald-600">系统自动通过</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= 4. 检验时间轴 (test-timeline) ================= */}
        {currentTab === 'test-timeline' && (
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-6">
            <div>
              <h3 className="font-semibold text-slate-900 text-sm">标本全流程闭环 TAT 时间轴追溯</h3>
              <p className="text-xs text-slate-500 mt-0.5">当前查询标本：0011812170021（患者：周德成 · 急诊心肌三项）</p>
            </div>

            <div className="relative border-l-2 border-sky-500 ml-4 pl-6 space-y-6 text-xs">
              <div className="relative">
                <div className="w-3.5 h-3.5 rounded-full bg-sky-500 absolute -left-[31px] top-0.5 ring-4 ring-white" />
                <div className="font-semibold text-slate-900">08:10:15 · 临床开单</div>
                <div className="text-slate-500">急诊抢救室 陈欣欣主治医生下达医嘱 [急查心肌三项]</div>
              </div>

              <div className="relative">
                <div className="w-3.5 h-3.5 rounded-full bg-sky-500 absolute -left-[31px] top-0.5 ring-4 ring-white" />
                <div className="font-semibold text-slate-900">08:16:30 · 护士采血</div>
                <div className="text-slate-500">责任护士李晓芳完成腕带扫码核对与静脉抽血 (绿盖肝素管)</div>
              </div>

              <div className="relative">
                <div className="w-3.5 h-3.5 rounded-full bg-sky-500 absolute -left-[31px] top-0.5 ring-4 ring-white" />
                <div className="font-semibold text-slate-900">08:21:40 · 物流送检</div>
                <div className="text-slate-500">标本通过院内智能气动物流传输系统高速发送至检验科</div>
              </div>

              <div className="relative">
                <div className="w-3.5 h-3.5 rounded-full bg-sky-500 absolute -left-[31px] top-0.5 ring-4 ring-white" />
                <div className="font-semibold text-slate-900">08:26:00 · 检验科签收</div>
                <div className="text-slate-500">标本前处理总台完成扫码核收并分选至急查工位</div>
              </div>

              <div className="relative">
                <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 absolute -left-[31px] top-0.5 ring-4 ring-white" />
                <div className="font-semibold text-emerald-700">08:35:10 · 仪器上机测定完成</div>
                <div className="text-slate-600">雅培 Alinity 发光仪自动出具 hs-cTnI 结果 (触发危急值预警)</div>
              </div>

              <div className="relative">
                <div className="w-3.5 h-3.5 rounded-full bg-emerald-600 absolute -left-[31px] top-0.5 ring-4 ring-white" />
                <div className="font-semibold text-emerald-800">08:38:22 · 报告双签发布</div>
                <div className="text-slate-600">检验师完成复查确认并电话通知临床科室，TAT全程耗时 28 分钟 (达标 ≤30min)</div>
              </div>
            </div>
          </div>
        )}

        {/* ================= 5. 危急值管理 (crisis-management) ================= */}
        {currentTab === 'crisis-management' && (
          <div className="space-y-4">
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-rose-600 text-white flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5 animate-bounce" />
                </div>
                <div>
                  <div className="font-semibold text-rose-900 text-sm">
                    急查危急值预警：急诊科 2床 [肌钙蛋白I &gt; 12.8 ng/mL] 触发严重报警
                  </div>
                  <div className="text-xs text-rose-700 mt-0.5">
                    标本号：0011812170021 · 复查一致 · 需立即完成临床电话通知与系统双签闭环
                  </div>
                </div>
              </div>
              <button
                onClick={() => triggerAction('危急值已电话通知急诊科陈欣欣主治医生，记录已自动留痕')}
                className="px-3.5 py-1.5 text-xs font-semibold bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors whitespace-nowrap shadow-xs"
              >
                立即通报并闭环
              </button>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="px-4 py-3 border-b border-slate-200 text-xs font-semibold text-slate-800">
                近期全院危急值通报与追踪日志
              </div>
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-2.5">通报时间</th>
                    <th className="px-4 py-2.5">患者姓名</th>
                    <th className="px-4 py-2.5">病区/床号</th>
                    <th className="px-4 py-2.5">危急项目</th>
                    <th className="px-4 py-2.5">测定值</th>
                    <th className="px-4 py-2.5">临床接报医师</th>
                    <th className="px-4 py-2.5 text-right">闭环状态</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  <tr>
                    <td className="px-4 py-2.5 text-slate-500">2026-10-26 08:38</td>
                    <td className="px-4 py-2.5 font-sans font-medium text-slate-900">周德成</td>
                    <td className="px-4 py-2.5 font-sans text-slate-600">急诊抢救室 2床</td>
                    <td className="px-4 py-2.5 font-sans text-rose-600 font-bold">hs-cTnI</td>
                    <td className="px-4 py-2.5 text-rose-600 font-bold">12.80 ng/mL ↑↑</td>
                    <td className="px-4 py-2.5 font-sans text-slate-700">陈欣欣主治</td>
                    <td className="px-4 py-2.5 text-right font-sans text-emerald-600 font-medium">已闭环</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 text-slate-500">2026-10-26 07:15</td>
                    <td className="px-4 py-2.5 font-sans font-medium text-slate-900">钱学林</td>
                    <td className="px-4 py-2.5 font-sans text-slate-600">心内科 18床</td>
                    <td className="px-4 py-2.5 font-sans text-rose-600 font-bold">血清钾 (K+)</td>
                    <td className="px-4 py-2.5 text-rose-600 font-bold">6.85 mmol/L ↑↑</td>
                    <td className="px-4 py-2.5 font-sans text-slate-700">李主任医师</td>
                    <td className="px-4 py-2.5 text-right font-sans text-emerald-600 font-medium">已闭环</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= 6. 基础管理 (basic-management 字典模块) ================= */}
        {(currentTab.startsWith('dict-') ||
          currentTab.startsWith('manage-') ||
          currentTab === 'config-test-instrument' ||
          currentTab === 'third-party-mapping' ||
          currentTab === 'basic-management') && (
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-semibold text-slate-900 text-sm">
                  {currentTab === 'dict-specimen-type' && '标本类型字典维护'}
                  {currentTab === 'dict-tube-type' && '试管类型字典维护'}
                  {currentTab === 'dict-device-catalog' && '设备目录字典维护'}
                  {currentTab === 'dict-test-item' && '检验项目字典维护'}
                  {currentTab === 'dict-test-apply' && '检验申请字典配置'}
                  {currentTab === 'dict-operation' && '操作字典管理'}
                  {currentTab === 'manage-test-unit' && '检验单元管理'}
                  {currentTab === 'manage-test-rule' && '检验规则管理 (自动审核与Delta Check)'}
                  {currentTab === 'config-test-instrument' && '检验仪器双向接口配置'}
                  {currentTab === 'manage-report-template' && '检验报告模板管理'}
                  {currentTab === 'manage-knowledge-base' && '检验医学知识库管理'}
                  {currentTab === 'third-party-mapping' && '三方系统对照 (HIS/医保/互认对照)'}
                  {currentTab === 'basic-management' && '基础管理字典库'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">支持标准化主数据编码维护与多院区统一字典下发</p>
              </div>

              <button
                onClick={() => triggerAction('字典条目已成功保存并下发至全院LIS节点')}
                className="px-3 py-1.5 text-xs bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-lg shadow-2xs"
              >
                新增字典条目
              </button>
            </div>

            {/* If specimen type dict */}
            {currentTab === 'dict-specimen-type' && (
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-2.5">标本代码</th>
                    <th className="px-4 py-2.5">标本类型名称</th>
                    <th className="px-4 py-2.5">推荐采血管容器</th>
                    <th className="px-4 py-2.5">临床应用说明</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {specimenTypes.map((item) => (
                    <tr key={item.code} className="hover:bg-slate-50">
                      <td className="px-4 py-2.5 font-mono font-bold text-sky-700">{item.code}</td>
                      <td className="px-4 py-2.5 font-medium text-slate-800">{item.name}</td>
                      <td className="px-4 py-2.5 text-slate-600">{item.container}</td>
                      <td className="px-4 py-2.5 text-slate-500">{item.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* If tube type dict */}
            {currentTab === 'dict-tube-type' && (
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-2.5">管型代码</th>
                    <th className="px-4 py-2.5">管盖颜色</th>
                    <th className="px-4 py-2.5">规格容量</th>
                    <th className="px-4 py-2.5">主要适用检测项目</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {tubeTypes.map((t) => (
                    <tr key={t.code} className="hover:bg-slate-50">
                      <td className="px-4 py-2.5 font-mono text-slate-700">{t.code}</td>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-2">
                          <span className={`w-3 h-3 rounded-full ${t.capColor}`} />
                          <span className="font-medium text-slate-800">{t.color}</span>
                        </div>
                      </td>
                      <td className="px-4 py-2.5 text-slate-600">{t.spec}</td>
                      <td className="px-4 py-2.5 text-slate-500">{t.usage}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* If device catalog or instrument config */}
            {(currentTab === 'dict-device-catalog' || currentTab === 'config-test-instrument') && (
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-2.5">设备编号</th>
                    <th className="px-4 py-2.5">分析仪器名称</th>
                    <th className="px-4 py-2.5">ASTM/HL7 通讯接口</th>
                    <th className="px-4 py-2.5">理论通量</th>
                    <th className="px-4 py-2.5">安装机位</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {deviceCatalogs.map((d) => (
                    <tr key={d.id} className="hover:bg-slate-50">
                      <td className="px-4 py-2.5 text-slate-500">{d.id}</td>
                      <td className="px-4 py-2.5 font-sans font-medium text-slate-900">{d.name}</td>
                      <td className="px-4 py-2.5 text-sky-700 font-semibold">{d.ip}</td>
                      <td className="px-4 py-2.5 font-sans text-slate-600">{d.speed}</td>
                      <td className="px-4 py-2.5 font-sans text-slate-500">{d.loc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* Default table for test items */}
            {currentTab !== 'dict-specimen-type' &&
              currentTab !== 'dict-tube-type' &&
              currentTab !== 'dict-device-catalog' &&
              currentTab !== 'config-test-instrument' && (
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-2.5">项目代码</th>
                      <th className="px-4 py-2.5">检验项目全称</th>
                      <th className="px-4 py-2.5">专业分组</th>
                      <th className="px-4 py-2.5 font-mono">单位</th>
                      <th className="px-4 py-2.5 font-mono">生物参考区间</th>
                      <th className="px-4 py-2.5 text-right">收费标准</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {testItemDictionary.map((item) => (
                      <tr key={item.code} className="hover:bg-slate-50">
                        <td className="px-4 py-2.5 font-bold text-sky-700">{item.code}</td>
                        <td className="px-4 py-2.5 font-sans font-medium text-slate-900">{item.name}</td>
                        <td className="px-4 py-2.5 font-sans text-slate-600">{item.group}</td>
                        <td className="px-4 py-2.5 text-slate-500 font-sans">{item.unit}</td>
                        <td className="px-4 py-2.5 text-slate-700">{item.ref}</td>
                        <td className="px-4 py-2.5 text-right font-sans text-slate-800">{item.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
          </div>
        )}

        {/* ================= 7. 质控管理 (qc-management) ================= */}
        {(currentTab.startsWith('qc-') || currentTab === 'qc-management') && (
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-semibold text-slate-900 text-sm">
                  {currentTab === 'qc-materials' && '质控品/质控物台账管理'}
                  {currentTab === 'qc-rule-settings' && 'Westgard 多规则质控判定设置'}
                  {(currentTab === 'qc-routine-management' || currentTab === 'qc-management') &&
                    '生化免疫实时质控与LJ图谱监控'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">严格遵循 ISO 15189 实验室质量管理规范</p>
              </div>
              <button
                onClick={() => triggerAction('质控LJ图谱数据与Westgard规则评估已刷新')}
                className="px-3 py-1.5 text-xs bg-sky-600 text-white rounded-lg hover:bg-sky-700"
              >
                刷新质控图
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-500">在用质控物批次</span>
                <div className="text-base font-bold font-mono text-slate-900 mt-1">Randox Bio-Rad (Level 1/2/3)</div>
                <div className="text-[11px] text-emerald-600 mt-0.5">有效期至 2027-06-30</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-500">Westgard 质控规则</span>
                <div className="text-base font-bold font-mono text-emerald-600 mt-1">1_3s / 2_2s / R_4s / 10_x</div>
                <div className="text-[11px] text-slate-500 mt-0.5">触发自动阻断审核</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-500">当月常规变异系数 CV%</span>
                <div className="text-base font-bold font-mono text-slate-900 mt-1">2.14% (优于行业标准 &lt; 4.0%)</div>
                <div className="text-[11px] text-emerald-600 mt-0.5">各项目西格玛度度 &gt; 5.2</div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
