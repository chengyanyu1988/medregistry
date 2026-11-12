import React, { useState, useMemo } from 'react';
import { X, Search, Check, AlertCircle } from './MenuIcon';
import { CheckInRecordItem } from '../data/specimenCheckInData';

export interface ManualCatalogItem {
  code: string;
  name: string;
  group: '生化' | '免疫' | '临检' | '凝血' | '急诊' | '体液';
  sampleType: '血清' | '全血' | '血浆' | '尿液';
  tubeSpec: string;
}

export const MANUAL_CATALOG_ITEMS: ManualCatalogItem[] = [
  // 截图中的精确项目及编码
  { code: '1212', name: '血常规', group: '临检', sampleType: '全血', tubeSpec: '紫头管(EDTA-K2 2ml)' },
  { code: '321', name: '尿常规', group: '临检', sampleType: '尿液', tubeSpec: '尿沉渣管(10ml)' },
  { code: '312312', name: '电解质七项', group: '生化', sampleType: '血清', tubeSpec: '黄头管(促凝胶 4ml)' },
  { code: '12321', name: '血糖', group: '生化', sampleType: '血清', tubeSpec: '灰头管(氟化钠 2ml)' },
  
  // 生化组常规与急查
  { code: '20101', name: '肝功能十二项(ALT/AST/TBIL等)', group: '生化', sampleType: '血清', tubeSpec: '黄头管(促凝胶 4ml)' },
  { code: '20102', name: '肾功能四项(CREA/UREA/UA/CO2)', group: '生化', sampleType: '血清', tubeSpec: '黄头管(促凝胶 4ml)' },
  { code: '20201', name: '血脂四项(TC/TG/HDL-C/LDL-C)', group: '生化', sampleType: '血清', tubeSpec: '黄头管(促凝胶 4ml)' },
  { code: '30101', name: '心肌酶三项(CK/CK-MB/LDH)', group: '生化', sampleType: '血清', tubeSpec: '黄头管(促凝胶 4ml)' },
  { code: '30105', name: '高敏肌钙蛋白I (hs-cTnI)', group: '急诊', sampleType: '血浆', tubeSpec: '绿头管(肝素锂 3ml)' },
  
  // 凝血与免疫
  { code: '40101', name: '凝血四项(PT/APTT/TT/FIB)', group: '凝血', sampleType: '血浆', tubeSpec: '蓝头管(枸橼酸钠 2.7ml)' },
  { code: '40102', name: 'D-二聚体定量测定', group: '凝血', sampleType: '血浆', tubeSpec: '蓝头管(枸橼酸钠 2.7ml)' },
  { code: '50101', name: '糖化血红蛋白 (HbA1c)', group: '临检', sampleType: '全血', tubeSpec: '紫头管(EDTA-K2 2ml)' },
  { code: '60101', name: '甲状腺功能五项(TSH/FT3/FT4/T3/T4)', group: '免疫', sampleType: '血清', tubeSpec: '黄头管(促凝胶 4ml)' },
  { code: '60201', name: '感染性疾病四项(乙肝/丙肝/梅毒/艾滋)', group: '免疫', sampleType: '血清', tubeSpec: '红头管(干燥管 4ml)' },
];

interface CheckInManualApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: CheckInRecordItem) => void;
}

