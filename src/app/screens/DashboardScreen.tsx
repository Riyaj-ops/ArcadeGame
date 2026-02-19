import { useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { GlitchTextEnhanced } from "../components/GlitchTextEnhanced";
import { ChaoticButtonEnhanced } from "../components/ChaoticButtonEnhanced";
import { ArcadeCard } from "../components/ArcadeCard";
import { Gamepad2, Users, Wrench, Activity, Trophy, Lock, Unlock, HelpCircle, Power, ZapOff, Zap } from "lucide-react";
import { useChaos } from "../components/ChaosContext";
import { SnakeGame } from "../games/SnakeGame";
import { GlitchBreaker } from "../games/GlitchBreaker";
import { ChaosMemory } from "../games/ChaosMemory";

interface Game {
  id: number;
  name: string;
  icon: string;
  color: string;
  locked: boolean;
  riddle?: string;
  answer?: string;
  route: string;
  component?: React.ReactNode;
}

const GAMES: Game[] = [
  {
    id: 1,
    name: "Character Control",
    icon: "👾",
    color: "#00f0ff",
    locked: false,
    route: "/characters",
  },
  {
    id: 2,
    name: "Glitch Repair",
    icon: "🔧",
    color: "#ff006e",
    locked: false,
    route: "/repair",
  },
  {
    id: 3,
    name: "System Status",
    icon: "📊",
    color: "#39ff14",
    locked: false,
    route: "/status",
  },
  {
    id: 4,
    name: "Leaderboard",
    icon: "🏆",
    color: "#ffff00",
    locked: false,
    route: "/leaderboard",
  },
  {
    id: 5,
    name: "Snake Chaos",
    icon: "🐍",
    color: "#00ff88",
    locked: false,
    route: "/snake",
    component: <SnakeGame />
  },
  {
    id: 6,
    name: "Glitch Breaker",
    icon: "🎮",
    color: "#ff00ff",
    locked: false,
    route: "/breaker",
    component: <GlitchBreaker />
  },
  {
    id: 7,
    name: "Chaos Memory",
    icon: "🧠",
    color: "#ff8800",
    locked: false,
    route: "/memory",
    component: <ChaosMemory />
  },
];

export function DashboardScreen() {
  const navigate = useNavigate();
  const { isChaosMode, setChaosMode, stability, damageStability, triggerLogoutSequence, setUniverse } = useChaos();
  const [games, setGames] = useState(GAMES);
  const [riddleGame, setRiddleGame] = useState<Game | null>(null);
  const [riddleAnswer, setRiddleAnswer] = useState("");
  const [localLogout, setLocalLogout] = useState(false);
  const [activeGame, setActiveGame] = useState<React.ReactNode | null>(null);

  const handleGameClick = (game: Game) => {
    if (game.locked) {
      setRiddleGame(game);
      setRiddleAnswer("");
    } else if (game.component) {
      // For games with components, show them in modal
      setActiveGame(game.component);
    } else {
      // Map routes to universes for visual "vibe" shifts
      const universeMap: Record<string, any> = {
        "/characters": "HEROS_DUTY",
        "/repair": "FIX_IT",
        "/status": "DEFAULT",
        "/leaderboard": "SUGAR_RUSH"
      };
      setUniverse(universeMap[game.route] || "DEFAULT");
      navigate(game.route);
    }
  };

  const handleRiddleSubmit = () => {
    if (riddleGame && riddleAnswer.toUpperCase() === riddleGame.answer) {
      setGames(games.map(g => g.id === riddleGame.id ? { ...g, locked: false } : g));
      setRiddleGame(null);
      setRiddleAnswer("");
    }
  };

  const handleLogout = () => {
    setLocalLogout(true);
    setChaosMode(true);
    triggerLogoutSequence();
    damageStability(100); // UI begins to drop/collapse

    // Danger blinks on the logout button area
    setTimeout(() => {
      navigate("/");
    }, 2500);
  };

  return (
    <div className="relative min-h-screen p-6 overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1
              className="text-4xl mb-2"
              style={{
                fontFamily: "var(--font-display)",
                textShadow: "0 0 20px #00f0ff",
              }}
            >
              <GlitchTextEnhanced data-text="GAME DASHBOARD">GAME DASHBOARD</GlitchTextEnhanced>
            </h1>
            <p className="text-[#00f0ff]/70 text-sm">Select your mission</p>
          </motion.div>

          {/* Chaos Mode Toggle */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col items-end gap-2"
          >
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-pixel text-white/50 uppercase">Chaos Mode</span>
              <button
                onClick={() => setChaosMode(!isChaosMode)}
                className={`p-2 border-2 transition-all ${isChaosMode ? 'bg-[#ff006e] border-[#ff006e]' : 'bg-transparent border-white/20'}`}
              >
                {isChaosMode ? <Zap className="w-4 h-4 text-white" /> : <ZapOff className="w-4 h-4 text-white/50" />}
              </button>
            </div>

            <div className="relative group">
              {localLogout && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ repeat: Infinity, duration: 0.1 }}
                  className="absolute -inset-2 bg-red-600/30 blur-lg rounded-full"
                />
              )}
              <ChaoticButtonEnhanced
                variant="pink"
                onClick={handleLogout}
                className={`flex items-center gap-2 text-xs relative ${localLogout ? 'animate-pulse' : ''}`}
              >
                <Power className={`w-3 h-3 ${localLogout ? 'text-red-500' : ''}`} />
                {localLogout ? "DANGER: EXITING..." : "LOGOUT"}
              </ChaoticButtonEnhanced>
            </div>
          </motion.div>
        </div>

        {/* Navigation Bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center gap-4 mb-8"
        >
          <ChaoticButtonEnhanced variant="blue" className="flex items-center gap-2">
            <Gamepad2 className="w-4 h-4" />
            DASHBOARD
          </ChaoticButtonEnhanced>
          <ChaoticButtonEnhanced variant="purple" onClick={() => navigate("/characters")} className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            CHARACTERS
          </ChaoticButtonEnhanced>
          <ChaoticButtonEnhanced variant="green" onClick={() => navigate("/repair")} className="flex items-center gap-2">
            <Wrench className="w-4 h-4" />
            REPAIR
          </ChaoticButtonEnhanced>
          <ChaoticButtonEnhanced variant="pink" onClick={() => navigate("/status")} className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            STATUS
          </ChaoticButtonEnhanced>
        </motion.div>

        {/* Game Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {games.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <ArcadeCard glowColor={game.color} className="relative h-full">
                <button
                  onClick={() => handleGameClick(game)}
                  className="w-full text-left space-y-4 relative"
                  disabled={game.locked && !riddleGame}
                >
                  {/* Lock indicator */}
                  {game.locked && (
                    <div className="absolute top-0 right-0">
                      <Lock className="w-6 h-6" style={{ color: game.color }} />
                    </div>
                  )}

                  {/* Icon */}
                  <motion.div
                    className="text-6xl text-center"
                    animate={stability < 30 ? {
                      x: [0, -5, 5, 0],
                      scale: [1, 1.1, 0.9, 1]
                    } : {}}
                    transition={{ repeat: Infinity, duration: 0.15 }}
                  >
                    {game.icon}
                  </motion.div>

                  {/* Name */}
                  <h3
                    className="text-center text-lg"
                    style={{
                      fontFamily: "var(--font-pixel)",
                      color: game.color,
                      textShadow: `0 0 10px ${game.color}`,
                    }}
                  >
                    {game.name}
                  </h3>

                  {/* Status */}
                  <div className="flex items-center justify-center gap-2 text-xs">
                    {game.locked ? (
                      <>
                        <Lock className="w-3 h-3 text-[#ff006e]" />
                        <span className="text-[#ff006e]">SOLVE RIDDLE</span>
                      </>
                    ) : (
                      <>
                        <Unlock className="w-3 h-3 text-[#39ff14]" />
                        <span className="text-[#39ff14]">UNLOCKED</span>
                      </>
                    )}
                  </div>
                </button>
              </ArcadeCard>
            </motion.div>
          ))}
        </div>

        {/* Stats Summary */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-4 gap-4"
        >
          {[
            { label: "SYSTEM STABILITY", value: `${Math.round(stability)}%`, icon: Activity, color: stability < 40 ? "#ff006e" : "#00f0ff" },
            { label: "LOCKED GAMES", value: games.filter(g => g.locked).length, icon: Lock, color: "#ff006e" },
            { label: "CHARACTER SYNC", value: "98.2%", icon: Users, color: "#39ff14" },
            { label: "ACHIEVEMENTS", value: 12, icon: Trophy, color: "#ffff00" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="border-2 bg-black/60 backdrop-blur-md p-4"
              style={{
                borderColor: stat.color,
                boxShadow: `0 0 10px ${stat.color}44`,
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
                <span className="text-xs text-white/50">{stat.label}</span>
              </div>
              <div
                className="text-2xl"
                style={{
                  fontFamily: "var(--font-pixel)",
                  color: stat.color,
                  textShadow: `0 0 10px ${stat.color}`,
                }}
              >
                {stat.value}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Riddle Modal */}
      <AnimatePresence>
        {riddleGame && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setRiddleGame(null)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md"
            >
              <ArcadeCard glowColor={riddleGame.color}>
                <div className="text-center mb-6">
                  <HelpCircle
                    className="w-16 h-16 mx-auto mb-4"
                    style={{
                      color: riddleGame.color,
                      filter: `drop-shadow(0 0 20px ${riddleGame.color})`,
                    }}
                  />
                  <h2
                    className="text-2xl mb-2"
                    style={{
                      fontFamily: "var(--font-pixel)",
                      color: riddleGame.color,
                    }}
                  >
                    RIDDLE PUZZLE
                  </h2>
                  <p className="text-sm text-white/70">Solve to unlock {riddleGame.name}</p>
                </div>

                <div className="mb-6">
                  <div className="border-2 border-[#bf40bf] bg-black/50 p-4 mb-4">
                    <p className="text-[#bf40bf] text-center">{riddleGame.riddle}</p>
                  </div>

                  <input
                    type="text"
                    value={riddleAnswer}
                    onChange={(e) => setRiddleAnswer(e.target.value.toUpperCase())}
                    placeholder="Enter answer..."
                    className="w-full bg-black/50 border-2 border-[#00f0ff] text-[#00f0ff] text-center p-3 
                      focus:outline-none focus:border-[#00f0ff] focus:shadow-[0_0_20px_#00f0ff]"
                    style={{ fontFamily: "var(--font-pixel)" }}
                    onKeyPress={(e) => e.key === "Enter" && handleRiddleSubmit()}
                  />
                </div>

                <div className="flex gap-2">
                  <ChaoticButtonEnhanced onClick={handleRiddleSubmit} variant="blue" className="flex-1">
                    SUBMIT
                  </ChaoticButtonEnhanced>
                  <ChaoticButtonEnhanced onClick={() => setRiddleGame(null)} variant="pink" className="flex-1">
                    CANCEL
                  </ChaoticButtonEnhanced>
                </div>
              </ArcadeCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logout Overlay */}
      <AnimatePresence>
        {localLogout && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[1001] bg-black flex flex-col items-center justify-center gap-8"
          >
            <motion.div
              animate={{
                scale: [1, 2, 1, 3],
                opacity: [1, 0.5, 1, 0],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ duration: 3 }}
              className="text-6xl font-pixel text-[#ff006e]"
            >
              ⚠ SYSTEM COLLAPSE ⚠
            </motion.div>
            <div className="w-64 h-2 bg-white/10 relative overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-[#ff006e]"
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 3 }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
