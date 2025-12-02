import React, { useState } from 'react';
import { Trophy, CheckCircle, AlertCircle, ArrowRight, Crown } from 'lucide-react';
import { MOCK_TEAMS } from '../constants';
import { PickemMatch, Team } from '../types';
import { useUser } from '../contexts/UserContext';

// Initial Bracket State (Quarterfinals -> Semis -> Finals)
const INITIAL_BRACKET: PickemMatch[] = [
    { id: 1, round: 1, nextMatchId: 5, team1: MOCK_TEAMS['soul'], team2: MOCK_TEAMS['godl'], winnerId: null },
    { id: 2, round: 1, nextMatchId: 5, team1: MOCK_TEAMS['tx'], team2: MOCK_TEAMS['blind'], winnerId: null },
    { id: 3, round: 1, nextMatchId: 6, team1: MOCK_TEAMS['ge'], team2: MOCK_TEAMS['entity'], winnerId: null },
    { id: 4, round: 1, nextMatchId: 6, team1: { ...MOCK_TEAMS['soul'], name: 'Revenant' }, team2: { ...MOCK_TEAMS['godl'], name: 'Medal' }, winnerId: null },
    { id: 5, round: 2, nextMatchId: 7, team1: null, team2: null, winnerId: null },
    { id: 6, round: 2, nextMatchId: 7, team1: null, team2: null, winnerId: null },
    { id: 7, round: 3, nextMatchId: undefined, team1: null, team2: null, winnerId: null }
];

interface RenderMatchProps {
  match: PickemMatch;
  submitted: boolean;
  onSelectWinner: (matchId: number, team: Team) => void;
}

const RenderMatch: React.FC<RenderMatchProps> = ({ match, submitted, onSelectWinner }) => {
    const t1Selected = match.winnerId && match.team1 && match.winnerId === match.team1.id;
    const t2Selected = match.winnerId && match.team2 && match.winnerId === match.team2.id;

    return (
        <div className="flex flex-col w-48 my-4 bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <button 
                disabled={!match.team1 || submitted}
                onClick={() => match.team1 && onSelectWinner(match.id, match.team1)}
                className={`p-3 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 transition-colors ${t1Selected ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-slate-50 dark:hover:bg-slate-800'}`}
            >
                <span className={`text-sm font-bold truncate ${t1Selected ? 'text-gamepedia-blue' : 'text-slate-700 dark:text-slate-300'}`}>
                    {match.team1 ? match.team1.name : 'TBD'}
                </span>
                {t1Selected && <CheckCircle size={14} className="text-gamepedia-blue" />}
            </button>
            <button 
                disabled={!match.team2 || submitted}
                onClick={() => match.team2 && onSelectWinner(match.id, match.team2)}
                className={`p-3 flex items-center justify-between transition-colors ${t2Selected ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-slate-50 dark:hover:bg-slate-800'}`}
            >
                <span className={`text-sm font-bold truncate ${t2Selected ? 'text-gamepedia-blue' : 'text-slate-700 dark:text-slate-300'}`}>
                    {match.team2 ? match.team2.name : 'TBD'}
                </span>
                {t2Selected && <CheckCircle size={14} className="text-gamepedia-blue" />}
            </button>
        </div>
    );
};

