/**
 * Application constants
 */

// Battle configuration
export const BATTLE_CONFIG = {
  DEFAULT_DURATION_MINUTES: 15,
  DEFAULT_QUESTION_POOL_SIZE: 10,
  AUTO_START_BUFFER_SECONDS: 30
} as const;

// Default IDs
export const DEFAULT_ADMIN_USER_ID = 'c9c22420-5e80-490f-8abf-3396c5949adf';

// Battle statuses
export const BATTLE_STATUS = {
  WAITING: 'waiting',
  ACTIVE: 'active', 
  COMPLETED: 'completed'
} as const;

// HTTP status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
} as const;

// Time constants
export const TIME_CONSTANTS = {
  DAYS_IN_WEEK: 7,
  SATURDAY_DAY_INDEX: 6,
  BATTLE_START_HOUR: 17, // 5 PM
  RECENT_BATTLES_DAYS: 30
} as const;

// Environment variables with defaults
export const ENV = {
  PORT: process.env.PORT || '3001',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
  GEO_KEY: process.env.GEO_KEY,
  NODE_ENV: process.env.NODE_ENV || 'development',
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY
} as const;
