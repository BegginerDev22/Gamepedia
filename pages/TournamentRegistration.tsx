
import React, { useState } from 'react';
import { Trophy, UserPlus, CheckCircle, AlertCircle, Mail, MessageSquare, Users } from 'lucide-react';
import { MOCK_TOURNAMENTS } from '../constants';

export const TournamentRegistrationPage: React.FC = () => {
    const [selectedTournament, setSelectedTournament] = useState(MOCK_TOURNAMENTS[0].id);
    const [teamName, setTeamName] = useState('');
    const [email, setEmail] = useState('');
    const [discordId, setDiscordId] = useState('');
    const [roster, setRoster] = useState(['', '', '', '', '']); // 4 players + 1 sub
    const [submitted, setSubmitted] = useState(false);

    const tournament = MOCK_TOURNAMENTS.find(t => t.id === selectedTournament);

    const handleRosterChange = (index: number, value: string) => {
        const newRoster = [...roster];
        newRoster[index] = value;
        setRoster(newRoster);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!teamName || !email || roster.slice(0, 4).some(p => !p)) {
            alert("Please fill in all required fields (Team Name, Email, and 4 Main Players).");
            return;
        }
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="max-w-2xl mx-auto pt-20 text-center animate-fade-in">
                <div className="bg-green-100 dark:bg-green-900/20 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={48} className="text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Registration Successful!</h2>
                <p className="text-slate-500 dark:text-slate-400 text-lg mb-8">
                    Your team <strong>{teamName}</strong> has been registered for <strong>{tournament?.name}</strong>.
                    <br/>Check your email for the confirmation and Discord role details.
                </p>
                <button 
                    onClick={() => setSubmitted(false)}
                    className="px-8 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                    Register Another Team
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-heading font-bold text-slate-900 dark:text-white flex items-center justify-center">
                    <UserPlus className="mr-3 text-gamepedia-blue" /> Tournament Registration
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">
                    Sign up your squad for upcoming community and official events.
                </p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="bg-slate-50 dark:bg-slate-800/50 p-6 border-b border-slate-200 dark:border-slate-700">
                    <label className="block text-sm font-bold text-slate-500 uppercase mb-2">Select Event</label>
                    <select 
                        value={selectedTournament}
                        onChange={(e) => setSelectedTournament(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-gamepedia-blue outline-none"
                    >
                        {MOCK_TOURNAMENTS.map(t => (
                            <option key={t.id} value={t.id}>{t.name} ({t.tier})</option>
                        ))}
                    </select>
                    {tournament && (
                        <div className="mt-4 flex gap-4 text-sm text-slate-500 dark:text-slate-400">
                            <span className="flex items-center"><Trophy size={14} className="mr-1"/> {tournament.prizePool}</span>
                            <span className="flex items-center"><Users size={14} className="mr-1"/> {tournament.teamsCount} Slots</span>
                        </div>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                    {/* Team Details */}
                    <div className="space-y-4">
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white border-l-4 border-gamepedia-blue pl-3">Team Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Team Name</label>
                                <input 
                                    type="text" 
                                    required
                                    value={teamName}
                                    onChange={(e) => setTeamName(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-gamepedia-blue outline-none dark:text-white"
                                    placeholder="e.g. Team Soul"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Contact Email</label>
                                <div className="relative">
                                    <input 
                                        type="email" 
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-gamepedia-blue outline-none dark:text-white"
                                        placeholder="manager@example.com"
                                    />
                                    <Mail size={18} className="absolute left-3 top-3.5 text-slate-400" />
                                </div>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Discord ID (Manager/IGL)</label>
                                <div className="relative">
                                    <input 
                                        type="text" 
                                        required
                                        value={discordId}
                                        onChange={(e) => setDiscordId(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-gamepedia-blue outline-none dark:text-white"
                                        placeholder="username#1234"
                                    />
                                    <MessageSquare size={18} className="absolute left-3 top-3.5 text-slate-400" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Roster */}
                    <div className="space-y-4">
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white border-l-4 border-gamepedia-blue pl-3">Active Roster</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {roster.map((player, idx) => (
                                <div key={idx} className={idx === 4 ? "md:col-span-2" : ""}>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                                        {idx === 0 ? "IGL (Captain)" : idx === 4 ? "Substitute (Optional)" : `Player ${idx + 1}`}
                                    </label>
                                    <input 
                                        type="text" 
                                        value={player}
                                        onChange={(e) => handleRosterChange(idx, e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-gamepedia-blue outline-none dark:text-white"
                                        placeholder="In-Game Name / Character ID"
                                        required={idx < 4}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-100 dark:border-yellow-800/30 flex gap-3">
                        <AlertCircle size={20} className="text-yellow-600 dark:text-yellow-400 shrink-0 mt-0.5" />
                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                            By registering, you agree to the tournament ruleset. Ensure all player IDs are correct. Screenshots of results must be submitted to the Discord server after each match.
                        </p>
                    </div>

                    <button 
                        type="submit"
                        className="w-full py-4 bg-gamepedia-blue text-white font-bold text-lg rounded-xl hover:bg-blue-600 transition-all shadow-lg hover:shadow-blue-500/30"
                    >
                        Submit Registration
                    </button>
                </form>
            </div>
        </div>
    );
};
