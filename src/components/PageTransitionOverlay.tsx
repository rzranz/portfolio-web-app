import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

const TRANSITION_KEY = 'rz_nav_transition'

function shouldPlayReturnLoader(): boolean {
  if (typeof window === 'undefined') return false

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
  const percentRef = useRef<HTMLSpanElement>(null)

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

  // Clean Logo + RANN. + 0-100% loading transition from /experience/ -> Main Portfolio
  useEffect(() => {
    if (!enteringFromExperience || !overlayRef.current) return

    document.documentElement.style.backgroundColor = ''
    const counter = { val: 0 }

    const tl = gsap.timeline({
      onComplete: () => {
        try {
          window.sessionStorage.removeItem(TRANSITION_KEY)
        } catch {
          // ignore storage restrictions
        }
        if (window.location.search.includes('from=experience')) {
          const cleanUrl = window.location.pathname + window.location.hash
          window.history.replaceState(null, '', cleanUrl)
        }
        setEnteringFromExperience(false)
      },
    })

    gsap.set(overlayRef.current, {
      opacity: 1,
      clipPath: 'inset(0% 0% 0% 0%)',
    })

    if (progressBarRef.current) {
      gsap.set(progressBarRef.current, { scaleX: 0, transformOrigin: 'left center' })
    }
    if (percentRef.current) {
      percentRef.current.textContent = '0%'
    }

    tl.fromTo(
      contentRef.current,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.28, ease: 'power2.out' }
    )
      .to(
        progressBarRef.current,
        { scaleX: 1, duration: 0.9, ease: 'power2.inOut' },
        '-=0.1'
      )
      .to(
        counter,
        {
          val: 100,
          duration: 0.9,
          ease: 'power2.inOut',
          onUpdate: () => {
            if (percentRef.current) {
              percentRef.current.textContent = `${Math.round(counter.val)}%`
            }
          },
        },
        '<'
      )
      .to(
        contentRef.current,
        { opacity: 0, y: -14, duration: 0.24, ease: 'power2.in' },
        '+=0.08'
      )
      .to(
        overlayRef.current,
        {
          clipPath: 'inset(0% 0% 100% 0%)',
          duration: 0.72,
          ease: 'power4.inOut',
        },
        '-=0.06'
      )

    return () => {
      tl.kill()
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
      { opacity: 1, duration: 0.36, ease: 'power3.inOut' }
    )
      .fromTo(
        contentRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.24, ease: 'power2.out' },
        '-=0.14'
      )
      .to(
        progressBarRef.current,
        { scaleX: 1, duration: 0.35, ease: 'power2.inOut' },
        '-=0.12'
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
        className="flex flex-col items-center gap-4 px-6"
      >
        <div className="flex items-center gap-3">
          <img
            src="/RLogo.svg"
            alt="Randi Logo"
            className="w-10 h-10 rounded-lg opacity-95"
          />
          <span className="font-display font-black text-3xl tracking-[-0.04em] text-[#f8fafc]">
            RANN<span className="text-[#38bdf8]">.</span>
          </span>
        </div>

        <div className="w-48 h-[2px] bg-[#1e293b] rounded-full overflow-hidden">
          <div
            ref={progressBarRef}
            className="w-full h-full bg-[#38bdf8] origin-left"
          />
        </div>

        {!exitingToExperience && (
          <span
            ref={percentRef}
            className="font-mono text-xs tracking-[0.22em] text-[#94a3b8]"
          >
            0%
          </span>
        )}
      </div>
    </div>
  )
}
