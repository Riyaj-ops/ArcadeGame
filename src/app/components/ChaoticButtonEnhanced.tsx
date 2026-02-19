import { motion, useAnimation } from "motion/react";
import { useState, useEffect, useRef } from "react";
import { NeonButton } from "./NeonButton";
import { useChaos } from "./ChaosContext";

interface ChaoticButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: "blue" | "pink" | "green" | "yellow" | "purple";
    className?: string;
    enableZeroGravity?: boolean; // NEW: Enable zero gravity floating
}

export function ChaoticButtonEnhanced({ children, onClick, variant, className, enableZeroGravity = true }: ChaoticButtonProps) {
    const { stability, glitchIntensity, isChaosMode, zeroGravityActive, tornadoActive, continuousGlitchActive } = useChaos();
    const [isBroken, setIsBroken] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [isFloating, setIsFloating] = useState(false);
    const [floatPosition, setFloatPosition] = useState({ x: 0, y: 0 });
    const [rotation, setRotation] = useState(0);
    const buttonRef = useRef<HTMLDivElement>(null);
    const controls = useAnimation();

    // Enhanced "Run away" behavior
    const handleMouseEnter = () => {
        if ((stability < 40 || isChaosMode) && Math.random() > 0.3) {
            const moveX = (Math.random() - 0.5) * (isChaosMode ? 400 : 200);
            const moveY = (Math.random() - 0.5) * (isChaosMode ? 400 : 200);
            setOffset({ x: moveX, y: moveY });

            // Return after a delay
            setTimeout(() => setOffset({ x: 0, y: 0 }), isChaosMode ? 1000 : 2000);
        }

        // More frequent breaks in chaos mode
        if ((stability < 30 || isChaosMode) && Math.random() > (isChaosMode ? 0.7 : 0.9)) {
            setIsBroken(true);
        }
    };

    const handleRepair = () => {
        setIsBroken(false);
        if (onClick) onClick();
    };

    // Zero gravity floating effect
    useEffect(() => {
        if (enableZeroGravity && (zeroGravityActive || isChaosMode)) {
            setIsFloating(true);
            
            const floatInterval = setInterval(() => {
                setFloatPosition(prev => ({
                    x: prev.x + (Math.random() - 0.5) * 10,
                    y: prev.y + (Math.random() - 0.5) * 10 - 2 // Slight upward bias
                }));
                setRotation(prev => prev + (Math.random() - 0.5) * 10);
            }, 50);
            
            return () => clearInterval(floatInterval);
        } else {
            setIsFloating(false);
            setFloatPosition({ x: 0, y: 0 });
            setRotation(0);
        }
    }, [zeroGravityActive, isChaosMode, enableZeroGravity]);
    
    // Tornado effect
    useEffect(() => {
        if (tornadoActive) {
            const tornadoInterval = setInterval(() => {
                const angle = Date.now() * 0.01;
                const radius = 100 + Math.sin(Date.now() * 0.001) * 50;
                setFloatPosition({
                    x: Math.cos(angle) * radius,
                    y: Math.sin(angle) * radius
                });
                setRotation(prev => prev + 15);
            }, 50);
            
            return () => clearInterval(tornadoInterval);
        }
    }, [tornadoActive]);

    // Continuous glitch effect
    const shouldGlitch = continuousGlitchActive || isChaosMode || glitchIntensity > 0.5;

    if (isBroken) {
        return (
            <div className="relative inline-block">
                <div className={`flex flex-wrap gap-1 max-w-[150px] p-2 border-2 border-dashed border-red-500 opacity-50 ${
                    isChaosMode ? 'animate-pulse' : ''
                }`}
                     style={{
                         animation: isChaosMode ? 'shake 0.1s infinite' : 'none'
                     }}>
                    {[...Array(isChaosMode ? 9 : 6)].map((_, i) => (
                        <motion.div
                            key={i}
                            drag={isChaosMode}
                            dragConstraints={{ top: isChaosMode ? -200 : -50, left: isChaosMode ? -200 : -50, right: isChaosMode ? 200 : 50, bottom: isChaosMode ? 200 : 50 }}
                            onDragEnd={() => {
                                if (Math.random() > (isChaosMode ? 0.3 : 0.7)) handleRepair();
                            }}
                            className={`w-8 h-4 bg-red-500/20 border border-red-500 flex items-center justify-center cursor-pointer ${
                                isChaosMode ? 'animate-pulse' : ''
                            }`}
                        >
                            <motion.span 
                                className="text-[8px] text-red-500 font-pixel"
                                animate={isChaosMode ? {
                                    opacity: [1, 0.3, 1],
                                    scale: [1, 1.2, 1]
                                } : {}}
                                transition={{ duration: 0.2, repeat: Infinity }}
                            >
                                FRAG
                            </motion.span>
                        </motion.div>
                    ))}
                </div>
                <motion.p 
                    className="absolute -bottom-6 left-0 right-0 text-center font-pixel text-[8px] text-red-500"
                    animate={isChaosMode ? {
                        opacity: [0.5, 1, 0.5],
                        scale: [1, 1.1, 1]
                    } : { opacity: 1 }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                >
                    {isChaosMode ? '🔧 REPAIR OR FACE CHAOS! 🔧' : 'REPAIR BUTTON TO CONTINUE'}
                </motion.p>
            </div>
        );
    }

    return (
        <>
            <motion.div
                ref={buttonRef}
                animate={{
                    x: isFloating ? floatPosition.x : offset.x,
                    y: isFloating ? floatPosition.y : offset.y,
                    rotate: isFloating ? rotation : (stability < 50 ? (Math.random() - 0.5) * 10 : 0),
                    filter: shouldGlitch ? `hue-rotate(${Math.random() * 360}deg) saturate(${1 + Math.random()})` : (stability < 20 ? `hue-rotate(${Math.random() * 360}deg)` : 'none')
                }}
                transition={{ 
                    type: isFloating ? "tween" : "spring", 
                    stiffness: isFloating ? 0 : 300, 
                    damping: isFloating ? 0 : 20,
                    duration: isFloating ? 0.05 : undefined
                }}
                onMouseEnter={handleMouseEnter}
                className={`inline-block ${isFloating ? 'z-50' : ''}`}
            >
                <NeonButton
                    variant={variant}
                    onClick={isBroken ? undefined : onClick}
                    className={className}
                >
                    <motion.span
                        animate={shouldGlitch ? {
                            opacity: [1, 0.3, 1, 0.8, 1],
                            x: [0, -3, 3, -1, 1, 0],
                            y: [0, 1, -1, 2, -2, 0],
                            scale: [1, 1.1, 0.9, 1.05, 0.95, 1],
                            filter: [`hue-rotate(0deg)`, `hue-rotate(90deg)`, `hue-rotate(180deg)`, `hue-rotate(270deg)`, `hue-rotate(360deg)`]
                        } : stability < 30 ? {
                            opacity: [1, 0.5, 1],
                            x: [0, -2, 2, 0]
                        } : {}}
                        transition={{ 
                            repeat: shouldGlitch ? Infinity : 0, 
                            duration: shouldGlitch ? 0.1 : 0.2 
                        }}
                    >
                        {shouldGlitch ? (
                            <>
                                <motion.span className="absolute inset-0" style={{ color: '#ff006e' }}>
                                    {children}
                                </motion.span>
                                <motion.span className="absolute inset-0" style={{ color: '#00f0ff' }}>
                                    {children}
                                </motion.span>
                                <motion.span className="absolute inset-0" style={{ color: '#ffff00' }}>
                                    {children}
                                </motion.span>
                            </>
                        ) : null}
                        {children}
                        {shouldGlitch && (
                            <motion.div
                                className="absolute inset-0 rounded-lg"
                                style={{ background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.2), transparent)' }}
                                animate={{ x: ['-100%', '100%'] }}
                                transition={{ duration: 1, repeat: Infinity }}
                            />
                        )}
                    </motion.span>
                </NeonButton>
            </motion.div>
            
            {/* Add shake animation for chaos mode */}
            {isChaosMode && (
                <style dangerouslySetInnerHTML={{
                    __html: `
                        @keyframes shake {
                            0%, 100% { transform: translate(0, 0) rotate(0deg); }
                            25% { transform: translate(-2px, 2px) rotate(1deg); }
                            50% { transform: translate(2px, -2px) rotate(-1deg); }
                            75% { transform: translate(-2px, -2px) rotate(2deg); }
                        }
                    `
                }} />
            )}
        </>
    );
}
