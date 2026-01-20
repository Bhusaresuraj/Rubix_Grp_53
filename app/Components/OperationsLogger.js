"use client";
import React, { useState } from 'react';
import { useCoal } from "../context/CoalContext";
import { Factory, Zap, Fuel, Activity, Send } from 'lucide-react';

export default function OperationsLogger({ mineId }) {
  const { addLog } = useCoal();
  const [entry, setEntry] = useState({ diesel: 0, electricity: 0 });

  // 2026 Emission Factors for India (kg CO2 per unit)
  const dieselImpact = (entry.diesel * 2.68).toFixed(2);
  const elecImpact = (entry.electricity * 0.71).toFixed(2);
  const totalImpact = (parseFloat(dieselImpact) + parseFloat(elecImpact)).toFixed(2);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (entry.diesel === 0 && entry.electricity === 0) return alert("Please enter operational data.");

    const newLog = {
      mine_id: mineId,
      diesel_liters: entry.diesel,
      electricity_kwh: entry.electricity,
      recorded_at: new Date().toISOString()
    };
    
    const result = await addLog(newLog);
    if (!result.error) {
      setEntry({ diesel: 0, electricity: 0 });
      // The context will automatically refresh the charts!
    }
  };

  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/20">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <Activity className="text-red-500" size={22} /> Operations Logger
          </h3>
          <p className="text-slate-400 text-[10px] mt-1 font-bold tracking-widest uppercase">Protocol: CCTS-v2.6</p>
        </div>
        <div className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-[10px] font-black tracking-tighter">
          REAL-TIME AUDIT
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Diesel Input Card */}
          <div className="bg-slate-50 p-6 rounded-3xl border border-transparent focus-within:border-red-100 transition-all">
            <label className="text-[10px] font-black text-slate-400 uppercase mb-3 flex items-center gap-2">
              <Fuel size={14} className="text-amber-500" /> Diesel Fuel (Ltrs)
            </label>
            <input 
              type="number" value={entry.diesel || ''}
              placeholder="0.00"
              className="w-full bg-transparent font-black text-2xl outline-none text-slate-800"
              onChange={(e) => setEntry({...entry, diesel: Number(e.target.value)})}
            />
            <p className="text-[10px] text-slate-400 mt-2 font-medium">Impact: {dieselImpact} kg CO2</p>
          </div>

          {/* Electricity Input Card */}
          <div className="bg-slate-50 p-6 rounded-3xl border border-transparent focus-within:border-blue-100 transition-all">
            <label className="text-[10px] font-black text-slate-400 uppercase mb-3 flex items-center gap-2">
              <Zap size={14} className="text-blue-500" /> Grid Power (kWh)
            </label>
            <input 
              type="number" value={entry.electricity || ''}
              placeholder="0.00"
              className="w-full bg-transparent font-black text-2xl outline-none text-slate-800"
              onChange={(e) => setEntry({...entry, electricity: Number(e.target.value)})}
            />
            <p className="text-[10px] text-slate-400 mt-2 font-medium">Impact: {elecImpact} kg CO2</p>
          </div>
        </div>

        {/* Dynamic Calculation Footer */}
        <div className="bg-slate-900 rounded-[2rem] p-6 text-white flex items-center justify-between shadow-2xl shadow-slate-900/40">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500 border border-red-500/20">
              <Factory size={28} />
            </div>
            <div>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Total Carbon Weight</p>
              <h4 className="text-3xl font-black text-white">{totalImpact} <span className="text-xs font-medium text-slate-400">kg CO2-e</span></h4>
            </div>
          </div>
          
          <button 
            type="submit"
            className="bg-red-600 hover:bg-red-700 text-white font-black px-10 py-5 rounded-2xl transition-all active:scale-95 flex items-center gap-3 shadow-lg shadow-red-600/30 group"
          >
            Log Session <Send size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </form>
    </div>
  );
}