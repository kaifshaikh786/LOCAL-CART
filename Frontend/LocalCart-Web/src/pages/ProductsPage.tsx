import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Filter, RotateCcw, Search, Sparkles } from "lucide-react";
import { LocationBar } from "../components/common/LocationBar";
import { ProductGrid } from "../components/product/ProductGrid";
import { useProducts } from "../context/ProductContext";
import { CATEGORIES } from "../data/mockData";

export const ProductsPage: React.FC = () => {
  const { catalog } = useProducts();
  const [params, setParams] = useSearchParams();

  const search = params.get("search") ?? "";
  const category = params.get("category") ?? "All";
  const pincode = params.get("pincode") ?? "";
  const [sort, setSort] = useState("Featured");

  const filtered = catalog
    .filter((product) => {
      const matchesCategory =
        category === "All" || product.category === category;
      const matchesSearch =
        !search ||
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.vendor.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sort === "Price: low") return a.price - b.price;
      if (sort === "Price: high") return b.price - a.price;
      if (sort === "Popular") return b.rating - a.rating;
      return b.id - a.id;
    });

  const currentLocation = pincode || localStorage.getItem("localcart-location");

  return (
    <main className="page">
      {/* Page Header */}
      <div className="page-intro">
        <span className="kicker">
          <Sparkles size={14} /> THE NEIGHBOURHOOD CATALOG
        </span>
        <h1>Shop the neighborhood.</h1>
        <p>
          Compare prices, verify live store inventory, and support verified
          merchants right in your locality.
        </p>

        <LocationBar />

        <div className="flex items-center gap-3 mt-3 text-xs text-slate-500">
          <span>
            📍{" "}
            {currentLocation
              ? `Showing stores delivering to ${currentLocation}`
              : "Enter your pincode above for exact store distances"}
          </span>
          {currentLocation && (
            <button
              type="button"
              className="text-orange-600 dark:text-orange-400 underline font-semibold"
              onClick={() => {
                localStorage.removeItem("localcart-location");
                setParams({});
              }}
            >
              Reset location
            </button>
          )}
        </div>
      </div>

      {/* Filter & Sort Bar */}
      <div className="filter-bar">
        {/* Category Chips */}
        <div className="chips">
          <button
            type="button"
            className={category === "All" ? "selected" : ""}
            onClick={() => setParams(search ? { search } : {})}
          >
            All Products
          </button>
          {CATEGORIES.map((item) => (
            <button
              type="button"
              className={category === item.label ? "selected" : ""}
              onClick={() =>
                setParams(
                  search
                    ? { category: item.label, search }
                    : { category: item.label },
                )
              }
              key={item.label}
            >
              <span>{item.icon}</span> {item.label}
            </button>
          ))}
        </div>

        {/* Results Count & Sort Dropdown */}
        <div className="flex items-center gap-4">
          <span className="text-xs font-semibold text-slate-500 hidden sm:inline">
            Showing <b>{filtered.length}</b>{" "}
            {filtered.length === 1 ? "item" : "items"}
          </span>

          <div className="flex items-center gap-2 border border-slate-200 dark:border-slate-700 rounded-full px-3 py-1.5 bg-white dark:bg-slate-800 text-xs">
            <Filter size={14} className="text-slate-400" />
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              aria-label="Sort products"
              className="bg-transparent border-none outline-none font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
            >
              <option value="Featured">Sort: Featured</option>
              <option value="Popular">Sort: Highest Rated</option>
              <option value="Price: low">Sort: Price (Low to High)</option>
              <option value="Price: high">Sort: Price (High to Low)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Search Filter Pill */}
      {search && (
        <div className="flex items-center gap-2 mb-6 text-sm text-slate-600 dark:text-slate-300">
          <span>
            Search results for: <b>"{search}"</b>
          </span>
          <button
            type="button"
            className="inline-flex items-center gap-1 text-xs text-orange-600 dark:text-orange-400 font-bold ml-2 underline"
            onClick={() => setParams(category !== "All" ? { category } : {})}
          >
            <RotateCcw size={12} /> Clear search
          </button>
        </div>
      )}

      {/* Product Results */}
      {filtered.length > 0 ? (
        <ProductGrid products={filtered} />
      ) : (
        <div className="empty-state">
          <Search size={36} />
          <h2>No local finds matching your criteria</h2>
          <p>
            We couldn't find any products for this category or search query in
            your neighborhood.
          </p>
          <button
            type="button"
            className="btn btn-dark"
            onClick={() => setParams({})}
          >
            Clear all filters
          </button>
        </div>
      )}
    </main>
  );
};
