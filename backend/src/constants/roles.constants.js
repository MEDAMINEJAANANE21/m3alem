export const ROLES = Object.freeze({
  CLIENT: 'client',
  PROVIDER: 'prestataire',
  ADMIN: 'admin',
});

export const ALL_ROLES = Object.values(ROLES);

// Admin accounts are created by the seed script only, never through public sign-up.
export const SELF_REGISTRATION_ROLES = [ROLES.CLIENT, ROLES.PROVIDER];
