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
  ChevronDown,
  Key,
  Trash2,
} from "lucide-react";

// Custom Dropdown for Actions
const ActionsDropdown = ({ user, onApproveSeller, onBanUser, onUnbanUser, onResetPassword }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
      >
        <MoreVertical className="w-4 h-4 text-slate-600" />
      </button>
      
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 z-20 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden min-w-[160px]">
            <Link
              href={`/admin/dashboard/customers/${user.id}`}
              className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 transition-colors text-sm"
              onClick={() => setIsOpen(false)}
            >
              <Eye className="w-4 h-4 text-slate-600" />
              View Details
            </Link>
            
            <button
              onClick={() => {
                onResetPassword(user.id);
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-50 transition-colors text-sm text-left"
            >
              <Key className="w-4 h-4 text-slate-600" />
              Reset Password
            </button>
            
            {user.joinRequest && user.role === "buyer" && (
              <button
                onClick={() => {
                  onApproveSeller(user.id);
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-blue-50 transition-colors text-sm text-left text-blue-600"
              >
                <UserCheck className="w-4 h-4" />
                Approve as Seller
              </button>
            )}
            
            <div className="border-t border-slate-100" />
            
            {user.status === "banned" ? (
              <button
                onClick={() => {
                  onUnbanUser(user.id);
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-green-50 transition-colors text-sm text-left text-green-600"
              >
                <RotateCcw className="w-4 h-4" />
                Unban User
              </button>
            ) : (
              <button
                onClick={() => {
                  onBanUser(user.id);
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-red-50 transition-colors text-sm text-left text-red-600"
              >
                <UserX className="w-4 h-4" />
                Ban User
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

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
      active: "bg-green-100 text-green-800 border-green-200",
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      banned: "bg-red-100 text-red-800 border-red-200",
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
    <div className="bg-white border border-slate-200 rounded-xl p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-600 text-sm font-medium">{title}</p>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-bold text-slate-900">{value}</p>
            {change && (
              <span className="text-xs text-green-600">+{change}%</span>
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
    <div className="w-full bg-slate-50 p-4 lg:p-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-2">Customer Management</h1>
            <p className="text-slate-600">Manage and monitor your customer base</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setViewMode(viewMode === "table" ? "grid" : "table")}
              className="px-4 py-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
            >
              {viewMode === "table" ? "Grid View" : "Table View"}
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium">
              Export Data
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          <StatCard
            title="Total Customers"
            value={stats.total}
            icon={Users}
            color="bg-blue-100 text-blue-600"
          />
          <StatCard
            title="Active"
            value={stats.active}
            icon={CheckCircle}
            color="bg-green-100 text-green-600"
          />
          <StatCard
            title="Pending"
            value={stats.pending}
            icon={Clock}
            color="bg-yellow-100 text-yellow-600"
          />
          <StatCard
            title="Banned"
            value={stats.banned}
            icon={Ban}
            color="bg-red-100 text-red-600"
          />
          <StatCard
            title="Sellers"
            value={stats.sellers}
            icon={Shield}
            color="bg-purple-100 text-purple-600"
          />
          <StatCard
            title="Join Requests"
            value={stats.joinRequests}
            icon={AlertTriangle}
            color="bg-orange-100 text-orange-600"
          />
        </div>

        {/* Filters */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex gap-4">
              <select
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value);
                  setPage(1);
                }}
                className="px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-32"
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
                className="px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-32"
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
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          {viewMode === "table" ? (
            /* Table View */
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr className="text-slate-700 border-b border-slate-200">
                    <th className="py-4 px-6 text-left font-semibold">Customer</th>
                    <th className="py-4 px-6 text-left font-semibold">Role</th>
                    <th className="py-4 px-6 text-left font-semibold">Status</th>
                    <th className="py-4 px-6 text-left font-semibold">Orders</th>
                    <th className="py-4 px-6 text-left font-semibold">Joined</th>
                    <th className="py-4 px-6 text-left font-semibold w-20">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsers.map((user, index) => {
                    const StatusIcon = getStatusIcon(user.status);
                    return (
                      <tr
                        key={user.id}
                        className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${
                          index === paginatedUsers.length - 1 ? 'border-b-0' : ''
                        }`}
                      >
                        <td className="py-4 px-6">
                          <Link href={`/admin/dashboard/customers/${user.id}`}>
                            <div className="flex items-center gap-3 hover:text-blue-600 transition-colors">
                              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <User className="w-5 h-5 text-blue-600" />
                              </div>
                              <div>
                                <div className="font-medium text-slate-900">{user.name}</div>
                                <div className="text-sm text-slate-500">{user.email}</div>
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
                          <div className="space-y-1">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(user.status)}`}>
                              <StatusIcon className="w-3 h-3" />
                              {user.status}
                            </span>
                            {user.joinRequest && (
                              <div className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                                <span className="text-xs text-orange-600">Seller request pending</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-1 text-slate-900">
                            <ShoppingBag className="w-4 h-4 text-slate-500" />
                            <span className="font-medium">{user.orders}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-1 text-slate-600 text-sm">
                            <Calendar className="w-4 h-4 text-slate-400" />
                            {user.joinedAt}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-center">
                            <ActionsDropdown
                              user={user}
                              onApproveSeller={handleApproveSeller}
                              onBanUser={handleBanUser}
                              onUnbanUser={handleUnbanUser}
                              onResetPassword={handleResetPassword}
                            />
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
                    <div key={user.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 hover:shadow-sm transition-shadow">
                      <Link href={`/admin/dashboard/customers/${user.id}`}>
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <User className="w-6 h-6 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-slate-900 truncate hover:text-blue-600 transition-colors">
                              {user.name}
                            </div>
                            <div className="text-sm text-slate-500 truncate">{user.email}</div>
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
                        
                        <div className="flex items-center justify-between text-sm text-slate-600">
                          <span className="flex items-center gap-1">
                            <ShoppingBag className="w-4 h-4" />
                            {user.orders} orders
                          </span>
                          <span>{user.joinedAt}</span>
                        </div>
                        
                        {user.joinRequest && (
                          <div className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded">
                            Seller request pending
                          </div>
                        )}
                        
                        <div className="flex gap-2 pt-2 border-t border-slate-200">
                          {user.joinRequest && user.role === "buyer" && (
                            <button
                              className="flex-1 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors"
                              onClick={() => handleApproveSeller(user.id)}
                            >
                              Approve
                            </button>
                          )}
                          <button
                            className={`flex-1 py-1.5 text-white text-xs rounded-lg transition-colors ${
                              user.status === "banned" 
                                ? "bg-green-600 hover:bg-green-700" 
                                : "bg-red-600 hover:bg-red-700"
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
          <div className="text-sm text-slate-600">
            Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, filteredUsers.length)} of {filteredUsers.length} customers
          </div>
          
          <div className="flex items-center gap-2">
            <button
              className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg bg-white text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                        ? "bg-blue-600 text-white"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              {totalPages > 5 && (
                <span className="text-slate-400 px-2">...</span>
              )}
            </div>
            
            <button
              className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg bg-white text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || totalPages === 0}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
