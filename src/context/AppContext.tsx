import React, { createContext, useContext, useState, useEffect } from 'react';
import { notificationService } from '../services/notificationService';
import { projectService } from '../services/projectService';

const LOCAL_USER_ID = 'local-dev-architect-id';

interface AppContextType {
  currentProject: any | null;
  setCurrentProject: (project: any) => void;
  notifications: any[];
  unreadCount: number;
  userTier: string;
  refreshAppData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentProject, setCurrentProject] = useState<any | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [userTier] = useState<string>('God Mode'); // Default to seeded tier

  const refreshAppData = async () => {
    // 1. Fetch Notifications from FastAPI
    const notifs = await notificationService.getNotifications(LOCAL_USER_ID);
    setNotifications(notifs);

    // 2. Fetch Projects from FastAPI
    try {
      const projects = await projectService.getProjects();
      if (projects && projects.length > 0 && !currentProject) {
        setCurrentProject(projects[0]);
      }
    } catch (e) {
      console.error("Failed to fetch projects in context:", e);
    }

    // Note: Profile/Tier logic can also be migrated to FastAPI in the future
  };

  useEffect(() => {
    refreshAppData();
  }, []);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <AppContext.Provider value={{ 
      currentProject, 
      setCurrentProject, 
      notifications, 
      unreadCount, 
      userTier, 
      refreshAppData 
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
