import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { useChaos } from "./ChaosContext";

interface FloatingButton {
    id: string;
    text: string;
    x: number;
    y: number;
    vx: number;
    vy: number;
    rotation: number;
    color: string;
}

export function ZeroGravityButtons() {
    const { stability, isChaosMode } = useChaos();
    const [floatingButtons, setFloatingButtons] = useState<FloatingButton[]>([]);
    
    const buttonTexts = [
        "WRECK IT", "GLITCH", "CHAOS", "RALPH", "FIX IT", 
        "SUGAR RUSH", "HERO DUTY", "VANELLOPE", "FELIX", "TURBO"
    ];
    
    const colors = ["#ff006e", "#00f0ff", "#ffff00", "#39ff14", "#ff40bf", "#bf40bf"];
    
    useEffect(() => {
        // Create floating buttons when chaos is high
        if (isChaosMode || stability < 40) {
            const interval = setInterval(() => {
                setFloatingButtons(prev => {
                    // Remove old buttons
                    const filtered = prev.filter(btn => Date.now() - parseInt(btn.id) < 8000);
                    
                    // Add new button
                    if (filtered.length < 8 && Math.random() > 0.3) {
                        const newButton: FloatingButton = {
                            id: Date.now().toString(),
                            text: buttonTexts[Math.floor(Math.random() * buttonTexts.length)],
                            x: Math.random() * window.innerWidth,
                            y: window.innerHeight + 50,
                            vx: (Math.random() - 0.5) * 2,
                            vy: -Math.random() * 3 - 1,
                            rotation: Math.random() * 360,
                            color: colors[Math.floor(Math.random() * colors.length)]
                        };
                        return [...filtered, newButton];
                    }
                    
                    return filtered;
                });
            }, 500);
            
            return () => clearInterval(interval);
        } else {
            // Clear buttons when stability is high
            setFloatingButtons([]);
        }
    }, [stability, isChaosMode]);
    
    // Update button positions
    useEffect(() => {
        const interval = setInterval(() => {
            setFloatingButtons(prev => prev.map(btn => {
                let newX = btn.x + btn.vx;
                let newY = btn.y + btn.vy;
                let newVx = btn.vx;
                let newVy = btn.vy;
                
                // Bounce off walls
                if (newX <= 0 || newX >= window.innerWidth - 100) {
                    newVx = -newVx * 0.8;
                    newX = newX <= 0 ? 0 : window.innerWidth - 100;
                }
                
                // Add some random movement
                newVx += (Math.random() - 0.5) * 0.2;
                newVy += (Math.random() - 0.5) * 0.1;
                
                // Apply slight gravity pull
                newVy += 0.05;
                
                return {
                    ...btn,
                    x: newX,
                    y: newY,
                    vx: newVx,
                    vy: newVy,
                    rotation: btn.rotation + 2
                };
            }));
        }, 50);
        
        return () => clearInterval(interval);
    }, []);
    
    return (
        <AnimatePresence>
            {floatingButtons.map(button => (
                <motion.div
                    key={button.id}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    className="fixed pointer-events-none z-[800]"
                    style={{
                        left: button.x,
                        top: button.y,
                        transform: `rotate(${button.rotation}deg)`
                    }}
                >
                    <motion.div
                        className="px-4 py-2 rounded-full border-2 font-bold text-sm cursor-pointer pointer-events-auto"
                        style={{
                            borderColor: button.color,
                            color: button.color,
                            backgroundColor: 'rgba(0,0,0,0.8)',
                            boxShadow: `0 0 20px ${button.color}`,
                            fontFamily: 'var(--font-pixel), monospace'
                        }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        animate={{
                            filter: [
                                `hue-rotate(0deg) brightness(1)`,
                                `hue-rotate(180deg) brightness(1.5)`,
                                `hue-rotate(360deg) brightness(1)`
                            ]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        onClick={() => {
                            // Button click effect
                            setFloatingButtons(prev => prev.filter(b => b.id !== button.id));
                        }}
                    >
                        {button.text}
                    </motion.div>
                    
                    {/* Glow trail */}
                    <motion.div
                        className="absolute inset-0 rounded-full"
                        style={{
                            background: `radial-gradient(circle, ${button.color}40 0%, transparent 70%)`,
                            filter: 'blur(10px)'
                        }}
                        animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.5, 0.8, 0.5]
                        }}
                        transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                </motion.div>
            ))}
        </AnimatePresence>
    );
}
