import { useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { courseSchema, type CourseValues } from './schema'
import { upload } from './upload'

const steps = ['Details', 'Lessons', 'Review']
const fieldsOf: (keyof CourseValues)[][] = [
  ['title', 'price'],
  ['lessons'],
  ['thumbnail'],
]

export default function CourseWizard() {
  const [step, setStep] = useState(0)
  const [percent, setPercent] = useState(0)
  const [message, setMessage] = useState('')
  const form = useForm<CourseValues>({
    resolver: zodResolver(courseSchema),
    mode: 'onTouched',
    defaultValues: {
      title: '',
      price: 0,
      lessons: [{ title: '', minutes: 10 }],
    },
  })
  const { register, control, handleSubmit, trigger, watch } = form
  const { errors } = form.formState
  const { fields, append, remove } =
    useFieldArray({ control, name: 'lessons' })
  const picked = watch('thumbnail')?.[0]

  async function next() {
    const ok = await trigger(fieldsOf[step])
    if (ok) setStep(step + 1)
  }

  async function publish(values: CourseValues) {
    try {
      const sent = await upload(values.thumbnail[0], setPercent)
      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: values.title,
          price: values.price,
          lessons: values.lessons,
          thumbnail: sent.filename,
        }),
      })
      const data = await res.json()
      const n = data.lessons
      setMessage(`Published: course ${data.id}, ${n} ${n === 1 ? 'lesson' : 'lessons'}`)
    } catch (e) {
      setMessage((e as Error).message)
    }
  }

  return (
    <form onSubmit={handleSubmit(publish)}>
      <div className="steps">
        {steps.map((s, i) => (
          <span key={s} className={i === step ? 'on' : i < step ? 'done' : ''}>
            {i + 1} {s}
          </span>
        ))}
      </div>
      {step === 0 && (
        <>
          <label>Title</label>
          <input className={errors.title ? 'bad' : ''} {...register('title')} />
          {errors.title && <p className="err">{errors.title.message}</p>}
          <label>Price in rupees</label>
          <input
            type="number"
            className={errors.price ? 'bad' : ''}
            {...register('price', { valueAsNumber: true })}
          />
          {errors.price && <p className="err">{errors.price.message}</p>}
        </>
      )}
      {step === 1 && (
        <>
          {fields.map((field, i) => (
            <div key={field.id}>
              <div className="row">
                <input
                  className={errors.lessons?.[i]?.title ? 'bad' : ''}
                  placeholder="Lesson title"
                  {...register(`lessons.${i}.title`)}
                />
                <input
                  type="number"
                  {...register(`lessons.${i}.minutes`, { valueAsNumber: true })}
                />
                <button type="button" className="rm" onClick={() => remove(i)}>
                  Remove
                </button>
              </div>
              {errors.lessons?.[i]?.title && (
                <p className="err">{errors.lessons[i].title.message}</p>
              )}
            </div>
          ))}
          {errors.lessons?.root && (
            <p className="err">{errors.lessons.root.message}</p>
          )}
          <button
            type="button"
            onClick={() => append({ title: '', minutes: 10 })}
          >
            Add lesson
          </button>
        </>
      )}
      {step === 2 && (
        <>
          <label>Thumbnail (PNG or JPEG, up to 10 MB)</label>
          <input
            type="file"
            accept="image/png,image/jpeg"
            {...register('thumbnail')}
          />
          {errors.thumbnail && (
            <p className="err">{errors.thumbnail.message}</p>
          )}
          {picked && (
            <p className="ok">
              {picked.name} · {(picked.size / 1024 / 1024).toFixed(1)} MB
            </p>
          )}
          {percent > 0 && (
            <div className="bar"><i style={{ width: percent + '%' }} /></div>
          )}
          {percent > 0 && <p className="ok">{percent}%</p>}
          {message && <p className="ok">{message}</p>}
          <button className="go">Publish</button>
        </>
      )}
      <div className="nav">
        {step > 0 ? (
          <button type="button" onClick={() => setStep(step - 1)}>Back</button>
        ) : (
          <span />
        )}
        {step < 2 && (
          <button
            type="button"
            className="go"
            onClick={next}
          >
            Next
          </button>
        )}
      </div>
    </form>
  )
}
