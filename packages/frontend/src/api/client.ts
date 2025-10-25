import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client (same as in AuthContext)
const supabaseUrl = "https://hlkahrtzairapcsmtrqw.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhsa2FocnR6YWlyYXBjc210cnF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4ODI3ODQsImV4cCI6MjA3NTQ1ODc4NH0.XcgLBEm1mF9USWSG2JddkySAjVPRxMnwoOUT38Su6sM";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

class ApiClient {
  private baseURL: string;

  constructor(baseURL?: string) {
    if (baseURL) {
      this.baseURL = baseURL;
    } else {
      // Auto-detect environment
      if (typeof window !== 'undefined') {
        // Frontend: check if we're on localhost or production
        const isLocalhost = window.location.hostname === 'localhost' ||
                           window.location.hostname === '127.0.0.1' ||
                           window.location.hostname === '';
        this.baseURL = isLocalhost
          ? 'http://localhost:3001'
          : 'https://webdevinterviewsbackend-production.up.railway.app';
      } else {
        // Fallback for server-side or tests
        this.baseURL = 'http://localhost:3001';
      }
    }
  }

  private async getAuthHeaders(): Promise<Record<string, string>> {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.access_token) {
      return {};
    }

    return {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
    };
  }

  async get(endpoint: string): Promise<unknown> {
    const headers = await this.getAuthHeaders();

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async post(endpoint: string, data?: unknown): Promise<unknown> {
    const headers = await this.getAuthHeaders();

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async put(endpoint: string, data?: unknown): Promise<unknown> {
    const headers = await this.getAuthHeaders();

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PUT',
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async delete(endpoint: string): Promise<unknown> {
    const headers = await this.getAuthHeaders();

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }
}

// Create and export a default instance
export const apiClient = new ApiClient();

// Export the class for custom instances
export { ApiClient };

// Convenience functions for common endpoints
export const api = {
  // Battle endpoints
  getCurrentBattle: () => apiClient.get('/battle/current'),

  // Questions endpoints
  getAllQuestions: () => apiClient.get('/questions'),

  // Health check
  healthCheck: () => apiClient.get('/'),
};