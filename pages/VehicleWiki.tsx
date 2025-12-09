
import React, { useState } from 'react';
import { Car, Search, Zap, Heart, Users, Gauge, Plane, Ship } from 'lucide-react';
import { MOCK_VEHICLES } from '../constants';
import { Vehicle } from '../types';

const VehicleImage: React.FC<{ vehicle: Vehicle }> = ({ vehicle }) => {
    const [error, setError] = useState(false);
    
    if (error) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-200 dark:bg-slate-700/50 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600">
                {vehicle.type === 'Air' ? <Plane size={48} strokeWidth={1.5} /> : 
                 vehicle.type === 'Water' ? <Ship size={48} strokeWidth={1.5} /> : 
                 <Car size={48} strokeWidth={1.5} />}
                <span className="text-[10px] font-bold mt-2 uppercase tracking-wider opacity-70">{vehicle.name}</span>
            </div>
        );
    }

    return (
        <img 
            src={vehicle.image} 
            alt={vehicle.name} 
            className="max-h-full max-w-full object-contain drop-shadow-lg group-hover:scale-110 transition-transform duration-300"
            onError={() => setError(true)}
        />
    );
};

export const VehicleWikiPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<'All' | 'Land' | 'Water' | 'Air'>('All');

    const filteredVehicles = MOCK_VEHICLES.filter(v => {
        const matchesSearch = v.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'All' || v.type === filterType;
        return matchesSearch && matchesType;
    });

    const getStatWidth = (value: number, max: number) => Math.min((value / max) * 100, 100);

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-12">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-heading font-bold text-slate-900 dark:text-white flex items-center justify-center">
                    <Car className="mr-3 text-gamepedia-blue" /> Vehicle Wiki
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">
                    Stats for every vehicle in BGMI. Speed, health, and capacity.
                </p>
            </div>

            <div className="flex flex-col md:flex-row justify-center gap-4 mb-8">
                <div className="relative w-full md:w-80">
                    <input 
                        type="text" 
                        placeholder="Search vehicles..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gamepedia-blue dark:text-white shadow-sm"
                    />
                    <Search size={18} className="absolute left-3 top-3.5 text-slate-400" />
                </div>
                
                <div className="flex bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    {['All', 'Land', 'Water', 'Air'].map(type => (
                        <button
                            key={type}
                            onClick={() => setFilterType(type as any)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                                filterType === type 
                                ? 'bg-slate-100 dark:bg-slate-800 text-gamepedia-blue' 
                                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                            }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVehicles.map(vehicle => (
                    <div key={vehicle.id} className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden group hover:shadow-md transition-all">
                        <div className="h-48 bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center p-6 relative">
                            <VehicleImage vehicle={vehicle} />
                            <span className="absolute top-3 right-3 px-2 py-1 bg-black/50 text-white text-[10px] font-bold rounded uppercase backdrop-blur-sm">
                                {vehicle.type}
                            </span>
                        </div>

                        <div className="p-5">
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="font-bold text-slate-900 dark:text-white text-lg">{vehicle.name}</h3>
                                <div className="flex items-center text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                                    <Users size={12} className="mr-1" /> {vehicle.seats} Seats
                                </div>
                            </div>

                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 line-clamp-2 h-8">
                                {vehicle.description}
                            </p>

                            <div className="space-y-3">
                                <div>
                                    <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                                        <span className="flex items-center"><Gauge size={12} className="mr-1"/> Max Speed</span>
                                        <span>{vehicle.maxSpeed} km/h</span>
                                    </div>
                                    <div className="h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${getStatWidth(vehicle.maxSpeed, 160)}%` }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                                        <span className="flex items-center"><Heart size={12} className="mr-1"/> Health</span>
                                        <span>{vehicle.health} HP</span>
                                    </div>
                                    <div className="h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-green-500 rounded-full" style={{ width: `${getStatWidth(vehicle.health, 2500)}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
    