import { motion } from "motion/react";
import { useChaos } from "./ChaosContext";
import { Activity, Shield, Cpu, HardDrive, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";

export function SystemMonitor() {
    const { stability, isChaosMode } = useChaos();
    const [cpuLoad, setCpuLoad] = useState(15);
    const [memory, setMemory] = useState(1.2);
    const [logs, setLogs] = useState<string[]>([]);

    useEffect(() => {
        const interval = setInterval(() => {
            // CPU and Memory fluctuate based on stability
            const modifier = (100 - stability) / 20;
            setCpuLoad(Math.min(99, Math.round(15 + Math.random() * 10 + modifier * 10)));
            setMemory(parseFloat((1.2 + Math.random() * 0.5 + modifier * 0.2).toFixed(1)));

            // Add random logs if stability is low
            if (stability < 70 && Math.random() > 0.7) {
                const errorMsgs = [
                    "ERR_NULL_POINTER: Memory leak detected",
                    "GLITCH_ALERT: UI fragment detached",
                    "SYSTEM_WARN: Physics engine instability",
                    "CORE_ERR: Character de-sync",
                    "PORTAL_FLICKER: Gateway sync lost"
                ];
                const newLog = errorMsgs[Math.floor(Math.random() * errorMsgs.length)];
                setLogs(prev => [newLog, ...prev].slice(0, 5));
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [stability]);

    return (
        <div className="fixed top-6 right-6 z-[100] w-64 pointer-events-none">
            <motion.div
                className="bg-black/60 backdrop-blur-md border border-white/20 p-4 space-y-4 shadow-[0_0_20px_rgba(0,0,0,0.5)]"
                animate={{
                    borderColor: stability < 40 ? "#ff006e" : "rgba(255,255,255,0.2)",
                    x: stability < 30 ? [0, -2, 2, 0] : 0
                }}
                transition={{ duration: 0.2, repeat: stability < 30 ? Infinity : 0 }}
            >
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-[#39ff14]" />
                        <span className="text-[10px] font-pixel text-[#39ff14]">SYS_MONITOR_V2.1</span>
                    </div>
                    {isChaosMode && (
                        <motion.span
                            animate={{ opacity: [1, 0, 1] }}
                            className="text-[8px] font-pixel text-[#ff006e]"
                        >
                            CHAOS_ACTIVE
                        </motion.span>
                    )}
                </div>

                {/* Stability Bar */}
                <div className="space-y-1">
                    <div className="flex justify-between text-[8px] font-pixel">
                        <span className="text-white/50">STABILITY</span>
                        <span style={{ color: stability < 50 ? "#ff006e" : "#39ff14" }}>{Math.round(stability)}%</span>
                    </div>
                    <div className="h-1 bg-white/10 overflow-hidden">
                        <motion.div
                            className="h-full"
                            animate={{
                                width: `${stability}%`,
                                backgroundColor: stability < 40 ? "#ff006e" : "#39ff14",
                            }}
                        />
                    </div>
                </div>

                {/* CPU & Memory */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-1 text-[8px] font-pixel text-white/50">
                            <Cpu className="w-3 h-3" /> CPU LOAD
                        </div>
                        <div className="text-xs font-pixel text-[#00f0ff]">{cpuLoad}%</div>
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-1 text-[8px] font-pixel text-white/50">
                            <HardDrive className="w-3 h-3" /> MEM_USED
                        </div>
                        <div className="text-xs font-pixel text-[#ffff00]">{memory} GB</div>
                    </div>
                </div>

                {/* Mini Logs */}
                <div className="space-y-1">
                    <div className="text-[8px] font-pixel text-white/30 border-t border-white/5 pt-2">ERROR_LOGS</div>
                    <div className="h-16 overflow-hidden space-y-1">
                        {logs.map((log, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-[7px] font-pixel text-[#ff006e] truncate"
                            >
                                {log}
                            </motion.div>
                        ))}
                        {logs.length === 0 && (
                            <div className="text-[7px] font-pixel text-[#39ff14] opacity-50">SYSTEM_NOMINAL...</div>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
