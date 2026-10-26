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
  const { t } = useLanguage()
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
      className={`fixed inset-0 z-[60] transition-opacity duration-300 overflow-hidden flex flex-col justify-between pointer-events-none ${
        isOpen 
          ? 'opacity-100 visible' 
          : 'opacity-0 invisible'
      }`}
      aria-hidden={!isOpen}
    >
      {/* Top Header of the Menu Layer: Center dot indicator and Top-Right TUTUP button */}
      <div className="staggered-header-item w-full pt-6 sm:pt-8 px-6 sm:px-10 lg:px-16 relative z-10 flex items-center justify-between pointer-events-none">
        {/* Left spacer so center and right elements align cleanly */}
        <div className="w-24" />

        {/* Center circle indicator matching reference image */}
        <div className="flex items-center justify-center">
          <div className="w-6 h-6 rounded-full border border-white/20 dark:border-white/25 flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
          </div>
        </div>

        {/* Top Right: TUTUP / CLOSE button (Pure typography matching reference image) */}
        <div className="flex items-center justify-end w-24 pointer-events-auto">
          <button
            onClick={onClose}
            className="font-mono text-xs md:text-sm font-extrabold tracking-[0.25em] uppercase text-[var(--color-text-main)] hover:text-[var(--color-primary)] transition-colors cursor-pointer py-1 select-none"
            aria-label={t('nav.close')}
          >
            {t('nav.close')}
          </button>
        </div>
      </div>

      {/* Center Nav Items: Staggered Massive Editorial Typography aligned to the right */}
      <div className="w-full flex-1 flex flex-col justify-center px-6 sm:px-10 lg:px-16 py-4 my-auto relative z-10 pointer-events-none">
        <div className="w-full max-w-2xl ml-auto flex flex-col space-y-2 sm:space-y-3 pointer-events-auto text-right">
          {DEFAULT_MENU_ITEMS.map((item, idx) => {
            const isHovered = hoveredIndex === idx
            const isAnyHovered = hoveredIndex !== null
            const label = t(item.labelKey)

            return (
              <div 
                key={item.labelKey}
                className="staggered-menu-item relative flex items-center justify-end group cursor-pointer py-1 sm:py-1.5 select-none"
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => onNavigate(item.href)}
              >
                {/* Main Giant Staggered Label matching reference image */}
                <h3 className={`font-display font-black text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5rem] tracking-tight uppercase transition-all duration-200 ${
                  isHovered
                    ? 'text-white translate-x-[-8px]'
                    : isAnyHovered 
                      ? 'text-[#52525b]/40' 
                      : 'text-[#8e8e93] dark:text-[#a1a1aa] hover:text-white'
                }`}>
                  {label}
                </h3>
              </div>
            )
          })}
        </div>
      </div>

      {/* Bottom Footer Controls: Theme Switch (Vertical stacked) & Download ATS CV */}
      <div className="w-full px-6 sm:px-10 lg:px-16 pb-8 sm:pb-10 relative z-10 pointer-events-none">
        <div className="w-full max-w-2xl ml-auto flex flex-col sm:flex-row items-end sm:items-end justify-between gap-6 pointer-events-auto">
          
          {/* Social Links on bottom-left of footer area */}
          <div className="staggered-footer-item flex flex-wrap items-center gap-4 sm:gap-6 order-2 sm:order-1">
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

          {/* Right side: Vertical Theme Selector & Download CV ATS matching reference image */}
          <div className="staggered-footer-item flex flex-col items-end gap-5 order-1 sm:order-2 text-right">
            
            {/* Theme Mode Selector: Stacked Vertically with active indicator block */}
            <div className="flex flex-col items-end gap-1 font-mono text-[11px] font-bold tracking-[0.2em] text-[var(--color-text-muted)] select-none">
              <button 
                onClick={() => handleThemeChange('light')}
                className={`cursor-pointer uppercase hover:text-white transition-colors flex items-center gap-1.5 ${
                  themeMode === 'light' ? 'text-white font-black' : 'text-[#71717a]'
                }`}
              >
                <span>{t('menu.light')}</span>
                {themeMode === 'light' && <span className="inline-block w-2 h-2 bg-white" />}
              </button>
              
              <button 
                onClick={() => handleThemeChange('dark')}
                className={`cursor-pointer uppercase hover:text-white transition-colors flex items-center gap-1.5 ${
                  themeMode === 'dark' ? 'text-white font-black' : 'text-[#71717a]'
                }`}
              >
                <span>{t('menu.dark')}</span>
                {themeMode === 'dark' && <span className="inline-block w-2 h-2 bg-white" />}
              </button>
              
              <button 
                onClick={() => handleThemeChange('system')}
                className={`cursor-pointer uppercase hover:text-white transition-colors flex items-center gap-1.5 ${
                  themeMode === 'system' ? 'text-white font-black' : 'text-[#71717a]'
                }`}
              >
                <span>{t('menu.system')}</span>
                {themeMode === 'system' && <span className="inline-block w-2 h-2 bg-white" />}
              </button>
            </div>

            {/* DOWNLOAD CV (ATS) */}
            <a
              href="mailto:randizakariaputra22@gmail.com?subject=Request%20CV%20ATS%20-%20Randi%20Zakaria%20Putra"
              className="font-mono text-xs font-bold text-[var(--color-text-main)] hover:text-[var(--color-primary)] tracking-[0.2em] uppercase transition-colors inline-flex items-center gap-1"
            >
              <span>{t('menu.cv')}</span>
            </a>

          </div>

        </div>
      </div>
    </div>
  )
}
