import { createContext, useContext } from 'react'
import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { Course } from './types'

const Ctx = createContext<Course[]>([])
type Props = { children: ReactNode }

export function CoursesProvider(props: Props) {
  const [list, setList] = useState<Course[]>([])
  useEffect(() => {
    fetch('/api/courses')
      .then(res => res.json())
      .then(setList)
  }, [])
  return <Ctx value={list}>{props.children}</Ctx>
}

export const useCourses = () => useContext(Ctx)
