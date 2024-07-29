import { HasRolesOptions } from '@/types';
import { hasRoles } from '@/user';
import { mockUser, MockOriginalSSOUser } from '../mocks';

describe('hasRoles function', () => {
  // Test suite for function behavior with default options
  describe('default options (requireAllRoles = false)', () => {
    // Test case: user has at least one of the required roles
    it('should return true if user has at least one of the required roles', () => {
      expect(hasRoles(mockUser, ['role1', 'role4'])).toBe(true);
    });

    // Test case: user does not have any of the required roles
    it('should return false if user does not have any of the required roles', () => {
      expect(hasRoles(mockUser, ['role4', 'role5'])).toBe(false);
    });
  });

  // Test suite for function behavior with requireAllRoles = true
  describe('options.requireAllRoles = true', () => {
    const options: HasRolesOptions = { requireAllRoles: true };

    // Test case: user has all the required roles
    it('should return true if user has all the required roles', () => {
      expect(hasRoles(mockUser, ['role1', 'role2'], options)).toBe(true);
    });

    // Test case: user does not have all the required roles
    it('should return false if user does not have all the required roles', () => {
      expect(hasRoles(mockUser, ['role1', 'role4'], options)).toBe(false);
    });
  });

  // Test suite for edge cases
  describe('edge cases', () => {
    // Test case: user has no roles
    it('should return false if user has no roles', () => {
      const userWithNoRoles = { ...mockUser, client_roles: [] };
      expect(hasRoles(userWithNoRoles, ['role1'])).toBe(false);
    });

    // Test case: roles argument is not an array
    it('should throw an error if roles is not an array', () => {
      // @ts-expect-error - Test for invalid type.
      expect(() => hasRoles(mockUser, 'role1')).toThrow(
        `Error: hasRoles function of 'citz-imb-sso-js-core' - Received roles as type string, but expected string[].`,
      );
    });

    // Test case: roles array contains non-string elements
    it('should throw an error if roles array contains non-string elements', () => {
      // @ts-expect-error - Test for invalid type.
      expect(() => hasRoles(mockUser, ['role1', 123])).toThrow(
        `Error: hasRoles function of 'citz-imb-sso-js-core' - Received roles as type object, but expected string[].`,
      );
    });

    // Test case: user argument is undefined
    it('should return false if user is undefined', () => {
      expect(hasRoles(undefined as unknown as MockOriginalSSOUser, ['role1'])).toBe(false);
    });
  });
});
