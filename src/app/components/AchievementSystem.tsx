import { createContext, useContext, useCallback, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: number;
  current: number;
  unlocked: boolean;
  category: 'games' | 'chaos' | 'repairs' | 'special';
  reward?: string;
}

interface AchievementContextType {
  achievements: Achievement[];
  unlockAchievement: (id: string) => void;
  updateProgress: (id: string, progress: number) => void;
  getUnlockedCount: () => number;
  getTotalCount: () => number;
  showAchievementNotification: (achievement: Achievement) => void;
}

const AchievementContext = createContext<AchievementContextType | undefined>(undefined);

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  // Game Achievements
  {
    id: 'first_game',
    name: 'GAME STARTER',
    description: 'Play your first arcade game',
    icon: '🎮',
    requirement: 1,
    current: 0,
    unlocked: false,
    category: 'games',
    reward: '+5 Stability'
  },
  {
    id: 'snake_master',
    name: 'SNAKE CHAOS MASTER',
    description: 'Score 100 points in Snake Chaos',
    icon: '🐍',
    requirement: 100,
    current: 0,
    unlocked: false,
    category: 'games',
    reward: '+10 Stability'
  },
  {
    id: 'breaker_pro',
    name: 'GLITCH BREAKER PRO',
    description: 'Score 200 points in Glitch Breaker',
    icon: '🧱',
    requirement: 200,
    current: 0,
    unlocked: false,
    category: 'games',
    reward: '+10 Stability'
  },
  {
    id: 'memory_champion',
    name: 'CHAOS MEMORY CHAMPION',
    description: 'Complete Chaos Memory in under 30 seconds',
    icon: '🧠',
    requirement: 30,
    current: 0,
    unlocked: false,
    category: 'games',
    reward: '+15 Stability'
  },
  
  // Chaos Achievements
  {
    id: 'chaos_novice',
    name: 'CHAOS NOVICE',
    description: 'Survive 5 minutes with stability below 30%',
    icon: '⚡',
    requirement: 300,
    current: 0,
    unlocked: false,
    category: 'chaos',
    reward: 'Unlock Extreme Chaos Mode'
  },
  {
    id: 'glitch_survivor',
    name: 'GLITCH SURVIVOR',
    description: 'Experience 50 glitch events',
    icon: '🌀',
    requirement: 50,
    current: 0,
    unlocked: false,
    category: 'chaos',
    reward: '+8 Stability'
  },
  
  // Repair Achievements
  {
    id: 'repair_apprentice',
    name: 'REPAIR APPRENTICE',
    description: 'Complete 10 repairs',
    icon: '🔧',
    requirement: 10,
    current: 0,
    unlocked: false,
    category: 'repairs',
    reward: '+12 Stability'
  },
  {
    id: 'forge_master',
    name: 'FORGE MASTER',
    description: 'Complete a repair with 100% accuracy',
    icon: '⚒️',
    requirement: 100,
    current: 0,
    unlocked: false,
    category: 'repairs',
    reward: '+20 Stability'
  },
  
  // Special Achievements
  {
    id: 'character_collector',
    name: 'CHARACTER COLLECTOR',
    description: 'Select all available characters',
    icon: '👥',
    requirement: 8,
    current: 0,
    unlocked: false,
    category: 'special',
    reward: 'Unlock Secret Character'
  },
  {
    id: 'logout_chaos',
    name: 'CHAOTIC EXIT',
    description: 'Experience the chaotic logout sequence',
    icon: '🚪',
    requirement: 1,
    current: 0,
    unlocked: false,
    category: 'special',
    reward: '+5 Stability'
  }
];

