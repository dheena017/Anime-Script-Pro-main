import axios from 'axios';
import { createClient } from '../supabase/client';

const API_BASE_URL = 'http://localhost:8001/api';
const supabase = createClient();

// Fallback user ID for development/local environments where Supabase session might be missing
const LOCAL_STRATEGIC_USER = "local-dev-architect-id";

export interface UserProfile {
  id: string;
  user_id: string;
  display_name: string;
  handle: string;
  bio?: string;
  avatar_url?: string;
  banner_url?: string;
  updated_at: string;
}

export interface UserBalance {
  user_id: string;
  credits: number;
  current_tier: string;
  total_generations: number;
}

export interface MediaAsset {
  id: string;
  user_id: string;
  asset_type: 'IMAGE' | 'VIDEO' | 'SCRIPT';
  url: string;
  thumbnail_url?: string;
  metadata: any;
  created_at: string;
}

export const settingsService = {
  async getUserId() {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.user?.id || LOCAL_STRATEGIC_USER;
  },

  // --- User Settings ---
  async getSettings() {
    try {
      const user_id = await this.getUserId();
      const response = await axios.get(`${API_BASE_URL}/settings/${user_id}`);
      return response.data;
    } catch (e) {
      console.error("Error fetching settings:", e);
      return null;
    }
  },

  async updateSettings(payload: any) {
    try {
      const user_id = await this.getUserId();
      const response = await axios.post(`${API_BASE_URL}/settings/${user_id}`, payload);
      return response.data;
    } catch (e) {
      console.error("Error updating settings:", e);
      return null;
    }
  },

  // --- User Profile ---
  async getProfile(): Promise<UserProfile | null> {
    try {
      const user_id = await this.getUserId();
      const response = await axios.get(`${API_BASE_URL}/profiles/${user_id}`);
      return response.data;
    } catch (e) {
      console.error("Error fetching profile:", e);
      return null;
    }
  },

  async updateProfile(payload: Partial<UserProfile>): Promise<UserProfile | null> {
    try {
      const user_id = await this.getUserId();
      const response = await axios.post(`${API_BASE_URL}/profiles/${user_id}`, payload);
      return response.data;
    } catch (e) {
      console.error("Error updating profile:", e);
      return null;
    }
  },

  // --- Neural Balance & Tier ---
  async getBalance(): Promise<UserBalance | null> {
    try {
      const user_id = await this.getUserId();
      const response = await axios.get(`${API_BASE_URL}/balances/${user_id}`);
      return response.data;
    } catch (e) {
      console.error("Error fetching balance:", e);
      return null;
    }
  },

  // --- Neural Assets & Media ---
  async getAssets(type?: string): Promise<MediaAsset[]> {
    try {
      const user_id = await this.getUserId();
      const params = type ? { asset_type: type } : {};
      const response = await axios.get(`${API_BASE_URL}/assets/${user_id}`, { params });
      return response.data;
    } catch (e) {
      console.error("Error fetching assets:", e);
      return [];
    }
  },

  async getFavorites(): Promise<MediaAsset[]> {
    try {
      const user_id = await this.getUserId();
      const response = await axios.get(`${API_BASE_URL}/favorites/${user_id}`);
      return response.data;
    } catch (e) {
      console.error("Error fetching favorites:", e);
      return [];
    }
  },

  async toggleFavorite(asset_id: string): Promise<boolean> {
    try {
      const user_id = await this.getUserId();
      const response = await axios.post(`${API_BASE_URL}/favorites`, {
        user_id,
        asset_id
      });
      return response.data.status === "added";
    } catch (e) {
      console.error("Error toggling favorite:", e);
      return false;
    }
  }
};

