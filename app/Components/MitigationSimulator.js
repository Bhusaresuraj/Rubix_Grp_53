"use client";
import React, { useState } from 'react';
import { Zap, Truck, ArrowRight } from 'lucide-react';

export default function MitigationSimulator({ currentEmissions }) {
  const [solarPercent, setSolarPercent] = useState(0);
  const [evPercent, setEvPercent] = useState(0);

  // Math: 
  // Solar reduces Scope 2 (Grid) emissions. 
  // EV reduces Scope 1 (Diesel) emissions.
  const potentialSavings = (currentEmissions * (solarPercent / 100) * 0.4) + (currentEmissions * (evPercent / 100) * 0.5);
  const newEmissions = Math.max(0, currentEmissions - potentialSavings);

  return (
    <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 shadow-xl">
      <h3 className="text-blue-400 font-bold uppercase text-xs tracking-widest mb-6">Mitigation Simulator</h3>
      
      <div className="space-y-8">
        {/* Solar Slider */}
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm flex items-center gap-2"><Zap size={14} className="text-yellow-500" /> Renewable Energy Swap</span>
            <span className="text-yellow-500 font-bold">{solarPercent}%</span>
          </div>
          <input 
            type="range" min="0" max="100" value={solarPercent} 
            onChange={(e) => setSolarPercent(e.target.value)}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-yellow-500"
          />
        </div>

        {/* EV Slider */}
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm flex items-center gap-2"><Truck size={14} className="text-blue-500" /> EV Fleet Transition</span>
            <span className="text-blue-500 font-bold">{evPercent}%</span>
          </div>
          <input 
            type="range" min="0" max="100" value={evPercent} 
            onChange={(e) => setEvPercent(e.target.value)}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>

        {/* Resulting Impact */}
        <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700 flex items-center justify-between">
          <div>
            <p className="text-slate-500 text-[10px] font-bold uppercase">Projected Footprint</p>
            <p className="text-2xl font-black text-white">{newEmissions.toFixed(2)} <span className="text-xs font-normal">Tons</span></p>
          </div>
          <ArrowRight className="text-slate-700" />
          <div className="text-right">
            <p className="text-green-500 text-[10px] font-bold uppercase">Reduction</p>
            <p className="text-2xl font-black text-green-500">-{((potentialSavings/currentEmissions)*100 || 0).toFixed(1)}%</p>
          </div>
        </div>
      </div>
    </div>
  );
}