import Lenis from 'lenis'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/**
 * Calculates the exact static document scroll position (in pixels) for any section,
 * immune to CSS `position: sticky` and `getBoundingClientRect` coordinate distortions.
 */
export function getScrollTargetPosition(targetIdOrHref: string): number {
  const id = targetIdOrHref.replace('#', '')

  if (id === 'hero' || id === '') return 0

  const element = document.getElementById(id)
  if (!element) return 0

  // 1. If there's an active GSAP ScrollTrigger for this element, use its calculated start
  const allTriggers = ScrollTrigger.getAll()
  const trigger = allTriggers.find((st) => st.trigger === element)
  if (trigger && typeof trigger.start === 'number') {
    return trigger.start
  }

  // 2. Otherwise calculate the true static layout offset via the offsetParent chain
  let top = 0
  let current: HTMLElement | null = element
  while (current) {
    top += current.offsetTop
    current = current.offsetParent as HTMLElement | null
  }

  return top
}

/**
 * Smoothly and directly navigates to any section across both desktop (Lenis) and mobile.
 */
export function scrollToSection(targetIdOrHref: string, duration = 1.0): void {
  const targetTop = getScrollTargetPosition(targetIdOrHref)

  const lenis = (window as unknown as { lenis?: Lenis }).lenis

  if (lenis && typeof lenis.scrollTo === 'function') {
    lenis.start()
    lenis.scrollTo(targetTop, {
      duration,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    })
  } else {
    window.scrollTo({
      top: targetTop,
      behavior: 'smooth',
    })
  }

  const hash = targetIdOrHref.startsWith('#') ? targetIdOrHref : `#${targetIdOrHref}`
  if (window.location.hash !== hash) {
    history.pushState(null, '', hash)
  }
}
