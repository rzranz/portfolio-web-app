import { useState } from 'react'
import { motion, type Variants } from "framer-motion"
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
  'Docker': 'devicon-docker-plain',
  'Go-Lang': 'devicon-go-original-wordmark',
  'PostgreSQL': 'devicon-postgresql-plain',
  'MySQL': 'devicon-mysql-original',
  'SQLite': 'devicon-sqlite-plain',
  'Unity': 'devicon-unity-plain',
  'Three.js': 'devicon-threejs-original',
  'IoT / Arduino': 'devicon-arduino-plain',
  'Arduino (IoT)': 'devicon-arduino-plain',
  'IoT': 'devicon-arduino-plain',
  'Arduino': 'devicon-arduino-plain',
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
  activeTech: string | null
  onSelect: (tech: string) => void
}

const gridContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0.05,
    },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: "easeOut",
    },
  },
}

function TechItem({
  tech,
  activeTech,
  onSelect
}: TechItemProps) {
  const iconClass = techIcons[tech] || 'devicon-devicon-plain'
  const isActive = activeTech === tech

  return (
    <motion.button
      type="button"
      title={tech}
      onClick={() => onSelect(tech)}
      variants={itemVariants}
      whileHover={{ y: -3, scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 450, damping: 25 }}
      className="group relative inline-flex flex-col items-center justify-center p-2.5 sm:p-3.5 md:p-4 pb-3.5 sm:pb-4 cursor-pointer select-none touch-manipulation bg-transparent border-0 outline-none"
    >
      <i className={cn(
        iconClass,
        "text-3xl sm:text-4xl md:text-5xl transition-colors duration-200",
        isActive 
          ? "text-[var(--color-primary)] drop-shadow-[0_0_16px_rgba(168,85,247,0.7)]" 
          : "text-[var(--color-text-muted)] group-hover:text-[var(--color-text-main)] group-hover:drop-shadow-[0_0_12px_rgba(168,85,247,0.4)]"
      )} />

      <span className={cn(
        "font-mono text-[9px] sm:text-[10px] mt-2 transition-colors duration-200 whitespace-nowrap select-none",
        isActive
          ? "opacity-100 text-[var(--color-primary)] font-bold drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]"
          : "opacity-75 group-hover:opacity-100 text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)]"
      )}>
        {tech}
      </span>

      {/* Zero CLS Active Indicator Dot */}
      <span
        aria-hidden="true"
        className={cn(
          "absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] shadow-[0_0_8px_var(--color-primary)] transition-all duration-200",
          isActive ? "opacity-100 scale-100" : "opacity-0 scale-50 pointer-events-none"
        )}
      />
    </motion.button>
  )
}

function ResponsiveTechGrid({ techList }: { techList: string[] }) {
  const [activeTech, setActiveTech] = useState<string | null>(null)

  return (
    <motion.div
      variants={gridContainerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      className="flex flex-wrap items-center justify-center max-w-sm sm:max-w-3xl md:max-w-5xl mx-auto gap-3 sm:gap-5 md:gap-7 relative px-2"
    >
      {techList.map((tech) => (
        <TechItem
          key={tech}
          tech={tech}
          activeTech={activeTech}
          onSelect={(t) => setActiveTech((prev) => prev === t ? null : t)}
        />
      ))}
    </motion.div>
  )
}

export default function TechStack() {
  const { t } = useLanguage()
  const techList = data.tech_stack

  return (
    <section
      id="tech"
      className="relative w-full z-30 flex flex-col justify-center bg-[var(--color-canvas)] shadow-[0_-30px_60px_rgba(0,0,0,0.5)] py-20 sm:py-24 md:py-28"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 w-full flex flex-col items-center gap-8 lg:gap-10">

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="text-center"
        >
          <p className="font-display flex flex-wrap items-center justify-center gap-3 text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight text-[var(--color-text-main)]">
            <Bracket className="h-8 sm:h-12 text-[var(--color-text-muted)] opacity-50" />
            <span>{t('tech.title')}</span>
            <Bracket className="h-8 sm:h-12 scale-x-[-1] text-[var(--color-text-muted)] opacity-50" />
          </p>
        </motion.div>

        {/* Stable, High-Performance Interactive Tech Grid */}
        <ResponsiveTechGrid techList={techList} />

        {/* Domain Categorization with Staggered Entry & Micro-Interactions */}
        {data.tech_categories && (
          <div className="w-full max-w-4xl border-t border-[var(--color-border-subtle)] divide-y divide-[var(--color-border-subtle)] mt-4">
            {data.tech_categories.map((cat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.35, delay: idx * 0.06, ease: "easeOut" }}
                className="group py-4 px-4 -mx-4 rounded-xl hover:bg-[var(--color-surface)]/60 border-l-2 border-transparent hover:border-[var(--color-primary)] flex flex-col sm:flex-row sm:items-baseline justify-between gap-1.5 sm:gap-6 transition-all duration-200 cursor-default select-none"
              >
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-xs text-[var(--color-primary)] font-bold group-hover:text-[var(--color-accent)] transition-colors duration-200 inline-block">
                    0{idx + 1}
                  </span>
                  <h4 className="font-display font-bold text-sm sm:text-base text-[var(--color-text-main)] group-hover:text-[var(--color-primary)] tracking-tight transition-colors duration-200">
                    {cat.category}
                  </h4>
                </div>
                <div className="font-mono text-[11px] sm:text-xs tracking-wide sm:text-right flex flex-wrap gap-x-2 gap-y-1 sm:justify-end">
                  {cat.skills.map((skill, sIdx) => (
                    <span 
                      key={sIdx}
                      className="text-[var(--color-text-muted)] group-hover:text-[var(--color-text-main)] hover:!text-[var(--color-primary)] transition-colors duration-150"
                    >
                      {skill}{sIdx < cat.skills.length - 1 && <span className="opacity-40 ml-2">·</span>}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </section>
  )
}
