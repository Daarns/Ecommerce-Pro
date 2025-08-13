"use client";
import { useState, useMemo } from "react";
import { users as dummyUsers } from "@/app/data/dummy-data";
import Link from "next/link";
import {
  Search,
  Filter,
  Users,
  UserCheck,
  UserX,
  RotateCcw,
  Eye,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Mail,
  Calendar,
  ShoppingBag,
  User,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Ban,
} from "lucide-react";

export default function CustomerList() {
  const [users, setUsers] = useState(dummyUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [viewMode, setViewMode] = useState("table"); // table or grid

  // Pagination
  const pageSize = 8;
  const [page, setPage] = useState(1);

  // Filter & search logic
  const filteredUsers = useMemo(() => {
    let result = users;
    if (search) {
      result = result.filter(
        (u) =>
          u.name.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (roleFilter !== "all") {
      result = result.filter((u) => u.role === roleFilter);
    }
    if (statusFilter !== "all") {
      result = result.filter((u) => u.status === statusFilter);
    }
    return result;
  }, [users, search, roleFilter, statusFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  const paginatedUsers = filteredUsers.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  // Stats
  const stats = useMemo(() => {
    return {
      total: users.length,
      active: users.filter(u => u.status === "active").length,
      pending: users.filter(u => u.status === "pending").length,
      banned: users.filter(u => u.status === "banned").length,
      sellers: users.filter(u => u.role === "seller").length,
      joinRequests: users.filter(u => u.joinRequest).length,
    };
  }, [users]);

  // Actions
  const handleApproveSeller = (userId) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, role: "seller", joinRequest: false } : u
      )
    );
  };

  const handleBanUser = (userId) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: "banned" } : u))
    );
  };

  const handleUnbanUser = (userId) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: "active" } : u))
    );
  };

  const handleResetPassword = (userId) => {
    alert(`Password reset link sent to user ${userId}`);
  };

  const getStatusColor = (status) => {
    const colors = {
      active: "bg-success/20 text-success border-success/20",
      pending: "bg-warning/20 text-warning border-warning/20",
      banned: "bg-error/20 text-error border-error/20",
    };
    return colors[status] || "bg-gray-100 text-gray-600";
  };

  const getRoleColor = (role) => {
    const colors = {
      admin: "bg-purple-100 text-purple-700 border-purple-200",
      seller: "bg-blue-100 text-blue-700 border-blue-200",
      buyer: "bg-green-100 text-green-700 border-green-200",
    };
    return colors[role] || "bg-gray-100 text-gray-600";
  };

  const getStatusIcon = (status) => {
    const icons = {
      active: CheckCircle,
      pending: Clock,
      banned: Ban,
    };
    return icons[status] || Clock;
  };

  const StatCard = ({ title, value, icon: Icon, color, change }) => (
    <div className="bg-surface border border-border rounded-xl p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-text-secondary text-sm font-medium">{title}</p>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold text-text-primary">{value}</p>
            {change && (
              <span className="text-xs text-success">+{change}%</span>
            )}
          </div>
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Customer Management</h1>
          <p className="text-text-secondary">Manage and monitor your customer base</p>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode(viewMode === "table" ? "grid" : "table")}
            className="px-4 py-2 bg-surface border border-border rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-elevated transition-colors"
          >
            {viewMode === "table" ? "Grid View" : "Table View"}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        <StatCard
          title="Total Customers"
          value={stats.total}
          icon={Users}
          color="bg-primary/10 text-primary"
        />
        <StatCard
          title="Active"
          value={stats.active}
          icon={CheckCircle}
          color="bg-success/10 text-success"
        />
        <StatCard
          title="Pending"
          value={stats.pending}
          icon={Clock}
          color="bg-warning/10 text-warning"
        />
        <StatCard
          title="Banned"
          value={stats.banned}
          icon={Ban}
          color="bg-error/10 text-error"
        />
        <StatCard
          title="Sellers"
          value={stats.sellers}
          icon={Shield}
          color="bg-info/10 text-info"
        />
        <StatCard
          title="Join Requests"
          value={stats.joinRequests}
          icon={AlertTriangle}
          color="bg-warning/10 text-warning"
        />
      </div>

      {/* Filters */}
      <div className="bg-surface border border-border rounded-2xl p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            />
          </div>
          
          <div className="flex gap-4">
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setPage(1);
              }}
              className="px-4 py-2.5 bg-background border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary min-w-32"
            >
              <option value="all">All Roles</option>
              <option value="buyer">Buyer</option>
              <option value="seller">Seller</option>
              <option value="admin">Admin</option>
            </select>
            
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="px-4 py-2.5 bg-background border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary min-w-32"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="banned">Banned</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-surface border border-border rounded-2xl overflow-hidden">
        {viewMode === "table" ? (
          /* Table View */
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-surface-elevated">
                <tr className="text-text-secondary border-b border-border">
                  <th className="py-4 px-6 text-left font-medium">Customer</th>
                  <th className="py-4 px-6 text-left font-medium">Role</th>
                  <th className="py-4 px-6 text-left font-medium">Status</th>
                  <th className="py-4 px-6 text-left font-medium">Orders</th>
                  <th className="py-4 px-6 text-left font-medium">Joined</th>
                  <th className="py-4 px-6 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((user) => {
                  const StatusIcon = getStatusIcon(user.status);
                  return (
                    <tr
                      key={user.id}
                      className="border-b border-border hover:bg-surface-elevated transition-colors"
                    >
                      <td className="py-4 px-6">
                        <Link href={`/admin/dashboard/customers/${user.id}`}>
                          <div className="flex items-center gap-3 hover:text-primary transition-colors">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                              <User className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <div className="font-medium text-text-primary">{user.name}</div>
                              <div className="text-sm text-text-secondary">{user.email}</div>
                            </div>
                          </div>
                        </Link>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${getRoleColor(user.role)}`}>
                          {user.role === "admin" && <Shield className="w-3 h-3" />}
                          {user.role}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(user.status)}`}>
                          <StatusIcon className="w-3 h-3" />
                          {user.status}
                        </span>
                        {user.joinRequest && (
                          <div className="text-xs text-warning mt-1">Seller request pending</div>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1 text-text-primary">
                          <ShoppingBag className="w-4 h-4" />
                          {user.orders}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1 text-text-secondary text-sm">
                          <Calendar className="w-4 h-4" />
                          {user.joinedAt}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <Link href={`/admin/dashboard/customers/${user.id}`}>
                            <button className="p-2 hover:bg-surface rounded-lg transition-colors">
                              <Eye className="w-4 h-4 text-text-muted" />
                            </button>
                          </Link>
                          
                          {user.joinRequest && user.role === "buyer" && (
                            <button
                              className="px-3 py-1.5 bg-primary text-white text-xs rounded-lg hover:bg-primary/90 transition-colors"
                              onClick={() => handleApproveSeller(user.id)}
                            >
                              <UserCheck className="w-3 h-3 inline mr-1" />
                              Approve
                            </button>
                          )}
                          
                          {user.status === "banned" ? (
                            <button
                              className="px-3 py-1.5 bg-success text-white text-xs rounded-lg hover:bg-success/90 transition-colors"
                              onClick={() => handleUnbanUser(user.id)}
                            >
                              <RotateCcw className="w-3 h-3 inline mr-1" />
                              Unban
                            </button>
                          ) : (
                            <button
                              className="px-3 py-1.5 bg-error text-white text-xs rounded-lg hover:bg-error/90 transition-colors"
                              onClick={() => handleBanUser(user.id)}
                            >
                              <UserX className="w-3 h-3 inline mr-1" />
                              Ban
                            </button>
                          )}
                          
                          <button
                            className="p-2 hover:bg-surface rounded-lg transition-colors"
                            onClick={() => handleResetPassword(user.id)}
                          >
                            <MoreVertical className="w-4 h-4 text-text-muted" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          /* Grid View */
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {paginatedUsers.map((user) => {
                const StatusIcon = getStatusIcon(user.status);
                return (
                  <div key={user.id} className="bg-background border border-border rounded-xl p-4 hover:shadow-sm transition-shadow">
                    <Link href={`/admin/dashboard/customers/${user.id}`}>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                          <User className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-text-primary truncate hover:text-primary transition-colors">
                            {user.name}
                          </div>
                          <div className="text-sm text-text-secondary truncate">{user.email}</div>
                        </div>
                      </div>
                    </Link>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getRoleColor(user.role)}`}>
                          {user.role}
                        </span>
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(user.status)}`}>
                          <StatusIcon className="w-3 h-3" />
                          {user.status}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-text-secondary">
                        <span className="flex items-center gap-1">
                          <ShoppingBag className="w-4 h-4" />
                          {user.orders} orders
                        </span>
                        <span>{user.joinedAt}</span>
                      </div>
                      
                      {user.joinRequest && (
                        <div className="text-xs text-warning bg-warning/10 px-2 py-1 rounded">
                          Seller request pending
                        </div>
                      )}
                      
                      <div className="flex gap-2 pt-2 border-t border-border">
                        {user.joinRequest && user.role === "buyer" && (
                          <button
                            className="flex-1 py-1.5 bg-primary text-white text-xs rounded-lg hover:bg-primary/90 transition-colors"
                            onClick={() => handleApproveSeller(user.id)}
                          >
                            Approve
                          </button>
                        )}
                        <button
                          className={`flex-1 py-1.5 text-white text-xs rounded-lg transition-colors ${
                            user.status === "banned" 
                              ? "bg-success hover:bg-success/90" 
                              : "bg-error hover:bg-error/90"
                          }`}
                          onClick={() => user.status === "banned" ? handleUnbanUser(user.id) : handleBanUser(user.id)}
                        >
                          {user.status === "banned" ? "Unban" : "Ban"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="text-sm text-text-secondary">
          Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, filteredUsers.length)} of {filteredUsers.length} customers
        </div>
        
        <div className="flex items-center gap-2">
          <button
            className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg bg-background text-text-secondary hover:bg-surface transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                    page === pageNum
                      ? "bg-primary text-white"
                      : "text-text-secondary hover:bg-surface"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            {totalPages > 5 && (
              <span className="text-text-muted px-2">...</span>
            )}
          </div>
          
          <button
            className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg bg-background text-text-secondary hover:bg-surface transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || totalPages === 0}
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}