import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import data from '../data/cv.json'

gsap.registerPlugin(ScrollTrigger)

export default function RecentWorks() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [activeSlide, setActiveSlide] = useState(0)
  const projects = data.experience
  const slideRefs = useRef<(HTMLDivElement | null)[]>([])

  // 1. Track scroll progress to update activeSlide state cleanly
  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      mm.add("(min-width: 768px)", () => {
        if (!sectionRef.current) return

        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top top",
          end: `+=${window.innerHeight * projects.length * 1.2}`, // Generous scroll space
          pin: true,
          scrub: false, // No scrub, ensuring discrete slide triggers
          onUpdate: (self) => {
            let newIndex = Math.floor(self.progress * projects.length)
            if (newIndex >= projects.length) newIndex = projects.length - 1
            if (newIndex < 0) newIndex = 0
            
            setActiveSlide(newIndex)
          }
        })
      })

      mm.add("(max-width: 767px)", () => {})
    }, sectionRef)

    return () => ctx.revert()
  }, [projects.length])

  // 2. Perform discrete "slide in" animations of the entire slide containers horizontally
  // This guarantees zero overlapping content because the whole container moves.
  useEffect(() => {
    slideRefs.current.forEach((slide, i) => {
      if (!slide) return
      
      if (i === activeSlide) {
        // ACTIVE SLIDE: slide in to center
        gsap.to(slide, { 
          x: '0%', 
          opacity: 1,
          pointerEvents: 'auto', 
          duration: 1.0, 
          ease: 'power3.inOut', 
          overwrite: true,
          zIndex: 10
        })
      } else if (i < activeSlide) {
        // PAST SLIDE: slide out to the left
        gsap.to(slide, { 
          x: '-100%', 
          opacity: 0.5,
          pointerEvents: 'none', 
          duration: 1.0, 
          ease: 'power3.inOut', 
          overwrite: true,
          zIndex: 1
        })
      } else {
        // FUTURE SLIDE: stay hidden at the right, ready to slide in
        gsap.to(slide, { 
          x: '100%', 
          opacity: 0,
          pointerEvents: 'none', 
          duration: 1.0, 
          ease: 'power3.inOut', 
          overwrite: true,
          zIndex: 1
        })
      }
    })
  }, [activeSlide])

  return (
    <section id="works" ref={sectionRef} className="relative min-h-screen bg-[var(--color-canvas)] overflow-hidden">
      
      {/* Desktop: Pinned full-screen slides */}
      <div className="hidden md:block relative h-screen w-full">
        
        {/* Section header — always visible */}
        <div className="absolute top-20 left-6 lg:left-12 z-20">
          <span className="font-mono text-xs text-[var(--color-text-muted)] uppercase tracking-widest">
            Featured Projects
          </span>
        </div>

        {/* Slides */}
        {projects.map((exp, i) => (
          <div
            key={exp.id}
            ref={(el) => { slideRefs.current[i] = el }}
            className="works-slide absolute inset-0 flex items-center bg-[var(--color-canvas)] will-change-transform"
            style={{ 
              transform: `translateX(${i === 0 ? '0%' : '100%'})`, 
              opacity: i === 0 ? 1 : 0,
              pointerEvents: i === 0 ? 'auto' : 'none',
              zIndex: i === 0 ? 10 : 1
            }}
          >
            <div className="max-w-[1400px] mx-auto px-6 lg:px-12 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
              
              {/* Left: Project info */}
              <div className="works-text space-y-6">
                <span className="font-mono text-xs uppercase tracking-widest text-[var(--color-text-muted)]">
                  {exp.tags.join(' · ')}
                </span>
                <h3 className="font-display font-semibold text-4xl lg:text-5xl tracking-tight leading-tight">
                  {exp.title}
                </h3>
                <p className="font-sans text-[var(--color-text-muted)] text-base leading-relaxed max-w-[50ch]">
                  {exp.description}
                </p>
                <div className="pt-2">
                  <span className="font-sans font-medium text-sm">Built with: </span>
                  <span className="font-sans text-[var(--color-text-muted)] text-sm">
                    {exp.stack.join(', ')}.
                  </span>
                </div>
                <div className="flex items-center gap-6 pt-4">
                  <a href="#" className="text-[var(--color-primary)] text-sm font-sans font-medium hover:opacity-70 transition-opacity inline-flex items-center gap-1.5">
                    View the code <span className="text-xs">›</span>
                  </a>
                </div>
              </div>

              {/* Right: Project preview mockup */}
              <div className="works-mockup relative flex items-center justify-center">
                <div className="w-full max-w-lg aspect-[4/3] rounded-xl bg-[var(--color-surface)] border border-[var(--color-border-subtle)] p-6 flex flex-col items-center justify-center relative overflow-hidden shadow-xl">
                  {/* Simulated app window chrome */}
                  <div className="absolute top-4 left-4 flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-border-subtle)]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-border-subtle)]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-border-subtle)]" />
                  </div>
                  <div className="text-center mt-4">
                    <div className="font-display font-semibold text-xl mb-2">{exp.company}</div>
                    <div className="font-mono text-xs text-[var(--color-text-muted)]">{exp.period}</div>
                  </div>
                  {/* Stack pills */}
                  <div className="flex flex-wrap justify-center gap-2 mt-6">
                    {exp.stack.slice(0, 4).map((s) => (
                      <span key={s} className="px-3 py-1 rounded-full text-[10px] font-mono border border-[var(--color-border-subtle)] text-[var(--color-text-muted)]">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        ))}

        {/* Dot pagination */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
          {projects.map((_, i) => (
            <div
              key={i}
              className={`works-dot w-2.5 h-2.5 rounded-full transition-all duration-500 ${
                i === activeSlide ? 'active' : ''
              }`}
              style={{
                backgroundColor: 'var(--color-border-subtle)',
              }}
            />
          ))}
        </div>
      </div>

      {/* Mobile: Stacked cards */}
      <div className="md:hidden py-24 px-6 space-y-16">
        <div>
          <h2 className="font-display font-medium text-3xl tracking-tight mb-2">Recent Works</h2>
          <p className="font-sans text-[var(--color-text-muted)] text-sm">Selected projects.</p>
        </div>
        {projects.map((exp) => (
          <div key={exp.id} className="space-y-4 border-t border-[var(--color-border-subtle)] pt-8">
            <span className="font-mono text-xs uppercase tracking-widest text-[var(--color-text-muted)]">
              {exp.tags.join(' · ')}
            </span>
            <h3 className="font-display font-semibold text-2xl tracking-tight">{exp.title}</h3>
            <p className="font-sans text-[var(--color-text-muted)] text-sm leading-relaxed">{exp.description}</p>
            <div className="text-xs font-mono text-[var(--color-text-muted)]">
              {exp.stack.join(', ')}
            </div>
          </div>
        ))}
      </div>

    </section>
  )
}
