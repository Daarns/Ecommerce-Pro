  "use client"
  import { useState } from "react";
  import { Bell, Search, Settings, User, LogOut, Moon, Sun } from "lucide-react";
  import { ThemeToggle } from "@/app/components/ui/ThemeToggle";

  export function Header() {
    const [notifications] = useState(3); // Mock notification count
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    return (
      <header className="bg-surface border-b border-border px-6 py-4 sticky top-0 z-30 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          {/* Search Bar */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-secondary" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 bg-surface-elevated border border-border rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              />
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3 ml-6">
            {/* Dark Mode Toggle */}
            <ThemeToggle />
            {/* Notifications */}
            <div className="relative">
              <button className="p-2 rounded-lg hover:bg-surface-elevated transition-colors">
                <Bell className="w-5 h-5 text-text-secondary" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </button>
            </div>

            {/* Settings */}
            <button className="p-2 rounded-lg hover:bg-surface-elevated transition-colors">
              <Settings className="w-5 h-5 text-text-secondary" />
            </button>

            {/* Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-surface-elevated transition-colors"
              >
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-white">A</span>
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-sm font-medium text-text-primary">Admin</div>
                  <div className="text-xs text-text-secondary">Super Admin</div>
                </div>
              </button>

              {/* Profile Dropdown */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-surface border border-border rounded-lg shadow-lg py-2 z-50">
                  <button className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-surface-elevated transition-colors">
                    <User className="w-4 h-4 text-text-secondary" />
                    <span className="text-text-primary">Profile</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-surface-elevated transition-colors">
                    <Settings className="w-4 h-4 text-text-secondary" />
                    <span className="text-text-primary">Settings</span>
                  </button>
                  <hr className="my-2 border-border" />
                  <button className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-red-50 text-red-600 transition-colors">
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Close dropdown when clicking outside */}
        {showProfileMenu && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowProfileMenu(false)}
          />
        )}
      </header>
    );
  }