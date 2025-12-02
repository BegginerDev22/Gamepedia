import React, { useState } from 'react';
import { Star, CheckCircle } from 'lucide-react';
import { Team, Player } from '../types';

interface MVPVoteProps {
  teamA: Team;
  teamB: Team;
}

export const MVPVote: React.FC<MVPVoteProps> = ({ teamA, teamB }) => {
  const [votedPlayerId, setVotedPlayerId] = useState<string | null>(null);
  
  // Mock initial votes
  const [votes, setVotes] = useState<Record<string, number>>(() => {
      const initial: Record<string, number> = {};
      [...(teamA.roster || []), ...(teamB.roster || [])].forEach(p => {
          initial[p.id] = Math.floor(Math.random() * 50) + 10;
      });
      return initial;
  });

  const totalVotes: number = (Object.values(votes) as number[]).reduce((a, b) => a + b, 0);

  const handleVote = (playerId: string) => {
      if (votedPlayerId) return;
      setVotedPlayerId(playerId);
      setVotes(prev => ({ ...prev, [playerId]: prev[playerId] + 1 }));
  };

  const allPlayers = [
      ...(teamA.roster || []).map(p => ({ ...p, team: teamA.shortName })), 
      ...(teamB.roster || []).map(p => ({ ...p, team: teamB.shortName }))
  ].sort((a, b) => (votes[b.id] || 0) - (votes[a.id] || 0)); // Sort by votes

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-5 overflow-hidden">
        <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-bold text-sm text-slate-900 dark:text-white flex items-center">
                <Star size={16} className="mr-2 text-yellow-500" /> MVP Vote
            </h3>
            <span className="text-xs text-slate-500">{totalVotes} votes</span>
        </div>

        <div className="space-y-3 max-h-80 overflow-y-auto pr-1 custom-scrollbar">
            {allPlayers.map((player, index) => {
                const voteCount = votes[player.id] || 0;
                const percentage = totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;
                const isLeader = index === 0;

                return (
                    <div key={player.id} className="relative group">
                        <button 
                            onClick={() => handleVote(player.id)}
                            disabled={!!votedPlayerId}
                            className={`w-full relative overflow-hidden rounded-lg border transition-all ${
                                votedPlayerId === player.id 
                                ? 'border-gamepedia-blue bg-blue-50 dark:bg-blue-900/20' 
                                : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800 hover:border-gamepedia-blue/50'
                            }`}
                        >
                            {/* Progress Bar Background */}
                            <div 
                                className={`absolute top-0 left-0 h-full transition-all duration-1000 opacity-10 ${isLeader ? 'bg-yellow-500' : 'bg-slate-400'}`}
                                style={{ width: `${percentage}%` }}
                            ></div>

                            <div className="relative flex items-center justify-between p-2">
                                <div className="flex items-center space-x-3">
                                    <div className="relative">
                                        <img src={player.image} className="w-8 h-8 rounded-full bg-slate-200 object-cover" alt={player.handle} />
                                        {isLeader && <div className="absolute -top-1 -left-1 text-yellow-500"><Star size={10} fill="currentColor"/></div>}
                                    </div>
                                    <div className="text-left">
                                        <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center">
                                            {player.handle}
                                            <span className="ml-2 text-[9px] text-slate-400 font-normal uppercase">{player.team}</span>
                                        </div>
                                        <div className="text-[10px] text-slate-500">{player.role}</div>
                                    </div>
                                </div>

                                {votedPlayerId ? (
                                    <div className="text-right">
                                        <span className="block text-xs font-bold text-slate-700 dark:text-slate-200">{percentage}%</span>
                                        {votedPlayerId === player.id && <CheckCircle size={12} className="ml-auto text-gamepedia-blue mt-0.5" />}
                                    </div>
                                ) : (
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded text-[10px] font-bold text-slate-600 dark:text-slate-300">
                                        VOTE
                                    </div>
                                )}
                            </div>
                        </button>
                    </div>
                );
            })}
        </div>
    </div>
  );
};