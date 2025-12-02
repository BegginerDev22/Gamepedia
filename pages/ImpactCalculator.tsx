
import React, { useState } from 'react';
import { Calculator, Target, Crosshair, Award, Zap, Activity, Share2, Check } from 'lucide-react';

export const ImpactCalculatorPage: React.FC = () => {
    const [matches, setMatches] = useState<number>(50);
    const [kills, setKills] = useState<number>(200);
    const [damage, setDamage] = useState<number>(35000);
    const [assists, setAssists] = useState<number>(80);
    const [survival, setSurvival] = useState<number>(18); // Avg minutes
    const [copied, setCopied] = useState(false);

    // Calculation Logic
    const kpm = kills / (matches || 1);
    const avgDamage = damage / (matches || 1);
    const apm = assists / (matches || 1);
    
    // Impact Score Formula (Mock)
    // Base 50 + KPM*10 + APM*5 + (AvgDmg/100)*2 + (Survival/30)*10
    // Max roughly 100-120 for pro stats
    let score = 30 + (kpm * 12) + (apm * 4) + (avgDamage * 0.04) + (survival * 0.5);
    score = Math.min(Math.round(score), 100);

    const getRank = (s: number) => {
        if (s >= 95) return { label: 'S+', color: 'text-red-500', bg: 'bg-red-500' };
        if (s >= 85) return { label: 'S', color: 'text-orange-500', bg: 'bg-orange-500' };
        if (s >= 75) return { label: 'A', color: 'text-purple-500', bg: 'bg-purple-500' };
        if (s >= 60) return { label: 'B', color: 'text-blue-500', bg: 'bg-blue-500' };
        if (s >= 40) return { label: 'C', color: 'text-green-500', bg: 'bg-green-500' };
        return { label: 'D', color: 'text-slate-500', bg: 'bg-slate-500' };
    };

    const rank = getRank(score);

    const handleShare = () => {
        const text = `My BGMI Impact Rating: ${score}/100 (${rank.label}) | KPM: ${kpm.toFixed(2)} | Avg Dmg: ${avgDamage.toFixed(0)}`;
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-heading font-bold text-slate-900 dark:text-white flex items-center justify-center">
                    <Activity className="mr-3 text-gamepedia-blue" /> Impact Score Calculator
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">
                    Evaluate your true performance beyond K/D ratio. Based on competitive metrics.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Inputs */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 space-y-6">
                    <h3 className="font-bold text-slate-900 dark:text-white flex items-center">
                        <Calculator size={18} className="mr-2 text-slate-500"/> Player Statistics
                    </h3>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Matches Played</label>
                        <input 
                            type="number" 
                            value={matches}
                            onChange={(e) => setMatches(parseInt(e.target.value) || 1)}
                            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-gamepedia-blue outline-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Total Kills</label>
                            <input 
                                type="number" 
                                value={kills}
                                onChange={(e) => setKills(parseInt(e.target.value) || 0)}
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-gamepedia-blue outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Total Assists</label>
                            <input 
                                type="number" 
                                value={assists}
                                onChange={(e) => setAssists(parseInt(e.target.value) || 0)}
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-gamepedia-blue outline-none"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Total Damage</label>
                            <input 
                                type="number" 
                                value={damage}
                                onChange={(e) => setDamage(parseInt(e.target.value) || 0)}
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-gamepedia-blue outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Avg Survival (Min)</label>
                            <input 
                                type="number" 
                                value={survival}
                                onChange={(e) => setSurvival(parseInt(e.target.value) || 0)}
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-gamepedia-blue outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Results */}
                <div className="flex flex-col gap-6">
                    <div className="bg-slate-900 rounded-xl p-8 text-white shadow-lg border border-slate-800 relative overflow-hidden flex-1 flex flex-col items-center justify-center">
                        <div className="absolute top-0 right-0 p-6 opacity-5">
                            <Zap size={120} />
                        </div>
                        
                        <div className="relative z-10 text-center">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Impact Rating</h3>
                            
                            <div className="relative w-40 h-40 flex items-center justify-center mb-6">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-slate-800" />
                                    <circle 
                                        cx="80" 
                                        cy="80" 
                                        r="70" 
                                        stroke="currentColor" 
                                        strokeWidth="10" 
                                        fill="transparent" 
                                        className={rank.color} 
                                        strokeDasharray={440} 
                                        strokeDashoffset={440 - (440 * score) / 100}
                                        strokeLinecap="round"
                                        style={{ transition: 'stroke-dashoffset 1s ease-out' }}
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center flex-col">
                                    <span className={`text-5xl font-black ${rank.color}`}>{score}</span>
                                    <span className="text-xs text-slate-400 font-bold uppercase">/ 100</span>
                                </div>
                            </div>

                            <div className={`inline-block px-4 py-1 rounded-full text-sm font-bold bg-white text-slate-900 mb-4`}>
                                Tier <span className={rank.color}>{rank.label}</span>
                            </div>

                            <button 
                                onClick={handleShare}
                                className="flex items-center justify-center space-x-2 text-sm text-slate-400 hover:text-white transition-colors"
                            >
                                {copied ? <Check size={16} className="text-green-500" /> : <Share2 size={16} />}
                                <span>{copied ? 'Copied to Clipboard' : 'Share Result'}</span>
                            </button>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
                        <h4 className="font-bold text-slate-900 dark:text-white mb-4 text-sm uppercase">Breakdown</h4>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500 flex items-center"><Crosshair size={14} className="mr-2"/> Kills/Match</span>
                                <span className="font-mono font-bold dark:text-white">{kpm.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500 flex items-center"><Target size={14} className="mr-2"/> Avg Damage</span>
                                <span className="font-mono font-bold dark:text-white">{avgDamage.toFixed(0)}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500 flex items-center"><Award size={14} className="mr-2"/> Assists/Match</span>
                                <span className="font-mono font-bold dark:text-white">{apm.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
