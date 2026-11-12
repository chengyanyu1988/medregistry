import React, { useState } from 'react';
import { UserProfile } from '../../types/navigation';
import {
  FileText,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  Sliders,
  Settings,
  Download,
  Building2,
  Check,
  X,
  Plus,
  Code2,
  ShieldCheck,
  Trash2,
  Play,
} from '../MenuIcon';

interface CommunicationConfigWorkstationProps {
  subId: string;
  user: UserProfile;
  triggerAction: (text: string) => void;
  onSelectSubMenu: (subId: string) => void;
}

// 1. 仪器数据结构（包含截图中的 001 全自动生化仪、002 D5100 等）
interface InstrumentCommItem {
  id: string;
  code: string;
  name: string;
  hospital: string;
  deptGroup: string;
  commType: '串口方式' | '网络方式' | '文件方式' | '数据库方式';
  comPort: string;
  baudRate: string;
  parity: string;
  dataBits: string;
  stopBits: string;
  receiveMode: string;
  handshake: string;
  isBiDirectional: '是' | '否';
  ipAddress: string;
  pcName: string;
  qcSampleNo: string;
  delimiter: string;
  status: 'online' | 'standby';
  lastActiveTime: string;
  maintainer: string; // 责任工程师/技师
  // 额外配置（解析与数据配置）
  parsingRules: string[];
  rawData: string;
  parsedResult: string;
  postProcessItems: {
    itemCode: string;
    itemName: string;
    offset: string;
    replaceValue: string;
  }[];
}

const INITIAL_INSTRUMENT_COMMS: InstrumentCommItem[] = [
  {
    id: 'INST-001',
    code: '001',
    name: '全自动生化仪 (罗氏 Cobas 8000 生化分析流水线)',
    hospital: '中心医院',
    deptGroup: '临床生化组',
    commType: '串口方式',
    comPort: 'COM1',
    baudRate: '9600',
    parity: 'None',
    dataBits: '8',
    stopBits: '1',
    receiveMode: '字符',
    handshake: '无',
    isBiDirectional: '是',
    ipAddress: '192.168.1.101',
    pcName: 'BIO-WORKSTATION-01',
    qcSampleNo: 'QC-20261030-01',
    delimiter: '<CR><LF>',
    status: 'online',
    lastActiveTime: '2026-10-30 09:58:22',
    maintainer: '刘全工程师',
    parsingRules: ['字符串替换', 'HL7段解析'],
    rawData: `H|\\^&|||RocheCobas8000|||||||P|1|20261030095818
P|1||1811301101||王建平||19810315|M|||||内科
O|1|0011812170001||^^^ALT\\^^^AST\\^^^TBIL|R|20261030081234|||||A||||||||||||||O
R|1|^^^ALT|68.4|U/L|9-50|H||F|||20261030095018
R|2|^^^AST|45.1|U/L|15-40|H||F|||20261030095018
R|3|^^^TBIL|15.2|μmol/L|3.4-20.5|N||F|||20261030095018`,
    parsedResult: `[解析状态: 校验成功 - 提取到 3 项结果]
患者: 王建平 (病历号: 1811301101 · 内科)
条码: 0011812170001
- ALT (丙氨酸氨基转移酶): 68.4 U/L [提示: 偏高 ↑]
- AST (天门冬氨酸氨基转移酶): 45.1 U/L [提示: 偏高 ↑]
- TBIL (总胆红素): 15.2 μmol/L [提示: 正常]`,
    postProcessItems: [
      { itemCode: 'CA', itemName: '钙(Ca)', offset: '1.0', replaceValue: '0' },
      { itemCode: 'K', itemName: '钾(K+)', offset: '1.0', replaceValue: '0' },
      { itemCode: 'NA', itemName: '钠(Na+)', offset: '1.0', replaceValue: '0' },
      { itemCode: 'CL', itemName: '氯(Cl-)', offset: '1.0', replaceValue: '0' },
      { itemCode: 'ALT', itemName: '丙氨酸氨基转移酶', offset: '1.0', replaceValue: '0' },
      { itemCode: 'AST', itemName: '天门冬氨酸氨基转移酶', offset: '1.0', replaceValue: '0' },
    ],
  },
  {
    id: 'INST-002',
    code: '002',
    name: 'D5100 (希森美康 CS-5100 全自动凝血分析仪)',
    hospital: '中心医院',
    deptGroup: '凝血检验组',
    commType: '串口方式',
    comPort: 'COM3',
    baudRate: '19200',
    parity: 'None',
    dataBits: '8',
    stopBits: '1',
    receiveMode: '字符',
    handshake: '无',
    isBiDirectional: '是',
    ipAddress: '192.168.1.108',
    pcName: 'COAG-WORKSTATION-02',
    qcSampleNo: 'QC-20261030-02',
    delimiter: '<ETX>',
    status: 'online',
    lastActiveTime: '2026-10-30 09:56:10',
    maintainer: '吴文彬技师',
    parsingRules: ['固定位置截取'],
    rawData: `H|\\^&|||SysmexCS5100|||||||P|1|20261030095600
P|1||1812174409||孙德荣||19640915|M|||||神经康复病区
O|1|0011812170049||^^^PT\\^^^APTT\\^^^FIB|R|20261030081500
R|1|^^^PT|12.8|s|11.0-14.5|N||F|||20261030095500
R|2|^^^APTT|32.4|s|28.0-43.5|N||F|||20261030095500
R|3|^^^FIB|3.62|g/L|2.00-4.00|N||F|||20261030095500`,
    parsedResult: `[解析状态: 校验成功 - 提取到 3 项结果]
患者: 孙德荣 (病历号: 1812174409 · 神经康复一病区)
条码: 0011812170049
- PT (凝血酶原时间): 12.8 秒 [提示: 正常]
- APTT (活化部分凝血活酶时间): 32.4 秒 [提示: 正常]
- FIB (纤维蛋白原定量): 3.62 g/L [提示: 正常]`,
    postProcessItems: [
      { itemCode: 'PT', itemName: '凝血酶原时间', offset: '1.0', replaceValue: '0' },
      { itemCode: 'APTT', itemName: '活化部分凝血活酶时间', offset: '1.0', replaceValue: '0' },
      { itemCode: 'FIB', itemName: '纤维蛋白原', offset: '1.0', replaceValue: '0' },
    ],
  },
  {
    id: 'INST-003',
    code: '003',
    name: '希森美康 XN-9100 全自动血细胞分析流水线',
    hospital: '中心医院',
    deptGroup: '临检血液组',
    commType: '网络方式',
    comPort: 'COM2',
    baudRate: '9600',
    parity: 'None',
    dataBits: '8',
    stopBits: '1',
    receiveMode: '字符',
    handshake: '无',
    isBiDirectional: '是',
    ipAddress: '192.168.1.105',
    pcName: 'HEM-WORKSTATION-01',
    qcSampleNo: 'QC-20261030-03',
    delimiter: '<CR><LF>',
    status: 'online',
    lastActiveTime: '2026-10-30 09:58:19',
    maintainer: '黄淑珍工程师',
    parsingRules: ['正则表达式切割'],
    rawData: `MSH|^~\\&|SysmexXN|Lab|||20261030095819||ORU^R01|MSG2026103001|P|2.5
PID|1||1812171143||李琴||19980822|F
OBR|1||0011812170012|XCGWFL^血常规5分类
OBX|1|NM|WBC||6.8|10^9/L|3.5-9.5|N|||F
OBX|2|NM|RBC||4.25|10^12/L|3.8-5.1|N|||F
OBX|3|NM|HGB||128|g/L|115-150|N|||F`,
    parsedResult: `[解析状态: HL7报文解析成功]
患者: 李琴 (病历号: 1812171143 · 妇科)
条码: 0011812170012
- WBC (白细胞计数): 6.8 10^9/L [正常]
- RBC (红细胞计数): 4.25 10^12/L [正常]
- HGB (血红蛋白): 128 g/L [正常]`,
    postProcessItems: [
      { itemCode: 'WBC', itemName: '白细胞计数', offset: '1.0', replaceValue: '0' },
      { itemCode: 'RBC', itemName: '红细胞计数', offset: '1.0', replaceValue: '0' },
      { itemCode: 'HGB', itemName: '血红蛋白', offset: '1.0', replaceValue: '0' },
    ],
  },
  {
    id: 'INST-004',
    code: '004',
    name: '雅培 Alinity i 全自动化学发光免疫分析仪',
    hospital: '中心医院',
    deptGroup: '临床免疫组',
    commType: '网络方式',
    comPort: 'COM4',
    baudRate: '9600',
    parity: 'None',
    dataBits: '8',
    stopBits: '1',
    receiveMode: '字符',
    handshake: '无',
    isBiDirectional: '是',
    ipAddress: '192.168.1.110',
    pcName: 'IMM-WORKSTATION-01',
    qcSampleNo: 'QC-20261030-04',
    delimiter: '<CR>',
    status: 'online',
    lastActiveTime: '2026-10-30 09:57:45',
    maintainer: '蔡雨君工程师',
    parsingRules: ['HL7段解析'],
    rawData: `MSH|^~\\&|AlinityI|Lab|||20261030095745||ORU^R01|MSG2026103002|P|2.5
PID|1||1812173318||周小波||19920119|M
OBR|1||0011812170038|cTnI^肌钙蛋白I
OBX|1|NM|cTnI||8.4|pg/mL|0-26.2|N|||F`,
    parsedResult: `[解析状态: HL7报文解析成功]
患者: 周小波 (病历号: 1812173318 · 全科)
条码: 0011812170038
- cTnI (超敏肌钙蛋白I): 8.4 pg/mL [正常]`,
    postProcessItems: [
      { itemCode: 'cTnI', itemName: '超敏肌钙蛋白I', offset: '1.0', replaceValue: '0' },
    ],
  },
  {
    id: 'INST-005',
    code: '005',
    name: '梅里埃 VITEK 2 全自动微生物鉴定及药敏系统',
    hospital: '中心医院',
    deptGroup: '微生物检验组',
    commType: '网络方式',
    comPort: 'COM5',
    baudRate: '9600',
    parity: 'None',
    dataBits: '8',
    stopBits: '1',
    receiveMode: '字符',
    handshake: '无',
    isBiDirectional: '是',
    ipAddress: '192.168.1.120',
    pcName: 'MIC-WORKSTATION-01',
    qcSampleNo: 'QC-20261030-05',
    delimiter: '<ETX>',
    status: 'online',
    lastActiveTime: '2026-10-30 09:52:00',
    maintainer: '景敏主任',
    parsingRules: ['固定位置截取'],
    rawData: `H|\\^&|||VITEK2|||||||P|1|20261030095200
P|1||22040742||张太彬||19580614|M
O|1|0901001||^^^K.pneumoniae|R|20261028145100
R|1|^^^AMX/CLA|20|mm|20-22|S||F
R|2|^^^MEM|26|mm|22-26|S||F`,
    parsedResult: `[解析状态: 鉴定及药敏结果已提取]
患者: 张太彬 (病案: 22040742)
菌株: 肺炎克雷伯氏菌
- 阿莫西林/克拉维酸: 20mm (敏感 S)
- 美罗培南: 26mm (敏感 S)`,
    postProcessItems: [
      { itemCode: 'AMX/CLA', itemName: '阿莫西林/克拉维酸', offset: '1.0', replaceValue: '0' },
      { itemCode: 'MEM', itemName: '美罗培南', offset: '1.0', replaceValue: '0' },
    ],
  },
];

