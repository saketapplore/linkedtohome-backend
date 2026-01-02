import bcrypt from 'bcrypt';

/**
 * Password Utility class
 * Handles password hashing and validation
 * Provides secure password operations
 */
export class PasswordUtil {
  private static readonly SALT_ROUNDS = 10;
  private static readonly MIN_PASSWORD_LENGTH = 8;
  private static readonly MAX_PASSWORD_LENGTH = 128;

  /**
   * Hash password using bcrypt
   */
  public static async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, this.SALT_ROUNDS);
  }

  /**
   * Compare password with hash
   */
  public static async comparePassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  /**
   * Validate password strength
   * Returns error message if invalid, null if valid
   */
  public static validatePasswordStrength(password: string): string | null {
    if (!password || typeof password !== 'string') {
      return 'Password is required';
    }

    if (password.length < this.MIN_PASSWORD_LENGTH) {
      return `Password must be at least ${this.MIN_PASSWORD_LENGTH} characters long`;
    }

    if (password.length > this.MAX_PASSWORD_LENGTH) {
      return `Password must be less than ${this.MAX_PASSWORD_LENGTH} characters`;
    }

    // Check for at least one uppercase letter
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }

    // Check for at least one lowercase letter
    if (!/[a-z]/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }

    // Check for at least one number
    if (!/[0-9]/.test(password)) {
      return 'Password must contain at least one number';
    }

    // Check for at least one special character
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      return 'Password must contain at least one special character';
    }

    return null; // Password is valid
  }
}

