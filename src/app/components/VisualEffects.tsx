import { createContext, useContext, useCallback, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  lifetime: number;
  type: 'explosion' | 'sparkle' | 'glitch' | 'powerup' | 'damage' | 'heal';
}

interface ScreenShake {
  id: string;
  intensity: number;
  duration: number;
}

interface VisualEffectsContextType {
  particles: Particle[];
  screenShake: ScreenShake | null;
  createExplosion: (x: number, y: number, color?: string) => void;
  createSparkles: (x: number, y: number, count?: number) => void;
  createGlitchEffect: (x: number, y: number) => void;
  createPowerUpEffect: (x: number, y: number, color: string) => void;
  createDamageEffect: (x: number, y: number) => void;
  createHealEffect: (x: number, y: number) => void;
  triggerScreenShake: (intensity: number, duration: number) => void;
  clearEffects: () => void;
}

const VisualEffectsContext = createContext<VisualEffectsContextType | undefined>(undefined);

export function VisualEffectsProvider({ children }: { children: React.ReactNode }) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [screenShake, setScreenShake] = useState<ScreenShake | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  // Particle animation loop
  useEffect(() => {
    const animate = (currentTime: number) => {
      const deltaTime = currentTime - (lastTimeRef.current || currentTime);
      lastTimeRef.current = currentTime;

      setParticles(prev => {
        return prev
          .map(particle => ({
            ...particle,
            x: particle.x + particle.vx * deltaTime / 16,
            y: particle.y + particle.vy * deltaTime / 16,
            vy: particle.vy + 0.3, // Gravity
            lifetime: particle.lifetime - deltaTime
          }))
          .filter(particle => particle.lifetime > 0);
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const createParticle = useCallback((
    x: number, 
    y: number, 
    type: Particle['type'], 
    color: string = '#ffffff',
    count: number = 1
  ) => {
    const newParticles: Particle[] = [];
    
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
      const speed = type === 'explosion' ? 5 + Math.random() * 5 : 
                   type === 'sparkle' ? 1 + Math.random() * 2 :
                   type === 'glitch' ? 3 + Math.random() * 3 :
                   type === 'powerup' ? 2 + Math.random() * 2 :
                   1 + Math.random() * 3;

      newParticles.push({
        id: `${Date.now()}-${i}-${Math.random()}`,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (type === 'explosion' ? 2 : 0),
        size: type === 'explosion' ? 3 + Math.random() * 3 :
              type === 'sparkle' ? 2 + Math.random() * 2 :
              type === 'glitch' ? 4 + Math.random() * 4 :
              type === 'powerup' ? 5 :
              3,
        color,
        lifetime: type === 'explosion' ? 1000 :
                  type === 'sparkle' ? 800 :
                  type === 'glitch' ? 600 :
                  type === 'powerup' ? 1200 :
                  900,
        type
      });
    }

    setParticles(prev => [...prev, ...newParticles]);
  }, []);

  const createExplosion = useCallback((x: number, y: number, color = '#ff6b35') => {
    createParticle(x, y, 'explosion', color, 12);
  }, [createParticle]);

  const createSparkles = useCallback((x: number, y: number, count = 8) => {
    createParticle(x, y, 'sparkle', '#ffff00', count);
  }, [createParticle]);

  const createGlitchEffect = useCallback((x: number, y: number) => {
    createParticle(x, y, 'glitch', '#ff00ff', 6);
  }, [createParticle]);

  const createPowerUpEffect = useCallback((x: number, y: number, color: string) => {
    createParticle(x, y, 'powerup', color, 10);
  }, [createParticle]);

  const createDamageEffect = useCallback((x: number, y: number) => {
    createParticle(x, y, 'damage', '#ff0000', 8);
  }, [createParticle]);

  const createHealEffect = useCallback((x: number, y: number) => {
    createParticle(x, y, 'heal', '#00ff00', 8);
  }, [createParticle]);

  const triggerScreenShake = useCallback((intensity: number, duration: number) => {
    const id = `shake-${Date.now()}`;
    setScreenShake({ id, intensity, duration });
    
    setTimeout(() => {
      setScreenShake(null);
    }, duration);
  }, []);

  const clearEffects = useCallback(() => {
    setParticles([]);
    setScreenShake(null);
  }, []);

  const value: VisualEffectsContextType = {
    particles,
    screenShake,
    createExplosion,
    createSparkles,
    createGlitchEffect,
    createPowerUpEffect,
    createDamageEffect,
    createHealEffect,
    triggerScreenShake,
    clearEffects
  };

  return (
    <VisualEffectsContext.Provider value={value}>
      {children}
      
      {/* Particle Effects Layer */}
      <div className="fixed inset-0 pointer-events-none z-50">
        <AnimatePresence>
          {particles.map(particle => (
            <motion.div
              key={particle.id}
              initial={{ scale: 0, opacity: 1 }}
              animate={{ 
                scale: particle.type === 'sparkle' ? [1, 1.5, 1] : 1,
                opacity: particle.lifetime / 1000
              }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute rounded-full"
              style={{
                left: `${particle.x}px`,
                top: `${particle.y}px`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                backgroundColor: particle.color,
                boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
                filter: particle.type === 'glitch' ? 'blur(1px)' : 'none'
              }}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Screen Shake Effect */}
      <AnimatePresence>
        {screenShake && (
          <motion.div
            key={screenShake.id}
            initial={{ x: 0 }}
            animate={{
              x: [-screenShake.intensity, screenShake.intensity, -screenShake.intensity/2, screenShake.intensity/2, 0],
              y: [-screenShake.intensity/2, screenShake.intensity/2, -screenShake.intensity/4, screenShake.intensity/4, 0]
            }}
            transition={{ duration: screenShake.duration / 1000, ease: "easeOut" }}
            className="fixed inset-0 pointer-events-none z-40"
          />
        )}
      </AnimatePresence>
    </VisualEffectsContext.Provider>
  );
}

export function useVisualEffects() {
  const context = useContext(VisualEffectsContext);
  if (!context) {
    throw new Error('useVisualEffects must be used within a VisualEffectsProvider');
  }
  return context;
}

// Pre-built effect combinations
export const EffectPresets = {
  gameWin: (x: number, y: number) => {
    const { createSparkles, createPowerUpEffect, triggerScreenShake } = useVisualEffects();
    createSparkles(x, y, 20);
    createPowerUpEffect(x, y, '#00ff00');
    triggerScreenShake(5, 300);
  },
  
  gameLose: (x: number, y: number) => {
    const { createExplosion, createDamageEffect, triggerScreenShake } = useVisualEffects();
    createExplosion(x, y, '#ff0000');
    createDamageEffect(x, y);
    triggerScreenShake(10, 500);
  },
  
  powerUpCollect: (x: number, y: number, color: string) => {
    const { createPowerUpEffect, createSparkles, triggerScreenShake } = useVisualEffects();
    createPowerUpEffect(x, y, color);
    createSparkles(x, y, 12);
    triggerScreenShake(3, 200);
  },
  
  repairComplete: (x: number, y: number) => {
    const { createHealEffect, createSparkles, triggerScreenShake } = useVisualEffects();
    createHealEffect(x, y);
    createSparkles(x, y, 15);
    createSparkles(x + 50, y, 15);
    triggerScreenShake(4, 250);
  },
  
  chaosEvent: (x: number, y: number) => {
    const { createGlitchEffect, createExplosion, triggerScreenShake } = useVisualEffects();
    createGlitchEffect(x, y);
    createExplosion(x + 30, y, '#ff00ff');
    triggerScreenShake(8, 400);
  }
};

// Visual Effect Test Component
export function VisualEffectsTest() {
  const effects = useVisualEffects();

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      <div className="bg-black/80 border-2 border-[#00f0ff] rounded-lg p-4">
        <h4 className="text-white font-pixel text-sm mb-2">EFFECTS TEST</h4>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => effects.createExplosion(200, 200)}
            className="bg-red-500 text-white px-2 py-1 rounded text-xs"
          >
            Explosion
          </button>
          <button
            onClick={() => effects.createSparkles(300, 200)}
            className="bg-yellow-500 text-white px-2 py-1 rounded text-xs"
          >
            Sparkles
          </button>
          <button
            onClick={() => effects.createGlitchEffect(400, 200)}
            className="bg-purple-500 text-white px-2 py-1 rounded text-xs"
          >
            Glitch
          </button>
          <button
            onClick={() => effects.createPowerUpEffect(500, 200, '#00ff00')}
            className="bg-green-500 text-white px-2 py-1 rounded text-xs"
          >
            PowerUp
          </button>
          <button
            onClick={() => effects.createDamageEffect(200, 300)}
            className="bg-red-600 text-white px-2 py-1 rounded text-xs"
          >
            Damage
          </button>
          <button
            onClick={() => effects.createHealEffect(300, 300)}
            className="bg-green-600 text-white px-2 py-1 rounded text-xs"
          >
            Heal
          </button>
          <button
            onClick={() => effects.triggerScreenShake(10, 500)}
            className="bg-blue-500 text-white px-2 py-1 rounded text-xs col-span-2"
          >
            Screen Shake
          </button>
        </div>
      </div>
    </div>
  );
}
