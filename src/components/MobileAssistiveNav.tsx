import { useEffect, useRef, useState } from 'react'
import { Home, User, Cpu, Briefcase, Award, Mail, X } from 'lucide-react'
import { useLanguage } from '../lib/i18n'
import { scrollToSection } from '../lib/scroll'

interface NavBubble {
  id: string
  href: string
  labelEn: string
  labelId: string
  icon: typeof Home
}

const NAV_BUBBLES: NavBubble[] = [
  { id: 'hero', href: '#hero', labelEn: 'Home', labelId: 'Beranda', icon: Home },
  { id: 'about', href: '#about', labelEn: 'About', labelId: 'Tentang', icon: User },
  { id: 'tech', href: '#tech', labelEn: 'Stack', labelId: 'Teknologi', icon: Cpu },
  { id: 'works', href: '#works', labelEn: 'Works', labelId: 'Karya', icon: Briefcase },
  { id: 'experience', href: '#experience', labelEn: 'Journey', labelId: 'Perjalanan', icon: Award },
  { id: 'contact', href: '#contact', labelEn: 'Contact', labelId: 'Kontak', icon: Mail },
]

const ORB_SIZE = 54
const EDGE_MARGIN = 16
const BUBBLE_SIZE = 44
const BUBBLE_GAP = 10

function getInitialPos() {
  if (typeof window === 'undefined') return { x: 300, y: 520 }
  return {
    x: Math.max(EDGE_MARGIN, window.innerWidth - ORB_SIZE - EDGE_MARGIN),
    y: Math.round(window.innerHeight * 0.62),
  }
}

