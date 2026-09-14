import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import data from '../data/cv.json'

gsap.registerPlugin(ScrollTrigger)

// Map tech names to devicon class names (https://devicon.dev/)
const techIcons: Record<string, string> = {
  'Laravel': 'devicon-laravel-original',
  'Tailwind': 'devicon-tailwindcss-original',
  'Django': 'devicon-django-plain',
  'Next JS': 'devicon-nextjs-original-wordmark',
  'Vue JS': 'devicon-vuejs-plain',
  'Springboot': 'devicon-spring-original',
  'React': 'devicon-react-original',
  'Git': 'devicon-git-plain',
  'Go-Lang': 'devicon-go-original-wordmark',
  'PostgreSQL': 'devicon-postgresql-plain',
  'MySQL': 'devicon-mysql-original',
  'Unity': 'devicon-unity-plain',
  'Three.js': 'devicon-threejs-original',
}

export default function TechStack() {
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.tech-icon-item').forEach((el, i) => {
        gsap.fromTo(el,
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            delay: i * 0.05,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: gridRef.current,
              start: 'top 80%',
              once: true,
            }
          }
        )
      })
    }, gridRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="tech" className="py-24 lg:py-32 bg-[var(--color-canvas)] border-b border-[var(--color-border-subtle)]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 w-full">
        
        {/* Header */}
        <div className="mb-16 text-center">
          <h2 className="font-display font-semibold text-4xl sm:text-5xl tracking-tight mb-4">
            Skills & Stack
          </h2>
          <p className="font-sans text-[var(--color-text-muted)] text-base max-w-[50ch] mx-auto">
            Technologies I work with to build scalable, performant applications.
          </p>
        </div>

        {/* Icons grid — no boxes, just logos + names */}
        <div ref={gridRef} className="flex flex-wrap justify-center gap-x-12 gap-y-10 max-w-4xl mx-auto">
          {data.tech_stack.map((tech) => {
            const iconClass = techIcons[tech] || 'devicon-devicon-plain'
            return (
              <div
                key={tech}
                className="tech-icon-item flex flex-col items-center gap-3 group cursor-default"
              >
                <i className={`${iconClass} text-[40px] text-[var(--color-text-muted)] group-hover:text-[var(--color-text-main)] transition-colors duration-300`} />
                <span className="font-sans text-xs text-[var(--color-text-muted)] group-hover:text-[var(--color-text-main)] transition-colors duration-300">
                  {tech}
                </span>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
