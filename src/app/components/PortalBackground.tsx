import { motion, AnimatePresence } from "motion/react";
import { useChaos, UniverseType } from "./ChaosContext";
import { useEffect, useState } from "react";

export function PortalBackground() {
    const { stability, currentUniverse } = useChaos();
    const [particleCount, setParticleCount] = useState(40);

    // Universe-specific themes
    const themes: Record<UniverseType, { color: string, secondary: string, grid: string, particles: string }> = {
        DEFAULT: {
            color: "#00f0ff",
            secondary: "#bf40bf",
            grid: "[#00f0ff]",
            particles: "bg-[#00f0ff]"
        },
        FIX_IT: {
            color: "#ffff00",
            secondary: "#ff006e",
            grid: "[#ffff00]",
            particles: "bg-[#ffff00]"
        },
        SUGAR_RUSH: {
            color: "#ff006e",
            secondary: "#bf40bf",
            grid: "[#ff006e]",
            particles: "bg-white"
        },
        HEROS_DUTY: {
            color: "#39ff14",
            secondary: "#00f0ff",
            grid: "[#39ff14]",
            particles: "bg-[#39ff14]"
        },
    };

    const theme = themes[currentUniverse] || themes.DEFAULT;

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-[-1] transition-colors duration-1000">
            {/* Ambient Depth Layer */}
            <div className="absolute inset-0 bg-gradient-to-b from-black via-[#050510] to-black" />

            {/* Stars/Dust particles */}
            <AnimatePresence mode="popLayout">
                {[...Array(60)].map((_, i) => (
                    <motion.div
                        key={`${currentUniverse}-${i}`}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{
                            y: [0, -window.innerHeight],
                            x: [0, (Math.random() - 0.5) * 200],
                            opacity: [0, 0.5, 0],
                            scale: [0, 1, 0.5],
                        }}
                        exit={{ opacity: 0, scale: 0 }}
                        className={`absolute rounded-full pointer-events-none ${theme.particles}`}
                        style={{
                            width: Math.random() * 4 + 1,
                            height: Math.random() * 4 + 1,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100 + 50}%`,
                            filter: `blur(${Math.random() * 2}px) drop-shadow(0 0 5px ${theme.color})`,
                        }}
                        transition={{
                            duration: Math.random() * 15 + 5,
                            repeat: Infinity,
                            ease: "easeOut",
                            delay: Math.random() * 5,
                        }}
                    />
                ))}
            </AnimatePresence>

            {/* Glowing Universe Core - Cinematic Depth */}
            <div className="absolute inset-0 flex items-center justify-center opacity-30">
                <motion.div
                    className="w-[150vw] h-[150vh] rounded-full blur-[120px]"
                    animate={{
                        scale: [1, 1.2, 1],
                        backgroundColor: [`${theme.color}22`, `${theme.secondary}22`, `${theme.color}22`]
                    }}
                    transition={{ duration: 10, repeat: Infinity }}
                    style={{ background: `radial-gradient(circle, ${theme.color} 0%, transparent 60%)` }}
                />
            </div>

            {/* Dynamic Grid - Distorted by Space */}
            <motion.div
                className="absolute inset-0 opacity-[0.05]"
                animate={{
                    rotateX: [60, 65, 60],
                    translateZ: [0, 50, 0]
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                style={{
                    backgroundImage: `linear-gradient(${theme.color} 1px, transparent 1px), linear-gradient(90deg, ${theme.color} 1px, transparent 1px)`,
                    backgroundSize: '80px 80px',
                    transform: 'perspective(1000px) rotateX(60deg) translateY(0)',
                    maskImage: 'radial-gradient(ellipse at center, black, transparent 70%)',
                }}
            />

            {/* Chromatic Glitch Field */}
            {stability < 50 && (
                <motion.div
                    className="absolute inset-0 mix-blend-screen opacity-20"
                    animate={{
                        opacity: [0, 0.2, 0, 0.4, 0],
                        backgroundPosition: ["0% 0%", "100% 100%", "50% 50%"]
                    }}
                    transition={{ duration: 0.2, repeat: Infinity }}
                    style={{
                        backgroundImage: `linear-gradient(rgba(255,0,0,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.5) 1px, transparent 1px)`,
                        backgroundSize: '4px 4px',
                    }}
                />
            )}

            {/* Cinematic Scanlines */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        </div>
    );
}
