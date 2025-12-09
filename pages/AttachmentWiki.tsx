
import React, { useState } from 'react';
import { Search, Zap, Crosshair, Anchor, Filter } from 'lucide-react';
import { MOCK_ATTACHMENTS } from '../constants';
import { Attachment } from '../types';

export const AttachmentWikiPage: React.FC = () => {
    const [filterType, setFilterType] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredAttachments = MOCK_ATTACHMENTS.filter(a => {
        const matchesType = filterType === 'All' || a.type === filterType;
        const matchesSearch = a.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesType && matchesSearch;
    });

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-12">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-heading font-bold text-slate-900 dark:text-white flex items-center justify-center">
                    <Anchor className="mr-3 text-gamepedia-blue" /> Attachment Wiki
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">
                    Compare grips, muzzles, and magazines to build the perfect loadout.
                </p>
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row justify-center gap-4 mb-8">
                <div className="relative w-full md:w-72">
                    <input 
                        type="text" 
                        placeholder="Search attachment..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gamepedia-blue dark:text-white"
                    />
                    <Search size={18} className="absolute left-3 top-3 text-slate-400" />
                </div>
                
                <div className="flex gap-2 overflow-x-auto no-scrollbar w-full md:w-auto p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg">
                    {['All', 'Muzzle', 'Grip', 'Magazine'].map(type => (
                        <button
                            key={type}
                            onClick={() => setFilterType(type)}
                            className={`px-4 py-1.5 rounded-md text-sm font-bold whitespace-nowrap transition-colors ${
                                filterType === type 
                                ? 'bg-slate-100 dark:bg-slate-800 text-gamepedia-blue shadow-sm' 
                                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                            }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAttachments.map(item => (
                    <div key={item.id} className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 flex flex-col hover:border-gamepedia-blue transition-colors group">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="font-bold text-lg text-slate-900 dark:text-white">{item.name}</h3>
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-1 rounded">
                                {item.type}
                            </span>
                        </div>

                        <div className="flex-1 flex items-center justify-center py-6 bg-slate-50 dark:bg-slate-800/50 rounded-lg mb-4">
                            <img 
                                src={item.image} 
                                alt={item.name} 
                                className="max-h-24 object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-300" 
                            />
                        </div>

                        <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 line-clamp-2 h-10">
                            {item.description}
                        </p>

                        <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-4">
                            {item.stats.recoilVert !== undefined && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Vertical Recoil</span>
                                    <span className={`font-bold ${item.stats.recoilVert < 0 ? 'text-green-500' : 'text-slate-700'}`}>
                                        {item.stats.recoilVert > 0 ? '+' : ''}{item.stats.recoilVert}%
                                    </span>
                                </div>
                            )}
                            {item.stats.recoilHoriz !== undefined && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Horizontal Recoil</span>
                                    <span className={`font-bold ${item.stats.recoilHoriz < 0 ? 'text-green-500' : 'text-slate-700'}`}>
                                        {item.stats.recoilHoriz > 0 ? '+' : ''}{item.stats.recoilHoriz}%
                                    </span>
                                </div>
                            )}
                            {item.stats.adsSpeed !== undefined && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">ADS Speed</span>
                                    <span className={`font-bold ${item.stats.adsSpeed > 0 ? 'text-blue-500' : 'text-slate-700'}`}>
                                        +{item.stats.adsSpeed}%
                                    </span>
                                </div>
                            )}
                            {item.stats.capacity !== undefined && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Capacity</span>
                                    <span className="font-bold text-blue-500">+{item.stats.capacity}</span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
