import { createContext, useContext, useCallback, useState, useEffect } from 'react';
import { motion } from 'motion/react';

interface GameSave {
  id: string;
  playerName: string;
  timestamp: Date;
  stability: number;
  unlockedCharacters: string[];
  achievements: string[];
  highScores: Record<string, number>;
  totalPlayTime: number;
  chaosLevel: number;
  powerUpsCollected: number;
  repairsCompleted: number;
  gamesPlayed: number;
  version: string;
}

interface SaveSlot {
  slot: number;
  save: GameSave | null;
  isEmpty: boolean;
}

interface GameSaveContextType {
  saveSlots: SaveSlot[];
  currentSave: GameSave | null;
  createNewSave: (slot: number, playerName: string) => void;
  loadSave: (slot: number) => void;
  saveGame: () => void;
  deleteSave: (slot: number) => void;
  exportSave: (slot: number) => string;
  importSave: (saveData: string, slot: number) => boolean;
  getCurrentSaveData: () => GameSave | null;
  updateSaveData: (updates: Partial<GameSave>) => void;
}

const GameSaveContext = createContext<GameSaveContextType | undefined>(undefined);

const SAVE_VERSION = '1.0.0';
const MAX_SAVE_SLOTS = 3;

const createDefaultSave = (playerName: string): GameSave => ({
  id: `save-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  playerName,
  timestamp: new Date(),
  stability: 85,
  unlockedCharacters: ['WRECK-IT RALPH', 'VENELLOPE', 'FIX-IT FELIX'],
  achievements: [],
  highScores: {},
  totalPlayTime: 0,
  chaosLevel: 0,
  powerUpsCollected: 0,
  repairsCompleted: 0,
  gamesPlayed: 0,
  version: SAVE_VERSION
});

export function GameSaveProvider({ children }: { children: React.ReactNode }) {
  const [saveSlots, setSaveSlots] = useState<SaveSlot[]>([]);
  const [currentSave, setCurrentSave] = useState<GameSave | null>(null);

  // Initialize save slots
  useEffect(() => {
    const slots: SaveSlot[] = [];
    
    for (let i = 1; i <= MAX_SAVE_SLOTS; i++) {
      const saveData = localStorage.getItem(`arcade-save-slot-${i}`);
      
      if (saveData) {
        try {
          const save = JSON.parse(saveData);
          slots.push({
            slot: i,
            save: {
              ...save,
              timestamp: new Date(save.timestamp)
            },
            isEmpty: false
          });
        } catch (error) {
          console.warn(`Failed to load save slot ${i}:`, error);
          slots.push({
            slot: i,
            save: null,
            isEmpty: true
          });
        }
      } else {
        slots.push({
          slot: i,
          save: null,
          isEmpty: true
        });
      }
    }
    
    setSaveSlots(slots);
    
    // Load current save if exists
    const currentSlot = localStorage.getItem('arcade-current-save-slot');
    if (currentSlot) {
      const slotNum = parseInt(currentSlot);
      const slot = slots.find(s => s.slot === slotNum && !s.isEmpty);
      if (slot?.save) {
        setCurrentSave(slot.save);
      }
    }
  }, []);

  const createNewSave = useCallback((slot: number, playerName: string) => {
    const newSave = createDefaultSave(playerName);
    
    setSaveSlots(prev => prev.map(s => 
      s.slot === slot 
        ? { ...s, save: newSave, isEmpty: false }
        : s
    ));
    
    setCurrentSave(newSave);
    localStorage.setItem(`arcade-save-slot-${slot}`, JSON.stringify(newSave));
    localStorage.setItem('arcade-current-save-slot', slot.toString());
  }, []);

  const loadSave = useCallback((slot: number) => {
    const saveSlot = saveSlots.find(s => s.slot === slot && !s.isEmpty);
    
    if (saveSlot?.save) {
      setCurrentSave(saveSlot.save);
      localStorage.setItem('arcade-current-save-slot', slot.toString());
    }
  }, [saveSlots]);

  const saveGame = useCallback(() => {
    if (!currentSave) return;
    
    const updatedSave = {
      ...currentSave,
      timestamp: new Date()
    };
    
    const currentSlot = localStorage.getItem('arcade-current-save-slot');
    if (currentSlot) {
      const slotNum = parseInt(currentSlot);
      
      setSaveSlots(prev => prev.map(s => 
        s.slot === slotNum 
          ? { ...s, save: updatedSave }
          : s
      ));
      
      setCurrentSave(updatedSave);
      localStorage.setItem(`arcade-save-slot-${slotNum}`, JSON.stringify(updatedSave));
    }
  }, [currentSave]);

  const deleteSave = useCallback((slot: number) => {
    setSaveSlots(prev => prev.map(s => 
      s.slot === slot 
        ? { ...s, save: null, isEmpty: true }
        : s
    ));
    
    localStorage.removeItem(`arcade-save-slot-${slot}`);
    
    // If this was the current save, clear it
    const currentSlot = localStorage.getItem('arcade-current-save-slot');
    if (currentSlot && parseInt(currentSlot) === slot) {
      setCurrentSave(null);
      localStorage.removeItem('arcade-current-save-slot');
    }
  }, []);

  const exportSave = useCallback((slot: number) => {
    const saveSlot = saveSlots.find(s => s.slot === slot && !s.isEmpty);
    
    if (saveSlot?.save) {
      return btoa(JSON.stringify(saveSlot.save));
    }
    
    return '';
  }, [saveSlots]);

  const importSave = useCallback((saveData: string, slot: number) => {
    try {
      const decoded = atob(saveData);
      const save: GameSave = JSON.parse(decoded);
      
      // Validate save data
      if (!save.id || !save.playerName || !save.version) {
        return false;
      }
      
      const updatedSave = {
        ...save,
        timestamp: new Date(save.timestamp)
      };
      
      setSaveSlots(prev => prev.map(s => 
        s.slot === slot 
          ? { ...s, save: updatedSave, isEmpty: false }
          : s
      ));
      
      localStorage.setItem(`arcade-save-slot-${slot}`, JSON.stringify(updatedSave));
      
      return true;
    } catch (error) {
      console.error('Failed to import save:', error);
      return false;
    }
  }, []);

  const getCurrentSaveData = useCallback(() => {
    return currentSave;
  }, [currentSave]);

  const updateSaveData = useCallback((updates: Partial<GameSave>) => {
    if (!currentSave) return;
    
    const updatedSave = {
      ...currentSave,
      ...updates,
      timestamp: new Date()
    };
    
    setCurrentSave(updatedSave);
    
    const currentSlot = localStorage.getItem('arcade-current-save-slot');
    if (currentSlot) {
      const slotNum = parseInt(currentSlot);
      
      setSaveSlots(prev => prev.map(s => 
        s.slot === slotNum 
          ? { ...s, save: updatedSave }
          : s
      ));
      
      localStorage.setItem(`arcade-save-slot-${slotNum}`, JSON.stringify(updatedSave));
    }
  }, [currentSave]);

  const value: GameSaveContextType = {
    saveSlots,
    currentSave,
    createNewSave,
    loadSave,
    saveGame,
    deleteSave,
    exportSave,
    importSave,
    getCurrentSaveData,
    updateSaveData
  };

  return (
    <GameSaveContext.Provider value={value}>
      {children}
    </GameSaveContext.Provider>
  );
}

export function useGameSave() {
  const context = useContext(GameSaveContext);
  if (!context) {
    throw new Error('useGameSave must be used within a GameSaveProvider');
  }
  return context;
}

// Save/Load Menu Component
export function SaveLoadMenu({ onClose }: { onClose: () => void }) {
  const { saveSlots, currentSave, createNewSave, loadSave, deleteSave, exportSave, importSave } = useGameSave();
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [playerName, setPlayerName] = useState('');
  const [importData, setImportData] = useState('');
  const [showNewGame, setShowNewGame] = useState(false);
  const [showImport, setShowImport] = useState(false);

  const handleNewGame = (slot: number) => {
    if (playerName.trim()) {
      createNewSave(slot, playerName.trim());
      setShowNewGame(false);
      setPlayerName('');
    }
  };

  const handleImport = (slot: number) => {
    if (importData.trim()) {
      if (importSave(importData.trim(), slot)) {
        setShowImport(false);
        setImportData('');
      } else {
        alert('Invalid save data!');
      }
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
    >
      <div className="bg-gradient-to-br from-[#1a0033] to-[#000011] border-2 border-[#ff006e] rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-pixel text-[#00f0ff] chaos-text" data-text="SAVE / LOAD">
            SAVE / LOAD
          </h2>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {saveSlots.map(slot => (
            <motion.div
              key={slot.slot}
              whileHover={{ scale: 1.02 }}
              className={`p-4 rounded-lg border-2 ${
                currentSave?.id === slot.save?.id
                  ? 'border-[#00f0ff] bg-[#00f0ff]/10'
                  : 'border-white/20 bg-black/50'
              }`}
            >
              <h3 className="text-lg font-pixel text-white mb-2">SLOT {slot.slot}</h3>
              
              {slot.isEmpty ? (
                <div className="text-center space-y-3">
                  <p className="text-white/50 text-sm">EMPTY SLOT</p>
                  <button
                    onClick={() => {
                      setSelectedSlot(slot.slot);
                      setShowNewGame(true);
                    }}
                    className="w-full py-2 px-4 bg-[#39ff14] text-black rounded font-pixel text-sm"
                  >
                    NEW GAME
                  </button>
                </div>
              ) : slot.save ? (
                <div className="space-y-2">
                  <p className="text-white font-pixel text-sm">{slot.save.playerName}</p>
                  <p className="text-white/60 text-xs">{formatDate(slot.save.timestamp)}</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-white/50">Stability:</span>
                      <span className="text-[#39ff14] ml-1">{slot.save.stability}%</span>
                    </div>
                    <div>
                      <span className="text-white/50">Games:</span>
                      <span className="text-[#ffff00] ml-1">{slot.save.gamesPlayed}</span>
                    </div>
                    <div>
                      <span className="text-white/50">Repairs:</span>
                      <span className="text-[#00f0ff] ml-1">{slot.save.repairsCompleted}</span>
                    </div>
                    <div>
                      <span className="text-white/50">Power-ups:</span>
                      <span className="text-[#ff00ff] ml-1">{slot.save.powerUpsCollected}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2 pt-2">
                    {currentSave?.id !== slot.save.id && (
                      <button
                        onClick={() => loadSave(slot.slot)}
                        className="w-full py-1 px-3 bg-[#00f0ff] text-black rounded font-pixel text-xs"
                      >
                        LOAD
                      </button>
                    )}
                    
                    {currentSave?.id === slot.save.id && (
                      <button
                        onClick={() => {/* Save is auto-saved */}}
                        className="w-full py-1 px-3 bg-[#39ff14] text-black rounded font-pixel text-xs"
                        disabled
                      >
                        CURRENT
                      </button>
                    )}
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          const data = exportSave(slot.slot);
                          navigator.clipboard.writeText(data);
                          alert('Save data copied to clipboard!');
                        }}
                        className="flex-1 py-1 px-2 bg-[#ffff00] text-black rounded font-pixel text-xs"
                      >
                        EXPORT
                      </button>
                      
                      <button
                        onClick={() => {
                          setSelectedSlot(slot.slot);
                          setShowImport(true);
                        }}
                        className="flex-1 py-1 px-2 bg-[#ff006e] text-white rounded font-pixel text-xs"
                      >
                        IMPORT
                      </button>
                      
                      <button
                        onClick={() => {
                          if (confirm('Delete this save slot?')) {
                            deleteSave(slot.slot);
                          }
                        }}
                        className="flex-1 py-1 px-2 bg-red-600 text-white rounded font-pixel text-xs"
                      >
                        DELETE
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}
            </motion.div>
          ))}
        </div>

        {/* New Game Modal */}
        {showNewGame && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-60"
          >
            <div className="bg-black border-2 border-[#00f0ff] rounded-lg p-6">
              <h3 className="text-xl font-pixel text-[#00f0ff] mb-4">NEW GAME - SLOT {selectedSlot}</h3>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter your name"
                className="w-full p-2 bg-black/50 border border-[#00f0ff] rounded text-white font-pixel mb-4"
                maxLength={20}
              />
              <div className="flex gap-2">
                <button
                  onClick={() => handleNewGame(selectedSlot!)}
                  disabled={!playerName.trim()}
                  className="flex-1 py-2 px-4 bg-[#39ff14] text-black rounded font-pixel disabled:opacity-50"
                >
                  START
                </button>
                <button
                  onClick={() => {
                    setShowNewGame(false);
                    setPlayerName('');
                    setSelectedSlot(null);
                  }}
                  className="flex-1 py-2 px-4 bg-[#ff006e] text-white rounded font-pixel"
                >
                  CANCEL
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Import Modal */}
        {showImport && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-60"
          >
            <div className="bg-black border-2 border-[#ff006e] rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-pixel text-[#ff006e] mb-4">IMPORT SAVE - SLOT {selectedSlot}</h3>
              <textarea
                value={importData}
                onChange={(e) => setImportData(e.target.value)}
                placeholder="Paste save data here..."
                className="w-full p-2 bg-black/50 border border-[#ff006e] rounded text-white font-pixel mb-4 h-32 resize-none"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => handleImport(selectedSlot!)}
                  disabled={!importData.trim()}
                  className="flex-1 py-2 px-4 bg-[#39ff14] text-black rounded font-pixel disabled:opacity-50"
                >
                  IMPORT
                </button>
                <button
                  onClick={() => {
                    setShowImport(false);
                    setImportData('');
                    setSelectedSlot(null);
                  }}
                  className="flex-1 py-2 px-4 bg-[#ff006e] text-white rounded font-pixel"
                >
                  CANCEL
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
