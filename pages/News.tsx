import React, { useState } from 'react';
import { Newspaper, Zap, ChevronRight, Calendar, Clock, ArrowUpRight, Filter } from 'lucide-react';
import { RECENT_TRANSFERS, MOCK_TOURNAMENTS } from '../constants';
import { generateNewsContent } from '../services/geminiService';
import { NewsArticle } from '../types';

const INITIAL_NEWS: NewsArticle[] = [
    {
        id: 'n1',
        title: 'Spower Joins Team Soul: A New Era?',
        summary: 'The young prodigy has finally made the move to the fan-favorite organization. What does this mean for the upcoming BGIS?',
        category: 'Transfer',
        timestamp: '2 hours ago',
        imageUrl: 'https://picsum.photos/800/400?random=100'
    },
    {
        id: 'n2',
        title: 'BGIS 2024 The Grind: Day 3 Highlights',
        summary: 'GodLike Esports dominates Erangel while Team XSpark struggles to find momentum in the early stages.',
        category: 'Tournament',
        timestamp: '5 hours ago',
        imageUrl: 'https://picsum.photos/800/400?random=101'
    },
    {
        id: 'n3',
        title: 'Meta Shift: DBS Shotgun Nerf Incoming?',
        summary: 'Krafton hints at weapon balancing updates in the next patch. Close-range fights might change forever.',
        category: 'Match',
        timestamp: '1 day ago',
        imageUrl: 'https://picsum.photos/800/400?random=102'
    }
];

