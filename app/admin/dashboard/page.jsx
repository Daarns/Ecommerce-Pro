"use client";
import { useState } from "react";
import { BarChart2, ShoppingBag, Users, TrendingUp, Repeat, Trash2, CheckCircle2, Filter, Search } from "lucide-react";
import RevenueChart from "../components/RevenueCart";

// Helper untuk pemendekan angka rupiah
function formatShortRupiah(value) {
  const num = Number(String(value).replace(/[^0-9]/g, ""));
  if (isNaN(num)) return value;
  if (num >= 1_000_000_000) return `Rp ${(num / 1_000_000_000).toFixed(1)}M`;
  if (num >= 1_000_000) return `Rp ${(num / 1_000_000).toFixed(1)}JT`;
  if (num >= 1_000) return `Rp ${(num / 1_000).toFixed(1)}Rb`;
  return `Rp ${num}`;
}

// Dummy data
const stats = {
  sales: "Rp 120.000.000",
  orders: 320,
  customers: 180,
  conversionRate: "4.2%",
  retention: "68%",
};

const recentOrders = [
  {
    id: "#ORD-00123",
    customer: "John Doe",
    date: "2025-08-10",
    total: "Rp 2.500.000",
    status: "Processing",
  },
  {
    id: "#ORD-00122",
    customer: "Jane Smith",
    date: "2025-08-09",
    total: "Rp 1.200.000",
    status: "Delivered",
  },
  {
    id: "#ORD-00121",
    customer: "Michael Lee",
    date: "2025-08-08",
    total: "Rp 3.100.000",
    status: "Processing",
  },
];

const bestSellers = [
  {
    name: "Nike Dri-FIT T-Shirt",
    sold: 120,
    revenue: "Rp 54.000.000",
  },
  {
    name: "iPhone 15 Pro Max",
    sold: 40,
    revenue: "Rp 80.000.000",
  },
  {
    name: "Nintendo Switch OLED",
    sold: 30,
    revenue: "Rp 12.600.000",
  },
];

const statusColors = {
  Processing: "bg-blue-100 text-blue-800 border border-blue-200",
  Delivered: "bg-green-100 text-green-800 border border-green-200",
  Cancelled: "bg-red-100 text-red-800 border border-red-200",
};

function StatCard({ title, value, icon, short, trend }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">
            {short ? formatShortRupiah(value) : value}
          </div>
          <div className="text-sm text-slate-600 font-medium">{title}</div>
          {trend && (
            <div className={`text-xs mt-2 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend > 0 ? '↗' : '↘'} {Math.abs(trend)}% from last month
            </div>
          )}
        </div>
        <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-slate-100 text-slate-700">
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Bulk action handlers
  const handleSelectOrder = (orderId) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleSelectAll = () => {
    if (selectedOrders.length === recentOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(recentOrders.map((o) => o.id));
    }
  };

  const handleBulkDelete = () => {
    alert(`Deleted orders: ${selectedOrders.join(", ")}`);
    setSelectedOrders([]);
  };

  const handleBulkStatus = (status) => {
    alert(`Changed status to "${status}" for: ${selectedOrders.join(", ")}`);
    setSelectedOrders([]);
  };

  return (
    <div className="w-full bg-slate-50 p-4 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-2">
              Dashboard
            </h1>
            <p className="text-slate-600">Welcome back! Here's what's happening today.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
              <Filter className="w-4 h-4" />
              <span className="text-sm font-medium">Filter</span>
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium">
              Export Data
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <StatCard title="Total Sales" value={stats.sales} icon={<BarChart2 />} short trend={12.5} />
        <StatCard title="Orders" value={stats.orders} icon={<ShoppingBag />} trend={8.2} />
        <StatCard title="Customers" value={stats.customers} icon={<Users />} trend={-3.1} />
        <StatCard title="Conversion Rate" value={stats.conversionRate} icon={<TrendingUp />} trend={5.7} />
        <StatCard title="Retention" value={stats.retention} icon={<Repeat />} trend={2.3} />
      </div>

      {/* Revenue Chart */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Revenue Analytics</h2>
            <p className="text-slate-600 text-sm">Track your business performance</p>
          </div>
          <select className="px-3 py-2 border border-slate-200 rounded-lg text-sm">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 3 months</option>
          </select>
        </div>
        <div className="h-80">
          <RevenueChart />
        </div>
      </div>

      {/* Orders and Best Sellers Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Recent Orders - Takes 2 columns on xl screens */}
        <div className="xl:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <div className="p-6 border-b border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Recent Orders</h2>
                <p className="text-slate-600 text-sm">Manage your latest orders</p>
              </div>
              
              {/* Actions */}
              <div className="flex items-center gap-3">
                {selectedOrders.length > 0 && (
                  <div className="flex gap-2">
                    <button
                      className="flex items-center gap-1 px-3 py-2 rounded-lg bg-red-600 text-white text-sm hover:bg-red-700 transition-colors"
                      onClick={handleBulkDelete}
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete ({selectedOrders.length})
                    </button>
                    <button
                      className="flex items-center gap-1 px-3 py-2 rounded-lg bg-green-600 text-white text-sm hover:bg-green-700 transition-colors"
                      onClick={() => handleBulkStatus("Delivered")}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Mark Delivered
                    </button>
                  </div>
                )}
                
                {/* Search */}
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left p-4">
                    <input
                      type="checkbox"
                      checked={selectedOrders.length === recentOrders.length}
                      onChange={handleSelectAll}
                      className="rounded border-slate-300"
                    />
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-slate-700">Order ID</th>
                  <th className="text-left p-4 text-sm font-semibold text-slate-700">Customer</th>
                  <th className="text-left p-4 text-sm font-semibold text-slate-700">Date</th>
                  <th className="text-left p-4 text-sm font-semibold text-slate-700">Total</th>
                  <th className="text-left p-4 text-sm font-semibold text-slate-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order, index) => (
                  <tr
                    key={order.id}
                    className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${
                      index === recentOrders.length - 1 ? 'border-b-0' : ''
                    }`}
                  >
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedOrders.includes(order.id)}
                        onChange={() => handleSelectOrder(order.id)}
                        className="rounded border-slate-300"
                      />
                    </td>
                    <td className="p-4 font-mono text-sm font-medium text-slate-900">{order.id}</td>
                    <td className="p-4 text-sm text-slate-900">{order.customer}</td>
                    <td className="p-4 text-sm text-slate-600">{order.date}</td>
                    <td className="p-4 text-sm font-semibold text-slate-900">{order.total}</td>
                    <td className="p-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status] || "bg-slate-100 text-slate-800"}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Best Sellers */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-900 mb-1">Best Sellers</h2>
            <p className="text-slate-600 text-sm">Top performing products</p>
          </div>
          
          <div className="space-y-4">
            {bestSellers.map((product, index) => (
              <div key={product.name} className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-slate-700">
                  #{index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-slate-900 truncate">{product.name}</div>
                  <div className="text-sm text-slate-600">{product.sold} sold</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-slate-900">{product.revenue}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
