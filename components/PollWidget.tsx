import React, { useState } from 'react';
import { BarChart2, CheckCircle } from 'lucide-react';
import { MOCK_POLL } from '../constants';

export const PollWidget: React.FC = () => {
    const [hasVoted, setHasVoted] = useState(false);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [pollData, setPollData] = useState(MOCK_POLL);

    const handleVote = (optionId: string) => {
        if (hasVoted) return;
        setSelectedOption(optionId);
        setHasVoted(true);

        // Simulate updating stats
        setPollData(prev => ({
            ...prev,
            totalVotes: prev.totalVotes + 1,
            options: prev.options.map(opt => opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt)
        }));
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-5 transition-colors duration-200">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading font-bold text-sm text-slate-900 dark:text-white flex items-center">
                    <BarChart2 size={16} className="mr-2 text-gamepedia-blue" /> Community Poll
                </h3>
                <span className="text-xs text-slate-500">{pollData.totalVotes.toLocaleString()} votes</span>
            </div>

            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4 leading-snug">
                {pollData.question}
            </h4>

            <div className="space-y-3">
                {pollData.options.map(option => {
                    const percentage = Math.round((option.votes / pollData.totalVotes) * 100);
                    const isSelected = selectedOption === option.id;

                    return (
                        <div key={option.id} className="relative group">
                            {hasVoted ? (
                                <div className="relative h-10 rounded-lg bg-slate-50 dark:bg-slate-800 overflow-hidden border border-slate-100 dark:border-slate-700">
                                    <div 
                                        className={`absolute top-0 left-0 h-full transition-all duration-1000 ${isSelected ? 'bg-gamepedia-blue/20' : 'bg-slate-200/50 dark:bg-slate-700/50'}`} 
                                        style={{ width: `${percentage}%` }}
                                    ></div>
                                    <div className="absolute inset-0 flex items-center justify-between px-3">
                                        <span className={`text-xs font-bold z-10 ${isSelected ? 'text-gamepedia-blue' : 'text-slate-700 dark:text-slate-300'}`}>
                                            {option.label} {isSelected && '(You)'}
                                        </span>
                                        <span className="text-xs font-mono font-bold text-slate-500 z-10">{percentage}%</span>
                                    </div>
                                </div>
                            ) : (
                                <button 
                                    onClick={() => handleVote(option.id)}
                                    className="w-full text-left px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-gamepedia-blue hover:bg-blue-50 dark:hover:bg-blue-900/10 text-sm font-medium text-slate-700 dark:text-slate-300 transition-all hover:shadow-sm flex justify-between items-center group"
                                >
                                    {option.label}
                                    <CheckCircle size={16} className="opacity-0 group-hover:opacity-100 text-gamepedia-blue transition-opacity" />
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};