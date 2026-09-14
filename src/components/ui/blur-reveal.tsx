import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "../../lib/utils";

interface BlurRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
}

export function BlurReveal({
  children,
  className,
  delay = 0,
  duration = 0.8,
}: BlurRevealProps) {
  const ref = useRef<HTMLSpanElement>(null);
  // trigger animation when element comes into view
  const isInView = useInView(ref, { once: true, margin: "-20px" });

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, filter: "blur(12px)", y: 20 }}
      animate={
        isInView
          ? { opacity: 1, filter: "blur(0px)", y: 0 }
          : { opacity: 0, filter: "blur(12px)", y: 20 }
      }
      transition={{
        duration,
        delay,
        ease: [0.25, 0.4, 0.25, 1], // Custom smooth ease
      }}
      className={cn("inline-block", className)}
    >
      {children}
    </motion.span>
  );
}
