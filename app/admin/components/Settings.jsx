"use client";
import { useState } from "react";
import { Settings, User, Shield, Bell, Monitor, Palette, Globe, HelpCircle, LogOut, ChevronRight } from "lucide-react";
import Link from "next/link";

const settingsCategories = [
  {
    title: "Account",
    items: [
      { icon: User, label: "Profile Settings", href: "#", description: "Manage your account information" },
      { icon: Shield, label: "Security", href: "#", description: "Password and 2FA settings" },
      { icon: Bell, label: "Notifications", href: "#", description: "Configure alert preferences" },
    ]
  },
  {
    title: "Appearance",
    items: [
      { icon: Palette, label: "Theme", href: "#", description: "Dark/light mode settings" },
      { icon: Monitor, label: "Display", href: "#", description: "Layout and dashboard preferences" },
      { icon: Globe, label: "Language", href: "#", description: "Choose your language" },
    ]
  },
  {
    title: "System",
    items: [
      { icon: Settings, label: "General Settings", href: "#", description: "Store configuration" },
      { icon: HelpCircle, label: "Help & Support", href: "#", description: "Documentation and support" },
    ]
  }
];

export function SettingsDropdown() {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    // Implement logout logic
    localStorage.removeItem('user');
    window.location.href = '/auth/login';
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
      >
        <Settings className="w-5 h-5" />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 z-20 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
            {/* Header */}
            <div className="px-4 py-3 border-b border-slate-200">
              <h3 className="font-semibold text-slate-900">Settings</h3>
              <p className="text-sm text-slate-500">Manage your preferences</p>
            </div>

            {/* Settings Categories */}
            <div className="max-h-96 overflow-y-auto">
              {settingsCategories.map((category, categoryIndex) => (
                <div key={category.title} className={categoryIndex > 0 ? 'border-t border-slate-100' : ''}>
                  <div className="px-4 py-2">
                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      {category.title}
                    </h4>
                  </div>
                  
                  <div className="space-y-1 px-2 pb-2">
                    {category.items.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-slate-50 transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                          <item.icon className="w-4 h-4 text-slate-600" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-900">{item.label}</span>
                            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                          </div>
                          <p className="text-xs text-slate-500 truncate">{item.description}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-slate-200 bg-slate-50">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-2 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                  <LogOut className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium">Sign Out</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
