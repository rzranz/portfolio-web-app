import { useMemo } from "react";
import ParticlesComponent, { ParticlesProvider } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { cn } from "../../lib/utils";

interface ParticlesProps {
  className?: string;
  variant?: "default" | "dense";
  color?: string;
}

export function Particles({ className, variant = "default", color = "#9333ea" }: ParticlesProps) {
  
  const options = useMemo(() => ({
    fullScreen: { enable: false },
    background: {
      color: {
        value: "transparent",
      },
    },
    fpsLimit: 120,
    interactivity: {
      events: {
        onClick: { enable: false, mode: "push" },
        onHover: { enable: false, mode: "grab" },
      },
    },
    particles: {
      color: {
        value: color,
      },
      links: {
        color: color,
        distance: 150,
        enable: true,
        opacity: 0.2,
        width: 1,
      },
      move: {
        direction: "none" as const,
        enable: true,
        outModes: {
          default: "bounce" as const,
        },
        random: true,
        speed: 0.4,
        straight: false,
      },
      number: {
        density: {
          enable: true,
          width: 800,
          height: 800,
        },
        value: variant === "dense" ? 120 : 60,
      },
      opacity: {
        value: { min: 0.1, max: 0.4 },
      },
      shape: {
        type: "circle" as const,
      },
      size: {
        value: { min: 1, max: 2 },
      },
    },
    detectRetina: true,
  }), [variant, color]);

  return (
    <ParticlesProvider init={async (engine) => await loadSlim(engine)}>
      <ParticlesComponent
        id="tsparticles"
        className={cn("absolute inset-0 z-0 pointer-events-none", className)}
        options={options}
      />
    </ParticlesProvider>
  );
}
