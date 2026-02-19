import { useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { GlitchText } from "../components/GlitchText";
import { CRTOverlay } from "../components/CRTOverlay";
import { Sparkles, Zap } from "lucide-react";

export function TransitionScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/dashboard");
    }, 4000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      <CRTOverlay />

      {/* Warp tunnel background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(circle at center, #bf40bf 0%, #0a0a2e 50%, #000000 100%)",
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        />
        
        {/* Rotating rings */}
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute top-1/2 left-1/2 border-2 rounded-full"
            style={{
              borderColor: i % 2 === 0 ? "#00f0ff" : "#ff006e",
              boxShadow: `0 0 20px ${i % 2 === 0 ? "#00f0ff" : "#ff006e"}`,
            }}
            animate={{
              width: [0, 800],
              height: [0, 800],
              x: [0, -400],
              y: [0, -400],
              opacity: [1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.4,
            }}
          />
        ))}

        {/* Particle stream */}
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              left: "50%",
              top: "50%",
              backgroundColor: ["#00f0ff", "#ff006e", "#39ff14", "#ffff00"][i % 4],
              boxShadow: `0 0 10px ${["#00f0ff", "#ff006e", "#39ff14", "#ffff00"][i % 4]}`,
            }}
            animate={{
              x: [0, (Math.cos((i / 30) * Math.PI * 2) * 1000)],
              y: [0, (Math.sin((i / 30) * Math.PI * 2) * 1000)],
              opacity: [1, 0],
              scale: [1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: (i / 30) * 2,
            }}
          />
        ))}
      </div>

      {/* Portal glow */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full"
        style={{
          background: "radial-gradient(circle, #00f0ff44 0%, transparent 70%)",
        }}
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            }}
            className="mb-6"
          >
            <Sparkles className="w-24 h-24 text-[#00f0ff] mx-auto" style={{ filter: "drop-shadow(0 0 20px #00f0ff)" }} />
          </motion.div>

          <motion.h1
            className="text-4xl mb-4"
            style={{
              fontFamily: "var(--font-pixel)",
              textShadow: "0 0 30px #00f0ff",
            }}
            animate={{
              opacity: [1, 0.7, 1],
              textShadow: [
                "0 0 30px #00f0ff",
                "0 0 50px #00f0ff, 0 0 70px #ff006e",
                "0 0 30px #00f0ff",
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          >
            <GlitchText glitchIntensity="high">ENTERING UNIVERSE</GlitchText>
          </motion.h1>

          <motion.div
            className="space-y-2"
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
            }}
          >
            <div className="flex items-center justify-center gap-2 text-[#00f0ff]">
              <Zap className="w-4 h-4" />
              <p className="text-sm">Dissolving pixel barriers...</p>
              <Zap className="w-4 h-4" />
            </div>
            <p className="text-xs text-white/50">Reality synchronization in progress</p>
          </motion.div>

          {/* Loading dots */}
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.div
                key={i}
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor: ["#00f0ff", "#ff006e", "#39ff14", "#ffff00", "#bf40bf"][i],
                  boxShadow: `0 0 10px ${["#00f0ff", "#ff006e", "#39ff14", "#ffff00", "#bf40bf"][i]}`,
                }}
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* Glitch overlay effect */}
        <motion.div
          className="absolute inset-0"
          animate={{
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 0.1,
            repeat: Infinity,
            repeatDelay: 2,
          }}
          style={{
            background: "repeating-linear-gradient(0deg, #ff006e 0px, transparent 2px, transparent 4px, #00f0ff 6px)",
            mixBlendMode: "screen",
          }}
        />
      </div>

      {/* Pixel dissolve effect */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-full h-1"
            style={{
              top: `${(i / 20) * 100}%`,
              backgroundColor: "#00f0ff",
              opacity: 0.1,
            }}
            animate={{
              x: ["-100%", "100%"],
            }}
            transition={{
              duration: 0.5,
              repeat: Infinity,
              delay: i * 0.1,
            }}
          />
        ))}
      </div>
    </div>
  );
}
