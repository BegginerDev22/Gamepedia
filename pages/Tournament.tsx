
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Trophy, Calendar, Map, DollarSign, Users, Info, Network, ArrowUp, ArrowDown } from 'lucide-react';
import { MOCK_TOURNAMENTS, MOCK_TEAMS, MOCK_MAPS } from '../constants';
import { Infobox } from '../components/Infobox';
import { Bracket } from '../components/Bracket';

// Helper for sort logic
interface StandingRow {
    rank: number;
    teamName: string;
    matches: number;
    wwcd: number;
    finishes: number;
    points: number;
}

const INITIAL_STANDINGS: StandingRow[] = [
    { rank: 1, teamName: 'Team Soul', matches: 15, wwcd: 2, finishes: 84, points: 142 },
    { rank: 2, teamName: 'GodLike', matches: 15, wwcd: 1, finishes: 92, points: 138 },
    { rank: 3, teamName: 'Team XSpark', matches: 15, wwcd: 3, finishes: 70, points: 135 },
    { rank: 4, teamName: 'Blind Esports', matches: 15, wwcd: 1, finishes: 75, points: 120 },
    { rank: 5, teamName: 'Entity Gaming', matches: 15, wwcd: 0, finishes: 60, points: 95 },
];

export const TournamentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const tournament = MOCK_TOURNAMENTS.find(t => t.id === id) || MOCK_TOURNAMENTS[0];
  const [activeTab, setActiveTab] = useState<'overview' | 'bracket' | 'standings'>('overview');
  
  // Sort State
  const [standings, setStandings] = useState(INITIAL_STANDINGS);
  const [sortConfig, setSortConfig] = useState<{ key: keyof StandingRow; direction: 'asc' | 'desc' }>({ key: 'points', direction: 'desc' });

  const handleSort = (key: keyof StandingRow) => {
      let direction: 'asc' | 'desc' = 'desc';
      if (sortConfig.key === key && sortConfig.direction === 'desc') {
          direction = 'asc';
      }
      setSortConfig({ key, direction });

      const sorted = [...standings].sort((a, b) => {
          if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
          if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
          return 0;
      });
      setStandings(sorted);
  };

  const SortIcon = ({ colKey }: { colKey: keyof StandingRow }) => {
      if (sortConfig.key !== colKey) return <span className="w-3 h-3 inline-block ml-1 opacity-20"><ArrowDown size={12} /></span>;
      return sortConfig.direction === 'asc' 
        ? <ArrowUp size={12} className="inline ml-1 text-gamepedia-blue" /> 
        : <ArrowDown size={12} className="inline ml-1 text-gamepedia-blue" />;
  };

  return (
    <div className="flex flex-col lg:flex-row items-start">
      <div className="flex-1 w-full">
        {/* Header Banner */}
        <div className="relative h-48 md:h-64 rounded-xl overflow-hidden mb-6 bg-slate-900">
          <img src={tournament.bannerUrl} alt={tournament.name} className="w-full h-full object-cover opacity-70" />
          <div className="absolute bottom-0 left-0 p-6 bg-gradient-to-t from-slate-900/90 to-transparent w-full">
            <span className="inline-block px-2 py-1 bg-gamepedia-orange text-white text-xs font-bold rounded mb-2">
                {tournament.tier}
            </span>
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-white mb-2 shadow-sm">{tournament.name}</h1>
            <div className="flex flex-wrap items-center gap-4 text-slate-200 text-sm">
               <span className="flex items-center"><Calendar size={16} className="mr-1.5"/> {tournament.dates}</span>
               <span className="flex items-center"><Map size={16} className="mr-1.5"/> {tournament.location}</span>
               <span className="flex items-center text-gamepedia-success font-bold"><DollarSign size={16} className="mr-1"/> {tournament.prizePool}</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center space-x-1 bg-white dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-700 mb-6 w-fit">
            <button 
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${activeTab === 'overview' ? 'bg-slate-100 dark:bg-slate-800 text-gamepedia-blue' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
            >
                <Info size={16} className="mr-2" /> Overview
            </button>
            <button 
                onClick={() => setActiveTab('bracket')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${activeTab === 'bracket' ? 'bg-slate-100 dark:bg-slate-800 text-gamepedia-blue' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
            >
                <Network size={16} className="mr-2" /> Brackets
            </button>
             <button 
                onClick={() => setActiveTab('standings')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${activeTab === 'standings' ? 'bg-slate-100 dark:bg-slate-800 text-gamepedia-blue' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
            >
                <Trophy size={16} className="mr-2" /> Standings
            </button>
        </div>

        {/* Content Area */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6 min-h-[400px]">
            {activeTab === 'overview' && (
                <div className="space-y-8">
                    <section>
                        <h3 className="font-heading font-bold text-lg mb-3 text-gamepedia-dark dark:text-white border-l-4 border-gamepedia-blue pl-3">About</h3>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                            {tournament.name} is the premier BGMI event of the season, organized by {tournament.organizer}. 
                            The top {tournament.teamsCount} teams from across India battle it out for a massive prize pool of {tournament.prizePool}.
                            The winner qualifies for the PMGC global slots.
                        </p>
                    </section>

                    <section>
                        <h3 className="font-heading font-bold text-lg mb-3 text-gamepedia-dark dark:text-white border-l-4 border-gamepedia-blue pl-3">Map Pool</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {Object.values(MOCK_MAPS).map(map => (
                                <div key={map.id} className="group relative rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 aspect-video shadow-sm hover:shadow-md transition-shadow">
                                    <img src={map.imageUrl} alt={map.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-90 group-hover:opacity-100" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-3">
                                        <span className="text-white font-bold text-sm tracking-wide">{map.name}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                    
                    <section>
                        <h3 className="font-heading font-bold text-lg mb-3 text-gamepedia-dark dark:text-white border-l-4 border-gamepedia-blue pl-3">Participating Teams</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {Object.values(MOCK_TEAMS).map(team => (
                                <div key={team.id} className="flex items-center space-x-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:border-gamepedia-blue/30 transition-colors group cursor-default">
                                    <img src={team.logoUrl} alt={team.name} className="w-8 h-8 rounded object-contain bg-white dark:bg-slate-700 p-0.5" />
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-gamepedia-blue transition-colors">{team.name}</span>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            )}

            {activeTab === 'bracket' && (
                <div className="overflow-x-auto">
                    <h3 className="font-heading font-bold text-lg mb-6 text-gamepedia-dark dark:text-white">Upper Bracket</h3>
                    <Bracket />
                </div>
            )}

            {activeTab === 'standings' && (
                <div>
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-medium border-b border-slate-200 dark:border-slate-700">
                            <tr>
                                <th className="px-4 py-3 cursor-pointer hover:text-gamepedia-blue transition-colors select-none" onClick={() => handleSort('rank')}>
                                    Rank <SortIcon colKey="rank" />
                                </th>
                                <th className="px-4 py-3 cursor-pointer hover:text-gamepedia-blue transition-colors select-none" onClick={() => handleSort('teamName')}>
                                    Team <SortIcon colKey="teamName" />
                                </th>
                                <th className="px-4 py-3 text-center cursor-pointer hover:text-gamepedia-blue transition-colors select-none" onClick={() => handleSort('matches')}>
                                    Matches <SortIcon colKey="matches" />
                                </th>
                                <th className="px-4 py-3 text-center cursor-pointer hover:text-gamepedia-blue transition-colors select-none" onClick={() => handleSort('wwcd')}>
                                    WWCD <SortIcon colKey="wwcd" />
                                </th>
                                <th className="px-4 py-3 text-center cursor-pointer hover:text-gamepedia-blue transition-colors select-none" onClick={() => handleSort('finishes')}>
                                    Finishes <SortIcon colKey="finishes" />
                                </th>
                                <th className="px-4 py-3 text-right cursor-pointer hover:text-gamepedia-blue transition-colors select-none" onClick={() => handleSort('points')}>
                                    Points <SortIcon colKey="points" />
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {standings.map((row, idx) => (
                                <tr key={row.teamName} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className={`px-4 py-3 font-mono ${row.rank <= 3 ? 'font-bold text-gamepedia-dark dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                                        #{idx + 1}
                                    </td>
                                    <td className="px-4 py-3 flex items-center space-x-3">
                                        <div className="w-6 h-6 bg-gray-200 dark:bg-slate-700 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-500">
                                            {row.teamName.charAt(0)}
                                        </div>
                                        <span className={`font-medium ${row.rank <= 3 ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                                            {row.teamName}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-400">{row.matches}</td>
                                    <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-400">
                                        {row.wwcd > 0 ? <span className="px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full text-xs font-bold">{row.wwcd}</span> : 0}
                                    </td>
                                    <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-400">{row.finishes}</td>
                                    <td className="px-4 py-3 text-right font-mono font-bold text-gamepedia-dark dark:text-white text-lg">
                                        {row.points}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
      </div>

      {/* Right Sidebar Infobox */}
      <Infobox 
        title={tournament.name}
        subtitle={tournament.tier}
        image={tournament.logoUrl}
        data={[
            { label: "Organizer", value: tournament.organizer },
            { label: "Type", value: "Offline LAN" },
            { label: "Location", value: tournament.location },
            { label: "Dates", value: tournament.dates },
            { label: "Teams", value: tournament.teamsCount.toString() },
            { label: "Prize Pool", value: <span className="text-green-600 dark:text-green-400 font-bold">{tournament.prizePool}</span> },
            { label: "Winner", value: tournament.winnerId ? <span className="font-bold text-gamepedia-blue">Team Soul</span> : "TBD" }
        ]}
        actionButton={{
            label: "Edit Tournament",
            onClick: () => alert("Admin permission required")
        }}
      />
    </div>
  );
};
