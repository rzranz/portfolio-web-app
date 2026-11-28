import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

const TRANSITION_KEY = 'rz_nav_transition'

function shouldPlayReturnLoader(): boolean {
  if (typeof window === 'undefined') return false
  const prefersReduced =
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReduced) return false

  try {
    if (window.sessionStorage.getItem(TRANSITION_KEY) === 'to-main') return true
  } catch {
    // ignore storage restrictions
  }

  if (window.location.search.includes('from=experience')) return true
  if (document.referrer && document.referrer.includes('/experience')) return true
  return false
}

interface PageTransitionOverlayProps {
  exitingToExperience: boolean
  onResetExit?: () => void
}

export default function PageTransitionOverlay({
  exitingToExperience,
  onResetExit,
}: PageTransitionOverlayProps) {
  const [enteringFromExperience, setEnteringFromExperience] = useState<boolean>(() =>
    shouldPlayReturnLoader()
  )

  const overlayRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)

  // Handle browser Back/Forward cache (bfcache) restoration from /experience/
  useEffect(() => {
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        if (onResetExit) onResetExit()
        setEnteringFromExperience(true)
      }
    }
    window.addEventListener('pageshow', handlePageShow)
    return () => window.removeEventListener('pageshow', handlePageShow)
  }, [onResetExit])

  // Smooth loading + entrance curtain when returning from /experience/ -> Main Portfolio
  useEffect(() => {
    if (!enteringFromExperience || !overlayRef.current) return

    try {
      window.sessionStorage.removeItem(TRANSITION_KEY)
    } catch {
      // ignore storage restrictions
    }

    // Clean ?from=experience from URL without reloading
    if (window.location.search.includes('from=experience')) {
      const cleanUrl = window.location.pathname + window.location.hash
      window.history.replaceState(null, '', cleanUrl)
    }

    const canvas = document.getElementById('main-page-canvas')
    document.documentElement.style.backgroundColor = ''

    const tl = gsap.timeline({
      onComplete: () => {
        if (canvas) gsap.set(canvas, { clearProps: 'transform,opacity' })
        setEnteringFromExperience(false)
      },
    })

    if (canvas) {
      gsap.set(canvas, { scale: 0.96, y: 24, opacity: 0 })
    }

    gsap.set(overlayRef.current, {
      opacity: 1,
      clipPath: 'inset(0% 0% 0% 0%)',
    })

    if (progressBarRef.current) {
      gsap.set(progressBarRef.current, { scaleX: 0, transformOrigin: 'left center' })
    }

    tl.fromTo(
      contentRef.current,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.28, ease: 'power2.out' }
    )
      .to(
        progressBarRef.current,
        { scaleX: 1, duration: 0.62, ease: 'power2.inOut' },
        '-=0.12'
      )
      .to(
        contentRef.current,
        { opacity: 0, y: -16, duration: 0.26, ease: 'power2.in' },
        '+=0.08'
      )
      .to(
        overlayRef.current,
        {
          clipPath: 'inset(0% 0% 100% 0%)',
          duration: 0.76,
          ease: 'power4.inOut',
        },
        '-=0.06'
      )

    if (canvas) {
      tl.to(
        canvas,
        {
          scale: 1,
          y: 0,
          opacity: 1,
          duration: 0.78,
          ease: 'power3.out',
        },
        '-=0.58'
      )
    }

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

    if (progressBarRef.current) {
      gsap.set(progressBarRef.current, { scaleX: 0, transformOrigin: 'left center' })
    }

    tl.fromTo(
      overlayRef.current,
      { opacity: 0, clipPath: 'inset(0% 0% 0% 0%)' },
      { opacity: 1, duration: 0.38, ease: 'power3.inOut' }
    )
      .fromTo(
        contentRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out' },
        '-=0.16'
      )
      .to(
        progressBarRef.current,
        { scaleX: 1, duration: 0.36, ease: 'power2.inOut' },
        '-=0.14'
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
        className="flex flex-col items-center gap-4 text-center px-6 w-full max-w-xs"
      >
        <div className="flex items-center gap-3">
          <img
            src="/RLogo.svg"
            alt="Randi Logo"
            className="w-9 h-9 rounded-lg opacity-95"
          />
          <span className="font-display font-black text-2xl tracking-[-0.04em] text-[#f8fafc]">
            RANN<span className="text-[#38bdf8]">.</span>
          </span>
        </div>

        <div className="w-44 h-[2px] bg-[#1e293b] rounded-full overflow-hidden">
          <div
            ref={progressBarRef}
            className="w-full h-full bg-[#38bdf8] origin-left"
          />
        </div>

        <span className="font-mono text-[10px] uppercase tracking-[0.26em] text-[#94a3b8]">
          {exitingToExperience ? 'Entering 3D Experience' : 'Loading Main Portfolio'}
        </span>
      </div>
    </div>
  )
}
