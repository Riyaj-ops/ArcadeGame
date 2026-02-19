import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { useChaos } from "./ChaosContext";

export function TorchOverlay() {
    const { isPowerOutage } = useChaos();
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({ x: e.clientX, y: e.clientY });
        };

        if (isPowerOutage) {
            window.addEventListener("mousemove", handleMouseMove);
        }

        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [isPowerOutage]);

    return (
        <AnimatePresence>
            {isPowerOutage && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[999] pointer-events-none"
                    style={{
                        background: `radial-gradient(circle 150px at ${mousePos.x}px ${mousePos.y}px, transparent 0%, rgba(0,0,0,0.95) 100%)`,
                    }}
                >
                    {/* Flashlight beam glow */}
                    <div
                        className="absolute w-[300px] h-[300px] rounded-full blur-[40px] opacity-20 pointer-events-none"
                        style={{
                            left: mousePos.x - 150,
                            top: mousePos.y - 150,
                            backgroundColor: "#ffffaa",
                        }}
                    />

                    {/* Power outage text */}
                    <motion.div
                        className="absolute bottom-10 left-10 font-pixel text-[#ffff00] text-sm"
                        animate={{ opacity: [0.2, 1, 0.2] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        ⚠ CRITICAL POWER FAILURE - EMERGENCY TORCH ACTIVE
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
