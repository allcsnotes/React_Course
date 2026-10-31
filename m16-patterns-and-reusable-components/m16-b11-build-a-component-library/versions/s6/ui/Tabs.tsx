import { createContext, useContext, useId, useRef } from 'react'
import type { KeyboardEvent, ReactNode } from 'react'
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

type TabsBase = { children: ReactNode }

/** Either you own the open tab, or Tabs does. */
export type TabsProps =
  | (TabsBase & {
      /** The open tab, kept in your own state. */
      value: string
      onValueChange: (value: string) => void
      defaultValue?: never
    })
  | (TabsBase & {
      value?: never
      /** The open tab at the start. Tabs keeps its own memory. */
      defaultValue?: string
      onValueChange?: (value: string) => void
    })

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
  const { select } = useTabs()
  const ref = useRef<HTMLDivElement>(null)

  function onKeyDown(e: KeyboardEvent) {
    const list = ref.current!
    const tabs = [...list.querySelectorAll<HTMLElement>('[role=tab]')]
    const at = tabs.indexOf(e.target as HTMLElement)
    const go: Record<string, number> = {
      ArrowRight: at + 1,
      ArrowLeft: at - 1,
      Home: 0,
      End: tabs.length - 1,
    }
    if (!(e.key in go)) return
    e.preventDefault()
    const tab = tabs[(go[e.key] + tabs.length) % tabs.length]
    tab.focus()
    select(tab.dataset.value!)
  }

  return (
    <div
      role="tablist"
      aria-label={label}
      ref={ref}
      onKeyDown={onKeyDown}
    >
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
      data-value={value}
      id={`${base}-tab-${value}`}
      tabIndex={current === value ? 0 : -1}
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
