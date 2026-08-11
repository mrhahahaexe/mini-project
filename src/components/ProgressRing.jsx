import React from 'react';

export default function ProgressRing({ radius, stroke, progress, color, title, subtitle }) {
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, progress)) / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-slate-200/30 dark:border-slate-800/30 shadow-sm backdrop-blur-md">
      <div className="relative flex items-center justify-center">
        <svg
          height={radius * 2}
          width={radius * 2}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            className="text-slate-100 dark:text-slate-800"
            stroke="currentColor"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          {/* Progress circle */}
          <circle
            className="transition-all duration-500 ease-out"
            stroke={color}
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={circumference + ' ' + circumference}
            style={{ strokeDashoffset }}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
        </svg>
        
        {/* Center label */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-bold font-display text-slate-800 dark:text-slate-100">
            {Math.round(progress)}%
          </span>
          {subtitle && (
            <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
              {subtitle}
            </span>
          )}
        </div>
      </div>
      
      {title && (
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-3 font-display">
          {title}
        </span>
      )}
    </div>
  );
}
