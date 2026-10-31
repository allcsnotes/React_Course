import { useRef } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import type { Course } from './api.ts'
import { CourseCard } from './CourseCard.tsx'

const COLUMNS = 2
const ROW_HEIGHT = 104 // a card is 96 px high, plus an 8 px gap

type Props = {
  courses: Course[]
  enrolled: Set<number>
  onEnroll: (id: number) => void
  dimmed: boolean
}

export function CourseGrid({
  courses,
  enrolled,
  onEnroll,
  dimmed,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const virtual = useVirtualizer({
    count: Math.ceil(courses.length / COLUMNS),
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 4,
  })

  return (
    <div
      className="scroll"
      ref={scrollRef}
      style={{ opacity: dimmed ? 0.6 : 1 }}
    >
      <div
        style={{ height: virtual.getTotalSize(), position: 'relative' }}
      >
        {virtual.getVirtualItems().map((row) => (
          <ul
            className="vrow"
            key={row.key}
            style={{ transform: `translateY(${row.start}px)` }}
          >
            {courses
              .slice(row.index * COLUMNS, row.index * COLUMNS + COLUMNS)
              .map((c) => (
                <CourseCard
                  key={c.id}
                  course={c}
                  enrolled={enrolled.has(c.id)}
                  onEnroll={onEnroll}
                />
              ))}
          </ul>
        ))}
      </div>
    </div>
  )
}
