import axios from 'axios';
import { createClient } from '../supabase/client';

const API_BASE_URL = 'http://localhost:8000';
const supabase = createClient();

// Fallback user ID for development/local environments where Supabase session might be missing
const LOCAL_STRATEGIC_USER = "local-dev-architect-id";

export const settingsService = {
  async getSettings() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const user_id = session?.user?.id || LOCAL_STRATEGIC_USER;
      
      if (!session?.user?.id) {
         console.info(`Supabase session missing. Falling back to development ID: ${LOCAL_STRATEGIC_USER}`);
      }
      
      const response = await axios.get(`${API_BASE_URL}/settings/${user_id}`);
      return response.data;
    } catch (e) {
      console.error("Error fetching settings:", e);
      return null;
    }
  },

  async updateSettings(payload: any) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const user_id = session?.user?.id || LOCAL_STRATEGIC_USER;
      
      if (!session?.user?.id) {
         console.info(`Supabase session missing. Commit saved to development ID: ${LOCAL_STRATEGIC_USER}`);
      }

      const response = await axios.post(`${API_BASE_URL}/settings/${user_id}`, payload);
      return response.data;
    } catch (e) {
      console.error("Error updating settings:", e);
      return null;
    }
  }
};
