import { createContext, useContext, useCallback, useState, useEffect } from 'react';
import { motion } from 'motion/react';

interface Challenge {
  id: string;
  title: string;
  description: string;
  requirement: number;
  current: number;
  completed: boolean;
  reward: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'extreme';
  category: 'games' | 'chaos' | 'repairs' | 'powerups';
  expiresAt: Date;
}

interface LeaderboardEntry {
  id: string;
  playerName: string;
  score: number;
  game: string;
  date: Date;
  rank: number;
}

interface DailyChallengesContextType {
  challenges: Challenge[];
  leaderboard: LeaderboardEntry[];
  updateChallengeProgress: (id: string, progress: number) => void;
  completeChallenge: (id: string) => void;
  addLeaderboardEntry: (playerName: string, score: number, game: string) => void;
  refreshChallenges: () => void;
  getCompletedCount: () => number;
  getTotalRewardPoints: () => number;
}

const DailyChallengesContext = createContext<DailyChallengesContextType | undefined>(undefined);

const generateChallenges = (): Challenge[] => {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  return [
    {
      id: 'snake_score',
      title: 'SNAKE MASTER',
      description: 'Score 50 points in Snake Chaos',
      requirement: 50,
      current: 0,
      completed: false,
      reward: '+15 Stability',
      difficulty: 'easy',
      category: 'games',
      expiresAt: tomorrow
    },
    {
      id: 'breaker_blocks',
      title: 'BLOCK DESTROYER',
      description: 'Destroy 30 blocks in Glitch Breaker',
      requirement: 30,
      current: 0,
      completed: false,
      reward: '+20 Stability',
      difficulty: 'medium',
      category: 'games',
      expiresAt: tomorrow
    },
    {
      id: 'memory_speed',
      title: 'LIGHTNING MEMORY',
      description: 'Complete Chaos Memory in under 45 seconds',
      requirement: 45,
      current: 0,
      completed: false,
      reward: '+25 Stability',
      difficulty: 'hard',
      category: 'games',
      expiresAt: tomorrow
    },
    {
      id: 'chaos_survival',
      title: 'CHAOS ENDURANCE',
      description: 'Survive 3 minutes with stability below 40%',
      requirement: 180,
      current: 0,
      completed: false,
      reward: '+30 Stability',
      difficulty: 'hard',
      category: 'chaos',
      expiresAt: tomorrow
    },
    {
      id: 'repair_speed',
      title: 'QUICK FIX',
      description: 'Complete 3 repairs in under 2 minutes each',
      requirement: 3,
      current: 0,
      completed: false,
      reward: '+18 Stability',
      difficulty: 'medium',
      category: 'repairs',
      expiresAt: tomorrow
    },
    {
      id: 'powerup_collector',
      title: 'POWER COLLECTOR',
      description: 'Collect 10 power-ups in any game',
      requirement: 10,
      current: 0,
      completed: false,
      reward: '+22 Stability',
      difficulty: 'easy',
      category: 'powerups',
      expiresAt: tomorrow
    },
    {
      id: 'extreme_chaos',
      title: 'EXTREME SURVIVOR',
      description: 'Survive 5 minutes in Extreme Chaos mode',
      requirement: 300,
      current: 0,
      completed: false,
      reward: '+50 Stability',
      difficulty: 'extreme',
      category: 'chaos',
      expiresAt: tomorrow
    },
    {
      id: 'perfect_game',
      title: 'PERFECT RUN',
      description: 'Complete any game without taking damage',
      requirement: 1,
      current: 0,
      completed: false,
      reward: '+35 Stability',
      difficulty: 'extreme',
      category: 'games',
      expiresAt: tomorrow
    }
  ];
};

const generateLeaderboard = (): LeaderboardEntry[] => {
  const games = ['Snake Chaos', 'Glitch Breaker', 'Chaos Memory'];
  const names = ['CYBER_NINJA', 'GLITCH_HUNTER', 'ARCADE_MASTER', 'CHAOS_SURVIVOR', 'PIXEL_WARRIOR', 'NEON_RACER', 'DIGITAL_PHANTOM', 'RETRO_LEGEND'];
  
  const entries: LeaderboardEntry[] = [];
  
  for (let i = 0; i < 20; i++) {
    entries.push({
      id: `leader-${i}`,
      playerName: names[Math.floor(Math.random() * names.length)],
      score: Math.floor(Math.random() * 500) + 100,
      game: games[Math.floor(Math.random() * games.length)],
      date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      rank: i + 1
    });
  }
  
  return entries.sort((a, b) => b.score - a.score).map((entry, index) => ({
    ...entry,
    rank: index + 1
  }));
};

