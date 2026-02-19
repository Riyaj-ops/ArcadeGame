import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { GlitchText } from "../components/GlitchText";
import { NeonButton } from "../components/NeonButton";
import { ArcadeCard } from "../components/ArcadeCard";
import { CRTOverlay } from "../components/CRTOverlay";
import { PixelBackground } from "../components/PixelBackground";
import { Trophy, Medal, Crown, ArrowLeft, Zap, Star } from "lucide-react";

interface Player {
  id: number;
  name: string;
  score: number;
  universe: string;
  badge: string;
  isCurrentUser?: boolean;
}

const PLAYERS: Player[] = [
  { id: 1, name: "RALPH", score: 99999, universe: "Fix-It Felix Jr.", badge: "🔨", isCurrentUser: false },
  { id: 2, name: "VANELLOPE", score: 88888, universe: "Sugar Rush", badge: "🍬", isCurrentUser: false },
  { id: 3, name: "FELIX", score: 77777, universe: "Fix-It Felix Jr.", badge: "🔧", isCurrentUser: true },
  { id: 4, name: "CALHOUN", score: 66666, universe: "Hero's Duty", badge: "⚔️", isCurrentUser: false },
  { id: 5, name: "TURBO", score: 55555, universe: "Sugar Rush", badge: "🏁", isCurrentUser: false },
  { id: 6, name: "GENE", score: 44444, universe: "Fix-It Felix Jr.", badge: "👔", isCurrentUser: false },
  { id: 7, name: "TAFFYTA", score: 33333, universe: "Sugar Rush", badge: "🍓", isCurrentUser: false },
  { id: 8, name: "KING CANDY", score: 22222, universe: "Sugar Rush", badge: "👑", isCurrentUser: false },
  { id: 9, name: "SOUR BILL", score: 11111, universe: "Sugar Rush", badge: "🍋", isCurrentUser: false },
  { id: 10, name: "MARKOWSKI", score: 10000, universe: "Hero's Duty", badge: "🎖️", isCurrentUser: false },
];

