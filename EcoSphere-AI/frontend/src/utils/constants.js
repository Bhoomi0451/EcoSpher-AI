export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const STORAGE_KEYS = {
  TOKEN: 'ecosphere_token',
  USER: 'ecosphere_user',
  THEME: 'ecosphere_theme',
};

export const ROLES = {
  EMPLOYEE: 'Employee',
  DEPT_HEAD: 'Department Head',
  ADMIN: 'Admin',
};

export const CSR_STATUS = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
};

export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
};

export const EMPLOYEE_NAV_ITEMS = [
  {
    name: 'Dashboard',
    path: '/',
    icon: 'Squares2X2Icon',
  },
  {
    name: 'CSR Submissions',
    path: '/csr-submissions',
    icon: 'DocumentTextIcon',
  },
  {
    name: 'Challenges',
    path: '/challenges',
    icon: 'TrophyIcon',
  },
  {
    name: 'Badges & Achievements',
    path: '/badges',
    icon: 'AcademicCapIcon',
  },
  {
    name: 'Reward Store',
    path: '/rewards',
    icon: 'GiftIcon',
  },
  {
    name: 'Notifications',
    path: '/notifications',
    icon: 'BellIcon',
  },
  {
    name: 'My Profile',
    path: '/profile',
    icon: 'UserIcon',
  },
];
