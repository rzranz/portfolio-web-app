import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight } from 'lucide-react'
import { useLanguage } from '../lib/i18n'
import { scrollToSection } from '../lib/scroll'
import { Particles } from './ui/particles'
import DownloadMenu from './DownloadMenu'

gsap.registerPlugin(ScrollTrigger)

interface RandiLoaderApi {
  navigateTo: (url: string, nextMode?: 'greetings' | 'brand') => void
}

interface HeroNavItem {
  number: string
  labelKey: string
  fallbackLabel: string
  href: string
}

const HERO_NAV_ITEMS: HeroNavItem[] = [
  { number: '01', labelKey: 'menu.about', fallbackLabel: 'About', href: '#about' },
  { number: '02', labelKey: 'tech.nav', fallbackLabel: 'Stack', href: '#tech' },
  { number: '03', labelKey: 'menu.works', fallbackLabel: 'Works', href: '#works' },
  { number: '04', labelKey: 'menu.experience', fallbackLabel: 'Experience', href: '#experience' },
  { number: '05', labelKey: 'menu.contact', fallbackLabel: 'Contact', href: '#contact' },
]

const SOCIAL_LINKS = [
  { number: '01', label: 'github', href: 'https://github.com/rzranz' },
  { number: '02', label: 'linkedin', href: 'https://www.linkedin.com/in/randizakariaputra' },
]

