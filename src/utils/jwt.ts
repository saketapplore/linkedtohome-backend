import jwt, { SignOptions } from 'jsonwebtoken';
import { envConfig } from '../config/env.config';

/**
 * JWT Payload interface
 * Defines the structure of data stored in JWT tokens
 */
export interface JWTPayload {
  id: string;
  email: string;
  role: string;
}

/**
 * JWT Utility class
 * Handles JWT token generation and verification
 * Centralized JWT operations for the application
 */
export class JWTUtil {
  /**
   * Generate access token
   * Short-lived token for API authentication
   */
  public static generateAccessToken(payload: JWTPayload): string {
    return jwt.sign(
      {
        id: payload.id,
        email: payload.email,
        role: payload.role,
      },
      envConfig.JWT_SECRET,
      {
        expiresIn: envConfig.JWT_EXPIRES_IN,
      } as SignOptions
    );
  }

  /**
   * Generate refresh token
   * Long-lived token for obtaining new access tokens
   */
  public static generateRefreshToken(payload: JWTPayload): string {
    return jwt.sign(
      {
        id: payload.id,
        email: payload.email,
        role: payload.role,
      },
      envConfig.JWT_REFRESH_SECRET,
      {
        expiresIn: envConfig.JWT_REFRESH_EXPIRES_IN,
      } as SignOptions
    );
  }

  /**
   * Verify access token
   * Validates token signature and expiration
   */
  public static verifyAccessToken(token: string): JWTPayload {
    try {
      const decoded = jwt.verify(token, envConfig.JWT_SECRET) as JWTPayload;
      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Token has expired');
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('Invalid token');
      }
      throw new Error('Token verification failed');
    }
  }

  /**
   * Verify refresh token
   * Validates refresh token signature and expiration
   */
  public static verifyRefreshToken(token: string): JWTPayload {
    try {
      const decoded = jwt.verify(token, envConfig.JWT_REFRESH_SECRET) as JWTPayload;
      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Refresh token has expired');
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('Invalid refresh token');
      }
      throw new Error('Refresh token verification failed');
    }
  }
}

