import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import data from '../data/cv.json'
import { useLanguage } from '../lib/i18n'
import { ArrowUpRight, ExternalLink, Maximize2, X, ChevronRight, Layers, LayoutGrid, MonitorPlay, ArrowDown } from 'lucide-react'
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
  
  // State for active project on the swap-in stage
  const [activeProjectId, setActiveProjectId] = useState<string>(allProjects[0]?.id || 'ic-gamez')
  const [selectedGalleryImg, setSelectedGalleryImg] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [viewMode, setViewMode] = useState<'showcase' | 'grid'>('showcase')
  const [lightboxImage, setLightboxImage] = useState<{ src: string; title: string } | null>(null)
  const [modalProject, setModalProject] = useState<ProjectData | null>(null)
  const [gridAtBottom, setGridAtBottom] = useState(false)

  const handleGridScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
    setGridAtBottom(scrollTop + clientHeight >= scrollHeight - 30)
  }

  // Debounced ScrollTrigger refresh — 250ms prevents rapid-fire calls
  const refreshTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  useEffect(() => {
    if (refreshTimer.current) clearTimeout(refreshTimer.current)
    refreshTimer.current = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 250)
    return () => {
      if (refreshTimer.current) clearTimeout(refreshTimer.current)
    }
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
      className="md:sticky md:top-0 md:h-screen md:overflow-hidden relative min-h-screen w-full z-40 bg-[var(--color-canvas)] shadow-[0_-30px_60px_rgba(0,0,0,0.5)] flex flex-col justify-center py-20 md:py-0"
    >
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:pl-12 lg:pr-28 w-full flex flex-col justify-center">
        
        {/* Minimalist Section Header */}
        <header className="pb-3 md:pb-4 border-b border-[var(--color-border-subtle)] flex flex-col md:flex-row md:items-end justify-between gap-3">
          <div>
            <span className="font-mono text-xs font-bold tracking-[0.2em] text-[var(--color-text-muted)] uppercase mb-2 block">
              {t('works.kicker')}
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-tight text-[var(--color-text-main)] leading-none">
              {t('works.title')}
            </h2>
          </div>

          {/* Controls: Category Filter & View Mode Switcher (Pure Typography, Zero Rounded Pills) */}
          <div className="flex flex-wrap items-center justify-between sm:justify-end gap-3 sm:gap-6 w-full md:w-auto">
            
            {/* Category Filters: Horizontally scrollable on mobile */}
            <div className="flex items-center gap-3 font-mono text-xs text-[var(--color-text-muted)] overflow-x-auto py-1 max-w-[220px] sm:max-w-none">
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
          <div className="pt-3 lg:pt-4 flex flex-col lg:grid lg:grid-cols-12 gap-3 lg:gap-6 items-start">
            
            {/* Mobile: Compact horizontal pill tabs for project selection */}
            <div className="w-full flex lg:hidden gap-2 overflow-x-auto pb-2 -mx-0 scrollbar-none">
              {filteredProjects.map((proj, idx) => {
                const isActive = proj.id === activeProjectId
                return (
                  <button
                    key={proj.id}
                    onClick={() => handleSelectProject(proj)}
                    className={`flex-shrink-0 font-mono text-[11px] font-bold px-3 py-1.5 rounded border transition-colors cursor-pointer ${
                      isActive
                        ? 'border-[var(--color-primary)] text-[var(--color-primary)] bg-[var(--color-primary)]/10'
                        : 'border-[var(--color-border-subtle)] text-[var(--color-text-muted)] bg-[var(--color-surface)]'
                    }`}
                  >
                    <span className="text-[var(--color-primary)] mr-1">{String(idx+1).padStart(2,'0')}</span>
                    {proj.title.length > 16 ? proj.title.slice(0, 16) + '…' : proj.title}
                  </button>
                )
              })}
            </div>

            {/* Left Column: Dynamic Animated Swap-In Stage */}
            <div className="lg:col-span-7 space-y-4 w-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeProject.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="p-2 sm:p-2.5 rounded-3xl sm:rounded-[2rem] bg-[var(--color-surface)]/70 border border-[var(--color-border-subtle)] shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-sm"
                >
                  <div className="rounded-[calc(2rem-0.625rem)] bg-[var(--color-surface)] overflow-hidden border border-white/5">
                  
                  {/* Window Chrome Toolbar */}
                  <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-[var(--color-border-subtle)] bg-[var(--color-canvas)]/60">
                    {/* Traffic light window controls */}
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                    </div>

                    {/* Window Title / URL */}
                    <div className="font-mono text-[11px] text-[var(--color-text-muted)] truncate max-w-[160px] sm:max-w-xs px-2.5 py-0.5 rounded border border-[var(--color-border-subtle)]/70 bg-[var(--color-surface)]">
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
                          <Github className="w-3.5 h-3.5" />
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
                  <div className="relative group bg-black/40 overflow-hidden h-[180px] sm:h-[210px] lg:h-[220px] xl:h-[260px] flex items-center justify-center">
                    <img
                      src={currentImage}
                      alt={activeProject.title}
                      loading="lazy"
                      onLoad={() => ScrollTrigger.refresh()}
                      className="w-full h-full object-cover object-top"
                    />
                    
                    {/* Subtle Overlay Badge on Image */}
                    <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between pointer-events-none">
                      <div className="font-mono text-[10px] text-white/90 bg-black/70 px-2.5 py-1 rounded border border-white/10 uppercase tracking-wider">
                        {activeProject.category} · {activeProject.year || activeProject.period}
                      </div>

                      {activeProject.metrics && (
                        <div className="font-mono text-[10px] text-emerald-400 bg-black/70 px-2.5 py-1 rounded border border-emerald-500/20">
                          {activeProject.metrics}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Multi-view Gallery Thumbnails */}
                  {activeProject.gallery && activeProject.gallery.length > 1 && (
                    <div className="px-4 py-2 border-t border-[var(--color-border-subtle)] bg-[var(--color-canvas)]/40 flex items-center gap-2 overflow-x-auto">
                      <span className="font-mono text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider mr-1">Views:</span>
                      {activeProject.gallery.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedGalleryImg(img)}
                          className={`font-mono text-[10px] px-2.5 py-0.5 rounded border transition-all cursor-pointer ${
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
                  <div className="p-3 sm:p-4 space-y-2.5">
                    <div>
                      <div className="flex items-center gap-2 font-mono text-[11px] text-[var(--color-text-muted)] uppercase tracking-wider mb-0.5">
                        <span>{activeProject.company}</span>
                        <span>·</span>
                        <span>{activeProject.period}</span>
                      </div>
                      <h3 className="font-display font-black text-lg sm:text-xl lg:text-2xl text-[var(--color-text-main)] tracking-tight">
                        {activeProject.title}
                      </h3>
                    </div>

                    {/* Narrative Description */}
                    <p className="font-sans text-xs sm:text-sm text-[var(--color-text-muted)] leading-relaxed line-clamp-2">
                      {activeProject.description}
                    </p>

                    {/* Tech Stack Tags */}
                    <div className="pt-1.5 border-t border-[var(--color-border-subtle)]/70">
                      <div className="flex flex-wrap gap-1.5">
                        {activeProject.stack.slice(0, 5).map((item, idx) => (
                          <span
                            key={idx}
                            className="font-mono text-[10px] sm:text-[11px] font-medium px-2 py-0.5 rounded border border-[var(--color-border-subtle)] bg-[var(--color-surface)] text-[var(--color-text-muted)]"
                          >
                            {item}
                          </span>
                        ))}
                        {activeProject.stack.length > 5 && (
                          <span className="font-mono text-[10px] px-1.5 py-0.5 text-[var(--color-text-muted)]">
                            +{activeProject.stack.length - 5}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Interactive Action CTAs — Button-in-Button architecture */}
                    <div className="pt-2.5 border-t border-[var(--color-border-subtle)]/70 flex flex-wrap items-center justify-between gap-2.5">
                      <div className="flex flex-wrap items-center gap-2.5">
                        {activeProject.live_url && (
                          <a
                            href={activeProject.live_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group inline-flex items-center gap-2.5 pl-4 pr-1.5 py-1.5 rounded-full bg-[var(--color-primary)] text-white font-medium text-xs hover:brightness-110 shadow-[0_0_20px_var(--color-border-glow)] transition-all cursor-pointer select-none"
                          >
                            <span>{t('works.livedemo')}</span>
                            <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                              <ArrowUpRight className="w-3 h-3" />
                            </span>
                          </a>
                        )}

                        <button
                          onClick={() => setModalProject(activeProject)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-[var(--color-border-subtle)] text-[var(--color-text-main)] hover:bg-[var(--color-surface-hover)] hover:border-[var(--color-primary)]/50 font-mono text-xs font-semibold transition-all cursor-pointer"
                        >
                          <Layers className="w-3 h-3 text-[var(--color-primary)]" />
                          <span>Case Study Breakdown</span>
                        </button>
                      </div>

                      {activeProject.github_url && (
                        <a
                          href={activeProject.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[var(--color-border-subtle)] text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] font-mono text-xs transition-colors"
                        >
                          <Github className="w-3 h-3" />
                          <span>Source</span>
                        </a>
                      )}
                    </div>

                  </div>
                </div>
              </motion.div>
              </AnimatePresence>
            </div>

            {/* Right Column (DESKTOP ONLY): Interactive Project Directory */}
            <div className="hidden lg:block lg:col-span-5 space-y-3 lg:pl-2">
              
                {/* Directory Header */}
                <div className="border-b border-[var(--color-border-subtle)] pb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Layers className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                    <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-text-main)]">
                      Project Directory
                    </span>
                  </div>
                  <span className="font-mono text-[11px] text-[var(--color-text-muted)]">
                    0{filteredProjects.length} Projects
                  </span>
                </div>

                {/* Vertical Interactive List */}
                <div 
                  data-lenis-prevent="true"
                  className="space-y-1.5 max-h-[380px] xl:max-h-[440px] overflow-y-auto pr-1"
                >
                  {filteredProjects.map((proj, idx) => {
                    const isActive = proj.id === activeProjectId
                    const displayIndex = String(idx + 1).padStart(2, '0')

                    return (
                      <div
                        key={proj.id}
                        onClick={() => handleSelectProject(proj)}
                        className={`group relative p-3 rounded-xl border transition-all duration-200 cursor-pointer ${
                          isActive
                            ? 'border-[var(--color-primary)] bg-[var(--color-surface)] shadow-md translate-x-1'
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
                              <h4 className={`font-display font-bold text-base tracking-tight leading-snug transition-colors ${
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
          <div className="relative w-full pt-2">
            {/* Scrollable Container with dedicated styled scrollbar and Lenis scroll prevention */}
            <div 
              data-lenis-prevent="true"
              onScroll={handleGridScroll}
              className="custom-grid-scrollbar grid grid-cols-1 md:grid-cols-2 border-b border-[var(--color-border-subtle)] max-h-[60vh] xl:max-h-[64vh] overflow-y-auto pr-3 sm:pr-4"
            >
              {filteredProjects.map((exp, i) => {
                const isLeftCol = i % 2 === 0
                const projectIndex = String(i + 1).padStart(2, '0')
                const yearDisplay = exp.year || exp.period

                return (
                  <article
                    key={exp.id}
                    onClick={() => handleSelectProject(exp)}
                    className={`group relative flex flex-col justify-between py-6 md:py-8 border-b border-[var(--color-border-subtle)] last:border-b-0 cursor-pointer transition-colors duration-300 hover:bg-[var(--color-surface)]/40 ${
                      isLeftCol 
                        ? 'md:border-r md:border-[var(--color-border-subtle)] md:pr-8 lg:pr-10 md:pl-0' 
                        : 'md:pl-8 lg:pl-10 md:pr-0'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
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

                      <h3 className="font-display font-extrabold text-xl sm:text-2xl text-[var(--color-text-main)] tracking-tight leading-snug transition-transform duration-300 ease-out group-hover:translate-x-1.5">
                        {exp.title}
                      </h3>

                      <p className="font-mono text-xs text-[var(--color-text-muted)] transition-transform duration-300 ease-out group-hover:translate-x-1.5">
                        {exp.company}
                      </p>

                      <p className="font-sans text-xs sm:text-sm text-[var(--color-text-muted)] leading-relaxed line-clamp-2 max-w-[50ch] transition-transform duration-300 ease-out group-hover:translate-x-1.5">
                        {exp.description}
                      </p>

                      <div className="flex flex-wrap gap-1.5 pt-1 transition-transform duration-300 ease-out group-hover:translate-x-1.5">
                        {exp.stack.slice(0, 5).map((item, idx) => (
                          <span
                            key={idx}
                            className="font-mono text-[10px] font-medium px-2 py-0.5 rounded border border-[var(--color-border-subtle)] bg-[var(--color-surface)] text-[var(--color-text-muted)] group-hover:border-[var(--color-primary)]/40 group-hover:text-[var(--color-text-main)] transition-colors"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-5 pt-3 flex items-center justify-between border-t border-[var(--color-border-subtle)]/60">
                      <div className="flex items-center gap-4">
                        <span className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)] inline-flex items-center gap-1.5 group-hover:gap-2.5 transition-all duration-300">
                          <span>Showcase</span>
                          <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </span>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setModalProject(exp);
                          }}
                          className="font-mono text-xs text-[var(--color-primary)] hover:underline inline-flex items-center gap-1 cursor-pointer font-semibold"
                        >
                          <Layers className="w-3.5 h-3.5" />
                          <span>Case Study</span>
                        </button>
                      </div>

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

            {/* Bottom Gradient Fade with interactive scroll hint so user knows it's scrollable */}
            <div 
              className={`pointer-events-none absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[var(--color-canvas)] to-transparent flex items-end justify-center pb-1 transition-opacity duration-300 ${
                gridAtBottom ? 'opacity-0' : 'opacity-100'
              }`}
            >
              <div className="pointer-events-auto font-mono text-[10px] font-bold tracking-wider uppercase text-[var(--color-text-muted)] bg-[var(--color-surface)]/95 border border-[var(--color-border-subtle)] hover:border-[var(--color-primary)]/50 px-3.5 py-1 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.4)] flex items-center gap-2 backdrop-blur-md">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] animate-pulse" />
                <span>Scroll to explore ({filteredProjects.length} projects)</span>
                <ArrowDown className="w-3 h-3 text-[var(--color-primary)] animate-bounce" />
              </div>
            </div>
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

      {/* Deep-Dive Project Modal */}
      <ProjectModal 
        project={modalProject} 
        onClose={() => setModalProject(null)} 
      />

    </section>
  )
}
