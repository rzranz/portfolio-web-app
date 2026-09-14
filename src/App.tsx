import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import Hero from './components/Hero'
import About from './components/About'
import TechStack from './components/TechStack'
import RecentWorks from './components/RecentWorks'
import Contact from './components/Contact'
import SectionIndex from './components/SectionIndex'
import ThemeToggle from './components/ThemeToggle'
import Footer from './components/Footer'
import { Particles } from './components/ui/particles'

gsap.registerPlugin(ScrollTrigger)

function App() {
  useEffect(() => {
    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.6,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 2,
    })

    // Expose lenis globally for custom scroll triggers (like SectionIndex)
    // @ts-expect-error adding lenis to window
    window.lenis = lenis

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    // Sync GSAP with Lenis
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

  return (
    <>
      <SectionIndex />
      <Particles className="fixed inset-0 z-0 pointer-events-none" />
      
      {/* Navbar Placeholder */}
      <header className="fixed top-0 left-0 right-0 z-40 p-6 flex items-center justify-between pointer-events-none">
        <div className="font-display font-bold text-xl tracking-wider pointer-events-auto">
          <span className="text-[var(--color-primary)]">&gt;</span> RANN.
        </div>
        <div className="flex items-center gap-6 pointer-events-auto">
          <ThemeToggle />
          <a href="#contact" className="px-5 py-2 text-xs font-mono font-semibold rounded border border-[var(--color-border-subtle)] hover:bg-[var(--color-text-main)] hover:text-[var(--color-canvas)] transition-colors">
            Contact
          </a>
        </div>
      </header>

      <main className="relative z-10 overflow-hidden">
        <Hero />
        <About />
        <TechStack />
        <RecentWorks />
        <Contact />
      </main>

      <Footer />
    </>
  )
}

export default App
