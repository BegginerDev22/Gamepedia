
import React, { useState } from 'react';
import { FileText, Copy, RefreshCw, Check, Shield, AlertCircle, Plus, Trash2, Clock, Trophy, Ban, Map } from 'lucide-react';
import { RULESET_PRESETS } from '../constants';

interface ScheduleItem {
    id: string;
    map: string;
    time: string;
    group?: string;
}

const MAP_OPTIONS = ['Erangel', 'Miramar', 'Sanhok', 'Vikendi', 'Livik', 'Karakin'];

export const RulesetGeneratorPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'builder' | 'preview'>('builder');
    
    // Config State
    const [title, setTitle] = useState('T1 Scrims Daily');
    const [organizer, setOrganizer] = useState('Gamepedia');
    const [killPoints, setKillPoints] = useState(1);
    const [placementPoints, setPlacementPoints] = useState<number[]>([10, 6, 5, 4, 3, 2, 1, 1, 0, 0, 0, 0]);
    const [schedule, setSchedule] = useState<ScheduleItem[]>([
        { id: 'm1', map: 'Erangel', time: '14:00', group: 'A' },
        { id: 'm2', map: 'Miramar', time: '14:45', group: 'A' },
        { id: 'm3', map: 'Sanhok', time: '15:30', group: 'A' }
    ]);
    const [bannedItems, setBannedItems] = useState<string[]>(['Flare Gun', 'Shop Tokens']);
    const [customRules, setCustomRules] = useState('');
    const [formatStyle, setFormatStyle] = useState<'discord_code' | 'discord_bold'>('discord_code');
    const [copied, setCopied] = useState(false);

    // Handlers
    const handleAddMap = (mapName: string) => {
        const lastTime = schedule.length > 0 ? schedule[schedule.length - 1].time : '14:00';
        // Simple time adder +45 mins
        const [h, m] = lastTime.split(':').map(Number);
        const date = new Date();
        date.setHours(h, m + 45);
        const newTime = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;

        setSchedule([...schedule, { 
            id: Date.now().toString(), 
            map: mapName, 
            time: newTime, 
            group: 'A' 
        }]);
    };

    const removeMap = (id: string) => {
        setSchedule(schedule.filter(s => s.id !== id));
    };

    const toggleBan = (item: string) => {
        if (bannedItems.includes(item)) {
            setBannedItems(bannedItems.filter(i => i !== item));
        } else {
            setBannedItems([...bannedItems, item]);
        }
    };

    const updatePlacement = (index: number, val: number) => {
        const newPts = [...placementPoints];
        newPts[index] = val;
        setPlacementPoints(newPts);
    };

    const loadPreset = (presetId: string) => {
        const preset = RULESET_PRESETS.find(p => p.id === presetId);
        if (!preset) return;

        setTitle(preset.name);
        if (preset.id === 'bgis') {
            setPlacementPoints([10, 6, 5, 4, 3, 2, 1, 1, 0]);
            setKillPoints(1);
            setBannedItems(['Flare Gun', 'Shop Tokens', 'Emergency Pickup']);
        } else if (preset.id === 'classic') {
            setPlacementPoints([15, 12, 10, 8, 6, 4, 2, 1]);
            setKillPoints(1);
        }
        // Reset schedule as presets in constants are simple strings
        setSchedule([
            { id: 'm1', map: 'Erangel', time: '18:00', group: 'A' },
            { id: 'm2', map: 'Miramar', time: '18:45', group: 'A' },
            { id: 'm3', map: 'Erangel', time: '19:30', group: 'A' },
            { id: 'm4', map: 'Miramar', time: '20:15', group: 'A' },
        ]);
    };

    const generateOutput = () => {
        const rankList = placementPoints
            .map((pts, i) => pts > 0 ? `#${i+1}: ${pts} pts` : null)
            .filter(Boolean)
            .join(' | ');

        const scheduleList = schedule.map((s, i) => 
            `${s.time} - ${s.map} (${s.group})`
        ).join('\n');

        const bansList = bannedItems.length > 0 ? bannedItems.join(', ') : 'None';

        if (formatStyle === 'discord_code') {
            return `\`\`\`ini
[ ${title} ]
Organizer: ${organizer}

[ POINTS SYSTEM ]
Kills: ${killPoints} pt
Placement: ${rankList}

[ SCHEDULE ]
${scheduleList}

[ BANNED ITEMS ]
${bansList}

[ NOTES ]
${customRules || 'Screenshots mandatory for all matches.'}
\`\`\``;
        } else {
            return `**🏆 ${title}**\n` +
                   `*Organizer: ${organizer}*\n\n` +
                   `**📊 POINTS SYSTEM**\n` +
                   `• Kill: ${killPoints} pt\n` +
                   `• Rank: ${rankList}\n\n` +
                   `**📅 SCHEDULE**\n` +
                   schedule.map(s => `\`${s.time}\` **${s.map}**`).join('\n') + `\n\n` +
                   `**🚫 RESTRICTIONS**\n` +
                   `Banned: ${bansList}\n\n` +
                   (customRules ? `**📝 NOTES**\n${customRules}` : '');
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generateOutput());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-12">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-slate-900 dark:text-white flex items-center">
                        <FileText className="mr-3 text-gamepedia-blue" /> Ruleset Generator
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Professional rulebook builder for Discord announcements.
                    </p>
                </div>
                
                <div className="flex bg-white dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-700">
                    {RULESET_PRESETS.map(p => (
                        <button 
                            key={p.id}
                            onClick={() => loadPreset(p.id)}
                            className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-gamepedia-blue transition-colors"
                        >
                            Load {p.name}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Builder Column */}
                <div className="space-y-6">
                    {/* General Info */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 space-y-4">
                        <h3 className="font-bold text-slate-900 dark:text-white flex items-center">
                            <Trophy size={18} className="mr-2 text-gamepedia-blue"/> Event Details
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Title</label>
                                <input 
                                    type="text" 
                                    value={title} 
                                    onChange={e => setTitle(e.target.value)}
                                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:border-gamepedia-blue outline-none dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Organizer</label>
                                <input 
                                    type="text" 
                                    value={organizer} 
                                    onChange={e => setOrganizer(e.target.value)}
                                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:border-gamepedia-blue outline-none dark:text-white"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Points System */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold text-slate-900 dark:text-white flex items-center">
                                <RefreshCw size={18} className="mr-2 text-green-500"/> Scoring System
                            </h3>
                            <div className="flex items-center">
                                <span className="text-xs font-bold text-slate-500 uppercase mr-2">Per Finish:</span>
                                <input 
                                    type="number" 
                                    value={killPoints}
                                    onChange={e => setKillPoints(parseInt(e.target.value))}
                                    className="w-12 text-center bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-sm font-bold dark:text-white"
                                />
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Placement Points (Rank 1 - 12)</label>
                            <div className="grid grid-cols-6 gap-2">
                                {placementPoints.map((pts, idx) => (
                                    <div key={idx} className="relative">
                                        <span className="absolute top-1 left-1.5 text-[8px] text-slate-400">#{idx + 1}</span>
                                        <input 
                                            type="number" 
                                            value={pts}
                                            onChange={e => updatePlacement(idx, parseInt(e.target.value))}
                                            className="w-full pt-3 pb-1 text-center bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-sm font-bold dark:text-white focus:border-gamepedia-blue outline-none"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Schedule */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 space-y-4">
                        <h3 className="font-bold text-slate-900 dark:text-white flex items-center">
                            <Clock size={18} className="mr-2 text-purple-500"/> Schedule
                        </h3>
                        
                        <div className="space-y-2">
                            {schedule.map((item, idx) => (
                                <div key={item.id} className="flex items-center gap-2">
                                    <span className="text-xs font-mono text-slate-400 w-6">#{idx+1}</span>
                                    <input 
                                        type="time" 
                                        value={item.time}
                                        onChange={e => {
                                            const newSched = [...schedule];
                                            newSched[idx].time = e.target.value;
                                            setSchedule(newSched);
                                        }}
                                        className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1.5 text-sm dark:text-white"
                                    />
                                    <select 
                                        value={item.map}
                                        onChange={e => {
                                            const newSched = [...schedule];
                                            newSched[idx].map = e.target.value;
                                            setSchedule(newSched);
                                        }}
                                        className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1.5 text-sm font-bold dark:text-white"
                                    >
                                        {MAP_OPTIONS.map(m => <option key={m} value={m}>{m}</option>)}
                                    </select>
                                    <input 
                                        type="text" 
                                        value={item.group || 'A'}
                                        onChange={e => {
                                            const newSched = [...schedule];
                                            newSched[idx].group = e.target.value;
                                            setSchedule(newSched);
                                        }}
                                        className="w-12 text-center bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1.5 text-sm dark:text-white"
                                        placeholder="Grp"
                                    />
                                    <button onClick={() => removeMap(item.id)} className="p-1.5 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-wrap gap-2 pt-2">
                            {MAP_OPTIONS.map(m => (
                                <button 
                                    key={m} 
                                    onClick={() => handleAddMap(m)}
                                    className="px-3 py-1.5 text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-slate-600 dark:text-slate-300 flex items-center"
                                >
                                    <Plus size={12} className="mr-1"/> {m}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Bans & Restrictions */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 space-y-4">
                        <h3 className="font-bold text-slate-900 dark:text-white flex items-center">
                            <Ban size={18} className="mr-2 text-red-500"/> Restrictions
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {['Flare Gun', 'Shop Tokens', 'Emergency Pickup', 'Level 3 Vest', 'Shotguns', 'LMGs', 'Grenade Launcher', 'Recall Tower'].map(item => (
                                <button 
                                    key={item}
                                    onClick={() => toggleBan(item)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
                                        bannedItems.includes(item) 
                                        ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400' 
                                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'
                                    }`}
                                >
                                    {item}
                                </button>
                            ))}
                        </div>
                        <textarea 
                            value={customRules}
                            onChange={e => setCustomRules(e.target.value)}
                            placeholder="Additional notes (e.g. ID/Pass sharing time, screenshot requirements)..."
                            className="w-full h-20 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:border-gamepedia-blue outline-none dark:text-white"
                        ></textarea>
                    </div>
                </div>

                {/* Preview Column */}
                <div className="flex flex-col h-full sticky top-24">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-slate-900 dark:text-white text-sm">Output Preview</h3>
                        <div className="flex bg-white dark:bg-slate-900 rounded-lg p-1 border border-slate-200 dark:border-slate-700">
                            <button 
                                onClick={() => setFormatStyle('discord_code')}
                                className={`px-3 py-1 text-xs font-bold rounded ${formatStyle === 'discord_code' ? 'bg-slate-100 dark:bg-slate-700' : 'text-slate-500'}`}
                            >
                                Code Block
                            </button>
                            <button 
                                onClick={() => setFormatStyle('discord_bold')}
                                className={`px-3 py-1 text-xs font-bold rounded ${formatStyle === 'discord_bold' ? 'bg-slate-100 dark:bg-slate-700' : 'text-slate-500'}`}
                            >
                                Rich Text
                            </button>
                        </div>
                    </div>

                    <div className="bg-slate-800 dark:bg-black rounded-xl shadow-xl border border-slate-700 flex-1 overflow-hidden flex flex-col">
                        <div className="bg-slate-900/50 px-4 py-2 flex items-center gap-2 border-b border-slate-700">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <span className="ml-2 text-xs text-slate-500 font-mono">discord_preview.md</span>
                        </div>
                        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
                            <pre className="font-mono text-xs md:text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
                                {generateOutput()}
                            </pre>
                        </div>
                        <div className="p-4 bg-slate-900 border-t border-slate-700">
                            <button 
                                onClick={copyToClipboard}
                                className="w-full py-3 bg-gamepedia-blue text-white font-bold rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center shadow-lg shadow-blue-500/20"
                            >
                                {copied ? <Check size={18} className="mr-2" /> : <Copy size={18} className="mr-2" />}
                                {copied ? 'Copied!' : 'Copy to Clipboard'}
                            </button>
                        </div>
                    </div>
                    
                    <div className="mt-6 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 rounded-lg p-4 flex gap-3">
                        <Shield className="text-blue-600 dark:text-blue-400 shrink-0" size={20} />
                        <div className="text-sm text-blue-800 dark:text-blue-200">
                            <strong className="block mb-1">Organizer Tip</strong>
                            Always post rules at least 1 hour before start time. Use the "Code Block" format for better readability on mobile Discord apps.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
