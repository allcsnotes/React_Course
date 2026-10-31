import { auth } from '@/auth'

export default async function SessionPage() {
  const session = await auth()
  return (
    <div className="card">
      <h2>auth() returns</h2>
      <div className="json">{JSON.stringify(session, null, 2)}</div>
    </div>
  )
}
