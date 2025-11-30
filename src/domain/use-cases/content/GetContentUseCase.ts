import { Content } from '../entities/Content';
import { ContentRepository } from '../repositories/ContentRepository';
import { UserRepository } from '../repositories/UserRepository';
import { EntitlementService } from '../services/EntitlementService';
import { DomainError } from '../errors';

export interface GetContentUseCaseRequest {
  contentId: string;
  userId?: string;
}

export interface GetContentUseCaseResponse {
  content: Content;
  hasAccess: boolean;
}

export class GetContentUseCase {
  constructor(
    private contentRepository: ContentRepository,
    private userRepository: UserRepository,
    private entitlementService: EntitlementService
  ) {}

  async execute(request: GetContentUseCaseRequest): Promise<GetContentUseCaseResponse> {
    // Get content
    const content = await this.contentRepository.findById(request.contentId);
    if (!content) {
      throw new DomainError(`Content with ID ${request.contentId} not found`);
    }

    // Get user if provided
    let user = null;
    if (request.userId) {
      user = await this.userRepository.findById(request.userId);
      if (!user) {
        throw new DomainError(`User with ID ${request.userId} not found`);
      }
    }

    // Check access
    const hasAccess = await this.entitlementService.hasContentAccess(user || undefined, request.contentId, content.type as any);

    return {
      content,
      hasAccess
    };
  }
}