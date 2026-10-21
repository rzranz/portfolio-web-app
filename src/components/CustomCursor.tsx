import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const isDesktopRef = useRef(false)
  const posRef = useRef({ x: -100, y: -100 })
  const trailRef = useRef({ x: -100, y: -100 })
  const hoveredRef = useRef(false)
  const rafRef = useRef<number>(0)
  const visibleRef = useRef(false)

  useEffect(() => {
    const checkPointer = () => {
      const hasFinePointer = window.matchMedia('(pointer: fine)').matches
      const isWide = window.innerWidth >= 1024
      isDesktopRef.current = hasFinePointer && isWide
      if (containerRef.current) {
        containerRef.current.style.display = isDesktopRef.current ? 'block' : 'none'
      }
    }
    checkPointer()
    window.addEventListener('resize', checkPointer, { passive: true })
    return () => window.removeEventListener('resize', checkPointer)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDesktopRef.current) return
      posRef.current = { x: e.clientX, y: e.clientY }
      if (!visibleRef.current) {
        visibleRef.current = true
        if (containerRef.current) containerRef.current.style.opacity = '1'
      }
    }

    const handleMouseLeave = () => {
      visibleRef.current = false
      if (containerRef.current) containerRef.current.style.opacity = '0'
    }

    const handleMouseOver = (e: MouseEvent) => {
      if (!isDesktopRef.current) return
      const target = e.target as HTMLElement | null
      const isHovered = !!(
        target &&
        (target.closest('a') ||
          target.closest('button') ||
          target.closest('.interactive') ||
          target.getAttribute('role') === 'button')
      )
      if (isHovered !== hoveredRef.current) {
        hoveredRef.current = isHovered
        // Apply changes directly to DOM
        if (dotRef.current) {
          dotRef.current.style.transform = `translate3d(${posRef.current.x}px, ${posRef.current.y}px, 0) scale(${isHovered ? 0.4 : 1})`
        }
        if (ringRef.current) {
          ringRef.current.style.transform = `translate3d(${trailRef.current.x}px, ${trailRef.current.y}px, 0) scale(${isHovered ? 1.6 : 1})`
          ringRef.current.style.backgroundColor = isHovered ? 'var(--color-border-glow)' : 'transparent'
        }
      }
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('mouseleave', handleMouseLeave)
    window.addEventListener('mouseover', handleMouseOver, { passive: true })

    // Single RAF loop - no React state, direct DOM mutations
    const animate = () => {
      const dx = posRef.current.x - trailRef.current.x
      const dy = posRef.current.y - trailRef.current.y
      trailRef.current.x += dx * 0.18
      trailRef.current.y += dy * 0.18

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${posRef.current.x}px, ${posRef.current.y}px, 0) scale(${hoveredRef.current ? 0.4 : 1})`
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${trailRef.current.x}px, ${trailRef.current.y}px, 0) scale(${hoveredRef.current ? 1.6 : 1})`
      }

      rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('mouseover', handleMouseOver)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden hidden lg:block"
      style={{ opacity: 0, transition: 'opacity 0.3s' }}
    >
      {/* Primary Dot - instant rAF positioning without CSS interpolation fighting */}
      <div
        ref={dotRef}
        className="fixed -top-1.5 -left-1.5 h-3 w-3 rounded-full bg-[var(--color-primary)] shadow-[0_0_10px_var(--color-primary)]"
        style={{
          transform: 'translate3d(-100px, -100px, 0)',
          willChange: 'transform',
        }}
      />
      {/* Elastic Trailing Ring */}
      <div
        ref={ringRef}
        className="fixed -top-5 -left-5 h-10 w-10 rounded-full border border-[var(--color-primary)]/40"
        style={{
          transform: 'translate3d(-100px, -100px, 0)',
          willChange: 'transform',
          transition: 'background-color 150ms ease',
        }}
      />
    </div>
  )
}
