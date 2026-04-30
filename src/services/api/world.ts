import axios from 'axios';

const API_BASE = '/api/world';

export interface WorldLore {
  id?: number;
  user_id: string;
  project_id?: number;
  architecture: string | null;
  atlas: string | null;
  history: string | null;
  systems: string | null;
  culture: string | null;
  full_lore_blob: string | null;
  updated_at?: string;
}

export const worldApi = {
  getLore: async (userId: string, projectId?: number): Promise<WorldLore | null> => {
    const response = await axios.get(`${API_BASE}/lore/${userId}`, {
      params: { project_id: projectId }
    });
    return response.data;
  },

  updateLore: async (userId: string, update: Partial<WorldLore>, projectId?: number): Promise<WorldLore> => {
    const response = await axios.post(`${API_BASE}/lore/${userId}`, update, {
      params: { project_id: projectId }
    });
    return response.data;
  },

  getHistory: async (userId: string, limit: number = 10): Promise<WorldLore[]> => {
    const response = await axios.get(`${API_BASE}/history/${userId}`, {
      params: { limit }
    });
    return response.data;
  }
};
