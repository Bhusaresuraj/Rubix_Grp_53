"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

export default function OrganizationAnalysis() {
  const supabase = createClient();

  const [orgs, setOrgs] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState("");
  const [selectedYear, setSelectedYear] = useState("ALL");
  const [rows, setRows] = useState([]);

  /* ---------------- FETCH ORG LIST ---------------- */
  useEffect(() => {
    async function loadOrgs() {
      const { data } = await supabase
        .from("government_oversight_view")
        .select("organization_name")
        .order("organization_name");

      setOrgs(data || []);
    }
    loadOrgs();
  }, []);

  /* ---------------- FETCH ANALYSIS DATA ---------------- */
  useEffect(() => {
    if (!selectedOrg) return;

    async function loadData() {
      let query = supabase
        .from("government_plantation_history_view")
        .select("*")
        .eq("organization_name", selectedOrg)
        .order("year", { ascending: true });

      if (selectedYear !== "ALL") {
        query = query.eq("year", selectedYear);
      }

      const { data } = await query;
      setRows(data || []);
    }

    loadData();
  }, [selectedOrg, selectedYear]);

  /* ---------------- KPI CALCULATIONS ---------------- */
  const totalEmission = rows.reduce(
    (sum, r) => sum + (r.yearly_emission || 0),
    0
  );

  const totalOffset = rows.reduce(
    (sum, r) => sum + (r.estimated_offset || 0),
    0
  );

  const netGap = totalEmission - totalOffset;

  /* ---------------- BAR CHART ---------------- */
  const chartData = {
    labels: rows.map((r) => r.year),
    datasets: [
      {
        label: "Emissions (kg CO₂)",
        data: rows.map((r) => r.yearly_emission),
        backgroundColor: "#ef4444",
      },
      {
        label: "Offsets (kg CO₂)",
        data: rows.map((r) => r.estimated_offset),
        backgroundColor: "#22c55e",
      },
    ],
  };

  return (
    <div className="p-8 space-y-8">

      {/* -------- CONTROLS -------- */}
      <div className="flex gap-4">
        <select
          className="border rounded-lg px-4 py-2"
          value={selectedOrg}
          onChange={(e) => setSelectedOrg(e.target.value)}
        >
          <option value="">Select Organization</option>
          {orgs.map((o, i) => (
            <option key={i} value={o.organization_name}>
              {o.organization_name}
            </option>
          ))}
        </select>

        <select
          className="border rounded-lg px-4 py-2"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          <option value="ALL">All Years</option>
          {[2021, 2022, 2023, 2024, 2025].map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      {/* -------- KPI CARDS -------- */}
      {selectedOrg && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <KPI title="Total Emissions" value={totalEmission.toFixed(2)} />
          <KPI title="Total Offset" value={totalOffset.toFixed(2)} />
          <KPI title="Net Gap" value={netGap.toFixed(2)} />
          <KPI
            title="Status"
            value={netGap <= 0 ? "Compliant" : "Non-Compliant"}
            status
          />
        </div>
      )}

      {/* -------- BAR CHART -------- */}
      {rows.length > 0 && (
        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="font-bold mb-4">
            Emission vs Offset Comparison
          </h3>
          <Bar data={chartData} />
        </div>
      )}

      {/* -------- TABLE -------- */}
      {rows.length > 0 && (
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-100 text-xs uppercase">
              <tr>
                <th className="p-4">Year</th>
                <th className="p-4">Emission</th>
                <th className="p-4">Offset</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className="border-t">
                  <td className="p-4">{r.year}</td>
                  <td className="p-4">{r.yearly_emission}</td>
                  <td className="p-4">{r.estimated_offset}</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        r.status === "Adequate"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}

/* ---------------- KPI COMPONENT ---------------- */

function KPI({ title, value, status }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      <p className="text-xs uppercase text-slate-400">{title}</p>
      <h2
        className={`text-2xl font-black ${
          status
            ? value === "Compliant"
              ? "text-green-600"
              : "text-red-600"
            : ""
        }`}
      >
        {value}
      </h2>
    </div>
  );
}
