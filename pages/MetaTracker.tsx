
import React, { useState } from 'react';
import { Layers, ArrowUp, ArrowDown, Minus, Zap, AlertCircle, Shield } from 'lucide-react';
import { MOCK_PATCH_NOTES, MOCK_META_TIER_LIST } from '../constants';
import { PatchNote } from '../types';

export const MetaTrackerPage: React.FC = () => {
    const [activePatchId, setActivePatchId] = useState(MOCK_PATCH_NOTES[0].id);
    const activePatch = MOCK_PATCH_NOTES.find(p => p.id === activePatchId) || MOCK_PATCH_NOTES[0];

    const getImpactColor = (impact: string) => {
        switch(impact) {
            case 'High': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
            case 'Medium': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
            default: return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-12">
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-3xl font-heading font-bold text-slate-900 dark:text-white flex items-center justify-center">
                    <Layers className="mr-3 text-gamepedia-blue" /> Meta Report & Patch Notes
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">
                    Stay ahead of the competition. Track buffs, nerfs, and the current weapon tier list.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar: Version Selector */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                        <div className="p-4 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 font-bold text-sm text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                            Patch History
                        </div>
                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                            {MOCK_PATCH_NOTES.map(patch => (
                                <button 
                                    key={patch.id}
                                    onClick={() => setActivePatchId(patch.id)}
                                    className={`w-full text-left p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex justify-between items-center ${activePatchId === patch.id ? 'bg-blue-50 dark:bg-blue-900/10 border-l-4 border-gamepedia-blue' : 'border-l-4 border-transparent'}`}
                                >
                                    <div>
                                        <div className="font-bold text-slate-900 dark:text-white">{patch.version}</div>
                                        <div className="text-xs text-slate-500">{patch.date}</div>
                                    </div>
                                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${getImpactColor(patch.impactRating)}`}>
                                        {patch.impactRating} Impact
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Pro Tip Card */}
                    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl p-5 text-white shadow-lg">
                        <Zap size={24} className="mb-2 text-yellow-400" />
                        <h4 className="font-bold text-lg mb-1">Meta Tip</h4>
                        <p className="text-sm text-indigo-100 leading-relaxed">
                            The {activePatch.version} update shifted the meta towards SMGs in close range. Drop the shotgun and pick up a UMP45!
                        </p>
                    </div>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-3 space-y-8">
                    {/* Patch Overview */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <span className="text-gamepedia-blue font-mono font-bold text-sm">{activePatch.version}</span>
                                <h2 className="text-2xl font-heading font-bold text-slate-900 dark:text-white mt-1">{activePatch.title}</h2>
                            </div>
                            <div className="text-right text-sm text-slate-500">
                                Released: {activePatch.date}
                            </div>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed border-b border-slate-100 dark:border-slate-800 pb-6 mb-6">
                            {activePatch.description}
                        </p>

                        <div className="space-y-4">
                            {activePatch.changes.map((change, idx) => (
                                <div key={idx} className="flex items-start space-x-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800">
                                    <div className={`p-2 rounded-full shrink-0 ${
                                        change.type === 'Buff' ? 'bg-green-100 text-green-600 dark:bg-green-900/20' :
                                        change.type === 'Nerf' ? 'bg-red-100 text-red-600 dark:bg-red-900/20' :
                                        change.type === 'New' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/20' :
                                        'bg-blue-100 text-blue-600 dark:bg-blue-900/20'
                                    }`}>
                                        {change.type === 'Buff' && <ArrowUp size={20} />}
                                        {change.type === 'Nerf' && <ArrowDown size={20} />}
                                        {change.type === 'New' && <Zap size={20} />}
                                        {change.type === 'Adjustment' && <Minus size={20} />}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-bold text-slate-900 dark:text-white">{change.item}</span>
                                            <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                                                change.type === 'Buff' ? 'text-green-600 bg-green-50 dark:bg-green-900/10' :
                                                change.type === 'Nerf' ? 'text-red-600 bg-red-50 dark:bg-red-900/10' :
                                                'text-slate-500 bg-slate-200 dark:bg-slate-700'
                                            }`}>
                                                {change.type}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-600 dark:text-slate-400">{change.details}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Meta Tier List */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                        <div className="p-6 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/30 flex justify-between items-center">
                            <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center">
                                <Shield className="mr-2 text-gamepedia-blue" /> Weapon Meta Tier List
                            </h3>
                            <span className="text-xs text-slate-500">Updated for {activePatch.version}</span>
                        </div>
                        
                        <div className="p-6 space-y-2">
                            {MOCK_META_TIER_LIST.map(tier => (
                                <div key={tier.tier} className="flex rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 h-16">
                                    <div className={`w-20 flex items-center justify-center font-heading font-bold text-2xl text-white shadow-inner ${
                                        tier.tier === 'S' ? 'bg-gradient-to-br from-red-500 to-red-600' :
                                        tier.tier === 'A' ? 'bg-gradient-to-br from-orange-400 to-orange-500' :
                                        tier.tier === 'B' ? 'bg-gradient-to-br from-yellow-400 to-yellow-500' :
                                        'bg-gradient-to-br from-slate-400 to-slate-500'
                                    }`}>
                                        {tier.tier}
                                    </div>
                                    <div className="flex-1 bg-slate-50 dark:bg-slate-800 flex items-center px-4 gap-3 overflow-x-auto no-scrollbar">
                                        {tier.items.map(item => (
                                            <span key={item} className="px-3 py-1.5 bg-white dark:bg-slate-700 rounded text-xs font-bold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 whitespace-nowrap shadow-sm">
                                                {item}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="px-6 pb-6">
                            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-800/30 rounded-lg flex items-start">
                                <AlertCircle size={18} className="text-yellow-600 dark:text-yellow-400 mr-3 mt-0.5 shrink-0" />
                                <p className="text-sm text-yellow-800 dark:text-yellow-200 leading-relaxed">
                                    <strong>Analysis:</strong> The P90 is currently broken. If you find it in an airdrop, take it. The built-in holographic sight and zero recoil make it the best close-range weapon in the game, surpassing even the DBS.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
