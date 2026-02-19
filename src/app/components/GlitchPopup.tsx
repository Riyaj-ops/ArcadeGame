import { motion, AnimatePresence } from "motion/react";
import { AlertTriangle, X } from "lucide-react";
import { useEffect, useState } from "react";

interface GlitchPopupProps {
  show: boolean;
  message: string;
  onClose: () => void;
  autoClose?: boolean;
  duration?: number;
}

export function GlitchPopup({ 
  show, 
  message, 
  onClose, 
  autoClose = true, 
  duration = 3000 
}: GlitchPopupProps) {
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    if (show && autoClose) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [show, autoClose, duration, onClose]);

  useEffect(() => {
    if (show) {
      const glitchInterval = setInterval(() => {
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 100);
      }, 500);
      return () => clearInterval(glitchInterval);
    }
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -50, rotate: -2 }}
          animate={{ 
            opacity: 1, 
            y: 0,
            rotate: isGlitching ? [0, -2, 2, -1, 0] : 0,
            x: isGlitching ? [0, -5, 5, -2, 0] : 0,
          }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-80"
        >
          <div
            className="border-2 border-[#ff006e] bg-black/95 backdrop-blur-md p-4 relative overflow-hidden"
            style={{
              boxShadow: "0 0 30px #ff006e",
            }}
          >
            {/* Glitch effect overlay */}
            {isGlitching && (
              <>
                <div
                  className="absolute inset-0 opacity-30"
                  style={{
                    background: `repeating-linear-gradient(
                      0deg,
                      #ff006e 0px,
                      transparent 2px,
                      transparent 4px,
                      #00f0ff 6px
                    )`,
                    mixBlendMode: "screen",
                  }}
                />
                <motion.div
                  className="absolute inset-0 bg-[#ff006e]"
                  animate={{ opacity: [0, 0.3, 0] }}
                  transition={{ duration: 0.1 }}
                />
              </>
            )}

            <div className="flex items-start gap-3 relative z-10">
              <motion.div
                animate={{
                  rotate: isGlitching ? [0, 10, -10, 0] : 0,
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  scale: { duration: 2, repeat: Infinity },
                }}
              >
                <AlertTriangle 
                  className="w-6 h-6 text-[#ff006e]" 
                  style={{ filter: "drop-shadow(0 0 10px #ff006e)" }} 
                />
              </motion.div>
              
              <div className="flex-1">
                <h4
                  className="text-xs mb-2"
                  style={{
                    fontFamily: "var(--font-pixel)",
                    color: "#ff006e",
                    textShadow: isGlitching ? "-2px 0 #00f0ff, 2px 0 #ffff00" : "0 0 10px #ff006e",
                  }}
                >
                  ⚠ GLITCH DETECTED ⚠
                </h4>
                <p 
                  className="text-sm text-white/90"
                  style={{
                    textShadow: isGlitching ? "1px 0 #00f0ff, -1px 0 #ff006e" : "none",
                  }}
                >
                  {message}
                </p>
              </div>

              <button
                onClick={onClose}
                className="text-white/50 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Static noise */}
            <div 
              className="absolute inset-0 opacity-5 pointer-events-none mix-blend-overlay"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='5' numOctaves='3' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
