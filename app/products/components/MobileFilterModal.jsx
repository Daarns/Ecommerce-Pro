import { useState, useEffect } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { getCategoryInfo, categoryHasSizes, sizeOptions } from '@/app/data/dummy-data';

export function MobileFilterModal({ 
  isOpen, 
  onClose, 
  currentCategory, 
  filters, 
  onFiltersChange 
}) {
  const [localFilters, setLocalFilters] = useState(filters);
  const [openSections, setOpenSections] = useState({
    category: true,
    price: false,
    size: false,
    variant: false,
    rating: false,
    brand: false
  });

  // Sync with parent filters when modal opens
  useEffect(() => {
    if (isOpen) {
      setLocalFilters(filters);
    }
  }, [isOpen, filters]);

  // Get category info to determine available filters
  const categoryInfo = getCategoryInfo(currentCategory);
  const hasSizes = categoryHasSizes(currentCategory);

  const categories = [
    { id: 'electronics', name: 'Electronics', count: 24 },
    { id: 'fashion', name: 'Fashion', count: 18 },
    { id: 'gaming', name: 'Gaming', count: 12 },
    { id: 'men', name: 'Men', count: 20 },
    { id: 'women', name: 'Women', count: 25 },
    { id: 'kids', name: 'Kids', count: 15 },
    { id: 'sports', name: 'Sports', count: 15 },
    { id: 'home', name: 'Home & Living', count: 9 }
  ];

  const brands = [
    { id: 'nike', name: 'Nike', count: 12 },
    { id: 'adidas', name: 'Adidas', count: 8 },
    { id: 'apple', name: 'Apple', count: 6 },
    { id: 'samsung', name: 'Samsung', count: 10 },
    { id: 'hm', name: 'H&M', count: 7 },
    { id: 'sony', name: 'Sony', count: 5 }
  ];

  const priceRanges = [
    { label: 'Under Rp 500K', min: 0, max: 500000 },
    { label: 'Rp 500K - 1M', min: 500000, max: 1000000 },
    { label: 'Rp 1M - 5M', min: 1000000, max: 5000000 },
    { label: 'Rp 5M - 10M', min: 5000000, max: 10000000 },
    { label: 'Above Rp 10M', min: 10000000, max: 50000000 }
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
      case 'electronics':
        return [
          { id: '128gb', name: '128GB' },
          { id: '256gb', name: '256GB' },
          { id: '512gb', name: '512GB' },
          { id: '1tb', name: '1TB' }
        ];
      case 'gaming':
        return [
          { id: 'standard', name: 'Standard Edition' },
          { id: 'digital', name: 'Digital Edition' },
          { id: 'special', name: 'Special Edition' }
        ];
      default:
        return [];
    }
  };

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const updateLocalFilters = (newFilters) => {
    setLocalFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  };

  const handleCategoryChange = (categoryId) => {
    const newCategories = localFilters.categories?.includes(categoryId)
      ? localFilters.categories.filter(id => id !== categoryId)
      : [...(localFilters.categories || []), categoryId];
    
    updateLocalFilters({ categories: newCategories });
  };

  const handlePriceRangeChange = (range) => {
    updateLocalFilters({ 
      priceRange: [range.min, range.max],
      selectedPriceRange: range.label 
    });
  };

  const handleSizeChange = (size) => {
    const newSizes = localFilters.sizes?.includes(size)
      ? localFilters.sizes.filter(s => s !== size)
      : [...(localFilters.sizes || []), size];
    
    updateLocalFilters({ sizes: newSizes });
  };

  const handleVariantChange = (variantId) => {
    const newVariants = localFilters.variants?.includes(variantId)
      ? localFilters.variants.filter(v => v !== variantId)
      : [...(localFilters.variants || []), variantId];
    
    updateLocalFilters({ variants: newVariants });
  };

  const handleBrandChange = (brandId) => {
    const newBrands = localFilters.brands?.includes(brandId)
      ? localFilters.brands.filter(b => b !== brandId)
      : [...(localFilters.brands || []), brandId];
    
    updateLocalFilters({ brands: newBrands });
  };

  const handleRatingChange = (rating) => {
    updateLocalFilters({ rating });
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      categories: [],
      priceRange: [0, 50000000],
      selectedPriceRange: null,
      rating: 0,
      brands: [],
      sizes: [],
      variants: []
    };
    setLocalFilters(clearedFilters);
  };

  const applyFilters = () => {
    onFiltersChange(localFilters);
    onClose();
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (localFilters.selectedPriceRange) count++;
    if (localFilters.rating > 0) count++;
    if (localFilters.brands?.length > 0) count += localFilters.brands.length;
    if (localFilters.sizes?.length > 0) count += localFilters.sizes.length;
    if (localFilters.variants?.length > 0) count += localFilters.variants.length;
    if (!currentCategory && localFilters.categories?.length > 0) count += localFilters.categories.length;
    return count;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 lg:hidden">
      <div className="absolute bottom-0 left-0 right-0 bg-background rounded-t-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-background border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold text-text-primary">Filters</h3>
              {getActiveFiltersCount() > 0 && (
                <span className="px-2 py-1 bg-primary text-white text-xs rounded-full">
                  {getActiveFiltersCount()}
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={clearAllFilters}
                className="text-sm text-primary hover:text-primary-hover transition-colors"
              >
                Clear All
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-surface rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="space-y-6">
            {/* Current Category Indicator */}
            {currentCategory && (
              <div className="p-4 bg-primary/10 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="text-primary font-medium capitalize">
                    {currentCategory} Category
                  </span>
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                </div>
                <p className="text-xs text-primary/70 mt-1">
                  {hasSizes ? 'Size filters available' : 'Variant filters available'}
                </p>
              </div>
            )}

            {/* Categories */}
            {!currentCategory && (
              <div>
                <button
                  onClick={() => toggleSection('category')}
                  className="flex items-center justify-between w-full text-left py-3"
                >
                  <h4 className="font-semibold text-text-primary text-base">Category</h4>
                  {openSections.category ? (
                    <ChevronUp className="w-5 h-5 text-text-muted" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-text-muted" />
                  )}
                </button>
                
                {openSections.category && (
                  <div className="space-y-4 pb-4">
                    {categories.map((category) => (
                      <label key={category.id} className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={localFilters.categories?.includes(category.id) || false}
                          onChange={() => handleCategoryChange(category.id)}
                          className="w-5 h-5 text-primary border-border rounded focus:ring-primary"
                        />
                        <span className="ml-3 text-text-secondary text-base">
                          {category.name} ({category.count})
                        </span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Price Range */}
            <div>
              <button
                onClick={() => toggleSection('price')}
                className="flex items-center justify-between w-full text-left py-3"
              >
                <h4 className="font-semibold text-text-primary text-base">Price Range</h4>
                {openSections.price ? (
                  <ChevronUp className="w-5 h-5 text-text-muted" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-text-muted" />
                )}
              </button>
              
              {openSections.price && (
                <div className="space-y-4 pb-4">
                  {priceRanges.map((range) => (
                    <label key={range.label} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="mobilePriceRange"
                        checked={localFilters.selectedPriceRange === range.label}
                        onChange={() => handlePriceRangeChange(range)}
                        className="w-5 h-5 text-primary border-border focus:ring-primary"
                      />
                      <span className="ml-3 text-text-secondary text-base">
                        {range.label}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Sizes */}
            {hasSizes && getAvailableSizes().length > 0 && (
              <div>
                <button
                  onClick={() => toggleSection('size')}
                  className="flex items-center justify-between w-full text-left py-3"
                >
                  <h4 className="font-semibold text-text-primary text-base">Size</h4>
                  {openSections.size ? (
                    <ChevronUp className="w-5 h-5 text-text-muted" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-text-muted" />
                  )}
                </button>
                
                {openSections.size && (
                  <div className="pb-4">
                    <div className="grid grid-cols-4 gap-3">
                      {getAvailableSizes().map((size) => (
                        <button
                          key={size}
                          onClick={() => handleSizeChange(size)}
                          className={`py-3 px-3 text-sm rounded-lg border-2 transition-all font-medium ${
                            localFilters.sizes?.includes(size)
                              ? 'border-primary bg-primary text-white'
                              : 'border-border text-text-secondary hover:border-primary hover:text-primary'
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

            {/* Variants */}
            {categoryInfo?.hasVariants && !hasSizes && getVariantOptions().length > 0 && (
              <div>
                <button
                  onClick={() => toggleSection('variant')}
                  className="flex items-center justify-between w-full text-left py-3"
                >
                  <h4 className="font-semibold text-text-primary text-base">
                    {currentCategory === 'electronics' ? 'Storage' : 'Edition'}
                  </h4>
                  {openSections.variant ? (
                    <ChevronUp className="w-5 h-5 text-text-muted" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-text-muted" />
                  )}
                </button>
                
                {openSections.variant && (
                  <div className="space-y-4 pb-4">
                    {getVariantOptions().map((variant) => (
                      <label key={variant.id} className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={localFilters.variants?.includes(variant.id) || false}
                          onChange={() => handleVariantChange(variant.id)}
                          className="w-5 h-5 text-primary border-border rounded focus:ring-primary"
                        />
                        <span className="ml-3 text-text-secondary text-base">
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
                onClick={() => toggleSection('rating')}
                className="flex items-center justify-between w-full text-left py-3"
              >
                <h4 className="font-semibold text-text-primary text-base">Rating</h4>
                {openSections.rating ? (
                  <ChevronUp className="w-5 h-5 text-text-muted" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-text-muted" />
                )}
              </button>
              
              {openSections.rating && (
                <div className="space-y-4 pb-4">
                  {[4, 3, 2, 1].map((rating) => (
                    <label key={rating} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="mobileRating"
                        checked={localFilters.rating === rating}
                        onChange={() => handleRatingChange(rating)}
                        className="w-5 h-5 text-primary border-border focus:ring-primary"
                      />
                      <span className="ml-3 flex items-center text-text-secondary text-base">
                        <span className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={`text-base ${
                                i < rating ? 'text-yellow-400' : 'text-gray-300'
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
                onClick={() => toggleSection('brand')}
                className="flex items-center justify-between w-full text-left py-3"
              >
                <h4 className="font-semibold text-text-primary text-base">Brand</h4>
                {openSections.brand ? (
                  <ChevronUp className="w-5 h-5 text-text-muted" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-text-muted" />
                )}
              </button>
              
              {openSections.brand && (
                <div className="space-y-4 pb-4">
                  {brands.map((brand) => (
                    <label key={brand.id} className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={localFilters.brands?.includes(brand.id) || false}
                        onChange={() => handleBrandChange(brand.id)}
                        className="w-5 h-5 text-primary border-border rounded focus:ring-primary"
                      />
                      <span className="ml-3 text-text-secondary text-base">
                        {brand.name} ({brand.count})
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-background border-t border-border px-6 py-4">
          <div className="flex gap-3">
            <button
              onClick={clearAllFilters}
              className="flex-1 py-3 px-4 border border-border rounded-xl text-text-primary hover:bg-surface transition-colors font-medium"
            >
              Clear All
            </button>
            <button
              onClick={applyFilters}
              className="flex-2 py-3 px-6 bg-primary text-white rounded-xl hover:bg-primary-hover transition-colors font-medium"
            >
              Apply Filters {getActiveFiltersCount() > 0 && `(${getActiveFiltersCount()})`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
