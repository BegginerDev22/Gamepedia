
import React from 'react';
import { Target, CheckCircle, Clock, Gift, Zap } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

export const MissionCenterPage: React.FC = () => {
    const { missions, claimMission } = useUser();

    const dailyMissions = missions.filter(m => m.type === 'Daily');
    const weeklyMissions = missions.filter(m => m.type === 'Weekly');

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-heading font-bold text-slate-900 dark:text-white flex items-center justify-center">
                    <Target className="mr-3 text-red-500" /> Mission Center
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">
                    Complete daily tasks to earn GameCredits and XP.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Daily Missions */}
                <div className="space-y-4">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center">
                        <Clock size={18} className="mr-2 text-blue-500" /> Daily Missions
                    </h3>
                    {dailyMissions.map(mission => (
                        <div key={mission.id} className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex justify-between items-center">
                            <div className="flex-1">
                                <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">{mission.title}</h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-2">{mission.description}</p>
                                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden max-w-[150px]">
                                    <div 
                                        className="h-full bg-blue-500 rounded-full" 
                                        style={{ width: `${(mission.progress / mission.maxProgress) * 100}%` }}
                                    ></div>
                                </div>
                                <span className="text-[10px] text-slate-400 mt-1 block">{mission.progress}/{mission.maxProgress}</span>
                            </div>
                            <div className="ml-4 flex flex-col items-end">
                                <span className="text-xs font-bold text-yellow-600 dark:text-yellow-400 flex items-center mb-2">
                                    <Zap size={10} className="mr-1" /> {mission.reward} PTS
                                </span>
                                {mission.claimed ? (
                                    <button disabled className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-lg text-xs font-bold flex items-center cursor-default">
                                        <CheckCircle size={12} className="mr-1" /> Claimed
                                    </button>
                                ) : mission.completed ? (
                                    <button 
                                        onClick={() => claimMission(mission.id)}
                                        className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-xs font-bold hover:bg-green-600 transition-colors animate-pulse"
                                    >
                                        Claim
                                    </button>
                                ) : (
                                    <button disabled className="px-3 py-1.5 bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-lg text-xs font-bold cursor-not-allowed">
                                        In Progress
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Weekly Missions */}
                <div className="space-y-4">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center">
                        <Gift size={18} className="mr-2 text-purple-500" /> Weekly Challenges
                    </h3>
                    {weeklyMissions.map(mission => (
                        <div key={mission.id} className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex justify-between items-center">
                            <div className="flex-1">
                                <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">{mission.title}</h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-2">{mission.description}</p>
                                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden max-w-[150px]">
                                    <div 
                                        className="h-full bg-purple-500 rounded-full" 
                                        style={{ width: `${(mission.progress / mission.maxProgress) * 100}%` }}
                                    ></div>
                                </div>
                                <span className="text-[10px] text-slate-400 mt-1 block">{mission.progress}/{mission.maxProgress}</span>
                            </div>
                            <div className="ml-4 flex flex-col items-end">
                                <span className="text-xs font-bold text-yellow-600 dark:text-yellow-400 flex items-center mb-2">
                                    <Zap size={10} className="mr-1" /> {mission.reward} PTS
                                </span>
                                {mission.claimed ? (
                                    <button disabled className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-lg text-xs font-bold flex items-center cursor-default">
                                        <CheckCircle size={12} className="mr-1" /> Claimed
                                    </button>
                                ) : mission.completed ? (
                                    <button 
                                        onClick={() => claimMission(mission.id)}
                                        className="px-3 py-1.5 bg-green-500 text-white rounded-lg text-xs font-bold hover:bg-green-600 transition-colors animate-pulse"
                                    >
                                        Claim
                                    </button>
                                ) : (
                                    <button disabled className="px-3 py-1.5 bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-lg text-xs font-bold cursor-not-allowed">
                                        In Progress
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
