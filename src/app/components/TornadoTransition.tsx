import { motion, AnimatePresence } from "motion/react";
import { useChaos } from "./ChaosContext";

export function TornadoTransition() {
    const { currentUniverse, stability, isChaosMode } = useChaos();
    
    // Trigger tornado effect based on chaos level
    const shouldShowTornado = isChaosMode || stability < 30;
    
    return (
        <AnimatePresence>
            {shouldShowTornado && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 pointer-events-none z-[1400]"
                >
                    {/* Tornado vortex */}
                    <motion.div
                        className="absolute inset-0"
                        animate={{
                            background: `conic-gradient(from ${Date.now() * 0.1}deg at 50% 50%, 
                                transparent 0deg, 
                                rgba(147, 51, 234, 0.3) 60deg, 
                                rgba(236, 72, 153, 0.4) 120deg, 
                                rgba(59, 130, 246, 0.3) 180deg, 
                                rgba(34, 197, 94, 0.3) 240deg, 
                                rgba(251, 146, 60, 0.4) 300deg, 
                                transparent 360deg)`
                        }}
                        transition={{ duration: 0.1 }}
                    />
                    
                    {/* Spiral particles */}
                    {[...Array(20)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-2 h-2 bg-white rounded-full"
                            style={{
                                left: '50%',
                                top: '50%',
                                boxShadow: '0 0 10px rgba(255,255,255,0.8)'
                            }}
                            animate={{
                                transform: [
                                    `translate(-50%, -50%) rotate(${i * 18}deg) translateX(20px)`,
                                    `translate(-50%, -50%) rotate(${i * 18 + 360}deg) translateX(300px)`,
                                    `translate(-50%, -50%) rotate(${i * 18 + 720}deg) translateX(20px)`
                                ],
                                opacity: [0, 1, 0],
                                scale: [0.5, 1.5, 0.5]
                            }}
                            transition={{
                                duration: 2 + i * 0.1,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                        />
                    ))}
                    
                    {/* Debris particles */}
                    {[...Array(15)].map((_, i) => (
                        <motion.div
                            key={`debris-${i}`}
                            className="absolute w-1 h-3 bg-gradient-to-b from-purple-400 to-pink-400"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                            }}
                            animate={{
                                y: [-20, window.innerHeight + 20],
                                x: [0, (Math.random() - 0.5) * 200],
                                rotate: [0, 720],
                                opacity: [0, 1, 1, 0]
                            }}
                            transition={{
                                duration: 3 + Math.random() * 2,
                                repeat: Infinity,
                                delay: Math.random() * 3,
                                ease: "easeIn"
                            }}
                        />
                    ))}
                    
                    {/* Central vortex */}
                    <motion.div
                        className="absolute top-1/2 left-1/2 w-32 h-32 rounded-full"
                        style={{
                            background: 'radial-gradient(circle, rgba(147,51,234,0.8) 0%, transparent 70%)',
                            transform: 'translate(-50%, -50%)'
                        }}
                        animate={{
                            scale: [1, 1.5, 1],
                            rotate: [0, 360]
                        }}
                        transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
