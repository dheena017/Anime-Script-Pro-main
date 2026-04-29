import { useEffect, useState } from 'react';
import { supabase } from '@/supabase/client';

export interface GenerationLog {
  id: string;
  created_at: string;
  module: string;
  status: string;
  model_used?: string;
  project_id?: string;
  message?: string;
  user_prompt?: string;
}

export const useRealtimeLogs = () => {
  const [logs, setLogs] = useState<GenerationLog[]>([]);

  useEffect(() => {
    // Initial fetch of the latest 20 logs
    const fetchLogs = async () => {
      const { url } = supabase as any;
      if (!url || url.includes('placeholder-project')) {
        return;
      }

      try {
        const { data, error } = await supabase
          .from('generation_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(20);

        if (error) {
          console.error('Error fetching logs:', error);
          return;
        }

        if (data) {
          setLogs(data);
        }
      } catch (err) {
        console.error('Fetch error:', err);
      }
    };

    fetchLogs();

    // Subscribe to real-time changes
    const { url } = supabase as any;
    if (!url || url.includes('placeholder-project')) {
      return;
    }

    const channel = supabase
      .channel('generation_logs_realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'generation_logs',
        },
        (payload) => {
          console.log('New log received:', payload);
          setLogs((prev) => [payload.new as GenerationLog, ...prev].slice(0, 20));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return logs;
};
