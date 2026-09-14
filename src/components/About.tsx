import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import data from '../data/cv.json'

gsap.registerPlugin(ScrollTrigger)

export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Stagger reveal each child element
      gsap.utils.toArray<HTMLElement>('.about-reveal').forEach((el, i) => {
        gsap.fromTo(el,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            delay: i * 0.08,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              once: true,
            }
          }
        )
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="about" ref={sectionRef} className="py-24 lg:py-32 bg-[var(--color-canvas)] border-b border-[var(--color-border-subtle)]">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 w-full">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-24 items-start">
          
          <div className="md:col-span-5">
            <h2 className="about-reveal font-display text-4xl sm:text-5xl font-semibold leading-tight mb-8 tracking-tight">
              Human-Centered Design,<br/>
              <span className="text-[var(--color-text-muted)]">Analytical Code.</span>
            </h2>
            
            <div className="about-reveal space-y-3 font-mono text-sm text-[var(--color-text-muted)] border-l border-[var(--color-border-subtle)] pl-4">
              <div>{data.profile.education}</div>
              {data.profile.certifications.map(cert => (
                <div key={cert}>{cert}</div>
              ))}
              <div>{data.profile.location}</div>
            </div>
          </div>

          <div className="md:col-span-7 space-y-6 font-sans text-base sm:text-lg leading-relaxed max-w-[60ch] text-[var(--color-text-main)]">
            <p className="about-reveal">
              I believe that impactful software is built at the intersection of intuitive UI/UX design and rigorous backend engineering. Every system I develop is architected with clean data flow, high performance, and long-term maintainability in mind.
            </p>
            <p className="about-reveal text-[var(--color-text-muted)]">
              Approaching every engineering challenge with an analytical mindset, whether configuring microservices or building interactive web experiences.
            </p>
            <blockquote className="about-reveal mt-8 font-display text-xl sm:text-2xl leading-snug">
              "A problem is an opportunity to build an elegant, scalable solution."
            </blockquote>
          </div>

        </div>
      </div>
    </section>
  )
}
