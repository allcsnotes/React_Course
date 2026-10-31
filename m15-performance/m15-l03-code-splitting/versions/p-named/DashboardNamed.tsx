import { useState } from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const WEEK = [
  { day: 'Mon', minutes: 120 }, { day: 'Tue', minutes: 95 }, { day: 'Wed', minutes: 160 }, { day: 'Thu', minutes: 70 },
  { day: 'Fri', minutes: 140 }, { day: 'Sat', minutes: 210 }, { day: 'Sun', minutes: 180 },
]
const MONTH = [
  { day: 'Wk 1', minutes: 640 }, { day: 'Wk 2', minutes: 810 }, { day: 'Wk 3', minutes: 720 }, { day: 'Wk 4', minutes: 930 },
]

export function DashboardPage() {
  const [range, setRange] = useState<'7' | '30'>('7')
  return (
    <div className="page">
      <h2>Watch minutes</h2>
      <div className="range">
        <button className={'nav' + (range === '7' ? ' on' : '')} onClick={() => setRange('7')}>7 days</button>
        <button className={'nav' + (range === '30' ? ' on' : '')} onClick={() => setRange('30')}>30 days</button>
      </div>
      <div style={{ height: 190 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={range === '7' ? WEEK : MONTH}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" fontSize={17} />
            <YAxis fontSize={17} />
            <Tooltip />
            <Bar dataKey="minutes" fill="#1a7cff" isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
