"use client";
import { useState, useMemo } from "react";
import { useOrders } from "@/app/contexts/OrderContext"; // Pastikan context ini tersedia
import { formatPrice } from "@/app/lib/utils";
import Link from "next/link";

const statusOptions = [
  "processing",
  "confirmed",
  "shipped",
  "delivered",
  "cancelled",
];

const statusColors = {
  processing: "bg-warning text-warning",
  confirmed: "bg-info text-info",
  shipped: "bg-primary text-primary",
  delivered: "bg-success text-white",
  cancelled: "bg-error text-white",
};

export default function OrderList() {
  const { orders, updateOrderStatus } = useOrders();

  // Optional: search/filter state
  const [search, setSearch] = useState("");
  const filteredOrders = useMemo(() => {
    if (!search) return orders;
    return orders.filter(
      (order) =>
        order.id.toLowerCase().includes(search.toLowerCase()) ||
        (order.shippingInfo?.firstName + " " + order.shippingInfo?.lastName)
          .toLowerCase()
          .includes(search.toLowerCase())
    );
  }, [orders, search]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-8">Order Management</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by Order ID or Customer"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="px-4 py-2 border border-border rounded-lg bg-background"
        />
      </div>
      <div className="bg-surface border border-border rounded-2xl overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-text-secondary border-b border-border">
              <th className="py-3 px-4">Order ID</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Total</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Update Status</th>
              <th className="py-3 px-4"></th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id} className="border-b border-border hover:bg-surface-elevated transition">
                <td className="py-3 px-4 font-mono">{order.id}</td>
                <td className="py-3 px-4">
                  {order.shippingInfo
                    ? `${order.shippingInfo.firstName} ${order.shippingInfo.lastName}`
                    : "-"}
                </td>
                <td className="py-3 px-4">
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString("id-ID")
                    : "-"}
                </td>
                <td className="py-3 px-4">{formatPrice(order.totalAmount)}</td>
                <td className="py-3 px-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusColors[order.status] || "bg-background text-text-secondary"}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <select
                    value={order.status}
                    onChange={e => updateOrderStatus(order.id, e.target.value)}
                    className="border border-border rounded-lg px-2 py-1 text-sm"
                  >
                    {statusOptions.map(opt => (
                      <option key={opt} value={opt}>
                        {opt.charAt(0).toUpperCase() + opt.slice(1)}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="py-3 px-4">
                  <Link
                    href={`/admin/dashboard/orders/${order.id}`}
                    className="text-primary hover:underline"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}