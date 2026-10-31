export type Form = { name: string; email: string; plan: '' | 'free' | 'pro'; terms: boolean }
export type Errors = Partial<Record<keyof Form, string>>

export const EMPTY: Form = { name: '', email: '', plan: '', terms: false }

// Pure: the errors for ONE step (1 = account, 2 = plan and terms). An empty object means the step is fine.
export function validate(step: 1 | 2, f: Form): Errors {
  const e: Errors = {}
  if (step === 1) {
    if (f.name.trim().length < 2) e.name = 'Name must be at least 2 letters'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) e.email = 'Enter a valid email'
  } else {
    if (f.plan === '') e.plan = 'Choose a plan'
    if (!f.terms) e.terms = 'You must accept the terms'
  }
  return e
}

// The fake server: an email ending in @fail.test is refused, so the error path can be tried.
export function submit(f: Form, ms = 800): Promise<string> {
  return new Promise((resolve, reject) =>
    setTimeout(() => (f.email.trim().endsWith('@fail.test') ? reject(new Error('refused')) : resolve(`Welcome, ${f.name.trim()}! Enrolled on the ${f.plan} plan.`)), ms),
  )
}
