/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { MENU_ITEMS, USER_PROFILE } from './data/menuData';
import { SidebarTheme } from './types/navigation';
import { Sidebar } from './components/Sidebar';
import { HeaderBar } from './components/HeaderBar';
import { ModuleWorkspace } from './components/ModuleWorkspace';
import { OriginalComparisonDrawer } from './components/OriginalComparisonDrawer';
import { CodeExportModal } from './components/CodeExportModal';
import { NotificationModal } from './components/NotificationModal';
import { LoginPage } from './components/LoginPage';

export default function App() {
  const [activeMenuId, setActiveMenuId] = useState<string>('specimen-pretreatment');
  const [activeSubMenuId, setActiveSubMenuId] = useState<string | null>('spec-outpatient');
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [theme, setTheme] = useState<SidebarTheme>('medical-blue');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [currentAccount, setCurrentAccount] = useState<string>('admin');

  // Modals state
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // Current active menu and submenu objects (supporting 2nd and 3rd level submenus)
  const activeMenu = MENU_ITEMS.find((m) => m.id === activeMenuId) || MENU_ITEMS[0];
  const activeSubMenu = useMemo(() => {
    if (!activeSubMenuId) return activeMenu.subItems[0];
    for (const sub of activeMenu.subItems) {
      if (sub.id === activeSubMenuId) return sub;
      if (sub.children) {
        const matchedChild = sub.children.find((c) => c.id === activeSubMenuId);
        if (matchedChild) return matchedChild;
      }
    }
    return activeMenu.subItems[0];
  }, [activeMenu, activeSubMenuId]);

  const handleSelectMenu = (menuId: string, subId?: string) => {
    setActiveMenuId(menuId);
    const targetMenu = MENU_ITEMS.find((m) => m.id === menuId);
    if (subId) {
      setActiveSubMenuId(subId);
    } else if (targetMenu && targetMenu.subItems.length > 0) {
      setActiveSubMenuId(targetMenu.subItems[0].id);
    } else {
      setActiveSubMenuId(null);
    }
  };

  const handleSelectSubMenu = (subId: string) => {
    setActiveSubMenuId(subId);
  };

  // 未登录时展示 1:1 实验室登录页
  if (!isLoggedIn) {
    return (
      <LoginPage
        onLoginSuccess={(acc) => {
          setCurrentAccount(acc || 'admin');
          setIsLoggedIn(true);
        }}
      />
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100 font-sans text-slate-900 antialiased">
      {/* 1. Left Sidebar Navigation Component */}
      <Sidebar
        items={MENU_ITEMS}
        activeMenuId={activeMenuId}
        activeSubMenuId={activeSubMenuId}
        onSelectMenu={handleSelectMenu}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((prev) => !prev)}
        theme={theme}
        user={USER_PROFILE}
        onOpenNotifications={() => setIsNotificationOpen(true)}
        onOpenCodeModal={() => setIsCodeModalOpen(true)}
      />

      {/* 2. Main Layout Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header Bar */}
        <HeaderBar
          activeMenu={activeMenu}
          activeSubMenuLabel={activeSubMenu?.label}
          theme={theme}
          onThemeChange={setTheme}
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed((prev) => !prev)}
          onOpenCodeModal={() => setIsCodeModalOpen(true)}
          onToggleScreenshotDrawer={() => setIsComparisonOpen(true)}
          user={USER_PROFILE}
          currentAccount={currentAccount}
          onOpenNotifications={() => setIsNotificationOpen(true)}
          onLogout={() => setIsLoggedIn(false)}
        />

        {/* Interactive Workspace for the active module */}
        <main className="flex-1 flex overflow-hidden">
          <ModuleWorkspace
            activeMenu={activeMenu}
            activeSubMenu={activeSubMenu}
            onSelectSubMenu={handleSelectSubMenu}
            user={USER_PROFILE}
          />
        </main>
      </div>

      {/* 3. Modal Dialogs */}
      <OriginalComparisonDrawer
        isOpen={isComparisonOpen}
        onClose={() => setIsComparisonOpen(false)}
      />

      <CodeExportModal
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
      />

      <NotificationModal
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />
    </div>
  );
}
