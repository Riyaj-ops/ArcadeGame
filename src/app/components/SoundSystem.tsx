import { createContext, useContext, useCallback, useRef, useEffect, useState } from 'react';

interface SoundEffect {
  name: string;
  frequency: number;
  duration: number;
  type: OscillatorType;
  volume?: number;
}

interface SoundContextType {
  playSound: (soundName: string) => void;
  playGlitchSound: () => void;
  playSuccessSound: () => void;
  playErrorSound: () => void;
  playClickSound: () => void;
  playPowerUpSound: () => void;
  toggleMute: () => void;
  isMuted: boolean;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

const SOUND_EFFECTS: Record<string, SoundEffect> = {
  click: { name: 'click', frequency: 800, duration: 0.1, type: 'square', volume: 0.3 },
  success: { name: 'success', frequency: 523, duration: 0.2, type: 'sine', volume: 0.4 },
  error: { name: 'error', frequency: 200, duration: 0.3, type: 'sawtooth', volume: 0.3 },
  glitch: { name: 'glitch', frequency: 100, duration: 0.1, type: 'square', volume: 0.2 },
  powerup: { name: 'powerup', frequency: 440, duration: 0.3, type: 'sine', volume: 0.5 },
  explosion: { name: 'explosion', frequency: 50, duration: 0.5, type: 'sawtooth', volume: 0.6 },
  pickup: { name: 'pickup', frequency: 880, duration: 0.15, type: 'sine', volume: 0.4 },
  levelup: { name: 'levelup', frequency: 261, duration: 0.4, type: 'triangle', volume: 0.5 }
};

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const playTone = useCallback((frequency: number, duration: number, type: OscillatorType, volume: number = 0.3) => {
    if (isMuted || !audioContextRef.current) return;

    try {
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);
      
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime);
      
      gainNode.gain.setValueAtTime(volume, audioContextRef.current.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + duration);
      
      oscillator.start(audioContextRef.current.currentTime);
      oscillator.stop(audioContextRef.current.currentTime + duration);
    } catch (error) {
      console.warn('Audio playback failed:', error);
    }
  }, [isMuted]);

  const playSound = useCallback((soundName: string) => {
    const effect = SOUND_EFFECTS[soundName];
    if (effect) {
      playTone(effect.frequency, effect.duration, effect.type, effect.volume);
    }
  }, [playTone]);

  const playGlitchSound = useCallback(() => {
    if (Math.random() > 0.5) {
      playTone(50 + Math.random() * 100, 0.05, 'square', 0.2);
    } else {
      playTone(100 + Math.random() * 200, 0.08, 'sawtooth', 0.15);
    }
  }, [playTone]);

  const playSuccessSound = useCallback(() => {
    playTone(523, 0.1, 'sine', 0.4);
    setTimeout(() => playTone(659, 0.1, 'sine', 0.4), 100);
    setTimeout(() => playTone(784, 0.2, 'sine', 0.4), 200);
  }, [playTone]);

  const playErrorSound = useCallback(() => {
    playTone(300, 0.2, 'sawtooth', 0.3);
    setTimeout(() => playTone(200, 0.3, 'sawtooth', 0.3), 150);
  }, [playTone]);

  const playClickSound = useCallback(() => {
    playTone(800, 0.05, 'square', 0.3);
  }, [playTone]);

  const playPowerUpSound = useCallback(() => {
    playTone(440, 0.1, 'sine', 0.5);
    setTimeout(() => playTone(554, 0.1, 'sine', 0.5), 100);
    setTimeout(() => playTone(659, 0.1, 'sine', 0.5), 200);
  }, [playTone]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev: boolean) => !prev);
  }, []);

  const value: SoundContextType = {
    playSound,
    playGlitchSound,
    playSuccessSound,
    playErrorSound,
    playClickSound,
    playPowerUpSound,
    toggleMute,
    isMuted
  };

  return (
    <SoundContext.Provider value={value}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSound() {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
}
