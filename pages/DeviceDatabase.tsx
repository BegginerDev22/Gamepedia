
import React, { useState } from 'react';
import { Smartphone, Search, Cpu, Battery, Zap, Check, X } from 'lucide-react';
import { MOCK_DEVICES } from '../constants';

export const DeviceDatabasePage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [fpsFilter, setFpsFilter] = useState('All');

    const filteredDevices = MOCK_DEVICES.filter(device => {
        const matchesSearch = device.model.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              device.brand.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFps = fpsFilter === 'All' || device.maxFps === fpsFilter;
        return matchesSearch && matchesFps;
    });

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-12">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-heading font-bold text-slate-900 dark:text-white flex items-center justify-center">
                    <Smartphone className="mr-3 text-gamepedia-blue" /> Device Compatibility
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2">
                    Check FPS support, gyroscope quality, and specs for BGMI.
                </p>
            </div>

            <div className="flex flex-col md:flex-row justify-center gap-4 mb-8">
                <div className="relative w-full md:w-80">
                    <input 
                        type="text" 
                        placeholder="Search phone model..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gamepedia-blue dark:text-white shadow-sm"
                    />
                    <Search size={18} className="absolute left-3 top-3.5 text-slate-400" />
                </div>
                
                <div className="flex bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    {['All', '90 FPS', '60 FPS'].map(fps => (
                        <button
                            key={fps}
                            onClick={() => setFpsFilter(fps)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                                fpsFilter === fps 
                                ? 'bg-slate-100 dark:bg-slate-800 text-gamepedia-blue' 
                                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                            }`}
                        >
                            {fps}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDevices.map(device => (
                    <div key={device.id} className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-md transition-all group">
                        <div className="flex p-4 border-b border-slate-100 dark:border-slate-800">
                            <div className="w-20 h-24 shrink-0 mr-4 bg-white rounded-lg flex items-center justify-center p-2">
                                <img src={device.image} alt={device.model} className="max-h-full max-w-full object-contain" />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <span className="text-xs font-bold text-slate-400 uppercase">{device.brand}</span>
                                    {device.maxFps === '90 FPS' && (
                                        <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] px-2 py-0.5 rounded font-bold flex items-center">
                                            <Zap size={10} className="mr-1" /> 90 FPS
                                        </span>
                                    )}
                                </div>
                                <h3 className="font-bold text-lg text-slate-900 dark:text-white mt-1 group-hover:text-gamepedia-blue transition-colors">{device.model}</h3>
                                <p className="text-xs text-slate-500 mt-1">{device.releaseYear}</p>
                            </div>
                        </div>
                        
                        <div className="p-4 space-y-3">
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center text-slate-600 dark:text-slate-400">
                                    <Cpu size={16} className="mr-2" /> Processor
                                </div>
                                <span className="font-medium text-slate-900 dark:text-white">{device.processor}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center text-slate-600 dark:text-slate-400">
                                    <Battery size={16} className="mr-2" /> Battery
                                </div>
                                <span className="font-medium text-slate-900 dark:text-white">{device.battery}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center text-slate-600 dark:text-slate-400">
                                    <Smartphone size={16} className="mr-2" /> Gyroscope
                                </div>
                                <span className={`font-bold ${device.gyro === 'Hardware' ? 'text-green-500' : 'text-yellow-500'}`}>
                                    {device.gyro}
                                </span>
                            </div>
                        </div>

                        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 text-center">
                            <button className="text-xs font-bold text-gamepedia-blue hover:underline">View Full Specifications</button>
                        </div>
                    </div>
                ))}
            </div>

            {filteredDevices.length === 0 && (
                <div className="text-center py-20 text-slate-500">
                    <Smartphone size={48} className="mx-auto mb-3 opacity-50" />
                    <p>No devices found. Try searching for 'iPhone' or 'OnePlus'.</p>
                </div>
            )}
        </div>
    );
};
