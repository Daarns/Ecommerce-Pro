"use client";
import { useState } from "react";
import { User, Settings, Shield, Bell, HelpCircle, LogOut, ChevronDown } from "lucide-react";
import Link from "next/link";

const adminProfile = {
  name: "Admin User",
  email: "admin@ecommerce.com",
  role: "Super Admin",
  avatar: null, 
  lastLogin: "Today at 2:30 PM",
  status: "online"
};

export function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/auth/login';
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-100 transition-colors"
      >
        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
          <User className="w-5 h-5 text-blue-600" />
        </div>
        <div className="hidden sm:block text-left">
          <div className="text-sm font-medium text-slate-900">{adminProfile.name}</div>
          <div className="text-xs text-slate-500">{adminProfile.role}</div>
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 z-20 mt-2 w-72 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
            {/* Profile Header */}
            <div className="px-4 py-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-slate-900">{adminProfile.name}</div>
                  <div className="text-sm text-slate-500">{adminProfile.email}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-xs text-slate-500">Online</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              <Link
                href="#"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 transition-colors"
              >
                <User className="w-4 h-4 text-slate-500" />
                <span className="text-sm text-slate-700">View Profile</span>
              </Link>

              <Link
                href="#"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 transition-colors"
              >
                <Settings className="w-4 h-4 text-slate-500" />
                <span className="text-sm text-slate-700">Account Settings</span>
              </Link>

              <Link
                href="#"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 transition-colors"
              >
                <Shield className="w-4 h-4 text-slate-500" />
                <span className="text-sm text-slate-700">Security</span>
              </Link>

              <Link
                href="#"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 transition-colors"
              >
                <Bell className="w-4 h-4 text-slate-500" />
                <span className="text-sm text-slate-700">Notifications</span>
              </Link>

              <Link
                href="#"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 transition-colors"
              >
                <HelpCircle className="w-4 h-4 text-slate-500" />
                <span className="text-sm text-slate-700">Help & Support</span>
              </Link>
            </div>

            {/* Logout */}
            <div className="border-t border-slate-200">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 w-full text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">Sign Out</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
