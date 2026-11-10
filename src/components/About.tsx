import { useRef } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '../lib/i18n'
import { ArrowUpRight } from 'lucide-react'
import data from '../data/cv.json'

export default function About() {
  const { t } = useLanguage()
  const sectionRef = useRef<HTMLElement>(null)

  return (
    <section 
      id="about" 
      ref={sectionRef} 
      className="relative min-h-screen w-full z-20 flex flex-col justify-center bg-[var(--color-canvas)] shadow-[0_-30px_60px_rgba(0,0,0,0.5)] py-20 sm:py-24 md:py-28"
    >
      <div className="about-content-wrapper max-w-[1360px] mx-auto px-6 sm:px-10 lg:pl-12 lg:pr-28 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center pt-6 sm:pt-10 lg:pt-20 pb-6">
        
        {/* Left Column: Name & Credentials */}
        <motion.div 
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="lg:col-span-6 z-10 space-y-4"
        >
          
          {/* Crisp, Bold Editorial Name Typography */}
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl md:text-4xl lg:text-[2.65rem] xl:text-[3rem] tracking-tight leading-[1.1] uppercase text-[var(--color-text-main)]">
            {t('about.title')}
          </h2>

          {/* Credentials Info Block */}
          <div className="font-mono text-xs uppercase tracking-wider text-[var(--color-text-muted)] border-l-2 border-[var(--color-primary)]/40 pl-3.5 space-y-2.5 pt-0.5">
            <div>
              <p className="font-semibold text-[var(--color-text-main)] text-xs sm:text-sm">{data.profile.education.institution}</p>
              <p className="mt-0.5 text-[11px] text-[var(--color-text-muted)]">{data.profile.education.degree} · GPA: {data.profile.education.gpa}</p>
              <p className="text-[10px] text-[var(--color-text-muted)]/70">{data.profile.education.period}</p>
            </div>

            {data.profile.leadership && (
              <div className="pt-1.5 border-t border-[var(--color-border-subtle)]">
                <span className="font-mono text-[9px] uppercase tracking-wider text-[var(--color-text-muted)]/70 block">Leadership</span>
                <p className="font-semibold text-[var(--color-text-main)] mt-0.5 text-xs">{data.profile.leadership.role}</p>
                <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                  <a
                    href={data.profile.leadership.organization_url || "https://hmif.unikom.my.id/"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group text-[var(--color-primary)] hover:text-[var(--color-accent)] inline-flex items-center gap-0.5 font-semibold text-xs transition-colors"
                  >
                    <span>{data.profile.leadership.organization}</span>
                    <ArrowUpRight className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                  <span className="text-[10px] text-[var(--color-text-muted)]">({data.profile.leadership.period})</span>
                </div>
              </div>
            )}

            <div className="pt-1.5 border-t border-[var(--color-border-subtle)]">
              <span className="font-mono text-[9px] uppercase tracking-wider text-[var(--color-text-muted)]/70 block">Software House</span>
              <p className="font-semibold text-[var(--color-text-main)] mt-0.5 text-xs">Software Engineer</p>
              <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                <a
                  href="https://www.icraftds.id/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group text-[var(--color-primary)] hover:text-[var(--color-accent)] inline-flex items-center gap-0.5 font-semibold text-xs transition-colors"
                >
                  <span>iCraft DS</span>
                  <ArrowUpRight className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
                <span className="text-[10px] text-[var(--color-text-muted)]">(Digital Studio & Development)</span>
              </div>
            </div>
          </div>

        </motion.div>

        {/* Right Column: Bio Narrative & High-Impact Metric Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          className="lg:col-span-6 space-y-4 lg:pl-2"
        >
          <p className="font-sans text-[var(--color-text-main)] text-xs sm:text-sm leading-relaxed">
            {t('about.p1')}
          </p>
          <p className="font-sans text-[var(--color-text-muted)] text-xs sm:text-sm leading-relaxed">
            {t('about.p2')}
          </p>

          {/* Metric Stats Grid with Touch/Hover Feedback */}
          <div className="pt-1 grid grid-cols-2 gap-2.5">
            {data.profile.stats.map((stat, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="p-3 sm:p-3.5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border-subtle)] hover:border-[var(--color-primary)]/70 hover:shadow-[0_0_24px_rgba(168,85,247,0.22)] hover:bg-[var(--color-surface-hover)] transition-all group cursor-default select-none"
              >
                <div className="font-display font-bold text-xl sm:text-2xl text-[var(--color-text-main)] group-hover:text-[var(--color-primary)] transition-colors origin-left">
                  {stat.value}
                </div>
                <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mt-0.5">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Certifications row */}
          <div className="pt-1 flex flex-wrap gap-1.5">
            {data.profile.certifications.map((cert, idx) => (
              <span 
                key={idx} 
                className="px-2.5 py-0.5 rounded-full border border-[var(--color-border-subtle)] bg-[var(--color-surface)] text-[var(--color-text-muted)] font-mono text-[10px] hover:border-[var(--color-primary)]/60 hover:text-[var(--color-primary)] hover:scale-105 active:scale-95 transition-all duration-200 cursor-default select-none"
              >
                {cert}
              </span>
            ))}
            <span className="px-2.5 py-0.5 rounded-full border border-[var(--color-border-subtle)] bg-[var(--color-surface)] text-[var(--color-text-muted)] font-mono text-[10px] hover:border-[var(--color-primary)]/60 hover:text-[var(--color-primary)] hover:scale-105 active:scale-95 transition-all duration-200 cursor-default select-none">
              TOEFL: 457
            </span>
          </div>
        </motion.div>
        
      </div>
    </section>
  )
}
