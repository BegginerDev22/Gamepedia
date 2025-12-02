
import React, { useState } from 'react';
import { Crosshair, Target, Zap, Gauge, Shield, Search, Filter, X, Info } from 'lucide-react';
import { MOCK_WEAPONS } from '../constants';
import { Weapon } from '../types';

const StatBar: React.FC<{ label: string; value: number; color: string; inverse?: boolean }> = ({ label, value, color, inverse }) => (
    <div className="mb-2">
        <div className="flex justify-between text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
            <span>{label}</span>
            <span>{value}</span>
        </div>
        <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div 
                className={`h-full rounded-full ${color}`} 
                style={{ width: `${inverse ? 100 - value : value}%` }}
            ></div>
        </div>
    </div>
);

const WeaponDetailModal: React.FC<{ weapon: Weapon; onClose: () => void }> = ({ weapon, onClose }) => {
    // Damage Multipliers (Approximate BGMI values)
    const HEAD_MULT = weapon.type === 'SR' ? 2.5 : 2.3;
    const BODY_MULT = 1.0;
    
    // Armor Reduction
    const REDUCTION = {
        0: 0,
        1: 0.30,
        2: 0.40,
        3: 0.55
    };

    const calculateSTK = (multiplier: number, armorLevel: 0 | 1 | 2 | 3) => {
        const dmg = weapon.damage * multiplier * (1 - REDUCTION[armorLevel]);
        return Math.ceil(100 / dmg);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-sm animate-fade-in" onClick={onClose}>
            <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="relative h-48 bg-slate-100 dark:bg-slate-800 flex items-center justify-center p-8">
                    <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                    <img src={weapon.image} alt={weapon.name} className="max-h-full drop-shadow-xl scale-125" />
                    <span className={`absolute bottom-4 left-4 px-3 py-1 text-xs font-bold rounded uppercase ${
                        weapon.tier === 'S' ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white' :
                        weapon.tier === 'A' ? 'bg-purple-500 text-white' : 'bg-slate-500 text-white'
                    }`}>
                        {weapon.tier}-Tier {weapon.type}
                    </span>
                </div>
                
                <div className="p-6">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-3xl font-heading font-bold text-slate-900 dark:text-white">{weapon.name}</h2>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Uses <strong className="text-gamepedia-blue">{weapon.ammoType}</strong> Ammo</p>
                        </div>
                        <div className="text-right">
                            <span className="block text-3xl font-mono font-bold text-slate-900 dark:text-white">{weapon.damage}</span>
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Base DMG</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center">
                                <Gauge size={16} className="mr-2 text-slate-500" /> Weapon Stats
                            </h4>
                            <div className="space-y-4">
                                <StatBar label="Fire Rate" value={weapon.fireRate} color="bg-yellow-500" />
                                <StatBar label="Range" value={weapon.range} color="bg-blue-500" />
                                <StatBar label="Recoil Control" value={100 - weapon.recoil} color="bg-green-500" />
                            </div>
                        </div>

                        <div>
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center">
                                <Target size={16} className="mr-2 text-red-500" /> Shots to Kill (STK)
                            </h4>
                            <div className="bg-slate-50 dark:bg-slate-800 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                                <table className="w-full text-sm text-center">
                                    <thead className="bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 font-bold text-xs uppercase">
                                        <tr>
                                            <th className="py-2">Armor</th>
                                            <th className="py-2">Head</th>
                                            <th className="py-2">Body</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                        {[0, 1, 2, 3].map(level => (
                                            <tr key={level} className="text-slate-700 dark:text-slate-200">
                                                <td className="py-2 font-bold text-xs text-slate-500 dark:text-slate-400">
                                                    {level === 0 ? 'None' : `Lv${level}`}
                                                </td>
                                                <td className="py-2 font-mono font-bold text-red-500">
                                                    {calculateSTK(HEAD_MULT, level as any)}
                                                </td>
                                                <td className="py-2 font-mono font-bold">
                                                    {calculateSTK(BODY_MULT, level as any)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const WeaponsPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedType, setSelectedType] = useState<string>('All');
    const [selectedWeapon, setSelectedWeapon] = useState<Weapon | null>(null);

    const types = ['All', 'AR', 'SMG', 'SR', 'DMR', 'Shotgun'];

    const filteredWeapons = MOCK_WEAPONS.filter(w => {
        const matchesSearch = w.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = selectedType === 'All' || w.type === selectedType;
        return matchesSearch && matchesType;
    });

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-slate-900 dark:text-white flex items-center">
                        <Crosshair className="mr-3 text-red-500" /> Weapon Wiki
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Detailed statistics for all available firearms in Battlegrounds Mobile India.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="Search weapons..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full sm:w-64 pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 dark:text-white"
                        />
                        <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
                    </div>
                    
                    <div className="flex bg-white dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-700 overflow-x-auto no-scrollbar">
                        {types.map(type => (
                            <button
                                key={type}
                                onClick={() => setSelectedType(type)}
                                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-colors whitespace-nowrap ${
                                    selectedType === type 
                                    ? 'bg-red-500 text-white shadow-md' 
                                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                                }`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                {filteredWeapons.map(weapon => (
                    <div 
                        key={weapon.id} 
                        onClick={() => setSelectedWeapon(weapon)}
                        className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden hover:border-red-500/50 transition-all group cursor-pointer"
                    >
                        {/* Image Area */}
                        <div className="h-40 bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center p-6 relative">
                            <img 
                                src={weapon.image} 
                                alt={weapon.name} 
                                className="max-w-full max-h-full object-contain drop-shadow-lg group-hover:scale-110 transition-transform duration-500"
                                onError={(e) => {
                                    e.currentTarget.src = 'https://placehold.co/400x200/2d3748/a0aec0?text=' + weapon.name;
                                    e.currentTarget.onerror = null;
                                }}
                            />
                            <span className={`absolute top-3 right-3 px-2 py-1 text-[10px] font-bold rounded ${
                                weapon.tier === 'S' ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white' :
                                weapon.tier === 'A' ? 'bg-purple-500 text-white' :
                                'bg-slate-500 text-white'
                            }`}>
                                {weapon.tier}-Tier
                            </span>
                            <span className="absolute bottom-3 left-3 px-2 py-1 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-bold rounded uppercase">
                                {weapon.type}
                            </span>
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="bg-white/90 text-slate-900 px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center">
                                    <Info size={12} className="mr-1" /> View Stats
                                </span>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="p-5">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{weapon.name}</h3>
                                <span className="text-xs font-mono text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 px-2 py-1 rounded">
                                    {weapon.ammoType}
                                </span>
                            </div>

                            <div className="space-y-3">
                                <StatBar label="Damage" value={weapon.damage} color="bg-red-500" />
                                <StatBar label="Fire Rate" value={weapon.fireRate} color="bg-yellow-500" />
                                <StatBar label="Range" value={weapon.range} color="bg-blue-500" />
                                <StatBar label="Stability" value={weapon.recoil} color="bg-green-500" inverse />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredWeapons.length === 0 && (
                <div className="text-center py-20 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
                    <Target size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">No weapons found</h3>
                    <p className="text-slate-500">Try searching for M416 or AWM.</p>
                </div>
            )}

            {selectedWeapon && (
                <WeaponDetailModal weapon={selectedWeapon} onClose={() => setSelectedWeapon(null)} />
            )}
        </div>
    );
};
