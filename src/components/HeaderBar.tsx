import React, { useState } from 'react';
import { MenuItem, SidebarTheme, UserProfile } from '../types/navigation';
import {
  Bell,
  PanelLeftClose,
  PanelLeftOpen,
  Sparkles,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertTriangle,
  User,
  ChevronDown,
  ShieldCheck,
  Building2,
  Key
} from './MenuIcon';

interface HeaderBarProps {
  activeMenu: MenuItem;
  activeSubMenuLabel?: string;
  theme: SidebarTheme;
  onThemeChange: (theme: SidebarTheme) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onOpenCodeModal: () => void;
  onToggleScreenshotDrawer: () => void;
  user: UserProfile;
  currentAccount?: string;
  onOpenNotifications: () => void;
  onLogout?: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  activeMenu,
  activeSubMenuLabel,
  theme,
  onThemeChange,
  collapsed,
  onToggleCollapse,
  onOpenCodeModal,
  onToggleScreenshotDrawer,
  user,
  currentAccount = 'admin',
  onOpenNotifications,
  onLogout,
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  return (
    <header className="h-16 px-6 bg-white border-b border-slate-200 flex items-center justify-between shrink-0 z-20 shadow-xs">
      {/* Zone 1: Breadcrumbs & Module Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onToggleCollapse}
          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          title={collapsed ? '展开左侧菜单' : '收起左侧菜单'}
        >
          {collapsed ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
        </button>

        <div className="h-4 w-px bg-slate-200" />

        <div className="flex items-center gap-2 text-sm text-slate-500 min-w-0">
          <span className="text-slate-400 font-medium whitespace-nowrap">医疗管控智能平台</span>
          <span className="text-slate-300">/</span>
          <span className="font-semibold text-slate-800 whitespace-nowrap">{activeMenu.label}</span>
          {activeSubMenuLabel && (
            <>
              <span className="text-slate-300">/</span>
              <span className="text-sky-600 font-medium whitespace-nowrap">{activeSubMenuLabel}</span>
            </>
          )}
        </div>
      </div>
      {/* Zone 2: Theme Selector & Action Tools */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="flex items-center p-0.5 bg-slate-100 rounded-lg border border-slate-200 text-xs">
          <button
            onClick={() => onThemeChange('medical-blue')}
            className={`px-2.5 py-1 rounded-md transition-all font-medium whitespace-nowrap ${
              theme === 'medical-blue'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="经典医用蓝 (还原原图视觉色系)"
          >
            医用蓝
          </button>
          <button
            onClick={() => onThemeChange('dark-navy')}
            className={`px-2.5 py-1 rounded-md transition-all font-medium whitespace-nowrap ${
              theme === 'dark-navy'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="深色控制台"
          >
            深色台
          </button>
          <button
            onClick={() => onThemeChange('clean-light')}
            className={`px-2.5 py-1 rounded-md transition-all font-medium whitespace-nowrap ${
              theme === 'clean-light'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="简约洁净白"
          >
            洁净白
          </button>
        </div>

        <div className="h-4 w-px bg-slate-200 hidden sm:block" />

        {/* Notifications */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          title="系统消息提醒"
        >
          <Bell className="w-4 h-4" />
          {user.unreadNotifications > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
          )}
        </button>

        {/* User Account Info Dropdown (右上角展示账号与身份信息) */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors select-none group"
            title="当前登录账号"
          >
            <div className="relative w-7 h-7 rounded-full bg-sky-100 border border-sky-200 flex items-center justify-center text-sky-700 font-bold shrink-0">
              <User className="w-4 h-4" />
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-white" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold text-slate-800 leading-tight">
                {currentAccount}
              </span>
              <span className="text-[10px] text-slate-400 leading-tight">
                {user.role || '超级管理员'}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-transform" />
          </button>

          {/* User Profile Popup Menu */}
          {isUserMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setIsUserMenuOpen(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-3 px-3.5 z-40 animate-in fade-in zoom-in-95 text-xs text-slate-700">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                    {currentAccount.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-sm text-slate-900 truncate flex items-center gap-1.5">
                      <span>{currentAccount}</span>
                      <span className="text-[10px] font-normal px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                        在线
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 truncate mt-0.5">
                      {user.hospital} · {user.department}
                    </div>
                  </div>
                </div>

                <div className="py-2.5 space-y-1.5 text-[11px] text-slate-600 border-b border-slate-100">
                  <div className="flex justify-between">
                    <span className="text-slate-400">职工工号:</span>
                    <span className="font-mono font-medium text-slate-800">001001</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">系统权限:</span>
                    <span className="font-medium text-blue-600">{user.role || '系统超级管理员'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">网络连接:</span>
                    <span className="text-emerald-600 font-medium">医院内网专线 (合规)</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      if (onLogout) onLogout();
                    }}
                    className="w-full py-2 px-3 text-rose-600 hover:bg-rose-50 rounded-lg font-medium transition-colors text-left flex items-center justify-between"
                  >
                    <span>退出系统登录</span>
                    <span className="text-[11px] text-rose-400 font-mono">Exit</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
