import ProductList from './ProductList'

export const metadata = {
  title: 'Product Management - Admin',
  description: 'Manage all products in your store',
}

export default function AdminProductsPage() {
  return (
    <div className="w-full bg-slate-50 p-4 lg:p-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-2">
              Product Management
            </h1>
            <p className="text-slate-600">Manage your store inventory and product catalog</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
              <span className="text-sm font-medium">Export</span>
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium">
              Add Product
            </button>
          </div>
        </div>
      </div>

      <ProductList />
    </div>
  )
}
