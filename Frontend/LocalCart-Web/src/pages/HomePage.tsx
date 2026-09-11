import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Store,
  Truck,
} from "lucide-react";
import { LocationBar } from "../components/common/LocationBar";
import { ProductGrid } from "../components/product/ProductGrid";
import { ProductArtwork } from "../components/product/ProductArtwork";
import { useProducts } from "../context/ProductContext";
import { money } from "../utils/formatters";

export const HomePage: React.FC = () => {
  const { catalog, categories } = useProducts();
  const featuredProducts = catalog.slice(0, 4);
  const spotlightProducts = catalog.slice(0, 3);
  const spotlightProduct = spotlightProducts[0];
  const storeCount = new Set(catalog.map((product) => product.vendor)).size;
  const categoryNames = categories.length
    ? categories.map((category) => category.categoryName)
    : Array.from(new Set(catalog.map((product) => product.category)));

  return (
    <main className="w-full flex flex-col items-center">
      {/* Hero Section (Full Width, Screen-Filling) */}
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">
            <Sparkles size={15} /> LIVE LOCAL FINDS · {catalog.length || "400"} PRODUCTS
          </span>

          <h1>
            Your neighborhood,
            <br />
            <em>in your bag.</em>
          </h1>

          <p>
            Discover verified neighbourhood stores, compare local prices, and
            get fresh goods delivered to your doorstep in hours—or ready for
            express pickup.
          </p>

          <LocationBar />

          <div className="hero-actions">
            <Link className="btn btn-dark" to="/products">
              Start exploring <ArrowRight size={17} />
            </Link>
            <Link className="btn btn-outline" to="/signup">
              <Store size={16} /> Sell locally
            </Link>
            <span className="delivery-note">
              <Truck size={20} />
              <div>
                Same-day delivery
                <small>across your neighbourhood</small>
              </div>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-6 mt-8 pt-6 border-t border-[var(--line)] text-xs text-[var(--muted)]">
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 size={15} style={{ color: "var(--green)" }} />{" "}
              Real-time Store Stock
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck size={15} style={{ color: "var(--rust)" }} /> 100%
              Verified Local Sellers
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Sparkles size={15} style={{ color: "var(--gold)" }} />{" "}
              Single-Vendor Fresh Checkout
            </span>
          </div>
        </div>

        {/* Right Column: Luxury Merchant Showcase Card */}
        <div className="hero-showcase">
          <div>
            <div className="showcase-header">
              <span className="showcase-badge">
                <Sparkles size={13} /> Live merchant spotlight
              </span>
              <span className="showcase-rating">
                <span className="font-normal text-stone-300">
                  {storeCount || 19} local stores
                </span>
              </span>
            </div>

            <div className="showcase-merchant">
              <h3>{spotlightProduct?.vendor || "Your neighborhood stores"}</h3>
              <p>
                Verified merchant · {spotlightProduct?.vendorPincode || "nearby"} ·
                Live stock today
              </p>
            </div>

            <div className="showcase-items">
              {spotlightProducts.map((product) => (
                <Link
                  key={product.id}
                  to={`/products/${product.id}`}
                  className="showcase-item"
                >
                  <div className="showcase-item-info">
                    <div className="showcase-item-icon">
                      {product.image ? (
                        <ProductArtwork product={product} />
                      ) : (
                        <ShoppingBag size={18} />
                      )}
                    </div>
                    <div>
                      <div className="showcase-item-name">{product.name}</div>
                      <div className="showcase-item-sub">
                        {product.category} · {product.stock || 0} in stock
                      </div>
                    </div>
                  </div>
                  <div className="showcase-item-price">{money(product.price)}</div>
                </Link>
              ))}
            </div>
          </div>

          <div className="showcase-footer">
            <span className="showcase-status">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              Open now · {storeCount || 19} stores nearby
            </span>
            <Link
              to="/products"
              className="text-xs text-amber-300 hover:text-amber-200 inline-flex items-center gap-1 font-semibold"
            >
              Browse Shop <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>

      {/* Live product shelf: the first shopping action after the hero */}
      <section className="section deals-section home-live-products">
        <div className="section-heading">
          <div>
            <span className="kicker">LIVE FROM LOCAL STORES</span>
            <h2>What is nearby right now.</h2>
            <p className="section-subtitle">
              Real products, live stock, and prices from verified neighborhood stores.
            </p>
          </div>
          <Link to="/products" className="inline-flex items-center gap-1">
            See the full catalog <ArrowRight size={16} />
          </Link>
        </div>
        {featuredProducts.length > 0 ? (
          <ProductGrid products={featuredProducts.slice(0, 8)} />
        ) : (
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            Loading nearby products...
          </p>
        )}
      </section>

      {/* Browse by Categories (Full Width) */}
      <section className="section category-section">
        <div className="section-heading">
          <div>
            <span className="kicker">SHOP BY CATEGORY</span>
            <h2>Pick a category.</h2>
          </div>
          <Link to="/products">
            See all categories <ArrowRight size={16} />
          </Link>
        </div>

        <div className="category-list">
          {categoryNames.map((categoryName) => (
            <Link
              to={`/products?category=${encodeURIComponent(categoryName)}#category-results`}
              className="category-item"
              key={categoryName}
            >
              <div className="category-icon">
                <ShoppingBag size={22} />
              </div>
              <b>{categoryName}</b>
              <small>
                Explore items <ArrowRight size={12} />
              </small>
            </Link>
          ))}
        </div>
      </section>

      {/* More Deals & Nearby Favorites Grid (Full Width) */}
      <section className="section deals-section">
        <div className="section-heading">
          <div>
            <span className="kicker">NEARBY FAVORITES</span>
            <h2>Good things, close by.</h2>
          </div>
          <Link to="/products">
            Shop all products <ArrowRight size={16} />
          </Link>
        </div>

        <ProductGrid products={catalog.slice(8, 16)} />
      </section>

    </main>
  );
};
