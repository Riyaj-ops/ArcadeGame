import { motion } from "motion/react";
import { useEffect, useState } from "react";

interface GlitchTextProps {
  children: string;
  className?: string;
  glitchIntensity?: "low" | "medium" | "high";
}

export function GlitchText({ children, className = "", glitchIntensity = "medium" }: GlitchTextProps) {
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 100);
    }, glitchIntensity === "low" ? 5000 : glitchIntensity === "medium" ? 3000 : 1500);

    return () => clearInterval(interval);
  }, [glitchIntensity]);

  return (
    <motion.div
      className={`relative inline-block ${className}`}
      animate={isGlitching ? {
        x: [0, -2, 2, -1, 1, 0],
        textShadow: [
          "0 0 0 transparent",
          "-2px 0 #ff006e, 2px 0 #00f0ff",
          "2px 0 #ff006e, -2px 0 #00f0ff",
          "0 0 0 transparent",
        ],
      } : {}}
      transition={{ duration: 0.2 }}
    >
      {children}
      {isGlitching && (
        <>
          <span className="absolute top-0 left-0 opacity-70" style={{ color: "#ff006e", transform: "translate(-2px, 0)" }}>
            {children}
          </span>
          <span className="absolute top-0 left-0 opacity-70" style={{ color: "#00f0ff", transform: "translate(2px, 0)" }}>
            {children}
          </span>
        </>
      )}
    </motion.div>
  );
}
