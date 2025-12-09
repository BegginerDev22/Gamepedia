
import React, { useState, useRef, useEffect } from 'react';
import { Map, Layers, MapPin, Navigation, Shield, Info, Ruler } from 'lucide-react';
import { MOCK_MAPS, MOCK_TEAMS } from '../constants';
import { MapPOI } from '../types';

export const StrategyMapPage: React.FC = () => {
    const [activeMapId, setActiveMapId] = useState('erangel');
    const [layers, setLayers] = useState({
        drops: true,
        loot: true,
        vehicles: false
    });
    const [selectedPoint, setSelectedPoint] = useState<MapPOI | null>(null);
    
    // Measure Tool State
    const [isMeasuring, setIsMeasuring] = useState(false);
    const [measurePoints, setMeasurePoints] = useState<{x: number, y: number}[]>([]);
    const mapRef = useRef<HTMLDivElement>(null);

    const activeMap = MOCK_MAPS[activeMapId];
    
    const toggleLayer = (key: keyof typeof layers) => {
        setLayers(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const toggleMeasureMode = () => {
        setIsMeasuring(!isMeasuring);
        setMeasurePoints([]);
        setSelectedPoint(null);
    };

    const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isMeasuring || !mapRef.current) return;

        const rect = mapRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        if (measurePoints.length >= 2) {
            setMeasurePoints([{ x, y }]); // Reset start point
        } else {
            setMeasurePoints(prev => [...prev, { x, y }]);
        }
    };

    const calculateDistance = () => {
        if (measurePoints.length < 2) return 0;
        const p1 = measurePoints[0];
        const p2 = measurePoints[1];
        
        // Euclidean distance in percentages
        const distPercent = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
        
        // Map Scale approximation (Erangel is 8000m wide)
        // Adjust scale based on map ID
        const mapScale = activeMapId === 'sanhok' ? 40 : 80; // 4000m vs 8000m roughly
        return Math.round(distPercent * mapScale);
    };

    const filteredPoints = activeMap.points.filter(p => {
        if (p.type === 'drop' && layers.drops) return true;
        if (p.type === 'loot' && layers.loot) return true;
        if (p.type === 'vehicle' && layers.vehicles) return true;
        return false;
    });

    return (
        <div className="h-[calc(100vh-80px)] flex flex-col lg:flex-row gap-4 animate-fade-in">
            {/* Sidebar Controls */}
            <div className="w-full lg:w-80 bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col h-full overflow-y-auto">
                <div className="mb-8">
                    <h1 className="text-2xl font-heading font-bold text-slate-900 dark:text-white flex items-center mb-2">
                        <Map className="mr-2 text-gamepedia-blue" /> Strategy Map
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Analyze drop spots, rotations, and resource spawns.
                    </p>
                </div>

                {/* Map Selector */}
                <div className="mb-8">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Select Map</label>
                    <div className="grid grid-cols-2 gap-2">
                        {Object.values(MOCK_MAPS).map(map => (
                            <button 
                                key={map.id}
                                onClick={() => { setActiveMapId(map.id); setSelectedPoint(null); setMeasurePoints([]); }}
                                className={`py-3 rounded-lg text-sm font-bold border-2 transition-all ${
                                    activeMapId === map.id 
                                    ? 'border-gamepedia-blue bg-blue-50 dark:bg-blue-900/20 text-gamepedia-blue' 
                                    : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-500 hover:border-slate-300'
                                }`}
                            >
                                {map.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tools */}
                <div className="mb-8">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Tools</label>
                    <button 
                        onClick={toggleMeasureMode}
                        className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition-colors ${isMeasuring ? 'bg-amber-50 border-amber-400 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-400'}`}
                    >
                        <div className="flex items-center">
                            <Ruler size={18} className="mr-3" />
                            <span className="font-bold text-sm">Measure Distance</span>
                        </div>
                        {isMeasuring && <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>}
                    </button>
                    {isMeasuring && measurePoints.length === 2 && (
                        <div className="mt-2 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg text-center">
                            <span className="text-xs font-bold text-slate-500 uppercase block mb-1">Distance</span>
                            <span className="text-2xl font-mono font-bold text-slate-900 dark:text-white">{calculateDistance()}m</span>
                        </div>
                    )}
                    {isMeasuring && measurePoints.length < 2 && (
                        <p className="text-xs text-slate-500 mt-2 text-center animate-pulse">
                            Click two points on the map
                        </p>
                    )}
                </div>

                {/* Layers */}
                <div className="mb-8">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Layers</label>
                    <div className="space-y-2">
                        <button 
                            onClick={() => toggleLayer('drops')}
                            className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${layers.drops ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' : 'border-slate-200 dark:border-slate-700'}`}
                        >
                            <div className="flex items-center">
                                <Shield size={18} className={`${layers.drops ? 'text-green-600' : 'text-slate-400'} mr-3`} />
                                <span className={`text-sm font-medium ${layers.drops ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>Team Drops</span>
                            </div>
                            <div className={`w-4 h-4 rounded border flex items-center justify-center ${layers.drops ? 'bg-green-500 border-green-500' : 'border-slate-300'}`}>
                                {layers.drops && <div className="w-2 h-2 bg-white rounded-sm" />}
                            </div>
                        </button>

                        <button 
                            onClick={() => toggleLayer('loot')}
                            className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${layers.loot ? 'bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800' : 'border-slate-200 dark:border-slate-700'}`}
                        >
                            <div className="flex items-center">
                                <MapPin size={18} className={`${layers.loot ? 'text-orange-600' : 'text-slate-400'} mr-3`} />
                                <span className={`text-sm font-medium ${layers.loot ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>High Tier Loot</span>
                            </div>
                            <div className={`w-4 h-4 rounded border flex items-center justify-center ${layers.loot ? 'bg-orange-500 border-orange-500' : 'border-slate-300'}`}>
                                {layers.loot && <div className="w-2 h-2 bg-white rounded-sm" />}
                            </div>
                        </button>

                        <button 
                            onClick={() => toggleLayer('vehicles')}
                            className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${layers.vehicles ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800' : 'border-slate-200 dark:border-slate-700'}`}
                        >
                            <div className="flex items-center">
                                <Navigation size={18} className={`${layers.vehicles ? 'text-blue-600' : 'text-slate-400'} mr-3`} />
                                <span className={`text-sm font-medium ${layers.vehicles ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>Vehicle Spawns</span>
                            </div>
                            <div className={`w-4 h-4 rounded border flex items-center justify-center ${layers.vehicles ? 'bg-blue-500 border-blue-500' : 'border-slate-300'}`}>
                                {layers.vehicles && <div className="w-2 h-2 bg-white rounded-sm" />}
                            </div>
                        </button>
                    </div>
                </div>

                {/* Point Details */}
                {selectedPoint ? (
                    <div className="mt-auto bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 animate-fade-in">
                        <div className="flex items-center space-x-3 mb-2">
                            {selectedPoint.type === 'drop' && selectedPoint.teamId && MOCK_TEAMS[selectedPoint.teamId]?.logoUrl ? (
                                <img src={MOCK_TEAMS[selectedPoint.teamId].logoUrl} className="w-8 h-8 rounded bg-white p-0.5" alt="" />
                            ) : (
                                <Info size={24} className="text-gamepedia-blue" />
                            )}
                            <div>
                                <h4 className="font-bold text-slate-900 dark:text-white">{selectedPoint.name}</h4>
                                <span className="text-xs text-slate-500 uppercase">{selectedPoint.type}</span>
                            </div>
                        </div>
                        {selectedPoint.teamId && MOCK_TEAMS[selectedPoint.teamId] && (
                            <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
                                Primary drop location for <span className="font-bold text-gamepedia-blue">{MOCK_TEAMS[selectedPoint.teamId].name}</span>.
                            </p>
                        )}
                        {selectedPoint.description && (
                            <p className="text-sm text-slate-600 dark:text-slate-300 italic">
                                {selectedPoint.description}
                            </p>
                        )}
                    </div>
                ) : (
                    <div className="mt-auto text-center text-slate-400 text-sm p-4">
                        {isMeasuring ? 'Click map to measure distance.' : 'Select a point on the map to view details.'}
                    </div>
                )}
            </div>

            {/* Map Container */}
            <div className="flex-1 bg-slate-900 rounded-xl shadow-lg border border-slate-800 relative overflow-hidden flex items-center justify-center">
                <div 
                    ref={mapRef}
                    className={`relative w-full h-full flex items-center justify-center group/map ${isMeasuring ? 'cursor-crosshair' : ''}`}
                    onClick={handleMapClick}
                >
                    <img 
                        src={activeMap.imageUrl} 
                        alt={activeMap.name}
                        className="max-w-full max-h-full object-contain select-none"
                        onError={(e) => {
                            // Fallback to a more subtle grid/tactical placeholder
                            e.currentTarget.src = 'https://placehold.co/1024x1024/1a202c/4a5568?text=Tactical+Grid+Data&font=roboto';
                            e.currentTarget.onerror = null; // Prevent infinite loop
                        }}
                    />
                    
                    {/* Grid Overlay (always visible for tactical feel) */}
                    <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 pointer-events-none opacity-20 w-full h-full max-w-aspect max-h-aspect mx-auto">
                         {Array.from({ length: 64 }).map((_, i) => (
                             <div key={i} className="border border-white"></div>
                         ))}
                    </div>

                    {/* Measurement Line Layer */}
                    {isMeasuring && measurePoints.length > 0 && (
                        <div className="absolute inset-0 w-full h-full pointer-events-none z-20">
                            <svg className="w-full h-full">
                                {measurePoints.map((p, i) => (
                                    <circle key={i} cx={`${p.x}%`} cy={`${p.y}%`} r="4" fill="#fbbf24" stroke="white" strokeWidth="2" />
                                ))}
                                {measurePoints.length === 2 && (
                                    <line 
                                        x1={`${measurePoints[0].x}%`} 
                                        y1={`${measurePoints[0].y}%`} 
                                        x2={`${measurePoints[1].x}%`} 
                                        y2={`${measurePoints[1].y}%`} 
                                        stroke="#fbbf24" 
                                        strokeWidth="3" 
                                        strokeDasharray="5,5" 
                                    />
                                )}
                            </svg>
                        </div>
                    )}

                    {/* Points Layer */}
                    <div className="absolute inset-0 w-full h-full">
                        {filteredPoints.map(point => (
                            <div
                                key={point.id}
                                className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10 group"
                                style={{ left: `${point.x}%`, top: `${point.y}%` }}
                            >
                                <button
                                    onClick={(e) => {
                                        if (isMeasuring) return; // Ignore click if measuring
                                        e.stopPropagation();
                                        setSelectedPoint(point);
                                    }}
                                    className={`relative transition-all duration-300 outline-none ${selectedPoint?.id === point.id ? 'scale-125 z-30' : 'hover:scale-110 z-10'}`}
                                >
                                    {/* Selection Glow Ring */}
                                    {selectedPoint?.id === point.id && (
                                        <div className="absolute inset-0 rounded-full animate-ping bg-white/50"></div>
                                    )}

                                    {point.type === 'drop' ? (
                                        point.teamId && MOCK_TEAMS[point.teamId] ? (
                                            <div className={`w-9 h-9 rounded-full border-2 ${selectedPoint?.id === point.id ? 'border-gamepedia-blue ring-2 ring-white shadow-[0_0_20px_rgba(43,93,245,0.8)]' : 'border-white shadow-lg'} overflow-hidden bg-slate-900 relative z-10`}>
                                                <img 
                                                    src={MOCK_TEAMS[point.teamId].logoUrl} 
                                                    className="w-full h-full object-cover"
                                                    alt={point.name}
                                                />
                                            </div>
                                        ) : (
                                            <div className={`w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white ${selectedPoint?.id === point.id ? 'ring-2 ring-red-300' : ''} relative z-10`}>
                                                <Shield size={14} fill="currentColor" />
                                            </div>
                                        )
                                    ) : point.type === 'vehicle' ? (
                                        <div className={`w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white ${selectedPoint?.id === point.id ? 'ring-2 ring-blue-300' : ''} relative z-10`}>
                                            <Navigation size={14} fill="currentColor" />
                                        </div>
                                    ) : (
                                        // Loot
                                        <div className={`w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white ${selectedPoint?.id === point.id ? 'ring-2 ring-amber-300' : ''} relative z-10`}>
                                            <MapPin size={14} fill="currentColor" />
                                        </div>
                                    )}
                                </button>
                                
                                {/* Tooltip Label */}
                                <div className="absolute -bottom-9 left-1/2 transform -translate-x-1/2 bg-slate-900/90 backdrop-blur text-white text-[10px] font-bold px-2.5 py-1 rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 border border-slate-700">
                                    {point.name}
                                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 border-4 border-transparent border-b-slate-900/90"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded text-xs font-mono z-20">
                    Coordinates: {selectedPoint ? `${selectedPoint.x}, ${selectedPoint.y}` : 'N/A'}
                </div>
            </div>
        </div>
    );
};
