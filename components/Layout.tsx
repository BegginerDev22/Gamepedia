
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Menu, Trophy, Users, Calendar, Shield, Video, Settings, Sun, Moon, LogIn, Swords, Coins, Newspaper, Map, PlaySquare, List, Crosshair, Clock, Command, User, BookOpen, Book, Calculator, Gem, Layers, ShoppingBag, Briefcase, Target, Zap, Smartphone, PlayCircle, Table, ArrowRightLeft, Flame, Share2, Bomb, FileText, Car, UserPlus, BarChart2, HelpCircle, Hash, Anchor, DollarSign, Award, Activity, X } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { CommandPalette } from './CommandPalette';
import { MOCK_MATCHES } from '../constants';

const NavLink: React.FC<{ to: string; icon: React.ReactNode; label: string; active: boolean; onClick?: () => void }> = ({ to, icon, label, active, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
      active 
        ? 'bg-blue-50 text-gamepedia-blue font-medium dark:bg-blue-900/20' 
        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'
    }`}
  >
    <span className={`${active ? 'text-gamepedia-blue' : 'text-slate-400'}`}>{icon}</span>
    <span>{label}</span>
  </Link>
);

const LiveTicker: React.FC = () => {
    const liveMatches = MOCK_MATCHES.filter(m => m.status === 'Live' || m.status === 'Finished').slice(0, 5);
    
    return (
        <div className="bg-slate-900 text-white text-xs font-medium py-1.5 overflow-hidden border-b border-slate-800 relative z-50">
            <div className="flex items-center animate-scroll whitespace-nowrap w-full">
                <div className="flex items-center px-4 text-gamepedia-orange font-bold uppercase tracking-wider shrink-0">
                    <Zap size={12} className="mr-1" /> Live Updates
                </div>
                {liveMatches.map((match, idx) => (
                    <Link to={`/match/${match.id}`} key={match.id} className="flex items-center px-6 border-r border-slate-700 hover:text-gamepedia-blue transition-colors">
                        <span className={`mr-2 px-1.5 rounded-[2px] text-[10px] font-bold ${match.status === 'Live' ? 'bg-red-600 text-white animate-pulse' : 'bg-slate-700 text-slate-300'}`}>
                            {match.status === 'Live' ? 'LIVE' : 'RESULT'}
                        </span>
                        <span className="font-bold mr-2">{match.teamA.shortName}</span>
                        <span className="font-mono text-slate-400">{match.scoreA} - {match.scoreB}</span>
                        <span className="font-bold ml-2">{match.teamB.shortName}</span>
                        <span className="ml-2 text-slate-500">({match.map})</span>
                    </Link>
                ))}
                <div className="flex items-center px-6 border-r border-slate-700">
                    <span className="bg-blue-600 text-white px-1.5 rounded-[2px] text-[10px] font-bold mr-2">NEWS</span>
                    <span>P90 Update Live in v3.2 Patch Notes</span>
                </div>
                <div className="flex items-center px-6 border-r border-slate-700">
                    <span className="bg-green-600 text-white px-1.5 rounded-[2px] text-[10px] font-bold mr-2">MARKET</span>
                    <span>Spower Transfers to Team Soul</span>
                </div>
            </div>
        </div>
    );
};

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { points, level } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  
  const [darkMode, setDarkMode] = React.useState(() => {
    if (localStorage.getItem('theme') === 'dark' ||
        (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        return true;
    }
    return false;
  });

  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  useEffect(() => {
      const down = (e: KeyboardEvent) => {
        if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
          e.preventDefault();
          setIsCommandOpen((open) => !open);
        }
      };
      document.addEventListener('keydown', down);
      return () => document.removeEventListener('keydown', down);
  }, []);

  const toggleTheme = () => setDarkMode(!darkMode);

  const NavigationLinks = ({ onItemClick }: { onItemClick?: () => void }) => (
    <>
      <NavLink to="/" icon={<Trophy size={20} />} label="Tournaments" active={location.pathname === '/'} onClick={onItemClick} />
      <NavLink to="/matches" icon={<Calendar size={20} />} label="Matches" active={location.pathname === '/matches'} onClick={onItemClick} />
      <NavLink to="/calendar" icon={<Calendar size={20} />} label="Calendar" active={location.pathname === '/calendar'} onClick={onItemClick} />
      <NavLink to="/teams" icon={<Users size={20} />} label="Teams" active={location.pathname === '/teams'} onClick={onItemClick} />
      <NavLink to="/stats" icon={<Shield size={20} />} label="Statistics" active={location.pathname === '/stats'} onClick={onItemClick} />
      <NavLink to="/compare" icon={<Swords size={20} />} label="Compare" active={location.pathname === '/compare'} onClick={onItemClick} />
      
      <div className="pt-6 pb-2">
          <span className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Features</span>
      </div>
      <NavLink to="/pickems" icon={<Crosshair size={20} />} label="Pick'ems" active={location.pathname === '/pickems'} onClick={onItemClick} />
      <NavLink to="/fantasy" icon={<Coins size={20} />} label="Fantasy League" active={location.pathname === '/fantasy'} onClick={onItemClick} />
      <NavLink to="/missions" icon={<Target size={20} />} label="Mission Center" active={location.pathname === '/missions'} onClick={onItemClick} />
      <NavLink to="/trivia" icon={<HelpCircle size={20} />} label="BGMI Trivia" active={location.pathname === '/trivia'} onClick={onItemClick} />
      <NavLink to="/scrims" icon={<List size={20} />} label="Scrims Center" active={location.pathname === '/scrims'} onClick={onItemClick} />
      <NavLink to="/vods" icon={<PlaySquare size={20} />} label="VOD Library" active={location.pathname === '/vods'} onClick={onItemClick} />
      <NavLink to="/replay" icon={<PlayCircle size={20} />} label="Replay Analysis" active={location.pathname === '/replay'} onClick={onItemClick} />
      <NavLink to="/strats" icon={<Map size={20} />} label="Strategy Board" active={location.pathname === '/strats'} onClick={onItemClick} />
      <NavLink to="/maps" icon={<Map size={20} />} label="Strategy Map" active={location.pathname === '/maps'} onClick={onItemClick} />
      <NavLink to="/news" icon={<Newspaper size={20} />} label="News Feed" active={location.pathname === '/news'} onClick={onItemClick} />
      <NavLink to="/history" icon={<Clock size={20} />} label="Timeline" active={location.pathname === '/history'} onClick={onItemClick} />

      <div className="pt-6 pb-2">
          <span className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Community & Store</span>
      </div>
      <NavLink to="/store" icon={<ShoppingBag size={20} />} label="Points Store" active={location.pathname === '/store'} onClick={onItemClick} />
      <NavLink to="/clan" icon={<Shield size={20} />} label="Clan Manager" active={location.pathname === '/clan'} onClick={onItemClick} />
      <NavLink to="/recruitment" icon={<Briefcase size={20} />} label="Recruitment" active={location.pathname === '/recruitment'} onClick={onItemClick} />
      <NavLink to="/register" icon={<UserPlus size={20} />} label="Team Register" active={location.pathname === '/register'} onClick={onItemClick} />
      <NavLink to="/polls" icon={<BarChart2 size={20} />} label="Polls Archive" active={location.pathname === '/polls'} onClick={onItemClick} />
      <NavLink to="/codes" icon={<Hash size={20} />} label="Sens Code Repo" active={location.pathname === '/codes'} onClick={onItemClick} />

      <div className="pt-6 pb-2">
          <span className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Wiki & Tools</span>
      </div>
      <NavLink to="/meta" icon={<Layers size={20} />} label="Meta Report" active={location.pathname === '/meta'} onClick={onItemClick} />
      <NavLink to="/weapons" icon={<Crosshair size={20} />} label="Weapon Wiki" active={location.pathname === '/weapons'} onClick={onItemClick} />
      <NavLink to="/attachments" icon={<Anchor size={20} />} label="Attachment Wiki" active={location.pathname === '/attachments'} onClick={onItemClick} />
      <NavLink to="/vehicles" icon={<Car size={20} />} label="Vehicle Wiki" active={location.pathname === '/vehicles'} onClick={onItemClick} />
      <NavLink to="/nades" icon={<Bomb size={20} />} label="Nade Lineups" active={location.pathname === '/nades'} onClick={onItemClick} />
      <NavLink to="/team-builder" icon={<Users size={20} />} label="Team Builder" active={location.pathname === '/team-builder'} onClick={onItemClick} />
      <NavLink to="/impact-calc" icon={<Activity size={20} />} label="Impact Calc" active={location.pathname === '/impact-calc'} onClick={onItemClick} />
      <NavLink to="/spray-trainer" icon={<Target size={20} />} label="Spray Trainer" active={location.pathname === '/spray-trainer'} onClick={onItemClick} />
      <NavLink to="/cosmetics" icon={<Gem size={20} />} label="Cosmetics Wiki" active={location.pathname === '/cosmetics'} onClick={onItemClick} />
      <NavLink to="/devices" icon={<Smartphone size={20} />} label="Device Specs" active={location.pathname === '/devices'} onClick={onItemClick} />
      <NavLink to="/rank-calculator" icon={<Calculator size={20} />} label="Rank Calc" active={location.pathname === '/rank-calculator'} onClick={onItemClick} />
      <NavLink to="/calculator" icon={<Calculator size={20} />} label="Damage Calc" active={location.pathname === '/calculator'} onClick={onItemClick} />
      <NavLink to="/uc-calc" icon={<Coins size={20} />} label="UC Calculator" active={location.pathname === '/uc-calc'} onClick={onItemClick} />
      <NavLink to="/crosshair" icon={<Crosshair size={20} />} label="Crosshair Gen" active={location.pathname === '/crosshair'} onClick={onItemClick} />
      <NavLink to="/sens-converter" icon={<ArrowRightLeft size={20} />} label="Sens Converter" active={location.pathname === '/sens-converter'} onClick={onItemClick} />
      <NavLink to="/roulette" icon={<Target size={20} />} label="Drop Roulette" active={location.pathname === '/roulette'} onClick={onItemClick} />
      <NavLink to="/reaction" icon={<Zap size={20} />} label="Reaction Trainer" active={location.pathname === '/reaction'} onClick={onItemClick} />
      <NavLink to="/zone-sim" icon={<Target size={20} />} label="Zone Simulator" active={location.pathname === '/zone-sim'} onClick={onItemClick} />
      <NavLink to="/guides" icon={<BookOpen size={20} />} label="Coaching Hub" active={location.pathname === '/guides'} onClick={onItemClick} />
      <NavLink to="/glossary" icon={<Book size={20} />} label="Glossary" active={location.pathname === '/glossary'} onClick={onItemClick} />

      <div className="pt-6 pb-2">
        <span className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Admin Tools
        </span>
      </div>
      <NavLink to="/ruleset" icon={<FileText size={20} />} label="Ruleset Gen" active={location.pathname === '/ruleset'} onClick={onItemClick} />
      <NavLink to="/table-generator" icon={<Table size={20} />} label="Table Gen" active={location.pathname === '/table-generator'} onClick={onItemClick} />
      <NavLink to="/bracket-generator" icon={<Share2 size={20} />} label="Bracket Gen" active={location.pathname === '/bracket-generator'} onClick={onItemClick} />
      <NavLink to="/scorecard-gen" icon={<Award size={20} />} label="Scorecard Gen" active={location.pathname === '/scorecard-gen'} onClick={onItemClick} />
      <NavLink to="/prize-calc" icon={<DollarSign size={20} />} label="Prize Calc" active={location.pathname === '/prize-calc'} onClick={onItemClick} />
      <NavLink to="/admin" icon={<Settings size={20} />} label="Dashboard" active={location.pathname === '/admin'} onClick={onItemClick} />
    </>
  );

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <CommandPalette isOpen={isCommandOpen} onClose={() => setIsCommandOpen(false)} />
      
      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}></div>
          <div className="absolute top-0 left-0 w-72 h-full bg-white dark:bg-slate-900 shadow-2xl flex flex-col animate-slide-right">
             <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <Link to="/" className="flex items-center space-x-2" onClick={() => setMobileMenuOpen(false)}>
                  <div className="w-8 h-8 bg-gamepedia-blue rounded-lg flex items-center justify-center text-white font-bold font-heading">
                    G
                  </div>
                  <span className="font-heading font-bold text-xl text-gamepedia-dark dark:text-white">
                    Gamepedia
                  </span>
                </Link>
                <button onClick={() => setMobileMenuOpen(false)} className="text-slate-500 hover:text-slate-900 dark:hover:text-white">
                  <X size={24} />
                </button>
             </div>
             <div className="flex-1 overflow-y-auto py-4 custom-scrollbar">
                <nav className="space-y-1">
                   <NavigationLinks onItemClick={() => setMobileMenuOpen(false)} />
                </nav>
             </div>
             <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center space-x-3 mb-4">
                   <div className="w-10 h-10 bg-gamepedia-blue rounded-full flex items-center justify-center text-white font-bold">
                      {level}
                   </div>
                   <div>
                      <p className="font-bold text-slate-900 dark:text-white">Guest User</p>
                      <p className="text-xs text-slate-500">{points.toLocaleString()} PTS</p>
                   </div>
                </div>
                <button className="w-full py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-bold">
                   View Profile
                </button>
             </div>
          </div>
        </div>
      )}
      
      {/* Live Ticker */}
      <LiveTicker />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 shadow-sm h-16 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <Menu size={24} />
            </button>
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gamepedia-blue rounded-lg flex items-center justify-center text-white font-bold font-heading">
                G
              </div>
              <span className="font-heading font-bold text-xl text-gamepedia-dark dark:text-white hidden sm:block">
                Gamepedia <span className="text-gamepedia-blue">BGMI</span>
              </span>
            </Link>
          </div>

          {/* Search / Command Trigger */}
          <div className="flex-1 max-w-lg mx-4 hidden md:block">
            <button 
                onClick={() => setIsCommandOpen(true)}
                className="w-full flex items-center justify-between px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:border-gamepedia-blue transition-colors group"
            >
                <div className="flex items-center">
                    <Search size={16} className="mr-3 group-hover:text-gamepedia-blue" />
                    <span className="text-sm">Search players, teams...</span>
                </div>
                <div className="flex items-center space-x-1 text-xs font-mono border border-slate-200 dark:border-slate-600 rounded px-1.5">
                    <Command size={10} />
                    <span>K</span>
                </div>
            </button>
          </div>

          {/* User / Login */}
          <div className="flex items-center space-x-3">
             {/* Theme Toggle */}
             <button 
               onClick={toggleTheme} 
               className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors mr-2"
               aria-label="Toggle Dark Mode"
             >
               {darkMode ? <Sun size={20} /> : <Moon size={20} />}
             </button>

             {/* User Stats */}
             <div className="hidden md:flex items-center space-x-2 bg-amber-50 dark:bg-amber-900/20 px-3 py-1.5 rounded-full border border-amber-100 dark:border-amber-800/50">
                <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></span>
                <span className="text-xs font-bold text-amber-800 dark:text-amber-400 font-mono">{points.toLocaleString()} PTS</span>
             </div>
             
             {/* Profile Link */}
             <Link to="/profile" className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-colors">
               <div className="w-6 h-6 bg-gamepedia-blue rounded-full flex items-center justify-center text-white text-xs font-bold">
                   {level}
               </div>
               <span className="text-sm font-bold text-slate-700 dark:text-slate-200 hidden sm:inline">Profile</span>
             </Link>
          </div>
        </div>
      </header>

      <div className="flex flex-1 max-w-7xl mx-auto w-full">
        {/* Sidebar Navigation (Desktop) */}
        <aside className="hidden lg:block w-64 py-6 pr-6 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto no-scrollbar">
          <nav className="space-y-1 pb-8">
            <NavigationLinks />
          </nav>

          <div className="mt-auto mb-8 bg-gradient-to-br from-gamepedia-blue to-blue-600 rounded-xl p-4 text-white shadow-lg">
            <h3 className="font-heading font-bold mb-2 text-sm">BGIS 2024 Live!</h3>
            <p className="text-xs text-blue-100 mb-3">Check out the live brackets and stats for the Grand Finals.</p>
            <Link to="/tournament/bgis-2024" className="block w-full text-center py-2 bg-white text-gamepedia-blue text-xs font-bold rounded hover:bg-blue-50 transition-colors">
              View Event
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 py-6 px-4 md:px-0 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
};
