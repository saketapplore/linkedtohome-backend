import dotenv from 'dotenv';

/**
 * Environment configuration
 * Loads and validates environment variables
 * Provides type-safe access to configuration
 */
dotenv.config();

export interface IEnvConfig {
  readonly NODE_ENV: string;
  readonly PORT: number;
  readonly CORS_ORIGIN: string;
  readonly MONGODB_URI: string;
  readonly JWT_SECRET: string;
  readonly JWT_EXPIRES_IN: string;
  readonly JWT_REFRESH_SECRET: string;
  readonly JWT_REFRESH_EXPIRES_IN: string;
  readonly MAX_FILE_SIZE: number;
}

class EnvConfig implements IEnvConfig {
  public readonly NODE_ENV: string;
  public readonly PORT: number;
  public readonly CORS_ORIGIN: string;
  public readonly MONGODB_URI: string;
  public readonly JWT_SECRET: string;
  public readonly JWT_EXPIRES_IN: string;
  public readonly JWT_REFRESH_SECRET: string;
  public readonly JWT_REFRESH_EXPIRES_IN: string;
  public readonly MAX_FILE_SIZE: number;

  constructor() {
    this.NODE_ENV = process.env.NODE_ENV || 'development';
    this.PORT = this.parsePort(process.env.PORT);
    this.CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';
    this.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/linkedtohome';
    this.JWT_SECRET = process.env.JWT_SECRET || 'change-me-in-env-please-use-a-strong-random-secret-key';
    this.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
    this.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'change-me-refresh-in-env-please-use-a-strong-random-secret-key';
    this.JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '30d';
    this.MAX_FILE_SIZE = this.parseMaxFileSize(process.env.MAX_FILE_SIZE);

    this.validate();
  }

  private parsePort(port: string | undefined): number {
    if (!port) {
      return 3000;
    }
    const parsed = parseInt(port, 10);
    if (isNaN(parsed) || parsed < 1 || parsed > 65535) {
      throw new Error(`Invalid PORT: ${port}. Must be a number between 1 and 65535`);
    }
    return parsed;
  }

  private parseMaxFileSize(maxFileSize: string | undefined): number {
    if (!maxFileSize) {
      return 5242880; // Default: 5MB
    }
    const parsed = parseInt(maxFileSize, 10);
    if (isNaN(parsed) || parsed < 1) {
      throw new Error(`Invalid MAX_FILE_SIZE: ${maxFileSize}. Must be a positive number`);
    }
    return parsed;
  }

  private validate(): void {
    const required: (keyof IEnvConfig)[] = [];
    const missing: string[] = [];

    required.forEach((key) => {
      if (!this[key]) {
        missing.push(key);
      }
    });

    if (missing.length > 0) {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
  }
}

export const envConfig = new EnvConfig();

