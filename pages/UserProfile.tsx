
import React from 'react';
import { User, Shield, Star, Trophy, Coins, Clock, Award, Lock, ShoppingBag } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { MOCK_BADGES, MOCK_TEAMS } from '../constants';

export const UserProfile: React.FC = () => {
    const { points, bets, badges, xp, level, inventory } = useUser();

    // Calculated Stats
    const totalBets = bets.length;
    const wonBets = bets.filter(b => b.status === 'won').length;
    const winRate = totalBets > 0 ? Math.round((wonBets / totalBets) * 100) : 0;
    const totalEarnings = bets.filter(b => b.status === 'won').reduce((sum, b) => sum + b.potentialPayout, 0);

    const nextLevelXp = level * 1000;
    const progress = (xp % 1000) / 10; // Percentage

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-12">
            {/* Header Card */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="h-32 bg-gradient-to-r from-gamepedia-blue to-indigo-600 relative">
                    <div className="absolute top-4 right-4 flex items-center space-x-2 bg-black/30 backdrop-blur rounded-full px-3 py-1 text-white text-xs font-bold">
                        <Shield size={12} />
                        <span>Level {level}</span>
                    </div>
                </div>
                <div className="px-8 pb-8 relative">
                    <div className="flex flex-col md:flex-row items-end -mt-12 mb-6 gap-6">
                         <div className="w-24 h-24 rounded-full border-4 border-white dark:border-slate-900 bg-slate-200 flex items-center justify-center text-slate-400 shadow-lg">
                             <User size={48} />
                         </div>
                         <div className="flex-1 mb-2">
                             <h1 className="text-2xl font-heading font-bold text-slate-900 dark:text-white">Guest User</h1>
                             <p className="text-slate-500 text-sm">Joined April 2024</p>
                         </div>
                         <div className="flex items-center space-x-6 mb-2">
                             <div className="text-center">
                                 <span className="block text-xl font-bold text-slate-900 dark:text-white">{badges.filter(b => b.unlocked).length}</span>
                                 <span className="text-xs text-slate-500 uppercase">Badges</span>
                             </div>
                             <div className="text-center">
                                 <span className="block text-xl font-bold text-slate-900 dark:text-white">{totalBets}</span>
                                 <span className="text-xs text-slate-500 uppercase">Predictions</span>
                             </div>
                             <div className="text-center">
                                 <span className="block text-xl font-bold text-gamepedia-blue">{winRate}%</span>
                                 <span className="text-xs text-slate-500 uppercase">Win Rate</span>
                             </div>
                         </div>
                    </div>

                    {/* Level Progress */}
                    <div>
                        <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                            <span>XP Progress</span>
                            <span>{xp} / {nextLevelXp} XP</span>
                        </div>
                        <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" style={{ width: `${progress}%` }}></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column: Badges & Inventory */}
                <div className="md:col-span-1 space-y-6">
                    {/* Badges */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4 flex items-center">
                            <Award className="mr-2 text-amber-500" /> Achievements
                        </h3>
                        <div className="grid grid-cols-3 gap-3">
                            {badges.map(badge => (
                                <div key={badge.id} className="group relative flex flex-col items-center justify-center p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 aspect-square cursor-help">
                                    <div className={`text-2xl mb-1 ${badge.unlocked ? 'opacity-100 scale-110' : 'opacity-30 grayscale'}`}>
                                        {badge.icon}
                                    </div>
                                    {!badge.unlocked && <Lock size={10} className="absolute top-2 right-2 text-slate-400" />}
                                    
                                    {/* Tooltip */}
                                    <div className="absolute bottom-full mb-2 w-40 bg-slate-900 text-white text-xs p-2 rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 text-center">
                                        <div className={`font-bold mb-1 ${badge.rarity === 'Legendary' ? 'text-yellow-400' : badge.rarity === 'Epic' ? 'text-purple-400' : 'text-white'}`}>{badge.name}</div>
                                        <div className="text-slate-300 leading-tight">{badge.description}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Inventory */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4 flex items-center">
                            <ShoppingBag className="mr-2 text-purple-500" /> Inventory
                        </h3>
                        {inventory.length > 0 ? (
                            <div className="grid grid-cols-3 gap-3">
                                {inventory.map(item => (
                                    <div key={item.id} className="flex flex-col items-center justify-center p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 aspect-square group relative" title={item.name}>
                                        <img src={item.image} className="w-full h-full object-contain" />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-white text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                                            Equip
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-6 text-slate-500 text-sm">
                                No items owned. Visit the Store to buy avatars and frames!
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Betting History */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                        <div className="flex justify-between items-center mb-6">
                             <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center">
                                <Coins className="mr-2 text-gamepedia-blue" /> Prediction History
                            </h3>
                            <div className="text-sm text-green-600 dark:text-green-400 font-bold bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full">
                                Net Profit: +{totalEarnings} PTS
                            </div>
                        </div>

                        {bets.length > 0 ? (
                            <div className="space-y-3">
                                {bets.map(bet => {
                                    const team = MOCK_TEAMS[bet.teamId];
                                    return (
                                        <div key={bet.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700">
                                            <div className="flex items-center space-x-4">
                                                <div className={`p-2 rounded-full ${bet.status === 'won' ? 'bg-green-100 text-green-600' : bet.status === 'lost' ? 'bg-red-100 text-red-600' : 'bg-slate-200 text-slate-500'}`}>
                                                    {bet.status === 'won' ? <Trophy size={16} /> : <Clock size={16} />}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center">
                                                        Predicted {team ? team.name : 'Team'} 
                                                        <span className="ml-2 text-xs font-normal text-slate-500">@ {bet.odds}x</span>
                                                    </div>
                                                    <div className="text-xs text-slate-500">{new Date(bet.timestamp).toLocaleDateString()}</div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-mono font-bold text-sm text-slate-900 dark:text-white">{bet.amount} PTS</div>
                                                <div className={`text-xs font-bold ${bet.status === 'won' ? 'text-green-500' : bet.status === 'lost' ? 'text-red-500' : 'text-slate-400'}`}>
                                                    {bet.status === 'won' ? `+${bet.potentialPayout}` : bet.status.toUpperCase()}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-12 text-slate-500">
                                No predictions made yet. Go to a match page to start!
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
