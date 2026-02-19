import { motion } from "motion/react";
import { ReactNode } from "react";

interface NeonButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "blue" | "pink" | "green" | "yellow" | "purple";
  className?: string;
  disabled?: boolean;
}

export function NeonButton({ 
  children, 
  onClick, 
  variant = "blue", 
  className = "",
  disabled = false 
}: NeonButtonProps) {
  const colors = {
    blue: "#00f0ff",
    pink: "#ff006e",
    green: "#39ff14",
    yellow: "#ffff00",
    purple: "#bf40bf",
  };

  const color = colors[variant];

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`relative px-6 py-3 border-2 bg-black/50 backdrop-blur-sm 
        transition-all duration-300 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-black/70'} ${className}`}
      style={{
        borderColor: color,
        color: color,
      }}
      whileHover={!disabled ? { 
        scale: 1.05,
        boxShadow: `0 0 20px ${color}, 0 0 40px ${color}, inset 0 0 20px ${color}33`,
      } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
    >
      <span className="relative z-10">{children}</span>
      <motion.div
        className="absolute inset-0 opacity-30"
        style={{
          background: `linear-gradient(45deg, transparent, ${color}22, transparent)`,
        }}
        animate={{
          x: ['-100%', '100%'],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </motion.button>
  );
}
