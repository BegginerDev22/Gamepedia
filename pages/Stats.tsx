
import React, { useState } from 'react';
import { 
  BarChart2, Trophy, Crosshair, Target, TrendingUp, 
  Search, Filter, Map, Users, Crown, ArrowUp, ArrowDown,
  PieChart
} from 'lucide-react';
import { MOCK_TEAMS } from '../constants';
import { TrendChart } from '../components/TrendChart';
import { Link } from 'react-router-dom';

// --- Mock Data for Stats ---

const PLAYER_STATS = [
    { id: 'p6', name: 'Jonathan', team: 'GodLike', matches: 45, finishes: 88, kd: 1.95, hs: '22%', rank: 1, trend: 0, history: [1.2, 1.5, 1.4, 1.8, 1.95, 1.90, 2.1] },
    { id: 'p1', name: 'Manya', team: 'Team Soul', matches: 45, finishes: 72, kd: 1.60, hs: '18%', rank: 2, trend: 1, history: [1.0, 1.1, 1.4, 1.5, 1.6, 1.55, 1.6] },
    { id: 'p10', name: 'NinjaJOD', team: 'Team XSpark', matches: 42, finishes: 81, kd: 1.92, hs: '24%', rank: 3, trend: -1, history: [1.8, 1.9, 1.85, 1.88, 1.92] },
    { id: 'p2', name: 'Nakul', team: 'Team Soul', matches: 45, finishes: 68, kd: 1.51, hs: '19%', rank: 4, trend: 2, history: [1.2, 1.3, 1.4, 1.45, 1.51] },
    { id: 'p4', name: 'Spower', team: 'Team Soul', matches: 30, finishes: 65, kd: 2.16, hs: '25%', rank: 5, trend: 5, history: [2.5, 2.3, 2.1, 2.0, 2.16] },
    { id: 'p5', name: 'Jelly', team: 'GodLike', matches: 45, finishes: 40, kd: 0.88, hs: '15%', rank: 18, trend: -2, history: [0.7, 0.8, 0.85, 0.88] },
    { id: 'p9', name: 'Shadow', team: 'Team XSpark', matches: 42, finishes: 55, kd: 1.30, hs: '20%', rank: 12, trend: 0, history: [1.1, 1.2, 1.25, 1.3] },
];

const TEAM_STATS = [
    { id: 'soul', name: 'Team Soul', matches: 45, wwcd: 8, placePts: 180, finishPts: 290, total: 470, winRate: '17.7%', pointsTrend: [20, 45, 80, 120, 150, 210, 300, 470] },
    { id: 'godl', name: 'GodLike Esports', matches: 45, wwcd: 5, placePts: 140, finishPts: 310, total: 450, winRate: '11.1%', pointsTrend: [10, 30, 60, 90, 140, 200, 350, 450] },
    { id: 'blind', name: 'Blind Esports', matches: 45, wwcd: 9, placePts: 195, finishPts: 240, total: 435, winRate: '20.0%', pointsTrend: [40, 80, 100, 150, 200, 250, 350, 435] },
    { id: 'tx', name: 'Team XSpark', matches: 42, wwcd: 4, placePts: 110, finishPts: 210, total: 320, winRate: '9.5%', pointsTrend: [10, 20, 40, 80, 120, 180, 250, 320] },
    { id: 'entity', name: 'Entity Gaming', matches: 40, wwcd: 3, placePts: 130, finishPts: 180, total: 310, winRate: '7.5%', pointsTrend: [15, 30, 50, 90, 130, 170, 240, 310] },
];

const MAP_STATS = [
    { name: 'Erangel', type: 'Classic', matches: 124, avgDuration: '28m', mostPicked: 'Pochinki', img: 'https://picsum.photos/400/200?random=50' },
    { name: 'Miramar', type: 'Desert', matches: 86, avgDuration: '30m', mostPicked: 'Pecado', img: 'https://picsum.photos/400/200?random=51' },
    { name: 'Sanhok', type: 'Rainforest', matches: 45, avgDuration: '22m', mostPicked: 'Bootcamp', img: 'https://picsum.photos/400/200?random=52' },
    { name: 'Vikendi', type: 'Snow', matches: 32, avgDuration: '26m', mostPicked: 'Villa', img: 'https://picsum.photos/400/200?random=53' },
];

// --- Components ---

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode; subtext?: string }> = ({ title, value, icon, subtext }) => (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex items-start justify-between hover:border-gamepedia-blue/50 transition-colors">
        <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">{title}</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{value}</h3>
            {subtext && <p className="text-xs text-slate-400 mt-2">{subtext}</p>}
        </div>
        <div className="p-3 bg-blue-50 dark:bg-slate-800 rounded-lg text-gamepedia-blue">
            {icon}
        </div>
    </div>
);

