import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowUpDown,
  Check,
  Heart,
  MapPin,
  Phone,
  RotateCcw,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Star,
  Store,
  X,
  Zap,
} from "lucide-react";
import { LocationBar } from "../components/common/LocationBar";
import { CustomSelect } from "../components/common/CustomSelect";
import { useProducts } from "../context/ProductContext";
import { useCart } from "../context/CartContext";
import { money } from "../utils/formatters";
import { ProductArtwork } from "../components/product/ProductArtwork";
import { Product } from "../types";

const extractPincode = (value: string) => value.match(/\b\d{6}\b/)?.[0] ?? "";

const proximityScore = (product: Product, targetPincode: string) => {
  if (!targetPincode || !product.vendorPincode) return Number.MAX_SAFE_INTEGER;
  if (product.vendorPincode === targetPincode) return 0;
  return Math.abs(Number(product.vendorPincode) - Number(targetPincode));
};

export const ProductsPage: React.FC = () => {
  const { catalog, categories } = useProducts();
  const { addToCart } = useCart();
  const [params, setParams] = useSearchParams();

  const search = params.get("search") ?? "";
  const category = params.get("category") ?? "All";
  const pincode = params.get("pincode") ?? "";
  const targetPincode = extractPincode(pincode);
  const [sort, setSort] = useState("Featured");

  useEffect(() => {
    if (category !== "All" && window.location.hash === "#category-results") {
      window.requestAnimationFrame(() => {
        document.getElementById("category-results")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    }
  }, [category]);

  // Amazon-grade filters
  const [priceRange, setPriceRange] = useState<
    "all" | "under500" | "500-1000" | "1000-3000" | "over3000"
  >("all");
  const [minRating, setMinRating] = useState<number>(0);
  const [sameDayOnly, setSameDayOnly] = useState<boolean>(false);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Derive category list from DB categories or catalog fallback
  const categoryList = useMemo(() => {
    if (categories.length > 0) {
      return categories.map((c) => c.categoryName);
    }
    const set = new Set<string>();
    catalog.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [categories, catalog]);

  // Count products per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    catalog.forEach((p) => {
      const cat = p.category || "Other";
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [catalog]);

  const updateParams = (
    updates: {
      category?: string | null;
      search?: string | null;
    },
    preserveSearch = false,
  ) => {
    const next: Record<string, string> = {};
    if (pincode) next.pincode = pincode;

    if (updates.category !== undefined) {
      if (updates.category && updates.category !== "All") {
        next.category = updates.category;
      }
    } else if (category && category !== "All") {
      next.category = category;
    }

    if (updates.search !== undefined) {
      const cleanSearch = (updates.search ?? "").trim();
      if (cleanSearch) {
        next.search = preserveSearch ? (updates.search ?? "") : cleanSearch;
      }
    } else if (search) {
      next.search = search;
    }

    setParams(next);
  };

  // Filter and sort catalog
  const filtered = useMemo(() => {
    return catalog
      .filter((product) => {
        const prodCategory = (product.category || "").toLowerCase();
        const prodName = (product.name || "").toLowerCase();
        const prodVendor = (product.vendor || "").toLowerCase();
        const searchTarget = search.trim().toLowerCase();

        // Category filter
        if (category !== "All" && prodCategory !== category.toLowerCase()) {
          return false;
        }

        // Search query
        if (
          searchTarget &&
          !prodName.includes(searchTarget) &&
          !prodVendor.includes(searchTarget)
        ) {
          return false;
        }

        // Price filter
        if (priceRange === "under500" && product.price >= 500) return false;
        if (
          priceRange === "500-1000" &&
          (product.price < 500 || product.price > 1000)
        )
          return false;
        if (
          priceRange === "1000-3000" &&
          (product.price < 1000 || product.price > 3000)
        )
          return false;
        if (priceRange === "over3000" && product.price <= 3000) return false;

        // Rating filter
        if (minRating > 0 && (product.rating || 0) < minRating) return false;

        // Stock filter
        if (inStockOnly && product.stock !== undefined && product.stock <= 0) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sort === "Distance: nearest") {
          return proximityScore(a, targetPincode) - proximityScore(b, targetPincode);
        }
        if (sort === "Price: low") return a.price - b.price;
        if (sort === "Price: high") return b.price - a.price;
        if (sort === "Popular") return (b.rating || 0) - (a.rating || 0);
        if (targetPincode) {
          const proximityDifference =
            proximityScore(a, targetPincode) - proximityScore(b, targetPincode);
          if (proximityDifference !== 0) return proximityDifference;
        }
        return b.id - a.id;
      });
  }, [
    catalog,
    category,
    search,
    priceRange,
    minRating,
    sameDayOnly,
    inStockOnly,
    sort,
    targetPincode,
  ]);

  const currentLocation = pincode || localStorage.getItem("localcart-location");

  const clearAllFilters = () => {
    setPriceRange("all");
    setMinRating(0);
    setSameDayOnly(false);
    setInStockOnly(false);
    updateParams({ category: null, search: null });
  };

  const hasActiveFilters =
    category !== "All" ||
    Boolean(search.trim()) ||
    priceRange !== "all" ||
    minRating > 0 ||
    sameDayOnly ||
    inStockOnly;

  const activeFiltersCount =
    (category !== "All" ? 1 : 0) +
    (search.trim() ? 1 : 0) +
    (priceRange !== "all" ? 1 : 0) +
    (minRating > 0 ? 1 : 0) +
    (sameDayOnly ? 1 : 0) +
    (inStockOnly ? 1 : 0);

  // Filter sidebar contents
  const renderSidebarContent = () => (
    <div className="space-y-6 text-sm">
      {/* Department / Category Section */}
      <div>
        <h3
          className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center justify-between"
          style={{ color: "var(--ink)" }}
        >
          <span>Department</span>
          {category !== "All" && (
            <button
              type="button"
              onClick={() => updateParams({ category: null })}
              className="text-[11px] font-bold text-[var(--rust)] hover:underline"
            >
              Clear
            </button>
          )}
        </h3>
        <ul className="space-y-1.5">
          <li>
            <button
              type="button"
              onClick={() => updateParams({ category: null })}
              className="w-full flex items-center justify-between py-1 px-2 rounded-lg text-xs transition-colors text-left cursor-pointer"
              style={{
                background:
                  category === "All" ? "var(--rust-light)" : "transparent",
                color: category === "All" ? "var(--rust)" : "var(--ink)",
                fontWeight: category === "All" ? 700 : 500,
              }}
            >
              <span>All Categories</span>
              <span className="text-[11px] opacity-60">({catalog.length})</span>
            </button>
          </li>
          {categoryList.map((catName) => {
            const isSelected = category.toLowerCase() === catName.toLowerCase();
            const count = categoryCounts[catName] || 0;
            return (
              <li key={catName}>
                <button
                  type="button"
                  onClick={() => updateParams({ category: catName })}
                  className="w-full flex items-center justify-between py-1 px-2 rounded-lg text-xs transition-colors text-left cursor-pointer"
                  style={{
                    background: isSelected
                      ? "var(--rust-light)"
                      : "transparent",
                    color: isSelected ? "var(--rust)" : "var(--ink)",
                    fontWeight: isSelected ? 700 : 500,
                  }}
                >
                  <span className="truncate">{catName}</span>
                  <span className="text-[11px] opacity-60">({count})</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Customer Reviews Section */}
      <div className="pt-4 border-t border-[var(--line)]">
        <h3
          className="text-xs font-bold uppercase tracking-wider mb-3"
          style={{ color: "var(--ink)" }}
        >
          Customer Reviews
        </h3>
        <ul className="space-y-1.5">
          {[4, 3].map((stars) => {
            const isSelected = minRating === stars;
            return (
              <li key={stars}>
                <button
                  type="button"
                  onClick={() => setMinRating(isSelected ? 0 : stars)}
                  className="w-full flex items-center gap-2 py-1 px-2 rounded-lg text-xs transition-colors text-left cursor-pointer"
                  style={{
                    background: isSelected
                      ? "var(--rust-light)"
                      : "transparent",
                    color: isSelected ? "var(--rust)" : "var(--ink)",
                    fontWeight: isSelected ? 700 : 500,
                  }}
                >
                  <div className="flex text-amber-500">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        size={13}
                        fill={i <= stars ? "currentColor" : "none"}
                        className={
                          i <= stars
                            ? "text-amber-500"
                            : "text-stone-300 dark:text-stone-600"
                        }
                      />
                    ))}
                  </div>
                  <span>&amp; Up</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Price Filter Section */}
      <div className="pt-4 border-t border-[var(--line)]">
        <h3
          className="text-xs font-bold uppercase tracking-wider mb-3"
          style={{ color: "var(--ink)" }}
        >
          Price
        </h3>
        <ul className="space-y-1.5">
          {[
            { id: "all", label: "All Prices" },
            { id: "under500", label: "Under ₹500" },
            { id: "500-1000", label: "₹500 to ₹1,000" },
            { id: "1000-3000", label: "₹1,000 to ₹3,000" },
            { id: "over3000", label: "Over ₹3,000" },
          ].map((tier) => {
            const isSelected = priceRange === tier.id;
            return (
              <li key={tier.id}>
                <button
                  type="button"
                  onClick={() => setPriceRange(tier.id as any)}
                  className="w-full flex items-center justify-between py-1 px-2 rounded-lg text-xs transition-colors text-left cursor-pointer"
                  style={{
                    background: isSelected
                      ? "var(--rust-light)"
                      : "transparent",
                    color: isSelected ? "var(--rust)" : "var(--ink)",
                    fontWeight: isSelected ? 700 : 500,
                  }}
                >
                  <span>{tier.label}</span>
                  {isSelected && <Check size={13} />}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Delivery & Stock Filters */}
      <div className="pt-4 border-t border-[var(--line)] space-y-2.5">
        <h3
          className="text-xs font-bold uppercase tracking-wider mb-2"
          style={{ color: "var(--ink)" }}
        >
          Availability
        </h3>
        <label className="flex items-center gap-2.5 text-xs font-medium cursor-pointer">
          <input
            type="checkbox"
            checked={sameDayOnly}
            onChange={(e) => setSameDayOnly(e.target.checked)}
            className="accent-[var(--rust)] rounded w-4 h-4"
          />
          <span
            className="flex items-center gap-1.5"
            style={{ color: "var(--ink)" }}
          >
            <Zap size={13} style={{ color: "var(--rust)" }} /> Same-Day Delivery
          </span>
        </label>
        <label className="flex items-center gap-2.5 text-xs font-medium cursor-pointer">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
            className="accent-[var(--rust)] rounded w-4 h-4"
          />
          <span style={{ color: "var(--ink)" }}>Exclude Out of Stock</span>
        </label>
      </div>

      {/* Clear All Filters Action */}
      {hasActiveFilters && (
        <div className="pt-4 border-t border-[var(--line)]">
          <button
            type="button"
            onClick={clearAllFilters}
            className="w-full py-2 px-3 text-xs font-bold rounded-xl border transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            style={{
              borderColor: "var(--line)",
              color: "var(--rust)",
              background: "var(--paper)",
            }}
          >
            <RotateCcw size={13} /> Reset All Filters
          </button>
        </div>
      )}
    </div>
  );

  return (
    <main
      className="page"
      style={{
        background: "var(--cream)",
        paddingTop: "20px",
        paddingBottom: "56px",
      }}
    >
      {/* Top Banner / Breadcrumb & Location */}
      <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3 pb-3 border-b border-[var(--line)]">
        <div
          className="flex items-center gap-2 text-xs"
          style={{ color: "var(--muted)" }}
        >
          <Link to="/" className="hover:underline">
            Home
          </Link>
          <span>/</span>
          <span style={{ color: "var(--ink)", fontWeight: 600 }}>Products</span>
          {category !== "All" && (
            <>
              <span>/</span>
              <span style={{ color: "var(--rust)", fontWeight: 700 }}>
                {category}
              </span>
            </>
          )}
        </div>

        <div className="flex items-center gap-3">
          <LocationBar compact />
          {currentLocation && (
            <span
              className="text-xs hidden sm:inline"
              style={{ color: "var(--muted)" }}
            >
              Delivering to <b>{currentLocation}</b>
            </span>
          )}
        </div>
      </div>

      {/* Main E-Commerce 2-Column Layout */}
      <div className="flex gap-6 items-start">
        {/* Left Column: Amazon-Style Sticky Filter Sidebar (Desktop) */}
        <aside
          className="hidden lg:block w-64 shrink-0 sticky top-24 p-5 rounded-2xl border"
          style={{
            background: "var(--paper)",
            borderColor: "var(--line)",
            boxShadow: "0 2px 14px rgba(0, 0, 0, 0.03)",
          }}
        >
          {renderSidebarContent()}
        </aside>

        {/* Right Column: Results Header, Active Filters, & Product Grid */}
        <div id="category-results" className="flex-1 min-w-0">
          {/* Amazon-Style Results Toolbar */}
          <div
            className="p-3.5 sm:p-4 rounded-2xl border mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            style={{
              background: "var(--paper)",
              borderColor: "var(--line)",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.02)",
            }}
          >
            {/* Results Headline (Amazon signature) */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold cursor-pointer"
                style={{
                  borderColor: "var(--line)",
                  background: "var(--cream)",
                  color: "var(--ink)",
                }}
              >
                <SlidersHorizontal size={13} style={{ color: "var(--rust)" }} />
                Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
              </button>

              <p
                className="text-xs sm:text-sm m-0"
                style={{ color: "var(--muted)" }}
              >
                Showing{" "}
                <b style={{ color: "var(--ink)" }}>1–{filtered.length}</b> of{" "}
                <b style={{ color: "var(--ink)" }}>{catalog.length}</b> results
                for{" "}
                <b style={{ color: "var(--rust)" }}>
                  {search
                    ? `"${search}"`
                    : category === "All"
                      ? "All Products"
                      : category}
                </b>
              </p>
            </div>

            {/* Right Controls: Search & Custom Sort */}
            <div className="flex items-center gap-2.5">
              {/* Search input with clear button */}
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 border rounded-full text-xs"
                style={{
                  borderColor: "var(--line)",
                  background: "var(--cream)",
                }}
              >
                <Search size={13} style={{ color: "var(--muted)" }} />
                <input
                  type="text"
                  placeholder="Search in catalog..."
                  value={search}
                  onChange={(e) =>
                    updateParams({ search: e.target.value }, true)
                  }
                  className="bg-transparent border-none outline-none text-xs w-28 sm:w-36"
                  style={{ color: "var(--ink)" }}
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => updateParams({ search: null })}
                    className="text-[var(--muted)] hover:text-[var(--ink)] cursor-pointer"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>

              {/* Custom Sort Select Dropdown */}
              <CustomSelect
                options={[
                  { value: "Featured", label: "Sort: Featured" },
                  { value: "Popular", label: "Avg. Customer Review" },
                  { value: "Price: low", label: "Price: Low to High" },
                  { value: "Price: high", label: "Price: High to Low" },
                  { value: "Distance: nearest", label: "Distance: Nearest First" },
                ]}
                value={sort}
                onChange={(val) => setSort(val)}
                icon={<ArrowUpDown size={12} />}
                ariaLabel="Sort products"
              />
            </div>
          </div>

          {/* Active Filter Chips Bar */}
          {hasActiveFilters && (
            <div className="flex items-center flex-wrap gap-2 mb-4">
              <span
                className="text-xs font-bold mr-1"
                style={{ color: "var(--muted)" }}
              >
                Active Filters:
              </span>
              {category !== "All" && (
                <span
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border"
                  style={{
                    background: "var(--paper)",
                    borderColor: "var(--line)",
                    color: "var(--ink)",
                  }}
                >
                  Category: <b>{category}</b>
                  <button
                    type="button"
                    onClick={() => updateParams({ category: null })}
                    className="hover:text-[var(--rust)] cursor-pointer"
                  >
                    <X size={12} />
                  </button>
                </span>
              )}
              {search.trim() && (
                <span
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border"
                  style={{
                    background: "var(--paper)",
                    borderColor: "var(--line)",
                    color: "var(--ink)",
                  }}
                >
                  Search: <b>"{search}"</b>
                  <button
                    type="button"
                    onClick={() => updateParams({ search: null })}
                    className="hover:text-[var(--rust)] cursor-pointer"
                  >
                    <X size={12} />
                  </button>
                </span>
              )}
              {priceRange !== "all" && (
                <span
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border"
                  style={{
                    background: "var(--paper)",
                    borderColor: "var(--line)",
                    color: "var(--ink)",
                  }}
                >
                  Price:{" "}
                  <b>
                    {priceRange === "under500"
                      ? "Under ₹500"
                      : priceRange === "500-1000"
                        ? "₹500 - ₹1,000"
                        : priceRange === "1000-3000"
                          ? "₹1,000 - ₹3,000"
                          : "Over ₹3,000"}
                  </b>
                  <button
                    type="button"
                    onClick={() => setPriceRange("all")}
                    className="hover:text-[var(--rust)] cursor-pointer"
                  >
                    <X size={12} />
                  </button>
                </span>
              )}
              {minRating > 0 && (
                <span
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border"
                  style={{
                    background: "var(--paper)",
                    borderColor: "var(--line)",
                    color: "var(--ink)",
                  }}
                >
                  Rating: <b>{minRating}★ &amp; Up</b>
                  <button
                    type="button"
                    onClick={() => setMinRating(0)}
                    className="hover:text-[var(--rust)] cursor-pointer"
                  >
                    <X size={12} />
                  </button>
                </span>
              )}
              {sameDayOnly && (
                <span
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border"
                  style={{
                    background: "var(--paper)",
                    borderColor: "var(--line)",
                    color: "var(--ink)",
                  }}
                >
                  <b>⚡ Same-Day Delivery</b>
                  <button
                    type="button"
                    onClick={() => setSameDayOnly(false)}
                    className="hover:text-[var(--rust)] cursor-pointer"
                  >
                    <X size={12} />
                  </button>
                </span>
              )}
              {inStockOnly && (
                <span
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border"
                  style={{
                    background: "var(--paper)",
                    borderColor: "var(--line)",
                    color: "var(--ink)",
                  }}
                >
                  <b>In Stock Only</b>
                  <button
                    type="button"
                    onClick={() => setInStockOnly(false)}
                    className="hover:text-[var(--rust)] cursor-pointer"
                  >
                    <X size={12} />
                  </button>
                </span>
              )}
              <button
                type="button"
                onClick={clearAllFilters}
                className="text-xs font-bold underline text-[var(--rust)] hover:opacity-80 ml-2 cursor-pointer"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Product Grid */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map((product) => {
                const hasDiscount = Boolean(
                  product.oldPrice && product.oldPrice > product.price,
                );
                const discountPercent = hasDiscount
                  ? Math.round((1 - product.price / product.oldPrice) * 100)
                  : 0;

                return (
                  <article
                    key={product.id}
                    className="product-card group rounded-2xl p-3.5 border transition-all duration-200 flex flex-col"
                    style={{
                      background: "var(--paper)",
                      borderColor: "var(--line)",
                      boxShadow: "0 2px 12px rgba(0, 0, 0, 0.03)",
                    }}
                  >
                    {/* Artwork Container */}
                    <div className="relative mb-3">
                      <Link
                        to={`/products/${product.id}`}
                        className="block overflow-hidden rounded-xl"
                      >
                        <ProductArtwork product={product} />
                      </Link>
                      {/* Top Badges */}
                      <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
                        {product.tag && (
                          <span
                            className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-sm"
                            style={{
                              background: "var(--ink)",
                              color: "var(--cream)",
                            }}
                          >
                            {product.tag}
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        className="heart absolute top-2.5 right-2.5 z-10 p-1.5 rounded-full bg-white/80 dark:bg-black/80 backdrop-blur-sm transition-transform active:scale-90 cursor-pointer"
                        aria-label="Save product"
                      >
                        <Heart size={15} />
                      </button>
                    </div>

                    {/* Product Metadata */}
                    <div className="flex-1 flex flex-col">
                      {/* Vendor Store & Distance */}
                      <div
                        className="text-[11px] font-medium flex items-center gap-1 mb-1 truncate"
                        style={{ color: "var(--muted)" }}
                      >
                        <Store
                          size={12}
                          className="text-[var(--rust)] shrink-0"
                        />
                        <span className="truncate">
                          {product.vendor || "Verified Local Store"}
                        </span>
                        {product.distance && <span>· {product.distance}</span>}
                      </div>
                      {product.vendorAddress && (
                        <div
                          className="text-[11px] flex items-start gap-1 mb-1"
                          style={{ color: "var(--muted)" }}
                        >
                          <MapPin size={12} className="mt-0.5 shrink-0 text-[var(--rust)]" />
                          <span className="line-clamp-2">{product.vendorAddress}</span>
                        </div>
                      )}
                      {product.vendorPhone && (
                        <a
                          href={`tel:${product.vendorPhone}`}
                          className="text-[11px] flex items-center gap-1 mb-2 hover:underline"
                          style={{ color: "var(--rust)" }}
                          onClick={(event) => event.stopPropagation()}
                        >
                          <Phone size={12} /> {product.vendorPhone}
                        </a>
                      )}

                      {/* Product Title */}
                      <Link
                        to={`/products/${product.id}`}
                        className="block mb-1.5"
                      >
                        <h3
                          className="font-bold text-sm leading-snug line-clamp-2 transition-colors group-hover:text-[var(--rust)]"
                          style={{ color: "var(--ink)", minHeight: "2.4em" }}
                        >
                          {product.name}
                        </h3>
                      </Link>

                      {/* Amazon-Style Star Rating */}
                      <div className="flex items-center gap-1.5 mb-2">
                        <div className="flex text-amber-500">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <Star
                              key={i}
                              size={12}
                              fill={
                                i <= Math.round(product.rating || 4.5)
                                  ? "currentColor"
                                  : "none"
                              }
                              className={
                                i <= Math.round(product.rating || 4.5)
                                  ? "text-amber-500"
                                  : "text-stone-300 dark:text-stone-600"
                              }
                            />
                          ))}
                        </div>
                        <span
                          className="text-xs font-bold"
                          style={{ color: "var(--ink)" }}
                        >
                          {product.rating || 4.8}
                        </span>
                        <span
                          className="text-[11px]"
                          style={{ color: "var(--muted)" }}
                        >
                          ({((product.id * 23 + 17) % 180) + 15})
                        </span>
                      </div>

                      {/* Amazon-Style Pricing Block */}
                      <div className="flex items-baseline gap-2 mb-1.5">
                        <span
                          className="text-base font-black"
                          style={{ color: "var(--ink)" }}
                        >
                          {money(product.price)}
                        </span>
                        {hasDiscount && (
                          <>
                            <del
                              className="text-xs line-through"
                              style={{ color: "var(--muted)" }}
                            >
                              {money(product.oldPrice)}
                            </del>
                            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                              ({discountPercent}% off)
                            </span>
                          </>
                        )}
                      </div>

                      {/* Prime / Express Local Delivery Line */}
                      <div
                        className="text-[11px] flex items-center gap-1 mb-3 font-medium"
                        style={{ color: "var(--muted)" }}
                      >
                        <Zap
                          size={12}
                          className="text-[var(--rust)] shrink-0"
                        />
                        <span>
                          Same-day delivery by{" "}
                          <b style={{ color: "var(--ink)" }}>Today 7 PM</b>
                        </span>
                      </div>

                      {/* Stock & Add to Bag CTA */}
                      <div className="mt-auto pt-2 border-t border-[var(--line)] flex items-center justify-between gap-2">
                        <span
                          className="text-[11px] font-semibold flex items-center gap-1"
                          style={{ color: "var(--green)" }}
                        >
                          <Check size={13} /> In Stock
                        </span>
                        <button
                          type="button"
                          onClick={() => addToCart(product)}
                          className="px-3 py-1.5 rounded-full text-xs font-bold transition-transform active:scale-95 flex items-center gap-1 cursor-pointer"
                          style={{
                            background: "var(--ink)",
                            color: "var(--cream)",
                          }}
                        >
                          <ShoppingBag size={13} /> Add to bag
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div
              className="p-12 rounded-2xl border text-center flex flex-col items-center justify-center my-6"
              style={{
                background: "var(--paper)",
                borderColor: "var(--line)",
              }}
            >
              <Search
                size={40}
                style={{ color: "var(--rust)", opacity: 0.5 }}
                className="mb-3"
              />
              <h2
                className="text-lg font-bold mb-1"
                style={{ color: "var(--ink)" }}
              >
                No products found matching your filters
              </h2>
              <p
                className="text-xs max-w-sm mb-4"
                style={{ color: "var(--muted)" }}
              >
                Try adjusting your search terms, changing the department, or
                resetting the price and review filters.
              </p>
              <button
                type="button"
                onClick={clearAllFilters}
                className="btn btn-dark text-xs py-2 px-4 cursor-pointer"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Slide-Over Filter Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div
            className="relative ml-auto w-full max-w-xs h-full p-6 flex flex-col overflow-y-auto z-10 custom-scroll"
            style={{
              background: "var(--paper)",
              color: "var(--ink)",
            }}
          >
            <div className="flex items-center justify-between pb-4 border-b border-[var(--line)] mb-4">
              <h2 className="font-bold text-base m-0">Filter Catalog</h2>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 rounded-lg hover:bg-[var(--cream)] cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {renderSidebarContent()}

            <div className="mt-8 pt-4 border-t border-[var(--line)]">
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="btn btn-dark w-full py-3 text-xs font-bold cursor-pointer"
              >
                Show {filtered.length} Results
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
