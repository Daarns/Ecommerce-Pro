"use client";
import {useState, useEffect} from "react";
import Image from "next/image";
import {ShoppingCart, Plus, Minus, X} from "lucide-react";
import {Button} from "@/app/components/ui/Button";
import {formatPrice} from "@/app/lib/utils";
import {ModalPortal} from "./ModalPortal";

export function QuickAddModal({
  product,
  quantity,
  onQuantityChange,
  onConfirm,
  onClose,
  isAdding,
}) {
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedColor, setSelectedColor] = useState("");

  useEffect(() => {
    setSelectedSize("");
    setSelectedVariant(
      product.variants?.length > 0 ? product.variants[0] : null
    );
    setSelectedColor(
      product.colors?.length > 0 ? product.colors[0] : ""
    );
  }, [product]);

  const sizes = getProductSizes(product);
  const colors = getProductColors(product);
  const variants = product.variants || [];
  const availableStock = getAvailableStock(
    product,
    selectedSize,
    selectedVariant
  );

  const canAdd = () => {
    if (sizes.length > 0 && !selectedSize) return false;
    if (variants.length > 0 && !selectedVariant) return false;
    if (colors.length > 0 && !selectedColor) return false;
    if (availableStock === 0) return false;
    return true;
  };

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
    <ModalPortal>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        <div className="relative w-full max-w-md bg-background rounded-2xl shadow-2xl">
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
                          ? "border-primary bg-primary text-primary-text"
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
                    : "Variant"}{" "}
                  <span className="text-error">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {variants.map((variant) => (
                    <button
                      key={variant.value}
                      onClick={() => setSelectedVariant(variant)}
                      disabled={variant.stock === 0}
                      className={`py-2 px-3 text-xs sm:text-sm border-2 rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed relative overflow-hidden ${
                        selectedVariant?.value === variant.value
                          ? "border-primary bg-primary text-primary-text"
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
                          ? "border-primary bg-primary text-primary-text"
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
                <span className="text-xs sm:text-sm text-text-secondary">
                  Subtotal:
                </span>
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
                className="flex-1 bg-primary hover:bg-primary-hover text-primary-text"
                disabled={!canAdd() || isAdding}
              >
                {isAdding ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-text/30 border-t-primary-text rounded-full animate-spin mr-2" />
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
                Please select all required options and make sure stock is
                available.
              </p>
            )}
          </div>
        </div>
      </div>
    </ModalPortal>
  );
}

// Helper functions
export function getProductSizes(product) {
  if (product.sizes) return product.sizes;
  if (product.category?.toLowerCase() === "shoes") {
    return ["36", "37", "38", "39", "40", "41", "42", "43", "44"].map(
      (size) => ({value: size, stock: 5})
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

export function getProductColors(product) {
  if (product.colors) return product.colors;
  return [];
}

export function getAvailableStock(product, selectedSize, selectedVariant) {
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
