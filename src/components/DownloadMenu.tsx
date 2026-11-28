import { useEffect, useRef, useState } from 'react'
import { ChevronDown, Download, FileText } from 'lucide-react'

const DOWNLOAD_DOCUMENTS = [
  {
    id: 'cv-en',
    label: 'CV — English',
    meta: 'PDF · ATS Friendly',
    href: '/CV/CV%20Universal%20(English)%20-%20Randi%20Zakaria%20Putra.pdf',
    filename: 'CV-English-Randi-Zakaria-Putra.pdf',
  },
  {
    id: 'cv-id',
    label: 'CV — Indonesia',
    meta: 'PDF · Bahasa Indonesia',
    href: '/CV/CV%20-%20Randi%20Zakaria%20Putra.pdf',
    filename: 'CV-Randi-Zakaria-Putra-ID.pdf',
  },
  {
    id: 'portfolio-pdf',
    label: 'Portfolio Deck',
    meta: 'PDF · Selected Works',
    href: '/CV/PORTOFOLIO_RANDI%20ZAKARIA%20PUTRA.pdf',
    filename: 'Portfolio-Randi-Zakaria-Putra.pdf',
  },
] as const

interface DownloadMenuProps {
  variant?: 'hero' | 'contact'
  align?: 'left' | 'right'
  openDirection?: 'up' | 'down'
}

export default function DownloadMenu({
  variant = 'hero',
  align = 'right',
  openDirection = 'up',
}: DownloadMenuProps) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handleOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handleOutside)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleOutside)
      document.removeEventListener('keydown', handleKey)
    }
  }, [open])

  const positionClass =
    openDirection === 'up'
      ? 'bottom-full mb-2.5'
      : 'top-full mt-2.5'

  const alignClass =
    align === 'right'
      ? 'left-0 sm:left-auto sm:right-0'
      : 'left-0'

  return (
    <div ref={containerRef} className="relative inline-block">
      {variant === 'hero' ? (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-haspopup="menu"
          className="group inline-flex items-center gap-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors cursor-pointer bg-transparent border-0 p-0"
        >
          <span className="text-[10px] opacity-55">03</span>
          <span className="font-semibold text-[var(--color-text-main)] group-hover:text-[var(--color-primary)] transition-colors">
            cv &amp; portfolio
          </span>
          <ChevronDown
            className={`w-3.5 h-3.5 opacity-70 transition-transform duration-200 ${
              open ? 'rotate-180 text-[var(--color-primary)]' : ''
            }`}
          />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-haspopup="menu"
          className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-[var(--color-border-subtle)] bg-[var(--color-surface)] text-[var(--color-text-main)] font-mono text-xs font-semibold hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] hover:scale-105 active:scale-95 transition-all duration-200 select-none cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>CV &amp; Portfolio PDF</span>
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-200 ${
              open ? 'rotate-180' : ''
            }`}
          />
        </button>
      )}

      {open && (
        <div
          role="menu"
          className={`absolute ${positionClass} ${alignClass} z-50 w-60 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)]/95 backdrop-blur-md p-1.5 shadow-[0_16px_40px_rgba(0,0,0,0.45)] text-left`}
        >
          <div className="px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--color-text-muted)] border-b border-[var(--color-border-subtle)]/60 mb-1">
            Download Documents
          </div>
          {DOWNLOAD_DOCUMENTS.map((docItem) => (
            <a
              key={docItem.id}
              role="menuitem"
              href={docItem.href}
              download={docItem.filename}
              onClick={() => setOpen(false)}
              className="flex items-center justify-between gap-3 px-2.5 py-2 rounded-lg text-[var(--color-text-main)] hover:bg-[var(--color-primary)]/12 hover:text-[var(--color-primary)] transition-colors group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <FileText className="w-4 h-4 shrink-0 text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)]" />
                <div className="min-w-0">
                  <div className="font-sans text-xs font-semibold leading-tight truncate">
                    {docItem.label}
                  </div>
                  <div className="font-mono text-[10px] text-[var(--color-text-muted)] leading-tight mt-0.5">
                    {docItem.meta}
                  </div>
                </div>
              </div>
              <Download className="w-3.5 h-3.5 shrink-0 opacity-60 group-hover:opacity-100" />
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