const KDRatioBar: React.FC<{ value: number }> = ({ value }) => {
    // Normalize mostly between 0 and 3 for BGMI standards
    const width = Math.min((value / 3) * 100, 100);
    let color = 'bg-slate-400';
    if (value >= 2.0) color = 'bg-purple-500';
    else if (value >= 1.5) color = 'bg-green-500';
    else if (value >= 1.0) color = 'bg-yellow-500';
    else color = 'bg-red-500';

    return (
        <div className="flex items-center space-x-2 w-24">
            <span className="text-xs font-mono w-8 text-right">{value.toFixed(2)}</span>
            <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${color}`} style={{ width: `${width}%` }}></div>
            </div>
        </div>
    );
};

export const StatsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'overview' | 'players' | 'teams' | 'maps'>('overview');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({ key: 'rank', direction: 'asc' });

    const filteredPlayers = PLAYER_STATS.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.team.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedPlayers = React.useMemo(() => {
        let sortableItems = [...filteredPlayers];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                let aValue: any = a[sortConfig.key as keyof typeof a];
                let bValue: any = b[sortConfig.key as keyof typeof b];

                // Handle percentage strings
                if (sortConfig.key === 'hs') {
                    aValue = parseFloat(a.hs.replace('%', ''));
                    bValue = parseFloat(b.hs.replace('%', ''));
                }

                if (aValue < bValue) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [filteredPlayers, sortConfig]);

    const requestSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'asc';
        // Default to descending for performance metrics, ascending for Rank/Name
        if (['kd', 'finishes', 'matches', 'hs'].includes(key)) {
             direction = 'desc';
        }
        
        if (sortConfig.key === key) {
             direction = sortConfig.direction === 'asc' ? 'desc' : 'asc';
        }
        setSortConfig({ key, direction });
    };

    const SortIcon = ({ column }: { column: string }) => {
        if (sortConfig.key !== column) {
            return <ArrowUp size={12} className="ml-1 inline-block opacity-0 group-hover:opacity-30" />;
        }
        return sortConfig.direction === 'asc' 
            ? <ArrowUp size={12} className="ml-1 inline-block text-gamepedia-blue" />
            : <ArrowDown size={12} className="ml-1 inline-block text-gamepedia-blue" />;
    };

    const filteredTeams = TEAM_STATS.filter(t => 
        t.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-gamepedia-dark dark:text-white flex items-center">
                        <BarChart2 className="mr-3 text-gamepedia-blue" /> Statistics Hub
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Comprehensive data analysis for BGIS 2024 Season.</p>
                </div>
                
                {/* Tab Navigation */}
                <div className="flex bg-white dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-700 overflow-x-auto">
                    {[
                        { id: 'overview', label: 'Overview', icon: TrendingUp },
                        { id: 'players', label: 'Player Stats', icon: Crosshair },
                        { id: 'teams', label: 'Team Standings', icon: Users },
                        { id: 'maps', label: 'Map Analysis', icon: Map },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                                activeTab === tab.id 
                                ? 'bg-slate-100 dark:bg-slate-800 text-gamepedia-blue shadow-sm' 
                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                            }`}
                        >
                            <tab.icon size={16} className="mr-2" /> {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            <div className="min-h-[500px]">
                
                {activeTab === 'overview' && (
                    <div className="space-y-8 animate-fade-in">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatCard 
                                title="Highest Prize Pool" 
                                value="₹2.5 Cr" 
                                subtext="BGIS 2024: The Grind"
                                icon={<Trophy size={24} />} 
                            />
                            <StatCard 
                                title="Most Picked Weapon" 
                                value="M416" 
                                subtext="Used in 42% of kills"
                                icon={<Crosshair size={24} />} 
                            />
                            <StatCard 
                                title="Top Org (Winnings)" 
                                value="Team Soul" 
                                subtext="₹5.25 Cr Total Earnings"
                                icon={<Crown size={24} />} 
                            />
                            <StatCard 
                                title="Longest Kill" 
                                value="428m" 
                                subtext="Snax (BGIS Semis)"
                                icon={<Target size={24} />} 
                            />
                        </div>

                        {/* Advanced Visuals Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                             <div>
                                <TrendChart 
                                    title="Top Teams Points Progression (BGIS 2024)"
                                    data={TEAM_STATS[0].pointsTrend} 
                                    labels={['Wk1', 'Wk2', 'Wk3', 'Semis', 'F-D1', 'F-D2', 'F-D3', 'Final']}
                                    color="#2B5DF5"
                                />
                             </div>
                             <div>
                                <TrendChart 
                                    title="GodLike Points Progression"
                                    data={TEAM_STATS[1].pointsTrend} 
                                    labels={['Wk1', 'Wk2', 'Wk3', 'Semis', 'F-D1', 'F-D2', 'F-D3', 'Final']}
                                    color="#FF6B35"
                                />
                             </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Top Fraggers Spotlight */}
                            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">Top Fraggers (Season)</h3>
                                    <button 
                                        onClick={() => setActiveTab('players')}
                                        className="text-sm text-gamepedia-blue hover:underline"
                                    >
                                        View All
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    {sortedPlayers.slice(0, 5).map((player, idx) => (
                                        <Link to={`/player/${player.id}`} key={player.id} className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 last:border-0 last:pb-0 group cursor-pointer">
                                            <div className="flex items-center space-x-3">
                                                <span className={`w-6 h-6 flex items-center justify-center rounded font-bold text-xs ${
                                                    idx === 0 ? 'bg-yellow-100 text-yellow-700' : 
                                                    idx === 1 ? 'bg-slate-100 text-slate-700' : 
                                                    idx === 2 ? 'bg-orange-100 text-orange-700' : 'text-slate-400'
                                                }`}>
                                                    {idx + 1}
                                                </span>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-gamepedia-blue transition-colors">{player.name}</span>
                                                    <span className="text-xs text-slate-500">{player.team}</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className="block font-bold text-slate-900 dark:text-white">{player.finishes}</span>
                                                <span className="text-[10px] text-slate-400 uppercase">Finishes</span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Win Rates Map */}
                            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4 flex items-center">
                                    <PieChart size={20} className="mr-2 text-gamepedia-blue" /> Map Win Distribution
                                </h3>
                                <div className="space-y-4">
                                    {[
                                        { name: 'Erangel', val: 45, color: 'bg-blue-500' },
                                        { name: 'Miramar', val: 30, color: 'bg-orange-500' },
                                        { name: 'Sanhok', val: 15, color: 'bg-green-500' },
                                        { name: 'Vikendi', val: 10, color: 'bg-indigo-500' }
                                    ].map(map => (
                                        <div key={map.name}>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-slate-700 dark:text-slate-300">{map.name}</span>
                                                <span className="text-slate-500">{map.val}%</span>
                                            </div>
                                            <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                <div className={`h-full rounded-full ${map.color}`} style={{ width: `${map.val}%` }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700">
                                    <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                                        "Erangel remains the most decisive map, with teams controlling Pochinki having a 25% higher win rate."
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'players' && (
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden animate-fade-in">
                            <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row justify-between gap-4">
                                <div className="flex items-center space-x-2">
                                    <h3 className="font-bold text-lg text-slate-900 dark:text-white">Player Leaderboards</h3>
                                    <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 text-xs rounded">Season 2024</span>
                                </div>
                                <div className="relative w-full sm:w-64">
                                    <input 
                                        type="text" 
                                        placeholder="Search player or team..." 
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gamepedia-blue dark:text-white" 
                                    />
                                    <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
                                </div>
                            </div>
                            
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-medium uppercase text-xs tracking-wider">
                                        <tr>
                                            <th 
                                                className="px-6 py-4 w-16 text-center cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors group select-none"
                                                onClick={() => requestSort('rank')}
                                            >
                                                Rank <SortIcon column="rank" />
                                            </th>
                                            <th 
                                                className="px-6 py-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors group select-none"
                                                onClick={() => requestSort('name')}
                                            >
                                                Player <SortIcon column="name" />
                                            </th>
                                            <th 
                                                className="px-6 py-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors group select-none"
                                                onClick={() => requestSort('team')}
                                            >
                                                Team <SortIcon column="team" />
                                            </th>
                                            <th 
                                                className="px-6 py-4 text-center cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors group select-none"
                                                onClick={() => requestSort('matches')}
                                            >
                                                Matches <SortIcon column="matches" />
                                            </th>
                                            <th 
                                                className="px-6 py-4 text-center cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors group select-none"
                                                onClick={() => requestSort('finishes')}
                                            >
                                                Finishes <SortIcon column="finishes" />
                                            </th>
                                            <th 
                                                className="px-6 py-4 w-32 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors group select-none"
                                                onClick={() => requestSort('kd')}
                                            >
                                                K/D Ratio <SortIcon column="kd" />
                                            </th>
                                            <th className="px-6 py-4 w-48 text-center">Performance Trend</th>
                                            <th 
                                                className="px-6 py-4 text-right cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors group select-none"
                                                onClick={() => requestSort('hs')}
                                            >
                                                Headshot % <SortIcon column="hs" />
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {sortedPlayers.map((player) => (
                                            <tr key={player.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                <td className="px-6 py-4 text-center">
                                                    <div className="flex flex-col items-center">
                                                        <span className={`font-bold ${player.rank <= 3 ? 'text-gamepedia-blue' : 'text-slate-500'}`}>#{player.rank}</span>
                                                        {player.trend > 0 && <span className="text-[10px] text-green-500 flex items-center"><ArrowUp size={10} />{player.trend}</span>}
                                                        {player.trend < 0 && <span className="text-[10px] text-red-500 flex items-center"><ArrowDown size={10} />{Math.abs(player.trend)}</span>}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                                                    <Link to={`/player/${player.id}`} className="hover:text-gamepedia-blue transition-colors">
                                                        {player.name}
                                                    </Link>
                                                </td>
                                                <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{player.team}</td>
                                                <td className="px-6 py-4 text-center text-slate-600 dark:text-slate-400">{player.matches}</td>
                                                <td className="px-6 py-4 text-center font-mono font-bold text-slate-900 dark:text-white">{player.finishes}</td>
                                                <td className="px-6 py-4">
                                                    <KDRatioBar value={player.kd} />
                                                </td>
                                                <td className="px-6 py-4">
                                                    {player.history && (
                                                        <div className="h-10 w-32 mx-auto">
                                                            <TrendChart data={player.history} height={40} color={player.kd > 1.5 ? '#2ECC71' : '#FF4D4F'} />
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-right font-mono text-slate-600 dark:text-slate-400">{player.hs}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'teams' && (
                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden animate-fade-in">
                         <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row justify-between gap-4">
                            <div className="flex items-center space-x-2">
                                <h3 className="font-bold text-lg text-slate-900 dark:text-white">Team Performance</h3>
                            </div>
                            <div className="relative w-full sm:w-64">
                                <input 
                                    type="text" 
                                    placeholder="Search team..." 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gamepedia-blue dark:text-white" 
                                />
                                <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
                            </div>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-medium uppercase text-xs tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4 w-16 text-center">Rank</th>
                                        <th className="px-6 py-4">Team</th>
                                        <th className="px-6 py-4 text-center">Matches</th>
                                        <th className="px-6 py-4 text-center">WWCD</th>
                                        <th className="px-6 py-4 text-center">Place Pts</th>
                                        <th className="px-6 py-4 text-center">Finish Pts</th>
                                        <th className="px-6 py-4 text-center">Win %</th>
                                        <th className="px-6 py-4 text-right">Total Pts</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {filteredTeams.map((team, idx) => (
                                        <tr key={team.id} className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${idx < 3 ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}`}>
                                            <td className="px-6 py-4 text-center font-bold text-slate-500 dark:text-slate-400">#{idx + 1}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded flex items-center justify-center text-xs font-bold">
                                                        {team.name.substring(0, 2).toUpperCase()}
                                                    </div>
                                                    <span className="font-bold text-slate-900 dark:text-white">{team.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center text-slate-600 dark:text-slate-400">{team.matches}</td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="inline-block px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded font-bold text-xs">
                                                    {team.wwcd}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center text-slate-600 dark:text-slate-400">{team.placePts}</td>
                                            <td className="px-6 py-4 text-center text-slate-600 dark:text-slate-400">{team.finishPts}</td>
                                            <td className="px-6 py-4 text-center text-slate-600 dark:text-slate-400">{team.winRate}</td>
                                            <td className="px-6 py-4 text-right font-mono font-bold text-lg text-gamepedia-blue">{team.total}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'maps' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                        {MAP_STATS.map((map) => (
                            <div key={map.name} className="group bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden hover:border-gamepedia-blue transition-all">
                                <div className="h-48 relative overflow-hidden">
                                    <img src={map.img} alt={map.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80"></div>
                                    <div className="absolute bottom-4 left-4">
                                        <h3 className="text-2xl font-heading font-bold text-white">{map.name}</h3>
                                        <span className="text-sm text-slate-300">{map.type} Map</span>
                                    </div>
                                </div>
                                <div className="p-6 grid grid-cols-3 gap-4">
                                    <div className="text-center border-r border-slate-100 dark:border-slate-800 last:border-0">
                                        <span className="block text-2xl font-bold text-slate-900 dark:text-white">{map.matches}</span>
                                        <span className="text-[10px] uppercase tracking-wide text-slate-500">Matches</span>
                                    </div>
                                    <div className="text-center border-r border-slate-100 dark:border-slate-800 last:border-0">
                                        <span className="block text-2xl font-bold text-slate-900 dark:text-white">{map.avgDuration}</span>
                                        <span className="text-[10px] uppercase tracking-wide text-slate-500">Avg Duration</span>
                                    </div>
                                    <div className="text-center">
                                        <span className="block text-sm font-bold text-gamepedia-blue mt-1.5 mb-0.5">{map.mostPicked}</span>
                                        <span className="text-[10px] uppercase tracking-wide text-slate-500">Hot Drop</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
