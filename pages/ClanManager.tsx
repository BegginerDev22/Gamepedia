
import React, { useState } from 'react';
import { Users, Shield, UserPlus, Clock, Bell, Settings, Award, CheckCircle, XCircle, Save } from 'lucide-react';
import { MOCK_CLAN } from '../constants';

export const ClanManagerPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'roster' | 'applications' | 'notices'>('roster');
    const [clanData, setClanData] = useState(MOCK_CLAN);
    const [isEditingNotice, setIsEditingNotice] = useState(false);
    const [tempNotice, setTempNotice] = useState('');

    const handleAccept = (reqId: string) => {
        const req = clanData.requests.find(r => r.id === reqId);
        if (req) {
            setClanData(prev => ({
                ...prev,
                members: [...prev.members, { 
                    id: req.id, 
                    name: req.name, 
                    role: 'Member', 
                    contribution: 0, 
                    lastActive: 'Just now', 
                    avatar: `https://ui-avatars.com/api/?name=${req.name}&background=random` 
                }],
                requests: prev.requests.filter(r => r.id !== reqId)
            }));
        }
    };

    const handleReject = (reqId: string) => {
        setClanData(prev => ({
            ...prev,
            requests: prev.requests.filter(r => r.id !== reqId)
        }));
    };

    const saveNotice = () => {
        setClanData(prev => ({ ...prev, notice: tempNotice }));
        setIsEditingNotice(false);
    };

    const startEditingNotice = () => {
        setTempNotice(clanData.notice);
        setIsEditingNotice(true);
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-12">
            {/* Header */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="h-32 bg-slate-800 relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-gamepedia-blue to-purple-600 opacity-90"></div>
                    <div className="absolute bottom-4 right-4 flex gap-2">
                        <button className="bg-white/20 hover:bg-white/30 backdrop-blur text-white p-2 rounded-lg transition-colors">
                            <Settings size={18} />
                        </button>
                    </div>
                </div>
                <div className="px-8 pb-6 relative flex flex-col md:flex-row items-start md:items-end gap-6 -mt-10">
                    <div className="w-24 h-24 rounded-2xl bg-white dark:bg-slate-800 p-1 shadow-lg">
                        <img src={clanData.logo} alt="Clan Logo" className="w-full h-full rounded-xl object-cover" />
                    </div>
                    <div className="flex-1 mb-1">
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-heading font-bold text-slate-900 dark:text-white">{clanData.name}</h1>
                            <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs font-bold rounded uppercase tracking-wider">
                                Lv.{clanData.level}
                            </span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">"{clanData.motto}"</p>
                    </div>
                    <div className="flex gap-4 text-sm text-slate-500 dark:text-slate-400 mb-2">
                        <span className="flex items-center"><Users size={16} className="mr-1.5"/> {clanData.members.length} Members</span>
                        <span className="flex items-center"><Award size={16} className="mr-1.5"/> Top 100</span>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-700 w-fit">
                <button 
                    onClick={() => setActiveTab('roster')}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center ${activeTab === 'roster' ? 'bg-slate-100 dark:bg-slate-800 text-gamepedia-blue' : 'text-slate-500 dark:text-slate-400'}`}
                >
                    <Users size={16} className="mr-2" /> Roster
                </button>
                <button 
                    onClick={() => setActiveTab('applications')}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center ${activeTab === 'applications' ? 'bg-slate-100 dark:bg-slate-800 text-gamepedia-blue' : 'text-slate-500 dark:text-slate-400'}`}
                >
                    <UserPlus size={16} className="mr-2" /> Applications
                    {clanData.requests.length > 0 && <span className="ml-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{clanData.requests.length}</span>}
                </button>
                <button 
                    onClick={() => setActiveTab('notices')}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center ${activeTab === 'notices' ? 'bg-slate-100 dark:bg-slate-800 text-gamepedia-blue' : 'text-slate-500 dark:text-slate-400'}`}
                >
                    <Bell size={16} className="mr-2" /> Notices
                </button>
            </div>

            {/* Content */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 min-h-[400px]">
                {activeTab === 'roster' && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase text-xs border-b border-slate-200 dark:border-slate-700">
                                <tr>
                                    <th className="px-6 py-4">Name</th>
                                    <th className="px-6 py-4">Role</th>
                                    <th className="px-6 py-4">Contribution</th>
                                    <th className="px-6 py-4 text-right">Last Active</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {clanData.members.map(member => (
                                    <tr key={member.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4 flex items-center gap-3">
                                            <img src={member.avatar} className="w-8 h-8 rounded-full" />
                                            <span className="font-bold text-slate-900 dark:text-white">{member.name}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${
                                                member.role === 'Leader' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                                member.role === 'Co-Leader' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                                                member.role === 'Elite' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                                                'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                                            }`}>
                                                {member.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-slate-600 dark:text-slate-300">
                                            {member.contribution.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-right text-slate-500 flex items-center justify-end gap-2">
                                            <Clock size={14} /> {member.lastActive}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'applications' && (
                    <div className="p-6 space-y-4">
                        {clanData.requests.length > 0 ? clanData.requests.map(req => (
                            <div key={req.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white">{req.name}</h4>
                                    <div className="text-xs text-slate-500 mt-1 flex gap-3">
                                        <span>KD: <strong className="text-slate-700 dark:text-slate-300">{req.kd}</strong></span>
                                        <span>Date: {req.date}</span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => handleAccept(req.id)} className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors">
                                        <CheckCircle size={20} />
                                    </button>
                                    <button onClick={() => handleReject(req.id)} className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors">
                                        <XCircle size={20} />
                                    </button>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-12 text-slate-500">
                                <Shield size={48} className="mx-auto mb-3 opacity-30" />
                                <p>No pending applications.</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'notices' && (
                    <div className="p-6">
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Internal Noticeboard</label>
                        {isEditingNotice ? (
                            <div className="space-y-4">
                                <textarea 
                                    value={tempNotice}
                                    onChange={(e) => setTempNotice(e.target.value)}
                                    className="w-full h-40 p-4 bg-white dark:bg-slate-800 border border-gamepedia-blue rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none"
                                />
                                <div className="flex justify-end gap-2">
                                    <button onClick={() => setIsEditingNotice(false)} className="px-4 py-2 text-slate-500 hover:text-slate-700 font-bold text-sm">Cancel</button>
                                    <button onClick={saveNotice} className="px-4 py-2 bg-gamepedia-blue text-white font-bold text-sm rounded-lg flex items-center">
                                        <Save size={16} className="mr-2" /> Save
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="w-full h-40 p-4 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-xl text-sm text-yellow-900 dark:text-yellow-100 leading-relaxed whitespace-pre-wrap">
                                    {clanData.notice}
                                </div>
                                <div className="mt-4 flex justify-end">
                                    <button onClick={startEditingNotice} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-sm rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                                        Edit Notice
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
