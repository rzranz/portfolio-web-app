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

  // Smooth loading + Hero entrance curtain when returning from /experience/ -> Main Portfolio
  useEffect(() => {
    if (!enteringFromExperience || !overlayRef.current) return

    const canvas = document.getElementById('main-page-canvas')
    const heroMeta = document.querySelectorAll('.hero-book-meta')
    const heroItems = document.querySelectorAll('.hero-book-entrance')
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
        if (canvas) gsap.set(canvas, { clearProps: 'transform,opacity' })
        if (heroMeta.length) gsap.set(heroMeta, { clearProps: 'transform,opacity' })
        if (heroItems.length) gsap.set(heroItems, { clearProps: 'transform,opacity' })
        setEnteringFromExperience(false)
      },
    })

    // Hold Main Portfolio & Hero elements cleanly in pre-entrance state behind the curtain
    if (canvas) {
      gsap.set(canvas, { scale: 0.96, y: 28, opacity: 0 })
    }
    if (heroMeta.length) {
      gsap.set(heroMeta, { opacity: 0, y: 24 })
    }
    if (heroItems.length) {
      gsap.set(heroItems, { opacity: 0, x: window.innerWidth < 768 ? 28 : 56 })
    }

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

    // 1. Fade in loader brand + animate progress bar & percentage 0% -> 100%
    tl.fromTo(
      contentRef.current,
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.32, ease: 'power2.out' }
    )
      .to(
        progressBarRef.current,
        { scaleX: 1, duration: 0.95, ease: 'power2.inOut' },
        '-=0.1'
      )
      .to(
        counter,
        {
          val: 100,
          duration: 0.95,
          ease: 'power2.inOut',
          onUpdate: () => {
            if (percentRef.current) {
              percentRef.current.textContent = `${Math.round(counter.val)}%`
            }
          },
        },
        '<'
      )
      // 2. Fade out loader text and lift the obsidian curtain smoothly
      .to(
        contentRef.current,
        { opacity: 0, y: -18, duration: 0.28, ease: 'power2.in' },
        '+=0.1'
      )
      .to(
        overlayRef.current,
        {
          clipPath: 'inset(0% 0% 100% 0%)',
          duration: 0.82,
          ease: 'power4.inOut',
        },
        '-=0.06'
      )

    // 3. Synchronized Main Portfolio & Hero stagger-in right as the curtain lifts
    if (canvas) {
      tl.to(
        canvas,
        {
          scale: 1,
          y: 0,
          opacity: 1,
          duration: 0.82,
          ease: 'power3.out',
        },
        '-=0.62'
      )
    }

    if (heroMeta.length) {
      tl.to(
        heroMeta,
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: 'power3.out',
        },
        '-=0.6'
      )
    }

    if (heroItems.length) {
      tl.to(
        heroItems,
        {
          opacity: 1,
          x: 0,
          duration: 0.72,
          stagger: 0.07,
          ease: 'power3.out',
        },
        '-=0.65'
      )
    }

    return () => {
      tl.kill()
      if (canvas) gsap.set(canvas, { clearProps: 'transform,opacity' })
      if (heroMeta.length) gsap.set(heroMeta, { clearProps: 'transform,opacity' })
      if (heroItems.length) gsap.set(heroItems, { clearProps: 'transform,opacity' })
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
        { scaleX: 1, duration: 0.38, ease: 'power2.inOut' },
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
            className="w-10 h-10 rounded-lg opacity-95"
          />
          <span className="font-display font-black text-3xl tracking-[-0.04em] text-[#f8fafc]">
            RANN<span className="text-[#38bdf8]">.</span>
          </span>
        </div>

        <div className="w-52 h-[2px] bg-[#1e293b] rounded-full overflow-hidden">
          <div
            ref={progressBarRef}
            className="w-full h-full bg-[#38bdf8] origin-left"
          />
        </div>

        <div className="flex items-center justify-between w-52 font-mono text-[10px] uppercase tracking-[0.2em] text-[#94a3b8]">
          <span>
            {exitingToExperience ? '3D Experience' : 'Main Portfolio'}
          </span>
          <span ref={percentRef} className="text-[#f8fafc] font-semibold">
            {exitingToExperience ? '→' : '0%'}
          </span>
        </div>
      </div>
    </div>
  )
}
