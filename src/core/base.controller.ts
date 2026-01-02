import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../utils/apiResponse';
import { ApiError } from '../utils/apiError';
import { Logger } from '../utils/logger';

/**
 * Base Controller abstract class
 * Provides common controller functionality
 * Handles HTTP request/response and delegates to services
 * Follows Controller Pattern - no business logic here
 */
export abstract class BaseController {
  protected readonly logger: typeof Logger = Logger;

  constructor() {
    // Base controller initialization
  }

  /**
   * Wrapper for async route handlers
   * Catches errors and passes them to error middleware
   */
  protected asyncHandler(
    fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
  ) {
    return (req: Request, res: Response, next: NextFunction): void => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  }

  /**
   * Send success response
   */
  protected sendSuccess<T>(
    res: Response,
    statusCode: number,
    message: string,
    data: T | null = null
  ): void {
    const response = ApiResponse.success(message, data);
    res.status(statusCode).json(response);
  }

  /**
   * Send error response
   */
  protected sendError(
    res: Response,
    statusCode: number,
    message: string,
    errors: string[] | null = null
  ): void {
    const response = ApiResponse.error(message, errors);
    res.status(statusCode).json(response);
  }

  /**
   * Handle API errors
   */
  protected handleError(error: unknown, res: Response): void {
    if (error instanceof ApiError) {
      this.sendError(res, error.statusCode, error.message);
    } else if (error instanceof Error) {
      Logger.error('Unexpected error:', error);
      this.sendError(res, 500, 'Internal server error');
    } else {
      Logger.error('Unknown error:', error);
      this.sendError(res, 500, 'Internal server error');
    }
  }
}

