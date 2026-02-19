import { useState, useEffect } from "react";
import { Outlet } from "react-router";
import { ChaosProvider, useChaos } from "./components/ChaosContext";
import { PortalBackground } from "./components/PortalBackground";
import { TorchOverlay } from "./components/TorchOverlay";
import { RandomPuzzlePopup } from "./components/RandomPuzzlePopup";
import { ArcadeCursor } from "./components/ArcadeCursor";
import { CRTOverlay } from "./components/CRTOverlay";
import { GlitchOverlay } from "./components/GlitchOverlay";
import { PixelDust } from "./components/PixelDust";
import { SystemMonitor } from "./components/SystemMonitor";
import { motion, AnimatePresence } from "motion/react";

// EXTREME CHAOS ENHANCEMENTS
import { TornadoTransition } from "./components/TornadoTransition";
import { ZeroGravityButtons } from "./components/ZeroGravityButtons";
import { ContinuousGlitch } from "./components/ContinuousGlitch";
import { GlitchyGlowFont } from "./components/GlitchyGlowFont";
import { ExtremeChaosPanel } from "./components/ExtremeChaosPanel";

function ChaosEffects() {
    const { repairStability, glitchIntensity, stability, isChaosMode } = useChaos();

    return (
        <>
            <PortalBackground />
            <PixelDust />
            <TorchOverlay />
            <GlitchOverlay />
            <RandomPuzzlePopup onSolve={() => repairStability(15)} />
            <ArcadeCursor />
            <CRTOverlay />
            <SystemMonitor />
            
            {/* EXTREME CHAOS COMPONENTS */}
            <TornadoTransition />
            <ZeroGravityButtons />
            <ContinuousGlitch />
            <GlitchyGlowFont />
            <ExtremeChaosPanel />

            {/* Enhanced global glitch filter with extreme chaos */}
            <motion.div
                className="fixed inset-0 pointer-events-none z-[1000] mix-blend-overlay"
                animate={{
                    opacity: isChaosMode ? 0.3 : glitchIntensity * 0.15,
                    backdropFilter: `blur(${isChaosMode ? glitchIntensity * 8 : glitchIntensity * 2}px) brightness(${1 + glitchIntensity * 0.4}) contrast(${1 + glitchIntensity * 1.2}) saturate(${1 + glitchIntensity * 2})`,
                }}
                transition={{ duration: 0.05 }}
            />
            
            {/* Chaos vortex effect */}
            {isChaosMode && (
                <motion.div
                    className="fixed inset-0 pointer-events-none z-[999]"
                    animate={{
                        background: `radial-gradient(circle at ${50 + Math.sin(Date.now() * 0.001) * 30}% ${50 + Math.cos(Date.now() * 0.001) * 30}%, transparent 0%, rgba(255,0,255,0.1) 50%, rgba(0,255,255,0.2) 100%)`,
                    transform: `rotate(${Date.now() * 0.01}deg)`
                    
                    }}
                    transition={{ duration: 0.1 }}
                />
            )}
        </>
    );
}

export function MainLayout() {
    return (
        <ChaosProvider>
            <MainLayoutInner />
        </ChaosProvider>
    );
}

