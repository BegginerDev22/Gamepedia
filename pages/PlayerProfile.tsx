
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  User, Crosshair, Award, Instagram, Youtube, Twitter, MapPin, Activity, 
  Settings, Hexagon
} from 'lucide-react';
import { MOCK_PLAYERS, MOCK_TEAMS } from '../constants';
import { TrendChart } from '../components/TrendChart';
import { PlayerSettingsView } from '../components/PlayerSettingsView';
import { RadarChart } from '../components/RadarChart';

export const PlayerProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  // Fallback to a default player if id not found
  const player = MOCK_PLAYERS[id || ''] || MOCK_PLAYERS['p1']; 
  const team = player.teamId ? MOCK_TEAMS[player.teamId] : null;

  const [activeTab, setActiveTab] = useState<'overview' | 'settings'>('overview');

  // Mock Attributes for Radar Chart (In a real app, these would be in the DB)
  const playerAttributes = [
      { label: 'Mechanics', value: player.stats ? Math.min(player.stats.kd * 20 + 50, 95) : 70, fullMark: 100 },
      { label: 'Game IQ', value: player.role === 'IGL' ? 95 : 80, fullMark: 100 },
      { label: 'Survival', value: 75, fullMark: 100 },
      { label: 'Support', value: player.role === 'Support' ? 90 : 60, fullMark: 100 },
      { label: 'Aggression', value: player.role === 'Assaulter' ? 95 : 70, fullMark: 100 },
      { label: 'Clutch', value: 88, fullMark: 100 },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* Hero Section */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
         <div className="h-48 bg-gradient-to-r from-slate-900 to-slate-800 relative">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30"></div>
             {/* Team Background Logo */}
             {team && (
                 <img src={team.logoUrl} alt="" className="absolute right-10 top-1/2 -translate-y-1/2 w-64 h-64 opacity-10 grayscale" />
             )}
         </div>
         
         <div className="px-8 pb-4 relative">
             <div className="flex flex-col md:flex-row items-start md:items-end -mt-16 mb-6 gap-6">
                 {/* Avatar */}
                 <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white dark:border-slate-900 bg-slate-200 overflow-hidden shadow-lg z-10 shrink-0">
                     <img src={player.image} alt={player.handle} className="w-full h-full object-cover" />
                 </div>
                 
                 {/* Basic Info */}
                 <div className="flex-1 z-10 mb-2">
                     <div className="flex items-center space-x-3 mb-1">
                        <h1 className="text-4xl font-heading font-bold text-slate-900 dark:text-white">{player.handle}</h1>
                        {team && (
                            <span className="px-2 py-1 bg-gamepedia-blue text-white text-xs font-bold rounded uppercase tracking-wider">
                                {team.shortName}
                            </span>
                        )}
                     </div>
                     <h2 className="text-lg text-slate-500 dark:text-slate-400 font-medium mb-2">{player.name}</h2>
                     <div className="flex items-center space-x-4 text-sm text-slate-600 dark:text-slate-300">
                         <span className="flex items-center"><User size={16} className="mr-1.5"/> {player.role}</span>
                         {team && <span className="flex items-center"><MapPin size={16} className="mr-1.5"/> {team.region}</span>}
                     </div>
                     {player.bio && (
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-3 max-w-2xl leading-relaxed italic">
                            "{player.bio}"
                        </p>
                     )}
                 </div>

                 {/* Socials */}
                 <div className="flex space-x-3 z-10">
                     {player.socials?.instagram && (
                         <a href="#" className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-pink-600 hover:bg-pink-50 dark:hover:bg-slate-700 transition-colors">
                             <Instagram size={20} />
                         </a>
                     )}
                     {player.socials?.twitter && (
                         <a href="#" className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors">
                             <Twitter size={20} />
                         </a>
                     )}
                     {player.socials?.youtube && (
                         <a href="#" className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-red-600 hover:bg-red-50 dark:hover:bg-slate-700 transition-colors">
                             <Youtube size={20} />
                         </a>
                     )}
                 </div>
             </div>

             {/* Tabs */}
             <div className="flex space-x-8 border-t border-slate-100 dark:border-slate-800 pt-4">
                <button 
                    onClick={() => setActiveTab('overview')}
                    className={`text-sm font-bold uppercase tracking-wider pb-2 border-b-2 transition-colors ${activeTab === 'overview' ? 'border-gamepedia-blue text-gamepedia-blue' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                >
                    Overview
                </button>
                <button 
                    onClick={() => setActiveTab('settings')}
                    className={`text-sm font-bold uppercase tracking-wider pb-2 border-b-2 transition-colors flex items-center ${activeTab === 'settings' ? 'border-gamepedia-blue text-gamepedia-blue' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                >
                    <Settings size={16} className="mr-1.5" /> Settings & Sensitivity
                </button>
             </div>
         </div>
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
            {/* Stats Column */}
            <div className="lg:col-span-2 space-y-8">
                
                {/* Stats Grid */}
                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                <h3 className="font-bold text-lg text-gamepedia-dark dark:text-white mb-6 flex items-center">
                    <Activity className="mr-2 text-gamepedia-blue" /> Performance Stats
                </h3>
                {player.stats ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700">
                            <span className="block text-3xl font-mono font-bold text-slate-900 dark:text-white">{player.stats.kd}</span>
                            <span className="text-xs text-slate-500 uppercase tracking-wide font-semibold">K/D Ratio</span>
                        </div>
                        <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700">
                            <span className="block text-3xl font-mono font-bold text-slate-900 dark:text-white">{player.stats.finishes}</span>
                            <span className="text-xs text-slate-500 uppercase tracking-wide font-semibold">Total Finishes</span>
                        </div>
                        <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700">
                            <span className="block text-3xl font-mono font-bold text-slate-900 dark:text-white">{player.stats.hsPercentage}</span>
                            <span className="text-xs text-slate-500 uppercase tracking-wide font-semibold">Headshot %</span>
                        </div>
                        <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700">
                            <span className="block text-3xl font-mono font-bold text-slate-900 dark:text-white">{player.stats.avgDamage}</span>
                            <span className="text-xs text-slate-500 uppercase tracking-wide font-semibold">Avg Damage</span>
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-slate-500 py-8">Stats unavailable for this player.</div>
                )}
                
                {player.stats?.kdHistory && (
                    <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                        <TrendChart 
                            title="K/D Trend (Last 6 Months)" 
                            data={player.stats.kdHistory} 
                            labels={['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar']}
                            color="#10B981"
                            height={200}
                        />
                    </div>
                )}
                </div>
                
                {/* Match History */}
                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                    <h3 className="font-bold text-lg text-gamepedia-dark dark:text-white mb-6 flex items-center">
                    <Crosshair className="mr-2 text-gamepedia-blue" /> Recent Matches
                </h3>
                {player.matchHistory && player.matchHistory.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-medium">
                                <tr>
                                    <th className="px-4 py-3 rounded-l-lg">Date</th>
                                    <th className="px-4 py-3">Tournament</th>
                                    <th className="px-4 py-3 text-center">Finishes</th>
                                    <th className="px-4 py-3 text-right rounded-r-lg">Damage</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {player.matchHistory.map((match, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{match.date}</td>
                                        <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                                            <Link to={`/match/${match.matchId}`} className="hover:text-gamepedia-blue hover:underline">
                                                {match.tournament}
                                            </Link>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className={`font-bold ${match.finishes >= 4 ? 'text-green-600 dark:text-green-400' : 'text-slate-700 dark:text-slate-300'}`}>
                                                {match.finishes}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right font-mono text-slate-600 dark:text-slate-400">{match.damage}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center text-slate-500 py-4">No recent match data available.</div>
                )}
                </div>
            </div>

            {/* Sidebar Info */}
            <div className="space-y-6">
                {/* Radar Chart - Skill Matrix */}
                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 flex flex-col items-center">
                    <h3 className="font-bold text-sm text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 w-full text-left flex items-center">
                        <Hexagon size={16} className="mr-2 text-gamepedia-blue" /> Skill Matrix
                    </h3>
                    <RadarChart data={playerAttributes} size={250} />
                </div>

                {/* Current Team Card */}
                {team && (
                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                        <h3 className="font-bold text-sm text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Current Team</h3>
                        <Link to={`/team/${team.id}`} className="flex items-center space-x-4 group">
                            <img src={team.logoUrl} alt={team.name} className="w-16 h-16 rounded-lg object-contain bg-slate-50 dark:bg-slate-800 p-2 group-hover:scale-105 transition-transform" />
                            <div>
                                <h4 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-gamepedia-blue transition-colors">{team.name}</h4>
                                <p className="text-sm text-slate-500">Joined Apr 2024</p>
                            </div>
                        </Link>
                    </div>
                )}

                {/* Achievements */}
                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                    <h3 className="font-bold text-sm text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Achievements</h3>
                    <ul className="space-y-3">
                        <li className="flex items-start space-x-3">
                            <Award size={18} className="text-amber-500 mt-0.5 shrink-0" />
                            <div>
                                <span className="block text-sm font-bold text-slate-800 dark:text-slate-200">MVP - BGIS The Grind 2024</span>
                                <span className="text-xs text-slate-500">Apr 2024</span>
                            </div>
                        </li>
                        <li className="flex items-start space-x-3">
                            <Award size={18} className="text-slate-400 mt-0.5 shrink-0" />
                            <div>
                                <span className="block text-sm font-bold text-slate-800 dark:text-slate-200">Top Fragger - BMPS S1</span>
                                <span className="text-xs text-slate-500">Dec 2023</span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <>
            {player.settings ? (
                <PlayerSettingsView settings={player.settings} />
            ) : (
                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-12 text-center">
                    <Settings size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Settings Unpublished</h3>
                    <p className="text-slate-500 dark:text-slate-400">This player hasn't shared their sensitivity or layout settings yet.</p>
                </div>
            )}
        </>
      )}
    </div>
  );
};
