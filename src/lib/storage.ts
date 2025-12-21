export const STORAGE_KEYS = {
  TASKS: 'shadcn_admin_tasks',
  USERS: 'shadcn_admin_users',
  APPS: 'shadcn_admin_apps',
  CHATS: 'shadcn_admin_chats',
  DASHBOARD_STATS: 'shadcn_admin_dashboard_stats',
  AUTH: 'shadcn_admin_auth',
} as const;

const isTestMode = () => {
  return typeof window !== 'undefined' && 
    (window.location.search.includes('test=true') || 
     import.meta.env.MODE === 'test');
};

export const storage = {
  get<T>(key: string): T | null {
    const value = localStorage.getItem(key);
    const parsed = value ? JSON.parse(value) : null;
    if (isTestMode()) {
      console.log(`[Storage READ] ${key}:`, parsed);
    }
    return parsed;
  },

  set<T>(key: string, value: T): void {
    if (isTestMode()) {
      console.log(`[Storage WRITE] ${key}:`, value);
    }
    localStorage.setItem(key, JSON.stringify(value));
  },

  remove(key: string): void {
    if (isTestMode()) {
      console.log(`[Storage DELETE] ${key}`);
    }
    localStorage.removeItem(key);
  },
};
