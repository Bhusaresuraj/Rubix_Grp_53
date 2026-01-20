"use client";
import React, { useState, useEffect } from "react";
import { useCoal } from "../context/CoalContext";
import EmissionForm from "../Components/EmissionForm";
import SinkForm from "../Components/SinkForm";
import GapChart from "../Components/GapChart";
import TrendChart from "../Components/TrendChart";
import { createClient } from "@/utils/supabase/client";
import { Factory, Leaf, LayoutDashboard, AlertCircle, Zap, ShieldCheck } from 'lucide-react';
import MitigationSimulator from "../Components/MitigationSimulator";
import AfforestationEstimator from "../Components/AfforestationEstimator";
const page = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mines, setMines] = useState([]);
  const [selectedMineId, setSelectedMineId] = useState(null);
  const supabase = createClient();

  // 1. Get data from Context
  const { logs, sinks, loading } = useCoal();

  
  // 2. Calculations
  const totalDiesel = (logs || []).reduce((acc, curr) => acc + (curr.diesel_liters || 0), 0);
  const totalElec = (logs || []).reduce((acc, curr) => acc + (curr.electricity_kwh || 0), 0);
  
  // Total Emissions in Tons
  const totalE = (logs || []).reduce((acc, curr) => acc + ((curr.diesel_liters * 2.68 + curr.electricity_kwh * 0.82 + (curr.explosives_kg || 0) * 0.18) / 1000), 0);
  // Total Sinks in Tons
  const totalS = (sinks || []).reduce((acc, curr) => acc + ((curr.neem_count * 25 + curr.bamboo_count * 18.2 + (curr.teak_count || 0) * 20.5) / 1000), 0);
  
  const gap = (totalE - totalS).toFixed(2);
  const totalCO2Display = totalE.toFixed(2);

  // Fetch Mines for Selection
  useEffect(() => {
    async function getMines() {
      const { data } = await supabase.from('mines').select('id, name');
      if (data) {
        setMines(data);
        if (data.length > 0) setSelectedMineId(data[0].id);
      }
    }
    getMines();
  }, [supabase]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-green-400 animate-pulse font-mono flex items-center gap-3">
          <Zap className="animate-bounce" /> INITIALIZING COAL-CHAIN PROTOCOL...
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-900 text-white overflow-hidden">
      {/* SIDEBAR */}
      <nav className="w-72 bg-slate-800 border-r border-slate-700 p-6 flex flex-col gap-2">
        <div className="flex items-center gap-2 mb-10 px-2">
          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
            <ShieldCheck className="text-slate-900" size={20} />
          </div>
          <span className="text-2xl font-black text-white tracking-tighter">Coal<span className="text-green-500">Carbon</span></span>
        </div>

        <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest px-2 mb-2">Navigation</p>
        <button onClick={() => setActiveTab('dashboard')} className={`flex items-center gap-3 p-3 rounded-xl transition ${activeTab === 'dashboard' ? 'bg-green-500/10 text-green-400 shadow-inner' : 'text-slate-400 hover:bg-slate-700'}`}>
          <LayoutDashboard size={18} /> Overview
        </button>
        <button onClick={() => setActiveTab('emissions')} className={`flex items-center gap-3 p-3 rounded-xl transition ${activeTab === 'emissions' ? 'bg-red-500/10 text-red-400' : 'text-slate-400 hover:bg-slate-700'}`}>
          <Factory size={18} /> Emission Logger
        </button>
        <button onClick={() => setActiveTab('sinks')} className={`flex items-center gap-3 p-3 rounded-xl transition ${activeTab === 'sinks' ? 'bg-emerald-500/10 text-emerald-400' : 'text-slate-400 hover:bg-slate-700'}`}>
          <Leaf size={18} /> Afforestation Registry
        </button>

        <div className="mt-auto p-4 bg-slate-900/50 rounded-2xl border border-slate-700">
          <p className="text-slate-500 text-[10px] uppercase font-bold mb-2">Active Mine</p>
          <select 
            className="w-full bg-transparent text-sm font-bold text-green-400 outline-none cursor-pointer"
            onChange={(e) => setSelectedMineId(e.target.value)}
            value={selectedMineId || ""}
          >
            {mines.map(mine => (
              <option key={mine.id} value={mine.id} className="bg-slate-800">{mine.name}</option>
            ))}
          </select>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        {/* HEADER SECTION */}
        <header className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-4xl font-black mb-1">Operational Dashboard</h1>
            <p className="text-slate-400 text-sm flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
              Live Compliance Monitoring: Sector-7 Coalfields
            </p>
          </div>
          <div className={`px-6 py-3 rounded-2xl border flex items-center gap-4 ${gap > 0 ? 'bg-red-500/5 border-red-500/20' : 'bg-green-500/5 border-green-500/20'}`}>
             <div className="text-right">
                <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Net Neutrality Gap</p>
                <p className={`text-2xl font-black ${gap > 0 ? 'text-red-500' : 'text-green-500'}`}>{gap} <span className="text-xs">Tons</span></p>
             </div>
             <AlertCircle className={gap > 0 ? 'text-red-500' : 'text-green-500'} size={28} />
          </div>
        </header>

        {/* TOP STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 hover:border-slate-500 transition-colors">
            <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest mb-3">Gross Footprint</p>
            <h2 className="text-4xl font-black text-white">{totalCO2Display} <span className="text-sm font-medium text-slate-500">Tons CO2-e</span></h2>
          </div>
          
          <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 hover:border-slate-500 transition-colors">
            <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest mb-3">Grid Reliance</p>
            <h2 className="text-4xl font-black text-white">{totalElec.toLocaleString()} <span className="text-sm font-medium text-slate-500">kWh</span></h2>
          </div>

          <div className="bg-gradient-to-br from-emerald-600/10 to-emerald-900/5 p-6 rounded-3xl border border-emerald-500/20">
            <p className="text-emerald-500 text-[10px] uppercase font-bold tracking-widest mb-3">Current Offsets</p>
            <h2 className="text-4xl font-black text-white">{totalS.toFixed(2)} <span className="text-sm font-medium text-emerald-700">Tons</span></h2>
          </div>
        </div>

        {/* WORKSPACE AREA */}
<div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
  
  {/* LEFT COLUMN: Input Forms or Strategy Tools */}
  <div className="lg:col-span-5 space-y-6">
    {activeTab === 'emissions' && (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <EmissionForm mineId={selectedMineId} />
      </div>
    )}
    
    {activeTab === 'sinks' && (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <SinkForm mineId={selectedMineId} />
      </div>
    )}
    
    {activeTab === 'dashboard' && (
      <div className="space-y-6 animate-in fade-in duration-700">
        {/* Pillar 3: Mitigation Simulator */}
        <MitigationSimulator currentEmissions={parseFloat(totalCO2Display)} />
        
        {/* Pillar 5: Afforestation Estimator */}
        <AfforestationEstimator gap={parseFloat(gap)} />
      </div>
    )}
  </div>

  {/* RIGHT COLUMN: Visual Analytics */}
  <div className="lg:col-span-7 space-y-6">
    <div className="bg-slate-800 p-4 rounded-[2rem] border border-slate-700 shadow-2xl">
       <GapChart logs={logs} sinks={sinks} />
    </div>
    
    {/* Pillar 6: Trend Analysis */}
    <div className="bg-slate-800 p-6 rounded-[2rem] border border-slate-700 shadow-2xl">
       <TrendChart logs={logs} />
    </div>
  </div>
</div>

          {/* Chart Side
          <div className="lg:col-span-7">
             <div className="bg-slate-800 p-2 rounded-[2rem] border border-slate-700 shadow-2xl">
                <GapChart logs={logs} sinks={sinks} /> 
                <TrendChart logs={logs} /> 
             </div>
          </div>
        </div> */}

        {/* DATA TABLE (FOOTER) */}
        <div className="mt-10 bg-slate-800 rounded-3xl border border-slate-700 overflow-hidden shadow-2xl">
          <div className="px-8 py-5 border-b border-slate-700 flex justify-between items-center">
            <h3 className="font-black uppercase tracking-tighter text-slate-300 text-lg">Historical Audit Logs</h3>
            <span className="px-3 py-1 bg-slate-900 rounded-full text-[10px] font-bold text-slate-500">LATEST 10 ENTRIES</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-900/50 text-slate-500">
                <tr>
                  <th className="px-8 py-4 font-bold">TIMESTAMP</th>
                  <th className="px-8 py-4 font-bold">DIESEL (L)</th>
                  <th className="px-8 py-4 font-bold">GRID (kWh)</th>
                  <th className="px-8 py-4 font-bold text-red-500/70">EMISSION IMPACT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {logs && logs.length > 0 ? logs.slice(0, 20).map((log) => (
                  <tr key={log.id} className="hover:bg-slate-700/20 transition-colors">
                    <td className="px-8 py-4 font-mono text-xs text-slate-400">{log.recorded_at}</td>
                    <td className="px-8 py-4 font-bold">{log.diesel_liters}</td>
                    <td className="px-8 py-4 font-bold">{log.electricity_kwh}</td>
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-2">
                         <div className="h-1.5 w-12 bg-slate-700 rounded-full overflow-hidden">
                            <div className="h-full bg-red-500" style={{width: '60%'}}></div>
                         </div>
                         <span className="text-red-400 font-black">
                            {((log.diesel_liters * 2.68 + log.electricity_kwh * 0.82) / 1000).toFixed(2)} t
                         </span>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="4" className="p-20 text-center text-slate-600 italic">No operational telemetry found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default page;