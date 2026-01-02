import { Logger } from '../utils/logger';

/**
 * Base Repository interface
 * Defines contract for all repository implementations
 * Follows Repository Pattern for data access abstraction
 */
export interface IBaseRepository<T, ID = string> {
  findById(id: ID): Promise<T | null>;
  findAll(): Promise<T[]>;
  create(entity: Partial<T>): Promise<T>;
  update(id: ID, entity: Partial<T>): Promise<T | null>;
  delete(id: ID): Promise<boolean>;
}

/**
 * Base Repository abstract class
 * Provides common repository functionality
 * Can be extended by specific repository implementations
 */
export abstract class BaseRepository<T, ID = string> implements IBaseRepository<T, ID> {
  protected readonly logger: Logger;

  constructor() {
    this.logger = Logger;
  }

  public abstract findById(id: ID): Promise<T | null>;
  public abstract findAll(): Promise<T[]>;
  public abstract create(entity: Partial<T>): Promise<T>;
  public abstract update(id: ID, entity: Partial<T>): Promise<T | null>;
  public abstract delete(id: ID): Promise<boolean>;
}

