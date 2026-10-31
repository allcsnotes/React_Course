'use server'

import { revalidatePath } from 'next/cache'
import { addReview } from '@/lib/reviews'

export type FormState = {
  error?: string
  ok?: string
  name?: string
  text?: string
}

export async function postReview(
  prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const name = String(formData.get('name') ?? '').trim()
  const text = String(formData.get('text') ?? '').trim()
  if (!name) {
    return { error: 'Please write your name.', name, text }
  }
  if (text.length < 10) {
    return { error: 'Write at least 10 characters.', name, text }
  }
  await new Promise(r => setTimeout(r, 1200))
  await addReview(name, text)
  revalidatePath('/')
  return { ok: 'Thank you, ' + name + '!' }
}
