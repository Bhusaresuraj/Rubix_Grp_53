// "use client";
// import React from 'react';
// import { TreePine, Landmark } from 'lucide-react';

// export default function AfforestationEstimator({ gap }) {
//   // If gap is negative, they are already carbon neutral
//   if (gap <= 0) return (
//     <div className="bg-green-500/10 border border-green-500/50 p-6 rounded-3xl text-center">
//       <p className="text-green-400 font-bold">MINE STATUS: CARBON NEUTRAL ✅</p>
//     </div>
//   );

//   // Math: 1 Neem tree offsets ~0.025 tons/year
//   // Land requirement: ~400 trees per hectare
//   const treesRequired = Math.ceil(gap / 0.025);
//   const landRequired = (treesRequired / 400).toFixed(2);

//   return (
//     <div className="bg-slate-100 p-6 rounded-3xl border border-slate-700">
//       <h3 className="text-emerald-400 font-bold uppercase text-xs tracking-widest mb-4">Neutrality Requirement</h3>
//       <div className="space-y-4">
//         <div className="flex items-center gap-4 bg-slate-200 p-4 rounded-2xl">
//           <TreePine className="text-emerald-500" />
//           <div>
//             <p className="text-2xl font-black">{treesRequired.toLocaleString()}</p>
//             <p className="text-slate-500 text-xs">Neem Trees Required</p>
//           </div>
//         </div>
//         <div className="flex items-center gap-4 bg-slate-200 p-4 rounded-2xl">
//           <Landmark className="text-blue-500" />
//           <div>
//             <p className="text-2xl font-black">{landRequired}</p>
//             <p className="text-slate-500 text-xs">Hectares of Land Needed</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";
import React, { useState, useEffect } from "react";
import { useCoal } from "../context/CoalContext";
import { Calculator, Shovel, Map, TreeDeciduous } from "lucide-react";

export default function AfforestationEstimator({ gap }) {
  // Constants for Indian Mining Species (Sequestration in kg/year/tree)
  const SPECIES_DATA = {
    Neem: { rate: 25, density: 2500 }, // 2500 saplings per hectare
    Bamboo: { rate: 18.2, density: 3000 },
    Teak: { rate: 20.5, density: 2000 }
  };

  const [selectedSpecies, setSelectedSpecies] = useState("Neem");
  const [results, setResults] = useState({ trees: 0, land: 0 });

  useEffect(() => {
    if (gap > 0) {
      const species = SPECIES_DATA[selectedSpecies];
      const treesNeeded = Math.ceil((gap * 1000) / species.rate); // gap in Tons to kg
      const landNeeded = (treesNeeded / species.density).toFixed(2);
      setResults({ trees: treesNeeded, land: landNeeded });
    }
  }, [gap, selectedSpecies]);

  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl">
      <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
        <Calculator className="text-emerald-500" size={24} /> Neutrality Estimator
      </h3>

      <div className="space-y-6">
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 block mb-2">Primary Species</label>
          <select 
            className="w-full bg-slate-50 p-4 rounded-2xl border-none font-bold text-sm outline-none focus:ring-2 focus:ring-emerald-500"
            onChange={(e) => setSelectedSpecies(e.target.value)}
          >
            {Object.keys(SPECIES_DATA).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-6 bg-emerald-50 rounded-[2rem] border border-emerald-100">
            <div className="flex items-center gap-2 text-emerald-700 mb-2">
              <TreeDeciduous size={18} />
              <span className="text-[10px] font-black uppercase">Tree Count</span>
            </div>
            <p className="text-2xl font-black text-emerald-900">{results.trees.toLocaleString()}</p>
          </div>

          <div className="p-6 bg-blue-50 rounded-[2rem] border border-blue-100">
            <div className="flex items-center gap-2 text-blue-700 mb-2">
              <Map size={18} />
              <span className="text-[10px] font-black uppercase">Land Required</span>
            </div>
            <p className="text-2xl font-black text-blue-900">{results.land} <span className="text-xs">Ha</span></p>
          </div>
        </div>

        <p className="text-[10px] text-slate-400 italic font-medium leading-relaxed">
          * Estimates based on Ministry of Coal greening initiatives and standard Indian density of 2,500 saplings/Ha.
        </p>
      </div>
    </div>
  );
}