import { Request, Response } from 'express';
import { RegisterUserUseCase } from '../../domain/use-cases/auth/RegisterUserUseCase';
import { LoginUserUseCase } from '../../domain/use-cases/auth/LoginUserUseCase';
import { GetContentUseCase } from '../../domain/use-cases/content/GetContentUseCase';
import { logger } from '../../lib/security-enhanced';
import { Service, Inject } from '../../infrastructure/container/Container';

@Service()
export class AuthController {
  constructor(
    @Inject('registerUserUseCase') private registerUserUseCase: RegisterUserUseCase,
    @Inject('loginUserUseCase') private loginUserUseCase: LoginUserUseCase
  ) {}

  async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, username } = req.body;

      const result = await this.registerUserUseCase.execute({
        email,
        password,
        username
      });

      res.status(201).json({
        message: 'Registration successful',
        user: {
          id: result.user.id,
          email: result.user.email,
          username: result.user.username,
          role: result.user.role.value,
          verified: result.user.verified
        },
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        correlationId: req.correlationId
      });
    } catch (error) {
      logger.error('Registration error', {
        error,
        correlationId: req.correlationId
      });

      res.status(400).json({
        error: 'registration_failed',
        message: error instanceof Error ? error.message : 'Registration failed',
        correlationId: req.correlationId
      });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      const result = await this.loginUserUseCase.execute({
        email,
        password
      });

      res.json({
        message: 'Login successful',
        user: {
          id: result.user.id,
          email: result.user.email,
          username: result.user.username,
          role: result.user.role.value,
          verified: result.user.verified
        },
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        correlationId: req.correlationId
      });
    } catch (error) {
      logger.error('Login error', {
        error,
        correlationId: req.correlationId
      });

      res.status(401).json({
        error: 'invalid_credentials',
        message: error instanceof Error ? error.message : 'Invalid email or password',
        correlationId: req.correlationId
      });
    }
  }
}

@Service()
export class ContentController {
  constructor(
    @Inject('getContentUseCase') private getContentUseCase: GetContentUseCase
  ) {}

  async getContent(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      // Get user from request (assuming authentication middleware has set req.user)
      const userId = req.user?.id;

      const result = await this.getContentUseCase.execute({
        contentId: id,
        userId
      });

      res.json({
        content: {
          id: result.content.id,
          creatorId: result.content.creatorId,
          title: result.content.title,
          description: result.content.description,
          type: result.content.type,
          accessLevel: result.content.accessLevel.value,
          price: result.content.price,
          subscriptionTierRequired: result.content.subscriptionTierRequired,
          contentUrl: result.content.contentUrl,
          thumbnailUrl: result.content.thumbnailUrl,
          isPublished: result.content.isPublished,
          createdAt: result.content.createdAt,
          publishedAt: result.content.publishedAt
        },
        hasAccess: result.hasAccess,
        correlationId: req.correlationId
      });
    } catch (error) {
      logger.error('Get content error', {
        contentId: req.params.id,
        error,
        correlationId: req.correlationId
      });

      res.status(404).json({
        error: 'content_not_found',
        message: error instanceof Error ? error.message : 'Content not found',
        correlationId: req.correlationId
      });
    }
  }
}