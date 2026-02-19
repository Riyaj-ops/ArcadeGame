import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useChaos } from "./ChaosContext";

export function GlitchyGlowFont() {
    const { stability, isChaosMode, glitchIntensity } = useChaos();
    const [glitchTexts, setGlitchTexts] = useState<Array<{id: number, text: string, x: number, y: number}>>([]);
    
    const glitchPhrases = [
        "WRECK-IT", "RALPH", "GLITCH", "TURBO", "VANELLOPE", 
        "FIX-IT FELIX", "SUGAR RUSH", "HERO'S DUTY", "GAME OVER", 
        "SYSTEM ERROR", "CHAOS MODE", "REALITY FAILURE", "PIXEL CORRUPTION"
    ];
    
    useEffect(() => {
        // Generate floating glitch text
        const interval = setInterval(() => {
            if (isChaosMode || stability < 50) {
                const newText = {
                    id: Date.now(),
                    text: glitchPhrases[Math.floor(Math.random() * glitchPhrases.length)],
                    x: Math.random() * window.innerWidth,
                    y: Math.random() * window.innerHeight
                };
                
                setGlitchTexts(prev => [...prev.slice(-5), newText]);
                
                // Remove after animation
                setTimeout(() => {
                    setGlitchTexts(prev => prev.filter(t => t.id !== newText.id));
                }, 3000);
            }
        }, isChaosMode ? 800 : 2000);
        
        return () => clearInterval(interval);
    }, [stability, isChaosMode]);
    
    return (
        <div className="fixed inset-0 pointer-events-none z-[1100]">
            {glitchTexts.map(text => (
                <motion.div
                    key={text.id}
                    className="absolute font-bold text-2xl"
                    style={{
                        left: text.x,
                        top: text.y,
                        fontFamily: 'var(--font-pixel), monospace',
                        textShadow: isChaosMode 
                            ? `0 0 20px #ff006e, 0 0 40px #00f0ff, 0 0 60px #ffff00`
                            : `0 0 10px #00f0ff`,
                        color: isChaosMode 
                            ? `hsl(${Math.random() * 360}, 100%, 50%)`
                            : '#00f0ff'
                    }}
                    initial={{ 
                        opacity: 0, 
                        scale: 0,
                        rotate: (Math.random() - 0.5) * 180
                    }}
                    animate={{
                        opacity: [0, 1, 1, 0],
                        scale: [0, 1.2, 1, 0.8],
                        rotate: [(Math.random() - 0.5) * 180, (Math.random() - 0.5) * 360],
                        y: [0, -20, -40],
                        x: [0, (Math.random() - 0.5) * 50, (Math.random() - 0.5) * 100]
                    }}
                    transition={{
                        duration: 3,
                        ease: "easeOut"
                    }}
                >
                    {/* Glitch layers */}
                    <motion.div
                        className="absolute inset-0"
                        style={{ color: '#ff006e' }}
                        animate={{
                            x: isChaosMode ? [-2, 2, -1, 1, 0] : [0, 0, 0],
                            opacity: isChaosMode ? [0.5, 1, 0.5] : [0, 0, 0]
                        }}
                        transition={{
                            duration: 0.1,
                            repeat: isChaosMode ? Infinity : 0
                        }}
                    >
                        {text.text}
                    </motion.div>
                    
                    <motion.div
                        className="absolute inset-0"
                        style={{ color: '#00f0ff' }}
                        animate={{
                            x: isChaosMode ? [2, -2, 1, -1, 0] : [0, 0, 0],
                            opacity: isChaosMode ? [0.5, 1, 0.5] : [0, 0, 0]
                        }}
                        transition={{
                            duration: 0.1,
                            repeat: isChaosMode ? Infinity : 0,
                            delay: 0.05
                        }}
                    >
                        {text.text}
                    </motion.div>
                    
                    <motion.div
                        className="absolute inset-0"
                        style={{ color: '#ffff00' }}
                        animate={{
                            x: isChaosMode ? [0, 0, 0] : [0, 0, 0],
                            opacity: isChaosMode ? [0.3, 0.8, 0.3] : [1, 1, 1]
                        }}
                        transition={{
                            duration: 0.15,
                            repeat: isChaosMode ? Infinity : 0,
                            delay: 0.1
                        }}
                    >
                        {text.text}
                    </motion.div>
                    
                    {text.text}
                </motion.div>
            ))}
            
            {/* Global font glitch effect */}
            {isChaosMode && (
                <style jsx global>{`
                    * {
                        animation: textGlitch 0.2s infinite !important;
                    }
                    
                    @keyframes textGlitch {
                        0%, 100% { 
                            text-shadow: 0 0 5px currentColor, 0 0 10px currentColor;
                            transform: translate(0);
                        }
                        25% { 
                            text-shadow: -2px 0 #ff006e, 2px 0 #00f0ff;
                            transform: translate(-1px, 1px);
                        }
                        50% { 
                            text-shadow: 2px 0 #ffff00, -2px 0 #ff40bf;
                            transform: translate(1px, -1px);
                        }
                        75% { 
                            text-shadow: 0 0 20px currentColor;
                            transform: translate(-1px, -1px);
                        }
                    }
                `}</style>
            )}
            
            {/* Random character corruption */}
            {stability < 30 && (
                <motion.div
                    className="fixed top-10 left-10 text-4xl font-mono"
                    style={{
                        color: '#ff006e',
                        textShadow: '0 0 20px #ff006e',
                        fontFamily: 'var(--font-pixel), monospace'
                    }}
                    animate={{
                        opacity: [0, 1, 0],
                        scale: [1, 1.5, 1]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity
                    }}
                >
                    {String.fromCharCode(33 + Math.floor(Math.random() * 94))}
                </motion.div>
            )}
        </div>
    );
}
