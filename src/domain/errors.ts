export abstract class DomainError extends Error {
  public readonly name: string;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class UserNotFoundError extends DomainError {
  constructor(userId: string) {
    super(`User with ID ${userId} not found`);
  }
}

export class ContentNotFoundError extends DomainError {
  constructor(contentId: string) {
    super(`Content with ID ${contentId} not found`);
  }
}

export class CreatorNotFoundError extends DomainError {
  constructor(creatorId: string) {
    super(`Creator with ID ${creatorId} not found`);
  }
}

export class UnauthorizedError extends DomainError {
  constructor(message: string = 'Unauthorized access') {
    super(message);
  }
}

export class ValidationError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}