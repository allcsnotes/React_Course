import { useState } from 'react'
import type { FormEvent } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createCourse, getTeachingCourses } from './api.ts'

export default function InstructorPage() {
  const queryClient = useQueryClient()
  const [title, setTitle] = useState('')
  const courses = useQuery({ queryKey: ['teaching'], queryFn: getTeachingCourses })
  const add = useMutation({
    mutationFn: createCourse,
    onSuccess: () => {
      setTitle('')
      return queryClient.invalidateQueries({ queryKey: ['teaching'] })
    },
  })

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    add.mutate(title)
  }

  return (
    <>
      <h1>Courses I teach</h1>
      <form className="row" onSubmit={onSubmit}>
        <input
          placeholder="New course title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button disabled={add.isPending}>Create course</button>
      </form>
      {add.error && <p className="bad">{add.error.message}</p>}
      {courses.error && <p className="bad">{courses.error.message}</p>}
      <ul className="grid">
        {courses.data?.map((c) => (
          <li className="card" key={c.slug}>
            <h2>{c.title}</h2>
            <p>{c.lessonCount} lessons</p>
          </li>
        ))}
      </ul>
    </>
  )
}