export default function HeroBook() {
  const { t, language } = useLanguage()
  const sectionRef = useRef<HTMLElement>(null)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  useEffect(() => {
    if (!sectionRef.current) return
    const isMobile = window.innerWidth < 768

    const ctx = gsap.context(() => {
      // Staggered entrance on inner wrappers (does not conflict with CSS 3D rotateY)
      gsap.fromTo(
        '.hero-book-entrance',
        { opacity: 0, x: isMobile ? 32 : 64 },
        {
          opacity: 1,
          x: 0,
          duration: 0.7,
          stagger: 0.075,
          ease: 'power3.out',
          delay: 0.1,
        }
      )

      gsap.fromTo(
        '.hero-book-meta',
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          stagger: 0.08,
          ease: 'power3.out',
          delay: 0.25,
        }
      )

      // Subtle scroll parallax when transitioning into About
      gsap.to('.hero-book-parallax', {
        y: isMobile ? 20 : 48,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=85%',
          scrub: isMobile ? 0.8 : 1.1,
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const getLabel = (item: HeroNavItem) => {
    if (item.labelKey === 'tech.nav') {
      return language === 'id' ? 'Teknologi' : 'Tech Stack'
    }
    const translated = t(item.labelKey)
    return translated === item.labelKey ? item.fallbackLabel : translated
  }

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="md:sticky md:top-0 min-h-[100svh] w-full z-10 flex flex-col justify-between overflow-hidden bg-[var(--color-canvas)] relative"
    >
      {/* Subtle interactive particle canvas */}
      <Particles id="hero-particles" className="absolute inset-0 pointer-events-none z-0" />

      {/* Subtle editorial ambient wash */}
      <div className="absolute top-1/4 right-1/4 w-[480px] h-[480px] bg-[var(--color-primary)]/8 rounded-full blur-[150px] pointer-events-none z-0" />

      {/* Main Content Container */}
      <div className="hero-book-parallax relative z-10 w-full max-w-[1440px] mx-auto flex-1 flex flex-col justify-between px-5 sm:px-8 lg:px-14 pt-24 sm:pt-28 pb-6 sm:pb-8 lg:pb-10">
        {/* Top/Middle Stage: Mobile Editorial Hero (< 768px) + Desktop/Tablet 3D Half-Open Book Stage (>= 768px) */}
        <div className="flex-1 flex flex-col md:flex-row md:items-end justify-center md:justify-between gap-8 lg:gap-6 my-auto py-4">
          {/* Left Identity Block (Full-focus Hero on Mobile; bottom-left stacked brand mark on Tablet/Desktop) */}
          <div className="hero-book-meta flex flex-col justify-center md:justify-end md:pb-4 md:max-w-[300px] lg:max-w-[340px] shrink-0 z-20">
            <span className="inline-flex items-center gap-2 font-mono text-[10px] sm:text-xs uppercase tracking-[0.22em] text-[var(--color-primary)] font-bold mb-3 sm:mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] animate-pulse" />
              <span>{t('hero.status')}</span>
            </span>

            <h1 className="font-display font-black uppercase text-[12.5vw] sm:text-5xl md:text-4xl lg:text-5xl leading-[0.92] tracking-[-0.04em] text-[var(--color-text-main)] select-none">
              <span className="block">RANDI</span>
              <span className="block">ZAKARIA</span>
              <span className="block">
                PUTRA<span className="text-[var(--color-primary)]">.</span>
              </span>
            </h1>

            <p className="mt-3 sm:mt-4 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--color-text-main)]/80 font-semibold md:hidden">
              Fullstack Software Engineer
            </p>

            <p className="mt-3 sm:mt-4 font-sans text-sm md:text-xs lg:text-sm text-[var(--color-text-muted)] leading-relaxed max-w-[36ch] md:max-w-[32ch]">
              {t('hero.desc')}
            </p>

            {/* Explore 3D Experience Link (under name, underlined Explore + arrow) */}
            <a
              href="/experience/"
              onClick={(e) => {
                const loader = (window as unknown as { RandiLoader?: RandiLoaderApi }).RandiLoader
                if (loader) {
                  e.preventDefault()
                  loader.navigateTo('/experience/', 'greetings')
                }
              }}
              className="group mt-5 inline-flex items-center gap-2 font-mono text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-text-main)] hover:text-[var(--color-primary)] active:scale-95 transition-all duration-200 w-fit select-none"
            >
              <span className="border-b border-[var(--color-text-main)] group-hover:border-[var(--color-primary)] pb-0.5 transition-colors">
                Explore
              </span>
              <span className="text-base leading-none inline-block transition-transform duration-200 group-hover:translate-x-1.5">
                →
              </span>
            </a>

            {/* Mobile-only Primary CTA Buttons (since 3D menu is replaced by draggable logo orb on mobile) */}
            <div className="mt-6 flex md:hidden flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => scrollToSection('#works', 0.9)}
                className="px-6 py-3 rounded-lg bg-[var(--color-text-main)] text-[var(--color-canvas)] font-mono text-xs font-bold uppercase tracking-[0.18em] active:scale-95 transition-transform inline-flex items-center gap-2 cursor-pointer"
              >
                <span>{t('hero.recent')}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => scrollToSection('#about', 0.9)}
                className="px-5 py-3 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface)] text-[var(--color-text-main)] font-mono text-xs font-semibold uppercase tracking-[0.18em] active:scale-95 transition-transform cursor-pointer"
              >
                {t('hero.about')}
              </button>
            </div>
          </div>

          {/* Right Stage: Giant 3D Half-Open Book Perspective Navigation (Tablet & Desktop only) */}
          <nav
            aria-label="Hero Section Navigation"
            className="book-menu-stage hidden md:flex flex-1 flex-col justify-center items-end w-full lg:pr-4 xl:pr-8"
          >
            <div className="w-full flex flex-col items-end space-y-1 sm:space-y-1.5 md:space-y-2">
              {HERO_NAV_ITEMS.map((item, idx) => {
                const isHovered = hoveredIndex === idx
                const isAnyHovered = hoveredIndex !== null
                const label = getLabel(item)

                return (
                  <div key={item.href} className="hero-book-entrance w-full flex justify-end">
                    <button
                      type="button"
                      onMouseEnter={() => setHoveredIndex(idx)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      onFocus={() => setHoveredIndex(idx)}
                      onBlur={() => setHoveredIndex(null)}
                      onClick={() => scrollToSection(item.href, 1.1)}
                      className={`book-menu-item group relative inline-flex items-baseline justify-end gap-2 sm:gap-3 md:gap-4 cursor-pointer py-0.5 sm:py-1 select-none bg-transparent border-0 outline-none text-right ${
                        isHovered
                          ? 'is-hovered opacity-100'
                          : isAnyHovered
                          ? 'opacity-35'
                          : 'opacity-100'
                      }`}
                    >
                      {/* Editorial Index Number + Diagonal Hairline Slash */}
                      <span
                        className={`inline-flex items-center gap-1.5 sm:gap-2 font-mono text-[10px] sm:text-xs font-bold tracking-widest transition-colors duration-200 ${
                          isHovered
                            ? 'text-[var(--color-primary)]'
                            : 'text-[var(--color-text-muted)]'
                        }`}
                      >
                        <span>{item.number}</span>
                        <span
                          aria-hidden="true"
                          className={`inline-block w-[1px] h-5 sm:h-7 md:h-10 rotate-[22deg] transition-colors duration-200 ${
                            isHovered
                              ? 'bg-[var(--color-primary)]'
                              : 'bg-[var(--color-text-muted)]/50'
                          }`}
                        />
                      </span>

                      {/* Giant 3D Perspective Display Typography — Solid at rest, Hollow Outline on hover */}
                      <span
                        className={`book-menu-text font-display font-black uppercase leading-[0.92] tracking-[-0.04em] whitespace-nowrap text-[clamp(2rem,8.8vw,3rem)] sm:text-[clamp(3rem,7vw,4.6rem)] lg:text-[clamp(3.8rem,6.4vw,6.2rem)] ${
                          isHovered ? 'is-outlined' : ''
                        }`}
                      >
                        {label}
                      </span>
                    </button>
                  </div>
                )
              })}
            </div>
          </nav>
        </div>

        {/* Bottom Architectural Metadata Strip (matching Van Holtz Co. bottom bar) */}
        <div className="hero-book-meta w-full pt-5 sm:pt-6 border-t border-[var(--color-border-subtle)]/70 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 sm:gap-6 font-mono text-[11px] sm:text-xs">
          {/* Left columns: Role + Location/Email */}
          <div className="flex flex-wrap items-start gap-x-8 sm:gap-x-12 gap-y-2">
            <div className="flex flex-col leading-relaxed">
              <span className="text-[var(--color-text-main)] font-semibold">
                Fullstack Software Engineer
              </span>
              <span className="text-[var(--color-text-muted)]">
                Backend · QA
              </span>
            </div>

            <div className="flex flex-col leading-relaxed">
              <span className="text-[var(--color-text-muted)]">Bandung, Indonesia</span>
              <a
                href="mailto:randizakariaputra22@gmail.com"
                className="text-[var(--color-text-main)] font-semibold hover:text-[var(--color-primary)] transition-colors"
              >
                randizakariaputra22@gmail.com
              </a>
            </div>
          </div>

          {/* Right column: Numbered Socials & Scroll cue */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 sm:justify-end">
            {SOCIAL_LINKS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target={s.href.startsWith('http') ? '_blank' : undefined}
                rel={s.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="group inline-flex items-center gap-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors"
              >
                <span className="text-[10px] opacity-55">{s.number}</span>
                <span className="font-semibold text-[var(--color-text-main)] group-hover:text-[var(--color-primary)] transition-colors">
                  {s.label}
                </span>
                <ArrowUpRight className="w-3 h-3 opacity-60 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            ))}
            <DownloadMenu variant="hero" align="right" openDirection="up" />
          </div>
        </div>
      </div>
    </section>
  )
}
