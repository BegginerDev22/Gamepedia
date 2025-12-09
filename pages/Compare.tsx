
import React, { useState } from 'react';
import { Search, X, Swords, TrendingUp, Crown, Target, Shield, Crosshair, Users } from 'lucide-react';
import { MOCK_PLAYERS, MOCK_TEAMS } from '../constants';
import { Player, Team } from '../types';
import { Link } from 'react-router-dom';

// Helper to simulate finding a player
const searchPlayer = (query: string): Player[] => {
    if (!query) return [];
    return Object.values(MOCK_PLAYERS).filter(p => 
        p.handle.toLowerCase().includes(query.toLowerCase()) || 
        p.name.toLowerCase().includes(query.toLowerCase())
    );
};

// Helper to simulate finding a team
const searchTeam = (query: string): Team[] => {
    if (!query) return [];
    return Object.values(MOCK_TEAMS).filter(t => 
        t.name.toLowerCase().includes(query.toLowerCase()) || 
        t.shortName.toLowerCase().includes(query.toLowerCase())
    );
};

const StatComparisonBar: React.FC<{ label: string; val1: number; val2: number; max: number; format?: (v: number) => string }> = ({ label, val1, val2, max, format }) => {
    const pct1 = Math.min((val1 / max) * 100, 100);
    const pct2 = Math.min((val2 / max) * 100, 100);
    const display1 = format ? format(val1) : val1;
    const display2 = format ? format(val2) : val2;

    const winner = val1 > val2 ? 1 : val2 > val1 ? 2 : 0;

    return (
        <div className="mb-4">
            <div className="flex justify-between text-sm font-medium mb-1 px-1">
                <span className={`${winner === 1 ? 'text-gamepedia-blue font-bold' : 'text-slate-500'}`}>{display1}</span>
                <span className="text-slate-400 text-xs uppercase tracking-wider">{label}</span>
                <span className={`${winner === 2 ? 'text-gamepedia-orange font-bold' : 'text-slate-500'}`}>{display2}</span>
            </div>
            <div className="flex h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className="flex-1 flex justify-end bg-transparent">
                    <div className={`h-full rounded-l-full ${winner === 1 ? 'bg-gamepedia-blue' : 'bg-slate-400/50'}`} style={{ width: `${pct1}%` }}></div>
                </div>
                <div className="w-0.5 bg-white dark:bg-slate-900 z-10"></div>
                <div className="flex-1 flex justify-start bg-transparent">
                    <div className={`h-full rounded-r-full ${winner === 2 ? 'bg-gamepedia-orange' : 'bg-slate-400/50'}`} style={{ width: `${pct2}%` }}></div>
                </div>
            </div>
        </div>
    );
};

