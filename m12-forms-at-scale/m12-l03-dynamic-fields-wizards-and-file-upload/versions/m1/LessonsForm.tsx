import { useFieldArray, useForm } from 'react-hook-form'

type Lesson = { title: string; minutes: number }
type Values = { title: string; lessons: Lesson[] }

export default function LessonsForm() {
  const { register, control, handleSubmit } = useForm<Values>({
    defaultValues: {
      title: 'React for Beginners',
      lessons: [
        { title: 'What React is', minutes: 12 },
        { title: 'Your first component', minutes: 18 },
        { title: 'Props', minutes: 15 },
      ],
    },
  })
  const { fields, append, remove } =
    useFieldArray({ control, name: 'lessons' })

  const onSave = (values: Values) => console.log(values)

  return (
    <form onSubmit={handleSubmit(onSave)}>
      <input {...register('title')} />
      <p className="sum">
        Outline: {fields.map(f => f.title).join(', ')}
      </p>
      {fields.map((field, i) => (
        <div className="row" key={field.id}>
          <input {...register(`lessons.${i}.title`)} />
          <input
            type="number"
            {...register(`lessons.${i}.minutes`, {
              valueAsNumber: true,
            })}
          />
          <button
            type="button"
            className="rm"
            onClick={() => remove(i)}
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => append({ title: '', minutes: 10 })}
      >
        Add lesson
      </button>
      <button className="go">Save</button>
    </form>
  )
}
