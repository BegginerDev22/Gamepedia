
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Match, MatchStatus } from '../types';

interface MatchRowProps {
  match: Match;
}

export const MatchRow: React.FC<MatchRowProps> = ({ match }) => {
  const isLive = match.status === MatchStatus.LIVE;

  return (
    <Link to={`/match/${match.id}`} className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
      <div className="flex items-center w-1/3 space-x-3">
        <span className={`text-xs font-medium px-2 py-0.5 rounded ${isLive ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}>
          {isLive ? 'LIVE' : new Date(match.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
        </span>
        <div className="flex flex-col">
           <span className="text-xs text-slate-400 uppercase tracking-wide">{match.tournamentId.replace(/-/g, ' ').toUpperCase()}</span>
           {isLive && <span className="text-[10px] text-red-500 font-bold flex items-center"><span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-1 animate-pulse"></span> {match.map || 'Map 3'}</span>}
        </div>
      </div>

      <div className="flex items-center justify-center w-1/3 space-x-6">
        <div className="flex items-center space-x-2 text-right justify-end w-full">
           <span className="font-semibold text-gamepedia-dark dark:text-white hidden sm:block">{match.teamA.name}</span>
           <span className="font-bold text-lg sm:hidden dark:text-white">{match.teamA.shortName}</span>
           <img src={match.teamA.logoUrl} alt="" className="w-8 h-8 rounded object-contain bg-slate-100 dark:bg-slate-800" />
        </div>
        <div className="font-mono font-bold text-lg text-slate-300 px-2 flex items-center">
            <span className={isLive ? 'text-gamepedia-dark dark:text-white' : ''}>{match.scoreA}</span>
            <span className="mx-1">:</span>
            <span className={isLive ? 'text-gamepedia-dark dark:text-white' : ''}>{match.scoreB}</span>
        </div>
        <div className="flex items-center space-x-2 text-left justify-start w-full">
           <img src={match.teamB.logoUrl} alt="" className="w-8 h-8 rounded object-contain bg-slate-100 dark:bg-slate-800" />
           <span className="font-semibold text-gamepedia-dark dark:text-white hidden sm:block">{match.teamB.name}</span>
           <span className="font-bold text-lg sm:hidden dark:text-white">{match.teamB.shortName}</span>
        </div>
      </div>

      <div className="w-1/3 flex justify-end">
        <ArrowRight size={18} className="text-slate-300 group-hover:text-gamepedia-blue transition-colors" />
      </div>
    </Link>
  );
};
