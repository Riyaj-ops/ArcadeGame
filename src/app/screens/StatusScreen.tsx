import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { GlitchTextEnhanced } from "../components/GlitchTextEnhanced";
import { ChaoticButtonEnhanced } from "../components/ChaoticButtonEnhanced";
import { ArcadeCard } from "../components/ArcadeCard";
import { TerminalWindow } from "../components/TerminalWindow";
import { Activity, ArrowLeft, Cpu, HardDrive, Wifi, Zap, AlertCircle, CheckCircle, Clock, ZapOff } from "lucide-react";
import { useChaos } from "../components/ChaosContext";

export function StatusScreen() {
  const navigate = useNavigate();
  const { stability, glitchIntensity, setUniverse, isChaosMode, setChaosMode } = useChaos();
  const [uptime, setUptime] = useState(0);
  const [activities, setActivities] = useState<string[]>([]);

  useEffect(() => {
    setUniverse("DEFAULT");
  }, [setUniverse]);

  useEffect(() => {
    // Simulate system activity logs
    const activityInterval = setInterval(() => {
      const newActivities = [
        "Universe connection established",
        "Character data synchronized",
        "Glitch anomaly detected in sector 3",
        "Power core stabilized",
        "Memory allocation optimized",
        "Network latency: 12ms",
        "Backup routine completed",
        "Security scan passed",
      ];
      if (stability < 40) {
        newActivities.push("CRITICAL_ERR: System divergence", "WARN: Chaos integrity lost", "ALERT: Portal destabilized");
      }
      setActivities(prev => [...prev, newActivities[Math.floor(Math.random() * newActivities.length)]].slice(-10));
    }, 3000);

    // Update uptime
    const uptimeInterval = setInterval(() => {
      setUptime(prev => prev + 1);
    }, 1000);

    return () => {
      clearInterval(activityInterval);
      clearInterval(uptimeInterval);
    };
  }, [stability]);

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${mins}m ${secs}s`;
  };

  const handleRestart = () => {
    navigate("/boot");
  };

  return (
    <div className="relative min-h-screen p-6 overflow-hidden">
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
              data-text="SYSTEM STATUS"
              style={{
                fontFamily: "var(--font-display)",
                textShadow: "0 0 20px #39ff14",
              }}
            >
              <GlitchTextEnhanced data-text="SYSTEM STATUS">SYSTEM STATUS</GlitchTextEnhanced>
            </h1>
            <div className="flex gap-2">
              <ChaoticButtonEnhanced
                variant={isChaosMode ? "pink" : "green"}
                onClick={() => setChaosMode(!isChaosMode)}
                className="flex items-center gap-2"
              >
                {isChaosMode ? <ZapOff className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
                {isChaosMode ? "OVERRIDE" : "ENERGIZE"}
              </ChaoticButtonEnhanced>
              <ChaoticButtonEnhanced variant="pink" onClick={handleRestart} className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                REBOOT
              </ChaoticButtonEnhanced>
            </div>
          </div>
          <p className="text-center text-[#39ff14]/70 text-sm">Real-time monitoring and chaos management</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          {/* System Health */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <ArcadeCard glowColor={stability > 85 ? "#39ff14" : stability > 40 ? "#ffff00" : "#ff006e"} delay={0.1}>
              <div className="text-center">
                <Activity className="w-12 h-12 mx-auto mb-4" style={{ color: stability > 85 ? "#39ff14" : stability > 40 ? "#ffff00" : "#ff006e" }} />
                <h3 className="text-[10px] font-pixel text-white/50 mb-2 uppercase">Core Stability</h3>
                <motion.p
                  className="text-5xl mb-4 font-pixel"
                  style={{
                    color: stability > 85 ? "#39ff14" : stability > 40 ? "#ffff00" : "#ff006e",
                    textShadow: `0 0 20px ${stability > 85 ? "#39ff14" : stability > 40 ? "#ffff00" : "#ff006e"}`,
                  }}
                  animate={stability < 30 ? { x: [-2, 2, -1, 1, 0] } : {}}
                  transition={{ repeat: Infinity, duration: 0.1 }}
                >
                  {Math.round(stability)}%
                </motion.p>
                <div className="h-2 border border-white/10 bg-black/50 overflow-hidden">
                  <motion.div
                    className="h-full"
                    animate={{
                      width: `${stability}%`,
                      backgroundColor: stability > 85 ? "#39ff14" : stability > 40 ? "#ffff00" : "#ff006e",
                    }}
                  />
                </div>
              </div>
            </ArcadeCard>
          </motion.div>

          {/* Uptime */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <ArcadeCard glowColor="#00f0ff" delay={0.2}>
              <div className="text-center">
                <Clock className="w-12 h-12 mx-auto mb-4 text-[#00f0ff]" />
                <h3 className="text-[10px] font-pixel text-white/50 mb-2 uppercase">Sync Duration</h3>
                <p
                  className="text-xl mb-2 font-pixel"
                  style={{
                    color: "#00f0ff",
                    textShadow: "0 0 20px #00f0ff",
                  }}
                >
                  {formatUptime(uptime)}
                </p>
                <p className="text-[8px] font-pixel text-white/30 lowercase italic">uninterrupted_multiverse_flow</p>
              </div>
            </ArcadeCard>
          </motion.div>

          {/* Active Universes */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <ArcadeCard glowColor="#bf40bf" delay={0.3}>
              <div className="text-center">
                <Wifi className="w-12 h-12 mx-auto mb-4 text-[#bf40bf]" />
                <h3 className="text-[10px] font-pixel text-white/50 mb-2 uppercase">Portals Linked</h3>
                <p className="text-5xl mb-2 font-pixel text-[#bf40bf] shadow-[#bf40bf] drop-shadow-[0_0_10px_rgba(191,64,191,0.5)]">
                  {stability > 20 ? "4/4" : "1/4"}
                </p>
                <div className="flex justify-center gap-3">
                  {["🔨", "🍬", "🤜", "🔫"].map((icon, i) => (
                    <motion.span
                      key={i}
                      className="text-xl"
                      animate={{
                        y: [0, -5, 0],
                        opacity: stability < 20 && i > 0 ? [0.5, 0.1, 0.5] : 1
                      }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                    >
                      {icon}
                    </motion.span>
                  ))}
                </div>
              </div>
            </ArcadeCard>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Activity Logs */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <ArcadeCard glowColor="#39ff14">
              <h3 className="text-xs font-pixel mb-4 text-[#39ff14] uppercase">Kernel_Output</h3>
              <TerminalWindow autoScroll={false}>
                <div className="space-y-1 max-h-64 overflow-y-auto">
                  {activities.map((activity, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-start gap-2 text-[10px] font-pixel"
                    >
                      <span className="text-[#00f0ff] opacity-50">#</span>
                      <span className="text-[#39ff14] opacity-30">{new Date().toLocaleTimeString()}</span>
                      <span className="text-white/70">{activity}</span>
                    </motion.div>
                  ))}
                  <div className="text-[10px] font-pixel text-[#39ff14] animate-pulse mt-2">_LISTENING_FOR_ANOMALIES...</div>
                </div>
              </TerminalWindow>
            </ArcadeCard>
          </motion.div>

          {/* System Resources */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <ArcadeCard glowColor="#ffff00">
              <h3 className="text-xs font-pixel mb-4 text-[#ffff00] uppercase">Multiverse_Load</h3>
              <div className="space-y-4">
                {[
                  { icon: Cpu, label: "CPU_CYCLES", value: Math.min(99, 65 + (100 - stability) / 4), color: "#00f0ff" },
                  { icon: HardDrive, label: "MEM_BUFFER", value: Math.min(99, 82 + (100 - stability) / 5), color: "#ff006e" },
                  { icon: Zap, label: "POWER_GRID", value: stability, color: "#39ff14" },
                ].map((resource, i) => (
                  <div key={resource.label} className="space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-pixel">
                      <div className="flex items-center gap-2">
                        <resource.icon className="w-3 h-3" style={{ color: resource.color }} />
                        <span className="text-white/40">{resource.label}</span>
                      </div>
                      <span style={{ color: resource.color }}>{Math.round(resource.value)}%</span>
                    </div>
                    <div className="h-1 bg-black border border-white/5 overflow-hidden">
                      <motion.div
                        className="h-full"
                        style={{ backgroundColor: resource.color }}
                        animate={{ width: `${resource.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </ArcadeCard>

            {/* Alerts */}
            <ArcadeCard glowColor="#ff006e">
              <h3 className="text-xs font-pixel mb-4 text-[#ff006e] uppercase">Active_Dangers</h3>
              <div className="space-y-2">
                {stability < 50 ? (
                  <motion.div
                    animate={{ x: [-2, 2, -2] }}
                    transition={{ repeat: Infinity, duration: 0.1 }}
                    className="flex items-center gap-3 p-3 bg-red-950/30 border border-red-500"
                  >
                    <AlertCircle className="w-5 h-5 text-red-500" />
                    <div>
                      <p className="text-[10px] font-pixel text-red-500 uppercase">Stability Collapse Imminent</p>
                      <p className="text-[8px] font-pixel text-red-500/70 lowercase">initiate_repair_sequence_immediately</p>
                    </div>
                  </motion.div>
                ) : (
                  <div className="flex items-center gap-3 p-3 bg-emerald-950/20 border border-emerald-500/30">
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                    <div>
                      <p className="text-[10px] font-pixel text-emerald-500 uppercase">System Integrity Nominal</p>
                      <p className="text-[8px] font-pixel text-emerald-500/70 lowercase">all_universes_within_safe_bounds</p>
                    </div>
                  </div>
                )}
              </div>
            </ArcadeCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
