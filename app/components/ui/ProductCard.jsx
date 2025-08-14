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
    <div className={cn(
      "group bg-surface border border-border rounded-xl overflow-hidden hover:shadow-lg hover:border-primary transition-all duration-300",
      "sm:hover:scale-105",
      className
    )}>
      {/* Image Section - No changes needed */}
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

      {/* Content Section - New Layout */}
      <div className="flex flex-col h-[160px] sm:h-[180px] p-3 sm:p-4">
        {/* Product Name - Fixed Height */}
        <Link href={`/products/${product.id}`}>
          <h3 className="font-medium text-sm sm:text-base text-text-primary group-hover:text-primary transition-colors line-clamp-2 min-h-[32px] sm:min-h-[40px]">
            {product.name}
          </h3>
        </Link>

        {/* Price Section - Original Price First */}
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

        {/* Stock Status - Fixed Position */}
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

        {/* Add to Cart Button - Fixed Position */}
        <div className="mt-auto">
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
    </div>
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
  // State untuk opsi
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants && product.variants.length > 0 ? product.variants[0] : null
  );
  const [selectedColor, setSelectedColor] = useState(
    product.colors && product.colors.length > 0 ? product.colors[0] : ""
  );

  // Sync default value jika product berubah
  useEffect(() => {
    setSelectedSize("");
    setSelectedVariant(
      product.variants && product.variants.length > 0 ? product.variants[0] : null
    );
    setSelectedColor(
      product.colors && product.colors.length > 0 ? product.colors[0] : ""
    );
  }, [product]);

  const sizes = getProductSizes(product);
  const colors = getProductColors(product);
  const variants = product.variants || [];
  const availableStock = getAvailableStock(product, selectedSize, selectedVariant);

  // Validasi
  const canAdd = () => {
    if (sizes.length > 0 && !selectedSize) return false;
    if (variants.length > 0 && !selectedVariant) return false;
    if (colors.length > 0 && !selectedColor) return false;
    if (availableStock === 0) return false;
    return true;
  };

  // Handler konfirmasi
  const handleConfirm = (e) => {
    e.preventDefault();
    if (!canAdd()) return;
    onConfirm({
      quantity,
      size: selectedSize,
      variant: selectedVariant,
      color: selectedColor,
    });
  };

  return (
    <>
      {/* Backdrop + centered container with padding to keep space from screen edges */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
        {/* clickable backdrop */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Modal panel — max-w-md and container padding ensure space to screen edges on mobile */}
        <div className="relative w-full max-w-md bg-background rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-4 sm:p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="text-base sm:text-lg font-bold text-text-primary">
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
            <div className="flex gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden bg-surface flex-shrink-0">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-text-primary truncate text-sm sm:text-base">
                  {product.name}
                </h4>
                <div className="flex items-center gap-2">
                  <span className="text-base sm:text-lg font-bold text-primary">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xs sm:text-sm text-text-muted line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                  {product.originalPrice && (
                    <span className="px-1 py-0.5 bg-error text-white text-xs font-bold rounded">
                      -{getDiscountPercentage(product)}%
                    </span>
                  )}
                </div>
                <div className="text-xs text-text-secondary">
                  {availableStock} items available
                </div>
              </div>
            </div>

            {/* Size Option */}
            {sizes.length > 0 && (
              <div className="mb-4">
                <label className="block text-xs sm:text-sm font-medium text-text-primary mb-2">
                  Size <span className="text-error">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((sizeOption) => (
                    <button
                      key={sizeOption.value}
                      onClick={() => setSelectedSize(sizeOption.value)}
                      disabled={sizeOption.stock === 0}
                      className={`py-2 px-3 text-xs sm:text-sm border-2 rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed relative overflow-hidden ${
                        selectedSize === sizeOption.value
                          ? "border-primary bg-primary text-white"
                          : sizeOption.stock > 0
                          ? "border-border text-text-secondary hover:border-primary hover:text-primary"
                          : "border-border text-text-muted"
                      }`}
                    >
                      {sizeOption.value}
                      {sizeOption.stock === 0 && (
                        <span
                          className="absolute top-0 left-0 w-[160%] h-[2px] bg-error origin-top-left rotate-45 pointer-events-none"
                          aria-hidden="true"
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Variant/Storage Option */}
            {variants.length > 0 && (
              <div className="mb-4">
                <label className="block text-xs sm:text-sm font-medium text-text-primary mb-2">
                  {variants[0].type === "storage"
                    ? "Storage"
                    : variants[0].type === "edition"
                    ? "Edition"
                    : "Variant"} <span className="text-error">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {variants.map((variant) => (
                    <button
                      key={variant.value}
                      onClick={() => setSelectedVariant(variant)}
                      disabled={variant.stock === 0}
                      className={`py-2 px-3 text-xs sm:text-sm border-2 rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed relative overflow-hidden ${
                        selectedVariant?.value === variant.value
                          ? "border-primary bg-primary text-white"
                          : variant.stock > 0
                          ? "border-border text-text-secondary hover:border-primary hover:text-primary"
                          : "border-border text-text-muted"
                      }`}
                    >
                      {variant.value}
                      {variant.stock === 0 && (
                        <span
                          className="absolute top-0 left-0 w-[160%] h-[2px] bg-error origin-top-left rotate-45 pointer-events-none"
                          aria-hidden="true"
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Option */}
            {colors.length > 0 && (
              <div className="mb-4">
                <label className="block text-xs sm:text-sm font-medium text-text-primary mb-2">
                  Color <span className="text-error">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-3 py-2 text-xs sm:text-sm border rounded-lg transition-all ${
                        selectedColor === color
                          ? "border-primary bg-primary text-white"
                          : "border-border text-text-secondary hover:border-primary hover:text-primary"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="mb-4">
              <label className="block text-xs sm:text-sm font-medium text-text-primary mb-2">
                Quantity
              </label>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => onQuantityChange("decrease")}
                  disabled={quantity <= 1}
                  className="w-9 h-9 rounded-lg border border-border hover:bg-surface disabled:opacity-50 transition-colors flex items-center justify-center"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <div className="w-12 h-9 bg-surface border border-border rounded-lg flex items-center justify-center">
                  <span className="text-base font-semibold text-text-primary">
                    {quantity}
                  </span>
                </div>
                <button
                  onClick={() => onQuantityChange("increase")}
                  disabled={quantity >= availableStock}
                  className="w-9 h-9 rounded-lg border border-border hover:bg-surface disabled:opacity-50 transition-colors flex items-center justify-center"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {quantity === availableStock && (
                <p className="text-center text-xs text-warning mt-2">
                  Maximum quantity reached
                </p>
              )}
            </div>

            {/* Subtotal */}
            <div className="bg-surface rounded-lg p-3 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-xs sm:text-sm text-text-secondary">Subtotal:</span>
                <span className="text-lg sm:text-xl font-bold text-primary">
                  {formatPrice(product.price * quantity)}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                onClick={onClose}
                variant="outline"
                className="flex-1"
                disabled={isAdding}
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirm}
                className="flex-1 bg-primary hover:bg-primary-hover text-white"
                disabled={!canAdd() || isAdding}
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

            {/* Validation */}
            {!canAdd() && (
              <p className="text-center text-xs text-error mt-3">
                Please select all required options and make sure stock is available.
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// Helper untuk ambil size dari data dummy
function getProductSizes(product) {
  if (product.sizes) return product.sizes;
  if (product.category?.toLowerCase() === "shoes") {
    return ["36", "37", "38", "39", "40", "41", "42", "43", "44"].map(
      (size) => ({ value: size, stock: 5 })
    );
  }
  if (
    ["clothing", "fashion", "apparel", "women", "men"].includes(
      product.category?.toLowerCase()
    )
  ) {
    return ["XS", "S", "M", "L", "XL", "XXL"].map((size) => ({
      value: size,
      stock: 3,
    }));
  }
  return [];
}

function getProductColors(product) {
  if (product.colors) return product.colors;
  return [];
}

function getAvailableStock(product, selectedSize, selectedVariant) {
  if (selectedSize && product.sizes) {
    const sizeOption = product.sizes.find((s) => s.value === selectedSize);
    return sizeOption ? sizeOption.stock : 0;
  }
  if (selectedVariant && product.variants) {
    const variantOption = product.variants.find(
      (v) => v.value === selectedVariant.value
    );
    return variantOption ? variantOption.stock : 0;
  }
  return product.stock;
}

function getDiscountPercentage(product) {
  if (product.originalPrice) {
    return Math.round(
      ((product.originalPrice - product.price) / product.originalPrice) * 100
    );
  }
  return 0;
}
