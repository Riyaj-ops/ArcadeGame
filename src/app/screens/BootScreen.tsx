import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { TerminalWindow } from "../components/TerminalWindow";
import { CRTOverlay } from "../components/CRTOverlay";
import { PixelBackground } from "../components/PixelBackground";
import { GlitchText } from "../components/GlitchText";
import { AlertTriangle, Zap } from "lucide-react";

const bootMessages = [
  "Initializing ARCADE MULTIVERSE OS...",
  "Loading pixel core systems...",
  "Detecting connected universes...",
  "Fix-It Felix Jr. universe [ONLINE]",
  "Sugar Rush universe [ONLINE]",
  "Hero's Duty universe [ONLINE]",
  "Loading character databases...",
  "Ralph: Status [ACTIVE]",
  "Vanellope: Status [ACTIVE]",
  "Felix: Status [ACTIVE]",
  "Scanning for glitches...",
  "⚠ WARNING: Minor instability detected",
  "⚠ WARNING: Glitch anomalies in sector 7",
  "Stabilizing reality matrices...",
  "Power-up systems [ONLINE]",
  "Game mechanics [ONLINE]",
  "Leaderboard synchronization [COMPLETE]",
  "System ready. Transferring to universe selection...",
];

export function BootScreen() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => navigate("/snake"), 500);
          return 100;
        }
        return prev + 100 / bootMessages.length;
      });
    }, 200);

    // Show warning at 50%
    const warningTimeout = setTimeout(() => {
      setShowWarning(true);
    }, (bootMessages.length / 2) * 200);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(warningTimeout);
    };
  }, [navigate]);

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
      <PixelBackground />
      <CRTOverlay />

      <div className="relative z-10 w-full max-w-4xl space-y-6">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 
            className="text-3xl text-[#00f0ff] mb-2"
            style={{ 
              fontFamily: "var(--font-pixel)",
              textShadow: "0 0 20px #00f0ff",
            }}
          >
            <GlitchText>SYSTEM BOOT</GlitchText>
          </h1>
          <div className="flex items-center justify-center gap-2 text-sm text-[#00f0ff]/70">
            <Zap className="w-4 h-4" />
            <span>Initializing Multiverse...</span>
            <Zap className="w-4 h-4" />
          </div>
        </motion.div>

        {/* Terminal */}
        <TerminalWindow lines={bootMessages} autoScroll={true} />

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="space-y-2"
        >
          <div className="flex justify-between text-sm text-[#00f0ff]">
            <span>LOADING...</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-4 border-2 border-[#00f0ff] bg-black/50 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#00f0ff] to-[#bf40bf]"
              style={{
                width: `${progress}%`,
                boxShadow: "0 0 20px #00f0ff",
              }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
            />
          </div>
          
          {/* Progress indicator pixels */}
          <div className="flex gap-1">
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="flex-1 h-2 border border-[#00f0ff]/30 bg-black/50"
                animate={{
                  backgroundColor: progress > (i * 5) ? "#00f0ff" : "rgba(0, 0, 0, 0.5)",
                  boxShadow: progress > (i * 5) ? "0 0 5px #00f0ff" : "none",
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* Warning Panel */}
        {showWarning && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="border-2 border-[#ff006e] bg-black/80 p-4"
            style={{
              boxShadow: "0 0 20px #ff006e44",
            }}
          >
            <div className="flex items-start gap-3">
              <motion.div
                animate={{
                  opacity: [1, 0.5, 1],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                }}
              >
                <AlertTriangle className="w-6 h-6 text-[#ff006e]" />
              </motion.div>
              <div className="flex-1">
                <h3 className="text-[#ff006e] mb-1" style={{ fontFamily: "var(--font-pixel)" }}>
                  SYSTEM WARNING
                </h3>
                <p className="text-sm text-[#ff006e]/80">
                  Glitch anomalies detected in multiple sectors. Reality stabilizers may be required.
                  Character systems showing minor instability. Proceeding with caution...
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Status Indicators */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "CORE", status: "ONLINE", color: "#39ff14" },
            { label: "NETWORK", status: "SYNC", color: "#00f0ff" },
            { label: "SECURITY", status: "ACTIVE", color: "#ffff00" },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="border border-white/20 bg-black/50 p-3 text-center"
            >
              <div className="text-xs text-white/50 mb-1">{item.label}</div>
              <motion.div
                className="text-sm"
                style={{ 
                  color: item.color,
                  textShadow: `0 0 10px ${item.color}`,
                }}
                animate={{
                  opacity: [1, 0.7, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              >
                {item.status}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
