'use client'

import { useOptimistic, useTransition } from 'react'
import { markDone } from '@/app/actions'
import { percent } from '@/lib/progress'

type Props = { slug: string; lessons: string[]; initialDone: number[] }

export default function Lessons({ slug, lessons, initialDone }: Props) {
  const [done, addDone] = useOptimistic(
    initialDone,
    (list, n: number) => [...list, n],
  )
  const [, start] = useTransition()
  const pct = percent(done.length, lessons.length)
  return (
    <>
      <div
        className="bar"
        role="progressbar"
        aria-label="Course progress"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className="fill" style={{ width: `${pct}%` }} />
        <span>
          {done.length} of {lessons.length} lessons · {pct}%
        </span>
      </div>
      <ol className="lessons">
        {lessons.map((title, i) => (
          <li key={title}>
            <span>{title}</span>
            {done.includes(i) ? (
              <b className="done">Done</b>
            ) : (
              <button
                className="mini"
                aria-label={`Mark done: ${title}`}
                onClick={() =>
                  start(async () => {
                    addDone(i)
                    await markDone(slug, i)
                  })
                }
              >
                Mark done
              </button>
            )}
          </li>
        ))}
      </ol>
    </>
  )
}
