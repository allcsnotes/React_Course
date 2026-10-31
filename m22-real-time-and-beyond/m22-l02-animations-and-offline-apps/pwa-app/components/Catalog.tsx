'use client'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'

type Course = { slug: string; title: string; teacher: string; level: string }

export default function Catalog() {
  const [courses, setCourses] = useState<Course[]>([])
  const [servedAt, setServedAt] = useState('')
  const [cached, setCached] = useState(false)
  const [online, setOnline] = useState(true)

  useEffect(() => {
    fetch('http://localhost:8222/api/courses')
      .then((res) => {
        setCached(res.headers.get('x-from-cache') === 'yes')
        return res.json()
      })
      .then((data) => {
        setCourses(data.courses)
        setServedAt(data.servedAt)
      })
  }, [])

  useEffect(() => {
    const sync = () => setOnline(navigator.onLine)
    sync()
    window.addEventListener('online', sync)
    window.addEventListener('offline', sync)
    return () => {
      window.removeEventListener('online', sync)
      window.removeEventListener('offline', sync)
    }
  }, [])

  return (
    <>
      <span className={online ? 'bar' : 'bar off'} id="bar">
        {online ? 'Online' : 'Offline'}
        {servedAt && ` · data from ${servedAt}${cached ? ' (saved copy)' : ''}`}
      </span>
      <ul>
        <AnimatePresence>
          {courses.map((c, i) => (
            <motion.li
              key={c.slug}
              className="card"
              layout
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0, transition: { delay: i * 0.1 } }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.35 }}
            >
              <span>
                {c.title}
                <small>{c.teacher} · {c.level}</small>
              </span>
              <button onClick={() => setCourses(courses.filter((x) => x.slug !== c.slug))}>Hide</button>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </>
  )
}
