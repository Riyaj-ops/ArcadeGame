import { motion, AnimatePresence } from "motion/react";
import { useChaos } from "./ChaosContext";
import { useEffect, useState } from "react";

export function GlitchOverlay() {
    const { stability } = useChaos();
    const [shouldGlitch, setShouldGlitch] = useState(false);

    useEffect(() => {
        // Higher instability = more frequent glitches
        const interval = setInterval(() => {
            if (stability < 60 && Math.random() > (stability / 100)) {
                setShouldGlitch(true);
                setTimeout(() => setShouldGlitch(false), 150 + Math.random() * 200);
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [stability]);

    return (
        <AnimatePresence>
            {shouldGlitch && (
                <div className="fixed inset-0 pointer-events-none z-[2500]">
                    {/* Slice Glitch */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 0.5, 0] }}
                        className="absolute inset-0 bg-cyan-500/20 mix-blend-screen"
                        style={{ clipPath: 'inset(10% 0 85% 0)' }}
                    />
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 0.5, 0] }}
                        className="absolute inset-0 bg-magenta-500/20 mix-blend-screen"
                        style={{ clipPath: 'inset(80% 0 10% 0)' }}
                    />

                    {/* Pixelation Distortion Mockup */}
                    <motion.div
                        animate={{
                            backdropFilter: ["pixelate(2px)", "pixelate(8px)", "pixelate(1px)"],
                            x: [-10, 10, -5, 5, 0],
                        }}
                        className="absolute inset-0 pointer-events-none backdrop-blur-[1px]"
                    />

                    {/* Chromatic Shift */}
                    <div className="absolute inset-0 flex">
                        <div className="flex-1 bg-red-500/10 mix-blend-multiply animate-pulse" />
                        <div className="flex-1 bg-blue-500/10 mix-blend-screen animate-pulse" />
                    </div>
                </div>
            )}
        </AnimatePresence>
    );
}
