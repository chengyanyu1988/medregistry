export interface SubMenuItem {
  id: string;
  label: string;
  iconName?: string;
  badge?: string | number;
  badgeType?: 'danger' | 'warning' | 'info' | 'success';
  description?: string;
  isFolder?: boolean;
  children?: SubMenuItem[];
}

export interface MenuItem {
  id: string;
  label: string;
  iconName: string;
  badge?: string | number;
  badgeType?: 'danger' | 'warning' | 'info' | 'success';
  description: string;
  category?: string;
  subItems: SubMenuItem[];
}

export type SidebarTheme = 'medical-blue' | 'dark-navy' | 'clean-light';

export interface UserProfile {
  name: string;
  hospital: string;
  department: string;
  subGroup?: string;
  role: string;
  avatarUrl: string;
  unreadNotifications: number;
}
