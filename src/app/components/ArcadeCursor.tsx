import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useChaos, UniverseType } from "./ChaosContext";

export function ArcadeCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);
  const { currentUniverse, stability, isPowerOutage } = useChaos();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });

      const target = e.target as HTMLElement;
      const isClickable = target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest("button") !== null ||
        target.closest("a") !== null;
      setIsPointer(isClickable);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const universeColors: Record<UniverseType, string> = {
    DEFAULT: "#00f0ff",
    FIX_IT: "#ffff00",
    SUGAR_RUSH: "#ff006e",
    HEROS_DUTY: "#39ff14",
  };

  const cursorColor = universeColors[currentUniverse] || universeColors.DEFAULT;
  const glowIntensity = Math.max(0.2, (100 - stability) / 100);

  return (
    <>
      {/* Outer Ring */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 border-2 rounded-full pointer-events-none z-[10000] mix-blend-screen"
        style={{
          borderColor: cursorColor,
          boxShadow: `0 0 ${15 + glowIntensity * 20}px ${cursorColor}`,
        }}
        animate={{
          x: mousePosition.x - 16,
          y: mousePosition.y - 16,
          scale: isPointer ? 1.5 : 1,
          rotate: isPointer ? 90 : 0,
        }}
        transition={{
          type: "spring",
          damping: 20,
          stiffness: 300,
          mass: 0.5
        }}
      />

      {/* Center Point */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 rounded-full pointer-events-none z-[10000]"
        style={{
          backgroundColor: cursorColor,
          boxShadow: `0 0 10px ${cursorColor}`,
        }}
        animate={{
          x: mousePosition.x - 4,
          y: mousePosition.y - 4,
        }}
        transition={{
          type: "spring",
          damping: 50,
          stiffness: 1000,
        }}
      />

      {/* Flashlight/Torch Glow in Power Outage */}
      <AnimatePresence>
        {isPowerOutage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-0 left-0 pointer-events-none z-[9998]"
            style={{
              left: mousePosition.x,
              top: mousePosition.y,
              transform: 'translate(-50%, -50%)',
              width: '600px',
              height: '600px',
              background: `radial-gradient(circle, ${cursorColor}22 0%, ${cursorColor}11 30%, transparent 70%)`,
              filter: 'blur(40px)'
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
