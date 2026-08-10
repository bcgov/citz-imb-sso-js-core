import { decodeJWT } from './decodeJWT';
import type { IsJWTValidProps } from '../types';

/**
 * Validates a JWT by checking that it has not expired.
 *
 * This performs a local check only - it decodes the token's payload and
 * compares its `exp` claim against the current time. No network call to the
 * SSO server's token introspection endpoint is made. Tokens that cannot be
 * decoded or that carry no valid `exp` claim are treated as invalid.
 */
export const isJWTValid = async (props: IsJWTValidProps): Promise<boolean> => {
  const { jwt } = props;

  let payload;
  try {
    payload = decodeJWT(jwt);
  } catch {
    return false;
  }

  const { exp } = payload;
  if (typeof exp !== 'number' || !Number.isFinite(exp)) return false;

  return exp * 1000 > Date.now();
};
