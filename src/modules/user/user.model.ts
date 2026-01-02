import { UserRole } from '../../constants/roles.constants';

/**
 * User entity model
 * Represents the User domain entity
 * Follows Domain-Driven Design principles
 */
export class User {
  public readonly id: string;
  public readonly schoolName: string;
  public readonly email: string;
  public readonly password: string; // Hashed password - never returned in responses
  public readonly role: UserRole;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(
    id: string,
    schoolName: string,
    email: string,
    password: string,
    role: UserRole = UserRole.USER,
    createdAt: Date = new Date(),
    updatedAt: Date = new Date()
  ) {
    this.id = id;
    this.schoolName = schoolName;
    this.email = email;
    this.password = password;
    this.role = role;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  /**
   * Create User from plain object
   */
  public static fromPlainObject(data: {
    id: string;
    schoolName: string;
    email: string;
    password: string;
    role?: UserRole;
    createdAt?: Date;
    updatedAt?: Date;
  }): User {
    return new User(
      data.id,
      data.schoolName,
      data.email,
      data.password,
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
    schoolName: string;
    email: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
    // Note: password is intentionally excluded for security
  } {
    return {
      id: this.id,
      schoolName: this.schoolName,
      email: this.email,
      role: this.role,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

