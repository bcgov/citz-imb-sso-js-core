import { AUTH_URLS, DEV_AUTH_URL, PROD_AUTH_URL, TEST_AUTH_URL } from '../constants';
import { SSOIdentityProvider } from './indentityProviders';

export type AuthURL = typeof DEV_AUTH_URL | typeof TEST_AUTH_URL | typeof PROD_AUTH_URL;
export type SSOEnvironment = 'dev' | 'test' | 'prod';
export type SSOProtocol = 'openid-connect' | 'saml';

type AuthURLMap = typeof AUTH_URLS;
export type AuthURLForEnv<TEnvironment extends keyof AuthURLMap> = AuthURLMap[TEnvironment];

type SiteMinderLogoutURLMap = typeof AUTH_URLS;
export type SiteMinderLogoutURLForEnv<TEnvironment extends keyof SiteMinderLogoutURLMap> =
  SiteMinderLogoutURLMap[TEnvironment];

export type GetLoginURLProps = {
  idpHint: SSOIdentityProvider;
  clientID: string;
  responseType?: string;
  scope?: string;
  redirectURI: string;
  ssoEnvironment?: SSOEnvironment;
  ssoRealm?: string;
  ssoProtocol?: SSOProtocol;
};

export type GetLogoutURLProps = {
  idToken: string;
  postLogoutRedirectURI: string;
  ssoEnvironment?: SSOEnvironment;
  ssoRealm?: string;
  ssoProtocol?: SSOProtocol;
};

export type GetTokensProps = {
  code: string;
  grantType?: string;
  clientID: string;
  clientSecret: string;
  redirectURI: string;
  ssoEnvironment?: SSOEnvironment;
  ssoRealm?: string;
  ssoProtocol?: SSOProtocol;
};

export type GetNewTokensProps = {
  refreshToken: string;
  clientID: string;
  clientSecret: string;
  ssoEnvironment?: SSOEnvironment;
  ssoRealm?: string;
  ssoProtocol?: SSOProtocol;
};

export type IsJWTValidProps = {
  jwt: string;
  clientID: string;
  clientSecret: string;
  ssoEnvironment?: SSOEnvironment;
  ssoRealm?: string;
  ssoProtocol?: SSOProtocol;
};

export type GetTokensResponse = {
  id_token: string;
  access_token: string;
  refresh_token: string;
  refresh_expires_in: number;
};

export type GetNewTokensResponse = {
  access_token: string;
  id_token: string;
  expires_in: number;
} | null;
