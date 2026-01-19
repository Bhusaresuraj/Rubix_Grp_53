"use client";
import React from "react";
import { useCoal } from "../context/CoalContext";

const page = () => {
  // 1. Get data from Context
  const { logs, loading } = useCoal();

  // 2. Safe calculation: Check if logs exists before reducing
  // India 2026 Emission Factors: Diesel (2.68), Electricity (0.82)
  const totalDiesel = (logs || []).reduce((acc, curr) => acc + (curr.diesel_liters || 0), 0);
  const totalElec = (logs || []).reduce((acc, curr) => acc + (curr.electricity_kwh || 0), 0);
  
  const totalCO2 = ((totalDiesel * 2.68) + (totalElec * 0.82)).toFixed(2);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-green-400 animate-pulse font-mono">Connecting to Mine Database...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-green-400">Mine Analytics</h1>
          <p className="text-slate-400 text-sm">Real-time Carbon Tracking Dashboard</p>
        </div>
        <div className="bg-slate-800 border border-slate-700 px-4 py-2 rounded-lg text-xs font-mono">
          MODE: COMPLIANCE MONITORING
        </div>
      </header>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
          <p className="text-slate-400 text-xs uppercase tracking-widest mb-2">Total Carbon Footprint</p>
          <h2 className="text-4xl font-black text-red-500">{totalCO2} <span className="text-sm">tons</span></h2>
        </div>
        
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
          <p className="text-slate-400 text-xs uppercase tracking-widest mb-2">Energy Usage</p>
          <h2 className="text-4xl font-bold">{totalElec} <span className="text-sm">kWh</span></h2>
        </div>

        <div className="bg-gradient-to-br from-green-600/20 to-emerald-900/20 p-6 rounded-2xl border border-green-500/30">
          <p className="text-green-400 text-xs uppercase tracking-widest mb-2">Offsets (Sinks)</p>
          <h2 className="text-4xl font-bold">0.00 <span className="text-sm">tons</span></h2>
          <p className="text-green-500/60 text-xs mt-2">Target: Carbon Neutral by 2050</p>
        </div>
      </div>

      {/* RECENT ACTIVITY TABLE */}
      <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-700 font-bold bg-slate-800/50">Activity Logs</div>
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-900/50 text-slate-400">
            <tr>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Fuel (L)</th>
              <th className="px-6 py-3">Grid (kWh)</th>
              <th className="px-6 py-3">Net CO2</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {logs && logs.length > 0 ? logs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-700/30 transition">
                <td className="px-6 py-4 font-mono">{log.recorded_at}</td>
                <td className="px-6 py-4">{log.diesel_liters} L</td>
                <td className="px-6 py-4">{log.electricity_kwh} kWh</td>
                <td className="px-6 py-4 text-red-400 font-bold">
                  {((log.diesel_liters * 2.68) + (log.electricity_kwh * 0.82)).toFixed(2)} t
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="4" className="p-10 text-center text-slate-500 italic">No logs found. Add your first data point to start.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default page