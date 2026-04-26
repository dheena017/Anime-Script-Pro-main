import axios from 'axios';
import { createClient } from '../supabase/client';

const API_BASE_URL = 'http://localhost:8001/api';
const supabase = createClient();

// Fallback user ID for development
const LOCAL_STRATEGIC_USER = "local-dev-architect-id";

export interface CommunityPost {
  id: number;
  user_id: string;
  title: string;
  content: string;
  likes: number;
  views: number;
  is_active: boolean;
  created_at: string;
}

export const communityService = {
  async getUserId() {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.user?.id || LOCAL_STRATEGIC_USER;
  },

  async getPosts(limit: number = 20, offset: number = 0): Promise<CommunityPost[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/community`, {
        params: { limit, offset }
      });
      return response.data;
    } catch (e) {
      console.error("Error fetching community posts:", e);
      return [];
    }
  },

  async createPost(title: string, content: string): Promise<CommunityPost | null> {
    try {
      const user_id = await this.getUserId();
      const response = await axios.post(`${API_BASE_URL}/community`, {
        title,
        content,
        user_id
      });
      return response.data;
    } catch (e) {
      console.error("Error creating community post:", e);
      return null;
    }
  },

  async likePost(postId: number): Promise<{ status: string; likes: number } | null> {
    try {
      const response = await axios.post(`${API_BASE_URL}/community/${postId}/like`);
      return response.data;
    } catch (e) {
      console.error("Error liking community post:", e);
      return null;
    }
  }
};
