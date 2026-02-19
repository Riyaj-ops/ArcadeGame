import { useState } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { useAchievements, AchievementDisplay } from "../components/AchievementSystem";
import { useSound } from "../components/SoundSystem";
import { ChaoticButtonEnhanced } from "../components/ChaoticButtonEnhanced";
import { ArcadeCard } from "../components/ArcadeCard";
import { GlitchTextEnhanced } from "../components/GlitchTextEnhanced";

export function AchievementsScreen() {
  const navigate = useNavigate();
  const { getUnlockedCount, getTotalCount } = useAchievements();
  const { playClickSound } = useSound();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0014] via-[#1a0033] to-[#000011] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <h2 className="text-4xl font-pixel text-[#00f0ff] mb-4 chaos-text" data-text="ACHIEVEMENTS">
            ACHIEVEMENTS
          </h2>
          <p className="text-white/70 font-pixel">
            {getUnlockedCount()} / {getTotalCount()} UNLOCKED
          </p>
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center gap-4 mb-8"
        >
          <ChaoticButtonEnhanced
            onClick={() => {
              playClickSound();
              navigate('/dashboard');
            }}
            variant="blue"
          >
            BACK TO DASHBOARD
          </ChaoticButtonEnhanced>
        </motion.div>

        {/* Achievements Display */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <ArcadeCard glowColor="#00f0ff" className="p-6">
            <AchievementDisplay />
          </ArcadeCard>
        </motion.div>
      </div>
    </div>
  );
}
