import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLanguage } from '../lib/i18n'
import { Mail, ArrowUpRight } from 'lucide-react'
import { GithubLogo, LinkedinLogo } from '@phosphor-icons/react'
import { Particles } from './ui/particles'

gsap.registerPlugin(ScrollTrigger)

export default function Contact() {
  const { t } = useLanguage()
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.contact-reveal',
        { y: 30, opacity: 0, filter: 'blur(8px)' },
        {
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.contact-reveal',
            start: 'top 85%',
            once: true,
          }
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="contact" ref={sectionRef} className="relative z-50 min-h-screen w-full flex flex-col items-center justify-center px-6 lg:pr-28 py-28 overflow-hidden bg-[var(--color-canvas)] shadow-[0_-25px_50px_rgba(0,0,0,0.35)] border-t border-[var(--color-border-subtle)]">
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
            <LinkedinLogo className="w-4 h-4" />
            <span>LinkedIn</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>

          <a
            href="https://github.com/rzranz"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-[var(--color-border-subtle)] bg-[var(--color-surface)] text-[var(--color-text-main)] font-mono text-xs font-semibold hover:border-[var(--color-text-main)] transition-colors"
          >
            <GithubLogo className="w-4 h-4" />
            <span>GitHub</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>
    </section>
  )
}
