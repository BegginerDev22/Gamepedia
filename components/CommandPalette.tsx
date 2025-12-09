
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, User, Shield, Trophy, ArrowRight, Hash, Gamepad2, FileText, Crosshair, BookOpen, Book, Calculator, Gem, Layers, ShoppingBag, Briefcase, Target, Calendar, Zap, Smartphone, PlayCircle, Table, ArrowRightLeft, Map, Coins, Share2, Bomb, Car, UserPlus, Users, BarChart2, HelpCircle, Hash as HashIcon, Anchor, DollarSign, Award, Activity } from 'lucide-react';
import { MOCK_PLAYERS, MOCK_TEAMS, MOCK_TOURNAMENTS, MOCK_WEAPONS, MOCK_GUIDES, MOCK_GLOSSARY, MOCK_COSMETICS, MOCK_STORE_ITEMS } from '../constants';

interface CommandPaletteProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleNavigate = (path: string) => {
        navigate(path);
        onClose();
        setQuery('');
    };

    // Filtering Logic
    const players = Object.values(MOCK_PLAYERS).filter(p => 
        p.handle.toLowerCase().includes(query.toLowerCase()) || p.name.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 3);

    const teams = Object.values(MOCK_TEAMS).filter(t => 
        t.name.toLowerCase().includes(query.toLowerCase()) || t.shortName.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 3);

    const tournaments = MOCK_TOURNAMENTS.filter(t => 
        t.name.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 3);

    const weapons = MOCK_WEAPONS.filter(w => 
        w.name.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 3);

    const guides = MOCK_GUIDES.filter(g =>
        g.title.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 2);

    const terms = MOCK_GLOSSARY.filter(t => 
        t.term.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 3);

    const cosmetics = MOCK_COSMETICS.filter(c => 
        c.name.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 3);

    const storeItems = MOCK_STORE_ITEMS.filter(s =>
        s.name.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 3);

    const pages = [
        { name: 'Home', path: '/', icon: <ArrowRight size={14}/> },
        { name: 'Matches', path: '/matches', icon: <Gamepad2 size={14}/> },
        { name: 'Stats Hub', path: '/stats', icon: <Hash size={14}/> },
        { name: 'Fantasy League', path: '/fantasy', icon: <Trophy size={14}/> },
        { name: 'News Feed', path: '/news', icon: <FileText size={14}/> },
        { name: 'Meta Report', path: '/meta', icon: <Layers size={14}/> },
        { name: 'Weapon Wiki', path: '/weapons', icon: <Crosshair size={14}/> },
        { name: 'Vehicle Wiki', path: '/vehicles', icon: <Car size={14}/> },
        { name: 'Attachment Wiki', path: '/attachments', icon: <Anchor size={14}/> },
        { name: 'Damage Calculator', path: '/calculator', icon: <Calculator size={14}/> },
        { name: 'Cosmetics Wiki', path: '/cosmetics', icon: <Gem size={14}/> },
        { name: 'Coaching Hub', path: '/guides', icon: <BookOpen size={14}/> },
        { name: 'Glossary', path: '/glossary', icon: <Book size={14}/> },
        { name: 'Points Store', path: '/store', icon: <ShoppingBag size={14}/> },
        { name: 'Recruitment Board', path: '/recruitment', icon: <Briefcase size={14}/> },
        { name: 'Tournament Register', path: '/register', icon: <UserPlus size={14}/> },
        { name: 'Crosshair Gen', path: '/crosshair', icon: <Crosshair size={14}/> },
        { name: 'Drop Roulette', path: '/roulette', icon: <Target size={14}/> },
        { name: 'Calendar', path: '/calendar', icon: <Calendar size={14}/> },
        { name: 'Reaction Trainer', path: '/reaction', icon: <Zap size={14}/> },
        { name: 'Device Database', path: '/devices', icon: <Smartphone size={14}/> },
        { name: 'Replay Analysis', path: '/replay', icon: <PlayCircle size={14}/> },
        { name: 'Rank Calculator', path: '/rank-calculator', icon: <Calculator size={14}/> },
        { name: 'Point Table Generator', path: '/table-generator', icon: <Table size={14}/> },
        { name: 'Bracket Generator', path: '/bracket-generator', icon: <Share2 size={14}/> },
        { name: 'Strategy Board', path: '/strats', icon: <Map size={14}/> },
        { name: 'Zone Simulator', path: '/zone-sim', icon: <Target size={14}/> },
        { name: 'Sensitivity Converter', path: '/sens-converter', icon: <ArrowRightLeft size={14}/> },
        { name: 'Spray Trainer', path: '/spray-trainer', icon: <Target size={14}/> },
        { name: 'UC Calculator', path: '/uc-calc', icon: <Coins size={14}/> },
        { name: 'Prize Calculator', path: '/prize-calc', icon: <DollarSign size={14}/> },
        { name: 'Nade Lineups', path: '/nades', icon: <Bomb size={14}/> },
        { name: 'Ruleset Generator', path: '/ruleset', icon: <FileText size={14}/> },
        { name: 'Team Builder', path: '/team-builder', icon: <Users size={14}/> },
        { name: 'Polls Archive', path: '/polls', icon: <BarChart2 size={14}/> },
        { name: 'BGMI Trivia', path: '/trivia', icon: <HelpCircle size={14}/> },
        { name: 'Sens Code Repo', path: '/codes', icon: <HashIcon size={14}/> },
        { name: 'Mission Center', path: '/missions', icon: <Target size={14}/> },
        { name: 'Scorecard Gen', path: '/scorecard-gen', icon: <Award size={14}/> },
        { name: 'Clan Manager', path: '/clan', icon: <Shield size={14}/> },
        { name: 'Impact Calculator', path: '/impact-calc', icon: <Activity size={14}/> },
    ].filter(p => p.name.toLowerCase().includes(query.toLowerCase()));

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4">
            <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={onClose}></div>
            
            <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 relative z-10 overflow-hidden animate-fade-in">
                <div className="flex items-center p-4 border-b border-slate-100 dark:border-slate-800">
                    <Search size={20} className="text-slate-400 mr-3" />
                    <input 
                        ref={inputRef}
                        type="text" 
                        placeholder="Search players, teams, skins, guides..." 
                        className="flex-1 bg-transparent text-lg text-slate-900 dark:text-white outline-none placeholder-slate-400"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Escape' && onClose()}
                    />
                    <div className="text-xs font-mono text-slate-400 border border-slate-200 dark:border-slate-700 rounded px-1.5 py-0.5">ESC</div>
                </div>

                <div className="max-h-[60vh] overflow-y-auto p-2">
                    {query === '' && (
                        <div className="p-4 text-sm text-slate-500">
                            <p className="mb-2 font-bold text-xs uppercase tracking-wider opacity-70">Recent Searches</p>
                            <p className="italic">Start typing to search the entire Gamepedia database.</p>
                        </div>
                    )}

                    {storeItems.length > 0 && (
                        <div className="mb-2">
                            <h4 className="px-3 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider">Store Items</h4>
                            {storeItems.map(c => (
                                <button key={c.id} onClick={() => handleNavigate(`/store`)} className="w-full flex items-center px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group">
                                    <ShoppingBag size={18} className="text-yellow-500 mr-3" />
                                    <div className="text-left">
                                        <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-gamepedia-blue">{c.name}</p>
                                        <p className="text-xs text-slate-500">{c.price} PTS</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    {cosmetics.length > 0 && (
                        <div className="mb-2">
                            <h4 className="px-3 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider">Cosmetics Wiki</h4>
                            {cosmetics.map(c => (
                                <button key={c.id} onClick={() => handleNavigate(`/cosmetics`)} className="w-full flex items-center px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group">
                                    <Gem size={18} className="text-purple-500 mr-3" />
                                    <div className="text-left">
                                        <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-gamepedia-blue">{c.name}</p>
                                        <p className="text-xs text-slate-500">{c.type}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    {players.length > 0 && (
                        <div className="mb-2">
                            <h4 className="px-3 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider">Players</h4>
                            {players.map(p => (
                                <button key={p.id} onClick={() => handleNavigate(`/player/${p.id}`)} className="w-full flex items-center px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group">
                                    <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 mr-3 overflow-hidden">
                                        <img src={p.image} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-gamepedia-blue">{p.handle}</p>
                                        <p className="text-xs text-slate-500">{p.name}</p>
                                    </div>
                                    <User size={14} className="ml-auto text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
                            ))}
                        </div>
                    )}

                    {teams.length > 0 && (
                        <div className="mb-2">
                            <h4 className="px-3 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider">Teams</h4>
                            {teams.map(t => (
                                <button key={t.id} onClick={() => handleNavigate(`/team/${t.id}`)} className="w-full flex items-center px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group">
                                    <div className="w-8 h-8 rounded bg-white p-1 mr-3 border border-slate-200 dark:border-slate-700">
                                        <img src={t.logoUrl} className="w-full h-full object-contain" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-gamepedia-blue">{t.name}</p>
                                        <p className="text-xs text-slate-500">{t.region}</p>
                                    </div>
                                    <Shield size={14} className="ml-auto text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
                            ))}
                        </div>
                    )}

                    {tournaments.length > 0 && (
                        <div className="mb-2">
                            <h4 className="px-3 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider">Tournaments</h4>
                            {tournaments.map(t => (
                                <button key={t.id} onClick={() => handleNavigate(`/tournament/${t.id}`)} className="w-full flex items-center px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group">
                                    <Trophy size={18} className="text-amber-500 mr-3" />
                                    <div className="text-left">
                                        <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-gamepedia-blue">{t.name}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    {guides.length > 0 && (
                        <div className="mb-2">
                            <h4 className="px-3 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider">Guides</h4>
                            {guides.map(g => (
                                <button key={g.id} onClick={() => handleNavigate(`/guides`)} className="w-full flex items-center px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group">
                                    <BookOpen size={18} className="text-gamepedia-blue mr-3" />
                                    <div className="text-left">
                                        <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-gamepedia-blue">{g.title}</p>
                                        <p className="text-xs text-slate-500">by {g.author}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    {terms.length > 0 && (
                        <div className="mb-2">
                            <h4 className="px-3 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider">Glossary</h4>
                            {terms.map(t => (
                                <button key={t.id} onClick={() => handleNavigate(`/glossary`)} className="w-full flex items-center px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group">
                                    <Book size={18} className="text-slate-400 mr-3" />
                                    <div className="text-left">
                                        <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-gamepedia-blue">{t.term}</p>
                                        <p className="text-xs text-slate-500 line-clamp-1">{t.definition}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    {weapons.length > 0 && (
                        <div className="mb-2">
                            <h4 className="px-3 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider">Weapons</h4>
                            {weapons.map(w => (
                                <button key={w.id} onClick={() => handleNavigate(`/weapons`)} className="w-full flex items-center px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group">
                                    <Crosshair size={18} className="text-red-500 mr-3" />
                                    <div className="text-left">
                                        <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-gamepedia-blue">{w.name}</p>
                                        <p className="text-xs text-slate-500">{w.type}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    {pages.length > 0 && (
                        <div>
                            <h4 className="px-3 py-2 text-xs font-bold text-slate-500 uppercase tracking-wider">Pages</h4>
                            {pages.map(page => (
                                <button key={page.name} onClick={() => handleNavigate(page.path)} className="w-full flex items-center px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group">
                                    <div className="mr-3 text-slate-400">{page.icon}</div>
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white">{page.name}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 flex justify-between">
                     <span><strong className="font-bold">Pro Tip:</strong> Use arrows to navigate</span>
                     <span>Gamepedia Search v1.4</span>
                </div>
            </div>
        </div>
    );
};
