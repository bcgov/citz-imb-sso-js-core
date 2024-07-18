/* eslint-disable no-unused-vars */
import type {
  BceidIdentityProvider,
  DigitalCredentialsIdentityProvider,
  GithubIdentityProvider,
  IdirIdentityProvider,
  SSOIdentityProvider,
} from './indentityProviders';
import { HasRolesOptions } from './options';

type BaseTokenPayload<TProvider extends SSOIdentityProvider> = {
  exp: number;
  iat: number;
  auth_time: number;
  jti: string;
  iss: string;
  aud: string;
  sub: string;
  typ: string;
  azp: string;
  nonce: string;
  session_state: string;
  scope?: string;
  at_hash?: string;
  sid: string;
  identity_provider: TProvider;
  email_verified: boolean;
  name: string;
  preferred_username: string;
  display_name: string;
  given_name: string;
  family_name: string;
  email: string;
  client_roles?: string[];
};

export type SSOIdirUser = {
  idir_user_guid: string;
  idir_username: string;
};

export type SSOBCeIDUser = {
  bceid_user_guid: string;
  bceid_username: string;
  bceid_business_name?: string;
};

export type SSOGithubUser = {
  github_id: string;
  github_username: string;
  orgs: string;
  org_verified: string;
};

export type SSODigitalCredentialsUser = {
  vc_presented_attributes: Record<string, string>;
};

export type OriginalSSOUser<TProvider extends SSOIdentityProvider> =
  TProvider extends IdirIdentityProvider
    ? SSOIdirUser
    : TProvider extends BceidIdentityProvider
      ? SSOBCeIDUser
      : TProvider extends GithubIdentityProvider
        ? SSOGithubUser
        : TProvider extends DigitalCredentialsIdentityProvider
          ? SSODigitalCredentialsUser
          : never;

export type SSOUser<TProvider extends SSOIdentityProvider> = BaseTokenPayload<TProvider> & {
  guid: string;
  username: string;
  first_name: string;
  last_name: string;
  originalTokenPayload: OriginalSSOUser<TProvider>;
  hasRoles: (roles: string[], options?: HasRolesOptions) => boolean;
};
