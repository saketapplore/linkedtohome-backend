import { Request, Response, NextFunction } from 'express';
import { envConfig } from '../config/env.config';

/**
 * CORS middleware
 * Handles Cross-Origin Resource Sharing based on environment configuration
 */
export class CorsMiddleware {
  /**
   * Configure CORS headers based on allowed origins
   */
  public static handle(req: Request, res: Response, next: NextFunction): void {
    const allowedOrigins = envConfig.CORS_ORIGIN.split(',').map((origin) => origin.trim());
    const origin = req.headers.origin;

    // Check if the request origin is in the allowed list
    if (origin && allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    } else if (allowedOrigins.length === 1 && allowedOrigins[0] === '*') {
      // Allow all origins if explicitly set to '*'
      res.setHeader('Access-Control-Allow-Origin', '*');
    }

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      res.status(204).end();
      return;
    }

    next();
  }
}

