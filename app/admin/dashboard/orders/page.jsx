import OrderList from './OrderList'

export const metadata = {
  title: 'Order Management - Admin',
  description: 'Manage all orders and track their status',
}

export default function AdminOrdersPage() {
  return (
    <div className="w-full bg-slate-50 p-4 lg:p-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-2">
              Order Management
            </h1>
            <p className="text-slate-600">Track and manage all customer orders</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
              <span className="text-sm font-medium">Export Orders</span>
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium">
              Generate Report
            </button>
          </div>
        </div>
      </div>

      <OrderList />
    </div>
  )
}
