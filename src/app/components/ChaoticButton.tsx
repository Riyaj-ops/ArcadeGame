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

export function ChaoticButton({ children, onClick, variant, className }: ChaoticButtonProps) {
    const { stability, glitchIntensity } = useChaos();
    const [isBroken, setIsBroken] = useState(false);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const buttonRef = useRef<HTMLDivElement>(null);
    const controls = useAnimation();

    // "Run away" behavior
    const handleMouseEnter = () => {
        if (stability < 40 && Math.random() > 0.5) {
            const moveX = (Math.random() - 0.5) * 200;
            const moveY = (Math.random() - 0.5) * 200;
            setOffset({ x: moveX, y: moveY });

            // Return after a delay
            setTimeout(() => setOffset({ x: 0, y: 0 }), 2000);
        }

        // Occasional break
        if (stability < 30 && Math.random() > 0.9) {
            setIsBroken(true);
        }
    };

    const handleRepair = () => {
        setIsBroken(false);
        if (onClick) onClick();
    };

    if (isBroken) {
        return (
            <div className="relative inline-block">
                <div className="flex flex-wrap gap-1 max-w-[150px] p-2 border-2 border-dashed border-red-500 opacity-50">
                    {[...Array(6)].map((_, i) => (
                        <motion.div
                            key={i}
                            drag
                            dragConstraints={{ top: -50, left: -50, right: 50, bottom: 50 }}
                            onDragEnd={() => {
                                if (Math.random() > 0.7) handleRepair();
                            }}
                            className="w-8 h-4 bg-red-500/20 border border-red-500 flex items-center justify-center cursor-pointer"
                        >
                            <span className="text-[8px] text-red-500 font-pixel">FRAG</span>
                        </motion.div>
                    ))}
                </div>
                <p className="absolute -bottom-6 left-0 right-0 text-center font-pixel text-[8px] text-red-500 animate-pulse">
                    REPAIR BUTTON TO CONTINUE
                </p>
            </div>
        );
    }

    return (
        <motion.div
            ref={buttonRef}
            animate={{
                x: offset.x,
                y: offset.y,
                skewX: stability < 50 ? (Math.random() - 0.5) * 10 : 0,
                filter: stability < 20 ? `hue-rotate(${Math.random() * 360}deg)` : 'none'
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            onMouseEnter={handleMouseEnter}
            className="inline-block"
        >
            <NeonButton
                variant={variant}
                onClick={onClick}
                className={className}
            >
                <motion.span
                    animate={stability < 30 ? {
                        opacity: [1, 0.5, 1],
                        x: [0, -2, 2, 0]
                    } : {}}
                    transition={{ repeat: Infinity, duration: 0.2 }}
                >
                    {children}
                </motion.span>
            </NeonButton>
        </motion.div>
    );
}
