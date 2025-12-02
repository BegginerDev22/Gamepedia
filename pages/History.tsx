
import React from 'react';
import { Clock, Trophy, AlertCircle, Info, Gamepad2 } from 'lucide-react';
import { MOCK_TIMELINE_EVENTS } from '../constants';
import { TimelineEvent } from '../types';

export const HistoryPage: React.FC = () => {
    const getIcon = (type: string) => {
        switch (type) {
            case 'Tournament': return <Trophy size={20} className="text-amber-500" />;
            case 'Controversy': return <AlertCircle size={20} className="text-red-500" />;
            case 'Game Update': return <Gamepad2 size={20} className="text-blue-500" />;
            default: return <Info size={20} className="text-purple-500" />;
        }
    };

    const getColor = (type: string) => {
        switch (type) {
            case 'Tournament': return 'bg-amber-50 border-amber-200 dark:bg-amber-900/10 dark:border-amber-800';
            case 'Controversy': return 'bg-red-50 border-red-200 dark:bg-red-900/10 dark:border-red-800';
            case 'Game Update': return 'bg-blue-50 border-blue-200 dark:bg-blue-900/10 dark:border-blue-800';
            default: return 'bg-purple-50 border-purple-200 dark:bg-purple-900/10 dark:border-purple-800';
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
            <div className="text-center mb-12">
                <h1 className="text-3xl font-heading font-bold text-slate-900 dark:text-white flex items-center justify-center">
                    <Clock className="mr-3 text-gamepedia-blue" /> BGMI History & Timeline
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-xl mx-auto">
                    Trace the evolution of Battlegrounds Mobile India from its launch, through the ban era, to the modern esports ecosystem.
                </p>
            </div>

            <div className="relative">
                {/* Vertical Line */}
                <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700 transform md:-translate-x-1/2"></div>

                <div className="space-y-12">
                    {MOCK_TIMELINE_EVENTS.map((event, index) => (
                        <div key={event.id} className={`relative flex flex-col md:flex-row items-center ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                            
                            {/* Date Badge (Center) */}
                            <div className="absolute left-4 md:left-1/2 w-8 h-8 rounded-full bg-white dark:bg-slate-900 border-4 border-gamepedia-blue transform -translate-x-1/2 z-10 flex items-center justify-center">
                                <div className="w-2 h-2 bg-gamepedia-blue rounded-full"></div>
                            </div>

                            {/* Content Card */}
                            <div className="w-full md:w-1/2 pl-12 md:pl-0 md:px-8">
                                <div className={`p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow ${getColor(event.type)} dark:bg-slate-800 dark:border-slate-700`}>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-bold uppercase tracking-wider opacity-70">{event.date}</span>
                                        <div className="p-1.5 bg-white dark:bg-slate-800 rounded-full shadow-sm">
                                            {getIcon(event.type)}
                                        </div>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{event.title}</h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                                        {event.description}
                                    </p>
                                    {event.imageUrl && (
                                        <div className="mt-3 rounded-lg overflow-hidden h-40 w-full bg-slate-200 dark:bg-slate-700">
                                            <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            {/* Empty Space for alternate side */}
                            <div className="w-full md:w-1/2 hidden md:block"></div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="text-center pt-12">
                <button className="px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                    Load Older Events
                </button>
            </div>
        </div>
    );
};
