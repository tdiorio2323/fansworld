import { User } from '../../src/domain/entities/User';
import { Role } from '../../src/domain/value-objects/Role';

describe('User Entity', () => {
  const mockUserProps = {
    id: 'user-123',
    email: 'test@example.com',
    username: 'testuser',
    role: Role.FAN,
    verified: true,
    createdAt: new Date(),
  };

  it('should create a user with valid properties', () => {
    const user = new User(mockUserProps);

    expect(user.id).toBe('user-123');
    expect(user.email).toBe('test@example.com');
    expect(user.username).toBe('testuser');
    expect(user.role).toBe(Role.FAN);
    expect(user.verified).toBe(true);
  });

  it('should check if user is verified', () => {
    const verifiedUser = new User({ ...mockUserProps, verified: true });
    const unverifiedUser = new User({ ...mockUserProps, verified: false });

    expect(verifiedUser.isVerified()).toBe(true);
    expect(unverifiedUser.isVerified()).toBe(false);
  });

  it('should check user role', () => {
    const adminUser = new User({ ...mockUserProps, role: Role.ADMIN });
    
    expect(adminUser.hasRole(Role.ADMIN)).toBe(true);
    expect(adminUser.hasRole(Role.FAN)).toBe(false);
  });

  it('should check role level', () => {
    const adminUser = new User({ ...mockUserProps, role: Role.ADMIN });
    const fanUser = new User({ ...mockUserProps, role: Role.FAN });

    expect(adminUser.isRoleAtLeast(Role.FAN)).toBe(true);
    expect(fanUser.isRoleAtLeast(Role.ADMIN)).toBe(false);
  });

  it('should create user using factory method', () => {
    const user = User.create({
      email: 'new@example.com',
      username: 'newuser',
      role: Role.CREATOR,
      verified: false
    });

    expect(user.email).toBe('new@example.com');
    expect(user.username).toBe('newuser');
    expect(user.role).toBe(Role.CREATOR);
    expect(user.verified).toBe(false);
    expect(user.id).toBeDefined();
    expect(user.createdAt).toBeInstanceOf(Date);
  });
});