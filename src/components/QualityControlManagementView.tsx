import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Download,
  Printer,
  X,
  ChevronDown,
  ChevronRight,
  FileSpreadsheet,
  BarChart3,
  Table2,
  PieChart,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  RefreshCw,
  Folder,
  FolderOpen,
  FileText,
  Plus,
  Sliders,
  Check,
  Maximize2,
  Save
} from './MenuIcon';
import { UserProfile } from '../types/navigation';
import {
  QcMaterial,
  QcTestItem,
  QcRecordItem,
  LjDataPoint,
  INITIAL_QC_MATERIALS,
  QC_TEST_ITEMS,
  INITIAL_QC_RECORDS,
  INITIAL_LJ_PLOT_DATA
} from '../data/qualityControlData';

interface QualityControlManagementViewProps {
  user: UserProfile;
  triggerAction: (msg: string) => void;
  onNavigateToMaterials?: () => void;
  onNavigateToRuleSettings?: () => void;
}

export const QualityControlManagementView: React.FC<QualityControlManagementViewProps> = ({
  user,
  triggerAction,
  onNavigateToMaterials,
  onNavigateToRuleSettings,
}) => {
  // Main view tab: 'data' (质控数据) or 'chart' (质控图)
  const [activeTab, setActiveTab] = useState<'data' | 'chart'>('data');

  // Device & Material selection
  const [selectedDevice, setSelectedDevice] = useState<string>('生化AU2700');
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>('mat-01');
  const [selectedItemCode, setSelectedItemCode] = useState<string>('ALL');

  // Filters for QC Data tab
  const [filterDate, setFilterDate] = useState<string>('2026-10-29');
  const [chartDateRange, setChartDateRange] = useState({
    startDate: '2026-10-01',
    endDate: '2026-10-29',
  });
  const [filterProject, setFilterProject] = useState<string>('');
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Chart view mode
  const [chartType, setChartType] = useState<'L-J图' | 'Z-分数图' | 'Youden图'>('L-J图');
  const [chartLayout, setChartLayout] = useState<'single' | 'multi'>('single');
  const [hoveredPoint, setHoveredPoint] = useState<LjDataPoint | null>(null);

  // Records state
  const [qcRecords, setQcRecords] = useState<QcRecordItem[]>(INITIAL_QC_RECORDS);

  // Modal dialog states
  const [selectedDetailRecord, setSelectedDetailRecord] = useState<QcRecordItem | null>(null);
  const [editingRecord, setEditingRecord] = useState<QcRecordItem | null>(null);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showAuditModal, setShowAuditModal] = useState<boolean>(false);
  const [showOutControlModal, setShowOutControlModal] = useState<boolean>(false);
  const [activeOutControlRecord, setActiveOutControlRecord] = useState<QcRecordItem | null>(null);
  const [showMonthlyReportModal, setShowMonthlyReportModal] = useState<boolean>(false);

  // Audit Modal States (审核数据弹窗 - matching image_23c94ca1.png)
  const [auditFilterDate, setAuditFilterDate] = useState<string>('2026-10-29');
  const [auditFilterProject, setAuditFilterProject] = useState<string>('');
  const [selectedAuditIds, setSelectedAuditIds] = useState<string[]>(['QC-20261029-01', 'QC-20261029-02']);

  // Add Data Modal States (新增数据弹窗 - matching image_b970e816.png)
  const [addFilterDate, setAddFilterDate] = useState<string>('2026-10-29');
  const [addSelectedMaterialName, setAddSelectedMaterialName] = useState<string>('生化AU2700质控');
  const [addSelectedItemIndex, setAddSelectedItemIndex] = useState<number>(0);

  // Add Modal Static Definitions
  const ADD_MODAL_MATERIALS = useMemo(() => [
    { name: '生化AU2700质控', levelCount: 2, defaultLot: '40002', manufacturer: '贝克曼库尔特' },
    { name: 'AU2700质控', levelCount: 3, defaultLot: '40001', manufacturer: '贝克曼库尔特' },
    { name: '罗氏Cobas 8000复合质控', levelCount: 2, defaultLot: '202610A08', manufacturer: '罗氏诊断' },
    { name: '雅培Alinity ci急查质控', levelCount: 3, defaultLot: '202609B14', manufacturer: '雅培诊断' },
  ], []);

  const ADD_MODAL_ITEMS = useMemo(() => [
    { code: 'PH', name: 'PH值', level: 1, target: 1.5, sd: 0.2, cv: 0.2, lot: '40002', defaultResult: 2.0 },
    { code: 'CA', name: '钙', level: 2, target: 2.1, sd: 0.2, cv: 0.2, lot: '40001', defaultResult: 3.0 },
    { code: 'TP', name: '白蛋白', level: 1, target: 42.0, sd: 1.2, cv: 2.85, lot: '202610051', defaultResult: 42.1 },
    { code: 'GLU', name: '葡萄糖', level: 2, target: 5.50, sd: 0.12, cv: 2.18, lot: '202610051', defaultResult: 5.52 },
    { code: 'ALT', name: '谷丙转氨酶', level: 1, target: 42.5, sd: 1.5, cv: 3.52, lot: '202610051', defaultResult: 43.0 },
    { code: 'UREA', name: '尿素', level: 2, target: 5.60, sd: 0.25, cv: 4.46, lot: '202610051', defaultResult: 5.64 },
    { code: 'CREA', name: '肌酐', level: 1, target: 88.0, sd: 2.2, cv: 2.50, lot: '202610051', defaultResult: 88.6 },
    { code: 'TBIL', name: '总胆红素', level: 2, target: 16.5, sd: 0.6, cv: 3.63, lot: '202610051', defaultResult: 16.7 },
  ], []);

  // 15 dates generation ending on addFilterDate (2026-10-15 ~ 2026-10-29)
  const addModalDates = useMemo(() => {
    const list: string[] = [];
    const base = new Date(addFilterDate || '2026-10-29');
    for (let i = 14; i >= 0; i--) {
      const d = new Date(base);
      d.setDate(base.getDate() - i);
      list.push(d.toISOString().slice(0, 10));
    }
    return list;
  }, [addFilterDate]);

  // Matrix inputs dictionary for Add Data Modal
  const [matrixInputs, setMatrixInputs] = useState<Record<string, { run1: string; run2: string; run3: string; run4: string }>>(() => {
    const initial: Record<string, { run1: string; run2: string; run3: string; run4: string }> = {};
    const baseDates = [
      '2026-10-15', '2026-10-16', '2026-10-17', '2026-10-18', '2026-10-19',
      '2026-10-20', '2026-10-21', '2026-10-22', '2026-10-23', '2026-10-24',
      '2026-10-25', '2026-10-26', '2026-10-27', '2026-10-28', '2026-10-29'
    ];
    baseDates.forEach((d, idx) => {
      initial[`PH_1_${d}`] = {
        run1: idx === 14 ? '2.00' : (1.5 + (Math.sin(idx) * 0.05)).toFixed(2),
        run2: idx === 14 ? '2.01' : (1.5 - (Math.cos(idx) * 0.04)).toFixed(2),
        run3: idx === 14 ? '1.99' : (1.5 + (Math.sin(idx * 2) * 0.03)).toFixed(2),
        run4: idx === 14 ? '2.00' : '1.50',
      };
      initial[`CA_2_${d}`] = {
        run1: idx === 14 ? '3.00' : (2.1 + (Math.sin(idx) * 0.06)).toFixed(2),
        run2: idx === 14 ? '3.02' : (2.1 - (Math.cos(idx) * 0.05)).toFixed(2),
        run3: idx === 14 ? '2.98' : (2.1 + (Math.sin(idx * 2) * 0.04)).toFixed(2),
        run4: idx === 14 ? '3.01' : '2.10',
      };
      initial[`TP_1_${d}`] = {
        run1: '42.1',
        run2: '41.8',
        run3: '42.4',
        run4: '42.0',
      };
      initial[`GLU_2_${d}`] = {
        run1: '5.52',
        run2: '5.48',
        run3: '5.55',
        run4: '5.50',
      };
      initial[`ALT_1_${d}`] = {
        run1: '43.0',
        run2: '42.6',
        run3: '43.2',
        run4: '42.5',
      };
      initial[`UREA_2_${d}`] = {
        run1: '5.64',
        run2: '5.58',
        run3: '5.68',
        run4: '5.60',
      };
      initial[`CREA_1_${d}`] = {
        run1: '88.6',
        run2: '87.9',
        run3: '89.2',
        run4: '88.0',
      };
      initial[`TBIL_2_${d}`] = {
        run1: '16.7',
        run2: '16.3',
        run3: '16.9',
        run4: '16.5',
      };
    });
    return initial;
  });

  // Out of control count
  const outOfControlRecords = useMemo(() => {
    return qcRecords.filter(r => r.qcStatus === '失控');
  }, [qcRecords]);

  // Active selected QC Item definition
  const currentQcItem = useMemo(() => {
    return QC_TEST_ITEMS.find(item => item.code === selectedItemCode) || QC_TEST_ITEMS[0];
  }, [selectedItemCode]);

  // Active selected QC Material definition
  const currentMaterial = useMemo(() => {
    return INITIAL_QC_MATERIALS.find(m => m.id === selectedMaterialId) || INITIAL_QC_MATERIALS[0];
  }, [selectedMaterialId]);

  // Filtered records for main table
  const filteredRecords = useMemo(() => {
    return qcRecords.filter(record => {
      if (selectedMaterialId && record.materialId !== selectedMaterialId) {
        return false;
      }
      if (selectedItemCode && selectedItemCode !== 'ALL' && record.itemCode !== selectedItemCode) {
        return false;
      }
      if (filterProject.trim()) {
        const kw = filterProject.trim().toLowerCase();
        if (
          !record.testItem.toLowerCase().includes(kw) &&
          !record.itemCode.toLowerCase().includes(kw)
        ) {
          return false;
        }
      }
      if (filterLevel !== 'all' && String(record.level) !== filterLevel) {
        return false;
      }
      if (filterStatus === 'out' && record.qcStatus !== '失控') {
        return false;
      }
      if (filterStatus === 'in' && record.qcStatus !== '在控') {
        return false;
      }
      if (filterStatus === 'unaudited' && record.auditStatus !== '未审') {
        return false;
      }
      return true;
    });
  }, [qcRecords, selectedMaterialId, selectedItemCode, filterProject, filterLevel, filterStatus]);

  // Filtered records inside Audit Data Modal (image_23c94ca1.png)
  const auditModalFilteredRecords = useMemo(() => {
    return qcRecords.filter(r => {
      if (auditFilterProject.trim()) {
        const kw = auditFilterProject.trim().toLowerCase();
        if (!r.testItem.toLowerCase().includes(kw) && !r.itemCode.toLowerCase().includes(kw)) {
          return false;
        }
      }
      return true;
    });
  }, [qcRecords, auditFilterProject]);

  // Manufacturer resolver for any QC record
  const getRecordManufacturer = (r: QcRecordItem): string => {
    const mat = INITIAL_QC_MATERIALS.find(m => m.id === r.materialId);
    if (mat) {
      if (mat.manufacturer.includes('贝克曼')) return '贝克曼库尔特';
      if (mat.manufacturer.includes('罗氏')) return '罗氏诊断';
      if (mat.manufacturer.includes('雅培')) return '雅培诊断';
    }
    if (r.device?.includes('罗氏')) return '罗氏诊断';
    if (r.device?.includes('雅培')) return '雅培诊断';
    return '贝克曼库尔特';
  };

  // Material clean display name
  const getRecordMaterialName = (r: QcRecordItem): string => {
    const mat = INITIAL_QC_MATERIALS.find(m => m.id === r.materialId);
    if (mat) {
      return mat.name.replace(/\(低\)|\(高\)/g, '');
    }
    return '生化AU2700质控';
  };

  // Audit modal row toggle
  const handleToggleAuditRow = (id: string) => {
    setSelectedAuditIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // Audit modal select all toggle
  const handleSelectAllAuditRows = () => {
    if (selectedAuditIds.length === auditModalFilteredRecords.length) {
      setSelectedAuditIds([]);
    } else {
      setSelectedAuditIds(auditModalFilteredRecords.map(r => r.id));
    }
  };

  // Confirm Audit in Audit Modal (审核按钮)
  const handleConfirmAuditModal = () => {
    const idsToAudit = selectedAuditIds.length > 0
      ? selectedAuditIds
      : auditModalFilteredRecords.filter(r => r.auditStatus === '未审').map(r => r.id);

    if (idsToAudit.length === 0) {
      triggerAction('未选择待审项目或当前选定项目已全部审核');
      return;
    }

    const nowTime = '2026-10-29 08:45:00';
    setQcRecords(prev =>
      prev.map(r =>
        idsToAudit.includes(r.id)
          ? {
              ...r,
              auditStatus: '已审',
              auditor: user.name || '蔡文斌',
              auditTime: nowTime,
            }
          : r
      )
    );
    setSelectedAuditIds([]);
    setShowAuditModal(false);
    triggerAction(`质控数据审核成功！已完成 ${idsToAudit.length} 项质控测定审签，审核医师: 蔡文斌，时间: 2026-10-29 08:45`);
  };

  // Matrix input change handler for Add Data Modal
  const handleMatrixInputChange = (code: string, level: number, date: string, field: 'run1' | 'run2' | 'run3' | 'run4', val: string) => {
    const key = `${code}_${level}_${date}`;
    setMatrixInputs(prev => ({
      ...prev,
      [key]: {
        ...(prev[key] || { run1: '', run2: '', run3: '', run4: '' }),
        [field]: val,
      },
    }));
  };

  // Quick fill target into matrix
  const handleQuickFillMatrix = (item: typeof ADD_MODAL_ITEMS[0]) => {
    setMatrixInputs(prev => {
      const next = { ...prev };
      addModalDates.forEach((d, idx) => {
        const key = `${item.code}_${item.level}_${d}`;
        const jitter = Math.sin(idx) * item.sd * 0.4;
        const v1 = (item.defaultResult + jitter).toFixed(item.sd < 1 ? 2 : 1);
        const v2 = (item.defaultResult - jitter * 0.8).toFixed(item.sd < 1 ? 2 : 1);
        const v3 = (item.defaultResult + jitter * 0.5).toFixed(item.sd < 1 ? 2 : 1);
        const v4 = (item.defaultResult).toFixed(item.sd < 1 ? 2 : 1);
        next[key] = { run1: v1, run2: v2, run3: v3, run4: v4 };
      });
      return next;
    });
    triggerAction(`已自动根据项目 ${item.name} (靶值 ${item.target}) 填充15日质控测定参考数据`);
  };

  // Save Add Data Modal Matrix (保存按钮)
  const handleSaveAddModalMatrix = () => {
    const currentItem = ADD_MODAL_ITEMS[addSelectedItemIndex];
    const todayKey = `${currentItem.code}_${currentItem.level}_${addFilterDate}`;
    const todayRuns = matrixInputs[todayKey] || {
      run1: String(currentItem.defaultResult),
      run2: String(currentItem.defaultResult),
      run3: String(currentItem.defaultResult),
      run4: String(currentItem.defaultResult),
    };

    const runVal = Number(todayRuns.run1 || todayRuns.run2 || currentItem.defaultResult);

    const newRecord: QcRecordItem = {
      id: `QC-${addFilterDate.replace(/-/g, '')}-0${qcRecords.length + 1}`,
      materialId: selectedMaterialId || 'mat-01',
      auditStatus: '未审',
      qcStatus: '在控',
      testItem: currentItem.name,
      itemCode: currentItem.code,
      level: currentItem.level,
      lotNo: currentItem.lot,
      qcResult: runVal,
      targetVal: currentItem.target,
      sdVal: currentItem.sd,
      cvVal: currentItem.cv,
      westgardRule: '在控 (正常在控)',
      operator: '张珊',
      qcTime: `${addFilterDate} 08:35:00`,
      auditor: '蔡文斌',
      auditTime: '',
      device: selectedDevice || '生化AU2700',
    };

    setQcRecords(prev => [newRecord, ...prev]);
    setShowAddModal(false);
    triggerAction(`新增质控数据已批量入库保存！项目: ${currentItem.name}(水平${currentItem.level})，测定值: ${runVal}，操作技师: 张珊`);
  };



  // Handle edit record save
  const handleSaveEditRecord = () => {
    if (!editingRecord) return;
    setQcRecords(prev =>
      prev.map(r => (r.id === editingRecord.id ? editingRecord : r))
    );
    setEditingRecord(null);
    triggerAction(`质控记录 ${editingRecord.testItem} 已完成修改`);
  };

  // Handle delete record
  const handleDeleteRecord = (id: string, name: string) => {
    setQcRecords(prev => prev.filter(r => r.id !== id));
    triggerAction(`质控记录 ${name} 已作废删除`);
  };

  // Calculate Mean & SD Action
  const handleCalculateMean = () => {
    triggerAction(
      `已自动重算 ${currentQcItem.name} 当月累计靶值与标准差: 均值 ${currentQcItem.target1.toFixed(
        2
      )}, SD ${currentQcItem.sd1.toFixed(2)}, CV ${currentQcItem.cv1}%`
    );
  };

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-slate-100 overflow-hidden text-xs">
      {/* Top Header & Breadcrumb */}
      <div className="bg-white border-b border-slate-200 px-4 py-2.5 flex items-center justify-between shrink-0 shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-800">临生免系统</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-600 font-medium">质控管理</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-sky-700 font-semibold bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
            {activeTab === 'data' ? '室内质控日常测定数据' : 'Levey-Jennings (L-J) 质控图谱'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Main Tab Toggle: 质控数据 vs 质控图 */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              onClick={() => setActiveTab('data')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-all ${
                activeTab === 'data'
                  ? 'bg-white text-sky-700 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Table2 className="w-3.5 h-3.5" />
              <span>质控数据</span>
            </button>
            <button
              onClick={() => setActiveTab('chart')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-all ${
                activeTab === 'chart'
                  ? 'bg-white text-sky-700 shadow-2xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>质控图</span>
            </button>
          </div>

          <div className="h-4 w-px bg-slate-200 mx-1" />

          {/* Top Right Action Buttons (matching screenshot) */}
          {onNavigateToMaterials && (
            <button
              onClick={onNavigateToMaterials}
              className="flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-sky-50 border border-sky-300 text-sky-700 rounded text-xs font-semibold shadow-2xs transition-colors"
            >
              <FolderOpen className="w-3.5 h-3.5 text-sky-600" />
              <span>质控物管理</span>
            </button>
          )}
          {onNavigateToRuleSettings && (
            <button
              onClick={onNavigateToRuleSettings}
              className="flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-indigo-50 border border-indigo-300 text-indigo-700 rounded text-xs font-semibold shadow-2xs transition-colors"
            >
              <Sliders className="w-3.5 h-3.5 text-indigo-600" />
              <span>质控规则设置</span>
            </button>
          )}
          <button
            onClick={() => setShowMonthlyReportModal(true)}
            className="px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded text-xs font-medium shadow-2xs transition-colors"
          >
            月度报告
          </button>
          <button
            onClick={handleCalculateMean}
            className="px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded text-xs font-medium shadow-2xs transition-colors"
          >
            计算均值
          </button>
          <button
            onClick={() => triggerAction('已打开质控多水平L-J图谱与数据报表打印设置')}
            className="flex items-center gap-1 px-2.5 py-1 bg-sky-600 hover:bg-sky-700 text-white rounded text-xs font-medium shadow-2xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>打印设置</span>
          </button>
        </div>
      </div>

      {/* Main Container: Left Panels + Right Area */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* ======================= Left Panel: 质控物与项目列表 ======================= */}
        <div className="w-56 bg-white border-r border-slate-200 flex flex-col shrink-0 select-none">
          {/* Top Section of Left: 质控物列表 */}
          <div className="p-2.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center gap-1.5 font-semibold text-xs text-slate-800">
              <FolderOpen className="w-4 h-4 text-sky-600" />
              <span>质控物目录</span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">
              {INITIAL_QC_MATERIALS.length} 种
            </span>
          </div>

          <div className="overflow-y-auto border-b border-slate-200 max-h-48">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-600 sticky top-0 text-[11px] border-b border-slate-200">
                <tr>
                  <th className="py-1.5 px-2.5 font-semibold">质控物名称</th>
                  <th className="py-1.5 px-2 text-center font-semibold w-16">水平数</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {INITIAL_QC_MATERIALS.map(mat => {
                  const isSelected = selectedMaterialId === mat.id;
                  return (
                    <tr
                      key={mat.id}
                      onClick={() => {
                        setSelectedMaterialId(mat.id);
                        setSelectedDevice(mat.device);
                        setSelectedItemCode('ALL');
                        triggerAction(`已选择质控物: ${mat.name}，右侧表格已更新`);
                      }}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-sky-50 text-sky-800 font-semibold border-l-2 border-sky-600'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <td className="py-2 px-2.5 truncate" title={mat.name}>
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              isSelected ? 'bg-sky-600 ring-2 ring-sky-200' : 'bg-slate-300'
                            }`}
                          />
                          <span className="truncate">{mat.name}</span>
                        </div>
                      </td>
                      <td className="py-2 px-2 text-center font-mono">
                        <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-100 text-slate-600 font-bold">
                          {mat.levelCount}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Bottom Section of Left: 质控项目列表 */}
          <div className="p-2 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
            <span className="font-semibold text-xs text-slate-800">检验质控项目</span>
            {selectedItemCode !== 'ALL' ? (
              <button
                onClick={() => {
                  setSelectedItemCode('ALL');
                  triggerAction('已切换为显示全部质控项目');
                }}
                className="text-[10px] text-sky-600 hover:underline cursor-pointer"
              >
                显示全部
              </button>
            ) : (
              <span className="text-[10px] text-slate-400 font-mono">{QC_TEST_ITEMS.length} 项</span>
            )}
          </div>

          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-600 sticky top-0 text-[11px] border-b border-slate-200">
                <tr>
                  <th className="py-1.5 px-2.5 font-semibold w-16">代码</th>
                  <th className="py-1.5 px-2 font-semibold">项目名称</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr
                  onClick={() => {
                    setSelectedItemCode('ALL');
                    triggerAction('已切换为显示全部质控项目');
                  }}
                  className={`cursor-pointer transition-colors ${
                    selectedItemCode === 'ALL'
                      ? 'bg-sky-50 text-sky-800 font-semibold border-l-2 border-sky-600'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <td className="py-1.5 px-2.5 font-mono text-slate-500 font-bold">ALL</td>
                  <td className="py-1.5 px-2 text-sky-700 font-medium">全部质控项目</td>
                </tr>
                {QC_TEST_ITEMS.map(item => {
                  const isSelected = selectedItemCode === item.code;
                  return (
                    <tr
                      key={item.code}
                      onClick={() => {
                        setSelectedItemCode(item.code);
                        triggerAction(`已选择项目: ${item.name} (${item.code})，右侧表格已更新`);
                      }}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-sky-50 text-sky-800 font-semibold border-l-2 border-sky-600'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <td className="py-1.5 px-2.5 font-mono text-slate-600">
                        {item.code}
                      </td>
                      <td className="py-1.5 px-2 truncate" title={item.name}>
                        {item.name}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ======================= Right Area: Content (Data or Chart) ======================= */}
        <div className="flex-1 flex flex-col min-h-0 bg-slate-50 overflow-hidden">
          {/* TAB 1: 质控数据 (Quality Control Data Table) */}
          {activeTab === 'data' ? (
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
              {/* Filter Toolbar (matching screenshot 1) */}
              <div className="bg-white border-b border-slate-200 p-2.5 flex flex-wrap items-center justify-between gap-2 shadow-2xs">
                <div className="flex flex-wrap items-center gap-2">
                  {/* 仪器 Dropdown */}
                  <div className="flex items-center gap-1">
                    <span className="text-slate-500">仪器:</span>
                    <select
                      value={selectedDevice}
                      onChange={e => {
                        const newDev = e.target.value;
                        setSelectedDevice(newDev);
                        const matchedMat = INITIAL_QC_MATERIALS.find(
                          m => m.device.includes(newDev) || newDev.includes(m.device)
                        );
                        if (matchedMat) {
                          setSelectedMaterialId(matchedMat.id);
                        }
                      }}
                      className="bg-white border border-slate-300 rounded px-2 py-1 text-xs text-slate-700 focus:outline-none focus:border-sky-500 font-medium"
                    >
                      <option value="生化AU2700">生化AU2700</option>
                      <option value="罗氏 Cobas 8000 (c702)">罗氏 Cobas 8000 (c702)</option>
                      <option value="雅培 Alinity ci">雅培 Alinity ci</option>
                      <option value="贝克曼 AU5800">贝克曼 AU5800</option>
                    </select>
                  </div>

                  {/* 质控日期 Picker (Recent Date) */}
                  <div className="flex items-center gap-1 bg-slate-50 border border-slate-300 rounded px-2 py-1">
                    <span className="text-slate-500">质控日期:</span>
                    <input
                      type="date"
                      value={filterDate}
                      onChange={e => setFilterDate(e.target.value)}
                      className="bg-transparent border-0 text-slate-700 text-xs focus:ring-0 p-0 font-mono"
                    />
                  </div>

                  {/* 质控项目 Input */}
                  <div className="flex items-center gap-1">
                    <span className="text-slate-500">质控项目:</span>
                    <input
                      type="text"
                      placeholder="项目名称/代码"
                      value={filterProject}
                      onChange={e => setFilterProject(e.target.value)}
                      className="w-28 px-2 py-1 border border-slate-300 rounded text-xs focus:outline-none focus:border-sky-500 bg-white"
                    />
                  </div>

                  {/* 水平 Dropdown */}
                  <div className="flex items-center gap-1">
                    <span className="text-slate-500">水平:</span>
                    <select
                      value={filterLevel}
                      onChange={e => setFilterLevel(e.target.value)}
                      className="bg-white border border-slate-300 rounded px-2 py-1 text-xs text-slate-700 focus:outline-none focus:border-sky-500"
                    >
                      <option value="all">全部水平</option>
                      <option value="1">水平 1 (低值)</option>
                      <option value="2">水平 2 (中值/正常)</option>
                      <option value="3">水平 3 (高值)</option>
                    </select>
                  </div>

                  {/* 状态 Filter */}
                  <div className="flex items-center gap-1">
                    <span className="text-slate-500">状态:</span>
                    <select
                      value={filterStatus}
                      onChange={e => setFilterStatus(e.target.value)}
                      className="bg-white border border-slate-300 rounded px-2 py-1 text-xs text-slate-700 focus:outline-none focus:border-sky-500"
                    >
                      <option value="all">全部状态</option>
                      <option value="in">在控</option>
                      <option value="out">失控报警</option>
                      <option value="unaudited">待审核</option>
                    </select>
                  </div>
                </div>

                {/* Right Action Buttons */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => triggerAction(`已按当前筛选条件刷新质控测定数据表`)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded text-xs font-semibold shadow-2xs transition-colors"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>查询</span>
                  </button>
                  <button
                    onClick={() => {
                      const unAudited = qcRecords.filter(r => r.auditStatus === '未审').map(r => r.id);
                      setSelectedAuditIds(unAudited.length > 0 ? unAudited : qcRecords.slice(0, 4).map(r => r.id));
                      setShowAuditModal(true);
                    }}
                    className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded text-xs font-semibold shadow-2xs transition-colors"
                  >
                    审核数据
                  </button>
                  <button
                    onClick={() => {
                      if (outOfControlRecords.length > 0) {
                        setActiveOutControlRecord(outOfControlRecords[0]);
                        setShowOutControlModal(true);
                      } else {
                        triggerAction('当前无失控项目，系统质量评价达标');
                      }
                    }}
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded text-xs font-semibold shadow-2xs transition-colors flex items-center gap-1"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>失控报告 ({outOfControlRecords.length})</span>
                  </button>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-semibold shadow-2xs transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>新增数据</span>
                  </button>
                </div>
              </div>

              {/* Active Selection Breadcrumb/Status Bar */}
              <div className="bg-slate-50 border-b border-slate-200 px-4 py-1.5 flex items-center justify-between text-[11px] text-slate-600">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-slate-400">当前筛选质控物:</span>
                  <span className="font-semibold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200 shadow-2xs">
                    {currentMaterial.name} ({currentMaterial.lotNo})
                  </span>
                  {selectedItemCode !== 'ALL' && (
                    <span className="font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
                      项目: {QC_TEST_ITEMS.find(i => i.code === selectedItemCode)?.name || selectedItemCode}
                    </span>
                  )}
                  <span className="text-slate-400 font-mono">
                    · 匹配测定结果: <strong className="text-slate-800">{filteredRecords.length}</strong> 条
                  </span>
                </div>
                {selectedItemCode !== 'ALL' && (
                  <button
                    onClick={() => {
                      setSelectedItemCode('ALL');
                      triggerAction('已重置为显示该质控物下的全部项目');
                    }}
                    className="text-sky-600 hover:text-sky-800 hover:underline cursor-pointer font-medium"
                  >
                    清除项目筛选，显示全部
                  </button>
                )}
              </div>

              {/* Data Table Area */}
              <div className="flex-1 min-h-0 overflow-auto bg-white">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                  <thead className="bg-slate-100 sticky top-0 z-10 border-b border-slate-200 text-slate-700 font-semibold text-xs shadow-2xs">
                    <tr>
                      <th className="py-2.5 px-3 text-center">审核状态</th>
                      <th className="py-2.5 px-3 text-center">质控状态</th>
                      <th className="py-2.5 px-3">质控项目</th>
                      <th className="py-2.5 px-2 text-center">水平</th>
                      <th className="py-2.5 px-3">质控物批号</th>
                      <th className="py-2.5 px-3 text-right">质控结果</th>
                      <th className="py-2.5 px-3 text-right">靶值</th>
                      <th className="py-2.5 px-3 text-right">SD</th>
                      <th className="py-2.5 px-3 text-right">CV%</th>
                      <th className="py-2.5 px-3">失控规则</th>
                      <th className="py-2.5 px-3">操作人</th>
                      <th className="py-2.5 px-3">质控时间</th>
                      <th className="py-2.5 px-3">审核人</th>
                      <th className="py-2.5 px-3">审核时间</th>
                      <th className="py-2.5 px-3 text-center sticky right-0 bg-slate-100 shadow-l">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700 text-xs">
                    {filteredRecords.length > 0 ? (
                      filteredRecords.map((item, idx) => {
                        const isEven = idx % 2 === 0;
                        const isOut = item.qcStatus === '失控';
                        return (
                          <tr
                            key={item.id}
                            onClick={() => setSelectedDetailRecord(item)}
                            className={`hover:bg-sky-50/70 transition-colors cursor-pointer group ${
                              isOut
                                ? 'bg-rose-50/40'
                                : isEven
                                ? 'bg-white'
                                : 'bg-slate-50/40'
                            }`}
                          >
                            {/* 审核状态 */}
                            <td className="py-2 px-3 text-center">
                              {item.auditStatus === '已审' ? (
                                <span className="px-2 py-0.5 rounded text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200">
                                  已审
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded text-[11px] font-medium text-slate-500 bg-slate-100">
                                  未审
                                </span>
                              )}
                            </td>

                            {/* 质控状态 */}
                            <td className="py-2 px-3 text-center">
                              {item.qcStatus === '失控' ? (
                                <span className="px-2 py-0.5 rounded text-[11px] font-bold text-rose-700 bg-rose-100 border border-rose-200 animate-pulse">
                                  失控
                                </span>
                              ) : item.qcStatus === '警告' ? (
                                <span className="px-2 py-0.5 rounded text-[11px] font-bold text-amber-700 bg-amber-100 border border-amber-200">
                                  警告
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200">
                                  在控
                                </span>
                              )}
                            </td>

                            {/* 质控项目 */}
                            <td className="py-2 px-3 font-semibold text-slate-900 group-hover:text-sky-700">
                              {item.testItem}
                            </td>

                            {/* 水平 */}
                            <td className="py-2 px-2 text-center font-mono">
                              <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-100 text-slate-700 font-bold">
                                {item.level}
                              </span>
                            </td>

                            {/* 质控物批号 */}
                            <td className="py-2 px-3 font-mono text-slate-600">
                              {item.lotNo}
                            </td>

                            {/* 质控结果 */}
                            <td
                              className={`py-2 px-3 text-right font-mono font-bold text-sm ${
                                isOut ? 'text-rose-600' : 'text-slate-900'
                              }`}
                            >
                              {item.qcResult.toFixed(2)}
                            </td>

                            {/* 靶值 */}
                            <td className="py-2 px-3 text-right font-mono text-slate-700">
                              {item.targetVal.toFixed(2)}
                            </td>

                            {/* SD */}
                            <td className="py-2 px-3 text-right font-mono text-slate-600">
                              {item.sdVal.toFixed(2)}
                            </td>

                            {/* CV% */}
                            <td className="py-2 px-3 text-right font-mono text-slate-600">
                              {item.cvVal.toFixed(2)}%
                            </td>

                            {/* 失控规则 */}
                            <td className="py-2 px-3">
                              {item.westgardRule.includes('1-3S') || item.westgardRule.includes('1-2S') ? (
                                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-100 text-rose-700 border border-rose-200">
                                  {item.westgardRule}
                                </span>
                              ) : (
                                <span className="text-slate-400 font-mono">-</span>
                              )}
                            </td>

                            {/* 操作人 (真实人名) */}
                            <td className="py-2 px-3 font-medium text-slate-800">
                              {item.operator}
                            </td>

                            {/* 质控时间 (近期) */}
                            <td className="py-2 px-3 font-mono text-slate-600 text-[11px]">
                              {item.qcTime}
                            </td>

                            {/* 审核人 (真实人名) */}
                            <td className="py-2 px-3 font-medium text-slate-800">
                              {item.auditor || <span className="text-slate-400 font-mono">-</span>}
                            </td>

                            {/* 审核时间 */}
                            <td className="py-2 px-3 font-mono text-slate-600 text-[11px]">
                              {item.auditTime || <span className="text-slate-400 font-mono">-</span>}
                            </td>

                            {/* 操作 */}
                            <td
                              className="py-2 px-3 text-center sticky right-0 bg-white group-hover:bg-sky-50/70 shadow-l"
                              onClick={e => e.stopPropagation()}
                            >
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  onClick={() => setEditingRecord(item)}
                                  className="text-sky-600 hover:text-sky-800 font-medium hover:underline text-[11px]"
                                >
                                  编辑
                                </button>
                                <span className="text-slate-300">|</span>
                                <button
                                  onClick={() => handleDeleteRecord(item.id, item.testItem)}
                                  className="text-rose-600 hover:text-rose-800 font-medium hover:underline text-[11px]"
                                >
                                  删除
                                </button>
                                {isOut && (
                                  <>
                                    <span className="text-slate-300">|</span>
                                    <button
                                      onClick={() => {
                                        setActiveOutControlRecord(item);
                                        setShowOutControlModal(true);
                                      }}
                                      className="px-1.5 py-0.2 rounded bg-rose-600 text-white font-bold hover:bg-rose-700 text-[10px]"
                                    >
                                      失控处置
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={15} className="py-12 text-center text-slate-400">
                          <AlertTriangle className="w-6 h-6 mx-auto mb-2 text-slate-300" />
                          <span>未找到符合条件的质控测定记录</span>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Bottom Footer Bar */}
              <div className="bg-white border-t border-slate-200 px-4 py-2 flex items-center justify-between text-xs text-slate-600 shrink-0">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-slate-800">
                    合计: {filteredRecords.length} 条
                  </span>
                  <span className="text-slate-400">|</span>
                  <span className="text-slate-500">
                    当前仪器: <strong className="text-slate-700">{selectedDevice}</strong> · 当前质控物: {currentMaterial.name}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {outOfControlRecords.length > 0 && (
                    <button
                      onClick={() => {
                        setActiveOutControlRecord(outOfControlRecords[0]);
                        setShowOutControlModal(true);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-700 border border-rose-300 hover:bg-rose-200 transition-colors shadow-2xs font-semibold cursor-pointer animate-pulse"
                    >
                      <span className="w-2 h-2 rounded-full bg-rose-600" />
                      <span>{outOfControlRecords.length} 项失控待处理</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* TAB 2: 质控图 (Levey-Jennings L-J Chart) */
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-slate-50">
              {/* Chart Toolbar (matching screenshot 2) */}
              <div className="bg-white border-b border-slate-200 p-2.5 flex flex-wrap items-center justify-between gap-2 shadow-2xs">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1">
                    <span className="text-slate-500">仪器:</span>
                    <select
                      value={selectedDevice}
                      onChange={e => setSelectedDevice(e.target.value)}
                      className="bg-white border border-slate-300 rounded px-2 py-1 text-xs text-slate-700 focus:outline-none focus:border-sky-500 font-medium"
                    >
                      <option value="生化AU2700">生化AU2700</option>
                      <option value="罗氏 Cobas 8000 (c702)">罗氏 Cobas 8000 (c702)</option>
                      <option value="雅培 Alinity ci">雅培 Alinity ci</option>
                      <option value="贝克曼 AU5800">贝克曼 AU5800</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-1 bg-slate-50 border border-slate-300 rounded px-2 py-1">
                    <span className="text-slate-500">质控日期:</span>
                    <input
                      type="date"
                      value={chartDateRange.startDate}
                      onChange={e =>
                        setChartDateRange({ ...chartDateRange, startDate: e.target.value })
                      }
                      className="bg-transparent border-0 text-slate-700 text-xs focus:ring-0 p-0 font-mono"
                    />
                    <span className="text-slate-400 font-mono">~</span>
                    <input
                      type="date"
                      value={chartDateRange.endDate}
                      onChange={e =>
                        setChartDateRange({ ...chartDateRange, endDate: e.target.value })
                      }
                      className="bg-transparent border-0 text-slate-700 text-xs focus:ring-0 p-0 font-mono"
                    />
                  </div>

                  <div className="flex items-center gap-1">
                    <span className="text-slate-500">图形:</span>
                    <select
                      value={chartType}
                      onChange={e => setChartType(e.target.value as any)}
                      className="bg-white border border-slate-300 rounded px-2 py-1 text-xs text-slate-700 focus:outline-none focus:border-sky-500 font-medium"
                    >
                      <option value="L-J图">L-J图 (Levey-Jennings)</option>
                      <option value="Z-分数图">Z-分数图 (Z-Score)</option>
                      <option value="Youden图">Youden 优登双水平图</option>
                    </select>
                  </div>

                  {/* Single / Multi View Toggle */}
                  <div className="flex items-center bg-slate-100 p-0.5 rounded border border-slate-200">
                    <button
                      onClick={() => setChartLayout('single')}
                      className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                        chartLayout === 'single'
                          ? 'bg-sky-600 text-white font-semibold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      单图
                    </button>
                    <button
                      onClick={() => setChartLayout('multi')}
                      className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                        chartLayout === 'multi'
                          ? 'bg-sky-600 text-white font-semibold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      多图
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-blue-600" />
                      <span className="font-semibold text-slate-700">水平 1 (低值靶值: {currentQcItem.target1})</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-full bg-rose-600" />
                      <span className="font-semibold text-slate-700">水平 2 (高值靶值: {currentQcItem.target2})</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chart Canvas Area */}
              <div className="flex-1 min-h-0 overflow-y-auto p-4 flex flex-col gap-4">
                {/* SVG Levey-Jennings Chart */}
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs relative">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">
                        {selectedDevice} · {currentQcItem.name} ({currentQcItem.code}) L-J质控图
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Westgard多规则智能判定 · 质控跨度: 2026-10-01 至 2026-10-29 (共29次运行)
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                        在控判定率: 100.0%
                      </span>
                    </div>
                  </div>

                  {/* Interactive SVG Rendering */}
                  <div className="mt-4 relative h-64 sm:h-72 w-full">
                    <svg
                      className="w-full h-full"
                      viewBox="0 0 850 260"
                      preserveAspectRatio="none"
                    >
                      {/* Grid Lines (-3SD to +3SD) */}
                      {/* +3SD (y = 20) */}
                      <line x1="60" y1="20" x2="830" y2="20" stroke="#f43f5e" strokeDasharray="4 4" strokeWidth="1" />
                      <text x="50" y="24" fill="#f43f5e" fontSize="10" fontWeight="bold" textAnchor="end">+3SD</text>

                      {/* +2SD (y = 55) */}
                      <line x1="60" y1="55" x2="830" y2="55" stroke="#f59e0b" strokeDasharray="4 4" strokeWidth="1" />
                      <text x="50" y="59" fill="#f59e0b" fontSize="10" fontWeight="bold" textAnchor="end">+2SD</text>

                      {/* +1SD (y = 90) */}
                      <line x1="60" y1="90" x2="830" y2="90" stroke="#cbd5e1" strokeDasharray="2 2" strokeWidth="1" />
                      <text x="50" y="94" fill="#64748b" fontSize="10" textAnchor="end">+SD</text>

                      {/* X Mean Line (y = 125) */}
                      <line x1="60" y1="125" x2="830" y2="125" stroke="#0ea5e9" strokeWidth="1.5" />
                      <text x="50" y="129" fill="#0284c7" fontSize="11" fontWeight="bold" textAnchor="end">X (靶值)</text>

                      {/* -1SD (y = 160) */}
                      <line x1="60" y1="160" x2="830" y2="160" stroke="#cbd5e1" strokeDasharray="2 2" strokeWidth="1" />
                      <text x="50" y="164" fill="#64748b" fontSize="10" textAnchor="end">-SD</text>

                      {/* -2SD (y = 195) */}
                      <line x1="60" y1="195" x2="830" y2="195" stroke="#f59e0b" strokeDasharray="4 4" strokeWidth="1" />
                      <text x="50" y="199" fill="#f59e0b" fontSize="10" fontWeight="bold" textAnchor="end">-2SD</text>

                      {/* -3SD (y = 230) */}
                      <line x1="60" y1="230" x2="830" y2="230" stroke="#f43f5e" strokeDasharray="4 4" strokeWidth="1" />
                      <text x="50" y="234" fill="#f43f5e" fontSize="10" fontWeight="bold" textAnchor="end">-3SD</text>

                      {/* Baseline axis */}
                      <line x1="60" y1="240" x2="830" y2="240" stroke="#94a3b8" strokeWidth="1.5" />

                      {/* X-axis tick marks for days 1 to 29 */}
                      {INITIAL_LJ_PLOT_DATA.map((pt, idx) => {
                        const x = 70 + (idx * (820 - 70)) / 28;
                        return (
                          <g key={pt.day}>
                            <line x1={x} y1="240" x2={x} y2="245" stroke="#94a3b8" />
                            {(idx % 2 === 0 || idx === 28) && (
                              <text x={x} y="256" fill="#64748b" fontSize="9" textAnchor="middle" fontFamily="monospace">
                                {pt.day}
                              </text>
                            )}
                          </g>
                        );
                      })}

                      {/* Level 1 (Blue) Polyline Path */}
                      <polyline
                        fill="none"
                        stroke="#2563eb"
                        strokeWidth="2"
                        strokeLinejoin="round"
                        points={INITIAL_LJ_PLOT_DATA.map((pt, idx) => {
                          const x = 70 + (idx * (820 - 70)) / 28;
                          // map SD (-3 to +3) to y (230 to 20): y = 125 - sdDiff * 35
                          const y = Math.max(20, Math.min(230, 125 - pt.level1SdDiff * 35));
                          return `${x},${y}`;
                        }).join(' ')}
                      />

                      {/* Level 2 (Red) Polyline Path */}
                      <polyline
                        fill="none"
                        stroke="#e11d48"
                        strokeWidth="2"
                        strokeLinejoin="round"
                        points={INITIAL_LJ_PLOT_DATA.map((pt, idx) => {
                          const x = 70 + (idx * (820 - 70)) / 28;
                          const y = Math.max(20, Math.min(230, 125 - pt.level2SdDiff * 35));
                          return `${x},${y}`;
                        }).join(' ')}
                      />

                      {/* Level 1 Data Points (Blue Dots) */}
                      {INITIAL_LJ_PLOT_DATA.map((pt, idx) => {
                        const x = 70 + (idx * (820 - 70)) / 28;
                        const y = Math.max(20, Math.min(230, 125 - pt.level1SdDiff * 35));
                        return (
                          <circle
                            key={`l1-${pt.day}`}
                            cx={x}
                            cy={y}
                            r="4"
                            fill="#2563eb"
                            stroke="#ffffff"
                            strokeWidth="1.5"
                            className="cursor-pointer hover:r-6 transition-all"
                            onMouseEnter={() => setHoveredPoint(pt)}
                          />
                        );
                      })}

                      {/* Level 2 Data Points (Red Dots) */}
                      {INITIAL_LJ_PLOT_DATA.map((pt, idx) => {
                        const x = 70 + (idx * (820 - 70)) / 28;
                        const y = Math.max(20, Math.min(230, 125 - pt.level2SdDiff * 35));
                        return (
                          <circle
                            key={`l2-${pt.day}`}
                            cx={x}
                            cy={y}
                            r="4"
                            fill="#e11d48"
                            stroke="#ffffff"
                            strokeWidth="1.5"
                            className="cursor-pointer hover:r-6 transition-all"
                            onMouseEnter={() => setHoveredPoint(pt)}
                          />
                        );
                      })}
                    </svg>

                    {/* Tooltip on Hover */}
                    {hoveredPoint && (
                      <div className="absolute top-2 right-4 bg-slate-900/90 text-white p-2.5 rounded-lg shadow-lg text-[11px] font-mono border border-slate-700 animate-fadeIn pointer-events-none">
                        <div className="text-slate-300 font-sans font-semibold mb-1">
                          质控运行日期: {hoveredPoint.date} (第 {hoveredPoint.day} 日)
                        </div>
                        <div className="text-sky-300">
                          水平 1 实测: {hoveredPoint.level1Val} (偏离 {hoveredPoint.level1SdDiff >= 0 ? '+' : ''}
                          {hoveredPoint.level1SdDiff} SD)
                        </div>
                        <div className="text-rose-300">
                          水平 2 实测: {hoveredPoint.level2Val} (偏离 {hoveredPoint.level2SdDiff >= 0 ? '+' : ''}
                          {hoveredPoint.level2SdDiff} SD)
                        </div>
                        <div className="text-emerald-400 mt-1 font-sans">
                          判定状态: Westgard 全部规则在控
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Below Chart Summary Table (matching screenshot 2 bottom table) */}
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
                  <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 flex items-center justify-between">
                    <span className="font-semibold text-slate-800 text-xs">
                      {currentQcItem.name} 多水平质控统计累积值核算
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      CLIA &amp; ISO 15189 临床实验室室内质控评价
                    </span>
                  </div>

                  <table className="w-full text-left border-collapse text-xs">
                    <thead className="bg-slate-50 text-slate-600 text-[11px] border-b border-slate-200">
                      <tr>
                        <th className="py-2 px-3 font-semibold">水平</th>
                        <th className="py-2 px-3 font-semibold text-right">靶值</th>
                        <th className="py-2 px-3 font-semibold text-right">SD</th>
                        <th className="py-2 px-3 font-semibold text-right">变异系数CV%</th>
                        <th className="py-2 px-3 font-semibold text-right">当前均值</th>
                        <th className="py-2 px-3 font-semibold text-right">当前SD</th>
                        <th className="py-2 px-3 font-semibold text-right">当前CV%</th>
                        <th className="py-2 px-3 font-semibold text-right">累计均值</th>
                        <th className="py-2 px-3 font-semibold text-right">累计SD</th>
                        <th className="py-2 px-3 font-semibold text-right">累计CV%</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-800">
                      <tr className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-bold text-blue-600">
                          水平 1 (低值)
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-medium">
                          {currentQcItem.target1.toFixed(2)}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono">
                          {currentQcItem.sd1.toFixed(2)}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-emerald-600 font-semibold">
                          {currentQcItem.cv1.toFixed(2)}%
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-medium">
                          {(currentQcItem.target1 + 0.12).toFixed(2)}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono">
                          {(currentQcItem.sd1 - 0.04).toFixed(2)}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-emerald-600">
                          {(((currentQcItem.sd1 - 0.04) / (currentQcItem.target1 + 0.12)) * 100).toFixed(2)}%
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono">
                          {currentQcItem.target1.toFixed(2)}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono">
                          {currentQcItem.sd1.toFixed(2)}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-emerald-600">
                          {currentQcItem.cv1.toFixed(2)}%
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-bold text-rose-600">
                          水平 2 (高值)
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-medium">
                          {currentQcItem.target2.toFixed(2)}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono">
                          {currentQcItem.sd2.toFixed(2)}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-emerald-600 font-semibold">
                          {currentQcItem.cv2.toFixed(2)}%
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-medium">
                          {(currentQcItem.target2 + 0.25).toFixed(2)}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono">
                          {(currentQcItem.sd2 - 0.08).toFixed(2)}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-emerald-600">
                          {(((currentQcItem.sd2 - 0.08) / (currentQcItem.target2 + 0.25)) * 100).toFixed(2)}%
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono">
                          {currentQcItem.target2.toFixed(2)}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono">
                          {currentQcItem.sd2.toFixed(2)}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-emerald-600">
                          {currentQcItem.cv2.toFixed(2)}%
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ======================= Modals (右侧弹窗展示) ======================= */}

      {/* 1. Row Detail Modal */}
      {selectedDetailRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-scaleIn">
            <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-sky-600 flex items-center justify-center font-bold text-sm">
                  质
                </span>
                <div>
                  <h3 className="font-bold text-sm">
                    室内质控测定记录详情 · {selectedDetailRecord.testItem}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    仪器: {selectedDetailRecord.device} · 批号: {selectedDetailRecord.lotNo}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDetailRecord(null)}
                className="p-1 text-slate-400 hover:text-white rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <span className="text-slate-400 block">测定项目:</span>
                  <span className="font-semibold text-slate-900">{selectedDetailRecord.testItem}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">质控水平:</span>
                  <span className="font-semibold text-slate-900">水平 {selectedDetailRecord.level}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">质控实测值:</span>
                  <span
                    className={`font-mono font-bold text-sm ${
                      selectedDetailRecord.qcStatus === '失控' ? 'text-rose-600' : 'text-slate-900'
                    }`}
                  >
                    {selectedDetailRecord.qcResult.toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">设定靶值 (X):</span>
                  <span className="font-mono text-slate-900 font-semibold">{selectedDetailRecord.targetVal.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">标准差 (SD):</span>
                  <span className="font-mono text-slate-700">{selectedDetailRecord.sdVal.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">变异系数 (CV%):</span>
                  <span className="font-mono text-slate-700">{selectedDetailRecord.cvVal.toFixed(2)}%</span>
                </div>
                <div>
                  <span className="text-slate-400 block">质控判定状态:</span>
                  <span
                    className={`font-bold ${
                      selectedDetailRecord.qcStatus === '失控' ? 'text-rose-600' : 'text-emerald-700'
                    }`}
                  >
                    {selectedDetailRecord.qcStatus} ({selectedDetailRecord.westgardRule})
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">审核状态:</span>
                  <span className="font-medium text-slate-700">{selectedDetailRecord.auditStatus}</span>
                </div>
              </div>

              <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>操作检验人员: <strong className="text-slate-800">{selectedDetailRecord.operator}</strong></span>
                  <span>测定时间: <strong className="font-mono text-slate-800">{selectedDetailRecord.qcTime}</strong></span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>审核医师: <strong className="text-slate-800">{selectedDetailRecord.auditor || '待审'}</strong></span>
                  <span>审核时间: <strong className="font-mono text-slate-800">{selectedDetailRecord.auditTime || '待审'}</strong></span>
                </div>
              </div>

              {selectedDetailRecord.causeAnalysis && (
                <div className="bg-rose-50 p-3.5 rounded-lg border border-rose-200 space-y-2">
                  <h4 className="font-bold text-rose-900 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>失控原因根因分析与纠正措施</span>
                  </h4>
                  <div className="text-rose-800 leading-relaxed">
                    <strong>原因分析:</strong> {selectedDetailRecord.causeAnalysis}
                  </div>
                  <div className="text-rose-800 leading-relaxed">
                    <strong>纠偏措施:</strong> {selectedDetailRecord.correctiveAction}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex items-center justify-between shrink-0">
              <span className="text-[11px] text-slate-400 font-mono">
                编号: {selectedDetailRecord.id}
              </span>
              <button
                onClick={() => setSelectedDetailRecord(null)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded text-xs"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Out of Control Report Modal (失控报告与纠偏) */}
      {showOutControlModal && activeOutControlRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl border border-rose-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-scaleIn">
            <div className="bg-rose-700 text-white px-5 py-3.5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-white" />
                <h3 className="font-bold text-sm">
                  生化室间/室内质控失控报告与闭环纠正表
                </h3>
              </div>
              <button
                onClick={() => setShowOutControlModal(false)}
                className="p-1 text-rose-200 hover:text-white rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              <div className="p-3 bg-rose-50 rounded-lg border border-rose-200">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div>
                    <span className="text-rose-800 block text-[11px]">失控项目:</span>
                    <strong className="text-rose-950 text-sm">{activeOutControlRecord.testItem}</strong>
                  </div>
                  <div>
                    <span className="text-rose-800 block text-[11px]">触发规则:</span>
                    <strong className="text-rose-950 font-mono">{activeOutControlRecord.westgardRule}</strong>
                  </div>
                  <div>
                    <span className="text-rose-800 block text-[11px]">实测结果:</span>
                    <strong className="text-rose-600 font-mono text-sm">{activeOutControlRecord.qcResult}</strong>
                  </div>
                  <div>
                    <span className="text-rose-800 block text-[11px]">靶值区间:</span>
                    <span className="font-mono text-slate-800">
                      {activeOutControlRecord.targetVal} ± {(activeOutControlRecord.sdVal * 2).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-800 block">
                  1. 失控原因调查与排查（人、机、料、法、环）:
                </label>
                <textarea
                  rows={3}
                  defaultValue={activeOutControlRecord.causeAnalysis || '生化AU2700 钙试剂开瓶超过28天，试剂受空气中微量水分稀释降解，光度杯杯壁有微小气泡。'}
                  className="w-full p-2.5 border border-slate-300 rounded text-xs focus:outline-none focus:border-rose-500 font-sans leading-relaxed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-800 block">
                  2. 纠偏措施与复测验证:
                </label>
                <textarea
                  rows={3}
                  defaultValue={activeOutControlRecord.correctiveAction || '已更换全新批号 LOT-202610B 试剂，重新配制质控品复测，并清洗反应比色杯。复测结果为 2.26 mmol/L 在控。'}
                  className="w-full p-2.5 border border-slate-300 rounded text-xs focus:outline-none focus:border-rose-500 font-sans leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded border border-slate-200">
                <div>
                  <span className="text-slate-500 block">报告分析人:</span>
                  <span className="font-semibold text-slate-800">{activeOutControlRecord.operator} (检验师)</span>
                </div>
                <div>
                  <span className="text-slate-500 block">质控主管核签:</span>
                  <span className="font-semibold text-slate-800">蔡文斌 (副主任技师)</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex items-center justify-between shrink-0">
              <button
                onClick={() => triggerAction('已打印《室内质控失控处理闭环追溯表》')}
                className="flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 rounded text-slate-700 text-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>打印失控表</span>
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    // Update record to resolved
                    setQcRecords(prev =>
                      prev.map(r =>
                        r.id === activeOutControlRecord.id
                          ? { ...r, qcStatus: '在控', westgardRule: '在控 (已纠偏复测)' }
                          : r
                      )
                    );
                    setShowOutControlModal(false);
                    triggerAction(`失控项目《${activeOutControlRecord.testItem}》已完成纠偏闭环，重测在控！`);
                  }}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold shadow-xs"
                >
                  确认纠偏完成并消除失控
                </button>
                <button
                  onClick={() => setShowOutControlModal(false)}
                  className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 rounded text-xs"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. 审核数据弹窗 (Audit Data Modal - matching image_23c94ca1.png) */}
      {/* ============================================================== */}
      {showAuditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-300 w-full max-w-4xl max-h-[88vh] flex flex-col overflow-hidden animate-scaleIn text-xs">
            {/* Modal Header */}
            <div className="bg-slate-50 border-b border-slate-200 px-5 py-3 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-800">审核数据</span>
                <span className="text-[11px] text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                  待审质控测定记录
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAuditModal(false)}
                  className="px-4 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 rounded text-xs font-medium transition-colors"
                >
                  退出
                </button>
                <button
                  onClick={handleConfirmAuditModal}
                  className="px-5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>审核</span>
                </button>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="px-5 py-2.5 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-600 font-medium">质控日期:</span>
                  <input
                    type="date"
                    value={auditFilterDate}
                    onChange={e => setAuditFilterDate(e.target.value)}
                    className="border border-slate-300 rounded px-2 py-1 text-xs text-slate-800 bg-white font-mono focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-slate-600 font-medium">质控项目:</span>
                  <input
                    type="text"
                    placeholder="输入项目名称"
                    value={auditFilterProject}
                    onChange={e => setAuditFilterProject(e.target.value)}
                    className="border border-slate-300 rounded px-2.5 py-1 text-xs text-slate-800 bg-white w-36 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <button
                  onClick={() => triggerAction(`已按日期 ${auditFilterDate} 刷新待审质控测定记录`)}
                  className="px-3 py-1 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded text-xs font-medium transition-colors flex items-center gap-1"
                >
                  <Search className="w-3.5 h-3.5 text-slate-500" />
                  <span>查询</span>
                </button>
              </div>

              {/* Selection Summary and Quick Select */}
              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                <span>已选: <strong className="text-sky-700 font-bold">{selectedAuditIds.length}</strong> / {auditModalFilteredRecords.length} 项</span>
                <button
                  onClick={handleSelectAllAuditRows}
                  className="text-sky-600 hover:text-sky-800 hover:underline font-medium"
                >
                  {selectedAuditIds.length === auditModalFilteredRecords.length ? '取消全选' : '全部勾选'}
                </button>
                <span>·</span>
                <button
                  onClick={() => {
                    const unAudited = auditModalFilteredRecords.filter(r => r.auditStatus === '未审').map(r => r.id);
                    setSelectedAuditIds(unAudited);
                  }}
                  className="text-amber-700 hover:text-amber-900 hover:underline font-medium"
                >
                  仅选未审
                </button>
              </div>
            </div>

            {/* Table Area (matching image_23c94ca1.png) */}
            <div className="flex-1 min-h-0 overflow-auto bg-white">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-100 text-slate-700 font-semibold text-[11px] sticky top-0 border-b border-slate-200 z-10">
                  <tr>
                    <th className="py-2 px-3 text-center w-10">
                      <input
                        type="checkbox"
                        checked={auditModalFilteredRecords.length > 0 && selectedAuditIds.length === auditModalFilteredRecords.length}
                        onChange={handleSelectAllAuditRows}
                        className="rounded border-slate-300 text-sky-600 focus:ring-0 cursor-pointer"
                      />
                    </th>
                    <th className="py-2 px-2.5 text-center w-16">状态</th>
                    <th className="py-2 px-3">质控项目</th>
                    <th className="py-2 px-3">质控物</th>
                    <th className="py-2 px-3">生产厂商</th>
                    <th className="py-2 px-2 text-center w-14">水平</th>
                    <th className="py-2 px-2.5 font-mono">批号</th>
                    <th className="py-2 px-2.5 text-right font-mono">质控结果</th>
                    <th className="py-2 px-2.5 text-right font-mono">靶值</th>
                    <th className="py-2 px-2 text-right font-mono">SD</th>
                    <th className="py-2 px-2 text-right font-mono">CV</th>
                    <th className="py-2 px-2.5 text-center">质控状态</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {auditModalFilteredRecords.map(record => {
                    const isChecked = selectedAuditIds.includes(record.id);
                    return (
                      <tr
                        key={record.id}
                        onClick={() => handleToggleAuditRow(record.id)}
                        className={`cursor-pointer transition-colors ${
                          isChecked ? 'bg-sky-50/70 hover:bg-sky-100/60' : 'hover:bg-slate-50'
                        }`}
                      >
                        <td className="py-2 px-3 text-center" onClick={e => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleAuditRow(record.id)}
                            className="rounded border-slate-300 text-sky-600 focus:ring-0 cursor-pointer"
                          />
                        </td>
                        <td className="py-2 px-2.5 text-center">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              record.auditStatus === '已审'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : 'bg-amber-100 text-amber-800 border border-amber-200'
                            }`}
                          >
                            {record.auditStatus}
                          </span>
                        </td>
                        <td className="py-2 px-3 font-semibold text-slate-900">
                          {record.testItem}
                        </td>
                        <td className="py-2 px-3 text-slate-700">
                          {getRecordMaterialName(record)}
                        </td>
                        <td className="py-2 px-3 text-slate-600">
                          {getRecordManufacturer(record)}
                        </td>
                        <td className="py-2 px-2 text-center font-mono font-medium text-slate-700">
                          {record.level}
                        </td>
                        <td className="py-2 px-2.5 font-mono text-slate-600">
                          {record.lotNo}
                        </td>
                        <td className="py-2 px-2.5 text-right font-mono font-bold text-slate-900">
                          {record.qcResult}
                        </td>
                        <td className="py-2 px-2.5 text-right font-mono text-slate-600">
                          {record.targetVal}
                        </td>
                        <td className="py-2 px-2 text-right font-mono text-slate-600">
                          {record.sdVal}
                        </td>
                        <td className="py-2 px-2 text-right font-mono text-slate-600">
                          {record.cvVal}
                        </td>
                        <td className="py-2 px-2.5 text-center">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              record.qcStatus === '在控'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : record.qcStatus === '失控'
                                ? 'bg-rose-50 text-rose-700 border border-rose-200 animate-pulse'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            {record.qcStatus}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 border-t border-slate-200 px-5 py-2.5 flex items-center justify-between text-[11px] text-slate-500 shrink-0">
              <div className="flex items-center gap-3">
                <span>审核医师: <strong className="text-slate-800">蔡文斌</strong> (副主任技师)</span>
                <span>·</span>
                <span>当前审核日期: <strong className="text-slate-800">{auditFilterDate}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAuditModal(false)}
                  className="px-3 py-1 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 rounded text-xs"
                >
                  取消
                </button>
                <button
                  onClick={handleConfirmAuditModal}
                  className="px-4 py-1 bg-sky-600 hover:bg-sky-700 text-white rounded text-xs font-semibold shadow-xs"
                >
                  确认审核所选记录
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 4. 新增数据弹窗 (Add QC Data Matrix Modal - matching image_b970e816.png) */}
      {/* ============================================================== */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-300 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-scaleIn text-xs">
            {/* Modal Header */}
            <div className="bg-slate-50 border-b border-slate-200 px-5 py-3 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-800">新增数据</span>
                <span className="text-[11px] text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                  日常室内质控结果录入矩阵
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 rounded text-xs font-medium transition-colors"
                >
                  退出
                </button>
                <button
                  onClick={handleSaveAddModalMatrix}
                  className="px-5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>保存</span>
                </button>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="px-5 py-2.5 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-600 font-medium">质控日期:</span>
                  <input
                    type="date"
                    value={addFilterDate}
                    onChange={e => setAddFilterDate(e.target.value)}
                    className="border border-slate-300 rounded px-2 py-1 text-xs text-slate-800 bg-white font-mono focus:outline-none focus:border-sky-500"
                  />
                </div>
                <button
                  onClick={() => triggerAction(`已更新质控矩阵基准日期至: ${addFilterDate}`)}
                  className="px-3 py-1 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded text-xs font-medium transition-colors"
                >
                  查询
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleQuickFillMatrix(ADD_MODAL_ITEMS[addSelectedItemIndex])}
                  className="px-2.5 py-1 bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-700 rounded text-xs font-medium transition-colors"
                >
                  快速填充参考靶值
                </button>
                <span className="text-[11px] text-slate-500">
                  检验技师: <strong className="text-slate-800">张珊</strong>
                </span>
              </div>
            </div>

            {/* Modal Body: Left Pane (QC Materials & Items) + Right Pane (15-day 4-run Matrix Table) */}
            <div className="flex-1 flex min-h-0 overflow-hidden">
              {/* Left Column: Two Sub-tables (质控物 + 质控项目) */}
              <div className="w-60 bg-white border-r border-slate-200 flex flex-col shrink-0">
                {/* Top Sub-Table: 质控物名称 & 水平数 */}
                <div className="flex-1 flex flex-col min-h-0 border-b border-slate-200 overflow-hidden">
                  <div className="overflow-y-auto flex-1">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-slate-100 text-slate-700 font-semibold text-[11px] sticky top-0 border-b border-slate-200">
                        <tr>
                          <th className="py-2 px-3 font-semibold">质控物名称</th>
                          <th className="py-2 px-2 text-center font-semibold w-16">水平数</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {ADD_MODAL_MATERIALS.map((mat) => {
                          const isSelected = addSelectedMaterialName === mat.name;
                          return (
                            <tr
                              key={mat.name}
                              onClick={() => {
                                setAddSelectedMaterialName(mat.name);
                                triggerAction(`已切换录入质控物: ${mat.name}`);
                              }}
                              className={`cursor-pointer transition-colors ${
                                isSelected
                                  ? 'bg-sky-50 text-sky-800 font-semibold border-l-2 border-sky-600'
                                  : 'hover:bg-slate-50 text-slate-700'
                              }`}
                            >
                              <td className="py-2 px-3 truncate" title={mat.name}>
                                {mat.name}
                              </td>
                              <td className="py-2 px-2 text-center font-mono font-medium text-slate-600">
                                {mat.levelCount}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Bottom Sub-Table: 质控项目 & 水平 */}
                <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                  <div className="overflow-y-auto flex-1">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-slate-100 text-slate-700 font-semibold text-[11px] sticky top-0 border-b border-slate-200">
                        <tr>
                          <th className="py-2 px-3 font-semibold">质控项目</th>
                          <th className="py-2 px-2 text-center font-semibold w-16">水平</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {ADD_MODAL_ITEMS.map((item, idx) => {
                          const isSelected = addSelectedItemIndex === idx;
                          return (
                            <tr
                              key={`${item.code}_${item.level}`}
                              onClick={() => {
                                setAddSelectedItemIndex(idx);
                                triggerAction(`已切换录入项目: ${item.name} (水平 ${item.level})`);
                              }}
                              className={`cursor-pointer transition-colors ${
                                isSelected
                                  ? 'bg-sky-50 text-sky-800 font-semibold border-l-2 border-sky-600'
                                  : 'hover:bg-slate-50 text-slate-700'
                              }`}
                            >
                              <td className="py-2 px-3 font-medium text-slate-800">
                                {item.name}
                              </td>
                              <td className="py-2 px-2 text-center font-mono font-semibold text-slate-600">
                                {item.level}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Right Column: Daily Run Matrix Table (matching image_b970e816.png) */}
              <div className="flex-1 flex flex-col min-h-0 bg-white overflow-hidden">
                {/* Active Item Ribbon */}
                <div className="px-4 py-1.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-[11px] text-slate-600 shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">当前项目:</span>
                    <span className="font-bold text-sky-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {ADD_MODAL_ITEMS[addSelectedItemIndex].name} (水平 {ADD_MODAL_ITEMS[addSelectedItemIndex].level})
                    </span>
                    <span className="text-slate-400">·</span>
                    <span>靶值: <strong className="font-mono text-slate-800">{ADD_MODAL_ITEMS[addSelectedItemIndex].target}</strong></span>
                    <span className="text-slate-400">·</span>
                    <span>SD: <strong className="font-mono text-slate-800">{ADD_MODAL_ITEMS[addSelectedItemIndex].sd}</strong></span>
                    <span className="text-slate-400">·</span>
                    <span>批号: <strong className="font-mono text-slate-800">{ADD_MODAL_ITEMS[addSelectedItemIndex].lot}</strong></span>
                  </div>
                  <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-medium text-[10px]">
                    支持单元格直接输入测定数值
                  </span>
                </div>

                {/* 15 Days Run Matrix Table */}
                <div className="flex-1 min-h-0 overflow-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-100 text-slate-700 font-semibold text-[11px] sticky top-0 border-b border-slate-200 z-10">
                      <tr>
                        <th className="py-2 px-3 font-semibold w-28">日期</th>
                        <th className="py-2 px-3 font-semibold text-center">结果(第1次)</th>
                        <th className="py-2 px-3 font-semibold text-center">结果(第2次)</th>
                        <th className="py-2 px-3 font-semibold text-center">结果(第3次)</th>
                        <th className="py-2 px-3 font-semibold text-center">结果(第4次)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {addModalDates.map((dateStr, dIdx) => {
                        const curItem = ADD_MODAL_ITEMS[addSelectedItemIndex];
                        const key = `${curItem.code}_${curItem.level}_${dateStr}`;
                        const runs = matrixInputs[key] || { run1: '', run2: '', run3: '', run4: '' };
                        const isToday = dateStr === addFilterDate;

                        return (
                          <tr
                            key={dateStr}
                            className={`transition-colors ${
                              isToday ? 'bg-sky-50/60 font-semibold' : dIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'
                            } hover:bg-slate-100/60`}
                          >
                            <td className="py-2 px-3 font-mono text-slate-700 whitespace-nowrap">
                              <div className="flex items-center gap-1.5">
                                <span>{dateStr}</span>
                                {isToday && (
                                  <span className="px-1 py-0.2 rounded text-[9px] bg-sky-100 text-sky-800 font-bold">
                                    本日
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-1 px-2 text-center">
                              <input
                                type="text"
                                value={runs.run1}
                                onChange={e => handleMatrixInputChange(curItem.code, curItem.level, dateStr, 'run1', e.target.value)}
                                placeholder="--"
                                className="w-20 text-center font-mono py-1 px-1.5 border border-slate-200 rounded focus:outline-none focus:border-sky-500 focus:bg-white bg-slate-50/60 text-xs text-slate-800 transition-all font-semibold"
                              />
                            </td>
                            <td className="py-1 px-2 text-center">
                              <input
                                type="text"
                                value={runs.run2}
                                onChange={e => handleMatrixInputChange(curItem.code, curItem.level, dateStr, 'run2', e.target.value)}
                                placeholder="--"
                                className="w-20 text-center font-mono py-1 px-1.5 border border-slate-200 rounded focus:outline-none focus:border-sky-500 focus:bg-white bg-slate-50/60 text-xs text-slate-800 transition-all font-semibold"
                              />
                            </td>
                            <td className="py-1 px-2 text-center">
                              <input
                                type="text"
                                value={runs.run3}
                                onChange={e => handleMatrixInputChange(curItem.code, curItem.level, dateStr, 'run3', e.target.value)}
                                placeholder="--"
                                className="w-20 text-center font-mono py-1 px-1.5 border border-slate-200 rounded focus:outline-none focus:border-sky-500 focus:bg-white bg-slate-50/60 text-xs text-slate-800 transition-all font-semibold"
                              />
                            </td>
                            <td className="py-1 px-2 text-center">
                              <input
                                type="text"
                                value={runs.run4}
                                onChange={e => handleMatrixInputChange(curItem.code, curItem.level, dateStr, 'run4', e.target.value)}
                                placeholder="--"
                                className="w-20 text-center font-mono py-1 px-1.5 border border-slate-200 rounded focus:outline-none focus:border-sky-500 focus:bg-white bg-slate-50/60 text-xs text-slate-800 transition-all font-semibold"
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Modal Bottom Status Bar */}
            <div className="bg-slate-50 border-t border-slate-200 px-5 py-2.5 flex items-center justify-between text-[11px] text-slate-500 shrink-0">
              <div className="flex items-center gap-3">
                <span>仪器: <strong className="text-slate-800">{selectedDevice}</strong></span>
                <span>·</span>
                <span>操作检验师: <strong className="text-slate-800">张珊</strong> (主管技师)</span>
                <span>·</span>
                <span>数据周期: <strong className="font-mono text-slate-800">{addModalDates[0]}</strong> 至 <strong className="font-mono text-slate-800">{addModalDates[addModalDates.length - 1]}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 rounded text-xs"
                >
                  取消
                </button>
                <button
                  onClick={handleSaveAddModalMatrix}
                  className="px-4 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold shadow-xs"
                >
                  保存并入库
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Edit QC Record Modal */}
      {editingRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden animate-scaleIn">
            <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between shrink-0">
              <h3 className="font-bold text-sm">编辑质控测定数据 · {editingRecord.testItem}</h3>
              <button
                onClick={() => setEditingRecord(null)}
                className="p-1 text-slate-400 hover:text-white rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-3 text-xs">
              <div>
                <label className="text-slate-600 block mb-1">质控实测值:</label>
                <input
                  type="number"
                  step="0.01"
                  value={editingRecord.qcResult}
                  onChange={e => setEditingRecord({ ...editingRecord, qcResult: Number(e.target.value) })}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 font-mono text-sm font-bold text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-600 block mb-1">靶值 (X):</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingRecord.targetVal}
                    onChange={e => setEditingRecord({ ...editingRecord, targetVal: Number(e.target.value) })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="text-slate-600 block mb-1">标准差 (SD):</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingRecord.sdVal}
                    onChange={e => setEditingRecord({ ...editingRecord, sdVal: Number(e.target.value) })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-600 block mb-1">操作技师 (真实人名):</label>
                <input
                  type="text"
                  value={editingRecord.operator}
                  onChange={e => setEditingRecord({ ...editingRecord, operator: e.target.value })}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs font-semibold"
                />
              </div>
            </div>

            <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex items-center justify-end gap-2 shrink-0">
              <button
                onClick={() => setEditingRecord(null)}
                className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 rounded text-xs"
              >
                取消
              </button>
              <button
                onClick={handleSaveEditRecord}
                className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded text-xs font-semibold shadow-xs"
              >
                保存修改
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Monthly QC Report Modal (月度报告) */}
      {showMonthlyReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-scaleIn">
            <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="font-bold text-sm">2026年10月份临床生化室内质控 (IQC) 月度汇总报告</h3>
                  <p className="text-[11px] text-slate-400">
                    市中心医院检验科 · 仪器: {selectedDevice} · 评价周期: 2026-10-01 至 2026-10-29
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowMonthlyReportModal(false)}
                className="p-1 text-slate-400 hover:text-white rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-slate-50 rounded border border-slate-200 text-center">
                  <span className="text-slate-500 block">在控项目总数</span>
                  <strong className="text-xl font-bold font-mono text-slate-900 mt-1 block">8 / 8 项</strong>
                  <span className="text-[10px] text-emerald-600">在控率 100.0%</span>
                </div>
                <div className="p-3 bg-slate-50 rounded border border-slate-200 text-center">
                  <span className="text-slate-500 block">月度质控测定次数</span>
                  <strong className="text-xl font-bold font-mono text-slate-900 mt-1 block">464 次</strong>
                  <span className="text-[10px] text-slate-500">双水平每天运行</span>
                </div>
                <div className="p-3 bg-slate-50 rounded border border-slate-200 text-center">
                  <span className="text-slate-500 block">失控纠偏记录</span>
                  <strong className="text-xl font-bold font-mono text-amber-600 mt-1 block">1 例</strong>
                  <span className="text-[10px] text-emerald-600">已全部复测闭环</span>
                </div>
                <div className="p-3 bg-slate-50 rounded border border-slate-200 text-center">
                  <span className="text-slate-500 block">平均变异系数 CV%</span>
                  <strong className="text-xl font-bold font-mono text-emerald-600 mt-1 block">2.62%</strong>
                  <span className="text-[10px] text-emerald-600">优于国家1/3 TEa标准</span>
                </div>
              </div>

              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-semibold text-[11px] border-b border-slate-200">
                    <tr>
                      <th className="py-2 px-3">项目代码</th>
                      <th className="py-2 px-3">项目名称</th>
                      <th className="py-2 px-3 text-right">当月均值</th>
                      <th className="py-2 px-3 text-right">当月SD</th>
                      <th className="py-2 px-3 text-right">变异系数CV%</th>
                      <th className="py-2 px-3 text-center">1/3 TEa标准</th>
                      <th className="py-2 px-3 text-center">评价等级</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-800">
                    {QC_TEST_ITEMS.map(it => (
                      <tr key={it.code} className="hover:bg-slate-50">
                        <td className="py-2 px-3 font-mono">{it.code}</td>
                        <td className="py-2 px-3 font-medium">{it.name}</td>
                        <td className="py-2 px-3 text-right font-mono">{it.target1.toFixed(2)}</td>
                        <td className="py-2 px-3 text-right font-mono">{it.sd1.toFixed(2)}</td>
                        <td className="py-2 px-3 text-right font-mono font-semibold text-emerald-600">
                          {it.cv1.toFixed(2)}%
                        </td>
                        <td className="py-2 px-3 text-center font-mono text-slate-500">&lt; 4.0%</td>
                        <td className="py-2 px-3 text-center">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            优秀
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-3 bg-sky-50 rounded-lg border border-sky-200 text-sky-900 leading-relaxed text-[11px]">
                <strong>质控结论与技术签名:</strong> 本月生化AU2700分析仪各项室内质控表现优良，精密度与稳定性符合国家临床检验中心(NCCL)及ISO 15189要求。
                核签人: <strong>蔡文斌</strong> (副主任技师 / 质控组长) · 签发日期: <strong>2026-10-29</strong>
              </div>
            </div>

            <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex items-center justify-between shrink-0">
              <button
                onClick={() => triggerAction('已生成并导出2026年10月份室内质控月度汇总分析PDF')}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>导出月度报告 (PDF/Excel)</span>
              </button>
              <button
                onClick={() => setShowMonthlyReportModal(false)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded text-xs"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
