import { Component, lazy, Suspense, useEffect, useRef, useState } from 'react'
import type { ErrorInfo, ReactNode } from 'react'

const HeroDumbbell = lazy(() => import('./HeroDumbbell'))

class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch(error: Error, _info: ErrorInfo) { console.warn('Hero 3D scene unavailable; using CSS fallback.', error.message) }
  render() { return this.state.failed ? <DumbbellFallback /> : this.props.children }
}

function DumbbellFallback() {
  return <div className="hero-weight-fallback" aria-hidden="true"><span className="fallback-weight"><i /><b /><i /></span><span className="fallback-weight-shadow" /></div>
}

export default function HeroVisual() {
  const host = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const element = host.current
    if (!element) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true)
        observer.disconnect()
      }
    }, { rootMargin: '120px' })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return <div ref={host} className="hero-visual" aria-label="Floating metallic black and gold dumbbell illustration">
    <DumbbellFallback />
    {visible && <SceneBoundary><Suspense fallback={null}><HeroDumbbell /></Suspense></SceneBoundary>}
  </div>
}