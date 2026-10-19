import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import data from '../data/cv.json'
import { useLanguage } from '../lib/i18n'
import { ArrowUpRight, ExternalLink, Maximize2, X, ChevronRight, Layers, LayoutGrid, MonitorPlay } from 'lucide-react'
import { GithubLogo } from '@phosphor-icons/react'

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
  
  // State for active project on the swap-in stage
  const [activeProjectId, setActiveProjectId] = useState<string>(allProjects[0]?.id || 'ic-gamez')
  const [selectedGalleryImg, setSelectedGalleryImg] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [viewMode, setViewMode] = useState<'showcase' | 'grid'>('showcase')
  const [lightboxImage, setLightboxImage] = useState<{ src: string; title: string } | null>(null)

  // Synchronize ScrollTrigger whenever project, filter or layout shifts
  useEffect(() => {
    const timer = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 120)
    return () => clearTimeout(timer)
  }, [viewMode, selectedCategory, activeProjectId])

  const activeProject = allProjects.find((p) => p.id === activeProjectId) || allProjects[0]

  const categories = ['All', 'EdTech & AI', 'Fullstack', 'Backend & Cloud', 'AR & 3D']

  const filteredProjects = selectedCategory === 'All'
    ? allProjects
    : allProjects.filter((p) => p.category === selectedCategory)

  // Current display image on the showcase stage (active gallery item or main image)
  const currentImage = selectedGalleryImg || activeProject.image

  const handleSelectProject = (proj: ProjectData) => {
    setActiveProjectId(proj.id)
    setSelectedGalleryImg(null) // reset to primary image
    if (viewMode === 'grid') {
      setViewMode('showcase')
    }
  }

  return (
    <section 
      id="works" 
      className="relative z-30 min-h-screen w-full bg-[var(--color-canvas)] shadow-[0_-25px_50px_rgba(0,0,0,0.35)] border-t border-[var(--color-border-subtle)] pb-24 lg:pb-32"
    >
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:pl-12 lg:pr-28 w-full">
        
        {/* Minimalist Section Header (Un-stick to prevent clash with pinned timeline) */}
        <header className="pt-20 md:pt-24 pb-6 md:pb-8 border-b border-[var(--color-border-subtle)] flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="font-mono text-xs font-bold tracking-[0.2em] text-[var(--color-text-muted)] uppercase mb-2 block">
              {t('works.kicker')}
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-tight text-[var(--color-text-main)] leading-[1.05]">
              {t('works.title')}
            </h2>
          </div>

          {/* Controls: Category Filter & View Mode Switcher (Pure Typography, Zero Rounded Pills) */}
          <div className="flex flex-wrap items-center gap-6">
            
            {/* Category Filters */}
            <div className="hidden sm:flex items-center gap-3 font-mono text-xs text-[var(--color-text-muted)]">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`cursor-pointer transition-colors relative py-1 ${
                    selectedCategory === cat 
                      ? 'text-[var(--color-text-main)] font-bold' 
                      : 'hover:text-[var(--color-text-main)]'
                  }`}
                >
                  <span>{cat}</span>
                  {selectedCategory === cat && (
                    <motion.div 
                      layoutId="cat-indicator" 
                      className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[var(--color-primary)]" 
                    />
                  )}
                </button>
              ))}
            </div>

            {/* View Mode Toggle: Showcase Stage vs Grid View */}
            <div className="flex items-center gap-4 font-mono text-xs border-l border-[var(--color-border-subtle)] pl-4 sm:pl-6 text-[var(--color-text-muted)]">
              <button
                onClick={() => setViewMode('showcase')}
                className={`flex items-center gap-1.5 cursor-pointer py-1 transition-colors ${
                  viewMode === 'showcase' 
                    ? 'text-[var(--color-primary)] font-bold' 
                    : 'hover:text-[var(--color-text-main)]'
                }`}
                title="Interactive Showcase Stage"
              >
                <MonitorPlay className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Showcase</span>
              </button>
              <span>·</span>
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1.5 cursor-pointer py-1 transition-colors ${
                  viewMode === 'grid' 
                    ? 'text-[var(--color-primary)] font-bold' 
                    : 'hover:text-[var(--color-text-main)]'
                }`}
                title="Full Grid View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Grid</span>
              </button>
            </div>

          </div>
        </header>

        {/* ========================================================
            MODE A: Interactive Swap-In Showcase Stage (Skiper UI style)
            ======================================================== */}
        {viewMode === 'showcase' && (
          <div className="pt-8 lg:pt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left Column (lg:col-span-7): Dynamic Animated Swap-In Stage */}
            <div className="lg:col-span-7 space-y-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeProject.id}
                  initial={{ opacity: 0, x: -24, scale: 0.98 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 24, scale: 0.98 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="rounded-2xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] shadow-2xl overflow-hidden"
                >
                  
                  {/* Window Chrome Toolbar */}
                  <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-[var(--color-border-subtle)] bg-[var(--color-canvas)]/60 backdrop-blur-md">
                    {/* Traffic light window controls */}
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                    </div>

                    {/* Window Title / URL */}
                    <div className="font-mono text-[11px] text-[var(--color-text-muted)] truncate max-w-[200px] sm:max-w-xs px-2.5 py-0.5 rounded border border-[var(--color-border-subtle)]/70 bg-[var(--color-surface)]">
                      {activeProject.live_url || activeProject.github_url || `rann://projects/${activeProject.id}`}
                    </div>

                    {/* External Action Links */}
                    <div className="flex items-center gap-3">
                      {activeProject.live_url && (
                        <a
                          href={activeProject.live_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-[11px] text-[var(--color-primary)] hover:underline inline-flex items-center gap-1 font-semibold"
                          title="Open Live App"
                        >
                          <span>Live</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      {activeProject.github_url && (
                        <a
                          href={activeProject.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] transition-colors"
                          title="View Source on GitHub"
                        >
                          <GithubLogo className="w-3.5 h-3.5" />
                        </a>
                      )}
                      <button
                        onClick={() => setLightboxImage({ src: currentImage, title: activeProject.title })}
                        className="text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] transition-colors cursor-pointer"
                        title="Enlarge Screenshot"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Main High-Impact Screenshot Preview */}
                  <div className="relative group bg-black/40 overflow-hidden aspect-[16/10] max-h-[460px] flex items-center justify-center">
                    <img
                      src={currentImage}
                      alt={activeProject.title}
                      onLoad={() => ScrollTrigger.refresh()}
                      className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                    />
                    
                    {/* Subtle Overlay Badge on Image */}
                    <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between pointer-events-none">
                      <div className="font-mono text-[10px] text-white/90 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded border border-white/10 uppercase tracking-wider">
                        {activeProject.category} · {activeProject.year || activeProject.period}
                      </div>

                      {activeProject.metrics && (
                        <div className="font-mono text-[10px] text-emerald-400 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded border border-emerald-500/20">
                          {activeProject.metrics}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Multi-view Gallery Thumbnails (if available, e.g. PDAM Tegal) */}
                  {activeProject.gallery && activeProject.gallery.length > 1 && (
                    <div className="px-5 py-2.5 border-t border-[var(--color-border-subtle)] bg-[var(--color-canvas)]/40 flex items-center gap-2 overflow-x-auto">
                      <span className="font-mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider mr-1">Views:</span>
                      {activeProject.gallery.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedGalleryImg(img)}
                          className={`font-mono text-[10px] px-2.5 py-1 rounded border transition-all cursor-pointer ${
                            currentImage === img
                              ? 'border-[var(--color-primary)] text-[var(--color-primary)] bg-[var(--color-primary)]/10 font-bold'
                              : 'border-[var(--color-border-subtle)] text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]'
                          }`}
                        >
                          View 0{idx + 1}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Technical Case Study & Details Body */}
                  <div className="p-6 sm:p-8 space-y-6">
                    <div>
                      <div className="flex items-center gap-2 font-mono text-xs text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
                        <span>{activeProject.company}</span>
                        <span>·</span>
                        <span>{activeProject.period}</span>
                      </div>
                      <h3 className="font-display font-black text-2xl sm:text-3xl text-[var(--color-text-main)] tracking-tight">
                        {activeProject.title}
                      </h3>
                    </div>

                    {/* Narrative Description */}
                    <p className="font-sans text-sm sm:text-base text-[var(--color-text-muted)] leading-relaxed">
                      {activeProject.description}
                    </p>

                    {/* Architectural Highlights */}
                    {activeProject.highlights && activeProject.highlights.length > 0 && (
                      <div className="space-y-2 pt-2 border-t border-[var(--color-border-subtle)]/70">
                        <span className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--color-text-main)] block">
                          Architectural Highlights
                        </span>
                        <ul className="space-y-1.5 pt-1">
                          {activeProject.highlights.map((h, i) => (
                            <li key={i} className="font-sans text-xs sm:text-sm text-[var(--color-text-muted)] flex items-start gap-2.5">
                              <span className="text-[var(--color-primary)] font-mono text-xs mt-0.5">›</span>
                              <span>{h}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Tech Stack Tags */}
                    <div className="pt-2 border-t border-[var(--color-border-subtle)]/70">
                      <div className="flex flex-wrap gap-2">
                        {activeProject.stack.map((item, idx) => (
                          <span
                            key={idx}
                            className="font-mono text-[11px] font-medium px-3 py-1 rounded border border-[var(--color-border-subtle)] bg-[var(--color-surface)] text-[var(--color-text-muted)]"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                  </div>

                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right Column (lg:col-span-5): Interactive Project Directory (Skiper UI Inspired) */}
            <div className="lg:col-span-5 space-y-6 lg:pl-2">
              
              {/* Directory Header */}
              <div className="border-b border-[var(--color-border-subtle)] pb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Layers className="w-4 h-4 text-[var(--color-primary)]" />
                  <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-text-main)]">
                    Project Directory
                  </span>
                </div>
                <span className="font-mono text-xs text-[var(--color-text-muted)]">
                  0{filteredProjects.length} Projects
                </span>
              </div>

              {/* Vertical Interactive List */}
              <div className="space-y-2 max-h-[750px] overflow-y-auto pr-1">
                {filteredProjects.map((proj, idx) => {
                  const isActive = proj.id === activeProjectId
                  const displayIndex = String(idx + 1).padStart(2, '0')

                  return (
                    <div
                      key={proj.id}
                      onClick={() => handleSelectProject(proj)}
                      className={`group relative p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                        isActive
                          ? 'border-[var(--color-primary)] bg-[var(--color-surface)] shadow-lg translate-x-1.5'
                          : 'border-[var(--color-border-subtle)]/60 hover:border-[var(--color-border-subtle)] hover:bg-[var(--color-surface)]/50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3.5">
                          <span className={`font-mono text-xs font-bold tracking-wider pt-0.5 ${
                            isActive ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-muted)]/70'
                          }`}>
                            {displayIndex}
                          </span>

                          <div className="space-y-1">
                            <h4 className={`font-display font-bold text-base sm:text-lg tracking-tight leading-snug transition-colors ${
                              isActive 
                                ? 'text-[var(--color-text-main)]' 
                                : 'text-[var(--color-text-muted)] group-hover:text-[var(--color-text-main)]'
                            }`}>
                              {proj.title}
                            </h4>

                            <div className="flex items-center gap-2 font-mono text-[11px] text-[var(--color-text-muted)]">
                              <span>{proj.company}</span>
                              <span>·</span>
                              <span>{proj.year || proj.period}</span>
                            </div>
                          </div>
                        </div>

                        {/* Right Indicator Arrow */}
                        <ChevronRight className={`w-4 h-4 mt-1 transition-all ${
                          isActive 
                            ? 'text-[var(--color-primary)] translate-x-0 opacity-100' 
                            : 'text-[var(--color-text-muted)] -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0'
                        }`} />
                      </div>
                    </div>
                  )
                })}
              </div>

            </div>

          </div>
        )}

        {/* ========================================================
            MODE B: Full 2-Column Minimalist Editorial Grid View
            ======================================================== */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 border-b border-[var(--color-border-subtle)] pt-6">
            {filteredProjects.map((exp, i) => {
              const isLeftCol = i % 2 === 0
              const projectIndex = String(i + 1).padStart(2, '0')
              const yearDisplay = exp.year || exp.period

              return (
                <article
                  key={exp.id}
                  onClick={() => handleSelectProject(exp)}
                  className={`group relative flex flex-col justify-between py-10 md:py-14 border-b border-[var(--color-border-subtle)] last:border-b-0 cursor-pointer transition-colors duration-300 hover:bg-[var(--color-surface)]/40 ${
                    isLeftCol 
                      ? 'md:border-r md:border-[var(--color-border-subtle)] md:pr-10 lg:pr-14 md:pl-0' 
                      : 'md:pl-10 lg:pl-14 md:pr-0'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="font-mono text-xs font-bold text-[var(--color-primary)] tracking-wider">
                          {projectIndex}
                        </span>
                        <span className="font-mono text-xs text-[var(--color-text-muted)]">
                          {yearDisplay}
                        </span>
                      </div>
                      
                      {exp.live_url && (
                        <span className="font-mono text-[10px] text-emerald-500 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Live Demo
                        </span>
                      )}
                    </div>

                    <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-[var(--color-text-main)] tracking-tight leading-snug transition-transform duration-300 ease-out group-hover:translate-x-2">
                      {exp.title}
                    </h3>

                    <p className="font-mono text-xs text-[var(--color-text-muted)] transition-transform duration-300 ease-out group-hover:translate-x-2">
                      {exp.company}
                    </p>

                    <p className="font-sans text-sm text-[var(--color-text-muted)] leading-relaxed line-clamp-3 max-w-[50ch] transition-transform duration-300 ease-out group-hover:translate-x-2">
                      {exp.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-2 transition-transform duration-300 ease-out group-hover:translate-x-2">
                      {exp.stack.map((item, idx) => (
                        <span
                          key={idx}
                          className="font-mono text-[11px] font-medium px-2.5 py-1 rounded border border-[var(--color-border-subtle)] bg-[var(--color-surface)] text-[var(--color-text-muted)] group-hover:border-[var(--color-primary)]/40 group-hover:text-[var(--color-text-main)] transition-colors"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 pt-4 flex items-center justify-between border-t border-[var(--color-border-subtle)]/60">
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)] inline-flex items-center gap-2 group-hover:gap-3 transition-all duration-300">
                      <span>Open in Showcase Stage</span>
                      <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>

                    {exp.live_url && (
                      <a
                        href={exp.live_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-[11px] font-mono text-[var(--color-text-muted)] hover:text-[var(--color-primary)] inline-flex items-center gap-1 transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Live Demo
                      </a>
                    )}
                  </div>
                </article>
              )
            })}
          </div>
        )}

      </div>

      {/* ========================================================
          Clean Screenshot Lightbox (No scroll trapping, no black screen bug)
          ======================================================== */}
      {lightboxImage && (
        <div 
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 cursor-zoom-out"
        >
          <div className="relative max-w-5xl max-h-[90vh] w-full flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <div className="w-full flex items-center justify-between pb-3 text-white">
              <span className="font-mono text-xs font-bold tracking-wider">{lightboxImage.title}</span>
              <button 
                onClick={() => setLightboxImage(null)} 
                className="font-mono text-xs uppercase flex items-center gap-1 hover:text-[var(--color-primary)] cursor-pointer"
              >
                <span>Close</span>
                <X className="w-4 h-4" />
              </button>
            </div>
            <img 
              src={lightboxImage.src} 
              alt={lightboxImage.title} 
              className="max-w-full max-h-[82vh] object-contain rounded-xl border border-white/10 shadow-2xl" 
            />
          </div>
        </div>
      )}

    </section>
  )
}
