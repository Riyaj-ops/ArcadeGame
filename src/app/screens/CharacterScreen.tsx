import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { GlitchTextEnhanced } from "../components/GlitchTextEnhanced";
import { ChaoticButtonEnhanced } from "../components/ChaoticButtonEnhanced";
import { ArcadeCard } from "../components/ArcadeCard";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Heart, Zap, Shield, ArrowLeft, Info, Star } from "lucide-react";
import { useChaos } from "../components/ChaosContext";

interface Character {
  id: number;
  name: string;
  universe: string;
  health: number;
  power: number;
  defense: number;
  color: string;
  status: "active" | "resting" | "critical";
  ability: string;
  quote: string;
  image: string;
  pixelIcon: string;
}

const CHARACTERS: Character[] = [
  {
    id: 1,
    name: "Ralph",
    universe: "Fix-It Felix Jr.",
    health: 95,
    power: 85,
    defense: 70,
    color: "#ff006e",
    status: "active",
    ability: "Wreck-It Smash",
    quote: "I'm gonna wreck it!",
    image: "https://images.unsplash.com/photo-1613992519026-c1a3bb8341ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    pixelIcon: "🤜",
  },
  {
    id: 2,
    name: "Vanellope",
    universe: "Sugar Rush",
    health: 88,
    power: 92,
    defense: 65,
    color: "#00f0ff",
    status: "active",
    ability: "Glitch Teleport",
    quote: "I'm a racer!",
    image: "https://images.unsplash.com/photo-1765448857057-2aaccd430d2f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    pixelIcon: "🍬",
  },
  {
    id: 3,
    name: "Felix",
    universe: "Fix-It Felix Jr.",
    health: 92,
    power: 75,
    defense: 90,
    color: "#ffff00",
    status: "active",
    ability: "Fix-It Hammer",
    quote: "I can fix it!",
    image: "https://images.unsplash.com/photo-1718397363344-8caacba3a5bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    pixelIcon: "🔨",
  },
  {
    id: 4,
    name: "Sergeant Calhoun",
    universe: "Hero's Duty",
    health: 98,
    power: 90,
    defense: 85,
    color: "#39ff14",
    status: "active",
    ability: "Plasma Blast",
    quote: "Fear is a 4-letter word!",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    pixelIcon: "🔫",
  },
];

