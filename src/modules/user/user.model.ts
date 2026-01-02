import { UserRole } from '../../constants/roles.constants';

/**
 * User entity model
 * Represents the User domain entity
 * Follows Domain-Driven Design principles
 */
export class User {
  public readonly id: string;
  public readonly email: string;
  public readonly name: string;
  public readonly role: UserRole;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(
    id: string,
    email: string,
    name: string,
    role: UserRole = UserRole.USER,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date()
  ) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.role = role;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  /**
   * Create User from plain object
   */
  public static fromPlainObject(data: {
    id: string;
    email: string;
    name: string;
    role?: UserRole;
    createdAt?: Date;
    updatedAt?: Date;
  }): User {
    return new User(
      data.id,
      data.email,
      data.name,
      data.role || UserRole.USER,
      data.createdAt || new Date(),
      data.updatedAt || new Date()
    );
  }

  /**
   * Convert User to plain object
   */
  public toPlainObject(): {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
  } {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      role: this.role,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

