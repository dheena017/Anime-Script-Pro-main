import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

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
      const response = await axios.get(`${API_BASE_URL}/tutorials`);
      return response.data;
    } catch (e) {
      console.error("Error fetching tutorials:", e);
      throw new Error(axios.isAxiosError(e) ? (e.response?.data?.detail || "Failed to fetch tutorials") : "Unknown network error");
    }
  },

  async seedTutorials() {
    try {
      const response = await axios.post(`${API_BASE_URL}/tutorials/seed`);
      return response.data;
    } catch (e) {
      console.error("Error seeding tutorials:", e);
      throw new Error(axios.isAxiosError(e) ? (e.response?.data?.detail || "Failed to seed tutorials") : "Failed to connect to backend for seeding");
    }
  }
};
