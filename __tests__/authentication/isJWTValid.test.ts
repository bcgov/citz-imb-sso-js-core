import { isJWTValid } from '@/authentication';
import { IsJWTValidProps } from '@/types';

const createMockJWT = (payload: object): string => {
  const header = Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return `${header}.${body}.mock-signature`;
};

describe('isJWTValid', () => {
  it('should return true if the JWT has not expired', async () => {
    const futureExp = Math.floor(Date.now() / 1000) + 3600;
    const jwt = createMockJWT({ exp: futureExp });

    const props: IsJWTValidProps = {
      jwt,
      clientID: 'mock-client-id',
      clientSecret: 'mock-client-secret',
    };

    const result = await isJWTValid(props);

    expect(result).toBe(true);
  });

  it('should return false if the JWT has expired', async () => {
    const pastExp = Math.floor(Date.now() / 1000) - 3600;
    const jwt = createMockJWT({ exp: pastExp });

    const props: IsJWTValidProps = {
      jwt,
      clientID: 'mock-client-id',
      clientSecret: 'mock-client-secret',
    };

    const result = await isJWTValid(props);

    expect(result).toBe(false);
  });

  it('should return false if the JWT has no exp claim', async () => {
    const jwt = createMockJWT({ iat: Math.floor(Date.now() / 1000) });

    const props: IsJWTValidProps = {
      jwt,
      clientID: 'mock-client-id',
      clientSecret: 'mock-client-secret',
    };

    const result = await isJWTValid(props);

    expect(result).toBe(false);
  });

  it('should return false if the JWT is malformed', async () => {
    const props: IsJWTValidProps = {
      jwt: 'not-a-valid-jwt',
      clientID: 'mock-client-id',
      clientSecret: 'mock-client-secret',
    };

    const result = await isJWTValid(props);

    expect(result).toBe(false);
  });
});
