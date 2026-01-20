"use client";
import React, { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useCoal } from '../context/CoalContext';

export default function SinkForm({ mineId }) {
  const [trees, setTrees] = useState({ neem: 0, bamboo: 0, teak: 0 });
  const { fetchData } = useCoal();
  const supabase = createClient();

  // Calculate annual absorption in Tons
  const annualAbsorption = ((trees.neem * 25.0) + (trees.bamboo * 18.2) + (trees.teak * 20.5)) / 1000;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('sinks').insert([{
      mine_id: mineId,
      neem_count: trees.neem,
      bamboo_count: trees.bamboo,
      teak_count: trees.teak,
      recorded_at: new Date().toISOString().split('T')[0]
    }]);

    if (!error) {
      alert("Sink Data Updated!");
      fetchData();
    }
  };

  return (
    <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl mt-6">
      <h2 className="text-xl font-bold text-emerald-400 mb-6">Afforestation Registry</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-slate-400 text-xs uppercase">Neem</label>
            <input type="number" className="w-full bg-slate-900 border border-slate-700 p-2 rounded-lg mt-1" 
              onChange={(e) => setTrees({...trees, neem: Number(e.target.value)})} />
          </div>
          <div>
            <label className="text-slate-400 text-xs uppercase">Bamboo</label>
            <input type="number" className="w-full bg-slate-900 border border-slate-700 p-2 rounded-lg mt-1" 
              onChange={(e) => setTrees({...trees, bamboo: Number(e.target.value)})} />
          </div>
          <div>
            <label className="text-slate-400 text-xs uppercase">Teak</label>
            <input type="number" className="w-full bg-slate-900 border border-slate-700 p-2 rounded-lg mt-1" 
              onChange={(e) => setTrees({...trees, teak: Number(e.target.value)})} />
          </div>
        </div>

        <div className="bg-emerald-900/20 p-4 rounded-xl border border-dashed border-emerald-600/50 mt-4">
          <p className="text-xs text-emerald-500 uppercase font-bold">Annual Sequestration Potential</p>
          <p className="text-2xl font-black text-white">{annualAbsorption.toFixed(2)} <span className="text-sm font-normal">tons/year</span></p>
        </div>

        <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold py-3 rounded-xl transition-all">
          Update Green Assets
        </button>
      </form>
    </div>
  );
}