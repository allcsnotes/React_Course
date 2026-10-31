'use server'

import { AuthError } from 'next-auth'
import { refresh } from 'next/cache'
import { signIn, signOut } from '@/auth'
import { completeLesson, enrollUser } from '@/lib/learn'
import { requireUser } from '@/lib/session'

export async function enroll(courseId: number) {
  const user = await requireUser()
  await enrollUser(user.id, courseId)
  refresh()
}

export async function markDone(lessonId: number) {
  const user = await requireUser()
  const result = await completeLesson(user.id, lessonId)
  if (result !== 'ok') throw new Error(result)
  refresh()
}

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
