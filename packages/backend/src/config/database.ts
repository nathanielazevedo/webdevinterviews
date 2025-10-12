import { createClient, SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Database logging function
interface DbLogger {
  info: (message: string, data?: any) => void;
  error: (message: string, error?: any) => void;
  debug: (message: string, data?: any) => void;
}

export const dbLog: DbLogger = {
  info: (message: string, data: any = null) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] DB-INFO: ${message}`, data ? JSON.stringify(data, null, 2) : '');
  },
  error: (message: string, error: any = null) => {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] DB-ERROR: ${message}`, error || '');
  },
  debug: (message: string, data: any = null) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] DB-DEBUG: ${message}`, data ? JSON.stringify(data, null, 2) : '');
  }
};

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

dbLog.info('Initializing Supabase client', {
  url: supabaseUrl ? 'SET' : 'NOT SET',
  serviceKey: supabaseServiceRoleKey ? 'SET' : 'NOT SET'
});

if (!supabaseUrl || !supabaseServiceRoleKey) {
  dbLog.error('Missing Supabase environment variables');
  process.exit(1);
}

// Using service role key for server-side operations
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseServiceRoleKey);
dbLog.info('Supabase client initialized successfully');