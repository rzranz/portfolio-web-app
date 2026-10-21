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
import { scrollToSection } from './lib/scroll'

gsap.registerPlugin(ScrollTrigger)

function App() {
  const { language, toggleLanguage, t } = useLanguage()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [originY, setOriginY] = useState(0)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobile, setIsMobile] = useState(() => 
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  )

  // Track responsive mobile viewport & scroll position
  useEffect(() => {
    let resizeTimer: ReturnType<typeof setTimeout>
    const handleResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => setIsMobile(window.innerWidth < 768), 100)
    }
    const handleScroll = () => setIsScrolled(window.scrollY > 24)

    window.addEventListener('resize', handleResize, { passive: true })
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', handleScroll)
      clearTimeout(resizeTimer)
    }
  }, [])

  // Initialize Lenis smooth scroll on desktop
  useEffect(() => {
    const isMobileDevice = window.matchMedia("(max-width: 768px)").matches
    if (isMobileDevice) return

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
    })

    ;(window as unknown as { lenis: Lenis }).lenis = lenis

    lenis.on('scroll', ScrollTrigger.update)

    const tickerFn = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tickerFn)
    gsap.ticker.lagSmoothing(500, 33)

    return () => {
      lenis.destroy()
      gsap.ticker.remove(tickerFn)
      delete (window as unknown as { lenis?: Lenis }).lenis
    }
  }, [])

  // Pause Lenis scrolling while menu overlay is active
  useEffect(() => {
    const lenis = (window as unknown as { lenis?: Lenis }).lenis
    if (!lenis) return
    if (isMenuOpen) {
      lenis.stop()
    } else {
      lenis.start()
    }
  }, [isMenuOpen])

  const openMenu = () => {
    setOriginY(window.scrollY + window.innerHeight / 2)
    setIsMenuOpen(true)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  // Direct, lag-free navigation to target sections
  const handleNavigate = (href: string) => {
    setIsMenuOpen(false)
    // Micro-delay (160ms) avoids GPU contention between 3D un-tilt and Lenis scroll
    setTimeout(() => {
      scrollToSection(href, 1.1)
    }, 160)
  }

  return (
    <div className="relative min-h-screen w-full bg-[var(--color-canvas)] overflow-x-clip selection:bg-[var(--color-primary)] selection:text-white">
      <CustomCursor />

      {/* Background Layer with Ambient Glow revealed when canvas pulls back in 3D */}
      <div className={`fixed inset-0 z-0 bg-[var(--color-canvas)] transition-opacity duration-300 pointer-events-none ${
        isMenuOpen ? 'opacity-100' : 'opacity-0'
      }`}>
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-[var(--color-primary)]/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />
      </div>

      {/* Menu Interaction Layer (z-30) */}
      <StaggeredMenu 
        isOpen={isMenuOpen} 
        onClose={closeMenu} 
        onNavigate={handleNavigate} 
      />

      {/* Section Index on right edge (hidden during menu open) */}
      <div className={`transition-opacity duration-300 ${isMenuOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <SectionIndex />
      </div>

      {/* Front Page Canvas Surface with Calibrated 3D Pullback ("aga miring") Effect */}
      <div
        id="main-page-canvas"
        className={`relative z-10 w-full min-h-screen bg-[var(--color-canvas)] canvas-perspective-layer ${
          isMenuOpen
            ? 'rounded-2xl md:rounded-3xl shadow-[-25px_25px_80px_rgba(0,0,0,0.85)] border border-[var(--color-border-subtle)] select-none cursor-pointer'
            : 'rounded-none shadow-none border-transparent ring-0'
        }`}
        style={
          isMenuOpen
            ? {
                transform: isMobile
                  ? 'translateX(-80%) scale(0.92)'
                  : 'perspective(1200px) scale(0.74) translateX(-30%) rotateY(12deg) rotateZ(-9.5deg)',
                transformOrigin: isMobile
                  ? 'left center'
                  : `left ${originY || window.innerHeight / 2}px`,
              }
            : undefined
        }
        onClick={isMenuOpen ? closeMenu : undefined}
      >
        {/* Subtle click overlay when menu is open so clicking anywhere on the tilted canvas closes it */}
        {isMenuOpen && (
          <div 
            className="absolute inset-0 z-50 bg-black/25 rounded-2xl md:rounded-3xl cursor-pointer hover:bg-black/15 transition-colors"
            title="Click to close menu"
          />
        )}

        {/* Fixed Header Navbar: Tilts naturally with canvas when menu is open */}
        <header 
          className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 flex items-center justify-between ${
            isScrolled 
              ? 'bg-[var(--color-canvas)]/85 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.15)] py-3 sm:py-4 px-4 sm:px-6 md:px-8' 
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
              className="flex items-center gap-1.5 text-xs font-mono font-semibold hover:text-[var(--color-primary)] transition-colors px-2 py-1 rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-surface)]/80 uppercase tracking-wider cursor-pointer"
              title="Toggle Language"
            >
              <Globe className="w-3.5 h-3.5" /> 
              <span>{language.toUpperCase()}</span>
            </button>
          </div>

          <div className="flex items-center gap-4 md:gap-6 pointer-events-auto">
            <ThemeToggle />
            
            {/* Menu Trigger on Canvas Header: Hidden when menu is already open */}
            <button 
              onClick={openMenu} 
              className={`text-xs md:text-sm font-mono font-bold tracking-[0.22em] uppercase transition-all duration-300 cursor-pointer py-1 px-1.5 group select-none ${
                isMenuOpen
                  ? 'opacity-0 pointer-events-none'
                  : 'text-[var(--color-text-main)] hover:text-[var(--color-primary)] opacity-100'
              }`}
              aria-expanded={isMenuOpen}
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
