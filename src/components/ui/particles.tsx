import { useId, useMemo } from "react";
import ParticlesComponent from "@tsparticles/react";
import { cn } from "../../lib/utils";

interface ParticlesProps {
  id?: string;
  className?: string;
  variant?: "default" | "dense";
  color?: string;
}

export function Particles({ id, className, variant = "default", color = "#9333ea" }: ParticlesProps) {
  const autoId = useId();
  const particleId = id || `particles-${autoId.replace(/:/g, '')}`;

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const options = useMemo(() => ({
    fullScreen: { enable: false },
    background: {
      color: {
        value: "transparent",
      },
    },
    fpsLimit: isMobile ? 30 : 60,
    interactivity: {
      events: {
        onClick: { enable: false },
        onHover: { enable: false },
      },
    },
    particles: {
      color: {
        value: color,
      },
      links: {
        color: color,
        distance: 140,
        enable: !isMobile, // Disable expensive line distance calculations on mobile
        opacity: 0.3,
        width: 1,
      },
      move: {
        direction: "none" as const,
        enable: true,
        outModes: {
          default: "bounce" as const,
        },
        random: true,
        speed: isMobile ? 0.3 : 0.5,
        straight: false,
      },
      number: {
        density: {
          enable: !isMobile,
          width: 800,
          height: 800,
        },
        value: isMobile ? 14 : variant === "dense" ? 100 : 60,
      },
      opacity: {
        value: { min: 0.15, max: 0.6 },
      },
      shape: {
        type: "circle" as const,
      },
      size: {
        value: { min: 1, max: 2.5 },
      },
    },
    detectRetina: !isMobile, // Avoid 3x massive Retina canvas on iPhone 15 Pro
  }), [variant, color, isMobile]);

  return (
    <ParticlesComponent
      id={particleId}
      className={cn("absolute inset-0 z-0 pointer-events-none", className)}
      options={options}
    />
  );
}
