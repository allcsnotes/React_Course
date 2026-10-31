import { cookies } from 'next/headers'

async function getName() {
  'use cache'
  const jar = await cookies()
  return jar.get('name')?.value ?? 'guest'
}

export default async function Page() {
  return <p>Hello {await getName()}</p>
}
