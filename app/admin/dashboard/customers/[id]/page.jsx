import CustomerDetail from "../CustomerDetail";

export default async function AdminCustomerDetailPage({params}) {
  const {id} = await params;
  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-3xl mx-auto px-4 py-8">
        <CustomerDetail userId={id} />
      </main>
    </div>
  );
}
