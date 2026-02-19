import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { GlitchTextEnhanced } from "../components/GlitchTextEnhanced";
import { ChaoticButtonEnhanced } from "../components/ChaoticButtonEnhanced";
import { ArcadeCard } from "../components/ArcadeCard";
import { Wrench, ArrowLeft, CheckCircle, AlertTriangle, Zap, Cpu } from "lucide-react";
import { useChaos } from "../components/ChaosContext";

interface Fragment {
  id: number;
  type: string;
  color: string;
  placed: boolean;
}

const FRAGMENTS: Fragment[] = [
  { id: 1, type: "CORE", color: "#00f0ff", placed: false },
  { id: 2, type: "POWER", color: "#ffff00", placed: false },
  { id: 3, type: "SHIELD", color: "#39ff14", placed: false },
  { id: 4, type: "MATRIX", color: "#ff006e", placed: false },
  { id: 5, type: "GLITCH", color: "#bf40bf", placed: false },
  { id: 6, type: "NEURAL", color: "#00ff88", placed: false },
  { id: 7, type: "QUANTUM", color: "#ff00ff", placed: false },
  { id: 8, type: "PLASMA", color: "#ff8800", placed: false },
];

const DraggableFragment = ({ fragment }: { fragment: Fragment }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "fragment",
    item: fragment,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <motion.div
      ref={drag as any}
      className="border-2 bg-black/70 p-4 cursor-move backdrop-blur-md"
      style={{
        borderColor: fragment.color,
        opacity: isDragging ? 0.5 : 1,
        boxShadow: `0 0 15px ${fragment.color}44`,
      }}
      whileHover={{ scale: 1.05, rotate: [0, -2, 2, 0] }}
    >
      <div className="text-center">
        <Wrench className="w-8 h-8 mx-auto mb-2" style={{ color: fragment.color }} />
        <p className="text-[10px] uppercase font-pixel" style={{ color: fragment.color }}>
          {fragment.type}
        </p>
      </div>
    </motion.div>
  );
};

const DropZone = ({
  onDrop,
  fragment,
  index
}: {
  onDrop: (item: Fragment, index: number) => void;
  fragment: Fragment | null;
  index: number;
}) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "fragment",
    drop: (item: Fragment) => onDrop(item, index),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <motion.div
      ref={drop as any}
      className={`border-2 border-dashed p-6 flex items-center justify-center min-h-24 transition-colors ${isOver ? 'bg-white/10' : 'bg-black/30'
        }`}
      style={{
        borderColor: isOver ? "#00f0ff" : fragment ? fragment.color : "#ffffff33",
        boxShadow: fragment ? `0 0 20px ${fragment.color}44` : "none",
      }}
    >
      {fragment ? (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center"
        >
          <CheckCircle className="w-8 h-8 mx-auto mb-2" style={{ color: fragment.color }} />
          <p className="text-[10px] font-pixel" style={{ color: fragment.color }}>
            {fragment.type}_LINKED
          </p>
        </motion.div>
      ) : (
        <p className="text-white/20 text-[10px] font-pixel">INSERT_FRAG_{index}</p>
      )}
    </motion.div>
  );
};

