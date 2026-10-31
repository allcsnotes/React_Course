import { useRef } from 'react'
import { useForm } from 'react-hook-form'

export type FormValues = { title: string; price: number; level: string; description: string }

export default function CourseForm() {
  const renders = useRef(0)
  renders.current += 1
  const { register, handleSubmit } = useForm<FormValues>()
  console.log(Object.keys(register('title')))

  function onSubmit(data: FormValues) {
    console.log(data)
  }

  return (
    <main>
      <div className="top"><h1>New course</h1><span className="count">renders: {renders.current}</span></div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label className="wide">
          Title
          <input {...register('title')} />
        </label>
        <label>
          Price
          <input
            type="number"
            {...register('price', { valueAsNumber: true })}
          />
        </label>
        <label>
          Level
          <select {...register('level')}>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </label>
        <label className="wide">
          Description
          <textarea {...register('description')} />
        </label>
        <div className="row"><button className="go">Create course</button></div>

      </form>
    </main>
  )
}