export const ComparePage: React.FC = () => {
    const [compareType, setCompareType] = useState<'player' | 'team'>('player');
    
    // Player State
    const [player1, setPlayer1] = useState<Player | null>(MOCK_PLAYERS['p6']); // Default Jonathan
    const [player2, setPlayer2] = useState<Player | null>(MOCK_PLAYERS['p1']); // Default Manya
    
    // Team State
    const [team1, setTeam1] = useState<Team | null>(MOCK_TEAMS['soul']); 
    const [team2, setTeam2] = useState<Team | null>(MOCK_TEAMS['godl']);

    const [query1, setQuery1] = useState('');
    const [query2, setQuery2] = useState('');
    const [showSearch1, setShowSearch1] = useState(false);
    const [showSearch2, setShowSearch2] = useState(false);

    const results1 = compareType === 'player' ? searchPlayer(query1) : searchTeam(query1);
    const results2 = compareType === 'player' ? searchPlayer(query2) : searchTeam(query2);

    const resetSearch = () => {
        setQuery1('');
        setQuery2('');
        setShowSearch1(false);
        setShowSearch2(false);
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
             <div className="text-center mb-8">
                <h1 className="text-3xl font-heading font-bold text-slate-900 dark:text-white flex items-center justify-center">
                    <Swords className="mr-3 text-gamepedia-blue" /> Head-to-Head Analysis
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">Compare stats, roles, and performance metrics side-by-side.</p>
                
                <div className="flex justify-center mt-6">
                    <div className="bg-white dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700 flex">
                        <button 
                            onClick={() => { setCompareType('player'); resetSearch(); }}
                            className={`px-6 py-2 rounded-md text-sm font-bold transition-colors ${compareType === 'player' ? 'bg-gamepedia-blue text-white shadow-md' : 'text-slate-500 dark:text-slate-400'}`}
                        >
                            Compare Players
                        </button>
                        <button 
                            onClick={() => { setCompareType('team'); resetSearch(); }}
                            className={`px-6 py-2 rounded-md text-sm font-bold transition-colors ${compareType === 'team' ? 'bg-gamepedia-blue text-white shadow-md' : 'text-slate-500 dark:text-slate-400'}`}
                        >
                            Compare Teams
                        </button>
                    </div>
                </div>
             </div>

             {/* Selection Header */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                {/* Entity 1 Selector */}
                <div className="relative">
                    {(compareType === 'player' ? player1 : team1) ? (
                        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border-2 border-gamepedia-blue p-6 flex flex-col items-center text-center relative">
                            <button onClick={() => { compareType === 'player' ? setPlayer1(null) : setTeam1(null); setShowSearch1(true); }} className="absolute top-3 right-3 text-slate-400 hover:text-red-500"><X size={18}/></button>
                            <div className={`rounded-full border-4 border-slate-100 dark:border-slate-800 overflow-hidden mb-4 shadow-sm ${compareType === 'player' ? 'w-24 h-24' : 'w-24 h-24 p-4 bg-slate-50 dark:bg-slate-800'}`}>
                                <img 
                                    src={compareType === 'player' ? player1?.image : team1?.logoUrl} 
                                    alt="Avatar" 
                                    className="w-full h-full object-cover" 
                                />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{compareType === 'player' ? player1?.handle : team1?.name}</h2>
                            <p className="text-slate-500 dark:text-slate-400 text-sm">{compareType === 'player' ? player1?.name : team1?.region}</p>
                            {compareType === 'player' && (
                                <span className="mt-2 px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full text-xs font-bold uppercase">{player1?.role}</span>
                            )}
                        </div>
                    ) : (
                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 h-[280px] flex flex-col items-center justify-center p-6">
                            <div className="relative w-full max-w-xs">
                                <input 
                                    type="text" 
                                    placeholder={`Search ${compareType}...`} 
                                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-gamepedia-blue outline-none"
                                    value={query1}
                                    onChange={(e) => setQuery1(e.target.value)}
                                />
                                <Search size={18} className="absolute left-3 top-2.5 text-slate-400" />
                                {results1.length > 0 && (
                                    <div className="absolute w-full mt-2 bg-white dark:bg-slate-900 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 z-50 max-h-60 overflow-y-auto">
                                        {results1.map((res: any) => (
                                            <button key={res.id} onClick={() => { compareType === 'player' ? setPlayer1(res) : setTeam1(res); setQuery1(''); }} className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 border-b border-slate-100 dark:border-slate-800 last:border-0">
                                                <span className="font-bold text-slate-900 dark:text-white">{compareType === 'player' ? res.handle : res.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <p className="text-slate-400 text-sm mt-4">Select first {compareType}</p>
                        </div>
                    )}
                </div>

                {/* VS Badge */}
                <div className="flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-slate-900 dark:bg-white rounded-full flex items-center justify-center shadow-xl z-10">
                        <span className="font-black text-2xl text-white dark:text-slate-900 italic">VS</span>
                    </div>
                </div>

                {/* Entity 2 Selector */}
                <div className="relative">
                    {(compareType === 'player' ? player2 : team2) ? (
                        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border-2 border-gamepedia-orange p-6 flex flex-col items-center text-center relative">
                             <button onClick={() => { compareType === 'player' ? setPlayer2(null) : setTeam2(null); setShowSearch2(true); }} className="absolute top-3 right-3 text-slate-400 hover:text-red-500"><X size={18}/></button>
                            <div className={`rounded-full border-4 border-slate-100 dark:border-slate-800 overflow-hidden mb-4 shadow-sm ${compareType === 'player' ? 'w-24 h-24' : 'w-24 h-24 p-4 bg-slate-50 dark:bg-slate-800'}`}>
                                <img 
                                    src={compareType === 'player' ? player2?.image : team2?.logoUrl} 
                                    alt="Avatar" 
                                    className="w-full h-full object-cover" 
                                />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{compareType === 'player' ? player2?.handle : team2?.name}</h2>
                            <p className="text-slate-500 dark:text-slate-400 text-sm">{compareType === 'player' ? player2?.name : team2?.region}</p>
                            {compareType === 'player' && (
                                <span className="mt-2 px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full text-xs font-bold uppercase">{player2?.role}</span>
                            )}
                        </div>
                    ) : (
                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 h-[280px] flex flex-col items-center justify-center p-6">
                             <div className="relative w-full max-w-xs">
                                <input 
                                    type="text" 
                                    placeholder={`Search ${compareType}...`} 
                                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-gamepedia-orange outline-none"
                                    value={query2}
                                    onChange={(e) => setQuery2(e.target.value)}
                                />
                                <Search size={18} className="absolute left-3 top-2.5 text-slate-400" />
                                {results2.length > 0 && (
                                    <div className="absolute w-full mt-2 bg-white dark:bg-slate-900 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 z-50 max-h-60 overflow-y-auto">
                                        {results2.map((res: any) => (
                                            <button key={res.id} onClick={() => { compareType === 'player' ? setPlayer2(res) : setTeam2(res); setQuery2(''); }} className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 border-b border-slate-100 dark:border-slate-800 last:border-0">
                                                <span className="font-bold text-slate-900 dark:text-white">{compareType === 'player' ? res.handle : res.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <p className="text-slate-400 text-sm mt-4">Select second {compareType}</p>
                        </div>
                    )}
                </div>
             </div>

             {/* COMPARISON DATA */}
             {compareType === 'player' && player1 && player2 && player1.stats && player2.stats && (
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                     {/* Metrics Chart */}
                     <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                        <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white mb-6 flex items-center">
                            <TrendingUp className="mr-2 text-slate-500" /> Performance Metrics
                        </h3>
                        
                        <div className="space-y-6">
                            <StatComparisonBar 
                                label="K/D Ratio" 
                                val1={player1.stats.kd} 
                                val2={player2.stats.kd} 
                                max={3.0} 
                                format={(v) => v.toFixed(2)}
                            />
                            <StatComparisonBar 
                                label="Avg Damage" 
                                val1={player1.stats.avgDamage} 
                                val2={player2.stats.avgDamage} 
                                max={1000} 
                            />
                            <StatComparisonBar 
                                label="Total Finishes" 
                                val1={player1.stats.finishes} 
                                val2={player2.stats.finishes} 
                                max={2500} 
                            />
                            <StatComparisonBar 
                                label="Matches Played" 
                                val1={player1.stats.matches} 
                                val2={player2.stats.matches} 
                                max={600} 
                            />
                             <StatComparisonBar 
                                label="Headshot %" 
                                val1={parseFloat(player1.stats.hsPercentage)} 
                                val2={parseFloat(player2.stats.hsPercentage)} 
                                max={40} 
                                format={(v) => v + '%'}
                            />
                        </div>
                     </div>

                     {/* Strengths & Roles */}
                     <div className="space-y-6">
                        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                            <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white mb-6 flex items-center">
                                <Target className="mr-2 text-slate-500" /> Playstyle Analysis
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-100 dark:border-blue-800/30">
                                    <h4 className="font-bold text-gamepedia-blue text-sm mb-2">{player1.handle}'s Edge</h4>
                                    <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-2">
                                        {player1.role === 'IGL' && <li className="flex items-center"><Crown size={14} className="mr-2 text-amber-500"/> Strong Leadership</li>}
                                        {player1.stats.kd > 2.0 && <li className="flex items-center"><Crosshair size={14} className="mr-2 text-red-500"/> Elite Firepower</li>}
                                        <li className="flex items-center"><Shield size={14} className="mr-2 text-green-500"/> Consistent Survival</li>
                                    </ul>
                                </div>
                                <div className="p-4 bg-orange-50 dark:bg-orange-900/10 rounded-lg border border-orange-100 dark:border-orange-800/30">
                                    <h4 className="font-bold text-gamepedia-orange text-sm mb-2">{player2.handle}'s Edge</h4>
                                    <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-2">
                                         {player2.role === 'Assaulter' && <li className="flex items-center"><Swords size={14} className="mr-2 text-red-500"/> Aggressive Entry</li>}
                                         {parseFloat(player2.stats.hsPercentage) > 20 && <li className="flex items-center"><Target size={14} className="mr-2 text-blue-500"/> Precision Aim</li>}
                                         <li className="flex items-center"><TrendingUp size={14} className="mr-2 text-green-500"/> High Impact Frags</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Recommendation */}
                        <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-xl shadow-lg p-6 border border-slate-700">
                            <h3 className="font-bold text-lg mb-2">Analyst Verdict</h3>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                While <strong className="text-white">{player1.handle}</strong> offers more stability and higher average damage, <strong className="text-white">{player2.handle}</strong> provides explosive entry power. In a fantasy draft, pick <strong>{player1.stats.kd > player2.stats.kd ? player1.handle : player2.handle}</strong> for consistent points.
                            </p>
                        </div>
                     </div>
                 </div>
             )}

             {compareType === 'team' && team1 && team2 && (
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                     <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                        <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white mb-6 flex items-center">
                            <Users className="mr-2 text-slate-500" /> Team Stats (BGIS)
                        </h3>
                        
                        {/* Mock Data for Team Comparison (Simulating Database Fetch) */}
                        <div className="space-y-6">
                            <StatComparisonBar 
                                label="Matches Played" 
                                val1={45} 
                                val2={45} 
                                max={60} 
                            />
                            <StatComparisonBar 
                                label="WWCD Wins" 
                                val1={team1.id === 'soul' ? 8 : 4} 
                                val2={team2.id === 'soul' ? 8 : 5} 
                                max={15} 
                            />
                            <StatComparisonBar 
                                label="Total Finishes" 
                                val1={team1.id === 'soul' ? 290 : 210} 
                                val2={team2.id === 'soul' ? 290 : 310} 
                                max={400} 
                            />
                            <StatComparisonBar 
                                label="Win Rate %" 
                                val1={team1.id === 'soul' ? 17.7 : 9.5} 
                                val2={team2.id === 'soul' ? 17.7 : 11.1} 
                                max={25} 
                                format={(v) => v + '%'}
                            />
                            <StatComparisonBar 
                                label="Total Prize Money (Cr)" 
                                val1={parseFloat(team1.totalWinnings?.replace(/[^0-9.]/g, '') || '0') / 10000000} 
                                val2={parseFloat(team2.totalWinnings?.replace(/[^0-9.]/g, '') || '0') / 10000000} 
                                max={6} 
                                format={(v) => '₹' + v.toFixed(2) + ' Cr'}
                            />
                        </div>
                     </div>

                     <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                        <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white mb-6 flex items-center">
                            <Shield className="mr-2 text-slate-500" /> Roster Strength
                        </h3>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <h4 className="font-bold text-sm text-slate-500 uppercase mb-2 border-b border-slate-100 dark:border-slate-800 pb-1">{team1.name}</h4>
                                <div className="space-y-2">
                                    {team1.roster?.map(p => (
                                        <div key={p.id} className="flex items-center justify-between text-sm bg-slate-50 dark:bg-slate-800 p-2 rounded">
                                            <span className="font-bold text-slate-800 dark:text-slate-200">{p.handle}</span>
                                            <span className="text-xs text-slate-500">{p.role}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h4 className="font-bold text-sm text-slate-500 uppercase mb-2 border-b border-slate-100 dark:border-slate-800 pb-1">{team2.name}</h4>
                                <div className="space-y-2">
                                    {team2.roster?.map(p => (
                                        <div key={p.id} className="flex items-center justify-between text-sm bg-slate-50 dark:bg-slate-800 p-2 rounded">
                                            <span className="font-bold text-slate-800 dark:text-slate-200">{p.handle}</span>
                                            <span className="text-xs text-slate-500">{p.role}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        
                        <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-800/30 rounded-lg">
                            <p className="text-xs text-yellow-800 dark:text-yellow-200 leading-relaxed">
                                <strong>Prediction:</strong> {team1.id === 'soul' ? team1.name : team2.name} has a 60% higher win rate on Erangel, giving them the edge in long-format tournaments.
                            </p>
                        </div>
                     </div>
                 </div>
             )}
        </div>
    );
};
