import { useState, type PointerEvent, type ReactNode } from 'react'

export default function TiltCard({ children, className = '', amount = 3 }: { children: ReactNode; className?: string; amount?: number }) {
  const [transform, setTransform] = useState('perspective(900px) rotateX(0deg) rotateY(0deg)')
  const move = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const bounds = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - bounds.left) / bounds.width - 0.5
    const y = (event.clientY - bounds.top) / bounds.height - 0.5
    setTransform(`perspective(900px) rotateX(${y * -amount}deg) rotateY(${x * amount}deg) translateY(-3px)`)
  }
  return <div className={`tilt-card ${className}`} style={{ transform, transition: 'transform 220ms ease' }} onPointerMove={move} onPointerLeave={() => setTransform('perspective(900px) rotateX(0deg) rotateY(0deg)')}>
    {children}
  </div>
}