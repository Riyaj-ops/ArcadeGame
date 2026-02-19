import { motion } from "motion/react";
import { useChaos } from "./ChaosContext";

export function PixelDust() {
    const { stability, currentUniverse } = useChaos();

    const colors: Record<string, string> = {
        DEFAULT: "#00f0ff",
        FIX_IT: "#ffff00",
        SUGAR_RUSH: "#ff006e",
        HEROS_DUTY: "#39ff14",
    };

    const color = colors[currentUniverse] || colors.DEFAULT;

    return (
        <div className="fixed inset-0 pointer-events-none z-[5] overflow-hidden">
            {[...Array(20)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1 h-1"
                    style={{
                        backgroundColor: color,
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        boxShadow: `0 0 8px ${color}`,
                    }}
                    animate={{
                        y: [0, -100, 0],
                        x: [0, Math.random() * 50 - 25, 0],
                        opacity: [0.1, 0.4, 0.1],
                        scale: [1, 1.5, 1],
                    }}
                    transition={{
                        duration: Math.random() * 5 + 5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: Math.random() * 5,
                    }}
                />
            ))}
        </div>
    );
}
