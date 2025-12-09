import React from 'react';

interface InfoboxRowProps {
  label: string;
  value: string | React.ReactNode;
  isLink?: boolean;
}

const InfoboxRow: React.FC<InfoboxRowProps> = ({ label, value }) => (
  <div className="flex border-b border-slate-200/50 dark:border-slate-700/50 py-2 last:border-0 text-sm">
    <div className="w-1/3 font-semibold text-gamepedia-dark dark:text-slate-200">{label}</div>
    <div className="w-2/3 text-slate-600 dark:text-slate-400">{value}</div>
  </div>
);

interface InfoboxProps {
  title: string;
  image?: string;
  subtitle?: string;
  data: { label: string; value: string | React.ReactNode }[];
  actionButton?: { label: string; onClick: () => void };
}

export const Infobox: React.FC<InfoboxProps> = ({ title, image, subtitle, data, actionButton }) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden w-full lg:w-[320px] shrink-0 h-fit mb-6 lg:mb-0 lg:ml-6 transition-colors duration-200">
      <div className="bg-gamepedia-blue text-white p-4 text-center">
        <h2 className="font-heading font-bold text-lg">{title}</h2>
        {subtitle && <p className="text-xs opacity-90 uppercase tracking-wider mt-1">{subtitle}</p>}
      </div>
      
      {image && (
        <div className="p-6 flex justify-center bg-slate-50 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700">
          <img src={image} alt={title} className="rounded-lg shadow-sm max-h-32 object-contain" />
        </div>
      )}

      <div className="p-4">
        {data.map((item, idx) => (
          <InfoboxRow key={idx} label={item.label} value={item.value} />
        ))}
      </div>

      {actionButton && (
        <div className="p-4 bg-slate-50 dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700">
          <button 
            onClick={actionButton.onClick}
            className="w-full py-2 bg-gamepedia-orange hover:bg-orange-600 text-white rounded-lg font-medium transition-colors text-sm"
          >
            {actionButton.label}
          </button>
        </div>
      )}
    </div>
  );
};