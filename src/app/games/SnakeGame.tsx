import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "motion/react";
import { useChaos } from "../components/ChaosContext";
import { ChaoticButtonEnhanced } from "../components/ChaoticButtonEnhanced";
import { ArcadeCard } from "../components/ArcadeCard";

interface Position {
  x: number;
  y: number;
}

interface GameState {
  snake: Position[];
  food: Position;
  direction: { x: number; y: number };
  gameOver: boolean;
  score: number;
  isPaused: boolean;
}

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SPEED = 150;

export function SnakeGame() {
  const { stability, glitchIntensity, damageStability, repairStability } = useChaos();
  const [gameState, setGameState] = useState<GameState>({
    snake: [{ x: 10, y: 10 }],
    food: { x: 15, y: 15 },
    direction: { x: 1, y: 0 },
    gameOver: false,
    score: 0,
    isPaused: false
  });
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const gameLoopRef = useRef<NodeJS.Timeout>();
  const [isGlitched, setIsGlitched] = useState(false);

  // Chaos effects on game
  useEffect(() => {
    if (glitchIntensity > 0.7) {
      const glitchInterval = setInterval(() => {
        setIsGlitched(prev => !prev);
        if (Math.random() > 0.8) {
          // Random direction change during high chaos
          setGameState(prev => ({
            ...prev,
            direction: {
              x: Math.random() > 0.5 ? (Math.random() > 0.5 ? 1 : -1) : 0,
              y: Math.random() > 0.5 ? 0 : (Math.random() > 0.5 ? 1 : -1)
            }
          }));
        }
      }, 2000);
      return () => clearInterval(glitchInterval);
    }
  }, [glitchIntensity]);

  // Speed increases with chaos
  useEffect(() => {
    const chaosSpeed = INITIAL_SPEED - (glitchIntensity * 100);
    setSpeed(Math.max(50, chaosSpeed));
  }, [glitchIntensity]);

  const generateFood = useCallback((snake: Position[]): Position => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }, []);

  const moveSnake = useCallback(() => {
    if (gameState.gameOver || gameState.isPaused) return;

    setGameState(prev => {
      const newSnake = [...prev.snake];
      const head = { ...newSnake[0] };
      
      // Apply chaos distortion to movement
      let newDirection = { ...prev.direction };
      if (isGlitched && Math.random() > 0.7) {
        newDirection = {
          x: Math.random() > 0.5 ? (Math.random() > 0.5 ? 1 : -1) : 0,
          y: Math.random() > 0.5 ? 0 : (Math.random() > 0.5 ? 1 : -1)
        };
      }
      
      head.x += newDirection.x;
      head.y += newDirection.y;

      // Check boundaries
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        damageStability(5);
        return { ...prev, gameOver: true };
      }

      // Check self collision
      if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        damageStability(5);
        return { ...prev, gameOver: true };
      }

      newSnake.unshift(head);

      // Check food collision
      if (head.x === prev.food.x && head.y === prev.food.y) {
        repairStability(2);
        return {
          ...prev,
          snake: newSnake,
          food: generateFood(newSnake),
          score: prev.score + 10
        };
      } else {
        newSnake.pop();
      }

      return { ...prev, snake: newSnake };
    });
  }, [gameState.gameOver, gameState.isPaused, isGlitched, generateFood, damageStability, repairStability]);

  // Game loop
  useEffect(() => {
    gameLoopRef.current = setInterval(moveSnake, speed);
    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [moveSnake, speed]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (gameState.gameOver) return;

      const key = e.key.toLowerCase();
      setGameState(prev => {
        const newDirection = { ...prev.direction };
        
        switch (key) {
          case 'arrowup':
          case 'w':
            if (prev.direction.y === 0) newDirection.y = -1;
            newDirection.x = 0;
            break;
          case 'arrowdown':
          case 's':
            if (prev.direction.y === 0) newDirection.y = 1;
            newDirection.x = 0;
            break;
          case 'arrowleft':
          case 'a':
            if (prev.direction.x === 0) newDirection.x = -1;
            newDirection.y = 0;
            break;
          case 'arrowright':
          case 'd':
            if (prev.direction.x === 0) newDirection.x = 1;
            newDirection.y = 0;
            break;
          case ' ':
            return { ...prev, isPaused: !prev.isPaused };
        }
        
        return { ...prev, direction: newDirection };
      });
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState.gameOver]);

  const resetGame = () => {
    setGameState({
      snake: [{ x: 10, y: 10 }],
      food: { x: 15, y: 15 },
      direction: { x: 1, y: 0 },
      gameOver: false,
      score: 0,
      isPaused: false
    });
  };

  return (
    <ArcadeCard glowColor="#00f0ff" className="p-6">
      <div className="text-center mb-4">
        <h3 className="text-xl font-pixel text-[#00f0ff] mb-2 chaos-text" data-text="SNAKE CHAOS">SNAKE CHAOS</h3>
        <div className="flex justify-center gap-4 text-sm font-pixel">
          <span className="text-[#ffff00]">SCORE: {gameState.score}</span>
          <span className="text-[#ff006e]">SPEED: {Math.round((INITIAL_SPEED - speed) / 10)}</span>
          <span className="text-[#39ff14]">{gameState.isPaused ? 'PAUSED' : 'PLAYING'}</span>
        </div>
      </div>

      <div className="relative mb-4">
        <motion.div
          className="relative bg-black border-2 border-[#00f0ff]/50 mx-auto"
          style={{
            width: GRID_SIZE * CELL_SIZE,
            height: GRID_SIZE * CELL_SIZE,
            filter: isGlitched ? 'hue-rotate(180deg) contrast(2)' : 'none',
            transform: isGlitched ? 'scale(1.05)' : 'scale(1)'
          }}
          animate={glitchIntensity > 0.5 ? {
            x: [0, -2, 2, 0],
            y: [0, -1, 1, 0]
          } : {}}
          transition={{ repeat: Infinity, duration: 0.1 }}
        >
          {/* Grid */}
          <div className="absolute inset-0 opacity-10">
            {[...Array(GRID_SIZE)].map((_, i) => (
              <div
                key={`h-${i}`}
                className="absolute w-full border-t border-[#00f0ff]/20"
                style={{ top: i * CELL_SIZE }}
              />
            ))}
            {[...Array(GRID_SIZE)].map((_, i) => (
              <div
                key={`v-${i}`}
                className="absolute h-full border-l border-[#00f0ff]/20"
                style={{ left: i * CELL_SIZE }}
              />
            ))}
          </div>

          {/* Snake */}
          {gameState.snake.map((segment, index) => (
            <motion.div
              key={index}
              className="absolute"
              style={{
                left: segment.x * CELL_SIZE,
                top: segment.y * CELL_SIZE,
                width: CELL_SIZE - 2,
                height: CELL_SIZE - 2,
                backgroundColor: index === 0 ? '#00f0ff' : '#0088ff',
                boxShadow: index === 0 ? '0 0 10px #00f0ff' : 'none'
              }}
              animate={{
                scale: isGlitched ? [1, 1.2, 1] : 1
              }}
              transition={{ duration: 0.2 }}
            />
          ))}

          {/* Food */}
          <motion.div
            className="absolute"
            style={{
              left: gameState.food.x * CELL_SIZE,
              top: gameState.food.y * CELL_SIZE,
              width: CELL_SIZE - 2,
              height: CELL_SIZE - 2,
              backgroundColor: '#ff006e',
              boxShadow: '0 0 10px #ff006e'
            }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [1, 0.7, 1]
            }}
            transition={{ repeat: Infinity, duration: 1 }}
          />
        </motion.div>

        {/* Game Over Overlay */}
        {gameState.gameOver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
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

        {/* Pause Overlay */}
        {gameState.isPaused && !gameState.gameOver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/70 flex items-center justify-center"
          >
            <h4 className="text-xl font-pixel text-[#ffff00] chaos-text" data-text="PAUSED">PAUSED</h4>
          </motion.div>
        )}
      </div>

      <div className="text-center space-y-2">
        <p className="text-xs text-white/50 font-pixel">USE ARROW KEYS OR WASD TO MOVE • SPACE TO PAUSE</p>
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
