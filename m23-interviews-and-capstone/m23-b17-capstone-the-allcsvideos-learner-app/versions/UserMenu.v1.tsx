export default async function UserMenu() {
  const session = await auth()
  if (!session?.user) return <Link href="/login">Sign in</Link>
