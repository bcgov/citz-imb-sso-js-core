import { getLogoutURL } from '@/authentication';
import { AUTH_URLS, SITE_MINDER_LOGOUT_URLS } from '@/constants';
import { GetLogoutURLProps } from '@/types';

describe('getLogoutURL', () => {
  it('should return the correct URL for the dev environment with default parameters', () => {
    const props: GetLogoutURLProps = {
      idToken: 'sample-id-token',
      postLogoutRedirectURI: 'https://myapp.com/logout',
    };

    const keycloakParams: Record<string, unknown> = {
      id_token_hint: props.idToken,
      post_logout_redirect_uri: props.postLogoutRedirectURI,
    };

    const kcQueryString = Object.keys(keycloakParams)
      .map((key) => `${key}=${keycloakParams[key]}`)
      .join('&');

    const authURL = `${AUTH_URLS.dev}/realms/standard/protocol/openid-connect`;
    const siteMinderParams: Record<string, unknown> = {
      retnow: 1,
      returl: encodeURIComponent(`${authURL}/logout?${kcQueryString}`),
    };

    const smQueryString = Object.keys(siteMinderParams)
      .map((key) => `${key}=${siteMinderParams[key]}`)
      .join('&');

    const expectedURL = `${SITE_MINDER_LOGOUT_URLS.dev}?${smQueryString}`;

    expect(getLogoutURL(props)).toBe(expectedURL);
  });

  it('should return the correct URL for the test environment with specified parameters', () => {
    const props: GetLogoutURLProps = {
      idToken: 'sample-id-token',
      postLogoutRedirectURI: 'https://testapp.com/logout',
      ssoEnvironment: 'test',
      ssoRealm: 'custom',
      ssoProtocol: 'saml',
    };

    const keycloakParams: Record<string, unknown> = {
      id_token_hint: props.idToken,
      post_logout_redirect_uri: props.postLogoutRedirectURI,
    };

    const kcQueryString = Object.keys(keycloakParams)
      .map((key) => `${key}=${keycloakParams[key]}`)
      .join('&');

    const authURL = `${AUTH_URLS.test}/realms/custom/protocol/saml`;
    const siteMinderParams: Record<string, unknown> = {
      retnow: 1,
      returl: encodeURIComponent(`${authURL}/logout?${kcQueryString}`),
    };

    const smQueryString = Object.keys(siteMinderParams)
      .map((key) => `${key}=${siteMinderParams[key]}`)
      .join('&');

    const expectedURL = `${SITE_MINDER_LOGOUT_URLS.test}?${smQueryString}`;

    expect(getLogoutURL(props)).toBe(expectedURL);
  });

  it('should return the correct URL for the prod environment with specified parameters', () => {
    const props: GetLogoutURLProps = {
      idToken: 'sample-id-token',
      postLogoutRedirectURI: 'https://prodapp.com/logout',
      ssoEnvironment: 'prod',
      ssoRealm: 'other',
      ssoProtocol: 'openid-connect',
    };

    const keycloakParams: Record<string, unknown> = {
      id_token_hint: props.idToken,
      post_logout_redirect_uri: props.postLogoutRedirectURI,
    };

    const kcQueryString = Object.keys(keycloakParams)
      .map((key) => `${key}=${keycloakParams[key]}`)
      .join('&');

    const authURL = `${AUTH_URLS.prod}/realms/other/protocol/openid-connect`;
    const siteMinderParams: Record<string, unknown> = {
      retnow: 1,
      returl: encodeURIComponent(`${authURL}/logout?${kcQueryString}`),
    };

    const smQueryString = Object.keys(siteMinderParams)
      .map((key) => `${key}=${siteMinderParams[key]}`)
      .join('&');

    const expectedURL = `${SITE_MINDER_LOGOUT_URLS.prod}?${smQueryString}`;

    expect(getLogoutURL(props)).toBe(expectedURL);
  });

  it('should correctly handle special characters in URLs', () => {
    const props: GetLogoutURLProps = {
      idToken: 'sample-id-token',
      postLogoutRedirectURI: 'https://myapp.com/logout?param=value&other=value',
      ssoEnvironment: 'dev',
    };

    const keycloakParams: Record<string, unknown> = {
      id_token_hint: props.idToken,
      post_logout_redirect_uri: props.postLogoutRedirectURI,
    };

    const kcQueryString = Object.keys(keycloakParams)
      .map((key) => `${key}=${keycloakParams[key]}`)
      .join('&');

    const authURL = `${AUTH_URLS.dev}/realms/standard/protocol/openid-connect`;
    const siteMinderParams: Record<string, unknown> = {
      retnow: 1,
      returl: encodeURIComponent(`${authURL}/logout?${kcQueryString}`),
    };

    const smQueryString = Object.keys(siteMinderParams)
      .map((key) => `${key}=${siteMinderParams[key]}`)
      .join('&');

    const expectedURL = `${SITE_MINDER_LOGOUT_URLS.dev}?${smQueryString}`;

    expect(getLogoutURL(props)).toBe(expectedURL);
  });
});
