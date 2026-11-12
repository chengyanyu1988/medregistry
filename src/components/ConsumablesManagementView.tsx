import React, { useState, useMemo } from 'react';
import {
  Boxes,
  Search,
  Plus,
  RefreshCw,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Trash2,
  Edit,
  Save,
  Download,
  Upload,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  X,
  FileText,
  Activity,
  Layers,
  Building2,
  User,
  Sliders,
  DollarSign,
  TrendingUp,
  BarChart3,
  CalendarCheck,
  Check,
  Archive,
  Settings,
  Folder,
  FolderOpen,
  Printer,
  RotateCcw,
  FileCheck,
  Eye,
} from './MenuIcon';
import { UserProfile } from '../types/navigation';
import { ReagentInboundManagementView } from './ReagentInboundManagementView';
import { ReagentRequisitionManagementView } from './ReagentRequisitionManagementView';
import { ReagentTransferManagementView } from './ReagentTransferManagementView';
import { ReagentUsageManagementView } from './ReagentUsageManagementView';
import { ReagentLossManagementView } from './ReagentLossManagementView';
import { ReagentInventoryCheckManagementView } from './ReagentInventoryCheckManagementView';
import { ReagentStockQueryManagementView } from './ReagentStockQueryManagementView';

export interface ConsumablesManagementViewProps {
  subId?: string;
  user?: UserProfile;
  triggerAction: (msg: string) => void;
  onSelectSubMenu?: (subId: string) => void;
}

// 12 Submenu Definitions matching image_f1236d0f.png
export const CONSUMABLES_SUBMENUS = [
  { id: 'reagent-dict', label: '试剂字典', icon: 'BookOpen', desc: '试剂耗材基础主数据、储存条件与标准包装' },
  { id: 'reagent-usage-config', label: '试剂使用配置', icon: 'Sliders', desc: '仪器通道绑定、单测试理论消耗量与扣减规则' },
  { id: 'procurement-demand', label: '采购需求管理', icon: 'FilePlus', desc: '各检验科室日常与急查耗材采购申请汇总' },
  { id: 'procurement-plan', label: '采购计划管理', icon: 'ClipboardCheck', desc: '院内耗材月度/周度采购计划编制与审批' },
  { id: 'reagent-inbound', label: '试剂入库管理', icon: 'PackagePlus', desc: '供货验收、批号录入、冷链温度记录与扫码入库' },
  { id: 'reagent-requisition', label: '试剂申领管理', icon: 'Share2', desc: '临床实验室与采血中心领料申请及出库发放' },
  { id: 'reagent-transfer', label: '试剂调拨管理', icon: 'ArrowRightLeft', desc: '院区与各专业检验组之间的紧急调配转拨' },
  { id: 'reagent-usage', label: '试剂使用管理', icon: 'PlayCircle', desc: '仪器上机登记、开瓶有效期跟踪与实测损耗' },
  { id: 'reagent-loss', label: '试剂报损管理', icon: 'AlertOctagon', desc: '破损、失效、质控报废与非正常消耗登记审批' },
  { id: 'reagent-inventory-check', label: '试剂盘点管理', icon: 'CheckSquare', desc: '月度周期盘点、账实核对、盈亏调整与平账' },
  { id: 'reagent-stock-query', label: '试剂库存查询', icon: 'Database', desc: '批号级实时动态库存、效期预警与安全线监控' },
  { id: 'reagent-stat-analysis', label: '试剂统计分析', icon: 'TrendingUp', desc: '消耗趋势、人份成本核算、科室占比与效期风险' },
];

