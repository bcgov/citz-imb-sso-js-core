import { normalizeUser } from '@/user';
import {
  mockIdirUser,
  mockBceidUser,
  mockGithubUser,
  mockDigitalCredentialsUser,
  MockDCAttributes,
} from '../mocks';
import { SSOIdentityProvider } from '@/types';

describe('normalizeUser function', () => {
  // Test suite for IDIR users
  describe('IDIR users', () => {
    it('should normalize IDIR user properties', () => {
      const normalizedUser = normalizeUser(mockIdirUser);
      expect(normalizedUser.email).toBe(mockIdirUser.email);
      expect(normalizedUser.guid).toBe(mockIdirUser.idir_user_guid);
      expect(normalizedUser.username).toBe(mockIdirUser.idir_username);
      expect(normalizedUser.first_name).toBe(mockIdirUser.given_name);
      expect(normalizedUser.last_name).toBe(mockIdirUser.family_name);
    });

    it('should have the hasRoles property', () => {
      const normalizedUser = normalizeUser(mockIdirUser);
      expect(normalizedUser.hasRoles(['role1'])).toBe(true);
      expect(normalizedUser.hasRoles(['role4'])).toBe(false);
      expect(normalizedUser.hasRoles(['role1', 'role2'], { requireAllRoles: true })).toBe(true);
      expect(normalizedUser.hasRoles(['role1', 'role4'], { requireAllRoles: true })).toBe(false);
    });
  });

  // Test suite for BCeID users
  describe('BCeID users', () => {
    it('should normalize BCeID user properties', () => {
      const normalizedUser = normalizeUser(mockBceidUser);
      expect(normalizedUser.email).toBe(mockBceidUser.email);
      expect(normalizedUser.guid).toBe(mockBceidUser.bceid_user_guid);
      expect(normalizedUser.username).toBe(mockBceidUser.bceid_username);
      const nameParts = mockBceidUser.display_name.split(' ');
      expect(normalizedUser.first_name).toBe(nameParts[0]);
      expect(normalizedUser.last_name).toBe(nameParts.slice(1).join(' '));
    });
  });

  // Test suite for GitHub users
  describe('GitHub users', () => {
    it('should normalize GitHub user properties', () => {
      const normalizedUser = normalizeUser(mockGithubUser);
      expect(normalizedUser.email).toBe(mockGithubUser.email);
      expect(normalizedUser.guid).toBe(mockGithubUser.github_id);
      expect(normalizedUser.username).toBe(mockGithubUser.github_username);
      const nameParts = mockGithubUser.display_name.split(' ');
      expect(normalizedUser.first_name).toBe(nameParts[0]);
      expect(normalizedUser.last_name).toBe(nameParts.slice(1).join(' '));
    });
  });

  // Test suite for Digital Credentials users
  describe('Digital Credentials users', () => {
    it('should normalize Digital Credentials user properties', () => {
      const normalizedUser = normalizeUser<SSOIdentityProvider, MockDCAttributes>(
        mockDigitalCredentialsUser,
      );
      const attributes = JSON.parse(mockDigitalCredentialsUser.vc_presented_attributes);
      expect(normalizedUser.guid).toBe(mockDigitalCredentialsUser.preferred_username.split('@')[0]);
      expect(normalizedUser.email).toBe(attributes.email);
    });

    it('should handle users without client roles', () => {
      const normalizedUser = normalizeUser<SSOIdentityProvider, MockDCAttributes>(
        mockDigitalCredentialsUser,
      );
      expect(normalizedUser.client_roles).toEqual([]);
    });
  });
});
