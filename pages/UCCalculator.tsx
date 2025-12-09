
import React, { useState } from 'react';
import { Calculator, Coins, CreditCard, ShoppingCart, RefreshCw } from 'lucide-react';
import { UC_PACKS } from '../constants';

export const UCCalculatorPage: React.FC = () => {
    const [amount, setAmount] = useState<number>(0);
    const [mode, setMode] = useState<'INR_TO_UC' | 'UC_TO_INR'>('INR_TO_UC');

    // Helper to find best combination of packs
    const calculateBestPacks = (targetUC: number) => {
        // Simple greedy approach for demo
        let remaining = targetUC;
        const packs: { amount: number; count: number; price: number }[] = [];
        let totalPrice = 0;

        // Sort packs by value (UC per Rupee) descending
        const sortedPacks = [...UC_PACKS].sort((a, b) => (b.amount + b.bonus) / b.priceInr - (a.amount + a.bonus) / a.priceInr);

        sortedPacks.forEach(pack => {
            const totalPackUC = pack.amount + pack.bonus;
            if (remaining >= totalPackUC) {
                const count = Math.floor(remaining / totalPackUC);
                remaining -= count * totalPackUC;
                totalPrice += count * pack.priceInr;
                packs.push({ amount: totalPackUC, count, price: pack.priceInr });
            }
        });

        // If remaining > 0, add smallest pack to cover it
        if (remaining > 0) {
            const smallestPack = UC_PACKS[0]; // Assume first is smallest
            const count = Math.ceil(remaining / (smallestPack.amount + smallestPack.bonus));
            totalPrice += count * smallestPack.priceInr;
            packs.push({ amount: (smallestPack.amount + smallestPack.bonus), count, price: smallestPack.priceInr });
        }

        return { packs, totalPrice };
    };

    // INR to UC logic is simpler estimation
    const calculateUCFromINR = (inr: number) => {
        if (!inr) return 0;
        // Average ratio approx 0.8 UC per INR base, up to 1.2 with bonus
        // Let's estimate based on standard 60uc = 75inr ratio
        return Math.floor(inr * (60 / 75)); 
    };

    const result = mode === 'UC_TO_INR' ? calculateBestPacks(amount) : null;
    const ucResult = mode === 'INR_TO_UC' ? calculateUCFromINR(amount) : 0;

    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-fade-in pb-12">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-heading font-bold text-slate-900 dark:text-white flex items-center justify-center">
                    <Coins className="mr-3 text-yellow-500" /> UC Calculator
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">
                    Plan your Royal Pass and Crate opening budget.
                </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700">
                {/* Mode Switch */}
                <div className="flex justify-center mb-8">
                    <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-lg flex">
                        <button 
                            onClick={() => { setMode('INR_TO_UC'); setAmount(0); }}
                            className={`px-6 py-2 rounded-md font-bold text-sm transition-colors ${mode === 'INR_TO_UC' ? 'bg-white dark:bg-slate-700 shadow text-gamepedia-blue' : 'text-slate-500'}`}
                        >
                            INR to UC
                        </button>
                        <button 
                            onClick={() => { setMode('UC_TO_INR'); setAmount(0); }}
                            className={`px-6 py-2 rounded-md font-bold text-sm transition-colors ${mode === 'UC_TO_INR' ? 'bg-white dark:bg-slate-700 shadow text-gamepedia-blue' : 'text-slate-500'}`}
                        >
                            UC to INR
                        </button>
                    </div>
                </div>

                {/* Input */}
                <div className="max-w-md mx-auto mb-8">
                    <label className="block text-center text-xs font-bold text-slate-500 uppercase mb-2">
                        {mode === 'INR_TO_UC' ? 'Enter Amount (₹)' : 'Enter Target UC'}
                    </label>
                    <div className="relative">
                        <input 
                            type="number" 
                            value={amount || ''}
                            onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
                            className="w-full text-center text-4xl font-bold bg-transparent border-b-2 border-slate-200 dark:border-slate-700 py-2 focus:border-gamepedia-blue outline-none text-slate-900 dark:text-white"
                            placeholder="0"
                        />
                        <span className="absolute right-4 top-4 text-slate-400 font-bold">
                            {mode === 'INR_TO_UC' ? 'INR' : 'UC'}
                        </span>
                    </div>
                </div>

                {/* Result */}
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 border border-slate-100 dark:border-slate-800 text-center">
                    {mode === 'INR_TO_UC' ? (
                        <div>
                            <div className="text-sm text-slate-500 mb-1">You will get approximately</div>
                            <div className="text-5xl font-black text-yellow-500 drop-shadow-sm mb-2">
                                {ucResult.toLocaleString()} <span className="text-2xl">UC</span>
                            </div>
                            <p className="text-xs text-slate-400">Excluding bonus UC from larger packs.</p>
                        </div>
                    ) : (
                        <div>
                            <div className="text-sm text-slate-500 mb-1">Estimated Cost</div>
                            <div className="text-5xl font-black text-green-500 drop-shadow-sm mb-4">
                                ₹{result?.totalPrice.toLocaleString()}
                            </div>
                            
                            {result && result.packs.length > 0 && (
                                <div className="space-y-2 max-w-xs mx-auto text-left bg-white dark:bg-slate-900 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                                    <p className="text-xs font-bold text-slate-500 uppercase mb-2 border-b pb-1">Recommended Packs</p>
                                    {result.packs.map((p, i) => (
                                        <div key={i} className="flex justify-between text-sm">
                                            <span className="text-slate-700 dark:text-slate-300">{p.count}x {p.amount} UC Pack</span>
                                            <span className="font-mono font-bold text-slate-900 dark:text-white">₹{(p.count * p.price).toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="mt-8 flex justify-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center"><ShoppingCart size={12} className="mr-1"/> Official Rates</span>
                    <span>•</span>
                    <span className="flex items-center"><RefreshCw size={12} className="mr-1"/> Updated Daily</span>
                </div>
            </div>
        </div>
    );
};
