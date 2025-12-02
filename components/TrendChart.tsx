import React from 'react';

interface TrendChartProps {
  data: number[];
  labels?: string[];
  color?: string;
  height?: number;
  title?: string;
}

export const TrendChart: React.FC<TrendChartProps> = ({ 
  data, 
  labels, 
  color = '#2B5DF5', 
  height = 200,
  title
}) => {
  if (!data || data.length < 2) return null;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const padding = 20;
  
  // Calculate layout
  // We assume width is 100% (viewBox 0 0 100 100 preserved aspect ratio none)
  // But for SVG points calculation we need a coordinate system
  const viewWidth = 500; 
  const viewHeight = height;
  
  const points = data.map((val, index) => {
    const x = padding + (index / (data.length - 1)) * (viewWidth - 2 * padding);
    const y = viewHeight - padding - ((val - min) / range) * (viewHeight - 2 * padding);
    return `${x},${y}`;
  }).join(' ');

  // Create area fill path
  const areaPath = `${points} ${viewWidth - padding},${viewHeight} ${padding},${viewHeight}`;

  return (
    <div className="w-full bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 transition-colors duration-200">
      {title && <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">{title}</h4>}
      
      <div className="relative w-full" style={{ height: `${height}px` }}>
        <svg 
          width="100%" 
          height="100%" 
          viewBox={`0 0 ${viewWidth} ${viewHeight}`} 
          preserveAspectRatio="none"
          className="overflow-visible"
        >
          {/* Grid Lines */}
          <line x1={padding} y1={padding} x2={viewWidth - padding} y2={padding} stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeDasharray="4" />
          <line x1={padding} y1={viewHeight - padding} x2={viewWidth - padding} y2={viewHeight - padding} stroke="currentColor" className="text-slate-100 dark:text-slate-800" />
          <line x1={padding} y1={viewHeight / 2} x2={viewWidth - padding} y2={viewHeight / 2} stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeDasharray="4" />

          {/* Gradient Defs */}
          <defs>
            <linearGradient id={`gradient-${color}`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.2" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Area Fill */}
          <polygon points={areaPath} fill={`url(#gradient-${color})`} />

          {/* Line */}
          <polyline 
            points={points} 
            fill="none" 
            stroke={color} 
            strokeWidth="3" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />

          {/* Data Points */}
          {data.map((val, index) => {
            const x = padding + (index / (data.length - 1)) * (viewWidth - 2 * padding);
            const y = viewHeight - padding - ((val - min) / range) * (viewHeight - 2 * padding);
            return (
              <g key={index} className="group">
                <circle cx={x} cy={y} r="4" fill="white" stroke={color} strokeWidth="2" className="dark:fill-slate-900 transition-all duration-300 group-hover:r-6" />
                {/* Tooltip (Simple SVG text) */}
                <rect x={x - 15} y={y - 25} width="30" height="18" rx="4" fill={color} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                <text x={x} y={y - 13} textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" className="opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    {val}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      
      {/* X-Axis Labels */}
      {labels && (
        <div className="flex justify-between mt-2 px-2">
          {labels.map((label, i) => (
            <span key={i} className="text-[10px] text-slate-400 font-mono">{label}</span>
          ))}
        </div>
      )}
    </div>
  );
};