// 2. 程序更新包模型
interface UpdatePackageItem {
  version: string;
  releaseDate: string;
  size: string;
  notes: string;
  status: 'current' | 'released' | 'archived';
}

const UPDATE_PACKAGES: UpdatePackageItem[] = [
  {
    version: 'LIS-Comm Agent v4.8.2',
    releaseDate: '2026-10-28',
    size: '42.6 MB',
    notes: '优化罗氏 Cobas 8000 生化流水线高频条码批下载性能；修复串口偶发丢包校验。',
    status: 'current',
  },
  {
    version: 'LIS-Comm Agent v4.8.1',
    releaseDate: '2026-09-15',
    size: '41.8 MB',
    notes: '增加微生物 VITEK2 自动化药敏单位(MIC)与KB法敏感度自动转换插件。',
    status: 'released',
  },
  {
    version: 'LIS-Comm Agent v4.7.9',
    releaseDate: '2026-07-20',
    size: '39.5 MB',
    notes: '重构底层 Socket 连接池，提升多台全自动流水线并发报文抓取稳定性。',
    status: 'archived',
  },
];

// 2.5 程序更新配置模型 (对应截图 image_fdac7d95.png)
export interface ProgramUpdateItem {
  id: string;
  hospital: string;
  instCode: string;
  instName: string;
  clientIp: string;
  clientName: string;
  serverProgVer: string;
  serverRuleVer: string;
  clientProgVer: string;
  clientRuleVer: string;
  lastUpdated: string;
  maintainer: string;
}

const INITIAL_PROGRAM_UPDATES: ProgramUpdateItem[] = [
  {
    id: 'PU-001',
    hospital: '中心医院',
    instCode: '001',
    instName: '全自动生化仪 (罗氏 Cobas 8000)',
    clientIp: '192.168.6.12',
    clientName: 'TC_USER',
    serverProgVer: 'v4.8.2',
    serverRuleVer: 'R20261028',
    clientProgVer: 'v4.8.0',
    clientRuleVer: 'R20260901',
    lastUpdated: '2026-10-30 09:30',
    maintainer: '刘全工程师',
  },
  {
    id: 'PU-002',
    hospital: '中心医院',
    instCode: '002',
    instName: 'D5100 (希森美康全自动凝血分析仪)',
    clientIp: '192.168.6.12',
    clientName: 'TC_USER',
    serverProgVer: 'v4.8.2',
    serverRuleVer: 'R20261028',
    clientProgVer: 'v4.8.0',
    clientRuleVer: 'R20260901',
    lastUpdated: '2026-10-30 09:28',
    maintainer: '吴文彬技师',
  },
  {
    id: 'PU-003',
    hospital: '中心医院',
    instCode: '003',
    instName: '希森美康 XN-9100 血细胞分析流水线',
    clientIp: '192.168.1.105',
    clientName: 'HEM_WORKSTATION',
    serverProgVer: 'v4.8.2',
    serverRuleVer: 'R20261028',
    clientProgVer: 'v4.8.2',
    clientRuleVer: 'R20261028',
    lastUpdated: '2026-10-30 09:15',
    maintainer: '黄淑珍工程师',
  },
  {
    id: 'PU-004',
    hospital: '中心医院',
    instCode: '004',
    instName: '雅培 Alinity i 全自动发光免疫分析仪',
    clientIp: '192.168.1.110',
    clientName: 'IMM_WORKSTATION',
    serverProgVer: 'v4.8.2',
    serverRuleVer: 'R20261028',
    clientProgVer: 'v4.8.1',
    clientRuleVer: 'R20260920',
    lastUpdated: '2026-10-30 08:50',
    maintainer: '蔡雨君工程师',
  },
  {
    id: 'PU-005',
    hospital: '中心医院',
    instCode: '005',
    instName: '梅里埃 VITEK 2 全自动微生物鉴定系统',
    clientIp: '192.168.1.120',
    clientName: 'MIC_WORKSTATION',
    serverProgVer: 'v4.8.2',
    serverRuleVer: 'R20261028',
    clientProgVer: 'v4.8.2',
    clientRuleVer: 'R20261028',
    lastUpdated: '2026-10-30 08:45',
    maintainer: '景敏主任',
  },
  {
    id: 'PU-006',
    hospital: '中心医院',
    instCode: '006',
    instName: '沃芬 ACL TOP 700 全自动凝血分析仪',
    clientIp: '192.168.1.125',
    clientName: 'COAG_PC02',
    serverProgVer: 'v4.8.2',
    serverRuleVer: 'R20261028',
    clientProgVer: 'v4.7.9',
    clientRuleVer: 'R20260810',
    lastUpdated: '2026-10-29 17:20',
    maintainer: '张珊技师',
  },
  {
    id: 'PU-007',
    hospital: '城东社区卫生服务中心',
    instCode: '007',
    instName: '迈瑞 BC-5390 全自动血细胞分析仪',
    clientIp: '192.168.2.14',
    clientName: 'CHENGDONG_LAB01',
    serverProgVer: 'v4.8.2',
    serverRuleVer: 'R20261028',
    clientProgVer: 'v4.8.0',
    clientRuleVer: 'R20260901',
    lastUpdated: '2026-10-29 16:10',
    maintainer: '陈敏工程师',
  },
  {
    id: 'PU-008',
    hospital: '城东社区卫生服务中心',
    instCode: '008',
    instName: '迈瑞 BS-800 全自动生化分析仪',
    clientIp: '192.168.2.15',
    clientName: 'CHENGDONG_LAB02',
    serverProgVer: 'v4.8.2',
    serverRuleVer: 'R20261028',
    clientProgVer: 'v4.8.2',
    clientRuleVer: 'R20261028',
    lastUpdated: '2026-10-29 15:40',
    maintainer: '李远山技师',
  },
  {
    id: 'PU-009',
    hospital: '滨江街道社区卫生服务中心',
    instCode: '009',
    instName: '优利特 US-2000 全自动尿液分析流水线',
    clientIp: '192.168.3.22',
    clientName: 'BINJIANG_URINE',
    serverProgVer: 'v4.8.2',
    serverRuleVer: 'R20261028',
    clientProgVer: 'v4.8.1',
    clientRuleVer: 'R20260920',
    lastUpdated: '2026-10-29 14:15',
    maintainer: '林青工程师',
  },
  {
    id: 'PU-010',
    hospital: '滨江街道社区卫生服务中心',
    instCode: '010',
    instName: '帝迈 DH-76 糖化血红蛋白分析仪',
    clientIp: '192.168.3.23',
    clientName: 'BINJIANG_HBA1C',
    serverProgVer: 'v4.8.2',
    serverRuleVer: 'R20261028',
    clientProgVer: 'v4.8.2',
    clientRuleVer: 'R20261028',
    lastUpdated: '2026-10-29 11:30',
    maintainer: '赵立平技师',
  },
  {
    id: 'PU-011',
    hospital: '科技城社区卫生服务中心',
    instCode: '011',
    instName: '希森美康 UF-5000 尿沉渣分析仪',
    clientIp: '192.168.4.18',
    clientName: 'KEJI_URINE01',
    serverProgVer: 'v4.8.2',
    serverRuleVer: 'R20261028',
    clientProgVer: 'v4.8.0',
    clientRuleVer: 'R20260901',
    lastUpdated: '2026-10-28 16:50',
    maintainer: '孙伟工程师',
  },
  {
    id: 'PU-012',
    hospital: '科技城社区卫生服务中心',
    instCode: '012',
    instName: '罗氏 e411 电化学发光免疫分析仪',
    clientIp: '192.168.4.19',
    clientName: 'KEJI_IMM01',
    serverProgVer: 'v4.8.2',
    serverRuleVer: 'R20261028',
    clientProgVer: 'v4.8.2',
    clientRuleVer: 'R20261028',
    lastUpdated: '2026-10-28 15:20',
    maintainer: '郑美玲技师',
  },
  {
    id: 'PU-013',
    hospital: '康复第二分院',
    instCode: '013',
    instName: '雷度 ABL90 FLEX 全自动血气分析仪',
    clientIp: '192.168.5.30',
    clientName: 'REHAB_BG01',
    serverProgVer: 'v4.8.2',
    serverRuleVer: 'R20261028',
    clientProgVer: 'v4.8.1',
    clientRuleVer: 'R20260920',
    lastUpdated: '2026-10-28 14:00',
    maintainer: '王启明工程师',
  },
  {
    id: 'PU-014',
    hospital: '康复第二分院',
    instCode: '014',
    instName: '迈瑞 CL-2000i 全自动化学发光分析仪',
    clientIp: '192.168.5.31',
    clientName: 'REHAB_CL01',
    serverProgVer: 'v4.8.2',
    serverRuleVer: 'R20261028',
    clientProgVer: 'v4.8.2',
    clientRuleVer: 'R20261028',
    lastUpdated: '2026-10-28 10:15',
    maintainer: '周海翔技师',
  },
  {
    id: 'PU-015',
    hospital: '康复第二分院',
    instCode: '015',
    instName: '贝克曼 AU5800 全自动生化分析仪',
    clientIp: '192.168.5.32',
    clientName: 'REHAB_BIO01',
    serverProgVer: 'v4.8.2',
    serverRuleVer: 'R20261028',
    clientProgVer: 'v4.8.0',
    clientRuleVer: 'R20260901',
    lastUpdated: '2026-10-27 18:30',
    maintainer: '许建文工程师',
  },
];

