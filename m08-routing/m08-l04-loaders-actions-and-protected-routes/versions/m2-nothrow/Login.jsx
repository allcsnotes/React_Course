import { Form, redirect } from 'react-router'
import { signIn } from './auth.js'

export async function action({ request }) {
  signIn()
  const url = new URL(request.url)
  const next = url.searchParams.get('next')
  return redirect(next || '/')
}

export default function Login() {
  return (
    <div>
      <h2>Sign in</h2>
      <p>A pretend sign-in: one click.</p>
      <Form method="post">
        <button>Sign in as Lukas</button>
      </Form>
    </div>
  )
}
