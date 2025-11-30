import { Role } from '../../src/domain/value-objects/Role';

describe('Role Value Object', () => {
  it('should create a custom role', () => {
    const customRole = Role.create('admin');
    
    expect(customRole.value).toBe('admin');
  });

  it('should have predefined roles', () => {
    expect(Role.FAN.value).toBe('fan');
    expect(Role.CREATOR.value).toBe('creator');
    expect(Role.MODERATOR.value).toBe('moderator');
    expect(Role.ADMIN.value).toBe('admin');
  });

  it('should check role hierarchy correctly', () => {
    const adminRole = Role.ADMIN;
    const fanRole = Role.FAN;
    
    expect(adminRole.isAtLeast(fanRole)).toBe(true);
    expect(fanRole.isAtLeast(adminRole)).toBe(false);
    expect(adminRole.isAtLeast(adminRole)).toBe(true);
  });

  it('should compare roles for equality', () => {
    const role1 = Role.create('admin');
    const role2 = Role.create('admin');
    const role3 = Role.create('fan');
    
    expect(role1.equals(role2)).toBe(true);
    expect(role1.equals(role3)).toBe(false);
  });
});