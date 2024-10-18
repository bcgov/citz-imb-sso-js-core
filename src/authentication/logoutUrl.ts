import type { GetLogoutURLProps } from '../types';
import { AUTH_URLS, SITE_MINDER_LOGOUT_URLS } from '../constants';

export const getLogoutURL = (props: GetLogoutURLProps): string => {
  const {
    idToken,
    postLogoutRedirectURI,
    ssoEnvironment = 'dev',
    ssoRealm = 'standard',
    ssoProtocol = 'openid-connect',
  } = props;

  const authURL = `${AUTH_URLS[ssoEnvironment]}/realms/${ssoRealm}/protocol/${ssoProtocol}`;

  const keycloakParams: Record<string, string> = {
    id_token_hint: idToken,
    post_logout_redirect_uri: encodeURIComponent(postLogoutRedirectURI),
  };

  const kcQueryString = Object.keys(keycloakParams)
    .map((key) => `${key}=${keycloakParams[key]}`)
    .join('&');

  const siteMinderParams: Record<string, unknown> = {
    retnow: 1,
    returl: encodeURIComponent(`${authURL}/logout?${kcQueryString}`),
  };

  const smQueryString = Object.keys(siteMinderParams)
    .map((key) => `${key}=${siteMinderParams[key]}`)
    .join('&');

  return `${SITE_MINDER_LOGOUT_URLS[ssoEnvironment]}?${smQueryString}`;
};
