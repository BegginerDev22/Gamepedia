
import React, { useState } from 'react';
import { Calculator, DollarSign, Users, PieChart, Briefcase, AlertCircle } from 'lucide-react';

export const PrizeCalculatorPage: React.FC = () => {
    const [totalPrize, setTotalPrize] = useState<number>(100000);
    const [orgCut, setOrgCut] = useState<number>(20); // Percentage
    const [coachCut, setCoachCut] = useState<number>(10); // Percentage of player share usually, but lets do simpler: % of Total or % of Net
    // Standard model: Total -> Tax -> Net -> Org Cut -> Remainder -> (Coach + Players)
    
    const [taxRate, setTaxRate] = useState<number>(30); // TDS in India is usually 30% for winnings > 10k
    const [playerCount, setPlayerCount] = useState<number>(4); // 4 or 5 (sub)

    // Calculation Logic
    const taxAmount = (totalPrize * taxRate) / 100;
    const netPrize = totalPrize - taxAmount;
    
    const orgAmount = (netPrize * orgCut) / 100;
    const remainingAfterOrg = netPrize - orgAmount;
    
    const coachAmount = (remainingAfterOrg * coachCut) / 100;
    const playersPool = remainingAfterOrg - coachAmount;
    
    const perPlayerAmount = playersPool / playerCount;

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-heading font-bold text-slate-900 dark:text-white flex items-center justify-center">
                    <DollarSign className="mr-3 text-green-500" /> Prize Pool Splitter
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">
                    Calculate net winnings after TDS tax, organization cuts, and roster splits.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Inputs */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 space-y-6">
                    <h3 className="font-bold text-slate-900 dark:text-white flex items-center">
                        <Calculator size={18} className="mr-2 text-gamepedia-blue"/> Configuration
                    </h3>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Total Winnings (INR)</label>
                        <div className="relative">
                            <span className="absolute left-3 top-3 text-slate-400 font-bold">₹</span>
                            <input 
                                type="number" 
                                value={totalPrize}
                                onChange={(e) => setTotalPrize(parseInt(e.target.value) || 0)}
                                className="w-full pl-8 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-mono font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-gamepedia-blue outline-none"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Tax Rate (TDS)</label>
                            <div className="relative">
                                <input 
                                    type="number" 
                                    value={taxRate}
                                    onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500 outline-none"
                                />
                                <span className="absolute right-3 top-3 text-slate-400 font-bold">%</span>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Player Count</label>
                            <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                                {[4, 5, 6].map(n => (
                                    <button
                                        key={n}
                                        onClick={() => setPlayerCount(n)}
                                        className={`flex-1 py-1.5 text-xs font-bold rounded transition-colors ${playerCount === n ? 'bg-white dark:bg-slate-700 shadow' : 'text-slate-500'}`}
                                    >
                                        {n}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Organization Cut</label>
                                <span className="text-xs font-mono font-bold text-blue-500">{orgCut}%</span>
                            </div>
                            <input 
                                type="range" min="0" max="100" value={orgCut} 
                                onChange={(e) => setOrgCut(parseInt(e.target.value))}
                                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                            />
                        </div>
                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Coach Share</label>
                                <span className="text-xs font-mono font-bold text-yellow-500">{coachCut}%</span>
                            </div>
                            <input 
                                type="range" min="0" max="50" value={coachCut} 
                                onChange={(e) => setCoachCut(parseInt(e.target.value))}
                                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                            />
                            <p className="text-[10px] text-slate-400 mt-1">*Taken from player pool after Org cut</p>
                        </div>
                    </div>
                </div>

                {/* Outputs */}
                <div className="space-y-6">
                    <div className="bg-slate-900 text-white p-6 rounded-xl shadow-lg border border-slate-800 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-6 opacity-5">
                            <Briefcase size={100} />
                        </div>
                        
                        <div className="relative z-10">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Distribution Breakdown</h3>
                            
                            <div className="space-y-3">
                                <div className="flex justify-between items-center pb-2 border-b border-white/10">
                                    <span className="text-red-400 flex items-center"><AlertCircle size={14} className="mr-2"/> Tax Deduction ({taxRate}%)</span>
                                    <span className="font-mono text-red-400">-₹{taxAmount.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center pb-2 border-b border-white/10">
                                    <span className="text-blue-400 flex items-center"><Briefcase size={14} className="mr-2"/> Org Share ({orgCut}%)</span>
                                    <span className="font-mono text-blue-400">₹{orgAmount.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center pb-2 border-b border-white/10">
                                    <span className="text-yellow-400 flex items-center"><Users size={14} className="mr-2"/> Coach Share ({coachCut}%)</span>
                                    <span className="font-mono text-yellow-400">₹{coachAmount.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center pt-2">
                                    <span className="text-green-400 font-bold text-lg">Player Total Pool</span>
                                    <span className="font-mono font-bold text-xl text-green-400">₹{playersPool.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl border border-green-100 dark:border-green-800/50 text-center">
                        <h4 className="text-sm font-bold text-green-800 dark:text-green-200 uppercase tracking-wider mb-2">Each Player Receives</h4>
                        <div className="text-4xl font-black text-green-600 dark:text-green-400 font-mono">
                            ₹{Math.floor(perPlayerAmount).toLocaleString()}
                        </div>
                        <p className="text-xs text-green-700/60 dark:text-green-300/60 mt-2">
                            Split among {playerCount} players
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
