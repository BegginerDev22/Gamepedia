
import React, { useState, useEffect } from 'react';
import { Target, Play, RefreshCw, Map as MapIcon, Info, Zap } from 'lucide-react';
import { MOCK_MAPS } from '../constants';

interface Circle {
    x: number;
    y: number;
    r: number; // radius % relative to map width
    phase: number;
}

export const ZoneSimulatorPage: React.FC = () => {
    const [activeMapId, setActiveMapId] = useState('erangel');
    const [circles, setCircles] = useState<Circle[]>([]);
    const [phase, setPhase] = useState(0); // 0 = No circle, 1 = Phase 1, etc.
    const [autoPlay, setAutoPlay] = useState(false);

    const activeMap = MOCK_MAPS[activeMapId];

    // Phase Radii (Approximate for Erangel 8x8)
    // P1: ~40%, P2: ~25%, P3: ~15%, P4: ~8%, P5: ~4%
    const PHASES = [40, 26, 16, 10, 6, 3, 1.5, 0.5, 0.1]; 

    const generateNextZone = () => {
        if (phase >= 8) return;

        const currentCircle = circles[circles.length - 1];
        const nextRadius = PHASES[phase]; // phase is 0-indexed for array, but 1-indexed for game logic
        
        // Logic: Next circle center must be inside current circle such that the new circle is fully contained
        // Max offset = CurrentRadius - NextRadius
        const maxOffset = currentCircle.r - nextRadius;
        
        // Random angle and distance
        const angle = Math.random() * 2 * Math.PI;
        const distance = Math.random() * maxOffset; // Uniform distribution for simplicity (real game has bias)

        const nextX = currentCircle.x + distance * Math.cos(angle);
        const nextY = currentCircle.y + distance * Math.sin(angle);

        setCircles(prev => [...prev, { x: nextX, y: nextY, r: nextRadius, phase: phase + 1 }]);
        setPhase(p => p + 1);
    };

    const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (phase > 0) return; // Only set Phase 1 manually

        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        // Initial Phase 1
        setCircles([{ x, y, r: PHASES[0], phase: 1 }]);
        setPhase(1);
    };

    const reset = () => {
        setCircles([]);
        setPhase(0);
        setAutoPlay(false);
    };

    useEffect(() => {
        let interval: number;
        if (autoPlay && phase < 8 && phase > 0) {
            interval = window.setInterval(generateNextZone, 1000);
        } else if (phase >= 8) {
            setAutoPlay(false);
        }
        return () => clearInterval(interval);
    }, [autoPlay, phase]);

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-12">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-heading font-bold text-slate-900 dark:text-white flex items-center justify-center">
                    <Target className="mr-3 text-red-500" /> Zone Logic Simulator
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">
                    Practice IGL skills. Predict Phase 4 shifts and plan rotations.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar Controls */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                        <h3 className="font-bold text-slate-900 dark:text-white mb-4">Simulation Controls</h3>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Select Map</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {Object.values(MOCK_MAPS).map(map => (
                                        <button
                                            key={map.id}
                                            onClick={() => { setActiveMapId(map.id); reset(); }}
                                            className={`px-2 py-2 rounded text-xs font-bold border transition-colors ${activeMapId === map.id ? 'bg-blue-50 dark:bg-blue-900/20 border-gamepedia-blue text-gamepedia-blue' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'}`}
                                        >
                                            {map.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Current Phase</span>
                                    <span className="text-xl font-mono font-bold text-gamepedia-blue">{phase} / 9</span>
                                </div>
                                <div className="flex gap-2 mb-4">
                                    {Array.from({length: 9}).map((_, i) => (
                                        <div key={i} className={`h-1.5 flex-1 rounded-full ${i < phase ? 'bg-gamepedia-blue' : 'bg-slate-200 dark:bg-slate-700'}`}></div>
                                    ))}
                                </div>

                                <button 
                                    onClick={generateNextZone} 
                                    disabled={phase === 0 || phase >= 9}
                                    className="w-full py-3 bg-gamepedia-blue text-white rounded-lg font-bold mb-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors flex items-center justify-center"
                                >
                                    <Zap size={16} className="mr-2" /> Next Zone
                                </button>
                                
                                <div className="grid grid-cols-2 gap-2">
                                    <button 
                                        onClick={() => setAutoPlay(!autoPlay)} 
                                        disabled={phase === 0 || phase >= 9}
                                        className={`py-2 border-2 rounded-lg font-bold text-xs flex items-center justify-center transition-colors ${autoPlay ? 'bg-green-50 border-green-500 text-green-600' : 'border-slate-200 dark:border-slate-700 text-slate-500'}`}
                                    >
                                        <Play size={14} className="mr-1" /> {autoPlay ? 'Pause' : 'Auto'}
                                    </button>
                                    <button 
                                        onClick={reset} 
                                        className="py-2 border-2 border-slate-200 dark:border-slate-700 rounded-lg font-bold text-xs text-slate-500 hover:text-red-500 hover:border-red-200 transition-colors flex items-center justify-center"
                                    >
                                        <RefreshCw size={14} className="mr-1" /> Reset
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800/30">
                        <h4 className="text-sm font-bold text-blue-700 dark:text-blue-300 flex items-center mb-2">
                            <Info size={16} className="mr-2" /> How to use
                        </h4>
                        <p className="text-xs text-blue-600 dark:text-blue-400 leading-relaxed">
                            1. Click anywhere on the map to set the <strong>Phase 1</strong> circle.
                            <br/>2. Use "Next Zone" to simulate subsequent hard shifts and shrink logic.
                            <br/>3. Analyze potential end-game circles based on your start.
                        </p>
                    </div>
                </div>

                {/* Map Area */}
                <div className="lg:col-span-3">
                    <div className="bg-slate-900 rounded-xl shadow-2xl border border-slate-800 relative overflow-hidden aspect-video flex items-center justify-center cursor-crosshair group">
                        <div className="relative w-full h-full" onClick={handleMapClick}>
                            <img 
                                src={activeMap.imageUrl} 
                                alt="Map"
                                className="w-full h-full object-cover opacity-60 select-none"
                            />
                            
                            {/* Grid Overlay */}
                            <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 pointer-events-none opacity-10 w-full h-full">
                                {Array.from({ length: 64 }).map((_, i) => (
                                    <div key={i} className="border border-white"></div>
                                ))}
                            </div>

                            {/* Prompt */}
                            {phase === 0 && (
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="bg-black/60 backdrop-blur-sm text-white px-6 py-3 rounded-full font-bold border border-white/20 animate-bounce">
                                        Click map to set Phase 1
                                    </div>
                                </div>
                            )}

                            {/* Zones */}
                            {circles.map((circle, i) => (
                                <div 
                                    key={i}
                                    className={`absolute rounded-full border-2 pointer-events-none transition-all duration-500 ${i === circles.length - 1 ? 'border-white bg-blue-500/10 z-10' : 'border-white/30 z-0'}`}
                                    style={{
                                        left: `${circle.x}%`,
                                        top: `${circle.y}%`,
                                        width: `${circle.r * 2}%`, // Width relative to container width
                                        // Aspect ratio fix: height needs to be proportional if container isn't square
                                        // Assuming container is 16:9 aspect ratio for now, we scale height.
                                        // Ideally we use a square container for maps.
                                        // Let's force square visualization logic or simple % for square maps
                                        height: `${circle.r * 2 * (16/9)}%`, 
                                        transform: 'translate(-50%, -50%)'
                                    }}
                                >
                                    {i === circles.length - 1 && (
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full text-[10px] font-bold text-white bg-black/50 px-1 rounded mb-1">
                                            P{circle.phase}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
