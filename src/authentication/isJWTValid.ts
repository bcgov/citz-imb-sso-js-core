import qs from 'querystring';
import { AUTH_URLS } from '../constants';
import { IsJWTValidProps } from '../types';

export const isJWTValid = async (props: IsJWTValidProps): Promise<boolean> => {
  const {
    jwt,
    clientID,
    clientSecret,
    ssoEnvironment = 'dev',
    ssoRealm = 'standard',
    ssoProtocol = 'openid-connect',
  } = props;

  const params = {
    client_id: clientID,
    client_secret: clientSecret,
    token: jwt,
  };

  const headers = {
    Accept: '*/*',
    'Content-Type': 'application/x-www-form-urlencoded',
  };

  const authURL = `${AUTH_URLS[ssoEnvironment]}/realms/${ssoRealm}/protocol/${ssoProtocol}`;

  const response = await fetch(`${authURL}/token/introspect`, {
    method: 'POST',
    headers,
    body: qs.stringify(params),
  });

  if (!response.ok)
    throw new Error(`Failed to validate JWT: ${response.status} ${response.statusText}`);

  const { active } = await response.json();
  return active;
};
