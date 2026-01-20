"use client";
import React, { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useCoal } from '../context/CoalContext';
export default function EmissionForm({ mineId }) {
  const [data, setData] = useState({ diesel: 0, electricity: 0, explosives: 0 });
  const { fetchData } = useCoal();
  const supabase = createClient();

  // Real-time calculation for the "Live Preview"
  const livePreview = ((data.diesel * 2.68) + (data.electricity * 0.82) + (data.explosives * 0.18)) / 1000;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('emission_logs').insert([{
      mine_id: mineId,
      diesel_liters: data.diesel,
      electricity_kwh: data.electricity,
      explosives_kg: data.explosives,
      recorded_at: new Date().toISOString().split('T')[0]
    }]);

    if (!error) {
      alert("Data Logged Successfully!");
      fetchData(); // Refresh global context
    } else {
      console.error(error);
    }
  };

  return (
    <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl">
      <h2 className="text-xl font-bold text-green-400 mb-6">Log Operational Data</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-slate-400 text-sm">Diesel Consumption (Liters)</label>
          <input type="number" step="any" className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg mt-1" 
            onChange={(e) => setData({...data, diesel: Number(e.target.value)})} />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-slate-400 text-sm">Electricity (kWh)</label>
            <input type="number" step="any" className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg mt-1" 
              onChange={(e) => setData({...data, electricity: Number(e.target.value)})} />
          </div>
          <div>
            <label className="text-slate-400 text-sm">Explosives (kg)</label>
            <input type="number" step="any" className="w-full bg-slate-900 border border-slate-700 p-3 rounded-lg mt-1" 
              onChange={(e) => setData({...data, explosives: Number(e.target.value)})} />
          </div>
        </div>

        <div className="bg-slate-900/50 p-4 rounded-xl border border-dashed border-slate-600 mt-6">
          <p className="text-xs text-slate-500 uppercase font-bold">Live Footprint Preview</p>
          <p className="text-3xl font-black text-white">{livePreview.toFixed(3)} <span className="text-sm font-normal">tons CO2-e</span></p>
        </div>

        <button type="submit" className="w-full bg-green-500 hover:bg-green-400 text-slate-900 font-bold py-3 rounded-xl transition-all mt-4">
          Finalize & Save Log
        </button>
      </form>
    </div>
  );
}