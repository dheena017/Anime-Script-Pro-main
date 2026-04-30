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

const trimTrailingSlash = (value: string) => value.replace(/\/+$|^\s+|\s+$/g, '');
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  ? trimTrailingSlash(import.meta.env.VITE_API_BASE_URL)
  : '';

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

  const finalUrl = url.startsWith('http')
    ? url
    : `${API_BASE_URL}${url.startsWith('/') ? url : `/${url}`}`;
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

    const errorName = typeof error === 'object' && error !== null ? (error as any).name : undefined;
    const errorMessage = typeof error === 'object' && error !== null ? String((error as any).message || (error as any)) : String(error);

    if (errorName === 'AbortError' || errorMessage.toLowerCase().includes('aborted')) {
      throw new ApiError(`Request timed out after ${timeout}ms`, 408);
    }

    throw new ApiError(errorMessage || 'Network error');
  } finally {
    clearTimeout(id);
  }
}
