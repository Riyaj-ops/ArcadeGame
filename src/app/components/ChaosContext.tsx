import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type UniverseType = "DEFAULT" | "FIX_IT" | "SUGAR_RUSH" | "HEROS_DUTY";

interface ChaosState {
    stability: number; // 0 to 100
    isChaosMode: boolean;
    isPowerOutage: boolean;
    isLoggingOut: boolean;
    glitchIntensity: number; // 0 to 1
    currentUniverse: UniverseType;
    tornadoActive: boolean; // NEW: Tornado transition state
    zeroGravityActive: boolean; // NEW: Zero gravity buttons state
    continuousGlitchActive: boolean; // NEW: Continuous glitch state
}

interface ChaosContextType extends ChaosState {
    setStability: (val: number | ((prev: number) => number)) => void;
    setChaosMode: (val: boolean) => void;
    setUniverse: (universe: UniverseType) => void;
    triggerPowerOutage: (duration?: number) => void;
    triggerLogoutSequence: () => void;
    repairStability: (amount: number) => void;
    damageStability: (amount: number) => void;
    triggerTornado: () => void; // NEW: Trigger tornado effect
    toggleZeroGravity: () => void; // NEW: Toggle zero gravity
    toggleContinuousGlitch: () => void; // NEW: Toggle continuous glitch
    triggerChaoticLogout: () => void; // NEW: Chaotic logout sequence
}

const ChaosContext = createContext<ChaosContextType | undefined>(undefined);

export const ChaosProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [stability, setStability] = useState(85);
    const [isChaosMode, setChaosMode] = useState(false);
    const [isPowerOutage, setIsPowerOutage] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [currentUniverse, setCurrentUniverse] = useState<UniverseType>("DEFAULT");
    const [tornadoActive, setTornadoActive] = useState(false); // NEW
    const [zeroGravityActive, setZeroGravityActive] = useState(false); // NEW
    const [continuousGlitchActive, setContinuousGlitchActive] = useState(false); // NEW

    const glitchIntensity = isChaosMode ? 1 : Math.max(0, (100 - stability) / 100);

    const triggerPowerOutage = useCallback((duration: number = 5000) => {
        setIsPowerOutage(true);
        setTimeout(() => setIsPowerOutage(false), duration);
    }, []);

    const triggerLogoutSequence = useCallback(() => {
        setIsLoggingOut(true);
    }, []);

    const setUniverse = useCallback((universe: UniverseType) => {
        setCurrentUniverse(universe);
    }, []);

    const repairStability = useCallback((amount: number) => {
        setStability(prev => Math.min(100, prev + amount));
    }, []);

    const damageStability = useCallback((amount: number) => {
        setStability(prev => Math.max(0, prev - amount));
    }, []);

    // NEW: Extreme chaos functions
    const triggerTornado = useCallback(() => {
        setTornadoActive(true);
        setTimeout(() => setTornadoActive(false), 2000);
    }, []);

    const toggleZeroGravity = useCallback(() => {
        setZeroGravityActive(prev => !prev);
    }, []);

    const toggleContinuousGlitch = useCallback(() => {
        setContinuousGlitchActive(prev => !prev);
    }, []);

    const triggerChaoticLogout = useCallback(() => {
        // Extreme chaos logout sequence
        setChaosMode(true);
        triggerTornado();
        toggleZeroGravity();
        toggleContinuousGlitch();
        triggerPowerOutage();
        
        // Increase torch dimensions dramatically
        setTimeout(() => {
            triggerLogoutSequence();
        }, 2000);
    }, []);

    // Cleanup function for intervals
    useEffect(() => {
        const interval = setInterval(() => {
            const roll = Math.random() * 100;
            
            if (roll > stability) {
                // Trigger various chaos events
                const eventType = Math.random();
                
                if (eventType > 0.9) {
                    triggerTornado();
                } else if (eventType > 0.8) {
                    toggleZeroGravity();
                } else if (eventType > 0.7) {
                    toggleContinuousGlitch();
                } else if (eventType > 0.5) {
                    triggerPowerOutage(3000 + Math.random() * 4000);
                }
            }

            // Natural decay of stability if in chaos mode
            if (isChaosMode) {
                damageStability(0.5);
            }
            
            // Auto-activate extreme chaos at very low stability
            if (stability < 15 && !isChaosMode && Math.random() > 0.95) {
                setChaosMode(true);
                triggerTornado();
                toggleZeroGravity();
                toggleContinuousGlitch();
                triggerPowerOutage();
            }
        }, isChaosMode ? 1000 : 3000); // Faster events in chaos mode

        return () => clearInterval(interval);
    }, [stability, isChaosMode, triggerPowerOutage, damageStability, triggerTornado, toggleZeroGravity, toggleContinuousGlitch]);

    return (
        <ChaosContext.Provider
            value={{
                stability,
                isChaosMode,
                isPowerOutage,
                isLoggingOut,
                glitchIntensity,
                currentUniverse,
                tornadoActive,
                zeroGravityActive,
                continuousGlitchActive,
                setStability,
                setChaosMode,
                setUniverse,
                triggerPowerOutage,
                triggerLogoutSequence,
                repairStability,
                damageStability,
                triggerTornado,
                toggleZeroGravity,
                toggleContinuousGlitch,
                triggerChaoticLogout,
            }}
        >
            {children}
        </ChaosContext.Provider>
    );
};

export const useChaos = () => {
    const context = useContext(ChaosContext);
    if (context === undefined) {
        throw new Error('useChaos must be used within a ChaosProvider');
    }
    return context;
};
