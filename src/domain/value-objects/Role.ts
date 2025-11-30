import { ValueObject } from './ValueObject';

export interface RoleProps {
  value: 'fan' | 'creator' | 'moderator' | 'admin';
}

export class Role extends ValueObject<RoleProps> {
  constructor(props: RoleProps) {
    super(props);
  }

  get value(): RoleProps['value'] {
    return this.props.value;
  }

  static FAN = new Role({ value: 'fan' });
  static CREATOR = new Role({ value: 'creator' });
  static MODERATOR = new Role({ value: 'moderator' });
  static ADMIN = new Role({ value: 'admin' });

  static create(value: RoleProps['value']): Role {
    return new Role({ value });
  }

  /**
   * Check if this role is at least as elevated as the specified role
   */
  isAtLeast(otherRole: Role): boolean {
    const roleHierarchy = {
      'fan': 1,
      'creator': 2,
      'moderator': 3,
      'admin': 4
    };

    return roleHierarchy[this.props.value] >= roleHierarchy[otherRole.props.value];
  }
}