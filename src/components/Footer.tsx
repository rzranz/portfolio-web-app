import { ArrowRight } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-[var(--color-canvas)] border-t border-[var(--color-border-subtle)] pt-16 pb-8 px-6 lg:px-12">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          
          {/* Brand & Slogan */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            <div className="font-display font-bold text-3xl tracking-wider text-[var(--color-text-main)]">
              <span className="text-[var(--color-primary)]">&gt;</span> RANN.
            </div>
            <p className="font-sans text-[var(--color-text-muted)] text-sm max-w-xs leading-relaxed">
              Fullstack Engineer, Problem Solver. Driven by logic, adaptability, and the pursuit of clean code.
            </p>
          </div>

          {/* Links Column 1: Navigation */}
          <div className="flex flex-col gap-4">
            <h4 className="font-sans font-semibold text-[var(--color-text-main)] text-sm mb-2">Navigation</h4>
            <a href="#hero" className="font-sans text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] transition-colors text-sm w-fit">Home</a>
            <a href="#about" className="font-sans text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] transition-colors text-sm w-fit">About</a>
            <a href="#tech" className="font-sans text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] transition-colors text-sm w-fit">Tech Stack</a>
            <a href="#works" className="font-sans text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] transition-colors text-sm w-fit">Recent Works</a>
          </div>

          {/* Links Column 2: Connect */}
          <div className="flex flex-col gap-4">
            <h4 className="font-sans font-semibold text-[var(--color-text-main)] text-sm mb-2">Connect</h4>
            <a href="https://www.linkedin.com/in/randizakariaputra" target="_blank" rel="noreferrer" className="font-sans text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] transition-colors text-sm w-fit">LinkedIn</a>
            <a href="https://github.com/rzranz" target="_blank" rel="noreferrer" className="font-sans text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] transition-colors text-sm w-fit">GitHub</a>
            <a href="mailto:randizakariaputra22@gmail.com" className="font-sans text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] transition-colors text-sm w-fit">Email</a>
          </div>

          {/* Right Column: Newsletter / Contact CTA */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            <h4 className="font-sans font-semibold text-[var(--color-text-main)] text-sm mb-2">Start a project</h4>
            <p className="font-sans text-[var(--color-text-muted)] text-sm leading-relaxed mb-2">
              Interested in working together? Drop your email and I'll get back to you.
            </p>
            <form 
              onSubmit={(e) => { e.preventDefault(); window.location.href = "mailto:randizakariaputra22@gmail.com"; }}
              className="flex items-center gap-2"
            >
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 bg-[var(--color-surface)] border border-[var(--color-border-subtle)] rounded-md px-4 py-2.5 text-sm font-sans text-[var(--color-text-main)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-text-main)] transition-colors"
                required
              />
              <button 
                type="submit" 
                className="bg-[var(--color-text-main)] text-[var(--color-canvas)] h-[42px] w-[42px] rounded-md flex items-center justify-center hover:opacity-80 transition-opacity"
              >
                <ArrowRight size={18} />
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-[var(--color-border-subtle)] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-mono text-xs text-[var(--color-text-muted)]">
            © 2026 RANDI ZAKARIA PUTRA. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="font-mono text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] transition-colors cursor-pointer">Bandung, ID</span>
            <a href="#hero" className="font-mono text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] transition-colors">Back to top</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
