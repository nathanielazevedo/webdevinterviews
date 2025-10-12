import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Database logging function
export const dbLog = {
  info: (message, data = null) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] DB-INFO: ${message}`, data ? JSON.stringify(data, null, 2) : '');
  },
  error: (message, error = null) => {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] DB-ERROR: ${message}`, error || '');
  },
  debug: (message, data = null) => {
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
export const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
dbLog.info('Supabase client initialized successfully');