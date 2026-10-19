import { useEffect, useState } from 'react'

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 })
  const [trailingPos, setTrailingPos] = useState({ x: -100, y: -100 })
  const [isHovered, setIsHovered] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isDesktopMouse, setIsDesktopMouse] = useState(false)

  useEffect(() => {
    const checkPointer = () => {
      const hasFinePointer = window.matchMedia('(pointer: fine)').matches
      const isWide = window.innerWidth >= 1024
      setIsDesktopMouse(hasFinePointer && isWide)
    }
    checkPointer()
    window.addEventListener('resize', checkPointer)
    return () => window.removeEventListener('resize', checkPointer)
  }, [])

  useEffect(() => {
    if (!isDesktopMouse) return

    const handleMouseMove = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true)
      setPosition({ x: e.clientX, y: e.clientY })
    }

    const handleMouseLeave = () => {
      setIsVisible(false)
    }

    const handleElementHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      if (
        target &&
        (target.closest('a') ||
          target.closest('button') ||
          target.closest('.interactive') ||
          target.getAttribute('role') === 'button')
      ) {
        setIsHovered(true)
      } else {
        setIsHovered(false)
      }
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('mouseleave', handleMouseLeave)
    window.addEventListener('mouseover', handleElementHover, { passive: true })

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('mouseover', handleElementHover)
    }
  }, [isVisible, isDesktopMouse])

  useEffect(() => {
    if (!isDesktopMouse) return

    let animationFrameId: number

    const updateTrailing = () => {
      setTrailingPos((prev) => {
        const dx = position.x - prev.x
        const dy = position.y - prev.y
        return {
          x: prev.x + dx * 0.18,
          y: prev.y + dy * 0.18,
        }
      })
      animationFrameId = requestAnimationFrame(updateTrailing)
    }

    animationFrameId = requestAnimationFrame(updateTrailing)
    return () => cancelAnimationFrame(animationFrameId)
  }, [position, isDesktopMouse])

  if (!isDesktopMouse || !isVisible) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden hidden lg:block">
      {/* Primary Dot */}
      <div
        className="fixed -top-1.5 -left-1.5 h-3 w-3 rounded-full bg-[var(--color-primary)] transition-transform duration-75 ease-out shadow-[0_0_10px_var(--color-primary)]"
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${isHovered ? 0.4 : 1})`,
        }}
      />
      {/* Elastic Trailing Ring */}
      <div
        className="fixed -top-5 -left-5 h-10 w-10 rounded-full border border-[var(--color-primary)]/40 transition-all duration-150 ease-out will-change-transform"
        style={{
          transform: `translate3d(${trailingPos.x}px, ${trailingPos.y}px, 0) scale(${isHovered ? 1.6 : 1})`,
          backgroundColor: isHovered ? 'var(--color-border-glow)' : 'transparent',
        }}
      />
    </div>
  )
}
