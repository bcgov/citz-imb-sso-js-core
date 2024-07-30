import querystring from 'querystring';
import { getTokens } from '@/authentication';
import { AUTH_URLS } from '@/constants';
import { GetTokensProps } from '@/types';

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
