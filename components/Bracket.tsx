import React from 'react';
import { Team } from '../types';
import { MOCK_TEAMS } from '../constants';

interface BracketMatchProps {
  team1: { team: Team; score: number; winner: boolean };
  team2: { team: Team; score: number; winner: boolean };
  date: string;
}

const BracketMatch: React.FC<BracketMatchProps> = ({ team1, team2, date }) => {
  return (
    <div className="w-64 bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col mb-4 relative transition-colors duration-200">
      <div className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-1 text-slate-500 dark:text-slate-400 font-mono border-b border-slate-200 dark:border-slate-700 flex justify-between">
        <span>UB Quarterfinals</span>
        <span>{date}</span>
      </div>
      
      {/* Team 1 */}
      <div className={`flex items-center justify-between px-3 py-2 border-b border-slate-100 dark:border-slate-800 ${team1.winner ? 'bg-blue-50/50 dark:bg-blue-900/20' : ''}`}>
        <div className="flex items-center space-x-2">
          <img src={team1.team.logoUrl} alt={team1.team.shortName} className="w-5 h-5 rounded-full" />
          <span className={`text-sm ${team1.winner ? 'font-bold text-gamepedia-dark dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
            {team1.team.name}
          </span>
        </div>
        <span className={`font-mono text-sm ${team1.winner ? 'text-gamepedia-blue font-bold' : 'text-slate-400 dark:text-slate-600'}`}>
          {team1.score}
        </span>
      </div>

      {/* Team 2 */}
      <div className={`flex items-center justify-between px-3 py-2 ${team2.winner ? 'bg-blue-50/50 dark:bg-blue-900/20' : ''}`}>
        <div className="flex items-center space-x-2">
          <img src={team2.team.logoUrl} alt={team2.team.shortName} className="w-5 h-5 rounded-full" />
          <span className={`text-sm ${team2.winner ? 'font-bold text-gamepedia-dark dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
            {team2.team.name}
          </span>
        </div>
        <span className={`font-mono text-sm ${team2.winner ? 'text-gamepedia-blue font-bold' : 'text-slate-400 dark:text-slate-600'}`}>
          {team2.score}
        </span>
      </div>
    </div>
  );
};

// A simplified visual bracket for demonstration
export const Bracket: React.FC = () => {
  const { soul, godl, tx, ge, blind, entity } = MOCK_TEAMS;
  
  // Mocking structure for the bracket view
  const matches = [
    {
        id: 1,
        t1: { team: { ...soul, name: 'Soul' }, score: 2, winner: true },
        t2: { team: { ...godl, name: 'GodLike' }, score: 1, winner: false },
        date: "Apr 14, 18:00"
    },
    {
        id: 2,
        t1: { team: { ...tx, name: 'Team XSpark' }, score: 0, winner: false },
        t2: { team: { ...blind, name: 'Blind' }, score: 2, winner: true },
        date: "Apr 14, 19:30"
    }
  ];

  return (
    <div className="flex overflow-x-auto pb-4 space-x-8 p-4">
      {/* Round 1 */}
      <div className="flex flex-col justify-around space-y-8">
        <h3 className="font-bold text-center text-slate-400 text-sm uppercase tracking-widest mb-2">Semifinals</h3>
        <div className="space-y-8 relative">
            <BracketMatch team1={matches[0].t1 as any} team2={matches[0].t2 as any} date={matches[0].date} />
            <div className="hidden md:block absolute top-12 -right-6 w-6 h-24 border-r-2 border-slate-300 dark:border-slate-600 rounded-r-xl pointer-events-none"></div>
            <BracketMatch team1={matches[1].t1 as any} team2={matches[1].t2 as any} date={matches[1].date} />
        </div>
      </div>

      {/* Round 2 */}
      <div className="flex flex-col justify-center">
         <h3 className="font-bold text-center text-slate-400 text-sm uppercase tracking-widest mb-2">Grand Final</h3>
         <div className="flex items-center h-full">
            <BracketMatch 
                team1={{ team: { ...soul, name: 'Soul' } as Team, score: 0, winner: false }} 
                team2={{ team: { ...blind, name: 'Blind' } as Team, score: 0, winner: false }} 
                date="Apr 15, 20:00" 
            />
         </div>
      </div>
    </div>
  );
};