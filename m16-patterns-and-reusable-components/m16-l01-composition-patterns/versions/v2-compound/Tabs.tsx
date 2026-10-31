import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

type Kids = { children: ReactNode }
type RootProps = Kids & { initial: string }
type PartProps = Kids & { value: string }
type TabsValue = {
  active: string
  setActive: (v: string) => void
}

const TabsContext = createContext<TabsValue | null>(null)

function useTabs() {
  const ctx = useContext(TabsContext)
  if (!ctx) throw new Error('Tabs parts must be used inside <Tabs>')
  return ctx
}

export function Tabs({ initial, children }: RootProps) {
  const [active, setActive] = useState(initial)
  return (
    <TabsContext value={{ active, setActive }}>
      <div className="tabs">{children}</div>
    </TabsContext>
  )
}

function List({ children }: Kids) {
  return <div className="tablist">{children}</div>
}

function Tab({ value, children }: PartProps) {
  const { active, setActive } = useTabs()
  return (
    <button
      className={value === active ? 'tab on' : 'tab'}
      onClick={() => setActive(value)}
    >
      {children}
    </button>
  )
}

function Panel({ value, children }: PartProps) {
  const { active } = useTabs()
  if (value !== active) return null
  return <div className="panel">{children}</div>
}

Tabs.List = List
Tabs.Tab = Tab
Tabs.Panel = Panel
