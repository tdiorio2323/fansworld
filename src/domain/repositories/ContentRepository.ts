import { Content } from '../entities/Content';

export interface ContentRepository {
  findById(id: string): Promise<Content | null>;
  findByCreatorId(creatorId: string): Promise<Content[]>;
  findByAccessLevel(accessLevel: string): Promise<Content[]>;
  create(content: Content): Promise<Content>;
  update(content: Content): Promise<Content>;
  delete(id: string): Promise<void>;
  publishContent(id: string): Promise<Content | null>;
  unpublishContent(id: string): Promise<Content | null>;
}