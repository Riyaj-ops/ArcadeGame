import { useState } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { useDailyChallenges, DailyChallengesDisplay, LeaderboardDisplay } from "../components/DailyChallenges";
import { useSound } from "../components/SoundSystem";
import { ChaoticButtonEnhanced } from "../components/ChaoticButtonEnhanced";
import { ArcadeCard } from "../components/ArcadeCard";

export function DailyChallengesScreen() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'challenges' | 'leaderboard'>('challenges');
  const { getCompletedCount, getTotalRewardPoints } = useDailyChallenges();
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
          <h2 className="text-4xl font-pixel text-[#ffff00] mb-4 chaos-text" data-text="DAILY CHALLENGES">
            DAILY CHALLENGES
          </h2>
          <p className="text-white/70 font-pixel">
            {getCompletedCount()} COMPLETED • {getTotalRewardPoints()} STABILITY EARNED
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

        {/* Tab Navigation */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center gap-4 mb-6"
        >
          <button
            onClick={() => {
              playClickSound();
              setActiveTab('challenges');
            }}
            className={`px-6 py-2 font-pixel text-sm rounded transition-all ${
              activeTab === 'challenges'
                ? 'bg-[#ffff00] text-black'
                : 'bg-black/50 text-white/70 border border-white/20'
            }`}
          >
            CHALLENGES
          </button>
          <button
            onClick={() => {
              playClickSound();
              setActiveTab('leaderboard');
            }}
            className={`px-6 py-2 font-pixel text-sm rounded transition-all ${
              activeTab === 'leaderboard'
                ? 'bg-[#ffff00] text-black'
                : 'bg-black/50 text-white/70 border border-white/20'
            }`}
          >
            LEADERBOARD
          </button>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <ArcadeCard glowColor="#ffff00" className="p-6">
            {activeTab === 'challenges' ? <DailyChallengesDisplay /> : <LeaderboardDisplay />}
          </ArcadeCard>
        </motion.div>
      </div>
    </div>
  );
}
