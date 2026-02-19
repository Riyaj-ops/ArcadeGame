import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { ReactNode, useEffect } from "react";

interface ArcadeCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
  delay?: number;
}

export function ArcadeCard({ children, className = "", glowColor = "#00f0ff", delay = 0 }: ArcadeCardProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-500, 500], [5, -5]), { stiffness: 100, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-500, 500], [-5, 5]), { stiffness: 100, damping: 30 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const { clientX, clientY } = event;
      x.set(clientX - window.innerWidth / 2);
      y.set(clientY - window.innerHeight / 2);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [x, y]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, rotate: -2, scale: 0.95 }}
      animate={{
        opacity: 1,
        y: [0, -5, 0], // Subtle breathing/float
        rotate: 0,
        scale: 1
      }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        borderColor: glowColor,
        boxShadow: `0 0 10px ${glowColor}44, inset 0 0 20px ${glowColor}11`,
      }}
      transition={{
        opacity: { duration: 0.5, delay },
        y: {
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: delay + 0.5
        },
        rotateX: { type: "spring", stiffness: 100, damping: 30 },
        rotateY: { type: "spring", stiffness: 100, damping: 30 },
        default: {
          type: "spring",
          stiffness: 80,
          damping: 15,
          delay
        }
      }}
      whileHover={{
        scale: 1.02,
        boxShadow: `0 0 25px ${glowColor}88, inset 0 0 35px ${glowColor}22`,
        transition: { type: "spring", stiffness: 400, damping: 10 }
      }}
      className={`relative border-2 bg-black/60 backdrop-blur-md p-6 ${className}`}
    >
      {/* corner accents */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4" style={{ borderColor: glowColor }} />
      <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4" style={{ borderColor: glowColor }} />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4" style={{ borderColor: glowColor }} />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4" style={{ borderColor: glowColor }} />

      <div className="relative z-10" style={{ transform: "translateZ(20px)" }}>
        {children}
      </div>
    </motion.div>
  );
}
