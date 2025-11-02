// Type for serializable data that can be logged
type LogData = Record<string, unknown> | string | number | boolean | null | undefined | unknown[] | object;

interface Logger {
  info: (message: string, data?: LogData) => void;
  error: (message: string, error?: Error | string | unknown) => void;
  warn: (message: string, data?: LogData) => void;
  debug: (message: string, data?: LogData) => void;
}

export const logger: Logger = {
  info: (message: string, data: LogData = null) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] INFO: ${message}`, data ? JSON.stringify(data, null, 2) : '');
  },
  error: (message: string, error: Error | string | unknown = null) => {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] ERROR: ${message}`, error || '');
  },
  warn: (message: string, data: LogData = null) => {
    const timestamp = new Date().toISOString();
    console.warn(`[${timestamp}] WARN: ${message}`, data ? JSON.stringify(data, null, 2) : '');
  },
  debug: (message: string, data: LogData = null) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] DEBUG: ${message}`, data ? JSON.stringify(data, null, 2) : '');
  }
};