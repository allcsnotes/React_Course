'use client'
import { useState } from 'react'
import { motion } from 'motion/react'

export default function Bench() {
  const [left, setLeft] = useState(false)
  const [x, setX] = useState(false)
  return (
    <>
      <div className="row">
        <button id="goLeft" onClick={() => setLeft(!left)}>Move with left</button>
        <button id="goX" onClick={() => setX(!x)}>Move with x</button>
      </div>
      <div className="lbl">animate left (layout)</div>
      <div className="lane">
        <motion.div
          className="box"
          animate={{ left: left ? 560 : 0 }}
          transition={{ duration: 1 }}
        />
      </div>
      <div className="lbl">animate x (transform)</div>
      <div className="lane">
        <motion.div
          className="box"
          animate={{ x: x ? 560 : 0 }}
          transition={{ duration: 1 }}
        />
      </div>
      <ul>
        {Array.from({ length: 3000 }, (_, i) => (
          <li key={i}>row {i}</li>
        ))}
      </ul>
    </>
  )
}
