"use client";

import { useEffect, useState } from "react";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

/* ================= MOCK DATA =================
   Shape matches real government plantation view
================================================ */
const MOCK_PLANTATION_DATA = [
  {
    organization: "Eastern Coal Ltd",
    year: 2021,
    trees: 12000,
    emission: 1400,
    offset: 300,
  },
  {
    organization: "Eastern Coal Ltd",
    year: 2022,
    trees: 18000,
    emission: 1100,
    offset: 550,
  },
  {
    organization: "Eastern Coal Ltd",
    year: 2023,
    trees: 26000,
    emission: 800,
    offset: 900,
  },
  {
    organization: "Western Mining Corp",
    year: 2022,
    trees: 9000,
    emission: 1000,
    offset: 280,
  },
  {
    organization: "Western Mining Corp",
    year: 2023,
    trees: 15000,
    emission: 950,
    offset: 450,
  },
];

export default function PlantationHistory() {
  const [org, setOrg] = useState("");
  const [rows, setRows] = useState([]);
  const [orgs, setOrgs] = useState([]);

  /* ---------------- INIT ---------------- */
  useEffect(() => {
    const uniqueOrgs = [
      ...new Set(MOCK_PLANTATION_DATA.map(d => d.organization)),
    ];
    setOrgs(uniqueOrgs);
  }, []);

  /* ---------------- FILTER ---------------- */
  useEffect(() => {
    if (!org) return;
    setRows(
      MOCK_PLANTATION_DATA.filter(d => d.organization === org)
    );
  }, [org]);

  /* ---------------- CHART DATA ---------------- */
  const chartData = {
    labels: rows.map(r => r.year),
    datasets: [
      {
        label: "CO₂ Emission",
        data: rows.map(r => r.emission),
        backgroundColor: "#dc2626",
      },
      {
        label: "CO₂ Offset (Plantation)",
        data: rows.map(r => r.offset),
        backgroundColor: "#16a34a",
      },
    ],
  };

  return (
    <div className="space-y-10">

      {/* ===== HEADER ===== */}
      <div>
        <h1 className="text-3xl font-black text-slate-800">
          Plantation History & Impact
        </h1>
        <p className="text-slate-500">
          Year-wise afforestation efforts compared with emissions
        </p>
      </div>

      {/* ===== ORG SELECT ===== */}
      <select
        className="bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-800"
        value={org}
        onChange={(e) => setOrg(e.target.value)}
      >
        <option value="">Select Organization</option>
        {orgs.map(o => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>

      {/* ===== VISUAL SUMMARY ===== */}
      {rows.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <StatCard
            title="Total Trees Planted"
            value={rows.reduce((s, r) => s + r.trees, 0)}
            color="green"
            unit="trees"
          />

          <StatCard
            title="Total Emissions"
            value={rows.reduce((s, r) => s + r.emission, 0)}
            color="red"
            unit="kg CO₂"
          />

          <StatCard
            title="Total Offset"
            value={rows.reduce((s, r) => s + r.offset, 0)}
            color="emerald"
            unit="kg CO₂"
          />
        </div>
      )}

      {/* ===== BAR CHART ===== */}
      {rows.length > 0 && (
        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="font-black text-slate-800 mb-4">
            Emission vs Plantation Offset (Year-wise)
          </h3>
          <Bar data={chartData} />
        </div>
      )}

      {/* ===== TIMELINE VIEW ===== */}
      {rows.length > 0 && (
        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="font-black text-slate-800 mb-6">
            Plantation Timeline
          </h3>

          <div className="space-y-4">
            {rows.map(r => {
              const good = r.offset >= r.emission;
              return (
                <div
                  key={r.year}
                  className={`border-l-4 pl-4 py-3 ${
                    good ? "border-green-500" : "border-red-500"
                  }`}
                >
                  <p className="font-bold text-slate-700">
                    {r.year}
                  </p>
                  <p className="text-sm text-slate-600">
                    🌱 {r.trees.toLocaleString()} trees planted
                  </p>
                  <p className="text-sm">
                    {good ? "✅ Plantation adequate" : "⚠ Offset insufficient"}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ===== EMPTY STATE ===== */}
      {!org && (
        <div className="bg-slate-100 border border-dashed border-slate-300 rounded-xl p-10 text-center text-green-700 font-semibold">
          Select an organization to view plantation history
        </div>
      )}
    </div>
  );
}

/* ================= COMPONENTS ================= */

function StatCard({ title, value, color, unit }) {
  const colorMap = {
    green: "text-green-600",
    red: "text-red-600",
    emerald: "text-emerald-600",
  };

  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <p className="text-sm font-bold text-slate-500 mb-2">
        {title}
      </p>
      <p className={`text-3xl font-black ${colorMap[color]}`}>
        {value.toLocaleString()}
      </p>
      <p className="text-xs text-slate-400">{unit}</p>
    </div>
  );
}
