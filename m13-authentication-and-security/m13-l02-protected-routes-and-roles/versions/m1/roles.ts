export type Role = 'student' | 'instructor' | 'admin'
export type Page = 'mine' | 'studio' | 'admin'

export const ACCESS: Record<Page, Role[]> = {
  mine: ['student', 'instructor', 'admin'],
  studio: ['instructor', 'admin'],
  admin: ['Admin'],
}

export const can = (role: Role | undefined, page: Page) =>
  role !== undefined && ACCESS[page].includes(role)
