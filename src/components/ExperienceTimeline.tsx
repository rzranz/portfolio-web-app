import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLanguage } from '../lib/i18n'
import { ArrowUpRight } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

export interface MilestoneItem {
  index: string
  categoryKey: string
  entity: string
  entityUrl?: string
  role: string
  period: string
  descKey: string
  tag: string
}

const MILESTONES: MilestoneItem[] = [
  {
    index: '01',
    categoryKey: 'exp.cat.org',
    entity: 'HMIF UNIKOM',
    entityUrl: 'https://hmif.unikom.my.id/',
    role: 'Head of Communication & Information Division',
    period: 'Jan 2025 - Dec 2025',
    descKey: 'exp.desc.org',
    tag: 'Web Portal & Division Leadership'
  },
  {
    index: '02',
    categoryKey: 'exp.cat.intern',
    entity: 'PT Yukmari Project',
    role: 'Project Manager + Fullstack Developer',
    period: 'Internship · 2025',
    descKey: 'exp.desc.intern',
    tag: 'Client SDLC & Database Architecture'
  },
  {
    index: '03',
    categoryKey: 'exp.cat.dishut',
    entity: 'Dinas Kehutanan Jabar',
    role: 'Lead Fullstack WebGIS Engineer',
    period: 'SIGAP JABAR · 2025 - 2026',
    descKey: 'exp.desc.dishut',
    tag: 'Critical Land Spatial WebGIS'
  },
  {
    index: '04',
    categoryKey: 'exp.cat.pdam',
    entity: 'PDAM Kota Tegal',
    role: 'IoT Backend & Telemetry Engineer',
    period: 'IoT Smart Water · 2025',
    descKey: 'exp.desc.pdam',
    tag: 'Real-time Sensor Ingestion'
  },
  {
    index: '05',
    categoryKey: 'exp.cat.darulfikri',
    entity: 'RA Darul Fikri',
    role: 'Fullstack & Integration Engineer',
    period: 'Tuition & Notification Gateway · 2025',
    descKey: 'exp.desc.darulfikri',
    tag: 'Pakasir Payment & WhatsApp Automation'
  },
  {
    index: '06',
    categoryKey: 'exp.cat.sh',
    entity: 'iCraft DS',
    entityUrl: 'https://www.icraftds.id/',
    role: 'Software Engineer',
    period: 'Present / Saat Ini (Active)',
    descKey: 'exp.desc.sh',
    tag: 'Software House & AI Mentor Engine'
  }
]

