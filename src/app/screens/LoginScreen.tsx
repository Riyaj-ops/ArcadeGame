import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { GlitchText } from "../components/GlitchText";
import { NeonButton } from "../components/NeonButton";
import { ArcadeCard } from "../components/ArcadeCard";
import { CRTOverlay } from "../components/CRTOverlay";
import { PixelBackground } from "../components/PixelBackground";
import { CheatConsole } from "../components/CheatConsole";
import { AchievementToast } from "../components/AchievementToast";
import { GlitchPopup } from "../components/GlitchPopup";
import { Shuffle, Lock, Unlock } from "lucide-react";

const LETTERS = ["A", "R", "C", "D", "E"];
const CORRECT_CODE = "ARCADE";

export function LoginScreen() {
  const navigate = useNavigate();
  const [selectedLetters, setSelectedLetters] = useState<string[]>([]);
  const [shuffledLetters, setShuffledLetters] = useState([...LETTERS].sort(() => Math.random() - 0.5));
  const [pin, setPin] = useState("");
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [showCheatConsole, setShowCheatConsole] = useState(false);
  const [showAchievement, setShowAchievement] = useState(false);
  const [showGlitch, setShowGlitch] = useState(false);

  useEffect(() => {
    // Keyboard shortcuts
    const handleKeyPress = (e: KeyboardEvent) => {
      // Toggle cheat console with ~ key
      if (e.key === "`" || e.key === "~") {
        e.preventDefault();
        setShowCheatConsole(prev => !prev);
      }
      // ESC to close console
      if (e.key === "Escape" && showCheatConsole) {
        setShowCheatConsole(false);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    
    // Show random glitch popup
    const glitchTimer = setTimeout(() => {
      setShowGlitch(true);
    }, 5000);

    // Show achievement after some time
    const achievementTimer = setTimeout(() => {
      setShowAchievement(true);
    }, 8000);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      clearTimeout(glitchTimer);
      clearTimeout(achievementTimer);
    };
  }, [showCheatConsole]);

  const handleLetterClick = (letter: string) => {
    if (selectedLetters.length < 6) {
      setSelectedLetters([...selectedLetters, letter]);
    }
  };

  const handleShuffle = () => {
    setShuffledLetters([...shuffledLetters].sort(() => Math.random() - 0.5));
  };

  const handleClear = () => {
    setSelectedLetters([]);
  };

  const handleUnlock = () => {
    const code = selectedLetters.join("");
    if (code === CORRECT_CODE) {
      setIsUnlocking(true);
      setTimeout(() => {
        navigate("/boot");
      }, 2000);
    } else {
      // Shake animation on wrong code
      setSelectedLetters([]);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden">
      <PixelBackground />
      <CRTOverlay />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-2xl"
      >
        {/* System Warning */}
        <motion.div
          className="mb-8 text-center"
          animate={{
            opacity: [1, 0.5, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        >
          <GlitchText className="text-[#ff006e] text-sm mb-2" glitchIntensity="high">
            ⚠ SYSTEM ACCESS RESTRICTED ⚠
          </GlitchText>
        </motion.div>

        {/* Main Card */}
        <ArcadeCard glowColor="#00f0ff">
          <div className="text-center mb-8">
            <motion.h1
              className="text-4xl mb-2"
              style={{ fontFamily: "var(--font-pixel)" }}
              animate={{
                textShadow: [
                  "0 0 20px #00f0ff",
                  "0 0 40px #00f0ff",
                  "0 0 20px #00f0ff",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <GlitchText glitchIntensity="low">ARCADE MULTIVERSE OS</GlitchText>
            </motion.h1>
            <p className="text-[#00f0ff]/70 text-sm">v2.0.26 // Glitch Control System</p>
          </div>

          {/* Access Key Display */}
          <div className="mb-6">
            <p className="text-center text-sm text-[#00f0ff] mb-3">RECONSTRUCT ACCESS KEY</p>
            <div className="flex justify-center gap-2 mb-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="w-12 h-12 border-2 border-[#00f0ff] bg-black/50 flex items-center justify-center"
                  style={{
                    boxShadow: selectedLetters[i] ? "0 0 10px #00f0ff" : "none",
                  }}
                  animate={selectedLetters[i] ? {
                    scale: [1, 1.1, 1],
                  } : {}}
                >
                  <span className="text-xl text-[#00f0ff]" style={{ fontFamily: "var(--font-pixel)" }}>
                    {selectedLetters[i] || "?"}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Letter Keypad */}
          <div className="mb-6">
            <div className="grid grid-cols-5 gap-2 mb-4">
              {shuffledLetters.map((letter, index) => (
                <motion.button
                  key={`${letter}-${index}`}
                  onClick={() => handleLetterClick(letter)}
                  className="aspect-square border-2 border-[#bf40bf] bg-black/70 hover:bg-[#bf40bf]/20 
                    flex items-center justify-center transition-all"
                  style={{
                    boxShadow: "0 0 10px #bf40bf44",
                  }}
                  whileHover={{ 
                    scale: 1.1,
                    boxShadow: "0 0 20px #bf40bf",
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-2xl text-[#bf40bf]" style={{ fontFamily: "var(--font-pixel)" }}>
                    {letter}
                  </span>
                </motion.button>
              ))}
            </div>

            <div className="flex gap-2">
              <NeonButton onClick={handleShuffle} variant="purple" className="flex-1">
                <Shuffle className="inline-block w-4 h-4 mr-2" />
                SHUFFLE
              </NeonButton>
              <NeonButton onClick={handleClear} variant="pink" className="flex-1">
                CLEAR
              </NeonButton>
            </div>
          </div>

          {/* PIN Wheel */}
          <div className="mb-6">
            <p className="text-center text-sm text-[#39ff14] mb-3">SECURITY PIN</p>
            <input
              type="number"
              value={pin}
              onChange={(e) => setPin(e.target.value.slice(0, 4))}
              placeholder="0000"
              className="w-full bg-black/50 border-2 border-[#39ff14] text-[#39ff14] text-center p-3 
                focus:outline-none focus:border-[#39ff14] focus:shadow-[0_0_20px_#39ff14]"
              style={{ fontFamily: "var(--font-pixel)" }}
              maxLength={4}
            />
          </div>

          {/* Unlock Button */}
          <NeonButton
            onClick={handleUnlock}
            variant="blue"
            className="w-full"
            disabled={selectedLetters.length !== 6 || pin.length !== 4}
          >
            {isUnlocking ? (
              <>
                <Unlock className="inline-block w-5 h-5 mr-2 animate-pulse" />
                AUTHENTICATING...
              </>
            ) : (
              <>
                <Lock className="inline-block w-5 h-5 mr-2" />
                UNLOCK SYSTEM
              </>
            )}
          </NeonButton>

          {/* Status Messages */}
          <motion.div
            className="mt-6 text-center text-xs"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <p className="text-[#00f0ff]/60">Authenticating timeline...</p>
            <p className="text-[#ff006e]/60 mt-1">⚠ Warning: Glitch detection active</p>
          </motion.div>
        </ArcadeCard>

        {/* Hint */}
        <motion.p
          className="text-center text-xs text-[#00f0ff]/40 mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          Hint: The code might be in the name... PIN: 1234
        </motion.p>
        
        {/* Keyboard Hint */}
        <motion.p
          className="text-center text-xs text-[#bf40bf]/40 mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          Press ~ to open cheat console
        </motion.p>
      </motion.div>

      {/* Floating Glitch Particles */}
      {Array.from({ length: 10 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-[#ff006e]"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            boxShadow: "0 0 10px #ff006e",
          }}
          animate={{
            x: [0, Math.random() * 100 - 50, 0],
            y: [0, Math.random() * 100 - 50, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}

      {/* Cheat Console */}
      <CheatConsole 
        show={showCheatConsole}
        onClose={() => setShowCheatConsole(false)}
      />

      {/* Achievement Toast */}
      <AchievementToast
        show={showAchievement}
        title="Glitch Hunter"
        description="You've entered the arcade multiverse!"
        onClose={() => setShowAchievement(false)}
      />

      {/* Glitch Popup */}
      <GlitchPopup
        show={showGlitch}
        message="Reality instability detected in sector 7"
        onClose={() => setShowGlitch(false)}
      />
    </div>
  );
}