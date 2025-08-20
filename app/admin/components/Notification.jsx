"use client";
import { useState } from "react";
import { Bell, Package, Users, ShoppingCart, AlertTriangle, CheckCircle, X, MoreHorizontal } from "lucide-react";

const notificationTypes = {
  order: { icon: ShoppingCart, color: "text-blue-600 bg-blue-100" },
  user: { icon: Users, color: "text-green-600 bg-green-100" },
  product: { icon: Package, color: "text-purple-600 bg-purple-100" },
  alert: { icon: AlertTriangle, color: "text-orange-600 bg-orange-100" },
  success: { icon: CheckCircle, color: "text-green-600 bg-green-100" },
};

const dummyNotifications = [
  {
    id: 1,
    type: "order",
    title: "New Order Received",
    message: "Order #ORD-00145 from John Doe - Rp 2.500.000",
    time: "2 minutes ago",
    read: false,
    action: "View Order"
  },
  {
    id: 2,
    type: "user",
    title: "New Seller Application",
    message: "Alice Johnson requested to become a seller",
    time: "5 minutes ago",
    read: false,
    action: "Review Application"
  },
  {
    id: 3,
    type: "alert",
    title: "Low Stock Alert",
    message: "iPhone 15 Pro Max (256GB) only has 3 items left",
    time: "10 minutes ago",
    read: false,
    action: "Restock"
  },
  {
    id: 4,
    type: "order",
    title: "Order Cancelled",
    message: "Order #ORD-00144 was cancelled by customer",
    time: "15 minutes ago",
    read: true,
    action: "View Details"
  },
  {
    id: 5,
    type: "product",
    title: "Product Review",
    message: "New 5-star review for Samsung Galaxy S24 Ultra",
    time: "30 minutes ago",
    read: true,
    action: "View Review"
  },
  {
    id: 6,
    type: "success",
    title: "Payment Received",
    message: "Payment confirmed for Order #ORD-00143 - Rp 1.800.000",
    time: "1 hour ago",
    read: true,
    action: "View Payment"
  },
  {
    id: 7,
    type: "alert",
    title: "Security Alert",
    message: "Multiple failed login attempts detected",
    time: "2 hours ago",
    read: true,
    action: "Check Logs"
  },
  {
    id: 8,
    type: "user",
    title: "Customer Feedback",
    message: "Negative feedback received - requires attention",
    time: "3 hours ago",
    read: true,
    action: "View Feedback"
  }
];

export function NotificationDropdown() {
  const [notifications, setNotifications] = useState(dummyNotifications);
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 z-20 mt-2 w-96 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
            {/* Header */}
            <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-900">Notifications</h3>
                <p className="text-sm text-slate-500">{unreadCount} unread messages</p>
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Mark all read
                </button>
              )}
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500">No notifications yet</p>
                </div>
              ) : (
                notifications.map((notification) => {
                  const { icon: Icon, color } = notificationTypes[notification.type];
                  return (
                    <div
                      key={notification.id}
                      className={`px-4 py-3 border-b border-slate-100 hover:bg-slate-50 transition-colors ${
                        !notification.read ? 'bg-blue-50/50' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className={`text-sm font-medium ${!notification.read ? 'text-slate-900' : 'text-slate-700'}`}>
                              {notification.title}
                            </h4>
                            <div className="flex items-center gap-1">
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              )}
                              <button
                                onClick={() => deleteNotification(notification.id)}
                                className="p-1 hover:bg-slate-200 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="w-3 h-3 text-slate-400" />
                              </button>
                            </div>
                          </div>
                          
                          <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-slate-500">{notification.time}</span>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                              >
                                {notification.action}
                              </button>
                              {!notification.read && (
                                <button
                                  onClick={() => markAsRead(notification.id)}
                                  className="text-xs text-slate-500 hover:text-slate-700"
                                >
                                  Mark read
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-slate-200 bg-slate-50">
              <button className="w-full text-sm text-slate-600 hover:text-slate-900 font-medium">
                View all notifications
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
