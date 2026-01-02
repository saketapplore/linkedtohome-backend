import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiError';
import { Logger } from '../utils/logger';
import { ApiResponse } from '../utils/apiResponse';

/**
 * Global error handling middleware
 * Catches all errors and sends standardized error responses
 * Follows Express error handling pattern
 */
export class ErrorMiddleware {
  /**
   * Handle errors from route handlers
   */
  public static handle(
    error: unknown,
    req: Request,
    res: Response,
    _next: NextFunction
  ): void {
    if (error instanceof ApiError) {
      const response = ApiResponse.error(error.message);
      Logger.error(
        `API Error [${error.statusCode}]: ${error.message}`,
        { path: req.path, method: req.method }
      );
      res.status(error.statusCode).json(response);
      return;
    }

    if (error instanceof Error) {
      Logger.error('Unexpected error:', {
        message: error.message,
        stack: error.stack,
        path: req.path,
        method: req.method,
      });
      const response = ApiResponse.error('Internal server error');
      res.status(500).json(response);
      return;
    }

    Logger.error('Unknown error type:', error);
    const response = ApiResponse.error('Internal server error');
    res.status(500).json(response);
  }

  /**
   * Handle 404 Not Found errors
   */
  public static notFound(req: Request, res: Response, _next: NextFunction): void {
    const response = ApiResponse.error(`Route ${req.originalUrl} not found`);
    res.status(404).json(response);
  }
}

