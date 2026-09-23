import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLanguage } from '../lib/i18n'

gsap.registerPlugin(ScrollTrigger)

export default function Contact() {
  const { t } = useLanguage()
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.contact-reveal',
        { y: 30, opacity: 0, filter: 'blur(8px)' },
        {
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.contact-reveal',
            start: 'top 85%',
            once: true,
          }
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="contact" ref={sectionRef} className="min-h-[60vh] flex items-center justify-center relative px-6">
      <div className="max-w-[1000px] mx-auto w-full text-center">
        <h2 className="contact-reveal font-display font-bold uppercase text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.1] tracking-tight text-[var(--color-text-main)] mx-auto max-w-[22ch]">
          {t('contact.heading')}
        </h2>
      </div>
    </section>
  )
}
