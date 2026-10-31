'use client'

import { useState } from 'react'
import type { Course } from '@/lib/api'
import CourseCard from './CourseCard'

const LEVELS = ['all', 'beginner', 'intermediate', 'advanced']

export default function CourseList({ courses }: { courses: Course[] }) {
  const [level, setLevel] = useState('all')
  const shown = courses.filter((c) => level === 'all' || c.level === level)
  return (
    <>
      <div className="filters">
        {LEVELS.map((l) => (
          <button
            key={l}
            className={l === level ? 'on' : ''}
            onClick={() => setLevel(l)}
          >
            {l}
          </button>
        ))}
      </div>
      <div className="grid">
        {shown.map((c) => (
          <CourseCard key={c.slug} course={c} />
        ))}
      </div>
    </>
  )
}
