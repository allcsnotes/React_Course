'use server'

import { AuthError } from 'next-auth'
import { refresh } from 'next/cache'
import { signIn, signOut } from '@/auth'
import { saveFeedback, saveProgress } from '@/lib/api'
import { feedbackSchema } from '@/lib/schemas'
import { requireUser } from '@/lib/session'

export async function login(_prev: string, form: FormData) {
  try {
    await signIn('credentials', {
      email: form.get('email'),
      password: form.get('password'),
      redirectTo: '/my',
    })
  } catch (e) {
    if (e instanceof AuthError) return 'Wrong email or password'
    throw e
  }
  return ''
}

export async function logout() {
  await signOut({ redirectTo: '/' })
}

export async function markDone(slug: string, lesson: number) {
  const user = await requireUser()
  await saveProgress(user.id, slug, lesson)
  refresh()
}

export async function sendFeedback(values: unknown) {
  const user = await requireUser()
  const parsed = feedbackSchema.safeParse(values)
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0].message }
  }
  await saveFeedback({ ...parsed.data, name: user.name })
  return { ok: true as const }
}
