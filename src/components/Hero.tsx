import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import data from '../data/cv.json'
import { BlurReveal } from './ui/blur-reveal'
import { AnimatePresence, motion } from 'framer-motion'
import { useLanguage } from '../lib/i18n'
import { Particles } from './ui/particles'

gsap.registerPlugin(ScrollTrigger)

export default function Hero() {
  const { t } = useLanguage()
  const sectionRef = useRef<HTMLElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0)

  const roles = [
    "RANDI",
    "A DEVELOPER",
    "A SOFTWARE ENGINEER",
    "TECH ENTHUSIAST"
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRoleIndex((prev) => (prev + 1) % roles.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [roles.length])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to('.hero-content-wrapper', {
        y: 60,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=100%',
          scrub: true,
        }
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const roleWords = data.profile.role.split(' ')

  return (
    <section id="hero" ref={sectionRef} className="lg:sticky lg:top-0 min-h-[100svh] w-full z-10 flex flex-col justify-center overflow-hidden bg-[var(--color-canvas)]">
      <Particles id="hero-particles" className="absolute inset-0 pointer-events-none z-0" />
      <div className="hero-content-wrapper max-w-[1400px] mx-auto px-6 lg:px-12 w-full z-10 pt-28 pb-12 sm:pt-24 sm:pb-8 flex flex-col justify-center">
        
        {/* Top Label */}
        <BlurReveal delay={0.1} className="mb-6 md:mb-10">
          <span className="text-xs md:text-sm tracking-[0.25em] text-[var(--color-text-muted)] uppercase font-semibold">
            {t('hero.label')}
          </span>
        </BlurReveal>

        {/* Huge Typography with Poppins Bold & letter-spacing control */}
        <div ref={textRef} className="will-change-transform">
          <h1 className="font-display font-bold text-[9vw] sm:text-[7vw] md:text-[6vw] lg:text-[5.5vw] xl:text-[6rem] tracking-tighter leading-[1] mb-6 sm:mb-8 flex flex-col uppercase">
            <span className="text-[var(--color-text-muted)] mb-1 sm:mb-2 text-[6vw] sm:text-inherit font-bold tracking-tight">
              {t('hero.iam')}
            </span>
            <div className="relative h-[2.2em] sm:h-[1.1em] text-[var(--color-text-main)] w-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentRoleIndex}
                  initial={{ y: 20, opacity: 0, filter: 'blur(8px)' }}
                  animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                  exit={{ y: -20, opacity: 0, filter: 'blur(8px)' }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="absolute inset-0 whitespace-normal sm:whitespace-nowrap break-words font-extrabold tracking-tighter"
                >
                  {roles[currentRoleIndex]}
                </motion.div>
              </AnimatePresence>
            </div>
          </h1>
          
          <BlurReveal delay={roleWords.length * 0.1} className="block text-[var(--color-text-muted)] text-base md:text-xl leading-relaxed max-w-[50ch] mb-10 font-sans tracking-normal">
            {t('hero.desc')}
          </BlurReveal>
          
          <BlurReveal delay={(roleWords.length * 0.1) + 0.1} className="flex flex-row items-center justify-between w-full mt-4">
            <a 
              href="#about" 
              className="rounded-[2rem] border border-[var(--color-border-subtle)] px-8 py-3 text-sm md:text-base font-semibold tracking-wider hover:bg-[var(--color-text-main)] hover:text-[var(--color-canvas)] transition-all uppercase"
            >
              {t('hero.about')}
            </a>
            <a 
              href="#works" 
              className="flex items-center gap-2 text-sm md:text-base font-semibold tracking-wider border-b border-[var(--color-text-main)] pb-1 hover:opacity-70 transition-opacity uppercase"
            >
              {t('hero.recent')} <span className="text-xl leading-none">→</span>
            </a>
          </BlurReveal>
        </div>

      </div>
    </section>
  )
}
