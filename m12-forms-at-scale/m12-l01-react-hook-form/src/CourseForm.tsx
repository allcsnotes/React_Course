import { useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import LevelPicker from './LevelPicker'

export type FormValues = { title: string; price: number; level: string; description: string }

export default function CourseForm() {
  const renders = useRef(0)
  renders.current += 1
  const [message, setMessage] = useState('')
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      title: '',
      price: 0,
      level: 'beginner',
      description: '',
    },
  })

  async function onSubmit(data: FormValues) {
    const res = await fetch('/api/courses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    const saved = await res.json()
    setMessage('Saved: ' + saved.title)
    reset()
  }

  return (
    <main style={{ zoom: 0.88 }}>
      <div className="top"><h1>New course</h1><span className="count">form renders: {renders.current}</span></div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label className="wide">
          Title
          <input {...register('title', { required: 'The title is required' })} />
          {errors.title && <p className="err">{errors.title.message}</p>}
        </label>
        <label>
          Price
          <input
            type="number"
            {...register('price', { valueAsNumber: true })}
          />
        </label>
        <div className="wide">
          Level
          <Controller
            name="level"
            control={control}
            render={({ field }) => (
              <LevelPicker value={field.value} onChange={field.onChange} />
            )}
          />
        </div>
        <label className="wide">
          Description
          <textarea style={{ height: 40 }} {...register('description')} />
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
