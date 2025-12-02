import React, { useState } from 'react';
import { Search, Calendar, Video, Filter } from 'lucide-react';
import { MatchStatus, Match } from '../types';
import { MatchRow } from '../components/MatchRow';
import { useMatches } from '../contexts/MatchContext';

export const MatchesPage: React.FC = () => {
    const { matches } = useMatches();
    const [filterStatus, setFilterStatus] = useState<'all' | 'upcoming' | 'live' | 'finished'>('all');
    const [searchTerm, setSearchTerm] = useState('');

    // Filtering Logic
    const filteredMatches = matches.filter(match => {
        const matchesStatus = filterStatus === 'all' 
            ? true 
            : filterStatus === 'upcoming' 
                ? match.status === MatchStatus.UPCOMING 
                : filterStatus === 'live' 
                    ? match.status === MatchStatus.LIVE 
                    : match.status === MatchStatus.FINISHED;
        
        const matchesSearch = match.teamA.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              match.teamB.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              match.tournamentId.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesStatus && matchesSearch;
    });

    // Group by Date
    const groupedMatches: Record<string, Match[]> = {};
    
    filteredMatches.forEach(match => {
        const date = new Date(match.startTime);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        let dateKey = date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
        
        if (date.toDateString() === today.toDateString()) dateKey = "Today";
        else if (date.toDateString() === tomorrow.toDateString()) dateKey = "Tomorrow";

        if (!groupedMatches[dateKey]) {
            groupedMatches[dateKey] = [];
        }
        groupedMatches[dateKey].push(match);
    });

    // Sort dates (Today first, then others)
    const sortedDateKeys = Object.keys(groupedMatches).sort((a, b) => {
        if (a === "Today") return -1;
        if (b === "Today") return 1;
        if (a === "Tomorrow") return -1;
        if (b === "Tomorrow") return 1;
        return new Date(a).getTime() - new Date(b).getTime();
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-heading font-bold text-gamepedia-dark dark:text-white flex items-center">
                        <Video className="mr-3 text-gamepedia-blue" /> Match Schedule
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                        Track live scores, upcoming brackets, and past results.
                    </p>
                </div>

                {/* Controls */}
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="Search teams or events..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full sm:w-64 pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gamepedia-blue dark:text-white"
                        />
                        <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
                    </div>
                    <div className="flex bg-white dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
                        {(['all', 'live', 'upcoming', 'finished'] as const).map(status => (
                            <button
                                key={status}
                                onClick={() => setFilterStatus(status)}
                                className={`px-4 py-1.5 rounded-md text-sm font-medium capitalize transition-colors ${
                                    filterStatus === status 
                                    ? 'bg-slate-100 dark:bg-slate-800 text-gamepedia-blue shadow-sm' 
                                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                                }`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Match List */}
            <div className="space-y-8">
                {sortedDateKeys.length > 0 ? (
                    sortedDateKeys.map(date => (
                        <div key={date}>
                            <h3 className="flex items-center font-bold text-slate-500 dark:text-slate-400 mb-3 text-sm uppercase tracking-wider">
                                <Calendar size={14} className="mr-2" /> {date}
                            </h3>
                            <div className="space-y-3">
                                {groupedMatches[date].sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()).map(match => (
                                    <MatchRow key={match.id} match={match} />
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                     <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                        <Filter size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">No matches found</h3>
                        <p className="text-slate-500">Try adjusting your filters or search term.</p>
                    </div>
                )}
            </div>
        </div>
    );
};