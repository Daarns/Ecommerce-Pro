"use client";
import {BarChart2, ShoppingBag, Users} from "lucide-react";
import RevenueChart from "../components/RevenueCart";

function StatCard({title, value, icon}) {
  return (
    <div className="bg-surface border border-border rounded-2xl p-6 flex items-center gap-4 shadow-sm">
      <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-primary/10 text-primary text-2xl">
        {icon}
      </div>
      <div>
        <div className="text-2xl font-bold text-text-primary">{value}</div>
        <div className="text-text-secondary">{title}</div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  // Dummy data
  const stats = {
    sales: "Rp 120.000.000",
    orders: 320,
    customers: 180,
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-text-primary">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Sales"
          value={stats.sales}
          icon={<BarChart2 />}
        />
        <StatCard title="Orders" value={stats.orders} icon={<ShoppingBag />} />
        <StatCard title="Customers" value={stats.customers} icon={<Users />} />
      </div>

      {/* Revenue Chart Placeholder */}
      <div className="bg-surface border border-border rounded-2xl p-6 mb-8">
        <div className="font-semibold text-text-primary mb-2">
          Revenue Overview
        </div>
        <div
          className="h-72 min-h-[350px] flex items-center justify-center text-text-secondary">
          <RevenueChart />
        </div>
      </div>

      {/* Recent Orders Table Placeholder */}
      <div className="bg-surface border border-border rounded-2xl p-6">
        <div className="font-semibold text-text-primary mb-4">
          Recent Orders
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="text-text-secondary border-b border-border">
              <th className="py-2">Order ID</th>
              <th className="py-2">Customer</th>
              <th className="py-2">Date</th>
              <th className="py-2">Total</th>
              <th className="py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border">
              <td className="py-2">#ORD-00123</td>
              <td className="py-2">John Doe</td>
              <td className="py-2">2025-08-10</td>
              <td className="py-2">Rp 2.500.000</td>
              <td className="py-2">
                <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                  Processing
                </span>
              </td>
            </tr>
            <tr>
              <td className="py-2">#ORD-00122</td>
              <td className="py-2">Jane Smith</td>
              <td className="py-2">2025-08-09</td>
              <td className="py-2">Rp 1.200.000</td>
              <td className="py-2">
                <span className="inline-block px-3 py-1 rounded-full bg-success text-white text-xs font-semibold">
                  Delivered
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
