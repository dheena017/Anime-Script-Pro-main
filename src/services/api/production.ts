import axios from 'axios';

const API_BASE = '/api/production';

export interface ProjectContent {
  id?: number;
  user_id: string;
  project_id?: number;
  cast_profiles: string | null;
  cast_data: any;
  scenes: any[];
  script_content: string | null;
  series_plan: any[] | null;
  storyboard: any;
  seo_metadata: string | null;
  custom_prompts: Record<string, string>;
  active_protocols: string[];
  screening_logs: any[];
  updated_at?: string;
}

export const productionApi = {
  getContent: async (userId: string, projectId?: number): Promise<ProjectContent | null> => {
    const response = await axios.get(`${API_BASE}/${userId}`, {
      params: { project_id: projectId }
    });
    return response.data;
  },

  updateContent: async (userId: string, update: Partial<ProjectContent>, projectId?: number): Promise<ProjectContent> => {
    const response = await axios.post(`${API_BASE}/${userId}`, update, {
      params: { project_id: projectId }
    });
    return response.data;
  }
};
