import { useEffect, useState } from 'react';
import { logsApi, SystemLog } from '@/services/api/logs';

export interface GenerationLog {
  id: string | number;
  created_at: string;
  module: string;
  status: string;
  message?: string;
}

export const useRealtimeLogs = () => {
  const [logs, setLogs] = useState<SystemLog[]>([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const data = await logsApi.getLogs(20);
        setLogs(data);
      } catch (err) {
        console.error('Fetch error:', err);
      }
    };

    fetchLogs();

    // Poll for new logs every 5 seconds since we are removing Supabase Realtime
    const interval = setInterval(fetchLogs, 5000);

    return () => clearInterval(interval);
  }, []);

  return logs;
};
