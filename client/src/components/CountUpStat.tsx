import { useEffect, useRef, useState } from 'react'
import type { LucideIcon } from 'lucide-react'

export default function CountUpStat({ value, suffix, label, icon: Icon, delay = 0 }: { value: number; suffix: string; label: string; icon: LucideIcon; delay?: number }) {
  const node = useRef<HTMLDivElement>(null)
  const [count, setCount] = useState(0)
  useEffect(() => {
    const element = node.current
    if (!element) return
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      observer.disconnect()
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setCount(value); return }
      const timeout = window.setTimeout(() => {
        const start = performance.now()
        const duration = 1050
        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1)
          const eased = 1 - Math.pow(1 - progress, 3)
          setCount(Math.round(value * eased))
          if (progress < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      }, delay)
      return () => window.clearTimeout(timeout)
    }, { threshold: 0.55 })
    observer.observe(element)
    return () => observer.disconnect()
  }, [delay, value])
  return <div ref={node} className="lux-stat"><Icon size={18} aria-hidden="true" /><strong>{count.toLocaleString('en-IN')}<i>{suffix}</i></strong><span>{label}</span></div>
}