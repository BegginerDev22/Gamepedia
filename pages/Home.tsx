
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Zap, Bot, Trophy, TrendingUp } from 'lucide-react';
import { MOCK_TOURNAMENTS, MOCK_PLAYERS } from '../constants';
import { Tournament } from '../types';
import { generateTournamentPreview } from '../services/geminiService';
import { MatchRow } from '../components/MatchRow';
import { useMatches } from '../contexts/MatchContext';
import { PollWidget } from '../components/PollWidget';
import { Infobox } from '../components/Infobox'; // Used to mimic sidebar layout style if needed, but here we build custom

const TournamentCard: React.FC<{ tournament: Tournament }> = ({ tournament }) => (
  <Link to={`/tournament/${tournament.id}`} className="group block bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-md transition-all duration-200 hover:border-gamepedia-blue/50 dark:hover:border-gamepedia-blue/50">
    <div className="h-32 bg-slate-800 relative overflow-hidden">
      <img src={tournament.bannerUrl} alt={tournament.name} className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500" />
      <div className="absolute top-3 right-3">
        <span className="bg-gamepedia-orange text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
          {tournament.tier}
        </span>
      </div>
    </div>
    <div className="p-4">
      <h3 className="font-heading font-bold text-lg text-gamepedia-dark dark:text-white group-hover:text-gamepedia-blue transition-colors truncate">
        {tournament.name}
      </h3>
      <div className="mt-3 space-y-2">
        <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
          <Calendar size={14} className="mr-2" />
          {tournament.dates}
        </div>
        <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
          <MapPin size={14} className="mr-2" />
          {tournament.location}
        </div>
        <div className="flex items-center text-sm font-medium text-gamepedia-success">
          <Zap size={14} className="mr-2" />
          {tournament.prizePool}
        </div>
      </div>
    </div>
  </Link>
);

export const Home: React.FC = () => {
  const { matches } = useMatches();
  const [aiPreview, setAiPreview] = useState<string>("");

  useEffect(() => {
    // Example: Load an AI preview for the main featured tournament
    const loadPreview = async () => {
        const text = await generateTournamentPreview(MOCK_TOURNAMENTS[0].name, MOCK_TOURNAMENTS[0].tier);
        setAiPreview(text);
    };
    loadPreview();
  }, []);

  // Get top players by KD for trending section
  const trendingPlayers = Object.values(MOCK_PLAYERS).sort((a, b) => (b.stats?.kd || 0) - (a.stats?.kd || 0)).slice(0, 3);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
      {/* Main Column */}
      <div className="lg:col-span-2 space-y-8">
        {/* Hero / Featured */}
        <section>
            <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-heading font-bold text-gamepedia-dark dark:text-white">Featured Tournaments</h2>
            <Link to="/tournaments" className="text-sm text-gamepedia-blue hover:underline">View All</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MOCK_TOURNAMENTS.slice(0, 4).map(t => (
                <TournamentCard key={t.id} tournament={t} />
            ))}
            </div>
        </section>

        {/* Matches */}
        <section>
            <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
                <h2 className="text-2xl font-heading font-bold text-gamepedia-dark dark:text-white">Matches</h2>
                <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-1 text-xs font-medium">
                    <button className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded">All</button>
                    <button className="px-3 py-1 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">Live</button>
                    <button className="px-3 py-1 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">Finished</button>
                </div>
            </div>
            </div>
            <div className="space-y-3">
                {matches.slice(0, 5).map(m => (
                    <MatchRow key={m.id} match={m} />
                ))}
            </div>
            <div className="text-center mt-4">
                <Link to="/matches" className="text-sm font-medium text-gamepedia-blue hover:underline">View Full Schedule</Link>
            </div>
        </section>
      </div>

      {/* Sidebar Column */}
      <div className="space-y-6">
           <PollWidget />

           {/* AI Insight Card */}
           <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-6 text-white shadow-lg flex flex-col justify-center border border-slate-700 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                   <Zap size={80} />
                </div>
                <div className="flex items-center space-x-2 text-gamepedia-blue mb-3 relative z-10">
                    <Zap size={18} />
                    <span className="text-xs font-bold uppercase tracking-widest">AI Insight</span>
                </div>
                <h3 className="font-heading font-bold text-xl mb-2 relative z-10">Tournament Outlook</h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-4 relative z-10">
                    {aiPreview || "Generating tournament insights using Gemini AI..."}
                </p>
                <button className="text-left text-sm font-bold text-gamepedia-orange hover:text-white transition-colors relative z-10">
                    Read full analysis →
                </button>
            </div>

            {/* Trending Players */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-5">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-4 flex items-center uppercase tracking-wide border-b border-slate-100 dark:border-slate-800 pb-3">
                    <TrendingUp size={16} className="mr-2 text-green-500" /> Trending Players
                </h3>
                <div className="space-y-4">
                    {trendingPlayers.map((player, idx) => (
                        <Link to={`/player/${player.id}`} key={player.id} className="flex items-center space-x-3 group cursor-pointer">
                            <div className="relative">
                                <img src={player.image} className="w-10 h-10 rounded-full bg-slate-200 object-cover" alt={player.handle} />
                                <div className="absolute -top-1 -right-1 bg-white dark:bg-slate-800 text-[10px] font-bold px-1.5 rounded-full border border-slate-200 dark:border-slate-700 text-slate-500">#{idx + 1}</div>
                            </div>
                            <div className="flex-1">
                                <div className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-gamepedia-blue transition-colors">{player.handle}</div>
                                <div className="text-xs text-slate-500 dark:text-slate-400">KD: {player.stats?.kd}</div>
                            </div>
                            <div className="text-green-500 text-xs font-bold flex items-center bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded">
                                <TrendingUp size={10} className="mr-1" /> +12%
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-5">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-3 flex items-center uppercase tracking-wide">
                    <Trophy size={16} className="mr-2 text-amber-500" /> Fantasy Top Pick
                </h3>
                <div className="flex items-center space-x-3">
                    <img src="https://picsum.photos/200/200?random=106" className="w-12 h-12 rounded-full bg-slate-200" alt="Jonathan" />
                    <div>
                        <div className="font-bold text-slate-900 dark:text-white">Jonathan</div>
                        <div className="text-xs text-slate-500">GodLike • 24.5 Cr</div>
                    </div>
                    <div className="ml-auto text-right">
                        <div className="font-mono font-bold text-green-500">1.95 KD</div>
                        <div className="text-[10px] text-slate-400 uppercase">Avg Stats</div>
                    </div>
                </div>
                <button className="w-full mt-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                    Draft Now
                </button>
            </div>
      </div>
    </div>
  );
};
