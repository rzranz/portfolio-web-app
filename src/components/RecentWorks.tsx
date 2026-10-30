import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
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
  device?: 'desktop' | 'mobile'
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

      {/* Regular Clean Grid — flows naturally with page scroll without card containers */}
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:pl-12 lg:pr-28 w-full py-10 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 lg:gap-x-16 gap-y-12 md:gap-y-16">
          {filteredProjects.map((exp, i) => {
            const projectIndex = String(i + 1).padStart(2, '0')
            const yearDisplay = exp.year || exp.period

            return (
              <motion.article
                key={exp.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                onClick={() => setModalProject(exp)}
                className="group flex flex-col justify-between cursor-pointer border-b border-[var(--color-border-subtle)] pb-8 md:pb-10 transition-colors"
              >
                <div>
                  {/* Clean Image Preview Container (Optimized for desktop & mobile apps) */}
                  {exp.image && (
                    <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden mb-5 border border-[var(--color-border-subtle)]/60 bg-[var(--color-surface)]">
                      {exp.device === 'mobile' ? (
                        /* Mobile Showcase: 3 overlapping phone mockups with fanning effect on hover */
                        <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-b from-[var(--color-surface)] via-black/30 to-black/70 px-4 py-3 overflow-hidden select-none">
                          {/* Subtle grid pattern background */}
                          <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

                          {/* Left Screen (Peek - straight, upright layout) */}
                          {exp.gallery && exp.gallery[2] && (
                            <div className="absolute left-1/2 -translate-x-[112%] w-[33%] max-w-[130px] sm:max-w-[150px] aspect-[9/18.5] rounded-[16px] border border-neutral-700/60 shadow-xl overflow-hidden bg-neutral-950 translate-y-3 opacity-65 transition-all duration-500 ease-out group-hover:opacity-90 group-hover:-translate-x-[120%] group-hover:translate-y-2">
                              <img
                                src={exp.gallery[2]}
                                alt={`${exp.title} overview`}
                                loading="lazy"
                                className="w-full h-full object-cover object-top"
                              />
                            </div>
                          )}

                          {/* Right Screen (Peek - straight, upright layout) */}
                          {exp.gallery && exp.gallery[1] && (
                            <div className="absolute left-1/2 translate-x-[12%] w-[33%] max-w-[130px] sm:max-w-[150px] aspect-[9/18.5] rounded-[16px] border border-neutral-700/60 shadow-xl overflow-hidden bg-neutral-950 translate-y-3 opacity-65 transition-all duration-500 ease-out group-hover:opacity-90 group-hover:translate-x-[20%] group-hover:translate-y-2">
                              <img
                                src={exp.gallery[1]}
                                alt={`${exp.title} transactions`}
                                loading="lazy"
                                className="w-full h-full object-cover object-top"
                              />
                            </div>
                          )}

                          {/* Center Screen (Primary Active) */}
                          <div className="relative z-10 w-[38%] max-w-[150px] sm:max-w-[175px] aspect-[9/18.5] rounded-[20px] sm:rounded-[22px] border-[2.5px] border-neutral-600/90 shadow-[0_16px_40px_rgba(0,0,0,0.7)] overflow-hidden bg-neutral-950 transition-transform duration-500 ease-out group-hover:scale-[1.05] group-hover:-translate-y-1">
                            {/* Phone notch */}
                            <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-10 sm:w-12 h-2.5 bg-neutral-900 rounded-full z-20 flex items-center justify-center">
                              <div className="w-1.5 h-1.5 rounded-full bg-neutral-800" />
                            </div>
                            <img
                              src={exp.image}
                              alt={exp.title}
                              loading="lazy"
                              className="w-full h-full object-cover object-top"
                            />
                          </div>

                          {/* Mobile device indicator badge */}
                          <div className="absolute bottom-2.5 left-3 z-20 font-mono text-[9px] uppercase tracking-wider text-neutral-300 bg-black/70 backdrop-blur-sm px-2 py-0.5 rounded border border-neutral-700/50">
                            Mobile App
                          </div>
                        </div>
                      ) : (
                        <>
                          <img
                            src={exp.image}
                            alt={exp.title}
                            loading="lazy"
                            className="w-full h-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </>
                      )}
                      
                      {exp.live_url && (
                        <div className="absolute top-3 right-3 font-mono text-[10px] text-emerald-400 font-semibold uppercase tracking-wider flex items-center gap-1.5 bg-black/70 backdrop-blur-sm px-2.5 py-1 rounded border border-emerald-500/30 z-20">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span>Live</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Clean Metadata: Index, Year, Category & Company */}
                  <div className="flex items-center justify-between font-mono text-xs text-[var(--color-text-muted)] mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[var(--color-primary)]">{projectIndex}</span>
                      <span>/</span>
                      <span>{yearDisplay}</span>
                      <span>·</span>
                      <span className="text-[var(--color-text-main)] font-semibold">{exp.category}</span>
                    </div>
                    <span className="text-[11px] text-[var(--color-text-muted)] truncate max-w-[140px] sm:max-w-none">
                      {exp.company}
                    </span>
                  </div>

                  {/* Clean Typography Title */}
                  <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-[var(--color-text-main)] tracking-tight leading-snug group-hover:text-[var(--color-primary)] transition-colors mb-2.5 flex items-start justify-between gap-3">
                    <span>{exp.title}</span>
                    <ArrowUpRight className="w-5 h-5 text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)] transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 shrink-0 mt-1" />
                  </h3>

                  {/* Project Description */}
                  <p className="font-sans text-xs sm:text-sm text-[var(--color-text-muted)] leading-relaxed line-clamp-2 mb-4">
                    {exp.description}
                  </p>

                  {/* Inline Tech Stack Tags (No bulky card pills) */}
                  <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-[var(--color-text-muted)] mb-5">
                    {exp.stack.slice(0, 5).map((tech, idx) => (
                      <span 
                        key={idx}
                        className="after:content-['·'] last:after:content-none after:ml-2 text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] transition-colors"
                      >
                        {tech}
                      </span>
                    ))}
                    {exp.stack.length > 5 && (
                      <span className="text-[11px] text-[var(--color-primary)] font-semibold">
                        +{exp.stack.length - 5}
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer Actions: Case Study Modal & Live/Github links */}
                <div className="pt-3 border-t border-[var(--color-border-subtle)]/40 flex items-center justify-between text-xs font-mono">
                  <span className="text-[var(--color-primary)] font-semibold inline-flex items-center gap-1.5 group-hover:underline">
                    <Layers className="w-3.5 h-3.5" />
                    <span>Detail & Case Study</span>
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
              </motion.article>
            )
          })}
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
