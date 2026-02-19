import { motion } from "motion/react";
import { ReactNode, useEffect, useState } from "react";

interface TerminalWindowProps {
  children?: ReactNode;
  lines?: string[];
  className?: string;
  autoScroll?: boolean;
}

export function TerminalWindow({ children, lines = [], className = "", autoScroll = true }: TerminalWindowProps) {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (lines.length > 0 && currentIndex < lines.length && autoScroll) {
      const timer = setTimeout(() => {
        setDisplayedLines(prev => [...prev, lines[currentIndex]]);
        setCurrentIndex(prev => prev + 1);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, lines, autoScroll]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative border-2 border-[#39ff14] bg-black/90 backdrop-blur-sm p-4 font-mono text-sm ${className}`}
      style={{
        boxShadow: "0 0 20px #39ff1444, inset 0 0 20px #39ff1411",
      }}
    >
      {/* Terminal header */}
      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#39ff14]/30">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#ff006e]" style={{ boxShadow: "0 0 5px #ff006e" }} />
          <div className="w-3 h-3 rounded-full bg-[#ffff00]" style={{ boxShadow: "0 0 5px #ffff00" }} />
          <div className="w-3 h-3 rounded-full bg-[#39ff14]" style={{ boxShadow: "0 0 5px #39ff14" }} />
        </div>
        <span className="text-[#39ff14] text-xs">ARCADE_TERMINAL_v2.0</span>
      </div>

      {/* Terminal content */}
      <div className="text-[#39ff14] space-y-1">
        {autoScroll && lines.length > 0 ? (
          displayedLines.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-start gap-2"
            >
              <span className="text-[#00f0ff]">{'>'}</span>
              <span>{line}</span>
            </motion.div>
          ))
        ) : children}
        
        {/* Blinking cursor */}
        {autoScroll && currentIndex >= lines.length && (
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="inline-block w-2 h-4 bg-[#39ff14] ml-1"
          />
        )}
      </div>
    </motion.div>
  );
}
