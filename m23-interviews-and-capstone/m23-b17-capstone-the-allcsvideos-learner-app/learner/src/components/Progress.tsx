import Link from 'next/link'
import { getProgress } from '@/lib/api'
import { getSession } from '@/lib/session'
import FeedbackForm from './FeedbackForm'
import Lessons from './Lessons'

type Props = { slug: string; lessons: string[] }

export default async function Progress({ slug, lessons }: Props) {
  const session = await getSession()
  if (!session?.user) {
    return (
      <Link href="/login" className="btn">
        Sign in to track your progress
      </Link>
    )
  }
  const progress = await getProgress(session.user.id)
  const done = progress[slug] ?? []
  return (
    <>
      <Lessons slug={slug} lessons={lessons} initialDone={done} />
      <FeedbackForm />
    </>
  )
}
