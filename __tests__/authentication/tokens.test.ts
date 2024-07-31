import querystring from 'querystring';
import { getNewTokens, getTokens, isJWTValid } from '@/authentication';
import { AUTH_URLS } from '@/constants';
import { GetNewTokensProps, GetTokensProps } from '@/types';

// Cast the fetch function to jest.Mock
const fetchMock = jest.fn() as jest.Mock;

// Replace the global fetch with the mock
global.fetch = fetchMock;

describe('getTokens', () => {
  beforeEach(() => {
    fetchMock.mockClear();
  });

  it('should return decoded tokens and user information for valid input', async () => {
    const mockResponse = {
      id_token: 'mock-id-token',
      access_token: 'mock-access-token',
      refresh_token: 'mock-refresh-token',
      refresh_expires_in: 3600,
    };

    fetchMock.mockResolvedValueOnce({
      json: async () => mockResponse,
      ok: true,
    } as Response);

    const props: GetTokensProps = {
      code: 'mock-code',
      clientID: 'mock-client-id',
      clientSecret: 'mock-client-secret',
      redirectURI: 'https://myapp.com/callback',
    };

    const result = await getTokens(props);

    expect(result).toEqual(mockResponse);

    const expectedParams = {
      grant_type: 'authorization_code',
      client_id: props.clientID,
      redirect_uri: props.redirectURI,
      code: props.code,
    };

    const expectedAuthHeader = Buffer.from(`${props.clientID}:${props.clientSecret}`).toString(
      'base64',
    );

    expect(fetchMock).toHaveBeenCalledWith(`${AUTH_URLS.dev}/realms/standard/protocol/oidc/token`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${expectedAuthHeader}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: querystring.stringify(expectedParams),
    });
  });

  it('should use the specified environment and realm', async () => {
    const mockResponse = {
      id_token: 'mock-id-token',
      access_token: 'mock-access-token',
      refresh_token: 'mock-refresh-token',
      refresh_expires_in: 3600,
    };

    fetchMock.mockResolvedValueOnce({
      json: async () => mockResponse,
      ok: true,
    } as Response);

    const props: GetTokensProps = {
      code: 'mock-code',
      clientID: 'mock-client-id',
      clientSecret: 'mock-client-secret',
      redirectURI: 'https://myapp.com/callback',
      ssoEnvironment: 'test',
      ssoRealm: 'custom',
    };

    const result = await getTokens(props);

    expect(result).toEqual(mockResponse);

    const expectedParams = {
      grant_type: 'authorization_code',
      client_id: props.clientID,
      redirect_uri: props.redirectURI,
      code: props.code,
    };

    const expectedAuthHeader = Buffer.from(`${props.clientID}:${props.clientSecret}`).toString(
      'base64',
    );

    expect(fetchMock).toHaveBeenCalledWith(`${AUTH_URLS.test}/realms/custom/protocol/oidc/token`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${expectedAuthHeader}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: querystring.stringify(expectedParams),
    });
  });

  it('should throw an error if the fetch fails', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 400,
      statusText: 'Bad Request',
      json: async () => ({}), // Mock json method
    } as Response);

    const props: GetTokensProps = {
      code: 'mock-code',
      clientID: 'mock-client-id',
      clientSecret: 'mock-client-secret',
      redirectURI: 'https://myapp.com/callback',
    };

    await expect(getTokens(props)).rejects.toThrow('Failed to fetch tokens: 400 Bad Request');
  });
});

jest.mock('@/authentication/isJWTValid');

const isJWTValidMock = isJWTValid as jest.MockedFunction<typeof isJWTValid>;

describe('getNewTokens', () => {
  beforeEach(() => {
    fetchMock.mockClear();
    isJWTValidMock.mockClear();
  });

  it('should return new tokens if the refresh token is valid', async () => {
    const mockResponse = {
      access_token: 'mock-access-token',
      id_token: 'mock-id-token',
      expires_in: 3600,
    };

    fetchMock.mockResolvedValueOnce({
      json: async () => mockResponse,
      ok: true,
    } as Response);

    isJWTValidMock.mockResolvedValueOnce(true);

    const props: GetNewTokensProps = {
      refreshToken: 'mock-refresh-token',
      clientID: 'mock-client-id',
      clientSecret: 'mock-client-secret',
    };

    const result = await getNewTokens(props);

    expect(result).toEqual(mockResponse);

    const expectedParams = {
      grant_type: 'refresh_token',
      client_id: props.clientID,
      client_secret: props.clientSecret,
      refresh_token: props.refreshToken,
    };

    expect(fetchMock).toHaveBeenCalledWith(`${AUTH_URLS.dev}/realms/standard/protocol/oidc/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: querystring.stringify(expectedParams),
    });

    expect(isJWTValidMock).toHaveBeenCalledWith({
      jwt: props.refreshToken,
      clientID: props.clientID,
      clientSecret: props.clientSecret,
    });
  });

  it('should return null if the refresh token is invalid', async () => {
    isJWTValidMock.mockResolvedValueOnce(false);

    const props: GetNewTokensProps = {
      refreshToken: 'mock-refresh-token',
      clientID: 'mock-client-id',
      clientSecret: 'mock-client-secret',
    };

    const result = await getNewTokens(props);

    expect(result).toBeNull();

    expect(fetchMock).not.toHaveBeenCalled();
    expect(isJWTValidMock).toHaveBeenCalledWith({
      jwt: props.refreshToken,
      clientID: props.clientID,
      clientSecret: props.clientSecret,
    });
  });

  it('should throw an error if the fetch fails', async () => {
    isJWTValidMock.mockResolvedValueOnce(true);

    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 400,
      statusText: 'Bad Request',
      json: async () => ({}), // Mock json method
    } as Response);

    const props: GetNewTokensProps = {
      refreshToken: 'mock-refresh-token',
      clientID: 'mock-client-id',
      clientSecret: 'mock-client-secret',
    };

    await expect(getNewTokens(props)).rejects.toThrow(
      "Couldn't get access or id token from KC token endpoint",
    );

    expect(isJWTValidMock).toHaveBeenCalledWith({
      jwt: props.refreshToken,
      clientID: props.clientID,
      clientSecret: props.clientSecret,
    });
  });

  it('should use the specified environment and realm', async () => {
    const mockResponse = {
      access_token: 'mock-access-token',
      id_token: 'mock-id-token',
      expires_in: 3600,
    };

    fetchMock.mockResolvedValueOnce({
      json: async () => mockResponse,
      ok: true,
    } as Response);

    isJWTValidMock.mockResolvedValueOnce(true);

    const props: GetNewTokensProps = {
      refreshToken: 'mock-refresh-token',
      clientID: 'mock-client-id',
      clientSecret: 'mock-client-secret',
      ssoEnvironment: 'test',
      ssoRealm: 'custom',
    };

    const result = await getNewTokens(props);

    expect(result).toEqual(mockResponse);

    const expectedParams = {
      grant_type: 'refresh_token',
      client_id: props.clientID,
      client_secret: props.clientSecret,
      refresh_token: props.refreshToken,
    };

    expect(fetchMock).toHaveBeenCalledWith(`${AUTH_URLS.test}/realms/custom/protocol/oidc/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: querystring.stringify(expectedParams),
    });

    expect(isJWTValidMock).toHaveBeenCalledWith({
      jwt: props.refreshToken,
      clientID: props.clientID,
      clientSecret: props.clientSecret,
    });
  });
});
