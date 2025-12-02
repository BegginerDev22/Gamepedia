
import React, { useState } from 'react';
import { Crosshair, Copy, Check, RotateCcw, Smartphone, Monitor, Image as ImageIcon } from 'lucide-react';
import { PRO_CROSSHAIRS } from '../constants';
import { CrosshairConfig } from '../types';

export const CrosshairGeneratorPage: React.FC = () => {
    const [config, setConfig] = useState<CrosshairConfig>({
        color: '#00FF00',
        length: 10,
        thickness: 2,
        gap: 0,
        outline: true,
        dot: false
    });
    const [bgImage, setBgImage] = useState('https://raw.githubusercontent.com/pubg/api-assets/master/Assets/Maps/Erangel_Main_Low_Res.png');
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        const code = JSON.stringify(config);
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const applyPreset = (name: string) => {
        if (PRO_CROSSHAIRS[name]) {
            setConfig(PRO_CROSSHAIRS[name]);
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-12">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-heading font-bold text-slate-900 dark:text-white flex items-center justify-center">
                    <Crosshair className="mr-3 text-gamepedia-blue" /> Crosshair Generator
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">
                    Design your perfect aim. Visualize, customize, and copy pro player settings.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Controls */}
                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 space-y-6">
                    <div>
                        <h3 className="font-bold text-slate-900 dark:text-white mb-4">Pro Presets</h3>
                        <div className="grid grid-cols-2 gap-3">
                            {Object.keys(PRO_CROSSHAIRS).map(name => (
                                <button 
                                    key={name}
                                    onClick={() => applyPreset(name)}
                                    className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold text-slate-700 dark:text-slate-300 capitalize hover:border-gamepedia-blue transition-colors"
                                >
                                    {name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="border-t border-slate-100 dark:border-slate-800 pt-6 space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Color</label>
                            <div className="flex gap-2">
                                {['#00FF00', '#00FFFF', '#FF0000', '#FFFFFF', '#FFFF00', '#FF00FF'].map(c => (
                                    <button 
                                        key={c}
                                        onClick={() => setConfig(prev => ({ ...prev, color: c }))}
                                        className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${config.color === c ? 'border-slate-900 dark:border-white scale-110' : 'border-transparent'}`}
                                        style={{ backgroundColor: c }}
                                    />
                                ))}
                                <input 
                                    type="color" 
                                    value={config.color}
                                    onChange={(e) => setConfig(prev => ({ ...prev, color: e.target.value }))}
                                    className="w-8 h-8 p-0 border-0 rounded-full overflow-hidden cursor-pointer"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between mb-1">
                                <label className="text-xs font-bold text-slate-500 uppercase">Length</label>
                                <span className="text-xs font-mono">{config.length}</span>
                            </div>
                            <input 
                                type="range" min="0" max="50" 
                                value={config.length} 
                                onChange={(e) => setConfig(prev => ({ ...prev, length: parseInt(e.target.value) }))}
                                className="w-full accent-gamepedia-blue"
                            />
                        </div>

                        <div>
                            <div className="flex justify-between mb-1">
                                <label className="text-xs font-bold text-slate-500 uppercase">Thickness</label>
                                <span className="text-xs font-mono">{config.thickness}</span>
                            </div>
                            <input 
                                type="range" min="1" max="20" 
                                value={config.thickness} 
                                onChange={(e) => setConfig(prev => ({ ...prev, thickness: parseInt(e.target.value) }))}
                                className="w-full accent-gamepedia-blue"
                            />
                        </div>

                        <div>
                            <div className="flex justify-between mb-1">
                                <label className="text-xs font-bold text-slate-500 uppercase">Gap</label>
                                <span className="text-xs font-mono">{config.gap}</span>
                            </div>
                            <input 
                                type="range" min="0" max="20" 
                                value={config.gap} 
                                onChange={(e) => setConfig(prev => ({ ...prev, gap: parseInt(e.target.value) }))}
                                className="w-full accent-gamepedia-blue"
                            />
                        </div>

                        <div className="flex items-center justify-between pt-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Outline</label>
                            <input 
                                type="checkbox" 
                                checked={config.outline} 
                                onChange={(e) => setConfig(prev => ({ ...prev, outline: e.target.checked }))}
                                className="w-5 h-5 accent-gamepedia-blue rounded cursor-pointer"
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Center Dot</label>
                            <input 
                                type="checkbox" 
                                checked={config.dot} 
                                onChange={(e) => setConfig(prev => ({ ...prev, dot: e.target.checked }))}
                                className="w-5 h-5 accent-gamepedia-blue rounded cursor-pointer"
                            />
                        </div>
                    </div>

                    <button 
                        onClick={handleCopy}
                        className="w-full py-3 bg-gamepedia-blue text-white rounded-lg font-bold flex items-center justify-center hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/30"
                    >
                        {copied ? <Check className="mr-2" /> : <Copy className="mr-2" />}
                        {copied ? 'Copied!' : 'Copy Config'}
                    </button>
                </div>

                {/* Preview Area */}
                <div className="lg:col-span-2 bg-black rounded-xl overflow-hidden relative shadow-2xl border border-slate-800 group flex flex-col">
                    <div className="relative flex-1 min-h-[500px]">
                        {/* Background Image */}
                        {bgImage === 'black' ? (
                            <div className="w-full h-full bg-black"></div>
                        ) : bgImage === 'white' ? (
                            <div className="w-full h-full bg-white"></div>
                        ) : (
                            <img 
                                src={bgImage} 
                                className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                                alt="Game Background"
                            />
                        )}
                        
                        {/* Crosshair Render */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="relative">
                                {/* Top Line */}
                                <div 
                                    style={{ 
                                        position: 'absolute',
                                        bottom: `${config.gap}px`,
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        width: `${config.thickness}px`,
                                        height: `${config.length}px`,
                                        backgroundColor: config.color,
                                        boxShadow: config.outline ? '0 0 0 1px black' : 'none'
                                    }} 
                                />
                                {/* Bottom Line */}
                                <div 
                                    style={{ 
                                        position: 'absolute',
                                        top: `${config.gap}px`,
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        width: `${config.thickness}px`,
                                        height: `${config.length}px`,
                                        backgroundColor: config.color,
                                        boxShadow: config.outline ? '0 0 0 1px black' : 'none'
                                    }} 
                                />
                                {/* Left Line */}
                                <div 
                                    style={{ 
                                        position: 'absolute',
                                        right: `${config.gap}px`,
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        height: `${config.thickness}px`,
                                        width: `${config.length}px`,
                                        backgroundColor: config.color,
                                        boxShadow: config.outline ? '0 0 0 1px black' : 'none'
                                    }} 
                                />
                                {/* Right Line */}
                                <div 
                                    style={{ 
                                        position: 'absolute',
                                        left: `${config.gap}px`,
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        height: `${config.thickness}px`,
                                        width: `${config.length}px`,
                                        backgroundColor: config.color,
                                        boxShadow: config.outline ? '0 0 0 1px black' : 'none'
                                    }} 
                                />
                                {/* Center Dot */}
                                {config.dot && (
                                    <div 
                                        style={{
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            transform: 'translate(-50%, -50%)',
                                            width: `${config.thickness}px`,
                                            height: `${config.thickness}px`,
                                            backgroundColor: config.color,
                                            borderRadius: '50%',
                                            boxShadow: config.outline ? '0 0 0 1px black' : 'none'
                                        }}
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Preview Controls */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 backdrop-blur p-1.5 rounded-xl border border-white/10 flex gap-2">
                        <button 
                            onClick={() => setBgImage('https://raw.githubusercontent.com/pubg/api-assets/master/Assets/Maps/Erangel_Main_Low_Res.png')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-colors ${bgImage.includes('Erangel') ? 'bg-gamepedia-blue' : 'hover:bg-white/10'}`}
                        >
                            Outdoors
                        </button>
                        <button 
                            onClick={() => setBgImage('https://raw.githubusercontent.com/pubg/api-assets/master/Assets/Maps/Miramar_Main_Low_Res.png')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-colors ${bgImage.includes('Miramar') ? 'bg-gamepedia-blue' : 'hover:bg-white/10'}`}
                        >
                            Desert
                        </button>
                        <button 
                            onClick={() => setBgImage('black')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-colors ${bgImage === 'black' ? 'bg-gamepedia-blue' : 'hover:bg-white/10'}`}
                        >
                            Dark
                        </button>
                        <button 
                            onClick={() => setBgImage('white')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-colors ${bgImage === 'white' ? 'bg-gamepedia-blue' : 'hover:bg-white/10'}`}
                        >
                            Bright
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
