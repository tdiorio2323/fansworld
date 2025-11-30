import { Creator } from '../entities/Creator';

export interface CreatorRepository {
  findById(id: string): Promise<Creator | null>;
  findByUserId(userId: string): Promise<Creator | null>;
  findByUsername(username: string): Promise<Creator | null>;
  create(creator: Creator): Promise<Creator>;
  update(creator: Creator): Promise<Creator>;
  delete(id: string): Promise<void>;
}