import type { ReactNode } from 'react'

type NoticeProps = {
  tone?: 'info' | 'warning'
  children: ReactNode
} & (
  | { dismissible?: false; onDismiss?: never }
  | { dismissible: true; onDismiss: () => void }
)

export function Notice({
  tone = 'info',
  children,
  dismissible,
  onDismiss,
}: NoticeProps) {
  return (
    <div className={`notice ${tone}`}>
      <span>{children}</span>
      {dismissible && (
        <button aria-label="Dismiss" onClick={onDismiss}>
          ×
        </button>
      )}
    </div>
  )
}
