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
  scope?: string | undefined;
  at_hash?: string | undefined;
  sid: string;
  identity_provider: TProvider;
  email_verified: boolean;
  preferred_username: string;
  client_roles?: string[] | undefined;
};

export type SSOIdirUser = {
  idir_user_guid: string;
  idir_username: string;
  name: string;
  display_name: string;
  given_name: string;
  family_name: string;
  email: string;
};

export type SSOBCeIDUser = {
  bceid_user_guid: string;
  bceid_username: string;
  bceid_business_name?: string;
  name: string;
  display_name: string;
  given_name: string;
  family_name: string;
  email: string;
};

export type SSOGithubUser = {
  github_id: string;
  github_username: string;
  orgs: string;
  org_verified: string;
  name: string;
  display_name: string;
  given_name: string;
  family_name: string;
  email: string;
};

type JsonString<T> = string & { __jsonString: T };
export type VCPresentedAttributes<TDCAttributes extends string | undefined> =
  JsonString<TDCAttributes>;

export type SSODigitalCredentialsUser<TDCAttributes extends string | undefined> = {
  pres_req_conf_id: string;
  vc_presented_attributes: VCPresentedAttributes<TDCAttributes>;
};

export type OriginalSSOUser<
  TProvider extends SSOIdentityProvider,
  TDCAttributes extends string | undefined = undefined,
> = TProvider extends IdirIdentityProvider
  ? BaseTokenPayload<IdirIdentityProvider> & SSOIdirUser
  : TProvider extends BceidIdentityProvider
    ? BaseTokenPayload<BceidIdentityProvider> & SSOBCeIDUser
    : TProvider extends GithubIdentityProvider
      ? BaseTokenPayload<GithubIdentityProvider> & SSOGithubUser
      : TProvider extends DigitalCredentialsIdentityProvider
        ? BaseTokenPayload<DigitalCredentialsIdentityProvider> &
            SSODigitalCredentialsUser<TDCAttributes>
        : never;

export type SSOUser<
  TProvider extends SSOIdentityProvider,
  TDCAttributes extends string | undefined = undefined,
> = BaseTokenPayload<TProvider> & {
  guid: string;
  username: string;
  display_name?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  originalTokenPayload: OriginalSSOUser<TProvider, TDCAttributes>;
  hasRoles: (roles: string[], options?: HasRolesOptions) => boolean;
};
