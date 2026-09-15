import { type CSSProperties, type ReactNode, useEffect, useState } from "react"
import { stagger, useAnimate } from "framer-motion"
import { cn } from "../../lib/utils"

interface StaggerTextEffectProps {
  className?: string
  children: ReactNode
  duration?: number
  staggerDelay?: number
  delay?: number
}

export function StaggerBlurEffect({
  className,
  children,
  duration = 0.4,
  staggerDelay = 0.03,
  delay = 0,
}: StaggerTextEffectProps) {
  const [scope, animate] = useAnimate()
  const [isRotatedUp, setIsRotatedUp] = useState<boolean>(false)

  const onMouseEnter = () => {
    setIsRotatedUp((prev) => !prev)
  }

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>
    let interval: ReturnType<typeof setInterval>

    // Initial sequence
    timeout = setTimeout(() => {
      setIsRotatedUp(true)
    }, delay * 1000)

    // Trigger every 5 seconds
    interval = setInterval(() => {
      setIsRotatedUp((prev) => !prev)
    }, 5000 + delay * 1000)

    return () => {
      clearTimeout(timeout)
      clearInterval(interval)
    }
  }, [delay])

  useEffect(() => {
    if (isRotatedUp) {
      animate([
        [
          ".letter",
          { rotateX: 80 },
          { duration, delay: stagger(staggerDelay) },
        ],
        [
          ".face-front",
          { filter: "blur(6px)", opacity: 0 },
          { duration, delay: stagger(staggerDelay), at: "<" },
        ],
        [
          ".face-back",
          { filter: "blur(0px)", opacity: 1 },
          { duration, delay: stagger(staggerDelay), at: "<" },
        ],
      ])
    } else {
      animate([
        [".letter", { rotateX: 0 }, { duration, delay: stagger(staggerDelay) }],
        [
          ".face-front",
          { filter: "blur(0px)", opacity: 1 },
          { duration, delay: stagger(staggerDelay), at: "<" },
        ],
        [
          ".face-back",
          { filter: "blur(6px)", opacity: 0 },
          { duration, delay: stagger(staggerDelay), at: "<" },
        ],
      ])
    }
  }, [isRotatedUp, animate, duration, staggerDelay])

  const lettersArray = children?.toString().split("") || []

  return (
    <div
      ref={scope}
      style={
        {
          "--height": `1em`,
          perspective: "1000px",
        } as CSSProperties
      }
      onMouseEnter={onMouseEnter}
      className={cn(
        "inline-block cursor-pointer tracking-tighter flex-wrap",
        className
      )}
    >
      <span className="sr-only">{children}</span>
      <span
        aria-hidden
        className="relative flex flex-wrap h-[--height] items-center justify-center"
      >
        {lettersArray.map((letter, index) => (
          <span
            style={{
              transformStyle: "preserve-3d",
              transition: `transform cubic-bezier(0.3, 0.65, 0.4, 1)`,
              backfaceVisibility: "hidden",
            }}
            data-letter={letter}
            key={`${letter}-${index}`}
            className="letter relative inline-block h-[--height] leading-[--height]"
          >
            <span
              aria-hidden="true"
              className="face face-front absolute inset-0 flex items-center justify-center whitespace-pre"
            >
              {letter === " " ? " " : letter}
            </span>
            <span
              aria-hidden="true"
              className="face face-back absolute inset-0 flex items-center justify-center whitespace-pre text-[var(--color-primary)]"
            >
              {letter === " " ? " " : letter}
            </span>
            <span className="opacity-0 whitespace-pre">
              {letter === " " ? " " : letter}
            </span>
          </span>
        ))}
        <style>{`
          .face {
            backface-visibility: hidden;
            transform-style: preserve-3d;
          }
          .face-front {
            transform: rotateX(0deg) translateZ(0.5em);
          }
          .face-back {
            transform: rotateX(-80deg) translateZ(0.5em);
            backface-visibility: hidden;
            filter: blur(8px);
            opacity: 0;
          }
        `}</style>
      </span>
    </div>
  )
}
