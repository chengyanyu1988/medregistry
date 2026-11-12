import React, { useState } from 'react';
import { X, Copy, Check, Code2 } from './MenuIcon';

interface CodeExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CodeExportModal: React.FC<CodeExportModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const componentSnippet = `/**
 * 医疗管控智能平台 - 左侧导航菜单组件 (Medical Platform Sidebar)
 * 基于 React + Tailwind CSS + Lucide Icons 构建
 */
import React, { useState } from 'react';
import {
  Home, FlaskConical, FileText, Microscope, Dna,
  Boxes, LayoutGrid, Network, Sliders, Settings, ChevronDown,
  Search, PanelLeftClose, PanelLeftOpen, Bell, Activity
} from 'lucide-react';

export const MedicalSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState('dashboard-home');
  const [activeSubMenu, setActiveSubMenu] = useState('home-overview');

  const menuItems = [
    { id: 'dashboard-home', label: '首页', icon: Home },
    { id: 'specimen-pretreatment', label: '标本前处理', icon: FlaskConical, badge: 24 },
    { id: 'clinical-chem-immuno', label: '临生免系统', icon: FileText, badge: '急查3' },
    { id: 'graphic-report', label: '图文报告系统', icon: Microscope, badge: 8 },
    { id: 'microbiology', label: '微生物系统', icon: Dna },
    { id: 'consumables-management', label: '耗材管理系统', icon: Boxes },
    { id: 'dept-management', label: '科室综合管理', icon: LayoutGrid },
    { id: 'regional-lab', label: '区域检验平台', icon: Network },
    { id: 'communication-config', label: '通信配置', icon: Sliders },
    { id: 'system-settings', label: '系统设置', icon: Settings },
  ];

  return (
    <aside className={\`h-screen flex flex-col bg-gradient-to-b from-sky-600 to-blue-800 text-white transition-all duration-300 \${collapsed ? 'w-20' : 'w-64'}\`}>
      {/* 平台标识 */}
      <div className="p-4 flex items-center justify-between border-b border-sky-500/30">
        {!collapsed && <span className="font-bold text-base truncate">医疗管控智能平台</span>}
        <button onClick={() => setCollapsed(!collapsed)} className="p-1 hover:bg-white/10 rounded">
          {collapsed ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
        </button>
      </div>

      {/* 菜单列表 */}
      <nav className="flex-1 overflow-y-auto p-2 space-y-1">
        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = activeMenu === item.id;
          return (
            <div
              key={item.id}
              onClick={() => setActiveMenu(item.id)}
              className={\`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm cursor-pointer transition-colors \${
                isActive ? 'bg-white text-sky-800 font-semibold' : 'text-sky-100 hover:bg-sky-500/40'
              } \${collapsed ? 'justify-center' : ''}\`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span className="truncate flex-1">{item.label}</span>}
              {!collapsed && item.badge && (
                <span className="text-[11px] bg-rose-500 text-white px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </div>
          );
        })}
      </nav>

      {/* 底部用户信息 */}
      <div className="p-3 border-t border-sky-500/30 flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs">
          张
        </div>
        {!collapsed && (
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-semibold">张珊 (主任)</span>
            <span className="text-[10px] text-sky-200">市中心医院 · 检验科</span>
          </div>
        )}
      </div>
    </aside>
  );
};
export default MedicalSidebar;`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(componentSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Code2 className="w-5 h-5 text-sky-600" />
            <div>
              <h3 className="font-bold text-slate-900 text-base">导出左侧菜单组件源码</h3>
              <p className="text-xs text-slate-500 mt-0.5">开箱即用的 React + Tailwind + TypeScript 菜单模板</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Code Content */}
        <div className="p-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-slate-500">MedicalSidebar.tsx (单文件标准组件)</span>
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors shadow-xs"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? '已复制到剪贴板！' : '一键复制完整代码'}</span>
            </button>
          </div>
          <pre className="p-4 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs leading-relaxed overflow-x-auto max-h-[50vh] border border-slate-800">
            <code>{componentSnippet}</code>
          </pre>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500">包含自适应折叠、状态角标与医院科室信息</span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            完成
          </button>
        </div>
      </div>
    </div>
  );
};
