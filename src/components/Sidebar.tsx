import React, { useState, useMemo } from 'react';
import { MenuItem, SubMenuItem, SidebarTheme, UserProfile } from '../types/navigation';
import {
  MenuIcon,
  ChevronDown,
  ChevronRight,
  Search,
  PanelLeftClose,
  PanelLeftOpen,
  Bell,
  Activity,
  Layers,
  Sparkles,
  ShieldCheck,
  Building2,
  X,
  Folder,
  FolderOpen,
  Table2,
  FileText
} from './MenuIcon';

interface SidebarProps {
  items: MenuItem[];
  activeMenuId: string;
  activeSubMenuId: string | null;
  onSelectMenu: (menuId: string, subMenuId?: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  theme: SidebarTheme;
  user: UserProfile;
  onOpenNotifications: () => void;
  onOpenCodeModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  items,
  activeMenuId,
  activeSubMenuId,
  onSelectMenu,
  collapsed,
  onToggleCollapse,
  theme,
  user,
  onOpenNotifications,
  onOpenCodeModal,
}) => {
  const [expandedMenuIds, setExpandedMenuIds] = useState<Record<string, boolean>>({
    [activeMenuId]: true,
    'specimen-pretreatment': true,
    'clinical-chem-immuno': true,
    'graphic-report': true,
    'regional-lab': true,
  });
  const [expandedSubFolderIds, setExpandedSubFolderIds] = useState<Record<string, boolean>>({
    'basic-management': true,
    'qc-management': true,
    'graphic-basic-setting': true,
    'dept-work-folder': true,
    'dept-prof-folder': true,
    'dept-qc-folder': true,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredMenuId, setHoveredMenuId] = useState<string | null>(null);

  // Toggle accordion expansion
  const toggleMenuExpand = (menuId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedMenuIds((prev) => ({
      ...prev,
      [menuId]: !prev[menuId],
    }));
  };

  // Toggle subfolder expansion (e.g. 基础管理, 质控管理)
  const toggleSubFolder = (folderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedSubFolderIds((prev) => ({
      ...prev,
      [folderId]: !prev[folderId],
    }));
  };

  // Filter menu items by search query (including 3rd level children)
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    const q = searchQuery.toLowerCase().trim();
    return items
      .map((item) => {
        const matchesItem =
          item.label.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q);
        const matchedSubItems = item.subItems.filter(
          (sub) =>
            sub.label.toLowerCase().includes(q) ||
            (sub.description && sub.description.toLowerCase().includes(q)) ||
            (sub.children && sub.children.some((c) => c.label.toLowerCase().includes(q)))
        );
        if (matchesItem || matchedSubItems.length > 0) {
          return {
            ...item,
            subItems: matchedSubItems.length > 0 ? matchedSubItems : item.subItems,
          };
        }
        return null;
      })
      .filter((item): item is MenuItem => item !== null);
  }, [items, searchQuery]);

  // Theme-specific styles
  const themeStyles = useMemo(() => {
    switch (theme) {
      case 'medical-blue':
        // Vibrant hospital cyan/blue inspired by the user's top bar screenshot
        return {
          wrapper: 'bg-gradient-to-b from-sky-600 via-sky-700 to-blue-800 text-white border-r border-sky-500/30',
          headerBorder: 'border-sky-500/30',
          searchBg: 'bg-sky-800/60 border-sky-400/30 text-white placeholder-sky-200/70 focus:border-white focus:bg-sky-900/80',
          itemDefault: 'text-sky-100 hover:bg-sky-600/60 hover:text-white',
          itemActive: 'bg-white text-sky-800 font-semibold shadow-sm',
          itemActiveIcon: 'text-sky-700',
          itemInactiveIcon: 'text-sky-200',
          subItemDefault: 'text-sky-200 hover:text-white hover:bg-sky-600/40',
          subItemActive: 'bg-sky-500/40 text-white font-medium border-l-2 border-white',
          badgeWarning: 'bg-amber-400 text-slate-900',
          badgeDanger: 'bg-rose-500 text-white',
          badgeInfo: 'bg-sky-300 text-slate-900',
          badgeSuccess: 'bg-emerald-400 text-slate-900',
          userCard: 'bg-sky-800/70 border-sky-500/30 text-white',
          flyoutBg: 'bg-sky-900 text-white border-sky-600 shadow-xl',
          collapseBtn: 'text-sky-200 hover:text-white hover:bg-sky-600/50',
        };
      case 'dark-navy':
        // High-tech lab dark console
        return {
          wrapper: 'bg-slate-900 text-slate-100 border-r border-slate-800',
          headerBorder: 'border-slate-800',
          searchBg: 'bg-slate-800/80 border-slate-700 text-slate-100 placeholder-slate-400 focus:border-sky-500 focus:bg-slate-800',
          itemDefault: 'text-slate-300 hover:bg-slate-800 hover:text-white',
          itemActive: 'bg-sky-600 text-white font-semibold shadow-sm',
          itemActiveIcon: 'text-white',
          itemInactiveIcon: 'text-slate-400',
          subItemDefault: 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60',
          subItemActive: 'bg-slate-800 text-sky-400 font-medium border-l-2 border-sky-400',
          badgeWarning: 'bg-amber-500/20 text-amber-300 border border-amber-500/40',
          badgeDanger: 'bg-rose-500/20 text-rose-300 border border-rose-500/40',
          badgeInfo: 'bg-sky-500/20 text-sky-300 border border-sky-500/40',
          badgeSuccess: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40',
          userCard: 'bg-slate-800/80 border-slate-700 text-slate-200',
          flyoutBg: 'bg-slate-800 text-white border-slate-700 shadow-2xl',
          collapseBtn: 'text-slate-400 hover:text-white hover:bg-slate-800',
        };
      case 'clean-light':
      default:
        // Clean clinical medical white
        return {
          wrapper: 'bg-white text-slate-800 border-r border-slate-200 shadow-sm',
          headerBorder: 'border-slate-100',
          searchBg: 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-sky-500 focus:bg-white',
          itemDefault: 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
          itemActive: 'bg-sky-50 text-sky-700 font-semibold shadow-sm border border-sky-100',
          itemActiveIcon: 'text-sky-600',
          itemInactiveIcon: 'text-slate-400',
          subItemDefault: 'text-slate-500 hover:text-slate-900 hover:bg-slate-50',
          subItemActive: 'bg-sky-100/70 text-sky-800 font-medium border-l-2 border-sky-600',
          badgeWarning: 'bg-amber-100 text-amber-800',
          badgeDanger: 'bg-rose-100 text-rose-700',
          badgeInfo: 'bg-sky-100 text-sky-700',
          badgeSuccess: 'bg-emerald-100 text-emerald-800',
          userCard: 'bg-slate-50 border-slate-200 text-slate-700',
          flyoutBg: 'bg-white text-slate-800 border-slate-200 shadow-xl',
          collapseBtn: 'text-slate-500 hover:text-slate-900 hover:bg-slate-100',
        };
    }
  }, [theme]);

  const renderBadge = (badge?: string | number, type: 'danger' | 'warning' | 'info' | 'success' = 'info') => {
    if (!badge) return null;
    let badgeClass = themeStyles.badgeInfo;
    if (type === 'danger') badgeClass = themeStyles.badgeDanger;
    if (type === 'warning') badgeClass = themeStyles.badgeWarning;
    if (type === 'success') badgeClass = themeStyles.badgeSuccess;

    return (
      <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap tabular-nums ${badgeClass}`}>
        {badge}
      </span>
    );
  };

  return (
    <aside
      className={`h-screen flex flex-col transition-all duration-300 relative select-none z-30 shrink-0 ${
        collapsed ? 'w-[72px]' : 'w-[268px]'
      } ${themeStyles.wrapper}`}
      aria-label="医疗管控系统左侧主导航"
    >
      {/* 1. Header Zone: Brand & Hospital */}
      <div className={`px-4 py-4 flex items-center justify-between border-b ${themeStyles.headerBorder}`}>
        {!collapsed ? (
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center shrink-0 shadow-inner">
              <Activity className="w-5 h-5 text-current animate-pulse" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-base tracking-tight truncate leading-tight">
                医疗管控智能平台
              </span>
              <div className="flex items-center gap-1.5 text-xs opacity-80 mt-0.5">
                <Building2 className="w-3 h-3 shrink-0" />
                <span className="truncate">{user.hospital}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full flex justify-center">
            <div
              className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center cursor-pointer shadow-inner"
              title="医疗管控智能平台 · 市中心医院"
              onClick={onToggleCollapse}
            >
              <Activity className="w-5 h-5 text-current" />
            </div>
          </div>
        )}

        {/* Collapse toggle button */}
        {!collapsed && (
          <button
            onClick={onToggleCollapse}
            title="收起左侧菜单 (折叠为图标模式)"
            className={`p-1.5 rounded-md transition-colors ${themeStyles.collapseBtn}`}
            aria-label="收起左侧菜单"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 2. Search / Quick Filter (Visible when expanded) */}
      {!collapsed && (
        <div className="px-3 pt-3 pb-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 opacity-60" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="快速检索模块与功能..."
              className={`w-full text-xs pl-8 pr-7 py-1.5 rounded-md border outline-none transition-all ${themeStyles.searchBg}`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* 3. Navigation List */}
      <nav className="flex-1 overflow-y-auto px-2 py-2 space-y-1 custom-scrollbar">
        {filteredItems.length === 0 && !collapsed && (
          <div className="px-4 py-8 text-center text-xs opacity-60">
            未找到匹配的系统模块
          </div>
        )}

        {filteredItems.map((item) => {
          const isActive = activeMenuId === item.id;
          const isExpanded = expandedMenuIds[item.id] || searchQuery.length > 0;
          const hasSubItems = item.subItems && item.subItems.length > 0;
          const isSystemSettings = item.id === 'system-settings';

          return (
            <div
              key={item.id}
              className="relative"
              onMouseEnter={() => collapsed && setHoveredMenuId(item.id)}
              onMouseLeave={() => collapsed && setHoveredMenuId(null)}
            >
              {isSystemSettings && (
                <div className="my-2 mx-1 border-t border-white/15 dark:border-slate-800" />
              )}
              {/* Primary Menu Item Button */}
              <div
                onClick={() => {
                  onSelectMenu(item.id, item.subItems[0]?.id);
                  if (!collapsed && hasSubItems) {
                    setExpandedMenuIds((prev) => ({
                      ...prev,
                      [item.id]: !prev[item.id],
                    }));
                  }
                }}
                className={`group flex items-center justify-between px-3 py-2.5 rounded-lg text-sm cursor-pointer transition-all duration-150 ${
                  isActive ? themeStyles.itemActive : themeStyles.itemDefault
                } ${collapsed ? 'justify-center px-0' : ''}`}
                title={collapsed ? `${item.label} - ${item.description}` : item.description}
                role="button"
                tabIndex={0}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`shrink-0 transition-colors ${
                      isActive ? themeStyles.itemActiveIcon : themeStyles.itemInactiveIcon
                    }`}
                  >
                    <MenuIcon name={item.iconName} className="w-5 h-5" />
                  </div>

                  {!collapsed && (
                    <span className="truncate font-medium tracking-tight whitespace-nowrap">
                      {item.label}
                    </span>
                  )}
                </div>

                {!collapsed && (
                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    {renderBadge(item.badge, item.badgeType)}
                    {hasSubItems && (
                      <button
                        onClick={(e) => toggleMenuExpand(item.id, e)}
                        className="p-0.5 rounded hover:bg-black/10 transition-transform"
                        aria-label={isExpanded ? '折叠子菜单' : '展开子菜单'}
                      >
                        <ChevronDown
                          className={`w-3.5 h-3.5 opacity-70 transition-transform duration-200 ${
                            isExpanded ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Sub-menu accordion (Expanded Mode) */}
              {!collapsed && hasSubItems && isExpanded && (
                <div className="mt-1 ml-4 pl-2.5 border-l border-white/20 dark:border-slate-700/60 space-y-0.5 py-0.5 animate-fadeIn">
                  {item.subItems.map((sub) => {
                    const hasChildren = Boolean(sub.children && sub.children.length > 0);
                    const isFolderOpen = expandedSubFolderIds[sub.id] ?? true;

                    // If it's a folder (Level 2 folder with Level 3 items, e.g. 基础管理, 质控管理)
                    if (hasChildren) {
                      const isAnyChildActive = sub.children?.some(
                        (child) => isActive && activeSubMenuId === child.id
                      );

                      return (
                        <div key={sub.id} className="pt-0.5">
                          {/* Folder Header */}
                          <div
                            onClick={(e) => toggleSubFolder(sub.id, e)}
                            className={`flex items-center justify-between px-2 py-1.5 rounded-md text-xs cursor-pointer transition-colors group select-none ${
                              isAnyChildActive
                                ? 'text-white font-semibold bg-white/15 shadow-2xs'
                                : 'text-sky-100 hover:text-white hover:bg-white/10'
                            }`}
                          >
                            <div className="flex items-center gap-1.5 min-w-0">
                              <span className="text-[10px] text-sky-200 transition-transform font-mono">
                                {isFolderOpen ? '▾' : '▸'}
                              </span>
                              {isFolderOpen ? (
                                <FolderOpen className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                              ) : (
                                <Folder className="w-3.5 h-3.5 text-sky-300 shrink-0" />
                              )}
                              <span className="truncate whitespace-nowrap font-medium text-[12px]">
                                {sub.label}
                              </span>
                            </div>
                            <span className="text-[10px] px-1 py-0.2 rounded bg-black/15 text-white/80 font-mono">
                              {sub.children?.length}
                            </span>
                          </div>

                          {/* Level 3 Children List */}
                          {isFolderOpen && (
                            <div className="ml-3.5 pl-2.5 border-l border-white/15 dark:border-slate-700/40 space-y-0.5 mt-0.5 py-0.5 animate-fadeIn">
                              {sub.children?.map((child) => {
                                const isChildActive = isActive && activeSubMenuId === child.id;
                                return (
                                  <div
                                    key={child.id}
                                    onClick={() => onSelectMenu(item.id, child.id)}
                                    className={`flex items-center justify-between px-2 py-1 rounded-md text-[11px] cursor-pointer transition-all ${
                                      isChildActive
                                        ? themeStyles.subItemActive
                                        : themeStyles.subItemDefault
                                    }`}
                                    role="button"
                                    tabIndex={0}
                                  >
                                    <div className="flex items-center gap-1.5 min-w-0">
                                      <Table2 className="w-3 h-3 opacity-60 shrink-0" />
                                      <span className="truncate whitespace-nowrap">
                                        {child.label}
                                      </span>
                                    </div>
                                    {renderBadge(child.badge, child.badgeType)}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    }

                    // Level 2 Standard Item
                    const isSubActive = isActive && activeSubMenuId === sub.id;
                    return (
                      <div
                        key={sub.id}
                        onClick={() => onSelectMenu(item.id, sub.id)}
                        className={`flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs cursor-pointer transition-all ${
                          isSubActive ? themeStyles.subItemActive : themeStyles.subItemDefault
                        }`}
                        role="button"
                        tabIndex={0}
                      >
                        <div className="flex items-center gap-1.5 min-w-0">
                          {sub.iconName === 'FileText' ? (
                            <FileText className="w-3.5 h-3.5 opacity-70 shrink-0" />
                          ) : sub.iconName ? (
                            <MenuIcon name={sub.iconName} className="w-3.5 h-3.5 opacity-70 shrink-0" />
                          ) : sub.id === 'specimen-check-in' ? (
                            <span className="text-[10px] text-sky-200">▸</span>
                          ) : (
                            <Table2 className="w-3 h-3 opacity-60 shrink-0" />
                          )}
                          <span className="truncate whitespace-nowrap">{sub.label}</span>
                        </div>
                        {renderBadge(sub.badge, sub.badgeType)}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Floating Flyout Menu (Collapsed Mode on Hover) */}
              {collapsed && hoveredMenuId === item.id && (
                <div
                  className={`absolute left-[76px] top-0 z-50 w-64 max-h-[85vh] overflow-y-auto rounded-lg p-2.5 border ${themeStyles.flyoutBg}`}
                >
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <MenuIcon name={item.iconName} className="w-4 h-4 text-sky-400" />
                      <span className="font-semibold text-sm">{item.label}</span>
                    </div>
                    {renderBadge(item.badge, item.badgeType)}
                  </div>
                  <p className="text-[11px] opacity-75 mb-2 leading-relaxed">
                    {item.description}
                  </p>

                  {hasSubItems && (
                    <div className="space-y-1.5">
                      <span className="text-[10px] uppercase font-semibold opacity-60 px-1">
                        功能与基础字典导航
                      </span>
                      {item.subItems.map((sub) => {
                        const hasChildren = Boolean(sub.children && sub.children.length > 0);

                        if (hasChildren) {
                          return (
                            <div key={sub.id} className="pt-1">
                              <div className="flex items-center gap-1 px-1.5 py-0.5 text-[11px] font-semibold text-sky-300">
                                <Folder className="w-3 h-3 text-sky-300" />
                                <span>{sub.label}</span>
                              </div>
                              <div className="grid grid-cols-2 gap-1 mt-1 pl-1">
                                {sub.children?.map((child) => {
                                  const isChildActive = isActive && activeSubMenuId === child.id;
                                  return (
                                    <div
                                      key={child.id}
                                      onClick={() => {
                                        onSelectMenu(item.id, child.id);
                                        setHoveredMenuId(null);
                                      }}
                                      className={`px-1.5 py-1 rounded text-[10px] truncate cursor-pointer transition-colors ${
                                        isChildActive
                                          ? 'bg-sky-500 text-white font-medium'
                                          : 'hover:bg-white/10 text-white/80'
                                      }`}
                                    >
                                      {child.label}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        }

                        const isSubActive = isActive && activeSubMenuId === sub.id;
                        return (
                          <div
                            key={sub.id}
                            onClick={() => {
                              onSelectMenu(item.id, sub.id);
                              setHoveredMenuId(null);
                            }}
                            className={`flex items-center justify-between px-2 py-1 rounded text-xs cursor-pointer transition-colors ${
                              isSubActive
                                ? 'bg-sky-500 text-white font-medium'
                                : 'hover:bg-white/10 text-white/90'
                            }`}
                          >
                            <span className="truncate">{sub.label}</span>
                            {renderBadge(sub.badge, sub.badgeType)}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* 4. Footer Zone: User Info & Notification */}
      <div className={`p-2.5 border-t ${themeStyles.headerBorder}`}>
        {!collapsed ? (
          <div className={`p-2.5 rounded-lg border transition-all ${themeStyles.userCard}`}>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="relative shrink-0">
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    referrerPolicy="no-referrer"
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-white/20"
                    onError={(e) => {
                      // Fallback avatar icon
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-900 absolute bottom-0 right-0" />
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-xs truncate">{user.name}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-white/20 whitespace-nowrap">
                      主任
                    </span>
                  </div>
                  <span className="text-[11px] opacity-75 truncate">{user.department}</span>
                </div>
              </div>

              {/* Notification icon */}
              <button
                onClick={onOpenNotifications}
                className="relative p-1.5 rounded-md hover:bg-black/10 transition-colors"
                title={`查看通知提醒 (${user.unreadNotifications}条待办)`}
                aria-label="查看通知提醒"
              >
                <Bell className="w-4 h-4 opacity-90" />
                {user.unreadNotifications > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-sky-700 animate-pulse" />
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-1">
            <button
              onClick={onToggleCollapse}
              title="展开左侧菜单"
              className={`p-2 rounded-lg transition-colors ${themeStyles.collapseBtn}`}
              aria-label="展开左侧菜单"
            >
              <PanelLeftOpen className="w-5 h-5" />
            </button>
            <div className="relative cursor-pointer" onClick={onOpenNotifications} title={`${user.name} (${user.hospital})`}>
              <img
                src={user.avatarUrl}
                alt={user.name}
                referrerPolicy="no-referrer"
                className="w-8 h-8 rounded-full object-cover ring-1 ring-white/30"
              />
              <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-rose-500" />
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
