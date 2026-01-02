import { Router } from 'express';
import { UserController } from './user.controller';
import { IUserService } from './user.service';

/**
 * User Routes
 * Registers all user-related endpoints
 * Follows RESTful API conventions
 */
export class UserRoutes {
  private readonly router: Router;
  private readonly userController: UserController;

  constructor(userService: IUserService) {
    this.router = Router();
    this.userController = new UserController(userService);
    this.registerRoutes();
  }

  /**
   * Register all user routes
   */
  private registerRoutes(): void {
    // GET /users - Get all users
    this.router.get('/', this.userController.getAll);

    // GET /users/:id - Get user by ID
    this.router.get('/:id', this.userController.getById);

    // POST /users - Create new user
    this.router.post('/', this.userController.create);

    // PUT /users/:id - Update user
    this.router.put('/:id', this.userController.update);

    // DELETE /users/:id - Delete user
    this.router.delete('/:id', this.userController.delete);
  }

  /**
   * Get router instance
   */
  public getRouter(): Router {
    return this.router;
  }
}

