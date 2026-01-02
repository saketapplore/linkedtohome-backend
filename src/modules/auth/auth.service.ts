import { IUserRepository } from '../user/user.repository';
import { User } from '../user/user.model';
import { UserRole } from '../../constants/roles.constants';
import { SignupDto, SigninDto, RefreshTokenDto, AuthResponseDto } from './auth.dto';
import { ApiError } from '../../utils/apiError';
import { Logger } from '../../utils/logger';
import { PasswordUtil } from '../../utils/password';
import { JWTUtil, JWTPayload } from '../../utils/jwt';

/**
 * Auth Service interface
 * Defines contract for authentication operations
 */
export interface IAuthService {
  signup(signupDto: SignupDto): Promise<AuthResponseDto>;
  signin(signinDto: SigninDto): Promise<AuthResponseDto>;
  refreshToken(refreshTokenDto: RefreshTokenDto): Promise<{ accessToken: string; refreshToken: string }>;
}

/**
 * Auth Service implementation
 * Contains all authentication business logic
 */
export class AuthService implements IAuthService {
  private readonly userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  /**
   * Sign up a new user
   * Creates account and returns JWT tokens
   */
  public async signup(signupDto: SignupDto): Promise<AuthResponseDto> {
    // Check if email already exists
    const existingUser = await this.userRepository.findByEmail(signupDto.email);
    if (existingUser) {
      throw new ApiError(409, 'User with this email already exists');
    }

    // Hash password
    const hashedPassword = await PasswordUtil.hashPassword(signupDto.password);

    // Create user
    const user = await this.userRepository.create({
      schoolName: signupDto.schoolName,
      email: signupDto.email,
      password: hashedPassword,
      role: UserRole.USER, // Default role for signup
    });

    // Generate JWT tokens
    const tokens = this.generateTokens(user, signupDto.keepMeLoggedIn);

    Logger.info(`User signed up: ${user.id} - ${user.email}`);

    return {
      user: user.toPlainObject(),
      tokens,
    };
  }

  /**
   * Sign in an existing user
   * Verifies credentials and returns JWT tokens
   */
  public async signin(signinDto: SigninDto): Promise<AuthResponseDto> {
    // Find user by email
    const user = await this.userRepository.findByEmail(signinDto.email);
    if (!user) {
      // Generic error message for security (don't reveal if email exists)
      throw new ApiError(401, 'Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await PasswordUtil.comparePassword(signinDto.password, user.password);
    if (!isPasswordValid) {
      // Generic error message for security
      throw new ApiError(401, 'Invalid email or password');
    }

    // Generate JWT tokens (use keepMeLoggedIn flag if provided)
    const tokens = this.generateTokens(user, signinDto.keepMeLoggedIn || false);

    Logger.info(`User signed in: ${user.id} - ${user.email}`);

    return {
      user: user.toPlainObject(),
      tokens,
    };
  }

  /**
   * Refresh access token using refresh token
   */
  public async refreshToken(refreshTokenDto: RefreshTokenDto): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      // Verify refresh token
      const payload = JWTUtil.verifyRefreshToken(refreshTokenDto.refreshToken);

      // Find user to ensure they still exist
      const user = await this.userRepository.findById(payload.id);
      if (!user) {
        throw new ApiError(401, 'User not found');
      }

      // Generate new tokens
      const tokens = this.generateTokens(user, false);

      Logger.info(`Token refreshed for user: ${user.id}`);

      return tokens;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(401, 'Invalid or expired refresh token');
    }
  }

  /**
   * Generate JWT tokens for user
   * Adjusts expiration based on keepMeLoggedIn flag
   * Note: keepMeLoggedIn can be used to adjust token expiration in future
   */
  private generateTokens(user: User, _keepMeLoggedIn: boolean = false): { accessToken: string; refreshToken: string } {
    const payload: JWTPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    // Adjust token expiration based on keepMeLoggedIn
    // For now, using default expiration from env config
    // Can be extended to use different expiration times
    const accessToken = JWTUtil.generateAccessToken(payload);
    const refreshToken = JWTUtil.generateRefreshToken(payload);

    return {
      accessToken,
      refreshToken,
    };
  }
}

