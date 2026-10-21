import { useId, useMemo } from "react";
import ParticlesComponent from "@tsparticles/react";
import { cn } from "../../lib/utils";

interface ParticlesProps {
  id?: string;
  className?: string;
  variant?: "default" | "dense";
  color?: string;
}

// Detect mobile once at module level - stable, no re-runs on resize
const IS_MOBILE = typeof window !== 'undefined' && window.innerWidth < 768;

export function Particles({ id, className, variant = "default", color = "#9333ea" }: ParticlesProps) {
  const autoId = useId();
  const particleId = id || `particles-${autoId.replace(/:/g, '')}`;

  const options = useMemo(() => ({
    fullScreen: { enable: false },
    background: {
      color: { value: "transparent" },
    },
    fpsLimit: 45,
    interactivity: {
      events: {
        onClick: { enable: false },
        onHover: { enable: false },
      },
    },
    particles: {
      color: { value: color },
      links: {
        color: color,
        distance: 140,
        enable: true,
        opacity: 0.25,
        width: 1,
      },
      move: {
        direction: "none" as const,
        enable: true,
        outModes: { default: "bounce" as const },
        random: true,
        speed: 0.4,
        straight: false,
      },
      number: {
        density: { enable: true, width: 800, height: 800 },
        value: variant === "dense" ? 60 : 35,
      },
      opacity: {
        value: { min: 0.1, max: 0.45 },
      },
      shape: { type: "circle" as const },
      size: { value: { min: 1, max: 2 } },
    },
    detectRetina: false, // disable retina to halve canvas resolution
  }), [variant, color]);

  // Skip rendering particles component on mobile for performance
  if (IS_MOBILE) {
    return null;
  }

  return (
    <ParticlesComponent
      id={particleId}
      className={cn("absolute inset-0 z-0 pointer-events-none", className)}
      options={options}
    />
  );
}
