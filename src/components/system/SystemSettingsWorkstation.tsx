import React, { useState } from 'react';
import { UserProfile } from '../../types/navigation';
import {
  FileText,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sliders,
  Settings,
  Building2,
  User,
  ShieldCheck,
  UserCheck,
  Database,
  Boxes,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Filter,
  Download,
  Layers,
  CheckSquare,
  RotateCcw,
  Key,
  Lock,
  Eye,
  EyeOff
} from '../MenuIcon';

interface SystemSettingsWorkstationProps {
  subId: string;
  user: UserProfile;
  triggerAction: (text: string) => void;
  onSelectSubMenu: (subId: string) => void;
}

// 1. 机构列表 (Left Panel: 单位信息 -> 机构列表 对应截图 image_ba697ddf.png)
export interface InstitutionItem {
  id: string;
  code: string; // 机构编码 (001)
  name: string; // 机构名称 (中心医院)
  category: string; // 机构性质 (中心医院)
  leader: string;
  phone: string;
  address: string;
  status: '启用' | '停用';
}

const INITIAL_INSTITUTIONS: InstitutionItem[] = [
  { id: 'INST-01', code: '001', name: '中心医院', category: '中心医院', leader: '景敏主任', phone: '023-85650516', address: '重庆市垫江县桂溪镇桂北外街116号', status: '启用' },
  { id: 'INST-02', code: '002', name: '城东社区卫生服务中心', category: '社区卫生服务中心', leader: '刘全工程师', phone: '023-85650888', address: '垫江县城东街道迎宾大道45号', status: '启用' },
  { id: 'INST-03', code: '003', name: '滨江街道社区卫生服务中心', category: '社区卫生服务中心', leader: '吴文彬技师', phone: '023-85650999', address: '垫江县滨江路108号', status: '启用' },
  { id: 'INST-04', code: '004', name: '科技城社区卫生服务中心', category: '社区卫生服务中心', leader: '黄淑珍工程师', phone: '023-85651122', address: '垫江县高新区科技大道88号', status: '启用' },
  { id: 'INST-05', code: '005', name: '康复第二分院', category: '专科医院', leader: '蔡雨君工程师', phone: '023-85652233', address: '垫江县康复路12号', status: '启用' },
  { id: 'INST-06', code: '006', name: '垫江县妇幼保健院', category: '专科妇幼医院', leader: '张珊技师', phone: '023-85653344', address: '垫江县妇幼路66号', status: '启用' },
  { id: 'INST-07', code: '007', name: '垫江县中医院', category: '中医综合医院', leader: '李明强医师', phone: '023-85654455', address: '垫江县中医路99号', status: '启用' },
  { id: 'INST-08', code: '008', name: '高新区医疗中心', category: '医疗中心', leader: '陈敏工程师', phone: '023-85655566', address: '垫江县高新园区1号', status: '启用' },
  { id: 'INST-09', code: '009', name: '新城卫生服务站', category: '社区服务站', leader: '李远山技师', phone: '023-85656677', address: '垫江县新城三路', status: '启用' },
  { id: 'INST-10', code: '010', name: '龙溪镇卫生院', category: '乡镇卫生院', leader: '林青工程师', phone: '023-85657788', address: '垫江县龙溪镇正街', status: '启用' },
  { id: 'INST-11', code: '011', name: '南部新区医院', category: '二级综合医院', leader: '赵立平技师', phone: '023-85658899', address: '垫江县南路150号', status: '启用' },
  { id: 'INST-12', code: '012', name: '西坪社区医疗站', category: '社区医疗站', leader: '孙伟工程师', phone: '023-85659900', address: '垫江县西坪社区8号', status: '启用' },
  { id: 'INST-13', code: '013', name: '明月山康养中心', category: '康养机构', leader: '郑美玲技师', phone: '023-85659911', address: '垫江县明月山景区内', status: '启用' },
  { id: 'INST-14', code: '014', name: '东山社区卫生站', category: '社区服务站', leader: '王启明工程师', phone: '023-85659922', address: '垫江县东山大道', status: '启用' },
  { id: 'INST-15', code: '015', name: '红光街道联合诊所', category: '基层诊所', leader: '周海翔技师', phone: '023-85659933', address: '垫江县红光路22号', status: '启用' },
];

// 2. 部门列表 (Right Panel: 部门信息 -> 部门列表 对应截图 image_ba697ddf.png)
export interface DepartmentItem {
  id: string;
  instCode: string; // 所属机构编码 (001)
  code: string; // 部门编码 (001001)
  name: string; // 部门名称 (检验科)
  parentDept: string; // 上级部门
  category: string; // 部门性质 (临床)
  deptType: string; // 部门类型 (科室)
  phone: string; // 联系电话 (10239012312)
  mappingCode: string; // 对照编码
  status: '启用' | '停用';
  leader: string;
  updatedAt: string;
}

const INITIAL_DEPARTMENTS: DepartmentItem[] = [
  { id: 'DEPT-01', instCode: '001', code: '001001', name: '检验科', parentDept: '', category: '临床', deptType: '科室', phone: '10239012312', mappingCode: 'HIS_DEPT_01', status: '启用', leader: '景敏主任', updatedAt: '2026-10-30 09:30' },
  { id: 'DEPT-02', instCode: '001', code: '001002', name: '临床生化组', parentDept: '检验科', category: '医技', deptType: '专业组', phone: '023-85650516', mappingCode: 'HIS_DEPT_02', status: '启用', leader: '刘全工程师', updatedAt: '2026-10-30 09:28' },
  { id: 'DEPT-03', instCode: '001', code: '001003', name: '临检血液组', parentDept: '检验科', category: '医技', deptType: '专业组', phone: '023-85650518', mappingCode: 'HIS_DEPT_03', status: '启用', leader: '吴文彬技师', updatedAt: '2026-10-30 09:15' },
  { id: 'DEPT-04', instCode: '001', code: '001004', name: '临床免疫发光组', parentDept: '检验科', category: '医技', deptType: '专业组', phone: '023-85650520', mappingCode: 'HIS_DEPT_04', status: '启用', leader: '蔡雨君工程师', updatedAt: '2026-10-30 08:50' },
  { id: 'DEPT-05', instCode: '001', code: '001005', name: '微生物与药敏实验室', parentDept: '检验科', category: '医技', deptType: '实验室', phone: '023-85650522', mappingCode: 'HIS_DEPT_05', status: '启用', leader: '黄淑珍工程师', updatedAt: '2026-10-30 08:45' },
  { id: 'DEPT-06', instCode: '001', code: '001006', name: '医联体区域送检中心', parentDept: '检验科', category: '医技', deptType: '专业组', phone: '023-85650525', mappingCode: 'HIS_DEPT_06', status: '启用', leader: '张珊技师', updatedAt: '2026-10-29 17:20' },
  { id: 'DEPT-07', instCode: '001', code: '001007', name: '临床输血科', parentDept: '检验科', category: '临床', deptType: '科室', phone: '023-85650530', mappingCode: 'HIS_DEPT_07', status: '启用', leader: '李明强医师', updatedAt: '2026-10-29 16:10' },
  { id: 'DEPT-08', instCode: '001', code: '001008', name: '门诊集中采血室', parentDept: '检验科', category: '临床', deptType: '采样点', phone: '023-85650535', mappingCode: 'HIS_DEPT_08', status: '启用', leader: '王秀兰护师', updatedAt: '2026-10-29 15:40' },
  { id: 'DEPT-09', instCode: '001', code: '001009', name: '病区标前处理中心', parentDept: '检验科', category: '医技', deptType: '专业组', phone: '023-85650540', mappingCode: 'HIS_DEPT_09', status: '启用', leader: '陈天宇技师', updatedAt: '2026-10-29 14:15' },
  { id: 'DEPT-10', instCode: '001', code: '001010', name: '分子生物学实验室', parentDept: '检验科', category: '医技', deptType: '实验室', phone: '023-85650545', mappingCode: 'HIS_DEPT_10', status: '启用', leader: '孙志强工程师', updatedAt: '2026-10-29 11:30' },
  { id: 'DEPT-11', instCode: '002', code: '002001', name: '城东检验集中采样部', parentDept: '城东社卫医务科', category: '临床', deptType: '采样点', phone: '023-85650881', mappingCode: 'HIS_DEPT_11', status: '启用', leader: '陈敏工程师', updatedAt: '2026-10-28 16:50' },
  { id: 'DEPT-12', instCode: '002', code: '002002', name: '城东常规化验室', parentDept: '城东社卫医务科', category: '医技', deptType: '实验室', phone: '023-85650882', mappingCode: 'HIS_DEPT_12', status: '启用', leader: '李远山技师', updatedAt: '2026-10-28 15:20' },
  { id: 'DEPT-13', instCode: '003', code: '003001', name: '滨江全科化验室', parentDept: '滨江社卫', category: '医技', deptType: '科室', phone: '023-85650991', mappingCode: 'HIS_DEPT_13', status: '停用', leader: '林青工程师', updatedAt: '2026-10-28 14:00' },
  { id: 'DEPT-14', instCode: '004', code: '004001', name: '科技城检验化验中心', parentDept: '科技城社卫', category: '医技', deptType: '科室', phone: '023-85651121', mappingCode: 'HIS_DEPT_14', status: '启用', leader: '孙伟工程师', updatedAt: '2026-10-28 10:15' },
  { id: 'DEPT-15', instCode: '005', code: '005001', name: '康复化验与血气分析室', parentDept: '康复第二分院', category: '医技', deptType: '科室', phone: '023-85652231', mappingCode: 'HIS_DEPT_15', status: '启用', leader: '许建文工程师', updatedAt: '2026-10-27 18:30' },
];

// 3. 人员档案数据模型 (对应截图 image_25e59655.png)
export interface PersonnelItem {
  id: string;
  instCode: string; // 所属单位编码 (001)
  deptCode: string; // 所属部门编码 (001001)
  deptName: string; // 所属部门名称 (检验科)
  empNo: string; // 人员编号 (001001)
  name: string; // 姓名 (张珊)
  gender: '男' | '女';
  idCard: string; // 身份证号 (500231199210150028)
  phone: string; // 联系电话 (10239012312)
  mappingCode: string; // 对照编码 (HIS_PER_001)
  title: string; // 职称/职务
  status: '在职' | '休假' | '离职';
  updatedAt: string; // 2026-10-30
}

const INITIAL_PERSONNEL: PersonnelItem[] = [
  { id: 'PER-01', instCode: '001', deptCode: '001001', deptName: '检验科', empNo: '001001', name: '张珊', gender: '女', idCard: '500231199210150028', phone: '10239012312', mappingCode: 'HIS_PER_001', title: '主管检验师', status: '在职', updatedAt: '2026-10-30 09:30' },
  { id: 'PER-02', instCode: '001', deptCode: '001001', deptName: '检验科', empNo: '001002', name: '景敏', gender: '女', idCard: '500231198005120016', phone: '13883920192', mappingCode: 'HIS_PER_002', title: '检验科主任/主任医师', status: '在职', updatedAt: '2026-10-30 09:28' },
  { id: 'PER-03', instCode: '001', deptCode: '001002', deptName: '临床生化组', empNo: '001003', name: '刘全', gender: '男', idCard: '500231198308220034', phone: '13983019283', mappingCode: 'HIS_PER_003', title: '资深生化工程师', status: '在职', updatedAt: '2026-10-30 09:15' },
  { id: 'PER-04', instCode: '001', deptCode: '001003', deptName: '临检血液组', empNo: '001004', name: '吴文彬', gender: '男', idCard: '500231198611040058', phone: '13783910291', mappingCode: 'HIS_PER_004', title: '临检组长/主管技师', status: '在职', updatedAt: '2026-10-30 08:50' },
  { id: 'PER-05', instCode: '001', deptCode: '001005', deptName: '微生物与药敏实验室', empNo: '001005', name: '黄淑珍', gender: '女', idCard: '500231198902180022', phone: '13683920182', mappingCode: 'HIS_PER_005', title: '微生物工程师', status: '在职', updatedAt: '2026-10-30 08:45' },
  { id: 'PER-06', instCode: '001', deptCode: '001004', deptName: '临床免疫发光组', empNo: '001006', name: '蔡雨君', gender: '女', idCard: '500231199107110046', phone: '13583910283', mappingCode: 'HIS_PER_006', title: '免疫组长/主管技师', status: '在职', updatedAt: '2026-10-29 17:20' },
  { id: 'PER-07', instCode: '001', deptCode: '001007', deptName: '临床输血科', empNo: '001007', name: '李明强', gender: '男', idCard: '500231198403290011', phone: '13383019284', mappingCode: 'HIS_PER_007', title: '输血科组长/副主任医师', status: '在职', updatedAt: '2026-10-29 16:10' },
  { id: 'PER-08', instCode: '001', deptCode: '001008', deptName: '门诊集中采血室', empNo: '001008', name: '王秀兰', gender: '女', idCard: '500231199412080068', phone: '13483910295', mappingCode: 'HIS_PER_008', title: '主管护师', status: '在职', updatedAt: '2026-10-29 15:40' },
  { id: 'PER-09', instCode: '001', deptCode: '001009', deptName: '病区标前处理中心', empNo: '001009', name: '陈天宇', gender: '男', idCard: '500231199509170032', phone: '13283910211', mappingCode: 'HIS_PER_009', title: '检验技师', status: '在职', updatedAt: '2026-10-29 14:15' },
  { id: 'PER-10', instCode: '001', deptCode: '001010', deptName: '分子生物学实验室', empNo: '001010', name: '孙志强', gender: '男', idCard: '500231198701250074', phone: '13183910233', mappingCode: 'HIS_PER_010', title: '基因扩增检验工程师', status: '在职', updatedAt: '2026-10-29 11:30' },
  { id: 'PER-11', instCode: '002', deptCode: '002001', deptName: '城东检验集中采样部', empNo: '002001', name: '陈敏', gender: '女', idCard: '500231199004030028', phone: '13083910255', mappingCode: 'HIS_PER_011', title: '社卫检验工程师', status: '在职', updatedAt: '2026-10-28 16:50' },
  { id: 'PER-12', instCode: '002', deptCode: '002002', deptName: '城东常规化验室', empNo: '002002', name: '李远山', gender: '男', idCard: '500231198806190042', phone: '13883910277', mappingCode: 'HIS_PER_012', title: '检验技师', status: '在职', updatedAt: '2026-10-28 15:20' },
  { id: 'PER-13', instCode: '003', deptCode: '003001', deptName: '滨江全科化验室', empNo: '003001', name: '林青', gender: '女', idCard: '500231199308110088', phone: '13783910288', mappingCode: 'HIS_PER_013', title: '检验技工', status: '在职', updatedAt: '2026-10-28 14:00' },
  { id: 'PER-14', instCode: '004', deptCode: '004001', deptName: '科技城检验化验中心', empNo: '004001', name: '孙伟', gender: '男', idCard: '500231198510090014', phone: '13683910299', mappingCode: 'HIS_PER_014', title: '资深技师', status: '在职', updatedAt: '2026-10-28 10:15' },
  { id: 'PER-15', instCode: '005', deptCode: '005001', deptName: '康复化验与血气分析室', empNo: '005001', name: '郑美玲', gender: '女', idCard: '500231199111230036', phone: '13583910200', mappingCode: 'HIS_PER_015', title: '血气分析化验员', status: '在职', updatedAt: '2026-10-27 18:30' },
  { id: 'PER-16', instCode: '001', deptCode: '001001', deptName: '检验科', empNo: '001016', name: '王启明', gender: '男', idCard: '500231198604120018', phone: '13983910288', mappingCode: 'HIS_PER_016', title: '临检室副主管', status: '在职', updatedAt: '2026-10-30 09:10' },
  { id: 'PER-17', instCode: '001', deptCode: '001002', deptName: '临床生化组', empNo: '001017', name: '周海翔', gender: '男', idCard: '500231199208240036', phone: '13883910299', mappingCode: 'HIS_PER_017', title: '生化质控员', status: '在职', updatedAt: '2026-10-30 08:55' },
  { id: 'PER-18', instCode: '001', deptCode: '001004', deptName: '临床免疫发光组', empNo: '001018', name: '何彩霞', gender: '女', idCard: '500231199011150048', phone: '13783910300', mappingCode: 'HIS_PER_018', title: '免疫检验技师', status: '在职', updatedAt: '2026-10-29 16:40' },
  { id: 'PER-19', instCode: '001', deptCode: '001005', deptName: '微生物与药敏实验室', empNo: '001019', name: '罗建平', gender: '男', idCard: '500231198805090052', phone: '13683910311', mappingCode: 'HIS_PER_019', title: '微生物高级技师', status: '在职', updatedAt: '2026-10-29 14:20' },
  { id: 'PER-20', instCode: '001', deptCode: '001007', deptName: '临床输血科', empNo: '001020', name: '方晓燕', gender: '女', idCard: '500231199407300064', phone: '13583910322', mappingCode: 'HIS_PER_020', title: '输血科技师', status: '在职', updatedAt: '2026-10-29 10:05' },
];

// 3. 用户管理数据模型 (对应截图 image_1faa7ad9.png)
export interface UserAccountItem {
  id: string;
  instCode: string; // 所属单位编码 (001)
  instName: string; // 所属单位名称 (中心医院)
  empNo: string; // 人员编号 (001001)
  realName: string; // 姓名 (张珊)
  gender: '男' | '女'; // 性别
  username: string; // 用户名 (ZS)
  lockStatus: '正常' | '锁定'; // 锁定状态
  userStatus: '有效' | '停用'; // 用户状态
  operator: string; // 操作人 (景敏(主任))
  operatorTime: string; // 操作时间 (2026-10-30 09:58)
  roleName?: string;
  deptGroup?: string;
}

const INITIAL_USERS: UserAccountItem[] = [
  { id: 'USR-01', instCode: '001', instName: '中心医院', empNo: '001001', realName: '张珊', gender: '女', username: 'ZS', lockStatus: '正常', userStatus: '有效', operator: '景敏(主任)', operatorTime: '2026-10-30 09:58' },
  { id: 'USR-02', instCode: '001', instName: '中心医院', empNo: '001002', realName: '景敏', gender: '女', username: 'JM', lockStatus: '锁定', userStatus: '停用', operator: '系统管理员', operatorTime: '2026-10-30 09:50' },
  { id: 'USR-03', instCode: '001', instName: '中心医院', empNo: '001003', realName: '刘全', gender: '男', username: 'LQ', lockStatus: '正常', userStatus: '有效', operator: '景敏(主任)', operatorTime: '2026-10-30 09:30' },
  { id: 'USR-04', instCode: '001', instName: '中心医院', empNo: '001004', realName: '吴文彬', gender: '男', username: 'WWB', lockStatus: '正常', userStatus: '有效', operator: '景敏(主任)', operatorTime: '2026-10-30 09:15' },
  { id: 'USR-05', instCode: '001', instName: '中心医院', empNo: '001005', realName: '黄淑珍', gender: '女', username: 'HSZ', lockStatus: '正常', userStatus: '有效', operator: '景敏(主任)', operatorTime: '2026-10-29 17:40' },
  { id: 'USR-06', instCode: '001', instName: '中心医院', empNo: '001006', realName: '蔡雨君', gender: '女', username: 'CYJ', lockStatus: '正常', userStatus: '有效', operator: '系统管理员', operatorTime: '2026-10-29 16:20' },
  { id: 'USR-07', instCode: '001', instName: '中心医院', empNo: '001007', realName: '李明强', gender: '男', username: 'LMQ', lockStatus: '正常', userStatus: '有效', operator: '景敏(主任)', operatorTime: '2026-10-29 15:10' },
  { id: 'USR-08', instCode: '001', instName: '中心医院', empNo: '001008', realName: '王秀兰', gender: '女', username: 'WXL', lockStatus: '正常', userStatus: '有效', operator: '景敏(主任)', operatorTime: '2026-10-29 14:00' },
  { id: 'USR-09', instCode: '001', instName: '中心医院', empNo: '001009', realName: '陈天宇', gender: '男', username: 'CTY', lockStatus: '正常', userStatus: '有效', operator: '景敏(主任)', operatorTime: '2026-10-29 11:30' },
  { id: 'USR-10', instCode: '001', instName: '中心医院', empNo: '001010', realName: '孙志强', gender: '男', username: 'SZQ', lockStatus: '正常', userStatus: '有效', operator: '系统管理员', operatorTime: '2026-10-29 09:20' },
  { id: 'USR-11', instCode: '002', instName: '城东社区卫生服务中心', empNo: '002001', realName: '陈敏', gender: '女', username: 'CM', lockStatus: '正常', userStatus: '有效', operator: '景敏(主任)', operatorTime: '2026-10-28 16:45' },
  { id: 'USR-12', instCode: '002', instName: '城东社区卫生服务中心', empNo: '002002', realName: '李远山', gender: '男', username: 'LYS', lockStatus: '正常', userStatus: '有效', operator: '景敏(主任)', operatorTime: '2026-10-28 14:10' },
  { id: 'USR-13', instCode: '003', instName: '滨江街道社区卫生服务中心', empNo: '003001', realName: '林青', gender: '女', username: 'LQING', lockStatus: '锁定', userStatus: '停用', operator: '景敏(主任)', operatorTime: '2026-10-28 11:00' },
  { id: 'USR-14', instCode: '004', instName: '科技城社区卫生服务中心', empNo: '004001', realName: '孙伟', gender: '男', username: 'SW', lockStatus: '正常', userStatus: '有效', operator: '系统管理员', operatorTime: '2026-10-28 09:30' },
  { id: 'USR-15', instCode: '005', instName: '康复第二分院', empNo: '005001', realName: '郑美玲', gender: '女', username: 'ZML', lockStatus: '正常', userStatus: '有效', operator: '景敏(主任)', operatorTime: '2026-10-27 17:20' },
];

