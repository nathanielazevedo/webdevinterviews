import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

// Database logging function
interface DbLogger {
  info: (message: string, data?: unknown) => void;
  error: (message: string, error?: unknown) => void;
  debug: (message: string, data?: unknown) => void;
}

export const dbLog: DbLogger = {
  info: (message: string, data: unknown = null) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] DB-INFO: ${message}`, data ? JSON.stringify(data, null, 2) : '');
  },
  error: (message: string, error: unknown = null) => {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] DB-ERROR: ${message}`, error || '');
  },
  debug: (message: string, data: unknown = null) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] DB-DEBUG: ${message}`, data ? JSON.stringify(data, null, 2) : '');
  }
};

// Initialize Prisma Client
export const prisma = new PrismaClient({
  log: [
    { level: 'query', emit: 'event' },
    { level: 'error', emit: 'stdout' },
    { level: 'warn', emit: 'stdout' },
  ],
});

// Log Prisma queries in development
if (process.env.NODE_ENV === 'development') {
  prisma.$on('query', (e: { query: string; params: string; duration: number; target: string }) => {
    dbLog.debug(`Query: ${e.query}`);
    dbLog.debug(`Duration: ${e.duration}ms`);
  });
}

dbLog.info('Prisma client initialized successfully');