export default function ExperienceTimeline() {
  const { t } = useLanguage()
  const sectionRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const activeLineRef = useRef<HTMLDivElement>(null)
  const [activeStep, setActiveStep] = useState(1)

  useEffect(() => {
    const isDesktop = window.matchMedia('(min-width: 1024px)').matches
    if (!isDesktop || !sectionRef.current || !trackRef.current) return

    const ctx = gsap.context(() => {
      const track = trackRef.current!
      const totalMilestones = MILESTONES.length
      const scrollDistance = () => Math.max(0, track.scrollWidth - window.innerWidth + 180)

      // Timeline scrub pinned to section - buttery smooth, zero-jump scrub with anticipatePin
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: () => `+=${Math.max(1200, track.scrollWidth - window.innerWidth + 200)}`,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          scrub: 0.6,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const step = Math.min(
              totalMilestones,
              Math.max(1, Math.floor(self.progress * totalMilestones) + 1)
            )
            setActiveStep(step)
          }
        }
      })

      // 1. Horizontal track movement
      tl.to(track, {
        x: () => -scrollDistance(),
        ease: 'none'
      }, 0)

      // 2. Active line progress fill
      if (activeLineRef.current) {
        tl.to(activeLineRef.current, {
          scaleX: 1,
          ease: 'none'
        }, 0)
      }

      // 3. Step-by-step reveal: crisp, instant transition without blur delays
      const milestoneNodes = gsap.utils.toArray<HTMLElement>('.review-node')
      milestoneNodes.forEach((node, idx) => {
        if (idx === 0) return // First node is active by default

        const triggerProgress = idx / (totalMilestones - 1)

        tl.fromTo(
          node,
          { opacity: 0.2, y: 15 },
          {
            opacity: 1,
            y: 0,
            duration: 0.2,
            ease: 'power2.out'
          },
          Math.max(0, triggerProgress - 0.08)
        )
      })

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section 
      id="experience" 
      ref={sectionRef} 
      className="relative z-40 min-h-screen w-full bg-[var(--color-canvas)] shadow-[0_-25px_50px_rgba(0,0,0,0.35)] border-t border-[var(--color-border-subtle)] flex flex-col justify-between overflow-hidden"
    >
      {/* Editorial Header */}
      <div className="max-w-[1360px] mx-auto px-6 sm:px-10 lg:pl-12 lg:pr-28 w-full pt-20 md:pt-24 pb-4 z-20">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[var(--color-border-subtle)] pb-5">
          <div>
            <span className="font-mono text-xs font-bold tracking-[0.2em] text-[var(--color-text-muted)] uppercase mb-2 block">
              {t('experience.kicker')}
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-tight text-[var(--color-text-main)] leading-none">
              {t('experience.title')}
            </h2>
          </div>

          <div className="flex items-center gap-6">
            <p className="font-sans text-xs sm:text-sm text-[var(--color-text-muted)] max-w-[42ch] leading-relaxed hidden sm:block">
              {t('experience.subtitle')}
            </p>
            {/* Step Counter: Pure Typography, no rounded pill */}
            <div className="font-mono text-xs font-bold text-[var(--color-primary)] tracking-wider shrink-0 flex items-center gap-2">
              <span>{t('experience.step')} 0{activeStep} / 0{MILESTONES.length}</span>
            </div>
          </div>
        </header>
      </div>

      {/* ========================================================
          DESKTOP: Minimalist Scroll Review (Zero Slop, Pure Typography)
          ======================================================== */}
      <div className="hidden lg:block relative w-full flex-1 overflow-hidden my-auto py-4">
        
        {/* Horizontal Scrolling Track */}
        <div 
          ref={trackRef} 
          className="relative flex items-start gap-16 xl:gap-24 pl-12 pr-64 will-change-transform pt-2"
        >
          {/* Continuous Base Line across full track */}
          <div className="absolute top-[93px] left-12 right-0 h-[2px] bg-[var(--color-border-subtle)] pointer-events-none z-0" />
          
          {/* Continuous Active Glowing Line across full track */}
          <div 
            ref={activeLineRef}
            className="absolute top-[93px] left-12 right-0 h-[2px] bg-[var(--color-primary)] shadow-[0_0_14px_var(--color-primary)] origin-left scale-x-0 pointer-events-none z-10"
          />

          {MILESTONES.map((item, idx) => {
            const isFirst = idx === 0

            return (
              <div 
                key={item.index}
                className={`review-node flex-shrink-0 w-[380px] xl:w-[420px] flex flex-col justify-start relative select-none transition-opacity duration-300 ${
                  isFirst ? 'opacity-100' : 'opacity-20'
                }`}
              >
                {/* 1. Artistic Outline Numeral (Adaptive Light/Dark Contrast) */}
                <div className="node-number font-display font-black text-6xl xl:text-7xl leading-none tracking-tighter text-[var(--color-text-muted)]/25 select-none transition-all duration-300 h-[70px] flex items-end">
                  {item.index}
                </div>

                {/* 2. Timeline Axis Row (Dot) */}
                <div className="relative h-10 flex items-center my-1 z-20">
                  <div className={`node-dot w-4 h-4 rounded-full border-2 border-[var(--color-primary)] bg-[var(--color-canvas)] transition-all duration-300 shadow-[0_0_12px_var(--color-primary)] ${
                    isFirst ? 'scale-110' : ''
                  }`} />
                </div>

                {/* 3. Pure Typography Content (No Card Box, Zero Slop) */}
                <div className="node-content space-y-2 pt-1">
                  {/* Meta / Period */}
                  <div className="flex items-center gap-2 font-mono text-[10px] uppercase font-bold tracking-widest text-[var(--color-primary)]">
                    <span>{t(item.categoryKey)}</span>
                    <span className="text-[var(--color-text-muted)]">·</span>
                    <span className="text-[var(--color-text-muted)]">{item.period}</span>
                  </div>

                  {/* Entity Title */}
                  <h3 className="font-display font-extrabold text-2xl xl:text-3xl text-[var(--color-text-main)] tracking-tight leading-snug flex items-center gap-1.5">
                    {item.entity}
                    {item.entityUrl && (
                      <a 
                        href={item.entityUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[var(--color-primary)] hover:opacity-80 transition-opacity inline-flex"
                        title="Visit Link"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </a>
                    )}
                  </h3>

                  {/* Role */}
                  <p className="font-mono text-xs font-semibold text-[var(--color-text-muted)]">
                    {item.role}
                  </p>

                  {/* Concise Narrative */}
                  <p className="font-sans text-xs sm:text-sm text-[var(--color-text-muted)] leading-relaxed pt-1">
                    {t(item.descKey)}
                  </p>

                  {/* Impact Tag */}
                  <p className="font-mono text-[11px] text-[var(--color-primary)]/90 pt-2 border-l-2 border-[var(--color-primary)]/40 pl-2.5">
                    {item.tag}
                  </p>
                </div>

              </div>
            )
          })}
        </div>
      </div>

      {/* ========================================================
          MOBILE / TABLET: Vertical Connected Review
          ======================================================== */}
      <div className="lg:hidden px-6 sm:px-10 pb-20 pt-4 space-y-8">
        <div className="relative border-l-2 border-[var(--color-primary)]/40 pl-6 sm:pl-8 ml-3 space-y-10">
          {MILESTONES.map((item) => (
            <div key={item.index} className="relative space-y-2">
              {/* Dot on vertical line */}
              <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-3.5 h-3.5 rounded-full bg-[var(--color-canvas)] border-2 border-[var(--color-primary)] shadow-[0_0_10px_var(--color-primary)]" />

              <div className="flex items-center gap-2 font-mono text-[10px] uppercase font-bold text-[var(--color-primary)] tracking-wider">
                <span>{item.index}</span>
                <span>·</span>
                <span>{t(item.categoryKey)}</span>
                <span className="text-[var(--color-text-muted)]">({item.period})</span>
              </div>

              <h3 className="font-display font-bold text-xl text-[var(--color-text-main)] flex items-center gap-1">
                {item.entity}
                {item.entityUrl && (
                  <a href={item.entityUrl} target="_blank" rel="noreferrer" className="text-[var(--color-primary)]">
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                )}
              </h3>

              <p className="font-mono text-xs text-[var(--color-text-muted)]">
                {item.role}
              </p>

              <p className="font-sans text-xs text-[var(--color-text-muted)] leading-relaxed">
                {t(item.descKey)}
              </p>

              <p className="font-mono text-[10px] text-[var(--color-primary)]/80 border-l border-[var(--color-primary)]/40 pl-2">
                {item.tag}
              </p>
            </div>
          ))}
        </div>
      </div>

    </section>
  )
}
