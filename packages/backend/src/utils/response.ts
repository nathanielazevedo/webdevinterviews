import { Request, Response, NextFunction } from 'express';
import { logger } from './logger.js';

const log = logger;

/**
 * Standard API response formats
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Standard error response
 */
export function sendErrorResponse(
  res: Response, 
  error: unknown, 
  message: string = 'Internal server error',
  statusCode: number = 500
): void {
  log.error(message, error);
  
  const response: ApiResponse = {
    success: false,
    error: error instanceof Error ? error.message : String(error),
    message
  };
  
  res.status(statusCode).json(response);
}

/**
 * Standard success response
 */
export function sendSuccessResponse<T>(
  res: Response, 
  data: T, 
  message?: string,
  statusCode: number = 200
): void {
  const response: ApiResponse<T> = {
    success: true,
    data,
    ...(message && { message })
  };
  
  res.status(statusCode).json(response);
}

/**
 * Handle async route errors consistently
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}