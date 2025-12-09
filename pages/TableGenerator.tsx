
import React, { useState, useRef, useEffect } from 'react';
import { Table, Copy, Download, Plus, Trash2, Settings, Palette, FileText, Upload, RefreshCw, Layout, Check, X, ArrowUp, ArrowDown, Loader } from 'lucide-react';
import { MOCK_TEAMS } from '../constants';

interface TeamEntry {
    id: number;
    name: string;
    matches: number;
    wwcd: number;
    finishes: number;
    positionPts: number;
}

interface DesignConfig {
    theme: 'cyber' | 'minimal' | 'sport';
    primaryColor: string;
    secondaryColor: string;
    textColor: string;
    bgColor: string;
    bgImage: string;
    showMatches: boolean;
    showPosPts: boolean;
    fontScale: number;
}

const INITIAL_TEAMS: TeamEntry[] = [
    { id: 1, name: 'Team Soul', matches: 5, wwcd: 2, finishes: 42, positionPts: 35 },
    { id: 2, name: 'GodLike', matches: 5, wwcd: 1, finishes: 45, positionPts: 28 },
    { id: 3, name: 'Team XSpark', matches: 5, wwcd: 0, finishes: 30, positionPts: 20 },
    { id: 4, name: 'Blind Esports', matches: 5, wwcd: 1, finishes: 28, positionPts: 22 },
    { id: 5, name: 'Entity Gaming', matches: 5, wwcd: 0, finishes: 25, positionPts: 15 },
    { id: 6, name: 'Global Esports', matches: 5, wwcd: 1, finishes: 18, positionPts: 18 },
];

