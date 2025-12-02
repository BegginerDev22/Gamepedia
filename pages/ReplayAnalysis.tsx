
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Rewind, FastForward, Map, Clock, ZoomIn, ZoomOut } from 'lucide-react';
import { MOCK_REPLAY_DATA, MOCK_TEAMS } from '../constants';

export const ReplayAnalysisPage: React.FC = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0); // 0 to 100% progress
    const [speed, setSpeed] = useState(1);
    const [zoom, setZoom] = useState(1);
    
    const animationRef = useRef<number | undefined>(undefined);
    const duration = 1200; // Virtual match duration in frames/ticks

    useEffect(() => {
        if (isPlaying) {
            animationRef.current = window.setInterval(() => {
                setCurrentTime(prev => {
                    if (prev >= 100) {
                        setIsPlaying(false);
                        return 100;
                    }
                    return prev + (0.1 * speed);
                });
            }, 50);
        } else {
            clearInterval(animationRef.current);
        }
        return () => clearInterval(animationRef.current);
    }, [isPlaying, speed]);

    const getPositionAtTime = (path: {x: number, y: number}[], progress: number) => {
        // Map progress 0-100 to path indices
        const totalPoints = path.length - 1;
        const exactIndex = (progress / 100) * totalPoints;
        const index = Math.floor(exactIndex);
        const nextIndex = Math.min(index + 1, totalPoints);
        const ratio = exactIndex - index;

        const p1 = path[index];
        const p2 = path[nextIndex];

        // Linear interpolation
        return {
            x: p1.x + (p2.x - p1.x) * ratio,
            y: p1.y + (p2.y - p1.y) * ratio
        };
    };

    const getZoneAtTime = (progress: number) => {
        const zones = MOCK_REPLAY_DATA.zoneStates;
        // Simple logic: switch to next zone instantly based on progress thresholds for demo
        // 0-20% zone 1, 20-40% zone 2, etc.
        const index = Math.min(Math.floor(progress / 20), zones.length - 1);
        return zones[index];
    };

    const currentZone = getZoneAtTime(currentTime);

    const formatTime = (progress: number) => {
        const totalSeconds = (progress / 100) * 1800; // 30 mins
        const mins = Math.floor(totalSeconds / 60);
        const secs = Math.floor(totalSeconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6 animate-fade-in pb-12">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-slate-900 dark:text-white flex items-center">
                        <Map className="mr-3 text-gamepedia-blue" /> Match Replay Analysis
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Analyze team rotations and zone shifts from Match #1.
                    </p>
                </div>
                <div className="bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-lg font-mono font-bold text-slate-700 dark:text-slate-300 flex items-center">
                    <Clock size={16} className="mr-2" /> {formatTime(currentTime)}
                </div>
            </div>

            <div className="bg-slate-900 rounded-xl shadow-2xl border border-slate-800 overflow-hidden relative flex flex-col">
                {/* Map Viewport */}
                <div className="relative w-full aspect-video bg-black overflow-hidden flex items-center justify-center">
                    <div 
                        className="relative w-full h-full transition-transform duration-300 ease-out"
                        style={{ transform: `scale(${zoom})` }}
                    >
                        <img 
                            src={MOCK_REPLAY_DATA.mapUrl} 
                            className="w-full h-full object-contain opacity-60"
                            alt="Map"
                        />
                        
                        {/* Grid Overlay */}
                        <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 pointer-events-none opacity-10 w-full h-full">
                             {Array.from({ length: 64 }).map((_, i) => (
                                 <div key={i} className="border border-white"></div>
                             ))}
                        </div>

                        {/* Zone Circle */}
                        <div 
                            className="absolute rounded-full border-2 border-blue-400 bg-blue-500/10 transition-all duration-1000"
                            style={{
                                left: `${currentZone.x}%`,
                                top: `${currentZone.y}%`,
                                width: `${currentZone.radius * 2}%`,
                                height: `${currentZone.radius * 2 * (16/9)}%`, // Aspect ratio correction roughly
                                transform: 'translate(-50%, -50%)'
                            }}
                        ></div>

                        {/* Teams */}
                        {MOCK_REPLAY_DATA.teams.map(team => {
                            const pos = getPositionAtTime(team.path, currentTime);
                            const teamData = MOCK_TEAMS[team.teamId];
                            return (
                                <div 
                                    key={team.teamId}
                                    className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group z-10"
                                    style={{ left: `${pos.x}%`, top: `${pos.y}%`, transition: 'top 0.1s linear, left 0.1s linear' }}
                                >
                                    <div 
                                        className="w-4 h-4 rounded-full border-2 border-white shadow-lg"
                                        style={{ backgroundColor: team.color }}
                                    ></div>
                                    <span className="mt-1 text-[8px] font-bold text-white bg-black/50 px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                        {teamData ? teamData.name : team.teamId}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    {/* Zoom Controls */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                        <button onClick={() => setZoom(Math.min(zoom + 0.5, 3))} className="p-2 bg-slate-800 text-white rounded hover:bg-slate-700"><ZoomIn size={20}/></button>
                        <button onClick={() => setZoom(Math.max(zoom - 0.5, 1))} className="p-2 bg-slate-800 text-white rounded hover:bg-slate-700"><ZoomOut size={20}/></button>
                    </div>
                </div>

                {/* Controls Bar */}
                <div className="bg-slate-800 p-4 flex items-center gap-4 border-t border-slate-700">
                    <button 
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="p-3 bg-gamepedia-blue text-white rounded-full hover:bg-blue-600 transition-colors"
                    >
                        {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                    </button>

                    <div className="flex-1 relative group">
                        <input 
                            type="range" 
                            min="0" 
                            max="100" 
                            step="0.1"
                            value={currentTime}
                            onChange={(e) => {
                                setCurrentTime(parseFloat(e.target.value));
                                setIsPlaying(false);
                            }}
                            className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer accent-gamepedia-blue"
                        />
                    </div>

                    <div className="flex items-center bg-slate-700 rounded-lg p-1">
                        {[1, 2, 4].map(rate => (
                            <button 
                                key={rate}
                                onClick={() => setSpeed(rate)}
                                className={`px-3 py-1 text-xs font-bold rounded ${speed === rate ? 'bg-slate-600 text-white' : 'text-slate-400 hover:text-white'}`}
                            >
                                {rate}x
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-700">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-2">Match Events</h3>
                    <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                        <li className="flex justify-between"><span>Phase 1 Closing</span> <span className="font-mono">5:00</span></li>
                        <li className="flex justify-between"><span>GodL Wipe</span> <span className="font-mono">12:30</span></li>
                        <li className="flex justify-between"><span>Phase 3 Shift</span> <span className="font-mono">18:45</span></li>
                    </ul>
                </div>
                <div className="col-span-2 bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-700">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-2">Analyst Notes</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        Notice how Team Soul (Blue) holds the center compound early, anticipating the hard shift to the north-east. GodLike (Yellow) attempts a late rotation through the open field and gets punished by multiple angles. Ideally, GodLike should have wrapped around the Georgopol hills earlier.
                    </p>
                </div>
            </div>
        </div>
    );
};