// 4. 角色权限数据模型 (对应截图 image_a0fc28d6.png 与 image_6c207212.png)
export interface RoleItem {
  id: string;
  instCode: string; // 所属单位编码 (001)
  roleCode: string; // 角色编号 (001001)
  roleName: string; // 角色名称 (超级管理员)
  status: '启用' | '停用'; // 状态 (启用/停用)
  desc: string; // 角色描述
  permissions: string[]; // 功能权限列表
  assignedUserIds: string[]; // 关联的用户ID列表
}

const INITIAL_ROLES: RoleItem[] = [
  {
    id: 'ROLE-01',
    instCode: '001',
    roleCode: '001001',
    roleName: '超级管理员 / 科主任',
    status: '启用',
    desc: '具备检验系统全功能模块读写、批审核放行、危急值处置与系统参数最高管控权。',
    permissions: [
      '系统管理',
      '组织机构管理',
      '人员管理',
      '用户管理',
      '标本采集与前处理',
      '扫码签收',
      '标本分捡',
      '检验业务功能',
      '临生免系统',
      '图文报告',
      '微生物系统',
      '耗材管理',
      '区域检验',
      '通信配置',
      '系统设置',
    ],
    assignedUserIds: ['USR-01', 'USR-02', 'USR-03', 'USR-04', 'USR-06'],
  },
  {
    id: 'ROLE-02',
    instCode: '001',
    roleCode: '001002',
    roleName: '检验医师 / 复核组',
    status: '启用',
    desc: '支持检验结果自动审核校验、二/三级医师复核审签、危急值处置与病历调阅。',
    permissions: ['系统管理', '人员管理', '标本采集与前处理', '扫码签收', '检验业务功能', '临生免系统', '图文报告', '微生物系统', '区域检验'],
    assignedUserIds: ['USR-02', 'USR-03', 'USR-07'],
  },
  {
    id: 'ROLE-03',
    instCode: '001',
    roleCode: '001003',
    roleName: '检验技师 / 上机组',
    status: '启用',
    desc: '标本接收扫码、仪器上机录入、室内质控(QC)录入与初审发单。',
    permissions: ['标本采集与前处理', '扫码签收', '标本分捡', '检验业务功能', '临生免系统', '图文报告'],
    assignedUserIds: ['USR-03', 'USR-04', 'USR-08', 'USR-09'],
  },
  {
    id: 'ROLE-04',
    instCode: '001',
    roleCode: '001004',
    roleName: '区域送检管理员',
    status: '启用',
    desc: '医联体送检开单、扫码签收、转诊单管理、报告回传与区域标本冷链追溯。',
    permissions: ['标本采集与前处理', '扫码签收', '检验业务功能', '区域检验', '通信配置'],
    assignedUserIds: ['USR-06', 'USR-11', 'USR-12'],
  },
  {
    id: 'ROLE-05',
    instCode: '001',
    roleCode: '001005',
    roleName: '微生物专业组长',
    status: '启用',
    desc: '负责细菌培养鉴定、药敏试验卡录入及微生物危急值审签。',
    permissions: ['检验业务功能', '微生物系统', '图文报告', '耗材管理'],
    assignedUserIds: ['USR-05'],
  },
  {
    id: 'ROLE-06',
    instCode: '001',
    roleCode: '001006',
    roleName: '临床输血主管',
    status: '启用',
    desc: '血型鉴定、交叉配血、用血申请审签及血库库存监控。',
    permissions: ['检验业务功能', '图文报告', '耗材管理', '系统设置'],
    assignedUserIds: ['USR-07'],
  },
  {
    id: 'ROLE-07',
    instCode: '001',
    roleCode: '001007',
    roleName: '分子生物学工程师',
    status: '启用',
    desc: 'PCR基因扩增检测、核酸提纯分析与分子诊断报告复核。',
    permissions: ['检验业务功能', '图文报告', '微生物系统'],
    assignedUserIds: ['USR-10'],
  },
  {
    id: 'ROLE-08',
    instCode: '001',
    roleCode: '001008',
    roleName: '门诊集中采血护师',
    status: '启用',
    desc: '门诊患者条形码扫码核对、静脉采血与标本装运冷链签收。',
    permissions: ['标本采集与前处理', '扫码签收', '标本分捡'],
    assignedUserIds: ['USR-08'],
  },
  {
    id: 'ROLE-09',
    instCode: '001',
    roleCode: '001009',
    roleName: '标本前处理调度员',
    status: '启用',
    desc: '病区与社卫外送标本离心、分装、打号与离心机调配。',
    permissions: ['标本采集与前处理', '扫码签收', '标本分捡'],
    assignedUserIds: ['USR-09'],
  },
  {
    id: 'ROLE-10',
    instCode: '001',
    roleCode: '001010',
    roleName: '系统质控与参数分析员',
    status: '启用',
    desc: '负责 Westgard 多规则质控分析、仪器偏差修正与失控登记。',
    permissions: ['检验业务功能', '临生免系统', '通信配置', '系统设置'],
    assignedUserIds: ['USR-10'],
  },
  {
    id: 'ROLE-11',
    instCode: '001',
    roleCode: '001011',
    roleName: '临检室实习培训员',
    status: '停用',
    desc: '基础检验上机操作与实习带教，无独立报告审核放行权。',
    permissions: ['标本采集与前处理', '扫码签收'],
    assignedUserIds: ['USR-13'],
  },
  {
    id: 'ROLE-12',
    instCode: '001',
    roleCode: '001012',
    roleName: '设备通信维保员',
    status: '启用',
    desc: '串口/网口通信协议调试、ASTM/HL7 数据抓包与中间件升级。',
    permissions: ['通信配置', '系统设置'],
    assignedUserIds: ['USR-14'],
  },
];

// 5. 码表字典数据模型
interface CodeTableItem {
  id: string;
  categoryCode: string;
  categoryName: string;
  itemCode: string;
  itemName: string;
  pinyinCode: string;
  sortNo: number;
  isDefault: boolean;
  status: '启用' | '停用';
}

const INITIAL_CODE_TABLES: CodeTableItem[] = [
  { id: 'CT-01', categoryCode: 'SPEC_TYPE', categoryName: '标本类型码表', itemCode: '01', itemName: '全血 (Whole Blood)', pinyinCode: 'QX', sortNo: 1, isDefault: true, status: '启用' },
  { id: 'CT-02', categoryCode: 'SPEC_TYPE', categoryName: '标本类型码表', itemCode: '02', itemName: '血清 (Serum)', pinyinCode: 'XQ', sortNo: 2, isDefault: false, status: '启用' },
  { id: 'CT-03', categoryCode: 'SPEC_TYPE', categoryName: '标本类型码表', itemCode: '03', itemName: '血浆 (Plasma)', pinyinCode: 'XJ', sortNo: 3, isDefault: false, status: '启用' },
  { id: 'CT-04', categoryCode: 'URGENCY', categoryName: '紧急程度码表', itemCode: 'ROUTINE', itemName: '常规 (Routine)', pinyinCode: 'CG', sortNo: 1, isDefault: true, status: '启用' },
  { id: 'CT-05', categoryCode: 'URGENCY', categoryName: '紧急程度码表', itemCode: 'STAT', itemName: '急查 (STAT)', pinyinCode: 'JC', sortNo: 2, isDefault: false, status: '启用' },
  { id: 'CT-06', categoryCode: 'URGENCY', categoryName: '紧急程度码表', itemCode: 'CRISIS', itemName: '危急值 (Crisis)', pinyinCode: 'WJZ', sortNo: 3, isDefault: false, status: '启用' },
  { id: 'CT-07', categoryCode: 'PATIENT_TYPE', categoryName: '患者类别码表', itemCode: 'OUTPATIENT', itemName: '门诊', pinyinCode: 'MZ', sortNo: 1, isDefault: true, status: '启用' },
  { id: 'CT-08', categoryCode: 'PATIENT_TYPE', categoryName: '患者类别码表', itemCode: 'INPATIENT', itemName: '住院', pinyinCode: 'ZY', sortNo: 2, isDefault: false, status: '启用' },
];

// 6. 厂商字典数据模型 (对应截图 image_a7206134.png 与 image_c8459e11.png)
export interface VendorItem {
  id: string;
  instCode: string; // 所属单位编码 (001)
  vendorCode: string; // 厂商编码 (VEN-001)
  vendorName: string; // 厂商/生产商/供应商名称 (奥林巴斯)
  vendorRole: '生产商' | '供应商'; // 角色分类: 生产商 / 供应商
  category: string; // 生产商类型/供应商类型 (设备厂商/试剂厂商)
  phone: string; // 联系电话 (400-820-8208)
  contactPerson: string; // 联系人 (赵立新)
  status: '启用' | '停用'; // 状态 (启用/停用)
  updatedAt: string; // 2026-10-30
}

const INITIAL_VENDORS: VendorItem[] = [
  // ================= 生产商列表 (Manufacturers) =================
  { id: 'MFG-01', instCode: '001', vendorCode: 'MFG-001', vendorName: '奥林巴斯 (中国) 有限公司', vendorRole: '生产商', category: '设备厂商/试剂厂商', phone: '400-820-8208', contactPerson: '赵立新', status: '启用', updatedAt: '2026-10-30 09:30' },
  { id: 'MFG-02', instCode: '001', vendorCode: 'MFG-002', vendorName: '瑞士罗氏诊断产品(中国)有限公司', vendorRole: '生产商', category: '设备厂商/试剂厂商', phone: '400-820-8209', contactPerson: '钱国平', status: '启用', updatedAt: '2026-10-30 09:20' },
  { id: 'MFG-03', instCode: '001', vendorCode: 'MFG-003', vendorName: '日本希森美康医用电子(上海)有限公司', vendorRole: '生产商', category: '设备厂商/试剂厂商', phone: '400-820-1011', contactPerson: '孙伟民', status: '启用', updatedAt: '2026-10-30 09:10' },
  { id: 'MFG-04', instCode: '001', vendorCode: 'MFG-004', vendorName: '美国雅培贸易(上海)有限公司', vendorRole: '生产商', category: '试剂厂商', phone: '800-820-3388', contactPerson: '李浩然', status: '启用', updatedAt: '2026-10-30 08:50' },
  { id: 'MFG-05', instCode: '001', vendorCode: 'MFG-005', vendorName: '深圳迈瑞生物医疗电子股份有限公司', vendorRole: '生产商', category: '设备厂商/试剂厂商', phone: '400-700-3066', contactPerson: '周敏华', status: '启用', updatedAt: '2026-10-29 17:30' },
  { id: 'MFG-06', instCode: '001', vendorCode: 'MFG-006', vendorName: '法国梅里埃诊断产品有限公司', vendorRole: '生产商', category: '设备厂商/试剂厂商', phone: '400-810-6688', contactPerson: '郑建辉', status: '启用', updatedAt: '2026-10-29 16:40' },
  { id: 'MFG-07', instCode: '001', vendorCode: 'MFG-007', vendorName: '美国贝克曼库尔特有限公司', vendorRole: '生产商', category: '设备厂商/试剂厂商', phone: '400-821-8899', contactPerson: '何彩云', status: '启用', updatedAt: '2026-10-29 15:20' },
  { id: 'MFG-08', instCode: '001', vendorCode: 'MFG-008', vendorName: '上海西门子医疗器械有限公司', vendorRole: '生产商', category: '设备厂商', phone: '400-810-8888', contactPerson: '王大伟', status: '启用', updatedAt: '2026-10-29 14:10' },
  { id: 'MFG-09', instCode: '001', vendorCode: 'MFG-009', vendorName: '郑州安图生物工程股份有限公司', vendorRole: '生产商', category: '试剂厂商', phone: '400-600-2828', contactPerson: '陈立明', status: '启用', updatedAt: '2026-10-29 11:30' },
  { id: 'MFG-10', instCode: '001', vendorCode: 'MFG-010', vendorName: '山东新华医疗器械股份有限公司', vendorRole: '生产商', category: '设备厂商', phone: '400-658-0000', contactPerson: '刘桂兰', status: '启用', updatedAt: '2026-10-29 09:40' },
  { id: 'MFG-11', instCode: '001', vendorCode: 'MFG-011', vendorName: '基蛋生物科技股份有限公司', vendorRole: '生产商', category: '试剂厂商/设备厂商', phone: '400-828-0909', contactPerson: '许海燕', status: '停用', updatedAt: '2026-10-28 16:20' },
  { id: 'MFG-12', instCode: '001', vendorCode: 'MFG-012', vendorName: '广州万孚生物技术股份有限公司', vendorRole: '生产商', category: '试剂厂商', phone: '400-880-9988', contactPerson: '潘志鸿', status: '启用', updatedAt: '2026-10-28 14:00' },

  // ================= 供应商列表 (Suppliers) =================
  { id: 'SUP-01', instCode: '001', vendorCode: 'SUP-001', vendorName: '奥林巴斯代理总中心', vendorRole: '供应商', category: '设备厂商/试剂厂商', phone: '023-68881234', contactPerson: '张立国', status: '启用', updatedAt: '2026-10-30 09:35' },
  { id: 'SUP-02', instCode: '001', vendorCode: 'SUP-002', vendorName: '重庆医药集团股份有限公司', vendorRole: '供应商', category: '综合一级供应商/试剂厂商', phone: '023-68881235', contactPerson: '张立国', status: '启用', updatedAt: '2026-10-30 09:25' },
  { id: 'SUP-03', instCode: '001', vendorCode: 'SUP-003', vendorName: '国药控股重庆有限公司', vendorRole: '供应商', category: '综合一级供应商', phone: '023-67895566', contactPerson: '陈胜强', status: '启用', updatedAt: '2026-10-30 09:12' },
  { id: 'SUP-04', instCode: '001', vendorCode: 'SUP-004', vendorName: '重庆华润医药有限公司', vendorRole: '供应商', category: '试剂耗材供应商', phone: '023-85652288', contactPerson: '李晓燕', status: '启用', updatedAt: '2026-10-30 08:45' },
  { id: 'SUP-05', instCode: '001', vendorCode: 'SUP-005', vendorName: '垫江县医疗器械服务有限公司', vendorRole: '供应商', category: '区域设备供应商', phone: '023-85650999', contactPerson: '郭少华', status: '启用', updatedAt: '2026-10-29 17:15' },
  { id: 'SUP-06', instCode: '001', vendorCode: 'SUP-006', vendorName: '渝东医用试剂耗材供应链有限公司', vendorRole: '供应商', category: '试剂耗材供应商', phone: '023-85651188', contactPerson: '刘万祥', status: '启用', updatedAt: '2026-10-29 16:30' },
  { id: 'SUP-07', instCode: '001', vendorCode: 'SUP-007', vendorName: '重庆西南化验器材有限责任公司', vendorRole: '供应商', category: '耗材供应商', phone: '023-63801234', contactPerson: '周海燕', status: '启用', updatedAt: '2026-10-29 15:00' },
  { id: 'SUP-08', instCode: '001', vendorCode: 'SUP-008', vendorName: '重庆博科生物试剂分配中心', vendorRole: '供应商', category: '试剂供应商', phone: '023-65308899', contactPerson: '黄国栋', status: '启用', updatedAt: '2026-10-29 13:50' },
  { id: 'SUP-09', instCode: '001', vendorCode: 'SUP-009', vendorName: '垫江海之源体外诊断试剂中心', vendorRole: '供应商', category: '区域试剂供应商', phone: '023-85653300', contactPerson: '罗志明', status: '启用', updatedAt: '2026-10-29 10:20' },
  { id: 'SUP-10', instCode: '001', vendorCode: 'SUP-010', vendorName: '重庆新科医疗装备技术服务部', vendorRole: '供应商', category: '设备维保供应商', phone: '023-62889900', contactPerson: '施文秀', status: '停用', updatedAt: '2026-10-28 17:00' },
  { id: 'SUP-11', instCode: '001', vendorCode: 'SUP-011', vendorName: '渝东北基层医疗耗材配送中心', vendorRole: '供应商', category: '基层耗材供应商', phone: '023-85654400', contactPerson: '戴宝林', status: '启用', updatedAt: '2026-10-28 15:10' },
];

// 7. 系统日志数据模型
interface SystemLogItem {
  id: string;
  timestamp: string;
  operator: string;
  ip: string;
  module: string;
  actionType: '登录' | '查询' | '修改' | '删除' | '审签' | '推送';
  details: string;
  durationMs: number;
  result: '成功' | '警告' | '失败';
}

const INITIAL_LOGS: SystemLogItem[] = [
  { id: 'LOG-8801', timestamp: '2026-10-30 09:58:22', operator: '景敏 (主任)', ip: '192.168.1.101', module: '程序更新配置', actionType: '推送', details: '向全院15台工控终端推送 LIS-Comm Agent v4.8.2 中间件补丁', durationMs: 120, result: '成功' },
  { id: 'LOG-8802', timestamp: '2026-10-30 09:55:18', operator: '张珊 (技师)', ip: '192.168.1.105', module: '送检签收平台', actionType: '审签', details: '批量签收城东社区外送标本 18 管，冷链箱温控 4.2℃ 校验合格', durationMs: 45, result: '成功' },
  { id: 'LOG-8803', timestamp: '2026-10-30 09:48:10', operator: '刘全 (工程师)', ip: '192.168.1.110', module: '仪器通信配置', actionType: '修改', details: '调整 Cobas 8000 串口 COM1 波特率至 9600 并更新 ASTM 解析规则', durationMs: 82, result: '成功' },
  { id: 'LOG-8804', timestamp: '2026-10-30 09:30:05', operator: '吴文彬 (技师)', ip: '192.168.1.120', module: '检验报告中心', actionType: '审签', details: '双签核放张太彬(病案22040742)肺炎克雷伯菌药敏报告单', durationMs: 38, result: '成功' },
  { id: 'LOG-8805', timestamp: '2026-10-30 09:12:00', operator: '黄淑珍 (工程师)', ip: '192.168.1.125', module: '用户与权限', actionType: '登录', details: '完成 CA 数字证书身份二次鉴权登录成功', durationMs: 15, result: '成功' },
];

