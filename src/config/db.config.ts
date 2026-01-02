import mongoose from 'mongoose';
import { Logger } from '../utils/logger';
import { envConfig } from './env.config';

/**
 * Database configuration
 * Abstract database connection logic
 * Implements MongoDB connection using Mongoose
 */
// export interface IDatabaseConfig {
//   connect(): Promise<void>;
//   disconnect(): Promise<void>;
//   isConnected(): boolean;
// }

export interface IDatabaseConfig {
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    isConnected(): boolean;
}

/**
 * MongoDB database implementation
 * Uses Mongoose ODM for MongoDB connection and operations
 */
class MongoDBDatabase implements IDatabaseConfig {
  /**
   * Connect to MongoDB database
   * Uses connection string from environment configuration
   */
  public async connect(): Promise<void> {
    try {
      // Check if already connected
      if (mongoose.connection.readyState === 1) {
        Logger.info('MongoDB already connected');
        return;
      }

      // Connect to MongoDB
      // Mongoose v6+ handles connection options automatically
      await mongoose.connect(envConfig.MONGODB_URI);

      // Set up connection event listeners
      mongoose.connection.on('connected', () => {
        Logger.info('MongoDB connected successfully');
      });

      mongoose.connection.on('error', (error) => {
        Logger.error('MongoDB connection error:', error);
      });

      mongoose.connection.on('disconnected', () => {
        Logger.warn('MongoDB disconnected');
      });

      // Handle application termination
      process.on('SIGINT', async () => {
        await this.disconnect();
        process.exit(0);
      });

      Logger.info(`MongoDB connected to: ${envConfig.MONGODB_URI.replace(/\/\/.*@/, '//***:***@')}`);
    } catch (error) {
      Logger.error('MongoDB connection failed:', error);
      throw error;
    }
  }

  /**
   * Disconnect from MongoDB database
   */
  public async disconnect(): Promise<void> {
    try {
      // Check if already disconnected
      if (mongoose.connection.readyState === 0) {
        Logger.info('MongoDB already disconnected');
        return;
      }

      // Close the connection
      await mongoose.disconnect();
      Logger.info('MongoDB disconnected successfully');
    } catch (error) {
      Logger.error('MongoDB disconnection failed:', error);
      throw error;
    }
  }

  /**
   * Check if MongoDB is connected
   * @returns true if connected, false otherwise
   * 
   * Mongoose connection states:
   * 0 = disconnected
   * 1 = connected
   * 2 = connecting
   * 3 = disconnecting
   */
  public isConnected(): boolean {
    return mongoose.connection.readyState === 1;
  }
}

export const dbConfig: IDatabaseConfig = new MongoDBDatabase();

