import { useRef } from 'react'
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
      className="md:sticky md:top-0 md:h-screen md:overflow-hidden relative min-h-screen w-full z-20 flex flex-col justify-center bg-[var(--color-canvas)] shadow-[0_-30px_60px_rgba(0,0,0,0.5)] border-t border-[var(--color-border-subtle)] py-20 sm:py-24 md:py-0"
    >
      <div className="about-content-wrapper max-w-[1360px] mx-auto px-6 sm:px-10 lg:pl-12 lg:pr-28 w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center pt-6 sm:pt-10 lg:pt-20 pb-6">
        
        {/* Left Column: Name & Credentials */}
        <div className="lg:col-span-6 z-10 space-y-4">
          
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
                    className="text-[var(--color-primary)] hover:underline inline-flex items-center gap-0.5 font-semibold text-xs"
                  >
                    {data.profile.leadership.organization}
                    <ArrowUpRight className="w-3 h-3" />
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
                  className="text-[var(--color-primary)] hover:underline inline-flex items-center gap-0.5 font-semibold text-xs"
                >
                  iCraft DS
                  <ArrowUpRight className="w-3 h-3" />
                </a>
                <span className="text-[10px] text-[var(--color-text-muted)]">(Digital Studio & Development)</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Bio Narrative & High-Impact Metric Cards */}
        <div className="lg:col-span-6 space-y-4 lg:pl-2">
          <p className="font-sans text-[var(--color-text-main)] text-xs sm:text-sm leading-relaxed">
            {t('about.p1')}
          </p>
          <p className="font-sans text-[var(--color-text-muted)] text-xs sm:text-sm leading-relaxed">
            {t('about.p2')}
          </p>

          {/* Metric Stats Grid */}
          <div className="pt-1 grid grid-cols-2 gap-2.5">
            {data.profile.stats.map((stat, idx) => (
              <div 
                key={idx}
                className="p-3 sm:p-3.5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border-subtle)] hover:border-[var(--color-primary)]/50 transition-colors group"
              >
                <div className="font-display font-bold text-xl sm:text-2xl text-[var(--color-text-main)] group-hover:scale-105 transition-transform origin-left">
                  {stat.value}
                </div>
                <div className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] mt-0.5">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Certifications row */}
          <div className="pt-1 flex flex-wrap gap-1.5">
            {data.profile.certifications.map((cert, idx) => (
              <span 
                key={idx} 
                className="px-2.5 py-0.5 rounded-full border border-[var(--color-border-subtle)] bg-[var(--color-surface)] text-[var(--color-text-muted)] font-mono text-[10px]"
              >
                {cert}
              </span>
            ))}
            <span className="px-2.5 py-0.5 rounded-full border border-[var(--color-border-subtle)] bg-[var(--color-surface)] text-[var(--color-text-muted)] font-mono text-[10px]">
              TOEFL: 457
            </span>
          </div>
        </div>
        
      </div>
    </section>
  )
}
