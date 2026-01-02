/**
 * User role constants
 * Centralized role definitions for authorization
 */
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  MODERATOR = 'moderator',
}

export const ROLES = {
  ADMIN: UserRole.ADMIN,
  USER: UserRole.USER,
  MODERATOR: UserRole.MODERATOR,
} as const;

