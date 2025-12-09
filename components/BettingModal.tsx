import React, { useState } from 'react';
import { X, AlertCircle, Coins, Trophy } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

interface BettingModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamName: string;
  teamId: string;
  matchId: string;
  odds: number;
}

export const BettingModal: React.FC<BettingModalProps> = ({ isOpen, onClose, teamName, teamId, matchId, odds }) => {
  const { points, placeBet } = useUser();
  const [amount, setAmount] = useState<number>(100);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const potentialWin = Math.floor(amount * odds);

  const handlePlaceBet = () => {
    if (amount <= 0) {
      setError("Amount must be greater than 0");
      return;
    }
    if (amount > points) {
      setError("Insufficient balance");
      return;
    }

    const success = placeBet(matchId, teamId, amount, odds);
    if (success) {
      onClose();
    } else {
      setError("Failed to place prediction");
    }
  };

  const setPercentage = (pct: number) => {
    setAmount(Math.floor(points * pct));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 dark:border-slate-700 overflow-hidden transform transition-all scale-100">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-gamepedia-dark to-slate-900 p-6 text-white relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
          <h3 className="font-heading font-bold text-xl flex items-center">
            <Coins className="mr-2 text-yellow-400" />
            Place Prediction
          </h3>
          <p className="text-slate-300 text-sm mt-1">
            Predicting <span className="font-bold text-white">{teamName}</span> to win
          </p>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
            {/* Odds Display */}
            <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                <div className="text-center">
                    <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold">Current Odds</span>
                    <span className="block text-2xl font-mono font-bold text-gamepedia-blue">{odds.toFixed(2)}x</span>
                </div>
                <div className="h-8 w-px bg-slate-200 dark:bg-slate-700"></div>
                <div className="text-center">
                    <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold">Your Balance</span>
                    <span className="block text-2xl font-mono font-bold text-slate-700 dark:text-slate-200">{points.toLocaleString()}</span>
                </div>
            </div>

            {/* Input */}
            <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Prediction Amount</label>
                <div className="relative">
                    <input 
                        type="number" 
                        value={amount}
                        onChange={(e) => {
                            setAmount(parseInt(e.target.value) || 0);
                            setError('');
                        }}
                        className="w-full pl-4 pr-16 py-3 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-600 rounded-xl text-lg font-mono font-bold focus:ring-2 focus:ring-gamepedia-blue outline-none dark:text-white"
                    />
                    <span className="absolute right-4 top-3.5 text-slate-400 font-bold text-sm">PTS</span>
                </div>
                
                {/* Quick Selectors */}
                <div className="flex gap-2 mt-3">
                    {[0.1, 0.25, 0.5, 1].map((pct) => (
                        <button 
                            key={pct}
                            onClick={() => setPercentage(pct)}
                            className="flex-1 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 text-xs font-bold rounded transition-colors"
                        >
                            {pct * 100}%
                        </button>
                    ))}
                </div>
            </div>

            {/* Potential Win */}
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/50 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center text-green-700 dark:text-green-400">
                    <Trophy size={18} className="mr-2" />
                    <span className="text-sm font-bold">Potential Win</span>
                </div>
                <span className="text-xl font-bold text-green-700 dark:text-green-400 font-mono">+{potentialWin.toLocaleString()}</span>
            </div>

            {error && (
                <div className="flex items-center text-red-500 text-sm font-medium bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                    <AlertCircle size={16} className="mr-2" /> {error}
                </div>
            )}

            <button 
                onClick={handlePlaceBet}
                className="w-full py-3.5 bg-gamepedia-orange hover:bg-orange-600 text-white text-lg font-bold rounded-xl shadow-lg shadow-orange-500/30 transition-all transform active:scale-95"
            >
                Confirm Prediction
            </button>
        </div>
      </div>
    </div>
  );
};