import { useRef } from 'react'
import { motion, useScroll, useTransform, MotionValue } from "framer-motion"
import { cn } from "../lib/utils"
import data from '../data/cv.json'

// Map tech names to devicon class names
const techIcons: Record<string, string> = {
  'Laravel': 'devicon-laravel-original',
  'Tailwind': 'devicon-tailwindcss-original',
  'Django': 'devicon-django-plain',
  'Next JS': 'devicon-nextjs-original-wordmark',
  'Vue JS': 'devicon-vuejs-plain',
  'Springboot': 'devicon-spring-original',
  'React': 'devicon-react-original',
  'Git': 'devicon-git-plain',
  'Go-Lang': 'devicon-go-original-wordmark',
  'PostgreSQL': 'devicon-postgresql-plain',
  'MySQL': 'devicon-mysql-original',
  'Unity': 'devicon-unity-plain',
  'Three.js': 'devicon-threejs-original',
}

type CharacterProps = {
  char: string
  index: number
  centerIndex: number
  scrollYProgress: MotionValue<number>
}

const CharacterV2 = ({
  char,
  index,
  centerIndex,
  scrollYProgress,
}: CharacterProps) => {
  const distanceFromCenter = index - centerIndex
  const iconClass = techIcons[char] || 'devicon-devicon-plain'

  const x = useTransform(
    scrollYProgress,
    [0, 1],
    [distanceFromCenter * 50, 0]
  )
  const scale = useTransform(scrollYProgress, [0, 1], [0.5, 1])

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [Math.abs(distanceFromCenter) * 40, 0]
  )
  
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.8],
    [0, 1]
  )

  return (
    <motion.div
      title={char}
      className="inline-flex flex-col items-center justify-center p-2 md:p-4 hover:scale-110 transition-transform cursor-default group"
      style={{
        x,
        scale,
        y,
        opacity,
        transformOrigin: "center",
      }}
    >
      <i className={cn(iconClass, "text-4xl md:text-5xl text-[var(--color-text-muted)] group-hover:text-[var(--color-text-main)] transition-colors duration-300")} />
      <span className="font-sans text-[10px] mt-2 opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-4 whitespace-nowrap text-[var(--color-text-main)]">
        {char}
      </span>
    </motion.div>
  )
}

const Bracket = ({ className }: { className: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 27 78"
      className={className}
    >
      <path
        fill="currentColor"
        d="M26.52 77.21h-5.75c-6.83 0-12.38-5.56-12.38-12.38V48.38C8.39 43.76 4.63 40 .01 40v-4c4.62 0 8.38-3.76 8.38-8.38V12.4C8.38 5.56 13.94 0 20.77 0h5.75v4h-5.75c-4.62 0-8.38 3.76-8.38 8.38V27.6c0 4.34-2.25 8.17-5.64 10.38 3.39 2.21 5.64 6.04 5.64 10.38v16.45c0 4.62 3.76 8.38 8.38 8.38h5.75v4.02Z"
      ></path>
    </svg>
  )
}

export default function TechStack() {
  const sectionRef = useRef<HTMLElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 90%", "center center"]
  })

  const techList = data.tech_stack
  const centerIndex = Math.floor(techList.length / 2)

  return (
    <section id="tech" ref={sectionRef} className="py-24 lg:py-32 bg-[var(--color-canvas)] border-b border-[var(--color-border-subtle)] overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 w-full flex flex-col items-center gap-12 lg:gap-16">
        
        <div className="text-center">
          <p className="font-display flex flex-wrap items-center justify-center gap-3 text-2xl sm:text-3xl lg:text-4xl font-medium tracking-tight text-[var(--color-text-main)]">
            <Bracket className="h-8 sm:h-12 text-[var(--color-text-muted)] opacity-50" />
            <span>Technologies I work with</span>
            <Bracket className="h-8 sm:h-12 scale-x-[-1] text-[var(--color-text-muted)] opacity-50" />
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center max-w-4xl mx-auto gap-4 relative">
          {techList.map((tech, index) => (
            <CharacterV2
              key={index}
              char={tech}
              index={index}
              centerIndex={centerIndex}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>

      </div>
    </section>
  )
}
