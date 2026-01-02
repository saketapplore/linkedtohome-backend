/**
 * Standardized API Response wrapper
 * Ensures consistent response structure across the application
 */
export class ApiResponse<T> {
  public readonly success: boolean;
  public readonly message: string;
  public readonly data: T | null;
  public readonly errors: string[] | null;

  constructor(
    success: boolean,
    message: string,
    data: T | null = null,
    errors: string[] | null = null
  ) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.errors = errors;
  }

  /**
   * Create a successful response
   */
  public static success<T>(message: string, data: T | null = null): ApiResponse<T> {
    return new ApiResponse<T>(true, message, data, null);
  }

  /**
   * Create an error response
   */
  public static error(message: string, errors: string[] | null = null): ApiResponse<null> {
    return new ApiResponse<null>(false, message, null, errors);
  }
}

