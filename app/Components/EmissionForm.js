"use client";
import React from 'react';
import { useCoal } from '../context/CoalContext';
import OperationsLogger from './OperationsLogger';
import ImpactCategoryPie from './ImpactCategoryPie';
import TemporalHeatmap from "./TemporalHeatmap";
import EmissionTrend from './EmissionTrend';
import { Activity, ShieldAlert, Zap, Fuel } from 'lucide-react';

export default function EmissionForm() {
  const { logs, loading } = useCoal();

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      {/* HEADER SECTION */}
      <div className="flex justify-between items-end bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Operational Audit</h2>
          <p className="text-slate-500 font-medium mt-2 flex items-center gap-2">
            <ShieldAlert size={16} className="text-red-500" /> Monitoring Scope 1 & Scope 2 carbon intensity in real-time.
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Compliance Cycle</p>
          <p className="text-lg font-bold text-slate-800">Q1 2026 Audit Active</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* LEFT: FORM & PIE CHART */}
        <div className="lg:col-span-5 space-y-10">
          <OperationsLogger />
          
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Zap size={18} className="text-amber-500" /> Impact Category Breakdown
            </h3>
            <ImpactCategoryPie logs={logs} />
            <div className="mt-6 grid grid-cols-2 gap-4">
               <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Diesel Impact</p>
                  <p className="text-sm font-black text-slate-800">Scope 1 Direct</p>
               </div>
               <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Grid Impact</p>
                  <p className="text-sm font-black text-slate-800">Scope 2 Indirect</p>
               </div>
            </div>
          </div>
        </div>

        {/* RIGHT: HEATMAP (Database Visualization) */}
        <div className="lg:col-span-7">
           <div className="bg-slate-900 p-10 rounded-[3rem] h-full shadow-2xl relative overflow-hidden">
              <div className="relative z-10 h-full flex flex-col">
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Activity className="text-red-500" /> Temporal Carbon Intensity
                  </h3>
                  <p className="text-slate-400 text-sm mt-1">Operational peaks identified via database timestamp analysis.</p>
                </div>
                
                <div className="flex-1 min-h-[400px]">
                   <TemporalHeatmap logs={logs} />
                </div>
                
                <p className="text-[10px] text-slate-500 font-medium italic mt-6">
                  * Darker segments indicate high-intensity operational windows.
                </p>
              </div>
              <div className="absolute bottom-[-100px] right-[-100px] w-80 h-80 bg-red-600 rounded-full blur-[150px] opacity-20"></div>
           </div>
        </div>
      </div>
          <EmissionTrend logs={logs} />
    </div>
  );
}