export function CharacterScreen() {
  const navigate = useNavigate();
  const { stability, glitchIntensity, setUniverse } = useChaos();
  const [characters, setCharacters] = useState(CHARACTERS);
  const [selectedChar, setSelectedChar] = useState<Character | null>(null);

  useEffect(() => {
    setUniverse("HEROS_DUTY");
  }, [setUniverse]);

  const handlePowerChange = (id: number, value: number) => {
    setCharacters(chars =>
      chars.map(c => c.id === id ? { ...c, power: value } : c)
    );
  };

  const handleDefenseChange = (id: number, value: number) => {
    setCharacters(chars =>
      chars.map(c => c.id === id ? { ...c, defense: value } : c)
    );
  };

  return (
    <div className="relative min-h-screen p-6 overflow-hidden">
      {/* Dynamic Chaos Background */}
      <div className="chaos-bg" />
      <div className="chaos-particles" />
      <div className="chaos-lights" />
      <div className="chaos-overlay" />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <ChaoticButtonEnhanced variant="blue" onClick={() => navigate("/dashboard")} className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              BACK
            </ChaoticButtonEnhanced>
            <h1
              className="text-3xl chaos-text"
              data-text="CHARACTER HUB"
              style={{
                fontFamily: "var(--font-display)",
                textShadow: "0 0 20px #00f0ff",
              }}
            >
              <GlitchTextEnhanced data-text="CHARACTER HUB">CHARACTER HUB</GlitchTextEnhanced>
            </h1>
            <div className="w-24" />
          </div>
          <p className="text-center text-[#00f0ff]/70 text-sm">Synchronize heroes across the digital multiverse</p>
        </motion.div>

        {/* Character Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {characters.map((char, index) => (
            <motion.div
              key={char.id}
            >
              <ArcadeCard glowColor={char.color} className={`character-card chaos-border h-full`} delay={index * 0.1}>
                <div className="space-y-4">
                  {/* Character Image */}
                  <div className="relative aspect-square overflow-hidden border-2 mb-4 group" style={{ borderColor: char.color }}>
                    <ImageWithFallback
                      src={char.image}
                      alt={char.name}
                      className="w-full h-full object-cover transition-transform group-hover:scale-110"
                    />

                    {/* Pixel Overlay Effect */}
                    <div className="absolute inset-0 opacity-20 pointer-events-none"
                      style={{
                        backgroundImage: `radial-gradient(${char.color} 1px, transparent 1px)`,
                        backgroundSize: '4px 4px'
                      }}
                    />

                    <motion.div
                      className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex items-end p-4"
                      initial={{ opacity: 0.6 }}
                      whileHover={{ opacity: 1 }}
                    >
                      <p className="text-[10px] text-white/90 italic leading-tight">"{char.quote}"</p>
                    </motion.div>

                    {/* Pixel Icon Badge */}
                    <div className="absolute top-2 right-2 bg-black/80 border border-white/20 w-8 h-8 flex items-center justify-center text-xl shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                      {char.pixelIcon}
                    </div>
                  </div>

                  {/* Name & Universe */}
                  <div className="text-center">
                    <h3
                      className="text-xl mb-1 truncate"
                      style={{
                        fontFamily: "var(--font-pixel)",
                        color: char.color,
                        textShadow: `0 0 10px ${char.color}`,
                      }}
                    >
                      {char.name}
                    </h3>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest">{char.universe}</p>
                  </div>

                  {/* Stats */}
                  <div className="space-y-3">
                    {/* Health */}
                    <div>
                      <div className="flex justify-between text-[8px] font-pixel mb-1">
                        <span className="flex items-center gap-1 text-[#ff006e]"><Heart className="w-2 h-2" /> HP</span>
                        <span>{char.health}%</span>
                      </div>
                      <div className="h-1 bg-black/50 border border-white/10 overflow-hidden">
                        <motion.div
                          className="h-full bg-[#ff006e]"
                          animate={{ width: `${char.health}%` }}
                        />
                      </div>
                    </div>

                    {/* Sliders */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <span className="text-[8px] font-pixel text-[#ffff00] flex items-center gap-1"><Zap className="w-2 h-2" /> PWR</span>
                        <input
                          type="range"
                          min="0" max="100"
                          value={char.power}
                          onChange={(e) => handlePowerChange(char.id, parseInt(e.target.value))}
                          className="w-full h-1 bg-black appearance-none border border-white/10 [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:bg-[#ffff00] accent-[#ffff00]"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[8px] font-pixel text-[#00f0ff] flex items-center gap-1"><Shield className="w-2 h-2" /> DEF</span>
                        <input
                          type="range"
                          min="0" max="100"
                          value={char.defense}
                          onChange={(e) => handleDefenseChange(char.id, parseInt(e.target.value))}
                          className="w-full h-1 bg-black appearance-none border border-white/10 [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:bg-[#00f0ff] accent-[#00f0ff]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Ability Box */}
                  <div className="bg-white/5 border border-white/10 p-2 text-center group-hover:bg-white/10 transition-colors">
                    <p className="text-[8px] text-white/30 font-pixel mb-1 uppercase">Special Move</p>
                    <p className="text-xs text-[#39ff14] font-pixel uppercase tracking-tighter">{char.ability}</p>
                  </div>

                  <ChaoticButtonEnhanced
                    onClick={() => setSelectedChar(char)}
                    variant="purple"
                    className="w-full py-2 text-[10px] font-pixel"
                  >
                    SYNC_CORE
                  </ChaoticButtonEnhanced>
                </div>
              </ArcadeCard>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedChar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-[100] p-4"
            onClick={() => setSelectedChar(null)}
          >
            <motion.div
              initial={{ scale: 0.9, rotate: 5 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0.9, rotate: -5 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg"
            >
              <ArcadeCard glowColor={selectedChar.color}>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="border-4 border-white/10 aspect-square overflow-hidden">
                    <ImageWithFallback src={selectedChar.image} alt={selectedChar.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h2 className="text-3xl font-pixel" style={{ color: selectedChar.color }}>{selectedChar.name}</h2>
                      <p className="text-xs text-white/50">{selectedChar.universe}</p>
                    </div>

                    <div className="space-y-2 border-y border-white/10 py-4">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-[#ffff00]" />
                        <span className="text-xs font-pixel">LEVEL: 85 (MASTER)</span>
                      </div>
                      <p className="text-xs text-white/70 leading-relaxed italic">
                        The hero of {selectedChar.universe}, known for their unique ability: <span className="text-[#39ff14] font-bold">{selectedChar.ability}</span>.
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <ChaoticButtonEnhanced onClick={() => navigate("/repair")} variant="green" className="flex-1">
                        FIX GLITCH
                      </ChaoticButtonEnhanced>
                      <ChaoticButtonEnhanced onClick={() => setSelectedChar(null)} variant="blue" className="flex-1">
                        DISCONNECT
                      </ChaoticButtonEnhanced>
                    </div>
                  </div>
                </div>
              </ArcadeCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
