"use client"
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart2, ShoppingBag, Users, Package, Menu, ChevronLeft, ChevronRight } from "lucide-react";

const nav = [
  { name: "Dashboard", href: "/admin/dashboard", icon: <BarChart2 /> },
  { name: "Products", href: "/admin/dashboard/products", icon: <Package /> },
  { name: "Orders", href: "/admin/dashboard/orders", icon: <ShoppingBag /> },
  { name: "Customers", href: "/admin/dashboard/customers", icon: <Users /> },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      {/* Mobile Menu Button - hanya muncul di mobile ketika sidebar tertutup */}
      {!isOpen && (
        <button
          className="fixed top-4 left-4 z-50 lg:hidden bg-slate-800 rounded-lg p-2 shadow-lg"
          onClick={() => setIsOpen(true)}
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5 text-white" />
        </button>
      )}

      {/* Desktop Show Button - ketika sidebar collapsed */}
      {!isOpen && (
        <button
          className="hidden lg:block fixed top-4 left-4 z-50 bg-slate-800 rounded-lg p-2 shadow-lg"
          onClick={() => setIsOpen(true)}
          aria-label="Show sidebar"
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </button>
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 
          bg-slate-900 text-white flex flex-col
          transform transition-all duration-300 ease-in-out
          ${isOpen ? 'translate-x-0 w-64' : '-translate-x-full w-0 lg:translate-x-0 lg:w-0'}
          overflow-hidden
        `}
      >
        {/* Header dengan Toggle Button */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700 flex-shrink-0">
          <h1 className={`
            font-bold text-xl transition-all duration-300 whitespace-nowrap
            ${isOpen ? 'opacity-100' : 'opacity-0'}
          `}>
            Admin Panel
          </h1>
          
          <button
            onClick={() => setIsOpen(false)}
            className={`
              p-1 rounded-lg hover:bg-slate-700 transition-colors flex-shrink-0
              ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
            `}
            aria-label="Hide sidebar"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className={`
          flex-1 p-4 space-y-2 transition-all duration-300
          ${isOpen ? 'opacity-100' : 'opacity-0'}
          overflow-y-auto
        `}>
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg
                font-medium transition-all duration-200
                hover:bg-slate-700
                ${pathname === item.href
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300'
                }
              `}
              onClick={() => {
                // Auto close on mobile
                if (window.innerWidth < 1024) {
                  setIsOpen(false);
                }
              }}
            >
              <span className="text-lg flex-shrink-0">{item.icon}</span>
              <span className="whitespace-nowrap">{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* User Profile */}
        <div className={`
          p-4 border-t border-slate-700 flex-shrink-0
          transition-all duration-300
          ${isOpen ? 'opacity-100' : 'opacity-0'}
        `}>
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-700 cursor-pointer">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold">A</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-white">Admin</div>
              <div className="text-xs text-slate-400 truncate">admin@example.com</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Main Content Push - untuk memberikan space di desktop */}
      <div 
        className={`
          transition-all duration-300 ease-in-out
          ${isOpen ? 'lg:ml-64' : 'lg:ml-0'}
        `}
        style={{ minHeight: '100vh' }}
      >
        {/* Konten dari page.jsx akan render di sini melalui children atau layout wrapper */}
      </div>
    </>
  );
}