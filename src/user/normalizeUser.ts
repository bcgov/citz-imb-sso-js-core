import {
  OriginalSSOUser,
  SSOUser,
  SSOIdentityProvider,
  IdirIdentityProvider,
  BceidIdentityProvider,
  GithubIdentityProvider,
  DigitalCredentialsIdentityProvider,
  HasRolesOptions,
} from '../types';
import {
  BCEID_IDENTITY_PROVIDERS as BCEID_IDPs,
  DIGITAL_CREDENTIALS_IDENTITY_PROVIDERS as DC_IDPs,
  GITHUB_IDENTITY_PROVIDERS as GH_IDPs,
  IDIR_IDENTITY_PROVIDERS as IDIR_IDPs,
} from '../constants';
import { hasRoles } from './hasRoles';

// Combine properties of each user type into a single object
export const normalizeUser = <
  TProvider extends SSOIdentityProvider,
  TDCAttributes extends object | undefined = undefined,
>(
  userInfo: OriginalSSOUser<TProvider, TDCAttributes>,
): SSOUser<TProvider, TDCAttributes> => {
  const { identity_provider: idp } = userInfo;

  const normalizedUser: Partial<SSOUser<TProvider, TDCAttributes>> = {
    exp: userInfo.exp,
    iat: userInfo.iat,
    auth_time: userInfo.auth_time,
    jti: userInfo.jti,
    iss: userInfo.iss,
    aud: userInfo.aud,
    sub: userInfo.sub,
    typ: userInfo.typ,
    azp: userInfo.azp,
    nonce: userInfo.nonce,
    session_state: userInfo.session_state,
    scope: userInfo?.scope ?? '',
    at_hash: userInfo?.at_hash ?? '',
    sid: userInfo.sid,
    identity_provider: userInfo.identity_provider as TProvider,
    email_verified: userInfo.email_verified,
    preferred_username: userInfo.preferred_username,
    client_roles: userInfo?.client_roles ?? [],
    originalTokenPayload: userInfo,
    hasRoles: (roles: string[], options?: HasRolesOptions) =>
      hasRoles<TProvider, TDCAttributes>(userInfo, roles, options),
  };

  if (IDIR_IDPs.includes(idp as IdirIdentityProvider)) {
    // Normalize IDIR user properties
    const idirUser = userInfo as OriginalSSOUser<IdirIdentityProvider>;

    normalizedUser.email = idirUser?.email;
    normalizedUser.guid = idirUser?.idir_user_guid;
    normalizedUser.username = idirUser?.idir_username;

    normalizedUser.first_name = idirUser?.given_name;
    normalizedUser.last_name = idirUser?.family_name;
  } else if (BCEID_IDPs.includes(idp as BceidIdentityProvider)) {
    // Normalize BCeID user properties
    const bceidUser = userInfo as OriginalSSOUser<BceidIdentityProvider>;

    normalizedUser.email = bceidUser?.email;
    normalizedUser.guid = bceidUser?.bceid_user_guid;
    normalizedUser.username = bceidUser?.bceid_username;

    const nameParts = bceidUser?.display_name.split(' ');
    normalizedUser.first_name = nameParts[0];
    normalizedUser.last_name = nameParts.slice(1).join(' ');
  } else if (GH_IDPs.includes(idp as GithubIdentityProvider)) {
    // Normalize GitHub user properties
    const ghUser = userInfo as OriginalSSOUser<GithubIdentityProvider>;

    normalizedUser.email = ghUser?.email;
    normalizedUser.guid = ghUser?.github_id;
    normalizedUser.username = ghUser?.github_username;

    const nameParts = ghUser?.display_name.split(' ');
    normalizedUser.first_name = nameParts[0];
    normalizedUser.last_name = nameParts.slice(1).join(' ');
  } else if (DC_IDPs.includes(idp as DigitalCredentialsIdentityProvider)) {
    // Normalize Digital Credenials user properties
    const dcUser = userInfo as OriginalSSOUser<DigitalCredentialsIdentityProvider, TDCAttributes>;
    const attributes = JSON.parse(dcUser.vc_presented_attributes);

    normalizedUser.guid = dcUser.preferred_username.split('@')[0];

    normalizedUser.email = attributes?.email;
  } else {
    throw new Error(
      `Unknown identity provider '${idp}' used in normalizeUser function of 'citz-imb-sso-js-core'.`,
    );
  }

  return normalizedUser as SSOUser<TProvider, TDCAttributes>;
};