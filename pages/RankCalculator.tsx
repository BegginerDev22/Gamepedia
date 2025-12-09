
import React, { useState } from 'react';
import { TrendingUp, Target, Calculator, Trophy, Award, AlertCircle } from 'lucide-react';
import { RANK_THRESHOLDS } from '../constants';

export const RankCalculatorPage: React.FC = () => {
    const [currentPoints, setCurrentPoints] = useState(3200);
    const [avgPoints, setAvgPoints] = useState(15);
    const [targetTierIdx, setTargetTierIdx] = useState(6); // Default to Ace

    const targetTier = RANK_THRESHOLDS[targetTierIdx];
    const pointsNeeded = Math.max(0, targetTier.points - currentPoints);
    const matchesNeeded = Math.ceil(pointsNeeded / avgPoints);

    // Calculate progress to next major tier
    const currentTier = RANK_THRESHOLDS.slice().reverse().find(t => currentPoints >= t.points) || RANK_THRESHOLDS[0];
    const nextTier = RANK_THRESHOLDS.find(t => t.points > currentPoints) || RANK_THRESHOLDS[RANK_THRESHOLDS.length - 1];
    
    const progress = nextTier.points === currentTier.points 
        ? 100 
        : ((currentPoints - currentTier.points) / (nextTier.points - currentTier.points)) * 100;

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-heading font-bold text-slate-900 dark:text-white flex items-center justify-center">
                    <Calculator className="mr-3 text-gamepedia-blue" /> Rank Calculator
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">
                    Plan your road to Conqueror. Estimate how many matches you need to grind.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Input Section */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Current Points</label>
                        <div className="relative">
                            <input 
                                type="number" 
                                value={currentPoints} 
                                onChange={(e) => setCurrentPoints(parseInt(e.target.value) || 0)}
                                className="w-full pl-4 pr-16 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono text-lg focus:ring-2 focus:ring-gamepedia-blue outline-none dark:text-white"
                            />
                            <span className="absolute right-4 top-3.5 text-xs font-bold text-slate-400 uppercase">PTS</span>
                        </div>
                        <div className="flex justify-between mt-2 text-xs text-slate-500">
                            <span>Current: <span className="font-bold text-gamepedia-blue">{currentTier.name}</span></span>
                            <span>Next: {nextTier.name} ({nextTier.points})</span>
                        </div>
                        
                        {/* Mini Progress Bar */}
                        <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full mt-2 overflow-hidden">
                            <div className="h-full bg-gamepedia-blue" style={{ width: `${progress}%` }}></div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Target Rank</label>
                        <select 
                            value={targetTierIdx}
                            onChange={(e) => setTargetTierIdx(parseInt(e.target.value))}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-gamepedia-blue outline-none cursor-pointer"
                        >
                            {RANK_THRESHOLDS.map((tier, idx) => (
                                <option key={tier.name} value={idx} disabled={tier.points < currentPoints}>
                                    {tier.name} ({tier.points} pts)
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <div className="flex justify-between mb-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Avg Points / Match</label>
                            <span className="font-mono font-bold text-gamepedia-blue">{avgPoints}</span>
                        </div>
                        <input 
                            type="range" 
                            min="5" 
                            max="40" 
                            step="1"
                            value={avgPoints}
                            onChange={(e) => setAvgPoints(parseInt(e.target.value))}
                            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-gamepedia-blue"
                        />
                        <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                            <span>Safe Play (10)</span>
                            <span>Aggressive (25+)</span>
                        </div>
                    </div>
                </div>

                {/* Results Section */}
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-8 text-white shadow-xl border border-slate-700 flex flex-col justify-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-10">
                        <Trophy size={120} />
                    </div>
                    
                    <div className="relative z-10">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Est. Matches Remaining</h3>
                        <div className="text-6xl font-black text-white mb-2 font-mono tracking-tighter">
                            {pointsNeeded > 0 ? matchesNeeded : 0}
                        </div>
                        <div className="text-slate-300 text-sm mb-8">
                            matches to reach <span className="text-yellow-400 font-bold">{targetTier.name}</span>
                        </div>

                        <div className="space-y-4 bg-black/20 p-4 rounded-lg backdrop-blur-sm">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-300">Points Needed</span>
                                <span className="font-mono font-bold text-red-400">+{pointsNeeded}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-300">Est. Playtime</span>
                                <span className="font-mono font-bold text-blue-400">~{Math.ceil(matchesNeeded * 25 / 60)} Hours</span>
                            </div>
                        </div>

                        {matchesNeeded > 50 && (
                            <div className="mt-6 flex items-start gap-3 text-yellow-200 text-xs bg-yellow-900/20 p-3 rounded border border-yellow-700/30">
                                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                                <p>That's a long grind! Try to increase your survival time to boost your average points.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
