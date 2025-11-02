// Shared API types used by both frontend and backend

import type { Battle } from './battle.js';

// Generic API response wrapper
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// API Error class for consistent error handling
export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public endpoint: string,
    message?: string
  ) {
    super(message || `API Error: ${status} ${statusText} at ${endpoint}`);
    this.name = 'ApiError';
  }
}

// Battle-related API responses
export interface BattleHistoryResponse {
  battles: Battle[];
  total: number;
}

// Location-related types
export interface LocationPoint {
  id: number;
  latitude: number;
  longitude: number;
  country?: string;
  region?: string;
  locality?: string;
  created_at: string;
}

// Health check response
export interface HealthCheckResponse {
  status: string;
}

// Question-related API responses (placeholder for future use)
export interface QuestionsResponse {
  questions: unknown[]; // Will be properly typed when we have Question types
  total: number;
}