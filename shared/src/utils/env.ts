// @ts-nocheck no check

// Environment variable utilities for cross-platform support
// Works in both browser (with Vite) and Node.js environments

export const getEnvVar = (key: string, defaultValue?: string): string => {
  // Browser environment (Vite injects import.meta.env)
  if (typeof window !== 'undefined' && typeof import.meta !== 'undefined' && import.meta.env) {
    const env = import.meta.env as Record<string, string | undefined>;
    return env[key] || defaultValue || '';
  }
  
  // Node.js environment
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key] || defaultValue || '';
  }
  
  // Fallback
  return defaultValue || '';
};

export const isDevelopment = (): boolean => {
  const nodeEnv = getEnvVar('NODE_ENV');
  const mode = getEnvVar('MODE');
  return nodeEnv === 'development' || mode === 'development';
};

export const isProduction = (): boolean => {
  const nodeEnv = getEnvVar('NODE_ENV');
  const mode = getEnvVar('MODE');
  return nodeEnv === 'production' || mode === 'production';
};