function MainLayoutInner() {
    const { isLoggingOut, isPowerOutage, currentUniverse, stability, isChaosMode, glitchIntensity } = useChaos();
    const [prevUniverse, setPrevUniverse] = useState(currentUniverse);
    const [isWarping, setIsWarping] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [tornadoActive, setTornadoActive] = useState(false);

    // Universe-specific styles (Ambient Lighting)
    const universeThemes: Record<string, string> = {
        DEFAULT: "bg-[#0a0a0c] shadow-[inset_0_0_100px_rgba(0,240,255,0.1)]",
        FIX_IT: "bg-[#1a1a2e] shadow-[inset_0_0_100px_rgba(255,255,0,0.1)]",
        SUGAR_RUSH: "bg-[#2d0a1a] shadow-[inset_0_0_100px_rgba(255,0,110,0.1)]",
        HEROS_DUTY: "bg-[#0a1a0f] shadow-[inset_0_0_100px_rgba(57,255,20,0.1)]",
    };

    useEffect(() => {
        if (currentUniverse !== prevUniverse) {
            setIsWarping(true);
            setTornadoActive(true); // Trigger tornado transition
            const timer = setTimeout(() => {
                setIsWarping(false);
                setTornadoActive(false);
                setPrevUniverse(currentUniverse);
            }, 1200); // Longer duration for tornado effect
            return () => clearTimeout(timer);
        }
    }, [currentUniverse, prevUniverse]);

    useEffect(() => {
        const handleMove = (e: MouseEvent) => {
            setMousePos({
                x: (e.clientX / window.innerWidth - 0.5) * 10,
                y: (e.clientY / window.innerHeight - 0.5) * 10
            });
        };
        window.addEventListener("mousemove", handleMove);
        return () => window.removeEventListener("mousemove", handleMove);
    }, []);

    return (
        <div className={`relative min-h-screen text-white selection:bg-[#00f0ff] selection:text-black overflow-hidden transition-all duration-1000 chaos-dynamic chaos-level-${Math.floor(stability / 10)} ${universeThemes[currentUniverse]}`}>
            {/* Chaos Background Layers */}
            <div className="chaos-bg" />
            <div className="chaos-particles" />
            <div className="chaos-lights" />
            <div className="chaos-overlay" />
            
            <ChaosEffects />

            {/* EXTREME TORNADO PORTAL WARP */}
            <AnimatePresence>
                {isWarping && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.1, rotate: 0 }}
                        animate={{ 
                            opacity: [0, 1, 0.8, 1, 0], 
                            scale: [0.1, 2, 0.5, 3, 5], 
                            rotate: [0, 360, 720, 1080, 1440]
                        }}
                        exit={{ opacity: 0, scale: 10, rotate: 1800 }}
                        className="fixed inset-0 z-[1500] pointer-events-none"
                        transition={{ duration: 1.2, ease: "circOut" }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 mix-blend-screen opacity-80" />
                        <div className="absolute inset-0 animate-spin" style={{ animationDuration: '0.1s' }}>
                            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white to-transparent opacity-30" />
                        </div>
                        {/* Tornado vortex lines */}
                        {[...Array(12)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute top-1/2 left-1/2 w-2 h-full bg-gradient-to-b from-transparent via-white to-transparent opacity-20"
                                style={{ 
                                    transform: `translateX(-50%) translateY(-50%) rotate(${i * 30}deg)`,
                                    transformOrigin: 'center'
                                }}
                                animate={{
                                    scaleY: [0.5, 1.5, 0.5],
                                    opacity: [0.1, 0.4, 0.1]
                                }}
                                transition={{
                                    duration: 0.3,
                                    repeat: Infinity,
                                    delay: i * 0.025
                                }}
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Logout Blackout */}
            <AnimatePresence>
                {isLoggingOut && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="fixed inset-0 z-[2000] bg-black pointer-events-none"
                    />
                )}
            </AnimatePresence>

            {/* Global Perspective Container (Soft Physics / Tilt) */}
            <motion.div
                style={{ perspective: 1200 }}
                animate={{
                    rotateX: -mousePos.y * 0.2,
                    rotateY: mousePos.x * 0.2,
                }}
                className="relative min-h-screen w-full"
            >
                <motion.main
                    className="relative z-10 p-4 lg:p-10"
                    animate={isLoggingOut ? {
                        y: "120vh",
                        rotateZ: [-5, 10, -15, 20, -25, 30],
                        scale: [1, 0.85, 0.7, 0.5, 0.3, 0.1],
                        opacity: 0,
                        filter: "blur(10px) hue-rotate(180deg)"
                    } : isChaosMode ? {
                        y: [0, -5, 5, -3, 3, 0],
                        rotateZ: [-1, 1, -2, 2, -1, 0],
                        scale: [1, 1.02, 0.98, 1.01, 0.99, 1],
                        filter: `blur(${glitchIntensity * 2}px) hue-rotate(${glitchIntensity * 360}deg)`
                    } : {
                        y: 0,
                        rotateZ: 0,
                        scale: 1,
                        opacity: 1,
                        filter: "blur(0px)"
                    }}
                    transition={{
                        duration: isLoggingOut ? 2 : 0.5,
                        ease: isLoggingOut ? [0.76, 0, 0.24, 1] : "easeInOut",
                        opacity: { duration: isLoggingOut ? 1.2 : 0.3 }
                    }}
                >
                    <Outlet />
                </motion.main>
            </motion.div>

            {/* Global Power Outage Overlay */}
            <AnimatePresence>
                {isPowerOutage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[500] bg-black/90 pointer-events-none"
                        transition={{ duration: 0.8 }}
                    />
                )}
            </AnimatePresence>

            {/* CRT Scanline Persistence */}
            <div className="fixed inset-0 pointer-events-none z-[3000] opacity-[0.02] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
        </div>
    );
}
