import { decodeJWT } from '@/jwt';

describe('decodeJWT', () => {
  it('should decode a valid JWT and return the payload as a JSON object', () => {
    const validJWT =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
    const expectedPayload = {
      sub: '1234567890',
      name: 'John Doe',
      iat: 1516239022,
    };

    const decoded = decodeJWT(validJWT);
    expect(decoded).toEqual(expectedPayload);
  });

  it('should throw an error for a JWT with invalid format', () => {
    const invalidJWT = 'invalid.jwt';

    expect(() => decodeJWT(invalidJWT)).toThrow('Invalid JWT format');
  });

  it('should throw an error for a JWT with malformed JSON payload', () => {
    const malformedPayloadJWT =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.bWFsZm9ybWVkX3BheWxvYWQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

    expect(() => decodeJWT(malformedPayloadJWT)).toThrow(
      /Invalid input in decodeJWT\(jwt: string\) function of 'citz-imb-sso-js-core': Unexpected token/,
    );
  });

  it('should throw an error for an unknown error type', () => {
    const originalBufferFrom = Buffer.from;

    // Mock Buffer.from to throw a non-Error object
    Buffer.from = () => {
      throw { some: 'non-error object' };
    };

    const unknownErrorJWT =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

    expect(() => decodeJWT(unknownErrorJWT)).toThrow(
      "Unknown error occurred in decodeJWT() function of 'citz-imb-sso-js-core'",
    );

    // Restore original Buffer.from
    Buffer.from = originalBufferFrom;
  });
});
