import { useRef } from 'react'
import { motion, useScroll, useTransform, MotionValue } from "framer-motion"
import { cn } from "../lib/utils"

type CharacterProps = {
  char: string
  index: number
  centerIndex: number
  scrollYProgress: MotionValue<number>
}

const CharacterV1 = ({
  char,
  index,
  centerIndex,
  scrollYProgress,
}: CharacterProps) => {
  const isSpace = char === " "
  const distanceFromCenter = index - centerIndex

  // We map the scroll progress (0 to 1) to the transform values.
  // When scroll is 0 (element just enters), it's spread out.
  // When scroll is 1 (element is in center), it's in original position.
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    [distanceFromCenter * 40, 0]
  )
  const rotateX = useTransform(
    scrollYProgress,
    [0, 1],
    [distanceFromCenter * 30, 0]
  )
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.8],
    [0, 1]
  )

  return (
    <motion.span
      className={cn("inline-block text-[var(--color-text-main)]", isSpace && "w-3 md:w-5")}
      style={{
        x,
        rotateX,
        opacity,
      }}
    >
      {char}
    </motion.span>
  )
}

export default function About() {
  const sectionRef = useRef<HTMLElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    // Start tracking when the top of the element hits the bottom of the viewport
    // Stop tracking when the center of the element hits the center of the viewport
    offset: ["start 90%", "center center"]
  })

  const text = "FULLSTACK ENGINEER, PROBLEM SOLVER."
  const characters = text.split("")
  const centerIndex = Math.floor(characters.length / 2)

  return (
    <section id="about" ref={sectionRef} className="py-24 lg:py-40 bg-[var(--color-canvas)] border-b border-[var(--color-border-subtle)] overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center">
        
        {/* Animated Title */}
        <div className="lg:col-span-7 z-10" style={{ perspective: "1000px" }}>
          <h2 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl tracking-tight leading-[1.1] uppercase">
            {characters.map((char, index) => (
              <CharacterV1
                key={index}
                char={char}
                index={index}
                centerIndex={centerIndex}
                scrollYProgress={scrollYProgress}
              />
            ))}
          </h2>
          <div className="mt-8 font-mono text-xs uppercase tracking-widest text-[var(--color-text-muted)] border-l border-[var(--color-border-subtle)] pl-4">
            <p>Universitas Komputer Indonesia (2022-2026)</p>
            <p className="mt-1">Bachelor of Informatics Engineering (GPA: 3.43)</p>
          </div>
        </div>

        {/* Text Content */}
        <div className="lg:col-span-5 space-y-6 lg:pl-12">
          <p className="font-sans text-[var(--color-text-main)] text-base md:text-lg leading-relaxed">
            I am a Fullstack Software Engineer with a proven track record of building scalable web applications. My expertise lies in architecting robust backend systems and creating responsive, intuitive frontends.
          </p>
          <p className="font-sans text-[var(--color-text-muted)] text-base md:text-lg leading-relaxed">
            With hands-on experience in managing technical projects and leading teams, I approach every challenge with strong problem-solving skills and technical adaptability—whether I'm integrating payment gateways, developing REST APIs, or building enterprise systems.
          </p>
          <div className="pt-6 font-display font-medium text-xl leading-snug">
            "Driven by logic, adaptability, and the pursuit of clean code."
          </div>
        </div>
        
      </div>
    </section>
  )
}