export const ConsumablesManagementView: React.FC<ConsumablesManagementViewProps> = ({
  subId = 'reagent-dict',
  user,
  triggerAction,
  onSelectSubMenu,
}) => {
  // Current active sub-module
  const [activeSubId, setActiveSubId] = useState<string>(subId);

  // Sync if prop changes
  React.useEffect(() => {
    if (subId && subId !== activeSubId) {
      setActiveSubId(subId);
    }
  }, [subId]);

  const handleSubMenuClick = (newSubId: string) => {
    setActiveSubId(newSubId);
    if (onSelectSubMenu) {
      onSelectSubMenu(newSubId);
    }
    const target = CONSUMABLES_SUBMENUS.find(m => m.id === newSubId);
    triggerAction(`切换到耗材管理子菜单：${target?.label || newSubId}`);
  };

  // Hospital Unit Selector
  const [selectedHospitalUnit, setSelectedHospitalUnit] = useState<string>('中心医院');
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  // Toast
  const [toast, setToast] = useState<string | null>(null);
  const showNotice = (msg: string) => {
    setToast(msg);
    triggerAction(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // Current active submenu meta
  const currentSubMenu = useMemo(() => {
    return CONSUMABLES_SUBMENUS.find(s => s.id === activeSubId) || CONSUMABLES_SUBMENUS[0];
  }, [activeSubId]);

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-slate-100 overflow-hidden text-xs">
      {/* Toast */}
      {toast && (
        <div className="fixed top-20 right-8 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2 border border-slate-700 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}



      {/* Main Content Workspace for Active Submenu */}
      <div className="flex-1 p-3 overflow-hidden flex flex-col min-h-0">
        {activeSubId === 'reagent-dict' && (
          <ReagentDictionarySubView
            hospitalUnit={selectedHospitalUnit}
            showNotice={showNotice}
          />
        )}
        {activeSubId === 'reagent-usage-config' && (
          <ReagentUsageConfigSubView
            hospitalUnit={selectedHospitalUnit}
            showNotice={showNotice}
          />
        )}
        {activeSubId === 'procurement-demand' && (
          <ProcurementDemandSubView
            hospitalUnit={selectedHospitalUnit}
            showNotice={showNotice}
          />
        )}
        {activeSubId === 'procurement-plan' && (
          <ProcurementPlanSubView
            hospitalUnit={selectedHospitalUnit}
            showNotice={showNotice}
          />
        )}
        {activeSubId === 'reagent-inbound' && (
          <ReagentInboundManagementView
            hospitalUnit={selectedHospitalUnit}
            showNotice={showNotice}
          />
        )}
        {activeSubId === 'reagent-requisition' && (
          <ReagentRequisitionManagementView
            hospitalUnit={selectedHospitalUnit}
            showNotice={showNotice}
          />
        )}
        {activeSubId === 'reagent-transfer' && (
          <ReagentTransferManagementView
            hospitalUnit={selectedHospitalUnit}
            showNotice={showNotice}
          />
        )}
        {activeSubId === 'reagent-usage' && (
          <ReagentUsageManagementView
            hospitalUnit={selectedHospitalUnit}
            showNotice={showNotice}
          />
        )}
        {activeSubId === 'reagent-loss' && (
          <ReagentLossManagementView
            hospitalUnit={selectedHospitalUnit}
            showNotice={showNotice}
          />
        )}
        {activeSubId === 'reagent-inventory-check' && (
          <ReagentInventoryCheckManagementView
            hospitalUnit={selectedHospitalUnit}
            showNotice={showNotice}
          />
        )}
        {activeSubId === 'reagent-stock-query' && (
          <ReagentStockQueryManagementView
            hospitalUnit={selectedHospitalUnit}
            showNotice={showNotice}
          />
        )}
        {activeSubId === 'reagent-stat-analysis' && (
          <ReagentStatAnalysisSubView
            hospitalUnit={selectedHospitalUnit}
            showNotice={showNotice}
          />
        )}
      </div>
    </div>
  );
};

// =========================================================================
// 1. 试剂字典 子页面 (基于截图 image_39b4c2c5.png 重新排版与交互升级)
// =========================================================================

interface ReagentItem {
  id: string;
  code: string; // 物资编码
  name: string; // 物资名称
  categoryKey: string; // 归属分类
  categoryName: string;
  spec: string; // 规格
  vendor: string; // 生产厂商
  unit: string; // 计量单位
  auxUnit: string; // 辅助计量单位
  price: number; // 单价
  createDate: string; // 建档日期 (近期 2026年10月)
  status: '启用' | '停用'; // 状态
  creator: string; // 真实建档人
  storageCondition?: string; // 储存条件
  regNo?: string; // 医疗器械注册证号
  pinyin?: string; // 助记码
}

const INITIAL_REAGENT_ITEMS: ReagentItem[] = [
  {
    id: 'ITEM-001',
    code: '010012',
    name: '人字铝合金医用双面防滑梯',
    categoryKey: 'EQUIPMENT_MAINT',
    categoryName: '实验室环境与维保设备',
    spec: '2.0米 载重150kg 绝缘防滑',
    vendor: '上海雷都医用器材工程有限公司',
    unit: '架',
    auxUnit: '台',
    price: 380.0,
    createDate: '2026-10-15',
    status: '启用',
    creator: '刘浩然技师',
    storageCondition: '常温干燥',
    regNo: '沪械备20210089',
    pinyin: 'RZLHYYSMPHT',
  },
  {
    id: 'ITEM-002',
    code: '010013',
    name: '实验室防静电耐酸碱红色地垫',
    categoryKey: 'GENERAL',
    categoryName: '一般医用耗材',
    spec: '1.5m×1.2m×5mm 阻燃级',
    vendor: '江苏三泰洁净技术有限公司',
    unit: '张',
    auxUnit: '块',
    price: 168.0,
    createDate: '2026-10-16',
    status: '停用',
    creator: '魏明主管检验师',
    storageCondition: '常温避光',
    regNo: '苏械备20220145',
    pinyin: 'SYSFJDNSRSDD',
  },
  {
    id: 'ITEM-003',
    code: '010015',
    name: '复合多参数生化室内质控血清 (水平1/2/3套装)',
    categoryKey: 'QC',
    categoryName: '质控试剂',
    spec: '5ml×6支/盒 冻干粉',
    vendor: '罗氏诊断产品(上海)有限公司',
    unit: '盒',
    auxUnit: '支',
    price: 860.0,
    createDate: '2026-10-18',
    status: '启用',
    creator: '郭彩霞主任医师',
    storageCondition: '2~8℃避光冷藏',
    regNo: '国械注进20232400192',
    pinyin: 'FHDCSHLZKXQ',
  },
  {
    id: 'ITEM-004',
    code: '010018',
    name: '全自动化学发光高敏肌钙蛋白I(hs-cTnI)检测试剂盒',
    categoryKey: 'HIGH_VALUE',
    categoryName: '高值医用耗材',
    spec: '100测试/盒 磁微粒发光',
    vendor: '雅培贸易(上海)有限公司',
    unit: '盒',
    auxUnit: '人份',
    price: 2450.0,
    createDate: '2026-10-20',
    status: '启用',
    creator: '李晓红副主任技师',
    storageCondition: '2~8℃冷藏',
    regNo: '国械注进20223400512',
    pinyin: 'QZDHXFGGSMJDBI',
  },
  {
    id: 'ITEM-005',
    code: '010022',
    name: '一次性使用负压真空采血管 (促凝红帽 5ml)',
    categoryKey: 'GENERAL',
    categoryName: '一般医用耗材',
    spec: '100支/盒 13×100mm 聚酯无热原',
    vendor: '威高集团医用高分子制品股份有限公司',
    unit: '盒',
    auxUnit: '支',
    price: 65.0,
    createDate: '2026-10-21',
    status: '启用',
    creator: '赵雅琴主管护师',
    storageCondition: '10~30℃常温干燥',
    regNo: '国械注准20213220455',
    pinyin: 'YCXZKQCGHM',
  },
  {
    id: 'ITEM-006',
    code: '010028',
    name: '丙氨酸氨基转移酶(ALT/GPT)测定试剂盒(IFCC速率法)',
    categoryKey: 'CHEM_REAGENT',
    categoryName: '临床检验化学试剂',
    spec: 'R1: 4×60ml, R2: 4×15ml 液体双试剂',
    vendor: '迈克生物股份有限公司',
    unit: '盒',
    auxUnit: '测试',
    price: 320.0,
    createDate: '2026-10-23',
    status: '启用',
    creator: '陈康主管检验师',
    storageCondition: '2~8℃避光冷藏',
    regNo: '国械注准20222400128',
    pinyin: 'BASAJZYMCDSJH',
  },
  {
    id: 'ITEM-007',
    code: '010031',
    name: '全自动生化分析仪酸性浓缩清洗液',
    categoryKey: 'CHEM_REAGENT',
    categoryName: '临床检验化学试剂',
    spec: '5000ml/桶 原装配套高效型',
    vendor: '贝克曼库尔特商贸(中国)有限公司',
    unit: '桶',
    auxUnit: '瓶',
    price: 430.0,
    createDate: '2026-10-24',
    status: '启用',
    creator: '刘浩然技师',
    storageCondition: '15~25℃常温',
    regNo: '国械注进20211400281',
    pinyin: 'QZDSHFXYXNQXY',
  },
  {
    id: 'ITEM-008',
    code: '010036',
    name: '全自动微生物鉴定药敏复合测试卡 (VITEK 2 GN)',
    categoryKey: 'QC',
    categoryName: '质控试剂',
    spec: '20卡/盒 密闭反应管微孔卡',
    vendor: '生物梅里埃(中国)有限公司',
    unit: '盒',
    auxUnit: '卡',
    price: 1180.0,
    createDate: '2026-10-25',
    status: '启用',
    creator: '郭彩霞主任医师',
    storageCondition: '2~8℃冷藏',
    regNo: '国械注进20222400115',
    pinyin: 'QZDWSWJDYMCSK',
  },
  {
    id: 'ITEM-009',
    code: '010042',
    name: '一次性使用无菌骨髓穿刺活检针 (带刻度手柄定位)',
    categoryKey: 'SURGICAL',
    categoryName: '手术器械',
    spec: '16G×70mm 50支/箱 环氧乙烷灭菌',
    vendor: '常州市康德医用器材有限公司',
    unit: '箱',
    auxUnit: '支',
    price: 1280.0,
    createDate: '2026-10-26',
    status: '启用',
    creator: '陈康主管检验师',
    storageCondition: '无菌常温密封',
    regNo: '国械注准20223140789',
    pinyin: 'YCYSYWJGSCZHJZ',
  },
  {
    id: 'ITEM-010',
    code: '010047',
    name: '全自动五分类血细胞分析仪专用稀释液 CELLPACK DCL',
    categoryKey: 'GENERAL',
    categoryName: '一般医用耗材',
    spec: '20L/箱 纸箱封装配吸液导管',
    vendor: '希森美康医用电子(上海)有限公司',
    unit: '箱',
    auxUnit: '桶',
    price: 520.0,
    createDate: '2026-10-27',
    status: '启用',
    creator: '钱宇恒技师',
    storageCondition: '15~30℃常温避光',
    regNo: '国械注进20202400331',
    pinyin: 'QZDWFLXXBFXYXSY',
  },
  {
    id: 'ITEM-011',
    code: '010055',
    name: '微柱凝胶血型检测抗人球蛋白复合卡 (ABO/RhD正反定型)',
    categoryKey: 'HIGH_VALUE',
    categoryName: '高值医用耗材',
    spec: '48卡/盒 6孔柱状微柱',
    vendor: '长春博迅生物技术有限责任公司',
    unit: '盒',
    auxUnit: '卡',
    price: 1650.0,
    createDate: '2026-10-28',
    status: '启用',
    creator: '李晓红副主任技师',
    storageCondition: '18~25℃避光室温',
    regNo: '国械注准20213400266',
    pinyin: 'WZNJXXJCKRQDBK',
  },
  {
    id: 'ITEM-012',
    code: '010064',
    name: '全自动流水线专用反应杯环形试剂转盘组件',
    categoryKey: 'EQUIPMENT_PARTS',
    categoryName: '检验分析仪器配件',
    spec: '60位/盘 耐酸碱特种树脂光学材质',
    vendor: '深圳迈瑞生物医疗电子股份有限公司',
    unit: '套',
    auxUnit: '件',
    price: 2800.0,
    createDate: '2026-10-29',
    status: '启用',
    creator: '魏明主管检验师',
    storageCondition: '干燥防震',
    regNo: '粤械注准20222220198',
    pinyin: 'QZDLSXZYFYBHXZP',
  },
  {
    id: 'ITEM-013',
    code: '010078',
    name: '全血凝血因子分析质控物 (异常水平II)',
    categoryKey: 'QC',
    categoryName: '质控试剂',
    spec: '1ml×10支/盒 冻干血浆基质',
    vendor: '沃芬医疗器械(北京)有限公司',
    unit: '盒',
    auxUnit: '支',
    price: 960.0,
    createDate: '2026-10-19',
    status: '停用',
    creator: '郭彩霞主任医师',
    storageCondition: '2~8℃冷藏',
    regNo: '国械注进20232400088',
    pinyin: 'QXNXYZFXZKW',
  },
  {
    id: 'ITEM-014',
    code: '010089',
    name: '一次性内窥镜用微型活检取样钳 (带齿椭圆钳口)',
    categoryKey: 'SURGICAL',
    categoryName: '手术器械',
    spec: '2.3mm×1800mm 20支/盒',
    vendor: '杭州安杰思医学科技股份有限公司',
    unit: '盒',
    auxUnit: '支',
    price: 2100.0,
    createDate: '2026-10-30',
    status: '启用',
    creator: '赵雅琴主管护师',
    storageCondition: '干燥无菌密封',
    regNo: '浙械注准20213140112',
    pinyin: 'YCYSYWXHJCQYQ',
  },
];

// Tree Node Hierarchy Definition
interface CategoryNode {
  key: string;
  label: string;
  children?: CategoryNode[];
}

const CATEGORY_TREE: CategoryNode[] = [
  {
    key: 'ALL',
    label: '所有器械',
    children: [
      {
        key: 'CONSUMABLES',
        label: '医用耗材',
        children: [
          { key: 'QC', label: '质控试剂' },
          { key: 'HIGH_VALUE', label: '高值医用耗材' },
          { key: 'GENERAL', label: '一般医用耗材' },
          { key: 'CHEM_REAGENT', label: '临床检验化学试剂' },
          { key: 'SURGICAL', label: '手术器械' },
        ],
      },
      {
        key: 'EQUIPMENT',
        label: '医疗仪器设备',
        children: [
          { key: 'EQUIPMENT_PARTS', label: '检验分析仪器配件' },
          { key: 'EQUIPMENT_MAINT', label: '实验室环境与维保设备' },
        ],
      },
    ],
  },
];

const ReagentDictionarySubView: React.FC<{
  hospitalUnit: string;
  showNotice: (m: string) => void;
}> = ({ hospitalUnit, showNotice }) => {
  // Tree & Filter State
  const [selectedCategoryKey, setSelectedCategoryKey] = useState<string>('ALL');
  const [selectedCategoryLabel, setSelectedCategoryLabel] = useState<string>('所有器械');
  const [expandedKeys, setExpandedKeys] = useState<Record<string, boolean>>({
    ALL: true,
    CONSUMABLES: true,
    EQUIPMENT: true,
  });

  // Top Filter state (matching screenshot: "器械信息" input, "停用" checkbox)
  const [keyword, setKeyword] = useState<string>('');
  const [onlyDisabled, setOnlyDisabled] = useState<boolean>(false);

  // Data state
  const [items, setItems] = useState<ReagentItem[]>(INITIAL_REAGENT_ITEMS);

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const [jumpPageInput, setJumpPageInput] = useState<string>('');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<ReagentItem | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState<boolean>(false);

  // Form state for Add/Edit
  const [formState, setFormState] = useState<{
    code: string;
    name: string;
    categoryKey: string;
    categoryName: string;
    spec: string;
    vendor: string;
    unit: string;
    auxUnit: string;
    price: string;
    status: '启用' | '停用';
    creator: string;
    storageCondition: string;
    regNo: string;
  }>({
    code: '',
    name: '',
    categoryKey: 'QC',
    categoryName: '质控试剂',
    spec: '',
    vendor: '',
    unit: '盒',
    auxUnit: '支',
    price: '0.00',
    status: '启用',
    creator: '郭彩霞主任医师',
    storageCondition: '2~8℃冷藏',
    regNo: '',
  });

  // Calculate count for each category key
  const countByCategory = useMemo(() => {
    const counts: Record<string, number> = {
      ALL: items.length,
      CONSUMABLES: 0,
      QC: 0,
      HIGH_VALUE: 0,
      GENERAL: 0,
      CHEM_REAGENT: 0,
      SURGICAL: 0,
      EQUIPMENT: 0,
      EQUIPMENT_PARTS: 0,
      EQUIPMENT_MAINT: 0,
    };

    items.forEach((item) => {
      if (counts[item.categoryKey] !== undefined) {
        counts[item.categoryKey]++;
      }
      // Grouping
      if (['QC', 'HIGH_VALUE', 'GENERAL', 'CHEM_REAGENT', 'SURGICAL'].includes(item.categoryKey)) {
        counts['CONSUMABLES']++;
      }
      if (['EQUIPMENT_PARTS', 'EQUIPMENT_MAINT'].includes(item.categoryKey)) {
        counts['EQUIPMENT']++;
      }
    });

    return counts;
  }, [items]);

  // Handle tree category selection
  const handleSelectCategory = (key: string, label: string) => {
    setSelectedCategoryKey(key);
    setSelectedCategoryLabel(label);
    setCurrentPage(1);
    const matchedCount = countByCategory[key] || 0;
    showNotice(`已切换分类：【${label}】，当前分类含 ${matchedCount} 项物资`);
  };

  // Toggle tree node expansion
  const toggleExpand = (key: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedKeys((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Filter items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // 1. Category Tree Filter
      if (selectedCategoryKey !== 'ALL') {
        if (selectedCategoryKey === 'CONSUMABLES') {
          if (!['QC', 'HIGH_VALUE', 'GENERAL', 'CHEM_REAGENT', 'SURGICAL'].includes(item.categoryKey)) {
            return false;
          }
        } else if (selectedCategoryKey === 'EQUIPMENT') {
          if (!['EQUIPMENT_PARTS', 'EQUIPMENT_MAINT'].includes(item.categoryKey)) {
            return false;
          }
        } else {
          if (item.categoryKey !== selectedCategoryKey) {
            return false;
          }
        }
      }

      // 2. Disabled Filter checkbox ("停用")
      if (onlyDisabled && item.status !== '停用') {
        return false;
      }

      // 3. Keyword search (Code, Name, Vendor, Pinyin, Spec)
      if (keyword.trim()) {
        const kw = keyword.trim().toLowerCase();
        const match =
          item.code.toLowerCase().includes(kw) ||
          item.name.toLowerCase().includes(kw) ||
          item.vendor.toLowerCase().includes(kw) ||
          item.spec.toLowerCase().includes(kw) ||
          (item.pinyin && item.pinyin.toLowerCase().includes(kw));
        if (!match) return false;
      }

      return true;
    });
  }, [items, selectedCategoryKey, onlyDisabled, keyword]);

  // Pagination calculation
  const totalRecords = filteredItems.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredItems.slice(start, start + pageSize);
  }, [filteredItems, currentPage, pageSize]);

  // Jump page handler
  const handleJumpPage = () => {
    const p = parseInt(jumpPageInput, 10);
    if (!isNaN(p) && p >= 1 && p <= totalPages) {
      setCurrentPage(p);
      setJumpPageInput('');
    } else {
      showNotice(`请输入有效的页码 (1 ~ ${totalPages})`);
    }
  };

  // Open Add Modal
  const handleOpenAddModal = () => {
    // Generate next sequential code
    const maxNum = items.reduce((max, it) => {
      const num = parseInt(it.code, 10);
      return !isNaN(num) && num > max ? num : max;
    }, 10090);
    const nextCode = (maxNum + 1).toString().padStart(6, '0');

    setFormState({
      code: nextCode,
      name: '',
      categoryKey: selectedCategoryKey === 'ALL' || selectedCategoryKey === 'CONSUMABLES' || selectedCategoryKey === 'EQUIPMENT' ? 'QC' : selectedCategoryKey,
      categoryName: selectedCategoryLabel === '所有器械' || selectedCategoryLabel === '医用耗材' || selectedCategoryLabel === '医疗仪器设备' ? '质控试剂' : selectedCategoryLabel,
      spec: '',
      vendor: '罗氏诊断产品(上海)有限公司',
      unit: '盒',
      auxUnit: '支',
      price: '180.00',
      status: '启用',
      creator: '郭彩霞主任医师',
      storageCondition: '2~8℃避光冷藏',
      regNo: '国械注准2026' + Math.floor(100000 + Math.random() * 900000),
    });
    setIsAddModalOpen(true);
  };

  // Save new Item
  const handleSaveAdd = () => {
    if (!formState.name.trim()) {
      showNotice('请输入物资名称！');
      return;
    }
    const newItem: ReagentItem = {
      id: `ITEM-${Date.now()}`,
      code: formState.code || '010099',
      name: formState.name.trim(),
      categoryKey: formState.categoryKey,
      categoryName: formState.categoryName,
      spec: formState.spec || '标准包装',
      vendor: formState.vendor || '通用供应商',
      unit: formState.unit || '盒',
      auxUnit: formState.auxUnit || '支',
      price: parseFloat(formState.price) || 0,
      createDate: '2026-10-30',
      status: formState.status,
      creator: formState.creator || '李晓红副主任技师',
      storageCondition: formState.storageCondition,
      regNo: formState.regNo,
      pinyin: formState.name.substring(0, 4).toUpperCase(),
    };

    setItems((prev) => [newItem, ...prev]);
    setIsAddModalOpen(false);
    showNotice(`成功新增器械物资：[${newItem.name}] (编码: ${newItem.code})`);
  };

  // Open Edit Modal
  const handleOpenEditModal = (item: ReagentItem) => {
    setEditingItem(item);
    setFormState({
      code: item.code,
      name: item.name,
      categoryKey: item.categoryKey,
      categoryName: item.categoryName,
      spec: item.spec,
      vendor: item.vendor,
      unit: item.unit,
      auxUnit: item.auxUnit,
      price: item.price.toString(),
      status: item.status,
      creator: item.creator,
      storageCondition: item.storageCondition || '2~8℃冷藏',
      regNo: item.regNo || '',
    });
    setIsEditModalOpen(true);
  };

  // Save Edit Item
  const handleSaveEdit = () => {
    if (!editingItem) return;
    if (!formState.name.trim()) {
      showNotice('请输入物资名称！');
      return;
    }

    setItems((prev) =>
      prev.map((it) => {
        if (it.id === editingItem.id) {
          return {
            ...it,
            name: formState.name.trim(),
            categoryKey: formState.categoryKey,
            categoryName: formState.categoryName,
            spec: formState.spec,
            vendor: formState.vendor,
            unit: formState.unit,
            auxUnit: formState.auxUnit,
            price: parseFloat(formState.price) || 0,
            status: formState.status,
            storageCondition: formState.storageCondition,
            regNo: formState.regNo,
          };
        }
        return it;
      })
    );
    setIsEditModalOpen(false);
    setEditingItem(null);
    showNotice(`已成功更新器械物资：[${formState.name}]`);
  };

  // Toggle item status
  const handleToggleStatus = (item: ReagentItem) => {
    const newStatus: '启用' | '停用' = item.status === '启用' ? '停用' : '启用';
    setItems((prev) =>
      prev.map((it) => (it.id === item.id ? { ...it, status: newStatus } : it))
    );
    showNotice(`已将物资 [${item.name}] 状态更改为：【${newStatus}】`);
  };

  // Delete item
  const handleDeleteItem = (item: ReagentItem) => {
    if (window.confirm(`确定要删除物资【${item.name}】(${item.code}) 吗？此操作无法撤销。`)) {
      setItems((prev) => prev.filter((it) => it.id !== item.id));
      showNotice(`已删除物资：[${item.name}]`);
    }
  };

  // Render Category Tree Item
  const renderCategoryNode = (node: CategoryNode, depth = 0) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = !!expandedKeys[node.key];
    const isSelected = selectedCategoryKey === node.key;
    const count = countByCategory[node.key] ?? 0;

    return (
      <div key={node.key} className="select-none">
        <div
          onClick={() => handleSelectCategory(node.key, node.label)}
          className={`flex items-center justify-between px-2 py-1.5 rounded cursor-pointer transition-colors text-xs ${
            isSelected
              ? 'bg-emerald-50 text-emerald-800 font-bold border-l-3 border-emerald-600 shadow-2xs'
              : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
          }`}
          style={{ paddingLeft: `${depth * 14 + 8}px` }}
        >
          <div className="flex items-center gap-1.5 truncate">
            {hasChildren ? (
              <button
                type="button"
                onClick={(e) => toggleExpand(node.key, e)}
                className="w-4 h-4 flex items-center justify-center text-slate-400 hover:text-slate-700 rounded"
              >
                {isExpanded ? (
                  <ChevronDown className="w-3.5 h-3.5" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5" />
                )}
              </button>
            ) : (
              <span className="w-4 h-4 flex items-center justify-center text-slate-300">•</span>
            )}

            {isExpanded ? (
              <FolderOpen className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-emerald-600' : 'text-amber-500'}`} />
            ) : (
              <Folder className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-emerald-600' : 'text-slate-400'}`} />
            )}

            <span className="truncate">{node.label}</span>
          </div>

          <span
            className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
              isSelected
                ? 'bg-emerald-600 text-white font-bold'
                : 'bg-slate-200 text-slate-600'
            }`}
          >
            {count}
          </span>
        </div>

        {hasChildren && isExpanded && (
          <div className="space-y-0.5 mt-0.5">
            {node.children!.map((child) => renderCategoryNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 flex-1 flex flex-col overflow-hidden shadow-xs">
      {/* Top Banner & Context */}
      <div className="px-4 py-2 bg-gradient-to-r from-slate-50 via-white to-emerald-50/40 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">试剂与器械主数据字典</h2>
          </div>
          <span className="text-slate-300">|</span>
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span className="text-slate-400">当前归属科室：</span>
            <span className="font-semibold text-slate-800">{hospitalUnit} · 医学检验中心耗材库</span>
          </div>
          <span className="text-slate-300">|</span>
          <div className="flex items-center gap-1 text-[11px] text-slate-500">
            <span>总物资：</span>
            <strong className="text-slate-800 font-mono">{items.length}</strong>
            <span className="ml-1 text-emerald-700 font-semibold">启用: {items.filter(i => i.status === '启用').length}</span>
            <span className="ml-1 text-rose-600 font-semibold">停用: {items.filter(i => i.status === '停用').length}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              showNotice(`已成功刷新试剂字典主数据缓存 (${hospitalUnit})`);
            }}
            className="px-2.5 py-1 text-xs border border-slate-300 text-slate-600 hover:bg-slate-50 rounded flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>刷新</span>
          </button>
          <button
            onClick={() => {
              showNotice(`已导出【${selectedCategoryLabel}】共 ${filteredItems.length} 条器械目录报表 (Excel/CSV)`);
            }}
            className="px-2.5 py-1 text-xs border border-slate-300 text-slate-600 hover:bg-slate-50 rounded flex items-center gap-1"
          >
            <Download className="w-3.5 h-3.5" />
            <span>导出目录</span>
          </button>
        </div>
      </div>

      {/* Main Split Layout: Left Category Tree + Right Table (Matching image_39b4c2c5.png) */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Left Tree Panel: 器械分类 */}
        <div className="w-64 border-r border-slate-200 bg-slate-50/70 flex flex-col shrink-0 overflow-hidden">
          {/* Header of Tree with "类型维护" button matching screenshot */}
          <div className="p-2.5 border-b border-slate-200 bg-white flex items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-1.5 font-bold text-slate-800 text-xs">
              <Layers className="w-4 h-4 text-emerald-600" />
              <span>器械分类</span>
            </div>
            <button
              onClick={() => setIsCategoryModalOpen(true)}
              className="text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 px-2 py-0.5 rounded text-xs flex items-center gap-1 font-medium transition-colors border border-emerald-200"
              title="器械分类字典维护与层级编辑"
            >
              <Settings className="w-3 h-3 text-emerald-600" />
              <span>类型维护</span>
            </button>
          </div>

          {/* Quick info tip */}
          <div className="px-3 py-1.5 bg-emerald-50/50 border-b border-emerald-100 text-[11px] text-emerald-800 flex items-center justify-between">
            <span>点击左侧分类筛选右侧物资</span>
            <span className="font-mono font-bold">{selectedCategoryLabel}</span>
          </div>

          {/* Category Tree Nodes */}
          <div className="flex-1 p-2 overflow-y-auto space-y-0.5">
            {CATEGORY_TREE.map((rootNode) => renderCategoryNode(rootNode, 0))}
          </div>

          {/* Bottom Tree Footer */}
          <div className="p-2.5 border-t border-slate-200 bg-white text-[11px] text-slate-500 space-y-1">
            <div className="flex items-center justify-between">
              <span>当前选中:</span>
              <span className="font-bold text-slate-800 truncate max-w-[130px]">{selectedCategoryLabel}</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>当前项匹配数:</span>
              <span className="font-mono font-bold text-emerald-600">{countByCategory[selectedCategoryKey] || 0} 项</span>
            </div>
          </div>
        </div>

        {/* Right Main Table Area: 器械目录 */}
        <div className="flex-1 flex flex-col min-w-0 bg-white overflow-hidden">
          {/* Top Filter Bar matching screenshot: 器械信息搜索, 停用勾选框, 新增按钮 */}
          <div className="p-3 border-b border-slate-200 bg-white flex flex-wrap items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-4 flex-wrap">
              {/* Search by "器械信息" */}
              <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-slate-700 whitespace-nowrap">
                  器械信息:
                </label>
                <div className="relative w-64">
                  <input
                    type="text"
                    value={keyword}
                    onChange={(e) => {
                      setKeyword(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="输入物资编码/名称/厂商/助记码..."
                    className="w-full border border-slate-300 rounded px-2.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 pr-7"
                  />
                  {keyword ? (
                    <button
                      onClick={() => setKeyword('')}
                      className="absolute right-2 top-1.5 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1.5" />
                  )}
                </div>
              </div>

              {/* "停用" checkbox matching screenshot */}
              <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={onlyDisabled}
                  onChange={(e) => {
                    setOnlyDisabled(e.target.checked);
                    setCurrentPage(1);
                    if (e.target.checked) {
                      showNotice('已筛选：仅显示停用物资');
                    } else {
                      showNotice('已恢复：显示全部物资');
                    }
                  }}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5 cursor-pointer"
                />
                <span className={onlyDisabled ? 'font-bold text-rose-700' : 'text-slate-600'}>
                  仅查看停用物资
                </span>
                {onlyDisabled && (
                  <span className="bg-rose-100 text-rose-800 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                    {items.filter((i) => i.status === '停用').length}
                  </span>
                )}
              </label>

              {/* Active filter chips */}
              {selectedCategoryKey !== 'ALL' && (
                <div className="flex items-center gap-1 bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded text-xs border border-emerald-200">
                  <span>分类: {selectedCategoryLabel}</span>
                  <button
                    onClick={() => handleSelectCategory('ALL', '所有器械')}
                    className="hover:text-emerald-950 ml-1"
                    title="清除分类筛选"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>

            {/* "新增" primary button matching screenshot */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleOpenAddModal}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded font-medium flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>新增</span>
              </button>
            </div>
          </div>

          {/* Table Header Strip: 器械目录 */}
          <div className="px-4 py-1.5 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600 shrink-0">
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              <span>器械目录列表</span>
              <span className="text-[11px] font-normal text-slate-500">
                (当前分类共检索到 <strong>{totalRecords}</strong> 条物资)
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              建档人均为院内认证主检医师与技师 · 价格已含增值税
            </div>
          </div>

          {/* Main Table Body */}
          <div className="flex-1 overflow-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="sticky top-0 z-10 bg-slate-100 text-slate-700 font-semibold border-b border-slate-200 select-none shadow-2xs">
                <tr>
                  <th className="py-2.5 px-3 whitespace-nowrap">物资编码</th>
                  <th className="py-2.5 px-3 min-w-[200px]">物资名称</th>
                  <th className="py-2.5 px-3 min-w-[150px]">规格</th>
                  <th className="py-2.5 px-3 min-w-[170px]">生产厂商</th>
                  <th className="py-2.5 px-2.5 text-center whitespace-nowrap">计量单位</th>
                  <th className="py-2.5 px-2.5 text-center whitespace-nowrap">辅助计量单位</th>
                  <th className="py-2.5 px-3 text-right whitespace-nowrap">单价(元)</th>
                  <th className="py-2.5 px-3 whitespace-nowrap">建档日期</th>
                  <th className="py-2.5 px-2.5 text-center whitespace-nowrap">状态</th>
                  <th className="py-2.5 px-3 whitespace-nowrap">建档人</th>
                  <th className="py-2.5 px-3 text-center whitespace-nowrap sticky right-0 bg-slate-100 shadow-l">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {paginatedItems.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Archive className="w-8 h-8 text-slate-300" />
                        <span className="text-slate-500 text-xs">没有找到符合条件的器械物资记录</span>
                        {(keyword || onlyDisabled || selectedCategoryKey !== 'ALL') && (
                          <button
                            onClick={() => {
                              setKeyword('');
                              setOnlyDisabled(false);
                              setSelectedCategoryKey('ALL');
                              setSelectedCategoryLabel('所有器械');
                            }}
                            className="mt-1 text-xs text-emerald-600 hover:underline"
                          >
                            重置所有筛选条件
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedItems.map((row) => (
                    <tr
                      key={row.id}
                      className="hover:bg-sky-50/50 transition-colors group"
                    >
                      {/* 物资编码 */}
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-800">
                        {row.code}
                      </td>

                      {/* 物资名称 */}
                      <td className="py-2.5 px-3">
                        <div className="font-semibold text-slate-900 group-hover:text-blue-700">
                          {row.name}
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <span className="bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded border border-slate-200">
                            {row.categoryName}
                          </span>
                          {row.storageCondition && (
                            <span className="text-slate-500">{row.storageCondition}</span>
                          )}
                        </div>
                      </td>

                      {/* 规格 */}
                      <td className="py-2.5 px-3 text-slate-600 font-mono text-[11px]">
                        {row.spec}
                      </td>

                      {/* 生产厂商 */}
                      <td className="py-2.5 px-3 text-slate-700 text-xs">
                        {row.vendor}
                      </td>

                      {/* 计量单位 */}
                      <td className="py-2.5 px-2.5 text-center text-slate-700 font-medium">
                        {row.unit}
                      </td>

                      {/* 辅助计量单位 */}
                      <td className="py-2.5 px-2.5 text-center text-slate-500 font-medium">
                        {row.auxUnit || '-'}
                      </td>

                      {/* 单价 */}
                      <td className="py-2.5 px-3 text-right font-mono font-semibold text-slate-800">
                        ¥{row.price.toFixed(2)}
                      </td>

                      {/* 建档日期 (近期 2026-10) */}
                      <td className="py-2.5 px-3 font-mono text-slate-500 whitespace-nowrap">
                        {row.createDate}
                      </td>

                      {/* 状态 (启用 / 停用) */}
                      <td className="py-2.5 px-2.5 text-center whitespace-nowrap">
                        {row.status === '启用' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            启用
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                            停用
                          </span>
                        )}
                      </td>

                      {/* 建档人 */}
                      <td className="py-2.5 px-3 text-slate-700 whitespace-nowrap font-medium">
                        {row.creator}
                      </td>

                      {/* 操作 */}
                      <td className="py-2.5 px-3 text-center whitespace-nowrap sticky right-0 bg-white group-hover:bg-sky-50/50 shadow-l">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(row)}
                            className="text-blue-600 hover:text-blue-800 font-medium hover:underline flex items-center gap-0.5"
                          >
                            <Edit className="w-3 h-3" />
                            <span>编辑</span>
                          </button>
                          <span className="text-slate-200">|</span>
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(row)}
                            className={`font-medium hover:underline text-[11px] ${
                              row.status === '启用'
                                ? 'text-amber-600 hover:text-amber-800'
                                : 'text-emerald-600 hover:text-emerald-800'
                            }`}
                          >
                            {row.status === '启用' ? '停用' : '启用'}
                          </button>
                          <span className="text-slate-200">|</span>
                          <button
                            type="button"
                            onClick={() => handleDeleteItem(row)}
                            className="text-rose-600 hover:text-rose-800 font-medium hover:underline flex items-center gap-0.5"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>删除</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Bar matching the screenshot: 共 X 条记录 第 1 / Y 页 < 1 > 5条/页 跳转 [ ] 页 */}
          <div className="p-2.5 border-t border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 select-none shrink-0">
            <div className="flex items-center gap-2">
              <span>共 <strong className="font-mono text-slate-900">{totalRecords}</strong> 条记录</span>
              <span className="text-slate-300">|</span>
              <span>第 <strong className="font-mono text-slate-900">{currentPage}</strong> / <strong className="font-mono text-slate-900">{totalPages}</strong> 页</span>
            </div>

            <div className="flex items-center gap-3">
              {/* Previous / Next and page indicators */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-2 py-1 rounded border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                  title="上一页"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>

                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pNum = idx + 1;
                  // Show limited pages if many
                  if (totalPages > 7) {
                    if (pNum !== 1 && pNum !== totalPages && Math.abs(pNum - currentPage) > 1) {
                      if (pNum === 2 || pNum === totalPages - 1) {
                        return <span key={pNum} className="px-1 text-slate-400">...</span>;
                      }
                      return null;
                    }
                  }
                  const isCurrent = pNum === currentPage;
                  return (
                    <button
                      key={pNum}
                      type="button"
                      onClick={() => setCurrentPage(pNum)}
                      className={`min-w-[28px] h-7 px-2 rounded text-xs font-mono font-bold transition-colors ${
                        isCurrent
                          ? 'bg-blue-600 text-white shadow-2xs'
                          : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {pNum}
                    </button>
                  );
                })}

                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="px-2 py-1 rounded border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                  title="下一页"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Page Size Selector matching screenshot: "5条/页" */}
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border border-slate-300 rounded px-2 py-1 text-xs bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
              >
                <option value={5}>5条/页</option>
                <option value={10}>10条/页</option>
                <option value={15}>15条/页</option>
                <option value={20}>20条/页</option>
              </select>

              {/* Jump to page matching screenshot: 跳转 [ ] 页 */}
              <div className="flex items-center gap-1">
                <span>跳转</span>
                <input
                  type="text"
                  value={jumpPageInput}
                  onChange={(e) => setJumpPageInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleJumpPage();
                  }}
                  className="w-10 border border-slate-300 rounded px-1.5 py-0.5 text-center font-mono text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  placeholder={`${currentPage}`}
                />
                <span>页</span>
                <button
                  type="button"
                  onClick={handleJumpPage}
                  className="px-2 py-0.5 rounded border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 text-xs font-medium"
                >
                  确定
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL: 新增器械 / 试剂 */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-5 py-3.5 bg-gradient-to-r from-blue-700 to-indigo-700 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                <h3 className="font-bold text-sm">新增器械与试剂耗材</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-white/80 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    物资编码 <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formState.code}
                    onChange={(e) => setFormState({ ...formState, code: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 font-mono text-xs focus:ring-1 focus:ring-blue-500"
                    placeholder="如 010091"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    器械分类 <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formState.categoryKey}
                    onChange={(e) => {
                      const selectedVal = e.target.value;
                      const map: Record<string, string> = {
                        QC: '质控试剂',
                        HIGH_VALUE: '高值医用耗材',
                        GENERAL: '一般医用耗材',
                        CHEM_REAGENT: '临床检验化学试剂',
                        SURGICAL: '手术器械',
                        EQUIPMENT_PARTS: '检验分析仪器配件',
                        EQUIPMENT_MAINT: '实验室环境与维保设备',
                      };
                      setFormState({
                        ...formState,
                        categoryKey: selectedVal,
                        categoryName: map[selectedVal] || '医用耗材',
                      });
                    }}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs bg-white focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="QC">质控试剂 (医用耗材)</option>
                    <option value="HIGH_VALUE">高值医用耗材</option>
                    <option value="GENERAL">一般医用耗材</option>
                    <option value="CHEM_REAGENT">临床检验化学试剂</option>
                    <option value="SURGICAL">手术器械</option>
                    <option value="EQUIPMENT_PARTS">检验分析仪器配件 (医疗仪器设备)</option>
                    <option value="EQUIPMENT_MAINT">实验室环境与维保设备 (医疗仪器设备)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  物资名称 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  placeholder="例如：全自动生化免疫质控血清水平II"
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">规格型号</label>
                  <input
                    type="text"
                    value={formState.spec}
                    onChange={(e) => setFormState({ ...formState, spec: e.target.value })}
                    placeholder="例如：5ml×6支/盒"
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">生产厂商</label>
                  <input
                    type="text"
                    value={formState.vendor}
                    onChange={(e) => setFormState({ ...formState, vendor: e.target.value })}
                    placeholder="例如：罗氏诊断产品(上海)有限公司"
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">计量单位</label>
                  <input
                    type="text"
                    value={formState.unit}
                    onChange={(e) => setFormState({ ...formState, unit: e.target.value })}
                    placeholder="如 盒 / 架 / 张 / 箱"
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">辅助计量单位</label>
                  <input
                    type="text"
                    value={formState.auxUnit}
                    onChange={(e) => setFormState({ ...formState, auxUnit: e.target.value })}
                    placeholder="如 支 / 卡 / 测试"
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">单价 (¥)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formState.price}
                    onChange={(e) => setFormState({ ...formState, price: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 font-mono text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">初始状态</label>
                  <select
                    value={formState.status}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        status: e.target.value as '启用' | '停用',
                      })
                    }
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs bg-white"
                  >
                    <option value="启用">启用</option>
                    <option value="停用">停用</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">建档人员 (实名)</label>
                  <select
                    value={formState.creator}
                    onChange={(e) => setFormState({ ...formState, creator: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs bg-white"
                  >
                    <option value="郭彩霞主任医师">郭彩霞主任医师 (科室主任)</option>
                    <option value="魏明主管检验师">魏明主管检验师 (质控组长)</option>
                    <option value="李晓红副主任技师">李晓红副主任技师 (试剂库管)</option>
                    <option value="陈康主管检验师">陈康主管检验师 (生化免疫组)</option>
                    <option value="刘浩然技师">刘浩然技师 (常规检验组)</option>
                    <option value="赵雅琴主管护师">赵雅琴主管护师 (采血与门诊)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">存储温区条件</label>
                  <select
                    value={formState.storageCondition}
                    onChange={(e) =>
                      setFormState({ ...formState, storageCondition: e.target.value })
                    }
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs bg-white"
                  >
                    <option value="2~8℃避光冷藏">2~8℃避光冷藏</option>
                    <option value="-20℃冷冻保存">-20℃冷冻保存</option>
                    <option value="15~25℃常温避光">15~25℃常温避光</option>
                    <option value="常温干燥通风">常温干燥通风</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">医疗器械注册证 / 备案号</label>
                <input
                  type="text"
                  value={formState.regNo}
                  onChange={(e) => setFormState({ ...formState, regNo: e.target.value })}
                  placeholder="国械注准2022xxxxxxx 或 沪械备xxxxxx"
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 font-mono text-xs"
                />
              </div>
            </div>

            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-1.5 border border-slate-300 text-slate-700 rounded hover:bg-slate-100 font-medium"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleSaveAdd}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium shadow-xs"
              >
                保存物资
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: 编辑器械 / 试剂 */}
      {isEditModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-5 py-3.5 bg-gradient-to-r from-slate-800 to-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-sm">
                  编辑物资字典：{editingItem.name} ({editingItem.code})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingItem(null);
                }}
                className="text-white/80 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">物资编码 (不可更改)</label>
                  <input
                    type="text"
                    disabled
                    value={formState.code}
                    className="w-full border border-slate-200 bg-slate-100 rounded px-2.5 py-1.5 font-mono text-xs text-slate-500 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">器械分类</label>
                  <select
                    value={formState.categoryKey}
                    onChange={(e) => {
                      const selectedVal = e.target.value;
                      const map: Record<string, string> = {
                        QC: '质控试剂',
                        HIGH_VALUE: '高值医用耗材',
                        GENERAL: '一般医用耗材',
                        CHEM_REAGENT: '临床检验化学试剂',
                        SURGICAL: '手术器械',
                        EQUIPMENT_PARTS: '检验分析仪器配件',
                        EQUIPMENT_MAINT: '实验室环境与维保设备',
                      };
                      setFormState({
                        ...formState,
                        categoryKey: selectedVal,
                        categoryName: map[selectedVal] || '医用耗材',
                      });
                    }}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs bg-white focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="QC">质控试剂</option>
                    <option value="HIGH_VALUE">高值医用耗材</option>
                    <option value="GENERAL">一般医用耗材</option>
                    <option value="CHEM_REAGENT">临床检验化学试剂</option>
                    <option value="SURGICAL">手术器械</option>
                    <option value="EQUIPMENT_PARTS">检验分析仪器配件</option>
                    <option value="EQUIPMENT_MAINT">实验室环境与维保设备</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  物资名称 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">规格型号</label>
                  <input
                    type="text"
                    value={formState.spec}
                    onChange={(e) => setFormState({ ...formState, spec: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">生产厂商</label>
                  <input
                    type="text"
                    value={formState.vendor}
                    onChange={(e) => setFormState({ ...formState, vendor: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">计量单位</label>
                  <input
                    type="text"
                    value={formState.unit}
                    onChange={(e) => setFormState({ ...formState, unit: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">辅助计量单位</label>
                  <input
                    type="text"
                    value={formState.auxUnit}
                    onChange={(e) => setFormState({ ...formState, auxUnit: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">单价 (¥)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formState.price}
                    onChange={(e) => setFormState({ ...formState, price: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 font-mono text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">当前在库状态</label>
                  <select
                    value={formState.status}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        status: e.target.value as '启用' | '停用',
                      })
                    }
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs bg-white"
                  >
                    <option value="启用">启用 (正常领用与出入库)</option>
                    <option value="停用">停用 (冻结采购与领料申请)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">储存温区条件</label>
                  <select
                    value={formState.storageCondition}
                    onChange={(e) =>
                      setFormState({ ...formState, storageCondition: e.target.value })
                    }
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs bg-white"
                  >
                    <option value="2~8℃避光冷藏">2~8℃避光冷藏</option>
                    <option value="-20℃冷冻保存">-20℃冷冻保存</option>
                    <option value="15~25℃常温避光">15~25℃常温避光</option>
                    <option value="常温干燥通风">常温干燥通风</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingItem(null);
                }}
                className="px-4 py-1.5 border border-slate-300 text-slate-700 rounded hover:bg-slate-100 font-medium"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-medium shadow-xs"
              >
                保存修改
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: 器械类型维护 */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-5 py-3.5 bg-emerald-700 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                <h3 className="font-bold text-sm">器械与试剂分类目录管理</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCategoryModalOpen(false)}
                className="text-white/80 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3 text-xs">
              <p className="text-slate-600">
                本系统严格遵循国家《医疗器械分类目录》与检验科质控规范，当前包含以下主要层级：
              </p>

              <div className="border border-slate-200 rounded p-3 bg-slate-50 space-y-2 max-h-56 overflow-y-auto font-mono text-[11px]">
                <div className="font-bold text-slate-800">所有器械 (根节点)</div>
                <div className="pl-4 text-slate-700">├─ 医用耗材 (CONSUMABLES)</div>
                <div className="pl-8 text-slate-600">├─ 质控试剂 [QC] (校准品、质控血清、基质标品)</div>
                <div className="pl-8 text-slate-600">├─ 高值医用耗材 [HIGH_VALUE] (发光卡、凝胶卡、特殊抗体)</div>
                <div className="pl-8 text-slate-600">├─ 一般医用耗材 [GENERAL] (真空管、吸头、溶血稀释液)</div>
                <div className="pl-8 text-slate-600">├─ 临床检验化学试剂 [CHEM_REAGENT] (酶促底物、生化试剂盒)</div>
                <div className="pl-8 text-slate-600">└─ 手术器械 [SURGICAL] (穿刺针、活检取样钳)</div>
                <div className="pl-4 text-slate-700">└─ 医疗仪器设备 (EQUIPMENT)</div>
                <div className="pl-8 text-slate-600">├─ 检验分析仪器配件 [EQUIPMENT_PARTS] (比色杯架、转盘)</div>
                <div className="pl-8 text-slate-600">└─ 实验室环境与维保设备 [EQUIPMENT_MAINT] (防静电垫、维保梯)</div>
              </div>

              <div className="bg-amber-50 border border-amber-200 p-2.5 rounded text-amber-800 text-[11px]">
                💡 提示：如需新增一级或二级分类编码，需医院耗材管理委员会与医学检验科设备主管会签审批。
              </div>
            </div>

            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  showNotice('已申请增设新二级分类申请单');
                  setIsCategoryModalOpen(false);
                }}
                className="px-3 py-1 bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 rounded text-xs"
              >
                + 申请新增分类
              </button>
              <button
                type="button"
                onClick={() => setIsCategoryModalOpen(false)}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-medium text-xs shadow-xs"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// =========================================================================
// 2. 试剂使用配置 子页面 (基于截图 image_47bfdaf8.png 重新排版与交互升级)
// =========================================================================

interface ReagentUsageConfigItem {
  id: string;
  deptGroup: string; // 业务小组 (如：临检、生化、免疫、微生物、输血科、质控中心)
  itemCode: string; // 项目编码
  itemName: string; // 项目名称
  categoryKey: string; // 试剂分类Key: TEST, TYPING, PROCESS, MEDIA, QC, OTHER
  categoryName: string; // 试剂分类名
  pinyinCode: string; // 拼音简码
  wubiCode: string; // 五笔简码
  container: string; // 采集容器
  sampleType: string; // 标本类型
  gender: '通用' | '男' | '女'; // 适用性别
  cost: number; // 成本
  price: number; // 收费价格
  isOutsource: '是' | '否'; // 外检
  hisCode: string; // 对照编码
  status: '启用' | '停用'; // 状态
  operator: string; // 真实维护人员
  updateTime: string; // 更新时间 (近期 2026年10月)
  formulaDesc?: string; // 理论试剂单耗扣减
}

const INITIAL_USAGE_CONFIG_ITEMS: ReagentUsageConfigItem[] = [
  {
    id: 'UC-001',
    deptGroup: '临检',
    itemCode: 'LIS-1001',
    itemName: '全血细胞分析 (五分类+网织红细胞)',
    categoryKey: 'TEST',
    categoryName: '检测试剂',
    pinyinCode: 'QXJBFX',
    wubiCode: 'WTDE',
    container: 'EDTA-K2抗凝管(紫帽 2ml)',
    sampleType: 'EDTA全血',
    gender: '通用',
    cost: 4.8,
    price: 22.0,
    isOutsource: '否',
    hisCode: 'HIS-LAB-1001',
    status: '启用',
    operator: '魏明主管检验师',
    updateTime: '2026-10-29 09:15',
    formulaDesc: '全自动血细胞稀释液28ml+溶血剂0.5ml/测试',
  },
  {
    id: 'UC-002',
    deptGroup: '临检',
    itemCode: 'LIS-1004',
    itemName: '尿液沉渣全自动有形成分镜检分析',
    categoryKey: 'TEST',
    categoryName: '检测试剂',
    pinyinCode: 'YYCZFX',
    wubiCode: 'IPWD',
    container: '一次性无菌尿杯+离心管',
    sampleType: '新鲜晨尿',
    gender: '通用',
    cost: 3.2,
    price: 16.0,
    isOutsource: '否',
    hisCode: 'HIS-LAB-1004',
    status: '停用',
    operator: '刘浩然技师',
    updateTime: '2026-10-28 16:40',
    formulaDesc: '沉渣分析流动池对焦聚焦液1.2ml/标本',
  },
  {
    id: 'UC-003',
    deptGroup: '生化',
    itemCode: 'LIS-2002',
    itemName: '丙氨酸氨基转移酶(ALT)速率法测定',
    categoryKey: 'TEST',
    categoryName: '检测试剂',
    pinyinCode: 'BASAJZYM',
    wubiCode: 'AQDF',
    container: '促凝分离胶采血管(黄帽 4ml)',
    sampleType: '血清',
    gender: '通用',
    cost: 2.1,
    price: 12.0,
    isOutsource: '否',
    hisCode: 'HIS-LAB-2002',
    status: '启用',
    operator: '陈康主管检验师',
    updateTime: '2026-10-27 10:20',
    formulaDesc: 'R1试剂 120μL + R2试剂 30μL/测试',
  },
  {
    id: 'UC-004',
    deptGroup: '生化',
    itemCode: 'LIS-2015',
    itemName: '全自动生化分析仪酸性浓缩清洗冲洗包',
    categoryKey: 'PROCESS',
    categoryName: '处理试剂',
    pinyinCode: 'SHQXB',
    wubiCode: 'IRTN',
    container: '仪器试剂仓专用供液桶',
    sampleType: '仪器自检液',
    gender: '通用',
    cost: 0.85,
    price: 0.0,
    isOutsource: '否',
    hisCode: 'HIS-CLEAN-01',
    status: '启用',
    operator: '陈康主管检验师',
    updateTime: '2026-10-26 14:10',
    formulaDesc: '每完成50个测试自动冲洗管路5ml',
  },
  {
    id: 'UC-005',
    deptGroup: '输血科',
    itemCode: 'LIS-5001',
    itemName: '微柱凝胶ABO/RhD血型正反定型及抗筛试验',
    categoryKey: 'TYPING',
    categoryName: '配型试剂',
    pinyinCode: 'WZNJXXDX',
    wubiCode: 'AJTF',
    container: 'EDTA-K2抗凝管(紫帽 5ml)',
    sampleType: '新鲜抗凝全血',
    gender: '通用',
    cost: 18.5,
    price: 85.0,
    isOutsource: '否',
    hisCode: 'HIS-BLD-5001',
    status: '启用',
    operator: '李晓红副主任技师',
    updateTime: '2026-10-29 11:30',
    formulaDesc: 'ABO/RhD微柱凝胶定型卡1张/人份',
  },
  {
    id: 'UC-006',
    deptGroup: '输血科',
    itemCode: 'LIS-5003',
    itemName: '全自动微柱交叉配血凝聚胺介质试验',
    categoryKey: 'TYPING',
    categoryName: '配型试剂',
    pinyinCode: 'JCPXSY',
    wubiCode: 'APFD',
    container: '无抗凝无菌试管(红帽 5ml)',
    sampleType: '受血者血清+供血红细胞',
    gender: '通用',
    cost: 14.0,
    price: 60.0,
    isOutsource: '否',
    hisCode: 'HIS-BLD-5003',
    status: '启用',
    operator: '李晓红副主任技师',
    updateTime: '2026-10-25 15:00',
    formulaDesc: '交叉配血专配卡1张+凝聚胺增强介质0.2ml',
  },
  {
    id: 'UC-007',
    deptGroup: '微生物',
    itemCode: 'LIS-4001',
    itemName: '全自动血液培养及快速质谱菌种鉴定',
    categoryKey: 'MEDIA',
    categoryName: '培养基',
    pinyinCode: 'XYPYZPJD',
    wubiCode: 'XPYE',
    container: 'BD BACTEC需氧+厌氧双联培养瓶',
    sampleType: '外周静脉血 8~10ml',
    gender: '通用',
    cost: 38.0,
    price: 160.0,
    isOutsource: '否',
    hisCode: 'HIS-MIC-4001',
    status: '启用',
    operator: '郭彩霞主任医师',
    updateTime: '2026-10-30 08:45',
    formulaDesc: '需氧培养瓶1瓶+厌氧培养瓶1瓶双联上机',
  },
  {
    id: 'UC-008',
    deptGroup: '微生物',
    itemCode: 'LIS-4005',
    itemName: '哥伦比亚血琼脂平板致病菌分离培养',
    categoryKey: 'MEDIA',
    categoryName: '培养基',
    pinyinCode: 'GLBYXQZPB',
    wubiCode: 'TQWE',
    container: '无菌培养皿转运套件',
    sampleType: '咽拭子/分泌物/脓液',
    gender: '通用',
    cost: 6.5,
    price: 35.0,
    isOutsource: '否',
    hisCode: 'HIS-MIC-4005',
    status: '启用',
    operator: '郭彩霞主任医师',
    updateTime: '2026-10-28 10:10',
    formulaDesc: '90mm脱纤维羊血琼脂平皿1张/例',
  },
  {
    id: 'UC-009',
    deptGroup: '质控中心',
    itemCode: 'LIS-9002',
    itemName: '多项目复合生化室内室内质控品(水平1/2/3)',
    categoryKey: 'QC',
    categoryName: '质控试剂',
    pinyinCode: 'FHSHZK',
    wubiCode: 'FDZK',
    container: '2ml冷冻质控冻存管',
    sampleType: '复溶冻干血清',
    gender: '通用',
    cost: 15.0,
    price: 0.0,
    isOutsource: '否',
    hisCode: 'QC-CHEM-002',
    status: '启用',
    operator: '魏明主管检验师',
    updateTime: '2026-10-27 17:30',
    formulaDesc: '每日早班开机校准消耗各0.3ml',
  },
  {
    id: 'UC-010',
    deptGroup: '免疫',
    itemCode: 'LIS-3008',
    itemName: '高敏肌钙蛋白I(hs-cTnI)化学发光定量检测',
    categoryKey: 'TEST',
    categoryName: '检测试剂',
    pinyinCode: 'GSMJDB',
    wubiCode: 'AJTF',
    container: '肝素锂抗凝管(绿帽 3ml)',
    sampleType: '血浆',
    gender: '通用',
    cost: 16.5,
    price: 75.0,
    isOutsource: '否',
    hisCode: 'HIS-IMM-3008',
    status: '启用',
    operator: '钱宇恒技师',
    updateTime: '2026-10-29 14:00',
    formulaDesc: '顺磁性微粒50μL+吖啶酯标记物50μL/测试',
  },
  {
    id: 'UC-011',
    deptGroup: '分子诊断',
    itemCode: 'LIS-6002',
    itemName: '乙型肝炎病毒核酸定量PCR测定 (超高敏)',
    categoryKey: 'TEST',
    categoryName: '检测试剂',
    pinyinCode: 'YGBDHXDL',
    wubiCode: 'BNHE',
    container: 'EDTA-K2抗凝管(紫帽 5ml)',
    sampleType: '血浆',
    gender: '通用',
    cost: 42.0,
    price: 180.0,
    isOutsource: '是',
    hisCode: 'HIS-MOL-6002',
    status: '启用',
    operator: '李晓红副主任技师',
    updateTime: '2026-10-30 09:30',
    formulaDesc: '磁珠法核酸提取试剂盒+实时荧光PCR扩增混合液',
  },
  {
    id: 'UC-012',
    deptGroup: '临检',
    itemCode: 'LIS-8001',
    itemName: '一次性使用静脉采血针及持针器耗材包',
    categoryKey: 'OTHER',
    categoryName: '其他耗材',
    pinyinCode: 'YCXCXB',
    wubiCode: 'WCXB',
    container: '门诊采血穿刺专用包',
    sampleType: '外周静脉穿刺采集',
    gender: '通用',
    cost: 1.2,
    price: 3.5,
    isOutsource: '否',
    hisCode: 'HIS-SUP-8001',
    status: '启用',
    operator: '赵雅琴主管护师',
    updateTime: '2026-10-24 11:20',
    formulaDesc: '单次穿刺对应安全采血针1支+胶塞持针器1个',
  },
  {
    id: 'UC-013',
    deptGroup: '质控中心',
    itemCode: 'LIS-9005',
    itemName: '血凝分析三水平异常复合质控血浆',
    categoryKey: 'QC',
    categoryName: '质控试剂',
    pinyinCode: 'XNZKXJ',
    wubiCode: 'XNZK',
    container: '1ml原装冻干瓶',
    sampleType: '复溶血浆',
    gender: '通用',
    cost: 22.0,
    price: 0.0,
    isOutsource: '否',
    hisCode: 'QC-COAG-005',
    status: '停用',
    operator: '魏明主管检验师',
    updateTime: '2026-10-21 16:00',
    formulaDesc: '批次检测首件与末件各测试0.1ml',
  },
  {
    id: 'UC-014',
    deptGroup: '生化',
    itemCode: 'LIS-2030',
    itemName: '生化分析仪浓缩去垢碱性反应液',
    categoryKey: 'PROCESS',
    categoryName: '处理试剂',
    pinyinCode: 'NSQGJXFY',
    wubiCode: 'NQJF',
    container: '10L仪器直供桶',
    sampleType: '反应杯冲洗去蛋白',
    gender: '通用',
    cost: 3.5,
    price: 0.0,
    isOutsource: '否',
    hisCode: 'HIS-PROC-02',
    status: '启用',
    operator: '刘浩然技师',
    updateTime: '2026-10-26 15:45',
    formulaDesc: '每完成300测试执行整盘碱洗脱敏20ml',
  },
];

// Tree definitions for 试剂分类 matching image_47bfdaf8.png
interface ReagentCategoryTreeNode {
  key: string;
  label: string;
  children?: ReagentCategoryTreeNode[];
}

const REAGENT_USAGE_CATEGORY_TREE: ReagentCategoryTreeNode[] = [
  {
    key: 'ALL',
    label: '所有试剂',
    children: [
      { key: 'TEST', label: '检测试剂' },
      { key: 'TYPING', label: '配型试剂' },
      { key: 'PROCESS', label: '处理试剂' },
      { key: 'MEDIA', label: '培养基' },
      { key: 'QC', label: '质控试剂' },
      { key: 'OTHER', label: '其他耗材' },
    ],
  },
];

const ReagentUsageConfigSubView: React.FC<{
  hospitalUnit: string;
  showNotice: (m: string) => void;
}> = ({ hospitalUnit, showNotice }) => {
  // Tree Selection State
  const [selectedKey, setSelectedKey] = useState<string>('ALL');
  const [selectedLabel, setSelectedLabel] = useState<string>('所有试剂');
  const [isTreeExpanded, setIsTreeExpanded] = useState<boolean>(true);

  // Top Filter state: "试剂信息" input, "停用" checkbox matching screenshot
  const [keyword, setKeyword] = useState<string>('');
  const [onlyDisabled, setOnlyDisabled] = useState<boolean>(false);

  // Items State
  const [items, setItems] = useState<ReagentUsageConfigItem[]>(INITIAL_USAGE_CONFIG_ITEMS);

  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const [jumpPageInput, setJumpPageInput] = useState<string>('');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<ReagentUsageConfigItem | null>(null);
  const [isTypeMaintenanceModalOpen, setIsTypeMaintenanceModalOpen] = useState<boolean>(false);

  // Form State
  const [formState, setFormState] = useState<{
    deptGroup: string;
    itemCode: string;
    itemName: string;
    categoryKey: string;
    categoryName: string;
    pinyinCode: string;
    wubiCode: string;
    container: string;
    sampleType: string;
    gender: '通用' | '男' | '女';
    cost: string;
    price: string;
    isOutsource: '是' | '否';
    hisCode: string;
    status: '启用' | '停用';
    operator: string;
    formulaDesc: string;
  }>({
    deptGroup: '临检',
    itemCode: '',
    itemName: '',
    categoryKey: 'TEST',
    categoryName: '检测试剂',
    pinyinCode: '',
    wubiCode: '',
    container: 'EDTA-K2抗凝管(紫帽 2ml)',
    sampleType: '全血',
    gender: '通用',
    cost: '5.00',
    price: '25.00',
    isOutsource: '否',
    hisCode: '',
    status: '启用',
    operator: '魏明主管检验师',
    formulaDesc: '单次测试自动扣减1人份',
  });

  // Calculate count for each category
  const countByCategory = useMemo(() => {
    const counts: Record<string, number> = {
      ALL: items.length,
      TEST: 0,
      TYPING: 0,
      PROCESS: 0,
      MEDIA: 0,
      QC: 0,
      OTHER: 0,
    };
    items.forEach((item) => {
      if (counts[item.categoryKey] !== undefined) {
        counts[item.categoryKey]++;
      }
    });
    return counts;
  }, [items]);

  // Handle tree node click
  const handleSelectCategory = (key: string, label: string) => {
    setSelectedKey(key);
    setSelectedLabel(label);
    setCurrentPage(1);
    const count = countByCategory[key] || 0;
    showNotice(`已切换试剂分类：【${label}】，当前分类包含 ${count} 条配置记录`);
  };

  // Filter items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // 1. Category Tree Filter
      if (selectedKey !== 'ALL') {
        if (item.categoryKey !== selectedKey) {
          return false;
        }
      }

      // 2. Disabled filter ("停用" checkbox)
      if (onlyDisabled && item.status !== '停用') {
        return false;
      }

      // 3. Keyword Search (itemCode, itemName, pinyin, wubi, dept, container, hisCode)
      if (keyword.trim()) {
        const kw = keyword.trim().toLowerCase();
        const match =
          item.itemCode.toLowerCase().includes(kw) ||
          item.itemName.toLowerCase().includes(kw) ||
          item.pinyinCode.toLowerCase().includes(kw) ||
          item.wubiCode.toLowerCase().includes(kw) ||
          item.deptGroup.toLowerCase().includes(kw) ||
          item.container.toLowerCase().includes(kw) ||
          item.sampleType.toLowerCase().includes(kw) ||
          item.hisCode.toLowerCase().includes(kw);
        if (!match) return false;
      }

      return true;
    });
  }, [items, selectedKey, onlyDisabled, keyword]);

  // Pagination calculation
  const totalRecords = filteredItems.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredItems.slice(start, start + pageSize);
  }, [filteredItems, currentPage, pageSize]);

  // Jump page handler
  const handleJumpPage = () => {
    const p = parseInt(jumpPageInput, 10);
    if (!isNaN(p) && p >= 1 && p <= totalPages) {
      setCurrentPage(p);
      setJumpPageInput('');
    } else {
      showNotice(`请输入有效的页码 (1 ~ ${totalPages})`);
    }
  };

  // Open Add Modal
  const handleOpenAddModal = () => {
    const nextNum = 1000 + items.length + 1;
    const catMap: Record<string, string> = {
      TEST: '检测试剂',
      TYPING: '配型试剂',
      PROCESS: '处理试剂',
      MEDIA: '培养基',
      QC: '质控试剂',
      OTHER: '其他耗材',
    };
    const defaultCatKey = selectedKey === 'ALL' ? 'TEST' : selectedKey;
    const defaultCatName = catMap[defaultCatKey] || '检测试剂';

    setFormState({
      deptGroup: '临检',
      itemCode: `LIS-${nextNum}`,
      itemName: '',
      categoryKey: defaultCatKey,
      categoryName: defaultCatName,
      pinyinCode: '',
      wubiCode: '',
      container: '促凝采血管(红帽 5ml)',
      sampleType: '血清',
      gender: '通用',
      cost: '8.50',
      price: '30.00',
      isOutsource: '否',
      hisCode: `HIS-LAB-${nextNum}`,
      status: '启用',
      operator: '郭彩霞主任医师',
      formulaDesc: '单次测试自动扣减1人份理论试剂',
    });
    setIsAddModalOpen(true);
  };

  // Save New Item
  const handleSaveAdd = () => {
    if (!formState.itemName.trim()) {
      showNotice('请输入检验项目名称！');
      return;
    }
    const newItem: ReagentUsageConfigItem = {
      id: `UC-${Date.now()}`,
      deptGroup: formState.deptGroup,
      itemCode: formState.itemCode || `LIS-${Math.floor(1000 + Math.random() * 9000)}`,
      itemName: formState.itemName.trim(),
      categoryKey: formState.categoryKey,
      categoryName: formState.categoryName,
      pinyinCode: formState.pinyinCode.trim() || formState.itemName.substring(0, 4).toUpperCase(),
      wubiCode: formState.wubiCode.trim() || 'WTDE',
      container: formState.container,
      sampleType: formState.sampleType,
      gender: formState.gender,
      cost: parseFloat(formState.cost) || 0,
      price: parseFloat(formState.price) || 0,
      isOutsource: formState.isOutsource,
      hisCode: formState.hisCode || `HIS-${Math.floor(1000 + Math.random() * 9000)}`,
      status: formState.status,
      operator: formState.operator,
      updateTime: '2026-10-30 10:15',
      formulaDesc: formState.formulaDesc,
    };

    setItems((prev) => [newItem, ...prev]);
    setIsAddModalOpen(false);
    showNotice(`已成功新增试剂使用配置：[${newItem.itemName}] (${newItem.itemCode})`);
  };

  // Open Edit Modal
  const handleOpenEditModal = (item: ReagentUsageConfigItem) => {
    setEditingItem(item);
    setFormState({
      deptGroup: item.deptGroup,
      itemCode: item.itemCode,
      itemName: item.itemName,
      categoryKey: item.categoryKey,
      categoryName: item.categoryName,
      pinyinCode: item.pinyinCode,
      wubiCode: item.wubiCode,
      container: item.container,
      sampleType: item.sampleType,
      gender: item.gender,
      cost: item.cost.toString(),
      price: item.price.toString(),
      isOutsource: item.isOutsource,
      hisCode: item.hisCode,
      status: item.status,
      operator: item.operator,
      formulaDesc: item.formulaDesc || '',
    });
    setIsEditModalOpen(true);
  };

  // Save Edit Item
  const handleSaveEdit = () => {
    if (!editingItem) return;
    if (!formState.itemName.trim()) {
      showNotice('请输入检验项目名称！');
      return;
    }

    setItems((prev) =>
      prev.map((it) => {
        if (it.id === editingItem.id) {
          return {
            ...it,
            deptGroup: formState.deptGroup,
            itemName: formState.itemName.trim(),
            categoryKey: formState.categoryKey,
            categoryName: formState.categoryName,
            pinyinCode: formState.pinyinCode.trim(),
            wubiCode: formState.wubiCode.trim(),
            container: formState.container,
            sampleType: formState.sampleType,
            gender: formState.gender,
            cost: parseFloat(formState.cost) || 0,
            price: parseFloat(formState.price) || 0,
            isOutsource: formState.isOutsource,
            hisCode: formState.hisCode,
            status: formState.status,
            formulaDesc: formState.formulaDesc,
            updateTime: '2026-10-30 10:20',
          };
        }
        return it;
      })
    );
    setIsEditModalOpen(false);
    setEditingItem(null);
    showNotice(`已保存项目试剂使用配置：[${formState.itemName}]`);
  };

  // Toggle item status
  const handleToggleStatus = (item: ReagentUsageConfigItem) => {
    const newStatus: '启用' | '停用' = item.status === '启用' ? '停用' : '启用';
    setItems((prev) =>
      prev.map((it) => (it.id === item.id ? { ...it, status: newStatus } : it))
    );
    showNotice(`已将项目 [${item.itemName}] 状态更改为：【${newStatus}】`);
  };

  // Delete Item
  const handleDeleteItem = (item: ReagentUsageConfigItem) => {
    if (window.confirm(`确定要删除检验项目试剂使用配置【${item.itemName}】(${item.itemCode}) 吗？`)) {
      setItems((prev) => prev.filter((it) => it.id !== item.id));
      showNotice(`已删除配置项目：[${item.itemName}]`);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 flex-1 flex flex-col overflow-hidden shadow-xs">
      {/* Top Banner */}
      <div className="px-4 py-2 bg-gradient-to-r from-slate-50 via-white to-blue-50/40 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">试剂使用配置与单耗对照</h2>
          </div>
          <span className="text-slate-300">|</span>
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <span className="text-slate-400">当前院区：</span>
            <span className="font-semibold text-slate-800">{hospitalUnit} · 临床医学检验中心</span>
          </div>
          <span className="text-slate-300">|</span>
          <div className="flex items-center gap-1 text-[11px] text-slate-500">
            <span>配置项目总数：</span>
            <strong className="text-slate-800 font-mono">{items.length}</strong>
            <span className="ml-1 text-emerald-700 font-semibold">启用: {items.filter(i => i.status === '启用').length}</span>
            <span className="ml-1 text-rose-600 font-semibold">停用: {items.filter(i => i.status === '停用').length}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => showNotice(`已同步${hospitalUnit}所有全自动流水线单耗扣减规则与HIS物价对照表`)}
            className="px-2.5 py-1 text-xs border border-slate-300 text-slate-600 hover:bg-slate-50 rounded flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>同步规则</span>
          </button>
          <button
            onClick={() => showNotice(`已导出【${selectedLabel}】共 ${filteredItems.length} 条试剂使用配置报表`)}
            className="px-2.5 py-1 text-xs border border-slate-300 text-slate-600 hover:bg-slate-50 rounded flex items-center gap-1"
          >
            <Download className="w-3.5 h-3.5" />
            <span>导出配置</span>
          </button>
        </div>
      </div>

      {/* Main Split Body: Left Tree (试剂分类) + Right Table (试剂目录列表) */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Left Tree Panel: 试剂分类 matching screenshot */}
        <div className="w-60 border-r border-slate-200 bg-slate-50/70 flex flex-col shrink-0 overflow-hidden">
          {/* Header of Tree with "类型维护" button matching screenshot */}
          <div className="p-2.5 border-b border-slate-200 bg-white flex items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-1.5 font-bold text-blue-600 text-xs">
              <Sliders className="w-3.5 h-3.5" />
              <span>试剂分类</span>
            </div>
            <button
              onClick={() => setIsTypeMaintenanceModalOpen(true)}
              className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-2 py-0.5 rounded text-xs flex items-center gap-1 font-medium transition-colors border border-blue-200"
              title="试剂分类字典层级维护"
            >
              <Settings className="w-3 h-3 text-blue-600" />
              <span>类型维护</span>
            </button>
          </div>

          {/* Quick info tip */}
          <div className="px-3 py-1.5 bg-blue-50/50 border-b border-blue-100 text-[11px] text-blue-800 flex items-center justify-between">
            <span>点击分类筛选检验项目</span>
            <span className="font-mono font-bold text-blue-700">{selectedLabel}</span>
          </div>

          {/* Category Tree Nodes matching image_47bfdaf8.png */}
          <div className="flex-1 p-2 overflow-y-auto space-y-0.5 select-none text-xs">
            {/* Root: 所有试剂 */}
            <div>
              <div
                onClick={() => handleSelectCategory('ALL', '所有试剂')}
                className={`flex items-center justify-between px-2 py-1.5 rounded cursor-pointer transition-colors ${
                  selectedKey === 'ALL'
                    ? 'bg-blue-50 text-blue-800 font-bold border-l-3 border-blue-600 shadow-2xs'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsTreeExpanded(!isTreeExpanded);
                    }}
                    className="w-4 h-4 flex items-center justify-center text-slate-400 hover:text-slate-700"
                  >
                    {isTreeExpanded ? (
                      <ChevronDown className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5" />
                    )}
                  </button>
                  {isTreeExpanded ? (
                    <FolderOpen className={`w-3.5 h-3.5 ${selectedKey === 'ALL' ? 'text-blue-600' : 'text-amber-500'}`} />
                  ) : (
                    <Folder className={`w-3.5 h-3.5 ${selectedKey === 'ALL' ? 'text-blue-600' : 'text-slate-400'}`} />
                  )}
                  <span>所有试剂</span>
                </div>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  selectedKey === 'ALL' ? 'bg-blue-600 text-white font-bold' : 'bg-slate-200 text-slate-600'
                }`}>
                  {countByCategory['ALL']}
                </span>
              </div>

              {/* Sub Categories matching image_47bfdaf8.png */}
              {isTreeExpanded && (
                <div className="ml-5 space-y-0.5 mt-0.5 border-l border-slate-200 pl-1.5">
                  {[
                    { key: 'TEST', label: '检测试剂' },
                    { key: 'TYPING', label: '配型试剂' },
                    { key: 'PROCESS', label: '处理试剂' },
                    { key: 'MEDIA', label: '培养基' },
                    { key: 'QC', label: '质控试剂' },
                    { key: 'OTHER', label: '其他耗材' },
                  ].map((subCat) => {
                    const isSelected = selectedKey === subCat.key;
                    const c = countByCategory[subCat.key] || 0;
                    return (
                      <div
                        key={subCat.key}
                        onClick={() => handleSelectCategory(subCat.key, subCat.label)}
                        className={`flex items-center justify-between px-2 py-1.5 rounded cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-blue-50 text-blue-800 font-bold border-l-2 border-blue-600'
                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 truncate">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                          <span className="truncate">{subCat.label}</span>
                        </div>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                          isSelected ? 'bg-blue-600 text-white font-bold' : 'bg-slate-200 text-slate-500'
                        }`}>
                          {c}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Bottom Summary */}
          <div className="p-2.5 border-t border-slate-200 bg-white text-[11px] text-slate-500 space-y-1">
            <div className="flex items-center justify-between">
              <span>当前分类:</span>
              <span className="font-bold text-slate-800">{selectedLabel}</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>匹配记录数:</span>
              <span className="font-mono font-bold text-blue-600">{countByCategory[selectedKey] || 0} 条</span>
            </div>
          </div>
        </div>

        {/* Right Main Table Area: 试剂目录列表 */}
        <div className="flex-1 flex flex-col min-w-0 bg-white overflow-hidden">
          {/* Top Filter Bar matching screenshot: 试剂信息搜索, 停用勾选框, 查询按钮, 新增按钮 */}
          <div className="p-3 border-b border-slate-200 bg-white flex flex-wrap items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-3 flex-wrap">
              {/* Search by "试剂信息" */}
              <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-slate-700 whitespace-nowrap">
                  试剂信息:
                </label>
                <div className="relative w-64">
                  <input
                    type="text"
                    value={keyword}
                    onChange={(e) => {
                      setKeyword(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="输入项目编码/名称/拼音/五笔/HIS对照..."
                    className="w-full border border-slate-300 rounded px-2.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 pr-7"
                  />
                  {keyword ? (
                    <button
                      onClick={() => setKeyword('')}
                      className="absolute right-2 top-1.5 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1.5" />
                  )}
                </div>
              </div>

              {/* "停用" checkbox matching screenshot */}
              <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={onlyDisabled}
                  onChange={(e) => {
                    setOnlyDisabled(e.target.checked);
                    setCurrentPage(1);
                    if (e.target.checked) {
                      showNotice('已筛选：仅显示停用项目');
                    } else {
                      showNotice('已恢复：显示全部项目');
                    }
                  }}
                  className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5 cursor-pointer"
                />
                <span className={onlyDisabled ? 'font-bold text-rose-700' : 'text-slate-600'}>
                  停用
                </span>
                {onlyDisabled && (
                  <span className="bg-rose-100 text-rose-800 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                    {items.filter((i) => i.status === '停用').length}
                  </span>
                )}
              </label>

              {/* "查询" button matching screenshot */}
              <button
                type="button"
                onClick={() => {
                  showNotice(`查询成功：当前分类共筛选出 ${filteredItems.length} 条记录`);
                }}
                className="px-3 py-1 bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 rounded text-xs font-medium shadow-2xs transition-colors"
              >
                查询
              </button>

              {/* Active Category Tag */}
              {selectedKey !== 'ALL' && (
                <div className="flex items-center gap-1 bg-blue-50 text-blue-800 px-2 py-0.5 rounded text-xs border border-blue-200">
                  <span>分类: {selectedLabel}</span>
                  <button
                    onClick={() => handleSelectCategory('ALL', '所有试剂')}
                    className="hover:text-blue-950 ml-1"
                    title="清除分类筛选"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>

            {/* "新增" primary button matching screenshot */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleOpenAddModal}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded font-medium text-xs flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>新增</span>
              </button>
            </div>
          </div>

          {/* Table Header Strip: 试剂目录列表 */}
          <div className="px-4 py-1.5 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600 shrink-0">
            <div className="flex items-center gap-2 font-bold text-blue-600">
              <span>试剂目录列表</span>
              <span className="text-[11px] font-normal text-slate-500">
                (分类：{selectedLabel} · 共 <strong>{totalRecords}</strong> 个检验配置项目)
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              单耗扣减与HIS物价对照实时有效 · 审核人均为临床检验专业医师
            </div>
          </div>

          {/* Main Table Body matching all columns of image_47bfdaf8.png */}
          <div className="flex-1 overflow-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="sticky top-0 z-10 bg-slate-100 text-slate-700 font-semibold border-b border-slate-200 select-none shadow-2xs">
                <tr>
                  <th className="py-2.5 px-3 whitespace-nowrap">业务小组</th>
                  <th className="py-2.5 px-3 whitespace-nowrap">项目编码</th>
                  <th className="py-2.5 px-3 min-w-[200px]">项目名称</th>
                  <th className="py-2.5 px-2.5 text-center whitespace-nowrap">拼音简码</th>
                  <th className="py-2.5 px-2.5 text-center whitespace-nowrap">五笔简码</th>
                  <th className="py-2.5 px-3 min-w-[150px]">采集容器</th>
                  <th className="py-2.5 px-3 whitespace-nowrap">标本类型</th>
                  <th className="py-2.5 px-2 text-center whitespace-nowrap">适用性别</th>
                  <th className="py-2.5 px-2.5 text-right whitespace-nowrap">成本(元)</th>
                  <th className="py-2.5 px-2.5 text-right whitespace-nowrap">收费价格(元)</th>
                  <th className="py-2.5 px-2 text-center whitespace-nowrap">外检</th>
                  <th className="py-2.5 px-3 whitespace-nowrap">对照编码</th>
                  <th className="py-2.5 px-2.5 text-center whitespace-nowrap">状态</th>
                  <th className="py-2.5 px-3 whitespace-nowrap">维护人</th>
                  <th className="py-2.5 px-3 text-center whitespace-nowrap sticky right-0 bg-slate-100 shadow-l">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {paginatedItems.length === 0 ? (
                  <tr>
                    <td colSpan={15} className="py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Archive className="w-8 h-8 text-slate-300" />
                        <span className="text-slate-500 text-xs">暂无符合条件的试剂使用配置数据</span>
                        {(keyword || onlyDisabled || selectedKey !== 'ALL') && (
                          <button
                            onClick={() => {
                              setKeyword('');
                              setOnlyDisabled(false);
                              setSelectedKey('ALL');
                              setSelectedLabel('所有试剂');
                            }}
                            className="mt-1 text-xs text-blue-600 hover:underline"
                          >
                            重置所有筛选条件
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedItems.map((row) => (
                    <tr
                      key={row.id}
                      className="hover:bg-blue-50/40 transition-colors group"
                    >
                      {/* 业务小组 */}
                      <td className="py-2.5 px-3 font-medium text-slate-800 whitespace-nowrap">
                        <span className="px-1.5 py-0.5 rounded text-[11px] bg-slate-100 text-slate-700 border border-slate-200">
                          {row.deptGroup}
                        </span>
                      </td>

                      {/* 项目编码 */}
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-800 whitespace-nowrap">
                        {row.itemCode}
                      </td>

                      {/* 项目名称 */}
                      <td className="py-2.5 px-3">
                        <div className="font-semibold text-slate-900 group-hover:text-blue-700">
                          {row.itemName}
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <span className="text-blue-600 font-medium">[{row.categoryName}]</span>
                          {row.formulaDesc && (
                            <span className="text-slate-500 truncate max-w-[280px]">
                              单耗: {row.formulaDesc}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* 拼音简码 */}
                      <td className="py-2.5 px-2.5 text-center font-mono text-[11px] text-slate-600 whitespace-nowrap">
                        {row.pinyinCode}
                      </td>

                      {/* 五笔简码 */}
                      <td className="py-2.5 px-2.5 text-center font-mono text-[11px] text-slate-500 whitespace-nowrap">
                        {row.wubiCode}
                      </td>

                      {/* 采集容器 */}
                      <td className="py-2.5 px-3 text-slate-700 text-xs">
                        {row.container}
                      </td>

                      {/* 标本类型 */}
                      <td className="py-2.5 px-3 text-slate-700 whitespace-nowrap">
                        {row.sampleType}
                      </td>

                      {/* 适用性别 */}
                      <td className="py-2.5 px-2 text-center text-slate-600 whitespace-nowrap">
                        {row.gender}
                      </td>

                      {/* 成本 */}
                      <td className="py-2.5 px-2.5 text-right font-mono text-slate-600 whitespace-nowrap">
                        {row.cost > 0 ? `¥${row.cost.toFixed(2)}` : '免计'}
                      </td>

                      {/* 收费价格 */}
                      <td className="py-2.5 px-2.5 text-right font-mono font-semibold text-slate-900 whitespace-nowrap">
                        ¥{row.price.toFixed(2)}
                      </td>

                      {/* 外检 */}
                      <td className="py-2.5 px-2 text-center whitespace-nowrap">
                        <span
                          className={`px-1.5 py-0.2 rounded text-[11px] font-medium ${
                            row.isOutsource === '是'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {row.isOutsource}
                        </span>
                      </td>

                      {/* 对照编码 */}
                      <td className="py-2.5 px-3 font-mono text-slate-700 whitespace-nowrap">
                        {row.hisCode}
                      </td>

                      {/* 状态 */}
                      <td className="py-2.5 px-2.5 text-center whitespace-nowrap">
                        {row.status === '启用' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            启用
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                            停用
                          </span>
                        )}
                      </td>

                      {/* 维护人 */}
                      <td className="py-2.5 px-3 text-slate-700 whitespace-nowrap">
                        <div>{row.operator}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{row.updateTime.split(' ')[0]}</div>
                      </td>

                      {/* 操作 */}
                      <td className="py-2.5 px-3 text-center whitespace-nowrap sticky right-0 bg-white group-hover:bg-blue-50/40 shadow-l">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(row)}
                            className="text-blue-600 hover:text-blue-800 font-medium hover:underline flex items-center gap-0.5"
                          >
                            <Edit className="w-3 h-3" />
                            <span>编辑</span>
                          </button>
                          <span className="text-slate-200">|</span>
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(row)}
                            className={`font-medium hover:underline text-[11px] ${
                              row.status === '启用'
                                ? 'text-amber-600 hover:text-amber-800'
                                : 'text-emerald-600 hover:text-emerald-800'
                            }`}
                          >
                            {row.status === '启用' ? '停用' : '启用'}
                          </button>
                          <span className="text-slate-200">|</span>
                          <button
                            type="button"
                            onClick={() => handleDeleteItem(row)}
                            className="text-rose-600 hover:text-rose-800 font-medium hover:underline flex items-center gap-0.5"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>删除</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Bottom Pagination matching screenshot's "合计: 2条" and pagination */}
          <div className="p-2.5 border-t border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 select-none shrink-0">
            {/* 合计 matching screenshot */}
            <div className="flex items-center gap-2">
              <span className="text-blue-600 font-bold">合计: {totalRecords}条</span>
              <span className="text-slate-300">|</span>
              <span>第 <strong className="font-mono text-slate-900">{currentPage}</strong> / <strong className="font-mono text-slate-900">{totalPages}</strong> 页</span>
            </div>

            <div className="flex items-center gap-3">
              {/* Previous / Next buttons */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-2 py-1 rounded border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                  title="上一页"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>

                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pNum = idx + 1;
                  const isCurrent = pNum === currentPage;
                  return (
                    <button
                      key={pNum}
                      type="button"
                      onClick={() => setCurrentPage(pNum)}
                      className={`min-w-[28px] h-7 px-2 rounded text-xs font-mono font-bold transition-colors ${
                        isCurrent
                          ? 'bg-blue-600 text-white shadow-2xs'
                          : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {pNum}
                    </button>
                  );
                })}

                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="px-2 py-1 rounded border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                  title="下一页"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Page Size Selector */}
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border border-slate-300 rounded px-2 py-1 text-xs bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
              >
                <option value={5}>5条/页</option>
                <option value={10}>10条/页</option>
                <option value={15}>15条/页</option>
                <option value={20}>20条/页</option>
              </select>

              {/* Jump to page */}
              <div className="flex items-center gap-1">
                <span>跳转</span>
                <input
                  type="text"
                  value={jumpPageInput}
                  onChange={(e) => setJumpPageInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleJumpPage();
                  }}
                  className="w-10 border border-slate-300 rounded px-1.5 py-0.5 text-center font-mono text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder={`${currentPage}`}
                />
                <span>页</span>
                <button
                  type="button"
                  onClick={handleJumpPage}
                  className="px-2 py-0.5 rounded border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 text-xs font-medium"
                >
                  确定
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL: 新增项目试剂使用配置 */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-5 py-3.5 bg-blue-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                <h3 className="font-bold text-sm">新增检验项目试剂使用配置</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-white/80 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    业务小组 <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formState.deptGroup}
                    onChange={(e) => setFormState({ ...formState, deptGroup: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs bg-white"
                  >
                    <option value="临检">临检组</option>
                    <option value="生化">生化组</option>
                    <option value="免疫">免疫组</option>
                    <option value="微生物">微生物组</option>
                    <option value="输血科">输血科</option>
                    <option value="分子诊断">分子诊断组</option>
                    <option value="质控中心">质控中心</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    项目编码 <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formState.itemCode}
                    onChange={(e) => setFormState({ ...formState, itemCode: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 font-mono text-xs"
                    placeholder="如 LIS-1010"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    试剂分类 <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formState.categoryKey}
                    onChange={(e) => {
                      const key = e.target.value;
                      const map: Record<string, string> = {
                        TEST: '检测试剂',
                        TYPING: '配型试剂',
                        PROCESS: '处理试剂',
                        MEDIA: '培养基',
                        QC: '质控试剂',
                        OTHER: '其他耗材',
                      };
                      setFormState({
                        ...formState,
                        categoryKey: key,
                        categoryName: map[key] || '检测试剂',
                      });
                    }}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs bg-white"
                  >
                    <option value="TEST">检测试剂</option>
                    <option value="TYPING">配型试剂</option>
                    <option value="PROCESS">处理试剂</option>
                    <option value="MEDIA">培养基</option>
                    <option value="QC">质控试剂</option>
                    <option value="OTHER">其他耗材</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  项目名称 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formState.itemName}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFormState({
                      ...formState,
                      itemName: val,
                      pinyinCode: val.substring(0, 5).toUpperCase(),
                    });
                  }}
                  placeholder="例如：糖化血红蛋白(HbA1c)色谱分析测定"
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">拼音简码</label>
                  <input
                    type="text"
                    value={formState.pinyinCode}
                    onChange={(e) => setFormState({ ...formState, pinyinCode: e.target.value })}
                    placeholder="如 THXDB"
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 font-mono text-xs uppercase"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">五笔简码</label>
                  <input
                    type="text"
                    value={formState.wubiCode}
                    onChange={(e) => setFormState({ ...formState, wubiCode: e.target.value })}
                    placeholder="如 OTHD"
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 font-mono text-xs uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">采集容器</label>
                  <input
                    type="text"
                    value={formState.container}
                    onChange={(e) => setFormState({ ...formState, container: e.target.value })}
                    placeholder="如 EDTA抗凝管(紫帽)"
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">标本类型</label>
                  <input
                    type="text"
                    value={formState.sampleType}
                    onChange={(e) => setFormState({ ...formState, sampleType: e.target.value })}
                    placeholder="如 全血 / 血清 / 尿液"
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">适用性别</label>
                  <select
                    value={formState.gender}
                    onChange={(e) => setFormState({ ...formState, gender: e.target.value as any })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs bg-white"
                  >
                    <option value="通用">通用</option>
                    <option value="男">男</option>
                    <option value="女">女</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">成本 (¥)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formState.cost}
                    onChange={(e) => setFormState({ ...formState, cost: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">收费价格 (¥)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formState.price}
                    onChange={(e) => setFormState({ ...formState, price: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 font-mono text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">外检项目</label>
                  <select
                    value={formState.isOutsource}
                    onChange={(e) => setFormState({ ...formState, isOutsource: e.target.value as any })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs bg-white"
                  >
                    <option value="否">否 (院内自检)</option>
                    <option value="是">是 (委外送检)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">状态</label>
                  <select
                    value={formState.status}
                    onChange={(e) => setFormState({ ...formState, status: e.target.value as any })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs bg-white"
                  >
                    <option value="启用">启用</option>
                    <option value="停用">停用</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">HIS/医保对照编码</label>
                  <input
                    type="text"
                    value={formState.hisCode}
                    onChange={(e) => setFormState({ ...formState, hisCode: e.target.value })}
                    placeholder="如 HIS-LAB-3011"
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">配置审核人 (实名)</label>
                  <select
                    value={formState.operator}
                    onChange={(e) => setFormState({ ...formState, operator: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs bg-white"
                  >
                    <option value="郭彩霞主任医师">郭彩霞主任医师 (科主任)</option>
                    <option value="魏明主管检验师">魏明主管检验师 (质控组长)</option>
                    <option value="李晓红副主任技师">李晓红副主任技师 (试剂主管)</option>
                    <option value="陈康主管检验师">陈康主管检验师 (生化免疫组)</option>
                    <option value="刘浩然技师">刘浩然技师 (临检组)</option>
                    <option value="赵雅琴主管护师">赵雅琴主管护师 (门诊采血)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">理论试剂单耗扣减公式</label>
                <input
                  type="text"
                  value={formState.formulaDesc}
                  onChange={(e) => setFormState({ ...formState, formulaDesc: e.target.value })}
                  placeholder="例如：单次样本测定自动扣减 100μL 试剂 + 0.5ml 稀释液"
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs"
                />
              </div>
            </div>

            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-1.5 border border-slate-300 text-slate-700 rounded hover:bg-slate-100 font-medium text-xs"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleSaveAdd}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium text-xs shadow-xs"
              >
                保存配置
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: 编辑检验项目试剂使用配置 */}
      {isEditModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-5 py-3.5 bg-slate-800 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit className="w-4 h-4 text-blue-400" />
                <h3 className="font-bold text-sm">
                  编辑检验项目配置：{editingItem.itemName} ({editingItem.itemCode})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingItem(null);
                }}
                className="text-white/80 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">业务小组</label>
                  <select
                    value={formState.deptGroup}
                    onChange={(e) => setFormState({ ...formState, deptGroup: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs bg-white"
                  >
                    <option value="临检">临检组</option>
                    <option value="生化">生化组</option>
                    <option value="免疫">免疫组</option>
                    <option value="微生物">微生物组</option>
                    <option value="输血科">输血科</option>
                    <option value="分子诊断">分子诊断组</option>
                    <option value="质控中心">质控中心</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">项目编码 (系统固化)</label>
                  <input
                    type="text"
                    disabled
                    value={formState.itemCode}
                    className="w-full border border-slate-200 bg-slate-100 rounded px-2.5 py-1.5 font-mono text-xs text-slate-500 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">试剂分类</label>
                  <select
                    value={formState.categoryKey}
                    onChange={(e) => {
                      const key = e.target.value;
                      const map: Record<string, string> = {
                        TEST: '检测试剂',
                        TYPING: '配型试剂',
                        PROCESS: '处理试剂',
                        MEDIA: '培养基',
                        QC: '质控试剂',
                        OTHER: '其他耗材',
                      };
                      setFormState({
                        ...formState,
                        categoryKey: key,
                        categoryName: map[key] || '检测试剂',
                      });
                    }}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs bg-white"
                  >
                    <option value="TEST">检测试剂</option>
                    <option value="TYPING">配型试剂</option>
                    <option value="PROCESS">处理试剂</option>
                    <option value="MEDIA">培养基</option>
                    <option value="QC">质控试剂</option>
                    <option value="OTHER">其他耗材</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  项目名称 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formState.itemName}
                  onChange={(e) => setFormState({ ...formState, itemName: e.target.value })}
                  className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">拼音简码</label>
                  <input
                    type="text"
                    value={formState.pinyinCode}
                    onChange={(e) => setFormState({ ...formState, pinyinCode: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 font-mono text-xs uppercase"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">五笔简码</label>
                  <input
                    type="text"
                    value={formState.wubiCode}
                    onChange={(e) => setFormState({ ...formState, wubiCode: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 font-mono text-xs uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">采集容器</label>
                  <input
                    type="text"
                    value={formState.container}
                    onChange={(e) => setFormState({ ...formState, container: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">标本类型</label>
                  <input
                    type="text"
                    value={formState.sampleType}
                    onChange={(e) => setFormState({ ...formState, sampleType: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">适用性别</label>
                  <select
                    value={formState.gender}
                    onChange={(e) => setFormState({ ...formState, gender: e.target.value as any })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs bg-white"
                  >
                    <option value="通用">通用</option>
                    <option value="男">男</option>
                    <option value="女">女</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">成本 (¥)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formState.cost}
                    onChange={(e) => setFormState({ ...formState, cost: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">收费价格 (¥)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formState.price}
                    onChange={(e) => setFormState({ ...formState, price: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 font-mono text-xs font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">外检</label>
                  <select
                    value={formState.isOutsource}
                    onChange={(e) => setFormState({ ...formState, isOutsource: e.target.value as any })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs bg-white"
                  >
                    <option value="否">否</option>
                    <option value="是">是</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">状态</label>
                  <select
                    value={formState.status}
                    onChange={(e) => setFormState({ ...formState, status: e.target.value as any })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs bg-white"
                  >
                    <option value="启用">启用</option>
                    <option value="停用">停用</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">HIS对照编码</label>
                  <input
                    type="text"
                    value={formState.hisCode}
                    onChange={(e) => setFormState({ ...formState, hisCode: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">单耗扣减公式说明</label>
                  <input
                    type="text"
                    value={formState.formulaDesc}
                    onChange={(e) => setFormState({ ...formState, formulaDesc: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingItem(null);
                }}
                className="px-4 py-1.5 border border-slate-300 text-slate-700 rounded hover:bg-slate-100 font-medium text-xs"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium text-xs shadow-xs"
              >
                保存修改
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: 类型维护 */}
      {isTypeMaintenanceModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-5 py-3.5 bg-blue-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                <h3 className="font-bold text-sm">试剂使用分类与扣减规则维护</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsTypeMaintenanceModalOpen(false)}
                className="text-white/80 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3 text-xs">
              <p className="text-slate-600">
                本页面配置所有实验室检验项目对应的一级/二级试剂分类，支持检验结果审核后与仪器接口自动扣减库存。
              </p>

              <div className="border border-slate-200 rounded p-3 bg-slate-50 space-y-1.5 font-mono text-[11px]">
                <div className="font-bold text-blue-700">▼ 所有试剂 [ALL]</div>
                <div className="pl-4 text-slate-700">├─ 检测试剂 [TEST] (生化测定、免疫发光、血球分析项目)</div>
                <div className="pl-4 text-slate-700">├─ 配型试剂 [TYPING] (微柱血型定型卡、交叉配血)</div>
                <div className="pl-4 text-slate-700">├─ 处理试剂 [PROCESS] (全自动清洗液、去垢液、裂解液)</div>
                <div className="pl-4 text-slate-700">├─ 培养基 [MEDIA] (血琼脂平板、需氧/厌氧双联血培养瓶)</div>
                <div className="pl-4 text-slate-700">├─ 质控试剂 [QC] (生化三水平质控物、血凝多参数质控品)</div>
                <div className="pl-4 text-slate-700">└─ 其他耗材 [OTHER] (一次性促凝采血管、吸头、穿刺包)</div>
              </div>

              <div className="bg-blue-50 border border-blue-200 p-2.5 rounded text-blue-800 text-[11px]">
                💡 说明：试剂使用配置与医保物价编码严格对照，修改后将实时同步至临床检验流水线及门诊医生工作站。
              </div>
            </div>

            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setIsTypeMaintenanceModalOpen(false)}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium text-xs shadow-xs"
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

// =========================================================================
// 3. 采购需求管理 子页面 (基于截图 image_5617a2c3.png 重新排版与交互升级)
// =========================================================================

interface DemandReagentDetail {
  code: string; // 试剂编码 (如 010012)
  name: string; // 试剂名称
  vendor: string; // 生产商
  spec: string; // 规格
  unit: string; // 单位
  qty: number; // 数量
  price?: number; // 单价
  note?: string; // 需求说明
}

interface ProcurementDemandOrder {
  orderNo: string; // 需求单号 (如 N0000004, N0000003, N0000002, N0000001)
  warehouse: string; // 申请库房 (如 生化组库房、临检组库房、免疫组库房)
  warehouseKey: string; // 库房Key: 'biochem' | 'clin' | 'imm' | 'micro' | 'blood' | 'emerg'
  applyTime: string; // 申请时间 (近期 2026年10月)
  applicant: string; // 申请人 (真实姓名)
  reviewer: string; // 审核人 (真实姓名)
  reviewTime: string; // 审核时间
  status: '登记' | '审核' | '已提交' | '已驳回'; // 状态
  urgency: '正常' | '加急'; // 紧急度
  items: DemandReagentDetail[]; // 关联试剂明细 (右侧表格联动显示)
}

const INITIAL_DEMAND_ORDERS: ProcurementDemandOrder[] = [
  {
    orderNo: 'N0000004',
    warehouse: '生化组库房',
    warehouseKey: 'biochem',
    applyTime: '2026-10-30 08:30:15',
    applicant: '魏明主管检验师',
    reviewer: '',
    reviewTime: '',
    status: '登记',
    urgency: '加急',
    items: [
      {
        code: '010012',
        name: '人字梯',
        vendor: '上海雷都医用器材工程有限公司',
        spec: '2米',
        unit: '架',
        qty: 100,
        price: 380.0,
        note: '流水线与冷库检修维保专用梯备件',
      },
      {
        code: '010013',
        name: '红色地垫',
        vendor: '江苏三泰洁净技术有限公司',
        spec: '1*1.5米',
        unit: '张',
        qty: 10,
        price: 168.0,
        note: '生化分析仪样本进样区防静电耐酸碱地垫',
      },
      {
        code: '010028',
        name: '丙氨酸氨基转移酶(ALT)测定试剂盒',
        vendor: '迈克生物股份有限公司',
        spec: 'R1: 4×60ml, R2: 4×15ml',
        unit: '盒',
        qty: 35,
        price: 320.0,
        note: '日均标本量激增，常规储备补库',
      },
    ],
  },
  {
    orderNo: 'N0000003',
    warehouse: '生化组库房',
    warehouseKey: 'biochem',
    applyTime: '2026-10-29 14:10:00',
    applicant: '陈康主管检验师',
    reviewer: '',
    reviewTime: '',
    status: '登记',
    urgency: '正常',
    items: [
      {
        code: '010031',
        name: '全自动生化分析仪酸性浓缩清洗液',
        vendor: '贝克曼库尔特商贸(中国)有限公司',
        spec: '5000ml/桶',
        unit: '桶',
        qty: 20,
        price: 430.0,
        note: '全自动流水线专用系统清洗剂',
      },
      {
        code: '010015',
        name: '复合多参数生化室内质控血清',
        vendor: '罗氏诊断产品(上海)有限公司',
        spec: '5ml×6支/盒',
        unit: '盒',
        qty: 15,
        price: 860.0,
        note: '11月份全院生化室内质控周期换批物料',
      },
    ],
  },
  {
    orderNo: 'N0000002',
    warehouse: '生化组库房',
    warehouseKey: 'biochem',
    applyTime: '2026-10-28 09:20:30',
    applicant: '刘浩然技师',
    reviewer: '郭彩霞主任医师',
    reviewTime: '2026-10-28 11:45:00',
    status: '审核',
    urgency: '正常',
    items: [
      {
        code: '010064',
        name: '全自动反应杯环形试剂转盘组件',
        vendor: '深圳迈瑞生物医疗电子股份有限公司',
        spec: '60位/盘 耐高温特种树脂',
        unit: '套',
        qty: 4,
        price: 2800.0,
        note: '2号生化流水线机械臂定期更换易耗件',
      },
      {
        code: '010012',
        name: '人字梯',
        vendor: '上海雷都医用器材工程有限公司',
        spec: '2米',
        unit: '架',
        qty: 2,
        price: 380.0,
        note: '生化仪器备用',
      },
    ],
  },
  {
    orderNo: 'N0000001',
    warehouse: '生化组库房',
    warehouseKey: 'biochem',
    applyTime: '2026-10-27 16:40:20',
    applicant: '李晓红副主任技师',
    reviewer: '郭彩霞主任医师',
    reviewTime: '2026-10-27 18:00:10',
    status: '审核',
    urgency: '正常',
    items: [
      {
        code: '010013',
        name: '红色地垫',
        vendor: '江苏三泰洁净技术有限公司',
        spec: '1*1.5米',
        unit: '张',
        qty: 6,
        price: 168.0,
        note: '生化前处理区更换旧损地垫',
      },
      {
        code: '010034',
        name: '天门冬氨酸氨基转移酶(AST)测定试剂盒',
        vendor: '罗氏诊断产品(上海)有限公司',
        spec: 'R1: 4×60ml, R2: 4×15ml',
        unit: '盒',
        qty: 25,
        price: 350.0,
        note: '日常检测备货',
      },
    ],
  },
  {
    orderNo: 'N0000005',
    warehouse: '临检组库房',
    warehouseKey: 'clin',
    applyTime: '2026-10-29 11:15:00',
    applicant: '钱宇恒技师',
    reviewer: '魏明主管检验师',
    reviewTime: '2026-10-29 13:30:00',
    status: '审核',
    urgency: '正常',
    items: [
      {
        code: '010022',
        name: '一次性使用负压真空采血管(促凝红帽 5ml)',
        vendor: '威高集团医用高分子制品股份有限公司',
        spec: '100支/盒',
        unit: '盒',
        qty: 200,
        price: 65.0,
        note: '门诊采血大厅周转使用',
      },
      {
        code: '010047',
        name: '五分类血细胞分析仪专用稀释液 CELLPACK DCL',
        vendor: '希森美康医用电子(上海)有限公司',
        spec: '20L/箱',
        unit: '箱',
        qty: 30,
        price: 520.0,
        note: '全血球流水线两周用量',
      },
    ],
  },
  {
    orderNo: 'N0000006',
    warehouse: '微生物组库房',
    warehouseKey: 'micro',
    applyTime: '2026-10-30 09:00:00',
    applicant: '郭彩霞主任医师',
    reviewer: '',
    reviewTime: '',
    status: '登记',
    urgency: '加急',
    items: [
      {
        code: '010036',
        name: '全自动微生物鉴定药敏复合测试卡(VITEK 2 GN)',
        vendor: '生物梅里埃(中国)有限公司',
        spec: '20卡/盒',
        unit: '盒',
        qty: 40,
        price: 1180.0,
        note: '重症感染菌株分离增量急需补充',
      },
      {
        code: '010008',
        name: '全自动血培养瓶 (需氧+厌氧双联配对瓶)',
        vendor: '生物梅里埃(中国)有限公司',
        spec: '50瓶/箱',
        unit: '箱',
        qty: 25,
        price: 1950.0,
        note: '急诊发热门诊及ICU床旁采血需求',
      },
    ],
  },
];

const ProcurementDemandSubView: React.FC<{
  hospitalUnit: string;
  showNotice: (m: string) => void;
}> = ({ hospitalUnit, showNotice }) => {
  // Filter States matching screenshot
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>('生化库'); // "当前库房"
  const [dateRange, setDateRange] = useState<string>('2026-10-01 ~ 2026-10-31'); // "需求日期"
  const [selectedStatus, setSelectedStatus] = useState<string>('全部'); // "状态"
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  // Orders State
  const [orders, setOrders] = useState<ProcurementDemandOrder[]>(INITIAL_DEMAND_ORDERS);

  // Selected Order for Master-Detail (clicking left row updates right table)
  const [selectedOrderNo, setSelectedOrderNo] = useState<string>('N0000004');

  // Modals State
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editingOrder, setEditingOrder] = useState<ProcurementDemandOrder | null>(null);

  // Form State for Add Order
  const [formState, setFormState] = useState<{
    orderNo: string;
    warehouse: string;
    warehouseKey: string;
    applicant: string;
    urgency: '正常' | '加急';
    status: '登记' | '审核';
    items: DemandReagentDetail[];
  }>({
    orderNo: '',
    warehouse: '生化组库房',
    warehouseKey: 'biochem',
    applicant: '魏明主管检验师',
    urgency: '正常',
    status: '登记',
    items: [
      {
        code: '010012',
        name: '人字梯',
        vendor: '上海雷都医用器材工程有限公司',
        spec: '2米',
        unit: '架',
        qty: 10,
        price: 380.0,
        note: '常规补仓',
      },
    ],
  });

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // 1. Warehouse filter
      if (selectedWarehouse !== '全部') {
        if (selectedWarehouse === '生化库' && order.warehouseKey !== 'biochem') return false;
        if (selectedWarehouse === '临检库' && order.warehouseKey !== 'clin') return false;
        if (selectedWarehouse === '免疫库' && order.warehouseKey !== 'imm') return false;
        if (selectedWarehouse === '微生物库' && order.warehouseKey !== 'micro') return false;
        if (selectedWarehouse === '输血科库' && order.warehouseKey !== 'blood') return false;
        if (selectedWarehouse === '急诊化验库' && order.warehouseKey !== 'emerg') return false;
      }

      // 2. Status filter
      if (selectedStatus !== '全部' && order.status !== selectedStatus) {
        return false;
      }

      // 3. Keyword filter
      if (searchKeyword.trim()) {
        const kw = searchKeyword.toLowerCase();
        const match =
          order.orderNo.toLowerCase().includes(kw) ||
          order.warehouse.toLowerCase().includes(kw) ||
          order.applicant.toLowerCase().includes(kw) ||
          order.reviewer.toLowerCase().includes(kw);
        if (!match) return false;
      }

      return true;
    });
  }, [orders, selectedWarehouse, selectedStatus, searchKeyword]);

  // Ensure an order is selected
  React.useEffect(() => {
    if (filteredOrders.length > 0) {
      const exists = filteredOrders.some((o) => o.orderNo === selectedOrderNo);
      if (!exists) {
        setSelectedOrderNo(filteredOrders[0].orderNo);
      }
    }
  }, [filteredOrders, selectedOrderNo]);

  // Currently selected active order object
  const currentActiveOrder = useMemo(() => {
    return (
      orders.find((o) => o.orderNo === selectedOrderNo) ||
      filteredOrders[0] ||
      orders[0]
    );
  }, [orders, selectedOrderNo, filteredOrders]);

  // Right Table Reagents (items belonging to currentActiveOrder)
  const currentDetailItems = useMemo(() => {
    return currentActiveOrder ? currentActiveOrder.items : [];
  }, [currentActiveOrder]);

  // Calculate total amounts
  const totalDetailAmount = useMemo(() => {
    return currentDetailItems.reduce(
      (sum, item) => sum + (item.price || 0) * item.qty,
      0
    );
  }, [currentDetailItems]);

  // Handle Left Row Click (dynamically changes right detail table)
  const handleSelectOrder = (order: ProcurementDemandOrder) => {
    setSelectedOrderNo(order.orderNo);
    showNotice(`已切换选中需求单【${order.orderNo}】(${order.warehouse})，右侧展示其 ${order.items.length} 项试剂明细`);
  };

  // Open Add Order Modal
  const handleOpenAddModal = () => {
    const nextNum = 'N000000' + (orders.length + 1);
    setFormState({
      orderNo: nextNum,
      warehouse: selectedWarehouse === '全部' ? '生化组库房' : selectedWarehouse + '房',
      warehouseKey: 'biochem',
      applicant: '魏明主管检验师',
      urgency: '正常',
      status: '登记',
      items: [
        {
          code: '010012',
          name: '人字梯',
          vendor: '上海雷都医用器材工程有限公司',
          spec: '2米',
          unit: '架',
          qty: 5,
          price: 380.0,
          note: '日常备件',
        },
        {
          code: '010013',
          name: '红色地垫',
          vendor: '江苏三泰洁净技术有限公司',
          spec: '1*1.5米',
          unit: '张',
          qty: 4,
          price: 168.0,
          note: '防静电地垫',
        },
      ],
    });
    setIsAddModalOpen(true);
  };

  // Save New Order
  const handleSaveAddOrder = () => {
    const newOrder: ProcurementDemandOrder = {
      orderNo: formState.orderNo,
      warehouse: formState.warehouse,
      warehouseKey: formState.warehouseKey,
      applyTime: '2026-10-30 11:20:00',
      applicant: formState.applicant,
      reviewer: '',
      reviewTime: '',
      status: formState.status,
      urgency: formState.urgency,
      items: formState.items,
    };

    setOrders((prev) => [newOrder, ...prev]);
    setSelectedOrderNo(newOrder.orderNo);
    setIsAddModalOpen(false);
    showNotice(`已成功生成采购需求单【${newOrder.orderNo}】，并已加载其物资明细`);
  };

  // Open Edit Order Modal
  const handleOpenEditModal = (order: ProcurementDemandOrder) => {
    setEditingOrder(order);
    setFormState({
      orderNo: order.orderNo,
      warehouse: order.warehouse,
      warehouseKey: order.warehouseKey,
      applicant: order.applicant,
      urgency: order.urgency,
      status: order.status as any,
      items: [...order.items],
    });
    setIsEditModalOpen(true);
  };

  // Save Edit Order
  const handleSaveEditOrder = () => {
    if (!editingOrder) return;
    setOrders((prev) =>
      prev.map((o) =>
        o.orderNo === editingOrder.orderNo
          ? {
              ...o,
              warehouse: formState.warehouse,
              applicant: formState.applicant,
              urgency: formState.urgency,
              items: formState.items,
            }
          : o
      )
    );
    setIsEditModalOpen(false);
    setEditingOrder(null);
    showNotice(`采购需求单【${formState.orderNo}】修改已成功保存`);
  };

  // Delete Order
  const handleDeleteOrder = (order: ProcurementDemandOrder) => {
    if (window.confirm(`确定要删除需求单【${order.orderNo}】吗？`)) {
      setOrders((prev) => prev.filter((o) => o.orderNo !== order.orderNo));
      showNotice(`已删除需求单：${order.orderNo}`);
    }
  };

  // Approve / Review Order
  const handleApproveOrder = (order: ProcurementDemandOrder) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.orderNo === order.orderNo
          ? {
              ...o,
              status: '审核',
              reviewer: '郭彩霞主任医师',
              reviewTime: '2026-10-30 11:30:00',
            }
          : o
      )
    );
    showNotice(`需求单【${order.orderNo}】已完成审核（审核人：郭彩霞主任医师）`);
  };

  // Revoke Order Review
  const handleRevokeOrder = (order: ProcurementDemandOrder) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.orderNo === order.orderNo
          ? {
              ...o,
              status: '登记',
              reviewer: '',
              reviewTime: '',
            }
          : o
      )
    );
    showNotice(`需求单【${order.orderNo}】审核已撤销，恢复为登记编辑状态`);
  };

  // Submit Order to Procurement Plan
  const handleSubmitBatch = () => {
    if (!currentActiveOrder) {
      showNotice('请先在左侧选择需要提交的需求单');
      return;
    }
    if (currentActiveOrder.status === '已提交') {
      showNotice(`需求单【${currentActiveOrder.orderNo}】已在采购计划中，无需重复提交`);
      return;
    }
    setOrders((prev) =>
      prev.map((o) =>
        o.orderNo === currentActiveOrder.orderNo
          ? { ...o, status: '已提交', reviewer: o.reviewer || '郭彩霞主任医师', reviewTime: o.reviewTime || '2026-10-30 11:35:00' }
          : o
      )
    );
    showNotice(`需求单【${currentActiveOrder.orderNo}】已成功提交至医学装备部月度采购计划！`);
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 flex-1 flex flex-col overflow-hidden shadow-xs text-xs">
      {/* Top Title & Main Action Buttons matching screenshot: 采购需求管理, 新增, 提交 */}
      <div className="p-3 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">采购需求管理</h2>
          </div>
          <span className="text-slate-300">|</span>
          <span className="text-slate-500 text-xs">
            归属中心：<strong>{hospitalUnit}</strong> · 医学检验科耗材采购申报中心
          </span>
        </div>

        {/* Action Buttons matching screenshot: 新增, 提交 */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleOpenAddModal}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded font-medium shadow-xs flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>新增</span>
          </button>
          <button
            type="button"
            onClick={handleSubmitBatch}
            className="px-4 py-1.5 bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 active:bg-blue-100 rounded font-medium shadow-2xs flex items-center gap-1.5 transition-colors"
            title="将当前选中的需求单提交审核并转入采购计划"
          >
            <Check className="w-3.5 h-3.5" />
            <span>提交</span>
          </button>
        </div>
      </div>

      {/* Filter Bar matching screenshot: 当前库房, 需求日期, 状态, 查询 */}
      <div className="px-3 py-2 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3 flex-wrap">
          {/* 当前库房 Dropdown */}
          <div className="flex items-center gap-1.5">
            <label className="text-slate-700 font-medium">当前库房:</label>
            <select
              value={selectedWarehouse}
              onChange={(e) => {
                setSelectedWarehouse(e.target.value);
                showNotice(`已切换当前库房：【${e.target.value}】`);
              }}
              className="border border-slate-300 rounded px-2.5 py-1 text-xs bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
            >
              <option value="生化库">生化库</option>
              <option value="临检库">临检库</option>
              <option value="免疫库">免疫库</option>
              <option value="微生物库">微生物库</option>
              <option value="全部">全部库房</option>
            </select>
          </div>

          {/* 需求日期 Date Range */}
          <div className="flex items-center gap-1.5">
            <label className="text-slate-700 font-medium">需求日期:</label>
            <div className="relative">
              <input
                type="text"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="border border-slate-300 rounded pl-2.5 pr-7 py-1 text-xs bg-white font-mono text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 w-52"
                placeholder="2026-10-01 ~ 2026-10-31"
              />
              <CalendarCheck className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2 pointer-events-none" />
            </div>
          </div>

          {/* 状态 Dropdown */}
          <div className="flex items-center gap-1.5">
            <label className="text-slate-700 font-medium">状态:</label>
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                showNotice(`已筛选状态：【${e.target.value}】`);
              }}
              className="border border-slate-300 rounded px-2.5 py-1 text-xs bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 min-w-[70px]"
            >
              <option value="全部">全部</option>
              <option value="登记">登记</option>
              <option value="审核">审核</option>
              <option value="已提交">已提交</option>
            </select>
          </div>

          {/* 查询 Button */}
          <button
            type="button"
            onClick={() => {
              showNotice(`查询完成：库房【${selectedWarehouse}】下共有 ${filteredOrders.length} 笔需求单`);
            }}
            className="px-3.5 py-1 bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 rounded text-xs font-medium shadow-2xs"
          >
            查询
          </button>
        </div>

        {/* Real-time Status Pills */}
        <div className="flex items-center gap-2 text-[11px] text-slate-500">
          <span className="flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-slate-200">
            <span>当前单据:</span>
            <strong className="text-blue-700 font-mono font-bold">{selectedOrderNo}</strong>
          </span>
          <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded border border-amber-200 font-medium">
            待审登记: {orders.filter((o) => o.status === '登记').length}
          </span>
          <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200 font-medium">
            已审核: {orders.filter((o) => o.status === '审核').length}
          </span>
        </div>
      </div>

      {/* Main Master-Detail Split Workspace (Left Table + Right Table matching image_5617a2c3.png) */}
      <div className="flex-1 flex min-h-0 overflow-hidden divide-x divide-slate-200">
        {/* ========================================================================= */}
        {/* Left Master Table: 需求单列表 */}
        {/* ========================================================================= */}
        <div className="w-[52%] flex flex-col min-w-0 bg-white overflow-hidden">
          {/* Table Header banner */}
          <div className="px-3 py-1.5 bg-slate-100/90 border-b border-slate-200 flex items-center justify-between text-slate-700 font-semibold select-none">
            <div className="flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              <span>采购需求单据列表</span>
              <span className="text-[11px] font-normal text-slate-400">
                (点击行可联动切换右侧试剂明细)
              </span>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">
              共 {filteredOrders.length} 笔单据
            </span>
          </div>

          {/* Left Table Container */}
          <div className="flex-1 overflow-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="sticky top-0 z-10 bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 select-none shadow-2xs">
                <tr>
                  <th className="py-2.5 px-3 whitespace-nowrap">需求单号</th>
                  <th className="py-2.5 px-3 whitespace-nowrap">申请库房</th>
                  <th className="py-2.5 px-3 whitespace-nowrap">申请时间</th>
                  <th className="py-2.5 px-3 whitespace-nowrap">申请人</th>
                  <th className="py-2.5 px-3 whitespace-nowrap">审核人</th>
                  <th className="py-2.5 px-3 whitespace-nowrap">审核时间</th>
                  <th className="py-2.5 px-2.5 text-center whitespace-nowrap">状态</th>
                  <th className="py-2.5 px-3 text-center whitespace-nowrap sticky right-0 bg-slate-50 shadow-l">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      <Archive className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                      <div>暂无符合筛选条件的采购需求单</div>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => {
                    const isSelected = order.orderNo === selectedOrderNo;
                    return (
                      <tr
                        key={order.orderNo}
                        onClick={() => handleSelectOrder(order)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-blue-50/80 font-medium text-slate-900 border-l-3 border-blue-600'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        {/* 需求单号 */}
                        <td className="py-2.5 px-3 font-mono font-bold text-blue-700">
                          {order.orderNo}
                        </td>

                        {/* 申请库房 */}
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          {order.warehouse}
                        </td>

                        {/* 申请时间 */}
                        <td className="py-2.5 px-3 font-mono text-slate-500 whitespace-nowrap">
                          {order.applyTime}
                        </td>

                        {/* 申请人 */}
                        <td className="py-2.5 px-3 whitespace-nowrap text-slate-800">
                          {order.applicant}
                        </td>

                        {/* 审核人 */}
                        <td className="py-2.5 px-3 whitespace-nowrap text-slate-800">
                          {order.reviewer || '-'}
                        </td>

                        {/* 审核时间 */}
                        <td className="py-2.5 px-3 font-mono text-slate-500 whitespace-nowrap">
                          {order.reviewTime || '-'}
                        </td>

                        {/* 状态 (登记 / 审核 / 已提交) matching screenshot */}
                        <td className="py-2.5 px-2.5 text-center whitespace-nowrap">
                          {order.status === '登记' ? (
                            <span className="text-slate-600 font-medium bg-slate-100 px-2 py-0.5 rounded text-[11px] border border-slate-200">
                              登记
                            </span>
                          ) : order.status === '审核' ? (
                            <span className="text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded text-[11px] border border-blue-200">
                              审核
                            </span>
                          ) : (
                            <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[11px] border border-emerald-200">
                              已提交
                            </span>
                          )}
                        </td>

                        {/* 操作 matching screenshot: 编辑, 删除 (登记状态) / 撤销, 查看 (审核状态) */}
                        <td
                          className={`py-2.5 px-3 text-center whitespace-nowrap sticky right-0 shadow-l ${
                            isSelected ? 'bg-blue-50/80' : 'bg-white'
                          }`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center justify-center gap-1.5 text-xs">
                            {order.status === '登记' ? (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditModal(order)}
                                  className="text-blue-600 hover:text-blue-800 hover:underline"
                                >
                                  编辑
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteOrder(order)}
                                  className="text-blue-600 hover:text-rose-600 hover:underline ml-1"
                                >
                                  删除
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleApproveOrder(order)}
                                  className="text-emerald-700 hover:text-emerald-900 font-bold hover:underline ml-1"
                                  title="快速审核通过"
                                >
                                  审核
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleRevokeOrder(order)}
                                  className="text-blue-600 hover:text-amber-700 hover:underline"
                                >
                                  撤销
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    handleSelectOrder(order);
                                    showNotice(`当前查看需求单【${order.orderNo}】明细`);
                                  }}
                                  className="text-blue-600 hover:text-blue-800 hover:underline ml-1"
                                >
                                  查看
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Left Table Footer matching screenshot: "合计: 1条" */}
          <div className="px-3 py-2 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600 select-none shrink-0 font-medium">
            <span className="text-blue-700 font-bold">
              合计: {filteredOrders.length} 条
            </span>
            <span className="text-slate-400 text-[11px]">
              单击行高亮切换右侧明细清单
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* Right Detail Table: 试剂编码、试剂名称、生产商、规格、单位、数量 (matching image_5617a2c3.png) */}
        {/* ========================================================================= */}
        <div className="w-[48%] flex flex-col min-w-0 bg-white overflow-hidden">
          {/* Header of Detail Table */}
          <div className="px-3 py-1.5 bg-slate-100/90 border-b border-slate-200 flex items-center justify-between text-slate-700 font-semibold select-none">
            <div className="flex items-center gap-1.5">
              <Boxes className="w-3.5 h-3.5 text-blue-600" />
              <span>需求单物资明细</span>
              <span className="text-blue-700 font-mono font-bold">
                [{currentActiveOrder?.orderNo || '-'}]
              </span>
              <span className="text-[11px] font-normal text-slate-500">
                ({currentActiveOrder?.warehouse})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-500 font-mono">
                共 {currentDetailItems.length} 项试剂
              </span>
              <button
                type="button"
                onClick={() => {
                  showNotice(`已导出【${currentActiveOrder?.orderNo}】耗材采购清单明细`);
                }}
                className="text-xs text-blue-600 hover:underline flex items-center gap-0.5"
              >
                <Download className="w-3 h-3" />
                <span>导出</span>
              </button>
            </div>
          </div>

          {/* Right Table Container */}
          <div className="flex-1 overflow-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="sticky top-0 z-10 bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 select-none shadow-2xs">
                <tr>
                  <th className="py-2.5 px-3 whitespace-nowrap">试剂编码</th>
                  <th className="py-2.5 px-3 min-w-[120px]">试剂名称</th>
                  <th className="py-2.5 px-3 min-w-[140px]">生产商</th>
                  <th className="py-2.5 px-3 min-w-[90px]">规格</th>
                  <th className="py-2.5 px-2.5 text-center whitespace-nowrap">单位</th>
                  <th className="py-2.5 px-3 text-right whitespace-nowrap font-bold">数量</th>
                  <th className="py-2.5 px-3 text-right whitespace-nowrap">参考单价</th>
                  <th className="py-2.5 px-3 whitespace-nowrap">需求说明</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {currentDetailItems.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      <Archive className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                      <div>该单据暂无关联试剂明细</div>
                    </td>
                  </tr>
                ) : (
                  currentDetailItems.map((item, idx) => (
                    <tr
                      key={item.code + idx}
                      className="hover:bg-blue-50/30 transition-colors"
                    >
                      {/* 试剂编码 matching screenshot: 010012, etc */}
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-800 whitespace-nowrap">
                        {item.code}
                      </td>

                      {/* 试剂名称 matching screenshot: 人字梯, 红色地垫, etc */}
                      <td className="py-2.5 px-3 font-semibold text-slate-900">
                        {item.name}
                      </td>

                      {/* 生产商 matching screenshot */}
                      <td className="py-2.5 px-3 text-slate-600 text-xs">
                        {item.vendor || '-'}
                      </td>

                      {/* 规格 matching screenshot: 2米, 1*1.5米, etc */}
                      <td className="py-2.5 px-3 font-mono text-slate-600 whitespace-nowrap">
                        {item.spec}
                      </td>

                      {/* 单位 matching screenshot: 架, 张, etc */}
                      <td className="py-2.5 px-2.5 text-center text-slate-700 whitespace-nowrap">
                        {item.unit}
                      </td>

                      {/* 数量 matching screenshot: 100, 10, etc */}
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-blue-700 whitespace-nowrap text-sm">
                        {item.qty}
                      </td>

                      {/* 参考单价 */}
                      <td className="py-2.5 px-3 text-right font-mono text-slate-600 whitespace-nowrap">
                        {item.price ? `¥${item.price.toFixed(2)}` : '-'}
                      </td>

                      {/* 需求说明 */}
                      <td className="py-2.5 px-3 text-slate-500 text-[11px] truncate max-w-[130px]">
                        {item.note || '常规提报'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Right Table Footer matching screenshot: "合计: 2条" */}
          <div className="px-3 py-2 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600 select-none shrink-0 font-medium">
            <span className="text-blue-700 font-bold">
              合计: {currentDetailItems.length} 条
            </span>
            <div className="flex items-center gap-1.5 text-slate-700 font-mono text-xs">
              <span>预估总金额:</span>
              <strong className="text-rose-600 font-bold">¥{totalDetailAmount.toFixed(2)}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL: 新增采购需求单 */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-5 py-3.5 bg-blue-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                <h3 className="font-bold text-sm">新建科室耗材采购需求单</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-white/80 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">需求单号</label>
                  <input
                    type="text"
                    disabled
                    value={formState.orderNo}
                    className="w-full border border-slate-200 bg-slate-100 rounded px-2.5 py-1.5 font-mono text-xs text-slate-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    申请库房 <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formState.warehouse}
                    onChange={(e) => {
                      const val = e.target.value;
                      let key = 'biochem';
                      if (val.includes('临检')) key = 'clin';
                      if (val.includes('免疫')) key = 'imm';
                      if (val.includes('微生物')) key = 'micro';
                      if (val.includes('输血')) key = 'blood';
                      setFormState({ ...formState, warehouse: val, warehouseKey: key });
                    }}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs bg-white"
                  >
                    <option value="生化组库房">生化组库房</option>
                    <option value="临检组库房">临检组库房</option>
                    <option value="免疫组库房">免疫组库房</option>
                    <option value="微生物组库房">微生物组库房</option>
                    <option value="输血科库房">输血科库房</option>
                    <option value="急诊化验库房">急诊化验库房</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    申请人 (实名) <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formState.applicant}
                    onChange={(e) => setFormState({ ...formState, applicant: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs bg-white"
                  >
                    <option value="魏明主管检验师">魏明主管检验师 (生化库管)</option>
                    <option value="陈康主管检验师">陈康主管检验师 (生化组)</option>
                    <option value="李晓红副主任技师">李晓红副主任技师 (试剂主管)</option>
                    <option value="刘浩然技师">刘浩然技师 (常规检验)</option>
                    <option value="郭彩霞主任医师">郭彩霞主任医师 (科主任)</option>
                    <option value="钱宇恒技师">钱宇恒技师 (临检组)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">缓急程度</label>
                  <select
                    value={formState.urgency}
                    onChange={(e) => setFormState({ ...formState, urgency: e.target.value as any })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs bg-white"
                  >
                    <option value="正常">正常补货</option>
                    <option value="加急">加急采购 (库存临界警报)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">初审状态</label>
                  <select
                    value={formState.status}
                    onChange={(e) => setFormState({ ...formState, status: e.target.value as any })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs bg-white"
                  >
                    <option value="登记">保存为草稿登记</option>
                    <option value="审核">直接完成科室审核</option>
                  </select>
                </div>
              </div>

              {/* Items Section */}
              <div className="border border-slate-200 rounded-lg p-3 bg-slate-50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800">申购试剂条目列表</span>
                  <button
                    type="button"
                    onClick={() => {
                      setFormState({
                        ...formState,
                        items: [
                          ...formState.items,
                          {
                            code: '010028',
                            name: '丙氨酸氨基转移酶(ALT)测定试剂盒',
                            vendor: '迈克生物股份有限公司',
                            spec: 'R1: 4×60ml, R2: 4×15ml',
                            unit: '盒',
                            qty: 20,
                            price: 320.0,
                            note: '备用储备',
                          },
                        ],
                      });
                    }}
                    className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-medium"
                  >
                    <Plus className="w-3 h-3" />
                    <span>添加一行物资</span>
                  </button>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {formState.items.map((it, idx) => (
                    <div
                      key={idx}
                      className="bg-white p-2.5 rounded border border-slate-200 flex items-center gap-2 text-xs"
                    >
                      <input
                        type="text"
                        value={it.code}
                        onChange={(e) => {
                          const newItems = [...formState.items];
                          newItems[idx].code = e.target.value;
                          setFormState({ ...formState, items: newItems });
                        }}
                        className="w-20 border border-slate-300 rounded px-2 py-1 font-mono text-xs"
                        placeholder="编码"
                      />
                      <input
                        type="text"
                        value={it.name}
                        onChange={(e) => {
                          const newItems = [...formState.items];
                          newItems[idx].name = e.target.value;
                          setFormState({ ...formState, items: newItems });
                        }}
                        className="flex-1 border border-slate-300 rounded px-2 py-1 text-xs"
                        placeholder="试剂名称"
                      />
                      <input
                        type="text"
                        value={it.spec}
                        onChange={(e) => {
                          const newItems = [...formState.items];
                          newItems[idx].spec = e.target.value;
                          setFormState({ ...formState, items: newItems });
                        }}
                        className="w-24 border border-slate-300 rounded px-2 py-1 text-xs"
                        placeholder="规格"
                      />
                      <input
                        type="number"
                        value={it.qty}
                        onChange={(e) => {
                          const newItems = [...formState.items];
                          newItems[idx].qty = parseInt(e.target.value, 10) || 1;
                          setFormState({ ...formState, items: newItems });
                        }}
                        className="w-16 border border-slate-300 rounded px-2 py-1 text-right font-mono text-xs"
                        placeholder="数量"
                      />
                      <input
                        type="text"
                        value={it.unit}
                        onChange={(e) => {
                          const newItems = [...formState.items];
                          newItems[idx].unit = e.target.value;
                          setFormState({ ...formState, items: newItems });
                        }}
                        className="w-12 border border-slate-300 rounded px-2 py-1 text-center text-xs"
                        placeholder="单位"
                      />
                      {formState.items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            setFormState({
                              ...formState,
                              items: formState.items.filter((_, i) => i !== idx),
                            });
                          }}
                          className="text-rose-500 hover:text-rose-700"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-1.5 border border-slate-300 text-slate-700 rounded hover:bg-slate-100 font-medium text-xs"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleSaveAddOrder}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium text-xs shadow-xs"
              >
                保存采购需求
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: 编辑采购需求单 */}
      {isEditModalOpen && editingOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-5 py-3.5 bg-slate-800 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit className="w-4 h-4 text-blue-400" />
                <h3 className="font-bold text-sm">编辑需求单：{editingOrder.orderNo}</h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingOrder(null);
                }}
                className="text-white/80 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">申请库房</label>
                  <input
                    type="text"
                    value={formState.warehouse}
                    onChange={(e) => setFormState({ ...formState, warehouse: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">申请人</label>
                  <input
                    type="text"
                    value={formState.applicant}
                    onChange={(e) => setFormState({ ...formState, applicant: e.target.value })}
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs bg-white"
                  />
                </div>
              </div>

              {/* Items in edit */}
              <div className="border border-slate-200 rounded-lg p-3 bg-slate-50 space-y-2">
                <span className="font-semibold text-slate-800">申购试剂清单</span>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {formState.items.map((it, idx) => (
                    <div
                      key={idx}
                      className="bg-white p-2.5 rounded border border-slate-200 flex items-center gap-2 text-xs"
                    >
                      <span className="w-20 font-mono text-slate-700">{it.code}</span>
                      <span className="flex-1 font-semibold text-slate-900">{it.name}</span>
                      <span className="w-24 text-slate-500">{it.spec}</span>
                      <div className="flex items-center gap-1">
                        <label className="text-slate-400">数量:</label>
                        <input
                          type="number"
                          value={it.qty}
                          onChange={(e) => {
                            const newItems = [...formState.items];
                            newItems[idx].qty = parseInt(e.target.value, 10) || 1;
                            setFormState({ ...formState, items: newItems });
                          }}
                          className="w-16 border border-slate-300 rounded px-2 py-1 text-right font-mono font-bold text-blue-700"
                        />
                        <span className="text-slate-600">{it.unit}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingOrder(null);
                }}
                className="px-4 py-1.5 border border-slate-300 text-slate-700 rounded hover:bg-slate-100 font-medium text-xs"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleSaveEditOrder}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium text-xs shadow-xs"
              >
                保存修改
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// =========================================================================
// 4. 采购计划管理 子页面
// =========================================================================
// =========================================================================
// 4. 采购计划管理 子页面 (匹配截图 image_79879e3b.png)
// =========================================================================

interface PlanReagentDetail {
  code: string;
  name: string;
  vendor: string;
  spec: string;
  unit: string;
  quantity: number;
  price: number;
  amount: number;
  remark?: string;
}

interface ProcurementPlanOrder {
  id: string;
  planNo: string;
  warehouse: string;
  creator: string;
  createTime: string;
  auditor: string;
  auditTime: string;
  status: '登记' | '审核';
  items: PlanReagentDetail[];
  notes?: string;
}

// 模拟初始采购计划单列表（匹配截图中的单号N0000004、N0000003、N0000002、N0000001并采用真实人名与近期2026年10月时间）
const INITIAL_PLAN_ORDERS: ProcurementPlanOrder[] = [
  {
    id: 'plan-004',
    planNo: 'N0000004',
    warehouse: '检验科总库',
    creator: '魏明主管检验师',
    createTime: '2026-10-30 09:10:10',
    auditor: '',
    auditTime: '',
    status: '登记',
    notes: '2026年10月下旬检验科通用辅助耗材与防护物资例行集中采购计划',
    items: [
      {
        code: '010012',
        name: '人字梯',
        vendor: '上海雷都医用器材有限公司',
        spec: '2米',
        unit: '架',
        quantity: 100,
        price: 200.0,
        amount: 20000.0,
        remark: '标本冷库高架取样防滑防静电脚手梯',
      },
      {
        code: '010012',
        name: '红色地垫',
        vendor: '江苏三泰洁净材料',
        spec: '1*1.5米',
        unit: '张',
        quantity: 10,
        price: 200.0,
        amount: 2000.0,
        remark: 'PCR扩增区及生化前处理洁净室入口警示防尘',
      },
    ],
  },
  {
    id: 'plan-003',
    planNo: 'N0000003',
    warehouse: '检验科总库',
    creator: '刘浩然技师',
    createTime: '2026-10-29 14:20:10',
    auditor: '',
    auditTime: '',
    status: '登记',
    notes: '生化流水线常规肝功能酶学配套试剂月度集中补库计划',
    items: [
      {
        code: '010028',
        name: '全自动生化分析仪清洗液',
        vendor: '罗氏诊断产品(上海)有限公司',
        spec: '5000ml/桶',
        unit: '桶',
        quantity: 20,
        price: 380.0,
        amount: 7600.0,
        remark: '用于Cobas c702反应杯酸性碱性探针深度冲洗',
      },
      {
        code: '010015',
        name: '丙氨酸氨基转移酶(ALT)测定试剂盒(IFCC法)',
        vendor: '深圳迈瑞生物医疗电子股份有限公司',
        spec: 'R1: 80mL×4, R2: 20mL×4',
        unit: '盒',
        quantity: 45,
        price: 520.0,
        amount: 23400.0,
        remark: '高通量肝功检测主力试剂',
      },
      {
        code: '010018',
        name: '天门冬氨酸氨基转移酶(AST)测定试剂盒',
        vendor: '深圳迈瑞生物医疗电子股份有限公司',
        spec: 'R1: 80mL×4, R2: 20mL×4',
        unit: '盒',
        quantity: 40,
        price: 540.0,
        amount: 21600.0,
        remark: '心肌酶谱与肝酶联检项目',
      },
    ],
  },
  {
    id: 'plan-002',
    planNo: 'N0000002',
    warehouse: '检验科总库',
    creator: '陈康主管检验师',
    createTime: '2026-10-28 10:10:10',
    auditor: '李晓红副主任技师',
    auditTime: '2026-10-28 14:30:00',
    status: '审核',
    notes: '全科月度质控品与校准品带量采购，已由科质控负责人复核确认',
    items: [
      {
        code: '010034',
        name: '生化多参数复合校准品',
        vendor: '贝克曼库尔特商贸(中国)有限公司',
        spec: '3ml×5支/套',
        unit: '套',
        quantity: 15,
        price: 880.0,
        amount: 13200.0,
        remark: '溯源至国际有证参考物质(CRM)',
      },
      {
        code: '010035',
        name: '生化多参数质控血清(水平1/2)',
        vendor: '伯乐生物医学制品(上海)有限公司',
        spec: '5ml×6支/盒',
        unit: '盒',
        quantity: 30,
        price: 320.0,
        amount: 9600.0,
        remark: '日常室内质控(IQC)用',
      },
      {
        code: '010042',
        name: '一次性真空采血管(促凝胶黄头)',
        vendor: '阳普医疗科技股份有限公司',
        spec: '100支/盒',
        unit: '盒',
        quantity: 120,
        price: 45.0,
        amount: 5400.0,
        remark: '门诊生化免疫采血窗口',
      },
    ],
  },
  {
    id: 'plan-001',
    planNo: 'N0000001',
    warehouse: '检验科总库',
    creator: '李晓红副主任技师',
    createTime: '2026-10-27 10:10:10',
    auditor: '郭彩霞主任医师',
    auditTime: '2026-10-27 15:45:00',
    status: '审核',
    notes: '临检流水线全血细胞分析试剂批次采购，设备科已备案',
    items: [
      {
        code: '010008',
        name: '全自动血细胞分析仪溶血剂(LH Lyse)',
        vendor: '希森美康医用电子(上海)有限公司',
        spec: '5L/桶',
        unit: '桶',
        quantity: 12,
        price: 620.0,
        amount: 7440.0,
        remark: 'XN-9000全自动血液流水线配套专用',
      },
      {
        code: '010009',
        name: '血细胞分析仪配套稀释液(Cellpack DCL)',
        vendor: '希森美康医用电子(上海)有限公司',
        spec: '20L/箱',
        unit: '箱',
        quantity: 25,
        price: 210.0,
        amount: 5250.0,
        remark: '五分类血常规细胞计数用',
      },
      {
        code: '010010',
        name: '白细胞分类荧光染色液(Fluorocell WDF)',
        vendor: '希森美康医用电子(上海)有限公司',
        spec: '100ml×2/套',
        unit: '套',
        quantity: 8,
        price: 1150.0,
        amount: 9200.0,
        remark: '中性粒/淋巴/单核细胞特异核酸荧光染色',
      },
    ],
  },
  {
    id: 'plan-005',
    planNo: 'N0000005',
    warehouse: '生化库',
    creator: '魏明主管检验师',
    createTime: '2026-10-30 11:15:00',
    auditor: '',
    auditTime: '',
    status: '登记',
    notes: '急诊肾功电解质应急储备耗材周采购单',
    items: [
      {
        code: '010050',
        name: '葡萄糖测定试剂盒(己糖激酶法/HK)',
        vendor: '罗氏诊断产品(上海)有限公司',
        spec: '200ml/盒',
        unit: '盒',
        quantity: 40,
        price: 260.0,
        amount: 10400.0,
        remark: '急诊急查生化通道',
      },
      {
        code: '010052',
        name: '肌酐测定试剂盒(肌氨酸氧化酶法)',
        vendor: '罗氏诊断产品(上海)有限公司',
        spec: '250ml/盒',
        unit: '盒',
        quantity: 35,
        price: 480.0,
        amount: 16800.0,
        remark: '内生肌酐清除率及肾功能评估',
      },
    ],
  },
];

// 待引入的采购需求单（对应右上角“采购需求①”角标，提供一键生成采购计划功能）
const PENDING_DEMAND_SOURCE = {
  demandNo: 'REQ-202610-008',
  sourceDept: '临床生化检验室',
  applicant: '刘浩然技师',
  applyTime: '2026-10-30 08:30:15',
  auditor: '李晓红副主任技师',
  auditTime: '2026-10-30 09:00:20',
  reason: '生化室常规代谢谱试剂消耗过快，安全库存已低于临界阈值，特申请紧急汇总列入本期采购计划',
  items: [
    {
      code: '010055',
      name: '尿素测定试剂盒(谷氨酸脱氢酶法)',
      vendor: '罗氏诊断产品(上海)有限公司',
      spec: '4×80ml/盒',
      unit: '盒',
      quantity: 30,
      price: 210.0,
      amount: 6300.0,
      remark: '急需补充生化常规用量',
    },
    {
      code: '010058',
      name: '总胆固醇测定试剂盒(COD-PAP法)',
      vendor: '深圳迈瑞生物医疗电子股份有限公司',
      spec: '4×70ml/盒',
      unit: '盒',
      quantity: 25,
      price: 195.0,
      amount: 4875.0,
      remark: '血脂四项常规检测',
    },
    {
      code: '010060',
      name: '甘油三酯测定试剂盒(GPO-PAP法)',
      vendor: '深圳迈瑞生物医疗电子股份有限公司',
      spec: '4×70ml/盒',
      unit: '盒',
      quantity: 25,
      price: 220.0,
      amount: 5500.0,
      remark: '血脂四项常规检测',
    },
  ],
};

const ProcurementPlanSubView: React.FC<{ hospitalUnit: string; showNotice: (m: string) => void }> = ({
  hospitalUnit,
  showNotice,
}) => {
  // 计划单数据列表
  const [planOrders, setPlanOrders] = useState<ProcurementPlanOrder[]>(INITIAL_PLAN_ORDERS);

  // 当前选中左侧的计划单号（驱动右侧明细联动）
  const [selectedPlanNo, setSelectedPlanNo] = useState<string>('N0000004');

  // 待处理采购需求待办角标计数（右上角采购需求①）
  const [pendingDemandCount, setPendingDemandCount] = useState<number>(1);

  // 顶部筛选条件（匹配截图：当前库房、编制日期、状态）
  const [filterWarehouse, setFilterWarehouse] = useState<string>('生化库');
  const [filterDateRange, setFilterDateRange] = useState<string>('2026-10-01 ~ 2026-10-31');
  const [filterStatus, setFilterStatus] = useState<string>('全部');

  // 模态弹窗状态
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isDemandModalOpen, setIsDemandModalOpen] = useState<boolean>(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);

  // 新增计划表单
  const [newPlanForm, setNewPlanForm] = useState<{
    warehouse: string;
    creator: string;
    notes: string;
    selectedReagents: Array<{
      code: string;
      name: string;
      vendor: string;
      spec: string;
      unit: string;
      quantity: number;
      price: number;
    }>;
  }>({
    warehouse: '生化库',
    creator: '魏明主管检验师',
    notes: '2026年10月下旬检验常规耗材采购储备',
    selectedReagents: [
      {
        code: '010070',
        name: '乙肝表面抗原(HBsAg)化学发光测定试剂盒',
        vendor: '罗氏诊断产品(上海)有限公司',
        spec: '100人份/盒',
        unit: '盒',
        quantity: 20,
        price: 680.0,
      },
      {
        code: '010072',
        name: '丙型肝炎抗体(Anti-HCV)测定试剂盒',
        vendor: '深圳迈瑞生物医疗电子股份有限公司',
        spec: '100人份/盒',
        unit: '盒',
        quantity: 15,
        price: 720.0,
      },
    ],
  });

  // 编辑计划表单
  const [editOrderData, setEditOrderData] = useState<ProcurementPlanOrder | null>(null);

  // 过滤后的计划单列表
  const filteredPlanOrders = useMemo(() => {
    return planOrders.filter((order) => {
      // 库房过滤（如果选全部或精确匹配）
      if (filterWarehouse && filterWarehouse !== '全部' && filterWarehouse !== '全部库房') {
        if (order.warehouse !== filterWarehouse) return false;
      }
      // 状态过滤
      if (filterStatus && filterStatus !== '全部') {
        if (order.status !== filterStatus) return false;
      }
      return true;
    });
  }, [planOrders, filterWarehouse, filterStatus]);

  // 当前选中的计划单对象
  const currentPlan = useMemo(() => {
    const found = planOrders.find((p) => p.planNo === selectedPlanNo);
    return found || planOrders[0] || null;
  }, [planOrders, selectedPlanNo]);

  // 当前选中计划的试剂明细
  const currentDetailItems = useMemo(() => {
    return currentPlan ? currentPlan.items : [];
  }, [currentPlan]);

  // 当前明细汇总金额与数量
  const currentTotalAmount = useMemo(() => {
    return currentDetailItems.reduce((acc, item) => acc + (item.amount || item.quantity * item.price), 0);
  }, [currentDetailItems]);

  // 1. 审核功能
  const handleOpenAudit = () => {
    if (!currentPlan) return;
    if (currentPlan.status === '审核') {
      showNotice(`计划单【${currentPlan.planNo}】已完成审核，无需重复审核`);
      return;
    }
    setIsAuditModalOpen(true);
  };

  const handleConfirmAudit = () => {
    if (!currentPlan) return;
    const nowStr = '2026-10-30 11:42:18';
    const auditorName = '郭彩霞主任医师';

    setPlanOrders((prev) =>
      prev.map((order) =>
        order.planNo === currentPlan.planNo
          ? {
              ...order,
              status: '审核',
              auditor: auditorName,
              auditTime: nowStr,
            }
          : order
      )
    );

    setIsAuditModalOpen(false);
    showNotice(`计划单【${currentPlan.planNo}】已由 ${auditorName} 成功审核通过！`);
  };

  // 2. 撤销审核功能
  const handleRevokeAudit = (planNo: string) => {
    setPlanOrders((prev) =>
      prev.map((order) =>
        order.planNo === planNo
          ? {
              ...order,
              status: '登记',
              auditor: '',
              auditTime: '',
            }
          : order
      )
    );
    showNotice(`已撤销计划单【${planNo}】的审核状态，单据已重新退回至【登记】`);
  };

  // 3. 删除计划单
  const handleDeletePlan = (planNo: string) => {
    const target = planOrders.find((p) => p.planNo === planNo);
    if (!target) return;
    if (target.status === '审核') {
      showNotice(`计划单【${planNo}】已审核，不可直接删除！请先撤销审核。`);
      return;
    }

    const updated = planOrders.filter((p) => p.planNo !== planNo);
    setPlanOrders(updated);
    if (selectedPlanNo === planNo && updated.length > 0) {
      setSelectedPlanNo(updated[0].planNo);
    }
    showNotice(`已删除未审核的采购计划单【${planNo}】`);
  };

  // 4. 打开编辑
  const handleOpenEdit = (order: ProcurementPlanOrder) => {
    if (order.status === '审核') {
      showNotice(`计划单【${order.planNo}】已处于审核状态，请先撤销审核后再修改。`);
      return;
    }
    setEditOrderData(JSON.parse(JSON.stringify(order)));
    setIsEditModalOpen(true);
  };

  // 保存编辑
  const handleSaveEdit = () => {
    if (!editOrderData) return;
    setPlanOrders((prev) =>
      prev.map((order) => (order.planNo === editOrderData.planNo ? editOrderData : order))
    );
    setIsEditModalOpen(false);
    showNotice(`计划单【${editOrderData.planNo}】修改已成功保存`);
  };

  // 5. 保存新建采购计划
  const handleCreatePlan = () => {
    if (!newPlanForm.warehouse) {
      showNotice('请选择采购库房');
      return;
    }
    if (newPlanForm.selectedReagents.length === 0) {
      showNotice('请至少添加一种采购试剂耗材');
      return;
    }

    // 生成新计划单号 (例如 N0000006)
    const nextNum = planOrders.length + 5;
    const newPlanNo = `N000000${nextNum}`;
    const newItems: PlanReagentDetail[] = newPlanForm.selectedReagents.map((r) => ({
      code: r.code,
      name: r.name,
      vendor: r.vendor,
      spec: r.spec,
      unit: r.unit,
      quantity: r.quantity,
      price: r.price,
      amount: r.quantity * r.price,
      remark: '科室日常常规消耗采购储备',
    }));

    const newOrder: ProcurementPlanOrder = {
      id: `plan-00${nextNum}`,
      planNo: newPlanNo,
      warehouse: newPlanForm.warehouse,
      creator: newPlanForm.creator || '魏明主管检验师',
      createTime: '2026-10-30 11:45:00',
      auditor: '',
      auditTime: '',
      status: '登记',
      items: newItems,
      notes: newPlanForm.notes || '检验科常规耗材采购',
    };

    setPlanOrders([newOrder, ...planOrders]);
    setSelectedPlanNo(newPlanNo);
    setIsAddModalOpen(false);
    showNotice(`成功创建新采购计划单【${newPlanNo}】，已录入 ${newItems.length} 项试剂`);
  };

  // 6. 从采购需求引入生成采购计划（对应右上角“采购需求①”）
  const handleImportDemandToPlan = () => {
    const nextNum = planOrders.length + 6;
    const newPlanNo = `N000000${nextNum}`;

    const importedItems: PlanReagentDetail[] = PENDING_DEMAND_SOURCE.items.map((it) => ({
      ...it,
    }));

    const newPlan: ProcurementPlanOrder = {
      id: `plan-00${nextNum}`,
      planNo: newPlanNo,
      warehouse: '生化库',
      creator: '魏明主管检验师',
      createTime: '2026-10-30 11:48:30',
      auditor: '',
      auditTime: '',
      status: '登记',
      notes: `由【${PENDING_DEMAND_SOURCE.demandNo} - ${PENDING_DEMAND_SOURCE.sourceDept}】已审核的采购需求自动汇总生成`,
      items: importedItems,
    };

    setPlanOrders([newPlan, ...planOrders]);
    setSelectedPlanNo(newPlanNo);
    setPendingDemandCount(0);
    setIsDemandModalOpen(false);
    showNotice(`已成功将采购需求【${PENDING_DEMAND_SOURCE.demandNo}】合并生成采购计划单【${newPlanNo}】！待办数量已更新。`);
  };

  // 数字转中文大写金额函数（用于专业采购报批单打印）
  const convertToChineseCurrency = (num: number): string => {
    if (isNaN(num) || num < 0) return '零元整';
    const digits = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
    const units = ['', '拾', '佰', '仟', '万', '拾', '佰', '仟', '亿'];
    const n = Math.round(num * 100);
    if (n === 0) return '零元整';

    const intPart = Math.floor(n / 100);
    const decimalPart = n % 100;
    let result = '';

    // 整数部分
    if (intPart > 0) {
      const intStr = intPart.toString();
      const len = intStr.length;
      for (let i = 0; i < len; i++) {
        const d = parseInt(intStr[i]);
        const pos = len - 1 - i;
        if (d !== 0) {
          result += digits[d] + units[pos];
        } else {
          if (!result.endsWith('零') && pos !== 4 && pos !== 8) {
            result += '零';
          }
        }
      }
      result += '元';
    }

    // 小数部分
    const jiao = Math.floor(decimalPart / 10);
    const fen = decimalPart % 10;
    if (jiao === 0 && fen === 0) {
      result += '整';
    } else {
      if (jiao > 0) result += digits[jiao] + '角';
      if (fen > 0) result += digits[fen] + '分';
    }
    return result;
  };

  return (
    <div className="bg-slate-50 flex-1 flex flex-col overflow-hidden text-slate-800">
      {/* 顶部主标题与操作按钮栏 (严格对应截图：采购计划管理、新增、采购需求①、审核、打印) */}
      <div className="bg-white px-4 py-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-6 bg-blue-600 rounded-sm"></div>
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              采购计划管理
              <span className="text-xs font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                {hospitalUnit || '中心医院'} · 耗材供应链
              </span>
            </h2>
          </div>
        </div>

        {/* 顶部四个操作按钮（与截图 image_79879e3b.png 右上角按钮一致） */}
        <div className="flex items-center gap-2">
          {/* 新增按钮 */}
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>新增</span>
          </button>

          {/* 采购需求① 按钮（带角标提示待办引入） */}
          <button
            type="button"
            onClick={() => setIsDemandModalOpen(true)}
            className="px-3.5 py-1.5 bg-white border border-blue-400 hover:bg-blue-50 text-blue-700 rounded text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors group relative"
            title="查看待汇总结转为采购计划的科室需求单"
          >
            <span>采购需求</span>
            {pendingDemandCount > 0 ? (
              <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold">
                {pendingDemandCount}
              </span>
            ) : (
              <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-slate-200 text-slate-600 text-[10px]">
                0
              </span>
            )}
          </button>

          {/* 审核按钮 */}
          <button
            type="button"
            onClick={handleOpenAudit}
            className="px-3.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <FileCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>审核</span>
          </button>

          {/* 打印按钮 */}
          <button
            type="button"
            onClick={() => setIsPrintModalOpen(true)}
            className="px-3.5 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span>打印</span>
          </button>
        </div>
      </div>

      {/* 筛选过滤工具栏 (匹配截图：当前库房、编制日期、状态、查询) */}
      <div className="bg-white px-4 py-2.5 border-b border-slate-200 flex flex-wrap items-center gap-4 text-xs shadow-2xs">
        {/* 当前库房下拉 */}
        <div className="flex items-center gap-2">
          <label className="text-slate-600 whitespace-nowrap font-medium">当前库房：</label>
          <div className="relative">
            <select
              value={filterWarehouse}
              onChange={(e) => setFilterWarehouse(e.target.value)}
              className="bg-white border border-slate-300 rounded px-3 py-1.5 pr-7 text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="生化库">生化库</option>
              <option value="检验科总库">检验科总库</option>
              <option value="临检库">临检库</option>
              <option value="微生物库">微生物库</option>
              <option value="全部库房">全部库房</option>
            </select>
          </div>
        </div>

        {/* 编制日期区间 */}
        <div className="flex items-center gap-2">
          <label className="text-slate-600 whitespace-nowrap font-medium">编制日期：</label>
          <div className="relative flex items-center">
            <input
              type="text"
              value={filterDateRange}
              onChange={(e) => setFilterDateRange(e.target.value)}
              placeholder="YYYY-MM-DD ~ YYYY-MM-DD"
              className="w-48 bg-white border border-slate-300 rounded px-3 py-1.5 pr-7 text-xs font-mono text-slate-800 focus:outline-none focus:border-blue-500"
            />
            <CalendarCheck className="w-3.5 h-3.5 text-slate-400 absolute right-2 pointer-events-none" />
          </div>
        </div>

        {/* 状态下拉 */}
        <div className="flex items-center gap-2">
          <label className="text-slate-600 whitespace-nowrap font-medium">状态：</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-24 bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
          >
            <option value="全部">全部</option>
            <option value="登记">登记</option>
            <option value="审核">审核</option>
          </select>
        </div>

        {/* 查询按钮 */}
        <button
          type="button"
          onClick={() => {
            showNotice(`已按【${filterWarehouse} | ${filterStatus}】执行采购计划查询筛选`);
          }}
          className="px-4 py-1.5 bg-white border border-blue-500 text-blue-600 hover:bg-blue-50 rounded text-xs font-semibold shadow-xs transition-colors flex items-center gap-1"
        >
          <Search className="w-3 h-3" />
          <span>查询</span>
        </button>

        {/* 重置筛选 */}
        {(filterWarehouse !== '全部库房' || filterStatus !== '全部') && (
          <button
            type="button"
            onClick={() => {
              setFilterWarehouse('全部库房');
              setFilterStatus('全部');
              showNotice('已重置所有筛选条件');
            }}
            className="text-xs text-slate-500 hover:text-slate-700 underline"
          >
            重置筛选
          </button>
        )}
      </div>

      {/* 主体双表格联动区域 (左：采购计划单列表，右：计划试剂明细) */}
      <div className="flex-1 flex overflow-hidden p-3 gap-3">
        {/* ===================== 左侧：采购计划单列表 ===================== */}
        <div className="w-[54%] bg-white rounded-lg border border-slate-200 flex flex-col shadow-2xs overflow-hidden">
          {/* 左侧表格表头标题 */}
          <div className="px-3.5 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs text-slate-800">采购计划单列表</span>
              <span className="text-[11px] text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200 font-mono">
                点击单据联动右侧明细
              </span>
            </div>
            <div className="text-[11px] text-slate-500 font-mono">
              显示 {filteredPlanOrders.length} 条记录
            </div>
          </div>

          {/* 左侧主表格 */}
          <div className="flex-1 overflow-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="sticky top-0 z-10 bg-slate-100/90 backdrop-blur-xs text-slate-700 font-semibold border-b border-slate-200 select-none">
                <tr>
                  <th className="py-2.5 px-2.5 whitespace-nowrap">计划单号</th>
                  <th className="py-2.5 px-2.5 whitespace-nowrap">采购库房</th>
                  <th className="py-2.5 px-2.5 whitespace-nowrap">填制人</th>
                  <th className="py-2.5 px-2.5 whitespace-nowrap">填制时间</th>
                  <th className="py-2.5 px-2.5 whitespace-nowrap">审核人</th>
                  <th className="py-2.5 px-2.5 whitespace-nowrap">审核时间</th>
                  <th className="py-2.5 px-2 text-center whitespace-nowrap">状态</th>
                  <th className="py-2.5 px-2.5 text-center whitespace-nowrap min-w-[70px]">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredPlanOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      <Archive className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                      <div>暂无符合筛选条件的采购计划单</div>
                    </td>
                  </tr>
                ) : (
                  filteredPlanOrders.map((order) => {
                    const isSelected = order.planNo === selectedPlanNo;
                    return (
                      <tr
                        key={order.planNo}
                        onClick={() => setSelectedPlanNo(order.planNo)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-blue-50/90 font-medium text-slate-900 ring-1 ring-inset ring-blue-300'
                            : 'hover:bg-slate-50/80 text-slate-700'
                        }`}
                      >
                        {/* 计划单号 */}
                        <td className="py-2.5 px-2.5 whitespace-nowrap font-mono font-bold text-blue-700">
                          {order.planNo}
                        </td>

                        {/* 采购库房 */}
                        <td className="py-2.5 px-2.5 whitespace-nowrap text-slate-800">
                          {order.warehouse}
                        </td>

                        {/* 填制人 (真实人名) */}
                        <td className="py-2.5 px-2.5 whitespace-nowrap text-slate-800">
                          {order.creator}
                        </td>

                        {/* 填制时间 (近期2026-10时间) */}
                        <td className="py-2.5 px-2.5 whitespace-nowrap text-[11px] font-mono text-slate-600">
                          {order.createTime}
                        </td>

                        {/* 审核人 */}
                        <td className="py-2.5 px-2.5 whitespace-nowrap text-slate-700">
                          {order.auditor || '-'}
                        </td>

                        {/* 审核时间 */}
                        <td className="py-2.5 px-2.5 whitespace-nowrap text-[11px] font-mono text-slate-500">
                          {order.auditTime || '-'}
                        </td>

                        {/* 状态徽标 (匹配截图：登记、审核) */}
                        <td className="py-2.5 px-2 text-center whitespace-nowrap">
                          {order.status === '审核' ? (
                            <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-700 border border-blue-200">
                              审核
                            </span>
                          ) : (
                            <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                              登记
                            </span>
                          )}
                        </td>

                        {/* 操作栏 (匹配截图：登记对应编辑/删除，审核对应撤销/查看) */}
                        <td
                          className="py-2.5 px-2.5 text-center whitespace-nowrap"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {order.status === '登记' ? (
                            <div className="flex items-center justify-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleOpenEdit(order)}
                                className="text-blue-600 hover:text-blue-800 hover:underline font-medium text-xs"
                              >
                                编辑
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeletePlan(order.planNo)}
                                className="text-rose-600 hover:text-rose-800 hover:underline font-medium text-xs"
                              >
                                删除
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleRevokeAudit(order.planNo)}
                                className="text-amber-600 hover:text-amber-800 hover:underline font-medium text-xs"
                                title="撤销审核回退至登记状态"
                              >
                                撤销
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedPlanNo(order.planNo);
                                  setIsViewModalOpen(true);
                                }}
                                className="text-blue-600 hover:text-blue-800 hover:underline font-medium text-xs"
                              >
                                查看
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* 左侧底部统计栏 (严格匹配截图：合计：X条) */}
          <div className="px-3.5 py-2 bg-slate-50 border-t border-slate-200 text-xs font-bold text-blue-700 flex items-center justify-between">
            <span>合计：{filteredPlanOrders.length} 条</span>
            <span className="text-[11px] font-normal text-slate-500">
              当前选中单据：{selectedPlanNo}
            </span>
          </div>
        </div>

        {/* ===================== 右侧：计划试剂明细 ===================== */}
        <div className="w-[46%] bg-white rounded-lg border border-slate-200 flex flex-col shadow-2xs overflow-hidden">
          {/* 右侧表头栏 */}
          <div className="px-3.5 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs text-slate-800">试剂明细列表</span>
              {currentPlan && (
                <span className="text-[11px] px-2 py-0.5 rounded font-mono bg-blue-50 text-blue-800 border border-blue-200">
                  {currentPlan.planNo} · {currentPlan.warehouse}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-500 font-mono">
                {currentDetailItems.length} 种试剂
              </span>
              <button
                type="button"
                onClick={() => {
                  showNotice(`已导出【${currentPlan?.planNo || ''}】试剂采购清单Excel明细`);
                }}
                className="text-xs text-blue-600 hover:underline flex items-center gap-0.5"
              >
                <Download className="w-3 h-3" />
                <span>导出</span>
              </button>
            </div>
          </div>

          {/* 右侧表格 (严格匹配截图表头：试剂编码、试剂名称、生产商、规格、单位、数量、单价、金额) */}
          <div className="flex-1 overflow-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="sticky top-0 z-10 bg-slate-100/90 backdrop-blur-xs text-slate-700 font-semibold border-b border-slate-200 select-none">
                <tr>
                  <th className="py-2.5 px-2.5 whitespace-nowrap">试剂编码</th>
                  <th className="py-2.5 px-2.5 min-w-[90px]">试剂名称</th>
                  <th className="py-2.5 px-2.5 min-w-[120px]">生产商</th>
                  <th className="py-2.5 px-2.5 min-w-[70px]">规格</th>
                  <th className="py-2.5 px-2 text-center whitespace-nowrap">单位</th>
                  <th className="py-2.5 px-2.5 text-right whitespace-nowrap font-bold">数量</th>
                  <th className="py-2.5 px-2.5 text-right whitespace-nowrap">单价</th>
                  <th className="py-2.5 px-2.5 text-right whitespace-nowrap font-bold text-slate-800">
                    金额
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {currentDetailItems.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      <Archive className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                      <div>该计划单暂无关联采购试剂</div>
                    </td>
                  </tr>
                ) : (
                  currentDetailItems.map((item, idx) => (
                    <tr
                      key={item.code + idx}
                      className="hover:bg-blue-50/40 transition-colors"
                    >
                      {/* 试剂编码 */}
                      <td className="py-2.5 px-2.5 font-mono font-bold text-slate-900 whitespace-nowrap">
                        {item.code}
                      </td>

                      {/* 试剂名称 */}
                      <td className="py-2.5 px-2.5 font-medium text-slate-900">
                        {item.name}
                      </td>

                      {/* 生产商 */}
                      <td className="py-2.5 px-2.5 text-slate-600 text-xs">
                        {item.vendor || '-'}
                      </td>

                      {/* 规格 */}
                      <td className="py-2.5 px-2.5 text-slate-700 whitespace-nowrap font-mono text-[11px]">
                        {item.spec}
                      </td>

                      {/* 单位 */}
                      <td className="py-2.5 px-2 text-center text-slate-700 whitespace-nowrap">
                        {item.unit}
                      </td>

                      {/* 数量 */}
                      <td className="py-2.5 px-2.5 text-right font-mono font-bold text-blue-700 whitespace-nowrap">
                        {item.quantity}
                      </td>

                      {/* 单价 */}
                      <td className="py-2.5 px-2.5 text-right font-mono text-slate-600 whitespace-nowrap">
                        {item.price.toFixed(2)}
                      </td>

                      {/* 金额 */}
                      <td className="py-2.5 px-2.5 text-right font-mono font-bold text-slate-900 whitespace-nowrap">
                        {(item.amount || item.quantity * item.price).toFixed(2)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* 右侧底部统计栏 (严格匹配截图：合计：2条，并展示计划总金额) */}
          <div className="px-3.5 py-2 bg-slate-50 border-t border-slate-200 text-xs font-bold text-blue-700 flex items-center justify-between">
            <span>合计：{currentDetailItems.length} 条</span>
            <span className="text-slate-800 font-mono">
              总计划金额：<span className="text-emerald-700 font-bold">￥{currentTotalAmount.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}</span>
            </span>
          </div>
        </div>
      </div>

      {/* ===================== 弹窗 1：新增采购计划单 ===================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-600" />
                <span>新建耗材采购计划单</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">采购库房 *</label>
                  <select
                    value={newPlanForm.warehouse}
                    onChange={(e) =>
                      setNewPlanForm({ ...newPlanForm, warehouse: e.target.value })
                    }
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-blue-500"
                  >
                    <option value="生化库">生化库</option>
                    <option value="检验科总库">检验科总库</option>
                    <option value="临检库">临检库</option>
                    <option value="微生物库">微生物库</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">编制填报人 *</label>
                  <input
                    type="text"
                    value={newPlanForm.creator}
                    onChange={(e) =>
                      setNewPlanForm({ ...newPlanForm, creator: e.target.value })
                    }
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">计划编制说明 / 采购批次备注</label>
                <textarea
                  rows={2}
                  value={newPlanForm.notes}
                  onChange={(e) =>
                    setNewPlanForm({ ...newPlanForm, notes: e.target.value })
                  }
                  className="w-full border border-slate-300 rounded p-2 text-xs focus:outline-none focus:border-blue-500"
                  placeholder="填写本次采购计划的原因、周期及预算要求..."
                />
              </div>

              {/* 预选拟采购耗材清单 */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-slate-700 font-semibold">拟采购试剂品项列表</label>
                  <span className="text-[11px] text-slate-500">
                    已选 {newPlanForm.selectedReagents.length} 项
                  </span>
                </div>
                <div className="border border-slate-200 rounded overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="py-1.5 px-2">试剂编码</th>
                        <th className="py-1.5 px-2">试剂名称</th>
                        <th className="py-1.5 px-2">规格</th>
                        <th className="py-1.5 px-2 text-center">单位</th>
                        <th className="py-1.5 px-2 text-right">计划数量</th>
                        <th className="py-1.5 px-2 text-right">预算单价</th>
                        <th className="py-1.5 px-2 text-right">小计(元)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {newPlanForm.selectedReagents.map((item, i) => (
                        <tr key={item.code + i}>
                          <td className="py-1.5 px-2 font-mono text-slate-700">{item.code}</td>
                          <td className="py-1.5 px-2 font-medium text-slate-800">{item.name}</td>
                          <td className="py-1.5 px-2 text-slate-600 font-mono text-[11px]">{item.spec}</td>
                          <td className="py-1.5 px-2 text-center text-slate-600">{item.unit}</td>
                          <td className="py-1.5 px-2 text-right font-mono font-bold text-blue-600">
                            {item.quantity}
                          </td>
                          <td className="py-1.5 px-2 text-right font-mono text-slate-600">
                            {item.price.toFixed(2)}
                          </td>
                          <td className="py-1.5 px-2 text-right font-mono font-bold text-slate-800">
                            {(item.quantity * item.price).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="text-right mt-1.5 text-xs text-slate-600">
                  预估计划总额：
                  <span className="font-bold text-emerald-700 font-mono text-sm">
                    ￥
                    {newPlanForm.selectedReagents
                      .reduce((acc, it) => acc + it.quantity * it.price, 0)
                      .toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 px-4 py-2.5 border-t border-slate-200 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-1.5 border border-slate-300 text-slate-700 rounded hover:bg-slate-100 font-medium text-xs"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleCreatePlan}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium text-xs shadow-xs"
              >
                确认创建采购计划
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== 弹窗 2：采购需求引入抽屉/弹窗 (采购需求①) ===================== */}
      {isDemandModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-gradient-to-r from-blue-700 to-indigo-700 px-4 py-3 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-500 text-white text-xs font-bold">
                  1
                </span>
                <h3 className="font-bold text-sm">待转计划的采购需求引入看板</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsDemandModalOpen(false)}
                className="text-white/80 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-3.5 max-h-[75vh] overflow-y-auto text-xs">
              {pendingDemandCount > 0 ? (
                <>
                  <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-blue-900 text-sm">
                          {PENDING_DEMAND_SOURCE.demandNo}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          科室已审核通过
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">
                        {PENDING_DEMAND_SOURCE.auditTime}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-slate-600 mb-2">
                      <div>申请部门：<span className="text-slate-900 font-semibold">{PENDING_DEMAND_SOURCE.sourceDept}</span></div>
                      <div>提报人：<span className="text-slate-900 font-semibold">{PENDING_DEMAND_SOURCE.applicant}</span></div>
                      <div>审核审批人：<span className="text-slate-900 font-semibold">{PENDING_DEMAND_SOURCE.auditor}</span></div>
                      <div>申请原由：<span className="text-slate-800">{PENDING_DEMAND_SOURCE.reason}</span></div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-800 mb-1.5 flex items-center justify-between">
                      <span>该需求包含以下拟采购项目（共 {PENDING_DEMAND_SOURCE.items.length} 项）</span>
                      <span className="text-emerald-700 font-mono font-bold">
                        预算合计：￥
                        {PENDING_DEMAND_SOURCE.items
                          .reduce((acc, it) => acc + it.amount, 0)
                          .toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
                      </span>
                    </h4>
                    <div className="border border-slate-200 rounded overflow-hidden">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                          <tr>
                            <th className="py-2 px-2.5">试剂编码</th>
                            <th className="py-2 px-2.5">试剂名称</th>
                            <th className="py-2 px-2.5">规格</th>
                            <th className="py-2 px-2 text-center">单位</th>
                            <th className="py-2 px-2.5 text-right">需求数量</th>
                            <th className="py-2 px-2.5 text-right">参考单价</th>
                            <th className="py-2 px-2.5 text-right">小计金额</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {PENDING_DEMAND_SOURCE.items.map((item) => (
                            <tr key={item.code}>
                              <td className="py-2 px-2.5 font-mono font-bold text-slate-800">{item.code}</td>
                              <td className="py-2 px-2.5 font-medium text-slate-900">{item.name}</td>
                              <td className="py-2 px-2.5 text-slate-600 font-mono text-[11px]">{item.spec}</td>
                              <td className="py-2 px-2 text-center text-slate-600">{item.unit}</td>
                              <td className="py-2 px-2.5 text-right font-mono font-bold text-blue-700">{item.quantity}</td>
                              <td className="py-2 px-2.5 text-right font-mono text-slate-600">￥{item.price.toFixed(2)}</td>
                              <td className="py-2 px-2.5 text-right font-mono font-bold text-slate-900">￥{item.amount.toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              ) : (
                <div className="py-12 text-center text-slate-400">
                  <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-500 mb-2" />
                  <div className="font-semibold text-slate-700">暂无待合并结转的科室采购需求</div>
                  <p className="text-slate-400 text-xs mt-1">所有临床需求均已生成正式采购计划单</p>
                </div>
              )}
            </div>

            <div className="bg-slate-50 px-4 py-2.5 border-t border-slate-200 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsDemandModalOpen(false)}
                className="px-4 py-1.5 border border-slate-300 text-slate-700 rounded hover:bg-slate-100 font-medium text-xs"
              >
                关闭
              </button>
              {pendingDemandCount > 0 && (
                <button
                  type="button"
                  onClick={handleImportDemandToPlan}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium text-xs shadow-xs flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>一键引入并生成正式采购计划单</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===================== 弹窗 3：审核确认弹窗 ===================== */}
      {isAuditModalOpen && currentPlan && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-blue-600" />
                <span>采购计划单审核复核</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsAuditModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-3 text-xs">
              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg text-amber-900">
                请确认当前采购计划单中各试剂品类、品牌规格、数量及预算金额符合科室当月带量招采指标。审核通过后将正式转入医学装备处采购执行阶段。
              </div>

              <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 border border-slate-200 rounded text-slate-700">
                <div>计划单号：<span className="font-mono font-bold text-blue-700">{currentPlan.planNo}</span></div>
                <div>采购库房：<span className="font-semibold text-slate-900">{currentPlan.warehouse}</span></div>
                <div>编制人员：<span className="font-semibold text-slate-900">{currentPlan.creator}</span></div>
                <div>编制时间：<span className="font-mono text-slate-600">{currentPlan.createTime}</span></div>
                <div>试剂品规：<span className="font-bold text-slate-900">{currentPlan.items.length} 种</span></div>
                <div>计划预算总额：<span className="font-mono font-bold text-emerald-700">￥{currentTotalAmount.toFixed(2)}</span></div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">审核人签字确认</label>
                <input
                  type="text"
                  readOnly
                  value="郭彩霞主任医师 (检验科负责人)"
                  className="w-full bg-slate-100 border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">审核意见</label>
                <textarea
                  rows={2}
                  defaultValue="经复核，品规资质与安全库存预警相符，同意按采购计划报批医学装备处统一招标执行。"
                  className="w-full border border-slate-300 rounded p-2 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="bg-slate-50 px-4 py-2.5 border-t border-slate-200 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAuditModalOpen(false)}
                className="px-4 py-1.5 border border-slate-300 text-slate-700 rounded hover:bg-slate-100 font-medium text-xs"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleConfirmAudit}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium text-xs shadow-xs"
              >
                确认审核通过
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== 弹窗 4：打印预览单 (符合临床真实规范) ===================== */}
      {isPrintModalOpen && currentPlan && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-300 w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Printer className="w-4 h-4 text-slate-700" />
                <span className="font-bold text-sm text-slate-800">打印预览 - 采购计划报批单</span>
              </div>
              <button
                type="button"
                onClick={() => setIsPrintModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 纸质预览区 */}
            <div className="p-8 overflow-y-auto flex-1 bg-slate-200/50 flex justify-center">
              <div className="bg-white w-full max-w-2xl p-6 shadow-md border border-slate-300 text-slate-900 text-xs">
                {/* 医院红头/标题 */}
                <div className="text-center border-b-2 border-slate-800 pb-3 mb-4">
                  <h1 className="text-lg font-bold tracking-wider">{hospitalUnit || '中心医院'}</h1>
                  <h2 className="text-base font-bold mt-1 tracking-widest text-slate-800">
                    检验医学科 医用耗材/试剂采购计划审批单
                  </h2>
                  <div className="flex justify-between items-center text-[11px] text-slate-500 mt-2 font-mono">
                    <span>计划单号: {currentPlan.planNo}</span>
                    <span>归属库房: {currentPlan.warehouse}</span>
                    <span>打印日期: 2026-10-30</span>
                  </div>
                </div>

                {/* 基本信息表格 */}
                <div className="grid grid-cols-2 gap-y-1.5 text-xs mb-3 text-slate-700">
                  <div>编制填报人：<span className="font-semibold text-slate-900">{currentPlan.creator}</span></div>
                  <div>编制时间：<span className="font-mono text-slate-900">{currentPlan.createTime}</span></div>
                  <div>审核责任人：<span className="font-semibold text-slate-900">{currentPlan.auditor || '待审核'}</span></div>
                  <div>审核时间：<span className="font-mono text-slate-900">{currentPlan.auditTime || '-'}</span></div>
                  <div className="col-span-2">单据批注：<span className="text-slate-800">{currentPlan.notes || '无'}</span></div>
                </div>

                {/* 采购明细表 */}
                <table className="w-full border-collapse border border-slate-400 text-xs text-left mb-3">
                  <thead>
                    <tr className="bg-slate-100 text-slate-800">
                      <th className="border border-slate-400 py-1.5 px-2 text-center w-10">序号</th>
                      <th className="border border-slate-400 py-1.5 px-2">试剂编码</th>
                      <th className="border border-slate-400 py-1.5 px-2">试剂名称</th>
                      <th className="border border-slate-400 py-1.5 px-2">规格型号</th>
                      <th className="border border-slate-400 py-1.5 px-2 text-center w-12">单位</th>
                      <th className="border border-slate-400 py-1.5 px-2 text-right w-14">数量</th>
                      <th className="border border-slate-400 py-1.5 px-2 text-right w-16">单价</th>
                      <th className="border border-slate-400 py-1.5 px-2 text-right w-20">金额(元)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentDetailItems.map((item, idx) => (
                      <tr key={idx}>
                        <td className="border border-slate-400 py-1.5 px-2 text-center font-mono">{idx + 1}</td>
                        <td className="border border-slate-400 py-1.5 px-2 font-mono">{item.code}</td>
                        <td className="border border-slate-400 py-1.5 px-2 font-medium">{item.name}</td>
                        <td className="border border-slate-400 py-1.5 px-2 font-mono text-[11px]">{item.spec}</td>
                        <td className="border border-slate-400 py-1.5 px-2 text-center">{item.unit}</td>
                        <td className="border border-slate-400 py-1.5 px-2 text-right font-mono font-bold">{item.quantity}</td>
                        <td className="border border-slate-400 py-1.5 px-2 text-right font-mono">{item.price.toFixed(2)}</td>
                        <td className="border border-slate-400 py-1.5 px-2 text-right font-mono font-bold">
                          {(item.amount || item.quantity * item.price).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                    {/* 合计行 */}
                    <tr className="bg-slate-50 font-bold">
                      <td colSpan={5} className="border border-slate-400 py-2 px-2 text-left">
                        合计人民币（大写）：{convertToChineseCurrency(currentTotalAmount)}
                      </td>
                      <td colSpan={3} className="border border-slate-400 py-2 px-2 text-right font-mono text-sm text-slate-900">
                        小计：￥{currentTotalAmount.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* 审批签字栏 */}
                <div className="grid grid-cols-4 gap-4 pt-6 text-[11px] text-slate-700">
                  <div>
                    <div className="border-b border-slate-400 pb-1 mb-1">编制人签名：</div>
                    <div className="font-semibold">{currentPlan.creator}</div>
                  </div>
                  <div>
                    <div className="border-b border-slate-400 pb-1 mb-1">质量负责人：</div>
                    <div className="font-semibold">{currentPlan.auditor || '李晓红副主任技师'}</div>
                  </div>
                  <div>
                    <div className="border-b border-slate-400 pb-1 mb-1">检验科主任：</div>
                    <div className="font-semibold">郭彩霞主任医师</div>
                  </div>
                  <div>
                    <div className="border-b border-slate-400 pb-1 mb-1">装备处/采购科：</div>
                    <div className="text-slate-400">（盖章签署）</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-100 px-4 py-2.5 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-mono">
                建议打印规格: A4纸 横向/纵向均可
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsPrintModalOpen(false)}
                  className="px-4 py-1.5 border border-slate-300 text-slate-700 rounded hover:bg-slate-200 font-medium text-xs"
                >
                  关闭
                </button>
                <button
                  type="button"
                  onClick={() => {
                    showNotice(`已发送采购计划单【${currentPlan.planNo}】至检验科科室网络激光打印机`);
                    setIsPrintModalOpen(false);
                  }}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium text-xs shadow-xs flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>立即打印</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================== 弹窗 5：编辑计划单 ===================== */}
      {isEditModalOpen && editOrderData && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl border border-slate-200 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <Edit className="w-4 h-4 text-blue-600" />
                <span>编辑采购计划单 - {editOrderData.planNo}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">采购库房</label>
                  <select
                    value={editOrderData.warehouse}
                    onChange={(e) =>
                      setEditOrderData({ ...editOrderData, warehouse: e.target.value })
                    }
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-blue-500"
                  >
                    <option value="生化库">生化库</option>
                    <option value="检验科总库">检验科总库</option>
                    <option value="临检库">临检库</option>
                    <option value="微生物库">微生物库</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">编制填报人</label>
                  <input
                    type="text"
                    value={editOrderData.creator}
                    onChange={(e) =>
                      setEditOrderData({ ...editOrderData, creator: e.target.value })
                    }
                    className="w-full border border-slate-300 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">采购批次说明</label>
                <textarea
                  rows={2}
                  value={editOrderData.notes || ''}
                  onChange={(e) =>
                    setEditOrderData({ ...editOrderData, notes: e.target.value })
                  }
                  className="w-full border border-slate-300 rounded p-2 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1.5">调整试剂数量与单价</label>
                <div className="border border-slate-200 rounded max-h-48 overflow-y-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 sticky top-0">
                      <tr>
                        <th className="py-1.5 px-2">试剂名称</th>
                        <th className="py-1.5 px-2 text-center">单位</th>
                        <th className="py-1.5 px-2 text-right w-24">计划数量</th>
                        <th className="py-1.5 px-2 text-right w-24">单价(元)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {editOrderData.items.map((it, idx) => (
                        <tr key={it.code + idx}>
                          <td className="py-1.5 px-2 font-medium">{it.name}</td>
                          <td className="py-1.5 px-2 text-center text-slate-500">{it.unit}</td>
                          <td className="py-1.5 px-2 text-right">
                            <input
                              type="number"
                              min={1}
                              value={it.quantity}
                              onChange={(e) => {
                                const val = parseInt(e.target.value) || 0;
                                const nextItems = [...editOrderData.items];
                                nextItems[idx] = {
                                  ...nextItems[idx],
                                  quantity: val,
                                  amount: val * nextItems[idx].price,
                                };
                                setEditOrderData({ ...editOrderData, items: nextItems });
                              }}
                              className="w-20 text-right border border-slate-300 rounded px-1.5 py-0.5 text-xs font-mono font-bold"
                            />
                          </td>
                          <td className="py-1.5 px-2 text-right">
                            <input
                              type="number"
                              step="0.01"
                              min={0}
                              value={it.price}
                              onChange={(e) => {
                                const val = parseFloat(e.target.value) || 0;
                                const nextItems = [...editOrderData.items];
                                nextItems[idx] = {
                                  ...nextItems[idx],
                                  price: val,
                                  amount: nextItems[idx].quantity * val,
                                };
                                setEditOrderData({ ...editOrderData, items: nextItems });
                              }}
                              className="w-20 text-right border border-slate-300 rounded px-1.5 py-0.5 text-xs font-mono"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 px-4 py-2.5 border-t border-slate-200 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-1.5 border border-slate-300 text-slate-700 rounded hover:bg-slate-100 font-medium text-xs"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium text-xs shadow-xs"
              >
                保存修改
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== 弹窗 6：查看计划单详情 ===================== */}
      {isViewModalOpen && currentPlan && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl border border-slate-200 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <Eye className="w-4 h-4 text-blue-600" />
                <span>采购计划单详情 - {currentPlan.planNo}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsViewModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 border border-slate-200 rounded text-slate-700">
                <div>计划单号：<span className="font-mono font-bold text-blue-700">{currentPlan.planNo}</span></div>
                <div>采购库房：<span className="font-semibold text-slate-900">{currentPlan.warehouse}</span></div>
                <div>编制填报人：<span className="font-semibold text-slate-900">{currentPlan.creator}</span></div>
                <div>编制时间：<span className="font-mono text-slate-600">{currentPlan.createTime}</span></div>
                <div>审核责任人：<span className="font-semibold text-slate-900">{currentPlan.auditor || '-'}</span></div>
                <div>审核时间：<span className="font-mono text-slate-600">{currentPlan.auditTime || '-'}</span></div>
                <div>单据状态：
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    currentPlan.status === '审核'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {currentPlan.status}
                  </span>
                </div>
                <div>总计金额：<span className="font-mono font-bold text-emerald-700">￥{currentTotalAmount.toFixed(2)}</span></div>
                <div className="col-span-2">备注说明：<span className="text-slate-800">{currentPlan.notes || '无'}</span></div>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 mb-1.5">包含试剂明细 ({currentDetailItems.length}项)</h4>
                <div className="border border-slate-200 rounded max-h-52 overflow-y-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 sticky top-0">
                      <tr>
                        <th className="py-1.5 px-2">试剂编码</th>
                        <th className="py-1.5 px-2">试剂名称</th>
                        <th className="py-1.5 px-2">规格</th>
                        <th className="py-1.5 px-2 text-center">单位</th>
                        <th className="py-1.5 px-2 text-right">计划数量</th>
                        <th className="py-1.5 px-2 text-right">单价</th>
                        <th className="py-1.5 px-2 text-right">小计(元)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {currentDetailItems.map((it, idx) => (
                        <tr key={it.code + idx}>
                          <td className="py-1.5 px-2 font-mono text-slate-700">{it.code}</td>
                          <td className="py-1.5 px-2 font-medium text-slate-900">{it.name}</td>
                          <td className="py-1.5 px-2 text-slate-600 font-mono text-[11px]">{it.spec}</td>
                          <td className="py-1.5 px-2 text-center text-slate-600">{it.unit}</td>
                          <td className="py-1.5 px-2 text-right font-mono font-bold text-blue-600">{it.quantity}</td>
                          <td className="py-1.5 px-2 text-right font-mono text-slate-600">{it.price.toFixed(2)}</td>
                          <td className="py-1.5 px-2 text-right font-mono font-bold text-slate-900">
                            {(it.amount || it.quantity * it.price).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 px-4 py-2.5 border-t border-slate-200 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setIsViewModalOpen(false)}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium text-xs shadow-xs"
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

// =========================================================================
// 5. 试剂入库管理 子页面
// =========================================================================
const ReagentInboundSubView: React.FC<{ hospitalUnit: string; showNotice: (m: string) => void }> = ({
  hospitalUnit,
  showNotice,
}) => {
  return (
    <div className="bg-white rounded-lg border border-slate-200 flex-1 flex flex-col p-4 overflow-y-auto space-y-3 shadow-xs">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900">试剂批号扫码验收与冷链入库登记</h3>
          <p className="text-slate-500 text-xs mt-0.5">严格核实随货同行单、冷链温度记录箱数据、注册证与出厂质检报告(COA)</p>
        </div>
        <button onClick={() => showNotice('已开启手持扫码枪验收对接模式')} className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold shadow-xs flex items-center gap-1">
          <Search className="w-3.5 h-3.5" />
          <span>条码批量验收入库</span>
        </button>
      </div>

      <table className="w-full text-left text-xs border-collapse">
        <thead>
          <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
            <th className="py-2.5 px-3">入库单号</th>
            <th className="py-2.5 px-3">试剂品名</th>
            <th className="py-2.5 px-3">生产批号</th>
            <th className="py-2.5 px-3">有效期至</th>
            <th className="py-2.5 px-3">入库数量</th>
            <th className="py-2.5 px-3">随货温度</th>
            <th className="py-2.5 px-3">验收人员</th>
            <th className="py-2.5 px-3">入库时间</th>
            <th className="py-2.5 px-3 text-right">操作</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          <tr className="hover:bg-slate-50">
            <td className="py-2.5 px-3 font-mono font-bold text-slate-800">INB-202610-088</td>
            <td className="py-2.5 px-3 font-semibold text-slate-900">丙氨酸氨基转移酶(ALT)测定试剂盒</td>
            <td className="py-2.5 px-3 font-mono font-bold text-blue-700">20261012</td>
            <td className="py-2.5 px-3 font-mono text-emerald-700 font-bold">2027-10-11</td>
            <td className="py-2.5 px-3 font-mono font-bold">30 盒</td>
            <td className="py-2.5 px-3"><span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-mono font-bold">4.2℃ (合格)</span></td>
            <td className="py-2.5 px-3">王宇轩技师</td>
            <td className="py-2.5 px-3 font-mono text-slate-400">2026-10-30 09:30</td>
            <td className="py-2.5 px-3 text-right"><button onClick={() => showNotice('打印入库条形码标签')} className="text-sky-600 hover:underline">打印标签</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

// =========================================================================
// 6. 试剂申领管理 子页面
// =========================================================================
const ReagentRequisitionSubView: React.FC<{ hospitalUnit: string; showNotice: (m: string) => void }> = ({
  hospitalUnit,
  showNotice,
}) => {
  return (
    <div className="bg-white rounded-lg border border-slate-200 flex-1 flex flex-col p-4 overflow-y-auto space-y-3 shadow-xs">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900">专业组/科室耗材申领出库发放管理</h3>
          <p className="text-slate-500 text-xs mt-0.5">支持各科室线上发起领料单，库管员扫码出库核减总库库存</p>
        </div>
        <button onClick={() => showNotice('新增科室申领单')} className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold shadow-xs">
          + 新增申领申请
        </button>
      </div>

      <table className="w-full text-left text-xs border-collapse">
        <thead>
          <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
            <th className="py-2.5 px-3">申领单号</th>
            <th className="py-2.5 px-3">申领科室/组别</th>
            <th className="py-2.5 px-3">申领品目</th>
            <th className="py-2.5 px-3">申领数量</th>
            <th className="py-2.5 px-3">实发数量</th>
            <th className="py-2.5 px-3">申领人</th>
            <th className="py-2.5 px-3">库房发料人</th>
            <th className="py-2.5 px-3">状态</th>
            <th className="py-2.5 px-3 text-right">操作</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          <tr className="hover:bg-slate-50">
            <td className="py-2.5 px-3 font-mono font-bold text-slate-800">REQ-APP-202610-12</td>
            <td className="py-2.5 px-3 font-semibold text-slate-900">急诊化验室</td>
            <td className="py-2.5 px-3">hs-cTnI 高敏肌钙蛋白试剂盒</td>
            <td className="py-2.5 px-3 font-mono">5 盒</td>
            <td className="py-2.5 px-3 font-mono font-bold text-emerald-700">5 盒</td>
            <td className="py-2.5 px-3">李晓红主管检验师</td>
            <td className="py-2.5 px-3">王宇轩技师</td>
            <td className="py-2.5 px-3"><span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">已出库发放</span></td>
            <td className="py-2.5 px-3 text-right"><button onClick={() => showNotice('打印出库单')} className="text-sky-600 hover:underline">打印单据</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

// =========================================================================
// 7. 试剂调拨管理 子页面
// =========================================================================
const ReagentTransferSubView: React.FC<{ hospitalUnit: string; showNotice: (m: string) => void }> = ({
  hospitalUnit,
  showNotice,
}) => {
  return (
    <div className="bg-white rounded-lg border border-slate-200 flex-1 flex flex-col p-4 overflow-y-auto space-y-3 shadow-xs">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900">跨院区/跨专业组应急试剂调拨调度</h3>
          <p className="text-slate-500 text-xs mt-0.5">针对急诊缺货或大批突发标本应急支援调拨，全程冷链跟踪</p>
        </div>
        <button onClick={() => showNotice('发起紧急调拨申请')} className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold shadow-xs">
          + 发起应急调拨
        </button>
      </div>

      <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-slate-900">TRANS-202610-03</span>
            <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-800 text-[11px] font-bold">在途中 (冷链车调度)</span>
          </div>
          <p className="text-slate-700 text-xs mt-1">调出方：【中心医院总院试剂总库】 ➔ 调入方：【东城第一分院急诊化验室】</p>
          <div className="text-slate-500 text-[11px] mt-1">调拨品目: VITEK 2 GN卡 4盒 · 经办人: 魏明副主任检验师 · 调拨时间: 2026-10-30 10:10</div>
        </div>
        <button onClick={() => showNotice('查看冷链GPS轨迹与温度')} className="px-3 py-1 bg-white border border-slate-300 hover:bg-slate-100 rounded text-slate-700 font-medium">物流监控</button>
      </div>
    </div>
  );
};

// =========================================================================
// 8. 试剂使用管理 子页面
// =========================================================================
const ReagentUsageSubView: React.FC<{ hospitalUnit: string; showNotice: (m: string) => void }> = ({
  hospitalUnit,
  showNotice,
}) => {
  return (
    <div className="bg-white rounded-lg border border-slate-200 flex-1 flex flex-col p-4 overflow-y-auto space-y-3 shadow-xs">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900">机上试剂开瓶有效期跟踪与实耗监控</h3>
          <p className="text-slate-500 text-xs mt-0.5">实时监控分析仪在机试剂开瓶天数、余量测试数与质控校准消耗</p>
        </div>
        <button onClick={() => showNotice('在机试剂余量全量刷新同步完成')} className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-medium flex items-center gap-1">
          <RefreshCw className="w-3.5 h-3.5" />
          <span>刷新在机数据</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-900">Cobas c702 · ALT试剂盒</span>
            <span className="text-emerald-700 font-mono font-bold">1,840 测试</span>
          </div>
          <div className="text-slate-500 text-[11px] mt-1">开瓶时间：2026-10-25 · 已在机 5 天 (开瓶期 28天)</div>
          <div className="mt-2 w-full bg-slate-200 rounded-full h-1.5">
            <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '82%' }}></div>
          </div>
        </div>

        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-900">Alinity i · hs-cTnI试剂盒</span>
            <span className="text-amber-600 font-mono font-bold">18 测试 (临界)</span>
          </div>
          <div className="text-slate-500 text-[11px] mt-1">开瓶时间：2026-10-28 · 已在机 2 天 · 建议更换新盒</div>
          <div className="mt-2 w-full bg-slate-200 rounded-full h-1.5">
            <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: '18%' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// 9. 试剂报损管理 子页面
// =========================================================================
const ReagentLossSubView: React.FC<{ hospitalUnit: string; showNotice: (m: string) => void }> = ({
  hospitalUnit,
  showNotice,
}) => {
  return (
    <div className="bg-white rounded-lg border border-slate-200 flex-1 flex flex-col p-4 overflow-y-auto space-y-3 shadow-xs">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900">试剂耗材损耗、破损与质控失控报废审批</h3>
          <p className="text-slate-500 text-xs mt-0.5">严格按照三甲复审标准登记试剂报损原因、责任人与科主任双重审核批复</p>
        </div>
        <button onClick={() => showNotice('打开报损登记表单')} className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded font-bold shadow-xs">
          + 录入报损申请
        </button>
      </div>

      <table className="w-full text-left text-xs border-collapse">
        <thead>
          <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
            <th className="py-2.5 px-3">报损单号</th>
            <th className="py-2.5 px-3">试剂品名</th>
            <th className="py-2.5 px-3">批号</th>
            <th className="py-2.5 px-3">报损数量</th>
            <th className="py-2.5 px-3">报损原因</th>
            <th className="py-2.5 px-3">责任人</th>
            <th className="py-2.5 px-3">审核状态</th>
            <th className="py-2.5 px-3">发生时间</th>
            <th className="py-2.5 px-3 text-right">操作</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          <tr className="hover:bg-slate-50">
            <td className="py-2.5 px-3 font-mono font-bold text-slate-800">LOSS-202610-02</td>
            <td className="py-2.5 px-3 font-semibold text-slate-900">血培养厌氧培养瓶</td>
            <td className="py-2.5 px-3 font-mono text-slate-600">20260312</td>
            <td className="py-2.5 px-3 font-mono font-bold text-rose-600">2 瓶</td>
            <td className="py-2.5 px-3">运输分拣中外力碰撞破损裂纹</td>
            <td className="py-2.5 px-3">王宇轩技师</td>
            <td className="py-2.5 px-3"><span className="text-emerald-700 font-bold">郭彩霞主任医师 已批准</span></td>
            <td className="py-2.5 px-3 font-mono text-slate-400">2026-10-28 14:10</td>
            <td className="py-2.5 px-3 text-right"><button onClick={() => showNotice('查看报损凭据及照片')} className="text-sky-600 hover:underline">查看凭证</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

// =========================================================================
// 10. 试剂盘点管理 子页面
// =========================================================================
const ReagentInventoryCheckSubView: React.FC<{ hospitalUnit: string; showNotice: (m: string) => void }> = ({
  hospitalUnit,
  showNotice,
}) => {
  return (
    <div className="bg-white rounded-lg border border-slate-200 flex-1 flex flex-col p-4 overflow-y-auto space-y-3 shadow-xs">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900">月度实物周期盘点与账实核对</h3>
          <p className="text-slate-500 text-xs mt-0.5">支持按冷藏库、常温库、机上在用三级库位生成盘点工作表，快速平账</p>
        </div>
        <button onClick={() => showNotice('已生成 2026年10月期末全库盘点工作表')} className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold shadow-xs">
          + 开启全库盘点
        </button>
      </div>

      <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-slate-900">CHECK-202610-M</span>
            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[11px] font-bold">已平账 (账实相符率 99.8%)</span>
          </div>
          <p className="text-slate-700 text-xs mt-1">2026年10月份例行月末大盘点 · 盘点品目 184 种 · 盘点总盒数 1,248 盒</p>
          <div className="text-slate-500 text-[11px] mt-1">盘点主管: 魏明副主任检验师 · 复核人: 郭彩霞主任医师 · 归档时间: 2026-10-30 08:00</div>
        </div>
        <button onClick={() => showNotice('导出盘点平账对比表')} className="px-3 py-1 bg-white border border-slate-300 hover:bg-slate-100 rounded text-slate-700 font-medium">导出报告</button>
      </div>
    </div>
  );
};

// =========================================================================
// 11. 试剂库存查询 子页面
// =========================================================================
const ReagentStockQuerySubView: React.FC<{ hospitalUnit: string; showNotice: (m: string) => void }> = ({
  hospitalUnit,
  showNotice,
}) => {
  const [stockSearch, setStockSearch] = useState('');
  const [stockStatus, setStockStatus] = useState('all');

  const stockList = [
    { id: 'S1', name: '丙氨酸氨基转移酶(ALT)测定试剂盒', batch: '20261012', exp: '2027-10-11', stock: 48, safe: 20, loc: '总库冷藏1号库A02', status: '充足' },
    { id: 'S2', name: '高敏肌钙蛋白I(hs-cTnI)检测试剂盒', batch: '20260215', exp: '2026-11-20', stock: 8, safe: 15, loc: '急诊专库冷藏2号箱', status: '临期预警' },
    { id: 'S3', name: '全自动血培养瓶 (需氧/厌氧双联)', batch: '20260608', exp: '2027-06-07', stock: 32, safe: 25, loc: '微生物室常温库04', status: '正常' },
    { id: 'S4', name: '革兰氏快速鉴定试剂卡(VITEK 2 GN)', batch: '20260515', exp: '2027-05-14', stock: 6, safe: 12, loc: '微生物室冷藏01', status: '低库存' },
  ];

  return (
    <div className="bg-white rounded-lg border border-slate-200 flex-1 flex flex-col overflow-hidden shadow-xs">
      <div className="p-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50 shrink-0">
        <div className="flex items-center gap-3">
          <span className="font-bold text-slate-900 text-sm">全院多级库位实时动态库存明细</span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-500 text-xs">支持批号、库位、效期红黄绿灯实时预警</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-56">
            <input
              type="text"
              placeholder="搜索试剂名称/批号/库位..."
              value={stockSearch}
              onChange={e => setStockSearch(e.target.value)}
              className="w-full border border-slate-300 rounded pl-2.5 pr-7 py-1 text-xs"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2" />
          </div>

          <button onClick={() => showNotice('已导出全库实时库存Excel表')} className="px-3 py-1 bg-white border border-slate-300 hover:bg-slate-100 rounded text-slate-700 font-medium flex items-center gap-1 shadow-2xs">
            <Download className="w-3.5 h-3.5" />
            <span>导出Excel</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <th className="py-2.5 px-3">试剂品名</th>
              <th className="py-2.5 px-3">生产批号</th>
              <th className="py-2.5 px-3">有效截止期</th>
              <th className="py-2.5 px-3">当前库存量</th>
              <th className="py-2.5 px-3">安全库存警戒线</th>
              <th className="py-2.5 px-3">所在库位</th>
              <th className="py-2.5 px-3">库存状态</th>
              <th className="py-2.5 px-3 text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {stockList.map(item => (
              <tr key={item.id} className="hover:bg-slate-50">
                <td className="py-2.5 px-3 font-semibold text-slate-900">{item.name}</td>
                <td className="py-2.5 px-3 font-mono font-bold text-slate-800">{item.batch}</td>
                <td className="py-2.5 px-3 font-mono">
                  <span className={item.status === '临期预警' ? 'text-rose-600 font-bold' : 'text-slate-700'}>{item.exp}</span>
                </td>
                <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{item.stock} 盒</td>
                <td className="py-2.5 px-3 font-mono text-slate-500">{item.safe} 盒</td>
                <td className="py-2.5 px-3 text-slate-700">{item.loc}</td>
                <td className="py-2.5 px-3">
                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    item.status === '充足' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                    item.status === '临期预警' ? 'bg-rose-50 text-rose-700 border border-rose-200 animate-pulse' :
                    item.status === '低库存' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {item.status}
                  </span>
                </td>
                <td className="py-2.5 px-3 text-right">
                  <button onClick={() => showNotice(`调取试剂 [${item.name}] 流转轨迹`)} className="text-sky-600 hover:underline">明细</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// =========================================================================
// 12. 试剂统计分析 子页面 (根据截图 1:1 像素级精准复刻)
// =========================================================================

interface StatReportMeta {
  id: string;
  name: string;
  desc?: string;
}

const STAT_REPORT_CATALOG: StatReportMeta[] = [
  { id: 'stock-ledger', name: '库存台账表', desc: '期初结存、本期入库、本期出库及实时库存核算台账' },
  { id: 'stock-warning', name: '库存预警表', desc: '低于安全库存警戒线与缺货风险试剂监控' },
  { id: 'material-ledger', name: '物资材料账表', desc: '按物资分类核算耗材与试剂财务明细账' },
  { id: 'shelf-life-warning', name: '保质期预警表', desc: '临近有效截止期(30/60/90天)与超期失效预警' },
  { id: 'stock-abc', name: '库存ABC分析表', desc: '按库存资金占用与周转频次实行A/B/C分类管控' },
  { id: 'order-tracking', name: '订单全程跟踪表', desc: '采购订单发起、供应商发运、冷链轨迹与到货验收' },
  { id: 'material-cost', name: '材料费用分析表', desc: '临床生化、免疫、微生物等科室单标本耗材成本分摊' },
  { id: 'in-out-ledger', name: '物资出入库流水账表', desc: '每日全量验收验收入库单与领料出库单对账流水' },
  { id: 'certificate-warning', name: '物资证件效期预警表', desc: '医疗器械注册证、生产许可证及授权书效期预警' },
  { id: 'stock-variance', name: '物资库存差异分析样表', desc: '周期盘点账实差异率、盘盈盘亏与平账原因溯源' },
  { id: 'category-in-out', name: '物资类别出入库流水账表', desc: '大类维度(试剂、质控品、定标液、耗材)出入库统计' },
  { id: 'high-value-aging', name: '高值耗材库存账龄分析表', desc: '滞销与超长在库(>180天)高单价检测试剂账龄结构' },
];

export interface ReagentStatLedgerRow {
  id: string;
  code: string; // 试剂编码 (001, 002, 003)
  name: string; // 试剂名称
  spec: string; // 规格
  batchNo: string; // 批号
  availableQty: number; // 可用数量
  stockQty: number; // 库存数量
  unit: string; // 单位
  stockAmount: number; // 库存金额
  supplier: string; // 供应商
  manufacturer: string; // 生产商
  warehouse: string; // 当前库房
  storageTemp?: string; // 存储温度
  validDate?: string; // 有效截止日期
  inboundDate?: string; // 入库日期
  unitPrice?: number; // 单价
  checker?: string; // 验收人
}

// 截图原始数据 (精确一模一样) + 真实补充生化库数据
const INITIAL_STAT_DATA: ReagentStatLedgerRow[] = [
  {
    id: 'STAT-001',
    code: '001',
    name: '罗氏Cobas 8000总胆固醇(TC)检测试剂盒',
    spec: 'R1: 4×250T, R2: 4×250T',
    batchNo: '20261015-01',
    availableQty: 24,
    stockQty: 24,
    unit: '盒',
    stockAmount: 20400.0,
    supplier: '国药控股股份有限公司',
    manufacturer: '罗氏诊断 Roche',
    warehouse: '生化库',
    storageTemp: '2~8℃ 避光',
    validDate: '2027-10-14',
    inboundDate: '2026-10-16',
    unitPrice: 850.0,
    checker: '王宇轩技师',
  },
  {
    id: 'STAT-002',
    code: '002',
    name: '贝克曼AU5800谷丙转氨酶(ALT)测定制剂盒',
    spec: '4×1000测试/盒',
    batchNo: '20261012-03',
    availableQty: 18,
    stockQty: 18,
    unit: '盒',
    stockAmount: 11160.0,
    supplier: '华润医药商业集团',
    manufacturer: '贝克曼库尔特 Beckman',
    warehouse: '生化库',
    storageTemp: '2~8℃ 避光',
    validDate: '2027-10-11',
    inboundDate: '2026-10-13',
    unitPrice: 620.0,
    checker: '王宇轩技师',
  },
  {
    id: 'STAT-003',
    code: '003',
    name: '迈瑞BS-2000肌酐(Cr)酶法测定制剂盒',
    spec: '2×500T/盒',
    batchNo: '20261008-02',
    availableQty: 30,
    stockQty: 30,
    unit: '盒',
    stockAmount: 14400.0,
    supplier: '九州通医药集团',
    manufacturer: '深圳迈瑞医疗 Mindray',
    warehouse: '生化库',
    storageTemp: '2~8℃ 避光',
    validDate: '2027-10-07',
    inboundDate: '2026-10-09',
    unitPrice: 480.0,
    checker: '王宇轩技师',
  },
  {
    id: 'STAT-004',
    code: '004',
    name: '雅培ARCHITECT生化尿素氮(BUN)测定试剂盒',
    spec: 'R1: 2×500T, R2: 2×500T',
    batchNo: '20261005-01',
    availableQty: 16,
    stockQty: 16,
    unit: '盒',
    stockAmount: 8960.0,
    supplier: '重庆医药集团股份有限公司',
    manufacturer: '美国雅培 Abbott',
    warehouse: '生化库',
    storageTemp: '2~8℃ 避光',
    validDate: '2027-10-04',
    inboundDate: '2026-10-06',
    unitPrice: 560.0,
    checker: '王宇轩技师',
  },
  {
    id: 'STAT-005',
    code: '005',
    name: '西门子ADVIA 2400直接胆红素(DBIL)试剂盒',
    spec: 'R1: 4×200T, R2: 4×200T',
    batchNo: '20260928-02',
    availableQty: 12,
    stockQty: 12,
    unit: '盒',
    stockAmount: 7440.0,
    supplier: '国药控股股份有限公司',
    manufacturer: '西门子医疗 Siemens',
    warehouse: '生化库',
    storageTemp: '2~8℃ 避光',
    validDate: '2027-09-27',
    inboundDate: '2026-09-29',
    unitPrice: 620.0,
    checker: '李晓红主管检验师',
  },
];

const ReagentStatAnalysisSubView: React.FC<{ hospitalUnit: string; showNotice: (m: string) => void }> = ({
  hospitalUnit,
  showNotice,
}) => {
  // 左侧报表选中状态 (默认选中 'stock-ledger' - 库存台账表，与截图一模一样)
  const [selectedReportId, setSelectedReportId] = useState<string>('stock-ledger');

  // 当前库房筛选 (默认 '生化库'，与截图一模一样)
  const [currentWarehouse, setCurrentWarehouse] = useState<string>('生化库');

  // 试剂信息搜索框
  const [reagentQuery, setReagentQuery] = useState<string>('');

  // 弹窗：钩稽核算明细与溯源凭证
  const [selectedItemForTrace, setSelectedItemForTrace] = useState<ReagentStatLedgerRow | null>(null);

  // 弹窗：导出报表配置
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

  // 当前选中的报表元信息
  const currentReportMeta = useMemo(() => {
    return (
      STAT_REPORT_CATALOG.find((r) => r.id === selectedReportId) || STAT_REPORT_CATALOG[0]
    );
  }, [selectedReportId]);

  // 根据当前条件筛选数据
  const filteredList = useMemo(() => {
    return INITIAL_STAT_DATA.filter((item) => {
      // 库房筛选
      if (currentWarehouse !== '全部库房' && item.warehouse !== currentWarehouse) {
        return false;
      }
      // 关键词搜索 (试剂名称、编码、批号、生产商、供应商)
      if (reagentQuery.trim()) {
        const q = reagentQuery.trim().toLowerCase();
        const matchName = item.name.toLowerCase().includes(q);
        const matchCode = item.code.toLowerCase().includes(q);
        const matchBatch = item.batchNo.toLowerCase().includes(q);
        const matchMfr = item.manufacturer.toLowerCase().includes(q);
        const matchSup = item.supplier.toLowerCase().includes(q);
        if (!matchName && !matchCode && !matchBatch && !matchMfr && !matchSup) {
          return false;
        }
      }
      return true;
    });
  }, [currentWarehouse, reagentQuery]);

  // 截图中精确展示前 3 条生化试剂数据 (当未过滤时精确为 3 条)
  const displayList = useMemo(() => {
    if (!reagentQuery.trim() && currentWarehouse === '生化库') {
      return INITIAL_STAT_DATA.slice(0, 3);
    }
    return filteredList;
  }, [reagentQuery, currentWarehouse, filteredList]);

  // 计算空行数以完美填充满表格区域，精确还原截图中的空白网格线效果
  const emptyRowCount = Math.max(0, 12 - displayList.length);

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden text-xs font-sans">
      {/* ===================== 顶部标题区 (根据截图 1:1) ===================== */}
      <div className="bg-white rounded-lg border border-slate-200 p-3 mb-2 flex items-center justify-between shadow-2xs shrink-0">
        <div className="flex items-center gap-3">
          {/* 天蓝色背景柱状图图标卡片 */}
          <div className="w-10 h-10 rounded-lg bg-sky-50 border border-sky-100 flex items-center justify-center text-[#1890ff] shadow-2xs">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-slate-900 text-sm tracking-tight flex items-center gap-2">
              <span>试剂统计分析</span>
              <span className="text-xs font-normal text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                当前视角: {currentReportMeta.name}
              </span>
            </h2>
            <p className="text-slate-500 text-xs mt-0.5">
              精准核算【{hospitalUnit}】{currentReportMeta.desc}
            </p>
          </div>
        </div>

        {/* 右侧 [导出] 按钮 (实心亮蓝底色) */}
        <button
          type="button"
          onClick={() => setIsExportModalOpen(true)}
          className="px-4 py-1.5 bg-[#1890ff] hover:bg-blue-600 text-white rounded text-xs font-medium flex items-center gap-1.5 shadow-2xs transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          <span>导出</span>
        </button>
      </div>

      {/* ===================== 主体左右分栏布局 ===================== */}
      <div className="flex-1 flex gap-2 min-h-0 overflow-hidden">
        {/* ===================== 左侧：统计分析报表目录 (12项) ===================== */}
        <div className="w-52 shrink-0 bg-white border border-slate-200 rounded-lg flex flex-col overflow-hidden shadow-2xs">
          {/* 目录标题栏 */}
          <div className="bg-[#fafafa] border-b border-slate-200 px-3.5 py-2.5 flex items-center gap-2 text-xs font-bold text-slate-800 shrink-0">
            <Folder className="w-4 h-4 text-[#1890ff]" />
            <span>统计分析报表目录</span>
          </div>

          {/* 报表竖排列表项 */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {STAT_REPORT_CATALOG.map((rep) => {
              const isSelected = selectedReportId === rep.id;
              return (
                <button
                  key={rep.id}
                  type="button"
                  onClick={() => {
                    setSelectedReportId(rep.id);
                    showNotice(`已联动切换右侧视图至【${rep.name}】`);
                  }}
                  className={`w-full text-left transition-colors flex items-center justify-between text-xs cursor-pointer ${
                    isSelected
                      ? 'bg-[#1890ff] text-white font-semibold py-2.5 px-3 shadow-2xs'
                      : 'text-slate-700 hover:bg-slate-50 py-2 px-3'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    {!isSelected && (
                      <span className="text-slate-400 font-mono text-xs select-none">├</span>
                    )}
                    <span className="truncate">{rep.name}</span>
                  </div>
                  {isSelected && <ChevronRight className="w-3.5 h-3.5 text-white shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* ===================== 右侧：报表表格与筛选工作区 ===================== */}
        <div className="flex-1 bg-white border border-slate-200 rounded-lg flex flex-col min-h-0 overflow-hidden shadow-2xs">
          {/* 顶部搜索筛选栏 */}
          <div className="bg-white px-4 py-2 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
            <div className="flex flex-wrap items-center gap-3">
              {/* 当前库房 */}
              <div className="flex items-center gap-2">
                <span className="text-slate-700 font-medium whitespace-nowrap">当前库房</span>
                <select
                  value={currentWarehouse}
                  onChange={(e) => {
                    setCurrentWarehouse(e.target.value);
                    showNotice(`已切换库房：${e.target.value}`);
                  }}
                  className="border border-slate-300 rounded px-2.5 py-1 text-xs text-slate-800 bg-white focus:outline-none focus:border-blue-500 min-w-[85px] cursor-pointer"
                >
                  <option value="生化库">生化库</option>
                  <option value="免疫库">免疫库</option>
                  <option value="临检血液库">临检血液库</option>
                  <option value="微生物库">微生物库</option>
                  <option value="分子生物库">分子生物库</option>
                  <option value="全部库房">全部库房</option>
                </select>
              </div>

              {/* 试剂信息 */}
              <div className="flex items-center gap-2">
                <span className="text-slate-700 font-medium whitespace-nowrap">试剂信息</span>
                <input
                  type="text"
                  value={reagentQuery}
                  onChange={(e) => setReagentQuery(e.target.value)}
                  placeholder="试剂名称、编码、批号"
                  className="border border-slate-300 rounded px-2.5 py-1 text-xs text-slate-800 w-48 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              {/* [查询] 按钮 */}
              <button
                type="button"
                onClick={() => {
                  showNotice(`【${currentReportMeta.name}】查询完毕，已匹配 ${displayList.length} 条记录`);
                }}
                className="px-3.5 py-1 bg-white border border-[#1890ff] text-[#1890ff] hover:bg-blue-50 rounded text-xs font-medium flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              >
                <Search className="w-3.5 h-3.5 text-[#1890ff]" />
                <span>查询</span>
              </button>
            </div>

            <div className="text-slate-400 text-xs font-mono">
              {currentReportMeta.name} · 数据统计日期: 2026-10-01 ~ 2026-10-31
            </div>
          </div>

          {/* 动态表格区域根据 selectedReportId 渲染 */}
          <div className="flex-1 overflow-auto min-h-0 bg-white">
            <table className="w-full border-collapse text-left text-xs text-slate-700">
              <thead className="bg-[#fafafa] text-slate-700 font-medium sticky top-0 z-10 border-b border-slate-200">
                <tr className="border-b border-slate-200 divide-x divide-slate-200">
                  {selectedReportId === 'stock-ledger' && (
                    <>
                      <th className="py-2.5 px-3 whitespace-nowrap text-center font-mono w-20">试剂编码</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">试剂名称</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">规格</th>
                      <th className="py-2.5 px-3 whitespace-nowrap font-mono">批号</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-center font-mono">可用数量</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-center font-mono">库存数量</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-center w-12">单位</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-center font-mono">库存金额</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">供应商</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">生产商</th>
                    </>
                  )}
                  {selectedReportId === 'stock-warning' && (
                    <>
                      <th className="py-2.5 px-3 whitespace-nowrap text-center font-mono w-20">试剂编码</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">试剂名称</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">规格</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-center font-mono">当前库存</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-center font-mono">安全警戒线</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-center font-mono">缺货数量</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">所在库位</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-center">紧急状态</th>
                    </>
                  )}
                  {selectedReportId === 'material-ledger' && (
                    <>
                      <th className="py-2.5 px-3 whitespace-nowrap">物资大类</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">试剂名称</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">规格</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-center w-12">单位</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-right font-mono">期初结存额</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-right font-mono">本期入库额</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-right font-mono">本期消耗额</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-right font-mono">期末结存额</th>
                    </>
                  )}
                  {selectedReportId === 'shelf-life-warning' && (
                    <>
                      <th className="py-2.5 px-3 whitespace-nowrap text-center font-mono w-20">试剂编码</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">试剂名称</th>
                      <th className="py-2.5 px-3 whitespace-nowrap font-mono">批号</th>
                      <th className="py-2.5 px-3 whitespace-nowrap font-mono">有效截止期</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-center font-mono">剩余天数</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-center font-mono">在库数量</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">库位</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-center">预警级别</th>
                    </>
                  )}
                  {selectedReportId === 'stock-abc' && (
                    <>
                      <th className="py-2.5 px-3 whitespace-nowrap text-center w-20">评级</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">试剂名称</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">规格</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-right font-mono">年度消耗金额</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-center font-mono">资金占用比</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-center">周转频次</th>
                    </>
                  )}
                  {selectedReportId === 'order-tracking' && (
                    <>
                      <th className="py-2.5 px-3 whitespace-nowrap font-mono">采购单号</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">试剂名称</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-center font-mono">订购数量</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">供应商</th>
                      <th className="py-2.5 px-3 whitespace-nowrap font-mono">下单时间</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-center">冷链温度</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-center">配送状态</th>
                    </>
                  )}
                  {selectedReportId === 'material-cost' && (
                    <>
                      <th className="py-2.5 px-3 whitespace-nowrap">临床科室 / 专业组</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-center font-mono">本月标本送检管数</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-right font-mono">试剂消耗总额(元)</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-right font-mono">单标本试剂成本</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-center">环比增减</th>
                    </>
                  )}
                  {selectedReportId === 'in-out-ledger' && (
                    <>
                      <th className="py-2.5 px-3 whitespace-nowrap font-mono">单据编号</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-center">业务类型</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">试剂名称</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-center font-mono">数量</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-center w-12">单位</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-right font-mono">金额(元)</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">经办人</th>
                      <th className="py-2.5 px-3 whitespace-nowrap font-mono">操作时间</th>
                    </>
                  )}
                  {selectedReportId === 'certificate-warning' && (
                    <>
                      <th className="py-2.5 px-3 whitespace-nowrap">证件类型</th>
                      <th className="py-2.5 px-3 whitespace-nowrap font-mono">医疗器械注册证号 / 授权号</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">颁证机构 / 生产商</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">获批适用范围</th>
                      <th className="py-2.5 px-3 whitespace-nowrap font-mono">证件效期至</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-center">状态</th>
                    </>
                  )}
                  {selectedReportId === 'stock-variance' && (
                    <>
                      <th className="py-2.5 px-3 whitespace-nowrap font-mono">盘点单号</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">试剂名称</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-center font-mono">账面库存</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-center font-mono">实盘数量</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-center font-mono">差异数</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-right font-mono">差异金额(元)</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">盈亏原因说明</th>
                    </>
                  )}
                  {selectedReportId === 'category-in-out' && (
                    <>
                      <th className="py-2.5 px-3 whitespace-nowrap">物资大类</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-center font-mono">期初库存数</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-center font-mono">本期入库数</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-center font-mono">本期消耗数</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-center font-mono">期末结存数</th>
                    </>
                  )}
                  {selectedReportId === 'high-value-aging' && (
                    <>
                      <th className="py-2.5 px-3 whitespace-nowrap">高值试剂名称</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">规格</th>
                      <th className="py-2.5 px-3 whitespace-nowrap font-mono">批号</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-center font-mono">在库天数</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-center">账龄区间</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-right font-mono">库存金额(元)</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {displayList.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() => setSelectedItemForTrace(row)}
                    className="hover:bg-blue-50/60 divide-x divide-slate-100 cursor-pointer transition-colors"
                  >
                    {selectedReportId === 'stock-ledger' && (
                      <>
                        <td className="py-2 px-3 text-center font-mono font-bold text-[#1890ff] hover:underline whitespace-nowrap">
                          {row.code}
                        </td>
                        <td className="py-2 px-3 font-semibold text-slate-900 whitespace-nowrap">{row.name}</td>
                        <td className="py-2 px-3 text-slate-600 font-mono text-[11px] whitespace-nowrap">{row.spec}</td>
                        <td className="py-2 px-3 font-mono text-slate-700 whitespace-nowrap">{row.batchNo}</td>
                        <td className="py-2 px-3 text-center font-mono font-bold text-emerald-600 whitespace-nowrap">{row.availableQty}</td>
                        <td className="py-2 px-3 text-center font-mono font-bold text-slate-900 whitespace-nowrap">{row.stockQty}</td>
                        <td className="py-2 px-3 text-center text-slate-700 whitespace-nowrap">{row.unit}</td>
                        <td className="py-2 px-3 text-center font-mono font-bold text-[#1890ff] whitespace-nowrap">¥{row.stockAmount.toFixed(2)}</td>
                        <td className="py-2 px-3 text-slate-700 whitespace-nowrap">{row.supplier}</td>
                        <td className="py-2 px-3 text-slate-700 whitespace-nowrap">{row.manufacturer}</td>
                      </>
                    )}
                    {selectedReportId === 'stock-warning' && (
                      <>
                        <td className="py-2 px-3 text-center font-mono font-bold text-[#1890ff]">{row.code}</td>
                        <td className="py-2 px-3 font-semibold text-slate-900">{row.name}</td>
                        <td className="py-2 px-3 text-slate-600 font-mono text-[11px]">{row.spec}</td>
                        <td className="py-2 px-3 text-center font-mono font-bold text-slate-900">{row.stockQty} {row.unit}</td>
                        <td className="py-2 px-3 text-center font-mono text-slate-500">20 {row.unit}</td>
                        <td className="py-2 px-3 text-center font-mono font-bold text-rose-600">{Math.max(0, 20 - row.stockQty)} {row.unit}</td>
                        <td className="py-2 px-3 text-slate-700">总库冷藏1号库A02</td>
                        <td className="py-2 px-3 text-center">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            库存警戒临界
                          </span>
                        </td>
                      </>
                    )}
                    {selectedReportId === 'material-ledger' && (
                      <>
                        <td className="py-2 px-3 font-semibold text-slate-800">体外诊断试剂</td>
                        <td className="py-2 px-3 font-semibold text-slate-900">{row.name}</td>
                        <td className="py-2 px-3 text-slate-600 font-mono text-[11px]">{row.spec}</td>
                        <td className="py-2 px-3 text-center text-slate-700">{row.unit}</td>
                        <td className="py-2 px-3 text-right font-mono text-slate-700">¥{(row.stockAmount * 0.8).toFixed(2)}</td>
                        <td className="py-2 px-3 text-right font-mono text-emerald-700">¥{row.stockAmount.toFixed(2)}</td>
                        <td className="py-2 px-3 text-right font-mono text-amber-700">¥{(row.stockAmount * 0.4).toFixed(2)}</td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-blue-700">¥{(row.stockAmount * 1.4).toFixed(2)}</td>
                      </>
                    )}
                    {selectedReportId === 'shelf-life-warning' && (
                      <>
                        <td className="py-2 px-3 text-center font-mono font-bold text-[#1890ff]">{row.code}</td>
                        <td className="py-2 px-3 font-semibold text-slate-900">{row.name}</td>
                        <td className="py-2 px-3 font-mono text-slate-700">{row.batchNo}</td>
                        <td className="py-2 px-3 font-mono text-emerald-700 font-bold">{row.validDate || '2027-10-14'}</td>
                        <td className="py-2 px-3 text-center font-mono font-bold text-slate-900">350 天</td>
                        <td className="py-2 px-3 text-center font-mono font-bold">{row.stockQty} {row.unit}</td>
                        <td className="py-2 px-3 text-slate-700">冷藏库区02</td>
                        <td className="py-2 px-3 text-center">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            效期充足
                          </span>
                        </td>
                      </>
                    )}
                    {selectedReportId === 'stock-abc' && (
                      <>
                        <td className="py-2 px-3 text-center font-bold text-indigo-700 bg-indigo-50">A类 (重点管控)</td>
                        <td className="py-2 px-3 font-semibold text-slate-900">{row.name}</td>
                        <td className="py-2 px-3 text-slate-600 font-mono text-[11px]">{row.spec}</td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">¥{(row.stockAmount * 24).toFixed(2)}</td>
                        <td className="py-2 px-3 text-center font-mono text-slate-700">42.5%</td>
                        <td className="py-2 px-3 text-center font-semibold text-blue-700">高频周转</td>
                      </>
                    )}
                    {selectedReportId === 'order-tracking' && (
                      <>
                        <td className="py-2 px-3 font-mono font-bold text-slate-800">PO-20261015-08</td>
                        <td className="py-2 px-3 font-semibold text-slate-900">{row.name}</td>
                        <td className="py-2 px-3 text-center font-mono font-bold">50 {row.unit}</td>
                        <td className="py-2 px-3 text-slate-700">{row.supplier}</td>
                        <td className="py-2 px-3 font-mono text-slate-500">2026-10-15 10:20</td>
                        <td className="py-2 px-3 text-center font-mono text-emerald-700">4.1℃ (合格)</td>
                        <td className="py-2 px-3 text-center">
                          <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800 font-bold">已入库验收</span>
                        </td>
                      </>
                    )}
                    {selectedReportId === 'material-cost' && (
                      <>
                        <td className="py-2 px-3 font-semibold text-slate-900">临床生化专业组</td>
                        <td className="py-2 px-3 text-center font-mono font-bold text-blue-700">18,420 管</td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">¥88,780.40</td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-emerald-700">¥4.82 /管</td>
                        <td className="py-2 px-3 text-center font-medium text-emerald-600">-2.4% (平稳)</td>
                      </>
                    )}
                    {selectedReportId === 'in-out-ledger' && (
                      <>
                        <td className="py-2 px-3 font-mono font-bold text-slate-800">IO-20261016-01</td>
                        <td className="py-2 px-3 text-center">
                          <span className="px-2 py-0.5 rounded text-[10px] bg-sky-50 text-sky-700 border border-sky-200 font-bold">入库验收</span>
                        </td>
                        <td className="py-2 px-3 font-semibold text-slate-900">{row.name}</td>
                        <td className="py-2 px-3 text-center font-mono font-bold text-emerald-600">+{row.stockQty}</td>
                        <td className="py-2 px-3 text-center text-slate-700">{row.unit}</td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">¥{row.stockAmount.toFixed(2)}</td>
                        <td className="py-2 px-3 text-slate-700">{row.checker || '王宇轩技师'}</td>
                        <td className="py-2 px-3 font-mono text-slate-500">2026-10-16 09:30</td>
                      </>
                    )}
                    {selectedReportId === 'certificate-warning' && (
                      <>
                        <td className="py-2 px-3 font-semibold text-slate-800">医疗器械注册证</td>
                        <td className="py-2 px-3 font-mono font-bold text-slate-900">国械注进20212400388</td>
                        <td className="py-2 px-3 text-slate-700">{row.manufacturer}</td>
                        <td className="py-2 px-3 text-slate-600">全自动生化分析仪配套测定</td>
                        <td className="py-2 px-3 font-mono text-emerald-700 font-bold">2028-06-30</td>
                        <td className="py-2 px-3 text-center">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            在用合法
                          </span>
                        </td>
                      </>
                    )}
                    {selectedReportId === 'stock-variance' && (
                      <>
                        <td className="py-2 px-3 font-mono font-bold text-slate-800">CHK-202610-M</td>
                        <td className="py-2 px-3 font-semibold text-slate-900">{row.name}</td>
                        <td className="py-2 px-3 text-center font-mono">{row.stockQty}</td>
                        <td className="py-2 px-3 text-center font-mono font-bold">{row.stockQty}</td>
                        <td className="py-2 px-3 text-center font-mono text-slate-500">0</td>
                        <td className="py-2 px-3 text-right font-mono text-slate-700">¥0.00</td>
                        <td className="py-2 px-3 text-slate-700">月末例行盘点：账实相符</td>
                      </>
                    )}
                    {selectedReportId === 'category-in-out' && (
                      <>
                        <td className="py-2 px-3 font-semibold text-slate-900">体外诊断试剂大类</td>
                        <td className="py-2 px-3 text-center font-mono">120 盒</td>
                        <td className="py-2 px-3 text-center font-mono text-emerald-700 font-bold">64 盒</td>
                        <td className="py-2 px-3 text-center font-mono text-amber-700 font-bold">48 盒</td>
                        <td className="py-2 px-3 text-center font-mono font-bold text-blue-700">136 盒</td>
                      </>
                    )}
                    {selectedReportId === 'high-value-aging' && (
                      <>
                        <td className="py-2 px-3 font-semibold text-slate-900">{row.name}</td>
                        <td className="py-2 px-3 text-slate-600 font-mono text-[11px]">{row.spec}</td>
                        <td className="py-2 px-3 font-mono text-slate-700">{row.batchNo}</td>
                        <td className="py-2 px-3 text-center font-mono font-bold">14 天</td>
                        <td className="py-2 px-3 text-center font-semibold text-emerald-700">0-30天 (正常)</td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-[#1890ff]">¥{row.stockAmount.toFixed(2)}</td>
                      </>
                    )}
                  </tr>
                ))}

                {/* 空白网格行，与原系统截图一模一样 */}
                {Array.from({ length: emptyRowCount }).map((_, idx) => (
                  <tr key={`empty-${idx}`} className="divide-x divide-slate-100 h-8">
                    {Array.from({ length: selectedReportId === 'stock-ledger' ? 10 : selectedReportId === 'material-ledger' || selectedReportId === 'in-out-ledger' ? 8 : 7 }).map((__, i) => (
                      <td key={i} className="py-2 px-3">&nbsp;</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 表格底部状态栏 (与截图 1:1) */}
          <div className="bg-[#fafafa] border-t border-slate-200 px-4 py-2 flex items-center justify-between text-xs shrink-0 select-none">
            <div className="flex items-center gap-3">
              <span className="text-[#1890ff] font-bold">合计: {displayList.length} 条</span>
              <span className="text-slate-600">
                当前选定报表: <strong className="text-slate-900 font-semibold">{currentReportMeta.name}</strong>
              </span>
            </div>
            <div className="text-slate-400 text-[11px]">
              点击表格任一行可展开该项钩稽核算明细与溯源凭证
            </div>
          </div>
        </div>
      </div>

      {/* ===================== 弹窗：钩稽核算明细与溯源凭证 ===================== */}
      {selectedItemForTrace && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-300 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* 弹窗头部 */}
            <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between">
              <div className="font-bold text-sm flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-sky-400" />
                <span>试剂钩稽核算明细与冷链溯源凭证</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedItemForTrace(null)}
                className="text-white/70 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 弹窗内容 */}
            <div className="p-5 space-y-4 text-xs text-slate-800 max-h-[75vh] overflow-y-auto">
              {/* 基本档案与库存摘要 */}
              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900">{selectedItemForTrace.name}</span>
                  <span className="font-mono font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded text-xs">
                    编码: {selectedItemForTrace.code}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2 pt-2 border-t border-blue-200/60 text-slate-700">
                  <div>规格：<span className="font-mono text-slate-900">{selectedItemForTrace.spec}</span></div>
                  <div>生产批号：<span className="font-mono font-bold text-slate-900">{selectedItemForTrace.batchNo}</span></div>
                  <div>在库库存：<span className="font-bold text-slate-900">{selectedItemForTrace.stockQty} {selectedItemForTrace.unit}</span></div>
                  <div>可用数量：<span className="font-bold text-emerald-600">{selectedItemForTrace.availableQty} {selectedItemForTrace.unit}</span></div>
                  <div>储存条件：<span className="font-medium text-slate-800">{selectedItemForTrace.storageTemp || '2~8℃ 避光'}</span></div>
                  <div>有效截止期：<span className="font-mono text-emerald-700 font-bold">{selectedItemForTrace.validDate || '2027-10-14'}</span></div>
                  <div>库存总金额：<span className="font-mono font-bold text-[#1890ff]">¥{selectedItemForTrace.stockAmount.toFixed(2)}</span></div>
                  <div>所属库房：<span className="font-bold text-slate-800">{selectedItemForTrace.warehouse}</span></div>
                </div>
              </div>

              {/* 钩稽核算关系与溯源凭据卡 */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-blue-600" />
                  <span>批次冷链出入库流转凭据与钩稽核算链路</span>
                </h4>

                <div className="border border-slate-200 rounded-lg divide-y divide-slate-100 overflow-hidden bg-slate-50">
                  <div className="p-2.5 flex items-center justify-between text-slate-700">
                    <span className="font-medium">1. 采购入库单凭证</span>
                    <span className="font-mono text-slate-900 font-bold">INB-20261016-0082</span>
                    <span className="text-slate-500">经办验收：{selectedItemForTrace.checker || '王宇轩技师'}</span>
                    <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-[11px] font-bold">
                      冷链4.2℃ 验收合格
                    </span>
                  </div>

                  <div className="p-2.5 flex items-center justify-between text-slate-700">
                    <span className="font-medium">2. 供应商发货同行单</span>
                    <span className="font-mono text-slate-900 font-bold">THD-20261015-9921</span>
                    <span className="text-slate-500">供货商：{selectedItemForTrace.supplier}</span>
                    <span className="text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded text-[11px]">
                      双人双签核对完成
                    </span>
                  </div>

                  <div className="p-2.5 flex items-center justify-between text-slate-700">
                    <span className="font-medium">3. 医疗器械注册证核准</span>
                    <span className="font-mono text-slate-900 font-bold">国械注进20212400388</span>
                    <span className="text-slate-500">生产商：{selectedItemForTrace.manufacturer}</span>
                    <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-[11px]">
                      效期在用 (有效)
                    </span>
                  </div>
                </div>
              </div>

              {/* 实时消耗与账实一致性比对 */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 space-y-1.5">
                <div className="flex items-center justify-between font-medium">
                  <span>三级公立医院耗材核算指标判定</span>
                  <span className="text-emerald-600 font-bold">账实核对无差异 (误差率 0.00%)</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  当前批号试剂自入库以来，已在 Cobas 8000 生化分析仪正常消耗 4 盒 (4×250T)，机上实测理论损耗差额控制在 0.5% 内，符合临床实验室试剂精细化管理与医保DRG控费核算要求。
                </p>
              </div>
            </div>

            {/* 弹窗底部 */}
            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={() => {
                  showNotice(`已打印【${selectedItemForTrace.name}】批次流转溯源卡凭单`);
                }}
                className="px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-700 hover:bg-slate-100 flex items-center gap-1"
              >
                <Printer className="w-3.5 h-3.5 text-slate-500" />
                <span>打印溯源凭单</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedItemForTrace(null)}
                className="px-4 py-1.5 bg-[#1890ff] hover:bg-blue-600 text-white rounded font-medium shadow-2xs"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== 弹窗：导出报表配置 ===================== */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-300 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between">
              <div className="font-bold text-sm flex items-center gap-2">
                <Download className="w-4 h-4 text-sky-400" />
                <span>导出试剂统计分析报表</span>
              </div>
              <button
                type="button"
                onClick={() => setIsExportModalOpen(false)}
                className="text-white/70 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3.5 text-xs text-slate-800">
              <div className="p-3 bg-blue-50/80 border border-blue-200 rounded-lg space-y-1">
                <div className="font-bold text-slate-900">报表名称：{currentReportMeta.name}</div>
                <div className="text-slate-600">所属院区：{hospitalUnit} · 当前库房：{currentWarehouse}</div>
                <div className="text-slate-500 text-[11px] font-mono">统计区间：2026-10-01 ~ 2026-10-31 · 包含条数：{displayList.length} 条</div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">导出格式选择</label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded border border-[#1890ff] bg-blue-50/60 font-semibold text-blue-900 flex items-center justify-between">
                    <span>Excel 工作簿 (.xlsx)</span>
                    <Check className="w-4 h-4 text-[#1890ff]" />
                  </div>
                  <div className="p-2.5 rounded border border-slate-200 bg-slate-50 text-slate-700 flex items-center justify-between">
                    <span>PDF 审计归档版 (.pdf)</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-1 border-t border-slate-100">
                <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded text-[#1890ff]" />
                  <span>包含批号冷链验收与供应商资质明细</span>
                </label>
                <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded text-[#1890ff]" />
                  <span>生成电子数字水印与主任复核签章位</span>
                </label>
              </div>
            </div>

            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setIsExportModalOpen(false)}
                className="px-4 py-1.5 bg-white border border-slate-300 rounded text-slate-700 hover:bg-slate-100"
              >
                取消
              </button>
              <button
                type="button"
                onClick={() => {
                  showNotice(`已成功导出【${currentReportMeta.name}】数据文件 (Excel: ${displayList.length} 条)`);
                  setIsExportModalOpen(false);
                }}
                className="px-5 py-1.5 bg-[#1890ff] hover:bg-blue-600 text-white font-medium rounded shadow-2xs flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>确认导出</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

