import {
  BCEID_IDENTITY_PROVIDERS,
  DIGITAL_CREDENTIALS_IDENTITY_PROVIDERS,
  GITHUB_IDENTITY_PROVIDERS,
  IDIR_IDENTITY_PROVIDERS,
} from '../constants';

export type IdirIdentityProvider = (typeof IDIR_IDENTITY_PROVIDERS)[number];
export type BceidIdentityProvider = (typeof BCEID_IDENTITY_PROVIDERS)[number];
export type GithubIdentityProvider = (typeof GITHUB_IDENTITY_PROVIDERS)[number];
export type DigitalCredentialsIdentityProvider =
  (typeof DIGITAL_CREDENTIALS_IDENTITY_PROVIDERS)[number];
export type ClientIDProvider = string & { readonly brand: unique symbol };

export type SSOIdentityProvider =
  | IdirIdentityProvider
  | BceidIdentityProvider
  | GithubIdentityProvider
  | DigitalCredentialsIdentityProvider
  | ClientIDProvider;
