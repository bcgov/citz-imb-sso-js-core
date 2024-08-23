import { getLoginURL } from '@/authentication';
import { AUTH_URLS } from '@/constants';
import { GetLoginURLProps } from '@/types';

describe('getLoginURL', () => {
  it('should return the correct URL for the dev environment with default parameters', () => {
    const props: GetLoginURLProps = {
      idpHint: 'idir',
      clientID: 'my-client-id',
      redirectURI: 'https://myapp.com/callback',
    };

    const params: Record<string, string> = {
      client_id: props.clientID,
      response_type: 'code',
      scope: 'email+openid',
      redirect_uri: props.redirectURI,
      kc_idp_hint: props.idpHint,
    };

    const queryString = Object.keys(params)
      .map((key) => `${key}=${params[key]}`)
      .join('&');

    const expectedURL = `${AUTH_URLS.dev}/realms/standard/protocol/openid-connect/auth?${queryString}`;

    expect(getLoginURL(props)).toBe(expectedURL);
  });

  it('should return the correct URL for the test environment with specified parameters', () => {
    const props: GetLoginURLProps = {
      idpHint: 'bceidbasic',
      clientID: 'test-client-id',
      responseType: 'token',
      scope: 'profile+openid',
      redirectURI: 'https://testapp.com/callback',
      ssoEnvironment: 'test',
      ssoRealm: 'custom',
      ssoProtocol: 'saml',
    };

    const params: Record<string, unknown> = {
      client_id: props.clientID,
      response_type: props.responseType,
      scope: props.scope,
      redirect_uri: props.redirectURI,
      kc_idp_hint: props.idpHint,
    };

    const queryString = Object.keys(params)
      .map((key) => `${key}=${params[key]}`)
      .join('&');

    const expectedURL = `${AUTH_URLS.test}/realms/custom/protocol/saml/auth?${queryString}`;

    expect(getLoginURL(props)).toBe(expectedURL);
  });

  it('should return the correct URL for the prod environment with specified parameters', () => {
    const props: GetLoginURLProps = {
      idpHint: 'bceidbusiness',
      clientID: 'prod-client-id',
      responseType: 'id_token',
      scope: 'email profile',
      redirectURI: 'https://prodapp.com/callback',
      ssoEnvironment: 'prod',
      ssoRealm: 'other',
      ssoProtocol: 'openid-connect',
    };

    const params: Record<string, unknown> = {
      client_id: props.clientID,
      response_type: props.responseType,
      scope: props.scope,
      redirect_uri: props.redirectURI,
      kc_idp_hint: props.idpHint,
    };

    const queryString = Object.keys(params)
      .map((key) => `${key}=${params[key]}`)
      .join('&');

    const expectedURL = `${AUTH_URLS.prod}/realms/other/protocol/openid-connect/auth?${queryString}`;

    expect(getLoginURL(props)).toBe(expectedURL);
  });

  it('should return the correct URL with default scope and responseType', () => {
    const props: GetLoginURLProps = {
      idpHint: 'idir',
      clientID: 'client-id',
      redirectURI: 'https://myapp.com/callback',
      ssoEnvironment: 'dev',
    };

    const params: Record<string, unknown> = {
      client_id: props.clientID,
      response_type: 'code',
      scope: 'email+openid',
      redirect_uri: props.redirectURI,
      kc_idp_hint: props.idpHint,
    };

    const queryString = Object.keys(params)
      .map((key) => `${key}=${params[key]}`)
      .join('&');

    const expectedURL = `${AUTH_URLS.dev}/realms/standard/protocol/openid-connect/auth?${queryString}`;

    expect(getLoginURL(props)).toBe(expectedURL);
  });
});
