import { useRef } from 'react'
import { motion, useScroll, useTransform } from "framer-motion"
import { cn } from "../lib/utils"
import data from '../data/cv.json'
import { useLanguage } from '../lib/i18n'

// Map tech names to devicon class names
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
  'SQLite': 'devicon-sqlite-plain',
  'Unity': 'devicon-unity-plain',
  'Three.js': 'devicon-threejs-original',
}

// Detect mobile once at module level — stable, no per-render check
const IS_MOBILE = typeof window !== 'undefined' && window.innerWidth < 768

const Bracket = ({ className }: { className: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 27 78"
      className={className}
    >
      <path
        fill="currentColor"
        d="M26.52 77.21h-5.75c-6.83 0-12.38-5.56-12.38-12.38V48.38C8.39 43.76 4.63 40 .01 40v-4c4.62 0 8.38-3.76 8.38-8.38V12.4C8.38 5.56 13.94 0 20.77 0h5.75v4h-5.75c-4.62 0-8.38 3.76-8.38 8.38V27.6c0 4.34-2.25 8.17-5.64 10.38 3.39 2.21 5.64 6.04 5.64 10.38v16.45c0 4.62 3.76 8.38 8.38 8.38h5.75v4.02Z"
      ></path>
    </svg>
  )
}

// Static mobile grid — no animation, no framer-motion subscriptions
function MobileTechGrid({ techList }: { techList: string[] }) {
  return (
    <div className="flex flex-wrap items-center justify-center max-w-sm mx-auto gap-3">
      {techList.map((tech) => {
        const iconClass = techIcons[tech] || 'devicon-devicon-plain'
        return (
          <div
            key={tech}
            title={tech}
            className="inline-flex flex-col items-center justify-center p-2.5"
          >
            <i className={cn(iconClass, "text-3xl text-[var(--color-text-muted)]")} />
            <span className="font-sans text-[9px] mt-1 text-[var(--color-text-muted)]">
              {tech}
            </span>
          </div>
        )
      })}
    </div>
  )
}

// Desktop version — only mounts on desktop, so Framer hooks are safe
function DesktopTechGrid({ techList, sectionRef }: { techList: string[]; sectionRef: React.RefObject<HTMLElement | null> }) {
  const centerIndex = Math.floor(techList.length / 2)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "center center"]
  })

  return (
    <div className="flex flex-wrap items-center justify-center max-w-4xl mx-auto gap-4 relative">
      {techList.map((tech, index) => {
        const iconClass = techIcons[tech] || 'devicon-devicon-plain'
        const distanceFromCenter = index - centerIndex
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const x = useTransform(scrollYProgress, [0, 1], [distanceFromCenter * 50, 0])
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const scale = useTransform(scrollYProgress, [0, 1], [0.5, 1])
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const y = useTransform(scrollYProgress, [0, 1], [Math.abs(distanceFromCenter) * 40, 0])
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const opacity = useTransform(scrollYProgress, [0, 0.8], [0, 1])

        return (
          <motion.div
            key={tech}
            title={tech}
            className="inline-flex flex-col items-center justify-center p-2 md:p-4 hover:scale-110 transition-transform cursor-default group"
            style={{ x, scale, y, opacity, transformOrigin: "center", willChange: "transform, opacity" }}
          >
            <i className={cn(iconClass, "text-4xl md:text-5xl text-[var(--color-text-muted)] group-hover:text-[var(--color-text-main)] transition-colors duration-300")} />
            <span className="font-sans text-[10px] mt-2 opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-4 whitespace-nowrap text-[var(--color-text-main)]">
              {tech}
            </span>
          </motion.div>
        )
      })}
    </div>
  )
}

export default function TechStack() {
  const { t } = useLanguage()
  const sectionRef = useRef<HTMLElement>(null)
  const techList = data.tech_stack

  return (
    <section
      id="tech"
      ref={sectionRef}
      className="md:sticky md:top-0 md:h-screen md:overflow-hidden relative min-h-screen w-full z-30 flex flex-col justify-center bg-[var(--color-canvas)] shadow-[0_-30px_60px_rgba(0,0,0,0.5)] py-20 md:py-0"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 w-full flex flex-col items-center gap-8 lg:gap-10">

        <div className="text-center">
          <p className="font-display flex flex-wrap items-center justify-center gap-3 text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight text-[var(--color-text-main)]">
            <Bracket className="h-8 sm:h-12 text-[var(--color-text-muted)] opacity-50" />
            <span>{t('tech.title')}</span>
            <Bracket className="h-8 sm:h-12 scale-x-[-1] text-[var(--color-text-muted)] opacity-50" />
          </p>
        </div>

        {/* Render static grid on mobile, animated on desktop */}
        {IS_MOBILE
          ? <MobileTechGrid techList={techList} />
          : <DesktopTechGrid techList={techList} sectionRef={sectionRef} />
        }

        {/* Domain Categorization */}
        {data.tech_categories && (
          <div className="w-full max-w-4xl border-t border-[var(--color-border-subtle)] divide-y divide-[var(--color-border-subtle)] mt-4">
            {data.tech_categories.map((cat, idx) => (
              <div
                key={idx}
                className="py-3.5 sm:py-4 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1.5 sm:gap-6"
              >
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-xs text-[var(--color-primary)] font-bold">
                    0{idx + 1}
                  </span>
                  <h4 className="font-display font-bold text-sm sm:text-base text-[var(--color-text-main)] tracking-tight">
                    {cat.category}
                  </h4>
                </div>
                <p className="font-mono text-[11px] sm:text-xs text-[var(--color-text-muted)] tracking-wide sm:text-right">
                  {cat.skills.join('  ·  ')}
                </p>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  )
}
