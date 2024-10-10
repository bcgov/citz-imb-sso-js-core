import querystring from 'querystring';
import { isJWTValid } from '@/authentication';
import { AUTH_URLS } from '@/constants';
import { IsJWTValidProps } from '@/types';

// Cast the fetch function to jest.Mock
const fetchMock = jest.fn() as jest.Mock;

// Replace the global fetch with the mock
global.fetch = fetchMock;

describe('isJWTValid', () => {
  beforeEach(() => {
    fetchMock.mockClear();
  });

  it('should return true if the JWT is active', async () => {
    fetchMock.mockResolvedValueOnce({
      json: async () => ({ active: true }),
      ok: true,
    } as Response);

    const props: IsJWTValidProps = {
      jwt: 'mock-jwt',
      clientID: 'mock-client-id',
      clientSecret: 'mock-client-secret',
    };

    const result = await isJWTValid(props);

    expect(result).toBe(true);

    const expectedParams = {
      client_id: props.clientID,
      client_secret: props.clientSecret,
      token: props.jwt,
    };

    expect(fetchMock).toHaveBeenCalledWith(
      `${AUTH_URLS.dev}/realms/standard/protocol/openid-connect/token/introspect`,
      {
        method: 'POST',
        headers: {
          Accept: '*/*',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: querystring.stringify(expectedParams),
      },
    );
  });

  it('should return false if the JWT is inactive', async () => {
    fetchMock.mockResolvedValueOnce({
      json: async () => ({ active: false }),
      ok: true,
    } as Response);

    const props: IsJWTValidProps = {
      jwt: 'mock-jwt',
      clientID: 'mock-client-id',
      clientSecret: 'mock-client-secret',
    };

    const result = await isJWTValid(props);

    expect(result).toBe(false);
  });

  it('should use the specified environment and realm', async () => {
    fetchMock.mockResolvedValueOnce({
      json: async () => ({ active: true }),
      ok: true,
    } as Response);

    const props: IsJWTValidProps = {
      jwt: 'mock-jwt',
      clientID: 'mock-client-id',
      clientSecret: 'mock-client-secret',
      ssoEnvironment: 'test',
      ssoRealm: 'custom',
    };

    const result = await isJWTValid(props);

    expect(result).toBe(true);

    const expectedParams = {
      client_id: props.clientID,
      client_secret: props.clientSecret,
      token: props.jwt,
    };

    expect(fetchMock).toHaveBeenCalledWith(
      `${AUTH_URLS.test}/realms/custom/protocol/openid-connect/token/introspect`,
      {
        method: 'POST',
        headers: {
          Accept: '*/*',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: querystring.stringify(expectedParams),
      },
    );
  });

  it('should throw an error if the fetch fails', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 400,
      statusText: 'Bad Request',
      json: async () => ({}), // Mock json method
    } as Response);

    const props: IsJWTValidProps = {
      jwt: 'mock-jwt',
      clientID: 'mock-client-id',
      clientSecret: 'mock-client-secret',
    };

    await expect(isJWTValid(props)).rejects.toThrow('Failed to validate JWT: 400 Bad Request');
  });
});
