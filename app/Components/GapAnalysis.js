"use client";
import React from 'react';
import { useCoal } from "../context/CoalContext";
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { ShieldCheck, ShieldAlert, Target, TrendingDown } from 'lucide-react';

export default function GapAnalysis() {
  const { logs, sinks, plans } = useCoal();

  // 1. Calculate Real-Time Totals (Metric Tons)
  const totalE = (logs || []).reduce((acc, curr) => acc + ((curr.diesel_liters * 2.68 + curr.electricity_kwh * 0.71) / 1000), 0);
  const totalS = (sinks || []).reduce((acc, curr) => acc + (((curr.neem_count || 0) * 25 + (curr.bamboo_count || 0) * 18.2) / 1000), 0);
  
  const gap = totalE - totalS;
  const neutralityPercent = totalE > 0 ? Math.min(100, (totalS / totalE) * 100) : 0;

  // 2. Compliance Logic
  const getComplianceStatus = () => {
    if (neutralityPercent >= 100) return { label: "NET ZERO", color: "text-emerald-500", bg: "bg-emerald-50", icon: <ShieldCheck /> };
    if (neutralityPercent >= 50) return { label: "TRANSITIONING", color: "text-blue-500", bg: "bg-blue-50", icon: <TrendingDown /> };
    return { label: "NON-COMPLIANT", color: "text-red-500", bg: "bg-red-50", icon: <ShieldAlert /> };
  };

  const status = getComplianceStatus();

  return (
    <div className="space-y-8 animate-in fade-in duration-1000">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* PILLAR: THE SCORECARD CARD */}
        <div className="lg:col-span-4 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/20 flex flex-col justify-between">
          <div>
            <div className={`w-fit p-3 rounded-2xl ${status.bg} ${status.color} mb-6`}>
              {status.icon}
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Gap</p>
            <h2 className="text-5xl font-black text-slate-900 mt-2">{gap.toFixed(1)}<span className="text-sm font-normal text-slate-400 ml-2">Tons</span></h2>
          </div>
          
          <div className="mt-10 pt-10 border-t border-slate-50">
            <div className="flex justify-between items-end mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase">Neutrality Progress</span>
              <span className={`text-xl font-black ${status.color}`}>{neutralityPercent.toFixed(1)}%</span>
            </div>
            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-1000 ${status.color.replace('text', 'bg')}`}
                style={{ width: `${neutralityPercent}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* PILLAR: COMPARATIVE ANALYTICS */}
        <div className="lg:col-span-8 bg-slate-900 p-10 rounded-[3rem] text-white overflow-hidden relative">
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10 h-full">
            <div className="flex flex-col justify-center">
              <h3 className="text-2xl font-bold mb-4">The Neutrality Deficit</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Your current operational footprint requires an additional <span className="text-white font-bold">{Math.ceil(gap / 0.025).toLocaleString()} trees</span> to achieve a balance within the 2026 fiscal cycle.
              </p>
              <div className="flex gap-4">
                <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/10">
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Emissions</p>
                  <p className="font-bold">{totalE.toFixed(1)} T</p>
                </div>
                <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/10">
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Sinks</p>
                  <p className="font-bold text-emerald-400">{totalS.toFixed(1)} T</p>
                </div>
              </div>
            </div>

            {/* Visual Balance Indicator */}
            <div className="flex items-center justify-center">
              <div className="w-48 h-48 border-8 border-slate-800 rounded-full flex flex-col items-center justify-center">
                <Target size={32} className="text-emerald-500 mb-2 animate-pulse" />
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Net Result</p>
                <p className="text-xl font-black">{gap > 0 ? `+${gap.toFixed(1)}` : '0.0'}</p>
              </div>
            </div>
          </div>
          {/* Decorative Glow */}
          <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-emerald-500 rounded-full blur-[120px] opacity-10"></div>
        </div>

      </div>
    </div>
  );
}