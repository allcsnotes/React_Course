import { useState, type ReactNode } from 'react'

type TabItem = {
  label: string
  content: ReactNode
  icon?: string
  badge?: number
}

type Props = {
  tabs: TabItem[]
  showIcons?: boolean
  showBadges?: boolean
  footer?: ReactNode
  onChange?: (index: number) => void
}

export function Tabs({ tabs, showIcons, showBadges, footer, onChange }: Props) {
  const [active, setActive] = useState(0)
  return (
    <div className="tabs">
      <div className="tablist">
        {tabs.map((tab, i) => (
          <button
            key={tab.label}
            className={i === active ? 'tab on' : 'tab'}
            onClick={() => {
              setActive(i)
              onChange?.(i)
            }}
          >
            {showIcons && tab.icon} {tab.label}
            {showBadges && tab.badge ? <span className="badge">{tab.badge}</span> : null}
          </button>
        ))}
      </div>
      <div className="panel">{tabs[active].content}</div>
      {footer}
    </div>
  )
}
