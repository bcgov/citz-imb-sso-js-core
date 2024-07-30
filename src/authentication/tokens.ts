import qs from 'querystring';
import {
  GetNewTokensProps,
  GetNewTokensResponse,
  GetTokensProps,
  GetTokensResponse,
} from '../types';
import { AUTH_URLS } from '../constants';
import { isJWTValid } from './isJWTValid';

/**
 * Gets decoded tokens and user information using a code.
 * See https://datatracker.ietf.org/doc/html/rfc6749#section-4.1.3
 */
export const getTokens = async (props: GetTokensProps): Promise<GetTokensResponse> => {
  const {
    code,
    grantType = 'authorization_code',
    clientID,
    clientSecret,
    redirectURI,
    ssoEnvironment = 'dev',
    ssoRealm = 'standard',
    ssoProtocol = 'oidc',
  } = props;

  const params = {
    grant_type: grantType,
    client_id: clientID,
    redirect_uri: redirectURI,
    code,
  };

  const encodedAuthHeader = Buffer.from(`${clientID}:${clientSecret}`).toString('base64');

  const headers = {
    Authorization: `Basic ${encodedAuthHeader}`,
    'Content-Type': 'application/x-www-form-urlencoded',
  };

  const authURL = `${AUTH_URLS[ssoEnvironment]}/realms/${ssoRealm}/protocol/${ssoProtocol}`;

  const response = await fetch(`${authURL}/token`, {
    method: 'POST',
    headers,
    body: qs.stringify(params),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch tokens: ${response.status} ${response.statusText}`);
  }

  const { id_token, access_token, refresh_token, refresh_expires_in } = await response.json();

  return {
    id_token,
    access_token,
    refresh_token,
    refresh_expires_in,
  };
};

export const getNewTokens = async (props: GetNewTokensProps): Promise<GetNewTokensResponse> => {
  const {
    refreshToken,
    clientID,
    clientSecret,
    ssoEnvironment = 'dev',
    ssoRealm = 'standard',
    ssoProtocol = 'oidc',
  } = props;

  const isTokenValid = await isJWTValid({ jwt: refreshToken, clientID, clientSecret });
  if (!isTokenValid) return null;

  const params = {
    grant_type: 'refresh_token',
    client_id: clientID,
    client_secret: clientSecret,
    refresh_token: refreshToken,
  };

  const authURL = `${AUTH_URLS[ssoEnvironment]}/realms/${ssoRealm}/protocol/${ssoProtocol}`;

  const response = await fetch(`${authURL}/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: qs.stringify(params),
  });

  const { access_token, id_token, expires_in } = await response.json();
  if (!access_token || !id_token)
    throw new Error("Couldn't get access or id token from KC token endpoint");

  return { access_token, id_token, expires_in };
};
