
import React, { useState } from 'react';
import { Play, Clock, Eye, Filter, Search, Tag } from 'lucide-react';
import { MOCK_VODS } from '../constants';
import { VOD } from '../types';

export const VodsPage: React.FC = () => {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [playingVideo, setPlayingVideo] = useState<VOD | null>(null);

    const categories = ['All', 'Highlight', 'Clutch', 'Full Match', 'Funny', 'Interview'];

    const filteredVods = MOCK_VODS.filter(vod => {
        const categoryMatch = selectedCategory === 'All' || vod.tags.includes(selectedCategory as any);
        const searchMatch = vod.title.toLowerCase().includes(searchTerm.toLowerCase());
        return categoryMatch && searchMatch;
    });

    const featuredVod = MOCK_VODS.find(v => v.featured) || MOCK_VODS[0];

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-12">
            {/* Hero Section */}
            <div className="relative h-[400px] rounded-2xl overflow-hidden group cursor-pointer shadow-2xl" onClick={() => setPlayingVideo(featuredVod)}>
                <img src={featuredVod.thumbnailUrl} alt={featuredVod.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-20 h-20 bg-gamepedia-blue/90 rounded-full flex items-center justify-center text-white shadow-lg backdrop-blur-sm transform scale-90 group-hover:scale-100 transition-transform">
                        <Play size={32} className="ml-1" />
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 p-8 w-full">
                    <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded shadow-sm mb-3 inline-block">FEATURED</span>
                    <h1 className="text-3xl md:text-4xl font-heading font-bold text-white mb-3 max-w-2xl leading-tight">{featuredVod.title}</h1>
                    <div className="flex items-center text-slate-300 text-sm font-medium gap-4">
                        <span className="flex items-center"><Clock size={16} className="mr-1.5"/> {featuredVod.duration}</span>
                        <span className="flex items-center"><Eye size={16} className="mr-1.5"/> {featuredVod.views} views</span>
                        <span>•</span>
                        <span>{featuredVod.uploadDate}</span>
                    </div>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex overflow-x-auto pb-2 md:pb-0 gap-2 w-full md:w-auto no-scrollbar">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${
                                selectedCategory === cat 
                                ? 'bg-gamepedia-blue text-white' 
                                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
                <div className="relative w-full md:w-64">
                    <input 
                        type="text" 
                        placeholder="Search videos..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-gamepedia-blue dark:text-white"
                    />
                    <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
                </div>
            </div>

            {/* Video Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVods.map(vod => (
                    <div key={vod.id} className="group bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-md transition-all" onClick={() => setPlayingVideo(vod)}>
                        <div className="relative aspect-video bg-slate-900 overflow-hidden cursor-pointer">
                            <img src={vod.thumbnailUrl} alt={vod.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-bold px-1.5 py-0.5 rounded">
                                {vod.duration}
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                                <Play size={48} className="text-white drop-shadow-lg" />
                            </div>
                        </div>
                        <div className="p-4">
                            <div className="flex gap-2 mb-2">
                                {vod.tags.map(tag => (
                                    <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded font-bold uppercase">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            <h3 className="font-bold text-slate-900 dark:text-white line-clamp-2 mb-2 group-hover:text-gamepedia-blue transition-colors">
                                {vod.title}
                            </h3>
                            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                                <span>{vod.views} views</span>
                                <span>{vod.uploadDate}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Video Player Modal (Simulation) */}
            {playingVideo && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fade-in" onClick={() => setPlayingVideo(null)}>
                    <div className="w-full max-w-5xl bg-black rounded-2xl overflow-hidden shadow-2xl relative" onClick={e => e.stopPropagation()}>
                        <div className="aspect-video bg-slate-900 flex items-center justify-center relative group">
                            {/* Mock Player Interface */}
                            <img src={playingVideo.thumbnailUrl} className="w-full h-full object-cover opacity-50" />
                            <button className="absolute p-6 bg-white/20 hover:bg-white/30 backdrop-blur rounded-full text-white transition-all transform hover:scale-110">
                                <Play size={48} fill="white" />
                            </button>
                            <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-800">
                                <div className="h-full w-1/3 bg-red-600 relative">
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-red-600 rounded-full shadow"></div>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 bg-slate-900 border-t border-slate-800">
                            <h2 className="text-xl font-bold text-white mb-2">{playingVideo.title}</h2>
                            <p className="text-slate-400 text-sm">Simulation: In a real app, this would embed a YouTube or Twitch player.</p>
                        </div>
                        <button 
                            onClick={() => setPlayingVideo(null)}
                            className="absolute top-4 right-4 text-white/70 hover:text-white p-2 bg-black/50 rounded-full"
                        >
                            <XIcon size={24} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const XIcon = ({ size }: { size: number }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);
