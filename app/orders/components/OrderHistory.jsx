'use client'
import { useState, useMemo } from 'react'
import { useOrders } from '@/app/contexts/OrderContext'
import { formatPrice } from '@/app/lib/utils'
import { Breadcrumb } from '@/app/components/ui/Breadcrumb'
import { Button } from '@/app/components/ui/Button'
import { 
  Package, 
  Search, 
  Filter, 
  Calendar,
  Eye,
  Truck,
  CheckCircle,
  Clock,
  X,
  ChevronDown,
  ShoppingBag
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

// ✅ Move helper functions outside component
const getStatusColor = (status) => {
  const colors = {
    'processing': 'text-warning bg-warning/20 border-warning/30',
    'confirmed': 'text-info bg-info/20 border-info/30',
    'shipped': 'text-primary bg-primary/20 border-primary/30',
    'delivered': 'text-success bg-success/20 border-success/30',
    'cancelled': 'text-error bg-error/20 border-error/30'
  }
  return colors[status] || 'text-text-muted bg-background border-border'
}

const getStatusIcon = (status) => {
  const icons = {
    'processing': Clock,
    'confirmed': CheckCircle,
    'shipped': Truck,
    'delivered': Package,
    'cancelled': X
  }
  const Icon = icons[status] || Clock
  return <Icon className="w-4 h-4" />
}

export function OrderHistory({showBreadcrumb = true}) {
  const { orders } = useOrders()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')
  const [showFilters, setShowFilters] = useState(false)

  // Filter orders based on search and filters
  const filteredOrders = useMemo(() => {
    let filtered = orders

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items.some(item => 
          item.product.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter)
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date()
      const filterDate = new Date()
      
      switch (dateFilter) {
        case 'week':
          filterDate.setDate(now.getDate() - 7)
          break
        case 'month':
          filterDate.setMonth(now.getMonth() - 1)
          break
        case '3months':
          filterDate.setMonth(now.getMonth() - 3)
          break
        default:
          filterDate = null
      }

      if (filterDate) {
        filtered = filtered.filter(order => 
          new Date(order.createdAt) >= filterDate
        )
      }
    }

    return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }, [orders, searchTerm, statusFilter, dateFilter])

  if (orders.length === 0) {
    return (
      <div className="space-y-8">
        <Breadcrumb 
          items={[
            { label: 'Home', href: '/' },
            { label: 'Orders', href: '/orders', active: true }
          ]} 
        />

        <div className="text-center py-16">
          <ShoppingBag className="w-16 h-16 text-text-muted mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-text-primary mb-4">
            No Orders Yet
          </h1>
          <p className="text-text-secondary mb-8">
            You haven't placed any orders yet. Start shopping to see your orders here.
          </p>
          <Link href="/products">
            <Button className="bg-primary hover:bg-primary-hover text-white">
              Start Shopping
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      {showBreadcrumb && (
      <Breadcrumb 
        items={[
          { label: 'Home', href: '/' },
          { label: 'Orders', href: '/orders', active: true }
        ]} 
      />
      )}

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            Order History
          </h1>
          <p className="text-text-secondary">
            Track and manage all your orders
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-sm text-text-secondary">
            {filteredOrders.length} of {orders.length} orders
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-surface border border-border rounded-2xl p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input
                type="text"
                placeholder="Search orders by ID or product name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-xl text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
            </div>
          </div>

          {/* Filter Toggle */}
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filters
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </Button>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Order Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                >
                  <option value="all">All Status</option>
                  <option value="processing">Processing</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* Date Filter */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Time Period
                </label>
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                >
                  <option value="all">All Time</option>
                  <option value="week">Last Week</option>
                  <option value="month">Last Month</option>
                  <option value="3months">Last 3 Months</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-12">
          <Package className="w-12 h-12 text-text-muted mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            No orders found
          </h3>
          <p className="text-text-secondary">
            Try adjusting your search or filter criteria
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  )
}

// ✅ Order Card Component - Now has access to helper functions
function OrderCard({ order }) {
  const firstItem = order.items[0]
  const remainingItems = order.items.length - 1

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 hover:shadow-lg transition-shadow">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Order Info */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
            <div>
              <h3 className="font-bold text-text-primary">
                Order {order.id}
              </h3>
              <div className="flex items-center gap-4 text-sm text-text-secondary">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(order.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
                <span>{order.items.length} {order.items.length === 1 ? 'item' : 'items'}</span>
              </div>
            </div>

            {/* ✅ Now getStatusColor and getStatusIcon are accessible */}
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
              {getStatusIcon(order.status)}
              <span className="capitalize">{order.status}</span>
            </div>
          </div>

          {/* Product Preview */}
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-lg overflow-hidden bg-background flex-shrink-0">
              <Image
                src={firstItem.product.image}
                alt={firstItem.product.name}
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-text-primary truncate">
                {firstItem.product.name}
              </p>
              {remainingItems > 0 && (
                <p className="text-sm text-text-secondary">
                  +{remainingItems} more {remainingItems === 1 ? 'item' : 'items'}
                </p>
              )}
            </div>
          </div>

          {/* Shipping Info */}
          <div className="text-sm text-text-secondary">
            <span className="font-medium">Ship to:</span> {order.shippingInfo.firstName} {order.shippingInfo.lastName}
          </div>
        </div>

        {/* Order Total & Actions */}
        <div className="lg:text-right space-y-4">
          <div>
            <div className="text-2xl font-bold text-primary">
              {formatPrice(order.totalAmount)}
            </div>
            <div className="text-sm text-text-secondary">
              Total amount
            </div>
          </div>

          <div className="flex lg:flex-col gap-2">
            <Link href={`/orders/${order.id}`} className="flex-1 lg:flex-none">
              <Button variant="outline" className="w-full">
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </Button>
            </Link>

            {order.status === 'delivered' && (
              <Button variant="outline" className="flex-1 lg:flex-none">
                Reorder
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}