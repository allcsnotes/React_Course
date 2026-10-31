'use server'

import { AuthError } from 'next-auth'
import { redirect } from 'next/navigation'
import { signIn } from '@/auth'

export async function login(formData: FormData) {
  try {
    await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
      redirectTo: '/dashboard',
    })
  } catch (error) {
    if (error instanceof AuthError) redirect('/login?error=' + error.type)
    throw error
  }
}

export async function loginWithGoogle() {
  await signIn('google', { redirectTo: '/dashboard' })
}
