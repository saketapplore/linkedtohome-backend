import { Logger } from '../utils/logger';
import { ApiError } from '../utils/apiError';

/**
 * Base Service interface
 * Defines contract for all service implementations
 * Business logic layer abstraction
 */
export interface IBaseService<T, ID = string> {
  getById(id: ID): Promise<T>;
  getAll(): Promise<T[]>;
  create(data: Partial<T>): Promise<T>;
  update(id: ID, data: Partial<T>): Promise<T>;
  delete(id: ID): Promise<void>;
}

/**
 * Base Service abstract class
 * Provides common service functionality and error handling
 * Implements business logic layer following Service Pattern
 */
export abstract class BaseService<T, ID = string> implements IBaseService<T, ID> {
  protected readonly logger: Logger;
  protected readonly repository: import('./base.repository').IBaseRepository<T, ID>;

  constructor(repository: import('./base.repository').IBaseRepository<T, ID>) {
    this.repository = repository;
    this.logger = Logger;
  }

  /**
   * Get entity by ID
   * Throws ApiError if not found
   */
  public async getById(id: ID): Promise<T> {
    const entity = await this.repository.findById(id);
    if (!entity) {
      throw new ApiError(404, `Entity with id ${id} not found`);
    }
    return entity;
  }

  /**
   * Get all entities
   */
  public async getAll(): Promise<T[]> {
    return await this.repository.findAll();
  }

  /**
   * Create new entity
   */
  public async create(data: Partial<T>): Promise<T> {
    return await this.repository.create(data);
  }

  /**
   * Update entity by ID
   * Throws ApiError if not found
   */
  public async update(id: ID, data: Partial<T>): Promise<T> {
    const entity = await this.repository.update(id, data);
    if (!entity) {
      throw new ApiError(404, `Entity with id ${id} not found`);
    }
    return entity;
  }

  /**
   * Delete entity by ID
   * Throws ApiError if not found
   */
  public async delete(id: ID): Promise<void> {
    const deleted = await this.repository.delete(id);
    if (!deleted) {
      throw new ApiError(404, `Entity with id ${id} not found`);
    }
  }
}

