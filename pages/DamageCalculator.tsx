
import React, { useState } from 'react';
import { Crosshair, Shield, Target, Zap, AlertCircle } from 'lucide-react';
import { MOCK_WEAPONS } from '../constants';
import { Weapon } from '../types';

export const DamageCalculatorPage: React.FC = () => {
    const [selectedWeaponId, setSelectedWeaponId] = useState<string>(MOCK_WEAPONS[0].id);
    const [helmetLevel, setHelmetLevel] = useState<0 | 1 | 2 | 3>(2);
    const [vestLevel, setVestLevel] = useState<0 | 1 | 2 | 3>(2);
    const [distance, setDistance] = useState<number>(50); // Meters

    const weapon = MOCK_WEAPONS.find(w => w.id === selectedWeaponId) || MOCK_WEAPONS[0];

    // Damage Logic
    const getDamageReduction = (level: number) => {
        switch(level) {
            case 1: return 0.30;
            case 2: return 0.40;
            case 3: return 0.55;
            default: return 0;
        }
    };

    const getDistanceMultiplier = (dist: number, type: string) => {
        // Simplified drop-off logic
        if (type === 'SR') return 1.0; // SRs generally hold damage better
        if (dist < 50) return 1.0;
        if (dist < 100) return 0.95;
        if (dist < 200) return 0.85;
        return 0.75;
    };

    const calculateSTK = (hitbox: 'head' | 'body' | 'limb') => {
        let multiplier = 1.0;
        let armorLevel = 0;

        if (hitbox === 'head') {
            multiplier = weapon.type === 'SR' ? 2.5 : weapon.type === 'DMR' ? 2.3 : 2.0; // Base multipliers
            armorLevel = helmetLevel;
        } else if (hitbox === 'body') {
            multiplier = 1.0;
            armorLevel = vestLevel;
        } else { // limb
            multiplier = 0.5;
            armorLevel = 0; // Limbs ignore armor usually, but take less dmg
        }

        const distMult = getDistanceMultiplier(distance, weapon.type);
        const reduction = getDamageReduction(armorLevel);
        
        const finalDamage = weapon.damage * multiplier * distMult * (1 - reduction);
        return Math.ceil(100 / finalDamage);
    };

    const calculateTTK = (stk: number) => {
        if (stk <= 1) return 0;
        // Rate of fire is usually rounds per minute in data? 
        // MOCK_WEAPONS has arbitrary fireRate 0-100. Let's approximate.
        // Assume fireRate 100 = 1000 RPM (0.06s per shot), 0 = 60 RPM (1s per shot)
        const roundsPerSecond = (weapon.fireRate / 100) * 15 + 2; // Rough mapping
        const timePerShot = 1 / roundsPerSecond;
        return ((stk - 1) * timePerShot).toFixed(2);
    };

    const stkHead = calculateSTK('head');
    const stkBody = calculateSTK('body');
    const stkLimb = calculateSTK('limb');

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-12">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-heading font-bold text-slate-900 dark:text-white flex items-center justify-center">
                    <Target className="mr-3 text-red-500" /> Damage Calculator
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">
                    Theory-craft your loadout. Calculate Shots-To-Kill (STK) and Time-To-Kill (TTK) vs different armor tiers.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Controls Panel */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Weapon Select */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                        <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center">
                            <Crosshair size={18} className="mr-2 text-gamepedia-blue" /> Select Weapon
                        </h3>
                        <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-2">
                            {MOCK_WEAPONS.map(w => (
                                <button 
                                    key={w.id} 
                                    onClick={() => setSelectedWeaponId(w.id)}
                                    className={`p-3 rounded-lg border text-left transition-all flex items-center gap-3 ${
                                        selectedWeaponId === w.id 
                                        ? 'border-gamepedia-blue bg-blue-50 dark:bg-blue-900/20 ring-1 ring-gamepedia-blue' 
                                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                                    }`}
                                >
                                    <img 
                                        src={w.image} 
                                        className="w-10 h-6 object-contain" 
                                        onError={(e) => {
                                            e.currentTarget.src = 'https://placehold.co/40x24/2d3748/a0aec0?text=W';
                                            e.currentTarget.onerror = null;
                                        }}
                                    />
                                    <div>
                                        <div className="text-xs font-bold text-slate-900 dark:text-white">{w.name}</div>
                                        <div className="text-[10px] text-slate-500">{w.type}</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                        
                        {/* Selected Weapon Stats */}
                        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Base Damage</span>
                                <span className="text-lg font-mono font-bold text-slate-900 dark:text-white">{weapon.damage}</span>
                            </div>
                            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-red-500" style={{ width: `${weapon.damage}%` }}></div>
                            </div>
                        </div>
                    </div>

                    {/* Scenario Config */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 space-y-6">
                        {/* Helmet */}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Enemy Helmet</label>
                            <div className="flex gap-2">
                                {[0, 1, 2, 3].map(lvl => (
                                    <button 
                                        key={lvl}
                                        onClick={() => setHelmetLevel(lvl as any)}
                                        className={`flex-1 py-2 rounded-lg font-bold text-sm transition-colors border ${
                                            helmetLevel === lvl 
                                            ? 'bg-slate-800 text-white border-slate-900 dark:bg-white dark:text-slate-900' 
                                            : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'
                                        }`}
                                    >
                                        {lvl === 0 ? 'None' : `Lv${lvl}`}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Vest */}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Enemy Vest</label>
                            <div className="flex gap-2">
                                {[0, 1, 2, 3].map(lvl => (
                                    <button 
                                        key={lvl}
                                        onClick={() => setVestLevel(lvl as any)}
                                        className={`flex-1 py-2 rounded-lg font-bold text-sm transition-colors border ${
                                            vestLevel === lvl 
                                            ? 'bg-slate-800 text-white border-slate-900 dark:bg-white dark:text-slate-900' 
                                            : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'
                                        }`}
                                    >
                                        {lvl === 0 ? 'None' : `Lv${lvl}`}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Distance */}
                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Distance</label>
                                <span className="text-xs font-mono font-bold text-gamepedia-blue">{distance}m</span>
                            </div>
                            <input 
                                type="range" 
                                min="0" 
                                max="300" 
                                step="10"
                                value={distance}
                                onChange={(e) => setDistance(parseInt(e.target.value))}
                                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-gamepedia-blue"
                            />
                            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                                <span>0m</span>
                                <span>150m</span>
                                <span>300m</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Results Visualizer */}
                <div className="lg:col-span-2 bg-slate-900 rounded-xl p-8 relative overflow-hidden flex flex-col items-center justify-center border border-slate-800 shadow-2xl">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                    
                    {/* Summary Cards */}
                    <div className="grid grid-cols-3 gap-4 w-full mb-8 relative z-10">
                        <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-lg text-center">
                            <div className="text-xs text-red-400 font-bold uppercase tracking-wider mb-1">Head Shots</div>
                            <div className="text-4xl font-mono font-bold text-red-500">{stkHead}</div>
                            <div className="text-[10px] text-red-400/70 mt-1">{calculateTTK(stkHead)}s TTK</div>
                        </div>
                        <div className="bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-lg text-center">
                            <div className="text-xs text-yellow-400 font-bold uppercase tracking-wider mb-1">Body Shots</div>
                            <div className="text-4xl font-mono font-bold text-yellow-500">{stkBody}</div>
                            <div className="text-[10px] text-yellow-400/70 mt-1">{calculateTTK(stkBody)}s TTK</div>
                        </div>
                        <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-lg text-center">
                            <div className="text-xs text-blue-400 font-bold uppercase tracking-wider mb-1">Limb Shots</div>
                            <div className="text-4xl font-mono font-bold text-blue-500">{stkLimb}</div>
                            <div className="text-[10px] text-blue-400/70 mt-1">{calculateTTK(stkLimb)}s TTK</div>
                        </div>
                    </div>

                    {/* Body Visual */}
                    <div className="relative h-[400px] w-[200px] z-10">
                        {/* Head */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full border-4 border-red-500 bg-red-900/20 flex items-center justify-center">
                            <span className="text-2xl font-bold text-white">{stkHead}</span>
                            {helmetLevel > 0 && (
                                <div className="absolute -top-3 bg-slate-800 text-white text-[10px] px-2 py-0.5 rounded border border-slate-600">
                                    Lv{helmetLevel}
                                </div>
                            )}
                        </div>
                        
                        {/* Torso */}
                        <div className="absolute top-24 left-1/2 -translate-x-1/2 w-32 h-40 rounded-lg border-4 border-yellow-500 bg-yellow-900/20 flex items-center justify-center">
                            <span className="text-2xl font-bold text-white">{stkBody}</span>
                            {vestLevel > 0 && (
                                <div className="absolute -top-3 bg-slate-800 text-white text-[10px] px-2 py-0.5 rounded border border-slate-600">
                                    Lv{vestLevel}
                                </div>
                            )}
                        </div>

                        {/* Arms */}
                        <div className="absolute top-24 -left-4 w-8 h-32 rounded-full border-2 border-blue-500 bg-blue-900/20"></div>
                        <div className="absolute top-24 -right-4 w-8 h-32 rounded-full border-2 border-blue-500 bg-blue-900/20"></div>

                        {/* Legs */}
                        <div className="absolute top-[270px] left-4 w-10 h-32 rounded-full border-2 border-blue-500 bg-blue-900/20 flex items-end justify-center pb-4">
                             <span className="text-lg font-bold text-white">{stkLimb}</span>
                        </div>
                        <div className="absolute top-[270px] right-4 w-10 h-32 rounded-full border-2 border-blue-500 bg-blue-900/20 flex items-end justify-center pb-4">
                             <span className="text-lg font-bold text-white">{stkLimb}</span>
                        </div>
                    </div>

                    <div className="absolute bottom-6 right-6 text-slate-500 text-xs flex items-center">
                        <AlertCircle size={12} className="mr-1" /> Estimates based on standard multipliers.
                    </div>
                </div>
            </div>
        </div>
    );
};
