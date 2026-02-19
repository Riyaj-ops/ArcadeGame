import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Terminal, X, Zap } from "lucide-react";
import { NeonButton } from "./NeonButton";

interface CheatConsoleProps {
  show: boolean;
  onClose: () => void;
}

const CHEAT_CODES = [
  { code: "GODMODE", effect: "Invincibility activated" },
  { code: "MAXPOWER", effect: "All stats maxed out" },
  { code: "UNLOCKALL", effect: "All levels unlocked" },
  { code: "NOCLIP", effect: "No collision mode enabled" },
  { code: "SPEEDRUN", effect: "2x speed activated" },
];

export function CheatConsole({ show, onClose }: CheatConsoleProps) {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState<string[]>(["Cheat console initialized...", "Type a cheat code or 'HELP' for list"]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = input.toUpperCase().trim();
    
    setOutput(prev => [...prev, `> ${code}`]);

    if (code === "HELP") {
      setOutput(prev => [
        ...prev,
        "Available cheat codes:",
        ...CHEAT_CODES.map(c => `  ${c.code} - ${c.effect}`),
      ]);
    } else {
      const cheat = CHEAT_CODES.find(c => c.code === code);
      if (cheat) {
        setOutput(prev => [...prev, `✓ ${cheat.effect}`, ""]);
      } else {
        setOutput(prev => [...prev, `✗ Invalid cheat code. Type HELP for list.`, ""]);
      }
    }

    setInput("");
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl border-2 border-[#39ff14] bg-black/95 backdrop-blur-md p-6"
            style={{
              boxShadow: "0 0 30px #39ff14",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#39ff14]/30">
              <div className="flex items-center gap-2">
                <Terminal className="w-6 h-6 text-[#39ff14]" />
                <h3
                  className="text-xl"
                  style={{
                    fontFamily: "var(--font-pixel)",
                    color: "#39ff14",
                    textShadow: "0 0 10px #39ff14",
                  }}
                >
                  CHEAT CONSOLE
                </h3>
              </div>
              <button
                onClick={onClose}
                className="text-[#ff006e] hover:text-[#ff006e]/70 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Output Terminal */}
            <div
              className="bg-black border-2 border-[#39ff14]/50 p-4 mb-4 h-64 overflow-y-auto font-mono text-sm"
              style={{
                boxShadow: "inset 0 0 20px #39ff1422",
              }}
            >
              {output.map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`text-[#39ff14] mb-1 ${line.startsWith('>') ? 'text-[#00f0ff]' : ''} ${line.startsWith('✓') ? 'text-[#39ff14]' : ''} ${line.startsWith('✗') ? 'text-[#ff006e]' : ''}`}
                >
                  {line}
                </motion.div>
              ))}
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="inline-block w-2 h-4 bg-[#39ff14] ml-1"
              />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter cheat code..."
                className="flex-1 bg-black/50 border-2 border-[#39ff14] text-[#39ff14] px-4 py-2 
                  focus:outline-none focus:border-[#39ff14] focus:shadow-[0_0_20px_#39ff14] font-mono"
                autoFocus
              />
              <NeonButton variant="green" className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                EXECUTE
              </NeonButton>
            </form>

            {/* Hint */}
            <motion.p
              className="text-xs text-center text-white/30 mt-4"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Press ESC to close • Type HELP for available codes
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