export default function MobileAssistiveNav() {
  const { language } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [pos, setPos] = useState<{ x: number; y: number }>(getInitialPos)
  const [snapping, setSnapping] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const posRef = useRef(pos)
  const dragRef = useRef({
    active: false,
    pointerId: -1,
    startPointerX: 0,
    startPointerY: 0,
    startOrbX: 0,
    startOrbY: 0,
    moved: false,
  })

  // Keep orb inside viewport on resize / orientation change
  useEffect(() => {
    const handleResize = () => {
      const maxX = Math.max(EDGE_MARGIN, window.innerWidth - ORB_SIZE - EDGE_MARGIN)
      const maxY = Math.max(EDGE_MARGIN + 64, window.innerHeight - ORB_SIZE - EDGE_MARGIN)
      const snapLeft = posRef.current.x + ORB_SIZE / 2 < window.innerWidth / 2
      const next = {
        x: snapLeft ? EDGE_MARGIN : maxX,
        y: Math.min(Math.max(EDGE_MARGIN + 64, posRef.current.y), maxY),
      }
      posRef.current = next
      setPos(next)
      if (containerRef.current) {
        containerRef.current.style.transform = `translate3d(${next.x}px, ${next.y}px, 0)`
      }
    }
    window.addEventListener('resize', handleResize, { passive: true })
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    setSnapping(false)
    dragRef.current = {
      active: true,
      pointerId: e.pointerId,
      startPointerX: e.clientX,
      startPointerY: e.clientY,
      startOrbX: posRef.current.x,
      startOrbY: posRef.current.y,
      moved: false,
    }
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current
    if (!drag.active || drag.pointerId !== e.pointerId) return

    const dx = e.clientX - drag.startPointerX
    const dy = e.clientY - drag.startPointerY

    if (!drag.moved && Math.hypot(dx, dy) > 6) {
      drag.moved = true
      if (isOpen) setIsOpen(false)
    }

    if (drag.moved) {
      const maxX = Math.max(EDGE_MARGIN, window.innerWidth - ORB_SIZE - EDGE_MARGIN)
      const maxY = Math.max(EDGE_MARGIN + 64, window.innerHeight - ORB_SIZE - EDGE_MARGIN)
      const nextX = Math.min(Math.max(EDGE_MARGIN, drag.startOrbX + dx), maxX)
      const nextY = Math.min(Math.max(EDGE_MARGIN + 64, drag.startOrbY + dy), maxY)
      posRef.current = { x: nextX, y: nextY }
      // Direct GPU transform mutation — zero React re-renders during drag
      if (containerRef.current) {
        containerRef.current.style.transition = 'none'
        containerRef.current.style.transform = `translate3d(${nextX}px, ${nextY}px, 0)`
      }
    }
  }

  const handlePointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    const drag = dragRef.current
    if (!drag.active || drag.pointerId !== e.pointerId) return
    drag.active = false

    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId)
    }

    if (drag.moved) {
      const maxX = Math.max(EDGE_MARGIN, window.innerWidth - ORB_SIZE - EDGE_MARGIN)
      const snapLeft = posRef.current.x + ORB_SIZE / 2 < window.innerWidth / 2
      const snapped = {
        x: snapLeft ? EDGE_MARGIN : maxX,
        y: posRef.current.y,
      }
      posRef.current = snapped
      setSnapping(true)
      setPos(snapped)
    } else {
      setIsOpen((prev) => !prev)
    }
  }

  const handleSelectSection = (href: string) => {
    setIsOpen(false)
    scrollToSection(href, 0.85)
  }

  // Smart vertical distribution so bubbles never clip off top/bottom of viewport
  const viewportW = typeof window !== 'undefined' ? window.innerWidth : 390
  const viewportH = typeof window !== 'undefined' ? window.innerHeight : 844
  const isOnRightHalf = pos.x + ORB_SIZE / 2 >= viewportW / 2

  const step = BUBBLE_SIZE + BUBBLE_GAP
  const spaceAbove = pos.y - (EDGE_MARGIN + 56)
  const spaceBelow = viewportH - (pos.y + ORB_SIZE) - EDGE_MARGIN
  const maxAbove = Math.max(0, Math.floor(spaceAbove / step))
  const maxBelow = Math.max(0, Math.floor(spaceBelow / step))

  let aboveCount = Math.min(3, maxAbove)
  let belowCount = Math.min(NAV_BUBBLES.length - aboveCount, maxBelow)
  if (aboveCount + belowCount < NAV_BUBBLES.length) {
    const remaining = NAV_BUBBLES.length - (aboveCount + belowCount)
    if (maxAbove - aboveCount >= remaining) {
      aboveCount += remaining
    } else {
      belowCount = NAV_BUBBLES.length - aboveCount
    }
  }

  const aboveBubbles = NAV_BUBBLES.slice(0, aboveCount)
  const belowBubbles = NAV_BUBBLES.slice(aboveCount)

  return (
    <div className="md:hidden">
      {/* Lightweight tap-outside backdrop (CSS opacity only, zero mount/unmount jank) */}
      <div
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
        className={`fixed inset-0 z-[64] bg-black/30 transition-opacity duration-150 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Draggable Floating Logo Orb Container */}
      <div
        ref={containerRef}
        style={{
          transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
          transition: snapping ? 'transform 260ms cubic-bezier(0.22, 1, 0.36, 1)' : 'none',
          willChange: 'transform',
        }}
        className="fixed top-0 left-0 z-[65] select-none"
      >
        {/* Bubbles radiating ABOVE the center button — pure GPU CSS transforms */}
        {aboveBubbles.map((item, idx) => {
          const Icon = item.icon
          const orderFromCenter = aboveBubbles.length - idx
          const offsetY = -(orderFromCenter * step)
          const label = language === 'id' ? item.labelId : item.labelEn
          const delayMs = isOpen ? (orderFromCenter - 1) * 22 : 0

          return (
            <button
              key={item.id}
              type="button"
              tabIndex={isOpen ? 0 : -1}
              onClick={() => handleSelectSection(item.href)}
              style={{
                width: BUBBLE_SIZE,
                height: BUBBLE_SIZE,
                transform: isOpen
                  ? `translate3d(0, ${offsetY}px, 0) scale(1)`
                  : 'translate3d(0, 0, 0) scale(0.5)',
                opacity: isOpen ? 1 : 0,
                transition: `transform 210ms cubic-bezier(0.22, 1, 0.36, 1) ${delayMs}ms, opacity 160ms ease ${delayMs}ms`,
                willChange: 'transform, opacity',
              }}
              className={`absolute top-[5px] left-[5px] rounded-full bg-[var(--color-surface)] border border-[var(--color-border-subtle)] text-[var(--color-text-main)] flex items-center justify-center active:scale-90 cursor-pointer ${
                isOpen ? 'pointer-events-auto' : 'pointer-events-none'
              }`}
              aria-label={label}
            >
              <Icon className="w-[18px] h-[18px]" />
              <span
                className={`pointer-events-none absolute top-1/2 -translate-y-1/2 px-2 py-0.5 rounded bg-[var(--color-surface)] border border-[var(--color-border-subtle)] font-mono text-[10px] font-semibold tracking-wider uppercase text-[var(--color-text-main)] whitespace-nowrap ${
                  isOnRightHalf ? 'right-[52px]' : 'left-[52px]'
                }`}
              >
                {label}
              </span>
            </button>
          )
        })}

        {/* Bubbles radiating BELOW the center button — pure GPU CSS transforms */}
        {belowBubbles.map((item, idx) => {
          const Icon = item.icon
          const orderFromCenter = idx + 1
          const offsetY = orderFromCenter * step + 10
          const label = language === 'id' ? item.labelId : item.labelEn
          const delayMs = isOpen ? idx * 22 : 0

          return (
            <button
              key={item.id}
              type="button"
              tabIndex={isOpen ? 0 : -1}
              onClick={() => handleSelectSection(item.href)}
              style={{
                width: BUBBLE_SIZE,
                height: BUBBLE_SIZE,
                transform: isOpen
                  ? `translate3d(0, ${offsetY}px, 0) scale(1)`
                  : 'translate3d(0, 0, 0) scale(0.5)',
                opacity: isOpen ? 1 : 0,
                transition: `transform 210ms cubic-bezier(0.22, 1, 0.36, 1) ${delayMs}ms, opacity 160ms ease ${delayMs}ms`,
                willChange: 'transform, opacity',
              }}
              className={`absolute top-[5px] left-[5px] rounded-full bg-[var(--color-surface)] border border-[var(--color-border-subtle)] text-[var(--color-text-main)] flex items-center justify-center active:scale-90 cursor-pointer ${
                isOpen ? 'pointer-events-auto' : 'pointer-events-none'
              }`}
              aria-label={label}
            >
              <Icon className="w-[18px] h-[18px]" />
              <span
                className={`pointer-events-none absolute top-1/2 -translate-y-1/2 px-2 py-0.5 rounded bg-[var(--color-surface)] border border-[var(--color-border-subtle)] font-mono text-[10px] font-semibold tracking-wider uppercase text-[var(--color-text-main)] whitespace-nowrap ${
                  isOnRightHalf ? 'right-[52px]' : 'left-[52px]'
                }`}
              >
                {label}
              </span>
            </button>
          )
        })}

        {/* Center Draggable Floating Orb with User's Brand Logo (/RLogo.svg) */}
        <button
          type="button"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          style={{ width: ORB_SIZE, height: ORB_SIZE, touchAction: 'none' }}
          aria-expanded={isOpen}
          aria-label={isOpen ? 'Close navigation' : 'Open navigation'}
          className={`relative z-10 rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing transition-colors duration-150 ${
            isOpen
              ? 'bg-[var(--color-surface)] border-2 border-[var(--color-primary)] text-[var(--color-text-main)]'
              : 'bg-[var(--color-surface)] border border-[var(--color-border-subtle)]'
          }`}
        >
          {isOpen ? (
            <X className="w-5 h-5 text-[var(--color-text-main)]" />
          ) : (
            <img
              src="/RLogo.svg"
              alt="RANN"
              draggable={false}
              className="w-8 h-8 rounded-full object-contain pointer-events-none select-none"
            />
          )}
        </button>
      </div>
    </div>
  )
}
