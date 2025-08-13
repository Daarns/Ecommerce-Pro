"use client";
import { useState, useRef, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { featuredProducts } from "@/app/data/dummy-data";

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSearch = searchParams.get("search") || "";
  
  const [search, setSearch] = useState(currentSearch);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchHistory, setSearchHistory] = useState(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("productSearchHistory") || "[]");
    }
    return [];
  });
  
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Update search state when URL params change
  useEffect(() => {
    setSearch(currentSearch);
  }, [currentSearch]);

  const suggestions = useMemo(() => {
    if (!search.trim()) return [];
    return featuredProducts
      .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
      .slice(0, 8);
  }, [search]);

  // Handle clicks outside of search suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target) &&
        !inputRef.current?.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!search.trim()) {
      // If search is empty, redirect to all products
      router.push("/products");
      return;
    }
    
    const trimmedSearch = search.trim();
    
    // Add to search history
    const newHistory = [
      trimmedSearch,
      ...searchHistory.filter((h) => h !== trimmedSearch),
    ].slice(0, 8);
    setSearchHistory(newHistory);
    localStorage.setItem("productSearchHistory", JSON.stringify(newHistory));
    setShowSuggestions(false);
    
    // Update URL with search query
    router.push(`/products?search=${encodeURIComponent(trimmedSearch)}`);
  };

  const handleSuggestionClick = (value) => {
    setSearch(value);
    setShowSuggestions(false);
    inputRef.current?.blur();
    
    // Add to history
    const newHistory = [
      value,
      ...searchHistory.filter((h) => h !== value),
    ].slice(0, 8);
    setSearchHistory(newHistory);
    localStorage.setItem("productSearchHistory", JSON.stringify(newHistory));
    
    // Update URL with search query
    router.push(`/products?search=${encodeURIComponent(value)}`);
  };

  const handleRemoveHistory = (value, e) => {
    e.stopPropagation();
    const newHistory = searchHistory.filter((h) => h !== value);
    setSearchHistory(newHistory);
    localStorage.setItem("productSearchHistory", JSON.stringify(newHistory));
  };

  const clearSearch = () => {
    setSearch("");
    setShowSuggestions(false);
    router.push("/products");
    inputRef.current?.focus();
  };

  const clearAllHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem("productSearchHistory");
  };

  return (
    <div className="relative max-w-2xl mx-auto">
      <form onSubmit={handleSearchSubmit} className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search for products, brands, categories..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          className="w-full pl-12 pr-12 py-4 bg-surface border-2 border-border rounded-2xl text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-base shadow-sm"
          autoComplete="off"
        />
        {search && (
          <button
            type="button"
            onClick={clearSearch}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 text-text-muted hover:text-text-primary transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        
        {/* Search Suggestions and History */}
        {showSuggestions && (suggestions.length > 0 || searchHistory.length > 0) && (
          <div 
            ref={suggestionsRef}
            className="absolute z-50 left-0 right-0 mt-2 bg-surface border border-border rounded-2xl shadow-xl max-h-96 overflow-hidden"
          >
            <div className="overflow-y-auto max-h-96">
              {/* Product Suggestions */}
              {suggestions.length > 0 && (
                <div>
                  <div className="px-6 py-3 text-sm font-semibold text-text-muted bg-surface-elevated border-b border-border">
                    Product Suggestions
                  </div>
                  {suggestions.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleSuggestionClick(p.name)}
                      className="w-full text-left px-6 py-4 hover:bg-primary/5 text-text-primary transition-colors flex items-center gap-4 border-b border-border/50 last:border-b-0"
                    >
                      <Search className="w-4 h-4 text-text-muted flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-text-primary truncate">{p.name}</div>
                        <div className="text-sm text-text-muted">{p.category}</div>
                      </div>
                      <div className="text-sm text-primary font-medium">
                        Rp {p.price.toLocaleString()}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Search History */}
              {searchHistory.length > 0 && (
                <div>
                  {suggestions.length > 0 && (
                    <div className="border-t border-border"></div>
                  )}
                  <div className="px-6 py-3 bg-surface-elevated border-b border-border flex items-center justify-between">
                    <span className="text-sm font-semibold text-text-muted">Recent Searches</span>
                    <button
                      type="button"
                      onClick={clearAllHistory}
                      className="text-xs text-primary hover:text-primary/80 font-medium"
                    >
                      Clear All
                    </button>
                  </div>
                  {searchHistory.map((h, i) => (
                    <div
                      key={i}
                      className="flex items-center group hover:bg-primary/5 transition-colors border-b border-border/50 last:border-b-0"
                    >
                      <button
                        type="button"
                        onClick={() => handleSuggestionClick(h)}
                        className="flex-1 text-left px-6 py-4 text-text-secondary hover:text-text-primary flex items-center gap-4"
                      >
                        <Search className="w-4 h-4 text-text-muted flex-shrink-0" />
                        <span className="truncate">{h}</span>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleRemoveHistory(h, e)}
                        className="px-4 py-4 text-text-muted hover:text-error opacity-0 group-hover:opacity-100 transition-all"
                        title="Remove from history"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </form>
      
      {/* Search Results Info */}
      {currentSearch && (
        <div className="mt-4 p-4 bg-primary/5 rounded-xl border border-primary/20">
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">
              Searching for: <span className="font-semibold text-primary">"{currentSearch}"</span>
            </span>
            <button
              onClick={clearSearch}
              className="text-sm text-primary hover:text-primary/80 font-medium"
            >
              Clear Search
            </button>
          </div>
        </div>
      )}
    </div>
  );
}