import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useChaos } from "../components/ChaosContext";
import { ChaoticButtonEnhanced } from "../components/ChaoticButtonEnhanced";
import { ArcadeCard } from "../components/ArcadeCard";

interface GlitchBlock {
  id: number;
  x: number;
  y: number;
  color: string;
  health: number;
  glitched: boolean;
}

interface GameState {
  blocks: GlitchBlock[];
  score: number;
  level: number;
  gameOver: boolean;
  isPaused: boolean;
  combo: number;
}

const BLOCK_TYPES = [
  { color: "#ff006e", health: 3, points: 10 },
  { color: "#00f0ff", health: 2, points: 20 },
  { color: "#39ff14", health: 1, points: 30 },
  { color: "#ffff00", health: 4, points: 15 },
  { color: "#ff00ff", health: 2, points: 25 }
];

export function GlitchBreaker() {
  const { stability, glitchIntensity, damageStability, repairStability } = useChaos();
  const [gameState, setGameState] = useState<GameState>({
    blocks: [],
    score: 0,
    level: 1,
    gameOver: false,
    isPaused: false,
    combo: 0
  });
  const [paddleX, setPaddleX] = useState(50);
  const [ballPosition, setBallPosition] = useState({ x: 50, y: 80 });
  const [ballVelocity, setBallVelocity] = useState({ x: 2, y: -2 });
  const [isGlitching, setIsGlitching] = useState(false);

  // Initialize game
  useEffect(() => {
    initializeLevel();
  }, []);

  const initializeLevel = useCallback(() => {
    const newBlocks: GlitchBlock[] = [];
    let id = 0;
    
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 8; col++) {
        const blockType = BLOCK_TYPES[Math.floor(Math.random() * BLOCK_TYPES.length)];
        newBlocks.push({
          id: id++,
          x: col * 12.5,
          y: row * 8 + 10,
          color: blockType.color,
          health: blockType.health,
          glitched: false
        });
      }
    }
    
    setGameState(prev => ({
      ...prev,
      blocks: newBlocks,
      gameOver: false,
      isPaused: false
    }));
    
    setBallPosition({ x: 50, y: 80 });
    setBallVelocity({ x: 2, y: -2 });
  }, []);

  // Chaos effects
  useEffect(() => {
    if (glitchIntensity > 0.6) {
      const glitchInterval = setInterval(() => {
        setIsGlitching(prev => !prev);
        
        // Random block glitching
        setGameState(prev => ({
          ...prev,
          blocks: prev.blocks.map(block => ({
            ...block,
            glitched: Math.random() > 0.7
          }))
        }));
      }, 1500);
      
      return () => clearInterval(glitchInterval);
    }
  }, [glitchIntensity]);

  // Ball physics
  useEffect(() => {
    if (gameState.gameOver || gameState.isPaused) return;

    const gameLoop = setInterval(() => {
      setBallPosition(prev => {
        let newX = prev.x + ballVelocity.x;
        let newY = prev.y + ballVelocity.y;
        let newVelX = ballVelocity.x;
        let newVelY = ballVelocity.y;

        // Wall collisions
        if (newX <= 0 || newX >= 100) {
          newVelX = -newVelX;
          newX = newX <= 0 ? 0 : 100;
        }
        
        if (newY <= 0) {
          newVelY = -newVelY;
          newY = 0;
        }

        // Game over
        if (newY >= 100) {
          damageStability(10);
          setGameState(prev => ({ ...prev, gameOver: true }));
          return prev;
        }

        // Paddle collision
        if (newY >= 85 && newY <= 90 && newX >= paddleX - 10 && newX <= paddleX + 10) {
          newVelY = -Math.abs(newVelY);
          const hitPosition = (newX - paddleX) / 10;
          newVelX = hitPosition * 3;
          repairStability(1);
        }

        // Block collisions
        setGameState(prev => {
          const updatedBlocks = [...prev.blocks];
          let hitBlock = false;

          for (let i = 0; i < updatedBlocks.length; i++) {
            const block = updatedBlocks[i];
            if (
              newX >= block.x && newX <= block.x + 12.5 &&
              newY >= block.y && newY <= block.y + 8
            ) {
              if (!block.glitched || Math.random() > 0.5) {
                block.health--;
                hitBlock = true;
                
                if (block.health <= 0) {
                  const blockType = BLOCK_TYPES.find(bt => bt.color === block.color);
                  const points = (blockType?.points || 10) * (prev.combo + 1);
                  
                  updatedBlocks.splice(i, 1);
                  repairStability(2);
                  
                  return {
                    ...prev,
                    blocks: updatedBlocks,
                    score: prev.score + points,
                    combo: prev.combo + 1
                  };
                } else {
                  newVelY = -newVelY;
                  break;
                }
              }
            }
          }

          if (!hitBlock) {
            setGameState(prev => ({ ...prev, combo: 0 }));
          }

          return prev;
        });

        setBallVelocity({ x: newVelX, y: newVelY });

        return { x: newX, y: newY };
      });
    }, 50);

    return () => clearInterval(gameLoop);
  }, [ballVelocity, paddleX, gameState.gameOver, gameState.isPaused, damageStability, repairStability]);

  // Mouse control
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const rect = document.getElementById('game-area')?.getBoundingClientRect();
      if (rect) {
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        setPaddleX(Math.max(10, Math.min(90, x)));
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const resetGame = () => {
    setGameState(prev => ({
      ...prev,
      score: 0,
      level: 1,
      combo: 0
    }));
    initializeLevel();
  };

  return (
    <ArcadeCard glowColor="#ff006e" className="p-6">
      <div className="text-center mb-4">
        <h3 className="text-xl font-pixel text-[#ff006e] mb-2 chaos-text" data-text="GLITCH BREAKER">GLITCH BREAKER</h3>
        <div className="flex justify-center gap-4 text-sm font-pixel">
          <span className="text-[#ffff00]">SCORE: {gameState.score}</span>
          <span className="text-[#39ff14]">COMBO: x{gameState.combo + 1}</span>
          <span className="text-[#00f0ff]">LEVEL: {gameState.level}</span>
        </div>
      </div>

      <div 
        id="game-area"
        className="relative bg-black border-2 border-[#ff006e]/50 mb-4 overflow-hidden"
        style={{ height: '400px' }}
      >
        <motion.div
          animate={isGlitching ? {
            filter: 'hue-rotate(180deg)',
            opacity: [1, 0.5, 1]
          } : {}}
          transition={{ duration: 0.5 }}
        >
          {/* Blocks */}
          {gameState.blocks.map(block => (
            <motion.div
              key={block.id}
              className="absolute border border-white/20"
              style={{
                left: `${block.x}%`,
                top: `${block.y}%`,
                width: '12%',
                height: '8%',
                backgroundColor: block.glitched ? '#ffffff' : block.color,
                opacity: block.glitched ? 0.3 : 1,
                filter: block.glitched ? 'blur(2px)' : 'none'
              }}
              animate={block.glitched ? {
                scale: [1, 1.2, 1],
                rotate: [0, 5, -5, 0]
              } : {}}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center text-xs font-pixel text-white/50">
                {block.health}
              </div>
            </motion.div>
          ))}

          {/* Ball */}
          <motion.div
            className="absolute w-3 h-3 bg-white rounded-full"
            style={{
              left: `${ballPosition.x}%`,
              top: `${ballPosition.y}%`,
              transform: 'translate(-50%, -50%)',
              boxShadow: '0 0 10px white'
            }}
            animate={isGlitching ? {
              scale: [1, 1.5, 1],
              opacity: [1, 0.5, 1]
            } : {}}
            transition={{ duration: 0.2 }}
          />

          {/* Paddle */}
          <motion.div
            className="absolute h-2 bg-gradient-to-r from-[#00f0ff] to-[#39ff14]"
            style={{
              left: `${paddleX - 10}%`,
              top: '85%',
              width: '20%',
              boxShadow: '0 0 10px #00f0ff'
            }}
            animate={isGlitching ? {
              x: [0, -5, 5, 0]
            } : {}}
            transition={{ duration: 0.1 }}
          />
        </motion.div>

        {/* Game Over Overlay */}
        <AnimatePresence>
          {gameState.gameOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/90 flex items-center justify-center"
            >
              <div className="text-center space-y-4">
                <h4 className="text-2xl font-pixel text-[#ff006e] chaos-text" data-text="GAME OVER">GAME OVER</h4>
                <p className="text-sm text-white/70">Final Score: {gameState.score}</p>
                <ChaoticButtonEnhanced onClick={resetGame} variant="green">
                  RESTART
                </ChaoticButtonEnhanced>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pause Overlay */}
        <AnimatePresence>
          {gameState.isPaused && !gameState.gameOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70 flex items-center justify-center"
            >
              <h4 className="text-xl font-pixel text-[#ffff00] chaos-text" data-text="PAUSED">PAUSED</h4>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="text-center space-y-2">
        <p className="text-xs text-white/50 font-pixel">MOVE MOUSE TO CONTROL PADDLE • BREAK ALL GLITCH BLOCKS</p>
        <div className="flex justify-center gap-2">
          <ChaoticButtonEnhanced onClick={resetGame} variant="blue" className="text-xs">
            NEW GAME
          </ChaoticButtonEnhanced>
          <ChaoticButtonEnhanced onClick={() => setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }))} variant="yellow" className="text-xs">
            {gameState.isPaused ? 'RESUME' : 'PAUSE'}
          </ChaoticButtonEnhanced>
        </div>
      </div>
    </ArcadeCard>
  );
}
