import querystring from 'querystring';
import { GetTokensProps } from '../types';
import { AUTH_URLS } from '../constants';

/**
 * Gets decoded tokens and user information using a code.
 * See https://datatracker.ietf.org/doc/html/rfc6749#section-4.1.3
 */
export const getTokens = async (props: GetTokensProps) => {
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
    body: querystring.stringify(params),
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
