import CustomerList from "./CustomerList";

export const metadata = {
  title: "Customer Management - Admin",
  description: "Manage all users and sellers in your store",
};

export default function AdminCustomersPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CustomerList />
      </main>
    </div>
  );
}