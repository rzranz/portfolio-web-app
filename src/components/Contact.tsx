import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLanguage } from '../lib/i18n'
import { Mail, ArrowUpRight } from 'lucide-react'
import { Linkedin, Github } from './icons/BrandIcons'
import { Particles } from './ui/particles'

gsap.registerPlugin(ScrollTrigger)

export default function Contact() {
  const { t } = useLanguage()
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const isMobile = window.innerWidth < 768
    const ctx = gsap.context(() => {
      gsap.fromTo('.contact-reveal',
        // No blur filter — it's GPU-expensive, especially stacking on scroll
        { y: isMobile ? 20 : 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: isMobile ? 0.7 : 1.0,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: '.contact-reveal',
            start: 'top 88%',
            once: true,
          }
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <div className="relative w-full z-60 md:-mt-[100vh] md:h-[180vh]">
      <section
        id="contact"
        ref={sectionRef}
        className="md:sticky md:top-0 min-h-[100svh] md:h-screen w-full flex flex-col items-center justify-center px-6 lg:pr-28 py-20 overflow-hidden bg-[var(--color-canvas)] shadow-[0_-30px_60px_rgba(0,0,0,0.5)]"
      >
        {/* Particles: already skipped on mobile inside the component */}
        <Particles id="contact-particles" className="absolute inset-0 pointer-events-none z-0" />
        <div className="max-w-[1000px] mx-auto w-full text-center space-y-10 relative z-10">

          <h2 className="contact-reveal font-display font-bold uppercase text-3xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.08] tracking-tight text-[var(--color-text-main)] mx-auto max-w-[24ch]">
            {t('contact.heading')}
          </h2>

          {/* Clean Contact Action Buttons */}
          <div className="contact-reveal flex flex-wrap items-center justify-center gap-4 pt-2">
            <a
              href="mailto:randizakariaputra22@gmail.com"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[var(--color-text-main)] text-[var(--color-canvas)] font-display font-semibold text-sm hover:opacity-85 transition-opacity"
            >
              <Mail className="w-4 h-4" />
              <span>Send Email</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>

            <a
              href="https://www.linkedin.com/in/randizakariaputra"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-[var(--color-border-subtle)] bg-[var(--color-surface)] text-[var(--color-text-main)] font-mono text-xs font-semibold hover:border-[var(--color-text-main)] transition-colors"
            >
              <Linkedin className="w-4 h-4" />
              <span>LinkedIn</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>

            <a
              href="https://github.com/rzranz"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-[var(--color-border-subtle)] bg-[var(--color-surface)] text-[var(--color-text-main)] font-mono text-xs font-semibold hover:border-[var(--color-text-main)] transition-colors"
            >
              <Github className="w-4 h-4" />
              <span>GitHub</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>
      </section>
    </div>
  )
}
