
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Bot, Activity, PlayCircle, AlertTriangle, TrendingUp, Coins, Crosshair, Ban, CheckCircle, History, Swords } from 'lucide-react';
import { generateMatchAnalysis } from '../services/geminiService';
import { BettingModal } from '../components/BettingModal';
import { useUser } from '../contexts/UserContext';
import { useMatches } from '../contexts/MatchContext';
import { LiveChat } from '../components/LiveChat';
import { MVPVote } from '../components/MVPVote';
import { TrendChart } from '../components/TrendChart';

// Mock Kill Feed Data
const MOCK_KILLS = [
    { killer: 'Jonathan', weapon: 'M416', victim: 'Manya', time: '12:40' },
    { killer: 'Zgod', weapon: 'UMP45', victim: 'Nakul', time: '12:42' },
    { killer: 'Spower', weapon: 'AKM', victim: 'Simp', time: '13:05' },
    { killer: 'NinjaJOD', weapon: 'AWM', victim: 'Jelly', time: '14:10' },
];

// Mock Map Veto Data
const MOCK_VETO = [
    { map: 'Vikendi', status: 'ban', team: 'GodLike' },
    { map: 'Sanhok', status: 'ban', team: 'Team Soul' },
    { map: 'Miramar', status: 'pick', team: 'GodLike' },
    { map: 'Erangel', status: 'pick', team: 'Team Soul' },
    { map: 'Erangel', status: 'decider', team: 'Auto' },
];

