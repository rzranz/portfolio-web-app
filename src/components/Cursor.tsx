import { useEffect, useRef } from 'react'

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let mouseX = window.innerWidth / 2
    let mouseY = window.innerHeight / 2
    let dotX = mouseX
    let dotY = mouseY
    let ringX = mouseX
    let ringY = mouseY

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    window.addEventListener('mousemove', handleMouseMove)

    let animationFrameId: number

    const render = () => {
      dotX += (mouseX - dotX) * 0.35
      dotY += (mouseY - dotY) * 0.35
      ringX += (mouseX - ringX) * 0.15
      ringY += (mouseY - ringY) * 0.15

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${dotX}px, ${dotY}px) translate(-50%, -50%)`
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`
      }

      animationFrameId = requestAnimationFrame(render)
    }
    render()

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <>
      <div 
        ref={dotRef} 
        className="fixed top-0 left-0 w-2 h-2 bg-[var(--color-primary)] rounded-full pointer-events-none z-[9999] transition-transform duration-75"
        style={{ willChange: 'transform' }}
      />
      <div 
        ref={ringRef} 
        className="fixed top-0 left-0 w-10 h-10 border border-[var(--color-primary)] opacity-50 rounded-full pointer-events-none z-[9998] transition-all duration-300"
        style={{ willChange: 'transform' }}
      />
    </>
  )
}
