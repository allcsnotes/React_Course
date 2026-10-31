import { useRef } from 'react'
import { useWatch, type Control } from 'react-hook-form'
import type { FormValues } from './CourseForm'

type Props = { control: Control<FormValues> }

export default function Preview({ control }: Props) {
  const renders = useRef(0)
  renders.current += 1
  const title = useWatch({ control, name: 'title' })
  return (
    <p className="prev wide">
      Preview: {title} <span className="count">preview renders: {renders.current}</span>
    </p>
  )
}
