import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '../supabase/client';

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
  const [userTier, setUserTier] = useState<string>('Free Architect');
  const supabase = createClient();

  const refreshAppData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Fetch User Tier (Mocking logic for now, usually would be a profiles table)
    const { data: profile } = await supabase
      .from('profiles')
      .select('tier')
      .eq('id', user.id)
      .single();
    
    if (profile?.tier) setUserTier(profile.tier);

    // Fetch Notifications
    const { data: notifs } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (notifs) setNotifications(notifs);

    // Fetch Projects
    const { data: projects } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
      .limit(1);
    
    if (projects && projects.length > 0 && !currentProject) {
      setCurrentProject(projects[0]);
    }
  };

  useEffect(() => {
    refreshAppData();
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

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
