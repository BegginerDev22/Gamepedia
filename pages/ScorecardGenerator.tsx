
import React, { useState, useRef } from 'react';
import { Download, Image as ImageIcon, Check, Share2, Award } from 'lucide-react';

export const ScorecardGeneratorPage: React.FC = () => {
    const [teamName, setTeamName] = useState('Team Soul');
    const [matchNo, setMatchNo] = useState('1');
    const [mapName, setMapName] = useState('Erangel');
    const [placement, setPlacement] = useState(1);
    const [kills, setKills] = useState(12);
    const [mvp, setMvp] = useState('Manya');
    const [theme, setTheme] = useState<'Gold' | 'Silver' | 'Dark'>('Gold');
    const [isGenerating, setIsGenerating] = useState(false);

    const canvasRef = useRef<HTMLDivElement>(null);

    const totalPoints = placement === 1 ? kills + 10 : placement === 2 ? kills + 6 : placement === 3 ? kills + 5 : kills;

    const downloadImage = () => {
        // Mock download functionality
        setIsGenerating(true);
        setTimeout(() => {
            alert("Image generated and downloaded! (Simulation)");
            setIsGenerating(false);
        }, 1500);
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-12">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-heading font-bold text-slate-900 dark:text-white flex items-center justify-center">
                    <Award className="mr-3 text-yellow-500" /> Match Scorecard Generator
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">
                    Create instant match result graphics for social media.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Inputs */}
                <div className="lg:col-span-1 bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Team Name</label>
                        <input type="text" value={teamName} onChange={e => setTeamName(e.target.value)} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg dark:text-white outline-none focus:border-gamepedia-blue" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Match #</label>
                            <input type="text" value={matchNo} onChange={e => setMatchNo(e.target.value)} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg dark:text-white outline-none focus:border-gamepedia-blue" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Map</label>
                            <select value={mapName} onChange={e => setMapName(e.target.value)} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg dark:text-white outline-none focus:border-gamepedia-blue">
                                <option>Erangel</option>
                                <option>Miramar</option>
                                <option>Sanhok</option>
                                <option>Vikendi</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Placement</label>
                            <input type="number" value={placement} onChange={e => setPlacement(parseInt(e.target.value))} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg dark:text-white outline-none focus:border-gamepedia-blue" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Team Kills</label>
                            <input type="number" value={kills} onChange={e => setKills(parseInt(e.target.value))} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg dark:text-white outline-none focus:border-gamepedia-blue" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">MVP Name</label>
                        <input type="text" value={mvp} onChange={e => setMvp(e.target.value)} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg dark:text-white outline-none focus:border-gamepedia-blue" />
                    </div>
                    
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Theme</label>
                        <div className="flex gap-2">
                            {['Gold', 'Silver', 'Dark'].map(t => (
                                <button
                                    key={t}
                                    onClick={() => setTheme(t as any)}
                                    className={`flex-1 py-2 rounded text-xs font-bold border ${theme === t ? 'bg-slate-800 text-white border-slate-900' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'}`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Preview */}
                <div className="lg:col-span-2 flex flex-col items-center">
                    <div ref={canvasRef} className="relative w-full aspect-[4/5] max-w-md bg-black rounded-lg overflow-hidden shadow-2xl text-white">
                        {/* Background Image */}
                        <img 
                            src={
                                mapName === 'Erangel' ? 'https://raw.githubusercontent.com/pubg/api-assets/master/Assets/Maps/Erangel_Main_Low_Res.png' :
                                mapName === 'Miramar' ? 'https://raw.githubusercontent.com/pubg/api-assets/master/Assets/Maps/Miramar_Main_Low_Res.png' :
                                'https://raw.githubusercontent.com/pubg/api-assets/master/Assets/Maps/Sanhok_Main_Low_Res.png'
                            } 
                            className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale"
                        />
                        <div className={`absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/80 ${theme === 'Gold' ? 'mix-blend-overlay opacity-30 bg-yellow-900' : ''}`}></div>

                        {/* Content */}
                        <div className="relative z-10 h-full flex flex-col p-8">
                            <div className="flex justify-between items-start">
                                <div className="bg-white/10 backdrop-blur px-3 py-1 rounded text-xs font-bold uppercase tracking-widest border border-white/20">
                                    Match #{matchNo} • {mapName}
                                </div>
                                <div className="text-xl font-black italic tracking-tighter">BGIS 2024</div>
                            </div>

                            <div className="mt-auto mb-12">
                                <h2 className={`text-5xl font-black uppercase leading-none mb-2 ${theme === 'Gold' ? 'text-yellow-400' : 'text-white'}`}>
                                    {placement === 1 ? 'WINNER WINNER' : 'MATCH RESULT'}
                                </h2>
                                {placement === 1 && <h2 className="text-4xl font-black uppercase text-white leading-none mb-6">CHICKEN DINNER</h2>}
                                
                                <div className="text-6xl font-black text-white mb-8 tracking-wide drop-shadow-lg">
                                    {teamName.toUpperCase()}
                                </div>

                                <div className="grid grid-cols-3 gap-4 border-t-2 border-white/20 pt-6">
                                    <div>
                                        <span className="block text-xs font-bold text-white/60 uppercase">Rank</span>
                                        <span className="block text-4xl font-mono font-bold text-white">#{placement}</span>
                                    </div>
                                    <div>
                                        <span className="block text-xs font-bold text-white/60 uppercase">Kills</span>
                                        <span className="block text-4xl font-mono font-bold text-white">{kills}</span>
                                    </div>
                                    <div>
                                        <span className="block text-xs font-bold text-white/60 uppercase">Total Pts</span>
                                        <span className={`block text-4xl font-mono font-bold ${theme === 'Gold' ? 'text-yellow-400' : 'text-white'}`}>{totalPoints}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between items-end border-t border-white/10 pt-4">
                                <div>
                                    <span className="block text-[10px] font-bold text-white/50 uppercase">MVP of the Match</span>
                                    <span className="block text-xl font-bold text-white">{mvp}</span>
                                </div>
                                <div className="text-[10px] text-white/40 font-mono">GENERATED BY GAMEPEDIA</div>
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={downloadImage}
                        disabled={isGenerating}
                        className="mt-6 px-8 py-3 bg-gamepedia-blue text-white font-bold rounded-lg shadow-lg hover:bg-blue-600 transition-colors flex items-center"
                    >
                        {isGenerating ? 'Generating...' : <><Download size={18} className="mr-2" /> Download Image</>}
                    </button>
                </div>
            </div>
        </div>
    );
};
