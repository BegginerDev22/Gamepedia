
import React, { useState, useEffect } from 'react';
import { Trophy, Timer, HelpCircle, CheckCircle, XCircle, ArrowRight, RotateCcw } from 'lucide-react';
import { MOCK_TRIVIA } from '../constants';
import { useUser } from '../contexts/UserContext';

export const TriviaPage: React.FC = () => {
    const { addPoints } = useUser();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState<'start' | 'playing' | 'finished'>('start');
    const [timeLeft, setTimeLeft] = useState(15);
    const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

    const currentQuestion = MOCK_TRIVIA[currentQuestionIndex];

    useEffect(() => {
        let timer: number;
        if (gameState === 'playing' && timeLeft > 0 && !feedback) {
            timer = window.setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && !feedback) {
            handleTimeUp();
        }
        return () => clearInterval(timer);
    }, [gameState, timeLeft, feedback]);

    const handleTimeUp = () => {
        setFeedback('wrong');
        setTimeout(nextQuestion, 2000);
    };

    const handleAnswer = (index: number) => {
        if (selectedOption !== null) return;
        setSelectedOption(index);

        if (index === currentQuestion.correctAnswer) {
            setFeedback('correct');
            setScore(prev => prev + currentQuestion.points + Math.floor(timeLeft * 2)); // Time bonus
        } else {
            setFeedback('wrong');
        }

        setTimeout(nextQuestion, 2000);
    };

    const nextQuestion = () => {
        if (currentQuestionIndex < MOCK_TRIVIA.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setSelectedOption(null);
            setFeedback(null);
            setTimeLeft(15);
        } else {
            setGameState('finished');
            addPoints(score);
        }
    };

    const restartGame = () => {
        setCurrentQuestionIndex(0);
        setSelectedOption(null);
        setScore(0);
        setFeedback(null);
        setTimeLeft(15);
        setGameState('playing');
    };

    if (gameState === 'start') {
        return (
            <div className="max-w-2xl mx-auto py-12 px-4 animate-fade-in text-center">
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-700">
                    <div className="w-24 h-24 bg-gamepedia-blue rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                        <HelpCircle size={48} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-heading font-bold text-slate-900 dark:text-white mb-2">BGMI Master Quiz</h1>
                    <p className="text-slate-500 dark:text-slate-400 mb-8">
                        Test your knowledge of mechanics, history, and maps. <br/>Earn GameCredits for every correct answer!
                    </p>
                    <button 
                        onClick={() => setGameState('playing')}
                        className="px-8 py-4 bg-gamepedia-blue text-white text-xl font-bold rounded-xl shadow-lg hover:bg-blue-600 transition-all transform hover:scale-105"
                    >
                        Start Quiz
                    </button>
                </div>
            </div>
        );
    }

    if (gameState === 'finished') {
        return (
            <div className="max-w-2xl mx-auto py-12 px-4 animate-fade-in text-center">
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-700 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500"></div>
                    <Trophy size={64} className="mx-auto text-yellow-500 mb-4 animate-bounce" />
                    <h2 className="text-4xl font-heading font-bold text-slate-900 dark:text-white mb-2">Quiz Complete!</h2>
                    <p className="text-slate-500 dark:text-slate-400 mb-6">You scored</p>
                    
                    <div className="text-6xl font-black text-gamepedia-blue mb-8 font-mono">
                        {score} <span className="text-lg text-slate-400 font-sans font-bold">PTS</span>
                    </div>

                    <div className="flex justify-center gap-4">
                        <button 
                            onClick={restartGame}
                            className="flex items-center px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                        >
                            <RotateCcw size={18} className="mr-2" /> Play Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto py-8 px-4 animate-fade-in">
            {/* Header / Progress */}
            <div className="flex justify-between items-center mb-6">
                <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                    Question {currentQuestionIndex + 1} / {MOCK_TRIVIA.length}
                </span>
                <div className="flex items-center gap-4">
                    <div className="flex items-center text-yellow-600 dark:text-yellow-400 font-bold">
                        <Trophy size={16} className="mr-1" /> {score}
                    </div>
                    <div className={`flex items-center font-mono font-bold text-lg ${timeLeft < 5 ? 'text-red-500 animate-pulse' : 'text-slate-700 dark:text-slate-300'}`}>
                        <Timer size={20} className="mr-2" /> {timeLeft}s
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full mb-8 overflow-hidden">
                <div 
                    className="h-full bg-gamepedia-blue transition-all duration-500 ease-out"
                    style={{ width: `${((currentQuestionIndex + 1) / MOCK_TRIVIA.length) * 100}%` }}
                ></div>
            </div>

            {/* Question Card */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden relative">
                <div className="p-8">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 leading-relaxed">
                        {currentQuestion.question}
                    </h2>

                    <div className="grid grid-cols-1 gap-4">
                        {currentQuestion.options.map((option, idx) => {
                            let buttonClass = "bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300";
                            
                            if (selectedOption !== null) {
                                if (idx === currentQuestion.correctAnswer) {
                                    buttonClass = "bg-green-500 text-white border-green-500 shadow-md shadow-green-500/30";
                                } else if (idx === selectedOption) {
                                    buttonClass = "bg-red-500 text-white border-red-500";
                                } else {
                                    buttonClass = "opacity-50 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700";
                                }
                            }

                            return (
                                <button
                                    key={idx}
                                    disabled={selectedOption !== null}
                                    onClick={() => handleAnswer(idx)}
                                    className={`w-full text-left p-4 rounded-xl border-2 font-bold text-lg transition-all duration-200 flex justify-between items-center ${buttonClass}`}
                                >
                                    <span>{option}</span>
                                    {selectedOption !== null && idx === currentQuestion.correctAnswer && <CheckCircle size={24} />}
                                    {selectedOption !== null && idx === selectedOption && idx !== currentQuestion.correctAnswer && <XCircle size={24} />}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Feedback / Explanation */}
                {feedback && (
                    <div className={`p-6 border-t ${feedback === 'correct' ? 'bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800'} animate-slide-up`}>
                        <h4 className={`font-bold mb-2 flex items-center ${feedback === 'correct' ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                            {feedback === 'correct' ? 'Correct Answer!' : 'Oops, incorrect.'}
                        </h4>
                        <p className="text-sm text-slate-700 dark:text-slate-300">
                            {currentQuestion.explanation}
                        </p>
                        <div className="mt-4 flex justify-end">
                            <span className="text-xs font-bold uppercase text-slate-400 flex items-center">
                                Next Question <ArrowRight size={14} className="ml-1"/>
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
