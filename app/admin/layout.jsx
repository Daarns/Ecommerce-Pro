import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import Sidebar from "./sidebar";

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 md:p-10 bg-background">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}