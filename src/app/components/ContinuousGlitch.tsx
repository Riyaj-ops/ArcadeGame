import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useChaos } from "./ChaosContext";

export function ContinuousGlitch() {
    const { stability, isChaosMode, glitchIntensity } = useChaos();
    const [glitchElements, setGlitchElements] = useState<Array<{id: number, type: string}>>([]);
    
    useEffect(() => {
        // Generate random glitch elements
        const interval = setInterval(() => {
            if (isChaosMode || stability < 60) {
                const glitchTypes = ['scanline', 'pixel-block', 'color-shift', 'text-corruption', 'static'];
                const newGlitch = {
                    id: Date.now(),
                    type: glitchTypes[Math.floor(Math.random() * glitchTypes.length)]
                };
                
                setGlitchElements(prev => [...prev.slice(-10), newGlitch]);
                
                // Remove glitch after short duration
                setTimeout(() => {
                    setGlitchElements(prev => prev.filter(g => g.id !== newGlitch.id));
                }, 100 + Math.random() * 400);
            }
        }, isChaosMode ? 50 : 200);
        
        return () => clearInterval(interval);
    }, [stability, isChaosMode]);
    
    return (
        <div className="fixed inset-0 pointer-events-none z-[1200] mix-blend-screen">
            {/* Scanlines */}
            {glitchElements.filter(g => g.type === 'scanline').map(glitch => (
                <motion.div
                    key={glitch.id}
                    className="absolute w-full h-px bg-white"
                    style={{ top: `${Math.random() * 100}%` }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 0.1 }}
                />
            ))}
            
            {/* Pixel blocks */}
            {glitchElements.filter(g => g.type === 'pixel-block').map(glitch => (
                <motion.div
                    key={glitch.id}
                    className="absolute bg-black"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        width: `${Math.random() * 100 + 20}px`,
                        height: `${Math.random() * 100 + 20}px`
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.8, 0] }}
                    transition={{ duration: 0.2 }}
                />
            ))}
            
            {/* Color shifts */}
            {glitchElements.filter(g => g.type === 'color-shift').map(glitch => (
                <motion.div
                    key={glitch.id}
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ 
                        opacity: [0, 0.3, 0],
                        backgroundColor: [
                            'rgba(255, 0, 255, 0.2)',
                            'rgba(0, 255, 255, 0.2)',
                            'rgba(255, 255, 0, 0.2)'
                        ]
                    }}
                    transition={{ duration: 0.3 }}
                />
            ))}
            
            {/* Text corruption overlay */}
            {glitchElements.filter(g => g.type === 'text-corruption').map(glitch => (
                <motion.div
                    key={glitch.id}
                    className="absolute inset-0"
                    style={{
                        background: `repeating-linear-gradient(
                            0deg,
                            transparent,
                            transparent 2px,
                            rgba(255, 0, 0, 0.1) 2px,
                            rgba(255, 0, 0, 0.1) 4px
                        )`
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 0.15 }}
                />
            ))}
            
            {/* Static noise */}
            {glitchElements.filter(g => g.type === 'static').map(glitch => (
                <motion.div
                    key={glitch.id}
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                        backgroundSize: '200px 200px',
                        opacity: 0.1
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.2, 0] }}
                    transition={{ duration: 0.1 }}
                />
            ))}
            
            {/* Random glitch flashes */}
            {isChaosMode && (
                <motion.div
                    className="absolute inset-0 bg-white"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.1, 0] }}
                    transition={{ 
                        duration: 0.05,
                        repeat: Infinity,
                        repeatDelay: Math.random() * 2
                    }}
                />
            )}
            
            {/* Chromatic aberration */}
            {glitchIntensity > 0.5 && (
                <div className="absolute inset-0">
                    <motion.div
                        className="absolute inset-0 bg-red-500"
                        style={{ mixBlendMode: 'screen' }}
                        animate={{
                            opacity: [0, 0.1, 0],
                            x: [-2, 2, -2]
                        }}
                        transition={{
                            duration: 0.2,
                            repeat: Infinity
                        }}
                    />
                    <motion.div
                        className="absolute inset-0 bg-cyan-500"
                        style={{ mixBlendMode: 'screen' }}
                        animate={{
                            opacity: [0, 0.1, 0],
                            x: [2, -2, 2]
                        }}
                        transition={{
                            duration: 0.2,
                            repeat: Infinity
                        }}
                    />
                </div>
            )}
        </div>
    );
}
