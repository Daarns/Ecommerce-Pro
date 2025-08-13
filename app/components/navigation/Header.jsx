"use client";
import {useState, useRef, useMemo, useEffect} from "react";
import Link from "next/link";
import Image from "next/image";
import {useRouter} from "next/navigation";
import {Search, ShoppingBag, User, Heart, Menu, X, Package, ArrowLeft} from "lucide-react"; // Add ArrowLeft
import {useCart} from "@/app/contexts/CartContext";
import {CartSidebar} from "@/app/components/cart/CartSidebar";
import {ThemeToggle} from "@/app/components/ui/ThemeToggle";
import {featuredProducts} from "@/app/data/dummy-data";
import {SearchBar} from "@/app/products/components/SearchBar";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const {totalItems, toggleCart} = useCart();
  const [search, setSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [mobileSearch, setMobileSearch] = useState(""); // Separate state for mobile search
  const [showMobileSuggestions, setShowMobileSuggestions] = useState(false);
  const [searchHistory, setSearchHistory] = useState(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(localStorage.getItem("productSearchHistory") || "[]");
    }
    return [];
  });
  const inputRef = useRef(null);
  const mobileInputRef = useRef(null);
  const suggestionsRef = useRef(null);
  const mobileSuggestionsRef = useRef(null);
  const router = useRouter();

  const suggestions = useMemo(() => {
    if (!search) return [];
    return featuredProducts
      .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
      .slice(0, 5);
  }, [search]);

  const mobileSuggestions = useMemo(() => {
    if (!mobileSearch) return [];
    return featuredProducts
      .filter((p) => p.name.toLowerCase().includes(mobileSearch.toLowerCase()))
      .slice(0, 8);
  }, [mobileSearch]);

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

  // Auto-focus mobile search input when opened
  useEffect(() => {
    if (showMobileSearch && mobileInputRef.current) {
      setTimeout(() => {
        mobileInputRef.current.focus();
      }, 100);
    }
  }, [showMobileSearch]);

  // Close mobile search when escape is pressed
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && showMobileSearch) {
        setShowMobileSearch(false);
        setMobileSearch("");
        setShowMobileSuggestions(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [showMobileSearch]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!search.trim()) return;

    const newHistory = [
      search,
      ...searchHistory.filter((h) => h !== search),
    ].slice(0, 8);
    setSearchHistory(newHistory);
    localStorage.setItem("productSearchHistory", JSON.stringify(newHistory));
    setShowSuggestions(false);

    // Redirect to products page with search query
    router.push(`/products?search=${encodeURIComponent(search.trim())}`);
  };

  const handleMobileSearchSubmit = (e) => {
    e.preventDefault();
    if (!mobileSearch.trim()) return;

    const newHistory = [
      mobileSearch,
      ...searchHistory.filter((h) => h !== mobileSearch),
    ].slice(0, 8);
    setSearchHistory(newHistory);
    localStorage.setItem("productSearchHistory", JSON.stringify(newHistory));
    
    // Close mobile search
    setShowMobileSearch(false);
    setMobileSearch("");
    setShowMobileSuggestions(false);

    // Redirect to products page with search query
    router.push(`/products?search=${encodeURIComponent(mobileSearch.trim())}`);
  };

  const handleSuggestionClick = (value) => {
    setSearch(value);
    setShowSuggestions(false);
    inputRef.current?.blur();

    // Add to history and redirect
    const newHistory = [
      value,
      ...searchHistory.filter((h) => h !== value),
    ].slice(0, 8);
    setSearchHistory(newHistory);
    localStorage.setItem("productSearchHistory", JSON.stringify(newHistory));

    // Redirect to products page with search query
    router.push(`/products?search=${encodeURIComponent(value)}`);
  };

  const handleMobileSuggestionClick = (value) => {
    const newHistory = [
      value,
      ...searchHistory.filter((h) => h !== value),
    ].slice(0, 8);
    setSearchHistory(newHistory);
    localStorage.setItem("productSearchHistory", JSON.stringify(newHistory));
    
    // Close mobile search
    setShowMobileSearch(false);
    setMobileSearch("");
    setShowMobileSuggestions(false);

    // Redirect to products page with search query
    router.push(`/products?search=${encodeURIComponent(value)}`);
  };

  const handleRemoveHistory = (value) => {
    const newHistory = searchHistory.filter((h) => h !== value);
    setSearchHistory(newHistory);
    localStorage.setItem("productSearchHistory", JSON.stringify(newHistory));
  };

  const closeMobileSearch = () => {
    setShowMobileSearch(false);
    setMobileSearch("");
    setShowMobileSuggestions(false);
  };

  const navigation = [
    {name: "Home", href: "/"},
    {name: "Products", href: "/products"},
    {name: "Electronics", href: "/products/electronics"},
    {name: "Fashion", href: "/products/fashion"},
    {name: "Gaming", href: "/products/gaming"},
  ];

  return (
    <>
      {/* Mobile Search Overlay */}
      {showMobileSearch && (
        <div className="fixed inset-0 z-50 bg-background">
          {/* Mobile Search Header */}
          <div className="bg-background border-b border-border">
            <div className="flex items-center px-4 py-3">
              <button
                onClick={closeMobileSearch}
                className="p-2 mr-2 text-text-primary hover:bg-surface rounded-lg transition-colors"
                aria-label="Close search"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex-1">
                <form onSubmit={handleMobileSearchSubmit} className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
                  <input
                    ref={mobileInputRef}
                    type="text"
                    placeholder="Search products..."
                    value={mobileSearch}
                    onChange={(e) => {
                      setMobileSearch(e.target.value);
                      setShowMobileSuggestions(true);
                    }}
                    onFocus={() => setShowMobileSuggestions(true)}
                    className="w-full pl-12 pr-4 py-3 bg-surface border border-border rounded-xl text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-base"
                    autoComplete="off"
                  />
                  {mobileSearch && (
                    <button
                      type="button"
                      onClick={() => {
                        setMobileSearch("");
                        setShowMobileSuggestions(false);
                        mobileInputRef.current?.focus();
                      }}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-text-muted hover:text-text-primary transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </form>
              </div>
            </div>
          </div>

          {/* Mobile Search Results */}
          <div className="flex-1 overflow-y-auto">
            {showMobileSuggestions && (mobileSuggestions.length > 0 || searchHistory.length > 0) && (
              <div ref={mobileSuggestionsRef} className="bg-background">
                {/* Product Suggestions */}
                {mobileSuggestions.length > 0 && (
                  <div>
                    <div className="px-4 py-3 text-sm font-medium text-text-muted bg-surface/50">
                      Products
                    </div>
                    {mobileSuggestions.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleMobileSuggestionClick(p.name)}
                        className="w-full text-left px-4 py-4 hover:bg-surface transition-colors flex items-center gap-4 border-b border-border/50 last:border-b-0"
                      >
                        <div className="w-12 h-12 bg-surface rounded-lg flex items-center justify-center flex-shrink-0">
                          {p.image ? (
                            <Image
                              src={p.image}
                              alt={p.name}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <Search className="w-5 h-5 text-text-muted" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-text-primary truncate">{p.name}</div>
                          <div className="text-sm text-text-muted">{p.category}</div>
                          <div className="text-sm font-medium text-primary mt-1">${p.price}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Search History */}
                {searchHistory.length > 0 && (
                  <div>
                    {mobileSuggestions.length > 0 && <div className="h-2 bg-surface/30"></div>}
                    <div className="px-4 py-3 text-sm font-medium text-text-muted bg-surface/50 flex items-center justify-between">
                      Recent Searches
                      {searchHistory.length > 0 && (
                        <button
                          onClick={() => {
                            setSearchHistory([]);
                            localStorage.setItem("productSearchHistory", "[]");
                          }}
                          className="text-xs text-primary hover:text-primary/80 transition-colors"
                        >
                          Clear All
                        </button>
                      )}
                    </div>
                    {searchHistory.map((h, i) => (
                      <div
                        key={i}
                        className="flex items-center group hover:bg-surface transition-colors border-b border-border/50 last:border-b-0"
                      >
                        <button
                          type="button"
                          onClick={() => handleMobileSuggestionClick(h)}
                          className="flex-1 text-left px-4 py-4 text-text-secondary hover:text-text-primary flex items-center gap-4"
                        >
                          <Search className="w-5 h-5 text-text-muted flex-shrink-0" />
                          <span className="truncate">{h}</span>
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveHistory(h);
                          }}
                          className="px-4 py-4 text-text-muted hover:text-error opacity-0 group-hover:opacity-100 transition-all"
                          title="Remove from history"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* No results state */}
                {mobileSearch && mobileSuggestions.length === 0 && searchHistory.length === 0 && (
                  <div className="px-4 py-12 text-center">
                    <Search className="w-12 h-12 text-text-muted mx-auto mb-4 opacity-50" />
                    <div className="text-text-primary font-medium mb-2">No results found</div>
                    <div className="text-text-muted text-sm">
                      Try searching for a different product
                    </div>
                  </div>
                )}

                {/* Empty state when no search query */}
                {!mobileSearch && searchHistory.length === 0 && (
                  <div className="px-4 py-12 text-center">
                    <Search className="w-12 h-12 text-text-muted mx-auto mb-4 opacity-50" />
                    <div className="text-text-primary font-medium mb-2">Start typing to search</div>
                    <div className="text-text-muted text-sm">
                      Search for products, brands, or categories
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <header className="bg-background/95 backdrop-blur-md border-b border-border sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left Side: Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg overflow-hidden">
                  <Image
                    src="/daarn.png"
                    alt="Daarns Logo"
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-xl font-bold text-text-primary tracking-tight">
                  Daarns
                </span>
              </Link>
            </div>

            {/* Center: Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navigation.map((item, index) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-4 py-2 text-sm font-medium transition-colors rounded-lg ${
                    index === 0
                      ? "text-text-primary hover:text-primary hover:bg-primary/5"
                      : "text-text-secondary hover:text-text-primary hover:bg-surface"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Right Side: Search + Actions */}
            <div className="flex items-center space-x-2">
              {/* Search Bar - Desktop Only */}
              <div className="hidden lg:flex items-center">
                <div className="relative">
                  <form onSubmit={handleSearchSubmit} className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input
                      ref={inputRef}
                      type="text"
                      placeholder="Search products..."
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                        setShowSuggestions(true);
                      }}
                      onFocus={() => setShowSuggestions(true)}
                      className="w-64 pl-10 pr-4 py-2 bg-surface border border-border rounded-xl text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
                      autoComplete="off"
                    />
                    {/* Autocomplete & History */}
                    {showSuggestions &&
                      (suggestions.length > 0 || searchHistory.length > 0) && (
                        <div
                          ref={suggestionsRef}
                          className="absolute z-50 left-0 right-0 mt-2 bg-surface border border-border rounded-xl shadow-lg max-h-80 overflow-y-auto"
                        >
                          {suggestions.length > 0 && (
                            <div>
                              <div className="px-4 py-2 text-xs font-medium text-text-muted bg-surface-elevated">
                                Product Suggestions
                              </div>
                              {suggestions.map((p) => (
                                <button
                                  key={p.id}
                                  type="button"
                                  onClick={() => handleSuggestionClick(p.name)}
                                  className="w-full text-left px-4 py-3 hover:bg-primary/5 text-text-primary transition-colors flex items-center gap-3"
                                >
                                  <Search className="w-4 h-4 text-text-muted" />
                                  <div>
                                    <div className="font-medium">{p.name}</div>
                                    <div className="text-xs text-text-muted">
                                      {p.category}
                                    </div>
                                  </div>
                                </button>
                              ))}
                            </div>
                          )}
                          {searchHistory.length > 0 && (
                            <div>
                              {suggestions.length > 0 && (
                                <div className="border-t border-border"></div>
                              )}
                              <div className="px-4 py-2 text-xs font-medium text-text-muted bg-surface-elevated">
                                Recent Searches
                              </div>
                              {searchHistory.map((h, i) => (
                                <div
                                  key={i}
                                  className="flex items-center group hover:bg-primary/5 transition-colors"
                                >
                                  <button
                                    type="button"
                                    onClick={() => handleSuggestionClick(h)}
                                    className="flex-1 text-left px-4 py-3 text-text-secondary hover:text-text-primary flex items-center gap-3"
                                  >
                                    <Search className="w-4 h-4 text-text-muted" />
                                    {h}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleRemoveHistory(h);
                                    }}
                                    className="px-3 py-3 text-text-muted hover:text-error opacity-0 group-hover:opacity-100 transition-all text-lg"
                                    title="Remove from history"
                                  >
                                    ×
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                  </form>
                </div>
              </div>

              {/* Action Icons */}
              <div className="flex items-center space-x-1">
                {/* Search - Mobile Only */}
                <button
                  className="lg:hidden p-2 text-text-primary hover:text-text-secondary hover:bg-surface transition-colors rounded-lg"
                  onClick={() => setShowMobileSearch(true)}
                  aria-label="Open search"
                >
                  <Search className="w-5 h-5" />
                </button>

                {/* Theme Toggle */}
                <div className="hidden sm:block">
                  <ThemeToggle />
                </div>

                {/* Orders */}
                <Link
                  href="/orders"
                  className="p-2 text-text-primary hover:text-text-secondary hover:bg-surface transition-colors rounded-lg"
                  title="My Orders"
                >
                  <Package className="w-5 h-5" />
                </Link>

                {/* Wishlist */}
                <Link
                  href="/wishlist"
                  className="p-2 text-text-primary hover:text-text-secondary hover:bg-surface transition-colors rounded-lg"
                  title="Wishlist"
                >
                  <Heart className="w-5 h-5" />
                </Link>

                {/* Shopping Cart */}
                <button
                  onClick={toggleCart}
                  className="relative p-2 text-text-primary hover:text-text-secondary hover:bg-surface transition-colors rounded-lg"
                  title="Shopping Cart"
                >
                  <ShoppingBag className="w-5 h-5" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-text-inverse text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                      {totalItems > 99 ? "99+" : totalItems}
                    </span>
                  )}
                </button>

                {/* Account - Positioned at Far Right */}
                <Link
                  href="/auth/login"
                  className="p-2 text-text-primary hover:text-text-secondary hover:bg-surface transition-colors rounded-lg"
                  title="My Account"
                >
                  <User className="w-5 h-5" />
                </Link>

                {/* Mobile Menu Toggle */}
                <button
                  className="md:hidden p-2 text-text-primary hover:text-text-secondary hover:bg-surface transition-colors rounded-lg ml-2"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  title="Menu"
                >
                  {mobileMenuOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-background border-t border-border shadow-lg">
            <div className="px-4 py-6 space-y-1">
              {/* Mobile Navigation Links */}
              {navigation.map((item, index) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-4 py-3 text-sm font-medium transition-colors rounded-lg ${
                    index === 0
                      ? "text-text-primary bg-primary/5"
                      : "text-text-secondary hover:text-text-primary hover:bg-surface"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              {/* Mobile Theme Toggle */}
              <div className="sm:hidden pt-2 flex items-center justify-between px-4 py-3">
                <span className="text-sm font-medium text-text-primary">
                  Theme
                </span>
                <ThemeToggle />
              </div>

              {/* Mobile Quick Actions */}
              <div className="pt-4 border-t border-border">
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/orders"
                    className="flex items-center justify-center gap-2 p-3 bg-surface rounded-xl hover:bg-surface-elevated transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Package className="w-4 h-4 text-text-primary" />
                    <span className="text-sm font-medium text-text-primary">
                      Orders
                    </span>
                  </Link>
                  <Link
                    href="/wishlist"
                    className="flex items-center justify-center gap-2 p-3 bg-surface rounded-xl hover:bg-surface-elevated transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Heart className="w-4 h-4 text-text-primary" />
                    <span className="text-sm font-medium text-text-primary">
                      Wishlist
                    </span>
                  </Link>
                </div>
                <div className="mt-3">
                  <Link
                    href="/auth/login"
                    className="flex items-center justify-center gap-2 p-3 bg-surface rounded-xl hover:bg-surface-elevated transition-colors w-full"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="w-4 h-4 text-text-primary" />
                    <span className="text-sm font-medium text-text-primary">
                      Account
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Cart Sidebar */}
      <CartSidebar />
    </>
  );
}