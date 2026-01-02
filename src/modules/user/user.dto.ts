import { UserRole } from '../../constants/roles.constants';

/**
 * Data Transfer Objects (DTOs) for User module
 * Used for request validation and data transformation
 * Separates API contract from domain model
 */

/**
 * DTO for creating a new user
 */
export interface CreateUserDto {
  readonly schoolName: string;
  readonly email: string;
  readonly role?: UserRole;
}

/**
 * DTO for updating an existing user
 */
export interface UpdateUserDto {
  schoolName?: string;
  email?: string;
  role?: UserRole;
}

/**
 * DTO for user response (what we send to client)
 */
export interface UserResponseDto {
  readonly id: string;
  readonly schoolName: string;
  readonly email: string;
  readonly role: UserRole;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

/**
 * Validation helper for CreateUserDto
 */
export class CreateUserDtoValidator {
  public static validate(dto: unknown): CreateUserDto {
    if (!dto || typeof dto !== 'object') {
      throw new Error('Invalid user data');
    }

    const userData = dto as Record<string, unknown>;

    if (!userData.email || typeof userData.email !== 'string') {
      throw new Error('Email is required and must be a string');
    }

    if (!userData.schoolName || typeof userData.schoolName !== 'string') {
      throw new Error('School name is required and must be a string');
    }

    if (userData.email.trim().length === 0) {
      throw new Error('Email cannot be empty');
    }

    if (userData.schoolName.trim().length === 0) {
      throw new Error('School name cannot be empty');
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      throw new Error('Invalid email format');
    }

    return {
      schoolName: userData.schoolName.trim(),
      email: userData.email.trim(),
      role: userData.role as UserRole | undefined,
    };
  }
}

/**
 * Validation helper for UpdateUserDto
 */
export class UpdateUserDtoValidator {
  public static validate(dto: unknown): UpdateUserDto {
    if (!dto || typeof dto !== 'object') {
      throw new Error('Invalid user data');
    }

    const userData = dto as Record<string, unknown>;
    const result: UpdateUserDto = {};

    if (userData.email !== undefined) {
      if (typeof userData.email !== 'string' || userData.email.trim().length === 0) {
        throw new Error('Email must be a non-empty string');
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userData.email)) {
        throw new Error('Invalid email format');
      }
      result.email = userData.email.trim();
    }

    if (userData.schoolName !== undefined) {
      if (typeof userData.schoolName !== 'string' || userData.schoolName.trim().length === 0) {
        throw new Error('School name must be a non-empty string');
      }
      result.schoolName = userData.schoolName.trim();
    }

    if (userData.role !== undefined) {
      if (!Object.values(UserRole).includes(userData.role as UserRole)) {
        throw new Error('Invalid role');
      }
      result.role = userData.role as UserRole;
    }

    return result;
  }
}

