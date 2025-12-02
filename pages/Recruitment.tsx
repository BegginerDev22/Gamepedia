
import React, { useState } from 'react';
import { Users, Search, Briefcase, UserPlus, MapPin, Clock, CheckCircle, Filter, User } from 'lucide-react';
import { MOCK_RECRUITMENT, MOCK_TEAMS } from '../constants';
import { Link } from 'react-router-dom';

export const RecruitmentPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'LFP' | 'LFT'>('LFP');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTier, setSelectedTier] = useState('All');

    const filteredPosts = MOCK_RECRUITMENT.filter(post => {
        const typeMatch = post.type === activeTab;
        const searchMatch = post.author.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            post.roles.join(' ').toLowerCase().includes(searchTerm.toLowerCase());
        const tierMatch = selectedTier === 'All' || post.tier === selectedTier;
        return typeMatch && searchMatch && tierMatch;
    });

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-slate-900 dark:text-white flex items-center">
                        <Briefcase className="mr-3 text-gamepedia-blue" /> Recruitment Board
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Connect with teams and players. Find your next squad or rising star.
                    </p>
                </div>

                {/* Tabs */}
                <div className="bg-white dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-700 flex">
                    <button 
                        onClick={() => setActiveTab('LFP')}
                        className={`px-6 py-2 rounded-md text-sm font-bold transition-colors flex items-center ${
                            activeTab === 'LFP' 
                            ? 'bg-slate-100 dark:bg-slate-800 text-gamepedia-blue shadow-sm' 
                            : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                        }`}
                    >
                        <Users size={16} className="mr-2" /> Teams Hiring (LFP)
                    </button>
                    <button 
                        onClick={() => setActiveTab('LFT')}
                        className={`px-6 py-2 rounded-md text-sm font-bold transition-colors flex items-center ${
                            activeTab === 'LFT' 
                            ? 'bg-slate-100 dark:bg-slate-800 text-gamepedia-blue shadow-sm' 
                            : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                        }`}
                    >
                        <UserPlus size={16} className="mr-2" /> Players Searching (LFT)
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <input 
                        type="text" 
                        placeholder={activeTab === 'LFP' ? "Search team name or role..." : "Search player name or role..."}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gamepedia-blue dark:text-white"
                    />
                    <Search size={16} className="absolute left-3 top-3 text-slate-400" />
                </div>
                <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase mr-2"><Filter size={14} className="inline mr-1"/> Tier</span>
                    {['All', 'T1', 'T2', 'T3'].map(tier => (
                        <button
                            key={tier}
                            onClick={() => setSelectedTier(tier)}
                            className={`px-3 py-1.5 rounded text-xs font-bold border transition-colors ${
                                selectedTier === tier
                                ? 'bg-blue-50 dark:bg-blue-900/20 border-gamepedia-blue text-gamepedia-blue'
                                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-500'
                            }`}
                        >
                            {tier}
                        </button>
                    ))}
                </div>
            </div>

            {/* List */}
            <div className="space-y-4">
                {filteredPosts.length > 0 ? filteredPosts.map(post => (
                    <div key={post.id} className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 hover:border-gamepedia-blue transition-colors group">
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                            {/* Avatar/Logo */}
                            <div className="shrink-0">
                                <img src={post.image} alt={post.author} className="w-16 h-16 rounded-xl object-contain bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-2" />
                            </div>

                            {/* Main Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate">{post.author}</h3>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                                        post.tier === 'T1' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                                        post.tier === 'T2' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                        'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                                    }`}>
                                        {post.tier}
                                    </span>
                                    <span className="text-xs text-slate-400 flex items-center ml-auto md:ml-0">
                                        <Clock size={12} className="mr-1" /> {post.postedDate}
                                    </span>
                                </div>
                                
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {post.roles.map(role => (
                                        <span key={role} className="text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                                            {role}
                                        </span>
                                    ))}
                                </div>

                                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 md:line-clamp-1">
                                    {post.requirements}
                                </p>
                            </div>

                            {/* Action */}
                            <div className="w-full md:w-auto flex md:flex-col gap-3 justify-end">
                                <button className="flex-1 md:w-32 py-2 bg-gamepedia-blue text-white text-sm font-bold rounded-lg hover:bg-blue-600 transition-colors shadow-md">
                                    {activeTab === 'LFP' ? 'Apply Now' : 'Contact'}
                                </button>
                                <button className="flex-1 md:w-32 py-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm font-bold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                    View Profile
                                </button>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                        <User size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">No posts found</h3>
                        <p className="text-slate-500">Try adjusting filters or check back later.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
