import { motion } from "motion/react";
import { useChaos } from "./ChaosContext";
import { Zap, AlertTriangle, Wind, RotateCw, Power } from "lucide-react";

export function ExtremeChaosPanel() {
    const { 
        stability, 
        isChaosMode, 
        tornadoActive, 
        zeroGravityActive, 
        continuousGlitchActive,
        setChaosMode,
        triggerTornado,
        toggleZeroGravity,
        toggleContinuousGlitch,
        activateExtremeChaos,
        repairStability,
        damageStability
    } = useChaos();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-4 right-4 z-[2000] bg-black/90 border-2 border-red-500 rounded-lg p-4 min-w-[300px]"
            style={{
                boxShadow: "0 0 30px rgba(255, 0, 110, 0.5)",
                fontFamily: "var(--font-pixel), monospace"
            }}
        >
            <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-red-500 animate-pulse" />
                <h3 className="text-red-500 font-bold text-sm">CHAOS CONTROL PANEL</h3>
            </div>

            {/* Stability Meter */}
            <div className="mb-4">
                <div className="flex justify-between text-xs mb-1">
                    <span className="text-white/70">SYSTEM STABILITY</span>
                    <span className={`${stability < 30 ? 'text-red-500' : stability < 60 ? 'text-yellow-500' : 'text-green-500'}`}>
                        {Math.round(stability)}%
                    </span>
                </div>
                <div className="w-full h-3 bg-black/50 border border-white/20 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full rounded-full"
                        style={{
                            background: stability < 30 
                                ? 'linear-gradient(90deg, #ff006e, #ff4080)'
                                : stability < 60 
                                ? 'linear-gradient(90deg, #ffff00, #ff8800)'
                                : 'linear-gradient(90deg, #39ff14, #00ff88)'
                        }}
                        animate={{ width: `${stability}%` }}
                        transition={{ duration: 0.3 }}
                    />
                </div>
            </div>

            {/* Chaos Status */}
            <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                <div className={`p-2 rounded border ${isChaosMode ? 'bg-red-500/20 border-red-500 text-red-500' : 'bg-white/5 border-white/20 text-white/70'}`}>
                    <div className="flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        <span>CHAOS MODE</span>
                    </div>
                </div>
                <div className={`p-2 rounded border ${tornadoActive ? 'bg-purple-500/20 border-purple-500 text-purple-500' : 'bg-white/5 border-white/20 text-white/70'}`}>
                    <div className="flex items-center gap-1">
                        <Wind className="w-3 h-3" />
                        <span>TORNADO</span>
                    </div>
                </div>
                <div className={`p-2 rounded border ${zeroGravityActive ? 'bg-cyan-500/20 border-cyan-500 text-cyan-500' : 'bg-white/5 border-white/20 text-white/70'}`}>
                    <div className="flex items-center gap-1">
                        <RotateCw className="w-3 h-3" />
                        <span>ZERO GRAVITY</span>
                    </div>
                </div>
                <div className={`p-2 rounded border ${continuousGlitchActive ? 'bg-pink-500/20 border-pink-500 text-pink-500' : 'bg-white/5 border-white/20 text-white/70'}`}>
                    <div className="flex items-center gap-1">
                        <Power className="w-3 h-3" />
                        <span>CONT. GLITCH</span>
                    </div>
                </div>
            </div>

            {/* Control Buttons */}
            <div className="space-y-2">
                <motion.button
                    onClick={() => setChaosMode(!isChaosMode)}
                    className={`w-full py-2 px-3 rounded text-xs font-bold border transition-all ${
                        isChaosMode 
                            ? 'bg-red-500 border-red-500 text-black animate-pulse' 
                            : 'bg-white/10 border-white/30 text-white hover:bg-white/20'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    {isChaosMode ? '🔴 CHAOS ACTIVE' : '⚪ ACTIVATE CHAOS'}
                </motion.button>

                <div className="grid grid-cols-2 gap-2">
                    <motion.button
                        onClick={triggerTornado}
                        className="py-2 px-3 rounded text-xs font-bold bg-purple-500/20 border border-purple-500 text-purple-500 hover:bg-purple-500/30 transition-all"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        🌪️ TORNADO
                    </motion.button>

                    <motion.button
                        onClick={toggleZeroGravity}
                        className={`py-2 px-3 rounded text-xs font-bold border transition-all ${
                            zeroGravityActive 
                                ? 'bg-cyan-500/20 border-cyan-500 text-cyan-500' 
                                : 'bg-white/10 border-white/30 text-white hover:bg-white/20'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        🎈 ZERO-G
                    </motion.button>

                    <motion.button
                        onClick={toggleContinuousGlitch}
                        className={`py-2 px-3 rounded text-xs font-bold border transition-all ${
                            continuousGlitchActive 
                                ? 'bg-pink-500/20 border-pink-500 text-pink-500' 
                                : 'bg-white/10 border-white/30 text-white hover:bg-white/20'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        ⚡ GLITCH
                    </motion.button>

                    <motion.button
                        onClick={activateExtremeChaos}
                        className="py-2 px-3 rounded text-xs font-bold bg-gradient-to-r from-red-600 via-purple-600 to-pink-600 border-0 text-white animate-pulse"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        💀 EXTREME
                    </motion.button>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/20">
                    <motion.button
                        onClick={() => repairStability(20)}
                        className="py-1 px-2 rounded text-xs bg-green-500/20 border border-green-500 text-green-500 hover:bg-green-500/30 transition-all"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        + REPAIR
                    </motion.button>
                    <motion.button
                        onClick={() => damageStability(20)}
                        className="py-1 px-2 rounded text-xs bg-red-500/20 border border-red-500 text-red-500 hover:bg-red-500/30 transition-all"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        - DAMAGE
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
}
