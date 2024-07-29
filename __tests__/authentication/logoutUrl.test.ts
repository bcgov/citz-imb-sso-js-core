import querystring from 'querystring';
import { getLogoutURL } from '@/authentication';
import { AUTH_URLS, SITE_MINDER_LOGOUT_URLS } from '@/constants';
import { GetLogoutURLProps } from '@/types';

describe('getLogoutURL', () => {
  it('should return the correct URL for the dev environment with default parameters', () => {
    const props: GetLogoutURLProps = {
      idToken: 'sample-id-token',
      postLogoutRedirectURI: 'https://myapp.com/logout',
    };

    const keycloakParams = {
      id_token_hint: props.idToken,
      post_logout_redirect_uri: encodeURIComponent(props.postLogoutRedirectURI),
    };

    const authURL = `${AUTH_URLS.dev}/realms/standard/protocol/oidc`;
    const siteMinderParams = {
      retnow: 1,
      returl: encodeURIComponent(`${authURL}/logout?${querystring.stringify(keycloakParams)}`),
    };

    const expectedURL = `${SITE_MINDER_LOGOUT_URLS.dev}?${querystring.stringify(siteMinderParams)}`;

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

    const keycloakParams = {
      id_token_hint: props.idToken,
      post_logout_redirect_uri: encodeURIComponent(props.postLogoutRedirectURI),
    };

    const authURL = `${AUTH_URLS.test}/realms/custom/protocol/saml`;
    const siteMinderParams = {
      retnow: 1,
      returl: encodeURIComponent(`${authURL}/logout?${querystring.stringify(keycloakParams)}`),
    };

    const expectedURL = `${SITE_MINDER_LOGOUT_URLS.test}?${querystring.stringify(siteMinderParams)}`;

    expect(getLogoutURL(props)).toBe(expectedURL);
  });

  it('should return the correct URL for the prod environment with specified parameters', () => {
    const props: GetLogoutURLProps = {
      idToken: 'sample-id-token',
      postLogoutRedirectURI: 'https://prodapp.com/logout',
      ssoEnvironment: 'prod',
      ssoRealm: 'other',
      ssoProtocol: 'oidc',
    };

    const keycloakParams = {
      id_token_hint: props.idToken,
      post_logout_redirect_uri: encodeURIComponent(props.postLogoutRedirectURI),
    };

    const authURL = `${AUTH_URLS.prod}/realms/other/protocol/oidc`;
    const siteMinderParams = {
      retnow: 1,
      returl: encodeURIComponent(`${authURL}/logout?${querystring.stringify(keycloakParams)}`),
    };

    const expectedURL = `${SITE_MINDER_LOGOUT_URLS.prod}?${querystring.stringify(siteMinderParams)}`;

    expect(getLogoutURL(props)).toBe(expectedURL);
  });

  it('should correctly handle special characters in URLs', () => {
    const props: GetLogoutURLProps = {
      idToken: 'sample-id-token',
      postLogoutRedirectURI: 'https://myapp.com/logout?param=value&other=value',
      ssoEnvironment: 'dev',
    };

    const keycloakParams = {
      id_token_hint: props.idToken,
      post_logout_redirect_uri: encodeURIComponent(props.postLogoutRedirectURI),
    };

    const authURL = `${AUTH_URLS.dev}/realms/standard/protocol/oidc`;
    const siteMinderParams = {
      retnow: 1,
      returl: encodeURIComponent(`${authURL}/logout?${querystring.stringify(keycloakParams)}`),
    };

    const expectedURL = `${SITE_MINDER_LOGOUT_URLS.dev}?${querystring.stringify(siteMinderParams)}`;

    expect(getLogoutURL(props)).toBe(expectedURL);
  });
});
