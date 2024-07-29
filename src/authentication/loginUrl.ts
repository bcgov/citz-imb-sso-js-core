import qs from 'querystring';
import { GetLoginURLProps } from '../types';
import { AUTH_URLS } from '../constants';

/**
 * Gets the authorization URL to redirect the user to the OIDC server for authentication.
 * See https://datatracker.ietf.org/doc/html/rfc6749#section-4.1.1
 */
export const getLoginURL = (props: GetLoginURLProps) => {
  const {
    idpHint,
    clientID,
    responseType = 'code',
    scope = 'email+openid',
    redirectURI,
    ssoEnvironment = 'dev',
    ssoRealm = 'standard',
    ssoProtocol = 'oidc',
  } = props;

  const authURL = `${AUTH_URLS[ssoEnvironment]}/realms/${ssoRealm}/protocol/${ssoProtocol}`;

  const params = {
    client_id: clientID,
    response_type: responseType,
    scope: scope,
    redirect_uri: encodeURIComponent(redirectURI),
    kc_idp_hint: idpHint,
  };

  return `${authURL}/auth?${qs.stringify(params)}`;
};