function RepairScreenContent() {
  const navigate = useNavigate();
  const { repairStability, stability, setUniverse } = useChaos();
  const [fragments, setFragments] = useState(FRAGMENTS);
  const [placedFragments, setPlacedFragments] = useState<(Fragment | null)[]>(Array(8).fill(null));
  const [progress, setProgress] = useState(0);
  const [isRepaired, setIsRepaired] = useState(false);
  const [repairLevel, setRepairLevel] = useState(1);

  useEffect(() => {
    setUniverse("FIX_IT");
  }, [setUniverse]);

  const handleDrop = (item: Fragment, index: number) => {
    if (!placedFragments[index] && !item.placed) {
      const newPlaced = [...placedFragments];
      newPlaced[index] = item;
      setPlacedFragments(newPlaced);

      setFragments(fragments.map(f => f.id === item.id ? { ...f, placed: true } : f));

      const newProgress = (newPlaced.filter(f => f !== null).length / 8) * 100;
      setProgress(newProgress);

      if (newProgress >= 100) {
        setIsRepaired(true);
        const stabilityBonus = 25 + (repairLevel * 10); // More reward for higher levels
        repairStability(stabilityBonus); // Dynamic stability boost
        
        // Auto-return to dashboard after 3 seconds
        setTimeout(() => {
          navigate("/dashboard");
        }, 3000);
      }
    }
  };

  const handleReset = () => {
    setFragments(FRAGMENTS);
    setPlacedFragments(Array(8).fill(null));
    setProgress(0);
    setIsRepaired(false);
    setRepairLevel(prev => prev + 1); // Increase difficulty
  };

  return (
    <div className="relative min-h-screen p-6 overflow-hidden">
      {/* Dynamic Chaos Background */}
      <div className="chaos-bg" />
      <div className="chaos-particles" />
      <div className="chaos-lights" />
      <div className="chaos-overlay" />
      
      <div className="relative z-10 max-w-6xl mx-auto">
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
              className="text-3xl"
              style={{
                fontFamily: "var(--font-pixel)",
                textShadow: "0 0 20px #ff006e",
              }}
            >
              <GlitchTextEnhanced data-text="FORGE REPAIR">FORGE REPAIR</GlitchTextEnhanced>
            </h1>
            <div className="w-24" />
          </div>
          <p className="text-center text-[#ff006e]/70 text-sm">Resynchronize fragmented system nodes to restore stability</p>
          <div className="text-center mb-4">
            <span className="text-xs text-[#ffff00] font-pixel">REPAIR LEVEL: </span>
            <span className="text-sm text-[#ff006e] font-pixel chaos-text" data-text={`LEVEL ${repairLevel}`}>{repairLevel}</span>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Repair Area */}
          <div>
            <ArcadeCard glowColor="#ff006e">
              <h3 className="text-center text-xs mb-4 font-pixel tracking-widest text-[#ff006e]">
                SYNCHRONIZATION_MATRIX
              </h3>

              <div className="relative mb-6">
                <motion.div
                  className="border-2 border-[#ff006e]/30 bg-black/80 p-4 relative overflow-hidden min-h-64 shadow-[inset_0_0_50px_rgba(255,0,110,0.1)]"
                  animate={stability < 30 ? { x: [0, -2, 2, 0] } : {}}
                  transition={{ repeat: Infinity, duration: 0.1 }}
                >
                  <div className="grid grid-cols-2 gap-4 relative z-20">
                    {placedFragments.map((frag, i) => (
                      <DropZone
                        key={i}
                        onDrop={handleDrop}
                        fragment={frag}
                        index={i}
                      />
                    ))}
                  </div>

                  <AnimatePresence>
                    {isRepaired && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 flex items-center justify-center bg-black/90 z-30"
                      >
                        {/* Enhanced Particle Burst */}
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                          {[...Array(50)].map((_, i) => (
                            <motion.div
                              key={i}
                              className="absolute left-1/2 top-1/2 w-3 h-3 rounded-full"
                              style={{ 
                                backgroundColor: i % 3 === 0 ? "#39ff14" : i % 3 === 1 ? "#00f0ff" : "#ff006e",
                                boxShadow: `0 0 10px ${i % 3 === 0 ? "#39ff14" : i % 3 === 1 ? "#00f0ff" : "#ff006e"}`
                              }}
                              initial={{ x: 0, y: 0, scale: 1 }}
                              animate={{
                                x: (Math.random() - 0.5) * 800,
                                y: (Math.random() - 0.5) * 800,
                                scale: 0,
                                opacity: 0,
                                rotate: Math.random() * 720
                              }}
                              transition={{ duration: 1.5, ease: "easeOut" }}
                            />
                          ))}
                        </div>

                        {/* Multiple Glow Sweeps */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-[#39ff14]/30 to-transparent"
                          initial={{ x: "-100%" }}
                          animate={{ x: "100%" }}
                          transition={{ duration: 1, repeat: 3, ease: "easeInOut" }}
                        />
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00f0ff]/30 to-transparent"
                          initial={{ y: "-100%" }}
                          animate={{ y: "100%" }}
                          transition={{ duration: 1.2, repeat: 2, ease: "easeInOut" }}
                        />

                        {/* Success Content */}
                        <div className="text-center space-y-6 relative z-40">
                          <motion.div
                            initial={{ scale: 0, rotate: -360 }}
                            animate={{ scale: [0, 1.3, 1], rotate: [0, 180, 360] }}
                            transition={{ duration: 1.2, type: "spring" }}
                          >
                            <Cpu className="w-24 h-24 text-[#39ff14] drop-shadow-[0_0_30px_#39ff14]" />
                          </motion.div>
                          <motion.h3
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-3xl text-[#39ff14] font-pixel chaos-text"
                            data-text="SYSTEM RESTORED"
                          >
                            SYSTEM RESTORED
                          </motion.h3>
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="text-sm text-white/70 font-pixel"
                          >
                            +{25 + (repairLevel * 10)} STABILITY POINTS
                          </motion.p>
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.7 }}
                            className="text-center space-y-2"
                          >
                            <p className="text-xs text-[#00f0ff] font-pixel animate-pulse">
                              AUTO-RETURNING TO DASHBOARD...
                            </p>
                            <div className="flex justify-center">
                              {[...Array(3)].map((_, i) => (
                                <motion.div
                                  key={i}
                                  className="w-2 h-2 mx-1 rounded-full bg-[#00f0ff]"
                                  animate={{
                                    scale: [1, 1.5, 1],
                                    opacity: [0.5, 1, 0.5]
                                  }}
                                  transition={{
                                    duration: 0.8,
                                    repeat: Infinity,
                                    delay: i * 0.2
                                  }}
                                />
                              ))}
                            </div>
                          </motion.div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>

              {/* Progress */}
              <div className="mb-6">
                <div className="flex justify-between text-[10px] font-pixel mb-2">
                  <span className="text-white/40 uppercase">Stabilization Stream</span>
                  <span className="text-[#39ff14]">{Math.round(progress)}%</span>
                </div>
                <div className="h-2 bg-black border border-white/10 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-[#ff006e] via-[#ffff00] to-[#39ff14]"
                    animate={{
                      width: `${progress}%`,
                      opacity: [1, 0.7, 1]
                    }}
                    transition={{ opacity: { duration: 1, repeat: Infinity } }}
                  />
                </div>
              </div>

              <ChaoticButtonEnhanced onClick={handleReset} variant="pink" className="w-full text-xs font-pixel">
                PURGE_BUFFERS
              </ChaoticButtonEnhanced>
              <ChaoticButtonEnhanced onClick={() => navigate("/dashboard")} variant="blue" className="w-full text-xs font-pixel mt-2">
                RESTART GAME
              </ChaoticButtonEnhanced>
            </ArcadeCard>
          </div>

          {/* Tool Panel */}
          <div className="space-y-6">
            <ArcadeCard glowColor="#00f0ff">
              <h3 className="text-center text-xs mb-4 font-pixel text-[#00f0ff] uppercase">Available_Fragments</h3>
              <div className="grid grid-cols-2 gap-4">
                {fragments.filter(f => !f.placed).map((frag) => (
                  <DraggableFragment key={frag.id} fragment={frag} />
                ))}
              </div>
              {fragments.every(f => f.placed) && (
                <p className="text-center text-[#39ff14] text-[8px] font-pixel mt-4 animate-pulse">
                  QUEUE_EMPTY: ALL_FRAGMENTS_SYNCED
                </p>
              )}
            </ArcadeCard>

            <ArcadeCard glowColor="#ffff00">
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                  <AlertTriangle className="w-4 h-4 text-[#ffff00]" />
                  <h3 className="text-[10px] font-pixel text-[#ffff00] uppercase">Integrity_Check</h3>
                </div>
                <div className="space-y-2">
                  {[
                    { label: "CORE_NODES", value: progress >= 12.5 },
                    { label: "ENERGY_CELLS", value: progress >= 25 },
                    { label: "LOGIC_MATRIX", value: progress >= 37.5 },
                    { label: "NEURAL_LINKS", value: progress >= 50 },
                    { label: "QUANTUM_SYNC", value: progress >= 62.5 },
                    { label: "PLASMA_FIELD", value: progress >= 75 },
                    { label: "UI_OVERLAY", value: progress >= 87.5 },
                    { label: "FINAL_SYNC", value: progress >= 100 },
                  ].map((item, i) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center justify-between p-2 bg-white/5 border border-white/5"
                    >
                      <span className="text-[8px] font-pixel text-white/40">{item.label}</span>
                      <span className={`text-[8px] font-pixel ${item.value ? 'text-[#39ff14]' : 'text-[#ff006e]'}`}>
                        {item.value ? 'STABLE' : 'NULL'}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </ArcadeCard>
          </div>
        </div>
      </div>
    </div>
  );
}

export function RepairScreen() {
  return (
    <DndProvider backend={HTML5Backend}>
      <RepairScreenContent />
    </DndProvider>
  );
}
