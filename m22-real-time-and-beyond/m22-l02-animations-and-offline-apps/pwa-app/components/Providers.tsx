'use client'
import { MotionConfig } from 'motion/react'
import RegisterSW from './RegisterSW'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <RegisterSW />
      {children}
    </MotionConfig>
  )
}
