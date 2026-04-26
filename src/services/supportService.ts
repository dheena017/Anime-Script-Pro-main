import axios from 'axios';

const API_BASE_URL = 'http://localhost:8001/api';

export interface HelpCategory {
  id: number;
  slug: string;
  label: string;
  sub: string;
  icon: string;
  color: string;
  order: number;
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
  category_slug: string;
  is_frequent: boolean;
  order: number;
}

export interface DocSection {
  id: number;
  slug: string;
  label: string;
  icon: string;
  order: number;
}

export interface DocArticle {
  id: number;
  section_slug: string;
  slug: string;
  title: string;
  content: string;
  protocol_id?: string;
  order: number;
  article_metadata: any;
}

export const supportService = {
  async getHelpCategories(): Promise<HelpCategory[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/help/categories`);
      return response.data;
    } catch (e) {
      console.error("Error fetching help categories:", e);
      return [];
    }
  },

  async getFAQs(frequentOnly = false): Promise<FAQ[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/help/faqs`, { params: { frequent_only: frequentOnly } });
      return response.data;
    } catch (e) {
      console.error("Error fetching FAQs:", e);
      return [];
    }
  },

  async getDocSections(): Promise<DocSection[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/docs/sections`);
      return response.data;
    } catch (e) {
      console.error("Error fetching doc sections:", e);
      return [];
    }
  },

  async getDocArticles(sectionSlug?: string): Promise<DocArticle[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/docs/articles`, { params: { section_slug: sectionSlug } });
      return response.data;
    } catch (e) {
      console.error("Error fetching doc articles:", e);
      return [];
    }
  },

  async searchHelp(query: string): Promise<{ faqs: FAQ[], docs: DocArticle[] }> {
    try {
      const response = await axios.get(`${API_BASE_URL}/help/search`, { params: { query } });
      return response.data;
    } catch (e) {
      console.error("Error searching help:", e);
      return { faqs: [], docs: [] };
    }
  }
};
