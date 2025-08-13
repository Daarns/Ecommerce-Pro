"use client";
import { useState } from "react";
import { users } from "@/app/data/dummy-data";
import {
  User,
  Mail,
  Calendar,
  ShoppingBag,
  Activity,
  ArrowLeft,
  Edit3,
  MoreVertical,
  Shield,
  MapPin,
  Phone,
  CreditCard,
  Package,
  TrendingUp,
  Clock
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function CustomerDetail({ userId }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const user = users.find((u) => u.id === userId);

  if (!user) {
    return (
      <div className="text-center py-16">
        <User className="w-16 h-16 text-text-muted mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-text-primary mb-4">
          Customer Not Found
        </h1>
        <p className="text-text-secondary mb-8">
          The customer you're looking for doesn't exist or has been removed.
        </p>
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Customers
        </button>
      </div>
    );
  }

  // Mock additional data for demonstration
  const customerStats = {
    totalOrders: user.orders || 0,
    totalSpent: user.orders * 150 + Math.random() * 500, // Mock calculation
    avgOrderValue: user.orders > 0 ? (user.orders * 150 + Math.random() * 500) / user.orders : 0,
    lastOrderDate: "2024-01-15",
  };

  const mockOrderHistory = Array.from({ length: Math.min(user.orders || 0, 5) }).map((_, i) => ({
    id: `ORD-${1000 + i}`,
    date: new Date(Date.now() - i * 86400000 * 7).toISOString().split('T')[0],
    status: ["delivered", "shipped", "processing"][Math.floor(Math.random() * 3)],
    total: Math.floor(Math.random() * 300) + 50,
    items: Math.floor(Math.random() * 5) + 1
  }));

  const getStatusColor = (status) => {
    const colors = {
      active: "bg-success/20 text-success border-success/20",
      inactive: "bg-error/20 text-error border-error/20",
      pending: "bg-warning/20 text-warning border-warning/20",
      delivered: "bg-success/20 text-success",
      shipped: "bg-primary/20 text-primary",
      processing: "bg-warning/20 text-warning"
    };
    return colors[status] || "bg-gray-100 text-gray-600";
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount);
  };

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "orders", label: "Order History" },
    { id: "activity", label: "Activity" }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-surface rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-text-secondary" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Customer Details</h1>
            <p className="text-text-secondary">Manage customer information and history</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-surface rounded-lg transition-colors">
            <Edit3 className="w-4 h-4 text-text-secondary" />
          </button>
          <button className="p-2 hover:bg-surface rounded-lg transition-colors">
            <MoreVertical className="w-4 h-4 text-text-secondary" />
          </button>
        </div>
      </div>

      {/* Customer Header Card */}
      <div className="bg-surface border border-border rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
            <User className="w-8 h-8 text-primary" />
          </div>
          
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-text-primary mb-1">{user.name}</h2>
                <div className="flex items-center gap-4 text-sm text-text-secondary">
                  <span className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    {user.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Joined {user.joinedAt}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(user.status)}`}>
                  <Activity className="w-3 h-3" />
                  {user.status}
                </span>
                <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(user.role === 'admin' ? 'shipped' : 'delivered')}`}>
                  <Shield className="w-3 h-3" />
                  {user.role}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-surface border border-border rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm">Total Orders</p>
              <p className="text-2xl font-bold text-text-primary">{customerStats.totalOrders}</p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm">Total Spent</p>
              <p className="text-2xl font-bold text-text-primary">{formatCurrency(customerStats.totalSpent)}</p>
            </div>
            <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-success" />
            </div>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm">Avg Order</p>
              <p className="text-2xl font-bold text-text-primary">{formatCurrency(customerStats.avgOrderValue)}</p>
            </div>
            <div className="w-12 h-12 bg-info/10 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-info" />
            </div>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-secondary text-sm">Last Order</p>
              <p className="text-2xl font-bold text-text-primary">{customerStats.lastOrderDate ? new Date(customerStats.lastOrderDate).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' }) : 'Never'}</p>
            </div>
            <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-warning" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-surface border border-border rounded-2xl overflow-hidden">
        <div className="border-b border-border">
          <nav className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-primary text-primary bg-primary/5"
                    : "border-transparent text-text-secondary hover:text-text-primary hover:bg-surface-elevated"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-text-primary">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-text-muted" />
                    <span className="text-text-secondary">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-text-muted" />
                    <span className="text-text-secondary">+62 812-3456-7890</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-text-muted" />
                    <span className="text-text-secondary">Jakarta, Indonesia</span>
                  </div>
                </div>
              </div>

              {/* Account Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-text-primary">Account Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Customer ID:</span>
                    <span className="font-mono text-text-primary">{user.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Account Type:</span>
                    <span className="text-text-primary capitalize">{user.role}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Registration Date:</span>
                    <span className="text-text-primary">{user.joinedAt}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "orders" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-text-primary">Order History</h3>
                <span className="text-sm text-text-secondary">{mockOrderHistory.length} orders</span>
              </div>
              
              {mockOrderHistory.length > 0 ? (
                <div className="space-y-3">
                  {mockOrderHistory.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-background rounded-lg border border-border hover:bg-surface-elevated transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Package className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium text-text-primary">{order.id}</div>
                          <div className="text-sm text-text-secondary">{order.items} items • {order.date}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                        <span className="font-semibold text-text-primary">{formatCurrency(order.total)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-text-muted">
                  <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No orders found</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "activity" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-text-primary">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-4 p-3 bg-background rounded-lg">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-text-primary text-sm">Account created</p>
                    <p className="text-text-muted text-xs">{user.joinedAt}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 bg-background rounded-lg">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-text-primary text-sm">Profile updated</p>
                    <p className="text-text-muted text-xs">2 days ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 bg-background rounded-lg">
                  <div className="w-2 h-2 bg-warning rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-text-primary text-sm">Last login</p>
                    <p className="text-text-muted text-xs">1 week ago</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}