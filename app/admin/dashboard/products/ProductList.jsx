"use client";
import { useState, useMemo } from "react";
import { featuredProducts } from "@/app/data/dummy-data";
import { formatPrice } from "@/app/lib/utils";
import { Search, Filter, Grid, List, MoreHorizontal, Edit, Trash2, Eye, Package, TrendingUp, AlertCircle, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const statusColors = {
  active: "bg-green-100 text-green-800 border border-green-200",
  inactive: "bg-red-100 text-red-800 border border-red-200",
  draft: "bg-gray-100 text-gray-800 border border-gray-200",
  "out-of-stock": "bg-orange-100 text-orange-800 border border-orange-200",
};

const categoryColors = {
  electronics: "bg-purple-100 text-purple-800",
  fashion: "bg-pink-100 text-pink-800",
  gaming: "bg-blue-100 text-blue-800",
  men: "bg-indigo-100 text-indigo-800",
  women: "bg-rose-100 text-rose-800",
  kids: "bg-yellow-100 text-yellow-800",
  sports: "bg-green-100 text-green-800",
  home: "bg-orange-100 text-orange-800",
};

// Custom Dropdown Component
const CustomSelect = ({ value, onChange, options, placeholder, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const selectedOption = options.find(opt => opt.value === value);
  
  return (
    <div className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 text-left bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-slate-300 flex items-center justify-between"
      >
        <span className={`truncate ${!selectedOption ? 'text-slate-500' : 'text-slate-900'}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-20 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
            <div className="max-h-60 overflow-y-auto">
              {options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors duration-150 border-b border-slate-100 last:border-b-0 ${
                    value === option.value ? 'bg-blue-50 text-blue-600 font-medium' : 'text-slate-700'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default function ProductList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  // Get unique categories
  const categories = [...new Set(featuredProducts.map(p => p.category?.toLowerCase()).filter(Boolean))];

  // Enhanced products with status
  const enhancedProducts = featuredProducts.map(product => ({
    ...product,
    status: product.stock > 0 ? 'active' : 'out-of-stock',
    totalStock: product.sizes ? 
      product.sizes.reduce((sum, size) => sum + size.stock, 0) : 
      product.stock,
  }));

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = enhancedProducts.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !selectedCategory || product.category?.toLowerCase() === selectedCategory;
      const matchesStatus = !selectedStatus || product.status === selectedStatus;
      
      return matchesSearch && matchesCategory && matchesStatus;
    });

    // Sort products
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'stock':
          aValue = a.totalStock;
          bValue = b.totalStock;
          break;
        case 'rating':
          aValue = a.rating;
          bValue = b.rating;
          break;
        case 'sold':
          aValue = a.sold || 0;
          bValue = b.sold || 0;
          break;
        default:
          return 0;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [enhancedProducts, searchTerm, selectedCategory, selectedStatus, sortBy, sortOrder]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedStatus, sortBy, sortOrder]);

  // Stats
  const stats = useMemo(() => {
    const total = enhancedProducts.length;
    const active = enhancedProducts.filter(p => p.status === 'active').length;
    const outOfStock = enhancedProducts.filter(p => p.status === 'out-of-stock').length;
    const lowStock = enhancedProducts.filter(p => p.totalStock > 0 && p.totalStock <= 10).length;
    
    return { total, active, outOfStock, lowStock };
  }, [enhancedProducts]);

  const handleSelectProduct = (productId) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === currentProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(currentProducts.map(p => p.id));
    }
  };

  // Pagination component
  const Pagination = () => {
    const getVisiblePages = () => {
      const delta = 2;
      const range = [];
      const rangeWithDots = [];

      for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
        range.push(i);
      }

      if (currentPage - delta > 2) {
        rangeWithDots.push(1, '...');
      } else {
        rangeWithDots.push(1);
      }

      rangeWithDots.push(...range);

      if (currentPage + delta < totalPages - 1) {
        rangeWithDots.push('...', totalPages);
      } else if (totalPages > 1) {
        rangeWithDots.push(totalPages);
      }

      return rangeWithDots;
    };

    if (totalPages <= 1) return null;

    return (
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-slate-600">
          Showing {startIndex + 1} to {Math.min(endIndex, filteredProducts.length)} of {filteredProducts.length} products
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          {getVisiblePages().map((page, index) => (
            <button
              key={index}
              onClick={() => typeof page === 'number' && setCurrentPage(page)}
              disabled={page === '...'}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                page === currentPage
                  ? 'bg-blue-600 text-white'
                  : page === '...'
                  ? 'cursor-default text-slate-400'
                  : 'border border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              {page}
            </button>
          ))}
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  const ProductCard = ({ product }) => (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-200">
      {/* Product Image */}
      <div className="relative aspect-square rounded-xl overflow-hidden mb-4 bg-slate-100">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
        />
        <div className="absolute top-3 right-3">
          <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${statusColors[product.status]}`}>
            {product.status === 'out-of-stock' ? 'Out of Stock' : 'Active'}
          </span>
        </div>
        {product.bestSeller && (
          <div className="absolute top-3 left-3">
            <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Best Seller
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="space-y-3">
        <div>
          <h3 className="font-semibold text-slate-900 line-clamp-2 mb-1">{product.name}</h3>
          <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${categoryColors[product.category?.toLowerCase()] || 'bg-gray-100 text-gray-800'}`}>
            {product.category}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg font-bold text-slate-900">{formatPrice(product.price)}</div>
            {product.originalPrice && (
              <div className="text-sm text-slate-500 line-through">{formatPrice(product.originalPrice)}</div>
            )}
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-slate-900">Stock: {product.totalStock}</div>
            <div className="text-xs text-slate-500">Sold: {product.sold || 0}</div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="text-yellow-400">★</span>
            <span className="text-sm font-medium">{product.rating}</span>
          </div>
          <div className="flex items-center gap-1">
            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <Eye className="w-4 h-4 text-slate-600" />
            </button>
            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <Edit className="w-4 h-4 text-slate-600" />
            </button>
            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <MoreHorizontal className="w-4 h-4 text-slate-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Dropdown options
  const categoryOptions = [
    { value: "", label: "All Categories" },
    ...categories.map(cat => ({
      value: cat,
      label: cat.charAt(0).toUpperCase() + cat.slice(1)
    }))
  ];

  const statusOptions = [
    { value: "", label: "All Status" },
    { value: "active", label: "Active" },
    { value: "out-of-stock", label: "Out of Stock" }
  ];

  const sortOptions = [
    { value: "name-asc", label: "Name A-Z" },
    { value: "name-desc", label: "Name Z-A" },
    { value: "price-asc", label: "Price Low-High" },
    { value: "price-desc", label: "Price High-Low" },
    { value: "stock-asc", label: "Stock Low-High" },
    { value: "stock-desc", label: "Stock High-Low" },
    { value: "rating-desc", label: "Rating High-Low" },
    { value: "sold-desc", label: "Best Selling" }
  ];

  const itemsPerPageOptions = [
    { value: 8, label: "8 per page" },
    { value: 12, label: "12 per page" },
    { value: 24, label: "24 per page" },
    { value: 48, label: "48 per page" }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
              <div className="text-sm text-slate-600">Total Products</div>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-green-600">{stats.active}</div>
              <div className="text-sm text-slate-600">Active Products</div>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-orange-600">{stats.lowStock}</div>
              <div className="text-sm text-slate-600">Low Stock</div>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-red-600">{stats.outOfStock}</div>
              <div className="text-sm text-slate-600">Out of Stock</div>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Custom Dropdowns */}
            <CustomSelect
              value={selectedCategory}
              onChange={setSelectedCategory}
              options={categoryOptions}
              placeholder="All Categories"
              className="min-w-[160px]"
            />

            <CustomSelect
              value={selectedStatus}
              onChange={setSelectedStatus}
              options={statusOptions}
              placeholder="All Status"
              className="min-w-[140px]"
            />
          </div>

          {/* View Controls */}
          <div className="flex items-center gap-3">
            {/* Items per page */}
            <CustomSelect
              value={itemsPerPage}
              onChange={(value) => {
                setItemsPerPage(Number(value));
                setCurrentPage(1);
              }}
              options={itemsPerPageOptions}
              placeholder="Items per page"
              className="min-w-[120px]"
            />

            {/* Sort */}
            <CustomSelect
              value={`${sortBy}-${sortOrder}`}
              onChange={(value) => {
                const [field, order] = value.split('-');
                setSortBy(field);
                setSortOrder(order);
              }}
              options={sortOptions}
              placeholder="Sort by"
              className="min-w-[160px]"
            />

            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'table' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedProducts.length > 0 && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-900">
                {selectedProducts.length} products selected
              </span>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors">
                  Bulk Edit
                </button>
                <button className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors">
                  Delete Selected
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Products Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {currentProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left p-4">
                    <input
                      type="checkbox"
                      checked={selectedProducts.length === currentProducts.length && currentProducts.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-slate-300"
                    />
                  </th>
                  <th className="text-left p-4 text-sm font-semibold text-slate-700">Product</th>
                  <th className="text-left p-4 text-sm font-semibold text-slate-700">Category</th>
                  <th className="text-left p-4 text-sm font-semibold text-slate-700">Price</th>
                  <th className="text-left p-4 text-sm font-semibold text-slate-700">Stock</th>
                  <th className="text-left p-4 text-sm font-semibold text-slate-700">Status</th>
                  <th className="text-left p-4 text-sm font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentProducts.map((product, index) => (
                  <tr
                    key={product.id}
                    className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${
                      index === currentProducts.length - 1 ? 'border-b-0' : ''
                    }`}
                  >
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id)}
                        onChange={() => handleSelectProduct(product.id)}
                        className="rounded border-slate-300"
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                          <Image
                            src={product.image}
                            alt={product.name}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-medium text-slate-900">{product.name}</div>
                          <div className="text-sm text-slate-500">ID: {product.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${categoryColors[product.category?.toLowerCase()] || 'bg-gray-100 text-gray-800'}`}>
                        {product.category}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-slate-900">{formatPrice(product.price)}</div>
                      {product.originalPrice && (
                        <div className="text-sm text-slate-500 line-through">{formatPrice(product.originalPrice)}</div>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-slate-900">{product.totalStock}</div>
                      <div className="text-sm text-slate-500">Sold: {product.sold || 0}</div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${statusColors[product.status]}`}>
                        {product.status === 'out-of-stock' ? 'Out of Stock' : 'Active'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors" title="View">
                          <Eye className="w-4 h-4 text-slate-600" />
                        </button>
                        <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors" title="Edit">
                          <Edit className="w-4 h-4 text-slate-600" />
                        </button>
                        <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors" title="Delete">
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {filteredProducts.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <Pagination />
        </div>
      )}

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
          <Package className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">No products found</h3>
          <p className="text-slate-600 mb-6">Try adjusting your search or filter criteria</p>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
            Add New Product
          </button>
        </div>
      )}
    </div>
  );
}
