export type IdirIdentityProvider = 'idir' | 'azureidir';
export type BceidIdentityProvider = 'bceidbasic' | 'bceidbusiness' | 'bceidboth';
export type GithubIdentityProvider = 'githubbcgov';
export type DigitalCredentialsIdentityProvider = 'digitalcredential';

export type SSOIdentityProvider =
  | IdirIdentityProvider
  | BceidIdentityProvider
  | GithubIdentityProvider
  | DigitalCredentialsIdentityProvider;
