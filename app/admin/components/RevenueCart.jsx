"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// Dummy data 1 tahun
const data = [
  { month: "Jan", revenue: 12000000, expense: -4000000 },
  { month: "Feb", revenue: 15000000, expense: -6000000 },
  { month: "Mar", revenue: 9000000, expense: -3000000 },
  { month: "Apr", revenue: 18000000, expense: -8000000 },
  { month: "May", revenue: 16000000, expense: -7000000 },
  { month: "Jun", revenue: 20000000, expense: -9000000 },
  { month: "Jul", revenue: 17000000, expense: -5000000 },
  { month: "Aug", revenue: 22000000, expense: -10000000 },
  { month: "Sep", revenue: 14000000, expense: -4000000 },
  { month: "Oct", revenue: 19000000, expense: -7000000 },
  { month: "Nov", revenue: 21000000, expense: -8000000 },
  { month: "Dec", revenue: 25000000, expense: -12000000 },
];

// Format angka besar (K, M, B) dengan support minus
function formatLargeNumber(num) {
  const absNum = Math.abs(num);
  let formatted = "";
  if (absNum >= 1_000_000_000) formatted = (absNum / 1_000_000_000).toFixed(1) + "B";
  else if (absNum >= 1_000_000) formatted = (absNum / 1_000_000).toFixed(1) + "M";
  else if (absNum >= 1_000) formatted = (absNum / 1_000).toFixed(1) + "K";
  else formatted = absNum.toString();
  return (num < 0 ? "-Rp " : "Rp ") + formatted;
}

// Format rupiah untuk tooltip
function rupiah(value) {
  return "Rp " + value.toLocaleString("id-ID");
}

// Custom Tooltip: Revenue di atas Expense
function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    // Revenue selalu di atas
    const sorted = [...payload].sort((a, b) => {
      if (a.dataKey === "revenue") return -1;
      if (b.dataKey === "revenue") return 1;
      return 0;
    });
    return (
      <div className="bg-white rounded-lg shadow-lg p-3 border border-border min-w-[160px]">
        <div className="font-semibold text-text-primary mb-1">{label}</div>
        {sorted.map((entry) => (
          <div
            key={entry.dataKey}
            className="flex justify-between text-sm"
            style={{ color: entry.color }}
          >
            <span>{entry.dataKey === "revenue" ? "Revenue" : "Expense"}</span>
            <span>
              {rupiah(entry.value)}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

export default function RevenueChart() {
  return (
    <div
      className="w-full h-80 select-none"
      tabIndex={-1}
      style={{ outline: "none" }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 16, right: 24, left: 0, bottom: 8 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="month" tick={{ fill: "#6b7280", fontSize: 12 }} />
          <YAxis
            tickFormatter={formatLargeNumber}
            tick={{ fill: "#6b7280", fontSize: 12 }}
            domain={[-15000000, 25000000]}
            ticks={[
              -15000000, -10000000, -5000000, 0, 5000000, 10000000, 15000000,
              20000000, 25000000,
            ]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar
            dataKey="revenue"
            name="Revenue"
            fill="#4f46e5"
            radius={[4, 4, 0, 0]}
            barSize={24}
          />
          <Bar
            dataKey="expense"
            name="Expense"
            fill="#ef4444"
            radius={[0, 0, 4, 4]}
            barSize={24}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}