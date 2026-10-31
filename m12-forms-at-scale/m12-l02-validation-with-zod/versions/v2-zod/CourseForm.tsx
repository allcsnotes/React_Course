import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { courseSchema, type CourseValues } from './schema'
import LevelPicker from './LevelPicker'

export default function CourseForm() {
  const [message, setMessage] = useState('')
  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CourseValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: '',
      price: 0,
      level: 'beginner',
      description: '',
    },
  })

  async function onSubmit(data: CourseValues) {
    const res = await fetch('/api/courses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    const body = await res.json()
    if (!res.ok) {
      for (const [field, messages] of Object.entries<string[]>(body.errors)) {
        setError(field as keyof CourseValues, { message: messages[0] })
      }
      return
    }
    setMessage('Saved: ' + body.title)
    reset()
  }

  return (
    <main>
      <h1>New course</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label className="wide">
          Title
          <input {...register('title')} />
          {errors.title && <p className="err">{errors.title.message}</p>}
        </label>
        <label>
          Price
          <input type="number" {...register('price', { valueAsNumber: true })} />
          {errors.price && <p className="err">{errors.price.message}</p>}
        </label>
        <div>
          Level
          <Controller
            name="level"
            control={control}
            render={({ field }) => (
              <LevelPicker value={field.value} onChange={field.onChange} />
            )}
          />
          {errors.level && <p className="err">{errors.level.message}</p>}
        </div>
        <label className="wide">
          Description
          <textarea {...register('description')} />
          {errors.description && <p className="err">{errors.description.message}</p>}
        </label>
        <div className="row">
          <button className="go" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Create course'}
          </button>
          {message && <p className="ok">{message}</p>}
        </div>
      </form>
    </main>
  )
}
