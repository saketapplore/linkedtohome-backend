import { Router } from 'express';
import { AuthController } from './auth.controller';
import { IAuthService } from './auth.service';

/**
 * Auth Routes
 * Registers all authentication-related endpoints
 */
export class AuthRoutes {
  private readonly router: Router;
  private readonly authController: AuthController;

  constructor(authService: IAuthService) {
    this.router = Router();
    this.authController = new AuthController(authService);
    this.registerRoutes();
  }

  /**
   * Register all auth routes
   */
  private registerRoutes(): void {
    // POST /auth/signup - Sign up new user
    this.router.post('/signup', this.authController.signup);

    // POST /auth/signin - Sign in existing user
    this.router.post('/signin', this.authController.signin);

    // POST /auth/refresh - Refresh access token
    this.router.post('/refresh', this.authController.refresh);
  }

  /**
   * Get router instance
   */
  public getRouter(): Router {
    return this.router;
  }
}

