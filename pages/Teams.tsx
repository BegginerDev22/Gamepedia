
import React, { useState } from 'react';
import { Search, Trophy, Users, ArrowRightLeft, TrendingUp, MapPin, DollarSign, Shield, Filter, ArrowDownUp } from 'lucide-react';
import { MOCK_TEAMS, RECENT_TRANSFERS } from '../constants';
import { Team } from '../types';
import { Link } from 'react-router-dom';

const TeamCard: React.FC<{ team: Team }> = ({ team }) => {
    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
                <Link to={`/team/${team.id}`} className="flex items-center space-x-3 group">
                    <img src={team.logoUrl} alt={team.name} className="w-10 h-10 rounded object-contain bg-white dark:bg-slate-700 p-1 group-hover:scale-110 transition-transform" />
                    <div>
                        <h3 className="font-bold text-slate-900 dark:text-white text-lg leading-tight group-hover:text-gamepedia-blue transition-colors">{team.name}</h3>
                        <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
                            <MapPin size={12} className="mr-1" />
                            {team.region}
                        </div>
                    </div>
                </Link>
                <div className="text-right">
                     <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-bold">Winnings</span>
                     <span className="text-sm font-mono font-bold text-green-600 dark:text-green-400">{team.totalWinnings || '₹0'}</span>
                </div>
            </div>

            {/* Roster */}
            <div className="p-4 flex-1">
                <div className="mb-3 flex items-center space-x-2">
                    <Users size={14} className="text-gamepedia-blue" />
                    <span className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider">Active Roster</span>
                </div>
                {team.roster && team.roster.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2">
                        {team.roster.map(player => (
                            <Link to={`/player/${player.id}`} key={player.id} className="flex items-center space-x-2 p-2 rounded bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors group">
                                <img src={player.image} alt={player.handle} className="w-8 h-8 rounded-full bg-slate-200" />
                                <div className="overflow-hidden">
                                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate group-hover:text-gamepedia-blue transition-colors">{player.handle}</p>
                                    <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase">{player.role}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-4 text-slate-400 text-sm italic bg-slate-50 dark:bg-slate-800/50 rounded">
                        Roster info unavailable
                    </div>
                )}
            </div>

            {/* Achievements & Footer */}
            <div className="px-4 pb-4 space-y-4">
                {team.achievements && team.achievements.length > 0 && (
                    <div>
                        <div className="mb-2 flex items-center space-x-2">
                            <Trophy size={14} className="text-amber-500" />
                            <span className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider">Achievements</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {team.achievements.slice(0, 2).map((ach, idx) => (
                                <span key={idx} className="text-[10px] px-2 py-1 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-100 dark:border-amber-800 rounded font-medium">
                                    {ach}
                                </span>
                            ))}
                            {team.achievements.length > 2 && (
                                <span className="text-[10px] px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded font-medium">
                                    +{team.achievements.length - 2} more
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {team.transferHistory && team.transferHistory.length > 0 && (
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                         <p className="text-xs text-slate-400 mb-2 flex items-center">
                            <ArrowRightLeft size={12} className="mr-1" /> Recent Changes
                         </p>
                         <div className="space-y-1">
                            {team.transferHistory.slice(0, 1).map((tx, i) => (
                                <div key={i} className="text-xs flex items-center justify-between">
                                    <span className="font-medium text-slate-700 dark:text-slate-300">{tx.player}</span>
                                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                        tx.action === 'Joined' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 
                                        'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                    }`}>
                                        {tx.action}
                                    </span>
                                </div>
                            ))}
                         </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export const TeamsPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRegion, setSelectedRegion] = useState('All');
    const [sortBy, setSortBy] = useState<'name' | 'winnings'>('winnings');

    const teams = Object.values(MOCK_TEAMS);
    
    // Extract Unique Regions
    const regions = ['All', ...Array.from(new Set(teams.map(t => t.region)))];

    // Helper to parse winnings string to number
    const parseWinnings = (winningsStr?: string) => {
        if (!winningsStr) return 0;
        return parseInt(winningsStr.replace(/[^0-9]/g, ''), 10);
    };

    const filteredTeams = teams
        .filter(t => {
            const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesRegion = selectedRegion === 'All' || t.region === selectedRegion;
            return matchesSearch && matchesRegion;
        })
        .sort((a, b) => {
            if (sortBy === 'winnings') {
                return parseWinnings(b.totalWinnings) - parseWinnings(a.totalWinnings);
            }
            return a.name.localeCompare(b.name);
        });

    return (
        <div className="flex flex-col lg:flex-row gap-8 animate-fade-in">
            {/* Main Content - Team Grid */}
            <div className="flex-1">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                    <div>
                        <h1 className="text-2xl font-heading font-bold text-gamepedia-dark dark:text-white flex items-center">
                            <Shield className="mr-3 text-gamepedia-blue" /> Pro Teams
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                            Browse active rosters, stats, and history of top BGMI organizations.
                        </p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                        {/* Search */}
                        <div className="relative w-full sm:w-64">
                            <input 
                                type="text" 
                                placeholder="Search teams..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-gamepedia-blue text-sm dark:text-white"
                            />
                            <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
                        </div>

                        {/* Controls Container */}
                        <div className="flex gap-2">
                            {/* Region Filter */}
                            <div className="relative">
                                <div className="absolute left-3 top-2.5 text-slate-400 pointer-events-none">
                                    <Filter size={14} />
                                </div>
                                <select 
                                    value={selectedRegion}
                                    onChange={(e) => setSelectedRegion(e.target.value)}
                                    className="pl-9 pr-8 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gamepedia-blue dark:text-white appearance-none cursor-pointer font-medium"
                                >
                                    {regions.map(region => (
                                        <option key={region} value={region}>{region}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Sort By */}
                            <div className="relative">
                                <div className="absolute left-3 top-2.5 text-slate-400 pointer-events-none">
                                    <ArrowDownUp size={14} />
                                </div>
                                <select 
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as 'name' | 'winnings')}
                                    className="pl-9 pr-8 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gamepedia-blue dark:text-white appearance-none cursor-pointer font-medium"
                                >
                                    <option value="winnings">Winnings</option>
                                    <option value="name">Name</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {filteredTeams.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
                        {filteredTeams.map(team => (
                            <TeamCard key={team.id} team={team} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                        <Shield size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">No teams found</h3>
                        <p className="text-slate-500">Try adjusting your search or filters.</p>
                    </div>
                )}
            </div>

            {/* Right Sidebar - Transfer Market */}
            <div className="w-full lg:w-80 shrink-0 space-y-6">
                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-900">
                        <h3 className="font-heading font-bold text-slate-900 dark:text-white flex items-center">
                            <ArrowRightLeft className="mr-2 text-gamepedia-orange" size={18} />
                            Transfer Market
                        </h3>
                    </div>
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                        {RECENT_TRANSFERS.map((tx, idx) => (
                            <div key={idx} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="font-bold text-sm text-gamepedia-blue hover:underline cursor-pointer">{tx.player}</span>
                                    <span className="text-[10px] text-slate-400">{tx.date}</span>
                                </div>
                                <div className="flex items-center text-xs mt-2">
                                    <span className={`px-2 py-0.5 rounded font-bold mr-2 ${
                                        tx.action === 'Joined' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 
                                        'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                    }`}>
                                        {tx.action}
                                    </span>
                                    <span className="text-slate-600 dark:text-slate-300 font-medium truncate">
                                        {tx.fromTo ? tx.fromTo : 'Free Agent'}
                                    </span>
                                </div>
                            </div>
                        ))}
                        <button className="w-full py-3 text-center text-xs font-bold text-slate-500 hover:text-gamepedia-blue hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                            View All Transfers
                        </button>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-5 text-white shadow-lg">
                    <TrendingUp className="mb-3 opacity-80" size={24} />
                    <h3 className="font-heading font-bold text-lg mb-2">Top Transfer?</h3>
                    <p className="text-blue-100 text-sm mb-4 leading-relaxed">
                        Spower's move to Team Soul has shaken up the power rankings. See how it affects the odds.
                    </p>
                    <button className="w-full py-2 bg-white text-blue-600 font-bold text-sm rounded hover:bg-blue-50 transition-colors shadow-sm">
                        Read Analysis
                    </button>
                </div>
            </div>
        </div>
    );
};
