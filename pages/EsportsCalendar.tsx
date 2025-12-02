
import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Video, Trophy } from 'lucide-react';
import { MOCK_MATCHES } from '../constants';
import { Link } from 'react-router-dom';

export const EsportsCalendarPage: React.FC = () => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const getDaysInMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const monthName = currentDate.toLocaleString('default', { month: 'long' });
    const year = currentDate.getFullYear();

    // Generate Calendar Grid
    const days = [];
    for (let i = 0; i < firstDay; i++) {
        days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
        days.push(i);
    }

    const getMatchesForDay = (day: number) => {
        return MOCK_MATCHES.filter(m => {
            const matchDate = new Date(m.startTime);
            return matchDate.getDate() === day && 
                   matchDate.getMonth() === currentDate.getMonth() && 
                   matchDate.getFullYear() === currentDate.getFullYear();
        });
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-12">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-slate-900 dark:text-white flex items-center">
                        <CalendarIcon className="mr-3 text-gamepedia-blue" /> Event Calendar
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Monthly view of all upcoming scrims, tournaments, and matches.
                    </p>
                </div>

                <div className="flex items-center bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-1">
                    <button onClick={prevMonth} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                        <ChevronLeft size={20} className="text-slate-500" />
                    </button>
                    <span className="px-4 font-bold text-slate-900 dark:text-white w-32 text-center">
                        {monthName} {year}
                    </span>
                    <button onClick={nextMonth} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                        <ChevronRight size={20} className="text-slate-500" />
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                {/* Weekday Headers */}
                <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 auto-rows-[minmax(120px,auto)]">
                    {days.map((day, index) => {
                        if (day === null) {
                            return <div key={`empty-${index}`} className="bg-slate-50/30 dark:bg-slate-800/20 border-b border-r border-slate-100 dark:border-slate-800/50"></div>;
                        }

                        const dayMatches = getMatchesForDay(day);
                        const isToday = 
                            day === new Date().getDate() && 
                            currentDate.getMonth() === new Date().getMonth() && 
                            currentDate.getFullYear() === new Date().getFullYear();

                        return (
                            <div key={day} className={`p-2 border-b border-r border-slate-100 dark:border-slate-800 relative group hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors ${isToday ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}`}>
                                <span className={`text-sm font-bold block mb-2 ${isToday ? 'text-gamepedia-blue' : 'text-slate-700 dark:text-slate-300'}`}>
                                    {day} {isToday && <span className="ml-1 text-[10px] uppercase font-normal bg-gamepedia-blue text-white px-1.5 rounded">Today</span>}
                                </span>
                                
                                <div className="space-y-1">
                                    {dayMatches.map(match => (
                                        <Link 
                                            key={match.id} 
                                            to={`/match/${match.id}`}
                                            className="block text-xs p-1.5 rounded bg-slate-100 dark:bg-slate-700/50 hover:bg-gamepedia-blue hover:text-white dark:hover:bg-gamepedia-blue dark:hover:text-white transition-colors truncate border-l-2 border-gamepedia-blue"
                                            title={`${match.teamA.shortName} vs ${match.teamB.shortName}`}
                                        >
                                            {match.teamA.shortName} vs {match.teamB.shortName}
                                        </Link>
                                    ))}
                                    {dayMatches.length === 0 && (
                                        <div className="h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="text-[10px] text-slate-400 hover:text-gamepedia-blue flex items-center">
                                                <Video size={10} className="mr-1" /> Add Scrim
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
