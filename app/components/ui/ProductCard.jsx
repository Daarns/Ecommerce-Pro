"use client";
import {useState, useEffect} from "react";
import Link from "next/link";
import Image from "next/image";
import {ShoppingCart, Heart, Check} from "lucide-react";
import {useCart} from "@/app/contexts/CartContext";
import {formatPrice, calculateDiscount, cn} from "@/app/lib/utils";
import {Button} from "@/app/components/ui/Button";
import {QuickAddModal} from "./modal/QuickAddModal";

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
      setIsWishlisted(JSON.parse(stored).some((item) => item.id === product.id));
    }
  }, [product.id]);

  const handleWishlist = (e) => {
    e.preventDefault();
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

  const handleConfirmAdd = async (options) => {
    setIsAdding(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    addToCart(product, options);
    setIsAdding(false);
    setShowSuccess(true);
    setShowQuickAdd(false);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const handleCloseModal = () => {
    setShowQuickAdd(false);
    setQuantity(1);
  };

  // Grid View (default)
  return (
    <div className={cn(
      "group bg-surface border border-border rounded-xl overflow-hidden hover:shadow-lg hover:border-primary transition-all duration-300",
      "sm:hover:scale-105",
      className
    )}>
      {/* Image Section */}
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

        {/* Discount Badge */}
        {product.originalPrice && (
          <div className="absolute top-2 left-2 bg-error text-white px-1.5 py-0.5 rounded text-[10px] sm:text-xs font-medium sm:font-bold">
            -{getDiscountPercentage()}%
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className={`
            absolute top-2 right-2 w-7 h-7 sm:w-8 sm:h-8 bg-background/80 backdrop-blur-sm rounded-full 
            flex items-center justify-center sm:opacity-0 sm:group-hover:opacity-100 
            transition-all duration-200 hover:bg-background hover:scale-110
            ${isWishlisted ? "text-error" : "text-text-primary"}
          `}
        >
          <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isWishlisted ? "fill-current" : ""}`} />
        </button>
      </div>

      {/* Content Section */}
      <div className="flex flex-col h-[160px] sm:h-[180px] p-3 sm:p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-medium text-sm sm:text-base text-text-primary group-hover:text-primary transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        <div className="flex flex-col mt-2">
          {product.originalPrice && (
            <span className="text-xs sm:text-sm text-text-muted line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
          <span className="text-sm sm:text-base font-bold text-primary">
            {formatPrice(product.price)}
          </span>
        </div>

        <div className="flex-grow">
          {product.stock <= 10 && (
            <div className="flex items-center gap-1.5 mt-2">
              <div className={`w-1.5 h-1.5 rounded-full ${
                product.stock > 0 ? "bg-warning" : "bg-error"
              }`} />
              <span className={`text-[10px] sm:text-xs font-medium ${
                product.stock > 0 ? "text-warning" : "text-error"
              }`}>
                {product.stock > 0 ? `Only ${product.stock} left` : "Out of Stock"}
              </span>
            </div>
          )}
        </div>

        <div className="mt-auto">
          <Button
            onClick={handleQuickAddClick}
            disabled={product.stock <= 0 || showSuccess}
            size="sm"
            className={`w-full ${
              showSuccess
                ? "bg-success text-white"
                : "bg-primary hover:bg-primary-hover"
            } transition-all`}
          >
            {showSuccess ? "Added!" : "Add to Cart"}
          </Button>
        </div>
      </div>

      {/* Quick Add Modal */}
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
    </div>
  );
}
