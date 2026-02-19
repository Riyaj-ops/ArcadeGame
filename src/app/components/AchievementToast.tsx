import { motion, AnimatePresence } from "motion/react";
import { X, Trophy, Star } from "lucide-react";

interface AchievementToastProps {
  show: boolean;
  title: string;
  description: string;
  onClose: () => void;
}

export function AchievementToast({ show, title, description, onClose }: AchievementToastProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          className="fixed top-4 right-4 z-50 w-80"
        >
          <div
            className="border-2 border-[#ffff00] bg-black/90 backdrop-blur-md p-4"
            style={{
              boxShadow: "0 0 30px #ffff0088",
            }}
          >
            <div className="flex items-start gap-3">
              <motion.div
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              >
                <Trophy className="w-8 h-8 text-[#ffff00]" style={{ filter: "drop-shadow(0 0 10px #ffff00)" }} />
              </motion.div>
              
              <div className="flex-1">
                <h4
                  className="text-sm mb-1"
                  style={{
                    fontFamily: "var(--font-pixel)",
                    color: "#ffff00",
                    textShadow: "0 0 10px #ffff00",
                  }}
                >
                  ACHIEVEMENT UNLOCKED!
                </h4>
                <p className="text-[#ffff00] mb-1">{title}</p>
                <p className="text-xs text-white/70">{description}</p>
              </div>

              <button
                onClick={onClose}
                className="text-white/50 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Sparkles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {Array.from({ length: 5 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.3,
                  }}
                >
                  <Star className="w-3 h-3 text-[#ffff00]" />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
