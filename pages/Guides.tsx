
import React, { useState } from 'react';
import { BookOpen, Clock, ThumbsUp, User, Filter, ArrowRight, ChevronRight, Zap } from 'lucide-react';
import { MOCK_GUIDES } from '../constants';
import { Guide } from '../types';

export const GuidesPage: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState('All');
    const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);

    const categories = ['All', 'Mechanics', 'Macro', 'Mental', 'Utility'];

    const filteredGuides = MOCK_GUIDES.filter(g => activeCategory === 'All' || g.category === activeCategory);

    const featuredGuide = MOCK_GUIDES[1]; // Assume Manya's guide is featured

    const getDifficultyColor = (diff: string) => {
        switch(diff) {
            case 'Beginner': return 'text-green-500 bg-green-50 dark:bg-green-900/20';
            case 'Intermediate': return 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
            case 'Advanced': return 'text-red-500 bg-red-50 dark:bg-red-900/20';
            default: return 'text-slate-500';
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-slate-900 dark:text-white flex items-center">
                        <BookOpen className="mr-3 text-gamepedia-blue" /> Coaching Hub
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Learn from the pros. Tactics, mechanics, and game sense tutorials.
                    </p>
                </div>
                
                <div className="flex bg-white dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-700 overflow-x-auto no-scrollbar">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-4 py-2 rounded-md text-sm font-bold whitespace-nowrap transition-colors ${
                                activeCategory === cat 
                                ? 'bg-slate-100 dark:bg-slate-800 text-gamepedia-blue' 
                                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {selectedGuide ? (
                // Article View
                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden animate-fade-in">
                    <div className="h-64 md:h-80 relative">
                        <img src={selectedGuide.imageUrl} alt={selectedGuide.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                        <div className="absolute bottom-0 left-0 p-8">
                            <button 
                                onClick={() => setSelectedGuide(null)}
                                className="flex items-center text-white/80 hover:text-white mb-4 text-sm font-bold"
                            >
                                <ChevronRight className="rotate-180 mr-1" size={16} /> Back to Guides
                            </button>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold mb-3 inline-block bg-gamepedia-blue text-white`}>
                                {selectedGuide.category}
                            </span>
                            <h2 className="text-3xl md:text-4xl font-heading font-bold text-white max-w-3xl leading-tight mb-4">
                                {selectedGuide.title}
                            </h2>
                            <div className="flex flex-wrap items-center gap-6 text-slate-300 text-sm">
                                <div className="flex items-center">
                                    <User size={16} className="mr-2" />
                                    <span className="font-bold text-white mr-1">{selectedGuide.author}</span>
                                    <span className="px-2 py-0.5 bg-white/10 rounded text-[10px] uppercase tracking-wider">{selectedGuide.role}</span>
                                </div>
                                <div className="flex items-center">
                                    <Clock size={16} className="mr-2" /> {selectedGuide.readTime}
                                </div>
                                <div className="flex items-center">
                                    <ThumbsUp size={16} className="mr-2" /> {selectedGuide.likes}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="p-8 md:p-12 max-w-3xl mx-auto">
                        <div className="prose dark:prose-invert max-w-none">
                            <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-medium mb-8">
                                {selectedGuide.content}
                            </p>
                            <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700 my-8">
                                <h4 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center"><Zap className="mr-2 text-yellow-500"/> Pro Tip</h4>
                                <p className="text-slate-600 dark:text-slate-400 text-sm">Always keep your crosshair at head level, even when looting. Pre-aiming common angles can win you the fight before it starts.</p>
                            </div>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                // List View
                <>
                    {/* Featured Guide */}
                    {activeCategory === 'All' && (
                        <div className="relative rounded-xl overflow-hidden shadow-lg group cursor-pointer border border-slate-200 dark:border-slate-700" onClick={() => setSelectedGuide(featuredGuide)}>
                            <div className="absolute inset-0 bg-slate-900/60 group-hover:bg-slate-900/50 transition-colors z-10"></div>
                            <img src={featuredGuide.imageUrl} className="w-full h-[300px] object-cover transition-transform duration-700 group-hover:scale-105" />
                            <div className="absolute bottom-0 left-0 p-8 z-20 max-w-2xl">
                                <span className="text-xs font-bold text-yellow-400 uppercase tracking-wider mb-2 block">Featured Masterclass</span>
                                <h2 className="text-3xl font-bold text-white mb-3 group-hover:text-blue-200 transition-colors">{featuredGuide.title}</h2>
                                <div className="flex items-center gap-4">
                                    <img src="https://picsum.photos/100/100?random=101" className="w-10 h-10 rounded-full border-2 border-white" />
                                    <div>
                                        <p className="text-white font-bold text-sm">{featuredGuide.author}</p>
                                        <p className="text-slate-300 text-xs">{featuredGuide.role}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredGuides.map(guide => (
                            <div 
                                key={guide.id} 
                                onClick={() => setSelectedGuide(guide)}
                                className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-md hover:border-gamepedia-blue dark:hover:border-gamepedia-blue transition-all cursor-pointer flex flex-col group"
                            >
                                <div className="h-48 overflow-hidden relative">
                                    <img src={guide.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    <div className="absolute top-3 left-3">
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${getDifficultyColor(guide.difficulty)}`}>
                                            {guide.difficulty}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-5 flex flex-col flex-1">
                                    <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                                        <span className="font-bold uppercase text-gamepedia-blue">{guide.category}</span>
                                        <span className="flex items-center"><Clock size={12} className="mr-1"/> {guide.readTime}</span>
                                    </div>
                                    <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-2 line-clamp-2 leading-snug group-hover:text-gamepedia-blue transition-colors">
                                        {guide.title}
                                    </h3>
                                    <div className="mt-auto pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                                        <div className="flex items-center text-xs text-slate-600 dark:text-slate-400">
                                            <span className="font-bold mr-1">{guide.author}</span>
                                            <span className="opacity-70">({guide.role})</span>
                                        </div>
                                        <div className="flex items-center text-xs font-bold text-slate-400 group-hover:text-gamepedia-blue">
                                            Read <ArrowRight size={12} className="ml-1" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};
