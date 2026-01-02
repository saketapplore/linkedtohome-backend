import { IBaseService } from '../../core/base.service';
import { User } from './user.model';
import { IUserRepository } from './user.repository';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { ApiError } from '../../utils/apiError';
import { Logger } from '../../utils/logger';
import { UserRole } from '../../constants/roles.constants';

/**
 * User Service interface
 * Defines contract for user business logic operations
 */
export interface IUserService extends IBaseService<User, string> {
  getByEmail(email: string): Promise<User>;
  createUser(createUserDto: CreateUserDto): Promise<User>;
  updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User>;
}

/**
 * User Service implementation
 * Contains all business logic for User operations
 * No data access logic here - delegates to repository
 */
export class UserService implements IUserService {
  private readonly repository: IUserRepository;

  constructor(repository: IUserRepository) {
    this.repository = repository;
  }

  /**
   * Get user by ID
   * Throws ApiError if not found
   */
  public async getById(id: string): Promise<User> {
    const user = await this.repository.findById(id);
    if (!user) {
      throw new ApiError(404, `User with id ${id} not found`);
    }
    return user;
  }

  /**
   * Get user by email
   * Throws ApiError if not found
   */
  public async getByEmail(email: string): Promise<User> {
    const user = await this.repository.findByEmail(email);
    if (!user) {
      throw new ApiError(404, `User with email ${email} not found`);
    }
    return user;
  }

  /**
   * Get all users
   */
  public async getAll(): Promise<User[]> {
    return await this.repository.findAll();
  }

  /**
   * Create new user
   * Validates business rules before creation
   */
  public async createUser(createUserDto: CreateUserDto): Promise<User> {
    // Business logic: Check if email already exists
    const existingUser = await this.repository.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ApiError(409, 'User with this email already exists');
    }

    // Business logic: Normalize email
    const normalizedEmail = createUserDto.email.toLowerCase().trim();

    // Create user through repository
    const user = await this.repository.create({
      schoolName: createUserDto.schoolName,
      email: normalizedEmail,
      password: '', // Empty password for admin-created users (should set password separately)
      role: createUserDto.role,
    });

    Logger.info(`User created: ${user.id}`);
    return user;
  }

  /**
   * Update existing user
   * Validates business rules before update
   */
  public async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    // Check if user exists
    const existingUser = await this.repository.findById(id);
    if (!existingUser) {
      throw new ApiError(404, `User with id ${id} not found`);
    }

    // Business logic: Normalize email if provided
    // Use a plain object type instead of Partial<User> since User properties are readonly
    const updateData: { schoolName?: string; email?: string; role?: UserRole } = {};
    if (updateUserDto.schoolName) {
      updateData.schoolName = updateUserDto.schoolName;
    }
    if (updateUserDto.email) {
      updateData.email = updateUserDto.email.toLowerCase().trim();
    }
    if (updateUserDto.role) {
      updateData.role = updateUserDto.role;
    }

    const updatedUser = await this.repository.update(id, updateData);
    if (!updatedUser) {
      throw new ApiError(404, `User with id ${id} not found`);
    }

    Logger.info(`User updated: ${id}`);
    return updatedUser;
  }

  /**
   * Create user (implements IBaseService)
   */
  public async create(data: Partial<User>): Promise<User> {
    if (!data.email || !data.schoolName) {
      throw new ApiError(400, 'Email and school name are required');
    }
    return await this.createUser({
      schoolName: data.schoolName,
      email: data.email,
      role: data.role,
    });
  }

  /**
   * Update user (implements IBaseService)
   */
  public async update(id: string, data: Partial<User>): Promise<User> {
    return await this.updateUser(id, {
      schoolName: data.schoolName,
      email: data.email,
      role: data.role,
    });
  }

  /**
   * Delete user
   * Throws ApiError if not found
   */
  public async delete(id: string): Promise<void> {
    const deleted = await this.repository.delete(id);
    if (!deleted) {
      throw new ApiError(404, `User with id ${id} not found`);
    }
    Logger.info(`User deleted: ${id}`);
  }
}

