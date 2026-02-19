import { createContext, useContext, useCallback, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export interface PowerUp {
  id: string;
  name: string;
  description: string;
  icon: string;
  duration: number;
  effect: PowerUpEffect;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  color: string;
}

export interface PowerUpEffect {
  type: 'speed_boost' | 'shield' | 'multi_score' | 'slow_time' | 'magnet' | 'chaos_resist' | 'instant_repair';
  value: number;
  duration?: number;
}

interface PowerUpContextType {
  activePowerUps: PowerUp[];
  activatePowerUp: (powerUp: PowerUp) => void;
  deactivatePowerUp: (id: string) => void;
  getRandomPowerUp: () => PowerUp | null;
  getPowerUpMultiplier: (type: PowerUpEffect['type']) => number;
  hasActivePowerUp: (type: PowerUpEffect['type']) => boolean;
}

const POWER_UPS: PowerUp[] = [
  {
    id: 'speed_boost',
    name: 'TURBO CHARGE',
    description: 'Double movement speed for 10 seconds',
    icon: '⚡',
    duration: 10000,
    effect: { type: 'speed_boost', value: 2, duration: 10000 },
    rarity: 'common',
    color: '#ffff00'
  },
  {
    id: 'shield',
    name: 'CHAOS SHIELD',
    description: 'Immune to chaos effects for 15 seconds',
    icon: '🛡️',
    duration: 15000,
    effect: { type: 'shield', value: 1, duration: 15000 },
    rarity: 'rare',
    color: '#00f0ff'
  },
  {
    id: 'multi_score',
    name: 'SCORE MULTIPLIER',
    description: '3x score multiplier for 20 seconds',
    icon: '💎',
    duration: 20000,
    effect: { type: 'multi_score', value: 3, duration: 20000 },
    rarity: 'rare',
    color: '#ff00ff'
  },
  {
    id: 'slow_time',
    name: 'TIME DISTORTION',
    description: 'Slows down game speed by 50% for 12 seconds',
    icon: '⏰',
    duration: 12000,
    effect: { type: 'slow_time', value: 0.5, duration: 12000 },
    rarity: 'epic',
    color: '#39ff14'
  },
  {
    id: 'magnet',
    name: 'COLLECTION MAGNET',
    description: 'Auto-collect nearby items for 8 seconds',
    icon: '🧲',
    duration: 8000,
    effect: { type: 'magnet', value: 100, duration: 8000 },
    rarity: 'rare',
    color: '#ff8800'
  },
  {
    id: 'chaos_resist',
    name: 'CHAOS RESISTANCE',
    description: 'Reduces chaos intensity by 75% for 25 seconds',
    icon: '🔮',
    duration: 25000,
    effect: { type: 'chaos_resist', value: 0.25, duration: 25000 },
    rarity: 'epic',
    color: '#bf40bf'
  },
  {
    id: 'instant_repair',
    name: 'INSTANT REPAIR',
    description: 'Instantly repair all system damage',
    icon: '🔧',
    duration: 0,
    effect: { type: 'instant_repair', value: 100 },
    rarity: 'legendary',
    color: '#ff006e'
  }
];

const PowerUpContext = createContext<PowerUpContextType | undefined>(undefined);

export function PowerUpProvider({ children }: { children: React.ReactNode }) {
  const [activePowerUps, setActivePowerUps] = useState<PowerUp[]>([]);

  useEffect(() => {
    const intervals = activePowerUps.map(powerUp => {
      if (powerUp.duration > 0) {
        return setTimeout(() => {
          deactivatePowerUp(powerUp.id);
        }, powerUp.duration);
      }
      return null;
    }).filter(Boolean);

    return () => {
      intervals.forEach(interval => {
        if (interval) clearTimeout(interval);
      });
    };
  }, [activePowerUps]);

  const activatePowerUp = useCallback((powerUp: PowerUp) => {
    setActivePowerUps(prev => {
      // Check if power-up of same type is already active
      const existingIndex = prev.findIndex(p => p.effect.type === powerUp.effect.type);
      if (existingIndex !== -1) {
        // Replace existing power-up
        const updated = [...prev];
        updated[existingIndex] = powerUp;
        return updated;
      }
      return [...prev, powerUp];
    });
  }, []);

  const deactivatePowerUp = useCallback((id: string) => {
    setActivePowerUps(prev => prev.filter(p => p.id !== id));
  }, []);

  const getRandomPowerUp = useCallback((): PowerUp | null => {
    const roll = Math.random();
    let availablePowerUps: PowerUp[];

    if (roll < 0.05) { // 5% legendary
      availablePowerUps = POWER_UPS.filter(p => p.rarity === 'legendary');
    } else if (roll < 0.20) { // 15% epic
      availablePowerUps = POWER_UPS.filter(p => p.rarity === 'epic');
    } else if (roll < 0.50) { // 30% rare
      availablePowerUps = POWER_UPS.filter(p => p.rarity === 'rare');
    } else { // 50% common
      availablePowerUps = POWER_UPS.filter(p => p.rarity === 'common');
    }

    if (availablePowerUps.length === 0) return null;
    
    return availablePowerUps[Math.floor(Math.random() * availablePowerUps.length)];
  }, []);

  const getPowerUpMultiplier = useCallback((type: PowerUpEffect['type']): number => {
    const powerUp = activePowerUps.find(p => p.effect.type === type);
    return powerUp ? powerUp.effect.value : 1;
  }, [activePowerUps]);

  const hasActivePowerUp = useCallback((type: PowerUpEffect['type']): boolean => {
    return activePowerUps.some(p => p.effect.type === type);
  }, [activePowerUps]);

  const value: PowerUpContextType = {
    activePowerUps,
    activatePowerUp,
    deactivatePowerUp,
    getRandomPowerUp,
    getPowerUpMultiplier,
    hasActivePowerUp
  };

  return (
    <PowerUpContext.Provider value={value}>
      {children}
    </PowerUpContext.Provider>
  );
}

export function usePowerUps() {
  const context = useContext(PowerUpContext);
  if (!context) {
    throw new Error('usePowerUps must be used within a PowerUpProvider');
  }
  return context;
}

// Power-Up Display Component
export function PowerUpDisplay() {
  const { activePowerUps } = usePowerUps();

  return (
    <div className="fixed top-4 left-4 z-40 space-y-2">
      <AnimatePresence>
        {activePowerUps.map(powerUp => (
          <motion.div
            key={powerUp.id}
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            className="bg-black/80 border-2 rounded-lg p-3 backdrop-blur-sm"
            style={{ borderColor: powerUp.color }}
          >
            <div className="flex items-center gap-2">
              <div className="text-2xl">{powerUp.icon}</div>
              <div>
                <p className="text-white font-pixel text-xs">{powerUp.name}</p>
                {powerUp.duration > 0 && (
                  <div className="w-20 h-1 bg-black/50 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full"
                      style={{ backgroundColor: powerUp.color }}
                      initial={{ width: '100%' }}
                      animate={{ width: '0%' }}
                      transition={{ duration: powerUp.duration / 1000, ease: 'linear' }}
                    />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// Power-Up Collectible Component
export function PowerUpCollectible({ 
  powerUp, 
  onCollect, 
  position 
}: { 
  powerUp: PowerUp; 
  onCollect: () => void; 
  position: { x: number; y: number };
}) {
  return (
    <motion.div
      className="absolute w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
      style={{ 
        backgroundColor: powerUp.color,
        left: `${position.x}px`,
        top: `${position.y}px`,
        boxShadow: `0 0 20px ${powerUp.color}`
      }}
      animate={{
        scale: [1, 1.2, 1],
        rotate: [0, 360, 0]
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      whileHover={{ scale: 1.3 }}
      onClick={onCollect}
    >
      <span className="text-lg">{powerUp.icon}</span>
    </motion.div>
  );
}

// Power-Up Shop Component
export function PowerUpShop() {
  const { activatePowerUp } = usePowerUps();
  const [playerCoins, setPlayerCoins] = useState(100);

  const buyPowerUp = (powerUp: PowerUp) => {
    const cost = powerUp.rarity === 'common' ? 10 : 
                 powerUp.rarity === 'rare' ? 25 : 
                 powerUp.rarity === 'epic' ? 50 : 100;
    
    if (playerCoins >= cost) {
      setPlayerCoins(prev => prev - cost);
      activatePowerUp(powerUp);
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-400';
      case 'rare': return 'text-blue-400';
      case 'epic': return 'text-purple-400';
      case 'legendary': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-2xl font-pixel text-[#ffff00] mb-2 chaos-text" data-text="POWER-UP SHOP">
          POWER-UP SHOP
        </h3>
        <p className="text-white/70 font-pixel text-sm">Coins: {playerCoins}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {POWER_UPS.map(powerUp => {
          const cost = powerUp.rarity === 'common' ? 10 : 
                       powerUp.rarity === 'rare' ? 25 : 
                       powerUp.rarity === 'epic' ? 50 : 100;
          
          return (
            <motion.div
              key={powerUp.id}
              whileHover={{ scale: 1.02 }}
              className="bg-black/50 border-2 rounded-lg p-4"
              style={{ borderColor: powerUp.color }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="text-3xl">{powerUp.icon}</div>
                <div className="flex-1">
                  <h4 className="text-white font-pixel text-sm">{powerUp.name}</h4>
                  <p className={`text-xs ${getRarityColor(powerUp.rarity)} uppercase`}>
                    {powerUp.rarity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[#ffff00] font-pixel text-sm">{cost} coins</p>
                </div>
              </div>
              <p className="text-white/70 text-xs mb-3">{powerUp.description}</p>
              <button
                onClick={() => buyPowerUp(powerUp)}
                disabled={playerCoins < cost}
                className="w-full py-2 px-4 rounded font-pixel text-xs transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: playerCoins >= cost ? powerUp.color : '#333',
                  color: playerCoins >= cost ? '#000' : '#666'
                }}
              >
                {playerCoins >= cost ? 'BUY NOW' : 'INSUFFICIENT COINS'}
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
