import { useEffect, useState, useRef } from 'react'
import gsap from 'gsap'

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(true)
  const dotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Check initial preference on mount
    const isDarkOS = window.matchMedia('(prefers-color-scheme: dark)').matches
    const saved = localStorage.getItem('theme')
    
    if (saved === 'light' || (!saved && !isDarkOS)) {
      setIsDark(false)
      document.documentElement.classList.remove('dark')
    } else {
      setIsDark(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  // Animate the switch dot when state changes
  useEffect(() => {
    if (dotRef.current) {
      gsap.to(dotRef.current, {
        x: isDark ? 0 : 20, 
        duration: 0.6,
        ease: 'elastic.out(1.2, 0.6)',
      })
    }
  }, [isDark])

  const toggleTheme = () => {
    const newTheme = !isDark
    setIsDark(newTheme)

    if (newTheme) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  return (
    <button 
      onClick={toggleTheme}
      className="pointer-events-auto flex items-center gap-3 group h-full focus:outline-none"
      aria-label="Toggle theme"
    >
      <span className="font-mono text-[10px] tracking-widest text-[var(--color-text-muted)] group-hover:text-[var(--color-text-main)] transition-colors w-[42px] text-right">
        {isDark ? 'DARK' : 'LIGHT'}
      </span>
      <div className="w-9 h-4 rounded-full border border-[var(--color-border-subtle)] p-[2px] relative flex items-center bg-[var(--color-canvas)] transition-colors">
        <div 
          ref={dotRef}
          className="w-2.5 h-2.5 rounded-full bg-[var(--color-text-main)] relative z-10"
        />
      </div>
    </button>
  )
}
