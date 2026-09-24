import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Globe } from 'lucide-react'

import Hero from './components/Hero'
import About from './components/About'
import TechStack from './components/TechStack'
import RecentWorks from './components/RecentWorks'
import Contact from './components/Contact'
import SectionIndex from './components/SectionIndex'
import ThemeToggle from './components/ThemeToggle'
import Footer from './components/Footer'
import { Particles } from './components/ui/particles'
import { useLanguage } from './lib/i18n'

gsap.registerPlugin(ScrollTrigger)

function App() {
  const { language, toggleLanguage, t } = useLanguage()

  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    if (isMobile) return;

    // Initialize Lenis only on desktop to prevent mobile lag
    const lenis = new Lenis({
      duration: 1.6,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 2,
    });

    // Expose lenis globally for custom scroll triggers (like SectionIndex)
    (window as any).lenis = lenis;

    // Sync GSAP with Lenis
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0, 0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove((time) => lenis.raf(time * 1000));
    };
  }, [])

  return (
    <>
      <SectionIndex />
      <Particles className="fixed inset-0 z-0 pointer-events-none" />
      
      <header className="fixed top-0 left-0 right-0 z-40 p-4 md:p-6 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-3 md:gap-6 pointer-events-auto">
          <div className="font-display font-bold text-lg md:text-xl tracking-wider">
            <span className="text-[var(--color-primary)]">&gt;</span> RANN.
          </div>
          <button onClick={toggleLanguage} className="flex items-center gap-1 md:gap-2 text-xs md:text-sm font-semibold hover:opacity-70 transition-opacity ml-2 md:ml-4 uppercase tracking-wider">
            <Globe className="w-3.5 h-3.5 md:w-4 md:h-4" /> {language.toUpperCase()}
          </button>
        </div>
        <div className="flex items-center gap-3 md:gap-6 pointer-events-auto">
          <ThemeToggle />
          <a href="#contact" className="px-3 py-1.5 md:px-5 md:py-2 text-[10px] md:text-xs font-mono font-semibold rounded border border-[var(--color-border-subtle)] hover:bg-[var(--color-text-main)] hover:text-[var(--color-canvas)] transition-colors">
            {t('nav.contact')}
          </a>
        </div>
      </header>

      <main className="relative z-10 overflow-x-clip">
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
