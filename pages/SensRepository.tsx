
import React, { useState } from 'react';
import { Search, Smartphone, Copy, Check, ThumbsUp, Filter, Share2, Plus } from 'lucide-react';
import { MOCK_SENS_CODES } from '../constants';
import { SensCode } from '../types';

export const SensRepositoryPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('All');
    const [layoutFilter, setLayoutFilter] = useState('All');
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const filteredCodes = MOCK_SENS_CODES.filter(code => {
        const matchesSearch = code.player.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              code.device.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = typeFilter === 'All' || code.type === typeFilter;
        const matchesLayout = layoutFilter === 'All' || code.layout === layoutFilter;
        
        return matchesSearch && matchesType && matchesLayout;
    });

    const handleCopy = (id: string, code: string) => {
        navigator.clipboard.writeText(code);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-12">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-heading font-bold text-slate-900 dark:text-white flex items-center justify-center">
                    <Smartphone className="mr-3 text-gamepedia-blue" /> Sensitivity Repository
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">
                    Find, share, and copy control layouts from pro players and the community.
                </p>
            </div>

            <div className="flex flex-col md:flex-row justify-between gap-4 items-center bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                <div className="relative w-full md:w-72">
                    <input 
                        type="text" 
                        placeholder="Search player or device..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gamepedia-blue dark:text-white"
                    />
                    <Search size={18} className="absolute left-3 top-3 text-slate-400" />
                </div>

                <div className="flex gap-2 overflow-x-auto no-scrollbar w-full md:w-auto">
                    <select 
                        value={typeFilter} 
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-gamepedia-blue"
                    >
                        <option value="All">All Types</option>
                        <option value="Gyro">Gyro</option>
                        <option value="Non-Gyro">Non-Gyro</option>
                    </select>
                    <select 
                        value={layoutFilter} 
                        onChange={(e) => setLayoutFilter(e.target.value)}
                        className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-gamepedia-blue"
                    >
                        <option value="All">All Layouts</option>
                        <option value="2 Finger">2 Finger</option>
                        <option value="3 Finger">3 Finger</option>
                        <option value="4 Finger">4 Finger</option>
                        <option value="5 Finger">5 Finger</option>
                    </select>
                </div>

                <button className="px-4 py-2.5 bg-gamepedia-blue text-white font-bold rounded-lg hover:bg-blue-600 transition-colors flex items-center whitespace-nowrap shadow-md">
                    <Plus size={18} className="mr-2" /> Submit Code
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCodes.map(item => (
                    <div key={item.id} className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 hover:border-gamepedia-blue transition-colors group">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-bold text-lg text-slate-900 dark:text-white">{item.player}</h3>
                                <span className="text-xs text-slate-500">{item.lastUpdated}</span>
                            </div>
                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${item.type === 'Gyro' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'}`}>
                                {item.type}
                            </span>
                        </div>

                        <div className="flex items-center gap-3 mb-6">
                            <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-xs font-medium text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                                {item.layout}
                            </span>
                            <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-xs font-medium text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                                {item.device}
                            </span>
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-950 rounded-lg p-3 border border-slate-200 dark:border-slate-800 flex items-center justify-between mb-4 group-hover:border-blue-200 dark:group-hover:border-blue-900/50 transition-colors">
                            <code className="font-mono font-bold text-gamepedia-blue text-sm tracking-wide truncate mr-2">
                                {item.code}
                            </code>
                            <button 
                                onClick={() => handleCopy(item.id, item.code)}
                                className="p-2 bg-white dark:bg-slate-800 rounded-md shadow-sm text-slate-500 hover:text-gamepedia-blue transition-colors"
                                title="Copy Code"
                            >
                                {copiedId === item.id ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                            </button>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                            <div className="flex items-center text-slate-500 text-sm">
                                <ThumbsUp size={16} className="mr-1.5" /> {item.likes.toLocaleString()}
                            </div>
                            <button className="text-xs font-bold text-slate-400 hover:text-gamepedia-blue flex items-center transition-colors">
                                <Share2 size={14} className="mr-1" /> Share
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {filteredCodes.length === 0 && (
                <div className="text-center py-20 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
                    <Smartphone size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">No codes found</h3>
                    <p className="text-slate-500">Try adjusting your search filters.</p>
                </div>
            )}
        </div>
    );
};
