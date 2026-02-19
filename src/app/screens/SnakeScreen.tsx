import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { GlitchText } from "../components/GlitchText";
import { ChaoticButton } from "../components/ChaoticButton";
import { ArcadeCard } from "../components/ArcadeCard";
import { Gamepad2, Trophy, Zap, AlertTriangle } from "lucide-react";
import { useChaos } from "../components/ChaosContext";

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";
type Position = { x: number; y: number };

const GRID_SIZE = 15;
const UNIVERSES = [
  { id: 1, name: "Fix-It Felix Jr.", color: "#ffff00", icon: "🔨" },
  { id: 2, name: "Sugar Rush", color: "#ff006e", icon: "🍬" },
  { id: 3, name: "Hero's Duty", color: "#39ff14", icon: "⚔️" },
  { id: 4, name: "Fix-It Nexus", color: "#00f0ff", icon: "🤜" },
];

export function SnakeScreen() {
  const navigate = useNavigate();
  const { stability, repairStability, setUniverse } = useChaos();
  const [snake, setSnake] = useState<Position[]>([{ x: 7, y: 7 }]);
  const [direction, setDirection] = useState<Direction>("RIGHT");
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    setUniverse("SUGAR_RUSH");
  }, [setUniverse]);

  const currentUniverse = UNIVERSES[score % UNIVERSES.length];

  const moveSnake = useCallback(() => {
    if (!gameStarted || gameOver) return;

    setSnake(prev => {
      const head = prev[0];
      let newHead: Position;

      switch (direction) {
        case "UP": newHead = { x: head.x, y: head.y - 1 }; break;
        case "DOWN": newHead = { x: head.x, y: head.y + 1 }; break;
        case "LEFT": newHead = { x: head.x - 1, y: head.y }; break;
        case "RIGHT": newHead = { x: head.x + 1, y: head.y }; break;
        default: newHead = head;
      }

      // Wrap around
      newHead.x = (newHead.x + GRID_SIZE) % GRID_SIZE;
      newHead.y = (newHead.y + GRID_SIZE) % GRID_SIZE;

      // Self collision
      if (prev.some(seg => seg.x === newHead.x && seg.y === newHead.y)) {
        setGameOver(true);
        return prev;
      }

      // Check if collected universe
      if (newHead.x === currentUniverse.id * 3 % GRID_SIZE && newHead.y === currentUniverse.id * 3 % GRID_SIZE) {
        setScore(prev => prev + 1);
        repairStability(2);
        return [newHead, ...prev]; // Grow snake
      }

      return [newHead, ...prev.slice(0, -1)];
    });
  }, [direction, gameStarted, gameOver, currentUniverse, repairStability]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameStarted && !gameOver) {
        if (e.key === " ") setGameStarted(true);
        return;
      }

      if (gameOver) return;

      switch (e.key) {
        case "ArrowUp": if (direction !== "DOWN") setDirection("UP"); break;
        case "ArrowDown": if (direction !== "UP") setDirection("DOWN"); break;
        case "ArrowLeft": if (direction !== "RIGHT") setDirection("LEFT"); break;
        case "ArrowRight": if (direction !== "LEFT") setDirection("RIGHT"); break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [direction, gameStarted, gameOver]);

  useEffect(() => {
    const speed = Math.max(80, 150 - score * 5);
    const interval = setInterval(moveSnake, speed);
    return () => clearInterval(interval);
  }, [moveSnake, score]);

  const handleRestart = () => {
    setSnake([{ x: 7, y: 7 }]);
    setDirection("RIGHT");
    setScore(0);
    setGameOver(false);
    setGameStarted(true);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden">
      <div className="relative z-10 w-full max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl mb-2 font-pixel text-[#00f0ff] shadow-[#00f0ff] drop-shadow-[0_0_15px_rgba(0,240,255,0.5)]">
            <GlitchText glitchIntensity={stability < 40 ? "high" : "low"}>UNIVERSE_HARVESTER</GlitchText>
          </h1>
          <p className="text-[10px] font-pixel text-[#00f0ff]/50 uppercase tracking-widest">Gather fragments to stabilize the multiverse</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Game Area */}
          <div className="lg:col-span-2">
            <ArcadeCard glowColor="#00f0ff" className="relative p-2 bg-black/40 backdrop-blur-xl">
              {/* Game Grid */}
              <div
                className="relative bg-black border-2 border-[#00f0ff]/20 mx-auto overflow-hidden shadow-[inset_0_0_100px_rgba(0,240,255,0.05)]"
                style={{
                  width: GRID_SIZE * 30,
                  height: GRID_SIZE * 30,
                  backgroundImage: `radial-gradient(#00f0ff11 1px, transparent 1px)`,
                  backgroundSize: "30px 30px",
                }}
              >
                {/* Start prompt */}
                <AnimatePresence>
                  {!gameStarted && !gameOver && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 flex items-center justify-center bg-black/80 z-20"
                    >
                      <div className="text-center space-y-4">
                        <Zap className="w-16 h-16 text-[#ffff00] mx-auto animate-pulse" />
                        <p className="text-[#ffff00] font-pixel text-xl">BOOT_SEQUENCE_READY</p>
                        <ChaoticButton variant="green" onClick={() => setGameStarted(true)}>START_SYNC</ChaoticButton>
                      </div>
                    </motion.div>
                  )}

                  {gameOver && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute inset-0 flex items-center justify-center bg-black/90 z-30 border-4 border-red-500/50"
                    >
                      <div className="text-center space-y-6 p-8">
                        <AlertTriangle className="w-20 h-20 text-red-500 mx-auto" />
                        <h2 className="text-3xl font-pixel text-red-500">SYNC_COLLAPSE</h2>
                        <div className="space-y-2">
                          <p className="text-xs font-pixel text-white/50">FINAL_YIELD: {score}</p>
                          <ChaoticButton variant="blue" onClick={handleRestart} className="w-full">RE-ESTABLISH</ChaoticButton>
                          <ChaoticButton variant="pink" onClick={() => navigate("/dashboard")} className="w-full">ABANDON</ChaoticButton>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Snake */}
                {snake.map((segment, i) => (
                  <motion.div
                    key={i}
                    className="absolute"
                    style={{
                      left: segment.x * 30,
                      top: segment.y * 30,
                      width: 28,
                      height: 28,
                      margin: 1,
                    }}
                    animate={{
                      scale: [1, 1.05, 1],
                      rotate: stability < 30 ? [0, i % 2 === 0 ? 5 : -5, 0] : 0
                    }}
                    transition={{ repeat: Infinity, duration: 0.2 }}
                  >
                    <div
                      className="w-full h-full"
                      style={{
                        backgroundColor: i === 0 ? "#00f0ff" : "#00f0ff44",
                        border: `1px solid #00f0ff`,
                        boxShadow: i === 0 ? "0 0 15px #00f0ff" : "none",
                      }}
                    />
                  </motion.div>
                ))}

                {/* Target Universe */}
                <motion.div
                  className="absolute flex items-center justify-center text-2xl"
                  style={{
                    left: (currentUniverse.id * 3 % GRID_SIZE) * 30,
                    top: (currentUniverse.id * 3 % GRID_SIZE) * 30,
                    width: 30,
                    height: 30,
                  }}
                  animate={{
                    scale: [1, 1.4, 1],
                    rotate: [0, 90, 180, 270, 360],
                    filter: stability < 40 ? "hue-rotate(90deg) blur(1px)" : "none"
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-white/20 blur-md rounded-full animate-pulse" />
                    <span className="relative z-10">{currentUniverse.icon}</span>
                  </div>
                </motion.div>
              </div>

              {/* HUD */}
              <div className="mt-4 flex justify-between items-center px-4 font-pixel text-[10px]">
                <div className="flex items-center gap-4">
                  <span className="text-white/30 uppercase">Stabilization_Rate</span>
                  <div className="w-32 h-1 bg-white/5 border border-white/10">
                    <motion.div className="h-full bg-[#00f0ff]" animate={{ width: `${stability}%` }} />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[#ffff00]">
                  <Trophy className="w-3 h-3" />
                  YIELD: {score}
                </div>
              </div>
            </ArcadeCard>
          </div>

          {/* Controls & Status */}
          <div className="space-y-6">
            <ArcadeCard glowColor={currentUniverse.color}>
              <h3 className="text-[10px] font-pixel text-white/30 mb-4 uppercase text-center">Active_Scanning</h3>
              <div className="text-center space-y-4">
                <motion.div
                  className="text-6xl mx-auto"
                  animate={{ y: [0, -10, 0], scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  {currentUniverse.icon}
                </motion.div>
                <div>
                  <h4 className="font-pixel text-lg" style={{ color: currentUniverse.color }}>{currentUniverse.name}</h4>
                  <p className="text-[8px] font-pixel text-white/40 uppercase">Target_ID: 0x{currentUniverse.id}FF</p>
                </div>
              </div>
            </ArcadeCard>

            <ArcadeCard glowColor="#39ff14">
              <h3 className="text-[10px] font-pixel text-white/30 mb-4 uppercase">Sync_Logs</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                {UNIVERSES.slice(0, score).reverse().map((uni, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-2 border border-white/5 bg-white/5"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{uni.icon}</span>
                      <span className="text-[8px] font-pixel text-white/70">{uni.name}</span>
                    </div>
                    <span className="text-[8px] font-pixel text-[#39ff14]">STABILIZED</span>
                  </motion.div>
                ))}
              </div>
            </ArcadeCard>

            <div className="grid grid-cols-2 gap-2">
              <ChaoticButton variant="blue" onClick={() => navigate("/dashboard")}>EXIT</ChaoticButton>
              <ChaoticButton variant="pink" onClick={() => setGameOver(true)}>ABORT</ChaoticButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
