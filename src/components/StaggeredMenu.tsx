import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useLanguage } from '../lib/i18n'
import { ArrowUpRight } from 'lucide-react'

export interface MenuItem {
  number: string
  labelKey: string
  href: string
}

export interface SocialItem {
  number: string
  label: string
  link: string
}

interface StaggeredMenuProps {
  isOpen: boolean
  onClose: () => void
  onNavigate: (href: string) => void
  socialItems?: SocialItem[]
  position?: 'left' | 'right'
}

export const DEFAULT_MENU_ITEMS: MenuItem[] = [
  { number: '00', labelKey: 'menu.home', href: '#hero' },
  { number: '01', labelKey: 'menu.about', href: '#about' },
  { number: '02', labelKey: 'menu.works', href: '#works' },
  { number: '03', labelKey: 'menu.experience', href: '#experience' },
  { number: '04', labelKey: 'menu.contact', href: '#contact' },
]

const DEFAULT_SOCIALS: SocialItem[] = [
  { number: '01', label: 'GitHub', link: 'https://github.com/rzranz' },
  { number: '02', label: 'LinkedIn', link: 'https://www.linkedin.com/in/randizakariaputra' },
  { number: '03', label: 'Email', link: 'mailto:randizakariaputra22@gmail.com' },
]

export default function StaggeredMenu({
  isOpen,
  onClose,
  onNavigate,
  socialItems = DEFAULT_SOCIALS,
  position = 'right'
}: StaggeredMenuProps) {
  const { t } = useLanguage()
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const menuContainerRef = useRef<HTMLDivElement>(null)
  const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'system'>(() => {
    if (typeof window === 'undefined') return 'dark'
    const saved = localStorage.getItem('theme')
    if (saved === 'light') return 'light'
    if (saved === 'dark') return 'dark'
    return 'system'
  })

  // Sync theme mode with DOM class changes
  useEffect(() => {
    const updateFromDOM = () => {
      const saved = localStorage.getItem('theme')
      if (saved === 'light') {
        setThemeMode('light')
      } else if (saved === 'dark') {
        setThemeMode('dark')
      } else {
        setThemeMode('system')
      }
    }

    const observer = new MutationObserver(updateFromDOM)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  const handleThemeChange = (mode: 'light' | 'dark' | 'system') => {
    setThemeMode(mode)
    if (mode === 'light') {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    } else if (mode === 'dark') {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      localStorage.removeItem('theme')
      const isDarkOS = window.matchMedia('(prefers-color-scheme: dark)').matches
      if (isDarkOS) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  }

  // Hardware-accelerated staggered entrance on inner wrapper (never conflicts with CSS 3D rotateY)
  useEffect(() => {
    if (!menuContainerRef.current) return

    const items = menuContainerRef.current.querySelectorAll('.book-menu-entrance')
    const bottomEls = menuContainerRef.current.querySelectorAll('.staggered-footer-item')
    const headerEl = menuContainerRef.current.querySelector('.staggered-header-item')

    if (isOpen) {
      gsap.killTweensOf([items, bottomEls, headerEl])

      if (headerEl) {
        gsap.fromTo(
          headerEl,
          { opacity: 0, y: -14 },
          { opacity: 1, y: 0, duration: 0.38, ease: 'power3.out' }
        )
      }

      gsap.fromTo(
        items,
        {
          opacity: 0,
          x: position === 'right' ? 56 : -56,
        },
        {
          opacity: 1,
          x: 0,
          duration: 0.52,
          stagger: 0.055,
          ease: 'power3.out',
          delay: 0.06,
        }
      )

      gsap.fromTo(
        bottomEls,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: 'power2.out', delay: 0.16 }
      )
    } else {
      gsap.killTweensOf([items, bottomEls, headerEl])
    }
  }, [isOpen, position])

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  return (
    <div
      ref={menuContainerRef}
      className={`fixed inset-0 z-[60] transition-opacity duration-300 overflow-hidden flex flex-col justify-between pointer-events-none ${
        isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}
      aria-hidden={!isOpen}
    >
      {/* Top Header of the Menu Layer */}
      <div className="staggered-header-item w-full pt-5 sm:pt-7 md:pt-8 px-5 sm:px-8 lg:px-14 relative z-20 flex items-center justify-between pointer-events-none">
        {/* Left brand mark visible on mobile/tablet or when open */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <span className="font-display font-black text-base sm:text-lg tracking-wider text-[var(--color-text-main)]">
            RANN<span className="text-[var(--color-primary)]">.</span>
          </span>
        </div>

        {/* Center spine indicator dot */}
        <div className="hidden sm:flex items-center justify-center">
          <div className="w-6 h-6 rounded-full border border-[var(--color-border-subtle)] flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />
          </div>
        </div>

        {/* Top Right: CLOSE / TUTUP button */}
        <div className="flex items-center justify-end pointer-events-auto">
          <button
            type="button"
            onClick={() => {
              setHoveredIndex(null)
              onClose()
            }}
            className="font-mono text-xs md:text-sm font-extrabold tracking-[0.25em] uppercase text-[var(--color-text-main)] hover:text-[var(--color-primary)] active:scale-95 transition-all duration-150 cursor-pointer py-1 px-2 select-none"
            aria-label={t('nav.close')}
          >
            {t('nav.close')}
          </button>
        </div>
      </div>

      {/* Center Nav Stage: 3D Half-Open Book Perspective Typography (Right-Hinged) */}
      <nav
        aria-label="Primary Navigation"
        className="book-menu-stage w-full flex-1 flex flex-col justify-center px-5 sm:px-8 lg:px-14 py-2 my-auto relative z-10 pointer-events-none"
      >
        <div className="w-full max-w-3xl ml-auto flex flex-col items-end space-y-1 sm:space-y-1.5 md:space-y-2 pointer-events-auto">
          {DEFAULT_MENU_ITEMS.map((item, idx) => {
            const isHovered = hoveredIndex === idx
            const isAnyHovered = hoveredIndex !== null
            const label = t(item.labelKey)

            return (
              <div key={item.labelKey} className="book-menu-entrance w-full flex justify-end">
                <button
                  type="button"
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onFocus={() => setHoveredIndex(idx)}
                  onBlur={() => setHoveredIndex(null)}
                  onClick={() => {
                    setHoveredIndex(null)
                    onNavigate(item.href)
                  }}
                  className={`book-menu-item group relative inline-flex items-baseline justify-end gap-2 sm:gap-3 md:gap-4 cursor-pointer py-0.5 sm:py-1 select-none bg-transparent border-0 outline-none text-right ${
                    isHovered
                      ? 'is-hovered opacity-100'
                      : isAnyHovered
                      ? 'opacity-35'
                      : 'opacity-100'
                  }`}
                >
                  {/* Editorial Index Number + Diagonal Hairline Slash (Van Holtz reference) */}
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
                      className={`inline-block w-[1px] h-5 sm:h-7 md:h-9 rotate-[22deg] transition-colors duration-200 ${
                        isHovered
                          ? 'bg-[var(--color-primary)]'
                          : 'bg-[var(--color-text-muted)]/50'
                      }`}
                    />
                  </span>

                  {/* Giant 3D Perspective Display Typography — Solid at rest, Hollow Outline on hover */}
                  <span
                    className={`book-menu-text font-display font-black uppercase leading-[0.94] tracking-[-0.04em] whitespace-nowrap text-[clamp(2.15rem,9vw,3.1rem)] sm:text-[clamp(3.1rem,7.2vw,4.5rem)] lg:text-[clamp(3.9rem,6.2vw,5.75rem)] ${
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

      {/* Bottom Footer Controls: Editorial Info, Numbered Socials, Theme Selector & ATS CV */}
      <div className="w-full px-5 sm:px-8 lg:px-14 pb-6 sm:pb-8 md:pb-10 relative z-20 pointer-events-none">
        <div className="w-full max-w-3xl ml-auto flex flex-col sm:flex-row items-end sm:items-end justify-between gap-5 sm:gap-6 pointer-events-auto border-t border-[var(--color-border-subtle)]/70 pt-4 sm:pt-5">
          {/* Left side of footer: Role metadata & Numbered Social Links */}
          <div className="staggered-footer-item flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-8 order-2 sm:order-1 w-full sm:w-auto justify-between sm:justify-start">
            <div className="hidden md:flex flex-col font-mono text-[11px] text-[var(--color-text-muted)] leading-relaxed">
              <span className="text-[var(--color-text-main)] font-semibold">Fullstack Software Engineer</span>
              <span>Bandung, Indonesia</span>
            </div>

            <div className="flex flex-wrap items-center justify-end sm:justify-start gap-x-4 gap-y-2">
              {socialItems.map((s) => (
                <a
                  key={s.label}
                  href={s.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group font-mono text-[11px] sm:text-xs text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors inline-flex items-center gap-1.5"
                >
                  <span className="text-[10px] opacity-55">{s.number}</span>
                  <span className="font-semibold text-[var(--color-text-main)] group-hover:text-[var(--color-primary)] transition-colors">
                    {s.label}
                  </span>
                  <ArrowUpRight className="w-3 h-3 opacity-60 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Right side: Vertical Theme Selector & Download ATS CV */}
          <div className="staggered-footer-item flex flex-col items-end gap-3.5 sm:gap-4 order-1 sm:order-2 text-right">
            <div className="flex flex-row sm:flex-col items-center sm:items-end gap-3 sm:gap-1 font-mono text-[10px] sm:text-[11px] font-bold tracking-[0.2em] text-[var(--color-text-muted)] select-none">
              <button
                type="button"
                onClick={() => handleThemeChange('light')}
                className={`cursor-pointer uppercase hover:text-[var(--color-text-main)] transition-colors flex items-center gap-1.5 ${
                  themeMode === 'light'
                    ? 'text-[var(--color-text-main)] font-black'
                    : 'text-[var(--color-text-muted)]'
                }`}
              >
                <span>{t('menu.light')}</span>
                {themeMode === 'light' && (
                  <span className="inline-block w-1.5 h-1.5 bg-[var(--color-primary)]" />
                )}
              </button>

              <button
                type="button"
                onClick={() => handleThemeChange('dark')}
                className={`cursor-pointer uppercase hover:text-[var(--color-text-main)] transition-colors flex items-center gap-1.5 ${
                  themeMode === 'dark'
                    ? 'text-[var(--color-text-main)] font-black'
                    : 'text-[var(--color-text-muted)]'
                }`}
              >
                <span>{t('menu.dark')}</span>
                {themeMode === 'dark' && (
                  <span className="inline-block w-1.5 h-1.5 bg-[var(--color-primary)]" />
                )}
              </button>

              <button
                type="button"
                onClick={() => handleThemeChange('system')}
                className={`cursor-pointer uppercase hover:text-[var(--color-text-main)] transition-colors flex items-center gap-1.5 ${
                  themeMode === 'system'
                    ? 'text-[var(--color-text-main)] font-black'
                    : 'text-[var(--color-text-muted)]'
                }`}
              >
                <span>{t('menu.system')}</span>
                {themeMode === 'system' && (
                  <span className="inline-block w-1.5 h-1.5 bg-[var(--color-primary)]" />
                )}
              </button>
            </div>

            <a
              href="mailto:randizakariaputra22@gmail.com?subject=Request%20CV%20ATS%20-%20Randi%20Zakaria%20Putra"
              className="group font-mono text-[11px] sm:text-xs font-bold text-[var(--color-text-main)] hover:text-[var(--color-primary)] tracking-[0.2em] uppercase transition-colors inline-flex items-center gap-1"
            >
              <span>{t('menu.cv')}</span>
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
