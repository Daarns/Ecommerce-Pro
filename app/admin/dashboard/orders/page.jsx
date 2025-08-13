import OrderList from "./OrderList";

export const metadata = {
  title: "Order Management - Admin",
  description: "Manage all orders in your store",
};

export default function AdminOrdersPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <OrderList />
      </main>
    </div>
  );
}