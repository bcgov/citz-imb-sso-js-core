import { HasRolesOptions, OriginalSSOUser, SSOIdentityProvider } from '@/types';

// Checks if user has all the roles in the requiredRoles array.
const hasAllRoles = (userRoles: string[], requiredRoles: string[]) =>
  requiredRoles.every((role) => userRoles.includes(role));

// Checks if user has at least one role in requiredRoles array.
const hasAtLeastOneRole = (userRoles: string[], requiredRoles: string[]) =>
  requiredRoles.some((role) => userRoles.includes(role));

// Return true if the user has the specified roles.
export const hasRoles = <
  TProvider extends SSOIdentityProvider | unknown,
  TDCAttributes extends object | undefined = undefined,
>(
  user: OriginalSSOUser<TProvider, TDCAttributes>,
  roles: string[],
  options: HasRolesOptions = { requireAllRoles: false },
) => {
  const userRoles = user?.client_roles ?? [];

  // Ensure proper use of function.
  if (!roles || !Array.isArray(roles) || !roles.every((item) => typeof item === 'string'))
    throw new Error(
      `Error: hasRoles function of 'citz-imb-sso-js-core' - Received roles as type ${typeof roles}, but expected string[].`,
    );

  // Return false because user does not have any roles
  if (userRoles.length === 0) return false;

  // User must have all roles in roles array unless requireAllRoles === false
  if (!options.requireAllRoles) return hasAtLeastOneRole(userRoles, roles);
  else return hasAllRoles(userRoles, roles);
};
