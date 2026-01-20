"use client";
import { Info, Sparkles, ArrowRight } from 'lucide-react';

export default function SpeciesInsights() {
  const species = [
    { name: "Bamboo", rate: "35% higher CO2 absorption", trait: "Restoration", color: "emerald" },
    { name: "Indian Teak", rate: "1.5 - 2.5 Tons lifetime", trait: "Storage", color: "amber" },
    { name: "Sal Tree", rate: "40 - 80 kg CO2 per year", trait: "Biomass", color: "blue" },
  ];

  return (
    <div className="mt-4 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
      <div className="flex justify-between items-center mb-6">
        <h4 className="font-black text-slate-800 flex items-center gap-2">
          <Sparkles className="text-emerald-500" size={18} /> Ecological IQ
        </h4>
        <Info size={16} className="text-slate-300 animate-pulse" />
      </div>

      <div className="space-y-4">
        {species.map((s, i) => (
          <div 
            key={i} 
            className={`p-4 rounded-2xl transition-all duration-500 hover:translate-x-2 cursor-default border-l-4 border-transparent hover:border-${s.color}-500 bg-slate-50/50 hover:bg-white hover:shadow-md`}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-s font-black text-slate-800">{s.name}</p>
                <p className="text-[14px] text-slate-500 font-bold uppercase mt-1">{s.rate}</p>
              </div>
              <div className={`px-2 py-1 rounded-md text-[15px] font-black bg-${s.color}-100 text-${s.color}-700`}>
                {s.trait}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between group-hover:text-emerald-600 transition-colors">
        <p className="text-[15px] font-bold text-slate-400">View detailed species report</p>
        <ArrowRight size={14} />
      </div>
    </div>
  );
}