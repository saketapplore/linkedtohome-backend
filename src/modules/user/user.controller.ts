import { Request, Response, NextFunction } from 'express';
import { BaseController } from '../../core/base.controller';
import { IUserService } from './user.service';
import { CreateUserDto, CreateUserDtoValidator, UpdateUserDto, UpdateUserDtoValidator, UserResponseDto } from './user.dto';
import { ApiError } from '../../utils/apiError';

/**
 * User Controller
 * Handles HTTP requests/responses for User operations
 * No business logic - delegates to service layer
 */
export class UserController extends BaseController {
  private readonly userService: IUserService;

  constructor(userService: IUserService) {
    super();
    this.userService = userService;
  }

  /**
   * GET /users/:id
   * Get user by ID
   */
  public getById = this.asyncHandler(
    async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
      const { id } = req.params;

      if (!id) {
        throw new ApiError(400, 'User ID is required');
      }

      const user = await this.userService.getById(id);
      const userDto: UserResponseDto = user.toPlainObject();

      this.sendSuccess(res, 200, 'User retrieved successfully', userDto);
    }
  );

  /**
   * GET /users
   * Get all users
   */
  public getAll = this.asyncHandler(
    async (_req: Request, res: Response, _next: NextFunction): Promise<void> => {
      const users = await this.userService.getAll();
      const usersDto: UserResponseDto[] = users.map((user) => user.toPlainObject());

      this.sendSuccess(res, 200, 'Users retrieved successfully', usersDto);
    }
  );

  /**
   * POST /users
   * Create new user
   */
  public create = this.asyncHandler(
    async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
      const createUserDto: CreateUserDto = CreateUserDtoValidator.validate(req.body);
      const user = await this.userService.createUser(createUserDto);
      const userDto: UserResponseDto = user.toPlainObject();

      this.sendSuccess(res, 201, 'User created successfully', userDto);
    }
  );

  /**
   * PUT /users/:id
   * Update existing user
   */
  public update = this.asyncHandler(
    async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
      const { id } = req.params;

      if (!id) {
        throw new ApiError(400, 'User ID is required');
      }

      const updateUserDto: UpdateUserDto = UpdateUserDtoValidator.validate(req.body);
      const user = await this.userService.updateUser(id, updateUserDto);
      const userDto: UserResponseDto = user.toPlainObject();

      this.sendSuccess(res, 200, 'User updated successfully', userDto);
    }
  );

  /**
   * DELETE /users/:id
   * Delete user
   */
  public delete = this.asyncHandler(
    async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
      const { id } = req.params;

      if (!id) {
        throw new ApiError(400, 'User ID is required');
      }

      await this.userService.delete(id);

      this.sendSuccess(res, 200, 'User deleted successfully', null);
    }
  );
}

