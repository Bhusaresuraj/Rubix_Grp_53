"use client";
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function GapChart({ logs, sinks }) {

    const safeLogs = logs || [];
  const safeSinks = sinks || [];

  // 2. Calculate Totals (Metric Tons)
  const totalEmissions = safeLogs.reduce((acc, curr) => 
    acc + (( (curr.diesel_liters || 0) * 2.68 + (curr.electricity_kwh || 0) * 0.82 + (curr.explosives_kg || 0) * 0.18) / 1000), 0
  );

  const totalSinks = safeSinks.reduce((acc, curr) => 
    acc + (( (curr.neem_count || 0) * 25 + (curr.bamboo_count || 0) * 18.2 + (curr.teak_count || 0) * 20.5) / 1000), 0
  );

  // 3. Data for the chart
  const data = [
    { 
      name: 'Mine Carbon Balance', 
      Emissions: parseFloat(totalEmissions.toFixed(2)), 
      Sinks: parseFloat(totalSinks.toFixed(2)) 
    }
  ];
 
  

  return (
    <div className="h-[400px] w-full bg-slate-800/50 p-4 rounded-2xl border border-slate-700">
      <h3 className="text-slate-400 text-sm mb-6 uppercase tracking-widest">Net Zero Balance (Metric Tons)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="name" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
            itemStyle={{ fontWeight: 'bold' }}
          />
          <Legend />
          <Bar dataKey="Emissions" fill="#ef4444" radius={[4, 4, 0, 0]} name="Total Emissions" />
          <Bar dataKey="Sinks" fill="#10b981" radius={[4, 4, 0, 0]} name="Total Sinks" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}