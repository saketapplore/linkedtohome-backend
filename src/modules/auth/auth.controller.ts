import { Request, Response, NextFunction } from 'express';
import { BaseController } from '../../core/base.controller';
import { IAuthService } from './auth.service';
import {
  SignupDto,
  SignupDtoValidator,
  SigninDto,
  SigninDtoValidator,
  RefreshTokenDto,
  RefreshTokenDtoValidator,
} from './auth.dto';

/**
 * Auth Controller
 * Handles HTTP requests/responses for authentication operations
 * No business logic - delegates to service layer
 */
export class AuthController extends BaseController {
  private readonly authService: IAuthService;

  constructor(authService: IAuthService) {
    super();
    this.authService = authService;
  }

  /**
   * POST /auth/signup
   * Sign up a new user
   */
  public signup = this.asyncHandler(
    async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
      const signupDto: SignupDto = SignupDtoValidator.validate(req.body);
      const authResponse = await this.authService.signup(signupDto);

      this.sendSuccess(res, 201, 'Account created successfully', authResponse);
    }
  );

  /**
   * POST /auth/signin
   * Sign in an existing user
   */
  public signin = this.asyncHandler(
    async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
      const signinDto: SigninDto = SigninDtoValidator.validate(req.body);
      const authResponse = await this.authService.signin(signinDto);

      this.sendSuccess(res, 200, 'Signed in successfully', authResponse);
    }
  );

  /**
   * POST /auth/refresh
   * Refresh access token using refresh token
   */
  public refresh = this.asyncHandler(
    async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
      const refreshTokenDto: RefreshTokenDto = RefreshTokenDtoValidator.validate(req.body);
      const tokens = await this.authService.refreshToken(refreshTokenDto);

      this.sendSuccess(res, 200, 'Token refreshed successfully', tokens);
    }
  );
}

