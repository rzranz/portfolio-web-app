import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import data from '../data/cv.json'

gsap.registerPlugin(ScrollTrigger)

export default function RecentWorks() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const projects = data.experience

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      mm.add("(min-width: 768px)", () => {
        if (!sectionRef.current) return

        const slides = gsap.utils.toArray<HTMLElement>('.works-slide')
        const dots = gsap.utils.toArray<HTMLElement>('.works-dot')
        const totalSlides = slides.length

        // Each slide gets a generous scroll distance so users can read comfortably
        const scrollPerSlide = window.innerHeight * 1.5
        const totalScroll = scrollPerSlide * totalSlides

        // Pin the whole section
        const pinTrigger = ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top top',
          end: `+=${totalScroll}`,
          pin: true,
          scrub: true,
        })

        // Animate each slide: fade in → hold → fade out
        slides.forEach((slide, i) => {
          const textContent = slide.querySelector('.works-text') as HTMLElement
          const mockupContent = slide.querySelector('.works-mockup') as HTMLElement

          // Calculate normalized start/end for this slide
          const slideStart = i / totalSlides
          const slideEnd = (i + 1) / totalSlides
          const fadeDuration = 0.15 / totalSlides // 15% of one slide's duration for fade

          if (i === 0) {
            // First slide: start visible, fade out at end
            gsap.set(slide, { opacity: 1, pointerEvents: 'auto' })

            // Parallax: text moves up slightly, mockup stays
            gsap.fromTo(textContent,
              { y: 0 },
              {
                y: -30,
                ease: 'none',
                scrollTrigger: {
                  trigger: sectionRef.current,
                  start: 'top top',
                  end: `+=${scrollPerSlide}`,
                  scrub: 1.5,
                }
              }
            )

            // Fade out first slide
            gsap.to(slide, {
              opacity: 0,
              pointerEvents: 'none',
              ease: 'none',
              scrollTrigger: {
                trigger: sectionRef.current,
                start: `+=${scrollPerSlide * 0.8}`,
                end: `+=${scrollPerSlide}`,
                scrub: 1.5,
              }
            })
          } else {
            // Other slides: fade in → hold → fade out
            gsap.set(slide, { opacity: 0, pointerEvents: 'none' })

            // Fade in
            const fadeInStart = scrollPerSlide * (i - 0.2)
            const fadeInEnd = scrollPerSlide * i
            gsap.to(slide, {
              opacity: 1,
              pointerEvents: 'auto',
              ease: 'none',
              scrollTrigger: {
                trigger: sectionRef.current,
                start: `+=${fadeInStart}`,
                end: `+=${fadeInEnd}`,
                scrub: 1.5,
              }
            })

            // Parallax on text
            gsap.fromTo(textContent,
              { y: 30 },
              {
                y: -30,
                ease: 'none',
                scrollTrigger: {
                  trigger: sectionRef.current,
                  start: `+=${scrollPerSlide * i}`,
                  end: `+=${scrollPerSlide * (i + 1)}`,
                  scrub: 1.5,
                }
              }
            )

            // Parallax on mockup (slower, creates depth)
            gsap.fromTo(mockupContent,
              { y: 20 },
              {
                y: -10,
                ease: 'none',
                scrollTrigger: {
                  trigger: sectionRef.current,
                  start: `+=${scrollPerSlide * i}`,
                  end: `+=${scrollPerSlide * (i + 1)}`,
                  scrub: 2,
                }
              }
            )

            // Fade out (not for last slide)
            if (i < totalSlides - 1) {
              const fadeOutStart = scrollPerSlide * (i + 0.8)
              const fadeOutEnd = scrollPerSlide * (i + 1)
              gsap.to(slide, {
                opacity: 0,
                pointerEvents: 'none',
                ease: 'none',
                scrollTrigger: {
                  trigger: sectionRef.current,
                  start: `+=${fadeOutStart}`,
                  end: `+=${fadeOutEnd}`,
                  scrub: 1.5,
                }
              })
            }
          }

          // Dot activation
          if (dots[i]) {
            ScrollTrigger.create({
              trigger: sectionRef.current,
              start: `+=${scrollPerSlide * i}`,
              end: `+=${scrollPerSlide * (i + 1)}`,
              onEnter: () => {
                dots.forEach((d, di) => {
                  d.classList.toggle('active', di === i)
                })
              },
              onEnterBack: () => {
                dots.forEach((d, di) => {
                  d.classList.toggle('active', di === i)
                })
              },
            })
          }
        })
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [projects.length])

  return (
    <section id="works" ref={sectionRef} className="relative min-h-screen bg-[var(--color-canvas)]">
      
      {/* Desktop: Pinned full-screen slides */}
      <div className="hidden md:block relative h-screen w-full overflow-hidden">
        
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
            className="works-slide absolute inset-0 flex items-center will-change-[opacity]"
          >
            <div className="max-w-[1400px] mx-auto px-6 lg:px-12 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
              
              {/* Left: Project info */}
              <div className="works-text space-y-6 will-change-transform">
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
              <div className="works-mockup relative flex items-center justify-center will-change-transform">
                <div className="w-full max-w-lg aspect-[4/3] rounded-xl bg-[var(--color-surface)] border border-[var(--color-border-subtle)] p-6 flex flex-col items-center justify-center relative overflow-hidden">
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
                i === 0 ? 'active' : ''
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