export function AchievementProvider({ children }: { children: React.ReactNode }) {
  const [achievements, setAchievements] = useState<Achievement[]>(INITIAL_ACHIEVEMENTS);
  const [notification, setNotification] = useState<Achievement | null>(null);

  // Load achievements from localStorage
  useEffect(() => {
    const savedAchievements = localStorage.getItem('arcade-achievements');
    if (savedAchievements) {
      try {
        setAchievements(JSON.parse(savedAchievements));
      } catch (error) {
        console.warn('Failed to load achievements:', error);
      }
    }
  }, []);

  // Save achievements to localStorage
  useEffect(() => {
    localStorage.setItem('arcade-achievements', JSON.stringify(achievements));
  }, [achievements]);

  const unlockAchievement = useCallback((id: string) => {
    setAchievements(prev => {
      const updated = prev.map(achievement => {
        if (achievement.id === id && !achievement.unlocked) {
          showAchievementNotification({ ...achievement, unlocked: true });
          return { ...achievement, unlocked: true, current: achievement.requirement };
        }
        return achievement;
      });
      return updated;
    });
  }, []);

  const updateProgress = useCallback((id: string, progress: number) => {
    setAchievements(prev => {
      const updated = prev.map(achievement => {
        if (achievement.id === id && !achievement.unlocked) {
          const newCurrent = Math.min(progress, achievement.requirement);
          if (newCurrent >= achievement.requirement) {
            showAchievementNotification({ ...achievement, unlocked: true, current: newCurrent });
            return { ...achievement, unlocked: true, current: newCurrent };
          }
          return { ...achievement, current: newCurrent };
        }
        return achievement;
      });
      return updated;
    });
  }, []);

  const getUnlockedCount = useCallback(() => {
    return achievements.filter(a => a.unlocked).length;
  }, [achievements]);

  const getTotalCount = useCallback(() => {
    return achievements.length;
  }, [achievements]);

  const showAchievementNotification = useCallback((achievement: Achievement) => {
    setNotification(achievement);
    setTimeout(() => setNotification(null), 4000);
  }, []);

  const value: AchievementContextType = {
    achievements,
    unlockAchievement,
    updateProgress,
    getUnlockedCount,
    getTotalCount,
    showAchievementNotification
  };

  return (
    <AchievementContext.Provider value={value}>
      {children}
      
      {/* Achievement Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            className="fixed top-4 right-4 z-50 bg-gradient-to-r from-[#ff006e] to-[#00f0ff] p-4 rounded-lg shadow-2xl border-2 border-white/20"
            style={{ maxWidth: '300px' }}
          >
            <div className="flex items-center gap-3">
              <div className="text-3xl">{notification.icon}</div>
              <div className="flex-1">
                <h4 className="text-white font-bold text-sm chaos-text" data-text="ACHIEVEMENT UNLOCKED!">
                  ACHIEVEMENT UNLOCKED!
                </h4>
                <p className="text-white font-pixel text-xs">{notification.name}</p>
                <p className="text-white/80 text-xs mt-1">{notification.description}</p>
                {notification.reward && (
                  <p className="text-[#ffff00] text-xs font-pixel mt-1">Reward: {notification.reward}</p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </AchievementContext.Provider>
  );
}

export function useAchievements() {
  const context = useContext(AchievementContext);
  if (!context) {
    throw new Error('useAchievements must be used within an AchievementProvider');
  }
  return context;
}

// Achievement Display Component
export function AchievementDisplay() {
  const { achievements, getUnlockedCount, getTotalCount } = useAchievements();
  
  const categories = {
    games: achievements.filter(a => a.category === 'games'),
    chaos: achievements.filter(a => a.category === 'chaos'),
    repairs: achievements.filter(a => a.category === 'repairs'),
    special: achievements.filter(a => a.category === 'special')
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-pixel text-[#00f0ff] mb-2 chaos-text" data-text="ACHIEVEMENTS">
          ACHIEVEMENTS
        </h3>
        <p className="text-white/70 font-pixel text-sm">
          {getUnlockedCount()} / {getTotalCount()} UNLOCKED
        </p>
      </div>

      {Object.entries(categories).map(([category, categoryAchievements]) => (
        <div key={category} className="space-y-3">
          <h4 className="text-lg font-pixel text-[#ffff00] uppercase">
            {category}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {categoryAchievements.map(achievement => (
              <motion.div
                key={achievement.id}
                whileHover={{ scale: achievement.unlocked ? 1.02 : 1 }}
                className={`p-3 rounded-lg border-2 transition-all ${
                  achievement.unlocked
                    ? 'bg-gradient-to-r from-[#00f0ff]/20 to-[#39ff14]/20 border-[#00f0ff]/50'
                    : 'bg-black/50 border-white/10 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`text-2xl ${achievement.unlocked ? '' : 'grayscale'}`}>
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <h5 className={`font-pixel text-sm ${
                      achievement.unlocked ? 'text-white' : 'text-white/50'
                    }`}>
                      {achievement.name}
                    </h5>
                    <p className={`text-xs ${
                      achievement.unlocked ? 'text-white/70' : 'text-white/30'
                    }`}>
                      {achievement.description}
                    </p>
                    {!achievement.unlocked && (
                      <div className="mt-2">
                        <div className="bg-black/30 rounded-full h-2 overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-[#ff006e] to-[#00f0ff]"
                            initial={{ width: 0 }}
                            animate={{ width: `${(achievement.current / achievement.requirement) * 100}%` }}
                            transition={{ duration: 0.5 }}
                          />
                        </div>
                        <p className="text-xs text-white/50 mt-1">
                          {achievement.current} / {achievement.requirement}
                        </p>
                      </div>
                    )}
                    {achievement.reward && achievement.unlocked && (
                      <p className="text-xs text-[#ffff00] mt-1 font-pixel">
                        {achievement.reward}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
