"use client";
import {useState, useEffect} from "react";
import Link from "next/link";
import Image from "next/image";
import {ShoppingCart, Heart, Plus, Minus, X, Check} from "lucide-react";
import {useCart} from "@/app/contexts/CartContext";
import {formatPrice, calculateDiscount, cn} from "@/app/lib/utils";
import {Button} from "@/app/components/ui/Button";

export function ProductCard({product, className, viewMode = "grid"}) {
  const {addToCart} = useCart();
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("wishlist");
    if (stored) {
      setIsWishlisted(
        JSON.parse(stored).some((item) => item.id === product.id)
      );
    } else {
      setIsWishlisted(false);
    }
  }, [product.id]);

  const handleWishlist = (e) => {
    e.preventDefault(); // agar tidak trigger link ke detail
    const stored = localStorage.getItem("wishlist");
    let wishlist = stored ? JSON.parse(stored) : [];
    if (wishlist.some((item) => item.id === product.id)) {
      wishlist = wishlist.filter((item) => item.id !== product.id);
      setIsWishlisted(false);
    } else {
      wishlist.push(product);
      setIsWishlisted(true);
    }
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  };

  const calculateSavings = () => {
    if (product.originalPrice && product.price) {
      return product.originalPrice - product.price;
    }
    return 0;
  };

  const getDiscountPercentage = () => {
    return calculateDiscount(product.originalPrice, product.price);
  };

  const handleQuickAddClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.stock <= 0) return;

    setQuantity(1);
    setShowQuickAdd(true);
  };

  const handleQuantityChange = (action) => {
    if (action === "increase") {
      setQuantity((prev) => Math.min(prev + 1, product.stock));
    } else if (action === "decrease") {
      setQuantity((prev) => Math.max(prev - 1, 1));
    }
  };

  const handleConfirmAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (quantity <= 0) {
      setShowQuickAdd(false);
      return;
    }

    setIsAdding(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    addToCart(product, {quantity});

    setIsAdding(false);
    setShowSuccess(true);
    setShowQuickAdd(false);

    // Hide success message
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const handleCloseModal = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowQuickAdd(false);
    setQuantity(1);
  };

  if (viewMode === "list") {
    return (
      <>
        <div
          className={cn(
            "group bg-surface border border-border rounded-2xl p-6 hover:shadow-lg hover:border-primary transition-all duration-300",
            className
          )}
        >
          <div className="flex gap-6">
            {/* Product Image */}
            <Link href={`/products/${product.id}`} className="flex-shrink-0">
              <div className="w-32 h-32 rounded-xl overflow-hidden bg-background-secondary">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={128}
                  height={128}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </Link>

            {/* Product Info */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <Link href={`/products/${product.id}`}>
                  <h3 className="font-semibold text-text-primary group-hover:text-primary transition-colors line-clamp-2 mb-2">
                    {product.name}
                  </h3>
                </Link>

                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xl font-bold text-primary">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && (
                    <>
                      <span className="text-sm text-text-muted line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                      <span className="px-2 py-1 bg-error text-white text-xs font-bold rounded">
                        -{getDiscountPercentage()}%
                      </span>
                    </>
                  )}
                </div>

                {/* Stock Status */}
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      product.stock > 10
                        ? "bg-success"
                        : product.stock > 0
                        ? "bg-warning"
                        : "bg-error"
                    }`}
                  ></div>
                  <span
                    className={`text-xs font-medium ${
                      product.stock > 10
                        ? "text-success"
                        : product.stock > 0
                        ? "text-warning"
                        : "text-error"
                    }`}
                  >
                    {product.stock > 10
                      ? "In Stock"
                      : product.stock > 0
                      ? `Only ${product.stock} left`
                      : "Out of Stock"}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 mt-4">
                <Button
                  onClick={handleQuickAddClick}
                  disabled={product.stock <= 0 || showSuccess}
                  size="sm"
                  className={`${
                    showSuccess
                      ? "bg-success text-white"
                      : "bg-primary hover:bg-primary-hover text-white"
                  } transition-all`}
                >
                  {showSuccess ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Added!
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Quick Add
                    </>
                  )}
                </Button>

                <button className="p-2 text-text-muted hover:text-error transition-colors">
                  <Heart className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Add Modal for List View */}
        {showQuickAdd && (
          <QuickAddModal
            product={product}
            quantity={quantity}
            onQuantityChange={handleQuantityChange}
            onConfirm={handleConfirmAdd}
            onClose={handleCloseModal}
            isAdding={isAdding}
          />
        )}
      </>
    );
  }

  // Grid View (default)
  return (
    <>
      <div
        className={cn(
          "group bg-surface border border-border rounded-xl overflow-hidden hover:shadow-lg hover:border-primary transition-all duration-300",
          // Remove hover:scale-105 on mobile
          "sm:hover:scale-105",
          className
        )}
      >
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-background-secondary">
          <Link href={`/products/${product.id}`}>
            <Image
              src={product.image}
              alt={product.name}
              width={300}
              height={300}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </Link>

          {/* Discount Badge - Adjusted size for mobile */}
          {product.originalPrice && (
            <div className="absolute top-2 left-2 bg-error text-white px-1.5 py-0.5 rounded text-[10px] sm:text-xs font-medium sm:font-bold">
              -{getDiscountPercentage()}%
            </div>
          )}

          {/* Wishlist Button - Always visible on mobile */}
          <button
            onClick={handleWishlist}
            className={`
              absolute top-2 right-2 w-7 h-7 sm:w-8 sm:h-8 bg-background/80 backdrop-blur-sm rounded-full 
              flex items-center justify-center sm:opacity-0 sm:group-hover:opacity-100 
              transition-all duration-200 hover:bg-background hover:scale-110
              ${isWishlisted ? "text-error" : "text-text-primary"}
            `}
            aria-label="Add to wishlist"
          >
            <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors ${isWishlisted ? "fill-current" : ""}`} />
          </button>

          {/* Quick Add Button - Hidden on mobile */}
          <div className="absolute bottom-3 left-3 right-3 hidden sm:block opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
            <Button
              onClick={handleQuickAddClick}
              disabled={product.stock <= 0 || showSuccess}
              size="sm"
              className={`w-full ${
                showSuccess
                  ? "bg-success text-white"
                  : "bg-background/90 backdrop-blur-sm text-text-primary hover:bg-primary hover:text-text-inverse"
              } border border-border transition-all`}
            >
              {showSuccess ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Added!
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Quick Add
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Product Info - Adjusted padding and typography for mobile */}
        <div className="p-3 sm:p-4">
          <Link href={`/products/${product.id}`}>
            <h3 className="font-medium sm:font-semibold text-sm sm:text-base text-text-primary group-hover:text-primary transition-colors line-clamp-2 mb-1.5 sm:mb-2">
              {product.name}
            </h3>
          </Link>

          {/* Price Section - Stacked layout on mobile */}
          <div className="space-y-1 sm:space-y-0 sm:flex sm:items-center sm:gap-2">
            <span className="text-base sm:text-lg font-bold text-primary block">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-xs sm:text-sm text-text-muted line-through block">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Stock Status - Smaller on mobile */}
          {product.stock <= 10 && (
            <div className="flex items-center gap-1.5 mt-2">
              <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${
                product.stock > 0 ? "bg-warning" : "bg-error"
              }`}></div>
              <span className={`text-[10px] sm:text-xs font-medium ${
                product.stock > 0 ? "text-warning" : "text-error"
              }`}>
                {product.stock > 0
                  ? `Only ${product.stock} left`
                  : "Out of Stock"}
              </span>
            </div>
          )}
        </div>

        {/* Add to Cart Button for Mobile */}
        <div className="px-3 pb-3 block sm:hidden">
          <Button
            onClick={handleQuickAddClick}
            disabled={product.stock <= 0 || showSuccess}
            size="sm"
            className="w-full bg-primary text-white text-xs font-medium py-2"
          >
            {showSuccess ? "Added!" : "Add to Cart"}
          </Button>
        </div>
      </div>

      {/* Quick Add Modal for Grid View */}
      {showQuickAdd && (
        <QuickAddModal
          product={product}
          quantity={quantity}
          onQuantityChange={handleQuantityChange}
          onConfirm={handleConfirmAdd}
          onClose={handleCloseModal}
          isAdding={isAdding}
        />
      )}
    </>
  );
}

// Quick Add Modal Component
function QuickAddModal({
  product,
  quantity,
  onQuantityChange,
  onConfirm,
  onClose,
  isAdding,
}) {
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-background rounded-2xl shadow-2xl z-50 m-4">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-text-primary">
              Quick Add to Cart
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-surface rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-text-muted" />
            </button>
          </div>

          {/* Product Info */}
          <div className="flex gap-4 mb-6">
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-surface flex-shrink-0">
              <Image
                src={product.image}
                alt={product.name}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-text-primary truncate">
                {product.name}
              </h4>
              <div className="text-lg font-bold text-primary">
                {formatPrice(product.price)}
              </div>
              <div className="text-sm text-text-secondary">
                {product.stock} items available
              </div>
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-text-primary mb-3">
              Quantity
            </label>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => onQuantityChange("decrease")}
                disabled={quantity <= 1}
                className="w-10 h-10 rounded-lg border border-border hover:bg-surface disabled:opacity-50 transition-colors flex items-center justify-center"
              >
                <Minus className="w-4 h-4" />
              </button>

              <div className="w-16 h-10 bg-surface border border-border rounded-lg flex items-center justify-center">
                <span className="text-lg font-semibold text-text-primary">
                  {quantity}
                </span>
              </div>

              <button
                onClick={() => onQuantityChange("increase")}
                disabled={quantity >= product.stock}
                className="w-10 h-10 rounded-lg border border-border hover:bg-surface disabled:opacity-50 transition-colors flex items-center justify-center"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {quantity === product.stock && (
              <p className="text-center text-sm text-warning mt-2">
                Maximum quantity reached
              </p>
            )}
          </div>

          {/* Subtotal */}
          <div className="bg-surface rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-text-secondary">Subtotal:</span>
              <span className="text-xl font-bold text-primary">
                {formatPrice(product.price * quantity)}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1"
              disabled={isAdding}
            >
              Cancel
            </Button>
            <Button
              onClick={onConfirm}
              className="flex-1 bg-primary hover:bg-primary-hover text-white"
              disabled={quantity <= 0 || isAdding}
            >
              {isAdding ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Adding...
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </>
              )}
            </Button>
          </div>

          {/* Note for zero quantity */}
          {quantity <= 0 && (
            <p className="text-center text-sm text-error mt-3">
              Quantity must be at least 1 to add to cart
            </p>
          )}
        </div>
      </div>
    </>
  );
}
