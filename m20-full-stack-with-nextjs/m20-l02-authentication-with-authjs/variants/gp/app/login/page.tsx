import { login, loginWithGoogle } from './actions'

export default async function LoginPage({ searchParams }: PageProps<'/login'>) {
  const { error } = await searchParams
  return (
    <div className="card">
      <form action={login}>
        <h2>Sign in</h2>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" />
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" />
        <button>Sign in</button>
        {error && <p className="err">Wrong email or password.</p>}
      </form>
      <form action={loginWithGoogle}>
        <button className="google">Continue with Google</button>
      </form>
    </div>
  )
}
