import qs from 'querystring';
import { GetLogoutURLProps } from '../types';
import { AUTH_URLS, SITE_MINDER_LOGOUT_URLS } from '../constants';

export const getLogoutURL = (props: GetLogoutURLProps): string => {
  const {
    idToken,
    postLogoutRedirectURI,
    ssoEnvironment = 'dev',
    ssoRealm = 'standard',
    ssoProtocol = 'oidc',
  } = props;

  const authURL = `${AUTH_URLS[ssoEnvironment]}/realms/${ssoRealm}/protocol/${ssoProtocol}`;

  const keycloakParams = {
    id_token_hint: idToken,
    post_logout_redirect_uri: encodeURIComponent(postLogoutRedirectURI),
  };

  const siteMinderParams = {
    retnow: 1,
    returl: encodeURIComponent(`${authURL}/logout?${qs.stringify(keycloakParams)}`),
  };

  return `${SITE_MINDER_LOGOUT_URLS[ssoEnvironment]}?${qs.stringify(siteMinderParams)}`;
};
