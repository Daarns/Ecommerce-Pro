"use client";
import {useState} from "react";
import {ChevronDown, ChevronUp, X} from "lucide-react";
import {
  getCategoryInfo,
  categoryHasSizes,
  sizeOptions,
} from "@/app/data/dummy-data";

export function FilterSidebar({currentCategory = null, onFiltersChange}) {
  const [openFilters, setOpenFilters] = useState({
    category: true,
    price: true,
    size: true,
    variant: true,
    rating: true,
    brand: false,
  });

  const [selectedFilters, setSelectedFilters] = useState({
    categories: currentCategory ? [currentCategory.toLowerCase()] : [],
    priceRange: [0, 10000000],
    selectedPriceRange: null,
    rating: 0,
    brands: [],
    sizes: [],
    variants: [],
  });

  // Get category info to determine available filters
  const categoryInfo = getCategoryInfo(currentCategory);
  const hasSizes = categoryHasSizes(currentCategory);

  const categories = [
    {id: "electronics", name: "Electronics", count: 24},
    {id: "fashion", name: "Fashion", count: 18},
    {id: "gaming", name: "Gaming", count: 12},
    {id: "men", name: "Men", count: 20},
    {id: "women", name: "Women", count: 25},
    {id: "kids", name: "Kids", count: 15},
    {id: "sports", name: "Sports", count: 15},
    {id: "home", name: "Home & Living", count: 9},
  ];

  const brands = [
    {id: "nike", name: "Nike", count: 12},
    {id: "adidas", name: "Adidas", count: 8},
    {id: "apple", name: "Apple", count: 6},
    {id: "samsung", name: "Samsung", count: 10},
    {id: "hm", name: "H&M", count: 7},
    {id: "sony", name: "Sony", count: 5},
  ];

  // Get available sizes for current category
  const getAvailableSizes = () => {
    if (!hasSizes || !categoryInfo?.sizeTypes) return [];

    const sizeType = categoryInfo.sizeTypes[0];
    return sizeOptions[sizeType] || [];
  };

  // Get variant options based on category
  const getVariantOptions = () => {
    if (!categoryInfo?.hasVariants) return [];

    switch (currentCategory?.toLowerCase()) {
      case "electronics":
        return [
          {id: "128gb", name: "128GB"},
          {id: "256gb", name: "256GB"},
          {id: "512gb", name: "512GB"},
          {id: "1tb", name: "1TB"},
        ];
      case "gaming":
        return [
          {id: "standard", name: "Standard Edition"},
          {id: "digital", name: "Digital Edition"},
          {id: "special", name: "Special Edition"},
        ];
      default:
        return [];
    }
  };

  const toggleFilter = (filterType) => {
    setOpenFilters((prev) => ({
      ...prev,
      [filterType]: !prev[filterType],
    }));
  };

  const handleCategoryChange = (categoryId) => {
    const newCategories = selectedFilters.categories.includes(categoryId)
      ? selectedFilters.categories.filter((id) => id !== categoryId)
      : [...selectedFilters.categories, categoryId];

    updateFilters({categories: newCategories});
  };

  const handlePriceRangeChange = (range) => {
    updateFilters({
      priceRange: [range.min, range.max],
      selectedPriceRange: range.label,
    });
  };

  const handleSizeChange = (size) => {
    const newSizes = selectedFilters.sizes.includes(size)
      ? selectedFilters.sizes.filter((s) => s !== size)
      : [...selectedFilters.sizes, size];

    updateFilters({sizes: newSizes});
  };

  const handleVariantChange = (variantId) => {
    const newVariants = selectedFilters.variants.includes(variantId)
      ? selectedFilters.variants.filter((v) => v !== variantId)
      : [...selectedFilters.variants, variantId];

    updateFilters({variants: newVariants});
  };

  const handleBrandChange = (brandId) => {
    const newBrands = selectedFilters.brands.includes(brandId)
      ? selectedFilters.brands.filter((b) => b !== brandId)
      : [...selectedFilters.brands, brandId];

    updateFilters({brands: newBrands});
  };

  const handleRatingChange = (rating) => {
    updateFilters({rating});
  };

  const updateFilters = (newFilters) => {
    const updatedFilters = {
      ...selectedFilters,
      ...newFilters,
    };
    setSelectedFilters(updatedFilters);
    onFiltersChange?.(updatedFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      categories: [], // PERBAIKAN: Reset semua kategori, bukan hanya currentCategory
      priceRange: [0, 50000000], // PERBAIKAN: Expanded range
      selectedPriceRange: null,
      rating: 0,
      brands: [],
      sizes: [],
      variants: [],
    };
    setSelectedFilters(clearedFilters);
    onFiltersChange?.(clearedFilters);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (selectedFilters.selectedPriceRange) count++;
    if (selectedFilters.rating > 0) count++;
    if (selectedFilters.brands.length > 0)
      count += selectedFilters.brands.length;
    if (selectedFilters.sizes.length > 0) count += selectedFilters.sizes.length;
    if (selectedFilters.variants.length > 0)
      count += selectedFilters.variants.length;
    if (!currentCategory && selectedFilters.categories.length > 0)
      count += selectedFilters.categories.length;
    return count;
  };

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 sticky top-4 max-h-[80vh] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-bold text-text-primary">Filters</h3>
          {getActiveFiltersCount() > 0 && (
            <span className="px-2 py-1 bg-primary text-white text-xs rounded-full">
              {getActiveFiltersCount()}
            </span>
          )}
        </div>
        <button
          onClick={clearFilters}
          className="text-sm text-primary hover:text-primary-hover transition-colors"
        >
          Clear All
        </button>
      </div>

      <div className="space-y-6">
        {/* Categories - Hide if we're on a specific category page */}
        {!currentCategory && (
          <div>
            <button
              onClick={() => toggleFilter("category")}
              className="flex items-center justify-between w-full text-left"
            >
              <h4 className="font-semibold text-text-primary">Category</h4>
              {openFilters.category ? (
                <ChevronUp className="w-4 h-4 text-text-muted" />
              ) : (
                <ChevronDown className="w-4 h-4 text-text-muted" />
              )}
            </button>

            {openFilters.category && (
              <div className="mt-4 space-y-3">
                {categories.map((category) => (
                  <label
                    key={category.id}
                    className="flex items-center cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={selectedFilters.categories.includes(category.id)}
                      onChange={() => handleCategoryChange(category.id)}
                      className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                    />
                    <span className="ml-3 text-text-secondary group-hover:text-text-primary transition-colors">
                      {category.name} ({category.count})
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Current Category Indicator */}
        {currentCategory && (
          <div className="p-3 bg-primary/10 rounded-xl">
            <div className="flex items-center justify-between">
              <span className="text-primary font-medium capitalize">
                {currentCategory} Category
              </span>
              <div className="w-2 h-2 bg-primary rounded-full"></div>
            </div>
            <p className="text-xs text-primary/70 mt-1">
              {hasSizes
                ? "Size filters available"
                : "Variant filters available"}
            </p>
          </div>
        )}

        {/* Price Range */}
        <div>
          <button
            onClick={() => toggleFilter("price")}
            className="flex items-center justify-between w-full text-left"
          >
            <h4 className="font-semibold text-text-primary">Price Range</h4>
            {openFilters.price ? (
              <ChevronUp className="w-4 h-4 text-text-muted" />
            ) : (
              <ChevronDown className="w-4 h-4 text-text-muted" />
            )}
          </button>

          {openFilters.price && (
            <div className="mt-4 space-y-3">
              {[
                {label: "Under Rp 500K", min: 0, max: 500000},
                {label: "Rp 500K - 1M", min: 500000, max: 1000000},
                {label: "Rp 1M - 5M", min: 1000000, max: 5000000},
                {label: "Rp 5M - 10M", min: 5000000, max: 10000000},
                {label: "Above Rp 10M", min: 10000000, max: 50000000},
              ].map((range) => (
                <label
                  key={range.label}
                  className="flex items-center cursor-pointer group"
                >
                  <input
                    type="radio"
                    name="priceRange"
                    checked={selectedFilters.selectedPriceRange === range.label}
                    onChange={() => handlePriceRangeChange(range)}
                    className="w-4 h-4 text-primary border-border focus:ring-primary"
                  />
                  <span className="ml-3 text-text-secondary group-hover:text-text-primary transition-colors">
                    {range.label}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Sizes - Only show for categories that have sizes */}
        {hasSizes && getAvailableSizes().length > 0 && (
          <div>
            <button
              onClick={() => toggleFilter("size")}
              className="flex items-center justify-between w-full text-left"
            >
              <h4 className="font-semibold text-text-primary">Size</h4>
              {openFilters.size ? (
                <ChevronUp className="w-4 h-4 text-text-muted" />
              ) : (
                <ChevronDown className="w-4 h-4 text-text-muted" />
              )}
            </button>

            {openFilters.size && (
              <div className="mt-4">
                <div className="grid grid-cols-3 gap-2">
                  {getAvailableSizes().map((size) => (
                    <button
                      key={size}
                      onClick={() => handleSizeChange(size)}
                      className={`py-2 px-3 text-xs rounded-lg border-2 transition-all font-medium ${
                        selectedFilters.sizes.includes(size)
                          ? "border-primary bg-primary text-white"
                          : "border-border text-text-secondary hover:border-primary hover:text-primary"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Variants - Only show for categories that have variants but not sizes */}
        {categoryInfo?.hasVariants &&
          !hasSizes &&
          getVariantOptions().length > 0 && (
            <div>
              <button
                onClick={() => toggleFilter("variant")}
                className="flex items-center justify-between w-full text-left"
              >
                <h4 className="font-semibold text-text-primary">
                  {currentCategory === "electronics" ? "Storage" : "Edition"}
                </h4>
                {openFilters.variant ? (
                  <ChevronUp className="w-4 h-4 text-text-muted" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-text-muted" />
                )}
              </button>

              {openFilters.variant && (
                <div className="mt-4 space-y-2">
                  {getVariantOptions().map((variant) => (
                    <label
                      key={variant.id}
                      className="flex items-center cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={selectedFilters.variants.includes(variant.id)}
                        onChange={() => handleVariantChange(variant.id)}
                        className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                      />
                      <span className="ml-3 text-text-secondary group-hover:text-text-primary transition-colors">
                        {variant.name}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}

        {/* Rating */}
        <div>
          <button
            onClick={() => toggleFilter("rating")}
            className="flex items-center justify-between w-full text-left"
          >
            <h4 className="font-semibold text-text-primary">Rating</h4>
            {openFilters.rating ? (
              <ChevronUp className="w-4 h-4 text-text-muted" />
            ) : (
              <ChevronDown className="w-4 h-4 text-text-muted" />
            )}
          </button>

          {openFilters.rating && (
            <div className="mt-4 space-y-3">
              {[4, 3, 2, 1].map((rating) => (
                <label
                  key={rating}
                  className="flex items-center cursor-pointer group"
                >
                  <input
                    type="radio"
                    name="rating"
                    checked={selectedFilters.rating === rating}
                    onChange={() => handleRatingChange(rating)}
                    className="w-4 h-4 text-primary border-border focus:ring-primary"
                  />
                  <span className="ml-3 flex items-center text-text-secondary group-hover:text-text-primary transition-colors">
                    <span className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-sm ${
                            i < rating ? "text-yellow-400" : "text-gray-300"
                          }`}
                        >
                          ⭐
                        </span>
                      ))}
                    </span>
                    <span className="ml-2">& up</span>
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Brands */}
        <div>
          <button
            onClick={() => toggleFilter("brand")}
            className="flex items-center justify-between w-full text-left"
          >
            <h4 className="font-semibold text-text-primary">Brand</h4>
            {openFilters.brand ? (
              <ChevronUp className="w-4 h-4 text-text-muted" />
            ) : (
              <ChevronDown className="w-4 h-4 text-text-muted" />
            )}
          </button>

          {openFilters.brand && (
            <div className="mt-4 space-y-3">
              {brands.map((brand) => (
                <label
                  key={brand.id}
                  className="flex items-center cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={selectedFilters.brands.includes(brand.id)}
                    onChange={() => handleBrandChange(brand.id)}
                    className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                  />
                  <span className="ml-3 text-text-secondary group-hover:text-text-primary transition-colors">
                    {brand.name} ({brand.count})
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Applied Filters Summary */}
      {getActiveFiltersCount() > 0 && (
        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-text-primary">
              Active Filters
            </span>
            <span className="text-xs text-text-muted">
              {getActiveFiltersCount()} active
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedFilters.selectedPriceRange && (
              <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md flex items-center gap-1">
                {selectedFilters.selectedPriceRange}
                <button
                  onClick={() =>
                    handlePriceRangeChange({label: null, min: 0, max: 50000000})
                  }
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
