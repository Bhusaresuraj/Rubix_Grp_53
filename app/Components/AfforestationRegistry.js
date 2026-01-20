

"use client";
import React from "react";
import { useCoal } from "../context/CoalContext";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TreePine, TrendingUp, ShieldCheck, MapPin, ListChecks, Calendar } from "lucide-react";
import PlanProjectForm from "./PlanProjectForm";
import SpeciesInsights from "./SpeciesInsights";
export default function AfforestationRegistry({ mineId }) {
  const { plans, sinks, loading } = useCoal();

  const currentTons = (sinks || []).reduce((acc, curr) => 
    acc + (((curr.neem_count || 0) * 25 + (curr.bamboo_count || 0) * 18.2 + (curr.teak_count || 0) * 20.5) / 1000), 0
  );

  const roadmapData = [
    { year: '2024 (Now)', tons: parseFloat(currentTons.toFixed(2)) },
    ...(plans || []).map(plan => ({
      year: plan.target_year.toString(),
      tons: plan.estimated_offset
    }))
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      
      {/* SECTION 1: Strategic Roadmap Graph */}
      <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div className="mb-10 flex justify-between items-start">
          <div>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">Neutrality Roadmap</h3>
            <p className="text-slate-400 text-sm mt-1">Projection based on {plans.length} active afforestation projects.</p>
          </div>
          <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 text-[10px] font-bold text-slate-500 flex items-center gap-2 uppercase tracking-widest">
            <MapPin size={12} className="text-emerald-500" /> Source: Verified Satellite Telemetry
          </div>
        </div>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={roadmapData}>
              <defs>
                <linearGradient id="colorPlan" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="year" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip />
              <Area type="monotone" dataKey="tons" stroke="#10B981" strokeWidth={4} fillOpacity={1} fill="url(#colorPlan)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* SECTION 2: Impact Scorecard & Planning Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4">
           <PlanProjectForm mineId={mineId} />
           
        </div>
        
        <div className="lg:col-span-8 bg-emerald-900 p-10 rounded-[2.5rem] text-white relative overflow-hidden">
          <div className="relative z-10">
            <h4 className="text-xl font-bold mb-6 flex items-center gap-3">
              <TrendingUp className="text-emerald-400" /> Strategic Efficiency Analysis
            </h4>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-emerald-300 text-[10px] font-bold uppercase tracking-widest mb-1">Projected Neutrality</p>
                <p className="text-3xl font-black">{plans.length > 0 ? plans[plans.length - 1].target_year : '2050'}</p>
              </div>
              <div>
                <p className="text-emerald-300 text-[10px] font-bold uppercase tracking-widest mb-1">Land Requirement</p>
                <p className="text-3xl font-black">{(currentTons * 0.45).toFixed(1)} <span className="text-sm font-normal">Ha</span></p>
              </div>
            </div>
            <p className="mt-8 text-sm text-emerald-100/70 leading-relaxed italic">
              "Note: This strategy utilizes fast-growing species like Bamboo and Neem to maximize early-stage carbon sequestration credits."
            </p>
          </div>
          <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-emerald-800 rounded-full blur-[100px] opacity-40"></div>
       <SpeciesInsights  />
        </div>
        
      </div>

      {/* SECTION 3: The Active Projects Ledger (Data Table) */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center">
          <h3 className="font-bold text-slate-800 flex items-center gap-3">
            <ListChecks className="text-emerald-500" size={20} /> Active Strategy Ledger
          </h3>
          <span className="text-[10px] bg-slate-100 px-3 py-1 rounded-full font-black text-slate-500 uppercase">
            {plans.length} Saved Scenarios
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-400 font-bold uppercase text-[10px] tracking-widest">
              <tr>
                <th className="px-8 py-4">Target Year</th>
                <th className="px-8 py-4">Est. Offset (T)</th>
                <th className="px-8 py-4">Seq. Rate</th>
                <th className="px-8 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {plans.map((plan) => (
                <tr key={plan.id} className="hover:bg-slate-50 transition">
                  <td className="px-8 py-4 flex items-center gap-3 font-bold text-slate-800">
                    <Calendar size={14} className="text-slate-300" /> {plan.target_year}
                  </td>
                  <td className="px-8 py-4 font-black text-emerald-600">{plan.estimated_offset} T</td>
                  <td className="px-8 py-4 text-slate-500">{plan.sequestration_rate || 'Auto'} kg/yr</td>
                  <td className="px-8 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black ${plan.recommended ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                      {plan.recommended ? 'RECOMMENDED' : 'STRATEGIC'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}