export const TableGeneratorPage: React.FC = () => {
    const [teams, setTeams] = useState<TeamEntry[]>(INITIAL_TEAMS);
    const [tournamentName, setTournamentName] = useState('BGIS 2024: The Grind');
    const [subTitle, setSubTitle] = useState('Finals - Day 1');
    const [activeTab, setActiveTab] = useState<'data' | 'design'>('data');
    const [showImport, setShowImport] = useState(false);
    const [importText, setImportText] = useState('');
    const [autoSort, setAutoSort] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);

    const [config, setConfig] = useState<DesignConfig>({
        theme: 'cyber',
        primaryColor: '#2B5DF5',
        secondaryColor: '#0F1724',
        textColor: '#FFFFFF',
        bgColor: '#0F1724',
        bgImage: 'https://raw.githubusercontent.com/pubg/api-assets/master/Assets/Maps/Erangel_Main_Low_Res.png',
        showMatches: true,
        showPosPts: true,
        fontScale: 1
    });

    const getTotal = (t: TeamEntry) => t.finishes + t.positionPts;

    // Sorting Effect
    useEffect(() => {
        if (autoSort) {
            setTeams(prev => {
                const sorted = [...prev].sort((a, b) => {
                    const totalDiff = getTotal(b) - getTotal(a);
                    if (totalDiff !== 0) return totalDiff;
                    const finishDiff = b.finishes - a.finishes;
                    if (finishDiff !== 0) return finishDiff;
                    return b.wwcd - a.wwcd;
                });
                // Avoid infinite loop by checking equality roughly
                if (JSON.stringify(sorted) !== JSON.stringify(prev)) return sorted;
                return prev;
            });
        }
    }, [autoSort, teams]); // Note: relying on teams changes might cause loop if not careful, but check handles it.

    const handleAddTeam = () => {
        const newId = Date.now();
        setTeams([...teams, { id: newId, name: 'New Team', matches: 0, wwcd: 0, finishes: 0, positionPts: 0 }]);
    };

    const handleRemoveTeam = (id: number) => {
        setTeams(teams.filter(t => t.id !== id));
    };

    const handleUpdate = (id: number, field: keyof TeamEntry, value: any) => {
        setTeams(teams.map(t => t.id === id ? { ...t, [field]: value } : t));
    };

    const moveTeam = (index: number, direction: 'up' | 'down') => {
        if (autoSort) return;
        const newTeams = [...teams];
        if (direction === 'up' && index > 0) {
            [newTeams[index], newTeams[index - 1]] = [newTeams[index - 1], newTeams[index]];
        } else if (direction === 'down' && index < newTeams.length - 1) {
            [newTeams[index], newTeams[index + 1]] = [newTeams[index + 1], newTeams[index]];
        }
        setTeams(newTeams);
    };

    const handleBatchImport = () => {
        const rows = importText.trim().split('\n');
        const newTeams: TeamEntry[] = [];
        
        rows.forEach((row, idx) => {
            const cols = row.split(/,|\t/);
            if (cols.length >= 1) {
                newTeams.push({
                    id: Date.now() + idx,
                    name: cols[0].trim(),
                    matches: parseInt(cols[1] || '0') || 0,
                    wwcd: parseInt(cols[2] || '0') || 0,
                    finishes: parseInt(cols[3] || '0') || 0,
                    positionPts: parseInt(cols[4] || '0') || 0,
                });
            }
        });

        if (newTeams.length > 0) {
            setTeams(newTeams);
            setShowImport(false);
            setImportText('');
        } else {
            alert("Could not parse data. Use CSV format: Name, Matches, WWCD, Finishes, PosPts");
        }
    };

    const handleCopyText = () => {
        let text = `**${tournamentName} - ${subTitle}**\n`;
        text += "```md\n";
        text += "#   TEAM             M   W   F   P   PTS\n";
        text += "----------------------------------------\n";
        teams.forEach((t, idx) => {
            const rank = (idx + 1).toString().padEnd(3);
            const name = t.name.padEnd(16).substring(0, 16);
            const m = t.matches.toString().padEnd(3);
            const w = t.wwcd.toString().padEnd(3);
            const f = t.finishes.toString().padEnd(3);
            const p = t.positionPts.toString().padEnd(3);
            const total = getTotal(t).toString().padStart(3);
            text += `${rank} ${name} ${m} ${w} ${f} ${p} ${total}\n`;
        });
        text += "```";
        navigator.clipboard.writeText(text);
        alert("Copied Discord-ready table to clipboard!");
    };

    const getTeamLogo = (name: string) => {
        const found = Object.values(MOCK_TEAMS).find(t => 
            t.name.toLowerCase().includes(name.toLowerCase()) || 
            t.shortName.toLowerCase() === name.toLowerCase()
        );
        return found ? found.logoUrl : null;
    };

    const generateImage = async () => {
        setIsGenerating(true);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            setIsGenerating(false);
            return;
        }

        // HD Resolution
        canvas.width = 1920;
        canvas.height = 1080;

        // Draw Background
        ctx.fillStyle = config.bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (config.bgImage) {
            try {
                const img = new Image();
                img.crossOrigin = "anonymous";
                await new Promise((resolve, reject) => {
                    img.onload = resolve;
                    img.onerror = reject;
                    img.src = config.bgImage;
                });
                
                // Cover Style
                const hRatio = canvas.width / img.width;
                const vRatio = canvas.height / img.height;
                const ratio = Math.max(hRatio, vRatio);
                const centerShift_x = (canvas.width - img.width * ratio) / 2;
                const centerShift_y = (canvas.height - img.height * ratio) / 2;
                ctx.drawImage(img, 0, 0, img.width, img.height, centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);
                
                // Dark Overlay
                ctx.fillStyle = 'rgba(0,0,0,0.75)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            } catch (e) {
                console.error("Failed to load bg", e);
            }
        }

        // Header Config
        const headerHeight = 180;
        
        // Draw Header Bar
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        gradient.addColorStop(0, config.primaryColor);
        gradient.addColorStop(1, config.secondaryColor);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, headerHeight);

        // Header Text
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 72px sans-serif'; // Simplified font family for canvas compatibility
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(tournamentName.toUpperCase(), canvas.width / 2, headerHeight / 2 - 10);
        
        ctx.font = '40px sans-serif';
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        ctx.fillText(subTitle, canvas.width / 2, headerHeight / 2 + 50);

        // Table Config
        const startY = headerHeight + 60;
        const rowHeight = 55; // Adjust based on team count to fit?
        const colX = {
            rank: 100,
            logo: 250,
            name: 350,
            m: 1100,
            w: 1250,
            f: 1400,
            p: 1550,
            t: 1750
        };

        // Column Headers
        ctx.font = 'bold 30px sans-serif';
        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        ctx.textAlign = 'center';
        ctx.fillText('#', colX.rank, startY);
        ctx.textAlign = 'left';
        ctx.fillText('TEAM', colX.name, startY);
        ctx.textAlign = 'center';
        if (config.showMatches) ctx.fillText('M', colX.m, startY);
        ctx.fillText('WWCD', colX.w, startY);
        ctx.fillText('FIN', colX.f, startY);
        if (config.showPosPts) ctx.fillText('POS', colX.p, startY);
        ctx.fillStyle = config.primaryColor;
        ctx.fillText('PTS', colX.t, startY);

        // Rows
        let currentY = startY + 60;
        
        // Load all logos first
        const logoPromises = teams.map(t => {
            const url = getTeamLogo(t.name);
            if (!url) return Promise.resolve(null);
            return new Promise<HTMLImageElement | null>((resolve) => {
                const img = new Image();
                img.crossOrigin = "anonymous";
                img.onload = () => resolve(img);
                img.onerror = () => resolve(null);
                img.src = url;
            });
        });

        const logos = await Promise.all(logoPromises);

        teams.forEach((t, i) => {
            const total = getTotal(t);
            
            // Row Background (Stripes)
            if (i < 3) {
                // Top 3 Highlight
                const grad = ctx.createLinearGradient(50, 0, 500, 0);
                grad.addColorStop(0, `${config.primaryColor}66`); // transparent
                grad.addColorStop(1, 'transparent');
                ctx.fillStyle = grad;
                ctx.fillRect(50, currentY - rowHeight/2 - 5, canvas.width - 100, rowHeight + 10);
                
                // Left Border Indicator
                ctx.fillStyle = config.primaryColor;
                ctx.fillRect(50, currentY - rowHeight/2 - 5, 8, rowHeight + 10);
            } else if (i % 2 === 0) {
                ctx.fillStyle = 'rgba(255,255,255,0.05)';
                ctx.fillRect(50, currentY - rowHeight/2 - 5, canvas.width - 100, rowHeight + 10);
            }

            // Rank
            ctx.font = 'bold 36px sans-serif';
            ctx.fillStyle = i < 3 ? config.primaryColor : '#FFFFFF';
            ctx.textAlign = 'center';
            ctx.fillText(`#${i + 1}`, colX.rank, currentY);

            // Logo
            const logoImg = logos[i];
            if (logoImg) {
                ctx.save();
                ctx.beginPath();
                ctx.arc(colX.logo, currentY - 5, 25, 0, Math.PI * 2);
                ctx.closePath();
                ctx.clip();
                ctx.drawImage(logoImg, colX.logo - 25, currentY - 30, 50, 50);
                ctx.restore();
            } else {
                // Placeholder circle
                ctx.fillStyle = 'rgba(255,255,255,0.1)';
                ctx.beginPath();
                ctx.arc(colX.logo, currentY - 5, 25, 0, Math.PI * 2);
                ctx.fill();
            }

            // Name
            ctx.font = 'bold 36px sans-serif';
            ctx.fillStyle = '#FFFFFF';
            ctx.textAlign = 'left';
            ctx.fillText(t.name.toUpperCase(), colX.name, currentY);

            // Stats
            ctx.textAlign = 'center';
            ctx.font = '36px sans-serif';
            ctx.fillStyle = 'rgba(255,255,255,0.8)';
            
            if (config.showMatches) ctx.fillText(t.matches.toString(), colX.m, currentY);
            ctx.fillText(t.wwcd.toString(), colX.w, currentY);
            ctx.fillText(t.finishes.toString(), colX.f, currentY);
            if (config.showPosPts) ctx.fillText(t.positionPts.toString(), colX.p, currentY);
            
            // Total
            ctx.font = 'bold 40px sans-serif';
            ctx.fillStyle = config.primaryColor;
            ctx.fillText(total.toString(), colX.t, currentY);

            currentY += rowHeight + 15;
        });

        // Footer
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(0, canvas.height - 60, canvas.width, 60);
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.font = '20px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('GENERATED BY GAMEPEDIA BGMI', 50, canvas.height - 22);

        // Download
        const link = document.createElement('a');
        link.download = `${tournamentName.replace(/\s+/g, '_')}_Standings.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        setIsGenerating(false);
    };

    const getThemeContainerClass = () => {
        switch(config.theme) {
            case 'sport': return 'rounded-none border-t-8';
            case 'minimal': return 'rounded-2xl border border-white/20 backdrop-blur-xl';
            case 'cyber': default: return 'rounded-sm border-2 border-white/10 clip-path-polygon';
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-12">
            <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-slate-900 dark:text-white flex items-center">
                        <Table className="mr-3 text-gamepedia-blue" /> Point Table Generator
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Create broadcast-grade standings graphics and Discord exports.
                    </p>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setActiveTab('data')} className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${activeTab === 'data' ? 'bg-gamepedia-blue text-white' : 'bg-white dark:bg-slate-800 text-slate-500'}`}>Data Entry</button>
                    <button onClick={() => setActiveTab('design')} className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${activeTab === 'design' ? 'bg-gamepedia-blue text-white' : 'bg-white dark:bg-slate-800 text-slate-500'}`}>Design & Style</button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Editor Sidebar */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-5 flex flex-col h-[700px]">
                    
                    {activeTab === 'data' ? (
                        <>
                            <div className="mb-4 space-y-3">
                                <input 
                                    type="text" 
                                    value={tournamentName}
                                    onChange={(e) => setTournamentName(e.target.value)}
                                    placeholder="Tournament Name"
                                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-bold focus:ring-2 focus:ring-gamepedia-blue outline-none dark:text-white"
                                />
                                <input 
                                    type="text" 
                                    value={subTitle}
                                    onChange={(e) => setSubTitle(e.target.value)}
                                    placeholder="Subtitle (e.g. Week 1 Finals)"
                                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-gamepedia-blue outline-none dark:text-white"
                                />
                            </div>

                            <div className="flex justify-between items-center mb-2">
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-bold text-slate-500 uppercase">{teams.length} Teams</span>
                                    <label className="flex items-center text-xs cursor-pointer text-slate-600 dark:text-slate-300">
                                        <input 
                                            type="checkbox" 
                                            checked={autoSort} 
                                            onChange={(e) => setAutoSort(e.target.checked)} 
                                            className="mr-1 accent-gamepedia-blue"
                                        />
                                        Auto Sort
                                    </label>
                                </div>
                                <button 
                                    onClick={() => setShowImport(true)}
                                    className="text-xs flex items-center text-gamepedia-blue hover:underline font-bold"
                                >
                                    <Upload size={12} className="mr-1"/> Batch Import
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto border border-slate-200 dark:border-slate-700 rounded-lg mb-4 custom-scrollbar">
                                <table className="w-full text-xs text-left">
                                    <thead className="bg-slate-100 dark:bg-slate-800 font-bold text-slate-500 sticky top-0 z-10">
                                        <tr>
                                            {!autoSort && <th className="p-2 w-6"></th>}
                                            <th className="p-2 pl-3">Team</th>
                                            <th className="p-2 w-10 text-center">M</th>
                                            <th className="p-2 w-10 text-center">W</th>
                                            <th className="p-2 w-10 text-center">Fin</th>
                                            <th className="p-2 w-10 text-center">Pos</th>
                                            <th className="p-2 w-8"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                        {teams.map((team, idx) => (
                                            <tr key={team.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 group">
                                                {!autoSort && (
                                                    <td className="p-2">
                                                        <div className="flex flex-col">
                                                            <button onClick={() => moveTeam(idx, 'up')} disabled={idx === 0} className="text-slate-300 hover:text-gamepedia-blue disabled:opacity-0"><ArrowUp size={10}/></button>
                                                            <button onClick={() => moveTeam(idx, 'down')} disabled={idx === teams.length - 1} className="text-slate-300 hover:text-gamepedia-blue disabled:opacity-0"><ArrowDown size={10}/></button>
                                                        </div>
                                                    </td>
                                                )}
                                                <td className="p-2">
                                                    <input 
                                                        type="text" 
                                                        value={team.name} 
                                                        onChange={(e) => handleUpdate(team.id, 'name', e.target.value)}
                                                        className="w-full bg-transparent outline-none font-medium dark:text-white truncate"
                                                    />
                                                </td>
                                                <td className="p-2">
                                                    <input type="number" value={team.matches} onChange={(e) => handleUpdate(team.id, 'matches', parseInt(e.target.value))} className="w-full bg-transparent outline-none text-center dark:text-white" />
                                                </td>
                                                <td className="p-2">
                                                    <input type="number" value={team.wwcd} onChange={(e) => handleUpdate(team.id, 'wwcd', parseInt(e.target.value))} className="w-full bg-transparent outline-none text-center dark:text-white" />
                                                </td>
                                                <td className="p-2">
                                                    <input type="number" value={team.finishes} onChange={(e) => handleUpdate(team.id, 'finishes', parseInt(e.target.value))} className="w-full bg-transparent outline-none text-center dark:text-white" />
                                                </td>
                                                <td className="p-2">
                                                    <input type="number" value={team.positionPts} onChange={(e) => handleUpdate(team.id, 'positionPts', parseInt(e.target.value))} className="w-full bg-transparent outline-none text-center dark:text-white" />
                                                </td>
                                                <td className="p-2 text-center">
                                                    <button onClick={() => handleRemoveTeam(team.id)} className="text-slate-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"><Trash2 size={14}/></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mt-auto">
                                <button onClick={handleAddTeam} className="py-2.5 border-2 border-dashed border-slate-300 dark:border-slate-700 text-slate-500 rounded-lg font-bold flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm">
                                    <Plus size={16} className="mr-2" /> Add Row
                                </button>
                                <button onClick={() => setTeams(INITIAL_TEAMS)} className="py-2.5 border border-slate-200 dark:border-slate-700 text-slate-500 rounded-lg font-bold flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm">
                                    <RefreshCw size={16} className="mr-2" /> Reset
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="space-y-6 overflow-y-auto custom-scrollbar pr-2">
                            {/* Theme Selection */}
                            <div>
                                <label className="flex items-center text-xs font-bold text-slate-500 uppercase mb-3">
                                    <Layout size={14} className="mr-2"/> Layout Theme
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['cyber', 'minimal', 'sport'].map(t => (
                                        <button
                                            key={t}
                                            onClick={() => setConfig(prev => ({ ...prev, theme: t as any }))}
                                            className={`py-2 rounded-lg text-xs font-bold capitalize border-2 transition-all ${
                                                config.theme === t 
                                                ? 'border-gamepedia-blue bg-blue-50 dark:bg-blue-900/20 text-gamepedia-blue' 
                                                : 'border-slate-200 dark:border-slate-700 text-slate-500'
                                            }`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Colors */}
                            <div>
                                <label className="flex items-center text-xs font-bold text-slate-500 uppercase mb-3">
                                    <Palette size={14} className="mr-2"/> Branding Colors
                                </label>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <span className="text-xs text-slate-400 mb-1 block">Primary</span>
                                        <div className="flex items-center gap-2">
                                            <input type="color" value={config.primaryColor} onChange={e => setConfig(prev => ({...prev, primaryColor: e.target.value}))} className="w-8 h-8 rounded cursor-pointer border-0 p-0 bg-transparent"/>
                                            <input type="text" value={config.primaryColor} onChange={e => setConfig(prev => ({...prev, primaryColor: e.target.value}))} className="w-full text-xs bg-slate-100 dark:bg-slate-800 border-none rounded py-1 px-2 font-mono"/>
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-xs text-slate-400 mb-1 block">Secondary</span>
                                        <div className="flex items-center gap-2">
                                            <input type="color" value={config.secondaryColor} onChange={e => setConfig(prev => ({...prev, secondaryColor: e.target.value}))} className="w-8 h-8 rounded cursor-pointer border-0 p-0 bg-transparent"/>
                                            <input type="text" value={config.secondaryColor} onChange={e => setConfig(prev => ({...prev, secondaryColor: e.target.value}))} className="w-full text-xs bg-slate-100 dark:bg-slate-800 border-none rounded py-1 px-2 font-mono"/>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Columns Toggle */}
                            <div>
                                <label className="flex items-center text-xs font-bold text-slate-500 uppercase mb-3">
                                    <Settings size={14} className="mr-2"/> Column Visibility
                                </label>
                                <div className="space-y-2">
                                    <label className="flex items-center justify-between p-2 rounded bg-slate-50 dark:bg-slate-800 cursor-pointer">
                                        <span className="text-sm text-slate-700 dark:text-slate-300">Matches Played</span>
                                        <input type="checkbox" checked={config.showMatches} onChange={e => setConfig(prev => ({...prev, showMatches: e.target.checked}))} className="accent-gamepedia-blue"/>
                                    </label>
                                    <label className="flex items-center justify-between p-2 rounded bg-slate-50 dark:bg-slate-800 cursor-pointer">
                                        <span className="text-sm text-slate-700 dark:text-slate-300">Position Points</span>
                                        <input type="checkbox" checked={config.showPosPts} onChange={e => setConfig(prev => ({...prev, showPosPts: e.target.checked}))} className="accent-gamepedia-blue"/>
                                    </label>
                                </div>
                            </div>

                            {/* Background Image */}
                            <div>
                                <label className="flex items-center text-xs font-bold text-slate-500 uppercase mb-3">
                                    <Settings size={14} className="mr-2"/> Background
                                </label>
                                <input 
                                    type="text" 
                                    value={config.bgImage}
                                    onChange={e => setConfig(prev => ({...prev, bgImage: e.target.value}))}
                                    placeholder="Image URL"
                                    className="w-full text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded py-2 px-3 mb-2"
                                />
                                <div className="flex gap-2">
                                    <button onClick={() => setConfig(prev => ({...prev, bgImage: 'https://raw.githubusercontent.com/pubg/api-assets/master/Assets/Maps/Erangel_Main_Low_Res.png'}))} className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded">Erangel</button>
                                    <button onClick={() => setConfig(prev => ({...prev, bgImage: 'https://raw.githubusercontent.com/pubg/api-assets/master/Assets/Maps/Miramar_Main_Low_Res.png'}))} className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded">Miramar</button>
                                    <button onClick={() => setConfig(prev => ({...prev, bgImage: ''}))} className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded">None</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Preview Area */}
                <div className="lg:col-span-3 flex flex-col">
                    <div className="bg-slate-200 dark:bg-black/50 p-4 md:p-8 rounded-xl flex items-center justify-center overflow-hidden flex-1 border border-slate-300 dark:border-slate-800 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
                        {/* The Graphic */}
                        <div 
                            className={`relative w-full max-w-[500px] overflow-hidden shadow-2xl flex flex-col text-white transition-all duration-500 ${getThemeContainerClass()}`}
                            style={{ 
                                backgroundColor: config.bgColor,
                                color: config.textColor
                            }}
                        >
                            {/* Background Image Layer */}
                            {config.bgImage && (
                                <div className="absolute inset-0 opacity-20 pointer-events-none">
                                    <img src={config.bgImage} className="w-full h-full object-cover grayscale" alt="bg" />
                                    <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/90"></div>
                                </div>
                            )}

                            {/* Header */}
                            <div 
                                className="relative z-10 p-6 text-center border-b border-white/10"
                                style={{ background: `linear-gradient(to right, ${config.primaryColor}CC, ${config.secondaryColor}CC)` }}
                            >
                                <h2 className="text-2xl font-heading font-black uppercase tracking-wider drop-shadow-md">{tournamentName}</h2>
                                <p className="text-sm opacity-90 font-bold mt-1 tracking-wide">{subTitle}</p>
                            </div>

                            {/* Table Body */}
                            <div className="relative z-10 flex-1 p-4 space-y-1.5 min-h-[400px]">
                                {/* Column Headers */}
                                <div className="flex justify-between text-[10px] font-bold uppercase opacity-60 px-3 mb-2 tracking-widest">
                                    <span>Rank / Team</span>
                                    <div className="flex gap-1 text-center justify-end">
                                        {config.showMatches && <span className="w-8">Mat</span>}
                                        <span className="w-8">WWCD</span>
                                        <span className="w-8">Fin</span>
                                        {config.showPosPts && <span className="w-8">Pos</span>}
                                        <span className="w-10">Total</span>
                                    </div>
                                </div>

                                {teams.map((team, idx) => (
                                    <div 
                                        key={team.id} 
                                        className={`flex items-center justify-between p-2 rounded transition-all border ${
                                            idx < 3 
                                            ? 'bg-gradient-to-r from-white/10 to-transparent border-white/10' 
                                            : 'bg-black/20 border-transparent'
                                        }`}
                                        style={idx < 3 ? { borderLeftColor: config.primaryColor, borderLeftWidth: '4px' } : {}}
                                    >
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div 
                                                className={`w-6 h-6 flex items-center justify-center text-xs font-black rounded-md shadow-sm ${
                                                    idx === 0 ? 'bg-yellow-400 text-black' : 
                                                    idx === 1 ? 'bg-slate-300 text-black' : 
                                                    idx === 2 ? 'bg-orange-600 text-white' : 
                                                    'bg-white/10 text-white'
                                                }`}
                                            >
                                                {idx + 1}
                                            </div>
                                            <div className="w-6 h-6 rounded bg-white/10 p-0.5">
                                                <img 
                                                    src={getTeamLogo(team.name) || 'https://via.placeholder.com/32?text=?'} 
                                                    className="w-full h-full object-contain"
                                                    onError={(e) => e.currentTarget.style.display = 'none'}
                                                />
                                            </div>
                                            <span className="font-bold text-sm truncate tracking-tight">{team.name}</span>
                                        </div>
                                        <div className="flex gap-1 text-center justify-end font-mono text-sm font-bold">
                                            {config.showMatches && <span className="w-8 opacity-70">{team.matches}</span>}
                                            <span className="w-8 opacity-70">{team.wwcd}</span>
                                            <span className="w-8 opacity-70">{team.finishes}</span>
                                            {config.showPosPts && <span className="w-8 opacity-70">{team.positionPts}</span>}
                                            <span className="w-10 text-white text-base" style={{ color: idx < 3 ? config.primaryColor : 'inherit' }}>{getTotal(team)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Footer */}
                            <div className="relative z-10 p-3 border-t border-white/10 flex justify-between items-center bg-black/40">
                                <div className="text-[10px] opacity-50 font-mono tracking-widest">POWERED BY GAMEPEDIA</div>
                                <div className="text-[10px] font-bold bg-white/10 px-2 py-0.5 rounded text-white/80">LIVE UPDATES</div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-6">
                        <button onClick={handleCopyText} className="py-4 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl font-bold shadow-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center justify-center transition-colors">
                            <Copy size={20} className="mr-2" /> Copy for Discord
                        </button>
                        <button 
                            onClick={generateImage} 
                            disabled={isGenerating}
                            className="py-4 bg-gamepedia-blue text-white rounded-xl font-bold shadow-lg hover:bg-blue-600 flex items-center justify-center transition-colors disabled:opacity-70"
                        >
                            {isGenerating ? <Loader size={20} className="mr-2 animate-spin"/> : <Download size={20} className="mr-2" />} 
                            {isGenerating ? 'Generating...' : 'Download HD Image'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Batch Import Modal */}
            {showImport && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Batch Import Data</h3>
                            <button onClick={() => setShowImport(false)}><X className="text-slate-400 hover:text-white" /></button>
                        </div>
                        <p className="text-sm text-slate-500 mb-4">Paste data from Excel or Sheets. Format:<br/><code className="bg-slate-100 dark:bg-slate-800 px-1 rounded">Team Name, Matches, WWCD, Finishes, PosPts</code></p>
                        <textarea 
                            className="w-full h-48 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-xs font-mono outline-none focus:border-gamepedia-blue mb-4 dark:text-white"
                            placeholder={`Team Soul, 5, 2, 40, 30\nGodLike, 5, 1, 35, 25`}
                            value={importText}
                            onChange={(e) => setImportText(e.target.value)}
                        ></textarea>
                        <div className="flex justify-end gap-3">
                            <button onClick={() => setShowImport(false)} className="px-4 py-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-bold">Cancel</button>
                            <button onClick={handleBatchImport} className="px-6 py-2 bg-gamepedia-blue text-white rounded-lg font-bold hover:bg-blue-600">Import Data</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
