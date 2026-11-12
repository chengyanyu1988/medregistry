import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Printer,
  ChevronDown,
  ChevronRight,
  Plus,
  RotateCcw,
  ShieldCheck,
  FileText,
  User,
  Building2,
  Activity,
  Layers,
  Sparkles,
  PhoneCall,
  Check,
  X,
  Sliders,
  ExternalLink,
  Table2,
  ChevronLeft,
  Save
} from './MenuIcon';
import { UserProfile } from '../types/navigation';

interface TestItem {
  id: string;
  code: string;
  name: string;
  result: string;
  status: 'normal' | 'high' | 'low' | 'crisis';
  statusText: string;
  unit: string;
  reference: string;
  prevResult?: string;
  prevStatus?: string;
  prevDate?: string;
  repeatResult?: string;
}

interface TestGroup {
  id: string;
  groupName: string;
  isPaid: boolean;
  totalCount: number;
  items: TestItem[];
  collapsed?: boolean;
}

interface SpecimenDossier {
  id: number;
  sampleNo: string;
  status: '未出' | '待审' | '已审' | '已发';
  isCrisis: boolean;
  isUrgent: boolean;
  isRepeat: boolean;
  patientName: string;
  gender: '男' | '女';
  age: number;
  recordNo: string;
  department: string;
  bedNo: string;
  patientType: '住院' | '门诊' | '急诊' | '体检';
  sampleType: string;
  sampleAppearance: string;
  barcode: string;
  appliedProjects: string;
  applyDoctor: string;
  techDoctor: string;
  auditDoctor: string;
  applyTime: string;
  sampleTime: string;
  deliveryTime: string;
  checkInTime: string;
  auditTime: string;
  clinicalDiagnosis: string;
  clinicalRemark: string;
  testGroups: TestGroup[];
  conclusion: string;
}

