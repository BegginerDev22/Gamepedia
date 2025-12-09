import React, { useState, useEffect } from 'react';
import { 
  Users, Trophy, FileText, Activity, Settings, Plus, Search, 
  AlertCircle, CheckCircle, X, Save, Image as ImageIcon, Upload,
  ShieldAlert, RotateCcw, GitCommit, Clock, ArrowRight, Check, XCircle,
  History, List, Hash, Pencil, Video, PlayCircle, CheckSquare
} from 'lucide-react';
import { MOCK_TOURNAMENTS } from '../constants';
import { TournamentTier, Tournament, MatchStatus, Match } from '../types';
import { useUser } from '../contexts/UserContext';
import { useMatches } from '../contexts/MatchContext';

// Mock data for the dashboard
const RECENT_EDITS = [
    { id: 1, page: 'Team Soul', user: 'Editor_X', time: '2 mins ago', status: 'Pending' },
    { id: 2, page: 'BGIS 2024', user: 'Admin_Y', time: '1 hour ago', status: 'Approved' },
    { id: 3, page: 'Mortal (Player)', user: 'NewUser_123', time: '3 hours ago', status: 'Rejected' },
];

const MOCK_USERS = [
    { id: 1, name: 'Admin User', role: 'Super Admin', email: 'admin@gamepedia.com', status: 'Active' },
    { id: 2, name: 'Content Editor', role: 'Editor', email: 'editor@gamepedia.com', status: 'Active' },
    { id: 3, name: 'Moderator One', role: 'Moderator', email: 'mod@gamepedia.com', status: 'Away' },
    { id: 4, name: 'ScoutOP', role: 'User', email: 'scout@gamepedia.com', status: 'Active' },
    { id: 5, name: 'Mortal', role: 'User', email: 'mortal@gamepedia.com', status: 'Active' },
];

const INITIAL_PENDING_EDITS = [
  {
    id: 101,
    target: 'Team Soul',
    author: 'Editor_X',
    timestamp: '2024-04-15 10:30 AM',
    summary: 'Roster Update',
    changes: [
      { label: 'Player 1', old: 'Goblin', new: 'Spower' },
      { label: 'Role', old: 'Assaulter', new: 'Entry Fragger' }
    ]
  },
  {
    id: 102,
    target: 'BGIS 2024',
    author: 'TournamentOp',
    timestamp: '2024-04-15 11:45 AM',
    summary: 'Prize Pool Adjustment',
    changes: [
      { label: 'Prize Pool', old: '1,00,00,000', new: '2,00,00,000' }
    ]
  }
];

const INITIAL_MODERATION_LOG = [
    { id: 1, action: 'Approved Edit', target: 'GodLike Stats', moderator: 'Admin', time: '2 hours ago' },
    { id: 2, action: 'Rejected Edit', target: 'Mortal Bio', moderator: 'Admin', time: '5 hours ago' },
    { id: 3, action: 'Rolled Back', target: 'Match #45 Result', moderator: 'SuperAdmin', time: '1 day ago' },
];

