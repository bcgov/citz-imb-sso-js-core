import {
  IDIR_IDENTITY_PROVIDERS,
  BCEID_IDENTITY_PROVIDERS,
  GITHUB_IDENTITY_PROVIDERS,
  DIGITAL_CREDENTIALS_IDENTITY_PROVIDERS,
} from '@/constants';

// Test suite for identity providers values
describe('Identity Providers Values', () => {
  // Test case: Ensure IDIR_IDENTITY_PROVIDERS has the correct values
  it('should contain the expected IDIR identity providers', () => {
    expect(IDIR_IDENTITY_PROVIDERS).toEqual(['idir', 'azureidir']);
  });

  // Test case: Ensure BCEID_IDENTITY_PROVIDERS has the correct values
  it('should contain the expected BCEID identity providers', () => {
    expect(BCEID_IDENTITY_PROVIDERS).toEqual(['bceidbasic', 'bceidbusiness', 'bceidboth']);
  });

  // Test case: Ensure GITHUB_IDENTITY_PROVIDERS has the correct values
  it('should contain the expected GitHub identity providers', () => {
    expect(GITHUB_IDENTITY_PROVIDERS).toEqual(['githubbcgov']);
  });

  // Test case: Ensure DIGITAL_CREDENTIALS_IDENTITY_PROVIDERS has the correct values
  it('should contain the expected Digital Credentials identity providers', () => {
    expect(DIGITAL_CREDENTIALS_IDENTITY_PROVIDERS).toEqual(['digitalcredential']);
  });
});
