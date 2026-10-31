import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { CourseSchema, type Course } from './schema.ts'
import Field from './Field.tsx'

type Props = { initial: Course }

export default function CourseForm({ initial }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<Course>({
    resolver: zodResolver(CourseSchema),
    defaultValues: initial,
  })

  return (
    <form
      onSubmit={handleSubmit((v) => console.log(v))}
      noValidate
    >
      <Field label="Title" error={errors.title?.message}>
        <input {...register('title')} />
      </Field>
      <Field
        label="Summary"
        error={errors.summary?.message}
      >
        <textarea rows={2} {...register('summary')} />
      </Field>
      <Field label="Level" error={errors.level?.message}>
        <select {...register('level')}>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </Field>
      <Field
        label="Price (rupees)"
        error={errors.price?.message}
      >
        <input
          type="number"
          {...register('price', { valueAsNumber: true })}
        />
      </Field>
      <div className="bar">
        {isDirty && (
          <span className="chip">Unsaved changes</span>
        )}
        <button disabled={!isDirty}>Save</button>
      </div>
    </form>
  )
}
