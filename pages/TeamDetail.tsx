
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Trophy, Users, ArrowRightLeft, MapPin, Calendar, Activity, TrendingUp, Map } from 'lucide-react';
import { MOCK_TEAMS, MOCK_MATCHES } from '../constants';
import { Infobox } from '../components/Infobox';

export const TeamDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const team = MOCK_TEAMS[id || ''] || MOCK_TEAMS['soul']; // Fallback for demo/dev

  // Filter matches for this team
  const teamMatches = MOCK_MATCHES.filter(m => m.teamA.id === team.id || m.teamB.id === team.id)
                                  .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

  // Calculate Form Guide (Last 5 matches)
  const formGuide = teamMatches.slice(0, 5).map(m => {
      if (m.status !== 'Finished') return null;
      return m.winnerId === team.id ? 'W' : 'L';
  }).filter(Boolean);

  // If not enough data, fill with mock
  while (formGuide.length < 5) {
      formGuide.push(Math.random() > 0.4 ? 'W' : 'L');
  }

  const getRegionFlag = (region: string) => {
      if (region.includes('India')) return '🇮🇳';
      if (region.includes('Korea')) return '🇰🇷';
      if (region.includes('Global')) return '🌍';
      if (region.includes('China')) return '🇨🇳';
      return '🏳️';
  };

  // Mock Map Stats based on team ID
  const mapStats = [
      { map: 'Erangel', winRate: team.id === 'soul' ? 45 : 20, played: 50 },
      { map: 'Miramar', winRate: team.id === 'godl' ? 40 : 25, played: 45 },
      { map: 'Sanhok', winRate: 15, played: 20 },
      { map: 'Vikendi', winRate: 30, played: 30 },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-8 animate-fade-in">
      {/* Main Content */}
      <div className="flex-1 min-w-0">
         {/* Header */}
         <div className="mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 bg-white dark:bg-slate-800 rounded-xl p-2 shadow-sm border border-slate-200 dark:border-slate-700">
                        <img src={team.logoUrl} alt={team.name} className="w-full h-full object-contain" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-heading font-bold text-slate-900 dark:text-white">{team.name}</h1>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-slate-500 dark:text-slate-400">
                            <span className="flex items-center font-medium text-slate-700 dark:text-slate-200">
                                <span className="text-lg mr-1.5">{getRegionFlag(team.region)}</span> {team.region}
                            </span>
                            <span className="flex items-center"><Users size={16} className="mr-1" /> {team.roster?.length || 0} Active Players</span>
                        </div>
                    </div>
                </div>
                
                {/* Form Guide */}
                <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Recent Form</span>
                    <div className="flex space-x-1.5">
                        {formGuide.map((result, i) => (
                            <div 
                                key={i} 
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                                    result === 'W' ? 'bg-green-500 shadow-lg shadow-green-500/30' : 'bg-red-500 opacity-80'
                                }`}
                            >
                                {result}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
         </div>

         <div className="space-y-8">
            {/* Roster Section */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center">
                        <Users className="mr-2 text-gamepedia-blue" size={20} /> Active Roster
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-medium">
                            <tr>
                                <th className="px-6 py-3">ID</th>
                                <th className="px-6 py-3">Name</th>
                                <th className="px-6 py-3">Role</th>
                                <th className="px-6 py-3">Join Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {team.roster && team.roster.map(player => (
                                <tr key={player.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                                        <Link to={`/player/${player.id}`} className="hover:text-gamepedia-blue">{player.handle}</Link>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{player.name}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded text-xs font-bold uppercase">{player.role}</span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 italic">2024-01-01</td>
                                </tr>
                            ))}
                             {(!team.roster || team.roster.length === 0) && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500">No active roster found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Map Statistics */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-6 flex items-center">
                    <Map className="mr-2 text-purple-500" size={20} /> Map Performance
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {mapStats.map(stat => (
                        <div key={stat.map} className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="font-bold text-slate-700 dark:text-slate-300">{stat.map}</span>
                                <span className="text-slate-500">{stat.winRate}% Win Rate</span>
                            </div>
                            <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div 
                                    className={`h-full rounded-full ${stat.winRate >= 40 ? 'bg-green-500' : stat.winRate >= 25 ? 'bg-blue-500' : 'bg-orange-500'}`} 
                                    style={{ width: `${stat.winRate}%` }}
                                ></div>
                            </div>
                            <div className="text-xs text-slate-400 text-right">{stat.played} matches played</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Achievements Section */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4 flex items-center">
                    <Trophy className="mr-2 text-amber-500" size={20} /> Team Achievements
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {team.achievements && team.achievements.map((ach, idx) => (
                        <div key={idx} className="flex items-center p-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/30 rounded-lg">
                            <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400 mr-4 shrink-0">
                                <Trophy size={18} />
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 dark:text-white text-sm">{ach}</h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400">1st Place • S-Tier</p>
                            </div>
                        </div>
                    ))}
                     {(!team.achievements || team.achievements.length === 0) && (
                        <p className="text-slate-500 italic">No major achievements recorded.</p>
                    )}
                </div>
            </div>

            {/* Transfer History Section */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                 <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center">
                        <ArrowRightLeft className="mr-2 text-slate-500" size={20} /> Transfer History
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-medium">
                            <tr>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">Player</th>
                                <th className="px-6 py-3">Action</th>
                                <th className="px-6 py-3">From/To</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {team.transferHistory && team.transferHistory.map((transfer, idx) => (
                                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="px-6 py-4 text-slate-500 font-mono text-xs">{transfer.date}</td>
                                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{transfer.player}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                                            transfer.action === 'Joined' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 
                                            transfer.action === 'Left' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                            'bg-slate-100 text-slate-600'
                                        }`}>
                                            {transfer.action}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{transfer.fromTo || '-'}</td>
                                </tr>
                            ))}
                             {(!team.transferHistory || team.transferHistory.length === 0) && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500">No transfer history available.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Recent Matches */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4 flex items-center">
                    <Calendar className="mr-2 text-slate-500" size={20} /> Recent Matches
                </h3>
                 <div className="space-y-3">
                    {teamMatches.length > 0 ? teamMatches.map(match => (
                        <Link to={`/match/${match.id}`} key={match.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors border border-slate-100 dark:border-slate-700">
                             <div className="flex items-center space-x-3">
                                <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                                    match.winnerId === team.id ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 
                                    match.winnerId && match.winnerId !== team.id ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                    'bg-slate-200 text-slate-600'
                                }`}>
                                    {match.winnerId === team.id ? 'W' : match.winnerId ? 'L' : '-'}
                                </span>
                                <span className="text-sm text-slate-500">{new Date(match.startTime).toLocaleDateString()}</span>
                                <span className="font-bold text-slate-900 dark:text-white">vs {match.teamA.id === team.id ? match.teamB.name : match.teamA.name}</span>
                             </div>
                             <span className="font-mono text-sm font-bold text-slate-600 dark:text-slate-400">
                                {match.scoreA} : {match.scoreB}
                             </span>
                        </Link>
                    )) : (
                        <p className="text-slate-500 italic">No matches played recently.</p>
                    )}
                 </div>
            </div>
         </div>
      </div>

      {/* Sidebar Infobox */}
      <Infobox 
        title={team.name}
        subtitle="Professional Organization"
        image={team.logoUrl}
        data={[
            { label: "Region", value: team.region },
            { label: "Total Winnings", value: <span className="text-green-600 dark:text-green-400 font-bold">{team.totalWinnings}</span> },
            { label: "Founded", value: "2019" }, // Mock data
            { label: "Owner", value: "Mortal" }, // Mock data
            { label: "Captain", value: team.roster?.[0]?.handle || "N/A" },
            { label: "Coach", value: "Amit" }, // Mock data
            { label: "Status", value: <span className="text-green-500 font-bold">Active</span> }
        ]}
      />
    </div>
  );
};
