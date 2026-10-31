import { zodResolver } from '@hookform/resolvers/zod'
import {
  Controller,
  useFieldArray,
  useForm,
} from 'react-hook-form'
import { CourseSchema, type Course } from './schema.ts'
import Field from './Field.tsx'
import Thumbnail from './Thumbnail.tsx'

type Props = { initial: Course }

export default function CourseForm({ initial }: Props) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<Course>({
    resolver: zodResolver(CourseSchema),
    defaultValues: initial,
  })
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'lessons',
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

      <Controller
        name="thumbnail"
        control={control}
        render={({ field, fieldState }) => (
          <Thumbnail
            value={field.value}
            onChange={field.onChange}
            error={fieldState.error?.message}
          />
        )}
      />

      <h2>Lessons</h2>
      <ul className="lessons">
        {fields.map((f, i) => {
          const e = errors.lessons?.[i]
          return (
            <li key={f.id}>
              <span className="num">{i + 1}</span>
              <input
                className="grow"
                {...register(`lessons.${i}.title`)}
              />
              <input
                className="mins"
                type="number"
                {...register(`lessons.${i}.minutes`, {
                  valueAsNumber: true,
                })}
              />
              <button
                type="button"
                onClick={() => move(i, i - 1)}
                disabled={i === 0}
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => move(i, i + 1)}
                disabled={i === fields.length - 1}
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => remove(i)}
              >
                ✕
              </button>
              {(e?.title || e?.minutes) && (
                <em className="err">
                  {e.title?.message ?? e.minutes?.message}
                </em>
              )}
            </li>
          )
        })}
      </ul>
      {errors.lessons?.root && (
        <em className="err">
          {errors.lessons.root.message}
        </em>
      )}
      <button
        className="add"
        type="button"
        onClick={() => append({ title: '', minutes: 5 })}
      >
        + Add lesson
      </button>

      <div className="bar">
        {isDirty && (
          <span className="chip">Unsaved changes</span>
        )}
        <button disabled={!isDirty}>Save</button>
      </div>
    </form>
  )
}
