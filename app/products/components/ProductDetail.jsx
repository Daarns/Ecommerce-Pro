"use client";
import {useState, useEffect} from "react";
import Image from "next/image";
import {
  Star,
  Heart,
  ShoppingCart,
  Minus,
  Plus,
  Truck,
  Shield,
  RotateCcw,
  Check,
  X,
  Info
} from "lucide-react";
import {Button} from "@/app/components/ui/Button";
import {formatPrice} from "@/app/lib/utils";
import {useCart} from "@/app/contexts/CartContext";
import { getCategoryInfo, categoryHasSizes } from '@/app/data/dummy-data'

export function ProductDetail({product}) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [editingQuantity, setEditingQuantity] = useState(false);
  const [tempQuantity, setTempQuantity] = useState("");

  const {addToCart} = useCart();

  // Check if this category has sizes or variants
  const categoryInfo = getCategoryInfo(product.category)
  const hasSizes = categoryHasSizes(product.category)

  // Mock additional images (in real app, this would come from product data)
  const images = [product.image, product.image, product.image, product.image];

  // Initialize selected variant if product has variants
  useEffect(() => {
    if (product.variants && product.variants.length > 0 && !selectedVariant) {
      setSelectedVariant(product.variants[0])
    }
  }, [product.variants, selectedVariant])

  // Initialize selected color if product has colors
  useEffect(() => {
    if (product.colors && product.colors.length > 0 && !selectedColor) {
      setSelectedColor(product.colors[0])
    }
  }, [product.colors, selectedColor])

  useEffect(() => {
    // Cek apakah produk sudah ada di wishlist saat komponen mount/produk berubah
    const stored = localStorage.getItem("wishlist");
    if (stored) {
      setIsWishlisted(
        JSON.parse(stored).some((item) => item.id === product.id)
      );
    } else {
      setIsWishlisted(false);
    }
  }, [product.id]);

  const handleWishlist = () => {
    const stored = localStorage.getItem("wishlist");
    let wishlist = stored ? JSON.parse(stored) : [];
    if (wishlist.some((item) => item.id === product.id)) {
      // Hapus dari wishlist
      wishlist = wishlist.filter((item) => item.id !== product.id);
      setIsWishlisted(false);
    } else {
      // Tambahkan ke wishlist
      wishlist.push(product);
      setIsWishlisted(true);
    }
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  };

  // Get available stock based on selected options
  const getAvailableStock = () => {
    if (hasSizes && selectedSize && product.sizes) {
      const sizeOption = product.sizes.find(s => s.value === selectedSize)
      return sizeOption ? sizeOption.stock : 0
    }
    
    if (selectedVariant && product.variants) {
      const variantOption = product.variants.find(v => v.value === selectedVariant.value)
      return variantOption ? variantOption.stock : 0
    }
    
    return product.stock
  }

  // Get sizes based on category
  const getProductSizes = () => {
    if (product.sizes) return product.sizes
    
    // Fallback mock sizes if not in product data
    if (hasSizes) {
      if (product.subcategory === 'Shoes') {
        return ['36', '37', '38', '39', '40', '41', '42', '43', '44'].map(size => ({ value: size, stock: 5 }))
      } else {
        return ['XS', 'S', 'M', 'L', 'XL', 'XXL'].map(size => ({ value: size, stock: 3 }))
      }
    }
    
    return []
  }

  // Get colors from product or fallback
  const getProductColors = () => {
    if (product.colors) return product.colors
    return ['Black', 'White', 'Gray', 'Navy'] // Fallback colors
  }

  const getDiscountPercentage = () => {
    if (product.originalPrice) {
      return Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      );
    }
    return product.discount || 0;
  };

  const handleQuantityChange = (action) => {
    const maxStock = getAvailableStock()
    
    if (action === "increase") {
      setQuantity((prev) => Math.min(prev + 1, maxStock));
    } else if (action === "decrease") {
      setQuantity((prev) => Math.max(prev - 1, 1));
    }
  };

  const handleAddToCart = async () => {
    setIsAdding(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Prepare cart item data
    const cartItemData = {
      quantity,
      color: selectedColor,
    }

    // Add size or variant based on product type
    if (hasSizes && selectedSize) {
      cartItemData.size = selectedSize
    } else if (selectedVariant) {
      cartItemData.variant = selectedVariant.value
      cartItemData.variantType = selectedVariant.type
    }

    addToCart(product, cartItemData);

    setIsAdding(false);
    setShowSuccess(true);

    // Hide success message after 3 seconds
    setTimeout(() => setShowSuccess(false), 3000);
  };

  // Check if can add to cart
  const canAddToCart = () => {
    // Check stock
    if (getAvailableStock() === 0) return false
    
    // Check required selections
    if (hasSizes && !selectedSize) return false
    if (product.variants && product.variants.length > 0 && !selectedVariant) return false
    if (getProductColors().length > 0 && !selectedColor) return false
    
    return true
  }

  const handleQuantityClick = () => {
    setEditingQuantity(true);
    setTempQuantity(quantity.toString());
  };

  const handleQuantityInputChange = (value) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    setTempQuantity(numericValue);
  };

  const handleQuantitySave = () => {
    const newQuantity = parseInt(tempQuantity) || 1;
    const maxStock = getAvailableStock()
    const finalQuantity = Math.min(Math.max(newQuantity, 1), maxStock);
    setQuantity(finalQuantity);
    setEditingQuantity(false);
    setTempQuantity("");
  };

  const handleQuantityCancel = () => {
    setEditingQuantity(false);
    setTempQuantity("");
  };

  const handleQuantityInputKeyDown = (e) => {
    if (e.key === "Enter") {
      handleQuantitySave();
    } else if (e.key === "Escape") {
      handleQuantityCancel();
    }
  };

  const handleQuantityInputBlur = () => {
    handleQuantitySave();
  };

  // Get validation messages
  const getValidationMessage = () => {
    const missing = []
    
    if (hasSizes && !selectedSize) missing.push('size')
    if (product.variants && product.variants.length > 0 && !selectedVariant) {
      missing.push(product.variants[0].type === 'storage' ? 'storage option' : 'variant')
    }
    if (getProductColors().length > 0 && !selectedColor) missing.push('color')
    
    if (missing.length === 0) return null
    
    return `Please select ${missing.join(' and ')} before adding to cart.`
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
      {/* Product Images */}
      <div className="space-y-4">
        {/* Main Image */}
        <div className="aspect-square rounded-2xl overflow-hidden bg-surface">
          <Image
            src={images[selectedImage]}
            alt={product.name}
            width={600}
            height={600}
            className="w-full h-full object-cover"
            priority
          />
        </div>

        {/* Thumbnail Images */}
        <div className="grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                selectedImage === index
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-border hover:border-border/60"
              }`}
            >
              <Image
                src={image}
                alt={`${product.name} ${index + 1}`}
                width={150}
                height={150}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Product Information */}
      <div className="space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
              {product.category}
            </span>
            {product.isNew && (
              <span className="px-3 py-1 bg-success/10 text-success text-sm font-medium rounded-full">
                NEW
              </span>
            )}
            {product.bestSeller && (
              <span className="px-3 py-1 bg-accent/10 text-accent text-sm font-medium rounded-full">
                BESTSELLER
              </span>
            )}
          </div>

          <h1 className="text-2xl lg:text-3xl font-bold text-text-primary mb-4">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating)
                      ? "text-yellow-400 fill-current"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-text-secondary text-sm">
              {product.rating} ({product.sold} sold)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-3xl font-bold text-text-primary">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <>
                <span className="text-xl text-text-muted line-through">
                  {formatPrice(product.originalPrice)}
                </span>
                <span className="px-2 py-1 bg-error text-white text-sm font-bold rounded">
                  -{getDiscountPercentage()}%
                </span>
              </>
            )}
          </div>

          {/* Stock Status */}
          <div className="flex items-center gap-2 mb-6">
            <div
              className={`w-3 h-3 rounded-full ${
                getAvailableStock() > 10
                  ? "bg-success"
                  : getAvailableStock() > 0
                  ? "bg-warning"
                  : "bg-error"
              }`}
            ></div>
            <span
              className={`text-sm font-medium ${
                getAvailableStock() > 10
                  ? "text-success"
                  : getAvailableStock() > 0
                  ? "text-warning"
                  : "text-error"
              }`}
            >
              {getAvailableStock() > 10
                ? "In Stock"
                : getAvailableStock() > 0
                ? `Only ${getAvailableStock()} left`
                : "Out of Stock"}
            </span>
          </div>
        </div>

        {/* Product Options */}
        <div className="space-y-6">
          {/* Color Selection */}
          {getProductColors().length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-text-primary mb-3">
                Color {!selectedColor && <span className="text-error">*</span>}
              </h3>
              <div className="flex flex-wrap gap-2">
                {getProductColors().map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 border rounded-xl text-sm font-medium transition-all ${
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

          {/* Size Selection - Only show for categories that have sizes */}
          {hasSizes && getProductSizes().length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-text-primary mb-3">
                Size {!selectedSize && <span className="text-error">*</span>}
              </h3>
              <div className="grid grid-cols-6 gap-2">
                {getProductSizes().map((sizeOption) => (
                  <button
                    key={sizeOption.value}
                    onClick={() => setSelectedSize(sizeOption.value)}
                    disabled={sizeOption.stock === 0}
                    className={`py-3 px-2 text-sm border-2 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed relative ${
                      selectedSize === sizeOption.value
                        ? "border-primary bg-primary text-white"
                        : sizeOption.stock > 0
                        ? "border-border text-text-secondary hover:border-primary hover:text-primary"
                        : "border-border text-text-muted"
                    }`}
                  >
                    {sizeOption.value}
                    {sizeOption.stock === 0 && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-full h-0.5 bg-error rotate-45"></div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
              {selectedSize && (
                <div className="mt-2 flex items-center gap-2">
                  <Info className="w-4 h-4 text-text-muted" />
                  <p className="text-sm text-text-secondary">
                    Size {selectedSize}: {getProductSizes().find(s => s.value === selectedSize)?.stock || 0} available
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Variant Selection - For categories without sizes but with variants */}
          {!hasSizes && product.variants && product.variants.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-text-primary mb-3">
                {product.variants[0].type === 'storage' ? 'Storage' : 
                 product.variants[0].type === 'edition' ? 'Edition' : 'Variant'}
                {!selectedVariant && <span className="text-error">*</span>}
              </h3>
              <div className="space-y-2">
                {product.variants.map((variant) => (
                  <button
                    key={variant.value}
                    onClick={() => setSelectedVariant(variant)}
                    disabled={variant.stock === 0}
                    className={`w-full p-3 text-left border-2 rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                      selectedVariant?.value === variant.value
                        ? 'border-primary bg-primary text-white'
                        : variant.stock > 0
                        ? 'border-border text-text-secondary hover:border-primary hover:text-primary'
                        : 'border-border text-text-muted'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{variant.value}</span>
                      <span className="text-sm opacity-75">
                        {variant.stock > 0 ? `${variant.stock} available` : 'Out of stock'}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-3">
              Quantity
            </h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-border rounded-xl">
                <button
                  onClick={() => handleQuantityChange("decrease")}
                  disabled={quantity <= 1}
                  className="p-3 hover:bg-surface-elevated transition-colors disabled:opacity-50"
                >
                  <Minus className="w-4 h-4" />
                </button>

                {/* Simple Editable Quantity Input */}
                {editingQuantity ? (
                  <input
                    type="text"
                    value={tempQuantity}
                    onChange={(e) => handleQuantityInputChange(e.target.value)}
                    onBlur={handleQuantityInputBlur}
                    onKeyDown={handleQuantityInputKeyDown}
                    className="w-20 py-3 text-text-primary font-medium text-center bg-transparent focus:outline-none focus:bg-background/50 rounded"
                    autoFocus
                    maxLength="3"
                  />
                ) : (
                  <button
                    onClick={handleQuantityClick}
                    className="px-4 py-3 text-text-primary font-medium min-w-[5rem] text-center hover:bg-surface-elevated transition-colors rounded"
                    title="Click to edit quantity"
                  >
                    {quantity}
                  </button>
                )}

                <button
                  onClick={() => handleQuantityChange("increase")}
                  disabled={quantity >= getAvailableStock()}
                  className="p-3 hover:bg-surface-elevated transition-colors disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <span className="text-text-secondary text-sm">
                {getAvailableStock()} items available
              </span>
            </div>
          </div>
        </div>

        {/* Selection Summary */}
        {(selectedSize || selectedVariant || selectedColor) && (
          <div className="p-4 bg-surface-elevated rounded-xl border border-border">
            <h4 className="font-medium text-text-primary mb-2">Your Selection:</h4>
            <div className="space-y-1 text-sm text-text-secondary">
              {selectedColor && (
                <div className="flex items-center gap-2">
                  <span>Color:</span>
                  <span className="font-medium text-text-primary">{selectedColor}</span>
                </div>
              )}
              {selectedSize && (
                <div className="flex items-center gap-2">
                  <span>Size:</span>
                  <span className="font-medium text-text-primary">{selectedSize}</span>
                </div>
              )}
              {selectedVariant && (
                <div className="flex items-center gap-2">
                  <span>{selectedVariant.type}:</span>
                  <span className="font-medium text-text-primary">{selectedVariant.value}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <span>Quantity:</span>
                <span className="font-medium text-text-primary">{quantity}</span>
              </div>
              <div className="pt-2 border-t border-border/50">
                <div className="flex items-center gap-2">
                  <span>Total:</span>
                  <span className="font-bold text-text-primary text-lg">
                    {formatPrice(product.price * quantity)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            onClick={handleAddToCart}
            disabled={!canAddToCart() || isAdding}
            className={`flex-1 h-12 transition-all ${
              showSuccess
                ? "bg-success hover:bg-success text-white"
                : "bg-primary hover:bg-primary-hover text-white"
            }`}
          >
            {isAdding ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
            ) : showSuccess ? (
              <Check className="w-4 h-4 mr-2" />
            ) : (
              <ShoppingCart className="w-4 h-4 mr-2" />
            )}
            {isAdding
              ? "Adding..."
              : showSuccess
              ? "Added to Cart!"
              : getAvailableStock() === 0
              ? "Out of Stock"
              : "Add to Cart"}
          </Button>

          <Button
            variant="outline"
            onClick={handleWishlist}
            className={`h-12 px-4 ${
              isWishlisted
                ? "border-error text-error hover:bg-error hover:text-white"
                : "border-border text-text-secondary hover:text-text-primary"
            }`}
          >
            <Heart
              className={`w-4 h-4 ${
                isWishlisted ? "fill-current text-error" : ""
              }`}
            />
          </Button>
        </div>

        {/* Option Validation Message */}
        {!canAddToCart() && getAvailableStock() > 0 && (
          <div className="p-3 bg-warning/10 border border-warning/20 rounded-xl">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-warning mt-0.5 flex-shrink-0" />
              <p className="text-sm text-warning">
                {getValidationMessage()}
              </p>
            </div>
          </div>
        )}

        {/* Benefits */}
        <div className="space-y-3 pt-6 border-t border-border">
          <div className="flex items-center gap-3 text-text-secondary">
            <Truck className="w-4 h-4 text-primary" />
            <span className="text-sm">
              Free shipping on orders over Rp 500K
            </span>
          </div>
          <div className="flex items-center gap-3 text-text-secondary">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-sm">1 year warranty included</span>
          </div>
          <div className="flex items-center gap-3 text-text-secondary">
            <RotateCcw className="w-4 h-4 text-primary" />
            <span className="text-sm">30-day return policy</span>
          </div>
        </div>

        {/* Product Description */}
        <div className="pt-6 border-t border-border">
          <h3 className="text-lg font-semibold text-text-primary mb-3">
            Description
          </h3>
          <div className="prose prose-sm max-w-none text-text-secondary">
            <p>
              Experience premium quality with the {product.name}. This carefully
              crafted product combines modern design with exceptional
              functionality, making it perfect for everyday use.
            </p>
            <p>
              Features include high-quality materials, attention to detail, and
              a design that stands the test of time. Whether you're looking for
              style, comfort, or performance, this product delivers on all
              fronts.
            </p>
            
            {/* Category-specific features */}
            {hasSizes && (
              <p>
                Available in multiple sizes to ensure the perfect fit. Each size 
                is carefully crafted to maintain the same quality and design standards.
              </p>
            )}
            
            {categoryInfo?.hasVariants && !hasSizes && (
              <p>
                Available in different {product.variants?.[0]?.type || 'variants'} to 
                meet your specific needs and preferences.
              </p>
            )}
          </div>
        </div>

        {/* Category Info */}
        <div className="pt-6 border-t border-border">
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">Category:</span>
            <span className="font-medium text-text-primary">{product.category}</span>
          </div>
          {product.subcategory && (
            <div className="flex items-center justify-between text-sm mt-1">
              <span className="text-text-secondary">Type:</span>
              <span className="font-medium text-text-primary">{product.subcategory}</span>
            </div>
          )}
          <div className="flex items-center justify-between text-sm mt-1">
            <span className="text-text-secondary">Sizing:</span>
            <span className="font-medium text-text-primary">
              {hasSizes ? 'Available' : 'Not applicable'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}