const DiffViewer: React.FC<{ changes: any[] }> = ({ changes }) => (
  <div className="mt-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
    <h4 className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-3 flex items-center">
      <GitCommit size={14} className="mr-2" /> Changes Detected
    </h4>
    <div className="space-y-3">
      {changes.map((change, idx) => (
        <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
             <span className="text-xs font-semibold text-red-500 uppercase">{change.label} (Original)</span>
             <div className="p-2 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 rounded text-red-700 dark:text-red-300 line-through decoration-red-400/50 min-h-[38px] flex items-center">
               {change.old}
             </div>
          </div>
          <div className="space-y-1">
             <span className="text-xs font-semibold text-green-500 uppercase">{change.label} (New)</span>
             <div className="p-2 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/30 rounded text-green-700 dark:text-green-300 min-h-[38px] flex items-center">
               {change.new}
             </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Modal for settling bets/finishing match
const SettleMatchModal: React.FC<{ match: Match; onClose: () => void; onSettle: (data: { scoreA: number, scoreB: number, winnerId: string }) => void }> = ({ match, onClose, onSettle }) => {
    const [scoreA, setScoreA] = useState(match.scoreA || 0);
    const [scoreB, setScoreB] = useState(match.scoreB || 0);
    const [winnerId, setWinnerId] = useState<string>('');

    const handleSubmit = () => {
        if (!winnerId) {
            alert("Please select a winner");
            return;
        }
        onSettle({ scoreA, scoreB, winnerId });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-lg border border-slate-200 dark:border-slate-700">
                <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                    <h3 className="font-bold text-xl text-slate-900 dark:text-white">Finalize Match Result</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-500"><X size={20} /></button>
                </div>
                <div className="p-6 space-y-6">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex flex-col items-center">
                            <img src={match.teamA.logoUrl} className="w-12 h-12 rounded mb-2" />
                            <span className="font-bold text-slate-900 dark:text-white text-sm">{match.teamA.shortName}</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <input type="number" value={scoreA} onChange={e => setScoreA(parseInt(e.target.value))} className="w-16 p-2 text-center text-xl font-bold rounded border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
                            <span className="font-bold text-slate-400">-</span>
                            <input type="number" value={scoreB} onChange={e => setScoreB(parseInt(e.target.value))} className="w-16 p-2 text-center text-xl font-bold rounded border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
                        </div>
                        <div className="flex flex-col items-center">
                            <img src={match.teamB.logoUrl} className="w-12 h-12 rounded mb-2" />
                            <span className="font-bold text-slate-900 dark:text-white text-sm">{match.teamB.shortName}</span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Declare Winner (Settles Bets)</label>
                        <div className="grid grid-cols-2 gap-4">
                            <button 
                                onClick={() => setWinnerId(match.teamA.id)}
                                className={`p-3 rounded-lg border-2 flex items-center justify-center space-x-2 transition-all ${winnerId === match.teamA.id ? 'border-gamepedia-blue bg-blue-50 dark:bg-blue-900/20 text-gamepedia-blue font-bold' : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300'}`}
                            >
                                <span>{match.teamA.name}</span>
                                {winnerId === match.teamA.id && <CheckCircle size={16} />}
                            </button>
                            <button 
                                onClick={() => setWinnerId(match.teamB.id)}
                                className={`p-3 rounded-lg border-2 flex items-center justify-center space-x-2 transition-all ${winnerId === match.teamB.id ? 'border-gamepedia-blue bg-blue-50 dark:bg-blue-900/20 text-gamepedia-blue font-bold' : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300'}`}
                            >
                                <span>{match.teamB.name}</span>
                                {winnerId === match.teamB.id && <CheckCircle size={16} />}
                            </button>
                        </div>
                    </div>

                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-800 rounded-lg p-4 flex items-start">
                        <AlertCircle size={20} className="text-yellow-600 dark:text-yellow-400 mt-0.5 mr-3 shrink-0" />
                        <div className="text-sm text-yellow-700 dark:text-yellow-300">
                            <span className="font-bold block">Warning: This action is irreversible.</span>
                            Submitting this result will immediately finish the match, update the bracket, and distribute points to all users who predicted the winner correctly.
                        </div>
                    </div>
                </div>
                <div className="p-6 border-t border-slate-200 dark:border-slate-800 flex justify-end space-x-3">
                    <button onClick={onClose} className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">Cancel</button>
                    <button onClick={handleSubmit} className="px-4 py-2 bg-gamepedia-blue text-white font-bold rounded-lg hover:bg-blue-600 shadow-lg shadow-blue-500/30">Finalize & Settle</button>
                </div>
            </div>
        </div>
    );
};

const TournamentForm: React.FC<{ onCancel: () => void; onSave: (data: Partial<Tournament>) => void; initialData?: Tournament }> = ({ onCancel, onSave, initialData }) => {
  const [pointsSystem, setPointsSystem] = useState('official_2024');
  
  // Local state for form fields
  const [formData, setFormData] = useState<Partial<Tournament>>({
      name: initialData?.name || '',
      organizer: initialData?.organizer || '',
      tier: initialData?.tier || TournamentTier.B, // Default tier
      teamsCount: initialData?.teamsCount || 0,
      dates: initialData?.dates || '',
      prizePool: initialData?.prizePool || '',
      location: initialData?.location || '',
      bannerUrl: initialData?.bannerUrl || '',
      logoUrl: initialData?.logoUrl || ''
  });

  const handleChange = (field: keyof Tournament, value: any) => {
      setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
      // Basic validation could go here
      if (!formData.name) {
          alert("Tournament Name is required");
          return;
      }
      onSave(formData);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 transition-colors duration-200">
       {/* Header */}
       <div className="flex justify-between items-center mb-8 border-b border-slate-100 dark:border-slate-800 pb-4">
         <div>
            <h3 className="font-heading font-bold text-xl text-slate-900 dark:text-white">
              {initialData ? 'Edit Tournament' : 'Create New Tournament'}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {initialData ? `Editing details for ${initialData.name}` : 'Enter tournament details to set up a new event page.'}
            </p>
         </div>
         <button onClick={onCancel} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            <X size={24}/>
         </button>
       </div>

       <div className="space-y-8">
          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column: Basic Info */}
              <div className="space-y-6">
                  <div className="col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Tournament Name</label>
                    <input 
                        type="text" 
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-gamepedia-blue/20 focus:border-gamepedia-blue outline-none transition-all" 
                        placeholder="e.g. BGIS 2024: The Grind" 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Organizer</label>
                    <input 
                        type="text" 
                        value={formData.organizer}
                        onChange={(e) => handleChange('organizer', e.target.value)}
                        className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-gamepedia-blue/20 focus:border-gamepedia-blue outline-none transition-all" 
                        placeholder="e.g. Krafton" 
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Tier</label>
                        <div className="relative">
                            <select 
                                value={formData.tier}
                                onChange={(e) => handleChange('tier', e.target.value as TournamentTier)}
                                className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white appearance-none focus:ring-2 focus:ring-gamepedia-blue/20 focus:border-gamepedia-blue outline-none transition-all cursor-pointer"
                            >
                                {Object.values(TournamentTier).map(tier => <option key={tier} value={tier}>{tier}</option>)}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-slate-500">
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                            </div>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Teams Count</label>
                        <input 
                            type="number" 
                            value={formData.teamsCount}
                            onChange={(e) => handleChange('teamsCount', parseInt(e.target.value) || 0)}
                            className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-gamepedia-blue/20 focus:border-gamepedia-blue outline-none transition-all" 
                            placeholder="32" 
                        />
                      </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Dates</label>
                    <div className="relative">
                        <CalendarIcon className="absolute left-3 top-3 text-slate-400" size={18} />
                        <input 
                            type="text" 
                            value={formData.dates}
                            onChange={(e) => handleChange('dates', e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-gamepedia-blue/20 focus:border-gamepedia-blue outline-none transition-all" 
                            placeholder="Apr 4 - Apr 28, 2024" 
                        />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Prize Pool</label>
                    <div className="relative">
                        <span className="absolute left-3 top-2.5 text-slate-400 font-bold">₹</span>
                        <input 
                            type="text" 
                            value={formData.prizePool}
                            onChange={(e) => handleChange('prizePool', e.target.value)}
                            className="w-full pl-8 pr-4 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-gamepedia-blue/20 focus:border-gamepedia-blue outline-none transition-all" 
                            placeholder="2,00,00,000" 
                        />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Location</label>
                    <input 
                        type="text" 
                        value={formData.location}
                        onChange={(e) => handleChange('location', e.target.value)}
                        className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-gamepedia-blue/20 focus:border-gamepedia-blue outline-none transition-all" 
                        placeholder="e.g. Online / Mumbai" 
                    />
                  </div>
              </div>

              {/* Right Column: Media */}
              <div className="space-y-6">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Banner Image</label>
                  <div className={`border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-gamepedia-blue dark:hover:border-gamepedia-blue transition-all cursor-pointer h-48 group bg-slate-50 dark:bg-slate-800/50 overflow-hidden relative`}>
                    {formData.bannerUrl ? (
                      <>
                        <img src={formData.bannerUrl} alt="Banner" className="w-full h-full object-cover opacity-70 group-hover:opacity-40 transition-opacity" />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                           <div className="bg-slate-900/80 text-white px-4 py-2 rounded-lg text-sm font-bold">Change Banner</div>
                        </div>
                      </>
                    ) : (
                      <div className="p-8 flex flex-col items-center" onClick={() => handleChange('bannerUrl', 'https://picsum.photos/1200/400?random=' + Math.random())}>
                        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <ImageIcon size={24} className="text-slate-400 group-hover:text-gamepedia-blue" />
                        </div>
                        <span className="text-sm font-medium group-hover:text-gamepedia-blue transition-colors">Click to upload banner</span>
                        <span className="text-xs text-slate-400 mt-1">1200x400px recommended</span>
                      </div>
                    )}
                  </div>

                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Tournament Logo</label>
                  <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-6 flex items-center space-x-4 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-gamepedia-blue dark:hover:border-gamepedia-blue transition-all cursor-pointer group bg-slate-50 dark:bg-slate-800/50">
                    {formData.logoUrl ? (
                       <div className="w-16 h-16 rounded-lg bg-slate-200 dark:bg-slate-700 overflow-hidden shrink-0 relative">
                         <img src={formData.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                       </div>
                    ) : (
                       <div className="w-16 h-16 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0" onClick={() => handleChange('logoUrl', 'https://picsum.photos/200/200?random=' + Math.random())}>
                           <Upload size={20} className="text-slate-400 group-hover:text-gamepedia-blue" />
                       </div>
                    )}
                    <div>
                        <span className="text-sm font-medium block group-hover:text-gamepedia-blue transition-colors">
                            {formData.logoUrl ? 'Change Logo' : 'Upload Logo'}
                        </span>
                        <span className="text-xs text-slate-400">200x200px PNG or JPG</span>
                    </div>
                  </div>
              </div>
          </div>

          {/* Advanced Configuration Section */}
          <div className="border-t border-slate-100 dark:border-slate-800 pt-8">
                <h4 className="text-lg font-heading font-bold text-slate-900 dark:text-white mb-6 flex items-center">
                    <Settings size={20} className="mr-2 text-gamepedia-blue" />
                    Advanced Configuration
                 </h4>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                    
                    {/* Bracket Config */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Bracket Format</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <List size={16} className="text-slate-400" />
                            </div>
                            <select className="w-full pl-10 pr-4 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white appearance-none focus:ring-2 focus:ring-gamepedia-blue/20 focus:border-gamepedia-blue outline-none transition-all cursor-pointer">
                                <option value="single">Single Elimination</option>
                                <option value="double">Double Elimination</option>
                                <option value="round_robin">Round Robin</option>
                                <option value="swiss">Swiss System</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-slate-500">
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                            </div>
                        </div>
                        <p className="text-xs text-slate-500 mt-2">Structure for the main stage of the tournament.</p>
                    </div>

                    {/* Visibility Config */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Visibility Status</label>
                        <div className="flex items-center space-x-2 bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-300 dark:border-slate-700">
                             <input type="checkbox" id="publicDraft" className="w-4 h-4 rounded border-slate-300 text-gamepedia-blue focus:ring-gamepedia-blue bg-white dark:bg-slate-900 cursor-pointer" />
                             <label htmlFor="publicDraft" className="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer">Save as Draft (Hidden from public view)</label>
                        </div>
                    </div>

                    {/* Points System Configuration Section */}
                    <div className="md:col-span-2 border-t border-slate-200 dark:border-slate-700 pt-6 mt-2">
                        <h5 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center text-sm uppercase tracking-wide">
                           <Hash size={16} className="mr-2 text-gamepedia-blue" />
                           Points System Configuration
                        </h5>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">System Preset</label>
                                <div className="relative">
                                    <select 
                                        value={pointsSystem}
                                        onChange={(e) => setPointsSystem(e.target.value)}
                                        className="w-full px-4 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white appearance-none focus:ring-2 focus:ring-gamepedia-blue/20 focus:border-gamepedia-blue outline-none transition-all cursor-pointer"
                                    >
                                        <option value="official_2024">Official 2024 (10/6/5...)</option>
                                        <option value="classic_15">Classic (15 pts WWCD)</option>
                                        <option value="custom">Custom Configuration</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-slate-500">
                                        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                                    </div>
                                </div>
                                <p className="text-xs text-slate-500 mt-2">Select the scoring rules used for ranking teams in the leaderboard.</p>
                            </div>

                            {/* Preview / Editor */}
                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-4 shadow-sm">
                                {pointsSystem === 'official_2024' && (
                                    <div className="text-sm">
                                        <div className="flex justify-between mb-1.5 border-b border-slate-100 dark:border-slate-800 pb-1">
                                            <span className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase">Official 2024 Format</span>
                                        </div>
                                        <div className="flex justify-between mb-1"><span className="text-slate-600 dark:text-slate-300">1st Place</span> <span className="font-mono font-bold text-gamepedia-blue">10 pts</span></div>
                                        <div className="flex justify-between mb-1"><span className="text-slate-600 dark:text-slate-300">2nd Place</span> <span className="font-mono font-bold text-slate-700 dark:text-slate-200">6 pts</span></div>
                                        <div className="flex justify-between mb-1"><span className="text-slate-600 dark:text-slate-300">3rd Place</span> <span className="font-mono font-bold text-slate-700 dark:text-slate-200">5 pts</span></div>
                                        <div className="flex justify-between border-t border-slate-100 dark:border-slate-800 mt-2 pt-2"><span className="text-slate-500 dark:text-slate-400">Per Finish</span> <span className="font-mono font-bold text-slate-900 dark:text-white">1 pt</span></div>
                                    </div>
                                )}
                                {pointsSystem === 'classic_15' && (
                                    <div className="text-sm">
                                        <div className="flex justify-between mb-1.5 border-b border-slate-100 dark:border-slate-800 pb-1">
                                            <span className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase">Classic Format</span>
                                        </div>
                                        <div className="flex justify-between mb-1"><span className="text-slate-600 dark:text-slate-300">1st Place</span> <span className="font-mono font-bold text-gamepedia-blue">15 pts</span></div>
                                        <div className="flex justify-between mb-1"><span className="text-slate-600 dark:text-slate-300">2nd Place</span> <span className="font-mono font-bold text-slate-700 dark:text-slate-200">12 pts</span></div>
                                        <div className="flex justify-between mb-1"><span className="text-slate-600 dark:text-slate-300">3rd Place</span> <span className="font-mono font-bold text-slate-700 dark:text-slate-200">10 pts</span></div>
                                        <div className="flex justify-between border-t border-slate-100 dark:border-slate-800 mt-2 pt-2"><span className="text-slate-500 dark:text-slate-400">Per Finish</span> <span className="font-mono font-bold text-slate-900 dark:text-white">1 pt</span></div>
                                    </div>
                                )}
                                {pointsSystem === 'custom' && (
                                    <div className="space-y-3">
                                        <div className="flex justify-between mb-1.5 border-b border-slate-100 dark:border-slate-800 pb-1">
                                            <span className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase">Custom Rules</span>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Placement Points (CSV)</label>
                                            <input type="text" defaultValue="10,6,5,4,3,2,1,1" className="w-full px-2 py-1.5 text-xs border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:border-gamepedia-blue outline-none" />
                                            <p className="text-[10px] text-slate-400 mt-1">Comma separated from 1st place downwards</p>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Points Per Finish</label>
                                            <input type="number" defaultValue="1" className="w-16 px-2 py-1.5 text-xs border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:border-gamepedia-blue outline-none" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                 </div>
           </div>
       </div>

       {/* Actions */}
       <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
          <button onClick={onCancel} className="px-5 py-2.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium transition-colors">Cancel</button>
          <button onClick={handleSubmit} className="px-6 py-2.5 bg-gamepedia-blue text-white rounded-lg font-bold hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-600/40 flex items-center transform active:scale-95">
            <Save size={18} className="mr-2" /> {initialData ? 'Save Changes' : 'Create Tournament'}
          </button>
       </div>
    </div>
  )
}

// Helper icon for the form
const CalendarIcon = ({ className, size }: { className?: string, size?: number }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
);

interface UndoState {
  visible: boolean;
  message: string;
  timer: ReturnType<typeof setTimeout> | null;
  onUndo?: () => void;
}

export const AdminDashboard: React.FC = () => {
  const { settleBets } = useUser();
  const { matches, updateMatch } = useMatches();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'content' | 'users' | 'tournaments' | 'moderation' | 'match_control'>('overview');
  const [isCreatingTournament, setIsCreatingTournament] = useState(false);
  const [editingTournament, setEditingTournament] = useState<Tournament | null>(null);
  const [expandedEditId, setExpandedEditId] = useState<number | null>(null);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  
  // Data State
  const [tournaments, setTournaments] = useState<Tournament[]>(MOCK_TOURNAMENTS);
  const [pendingEdits, setPendingEdits] = useState(INITIAL_PENDING_EDITS);
  const [moderationLog, setModerationLog] = useState(INITIAL_MODERATION_LOG);
  
  // Match Settlement State
  const [settlingMatch, setSettlingMatch] = useState<Match | null>(null);

  // Undo Toast State
  const [undoToast, setUndoToast] = useState<UndoState>({ visible: false, message: '', timer: null });

  const triggerUndo = (message: string, onUndoCallback?: () => void) => {
      if (undoToast.timer) clearTimeout(undoToast.timer);
      
      const timer = setTimeout(() => {
          setUndoToast(prev => ({ ...prev, visible: false }));
      }, 5000);

      setUndoToast({ visible: true, message, timer, onUndo: onUndoCallback });
  };

  const handleUndo = () => {
      if (undoToast.timer) clearTimeout(undoToast.timer);
      if (undoToast.onUndo) {
          undoToast.onUndo();
      }
      setUndoToast(prev => ({ ...prev, visible: false }));
  };

  // Match Settlement Handler
  const handleSettleMatch = ({ scoreA, scoreB, winnerId }: { scoreA: number, scoreB: number, winnerId: string }) => {
    if (!settlingMatch) return;

    // 1. Update the match status and score
    updateMatch(settlingMatch.id, {
        scoreA,
        scoreB,
        status: MatchStatus.FINISHED,
        winnerId
    });

    // 2. Settle user bets and distribute points
    const totalPayout = settleBets(settlingMatch.id, winnerId);

    setSettlingMatch(null);
    triggerUndo(`Match finished. Paid out ${totalPayout} points to winners.`);
  };

  // Moderation Handlers
  const handleModerationAction = (editId: number, action: 'Approved' | 'Rejected') => {
    const edit = pendingEdits.find(e => e.id === editId);
    if (!edit) return;

    // Optimistic update: Remove from pending
    setPendingEdits(prev => prev.filter(e => e.id !== editId));
    
    // Create Log Entry
    const newLogEntry = { 
        id: Date.now(), 
        action: `${action} Edit`, 
        target: edit.target, 
        moderator: 'You', 
        time: 'Just now' 
    };
    setModerationLog(prev => [newLogEntry, ...prev]);

    // Close expanded view if it was this item
    if (expandedEditId === editId) setExpandedEditId(null);

    // Setup Undo Logic
    triggerUndo(`Edit for ${edit.target} ${action.toLowerCase()}`, () => {
        // Restore to pending
        setPendingEdits(prev => [edit, ...prev].sort((a, b) => a.id - b.id));
        // Remove from log
        setModerationLog(prev => prev.filter(l => l.id !== newLogEntry.id));
        setExpandedEditId(edit.id); // Re-expand for context
    });
  };

  // Handler to add or update a tournament
  const handleSaveTournament = (data: Partial<Tournament>) => {
      if (editingTournament) {
          // Update existing
          const originalTournaments = [...tournaments];
          const updatedTournaments = tournaments.map(t => t.id === editingTournament.id ? { ...t, ...data } as Tournament : t);
          setTournaments(updatedTournaments);
          
          triggerUndo(`Tournament "${data.name}" updated successfully`, () => {
              setTournaments(originalTournaments);
              setEditingTournament(editingTournament);
          });
      } else {
          // Create new
          const newId = `tournament-${Date.now()}`;
          const newTournament: Tournament = {
              ...data,
              id: newId,
              teamsCount: data.teamsCount || 0,
              tier: data.tier || TournamentTier.C,
              bannerUrl: data.bannerUrl || 'https://picsum.photos/1200/400',
              logoUrl: data.logoUrl || 'https://picsum.photos/200/200'
          } as Tournament;
          
          setTournaments(prev => [...prev, newTournament]);
          
          triggerUndo(`Tournament "${data.name}" created successfully`, () => {
              setTournaments(prev => prev.filter(t => t.id !== newId));
          });
      }
      setIsCreatingTournament(false);
      setEditingTournament(null);
  };

  const StatCard = ({ title, value, icon, trend }: any) => (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 transition-colors duration-200">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{value}</h3>
        </div>
        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-gamepedia-blue">
          {icon}
        </div>
      </div>
      <div className="mt-4 flex items-center text-sm">
        <span className={trend >= 0 ? "text-green-500" : "text-red-500"}>
          {trend > 0 ? "+" : ""}{trend}%
        </span>
        <span className="text-slate-400 ml-2">from last month</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 relative pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-gamepedia-dark dark:text-white">Admin Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage content, users, and system settings.</p>
        </div>
        <div className="flex space-x-3">
          <button className="flex items-center px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
            <Settings size={18} className="mr-2" /> Settings
          </button>
          <button 
            onClick={() => { setActiveTab('tournaments'); setIsCreatingTournament(true); setEditingTournament(null); }}
            className="flex items-center px-4 py-2 bg-gamepedia-blue text-white rounded-lg hover:bg-blue-600 transition-colors shadow-md shadow-blue-500/20"
          >
            <Plus size={18} className="mr-2" /> Create New
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-700">
        <nav className="-mb-px flex space-x-8 overflow-x-auto scrollbar-hide">
          {[
            { id: 'overview', label: 'Overview', icon: Activity },
            { id: 'content', label: 'Content', icon: FileText },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'tournaments', label: 'Tournaments', icon: Trophy },
            { id: 'match_control', label: 'Match Control', icon: Video },
            { id: 'moderation', label: 'Moderation', icon: ShieldAlert },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => { 
                  setActiveTab(tab.id as any);
                  if (tab.id !== 'tournaments') {
                    setIsCreatingTournament(false);
                    setEditingTournament(null);
                  }
              }}
              className={`
                group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap
                ${activeTab === tab.id
                  ? 'border-gamepedia-blue text-gamepedia-blue'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'}
              `}
            >
              <tab.icon size={18} className={`mr-2 ${activeTab === tab.id ? 'text-gamepedia-blue' : 'text-slate-400 group-hover:text-slate-500'}`} />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="Total Users" value="12,345" icon={<Users size={24} />} trend={12} />
              <StatCard title="Active Tournaments" value={tournaments.length} icon={<Trophy size={24} />} trend={-5} />
              <StatCard title="Pending Edits" value={pendingEdits.length} icon={<FileText size={24} />} trend={24} />
              <StatCard title="System Health" value="99.9%" icon={<Activity size={24} />} trend={0.1} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 transition-colors duration-200">
                    <h3 className="font-heading font-bold text-lg mb-4 text-gamepedia-dark dark:text-white">Recent Activity</h3>
                    <div className="space-y-4">
                        {[1,2,3].map(i => (
                            <div key={i} className="flex items-start space-x-3 pb-4 border-b border-slate-100 dark:border-slate-800 last:border-0 last:pb-0">
                                <div className="w-2 h-2 mt-2 rounded-full bg-gamepedia-blue"></div>
                                <div>
                                    <p className="text-sm text-slate-700 dark:text-slate-300"><span className="font-bold">User_123</span> updated <span className="text-gamepedia-blue">Team Soul</span> roster.</p>
                                    <p className="text-xs text-slate-400 mt-1">2 hours ago</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 transition-colors duration-200">
                    <h3 className="font-heading font-bold text-lg mb-4 text-gamepedia-dark dark:text-white">Pending Approvals</h3>
                    <div className="space-y-3">
                        {RECENT_EDITS.map((edit) => (
                            <div key={edit.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                <div>
                                    <p className="text-sm font-medium text-slate-900 dark:text-white">{edit.page}</p>
                                    <p className="text-xs text-slate-500">by {edit.user} • {edit.time}</p>
                                </div>
                                <div className="flex space-x-2">
                                    <button className="p-1 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 rounded transition-colors"><CheckCircle size={18} /></button>
                                    <button className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors"><AlertCircle size={18} /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
          </div>
        )}

        {activeTab === 'content' && (
           <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors duration-200">
              <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <h3 className="font-bold text-lg text-gamepedia-dark dark:text-white">Content Management</h3>
                  <div className="relative w-full sm:w-auto">
                      <input type="text" placeholder="Search pages..." className="w-full sm:w-64 pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gamepedia-blue dark:text-white" />
                      <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
                  </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-medium">
                        <tr>
                            <th className="px-6 py-4">Page Title</th>
                            <th className="px-6 py-4">Type</th>
                            <th className="px-6 py-4">Last Edited</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                            <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">BGIS 2024</td>
                            <td className="px-6 py-4 text-slate-500 dark:text-slate-400">Tournament</td>
                            <td className="px-6 py-4 text-slate-500 dark:text-slate-400">2 mins ago</td>
                            <td className="px-6 py-4"><span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs rounded-full font-bold">Published</span></td>
                            <td className="px-6 py-4 text-right"><button className="text-gamepedia-blue hover:underline">Edit</button></td>
                        </tr>
                        <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                            <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">Goblin (Player)</td>
                            <td className="px-6 py-4 text-slate-500 dark:text-slate-400">Player</td>
                            <td className="px-6 py-4 text-slate-500 dark:text-slate-400">1 day ago</td>
                            <td className="px-6 py-4"><span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs rounded-full font-bold">Draft</span></td>
                            <td className="px-6 py-4 text-right"><button className="text-gamepedia-blue hover:underline">Edit</button></td>
                        </tr>
                    </tbody>
                </table>
              </div>
           </div>
        )}

        {activeTab === 'match_control' && (
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors duration-200">
                <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30">
                    <h3 className="font-bold text-lg text-gamepedia-dark dark:text-white flex items-center">
                        <CheckSquare className="mr-2 text-gamepedia-blue" size={20} /> Match Settlement & Scoring
                    </h3>
                    <p className="text-slate-500 text-sm mt-1">
                        Update scores for live matches and finalize results to payout predictions.
                    </p>
                </div>
                
                <div className="p-6 grid grid-cols-1 gap-4">
                    {matches.filter(m => m.status !== MatchStatus.FINISHED).map(match => (
                         <div key={match.id} className="flex flex-col sm:flex-row items-center justify-between bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 hover:shadow-md transition-shadow">
                             {/* Match Info */}
                             <div className="flex items-center gap-6 mb-4 sm:mb-0 w-full sm:w-auto justify-center sm:justify-start">
                                 <span className={`px-2 py-1 text-xs font-bold rounded-full ${match.status === MatchStatus.LIVE ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-blue-100 text-blue-600'}`}>
                                     {match.status.toUpperCase()}
                                 </span>
                                 <div className="flex items-center gap-4">
                                     <span className="font-bold text-slate-900 dark:text-white w-24 text-right">{match.teamA.name}</span>
                                     <span className="font-mono font-bold text-slate-400">VS</span>
                                     <span className="font-bold text-slate-900 dark:text-white w-24">{match.teamB.name}</span>
                                 </div>
                             </div>

                             {/* Actions */}
                             <div className="flex gap-3">
                                 <button className="px-3 py-1.5 border border-slate-300 dark:border-slate-600 rounded text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">
                                     Edit Info
                                 </button>
                                 <button 
                                     onClick={() => setSettlingMatch(match)}
                                     className="px-4 py-1.5 bg-gamepedia-blue text-white rounded text-sm font-bold hover:bg-blue-600 shadow-sm"
                                 >
                                     Settle Match
                                 </button>
                             </div>
                         </div>
                    ))}

                    {matches.filter(m => m.status !== MatchStatus.FINISHED).length === 0 && (
                        <div className="text-center py-12 text-slate-500">
                            <CheckCircle size={48} className="mx-auto mb-3 text-green-400 opacity-50" />
                            <p>No active or upcoming matches found.</p>
                        </div>
                    )}
                </div>
            </div>
        )}

        {activeTab === 'users' && (
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors duration-200">
                <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <h3 className="font-bold text-lg text-gamepedia-dark dark:text-white">User Management</h3>
                  <div className="flex items-center space-x-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <input 
                            type="text" 
                            placeholder="Search users..." 
                            value={userSearchTerm} 
                            onChange={(e) => setUserSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gamepedia-blue dark:text-white" 
                        />
                        <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
                    </div>
                    <button className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors whitespace-nowrap">Invite User</button>
                  </div>
                </div>
                <div className="p-0">
                    {MOCK_USERS.filter(u => 
                        u.name.toLowerCase().includes(userSearchTerm.toLowerCase()) || 
                        u.email.toLowerCase().includes(userSearchTerm.toLowerCase())
                    ).map(user => (
                        <div key={user.id} className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                            <div className="flex items-center space-x-4">
                                <div className="w-10 h-10 rounded-full bg-gamepedia-blue/10 flex items-center justify-center text-gamepedia-blue font-bold">
                                    {user.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-medium text-slate-900 dark:text-white">{user.name}</p>
                                    <p className="text-xs text-slate-500">{user.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-6">
                                <span className={`px-2 py-1 text-xs rounded-full font-bold ${user.role === 'Super Admin' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}>{user.role}</span>
                                <button className="text-slate-400 hover:text-gamepedia-dark dark:hover:text-white"><Settings size={16}/></button>
                            </div>
                        </div>
                    ))}
                    {MOCK_USERS.filter(u => u.name.toLowerCase().includes(userSearchTerm.toLowerCase()) || u.email.toLowerCase().includes(userSearchTerm.toLowerCase())).length === 0 && (
                        <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                            No users found matching "{userSearchTerm}"
                        </div>
                    )}
                </div>
            </div>
        )}

        {activeTab === 'tournaments' && (
             <div className="space-y-6">
                 {isCreatingTournament || editingTournament ? (
                     <TournamentForm 
                        key={editingTournament ? editingTournament.id : 'new'}
                        initialData={editingTournament || undefined}
                        onCancel={() => {
                          setIsCreatingTournament(false);
                          setEditingTournament(null);
                        }} 
                        onSave={handleSaveTournament}
                     />
                 ) : (
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Create New Card */}
                        <button onClick={() => setIsCreatingTournament(true)} className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl hover:border-gamepedia-blue dark:hover:border-gamepedia-blue hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all group h-full min-h-[200px]">
                            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-gamepedia-blue mb-4 group-hover:scale-110 transition-transform">
                                <Plus size={24} />
                            </div>
                            <h3 className="font-bold text-slate-700 dark:text-slate-300">Create Tournament</h3>
                            <p className="text-sm text-slate-400 text-center mt-2">Set up brackets, teams, and schedule</p>
                        </button>

                        {tournaments.map(t => (
                            <div key={t.id} className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col transition-colors duration-200">
                                <div className="h-32 bg-slate-200 dark:bg-slate-800 relative">
                                    <img src={t.bannerUrl} alt={t.name} className="w-full h-full object-cover opacity-80" />
                                    <span className="absolute top-2 right-2 px-2 py-1 bg-slate-900/80 text-white text-xs rounded font-bold">{t.tier}</span>
                                </div>
                                <div className="p-5 flex-1 flex flex-col">
                                    <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1">{t.name}</h3>
                                    <p className="text-sm text-slate-500 mb-4">{t.organizer}</p>
                                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                                        <span className="text-xs font-medium text-gamepedia-success flex items-center">
                                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div> Active
                                        </span>
                                        <div className="flex space-x-3">
                                          <button 
                                            onClick={() => setEditingTournament(t)}
                                            className="text-slate-400 hover:text-gamepedia-blue transition-colors"
                                            title="Edit Tournament"
                                          >
                                            <Pencil size={16} />
                                          </button>
                                          <button className="text-sm font-medium text-gamepedia-blue hover:underline">Manage</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                     </div>
                 )}
             </div>
        )}

        {activeTab === 'moderation' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Queue Section */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 transition-colors duration-200">
                        <div className="flex justify-between items-center mb-6">
                           <h3 className="font-bold text-lg text-gamepedia-dark dark:text-white flex items-center">
                               <ShieldAlert className="mr-2 text-gamepedia-blue" size={20} /> Moderation Queue
                           </h3>
                           <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-gamepedia-blue text-xs font-bold rounded-full">
                               {pendingEdits.length} Pending
                           </span>
                        </div>

                        <div className="space-y-4">
                            {pendingEdits.length === 0 && (
                                <div className="text-center py-12 text-slate-500 dark:text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
                                    <CheckCircle size={48} className="mx-auto mb-4 text-green-500 opacity-50" />
                                    <p>All caught up! No pending edits.</p>
                                </div>
                            )}
                            {pendingEdits.map(edit => (
                                <div key={edit.id} className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden transition-colors">
                                    <div 
                                        onClick={() => setExpandedEditId(expandedEditId === edit.id ? null : edit.id)}
                                        className={`p-4 bg-white dark:bg-slate-800/50 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${expandedEditId === edit.id ? 'bg-slate-50 dark:bg-slate-800' : ''}`}
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div className={`w-2 h-12 rounded-full ${expandedEditId === edit.id ? 'bg-gamepedia-blue' : 'bg-slate-200 dark:bg-slate-700'}`}></div>
                                            <div>
                                                <h4 className="font-bold text-slate-900 dark:text-white">{edit.target}</h4>
                                                <div className="flex items-center text-xs text-slate-500 mt-1 space-x-2">
                                                    <span className="font-medium text-slate-700 dark:text-slate-300">{edit.author}</span>
                                                    <span>•</span>
                                                    <span>{edit.timestamp}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-4">
                                            <span className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-1 rounded">{edit.summary}</span>
                                            <ArrowRight size={16} className={`text-slate-400 transition-transform ${expandedEditId === edit.id ? 'rotate-90' : ''}`} />
                                        </div>
                                    </div>

                                    {expandedEditId === edit.id && (
                                        <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30">
                                            <DiffViewer changes={edit.changes} />
                                            <div className="flex justify-end space-x-3 mt-6">
                                                <button className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium text-sm transition-colors">View Full Page</button>
                                                <button 
                                                    onClick={() => handleModerationAction(edit.id, 'Rejected')}
                                                    className="flex items-center px-4 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-sm font-bold transition-colors"
                                                >
                                                    <XCircle size={16} className="mr-2" /> Reject
                                                </button>
                                                <button 
                                                    onClick={() => handleModerationAction(edit.id, 'Approved')}
                                                    className="flex items-center px-4 py-2 bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg text-sm font-bold transition-colors"
                                                >
                                                    <Check size={16} className="mr-2" /> Approve
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Log Section */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 transition-colors duration-200">
                        <h3 className="font-bold text-lg text-gamepedia-dark dark:text-white mb-4 flex items-center">
                            <History className="mr-2 text-slate-400" size={20} /> Recent Actions
                        </h3>
                        <div className="space-y-4">
                            {moderationLog.map(log => (
                                <div key={log.id} className="flex flex-col p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700/50 relative group">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                                            log.action.includes('Approved') ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                            log.action.includes('Rejected') ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                            'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                                        }`}>
                                            {log.action}
                                        </span>
                                        <span className="text-[10px] text-slate-400 flex items-center">
                                            <Clock size={10} className="mr-1" /> {log.time}
                                        </span>
                                    </div>
                                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200 mb-1">{log.target}</p>
                                    <p className="text-xs text-slate-500">By {log.moderator}</p>

                                    {/* Rollback Button Overlay */}
                                    <div className="absolute inset-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                                        <button 
                                            onClick={() => triggerUndo(`Reverted action: ${log.action} on ${log.target}`)}
                                            className="flex items-center px-3 py-1.5 bg-gamepedia-blue text-white text-xs font-bold rounded hover:bg-blue-600 transition-colors shadow-md"
                                        >
                                            <RotateCcw size={14} className="mr-1.5" /> Revert Action
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-4 py-2 text-sm text-slate-500 dark:text-slate-400 hover:text-gamepedia-blue dark:hover:text-gamepedia-blue border-t border-slate-100 dark:border-slate-800">
                            View Full Log
                        </button>
                    </div>
                </div>
            </div>
        )}
      </div>

      {/* Modals */}
      {settlingMatch && (
          <SettleMatchModal 
              match={settlingMatch} 
              onClose={() => setSettlingMatch(null)} 
              onSettle={handleSettleMatch} 
          />
      )}

      {/* Undo Toast Notification */}
      {undoToast.visible && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-3 rounded-lg shadow-lg shadow-slate-500/20 animate-bounce-in transition-all">
              <CheckCircle size={18} className="text-green-500 mr-3" />
              <span className="text-sm font-medium mr-4">{undoToast.message}</span>
              <div className="flex items-center border-l border-slate-700 dark:border-slate-200 pl-4 space-x-3">
                  <button 
                      onClick={handleUndo}
                      className="text-sm font-bold text-gamepedia-blue hover:text-blue-400 dark:hover:text-blue-600 flex items-center transition-colors"
                  >
                      <RotateCcw size={14} className="mr-1.5" /> Undo
                  </button>
                  <button 
                      onClick={() => setUndoToast(prev => ({ ...prev, visible: false }))}
                      className="text-slate-500 hover:text-white dark:hover:text-slate-600 transition-colors"
                  >
                      <X size={14} />
                  </button>
              </div>
          </div>
      )}
    </div>
  );
};