export const CheckInManualApplyModal: React.FC<CheckInManualApplyModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  if (!isOpen) return null;

  // 1. 患者信息 (严格匹配截图布局)
  const [patientSource, setPatientSource] = useState('外来');
  const [patientName, setPatientName] = useState('孙振海');
  const [patientGender, setPatientGender] = useState<'男' | '女'>('男');
  const [patientAge, setPatientAge] = useState('46');
  const [ageUnit, setAgeUnit] = useState('岁');
  const [visitNo, setVisitNo] = useState('543509');
  const [applyDept, setApplyDept] = useState('内科');
  const [applyDoctor, setApplyDoctor] = useState('张先义');
  const [company, setCompany] = useState('外送合作医院');
  const [diagnosis, setDiagnosis] = useState('伤寒待查 / 乏力发热');

  // 2. 待选项目筛选与列表 (业务小组 + 关键字查询)
  const [selectedGroup, setSelectedGroup] = useState<string>('生化');
  const [searchKeyword, setSearchKeyword] = useState('');

  // 3. 已选项目 (默认选截图中展示的 "血常规")
  const defaultItem = MANUAL_CATALOG_ITEMS.find((i) => i.code === '1212') || MANUAL_CATALOG_ITEMS[0];
  const [selectedItems, setSelectedItems] = useState<ManualCatalogItem[]>([defaultItem]);
  const [validationError, setValidationError] = useState<string | null>(null);

  // 过滤待选项目列表
  const filteredCatalog = useMemo(() => {
    return MANUAL_CATALOG_ITEMS.filter((item) => {
      // 业务小组匹配 (如果选全部或匹配)
      const matchGroup = selectedGroup === '全部' || item.group === selectedGroup;
      if (!matchGroup) return false;

      // 关键字搜索 (名称或编码)
      if (searchKeyword.trim()) {
        const kw = searchKeyword.trim().toLowerCase();
        return item.name.toLowerCase().includes(kw) || item.code.includes(kw);
      }
      return true;
    });
  }, [selectedGroup, searchKeyword]);

  // 切换项目勾选
  const handleToggleItem = (item: ManualCatalogItem) => {
    const exists = selectedItems.some((s) => s.code === item.code);
    if (exists) {
      setSelectedItems((prev) => prev.filter((s) => s.code !== item.code));
    } else {
      setSelectedItems((prev) => [...prev, item]);
    }
  };

  // 从已选列表双击移除
  const handleRemoveSelectedItem = (code: string) => {
    setSelectedItems((prev) => prev.filter((s) => s.code !== code));
  };

  // 保存处理
  const handleSave = () => {
    if (!patientName.trim()) {
      setValidationError('请填写患者姓名');
      return;
    }
    if (selectedItems.length === 0) {
      setValidationError('请至少在待选项目列表中勾选一项检验项目');
      return;
    }

    setValidationError(null);

    // 生成近期条码与时间戳 (2026-10-26)
    const randomBarcodeTail = Math.floor(1000 + Math.random() * 9000);
    const barcode = `090${randomBarcodeTail}`;
    const patientId = visitNo.trim() || `540${Math.floor(100 + Math.random() * 900)}`;
    const nowTimeStr = '2026-10-26 08:42:15';
    const checkInTimeStr = '2026-10-26 08:43:00';

    const itemNames = selectedItems.map((s) => s.name).join('+');
    const primarySampleType = selectedItems.some((i) => i.sampleType === '全血') ? '全血' : '血清';

    const newRecord: CheckInRecordItem = {
      id: `CK-MANUAL-${Date.now()}`,
      reportStatus: '未出',
      checkInStatus: '已核收',
      isUrgent: selectedItems.some((i) => i.group === '急诊'),
      barcode,
      patientId,
      patientName: patientName.trim(),
      sampleType: primarySampleType,
      testItem: itemNames,
      department: applyDept.trim() || '内科',
      applyTime: nowTimeStr,
      checkInTime: checkInTimeStr,
      details: {
        patientSource: (patientSource === '外来' ? '门诊' : patientSource) as any,
        name: patientName.trim(),
        ethnicity: '汉族',
        gender: patientGender,
        birthDate: '1980-06-18',
        age: `${patientAge}${ageUnit}`,
        phone: '13812345678',
        medicalRecordNo: patientId,
        applyDoctor: applyDoctor.trim() || '张先义',
        department: applyDept.trim() || '内科',
        doctorPhone: '15080708090',
        ward: `${applyDept.trim() || '内科'}病区`,
        nursePhone: '028-85783783',
        bedNo: '26床',
        sendDept: company.trim() || applyDept.trim() || '外来送检',
        clinicalDiagnosis: diagnosis.trim() || '临床待查',
        extraInfo: `手工申请录入 · 录入时间: ${checkInTimeStr}`,
        applyItem: itemNames,
        barcode,
        sampleType: primarySampleType === '全血' ? '全血标本(EDTA抗凝)' : '血液标本(分离胶促凝)',
        collectMethod: '真空静脉穿刺',
        collectSite: '前臂浅静脉',
        applyTime: nowTimeStr,
        sendTime: nowTimeStr,
        checkInTime: checkInTimeStr,
        auditTime: '未上机',
        unqualifiedReason: '',
        unqualifiedRemark: '手工申请核收录入，标本外观完好，已就绪分配上机',
      },
    };

    onSave(newRecord);
    onClose();
  };

  // 生成固定8行表格填补空白行 (与截图视觉一致)
  const emptyRowCount = Math.max(0, 8 - filteredCatalog.length);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-2xs flex items-center justify-center p-3 animate-fadeIn">
      <div className="bg-white rounded-lg shadow-2xl border border-slate-300 w-full max-w-4xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* ================= 标题栏 ================= */}
        <div className="px-5 py-2.5 bg-slate-100 border-b border-slate-300 flex items-center justify-between select-none">
          <h2 className="text-sm font-bold text-slate-800 tracking-wide">
            手工申请
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded p-1 transition-colors"
            title="关闭窗口"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ================= 表单主体区域 ================= */}
        <div className="p-4 overflow-y-auto space-y-3.5 text-xs">
          
          {/* 错误提示 */}
          {validationError && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded flex items-center gap-2 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{validationError}</span>
            </div>
          )}

          {/* 1. 患者信息框 (蓝字标题 + 灰框包裹) */}
          <div>
            <div className="text-sky-600 font-bold text-xs mb-1.5 flex items-center gap-1">
              <span>患者信息</span>
            </div>
            <div className="border border-slate-300 rounded p-3 bg-white space-y-2.5 shadow-2xs">
              
              {/* Row 1: 患者来源 | 患者姓名 | 患者性别 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="flex items-center gap-2">
                  <label className="w-16 shrink-0 text-slate-700 font-medium">患者来源</label>
                  <select
                    value={patientSource}
                    onChange={(e) => setPatientSource(e.target.value)}
                    className="flex-1 bg-white border border-slate-300 rounded px-2 py-1 text-slate-800 focus:outline-none focus:border-sky-500"
                  >
                    <option value="外来">外来</option>
                    <option value="门诊">门诊</option>
                    <option value="住院">住院</option>
                    <option value="急诊">急诊</option>
                    <option value="体检">体检</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <label className="w-16 shrink-0 text-slate-700 font-medium">患者姓名</label>
                  <input
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="请输入姓名"
                    className="flex-1 bg-white border border-slate-300 rounded px-2 py-1 text-slate-900 font-medium focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <label className="w-16 shrink-0 text-slate-700 font-medium">患者性别</label>
                  <select
                    value={patientGender}
                    onChange={(e) => setPatientGender(e.target.value as '男' | '女')}
                    className="flex-1 bg-white border border-slate-300 rounded px-2 py-1 text-slate-800 focus:outline-none focus:border-sky-500"
                  >
                    <option value="男">男</option>
                    <option value="女">女</option>
                  </select>
                </div>
              </div>

              {/* Row 2: 患者年龄 | 就诊号 | 申请科室 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="flex items-center gap-2">
                  <label className="w-16 shrink-0 text-slate-700 font-medium">患者年龄</label>
                  <div className="flex-1 flex gap-1.5">
                    <input
                      type="number"
                      value={patientAge}
                      onChange={(e) => setPatientAge(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-slate-800 focus:outline-none focus:border-sky-500 font-mono"
                    />
                    <select
                      value={ageUnit}
                      onChange={(e) => setAgeUnit(e.target.value)}
                      className="w-16 bg-white border border-slate-300 rounded px-1 py-1 text-slate-800 focus:outline-none focus:border-sky-500"
                    >
                      <option value="岁">岁</option>
                      <option value="月">月</option>
                      <option value="天">天</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <label className="w-16 shrink-0 text-slate-700 font-medium">就诊号</label>
                  <input
                    type="text"
                    value={visitNo}
                    onChange={(e) => setVisitNo(e.target.value)}
                    className="flex-1 bg-white border border-slate-300 rounded px-2 py-1 text-slate-800 font-mono focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <label className="w-16 shrink-0 text-slate-700 font-medium">申请科室</label>
                  <input
                    type="text"
                    value={applyDept}
                    onChange={(e) => setApplyDept(e.target.value)}
                    className="flex-1 bg-white border border-slate-300 rounded px-2 py-1 text-slate-800 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              {/* Row 3: 申请医生 | 单位 | 临床诊断 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="flex items-center gap-2">
                  <label className="w-16 shrink-0 text-slate-700 font-medium">申请医生</label>
                  <input
                    type="text"
                    value={applyDoctor}
                    onChange={(e) => setApplyDoctor(e.target.value)}
                    className="flex-1 bg-white border border-slate-300 rounded px-2 py-1 text-slate-800 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <label className="w-16 shrink-0 text-slate-700 font-medium">单位</label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="flex-1 bg-white border border-slate-300 rounded px-2 py-1 text-slate-800 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <label className="w-16 shrink-0 text-slate-700 font-medium">临床诊断</label>
                  <input
                    type="text"
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    className="flex-1 bg-white border border-slate-300 rounded px-2 py-1 text-slate-800 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

            </div>
          </div>

          {/* 2. 下半部分：左右两栏布局 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* 左栏：待选项目列表 */}
            <div className="flex flex-col">
              <div className="text-sky-600 font-bold text-xs mb-1.5">
                待选项目列表
              </div>

              {/* 筛选条 (业务小组 + 搜索输入框) */}
              <div className="flex items-center gap-2 mb-2">
                <label className="text-slate-700 whitespace-nowrap">业务小组</label>
                <select
                  value={selectedGroup}
                  onChange={(e) => setSelectedGroup(e.target.value)}
                  className="bg-white border border-slate-300 rounded px-2 py-1 text-xs text-slate-800 focus:outline-none focus:border-sky-500 w-24 shrink-0"
                >
                  <option value="生化">生化</option>
                  <option value="临检">临检</option>
                  <option value="免疫">免疫</option>
                  <option value="凝血">凝血</option>
                  <option value="急诊">急诊</option>
                  <option value="全部">全部</option>
                </select>

                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    placeholder="输入名称、编码查询"
                    className="w-full bg-white border border-slate-300 rounded px-2.5 py-1 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              {/* 表格：选择 | 编码 | 名称 */}
              <div className="border border-slate-300 rounded overflow-hidden flex-1 min-h-[220px] flex flex-col bg-white">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-300 text-slate-700">
                      <th className="py-1.5 px-3 w-12 text-center font-medium border-r border-slate-200">选择</th>
                      <th className="py-1.5 px-3 w-28 font-medium border-r border-slate-200">编码</th>
                      <th className="py-1.5 px-3 font-medium">名称</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCatalog.map((item) => {
                      const isChecked = selectedItems.some((s) => s.code === item.code);
                      return (
                        <tr
                          key={item.code}
                          onClick={() => handleToggleItem(item)}
                          className={`border-b border-slate-200 cursor-pointer transition-colors ${
                            isChecked ? 'bg-sky-50/70' : 'hover:bg-slate-50'
                          }`}
                        >
                          <td className="py-1.5 px-3 text-center border-r border-slate-200" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleToggleItem(item)}
                              className="rounded border-slate-300 text-sky-600 focus:ring-sky-500 cursor-pointer"
                            />
                          </td>
                          <td className="py-1.5 px-3 font-mono text-slate-700 border-r border-slate-200">{item.code}</td>
                          <td className="py-1.5 px-3 text-slate-800 font-medium flex items-center justify-between">
                            <span>{item.name}</span>
                            <span className="text-[10px] text-slate-400 font-normal">{item.tubeSpec}</span>
                          </td>
                        </tr>
                      );
                    })}

                    {/* 空白占位行，确保视觉高度与截图一致 */}
                    {Array.from({ length: emptyRowCount }).map((_, index) => (
                      <tr key={`empty-${index}`} className="border-b border-slate-100 h-7">
                        <td className="border-r border-slate-200"></td>
                        <td className="border-r border-slate-200"></td>
                        <td></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 右栏：已选项目列表(双击取消) */}
            <div className="flex flex-col">
              <div className="text-sky-600 font-bold text-xs mb-1.5">
                已选项目列表(双击取消)
              </div>

              {/* 空出与左侧筛选条对应的高度，保持对齐 */}
              <div className="h-[29px] mb-2 flex items-center justify-between text-slate-500 text-[11px]">
                <span>已选择 <strong className="text-sky-700 font-bold">{selectedItems.length}</strong> 项</span>
                <span className="text-slate-400">双击项目名称即可移除</span>
              </div>

              {/* 已选容器 */}
              <div className="border border-slate-300 rounded p-2.5 flex-1 min-h-[220px] bg-white overflow-y-auto space-y-1.5">
                {selectedItems.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-slate-400 text-xs italic">
                    暂未选择任何检验项目，请从左侧列表勾选
                  </div>
                ) : (
                  selectedItems.map((item) => (
                    <div
                      key={item.code}
                      onDoubleClick={() => handleRemoveSelectedItem(item.code)}
                      className="group flex items-center justify-between p-2 rounded border border-sky-200/70 bg-sky-50/50 hover:bg-rose-50 hover:border-rose-300 cursor-pointer transition-all"
                      title="双击移除此项目"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-500 group-hover:bg-rose-500" />
                        <span className="font-semibold text-slate-900 group-hover:text-rose-700">
                          {item.name}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          ({item.code})
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-600">
                          {item.tubeSpec}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveSelectedItem(item.code);
                          }}
                          className="opacity-0 group-hover:opacity-100 text-rose-500 hover:text-rose-700 p-0.5 rounded transition-opacity"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

        </div>

        {/* ================= 底部操作栏 (退出 / 保存) ================= */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3 select-none">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 text-xs font-medium rounded shadow-2xs transition-colors"
          >
            退出
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-1.5 bg-green-700 hover:bg-green-800 active:bg-green-900 text-white text-xs font-semibold rounded shadow-2xs transition-colors flex items-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5" />
            <span>保存</span>
          </button>
        </div>

      </div>
    </div>
  );
};
