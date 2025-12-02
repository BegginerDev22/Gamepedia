
import React, { useState, useMemo } from 'react';
import { Users, Shield, Crosshair, Target, Search, Save, Share2, Zap, Hexagon } from 'lucide-react';
import { MOCK_PLAYERS } from '../constants';
import { Player } from '../types';
import { RadarChart } from '../components/RadarChart';

export const TeamBuilderPage: React.FC = () => {
    const [activeSlot, setActiveSlot] = useState<number | null>(null);
    const [teamName, setTeamName] = useState('My Dream Team');
    const [roster, setRoster] = useState<(Player | null)[]>([null, null, null, null]);
    const [searchTerm, setSearchTerm] = useState('');

    // Filter Players
    const filteredPlayers = Object.values(MOCK_PLAYERS).filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.handle.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelectPlayer = (player: Player) => {
        if (activeSlot !== null) {
            const newRoster = [...roster];
            // Remove player if already in another slot
            const existingIndex = newRoster.findIndex(p => p?.id === player.id);
            if (existingIndex !== -1) newRoster[existingIndex] = null;
            
            newRoster[activeSlot] = player;
            setRoster(newRoster);
            setActiveSlot(null);
        }
    };

    const removePlayer = (index: number) => {
        const newRoster = [...roster];
        newRoster[index] = null;
        setRoster(newRoster);
    };

    // Calculate Stats
    const teamStats = useMemo(() => {
        const activePlayers = roster.filter(Boolean) as Player[];
        if (activePlayers.length === 0) return null;

        const avgKD = activePlayers.reduce((sum, p) => sum + (p.stats?.kd || 0), 0) / activePlayers.length;
        const avgDamage = activePlayers.reduce((sum, p) => sum + (p.stats?.avgDamage || 0), 0) / activePlayers.length;
        
        // Mock attribute calculation based on roles/stats
        const firepower = Math.min((avgDamage / 600) * 100, 100);
        const survival = Math.min((avgKD / 2.5) * 100, 100); // High KD = survives fights
        const experience = Math.min((activePlayers.reduce((sum, p) => sum + (p.stats?.matches || 0), 0) / 2000) * 100, 100);
        
        // Synergy bonus if players are from same real team
        const teamCounts: Record<string, number> = {};
        activePlayers.forEach(p => {
            if (p.teamId) teamCounts[p.teamId] = (teamCounts[p.teamId] || 0) + 1;
        });
        const maxSynergy = Math.max(...Object.values(teamCounts), 0);
        const synergy = (maxSynergy / 4) * 100;

        return {
            radar: [
                { label: 'Firepower', value: firepower, fullMark: 100 },
                { label: 'Survival', value: survival, fullMark: 100 },
                { label: 'Experience', value: experience, fullMark: 100 },
                { label: 'Synergy', value: synergy, fullMark: 100 },
                { label: 'Versatility', value: 75, fullMark: 100 }, // Mock constant
            ],
            avgKD,
            rating: Math.round((firepower + survival + experience + synergy + 75) / 5)
        };
    }, [roster]);

    const roles = ['IGL', 'Assaulter', 'Supporter', 'Entry/Flex'];

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-12">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-heading font-bold text-slate-900 dark:text-white flex items-center justify-center">
                    <Users className="mr-3 text-gamepedia-blue" /> Team Builder
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">
                    Draft your ultimate BGMI lineup and analyze team chemistry.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Roster Slots */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                        <div className="flex justify-between items-center mb-6">
                            <input 
                                type="text" 
                                value={teamName}
                                onChange={(e) => setTeamName(e.target.value)}
                                className="text-2xl font-bold bg-transparent border-b border-dashed border-slate-300 focus:border-gamepedia-blue outline-none text-slate-900 dark:text-white"
                            />
                            {teamStats && (
                                <div className="bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-lg flex items-center">
                                    <span className="text-xs font-bold text-slate-500 uppercase mr-2">OVR Rating</span>
                                    <span className="text-xl font-black text-gamepedia-blue">{teamStats.rating}</span>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {roster.map((player, idx) => (
                                <div 
                                    key={idx}
                                    onClick={() => setActiveSlot(idx)}
                                    className={`relative border-2 border-dashed rounded-xl p-4 cursor-pointer transition-all group ${
                                        activeSlot === idx 
                                        ? 'border-gamepedia-blue bg-blue-50 dark:bg-blue-900/20' 
                                        : player 
                                            ? 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
                                            : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100'
                                    }`}
                                >
                                    <span className="absolute top-3 right-3 text-[10px] font-bold uppercase text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded">
                                        {roles[idx]}
                                    </span>

                                    {player ? (
                                        <div className="flex items-center gap-4">
                                            <img src={player.image} className="w-16 h-16 rounded-full object-cover bg-slate-200" />
                                            <div>
                                                <h4 className="font-bold text-lg text-slate-900 dark:text-white">{player.handle}</h4>
                                                <p className="text-xs text-slate-500">{player.role} • {player.stats?.kd} KD</p>
                                            </div>
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); removePlayer(idx); }}
                                                className="absolute bottom-3 right-3 text-red-400 hover:text-red-600 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-24 text-slate-400">
                                            <Users size={24} className="mb-2 opacity-50" />
                                            <span className="text-sm font-bold">Select Player</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        
                        {/* Analysis */}
                        {teamStats && (
                            <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-700 grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="flex flex-col items-center">
                                    <h4 className="font-bold text-sm text-slate-500 uppercase mb-4">Team Radar</h4>
                                    <RadarChart data={teamStats.radar} size={200} color="#8B5CF6" />
                                </div>
                                <div className="space-y-4">
                                    <h4 className="font-bold text-sm text-slate-500 uppercase mb-4">Projected Stats</h4>
                                    <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Avg Team KD</span>
                                        <span className="font-mono font-bold text-slate-900 dark:text-white">{teamStats.avgKD.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Est. Placement</span>
                                        <span className="font-mono font-bold text-green-500">Top 3</span>
                                    </div>
                                    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg border border-yellow-100 dark:border-yellow-800/30 text-xs text-yellow-800 dark:text-yellow-200 leading-relaxed">
                                        <Zap size={14} className="inline mr-1 mb-0.5" />
                                        <strong>Synergy Tip:</strong> Adding more players from the same real-life team increases the Synergy rating significantly.
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Player Picker Sidebar */}
                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col h-[600px]">
                    <div className="mb-4">
                        <h3 className="font-bold text-slate-900 dark:text-white mb-2">Player Pool</h3>
                        <div className="relative">
                            <input 
                                type="text" 
                                placeholder="Search..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-8 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gamepedia-blue dark:text-white"
                            />
                            <Search size={14} className="absolute left-2.5 top-3 text-slate-400" />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar space-y-2">
                        {filteredPlayers.map(player => (
                            <div 
                                key={player.id}
                                onClick={() => handleSelectPlayer(player)}
                                className={`flex items-center p-2 rounded-lg border border-transparent transition-colors cursor-pointer group ${
                                    activeSlot !== null ? 'hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-200' : 'opacity-50 cursor-default'
                                }`}
                            >
                                <img src={player.image} className="w-10 h-10 rounded bg-slate-200 object-cover mr-3" />
                                <div>
                                    <div className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-gamepedia-blue">{player.handle}</div>
                                    <div className="text-xs text-slate-500">{player.role}</div>
                                </div>
                                <div className="ml-auto text-xs font-mono font-bold text-slate-400">{player.stats?.kd} KD</div>
                            </div>
                        ))}
                    </div>
                    
                    {activeSlot === null && (
                        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs font-bold text-center rounded-lg">
                            Select a slot on the left to add a player.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
