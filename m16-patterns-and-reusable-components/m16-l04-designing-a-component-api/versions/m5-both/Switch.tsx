import { useState } from 'react'

type SwitchProps = { label: string } & (
  | {
      checked: boolean
      onChange: (next: boolean) => void
      defaultChecked?: never
    }
  | {
      checked?: never
      onChange?: (next: boolean) => void
      defaultChecked?: boolean
    }
)

export function Switch(props: SwitchProps) {
  const [inner, setInner] = useState(props.defaultChecked ?? false)
  const controlled = props.checked !== undefined
  const on = controlled ? props.checked : inner

  function toggle() {
    if (!controlled) setInner(!on)
    props.onChange?.(!on)
  }

  return (
    <button className="sw" role="switch" aria-checked={on} onClick={toggle}>
      <span className="track" />
      {props.label}
      <span className="st">{on ? 'on' : 'off'}</span>
    </button>
  )
}
