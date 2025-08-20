  "use client";
  import { useState } from "react";
  import { Search } from "lucide-react";
  import { NotificationDropdown } from "./Notification";
  import { SettingsDropdown } from "./Settings";
  import { ProfileDropdown } from "./Profile";
  
  export function Header() {
    return (
      <header className="bg-surface border-b border-border px-6 py-4 sticky top-0 z-30 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          {/* Search Bar */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-secondary" />
              <input
                type="text"
                placeholder="Search orders, customers, products..."
                className="w-full pl-10 pr-4 py-2 bg-surface-elevated border border-border rounded-lg text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              />
            </div>
          </div>
  
          {/* Right Side Actions */}
          <div className="flex items-center gap-3 ml-6">
            <NotificationDropdown />
            <SettingsDropdown />
            <div className="w-px h-6 bg-border"></div>
            <ProfileDropdown />
          </div>
        </div>
      </header>
    );
  }
