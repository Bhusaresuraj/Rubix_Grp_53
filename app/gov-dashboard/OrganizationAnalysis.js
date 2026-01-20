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

/* ================= MOCK DATA (FALLBACK) ================= */
const MOCK_DATA = [
  {
    year: 2021,
    yearly_emission: 1200,
    estimated_offset: 300,
    status: "Inadequate",
  },
  {
    year: 2022,
    yearly_emission: 950,
    estimated_offset: 600,
    status: "Inadequate",
  },
  {
    year: 2023,
    yearly_emission: 700,
    estimated_offset: 850,
    status: "Adequate",
  },
  {
    year: 2024,
    yearly_emission: 500,
    estimated_offset: 900,
    status: "Adequate",
  },
];

export default function OrganizationAnalysis() {
  const supabase = createClient();

  const [orgs, setOrgs] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState("");
  const [selectedYear, setSelectedYear] = useState("ALL");
  const [rows, setRows] = useState([]);
  const [usingMock, setUsingMock] = useState(false);

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

  /* ---------------- FETCH DATA OR FALLBACK ---------------- */
  useEffect(() => {
    if (!selectedOrg) return;

    async function loadData() {
      try {
        let query = supabase
          .from("government_plantation_history_view")
          .select("*")
          .eq("organization_name", selectedOrg)
          .order("year", { ascending: true });

        if (selectedYear !== "ALL") {
          query = query.eq("year", selectedYear);
        }

        const { data, error } = await query;

        if (error || !data || data.length === 0) {
          setUsingMock(true);
          setRows(
            selectedYear === "ALL"
              ? MOCK_DATA
              : MOCK_DATA.filter((r) => r.year === Number(selectedYear))
          );
        } else {
          setUsingMock(false);
          setRows(data);
        }
      } catch {
        setUsingMock(true);
        setRows(MOCK_DATA);
      }
    }

    loadData();
  }, [selectedOrg, selectedYear]);

  /* ---------------- METRICS ---------------- */
  const totalEmission = rows.reduce(
    (sum, r) => sum + r.yearly_emission,
    0
  );

  const totalOffset = rows.reduce(
    (sum, r) => sum + r.estimated_offset,
    0
  );

  const complianceRatio =
    totalEmission === 0
      ? 100
      : Math.min((totalOffset / totalEmission) * 100, 100);

  /* ---------------- CHART ---------------- */
  const chartData = {
    labels: rows.map((r) => r.year),
    datasets: [
      {
        label: "Emissions",
        data: rows.map((r) => r.yearly_emission),
        backgroundColor: "#dc2626",
      },
      {
        label: "Offsets",
        data: rows.map((r) => r.estimated_offset),
        backgroundColor: "#16a34a",
      },
    ],
  };

  return (
    <div className="space-y-10">

      {/* ===== FILTERS ===== */}
      <div className="flex gap-4">
        <select
          className="bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-800"
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
          className="bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-800"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
        >
          <option value="ALL">All Years</option>
          {[2021, 2022, 2023, 2024].map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      {/* ===== NOTICE ===== */}
      {usingMock && (
        <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 px-4 py-3 rounded-xl text-sm font-semibold">
          Showing simulated data (regulatory view integration pending)
        </div>
      )}

      {/* ===== VISUAL KPIs ===== */}
      {selectedOrg && (
        <div className="bg-white rounded-3xl shadow p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <MetricBar title="Total Emissions" value={totalEmission} color="bg-red-500" />
          <MetricBar title="Total Offset" value={totalOffset} color="bg-green-500" />
          <ComplianceRing percentage={complianceRatio} />
        </div>
      )}

      {/* ===== BAR CHART ===== */}
      {rows.length > 0 && (
        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="font-black text-slate-800 mb-4">
            Emission vs Offset (Year-wise)
          </h3>
          <Bar data={chartData} />
        </div>
      )}
    </div>
  );
}

/* ================= VISUAL COMPONENTS ================= */

function MetricBar({ title, value, color }) {
  return (
    <div>
      <p className="text-sm font-bold text-slate-500 mb-2">{title}</p>
      <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden">
        <div className={`${color} h-full`} style={{ width: "100%" }} />
      </div>
      <p className="mt-2 text-slate-800 font-black">
        {value.toLocaleString()} kg CO₂
      </p>
    </div>
  );
}

function ComplianceRing({ percentage }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-32 rounded-full border-[10px] border-slate-200">
        <div
          className={`absolute inset-0 rounded-full border-[10px] ${
            percentage >= 100 ? "border-green-500" : "border-yellow-500"
          }`}
          style={{ clipPath: `inset(${100 - percentage}% 0 0 0)` }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-black text-slate-800">
            {percentage.toFixed(0)}%
          </span>
        </div>
      </div>
      <p className="mt-3 text-sm font-bold text-slate-600">
        Compliance Ratio
      </p>
    </div>
  );
}
