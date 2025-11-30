import { ValueObject } from '../value-objects/ValueObject';
import { Role } from '../value-objects/Role';

export interface UserProps {
  id: string;
  email: string;
  username: string;
  role: Role;
  verified: boolean;
  createdAt: Date;
  lastLoginAt?: Date;
}

export class User extends ValueObject<UserProps> {
  constructor(props: UserProps) {
    super(props);
  }

  get id(): string {
    return this.props.id;
  }

  get email(): string {
    return this.props.email;
  }

  get username(): string {
    return this.props.username;
  }

  get role(): Role {
    return this.props.role;
  }

  get verified(): boolean {
    return this.props.verified;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get lastLoginAt(): Date | undefined {
    return this.props.lastLoginAt;
  }

  isVerified(): boolean {
    return this.props.verified;
  }

  hasRole(role: Role): boolean {
    return this.props.role.equals(role);
  }

  isRoleAtLeast(minimumRole: Role): boolean {
    return this.props.role.isAtLeast(minimumRole);
  }

  // Factory method for creating a new user
  static create(props: Omit<UserProps, 'id' | 'createdAt'> & { id?: string }): User {
    return new User({
      ...props,
      id: props.id || `user_${Date.now()}`, // In real implementation, use UUID
      createdAt: new Date()
    });
  }
}