import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ExternalLink, Layers } from 'lucide-react'
import { Github } from './icons/BrandIcons'
import { PhoneMockup } from './ui/PhoneMockup'

import { useLanguage } from '../lib/i18n'

export interface ProjectData {
  id: string
  title: string
  company: string
  period: string
  year?: string
  category: string
  featured?: boolean
  image?: string
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

interface ProjectModalProps {
  project: ProjectData | null
  onClose: () => void
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  const { t } = useLanguage()
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  useEffect(() => {
    if (project) {
      setSelectedImage(project.image || (project.gallery && project.gallery[0]) || null)
    }
  }, [project])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    const lenis = (window as unknown as { lenis?: { stop: () => void; start: () => void } }).lenis

    if (project) {
      if (lenis) lenis.stop()
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      if (lenis) lenis.start()
      document.body.style.overflow = 'unset'
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [project, onClose])

  if (!project) return null

  const isMobileScreenshot = (img: string | null) => {
    if (!img) return false
    return Boolean(
      project.device === 'mobile' ||
      img.includes('flowledger-home') ||
      img.includes('flowledger-transactions') ||
      img.includes('flowledger-cards') ||
      img.includes('cinemax') ||
      img.includes('-mobile') ||
      img.includes('mobile')
    )
  }

  const isCurrentMobile = isMobileScreenshot(selectedImage)

  return (
    <AnimatePresence>
      <div 
        data-lenis-prevent="true"
        className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6 md:p-10"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          data-lenis-prevent="true"
          onWheel={(e) => e.stopPropagation()}
          className="relative z-10 w-full max-w-3xl max-h-[85vh] overflow-y-auto overscroll-contain rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border-subtle)] shadow-2xl p-6 md:p-8"
        >
          {/* Header Bar */}
          <div className="flex items-start justify-between gap-4 border-b border-[var(--color-border-subtle)] pb-5">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="font-mono text-xs uppercase tracking-wider text-[var(--color-text-muted)] font-semibold">
                  {project.category}
                </span>
                {project.gallery?.some(isMobileScreenshot) && (
                  <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-[var(--color-surface-hover)] border border-[var(--color-border-subtle)] text-[var(--color-primary)] font-bold">
                    {project.device === 'mobile' ? 'Mobile App' : 'Web & Mobile'}
                  </span>
                )}
                <span className="font-mono text-xs text-[var(--color-text-muted)]">
                  · {project.company} · {project.period}
                </span>
              </div>
              <h3 className="font-display font-bold text-2xl sm:text-3xl tracking-tight text-[var(--color-text-main)]">
                {project.title}
              </h3>
            </div>

            <button
              onClick={onClose}
              className="rounded-full p-2 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 hover:rotate-90 active:scale-90 transition-all duration-200 cursor-pointer"
              aria-label={t('works.modalClose')}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Project Screenshot / Visual Preview */}
          {selectedImage ? (
            <div className="mt-6 space-y-3">
              {isCurrentMobile ? (
                /* High-End Pure CSS Smartphone Mockup */
                <div className="flex flex-col items-center justify-center py-4 px-2 sm:px-4 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-canvas)]/60">
                  <PhoneMockup
                    src={selectedImage}
                    alt={project.title}
                  />
                </div>
              ) : (
                /* Desktop Web Preview */
                <div className="overflow-hidden rounded-xl border border-[var(--color-border-subtle)] bg-black/40">
                  <img
                    src={selectedImage}
                    alt={project.title}
                    className="w-full h-auto max-h-[400px] object-cover object-top"
                  />
                </div>
              )}

              {/* Gallery Thumbnails */}
              {project.gallery && project.gallery.length > 1 && (
                <div className="flex items-center justify-center gap-2.5 overflow-x-auto pb-1 pt-2">
                  {project.gallery.map((img, idx) => {
                    const isMob = isMobileScreenshot(img)
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          setSelectedImage(img)
                        }}
                        className={`relative rounded-lg overflow-hidden border-2 transition-all duration-200 flex-shrink-0 cursor-pointer hover:scale-105 active:scale-95 ${
                          isMob ? 'h-14 w-8' : 'h-14 w-24'
                        } ${
                          selectedImage === img
                            ? 'border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/40 scale-105 shadow-[0_0_12px_var(--color-border-glow)]'
                            : 'border-[var(--color-border-subtle)] opacity-60 hover:opacity-100 hover:border-[var(--color-primary)]/60'
                        }`}
                        title={isMob ? 'Mobile View' : 'Web View'}
                      >
                        <img
                          src={img}
                          alt={`${project.title} view ${idx + 1}`}
                          className="w-full h-full object-cover object-top"
                        />
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          ) : (
            <div className="mt-6 aspect-video max-h-[220px] rounded-xl border border-dashed border-[var(--color-border-subtle)] bg-[var(--color-canvas)]/40 flex flex-col items-center justify-center p-6 text-center">
              <Layers className="w-10 h-10 text-[var(--color-text-muted)] mb-2 opacity-60" />
              <p className="font-mono text-xs text-[var(--color-text-muted)]">
                {project.company}
              </p>
            </div>
          )}

          {/* Metrics if available */}
          {project.metrics && (
            <div className="mt-4 p-3 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-canvas)] font-mono text-xs text-[var(--color-text-muted)]">
              {project.metrics}
            </div>
          )}

          {/* Description */}
          <div className="mt-6 space-y-2">
            <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
              Overview
            </h4>
            <p className="font-sans text-base text-[var(--color-text-main)] leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Key Architecture & Highlights */}
          {project.highlights && project.highlights.length > 0 && (
            <div className="mt-6 space-y-3">
              <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                {t('works.keyHighlights')}
              </h4>
              <ul className="space-y-2">
                {project.highlights.map((highlight, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 text-sm text-[var(--color-text-muted)] font-sans"
                  >
                    <span className="text-[var(--color-text-muted)] font-mono text-xs mt-0.5">•</span>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tech Stack Pills */}
          <div className="mt-6 space-y-3">
            <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
              Stack & Technologies
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.stack.map((item, idx) => (
                <span
                  key={idx}
                  className="font-mono text-xs px-3 py-1 rounded-md bg-[var(--color-surface-hover)] border border-[var(--color-border-subtle)] text-[var(--color-text-main)] hover:border-[var(--color-primary)]/50 hover:text-[var(--color-primary)] transition-colors cursor-default select-none"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Action Footer */}
          <div className="mt-8 pt-5 border-t border-[var(--color-border-subtle)] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {project.live_url && (
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--color-primary)] text-white font-display font-semibold text-sm hover:brightness-110 hover:scale-105 active:scale-95 transition-all duration-200 shadow-[0_0_15px_var(--color-border-glow)] select-none"
                >
                  <ExternalLink className="w-4 h-4" />
                  {t('works.livedemo')}
                </a>
              )}
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[var(--color-border-subtle)] text-[var(--color-text-main)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-surface-hover)] hover:scale-105 active:scale-95 font-mono text-xs font-medium transition-all duration-200 select-none"
                >
                  <Github className="w-4 h-4" />
                  {t('works.source')}
                </a>
              )}
            </div>

            <button
              onClick={onClose}
              className="font-mono text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:underline active:scale-95 transition-all px-3 py-1.5 cursor-pointer"
            >
              {t('works.modalClose')} (ESC)
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
