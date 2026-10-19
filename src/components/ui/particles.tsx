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

  const options = useMemo(() => ({
    fullScreen: { enable: false },
    background: {
      color: {
        value: "transparent",
      },
    },
    fpsLimit: 60,
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
        distance: 160,
        enable: true,
        opacity: 0.35,
        width: 1.2,
      },
      move: {
        direction: "none" as const,
        enable: true,
        outModes: {
          default: "bounce" as const,
        },
        random: true,
        speed: 0.5,
        straight: false,
      },
      number: {
        density: {
          enable: true,
          width: 800,
          height: 800,
        },
        value: variant === "dense" ? 120 : 70,
      },
      opacity: {
        value: { min: 0.2, max: 0.7 },
      },
      shape: {
        type: "circle" as const,
      },
      size: {
        value: { min: 1.5, max: 3 },
      },
    },
    detectRetina: true,
  }), [variant, color]);

  return (
    <ParticlesComponent
      id={particleId}
      className={cn("absolute inset-0 z-0 pointer-events-none", className)}
      options={options}
    />
  );
}
