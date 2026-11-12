import React, { useState, useMemo } from 'react';
import {
  MANUAL_CATALOG_ITEMS,
  ManualCatalogItem,
  OutpatientSampleItem,
} from '../data/outpatientData';
import { X, Search } from 'lucide-react';

interface OutpatientManualApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newSample: OutpatientSampleItem) => void;
}

export const OutpatientManualApplyModal: React.FC<OutpatientManualApplyModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  if (!isOpen) return null;

  // 1. 患者信息表单状态 (与截图精确对应)
  const [source, setSource] = useState('外来');
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'男' | '女'>('男');
  const [ageValue, setAgeValue] = useState('');
  const [ageUnit, setAgeUnit] = useState('岁');
  const [patientId, setPatientId] = useState('');
  const [applyDept, setApplyDept] = useState('');
  const [applyDoctor, setApplyDoctor] = useState('');
  const [company, setCompany] = useState('');
  const [diagnosis, setDiagnosis] = useState('');

  // 2. 待选项目筛选与表格状态
  const [selectedGroup, setSelectedGroup] = useState<ManualCatalogItem['category']>('生化');
  const [filterKeyword, setFilterKeyword] = useState('');

  // 3. 已选项目列表 (默认含截图中示例"血常规")
  const [selectedItems, setSelectedItems] = useState<ManualCatalogItem[]>([
    MANUAL_CATALOG_ITEMS.find((item) => item.code === '1212' && item.name === '血常规') ||
      MANUAL_CATALOG_ITEMS[0],
  ]);

  // 根据业务小组与关键字过滤待选项目
  const filteredCatalog = useMemo(() => {
    return MANUAL_CATALOG_ITEMS.filter((item) => {
      if (item.category !== selectedGroup) return false;
      if (filterKeyword.trim()) {
        const kw = filterKeyword.trim().toLowerCase();
        return item.name.toLowerCase().includes(kw) || item.code.includes(kw);
      }
      return true;
    });
  }, [selectedGroup, filterKeyword]);

  // 勾选/取消勾选待选项目
  const handleToggleItem = (item: ManualCatalogItem) => {
    if (selectedItems.some((s) => s.code === item.code && s.name === item.name)) {
      setSelectedItems((prev) =>
        prev.filter((s) => !(s.code === item.code && s.name === item.name))
      );
    } else {
      setSelectedItems((prev) => [...prev, item]);
    }
  };

  // 双击或点击取消已选项目
  const handleRemoveSelectedItem = (item: ManualCatalogItem) => {
    setSelectedItems((prev) =>
      prev.filter((s) => !(s.code === item.code && s.name === item.name))
    );
  };

  // 保存提交
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('请填写患者姓名！');
      return;
    }
    if (selectedItems.length === 0) {
      alert('请至少勾选选择一项检验项目！');
      return;
    }

    const now = new Date();
    const formattedNow = `2026-10-26 ${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    const generatedBarcode = `4234${Math.floor(10000 + Math.random() * 90000)}`;

    const newSample: OutpatientSampleItem = {
      barcode: generatedBarcode,
      patientId: patientId.trim() || `ZY202610${Math.floor(1000 + Math.random() * 9000)}`,
      name: name.trim(),
      gender,
      age: `${ageValue || '28'}${ageUnit}`,
      department: applyDept.trim() || '门诊部',
      doctor: applyDoctor.trim() || '陈欣欣',
      testItem: selectedItems.map((s) => s.name).join('+'),
      specimen: selectedItems[0]?.specimen || '血液',
      container: selectedItems[0]?.container || '采血管',
      collectionMethod: selectedItems[0]?.specimen === '尿液' ? '尿液留取' : '静脉采血',
      feeStatus: '已收费',
      isEmergency: false,
      applyTime: formattedNow,
      status: '待采集',
    };

    onSave(newSample);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-2xs flex items-center justify-center p-4">
      {/* 弹窗主体窗口：高仿桌面医用HIS/LIS手工申请界面 */}
      <div className="bg-white rounded border border-slate-300 shadow-2xl w-full max-w-4xl text-slate-800 text-[13px] select-none flex flex-col overflow-hidden max-h-[92vh]">
        {/* 顶部标题栏 (对应截图最上方的"手工申请") */}
        <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between bg-white shrink-0">
          <h2 className="text-base font-bold text-slate-900 tracking-wide">手工申请</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-1 rounded transition-colors"
            title="关闭窗口"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 表单内容区 */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* ================= 1. 患者信息 (蓝色标题) ================= */}
          <div>
            <h3 className="text-[#0066cc] font-bold text-xs mb-2.5">患者信息</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-2.5">
              {/* Row 1 */}
              <div className="flex items-center gap-2">
                <label className="w-16 shrink-0 text-slate-700 text-xs text-right">患者来源</label>
                <select
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="flex-1 h-7 border border-slate-300 rounded-none px-2 text-xs bg-white focus:outline-none focus:border-sky-600"
                >
                  <option value="外来">外来</option>
                  <option value="门诊">门诊</option>
                  <option value="急诊">急诊</option>
                  <option value="体检">体检</option>
                  <option value="转诊">转诊</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label className="w-16 shrink-0 text-slate-700 text-xs text-right">
                  <span className="text-red-500 font-bold mr-1">*</span>患者姓名
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="请输入姓名"
                  className="flex-1 h-7 border border-slate-300 rounded-none px-2 text-xs focus:outline-none focus:border-sky-600"
                />
              </div>

              <div className="flex items-center gap-2">
                <label className="w-16 shrink-0 text-slate-700 text-xs text-right">患者性别</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as '男' | '女')}
                  className="flex-1 h-7 border border-slate-300 rounded-none px-2 text-xs bg-white focus:outline-none focus:border-sky-600"
                >
                  <option value="男">男</option>
                  <option value="女">女</option>
                </select>
              </div>

              {/* Row 2 */}
              <div className="flex items-center gap-2">
                <label className="w-16 shrink-0 text-slate-700 text-xs text-right">患者年龄</label>
                <div className="flex-1 flex gap-1">
                  <input
                    type="text"
                    value={ageValue}
                    onChange={(e) => setAgeValue(e.target.value)}
                    placeholder="28"
                    className="flex-1 h-7 border border-slate-300 rounded-none px-2 text-xs focus:outline-none focus:border-sky-600"
                  />
                  <select
                    value={ageUnit}
                    onChange={(e) => setAgeUnit(e.target.value)}
                    className="w-14 h-7 border border-slate-300 rounded-none px-1 text-xs bg-white focus:outline-none focus:border-sky-600"
                  >
                    <option value="岁">岁</option>
                    <option value="月">月</option>
                    <option value="天">天</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <label className="w-16 shrink-0 text-slate-700 text-xs text-right">就诊号</label>
                <input
                  type="text"
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  placeholder="如: 100000213"
                  className="flex-1 h-7 border border-slate-300 rounded-none px-2 text-xs focus:outline-none focus:border-sky-600 font-mono"
                />
              </div>

              <div className="flex items-center gap-2">
                <label className="w-16 shrink-0 text-slate-700 text-xs text-right">申请科室</label>
                <input
                  type="text"
                  value={applyDept}
                  onChange={(e) => setApplyDept(e.target.value)}
                  placeholder="门诊内科"
                  className="flex-1 h-7 border border-slate-300 rounded-none px-2 text-xs focus:outline-none focus:border-sky-600"
                />
              </div>

              {/* Row 3 */}
              <div className="flex items-center gap-2">
                <label className="w-16 shrink-0 text-slate-700 text-xs text-right">申请医生</label>
                <input
                  type="text"
                  value={applyDoctor}
                  onChange={(e) => setApplyDoctor(e.target.value)}
                  placeholder="陈欣欣"
                  className="flex-1 h-7 border border-slate-300 rounded-none px-2 text-xs focus:outline-none focus:border-sky-600"
                />
              </div>

              <div className="flex items-center gap-2">
                <label className="w-16 shrink-0 text-slate-700 text-xs text-right">单位</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder=""
                  className="flex-1 h-7 border border-slate-300 rounded-none px-2 text-xs focus:outline-none focus:border-sky-600"
                />
              </div>

              <div className="flex items-center gap-2">
                <label className="w-16 shrink-0 text-slate-700 text-xs text-right">临床诊断</label>
                <input
                  type="text"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  placeholder="如: 急性上呼吸道感染"
                  className="flex-1 h-7 border border-slate-300 rounded-none px-2 text-xs focus:outline-none focus:border-sky-600"
                />
              </div>
            </div>
          </div>

          {/* ================= 2. 项目选择双栏 (待选项目列表 vs 已选项目列表) ================= */}
          <div className="pt-2 grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* 左侧：待选项目列表 */}
            <div className="flex flex-col">
              <h3 className="text-[#0066cc] font-bold text-xs mb-2">待选项目列表</h3>
              {/* 业务小组筛选与搜索框 (与截图一致) */}
              <div className="flex items-center gap-1.5 mb-2">
                <div className="flex items-center border border-slate-300 h-7 bg-white shrink-0">
                  <span className="text-xs px-2 text-slate-600 bg-slate-50 border-r border-slate-300 h-full flex items-center">
                    业务小组
                  </span>
                  <select
                    value={selectedGroup}
                    onChange={(e) => setSelectedGroup(e.target.value as any)}
                    className="h-full px-2 text-xs bg-white focus:outline-none cursor-pointer"
                  >
                    <option value="生化">生化</option>
                    <option value="临检">临检</option>
                    <option value="免疫">免疫</option>
                    <option value="微生物">微生物</option>
                  </select>
                </div>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={filterKeyword}
                    onChange={(e) => setFilterKeyword(e.target.value)}
                    placeholder="输入名称、编码查询"
                    className="w-full h-7 border border-slate-300 px-2 text-xs focus:outline-none focus:border-sky-600 placeholder:text-slate-400"
                  />
                  {filterKeyword && (
                    <button
                      type="button"
                      onClick={() => setFilterKeyword('')}
                      className="absolute right-2 top-1.5 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* 待选项目表格 (还原截图中的网格与空白行) */}
              <div className="border border-slate-300 overflow-y-auto h-58 bg-white">
                <table className="w-full border-collapse text-xs text-left">
                  <thead className="bg-slate-100/90 text-slate-700 font-medium sticky top-0 border-b border-slate-300">
                    <tr>
                      <th className="w-12 px-2 py-1.5 text-center border-r border-slate-300">选择</th>
                      <th className="w-20 px-2 py-1.5 border-r border-slate-300 font-mono">编码</th>
                      <th className="px-3 py-1.5">名称</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredCatalog.map((item) => {
                      const isChecked = selectedItems.some(
                        (s) => s.code === item.code && s.name === item.name
                      );
                      return (
                        <tr
                          key={`${item.category}-${item.code}-${item.name}`}
                          onClick={() => handleToggleItem(item)}
                          className={`hover:bg-sky-50/60 cursor-pointer ${
                            isChecked ? 'bg-sky-50' : 'bg-white'
                          }`}
                        >
                          <td
                            className="px-2 py-1.5 text-center border-r border-slate-300"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleToggleItem(item)}
                              className="w-3.5 h-3.5 rounded-none border-slate-300 text-sky-600 focus:ring-0 cursor-pointer"
                            />
                          </td>
                          <td className="px-2 py-1.5 border-r border-slate-300 font-mono text-slate-600">
                            {item.code}
                          </td>
                          <td className="px-3 py-1.5 text-slate-800 font-medium">{item.name}</td>
                        </tr>
                      );
                    })}

                    {/* 补充空网格行，保持截图原汁原味的桌面系统质感 */}
                    {Array.from({ length: Math.max(0, 7 - filteredCatalog.length) }).map((_, idx) => (
                      <tr key={`empty-${idx}`} className="h-7 border-b border-slate-200">
                        <td className="border-r border-slate-300"></td>
                        <td className="border-r border-slate-300"></td>
                        <td></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 右侧：已选项目列表(双击取消) */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-[#0066cc] font-bold text-xs">已选项目列表(双击取消)</h3>
                <span className="text-[11px] text-slate-400">
                  已选 <strong className="text-slate-800 font-mono">{selectedItems.length}</strong> 项
                </span>
              </div>

              {/* 仿截图白框大容器 */}
              <div className="border border-slate-300 h-67 p-3 bg-white overflow-y-auto">
                {selectedItems.length > 0 ? (
                  <div className="space-y-1">
                    {selectedItems.map((item) => (
                      <div
                        key={`selected-${item.code}-${item.name}`}
                        onDoubleClick={() => handleRemoveSelectedItem(item)}
                        className="group flex items-center justify-between px-2 py-1 hover:bg-slate-100 rounded text-xs text-slate-800 cursor-pointer select-none transition-colors"
                        title="双击取消选择"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
                          <span className="font-medium">{item.name}</span>
                          <span className="text-[11px] text-slate-400 font-mono">({item.code})</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveSelectedItem(item)}
                          className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-600 p-0.5 rounded transition-all"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-slate-400">
                    暂无已选检验项目，请从左侧列表勾选添加
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 底部按钮栏 (精确重现截图中的[退出]与深绿色[保存]按钮) */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3 shrink-0">
            {/* 退出按钮 */}
            <button
              type="button"
              onClick={onClose}
              className="h-8 px-6 bg-white border border-slate-400 hover:bg-slate-50 active:bg-slate-100 text-slate-800 text-xs rounded transition-colors"
            >
              退出
            </button>

            {/* 保存按钮 (深绿色实体按钮 #008000) */}
            <button
              type="submit"
              className="h-8 px-6 bg-[#008000] hover:bg-[#006e00] active:bg-[#005e00] text-white text-xs font-semibold rounded transition-colors shadow-2xs"
            >
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
