import { BaseRepository, IBaseRepository } from '../../core/base.repository';
import { User } from './user.model';
import { ApiError } from '../../utils/apiError';

/**
 * User Repository interface
 * Defines contract for user data access operations
 */
export interface IUserRepository extends IBaseRepository<User, string> {
  findByEmail(email: string): Promise<User | null>;
}

/**
 * User Repository implementation
 * Handles all data access operations for User entity
 * Uses in-memory storage (can be replaced with MongoDB, PostgreSQL, etc.)
 */
export class UserRepository extends BaseRepository<User, string> implements IUserRepository {
  // In-memory storage (replace with actual database in production)
  private readonly users: Map<string, User> = new Map();

  /**
   * Find user by ID
   */
  public async findById(id: string): Promise<User | null> {
    const user = this.users.get(id);
    return user ? User.fromPlainObject(user.toPlainObject()) : null;
  }

  /**
   * Find user by email
   */
  public async findByEmail(email: string): Promise<User | null> {
    for (const user of this.users.values()) {
      if (user.email.toLowerCase() === email.toLowerCase()) {
        return User.fromPlainObject(user.toPlainObject());
      }
    }
    return null;
  }

  /**
   * Find all users
   */
  public async findAll(): Promise<User[]> {
    return Array.from(this.users.values()).map((user) =>
      User.fromPlainObject(user.toPlainObject())
    );
  }

  /**
   * Create new user
   */
  public async create(entity: Partial<User>): Promise<User> {
    if (!entity.email || !entity.name) {
      throw new ApiError(400, 'Email and name are required');
    }

    // Check if email already exists
    const existingUser = await this.findByEmail(entity.email);
    if (existingUser) {
      throw new ApiError(409, 'User with this email already exists');
    }

    // Generate ID (in production, use database auto-generation)
    const id = `user_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const now = new Date();

    const user = new User(
      id,
      entity.email,
      entity.name,
      entity.role,
      now,
      now
    );

    this.users.set(id, user);
    return User.fromPlainObject(user.toPlainObject());
  }

  /**
   * Update existing user
   */
  public async update(id: string, entity: Partial<User>): Promise<User | null> {
    const existingUser = this.users.get(id);
    if (!existingUser) {
      return null;
    }

    // Check email uniqueness if email is being updated
    if (entity.email && entity.email !== existingUser.email) {
      const emailExists = await this.findByEmail(entity.email);
      if (emailExists) {
        throw new ApiError(409, 'User with this email already exists');
      }
    }

    const updatedUser = new User(
      existingUser.id,
      entity.email ?? existingUser.email,
      entity.name ?? existingUser.name,
      entity.role ?? existingUser.role,
      existingUser.createdAt,
      new Date() // Update timestamp
    );

    this.users.set(id, updatedUser);
    return User.fromPlainObject(updatedUser.toPlainObject());
  }

  /**
   * Delete user by ID
   */
  public async delete(id: string): Promise<boolean> {
    return this.users.delete(id);
  }
}

