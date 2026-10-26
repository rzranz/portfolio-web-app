import { useEffect, useState } from 'react'
import { useLanguage } from '../lib/i18n'
import { scrollToSection } from '../lib/scroll'

const SECTIONS = [
  { id: 'hero', label: '00' },
  { id: 'about', label: '01' },
  { id: 'works', label: '02' },
  { id: 'experience', label: '03' },
  { id: 'contact', label: '04' },
]

export default function SectionIndex() {
  const { t } = useLanguage()
  const [activeIndex, setActiveIndex] = useState(0)
  const [atBottom, setAtBottom] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const viewportHeight = window.innerHeight
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - viewportHeight

      const nextAtBottom = scrollTop > docHeight - 120
      setAtBottom((prev) => (prev !== nextAtBottom ? nextAtBottom : prev))

      // Calculate which section is currently active based on viewport position
      const centerLine = viewportHeight * 0.45

      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const el = document.getElementById(SECTIONS[i].id)
        if (el) {
          const rect = el.getBoundingClientRect()
          // If the element's top is at or above the center line, and its bottom is below
          if (rect.top <= centerLine && rect.bottom > 80) {
            setActiveIndex((prev) => (prev !== i ? i : prev))
            return
          }
        }
      }

      // Default to 0 if at top
      if (scrollTop < viewportHeight * 0.5) {
        setActiveIndex((prev) => (prev !== 0 ? 0 : prev))
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    scrollToSection(id, 1.2)
  }

  const scrollAction = () => {
    if (atBottom) {
      scrollToSection('hero', 1.2)
    } else {
      const nextIndex = Math.min(activeIndex + 1, SECTIONS.length - 1)
      scrollToSection(SECTIONS[nextIndex].id, 1.2)
    }
  }

  return (
    <aside 
      aria-label="Section scroller"
      className="fixed right-6 md:right-8 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center pointer-events-none select-none"
    >
      {/* Background Vertical Line */}
      <div className="absolute right-[5px] top-2 bottom-12 w-px bg-[var(--color-border-subtle)] opacity-40 pointer-events-none" />

      {/* Section Indicators */}
      <nav className="relative flex flex-col gap-6 py-2">
        {SECTIONS.map((section, i) => {
          const isActive = i === activeIndex

          return (
            <a
              key={section.id}
              href={`#${section.id}`}
              onClick={(e) => handleNavClick(e, section.id)}
              className={`
                group relative font-mono text-xs tracking-widest transition-all duration-300 pointer-events-auto flex items-center justify-end pr-3
                ${isActive
                  ? 'text-[var(--color-text-main)] font-extrabold scale-110'
                  : 'text-[var(--color-text-muted)] opacity-35 hover:opacity-80 font-medium'
                }
              `}
              title={`Section ${section.label}`}
            >
              <span className="transition-colors group-hover:text-[var(--color-primary)]">
                {section.label}
              </span>

              {/* Active Indicator Dot */}
              <span 
                className={`
                  absolute -right-[1px] top-1/2 -translate-y-1/2 rounded-full transition-all duration-300
                  ${isActive 
                    ? 'w-2 h-2 bg-[var(--color-primary)] shadow-[0_0_10px_var(--color-primary)] scale-100 opacity-100' 
                    : 'w-1.5 h-1.5 bg-transparent scale-0 opacity-0'
                  }
                `} 
              />
            </a>
          )
        })}
      </nav>

      {/* Scroll indicator button */}
      <button
        onClick={scrollAction}
        className="pointer-events-auto mt-8 font-mono text-[9px] tracking-[0.25em] text-[var(--color-text-muted)] uppercase cursor-pointer hover:text-[var(--color-primary)] transition-colors opacity-60 hover:opacity-100 flex items-center gap-1.5"
        style={{ writingMode: 'vertical-rl' }}
      >
        <span>{atBottom ? t('footer.backTop') : t('index.scroll')}</span>
        <span className="text-[11px] leading-none">{atBottom ? '↑' : '↓'}</span>
      </button>
    </aside>
  )
}
