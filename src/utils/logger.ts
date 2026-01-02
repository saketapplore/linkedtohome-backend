/**
 * Simple logger utility for application logging
 * In production, this can be replaced with winston, pino, or other logging libraries
 */
export class Logger {
  private static formatMessage(level: string, message: string, ...args: unknown[]): string {
    const timestamp = new Date().toISOString();
    const formattedArgs = args.length > 0 ? ` ${JSON.stringify(args)}` : '';
    return `[${timestamp}] [${level}] ${message}${formattedArgs}`;
  }

  public static info(message: string, ...args: unknown[]): void {
    console.log(this.formatMessage('INFO', message, ...args));
  }

  public static error(message: string, ...args: unknown[]): void {
    console.error(this.formatMessage('ERROR', message, ...args));
  }

  public static warn(message: string, ...args: unknown[]): void {
    console.warn(this.formatMessage('WARN', message, ...args));
  }

  public static debug(message: string, ...args: unknown[]): void {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(this.formatMessage('DEBUG', message, ...args));
    }
  }
}

