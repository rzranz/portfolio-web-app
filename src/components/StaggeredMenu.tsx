import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useLanguage } from '../lib/i18n'
import { ArrowUpRight, X, Globe } from 'lucide-react'

export interface MenuItem {
  number: string
  labelKey: string
  href: string
}

export interface SocialItem {
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

const DEFAULT_MENU_ITEMS: MenuItem[] = [
  { number: '00', labelKey: 'menu.home', href: '#hero' },
  { number: '01', labelKey: 'menu.about', href: '#about' },
  { number: '02', labelKey: 'menu.works', href: '#works' },
  { number: '03', labelKey: 'menu.experience', href: '#experience' },
  { number: '04', labelKey: 'menu.contact', href: '#contact' },
]

const DEFAULT_SOCIALS: SocialItem[] = [
  { label: 'GitHub', link: 'https://github.com/rzranz' },
  { label: 'LinkedIn', link: 'https://www.linkedin.com/in/randizakariaputra' },
  { label: 'Email', link: 'mailto:randizakariaputra22@gmail.com' }
]

export default function StaggeredMenu({
  isOpen,
  onClose,
  onNavigate,
  socialItems = DEFAULT_SOCIALS,
  position = 'right'
}: StaggeredMenuProps) {
  const { t, language, toggleLanguage } = useLanguage()
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const menuContainerRef = useRef<HTMLDivElement>(null)
  const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'system'>('dark')

  // Sync theme mode on mount
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
    updateFromDOM()

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

  // Fast, hardware-accelerated staggered entrance animation
  useEffect(() => {
    if (!menuContainerRef.current) return

    const items = menuContainerRef.current.querySelectorAll('.staggered-menu-item')
    const bottomEls = menuContainerRef.current.querySelectorAll('.staggered-footer-item')
    const headerEl = menuContainerRef.current.querySelector('.staggered-header-item')

    if (isOpen) {
      setHoveredIndex(null)
      gsap.killTweensOf([items, bottomEls, headerEl])

      // 1. Header entrance
      if (headerEl) {
        gsap.fromTo(headerEl,
          { opacity: 0, y: -16 },
          { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }
        )
      }

      // 2. Menu items entrance: cascade in smoothly (00 -> 04)
      gsap.fromTo(items,
        { 
          opacity: 0, 
          x: position === 'right' ? 40 : -40,
          y: 10
        },
        { 
          opacity: 1, 
          x: 0, 
          y: 0, 
          duration: 0.4, 
          stagger: 0.05, 
          ease: 'power3.out',
          delay: 0.05 
        }
      )

      // 3. Footer entrance
      gsap.fromTo(bottomEls,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.35, stagger: 0.04, ease: 'power2.out', delay: 0.15 }
      )
    } else {
      setHoveredIndex(null)
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
      className={`fixed inset-0 z-[100] bg-[var(--color-canvas)]/98 backdrop-blur-2xl transition-all duration-200 overflow-hidden flex flex-col justify-between ${
        isOpen 
          ? 'opacity-100 pointer-events-auto visible' 
          : 'opacity-0 pointer-events-none invisible'
      }`}
      aria-hidden={!isOpen}
    >
      {/* Ambient background glow matching purple theme */}
      <div className="absolute top-1/4 right-1/4 w-[450px] h-[450px] bg-[var(--color-primary)]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Header of the Menu Layer */}
      <div className="staggered-header-item w-full pt-6 sm:pt-8 px-6 sm:px-10 lg:px-16 relative z-10">
        <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img src="/RLogo.svg" alt="RLogo" className="w-6 h-6 rounded-md" />
            <div className="font-mono text-xs tracking-[0.2em] text-[var(--color-text-muted)] uppercase flex items-center gap-2">
              <span>RANN</span>
              <span className="text-[var(--color-primary)]">/</span>
              <span>NAVIGATION</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Toggle in Menu */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 text-xs font-mono font-semibold hover:text-[var(--color-primary)] transition-colors px-2 py-1 rounded-md border border-[var(--color-border-subtle)] bg-[var(--color-surface)]/80 text-[var(--color-text-main)] uppercase tracking-wider cursor-pointer"
              title="Toggle Language"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{language.toUpperCase()}</span>
            </button>

            {/* Close Button: Pure typography, zero rounded pill */}
            <button
              onClick={onClose}
              className="group flex items-center gap-2 font-mono text-xs md:text-sm font-bold tracking-[0.25em] uppercase text-[var(--color-text-main)] hover:text-[var(--color-primary)] transition-colors cursor-pointer py-1 px-1.5 select-none"
              aria-label={t('nav.close')}
            >
              <span>{t('nav.close')}</span>
              <X className="w-4 h-4 transition-transform group-hover:rotate-90 duration-300" />
            </button>
          </div>
        </div>
      </div>

      {/* Center Nav Items: Staggered Large Editorial Typography */}
      <div className="w-full flex-1 flex flex-col justify-center px-6 sm:px-10 lg:px-16 py-4 my-auto relative z-10">
        <div className="w-full max-w-6xl mx-auto flex flex-col space-y-1 sm:space-y-2">
          {DEFAULT_MENU_ITEMS.map((item, idx) => {
            const isHovered = hoveredIndex === idx
            const isAnyHovered = hoveredIndex !== null
            const label = t(item.labelKey)

            return (
              <div 
                key={item.number}
                className="staggered-menu-item relative flex items-baseline justify-between group cursor-pointer py-1.5 sm:py-2 select-none border-b border-transparent hover:border-[var(--color-border-subtle)] transition-colors"
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => onNavigate(item.href)}
              >
                <div className="flex items-baseline gap-3 sm:gap-6">
                  {/* Item Number */}
                  <span className={`font-mono text-xs sm:text-sm font-semibold tracking-wider transition-colors duration-200 ${
                    isHovered 
                      ? 'text-[var(--color-primary)]' 
                      : 'text-[var(--color-text-muted)]'
                  }`}>
                    {item.number}
                  </span>

                  {/* Main Giant Staggered Label */}
                  <h3 className={`font-display font-extrabold text-2xl sm:text-4xl md:text-5xl lg:text-[4rem] xl:text-[4.5rem] tracking-tighter uppercase transition-all duration-200 ${
                    isHovered
                      ? 'text-[var(--color-primary)] translate-x-2'
                      : isAnyHovered 
                        ? 'text-[var(--color-text-muted)]/30' 
                        : 'text-[var(--color-text-main)]'
                  }`}>
                    {label}
                  </h3>
                </div>

                {/* Right Arrow indicator on hover */}
                <div className={`transition-all duration-200 transform ${
                  isHovered 
                    ? 'opacity-100 translate-x-0 text-[var(--color-primary)]' 
                    : 'opacity-0 translate-x-3 text-transparent'
                }`}>
                  <ArrowUpRight className="w-5 h-5 sm:w-8 sm:h-8" />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Bottom Footer Controls: Theme Switch, ATS CV, & Socials */}
      <div className="w-full px-6 sm:px-10 lg:px-16 pb-6 sm:pb-8 relative z-10">
        <div className="w-full max-w-6xl mx-auto pt-4 sm:pt-6 border-t border-[var(--color-border-subtle)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-6">
          
          {/* Social Links */}
          <div className="staggered-footer-item flex flex-wrap items-center gap-4 sm:gap-6">
            {socialItems.map((s, idx) => (
              <a
                key={idx}
                href={s.link}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[11px] sm:text-xs text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors flex items-center gap-1"
              >
                <span>{s.label}</span>
                <ArrowUpRight className="w-3 h-3 opacity-60" />
              </a>
            ))}
          </div>

          {/* Right side: Theme Mode Selection & Download ATS CV */}
          <div className="staggered-footer-item flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6">
            
            {/* Theme Mode Selector: Pure typography, zero rounded pill */}
            <div className="flex items-center gap-2 font-mono text-[11px] tracking-wider text-[var(--color-text-muted)]">
              <button 
                onClick={() => handleThemeChange('light')}
                className={`cursor-pointer uppercase hover:text-[var(--color-text-main)] transition-colors ${
                  themeMode === 'light' ? 'text-[var(--color-primary)] font-bold' : ''
                }`}
              >
                {t('menu.light')}
              </button>
              <span>·</span>
              <button 
                onClick={() => handleThemeChange('dark')}
                className={`cursor-pointer uppercase hover:text-[var(--color-text-main)] transition-colors flex items-center gap-1 ${
                  themeMode === 'dark' ? 'text-[var(--color-primary)] font-bold' : ''
                }`}
              >
                <span>{t('menu.dark')}</span>
                {themeMode === 'dark' && <span className="inline-block w-1.5 h-1.5 bg-[var(--color-primary)] rounded-full" />}
              </button>
              <span>·</span>
              <button 
                onClick={() => handleThemeChange('system')}
                className={`cursor-pointer uppercase hover:text-[var(--color-text-main)] transition-colors ${
                  themeMode === 'system' ? 'text-[var(--color-primary)] font-bold' : ''
                }`}
              >
                {t('menu.system')}
              </button>
            </div>

            {/* DOWNLOAD CV (ATS) */}
            <a
              href="mailto:randizakariaputra22@gmail.com?subject=Request%20CV%20ATS%20-%20Randi%20Zakaria%20Putra"
              className="font-mono text-[11px] font-bold text-[var(--color-text-main)] hover:text-[var(--color-primary)] tracking-wider uppercase transition-colors inline-flex items-center gap-1"
            >
              <span>{t('menu.cv')}</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[var(--color-primary)]" />
            </a>

          </div>

        </div>
      </div>
    </div>
  )
}
