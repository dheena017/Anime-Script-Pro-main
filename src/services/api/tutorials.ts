import { apiRequest } from '@/lib/api-utils';

export interface Tutorial {
  id: number;
  title: string;
  description: string;
  icon_name: string;
  duration: string;
  level: string;
  category: string;
}

export const tutorialService = {
  async getTutorials(): Promise<Tutorial[]> {
    try {
      return await apiRequest<Tutorial[]>('/api/tutorials');
    } catch (e) {
      console.error("Error fetching tutorials:", e);
      return [];
    }
  },

  async seedTutorials() {
    try {
      return await apiRequest('/api/tutorials/seed', { method: 'POST' });
    } catch (e) {
      console.error("Error seeding tutorials:", e);
      return { status: "error", message: String(e) };
    }
  }
};


