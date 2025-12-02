
import React, { useState } from 'react';
import { Calendar, Trophy, ChevronDown, ChevronUp, Filter, Shield } from 'lucide-react';
import { MOCK_SCRIM_SESSIONS, MOCK_TEAMS } from '../constants';
import { ScrimSession, ScrimResult } from '../types';
import { Link } from 'react-router-dom';

export const ScrimsPage: React.FC = () => {
    const [selectedTier, setSelectedTier] = useState<'All' | 'T1' | 'T2' | 'T3'>('All');
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [expandedSession, setExpandedSession] = useState<string | null>(MOCK_SCRIM_SESSIONS[0].id);

    const filteredSessions = MOCK_SCRIM_SESSIONS.filter(session => {
        const tierMatch = selectedTier === 'All' || session.tier === selectedTier;
        // For demo, we might ignore date strict filtering to show data, but in real app:
        // const dateMatch = session.date === selectedDate;
        return tierMatch;
    });

    const getTeamLogo = (teamId: string) => {
        return MOCK_TEAMS[teamId]?.logoUrl || 'https://via.placeholder.com/32';
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-slate-900 dark:text-white flex items-center">
                        <Shield className="mr-3 text-gamepedia-blue" /> Scrims Center
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Daily practice match standings and results tracker.
                    </p>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-3">
                    <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2">
                        <Calendar size={16} className="text-slate-400 mr-2" />
                        <input 
                            type="date" 
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="bg-transparent text-sm text-slate-700 dark:text-slate-300 outline-none"
                        />
                    </div>
                    <div className="flex bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-1">
                        {['All', 'T1', 'T2', 'T3'].map(tier => (
                            <button
                                key={tier}
                                onClick={() => setSelectedTier(tier as any)}
                                className={`px-3 py-1.5 text-xs font-bold rounded transition-colors ${
                                    selectedTier === tier 
                                    ? 'bg-slate-100 dark:bg-slate-800 text-gamepedia-blue' 
                                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                }`}
                            >
                                {tier}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Sessions List */}
            <div className="space-y-6">
                {filteredSessions.length > 0 ? filteredSessions.map(session => (
                    <div key={session.id} className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors">
                        {/* Session Header */}
                        <div 
                            onClick={() => setExpandedSession(expandedSession === session.id ? null : session.id)}
                            className="p-6 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg ${
                                    session.tier === 'T1' ? 'bg-gradient-to-br from-purple-600 to-indigo-600' : 
                                    session.tier === 'T2' ? 'bg-gradient-to-br from-blue-500 to-cyan-500' : 'bg-slate-500'
                                }`}>
                                    {session.tier}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">{session.title}</h3>
                                    <div className="flex items-center text-sm text-slate-500">
                                        <span className="mr-3">{session.date}</span>
                                        <span className="mr-3">•</span>
                                        <span>By {session.organizer}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                {/* Top 3 Summary (Hidden on mobile) */}
                                <div className="hidden md:flex items-center gap-3 mr-6">
                                    {session.results.slice(0, 3).map((res, idx) => (
                                        <div key={res.teamId} className="flex items-center gap-2" title={`${res.teamName} - #${idx+1}`}>
                                            <img src={getTeamLogo(res.teamId)} className="w-6 h-6 rounded bg-slate-100 dark:bg-slate-800" />
                                            {idx === 0 && <Trophy size={14} className="text-yellow-500" />}
                                        </div>
                                    ))}
                                </div>
                                {expandedSession === session.id ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
                            </div>
                        </div>

                        {/* Expanded Table */}
                        {expandedSession === session.id && (
                            <div className="border-t border-slate-100 dark:border-slate-800 animate-fade-in">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-medium uppercase text-xs">
                                            <tr>
                                                <th className="px-6 py-3 w-16 text-center">#</th>
                                                <th className="px-6 py-3">Team</th>
                                                <th className="px-6 py-3 text-center">Matches</th>
                                                <th className="px-6 py-3 text-center">WWCD</th>
                                                <th className="px-6 py-3 text-center">Finishes</th>
                                                <th className="px-6 py-3 text-right font-bold">Total Pts</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                            {session.results.map((res, idx) => (
                                                <tr key={res.teamId} className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${idx < 3 ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}`}>
                                                    <td className="px-6 py-4 text-center font-bold text-slate-500 dark:text-slate-400">
                                                        {res.rank}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <Link to={`/team/${res.teamId}`} className="flex items-center gap-3 hover:text-gamepedia-blue transition-colors">
                                                            <img src={getTeamLogo(res.teamId)} className="w-8 h-8 rounded object-contain bg-slate-100 dark:bg-slate-800 p-1" />
                                                            <span className="font-bold text-slate-900 dark:text-white">{res.teamName}</span>
                                                        </Link>
                                                    </td>
                                                    <td className="px-6 py-4 text-center text-slate-600 dark:text-slate-400">{res.matches}</td>
                                                    <td className="px-6 py-4 text-center">
                                                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${res.wwcd > 0 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'text-slate-400'}`}>
                                                            {res.wwcd}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-center text-slate-600 dark:text-slate-400">{res.finishPts}</td>
                                                    <td className="px-6 py-4 text-right font-mono font-bold text-lg text-gamepedia-blue">{res.totalPts}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                )) : (
                    <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                        <Calendar size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Scrims Found</h3>
                        <p className="text-slate-500">Try selecting a different date or tier.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
