
import React, { useState, useRef } from 'react';
import { Trophy, Shuffle, Download, RefreshCw, Users, Share2 } from 'lucide-react';

interface BracketMatch {
    id: number;
    round: number;
    team1: string;
    team2: string;
    winner?: string;
}

export const BracketGeneratorPage: React.FC = () => {
    const [teamCount, setTeamCount] = useState<4 | 8 | 16>(8);
    const [teams, setTeams] = useState<string[]>(Array(16).fill('').map((_, i) => `Team ${i + 1}`));
    const [title, setTitle] = useState('BGIS Scrims #42');
    const canvasRef = useRef<HTMLDivElement>(null);

    // Helper to handle team name changes
    const handleTeamChange = (index: number, value: string) => {
        const newTeams = [...teams];
        newTeams[index] = value;
        setTeams(newTeams);
    };

    const shuffleTeams = () => {
        const shuffled = [...teams].sort(() => Math.random() - 0.5);
        setTeams(shuffled);
    };

    const clearTeams = () => {
        setTeams(Array(16).fill('TBD'));
    };

    const downloadBracket = () => {
        // In a real app, use html2canvas or similar
        alert("Feature: This would download the bracket view as a PNG image.");
    };

    // Render logic for visual bracket
    const renderBracket = () => {
        const rounds = Math.log2(teamCount);
        const activeTeams = teams.slice(0, teamCount);
        
        return (
            <div className="flex justify-between items-center h-full w-full overflow-x-auto p-8 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700">
                {/* Round 1 */}
                <div className="flex flex-col justify-around h-full gap-4 w-40 shrink-0">
                    {Array.from({ length: teamCount / 2 }).map((_, i) => (
                        <div key={`r1-${i}`} className="flex flex-col border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 overflow-hidden shadow-sm relative group">
                            <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 truncate">
                                {activeTeams[i * 2] || 'TBD'}
                            </div>
                            <div className="px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 truncate">
                                {activeTeams[i * 2 + 1] || 'TBD'}
                            </div>
                            {/* Connector Line */}
                            <div className="absolute top-1/2 -right-4 w-4 h-[1px] bg-slate-400 dark:bg-slate-600"></div>
                        </div>
                    ))}
                </div>

                {/* Round 2 (Semis/Quarters) */}
                {rounds >= 2 && (
                    <div className="flex flex-col justify-around h-full gap-8 w-40 shrink-0">
                        {Array.from({ length: teamCount / 4 }).map((_, i) => (
                            <div key={`r2-${i}`} className="flex flex-col border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 overflow-hidden shadow-sm relative h-16 justify-center">
                                <div className="px-3 text-xs font-bold text-slate-400 text-center">Winner Match {i*2+1}</div>
                                <div className="w-full h-[1px] bg-slate-200 dark:bg-slate-700 my-1"></div>
                                <div className="px-3 text-xs font-bold text-slate-400 text-center">Winner Match {i*2+2}</div>
                                
                                {/* Connectors */}
                                <div className="absolute top-1/2 -left-4 w-4 h-[1px] bg-slate-400 dark:bg-slate-600"></div>
                                <div className="absolute top-1/2 -right-4 w-4 h-[1px] bg-slate-400 dark:bg-slate-600"></div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Round 3 (Finals/Semis) */}
                {rounds >= 3 && (
                    <div className="flex flex-col justify-around h-full gap-16 w-40 shrink-0">
                        {Array.from({ length: teamCount / 8 }).map((_, i) => (
                            <div key={`r3-${i}`} className="flex flex-col border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 overflow-hidden shadow-sm relative h-16 justify-center">
                                <div className="px-3 text-xs font-bold text-slate-400 text-center">Winner QF {i*2+1}</div>
                                <div className="w-full h-[1px] bg-slate-200 dark:bg-slate-700 my-1"></div>
                                <div className="px-3 text-xs font-bold text-slate-400 text-center">Winner QF {i*2+2}</div>
                                
                                {/* Connectors */}
                                <div className="absolute top-1/2 -left-4 w-4 h-[1px] bg-slate-400 dark:bg-slate-600"></div>
                                {rounds > 3 && <div className="absolute top-1/2 -right-4 w-4 h-[1px] bg-slate-400 dark:bg-slate-600"></div>}
                            </div>
                        ))}
                    </div>
                )}

                {/* Round 4 (Grand Final if 16 teams) */}
                {rounds >= 4 && (
                    <div className="flex flex-col justify-center h-full w-48 shrink-0">
                        <div className="flex flex-col items-center border-2 border-gamepedia-blue rounded-lg bg-white dark:bg-slate-800 overflow-hidden shadow-lg relative p-4">
                            <Trophy size={24} className="text-yellow-500 mb-2" />
                            <div className="text-sm font-bold text-slate-900 dark:text-white text-center">CHAMPION</div>
                            <div className="text-xs text-slate-500 text-center mt-1">TBD</div>
                            
                            {/* Connector */}
                            <div className="absolute top-1/2 -left-4 w-4 h-[1px] bg-slate-400 dark:bg-slate-600"></div>
                        </div>
                    </div>
                )}
                
                {/* Champion Slot for smaller brackets */}
                {rounds < 4 && (
                     <div className="flex flex-col justify-center h-full w-40 shrink-0">
                        <div className="flex flex-col items-center border-2 border-gamepedia-blue rounded-lg bg-white dark:bg-slate-800 overflow-hidden shadow-lg relative p-3">
                            <Trophy size={20} className="text-yellow-500 mb-2" />
                            <div className="text-xs font-bold text-slate-900 dark:text-white text-center">CHAMPION</div>
                            
                            {/* Connector */}
                            <div className="absolute top-1/2 -left-4 w-4 h-[1px] bg-slate-400 dark:bg-slate-600"></div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-12">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-heading font-bold text-slate-900 dark:text-white flex items-center justify-center">
                    <Share2 className="mr-3 text-gamepedia-blue" /> Bracket Generator
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">
                    Create visuals for your community tournaments. Supports up to 16 teams.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar Config */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                        <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center">
                            <Users size={18} className="mr-2 text-gamepedia-blue"/> Configuration
                        </h3>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Tournament Title</label>
                                <input 
                                    type="text" 
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Bracket Size</label>
                                <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                                    {[4, 8, 16].map(size => (
                                        <button
                                            key={size}
                                            onClick={() => setTeamCount(size as any)}
                                            className={`flex-1 py-1.5 text-xs font-bold rounded transition-colors ${teamCount === size ? 'bg-white dark:bg-slate-700 text-gamepedia-blue shadow' : 'text-slate-500 dark:text-slate-400'}`}
                                        >
                                            {size} Teams
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Teams List</label>
                                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                    {Array.from({ length: teamCount }).map((_, i) => (
                                        <div key={i} className="flex items-center gap-2">
                                            <span className="text-[10px] font-mono text-slate-400 w-4 text-right">{i+1}</span>
                                            <input 
                                                type="text"
                                                value={teams[i]}
                                                onChange={(e) => handleTeamChange(i, e.target.value)}
                                                className="flex-1 px-2 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-xs dark:text-white focus:border-gamepedia-blue outline-none"
                                                placeholder={`Team ${i+1}`}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <button onClick={shuffleTeams} className="py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center">
                                    <Shuffle size={14} className="mr-1" /> Shuffle
                                </button>
                                <button onClick={clearTeams} className="py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center">
                                    <RefreshCw size={14} className="mr-1" /> Clear
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Preview Area */}
                <div className="lg:col-span-3 flex flex-col">
                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 flex-1 flex flex-col min-h-[600px]" ref={canvasRef}>
                        <div className="text-center mb-6">
                            <h2 className="text-2xl font-heading font-bold text-slate-900 dark:text-white uppercase tracking-wide">{title}</h2>
                            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">Powered by Gamepedia</p>
                        </div>
                        
                        {renderBracket()}
                    </div>

                    <div className="mt-6 flex justify-end">
                        <button 
                            onClick={downloadBracket}
                            className="px-8 py-3 bg-gamepedia-blue text-white font-bold rounded-xl shadow-lg hover:bg-blue-600 transition-colors flex items-center"
                        >
                            <Download size={20} className="mr-2" /> Download Image
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
