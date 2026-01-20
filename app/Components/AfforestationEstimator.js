"use client";
import React from 'react';
import { TreePine, Landmark } from 'lucide-react';

export default function AfforestationEstimator({ gap }) {
  // If gap is negative, they are already carbon neutral
  if (gap <= 0) return (
    <div className="bg-green-500/10 border border-green-500/50 p-6 rounded-3xl text-center">
      <p className="text-green-400 font-bold">MINE STATUS: CARBON NEUTRAL ✅</p>
    </div>
  );

  // Math: 1 Neem tree offsets ~0.025 tons/year
  // Land requirement: ~400 trees per hectare
  const treesRequired = Math.ceil(gap / 0.025);
  const landRequired = (treesRequired / 400).toFixed(2);

  return (
    <div className="bg-slate-100 p-6 rounded-3xl border border-slate-700">
      <h3 className="text-emerald-400 font-bold uppercase text-xs tracking-widest mb-4">Neutrality Requirement</h3>
      <div className="space-y-4">
        <div className="flex items-center gap-4 bg-slate-200 p-4 rounded-2xl">
          <TreePine className="text-emerald-500" />
          <div>
            <p className="text-2xl font-black">{treesRequired.toLocaleString()}</p>
            <p className="text-slate-500 text-xs">Neem Trees Required</p>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-slate-200 p-4 rounded-2xl">
          <Landmark className="text-blue-500" />
          <div>
            <p className="text-2xl font-black">{landRequired}</p>
            <p className="text-slate-500 text-xs">Hectares of Land Needed</p>
          </div>
        </div>
      </div>
    </div>
  );
}