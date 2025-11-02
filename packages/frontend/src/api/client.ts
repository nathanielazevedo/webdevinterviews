import { createClient } from '@supabase/supabase-js';
import { ApiError } from '@webdevinterviews/shared';
import type { 
  Question,
  BattleHistoryResponse,
  LocationPoint,
  HealthCheckResponse,
  ApiResponse
} from '@webdevinterviews/shared';

// Re-export ApiError for convenience
export { ApiError };

// Initialize Supabase client using environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing required Supabase environment variables');
}

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

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const headers = await this.getAuthHeaders();
    
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers: { ...headers, ...options.headers },
      });

      if (!response.ok) {
        let errorMessage = `${response.status} ${response.statusText}`;
        
        // Try to get more detailed error message from response body
        try {
          const errorData = await response.json();
          if (errorData?.message) {
            errorMessage = errorData.message;
          } else if (errorData?.error) {
            errorMessage = errorData.error;
          }
        } catch {
          // If response body isn't JSON, use the status text
        }
        
        throw new ApiError(response.status, response.statusText, endpoint, errorMessage);
      }

      return response.json() as Promise<T>;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      // Handle network errors or other fetch failures
      throw new ApiError(0, 'Network Error', endpoint, 
        `Failed to connect to ${this.baseURL}${endpoint}: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Create and export a default instance
export const apiClient = new ApiClient();

// Export the class for custom instances
export { ApiClient };

// Convenience functions for common endpoints
export const api = {
  // Battle endpoints
  getBattleHistory: (limit?: number) => {
    const params = limit ? `?limit=${limit}` : '';
    return apiClient.get<BattleHistoryResponse>(`/battle/history${params}`);
  },

  // Questions endpoints
  getAllQuestions: () => apiClient.get<ApiResponse<{ questions: Question[] }>>('/questions'),

  // Location endpoints
  getLocationPoints: () => apiClient.get<LocationPoint[]>('/location/points'),
  geocodeLocation: (ip: string) => apiClient.post<LocationPoint>('/location/geocode', { location: ip }),

  // Health check
  healthCheck: () => apiClient.get<HealthCheckResponse>('/'),
};