import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

type Range = '1h' | '24h'
const raw = new URLSearchParams(location.search).get('points') === 'raw'

function Widget({ title, status, error, retry, children }: { title: string; status: string; error?: string; retry: () => void; children: React.ReactNode }) {
  return (
    <section className="widget" aria-labelledby={'w-' + title.replace(/ /g, '-')}>
      <h2 id={'w-' + title.replace(/ /g, '-')}>{title}</h2>
      {status === 'pending' && <p className="muted">Loading…</p>}
      {status === 'error' && (
        <div role="alert">
          {error} <button className="btn" onClick={retry}>Retry</button>
        </div>
      )}
      {status === 'success' && children}
    </section>
  )
}

function useJson<T>(url: string, refetchInterval?: number) {
  return useQuery<T>({ queryKey: [url], queryFn: async () => { const r = await fetch(url); if (!r.ok) throw new Error((await r.json()).error); return r.json() }, refetchInterval })
}

function Chart({ values }: { values: number[] }) {
  const max = Math.max(...values), min = Math.min(...values)
  const d = values.map((v, i) => `${i === 0 ? 'M' : 'L'}${((i / (values.length - 1)) * 600).toFixed(1)},${(100 - ((v - min) / (max - min)) * 90).toFixed(1)}`).join('')
  return (
    <svg className="chart" viewBox="0 0 600 100" preserveAspectRatio="none" role="img" aria-label={`Requests per second, ${values.length} points, lowest ${min}, highest ${max}`}>
      <path d={d} fill="none" stroke="#1a7cff" strokeWidth="2" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

export default function Dashboard() {
  const [range, setRange] = useState<Range>((new URLSearchParams(location.search).get('range') as Range) ?? '24h')
  const pick = (r: Range) => {
    setRange(r)
    const u = new URL(location.href)
    u.searchParams.set('range', r)
    history.replaceState(null, '', u)
  }
  const series = useJson<{ values: number[] }>(`/api/dash/series?range=${range}${raw ? '&raw=1' : '&points=288'}`)
  const top = useJson<{ rows: [string, number][] }>('/api/dash/top')
  const revenue = useJson<{ today: number }>('/api/dash/revenue')
  const live = useJson<{ learners: number }>('/api/dash/live', 5000)
  return (
    <main className="app">
      <h1>Dashboard</h1>
      <div className="tabs">
        {(['1h', '24h'] as Range[]).map((r) => <button key={r} aria-pressed={range === r} onClick={() => pick(r)}>{r === '1h' ? 'Last hour' : 'Last 24 hours'}</button>)}
      </div>
      <div className="grid">
        <Widget title="Requests per second" status={series.status} error={series.error?.message} retry={() => series.refetch()}>
          {series.data && <Chart values={series.data.values} />}
        </Widget>
        <Widget title="Revenue today" status={revenue.status} error={revenue.error?.message} retry={() => revenue.refetch()}>
          <div className="big">${revenue.data?.today.toLocaleString()}</div>
        </Widget>
        <Widget title="Top courses" status={top.status} error={top.error?.message} retry={() => top.refetch()}>
          <ul className="rows">{top.data?.rows.map(([n, v]) => <li key={n}><span>{n}</span><b>{v}</b></li>)}</ul>
        </Widget>
        <Widget title="Learners online" status={live.status} error={live.error?.message} retry={() => live.refetch()}>
          <div className="big">{live.data?.learners}</div>
        </Widget>
      </div>
    </main>
  )
}
