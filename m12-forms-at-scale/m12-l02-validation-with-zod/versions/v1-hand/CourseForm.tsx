import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import LevelPicker from './LevelPicker'

export type FormValues = { title: string; price: number; level: string; description: string }

export default function CourseForm() {
  const [message, setMessage] = useState('')
  const [banner, setBanner] = useState('')
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: { title: '', price: 0, level: 'beginner', description: '' },
  })

  async function onSubmit(data: FormValues) {
    setBanner('')
    const res = await fetch('/api/courses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    const body = await res.json()
    if (!res.ok) return setBanner(JSON.stringify(body.errors))
    setMessage('Saved: ' + body.title)
    reset()
  }

  return (
    <main>
      <h1>New course</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label className="wide">
          Title
          <input {...register('title', { required: 'The title is required' })} />
          {errors.title && <p className="err">{errors.title.message}</p>}
        </label>
        <label>
          Price
          <input type="number" {...register('price', { valueAsNumber: true })} />
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
        </div>
        <label className="wide">
          Description
          <textarea {...register('description')} />
        </label>
        <div className="row">
          <button className="go" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Create course'}
          </button>
          {message && <p className="ok">{message}</p>}
        </div>
        {banner && <p className="bad">The server said no: {banner}</p>}
      </form>
    </main>
  )
}