export const SystemSettingsWorkstation: React.FC<SystemSettingsWorkstationProps> = ({
  subId,
  user,
  triggerAction,
  onSelectSubMenu,
}) => {
  // Current active submenu based on user selection
  const currentSub = subId || 'sys-org';

  // 1. Toast
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // State data arrays
  const [institutions, setInstitutions] = useState<InstitutionItem[]>(INITIAL_INSTITUTIONS);
  const [departments, setDepartments] = useState<DepartmentItem[]>(INITIAL_DEPARTMENTS);
  const [personnel, setPersonnel] = useState<PersonnelItem[]>(INITIAL_PERSONNEL);
  const [users, setUsers] = useState<UserAccountItem[]>(INITIAL_USERS);
  const [roles, setRoles] = useState<RoleItem[]>(INITIAL_ROLES);
  const [codeTables, setCodeTables] = useState<CodeTableItem[]>(INITIAL_CODE_TABLES);
  const [vendors, setVendors] = useState<VendorItem[]>(INITIAL_VENDORS);
  const [logs, setLogs] = useState<SystemLogItem[]>(INITIAL_LOGS);

  // -------------------- 1. 组织机构管理 (对应截图 image_ba697ddf.png) 状态 --------------------
  // Left Panel (机构列表) State
  const [searchInstQuery, setSearchInstQuery] = useState('');
  const [selectedInstCode, setSelectedInstCode] = useState<string>('001'); // 默认选中 '001' (中心医院)
  const [instPage, setInstPage] = useState<number>(1);

  // Right Panel (部门列表) State
  const [searchDeptQuery, setSearchDeptQuery] = useState('');
  const [showDisabledDept, setShowDisabledDept] = useState<boolean>(false);
  const [deptPage, setDeptPage] = useState<number>(1);

  // Modal 1: 新增 / 编辑 机构 Modal State
  const [showInstModal, setShowInstModal] = useState<boolean>(false);
  const [editingInst, setEditingInst] = useState<InstitutionItem | null>(null);
  const [instFormCode, setInstFormCode] = useState('');
  const [instFormName, setInstFormName] = useState('');
  const [instFormCategory, setInstFormCategory] = useState('中心医院');
  const [instFormLeader, setInstFormLeader] = useState('');
  const [instFormPhone, setInstFormPhone] = useState('');
  const [instFormAddress, setInstFormAddress] = useState('');

  // Modal 2: 新增 / 编辑 部门 Modal State
  const [showDeptModal, setShowDeptModal] = useState<boolean>(false);
  const [editingDept, setEditingDept] = useState<DepartmentItem | null>(null);
  const [deptFormCode, setDeptFormCode] = useState('');
  const [deptFormName, setDeptFormName] = useState('');
  const [deptFormInstCode, setDeptFormInstCode] = useState('001');
  const [deptFormParent, setDeptFormParent] = useState('');
  const [deptFormCategory, setDeptFormCategory] = useState('临床');
  const [deptFormType, setDeptFormType] = useState('科室');
  const [deptFormPhone, setDeptFormPhone] = useState('');
  const [deptFormMappingCode, setDeptFormMappingCode] = useState('');
  const [deptFormLeader, setDeptFormLeader] = useState('');

  // Helper: 打开机构弹窗
  const handleOpenInstModal = (inst?: InstitutionItem) => {
    if (inst) {
      setEditingInst(inst);
      setInstFormCode(inst.code);
      setInstFormName(inst.name);
      setInstFormCategory(inst.category);
      setInstFormLeader(inst.leader);
      setInstFormPhone(inst.phone);
      setInstFormAddress(inst.address);
    } else {
      setEditingInst(null);
      const nextCode = String(institutions.length + 1).padStart(3, '0');
      setInstFormCode(nextCode);
      setInstFormName('');
      setInstFormCategory('中心医院');
      setInstFormLeader('刘全工程师');
      setInstFormPhone('023-85650888');
      setInstFormAddress('重庆市垫江县新城大道88号');
    }
    setShowInstModal(true);
  };

  // Helper: 保存机构
  const handleSaveInst = () => {
    if (!instFormName.trim()) {
      showToast('请输入机构名称！');
      return;
    }
    if (editingInst) {
      setInstitutions(
        institutions.map((i) =>
          i.id === editingInst.id
            ? {
                ...i,
                code: instFormCode,
                name: instFormName,
                category: instFormCategory,
                leader: instFormLeader,
                phone: instFormPhone,
                address: instFormAddress,
              }
            : i
        )
      );
      showToast(`机构【${instFormName}】修改保存成功！`);
    } else {
      const newInst: InstitutionItem = {
        id: `INST-${Date.now()}`,
        code: instFormCode,
        name: instFormName,
        category: instFormCategory,
        leader: instFormLeader,
        phone: instFormPhone,
        address: instFormAddress,
        status: '启用',
      };
      setInstitutions([newInst, ...institutions]);
      showToast(`新增机构【${instFormName}】保存成功！`);
    }
    setShowInstModal(false);
    triggerAction(`保存机构: ${instFormName}`);
  };

  // Helper: 打开部门弹窗
  const handleOpenDeptModal = (dept?: DepartmentItem) => {
    if (dept) {
      setEditingDept(dept);
      setDeptFormCode(dept.code);
      setDeptFormName(dept.name);
      setDeptFormInstCode(dept.instCode);
      setDeptFormParent(dept.parentDept);
      setDeptFormCategory(dept.category);
      setDeptFormType(dept.deptType);
      setDeptFormPhone(dept.phone);
      setDeptFormMappingCode(dept.mappingCode);
      setDeptFormLeader(dept.leader);
    } else {
      setEditingDept(null);
      const targetInst = selectedInstCode || '001';
      const nextCode = `${targetInst}${String(departments.length + 1).padStart(3, '0')}`;
      setDeptFormCode(nextCode);
      setDeptFormName('');
      setDeptFormInstCode(targetInst);
      setDeptFormParent('检验科');
      setDeptFormCategory('临床');
      setDeptFormType('科室');
      setDeptFormPhone('10239012312');
      setDeptFormMappingCode(`HIS_${nextCode}`);
      setDeptFormLeader('吴文彬技师');
    }
    setShowDeptModal(true);
  };

  // Helper: 保存部门
  const handleSaveDept = () => {
    if (!deptFormName.trim()) {
      showToast('请输入部门名称！');
      return;
    }
    if (editingDept) {
      setDepartments(
        departments.map((d) =>
          d.id === editingDept.id
            ? {
                ...d,
                code: deptFormCode,
                name: deptFormName,
                instCode: deptFormInstCode,
                parentDept: deptFormParent,
                category: deptFormCategory,
                deptType: deptFormType,
                phone: deptFormPhone,
                mappingCode: deptFormMappingCode,
                leader: deptFormLeader,
                updatedAt: '2026-10-30 10:00',
              }
            : d
        )
      );
      showToast(`部门【${deptFormName}】修改保存成功！`);
    } else {
      const newDept: DepartmentItem = {
        id: `DEPT-${Date.now()}`,
        instCode: deptFormInstCode,
        code: deptFormCode,
        name: deptFormName,
        parentDept: deptFormParent,
        category: deptFormCategory,
        deptType: deptFormType,
        phone: deptFormPhone,
        mappingCode: deptFormMappingCode,
        status: '启用',
        leader: deptFormLeader,
        updatedAt: '2026-10-30 10:00',
      };
      setDepartments([newDept, ...departments]);
      showToast(`新增部门【${deptFormName}】保存成功！`);
    }
    setShowDeptModal(false);
    triggerAction(`保存部门: ${deptFormName}`);
  };

  // -------------------- 2. 人员管理 (对应截图 image_25e59655.png) 状态 --------------------
  // Left Panel (部门列表) Filter & State
  const [perInstFilter, setPerInstFilter] = useState<string>('001'); // 默认 '001' (中心医院)
  const [perDeptQuery, setPerDeptQuery] = useState<string>('');
  const [perSelectedDeptCode, setPerSelectedDeptCode] = useState<string>('001001'); // 默认选中 '001001' (检验科)
  const [perLeftPage, setPerLeftPage] = useState<number>(1);

  // Right Panel (人员列表) Filter & State
  const [perPersonnelQuery, setPerPersonnelQuery] = useState<string>('');
  const [perRightPage, setPerRightPage] = useState<number>(1);

  // Modal 3: 新增 / 编辑 人员 Modal State
  const [showPersonnelModal, setShowPersonnelModal] = useState<boolean>(false);
  const [editingPersonnel, setEditingPersonnel] = useState<PersonnelItem | null>(null);
  const [perFormEmpNo, setPerFormEmpNo] = useState('');
  const [perFormName, setPerFormName] = useState('');
  const [perFormGender, setPerFormGender] = useState<'男' | '女'>('男');
  const [perFormIdCard, setPerFormIdCard] = useState('');
  const [perFormPhone, setPerFormPhone] = useState('');
  const [perFormMappingCode, setPerFormMappingCode] = useState('');
  const [perFormInstCode, setPerFormInstCode] = useState('001');
  const [perFormDeptCode, setPerFormDeptCode] = useState('001001');
  const [perFormTitle, setPerFormTitle] = useState('主管检验师');

  // Helper: 打开人员弹窗
  const handleOpenPersonnelModal = (person?: PersonnelItem) => {
    if (person) {
      setEditingPersonnel(person);
      setPerFormEmpNo(person.empNo);
      setPerFormName(person.name);
      setPerFormGender(person.gender);
      setPerFormIdCard(person.idCard);
      setPerFormPhone(person.phone);
      setPerFormMappingCode(person.mappingCode);
      setPerFormInstCode(person.instCode);
      setPerFormDeptCode(person.deptCode);
      setPerFormTitle(person.title);
    } else {
      setEditingPersonnel(null);
      const nextNo = String(personnel.length + 1).padStart(3, '0');
      setPerFormEmpNo(`001${nextNo}`);
      setPerFormName('');
      setPerFormGender('男');
      setPerFormIdCard('500231199305100038');
      setPerFormPhone('13983910288');
      setPerFormMappingCode(`HIS_PER_0${personnel.length + 1}`);
      setPerFormInstCode(perInstFilter || '001');
      setPerFormDeptCode(perSelectedDeptCode || '001001');
      setPerFormTitle('主管检验师');
    }
    setShowPersonnelModal(true);
  };

  // Helper: 保存人员
  const handleSavePersonnel = () => {
    if (!perFormName.trim()) {
      showToast('请输入人员姓名！');
      return;
    }
    const currentDeptObj = departments.find((d) => d.code === perFormDeptCode);
    const targetDeptName = currentDeptObj ? currentDeptObj.name : '检验科';

    if (editingPersonnel) {
      setPersonnel(
        personnel.map((p) =>
          p.id === editingPersonnel.id
            ? {
                ...p,
                empNo: perFormEmpNo,
                name: perFormName,
                gender: perFormGender,
                idCard: perFormIdCard,
                phone: perFormPhone,
                mappingCode: perFormMappingCode,
                instCode: perFormInstCode,
                deptCode: perFormDeptCode,
                deptName: targetDeptName,
                title: perFormTitle,
                updatedAt: '2026-10-30 10:15',
              }
            : p
        )
      );
      showToast(`人员档案【${perFormName}】修改保存成功！`);
    } else {
      const newPerson: PersonnelItem = {
        id: `PER-${Date.now()}`,
        instCode: perFormInstCode,
        deptCode: perFormDeptCode,
        deptName: targetDeptName,
        empNo: perFormEmpNo,
        name: perFormName,
        gender: perFormGender,
        idCard: perFormIdCard,
        phone: perFormPhone,
        mappingCode: perFormMappingCode,
        title: perFormTitle,
        status: '在职',
        updatedAt: '2026-10-30 10:15',
      };
      setPersonnel([newPerson, ...personnel]);
      showToast(`新增人员档案【${perFormName}】保存成功！`);
    }
    setShowPersonnelModal(false);
    triggerAction(`保存人员档案: ${perFormName}`);
  };

  // -------------------- 3. 用户管理 (对应截图 image_1faa7ad9.png) 状态 --------------------
  const [usrInstFilter, setUsrInstFilter] = useState<string>('001'); // 默认 '001' (中心医院)
  const [usrInfoQuery, setUsrInfoQuery] = useState<string>(''); // 用户信息 (姓名/账号/人员编号)
  const [usrLockFilter, setUsrLockFilter] = useState<string>('ALL'); // 锁定状态 (所有, 正常, 锁定)
  const [usrStatusFilter, setUsrStatusFilter] = useState<string>('ALL'); // 用户状态 (所有, 有效, 停用)
  const [usrPage, setUsrPage] = useState<number>(1); // 一页帮我显示10条数据

  // Modal 4: 新增 / 编辑 用户 弹窗 State
  const [showUserModal, setShowUserModal] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<UserAccountItem | null>(null);
  const [usrFormEmpNo, setUsrFormEmpNo] = useState('');
  const [usrFormRealName, setUsrFormRealName] = useState('');
  const [usrFormGender, setUsrFormGender] = useState<'男' | '女'>('男');
  const [usrFormUsername, setUsrFormUsername] = useState('');
  const [usrFormInstCode, setUsrFormInstCode] = useState('001');
  const [usrFormLockStatus, setUsrFormLockStatus] = useState<'正常' | '锁定'>('正常');
  const [usrFormUserStatus, setUsrFormUserStatus] = useState<'有效' | '停用'>('有效');

  // Helper: 打开新增/编辑用户弹窗
  const handleOpenUserModal = (userItem?: UserAccountItem) => {
    if (userItem) {
      setEditingUser(userItem);
      setUsrFormEmpNo(userItem.empNo);
      setUsrFormRealName(userItem.realName);
      setUsrFormGender(userItem.gender);
      setUsrFormUsername(userItem.username);
      setUsrFormInstCode(userItem.instCode);
      setUsrFormLockStatus(userItem.lockStatus);
      setUsrFormUserStatus(userItem.userStatus);
    } else {
      setEditingUser(null);
      const nextNo = String(users.length + 1).padStart(3, '0');
      setUsrFormEmpNo(`001${nextNo}`);
      setUsrFormRealName('');
      setUsrFormGender('男');
      setUsrFormUsername(`USER_${nextNo}`);
      setUsrFormInstCode(usrInstFilter || '001');
      setUsrFormLockStatus('正常');
      setUsrFormUserStatus('有效');
    }
    setShowUserModal(true);
  };

  // Helper: 保存用户
  const handleSaveUser = () => {
    if (!usrFormRealName.trim() || !usrFormUsername.trim()) {
      showToast('请输入姓名和登录账号！');
      return;
    }
    const currentInst = institutions.find((i) => i.code === usrFormInstCode);
    const targetInstName = currentInst ? currentInst.name : '中心医院';

    if (editingUser) {
      setUsers(
        users.map((u) =>
          u.id === editingUser.id
            ? {
                ...u,
                empNo: usrFormEmpNo,
                realName: usrFormRealName,
                gender: usrFormGender,
                username: usrFormUsername,
                instCode: usrFormInstCode,
                instName: targetInstName,
                lockStatus: usrFormLockStatus,
                userStatus: usrFormUserStatus,
                operator: user.name || '景敏(主任)',
                operatorTime: '2026-10-30 10:20',
              }
            : u
        )
      );
      showToast(`用户账号【${usrFormUsername}】修改保存成功！`);
    } else {
      const newUser: UserAccountItem = {
        id: `USR-${Date.now()}`,
        instCode: usrFormInstCode,
        instName: targetInstName,
        empNo: usrFormEmpNo,
        realName: usrFormRealName,
        gender: usrFormGender,
        username: usrFormUsername,
        lockStatus: usrFormLockStatus,
        userStatus: usrFormUserStatus,
        operator: user.name || '景敏(主任)',
        operatorTime: '2026-10-30 10:20',
      };
      setUsers([newUser, ...users]);
      showToast(`新增用户账号【${usrFormUsername}】成功！`);
    }
    setShowUserModal(false);
    triggerAction(`保存用户账号: ${usrFormUsername}`);
  };

  // Modal 4.5: 重置用户密码 弹窗 State
  const [showResetPasswordModal, setShowResetPasswordModal] = useState<boolean>(false);
  const [resettingUser, setResettingUser] = useState<UserAccountItem | null>(null);
  const [resetPasswordMode, setResetPasswordMode] = useState<'default' | 'custom'>('default');
  const [customNewPassword, setCustomNewPassword] = useState('123456');
  const [customConfirmPassword, setCustomConfirmPassword] = useState('123456');
  const [showPasswordText, setShowPasswordText] = useState<boolean>(false);
  const [forceChangeNextLogin, setForceChangeNextLogin] = useState<boolean>(true);
  const [sendSmsNotice, setSendSmsNotice] = useState<boolean>(true);

  // Helper: 打开重置密码弹窗
  const handleOpenResetPasswordModal = (userItem: UserAccountItem) => {
    setResettingUser(userItem);
    setResetPasswordMode('default');
    setCustomNewPassword('123456');
    setCustomConfirmPassword('123456');
    setShowPasswordText(false);
    setForceChangeNextLogin(true);
    setSendSmsNotice(true);
    setShowResetPasswordModal(true);
  };

  // Helper: 随机密码生成器
  const handleGenerateRandomPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
    let randPass = '';
    for (let i = 0; i < 10; i++) {
      randPass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCustomNewPassword(randPass);
    setCustomConfirmPassword(randPass);
    setShowPasswordText(true);
    showToast(`已成功生成随机强密码: ${randPass}`);
  };

  // Helper: 提交重置密码
  const handleConfirmResetPassword = () => {
    if (!resettingUser) return;

    let targetPassword = '123456';
    if (resetPasswordMode === 'custom') {
      if (!customNewPassword.trim()) {
        showToast('请输入新密码！');
        return;
      }
      if (customNewPassword !== customConfirmPassword) {
        showToast('两次输入的密码不一致，请重新检查！');
        return;
      }
      if (customNewPassword.length < 6) {
        showToast('新密码长度不能少于 6 位！');
        return;
      }
      targetPassword = customNewPassword;
    }

    // 更新用户列表中该账号的操作时间和操作人
    setUsers(
      users.map((u) =>
        u.id === resettingUser.id
          ? {
              ...u,
              operator: user.name || '景敏(主任)',
              operatorTime: '2026-10-30 10:45',
            }
          : u
      )
    );

    showToast(
      `用户【${resettingUser.realName} (${resettingUser.username})】密码重置成功！新密码为【${targetPassword}】${
        sendSmsNotice ? '（已自动发送短信通知）' : ''
      }`
    );
    setShowResetPasswordModal(false);
    triggerAction(`重置用户密码: ${resettingUser.username}`);
  };

  // Search inputs
  const [searchTerm, setSearchTerm] = useState('');

  // -------------------- 4. 角色权限管理 (对应截图 image_a0fc28d6.png 与 image_6c207212.png) 状态 --------------------
  const [roleInstFilter, setRoleInstFilter] = useState<string>('001'); // 单位名称
  const [roleInfoQuery, setRoleInfoQuery] = useState<string>(''); // 用户信息/角色查询
  const [roleShowDisabled, setRoleShowDisabled] = useState<boolean>(false); // 显示停用
  const [roleLeftPage, setRoleLeftPage] = useState<number>(1); // 左侧角色列表页码 (一页10条数据)

  // Active Role selection & Tabs
  const [selectedRole, setSelectedRole] = useState<RoleItem>(roles[0] || INITIAL_ROLES[0]);
  const [roleActiveTab, setRoleActiveTab] = useState<'permissions' | 'users'>('permissions'); // 选项卡: 角色权限 | 角色人员
  const [editingRolePermissions, setEditingRolePermissions] = useState<string[]>(roles[0]?.permissions || []);
  const [editingRoleUserIds, setEditingRoleUserIds] = useState<string[]>(roles[0]?.assignedUserIds || []);
  const [roleRightPage, setRoleRightPage] = useState<number>(1); // 右侧角色人员表格页码 (一页10条数据)

  // Modal 5: 新增 / 编辑 角色 弹窗 State
  const [showRoleModal, setShowRoleModal] = useState<boolean>(false);
  const [editingRole, setEditingRole] = useState<RoleItem | null>(null);
  const [roleFormCode, setRoleFormCode] = useState('');
  const [roleFormName, setRoleFormName] = useState('');
  const [roleFormInstCode, setRoleFormInstCode] = useState('001');
  const [roleFormStatus, setRoleFormStatus] = useState<'启用' | '停用'>('启用');
  const [roleFormDesc, setRoleFormDesc] = useState('');

  // Helper: 打开角色弹窗
  const handleOpenRoleModal = (roleItem?: RoleItem) => {
    if (roleItem) {
      setEditingRole(roleItem);
      setRoleFormCode(roleItem.roleCode);
      setRoleFormName(roleItem.roleName);
      setRoleFormInstCode(roleItem.instCode);
      setRoleFormStatus(roleItem.status);
      setRoleFormDesc(roleItem.desc);
    } else {
      setEditingRole(null);
      const nextCode = `001${String(roles.length + 1).padStart(3, '0')}`;
      setRoleFormCode(nextCode);
      setRoleFormName('');
      setRoleFormInstCode(roleInstFilter || '001');
      setRoleFormStatus('启用');
      setRoleFormDesc('具备检验业务对应功能读写与审核授权');
    }
    setShowRoleModal(true);
  };

  // Helper: 保存角色定义
  const handleSaveRole = () => {
    if (!roleFormName.trim()) {
      showToast('请输入角色名称！');
      return;
    }
    if (editingRole) {
      setRoles(
        roles.map((r) =>
          r.id === editingRole.id
            ? {
                ...r,
                roleCode: roleFormCode,
                roleName: roleFormName,
                instCode: roleFormInstCode,
                status: roleFormStatus,
                desc: roleFormDesc,
              }
            : r
        )
      );
      showToast(`角色【${roleFormName}】定义保存成功！`);
    } else {
      const newRole: RoleItem = {
        id: `ROLE-${Date.now()}`,
        instCode: roleFormInstCode,
        roleCode: roleFormCode,
        roleName: roleFormName,
        status: roleFormStatus,
        desc: roleFormDesc,
        permissions: ['系统管理', '标本采集与前处理', '检验业务功能'],
        assignedUserIds: [],
      };
      setRoles([newRole, ...roles]);
      setSelectedRole(newRole);
      setEditingRolePermissions(newRole.permissions);
      setEditingRoleUserIds([]);
      showToast(`新增角色【${roleFormName}】保存成功！`);
    }
    setShowRoleModal(false);
    triggerAction(`保存角色: ${roleFormName}`);
  };

  // Helper toggle role permission
  const handleTogglePermission = (perm: string) => {
    if (editingRolePermissions.includes(perm)) {
      setEditingRolePermissions(editingRolePermissions.filter((p) => p !== perm));
    } else {
      setEditingRolePermissions([...editingRolePermissions, perm]);
    }
  };

  // Helper toggle user assignment in role
  const handleToggleUserAssigned = (userId: string) => {
    if (editingRoleUserIds.includes(userId)) {
      setEditingRoleUserIds(editingRoleUserIds.filter((id) => id !== userId));
    } else {
      setEditingRoleUserIds([...editingRoleUserIds, userId]);
    }
  };

  // Helper toggle select-all users for role
  const handleToggleSelectAllUsers = (availableUsers: UserAccountItem[]) => {
    const availableIds = availableUsers.map((u) => u.id);
    const allSelected = availableIds.every((id) => editingRoleUserIds.includes(id));
    if (allSelected) {
      setEditingRoleUserIds(editingRoleUserIds.filter((id) => !availableIds.includes(id)));
    } else {
      const newSet = new Set([...editingRoleUserIds, ...availableIds]);
      setEditingRoleUserIds(Array.from(newSet));
    }
  };

  // Save Role Permissions Tab
  const handleSaveRolePermissions = () => {
    const updated = roles.map((r) =>
      r.id === selectedRole.id ? { ...r, permissions: editingRolePermissions } : r
    );
    setRoles(updated);
    showToast(`【${selectedRole.roleName}】功能权限列表保存成功！`);
    triggerAction(`保存角色权限: ${selectedRole.roleName}`);
  };

  // Save Role Users Tab
  const handleSaveRoleUsers = () => {
    const updated = roles.map((r) =>
      r.id === selectedRole.id ? { ...r, assignedUserIds: editingRoleUserIds } : r
    );
    setRoles(updated);
    showToast(`【${selectedRole.roleName}】角色关联人员已保存 (已关联 ${editingRoleUserIds.length} 人)！`);
    triggerAction(`保存角色关联人员: ${selectedRole.roleName}`);
  };

  // -------------------- 6. 厂商字典管理 (对应截图 image_a7206134.png 与 image_c8459e11.png) 状态 --------------------
  const [vendorInstFilter, setVendorInstFilter] = useState<string>('001'); // 单位
  const [vendorNameQuery, setVendorNameQuery] = useState<string>(''); // 厂商名称
  const [vendorTypeFilter, setVendorTypeFilter] = useState<string>('ALL'); // 所属类型
  const [vendorShowDisabled, setVendorShowDisabled] = useState<boolean>(false); // 显示停用
  const [vendorActiveTab, setVendorActiveTab] = useState<'manufacturer' | 'supplier'>('manufacturer'); // 选项卡: 生产商 vs 供应商
  const [vendorPage, setVendorPage] = useState<number>(1); // 10条/页

  // Modal 6: 新增 / 编辑 厂商 Modal State
  const [showVendorModal, setShowVendorModal] = useState<boolean>(false);
  const [editingVendor, setEditingVendor] = useState<VendorItem | null>(null);
  const [vendorFormCode, setVendorFormCode] = useState('');
  const [vendorFormName, setVendorFormName] = useState('');
  const [vendorFormRole, setVendorFormRole] = useState<'生产商' | '供应商'>('生产商');
  const [vendorFormCategory, setVendorFormCategory] = useState('设备厂商/试剂厂商');
  const [vendorFormPhone, setVendorFormPhone] = useState('');
  const [vendorFormContact, setVendorFormContact] = useState('');
  const [vendorFormInstCode, setVendorFormInstCode] = useState('001');
  const [vendorFormStatus, setVendorFormStatus] = useState<'启用' | '停用'>('启用');

  // Helper: 打开厂商弹窗
  const handleOpenVendorModal = (vendorItem?: VendorItem) => {
    if (vendorItem) {
      setEditingVendor(vendorItem);
      setVendorFormCode(vendorItem.vendorCode);
      setVendorFormName(vendorItem.vendorName);
      setVendorFormRole(vendorItem.vendorRole);
      setVendorFormCategory(vendorItem.category);
      setVendorFormPhone(vendorItem.phone);
      setVendorFormContact(vendorItem.contactPerson);
      setVendorFormInstCode(vendorItem.instCode);
      setVendorFormStatus(vendorItem.status);
    } else {
      setEditingVendor(null);
      const isMfg = vendorActiveTab === 'manufacturer';
      const count = vendors.filter((v) => (isMfg ? v.vendorRole === '生产商' : v.vendorRole === '供应商')).length;
      const prefix = isMfg ? 'MFG' : 'SUP';
      const nextCode = `${prefix}-${String(count + 1).padStart(3, '0')}`;
      setVendorFormCode(nextCode);
      setVendorFormName('');
      setVendorFormRole(isMfg ? '生产商' : '供应商');
      setVendorFormCategory(isMfg ? '设备厂商/试剂厂商' : '综合一级供应商');
      setVendorFormPhone('023-85658899');
      setVendorFormContact('赵立新');
      setVendorFormInstCode(vendorInstFilter || '001');
      setVendorFormStatus('启用');
    }
    setShowVendorModal(true);
  };

  // Helper: 保存厂商
  const handleSaveVendor = () => {
    if (!vendorFormName.trim()) {
      showToast('请输入厂商名称！');
      return;
    }
    if (editingVendor) {
      setVendors(
        vendors.map((v) =>
          v.id === editingVendor.id
            ? {
                ...v,
                vendorCode: vendorFormCode,
                vendorName: vendorFormName,
                vendorRole: vendorFormRole,
                category: vendorFormCategory,
                phone: vendorFormPhone,
                contactPerson: vendorFormContact,
                instCode: vendorFormInstCode,
                status: vendorFormStatus,
                updatedAt: '2026-10-30 10:30',
              }
            : v
        )
      );
      showToast(`厂商【${vendorFormName}】修改保存成功！`);
    } else {
      const newVendor: VendorItem = {
        id: `VEN-${Date.now()}`,
        instCode: vendorFormInstCode,
        vendorCode: vendorFormCode,
        vendorName: vendorFormName,
        vendorRole: vendorFormRole,
        category: vendorFormCategory,
        phone: vendorFormPhone,
        contactPerson: vendorFormContact,
        status: vendorFormStatus,
        updatedAt: '2026-10-30 10:30',
      };
      setVendors([newVendor, ...vendors]);
      showToast(`新增厂商【${vendorFormName}】成功！`);
    }
    setShowVendorModal(false);
    triggerAction(`保存厂商台账: ${vendorFormName}`);
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



      {/* -------------------- 1. 组织机构管理 (对应截图 image_ba697ddf.png) -------------------- */}
      {currentSub === 'sys-org' && (() => {
        // Left Panel (机构列表) Data Filtering & Pagination
        const filteredInsts = institutions.filter((inst) => {
          if (searchInstQuery.trim()) {
            const q = searchInstQuery.trim().toLowerCase();
            return inst.code.toLowerCase().includes(q) || inst.name.toLowerCase().includes(q) || inst.category.toLowerCase().includes(q);
          }
          return true;
        });

        const instTotalCount = filteredInsts.length;
        const instPageSize = 10; // 用户核心需求：一页帮我显示10条数据
        const instTotalPages = Math.max(1, Math.ceil(instTotalCount / instPageSize));
        const safeInstPage = Math.min(instPage, instTotalPages);
        const instSlice = filteredInsts.slice((safeInstPage - 1) * instPageSize, safeInstPage * instPageSize);

        // Right Panel (部门列表) Data Filtering & Pagination
        const filteredDepts = departments.filter((dept) => {
          // If institution is selected on left, filter departments by instCode
          if (selectedInstCode && dept.instCode !== selectedInstCode) {
            return false;
          }
          if (!showDisabledDept && dept.status === '停用') {
            return false;
          }
          if (searchDeptQuery.trim()) {
            const q = searchDeptQuery.trim().toLowerCase();
            return (
              dept.code.toLowerCase().includes(q) ||
              dept.name.toLowerCase().includes(q) ||
              dept.deptType.toLowerCase().includes(q) ||
              dept.phone.toLowerCase().includes(q) ||
              dept.mappingCode.toLowerCase().includes(q)
            );
          }
          return true;
        });

        const deptTotalCount = filteredDepts.length;
        const deptPageSize = 10; // 用户核心需求：一页帮我显示10条数据
        const deptTotalPages = Math.max(1, Math.ceil(deptTotalCount / deptPageSize));
        const safeDeptPage = Math.min(deptPage, deptTotalPages);
        const deptSlice = filteredDepts.slice((safeDeptPage - 1) * deptPageSize, safeDeptPage * deptPageSize);

        const currentInstObj = institutions.find((i) => i.code === selectedInstCode);

        return (
          <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden bg-slate-100 divide-y md:divide-y-0 md:divide-x divide-slate-200">
            {/* ==================== LEFT PANEL: 机构列表 ==================== */}
            <div className="w-full md:w-[38%] flex flex-col min-h-0 bg-white border-r border-slate-200">
              {/* Left Top Search Bar matching screenshot: 单位信息 [], [查询], [新增机构] */}
              <div className="bg-[#fafafa] border-b border-slate-200 px-3.5 py-2.5 shrink-0 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 flex-1 min-w-[180px]">
                  <span className="text-slate-700 font-medium whitespace-nowrap">单位信息</span>
                  <input
                    type="text"
                    value={searchInstQuery}
                    onChange={(e) => setSearchInstQuery(e.target.value)}
                    placeholder="机构名称/编码"
                    className="w-full px-2.5 py-1 text-xs text-slate-800 bg-white border border-slate-300 rounded focus:outline-hidden focus:border-blue-500 font-mono"
                  />
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* 查询按钮 (白底蓝边) */}
                  <button
                    type="button"
                    onClick={() => {
                      setInstPage(1);
                      showToast(`机构列表查询完毕，共检索到 ${instTotalCount} 条数据`);
                    }}
                    className="px-3 py-1 bg-white border border-[#1890ff] text-[#1890ff] hover:bg-blue-50 text-xs font-medium rounded transition-colors shadow-2xs"
                  >
                    查询
                  </button>

                  {/* 新增机构按钮 (实心蓝底) */}
                  <button
                    type="button"
                    onClick={() => handleOpenInstModal()}
                    className="px-3 py-1 bg-[#1890ff] hover:bg-blue-600 text-white text-xs font-medium rounded transition-colors shadow-2xs"
                  >
                    新增机构
                  </button>
                </div>
              </div>

              {/* Title Bar matching screenshot: 机构列表 (blue bold font) */}
              <div className="px-4 py-2 bg-slate-100 border-b border-slate-200 text-xs font-bold text-[#1890ff] flex items-center justify-between shrink-0">
                <span>机构列表</span>
                <span className="font-normal text-slate-500 text-[11px]">
                  共 {instTotalCount} 条 · 页 {safeInstPage}/{instTotalPages}
                </span>
              </div>

              {/* Left Table Section matching screenshot: 机构编码, 机构名称, 机构性质, 操作 */}
              <div className="flex-1 overflow-auto min-h-0 bg-white">
                <table className="w-full border-collapse text-left text-xs text-slate-700">
                  <thead className="bg-[#fafafa] text-slate-700 font-medium sticky top-0 z-10 border-b border-slate-200">
                    <tr className="border-b border-slate-200">
                      <th className="py-2.5 px-3 whitespace-nowrap font-mono w-20">机构编码</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">机构名称</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">机构性质</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-center w-24">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {instSlice.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-12 text-center text-slate-400">
                          暂无匹配的机构数据
                        </td>
                      </tr>
                    ) : (
                      instSlice.map((inst) => {
                        const isSelected = selectedInstCode === inst.code;
                        return (
                          <tr
                            key={inst.id}
                            onClick={() => {
                              setSelectedInstCode(inst.code);
                              setDeptPage(1);
                            }}
                            className={`cursor-pointer transition-colors ${
                              isSelected
                                ? 'bg-blue-50/80 border-l-4 border-l-[#1890ff] font-medium'
                                : 'hover:bg-slate-50'
                            }`}
                          >
                            {/* 机构编码 */}
                            <td className="py-2.5 px-3 font-mono font-bold text-slate-900 whitespace-nowrap">
                              {inst.code}
                            </td>

                            {/* 机构名称 */}
                            <td className="py-2.5 px-3 text-slate-900 font-medium whitespace-nowrap">
                              {inst.name}
                            </td>

                            {/* 机构性质 */}
                            <td className="py-2.5 px-3 text-slate-700 whitespace-nowrap">
                              {inst.category}
                            </td>

                            {/* 操作: 编辑, 删除 */}
                            <td
                              className="py-2.5 px-3 text-center whitespace-nowrap"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleOpenInstModal(inst)}
                                  className="text-[#1890ff] hover:underline font-medium"
                                >
                                  编辑
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setInstitutions(institutions.filter((i) => i.id !== inst.id));
                                    showToast(`机构【${inst.name}】已成功移除`);
                                  }}
                                  className="text-[#1890ff] hover:underline font-medium hover:text-red-600"
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

              {/* Left Pagination Bar (一页显示10条数据) */}
              <div className="bg-[#fafafa] border-t border-slate-200 px-3.5 py-2 shrink-0 flex items-center justify-between text-xs text-slate-600">
                <span className="font-mono text-[11px]">共 {instTotalCount} 条 · 10条/页</span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={safeInstPage <= 1}
                    onClick={() => setInstPage((p) => Math.max(1, p - 1))}
                    className="px-2 py-0.5 bg-white border border-slate-300 rounded text-[11px] disabled:opacity-40"
                  >
                    上一页
                  </button>
                  <span className="font-mono text-[11px] px-1">
                    {safeInstPage}/{instTotalPages}
                  </span>
                  <button
                    type="button"
                    disabled={safeInstPage >= instTotalPages}
                    onClick={() => setInstPage((p) => Math.min(instTotalPages, p + 1))}
                    className="px-2 py-0.5 bg-white border border-slate-300 rounded text-[11px] disabled:opacity-40"
                  >
                    下一页
                  </button>
                </div>
              </div>
            </div>

            {/* ==================== RIGHT PANEL: 部门列表 ==================== */}
            <div className="w-full md:w-[62%] flex flex-col min-h-0 bg-white">
              {/* Right Top Search Bar matching screenshot: 部门信息 [], [ ]显示停用, [查询], [新增部门] */}
              <div className="bg-[#fafafa] border-b border-slate-200 px-4 py-2.5 shrink-0 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[240px]">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-700 font-medium whitespace-nowrap">部门信息</span>
                    <input
                      type="text"
                      value={searchDeptQuery}
                      onChange={(e) => setSearchDeptQuery(e.target.value)}
                      placeholder="部门名称/编码/电话"
                      className="w-40 px-2.5 py-1 text-xs text-slate-800 bg-white border border-slate-300 rounded focus:outline-hidden focus:border-blue-500 font-mono"
                    />
                  </div>

                  {/* [ ] 显示停用 Checkbox */}
                  <label className="flex items-center gap-1 text-slate-700 font-medium cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={showDisabledDept}
                      onChange={(e) => {
                        setShowDisabledDept(e.target.checked);
                        setDeptPage(1);
                      }}
                      className="rounded text-[#1890ff] focus:ring-0 cursor-pointer"
                    />
                    <span>显示停用</span>
                  </label>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* 查询按钮 (白底蓝边) */}
                  <button
                    type="button"
                    onClick={() => {
                      setDeptPage(1);
                      showToast(`部门列表查询完毕，当前视角共 ${deptTotalCount} 个部门`);
                    }}
                    className="px-3.5 py-1 bg-white border border-[#1890ff] text-[#1890ff] hover:bg-blue-50 text-xs font-medium rounded transition-colors shadow-2xs"
                  >
                    查询
                  </button>

                  {/* 新增部门按钮 (实心蓝底) */}
                  <button
                    type="button"
                    onClick={() => handleOpenDeptModal()}
                    className="px-3.5 py-1 bg-[#1890ff] hover:bg-blue-600 text-white text-xs font-medium rounded transition-colors shadow-2xs"
                  >
                    新增部门
                  </button>
                </div>
              </div>

              {/* Title Bar matching screenshot: 部门列表 (blue bold font) */}
              <div className="px-4 py-2 bg-slate-100 border-b border-slate-200 text-xs font-bold text-[#1890ff] flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <span>部门列表</span>
                  {currentInstObj && (
                    <span className="text-[11px] px-2 py-0.2 rounded bg-blue-50 text-blue-700 font-normal border border-blue-200">
                      筛选: {currentInstObj.name} ({currentInstObj.code})
                    </span>
                  )}
                </div>
                <span className="font-normal text-slate-500 text-[11px]">
                  共 {deptTotalCount} 个部门 · 页 {safeDeptPage}/{deptTotalPages}
                </span>
              </div>

              {/* Right Table Section matching screenshot: 部门编码, 部门名称, 上级部门, 部门性质, 部门类型, 联系电话, 对照编码, 状态, 操作 */}
              <div className="flex-1 overflow-auto min-h-0 bg-white">
                <table className="w-full border-collapse text-left text-xs text-slate-700">
                  <thead className="bg-[#fafafa] text-slate-700 font-medium sticky top-0 z-10 border-b border-slate-200">
                    <tr className="border-b border-slate-200">
                      <th className="py-2.5 px-3 whitespace-nowrap font-mono">部门编码</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">部门名称</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">上级部门</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">部门性质</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">部门类型</th>
                      <th className="py-2.5 px-3 whitespace-nowrap font-mono">联系电话</th>
                      <th className="py-2.5 px-3 whitespace-nowrap font-mono">对照编码</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-center">状态</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-center w-28">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {deptSlice.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="py-12 text-center text-slate-400">
                          暂无匹配的部门组织数据
                        </td>
                      </tr>
                    ) : (
                      deptSlice.map((dept) => (
                        <tr key={dept.id} className="hover:bg-blue-50/50 transition-colors">
                          {/* 部门编码 */}
                          <td className="py-2.5 px-3 font-mono font-bold text-slate-900 whitespace-nowrap">
                            {dept.code}
                          </td>

                          {/* 部门名称 */}
                          <td className="py-2.5 px-3 font-semibold text-slate-900 whitespace-nowrap">
                            {dept.name}
                          </td>

                          {/* 上级部门 */}
                          <td className="py-2.5 px-3 text-slate-600 whitespace-nowrap">
                            {dept.parentDept || '-'}
                          </td>

                          {/* 部门性质 */}
                          <td className="py-2.5 px-3 text-slate-800 whitespace-nowrap">
                            {dept.category}
                          </td>

                          {/* 部门类型 */}
                          <td className="py-2.5 px-3 text-slate-800 whitespace-nowrap">
                            {dept.deptType}
                          </td>

                          {/* 联系电话 */}
                          <td className="py-2.5 px-3 font-mono text-slate-700 whitespace-nowrap">
                            {dept.phone}
                          </td>

                          {/* 对照编码 */}
                          <td className="py-2.5 px-3 font-mono text-slate-600 whitespace-nowrap">
                            {dept.mappingCode || '-'}
                          </td>

                          {/* 状态 */}
                          <td className="py-2.5 px-3 text-center whitespace-nowrap">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[11px] font-medium border ${
                                dept.status === '启用'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : 'bg-slate-100 text-slate-500 border-slate-300'
                              }`}
                            >
                              {dept.status}
                            </span>
                          </td>

                          {/* 操作: 编辑, 停用/启用, 删除 */}
                          <td className="py-2.5 px-3 text-center whitespace-nowrap">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleOpenDeptModal(dept)}
                                className="text-[#1890ff] hover:underline font-medium"
                              >
                                编辑
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  const newStatus = dept.status === '启用' ? '停用' : '启用';
                                  setDepartments(
                                    departments.map((d) => (d.id === dept.id ? { ...d, status: newStatus } : d))
                                  );
                                  showToast(`【${dept.name}】已切换为 ${newStatus} 状态`);
                                }}
                                className="text-[#1890ff] hover:underline font-medium"
                              >
                                {dept.status === '启用' ? '停用' : '启用'}
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setDepartments(departments.filter((d) => d.id !== dept.id));
                                  showToast(`部门【${dept.name}】已从台账中注销`);
                                }}
                                className="text-[#1890ff] hover:underline font-medium hover:text-red-600"
                              >
                                删除
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Right Pagination Bar (一页显示10条数据) */}
              <div className="bg-[#fafafa] border-t border-slate-200 px-4 py-2 shrink-0 flex items-center justify-between text-xs text-slate-600">
                <span className="font-mono text-[11px]">共 {deptTotalCount} 条 · 10条/页</span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={safeDeptPage <= 1}
                    onClick={() => setDeptPage((p) => Math.max(1, p - 1))}
                    className="px-2.5 py-0.5 bg-white border border-slate-300 rounded text-[11px] disabled:opacity-40"
                  >
                    上一页
                  </button>
                  <span className="font-mono text-[11px] px-1">
                    第 {safeDeptPage} / 共 {deptTotalPages} 页
                  </span>
                  <button
                    type="button"
                    disabled={safeDeptPage >= deptTotalPages}
                    onClick={() => setDeptPage((p) => Math.min(deptTotalPages, p + 1))}
                    className="px-2.5 py-0.5 bg-white border border-slate-300 rounded text-[11px] disabled:opacity-40"
                  >
                    下一页
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* 🌟 MODAL 1: 新增 / 编辑 机构 弹窗 🌟 */}
      {showInstModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-300 w-full max-w-lg overflow-hidden animate-fadeIn">
            <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between">
              <div className="font-bold text-sm flex items-center gap-2">
                <Building2 className="w-4 h-4 text-sky-400" />
                <span>{editingInst ? '编辑机构台账' : '新增医疗机构信息'}</span>
              </div>
              <button
                onClick={() => setShowInstModal(false)}
                className="text-white/70 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3.5 text-xs text-slate-800">
              <div className="flex items-center gap-3">
                <span className="w-20 text-right text-slate-600 shrink-0">机构编码</span>
                <input
                  type="text"
                  value={instFormCode}
                  onChange={(e) => setInstFormCode(e.target.value)}
                  className="flex-1 px-3 py-1.5 border border-slate-300 rounded font-mono"
                />
              </div>

              <div className="flex items-center gap-3">
                <span className="w-20 text-right text-slate-600 shrink-0">机构名称</span>
                <input
                  type="text"
                  value={instFormName}
                  onChange={(e) => setInstFormName(e.target.value)}
                  placeholder="例如: 重庆市垫江县人民医院"
                  className="flex-1 px-3 py-1.5 border border-slate-300 rounded font-medium"
                />
              </div>

              <div className="flex items-center gap-3">
                <span className="w-20 text-right text-slate-600 shrink-0">机构性质</span>
                <select
                  value={instFormCategory}
                  onChange={(e) => setInstFormCategory(e.target.value)}
                  className="flex-1 px-3 py-1.5 border border-slate-300 rounded"
                >
                  <option value="中心医院">中心医院</option>
                  <option value="社区卫生服务中心">社区卫生服务中心</option>
                  <option value="专科医院">专科医院</option>
                  <option value="乡镇卫生院">乡镇卫生院</option>
                  <option value="基层诊所">基层诊所</option>
                </select>
              </div>

              <div className="flex items-center gap-3">
                <span className="w-20 text-right text-slate-600 shrink-0">负责人</span>
                <input
                  type="text"
                  value={instFormLeader}
                  onChange={(e) => setInstFormLeader(e.target.value)}
                  placeholder="例如: 景敏主任"
                  className="flex-1 px-3 py-1.5 border border-slate-300 rounded font-medium"
                />
              </div>

              <div className="flex items-center gap-3">
                <span className="w-20 text-right text-slate-600 shrink-0">联系电话</span>
                <input
                  type="text"
                  value={instFormPhone}
                  onChange={(e) => setInstFormPhone(e.target.value)}
                  placeholder="例如: 023-85650516"
                  className="flex-1 px-3 py-1.5 border border-slate-300 rounded font-mono"
                />
              </div>

              <div className="flex items-center gap-3">
                <span className="w-20 text-right text-slate-600 shrink-0">机构地址</span>
                <input
                  type="text"
                  value={instFormAddress}
                  onChange={(e) => setInstFormAddress(e.target.value)}
                  placeholder="例如: 重庆市垫江县桂溪镇116号"
                  className="flex-1 px-3 py-1.5 border border-slate-300 rounded"
                />
              </div>
            </div>

            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setShowInstModal(false)}
                className="px-4 py-1.5 bg-white border border-slate-300 rounded text-slate-700 hover:bg-slate-100"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleSaveInst}
                className="px-5 py-1.5 bg-[#1890ff] hover:bg-blue-600 text-white font-medium rounded shadow-2xs"
              >
                保存机构
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🌟 MODAL 2: 新增 / 编辑 部门 弹窗 🌟 */}
      {showDeptModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-300 w-full max-w-lg overflow-hidden animate-fadeIn">
            <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between">
              <div className="font-bold text-sm flex items-center gap-2">
                <Building2 className="w-4 h-4 text-sky-400" />
                <span>{editingDept ? '编辑部门科室参数' : '新增部门科室信息'}</span>
              </div>
              <button
                onClick={() => setShowDeptModal(false)}
                className="text-white/70 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3 text-xs text-slate-800">
              <div className="flex items-center gap-3">
                <span className="w-20 text-right text-slate-600 shrink-0">部门编码</span>
                <input
                  type="text"
                  value={deptFormCode}
                  onChange={(e) => setDeptFormCode(e.target.value)}
                  className="flex-1 px-3 py-1.5 border border-slate-300 rounded font-mono"
                />
              </div>

              <div className="flex items-center gap-3">
                <span className="w-20 text-right text-slate-600 shrink-0">部门名称</span>
                <input
                  type="text"
                  value={deptFormName}
                  onChange={(e) => setDeptFormName(e.target.value)}
                  placeholder="例如: 临床生化检验组"
                  className="flex-1 px-3 py-1.5 border border-slate-300 rounded font-medium"
                />
              </div>

              <div className="flex items-center gap-3">
                <span className="w-20 text-right text-slate-600 shrink-0">所属机构</span>
                <select
                  value={deptFormInstCode}
                  onChange={(e) => setDeptFormInstCode(e.target.value)}
                  className="flex-1 px-3 py-1.5 border border-slate-300 rounded"
                >
                  {institutions.map((i) => (
                    <option key={i.code} value={i.code}>
                      {i.name} ({i.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-3">
                <span className="w-20 text-right text-slate-600 shrink-0">上级部门</span>
                <input
                  type="text"
                  value={deptFormParent}
                  onChange={(e) => setDeptFormParent(e.target.value)}
                  placeholder="例如: 检验科"
                  className="flex-1 px-3 py-1.5 border border-slate-300 rounded"
                />
              </div>

              <div className="flex items-center gap-3">
                <span className="w-20 text-right text-slate-600 shrink-0">部门性质</span>
                <select
                  value={deptFormCategory}
                  onChange={(e) => setDeptFormCategory(e.target.value)}
                  className="flex-1 px-3 py-1.5 border border-slate-300 rounded"
                >
                  <option value="临床">临床</option>
                  <option value="医技">医技</option>
                  <option value="行政">行政</option>
                  <option value="后勤">后勤</option>
                </select>
              </div>

              <div className="flex items-center gap-3">
                <span className="w-20 text-right text-slate-600 shrink-0">部门类型</span>
                <select
                  value={deptFormType}
                  onChange={(e) => setDeptFormType(e.target.value)}
                  className="flex-1 px-3 py-1.5 border border-slate-300 rounded"
                >
                  <option value="科室">科室</option>
                  <option value="专业组">专业组</option>
                  <option value="实验室">实验室</option>
                  <option value="采样点">采样点</option>
                </select>
              </div>

              <div className="flex items-center gap-3">
                <span className="w-20 text-right text-slate-600 shrink-0">联系电话</span>
                <input
                  type="text"
                  value={deptFormPhone}
                  onChange={(e) => setDeptFormPhone(e.target.value)}
                  placeholder="例如: 10239012312"
                  className="flex-1 px-3 py-1.5 border border-slate-300 rounded font-mono"
                />
              </div>

              <div className="flex items-center gap-3">
                <span className="w-20 text-right text-slate-600 shrink-0">对照编码</span>
                <input
                  type="text"
                  value={deptFormMappingCode}
                  onChange={(e) => setDeptFormMappingCode(e.target.value)}
                  placeholder="例如: HIS_DEPT_001"
                  className="flex-1 px-3 py-1.5 border border-slate-300 rounded font-mono"
                />
              </div>
            </div>

            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setShowDeptModal(false)}
                className="px-4 py-1.5 bg-white border border-slate-300 rounded text-slate-700 hover:bg-slate-100"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleSaveDept}
                className="px-5 py-1.5 bg-[#1890ff] hover:bg-blue-600 text-white font-medium rounded shadow-2xs"
              >
                保存部门
              </button>
            </div>
          </div>
        </div>
      )}


      {/* -------------------- 2. 人员管理 (对应截图 image_25e59655.png) -------------------- */}
      {currentSub === 'sys-personnel' && (() => {
        // Left Panel: 部门列表 Filtering & Pagination
        const filteredDeptsForPer = departments.filter((dept) => {
          if (perInstFilter && perInstFilter !== 'ALL' && dept.instCode !== perInstFilter) {
            return false;
          }
          if (perDeptQuery.trim()) {
            const q = perDeptQuery.trim().toLowerCase();
            return dept.code.toLowerCase().includes(q) || dept.name.toLowerCase().includes(q);
          }
          return true;
        });

        const leftTotalCount = filteredDeptsForPer.length;
        const leftPageSize = 10; // 核心需求：一页帮我显示10条数据
        const leftTotalPages = Math.max(1, Math.ceil(leftTotalCount / leftPageSize));
        const safeLeftPage = Math.min(perLeftPage, leftTotalPages);
        const leftSlice = filteredDeptsForPer.slice((safeLeftPage - 1) * leftPageSize, safeLeftPage * leftPageSize);

        // Right Panel: 人员列表 Filtering & Pagination
        const filteredPersonnel = personnel.filter((person) => {
          // Filter by selected department if any
          if (perSelectedDeptCode && person.deptCode !== perSelectedDeptCode) {
            return false;
          }
          if (perPersonnelQuery.trim()) {
            const q = perPersonnelQuery.trim().toLowerCase();
            return (
              person.empNo.toLowerCase().includes(q) ||
              person.name.toLowerCase().includes(q) ||
              person.idCard.toLowerCase().includes(q) ||
              person.phone.toLowerCase().includes(q) ||
              person.mappingCode.toLowerCase().includes(q)
            );
          }
          return true;
        });

        const rightTotalCount = filteredPersonnel.length;
        const rightPageSize = 10; // 核心需求：一页帮我显示10条数据
        const rightTotalPages = Math.max(1, Math.ceil(rightTotalCount / rightPageSize));
        const safeRightPage = Math.min(perRightPage, rightTotalPages);
        const rightSlice = filteredPersonnel.slice((safeRightPage - 1) * rightPageSize, safeRightPage * rightPageSize);

        const currentDeptObj = departments.find((d) => d.code === perSelectedDeptCode);

        return (
          <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden bg-slate-100 divide-y md:divide-y-0 md:divide-x divide-slate-200">
            {/* ==================== LEFT PANEL: 部门列表 ==================== */}
            <div className="w-full md:w-[38%] flex flex-col min-h-0 bg-white border-r border-slate-200">
              {/* Left Top Filter Bar matching screenshot: 单位名称 [下拉], 部门名称 [输入框], [查询] */}
              <div className="bg-[#fafafa] border-b border-slate-200 px-3.5 py-2.5 shrink-0 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[200px]">
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-700 font-medium whitespace-nowrap">单位名称</span>
                    <select
                      value={perInstFilter}
                      onChange={(e) => {
                        setPerInstFilter(e.target.value);
                        setPerLeftPage(1);
                      }}
                      className="px-2 py-1 text-xs text-slate-800 bg-white border border-slate-300 rounded focus:outline-hidden focus:border-blue-500 max-w-[130px]"
                    >
                      <option value="ALL">全部单位</option>
                      {institutions.map((inst) => (
                        <option key={inst.code} value={inst.code}>
                          {inst.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-1.5 flex-1 min-w-[110px]">
                    <span className="text-slate-700 font-medium whitespace-nowrap">部门名称</span>
                    <input
                      type="text"
                      value={perDeptQuery}
                      onChange={(e) => setPerDeptQuery(e.target.value)}
                      placeholder="部门名称/编码"
                      className="w-full px-2 py-1 text-xs text-slate-800 bg-white border border-slate-300 rounded focus:outline-hidden focus:border-blue-500 font-mono"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* 查询按钮 (白底蓝边) */}
                  <button
                    type="button"
                    onClick={() => {
                      setPerLeftPage(1);
                      showToast(`部门列表查询完毕，共检索到 ${leftTotalCount} 个部门`);
                    }}
                    className="px-3 py-1 bg-white border border-[#1890ff] text-[#1890ff] hover:bg-blue-50 text-xs font-medium rounded transition-colors shadow-2xs"
                  >
                    查询
                  </button>
                </div>
              </div>

              {/* Title Bar matching screenshot: 部门列表 (blue bold font) */}
              <div className="px-4 py-2 bg-slate-100 border-b border-slate-200 text-xs font-bold text-[#1890ff] flex items-center justify-between shrink-0">
                <span>部门列表</span>
                <span className="font-normal text-slate-500 text-[11px]">
                  共 {leftTotalCount} 条 · 页 {safeLeftPage}/{leftTotalPages}
                </span>
              </div>

              {/* Left Table Section matching screenshot: 部门编码, 部门名称 */}
              <div className="flex-1 overflow-auto min-h-0 bg-white">
                <table className="w-full border-collapse text-left text-xs text-slate-700">
                  <thead className="bg-[#fafafa] text-slate-700 font-medium sticky top-0 z-10 border-b border-slate-200">
                    <tr className="border-b border-slate-200">
                      <th className="py-2.5 px-3.5 whitespace-nowrap font-mono w-28">部门编码</th>
                      <th className="py-2.5 px-3.5 whitespace-nowrap">部门名称</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {leftSlice.length === 0 ? (
                      <tr>
                        <td colSpan={2} className="py-12 text-center text-slate-400">
                          暂无匹配的部门数据
                        </td>
                      </tr>
                    ) : (
                      leftSlice.map((dept) => {
                        const isSelected = perSelectedDeptCode === dept.code;
                        return (
                          <tr
                            key={dept.id}
                            onClick={() => {
                              setPerSelectedDeptCode(dept.code);
                              setPerRightPage(1);
                            }}
                            className={`cursor-pointer transition-colors ${
                              isSelected
                                ? 'bg-blue-50/80 border-l-4 border-l-[#1890ff] font-medium'
                                : 'hover:bg-slate-50'
                            }`}
                          >
                            {/* 部门编码 */}
                            <td className="py-2.5 px-3.5 font-mono font-bold text-slate-900 whitespace-nowrap">
                              {dept.code}
                            </td>

                            {/* 部门名称 */}
                            <td className="py-2.5 px-3.5 font-medium text-slate-900 whitespace-nowrap">
                              {dept.name}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Left Pagination Bar (一页显示10条数据) */}
              <div className="bg-[#fafafa] border-t border-slate-200 px-3.5 py-2 shrink-0 flex items-center justify-between text-xs text-slate-600">
                <span className="font-mono text-[11px]">共 {leftTotalCount} 条 · 10条/页</span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={safeLeftPage <= 1}
                    onClick={() => setPerLeftPage((p) => Math.max(1, p - 1))}
                    className="px-2 py-0.5 bg-white border border-slate-300 rounded text-[11px] disabled:opacity-40"
                  >
                    上一页
                  </button>
                  <span className="font-mono text-[11px] px-1">
                    {safeLeftPage}/{leftTotalPages}
                  </span>
                  <button
                    type="button"
                    disabled={safeLeftPage >= leftTotalPages}
                    onClick={() => setPerLeftPage((p) => Math.min(leftTotalPages, p + 1))}
                    className="px-2 py-0.5 bg-white border border-slate-300 rounded text-[11px] disabled:opacity-40"
                  >
                    下一页
                  </button>
                </div>
              </div>
            </div>

            {/* ==================== RIGHT PANEL: 人员列表 ==================== */}
            <div className="w-full md:w-[62%] flex flex-col min-h-0 bg-white">
              {/* Right Top Search Bar matching screenshot: 人员信息 [], [查询], [新增人员] */}
              <div className="bg-[#fafafa] border-b border-slate-200 px-4 py-2.5 shrink-0 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                  <span className="text-slate-700 font-medium whitespace-nowrap">人员信息</span>
                  <input
                    type="text"
                    value={perPersonnelQuery}
                    onChange={(e) => setPerPersonnelQuery(e.target.value)}
                    placeholder="姓名/身份证号/联系电话/工号"
                    className="w-48 px-2.5 py-1 text-xs text-slate-800 bg-white border border-slate-300 rounded focus:outline-hidden focus:border-blue-500 font-mono"
                  />
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* 查询按钮 (白底蓝边) */}
                  <button
                    type="button"
                    onClick={() => {
                      setPerRightPage(1);
                      showToast(`人员列表查询完毕，共检索到 ${rightTotalCount} 名人员`);
                    }}
                    className="px-3.5 py-1 bg-white border border-[#1890ff] text-[#1890ff] hover:bg-blue-50 text-xs font-medium rounded transition-colors shadow-2xs"
                  >
                    查询
                  </button>

                  {/* 新增人员按钮 (实心蓝底) */}
                  <button
                    type="button"
                    onClick={() => handleOpenPersonnelModal()}
                    className="px-3.5 py-1 bg-[#1890ff] hover:bg-blue-600 text-white text-xs font-medium rounded transition-colors shadow-2xs"
                  >
                    新增人员
                  </button>
                </div>
              </div>

              {/* Title Bar matching screenshot: 人员列表 (blue bold font) */}
              <div className="px-4 py-2 bg-slate-100 border-b border-slate-200 text-xs font-bold text-[#1890ff] flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <span>人员列表</span>
                  {currentDeptObj && (
                    <span className="text-[11px] px-2 py-0.2 rounded bg-blue-50 text-blue-700 font-normal border border-blue-200">
                      部门: {currentDeptObj.name} ({currentDeptObj.code})
                    </span>
                  )}
                </div>
                <span className="font-normal text-slate-500 text-[11px]">
                  共 {rightTotalCount} 人 · 页 {safeRightPage}/{rightTotalPages}
                </span>
              </div>

              {/* Right Table Section matching screenshot: 人员编号, 姓名, 性别, 身份证号, 联系电话, 对照编码, 操作 */}
              <div className="flex-1 overflow-auto min-h-0 bg-white">
                <table className="w-full border-collapse text-left text-xs text-slate-700">
                  <thead className="bg-[#fafafa] text-slate-700 font-medium sticky top-0 z-10 border-b border-slate-200">
                    <tr className="border-b border-slate-200">
                      <th className="py-2.5 px-3 whitespace-nowrap font-mono">人员编号</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">姓名</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-center">性别</th>
                      <th className="py-2.5 px-3 whitespace-nowrap font-mono">身份证号</th>
                      <th className="py-2.5 px-3 whitespace-nowrap font-mono">联系电话</th>
                      <th className="py-2.5 px-3 whitespace-nowrap font-mono">对照编码</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-center w-24">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {rightSlice.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-slate-400">
                          暂无匹配的人员档案数据
                        </td>
                      </tr>
                    ) : (
                      rightSlice.map((person) => (
                        <tr key={person.id} className="hover:bg-blue-50/50 transition-colors">
                          {/* 人员编号 */}
                          <td className="py-2.5 px-3 font-mono font-bold text-slate-900 whitespace-nowrap">
                            {person.empNo}
                          </td>

                          {/* 姓名 */}
                          <td className="py-2.5 px-3 font-semibold text-slate-900 whitespace-nowrap">
                            {person.name}
                          </td>

                          {/* 性别 */}
                          <td className="py-2.5 px-3 text-center text-slate-700 whitespace-nowrap">
                            {person.gender}
                          </td>

                          {/* 身份证号 */}
                          <td className="py-2.5 px-3 font-mono text-slate-700 whitespace-nowrap">
                            {person.idCard}
                          </td>

                          {/* 联系电话 */}
                          <td className="py-2.5 px-3 font-mono text-slate-700 whitespace-nowrap">
                            {person.phone}
                          </td>

                          {/* 对照编码 */}
                          <td className="py-2.5 px-3 font-mono text-slate-600 whitespace-nowrap">
                            {person.mappingCode || '-'}
                          </td>

                          {/* 操作: 编辑, 删除 */}
                          <td className="py-2.5 px-3 text-center whitespace-nowrap">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleOpenPersonnelModal(person)}
                                className="text-[#1890ff] hover:underline font-medium"
                              >
                                编辑
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setPersonnel(personnel.filter((p) => p.id !== person.id));
                                  showToast(`人员【${person.name}】档案已删除`);
                                }}
                                className="text-[#1890ff] hover:underline font-medium hover:text-red-600"
                              >
                                删除
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Right Pagination Bar (一页显示10条数据) */}
              <div className="bg-[#fafafa] border-t border-slate-200 px-4 py-2 shrink-0 flex items-center justify-between text-xs text-slate-600">
                <span className="font-mono text-[11px]">共 {rightTotalCount} 条 · 10条/页</span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={safeRightPage <= 1}
                    onClick={() => setPerRightPage((p) => Math.max(1, p - 1))}
                    className="px-2.5 py-0.5 bg-white border border-slate-300 rounded text-[11px] disabled:opacity-40"
                  >
                    上一页
                  </button>
                  <span className="font-mono text-[11px] px-1">
                    第 {safeRightPage} / 共 {rightTotalPages} 页
                  </span>
                  <button
                    type="button"
                    disabled={safeRightPage >= rightTotalPages}
                    onClick={() => setPerRightPage((p) => Math.min(rightTotalPages, p + 1))}
                    className="px-2.5 py-0.5 bg-white border border-slate-300 rounded text-[11px] disabled:opacity-40"
                  >
                    下一页
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* 🌟 MODAL 3: 新增 / 编辑 人员 弹窗 🌟 */}
      {showPersonnelModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-300 w-full max-w-lg overflow-hidden animate-fadeIn">
            <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between">
              <div className="font-bold text-sm flex items-center gap-2">
                <User className="w-4 h-4 text-sky-400" />
                <span>{editingPersonnel ? '编辑人员档案信息' : '新增人员登记'}</span>
              </div>
              <button
                onClick={() => setShowPersonnelModal(false)}
                className="text-white/70 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3 text-xs text-slate-800">
              <div className="flex items-center gap-3">
                <span className="w-20 text-right text-slate-600 shrink-0">人员编号</span>
                <input
                  type="text"
                  value={perFormEmpNo}
                  onChange={(e) => setPerFormEmpNo(e.target.value)}
                  className="flex-1 px-3 py-1.5 border border-slate-300 rounded font-mono"
                />
              </div>

              <div className="flex items-center gap-3">
                <span className="w-20 text-right text-slate-600 shrink-0">姓名</span>
                <input
                  type="text"
                  value={perFormName}
                  onChange={(e) => setPerFormName(e.target.value)}
                  placeholder="例如: 张珊"
                  className="flex-1 px-3 py-1.5 border border-slate-300 rounded font-medium"
                />
              </div>

              <div className="flex items-center gap-3">
                <span className="w-20 text-right text-slate-600 shrink-0">性别</span>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="perGender"
                      checked={perFormGender === '男'}
                      onChange={() => setPerFormGender('男')}
                      className="text-blue-600 focus:ring-0"
                    />
                    <span>男</span>
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="perGender"
                      checked={perFormGender === '女'}
                      onChange={() => setPerFormGender('女')}
                      className="text-blue-600 focus:ring-0"
                    />
                    <span>女</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="w-20 text-right text-slate-600 shrink-0">身份证号</span>
                <input
                  type="text"
                  value={perFormIdCard}
                  onChange={(e) => setPerFormIdCard(e.target.value)}
                  placeholder="例如: 500231199210150028"
                  className="flex-1 px-3 py-1.5 border border-slate-300 rounded font-mono"
                />
              </div>

              <div className="flex items-center gap-3">
                <span className="w-20 text-right text-slate-600 shrink-0">联系电话</span>
                <input
                  type="text"
                  value={perFormPhone}
                  onChange={(e) => setPerFormPhone(e.target.value)}
                  placeholder="例如: 10239012312"
                  className="flex-1 px-3 py-1.5 border border-slate-300 rounded font-mono"
                />
              </div>

              <div className="flex items-center gap-3">
                <span className="w-20 text-right text-slate-600 shrink-0">所属单位</span>
                <select
                  value={perFormInstCode}
                  onChange={(e) => setPerFormInstCode(e.target.value)}
                  className="flex-1 px-3 py-1.5 border border-slate-300 rounded"
                >
                  {institutions.map((i) => (
                    <option key={i.code} value={i.code}>
                      {i.name} ({i.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-3">
                <span className="w-20 text-right text-slate-600 shrink-0">所属部门</span>
                <select
                  value={perFormDeptCode}
                  onChange={(e) => setPerFormDeptCode(e.target.value)}
                  className="flex-1 px-3 py-1.5 border border-slate-300 rounded"
                >
                  {departments
                    .filter((d) => !perFormInstCode || d.instCode === perFormInstCode)
                    .map((d) => (
                      <option key={d.code} value={d.code}>
                        {d.name} ({d.code})
                      </option>
                    ))}
                </select>
              </div>

              <div className="flex items-center gap-3">
                <span className="w-20 text-right text-slate-600 shrink-0">职称/职务</span>
                <input
                  type="text"
                  value={perFormTitle}
                  onChange={(e) => setPerFormTitle(e.target.value)}
                  placeholder="例如: 主管检验师"
                  className="flex-1 px-3 py-1.5 border border-slate-300 rounded"
                />
              </div>

              <div className="flex items-center gap-3">
                <span className="w-20 text-right text-slate-600 shrink-0">对照编码</span>
                <input
                  type="text"
                  value={perFormMappingCode}
                  onChange={(e) => setPerFormMappingCode(e.target.value)}
                  placeholder="例如: HIS_PER_001"
                  className="flex-1 px-3 py-1.5 border border-slate-300 rounded font-mono"
                />
              </div>
            </div>

            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setShowPersonnelModal(false)}
                className="px-4 py-1.5 bg-white border border-slate-300 rounded text-slate-700 hover:bg-slate-100"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleSavePersonnel}
                className="px-5 py-1.5 bg-[#1890ff] hover:bg-blue-600 text-white font-medium rounded shadow-2xs"
              >
                保存人员
              </button>
            </div>
          </div>
        </div>
      )}

      {/* -------------------- 3. 用户管理 (对应截图 image_1faa7ad9.png) -------------------- */}
      {currentSub === 'sys-users' && (() => {
        // Data Filtering
        const filteredUsers = users.filter((u) => {
          // 单位名称 Filter
          if (usrInstFilter && usrInstFilter !== 'ALL' && u.instCode !== usrInstFilter) {
            return false;
          }
          // 用户信息 Search (姓名 / 用户名 / 人员编号)
          if (usrInfoQuery.trim()) {
            const q = usrInfoQuery.trim().toLowerCase();
            const matchName = u.realName.toLowerCase().includes(q);
            const matchUsername = u.username.toLowerCase().includes(q);
            const matchEmpNo = u.empNo.toLowerCase().includes(q);
            if (!matchName && !matchUsername && !matchEmpNo) return false;
          }
          // 锁定状态 Filter (所有, 正常, 锁定)
          if (usrLockFilter !== 'ALL' && u.lockStatus !== usrLockFilter) {
            return false;
          }
          // 用户状态 Filter (所有, 有效, 停用)
          if (usrStatusFilter !== 'ALL' && u.userStatus !== usrStatusFilter) {
            return false;
          }
          return true;
        });

        const totalCount = filteredUsers.length;
        const pageSize = 10; // 核心需求：一页帮我显示10条数据
        const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
        const safePage = Math.min(usrPage, totalPages);
        const userSlice = filteredUsers.slice((safePage - 1) * pageSize, safePage * pageSize);

        return (
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-white">
            {/* Top Control Bar matching screenshot image_1faa7ad9.png */}
            {/* 单位名称 [下拉], 用户信息 [输入框], 锁定状态 [下拉], 用户状态 [下拉], [查询] */}
            <div className="bg-[#fafafa] border-b border-slate-200 px-5 py-2.5 shrink-0 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-3.5 flex-1 min-w-[320px]">
                {/* 单位名称 下拉框 */}
                <div className="flex items-center gap-2">
                  <span className="text-slate-700 font-medium whitespace-nowrap">单位名称</span>
                  <select
                    value={usrInstFilter}
                    onChange={(e) => {
                      setUsrInstFilter(e.target.value);
                      setUsrPage(1);
                    }}
                    className="px-2.5 py-1 text-xs text-slate-800 bg-white border border-slate-300 rounded focus:outline-hidden focus:border-blue-500 min-w-[130px]"
                  >
                    <option value="ALL">全部单位</option>
                    {institutions.map((inst) => (
                      <option key={inst.code} value={inst.code}>
                        {inst.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 用户信息 输入框 */}
                <div className="flex items-center gap-2">
                  <span className="text-slate-700 font-medium whitespace-nowrap">用户信息</span>
                  <input
                    type="text"
                    value={usrInfoQuery}
                    onChange={(e) => setUsrInfoQuery(e.target.value)}
                    placeholder="姓名/账号/人员编号"
                    className="w-40 px-2.5 py-1 text-xs text-slate-800 bg-white border border-slate-300 rounded focus:outline-hidden focus:border-blue-500 font-mono"
                  />
                </div>

                {/* 锁定状态 下拉框 */}
                <div className="flex items-center gap-2">
                  <span className="text-slate-700 font-medium whitespace-nowrap">锁定状态</span>
                  <select
                    value={usrLockFilter}
                    onChange={(e) => {
                      setUsrLockFilter(e.target.value);
                      setUsrPage(1);
                    }}
                    className="px-2 py-1 text-xs text-slate-800 bg-white border border-slate-300 rounded focus:outline-hidden focus:border-blue-500"
                  >
                    <option value="ALL">所有</option>
                    <option value="正常">正常</option>
                    <option value="锁定">锁定</option>
                  </select>
                </div>

                {/* 用户状态 下拉框 */}
                <div className="flex items-center gap-2">
                  <span className="text-slate-700 font-medium whitespace-nowrap">用户状态</span>
                  <select
                    value={usrStatusFilter}
                    onChange={(e) => {
                      setUsrStatusFilter(e.target.value);
                      setUsrPage(1);
                    }}
                    className="px-2 py-1 text-xs text-slate-800 bg-white border border-slate-300 rounded focus:outline-hidden focus:border-blue-500"
                  >
                    <option value="ALL">所有</option>
                    <option value="有效">有效</option>
                    <option value="停用">停用</option>
                  </select>
                </div>

                {/* 查询按钮 (白底蓝边) */}
                <button
                  type="button"
                  onClick={() => {
                    setUsrPage(1);
                    showToast(`用户列表查询完毕，共检索到 ${totalCount} 条记录`);
                  }}
                  className="px-3.5 py-1 bg-white border border-[#1890ff] text-[#1890ff] hover:bg-blue-50 text-xs font-medium rounded transition-colors shadow-2xs"
                >
                  查询
                </button>
              </div>
            </div>

            {/* Action Row matching screenshot: [新增用户] 按钮 (实心蓝底) */}
            <div className="bg-white px-5 py-2 shrink-0 border-b border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleOpenUserModal()}
                className="px-3.5 py-1 bg-[#1890ff] hover:bg-blue-600 text-white text-xs font-medium rounded transition-colors shadow-2xs"
              >
                新增用户
              </button>
            </div>

            {/* Section Title matching screenshot: 用户列表 (bold blue) */}
            <div className="px-5 py-2 bg-slate-100 border-b border-slate-200 text-xs font-bold text-[#1890ff] flex items-center justify-between shrink-0">
              <span>用户列表</span>
              <span className="font-normal text-slate-500 text-[11px]">
                共 {totalCount} 条用户记录 · 页 {safePage}/{totalPages}
              </span>
            </div>

            {/* User List Table matching screenshot: 人员编号, 姓名, 性别, 用户名, 锁定, 用户状态, 操作人, 操作时间, 操作 */}
            <div className="flex-1 overflow-auto min-h-0 bg-white">
              <table className="w-full border-collapse text-left text-xs text-slate-700">
                <thead className="bg-[#fafafa] text-slate-700 font-medium sticky top-0 z-10 border-b border-slate-200">
                  <tr className="border-b border-slate-200">
                    <th className="py-2.5 px-4 font-mono whitespace-nowrap">人员编号</th>
                    <th className="py-2.5 px-4 whitespace-nowrap">姓名</th>
                    <th className="py-2.5 px-4 text-center whitespace-nowrap">性别</th>
                    <th className="py-2.5 px-4 font-mono whitespace-nowrap">用户名</th>
                    <th className="py-2.5 px-4 text-center whitespace-nowrap">锁定</th>
                    <th className="py-2.5 px-4 text-center whitespace-nowrap">用户状态</th>
                    <th className="py-2.5 px-4 whitespace-nowrap">操作人</th>
                    <th className="py-2.5 px-4 font-mono whitespace-nowrap">操作时间</th>
                    <th className="py-2.5 px-4 text-center whitespace-nowrap w-44">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {userSlice.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-12 text-center text-slate-400">
                        暂无匹配的用户账号数据
                      </td>
                    </tr>
                  ) : (
                    userSlice.map((u) => (
                      <tr key={u.id} className="hover:bg-blue-50/50 transition-colors">
                        {/* 人员编号 */}
                        <td className="py-2.5 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                          {u.empNo}
                        </td>

                        {/* 姓名 */}
                        <td className="py-2.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                          {u.realName}
                        </td>

                        {/* 性别 */}
                        <td className="py-2.5 px-4 text-center text-slate-700 whitespace-nowrap">
                          {u.gender}
                        </td>

                        {/* 用户名 */}
                        <td className="py-2.5 px-4 font-mono font-semibold text-slate-800 whitespace-nowrap">
                          {u.username}
                        </td>

                        {/* 锁定 (正常 / 锁定[高亮]) */}
                        <td className="py-2.5 px-4 text-center whitespace-nowrap font-medium">
                          {u.lockStatus === '锁定' ? (
                            <span className="text-amber-600 font-bold">锁定</span>
                          ) : (
                            <span className="text-slate-700">正常</span>
                          )}
                        </td>

                        {/* 用户状态 (有效 / 停用[高亮]) */}
                        <td className="py-2.5 px-4 text-center whitespace-nowrap font-medium">
                          {u.userStatus === '停用' ? (
                            <span className="text-rose-600 font-bold">停用</span>
                          ) : (
                            <span className="text-emerald-600 font-medium">有效</span>
                          )}
                        </td>

                        {/* 操作人 */}
                        <td className="py-2.5 px-4 text-slate-700 whitespace-nowrap">
                          {u.operator}
                        </td>

                        {/* 操作时间 */}
                        <td className="py-2.5 px-4 font-mono text-slate-600 whitespace-nowrap">
                          {u.operatorTime}
                        </td>

                        {/* 操作: 重置密码, 解锁/锁定, 停用/启用 */}
                        <td className="py-2.5 px-4 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-2">
                            {/* 重置密码 */}
                            <button
                              type="button"
                              onClick={() => handleOpenResetPasswordModal(u)}
                              className="text-[#1890ff] hover:underline font-medium"
                            >
                              重置密码
                            </button>

                            {/* 解锁 / 锁定 */}
                            <button
                              type="button"
                              onClick={() => {
                                const newLock = u.lockStatus === '正常' ? '锁定' : '正常';
                                setUsers(users.map((item) => (item.id === u.id ? { ...item, lockStatus: newLock } : item)));
                                showToast(`【${u.realName}】账号锁定状态已切换为: ${newLock}`);
                              }}
                              className="text-[#1890ff] hover:underline font-medium"
                            >
                              {u.lockStatus === '锁定' ? '解锁' : '锁定'}
                            </button>

                            {/* 停用 / 启用 */}
                            <button
                              type="button"
                              onClick={() => {
                                const newStatus = u.userStatus === '有效' ? '停用' : '有效';
                                setUsers(users.map((item) => (item.id === u.id ? { ...item, userStatus: newStatus } : item)));
                                showToast(`【${u.realName}】用户有效状态已切换为: ${newStatus}`);
                              }}
                              className="text-[#1890ff] hover:underline font-medium"
                            >
                              {u.userStatus === '有效' ? '停用' : '启用'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Bar (一页显示10条数据) */}
            <div className="bg-[#fafafa] border-t border-slate-200 px-5 py-2 shrink-0 flex items-center justify-between text-xs text-slate-600">
              <span className="font-mono text-[11px]">共 {totalCount} 条 · 10条/页</span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={safePage <= 1}
                  onClick={() => setUsrPage((p) => Math.max(1, p - 1))}
                  className="px-2.5 py-0.5 bg-white border border-slate-300 rounded text-[11px] disabled:opacity-40"
                >
                  上一页
                </button>
                <span className="font-mono text-[11px] px-1">
                  第 {safePage} / 共 {totalPages} 页
                </span>
                <button
                  type="button"
                  disabled={safePage >= totalPages}
                  onClick={() => setUsrPage((p) => Math.min(totalPages, p + 1))}
                  className="px-2.5 py-0.5 bg-white border border-slate-300 rounded text-[11px] disabled:opacity-40"
                >
                  下一页
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* 🌟 MODAL 4: 新增 / 编辑 用户 弹窗 🌟 */}
      {showUserModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-300 w-full max-w-lg overflow-hidden animate-fadeIn">
            <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between">
              <div className="font-bold text-sm flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-sky-400" />
                <span>{editingUser ? '编辑系统用户账号' : '新增系统用户账号'}</span>
              </div>
              <button
                onClick={() => setShowUserModal(false)}
                className="text-white/70 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3.5 text-xs text-slate-800">
              <div className="flex items-center gap-3">
                <span className="w-20 text-right text-slate-600 shrink-0">人员编号</span>
                <input
                  type="text"
                  value={usrFormEmpNo}
                  onChange={(e) => setUsrFormEmpNo(e.target.value)}
                  className="flex-1 px-3 py-1.5 border border-slate-300 rounded font-mono"
                />
              </div>

              <div className="flex items-center gap-3">
                <span className="w-20 text-right text-slate-600 shrink-0">真实姓名</span>
                <input
                  type="text"
                  value={usrFormRealName}
                  onChange={(e) => setUsrFormRealName(e.target.value)}
                  placeholder="例如: 张珊"
                  className="flex-1 px-3 py-1.5 border border-slate-300 rounded font-medium"
                />
              </div>

              <div className="flex items-center gap-3">
                <span className="w-20 text-right text-slate-600 shrink-0">性别</span>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="usrGender"
                      checked={usrFormGender === '男'}
                      onChange={() => setUsrFormGender('男')}
                      className="text-blue-600 focus:ring-0"
                    />
                    <span>男</span>
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="usrGender"
                      checked={usrFormGender === '女'}
                      onChange={() => setUsrFormGender('女')}
                      className="text-blue-600 focus:ring-0"
                    />
                    <span>女</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="w-20 text-right text-slate-600 shrink-0">登录用户名</span>
                <input
                  type="text"
                  value={usrFormUsername}
                  onChange={(e) => setUsrFormUsername(e.target.value)}
                  placeholder="例如: ZS"
                  className="flex-1 px-3 py-1.5 border border-slate-300 rounded font-mono font-bold text-blue-700"
                />
              </div>

              <div className="flex items-center gap-3">
                <span className="w-20 text-right text-slate-600 shrink-0">所属单位</span>
                <select
                  value={usrFormInstCode}
                  onChange={(e) => setUsrFormInstCode(e.target.value)}
                  className="flex-1 px-3 py-1.5 border border-slate-300 rounded"
                >
                  {institutions.map((i) => (
                    <option key={i.code} value={i.code}>
                      {i.name} ({i.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-3">
                <span className="w-20 text-right text-slate-600 shrink-0">锁定状态</span>
                <select
                  value={usrFormLockStatus}
                  onChange={(e) => setUsrFormLockStatus(e.target.value as '正常' | '锁定')}
                  className="flex-1 px-3 py-1.5 border border-slate-300 rounded"
                >
                  <option value="正常">正常</option>
                  <option value="锁定">锁定</option>
                </select>
              </div>

              <div className="flex items-center gap-3">
                <span className="w-20 text-right text-slate-600 shrink-0">用户状态</span>
                <select
                  value={usrFormUserStatus}
                  onChange={(e) => setUsrFormUserStatus(e.target.value as '有效' | '停用')}
                  className="flex-1 px-3 py-1.5 border border-slate-300 rounded"
                >
                  <option value="有效">有效</option>
                  <option value="停用">停用</option>
                </select>
              </div>
            </div>

            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setShowUserModal(false)}
                className="px-4 py-1.5 bg-white border border-slate-300 rounded text-slate-700 hover:bg-slate-100"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleSaveUser}
                className="px-5 py-1.5 bg-[#1890ff] hover:bg-blue-600 text-white font-medium rounded shadow-2xs"
              >
                保存用户
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🌟 MODAL 4.5: 重置用户密码 弹窗 🌟 */}
      {showResetPasswordModal && resettingUser && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-300 w-full max-w-md overflow-hidden animate-fadeIn">
            {/* Header */}
            <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between">
              <div className="font-bold text-sm flex items-center gap-2">
                <Key className="w-4 h-4 text-amber-400" />
                <span>重置用户安全密码</span>
              </div>
              <button
                onClick={() => setShowResetPasswordModal(false)}
                className="text-white/70 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Target User Info Card */}
            <div className="p-5 space-y-4 text-xs text-slate-800">
              <div className="p-3 bg-blue-50/80 border border-blue-200 rounded-lg flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-[#1890ff] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <span>{resettingUser.realName}</span>
                    <span className="font-mono text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded text-xs font-semibold">
                      @{resettingUser.username}
                    </span>
                  </div>
                  <div className="text-slate-600 text-xs flex items-center gap-3">
                    <span>人员编号: <strong className="font-mono text-slate-800">{resettingUser.empNo}</strong></span>
                    <span>所属单位: <strong className="text-slate-800">{resettingUser.instName}</strong></span>
                  </div>
                </div>
              </div>

              {/* Reset Mode Selection */}
              <div className="space-y-2">
                <label className="font-bold text-slate-800 block">重置模式选择</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setResetPasswordMode('default');
                      setCustomNewPassword('123456');
                      setCustomConfirmPassword('123456');
                    }}
                    className={`p-2.5 rounded-lg border text-left flex flex-col justify-between transition-all ${
                      resetPasswordMode === 'default'
                        ? 'bg-blue-50 border-[#1890ff] text-blue-900 ring-2 ring-blue-500/20'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="font-bold text-xs">默认初始密码</span>
                    <span className="font-mono text-[11px] text-blue-700 mt-1 font-semibold">123456</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setResetPasswordMode('custom');
                    }}
                    className={`p-2.5 rounded-lg border text-left flex flex-col justify-between transition-all ${
                      resetPasswordMode === 'custom'
                        ? 'bg-blue-50 border-[#1890ff] text-blue-900 ring-2 ring-blue-500/20'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="font-bold text-xs">自定义新密码</span>
                    <span className="text-[11px] text-slate-500 mt-1">手动输入或随机生成</span>
                  </button>
                </div>
              </div>

              {/* Custom Password Input Fields */}
              {resetPasswordMode === 'custom' && (
                <div className="space-y-3 pt-1 border-t border-slate-100 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <label className="font-medium text-slate-700">自定义新密码</label>
                    <button
                      type="button"
                      onClick={handleGenerateRandomPassword}
                      className="text-[#1890ff] hover:underline text-[11px] font-medium flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>生成随机强密码</span>
                    </button>
                  </div>

                  <div className="relative">
                    <input
                      type={showPasswordText ? 'text' : 'password'}
                      value={customNewPassword}
                      onChange={(e) => setCustomNewPassword(e.target.value)}
                      placeholder="至少6位，包含字母/数字"
                      className="w-full px-3 py-1.5 pr-9 border border-slate-300 rounded font-mono text-xs focus:outline-hidden focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswordText(!showPasswordText)}
                      className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600"
                    >
                      {showPasswordText ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  <div>
                    <label className="font-medium text-slate-700 block mb-1">确认新密码</label>
                    <input
                      type={showPasswordText ? 'text' : 'password'}
                      value={customConfirmPassword}
                      onChange={(e) => setCustomConfirmPassword(e.target.value)}
                      placeholder="请再次输入新密码"
                      className="w-full px-3 py-1.5 border border-slate-300 rounded font-mono text-xs focus:outline-hidden focus:border-blue-500"
                    />
                  </div>
                </div>
              )}

              {/* Checkboxes */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="flex items-center gap-2 cursor-pointer select-none text-slate-700">
                  <input
                    type="checkbox"
                    checked={forceChangeNextLogin}
                    onChange={(e) => setForceChangeNextLogin(e.target.checked)}
                    className="rounded text-[#1890ff] focus:ring-0 cursor-pointer"
                  />
                  <span>强制用户在下一次登录时修改密码</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none text-slate-700">
                  <input
                    type="checkbox"
                    checked={sendSmsNotice}
                    onChange={(e) => setSendSmsNotice(e.target.checked)}
                    className="rounded text-[#1890ff] focus:ring-0 cursor-pointer"
                  />
                  <span>通过系统短信向绑定手机号发送重置通知</span>
                </label>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setShowResetPasswordModal(false)}
                className="px-4 py-1.5 bg-white border border-slate-300 rounded text-slate-700 hover:bg-slate-100"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleConfirmResetPassword}
                className="px-5 py-1.5 bg-[#1890ff] hover:bg-blue-600 text-white font-medium rounded shadow-2xs flex items-center gap-1.5"
              >
                <Key className="w-3.5 h-3.5" />
                <span>确认重置密码</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* -------------------- 4. 角色权限管理 (对应截图 image_a0fc28d6.png 与 image_6c207212.png) -------------------- */}
      {currentSub === 'sys-roles' && (() => {
        // Left Panel Role Filtering
        const filteredRoles = roles.filter((role) => {
          if (roleInstFilter && roleInstFilter !== 'ALL' && role.instCode !== roleInstFilter) {
            return false;
          }
          if (!roleShowDisabled && role.status === '停用') {
            return false;
          }
          if (roleInfoQuery.trim()) {
            const q = roleInfoQuery.trim().toLowerCase();
            const matchCode = role.roleCode.toLowerCase().includes(q);
            const matchName = role.roleName.toLowerCase().includes(q);
            if (!matchCode && !matchName) return false;
          }
          return true;
        });

        const leftTotalCount = filteredRoles.length;
        const leftPageSize = 10; // 核心需求：一页帮我显示10条数据
        const leftTotalPages = Math.max(1, Math.ceil(leftTotalCount / leftPageSize));
        const safeLeftPage = Math.min(roleLeftPage, leftTotalPages);
        const leftRoleSlice = filteredRoles.slice((safeLeftPage - 1) * leftPageSize, safeLeftPage * leftPageSize);

        // Right Panel Personnel Filtering (For Tab 2 「角色人员」)
        const activeUsersForRole = users.filter((u) => {
          if (roleInstFilter && roleInstFilter !== 'ALL' && u.instCode !== roleInstFilter) {
            return false;
          }
          return true;
        });

        const rightTotalCount = activeUsersForRole.length;
        const rightPageSize = 10; // 核心需求：一页帮我显示10条数据
        const rightTotalPages = Math.max(1, Math.ceil(rightTotalCount / rightPageSize));
        const safeRightPage = Math.min(roleRightPage, rightTotalPages);
        const rightUserSlice = activeUsersForRole.slice((safeRightPage - 1) * rightPageSize, safeRightPage * rightPageSize);

        const currentRoleObj = selectedRole || roles[0];

        return (
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-white">
            {/* Top Control Bar matching screenshot: 单位名称 [下拉], 用户信息 [输入框], [ ]显示停用, [查询] */}
            <div className="bg-[#fafafa] border-b border-slate-200 px-5 py-2.5 shrink-0 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
                {/* 单位名称 */}
                <div className="flex items-center gap-2">
                  <span className="text-slate-700 font-medium whitespace-nowrap">单位名称</span>
                  <select
                    value={roleInstFilter}
                    onChange={(e) => {
                      setRoleInstFilter(e.target.value);
                      setRoleLeftPage(1);
                      setRoleRightPage(1);
                    }}
                    className="px-2.5 py-1 text-xs text-slate-800 bg-white border border-slate-300 rounded focus:outline-hidden focus:border-blue-500 min-w-[130px]"
                  >
                    <option value="ALL">全部单位</option>
                    {institutions.map((inst) => (
                      <option key={inst.code} value={inst.code}>
                        {inst.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 用户信息/角色信息 */}
                <div className="flex items-center gap-2">
                  <span className="text-slate-700 font-medium whitespace-nowrap">用户信息</span>
                  <input
                    type="text"
                    value={roleInfoQuery}
                    onChange={(e) => setRoleInfoQuery(e.target.value)}
                    placeholder="角色名称/编码"
                    className="w-40 px-2.5 py-1 text-xs text-slate-800 bg-white border border-slate-300 rounded focus:outline-hidden focus:border-blue-500 font-mono"
                  />
                </div>

                {/* [ ] 显示停用 */}
                <label className="flex items-center gap-1 text-slate-700 font-medium cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={roleShowDisabled}
                    onChange={(e) => {
                      setRoleShowDisabled(e.target.checked);
                      setRoleLeftPage(1);
                    }}
                    className="rounded text-[#1890ff] focus:ring-0 cursor-pointer"
                  />
                  <span>显示停用</span>
                </label>

                {/* 查询按钮 (白底蓝边) */}
                <button
                  type="button"
                  onClick={() => {
                    setRoleLeftPage(1);
                    showToast(`角色列表查询完毕，共检索到 ${leftTotalCount} 条角色记录`);
                  }}
                  className="px-3.5 py-1 bg-white border border-[#1890ff] text-[#1890ff] hover:bg-blue-50 text-xs font-medium rounded transition-colors shadow-2xs"
                >
                  查询
                </button>
              </div>
            </div>

            {/* Action Row matching screenshot: [新增角色] 按钮 (实心蓝底) */}
            <div className="bg-white px-5 py-2 shrink-0 border-b border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleOpenRoleModal()}
                className="px-3.5 py-1 bg-[#1890ff] hover:bg-blue-600 text-white text-xs font-medium rounded transition-colors shadow-2xs"
              >
                新增角色
              </button>
            </div>

            {/* Main Dual Panel Body */}
            <div className="flex-1 flex flex-col md:flex-row min-h-0 divide-y md:divide-y-0 md:divide-x divide-slate-200">
              {/* ==================== LEFT PANEL: 角色列表 ==================== */}
              <div className="w-full md:w-[38%] flex flex-col min-h-0 bg-white border-r border-slate-200">
                {/* Title Bar matching screenshot: 角色列表 (bold blue) */}
                <div className="px-4 py-2 bg-slate-100 border-b border-slate-200 text-xs font-bold text-[#1890ff] flex items-center justify-between shrink-0">
                  <span>角色列表</span>
                  <span className="font-normal text-slate-500 text-[11px]">
                    共 {leftTotalCount} 条 · 页 {safeLeftPage}/{leftTotalPages}
                  </span>
                </div>

                {/* Left Table Section matching screenshot: 角色编号, 角色名称, 状态, 操作 */}
                <div className="flex-1 overflow-auto min-h-0 bg-white">
                  <table className="w-full border-collapse text-left text-xs text-slate-700">
                    <thead className="bg-[#fafafa] text-slate-700 font-medium sticky top-0 z-10 border-b border-slate-200">
                      <tr className="border-b border-slate-200">
                        <th className="py-2.5 px-3 whitespace-nowrap font-mono w-24">角色编号</th>
                        <th className="py-2.5 px-3 whitespace-nowrap">角色名称</th>
                        <th className="py-2.5 px-3 whitespace-nowrap text-center">状态</th>
                        <th className="py-2.5 px-3 whitespace-nowrap text-center w-28">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {leftRoleSlice.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="py-12 text-center text-slate-400">
                            暂无匹配的角色数据
                          </td>
                        </tr>
                      ) : (
                        leftRoleSlice.map((role) => {
                          const isSelected = currentRoleObj.id === role.id;
                          return (
                            <tr
                              key={role.id}
                              onClick={() => {
                                setSelectedRole(role);
                                setEditingRolePermissions(role.permissions || []);
                                setEditingRoleUserIds(role.assignedUserIds || []);
                              }}
                              className={`cursor-pointer transition-colors ${
                                isSelected
                                  ? 'bg-blue-50/80 border-l-4 border-l-[#1890ff] font-medium'
                                  : 'hover:bg-slate-50'
                              }`}
                            >
                              {/* 角色编号 */}
                              <td className="py-2.5 px-3 font-mono font-bold text-slate-900 whitespace-nowrap">
                                {role.roleCode}
                              </td>

                              {/* 角色名称 */}
                              <td className="py-2.5 px-3 font-semibold text-slate-900 whitespace-nowrap">
                                {role.roleName}
                              </td>

                              {/* 状态 */}
                              <td className="py-2.5 px-3 text-center whitespace-nowrap">
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[11px] font-medium border ${
                                    role.status === '启用'
                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                      : 'bg-slate-100 text-slate-500 border-slate-300'
                                  }`}
                                >
                                  {role.status}
                                </span>
                              </td>

                              {/* 操作: 编辑, 停用/启用, 删除 */}
                              <td
                                className="py-2.5 px-3 text-center whitespace-nowrap"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <div className="flex items-center justify-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => handleOpenRoleModal(role)}
                                    className="text-[#1890ff] hover:underline font-medium"
                                  >
                                    编辑
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newStatus = role.status === '启用' ? '停用' : '启用';
                                      setRoles(
                                        roles.map((r) => (r.id === role.id ? { ...r, status: newStatus } : r))
                                      );
                                      showToast(`【${role.roleName}】已切换为 ${newStatus} 状态`);
                                    }}
                                    className="text-[#1890ff] hover:underline font-medium"
                                  >
                                    {role.status === '启用' ? '停用' : '启用'}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setRoles(roles.filter((r) => r.id !== role.id));
                                      showToast(`角色【${role.roleName}】已删除`);
                                    }}
                                    className="text-[#1890ff] hover:underline font-medium hover:text-red-600"
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

                {/* Left Pagination Bar (一页显示10条数据) */}
                <div className="bg-[#fafafa] border-t border-slate-200 px-3.5 py-2 shrink-0 flex items-center justify-between text-xs text-slate-600">
                  <span className="font-mono text-[11px]">共 {leftTotalCount} 条 · 10条/页</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={safeLeftPage <= 1}
                      onClick={() => setRoleLeftPage((p) => Math.max(1, p - 1))}
                      className="px-2 py-0.5 bg-white border border-slate-300 rounded text-[11px] disabled:opacity-40"
                    >
                      上一页
                    </button>
                    <span className="font-mono text-[11px] px-1">
                      {safeLeftPage}/{leftTotalPages}
                    </span>
                    <button
                      type="button"
                      disabled={safeLeftPage >= leftTotalPages}
                      onClick={() => setRoleLeftPage((p) => Math.min(leftTotalPages, p + 1))}
                      className="px-2 py-0.5 bg-white border border-slate-300 rounded text-[11px] disabled:opacity-40"
                    >
                      下一页
                    </button>
                  </div>
                </div>
              </div>

              {/* ==================== RIGHT PANEL: 角色权限 & 角色人员 选项卡 ==================== */}
              <div className="w-full md:w-[62%] flex flex-col min-h-0 bg-white">
                {/* Right Top Header matching screenshots image_a0fc28d6.png & image_6c207212.png */}
                {/* Tabs: [角色权限] [角色人员] and Top Right [保存] Button */}
                <div className="bg-[#fafafa] border-b border-slate-200 px-4 py-2 shrink-0 flex items-center justify-between">
                  {/* Tabs */}
                  <div className="flex items-center gap-1 border-b border-transparent">
                    <button
                      type="button"
                      onClick={() => setRoleActiveTab('permissions')}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-t border-t border-x transition-colors ${
                        roleActiveTab === 'permissions'
                          ? 'bg-white border-slate-300 text-[#1890ff] shadow-2xs'
                          : 'bg-slate-100 border-transparent text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      角色权限
                    </button>
                    <button
                      type="button"
                      onClick={() => setRoleActiveTab('users')}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-t border-t border-x transition-colors ${
                        roleActiveTab === 'users'
                          ? 'bg-white border-slate-300 text-[#1890ff] shadow-2xs'
                          : 'bg-slate-100 border-transparent text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      角色人员
                    </button>
                  </div>

                  {/* 右上角 [保存] 按钮 (实心绿底) */}
                  <button
                    type="button"
                    onClick={() => {
                      if (roleActiveTab === 'permissions') {
                        handleSaveRolePermissions();
                      } else {
                        handleSaveRoleUsers();
                      }
                    }}
                    className="px-4 py-1 bg-[#008a00] hover:bg-emerald-700 text-white text-xs font-bold rounded shadow-2xs transition-colors flex items-center gap-1"
                  >
                    <span>保存</span>
                  </button>
                </div>

                {/* TAB 1: 角色权限 (对应截图 image_a0fc28d6.png) */}
                {roleActiveTab === 'permissions' && (
                  <div className="flex-1 flex flex-col min-h-0 bg-white overflow-y-auto">
                    {/* Header */}
                    <div className="px-4 py-2 bg-slate-100 border-b border-slate-200 text-xs font-bold text-slate-700">
                      功能权限 (授权角色: <span className="text-[#1890ff]">{currentRoleObj.roleName}</span>)
                    </div>

                    {/* Permissions Tree Checklist */}
                    <div className="p-4 space-y-4 text-xs text-slate-800">
                      {[
                        {
                          group: '系统管理',
                          subItems: ['组织机构管理', '人员管理', '用户管理', '角色权限管理', '码表字典管理', '系统日志管理'],
                        },
                        {
                          group: '标本采集与前处理',
                          subItems: ['送检签收平台', '标本扫码分捡', '前处理离心核对'],
                        },
                        {
                          group: '检验业务功能',
                          subItems: ['检验报告中心', '临生免系统', '图文报告中心', '微生物与药敏系统', '室内质控监控'],
                        },
                        {
                          group: '通信与参数配置',
                          subItems: ['仪器通信配置', '程序更新配置', '通信程序下载'],
                        },
                      ].map((grp) => {
                        const allGrpSelected = grp.subItems.every((sub) => editingRolePermissions.includes(sub));
                        return (
                          <div key={grp.group} className="border border-slate-200 rounded-lg p-3 bg-slate-50/50">
                            {/* Parent Group Checkbox */}
                            <label className="flex items-center gap-2 font-bold text-slate-900 cursor-pointer mb-2">
                              <input
                                type="checkbox"
                                checked={allGrpSelected || editingRolePermissions.includes(grp.group)}
                                onChange={() => {
                                  if (allGrpSelected) {
                                    setEditingRolePermissions(
                                      editingRolePermissions.filter((p) => p !== grp.group && !grp.subItems.includes(p))
                                    );
                                  } else {
                                    const newSet = new Set([...editingRolePermissions, grp.group, ...grp.subItems]);
                                    setEditingRolePermissions(Array.from(newSet));
                                  }
                                }}
                                className="rounded text-[#1890ff] focus:ring-0 cursor-pointer"
                              />
                              <span>{grp.group}</span>
                            </label>

                            {/* Sub Items */}
                            <div className="ml-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                              {grp.subItems.map((sub) => {
                                const checked = editingRolePermissions.includes(sub);
                                return (
                                  <label
                                    key={sub}
                                    className={`flex items-center gap-2 p-1.5 rounded border text-xs cursor-pointer transition-colors ${
                                      checked
                                        ? 'bg-blue-50/80 border-blue-300 text-blue-900 font-semibold'
                                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                                    }`}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={checked}
                                      onChange={() => handleTogglePermission(sub)}
                                      className="rounded text-[#1890ff] focus:ring-0 cursor-pointer"
                                    />
                                    <span>{sub}</span>
                                  </label>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* TAB 2: 角色人员 (对应截图 image_6c207212.png) */}
                {roleActiveTab === 'users' && (
                  <div className="flex-1 flex flex-col min-h-0 bg-white">
                    {/* Table Section */}
                    <div className="flex-1 overflow-auto min-h-0 bg-white">
                      <table className="w-full border-collapse text-left text-xs text-slate-700">
                        <thead className="bg-[#fafafa] text-slate-700 font-medium sticky top-0 z-10 border-b border-slate-200">
                          <tr className="border-b border-slate-200">
                            {/* Checkbox Column */}
                            <th className="py-2.5 px-3 text-center w-12">
                              <input
                                type="checkbox"
                                checked={
                                  rightUserSlice.length > 0 &&
                                  rightUserSlice.every((u) => editingRoleUserIds.includes(u.id))
                                }
                                onChange={() => handleToggleSelectAllUsers(rightUserSlice)}
                                className="rounded text-[#1890ff] focus:ring-0 cursor-pointer"
                              />
                            </th>

                            {/* 用户名 */}
                            <th className="py-2.5 px-3 whitespace-nowrap font-mono">用户名</th>

                            {/* 人员编号 */}
                            <th className="py-2.5 px-3 whitespace-nowrap font-mono">人员编号</th>

                            {/* 姓名 */}
                            <th className="py-2.5 px-3 whitespace-nowrap">姓名</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {rightUserSlice.length === 0 ? (
                            <tr>
                              <td colSpan={4} className="py-12 text-center text-slate-400">
                                暂无匹配的用户人员数据
                              </td>
                            </tr>
                          ) : (
                            rightUserSlice.map((u) => {
                              const isChecked = editingRoleUserIds.includes(u.id);
                              return (
                                <tr
                                  key={u.id}
                                  onClick={() => handleToggleUserAssigned(u.id)}
                                  className={`cursor-pointer transition-colors ${
                                    isChecked ? 'bg-blue-50/60' : 'hover:bg-slate-50'
                                  }`}
                                >
                                  {/* Checkbox */}
                                  <td className="py-2.5 px-3 text-center">
                                    <input
                                      type="checkbox"
                                      checked={isChecked}
                                      onChange={() => handleToggleUserAssigned(u.id)}
                                      onClick={(e) => e.stopPropagation()}
                                      className="rounded text-[#1890ff] focus:ring-0 cursor-pointer"
                                    />
                                  </td>

                                  {/* 用户名 */}
                                  <td className="py-2.5 px-3 font-mono font-bold text-slate-900 whitespace-nowrap">
                                    {u.username}
                                  </td>

                                  {/* 人员编号 */}
                                  <td className="py-2.5 px-3 font-mono text-slate-700 whitespace-nowrap">
                                    {u.empNo}
                                  </td>

                                  {/* 姓名 */}
                                  <td className="py-2.5 px-3 font-semibold text-slate-900 whitespace-nowrap">
                                    {u.realName}
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Right Pagination Bar for Users (一页显示10条数据) */}
                    <div className="bg-[#fafafa] border-t border-slate-200 px-4 py-2 shrink-0 flex items-center justify-between text-xs text-slate-600">
                      <span className="font-mono text-[11px]">共 {rightTotalCount} 条 · 10条/页</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          disabled={safeRightPage <= 1}
                          onClick={() => setRoleRightPage((p) => Math.max(1, p - 1))}
                          className="px-2.5 py-0.5 bg-white border border-slate-300 rounded text-[11px] disabled:opacity-40"
                        >
                          上一页
                        </button>
                        <span className="font-mono text-[11px] px-1">
                          第 {safeRightPage} / 共 {rightTotalPages} 页
                        </span>
                        <button
                          type="button"
                          disabled={safeRightPage >= rightTotalPages}
                          onClick={() => setRoleRightPage((p) => Math.min(rightTotalPages, p + 1))}
                          className="px-2.5 py-0.5 bg-white border border-slate-300 rounded text-[11px] disabled:opacity-40"
                        >
                          下一页
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* 🌟 MODAL 5: 新增 / 编辑 角色 弹窗 🌟 */}
      {showRoleModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-300 w-full max-w-lg overflow-hidden animate-fadeIn">
            <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between">
              <div className="font-bold text-sm flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-sky-400" />
                <span>{editingRole ? '编辑角色定义' : '新增系统角色'}</span>
              </div>
              <button
                onClick={() => setShowRoleModal(false)}
                className="text-white/70 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3.5 text-xs text-slate-800">
              <div className="flex items-center gap-3">
                <span className="w-20 text-right text-slate-600 shrink-0">角色编号</span>
                <input
                  type="text"
                  value={roleFormCode}
                  onChange={(e) => setRoleFormCode(e.target.value)}
                  className="flex-1 px-3 py-1.5 border border-slate-300 rounded font-mono"
                />
              </div>

              <div className="flex items-center gap-3">
                <span className="w-20 text-right text-slate-600 shrink-0">角色名称</span>
                <input
                  type="text"
                  value={roleFormName}
                  onChange={(e) => setRoleFormName(e.target.value)}
                  placeholder="例如: 临床生化组长"
                  className="flex-1 px-3 py-1.5 border border-slate-300 rounded font-medium"
                />
              </div>

              <div className="flex items-center gap-3">
                <span className="w-20 text-right text-slate-600 shrink-0">所属单位</span>
                <select
                  value={roleFormInstCode}
                  onChange={(e) => setRoleFormInstCode(e.target.value)}
                  className="flex-1 px-3 py-1.5 border border-slate-300 rounded"
                >
                  {institutions.map((i) => (
                    <option key={i.code} value={i.code}>
                      {i.name} ({i.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-3">
                <span className="w-20 text-right text-slate-600 shrink-0">角色状态</span>
                <select
                  value={roleFormStatus}
                  onChange={(e) => setRoleFormStatus(e.target.value as '启用' | '停用')}
                  className="flex-1 px-3 py-1.5 border border-slate-300 rounded"
                >
                  <option value="启用">启用</option>
                  <option value="停用">停用</option>
                </select>
              </div>

              <div className="flex items-center gap-3">
                <span className="w-20 text-right text-slate-600 shrink-0">角色描述</span>
                <textarea
                  value={roleFormDesc}
                  onChange={(e) => setRoleFormDesc(e.target.value)}
                  rows={3}
                  placeholder="输入角色职责说明及权限隔离级别..."
                  className="flex-1 px-3 py-1.5 border border-slate-300 rounded"
                />
              </div>
            </div>

            <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setShowRoleModal(false)}
                className="px-4 py-1.5 bg-white border border-slate-300 rounded text-slate-700 hover:bg-slate-100"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleSaveRole}
                className="px-5 py-1.5 bg-[#1890ff] hover:bg-blue-600 text-white font-medium rounded shadow-2xs"
              >
                保存角色
              </button>
            </div>
          </div>
        </div>
      )}

      {/* -------------------- 5. 码表管理 -------------------- */}
      {currentSub === 'sys-code-table' && (
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-white">
          <div className="bg-[#fafafa] border-b border-slate-200 px-5 py-3 shrink-0 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <span className="text-slate-700 font-medium">码表筛选</span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="搜索码表分类或代码项名称"
                className="w-56 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded focus:border-blue-500"
              />
            </div>

            <button
              type="button"
              onClick={() => {
                showToast('添加码表项就绪');
                triggerAction('添加字典码表项');
              }}
              className="px-4 py-1.5 bg-[#1890ff] text-white hover:bg-blue-600 font-medium rounded shadow-2xs flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>添加字典码表项</span>
            </button>
          </div>

          <div className="flex-1 overflow-auto min-h-0">
            <table className="w-full border-collapse text-left text-xs text-slate-700">
              <thead className="bg-[#fafafa] text-slate-700 font-medium sticky top-0 z-10 border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4 font-mono">码表分类代码</th>
                  <th className="py-2.5 px-4">码表分类名称</th>
                  <th className="py-2.5 px-4 font-mono">代码项值</th>
                  <th className="py-2.5 px-4">代码项名称</th>
                  <th className="py-2.5 px-4 font-mono">拼音码</th>
                  <th className="py-2.5 px-4 font-mono text-center">排序号</th>
                  <th className="py-2.5 px-4 text-center">默认项</th>
                  <th className="py-2.5 px-4 text-center">状态</th>
                  <th className="py-2.5 px-4 text-center">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {codeTables
                  .filter(
                    (ct) =>
                      !searchTerm ||
                      ct.categoryName.includes(searchTerm) ||
                      ct.itemName.includes(searchTerm) ||
                      ct.itemCode.includes(searchTerm)
                  )
                  .map((ct) => (
                    <tr key={ct.id} className="hover:bg-blue-50/50">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">{ct.categoryCode}</td>
                      <td className="py-3 px-4 font-medium text-slate-800">{ct.categoryName}</td>
                      <td className="py-3 px-4 font-mono font-bold text-blue-700">{ct.itemCode}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">{ct.itemName}</td>
                      <td className="py-3 px-4 font-mono text-slate-600">{ct.pinyinCode}</td>
                      <td className="py-3 px-4 font-mono text-center">{ct.sortNo}</td>
                      <td className="py-3 px-4 text-center">
                        {ct.isDefault ? (
                          <span className="px-2 py-0.5 rounded text-[10px] bg-blue-50 text-blue-700 font-bold border border-blue-200">
                            默认
                          </span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                          {ct.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => showToast(`编辑【${ct.itemName}】`)}
                          className="text-[#1890ff] hover:underline font-medium"
                        >
                          编辑
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* -------------------- 6. 厂商字典管理 (对应截图 image_a7206134.png 与 image_c8459e11.png) -------------------- */}
      {currentSub === 'sys-vendor-dict' && (() => {
        // Filter Vendors based on Top Controls
        const filteredVendors = vendors.filter((vendor) => {
          // Inst filter
          if (vendorInstFilter && vendorInstFilter !== 'ALL' && vendor.instCode !== vendorInstFilter) {
            return false;
          }

          // Active Tab Filter: 生产商 vs 供应商
          const targetRole = vendorActiveTab === 'manufacturer' ? '生产商' : '供应商';
          if (vendor.vendorRole !== targetRole) {
            return false;
          }

          // Show Disabled Filter
          if (!vendorShowDisabled && vendor.status === '停用') {
            return false;
          }

          // Vendor Type Category Filter
          if (vendorTypeFilter && vendorTypeFilter !== 'ALL') {
            if (!vendor.category.includes(vendorTypeFilter)) {
              return false;
            }
          }

          // Vendor Name Query Filter
          if (vendorNameQuery.trim()) {
            const q = vendorNameQuery.trim().toLowerCase();
            const matchName = vendor.vendorName.toLowerCase().includes(q);
            const matchCode = vendor.vendorCode.toLowerCase().includes(q);
            const matchContact = vendor.contactPerson.toLowerCase().includes(q);
            if (!matchName && !matchCode && !matchContact) return false;
          }

          return true;
        });

        // Pagination (一页帮我显示10条数据)
        const totalCount = filteredVendors.length;
        const pageSize = 10;
        const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
        const safePage = Math.min(vendorPage, totalPages);
        const currentSlice = filteredVendors.slice((safePage - 1) * pageSize, safePage * pageSize);

        return (
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-white">
            {/* Top Control Bar matching screenshots: 单位 [下拉], 厂商名称 [输入框], 所属类型 [下拉], [ ]显示停用, [查询] */}
            <div className="bg-[#fafafa] border-b border-slate-200 px-5 py-2.5 shrink-0 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[320px]">
                {/* 单位 */}
                <div className="flex items-center gap-2">
                  <span className="text-slate-700 font-medium whitespace-nowrap">单位</span>
                  <select
                    value={vendorInstFilter}
                    onChange={(e) => {
                      setVendorInstFilter(e.target.value);
                      setVendorPage(1);
                    }}
                    className="px-2.5 py-1 text-xs text-slate-800 bg-white border border-slate-300 rounded focus:outline-hidden focus:border-blue-500 min-w-[130px]"
                  >
                    <option value="ALL">全部单位</option>
                    {institutions.map((inst) => (
                      <option key={inst.code} value={inst.code}>
                        {inst.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 厂商名称 */}
                <div className="flex items-center gap-2">
                  <span className="text-slate-700 font-medium whitespace-nowrap">厂商名称</span>
                  <input
                    type="text"
                    value={vendorNameQuery}
                    onChange={(e) => setVendorNameQuery(e.target.value)}
                    placeholder="厂商名称/联系人/编码"
                    className="w-44 px-2.5 py-1 text-xs text-slate-800 bg-white border border-slate-300 rounded focus:outline-hidden focus:border-blue-500 font-mono"
                  />
                </div>

                {/* 所属类型 */}
                <div className="flex items-center gap-2">
                  <span className="text-slate-700 font-medium whitespace-nowrap">所属类型</span>
                  <select
                    value={vendorTypeFilter}
                    onChange={(e) => {
                      setVendorTypeFilter(e.target.value);
                      setVendorPage(1);
                    }}
                    className="px-2.5 py-1 text-xs text-slate-800 bg-white border border-slate-300 rounded focus:outline-hidden focus:border-blue-500 min-w-[120px]"
                  >
                    <option value="ALL">全部类型</option>
                    <option value="设备厂商">设备厂商</option>
                    <option value="试剂厂商">试剂厂商</option>
                    <option value="中间件/软件厂商">中间件/软件厂商</option>
                    <option value="耗材供应商">耗材供应商</option>
                    <option value="综合一级供应商">综合一级供应商</option>
                  </select>
                </div>

                {/* [ ] 显示停用 */}
                <label className="flex items-center gap-1 text-slate-700 font-medium cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={vendorShowDisabled}
                    onChange={(e) => {
                      setVendorShowDisabled(e.target.checked);
                      setVendorPage(1);
                    }}
                    className="rounded text-[#1890ff] focus:ring-0 cursor-pointer"
                  />
                  <span>显示停用</span>
                </label>

                {/* 查询按钮 (白底蓝边) */}
                <button
                  type="button"
                  onClick={() => {
                    setVendorPage(1);
                    showToast(`厂商字典检索完成，共查得 ${totalCount} 条记录`);
                  }}
                  className="px-3.5 py-1 bg-white border border-[#1890ff] text-[#1890ff] hover:bg-blue-50 text-xs font-medium rounded transition-colors shadow-2xs"
                >
                  查询
                </button>
              </div>
            </div>

            {/* Action Row matching screenshot: [新增] 按钮 (实心蓝底) */}
            <div className="bg-white px-5 py-2 shrink-0 border-b border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleOpenVendorModal()}
                className="px-3.5 py-1 bg-[#1890ff] hover:bg-blue-600 text-white text-xs font-medium rounded transition-colors shadow-2xs"
              >
                新增
              </button>
            </div>

            {/* Tabs Row matching screenshots: [生产商] [供应商] */}
            <div className="bg-[#fafafa] border-b border-slate-200 px-5 pt-2 flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => {
                  setVendorActiveTab('manufacturer');
                  setVendorPage(1);
                }}
                className={`px-4 py-1.5 text-xs font-bold rounded-t border-t border-x transition-colors ${
                  vendorActiveTab === 'manufacturer'
                    ? 'bg-white border-slate-300 text-[#1890ff] shadow-2xs'
                    : 'bg-slate-100 border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                生产商
              </button>
              <button
                type="button"
                onClick={() => {
                  setVendorActiveTab('supplier');
                  setVendorPage(1);
                }}
                className={`px-4 py-1.5 text-xs font-bold rounded-t border-t border-x transition-colors ${
                  vendorActiveTab === 'supplier'
                    ? 'bg-white border-slate-300 text-[#1890ff] shadow-2xs'
                    : 'bg-slate-100 border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                供应商
              </button>
            </div>

            {/* Table Section matching screenshots image_a7206134.png and image_c8459e11.png */}
            <div className="flex-1 overflow-auto min-h-0 bg-white">
              <table className="w-full border-collapse text-left text-xs text-slate-700">
                <thead className="bg-[#fafafa] text-slate-700 font-medium sticky top-0 z-10 border-b border-slate-200">
                  <tr className="border-b border-slate-200">
                    {/* Columns dynamically adapt based on active tab */}
                    <th className="py-2.5 px-4 whitespace-nowrap">
                      {vendorActiveTab === 'manufacturer' ? '生产商名称' : '供应商名称'}
                    </th>
                    <th className="py-2.5 px-4 whitespace-nowrap">
                      {vendorActiveTab === 'manufacturer' ? '生产商类型' : '供应商类型'}
                    </th>
                    <th className="py-2.5 px-4 whitespace-nowrap font-mono">联系电话</th>
                    <th className="py-2.5 px-4 whitespace-nowrap">联系人</th>
                    <th className="py-2.5 px-4 whitespace-nowrap text-center">状态</th>
                    <th className="py-2.5 px-4 whitespace-nowrap text-center w-28">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentSlice.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        暂无匹配的{vendorActiveTab === 'manufacturer' ? '生产商' : '供应商'}记录
                      </td>
                    </tr>
                  ) : (
                    currentSlice.map((v) => (
                      <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                        {/* 厂商名称 */}
                        <td className="py-2.5 px-4 text-slate-900 font-semibold whitespace-nowrap">
                          {v.vendorName}
                        </td>

                        {/* 厂商类型 */}
                        <td className="py-2.5 px-4 text-slate-700 whitespace-nowrap">
                          {v.category}
                        </td>

                        {/* 联系电话 */}
                        <td className="py-2.5 px-4 font-mono text-slate-700 whitespace-nowrap">
                          {v.phone}
                        </td>

                        {/* 联系人 (真实中文姓名) */}
                        <td className="py-2.5 px-4 font-semibold text-slate-900 whitespace-nowrap">
                          {v.contactPerson}
                        </td>

                        {/* 状态 */}
                        <td className="py-2.5 px-4 text-center whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[11px] font-medium border ${
                              v.status === '启用'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-slate-100 text-slate-500 border-slate-300'
                            }`}
                          >
                            {v.status}
                          </span>
                        </td>

                        {/* 操作: 编辑, 停用/启用, 删除 */}
                        <td className="py-2.5 px-4 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleOpenVendorModal(v)}
                              className="text-[#1890ff] hover:underline font-medium"
                            >
                              编辑
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const newStatus = v.status === '启用' ? '停用' : '启用';
                                setVendors(
                                  vendors.map((item) =>
                                    item.id === v.id ? { ...item, status: newStatus } : item
                                  )
                                );
                                showToast(`厂商【${v.vendorName}】状态已切换为: ${newStatus}`);
                              }}
                              className="text-[#1890ff] hover:underline font-medium"
                            >
                              {v.status === '启用' ? '停用' : '启用'}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setVendors(vendors.filter((item) => item.id !== v.id));
                                showToast(`厂商【${v.vendorName}】已删除`);
                              }}
                              className="text-[#1890ff] hover:underline font-medium hover:text-red-600"
                            >
                              删除
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Bar (一页帮我显示10条数据) */}
            <div className="bg-[#fafafa] border-t border-slate-200 px-5 py-2 shrink-0 flex items-center justify-between text-xs text-slate-600">
              <span className="font-mono text-[11px]">共 {totalCount} 条 · 10条/页</span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={safePage <= 1}
                  onClick={() => setVendorPage((p) => Math.max(1, p - 1))}
                  className="px-2.5 py-0.5 bg-white border border-slate-300 rounded text-[11px] disabled:opacity-40"
                >
                  上一页
                </button>
                <span className="font-mono text-[11px] px-1">
                  第 {safePage} / 共 {totalPages} 页
                </span>
                <button
                  type="button"
                  disabled={safePage >= totalPages}
                  onClick={() => setVendorPage((p) => Math.min(totalPages, p + 1))}
                  className="px-2.5 py-0.5 bg-white border border-slate-300 rounded text-[11px] disabled:opacity-40"
                >
                  下一页
                </button>
              </div>
            </div>

            {/* 🌟 MODAL 6: 新增 / 编辑 厂商 弹窗 🌟 */}
            {showVendorModal && (
              <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-2xs flex items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-2xl border border-slate-300 w-full max-w-lg overflow-hidden animate-fadeIn">
                  <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between">
                    <div className="font-bold text-sm flex items-center gap-2">
                      <Boxes className="w-4 h-4 text-sky-400" />
                      <span>{editingVendor ? '编辑厂商信息' : '新增厂商台账'}</span>
                    </div>
                    <button
                      onClick={() => setShowVendorModal(false)}
                      className="text-white/70 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-5 space-y-3.5 text-xs text-slate-800">
                    <div className="flex items-center gap-3">
                      <span className="w-20 text-right text-slate-600 shrink-0">厂商编码</span>
                      <input
                        type="text"
                        value={vendorFormCode}
                        onChange={(e) => setVendorFormCode(e.target.value)}
                        className="flex-1 px-3 py-1.5 border border-slate-300 rounded font-mono"
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="w-20 text-right text-slate-600 shrink-0">厂商名称</span>
                      <input
                        type="text"
                        value={vendorFormName}
                        onChange={(e) => setVendorFormName(e.target.value)}
                        placeholder="例如: 奥林巴斯 (中国) 有限公司"
                        className="flex-1 px-3 py-1.5 border border-slate-300 rounded font-medium"
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="w-20 text-right text-slate-600 shrink-0">厂商角色</span>
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="radio"
                            name="vendorRole"
                            checked={vendorFormRole === '生产商'}
                            onChange={() => setVendorFormRole('生产商')}
                            className="text-blue-600 focus:ring-0"
                          />
                          <span>生产商</span>
                        </label>
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="radio"
                            name="vendorRole"
                            checked={vendorFormRole === '供应商'}
                            onChange={() => setVendorFormRole('供应商')}
                            className="text-blue-600 focus:ring-0"
                          />
                          <span>供应商</span>
                        </label>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="w-20 text-right text-slate-600 shrink-0">厂商类型</span>
                      <input
                        type="text"
                        value={vendorFormCategory}
                        onChange={(e) => setVendorFormCategory(e.target.value)}
                        placeholder="例如: 设备厂商/试剂厂商"
                        className="flex-1 px-3 py-1.5 border border-slate-300 rounded font-medium"
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="w-20 text-right text-slate-600 shrink-0">联系电话</span>
                      <input
                        type="text"
                        value={vendorFormPhone}
                        onChange={(e) => setVendorFormPhone(e.target.value)}
                        placeholder="例如: 400-820-8208"
                        className="flex-1 px-3 py-1.5 border border-slate-300 rounded font-mono"
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="w-20 text-right text-slate-600 shrink-0">联系人</span>
                      <input
                        type="text"
                        value={vendorFormContact}
                        onChange={(e) => setVendorFormContact(e.target.value)}
                        placeholder="例如: 赵立新"
                        className="flex-1 px-3 py-1.5 border border-slate-300 rounded font-medium"
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="w-20 text-right text-slate-600 shrink-0">所属单位</span>
                      <select
                        value={vendorFormInstCode}
                        onChange={(e) => setVendorFormInstCode(e.target.value)}
                        className="flex-1 px-3 py-1.5 border border-slate-300 rounded"
                      >
                        {institutions.map((i) => (
                          <option key={i.code} value={i.code}>
                            {i.name} ({i.code})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="w-20 text-right text-slate-600 shrink-0">状态</span>
                      <select
                        value={vendorFormStatus}
                        onChange={(e) => setVendorFormStatus(e.target.value as '启用' | '停用')}
                        className="flex-1 px-3 py-1.5 border border-slate-300 rounded"
                      >
                        <option value="启用">启用</option>
                        <option value="停用">停用</option>
                      </select>
                    </div>
                  </div>

                  <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex justify-end gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setShowVendorModal(false)}
                      className="px-4 py-1.5 bg-white border border-slate-300 rounded text-slate-700 hover:bg-slate-100"
                    >
                      取消
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveVendor}
                      className="px-5 py-1.5 bg-[#1890ff] hover:bg-blue-600 text-white font-medium rounded shadow-2xs"
                    >
                      保存厂商
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* -------------------- 7. 系统日志管理 -------------------- */}
      {currentSub === 'sys-logs' && (
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-white">
          <div className="bg-[#fafafa] border-b border-slate-200 px-5 py-3 shrink-0 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <span className="text-slate-700 font-medium">日志检索</span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="输入操作人、模块或IP地址"
                className="w-56 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => showToast('已完成日志检索')}
                className="px-4 py-1.5 bg-white border border-[#1890ff] text-[#1890ff] hover:bg-blue-50 font-medium rounded shadow-2xs"
              >
                查询
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                showToast('已导出 2026-10-30 安全审计日志文件 (CSV)');
                triggerAction('导出系统审计日志');
              }}
              className="px-4 py-1.5 bg-slate-900 text-white hover:bg-slate-800 font-medium rounded shadow-2xs flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>导出审计日志</span>
            </button>
          </div>

          <div className="flex-1 overflow-auto min-h-0">
            <table className="w-full border-collapse text-left text-xs text-slate-700">
              <thead className="bg-[#fafafa] text-slate-700 font-medium sticky top-0 z-10 border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4 font-mono">日志ID</th>
                  <th className="py-2.5 px-4 font-mono">操作时间</th>
                  <th className="py-2.5 px-4">操作人</th>
                  <th className="py-2.5 px-4 font-mono">登录IP</th>
                  <th className="py-2.5 px-4">操作模块</th>
                  <th className="py-2.5 px-4 text-center">动作类型</th>
                  <th className="py-2.5 px-4">操作明细留痕</th>
                  <th className="py-2.5 px-4 font-mono text-center">耗时</th>
                  <th className="py-2.5 px-4 text-center">结果</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {logs
                  .filter(
                    (l) =>
                      !searchTerm ||
                      l.operator.includes(searchTerm) ||
                      l.module.includes(searchTerm) ||
                      l.details.includes(searchTerm)
                  )
                  .map((l) => (
                    <tr key={l.id} className="hover:bg-blue-50/50">
                      <td className="py-3 px-4 font-bold text-slate-900">{l.id}</td>
                      <td className="py-3 px-4 text-slate-600">{l.timestamp}</td>
                      <td className="py-3 px-4 font-sans font-bold text-slate-900">{l.operator}</td>
                      <td className="py-3 px-4 text-slate-700">{l.ip}</td>
                      <td className="py-3 px-4 font-sans text-blue-700 font-medium">{l.module}</td>
                      <td className="py-3 px-4 text-center font-sans">
                        <span className="px-2 py-0.5 rounded text-[11px] bg-slate-100 text-slate-800 border border-slate-200">
                          {l.actionType}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-sans text-slate-800 max-w-md truncate">{l.details}</td>
                      <td className="py-3 px-4 text-center text-slate-600">{l.durationMs} ms</td>
                      <td className="py-3 px-4 text-center font-sans">
                        <span className="px-2 py-0.5 rounded-full text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                          {l.result}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
