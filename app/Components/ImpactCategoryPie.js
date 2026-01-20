"use client";
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export default function ImpactCategoryPie({ logs }) {
  const safeLogs = logs || [];
  
  const totals = safeLogs.reduce((acc, curr) => ({
    diesel: acc.diesel + (curr.diesel_liters * 2.68),
    elec: acc.elec + (curr.electricity_kwh * 0.71)
  }), { diesel: 0, elec: 0 });

  const totalCO2 = totals.diesel + totals.elec;
  
  const data = [
    { name: 'Diesel (Scope 1)', value: totals.diesel, color: '#F43F5E' }, // Rose 500
    { name: 'Grid (Scope 2)', value: totals.elec, color: '#F59E0B' }    // Amber 500
  ];

  return (
    <div className="flex flex-col items-center">
      <div className="h-[280px] w-full relative">
        {/* Center Label for the "Pro" look */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Gross Impact</p>
          <p className="text-2xl font-black text-slate-800">{(totalCO2 / 1000).toFixed(2)}t</p>
        </div>
        
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie 
              data={data} 
              innerRadius={75} 
              outerRadius={95} 
              paddingAngle={10} 
              dataKey="value" 
              stroke="none"
            >
              {data.map((entry, index) => <Cell key={index} fill={entry.color} />)}
            </Pie>
            <Tooltip 
              contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Analytics Legend with Progress Bars */}
      <div className="w-full mt-4 space-y-4">
        {data.map((item) => (
          <div key={item.name} className="space-y-1">
            <div className="flex justify-between text-[11px] font-bold">
              <span className="text-slate-500 uppercase">{item.name}</span>
              <span className="text-slate-800">{((item.value / totalCO2) * 100 || 0).toFixed(1)}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full transition-all duration-1000" style={{ width: `${(item.value / totalCO2) * 100}%`, backgroundColor: item.color }}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}