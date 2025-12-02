
import React, { useState } from 'react';
import { Bomb, Map, Eye, Crosshair, Flame, Cloud, Zap } from 'lucide-react';
import { MOCK_NADE_LINEUPS } from '../constants';
import { NadeLineup } from '../types';

export const NadeLineupsPage: React.FC = () => {
    const [selectedMap, setSelectedMap] = useState('All');
    const [selectedType, setSelectedType] = useState('All');
    const [activeLineup, setActiveLineup] = useState<NadeLineup | null>(null);

    const filteredLineups = MOCK_NADE_LINEUPS.filter(nade => {
        const mapMatch = selectedMap === 'All' || nade.map === selectedMap;
        const typeMatch = selectedType === 'All' || nade.type === selectedType;
        return mapMatch && typeMatch;
    });

    const getTypeIcon = (type: string) => {
        switch(type) {
            case 'Frag': return <Bomb size={16} className="text-red-500" />;
            case 'Molotov': return <Flame size={16} className="text-orange-500" />;
            case 'Smoke': return <Cloud size={16} className="text-gray-500" />;
            default: return <Zap size={16} className="text-yellow-500" />;
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-12">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-heading font-bold text-slate-900 dark:text-white flex items-center justify-center">
                    <Crosshair className="mr-3 text-gamepedia-blue" /> Nade Lineups
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">
                    Master the utility meta. Learn pixel-perfect throws for every map.
                </p>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row justify-center gap-4 mb-8">
                <div className="flex bg-white dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
                    {['All', 'Erangel', 'Miramar', 'Sanhok'].map(map => (
                        <button
                            key={map}
                            onClick={() => setSelectedMap(map)}
                            className={`px-4 py-2 rounded-md text-sm font-bold transition-colors ${
                                selectedMap === map 
                                ? 'bg-slate-100 dark:bg-slate-800 text-gamepedia-blue' 
                                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                            }`}
                        >
                            {map}
                        </button>
                    ))}
                </div>
                <div className="flex bg-white dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
                    {['All', 'Frag', 'Molotov', 'Smoke'].map(type => (
                        <button
                            key={type}
                            onClick={() => setSelectedType(type)}
                            className={`px-4 py-2 rounded-md text-sm font-bold transition-colors ${
                                selectedType === type 
                                ? 'bg-slate-100 dark:bg-slate-800 text-gamepedia-blue' 
                                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                            }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredLineups.map(nade => (
                    <div 
                        key={nade.id} 
                        className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700 cursor-pointer hover:border-gamepedia-blue transition-all group"
                        onClick={() => setActiveLineup(nade)}
                    >
                        <div className="relative h-48">
                            <img src={nade.aimImage} className="w-full h-full object-cover" alt={nade.title} />
                            <div className="absolute top-2 right-2 bg-black/60 text-white text-xs font-bold px-2 py-1 rounded backdrop-blur-sm flex items-center gap-1">
                                {getTypeIcon(nade.type)} {nade.type}
                            </div>
                            <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs font-bold px-2 py-1 rounded backdrop-blur-sm">
                                {nade.location}
                            </div>
                        </div>
                        <div className="p-4">
                            <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-gamepedia-blue transition-colors">{nade.title}</h3>
                            <div className="flex justify-between items-center mt-2 text-xs text-slate-500">
                                <span>{nade.map}</span>
                                <span className={`font-bold ${
                                    nade.difficulty === 'Easy' ? 'text-green-500' : 
                                    nade.difficulty === 'Medium' ? 'text-yellow-500' : 'text-red-500'
                                }`}>
                                    {nade.difficulty}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {activeLineup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setActiveLineup(null)}>
                    <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl border border-slate-700" onClick={e => e.stopPropagation()}>
                        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-heading font-bold text-slate-900 dark:text-white">{activeLineup.title}</h2>
                                <p className="text-sm text-slate-500">{activeLineup.map} • {activeLineup.location} • {activeLineup.type}</p>
                            </div>
                            <button onClick={() => setActiveLineup(null)} className="text-slate-400 hover:text-white">Close</button>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <span className="block text-xs font-bold text-slate-500 uppercase mb-2">Step 1: Position</span>
                                <img src={activeLineup.standImage} className="w-full rounded-lg border border-slate-200 dark:border-slate-700" alt="Stand Position" />
                            </div>
                            <div>
                                <span className="block text-xs font-bold text-slate-500 uppercase mb-2">Step 2: Aim Point</span>
                                <img src={activeLineup.aimImage} className="w-full rounded-lg border border-slate-200 dark:border-slate-700" alt="Aim Point" />
                            </div>
                        </div>
                        <div className="p-6 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
                            <h4 className="font-bold text-slate-900 dark:text-white mb-2">Instructions</h4>
                            <p className="text-slate-600 dark:text-slate-300">{activeLineup.description}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
