
import React, { useState } from 'react';
import { Gem, Car, Shield, Search, Filter, Star, Zap } from 'lucide-react';
import { MOCK_COSMETICS } from '../constants';
import { CosmeticItem } from '../types';

export const CosmeticsPage: React.FC = () => {
    const [filterType, setFilterType] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    const types = ['All', 'X-Suit', 'Gun Lab', 'Vehicle'];

    const filteredItems = MOCK_COSMETICS.filter(item => {
        const matchesType = filterType === 'All' || item.type === filterType;
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesType && matchesSearch;
    });

    const getRarityColor = (rarity: string) => {
        switch(rarity) {
            case 'Mythic': return 'from-yellow-600 to-amber-800 border-yellow-500';
            case 'Legendary': return 'from-red-600 to-pink-800 border-red-500';
            case 'Epic': return 'from-purple-600 to-indigo-800 border-purple-500';
            default: return 'from-slate-600 to-slate-800 border-slate-500';
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-12">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-heading font-bold text-slate-900 dark:text-white flex items-center justify-center">
                    <Gem className="mr-3 text-purple-500" /> Cosmetics Wiki
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">
                    Database of X-Suits, Gun Labs, and premium skins with upgrade details.
                </p>
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row justify-center gap-4 mb-8">
                <div className="relative w-full md:w-80">
                    <input 
                        type="text" 
                        placeholder="Search skin..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-white shadow-sm"
                    />
                    <Search size={18} className="absolute left-3 top-3.5 text-slate-400" />
                </div>
                <div className="flex bg-white dark:bg-slate-900 p-1 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm">
                    {types.map(type => (
                        <button
                            key={type}
                            onClick={() => setFilterType(type)}
                            className={`px-6 py-2 rounded-full text-sm font-bold transition-colors ${
                                filterType === type 
                                ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' 
                                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                            }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredItems.map(item => (
                    <div key={item.id} className="group relative rounded-2xl overflow-hidden shadow-lg transition-all hover:scale-[1.02]">
                        {/* Background Gradient based on Rarity */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${getRarityColor(item.rarity)} opacity-90`}></div>
                        
                        {/* Content */}
                        <div className="relative p-1 h-full flex flex-col">
                            <div className="bg-black/20 backdrop-blur-sm p-4 flex justify-between items-start">
                                <span className="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-black/40 text-white border border-white/10">
                                    {item.type}
                                </span>
                                <span className="flex items-center text-xs font-bold text-white">
                                    <Star size={12} className="fill-white text-white mr-1" /> {item.rarity}
                                </span>
                            </div>

                            <div className="flex-1 flex items-center justify-center p-6">
                                <img src={item.image} alt={item.name} className="max-h-48 drop-shadow-2xl group-hover:scale-110 transition-transform duration-500" />
                            </div>

                            <div className="bg-white/10 backdrop-blur-md p-5 border-t border-white/10">
                                <h3 className="text-xl font-bold text-white mb-1">{item.name}</h3>
                                <p className="text-white/60 text-xs mb-4">Released: {item.releaseDate}</p>
                                
                                {item.maxLevel > 1 && (
                                    <div className="space-y-1.5">
                                        <div className="flex justify-between text-xs text-white/80 font-medium">
                                            <span>Upgrade Progression</span>
                                            <span>Max Lv{item.maxLevel}</span>
                                        </div>
                                        <div className="flex gap-1">
                                            {Array.from({ length: item.maxLevel }).map((_, i) => (
                                                <div key={i} className={`h-1.5 flex-1 rounded-full ${i === item.maxLevel - 1 ? 'bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.8)]' : 'bg-white/30'}`}></div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {item.priceEstimates && (
                                    <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                                        <span className="text-xs text-white/60">Est. Cost</span>
                                        <span className="font-mono font-bold text-white flex items-center">
                                            <Zap size={12} className="text-yellow-400 mr-1" /> {item.priceEstimates}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredItems.length === 0 && (
                <div className="text-center py-20 text-slate-500">
                    <Gem size={48} className="mx-auto mb-3 opacity-50" />
                    <p>No cosmetics found matching your search.</p>
                </div>
            )}
        </div>
    );
};
