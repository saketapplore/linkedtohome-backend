import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiError';
import { ApiResponse } from '../utils/apiResponse';
import { JWTUtil, JWTPayload } from '../utils/jwt';

/**
 * Authentication middleware
 * Validates JWT tokens and attaches user to request
 */
export class AuthMiddleware {
  /**
   * Verify JWT token and authenticate user
   */
  public static authenticate(req: Request, res: Response, next: NextFunction): void {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        const response = ApiResponse.error('Authentication required');
        res.status(401).json(response);
        return;
      }

      const token = authHeader.substring(7);

      if (!token || token.length === 0) {
        const response = ApiResponse.error('Invalid token');
        res.status(401).json(response);
        return;
      }

      // Verify JWT token
      const decoded = JWTUtil.verifyAccessToken(token);

      // Attach user info to request
      (req as Request & { user?: JWTPayload }).user = decoded;

      next();
    } catch (error) {
      if (error instanceof ApiError) {
        const response = ApiResponse.error(error.message);
        res.status(error.statusCode).json(response);
        return;
      }
      // Handle JWT verification errors
      const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
      const response = ApiResponse.error(errorMessage);
      res.status(401).json(response);
    }
  }

  /**
   * Check if user has required role
   */
  public static authorize(...allowedRoles: string[]) {
    return (req: Request, res: Response, next: NextFunction): void => {
      const user = (req as Request & { user?: JWTPayload }).user;

      if (!user) {
        const response = ApiResponse.error('Authentication required');
        res.status(401).json(response);
        return;
      }

      if (!allowedRoles.includes(user.role)) {
        const response = ApiResponse.error('Insufficient permissions');
        res.status(403).json(response);
        return;
      }

      next();
    };
  }
}

