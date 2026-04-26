import axios from 'axios';

const API_BASE_URL = 'http://localhost:8001/api';

export interface Category {
  id: number;
  name: string;
  color?: string;
  created_at: string;
}

export interface ProductionTemplate {
  id: number;
  name: string;
  description: string;
  category: string;
  icon: string;
  thumbnail?: string;
  prompt: string;
  color: string;
  border: string;
  bg: string;
  shadow: string;
  elements: string[];
  vibe: string;
  stats: any;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export async function fetchCategories(): Promise<Category[]> {
  try {
    const response = await axios.get(`${API_BASE_URL}/categories`);
    return response.data;
  } catch (error) {
    console.error("fetchCategories error:", error);
    return [];
  }
}

export async function fetchTemplates(): Promise<ProductionTemplate[]> {
  try {
    const response = await axios.get(`${API_BASE_URL}/templates`);
    return response.data;
  } catch (error) {
    console.error("fetchTemplates error:", error);
    return [];
  }
}