const INITIAL_SPECIMENS: SpecimenDossier[] = [
  {
    id: 1,
    sampleNo: '1',
    status: '待审',
    isCrisis: true,
    isUrgent: true,
    isRepeat: true,
    patientName: '周振海',
    gender: '男',
    age: 58,
    recordNo: '20261027001',
    department: '心血管内科',
    bedNo: '16',
    patientType: '住院',
    sampleType: '血浆(枸橼酸钠)',
    sampleAppearance: '外观正常',
    barcode: '202610270012838',
    appliedProjects: '凝血五项 + 肝功五项',
    applyDoctor: '王建平',
    techDoctor: '李海燕',
    auditDoctor: '赵明远',
    applyTime: '2026-10-27 08:30:15',
    sampleTime: '2026-10-27 08:45:22',
    deliveryTime: '2026-10-27 09:10:05',
    checkInTime: '2026-10-27 09:18:40',
    auditTime: '待审核',
    clinicalDiagnosis: '冠状动脉粥样硬化性心脏病伴持续性心房颤动，长期口服华法林抗凝',
    clinicalRemark: '术前常规凝血功能及肝脏代谢评估，注意监测INR危急值',
    conclusion: '【智能辅助提示】凝血酶原时间(PT)及国际标准化比值(PT-INR: 4.50)显著延长，达危急值预警上限(阈值≥4.0)；APTT延长；Fib偏低。提示患者处于严重低凝状态，出血风险极高，已建议立即报告主管医生！',
    testGroups: [
      {
        id: 'group-coag',
        groupName: '凝血五项(已收费)',
        isPaid: true,
        totalCount: 5,
        collapsed: false,
        items: [
          {
            id: 'pt',
            code: 'PT',
            name: '凝血酶原时间',
            result: '22.5',
            status: 'high',
            statusText: '↑',
            unit: '秒',
            reference: '9.0 - 14.0',
            prevResult: '13.1',
            prevStatus: '正常',
            prevDate: '2026-10-20',
            repeatResult: '22.4'
          },
          {
            id: 'pt-inr',
            code: 'PT-INR',
            name: '国际标准化比值',
            result: '4.50',
            status: 'crisis',
            statusText: '危 ↑↑',
            unit: '-',
            reference: '0.76 - 1.16',
            prevResult: '1.15',
            prevStatus: '正常',
            prevDate: '2026-10-20',
            repeatResult: '4.52'
          },
          {
            id: 'aptt',
            code: 'APTT',
            name: '活化部分凝血活酶',
            result: '52.0',
            status: 'high',
            statusText: '↑',
            unit: '秒',
            reference: '20.5 - 32.7',
            prevResult: '28.2',
            prevStatus: '正常',
            prevDate: '2026-10-20',
            repeatResult: '51.8'
          },
          {
            id: 'tt',
            code: 'TT',
            name: '凝血酶时间',
            result: '19.04',
            status: 'normal',
            statusText: '-',
            unit: '秒',
            reference: '14.0 - 21.0',
            prevResult: '16.5',
            prevStatus: '正常',
            prevDate: '2026-10-20'
          },
          {
            id: 'fib',
            code: 'Fib',
            name: '纤维蛋白原',
            result: '1.85',
            status: 'low',
            statusText: '↓',
            unit: 'g/L',
            reference: '2.0 - 4.0',
            prevResult: '2.80',
            prevStatus: '正常',
            prevDate: '2026-10-20',
            repeatResult: '1.86'
          }
        ]
      },
      {
        id: 'group-liver',
        groupName: '肝功五项(已收费)',
        isPaid: true,
        totalCount: 5,
        collapsed: false,
        items: [
          {
            id: 'tbil',
            code: 'TBIL',
            name: '总胆红素',
            result: '18.2',
            status: 'normal',
            statusText: '-',
            unit: 'μmol/L',
            reference: '3.4 - 20.5',
            prevResult: '15.0',
            prevStatus: '正常',
            prevDate: '2026-10-20'
          },
          {
            id: 'tp',
            code: 'TP',
            name: '总蛋白',
            result: '68.5',
            status: 'normal',
            statusText: '-',
            unit: 'g/L',
            reference: '65.0 - 85.0',
            prevResult: '71.2',
            prevStatus: '正常',
            prevDate: '2026-10-20'
          },
          {
            id: 'alb',
            code: 'ALB',
            name: '白蛋白',
            result: '38.2',
            status: 'low',
            statusText: '↓',
            unit: 'g/L',
            reference: '40.0 - 55.0',
            prevResult: '42.5',
            prevStatus: '正常',
            prevDate: '2026-10-20'
          },
          {
            id: 'aig',
            code: 'A/G',
            name: '白球比',
            result: '1.26',
            status: 'normal',
            statusText: '-',
            unit: '-',
            reference: '1.20 - 2.40',
            prevResult: '1.45',
            prevStatus: '正常',
            prevDate: '2026-10-20'
          },
          {
            id: 'che',
            code: 'CHE',
            name: '胆碱酯酶',
            result: '6520',
            status: 'normal',
            statusText: '-',
            unit: 'U/L',
            reference: '5000 - 12000',
            prevResult: '6800',
            prevStatus: '正常',
            prevDate: '2026-10-20'
          }
        ]
      }
    ]
  },
  {
    id: 2,
    sampleNo: '2',
    status: '待审',
    isCrisis: false,
    isUrgent: false,
    isRepeat: true,
    patientName: '陆美兰',
    gender: '女',
    age: 46,
    recordNo: '20261027002',
    department: '肾内科',
    bedNo: '08',
    patientType: '住院',
    sampleType: '血清',
    sampleAppearance: '外观正常',
    barcode: '202610270012839',
    appliedProjects: '肾功能四项 + 电解质',
    applyDoctor: '陈立群',
    techDoctor: '李海燕',
    auditDoctor: '赵明远',
    applyTime: '2026-10-27 08:35:10',
    sampleTime: '2026-10-27 08:50:00',
    deliveryTime: '2026-10-27 09:12:40',
    checkInTime: '2026-10-27 09:20:15',
    auditTime: '待审核',
    clinicalDiagnosis: '慢性肾小球肾炎，肾功能代偿期',
    clinicalRemark: '定期随访肌酐与血钾浓度',
    conclusion: '【智能辅助提示】血清肌酐轻度升高，尿素氮及尿酸在正常范围，血钾稳定。',
    testGroups: [
      {
        id: 'group-renal',
        groupName: '肾功能四项(已收费)',
        isPaid: true,
        totalCount: 4,
        collapsed: false,
        items: [
          {
            id: 'crea',
            code: 'CREA',
            name: '肌酐 (酶法)',
            result: '118.0',
            status: 'high',
            statusText: '↑',
            unit: 'μmol/L',
            reference: '45.0 - 84.0',
            prevResult: '115.0',
            prevStatus: '偏高',
            prevDate: '2026-10-15',
            repeatResult: '117.5'
          },
          {
            id: 'bun',
            code: 'BUN',
            name: '尿素氮',
            result: '7.2',
            status: 'normal',
            statusText: '-',
            unit: 'mmol/L',
            reference: '3.1 - 8.0',
            prevResult: '6.9',
            prevStatus: '正常',
            prevDate: '2026-10-15'
          },
          {
            id: 'ua',
            code: 'UA',
            name: '尿酸',
            result: '345',
            status: 'normal',
            statusText: '-',
            unit: 'μmol/L',
            reference: '150 - 360',
            prevResult: '330',
            prevStatus: '正常',
            prevDate: '2026-10-15'
          },
          {
            id: 'egfr',
            code: 'eGFR',
            name: '估算肾小球滤过率',
            result: '54.2',
            status: 'low',
            statusText: '↓',
            unit: 'mL/min',
            reference: '> 90',
            prevResult: '56.0',
            prevStatus: '偏低',
            prevDate: '2026-10-15'
          }
        ]
      }
    ]
  },
  {
    id: 3,
    sampleNo: '3',
    status: '已审',
    isCrisis: true,
    isUrgent: false,
    isRepeat: false,
    patientName: '孙立伟',
    gender: '男',
    age: 63,
    recordNo: '20261027003',
    department: '急诊科',
    bedNo: '22',
    patientType: '急诊',
    sampleType: '血清',
    sampleAppearance: '外观正常',
    barcode: '202610270012840',
    appliedProjects: '心肌标志物三项',
    applyDoctor: '张先义',
    techDoctor: '李海燕',
    auditDoctor: '赵明远',
    applyTime: '2026-10-27 08:20:00',
    sampleTime: '2026-10-27 08:26:15',
    deliveryTime: '2026-10-27 08:35:40',
    checkInTime: '2026-10-27 08:42:00',
    auditTime: '2026-10-27 09:05:12',
    clinicalDiagnosis: '急性非ST段抬高型心肌梗死，剧烈胸痛3小时',
    clinicalRemark: '急查超敏肌钙蛋白，绿色通道已上机',
    conclusion: '【危急值闭环报告】超敏肌钙蛋白I (hs-cTnI) 极度升高，达危急值标准。已电话通知急诊科张先义主治医师，记录于危急值登记册。',
    testGroups: [
      {
        id: 'group-cardiac',
        groupName: '心肌损伤三项(已收费)',
        isPaid: true,
        totalCount: 3,
        collapsed: false,
        items: [
          {
            id: 'ctni',
            code: 'hs-cTnI',
            name: '超敏肌钙蛋白I',
            result: '1850.5',
            status: 'crisis',
            statusText: '危 ↑↑',
            unit: 'pg/mL',
            reference: '0.0 - 26.2',
            prevResult: '15.2',
            prevStatus: '正常',
            prevDate: '2026-09-10'
          },
          {
            id: 'ckmb',
            code: 'CK-MB mass',
            name: '肌酸激酶同工酶质量',
            result: '34.8',
            status: 'high',
            statusText: '↑',
            unit: 'ng/mL',
            reference: '0.0 - 5.0',
            prevResult: '2.1',
            prevStatus: '正常',
            prevDate: '2026-09-10'
          },
          {
            id: 'myo',
            code: 'Myo',
            name: '肌红蛋白',
            result: '142.0',
            status: 'high',
            statusText: '↑',
            unit: 'ng/mL',
            reference: '0.0 - 70.0',
            prevResult: '32.0',
            prevStatus: '正常',
            prevDate: '2026-09-10'
          }
        ]
      }
    ]
  },
  {
    id: 4,
    sampleNo: '4',
    status: '已发',
    isCrisis: false,
    isUrgent: false,
    isRepeat: false,
    patientName: '陈志明',
    gender: '男',
    age: 39,
    recordNo: '20261027004',
    department: '消化内科',
    bedNo: '03',
    patientType: '住院',
    sampleType: '血清',
    sampleAppearance: '外观正常',
    barcode: '202610270012841',
    appliedProjects: '乙肝五项定量检测',
    applyDoctor: '郭海生',
    techDoctor: '李海燕',
    auditDoctor: '赵明远',
    applyTime: '2026-10-27 07:45:00',
    sampleTime: '2026-10-27 08:00:20',
    deliveryTime: '2026-10-27 08:25:10',
    checkInTime: '2026-10-27 08:35:00',
    auditTime: '2026-10-27 09:00:30',
    clinicalDiagnosis: '乙型病毒性肝炎携带状态随访',
    clinicalRemark: '化学发光法微量滴定分析',
    conclusion: '【报告已发布】HBsAg阳性，HBeAb阳性，HBcAb阳性，符合小三阳血清学模式。',
    testGroups: [
      {
        id: 'group-hbv',
        groupName: '乙肝五项定量(已收费)',
        isPaid: true,
        totalCount: 5,
        collapsed: false,
        items: [
          {
            id: 'hbsag',
            code: 'HBsAg',
            name: '乙型肝炎表面抗原',
            result: '1250.00',
            status: 'high',
            statusText: '↑',
            unit: 'IU/mL',
            reference: '< 0.05'
          },
          {
            id: 'hbsab',
            code: 'HBsAb',
            name: '乙型肝炎表面抗体',
            result: '1.20',
            status: 'normal',
            statusText: '-',
            unit: 'mIU/mL',
            reference: '0.00 - 10.00'
          },
          {
            id: 'hbeag',
            code: 'HBeAg',
            name: '乙型肝炎e抗原',
            result: '0.31',
            status: 'normal',
            statusText: '-',
            unit: 'S/CO',
            reference: '< 1.00'
          },
          {
            id: 'hbeab',
            code: 'HBeAb',
            name: '乙型肝炎e抗体',
            result: '0.02',
            status: 'normal',
            statusText: '阳性',
            unit: 'S/CO',
            reference: '> 1.00'
          },
          {
            id: 'hbcab',
            code: 'HBcAb',
            name: '乙型肝炎核心抗体',
            result: '0.01',
            status: 'normal',
            statusText: '阳性',
            unit: 'S/CO',
            reference: '> 1.00'
          }
        ]
      }
    ]
  },
  {
    id: 5,
    sampleNo: '5',
    status: '未出',
    isCrisis: false,
    isUrgent: true,
    isRepeat: false,
    patientName: '林素华',
    gender: '女',
    age: 52,
    recordNo: '20261027005',
    department: '普外科',
    bedNo: '12',
    patientType: '住院',
    sampleType: '血浆',
    sampleAppearance: '外观正常',
    barcode: '202610270012842',
    appliedProjects: '术前凝血常规四项',
    applyDoctor: '杜文斌',
    techDoctor: '李海燕',
    auditDoctor: '赵明远',
    applyTime: '2026-10-27 09:05:00',
    sampleTime: '2026-10-27 09:15:30',
    deliveryTime: '2026-10-27 09:22:10',
    checkInTime: '2026-10-27 09:28:40',
    auditTime: '未完成',
    clinicalDiagnosis: '胆囊结石伴慢性胆囊炎，拟行腹腔镜胆囊切除术',
    clinicalRemark: '急查！请在上午10:00前完成审核',
    conclusion: '【仪器测定中】希森美康 CS-5100 正在执行加样比色，预计剩余时间 3 分钟。',
    testGroups: [
      {
        id: 'group-pre-op',
        groupName: '术前凝血常规(已收费)',
        isPaid: true,
        totalCount: 4,
        collapsed: false,
        items: [
          {
            id: 'pt5',
            code: 'PT',
            name: '凝血酶原时间',
            result: '11.8',
            status: 'normal',
            statusText: '-',
            unit: '秒',
            reference: '9.0 - 14.0'
          },
          {
            id: 'inr5',
            code: 'PT-INR',
            name: '国际标准化比值',
            result: '1.02',
            status: 'normal',
            statusText: '-',
            unit: '-',
            reference: '0.76 - 1.16'
          },
          {
            id: 'aptt5',
            code: 'APTT',
            name: '活化部分凝血活酶',
            result: '27.4',
            status: 'normal',
            statusText: '-',
            unit: '秒',
            reference: '20.5 - 32.7'
          },
          {
            id: 'fib5',
            code: 'Fib',
            name: '纤维蛋白原',
            result: '3.12',
            status: 'normal',
            statusText: '-',
            unit: 'g/L',
            reference: '2.0 - 4.0'
          }
        ]
      }
    ]
  },
  {
    id: 6,
    sampleNo: '6',
    status: '待审',
    isCrisis: false,
    isUrgent: false,
    isRepeat: false,
    patientName: '张德民',
    gender: '男',
    age: 67,
    recordNo: '20261027006',
    department: '内分泌科',
    bedNo: '31',
    patientType: '住院',
    sampleType: '全血',
    sampleAppearance: '外观正常',
    barcode: '202610270012843',
    appliedProjects: '糖化血红蛋白HPLC分析',
    applyDoctor: '袁敏',
    techDoctor: '李海燕',
    auditDoctor: '赵明远',
    applyTime: '2026-10-27 08:15:00',
    sampleTime: '2026-10-27 08:32:00',
    deliveryTime: '2026-10-27 08:55:10',
    checkInTime: '2026-10-27 09:05:00',
    auditTime: '待审核',
    clinicalDiagnosis: '2型糖尿病伴多发周围神经病变',
    clinicalRemark: '离子交换高效液相色谱法(HPLC)检测',
    conclusion: '【智能辅助提示】HbA1c 8.4%，提示近2-3个月平均血糖控制不佳。',
    testGroups: [
      {
        id: 'group-hba1c',
        groupName: '糖代谢监测(已收费)',
        isPaid: true,
        totalCount: 2,
        collapsed: false,
        items: [
          {
            id: 'hba1c',
            code: 'HbA1c',
            name: '糖化血红蛋白',
            result: '8.4',
            status: 'high',
            statusText: '↑',
            unit: '%',
            reference: '4.0 - 6.0',
            prevResult: '7.8',
            prevStatus: '偏高',
            prevDate: '2026-07-12'
          },
          {
            id: 'eag',
            code: 'eAG',
            name: '估算平均血糖',
            result: '10.8',
            status: 'high',
            statusText: '↑',
            unit: 'mmol/L',
            reference: '3.9 - 6.1',
            prevResult: '9.8',
            prevStatus: '偏高',
            prevDate: '2026-07-12'
          }
        ]
      }
    ]
  }
];

