
import React, { useState, useRef } from 'react';
import { Zap, RotateCcw, Trophy, Play } from 'lucide-react';

type GameState = 'idle' | 'waiting' | 'ready' | 'clicked' | 'early';

export const ReactionTesterPage: React.FC = () => {
    const [gameState, setGameState] = useState<GameState>('idle');
    const [startTime, setStartTime] = useState(0);
    const [reactionTime, setReactionTime] = useState<number | null>(null);
    const [history, setHistory] = useState<number[]>([]);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const startGame = () => {
        setGameState('waiting');
        setReactionTime(null);
        
        const randomDelay = Math.floor(Math.random() * 3000) + 2000; // 2-5 seconds
        
        timeoutRef.current = setTimeout(() => {
            setGameState('ready');
            setStartTime(Date.now());
        }, randomDelay);
    };

    const handleClick = () => {
        if (gameState === 'waiting') {
            setGameState('early');
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        } else if (gameState === 'ready') {
            const endTime = Date.now();
            const time = endTime - startTime;
            setReactionTime(time);
            setGameState('clicked');
            setHistory(prev => [...prev, time].slice(-5)); // Keep last 5
        } else if (gameState === 'clicked' || gameState === 'early') {
            startGame();
        } else if (gameState === 'idle') {
            startGame();
        }
    };

    const getRank = (avg: number) => {
        if (avg < 150) return { label: 'Hacker?!', color: 'text-purple-500' };
        if (avg < 200) return { label: 'Pro Player', color: 'text-red-500' };
        if (avg < 250) return { label: 'Competitive', color: 'text-orange-500' };
        if (avg < 300) return { label: 'Average Gamer', color: 'text-yellow-500' };
        return { label: 'Slow Poke', color: 'text-slate-500' };
    };

    const averageTime = history.length > 0 ? Math.round(history.reduce((a, b) => a + b, 0) / history.length) : 0;
    const rank = getRank(averageTime);

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-heading font-bold text-slate-900 dark:text-white flex items-center justify-center">
                    <Zap className="mr-3 text-yellow-500" /> Reaction Trainer
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">
                    Test your reflexes. Can you beat the 180ms pro average?
                </p>
            </div>

            {/* Game Area */}
            <div 
                onClick={handleClick}
                className={`
                    w-full h-[400px] rounded-2xl shadow-xl flex flex-col items-center justify-center cursor-pointer transition-all select-none
                    ${gameState === 'idle' ? 'bg-slate-900 hover:bg-slate-800' : ''}
                    ${gameState === 'waiting' ? 'bg-red-600' : ''}
                    ${gameState === 'ready' ? 'bg-green-500' : ''}
                    ${gameState === 'clicked' ? 'bg-slate-900' : ''}
                    ${gameState === 'early' ? 'bg-slate-900' : ''}
                `}
            >
                {gameState === 'idle' && (
                    <>
                        <Zap size={64} className="text-yellow-400 mb-4" />
                        <h2 className="text-4xl font-bold text-white mb-2">Click to Start</h2>
                        <p className="text-slate-400">Wait for green, then click!</p>
                    </>
                )}

                {gameState === 'waiting' && (
                    <h2 className="text-4xl font-bold text-white tracking-widest">WAIT FOR IT...</h2>
                )}

                {gameState === 'ready' && (
                    <h2 className="text-6xl font-black text-white tracking-tighter">CLICK!</h2>
                )}

                {gameState === 'clicked' && (
                    <>
                        <div className="text-6xl font-mono font-bold text-white mb-2">{reactionTime} ms</div>
                        <p className="text-slate-300 mb-8">Click to try again</p>
                        {reactionTime && reactionTime < 200 && (
                            <div className="bg-white/10 px-4 py-2 rounded-full text-yellow-400 font-bold animate-bounce">
                                NEW HIGH SCORE!
                            </div>
                        )}
                    </>
                )}

                {gameState === 'early' && (
                    <>
                        <RotateCcw size={64} className="text-red-500 mb-4" />
                        <h2 className="text-4xl font-bold text-white mb-2">Too Soon!</h2>
                        <p className="text-slate-400">Click to try again</p>
                    </>
                )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center">
                        <Trophy size={18} className="mr-2 text-gamepedia-blue" /> Your Average
                    </h3>
                    <div className="flex items-center justify-between">
                        <span className="text-4xl font-mono font-bold text-slate-900 dark:text-white">
                            {averageTime > 0 ? `${averageTime} ms` : '--'}
                        </span>
                        {averageTime > 0 && (
                            <span className={`text-lg font-bold ${rank.color}`}>
                                {rank.label}
                            </span>
                        )}
                    </div>
                    <p className="text-xs text-slate-500 mt-2">Based on last 5 attempts</p>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-4">Recent Attempts</h3>
                    <div className="flex gap-2">
                        {history.length > 0 ? history.map((time, i) => (
                            <div key={i} className="flex-1 bg-slate-100 dark:bg-slate-800 rounded p-2 text-center">
                                <span className="block text-xs text-slate-500 mb-1">#{i+1}</span>
                                <span className="font-mono font-bold text-slate-900 dark:text-white">{time}</span>
                            </div>
                        )) : (
                            <div className="text-sm text-slate-500 italic w-full text-center py-2">No data yet</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
