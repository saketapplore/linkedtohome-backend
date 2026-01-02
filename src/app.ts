import express, { Application } from 'express';
import { ErrorMiddleware } from './middlewares/error.middleware';
import { CorsMiddleware } from './middlewares/cors.middleware';
import { UserRoutes } from './modules/user/user.routes';
import { UserService } from './modules/user/user.service';
import { UserRepository } from './modules/user/user.repository';
import { AuthRoutes } from './modules/auth/auth.routes';
import { AuthService } from './modules/auth/auth.service';
import { Logger } from './utils/logger';
// Import schema to ensure it's registered with Mongoose
import './modules/user/user.schema';

/**
 * Application setup
 * Configures Express app with routes, middlewares, and dependency injection
 * Follows Clean Architecture principles
 */
export class App {
  private readonly app: Application;

  constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  /**
   * Initialize Express middlewares
   */
  private initializeMiddlewares(): void {
    // CORS middleware (must be before other middlewares)
    this.app.use(CorsMiddleware.handle);

    // Body parser middleware
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // Request logging middleware
    this.app.use((req, _res, next) => {
      Logger.info(`${req.method} ${req.path}`);
      next();
    });
  }

  /**
   * Initialize application routes
   * Manual dependency injection - no framework needed
   */
  private initializeRoutes(): void {
    // Health check endpoint
    this.app.get('/health', (_req, res) => {
      res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
    });

    // Shared repository instance
    const userRepository = new UserRepository();

    // Auth module routes
    // Dependency Injection: Repository -> Service -> Controller -> Routes
    const authService = new AuthService(userRepository);
    const authRoutes = new AuthRoutes(authService);
    this.app.use('/api/auth', authRoutes.getRouter());

    // User module routes
    // Dependency Injection: Repository -> Service -> Controller -> Routes
    const userService = new UserService(userRepository);
    const userRoutes = new UserRoutes(userService);
    this.app.use('/api/users', userRoutes.getRouter());

    Logger.info('Routes initialized');
  }

  /**
   * Initialize error handling middleware
   * Must be last middleware
   */
  private initializeErrorHandling(): void {
    // 404 handler
    this.app.use(ErrorMiddleware.notFound);

    // Global error handler
    this.app.use(ErrorMiddleware.handle);
  }

  /**
   * Get Express application instance
   */
  public getApp(): Application {
    return this.app;
  }
}

