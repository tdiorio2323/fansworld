import { useEffect, useRef } from 'react'

/**
 * Parallax background component that moves slower than scroll.
 * Uses a fixed gradient to maintain the Cabana aesthetic.
 */
export function ParallaxBackground() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        ref.current.style.transform = `translateY(${window.scrollY * 0.3}px)`
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div
        ref={ref}
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(135deg, #0A0B14 0%, #1A0B2E 20%, #C77DFF 40%, #FF006E 60%, #B400FF 80%, #0A0B14 100%)',
        }}
      />
    </div>
  )
}
