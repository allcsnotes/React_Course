import { useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { courseSchema, type CourseValues } from './schema'

const steps = ['Details', 'Lessons', 'Review']
const fieldsOf: (keyof CourseValues)[][] = [
  ['title', 'price'],
  ['lessons'],
  [],
]

export default function CourseWizard() {
  const [step, setStep] = useState(0)
  const [saved, setSaved] = useState('')
  const form = useForm<CourseValues>({
    resolver: zodResolver(courseSchema),
    mode: 'onTouched',
    defaultValues: {
      title: '',
      price: 0,
      lessons: [{ title: '', minutes: 10 }],
    },
  })
  const { register, control, handleSubmit, trigger, getValues } = form
  const { errors } = form.formState
  const { fields, append, remove } =
    useFieldArray({ control, name: 'lessons' })

  async function next() {
    const ok = await trigger(fieldsOf[step])
    if (ok) setStep(step + 1)
  }

  async function save(values: CourseValues) {
    const res = await fetch('/api/courses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    })
    const data = await res.json()
    setSaved(`Saved: course ${data.id}, ${data.lessons} lessons`)
  }

  return (
    <form onSubmit={handleSubmit(save)}>
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
          <label>{getValues('title')} · Rs {getValues('price')}</label>
          {getValues('lessons').map((l, i) => (
            <p key={i} className="ok">{i + 1}. {l.title} ({l.minutes} min)</p>
          ))}
          {saved && <p className="ok">{saved}</p>}
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
