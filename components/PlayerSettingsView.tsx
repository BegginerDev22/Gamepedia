import React, { useState } from 'react';
import { Smartphone, Gamepad2, Target, Copy, Check } from 'lucide-react';
import { PlayerSettings } from '../types';

interface PlayerSettingsViewProps {
  settings: PlayerSettings;
}

export const PlayerSettingsView: React.FC<PlayerSettingsViewProps> = ({ settings }) => {
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
      if (settings.controlsCode) {
          navigator.clipboard.writeText(settings.controlsCode);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
      }
  };

  return (
    <div className="animate-fade-in bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 md:p-8">
        <div className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Device & Graphics */}
                    <div className="space-y-6">
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center">
                            <Smartphone className="mr-2 text-gamepedia-blue" /> Device & Graphics
                        </h3>
                        <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-5 border border-slate-100 dark:border-slate-700">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <span className="block text-xs font-bold text-slate-500 uppercase">Mobile Device</span>
                                    <span className="block font-medium text-slate-900 dark:text-white mt-1">{settings.device}</span>
                                </div>
                                <div>
                                    <span className="block text-xs font-bold text-slate-500 uppercase">Graphics</span>
                                    <span className="block font-medium text-slate-900 dark:text-white mt-1">{settings.graphics}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Layout Code */}
                    <div className="space-y-6">
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center">
                            <Gamepad2 className="mr-2 text-gamepedia-blue" /> Controls
                        </h3>
                        <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-5 border border-slate-100 dark:border-slate-700">
                            <span className="block text-xs font-bold text-slate-500 uppercase mb-2">Layout Share Code</span>
                            <div className="flex items-center space-x-2">
                                <code className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-600 rounded px-3 py-2 font-mono text-sm font-bold text-slate-700 dark:text-slate-200">
                                {settings.controlsCode}
                                </code>
                                <button 
                                onClick={copyCode}
                                className="p-2 bg-gamepedia-blue text-white rounded-lg hover:bg-blue-600 transition-colors relative"
                                title="Copy Code"
                                >
                                {copied ? <Check size={18} /> : <Copy size={18} />}
                                </button>
                            </div>
                            <p className="text-xs text-slate-400 mt-2">Copy this code and paste in BGMI Settings &gt; Controls.</p>
                        </div>
                    </div>
            </div>

            {/* Sensitivity Tables */}
            <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center mb-6">
                        <Target className="mr-2 text-gamepedia-blue" /> Sensitivity Settings
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Camera */}
                    <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                        <div className="bg-slate-50 dark:bg-slate-800 p-3 border-b border-slate-200 dark:border-slate-700 text-center font-bold text-slate-700 dark:text-slate-300">
                            Camera (Free Look)
                        </div>
                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                            <div className="flex justify-between p-3 text-sm"><span className="text-slate-500 dark:text-slate-400">TP No Scope</span> <span className="font-mono font-bold">{settings.sensitivity.camera.noScope}%</span></div>
                            <div className="flex justify-between p-3 text-sm"><span className="text-slate-500 dark:text-slate-400">Red Dot</span> <span className="font-mono font-bold">{settings.sensitivity.camera.redDot}%</span></div>
                            <div className="flex justify-between p-3 text-sm"><span className="text-slate-500 dark:text-slate-400">3x Scope</span> <span className="font-mono font-bold">{settings.sensitivity.camera.x3}%</span></div>
                            <div className="flex justify-between p-3 text-sm"><span className="text-slate-500 dark:text-slate-400">4x Scope</span> <span className="font-mono font-bold">{settings.sensitivity.camera.x4}%</span></div>
                        </div>
                    </div>

                    {/* ADS */}
                    <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                        <div className="bg-slate-50 dark:bg-slate-800 p-3 border-b border-slate-200 dark:border-slate-700 text-center font-bold text-slate-700 dark:text-slate-300">
                            ADS Sensitivity
                        </div>
                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                            <div className="flex justify-between p-3 text-sm"><span className="text-slate-500 dark:text-slate-400">TP No Scope</span> <span className="font-mono font-bold">{settings.sensitivity.ads.noScope}%</span></div>
                            <div className="flex justify-between p-3 text-sm"><span className="text-slate-500 dark:text-slate-400">Red Dot</span> <span className="font-mono font-bold">{settings.sensitivity.ads.redDot}%</span></div>
                            <div className="flex justify-between p-3 text-sm"><span className="text-slate-500 dark:text-slate-400">3x Scope</span> <span className="font-mono font-bold">{settings.sensitivity.ads.x3}%</span></div>
                            <div className="flex justify-between p-3 text-sm"><span className="text-slate-500 dark:text-slate-400">4x Scope</span> <span className="font-mono font-bold">{settings.sensitivity.ads.x4}%</span></div>
                        </div>
                    </div>

                    {/* Gyroscope */}
                    <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                        <div className="bg-slate-50 dark:bg-slate-800 p-3 border-b border-slate-200 dark:border-slate-700 text-center font-bold text-slate-700 dark:text-slate-300">
                            Gyroscope
                        </div>
                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                            <div className="flex justify-between p-3 text-sm"><span className="text-slate-500 dark:text-slate-400">TP No Scope</span> <span className="font-mono font-bold">{settings.sensitivity.gyro.noScope}%</span></div>
                            <div className="flex justify-between p-3 text-sm"><span className="text-slate-500 dark:text-slate-400">Red Dot</span> <span className="font-mono font-bold">{settings.sensitivity.gyro.redDot}%</span></div>
                            <div className="flex justify-between p-3 text-sm"><span className="text-slate-500 dark:text-slate-400">3x Scope</span> <span className="font-mono font-bold">{settings.sensitivity.gyro.x3}%</span></div>
                            <div className="flex justify-between p-3 text-sm"><span className="text-slate-500 dark:text-slate-400">4x Scope</span> <span className="font-mono font-bold">{settings.sensitivity.gyro.x4}%</span></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};