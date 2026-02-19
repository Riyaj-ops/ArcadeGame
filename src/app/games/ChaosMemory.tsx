import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useChaos } from "../components/ChaosContext";
import { ChaoticButtonEnhanced } from "../components/ChaoticButtonEnhanced";
import { ArcadeCard } from "../components/ArcadeCard";

interface MemoryCard {
  id: number;
  symbol: string;
  color: string;
  isFlipped: boolean;
  isMatched: boolean;
  isGlitched: boolean;
}

const SYMBOLS = ['🎮', '🕹️', '👾', '🎯', '🎪', '🎨', '🎭', '🎪'];
const COLORS = ['#00f0ff', '#ff006e', '#39ff14', '#ffff00', '#ff00ff', '#00ff88', '#ff8800', '#8800ff'];

export function ChaosMemory() {
  const { stability, glitchIntensity, damageStability, repairStability } = useChaos();
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [chaosLevel, setChaosLevel] = useState(1);

  // Initialize game
  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = useCallback(() => {
    const gameCards: MemoryCard[] = [];
    let id = 0;

    // Create pairs
    for (let i = 0; i < 8; i++) {
      const symbol = SYMBOLS[i];
      const color = COLORS[i];
      
      // Create two cards with same symbol
      gameCards.push(
        {
          id: id++,
          symbol,
          color,
          isFlipped: false,
          isMatched: false,
          isGlitched: false
        },
        {
          id: id++,
          symbol,
          color,
          isFlipped: false,
          isMatched: false,
          isGlitched: false
        }
      );
    }

    // Shuffle cards
    const shuffled = gameCards.sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setSelectedCards([]);
    setMoves(0);
    setMatches(0);
    setGameOver(false);
    setIsPaused(false);
  }, []);

  // Chaos effects
  useEffect(() => {
    if (glitchIntensity > 0.5) {
      const chaosInterval = setInterval(() => {
        // Random card glitching
        setCards(prev => prev.map(card => ({
          ...card,
          isGlitched: !card.isMatched && Math.random() > 0.8
        })));
        
        // Random card flipping during high chaos
        if (Math.random() > 0.9) {
          setCards(prev => prev.map(card => 
            card.isMatched ? card : {
              ...card,
              isFlipped: Math.random() > 0.7
            }
          ));
        }
        
        setChaosLevel(Math.ceil(glitchIntensity * 3));
      }, 2000);
      
      return () => clearInterval(chaosInterval);
    }
  }, [glitchIntensity]);

  // Card click handler
  const handleCardClick = useCallback((cardId: number) => {
    if (gameOver || isPaused) return;
    
    const card = cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched || selectedCards.length >= 2) return;

    const newCards = cards.map(c => 
      c.id === cardId ? { ...c, isFlipped: true } : c
    );
    setCards(newCards);

    const newSelected = [...selectedCards, cardId];
    setSelectedCards(newSelected);

    if (newSelected.length === 2) {
      setMoves(prev => prev + 1);
      
      setTimeout(() => {
        checkMatch(newSelected, newCards);
      }, 1000);
    }
  }, [cards, selectedCards, gameOver, isPaused]);

  const checkMatch = useCallback((selected: number[], currentCards: MemoryCard[]) => {
    const [first, second] = selected.map(id => currentCards.find(c => c.id === id));
    
    if (first && second) {
      if (first.symbol === second.symbol && first.color === second.color) {
        // Match found
        repairStability(5);
        setMatches(prev => {
          const newMatches = prev + 1;
          if (newMatches === 8) {
            setGameOver(true);
          }
          return newMatches;
        });
        
        setCards(prev => prev.map(card => 
          card.id === first.id || card.id === second.id
            ? { ...card, isMatched: true }
            : card
        ));
      } else {
        // No match
        damageStability(2);
        setCards(prev => prev.map(card => 
          card.id === first.id || card.id === second.id
            ? { ...card, isFlipped: false }
            : card
        ));
      }
    }
    
    setSelectedCards([]);
  }, [repairStability, damageStability]);

  // Auto-flip glitched cards
  useEffect(() => {
    if (chaosLevel > 2) {
      const flipInterval = setInterval(() => {
        setCards(prev => prev.map(card => 
          card.isGlitched && !card.isMatched && !card.isFlipped
            ? { ...card, isFlipped: true }
            : card
        ));
      }, 3000);
      
      return () => clearInterval(flipInterval);
    }
  }, [chaosLevel]);

  const resetGame = () => {
    initializeGame();
  };

  return (
    <ArcadeCard glowColor="#ffff00" className="p-6">
      <div className="text-center mb-4">
        <h3 className="text-xl font-pixel text-[#ffff00] mb-2 chaos-text" data-text="CHAOS MEMORY">CHAOS MEMORY</h3>
        <div className="flex justify-center gap-4 text-sm font-pixel">
          <span className="text-[#00f0ff]">MOVES: {moves}</span>
          <span className="text-[#39ff14]">MATCHES: {matches}/8</span>
          <span className="text-[#ff006e]">CHAOS: Lv.{chaosLevel}</span>
        </div>
      </div>

      <div className="relative mb-4">
        <motion.div
          className="grid grid-cols-4 gap-3 p-4 bg-black/50 border-2 border-[#ffff00]/30 rounded-lg"
          animate={glitchIntensity > 0.6 ? {
            scale: [1, 1.02, 1],
            rotate: [0, 0.5, -0.5, 0]
          } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {cards.map((card) => (
            <motion.div
              key={card.id}
              className="relative aspect-square cursor-pointer"
              onClick={() => handleCardClick(card.id)}
              whileHover={{ scale: card.isMatched ? 1 : 1.05 }}
              whileTap={{ scale: card.isMatched ? 1 : 0.95 }}
            >
              <motion.div
                className="absolute inset-0 rounded-lg border-2 flex items-center justify-center text-3xl font-bold"
                style={{
                  borderColor: card.isMatched ? '#39ff14' : card.isGlitched ? '#ffffff' : card.color,
                  backgroundColor: card.isFlipped || card.isMatched ? card.color : '#1a1a1a',
                  color: card.isFlipped || card.isMatched ? '#000' : card.color,
                  filter: card.isGlitched ? 'blur(1px) hue-rotate(180deg)' : 'none',
                  transform: card.isGlitched ? 'scale(1.1)' : 'scale(1)'
                }}
                animate={{
                  rotateY: card.isFlipped || card.isMatched ? 0 : 180,
                  scale: card.isMatched ? [1, 1.1, 1] : 1
                }}
                transition={{ 
                  rotateY: { duration: 0.6 },
                  scale: card.isMatched ? { repeat: Infinity, duration: 1 } : {}
                }}
              >
                {card.isFlipped || card.isMatched ? card.symbol : '?'}
              </motion.div>
              
              {/* Glitch effect overlay */}
              {card.isGlitched && (
                <motion.div
                  className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{
                    x: ['-100%', '100%']
                  }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Game Over Overlay */}
        <AnimatePresence>
          {gameOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/90 flex items-center justify-center rounded-lg"
            >
              <div className="text-center space-y-4">
                <h4 className="text-2xl font-pixel text-[#39ff14] chaos-text" data-text="MEMORY MASTER!">MEMORY MASTER!</h4>
                <p className="text-sm text-white/70">Completed in {moves} moves</p>
                <div className="text-xs text-[#ffff00] font-pixel">
                  {moves <= 20 ? 'PERFECT!' : moves <= 30 ? 'GREAT!' : 'GOOD!'}
                </div>
                <ChaoticButtonEnhanced onClick={resetGame} variant="green">
                  PLAY AGAIN
                </ChaoticButtonEnhanced>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pause Overlay */}
        <AnimatePresence>
          {isPaused && !gameOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70 flex items-center justify-center rounded-lg"
            >
              <h4 className="text-xl font-pixel text-[#ffff00] chaos-text" data-text="PAUSED">PAUSED</h4>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="text-center space-y-2">
        <p className="text-xs text-white/50 font-pixel">FIND MATCHING PAIRS • WATCH OUT FOR CHAOS GLITCHES!</p>
        <div className="flex justify-center gap-2">
          <ChaoticButtonEnhanced onClick={resetGame} variant="blue" className="text-xs">
            NEW GAME
          </ChaoticButtonEnhanced>
          <ChaoticButtonEnhanced onClick={() => setIsPaused(!isPaused)} variant="yellow" className="text-xs">
            {isPaused ? 'RESUME' : 'PAUSE'}
          </ChaoticButtonEnhanced>
        </div>
      </div>
    </ArcadeCard>
  );
}
