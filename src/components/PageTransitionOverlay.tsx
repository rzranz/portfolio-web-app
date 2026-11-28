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
  const brandRef = useRef<HTMLDivElement>(null)

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

  // Minimal Logo + RANN. return transition from /experience/ -> Main Portfolio
  useEffect(() => {
    if (!enteringFromExperience || !overlayRef.current) return

    document.documentElement.style.backgroundColor = ''

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

    tl.fromTo(
      brandRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.28, ease: 'power2.out' }
    )
      .to(
        brandRef.current,
        { opacity: 0, y: -12, duration: 0.24, delay: 0.35, ease: 'power2.in' }
      )
      .to(
        overlayRef.current,
        {
          clipPath: 'inset(0% 0% 100% 0%)',
          duration: 0.68,
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

    tl.fromTo(
      overlayRef.current,
      { opacity: 0, clipPath: 'inset(0% 0% 0% 0%)' },
      { opacity: 1, duration: 0.38, ease: 'power3.inOut' }
    ).fromTo(
      brandRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.24, ease: 'power2.out' },
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
        ref={brandRef}
        className="flex items-center gap-3 px-6"
      >
        <img
          src="/RLogo.svg"
          alt="Randi Logo"
          className="w-10 h-10 rounded-lg opacity-95"
        />
        <span className="font-display font-black text-3xl tracking-[-0.04em] text-[#f8fafc]">
          RANN<span className="text-[#38bdf8]">.</span>
        </span>
      </div>
    </div>
  )
}
