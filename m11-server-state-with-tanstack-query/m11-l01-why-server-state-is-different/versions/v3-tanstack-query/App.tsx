import { useState } from 'react'
import { DealBanner } from './DealBanner'
import { CourseList } from './CourseList'

export default function App() {
  const [tab, setTab] = useState<'catalog' | 'cart'>('catalog')
  return (
    <main>
      <h1>allcsvideos</h1>
      <DealBanner />
      <nav>
        <button className={tab === 'catalog' ? 'on' : ''} onClick={() => setTab('catalog')}>Catalog</button>
        <button className={tab === 'cart' ? 'on' : ''} onClick={() => setTab('cart')}>Cart</button>
      </nav>
      {tab === 'catalog' ? <CourseList /> : <p className="note">Your cart is empty.</p>}
    </main>
  )
}
