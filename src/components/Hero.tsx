import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import data from '../data/cv.json'
import randiImg from '../assets/randi-nobg2.png'
import { BlurReveal } from './ui/blur-reveal'
import { StaggerBlurEffect } from './ui/stagger-blur-effect'

gsap.registerPlugin(ScrollTrigger)

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const tl = gsap.timeline()
    // Image entrance animation
    tl.fromTo('.hero-image',
      { opacity: 0, scale: 0.95, filter: 'blur(10px)' },
      { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 1.2, ease: 'power3.out', delay: 0.2 }
    )

    // Smooth scrub parallax for the entire hero content
    const ctx = gsap.context(() => {
      gsap.to('.hero-content-wrapper', {
        y: 100, // Moves down slightly as user scrolls down, creating parallax
        opacity: 0.2,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        }
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const shortSummary = data.profile.summary.split(' ').slice(0, 22).join(' ') + '.';
  const roleWords = data.profile.role.split(' ')

  return (
    <section id="hero" ref={sectionRef} className="min-h-[100dvh] flex items-center relative overflow-hidden">
      <div className="hero-content-wrapper max-w-[1400px] mx-auto px-6 lg:px-12 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Column: Typography */}
        <div ref={textRef} className="z-10 pt-24 lg:pt-0 will-change-transform">
          <h1 className="font-display font-semibold text-5xl md:text-6xl lg:text-[4.5rem] tracking-tight leading-[1.08] mb-6">
            <StaggerBlurEffect delay={0.1}>{data.profile.role}</StaggerBlurEffect>
          </h1>
          
          <BlurReveal delay={roleWords.length * 0.1} className="block text-[var(--color-text-muted)] text-base md:text-lg leading-relaxed max-w-[48ch] mb-8 font-sans">
            {shortSummary}
          </BlurReveal>
          
          <BlurReveal delay={(roleWords.length * 0.1) + 0.1} className="flex items-center gap-6">
            <a href="#about" className="text-[var(--color-primary)] text-sm font-sans font-medium hover:opacity-70 transition-opacity inline-flex items-center gap-1.5">
              About me <span className="text-xs">›</span>
            </a>
          </BlurReveal>
        </div>

        {/* Right Column: Profile Image */}
        <div ref={imageRef} className="relative h-full w-full flex-center will-change-transform lg:justify-end pt-12 lg:pt-0">
          <div className="hero-image relative w-[90%] max-w-[500px] aspect-square flex items-center justify-center">
            {/* The soft glow behind the transparent image */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-[var(--color-primary)] rounded-full opacity-10 blur-3xl mix-blend-screen"></div>
            <img 
              src={randiImg} 
              alt="Randi Zakaria Putra" 
              className="w-full h-full object-contain grayscale opacity-90 hover:grayscale-0 hover:opacity-100 transition-all duration-700 ease-out z-10"
            />
          </div>
        </div>

      </div>
    </section>
  )
}
