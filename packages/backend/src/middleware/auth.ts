import { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';
import { logger } from '../utils/logger.js';

const log = logger;

// Initialize Supabase client for auth verification
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhsa2FocnR6YWlyYXBjc210cnF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4ODI3ODQsImV4cCI6MjA3NTQ1ODc4NH0.XcgLBEm1mF9USWSG2JddkySAjVPRxMnwoOUT38Su6sM';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        sub: string;
        email?: string;
        role?: string;
        [key: string]: unknown;
      };
    }
  }
}

export async function authenticateToken(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    console.log('Authenticating token:', token?.substring(0, 20) + '...');

    if (!token) {
      log.warn('No token provided in request');
      return res.status(401).json({ error: 'Access token required' });
    }

    // Use Supabase client to verify the JWT token (same as WebSocket auth)
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      log.warn('Token verification failed', error);
      return res.status(403).json({ error: 'Invalid or expired token' });
    }

    // Attach user info to request
    req.user = {
      sub: user.id,
      email: user.email,
      ...user.user_metadata
    };
    log.info('Token verified successfully', { userId: req.user.sub });
    next();

  } catch (error) {
    log.error('Authentication middleware error', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
}

// Optional authentication - doesn't fail if no token
export async function optionalAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      // No token provided, continue without user
      log.debug('No token provided, continuing without authentication');
      return next();
    }

    // Use Supabase client to verify the JWT token
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      log.warn('Optional token verification failed, continuing without auth', error);
      return next();
    }

    req.user = {
      sub: user.id,
      email: user.email,
      ...user.user_metadata
    };
    log.info('Optional token verified successfully', { userId: req.user.sub });
    next();

  } catch (error) {
    log.error('Optional authentication middleware error', error);
    next(); // Continue even on error
  }
}