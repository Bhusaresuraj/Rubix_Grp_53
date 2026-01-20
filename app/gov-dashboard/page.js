"use client";
import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { ShieldCheck, AlertTriangle, Search, Filter } from 'lucide-react';

export default function GovDashboard() {
  const [orgs, setOrgs] = useState([]);
  const supabase = createClient();

  useEffect(() => {
    async function fetchGovData() {
      // Fetch from the view we just created
      const { data } = await supabase.from('government_oversight_view').select('*');
      setOrgs(data || []);
    }
    fetchGovData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-10">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
            <ShieldCheck className="text-emerald-600" size={36} /> 
            National Carbon Oversight
          </h1>
          <p className="text-slate-500 font-medium">Ministry of Coal & Energy Regulatory Portal</p>
        </div>
        <div className="flex gap-4">
           <div className="bg-white border p-2 rounded-xl flex items-center gap-2 px-4 shadow-sm">
             <Search size={18} className="text-slate-400" />
             <input type="text" placeholder="Search Org ID..." className="outline-none text-sm" />
           </div>
        </div>
      </header>

      {/* REGULATORY SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        <div className="bg-white p-8 rounded-3xl border shadow-sm">
          <p className="text-slate-400 text-xs font-bold uppercase">Total Organizations</p>
          <h2 className="text-4xl font-black">{orgs.length}</h2>
        </div>
        <div className="bg-white p-8 rounded-3xl border shadow-sm border-l-red-500 border-l-4">
          <p className="text-slate-400 text-xs font-bold uppercase">Non-Compliant</p>
          <h2 className="text-4xl font-black text-red-600">
            {orgs.filter(o => o.neutrality_rate < 20).length}
          </h2>
        </div>
        <div className="bg-emerald-600 p-8 rounded-3xl text-white shadow-lg">
          <p className="text-emerald-100 text-xs font-bold uppercase">Avg. Neutrality Rate</p>
          <h2 className="text-4xl font-black">
            {(orgs.reduce((acc, o) => acc + o.neutrality_rate, 0) / orgs.length || 0).toFixed(1)}%
          </h2>
        </div>
      </div>

      {/* MASTER DATA TABLE */}
      <div className="bg-white rounded-[2.5rem] border shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b">
            <tr className="text-slate-400 text-[11px] font-black uppercase tracking-widest">
              <th className="p-6">Organization</th>
              <th className="p-6">Location</th>
              <th className="p-6">Gross CO2 (T)</th>
              <th className="p-6">Neutrality</th>
              <th className="p-6">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {orgs.map((org) => (
              <tr key={org.mine_id} className="hover:bg-slate-50 transition cursor-pointer">
                <td className="p-6 font-bold text-slate-800">{org.organization_name}</td>
                <td className="p-6 text-slate-500">{org.location}</td>
                <td className="p-6 font-mono font-bold">{org.total_co2.toFixed(2)}</td>
                <td className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-slate-100 rounded-full w-24">
                      <div className="h-full bg-emerald-500 rounded-full" style={{width: `${org.neutrality_rate}%`}}></div>
                    </div>
                    <span className="text-xs font-bold">{org.neutrality_rate.toFixed(1)}%</span>
                  </div>
                </td>
                <td className="p-6">
                  {org.neutrality_rate > 50 ? (
                    <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-black">COMPLIANT</span>
                  ) : (
                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-[10px] font-black flex items-center gap-1 w-fit">
                      <AlertTriangle size={10} /> CRITICAL
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}