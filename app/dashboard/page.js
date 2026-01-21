"use client";
import React, { useState, useEffect } from "react";
import { useCoal } from "../context/CoalContext";
import GapChart from "../Components/GapChart";
import TrendChart from "../Components/TrendChart";
import AfforestationEstimator from "../Components/AfforestationEstimator";
import EmissionForm from "../Components/EmissionForm";
import MitigationSimulator from "../Components/MitigationSimulator";
import AfforestationRegistry from "../Components/AfforestationRegistry";
import CostBenefitAnalysis from "./CostBenefitAnalysis";
import { 
  LayoutDashboard, Factory, Leaf, 
  ArrowUpRight, Target, ShieldCheck, 
  Search, Bell, User,Zap, Calculator
} from 'lucide-react';

const page = () => {
const { logs, sinks, plans, loading } = useCoal();

  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'emissions', 'sinks'
  const [selectedMineId, setSelectedMineId] = useState(null);
  // Safe math for professional display
  const safeLogs = logs || [];
  const safeSinks = sinks || [];
  const safePlans = plans || [];
  console.log("daya is",safePlans)
  const totalE = safeLogs.reduce((acc, curr) => acc + ((curr.diesel_liters * 2.68 + curr.electricity_kwh * 0.82) / 1000), 0);
  const totalS = safeSinks.reduce((acc, curr) => acc + ((curr.neem_count * 25 + curr.bamboo_count * 18.2) / 1000), 0);
  const gap = (totalE - totalS).toFixed(2);
  
  // Neutrality Percentage (e.g., how much of our emissions are covered by sinks?)
  const neutralityPercent = totalE > 0 ? Math.min(100, (totalS / totalE) * 100).toFixed(1) : 0;

  if (loading) return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin"></div>
        <p className="text-slate-400 font-medium animate-pulse">Syncing Environmental Data...</p>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-slate-900 font-sans">
      <div className={`flex h-screen bg-[#F8FAFC] text-slate-900 overflow-hidden ${activeTab !== 'dashboard' ? 'flex-1' : ''}`}>
      {/* SIDEBAR - Clean White/Emerald */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col p-8">
        <nav className="flex flex-col gap-2">
          <button 
            onClick={() => setActiveTab('dashboard')} 
            className={`flex items-center gap-4 p-3.5 rounded-xl transition ${activeTab === 'dashboard' ? 'bg-emerald-50 text-emerald-700 font-bold border border-emerald-100' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <LayoutDashboard size={20} /> Dashboard
          </button>
          
         <button 
  onClick={() => setActiveTab('audit')} 
  className={`flex items-center gap-4 p-3.5 rounded-xl transition ${activeTab === 'audit' ? 'bg-red-50 text-red-700 font-bold border border-red-100' : 'text-slate-500 hover:bg-slate-50'}`}
>
  <Factory size={20} /> Emission Audit
</button>
          
          <button 
            onClick={() => setActiveTab('sinks')} 
            className={`flex items-center gap-4 p-3.5 rounded-xl transition ${activeTab === 'sinks' ? 'bg-emerald-50 text-emerald-700 font-bold border border-emerald-100' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <Leaf size={20} /> Afforestation
          </button>

          <button 
  onClick={() => setActiveTab('simulator')} 
  className={`flex items-center gap-4 p-3.5 rounded-xl transition ${activeTab === 'simulator' ? 'bg-emerald-50 text-emerald-700 font-bold border border-emerald-100' : 'text-slate-500 hover:bg-slate-50'}`}
>
  <Zap size={20} /> Mitigation Lab
</button>
          <button 
            onClick={() => setActiveTab('cost-benefit')} 
            className={`flex items-center gap-4 p-3.5 rounded-xl transition ${activeTab === 'cost-benefit' ? 'bg-emerald-50 text-emerald-700 font-bold border border-emerald-100' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <Calculator size={20} /> Cost-Benefit
          </button>
 
        </nav>
      </aside>

      {/* DYNAMIC CONTENT AREA */}
      <main className="flex-1 overflow-y-auto p-10">
        {/* {activeTab === 'dashboard' && <EnhancedOverview gap={gap} neutrality={neutralityPercent} totalS={totalS} logs={logs} sinks={sinks} />}
        {activeTab === 'emissions' && <EmissionLoggerModule mineId={selectedMineId} logs={logs} />} */}
        {activeTab === 'audit' && (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-800">Operational Audit</h2>
          <p className="text-slate-500 font-medium">Monitoring Scope 1 & Scope 2 carbon intensity.</p>
        </div>
      </div>
      
      {/* The Logger Form we just built */}
      <EmissionForm mineId={selectedMineId} />
      
      {/* Coming next: The Temporal Heatmap */}
      <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 min-h-[400px] flex items-center justify-center">
         <p className="text-slate-300 font-bold italic tracking-widest">Temporal Heatmap Engine Loading...</p>
      </div>
    </div>
  )}
      {activeTab === 'sinks' && (
    <AfforestationRegistry 
      mineId={selectedMineId} 
      sinks={sinks} 
      plans={safePlans}
    />
  )}


  {activeTab === 'simulator' && <MitigationSimulator logs={logs} sinks={sinks} />}
      {activeTab === 'cost-benefit' && <CostBenefitAnalysis />}

      </main>
</div>
      {/* MAIN CONTENT AREA */}
      {activeTab === 'dashboard' && (
      <main className="flex-1 overflow-y-auto">
        
        {/* TOP NAVBAR */}
        <header className="h-20 bg-white border-b border-slate-200 px-10 flex items-center justify-between sticky top-0 z-10">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="Search mine reports..." className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 pl-10 pr-4 outline-none focus:border-emerald-500 transition text-sm" />
          </div>
          <div className="flex items-center gap-6">
            <div className="relative"><Bell className="text-slate-500 cursor-pointer" size={20} /> <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span></div>
            <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
              <div className="text-right">
                <p className="text-xs font-bold text-slate-800 uppercase">Krishna V.</p>
                <p className="text-[10px] text-slate-500 font-medium">Mine Superintendent</p>
              </div>
              <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 border border-slate-200">
                <User size={20} />
              </div>
            </div>
          </div>
        </header>

        <div className="p-10 max-w-7xl mx-auto">
          
          {/* WELCOME SECTION */}
          <div className="mb-10 flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Executive Overview</h1>
              <p className="text-slate-500 font-medium mt-1">Status Report: CCTS Compliance Framework 2026</p>
            </div>
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-emerald-100 transition flex items-center gap-2">
              Generate Audit Report <ArrowUpRight size={18} />
            </button>
          </div>

          {/* KPI CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            <div className="bg-white p-6 rounded-[1.5rem] border border-slate-200 shadow-sm">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Total Carbon Gap</p>
              <h2 className="text-3xl font-black text-slate-800">{gap} <span className="text-xs font-medium text-slate-400">Tons</span></h2>
              <div className="mt-3 flex items-center gap-2 text-[11px] font-bold text-red-500 bg-red-50 px-2 py-1 rounded-full w-fit">
                <ArrowUpRight size={12} /> 4.2% from last month
              </div>
            </div>

            <div className="bg-white p-6 rounded-[1.5rem] border border-slate-200 shadow-sm">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Neutrality Target</p>
              <h2 className="text-3xl font-black text-emerald-600">{neutralityPercent}% <span className="text-xs font-medium text-slate-400">Achieved</span></h2>
              <div className="mt-4 w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500" style={{ width: `${neutralityPercent}%` }}></div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-[1.5rem] border border-slate-200 shadow-sm">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Greenbelt Coverage</p>
              <h2 className="text-3xl font-black text-slate-800">{totalS.toFixed(1)} <span className="text-xs font-medium text-slate-400">Tons/yr</span></h2>
              <div className="mt-3 flex items-center gap-2 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full w-fit">
                <Target size={12} /> 120 Trees planted this week
              </div>
            </div>

            <div className="bg-emerald-900 p-6 rounded-[1.5rem] shadow-xl relative overflow-hidden">
              <div className="relative z-10">
                <p className="text-emerald-300/80 text-xs font-bold uppercase tracking-wider mb-2">Compliance Score</p>
                <h2 className="text-4xl font-black text-white">A+</h2>
                <p className="text-emerald-200 text-[11px] mt-4 font-medium italic underline cursor-pointer">View regulatory certificate</p>
              </div>
              <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-emerald-800 rounded-full blur-3xl opacity-50"></div>
            </div>
          </div>

          {/* MAIN DATA SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-8">
              <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-8 px-2">
                  <h3 className="font-bold text-slate-800">Emission Analysis vs Sinks</h3>
                  <div className="flex gap-4">
                    <span className="flex items-center gap-2 text-xs text-slate-400 font-medium"><div className="w-3 h-3 bg-red-500 rounded-full"></div> Gross Impact</span>
                    <span className="flex items-center gap-2 text-xs text-slate-400 font-medium"><div className="w-3 h-3 bg-emerald-500 rounded-full"></div> Offset Sink</span>
                  </div>
                </div>
                <GapChart logs={safeLogs} sinks={safeSinks} />
              </div>
              
              <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
                <TrendChart logs={safeLogs} />
              </div>
            </div>

            <div className="lg:col-span-4 space-y-8">
              {/* RECENT ACTIVITY SIDEBAR WIDGET */}
              <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="font-bold text-slate-800 text-sm">Real-time Telemetry</h3>
                  <span className="text-[10px] bg-slate-100 px-2 py-1 rounded-md text-slate-500 font-black">LIVE</span>
                </div>
                <div className="p-2 divide-y divide-slate-50">
                  {safeLogs.slice(0, 5).map((log, i) => (
                    <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:shadow-md transition">
                          <Zap size={18} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800">{log.recorded_at}</p>
                          <p className="text-[10px] text-slate-400 uppercase tracking-tighter">Energy Injection</p>
                        </div>
                      </div>
                      <p className="text-xs font-black text-red-500">+{((log.diesel_liters * 2.68) / 1000).toFixed(1)}t</p>
                    </div>
                  ))}
                </div>
                <button className="w-full p-4 text-[11px] font-bold text-emerald-600 hover:bg-emerald-50 transition border-t border-slate-100">
                  View full telemetry history
                </button>
              </div>

              {/* QUICK CALCULATOR MINI-WIDGET */}
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-[2rem] text-white shadow-xl shadow-slate-200">
                <Target className="text-emerald-400 mb-4" />
                <h4 className="font-bold mb-2">Neutrality Gap Advice</h4>
                <p className="text-slate-400 text-xs leading-relaxed mb-6">Based on current telemetry, planting 400 additional Neem trees this quarter would reduce the neutrality gap by 12%.</p>
                <button className="w-full bg-emerald-500 hover:bg-emerald-400 py-3 rounded-xl font-bold text-slate-900 transition">
                  Simulate Strategy
                </button>
              </div>
            </div>
          </div>

        </div>
      </main>
      )}
    </div>
  );
};

export default page;