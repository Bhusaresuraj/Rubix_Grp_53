"use client";
import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TreePine, TrendingUp, ShieldCheck } from "lucide-react";
import PlanProjectForm from "./PlanProjectForm";
export default function AfforestationRegistry({ sinks }) {
  const safeSinks = sinks || [];
  
  // 1. DYNAMIC DATA: Sum total inventory from DB
  const inventory = safeSinks.reduce((acc, curr) => ({
    neem: acc.neem + (curr.neem_count || 0),
    bamboo: acc.bamboo + (curr.bamboo_count || 0),
    teak: acc.teak + (curr.teak_count || 0),
  }), { neem: 0, bamboo: 0, teak: 0 });

  const totalTrees = inventory.neem + inventory.bamboo + inventory.teak;

  // 2. PREDICTION LOGIC: Calculate 10-year growth curve
  // Annual rates (Tons/tree): Neem (0.025), Bamboo (0.018), Teak (0.020)
  const projectionData = Array.from({ length: 11 }, (_, year) => {
    const sequestration = (
      (inventory.neem * 0.025) + 
      (inventory.bamboo * 0.018) + 
      (inventory.teak * 0.020)
    ) * year;
    return { year: `Year ${year}`, tons: parseFloat(sequestration.toFixed(2)) };
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* KPI Header for the Registry */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-600"><TreePine size={24} /></div>
          <div>
            <p className="text-slate-400 text-[10px] font-bold uppercase">Total Managed Trees</p>
            <h4 className="text-2xl font-black">{totalTrees.toLocaleString()}</h4>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-blue-50 rounded-2xl text-blue-600"><TrendingUp size={24} /></div>
          <div>
            <p className="text-slate-400 text-[10px] font-bold uppercase">10-Year Offset Forecast</p>
            <h4 className="text-2xl font-black">{projectionData[10].tons} <span className="text-sm font-normal">Tons</span></h4>
          </div>
        </div>
        <div className="bg-emerald-600 p-6 rounded-3xl shadow-lg flex items-center gap-4 text-white">
          <div className="p-4 bg-white/20 rounded-2xl"><ShieldCheck size={24} /></div>
          <div>
            <p className="text-emerald-100 text-[10px] font-bold uppercase tracking-widest">Registry Status</p>
            <h4 className="text-2xl font-black tracking-tight underline cursor-pointer">Verified Auditor ✅</h4>
          </div>
        </div>
      </div>

      {/* Main Growth Projection Chart */}
      <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div className="mb-8">
          <h3 className="text-xl font-bold text-slate-800">Carbon Sequestration Roadmap</h3>
          <p className="text-slate-400 text-sm">Long-term cumulative absorption forecast based on current inventory.</p>
        </div>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={projectionData}>
              <defs>
                <linearGradient id="colorTons" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="year" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} label={{ value: 'Tons CO2-e', angle: -90, position: 'insideLeft', fill: '#94A3B8', fontSize: 10 }} />
              <Tooltip 
                contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ color: '#10B981', fontWeight: 'bold' }}
              />
              <Area type="monotone" dataKey="tons" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorTons)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}