
import React, { useState, useRef, useEffect } from 'react';
import { Map, Trash2, Download, PenTool, MousePointer, Eraser, Undo, Redo, ArrowUpRight, Stamp, Type, Square, Circle, Grid as GridIcon, BoxSelect } from 'lucide-react';
import { MOCK_MAPS } from '../constants';

export const StrategyBoardPage: React.FC = () => {
    const [activeMapId, setActiveMapId] = useState('erangel');
    const [tool, setTool] = useState<'draw' | 'erase' | 'pointer' | 'arrow' | 'stamp' | 'text' | 'rect' | 'circle'>('draw');
    const [color, setColor] = useState('#ff0000');
    const [brushSize, setBrushSize] = useState(4);
    const [selectedStamp, setSelectedStamp] = useState('📍');
    const [textInput, setTextInput] = useState('Attack Here');
    const [isDashed, setIsDashed] = useState(false);
    const [showGrid, setShowGrid] = useState(false);
    
    // Canvas & State
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [startPos, setStartPos] = useState<{x: number, y: number} | null>(null);
    const [snapshot, setSnapshot] = useState<ImageData | null>(null);
    const [cursorPos, setCursorPos] = useState<{x: number, y: number} | null>(null);
    
    // History
    const [history, setHistory] = useState<ImageData[]>([]);
    const [historyStep, setHistoryStep] = useState(-1);

    const activeMap = MOCK_MAPS[activeMapId];

    // Initialize Canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                // Set internal resolution
                canvas.width = 1200; 
                canvas.height = 800;
                
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                setHistory([]);
                setHistoryStep(-1);
                // Save initial blank state
                const initialData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                setHistory([initialData]);
                setHistoryStep(0);
            }
        }
    }, [activeMapId]);

    // Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
                e.preventDefault();
                if (e.shiftKey) {
                    handleRedo();
                } else {
                    handleUndo();
                }
            }
            if ((e.metaKey || e.ctrlKey) && e.key === 'y') {
                e.preventDefault();
                handleRedo();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [history, historyStep]);

    const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };

        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        let clientX = 0;
        let clientY = 0;

        if ('touches' in e) {
             if (e.touches && e.touches.length > 0) {
                 clientX = e.touches[0].clientX;
                 clientY = e.touches[0].clientY;
             } else if ('changedTouches' in e) {
                 clientX = (e as React.TouchEvent).changedTouches[0].clientX;
                 clientY = (e as React.TouchEvent).changedTouches[0].clientY;
             }
        } else {
             clientX = (e as React.MouseEvent).clientX;
             clientY = (e as React.MouseEvent).clientY;
        }

        return {
            x: (clientX - rect.left) * scaleX,
            y: (clientY - rect.top) * scaleY
        };
    };

    const saveState = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const newHistory = history.slice(0, historyStep + 1);
        newHistory.push(imageData);
        
        // Max history limit
        if (newHistory.length > 20) newHistory.shift();
        
        setHistory(newHistory);
        setHistoryStep(newHistory.length - 1);
    };

    const restoreState = (imageData: ImageData) => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (ctx && imageData) {
            ctx.putImageData(imageData, 0, 0);
        }
    };

    const handleUndo = () => {
        if (historyStep > 0) {
            const newStep = historyStep - 1;
            setHistoryStep(newStep);
            restoreState(history[newStep]);
        }
    };

    const handleRedo = () => {
        if (historyStep < history.length - 1) {
            const newStep = historyStep + 1;
            setHistoryStep(newStep);
            restoreState(history[newStep]);
        }
    };

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        if (tool === 'pointer') return;
        
        const coords = getCoordinates(e);
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        setIsDrawing(true);
        setStartPos(coords);

        // Save snapshot for preview tools (arrow, shapes)
        setSnapshot(ctx.getImageData(0, 0, canvas.width, canvas.height));

        if (tool === 'stamp') {
            ctx.font = `${brushSize * 10}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = '#ffffff';
            ctx.fillText(selectedStamp, coords.x, coords.y);
            saveState();
            setIsDrawing(false);
            return;
        }

        if (tool === 'text') {
            ctx.font = `${brushSize * 6}px Arial`;
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = color;
            ctx.fillText(textInput, coords.x, coords.y);
            saveState();
            setIsDrawing(false);
            return;
        }

        if (tool === 'draw' || tool === 'erase') {
            ctx.beginPath();
            ctx.moveTo(coords.x, coords.y);
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.lineWidth = brushSize;
            ctx.strokeStyle = tool === 'erase' ? 'rgba(0,0,0,1)' : color;
            ctx.globalCompositeOperation = tool === 'erase' ? 'destination-out' : 'source-over';
            
            if (tool === 'draw' && isDashed) {
                ctx.setLineDash([brushSize * 2, brushSize * 2]);
            } else {
                ctx.setLineDash([]);
            }
        }
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        // Update cursor pos for ghost stamp
        if (tool === 'stamp' && 'clientX' in e) {
             const canvas = canvasRef.current;
             const rect = canvas?.getBoundingClientRect();
             if (rect) {
                 setCursorPos({
                     x: (e as React.MouseEvent).clientX - rect.left,
                     y: (e as React.MouseEvent).clientY - rect.top
                 });
             }
        } else {
            setCursorPos(null);
        }

        if (!isDrawing || tool === 'pointer') return;
        
        const coords = getCoordinates(e);
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        if ((tool === 'arrow' || tool === 'rect' || tool === 'circle') && startPos && snapshot) {
            ctx.putImageData(snapshot, 0, 0);
            ctx.strokeStyle = color;
            ctx.lineWidth = brushSize;
            ctx.globalCompositeOperation = 'source-over';
            
            if (isDashed) ctx.setLineDash([brushSize * 2, brushSize * 2]);
            else ctx.setLineDash([]);

            ctx.beginPath();

            if (tool === 'arrow') {
                const headLength = brushSize * 4;
                const angle = Math.atan2(coords.y - startPos.y, coords.x - startPos.x);
                ctx.moveTo(startPos.x, startPos.y);
                ctx.lineTo(coords.x, coords.y);
                ctx.stroke();
                
                ctx.setLineDash([]);
                ctx.beginPath();
                ctx.moveTo(coords.x, coords.y);
                ctx.lineTo(coords.x - headLength * Math.cos(angle - Math.PI / 6), coords.y - headLength * Math.sin(angle - Math.PI / 6));
                ctx.lineTo(coords.x - headLength * Math.cos(angle + Math.PI / 6), coords.y - headLength * Math.sin(angle + Math.PI / 6));
                ctx.fillStyle = color;
                ctx.fill();
            } else if (tool === 'rect') {
                ctx.rect(startPos.x, startPos.y, coords.x - startPos.x, coords.y - startPos.y);
                ctx.stroke();
            } else if (tool === 'circle') {
                const radius = Math.sqrt(Math.pow(coords.x - startPos.x, 2) + Math.pow(coords.y - startPos.y, 2));
                ctx.arc(startPos.x, startPos.y, radius, 0, 2 * Math.PI);
                ctx.stroke();
            }
            return;
        }

        if (tool === 'draw' || tool === 'erase') {
            ctx.lineTo(coords.x, coords.y);
            ctx.stroke();
        }
    };

    const stopDrawing = () => {
        if (isDrawing) {
            setIsDrawing(false);
            if (tool !== 'stamp' && tool !== 'text') {
                saveState();
            }
        }
    };

    const clearBoard = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (canvas && ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            saveState();
        }
    };

    const downloadBoard = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Create a temporary canvas to composite map + drawing
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const ctx = tempCanvas.getContext('2d');
        if (!ctx) return;

        // Load map image
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = activeMap.imageUrl;
        
        img.onload = () => {
            ctx.fillStyle = '#0F1724'; 
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            const hRatio = canvas.width / img.width;
            const vRatio = canvas.height / img.height;
            const ratio = Math.min(hRatio, vRatio);
            const centerShift_x = (canvas.width - img.width * ratio) / 2;
            const centerShift_y = (canvas.height - img.height * ratio) / 2;
            
            ctx.drawImage(img, 0, 0, img.width, img.height,
                centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);
                
            ctx.drawImage(canvas, 0, 0);
            
            const link = document.createElement('a');
            link.download = `strategy-${activeMapId}-${Date.now()}.png`;
            link.href = tempCanvas.toDataURL('image/png');
            link.click();
        };
        
        img.onerror = () => {
             const link = document.createElement('a');
             link.download = `strategy-drawing.png`;
             link.href = canvas.toDataURL('image/png');
             link.click();
        }
    };

    return (
        <div className="h-[calc(100vh-80px)] flex flex-col lg:flex-row gap-4 animate-fade-in">
            {/* Sidebar Controls */}
            <div className="w-full lg:w-72 bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col gap-6 overflow-y-auto shrink-0">
                <div>
                    <h1 className="text-xl font-heading font-bold text-slate-900 dark:text-white mb-4">
                        Strategy Board
                    </h1>
                    
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">Map</label>
                        <div className="grid grid-cols-2 gap-2">
                            {Object.values(MOCK_MAPS).map(map => (
                                <button
                                    key={map.id}
                                    onClick={() => setActiveMapId(map.id)}
                                    className={`px-2 py-2 rounded text-xs font-bold border ${activeMapId === map.id ? 'bg-gamepedia-blue text-white border-gamepedia-blue' : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'}`}
                                >
                                    {map.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase">Tools</label>
                    <div className="grid grid-cols-4 gap-2">
                        <button 
                            onClick={() => setTool('pointer')} 
                            className={`p-3 rounded-lg flex justify-center transition-colors ${tool === 'pointer' ? 'bg-slate-200 dark:bg-slate-700 text-gamepedia-blue ring-2 ring-gamepedia-blue/50' : 'bg-slate-50 dark:bg-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                            title="Pointer"
                        >
                            <MousePointer size={18} />
                        </button>
                        <button 
                            onClick={() => setTool('draw')} 
                            className={`p-3 rounded-lg flex justify-center transition-colors ${tool === 'draw' ? 'bg-slate-200 dark:bg-slate-700 text-gamepedia-blue ring-2 ring-gamepedia-blue/50' : 'bg-slate-50 dark:bg-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                            title="Freehand"
                        >
                            <PenTool size={18} />
                        </button>
                        <button 
                            onClick={() => setTool('arrow')} 
                            className={`p-3 rounded-lg flex justify-center transition-colors ${tool === 'arrow' ? 'bg-slate-200 dark:bg-slate-700 text-gamepedia-blue ring-2 ring-gamepedia-blue/50' : 'bg-slate-50 dark:bg-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                            title="Arrow"
                        >
                            <ArrowUpRight size={18} />
                        </button>
                        <button 
                            onClick={() => setTool('rect')} 
                            className={`p-3 rounded-lg flex justify-center transition-colors ${tool === 'rect' ? 'bg-slate-200 dark:bg-slate-700 text-gamepedia-blue ring-2 ring-gamepedia-blue/50' : 'bg-slate-50 dark:bg-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                            title="Rectangle"
                        >
                            <Square size={18} />
                        </button>
                        <button 
                            onClick={() => setTool('circle')} 
                            className={`p-3 rounded-lg flex justify-center transition-colors ${tool === 'circle' ? 'bg-slate-200 dark:bg-slate-700 text-gamepedia-blue ring-2 ring-gamepedia-blue/50' : 'bg-slate-50 dark:bg-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                            title="Circle"
                        >
                            <Circle size={18} />
                        </button>
                        <button 
                            onClick={() => setTool('text')} 
                            className={`p-3 rounded-lg flex justify-center transition-colors ${tool === 'text' ? 'bg-slate-200 dark:bg-slate-700 text-gamepedia-blue ring-2 ring-gamepedia-blue/50' : 'bg-slate-50 dark:bg-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                            title="Text Label"
                        >
                            <Type size={18} />
                        </button>
                        <button 
                            onClick={() => setTool('stamp')} 
                            className={`p-3 rounded-lg flex justify-center transition-colors ${tool === 'stamp' ? 'bg-slate-200 dark:bg-slate-700 text-gamepedia-blue ring-2 ring-gamepedia-blue/50' : 'bg-slate-50 dark:bg-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                            title="Stamp"
                        >
                            <Stamp size={18} />
                        </button>
                        <button 
                            onClick={() => setTool('erase')} 
                            className={`p-3 rounded-lg flex justify-center transition-colors ${tool === 'erase' ? 'bg-slate-200 dark:bg-slate-700 text-gamepedia-blue ring-2 ring-gamepedia-blue/50' : 'bg-slate-50 dark:bg-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                            title="Eraser"
                        >
                            <Eraser size={18} />
                        </button>
                    </div>
                </div>

                {/* Contextual Tools */}
                {(tool === 'draw' || tool === 'arrow' || tool === 'rect' || tool === 'circle' || tool === 'text') && (
                    <div className="space-y-4 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700 animate-fade-in">
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Color</label>
                            <div className="flex flex-wrap gap-2">
                                {['#ef4444', '#22c55e', '#3b82f6', '#eab308', '#ffffff', '#000000'].map(c => (
                                    <button
                                        key={c}
                                        onClick={() => setColor(c)}
                                        className={`w-6 h-6 rounded-full border-2 transition-transform ${color === c ? 'border-slate-400 dark:border-white scale-110 shadow-sm' : 'border-transparent'}`}
                                        style={{ backgroundColor: c }}
                                    />
                                ))}
                            </div>
                        </div>
                        
                        {tool !== 'text' && (
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Style</label>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => setIsDashed(false)} 
                                        className={`flex-1 py-1 text-xs border rounded ${!isDashed ? 'bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-500 font-bold' : 'border-transparent text-slate-500'}`}
                                    >
                                        Solid
                                    </button>
                                    <button 
                                        onClick={() => setIsDashed(true)} 
                                        className={`flex-1 py-1 text-xs border rounded ${isDashed ? 'bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-500 font-bold' : 'border-transparent text-slate-500'}`}
                                    >
                                        Dashed
                                    </button>
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Size</label>
                            <input 
                                type="range" min="2" max="20" 
                                value={brushSize} 
                                onChange={(e) => setBrushSize(parseInt(e.target.value))}
                                className="w-full accent-gamepedia-blue cursor-pointer"
                            />
                        </div>

                        {tool === 'text' && (
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Label Text</label>
                                <input 
                                    type="text" 
                                    value={textInput}
                                    onChange={(e) => setTextInput(e.target.value)}
                                    className="w-full px-2 py-1 text-sm border rounded bg-white dark:bg-slate-900 dark:border-slate-600 dark:text-white"
                                />
                            </div>
                        )}
                    </div>
                )}

                {tool === 'stamp' && (
                    <div className="space-y-4 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700 animate-fade-in">
                        <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Tactical Icons</label>
                        <div className="grid grid-cols-4 gap-2">
                            {['📍', '💀', '🚗', '🛡️', '⚠️', '👑', '🏁', '🎯', '☁️', '🔥', '💣', '💉'].map(s => (
                                <button 
                                    key={s}
                                    onClick={() => setSelectedStamp(s)}
                                    className={`text-xl p-2 rounded hover:bg-white dark:hover:bg-slate-700 transition-colors ${selectedStamp === s ? 'bg-white dark:bg-slate-700 shadow-sm ring-1 ring-gamepedia-blue' : ''}`}
                                    title={s === '☁️' ? 'Smoke' : s === '🔥' ? 'Molotov' : s === '💣' ? 'Grenade' : ''}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Icon Size</label>
                            <input 
                                type="range" min="2" max="8" 
                                value={brushSize} 
                                onChange={(e) => setBrushSize(parseInt(e.target.value))}
                                className="w-full accent-gamepedia-blue cursor-pointer"
                            />
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="mt-auto space-y-2">
                    <div className="flex items-center justify-between px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                        <span className="text-xs font-bold text-slate-500">Show Grid</span>
                        <button 
                            onClick={() => setShowGrid(!showGrid)}
                            className={`w-8 h-4 rounded-full transition-colors relative ${showGrid ? 'bg-gamepedia-blue' : 'bg-slate-300'}`}
                        >
                            <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform ${showGrid ? 'translate-x-4' : ''}`}></div>
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <button 
                            onClick={handleUndo}
                            disabled={historyStep <= 0}
                            className="py-2 flex items-center justify-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-400 disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                            title="Undo (Ctrl+Z)"
                        >
                            <Undo size={16} className="mr-2" /> Undo
                        </button>
                        <button 
                            onClick={handleRedo}
                            disabled={historyStep >= history.length - 1}
                            className="py-2 flex items-center justify-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-400 disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                            title="Redo (Ctrl+Y)"
                        >
                            <Redo size={16} className="mr-2" /> Redo
                        </button>
                    </div>
                    <button 
                        onClick={clearBoard}
                        className="w-full py-2 flex items-center justify-center text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg font-bold hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors border border-transparent"
                    >
                        <Trash2 size={16} className="mr-2" /> Clear All
                    </button>
                    <button 
                        onClick={downloadBoard}
                        className="w-full py-2 flex items-center justify-center text-gamepedia-blue bg-blue-50 dark:bg-blue-900/20 rounded-lg font-bold hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors border border-transparent"
                    >
                        <Download size={16} className="mr-2" /> Save Plan
                    </button>
                </div>
            </div>

            {/* Canvas Area */}
            <div 
                ref={containerRef}
                className="flex-1 bg-slate-900 rounded-xl border border-slate-800 relative overflow-hidden shadow-inner flex items-center justify-center cursor-crosshair touch-none"
                onMouseLeave={() => setCursorPos(null)}
            >
                {/* Background Map */}
                <img 
                    src={activeMap.imageUrl} 
                    className="absolute w-full h-full object-contain opacity-80 pointer-events-none select-none"
                    alt="Map Background"
                    onError={(e) => {
                        e.currentTarget.src = 'https://placehold.co/1024x1024/1a202c/4a5568?text=Tactical+Grid+Data&font=roboto';
                        e.currentTarget.onerror = null;
                    }}
                />
                
                {/* Grid Overlay */}
                {showGrid && (
                    <div className="absolute inset-0 grid grid-cols-12 grid-rows-8 pointer-events-none opacity-20 w-full h-full max-w-aspect max-h-aspect">
                         {Array.from({ length: 96 }).map((_, i) => (
                             <div key={i} className="border border-white"></div>
                         ))}
                    </div>
                )}

                {/* Drawing Layer */}
                <canvas
                    ref={canvasRef}
                    width={1200}
                    height={800}
                    className="absolute inset-0 w-full h-full z-10"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                />

                {/* Ghost Stamp Cursor */}
                {tool === 'stamp' && cursorPos && (
                    <div 
                        className="absolute pointer-events-none opacity-50 text-white"
                        style={{ 
                            left: cursorPos.x, 
                            top: cursorPos.y, 
                            transform: 'translate(-50%, -50%)',
                            fontSize: `${brushSize * 10}px`
                        }}
                    >
                        {selectedStamp}
                    </div>
                )}
            </div>
        </div>
    );
};
