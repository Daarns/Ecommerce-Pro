import { OrderDetail } from "@/app/orders/[id]/components/OrderDetail";

export default async function AdminOrderDetailPage({ params }) {
  const { id } = await params;
  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-4xl mx-auto px-4 py-8">
        <OrderDetail orderId={id} adminView={true} showBreadcrumb={true} />
      </main>
    </div>
  );
}