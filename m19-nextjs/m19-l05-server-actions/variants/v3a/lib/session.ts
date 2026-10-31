import { cookies } from 'next/headers'

export async function isAdmin() {
  const jar = await cookies()
  return jar.get('admin')?.value === 'asha-secret-7421'
}
