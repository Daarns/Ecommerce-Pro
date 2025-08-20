"use client"
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import Sidebar from "./sidebar";
import { SidebarProvider, useSidebar } from './contexts/SidebarContext';

function AdminLayoutContent({ children }) {
  const { isOpen, isMobile } = useSidebar();

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      
      {/* Main Content - Responsive margin berdasarkan sidebar state */}
      <div 
        className={`
          min-h-screen transition-all duration-200 ease-out
          ${isMobile 
            ? 'ml-0' 
            : isOpen 
              ? 'ml-72' 
              : 'ml-16'
          }
        `}
      >
        <Header />
        <main className="w-full h-full">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default function AdminLayout({ children }) {
  return (
    <SidebarProvider>
      <AdminLayoutContent>
        {children}
      </AdminLayoutContent>
    </SidebarProvider>
  );
}
