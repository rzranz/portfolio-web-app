import { useState } from 'react'
import { motion } from "framer-motion"
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
  activeTech: string | null
  onSelect: (tech: string) => void
}

function TechItem({
  tech,
  index,
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
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.03, 0.45), ease: "easeOut" }}
      className={cn(
        "group relative flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl",
        "w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 max-w-[112px] max-h-[112px]",
        "border transition-all duration-200 cursor-pointer select-none touch-manipulation",
        "hover:scale-105 active:scale-95 will-change-transform",
        isActive 
          ? "bg-[var(--color-surface)] border-[var(--color-primary)] shadow-[0_0_20px_var(--color-border-glow)]" 
          : "bg-[var(--color-surface)]/60 border-[var(--color-border-subtle)] hover:border-[var(--color-primary)]/50 hover:bg-[var(--color-surface)]"
      )}
    >
      <i className={cn(
        iconClass,
        "text-3xl sm:text-4xl md:text-5xl transition-colors duration-200",
        isActive 
          ? "text-[var(--color-primary)]" 
          : "text-[var(--color-text-muted)] group-hover:text-[var(--color-text-main)]"
      )} />

      <span className={cn(
        "font-mono text-[9px] sm:text-[10px] mt-2 transition-colors duration-200 truncate max-w-full px-1",
        isActive
          ? "text-[var(--color-primary)] font-bold opacity-100"
          : "text-[var(--color-text-muted)] group-hover:text-[var(--color-text-main)] opacity-80"
      )}>
        {tech}
      </span>
    </motion.button>
  )
}

function ResponsiveTechGrid({ techList }: { techList: string[] }) {
  const [activeTech, setActiveTech] = useState<string | null>(null)

  return (
    <div className="flex flex-wrap items-center justify-center max-w-sm sm:max-w-2xl md:max-w-4xl mx-auto gap-2.5 sm:gap-3.5 md:gap-4 relative px-2">
      {techList.map((tech, index) => (
        <TechItem
          key={tech}
          tech={tech}
          index={index}
          activeTech={activeTech}
          onSelect={(t) => setActiveTech((prev) => prev === t ? null : t)}
        />
      ))}
    </div>
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

        <div className="text-center">
          <p className="font-display flex flex-wrap items-center justify-center gap-3 text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight text-[var(--color-text-main)]">
            <Bracket className="h-8 sm:h-12 text-[var(--color-text-muted)] opacity-50" />
            <span>{t('tech.title')}</span>
            <Bracket className="h-8 sm:h-12 scale-x-[-1] text-[var(--color-text-muted)] opacity-50" />
          </p>
        </div>

        {/* Stable, High-Performance Interactive Tech Grid */}
        <ResponsiveTechGrid techList={techList} />

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
