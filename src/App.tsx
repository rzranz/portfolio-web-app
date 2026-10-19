import { useEffect, useState } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Globe } from 'lucide-react'

import Hero from './components/Hero'
import About from './components/About'
import TechStack from './components/TechStack'
import RecentWorks from './components/RecentWorks'
import ExperienceTimeline from './components/ExperienceTimeline'
import Contact from './components/Contact'
import SectionIndex from './components/SectionIndex'
import ThemeToggle from './components/ThemeToggle'
import Footer from './components/Footer'
import CustomCursor from './components/CustomCursor'
import StaggeredMenu from './components/StaggeredMenu'
import { useLanguage } from './lib/i18n'

gsap.registerPlugin(ScrollTrigger)

type MenuState = 'closed' | 'open' | 'closing'

function App() {
  const { language, toggleLanguage, t } = useLanguage()
  const [menuState, setMenuState] = useState<MenuState>('closed')
  const [originY, setOriginY] = useState(0)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobile, setIsMobile] = useState(() => 
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  )

  // Track responsive mobile viewport & scroll position
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    const handleScroll = () => setIsScrolled(window.scrollY > 24)

    window.addEventListener('resize', handleResize)
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    handleResize()

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 768px)").matches

    if (isMobile) return

    // Initialize Lenis on desktop
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 2,
    })

    ;(window as unknown as { lenis: Lenis }).lenis = lenis

    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })
    gsap.ticker.lagSmoothing(0, 0)

    return () => {
      lenis.destroy()
      gsap.ticker.remove((time) => lenis.raf(time * 1000))
    }
  }, [])

  // Handle Lenis pause when menu is open or transitioning
  useEffect(() => {
    const lenis = (window as unknown as { lenis?: Lenis }).lenis
    if (!lenis) return
    if (menuState !== 'closed') {
      lenis.stop()
    } else {
      lenis.start()
    }
  }, [menuState])

  const toggleMenu = () => {
    if (menuState === 'closing') return
    if (menuState === 'closed') {
      setOriginY(window.scrollY + window.innerHeight / 2)
      setMenuState('open')
    } else {
      closeMenu()
    }
  }

  const closeMenu = (onComplete?: () => void) => {
    if (menuState !== 'open') return
    setMenuState('closing')

    // 680ms timeout lets the 700ms inverse animation complete cleanly
    setTimeout(() => {
      setMenuState('closed')
      onComplete?.()
    }, 680)
  }

  const handleNavigate = (href: string) => {
    closeMenu(() => {
      const target = document.querySelector(href)
      if (target) {
        const lenis = (window as unknown as { lenis?: Lenis }).lenis
        if (lenis) {
          lenis.scrollTo(target as HTMLElement, { offset: 0, duration: 1.2 })
        } else {
          target.scrollIntoView({ behavior: 'smooth' })
        }
      }
    })
  }

  return (
    <div className="relative min-h-screen w-full bg-[var(--color-canvas)] overflow-x-clip selection:bg-[var(--color-primary)] selection:text-white">
      <CustomCursor />

      {/* Background Staggered Menu Layer */}
      <StaggeredMenu 
        isOpen={menuState === 'open'} 
        isClosing={menuState === 'closing'}
        onClose={() => closeMenu()} 
        onNavigate={handleNavigate} 
      />

      {/* Section Index on right edge (hidden during menu open) */}
      <div className={`transition-opacity duration-500 ${menuState === 'open' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <SectionIndex />
      </div>

      {/* Front Page Canvas Surface with 3D Pullback & Inverse Restore Effect */}
      <div
        id="main-page-canvas"
        className={`relative z-10 w-full min-h-screen bg-[var(--color-canvas)] ${
          menuState === 'open'
            ? 'canvas-perspective-layer rounded-2xl md:rounded-3xl shadow-[-15px_15px_60px_rgba(0,0,0,0.5)] md:shadow-[-25px_25px_90px_rgba(0,0,0,0.45)] dark:shadow-[-20px_20px_60px_rgba(0,0,0,0.9)] border border-[var(--color-border-subtle)] select-none cursor-pointer overflow-hidden'
            : menuState === 'closing'
            ? 'canvas-perspective-layer rounded-none shadow-none border-transparent ring-0 select-none pointer-events-none'
            : ''
        }`}
        style={
          menuState === 'open'
            ? {
                transform: isMobile
                  ? 'translateX(-82%) scale(0.92)'
                  : 'perspective(1400px) scale(0.72) translateX(-24%) rotateY(3.5deg) rotateZ(-1.5deg)',
                transformOrigin: isMobile
                  ? 'left center'
                  : `left ${originY || window.innerHeight / 2}px`,
              }
            : menuState === 'closing'
            ? {
                transform: isMobile
                  ? 'translateX(0%) scale(1)'
                  : 'perspective(1400px) scale(1) translateX(0%) rotateY(0deg) rotateZ(0deg)',
                transformOrigin: isMobile
                  ? 'left center'
                  : `left ${originY || window.innerHeight / 2}px`,
              }
            : undefined
        }
        onClick={menuState === 'open' ? () => closeMenu() : undefined}
      >
        {/* Subtle click overlay when menu is open */}
        {(menuState === 'open' || menuState === 'closing') && (
          <div 
            className={`absolute inset-0 z-50 bg-black/20 rounded-3xl transition-opacity duration-500 cursor-pointer ${
              menuState === 'closing' ? 'opacity-0 pointer-events-none' : 'opacity-100 hover:bg-black/15'
            }`}
            title="Click to close menu"
          />
        )}

        {/* Modern Cyber-Editorial Header with Adaptive Frosted-Glass on Scroll */}
        <header 
          className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 flex items-center justify-between pointer-events-none ${
            isScrolled 
              ? 'bg-[var(--color-canvas)]/85 backdrop-blur-md border-b border-[var(--color-border-subtle)]/60 py-3 sm:py-4 px-4 sm:px-6 md:px-8 shadow-sm' 
              : 'bg-transparent py-4 sm:py-6 px-4 sm:px-6 md:px-8'
          }`}
        >
          <div className="flex items-center gap-3 md:gap-5 pointer-events-auto">
            <a 
              href="#hero" 
              className="flex items-center gap-2.5 hover:opacity-85 transition-opacity group"
            >
              <img 
                src="/RLogo.svg" 
                alt="RLogo" 
                className="w-7 h-7 rounded-lg group-hover:scale-105 transition-transform" 
              />
              <span className="font-display font-bold text-lg md:text-xl tracking-wider text-[var(--color-text-main)]">
                RANN<span className="text-[var(--color-primary)]">.</span>
              </span>
            </a>

            {/* Language Switch */}
            <button 
              onClick={toggleLanguage} 
              className="flex items-center gap-1.5 text-xs font-mono font-semibold hover:text-[var(--color-primary)] transition-colors px-2 py-1 rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-surface)]/60 backdrop-blur-md uppercase tracking-wider cursor-pointer"
              title="Toggle Language"
            >
              <Globe className="w-3.5 h-3.5" /> 
              <span>{language.toUpperCase()}</span>
            </button>
          </div>

          <div className="flex items-center gap-4 md:gap-6 pointer-events-auto">
            <ThemeToggle />
            
            {/* Minimalist Editorial Menu Trigger: Pure typography, zero rounded pill */}
            <button 
              onClick={toggleMenu} 
              className={`text-xs md:text-sm font-mono font-bold tracking-[0.22em] uppercase transition-all duration-300 cursor-pointer py-1 px-1.5 group select-none ${
                menuState === 'open'
                  ? 'opacity-0 pointer-events-none'
                  : menuState === 'closing'
                  ? 'opacity-60 pointer-events-none'
                  : 'text-[var(--color-text-main)] hover:text-[var(--color-primary)] opacity-100'
              }`}
              aria-expanded={menuState === 'open'}
              aria-label={t('nav.menu')}
            >
              <span className="relative inline-block">
                {t('nav.menu')}
                <span className="absolute -bottom-0.5 left-0 w-0 h-[1.5px] bg-[var(--color-primary)] transition-all duration-300 group-hover:w-full" />
              </span>
            </button>
          </div>
        </header>

        <main className="relative z-10">
          {/* 00: Hero (sticky top-0 z-10) */}
          <Hero />
          
          {/* 01: About (sticky top-0 z-20) */}
          <About />

          {/* 02: TechStack (sticky top-0 z-30) */}
          <TechStack />

          {/* 03: RecentWorks (sticky top-0 z-40) */}
          <RecentWorks />

          {/* 04: Experience (sticky top-0 z-50) */}
          <ExperienceTimeline />

          {/* 05: Contact (sticky top-0 z-60) */}
          <Contact />
        </main>

        <Footer />
      </div>
    </div>
  )
}

export default App