// 3. 通信程序下载资源模型
interface CommDownloadResource {
  id: string;
  title: string;
  version: string;
  size: string;
  category: string;
  updatedAt: string;
  desc: string;
  downloadCount: number;
  fileName: string;
}

const DOWNLOAD_RESOURCES: CommDownloadResource[] = [
  {
    id: 'DL-01',
    title: 'LIS 检验仪器数据双向采集服务套件 (Windows 64位安装版)',
    version: 'v4.8.2',
    size: '42.6 MB',
    category: '中间件',
    updatedAt: '2026-10-28',
    desc: '部署于工控机的前置数据采集服务，支持后台无感知运行、断线重连与ASTM/HL7双向解析。',
    downloadCount: 382,
    fileName: 'LIS_Comm_Agent_v4.8.2_Setup.exe',
  },
  {
    id: 'DL-02',
    title: '医疗级 USB 转 RS232/485 串口通用驱动包 (全平台合集)',
    version: 'v2026.10',
    size: '18.4 MB',
    category: '驱动程序',
    updatedAt: '2026-10-15',
    desc: '集成 FTDI / CH340 / PL2303 / CP2102 权威签名驱动，解决工控机串口通信掉线与乱码。',
    downloadCount: 512,
    fileName: 'Medical_Serial_Drivers_2026.zip',
  },
  {
    id: 'DL-03',
    title: 'HL7 & ASTM 仪器通信模拟收发与报文抓包调试诊断助手',
    version: 'v3.5.0',
    size: '12.2 MB',
    category: '调试工具',
    updatedAt: '2026-09-30',
    desc: '支持虚拟仪器模拟发样、条码结果查询报文测试、十六进制 HEX 码与原始帧校验。',
    downloadCount: 269,
    fileName: 'Lab_Comm_Protocol_Simulator_v3.5.exe',
  },
];

