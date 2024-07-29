import { AUTH_URLS, DEV_AUTH_URL, PROD_AUTH_URL, TEST_AUTH_URL } from '../constants';
import { SSOIdentityProvider } from './indentityProviders';

export type AuthURL = typeof DEV_AUTH_URL | typeof TEST_AUTH_URL | typeof PROD_AUTH_URL;
export type SSOEnvironment = 'dev' | 'test' | 'prod';
export type SSOProtocol = 'oidc' | 'saml';

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
