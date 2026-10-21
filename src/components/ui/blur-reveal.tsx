import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "../../lib/utils";

interface BlurRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
}

// Detect mobile once - skip blur filter on mobile (it's GPU-intensive)
const IS_MOBILE = typeof window !== 'undefined' && window.innerWidth < 768;

export function BlurReveal({
  children,
  className,
  delay = 0,
  duration = 0.7,
}: BlurRevealProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10px" });

  // On mobile: skip blur entirely, just do a simple fade-up
  const initialState = IS_MOBILE
    ? { opacity: 0, y: 16 }
    : { opacity: 0, filter: "blur(10px)", y: 16 };

  const animateState = IS_MOBILE
    ? { opacity: 1, y: 0 }
    : { opacity: 1, filter: "blur(0px)", y: 0 };

  return (
    <motion.span
      ref={ref}
      initial={initialState}
      animate={isInView ? animateState : initialState}
      transition={{
        duration: IS_MOBILE ? duration * 0.7 : duration,
        delay: IS_MOBILE ? delay * 0.5 : delay,
        ease: [0.25, 0.4, 0.25, 1],
      }}
      className={cn("inline-block", className)}
    >
      {children}
    </motion.span>
  );
}
