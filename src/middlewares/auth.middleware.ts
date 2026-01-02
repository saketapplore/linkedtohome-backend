import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiError';
import { ApiResponse } from '../utils/apiResponse';

/**
 * Authentication middleware
 * Validates JWT tokens and attaches user to request
 * Can be extended with actual JWT verification
 */
export class AuthMiddleware {
  /**
   * Verify JWT token and authenticate user
   * For now, this is a placeholder - implement actual JWT verification
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

      // TODO: Implement actual JWT verification
      // For now, accept any non-empty token
      if (!token || token.length === 0) {
        const response = ApiResponse.error('Invalid token');
        res.status(401).json(response);
        return;
      }

      // Attach user info to request (in real implementation, decode from JWT)
      (req as Request & { user?: { id: string; role: string } }).user = {
        id: 'user-id-from-token',
        role: 'user',
      };

      next();
    } catch (error) {
      if (error instanceof ApiError) {
        const response = ApiResponse.error(error.message);
        res.status(error.statusCode).json(response);
        return;
      }
      const response = ApiResponse.error('Authentication failed');
      res.status(401).json(response);
    }
  }

  /**
   * Check if user has required role
   */
  public static authorize(...allowedRoles: string[]) {
    return (req: Request, res: Response, next: NextFunction): void => {
      const user = (req as Request & { user?: { id: string; role: string } }).user;

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

