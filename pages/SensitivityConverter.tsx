
import React, { useState } from 'react';
import { Calculator, ArrowRightLeft, Smartphone, Target } from 'lucide-react';
import { SENSITIVITY_CONVERSION } from '../constants';

export const SensitivityConverterPage: React.FC = () => {
    const [sourceGame, setSourceGame] = useState('codm');
    const [inputValue, setInputValue] = useState<number>(100);
    
    const multiplier = SENSITIVITY_CONVERSION[sourceGame as keyof typeof SENSITIVITY_CONVERSION] || 1;
    const result = Math.round(inputValue * multiplier);

    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-fade-in pb-12">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-heading font-bold text-slate-900 dark:text-white flex items-center justify-center">
                    <ArrowRightLeft className="mr-3 text-gamepedia-blue" /> Sensitivity Converter
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">
                    Migrating from another shooter? Convert your settings to BGMI instantly.
                </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    {/* Input Side */}
                    <div className="space-y-4">
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Source Game</label>
                        <select 
                            value={sourceGame}
                            onChange={(e) => setSourceGame(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-gamepedia-blue outline-none font-medium"
                        >
                            <option value="codm">Call of Duty Mobile</option>
                            <option value="freefire">Free Fire Max</option>
                            <option value="newstate">PUBG New State</option>
                            <option value="apex">Apex Legends Mobile</option>
                            <option value="pubgpc">PUBG PC</option>
                        </select>

                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Sensitivity Value</label>
                        <div className="relative">
                            <input 
                                type="number" 
                                value={inputValue}
                                onChange={(e) => setInputValue(parseFloat(e.target.value) || 0)}
                                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-gamepedia-blue outline-none font-mono text-lg"
                            />
                            <Smartphone className="absolute right-4 top-3.5 text-slate-400" size={20} />
                        </div>
                    </div>

                    {/* Result Side */}
                    <div className="flex flex-col items-center justify-center p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
                        <span className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide mb-2">BGMI Equivalent</span>
                        <div className="text-6xl font-black text-slate-900 dark:text-white mb-2 font-mono">
                            {result}
                        </div>
                        <div className="flex items-center text-slate-500 dark:text-slate-400 text-sm">
                            <Target size={14} className="mr-1" /> Recommended Setting
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg flex items-start gap-3">
                        <Calculator className="text-yellow-600 dark:text-yellow-400 shrink-0 mt-0.5" size={20} />
                        <p className="text-sm text-yellow-800 dark:text-yellow-200 leading-relaxed">
                            <strong>Note:</strong> Sensitivity algorithms vary by device PPI and screen resolution. This tool provides an estimated starting point based on standard 360-degree turn ratios. Adjust ±10% in training grounds for perfection.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