export const CommunicationConfigWorkstation: React.FC<CommunicationConfigWorkstationProps> = ({
  subId,
  user,
  triggerAction,
  onSelectSubMenu,
}) => {
  // Current active sub-tab
  const currentSub =
    subId === 'program-update-config'
      ? 'program-update-config'
      : subId === 'comm-program-download'
      ? 'comm-program-download'
      : 'instrument-comm-config';

  // 1. Main Page Search & Filters
  const [commList, setCommList] = useState<InstrumentCommItem[]>(INITIAL_INSTRUMENT_COMMS);
  const [selectedHospital, setSelectedHospital] = useState('中心医院');
  const [searchInstName, setSearchInstName] = useState('');

  // 2. MODAL STATE: Right-side configuration drawer turned into a MODAL (用户核心需求)
  const [modalItem, setModalItem] = useState<InstrumentCommItem | null>(null);
  const [activeModalTab, setActiveModalTab] = useState<'comm' | 'parsing' | 'data'>('comm');

  // Modal State Tab 1: 通信配置
  const [editingCommType, setEditingCommType] = useState<'串口方式' | '网络方式' | '文件方式' | '数据库方式'>('串口方式');
  const [editingComPort, setEditingComPort] = useState('COM1');
  const [editingBaudRate, setEditingBaudRate] = useState('9600');
  const [editingParity, setEditingParity] = useState('None');
  const [editingDataBits, setEditingDataBits] = useState('8');
  const [editingStopBits, setEditingStopBits] = useState('1');
  const [editingReceiveMode, setEditingReceiveMode] = useState('字符');
  const [editingHandshake, setEditingHandshake] = useState('无');
  const [editingBiDir, setEditingBiDir] = useState<'是' | '否'>('是');
  const [editingIpAddress, setEditingIpAddress] = useState('192.168.1.101');
  const [editingPcName, setEditingPcName] = useState('BIO-WORKSTATION-01');
  const [editingQcSampleNo, setEditingQcSampleNo] = useState('QC-20261030');
  const [editingDelimiter, setEditingDelimiter] = useState('<CR><LF>');

  // Modal State Tab 2: 解析配置
  const [editingRules, setEditingRules] = useState<string[]>(['字符串替换']);
  const [editingRawData, setEditingRawData] = useState('');
  const [editingParsedResult, setEditingParsedResult] = useState('');

  // Modal State Tab 3: 数据配置
  const [editingPostItems, setEditingPostItems] = useState<
    { itemCode: string; itemName: string; offset: string; replaceValue: string }[]
  >([]);

  // Other submodules state
  const [autoUpdateEnabled, setAutoUpdateEnabled] = useState(true);
  const [downloadCategory, setDownloadCategory] = useState('全部');

  // State for VIEW 2: 程序更新配置 (对应截图 image_fdac7d95.png)
  const [progUpdateList, setProgUpdateList] = useState<ProgramUpdateItem[]>(INITIAL_PROGRAM_UPDATES);
  const [progSelectedHospital, setProgSelectedHospital] = useState('中心医院');
  const [searchInstInfo, setSearchInstInfo] = useState('');
  const [searchClientInfo, setSearchClientInfo] = useState('');
  const [onlyDiscrepant, setOnlyDiscrepant] = useState(false);
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; // 用户核心需求：一页显示10条数据

  // Toast
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Hospital options
  const hospitalOptions = [
    '中心医院',
    '城东社区卫生服务中心',
    '滨江街道社区卫生服务中心',
    '科技城社区卫生服务中心',
    '康复第二分院',
  ];

  // Filtered Instrument List
  const filteredComms = commList.filter((item) => {
    if (selectedHospital && item.hospital !== selectedHospital) return false;
    if (searchInstName.trim()) {
      const q = searchInstName.trim().toLowerCase();
      const match =
        item.name.toLowerCase().includes(q) ||
        item.code.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  // Open Modal on row click
  const handleOpenConfigModal = (item: InstrumentCommItem) => {
    setModalItem(item);
    setActiveModalTab('comm');

    // Populate Tab 1
    setEditingCommType(item.commType);
    setEditingComPort(item.comPort);
    setEditingBaudRate(item.baudRate);
    setEditingParity(item.parity);
    setEditingDataBits(item.dataBits);
    setEditingStopBits(item.stopBits);
    setEditingReceiveMode(item.receiveMode);
    setEditingHandshake(item.handshake);
    setEditingBiDir(item.isBiDirectional);
    setEditingIpAddress(item.ipAddress);
    setEditingPcName(item.pcName);
    setEditingQcSampleNo(item.qcSampleNo);
    setEditingDelimiter(item.delimiter);

    // Populate Tab 2
    setEditingRules([...item.parsingRules]);
    setEditingRawData(item.rawData);
    setEditingParsedResult(item.parsedResult);

    // Populate Tab 3
    setEditingPostItems([...item.postProcessItems]);
  };

  // Save Tab 1 (通信配置)
  const handleSaveTab1 = () => {
    if (!modalItem) return;
    const updated = commList.map((i) =>
      i.id === modalItem.id
        ? {
            ...i,
            commType: editingCommType,
            comPort: editingComPort,
            baudRate: editingBaudRate,
            parity: editingParity,
            dataBits: editingDataBits,
            stopBits: editingStopBits,
            receiveMode: editingReceiveMode,
            handshake: editingHandshake,
            isBiDirectional: editingBiDir,
            ipAddress: editingIpAddress,
            pcName: editingPcName,
            qcSampleNo: editingQcSampleNo,
            delimiter: editingDelimiter,
          }
        : i
    );
    setCommList(updated);
    showToast(`【${modalItem.name}】通信方式与连接设置已成功保存！`);
    triggerAction(`保存通信配置: ${modalItem.code}`);
  };

  // Save Tab 2 (解析配置)
  const handleSaveTab2 = () => {
    if (!modalItem) return;
    const updated = commList.map((i) =>
      i.id === modalItem.id
        ? {
            ...i,
            parsingRules: editingRules,
            rawData: editingRawData,
            parsedResult: editingParsedResult,
          }
        : i
    );
    setCommList(updated);
    showToast(`【${modalItem.name}】解析规则已更新保存！`);
    triggerAction(`保存解析配置: ${modalItem.code}`);
  };

  // Save Tab 3 (数据配置)
  const handleSaveTab3 = () => {
    if (!modalItem) return;
    const updated = commList.map((i) =>
      i.id === modalItem.id
        ? {
            ...i,
            postProcessItems: editingPostItems,
          }
        : i
    );
    setCommList(updated);
    showToast(`【${modalItem.name}】数据解析后处理偏置与替换表已保存！`);
    triggerAction(`保存数据配置: ${modalItem.code}`);
  };

  // Add rule in Tab 2
  const handleAddRule = () => {
    setEditingRules([...editingRules, '字符串替换']);
  };

  // Delete rule in Tab 2
  const handleDeleteRule = (index: number) => {
    setEditingRules(editingRules.filter((_, idx) => idx !== index));
  };

  // Fetch raw data in Tab 2
  const handleFetchRawData = () => {
    if (!modalItem) return;
    showToast(`成功抓取【${modalItem.code}】工控机底层串口/网络原始通信帧`);
    setEditingRawData(
      `H|\\^&|||${modalItem.name}|||||||P|1|20261030095822\nP|1||1811301101||王建平||19810315|M\nO|1|0011812170001||^^^ALT\\^^^AST|R|20261030081234\nR|1|^^^ALT|68.4|U/L|9-50|H||F|||20261030095018`
    );
  };

  // Test parse in Tab 2
  const handleTestParse = () => {
    if (!editingRawData.trim()) {
      showToast('原始数据为空，请先点击【获取数据】');
      return;
    }
    setEditingParsedResult(
      `[测试解析完成 - 耗时 0.8ms]\n提取规则: ${editingRules.join(' -> ')}\n提取结果: 成功匹配 2 个检验项目，偏值修正后格式无误。`
    );
    showToast('解析测试成功，报文校验无错错帧！');
  };

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-slate-50 overflow-hidden font-sans">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-16 right-8 z-50 animate-bounceIn">
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 text-white text-xs shadow-xl border border-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMsg}</span>
          </div>
        </div>
      )}



      {/* -------------------- VIEW 1: 仪器通信配置 (主页面直接展示左侧仪器列表) -------------------- */}
      {currentSub === 'instrument-comm-config' && (
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-white">
          {/* Top Search Controls matching screenshot: 单位 [中心医院], 仪器名称 [], [查询] */}
          <div className="bg-[#fafafa] border-b border-slate-200 px-5 py-3 shrink-0 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-slate-700 font-medium whitespace-nowrap">单位</span>
                <select
                  value={selectedHospital}
                  onChange={(e) => setSelectedHospital(e.target.value)}
                  className="px-3 py-1.5 text-xs text-slate-800 bg-white border border-slate-300 rounded focus:outline-hidden focus:border-blue-500 min-w-[120px]"
                >
                  {hospitalOptions.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-700 font-medium whitespace-nowrap">仪器名称</span>
                <div className="relative w-56">
                  <input
                    type="text"
                    value={searchInstName}
                    onChange={(e) => setSearchInstName(e.target.value)}
                    placeholder="例如: 生化仪, D5100, 001"
                    className="w-full px-3 py-1.5 text-xs text-slate-800 bg-white border border-slate-300 rounded focus:outline-hidden focus:border-blue-500 placeholder-slate-400"
                  />
                  {searchInstName && (
                    <button
                      onClick={() => setSearchInstName('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* 查询按钮 (白底蓝边) */}
              <button
                type="button"
                onClick={() => {
                  showToast(`查询成功，检索到 ${filteredComms.length} 台匹配的检验仪器设备`);
                  triggerAction('查询仪器列表');
                }}
                className="px-5 py-1.5 bg-white border border-[#1890ff] text-[#1890ff] hover:bg-blue-50 text-xs font-medium rounded transition-colors shadow-2xs"
              >
                查询
              </button>
            </div>

            <div className="text-xs text-slate-500 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>点击下方表格任意仪器，可弹出通信/解析/数据全套配置窗口</span>
            </div>
          </div>

          {/* Full-width Instrument List Table (对应截图左侧【仪器列表】，全屏扩展展示) */}
          <div className="flex-1 overflow-auto min-h-0 bg-white">
            <div className="px-5 py-2 bg-slate-100 border-b border-slate-200 text-xs font-bold text-[#1890ff] flex items-center justify-between">
              <span>仪器列表</span>
              <span className="font-normal text-slate-500 text-[11px]">
                共 {filteredComms.length} 台台账仪器
              </span>
            </div>

            <table className="w-full border-collapse text-left text-xs text-slate-700 select-text">
              <thead className="bg-[#fafafa] text-slate-700 font-medium sticky top-0 z-10 border-b border-slate-200">
                <tr className="border-b border-slate-200 divide-x divide-transparent">
                  <th className="py-2.5 px-4 whitespace-nowrap w-24">仪器编码</th>
                  <th className="py-2.5 px-4 whitespace-nowrap">仪器名称</th>
                  <th className="py-2.5 px-4 whitespace-nowrap">所属科室/专业组</th>
                  <th className="py-2.5 px-4 whitespace-nowrap">通讯方式</th>
                  <th className="py-2.5 px-4 whitespace-nowrap">接口地址/端口</th>
                  <th className="py-2.5 px-4 whitespace-nowrap">工作模式</th>
                  <th className="py-2.5 px-4 whitespace-nowrap text-center">状态</th>
                  <th className="py-2.5 px-4 whitespace-nowrap">最近通讯时间</th>
                  <th className="py-2.5 px-4 whitespace-nowrap">维护责任人</th>
                  <th className="py-2.5 px-4 whitespace-nowrap text-center w-28">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredComms.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-16 text-center text-slate-400">
                      暂无匹配的仪器通信记录
                    </td>
                  </tr>
                ) : (
                  filteredComms.map((item) => (
                    <tr
                      key={item.id}
                      onClick={() => handleOpenConfigModal(item)}
                      className="hover:bg-blue-50/60 cursor-pointer transition-colors"
                    >
                      {/* 仪器编码 */}
                      <td className="py-3 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                        {item.code}
                      </td>

                      {/* 仪器名称 */}
                      <td className="py-3 px-4 font-semibold text-slate-900 whitespace-nowrap">
                        {item.name}
                      </td>

                      {/* 所属科室/专业组 */}
                      <td className="py-3 px-4 text-slate-700 whitespace-nowrap">
                        {item.deptGroup}
                      </td>

                      {/* 通讯方式 */}
                      <td className="py-3 px-4 text-slate-800 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded text-[11px] bg-slate-100 text-slate-700 border border-slate-200">
                          {item.commType}
                        </span>
                      </td>

                      {/* 接口地址/端口 */}
                      <td className="py-3 px-4 font-mono text-slate-800 whitespace-nowrap">
                        {item.commType === '串口方式'
                          ? `${item.comPort} (${item.baudRate})`
                          : item.ipAddress}
                      </td>

                      {/* 工作模式 */}
                      <td className="py-3 px-4 text-slate-700 whitespace-nowrap">
                        {item.isBiDirectional === '是' ? '双向查询' : '单向接收'}
                      </td>

                      {/* 状态 */}
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] bg-emerald-50 text-emerald-700 font-medium border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          在线
                        </span>
                      </td>

                      {/* 最近通讯时间 */}
                      <td className="py-3 px-4 font-mono text-slate-600 whitespace-nowrap">
                        {item.lastActiveTime}
                      </td>

                      {/* 维护责任人 */}
                      <td className="py-3 px-4 text-slate-800 whitespace-nowrap font-medium">
                        {item.maintainer}
                      </td>

                      {/* 操作 */}
                      <td
                        className="py-3 px-4 text-center whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          type="button"
                          onClick={() => handleOpenConfigModal(item)}
                          className="px-3 py-1 bg-white border border-[#1890ff] text-[#1890ff] hover:bg-blue-50 text-xs font-medium rounded transition-colors shadow-2xs"
                        >
                          参数配置
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* -------------------- VIEW 2: 程序更新配置 (对应截图 image_fdac7d95.png) -------------------- */}
      {currentSub === 'program-update-config' && (() => {
        // Filter logic
        const filteredUpdates = progUpdateList.filter((item) => {
          if (progSelectedHospital && progSelectedHospital !== '全部' && item.hospital !== progSelectedHospital) {
            return false;
          }
          if (searchInstInfo.trim()) {
            const q = searchInstInfo.trim().toLowerCase();
            const match = item.instCode.toLowerCase().includes(q) || item.instName.toLowerCase().includes(q);
            if (!match) return false;
          }
          if (searchClientInfo.trim()) {
            const q = searchClientInfo.trim().toLowerCase();
            const match = item.clientIp.toLowerCase().includes(q) || item.clientName.toLowerCase().includes(q);
            if (!match) return false;
          }
          if (onlyDiscrepant) {
            const isDiscrepant = item.clientProgVer !== item.serverProgVer || item.clientRuleVer !== item.serverRuleVer;
            if (!isDiscrepant) return false;
          }
          return true;
        });

        // Pagination calculation (用户核心需求：一页帮我显示10条数据)
        const totalItems = filteredUpdates.length;
        const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
        const safeCurrentPage = Math.min(currentPage, totalPages);
        const startIndex = (safeCurrentPage - 1) * pageSize;
        const pageItems = filteredUpdates.slice(startIndex, startIndex + pageSize);

        // Selection logic
        const allCurrentSelected = pageItems.length > 0 && pageItems.every((item) => selectedRowIds.includes(item.id));
        const handleToggleSelectAll = () => {
          if (allCurrentSelected) {
            const currentIds = pageItems.map((i) => i.id);
            setSelectedRowIds(selectedRowIds.filter((id) => !currentIds.includes(id)));
          } else {
            const currentIds = pageItems.map((i) => i.id);
            const newSelected = Array.from(new Set([...selectedRowIds, ...currentIds]));
            setSelectedRowIds(newSelected);
          }
        };

        const handleToggleSelectRow = (id: string) => {
          if (selectedRowIds.includes(id)) {
            setSelectedRowIds(selectedRowIds.filter((i) => i !== id));
          } else {
            setSelectedRowIds([...selectedRowIds, id]);
          }
        };

        // Single Push action
        const handlePushSingleUpdate = (item: ProgramUpdateItem) => {
          const updated = progUpdateList.map((i) =>
            i.id === item.id
              ? {
                  ...i,
                  clientProgVer: i.serverProgVer,
                  clientRuleVer: i.serverRuleVer,
                  lastUpdated: '2026-10-30 10:00',
                }
              : i
          );
          setProgUpdateList(updated);
          showToast(`【${item.instName}】程序及规则更新指令已成功下发至客户端 ${item.clientIp}`);
          triggerAction(`推送更新: ${item.instCode}`);
        };

        // Batch Push action
        const handleBatchPush = () => {
          let targetIds = selectedRowIds;
          if (targetIds.length === 0) {
            // Push all discrepant items in current filter if none manually checked
            targetIds = filteredUpdates
              .filter((i) => i.clientProgVer !== i.serverProgVer || i.clientRuleVer !== i.serverRuleVer)
              .map((i) => i.id);
          }

          if (targetIds.length === 0) {
            showToast('当前视图下所有终端版本与解析规则均已对齐最新，无需推送！');
            return;
          }

          const updated = progUpdateList.map((i) =>
            targetIds.includes(i.id)
              ? {
                  ...i,
                  clientProgVer: i.serverProgVer,
                  clientRuleVer: i.serverRuleVer,
                  lastUpdated: '2026-10-30 10:00',
                }
              : i
          );
          setProgUpdateList(updated);
          setSelectedRowIds([]);
          showToast(`批量推送成功！已对 ${targetIds.length} 台终端客户端下发最新程序包与规则！`);
          triggerAction(`批量推送更新: ${targetIds.length}台`);
        };

        return (
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-white">
            {/* Top Filter Bar matching screenshot: 单位 [中心医院 v], 仪器信息 [], 客户端信息 [], [ ]仅版本不一致, [查询], [批量推送] */}
            <div className="bg-[#fafafa] border-b border-slate-200 px-5 py-3 shrink-0 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-4">
                {/* 单位 */}
                <div className="flex items-center gap-2">
                  <span className="text-slate-700 font-medium whitespace-nowrap">单位</span>
                  <select
                    value={progSelectedHospital}
                    onChange={(e) => {
                      setProgSelectedHospital(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="px-3 py-1.5 text-xs text-slate-800 bg-white border border-slate-300 rounded focus:outline-hidden focus:border-blue-500 min-w-[120px]"
                  >
                    <option value="全部">全部医院/单位</option>
                    {hospitalOptions.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 仪器信息 */}
                <div className="flex items-center gap-2">
                  <span className="text-slate-700 font-medium whitespace-nowrap">仪器信息</span>
                  <input
                    type="text"
                    value={searchInstInfo}
                    onChange={(e) => setSearchInstInfo(e.target.value)}
                    placeholder="输入编码或名称(如 001)"
                    className="w-40 px-3 py-1.5 text-xs text-slate-800 bg-white border border-slate-300 rounded focus:outline-hidden focus:border-blue-500 placeholder-slate-400 font-mono"
                  />
                </div>

                {/* 客户端信息 */}
                <div className="flex items-center gap-2">
                  <span className="text-slate-700 font-medium whitespace-nowrap">客户端信息</span>
                  <input
                    type="text"
                    value={searchClientInfo}
                    onChange={(e) => setSearchClientInfo(e.target.value)}
                    placeholder="输入IP或客户端名(如 192.168.6.12)"
                    className="w-44 px-3 py-1.5 text-xs text-slate-800 bg-white border border-slate-300 rounded focus:outline-hidden focus:border-blue-500 placeholder-slate-400 font-mono"
                  />
                </div>

                {/* 仅版本不一致 Checkbox */}
                <label className="flex items-center gap-1.5 text-slate-700 font-medium cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={onlyDiscrepant}
                    onChange={(e) => {
                      setOnlyDiscrepant(e.target.checked);
                      setCurrentPage(1);
                    }}
                    className="rounded text-[#1890ff] focus:ring-0 cursor-pointer"
                  />
                  <span>仅版本不一致</span>
                </label>

                {/* 查询按钮 (白底蓝字蓝边 对应截图 [查询]) */}
                <button
                  type="button"
                  onClick={() => {
                    setCurrentPage(1);
                    showToast(`查询完毕，已检索到 ${filteredUpdates.length} 条数据`);
                    triggerAction('查询程序更新配置');
                  }}
                  className="px-5 py-1.5 bg-white border border-[#1890ff] text-[#1890ff] hover:bg-blue-50 text-xs font-medium rounded transition-colors shadow-2xs"
                >
                  查询
                </button>

                {/* 批量推送按钮 (实心蓝底 对应截图 [批量推送]) */}
                <button
                  type="button"
                  onClick={handleBatchPush}
                  className="px-5 py-1.5 bg-[#1890ff] hover:bg-blue-600 text-white text-xs font-medium rounded transition-colors shadow-2xs flex items-center gap-1.5"
                >
                  <span>批量推送</span>
                  {selectedRowIds.length > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px] font-bold">
                      {selectedRowIds.length}
                    </span>
                  )}
                </button>
              </div>

              <div className="text-xs text-slate-500 hidden xl:block font-mono">
                服务端发布版本: <span className="font-bold text-blue-700">v4.8.2</span> / 规则: <span className="font-bold text-blue-700">R20261028</span>
              </div>
            </div>

            {/* Title Bar matching screenshot: 仪器列表 (blue bold font) */}
            <div className="px-5 py-2 bg-slate-100 border-b border-slate-200 text-xs font-bold text-[#1890ff] flex items-center justify-between shrink-0">
              <span>仪器列表</span>
              <span className="font-normal text-slate-500 text-[11px]">
                共 {filteredUpdates.length} 台仪器终端 · 当前视图显示第 {safeCurrentPage}/{totalPages} 页
              </span>
            </div>

            {/* Table Section with exact columns matching screenshot image_fdac7d95.png */}
            <div className="flex-1 overflow-auto min-h-0 bg-white">
              <table className="w-full border-collapse text-left text-xs text-slate-700 select-text">
                <thead className="bg-[#fafafa] text-slate-700 font-medium sticky top-0 z-10 border-b border-slate-200">
                  <tr className="border-b border-slate-200 divide-x divide-transparent">
                    <th className="py-2.5 px-3 whitespace-nowrap text-center w-10">
                      <input
                        type="checkbox"
                        checked={allCurrentSelected}
                        onChange={handleToggleSelectAll}
                        className="rounded text-[#1890ff] focus:ring-0 cursor-pointer"
                        title="全选当前页"
                      />
                    </th>
                    <th className="py-2.5 px-3 whitespace-nowrap">单位名称</th>
                    <th className="py-2.5 px-3 whitespace-nowrap">仪器编码</th>
                    <th className="py-2.5 px-3 whitespace-nowrap">仪器名称</th>
                    <th className="py-2.5 px-3 whitespace-nowrap">客户端地址</th>
                    <th className="py-2.5 px-3 whitespace-nowrap">客户端名称</th>
                    <th className="py-2.5 px-3 whitespace-nowrap font-mono">服务端程序版本号</th>
                    <th className="py-2.5 px-3 whitespace-nowrap font-mono">服务端解析规则版本号</th>
                    <th className="py-2.5 px-3 whitespace-nowrap font-mono">客户端程序版本号</th>
                    <th className="py-2.5 px-3 whitespace-nowrap font-mono">客户端解析规则版本号</th>
                    <th className="py-2.5 px-3 whitespace-nowrap text-center w-24">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pageItems.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="py-16 text-center text-slate-400">
                        暂无匹配的程序更新配置数据
                      </td>
                    </tr>
                  ) : (
                    pageItems.map((item) => {
                      const isProgDiscrepant = item.clientProgVer !== item.serverProgVer;
                      const isRuleDiscrepant = item.clientRuleVer !== item.serverRuleVer;
                      const isSelected = selectedRowIds.includes(item.id);

                      return (
                        <tr
                          key={item.id}
                          className={`hover:bg-blue-50/50 transition-colors ${
                            isSelected ? 'bg-blue-50/70' : ''
                          }`}
                        >
                          {/* Checkbox */}
                          <td className="py-2.5 px-3 text-center">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleToggleSelectRow(item.id)}
                              className="rounded text-[#1890ff] focus:ring-0 cursor-pointer"
                            />
                          </td>

                          {/* 单位名称 */}
                          <td className="py-2.5 px-3 text-slate-800 whitespace-nowrap">
                            {item.hospital}
                          </td>

                          {/* 仪器编码 */}
                          <td className="py-2.5 px-3 font-mono font-bold text-slate-900 whitespace-nowrap">
                            {item.instCode}
                          </td>

                          {/* 仪器名称 */}
                          <td className="py-2.5 px-3 font-medium text-slate-900 whitespace-nowrap">
                            {item.instName}
                          </td>

                          {/* 客户端地址 */}
                          <td className="py-2.5 px-3 font-mono text-slate-700 whitespace-nowrap">
                            {item.clientIp}
                          </td>

                          {/* 客户端名称 */}
                          <td className="py-2.5 px-3 font-mono text-slate-700 whitespace-nowrap">
                            {item.clientName}
                          </td>

                          {/* 服务端程序版本号 */}
                          <td className="py-2.5 px-3 font-mono text-slate-600 whitespace-nowrap">
                            {item.serverProgVer}
                          </td>

                          {/* 服务端解析规则版本号 */}
                          <td className="py-2.5 px-3 font-mono text-slate-600 whitespace-nowrap">
                            {item.serverRuleVer}
                          </td>

                          {/* 客户端程序版本号 (If different from server, highlight amber/red) */}
                          <td className="py-2.5 px-3 font-mono whitespace-nowrap">
                            {isProgDiscrepant ? (
                              <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 font-semibold border border-amber-200 inline-flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3 text-amber-500" />
                                {item.clientProgVer}
                              </span>
                            ) : (
                              <span className="text-slate-700">{item.clientProgVer}</span>
                            )}
                          </td>

                          {/* 客户端解析规则版本号 */}
                          <td className="py-2.5 px-3 font-mono whitespace-nowrap">
                            {isRuleDiscrepant ? (
                              <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 font-semibold border border-amber-200 inline-flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3 text-amber-500" />
                                {item.clientRuleVer}
                              </span>
                            ) : (
                              <span className="text-slate-700">{item.clientRuleVer}</span>
                            )}
                          </td>

                          {/* 操作: 推送更新 (#1890ff text link) */}
                          <td className="py-2.5 px-3 text-center whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => handlePushSingleUpdate(item)}
                              className="text-[#1890ff] hover:underline font-medium hover:text-blue-700"
                            >
                              推送更新
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* 🌟 Pagination Bar: 用户核心需求「一页帮我显示10条数据」 🌟 */}
            <div className="bg-[#fafafa] border-t border-slate-200 px-5 py-2.5 shrink-0 flex items-center justify-between text-xs text-slate-600">
              <div className="flex items-center gap-4">
                <span>共 <strong className="text-slate-900 font-mono">{totalItems}</strong> 条数据</span>
                <span className="text-slate-300">|</span>
                <span className="bg-slate-200/70 text-slate-700 px-2 py-0.5 rounded text-[11px] font-mono">
                  10 条/页
                </span>
              </div>

              {/* Page Controls */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={safeCurrentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1 bg-white border border-slate-300 rounded text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  上一页
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setCurrentPage(p)}
                      className={`w-7 h-7 rounded text-xs font-mono font-medium transition-colors ${
                        safeCurrentPage === p
                          ? 'bg-[#1890ff] text-white font-bold'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  disabled={safeCurrentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="px-3 py-1 bg-white border border-slate-300 rounded text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  下一页
                </button>
              </div>
            </div>
          </div>
        );
      })()}


      {/* -------------------- VIEW 3: 通信程序下载 -------------------- */}
      {currentSub === 'comm-program-download' && (
        <div className="flex-1 overflow-auto p-5 space-y-4 bg-slate-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {DOWNLOAD_RESOURCES.map((res) => (
              <div
                key={res.id}
                className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-medium border border-blue-200">
                      {res.category}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      更新：{res.updatedAt}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 mt-2">{res.title}</h4>
                  <p className="text-xs text-slate-500 mt-1">{res.desc}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-mono text-slate-500 text-[11px]">
                    {res.version} · {res.size}
                  </span>
                  <button
                    onClick={() => showToast(`已开始下载：${res.fileName}`)}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium"
                  >
                    下载程序
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* 🌟 CRITICAL USER REQUIREMENT: 仪器通信配置弹窗 (MODAL) 🌟 */}
      {/* (将原截图右侧显示的通信配置、解析配置、数据配置三大面板，全部封装为弹窗) */}
      {/* ------------------------------------------------------------------ */}
      {modalItem && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-2xs flex items-center justify-center p-3 sm:p-5">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-300 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden animate-fadeIn">
            {/* Modal Header */}
            <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <Sliders className="w-5 h-5 text-sky-400" />
                <div>
                  <div className="font-bold text-sm flex items-center gap-2">
                    <span>仪器通信配置与数据解析管理</span>
                    <span className="text-[11px] px-2 py-0.2 rounded font-mono bg-blue-500/20 text-sky-300 border border-sky-400/30">
                      {modalItem.code}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-300 mt-0.5">
                    设备: {modalItem.name} ({modalItem.deptGroup} · {modalItem.maintainer})
                  </div>
                </div>
              </div>

              <button
                onClick={() => setModalItem(null)}
                className="text-white/70 hover:text-white p-1 rounded transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Navigation Tabs (Exact 3 Tabs from screenshots: 通信配置, 解析配置, 数据配置) */}
            <div className="bg-slate-100 border-b border-slate-200 px-5 pt-2 flex items-center gap-2 text-xs shrink-0">
              <button
                onClick={() => setActiveModalTab('comm')}
                className={`px-4 py-2 font-medium rounded-t-lg border-t border-x transition-all ${
                  activeModalTab === 'comm'
                    ? 'bg-white border-slate-300 text-[#1890ff] font-bold shadow-xs'
                    : 'border-transparent text-slate-600 hover:text-slate-900 bg-slate-200/50'
                }`}
              >
                通信配置
              </button>

              <button
                onClick={() => setActiveModalTab('parsing')}
                className={`px-4 py-2 font-medium rounded-t-lg border-t border-x transition-all ${
                  activeModalTab === 'parsing'
                    ? 'bg-white border-slate-300 text-[#1890ff] font-bold shadow-xs'
                    : 'border-transparent text-slate-600 hover:text-slate-900 bg-slate-200/50'
                }`}
              >
                解析配置
              </button>

              <button
                onClick={() => setActiveModalTab('data')}
                className={`px-4 py-2 font-medium rounded-t-lg border-t border-x transition-all ${
                  activeModalTab === 'data'
                    ? 'bg-white border-slate-300 text-[#1890ff] font-bold shadow-xs'
                    : 'border-transparent text-slate-600 hover:text-slate-900 bg-slate-200/50'
                }`}
              >
                数据配置
              </button>
            </div>

            {/* Modal Body Content (Dynamic TAB 1 / TAB 2 / TAB 3) */}
            <div className="flex-1 overflow-y-auto p-5 min-h-0 bg-white text-xs">
              {/* ---------------- TAB 1: 通信配置 (Exact layout from Screenshot 1) ---------------- */}
              {activeModalTab === 'comm' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
                  {/* Left Column: 仪器通信方式配置 */}
                  <div className="space-y-3.5">
                    <div className="font-bold text-[#1890ff] text-xs border-b border-slate-100 pb-2">
                      仪器通信方式配置
                    </div>

                    {/* 通讯方式 Radio Buttons */}
                    <div className="flex items-center gap-4 text-slate-800">
                      <span className="font-medium text-slate-700 w-16 text-right shrink-0">
                        通讯方式
                      </span>
                      <div className="flex items-center gap-3 flex-wrap">
                        {(['串口方式', '网络方式', '文件方式', '数据库方式'] as const).map(
                          (mode) => (
                            <label
                              key={mode}
                              className="flex items-center gap-1.5 cursor-pointer text-slate-700"
                            >
                              <input
                                type="radio"
                                name="commType"
                                checked={editingCommType === mode}
                                onChange={() => setEditingCommType(mode)}
                                className="text-blue-600 focus:ring-0 cursor-pointer"
                              />
                              <span>{mode}</span>
                            </label>
                          )
                        )}
                      </div>
                    </div>

                    {/* Form Controls */}
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-3">
                        <span className="text-slate-600 w-16 text-right shrink-0">COM口</span>
                        <input
                          type="text"
                          value={editingComPort}
                          onChange={(e) => setEditingComPort(e.target.value)}
                          className="w-56 px-2.5 py-1 bg-white border border-slate-300 rounded text-slate-800 font-mono focus:border-blue-500"
                        />
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-slate-600 w-16 text-right shrink-0">波特率</span>
                        <select
                          value={editingBaudRate}
                          onChange={(e) => setEditingBaudRate(e.target.value)}
                          className="w-56 px-2.5 py-1 bg-white border border-slate-300 rounded text-slate-800 focus:border-blue-500 font-mono"
                        >
                          <option value="9600">9600</option>
                          <option value="19200">19200</option>
                          <option value="38400">38400</option>
                          <option value="57600">57600</option>
                          <option value="115200">115200</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-slate-600 w-16 text-right shrink-0">奇偶位</span>
                        <select
                          value={editingParity}
                          onChange={(e) => setEditingParity(e.target.value)}
                          className="w-56 px-2.5 py-1 bg-white border border-slate-300 rounded text-slate-800 focus:border-blue-500 font-mono"
                        >
                          <option value="None">None</option>
                          <option value="Even">Even</option>
                          <option value="Odd">Odd</option>
                          <option value="Mark">Mark</option>
                          <option value="Space">Space</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-slate-600 w-16 text-right shrink-0">数据位</span>
                        <select
                          value={editingDataBits}
                          onChange={(e) => setEditingDataBits(e.target.value)}
                          className="w-56 px-2.5 py-1 bg-white border border-slate-300 rounded text-slate-800 focus:border-blue-500 font-mono"
                        >
                          <option value="8">8</option>
                          <option value="7">7</option>
                          <option value="6">6</option>
                          <option value="5">5</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-slate-600 w-16 text-right shrink-0">停止位</span>
                        <select
                          value={editingStopBits}
                          onChange={(e) => setEditingStopBits(e.target.value)}
                          className="w-56 px-2.5 py-1 bg-white border border-slate-300 rounded text-slate-800 focus:border-blue-500 font-mono"
                        >
                          <option value="1">1</option>
                          <option value="1.5">1.5</option>
                          <option value="2">2</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-slate-600 w-16 text-right shrink-0">接收模式</span>
                        <select
                          value={editingReceiveMode}
                          onChange={(e) => setEditingReceiveMode(e.target.value)}
                          className="w-56 px-2.5 py-1 bg-white border border-slate-300 rounded text-slate-800 focus:border-blue-500"
                        >
                          <option value="字符">字符</option>
                          <option value="字节">字节</option>
                          <option value="行">行</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-slate-600 w-16 text-right shrink-0">握手协议</span>
                        <select
                          value={editingHandshake}
                          onChange={(e) => setEditingHandshake(e.target.value)}
                          className="w-56 px-2.5 py-1 bg-white border border-slate-300 rounded text-slate-800 focus:border-blue-500"
                        >
                          <option value="无">无</option>
                          <option value="XON/XOFF">XON/XOFF</option>
                          <option value="RTS/CTS">RTS/CTS</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-slate-600 w-16 text-right shrink-0">是否双向</span>
                        <select
                          value={editingBiDir}
                          onChange={(e) => setEditingBiDir(e.target.value as '是' | '否')}
                          className="w-56 px-2.5 py-1 bg-white border border-slate-300 rounded text-slate-800 focus:border-blue-500 font-medium"
                        >
                          <option value="是">是</option>
                          <option value="否">否</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: 连接及其他设置 */}
                  <div className="space-y-3.5 border-l border-slate-100 pl-0 md:pl-8">
                    <div className="font-bold text-[#1890ff] text-xs border-b border-slate-100 pb-2">
                      连接及其他设置
                    </div>

                    <div className="space-y-2.5">
                      <div className="flex items-center gap-3">
                        <span className="text-slate-600 w-24 text-right shrink-0">
                          连接电脑地址
                        </span>
                        <input
                          type="text"
                          value={editingIpAddress}
                          onChange={(e) => setEditingIpAddress(e.target.value)}
                          className="w-56 px-2.5 py-1 bg-white border border-slate-300 rounded text-slate-800 font-mono focus:border-blue-500"
                        />
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-slate-600 w-24 text-right shrink-0">
                          连接电脑名称
                        </span>
                        <input
                          type="text"
                          value={editingPcName}
                          onChange={(e) => setEditingPcName(e.target.value)}
                          className="w-56 px-2.5 py-1 bg-white border border-slate-300 rounded text-slate-800 font-mono focus:border-blue-500"
                        />
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-slate-600 w-24 text-right shrink-0">
                          质控样本号
                        </span>
                        <input
                          type="text"
                          value={editingQcSampleNo}
                          onChange={(e) => setEditingQcSampleNo(e.target.value)}
                          className="w-56 px-2.5 py-1 bg-white border border-slate-300 rounded text-slate-800 font-mono focus:border-blue-500"
                        />
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-slate-600 w-24 text-right shrink-0">
                          数据截止符
                        </span>
                        <input
                          type="text"
                          value={editingDelimiter}
                          onChange={(e) => setEditingDelimiter(e.target.value)}
                          className="w-56 px-2.5 py-1 bg-white border border-slate-300 rounded text-slate-800 font-mono focus:border-blue-500"
                        />
                      </div>
                    </div>

                    {/* Bottom Save Button (Exact solid green style `#008a00` from Screenshot 1) */}
                    <div className="pt-16 flex justify-end">
                      <button
                        type="button"
                        onClick={handleSaveTab1}
                        className="px-6 py-1.5 bg-[#008a00] hover:bg-emerald-700 text-white text-xs font-bold rounded shadow-2xs transition-colors flex items-center gap-1.5"
                      >
                        <Check className="w-4 h-4" />
                        <span>保存</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ---------------- TAB 2: 解析配置 (Exact layout from Screenshot 2) ---------------- */}
              {activeModalTab === 'parsing' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Box: 解析规则列表 (Header with 添加 blue & 保存 green, Trashcan red icon) */}
                  <div className="border border-slate-200 rounded-lg p-3 space-y-3 flex flex-col h-[380px]">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <span className="font-bold text-[#1890ff] text-xs">解析规则列表</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleAddRule}
                          className="px-3 py-1 bg-[#1890ff] hover:bg-blue-600 text-white text-xs font-medium rounded transition-colors"
                        >
                          添加
                        </button>
                        <button
                          type="button"
                          onClick={handleSaveTab2}
                          className="px-3 py-1 bg-[#008a00] hover:bg-emerald-700 text-white text-xs font-medium rounded transition-colors"
                        >
                          保存
                        </button>
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                      {editingRules.map((rule, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 bg-slate-50 p-1.5 rounded border border-slate-200"
                        >
                          <select
                            value={rule}
                            onChange={(e) => {
                              const updated = [...editingRules];
                              updated[idx] = e.target.value;
                              setEditingRules(updated);
                            }}
                            className="flex-1 bg-white border border-slate-300 rounded px-2.5 py-1 text-slate-800"
                          >
                            <option value="字符串替换">字符串替换</option>
                            <option value="固定位置截取">固定位置截取</option>
                            <option value="正则表达式切割">正则表达式切割</option>
                            <option value="HL7段解析">HL7段解析</option>
                            <option value="ASTM帧校验提取">ASTM帧校验提取</option>
                          </select>

                          {/* Delete red button (垃圾桶按钮 from screenshot) */}
                          <button
                            type="button"
                            onClick={() => handleDeleteRule(idx)}
                            className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded shadow-2xs transition-colors shrink-0"
                            title="删除规则"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Box: 原始数据 & 解析数据 (Header with 获取数据 blue & 测试 white/blue) */}
                  <div className="space-y-4 flex flex-col h-[380px]">
                    {/* Raw Data Box */}
                    <div className="flex-1 border border-slate-200 rounded-lg p-3 flex flex-col min-h-0">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                        <span className="font-bold text-[#1890ff] text-xs">原始数据</span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={handleFetchRawData}
                            className="px-3 py-1 bg-[#1890ff] hover:bg-blue-600 text-white text-xs font-medium rounded transition-colors"
                          >
                            获取数据
                          </button>
                          <button
                            type="button"
                            onClick={handleTestParse}
                            className="px-3 py-1 bg-white border border-[#1890ff] text-[#1890ff] hover:bg-blue-50 text-xs font-medium rounded transition-colors"
                          >
                            测试
                          </button>
                        </div>
                      </div>
                      <textarea
                        rows={5}
                        value={editingRawData}
                        onChange={(e) => setEditingRawData(e.target.value)}
                        placeholder="点击【获取数据】实时提取工控机原始帧数据..."
                        className="w-full flex-1 bg-slate-50 border border-slate-200 rounded p-2 text-xs font-mono text-slate-800 focus:outline-hidden focus:bg-white resize-none"
                      />
                    </div>

                    {/* Parsed Data Box */}
                    <div className="flex-1 border border-slate-200 rounded-lg p-3 flex flex-col min-h-0">
                      <div className="border-b border-slate-100 pb-1.5 mb-2 font-bold text-[#1890ff] text-xs">
                        解析数据
                      </div>
                      <textarea
                        rows={5}
                        value={editingParsedResult}
                        onChange={(e) => setEditingParsedResult(e.target.value)}
                        placeholder="点击【测试】执行解析规则预览解析后数据..."
                        className="w-full flex-1 bg-slate-50 border border-slate-200 rounded p-2 text-xs font-mono text-slate-800 focus:outline-hidden focus:bg-white resize-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ---------------- TAB 3: 数据配置 (Exact layout from Screenshot 3) ---------------- */}
              {activeModalTab === 'data' && (
                <div className="space-y-3">
                  {/* Top Bar with Header & Green Save Button */}
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="font-bold text-[#1890ff] text-xs">数据解析后处理</span>
                    <button
                      type="button"
                      onClick={handleSaveTab3}
                      className="px-6 py-1 bg-[#008a00] hover:bg-emerald-700 text-white text-xs font-bold rounded transition-colors shadow-2xs"
                    >
                      保存
                    </button>
                  </div>

                  {/* Post Process Table matching screenshot: 项目代码, 项目名称, 偏移值, 替换值 */}
                  <div className="border border-slate-200 rounded-lg overflow-hidden max-h-[350px] overflow-y-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-[#f5f7fa] text-slate-700 font-semibold sticky top-0 z-10 border-b border-slate-200">
                        <tr className="divide-x divide-slate-200">
                          <th className="py-2 px-3 w-1/4">项目代码</th>
                          <th className="py-2 px-3 w-1/4">项目名称</th>
                          <th className="py-2 px-3 w-1/4">偏移值</th>
                          <th className="py-2 px-3 w-1/4">替换值</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-mono">
                        {editingPostItems.map((item, idx) => (
                          <tr key={idx} className="hover:bg-slate-50 divide-x divide-slate-100">
                            <td className="py-2 px-3 text-slate-900 font-bold">{item.itemCode}</td>
                            <td className="py-2 px-3 text-slate-800 font-sans">{item.itemName}</td>
                            <td className="py-1 px-2">
                              <input
                                type="text"
                                value={item.offset}
                                onChange={(e) => {
                                  const updated = [...editingPostItems];
                                  updated[idx].offset = e.target.value;
                                  setEditingPostItems(updated);
                                }}
                                className="w-full px-2 py-0.5 border border-slate-300 rounded text-xs bg-white text-slate-800"
                              />
                            </td>
                            <td className="py-1 px-2">
                              <input
                                type="text"
                                value={item.replaceValue}
                                onChange={(e) => {
                                  const updated = [...editingPostItems];
                                  updated[idx].replaceValue = e.target.value;
                                  setEditingPostItems(updated);
                                }}
                                className="w-full px-2 py-0.5 border border-slate-300 rounded text-xs bg-white text-slate-800"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Bottom Actions */}
            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs shrink-0">
              <div className="text-slate-500 font-mono text-[11px]">
                网络连通性: 100% · 延迟 1.2ms · 数据安全协议通道开启
              </div>
              <button
                type="button"
                onClick={() => setModalItem(null)}
                className="px-5 py-1.5 bg-white border border-slate-300 rounded text-slate-700 font-medium hover:bg-slate-100"
              >
                关闭窗口
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
