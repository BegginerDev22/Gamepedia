
import React, { useState, useRef, useEffect } from 'react';
import { Crosshair, Target, RotateCcw, Trophy, MousePointer } from 'lucide-react';
import { MOCK_WEAPONS, SPRAY_PATTERNS } from '../constants';

export const SprayTrainerPage: React.FC = () => {
    const [activeWeapon, setActiveWeapon] = useState('M416');
    const [isFiring, setIsFiring] = useState(false);
    const [score, setScore] = useState(0);
    const [bulletsLeft, setBulletsLeft] = useState(40);
    const [offset, setOffset] = useState({ x: 0, y: 0 }); // Current recoil offset
    
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const requestRef = useRef<number>(0); // Fixed: Added initial value 0
    const pattern = SPRAY_PATTERNS[activeWeapon];
    
    // Game Logic
    useEffect(() => {
        if (isFiring && bulletsLeft > 0) {
            const tick = () => {
                setOffset(prev => ({
                    x: prev.x + (Math.random() - 0.5) * pattern.horizontalJitter,
                    y: prev.y - pattern.verticalRecoil
                }));
                setBulletsLeft(prev => prev - 1);
                
                // Scoring: Closer to center (0,0) is better
                const dist = Math.sqrt(offset.x ** 2 + offset.y ** 2);
                if (dist < 20) setScore(prev => prev + 10);
                else if (dist < 50) setScore(prev => prev + 5);
            };
            
            const timer = setInterval(tick, 100); // Fire rate simulation
            return () => clearInterval(timer);
        } else if (bulletsLeft === 0) {
            setIsFiring(false);
        }
    }, [isFiring, bulletsLeft, activeWeapon, offset, pattern]);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isFiring) {
            // Counter recoil by moving mouse down
            setOffset(prev => ({
                x: prev.x + e.movementX,
                y: prev.y + e.movementY
            }));
        }
    };

    const reset = () => {
        setIsFiring(false);
        setBulletsLeft(pattern.bullets);
        setScore(0);
        setOffset({ x: 0, y: 0 });
    };

    const weaponData = MOCK_WEAPONS.find(w => w.name === activeWeapon);

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-heading font-bold text-slate-900 dark:text-white flex items-center justify-center">
                    <Target className="mr-3 text-red-500" /> Spray Control Trainer
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">
                    Master the recoil patterns of top BGMI weapons. Drag down to counter the climb.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                        <h3 className="font-bold text-slate-900 dark:text-white mb-4">Select Weapon</h3>
                        <div className="grid grid-cols-2 gap-2">
                            {Object.keys(SPRAY_PATTERNS).map(w => (
                                <button 
                                    key={w}
                                    onClick={() => { setActiveWeapon(w); reset(); }}
                                    className={`px-3 py-2 rounded-lg text-sm font-bold border transition-colors ${activeWeapon === w ? 'bg-blue-50 dark:bg-blue-900/20 border-gamepedia-blue text-gamepedia-blue' : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                                >
                                    {w}
                                </button>
                            ))}
                        </div>
                        
                        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700">
                            <div className="flex justify-between mb-2">
                                <span className="text-sm text-slate-500">Difficulty</span>
                                <span className={`text-sm font-bold ${pattern.difficulty === 'Easy' ? 'text-green-500' : 'text-red-500'}`}>{pattern.difficulty}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-slate-500">Vertical Recoil</span>
                                <div className="flex gap-1">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <div key={i} className={`w-2 h-4 rounded ${i < pattern.verticalRecoil ? 'bg-red-500' : 'bg-slate-200 dark:bg-slate-700'}`}></div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                        <div className="text-center">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Score</span>
                            <div className="text-4xl font-mono font-bold text-gamepedia-blue my-2">{score}</div>
                            <button onClick={reset} className="flex items-center justify-center mx-auto text-sm text-slate-500 hover:text-gamepedia-blue">
                                <RotateCcw size={14} className="mr-1" /> Reset
                            </button>
                        </div>
                    </div>
                </div>

                {/* Training Area */}
                <div className="md:col-span-2 relative">
                    <div 
                        className="aspect-video bg-slate-800 rounded-xl border-4 border-slate-700 relative overflow-hidden cursor-crosshair"
                        onMouseDown={() => setIsFiring(true)}
                        onMouseUp={() => setIsFiring(false)}
                        onMouseLeave={() => setIsFiring(false)}
                        onMouseMove={handleMouseMove}
                    >
                        {/* Target Background */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
                            <div className="w-64 h-64 rounded-full border-4 border-white"></div>
                            <div className="absolute w-48 h-48 rounded-full border-4 border-white"></div>
                            <div className="absolute w-32 h-32 rounded-full border-4 border-white"></div>
                            <div className="absolute w-1 h-64 bg-white"></div>
                            <div className="absolute w-64 h-1 bg-white"></div>
                        </div>

                        {/* Dynamic Crosshair */}
                        <div 
                            className="absolute w-4 h-4 bg-red-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-75 ease-linear"
                            style={{ 
                                left: `calc(50% + ${offset.x}px)`, 
                                top: `calc(50% + ${offset.y}px)`,
                                boxShadow: '0 0 10px rgba(239, 68, 68, 0.8)'
                            }}
                        ></div>

                        {/* Center Marker (Goal) */}
                        <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-green-400 rounded-full transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

                        {/* Ammo Counter */}
                        <div className="absolute bottom-4 right-4 text-white font-mono font-bold text-xl bg-black/50 px-3 py-1 rounded">
                            {bulletsLeft} / {pattern.bullets}
                        </div>

                        {!isFiring && bulletsLeft === pattern.bullets && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-none">
                                <div className="text-center text-white">
                                    <MousePointer size={48} className="mx-auto mb-2 animate-bounce" />
                                    <h3 className="text-2xl font-bold">Click & Hold to Fire</h3>
                                    <p className="text-slate-300">Pull down to control recoil</p>
                                </div>
                            </div>
                        )}
                    </div>
                    <p className="text-center text-xs text-slate-500 mt-2 italic">
                        *Simulation only. Actual in-game recoil may vary by attachments.
                    </p>
                </div>
            </div>
        </div>
    );
};
