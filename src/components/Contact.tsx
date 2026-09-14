import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import data from '../data/cv.json'

gsap.registerPlugin(ScrollTrigger)

export default function Contact() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.contact-reveal').forEach((el, i) => {
        gsap.fromTo(el,
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            delay: i * 0.1,
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
    <section id="contact" ref={sectionRef} className="min-h-screen flex items-center relative">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        
        {/* Left: Decorative / visual */}
        <div className="hidden lg:flex items-center justify-center">
          <div className="relative w-80 h-80">
            {/* Abstract circle decoration */}
            <div className="absolute inset-0 rounded-full border border-[var(--color-border-subtle)] opacity-30" />
            <div className="absolute inset-8 rounded-full border border-[var(--color-border-subtle)] opacity-20" />
            <div className="absolute inset-16 rounded-full border border-[var(--color-border-subtle)] opacity-10" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[var(--color-primary)]" />
          </div>
        </div>

        {/* Right: Contact info */}
        <div className="space-y-8 py-24 lg:py-0">
          <p className="contact-reveal font-sans text-lg sm:text-xl leading-relaxed text-[var(--color-text-main)] max-w-[45ch]">
            What would you do if a software expert was just a click away?
          </p>
          <p className="contact-reveal font-sans text-base leading-relaxed text-[var(--color-text-muted)] max-w-[45ch]">
            Whether you want to start a new project or just say hello, I'd love to hear from you.
          </p>
          
          {/* Bold email — DVLPR style */}
          <a 
            href={`mailto:${data.profile.email}`}
            className="contact-reveal font-display font-semibold text-2xl sm:text-3xl lg:text-4xl tracking-tight hover:text-[var(--color-primary)] transition-colors block"
          >
            {data.profile.email}
          </a>

          <div className="contact-reveal flex items-center gap-6 font-mono text-xs text-[var(--color-text-muted)] pt-4">
            <a href={data.profile.linkedin} target="_blank" rel="noreferrer" className="hover:text-[var(--color-text-main)] transition-colors">
              LinkedIn
            </a>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-[var(--color-text-main)] transition-colors">
              GitHub
            </a>
            <span>{data.profile.location}</span>
          </div>
        </div>

      </div>
    </section>
  )
}