export function DailyChallengesProvider({ children }: { children: React.ReactNode }) {
  const [challenges, setChallenges] = useState<Challenge[]>(generateChallenges());
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(generateLeaderboard());

  // Load from localStorage
  useEffect(() => {
    const savedChallenges = localStorage.getItem('arcade-daily-challenges');
    const savedLeaderboard = localStorage.getItem('arcade-leaderboard');
    
    if (savedChallenges) {
      try {
        const parsed = JSON.parse(savedChallenges);
        const challengesDate = new Date(parsed.date);
        const today = new Date();
        
        // Check if challenges are from today
        if (challengesDate.toDateString() === today.toDateString()) {
          setChallenges(parsed.challenges);
        } else {
          // Generate new challenges for today
          const newChallenges = generateChallenges();
          setChallenges(newChallenges);
          localStorage.setItem('arcade-daily-challenges', JSON.stringify({
            challenges: newChallenges,
            date: today
          }));
        }
      } catch (error) {
        console.warn('Failed to load challenges:', error);
      }
    }
    
    if (savedLeaderboard) {
      try {
        setLeaderboard(JSON.parse(savedLeaderboard));
      } catch (error) {
        console.warn('Failed to load leaderboard:', error);
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('arcade-daily-challenges', JSON.stringify({
      challenges,
      date: new Date()
    }));
  }, [challenges]);

  useEffect(() => {
    localStorage.setItem('arcade-leaderboard', JSON.stringify(leaderboard));
  }, [leaderboard]);

  const updateChallengeProgress = useCallback((id: string, progress: number) => {
    setChallenges(prev => 
      prev.map(challenge => 
        challenge.id === id 
          ? { ...challenge, current: Math.min(progress, challenge.requirement) }
          : challenge
      )
    );
  }, []);

  const completeChallenge = useCallback((id: string) => {
    setChallenges(prev => 
      prev.map(challenge => 
        challenge.id === id 
          ? { ...challenge, completed: true, current: challenge.requirement }
          : challenge
      )
    );
  }, []);

  const addLeaderboardEntry = useCallback((playerName: string, score: number, game: string) => {
    const newEntry: LeaderboardEntry = {
      id: `entry-${Date.now()}-${Math.random()}`,
      playerName,
      score,
      game,
      date: new Date(),
      rank: 0
    };

    setLeaderboard(prev => {
      const updated = [...prev, newEntry]
        .sort((a, b) => b.score - a.score)
        .map((entry, index) => ({ ...entry, rank: index + 1 }));
      
      // Keep only top 50 entries
      return updated.slice(0, 50);
    });
  }, []);

  const refreshChallenges = useCallback(() => {
    const newChallenges = generateChallenges();
    setChallenges(newChallenges);
    localStorage.setItem('arcade-daily-challenges', JSON.stringify({
      challenges: newChallenges,
      date: new Date()
    }));
  }, []);

  const getCompletedCount = useCallback(() => {
    return challenges.filter(c => c.completed).length;
  }, [challenges]);

  const getTotalRewardPoints = useCallback(() => {
    return challenges
      .filter(c => c.completed)
      .reduce((total, challenge) => {
        const points = parseInt(challenge.reward.match(/\d+/)?.[0] || '0');
        return total + points;
      }, 0);
  }, [challenges]);

  const value: DailyChallengesContextType = {
    challenges,
    leaderboard,
    updateChallengeProgress,
    completeChallenge,
    addLeaderboardEntry,
    refreshChallenges,
    getCompletedCount,
    getTotalRewardPoints
  };

  return (
    <DailyChallengesContext.Provider value={value}>
      {children}
    </DailyChallengesContext.Provider>
  );
}

export function useDailyChallenges() {
  const context = useContext(DailyChallengesContext);
  if (!context) {
    throw new Error('useDailyChallenges must be used within a DailyChallengesProvider');
  }
  return context;
}

// Daily Challenges Display Component
export function DailyChallengesDisplay() {
  const { challenges, updateChallengeProgress, completeChallenge, getCompletedCount, getTotalRewardPoints } = useDailyChallenges();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'hard': return 'text-orange-400';
      case 'extreme': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'games': return '🎮';
      case 'chaos': return '⚡';
      case 'repairs': return '🔧';
      case 'powerups': return '💎';
      default: return '📋';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-pixel text-[#ffff00] mb-2 chaos-text" data-text="DAILY CHALLENGES">
          DAILY CHALLENGES
        </h3>
        <p className="text-white/70 font-pixel text-sm">
          {getCompletedCount()} / {challenges.length} COMPLETED • {getTotalRewardPoints()} STABILITY EARNED
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {challenges.map(challenge => (
          <motion.div
            key={challenge.id}
            whileHover={{ scale: challenge.completed ? 1 : 1.02 }}
            className={`p-4 rounded-lg border-2 transition-all ${
              challenge.completed
                ? 'bg-gradient-to-r from-[#00f0ff]/20 to-[#39ff14]/20 border-[#00f0ff]/50'
                : 'bg-black/50 border-white/10'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="text-2xl">{getCategoryIcon(challenge.category)}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className={`font-pixel text-sm ${
                    challenge.completed ? 'text-white' : 'text-white/80'
                  }`}>
                    {challenge.title}
                  </h4>
                  <span className={`text-xs ${getDifficultyColor(challenge.difficulty)}`}>
                    {challenge.difficulty.toUpperCase()}
                  </span>
                </div>
                <p className={`text-xs mb-2 ${
                  challenge.completed ? 'text-white/60' : 'text-white/40'
                }`}>
                  {challenge.description}
                </p>
                
                {!challenge.completed && (
                  <div className="mb-2">
                    <div className="bg-black/30 rounded-full h-2 overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-[#ff006e] to-[#00f0ff]"
                        initial={{ width: `${(challenge.current / challenge.requirement) * 100}%` }}
                        animate={{ width: `${(challenge.current / challenge.requirement) * 100}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    <p className="text-xs text-white/50 mt-1">
                      {challenge.current} / {challenge.requirement}
                    </p>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <p className={`text-xs font-pixel ${
                    challenge.completed ? 'text-[#39ff14]' : 'text-[#ffff00]'
                  }`}>
                    {challenge.reward}
                  </p>
                  
                  {!challenge.completed && (
                    <button
                      onClick={() => {
                        const progress = Math.min(challenge.current + 1, challenge.requirement);
                        updateChallengeProgress(challenge.id, progress);
                        if (progress >= challenge.requirement) {
                          completeChallenge(challenge.id);
                        }
                      }}
                      className="px-2 py-1 bg-[#ff006e] text-white rounded text-xs font-pixel"
                    >
                      TEST PROGRESS
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Leaderboard Display Component
export function LeaderboardDisplay() {
  const { leaderboard } = useDailyChallenges();

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'text-yellow-400';
    if (rank === 2) return 'text-gray-300';
    if (rank === 3) return 'text-orange-400';
    return 'text-white/60';
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return '🏆';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-2xl font-pixel text-[#00f0ff] mb-2 chaos-text" data-text="LEADERBOARD">
          LEADERBOARD
        </h3>
        <p className="text-white/70 font-pixel text-sm">TOP ARCADE CHAMPIONS</p>
      </div>

      <div className="space-y-2">
        {leaderboard.slice(0, 10).map(entry => (
          <motion.div
            key={entry.id}
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: entry.rank * 0.05 }}
            className={`p-3 rounded-lg border-2 flex items-center gap-3 ${
              entry.rank <= 3 
                ? 'bg-gradient-to-r from-[#ffff00]/20 to-[#ff006e]/20 border-[#ffff00]/50' 
                : 'bg-black/30 border-white/10'
            }`}
          >
            <div className={`text-lg font-bold ${getRankColor(entry.rank)}`}>
              {getRankIcon(entry.rank)}
            </div>
            <div className="flex-1">
              <p className="text-white font-pixel text-sm">{entry.playerName}</p>
              <p className="text-white/60 text-xs">{entry.game}</p>
            </div>
            <div className="text-right">
              <p className="text-[#ffff00] font-pixel text-sm">{entry.score}</p>
              <p className="text-white/40 text-xs">
                {new Date(entry.date).toLocaleDateString()}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
