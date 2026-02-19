import { motion, AnimatePresence } from "motion/react";
import { useChaos } from "./ChaosContextEnhanced";

export function TorchOverlayEnhanced() {
    const { isPowerOutage, isLoggingOut } = useChaos();

    return (
        <AnimatePresence>
            {(isPowerOutage || isLoggingOut) && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/95 z-[9998] pointer-events-none"
                >
                    {/* Enhanced Torch Cursor - Much Larger */}
                    <motion.div
                        className="fixed w-96 h-96 rounded-full pointer-events-none z-[9999]"
                        style={{
                            background: `radial-gradient(circle, rgba(255, 255, 255, ${isLoggingOut ? 0.95 : 0.9}) 0%, transparent 70%)`,
                            mixBlendMode: "screen",
                            boxShadow: isLoggingOut 
                                ? `0 0 100px rgba(255, 0, 110, 0.8), 0 0 200px rgba(255, 46, 209, 0.6), 0 0 300px rgba(0, 229, 255, 0.4)`
                                : `0 0 50px rgba(255, 255, 255, 0.8), 0 0 100px rgba(200, 200, 255, 0.6), 0 0 150px rgba(150, 150, 255, 0.4)`
                        }}
                        animate={{
                            scale: isLoggingOut ? [1, 1.2, 1.1, 1.3] : [1, 1.1, 1],
                            rotate: isLoggingOut ? [0, 5, -5, 3, -3, 0] : [0, 2, -2, 1, -1, 0]
                        }}
                        transition={{
                            duration: isLoggingOut ? 0.3 : 2,
                            repeat: isLoggingOut ? Infinity : 0,
                            ease: "easeInOut"
                        }}
                    />

                    {/* Chaotic Light Beams */}
                    {isLoggingOut && (
                        <>
                            {[...Array(6)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute w-2 h-32 bg-gradient-to-b from-red-500/50 to-transparent"
                                    style={{
                                        left: `${20 + i * 15}%`,
                                        top: '50%',
                                        transform: 'translateY(-50%)'
                                    }}
                                    animate={{
                                        opacity: [0, 1, 0],
                                        scaleY: [0, 1, 0]
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        delay: i * 0.3,
                                        ease: "easeInOut"
                                    }}
                                />
                            ))}
                        </>
                    )}

                    {/* Warning Messages */}
                    <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-center z-[10000]">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-2"
                        >
                            {isLoggingOut && (
                                <motion.h2
                                    className="text-2xl font-bold text-red-500"
                                    animate={{
                                        opacity: [1, 0.5, 1],
                                        scale: [1, 1.1, 1]
                                    }}
                                    transition={{
                                        duration: 0.5,
                                        repeat: Infinity
                                    }}
                                    style={{
                                        fontFamily: "var(--font-display)",
                                        textShadow: "0 0 20px rgba(255, 0, 0, 0.8)"
                                    }}
                                >
                                    ⚠️ CHAOTIC LOGOUT INITIATED ⚠️
                                </motion.h2>
                            )}
                            <motion.p
                                className="text-sm text-white/80"
                                animate={{
                                    opacity: [0.7, 1, 0.7]
                                }}
                                transition={{
                                    duration: 1,
                                    repeat: Infinity
                                }}
                            >
                                {isLoggingOut ? "SYSTEM DESTABILIZING..." : "POWER OUTAGE DETECTED"}
                            </motion.p>
                        </motion.div>
                    </div>

                    {/* Particle Effects */}
                    <div className="absolute inset-0 pointer-events-none">
                        {[...Array(isLoggingOut ? 30 : 15)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute w-1 h-1 rounded-full"
                                style={{
                                    backgroundColor: isLoggingOut 
                                        ? ['#ff006e', '#ff00ff', '#ffff00', '#00ff00'][i % 4]
                                        : ['#ffffff', '#cccccc', '#999999'][i % 3],
                                    left: `${Math.random() * 100}%`,
                                    top: `${Math.random() * 100}%`
                                }}
                                animate={{
                                    opacity: [0, 1, 0],
                                    scale: [0, 1, 0],
                                    y: [0, (Math.random() - 0.5) * 100, 0]
                                }}
                                transition={{
                                    duration: isLoggingOut ? 1 + Math.random() * 2 : 3 + Math.random() * 2,
                                    repeat: Infinity,
                                    delay: Math.random() * 2
                                }}
                            />
                        ))}
                    </div>

                    {/* Vignette Effect */}
                    <div 
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            background: `radial-gradient(ellipse at center, transparent ${isLoggingOut ? 40 : 60}%, rgba(0, 0, 0, ${isLoggingOut ? 0.95 : 0.9}) 100%)`
                        }}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
