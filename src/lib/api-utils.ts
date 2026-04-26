export class ApiError extends Error {
  constructor(public message: string, public status?: number, public details?: any) {
    super(message);
    this.name = 'ApiError';
  }
}

export function cleanJson(content: string): any {
  try {
    // Strip markdown backticks if present
    const cleaned = content.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (error) {
    console.error('Failed to parse JSON content:', content);
    throw new ApiError('Invalid AI output format. Could not parse JSON.');
  }
}

export const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8001';

async function getAuthToken(): Promise<string | null> {
  try {
    // Try to get from localStorage (Supabase standard)
    const sbKey = Object.keys(localStorage).find(key => key.startsWith('sb-') && key.endsWith('-auth-token'));
    if (sbKey) {
      const tokenData = JSON.parse(localStorage.getItem(sbKey) || '{}');
      return tokenData.access_token || null;
    }
    return null;
  } catch {
    return null;
  }
}

export async function apiRequest<T>(url: string, options?: RequestInit & { timeout?: number }): Promise<T> {
  const { timeout = 30000, ...fetchOptions } = options || {};

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  const finalUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
  const token = await getAuthToken();

  try {
    const response = await fetch(finalUrl, {
      ...fetchOptions,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options?.headers,
      },
    });
    clearTimeout(id);

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { error: response.statusText };
      }
      throw new ApiError(errorData.error || 'API Request failed', response.status, errorData);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(error instanceof Error ? error.message : 'Network error');
  }
}
