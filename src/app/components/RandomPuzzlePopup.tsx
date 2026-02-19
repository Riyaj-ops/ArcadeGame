import { motion, AnimatePresence } from "motion/react";
import { HelpCircle, X, ShieldAlert, Cpu } from "lucide-react";
import { useState, useEffect } from "react";
import { ArcadeCard } from "./ArcadeCard";
import { NeonButton } from "./NeonButton";

interface Puzzle {
  question: string;
  answer: string;
  type: "riddle" | "code" | "math";
}

const PUZZLES: Puzzle[] = [
  { question: "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?", answer: "ECHO", type: "riddle" },
  { question: "The more of them you take, the more you leave behind. What are they?", answer: "FOOTSTEPS", type: "riddle" },
  { question: "What has keys but no locks, space but no room, and allows you to enter but never leave?", answer: "KEYBOARD", type: "riddle" },
  { question: "Solve: 2^5 + 8 * 2", answer: "48", type: "math" },
  { question: "Binary for 7?", answer: "111", type: "code" },
  { question: "Hex for 255?", answer: "FF", type: "code" },
];

interface RandomPuzzlePopupProps {
  onSolve: () => void;
}

export function RandomPuzzlePopup({ onSolve }: RandomPuzzlePopupProps) {
  const [show, setShow] = useState(false);
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    const triggerRandomly = () => {
      const delay = Math.random() * 30000 + 20000; // Every 20-50 seconds
      return setTimeout(() => {
        setPuzzle(PUZZLES[Math.floor(Math.random() * PUZZLES.length)]);
        setShow(true);
        triggerRandomly();
      }, delay);
    };

    const timer = triggerRandomly();
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = () => {
    if (puzzle && input.toUpperCase() === puzzle.answer.toUpperCase()) {
      setShow(false);
      setInput("");
      setError(false);
      onSolve();
    } else {
      setError(true);
      setTimeout(() => setError(false), 500);
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
          animate={{ 
            opacity: 1, 
            scale: 1, 
            rotate: 0,
            x: error ? [0, -10, 10, -10, 10, 0] : 0 
          }}
          exit={{ opacity: 0, scale: 0.5, rotate: 10 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
        >
          <div className="w-full max-w-md relative">
            <div className="absolute -top-12 left-1/2 -translate-x-1/2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              >
                <HelpCircle className="w-24 h-24 text-[#ffff00] opacity-20" />
              </motion.div>
            </div>

            <ArcadeCard glowColor={error ? "#ff006e" : "#ffff00"}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-[#ffff00]" />
                  <span className="text-xs font-pixel text-[#ffff00]">SYSTEM CHALLENGE</span>
                </div>
                <button onClick={() => setShow(false)} className="text-white/30 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-black/50 border border-[#ffff00]/30 p-4 min-h-24 flex items-center justify-center text-center">
                  <p className="text-sm text-white/90 leading-relaxed italic">
                    "{puzzle?.question}"
                  </p>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your answer..."
                    className="w-full bg-black/80 border-2 border-[#ffff00] p-3 text-center text-[#ffff00] font-pixel focus:outline-none shadow-[0_0_15px_#ffff0033]"
                    onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
                    autoFocus
                  />
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      className="absolute -bottom-6 left-0 right-0 text-center text-[#ff006e] text-[10px] font-pixel"
                    >
                      ACCESS DENIED - TRY AGAIN
                    </motion.div>
                  )}
                </div>

                <div className="flex gap-2 pt-2">
                  <NeonButton variant="yellow" onClick={handleSubmit} className="flex-1 font-pixel text-xs">
                    SOLVE & RESTORE
                  </NeonButton>
                  <div className="w-1/4 flex items-center justify-center opacity-30">
                    <Cpu className="w-6 h-6 text-[#ffff00]" />
                  </div>
                </div>
              </div>

              {/* Decorative scanline */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
                <motion.div
                  className="w-full h-1 bg-[#ffff00]"
                  animate={{ y: [0, 400] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
              </div>
            </ArcadeCard>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
