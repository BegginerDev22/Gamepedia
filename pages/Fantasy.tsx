import React, { useState, useMemo } from 'react';
import { Users, Search, Plus, Minus, AlertCircle, CheckCircle, Trophy, Coins, User, Globe, Crown } from 'lucide-react';
import { MOCK_PLAYERS, MOCK_TEAMS } from '../constants';
import { FantasyPlayer } from '../types';
import { useUser } from '../contexts/UserContext';

// Helper to calculate player cost based on K/D (Mock algorithm)
const calculateCost = (kd: number) => Math.min(Math.max(Math.round(kd * 5 + 4), 8), 25);

// Mock Leaderboard Data
const FANTASY_LEADERBOARD = [
    { rank: 1, user: 'BGMI_King', points: 1250, badge: 'Pro' },
    { rank: 2, user: 'SniperWolf', points: 1180, badge: 'Elite' },
    { rank: 3, user: 'ZoneMaster', points: 1150, badge: 'Elite' },
    { rank: 4, user: 'CamperOp', points: 980, badge: 'Rookie' },
    { rank: 5, user: 'RushB', points: 920, badge: 'Rookie' },
];

export const FantasyPage: React.FC = () => {
  const { points, addPoints } = useUser();
  const [activeTab, setActiveTab] = useState<'my-team' | 'leaderboard'>('my-team');
  const [teamName, setTeamName] = useState('My Dream Team');
  const [selectedPlayers, setSelectedPlayers] = useState<FantasyPlayer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const MAX_BUDGET = 55;
  const MAX_PLAYERS = 4;
  const ENTRY_FEE = 500;

  // Prepare Player Pool
  const playerPool: FantasyPlayer[] = useMemo(() => {
    return Object.values(MOCK_PLAYERS).map(p => ({
      ...p,
      cost: calculateCost(p.stats?.kd || 1.0),
      selected: selectedPlayers.some(sp => sp.id === p.id)
    }));
  }, [selectedPlayers]);

  const filteredPool = playerPool.filter(p => 
    p.handle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentCost = selectedPlayers.reduce((sum, p) => sum + p.cost, 0);
  const remainingBudget = MAX_BUDGET - currentCost;

  const handleSelect = (player: FantasyPlayer) => {
    if (selectedPlayers.length >= MAX_PLAYERS) return;
    if (currentCost + player.cost > MAX_BUDGET) {
        alert("Not enough budget!");
        return;
    }
    setSelectedPlayers([...selectedPlayers, player]);
    setIsSaved(false);
  };

  const handleRemove = (playerId: string) => {
    setSelectedPlayers(selectedPlayers.filter(p => p.id !== playerId));
    setIsSaved(false);
  };

  const handleSaveTeam = () => {
      if (selectedPlayers.length !== MAX_PLAYERS) {
          alert(`You need exactly ${MAX_PLAYERS} players.`);
          return;
      }
      if (points < ENTRY_FEE) {
          alert("Insufficient points to pay entry fee.");
          return;
      }
      
      // Mock Transaction
      addPoints(-ENTRY_FEE);
      setIsSaved(true);
      // In a real app, save to backend here
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900 to-indigo-900 rounded-xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
            <Trophy size={120} />
        </div>
        <div className="relative z-10">
            <h1 className="text-3xl font-heading font-bold flex items-center mb-2">
                <Trophy className="mr-3 text-yellow-400" /> BGMI Fantasy League
            </h1>
            <p className="text-purple-200 max-w-xl">
                Draft your ultimate squad of 4 players within the budget. Compete in the global leaderboard and win massive point rewards based on real-match performance.
            </p>
            <div className="flex items-center mt-6 space-x-6">
                <div className="flex flex-col">
                    <span className="text-xs uppercase font-bold text-purple-300">Entry Fee</span>
                    <span className="font-mono text-xl font-bold flex items-center"><Coins size={16} className="mr-1 text-yellow-400"/> {ENTRY_FEE}</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-xs uppercase font-bold text-purple-300">Prize Pool</span>
                    <span className="font-mono text-xl font-bold text-green-400">50,000 PTS</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-xs uppercase font-bold text-purple-300">Contest Ends</span>
                    <span className="font-mono text-xl font-bold">24h 12m</span>
                </div>
            </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-4 border-b border-slate-200 dark:border-slate-700">
          <button 
            onClick={() => setActiveTab('my-team')}
            className={`pb-3 px-4 font-bold text-sm transition-colors border-b-2 ${activeTab === 'my-team' ? 'border-gamepedia-blue text-gamepedia-blue' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
          >
              My Team
          </button>
          <button 
            onClick={() => setActiveTab('leaderboard')}
            className={`pb-3 px-4 font-bold text-sm transition-colors border-b-2 ${activeTab === 'leaderboard' ? 'border-gamepedia-blue text-gamepedia-blue' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
          >
              Global Leaderboard
          </button>
      </div>

      {activeTab === 'my-team' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: My Team */}
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <label className="block text-xs text-slate-500 dark:text-slate-400 uppercase font-bold mb-1">Team Name</label>
                            <input 
                                type="text" 
                                value={teamName} 
                                onChange={(e) => setTeamName(e.target.value)}
                                className="bg-transparent text-2xl font-bold text-slate-900 dark:text-white border-b border-dashed border-slate-300 focus:border-gamepedia-blue outline-none w-full"
                            />
                        </div>
                        <div className="text-right">
                            <span className={`text-2xl font-mono font-bold ${remainingBudget < 10 ? 'text-red-500' : 'text-green-500'}`}>
                                {remainingBudget}
                            </span>
                            <span className="block text-xs text-slate-500 dark:text-slate-400 uppercase">Credits Left</span>
                        </div>
                    </div>

                    {/* Budget Bar */}
                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full mb-8 overflow-hidden">
                        <div 
                            className={`h-full transition-all duration-500 ${currentCost > MAX_BUDGET ? 'bg-red-500' : 'bg-gamepedia-blue'}`} 
                            style={{ width: `${(currentCost / MAX_BUDGET) * 100}%` }}
                        ></div>
                    </div>

                    {/* Selected Slots */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        {[0, 1, 2, 3].map((index) => {
                            const player = selectedPlayers[index];
                            return (
                                <div key={index} className={`border-2 border-dashed rounded-xl p-4 flex items-center transition-all ${player ? 'border-gamepedia-blue bg-blue-50 dark:bg-blue-900/20 border-solid' : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50'}`}>
                                    {player ? (
                                        <div className="flex items-center justify-between w-full">
                                            <div className="flex items-center space-x-3">
                                                <img src={player.image} alt={player.handle} className="w-12 h-12 rounded-full bg-white dark:bg-slate-800 object-cover" />
                                                <div>
                                                    <h4 className="font-bold text-slate-900 dark:text-white">{player.handle}</h4>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400">{player.role} • {player.cost} Cr</p>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => handleRemove(player.id)}
                                                className="p-1.5 bg-white dark:bg-slate-800 text-red-500 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors shadow-sm"
                                            >
                                                <Minus size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center w-full py-2 text-slate-400 dark:text-slate-500">
                                            <User size={24} className="mb-2 opacity-50" />
                                            <span className="text-sm font-medium">Empty Slot</span>
                                            <span className="text-xs">Select a player</span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <div className="border-t border-slate-100 dark:border-slate-800 pt-6 flex justify-between items-center">
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                            Selected: <span className="font-bold text-slate-900 dark:text-white">{selectedPlayers.length} / {MAX_PLAYERS}</span>
                        </div>
                        <button 
                            onClick={handleSaveTeam}
                            disabled={isSaved || selectedPlayers.length !== MAX_PLAYERS}
                            className={`px-8 py-3 rounded-lg font-bold flex items-center transition-all ${
                                isSaved 
                                ? 'bg-green-500 text-white cursor-default' 
                                : selectedPlayers.length === MAX_PLAYERS 
                                    ? 'bg-gamepedia-blue text-white hover:bg-blue-600 shadow-lg hover:shadow-blue-500/30' 
                                    : 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                            }`}
                        >
                            {isSaved ? <><CheckCircle size={18} className="mr-2" /> Entry Submitted</> : 'Submit Team'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Right: Player Pool */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col h-[600px]">
                <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-3">Player Pool</h3>
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="Search players..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gamepedia-blue dark:text-white" 
                        />
                        <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {filteredPool.map(player => (
                        <div key={player.id} className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors group">
                            <div className="flex items-center space-x-3">
                                <div className="relative">
                                    <img src={player.image} alt={player.handle} className="w-10 h-10 rounded-lg object-cover bg-slate-200 dark:bg-slate-700" />
                                    {MOCK_TEAMS[player.teamId || 'soul'] && (
                                        <img 
                                            src={MOCK_TEAMS[player.teamId || 'soul'].logoUrl} 
                                            className="absolute -bottom-1 -right-1 w-4 h-4 rounded bg-white p-0.5"
                                        />
                                    )}
                                </div>
                                <div>
                                    <p className="font-bold text-sm text-slate-900 dark:text-white">{player.handle}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{player.role}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <span className="font-mono font-bold text-sm text-slate-700 dark:text-slate-300">{player.cost} Cr</span>
                                <button 
                                    onClick={() => player.selected ? handleRemove(player.id) : handleSelect(player)}
                                    disabled={!player.selected && (selectedPlayers.length >= MAX_PLAYERS || remainingBudget < player.cost)}
                                    className={`p-1.5 rounded-full transition-colors ${
                                        player.selected 
                                        ? 'bg-red-100 text-red-500 hover:bg-red-200 dark:bg-red-900/20' 
                                        : (selectedPlayers.length >= MAX_PLAYERS || remainingBudget < player.cost)
                                            ? 'bg-slate-100 text-slate-300 cursor-not-allowed dark:bg-slate-800 dark:text-slate-600'
                                            : 'bg-blue-100 text-gamepedia-blue hover:bg-blue-200 dark:bg-blue-900/20'
                                    }`}
                                >
                                    {player.selected ? <Minus size={16} /> : <Plus size={16} />}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden animate-fade-in">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white flex items-center">
                    <Globe size={20} className="mr-2 text-gamepedia-blue" /> Global Standings
                </h3>
                <span className="text-sm text-slate-500">Updated 5m ago</span>
            </div>
            <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase text-xs tracking-wider">
                    <tr>
                        <th className="px-6 py-4 w-20 text-center">Rank</th>
                        <th className="px-6 py-4">User</th>
                        <th className="px-6 py-4">Badge</th>
                        <th className="px-6 py-4 text-right">Total Points</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {FANTASY_LEADERBOARD.map((entry, idx) => (
                        <tr key={idx} className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${entry.user === 'BGMI_King' ? 'bg-yellow-50/30 dark:bg-yellow-900/10' : ''}`}>
                            <td className="px-6 py-4 text-center">
                                {entry.rank === 1 ? <Crown size={20} className="mx-auto text-yellow-500" /> : 
                                 entry.rank === 2 ? <span className="font-bold text-slate-400">#2</span> :
                                 entry.rank === 3 ? <span className="font-bold text-orange-400">#3</span> :
                                 <span className="text-slate-500">#{entry.rank}</span>}
                            </td>
                            <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{entry.user}</td>
                            <td className="px-6 py-4">
                                <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs font-bold text-slate-600 dark:text-slate-300">
                                    {entry.badge}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right font-mono font-bold text-gamepedia-blue">
                                {entry.points.toLocaleString()}
                            </td>
                        </tr>
                    ))}
                    {/* User Rank Placeholder */}
                    <tr className="bg-slate-50 dark:bg-slate-800 border-t-2 border-slate-200 dark:border-slate-700">
                        <td className="px-6 py-4 text-center text-slate-500 font-bold">#142</td>
                        <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">You (Guest)</td>
                        <td className="px-6 py-4"><span className="px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded text-xs font-bold">Beginner</span></td>
                        <td className="px-6 py-4 text-right font-mono font-bold">0</td>
                    </tr>
                </tbody>
            </table>
        </div>
      )}
    </div>
  );
};