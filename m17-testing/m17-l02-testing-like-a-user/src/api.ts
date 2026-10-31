export type Lesson = { id: number; title: string }

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))

export async function loadLessons(): Promise<Lesson[]> {
  await wait(300)
  return [
    { id: 1, title: 'What is programming' },
    { id: 2, title: 'Your first program' },
    { id: 3, title: 'Variables' },
  ]
}

export async function enroll(email: string): Promise<void> {
  await wait(400)
  if (!email.includes('@')) throw new Error('Enter a valid email')
}
