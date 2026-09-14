import { useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Icosahedron, Box, Sphere } from '@react-three/drei'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import data from '../data/cv.json'

gsap.registerPlugin(ScrollTrigger)

function FloatingShapes() {
  const groupRef = useRef<any>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2
    }
  })

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={2.5} color="#a855f7" />
      <pointLight position={[-5, -5, -5]} intensity={1.5} color="#ffffff" />
      
      <Box args={[1.2, 1.2, 1.2]} position={[-0.8, 0.4, 0]}>
        <meshStandardMaterial color="#a855f7" wireframe opacity={0.2} transparent />
      </Box>
      <Icosahedron args={[0.8, 0]} position={[1.2, -0.4, 0.5]}>
        <meshStandardMaterial color="#ffffff" wireframe opacity={0.3} transparent />
      </Icosahedron>
      <Sphere args={[0.3, 16, 16]} position={[-0.2, -1.2, 1]}>
         <meshStandardMaterial color="#888888" opacity={0.8} />
      </Sphere>
    </group>
  )
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Entrance animation
    const tl = gsap.timeline()
    tl.fromTo('.hero-text-line', 
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, stagger: 0.1, ease: 'power3.out', delay: 0.1 }
    )
    tl.fromTo('.hero-sub',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' },
      "-=0.5"
    )
    tl.fromTo('.hero-cta',
      { opacity: 0 },
      { opacity: 1, duration: 0.8 },
      "-=0.6"
    )

    // Parallax on scroll — text moves up faster, canvas lingers
    const ctx = gsap.context(() => {
      if (textRef.current) {
        gsap.to(textRef.current, {
          y: -80,
          opacity: 0.3,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1.2,
          }
        })
      }
      if (canvasRef.current) {
        gsap.to(canvasRef.current, {
          y: -30,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 2,
          }
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const shortSummary = data.profile.summary.split(' ').slice(0, 22).join(' ') + '.';

  return (
    <section id="hero" ref={sectionRef} className="min-h-[100dvh] flex items-center relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Column: Typography — scrolls away faster */}
        <div ref={textRef} className="z-10 pt-24 lg:pt-0 will-change-transform">
          <h1 className="font-display font-semibold text-5xl md:text-6xl lg:text-[4.5rem] tracking-tight leading-[1.08] mb-6">
            <div className="overflow-hidden pb-1"><div className="hero-text-line">{data.profile.role}</div></div>
          </h1>
          
          <p className="hero-sub text-[var(--color-text-muted)] text-base md:text-lg leading-relaxed max-w-[48ch] mb-8 font-sans">
            {shortSummary}
          </p>
          
          <div className="hero-cta flex items-center gap-6">
            <a href="#about" className="text-[var(--color-primary)] text-sm font-sans font-medium hover:opacity-70 transition-opacity inline-flex items-center gap-1.5">
              About me <span className="text-xs">›</span>
            </a>
          </div>
        </div>

        {/* Right Column: 3D Canvas — lingers with slower parallax */}
        <div ref={canvasRef} className="relative h-[400px] lg:h-[600px] w-full flex-center will-change-transform">
          <Canvas camera={{ position: [0, 0, 4.5], fov: 45 }} className="w-full h-full cursor-grab active:cursor-grabbing">
            <FloatingShapes />
          </Canvas>
        </div>

      </div>
    </section>
  )
}
