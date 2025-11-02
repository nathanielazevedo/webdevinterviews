import { Request, Response, NextFunction } from 'express';
import { SupabaseClientService } from '../services/supabase-client.service.js';
import { logger } from '../utils/logger.js';

const log = logger;

// Get Supabase client for auth verification
const supabase = SupabaseClientService.getAnonClient();

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
    

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    // Use Supabase client to verify the JWT token (same as WebSocket auth)
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }

    // Attach user info to request
    req.user = {
      sub: user.id,
      email: user.email,
      ...user.user_metadata
    };
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
      return next();
    }

    // Use Supabase client to verify the JWT token
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return next();
    }

    req.user = {
      sub: user.id,
      email: user.email,
      ...user.user_metadata
    };
    next();

  } catch (error) {
    log.error('Optional authentication middleware error', error);
    next(); // Continue even on error
  }
}
