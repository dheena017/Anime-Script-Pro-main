import axios from 'axios';

const API_BASE = '/api/engine';

export interface EngineConfig {
  id?: number;
  user_id: string;
  selected_model: string;
  temperature: number;
  max_tokens: number;
  vibe: string;
  audience: string;
  updated_at?: string;
}

export interface TelemetryData {
  model: string;
  latency_ms: number;
  status: 'SUCCESS' | 'ERROR' | 'FALLBACK';
  endpoint: string;
  request_summary?: string;
  error_message?: string;
  metadata?: any;
}

export const engineApi = {
  getConfig: async (userId: string): Promise<EngineConfig> => {
    const response = await axios.get(`${API_BASE}/config/${userId}`);
    return response.data;
  },

  updateConfig: async (userId: string, update: Partial<EngineConfig>): Promise<EngineConfig> => {
    const response = await axios.post(`${API_BASE}/config/${userId}`, update);
    return response.data;
  },

  recordTelemetry: async (data: TelemetryData, userId?: string): Promise<void> => {
    await axios.post(`${API_BASE}/telemetry`, data, {
      params: { user_id: userId }
    });
  },

  getRecentTelemetry: async (limit: number = 50): Promise<any[]> => {
    const response = await axios.get(`${API_BASE}/telemetry/recent`, {
      params: { limit }
    });
    return response.data;
  }
};
