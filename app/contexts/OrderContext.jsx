'use client'
import { createContext, useContext, useState, useEffect } from 'react'

const OrderContext = createContext()

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)

  // Load orders from localStorage on mount
  useEffect(() => {
    const savedOrders = localStorage.getItem('daarns_orders')
    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders))
      } catch (error) {
        console.error('Error loading orders:', error)
        setOrders([])
      }
    }
  }, [])

  // Save orders to localStorage whenever orders change
  useEffect(() => {
    if (orders.length > 0) {
      localStorage.setItem('daarns_orders', JSON.stringify(orders))
    }
  }, [orders])

  const createOrder = (orderData) => {
    const newOrder = {
      id: `ORD-${Date.now()}`,
      ...orderData,
      status: 'processing',
      paymentStatus: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days
      trackingNumber: `TRK${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      orderHistory: [
        {
          status: 'processing',
          timestamp: new Date().toISOString(),
          description: 'Order received and being processed'
        }
      ]
    }
    
    setOrders(prev => [newOrder, ...prev])
    return newOrder
  }

  const updateOrderStatus = (orderId, newStatus, description = '') => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        const updatedOrder = {
          ...order,
          status: newStatus,
          updatedAt: new Date().toISOString(),
          orderHistory: [
            ...order.orderHistory,
            {
              status: newStatus,
              timestamp: new Date().toISOString(),
              description: description || getStatusDescription(newStatus)
            }
          ]
        }

        // Update payment status based on order status
        if (newStatus === 'confirmed') {
          updatedOrder.paymentStatus = 'paid'
        } else if (newStatus === 'cancelled') {
          updatedOrder.paymentStatus = 'refunded'
        }

        return updatedOrder
      }
      return order
    }))
  }

  const getStatusDescription = (status) => {
    const descriptions = {
      'processing': 'Order received and being processed',
      'confirmed': 'Payment confirmed, preparing for shipment',
      'shipped': 'Order has been shipped',
      'delivered': 'Order delivered successfully',
      'cancelled': 'Order has been cancelled'
    }
    return descriptions[status] || 'Status updated'
  }

  const getOrderById = (orderId) => {
    return orders.find(order => order.id === orderId)
  }

  const getOrdersByStatus = (status) => {
    return orders.filter(order => order.status === status)
  }

  const cancelOrder = (orderId, reason = '') => {
    updateOrderStatus(orderId, 'cancelled', `Order cancelled: ${reason}`)
  }

  const value = {
    orders,
    loading,
    createOrder,
    updateOrderStatus,
    getOrderById,
    getOrdersByStatus,
    cancelOrder
  }

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  )
}

export function useOrders() {
  const context = useContext(OrderContext)
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider')
  }
  return context
}