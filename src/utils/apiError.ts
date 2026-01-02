/**
 * Custom API Error class for handling application errors
 * Extends native Error class with status code and operational flag
 */
export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(
    statusCode: number,
    message: string,
    isOperational: boolean = true,
    stack: string = ''
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    if (stack) {
      this.stack = stack;
    } else {
      // Error.captureStackTrace is Node.js specific
      const ErrorConstructor = Error as unknown as {
        captureStackTrace?: (error: Error, constructor: Function) => void;
      };
      if (typeof ErrorConstructor.captureStackTrace === 'function') {
        ErrorConstructor.captureStackTrace(this, this.constructor);
      }
    }
  }
}

