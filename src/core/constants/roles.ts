export const ROLES = {
  ADMIN: 'ADMIN',
  ORGANIZER: 'ORGANIZER',
  VOTER: 'VOTER',
} as const

export type Role = (typeof ROLES)[keyof typeof ROLES]

export const ADMIN_ROLES: Role[] = [ROLES.ADMIN]
export const ORGANIZER_ROLES: Role[] = [ROLES.ADMIN, ROLES.ORGANIZER]
export const VOTER_ROLES: Role[] = [ROLES.ADMIN, ROLES.ORGANIZER, ROLES.VOTER]