export const MatchPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getMatch } = useMatches();
  
  const match = getMatch(id || '') || getMatch('m1'); // Fallback
  
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Betting State
  const [isBetModalOpen, setIsBetModalOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<{id: string, name: string, odds: number} | null>(null);

  // Kill Feed State
  const [killFeed, setKillFeed] = useState(MOCK_KILLS);

  // Simulate Live Feed
  useEffect(() => {
      if (match?.status === 'Live') {
          const interval = setInterval(() => {
              const newKill = { 
                  killer: ['Jonathan', 'Zgod', 'Spower', 'Goblin'][Math.floor(Math.random() * 4)],
                  weapon: ['M416', 'AKM', 'SCAR-L', 'DBS'][Math.floor(Math.random() * 4)],
                  victim: ['PlayerX', 'PlayerY', 'PlayerZ'][Math.floor(Math.random() * 3)],
                  time: 'Live'
              };
              setKillFeed(prev => [newKill, ...prev].slice(0, 5));
          }, 5000);
          return () => clearInterval(interval);
      }
  }, [match?.status]);

  const handleGetAnalysis = async () => {
    if (!match) return;
    setLoading(true);
    const result = await generateMatchAnalysis(match);
    setAnalysis(result);
    setLoading(false);
  };

  const openBetModal = (team: {id: string, name: string, odds: number}) => {
      setSelectedTeam(team);
      setIsBetModalOpen(true);
  };

  // Mock odds generation
  const teamAOdds = 1.85;
  const teamBOdds = 2.10;

  if (!match) return <div>Match not found</div>;

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
       {/* Match Header Scoreboard */}
       <div className="bg-slate-900 rounded-xl overflow-hidden shadow-lg mb-8 border border-slate-700">
          <div className="bg-slate-800/50 p-3 flex justify-between items-center border-b border-slate-700">
             <span className="text-slate-400 text-sm font-mono uppercase">{match.tournamentId} • {match.map}</span>
             <span className="text-red-500 font-bold text-sm uppercase tracking-wider flex items-center">
                {match.status === 'Live' && <span className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></span>}
                {match.status}
             </span>
          </div>
          
          <div className="p-8 flex flex-col md:flex-row items-center justify-center md:justify-between space-y-6 md:space-y-0">
             {/* Team A */}
             <div className="flex flex-col items-center md:items-end w-1/3 group cursor-pointer" onClick={() => match.status !== 'Finished' && openBetModal({ id: match.teamA.id, name: match.teamA.name, odds: teamAOdds })}>
                <div className="relative">
                    <img src={match.teamA.logoUrl} alt={match.teamA.name} className={`w-20 h-20 rounded-lg mb-3 bg-slate-800 p-2 transition-transform border border-transparent ${match.status !== 'Finished' ? 'group-hover:scale-105 group-hover:border-gamepedia-blue/50' : ''}`} />
                    {match.status !== 'Finished' && (
                        <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">Bet</span>
                    )}
                    {match.winnerId === match.teamA.id && (
                        <span className="absolute -bottom-2 -right-2 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg">WINNER</span>
                    )}
                </div>
                <h2 className="text-2xl font-bold text-white text-center md:text-right">{match.teamA.name}</h2>
                {match.status !== 'Finished' && (
                    <span className="text-slate-400 text-sm flex items-center mt-1">
                        <TrendingUp size={12} className="mr-1 text-green-400" /> {teamAOdds}x
                    </span>
                )}
             </div>

             {/* Score */}
             <div className="flex flex-col items-center justify-center px-10">
                <div className="text-5xl md:text-6xl font-mono font-bold text-white tracking-widest shadow-lg shadow-black/50 p-2 rounded">
                   {match.scoreA} <span className="text-slate-600 mx-2">:</span> {match.scoreB}
                </div>
                <span className="text-slate-500 mt-2 text-sm font-mono">Best of 1</span>
             </div>

             {/* Team B */}
             <div className="flex flex-col items-center md:items-start w-1/3 group cursor-pointer" onClick={() => match.status !== 'Finished' && openBetModal({ id: match.teamB.id, name: match.teamB.name, odds: teamBOdds })}>
                <div className="relative">
                    <img src={match.teamB.logoUrl} alt={match.teamB.name} className={`w-20 h-20 rounded-lg mb-3 bg-slate-800 p-2 transition-transform border border-transparent ${match.status !== 'Finished' ? 'group-hover:scale-105 group-hover:border-gamepedia-blue/50' : ''}`} />
                    {match.status !== 'Finished' && (
                        <span className="absolute -top-2 -left-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">Bet</span>
                    )}
                    {match.winnerId === match.teamB.id && (
                        <span className="absolute -bottom-2 -left-2 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg">WINNER</span>
                    )}
                </div>
                <h2 className="text-2xl font-bold text-white text-center md:text-left">{match.teamB.name}</h2>
                {match.status !== 'Finished' && (
                    <span className="text-slate-400 text-sm flex items-center mt-1">
                        <TrendingUp size={12} className="mr-1 text-green-400" /> {teamBOdds}x
                    </span>
                )}
             </div>
          </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
             
             {/* Live Kill Feed Ticker */}
             {match.status === 'Live' && (
                 <div className="bg-black/80 border border-slate-800 rounded-lg p-3 flex items-center overflow-hidden">
                     <div className="flex items-center text-red-500 font-bold text-xs uppercase mr-4 shrink-0 animate-pulse">
                         <Crosshair size={14} className="mr-1" /> Kill Feed
                     </div>
                     <div className="flex space-x-6 overflow-x-hidden whitespace-nowrap w-full">
                         {killFeed.map((kill, i) => (
                             <div key={i} className="flex items-center text-xs animate-fade-in">
                                 <span className="font-bold text-white">{kill.killer}</span>
                                 <img src="https://img.icons8.com/ios-filled/50/ffffff/assault-rifle.png" className="w-4 h-4 mx-1 opacity-70" alt={kill.weapon}/>
                                 <span className="text-slate-400">{kill.victim}</span>
                             </div>
                         ))}
                     </div>
                 </div>
             )}

             {/* Streams / VODs */}
             <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 transition-colors duration-200">
                <h3 className="font-heading font-bold text-lg mb-4 text-gamepedia-dark dark:text-white">Live Stream</h3>
                <div className="aspect-video bg-slate-900 rounded-lg flex items-center justify-center group cursor-pointer relative overflow-hidden">
                    <img src="https://picsum.photos/800/450" alt="Stream Thumbnail" className="w-full h-full object-cover opacity-50 group-hover:opacity-75 transition-opacity" />
                    <div className="absolute inset-0 flex items-center justify-center">
                       <PlayCircle size={64} className="text-white drop-shadow-lg group-hover:scale-110 transition-transform" />
                    </div>
                    {match.status === 'Live' && (
                        <div className="absolute bottom-4 left-4 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">LIVE</div>
                    )}
                </div>
                <div className="mt-4 flex gap-4 text-sm text-slate-500 dark:text-slate-400">
                    <button className="hover:text-gamepedia-blue font-medium">English Stream</button>
                    <button className="hover:text-gamepedia-blue font-medium">Hindi Stream</button>
                    <button className="hover:text-gamepedia-blue font-medium">Map View</button>
                </div>
             </div>

             {/* Win Probability Graph */}
             <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4 flex items-center">
                    <Activity className="mr-2 text-gamepedia-blue" size={20} /> Live Win Probability
                </h3>
                <div className="h-48">
                    <TrendChart 
                        data={[50, 52, 48, 55, 60, 58, 65, 70]} 
                        labels={['Start', '5m', '10m', '15m', '20m', '25m', 'End']} 
                        color="#2B5DF5" 
                        height={180} 
                    />
                </div>
                <div className="flex justify-between text-xs text-slate-500 mt-4 px-2">
                    <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-slate-300 mr-2"></div>
                        {match.teamB.shortName} Base
                    </div>
                    <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-gamepedia-blue mr-2"></div>
                        {match.teamA.shortName} Advantage
                    </div>
                </div>
             </div>

             {/* Head to Head History */}
             <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                 <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4 flex items-center">
                     <History className="mr-2 text-slate-500" size={20} /> Head-to-Head History
                 </h3>
                 <div className="space-y-3">
                     {[1,2,3].map(i => (
                         <div key={i} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg text-sm">
                             <div className="flex items-center text-slate-500">
                                 <span className="font-mono text-xs mr-3">Mar {10+i}</span>
                                 <span className="uppercase font-bold text-[10px] bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded">BGIS QF</span>
                             </div>
                             <div className="flex items-center space-x-3">
                                 <span className={`font-bold ${i === 1 ? 'text-green-500' : 'text-slate-700 dark:text-slate-300'}`}>{match.teamA.shortName}</span>
                                 <span className="font-mono text-slate-400 text-xs">{i === 1 ? '18 - 12' : '10 - 22'}</span>
                                 <span className={`font-bold ${i !== 1 ? 'text-green-500' : 'text-slate-700 dark:text-slate-300'}`}>{match.teamB.shortName}</span>
                             </div>
                         </div>
                     ))}
                 </div>
                 <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-center">
                     <div className="text-xs font-bold text-slate-500 uppercase flex items-center space-x-4">
                         <span>{match.teamA.shortName} 3 Wins</span>
                         <div className="h-1.5 w-24 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                             <div className="h-full bg-gamepedia-blue w-3/5"></div>
                         </div>
                         <span>{match.teamB.shortName} 2 Wins</span>
                     </div>
                 </div>
             </div>

             {/* Map Veto Visualizer */}
             <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                 <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4">Map Veto Process</h3>
                 <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                     {MOCK_VETO.map((veto, i) => (
                         <div key={i} className={`flex flex-col items-center p-3 rounded-lg border ${veto.status === 'ban' ? 'bg-red-50 border-red-200 dark:bg-red-900/10 dark:border-red-900/50' : veto.status === 'pick' ? 'bg-green-50 border-green-200 dark:bg-green-900/10 dark:border-green-900/50' : 'bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-700'}`}>
                             <div className="mb-2">
                                 {veto.status === 'ban' && <Ban size={20} className="text-red-500" />}
                                 {veto.status === 'pick' && <CheckCircle size={20} className="text-green-500" />}
                                 {veto.status === 'decider' && <Activity size={20} className="text-slate-400" />}
                             </div>
                             <span className="font-bold text-sm text-slate-800 dark:text-slate-200">{veto.map}</span>
                             <span className="text-[10px] text-slate-500 uppercase font-bold mt-1">{veto.team}</span>
                         </div>
                     ))}
                 </div>
             </div>

             {/* Gemini AI Analysis Section */}
             <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 relative overflow-hidden transition-colors duration-200">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                   <Bot size={64} className="text-slate-900 dark:text-white" />
                </div>
                <h3 className="font-heading font-bold text-lg flex items-center space-x-2 text-gamepedia-dark dark:text-white mb-4">
                   <Bot className="text-gamepedia-blue" />
                   <span>AI Analyst</span>
                </h3>

                {!analysis && !loading && (
                    <div className="text-center py-6">
                       <p className="text-slate-500 dark:text-slate-400 mb-4">Get real-time tactical insights and win predictions powered by Gemini AI.</p>
                       <button 
                         onClick={handleGetAnalysis}
                         className="bg-gradient-to-r from-indigo-600 to-gamepedia-blue text-white px-6 py-2 rounded-full font-bold hover:shadow-lg transition-shadow"
                       >
                          Generate Analysis
                       </button>
                    </div>
                )}

                {loading && (
                    <div className="flex items-center justify-center py-8 space-x-3 text-slate-500 dark:text-slate-400 animate-pulse">
                        <Activity className="animate-spin" />
                        <span>Analyzing team stats and map history...</span>
                    </div>
                )}

                {analysis && (
                    <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-100 dark:border-slate-700">
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">{analysis}</p>
                        <div className="mt-3 flex justify-end">
                             <button onClick={handleGetAnalysis} className="text-xs text-gamepedia-blue hover:underline">Refresh Analysis</button>
                        </div>
                    </div>
                )}
             </div>
          </div>

          {/* Sidebar Stats & Chat */}
          <div className="space-y-6">
             {/* Live Chat Module */}
             <LiveChat matchId={match.id} teamA={match.teamA.name} teamB={match.teamB.name} />

             {/* Betting Card */}
             <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-5 text-white shadow-lg border border-slate-700">
                <h3 className="font-bold text-sm text-yellow-400 mb-3 flex items-center uppercase tracking-wide">
                   <Coins size={16} className="mr-2" /> 
                   {match.status === 'Finished' ? 'Prediction Results' : 'Live Prediction Market'}
                </h3>
                <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                   {match.status === 'Finished' 
                    ? 'Markets closed. Points distributed to winners.'
                    : 'Predict the winner and earn ranking points. Market closes soon.'
                   }
                </p>
                
                <div className="grid grid-cols-2 gap-3 mb-4">
                     <button 
                        disabled={match.status === 'Finished'}
                        onClick={() => openBetModal({ id: match.teamA.id, name: match.teamA.name, odds: teamAOdds })}
                        className={`rounded-lg p-2 text-center transition-colors ${match.winnerId === match.teamA.id ? 'bg-green-900/50 border border-green-500' : 'bg-slate-700 hover:bg-slate-600'}`}
                     >
                         <div className="text-xs text-slate-400 mb-1">{match.teamA.shortName}</div>
                         <div className="font-bold text-green-400">{teamAOdds}x</div>
                     </button>
                     <button 
                        disabled={match.status === 'Finished'}
                        onClick={() => openBetModal({ id: match.teamB.id, name: match.teamB.name, odds: teamBOdds })}
                        className={`rounded-lg p-2 text-center transition-colors ${match.winnerId === match.teamB.id ? 'bg-green-900/50 border border-green-500' : 'bg-slate-700 hover:bg-slate-600'}`}
                     >
                         <div className="text-xs text-slate-400 mb-1">{match.teamB.shortName}</div>
                         <div className="font-bold text-green-400">{teamBOdds}x</div>
                     </button>
                </div>

                <button className="w-full py-2 bg-gamepedia-orange hover:bg-orange-600 text-white font-bold text-sm rounded transition-colors shadow-md">
                   View Leaderboard
                </button>
             </div>

             {/* MVP Voting */}
             <MVPVote teamA={match.teamA} teamB={match.teamB} />

             <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-5 transition-colors duration-200">
                <h3 className="font-bold text-sm uppercase text-slate-500 dark:text-slate-400 tracking-wider mb-4">Map Stats ({match.map})</h3>
                
                {/* Stat Row */}
                <div className="space-y-4">
                   <div>
                      <div className="flex justify-between text-xs font-semibold mb-1 text-slate-600 dark:text-slate-300">
                         <span>Win Rate</span>
                      </div>
                      <div className="flex items-center space-x-2">
                         <div className="h-2 bg-blue-500 rounded-l-full w-[65%]"></div>
                         <div className="h-2 bg-orange-500 rounded-r-full w-[35%]"></div>
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                         <span>Team A (65%)</span>
                         <span>Team B (35%)</span>
                      </div>
                   </div>

                   <div>
                      <div className="flex justify-between text-xs font-semibold mb-1 text-slate-600 dark:text-slate-300">
                         <span>First Blood %</span>
                      </div>
                      <div className="flex items-center space-x-2">
                         <div className="h-2 bg-blue-500 rounded-l-full w-[40%]"></div>
                         <div className="h-2 bg-orange-500 rounded-r-full w-[60%]"></div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
       </div>

       {selectedTeam && (
           <BettingModal 
                isOpen={isBetModalOpen} 
                onClose={() => setIsBetModalOpen(false)}
                teamName={selectedTeam.name}
                teamId={selectedTeam.id}
                matchId={match.id}
                odds={selectedTeam.odds}
           />
       )}
    </div>
  );
};