export const PickemsPage: React.FC = () => {
    const { points, addPoints } = useUser();
    const [bracket, setBracket] = useState<PickemMatch[]>(INITIAL_BRACKET);
    const [submitted, setSubmitted] = useState(false);

    const handleSelectWinner = (matchId: number, team: Team) => {
        if (submitted) return;

        const updatedBracket = [...bracket];
        const matchIndex = updatedBracket.findIndex(m => m.id === matchId);
        if (matchIndex === -1) return;

        // Set winner
        updatedBracket[matchIndex].winnerId = team.id;

        // Advance to next match
        const currentMatch = updatedBracket[matchIndex];
        if (currentMatch.nextMatchId) {
            const nextMatchIndex = updatedBracket.findIndex(m => m.id === currentMatch.nextMatchId);
            if (nextMatchIndex !== -1) {
                // Determine if it's slot 1 or 2 in the next match
                // Simple logic: if current match ID is odd, it goes to team1, else team2 (simplified for this structure)
                // For Quarterfinals (1,2,3,4) -> Semis (5,6)
                // 1->5(t1), 2->5(t2), 3->6(t1), 4->6(t2)
                // For Semis (5,6) -> Final (7)
                // 5->7(t1), 6->7(t2)

                const nextMatch = updatedBracket[nextMatchIndex];
                
                // Logic mapping
                let targetSlot: 'team1' | 'team2' = 'team1';
                if (currentMatch.round === 1) {
                    if (currentMatch.id % 2 === 0) targetSlot = 'team2';
                } else if (currentMatch.round === 2) {
                    if (currentMatch.id === 6) targetSlot = 'team2';
                }

                updatedBracket[nextMatchIndex] = {
                    ...nextMatch,
                    [targetSlot]: team,
                    winnerId: null // Reset winner of next match if previous changes
                };
                
                // Recursively clear future rounds if needed (simplified here by just resetting next winner)
                if (nextMatch.nextMatchId) {
                     const futureMatchIndex = updatedBracket.findIndex(m => m.id === nextMatch.nextMatchId);
                     if (futureMatchIndex !== -1) {
                         // We need to clear the future match slot too, but for simplicity in demo we leave as is or reset
                     }
                }
            }
        }

        setBracket(updatedBracket);
    };

    const handleSubmit = () => {
        const finalMatch = bracket.find(m => m.round === 3);
        if (!finalMatch?.winnerId) {
            alert("Please select a champion!");
            return;
        }
        setSubmitted(true);
        // Mock reward
        addPoints(100); 
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-12">
             <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-xl p-8 text-white shadow-lg flex flex-col md:flex-row justify-between items-center">
                <div>
                    <h1 className="text-3xl font-heading font-bold flex items-center mb-2">
                        <Crown className="mr-3 text-yellow-400" /> BGIS 2024 Pick'ems
                    </h1>
                    <p className="text-blue-100 max-w-xl">
                        Predict the playoff bracket correctly to win the "Oracle" badge and 5000 GameCredits.
                    </p>
                </div>
                <div className="mt-6 md:mt-0 text-center bg-white/10 backdrop-blur-md p-4 rounded-lg border border-white/20">
                    <span className="block text-xs uppercase font-bold text-blue-200">Your Balance</span>
                    <span className="text-2xl font-mono font-bold">{points.toLocaleString()} PTS</span>
                </div>
             </div>

             <div className="overflow-x-auto pb-8">
                 <div className="min-w-[800px] flex justify-between items-center gap-8 px-4">
                    {/* Quarterfinals */}
                    <div className="flex flex-col gap-6">
                        <h3 className="text-center font-bold text-slate-500 dark:text-slate-400 uppercase text-xs tracking-widest mb-2">Quarterfinals</h3>
                        {bracket.filter(m => m.round === 1).map(match => (
                            <RenderMatch 
                                key={match.id} 
                                match={match} 
                                submitted={submitted} 
                                onSelectWinner={handleSelectWinner} 
                            />
                        ))}
                    </div>

                    {/* Connectors */}
                    <div className="flex flex-col justify-around h-[400px]">
                        <ArrowRight className="text-slate-300 dark:text-slate-700" />
                        <ArrowRight className="text-slate-300 dark:text-slate-700" />
                    </div>

                    {/* Semifinals */}
                    <div className="flex flex-col gap-24">
                        <h3 className="text-center font-bold text-slate-500 dark:text-slate-400 uppercase text-xs tracking-widest mb-2">Semifinals</h3>
                        {bracket.filter(m => m.round === 2).map(match => (
                            <RenderMatch 
                                key={match.id} 
                                match={match} 
                                submitted={submitted} 
                                onSelectWinner={handleSelectWinner} 
                            />
                        ))}
                    </div>

                    {/* Connectors */}
                    <div className="flex flex-col justify-around h-[200px]">
                         <ArrowRight className="text-slate-300 dark:text-slate-700" />
                    </div>

                    {/* Final */}
                    <div className="flex flex-col">
                        <h3 className="text-center font-bold text-slate-500 dark:text-slate-400 uppercase text-xs tracking-widest mb-2">Grand Final</h3>
                        {bracket.filter(m => m.round === 3).map(match => (
                            <div key={match.id} className="transform scale-125 origin-center">
                                <RenderMatch 
                                    match={match} 
                                    submitted={submitted} 
                                    onSelectWinner={handleSelectWinner} 
                                />
                                {match.winnerId && (
                                    <div className="text-center mt-4 animate-bounce">
                                        <span className="text-xs font-bold text-yellow-500 uppercase block">Champion</span>
                                        <Trophy size={32} className="mx-auto text-yellow-500 drop-shadow-lg" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                 </div>
             </div>

             <div className="flex justify-center">
                 {submitted ? (
                     <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-6 py-3 rounded-lg font-bold flex items-center">
                         <CheckCircle className="mr-2" /> Predictions Submitted! Good Luck.
                     </div>
                 ) : (
                    <button 
                        onClick={handleSubmit}
                        className="px-8 py-4 bg-gamepedia-orange hover:bg-orange-600 text-white font-bold rounded-lg shadow-lg shadow-orange-500/30 transform hover:scale-105 transition-all"
                    >
                        Lock In Predictions
                    </button>
                 )}
             </div>

             <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
                 <h4 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center"><AlertCircle size={16} className="mr-2 text-slate-400"/> Rules</h4>
                 <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-400 space-y-1">
                     <li>Predictions lock 1 hour before the first match.</li>
                     <li>Correct Quarterfinal pick: +10 Points</li>
                     <li>Correct Semifinal pick: +25 Points</li>
                     <li>Correct Champion pick: +100 Points</li>
                 </ul>
             </div>
        </div>
    );
};