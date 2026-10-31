import { revalidatePath } from 'next/cache'
import { addReview } from '@/lib/reviews'

export async function postReview(formData: FormData) {
  const name = String(formData.get('name'))
  const text = String(formData.get('text'))
  await addReview(name, text)
  revalidatePath('/')
}
