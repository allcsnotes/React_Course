import { createContext, useContext, useId } from 'react'
import type { ReactNode } from 'react'
import { useControllable } from './useControllable'

type Ctx = {
  value: string
  select: (v: string) => void
  base: string
}
const TabsContext = createContext<Ctx | null>(null)

function useTabs() {
  const ctx = useContext(TabsContext)
  if (!ctx) throw new Error('Put Tabs parts inside <Tabs>')
  return ctx
}

export type TabsProps = {
  /** The open tab, when you keep it in your own state. */
  value?: string
  /** The open tab at the start, when Tabs keeps its own memory. */
  defaultValue?: string
  onValueChange?: (value: string) => void
  children: ReactNode
}

function TabsRoot(props: TabsProps) {
  const { value, defaultValue = '', onValueChange, children } = props
  const [current, select] = useControllable(
    value,
    defaultValue,
    onValueChange,
  )
  const base = useId()
  return (
    <TabsContext value={{ value: current, select, base }}>
      <div className="tabs">{children}</div>
    </TabsContext>
  )
}

type ListProps = { label: string; children: ReactNode }

function List({ label, children }: ListProps) {
  return (
    <div role="tablist" aria-label={label}>
      {children}
    </div>
  )
}

type PartProps = { value: string; children: ReactNode }

function Tab({ value, children }: PartProps) {
  const { value: current, select, base } = useTabs()
  return (
    <button
      role="tab"
      type="button"
      id={`${base}-tab-${value}`}
      aria-selected={current === value}
      aria-controls={`${base}-panel-${value}`}
      onClick={() => select(value)}
    >
      {children}
    </button>
  )
}

function Panel({ value, children }: PartProps) {
  const { value: current, base } = useTabs()
  if (current !== value) return null
  return (
    <div
      role="tabpanel"
      id={`${base}-panel-${value}`}
      aria-labelledby={`${base}-tab-${value}`}
      tabIndex={0}
    >
      {children}
    </div>
  )
}

export const Tabs = Object.assign(TabsRoot, { List, Tab, Panel })