interface ClinicalLabWorkstationViewProps {
  user: UserProfile;
  triggerAction: (msg: string) => void;
}

export const ClinicalLabWorkstationView: React.FC<ClinicalLabWorkstationViewProps> = ({
  user,
  triggerAction,
}) => {
  // Specimen List State
  const [specimens, setSpecimens] = useState<SpecimenDossier[]>(INITIAL_SPECIMENS);
  const [selectedSampleId, setSelectedSampleId] = useState<number>(1);

  // Filter States
  const [auditFilter, setAuditFilter] = useState<'all' | 'pending' | 'audited'>('pending');
  const [selectedChannel, setSelectedChannel] = useState<'manual' | 'auto1' | 'auto2'>('manual');
  const [workDate, setWorkDate] = useState('2026-10-27');
  const [scanInput, setScanInput] = useState('');
  const [keyword, setKeyword] = useState('');

  // Selected item checkboxes in right table
  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>({
    pt: true,
    'pt-inr': true,
    aptt: true,
    tt: true,
    fib: true,
    tbil: true,
    tp: true,
    alb: true,
    aig: true,
    che: true
  });

  // Expand / collapse for conclusion
  const [conclusionExpanded, setConclusionExpanded] = useState<boolean>(true);

  // Crisis alert popup visible
  const [showCrisisToast, setShowCrisisToast] = useState<boolean>(true);
  const [showCrisisModal, setShowCrisisModal] = useState<boolean>(false);
  const [crisisCallDoctor, setCrisisCallDoctor] = useState('王建平');
  const [crisisPhoneNote, setCrisisPhoneNote] = useState('已电话通知心血管内科护士站及王建平主任，告知PT-INR 4.50危急值，医生已知悉并指导患者停用华法林。');

  // Manual Sample Add Modal
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showResultModal, setShowResultModal] = useState<boolean>(false);
  const [newPatientName, setNewPatientName] = useState('徐志华');
  const [newSampleType, setNewSampleType] = useState('血清');
  const [newDepartment, setNewDepartment] = useState('急诊科');

  // Currently Selected Dossier
  const currentSpecimen = useMemo(() => {
    return specimens.find((s) => s.id === selectedSampleId) || specimens[0];
  }, [specimens, selectedSampleId]);

  // Filtered List
  const filteredSpecimens = useMemo(() => {
    return specimens.filter((s) => {
      if (auditFilter === 'pending' && s.status !== '待审') return false;
      if (auditFilter === 'audited' && (s.status !== '已审' && s.status !== '已发')) return false;

      if (keyword.trim()) {
        const q = keyword.trim().toLowerCase();
        const matchesName = s.patientName.toLowerCase().includes(q);
        const matchesNo = s.sampleNo.toLowerCase().includes(q);
        const matchesBarcode = s.barcode.toLowerCase().includes(q);
        const matchesDept = s.department.toLowerCase().includes(q);
        if (!matchesName && !matchesNo && !matchesBarcode && !matchesDept) return false;
      }

      return true;
    });
  }, [specimens, auditFilter, keyword]);

  // Modal navigation index
  const currentSpecIndex = useMemo(() => {
    return filteredSpecimens.findIndex((s) => s.id === selectedSampleId);
  }, [filteredSpecimens, selectedSampleId]);

  const handlePrevSpecimen = () => {
    if (currentSpecIndex > 0) {
      setSelectedSampleId(filteredSpecimens[currentSpecIndex - 1].id);
    }
  };

  const handleNextSpecimen = () => {
    if (currentSpecIndex < filteredSpecimens.length - 1) {
      setSelectedSampleId(filteredSpecimens[currentSpecIndex + 1].id);
    }
  };

  // Handle Scan or Jump
  const handleQuickLocate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scanInput.trim()) return;
    const target = specimens.find(
      (s) =>
        s.sampleNo === scanInput.trim() ||
        s.barcode === scanInput.trim() ||
        s.patientName === scanInput.trim()
    );
    if (target) {
      setSelectedSampleId(target.id);
      triggerAction(`已定位至标本号 ${target.sampleNo} (患者: ${target.patientName})`);
      setScanInput('');
    } else {
      triggerAction(`未查找到标本号或条码: ${scanInput}`);
    }
  };

  // Audit Action
  const handleAudit = () => {
    setSpecimens((prev) =>
      prev.map((s) =>
        s.id === currentSpecimen.id
          ? {
              ...s,
              status: '已审',
              auditDoctor: user.name || '赵明远',
              auditTime: '2026-10-27 ' + new Date().toLocaleTimeString('zh-CN', { hour12: false })
            }
          : s
      )
    );
    triggerAction(`标本号 ${currentSpecimen.sampleNo} (${currentSpecimen.patientName}) 已审核发布！`);
  };

  // Cancel Audit
  const handleUnAudit = () => {
    setSpecimens((prev) =>
      prev.map((s) =>
        s.id === currentSpecimen.id
          ? {
              ...s,
              status: '待审',
              auditTime: '待审核'
            }
          : s
      )
    );
    triggerAction(`标本号 ${currentSpecimen.sampleNo} (${currentSpecimen.patientName}) 已撤销审核为待审状态`);
  };

  // Toggle Repeat Test
  const handleToggleRepeat = () => {
    setSpecimens((prev) =>
      prev.map((s) =>
        s.id === currentSpecimen.id
          ? {
              ...s,
              isRepeat: !s.isRepeat
            }
          : s
      )
    );
    triggerAction(
      !currentSpecimen.isRepeat
        ? `标本号 ${currentSpecimen.sampleNo} 已标记【复检】，指令已下发流水线！`
        : `已取消标本号 ${currentSpecimen.sampleNo} 的复检标记`
    );
  };

  // Save Results Modification
  const handleSaveResults = () => {
    triggerAction(`已保存标本号 ${currentSpecimen.sampleNo} 当前项目录入值及修改记录`);
  };

  // Inline Result Editing
  const handleResultChange = (groupId: string, itemId: string, newVal: string) => {
    setSpecimens((prev) =>
      prev.map((s) => {
        if (s.id !== currentSpecimen.id) return s;
        return {
          ...s,
          testGroups: s.testGroups.map((g) => {
            if (g.id !== groupId) return g;
            return {
              ...g,
              items: g.items.map((item) => {
                if (item.id !== itemId) return item;
                const num = parseFloat(newVal);
                let st = item.status;
                let stText = item.statusText;
                if (!isNaN(num)) {
                  if (item.code === 'PT-INR') {
                    if (num >= 4.0) {
                      st = 'crisis';
                      stText = '危 ↑↑';
                    } else if (num > 1.16) {
                      st = 'high';
                      stText = '↑';
                    } else if (num < 0.76) {
                      st = 'low';
                      stText = '↓';
                    } else {
                      st = 'normal';
                      stText = '-';
                    }
                  }
                }
                return {
                  ...item,
                  result: newVal,
                  status: st,
                  statusText: stText
                };
              })
            };
          })
        };
      })
    );
  };

  // Toggle Group Collapse
  const toggleGroupCollapse = (groupId: string) => {
    setSpecimens((prev) =>
      prev.map((s) => {
        if (s.id !== currentSpecimen.id) return s;
        return {
          ...s,
          testGroups: s.testGroups.map((g) =>
            g.id === groupId ? { ...g, collapsed: !g.collapsed } : g
          )
        };
      })
    );
  };

  // Toggle Select All for a Group
  const toggleGroupSelect = (group: TestGroup, checked: boolean) => {
    const updated = { ...selectedItems };
    group.items.forEach((it) => {
      updated[it.id] = checked;
    });
    setSelectedItems(updated);
  };

  // Add Manual Sample
  const handleAddManualSample = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = specimens.length + 1;
    const newSpecimen: SpecimenDossier = {
      id: newId,
      sampleNo: String(newId),
      status: '待审',
      isCrisis: false,
      isUrgent: false,
      isRepeat: false,
      patientName: newPatientName.trim() || '李春雷',
      gender: '男',
      age: 38,
      recordNo: `2026102700${newId}`,
      department: newDepartment,
      bedNo: '加02',
      patientType: '住院',
      sampleType: newSampleType,
      sampleAppearance: '外观正常',
      barcode: `2026102700128${40 + newId}`,
      appliedProjects: '电解质六项 (手工加测)',
      applyDoctor: '钱伟国',
      techDoctor: user.name || '李海燕',
      auditDoctor: '赵明远',
      applyTime: '2026-10-27 09:30:00',
      sampleTime: '2026-10-27 09:35:10',
      deliveryTime: '2026-10-27 09:42:00',
      checkInTime: '2026-10-27 09:48:30',
      auditTime: '待审核',
      clinicalDiagnosis: '门急诊手工急加标本',
      clinicalRemark: '常规生化复核',
      conclusion: '【手工登记】电解质在控正常。',
      testGroups: [
        {
          id: `group-elec-${newId}`,
          groupName: '电解质六项(手工)',
          isPaid: true,
          totalCount: 3,
          collapsed: false,
          items: [
            {
              id: `k-${newId}`,
              code: 'K+',
              name: '血清钾',
              result: '4.2',
              status: 'normal',
              statusText: '-',
              unit: 'mmol/L',
              reference: '3.5 - 5.3'
            },
            {
              id: `na-${newId}`,
              code: 'Na+',
              name: '血清钠',
              result: '141.0',
              status: 'normal',
              statusText: '-',
              unit: 'mmol/L',
              reference: '137 - 147'
            },
            {
              id: `cl-${newId}`,
              code: 'Cl-',
              name: '血清氯',
              result: '102.5',
              status: 'normal',
              statusText: '-',
              unit: 'mmol/L',
              reference: '99 - 110'
            }
          ]
        }
      ]
    };

    setSpecimens([newSpecimen, ...specimens]);
    setSelectedSampleId(newId);
    setShowAddModal(false);
    triggerAction(`手工标本已录入！标本号: ${newId}，患者: ${newSpecimen.patientName}`);
  };

  // Crisis Complete Action
  const handleCompleteCrisis = () => {
    setShowCrisisModal(false);
    setShowCrisisToast(false);
    triggerAction(`危急值闭环已上报！接听人: ${crisisCallDoctor}，记录已归档至院内危急值管理中心。`);
  };

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-slate-100 font-sans select-none overflow-hidden text-xs">
      {/* 1. Top Global Filter & Quick Locating Bar (顶部全局工具条) */}
      <div className="bg-white border-b border-slate-200 px-3 py-1.5 flex flex-wrap items-center justify-between gap-2 shrink-0 shadow-2xs">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Status Tabs: 待审 / 已审 / 全部 */}
          <div className="inline-flex rounded bg-slate-100 p-0.5 border border-slate-200">
            <button
              onClick={() => setAuditFilter('pending')}
              className={`px-3 py-1 rounded font-medium transition-colors flex items-center gap-1.5 ${
                auditFilter === 'pending'
                  ? 'bg-sky-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>待审</span>
              <span className="px-1.5 py-0.2 bg-white/20 text-white rounded-full text-[10px] font-mono">
                {specimens.filter((s) => s.status === '待审').length}
              </span>
            </button>
            <button
              onClick={() => setAuditFilter('audited')}
              className={`px-3 py-1 rounded font-medium transition-colors flex items-center gap-1.5 ${
                auditFilter === 'audited'
                  ? 'bg-sky-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>已审</span>
            </button>
            <button
              onClick={() => setAuditFilter('all')}
              className={`px-3 py-1 rounded font-medium transition-colors flex items-center gap-1.5 ${
                auditFilter === 'all'
                  ? 'bg-sky-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Table2 className="w-3.5 h-3.5" />
              <span>全部</span>
            </button>
          </div>

          <div className="h-4 w-px bg-slate-200" />

          {/* Channel Selector */}
          <div className="flex items-center gap-1">
            <span className="text-slate-400">通道:</span>
            <select
              value={selectedChannel}
              onChange={(e) => setSelectedChannel(e.target.value as any)}
              className="bg-slate-50 border border-slate-300 rounded px-2 py-1 text-slate-800 text-xs focus:ring-1 focus:ring-sky-500 font-medium"
            >
              <option value="manual">手工工作台</option>
              <option value="auto1">全自动流水线 01 (罗氏 Cobas 8000)</option>
              <option value="auto2">希森美康 CS-5100 凝血分析仪</option>
            </select>
          </div>

          {/* Date Picker (Recent Date 2026-10-27) */}
          <div className="flex items-center gap-1">
            <span className="text-slate-400">日期:</span>
            <input
              type="date"
              value={workDate}
              onChange={(e) => setWorkDate(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded px-2 py-0.5 text-slate-800 font-mono text-xs focus:ring-1 focus:ring-sky-500"
            />
          </div>

          {/* Quick Barcode or Sample No Scanner */}
          <form onSubmit={handleQuickLocate} className="flex items-center gap-1">
            <input
              type="text"
              placeholder="输入/扫描条码号核收 (回车)"
              value={scanInput}
              onChange={(e) => setScanInput(e.target.value)}
              className="w-48 bg-slate-50 border border-slate-300 rounded px-2 py-1 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            />
            <button
              type="submit"
              className="px-2 py-1 bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 rounded font-medium transition-colors"
            >
              定位
            </button>
          </form>

          {/* + 手工登记按钮 */}
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-medium shadow-2xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+手工</span>
          </button>
        </div>

        {/* Right Status Badge */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-1.5 text-slate-500 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>LIS 双向通信正常</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 bg-slate-100 rounded border border-slate-200 text-slate-700">
            <User className="w-3.5 h-3.5 text-sky-600" />
            <span>审核人: <strong className="text-slate-900">{user.name || '赵明远'}</strong></span>
            <span className="px-1 bg-emerald-100 text-emerald-700 text-[10px] rounded">主治/主管</span>
          </div>
        </div>
      </div>

      {/* 2. Main Workstation Body: Full Width Table + Result Modal */}
      <div className="flex-1 min-h-0 p-3 overflow-hidden flex flex-col">
        {/* Full-Width Specimen Queue Table */}
        <div className="flex-1 flex flex-col h-full min-h-0 bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
          {/* Top Quick Search in Table */}
          <div className="px-3 py-2 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-800 text-xs">检验工作站 - 待检/已检标本队列</span>
              <span className="px-2 py-0.5 rounded-full text-[11px] bg-slate-200/80 text-slate-700 font-mono">
                {filteredSpecimens.length} 份标本
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
                <input
                  type="text"
                  placeholder="检索姓名/标本号/病历号/条码"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-56 pl-8 pr-2.5 py-1 bg-white border border-slate-300 rounded text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500"
                />
              </div>
              <button
                onClick={() => {
                  setKeyword('');
                  triggerAction('标本列表已刷新');
                }}
                className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded"
                title="刷新列表"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="flex-1 min-h-0 overflow-auto">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead className="bg-slate-100/90 sticky top-0 z-10 text-slate-600 border-b border-slate-200 select-none text-[11px]">
                <tr>
                  <th className="px-3 py-2.5 font-medium">样本号</th>
                  <th className="px-3 py-2.5 font-medium">状态</th>
                  <th className="px-2 py-2.5 font-medium text-center text-rose-600">危</th>
                  <th className="px-2 py-2.5 font-medium text-center text-rose-500">急</th>
                  <th className="px-2 py-2.5 font-medium text-center text-sky-600">复</th>
                  <th className="px-3 py-2.5 font-medium">患者姓名</th>
                  <th className="px-2.5 py-2.5 font-medium">性别/年龄</th>
                  <th className="px-3 py-2.5 font-medium font-mono">病历号</th>
                  <th className="px-3 py-2.5 font-medium">申请科室</th>
                  <th className="px-2 py-2.5 font-medium text-center">床号</th>
                  <th className="px-2.5 py-2.5 font-medium">就诊类型</th>
                  <th className="px-3 py-2.5 font-medium">标本类型</th>
                  <th className="px-3 py-2.5 font-medium">申请项目</th>
                  <th className="px-2.5 py-2.5 font-medium">申请医生</th>
                  <th className="px-2.5 py-2.5 font-medium">检验技师</th>
                  <th className="px-2.5 py-2.5 font-medium">审核医生</th>
                  <th className="px-3 py-2.5 font-medium">核收时间</th>
                  <th className="px-3 py-2.5 font-medium text-center">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans text-xs">
                {filteredSpecimens.length === 0 ? (
                  <tr>
                    <td colSpan={18} className="text-center py-12 text-slate-400">
                      暂无匹配的标本记录
                    </td>
                  </tr>
                ) : (
                  filteredSpecimens.map((spec) => {
                    const isSelected = spec.id === selectedSampleId;
                    return (
                      <tr
                        key={spec.id}
                        onClick={() => {
                          setSelectedSampleId(spec.id);
                          setShowResultModal(true);
                        }}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-sky-50/80 hover:bg-sky-100/70'
                            : 'hover:bg-slate-50/90 text-slate-700'
                        }`}
                      >
                        {/* 样本号 */}
                        <td className="px-3 py-2.5 font-mono font-bold text-slate-900 text-sm">
                          {spec.sampleNo}
                        </td>

                        {/* 状态 */}
                        <td className="px-3 py-2.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                              spec.status === '待审'
                                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                : spec.status === '已审'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : spec.status === '已发'
                                ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                                : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            {spec.status}
                          </span>
                        </td>

                        {/* 危急值 */}
                        <td className="px-2 py-2.5 text-center">
                          {spec.isCrisis ? (
                            <span className="inline-block px-1.5 py-0.2 bg-rose-600 text-white rounded text-[10px] font-bold animate-pulse">
                              危
                            </span>
                          ) : (
                            <span className="text-slate-300">-</span>
                          )}
                        </td>

                        {/* 急查 */}
                        <td className="px-2 py-2.5 text-center">
                          {spec.isUrgent ? (
                            <span className="inline-block px-1.5 py-0.2 bg-rose-100 text-rose-700 rounded text-[10px] font-bold border border-rose-200">
                              急
                            </span>
                          ) : (
                            <span className="text-slate-300">-</span>
                          )}
                        </td>

                        {/* 复检 */}
                        <td className="px-2 py-2.5 text-center">
                          {spec.isRepeat ? (
                            <span className="inline-block px-1.5 py-0.2 bg-sky-100 text-sky-800 rounded text-[10px] font-bold border border-sky-200">
                              复
                            </span>
                          ) : (
                            <span className="text-slate-300">-</span>
                          )}
                        </td>

                        {/* 患者姓名 */}
                        <td className="px-3 py-2.5 font-bold text-slate-900">
                          {spec.patientName}
                        </td>

                        {/* 性别/年龄 */}
                        <td className="px-2.5 py-2.5 text-slate-600">
                          {spec.gender} · {spec.age}岁
                        </td>

                        {/* 病历号 */}
                        <td className="px-3 py-2.5 font-mono text-slate-700">
                          {spec.recordNo}
                        </td>

                        {/* 申请科室 */}
                        <td className="px-3 py-2.5 font-medium text-slate-800">
                          {spec.department}
                        </td>

                        {/* 床号 */}
                        <td className="px-2 py-2.5 text-center font-mono text-slate-700">
                          {spec.bedNo}床
                        </td>

                        {/* 就诊类型 */}
                        <td className="px-2.5 py-2.5 text-slate-600">
                          <span className="px-1.5 py-0.5 bg-slate-100 rounded text-[10px]">
                            {spec.patientType}
                          </span>
                        </td>

                        {/* 标本类型 */}
                        <td className="px-3 py-2.5 text-slate-600">
                          {spec.sampleType}
                        </td>

                        {/* 申请项目 */}
                        <td className="px-3 py-2.5 font-medium text-sky-800 max-w-[180px] truncate" title={spec.appliedProjects}>
                          {spec.appliedProjects}
                        </td>

                        {/* 医生团队 */}
                        <td className="px-2.5 py-2.5 text-slate-700">{spec.applyDoctor}</td>
                        <td className="px-2.5 py-2.5 text-slate-700">{spec.techDoctor}</td>
                        <td className="px-2.5 py-2.5 text-slate-700">{spec.auditDoctor}</td>

                        {/* 核收时间 */}
                        <td className="px-3 py-2.5 font-mono text-slate-500 text-[11px]">
                          {spec.checkInTime}
                        </td>

                        {/* 操作 */}
                        <td className="px-3 py-2.5 text-center" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => {
                                setSelectedSampleId(spec.id);
                                setShowResultModal(true);
                              }}
                              className="px-2.5 py-1 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 rounded text-[11px] font-medium transition-colors flex items-center gap-1 shadow-2xs"
                            >
                              <Activity className="w-3 h-3 text-sky-600" />
                              <span>结果录入/查看</span>
                            </button>
                            {spec.status === '待审' && (
                              <button
                                onClick={() => {
                                  setSelectedSampleId(spec.id);
                                  handleAudit();
                                }}
                                className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded text-[11px] font-medium transition-colors"
                              >
                                审核
                              </button>
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

          {/* Bottom Summary Bar */}
          <div className="p-2.5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
            <div className="flex items-center gap-3">
              <span className="font-medium text-slate-700">总计: {filteredSpecimens.length} 标本</span>
              <span className="text-slate-400">·</span>
              <span className="text-amber-700 font-medium">待审: {specimens.filter((s) => s.status === '待审').length}</span>
              <span className="text-slate-400">·</span>
              <span className="text-emerald-700 font-medium">已审: {specimens.filter((s) => s.status === '已审' || s.status === '已发').length}</span>
              <span className="text-slate-400">·</span>
              <span className="text-rose-700 font-medium">危急: {specimens.filter((s) => s.isCrisis).length}</span>
              <span className="text-slate-400">·</span>
              <span className="text-slate-500 text-[11px]">点击表格任意行或“结果录入/查看”按钮即可弹窗录入检验数据与审核</span>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <span>当前选中: <strong className="text-sky-700 font-mono">#{currentSpecimen?.sampleNo}</strong></span>
              <span className="text-slate-400">|</span>
              <span>患者: <strong className="text-slate-900">{currentSpecimen?.patientName}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Result Entry & Review Modal Dialog (检验结果录入与审核弹窗) */}
      {showResultModal && currentSpecimen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-300 w-full max-w-[96vw] xl:max-w-7xl h-[92vh] flex flex-col overflow-hidden animate-scaleUp">
            {/* Modal Header */}
            <div className="px-4 py-3 bg-gradient-to-r from-slate-900 via-slate-800 to-sky-950 text-white flex items-center justify-between shrink-0 shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-sky-600/80 flex items-center justify-center text-white shadow-xs">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base text-white tracking-wide">
                      检验结果录入与审核工作台
                    </span>
                    <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-sky-500/30 text-sky-200 border border-sky-400/40">
                      样本 #{currentSpecimen.sampleNo}
                    </span>
                    <span className="font-bold text-slate-100 text-sm">
                      {currentSpecimen.patientName} ({currentSpecimen.gender} · {currentSpecimen.age}岁)
                    </span>
                    {currentSpecimen.isUrgent && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-500 text-white animate-pulse">
                        急查
                      </span>
                    )}
                    {currentSpecimen.isCrisis && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-slate-950">
                        危急值
                      </span>
                    )}
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                        currentSpecimen.status === '已审'
                          ? 'bg-emerald-500/30 text-emerald-200 border border-emerald-400/40'
                          : currentSpecimen.status === '待审'
                          ? 'bg-sky-500/30 text-sky-200 border border-sky-400/40'
                          : currentSpecimen.status === '已发'
                          ? 'bg-indigo-500/30 text-indigo-200 border border-indigo-400/40'
                          : 'bg-slate-700 text-slate-300'
                      }`}
                    >
                      {currentSpecimen.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-300 font-mono mt-0.5">
                    <span>条码: {currentSpecimen.barcode}</span>
                    <span>·</span>
                    <span>病历号: {currentSpecimen.recordNo}</span>
                    <span>·</span>
                    <span>科室: {currentSpecimen.department} {currentSpecimen.bedNo ? `(${currentSpecimen.bedNo}床)` : ''}</span>
                    <span>·</span>
                    <span>组合: {currentSpecimen.appliedProjects}</span>
                  </div>
                </div>
              </div>

              {/* Header Actions: Prev/Next pagination & Close */}
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-slate-800/80 rounded-lg p-0.5 border border-slate-700 text-xs">
                  <button
                    onClick={handlePrevSpecimen}
                    className="px-2.5 py-1 hover:bg-slate-700 text-slate-200 rounded flex items-center gap-1 transition-colors"
                    title="快捷切换上一份标本"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>上一份</span>
                  </button>
                  <span className="px-2 font-mono text-[11px] text-slate-400 border-x border-slate-700">
                    {currentSpecIndex + 1} / {filteredSpecimens.length}
                  </span>
                  <button
                    onClick={handleNextSpecimen}
                    className="px-2.5 py-1 hover:bg-slate-700 text-slate-200 rounded flex items-center gap-1 transition-colors"
                    title="快捷切换下一份标本"
                  >
                    <span>下一份</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={() => setShowResultModal(false)}
                  className="w-8 h-8 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white flex items-center justify-center transition-colors text-lg"
                  title="关闭弹窗 (Esc)"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Body Container */}
            <div className="flex-1 min-h-0 flex flex-col md:flex-row overflow-hidden bg-slate-50">
              {/* Center Column: Patient & Specimen Profile Dossier (患者及标本详情面板) */}
              <div className="w-80 bg-white border-r border-slate-200 flex flex-col shrink-0 overflow-y-auto">
          {/* Patient Card Header */}
          <div className="p-3 bg-gradient-to-r from-sky-50 to-indigo-50 border-b border-sky-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-sky-950">
                标本 #{currentSpecimen.sampleNo} 档案详情
              </span>
              {currentSpecimen.isUrgent && (
                <span className="px-1.5 py-0.2 rounded text-[10px] bg-rose-500 text-white font-bold">
                  急查标本
                </span>
              )}
            </div>
            <span className="text-[11px] font-mono text-sky-700">
              条码: {currentSpecimen.barcode}
            </span>
          </div>

          {/* Compact Form Grid (2-column layout matching screenshot) */}
          <div className="p-3 space-y-2 text-slate-700">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-slate-400">样本号</label>
                <div className="font-mono font-bold text-slate-900 text-sm bg-slate-50 px-2 py-1 rounded border border-slate-200">
                  {currentSpecimen.sampleNo}
                </div>
              </div>
              <div>
                <label className="text-[10px] text-slate-400">患者姓名</label>
                <div className="font-bold text-slate-900 text-sm bg-slate-50 px-2 py-1 rounded border border-slate-200 flex items-center justify-between">
                  <span>{currentSpecimen.patientName}</span>
                  <span className="text-xs text-slate-500 font-normal">
                    {currentSpecimen.gender} · {currentSpecimen.age}岁
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-slate-400">病历号 / 就诊号</label>
                <div className="font-mono text-slate-800 bg-slate-50 px-2 py-1 rounded border border-slate-200">
                  {currentSpecimen.recordNo}
                </div>
              </div>
              <div>
                <label className="text-[10px] text-slate-400">科室 / 床号</label>
                <div className="text-slate-800 bg-slate-50 px-2 py-1 rounded border border-slate-200 truncate">
                  {currentSpecimen.department} {currentSpecimen.bedNo}床
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-slate-400">就诊类型</label>
                <div className="text-slate-800 bg-slate-50 px-2 py-1 rounded border border-slate-200">
                  {currentSpecimen.patientType}
                </div>
              </div>
              <div>
                <label className="text-[10px] text-slate-400">样本类型 / 性状</label>
                <div className="text-slate-800 bg-slate-50 px-2 py-1 rounded border border-slate-200 truncate">
                  {currentSpecimen.sampleType} · {currentSpecimen.sampleAppearance}
                </div>
              </div>
            </div>

            <div>
              <label className="text-[10px] text-slate-400">申请检验组合</label>
              <div className="font-medium text-sky-800 bg-sky-50/60 px-2 py-1 rounded border border-sky-200">
                {currentSpecimen.appliedProjects}
              </div>
            </div>

            {/* Medical Staff */}
            <div className="pt-2 border-t border-slate-100 grid grid-cols-3 gap-1.5 text-center">
              <div className="bg-slate-50 p-1.5 rounded border border-slate-200">
                <span className="text-[10px] text-slate-400 block">申请医生</span>
                <span className="font-medium text-slate-800">{currentSpecimen.applyDoctor}</span>
              </div>
              <div className="bg-slate-50 p-1.5 rounded border border-slate-200">
                <span className="text-[10px] text-slate-400 block">检验技师</span>
                <span className="font-medium text-slate-800">{currentSpecimen.techDoctor}</span>
              </div>
              <div className="bg-slate-50 p-1.5 rounded border border-slate-200">
                <span className="text-[10px] text-slate-400 block">复核审核</span>
                <span className="font-medium text-slate-800">{currentSpecimen.auditDoctor}</span>
              </div>
            </div>

            {/* TAT Timestamps */}
            <div className="pt-2 border-t border-slate-100 space-y-1 bg-slate-50/50 p-2 rounded border border-slate-200 font-mono text-[11px]">
              <div className="text-[10px] font-sans font-bold text-slate-500 mb-1">
                标本流转 TAT 时间节点
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">申请时间:</span>
                <span className="text-slate-700">{currentSpecimen.applyTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">采样时间:</span>
                <span className="text-slate-700">{currentSpecimen.sampleTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">送检时间:</span>
                <span className="text-slate-700">{currentSpecimen.deliveryTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">核收时间:</span>
                <span className="text-slate-700">{currentSpecimen.checkInTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">审核时间:</span>
                <span className="font-semibold text-sky-700">{currentSpecimen.auditTime}</span>
              </div>
            </div>

            {/* Clinical Diagnosis & Remarks */}
            <div>
              <label className="text-[10px] text-slate-400">临床诊断</label>
              <div className="bg-slate-50 p-1.5 rounded border border-slate-200 text-slate-800 text-[11px] leading-relaxed">
                {currentSpecimen.clinicalDiagnosis}
              </div>
            </div>

            <div>
              <label className="text-[10px] text-slate-400">临床备注 / 特殊要求</label>
              <div className="bg-slate-50 p-1.5 rounded border border-slate-200 text-slate-600 text-[11px]">
                {currentSpecimen.clinicalRemark}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Main Inspection Results Table & Charts (检验结果录入与核对大表) */}
        <div className="flex-1 flex flex-col min-h-0 bg-white overflow-hidden">
          {/* Action Toolbar Header */}
          <div className="p-2 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={handleAudit}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-medium shadow-2xs flex items-center gap-1.5 transition-colors"
              >
                <Check className="w-3.5 h-3.5" />
                <span>审核 (F8)</span>
              </button>
              <button
                onClick={handleUnAudit}
                className="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded font-medium shadow-2xs transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>反审核</span>
              </button>
              <button
                onClick={handleSaveResults}
                className="px-2.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded font-medium shadow-2xs flex items-center gap-1.5 transition-colors"
              >
                <span>保存结果</span>
              </button>
              <button
                onClick={handleToggleRepeat}
                className={`px-2.5 py-1.5 rounded font-medium border transition-colors ${
                  currentSpecimen.isRepeat
                    ? 'bg-sky-100 text-sky-800 border-sky-300'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                <span>复检标记 (F9)</span>
              </button>
              <button
                onClick={() => setShowCrisisModal(true)}
                className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 rounded font-medium flex items-center gap-1 transition-colors"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                <span>危急值上报 (F10)</span>
              </button>
              <button
                onClick={() => triggerAction(`正在调用打印机输出标本 ${currentSpecimen.sampleNo} 的临床报告单`)}
                className="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded font-medium flex items-center gap-1 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>打印报告</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400">
                双击结果单元格可手工微调
              </span>
            </div>
          </div>

          {/* Test Results Table (Grouped & Scrollable) */}
          <div className="flex-1 overflow-y-auto min-h-0 border-b border-slate-200">
            <table className="w-full border-collapse text-left">
              <thead className="bg-slate-100 text-slate-700 font-semibold text-[11px] sticky top-0 z-10 border-b border-slate-200 shadow-2xs">
                <tr>
                  <th className="w-8 py-1.5 px-2 text-center">
                    <input
                      type="checkbox"
                      checked={Object.values(selectedItems).every(Boolean)}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        const updated: Record<string, boolean> = {};
                        currentSpecimen.testGroups.forEach((g) => {
                          g.items.forEach((it) => {
                            updated[it.id] = checked;
                          });
                        });
                        setSelectedItems(updated);
                      }}
                      className="rounded text-sky-600"
                    />
                  </th>
                  <th className="w-10 py-1.5 px-2 text-center">序号</th>
                  <th className="w-24 py-1.5 px-2">英文名称</th>
                  <th className="py-1.5 px-2">检验项目</th>
                  <th className="w-28 py-1.5 px-2 text-center">结果</th>
                  <th className="w-16 py-1.5 px-2 text-center">状态</th>
                  <th className="w-16 py-1.5 px-2">单位</th>
                  <th className="w-28 py-1.5 px-2">参考范围</th>
                  <th className="w-20 py-1.5 px-2 text-right">上次结果</th>
                  <th className="w-16 py-1.5 px-2 text-center">上次状态</th>
                  <th className="w-24 py-1.5 px-2 text-center">上次时间</th>
                  <th className="w-20 py-1.5 px-2 text-center">复检值</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[11px]">
                {currentSpecimen.testGroups.map((group) => {
                  const isCollapsed = !!group.collapsed;
                  const allGroupSelected = group.items.every((it) => selectedItems[it.id]);
                  return (
                    <React.Fragment key={group.id}>
                      {/* Group Header Row */}
                      <tr className="bg-sky-50/70 border-y border-sky-100 font-semibold text-sky-950">
                        <td className="py-1 px-2 text-center">
                          <input
                            type="checkbox"
                            checked={allGroupSelected}
                            onChange={(e) => toggleGroupSelect(group, e.target.checked)}
                            className="rounded text-sky-600"
                          />
                        </td>
                        <td
                          colSpan={11}
                          className="py-1 px-2 cursor-pointer"
                          onClick={() => toggleGroupCollapse(group.id)}
                        >
                          <div className="flex items-center gap-2">
                            {isCollapsed ? (
                              <ChevronRight className="w-3.5 h-3.5 text-sky-700" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5 text-sky-700" />
                            )}
                            <span>{group.groupName}</span>
                            <span className="text-[10px] text-sky-600 font-normal">
                              共 {group.totalCount} 项 · {group.isPaid ? '已收费' : '未收费'}
                            </span>
                          </div>
                        </td>
                      </tr>

                      {/* Items in this group */}
                      {!isCollapsed &&
                        group.items.map((item, idx) => {
                          const isCrisis = item.status === 'crisis';
                          const isHigh = item.status === 'high';
                          const isLow = item.status === 'low';
                          return (
                            <tr
                              key={item.id}
                              className={`hover:bg-slate-50 transition-colors ${
                                isCrisis ? 'bg-rose-50/60 font-semibold' : ''
                              }`}
                            >
                              <td className="py-1 px-2 text-center">
                                <input
                                  type="checkbox"
                                  checked={!!selectedItems[item.id]}
                                  onChange={(e) =>
                                    setSelectedItems({
                                      ...selectedItems,
                                      [item.id]: e.target.checked
                                    })
                                  }
                                  className="rounded text-sky-600"
                                />
                              </td>
                              <td className="py-1 px-2 text-center text-slate-400 font-mono">
                                {idx + 1}
                              </td>
                              <td className="py-1 px-2 font-mono font-bold text-slate-800">
                                {item.code}
                              </td>
                              <td className="py-1 px-2 text-slate-700 font-medium">
                                {item.name}
                              </td>
                              <td className="py-1 px-2 text-center">
                                <input
                                  type="text"
                                  value={item.result}
                                  onChange={(e) =>
                                    handleResultChange(group.id, item.id, e.target.value)
                                  }
                                  className={`w-20 text-center font-mono font-bold px-1.5 py-0.5 rounded border ${
                                    isCrisis
                                      ? 'border-rose-400 bg-white text-rose-700 shadow-2xs ring-1 ring-rose-300'
                                      : isHigh
                                      ? 'border-rose-300 bg-white text-rose-600'
                                      : isLow
                                      ? 'border-amber-300 bg-white text-amber-700'
                                      : 'border-slate-300 bg-white text-slate-800 focus:border-sky-500'
                                  }`}
                                />
                              </td>
                              <td className="py-1 px-2 text-center">
                                {isCrisis ? (
                                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 bg-rose-600 text-white rounded font-bold text-[10px] animate-pulse">
                                    {item.statusText}
                                  </span>
                                ) : isHigh ? (
                                  <span className="inline-block px-1.5 py-0.2 bg-rose-100 text-rose-700 rounded font-bold text-[10px] border border-rose-200">
                                    {item.statusText}
                                  </span>
                                ) : isLow ? (
                                  <span className="inline-block px-1.5 py-0.2 bg-amber-100 text-amber-700 rounded font-bold text-[10px] border border-amber-200">
                                    {item.statusText}
                                  </span>
                                ) : (
                                  <span className="text-slate-400 font-mono">-</span>
                                )}
                              </td>
                              <td className="py-1 px-2 text-slate-500 font-sans">
                                {item.unit}
                              </td>
                              <td className="py-1 px-2 text-slate-600 font-mono">
                                {item.reference}
                              </td>
                              <td className="py-1 px-2 text-right font-mono text-slate-500">
                                {item.prevResult || '-'}
                              </td>
                              <td className="py-1 px-2 text-center text-slate-400">
                                {item.prevStatus || '-'}
                              </td>
                              <td className="py-1 px-2 text-center text-slate-400 font-mono text-[10px]">
                                {item.prevDate || '-'}
                              </td>
                              <td className="py-1 px-2 text-center font-mono text-sky-700 font-semibold">
                                {item.repeatResult || '-'}
                              </td>
                            </tr>
                          );
                        })}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* 3. Bottom Panels: Reaction Curves & Auto Diagnostic Interpretation */}
          <div className="shrink-0 flex flex-col bg-slate-50 border-t border-slate-200">
            {/* 3 Reaction Graph Previews (凝集反应曲线 / 吸光度动力学 / 质控图) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 p-2 bg-slate-100/70 border-b border-slate-200">
              {/* Curve 1: PT / Coagulation Clotting Curve */}
              <div className="bg-white p-2 rounded border border-slate-200 shadow-2xs flex flex-col justify-between">
                <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                  <span className="font-semibold text-slate-800">
                    凝血曲线 (PT比浊 OD动力学)
                  </span>
                  <span className="text-rose-600 font-mono font-bold">PT: 22.5s (延长)</span>
                </div>
                <div className="h-16 bg-slate-900 rounded p-1 flex items-center justify-center relative overflow-hidden">
                  <svg className="w-full h-full" viewBox="0 0 200 60" preserveAspectRatio="none">
                    <line x1="0" y1="50" x2="200" y2="50" stroke="#334155" strokeWidth="1" />
                    <line x1="0" y1="20" x2="200" y2="20" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
                    {/* Clotting S-curve with delayed clotting point */}
                    <path
                      d="M 10 50 Q 80 50 110 35 T 190 12"
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="2"
                    />
                    {/* inflection threshold mark */}
                    <circle cx="110" cy="35" r="3" fill="#f43f5e" />
                    <text x="115" y="32" fill="#fda4af" fontSize="8" fontFamily="monospace">
                      凝固点 22.5s
                    </text>
                  </svg>
                </div>
              </div>

              {/* Curve 2: Enzymatic OD Kinetic Rate */}
              <div className="bg-white p-2 rounded border border-slate-200 shadow-2xs flex flex-col justify-between">
                <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                  <span className="font-semibold text-slate-800">
                    生化反应动力学 (340nm速率法)
                  </span>
                  <span className="text-emerald-600 font-mono">ΔA/min 线性正常</span>
                </div>
                <div className="h-16 bg-slate-900 rounded p-1 flex items-center justify-center relative overflow-hidden">
                  <svg className="w-full h-full" viewBox="0 0 200 60" preserveAspectRatio="none">
                    <line x1="0" y1="50" x2="200" y2="50" stroke="#334155" strokeWidth="1" />
                    {/* Linear decrease curve */}
                    <path
                      d="M 15 15 L 185 48"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2"
                    />
                    <circle cx="15" cy="15" r="2.5" fill="#34d399" />
                    <circle cx="100" cy="31" r="2.5" fill="#34d399" />
                    <circle cx="185" cy="48" r="2.5" fill="#34d399" />
                    <text x="70" y="24" fill="#a7f3d0" fontSize="8" fontFamily="monospace">
                      OD 0.842 → 0.732
                    </text>
                  </svg>
                </div>
              </div>

              {/* Curve 3: Levey-Jennings IQC Monitor */}
              <div className="bg-white p-2 rounded border border-slate-200 shadow-2xs flex flex-col justify-between">
                <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                  <span className="font-semibold text-slate-800">
                    实时质控图 (Levey-Jennings)
                  </span>
                  <span className="text-sky-600 font-mono">在控 (符合 Westgard)</span>
                </div>
                <div className="h-16 bg-slate-900 rounded p-1 flex items-center justify-center relative overflow-hidden">
                  <svg className="w-full h-full" viewBox="0 0 200 60" preserveAspectRatio="none">
                    {/* Mean line */}
                    <line x1="0" y1="30" x2="200" y2="30" stroke="#0284c7" strokeWidth="1" />
                    {/* +2s / -2s lines */}
                    <line x1="0" y1="12" x2="200" y2="12" stroke="#e2e8f0" strokeWidth="0.5" strokeDasharray="2 2" />
                    <line x1="0" y1="48" x2="200" y2="48" stroke="#e2e8f0" strokeWidth="0.5" strokeDasharray="2 2" />
                    {/* QC run points */}
                    <polyline
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="1.5"
                      points="15,28 35,32 55,27 75,34 95,29 115,26 135,31 155,28 175,33 190,30"
                    />
                    <circle cx="190" cy="30" r="3" fill="#22c55e" />
                    <text x="140" y="44" fill="#94a3b8" fontSize="8" fontFamily="monospace">
                      Mean: 0.98 INR
                    </text>
                  </svg>
                </div>
              </div>
            </div>

            {/* Collapsible 检验结论 (Diagnostic Automated Interpretation) */}
            <div className="border-t border-slate-200 bg-white">
              <div
                onClick={() => setConclusionExpanded(!conclusionExpanded)}
                className="px-3 py-1.5 flex items-center justify-between cursor-pointer hover:bg-slate-50"
              >
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-800 text-xs flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                    <span>检验结论与智能质控诊断提示</span>
                  </span>
                  <span className="px-1.5 py-0.2 bg-amber-50 text-amber-800 border border-amber-200 rounded text-[10px]">
                    规则库校验已通过
                  </span>
                </div>
                {conclusionExpanded ? (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                )}
              </div>

              {conclusionExpanded && (
                <div className="p-3 pt-1 border-t border-slate-100 flex items-start gap-3 bg-amber-50/20">
                  <div className="flex-1 bg-white p-2.5 rounded border border-amber-200 text-slate-800 leading-relaxed text-[11px] shadow-2xs">
                    {currentSpecimen.conclusion}
                  </div>
                  <div className="flex flex-col gap-1.5 shrink-0">
                    <button
                      onClick={() =>
                        triggerAction('已添加常用语: [已双孔复测确认，复检值与初测相符]')
                      }
                      className="px-2 py-1 bg-white hover:bg-slate-50 border border-slate-200 rounded text-[10px] text-slate-700 transition-colors"
                    >
                      + 双孔复测相符
                    </button>
                    <button
                      onClick={() =>
                        triggerAction('已添加常用语: [标本无溶血、黄疸及严重脂血干扰]')
                      }
                      className="px-2 py-1 bg-white hover:bg-slate-50 border border-slate-200 rounded text-[10px] text-slate-700 transition-colors"
                    >
                      + 标本无溶血脂血
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Footer */}
            <div className="px-4 py-2 bg-slate-100 border-t border-slate-300 flex items-center justify-between shrink-0 text-xs">
              <div className="flex items-center gap-3 text-slate-500 font-mono text-[11px]">
                <span>快捷键: F8 审核 · F9 复检标记 · F10 危急值上报 · Esc 关闭</span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>仪器接口双向通信同步中</span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowResultModal(false)}
                  className="px-4 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded-lg font-medium transition-colors"
                >
                  关闭返回列表
                </button>
                <button
                  onClick={() => {
                    handleSaveResults();
                    setShowResultModal(false);
                  }}
                  className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-medium shadow-xs transition-colors"
                >
                  保存并关闭
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Bottom Status Strip (状态栏) */}
      <div className="bg-slate-800 text-slate-300 px-3 py-1 flex items-center justify-between text-[11px] font-mono shrink-0">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>主机端口: COM4 / 192.168.1.108 连通</span>
          </span>
          <span className="text-slate-400">
            当前选定: #{currentSpecimen.sampleNo} · {currentSpecimen.patientName} (
            {currentSpecimen.department})
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* 危急值待处理快速唤起按钮 */}
          <button
            onClick={() => setShowCrisisModal(true)}
            className="flex items-center gap-1 px-2 py-0.5 bg-rose-600 hover:bg-rose-500 text-white rounded font-sans font-bold text-[10px] transition-colors shadow-2xs animate-pulse"
          >
            <AlertTriangle className="w-3 h-3" />
            <span>(1) 危急值待处理</span>
          </button>
          <span className="text-slate-400">基准日期: {workDate}</span>
        </div>
      </div>

      {/* 5. Floating Crisis Value Alert Card (Matching screenshot bottom right toast) */}
      {showCrisisToast && currentSpecimen.isCrisis && (
        <div className="fixed bottom-10 right-6 z-40 bg-white border-2 border-rose-500 rounded-lg shadow-xl p-3.5 w-80 animate-bounce-short">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 shrink-0 mt-0.5">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
              </div>
              <div>
                <h4 className="font-bold text-rose-700 text-xs">危急值待处理!</h4>
                <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                  患者: <strong className="text-slate-900">{currentSpecimen.patientName}</strong>，标本号:{' '}
                  <span className="font-mono">{currentSpecimen.sampleNo}</span> 产生危急值 (PT-INR 4.50
                  ↑↑)，请及时处理!
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowCrisisToast(false)}
              className="text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="mt-3 flex justify-end gap-2">
            <button
              onClick={() => setShowCrisisToast(false)}
              className="px-2.5 py-1 text-[11px] text-slate-500 hover:text-slate-800"
            >
              稍后
            </button>
            <button
              onClick={() => {
                setShowCrisisModal(true);
              }}
              className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white font-medium rounded text-[11px] shadow-2xs transition-colors"
            >
              立即处理
            </button>
          </div>
        </div>
      )}

      {/* 6. Crisis Reporting Modal (危急值上报闭环弹窗) */}
      {showCrisisModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden animate-scaleIn">
            <div className="p-4 bg-rose-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-200" />
                <h3 className="font-bold text-sm">临床检验危急值闭环报告登记</h3>
              </div>
              <button
                onClick={() => setShowCrisisModal(false)}
                className="text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-3 text-xs text-slate-700">
              <div className="bg-rose-50 p-3 rounded-lg border border-rose-200 space-y-1">
                <div className="font-bold text-rose-900">
                  患者：{currentSpecimen.patientName} ({currentSpecimen.gender} · {currentSpecimen.age}岁)
                  · {currentSpecimen.department} {currentSpecimen.bedNo}床
                </div>
                <div className="text-slate-600 font-mono">
                  条码号: {currentSpecimen.barcode} · 标本号: #{currentSpecimen.sampleNo}
                </div>
                <div className="text-rose-700 font-semibold pt-1">
                  报警项目：PT-INR (国际标准化比值) = 4.50 (参考范围 0.76-1.16)
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  接听/确认临床医师姓名:
                </label>
                <input
                  type="text"
                  value={crisisCallDoctor}
                  onChange={(e) => setCrisisCallDoctor(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:bg-white focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  临床通知情况与反馈记录:
                </label>
                <textarea
                  rows={3}
                  value={crisisPhoneNote}
                  onChange={(e) => setCrisisPhoneNote(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded p-2 text-xs text-slate-800 focus:bg-white focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 text-slate-500 text-[11px] pt-1">
                <div>报告检验师: <strong className="text-slate-800">{user.name || '赵明远'}</strong></div>
                <div>上报时间: <strong className="text-slate-800">2026-10-27 09:45:20</strong></div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
              <button
                onClick={() => setShowCrisisModal(false)}
                className="px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-700 hover:bg-slate-100 font-medium"
              >
                取消
              </button>
              <button
                onClick={handleCompleteCrisis}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded font-medium shadow-2xs"
              >
                确认上报并归档闭环
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. Manual Add Sample Modal (手工添加标本弹窗) */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleAddManualSample}
            className="bg-white rounded-xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden animate-scaleIn"
          >
            <div className="p-4 bg-sky-700 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-sky-200" />
                <h3 className="font-bold text-sm">手工登记新标本上机</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-3 text-xs text-slate-700">
              <div>
                <label className="block text-slate-600 font-medium mb-1">患者姓名:</label>
                <input
                  type="text"
                  required
                  value={newPatientName}
                  onChange={(e) => setNewPatientName(e.target.value)}
                  placeholder="真实中文姓名"
                  className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800 focus:bg-white focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">申请科室:</label>
                  <select
                    value={newDepartment}
                    onChange={(e) => setNewDepartment(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800"
                  >
                    <option value="急诊科">急诊科</option>
                    <option value="心血管内科">心血管内科</option>
                    <option value="消化内科">消化内科</option>
                    <option value="普外科">普外科</option>
                    <option value="重症医学科(ICU)">重症医学科(ICU)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">标本类型:</label>
                  <select
                    value={newSampleType}
                    onChange={(e) => setNewSampleType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800"
                  >
                    <option value="血清">血清 (促凝黄管)</option>
                    <option value="全血">全血 (EDTA紫管)</option>
                    <option value="血浆">血浆 (枸橼酸蓝管)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-3 py-1.5 bg-white border border-slate-300 rounded text-slate-700 hover:bg-slate-100 font-medium"
              >
                取消
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded font-medium shadow-2xs"
              >
                登记并加入待审队列
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
