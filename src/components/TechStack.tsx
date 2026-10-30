import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, MotionValue } from "framer-motion"
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

interface TechItemProps {
  tech: string
  index: number
  centerIndex: number
  isMobile: boolean
  scrollYProgress: MotionValue<number>
  activeTech: string | null
  onSelect: (tech: string) => void
}

function TechItem({
  tech,
  index,
  centerIndex,
  isMobile,
  scrollYProgress,
  activeTech,
  onSelect
}: TechItemProps) {
  const iconClass = techIcons[tech] || 'devicon-devicon-plain'
  const distanceFromCenter = index - centerIndex

  // Calibrated transforms: tighter amplitude on mobile to stay within viewport bounds
  const xMultiplier = isMobile ? 12 : 50
  const yMultiplier = isMobile ? 10 : 35
  const startScale = isMobile ? 0.75 : 0.55

  const x = useTransform(scrollYProgress, [0, 1], [distanceFromCenter * xMultiplier, 0])
  const y = useTransform(scrollYProgress, [0, 1], [Math.abs(distanceFromCenter) * yMultiplier, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [startScale, 1])
  const opacity = useTransform(scrollYProgress, [0, 0.75], [0.2, 1])

  const isActive = activeTech === tech

  return (
    <motion.div
      title={tech}
      onClick={() => onSelect(tech)}
      className="inline-flex flex-col items-center justify-center p-2.5 sm:p-3 md:p-4 cursor-pointer group relative touch-manipulation select-none"
      style={{ x, scale, y, opacity, transformOrigin: "center", willChange: "transform, opacity" }}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: "spring", stiffness: 350, damping: 22 }}
    >
      <i className={cn(
        iconClass,
        "text-3xl sm:text-4xl md:text-5xl transition-colors duration-300",
        isActive 
          ? "text-[var(--color-primary)]" 
          : "text-[var(--color-text-muted)] group-hover:text-[var(--color-text-main)]"
      )} />

      <span className={cn(
        "font-mono text-[9px] sm:text-[10px] mt-1.5 transition-all duration-200 whitespace-nowrap",
        isActive
          ? "opacity-100 text-[var(--color-primary)] font-bold"
          : "opacity-80 sm:opacity-0 sm:group-hover:opacity-100 text-[var(--color-text-main)]"
      )}>
        {tech}
      </span>
    </motion.div>
  )
}

function ResponsiveTechGrid({
  techList,
  sectionRef
}: {
  techList: string[]
  sectionRef: React.RefObject<HTMLElement | null>
}) {
  const [isMobile, setIsMobile] = useState(false)
  const [activeTech, setActiveTech] = useState<string | null>(null)
  const centerIndex = Math.floor(techList.length / 2)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile, { passive: true })
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "center center"]
  })

  return (
    <div className="flex flex-wrap items-center justify-center max-w-sm sm:max-w-xl md:max-w-4xl mx-auto gap-2.5 sm:gap-4 relative px-2">
      {techList.map((tech, index) => (
        <TechItem
          key={tech}
          tech={tech}
          index={index}
          centerIndex={centerIndex}
          isMobile={isMobile}
          scrollYProgress={scrollYProgress}
          activeTech={activeTech}
          onSelect={(t) => setActiveTech((prev) => prev === t ? null : t)}
        />
      ))}
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

        {/* Unified Responsive Animated Grid for both Mobile and Desktop */}
        <ResponsiveTechGrid techList={techList} sectionRef={sectionRef} />

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
