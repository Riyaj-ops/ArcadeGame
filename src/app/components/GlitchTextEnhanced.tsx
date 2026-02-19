import { motion } from "motion/react";
import { useChaos } from "./ChaosContext";

interface GlitchTextEnhancedProps {
    children: React.ReactNode;
    className?: string;
    dataText?: string;
}

export function GlitchTextEnhanced({ children, className = "", dataText }: GlitchTextEnhancedProps) {
    const { glitchIntensity, isChaosMode } = useChaos();
    
    const shouldGlitch = isChaosMode || glitchIntensity > 0.3;
    
    return (
        <motion.div
            className={`chaos-text ${className}`}
            data-text={dataText || (typeof children === 'string' ? children : '')}
            animate={shouldGlitch ? {
                filter: [
                    "hue-rotate(0deg) saturate(1)",
                    "hue-rotate(90deg) saturate(1.5)",
                    "hue-rotate(180deg) saturate(2)",
                    "hue-rotate(270deg) saturate(1.5)",
                    "hue-rotate(360deg) saturate(1)"
                ],
                transform: [
                    "translate(0, 0)",
                    "translate(-2px, 2px)",
                    "translate(2px, -2px)",
                    "translate(-1px, 1px)",
                    "translate(1px, -1px)",
                    "translate(0, 0)"
                ],
                opacity: [
                    1, 0.8, 0.9, 0.7, 0.85, 1
                ]
            } : {}}
            transition={{
                duration: shouldGlitch ? 0.1 : 0,
                repeat: shouldGlitch ? Infinity : 0,
                ease: "easeInOut"
            }}
            style={{
                fontFamily: "var(--font-display)",
                fontWeight: 900,
                textTransform: "uppercase",
                letterSpacing: "2px",
                position: "relative",
                textShadow: shouldGlitch 
                    ? `0 0 ${10 + glitchIntensity * 20}px currentColor, 0 0 ${20 + glitchIntensity * 30}px currentColor, 0 0 ${30 + glitchIntensity * 40}px currentColor`
                    : "0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor"
            }}
        >
            {/* Glitch Layers */}
            {shouldGlitch && (
                <>
                    <motion.div
                        className="absolute inset-0"
                        style={{
                            color: "var(--neon-pink)",
                            zIndex: -1
                        }}
                        animate={{
                            transform: [
                                "translate(0, 0)",
                                "translate(-3px, 3px)",
                                "translate(3px, -3px)",
                                "translate(-2px, 2px)",
                                "translate(2px, -2px)",
                                "translate(0, 0)"
                            ],
                            opacity: [0.5, 0.8, 0.6, 0.9, 0.7, 0.5]
                        }}
                        transition={{
                            duration: 0.15,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >
                        {children}
                    </motion.div>
                    
                    <motion.div
                        className="absolute inset-0"
                        style={{
                            color: "var(--cyber-purple)",
                            zIndex: -2
                        }}
                        animate={{
                            transform: [
                                "translate(0, 0)",
                                "translate(3px, -3px)",
                                "translate(-3px, 3px)",
                                "translate(2px, -2px)",
                                "translate(-2px, 2px)",
                                "translate(0, 0)"
                            ],
                            opacity: [0.4, 0.7, 0.5, 0.8, 0.6, 0.4]
                        }}
                        transition={{
                            duration: 0.18,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >
                        {children}
                    </motion.div>
                    
                    <motion.div
                        className="absolute inset-0"
                        style={{
                            color: "var(--arcade-yellow)",
                            zIndex: -3
                        }}
                        animate={{
                            transform: [
                                "translate(0, 0)",
                                "translate(-1px, 1px)",
                                "translate(1px, -1px)",
                                "translate(-2px, 2px)",
                                "translate(2px, -2px)",
                                "translate(0, 0)"
                            ],
                            opacity: [0.3, 0.6, 0.4, 0.7, 0.5, 0.3]
                        }}
                        transition={{
                            duration: 0.12,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >
                        {children}
                    </motion.div>
                </>
            )}
            
            {/* Light Sweep Effect */}
            {shouldGlitch && (
                <motion.div
                    className="absolute inset-0 rounded-lg"
                    style={{
                        background: "linear-gradient(45deg, transparent, rgba(255,255,255,0.3), transparent)",
                        mixBlendMode: "screen"
                    }}
                    animate={{
                        x: ["-100%", "100%"]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            )}
            
            {/* Main Content */}
            <span style={{ position: "relative", zIndex: 1 }}>
                {children}
            </span>
        </motion.div>
    );
}
