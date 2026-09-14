import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import data from '../data/cv.json'
import randiImg from '../assets/randi-nobg2.png'

gsap.registerPlugin(ScrollTrigger)

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Entrance animation
    const tl = gsap.timeline()
    tl.fromTo('.hero-text-line', 
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, stagger: 0.1, ease: 'power3.out', delay: 0.1 }
    )
    tl.fromTo('.hero-sub',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' },
      "-=0.5"
    )
    tl.fromTo('.hero-cta',
      { opacity: 0 },
      { opacity: 1, duration: 0.8 },
      "-=0.6"
    )
    tl.fromTo('.hero-image',
      { opacity: 0, scale: 0.95, filter: 'blur(10px)' },
      { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 1.2, ease: 'power3.out' },
      "-=1.0"
    )

    // Parallax on scroll — text moves up faster, image lingers
    const ctx = gsap.context(() => {
      if (textRef.current) {
        gsap.to(textRef.current, {
          y: -80,
          opacity: 0.3,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1.2,
          }
        })
      }
      if (imageRef.current) {
        gsap.to(imageRef.current, {
          y: -30,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 2,
          }
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const shortSummary = data.profile.summary.split(' ').slice(0, 22).join(' ') + '.';

  return (
    <section id="hero" ref={sectionRef} className="min-h-[100dvh] flex items-center relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Column: Typography — scrolls away faster */}
        <div ref={textRef} className="z-10 pt-24 lg:pt-0 will-change-transform">
          <h1 className="font-display font-semibold text-5xl md:text-6xl lg:text-[4.5rem] tracking-tight leading-[1.08] mb-6">
            <div className="overflow-hidden pb-1"><div className="hero-text-line">{data.profile.role}</div></div>
          </h1>
          
          <p className="hero-sub text-[var(--color-text-muted)] text-base md:text-lg leading-relaxed max-w-[48ch] mb-8 font-sans">
            {shortSummary}
          </p>
          
          <div className="hero-cta flex items-center gap-6">
            <a href="#about" className="text-[var(--color-primary)] text-sm font-sans font-medium hover:opacity-70 transition-opacity inline-flex items-center gap-1.5">
              About me <span className="text-xs">›</span>
            </a>
          </div>
        </div>

        {/* Right Column: Profile Image — lingers with slower parallax */}
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
