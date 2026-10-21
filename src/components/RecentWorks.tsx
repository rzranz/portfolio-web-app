import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import data from '../data/cv.json'
import { useLanguage } from '../lib/i18n'
import { ArrowUpRight, ExternalLink, Layers } from 'lucide-react'
import { Github } from './icons/BrandIcons'
import ProjectModal from './ProjectModal'

export interface ProjectData {
  id: string
  title: string
  company: string
  company_url?: string
  period: string
  year?: string
  category: string
  featured?: boolean
  image: string
  gallery?: string[]
  live_url?: string
  github_url?: string
  description: string
  stack: string[]
  tags: string[]
  highlights?: string[]
  metrics?: string
}

export default function RecentWorks() {
  const { t } = useLanguage()
  const allProjects = data.experience as ProjectData[]
  
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [modalProject, setModalProject] = useState<ProjectData | null>(null)

  const categories = ['All', 'EdTech & AI', 'Fullstack', 'Backend & Cloud', 'AR & 3D']

  const filteredProjects = selectedCategory === 'All'
    ? allProjects
    : allProjects.filter((p) => p.category === selectedCategory)

  // Recalculate ScrollTrigger markers whenever category filter changes the document height
  useEffect(() => {
    const timer = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 150)
    return () => clearTimeout(timer)
  }, [selectedCategory])

  return (
    <section 
      id="works" 
      className="relative min-h-screen w-full z-40 bg-[var(--color-canvas)] shadow-[0_-30px_60px_rgba(0,0,0,0.5)]"
    >
      {/* Sticky Editorial Header — hangs motionless at top like Career Journey while cards scroll beneath */}
      <div className="sticky top-0 z-30 w-full bg-[var(--color-canvas)] border-b border-[var(--color-border-subtle)] shadow-md">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:pl-12 lg:pr-28 w-full pt-20 md:pt-24 pb-4">
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-4">
            <div>
              <span className="font-mono text-xs font-bold tracking-[0.2em] text-[var(--color-text-muted)] uppercase mb-1.5 md:mb-2 block">
                {t('works.kicker')}
              </span>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-tight text-[var(--color-text-main)] leading-none">
                {t('works.title')}
              </h2>
            </div>

            {/* Right side: Filter categories and project count badge */}
            <div className="flex items-center justify-between md:justify-end gap-3 sm:gap-6 w-full md:w-auto">
              <div className="flex items-center gap-3 sm:gap-4 font-mono text-xs text-[var(--color-text-muted)] overflow-x-auto py-1 max-w-[calc(100%-90px)] sm:max-w-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`cursor-pointer transition-colors relative py-1 shrink-0 ${
                      selectedCategory === cat 
                        ? 'text-[var(--color-text-main)] font-bold' 
                        : 'hover:text-[var(--color-text-main)]'
                    }`}
                  >
                    <span>{cat}</span>
                    {selectedCategory === cat && (
                      <motion.div 
                        layoutId="works-cat-indicator" 
                        className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[var(--color-primary)]" 
                      />
                    )}
                  </button>
                ))}
              </div>

              <div className="font-mono text-xs font-bold text-[var(--color-primary)] tracking-wider shrink-0 flex items-center gap-2 border-l border-[var(--color-border-subtle)] pl-3 sm:pl-6">
                <span>{String(filteredProjects.length).padStart(2, '0')} PROJECTS</span>
              </div>
            </div>
          </header>
        </div>
      </div>

      {/* Grid Container — flows naturally with page scroll (no inside scroll container) */}
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:pl-12 lg:pr-28 w-full py-8 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((exp, i) => {
              const projectIndex = String(i + 1).padStart(2, '0')
              const yearDisplay = exp.year || exp.period

              return (
                <motion.article
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  key={exp.id}
                  onClick={() => setModalProject(exp)}
                  className="group relative flex flex-col justify-between rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)]/60 hover:bg-[var(--color-surface)] hover:border-[var(--color-primary)]/50 transition-all duration-300 p-5 sm:p-7 cursor-pointer shadow-sm hover:shadow-[0_12px_40px_var(--color-border-glow)]"
                >
                  <div>
                    {/* Project Preview Image */}
                    {exp.image && (
                      <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden mb-5 border border-[var(--color-border-subtle)]/70 bg-[var(--color-canvas)]">
                        <img
                          src={exp.image}
                          alt={exp.title}
                          loading="lazy"
                          className="w-full h-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-40 group-hover:opacity-20 transition-opacity" />
                        
                        {/* Floating Number & Year badges */}
                        <div className="absolute top-3 left-3 flex items-center gap-2">
                          <span className="font-mono text-[10px] font-bold text-white bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10 tracking-wider">
                            {projectIndex}
                          </span>
                          <span className="font-mono text-[10px] text-white/80 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10">
                            {yearDisplay}
                          </span>
                        </div>

                        {exp.live_url && (
                          <div className="absolute top-3 right-3 font-mono text-[10px] text-emerald-400 font-semibold uppercase tracking-wider flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md border border-emerald-500/30">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span>Live</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Category & Company */}
                    <div className="flex items-center gap-2 font-mono text-xs text-[var(--color-text-muted)] mb-2">
                      <span className="text-[var(--color-primary)] font-semibold">{exp.category}</span>
                      <span>·</span>
                      <span>{exp.company}</span>
                    </div>

                    {/* Title */}
                    <h3 className="font-display font-extrabold text-xl sm:text-2xl text-[var(--color-text-main)] tracking-tight leading-snug group-hover:text-[var(--color-primary)] transition-colors mb-3 flex items-start justify-between gap-3">
                      <span>{exp.title}</span>
                      <ArrowUpRight className="w-5 h-5 text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0 mt-0.5" />
                    </h3>

                    {/* Description */}
                    <p className="font-sans text-xs sm:text-sm text-[var(--color-text-muted)] leading-relaxed line-clamp-3 mb-5">
                      {exp.description}
                    </p>
                  </div>

                  <div>
                    {/* Tech stack pills */}
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {exp.stack.slice(0, 5).map((tech, idx) => (
                        <span
                          key={idx}
                          className="font-mono text-[10px] font-medium px-2 py-0.5 rounded border border-[var(--color-border-subtle)] bg-[var(--color-canvas)]/70 text-[var(--color-text-muted)]"
                        >
                          {tech}
                        </span>
                      ))}
                      {exp.stack.length > 5 && (
                        <span className="font-mono text-[10px] px-1.5 py-0.5 text-[var(--color-text-muted)]/70">
                          +{exp.stack.length - 5}
                        </span>
                      )}
                    </div>

                    {/* Action Footer */}
                    <div className="pt-3 border-t border-[var(--color-border-subtle)]/70 flex items-center justify-between text-xs font-mono">
                      <span className="text-[var(--color-primary)] font-semibold inline-flex items-center gap-1.5 group-hover:underline">
                        <Layers className="w-3.5 h-3.5" />
                        <span>Case Study</span>
                      </span>

                      <div className="flex items-center gap-3">
                        {exp.github_url && (
                          <a
                            href={exp.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] transition-colors p-1"
                            title="GitHub Repository"
                          >
                            <Github className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {exp.live_url && (
                          <a
                            href={exp.live_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors inline-flex items-center gap-1"
                          >
                            <span>Live Demo</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.article>
              )
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Deep-Dive Project Modal */}
      <ProjectModal 
        project={modalProject} 
        onClose={() => setModalProject(null)} 
      />
    </section>
  )
}