export function LeaderboardScreen() {
  const navigate = useNavigate();
  const [players, setPlayers] = useState(PLAYERS);
  const [animatingScores, setAnimatingScores] = useState<Record<number, number>>({});

  useEffect(() => {
    // Animate scores counting up
    const initial: Record<number, number> = {};
    players.forEach(p => {
      initial[p.id] = 0;
    });
    setAnimatingScores(initial);

    players.forEach(player => {
      const duration = 2000;
      const steps = 60;
      const increment = player.score / steps;
      let current = 0;
      let step = 0;

      const interval = setInterval(() => {
        step++;
        current += increment;
        if (step >= steps) {
          current = player.score;
          clearInterval(interval);
        }
        setAnimatingScores(prev => ({ ...prev, [player.id]: Math.round(current) }));
      }, duration / steps);
    });
  }, []);

  const getRankColor = (rank: number) => {
    if (rank === 1) return "#ffff00"; // Gold
    if (rank === 2) return "#00f0ff"; // Silver/Cyan
    if (rank === 3) return "#ff006e"; // Bronze/Pink
    return "#bf40bf"; // Purple for others
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return Crown;
    if (rank === 2) return Trophy;
    if (rank === 3) return Medal;
    return Star;
  };

  return (
    <div className="relative min-h-screen p-6 overflow-hidden">
      <PixelBackground />
      <CRTOverlay />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <NeonButton variant="blue" onClick={() => navigate("/dashboard")} className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              BACK
            </NeonButton>
            <h1
              className="text-4xl"
              style={{
                fontFamily: "var(--font-pixel)",
                textShadow: "0 0 20px #ffff00",
              }}
            >
              <GlitchText>LEADERBOARD</GlitchText>
            </h1>
            <div className="w-24" />
          </div>
          <p className="text-center text-[#ffff00]/70 text-sm">Top players across all universes</p>
        </motion.div>

        {/* Top 3 Podium */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {/* 2nd Place */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="pt-12"
          >
            <ArcadeCard glowColor={getRankColor(2)}>
              <div className="text-center">
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: 0.2,
                  }}
                >
                  <Trophy className="w-12 h-12 mx-auto mb-2" style={{ color: getRankColor(2) }} />
                </motion.div>
                <div className="text-4xl mb-2">{players[1].badge}</div>
                <h3
                  className="text-xl mb-1"
                  style={{
                    fontFamily: "var(--font-pixel)",
                    color: getRankColor(2),
                  }}
                >
                  {players[1].name}
                </h3>
                <p className="text-xs text-white/50 mb-2">{players[1].universe}</p>
                <motion.p
                  className="text-2xl"
                  style={{
                    fontFamily: "var(--font-pixel)",
                    color: getRankColor(2),
                    textShadow: `0 0 10px ${getRankColor(2)}`,
                  }}
                >
                  {animatingScores[players[1].id]?.toLocaleString() || 0}
                </motion.p>
                <div className="mt-2 text-lg" style={{ color: getRankColor(2) }}>2ND</div>
              </div>
            </ArcadeCard>
          </motion.div>

          {/* 1st Place */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0 }}
          >
            <ArcadeCard glowColor={getRankColor(1)}>
              <div className="text-center">
                <motion.div
                  animate={{
                    y: [0, -15, 0],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                >
                  <Crown className="w-16 h-16 mx-auto mb-2" style={{ color: getRankColor(1) }} />
                </motion.div>
                <div className="text-5xl mb-2">{players[0].badge}</div>
                <h3
                  className="text-2xl mb-1"
                  style={{
                    fontFamily: "var(--font-pixel)",
                    color: getRankColor(1),
                    textShadow: `0 0 20px ${getRankColor(1)}`,
                  }}
                >
                  {players[0].name}
                </h3>
                <p className="text-xs text-white/50 mb-2">{players[0].universe}</p>
                <motion.p
                  className="text-3xl"
                  style={{
                    fontFamily: "var(--font-pixel)",
                    color: getRankColor(1),
                    textShadow: `0 0 15px ${getRankColor(1)}`,
                  }}
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                  }}
                >
                  {animatingScores[players[0].id]?.toLocaleString() || 0}
                </motion.p>
                <div className="mt-2 text-2xl" style={{ color: getRankColor(1) }}>👑 1ST 👑</div>
              </div>
            </ArcadeCard>
          </motion.div>

          {/* 3rd Place */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="pt-12"
          >
            <ArcadeCard glowColor={getRankColor(3)}>
              <div className="text-center">
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: 0.4,
                  }}
                >
                  <Medal className="w-12 h-12 mx-auto mb-2" style={{ color: getRankColor(3) }} />
                </motion.div>
                <div className="text-4xl mb-2">{players[2].badge}</div>
                <h3
                  className="text-xl mb-1"
                  style={{
                    fontFamily: "var(--font-pixel)",
                    color: getRankColor(3),
                  }}
                >
                  {players[2].name}
                </h3>
                <p className="text-xs text-white/50 mb-2">{players[2].universe}</p>
                <motion.p
                  className="text-2xl"
                  style={{
                    fontFamily: "var(--font-pixel)",
                    color: getRankColor(3),
                    textShadow: `0 0 10px ${getRankColor(3)}`,
                  }}
                >
                  {animatingScores[players[2].id]?.toLocaleString() || 0}
                </motion.p>
                <div className="mt-2 text-lg" style={{ color: getRankColor(3) }}>3RD</div>
              </div>
            </ArcadeCard>
          </motion.div>
        </div>

        {/* Full Rankings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <ArcadeCard glowColor="#00f0ff">
            <h3 className="text-lg mb-4" style={{ fontFamily: "var(--font-pixel)", color: "#00f0ff" }}>
              FULL RANKINGS
            </h3>
            <div className="space-y-2">
              <AnimatePresence>
                {players.map((player, index) => {
                  const RankIcon = getRankIcon(index + 1);
                  return (
                    <motion.div
                      key={player.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex items-center gap-4 p-3 border-2 bg-black/50 ${
                        player.isCurrentUser ? "border-[#39ff14] bg-[#39ff14]/10" : "border-white/20"
                      }`}
                      style={{
                        boxShadow: player.isCurrentUser ? "0 0 20px #39ff14" : "none",
                      }}
                      whileHover={{
                        scale: 1.02,
                        boxShadow: `0 0 20px ${getRankColor(index + 1)}44`,
                      }}
                    >
                      {/* Rank */}
                      <div
                        className="flex items-center justify-center w-12 h-12 border-2"
                        style={{
                          borderColor: getRankColor(index + 1),
                          backgroundColor: `${getRankColor(index + 1)}22`,
                        }}
                      >
                        <RankIcon className="w-6 h-6" style={{ color: getRankColor(index + 1) }} />
                      </div>

                      {/* Badge */}
                      <div className="text-3xl">{player.badge}</div>

                      {/* Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4
                            className="text-lg"
                            style={{
                              fontFamily: "var(--font-pixel)",
                              color: player.isCurrentUser ? "#39ff14" : getRankColor(index + 1),
                            }}
                          >
                            {player.name}
                          </h4>
                          {player.isCurrentUser && (
                            <motion.span
                              className="text-xs px-2 py-1 border border-[#39ff14] bg-[#39ff14]/20 text-[#39ff14]"
                              animate={{
                                opacity: [1, 0.7, 1],
                              }}
                              transition={{
                                duration: 1.5,
                                repeat: Infinity,
                              }}
                            >
                              YOU
                            </motion.span>
                          )}
                        </div>
                        <p className="text-xs text-white/50">{player.universe}</p>
                      </div>

                      {/* Score */}
                      <div className="text-right">
                        <motion.p
                          className="text-2xl"
                          style={{
                            fontFamily: "var(--font-pixel)",
                            color: getRankColor(index + 1),
                            textShadow: `0 0 10px ${getRankColor(index + 1)}`,
                          }}
                        >
                          {animatingScores[player.id]?.toLocaleString() || 0}
                        </motion.p>
                        <div className="flex items-center justify-end gap-1 mt-1">
                          <Zap className="w-3 h-3 text-[#ffff00]" />
                          <span className="text-xs text-white/50">PTS</span>
                        </div>
                      </div>

                      {/* Rank number */}
                      <div
                        className="text-3xl opacity-50"
                        style={{
                          fontFamily: "var(--font-pixel)",
                          color: getRankColor(index + 1),
                        }}
                      >
                        #{index + 1}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </ArcadeCard>
        </motion.div>

        {/* Stats Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-4 gap-4 mt-6"
        >
          {[
            { label: "TOTAL PLAYERS", value: players.length, color: "#00f0ff" },
            { label: "TOP SCORE", value: players[0].score.toLocaleString(), color: "#ffff00" },
            { label: "YOUR RANK", value: "#3", color: "#39ff14" },
            { label: "YOUR SCORE", value: players[2].score.toLocaleString(), color: "#ff006e" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.1 }}
              className="border-2 bg-black/60 backdrop-blur-md p-3 text-center"
              style={{
                borderColor: stat.color,
                boxShadow: `0 0 10px ${stat.color}44`,
              }}
            >
              <p className="text-xs text-white/50 mb-1">{stat.label}</p>
              <p
                className="text-xl"
                style={{
                  fontFamily: "var(--font-pixel)",
                  color: stat.color,
                  textShadow: `0 0 10px ${stat.color}`,
                }}
              >
                {stat.value}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
