import React from 'react';

interface RadarChartProps {
  data: { label: string; value: number; fullMark: number }[];
  color?: string;
  size?: number;
}

export const RadarChart: React.FC<RadarChartProps> = ({ data, color = '#2B5DF5', size = 300 }) => {
  const numPoints = data.length;
  const radius = size / 2 - 40; // Padding
  const center = size / 2;
  const angleStep = (Math.PI * 2) / numPoints;

  const getCoordinates = (value: number, index: number, max: number) => {
    const ratio = value / max;
    const angle = index * angleStep - Math.PI / 2; // Start from top
    const x = center + Math.cos(angle) * radius * ratio;
    const y = center + Math.sin(angle) * radius * ratio;
    return { x, y };
  };

  const points = data.map((d, i) => {
    const { x, y } = getCoordinates(d.value, i, d.fullMark);
    return `${x},${y}`;
  }).join(' ');

  // Grid levels
  const levels = [0.25, 0.5, 0.75, 1];

  return (
    <div className="relative flex justify-center items-center">
      <svg width={size} height={size} className="overflow-visible">
        {/* Grid Lines */}
        {levels.map((level, idx) => {
           const levelPoints = data.map((d, i) => {
             const { x, y } = getCoordinates(d.fullMark * level, i, d.fullMark);
             return `${x},${y}`;
           }).join(' ');
           return (
             <polygon 
                key={idx} 
                points={levelPoints} 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1" 
                className="text-slate-200 dark:text-slate-700" 
             />
           );
        })}

        {/* Axes */}
        {data.map((d, i) => {
           const { x, y } = getCoordinates(d.fullMark, i, d.fullMark);
           return (
             <line 
                key={i} 
                x1={center} 
                y1={center} 
                x2={x} 
                y2={y} 
                stroke="currentColor" 
                strokeWidth="1" 
                className="text-slate-200 dark:text-slate-700" 
             />
           );
        })}

        {/* Data Area */}
        <polygon points={points} fill={color} fillOpacity="0.2" stroke={color} strokeWidth="2" />
        
        {/* Data Points */}
        {data.map((d, i) => {
           const { x, y } = getCoordinates(d.value, i, d.fullMark);
           return <circle key={i} cx={x} cy={y} r="4" fill={color} />;
        })}

        {/* Labels */}
        {data.map((d, i) => {
           const { x, y } = getCoordinates(d.fullMark * 1.15, i, d.fullMark);
           return (
             <text 
               key={i} 
               x={x} 
               y={y} 
               textAnchor="middle" 
               dominantBaseline="middle" 
               className="text-[10px] font-bold uppercase fill-slate-500 dark:fill-slate-400"
             >
               {d.label}
             </text>
           );
        })}
      </svg>
    </div>
  );
};