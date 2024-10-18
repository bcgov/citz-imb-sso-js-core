/* eslint-disable no-unused-vars */ 
import type { SSOIdentityProvider } from './indentityProviders';
import { HasRolesOptions } from './options';

export type IntegerAsString = `${number}` & `${bigint}`; // Accepts integers as a string type.
export type BooleanAsString = `${boolean}`; // Accepts boolean (true | false) as a string type.

export type BaseTokenPayload<TProvider extends SSOIdentityProvider | unknown> = {
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

export type SSOBCServicesCardUser = {
  display_name?: string;
  given_name?: string;
  family_name?: string;
  given_names?: string;
  email?: string;
  gender?: string;
  region?: string;
  street_address?: string;
  locality?: string;
  address?: string;
  postal_code?: string;
  country?: string;
  age?: IntegerAsString;
  age_19_or_over?: BooleanAsString;
  birthdate?: string;
  authentication_zone_identifier?: string;
  user_type?: 'Individual' | 'VerifiedIndividual';
  transaction_type?: string;
  identity_assurance_level1?: BooleanAsString;
  identity_assurance_level2?: BooleanAsString;
  identity_assurance_level3?: BooleanAsString;
  authoritative_party_name?: string;
  transaction_identifier?: string;
  sector_identifier_uri?: string;
  identification_level?: IntegerAsString;
  identity_assurance_level?: IntegerAsString;
  authoritative_party_identifier?: string;
};

type JsonString<T> = string & { __jsonString: T };
export type VCPresentedAttributes<TDCAttributes extends object | undefined> =
  JsonString<TDCAttributes>;

export type SSODigitalCredentialsUser<TDCAttributes extends object | undefined> = {
  pres_req_conf_id: string;
  vc_presented_attributes: VCPresentedAttributes<TDCAttributes>;
};

// Mapping between identity providers and their corresponding user types
type UserTypeMappingTable<TDCAttributes extends object | undefined = undefined> = {
  idir: SSOIdirUser;
  azureidir: SSOIdirUser;
  bceidbasic: SSOBCeIDUser;
  bceidbusiness: SSOBCeIDUser;
  bceidboth: SSOBCeIDUser;
  githubbcgov: SSOGithubUser;
  digitalcredential: SSODigitalCredentialsUser<TDCAttributes>;
};

type UserTypeMapping<
  TProvider extends SSOIdentityProvider,
  TDCAttributes extends object | undefined = undefined,
> = TProvider extends keyof UserTypeMappingTable<TDCAttributes>
  ? UserTypeMappingTable<TDCAttributes>[TProvider]
  : SSOBCServicesCardUser;

// Returns OriginalSSOUser type as a combination of BaseTokenPayload &
// the associated identity provider user as long as TProvider is a valid idp.
// If an invalid or unknown TProvider is provided, BaseTokenPayload<unknown> is returned.
export type OriginalSSOUser<
  TProvider extends SSOIdentityProvider | unknown,
  TDCAttributes extends object | undefined = undefined,
> = TProvider extends SSOIdentityProvider
  ? BaseTokenPayload<TProvider> & UserTypeMapping<TProvider, TDCAttributes>
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
