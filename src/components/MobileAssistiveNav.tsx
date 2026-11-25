import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
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
const BUBBLE_SIZE = 46
const BUBBLE_GAP = 10

export default function MobileAssistiveNav() {
  const { language } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [snapping, setSnapping] = useState(false)

  // Default position: right edge, lower-middle of screen (thumb-friendly)
  const [pos, setPos] = useState<{ x: number; y: number }>(() => {
    if (typeof window === 'undefined') return { x: 300, y: 520 }
    return {
      x: Math.max(EDGE_MARGIN, window.innerWidth - ORB_SIZE - EDGE_MARGIN),
      y: Math.round(window.innerHeight * 0.62),
    }
  })

  const dragStateRef = useRef({
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
      setPos((prev) => {
        const maxX = Math.max(EDGE_MARGIN, window.innerWidth - ORB_SIZE - EDGE_MARGIN)
        const maxY = Math.max(EDGE_MARGIN + 64, window.innerHeight - ORB_SIZE - EDGE_MARGIN)
        const snapLeft = prev.x + ORB_SIZE / 2 < window.innerWidth / 2
        return {
          x: snapLeft ? EDGE_MARGIN : maxX,
          y: Math.min(Math.max(EDGE_MARGIN + 64, prev.y), maxY),
        }
      })
    }
    window.addEventListener('resize', handleResize, { passive: true })
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    setSnapping(false)
    dragStateRef.current = {
      active: true,
      pointerId: e.pointerId,
      startPointerX: e.clientX,
      startPointerY: e.clientY,
      startOrbX: pos.x,
      startOrbY: pos.y,
      moved: false,
    }
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    const drag = dragStateRef.current
    if (!drag.active || drag.pointerId !== e.pointerId) return

    const dx = e.clientX - drag.startPointerX
    const dy = e.clientY - drag.startPointerY

    if (!drag.moved && Math.hypot(dx, dy) > 6) {
      drag.moved = true
      setIsDragging(true)
      if (isOpen) setIsOpen(false)
    }

    if (drag.moved) {
      const maxX = Math.max(EDGE_MARGIN, window.innerWidth - ORB_SIZE - EDGE_MARGIN)
      const maxY = Math.max(EDGE_MARGIN + 64, window.innerHeight - ORB_SIZE - EDGE_MARGIN)
      const nextX = Math.min(Math.max(EDGE_MARGIN, drag.startOrbX + dx), maxX)
      const nextY = Math.min(Math.max(EDGE_MARGIN + 64, drag.startOrbY + dy), maxY)
      setPos({ x: nextX, y: nextY })
    }
  }

  const handlePointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    const drag = dragStateRef.current
    if (!drag.active || drag.pointerId !== e.pointerId) return
    drag.active = false

    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId)
    }

    if (drag.moved) {
      setIsDragging(false)
      // Magnetic snap to nearest left or right edge like iPhone AssistiveTouch
      setSnapping(true)
      const maxX = Math.max(EDGE_MARGIN, window.innerWidth - ORB_SIZE - EDGE_MARGIN)
      const snapToLeft = pos.x + ORB_SIZE / 2 < window.innerWidth / 2
      setPos((prev) => ({
        x: snapToLeft ? EDGE_MARGIN : maxX,
        y: prev.y,
      }))
    } else {
      setIsOpen((prev) => !prev)
    }
  }

  const handleSelectSection = (href: string) => {
    setIsOpen(false)
    setTimeout(() => {
      scrollToSection(href, 0.9)
    }, 80)
  }

  // Determine smart layout for bubbles so they never overflow top/bottom/sides
  const viewportW = typeof window !== 'undefined' ? window.innerWidth : 390
  const viewportH = typeof window !== 'undefined' ? window.innerHeight : 844
  const isOnRightHalf = pos.x + ORB_SIZE / 2 >= viewportW / 2

  // Split bubbles above and below the center orb (matching reference image), clamped to viewport
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
      {/* Tap-outside backdrop when expanded */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-[64] bg-black/35"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Draggable AssistiveTouch Container */}
      <div
        style={{
          transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
          transition: snapping ? 'transform 320ms cubic-bezier(0.22, 1, 0.36, 1)' : 'none',
        }}
        className="fixed top-0 left-0 z-[65] select-none"
      >
        {/* Bubbles radiating ABOVE the center orb */}
        <AnimatePresence>
          {isOpen &&
            aboveBubbles.map((item, idx) => {
              const Icon = item.icon
              const orderFromCenter = aboveBubbles.length - idx
              const offsetY = -(orderFromCenter * step)
              const label = language === 'id' ? item.labelId : item.labelEn

              return (
                <motion.button
                  key={item.id}
                  type="button"
                  initial={{ opacity: 0, scale: 0.35, y: 0 }}
                  animate={{ opacity: 1, scale: 1, y: offsetY }}
                  exit={{ opacity: 0, scale: 0.35, y: 0 }}
                  transition={{
                    type: 'spring',
                    stiffness: 420,
                    damping: 26,
                    delay: (orderFromCenter - 1) * 0.035,
                  }}
                  onClick={() => handleSelectSection(item.href)}
                  style={{ width: BUBBLE_SIZE, height: BUBBLE_SIZE }}
                  className="absolute top-1 left-1 rounded-full bg-[var(--color-surface)] border border-[var(--color-border-subtle)] text-[var(--color-text-main)] shadow-[0_6px_20px_rgba(0,0,0,0.45)] flex items-center justify-center active:scale-90 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors cursor-pointer"
                  aria-label={label}
                >
                  <Icon className="w-[18px] h-[18px]" />
                  <span
                    className={`pointer-events-none absolute top-1/2 -translate-y-1/2 px-2 py-0.5 rounded-md bg-[var(--color-surface)] border border-[var(--color-border-subtle)] font-mono text-[10px] font-semibold tracking-wider uppercase text-[var(--color-text-main)] whitespace-nowrap shadow-sm ${
                      isOnRightHalf ? 'right-[54px]' : 'left-[54px]'
                    }`}
                  >
                    {label}
                  </span>
                </motion.button>
              )
            })}
        </AnimatePresence>

        {/* Bubbles radiating BELOW the center orb */}
        <AnimatePresence>
          {isOpen &&
            belowBubbles.map((item, idx) => {
              const Icon = item.icon
              const orderFromCenter = idx + 1
              const offsetY = orderFromCenter * step + 8
              const label = language === 'id' ? item.labelId : item.labelEn

              return (
                <motion.button
                  key={item.id}
                  type="button"
                  initial={{ opacity: 0, scale: 0.35, y: 0 }}
                  animate={{ opacity: 1, scale: 1, y: offsetY }}
                  exit={{ opacity: 0, scale: 0.35, y: 0 }}
                  transition={{
                    type: 'spring',
                    stiffness: 420,
                    damping: 26,
                    delay: idx * 0.035,
                  }}
                  onClick={() => handleSelectSection(item.href)}
                  style={{ width: BUBBLE_SIZE, height: BUBBLE_SIZE }}
                  className="absolute top-1 left-1 rounded-full bg-[var(--color-surface)] border border-[var(--color-border-subtle)] text-[var(--color-text-main)] shadow-[0_6px_20px_rgba(0,0,0,0.45)] flex items-center justify-center active:scale-90 hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors cursor-pointer"
                  aria-label={label}
                >
                  <Icon className="w-[18px] h-[18px]" />
                  <span
                    className={`pointer-events-none absolute top-1/2 -translate-y-1/2 px-2 py-0.5 rounded-md bg-[var(--color-surface)] border border-[var(--color-border-subtle)] font-mono text-[10px] font-semibold tracking-wider uppercase text-[var(--color-text-main)] whitespace-nowrap shadow-sm ${
                      isOnRightHalf ? 'right-[54px]' : 'left-[54px]'
                    }`}
                  >
                    {label}
                  </span>
                </motion.button>
              )
            })}
        </AnimatePresence>

        {/* Center Draggable iPhone AssistiveTouch Orb */}
        <button
          type="button"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          style={{ width: ORB_SIZE, height: ORB_SIZE, touchAction: 'none' }}
          aria-expanded={isOpen}
          aria-label={isOpen ? 'Close navigation' : 'Open navigation'}
          className={`relative z-10 rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing transition-all duration-200 ${
            isOpen
              ? 'bg-[var(--color-surface)] border-2 border-[var(--color-primary)] text-[var(--color-text-main)] shadow-[0_8px_24px_rgba(0,0,0,0.55)] opacity-100 scale-105'
              : isDragging
              ? 'bg-[var(--color-surface)]/95 border border-[var(--color-primary)]/80 shadow-[0_10px_28px_rgba(0,0,0,0.6)] opacity-100 scale-105'
              : 'bg-[var(--color-surface)]/85 border border-[var(--color-border-subtle)] shadow-[0_6px_20px_rgba(0,0,0,0.45)] opacity-80 active:opacity-100'
          }`}
        >
          {isOpen ? (
            <X className="w-5 h-5 text-[var(--color-text-main)]" />
          ) : (
            /* iPhone AssistiveTouch concentric rings */
            <span className="w-9 h-9 rounded-full border border-[var(--color-text-muted)]/35 flex items-center justify-center">
              <span className="w-6 h-6 rounded-full border border-[var(--color-text-muted)]/50 flex items-center justify-center">
                <span className="w-3.5 h-3.5 rounded-full bg-[var(--color-text-main)]" />
              </span>
            </span>
          )}
        </button>
      </div>
    </div>
  )
}
