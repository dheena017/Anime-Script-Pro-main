import { createClient } from '../supabase/client';
import { apiRequest } from '@/lib/api-utils';

const supabase = createClient();

// Fallback user ID for development
const LOCAL_STRATEGIC_USER = "local-dev-architect-id";

export interface Project {
  id: number;
  user_id: string;
  title: string;
  content_type: string;
  genre?: string;
  art_style?: string;
  episode_length: string;
  description?: string;
  prompt?: string;
  status: string;
  model_used: string;
  prod_metadata: any;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export const projectService = {
  async getUserId() {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.user?.id || LOCAL_STRATEGIC_USER;
  },

  async getProjects(): Promise<Project[]> {
    try {
      return await apiRequest<Project[]>('/api/projects');
    } catch (e) {
      console.error("Error fetching projects:", e);
      return [];
    }
  },

  async getProject(projectId: number): Promise<Project | null> {
    try {
      return await apiRequest<Project>(`/api/projects/${projectId}`);
    } catch (e) {
      console.error(`Error fetching project ${projectId}:`, e);
      return null;
    }
  },

  async createProject(projectData: Partial<Project>): Promise<Project | null> {
    try {
      return await apiRequest<Project>('/api/projects', {
        method: 'POST',
        body: JSON.stringify(projectData)
      });
    } catch (e) {
      console.error("Error creating project:", e);
      return null;
    }
  },

  async deleteProject(projectId: number): Promise<boolean> {
    try {
      const response = await apiRequest<any>(`/api/projects/${projectId}`, {
        method: 'DELETE'
      });
      return response.status === "deleted";
    } catch (e) {
      console.error(`Error deleting project ${projectId}:`, e);
      return false;
    }
  }
};

