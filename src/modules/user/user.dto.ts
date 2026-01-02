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
  readonly email: string;
  readonly name: string;
  readonly role?: UserRole;
}

/**
 * DTO for updating an existing user
 */
export interface UpdateUserDto {
  email?: string;
  name?: string;
  role?: UserRole;
}

/**
 * DTO for user response (what we send to client)
 */
export interface UserResponseDto {
  readonly id: string;
  readonly email: string;
  readonly name: string;
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

    if (!userData.name || typeof userData.name !== 'string') {
      throw new Error('Name is required and must be a string');
    }

    if (userData.email.trim().length === 0) {
      throw new Error('Email cannot be empty');
    }

    if (userData.name.trim().length === 0) {
      throw new Error('Name cannot be empty');
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      throw new Error('Invalid email format');
    }

    return {
      email: userData.email.trim(),
      name: userData.name.trim(),
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

    if (userData.name !== undefined) {
      if (typeof userData.name !== 'string' || userData.name.trim().length === 0) {
        throw new Error('Name must be a non-empty string');
      }
      result.name = userData.name.trim();
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

