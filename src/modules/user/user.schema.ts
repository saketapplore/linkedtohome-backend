import mongoose, { Schema, Document } from 'mongoose';
import { UserRole } from '../../constants/roles.constants';

/**
 * User Document interface
 * Extends Mongoose Document with User properties
 */
export interface IUserDocument extends Document {
  schoolName: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * User Schema
 * Defines the MongoDB collection structure
 */
const UserSchema: Schema = new Schema(
  {
    schoolName: {
      type: String,
      required: [true, 'School name is required'],
      trim: true,
      minlength: [2, 'School name must be at least 2 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false, // Don't return password by default in queries
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Create indexes for better query performance
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ role: 1 });

/**
 * User Model
 * Mongoose model for User collection in MongoDB
 * Collection name will be 'users' (Mongoose pluralizes 'User')
 */
export const UserModel = mongoose.model<IUserDocument>('User', UserSchema);

