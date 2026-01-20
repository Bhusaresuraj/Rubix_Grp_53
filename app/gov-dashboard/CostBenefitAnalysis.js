"use client";

import { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Calculator, TrendingUp, DollarSign, Clock } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function CostBenefitAnalysis() {
  // Default values based on the user's example
  const [inputs, setInputs] = useState({
    planName: "Solar Installation Phase 1",
    initialCost: 5000000, // 50 Lakhs
    annualMaintenance: 50000,
    annualSavings: 1200000, // 12 Lakhs
    carbonCreditsIncome: 500000, // 5 Lakhs
  });

  const [metrics, setMetrics] = useState({
    netAnnualBenefit: 0,
    paybackPeriod: 0,
    roi: 0,
  });

  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    calculateMetrics();
  }, [inputs]);

  const calculateMetrics = () => {
    const netAnnualBenefit =
      Number(inputs.annualSavings) +
      Number(inputs.carbonCreditsIncome) -
      Number(inputs.annualMaintenance);

    const paybackPeriod =
      netAnnualBenefit > 0
        ? Number(inputs.initialCost) / netAnnualBenefit
        : 0;

    const roi =
      Number(inputs.initialCost) > 0
        ? (netAnnualBenefit / Number(inputs.initialCost)) * 100
        : 0;

    setMetrics({
      netAnnualBenefit,
      paybackPeriod,
      roi,
    });

    generateChartData(Number(inputs.initialCost), netAnnualBenefit);
  };

  const generateChartData = (initialCost, annualBenefit) => {
    const years = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    
    // Cumulative Cashflow: Starts at -InitialCost, adds AnnualBenefit each year
    const dataPoints = years.map(year => -initialCost + (annualBenefit * year));

    setChartData({
      labels: years.map(y => `Year ${y}`),
      datasets: [
        {
          label: "Net Cumulative Cashflow (₹)",
          data: dataPoints,
          borderColor: "#10b981", // Emerald 500
          backgroundColor: "rgba(16, 185, 129, 0.1)",
          fill: true,
          tension: 0.4,
          pointBackgroundColor: dataPoints.map(v => v >= 0 ? "#059669" : "#ef4444"), // Green if profit, Red if debt
        },
      ],
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: name === "planName" ? value : Number(value),
    }));
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
          <Calculator className="text-emerald-600" size={36} />
          Cost-Benefit Analysis
        </h1>
        <p className="text-slate-500 font-medium">
          Evaluate financial viability of mitigation plans (ROI, Payback, Net Benefit)
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* INPUT FORM */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 lg:col-span-1 h-fit">
          <h3 className="font-bold text-lg text-slate-800 mb-6 flex items-center gap-2">
            <span className="bg-slate-100 p-2 rounded-lg"><DollarSign size={18}/></span>
            Project Parameters
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Plan Name</label>
              <input
                type="text"
                name="planName"
                value={inputs.planName}
                onChange={handleInputChange}
                className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 font-semibold text-slate-700 focus:outline-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Initial Cost (₹)</label>
              <input
                type="number"
                name="initialCost"
                value={inputs.initialCost}
                onChange={handleInputChange}
                className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono font-bold text-slate-700 focus:outline-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Annual Savings (₹)</label>
                <input
                  type="number"
                  name="annualSavings"
                  value={inputs.annualSavings}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono font-bold text-green-600 focus:outline-emerald-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Carbon Credits (₹/yr)</label>
                <input
                  type="number"
                  name="carbonCreditsIncome"
                  value={inputs.carbonCreditsIncome}
                  onChange={handleInputChange}
                  className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono font-bold text-green-600 focus:outline-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Maintenance Cost (₹/yr)</label>
              <input
                type="number"
                name="annualMaintenance"
                value={inputs.annualMaintenance}
                onChange={handleInputChange}
                className="w-full p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono font-bold text-red-500 focus:outline-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* RESULTS & CHART */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* KPI CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-2xl">
              <div className="flex items-center gap-2 mb-2 text-emerald-700">
                <TrendingUp size={20} />
                <span className="text-xs font-bold uppercase">Net Annual Benefit</span>
              </div>
              <p className="text-2xl font-black text-emerald-800">
                ₹ {metrics.netAnnualBenefit.toLocaleString()}
              </p>
              <p className="text-xs text-emerald-600 mt-1">Total yearly inflow</p>
            </div>

            <div className="bg-blue-50 border border-blue-100 p-5 rounded-2xl">
              <div className="flex items-center gap-2 mb-2 text-blue-700">
                <Clock size={20} />
                <span className="text-xs font-bold uppercase">Payback Period</span>
              </div>
              <p className="text-2xl font-black text-blue-800">
                {metrics.paybackPeriod === Infinity ? "Never" : metrics.paybackPeriod.toFixed(1)} <span className="text-lg">Years</span>
              </p>
              <p className="text-xs text-blue-600 mt-1">Time to break even</p>
            </div>

            <div className="bg-purple-50 border border-purple-100 p-5 rounded-2xl">
              <div className="flex items-center gap-2 mb-2 text-purple-700">
                <DollarSign size={20} />
                <span className="text-xs font-bold uppercase">ROI (Annual)</span>
              </div>
              <p className="text-2xl font-black text-purple-800">
                {metrics.roi.toFixed(1)}%
              </p>
              <p className="text-xs text-purple-600 mt-1">Return on Investment</p>
            </div>
          </div>

          {/* CHART */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-700 mb-4">10-Year Financial Projection</h3>
            <div className="h-64 w-full">
              {chartData && (
                <Line 
                  data={chartData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        grid: { color: "#f1f5f9" },
                        ticks: { callback: (value) => '₹' + (value/100000).toFixed(1) + 'L' }
                      },
                      x: { grid: { display: false } }
                    },
                    plugins: {
                      legend: { display: false },
                      tooltip: { 
                        callbacks: {
                          label: (ctx) => ` Net Cashflow: ₹${Number(ctx.raw).toLocaleString()}`
                        }
                      }
                    }
                  }} 
                />
              )}
            </div>
            <p className="text-center text-xs text-slate-400 mt-4">
              *Positive values indicate profit. Negative values indicate unrecovered investment.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}