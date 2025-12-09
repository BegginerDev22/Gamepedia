
import React from 'react';
import { BarChart2, Calendar, CheckCircle, Clock } from 'lucide-react';
import { MOCK_POLLS_ARCHIVE } from '../constants';

export const PollArchivePage: React.FC = () => {
    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-12">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-heading font-bold text-slate-900 dark:text-white flex items-center justify-center">
                    <BarChart2 className="mr-3 text-gamepedia-blue" /> Polls Archive
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">
                    Voice your opinion. View active and past community polls.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {MOCK_POLLS_ARCHIVE.map(poll => (
                    <div key={poll.id} className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-start">
                            <div>
                                <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider mb-2 inline-block ${
                                    poll.status === 'Active' 
                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                                }`}>
                                    {poll.status}
                                </span>
                                <h3 className="font-bold text-lg text-slate-900 dark:text-white leading-tight">{poll.question}</h3>
                            </div>
                            <div className="text-right">
                                <span className="block text-xl font-mono font-bold text-gamepedia-blue">{poll.totalVotes.toLocaleString()}</span>
                                <span className="text-[10px] text-slate-400 uppercase">Votes</span>
                            </div>
                        </div>

                        <div className="p-6 space-y-4">
                            {poll.options.map(option => {
                                const percentage = Math.round((option.votes / poll.totalVotes) * 100) || 0;
                                // Mock logic: assume first option is always the winner for archive display
                                const isWinner = poll.status === 'Closed' && option.votes === Math.max(...poll.options.map(o => o.votes));

                                return (
                                    <div key={option.id} className="relative group">
                                        <div className="flex justify-between text-sm mb-1 relative z-10">
                                            <span className={`font-medium ${isWinner ? 'text-gamepedia-blue font-bold' : 'text-slate-700 dark:text-slate-300'}`}>
                                                {option.label} {isWinner && <CheckCircle size={12} className="inline ml-1" />}
                                            </span>
                                            <span className="text-slate-500 font-mono">{percentage}%</span>
                                        </div>
                                        <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full rounded-full ${isWinner ? 'bg-gamepedia-blue' : 'bg-slate-300 dark:bg-slate-600'}`} 
                                                style={{ width: `${percentage}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs text-slate-500">
                            <span className="flex items-center"><Clock size={12} className="mr-1" /> {poll.endDate}</span>
                            <button className="font-bold hover:text-gamepedia-blue transition-colors">View Discussion</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
