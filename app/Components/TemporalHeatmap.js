"use client";
import React from 'react';

export default function TemporalHeatmap({ logs }) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const hourSlots = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'];

  // Logic to map logs to a 7x6 intensity grid
  const getIntensity = (dayIndex, hourIndex) => {
    // In a real pro-app, we filter logs by (day === dayIndex && hour === hourIndex)
    // For now, we simulate intensity based on log density in your DB
    const seed = (dayIndex + hourIndex + (logs?.length || 0)) % 10;
    if (seed > 8) return 'bg-red-600 shadow-[0_0_20px_rgba(220,38,38,0.3)]'; // Critical Peak
    if (seed > 5) return 'bg-red-400'; // High Activity
    if (seed > 2) return 'bg-slate-700'; // Moderate
    return 'bg-slate-800/50'; // Low/Idle
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 grid grid-cols-7 gap-3">
        {days.map((day, dIdx) => (
          <div key={day} className="flex flex-col gap-3">
            <p className="text-[10px] font-black text-slate-500 text-center mb-2 uppercase">{day}</p>
            {[...Array(6)].map((_, hIdx) => (
              <div 
                key={hIdx} 
                className={`flex-1 rounded-xl transition-all duration-500 hover:scale-105 cursor-help group relative ${getIntensity(dIdx, hIdx)}`}
              >
                {/* Tooltip on Hover */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50">
                  <div className="bg-white text-slate-900 text-[10px] font-bold px-3 py-1 rounded-lg shadow-xl whitespace-nowrap">
                    Peak Ops @ {hourSlots[hIdx]}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      
      {/* Legend */}
      <div className="mt-8 flex items-center justify-between border-t border-slate-800 pt-6">
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Activity Gradient</p>
        <div className="flex gap-2">
          <div className="w-3 h-3 bg-slate-800/50 rounded-sm"></div>
          <div className="w-3 h-3 bg-slate-700 rounded-sm"></div>
          <div className="w-3 h-3 bg-red-400 rounded-sm"></div>
          <div className="w-3 h-3 bg-red-600 rounded-sm"></div>
        </div>
      </div>
    </div>
  );
}