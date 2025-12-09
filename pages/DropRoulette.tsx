
import React, { useState, useEffect } from 'react';
import { MapPin, RefreshCw, Shield, Target, Zap } from 'lucide-react';
import { MOCK_MAPS, ROULETTE_CHALLENGES } from '../constants';
import { MapPOI, RouletteChallenge } from '../types';

export const DropRoulettePage: React.FC = () => {
    const [spinning, setSpinning] = useState(false);
    const [selectedMapId, setSelectedMapId] = useState('erangel');
    const [result, setResult] = useState<{ point: MapPOI | null, challenge: RouletteChallenge | null }>({ point: null, challenge: null });

    const handleSpin = () => {
        if (spinning) return;
        setSpinning(true);
        setResult({ point: null, challenge: null });

        const map = MOCK_MAPS[selectedMapId];
        const points = map.points.filter(p => p.type === 'drop');
        const challenges = ROULETTE_CHALLENGES;

        // Simulate spin delay
        setTimeout(() => {
            const randomPoint = points[Math.floor(Math.random() * points.length)];
            const randomChallenge = Math.random() > 0.3 ? challenges[Math.floor(Math.random() * challenges.length)] : null; // 70% chance of challenge
            
            setResult({
                point: randomPoint,
                challenge: randomChallenge
            });
            setSpinning(false);
        }, 2000);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12 text-center">
            <div className="mb-8">
                <h1 className="text-4xl font-heading font-bold text-slate-900 dark:text-white flex items-center justify-center">
                    <Target className="mr-3 text-red-500" /> Drop Roulette
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">
                    Can't decide where to land? Let fate decide your next match.
                </p>
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-4 mb-8">
                {Object.values(MOCK_MAPS).map(map => (
                    <button
                        key={map.id}
                        onClick={() => setSelectedMapId(map.id)}
                        className={`px-6 py-3 rounded-xl font-bold text-lg transition-all transform hover:scale-105 ${
                            selectedMapId === map.id 
                            ? 'bg-gamepedia-blue text-white shadow-lg shadow-blue-500/30' 
                            : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                        }`}
                    >
                        {map.name}
                    </button>
                ))}
            </div>

            {/* Spinner Area */}
            <div className="relative h-80 bg-slate-900 rounded-3xl overflow-hidden border-4 border-slate-800 shadow-2xl flex items-center justify-center group">
                {/* Background Map */}
                <div className="absolute inset-0 opacity-30 transition-opacity duration-500">
                    <img 
                        src={MOCK_MAPS[selectedMapId].imageUrl} 
                        className={`w-full h-full object-cover ${spinning ? 'blur-sm scale-110' : 'blur-0'}`} 
                    />
                </div>

                <div className="relative z-10 flex flex-col items-center">
                    {spinning ? (
                        <div className="flex flex-col items-center">
                            <RefreshCw size={64} className="text-white animate-spin mb-4" />
                            <span className="text-2xl font-bold text-white animate-pulse">Rolling...</span>
                        </div>
                    ) : result.point ? (
                        <div className="animate-bounce-in flex flex-col items-center">
                            <span className="text-sm text-slate-300 font-bold uppercase tracking-widest mb-2">Drop At</span>
                            <h2 className="text-5xl font-black text-white mb-4 drop-shadow-lg">{result.point.name}</h2>
                            
                            {result.challenge && (
                                <div className="bg-red-600/90 backdrop-blur px-6 py-3 rounded-xl border-2 border-red-400 shadow-lg mt-4 max-w-md transform rotate-1">
                                    <div className="flex items-center justify-center text-yellow-300 font-bold uppercase text-xs mb-1">
                                        <Zap size={14} className="mr-1" /> Challenge Active
                                    </div>
                                    <h3 className="text-xl font-bold text-white">{result.challenge.title}</h3>
                                    <p className="text-red-100 text-sm mt-1">{result.challenge.description}</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-slate-400">
                            <MapPin size={48} className="mx-auto mb-2 opacity-50" />
                            <p>Ready to drop?</p>
                        </div>
                    )}
                </div>
            </div>

            <button 
                onClick={handleSpin}
                disabled={spinning}
                className="px-12 py-4 bg-gradient-to-r from-gamepedia-orange to-red-500 text-white text-xl font-black uppercase tracking-wider rounded-full shadow-xl hover:shadow-orange-500/40 hover:scale-105 transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            >
                {spinning ? 'Spinning...' : 'SPIN THE WHEEL'}
            </button>
        </div>
    );
};
