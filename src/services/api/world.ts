import { apiRequest } from '@/lib/api-utils';

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
    return apiRequest<WorldLore>(`${API_BASE}/lore/${userId}`, {
      method: 'GET',
      label: 'Get World Lore',
      headers: projectId ? { 'X-Project-Id': projectId.toString() } : {}
    });
  },

  updateLore: async (userId: string, update: Partial<WorldLore>, projectId?: number): Promise<WorldLore> => {
    return apiRequest<WorldLore>(`${API_BASE}/lore/${userId}`, {
      method: 'POST',
      label: 'Update World Lore',
      body: JSON.stringify(update),
      headers: projectId ? { 'X-Project-Id': projectId.toString() } : {}
    });
  },

  getHistory: async (userId: string, limit: number = 10): Promise<WorldLore[]> => {
    return apiRequest<WorldLore[]>(`${API_BASE}/history/${userId}?limit=${limit}`, {
      method: 'GET',
      label: 'Get World Lore History'
    });
  }
};



