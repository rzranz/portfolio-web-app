import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

export const TRANSITION_KEY = 'rz_nav_transition'

interface PageTransitionOverlayProps {
  exitingToExperience: boolean
}

export default function PageTransitionOverlay({
  exitingToExperience,
}: PageTransitionOverlayProps) {
  const [enteringFromExperience, setEnteringFromExperience] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    try {
      return window.sessionStorage.getItem(TRANSITION_KEY) === 'to-main'
    } catch {
      return false
    }
  })

  const overlayRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  // Smooth entrance curtain when returning from /experience/ -> Main Portfolio
  useEffect(() => {
    if (!enteringFromExperience || !overlayRef.current) return

    try {
      window.sessionStorage.removeItem(TRANSITION_KEY)
    } catch {
      // ignore storage restrictions
    }

    const prefersReduced =
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReduced) {
      setEnteringFromExperience(false)
      return
    }

    const canvas = document.getElementById('main-page-canvas')
    const tl = gsap.timeline({
      onComplete: () => {
        if (canvas) gsap.set(canvas, { clearProps: 'transform,opacity' })
        setEnteringFromExperience(false)
      },
    })

    if (canvas) {
      gsap.set(canvas, { scale: 0.985, opacity: 0.85 })
    }

    tl.fromTo(
      contentRef.current,
      { opacity: 0.95, y: 0 },
      { opacity: 0, y: -16, duration: 0.32, delay: 0.28, ease: 'power2.in' }
    )
      .to(
        overlayRef.current,
        {
          clipPath: 'inset(0% 0% 100% 0%)',
          duration: 0.72,
          ease: 'power4.inOut',
        },
        '-=0.1'
      )
      .to(
        canvas,
        {
          scale: 1,
          opacity: 1,
          duration: 0.68,
          ease: 'power3.out',
        },
        '-=0.58'
      )

    return () => {
      tl.kill()
      if (canvas) gsap.set(canvas, { clearProps: 'transform,opacity' })
    }
  }, [enteringFromExperience])

  // Smooth exit curtain when leaving Main Portfolio -> /experience/
  useEffect(() => {
    if (!exitingToExperience || !overlayRef.current) return

    try {
      window.sessionStorage.setItem(TRANSITION_KEY, 'to-experience')
    } catch {
      // ignore storage restrictions
    }

    const tl = gsap.timeline({
      onComplete: () => {
        window.location.href = '/experience/'
      },
    })

    tl.fromTo(
      overlayRef.current,
      { opacity: 0, clipPath: 'inset(0% 0% 0% 0%)' },
      { opacity: 1, duration: 0.42, ease: 'power3.inOut' }
    ).fromTo(
      contentRef.current,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.28, ease: 'power2.out' },
      '-=0.18'
    )

    return () => {
      tl.kill()
    }
  }, [exitingToExperience])

  if (!enteringFromExperience && !exitingToExperience) return null

  return (
    <div
      ref={overlayRef}
      aria-live="polite"
      className="fixed inset-0 z-[9999] bg-[#000000] text-[#f8fafc] flex items-center justify-center pointer-events-auto select-none"
      style={{ clipPath: 'inset(0% 0% 0% 0%)' }}
    >
      <div
        ref={contentRef}
        className="flex flex-col items-center gap-4 text-center px-6"
      >
        <img
          src="/RLogo.svg"
          alt="Randi Logo"
          className="w-11 h-11 rounded-xl opacity-95"
        />
        <span className="font-mono text-[11px] uppercase tracking-[0.26em] text-[#94a3b8]">
          {exitingToExperience ? 'Entering 3D Experience' : 'Welcome Back'}
        </span>
      </div>
    </div>
  )
}
