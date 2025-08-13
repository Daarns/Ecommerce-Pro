"use client";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {useOrders} from "@/app/contexts/OrderContext";
import {formatPrice} from "@/app/lib/utils";
import {Breadcrumb} from "@/app/components/ui/Breadcrumb";
import {Button} from "@/app/components/ui/Button";
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Hash,
  CreditCard,
  X,
} from "lucide-react";
import Image from "next/image";

export function OrderDetail({
  orderId,
  showBreadcrumb = true,
  adminView = false,
}) {
  const router = useRouter();
  const {getOrderById, cancelOrder, updateOrderStatus} = useOrders();
  const [order, setOrder] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const foundOrder = getOrderById(orderId);
    if (foundOrder) {
      setOrder(foundOrder);
    }
    setLoading(false);
  }, [orderId, getOrderById]);

  // Loading state
  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-text-secondary">Loading order details...</p>
      </div>
    );
  }

  // Order not found
  if (!order) {
    return (
      <div className="text-center py-16">
        <Package className="w-16 h-16 text-text-muted mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-text-primary mb-4">
          Order Not Found
        </h1>
        <p className="text-text-secondary mb-8">
          The order you're looking for doesn't exist or has been removed.
        </p>
        <Button 
          onClick={() => router.push(adminView ? "/admin/dashboard/orders" : "/orders")} 
          variant="outline"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Orders
        </Button>
      </div>
    );
  }

  const getStatusColor = (status) => {
    const colors = {
      processing: "text-warning bg-warning/20",
      confirmed: "text-info bg-info/20",
      shipped: "text-primary bg-primary/20",
      delivered: "text-success bg-success/20",
      cancelled: "text-error bg-error/20",
    };
    return colors[status] || "text-text-muted bg-background";
  };

  const getStatusIcon = (status) => {
    const icons = {
      processing: Clock,
      confirmed: CheckCircle,
      shipped: Truck,
      delivered: Package,
      cancelled: X,
    };
    return icons[status] || Clock;
  };

  const handleCancelOrder = (reason) => {
    cancelOrder(order.id, reason);
    setShowCancelModal(false);
    // Refresh order data
    const updatedOrder = getOrderById(orderId);
    setOrder(updatedOrder);
  };

  const handleStatusUpdate = (newStatus) => {
    if (updateOrderStatus) {
      updateOrderStatus(order.id, newStatus);
      // Refresh order data
      const updatedOrder = getOrderById(orderId);
      setOrder(updatedOrder);
    }
  };

  const StatusIcon = getStatusIcon(order.status);

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      {showBreadcrumb && !adminView && (
        <Breadcrumb
          items={[
            {label: "Home", href: "/"},
            {label: "Orders", href: "/orders"},
            {
              label: `Order ${order.id}`,
              href: `/orders/${order.id}`,
              active: true,
            },
          ]}
        />
      )}

      {/* Admin breadcrumb */}
      {showBreadcrumb && adminView && (
        <Breadcrumb
          items={[
            {label: "Admin", href: "/admin/dashboard"},
            {label: "Orders", href: "/admin/dashboard/orders"},
            {
              label: `Order ${order.id}`,
              href: `/admin/dashboard/orders/${order.id}`,
              active: true,
            },
          ]}
        />
      )}

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            {adminView ? "Admin - " : ""}Order Details
          </h1>
          <div className="flex items-center gap-4 text-sm text-text-secondary">
            <span className="flex items-center gap-1">
              <Hash className="w-4 h-4" />
              {order.id}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(order.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div
            className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium ${getStatusColor(
              order.status
            )}`}
          >
            <StatusIcon className="w-4 h-4" />
            <span className="capitalize">{order.status}</span>
          </div>

          {/* Cancel button for non-admin users */}
          {!adminView && order.status === "processing" && (
            <Button
              variant="outline"
              onClick={() => setShowCancelModal(true)}
              className="text-error border-error hover:bg-error hover:text-white"
            >
              Cancel Order
            </Button>
          )}

          {/* Status update dropdown for admin */}
          {adminView && (
            <select
              value={order.status}
              onChange={(e) => handleStatusUpdate(e.target.value)}
              className="border border-border rounded-lg px-3 py-2 text-sm bg-background text-text-primary"
            >
              <option value="processing">Processing</option>
              <option value="confirmed">Confirmed</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Timeline */}
          <div className="bg-surface border border-border rounded-2xl p-6">
            <h2 className="text-lg font-bold text-text-primary mb-6">
              Order Timeline
            </h2>
            <div className="space-y-4">
              {order.orderHistory && order.orderHistory.length > 0 ? (
                order.orderHistory.map((event, index) => {
                  const EventIcon = getStatusIcon(event.status);
                  const isCompleted =
                    index < order.orderHistory.length - 1 ||
                    order.status !== "processing";

                  return (
                    <div key={index} className="flex gap-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          isCompleted
                            ? "bg-primary text-white"
                            : "bg-primary/20 text-primary"
                        }`}
                      >
                        <EventIcon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-text-primary capitalize">
                            {event.status}
                          </h3>
                          <span className="text-sm text-text-muted">
                            {new Date(event.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-text-secondary text-sm">
                          {event.description}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-4 text-text-muted">
                  No order history available
                </div>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-surface border border-border rounded-2xl p-6">
            <h2 className="text-lg font-bold text-text-primary mb-6">
              Order Items ({order.items ? order.items.length : 0}{" "}
              {order.items && order.items.length === 1 ? "item" : "items"})
            </h2>
            <div className="space-y-4">
              {order.items && order.items.length > 0 ? (
                order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-4 bg-background rounded-xl"
                  >
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-surface flex-shrink-0">
                      <Image
                        src={item.product?.image || "/placeholder-image.png"}
                        alt={item.product?.name || "Product"}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-text-primary mb-1">
                        {item.product?.name || "Unknown Product"}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-text-secondary">
                        <span>Qty: {item.quantity || 1}</span>
                        {item.size && <span>Size: {item.size}</span>}
                        {item.color && <span>Color: {item.color}</span>}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-text-primary">
                        {formatPrice((item.priceAtTime || 0) * (item.quantity || 1))}
                      </div>
                      <div className="text-sm text-text-muted">
                        {formatPrice(item.priceAtTime || 0)} each
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-text-muted">
                  No items found
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Summary */}
          <div className="bg-surface border border-border rounded-2xl p-6">
            <h2 className="text-lg font-bold text-text-primary mb-6">
              Order Summary
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between text-text-secondary">
                <span>Subtotal:</span>
                <span>{formatPrice(order.subtotal || 0)}</span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>Shipping:</span>
                <span>
                  {(order.shipping || 0) === 0 ? (
                    <span className="text-success font-medium">FREE</span>
                  ) : (
                    formatPrice(order.shipping || 0)
                  )}
                </span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>Tax:</span>
                <span>{formatPrice(order.tax || 0)}</span>
              </div>
              <div className="pt-3 border-t border-border">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-text-primary">
                    Total:
                  </span>
                  <span className="text-xl font-bold text-primary">
                    {formatPrice(order.totalAmount || 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Information */}
          <div className="bg-surface border border-border rounded-2xl p-6">
            <h2 className="text-lg font-bold text-text-primary mb-4">
              Shipping Information
            </h2>
            <div className="space-y-3">
              {order.shippingInfo ? (
                <>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-text-muted mt-1 flex-shrink-0" />
                    <div className="text-sm">
                      <div className="font-medium text-text-primary">
                        {order.shippingInfo.firstName} {order.shippingInfo.lastName}
                      </div>
                      <div className="text-text-secondary mt-1">
                        {order.shippingInfo.address}
                        <br />
                        {order.shippingInfo.city}, {order.shippingInfo.state}{" "}
                        {order.shippingInfo.zipCode}
                        <br />
                        {order.shippingInfo.country}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-text-muted flex-shrink-0" />
                    <span className="text-sm text-text-secondary">
                      {order.shippingInfo.email}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-text-muted flex-shrink-0" />
                    <span className="text-sm text-text-secondary">
                      {order.shippingInfo.phone}
                    </span>
                  </div>
                </>
              ) : (
                <div className="text-center py-4 text-text-muted">
                  No shipping information available
                </div>
              )}
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-surface border border-border rounded-2xl p-6">
            <h2 className="text-lg font-bold text-text-primary mb-4">
              Payment Information
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <CreditCard className="w-4 h-4 text-text-muted" />
                <span className="text-sm text-text-secondary capitalize">
                  {order.paymentMethod ? order.paymentMethod.replace("_", " ") : "N/A"}
                </span>
              </div>

              {order.trackingNumber && (
                <div className="bg-background border border-border rounded-lg p-3">
                  <div className="text-xs text-text-muted mb-1">
                    Tracking Number
                  </div>
                  <div className="font-mono text-sm text-text-primary">
                    {order.trackingNumber}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Order Modal - Only show for non-admin */}
      {!adminView && showCancelModal && (
        <CancelOrderModal
          onCancel={(reason) => handleCancelOrder(reason)}
          onClose={() => setShowCancelModal(false)}
        />
      )}
    </div>
  );
}

// Cancel Order Modal Component
function CancelOrderModal({onCancel, onClose}) {
  const [reason, setReason] = useState("");
  const [otherReason, setOtherReason] = useState("");

  const reasons = [
    "Changed my mind",
    "Found a better price elsewhere",
    "Ordered by mistake",
    "Item no longer needed",
    "Shipping takes too long",
    "Other",
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalReason = reason === "Other" ? otherReason : reason;
    if (finalReason.trim()) {
      onCancel(finalReason);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-surface border border-border rounded-2xl p-6 w-full max-w-md">
        <h3 className="text-lg font-bold text-text-primary mb-4">
          Cancel Order
        </h3>
        <p className="text-text-secondary mb-6">
          Please tell us why you want to cancel this order.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            {reasons.map((reasonOption) => (
              <label
                key={reasonOption}
                className="flex items-center gap-3 cursor-pointer"
              >
                <input
                  type="radio"
                  name="reason"
                  value={reasonOption}
                  checked={reason === reasonOption}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-4 h-4 text-primary border-border focus:ring-primary"
                />
                <span className="text-sm text-text-secondary">
                  {reasonOption}
                </span>
              </label>
            ))}
          </div>

          {reason === "Other" && (
            <textarea
              value={otherReason}
              onChange={(e) => setOtherReason(e.target.value)}
              placeholder="Please specify..."
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              rows={3}
              required
            />
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Keep Order
            </Button>
            <Button
              type="submit"
              disabled={!reason || (reason === "Other" && !otherReason.trim())}
              className="flex-1 bg-error hover:bg-error/90 text-white"
            >
              Cancel Order
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}