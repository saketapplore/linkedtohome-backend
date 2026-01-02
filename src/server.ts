import { App } from './app';
import { envConfig } from './config/env.config';
import { dbConfig } from './config/db.config';
import { Logger } from './utils/logger';

/**
 * Server entry point
 * Initializes database connection and starts Express server
 */
class Server {
  private readonly app: App;

  constructor() {
    this.app = new App();
  }

  /**
   * Start the server
   */
  public async start(): Promise<void> {
    try {
      // Connect to database
      await dbConfig.connect();
      Logger.info('Database connected');

      // Start Express server
      const expressApp = this.app.getApp();
      const port = envConfig.PORT;

      expressApp.listen(port, () => {
        Logger.info(`Server running on port ${port}`);
        Logger.info(`Environment: ${envConfig.NODE_ENV}`);
        Logger.info(`Health check: http://localhost:${port}/health`);
        Logger.info(`API base: http://localhost:${port}/api`);
      });
    } catch (error) {
      Logger.error('Failed to start server:', error);
      process.exit(1);
    }
  }

  /**
   * Graceful shutdown
   */
  public async shutdown(): Promise<void> {
    try {
      Logger.info('Shutting down server...');
      await dbConfig.disconnect();
      Logger.info('Server shut down successfully');
      process.exit(0);
    } catch (error) {
      Logger.error('Error during shutdown:', error);
      process.exit(1);
    }
  }
}

// Create and start server
const server = new Server();
server.start();

// Handle graceful shutdown
process.on('SIGTERM', () => {
  server.shutdown();
});

process.on('SIGINT', () => {
  server.shutdown();
});

