import { Request, Response, NextFunction } from 'express';
import { sendErrorResponse } from './response.js';

/**
 * Validate required fields in request body
 */
export function validateRequiredFields(fields: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const missing = fields.filter(field => !req.body[field]);
    
    if (missing.length > 0) {
      sendErrorResponse(
        res, 
        `Missing required fields: ${missing.join(', ')}`,
        'Validation failed',
        400
      );
      return;
    }
    
    next();
  };
}

/**
 * Validate query parameters
 */
export function validateQueryParams(params: { [key: string]: 'number' | 'string' | 'boolean' }) {
  return (req: Request, res: Response, next: NextFunction) => {
    const errors: string[] = [];
    
    Object.entries(params).forEach(([param, type]) => {
      const value = req.query[param];
      
      if (value !== undefined) {
        switch (type) {
          case 'number':
            if (isNaN(Number(value))) {
              errors.push(`${param} must be a number`);
            }
            break;
          case 'boolean':
            if (value !== 'true' && value !== 'false') {
              errors.push(`${param} must be true or false`);
            }
            break;
          case 'string':
            if (typeof value !== 'string' || value.trim() === '') {
              errors.push(`${param} must be a non-empty string`);
            }
            break;
        }
      }
    });
    
    if (errors.length > 0) {
      sendErrorResponse(
        res,
        errors.join(', '),
        'Query parameter validation failed',
        400
      );
      return;
    }
    
    next();
  };
}
