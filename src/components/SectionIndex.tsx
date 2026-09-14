import { useEffect, useState } from 'react'

const SECTIONS = [
  { id: 'hero', label: '00' },
  { id: 'about', label: '01' },
  { id: 'tech', label: '02' },
  { id: 'works', label: '03' },
  { id: 'contact', label: '04' },
]

export default function SectionIndex() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [atBottom, setAtBottom] = useState(false)

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    SECTIONS.forEach((section, index) => {
      const el = document.getElementById(section.id)
      if (!el) return

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveIndex(index)
          }
        },
        { threshold: 0.3 }
      )
      observer.observe(el)
      observers.push(observer)
    })

    // Detect bottom of page
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      setAtBottom(scrollTop > docHeight - 100)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      observers.forEach(o => o.disconnect())
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const scrollAction = () => {
    if (atBottom) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col items-center gap-0 pointer-events-none">
      {/* Vertical line */}
      <div className="absolute right-[7px] top-0 bottom-0 w-px bg-[var(--color-border-subtle)]" />

      {/* Section numbers */}
      <div className="relative flex flex-col gap-6">
        {SECTIONS.map((section, i) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            className={`
              relative font-mono text-xs tracking-wider transition-all duration-300 pointer-events-auto
              ${i === activeIndex
                ? 'text-[var(--color-text-main)] font-bold'
                : 'text-[var(--color-text-muted)] opacity-40 hover:opacity-70'
              }
            `}
          >
            {section.label}
            {/* Active dot */}
            {i === activeIndex && (
              <span className="absolute -right-[11px] top-1/2 -translate-y-1/2 w-[9px] h-[9px] rounded-full bg-[var(--color-text-main)]" />
            )}
          </a>
        ))}
      </div>

      {/* Scroll indicator */}
      <button
        onClick={scrollAction}
        className="pointer-events-auto mt-10 font-mono text-[10px] tracking-widest text-[var(--color-text-muted)] uppercase writing-mode-vertical cursor-pointer hover:text-[var(--color-text-main)] transition-colors"
        style={{ writingMode: 'vertical-rl' }}
      >
        {atBottom ? '↑ Back To Top' : 'Scroll Down ↓'}
      </button>
    </div>
  )
}
