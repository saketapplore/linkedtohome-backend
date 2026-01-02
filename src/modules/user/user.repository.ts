import { BaseRepository, IBaseRepository } from '../../core/base.repository';
import { User } from './user.model';
import { ApiError } from '../../utils/apiError';
import { UserModel, IUserDocument } from './user.schema';
import { Logger } from '../../utils/logger';
import mongoose from 'mongoose';

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
 * Uses MongoDB with Mongoose ODM
 */
export class UserRepository extends BaseRepository<User, string> implements IUserRepository {
  /**
   * Convert Mongoose document to User entity
   */
  private toUserEntity(doc: IUserDocument): User {
    return User.fromPlainObject({
      id: doc._id.toString(),
      schoolName: doc.schoolName,
      email: doc.email,
      password: doc.password,
      role: doc.role,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  /**
   * Find user by ID
   * Includes password field for authentication purposes
   */
  public async findById(id: string): Promise<User | null> {
    try {
      const userDoc = await UserModel.findById(id).select('+password');
      if (!userDoc) {
        return null;
      }
      return this.toUserEntity(userDoc);
    } catch (error) {
      return null;
    }
  }

  /**
   * Find user by email
   * Returns user with password (for authentication)
   * Uses select('+password') to include password field
   */
  public async findByEmail(email: string): Promise<User | null> {
    try {
      const userDoc = await UserModel.findOne({ email: email.toLowerCase().trim() }).select('+password');
      if (!userDoc) {
        return null;
      }
      return this.toUserEntity(userDoc);
    } catch (error: any) {
      Logger.error('Error finding user by email:', error);
      return null;
    }
  }

  /**
   * Find all users
   * Includes password field (for internal use)
   */
  public async findAll(): Promise<User[]> {
    try {
      const userDocs = await UserModel.find().select('+password');
      return userDocs.map((doc) => this.toUserEntity(doc));
    } catch (error) {
      return [];
    }
  }

  /**
   * Create new user
   * MongoDB will auto-generate _id and timestamps
   */
  public async create(entity: Partial<User>): Promise<User> {
    if (!entity.email || !entity.schoolName || !entity.password) {
      throw new ApiError(400, 'Email, school name, and password are required');
    }

    // Check MongoDB connection
    if (mongoose.connection.readyState !== 1) {
      Logger.error('MongoDB is not connected. Connection state:', mongoose.connection.readyState);
      throw new ApiError(500, 'Database connection error');
    }

    // Check if email already exists
    const existingUser = await this.findByEmail(entity.email);
    if (existingUser) {
      throw new ApiError(409, 'User with this email already exists');
    }

    try {
      // Create new user document
      const userDoc = new UserModel({
        schoolName: entity.schoolName.trim(),
        email: entity.email.toLowerCase().trim(),
        password: entity.password,
        role: entity.role || 'user',
      });

      Logger.info('Attempting to save user to MongoDB:', {
        email: userDoc.email,
        schoolName: userDoc.schoolName,
      });

      // Save to MongoDB
      const savedDoc = await userDoc.save();
      
      Logger.info('User saved successfully to MongoDB:', {
        id: savedDoc._id.toString(),
        email: savedDoc.email,
      });

      return this.toUserEntity(savedDoc);
    } catch (error: any) {
      Logger.error('Error saving user to MongoDB:', error);
      
      // Handle MongoDB duplicate key error
      if (error.code === 11000) {
        throw new ApiError(409, 'User with this email already exists');
      }
      
      // Handle validation errors
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map((err: any) => err.message).join(', ');
        throw new ApiError(400, `Validation error: ${messages}`);
      }
      
      // Re-throw ApiError
      if (error instanceof ApiError) {
        throw error;
      }
      
      // Generic error
      throw new ApiError(500, 'Failed to create user');
    }
  }

  /**
   * Update existing user
   * MongoDB will auto-update updatedAt timestamp
   */
  public async update(id: string, entity: Partial<User>): Promise<User | null> {
    try {
      // Check if user exists
      const existingUser = await UserModel.findById(id);
      if (!existingUser) {
        return null;
      }

      // Build update object
      const updateData: Partial<IUserDocument> = {};

      if (entity.schoolName) {
        updateData.schoolName = entity.schoolName.trim();
      }

      if (entity.email) {
        const normalizedEmail = entity.email.toLowerCase().trim();
        // Check email uniqueness if email is being changed
        if (normalizedEmail !== existingUser.email) {
          const emailExists = await this.findByEmail(normalizedEmail);
          if (emailExists) {
            throw new ApiError(409, 'User with this email already exists');
          }
        }
        updateData.email = normalizedEmail;
      }

      if (entity.password) {
        updateData.password = entity.password;
      }

      if (entity.role) {
        updateData.role = entity.role;
      }

      // Update user in MongoDB
      const updatedDoc = await UserModel.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
      ).select('+password');

      if (!updatedDoc) {
        return null;
      }

      return this.toUserEntity(updatedDoc);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      return null;
    }
  }

  /**
   * Delete user by ID
   */
  public async delete(id: string): Promise<boolean> {
    try {
      const result = await UserModel.findByIdAndDelete(id);
      return result !== null;
    } catch (error) {
      return false;
    }
  }
}

