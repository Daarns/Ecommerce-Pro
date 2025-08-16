"use client";
import {Fragment} from "react";
import {X, Plus, Minus, ShoppingBag, Trash2} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {useCart} from "@/app/contexts/CartContext";
import {formatPrice} from "@/app/lib/utils";
import {Button} from "@/app/components/ui/Button";

export function CartSidebar() {
  const {
    isOpen,
    toggleCart,
    items,
    totalItems,
    totalPrice,
    updateQuantity,
    removeFromCart,
  } = useCart();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={toggleCart}
      />

      {/* Sidebar */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-background shadow-2xl z-50 transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-text-primary">
                Shopping Cart ({totalItems})
              </h2>
            </div>
            <button
              onClick={toggleCart}
              className="p-2 hover:bg-surface rounded-xl transition-colors"
            >
              <X className="w-5 h-5 text-text-muted" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-surface rounded-full flex items-center justify-center">
                  <ShoppingBag className="w-8 h-8 text-text-muted" />
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  Your cart is empty
                </h3>
                <p className="text-text-secondary mb-6">
                  Add some products to get started
                </p>
                <Button
                  onClick={toggleCart}
                  className="bg-primary hover:bg-primary-hover"
                  style={{color: "var(--primary-text)"}}
                >
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-4 bg-surface rounded-xl"
                  >
                    {/* Product Image */}
                    <div className="w-16 h-16 flex-shrink-0">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-text-primary truncate">
                        {item.product.name}
                      </h4>
                      <div className="text-sm text-text-secondary">
                        {item.size && <span>Size: {item.size}</span>}
                        {item.size && item.color && <span> • </span>}
                        {item.color && <span>Color: {item.color}</span>}
                      </div>
                      <div className="text-sm font-bold text-primary">
                        {formatPrice(item.product.price)}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-border rounded-lg">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="p-1 hover:bg-surface-elevated transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-3 py-1 text-sm font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="p-1 hover:bg-surface-elevated transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="p-6 border-t border-border bg-surface">
              <div className="space-y-4">
                {/* Total */}
                <div className="flex items-center justify-between text-lg font-bold">
                  <span className="text-text-primary">Total:</span>
                  <span className="text-primary">
                    {formatPrice(totalPrice)}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="mt-2">
                  <Link href="/cart" onClick={toggleCart}>
                    <Button variant="outline" className="w-full">
                      View Cart
                    </Button>
                  </Link>
                </div>
                <div className="mt-2">
                  <Link href="/checkout" onClick={toggleCart}>
                    <Button className="w-full bg-primary hover:bg-primary-hover text-primary-text">
                      Checkout
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
