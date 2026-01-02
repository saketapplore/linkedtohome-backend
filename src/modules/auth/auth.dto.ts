import { PasswordUtil } from '../../utils/password';

/**
 * Data Transfer Objects (DTOs) for Auth module
 * Used for authentication request validation
 */

/**
 * DTO for user signup
 */
export interface SignupDto {
  readonly schoolName: string;
  readonly email: string;
  readonly password: string;
  readonly confirmPassword: string;
  readonly keepMeLoggedIn?: boolean;
}

/**
 * DTO for user signin
 */
export interface SigninDto {
  readonly email: string;
  readonly password: string;
  readonly keepMeLoggedIn?: boolean;
}

/**
 * DTO for refresh token
 */
export interface RefreshTokenDto {
  readonly refreshToken: string;
}

/**
 * DTO for auth response
 */
export interface AuthResponseDto {
  readonly user: {
    readonly id: string;
    readonly schoolName: string;
    readonly email: string;
    readonly role: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
  };
  readonly tokens: {
    readonly accessToken: string;
    readonly refreshToken: string;
  };
}

/**
 * Validation helper for SignupDto
 */
export class SignupDtoValidator {
  public static validate(dto: unknown): SignupDto {
    if (!dto || typeof dto !== 'object') {
      throw new Error('Invalid signup data');
    }

    const signupData = dto as Record<string, unknown>;

    // Validate school name
    if (!signupData.schoolName || typeof signupData.schoolName !== 'string') {
      throw new Error('School name is required and must be a string');
    }
    if (signupData.schoolName.trim().length === 0) {
      throw new Error('School name cannot be empty');
    }
    if (signupData.schoolName.trim().length < 2) {
      throw new Error('School name must be at least 2 characters long');
    }

    // Validate email
    if (!signupData.email || typeof signupData.email !== 'string') {
      throw new Error('Email is required and must be a string');
    }
    if (signupData.email.trim().length === 0) {
      throw new Error('Email cannot be empty');
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(signupData.email)) {
      throw new Error('Invalid email format');
    }

    // Validate password
    if (!signupData.password || typeof signupData.password !== 'string') {
      throw new Error('Password is required and must be a string');
    }

    // Validate password strength
    const passwordError = PasswordUtil.validatePasswordStrength(signupData.password);
    if (passwordError) {
      throw new Error(passwordError);
    }

    // Validate confirm password
    if (!signupData.confirmPassword || typeof signupData.confirmPassword !== 'string') {
      throw new Error('Confirm password is required and must be a string');
    }

    // Check if passwords match
    if (signupData.password !== signupData.confirmPassword) {
      throw new Error('Passwords do not match');
    }

    return {
      schoolName: signupData.schoolName.trim(),
      email: signupData.email.toLowerCase().trim(),
      password: signupData.password,
      confirmPassword: signupData.confirmPassword,
      keepMeLoggedIn: signupData.keepMeLoggedIn as boolean | undefined,
    };
  }
}

/**
 * Validation helper for SigninDto
 */
export class SigninDtoValidator {
  public static validate(dto: unknown): SigninDto {
    if (!dto || typeof dto !== 'object') {
      throw new Error('Invalid signin data');
    }

    const signinData = dto as Record<string, unknown>;

    // Validate email
    if (!signinData.email || typeof signinData.email !== 'string') {
      throw new Error('Email is required');
    }
    if (signinData.email.trim().length === 0) {
      throw new Error('Email cannot be empty');
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(signinData.email)) {
      throw new Error('Invalid email format');
    }

    // Validate password
    if (!signinData.password || typeof signinData.password !== 'string') {
      throw new Error('Password is required');
    }
    if (signinData.password.length === 0) {
      throw new Error('Password cannot be empty');
    }

    return {
      email: signinData.email.toLowerCase().trim(),
      password: signinData.password,
      keepMeLoggedIn: signinData.keepMeLoggedIn as boolean | undefined,
    };
  }
}

/**
 * Validation helper for RefreshTokenDto
 */
export class RefreshTokenDtoValidator {
  public static validate(dto: unknown): RefreshTokenDto {
    if (!dto || typeof dto !== 'object') {
      throw new Error('Invalid refresh token data');
    }

    const refreshData = dto as Record<string, unknown>;

    if (!refreshData.refreshToken || typeof refreshData.refreshToken !== 'string') {
      throw new Error('Refresh token is required');
    }

    if (refreshData.refreshToken.trim().length === 0) {
      throw new Error('Refresh token cannot be empty');
    }

    return {
      refreshToken: refreshData.refreshToken.trim(),
    };
  }
}

