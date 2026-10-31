import { useRef, useState, type FormEvent } from 'react'
import { EMPTY, submit, validate, type Errors, type Form } from '../lib/wizard.ts'

export default function T10() {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [form, setForm] = useState<Form>(EMPTY)
  const [errors, setErrors] = useState<Errors>({})
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'failed'>('idle')
  const [result, setResult] = useState('')
  const root = useRef<HTMLFormElement>(null)

  function set<K extends keyof Form>(k: K, v: Form[K]) {
    setForm((f) => ({ ...f, [k]: v }))
  }

  function next(e: FormEvent) {
    e.preventDefault()
    if (step === 3) return void send()
    const errs = validate(step, form)
    setErrors(errs)
    const bad = Object.keys(errs)[0]
    if (bad) return void root.current?.querySelector<HTMLElement>(`[name="${bad}"]`)?.focus() // focus the first problem
    setStep((step + 1) as 2 | 3)
  }

  async function send() {
    setState('sending')
    try {
      setResult(await submit(form))
      setState('done')
    } catch {
      setState('failed') // values stay, so the user can fix the email and try again
    }
  }

  if (state === 'done') return <p className="ok" role="status">{result}</p>

  const err = (k: keyof Form) => (errors[k] ? <p className="error" id={`${k}-err`} role="alert">{errors[k]}</p> : null)
  const attrs = (k: keyof Form) => ({ name: k, 'aria-invalid': errors[k] ? true : undefined, 'aria-describedby': errors[k] ? `${k}-err` : undefined })

  return (
    <form ref={root} onSubmit={next} noValidate>
      <h2>Step {step} of 3</h2>
      {step === 1 && (
        <>
          <div className="field"><label htmlFor="name">Name</label><input id="name" type="text" value={form.name} onChange={(e) => set('name', e.target.value)} {...attrs('name')} />{err('name')}</div>
          <div className="field"><label htmlFor="email">Email</label><input id="email" type="email" value={form.email} onChange={(e) => set('email', e.target.value)} {...attrs('email')} />{err('email')}</div>
        </>
      )}
      {step === 2 && (
        <>
          <div className="field"><label htmlFor="plan">Plan</label>
            <select id="plan" value={form.plan} onChange={(e) => set('plan', e.target.value as Form['plan'])} {...attrs('plan')}>
              <option value="">Choose...</option><option value="free">Free</option><option value="pro">Pro</option>
            </select>{err('plan')}</div>
          <div className="field"><label><input type="checkbox" checked={form.terms} onChange={(e) => set('terms', e.target.checked)} {...attrs('terms')} /> I accept the terms</label>{err('terms')}</div>
        </>
      )}
      {step === 3 && (
        <div className="card">
          <p>Name: {form.name.trim()}</p><p>Email: {form.email.trim()}</p><p>Plan: {form.plan}</p>
        </div>
      )}
      {state === 'failed' && <p className="error" role="alert">Could not enroll. Check the email and try again.</p>}
      <div>
        {step > 1 && <button type="button" disabled={state === 'sending'} onClick={() => { setErrors({}); setState('idle'); setStep((step - 1) as 1 | 2) }}>Back</button>}
        <button type="submit" disabled={state === 'sending'}>{step === 3 ? (state === 'sending' ? 'Sending...' : 'Enroll') : 'Next'}</button>
      </div>
    </form>
  )
}
