import React from 'react';
import { X, ExternalLink, CheckCircle2, ArrowRight } from './MenuIcon';

interface OriginalComparisonDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OriginalComparisonDrawer: React.FC<OriginalComparisonDrawerProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const mappingItems = [
    { name: '医疗管控智能平台', role: '系统品牌标志', mapping: '左侧边栏顶部品牌标识与全院平台心跳状态' },
    { name: '首页 (新增)', icon: '🏠', mapping: '置于菜单首位：全院医疗管控综合运营总览与流水线大屏' },
    { name: '标本前处理', icon: '🧪', mapping: '标本扫码签收、分选轨道调度与异常拦截' },
    { name: '临生免系统', icon: '📋/👁️', mapping: '临床生化免疫常规、急查危急值闭环与质控LJ图谱' },
    { name: '图文报告系统', icon: '🔬', mapping: '骨髓形态学、尿沉渣镜检与多级审签' },
    { name: '微生物系统', icon: '🦠', mapping: '标本培养、质谱菌种鉴定与药敏试验(AST)' },
    { name: '耗材管理系统', icon: '🏛️/🗄️', mapping: '试剂批号效期、实时余量盘点与科室领用' },
    { name: '科室综合管理', icon: '🌐/👥', mapping: '人员排班考勤、仪器台账与质控TAT看板' },
    { name: '区域检验平台', icon: '⚙️/🌐', mapping: '医联体协同、冷链外送追踪与结果互认' },
    { name: '通信配置', icon: '⚙️/🎛️', mapping: 'LIS/HIS中间件、仪器双向联机与报文抓包' },
    { name: '系统设置', icon: '⚙️', mapping: '置于菜单最底端（带分割线）：用户权限、参数与日志审计' },
    { name: '张珊 (市中心医院)', role: '当前登录医师', mapping: '转换为左侧边栏底部精美用户卡片与通知提醒' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base">截图与左侧菜单设计对照表</h3>
            <p className="text-xs text-slate-500 mt-0.5">从原横向顶栏转换为人体工学左侧纵向多级导航</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="bg-sky-50 border border-sky-100 rounded-xl p-4 text-xs text-sky-800">
            <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50 p-2">
              <div className="text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                <span>用户上传的病区采集原始截图</span>
                <span className="text-[11px] text-slate-400">已还原为近期的交互工作台</span>
              </div>
              <img
                src="/assets/aistudio/image_18ab9497.png"
                alt="病区采集截图"
                className="w-full rounded border border-slate-200 object-contain max-h-56 bg-white"
              />
            </div>

            <div className="font-semibold mb-1">设计转换亮点：</div>
            <ul className="list-disc pl-4 space-y-1">
              <li><strong>解决横向拥挤</strong>：原顶部横栏菜单多达9个主模块，横向排列极易在较窄屏幕上换行遮挡；转换为左侧垂直布局后，层级清晰且容量充足。</li>
              <li><strong>近期真实数据全面更新</strong>：开单时间已更新至近期 (2026-10-26)，表格新增并更新了真实的病区患者、采血管类型与检验项目。</li>
              <li><strong>还原全部交互</strong>：完整还原顶部病区/时间/标本/采集方式/床号筛选、流程状态Tab、条码打印/手工申请/打印设置、右侧采集指南与右下角拒收警告通知。</li>
            </ul>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-slate-50 px-4 py-2.5 text-xs font-semibold text-slate-700 border-b border-slate-200">
              截图元素对照详情
            </div>
            <div className="divide-y divide-slate-100 text-xs">
              {mappingItems.map((item, idx) => (
                <div key={idx} className="px-4 py-2.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 font-medium text-slate-800 shrink-0">
                    {item.icon && <span>{item.icon}</span>}
                    <span>{item.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500 text-right">
                    <ArrowRight className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                    <span>{item.mapping}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            了解并返回
          </button>
        </div>
      </div>
    </div>
  );
};
