"use client"
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart2, ShoppingBag, Users, Package, Menu, ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import { useSidebar } from './contexts/SidebarContext';

const nav = [
  { name: "Dashboard", href: "/admin/dashboard", icon: <BarChart2 /> },
  { name: "Products", href: "/admin/dashboard/products", icon: <Package /> },
  { name: "Orders", href: "/admin/dashboard/orders", icon: <ShoppingBag /> },
  { name: "Customers", href: "/admin/dashboard/customers", icon: <Users /> },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { isOpen, setIsOpen, isMobile } = useSidebar();

  return (
    <>
      {/* Mobile Menu Button */}
      {isMobile && !isOpen && (
        <button
          className="fixed top-4 left-4 z-50 bg-slate-900 text-white rounded-xl p-3 shadow-lg border border-slate-700"
          onClick={() => setIsOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      )}

      {/* Mobile Overlay */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-200"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen
          bg-slate-900 text-white flex flex-col
          transition-all duration-200 ease-out shadow-2xl
          ${isMobile 
            ? (isOpen 
                ? 'translate-x-0 w-64 visible opacity-100' 
                : '-translate-x-full w-0 invisible opacity-0'
              )
            : (isOpen ? 'translate-x-0 w-72' : 'translate-x-0 w-16')
          }
        `}
        style={{
          // Force complete hiding on mobile
          ...(isMobile && !isOpen && {
            pointerEvents: 'none',
            visibility: 'hidden',
            transform: 'translateX(-100%)',
            width: '0px',
            opacity: 0
          })
        }}
      >
        {/* Header */}
        <div className={`flex items-center border-b border-slate-700 h-16 flex-shrink-0 ${
          isOpen ? 'justify-between px-4' : 'justify-center px-2'
        }`}>
          <div className={`transition-all duration-200 ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 lg:opacity-100 lg:scale-100'}`}>
            {isOpen ? (
              <h1 className="font-bold text-xl whitespace-nowrap">Admin Panel</h1>
            ) : (
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-sm font-bold">A</span>
              </div>
            )}
          </div>
          
          {/* Toggle Button - Hidden on mobile when closed */}
          {!isMobile && (
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-1.5 rounded-lg hover:bg-slate-700 transition-all duration-200 ${
                isOpen ? 'opacity-100' : 'opacity-0 lg:opacity-100'
              }`}
              aria-label="Toggle sidebar"
            >
              {isOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          )}

          {/* Mobile Close Button */}
          {isMobile && isOpen && (
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg hover:bg-slate-700 transition-colors duration-200"
              aria-label="Close menu"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className={`flex-1 overflow-y-auto overflow-x-hidden ${isOpen ? 'p-4' : 'px-2 py-4'}`}>
          <div className="space-y-1">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  relative flex items-center font-medium transition-all duration-200 group
                  ${isOpen 
                    ? 'gap-3 px-3 py-3 rounded-xl' 
                    : 'justify-center p-3 rounded-xl mx-auto w-12 h-12'
                  }
                  ${pathname === item.href
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }
                `}
                onClick={() => {
                  if (isMobile) {
                    setIsOpen(false);
                  }
                }}
                title={!isOpen ? item.name : ''}
              >
                <span className={`flex-shrink-0 transition-all duration-200 ${
                  isOpen ? 'text-lg' : 'text-xl'
                }`}>
                  {item.icon}
                </span>
                {isOpen && (
                  <span className="transition-all duration-200 whitespace-nowrap">
                    {item.name}
                  </span>
                )}
                
                {/* Tooltip for collapsed state - Hidden on mobile */}
                {!isOpen && !isMobile && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-slate-700 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                    {item.name}
                  </div>
                )}
              </Link>
            ))}
          </div>
        </nav>

        {/* User Profile */}
        <div className={`border-t border-slate-700 flex-shrink-0 overflow-hidden ${isOpen ? 'p-4' : 'p-2'}`}>
          <div className={`
            flex items-center rounded-xl hover:bg-slate-700 cursor-pointer 
            transition-all duration-200 group relative
            ${isOpen 
              ? 'gap-3 px-3 py-3' 
              : 'justify-center p-3 mx-auto w-12 h-12'
            }
          `}>
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold">A</span>
            </div>
            {isOpen && (
              <div className="flex-1 min-w-0 transition-all duration-200">
                <div className="text-sm font-medium text-white whitespace-nowrap">Admin User</div>
                <div className="text-xs text-slate-400 truncate">admin@example.com</div>
              </div>
            )}
            
            {/* Tooltip for collapsed state */}
            {!isOpen && !isMobile && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-slate-700 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                Admin User
              </div>
            )}
          </div>
          
          {/* Logout Button */}
          <button className={`
            w-full flex items-center font-medium rounded-xl
            text-slate-300 hover:bg-red-600 hover:text-white 
            transition-all duration-200 group relative
            ${isOpen 
              ? 'gap-3 px-3 py-3 mt-2' 
              : 'justify-center p-3 mx-auto w-12 h-12 mt-1'
            }
          `}>
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {isOpen && (
              <span className="transition-all duration-200 whitespace-nowrap">
                Logout
              </span>
            )}
            
            {/* Tooltip for collapsed state */}
            {!isOpen && !isMobile && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-slate-700 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                Logout
              </div>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
