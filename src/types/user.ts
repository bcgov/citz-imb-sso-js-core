/* eslint-disable no-unused-vars */
import type {
  BceidIdentityProvider,
  DigitalCredentialsIdentityProvider,
  GithubIdentityProvider,
  IdirIdentityProvider,
  SSOIdentityProvider,
} from './indentityProviders';
import { HasRolesOptions } from './options';

type BaseTokenPayload<TProvider extends SSOIdentityProvider | unknown> = {
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
export type VCPresentedAttributes<TDCAttributes extends object | undefined> =
  JsonString<TDCAttributes>;

export type SSODigitalCredentialsUser<TDCAttributes extends object | undefined> = {
  pres_req_conf_id: string;
  vc_presented_attributes: VCPresentedAttributes<TDCAttributes>;
};

// Define a mapping object for the different user types
type UserTypeMapping<TDCAttributes extends object | undefined> = {
  [Key in SSOIdentityProvider]: Key extends IdirIdentityProvider
    ? SSOIdirUser // Map IdirIdentityProvider to SSOIdirUser type
    : Key extends BceidIdentityProvider
      ? SSOBCeIDUser // Map BceidIdentityProvider to SSOBCeIDUser type
      : Key extends GithubIdentityProvider
        ? SSOGithubUser // Map GithubIdentityProvider to SSOGithubUser type
        : Key extends DigitalCredentialsIdentityProvider
          ? SSODigitalCredentialsUser<TDCAttributes> // Map DigitalCredentialsIdentityProvider to SSODigitalCredentialsUser type
          : never;
};

// Returns OriginalSSOUser type as a combination of BaseTokenPayload &
// the associated identity provider user as long as TProvider is a valid idp.
// If an invalid or unknown TProvider is provided, BaseTokenPayload<unknown> is returned.
export type OriginalSSOUser<
  TProvider extends SSOIdentityProvider | unknown,
  TDCAttributes extends object | undefined = undefined,
> = TProvider extends SSOIdentityProvider
  ? BaseTokenPayload<TProvider> & UserTypeMapping<TDCAttributes>[TProvider]
  : BaseTokenPayload<unknown>;

export type SSOUser<
  TProvider extends SSOIdentityProvider | unknown,
  TDCAttributes extends object | undefined = undefined,
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
