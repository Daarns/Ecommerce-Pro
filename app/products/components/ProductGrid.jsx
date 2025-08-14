"use client";
import {useState} from "react";
import {ProductCard} from "@/app/components/ui/ProductCard";
import {Grid, List, Filter, ChevronDown, Eye, EyeOff} from "lucide-react";
import {MobileFilterModal} from "./MobileFilterModal";

export function ProductGrid({
  products,
  filters = {},
  category,
  onToggleSidebar,
  sidebarVisible,
  onFiltersChange,
}) {
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("featured");
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Filter products with defensive checks
  const filteredProducts = products.filter((product) => {
    // Jika tidak ada filter apapun, tampilkan semua produk
    const hasAnyFilters =
      (filters.categories &&
        Array.isArray(filters.categories) &&
        filters.categories.length > 0) ||
      filters.selectedPriceRange ||
      (filters.rating && filters.rating > 0) ||
      (filters.sizes &&
        Array.isArray(filters.sizes) &&
        filters.sizes.length > 0) ||
      (filters.brands &&
        Array.isArray(filters.brands) &&
        filters.brands.length > 0) ||
      (filters.variants &&
        Array.isArray(filters.variants) &&
        filters.variants.length > 0) ||
      category;

    if (!hasAnyFilters) {
      return true;
    }

    // Filter kategori dengan normalisasi case
    if (
      filters.categories &&
      Array.isArray(filters.categories) &&
      filters.categories.length > 0
    ) {
      const productCategory = product.category?.toLowerCase() || "";
      if (!filters.categories.includes(productCategory)) {
        return false;
      }
    }

    // Jika ada category dari URL tapi tidak ada filter categories, filter berdasarkan URL category
    if (
      category &&
      (!filters.categories ||
        !Array.isArray(filters.categories) ||
        filters.categories.length === 0)
    ) {
      const productCategory = product.category?.toLowerCase() || "";
      const urlCategory = category.toLowerCase();
      if (productCategory !== urlCategory) {
        return false;
      }
    }

    // Filter harga dengan defensive checks
    if (
      filters.selectedPriceRange &&
      filters.priceRange &&
      Array.isArray(filters.priceRange) &&
      filters.priceRange.length === 2 &&
      typeof filters.priceRange[0] === "number" &&
      typeof filters.priceRange[1] === "number"
    ) {
      if (
        product.price < filters.priceRange[0] ||
        product.price > filters.priceRange[1]
      ) {
        return false;
      }
    }

    // Filter rating
    if (filters.rating && filters.rating > 0) {
      if (Math.floor(product.rating || 0) < filters.rating) {
        return false;
      }
    }

    // Filter sizes
    if (
      filters.sizes &&
      Array.isArray(filters.sizes) &&
      filters.sizes.length > 0 &&
      product.sizes &&
      Array.isArray(product.sizes)
    ) {
      const availableSizes = product.sizes.map((s) => s?.value).filter(Boolean);
      if (!filters.sizes.some((size) => availableSizes.includes(size))) {
        return false;
      }
    }

    // Filter brands dengan penanganan yang lebih robust
    if (
      filters.brands &&
      Array.isArray(filters.brands) &&
      filters.brands.length > 0
    ) {
      let hasMatchingBrand = false;

      // Cek brand property
      if (product.brand) {
        const productBrand = product.brand.toLowerCase();
        hasMatchingBrand = filters.brands.includes(productBrand);
      }

      // Jika tidak ada brand property atau tidak match, cek dari nama produk
      if (!hasMatchingBrand && product.name) {
        const productName = product.name.toLowerCase();
        hasMatchingBrand = filters.brands.some((brand) =>
          productName.includes(brand.toLowerCase())
        );
      }

      if (!hasMatchingBrand) {
        return false;
      }
    }

    // Filter variants dengan defensive checks
    if (
      filters.variants &&
      Array.isArray(filters.variants) &&
      filters.variants.length > 0
    ) {
      if (!product.variants || !Array.isArray(product.variants)) {
        return false;
      }

      const availableVariants = product.variants
        .map((v) => {
          if (typeof v === "string") return v.toLowerCase();
          if (v && v.value) return v.value.toLowerCase();
          if (v && v.name) return v.name.toLowerCase();
          return "";
        })
        .filter(Boolean);

      const hasMatchingVariant = filters.variants.some((variant) => {
        const filterVariant = variant.toLowerCase();
        return availableVariants.some(
          (available) =>
            available.includes(filterVariant) ||
            filterVariant.includes(available)
        );
      });

      if (!hasMatchingVariant) {
        return false;
      }
    }

    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return (a.price || 0) - (b.price || 0);
      case "price-high":
        return (b.price || 0) - (a.price || 0);
      case "rating":
        return (b.rating || 0) - (a.rating || 0);
      case "newest":
        return (b.id || 0) - (a.id || 0);
      default:
        return 0;
    }
  });

  const sortOptions = [
    {value: "featured", label: "Featured"},
    {value: "newest", label: "Newest"},
    {value: "price-low", label: "Price: Low to High"},
    {value: "price-high", label: "Price: High to Low"},
    {value: "rating", label: "Highest Rated"},
  ];

  const handleSortSelect = (value) => {
    setSortBy(value);
    setSortDropdownOpen(false);
  };

  return (
    <div>
      {/* Header with controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-4">
          <p className="text-text-secondary">
            Showing {sortedProducts.length} products
            {category && ` in ${category}`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Hide Sidebar Toggle - Desktop Only */}
          <button
            onClick={onToggleSidebar}
            className="hidden lg:flex items-center gap-2 px-3 py-2 bg-surface border border-border rounded-lg text-text-primary hover:bg-surface-elevated transition-colors"
            title={sidebarVisible ? "Hide Filters" : "Show Filters"}
          >
            {sidebarVisible ? (
              <>
                <EyeOff className="w-4 h-4" />
                <span className="text-sm">Hide Filters</span>
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                <span className="text-sm">Show Filters</span>
              </>
            )}
          </button>

          {/* Mobile Filter Button */}
          <button
            onClick={() => setShowMobileFilters(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-xl text-text-primary hover:bg-surface-elevated transition-colors"
          >
            <Filter className="w-4 h-4" />
            <span className="text-sm">Filters</span>
            {Object.values(filters).some(
              (f) =>
                (Array.isArray(f) && f.length > 0) ||
                (f &&
                  typeof f !== "object" &&
                  f !== 0 &&
                  f !== null &&
                  f !== "")
            ) && (
              <span className="ml-1 px-1.5 py-0.5 bg-primary text-white text-xs rounded-full">
                •
              </span>
            )}
          </button>

          {/* Sort Dropdown */}
          <div className="relative">
            <button
              onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
              className="flex items-center justify-between gap-2 px-4 py-2 bg-surface border border-border rounded-xl text-text-primary hover:bg-surface-elevated transition-colors min-w-[140px]"
            >
              <span className="text-sm">
                {sortOptions.find((opt) => opt.value === sortBy)?.label}
              </span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  sortDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {sortDropdownOpen && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setSortDropdownOpen(false)}
                />

                {/* Dropdown Content */}
                <div className="absolute top-full right-0 mt-2 w-48 bg-surface border border-border rounded-xl shadow-lg z-20 py-2">
                  {sortOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleSortSelect(option.value)}
                      className={`w-full px-4 py-2 text-left text-sm transition-colors hover:bg-surface-elevated ${
                        sortBy === option.value
                          ? "text-primary bg-primary/5"
                          : "text-text-primary"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* View Mode Toggle */}
          <div className="hidden sm:flex bg-surface border border-border rounded-xl p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "grid"
                  ? "bg-primary text-white"
                  : "text-text-muted hover:text-text-primary"
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "list"
                  ? "bg-primary text-white"
                  : "text-text-muted hover:text-text-primary"
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Filter Modal */}
      <MobileFilterModal
        isOpen={showMobileFilters}
        onClose={() => setShowMobileFilters(false)}
        currentCategory={category}
        filters={filters}
        onFiltersChange={onFiltersChange}
      />

      {/* Products Grid */}
      <div
        className={`grid gap-3 sm:gap-6 ${
          viewMode === "grid"
            ? "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
            : "grid-cols-1"
        }`}
      >
        {sortedProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            viewMode={viewMode}
            className="sm:p-4 p-2" // Add padding control for mobile
          />
        ))}
      </div>

      {/* Empty State */}
      {sortedProducts.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-surface rounded-full flex items-center justify-center">
            <Grid className="w-8 h-8 text-text-muted" />
          </div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            No products found
          </h3>
          <p className="text-text-secondary">
            Try adjusting your filters or search terms
          </p>
        </div>
      )}
    </div>
  );
}