export const NewsPage: React.FC = () => {
    const [articles, setArticles] = useState<NewsArticle[]>(INITIAL_NEWS);
    const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
    const [loadingContent, setLoadingContent] = useState(false);
    const [filterCategory, setFilterCategory] = useState('All');

    const categories = ['All', 'Transfer', 'Tournament', 'Match', 'Interview'];

    const filteredArticles = articles.filter(a => filterCategory === 'All' || a.category === filterCategory);

    const handleReadMore = async (article: NewsArticle) => {
        setSelectedArticle(article);
        if (!article.generatedContent) {
            setLoadingContent(true);
            const content = await generateNewsContent(article.title, article.category);
            
            setArticles(prev => prev.map(a => 
                a.id === article.id ? { ...a, generatedContent: content } : a
            ));
            
            // Update the selected article reference as well to show content immediately
            setSelectedArticle(prev => prev ? { ...prev, generatedContent: content } : null);
            setLoadingContent(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in relative">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                 <div>
                    <h1 className="text-3xl font-heading font-bold text-slate-900 dark:text-white flex items-center">
                        <Newspaper className="mr-3 text-gamepedia-blue" /> Esports News
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">Latest updates, transfer news, and AI-generated insights.</p>
                 </div>
                 <div className="flex items-center space-x-4">
                     <div className="flex overflow-x-auto no-scrollbar bg-white dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setFilterCategory(cat)}
                                className={`px-3 py-1.5 text-xs font-bold rounded whitespace-nowrap transition-colors ${
                                    filterCategory === cat 
                                    ? 'bg-slate-100 dark:bg-slate-800 text-gamepedia-blue' 
                                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                     </div>
                     <div className="hidden md:flex bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-full border border-blue-100 dark:border-blue-800/30 items-center">
                         <Zap size={16} className="text-gamepedia-orange mr-2" />
                         <span className="text-xs font-bold text-gamepedia-blue uppercase tracking-wide">AI Powered Feed</span>
                     </div>
                 </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Featured Article (First item from filtered) */}
                {filteredArticles.length > 0 ? (
                    <>
                        <div className="lg:col-span-2 relative group cursor-pointer rounded-2xl overflow-hidden h-[400px] shadow-lg" onClick={() => handleReadMore(filteredArticles[0])}>
                            <img src={filteredArticles[0].imageUrl} alt={filteredArticles[0].title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>
                            <div className="absolute bottom-0 left-0 p-8">
                                <span className="bg-gamepedia-blue text-white text-xs font-bold px-3 py-1 rounded-full mb-3 inline-block">
                                    {filteredArticles[0].category}
                                </span>
                                <h2 className="text-3xl font-heading font-bold text-white mb-3 leading-tight group-hover:text-blue-200 transition-colors">
                                    {filteredArticles[0].title}
                                </h2>
                                <p className="text-slate-200 line-clamp-2 max-w-xl">{filteredArticles[0].summary}</p>
                                <div className="flex items-center mt-4 text-slate-300 text-sm font-medium">
                                    <Clock size={16} className="mr-2" /> {filteredArticles[0].timestamp}
                                </div>
                            </div>
                        </div>

                        {/* Side List */}
                        <div className="space-y-4">
                            {filteredArticles.slice(1).map(article => (
                                <div 
                                    key={article.id} 
                                    onClick={() => handleReadMore(article)}
                                    className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:border-gamepedia-blue dark:hover:border-gamepedia-blue transition-all cursor-pointer group flex flex-col h-[190px] justify-between"
                                >
                                    <div>
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{article.category}</span>
                                            <ArrowUpRight size={16} className="text-slate-300 group-hover:text-gamepedia-blue transition-colors" />
                                        </div>
                                        <h3 className="font-bold text-slate-900 dark:text-white leading-snug group-hover:text-gamepedia-blue transition-colors">
                                            {article.title}
                                        </h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
                                            {article.summary}
                                        </p>
                                    </div>
                                    <span className="text-xs text-slate-400 flex items-center">
                                        <Calendar size={12} className="mr-1.5" /> {article.timestamp}
                                    </span>
                                </div>
                            ))}
                            
                            {/* Generate More Placeholder */}
                            <div className="bg-slate-50 dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl flex items-center justify-center h-[100px] text-slate-400 hover:text-gamepedia-blue hover:border-gamepedia-blue transition-colors cursor-pointer">
                                <span className="font-bold text-sm flex items-center"><Zap size={16} className="mr-2" /> Generate More News</span>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="lg:col-span-3 text-center py-20 text-slate-500">
                        No news found in this category.
                    </div>
                )}
            </div>

            {/* Article Modal/Overlay */}
            {selectedArticle && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedArticle(null)}>
                    <div className="bg-white dark:bg-slate-900 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="h-64 relative">
                            <img src={selectedArticle.imageUrl} className="w-full h-full object-cover" />
                            <button 
                                onClick={() => setSelectedArticle(null)} 
                                className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                            >
                                <ChevronRight size={24} className="rotate-90" />
                            </button>
                            <div className="absolute bottom-0 left-0 p-8 bg-gradient-to-t from-slate-900 to-transparent w-full">
                                <h2 className="text-3xl font-bold text-white">{selectedArticle.title}</h2>
                            </div>
                        </div>
                        <div className="p-8">
                            <div className="flex items-center space-x-4 text-sm text-slate-500 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                                <span className="font-bold text-gamepedia-blue">{selectedArticle.category}</span>
                                <span>•</span>
                                <span>{selectedArticle.timestamp}</span>
                                <span>•</span>
                                <span className="flex items-center"><Zap size={14} className="mr-1 text-gamepedia-orange"/> AI Generated</span>
                            </div>
                            
                            <div className="prose dark:prose-invert max-w-none">
                                <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed font-medium mb-6">
                                    {selectedArticle.summary}
                                </p>
                                {loadingContent ? (
                                    <div className="space-y-3 animate-pulse">
                                        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
                                        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-[90%]"></div>
                                        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-[95%]"></div>
                                        <br/>
                                        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
                                        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-[80%]"></div>
                                    </div>
                                ) : (
                                    <div className="text-slate-600 dark:text-slate-400 whitespace-pre-line leading-relaxed">
                                        {selectedArticle.generatedContent}
                                    </div>
                                )}
                            </div>

                            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                                <span className="text-xs text-slate-400">Content generated by Gemini AI models. Accuracy not guaranteed.</span>
                                <button className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Share Article</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};